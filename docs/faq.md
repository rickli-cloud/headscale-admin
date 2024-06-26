# Frequently asked questions

### Why no authentication?

Authentication and authorization is a complex topic. I don't see an implementation that fits for most people. On top of comes that i am not comfortable enough to implement and maintain authentication/authorization in a language that i rarely use.

There are a lot of open source solutions to secure the UI. Locking down access over networking and or a proxy is not that hard nowadays if you know what you are doing. Some projects that might help:

- [Kong](https://github.com/Kong/kong)
- [Teleport](https://github.com/gravitational/teleport)
- [Traefik](https://traefik.io/) using [forwardAuth](https://doc.traefik.io/traefik/middlewares/http/forwardauth/)
- [Warpgate](https://github.com/warp-tech/warpgate)
