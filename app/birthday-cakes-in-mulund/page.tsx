import { LocalLandingPage, getLocalLandingMetadata } from "@/components/local-landing-page";

export async function generateMetadata() {
  return getLocalLandingMetadata("birthday-cakes-in-mulund");
}

export default function BirthdayCakesInMulundPage() {
  return <LocalLandingPage slug="birthday-cakes-in-mulund" />;
}
