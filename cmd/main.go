package main

import (
	"context"
	"log"
	"net/http"

	"google.golang.org/grpc/grpclog"

	"github.com/rickli-cloud/headscale-admin/internal/config"
	"github.com/rickli-cloud/headscale-admin/internal/server"
	"github.com/rickli-cloud/headscale-admin/internal/utils"
)

func main() {
	config.Load()
	
	if config.Cfg.Socket.Protocol == "unix" {	
		if !utils.IsSocket(config.Cfg.Socket.Addr) {
			log.Fatal("Headscale-socket is not a unix socket! Got: ", config.Cfg.Socket.Addr)
		}
	}
	
	var grpcServerEndpoint = config.Cfg.Socket.Protocol + "://" + config.Cfg.Socket.Addr
	log.Println("GRPC endpoint:", grpcServerEndpoint)
	
	mux, err := server.Create(context.Background(), &grpcServerEndpoint)
	if err != nil {
		grpclog.Fatal(err)
	}

	httpServer := &http.Server{
		Addr: config.Cfg.Listen_Addr,
		Handler: mux,
	}

	log.Println("Serving on", config.Cfg.Listen_Addr)
	grpclog.Fatal(httpServer.ListenAndServe())
}
