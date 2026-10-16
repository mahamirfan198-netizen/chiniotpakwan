"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function MotionProvider() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const cleanups: Array<() => void> = [];
    const seen = new WeakSet<Element>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          io.unobserve(el);
          el.setAttribute("data-mo", "in");
          window.setTimeout(() => {
            el.removeAttribute("data-mo");
            el.style.removeProperty("--mo-delay");
            el.style.removeProperty("--mo-ry");
          }, 1500);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    const prep = (el: HTMLElement, delay: number, swing = 0) => {
      if (seen.has(el)) return;
      seen.add(el);
      if (el.classList.contains("animate-fadeInUp")) return;
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;
      el.setAttribute("data-mo", "pre");
      el.style.setProperty("--mo-delay", delay + "ms");
      el.style.setProperty("--mo-ry", swing + "deg");
      io.observe(el);
    };

    const scan = () => {
      document.querySelectorAll<HTMLElement>("section h2").forEach((h) => prep(h, 0));
      document.querySelectorAll<HTMLElement>(".luxe-card, [data-reveal]").forEach((card) => {
        const parent = card.parentElement;
        const peers = parent ? Array.from(parent.children).filter((c) => c.matches(".luxe-card, [data-reveal]")) : [card];
        const index = Math.max(0, peers.indexOf(card));
        const swing = peers.length > 1 ? (index % 2 === 0 ? -9 : 9) : 0;
        prep(card, Math.min(index, 6) * 90, swing);
      });
    };

    let scanFrame = 0;
    const schedule = () => { cancelAnimationFrame(scanFrame); scanFrame = requestAnimationFrame(scan); };
    scan();
    const mutations = new MutationObserver(schedule);
    mutations.observe(document.body, { childList: true, subtree: true });
    cleanups.push(() => { cancelAnimationFrame(scanFrame); mutations.disconnect(); io.disconnect(); document.querySelectorAll("[data-mo]").forEach((el) => el.removeAttribute("data-mo")); });

    let scrollFrame = 0;
    let heroActive = false;
    const resetHero = () => {
      const bg = document.querySelector<HTMLElement>(".mo-kenburns");
      const stack = document.querySelector<HTMLElement>(".mo-hero-stack");
      bg?.style.removeProperty("translate"); bg?.style.removeProperty("scale");
      if (stack) { stack.style.removeProperty("translate"); stack.style.removeProperty("rotate"); stack.style.removeProperty("opacity"); }
      stack?.parentElement?.classList.remove("mo-scene");
    };
    const updateHero = () => {
      scrollFrame = 0;
      const bg = document.querySelector<HTMLElement>(".mo-kenburns");
      const stack = document.querySelector<HTMLElement>(".mo-hero-stack");
      if (!bg && !stack) return;
      const vh = window.innerHeight; const y = window.scrollY;
      if (y > vh * 1.2) { if (heroActive) { resetHero(); heroActive = false; } return; }
      heroActive = true;
      const p = Math.min(Math.max(y / vh, 0), 1);
      if (bg) { bg.style.translate = "0 " + (p * vh * 0.18).toFixed(1) + "px"; bg.style.scale = (1 + p * 0.12).toFixed(4); }
      if (stack) { stack.parentElement?.classList.add("mo-scene"); stack.style.translate = "0 " + (-p * 70).toFixed(1) + "px"; stack.style.rotate = "1 0 0 " + (p * 14).toFixed(2) + "deg"; stack.style.opacity = String(Math.max(0, 1 - p * 1.25).toFixed(3)); }
    };
    const onScroll = () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateHero); };
    updateHero();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    cleanups.push(() => { cancelAnimationFrame(scrollFrame); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); resetHero(); });

    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      const MAX_DEG = 7;
      let active: HTMLElement | null = null;
      const release = (el: HTMLElement) => {
        const current = el.style.rotate;
        el.style.removeProperty("rotate"); el.classList.remove("mo-tilt");
        if (current && el.animate) el.animate([{ rotate: current }, { rotate: "0 0 1 0deg" }], { duration: 380, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)" });
      };
      const onMove = (e: PointerEvent) => {
        const target = (e.target as Element | null)?.closest?.(".luxe-card") as HTMLElement | null;
        if (active && active !== target) { release(active); active = null; }
        if (!target || target.hasAttribute("data-mo")) return;
        const rect = target.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const dx = (e.clientX - rect.left) / rect.width - 0.5;
        const dy = (e.clientY - rect.top) / rect.height - 0.5;
        const angle = Math.min(1, Math.hypot(dx, dy) * 2) * MAX_DEG;
        target.parentElement?.classList.add("mo-scene");
        target.classList.add("mo-tilt");
        target.style.rotate = (-dy).toFixed(3) + " " + dx.toFixed(3) + " 0 " + angle.toFixed(2) + "deg";
        active = target;
      };
      const onLeaveWindow = () => { if (active) { release(active); active = null; } };
      document.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeaveWindow);
      cleanups.push(() => { document.removeEventListener("pointermove", onMove); document.removeEventListener("pointerleave", onLeaveWindow); if (active) release(active); document.querySelectorAll(".mo-tilt").forEach((el) => { (el as HTMLElement).style.removeProperty("rotate"); el.classList.remove("mo-tilt"); }); });
    }

    return () => cleanups.forEach((fn) => fn());
  }, [pathname]);

  return null;
}
