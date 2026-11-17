import type { Metadata } from "next";
import PricingCalc from "@/components/pricing/PricingCalc";
export const metadata: Metadata = { title: "Pricing | Arlix", description: "Estimated prices for AI films and images by Arlix." };
export default function Pricing() { return <PricingCalc />; }
