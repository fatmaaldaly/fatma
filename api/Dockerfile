# Use Python 3.10-slim as the base image
FROM python:3.10-slim

# Label for maintaining the Dockerfile (you can leave or modify this)
LABEL maintainer="https://github.com/AchilleasKn"

# Upgrade pip
RUN pip install --upgrade pip

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install dependencies from requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port Flask will run on (usually 5000)
EXPOSE 5000

# Run the Flask API
CMD ["python", "api.py"]
