export type LocalLandingPage = {
  slug: string;
  title: string;
  description: string;
  heading: string;
  lead: string;
  keywords: string[];
  primaryCta: { href: string; label: string };
  secondaryCta: { href: string; label: string };
  sections: Array<{
    title: string;
    body: string;
  }>;
  faq: Array<{
    question: string;
    answer: string;
  }>;
};

export const localLandingPages: LocalLandingPage[] = [
  {
    slug: "cakes-in-mumbai",
    title: "Cakes in Mumbai",
    description:
      'Order cakes in Mumbai from C "N" C for birthdays, anniversaries, gifting, and city-wide celebrations with clear checkout support and Porter delivery coordination.',
    heading: "Cakes in Mumbai that feel personal, not generic.",
    lead:
      'If someone is searching for cakes in Mumbai, they usually need confidence on three points fast: taste, delivery reliability, and whether the bakery can handle the occasion cleanly. C "N" C is built around that exact decision.',
    keywords: ["cakes in Mumbai", "cake delivery Mumbai", "Mumbai cake shop"],
    primaryCta: { href: "/shop", label: "Shop Cakes" },
    secondaryCta: { href: "/track-order", label: "Track an Order" },
    sections: [
      {
        title: "Mumbai delivery confidence",
        body:
          "The storefront is tuned for Mumbai orders, WhatsApp support, post-order tracking, and Porter-assisted fulfillment so the buying experience feels accountable instead of vague."
      },
      {
        title: "Catalog cakes for quick orders",
        body:
          "Birthday cakes, chocolate cakes, brownies, cupcakes, and gifting-ready signatures are meant to convert quickly without sending customers into a long inquiry chain."
      },
      {
        title: "Custom route when the order is more complex",
        body:
          "Theme cakes, milestone cakes, and design-heavy celebration orders move into a dedicated custom brief with event date, servings, budget, and references."
      }
    ],
    faq: [
      {
        question: "Do you deliver cakes across Mumbai?",
        answer: "Yes. The storefront is positioned for Mumbai delivery, with Porter used for fulfillment support depending on the order and area."
      },
      {
        question: "Can I order a cake and track it later?",
        answer: "Yes. Customers can use the order tracking flow after checkout to follow confirmation, baking, dispatch, and delivery."
      }
    ]
  },
  {
    slug: "birthday-cakes-in-mumbai",
    title: "Birthday Cakes in Mumbai",
    description:
      'Browse birthday cakes in Mumbai with premium flavors, eggless options, message-on-cake support, and tracked delivery from C "N" C Cakes "N" Chocolates.',
    heading: "Birthday cakes in Mumbai with less guessing and better execution.",
    lead:
      "Birthday orders are high-intent and time-sensitive. This flow is designed to make message-on-cake, delivery timing, add-ons, and support easy to confirm before payment.",
    keywords: ["birthday cakes in Mumbai", "birthday cake delivery Mumbai", "eggless birthday cake Mumbai"],
    primaryCta: { href: "/shop?occasion=Birthday", label: "Shop Birthday Cakes" },
    secondaryCta: { href: "/custom-cakes", label: "Need a Theme Cake?" },
    sections: [
      {
        title: "Built for birthdays first",
        body:
          "The catalog highlights quick-order cakes that work well for birthdays, office celebrations, family dinners, and last-mile gifting across Mumbai."
      },
      {
        title: "Message, slot, and support built into the flow",
        body:
          "Customers can specify message-on-cake text, choose delivery timing, and fall back to WhatsApp support if the celebration needs extra coordination."
      },
      {
        title: "Theme and milestone cakes need a different path",
        body:
          "If the order needs fondant characters, sculpted decor, or more visual references, the custom cake brief prevents the product page from becoming overloaded."
      }
    ],
    faq: [
      {
        question: "Do you offer eggless birthday cakes?",
        answer: "Yes, the catalog includes eggless filtering so birthday buyers can narrow the menu quickly."
      },
      {
        question: "Can I order a custom birthday cake in Mumbai?",
        answer: "Yes. For theme-led or design-heavy birthday cakes, use the custom cakes brief so the team can confirm feasibility and pricing."
      }
    ]
  },
  {
    slug: "chocolates-in-mumbai",
    title: "Chocolates in Mumbai",
    description:
      'Find chocolates in Mumbai alongside cakes, brownies, and gift-ready celebration treats from C "N" C Cakes "N" Chocolates.',
    heading: "Chocolates in Mumbai that work for gifting, not just add-ons.",
    lead:
      "A lot of local searches are not only about cakes. They are about complete gifting. That is why the site positions chocolates, brownies, cupcakes, and cakes as one stronger bakery order instead of separate vendor hunts.",
    keywords: ["chocolates in Mumbai", "cakes and chocolates in Mumbai", "gift boxes Mumbai"],
    primaryCta: { href: "/shop?occasion=Chocolate", label: "Shop Chocolate Range" },
    secondaryCta: { href: "/contact", label: "Ask About Gifting" },
    sections: [
      {
        title: "One order, not multiple vendors",
        body:
          "Customers looking for cakes and chocolates in Mumbai usually want convenience without sacrificing presentation. The site keeps both paths connected."
      },
      {
        title: "Better gifting combinations",
        body:
          "Chocolate-forward cakes, brownies, cupcakes, and supporting treats make the order feel more complete for birthdays, anniversaries, and personal gifting."
      },
      {
        title: "Local support when gifting details matter",
        body:
          "If the order needs address clarification, a timing change, or help choosing the right format, WhatsApp support stays close to the shopping flow."
      }
    ],
    faq: [
      {
        question: "Can I order cakes and chocolates together?",
        answer: "Yes. The storefront is structured to support mixed gifting orders so you do not need separate bakery and chocolate vendors."
      },
      {
        question: "Do you support chocolate cake gifting in Mumbai?",
        answer: "Yes. Chocolate-led cakes and celebration treats are part of the main shop flow and can be paired with tracked local delivery."
      }
    ]
  },
  {
    slug: "custom-cakes-in-mumbai",
    title: "Custom Cakes in Mumbai",
    description:
      'Order custom cakes in Mumbai for birthdays, milestones, weddings, and themed celebrations through a guided bespoke brief from C "N" C.',
    heading: "Custom cakes in Mumbai without a messy inquiry process.",
    lead:
      "Custom cake buyers usually need a bakery that can understand references, servings, budget, and timing in one pass. The guided brief exists to make that conversation much cleaner.",
    keywords: ["custom cakes in Mumbai", "theme cakes Mumbai", "bespoke cakes Mumbai"],
    primaryCta: { href: "/custom-cakes", label: "Start Custom Brief" },
    secondaryCta: { href: "/faq", label: "See How It Works" },
    sections: [
      {
        title: "Designed for themed and milestone orders",
        body:
          "This route is for wedding cakes, themed birthday cakes, sculpted celebration cakes, and requests that need more than a simple variant selector."
      },
      {
        title: "A brief that respects the customer’s time",
        body:
          "The custom form captures references, event date, servings, budget, flavor preferences, and preferred follow-up channel before the team responds."
      },
      {
        title: "Better than forcing custom work into catalog pages",
        body:
          "Separating quick-buy products from bespoke work protects both experiences: catalog orders stay fast and custom orders stay properly qualified."
      }
    ],
    faq: [
      {
        question: "How much notice do custom cakes need?",
        answer: "Complex custom cakes usually need more notice than standard catalog cakes because design, scale, and finishing have to be reviewed manually."
      },
      {
        question: "Can I share inspiration for a custom cake?",
        answer: "Yes. The custom brief is designed around inspiration, mood, event details, budget, and servings."
      }
    ]
  }
];

export function getLocalLandingPage(slug: string) {
  return localLandingPages.find((page) => page.slug === slug) || null;
}
