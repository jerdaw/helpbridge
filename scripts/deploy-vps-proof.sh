#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "usage: $0 /path/to/env-file" >&2
  exit 1
fi

env_file="$1"
app_dir="$(cd "$(dirname "$0")/.." && pwd)"
image_name="kingston-care-connect-web"
tag="$(git -C "$app_dir" rev-parse --short HEAD 2>/dev/null || date -u +%Y%m%d%H%M%S)"
container_name="kingston-care-connect-web"
host_bind="127.0.0.1:3300:3000"

if [[ ! -f "$env_file" ]]; then
  echo "env file not found: $env_file" >&2
  exit 1
fi

docker build -t "${image_name}:${tag}" "$app_dir"

if docker ps -a --format '{{.Names}}' | grep -Fxq "$container_name"; then
  docker rm -f "$container_name" >/dev/null
fi

docker run -d \
  --name "$container_name" \
  --restart unless-stopped \
  --env-file "$env_file" \
  -p "$host_bind" \
  "${image_name}:${tag}"

echo "container=${container_name}"
echo "image=${image_name}:${tag}"
echo "health_url=http://127.0.0.1:3300/api/v1/health"
