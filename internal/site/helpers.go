package site

import (
	"fmt"
	"net/http"
	"sort"
	"strconv"
	"strings"
)

func formatINR(amount int) string {
	s := strconv.Itoa(amount)
	if len(s) <= 3 {
		return "₹" + s
	}
	last3 := s[len(s)-3:]
	rest := s[:len(s)-3]
	var groups []string
	for len(rest) > 2 {
		groups = append([]string{rest[len(rest)-2:]}, groups...)
		rest = rest[:len(rest)-2]
	}
	if rest != "" {
		groups = append([]string{rest}, groups...)
	}
	return "₹" + strings.Join(append(groups, last3), ",")
}

func stars(rating float64) []int {
	full := int(rating + 0.3)
	if full > 5 {
		full = 5
	}
	result := make([]int, 5)
	for i := range result {
		if i < full {
			result[i] = 1
		}
	}
	return result
}

func withSecurityHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Frame-Options", "DENY")
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")
		w.Header().Set("Content-Security-Policy", "default-src 'self'; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com; img-src 'self' https: data:; script-src 'self' 'unsafe-inline'; connect-src 'self';")
		next.ServeHTTP(w, r)
	})
}

func sortedKeys(m map[string]int) []string {
	keys := make([]string, 0, len(m))
	for key := range m {
		keys = append(keys, key)
	}
	sort.Strings(keys)
	return keys
}

func cartCookieValue(items map[string]int) string {
	if len(items) == 0 {
		return ""
	}
	var chunks []string
	for _, key := range sortedKeys(items) {
		chunks = append(chunks, fmt.Sprintf("%s:%d", key, items[key]))
	}
	return strings.Join(chunks, ",")
}
