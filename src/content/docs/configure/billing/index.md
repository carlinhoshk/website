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

![Active billing](/images/docs/billing/update-usage-limit-2.png)

### View usage details

Organization owners can view usage details for their organization.

![View usage](/images/docs/billing/view-org-usage-details.png)

## Old pricing plans

All old seat-based or personal plans have been faded out. If you had one of those, and need help of any kind related to those, please contact at billing@gitpod.io.

## FAQs

### [How can I limit or optimize prebuild costs?](https://discord.com/channels/816244985187008514/1070648758716600371)

<!-- DISCORD_BOT_FAQ - DO NOT REMOVE -->

There are a few built-in Gitpod features that can optimize your prebuild costs, such as:

-   **Skip prebuilds** every X commits and use [last successful prebuild](https://www.gitpod.io/docs/configure/projects/last-successful-prebuild)

-   **Stop prebuilds** for all branches, PRs and etc. when on GitHub. See [this page](https://www.gitpod.io/docs/references/gitpod-yml/#github). (might not be necessary)

### With prebuilds enabled, does every push to my repository cost me credits?

It depends on how you configured prebuilds. Prebuilds run on headless Gitpod workspaces and the cost depends on how long they run when triggered.

### I was charged twice, can you help?

Certainly, please send us a message at billing@gitpod.io
