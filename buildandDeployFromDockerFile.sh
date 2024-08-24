#!/bin/bash

# Variables
PEM_KEY_PATH="C:\Users\rocin\github\inf\infinity-node\privatekey.pem"     
USER="ubuntu"                                                   
HOST="ec2-13-233-142-101.ap-south-1.compute.amazonaws.com"  

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
echo $REPO_NAME
echo $DIRECTORY

# Commands to run on the server
REMOTE_COMMANDS=$(cat <<'EOF'
echo "Running remote commands..."

# cd $DIRECTORY if exits
if [ -d "$DIRECTORY" ]; then
    cd $DIRECTORY
else
    echo "Directory does not exist $DIRECTORY"
    exit 1
fi

# cd to the repository
if [ -d "$REPO_NAME" ]; then
    cd $REPO_NAME
else
    echo "Directory does not exist $REPO_NAME"
    exit 1
fi

# vars
directory=$(shuf -i 1000000-9999999 -n 1)$(cat /dev/urandom | tr -dc 'a-z' | fold -w 7 | head -n 1)
container_name="${REPO_NAME}_${directory}"
temp_container_name="${REPO_NAME}_${directory}_temp"

# Build the Docker image
echo "Building Docker image..."
sudo docker build -t "$container_name" .

# Create a custom Docker network if it does not exist
echo "Creating Docker network..."
if ! sudo docker network ls --format '{{.Name}}' | grep -w "$container_name" > /dev/null; then
    sudo docker network create "$container_name"
fi


# Run the container temporarily to inspect its ports
echo "Running Docker container temporarily to inspect ports..."
CONTAINER_ID=$(sudo docker run -d --network "$container_name" --name "$temp_container_name" "$REPO_NAME")

# Inspect the container to find all exposed ports
EXPOSED_PORTS=$(sudo docker inspect --format='{{range $p, $conf := .NetworkSettings.Ports}}{{$p}} {{end}}' "$CONTAINER_ID")
PORT_LIST=($EXPOSED_PORTS)

# Function to find available port
find_available_port() {
    while :; do
        PORT=$(shuf -i 1024-65535 -n 1)
        ss -lpn | grep -q ":$PORT " || break
    done
    echo $PORT
}

# Map container ports to random available external ports
PORT_MAPPINGS=""
declare -A PORT_MAP
for PORT in "${PORT_LIST[@]}"; do
    INTERNAL_PORT=$(echo $PORT | cut -d'/' -f1)
    AVAILABLE_PORT=$(find_available_port)
    PORT_MAPPINGS="$PORT_MAPPINGS -p $AVAILABLE_PORT:$INTERNAL_PORT"
    PORT_MAP["$INTERNAL_PORT"]="$AVAILABLE_PORT"
done

# Stop and remove the temporary container
echo "Removing temporary container..."
sudo docker rm -f "$CONTAINER_ID"

# Run the container with mapped ports and a specific name
echo "Running Docker container..."
sudo docker run -d --network "$container_name" $PORT_MAPPINGS "$container_name"

# Output the port mappings for reference
PORTS_COMMA_SEPARATED=""
echo "Port mappings:"
for PORT in "${!PORT_MAP[@]}"; do
    echo "Container port $PORT mapped to external port ${PORT_MAP[$PORT]}"
    PORTS_COMMA_SEPARATED="${PORTS_COMMA_SEPARATED}${PORT_MAP[$PORT]},"
done

# Remove the trailing comma
echo $PORTS_COMMA_SEPARATED

EOF
)

# SSH into the server and run the commands
ssh -i "$PEM_KEY_PATH" "$USER@$HOST" "REPO_NAME=$REPO_NAME DIRECTORY=$DIRECTORY bash -s" << EOF
$REMOTE_COMMANDS
EOF