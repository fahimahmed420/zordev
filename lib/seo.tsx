import type { Metadata } from "next";
import { site } from "@/content/site";

const OG_IMAGE = { url: "/opengraph-image", width: 1200, height: 630, alt: "Zordev: production fixes for apps built with AI tools" };

export function pageMeta(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    // Child metadata replaces the layout's openGraph object, so the share image and locale must be repeated here.
    openGraph: { title: `${title} | Zordev`, description, url: path, siteName: "Zordev", type: "website", locale: "en_US", images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title: `${title} | Zordev`, description, images: [OG_IMAGE.url] },
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

export const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Zordev",
  url: site.url,
  publisher: { "@type": "Organization", name: "Zordev", url: site.url },
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
