import { LocalLandingPage, getLocalLandingMetadata } from "@/components/local-landing-page";

export async function generateMetadata() {
  return getLocalLandingMetadata("custom-cakes-in-mumbai");
}

export default function CustomCakesInMumbaiPage() {
  return <LocalLandingPage slug="custom-cakes-in-mumbai" />;
}
