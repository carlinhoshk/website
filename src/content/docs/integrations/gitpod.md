---
section: integrations
title: Gitpod
---

# Gitpod In-product integrations

It explores the seamless integration capabilities within Gitpod's product ecosystem.

## Open Workspace with IDE/editor

You can open a workspace with an IDE/editor by adding the `ide` query parameter to the URL. For example, to open a workspace with IDE (latest/stable), Workspace Class.

For example, to open a workspace with VS Code Browser _(latest)_ & Large workspace, you can use the following URL:

```
https://gitpod.io/?showOptions=true&useLatest=true&editor=code&workspaceClass=g1-large#https://github.com/gitpod-io/website
```

Entities in the URL are separated by `#` and the query parameters are separated by `&`. The following table lists the supported query parameters:

|    Parameter     |         Description         |                                                    Example                                                    |
| :--------------: | :-------------------------: | :-----------------------------------------------------------------------------------------------------------: |
|  `showOptions`   |  Show the UI options menu.  |                                                `true`, `false`                                                |
|     `editor`     |   The IDE/editor to use.    | `code`, `code-desktop`, `intellij`, `goland`, `phpstorm`, `pycharm`, `rubymine`, `webstorm`, `rider`, `clion` |
| `workspaceClass` | The workspace class to use. |                                           `g1-standard`, `g1-large`                                           |
|   `useLatest`    |   Use the latest version.   |                                                `true`, `false`                                                |

After passing the optional parameters, you can add the URL of the repository after `#` that you want to open in Gitpod.
