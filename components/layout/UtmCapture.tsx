"use client";

import { useEffect } from "react";

/** Stores first-touch UTM parameters and referrer for the session; sent with the contact form. */
export function UtmCapture() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem("zd_utm")) return;
      const p = new URLSearchParams(window.location.search);
      const parts = ["utm_source", "utm_medium", "utm_campaign"].filter((k) => p.get(k)).map((k) => `${k}=${p.get(k)}`);
      if (document.referrer && !document.referrer.includes(window.location.host)) parts.push(`ref=${document.referrer}`);
      sessionStorage.setItem("zd_utm", parts.join("&") || "direct");
    } catch {}
  }, []);
  return null;
}
