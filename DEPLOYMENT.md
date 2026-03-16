# AWS Deployment Guide for Performova

This guide outlines the steps to deploy the Performova LMS to AWS using a modern, scalable architecture.

## Architecture Overview
This system is split into two core halves: an **Active API** and an **Agentic Factory**.
- **Frontend**: AWS Amplify (React + Vite) with Direct-to-S3 uploads (Presigned URLs).
- **Active API (Backend)**: AWS App Runner (FastAPI on ARM64 Graviton instances).
- **Database**: Amazon RDS for PostgreSQL (using JSONB for dynamic AI data).
- **Agentic Factory**: AWS Step Functions orchestrating AWS Lambda (Gemini 1.5 Pro/Flash) and Fargate tasks for asynchronous video/AI processing.

## Prerequisites
1. An AWS Account with Administrator access.
2. [AWS CLI](https://aws.amazon.com/cli/) installed and configured (`aws configure`).
3. GitHub Repository with the source code pushed to it.

---

## 1. Database (Amazon RDS - PostgreSQL)

1. Navigate to the **RDS Console** in AWS.
2. Click **Create database**.
3. Choose **PostgreSQL** (version 15 or 16).
4. Choose **Free tier** or **Production** depending on your needs.
5. Under **Instance configuration**, select **Burstable classes** and choose **db.t4g** (e.g., `db.t4g.micro`). AWS Graviton (ARM64) instances are significantly cheaper and more performant than standard x86 instances.
6. Set the **DB instance identifier**, **Master username**, and **Master password**.
7. Ensure **Public access** is *No* (unless testing, then set your Security Group rules to allow your IP).
8. Under **Additional configuration**, specify an initial database name (e.g., `performova`).
9. Create the database.
10. Once created, note the **Endpoint endpoint** URL.
11. Construct your `DATABASE_URL`:
    `postgresql://<username>:<password>@<endpoint>:5432/<dbname>`

---

## 2. Backend Deployment (Amazon ECS Fargate + ECR)

Amazon ECS Fargate is a serverless compute engine for containers.

### Step 2.1: Create an ECR Repository
1. Navigate to **Amazon ECR** in the AWS Console.
2. Create a repository named `performova-backend`.

### Step 2.2: Setup GitHub Actions (CI/CD)
1. In your GitHub repository, go to **Settings** > **Secrets and variables** > **Actions**.
2. Add the following secrets:
   - `AWS_ACCESS_KEY_ID`: Your AWS Access Key.
   - `AWS_SECRET_ACCESS_KEY`: Your AWS Secret Key.
3. Push to the `main` branch to trigger the `.github/workflows/backend-deploy.yml` workflow.

### Step 2.3: Create ECS Cluster and Service
1. Create an ECS Cluster named `performova-cluster` in the Mumbai (`ap-south-1`) region.
2. Define a Task Definition with the `performova-backend` image, port `8000`.
3. Create a Service using the **Fargate** launch type.
4. Configure the service with your `DATABASE_URL` as an Environment Variable.
5. Ensure the Security Group allows inbound traffic on port `8000`.

---

## 3. Agentic Factory Deployment (AWS Step Functions & Lambda)

The asynchronous video processing and AI generation logic (Architect, Designer, Verifier agents) should be deployed as a separate serverless workflow.

1. **Create an S3 Bucket** for frontend uploads. Configure it to send an Event Notification to AWS SQS or EventBridge.
2. **Deploy Lambda Functions** for the Gemini 1.5 Pro and Flash agents.
3. **Deploy a Fargate Task** specifically for running the heavy `faster-whisper` and `ffmpeg` libraries.
4. **Create an AWS Step Functions State Machine** to orchestrate:
   - File Upload (S3) -> Fargate Media Processing -> Architect Agent (Lambda) -> Designer Agent (Lambda) -> Verifier Agent (Lambda) -> Save to RDS.

---

## 4. Frontend Deployment (AWS Amplify)

AWS Amplify automatically detects your Vite configuration using the included `amplify.yml`.

1. Navigate to the **AWS Amplify Console**.
2. Click **New app** > **Host web app**.
3. Connect your **GitHub** account and select the Performova repository.
4. Set the **Branch** to `main`.
5. Under **Advanced settings**, set the following Environment Variable:
   - `VITE_API_URL`: Set this to your App Runner API URL (e.g., `https://xxxx.ap-south-1.awsapprunner.com`).
6. Save and deploy. Amplify will build your app and output a public URL.

## Summary

- Your frontend is now available at the Amplify URL.
- Your backend is running on App Runner.
- Both are connected to the RDS PostgreSQL instance.
- The infrastructure utilizes ARM64 architecture (Graviton) to optimize costs.
- Any pushes to `main` will automatically deploy both frontend and backend!