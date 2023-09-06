package service

import (
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
