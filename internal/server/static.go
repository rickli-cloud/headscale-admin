package server

import (
	"io/fs"
	"net/http"
	"os"
	"path/filepath"

	"github.com/rickli-cloud/headscale-admin/frontend"
)

type SpaHandler struct {}

var (
	staticPath 	string = "build"
	indexPath		string = "index.html"
)

func (h SpaHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// get the absolute path to prevent directory traversal
	path, err := filepath.Abs(r.URL.Path)
	if err != nil {
		// if we failed to get the absolute path respond with a 400 bad request and stop
		http.Error(w, "Internal server error", http.StatusBadRequest)
		return
	}

	// prepend the path with the path to the static directory
	path = filepath.Join(staticPath, path)
	_, err = frontend.Folder.Open(path)
	
	if os.IsNotExist(err) || path == "build" {
		index, err := frontend.Folder.ReadFile(filepath.Join(staticPath, indexPath))
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
	statics, err := fs.Sub(frontend.Folder, staticPath)
	// otherwise, use http.FileServer to serve the static dir
	http.FileServer(http.FS(statics)).ServeHTTP(w, r)
}