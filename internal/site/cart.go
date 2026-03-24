package site

import (
	"net/http"
	"strconv"
	"strings"
)

const cartCookieName = "hb_cart"

func readCart(r *http.Request, catalog Catalog) Cart {
	value := ""
	if cookie, err := r.Cookie(cartCookieName); err == nil {
		value = cookie.Value
	}
	rawItems := map[string]int{}
	for _, part := range strings.Split(value, ",") {
		if part == "" {
			continue
		}
		bits := strings.SplitN(part, ":", 2)
		if len(bits) != 2 {
			continue
		}
		qty, err := strconv.Atoi(bits[1])
		if err != nil || qty <= 0 {
			continue
		}
		rawItems[bits[0]] = qty
	}

	cart := Cart{Delivery: 180}
	for _, product := range catalog.Products {
		qty := rawItems[product.Slug]
		if qty == 0 {
			continue
		}
		cart.Items = append(cart.Items, CartItem{Product: product, Quantity: qty})
		cart.Subtotal += product.PriceINR * qty
	}
	if cart.Subtotal >= 4000 {
		cart.Delivery = 0
	}
	cart.Total = cart.Subtotal + cart.Delivery - cart.Discount
	return cart
}

func cartCount(cart Cart) int {
	total := 0
	for _, item := range cart.Items {
		total += item.Quantity
	}
	return total
}

func setCartCookie(w http.ResponseWriter, items map[string]int) {
	http.SetCookie(w, &http.Cookie{
		Name:     cartCookieName,
		Value:    cartCookieValue(items),
		Path:     "/",
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
		MaxAge:   7 * 24 * 60 * 60,
	})
}
