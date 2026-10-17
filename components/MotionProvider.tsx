"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const CARD = ".luxe-card, [data-reveal]";

/**
 * 3D scroll motion:
 *  - hero depth: the hero photo and text move at different speeds as you scroll
 *  - cards and headings tip up out of the page as they enter the screen (only things below the fold are hidden)
 *  - cards tilt toward the mouse on desktop
 * Helper attributes are removed after each effect so your original hover styles keep working.
 */
export default function MotionProvider() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cleanups: Array<() => void> = [];

    /* ---------- hero scroll depth ---------- */
    const hero = document.querySelector(".mo-hero-stack")?.closest("section") as HTMLElement | null;
    if (hero) {
      hero.classList.add("mo-hero-section");
      let ticking = false;
      const update = () => {
        ticking = false;
        const p = Math.min(1, Math.max(0, window.scrollY / Math.max(1, hero.offsetHeight)));
        hero.style.setProperty("--hs", p.toFixed(3));
      };
      const onScroll = () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      };
      update();
      window.addEventListener("scroll", onScroll, { passive: true });
      cleanups.push(() => {
        window.removeEventListener("scroll", onScroll);
        hero.classList.remove("mo-hero-section");
        hero.style.removeProperty("--hs");
      });
    }

    /* ---------- 3D scroll reveal ---------- */
    if ("IntersectionObserver" in window) {
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
            }, 1400);
          }
        },
        { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
      );

      const prep = (el: HTMLElement, index: number) => {
        if (seen.has(el)) return;
        seen.add(el);
        if (el.classList.contains("animate-fadeInUp")) return;
        if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;
        el.setAttribute("data-mo", "pre");
        el.style.setProperty("--mo-delay", Math.min(index, 6) * 90 + "ms");
        el.style.setProperty("--mo-ry", (index % 2 === 0 ? -7 : 7) + "deg");
        io.observe(el);
      };

      const scan = () => {
        document.querySelectorAll<HTMLElement>("section h2").forEach((h) => prep(h, 0));
        document.querySelectorAll<HTMLElement>(CARD).forEach((card) => {
          const peers = card.parentElement
            ? Array.from(card.parentElement.children).filter((c) => c.matches(CARD))
            : [card];
          prep(card, Math.max(0, peers.indexOf(card)));
        });
      };

      let frame = 0;
      const schedule = () => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(scan);
      };
      scan();
      const mutations = new MutationObserver(schedule); // menu items load after the page, so re-scan
      mutations.observe(document.body, { childList: true, subtree: true });
      cleanups.push(() => {
        cancelAnimationFrame(frame);
        mutations.disconnect();
        io.disconnect();
        document.querySelectorAll("[data-mo]").forEach((el) => el.removeAttribute("data-mo"));
      });
    }

    /* ---------- card tilt (mouse only) ---------- */
    if (window.matchMedia("(pointer: fine)").matches) {
      const reset = (card: HTMLElement) => {
        card.removeAttribute("data-tilt");
        card.style.removeProperty("--rx");
        card.style.removeProperty("--ry");
      };
      const onMove = (e: PointerEvent) => {
        const card = (e.target as Element | null)?.closest?.(".luxe-card") as HTMLElement | null;
        if (!card || card.hasAttribute("data-mo")) return;
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.setAttribute("data-tilt", "");
        card.style.setProperty("--rx", (-y * 9).toFixed(2) + "deg");
        card.style.setProperty("--ry", (x * 11).toFixed(2) + "deg");
      };
      const onOut = (e: PointerEvent) => {
        const card = (e.target as Element | null)?.closest?.(".luxe-card") as HTMLElement | null;
        if (card && !card.contains(e.relatedTarget as Node | null)) reset(card);
      };
      document.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerout", onOut, { passive: true });
      cleanups.push(() => {
        document.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerout", onOut);
        document.querySelectorAll<HTMLElement>("[data-tilt]").forEach(reset);
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, [pathname]);

  return null;
}
