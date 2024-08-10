# Configuration

## Headscale

Headscale itself is intended to be configured with `policy.mode = database`. Using the file mode is not tested!

## Headscale-admin

Headscale-admin can either be configured with environment variables or using the headscale configuration file.

| Yaml field           | Environment variable       | default                           | Description                                                         |
| -------------------- | -------------------------- | --------------------------------- | ------------------------------------------------------------------- |
|                      | `HSADM_CONFIG_PATH`        |                                   | The location of the headscale yaml configuration                    |
| `admin_listen_addr`  | `HSADM_LISTEN_ADDR`        | 0.0.0.0:8000                      | Server listen address                                               |
| `admin_base_path`    | `HSADM_BASE_PATH`          | /                                 | App base path                                                       |
| `admin_mode`         | `HSADM_MODE`               | auto                              | Either grpc, rest or auto. Tries to use grpc if socket is specified |
| `admin_server_url`   | `HSADM_SERVER_URL`         |                                   | Used for OAuth redirect_uri. **Required when using grpc mode**      |
| `unix_socket`        | `HSADM_SOCKET_ADDR`        | /var/run/headscale/headscale.sock | The headscale unix socket                                           |
| `unix_socket_proto`  | `HSADM_SOCKET_PROTOCOL`    | unix                              | Socket protocol. Change if socket is behind a proxy                 |
| `oidc.issuer`        | `HSADM_OIDC_ISSUER`        |                                   | **Required when using grpc mode**                                   |
| `oidc.client_secret` | `HSADM_OIDC_CLIENT_SECRET` |                                   | **Required when using grpc mode**                                   |
| `oidc.client_id`     | `HSADM_OIDC_CLIENT_ID`     |                                   | **Required when using grpc mode**                                   |
| `oidc.scope`         | `HSADM_OIDC_OIDC_SCOPES`   |                                   | **Required when using grpc mode**                                   |
