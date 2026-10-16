"use client";

import { useEffect } from "react";

const LABEL = (process.env.NEXT_PUBLIC_ADS_CONVERSION_LABEL || "").replace(/["'\s]/g, "");

export default function ConversionTracker() {
  useEffect(() => {
    if (!/^AW-\d+\/[\w-]+$/.test(LABEL)) return;
    const w = window as unknown as { gtag?: (...args: unknown[]) => void };
    if (typeof w.gtag === "function") w.gtag("event", "conversion", { send_to: LABEL });
  }, []);
  return null;
}
