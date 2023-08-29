---
section: guides
title: Getting Started with Gitpod Dedicated - Gitpod Dedicated docs
---

# Getting Started with Gitpod Dedicated

> ℹ️ You will need to have familiarity with AWS, specifically CloudFormation, in order to be able to execute this guide.

Currently, Gitpod Dedicated is only available in the following AWS regions:

-   `us-east-1`
-   `us-east-2`
-   `us-west-2`
-   `ap-northeast-1`
-   `ap-southeast-2`
-   `eu-west-1`
-   `eu-central-1`

## 0. Prerequisites

Here's a list of what you'll need to get started with Gitpod Dedicated.

-   **An empty AWS account.** There should be no other resources, EC2 instances, containers, functions or applications running in the account. If your company requires security policies or roles to be present in new accounts please review them with a Gitpod Engineer to ensure there are no items that will block Gitpod Dedicated from running.
-   **Private network address ranges.** Provide a list of network CIDR ranges to your Gitpod engineer to ensure that traffic is routed correctly to internal resources. This list should include the network address space for any internal or on-premise networks that developers will need to access from their Gitpod workspaces.
-   **List of resources developers require to build and test.** This should include any external databases, APIs, PaaS endpoints, cloud resources and anything else that your developers need to build and test their code. Review this list with your Gitpod engineer to ensure the right architecture is set up for your installation. Gitpod Dedicated has four supported modes - public, private, mixed public, and mixed private. We will help you choose the right mode for your environment.
-   **The ability to run an AWS Cloudformation template.** The Gitpod Dedicated installer is provided as a set of Cloudformation templates. These should be run by a user with Administrator level access to the AWS account. We do not support running the Cloudformation template through terraform. You may run the Cloudformation templates either in the AWS Console (recommended) or via the AWS CLI (expert).
-   **Optional - AWS Transit Gateway.** For private, mixed private, and mixed public installations you will create a transit gateway attachment that allows workspaces to connect to private resources on your network. Work with your Gitpod engineer to get this set up correctly.

## 1. Set up an AWS Account for Gitpod Dedicated

> ⚠️ Gitpod Dedicated requires its own independent AWS account. It is not intended to run alongside other components in a shared or existing AWS account.

Create a new AWS account following the steps in [the AWS documentation](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_accounts_create.html). Start by navigating to the AWS console and creating the account as a subaccount in your AWS organization.

Ensure that the account meets the following quota requirements in the region where Gitpod Dedicated will be installed. AWS quota increases may take up to a day to be approved, so make sure you do this step first.

