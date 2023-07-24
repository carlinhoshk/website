---
section: self-hosted/latest
subsection: troubleshooting
title: Manage Cluster Nodes
---

# Manage Cluster Nodes

> ⚠️ **Gitpod Self-hosted is [no longer supported](/blog/introducing-gitpod-dedicated)**
>
> The last update of Gitpod Self-hosted product was [November 2022](/changelog/november-self-hosted-release). Users can still request our [free community license](/community-license) however there will be no support or updates to the product. If you are interested in an isolated, private installation of Gitpod, take a look at [Gitpod Dedicated](/dedicated).

Sometimes nodes become unhealthy, or you need to prevent the autoscaler from removing the node from your cluster.

## Avoiding Node Scale-down

If you wish to cordon a node with terminating workspaces, or, keep a node so you have time to manually backup user data:

```shell
# reference: https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md#how-can-i-prevent-cluster-autoscaler-from-scaling-down-a-particular-node
$ kubectl annotate node <nodename> cluster-autoscaler.kubernetes.io/scale-down-disabled=true
```

## Handling Unhealthy Nodes

Prevent new workspaces from being scheduled to a node if they become unhealthy:

```shell
$ kubectl cordon <nodename>
```
