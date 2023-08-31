---
section: guides
title: Using Private ECR Repositories for Workspace Images - Gitpod Dedicated docs
---

# Using Private ECR Repositories for Workspace Images

> ⚠️ **Limitation**: Private ECR repositories currently cannot be used when specified within a [custom Dockerfile](/docs/configure/workspaces/workspace-image#using-a-custom-dockerfile) that Gitpod builds into an image. Images need to be built outside of Gitpod, and then referenced directly in the .gitpod.yml . Ensure the images adhere to the requirements described [here](/docs/configure/workspaces/workspace-image#custom-base-image).

> ⚠️ **Note**: When using a private image in combination with `gp validate`, you'll need to [authenticate against the private registry](https://docs.aws.amazon.com/AmazonECR/latest/userguide/registry_auth.html) in your workspace.
> This is because `gp validate` emulates a workspace start using the Docker daemon running in your workspace. To prevent unintended security repercussions, the credentials used during workspace start are not automatically made available in the workspace.

Take the following steps to use a private ECR repository as the source for workspace images:

1. Navigate to the AWS account where the target ECR repository is in
2. Modify the target ECR repositories resource policy (repositories > permissions) with the following entry:

    ```json
    {
    	"Version": "2012-10-17",
    	"Statement": [
    		{
    			"Sid": "Gitpod Access",
    			"Action": [
    				"ecr:BatchCheckLayerAvailability",
    				"ecr:BatchGetImage",
    				"ecr:GetDownloadUrlForLayer"
    			],
    			"Effect": "Allow",
    			"Principal": {
    				"AWS": [
    					"arn:aws:iam::<your-gitpod-dedicated-aws-account-id>:root"
    				]
    			}
    		}
    	]
    }
    ```

You can now reference images from this ECR repository in [`.gitpod.yml` files](/docs/references/gitpod-yml) by specifying it in the `image` field: `image: <aws-ecr-url-prefix>.amazonaws.com/<your-image-name:tag>`. Ensure the images adhere to the requirements described [here](/docs/configure/workspaces/workspace-image#custom-base-image).
