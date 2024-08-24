#!/bin/bash

# Exit script on error
set -e

COMMANDS=$(cat <<EOF
# Get the directory name
DIR_NAME=$(basename "$PWD")

# Function to find an available port
find_available_port() {
    local PORT
    while true; do
        PORT=$((RANDOM + 10000)) # Choose a random port number above 10000
        if ! lsof -i:$PORT > /dev/null; then
            echo $PORT
            return
        fi
    done
}

# Extract ports from Dockerfile
EXPOSE_PORTS=$(grep -i '^EXPOSE' Dockerfile | awk '{print $2}')

# Convert the ports into a list
PORT_LIST=($EXPOSE_PORTS)

# Build the Docker image
echo "Building Docker image..."
docker build -t "$DIR_NAME" .

# Create a custom Docker network if it does not exist
echo "Creating Docker network..."
if ! docker network ls --format '{{.Name}}' | grep -w "$DIR_NAME" > /dev/null; then
    docker network create "$DIR_NAME"
fi

# Map container ports to random available external ports
PORT_MAPPINGS=""
for PORT in "${PORT_LIST[@]}"; do
    AVAILABLE_PORT=$(find_available_port)
    PORT_MAPPINGS="$PORT_MAPPINGS -p $AVAILABLE_PORT:$PORT"
done

# Run the container with mapped ports and a specific name
echo "Running Docker container..."
docker run -d --network "$DIR_NAME" --name "$DIR_NAME" $PORT_MAPPINGS "$DIR_NAME"

# Output the port mappings for reference
echo "Port mappings:"
for PORT in "${PORT_LIST[@]}"; do
    AVAILABLE_PORT=$(echo "$PORT_MAPPINGS" | grep -oP "(?<=-p $PORT:)\d+")
    echo "Container port $PORT mapped to external port $AVAILABLE_PORT"
done
EOF
)


# Execute remote commands via SSH
ssh -i "C:\Users\rocin\github\inf\infinity-node\privatekey.pem" ubuntu@ec2-13-233-142-101.ap-south-1.compute.amazonaws.com "$COMMANDS"