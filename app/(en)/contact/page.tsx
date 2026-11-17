import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = { title: "Contact | Arlix", description: "Start a project with Arlix." };

export default function Contact() {
  return (
    <main className="art-theme min-h-screen">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 md:px-12 pt-12 md:pt-20 pb-20 md:pb-24">
        <h1 className="font-display font-normal text-[40px] md:text-[56px] leading-[1.05]">Contact</h1>
        <div className="gold-rule mt-5 mb-10 md:mb-14" />
        <ContactForm />
      </div>
    </main>
  );
}
