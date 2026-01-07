# AWS S3 Deployment Setup Guide

This guide walks you through setting up the CI/CD pipeline to deploy **Mart - For You** to AWS S3.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [AWS Setup](#aws-setup)
  - [Step 1: Create an S3 Bucket](#step-1-create-an-s3-bucket)
  - [Step 2: Configure Static Website Hosting](#step-2-configure-static-website-hosting)
  - [Step 3: Set Bucket Policy](#step-3-set-bucket-policy)
  - [Step 4: Create IAM User for Deployment](#step-4-create-iam-user-for-deployment)
  - [Step 5: (Optional) Set Up CloudFront](#step-5-optional-set-up-cloudfront)
- [GitHub Configuration](#github-configuration)
  - [Setting Up Secrets](#setting-up-secrets)
  - [Setting Up Variables](#setting-up-variables)
- [Workflow Options](#workflow-options)
- [Triggering Deployment](#triggering-deployment)
- [Troubleshooting](#troubleshooting)
- [Security Best Practices](#security-best-practices)

---

## Overview

The CI/CD pipeline consists of:

| Workflow | File | Purpose |
|----------|------|---------|
| **CI** | `ci.yml` | Runs linting, tests, and build on every push/PR |
| **Deploy to S3 (OIDC)** | `deploy-s3.yml` | Deploys to S3 using OIDC authentication (recommended) |
| **Deploy to S3 (Access Keys)** | `deploy-s3-access-keys.yml` | Deploys to S3 using Access Keys (simpler setup) |

---

## Prerequisites

Before starting, ensure you have:

- [ ] An AWS account with administrative access
- [ ] AWS CLI installed locally (optional, for testing)
- [ ] GitHub repository admin access

---

## AWS Setup

### Step 1: Create an S3 Bucket

1. Go to the [AWS S3 Console](https://s3.console.aws.amazon.com/)
2. Click **Create bucket**
3. Configure the bucket:
   - **Bucket name**: `mart-for-you-app` (must be globally unique)
   - **AWS Region**: Choose your preferred region (e.g., `us-east-1`)
   - **Object Ownership**: ACLs disabled (recommended)
   - **Block Public Access**: **Uncheck** "Block all public access" (required for website hosting)
   - Acknowledge the warning about public access
4. Click **Create bucket**

### Step 2: Configure Static Website Hosting

1. Open your bucket and go to the **Properties** tab
2. Scroll to **Static website hosting** and click **Edit**
3. Configure:
   - **Static website hosting**: Enable
   - **Hosting type**: Host a static website
   - **Index document**: `index.html`
   - **Error document**: `index.html` (for SPA routing)
4. Click **Save changes**
5. Note the **Bucket website endpoint** (e.g., `http://mart-for-you-app.s3-website-us-east-1.amazonaws.com`)

### Step 3: Set Bucket Policy

1. Go to the **Permissions** tab
2. Under **Bucket policy**, click **Edit**
3. Add the following policy (replace `YOUR_BUCKET_NAME`):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
        }
    ]
}
```

4. Click **Save changes**

### Step 4: Create IAM User for Deployment

1. Go to the [IAM Console](https://console.aws.amazon.com/iam/)
2. Click **Users** → **Create user**
3. Configure:
   - **User name**: `github-actions-deployer`
   - **Access type**: Select **Programmatic access**
4. Click **Next: Permissions**
5. Click **Attach policies directly**
6. Click **Create policy** and use this JSON:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "S3DeployAccess",
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject",
                "s3:ListBucket",
                "s3:GetBucketLocation"
            ],
            "Resource": [
                "arn:aws:s3:::YOUR_BUCKET_NAME",
                "arn:aws:s3:::YOUR_BUCKET_NAME/*"
            ]
        },
        {
            "Sid": "CloudFrontInvalidation",
            "Effect": "Allow",
            "Action": [
                "cloudfront:CreateInvalidation",
                "cloudfront:GetDistribution"
            ],
            "Resource": "*"
        }
    ]
}
```

7. Name the policy: `GitHubActionsS3DeployPolicy`
8. Attach this policy to the user
9. Complete user creation and **save the Access Key ID and Secret Access Key**

> ⚠️ **Important**: Store these credentials securely. You won't be able to see the secret key again!

### Step 5: (Optional) Set Up CloudFront

For HTTPS and better performance, set up CloudFront:

1. Go to the [CloudFront Console](https://console.aws.amazon.com/cloudfront/)
2. Click **Create distribution**
3. Configure:
   - **Origin domain**: Select your S3 bucket's website endpoint (NOT the bucket name)
   - **Origin protocol**: HTTP only (S3 website endpoints only support HTTP)
   - **Viewer protocol policy**: Redirect HTTP to HTTPS
   - **Cache policy**: CachingOptimized
   - **Default root object**: `index.html`
4. Click **Create distribution**
5. Note the **Distribution ID** (e.g., `E1A2B3C4D5E6F7`)
6. Wait for deployment (Status: Deployed)

**Configure Custom Error Pages for SPA:**

1. Go to your distribution → **Error pages** tab
2. Create custom error response:
   - **HTTP error code**: 403
   - **Customize error response**: Yes
   - **Response page path**: `/index.html`
   - **HTTP response code**: 200
3. Repeat for error code **404**

---

## GitHub Configuration

### Setting Up Secrets

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **Secrets**

Add the following secrets:

| Secret Name | Value | Required |
|-------------|-------|----------|
| `AWS_ACCESS_KEY_ID` | Your IAM user access key ID | Yes |
| `AWS_SECRET_ACCESS_KEY` | Your IAM user secret access key | Yes |
| `AWS_ROLE_ARN` | IAM Role ARN (for OIDC auth only) | Optional |

### Setting Up Variables

Go to **Settings** → **Secrets and variables** → **Actions** → **Variables**

Add the following variables:

| Variable Name | Value | Required |
|---------------|-------|----------|
| `AWS_REGION` | `us-east-1` (or your region) | Yes |
| `S3_BUCKET` | Your S3 bucket name | Yes |
| `CLOUDFRONT_DISTRIBUTION_ID` | Your CloudFront distribution ID | Optional |

---

## Workflow Options

### Option 1: Access Keys (Simpler)

Use `deploy-s3-access-keys.yml` - requires:
- `AWS_ACCESS_KEY_ID` (secret)
- `AWS_SECRET_ACCESS_KEY` (secret)
- `AWS_REGION` (variable)
- `S3_BUCKET` (variable)

### Option 2: OIDC (More Secure)

Use `deploy-s3.yml` - requires setting up [AWS IAM Identity Provider](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services) for GitHub Actions.

Benefits:
- No long-lived credentials stored
- Automatic credential rotation
- Fine-grained permissions per repository

---

## Triggering Deployment

### Automatic Deployment

Push to the `main` branch:

```bash
git add .
git commit -m "Deploy new feature"
git push origin main
```

### Manual Deployment

1. Go to **Actions** tab in your repository
2. Select **Deploy to AWS S3 (Access Keys)** workflow
3. Click **Run workflow**
4. Select environment (production/staging)
5. Click **Run workflow**

---

## Troubleshooting

### Common Issues

#### "Access Denied" when syncing to S3

- Verify IAM user has correct permissions
- Check bucket policy allows the IAM user
- Ensure `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are correct

#### "Bucket does not exist"

- Verify `S3_BUCKET` variable matches exact bucket name
- Ensure bucket is in the same region as `AWS_REGION`

#### Website shows 403/404 errors

- Check S3 bucket policy allows public read access
- Verify static website hosting is enabled
- Ensure `index.html` exists in the bucket root

#### CloudFront not updating

- CloudFront invalidation may take a few minutes
- Check if `CLOUDFRONT_DISTRIBUTION_ID` is correct
- Verify IAM user has CloudFront permissions

### Viewing Logs

1. Go to **Actions** tab
2. Click on the failed workflow run
3. Expand the failed step to see detailed logs

---

## Security Best Practices

1. **Use OIDC Authentication**: When possible, use OIDC instead of long-lived access keys

2. **Least Privilege**: Only grant the minimum required permissions

3. **Rotate Credentials**: Regularly rotate access keys

4. **Enable MFA**: Enable MFA on your AWS account

5. **Monitor Access**: Set up AWS CloudTrail to monitor API calls

6. **Use Environment Protection**: Configure GitHub environment protection rules for production deployments

7. **Review Permissions**: Periodically audit IAM policies

---

## Quick Reference

### S3 Website URL Format

```
http://{bucket-name}.s3-website-{region}.amazonaws.com
```

### CloudFront URL Format

```
https://{distribution-id}.cloudfront.net
```

### AWS CLI Commands for Testing

```bash
# Configure AWS CLI
aws configure

# List bucket contents
aws s3 ls s3://your-bucket-name

# Sync local dist folder to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

---

## Support

If you encounter issues:

1. Check the [GitHub Actions documentation](https://docs.github.com/en/actions)
2. Review [AWS S3 documentation](https://docs.aws.amazon.com/s3/)
3. Open an issue in this repository