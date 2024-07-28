FROM golang:latest as build

WORKDIR /work

COPY . .

ENV CGO_ENABLED=0
ENV GOOS=linux
ENV GOARCH=$TARGETARCH

RUN go build $PWD/cmd/main.go


FROM scratch

LABEL maintainer=github/rickli-cloud

COPY --from=build /work/main /hsadm

ENTRYPOINT [ "/hsadm" ]

