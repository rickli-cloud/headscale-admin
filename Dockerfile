FROM golang:latest as build

WORKDIR /work

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=$TARGETARCH go build $PWD/cmd/main.go


FROM scratch

LABEL maintainer=github/rickli-cloud

# ca-certificates are required to reach out to the OAuth Endpoint. 
COPY --from=build /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

COPY --from=build /work/main /hsadm

ENTRYPOINT [ "/hsadm" ]
