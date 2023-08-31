---
section: gitpod-dedicated/reference
title: Infrastructure Update Changelog - Gitpod Dedicated docs
---

# Infrastructure Update Changelog

> ℹ️ This is a changelog detailing the changes that go into Infrastructure updates. More information on these updates can be found in [Deployment and Updates](/docs/gitpod-dedicated/background/deployment-updates). A guide on how to apply them can be found in [Updating the Gitpod Dedicated Infrastructure](/docs/gitpod-dedicated/guides/updating-gitpod-dedicated-infrastructure).

<details>
    <summary class="text-body text-large"><b>Infrastructure Update v25</b> (released 14 August, 2023 )</summary>

<div class="ml-2 md:ml-4">

> ❗️ This update impacts running workspaces and should not be done during working hours. **You can expect a downtime of 5 minutes** after the CloudFormation Change Set is applied as new nodes are spun up.

> ℹ️ Creating the change set can take longer than usual. Further, once the change stack is applied, the clean up step will take longer than usual - up to 40 minutes (see below for reasoning). The Gitpod instance can be used as normal during this time. Future updates will take less time again.

### How to update

-   Your Gitpod Account Manager will provide you with two CloudFormation templates (one for the infrastructure template role and one for Gitpod itself) that both need to be applied as change sets.

-   Follow the process laid out on [Updating the Gitpod Dedicated Infrastructure](/docs/gitpod-dedicated/guides/updating-gitpod-dedicated-infrastructure)

### Changelog

-   Support for custom CA certificates (important: An application release is necessary to fully roll out this feature. You can ask your Gitpod Account Manager whether your instance has received the required release)
-   Disabled scaling the instance to 0 nodes during working hours (6:00 to 22:00 local time to the instance) to speed up the workspace starts in the morning. Scale to 0 is still enabled on weekends.
-   Improvements of log groups associated with Lambda functions to reduce cost and align function names with AWS conventions. This requires all lambdas to be recreated, leading to the longer than usual clean up time mentioned above.
-   Enforce use of IMDSv2 AWS metadata endpoint for EC2 instances
-   Various bug fixes

### Expected CloudFormation Change Set

The change set being generated as part of this CF change is expected to include the following changes:

**Changes to the stack for the role used to execute the Gitpod CF template:**

![Changes in Gitpod CF Template - 10 Aug 2023](/images/docs/gitpod-dedicated/reference/infrastructure-update-changelog/10-aug-2023/changes-gitpod-cf-template.webp)

### Changes to Gitpod CF template

<a href='/images/docs/gitpod-dedicated/reference/infrastructure-update-changelog/10-aug-2023/infra-version-25-changes.json' download>infra-version-25-changes.json</a>

</div>

</details>

<details>
    <summary class="text-body text-large mt-8"><b>Infrastructure Update v19</b> (released July 13, 2023)</summary>

<div class="ml-2 md:ml-4">

### How to update

-   Follow the process laid out in [Updating the Gitpod Dedicated Infrastructure](/docs/gitpod-dedicated/guides/updating-gitpod-dedicated-infrastructure)

-   This update does not impact running workspaces and can be done during working hours.

### Changelog

-   Update to the application controller (Lambda) to improve the ordering of its operations
-   Turn off debug mode for the telemetry controller as it was logging too much
-   Turn off AZ rebalancing which was impacting the stability of some nodes and thus workspaces
-   Set workspace DNS resolvers to be local VPC resolver IP instead of public DNS lookup. This resolves networking issues in environments where public DNS lookups are blocked. This is the first of a two part roll out process, the second part is an application change.

### Expected CloudFormation Change Set

The change set being generated as part of this CF change is expected to include the following 14 changes:

![Changes in Gitpod CF Template - 10 Aug 2023](/images/docs/gitpod-dedicated/reference/infrastructure-update-changelog/13-july-2023/changes.webp)

</div>

</details>
