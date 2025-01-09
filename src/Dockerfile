 
FROM python:3.12-slim-bullseye
 
# Set working directory
WORKDIR /app
 
# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    gnupg \
    gcc \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*
 
# Install dependencies  # ...existing code...
 
ADD https://astral.sh/uv/install.sh /install.sh
RUN chmod -R 655 /install.sh && /install.sh && rm /install.sh
COPY ./requirements.txt .
    
RUN /root/.local/bin/uv pip install --system --no-cache -r requirements.txt

RUN playwright install --with-deps chromium
 
RUN apt-get clean
 
COPY . .
# Expose the Streamlit port
EXPOSE 80
 
# Run the Streamlit application
CMD ["streamlit", "run", "app.py", "--server.port=80"]
 