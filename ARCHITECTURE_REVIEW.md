# Architecture Review: Performova LMS

## 1. Executive Summary

This document provides a holistic review of the Performova Learning Management System (LMS) deployment architecture, currently outlined in `DEPLOYMENT.md`. The primary goal of this review is to evaluate the proposed AWS infrastructure against the application's functional requirements—specifically, its cost efficiency, scalability, and performance.

The most critical finding is that running the compute-intensive media processing tasks (video transcoding via FFmpeg and audio transcription via Faster-Whisper) directly within the main FastAPI backend on AWS App Runner or AWS Fargate presents significant risks regarding cost overruns, request timeouts, and inconsistent performance.

This review recommends an **event-driven, decoupled architecture** that separates the fast API layer from the slow, resource-intensive media processing layer to achieve the optimal balance of cost efficiency and performance.

---

## 2. Current Architecture Evaluation

### 2.1 Proposed Infrastructure (Per `DEPLOYMENT.md`)
*   **Frontend:** AWS Amplify (React + Vite)
*   **Backend:** AWS App Runner or Amazon ECS Fargate (FastAPI)
*   **Database:** Amazon RDS for PostgreSQL
*   **Storage:** Amazon S3

### 2.2 Functional Requirements (Per Codebase)
*   The backend handles standard API requests (CRUD operations for users, courses, progress).
*   The backend also performs synchronous, compute-intensive tasks:
    *   **Video Transcoding:** Using `ffmpeg` to transcode uploaded videos (`backend/video_processing.py`).
    *   **Audio Transcription:** Using `faster-whisper` (a local ML model) to transcribe audio into text for AI course generation (`backend/video_processing.py`).
    *   **AI Generation:** Interacting with Google Gemini API for curriculum generation.

---

## 3. Findings & Architectural Risks

### 3.1 The "Fat Container" Problem (App Runner/Fargate)
Deploying the entire FastAPI application—including the Whisper ML model and FFmpeg—into a single container running on AWS App Runner or Fargate is an anti-pattern for this use case.

**Risks:**
*   **High Compute Costs:** Faster-Whisper requires significant CPU and memory to run efficiently. If the entire API runs on a large Fargate/App Runner instance to accommodate occasional video uploads, you are paying for unused high-compute capacity 99% of the time when the API is just serving lightweight CRUD requests.
*   **Request Timeouts:** Video transcoding and transcription are long-running processes (often taking minutes). AWS App Runner and API Gateway (often used with Fargate) have strict timeout limits (e.g., App Runner defaults to a short timeout, maxing out at a few minutes). Processing large videos synchronously in the HTTP request cycle (`/admin/generate-course`) will inevitably lead to timeouts and 504 Gateway errors.
*   **Scaling Inefficiency:** If there is a spike in video uploads, the entire API scales up, creating unnecessary database connections and overhead. Conversely, if there's a spike in standard API traffic, you are launching massive, expensive containers just to serve JSON.

### 3.2 Database Strategy (Amazon RDS PostgreSQL)
**Assessment:** Appropriate.
Amazon RDS for PostgreSQL is a solid, industry-standard choice for the transactional data (users, courses, progress). It balances performance with manageability. However, to optimize costs, a smaller instance type (e.g., `db.t4g.micro` or `small` powered by ARM Graviton processors) should be used initially, scaling up only when necessary.

### 3.3 Frontend Hosting (AWS Amplify)
**Assessment:** Appropriate.
AWS Amplify Hosting is highly cost-effective (often pennies per month for moderate traffic) and provides excellent performance globally via CloudFront.

---

## 4. Recommendations for Compute-Intensive Workloads

To prioritize **cost efficiency** while maintaining **acceptable performance**, the architecture must decouple the fast, lightweight API from the slow, heavy media processing.

### 4.1 Decoupled, Event-Driven Architecture (Recommended)

1.  **Lightweight API Layer (App Runner / Fargate):**
    *   The FastAPI application should be stripped of the heavy Whisper model and FFmpeg dependencies.
    *   It should run on small, cheap App Runner or Fargate instances (e.g., 1 vCPU, 2GB RAM).
    *   *Workflow:* When a user uploads a video, the API generates a **Presigned S3 Post URL**. The frontend uploads the video *directly* to S3, bypassing the API entirely.

