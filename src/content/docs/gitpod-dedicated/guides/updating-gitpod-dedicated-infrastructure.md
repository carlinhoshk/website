---
section: guides
title: Updating the Gitpod Dedicated Infrastructure - Gitpod Dedicated docs
---

# Updating the Gitpod Dedicated Infrastructure

> ℹ️ For certain improvements to the performance, reliability and security of your Gitpod Dedicated instance, infrastructure components need to be updated. This happens very infrequently, as most application updates can be applied in place without any modifications to the infrastructure. This guide shows how to apply such updates. See [Deployment and Updates](/docs/gitpod-dedicated/background/deployment-updates) for more information.

Infrastructure updates are rolled out by supplying the customer with an updated CloudFormation template. This is an update to the originally received CloudFormation template in the initial setup process (see [Getting Started](/docs/gitpod-dedicated/guides/getting-started)).

## Gitpod Dedicated Infrastructure Update Process

> ❗ If there is an update to the role that is used to deploy Gitpod, you need to do the process below twice and in the following order:
>
> -   The first time to update the CF stack created to create the infrastructure creation role (`infrastructure-creation-role-template.json`)
> -   The second time to update the stack created to install the Gitpod Infrastructure.
>
> → Whether or not both stacks need to be updated is defined in [Infrastructure Update Changelog](/docs/gitpod-dedicated/reference/infrastructure-update-changelog). Your Gitpod Account Manager will also inform you.

1. You will receive one or two updated CloudFormation templates from your Gitpod Account Manager
2. Navigate to the AWS console and to the CloudFormation page. Select relevant stack depend on what you are updating (see note above)

    <details>

    <summary class="text-body mt-3 text-p-medium ml-6"> Screenshot </summary>

    <div class="ml-8 mt-macro">

    ![Configure AWS Environment Variables](/images/docs/gitpod-dedicated/guides/updating-gitpod-dedicated-infrastructure/navigate-aws-console.webp)

    </div>
    </details>

3. Select stack action, create change set for current stack

    <details>

    <summary class="text-body mt-3 text-p-medium ml-6"> Screenshot </summary>

    <div class="ml-8 mt-macro">

    ![Select stack from AWS console](/images/docs/gitpod-dedicated/guides/updating-gitpod-dedicated-infrastructure/select-stack.webp)

    </div>
    </details>

4. Select “Replace current template”, and upload the template provided

    <details>

    <summary class="text-body mt-3 text-p-medium ml-6"> Screenshot </summary>

    <div class="ml-8 mt-macro">

    ![Replace current template](/images/docs/gitpod-dedicated/guides/updating-gitpod-dedicated-infrastructure/replace-template.webp)

    </div>
    </details>

5. Follow along in the process as described in the AWS console UI

> ❗️ Under permissions ensure you select `GitpodSetupAndInitialEKSUserAdmin` as the stack execution role. This role was created by applying a CloudFormation template supplied by Gitpod in the initial installation process. See [Getting Started](/docs/gitpod-dedicated/guides/getting-started) for more information.
> ![Update Permissions](/images/docs/gitpod-dedicated/guides/updating-gitpod-dedicated-infrastructure/permissions-update.webp)

6. Acknowledge that IAM resources might get created and press submit

    <details>

    <summary class="text-body mt-3 text-p-medium ml-6"> Screenshot </summary>

    <div class="ml-8 mt-macro">

    ![ACK IAM Resources](/images/docs/gitpod-dedicated/guides/updating-gitpod-dedicated-infrastructure/ack-IAM-resources.webp)

    </div>
    </details>

7. After a few minutes, a change set will be published. Feel free to verify the changes

    <details>

    <summary class="text-body mt-3 text-p-medium ml-6"> Screenshot </summary>

    <div class="ml-8 mt-macro">

    ![Set changes published](/images/docs/gitpod-dedicated/guides/updating-gitpod-dedicated-infrastructure/changes-published.webp)

    </div>
    </details>

8. Execute the change set. Select the “roll back all stack resources” option as the behaviour on provisioning failure. Execution will take a few minutes

    <details>

    <summary class="text-body mt-3 text-p-medium ml-6"> Screenshot </summary>

    <div class="ml-8 mt-macro">

    ![Execute set changes](/images/docs/gitpod-dedicated/guides/updating-gitpod-dedicated-infrastructure/execute-change-set.webp)

    </div>
    </details>

    <details>

    <summary class="text-body mt-4 text-p-medium ml-6"> Once done, the status will change to <code>UPDATE_COMPLETE</code></summary>

    <div class="ml-8 mt-macro">

    ![Update completed](/images/docs/gitpod-dedicated/guides/updating-gitpod-dedicated-infrastructure/update-complete.webp)

    </div>
    </details>
