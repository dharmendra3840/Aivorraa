"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import type { Spiral3DSlide } from "@/components/ui/spiral-3d-slider";
import { MEDIA, SERVICE_MEDIA, type MediaKey } from "@/content/media";

/**
 * The spiral gallery (components/ui/spiral-3d-slider, from @componentry),
 * filled with the site's own images: the photograph for each of the nine
 * services, then the three example builds.
 *
 * three.js and react-three-fiber are ~190KB, so the slider is a separate
 * chunk: it is imported only when the section comes within a screen of the
 * viewport, and never on the server. Until then the stage holds its height
 * (no layout shift).
 *
 * When real project screenshots arrive (content/portfolio.ts), they belong
 * at the front of this list: a spiral of real work is proof; of stock
 * photographs, it is decoration.
 */
const Spiral3DSlider = dynamic(
  () => import("@/components/ui/spiral-3d-slider").then((m) => m.Spiral3DSlider),
  { ssr: false },
);

const KEYS: MediaKey[] = [
  ...Object.values(SERVICE_MEDIA),
  "bp-ecom",
  "bp-crm",
  "bp-report",
];

const slides: Spiral3DSlide[] = KEYS.map((key) => ({
  src: `/media/${MEDIA[key].name}-1080.webp`,
  alt: MEDIA[key].alt,
}));

export function SpiralGallery() {
  const ref = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="min-h-[640px] sm:min-h-[720px]">
      {load ? (
        <Spiral3DSlider
          items={slides}
          autoRotate
          autoSpeed={0.13}
          ariaLabel="Images from Aivorraa's services and example builds"
          className="min-h-[640px] sm:min-h-[720px]"
        />
      ) : null}
    </div>
  );
}
