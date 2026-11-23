import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import Link from "next/link";
import { ButtonLink, Container, Section } from "@/components/ui";
import { cta, site } from "@/content/site";

/**
 * Taka prices for Bangladeshi clients. Shared by link (zordev.com/bd), never shown in the
 * main navigation or sitemap, and kept out of search results, so the main site stays in USD.
 */
const bangla = Hind_Siliguri({ subsets: ["bengali", "latin"], weight: ["400", "500", "600"], display: "swap", variable: "--font-bangla" });

export const metadata: Metadata = {
  title: "বাংলাদেশের জন্য মূল্য তালিকা",
  description: "বাংলাদেশি ব্যবসার জন্য Zordev-এর ওয়েবসাইট, অনলাইন স্টোর ও ওয়েব অ্যাপের দাম, টাকায়।",
  alternates: { canonical: "/bd" },
  robots: { index: false, follow: false },
};

const packages = [
  {
    name: "এক পাতার সাইট",
    price: "৳২৫,০০০",
    time: "১ সপ্তাহ",
    suits: "নতুন ব্যবসা, একটি পণ্য বা সার্ভিস, বা পার্সোনাল ব্র্যান্ড",
    includes: ["৬টি পর্যন্ত সেকশনসহ একটি পেজ", "কন্ট্যাক্ট ফর্ম বা WhatsApp বাটন", "বেসিক SEO ও শেয়ার ইমেজ", "পরে বড় সাইটে গেলে এই টাকা বাদ যাবে"],
  },
  {
    name: "লঞ্চ সাইট",
    price: "৳৬০,০০০",
    time: "২–৩ সপ্তাহ",
    suits: "ছোট ও মাঝারি ব্যবসার পূর্ণ ওয়েবসাইট",
    includes: ["৫টি পর্যন্ত পেজ", "কন্ট্যাক্ট বা বুকিং ফর্ম", "অন-পেজ SEO", "মোবাইলে দ্রুত ও সহজ"],
  },
  {
    name: "গ্রোথ সাইট",
    price: "৳১,২০,০০০",
    time: "৩–৫ সপ্তাহ",
    suits: "যে ব্যবসা নিয়মিত কনটেন্ট বা ব্লগ প্রকাশ করে",
    includes: ["একাধিক পেজ, বাংলা ও ইংরেজি", "নিজে এডিট করার জন্য CMS", "SEO ও অ্যানালিটিক্স", "সার্ভিস বা প্রোডাক্ট পেজ"],
  },
  {
    name: "কাস্টম অনলাইন স্টোর",
    price: "৳২,০০,০০০",
    time: "৫–৮ সপ্তাহ",
    suits: "যারা অনলাইনে পণ্য বিক্রি করেন",
    includes: ["স্টোর, কার্ট ও চেকআউট", "অ্যাডমিন প্যানেল", "bKash, Nagad, SSLCOMMERZ ও ক্যাশ অন ডেলিভারি", "কুরিয়ার বুকিং ও অর্ডার ইমেইল"],
    highlighted: true,
  },
];

const terms = [
  "প্রতিটি প্রজেক্টের কাজ শুরুর আগে লিখিত স্কোপ ও নির্দিষ্ট দাম।",
  "পেমেন্ট: ৫০% শুরুতে, ৫০% ডেলিভারির সময়। ৳১,৫০,০০০-এর বেশি হলে ৪০% / ৩০% / ৩০%।",
  "bKash, Nagad বা ব্যাংক ট্রান্সফারে পেমেন্ট।",
  "ডোমেইন, হোস্টিং ও সব কোড আপনার নামে, পুরো পেমেন্টের পর সম্পূর্ণ হ্যান্ডওভার।",
  "হ্যান্ডওভারের পর ৩০ দিন ফ্রি বাগ ফিক্স।",
];

