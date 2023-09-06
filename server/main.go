package main

import (
	"fmt"
	"net/http"

	"github.com/hararudoka/kitter/service"
)

func main() {
	var service = service.New()

	fmt.Println("listening on :80")
	http.ListenAndServe(":80", service)
}
