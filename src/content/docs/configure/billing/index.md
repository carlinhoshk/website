---
section: billing
title: Billing
description: Learn how Gitpod charges for usage and manages your organization's billing.
---

# Billing

Gitpod usage is measured in credits. Credits are consumed per organization for the usage of all organization members. Your invoice will show the total amount of credits consumed in a billing period. A billing period is 1 month and starts on the day your subscription is activated. Credits are consumed for every hour that a workspace is running. The number of credits that are consumed also depends on the [Workspace Class](/docs/configure/workspaces/workspace-classes#workspace-classes). [Prebuilds](/docs/configure/projects/prebuilds) also consume credits.

<!-- TODO: Do we bill partial hours? -->
<!-- TODO: Should we explain classes here? -->

**For example:**

-   **Standard**: up to 4 cores, up to 8GB RAM, 30GB storage, 10 credits per hour.
-   **Large**: up to 8 cores, up to 16GB RAM, 50GB storage, 20 credits per hour.

## Tiers

### Free Tier

All users receive a free usage allowance of up to 500 credits per month to try Gitpod in their first created organization.

### Pay-as-you-go

Pay as you go Organizations also have access to the following features:

-   Custom timeouts (longer than 1 hour)
-   Workspace concurrency (more than 4 workspaces)

## Billing

### View Billing

To view billing information for an organization:

1. First, ensure that you are looking at the correct Organization. Your Organization is shown, and can be changed in the top-left corner of the Gitpod dashboard.
2. To view billing data, you must be assigned the [organization owner](/docs/configure/orgs/members) role. Only existing owners of an organisation can assign the owner role to other users.
3. To see your billing preferences, navigate to the organization menu (top left corner) in the Gitpod dashboard and select "Billing".

### Update Billing

Organization owners can subscribe to a new billing plan via the billing page by clicking on "Upgrade Plan".

![Configure Billing](/images/docs/billing/configure-org-billing.png)
_Caption: An Organization that does not yet have billing set up_

<!-- TODO: Can we make these smaller? -->

![Active billing](/images/docs/billing/active-org-billing.png)
_Caption: An Organization that has billing set up_

## Usage

### Configure a Usage Limit

To avoid unexpected costs, you can set a custom usage limit that is applied to the Organization. Once the usage limit is reached, new workspaces will no longer start, however currently running workspaces will not be automatically stopped.

To adjust the usage limit for an Organization navigate to the "Update limit" option within the balance section of your organization billing preferences. The usage limit option is not available until the billing subscription is enabled for the Organization.

![Update Usage Limit](/images/docs/billing/update-usage-limit-2.png)
_Caption: Selecting an Organization usage limit_

### View usage details

You can view usage of an Organization on the usage page. The usage page can be found in the Organization dropdown in the top left of the Gitpod dashboard. Organization owners can view usage of all Organization members. However, members of an Organziation can only access their own usage information. Usage entries include the following data:

-   Workspace Class
-   Credits Consumed
-   Workspace start time

<!-- TODO: Is this start time? -->
<!-- TODO: Double check why usage is open on Gitpod Cloud -->

Every time a workspace stops, a new usage entry is added.

<!-- TODO: Is this true? -->

![View usage](/images/docs/billing/view-org-usage-details.png)

### Export usage

You can export usage details in CSV format from the usage page.

## Deprecated pricing plans

Previous pricing plans, such as: "Unleashed" and "Professional" are no longer available.

For help related to these previous pricing plans, please contact: billing@gitpod.io.

## FAQs

### [How can I limit or optimize my Prebuild costs?](https://discord.com/channels/816244985187008514/1070648758716600371)

<!-- DISCORD_BOT_FAQ - DO NOT REMOVE -->

There are built-in Gitpod features to optimize prebuild costs, for instance:

-   **Skip prebuilds** - You can skip Prebuilds for every X commit and optionally configure Prebuilds to use the [last successful prebuild](https://www.gitpod.io/docs/configure/projects/last-successful-prebuild).
-   **Stop prebuilds** - You can adjust Prebuild triggers e.g. for branches or pull requests when using Gitpod with GitHub. See the [.gitpod.yml](https://www.gitpod.io/docs/references/gitpod-yml/#github) reference page for information on how to configure Prebuild triggers.

<!-- TODO: Should this be on the Prebuild page? -->

### With prebuilds enabled, does every push to my repository cost me credits?

It depends on how you configured prebuild triggers. Prebuilds run on headless Gitpod workspaces and the cost of Prebuilds depends on how long the Prebuild ran, and the workspace class.

### I was charged twice, can you help?

If you have a query around your billing, please send an email to: billing@gitpod.io
