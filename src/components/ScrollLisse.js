"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { definirScroll } from "@/lib/scroll";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollLisse() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ duration: 1.1 });
    definirScroll(lenis);

    // Sans ce branchement, ScrollTrigger continue de lire le scroll natif et
    // les révélations se déclenchent à côté de ce qui est réellement affiché.
    lenis.on("scroll", ScrollTrigger.update);
    const boucle = (temps) => lenis.raf(temps * 1000);
    gsap.ticker.add(boucle);
    gsap.ticker.lagSmoothing(0);

    // Les ancres du header pointent vers `/#section`. Lenis n'intercepte que
    // les href commençant par `#`, et le saut natif court-circuiterait
    // l'inertie — on les réachemine à la main.
    const surClic = (e) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const lien = e.target.closest("a[href]");
      if (!lien || lien.target === "_blank") return;

      const url = new URL(lien.href, window.location.href);
      if (url.pathname !== window.location.pathname || !url.hash) return;

      const cible = document.querySelector(url.hash);
      // Les ancres qui désignent une carte du rouleau sont gérées par lui :
      // il faut le faire tourner, pas faire défiler la page jusqu'à elle.
      if (!cible || cible.closest("[data-rouleau]")) return;

      // `stopPropagation` en capture : sans ça le <Link> de Next reçoit le clic
      // avant nous, navigue lui-même et le saut natif écrase l'inertie.
      e.preventDefault();
      e.stopPropagation();
      lenis.scrollTo(cible, { offset: -80 });
      window.history.pushState(null, "", url.hash);
    };
    document.addEventListener("click", surClic, true);

    return () => {
      document.removeEventListener("click", surClic, true);
      gsap.ticker.remove(boucle);
      definirScroll(null);
      lenis.destroy();
    };
  }, []);

  return null;
}
