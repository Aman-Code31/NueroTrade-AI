# 1. Use Python 3.11 to match local dev setup and prevent Google deprecation warnings
FROM python:3.11-slim

# 2. Prevent Python from buffering logs
ENV PYTHONUNBUFFERED=1

# 3. Set working directory
WORKDIR /app

# 4. Copy requirements file
COPY requirements.txt /app/

# 5. Install CPU-only PyTorch v2.6+ (fixes CVE-2025-32434 security check in HuggingFace transformers)
RUN pip install --no-cache-dir "torch>=2.6.0" --index-url https://download.pytorch.org/whl/cpu

# 6. Install remaining dependencies
RUN pip install --no-cache-dir -r requirements.txt

# 7. Copy project files into container
COPY . /app/

# 8. Expose port 8000
EXPOSE 8000

# 9. Start the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]