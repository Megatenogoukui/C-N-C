package site

import "strings"

type Catalog struct {
	Products     []Product
	Collections  []Collection
	Testimonials []Testimonial
}

func seedCatalog() Catalog {
	products := []Product{
		{
			ID:          "1",
			Slug:        "lavender-berry-dream",
			Name:        "Lavender Berry Dream",
			Tagline:     "A floral-fruit celebration finished with wild berries.",
			Description: "Infused with French lavender, whipped mascarpone, and wild forest berry compote.",
			Category:    "Signature Cakes",
			Occasion:    "Anniversary",
			Flavor:      "Fresh Fruit",
			Weight:      "1 kg",
			PriceINR:    2450,
			Rating:      4.9,
			Reviews:     82,
			Image:       "https://images.unsplash.com/photo-1562440499-64c9a111f713?auto=format&fit=crop&w=1200&q=80",
			Badge:       "Eggless Available",
			Eggless:     true,
			SEOBlurb:    "Luxury lavender berry cake in Delhi NCR with delivery slots and custom message options.",
			DetailBlurb: "Aromatic, airy, and softly tart, finished with pressed petals and hand-placed berries.",
			Ingredients: []string{"Lavender sponge", "Mascarpone chantilly", "Berry compote", "Pressed edible petals"},
			AddOns:      []AddOn{{Name: "Celebration candles", PriceINR: 120}, {Name: "Handwritten card", PriceINR: 180}, {Name: "Mini flower bunch", PriceINR: 450}},
			ServingNotes: []string{
				"Best for intimate celebrations of 8 to 10 guests.",
				"Message plaque included.",
				"Available in eggless on request.",
			},
			Gallery: []string{
				"https://images.unsplash.com/photo-1562440499-64c9a111f713?auto=format&fit=crop&w=1200&q=80",
				"https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?auto=format&fit=crop&w=1200&q=80",
				"https://images.unsplash.com/photo-1464349153735-7db50ed83c84?auto=format&fit=crop&w=1200&q=80",
			},
			Highlights: []string{"24-hour preorder", "Custom message included", "Same aesthetic as editorial hero range"},
		},
		{
			ID:          "2",
			Slug:        "noir-chocolate-ganache",
			Name:        "Noir Chocolate Ganache",
			Tagline:     "Single-origin Belgian chocolate with fleur de sel.",
			Description: "A dense layered chocolate cake glazed in satin ganache and finished with gold leaf.",
			Category:    "Chocolate",
			Occasion:    "Birthday",
			Flavor:      "Belgian Chocolate",
			Weight:      "1 kg",
			PriceINR:    1950,
			Rating:      4.8,
			Reviews:     164,
			Image:       "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80",
			Badge:       "Bestseller",
			SEOBlurb:    "Premium chocolate cake with Belgian couverture and boutique delivery in Delhi NCR.",
			DetailBlurb: "An intense cocoa-led profile softened by creamy layers and a glossy finish.",
			Ingredients: []string{"Belgian chocolate sponge", "Dark ganache", "Sea salt flakes", "Valrhona cocoa"},
			AddOns:      []AddOn{{Name: "Chocolate truffle box", PriceINR: 380}, {Name: "Sparkler candle set", PriceINR: 160}},
			ServingNotes: []string{
				"Serves 8 to 10.",
				"Pairs well with premium bouquet add-on.",
				"Delivered in climate-safe packaging.",
			},
			Gallery: []string{
				"https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80",
				"https://images.unsplash.com/photo-1551024709-8f23befc6cf7?auto=format&fit=crop&w=1200&q=80",
				"https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80",
			},
			Highlights: []string{"Fast mover", "Rich cocoa finish", "Ideal for birthdays and gifting"},
		},
		{
			ID:          "3",
			Slug:        "persian-rose-pistachio",
			Name:        "Persian Rose & Pistachio",
			Tagline:     "Rose-water sponge with toasted pistachios and silk cream.",
			Description: "A refined floral cake designed for elegant intimate dinners and premium gifting.",
			Category:    "Signature Cakes",
			Occasion:    "Anniversary",
			Flavor:      "Madagascar Vanilla",
			Weight:      "1 kg",
			PriceINR:    2250,
			Rating:      4.9,
			Reviews:     73,
			Image:       "https://images.unsplash.com/photo-1521302200778-33500795e128?auto=format&fit=crop&w=1200&q=80",
			Badge:       "Signature",
			SEOBlurb:    "Rose pistachio cake for anniversary and gifting in Delhi.",
			DetailBlurb: "Softly perfumed, lightly textured, and plated to feel ceremonial.",
			Ingredients: []string{"Vanilla sponge", "Rose milk soak", "Pistachio praline", "Fresh cream"},
			AddOns:      []AddOn{{Name: "Rose petal macarons", PriceINR: 320}, {Name: "Premium greeting scroll", PriceINR: 220}},
			ServingNotes: []string{
				"Serves 8 to 10 guests.",
				"Best enjoyed chilled.",
			},
			Gallery: []string{
				"https://images.unsplash.com/photo-1521302200778-33500795e128?auto=format&fit=crop&w=1200&q=80",
				"https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=1200&q=80",
				"https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=1200&q=80",
			},
			Highlights: []string{"Elegant floral profile", "Premium gifting favorite", "Highly photogenic"},
		},
		{
			ID:          "4",
			Slug:        "midnight-truffle-bloom",
			Name:        "Midnight Truffle Bloom",
			Tagline:     "Dark truffle layers with couture floral finishing.",
			Description: "A deep chocolate centerpiece with velvet frosting and gold detailing.",
			Category:    "Premium Cakes",
			Occasion:    "Wedding",
			Flavor:      "Belgian Chocolate",
			Weight:      "1.5 kg",
			PriceINR:    3200,
			Rating:      5.0,
			Reviews:     48,
			Image:       "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=1200&q=80",
			Badge:       "Chef's Special",
			SEOBlurb:    "Designer truffle cake with premium gold finish for milestone celebrations.",
			DetailBlurb: "Built for statement tables, formal dinners, and indulgent chocolate lovers.",
			Ingredients: []string{"Chocolate sponge", "Truffle mousse", "Dark mirror glaze", "Edible gold"},
			AddOns:      []AddOn{{Name: "Luxury knife set", PriceINR: 350}, {Name: "Fresh flower styling", PriceINR: 650}},
			ServingNotes: []string{
				"Serves 12 to 14.",
				"Suitable for major celebration tables.",
			},
			Gallery: []string{
				"https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=1200&q=80",
				"https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=1200&q=80",
				"https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?auto=format&fit=crop&w=1200&q=80",
			},
			Highlights: []string{"Statement cake", "Luxury finish", "Best for formal events"},
		},
		{
			ID:           "5",
			Slug:         "crimson-velvet-heart",
			Name:         "Crimson Velvet Heart",
			Tagline:      "Classic red velvet reimagined with soft sculpted frosting.",
			Description:  "Tangy cream cheese frosting with a plush red velvet crumb and romantic finish.",
			Category:     "Birthday",
			Occasion:     "Birthday",
			Flavor:       "Red Velvet",
			Weight:       "1.5 kg",
			PriceINR:     2400,
			Rating:       5.0,
			Reviews:      215,
			Image:        "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=1200&q=80",
			Badge:        "Top Rated",
			SEOBlurb:     "Luxury red velvet celebration cake with customizable message.",
			DetailBlurb:  "Soft, celebratory, and built to be loved across age groups.",
			Ingredients:  []string{"Red velvet sponge", "Cream cheese frosting", "Vanilla crumb", "Berry garnish"},
			AddOns:       []AddOn{{Name: "Heart candles", PriceINR: 140}, {Name: "Balloon bouquet", PriceINR: 700}},
			ServingNotes: []string{"Serves 12 to 14.", "Most reordered birthday cake."},
			Gallery: []string{
				"https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=1200&q=80",
				"https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=1200&q=80",
				"https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=1200&q=80",
			},
			Highlights: []string{"Most reordered", "Party-safe crowd pleaser", "Rich but balanced"},
		},
		{
			ID:           "6",
			Slug:         "portrait-gallery-cake",
			Name:         "Portrait Gallery Cake",
			Tagline:      "Photo-printed celebration cake with floral detailing.",
			Description:  "A custom-ready photo cake designed for milestone birthdays and personal celebrations.",
			Category:     "Photo Cakes",
			Occasion:     "Birthday",
			Flavor:       "Custom Photo",
			Weight:       "1 kg",
			PriceINR:     2800,
			Rating:       4.7,
			Reviews:      32,
			Image:        "https://images.unsplash.com/photo-1559622214-3c4c3ea5b8d1?auto=format&fit=crop&w=1200&q=80",
			Badge:        "Photo Cake",
			SEOBlurb:     "Photo cake delivery in Delhi with premium edible print finish.",
			DetailBlurb:  "Designed to merge sentiment with polished premium execution.",
			Ingredients:  []string{"Vanilla sponge", "Photo sheet", "Fresh cream", "Fondant detailing"},
			AddOns:       []AddOn{{Name: "Photo topper upgrade", PriceINR: 260}, {Name: "Birthday sash", PriceINR: 340}},
			ServingNotes: []string{"Send high-resolution image after order.", "24-hour preorder required."},
			Gallery: []string{
				"https://images.unsplash.com/photo-1559622214-3c4c3ea5b8d1?auto=format&fit=crop&w=1200&q=80",
				"https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=1200&q=80",
				"https://images.unsplash.com/photo-1464349153735-7db50ed83c84?auto=format&fit=crop&w=1200&q=80",
			},
			Highlights: []string{"High-resolution edible print", "Ideal for milestone events", "WhatsApp support available"},
		},
	}

	return Catalog{
		Products: products,
		Collections: []Collection{
			{Name: "Birthday", Slug: "birthday", Image: products[4].Image, Intro: "Layered celebration cakes for intimate and grand parties."},
			{Name: "Anniversary", Slug: "anniversary", Image: products[0].Image, Intro: "Romantic centerpieces with floral and fruit-led profiles."},
			{Name: "Eggless", Slug: "eggless", Image: products[2].Image, Intro: "Full-bodied eggless cakes that do not compromise texture."},
			{Name: "Chocolate", Slug: "chocolate", Image: products[1].Image, Intro: "Dark cocoa signatures and truffle-led indulgence."},
			{Name: "Combos", Slug: "combos", Image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=1200&q=80", Intro: "Cake plus flowers, candles, cards, and gifting upgrades."},
		},
		Testimonials: []Testimonial{
			{Quote: "The Lavender Berry cake was the highlight of our anniversary. It felt editorial, not generic.", Name: "Ananya K.", Area: "Golf Course Road"},
			{Quote: "Packaging was as premium as the taste. This is now our go-to for corporate gifting.", Name: "Vikram S.", Area: "Chanakyapuri"},
			{Quote: "The eggless chocolate range actually tastes luxurious. That is rare.", Name: "Priya M.", Area: "Vasant Vihar"},
		},
	}
}

func (c Catalog) Bestsellers() []Product {
	return []Product{c.Products[0], c.Products[1], c.Products[2]}
}

func (c Catalog) FindBySlug(slug string) (Product, bool) {
	for _, product := range c.Products {
		if product.Slug == slug {
			return product, true
		}
	}
	return Product{}, false
}

func (c Catalog) Filter(filters ShopFilters) []Product {
	var out []Product
	for _, product := range c.Products {
		if filters.Occasion != "" && !strings.EqualFold(product.Occasion, filters.Occasion) && !strings.EqualFold(product.Category, filters.Occasion) {
			continue
		}
		if filters.Flavor != "" && !strings.EqualFold(product.Flavor, filters.Flavor) {
			continue
		}
		if filters.Eggless && !product.Eggless {
			continue
		}
		out = append(out, product)
	}
	return out
}
