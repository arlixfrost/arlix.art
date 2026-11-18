import type { Metadata } from "next";
import { localeMeta } from "@/lib/meta";
import PricingCalc from "@/components/pricing/PricingCalc";
export const metadata: Metadata = localeMeta("en", "/pricing/", "meta.pricingTitle", "meta.pricingDescription");
export default function Pricing() { return <PricingCalc />; }
