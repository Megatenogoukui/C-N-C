import { LocalLandingPage, getLocalLandingMetadata } from "@/components/local-landing-page";

export async function generateMetadata() {
  return getLocalLandingMetadata("cakes-in-mumbai");
}

export default function CakesInMumbaiPage() {
  return <LocalLandingPage slug="cakes-in-mumbai" />;
}