2.  **Asynchronous Message Queue & Worker (SQS/Celery + EC2):**
    *   Configure the S3 bucket to trigger an event notification to an Amazon SQS queue whenever a new video is uploaded, or have the API push a task to a Celery queue (using Redis/SQS as a broker).

3.  **Dedicated Worker Layer (EC2 + Celery):**
    *   Instead of expensive, always-on Fargate tasks for processing, run a dedicated worker (e.g., Celery) on an Amazon EC2 instance to pull messages from the queue.
    *   **Cost Optimization:** Use **EC2 Spot Instances** if possible. Spot instances offer up to a 90% discount compared to On-Demand pricing.
    *   **Instance Sizing (Graviton):** Use instances optimized for compute and memory, specifically AWS Graviton (ARM64) instances (e.g., `c6g.large` or `m6g.large`). They are significantly cheaper and more performant than standard x86 instances.

### 4.2 Alternative: Fully Managed Services (MediaConvert & Transcribe)

Instead of managing EC2 workers running FFmpeg and Whisper, you could use AWS managed services.

*   **AWS Elemental MediaConvert:** For transcoding videos.
*   **Amazon Transcribe:** For extracting text from audio.

**Cost vs. Performance Tradeoff:**
*   *Pros:* Zero infrastructure to manage; highly reliable; scales infinitely.
*   *Cons:* **Higher variable costs**. Amazon Transcribe charges per minute of audio processed ($0.024/minute). MediaConvert charges per minute of video transcoded. For an LMS with high video volume, this can quickly become much more expensive than running an EC2 Spot instance.
*   *Conclusion:* Given the priority on cost optimization, the EC2 Worker/Spot instance approach running open-source tools (FFmpeg/Whisper) is the recommended path over fully managed ML/Media services.

---

## 5. Summary of Recommended AWS Architecture

| Component | Current Proposal (DEPLOYMENT.md) | Recommended Architecture | Reason for Change |
| :--- | :--- | :--- | :--- |
| **Frontend** | AWS Amplify | **AWS Amplify** | Keep: Cost-effective, CDN-backed. |
| **API Backend** | AWS App Runner (Fat Container) | **AWS App Runner (Slim Container)** | Change: Remove media processing libraries to allow running on the smallest, cheapest instance size. |
| **Database** | RDS PostgreSQL | **RDS PostgreSQL (Graviton)** | Keep: Standard. Use `db.t4g` (ARM64) instances for a ~20% cost savings and better performance. |
| **Media Upload** | Via FastAPI to S3 | **Direct to S3 via Presigned URL** | Change: Prevents tying up API resources handling large file streams. |
| **Media Processing** | Synchronous in API | **Async via SQS/Celery + EC2 Worker** | Change: Prevents timeouts; massively reduces compute costs by utilizing cheap instances only when needed. |

## 6. Database Migrations & Deployment

**Assessment:** The current codebase uses `backend/init_db.py` to create tables, which often drops and recreates them. This is a massive risk for production.
**Recommendation:** Implement a production-grade migration strategy using **Alembic**. During deployment (e.g., in the App Runner setup or a CI/CD pipeline), Alembic should run `alembic upgrade head` against the RDS instance.

## 7. Required Code Changes for Implementation

To implement the recommended architecture, the following changes to the codebase would be required (note: not implemented in this review):

1.  **Refactor `course_generation.py`:** Remove the synchronous call to `process_video_securely`. Instead, the endpoint should accept an S3 key (after the frontend uploads directly) and publish a message to SQS.
2.  **Create a Worker Application:** Create a new Python script (e.g., `worker.py`) that polls SQS, downloads the video from S3, runs FFmpeg and Faster-Whisper, and then updates the RDS database (or calls an internal API endpoint) with the results.
3.  **Update `requirements.txt`:** Remove `faster-whisper` and `ffmpeg-python` from the main API requirements to shrink the Docker image size. Add them to a separate `worker-requirements.txt`.
4.  **Frontend Updates:** Update the React frontend to support direct-to-S3 uploads using presigned URLs and implement a polling or WebSocket mechanism to notify the user when the async course generation is complete.