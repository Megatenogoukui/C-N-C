package main

import (
	"log"
	"net/http"
	"os"

	"heritagebloom/internal/site"
)

func main() {
	addr := env("ADDR", ":8080")

	app, err := site.New()
	if err != nil {
		log.Fatalf("build app: %v", err)
	}

	log.Printf("heritage bloom listening on %s", addr)
	if err := http.ListenAndServe(addr, app.Routes()); err != nil {
		log.Fatal(err)
	}
}

func env(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
