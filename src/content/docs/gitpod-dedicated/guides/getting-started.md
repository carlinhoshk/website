---
section: guides
title: Getting Started with Gitpod Dedicated - Gitpod Dedicated docs
---

# Getting Started

> ℹ️ You will need to have familiarity with AWS, specifically CloudFormation, in order to be able to execute this guide.

Currently, Gitpod Dedicated is only available in the following AWS regions:

-   `us-east-1`
-   `us-east-2`
-   `us-west-2`
-   `ap-northeast-1`
-   `ap-southeast-2`
-   `eu-west-1`
-   `eu-central-1`

## 1. Set up an AWS Account for Gitpod Dedicated

> ℹ️ Gitpod Dedicated is expected to run in its own independent AWS account. It is not intended to run alongside other components in a shared or existing AWS account.

Create a new AWS account following the steps in [the AWS documentation](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_accounts_create.html). Start by navigating to the AWS console and creating the account as part of the customer’s AWS organization.

1. Ensure that the account has at least the following quotas for the region where Gitpod Dedicated will be deployed into. Note that quote increases can take anywhere between one hour and days.

|                  Service                  |                               Name                               | Value |                                                                                                                                                                                                                                                        Reasoning                                                                                                                                                                                                                                                         |
| :---------------------------------------: | :--------------------------------------------------------------: | :---: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| Amazon Elastic Compute Cloud (Amazon EC2) |                       EC2-VPC Elastic IPs                        |  20   | Gitpod requires 3 IP addresses for each load balancer (Gitpod has 2 load balancers, one for meta and one for the workspace cluster). Additionally, 3 IPs are needed for each NAT gateway (Gitpod has 3 VPCs, so 3x). Therefore, at a minimum, 15 IPs are needed. The additional 5 act as a buffer in case a new load balancer needs to be provisioned and runs in parallel to the old one, ensuring a smooth transition. For more information, please see [Architecture](/docs/gitpod-dedicated/reference/architecture). |
| Amazon Elastic Compute Cloud (Amazon EC2) | Running On-Demand Standard (A, C, D, H, I, M, R, T, Z) Instances |  256  |                                                                                                                                                                                   The value depends on the number of developers use the instance. This is the bare minimum Gitpod recommends. More workspaces require a higher quota.                                                                                                                                                                                    |
|                AWS Lambda                 |                      Concurrent Executions                       | 1024  |                                                                                                      To ensure Gitpod can install and operate properly, the default concurrent execution quota should be increased to 1024. The default quota is usually 1000, but it can sometimes be as low as 10 due to unknown AWS-related reasons. Increasing the quota to 1024 guarantees that Gitpod will function properly.                                                                                                      |
| Amazon Virtual Private Cloud (Amazon VPC) |                         VPCs per Region                          |   4   |                                                                                                                                Technically Gitpod only uses 1 VPCs. If the account comes with a default VPC, this already results in 2 required. The rest of this quota is a buffer in case additional VPCs need to be created for private networking (e.g. landing zone) - this is TBD.                                                                                                                                 |

