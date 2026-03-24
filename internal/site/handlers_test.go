package site

import (
	"net/http"
	"net/http/httptest"
	"net/url"
	"strings"
	"testing"
)

func TestPagesRender(t *testing.T) {
	app, err := New()
	if err != nil {
		t.Fatalf("new app: %v", err)
	}

	routes := app.Routes()
	paths := []string{
		"/",
		"/shop",
		"/product/noir-chocolate-ganache",
		"/custom-cakes",
		"/cart",
		"/checkout",
		"/track-order",
		"/account",
		"/admin",
		"/about",
		"/faq",
		"/blog",
	}

	for _, path := range paths {
		req := httptest.NewRequest(http.MethodGet, path, nil)
		rec := httptest.NewRecorder()
		routes.ServeHTTP(rec, req)
		if rec.Code != http.StatusOK {
			t.Fatalf("%s returned %d", path, rec.Code)
		}
		if body := rec.Body.String(); !strings.Contains(body, "Heritage Bloom") {
			t.Fatalf("%s missing brand content", path)
		}
	}
}

func TestAddToCartRedirects(t *testing.T) {
	app, err := New()
	if err != nil {
		t.Fatalf("new app: %v", err)
	}

	form := url.Values{}
	form.Set("slug", "noir-chocolate-ganache")
	form.Set("redirect", "/cart")

	req := httptest.NewRequest(http.MethodPost, "/cart/add", strings.NewReader(form.Encode()))
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	rec := httptest.NewRecorder()

	app.Routes().ServeHTTP(rec, req)

	if rec.Code != http.StatusSeeOther {
		t.Fatalf("expected redirect, got %d", rec.Code)
	}
	if location := rec.Header().Get("Location"); location != "/cart" {
		t.Fatalf("unexpected redirect location: %s", location)
	}
	if cookie := rec.Header().Get("Set-Cookie"); !strings.Contains(cookie, "hb_cart=") {
		t.Fatalf("missing cart cookie")
	}
}
