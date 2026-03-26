import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { submitCustomCake } from "@/app/actions";
import { getWhatsAppUrl } from "@/lib/business";

type CustomPageProps = {
  searchParams: Promise<{ submitted?: string; error?: string }>;
};

export const metadata: Metadata = {
  title: "Custom Cakes",
  description:
    "Submit a bespoke cake inquiry with inspiration images, event details, budget, servings, and preferred follow-up channel."
};

export default async function CustomCakesPage({ searchParams }: CustomPageProps) {
  const params = await searchParams;

  return (
    <main>
      <section className="hero" style={{ minHeight: "72vh" }}>
        <div className="hero-image">
          <Image
            src="https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=1800&q=80"
            alt="Custom cake sketch to finish"
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="container hero-content">
          <span className="eyebrow">The Bespoke Experience</span>
          <h1>Your vision, our craft.</h1>
          <p className="lead" style={{ marginTop: 20 }}>
            For designs beyond the catalog, this brief captures mood, event, servings, budget, and contact preference before a manual follow-up.
          </p>
          <div className="hero-pill-row" style={{ marginTop: 24 }}>
            {["Mood references", "Event date", "Budget range", "WhatsApp or email follow-up"].map((item) => (
              <span className="story-pill" key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container custom-layout">
          <section className="panel grain">
            {params.submitted === "1" ? (
              <div className="info-card" style={{ marginBottom: 18 }}>
                Your custom cake inquiry has been received. We will review it and follow up through your preferred channel.
              </div>
            ) : null}
            {params.error ? (
              <div className="info-card" style={{ marginBottom: 18, color: "#8f2d24" }}>
                {params.error}
              </div>
            ) : null}
            <form action={submitCustomCake} style={{ display: "grid", gap: 18 }}>
              <h2 style={{ fontSize: 42 }}>Design Consultation</h2>
              <div className="service-strip">
                <div>
                  <strong>When to use this form</strong>
                  <p>Use it for theme cakes, milestone celebrations, sculpted concepts, and requests that need manual quoting.</p>
                </div>
                <div>
                  <strong>What happens next</strong>
                  <p>The team reviews the brief, checks feasibility, and follows up on your preferred channel with next steps.</p>
                </div>
              </div>
              <label>
                <span className="field-label">Describe your dream cake</span>
                <textarea
                  className="textarea"
                  name="brief"
                  placeholder="Mood, colors, textures, event styling, references, and anything non-negotiable."
                />
              </label>
              <label>
                <span className="field-label">Upload inspiration</span>
                <div className="upload-shell">
                  <p>Attach sketches or inspiration imagery later once storage is connected.</p>
                  <input className="input" style={{ marginTop: 12 }} type="file" name="reference" />
                </div>
              </label>
              <div className="field-grid two">
                <label>
                  <span className="field-label">Occasion</span>
                  <select className="select" name="occasion" defaultValue="Wedding">
                    <option>Wedding</option>
                    <option>Birthday</option>
                    <option>Corporate event</option>
                    <option>Anniversary</option>
                    <option>Other</option>
                  </select>
                </label>
                <label>
                  <span className="field-label">Event Date</span>
                  <input className="input" type="date" name="eventDate" />
                </label>
                <label>
                  <span className="field-label">Estimated Servings</span>
                  <input className="input" type="number" name="servings" placeholder="50" />
                </label>
                <label>
                  <span className="field-label">Budget</span>
                  <select className="select" name="budget" defaultValue="₹10,000+">
                    <option>₹5,000+</option>
                    <option>₹10,000+</option>
                    <option>₹25,000+</option>
                  </select>
                </label>
                <label>
                  <span className="field-label">Name</span>
                  <input className="input" name="name" placeholder="Your name" />
                </label>
                <label>
                  <span className="field-label">Phone / WhatsApp</span>
                  <input className="input" name="phone" placeholder="9920554660" />
                </label>
                <label>
                  <span className="field-label">Email</span>
                  <input className="input" name="email" type="email" placeholder="hello@example.com" />
                </label>
                <label>
                  <span className="field-label">Preferred Contact</span>
                  <select className="select" name="contactPreference" defaultValue="WhatsApp">
                    <option>WhatsApp</option>
                    <option>Email</option>
                    <option>Phone call</option>
                  </select>
                </label>
              </div>
              <label>
                <span className="field-label">Flavor Preferences</span>
                <input className="input" name="flavorPreferences" placeholder="Dark cocoa noir, saffron pistachio, Madagascar vanilla" />
              </label>
              <div className="cta-row">
                <button className="button" type="submit">
                  Submit Inquiry
                </button>
                <Link className="button-ghost" href={getWhatsAppUrl("Hello C N C, I want to discuss a custom cake order.")}>
                  WhatsApp Instead
                </Link>
              </div>
            </form>
          </section>

          <aside className="content-stack" style={{ gap: 18 }}>
            <div className="info-card">
              <h3 style={{ fontSize: 30 }}>The curator&apos;s touch</h3>
              <p style={{ marginTop: 14 }}>
                This form is meant to qualify the brief quickly without making the process feel like filling out a procurement document.
              </p>
              <ul style={{ marginTop: 16 }}>
                <li>Inspiration upload</li>
                <li>Occasion, date, servings, and budget</li>
                <li>Preferred follow-up channel</li>
                <li>Manual follow-up queue inside admin</li>
              </ul>
            </div>
            <div className="info-card">
              <h3 style={{ fontSize: 26 }}>Response expectations</h3>
              <p style={{ marginTop: 12 }}>
                The best briefs are specific about mood, colors, finish, servings, and date flexibility. That reduces back-and-forth and helps the team confirm direction faster.
              </p>
            </div>
            <div className="image-strip">
              {[
                "https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?auto=format&fit=crop&w=1200&q=80"
              ].map((src) => (
                <div className="image-strip-card" key={src}>
                  <Image src={src} alt="" fill sizes="(max-width: 1080px) 100vw, 18vw" />
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
