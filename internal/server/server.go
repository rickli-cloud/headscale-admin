package server

import (
	"context"

	"github.com/gorilla/mux"
	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"

	gw "github.com/rickli-cloud/headscale-admin/gen/headscale/v0.23.0-beta1"
	"github.com/rickli-cloud/headscale-admin/internal/config"
	"github.com/rickli-cloud/headscale-admin/internal/oauth"
)

func Create(ctx context.Context, grpcServerEndpoint *string) (*mux.Router, error) {
	router := mux.NewRouter()

	router.HandleFunc("/healthz", healthz)

	if config.Cfg.Mode == "grpc" {
		router.HandleFunc("/oauth/callback", oauth.HandleCallback)
	}

	appRouter := router.PathPrefix(config.Cfg.Base_Path).Subrouter()

	if config.Cfg.Mode == "grpc" {
		if !config.Cfg.Unsafe_disable_authentication {
			appRouter.Use(oauth.AuthMiddleware)
		}

		opts := []grpc.DialOption{grpc.WithTransportCredentials(insecure.NewCredentials())}

		grpcMux := runtime.NewServeMux()

		if err := gw.RegisterHeadscaleServiceHandlerFromEndpoint(ctx, grpcMux, *grpcServerEndpoint, opts); err != nil {
			return nil, err
		}

		appRouter.PathPrefix("/api").Handler(grpcMux)
	}

	var spa SpaHandler
	appRouter.PathPrefix("/").Handler(spa)

	return router, nil
}
