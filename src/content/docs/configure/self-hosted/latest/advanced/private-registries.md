---
section: self-hosted/latest
subsection: installation-guides
title: Private Registries
---

# Using private image registries with Gitpod Self-Hosted

> ⚠️ **Gitpod Self-hosted is [no longer supported](/blog/introducing-gitpod-dedicated)**
>
> The last update of Gitpod Self-hosted product was [November 2022](/changelog/november-self-hosted-release). Users can still request our [free community license](/community-license) however there will be no support or updates to the product. If you are interested in an isolated, private installation of Gitpod, take a look at [Gitpod Dedicated](/dedicated).

This guide outlines the considerations to take when using images for workspaces that originate from private image registries that are not stored in the image registry already configured in the KOTS Installation UI. This is useful when, for example, you want to pull private base images from one registry and then store the built images in another.

Please refer to the [Docker image documentation](/docs/configure/workspaces/workspace-image) for more information about workspace images.

> **Note:** there are two ways of setting an image for a workspace: via the installation-wide [default `workspaceImage`](./default-workspace-image) and the [`.gitpod.yml` file](/docs/references/gitpod-yml). The `.gitpod.yml` file will take precedence if both are set.

## Credentials

To access private registries, Gitpod needs to have the corresponding access credentials. These can be supplied in the KOTS installation UI:

![registry credentials UI](/images/docs/self-hosted/private-registry-credentials.png)

## Allowlist

Gitpod also has an allow list for private base image registries. Any private image registry that is used throughout an installation needs to be on this allowlist.

> **Important:** Any registry for which credentials are supplied is automatically added to this allowlist!

Registries can be added to the allowlist via the [config patch](/docs/configure/self-hosted/latest/config-patches) in the following format:

```yaml
containerRegistry:
    privateBaseImageAllowList:
        - <your_registry-url.com>
        - <another_registry-url.com>
```
