import { LocalLandingPage, getLocalLandingMetadata } from "@/components/local-landing-page";

export async function generateMetadata() {
  return getLocalLandingMetadata("cakes-in-mulund");
}

export default function CakesInMulundPage() {
  return <LocalLandingPage slug="cakes-in-mulund" />;
}
