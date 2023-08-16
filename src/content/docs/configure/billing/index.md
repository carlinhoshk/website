---
section: billing
title: Billing
description: Learn how Gitpod charges for usage and manages your organization's billing.
---

# Billing

Gitpod bills users based on the duration their workspaces are active and the credit consumption of the selected [workspace class](/docs/configure/workspaces/workspace-classes#workspace-classes). This metered billing also extends to [prebuilds](/docs/configure/projects/prebuilds).

To view and modify billing settings for your organization, navigate to the organization menu from the top-left corner and select `Billing`.

> **Note:** Only organization owners can access the **Billing** page[[1](/docs/configure/orgs/members)].

## Credits

Gitpod usage is measured in **credits**.

Larger [workspace classes](/docs/configure/workspaces/workspace-classes#workspace-classes) use credits at a faster rate. E.g. Standard workspaces use 10 credits per hour, whereas Large workspaces use 20 credits per hour.

Your invoice will show the total amount of credits consumed in a billing period.

## Free tier

All users receive a free usage allowance of up to 500 credits per month to try Gitpod in their first created organization.

## Configure billing

Organization owners can set up billing in the organization settings by clicking "Upgrade Plan" on the Billing page.

![Configure Billing](/images/docs/billing/configure-org-billing.png)

Once billing is configured, Gitpod will charge the organization billing account for usage by organization members.

![Active billing](/images/docs/billing/active-org-billing.png)

## Configure a Usage Limit

To avoid unexpected overages, you can set a custom usage limit. Once this limit is reached, new workspaces will not start.

To adjust this limit, navigate to the "Update limit" option within the BALANCE section of your organization billing settings. This option becomes available after you've set up billing.

> ℹ️ **Note:** Setting this limit will not terminate already running workspaces.

![Active billing](/images/docs/billing/update-usage-limit-2.png)

## View usage details

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
