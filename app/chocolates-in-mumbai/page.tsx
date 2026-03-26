import { LocalLandingPage, getLocalLandingMetadata } from "@/components/local-landing-page";

export async function generateMetadata() {
  return getLocalLandingMetadata("chocolates-in-mumbai");
}

export default function ChocolatesInMumbaiPage() {
  return <LocalLandingPage slug="chocolates-in-mumbai" />;
}
