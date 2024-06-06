#!/bin/bash
set -e
docker stop `docker ps -q`
docker rm `docker ps -qa`