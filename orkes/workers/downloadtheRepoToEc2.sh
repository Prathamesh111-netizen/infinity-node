#!/bin/bash -x
echo "Starting connection script"

COMMANDS=$(cat <<EOF
echo "Starting remote commands..."
git clone https://github.com/shekeriev/simple-docker-image.git
cd simple-docker-image
sudo docker build -t simple-docker-image .
sudo docker run -d -p 80:80 simple-docker-image
EOF
)

ssh -vi "C:\Users\rocin\github\inf\infinity-node\orkes\workers\privatekey.pem" ubuntu@ec2-13-233-142-101.ap-south-1.compute.amazonaws.com  "$COMMANDS"

echo "Connection ended"