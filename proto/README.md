# Proto

> These definitions come directly from Headscale's repo. Best effort to keep them in sync.

- `v1-0.22.3` From release
- `v1-0.23.0-latest` Latest commit [inside /proto](https://github.com/juanfont/headscale/commits/main/proto): `58bd38a`

Protocol buffers are needed to communicate with Headscale over the GRPC API.

## Requirements

### Cli tools

Some command line tools are required to generate the gateway.

- Protoc

### Go packages

```sh
go install \
  github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-grpc-gateway \
  github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-openapiv2 \
  google.golang.org/protobuf/cmd/protoc-gen-go \
  google.golang.org/grpc/cmd/protoc-gen-go-grpc
```

> If the plugins are not found make sure your PATH includes the GOPATH `export PATH=$PATH:$(go env GOPATH)/bin`.

## Generate

```sh
protoc -I . \
  --go_out ../gen --go_opt paths=source_relative \
  --go-grpc_out ../gen --go-grpc_opt paths=source_relative \
  --grpc-gateway_out ../gen --grpc-gateway_opt paths=source_relative \
  --openapiv2_out ../gen \
  headscale/<VERSION>/headscale.proto
```
