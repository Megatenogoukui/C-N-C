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
    slug: "cakes-in-mulund",
    title: "Cakes in Mulund",
    description:
      'Order cakes in Mulund East from C "N" C for birthdays, anniversaries, gifting, and same-city celebrations with tracked delivery and clear checkout support.',
    heading: "Cakes in Mulund that feel personal, not generic.",
    lead:
      'If someone is searching for cakes in Mulund, they usually need confidence on three points fast: taste, delivery reliability, and whether the bakery can handle the occasion cleanly. C "N" C is built around that exact decision.',
    keywords: ["cakes in Mulund", "cake delivery Mulund", "Mulund cake shop"],
    primaryCta: { href: "/shop", label: "Shop Cakes" },
    secondaryCta: { href: "/track-order", label: "Track an Order" },
    sections: [
      {
        title: "Mulund-first delivery confidence",
        body:
          "The storefront is tuned for local delivery slots, serviceable pincodes, WhatsApp support, and post-order tracking so the buying experience feels accountable instead of vague."
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
        question: "Do you deliver cakes across Mulund?",
        answer: "The site supports delivery across the active serviceable pincodes listed at checkout and in the storefront messaging."
      },
      {
        question: "Can I order a cake and track it later?",
        answer: "Yes. Customers can use the order tracking flow after checkout to follow confirmation, baking, dispatch, and delivery."
      }
    ]
  },
  {
    slug: "birthday-cakes-in-mulund",
    title: "Birthday Cakes in Mulund",
    description:
      'Browse birthday cakes in Mulund East with premium flavors, eggless options, message-on-cake support, and tracked delivery from C "N" C Cakes "N" Chocolates.',
    heading: "Birthday cakes in Mulund with less guessing and better execution.",
    lead:
      "Birthday orders are high-intent and time-sensitive. This flow is designed to make message-on-cake, delivery timing, add-ons, and support easy to confirm before payment.",
    keywords: ["birthday cakes in Mulund", "birthday cake delivery Mulund", "eggless birthday cake Mulund"],
    primaryCta: { href: "/shop?occasion=Birthday", label: "Shop Birthday Cakes" },
    secondaryCta: { href: "/custom-cakes", label: "Need a Theme Cake?" },
    sections: [
      {
        title: "Built for birthdays first",
        body:
          "The catalog highlights quick-order cakes that work well for birthdays, office celebrations, family dinners, and last-mile gifting in Mulund East."
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
        question: "Can I order a custom birthday cake in Mulund?",
        answer: "Yes. For theme-led or design-heavy birthday cakes, use the custom cakes brief so the team can confirm feasibility and pricing."
      }
    ]
  },
  {
    slug: "chocolates-in-mulund",
    title: "Chocolates in Mulund",
    description:
      'Find chocolates in Mulund East alongside cakes, brownies, and gift-ready celebration treats from C "N" C Cakes "N" Chocolates.',
    heading: "Chocolates in Mulund that work for gifting, not just add-ons.",
    lead:
      "A lot of local searches are not only about cakes. They are about complete gifting. That is why the site positions chocolates, brownies, cupcakes, and cakes as one stronger bakery order instead of separate vendor hunts.",
    keywords: ["chocolates in Mulund", "cakes and chocolates in Mulund", "gift boxes Mulund"],
    primaryCta: { href: "/shop?occasion=Chocolate", label: "Shop Chocolate Range" },
    secondaryCta: { href: "/contact", label: "Ask About Gifting" },
    sections: [
      {
        title: "One order, not multiple vendors",
        body:
          "Customers looking for cakes and chocolates in Mulund usually want convenience without sacrificing presentation. The site keeps both paths connected."
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
        question: "Do you support chocolate cake gifting in Mulund?",
        answer: "Yes. Chocolate-led cakes and celebration treats are part of the main shop flow and can be paired with tracked local delivery."
      }
    ]
  },
  {
    slug: "custom-cakes-in-mulund",
    title: "Custom Cakes in Mulund",
    description:
      'Order custom cakes in Mulund East for birthdays, milestones, weddings, and themed celebrations through a guided bespoke brief from C "N" C.',
    heading: "Custom cakes in Mulund without a messy inquiry process.",
    lead:
      "Custom cake buyers usually need a bakery that can understand references, servings, budget, and timing in one pass. The guided brief exists to make that conversation much cleaner.",
    keywords: ["custom cakes in Mulund", "theme cakes Mulund", "bespoke cakes Mulund East"],
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
