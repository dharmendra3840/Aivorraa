import type { CSSProperties } from "react";

import { MEDIA, type MediaKey } from "@/content/media";
import { cx } from "@/components/ui";

/**
 * A photograph in a frame.
 *
 * The FRAME sets the size (give it an aspect ratio or a height through
 * `className`); the image fills it with `object-fit: cover`. Width and height
 * are still on the <img> so the browser knows its ratio early, and the frame
 * has its own fixed geometry, so nothing shifts as it loads (CLS, PRD §21).
 *
 * Responsive WebP renditions (640-2200w) come from /public/media; `sizes` must
 * describe the rendered width so the browser picks the right one. A 24px
 * blurred preview (LQIP) is the frame's background until the photo arrives.
 *
 * Motion (motion.css §2-3): the frame unclips as it enters (`reveal`) and the
 * photo settles and drifts with the scroll. `still` turns the drift off for
 * small frames, where parallax reads as jitter rather than depth.
 */
export function Photo({
  id,
  sizes,
  className,
  priority = false,
  still = false,
  reveal = true,
  alt,
  style,
}: {
  id: MediaKey;
  sizes: string;
  className?: string;
  /** The above-the-fold image: loaded eagerly at high priority. */
  priority?: boolean;
  still?: boolean;
  reveal?: boolean;
  /** Override the catalogue alt text; pass "" when the image is decorative. */
  alt?: string;
  style?: CSSProperties;
}) {
  const m = MEDIA[id];
  const srcSet = m.widths
    .map((w) => `/media/${m.name}-${w}.webp ${w}w`)
    .join(", ");
  const fallbackW = m.widths.includes(1080) ? 1080 : m.widths[m.widths.length - 1];

  return (
    <div
      className={cx("media", className)}
      data-still={still ? "" : undefined}
      data-reveal-media={reveal ? "" : undefined}
      style={{ backgroundImage: `url(${m.lqip})`, ...style }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- renditions are pre-built; next/image would re-encode them */}
      <img
        src={`/media/${m.name}-${fallbackW}.webp`}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt ?? m.alt}
        width={m.width}
        height={m.height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
      />
    </div>
  );
}
