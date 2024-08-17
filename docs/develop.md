# Develop

## Dev-container

### Backend

1. Create headscale config

    ```sh
    docker volume create --driver local --opt type=none --opt o=bind --opt device=$PWD/.devcontainer/backend/headscale headscale-config
    ```

2. Start dev-container

    > The frontend gets (re)-built upon (re)-starting the container. On first start you might have to wait a minute for it to complete.

3. Start dev-server

    ```sh
    go run cmd/main.go
    ```

### Frontend

1. Create headscale config

    ```sh
    docker volume create --driver local --opt type=none --opt o=bind --opt device=$PWD/.devcontainer/frontend/headscale headscale-config
    ```

2. Start dev-container

3. Start dev-server

    ```sh
    npm run devcontainer 

    # Same as:
    npx vite dev --host
    ```
