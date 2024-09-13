# Develop

### CORS restrictions

CORS prevents access to the headscale REST API from a different domain.
To combat this Vite spins up a proxy together with the dev server.

## Container

### Headscale config

```sh
docker volume create --driver local --opt type=none --opt o=bind --opt device=$PWD/.devcontainer/headscale headscale-config
```

### Dev-container

Once inside you can start a dev server with:

```sh
npm run dev
```

## Local

> If you do not have a headscale instance running you could use docker to run one.
>
> ```sh
> docker compose -f .devcontainer/frontend/docker-compose.yaml up headscale
>
> # Grab a api key
> docker exec headscale headscale apikey create
> ```

Specify the headscale API host

```sh
echo "HEADSCALE_HOST=<HOST>" >> .env
```

Install dependencies

```sh
npm install
```

Start the dev server

```sh
npm run dev
```
