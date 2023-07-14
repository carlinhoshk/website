---
title: ♻️ Restart Workspaces Directly from VS Code Desktop
customSlug: restart-workspaces-vscode-desktop
excerpt: With Gitpod you can use OIDC to connect Gitpod workspaces to cloud providers or third parties such as AWS, Azure, GCP, or secret management services like Vault.
date: 2023-07-14
image: 2023-07-12-secretless-authorization.webp
ogImage: 2023-07-12-secretless-authorization.webp
alt: A light orange image with a padlock. The header image for the changelog announcement for secretless Gitpod workspaces announcement post.
---

You can now restart Gitpod workspaces directly in VS Code Desktop. The automatically installed Gitpod extension in VS Code Desktop now shows all active and inactive workspaces on your left menu bar so you can easily get back to your work in Gitpod without opening a new browser tab.

To try it out, simply open a new workspace in VS Code (or simply open [gitpod.new](https://gitpod.new/)), ensuring that your Gitpod extension is updated to the latest version. You should now see the Gitpod logo in the left panel, and a list of your workspaces. From this view you can:

1. Connect to a workspace (in the current window)
2. Connect to a workspace (in a new window)
3. Disconnect from the workspace
4. Open the workspace in the browser
5. View the workspace context URL

In addition, we have also updated how VS Code Desktop connects to Gitpod, which no longer requires you to add an SSH key explicitly, or manually copy and paste an access token.

See [Restarting in VS Code Desktop](/docs/references/ides-and-editors/vscode#restarting-in-vs-code-desktop) and [Connecting to VS Code Desktop](/docs/references/ides-and-editors/vscode#connecting-to-vs-code-desktop) for more.
