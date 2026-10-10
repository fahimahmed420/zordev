import type { Metadata } from "next";
import { site } from "@/content/site";

export function pageMeta(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: `${title} | Zordev`, description, url: path, siteName: "Zordev", type: "website" },
    twitter: { card: "summary_large_image", title: `${title} | Zordev`, description },
  };
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export const organizationLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Zordev",
  url: site.url,
  email: site.email,
  description: site.description,
  logo: `${site.url}/icon.svg`,
  foundingDate: site.foundingYear,
  founder: { "@type": "Person", name: site.owner.name, url: site.owner.portfolio },
  address: { "@type": "PostalAddress", addressLocality: "Dhaka", addressCountry: "BD" },
  areaServed: "Worldwide",
  sameAs: [site.socials.linkedin, site.socials.x, site.socials.github],
};

export const breadcrumbLd = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: `${site.url}${it.path}`,
  })),
});
