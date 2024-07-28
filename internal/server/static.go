package server

import (
	"io/fs"
	"net/http"
	"os"
	"path/filepath"

	"github.com/rickli-cloud/headscale-admin/frontend"
	"github.com/rickli-cloud/headscale-admin/internal/config"
)

type SpaHandler struct {}

func authDisabled() string {
	if config.Cfg.Mode == "grpc" {
		return "true"
	}
	return "false"
}

func (h SpaHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// get the absolute path to prevent directory traversal
	path, err := filepath.Abs(r.URL.Path)
	if err != nil {
		// if we failed to get the absolute path respond with a 400 bad request and stop
		http.Error(w, "Internal server error", http.StatusBadRequest)
		return
	}

	// if the request is for the environment send them our custom
	if path == "/admin/_app/env.js" {
		w.Header().Set("Content-Type", "application/javascript")
		w.WriteHeader(http.StatusAccepted)
		w.Write([]byte("export const env={\"PUBLIC_DISABLE_TOKEN_AUTH\":" + authDisabled() +"}"))
		return
	}

	// prepend the path with the path to the static directory
	path = filepath.Join(frontend.StaticPath, path)
	_, err = frontend.Folder.Open(path)
	
	if os.IsNotExist(err) || path == "build" {
		index, err := frontend.Folder.ReadFile(filepath.Join(frontend.StaticPath, frontend.IndexPath))
		if err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		w.WriteHeader(http.StatusAccepted)
		w.Write(index)
		return
	}

	// if we got an error (that wasn't that the file doesn't exist) stating the
	// file, return a 500 internal server error and stop
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	// get the subdirectory of the static dir
	statics, err := fs.Sub(frontend.Folder, frontend.StaticPath)
	// otherwise, use http.FileServer to serve the static dir
	http.FileServer(http.FS(statics)).ServeHTTP(w, r)
}