2. Ensure that you allow for cross-account and cross-region communication with `eu-central-1`. For example, this could be restricted by [SCPs](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html) such as a [Region deny SCP](https://docs.aws.amazon.com/controltower/latest/userguide/region-deny.html). To roll out updates to the application, an AWS Lambda function pulls several configurations from a known S3 bucket owned by Gitpod. This bucket is hosted in the Gitpod Dedicated control plane located in the `eu-central-1` region.

## 2. Execute two CloudFormation templates in the new account to bootstrap the infrastructure and install Gitpod Dedicated

> ℹ️ Feel free to notify your Gitpod account manager if you require a preview of the CloudFormation template in order to better understand what will be deployed in your account. If necessary, share it with other team’s in your company that need to review it. Please see [AWS IAM permission requirements](/docs/gitpod-dedicated/reference/AWS-IAM-permission-requirements) for information on the permissions needed.

The process for creating the necessary infrastructure in the customer’s account and installing Gitpod Dedicated onto it is as follows:

1. **Provide information**: A Gitpod account manager will ask for information needed to generate the CloudFormation template that will be used to bootstrap the infrastructure for your Gitpod instance. See [Networking and Data flows](/docs/gitpod-dedicated/reference/networking-data-flows) for general guidance and requirements on which services Gitpod needs to be able to route to. <br/>The information required depends on the choice of networking mode:

<details class="ml-4">

<summary class="text-body text-p-medium mt-micro">All Private Networking Mode</summary>

1. `Subdomain` of your Gitpdod installation. The full domain will be `<subdomain>.gitpod.cloud` unless a custom domain is used (see below).

<details class="ml-8">

<summary class="text-body text-p-medium mt-micro">Please note:</summary>

Depending on your compliance and regulatory requirements, you may want to avoid including your company name in the URL. Although efforts are taken to minimize any exposure, avoiding using the company name can further increase confidentiality and reduce exposure risk.

</details>

2. `AWS account ID` of the account created above, in which Gitpod will be installed into.
3. `AWS region` in which Gitpod will be installed. See [a](/docs/gitpod-dedicated/guides/getting-started#:~:text=Currently%2C%20Gitpod%20Dedicated%20is%20only%20available%20in%20the%20following%20AWS%20regions%3A)bove for available regions.
4. `Relay CIDR range`: This is the small part of the VPC of the Gitpod instance that needs to be routable from your network. This part is called the relay subnet and it contains the NATs and attaches to your Transit Gateway (see below). See [Networking and Data flows](/docs/gitpod-dedicated/reference/networking-data-flows) for more details and a networking diagram.

<details class="ml-8">

<summary class="text-body text-p-medium mt-micro">Please consider the following points when choosing this range:</summary>

-   The only restriction in place is that the `Relay CIDR range` must be `/25` and not in the range `100.64.0.0/10` (the parent range used by Gitpod).
-   The chosen `Relay CIDR range` must not overlap with any services you wish to route to or from Gitpod, e.g. your source code repository, SSO provider or package repositories.
-   [Prebuilds](/docs/configure/projects/prebuilds) will not be triggered automatically if your Source Control Management system (e.g. GitHub) cannot send web hooks to the Gitpod instance, i.e. is able to route to this CIDR range.

</details>

5. `transitGatewayID` of the Transit Gateway you want your Gitpod instance’s VPC to connect (attach) to. All traffic that is not going to the Dedicated Control Plane will be routed through a newly created transit gateway attachment attached to the Transit Gateway with this ID. See [Networking and Data flows](/docs/gitpod-dedicated/reference/networking-data-flows) for more information.

<details class="ml-8">

<summary class="text-body text-p-medium mt-micro">Please note: </summary>

When using auto-propagation by default, delete the propagation from your Transit Gateway Routetable associated with the Gitpod Transit Gateway Attachment and replace it with a static route pointing the `Relay CIDR range` (`/25`) to the Gitpod Transit Gateway Attachment ID. This ensures only the required relay range is shared on your Transit Gateway network and no other routes are accidentally broadcast.

</details>

6. `expose public services` : This is an option at the customer’s discretion (takes a value of `true` or `false`). An API Gateway is added to expose endpoints for webhooks (required for prebuilds, e.g. Gitlab.com, to allow webhooks to be forwarded to internal Gitpod services) and IDP services (required to enable the use of public [OIDC IDPs within workspaces](/docs/configure/workspaces/oidc)) to the public internet. The added API gateway enables these features without:
    - Exposing the entire instance to the public internet
    - Extra effort to add public ingress within the customer’s network behind the transit gateway.

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
3. `AWS region` in which Gitpod will be installed. See [a](/docs/gitpod-dedicated/guides/getting-started#:~:text=Currently%2C%20Gitpod%20Dedicated%20is%20only%20available%20in%20the%20following%20AWS%20regions%3A)bove for available regions.
4. `CIDR range of your network`, i.e. the IP address space used by your company network that you want workspaces to be able to route to. At the very least, provide the relevant ranges that you want Gitpod to be able to interact with. This helps Gitpod ensure there are no possible IP conflicts with CIDR ranges used internally in the Gitpod instance (`100.70.0.0/16`, part of CGNAT range). Note that this internal Gitpod range does not need to be routable from your network. For more information on Gitpod’s networking setup, please refer to [Networking and Data flows](/docs/gitpod-dedicated/reference/networking-data-flows) for a networking diagram.

<details class="ml-8">
<summary class="text-body text-p-medium">FAQ</summary>

-   If the Gitpod internal range of `100.70.0.0/16` does not need to be routable from my network, why do we need to specify the `CIDR range of our network`?
    -   User workspaces traffic must cross this range when reaching the rest of your network. If there are common internal services and systems that developers may need to access that overlap with this range, the experience may be inconsistent and difficult to troubleshoot. To avoid this, Gitpod can adapt the internally used CIDR range for workspaces to the customer’s CIDR range.
-   What if the `100.70.0.0/16` range overlaps with my network? - Please contact your Gitpod account manager. There is some flexibility to the CIDR range used internally by Gitpod.

</details>

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

When using auto-propagation by default, delete the propagation from your Transit Gateway Routetable associated with the Gitpod Transit Gateway Attachment and replace it with a static route pointing the Relay CIDR range (/25) to the Gitpod Transit Gateway Attachment ID. This ensures only the required relay range is shared on your Transit Gateway network and no other routes are accidentally broadcast.

</div>

</details>

7. `expose public services`: This is an option at the customer’s discretion (takes a value of `true` or `false`). An API Gateway is added to expose endpoints for webhooks (required for prebuilds, e.g. Gitlab.com, to allow webhooks to be forwarded to internal Gitpod services) and IDP services (required to enable the use of public [OIDC IDPs within workspaces](/docs/configure/workspaces/oidc)) to the public internet. The added API gateway enables these features without:
    - Exposing the entire instance to the public internet
    - Extra effort to add public ingress within the customer’s network behind the transit gateway.

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

<details class="ml-8">
<summary class="text-body text-p-medium">FAQ</summary>

-   If the Gitpod internal range of `100.70.0.0/16` does not need to be routable from my network, why do we need to specify the `CIDR range of our network`?
    -   User workspaces traffic must cross this range when reaching the rest of your network. If there are common internal services and systems that developers may need to access that overlap with this range, the experience may be inconsistent and difficult to troubleshoot. To avoid this, Gitpod can adapt the internally used CIDR range for workspaces to the customer’s CIDR range.
-   What if the `100.70.0.0/16` range overlaps with my network? - Please contact your Gitpod account manager. There is some flexibility to the CIDR range used internally by Gitpod.

</details>

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

2. **Receive Two CloudFormation templates:** You will need to execute two CloudFormation templates to install the infrastructure and subsequently Gitpod Dedicated. The `infrastructure-creation-role-template.json` (downloadable below) is used to create an IAM role that is assumed during the execution of the subsequent `<customer>-gitpod-template.json` CloudFormation template (shared with you by your Gitpod Account manager). The `<customer>-gitpod-template.json` CloudFormation template installs the infrastructure for Gitpod Dedicated.

<details class="ml-4">

<summary class="text-body text-p-medium my-micro">FAQ</summary>

-   Why two templates?
    -   The `infrastructure-creation-role-template.json` CloudFormation template is used to create a role that has a minimum of permissions, yet allows for a predictable outcome when executing `<customer>-gitpod-template.json`. Further, it provides more transparency to the customer.
-   Can the stack created by `infrastructure-creation-role-template.json` be deleted after executing the `<customer>-gitpod-template.json` ?
    -   No, the stack created by `infrastructure-creation-role-template.json` should be maintained. The role created is also used when updates are provided to the `<customer>-gitpod-template.jsonn` template. For more details on infrastructure updates, please see [Deployment and Updates](/docs/gitpod-dedicated/background/deployment-updates).

</details>

3. **Execute CloudFormation templates**

    > ⚠️ Do not modify the CloudFormation templates outside of adding AWS resource tags. Doing so will result in the installation failing.

<div class="ml-6">

1.  First, download and execute the `infrastructure-creation-role-template.json` template in the new AWS account created above: <br/>

> 💾 Download this template by clicking on it:
>
> <div class="mt-2">
> <a href='/images/docs/gitpod-dedicated/reference/AWS-IAM-permission-requirements/infrastructure-creation-role-template.json' download>infrastructure-creation-role-template.json</a>
> </div>

<details class="ml-8">

<summary>During the “configure stack options” step, ensure you select the “roll back all the stack resources” option under “Stack failure options”:</summary>

![Stack Options](/images/docs/gitpod-dedicated/guides/getting-started/stackoptions.webp)

</details>

<details class="ml-8 mt-macro">

<summary>Troubleshooting</summary>

In the rare case that the template has an error during execution, it is advised to remove all existing resources before trying again. See [Deleting your Gitpod installation](/docs/gitpod-dedicated/guides/deleting-your-gitpod-installation).

</details>

2.  Then, execute `<customer>-gitpod-template.json` that will be shared by your Gitpod account manager in the same AWS account. This will create the infrastructure that Gitpod Dedicated requires.

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
>
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
