import { Ph } from "@/components/Ph";

export default function Contact() {
  const field = "w-full bg-transparent border border-dashed border-white/30 px-4 py-3 text-sm placeholder:text-white/40 focus:outline-none focus:border-white";
  return (
    <main className="px-6 pt-20 max-w-xl">
      <div className="label mb-3">Contact</div>
      <h1 className="text-4xl font-semibold mb-6">Contact</h1>
      <Ph className="h-16 mb-8">[Short line: how to reach Arlix, response time]</Ph>
      <form className="flex flex-col gap-4">
        <label className="label" htmlFor="name">Name</label>
        <input id="name" className={field} placeholder="[Name]" />
        <label className="label" htmlFor="email">Email</label>
        <input id="email" type="email" className={field} placeholder="[Email]" />
        <label className="label" htmlFor="topic">Topic</label>
        <select id="topic" className={field} defaultValue="">
          <option value="" disabled>[Art or Tech]</option>
          <option>Art</option>
          <option>Tech</option>
        </select>
        <label className="label" htmlFor="msg">Message</label>
        <textarea id="msg" rows={6} className={field} placeholder="[Message]" />
        <button type="button" className="self-start border border-white px-8 py-3 text-sm tracking-widest uppercase hover:bg-white hover:text-black">
          Send (stub)
        </button>
      </form>
      <Ph className="h-12 mt-10">[Email: hello@arlix.art placeholder]</Ph>
      <Ph className="h-12 mt-4">[Socials: Instagram · YouTube · TikTok · Telegram]</Ph>
    </main>
  );
}
