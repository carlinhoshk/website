---
title: "Workspace images: Go 1.20.5 & Rust 1.70"
alt: screenshot of the new workspace creation page
date: 2023-06-11
excerpt: You can now choose the workspace's organization, editor, and workspace class on creation
image: workspace-images-updated-2023-07.webp
ogImage: workspace-images-updated-2023-07.webp
tags: workspace-images
---

<script context="module">
  export const prerender = true;
</script>

Starting this week, all workspace images based on `gitpod/workspace-full` and language-specific ones (`gitpod/workspace-rust` and `gitpod/workspace-go`) will be updated to reflect the latest language versions: `1.20.5` for Go and `1.70` for Rust. If you want to stay on the current versions (Go `1.19.5` & Rust `1.68.1`), you can pin your workspace image base to a one from before last week, like so:

```Dockerfile
FROM gitpod/workspace-full:2022-04-11-18-21-27
...
```
