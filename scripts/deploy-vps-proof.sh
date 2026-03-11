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

build_arg_app_url=""
build_arg_base_url=""

if app_url="$(grep -E '^NEXT_PUBLIC_APP_URL=' "$env_file" | tail -n 1 | cut -d= -f2-)"; then
  if [[ -n "$app_url" ]]; then
    build_arg_app_url=(--build-arg "NEXT_PUBLIC_APP_URL=$app_url")
  fi
fi

if base_url="$(grep -E '^NEXT_PUBLIC_BASE_URL=' "$env_file" | tail -n 1 | cut -d= -f2-)"; then
  if [[ -n "$base_url" ]]; then
    build_arg_base_url=(--build-arg "NEXT_PUBLIC_BASE_URL=$base_url")
  fi
fi

docker build "${build_arg_app_url[@]}" "${build_arg_base_url[@]}" -t "${image_name}:${tag}" "$app_dir"

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
