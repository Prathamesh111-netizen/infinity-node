#!/bin/bash -x

#!/bin/bash

# Function to print usage instructions
usage() {
    echo "Usage: $0 -r <githublink> [-t <token>]"
    echo "  -r <githublink> : The GitHub repository URL (mandatory)"
    echo "  -d <directory-name>      : directory-name(projectId+deploymentId) (mandatory)"
    echo "  -t <token>      : Personal Access Token for private repositories (optional)"
    exit 1
}

# Parse command-line arguments
while getopts "r:t:d:" opt; do
    case ${opt} in
        r)
            GITHUBLINK=$OPTARG
            ;;
        t)
            TOKEN=$OPTARG
            ;;
        d)
            DIRECTORY=$OPTARG
            ;;
        \?)
            usage
            ;;
    esac
done

# Check if GITHUBLINK is provided
if [ -z "${GITHUBLINK}" ]; then
    usage
fi

# Check if DIRECTORY is provided
if [ -z "${DIRECTORY}" ]; then
    usage
fi

# Extract repository name from GitHub URL
REPO_NAME=$(basename -s .git "${GITHUBLINK}")

# Determine the repository URL based on token presence
if [ -n "${TOKEN}" ]; then
    REPO_URL="https://${TOKEN}@${GITHUBLINK#https://}"
else
    REPO_URL="${GITHUBLINK}"
fi

echo "Repository url: ${REPO_URL}"

echo "Starting connection script"

# Define commands to be executed on the remote server
COMMANDS=$(cat <<EOF
echo "Starting remote commands..."

# cd to the directory if it exists or create it
if [ -d "${DIRECTORY}" ]; then
    echo "Directory ${DIRECTORY} exists. Changing to the directory..."
    cd "${DIRECTORY}" || exit
else
    echo "Directory ${DIRECTORY} does not exist. Creating the directory..."
    mkdir "${DIRECTORY}"
    cd "${DIRECTORY}" || exit
fi

# Check if the repository directory exists
if [ -d "${REPO_NAME}" ]; then
    echo "Repository directory ${REPO_NAME} exists. Pulling latest changes..."
    cd "${REPO_NAME}" || exit
    git pull
else
    echo "Repository directory ${REPO_NAME} does not exist. Cloning repository..."
    git clone "${REPO_URL}"
fi
EOF
)

# Execute remote commands via SSH
ssh -i "C:\Users\rocin\github\inf\infinity-node\privatekey.pem" ubuntu@ec2-13-233-142-101.ap-south-1.compute.amazonaws.com "$COMMANDS"
