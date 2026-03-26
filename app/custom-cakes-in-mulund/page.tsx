import { LocalLandingPage, getLocalLandingMetadata } from "@/components/local-landing-page";

export async function generateMetadata() {
  return getLocalLandingMetadata("custom-cakes-in-mulund");
}

export default function CustomCakesInMulundPage() {
  return <LocalLandingPage slug="custom-cakes-in-mulund" />;
}
