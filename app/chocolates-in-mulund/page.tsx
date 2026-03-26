import { LocalLandingPage, getLocalLandingMetadata } from "@/components/local-landing-page";

export async function generateMetadata() {
  return getLocalLandingMetadata("chocolates-in-mulund");
}

export default function ChocolatesInMulundPage() {
  return <LocalLandingPage slug="chocolates-in-mulund" />;
}
