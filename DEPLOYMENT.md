# AWS Deployment Guide for Performova

This guide outlines the steps to deploy the Performova LMS to AWS using a modern, scalable architecture.

## Architecture Overview
- **Frontend**: AWS Amplify (React + Vite)
- **Backend**: AWS App Runner or Amazon ECS Fargate (FastAPI via Docker)
- **Database**: Amazon RDS for PostgreSQL

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
5. Set the **DB instance identifier**, **Master username**, and **Master password**.
6. Ensure **Public access** is *No* (unless testing, then set your Security Group rules to allow your IP).
7. Under **Additional configuration**, specify an initial database name (e.g., `performova`).
8. Create the database. 
9. Once created, note the **Endpoint endpoint** URL.
10. Construct your `DATABASE_URL`:
    `postgresql://<username>:<password>@<endpoint>:5432/<dbname>`

---

## 2. Backend Deployment (AWS App Runner + ECR)

AWS App Runner is the easiest way to deploy a containerized API without managing servers.

### Step 2.1: Create an ECR Repository
1. Navigate to **Amazon ECR** in the AWS Console.
2. Create a repository named `performova-backend`.

### Step 2.2: Setup GitHub Actions (CI/CD)
1. In your GitHub repository, go to **Settings** > **Secrets and variables** > **Actions**.
2. Add the following secrets:
   - `AWS_ACCESS_KEY_ID`: Your AWS Access Key.
   - `AWS_SECRET_ACCESS_KEY`: Your AWS Secret Key.
3. Push to the `main` branch to trigger the `.github/workflows/backend-deploy.yml` workflow, which builds and pushes the image to ECR.

### Step 2.3: Create App Runner Service
1. Navigate to **AWS App Runner** in the console.
2. Click **Create service**.
3. Choose **Amazon ECR** and select the `performova-backend` image. 
4. Choose **Automatic** deployment (requires an IAM role).
5. Configure the service:
   - **Service name**: `performova-api`
   - **Port**: `8000`
   - **Environment Variables**: Add your `DATABASE_URL` (from step 1) and any other required keys (e.g., `GEMINI_API_KEY`).
6. Create and deploy.
7. Once deployed, note the **Default domain** URL (e.g., `https://xxxx.ap-south-1.awsapprunner.com`).

---

## 3. Frontend Deployment (AWS Amplify)

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
- Any pushes to `main` will automatically deploy both frontend and backend!