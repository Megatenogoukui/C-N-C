package site

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"
)

func (a *App) render(w http.ResponseWriter, name string, data PageData) {
	if err := a.templates.ExecuteTemplate(w, name, data); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func (a *App) baseData(r *http.Request, title, description string) PageData {
	cart := readCart(r, a.catalog)
	return PageData{
		Meta: Meta{
			Title:       title,
			Description: description,
			Path:        r.URL.Path,
		},
		CurrentPath:  r.URL.Path,
		CartCount:    cartCount(cart),
		Cart:         cart,
		Collections:  a.catalog.Collections,
		Bestsellers:  a.catalog.Bestsellers(),
		Testimonials: a.catalog.Testimonials,
	}
}

func (a *App) home(w http.ResponseWriter, r *http.Request) {
	data := a.baseData(r, "Heritage Bloom | Premium Cake Delivery in Delhi NCR", "Luxury cake ecommerce for Delhi NCR with premium collections, custom cakes, WhatsApp support, and boutique delivery.")
	data.Products = a.catalog.Products
	a.render(w, "home", data)
}

func (a *App) shop(w http.ResponseWriter, r *http.Request) {
	filters := ShopFilters{
		Occasion: r.URL.Query().Get("occasion"),
		Flavor:   r.URL.Query().Get("flavor"),
		Eggless:  r.URL.Query().Get("eggless") == "1",
		Sort:     r.URL.Query().Get("sort"),
	}
	data := a.baseData(r, "Shop Signature Cakes | Heritage Bloom", "Browse premium cakes by occasion, flavor, and dietary preference.")
	data.Filters = filters
	data.Products = a.catalog.Filter(filters)
	a.render(w, "shop", data)
}

func (a *App) productDetail(w http.ResponseWriter, r *http.Request) {
	slug := strings.TrimPrefix(r.URL.Path, "/product/")
	product, ok := a.catalog.FindBySlug(slug)
	if !ok {
		http.NotFound(w, r)
		return
	}
	data := a.baseData(r, product.Name+" | Heritage Bloom", product.SEOBlurb)
	data.Product = product
	data.Products = a.catalog.Products
	a.render(w, "product", data)
}

func (a *App) customCakes(w http.ResponseWriter, r *http.Request) {
	data := a.baseData(r, "Custom Cakes | Heritage Bloom", "Submit a bespoke cake inquiry with inspiration images, event details, and WhatsApp follow-up.")
	data.Notice = r.URL.Query().Get("notice")
	a.render(w, "custom", data)
}

func (a *App) customCakeInquiry(w http.ResponseWriter, r *http.Request) {
	_ = r.ParseMultipartForm(10 << 20)
	notice := "Your custom cake inquiry has been staged. Connect your email, WhatsApp, and storage credentials later to make it live."
	http.Redirect(w, r, "/custom-cakes?notice="+urlQueryEscape(notice), http.StatusSeeOther)
}

func (a *App) addToCart(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseForm(); err != nil {
		http.Error(w, "invalid form", http.StatusBadRequest)
		return
	}
	slug := r.FormValue("slug")
	_, ok := a.catalog.FindBySlug(slug)
	if !ok {
		http.NotFound(w, r)
		return
	}
	items := map[string]int{}
	for _, item := range readCart(r, a.catalog).Items {
		items[item.Product.Slug] = item.Quantity
	}
	items[slug]++
	setCartCookie(w, items)

	redirect := r.FormValue("redirect")
	if redirect == "" {
		redirect = "/cart"
	}
	http.Redirect(w, r, redirect, http.StatusSeeOther)
}

func (a *App) cartPage(w http.ResponseWriter, r *http.Request) {
	data := a.baseData(r, "Cart | Heritage Bloom", "Review your curated cart, gifting add-ons, and delivery subtotal.")
	a.render(w, "cart", data)
}

func (a *App) updateCart(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseForm(); err != nil {
		http.Error(w, "invalid form", http.StatusBadRequest)
		return
	}
	items := map[string]int{}
	for _, item := range readCart(r, a.catalog).Items {
		items[item.Product.Slug] = item.Quantity
	}
	slug := r.FormValue("slug")
	action := r.FormValue("action")
	qty := items[slug]
	switch action {
	case "increase":
		qty++
	case "decrease":
		qty--
	case "remove":
		qty = 0
	}
	if qty <= 0 {
		delete(items, slug)
	} else {
		items[slug] = qty
	}
	setCartCookie(w, items)
	http.Redirect(w, r, "/cart", http.StatusSeeOther)
}

func (a *App) checkout(w http.ResponseWriter, r *http.Request) {
	data := a.baseData(r, "Checkout | Heritage Bloom", "Secure guest or account checkout with COD and prepaid options.")
	a.render(w, "checkout", data)
}

func (a *App) submitCheckout(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseForm(); err != nil {
		http.Error(w, "invalid form", http.StatusBadRequest)
		return
	}
	setCartCookie(w, map[string]int{})
	http.Redirect(w, r, "/track-order?order=HB2026032301", http.StatusSeeOther)
}

func (a *App) trackOrder(w http.ResponseWriter, r *http.Request) {
	orderID := r.URL.Query().Get("order")
	if orderID == "" {
		orderID = "HB2026032301"
	}
	data := a.baseData(r, "Track Order | Heritage Bloom", "Track your cake order through confirmation, baking, dispatch, and delivery.")
	data.Notice = orderID
	a.render(w, "track", data)
}

func (a *App) account(w http.ResponseWriter, r *http.Request) {
	data := a.baseData(r, "Account | Heritage Bloom", "View saved addresses, reorder favorites, and manage support touchpoints.")
	data.Products = a.catalog.Bestsellers()
	a.render(w, "account", data)
}

func (a *App) admin(w http.ResponseWriter, r *http.Request) {
	data := a.baseData(r, "Admin Preview | Heritage Bloom", "Operational overview for products, orders, custom requests, and delivery slots.")
	data.Products = a.catalog.Products
	a.render(w, "admin", data)
}

func (a *App) about(w http.ResponseWriter, r *http.Request) {
	data := a.baseData(r, "Our Story | Heritage Bloom", "Heritage Bloom blends editorial luxury with Indian celebration culture.")
	a.render(w, "about", data)
}

func (a *App) faq(w http.ResponseWriter, r *http.Request) {
	data := a.baseData(r, "FAQ | Heritage Bloom", "Delivery, customization, freshness, serviceability, and order support answers.")
	a.render(w, "faq", data)
}

func (a *App) blog(w http.ResponseWriter, r *http.Request) {
	data := a.baseData(r, "Journal | Heritage Bloom", "Editorial content for cake occasions, flavor guides, gifting ideas, and local SEO growth.")
	a.render(w, "blog", data)
}

func urlQueryEscape(s string) string {
	replacer := strings.NewReplacer(" ", "%20")
	return replacer.Replace(s)
}

func quantityOptions(max int) []int {
	options := make([]int, max)
	for i := 0; i < max; i++ {
		options[i] = i + 1
	}
	return options
}

func mustAtoi(s string) int {
	n, _ := strconv.Atoi(s)
	return n
}

func productURL(slug string) string {
	return fmt.Sprintf("/product/%s", slug)
}
