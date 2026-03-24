package site

type Product struct {
	ID           string
	Slug         string
	Name         string
	Tagline      string
	Description  string
	Category     string
	Occasion     string
	Flavor       string
	Weight       string
	PriceINR     int
	Rating       float64
	Reviews      int
	Image        string
	Badge        string
	Eggless      bool
	SEOBlurb     string
	DetailBlurb  string
	Ingredients  []string
	AddOns       []AddOn
	ServingNotes []string
	Gallery      []string
	Highlights   []string
}

type AddOn struct {
	Name     string
	PriceINR int
}

type Collection struct {
	Name  string
	Slug  string
	Image string
	Intro string
}

type Testimonial struct {
	Quote string
	Name  string
	Area  string
}

type CartItem struct {
	Product  Product
	Quantity int
}

type Cart struct {
	Items    []CartItem
	Subtotal int
	Delivery int
	Discount int
	Total    int
}

type Meta struct {
	Title       string
	Description string
	Path        string
}

type PageData struct {
	Meta         Meta
	CurrentPath  string
	CartCount    int
	Collections  []Collection
	Products     []Product
	Product      Product
	Bestsellers  []Product
	Testimonials []Testimonial
	Cart         Cart
	Notice       string
	Filters      ShopFilters
}

type ShopFilters struct {
	Occasion string
	Flavor   string
	Eggless  bool
	Sort     string
}
