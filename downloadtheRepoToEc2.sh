#!/bin/bash -x

echo "Starting connection script"
# Ensure a GitHub repository URL is provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <github-repo-url>"
    exit 1
fi


GITHUB_REPO_URL=$1
REPO_NAME=$(basename "$GITHUB_REPO_URL" .git)

echo "Starting connection script"

# Define commands to be executed on the remote server
COMMANDS=$(cat <<EOF
echo "Starting remote commands..."
if [ -d "$REPO_NAME" ]; then
    echo "Directory $REPO_NAME already exists. Pulling latest changes..."
    cd "$REPO_NAME" && git pull
else
    echo "Directory $REPO_NAME does not exist. Cloning repository..."
    git clone "$GITHUB_REPO_URL"
fi

if [ -d "$REPO_NAME" ]; then
    echo "Building and running Docker container..."
    cd "$REPO_NAME"
else
    echo "Error: Directory $REPO_NAME does not exist or Already exists"
fi

sudo docker build -t "$REPO_NAME" .
sudo docker run -d -p 80:80 "$REPO_NAME"

EOF
)

# Execute remote commands via SSH
ssh -i "C:\Users\rocin\github\inf\infinity-node\privatekey.pem" ubuntu@ec2-13-233-142-101.ap-south-1.compute.amazonaws.com "$COMMANDS"

echo "Connection ended"
