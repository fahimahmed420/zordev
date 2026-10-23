import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { caseStudies } from "@/content/work";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/services", "/work", "/process", "/pricing", "/audit", "/about", "/contact", "/project-terms", "/privacy", "/terms"];
  return [
    ...routes.map((r) => ({ url: `${site.url}${r}`, changeFrequency: "monthly" as const, priority: r === "" ? 1 : 0.7 })),
    ...caseStudies.map((c) => ({ url: `${site.url}/work/${c.slug}`, changeFrequency: "yearly" as const, priority: 0.6 })),
  ];
}