> ℹ️ Tip: You can run our [AWS preflight check script](https://gist.github.com/scarolan/65895bd22a9acc1738229495ea354326) to automatically request the required quota increases. This script requires the AWS CLI to be installed and configured. You may also run it from AWS Cloudshell, where the AWS CLI is preinstalled.

You can also request the quota updates in the AWS Console. Visit the correct quota increase page for your region. For example this link goes to us-west-2. Replace the region with your own, search for each Service type below, and request an increase to the new value. _On most new AWS accounts you will only need to increase the Elastic IPs and Lambda executions._

https://us-west-2.console.aws.amazon.com/servicequotas/home/services

|                  Service                  |                               Name                               | Value |                                                                                                                                                                                                                                                        Reasoning                                                                                                                                                                                                                                                         |
| :---------------------------------------: | :--------------------------------------------------------------: | :---: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| Amazon Elastic Compute Cloud (Amazon EC2) |                       EC2-VPC Elastic IPs                        |  20   | Gitpod requires 3 IP addresses for each load balancer (Gitpod has 2 load balancers, one for meta and one for the workspace cluster). Additionally, 3 IPs are needed for each NAT gateway (Gitpod has 3 VPCs, so 3x). Therefore, at a minimum, 15 IPs are needed. The additional 5 act as a buffer in case a new load balancer needs to be provisioned and runs in parallel to the old one, ensuring a smooth transition. For more information, please see [Architecture](/docs/gitpod-dedicated/reference/architecture). |
| Amazon Elastic Compute Cloud (Amazon EC2) | Running On-Demand Standard (A, C, D, H, I, M, R, T, Z) Instances |  256  |                                                                                                                                    This value depends on the number of concurrent developers using the instance. 256 the minimum recommended setting and is suitable for proof-of-value trials. Consult with your engineer on an appropriate setting for your expected usage levels.                                                                                                                                     |
|                AWS Lambda                 |                      Concurrent Executions                       | 1024  |                                                                                                                                                            To ensure Gitpod can install and operate properly, the default concurrent execution quota should be increased to 1024. Increasing the quota to 1024 guarantees that Gitpod will function properly.                                                                                                                                                            |
| Amazon Virtual Private Cloud (Amazon VPC) |                         VPCs per Region                          |   4   |                                                                                                                                               Gitpod Dedicated requires four VPCs. One is the default VPC that comes pre-installed in new accounts. The Gitpod Dedicated platform runs in a second VPC. The other two VPCs are reserved for upcoming feature enhancements.                                                                                                                                               |

When your request has been approved verify that you have at least 20 Elastic IPs and 1024 concurrent Lambdas enabled. The screenshots below show how these limits look after they've been raised.

<details>
  <summary>Click to view screenshot: Elastic IPs</summary>
  <img src="assets/20230823_124325_elastic_ips.png" alt="Elastic IPs Screenshot">
</details>

<details>
  <summary>Click to view screenshot: Lambdas</summary>
  <img src="assets/20230823_124350_lambdas.png" alt="Lambdas Screenshot">
</details>

<br>

Ensure that you allow for cross-account and cross-region communication with `eu-central-1`. For example, this could be restricted by [SCPs](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html) such as a [Region deny SCP](https://docs.aws.amazon.com/controltower/latest/userguide/region-deny.html). To roll out updates to the application, an AWS Lambda function pulls several configurations from a known S3 bucket owned by Gitpod. This bucket is hosted in the Gitpod Dedicated control plane located in the `eu-central-1` region.

## 2. Execute two CloudFormation templates

> ℹ️ Notify your Gitpod account manager if you want an overview of what is installed and configured by the Cloudformation templates. You may share these templates with your security and network teams if approval is required. Please see [AWS IAM permission requirements](/docs/gitpod-dedicated/reference/AWS-IAM-permission-requirements) for information on the permissions needed.

Follow the process below to acquire and install your Cloudformation templates:

**Provide information**: A Gitpod account manager will ask for information needed to generate the CloudFormation template that will be used to bootstrap the infrastructure for your Gitpod instance. See [Networking and Data flows](/docs/gitpod-dedicated/reference/networking-data-flows) for general guidance and requirements on which services Gitpod needs to be able to route to. <br/>The information required depends on the choice of networking mode:

<details class="ml-4">

<summary class="text-body text-p-medium mt-micro">All Private Networking Mode</summary>

1. `Subdomain` of your Gitpod installation. The full domain will be `<subdomain>.gitpod.cloud` unless a custom domain is used (see below).

<div style="margin: 0 40px; border: 1px solid #FFAB00; border-radius: 8px; padding: 10px; margin-bottom: 15px;">
  <details class="ml-8">
    <summary class="text-body text-p-medium mt-micro">📝 Note on compliance and privacy:</summary>
    Depending on your compliance and regulatory requirements, you may want to avoid including your company name in the URL. Although efforts are taken to minimize any exposure, avoiding using the company name can further increase confidentiality and reduce exposure risk.
  </details>
</div>

2. `AWS account ID` of the empty account you created in the previous section.
3. `AWS region` where Gitpod will be installed. See [above](/docs/gitpod-dedicated/guides/getting-started#:~:text=Currently%2C%20Gitpod%20Dedicated%20is%20only%20available%20in%20the%20following%20AWS%20regions%3A) for available regions.
4. `Relay CIDR range`: The small part of the Gitpod Dedicated VPC that needs to be routable from your network. This is called the **relay subnet** and it attaches to your Transit Gateway (see below). See [Networking and Data flows](/docs/gitpod-dedicated/reference/networking-data-flows) for more details and a networking diagram.

<div style="margin: 0 40px; border: 1px solid #FFAB00; border-radius: 8px; padding: 10px; margin-bottom: 15px;">
  <details class="ml-8">
  <summary class="text-body text-p-medium mt-micro">📝 Please consider the following points when choosing this range:</summary>
  <ul>
    <li>The only restriction in place is that the `Relay CIDR range` must be `/25` and not in the range `100.64.0.0/10` (the parent range used by Gitpod).</li>
    <li>The `Relay CIDR range` <strong>must not overlap with any of your internal services that Gitpod needs to communicate with.</strong> For example, your source code repository, SSO provider, or package repositories.</li>
    <li>The `Relay CIDR range` must be routable from your source code repository (SCM) server for <a href="/docs/configure/projects/prebuilds">Prebuilds</a> to work. Prebuilds are powered by webhooks, so Gitpod must be able to get notifications of changes to your code repos to trigger prebuilds.</li>
  </ul>
</details>
</div>

5. `transitGatewayID` of your Transit Gateway. Network traffic to your internal resources will be routed through a new transit gateway attachment. Gitpod Dedicated control plane traffic does not route through the transit gateway, it is reserved for your internal traffic. See [Networking and Data flows](/docs/gitpod-dedicated/reference/networking-data-flows) for more information.

<div style="margin: 0 40px; border: 1px solid #FFAB00; border-radius: 8px; padding: 10px; margin-bottom: 15px;">
<details class="ml-8">
<summary class="text-body text-p-medium">📝 Note on auto propagation:</summary>

<div class="ml-4">
When using auto-propagation by default, delete the propagation from your Transit Gateway Routetable associated with the Gitpod Transit Gateway Attachment and replace it with a static route pointing the Relay CIDR range (/25) to the Gitpod Transit Gateway Attachment ID. This ensures only the required relay range is shared on your Transit Gateway network and no other routes are accidentally broadcast.
</div>

</details>
</div>

6. `expose public services` : This optional feature may be enabled to expose webhooks and Identity Provider (IDP) services on public endpoints. The added API gateway does not expose your entire instance to the public Internet. This can be helpful for connecting to OIDC providers such as Okta, Azure AD. This option also makes it easy for developers to connect to your instance without having to route through a VPN or transit gateway.

</details>
<details class="ml-4">

<summary class="text-body text-p-medium mt-micro">Mixed with Private Ingress Networking Mode</summary>

1. Subdomain of your Gitpdod installation. The full domain will be `<subdomain>.gitpod.cloud` unless a custom domain is used (see below).

<details class="ml-8">

<summary class="text-body text-p-medium mt-micro">Please note: </summary>

<div class="ml-4">

Depending on your compliance and regulatory requirements, you may want to avoid including your company name in the URL. Although efforts are taken to minimize any exposure, avoiding using the company name can further increase confidentiality and reduce exposure risk.

</div>

</details>

2. `AWS account ID` of the account created above, in which Gitpod will be installed into.
3. `AWS region` in which Gitpod will be installed. See [above](/docs/gitpod-dedicated/guides/getting-started#:~:text=Currently%2C%20Gitpod%20Dedicated%20is%20only%20available%20in%20the%20following%20AWS%20regions%3A) for available regions.
4. `CIDR range of your network`, i.e. the IP address space used by your company network that you want workspaces to be able to route to. At the very least, provide the relevant ranges that you want Gitpod to be able to interact with. This helps Gitpod ensure there are no possible IP conflicts with CIDR ranges used internally in the Gitpod instance (`100.70.0.0/16`, part of CGNAT range). Note that this internal Gitpod range does not need to be routable from your network. For more information on Gitpod’s networking setup, please refer to [Networking and Data flows](/docs/gitpod-dedicated/reference/networking-data-flows) for a networking diagram.

5. `Relay CIDR range`: The small part of the Gitpod Dedicated VPC that needs to be routable from your network. This is called the **relay subnet** and it attaches to your Transit Gateway (see below). See [Networking and Data flows](/docs/gitpod-dedicated/reference/networking-data-flows) for more details and a networking diagram.

<details class="ml-8">

<summary class="text-body text-p-medium mt-micro">Please consider the following points when choosing this range:</summary>

-   The only restriction in place is that the `Relay CIDR range` must be `/25` and not in the range `100.64.0.0/10` (the parent range used by Gitpod).
-   The `Relay CIDR range` **must not overlap with any of your internal services that Gitpod needs to communicate with.**! For example, your source code repository, SSO provider or package repositories.
-   The `Relay CIDR range` must be routable from your source code repository (SCM) server for [Prebuilds](/docs/configure/projects/prebuilds) to work. Prebuilds are powered by webhooks so Gitpod must be able to get notifications of changes to your code repos to trigger prebuilds.

</details>

6. `transitGatewayID` of your Transit Gateway. Network traffic to your internal resources will be routed through a new transit gateway attachment. Gitpod Dedicated control plane traffic does not route through the transit gateway, it is reserved for your internal traffic. See [Networking and Data flows](/docs/gitpod-dedicated/reference/networking-data-flows) for more information.

<details class="ml-8">
<summary class="text-body text-p-medium">Please note:</summary>

<div class="ml-4">
When using auto-propagation by default, delete the propagation from your Transit Gateway Routetable associated with the Gitpod Transit Gateway Attachment and replace it with a static route pointing the Relay CIDR range (/25) to the Gitpod Transit Gateway Attachment ID. This ensures only the required relay range is shared on your Transit Gateway network and no other routes are accidentally broadcast.
</div>

</details>

7. `expose public services` : This optional feature may be enabled to expose webhooks and Identity Provider (IDP) services on public endpoints. The added API gateway does not expose your entire instance to the public Internet. This can be helpful for connecting to OIDC providers such as Okta, Azure AD. This option also makes it easy for developers to connect to your instance without having to route through a VPN or transit gateway.

</details>
<details class="ml-4">

<summary class="text-body text-p-medium mt-micro">Mixed with Public Ingress Networking Mode</summary>

1. Subdomain of your Gitpdod installation. The full domain will be `<subdomain>.gitpod.cloud` unless a custom domain is used (see below).

<details class="ml-8">

<summary class="text-body text-p-medium mt-micro">Please note: </summary>

<div class="ml-4">

Depending on your compliance and regulatory requirements, you may want to avoid including your company name in the URL. Although efforts are taken to minimize any exposure, avoiding using the company name can further increase confidentiality and reduce exposure risk.

</div>

</details>

2. `AWS account ID` of the account created above, in which Gitpod will be installed into.
3. `AWS region` in which Gitpod will be installed. See [a](/docs/gitpod-dedicated/guides/getting-started#:~:text=Currently%2C%20Gitpod%20Dedicated%20is%20only%20available%20in%20the%20following%20AWS%20regions%3A)bove for available regions.
4. `CIDR range of your network`, i.e. the IP address space used by your company network that you want workspaces to be able to route to. At the very least, provide the relevant ranges that you want Gitpod to be able to interact with. This helps Gitpod ensure there are no possible IP conflicts with CIDR ranges used internally in the Gitpod instance (`100.70.0.0/16`, part of CGNAT range). Note that this internal Gitpod range does not need to be routable from your network. For more information on Gitpod’s networking setup, please refer to [Networking and Data flows](/docs/gitpod-dedicated/reference/networking-data-flows) for a networking diagram.

5. `Relay CIDR range`: This is the small part of the VPC of the Gitpod instance that needs to be routable from your network. This part is called the relay subnet and it contains the NATs and attaches to your Transit Gateway (see below). See [Networking and Data flows](/docs/gitpod-dedicated/reference/networking-data-flows) for more details and a networking diagram.

<details class="ml-8">
<summary class="text-body text-p-medium">Please consider the following points when choosing this range:</summary>

-   The only restriction in place is that the `Relay CIDR range` must be `/25` and not in the range `100.64.0.0/10` (the parent range used by Gitpod).
-   The chosen `Relay CIDR range` must not overlap with any services you wish to route to or from Gitpod, e.g. your source code repository, SSO provider or package repositories.
-   [Prebuilds](/docs/configure/projects/prebuilds) will not be triggered automatically if your Source Control Management system (e.g. Github) cannot send web hooks to the Gitpod instance, i.e. is able to route to this CIDR range.

</details>

6. `transitGatewayID` of the Transit Gateway you want your Gitpod instance’s VPC to connect (attach) to. All traffic that is not going to the Dedicated Control Plane will be routed through a newly created transit gateway attachment attached to the Transit Gateway with this ID. See [Networking and Data flows](/docs/gitpod-dedicated/reference/networking-data-flows) for more details and a networking diagram.

<details class="ml-8">
<summary class="text-body text-p-medium">Please note:</summary>

<div class="ml-4">

When using auto-propagation by default, delete the propagation from your Transit Gateway Routetable associated with the Gitpod Transit Gateway Attachment and replace it with a static route pointing `the Relay CIDR range` (`/25`) to the Gitpod Transit Gateway Attachment ID. This ensures only the required relay range is shared on your Transit Gateway network and no other routes are accidentally broadcast.

</div>

</details>

</details>
<details class="ml-4">

<summary class="text-body text-p-medium my-micro">All Public Networking Mode</summary>

1. Subdomain of your Gitpdod installation. The full domain will be `<subdomain>.gitpod.cloud` unless a custom domain is used (see below).

<details class="ml-8">

<summary class="text-body text-p-medium mt-micro">Please note: </summary>

<div class="ml-4">

Depending on your compliance and regulatory requirements, you may want to avoid including your company name in the URL. Although efforts are taken to minimize any exposure, avoiding using the company name can further increase confidentiality and reduce exposure risk.

</div>

</details>

2. `AWS account ID` of the account created above, in which Gitpod will be installed into.
3. `AWS region` in which Gitpod will be installed. See [a](/docs/gitpod-dedicated/guides/getting-started#:~:text=Currently%2C%20Gitpod%20Dedicated%20is%20only%20available%20in%20the%20following%20AWS%20regions%3A)bove for available regions.

</details>

### Special Situations

The information required further depends on whether the choice of using an allowlist and custom domain:

<details class="ml-4">

<summary class="text-body text-p-medium mt-micro">When using an Allowlist</summary>

The allowlist will apply to all inbound traffic to the Gitpod Dedicated Instance. In addition to the above, the following information is required:

-   `allowlist` of IPs or CIDR ranges that should be allowed to access the instance. Any CIDRs provided in the `CIDR range of your network` above are always allowed. Example:

    ```
    allowListIPs:
        - 32.45.67.4/32
        - 32.45.67.18/32
    ```

</details>

<details class="ml-4">

<summary class="text-body text-p-medium my-micro">When using a Custom Domain</summary>

Please see [Using Custom Domains](/docs/gitpod-dedicated/guides/using-custom-domains) for more information about using a custom domains. In addition to the above, the following information is required:

-   `domainName` that is to be used
-   `ARN of the certificate` to be used

</details>

<!-- <details class="ml-4">

<summary class="text-body text-p-medium my-micro">When using certificates signed by a custom or private Certificate Authority</summary>

Please see [Using a Custom or Private CA](/docs/gitpod-dedicated/guides/using-custom-or-private-CA) for more information about using custom domains. In addition to the above, the following information is required:

-   `ARN of the Custom CA certificate` that is stored in secrets manager

</details> -->

## Receive your Cloudformation Templates

You will need to execute two CloudFormation templates to install the infrastructure and subsequently Gitpod Dedicated. The `infrastructure-creation-role-template.json` is used to create an IAM role that is assumed during the execution of the subsequent `<customer>-gitpod-template.json` CloudFormation template (shared with you by your Gitpod Account manager). The `<customer>-gitpod-template.json` CloudFormation template installs the infrastructure for Gitpod Dedicated.

Both of these templates will be provided by your Gitpod Account Manager.

</details>

### Execute CloudFormation templates

> ⚠️ Do not modify the CloudFormation templates outside of adding AWS resource tags. Doing so will likely result in a failed installation.

<div class="ml-6">

1. First, execute the `infrastructure-creation-role-template.json` template in the Gitpod Dedicated AWS account: <br/>

<details class="ml-8">

<summary>During the "configure stack options" step, ensure you select the "roll back all the stack resources" option under "Stack failure options":</summary>

![Stack Options](/images/docs/gitpod-dedicated/guides/getting-started/stackoptions.webp)

</details>

<details class="ml-8 mt-macro">

<summary>Troubleshooting</summary>

In the rare case that the template has an error during execution, it is advised to remove all existing resources before trying again. See [Deleting your Gitpod installation](/docs/gitpod-dedicated/guides/deleting-your-gitpod-installation).

</details>

2. Then, execute `<customer>-gitpod-template.json` that will be shared by your Gitpod account manager in the same AWS account. This will create the infrastructure that Gitpod Dedicated requires.

> ℹ️ During the “configure stack options” step, select the role created by the first CloudFormation template (`GitpodSetupAndInitialEKSUserAdmin`) as the role used for permissions. Depending on timing, you may need to manually select the role using its ARN. Again, select the “roll back all the stack resources” option.
>
> ![IAM Permissions](/images/docs/gitpod-dedicated/guides/getting-started/iam-perms-configs.webp)
>
> <details>
>
> <summary class="mt-micro text-important text-p-medium">Critical steps to consider when executing the <code>[customer]-gitpod-template.json</code> CloudFormation template:</summary>
>
> <div class="ml-4">
>
> 1. Before executing the CloudFormation template, you need to ensure the Transit Gateway that the Gitpod instance attaches to is able to accept attachment requests. For this, the Transit Gateway needs to be shared using AWS Resource Access Manager (RAM) to allow for other AWS accounts in your Organization to send attachment requests for approval. More info on Transit Gateway attachments can be found here.
> 2. Execute the CloudFormation template
>
> <div class="bg-[#fbecdd] rounded-xl p-micro mt-micro">⚠️ During the execution of the CloudFormation template, a Transit Gateway attachment to the Transit Gateway defined above is initiated. If you do not have resource sharing policies for this or auto accept turned on, you will have to manually accept this attachment request.</div>
>
> </div>
>
> <details class="ml-4">
>
> <summary class="mt-micro text-important text-p-medium">Flow to manually approve the attachment request</summary>
>
> <div class="bg-[#fdebec] rounded-xl p-micro my-micro ml-4">❗️ Transit Gateway Attachment approval needs to happen with urgency, else the CloudFormation will fail.
> </div>
>
> <div class="ml-4">
> Navigate to the AWS account the Transit Gateway attachment is in and navigate to the Transit Gateway Attachments page. Within 5 minutes of starting the CloudFormation execution, you should see a pending attachment in which you have limited time to approve else stack creation fails. Find out more in the AWS documentation.
>
> </div>
>
> </details>
>
> 3. In the rare case that the template has an error during execution, it is worth removing existing resources before trying again. See [Deleting your Gitpod installation](/docs/gitpod-dedicated/guides/deleting-your-gitpod-installation).
>
> </details>

4. Instance will install Gitpod: After the infrastructure has been created, the instance will register itself with the Gitpod Dedicated Control plane. It will then ask for the newest version of Gitpod, and install it onto the created infrastructure.

</div>

Please see [Deployment and Updates](/docs/gitpod-dedicated/background/deployment-updates) for more background information around how deployment subsequent operations of Gitpod Dedicated function.

## 3. Setup Gitpod

Gitpod is now ready to be setup. Your Gitpod account manager will provide the URL to access it. This URL will contain a one time admin password. This is used to authenticate when no Single Sign-On (SSO) has been set up yet.

You are three steps away from launching your first Gitpod workspace:

<details class="ml-2">

<summary class="text-body text-medium mt-micro font-bold">Name your organization</summary>

<div class="ml-2 mt-micro">

We suggest your company name, but you know best. Don’t worry you can always change this later. For example, if the name of your company was “Amazing Co.”

![Name your organization](/images/docs/gitpod-dedicated/guides/getting-started/sso-name-org.webp)

It will appear in Gitpod like this:

![Preview in Gitpod Dashboard](/images/docs/gitpod-dedicated/guides/getting-started/sso-gitpod-org-name.webp)

</div>

</details>

<details class="ml-2">

<summary class="text-body text-medium mt-micro font-bold">Configure Single Sign-On</summary>

<div class="ml-2 mt-micro">

Gitpod Dedicated requires OpenID Connect (OIDC) for authentication, for example with Identity Providers (IdP) such as Google, Okta or Azure AD.

**General instructions**

-   You will need to create a configuration with your Identity Provider and provide the “redirect URI” you can copy from this screen.
-   Once you’ve created your Identity Provider configuration, you should copy and paste the Issuer URL, Client ID and Client Secret values on this screen.
-   Clicking “Verify SSO Configuration” will ensure that validity of the values by authenticating your account. If successful, your user will be created and configured with the “owner” role. Subsequent users that log in will be granted the default “member” role.

    ![Configure Single Sign-on](/images/docs/gitpod-dedicated/guides/getting-started/configure-sso-gitpod.webp)

**Identity Provider specific instructions**

<details>

<summary class="text-body font-semibold text-p-medium">Okta</summary>

<div class="ml-6 mt-macro">

As _prerequisites_, you will need the following:

-   Access to your Okta instance
-   Permission to create an [app integration](https://help.okta.com/oie/en-us/Content/Topics/Apps/apps-overview-get-started.htm)

_Creating a Gitpod SSO Integration_

1. On the Okta Admin dashboard, navigate to Applications
2. Select `Create App Integration`

    ![Applications - Okta Dashboard](/images/docs/gitpod-dedicated/guides/getting-started/sso/okta/okta-dashboard.webp)

3. Select the following options and click `Next`

    - Sign-in method: `OIDC - Open ID Connect`
    - Application type: `Web Application`

    ![Create App Integration - Okta Dashboard](/images/docs/gitpod-dedicated/guides/getting-started/sso/okta/create-app-integration.webp)

4. Specify General Settings

    - App integration name: `Gitpod` (or choose your own name)
    - Sign-in redirect URIs: _copy this value from your Gitpod setup screen_ (see [details](/docs/gitpod-dedicated/guides/getting-started#:~:text=or%20Azure%20AD.-,General%20instructions,-You%20will%20need) above under "General instructions")
    - Sign-out redirect URIs: `none`
    - Trusted Origins: `none`
    - Assignments: _choose option appropriate to your organization_

    ![Specify Okta settings - Okta Dashboard](/images/docs/gitpod-dedicated/guides/getting-started/sso/okta/specify-general-settings.webp)

5. Obtain Client ID & Client Secret

    - Copy the `Client ID` and use it as input in Gitpod setup (see [details](/docs/gitpod-dedicated/guides/getting-started#:~:text=or%20Azure%20AD.-,General%20instructions,-You%20will%20need) above under "General instructions")
    - Copy `Client Secret` and use it as input in Gitpod setup (see [details](/docs/gitpod-dedicated/guides/getting-started#:~:text=or%20Azure%20AD.-,General%20instructions,-You%20will%20need) above under "General instructions")
    - Set the `Issuer` to your Okta instance, eg: `https://amazingco.okta.com/`

    ![Configure Client Secrets - Okta Dashboard](/images/docs/gitpod-dedicated/guides/getting-started/sso/okta/client-configs-okta.webp)

6. Continue with Gitpod SSO Configuration verification: [Clicking “Verify SSO Configuration”](/docs/gitpod-dedicated/guides/getting-started#:~:text=or%20Azure%20AD.-,General%20instructions,-You%20will%20need)

</div>

</details>

<details class="mt-macro">

<summary class="text-body font-semibold text-p-medium">Google</summary>

<div class="ml-6 mt-macro">

_As prerequisites_ you will need the following:

-   Access to setup a new [API Credentials](https://console.cloud.google.com/apis/credentials) in your GCP Account

_Creating a Gitpod SSO Integration_

1. Navigate to your Google Cloud Console, API Credentials
2. Select Create Credentials, and choose OAuth client ID

    ![Create credentials - Google Cloud Dashboard](/images/docs/gitpod-dedicated/guides/getting-started/sso/google/create-credentials.webp)

3. Configure your OAuth Client ID, by specifying the Authorized Redirect URIs: [Once you’ve created your Identity Provider configuration, you should copy...](/docs/gitpod-dedicated/guides/getting-started#:~:text=or%20Azure%20AD.-,General%20instructions,-You%20will%20need)
4. Obtain the Client ID & Client Secret and input these into your Gitpod Setup page

    ![OAuth Client Created - Google Cloud Dashboard](/images/docs/gitpod-dedicated/guides/getting-started/sso/google/OAuth-client-created.webp)

5. Set Provider's Issuer URL to `https://accounts.google.com`
6. Proceed to verify the integration on the Gitpod setup page: [Clicking “Verify SSO Configuration”](/docs/gitpod-dedicated/guides/getting-started#:~:text=or%20Azure%20AD.-,General%20instructions,-You%20will%20need)

</div>

</details>

<details class="mt-macro">

<summary class="text-body font-semibold text-p-medium">Azure AD</summary>

<div class="ml-6 mt-macro">

_As_ _prerequisites_ you will need the following:

-   Access to Azure Directory, to Register an Application

_Creating a Gitpod SSO Integration_

1. Navigate to your Azure portal > App Registrations
2. Select New Registration

    ![New registration - Azure AD Dashboard](/images/docs/gitpod-dedicated/guides/getting-started/sso/azure/new-registration.webp)

3. Name your application - e.g. Gitpod
4. Select supported account types depending on your organizational needs. Most likely you want _Accounts in this organizational directory only_
5. Copy the redirect URL from the Gitpod SSO setup page and set it as the Redirect URI, selecting Web as the application type

    ![Register Application - Azure AD Dashboard](/images/docs/gitpod-dedicated/guides/getting-started/sso/azure/register-application.webp)

6. From the App Registration Overview, you should obtain the Application (client) ID and copy it into your Gitpod SSO setup page
7. Create a client secret - navigate to Certificates & Secrets, click New client secret

    ![Create client secret - Azure AD Dashboard](/images/docs/gitpod-dedicated/guides/getting-started/sso/azure/client-secrets.webp)

8. Name the secret, and set expiry according to your needs.

    > 📌 Once the client secret expires, you (nor anyone else in your organization) will be able to log in to Gitpod. You will need to update the SSO configuration (secret) to continue using SSO.

9. Obtain the _Secret Value_ and copy into into the Gitpod SSO Client Secret input field
10. Grant the application access to OpenId `email` , `openid`and `profile` information

    - Navigate to API Permissions
    - Select Microsoft Graph
    - Enable `OpenId.email`, `OpenId.openid` and `Openid.profile`
      ![Request API Permissions - Azure AD Dashboard](/images/docs/gitpod-dedicated/guides/getting-started/sso/azure/request-api-permissions.webp)
    - Once saved, your configured permissions should look as follows:
      ![Configure API Permissions - Azure AD Dashboard](/images/docs/gitpod-dedicated/guides/getting-started/sso/azure/configured-permissions.webp)

11. Obtain the Provider URL

    - Navigate to your App Registration > Overview
    - Click endpoints
      ![Endpoints - Azure AD Dashboard](/images/docs/gitpod-dedicated/guides/getting-started/sso/azure/endpoints.webp)
    - Find the entry for `OpenID Connect metadata document`
    - Use the URL before the `.well-known/openid-configuration` segment,
        - For example: `https://login.microsoftonline.com/512571ea-9fc5-494e-a300-625b33c8efa6/v2.0/`

12. Proceed to Verify the SSO configuration on the Github SSO setup page: : [Clicking “Verify SSO Configuration”](/docs/gitpod-dedicated/guides/getting-started#:~:text=or%20Azure%20AD.-,General%20instructions,-You%20will%20need)

</div>

</details>

</div>

</details>

<details class="ml-2">

<summary class="text-body text-medium mt-micro font-bold">Add a SCM integration for GitHub, GitLab or Bitbucket</summary>

<div class="ml-2 mt-micro">

Integrate it with your SCM as per the steps shown in the UI or below. You can now create your first workspace and start using Gitpod! For more information on how to use Gitpod, please see the [Getting Started guide of Gitpod](/docs/introduction/getting-started).

-   Look at [these steps](/docs/configure/authentication/gitlab#registering-a-self-hosted-gitlab-installation) for information on how to integrate [`GitLab.com`](https://gitlab.com/) with your Gitpod instance. You will need to enter `gitlab.com` as the `Provider Host Name` in the New Git Integration Modal if you want to use gitlab.com, contrary to what is described.
-   Look at these [these steps](/docs/configure/authentication/github-enterprise) for information on how to integrate [`GitHub.com`](http://github.com/) with your Gitpod instance. You will need to enter `github.com` as the `Provider Host Name` in the New Git Integration Modal if you want to use github.com, contrary to what is described.
-   Look at [these steps](/docs/configure/authentication/bitbucket-server) for information on how to integrate [`Bitbucket Server`](https://www.atlassian.com/de/software/bitbucket/enterprise) with your Gitpod instance. Select `Bitbucket Server` as the `Provider Type` in the New Git Integration Modal. For bitbucket.org this requires configuring an “OAuth consumer” on a “workspace”. This is slightly different from the documented Bitbucket Server integration. See [gitpod PR #9894](https://github.com/gitpod-io/gitpod/pull/9894#pullrequestreview-969013833) for an example.

![Git Integrations Preview in Gitpod Dashboard](/images/docs/gitpod-dedicated/guides/getting-started/git-integration.webp)

</div>

</details>

> ℹ️ The first workspace start(s) will take longer than usual, sometimes exceeding 10 minutes depending on the workspace image used. This is because an image first needs to be built, a node needs to be spun up, and that image then downloaded to the node. However, subsequent workspace starts will be significantly faster.

<details class="ml-8">
<summary class="text-body text-p-medium">FAQ</summary>

**Q.** If the Gitpod internal range of `100.70.0.0/16` does not need to be routable from my network, why do we need to specify the `CIDR range of our network`?  
**A.** User workspaces traffic must cross this range when reaching the rest of your network. If there are common internal services and systems that developers may need to access that overlap with this range, the experience may be inconsistent and difficult to troubleshoot. To avoid this, Gitpod can adapt the internally used CIDR range for workspaces to the customer’s CIDR range.

**Q.** What if the `100.70.0.0/16` range overlaps with my network?  
**A.** Please contact your Gitpod account manager for assistance.

</details>

<details class="ml-8">
<summary class="text-body text-p-medium">FAQ</summary>

-   If the Gitpod internal range of `100.70.0.0/16` does not need to be routable from my network, why do we need to specify the `CIDR range of our network`?
    -   User workspaces traffic must cross this range when reaching the rest of your network. If there are common internal services and systems that developers may need to access that overlap with this range, the experience may be inconsistent and difficult to troubleshoot. To avoid this, Gitpod can adapt the internally used CIDR range for workspaces to the customer’s CIDR range.
-   What if the `100.70.0.0/16` range overlaps with my network? - Please contact your Gitpod account manager. There is some flexibility to the CIDR range used internally by Gitpod.

</details>

<details class="ml-4">

<summary class="text-body text-p-medium my-micro">FAQ</summary>

**Q.** Why two templates?  
**A.** The `infrastructure-creation-role-template.json` CloudFormation template is used to create a role with the minimum permissions required to install and update Gitpod Dedicated. This role and its policies are used to install the second Cloudformation template.

**Q.** Can the stack created by `infrastructure-creation-role-template.json` be deleted after executing the `<customer>-gitpod-template.json` ?  
**A.** No, the stack created by `infrastructure-creation-role-template.json` should be maintained. The role created is also used when updates are provided to the `<customer>-gitpod-template.jsonn` template. For more details on infrastructure updates, please see [Deployment and Updates](/docs/gitpod-dedicated/background/deployment-updates).

</details>
