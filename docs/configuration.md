# Configuration

## Headscale

Headscale itself is intended to be configured with `policy.mode = database`. Using the file mode is not tested!

## Headscale-admin

Headscale-admin can either be configured with environment variables or using the headscale configuration file.

| Yaml field          | Environment variable    | default                           | Description                                                         |
| ------------------- | ----------------------- | --------------------------------- | ------------------------------------------------------------------- |
|                     | `HSADM_CONFIG_PATH`     |                                   | The location of the headscale yaml configuration.                   |
| `admin_listen_addr` | `HSADM_LISTEN_ADDR`     | 0.0.0.0:8000                      | Server listen address.                                              |
| `unix_socket`       | `HSADM_SOCKET_ADDR`     | /var/run/headscale/headscale.sock | The headscale unix socket.                                          |
|                     | `HSADM_SOCKET_PROTOCOL` | unix                              | Socket protocol. Change if socket is behind a proxy.                |
|                     | `HSADM_MODE`            | auto                              | Either grpc, rest or auto. Tries to use grpc is socket is specified |
