import { LocalLandingPage, getLocalLandingMetadata } from "@/components/local-landing-page";

export async function generateMetadata() {
  return getLocalLandingMetadata("birthday-cakes-in-mumbai");
}

export default function BirthdayCakesInMumbaiPage() {
  return <LocalLandingPage slug="birthday-cakes-in-mumbai" />;
}
