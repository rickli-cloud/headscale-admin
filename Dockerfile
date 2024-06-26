FROM golang:latest as build

LABEL maintainer=github/rickli-cloud

WORKDIR /work

COPY . .

ENV CGO_ENABLED=0
ENV GOOS=linux

RUN GOARCH=$TARGETARCH go build $PWD/cmd/main.go


FROM scratch

COPY --from=build /work/main /hsadm

ENTRYPOINT [ "/hsadm" ]

