#!/bin/bash

# usage() {
#     echo "Usage: $0 -r <githublink> [-t <token>]"
#     echo "  -r <githublink> : The GitHub repository URL (mandatory)"
#     echo "  -d <directory>      : Personal Access Token for private repositories (optional)"
#     exit 1
# }

# Parse command-line arguments
while getopts "r:d:" opt; do
    case ${opt} in
        r)
            GITHUBLINK=$OPTARG
            ;;
        d)
            DIRECTORY=$OPTARG
            ;;
        \?)
            usage
            ;;
    esac
done

REPO_NAME=$(basename -s .git "${GITHUBLINK}")


COMMANDS=$(cat <<EOF
# cd $DIRECTORY if exits
if [ -d "$DIRECTORY" ]; then
    cd $DIRECTORY
else
    echo "Directory does not exist"
    exit 1
fi

# cd to the repository
if [ -d "$REPO_NAME" ]; then
    cd $REPO_NAME
else
    echo "Directory does not exist"
    exit 1
fi

# Check for the presence of docker-compose.yml and Dockerfile
if [ -f "docker-compose.yml" ]; then
    echo "DockerCompose"
elif [ -f "Dockerfile" ]; then
    echo "Dockerfile"
else
    echo "Neither Docker Compose nor Dockerfile found"
fi
EOF
)

ssh -i "C:\Users\rocin\github\inf\infinity-node\privatekey.pem" ubuntu@ec2-13-233-142-101.ap-south-1.compute.amazonaws.com "$COMMANDS"
