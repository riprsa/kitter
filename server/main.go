package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/hararudoka/kitter/pb"
	"github.com/hararudoka/kitter/service"
)

func main() {
	var catterService = service.New()

	var twirpServer = pb.NewCatterServer(
		catterService,
	)

	// set headers
	wrapped := service.WithoutCORS(twirpServer)

	mux := http.NewServeMux()

	// handle Twirp endpoints
	mux.Handle(twirpServer.PathPrefix(), wrapped)
	// handle static files of Vue app
	mux.Handle("/", http.FileServer(http.FS(os.DirFS("./view"))))

	fmt.Println("listening on :8080")
	http.ListenAndServe(":8080", mux)
}