export default function BangladeshPricingPage() {
  return (
    <div lang="bn" className={`${bangla.variable} [&_:is(h1,h2,h3,p,li,span)]:[font-family:var(--font-bangla),var(--font-inter),sans-serif]`}>
      <section className="relative overflow-x-clip">
        <div aria-hidden="true" className="pointer-events-none absolute -top-40 right-[10%] h-[26rem] w-[26rem] rounded-full bg-orange/[0.07] blur-[120px]" />
        <Container className="relative pb-14 pt-16 sm:pb-20 sm:pt-24">
          <p className="reveal font-mono text-xs uppercase tracking-[0.18em] text-orange">বাংলাদেশের জন্য · টাকায় দাম</p>
          <h1 className="reveal mt-6 max-w-4xl text-[2.5rem] font-semibold leading-[1.15] sm:text-7xl" style={{ ["--d" as string]: "80ms" }}>
            বাংলাদেশি ব্যবসার জন্য <span className="text-orange">ঠিকঠাক তৈরি</span> ওয়েবসাইট
          </h1>
          <p className="reveal mt-8 max-w-2xl text-lg leading-relaxed text-muted" style={{ ["--d" as string]: "160ms" }}>
            একই মান, একই প্রক্রিয়া, যা আমি বিদেশি ক্লায়েন্টদের জন্য করি। শুধু দাম টাকায় এবং পেমেন্ট bKash, Nagad বা ব্যাংকে। কাজ করি আমি নিজে, কোনো মধ্যস্থতাকারী নেই।
          </p>
        </Container>
      </section>

      <Section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {packages.map((p) => (
            <div key={p.name} className={`relative flex flex-col rounded-2xl border p-7 ${p.highlighted ? "border-orange ring-1 ring-orange" : "border-line"}`}>
              <h2 className="text-2xl font-semibold">{p.name}</h2>
              <p className="mt-1 min-h-[2lh] text-sm text-muted">{p.suits}</p>
              <p className="mt-5 text-sm text-muted">শুরু</p>
              <p className="text-4xl font-semibold tabular-nums">{p.price}</p>
              <p className="mt-1 text-sm text-muted">{p.time}</p>
              <ul className="mt-6 space-y-2 text-sm">
                {p.includes.map((i) => (
                  <li key={i} className="flex gap-2">
                    <span aria-hidden="true" className="text-orange">✓</span>
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-6 max-w-3xl text-muted">
          ওয়েব অ্যাপ, লার্নিং প্ল্যাটফর্ম বা কাস্টম সফটওয়্যারের দাম কাজের পরিধি দেখে ঠিক হয়, সাধারণত ৳২,৫০,০০০ থেকে।
          উদাহরণ: <Link href="/work/wlfbd" className="text-ink underline underline-offset-4">We Learn French BD</Link>। লঞ্চের পর কেয়ার প্ল্যান মাসে ৳৫,০০০ থেকে।
        </p>
      </Section>

      <Section className="bg-paper">
        <div className="grid gap-10 md:grid-cols-[1fr_1.3fr]">
          <h2 className="text-3xl font-semibold sm:text-4xl">কীভাবে কাজ হয়</h2>
          <ul className="space-y-3 text-muted">
            {terms.map((t) => (
              <li key={t} className="flex gap-3">
                <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section>
        <div className="max-w-3xl">
          <h2 className="text-3xl font-semibold sm:text-5xl">আপনার প্রজেক্ট নিয়ে কথা বলি</h2>
          <p className="mt-4 text-lg text-muted">
            একটি ফ্রি ২০ মিনিটের কলে বা লিখিত ব্রিফে আপনার প্রয়োজন জানান। ফর্মটি ইংরেজিতে, তবে বাংলায় লিখতে পারেন। এক কর্মদিবসের মধ্যে উত্তর দিই।
          </p>
          <p className="mt-4 break-all font-mono text-ink">{site.email}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={cta.primary.href} location="bd_book">কল বুক করুন</ButtonLink>
            <ButtonLink href={cta.secondary.href} variant="ghost" location="bd_brief">ব্রিফ পাঠান</ButtonLink>
          </div>
        </div>
      </Section>
    </div>
  );
}
