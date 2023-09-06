package service

import (
	"net/http"
	"os"
	"strings"

	"github.com/hararudoka/kitter/pb"
)

type Service struct {
	TwirpHandler pb.TwirpServer

	PathPrefix string
}

func (s Service) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if strings.HasPrefix(r.URL.Path, s.PathPrefix) {
		s.TwirpHandler.ServeHTTP(w, r)
		return
	}

	if strings.HasPrefix(r.URL.Path, "/assets") {
		if strings.HasSuffix(r.URL.Path, ".js") {
			w.Header().Set("Content-Type", "application/javascript")
		}
		http.FileServer(http.FS(os.DirFS("view"))).ServeHTTP(w, r)
		return
	}

	http.ServeFile(w, r, "view/index.html")
}

func New() *Service {
	var mux = http.NewServeMux()

	var twirpServer = pb.NewCatterServer(
		NewCatter(),
	)

	var s = Service{
		TwirpHandler: twirpServer,

		PathPrefix: "/twirp",
	}

	// set headers
	wrapped := WithoutCORS(s)

	// handle static files of Vue app
	mux.Handle("/", wrapped)

	return &s
}
