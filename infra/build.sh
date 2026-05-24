#!/usr/bin/env bash
# Build (and optionally run) the git-helper-ui Docker image.
#
# Usage:
#   ./infra/build.sh           # build the image
#   ./infra/build.sh --up      # build + start the container
#   ./infra/build.sh --no-cache
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

UP=0
COMPOSE_ARGS=()
for arg in "$@"; do
  case "$arg" in
    --up) UP=1 ;;
    *)    COMPOSE_ARGS+=("$arg") ;;
  esac
done

echo "==> Building image (docker compose build ${COMPOSE_ARGS[*]:-})"
docker compose build "${COMPOSE_ARGS[@]}"

if [[ "$UP" -eq 1 ]]; then
  echo "==> Starting container"
  docker compose up -d
  echo "==> UI available at http://localhost:3020"
fi
