"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

// Scène en trait : l'humain arrive de la gauche, la machine de la droite,
// ils se serrent la main puis repartent ensemble vers la droite.
// Tout est dessiné en `currentColor` pour suivre le thème clair/sombre.

const SOL = 212;

function Humain() {
  return (
    <g data-humain>
      <g data-h-contenu>
        <circle cx="0" cy="98" r="15" />
        <line x1="0" y1="113" x2="0" y2="156" />
        <g data-h-bras-arr transform="translate(0,122)">
          <line x1="0" y1="0" x2="0" y2="42" />
        </g>
        <g data-h-jambe-a transform="translate(0,156)">
          <line x1="0" y1="0" x2="0" y2="56" />
        </g>
        <g data-h-jambe-b transform="translate(0,156)">
          <line x1="0" y1="0" x2="0" y2="56" />
        </g>
        <g data-h-bras-av transform="translate(0,122)">
          <line x1="0" y1="0" x2="0" y2="48" />
          <circle data-h-main cx="0" cy="48" r="4.5" fill="currentColor" />
        </g>
      </g>
    </g>
  );
}

function Machine() {
  return (
    <g data-robot>
      <g data-r-contenu>
        <line x1="0" y1="62" x2="0" y2="74" />
        <circle cx="0" cy="58" r="4" className="text-accent" fill="currentColor" />
        <rect x="-17" y="74" width="34" height="30" rx="9" />
        <circle cx="-7" cy="89" r="2.6" className="text-accent" fill="currentColor" />
        <circle cx="7" cy="89" r="2.6" className="text-accent" fill="currentColor" />
        <rect x="-15" y="110" width="30" height="46" rx="8" />
        <g data-r-bras-arr transform="translate(0,122)">
          <line x1="0" y1="0" x2="0" y2="40" />
        </g>
        <g data-r-jambe-a transform="translate(0,156)">
          <line x1="0" y1="0" x2="0" y2="56" />
        </g>
        <g data-r-jambe-b transform="translate(0,156)">
          <line x1="0" y1="0" x2="0" y2="56" />
        </g>
        <g data-r-bras-av transform="translate(0,122)">
          <line x1="0" y1="0" x2="0" y2="48" />
          <rect data-r-main x="-4.5" y="43.5" width="9" height="9" rx="2" fill="currentColor" />
        </g>
      </g>
    </g>
  );
}

export default function SceneIA() {
  const ref = useRef(null);

  useEffect(() => {
    const racine = ref.current;
    if (!racine) return;

    const q = (s) => racine.querySelector(s);
    const humain = q("[data-humain]");
    const robot = q("[data-robot]");
    const rContenu = q("[data-r-contenu]");
    const hContenu = q("[data-h-contenu]");

    const jambes = [
      q("[data-h-jambe-a]"),
      q("[data-h-jambe-b]"),
      q("[data-r-jambe-a]"),
      q("[data-r-jambe-b]"),
    ];
    const brasArr = [q("[data-h-bras-arr]"), q("[data-r-bras-arr]")];
    const brasAv = [q("[data-h-bras-av]"), q("[data-r-bras-av]")];

    gsap.set([...jambes, ...brasArr, ...brasAv], {
      transformOrigin: "0px 0px",
    });
    gsap.set(rContenu, { transformOrigin: "50% 50%", scaleX: -1 });

    const REPOS = { x: -48, xr: 48 };

    // Pose finale figée si l'utilisateur a demandé moins de mouvement.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(humain, { x: REPOS.x });
      gsap.set(robot, { x: REPOS.xr });
      gsap.set(brasAv[0], { rotation: -90 });
      gsap.set(brasAv[1], { rotation: -90 });
      return;
    }

    const ctx = gsap.context(() => {
      // Cycle de marche : jambes en opposition, bras en contre-balancier.
      const cycle = gsap.timeline({ repeat: -1, yoyo: true, paused: true });
      cycle
        .fromTo(
          [jambes[0], jambes[2]],
          { rotation: -22 },
          { rotation: 22, duration: 0.36, ease: "sine.inOut" },
          0,
        )
        .fromTo(
          [jambes[1], jambes[3]],
          { rotation: 22 },
          { rotation: -22, duration: 0.36, ease: "sine.inOut" },
          0,
        )
        .fromTo(
          brasArr,
          { rotation: 16 },
          { rotation: -16, duration: 0.36, ease: "sine.inOut" },
          0,
        )
        .fromTo(
          brasAv,
          { rotation: -16 },
          { rotation: 16, duration: 0.36, ease: "sine.inOut" },
          0,
        )
        .fromTo(
          [hContenu, rContenu],
          { y: 0 },
          { y: -2.5, duration: 0.18, ease: "sine.inOut", yoyo: true, repeat: 1 },
          0,
        );

      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.9 });

      tl.set(humain, { x: -400, autoAlpha: 1 })
        .set(robot, { x: 400, autoAlpha: 1 }, 0)
        .set(rContenu, { scaleX: -1 }, 0)
        .add(() => cycle.play(), 0)

        // 1. Approche
        .to(humain, { x: REPOS.x, duration: 3, ease: "none" }, 0)
        .to(robot, { x: REPOS.xr, duration: 3, ease: "none" }, 0)

        // 2. Arrêt net, jambes ramenées au sol
        .add(() => cycle.pause(), 3)
        .to([...jambes, ...brasArr], { rotation: 0, duration: 0.3 }, 3)

        // 3. Les deux tendent la main
        .to(brasAv, { rotation: -90, duration: 0.55, ease: "power2.out" }, 3.15)

        // 4. Poignée de main
        .to(
          [humain, robot],
          {
            y: -3,
            duration: 0.16,
            ease: "sine.inOut",
            yoyo: true,
            repeat: 5,
          },
          3.8,
        )

        // 5. La machine se retourne, ils repartent ensemble
        .to(brasAv, { rotation: 0, duration: 0.4 }, 5)
        .to(rContenu, { scaleX: 1, duration: 0.45, ease: "power2.inOut" }, 5.1)
        .add(() => cycle.play(), 5.6)
        .to(humain, { x: 430, duration: 3.4, ease: "none" }, 5.6)
        .to(robot, { x: 520, duration: 3.4, ease: "none" }, 5.6)
        .to([humain, robot], { autoAlpha: 0, duration: 0.5 }, 8.5)
        .add(() => cycle.pause(), 9);
    }, racine);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-xl border border-line bg-surface"
    >
      <svg
        viewBox="0 0 900 260"
        className="h-auto w-full text-ink"
        role="img"
        aria-label="Un développeur et une machine se rejoignent, se serrent la main et repartent ensemble."
      >
        <line
          x1="0"
          y1={SOL}
          x2="900"
          y2={SOL}
          className="text-line"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="3 7"
        />
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          transform="translate(450,0)"
        >
          <Humain />
          <Machine />
        </g>
      </svg>
    </div>
  );
}
