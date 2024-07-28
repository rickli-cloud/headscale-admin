package server

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"

	gw "github.com/rickli-cloud/headscale-admin/gen/headscale/v1-0.23.0-beta1"
	"github.com/rickli-cloud/headscale-admin/internal/config"
)

func Create(ctx context.Context, grpcServerEndpoint *string) (*mux.Router, error) {
  router := mux.NewRouter()
  
  router.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
    json.NewEncoder(w).Encode(map[string]bool{"ok": true})
	})
  
  grpcMux := runtime.NewServeMux()

  if config.Cfg.Mode == "grpc" {
    opts := []grpc.DialOption{grpc.WithTransportCredentials(insecure.NewCredentials())}

    if err := gw.RegisterHeadscaleServiceHandlerFromEndpoint(ctx, grpcMux,  *grpcServerEndpoint, opts); err != nil {
      return nil, err
    }

    router.PathPrefix("/api").Handler(grpcMux)
  }
  
  var spa SpaHandler
  router.PathPrefix("/").Handler(spa)

  return router, nil
}
