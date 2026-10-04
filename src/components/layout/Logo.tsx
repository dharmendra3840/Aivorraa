import Image from "next/image";

import { cx } from "@/components/ui";

/**
 * Aivorraa wordmark: the monogram (extracted from the brand's logo-reveal
 * video, public/brand) beside the name, set in the display face.
 *
 * PRD §4 / §29 — the approved logo file is still an open item. Until it is
 * supplied this type-set version is used: crisp at every size, no layout
 * shift, and honest about being provisional. The parent link carries the
 * accessible name.
 */
export function Logo({
  className,
}: {
  className?: string;
  /** Kept for existing call sites; the mark follows the theme by itself. */
  tone?: "ink" | "light";
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-2 leading-none",
        className,
      )}
    >
      <Image
        src="/brand/monogram-64.png"
        alt=""
        width={64}
        height={64}
        unoptimized
        className="logo-mark h-[1.9em] w-[1.9em] shrink-0"
      />
      <span
        aria-hidden="true"
        className="text-[1.3em] font-normal tracking-[-0.045em]"
      >
        Aivorraa
      </span>
    </span>
  );
}
