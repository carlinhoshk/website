---
section: projects
title: Projects
description: Learn how to manage projects in your organization. Also learn about project roles and permissions. It allows configuring settings like environment variables and prebuilds for repositories in your organization.
---

# Projects

Projects live under a Gitpod organization. They connect Gitpod to a git repository. A Gitpod project can only have one git repository, and a git repository can only belong to one project.

A project is required in order to trigger [prebuilds](/docs/configure/projects/prebuilds) on a repository. Organization members use the project to configure and view prebuilds.

With [organization billing](/docs/configure/billing#configure-organization-billing), all project usage such as workspaces and prebuilds, may be billed to the organization.

Projects have a static URL based on the organization and project name, for example:

<!-- TODO: Update slug, depends upon => https://github.com/gitpod-io/gitpod/pull/16050#pullrequestreview-1272075181 -->

`https://gitpod.io/t/<team>/<project>`

### View projects

The Projects page for a organization shows a card for each project.

Cards show the name, repository URL, quick links to project branches and prebuilds, and the branch and timestamp of the latest prebuild.

### Add a new project

To add a new project, click on _New Project_ on the Projects page for the organization, and select a repository from the list.

The list will show repositories from one of your git providers. Select a different provider if necessary. You may also be prompted to configure our [GitHub app](/docs/configure/authentication/github#authorizing-github-webhooks), the first time a project is created for a GitHub account. The new project will be associated with the current organization selected in the dashboard.

### Configure a project

Organization members can configure Prebuilds, and set the workspace class used for project workspaces, in project settings.

![Project Settings](/images/docs/project-settings.png)

### Remove a project

You can remove a project using the "Remove project" action from a project card.

## FAQs

### [New Project page is stuck at fetching repositories](https://discord.com/channels/816244985187008514/1056255866791272488)

<!-- DISCORD_BOT_FAQ - DO NOT REMOVE -->

To identify the problem: check browser console logs.

Possible solution(s):

-   Try to disconnect Git(Hub/Lab) or Bitbucket from https://gitpod.io/integrations, then reconnect.
-   Make sure correct scopes are set for those Git integration providers as well.
