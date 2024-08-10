# Deploy

## Container

The recommended way to deploy headscale-admin is docker. It is possible without but you will have to build everything from scratch.

### REST API

Due to CORS restrictions you will probably have to use a proxy to make it share the same domain as headscale. The app can be served on `^/admin` to allow for this.

```yaml
# docker-compose.yaml 
version: "3.9"

networks:
  proxy:
    name: proxy
    external: true

services:
  headscale-admin:
    image: ghcr.io/rickli-cloud/headscale-admin:${HSADM_VERSION:-latest}
    container_name: headscale-admin
    restart: always
    environment:
      HSADM_BASE_PATH: /admin
      HSADM_MODE: rest # optional
    expose:
      - 8000
```

### GRPC API

Make sure to share the headscale UNIX socket over a docker volume.
Easiest way to configure things is with the headscale yaml config.

```yaml
# docker-compose.yaml 
version: "3.9"

volumes:
  headscale-data:
  headscale-socket:

services:
  headscale:
    image: headscale/headscale:${HEADSCALE_VERSION:0.22.3}
    container_name: headscale
    restart: always
    command: headscale serve
    volumes:
      - $PWD/config.yaml:/etc/headscale/config.yaml:ro
      - headscale-data:/var/lib/headscale:rw
      - headscale-socket:/var/run/headscale:rw
    ports:
      - 80:80
      - 443:443

  headscale-admin:
    image: ghcr.io/rickli-cloud/headscale-admin:${HSADM_VERSION:-latest}
    container_name: headscale-admin
    restart: always
    environment:
      HSADM_CONFIG_PATH: /headscale.yaml
    volumes:
      - $PWD/config.yaml:/headscale.yaml:ro
      - headscale-socket:/var/run/headscale:ro
    ports:
      - 127.0.0.1:8080:8000
```

## Version matrix

| Headscale    | Headscale-admin |
| ------------ | --------------- |
| 0.22.3       | 1.0.x           |
| 0.23.0-beta1 | 1.1.0-pre       |
