import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Our Story",
  description: 'C "N" C blends homemade cakes, brownies, chocolates, and celebration orders into a warm single-city brand.'
};

export default function AboutPage() {
  const images = [
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1521302200778-33500795e128?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80"
  ];

  return (
    <main className="section">
      <div className="container">
        <span className="eyebrow">Our Story</span>
        <h1 style={{ fontSize: 64 }}>Homemade comfort with a stronger digital storefront.</h1>
        <div className="content-split" style={{ marginTop: 32 }}>
          <div className="content-stack">
            <p className="lead">
              C &quot;N&quot; C is positioned as a warm, homemade treats brand with room for serious commerce depth. The experience avoids marketplace clutter and focuses on clear ordering, strong trust, and a memorable bakery identity for Mulund East, Mumbai.
            </p>
            <div style={{ display: "grid", gap: 18, marginTop: 28 }}>
              <div className="info-card">
                <h3 style={{ fontSize: 24 }}>Why this architecture</h3>
                <p style={{ marginTop: 10 }}>Next.js handles the presentation, SEO, and polished UI while Go remains the backend direction for services, orders, and integrations.</p>
              </div>
              <div className="info-card">
                <h3 style={{ fontSize: 24 }}>What will change later</h3>
                <p style={{ marginTop: 10 }}>Product data, real media, payments, notifications, and admin modules can move from seeded state to persistent services without redesigning the customer flow.</p>
              </div>
            </div>
          </div>
          <div className="image-composition">
            <div className="image-composition-main">
              <Image src={images[0]} alt="Chocolate cake" fill sizes="(max-width: 1080px) 100vw, 38vw" />
            </div>
            <div className="image-composition-side">
              {images.slice(1, 3).map((src) => (
                <div className="image-composition-card" key={src}>
                  <Image src={src} alt="" fill sizes="(max-width: 1080px) 100vw, 18vw" />
                </div>
              ))}
            </div>
            <div className="image-composition-wide">
              <Image src={images[3]} alt="" fill sizes="(max-width: 1080px) 100vw, 58vw" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
