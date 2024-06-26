# Deploy

> [!NOTE]  
> Headscale had some breaking changes in the latest beta versions. It is recommended to use version `0.22.3` for everything to work properly.

## Container

The recommended way to deploy headscale-admin.

Example `docker-compose.yaml`:

> No authentication but lets the UI only listen on `127.0.0.1:8080`.

```yaml
version: "3.9" # legacy
name: headscale

volumes:
  headscale-data:
  headscale-socket:

services:
  headscale:
    image: headscale/headscale:0.22.3
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
    image: ghcr.io/rickli-cloud/headscale-admin:latest
    container_name: headscale-admin
    restart: always
    environment:
      HSADM_CONFIG_PATH: /headscale-config.yaml
    volumes:
      - $PWD/config.yaml:/headscale-config.yaml:ro
      - headscale-socket:/var/run/headscale:ro
    ports:
      - 127.0.0.1:8080:8000
```
