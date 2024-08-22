package server

import (
	"context"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"

	gw "github.com/rickli-cloud/headscale-admin/gen/headscale/v0.23.0-beta1"
	"github.com/rickli-cloud/headscale-admin/internal/config"
	"github.com/rickli-cloud/headscale-admin/internal/oauth"
)

func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Do stuff here
		log.Println(r.RequestURI)
		// Call the next handler, which can be another middleware in the chain, or the final handler.
		next.ServeHTTP(w, r)
	})
}

func Create(ctx context.Context, grpcServerEndpoint *string) (*mux.Router, error) {
	router := mux.NewRouter()
	var spa SpaHandler

	router.Use(loggingMiddleware)

	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, "/admin/", http.StatusPermanentRedirect)
	})

	router.Handle("/favicon.ico", spa)
	router.HandleFunc("/healthz", healthz)

	if config.Cfg.Mode == "grpc" {
		router.HandleFunc("/oauth/callback", oauth.HandleCallback)
	}

	appRouter := router.PathPrefix("/admin").Subrouter()

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

	appRouter.PathPrefix("/").Handler(spa)

	return router, nil
}
