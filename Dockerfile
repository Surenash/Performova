FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Install system dependencies (needed for packages like psycopg2, ffmpeg, etc.)
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend /app/backend

# Set python path
ENV PYTHONPATH=/app

# Expose port
EXPOSE 8000

# Command to run
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
