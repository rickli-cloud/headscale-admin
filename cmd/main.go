package main

import (
	"context"
	"log"
	"net/http"

	"google.golang.org/grpc/grpclog"

	"github.com/rickli-cloud/headscale-admin/internal/config"
	"github.com/rickli-cloud/headscale-admin/internal/oauth"
	"github.com/rickli-cloud/headscale-admin/internal/server"
	"github.com/rickli-cloud/headscale-admin/internal/utils"
)

func main() {
	config.Load()

	var grpcServerEndpoint string
	var ctx = context.Background()

	if config.Cfg.Mode == "grpc" {
		if !config.Cfg.Unsafe_disable_authentication {
			if err := oauth.Init(ctx); err != nil {
				log.Fatal("Failed to load OAuth provider: ", err)
			}
		}

		if config.Cfg.Socket_Proto == "unix" {
			if !utils.IsSocket(config.Cfg.Socket_Addr) {
				log.Fatal("Headscale-socket is not a unix socket! Got: ", config.Cfg.Socket_Addr)
			}
		}

		grpcServerEndpoint = config.Cfg.Socket_Proto + "://" + config.Cfg.Socket_Addr
		log.Println("GRPC endpoint:", grpcServerEndpoint)
	}

	mux, err := server.Create(ctx, &grpcServerEndpoint)
	if err != nil {
		grpclog.Fatal(err)
	}

	httpServer := &http.Server{
		Addr:    config.Cfg.Listen_Addr,
		Handler: mux,
	}

	log.Printf("Serving on %s", config.Cfg.Listen_Addr)
	grpclog.Fatal(httpServer.ListenAndServe())
}
