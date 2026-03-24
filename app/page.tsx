import {
  BestsellerSection,
  CollectionSection,
  CustomCtaSection,
  HomeHero,
  JourneySection,
  ReviewsSection,
  StorySection
} from "@/components/sections";
import { getProducts } from "@/lib/catalog";

export default async function HomePage() {
  const products = await getProducts();
  return (
    <main>
      <HomeHero />
      <StorySection />
      <CollectionSection />
      <BestsellerSection products={products} />
      <CustomCtaSection />
      <ReviewsSection />
      <JourneySection />
    </main>
  );
}
