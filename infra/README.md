# infra

Docker setup that builds the client and server into one image and serves both on port **3020**.

## Build & run

```bash
cd infra
REPOS_HOST_DIR=/home/youruser/projects docker compose up --build
```

Open http://localhost:3020.

`REPOS_HOST_DIR` (default `/home`) is mounted read-only at `/repos` inside the container. In the UI, paste paths like `/repos/<your-repo>` when prompted for a repo path.

## How it works

- Stage 1 builds the Vite client into `client/dist`.
- Stage 2 compiles the TypeScript server into `server/dist`.
- Runtime stage installs only server prod deps, includes `git` (needed by `simple-git`), serves the API on `:3020`, and serves the built client from `/app/public`.
