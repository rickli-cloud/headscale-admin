package frontend

import "embed"

//go:embed build/*
var Folder embed.FS

var (
	StaticPath 	string = "build"
	IndexPath		string = "index.html"
)
