#!/bin/bash
set -e

export EFSS=research-drive-poc.pondersource.net

echo Please edit this file and run the commands one-by-one so you can check if it all works
exit 0

apt install -y certbot docker.io
certbot certonly --standalone

docker network inspect testnet >/dev/null 2>&1 || docker network create testnet

# dereference symlinks to /etc/letsencrypt/archive/$EFSS/fullchain*.pem
# and /etc/letsencrypt/archive/$EFSS/privkey*.pem,
# then safely copy them into the container from a full fs path
cp /etc/letsencrypt/live/$EFSS/fullchain.pem /root/fullchain.pem
cp /etc/letsencrypt/live/$EFSS/privkey.pem /root/privkey.pem

docker pull pondersource/dev-stock-oc1-sciencemesh
