package site

import (
	"html/template"
	"net/http"
	"os"
	"path/filepath"
	"runtime"
)

type App struct {
	templates *template.Template
	catalog   Catalog
}

func New() (*App, error) {
	root := projectRoot()
	tmpl, err := template.New("").Funcs(template.FuncMap{
		"rupees": formatINR,
		"stars":  stars,
		"safe": func(v string) template.HTML {
			return template.HTML(v)
		},
	}).ParseGlob(filepath.Join(root, "web/templates/*.gohtml"))
	if err != nil {
		return nil, err
	}

	return &App{
		templates: tmpl,
		catalog:   seedCatalog(),
	}, nil
}

func (a *App) Routes() http.Handler {
	mux := http.NewServeMux()

	mux.Handle("GET /static/", http.StripPrefix("/static/", http.FileServer(http.FS(os.DirFS(filepath.Join(projectRoot(), "web/static"))))))
	mux.HandleFunc("GET /", a.home)
	mux.HandleFunc("GET /shop", a.shop)
	mux.HandleFunc("GET /custom-cakes", a.customCakes)
	mux.HandleFunc("POST /custom-cakes", a.customCakeInquiry)
	mux.HandleFunc("GET /product/", a.productDetail)
	mux.HandleFunc("POST /cart/add", a.addToCart)
	mux.HandleFunc("GET /cart", a.cartPage)
	mux.HandleFunc("POST /cart/update", a.updateCart)
	mux.HandleFunc("GET /checkout", a.checkout)
	mux.HandleFunc("POST /checkout", a.submitCheckout)
	mux.HandleFunc("GET /track-order", a.trackOrder)
	mux.HandleFunc("GET /account", a.account)
	mux.HandleFunc("GET /admin", a.admin)
	mux.HandleFunc("GET /about", a.about)
	mux.HandleFunc("GET /faq", a.faq)
	mux.HandleFunc("GET /blog", a.blog)

	return withSecurityHeaders(mux)
}

func projectRoot() string {
	_, file, _, _ := runtime.Caller(0)
	return filepath.Clean(filepath.Join(filepath.Dir(file), "..", ".."))
}
