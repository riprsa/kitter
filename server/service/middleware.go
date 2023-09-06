package service

import (
	"fmt"
	"net/http"

	"github.com/rs/cors"
)

func WithoutCORS(next http.Handler) http.Handler {
	return cors.New(
		cors.Options{
			AllowedOrigins: []string{"*"},
			AllowedMethods: []string{"POST"},
			AllowedHeaders: []string{"Content-Type"},
		},
	).Handler(next)
}

func ClientPage(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "" && r.Method == http.MethodGet {
			fmt.Fprint(w, "asdasdsa")
		}
		next.ServeHTTP(w, r)
	})
}
