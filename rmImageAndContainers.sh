#!/bin/bash

# Exit script on error
set -e

COMMANDS=$(cat <<EOF
# Get the directory name
DIR_NAME=$(basename "$PWD")

# Stop and remove containers with the given name
echo "Stopping and removing containers with the name '$DIR_NAME'..."
CONTAINERS=$(docker ps -a -q --filter "name=$DIR_NAME")
if [ -n "$CONTAINERS" ]; then
    docker stop $CONTAINERS
    docker rm $CONTAINERS
else
    echo "No containers found with the name '$DIR_NAME'."
fi

# Remove images with the given name
echo "Removing images with the name '$DIR_NAME'..."
IMAGES=$(docker images -q "$DIR_NAME")
if [ -n "$IMAGES" ]; then
    docker rmi $IMAGES
else
    echo "No images found with the name '$DIR_NAME'."
fi

# Remove Docker network with the given name
echo "Removing Docker network with the name '$DIR_NAME'..."
NETWORKS=$(docker network ls --filter "name=$DIR_NAME" -q)
if [ -n "$NETWORKS" ]; then
    docker network rm $NETWORKS
else
    echo "No network found with the name '$DIR_NAME'."
fi

echo "Cleanup completed."
EOF
)

# Execute remote commands via SSH
ssh -i "C:\Users\rocin\github\inf\infinity-node\privatekey.pem" ubuntu@ec2-13-233-142-101.ap-south-1.compute.amazonaws.com "$COMMANDS"