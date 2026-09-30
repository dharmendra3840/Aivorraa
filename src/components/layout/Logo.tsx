import Image from "next/image";

import { cx } from "@/components/ui";

/**
 * Aivorraa wordmark.
 *
 * PRD §4 lists the known logo asset as
 * aivorraa.com/wp-content/uploads/2026/07/3-scaled.png with the note
 * "verify current approved file before implementation", and PRD §29 lists
 * approving the logo file as an open item.
 *
 * Until the approved asset is supplied this renders a type-set wordmark: it is
 * crisp at every size, costs no request, causes no layout shift and is honest
 * about being provisional. To swap in the real asset, replace the span with a
 * next/image (or inline SVG) at the same height and keep the aria-label on the
 * parent link in Header.tsx.
 */
export function Logo({
  className,
  tone = "ink",
}: {
  className?: string;
  tone?: "ink" | "light";
}) {
  return (
    <span
      className={cx(
        "font-display inline-flex items-center gap-2.5 leading-none font-bold tracking-[-0.01em]",
        tone === "ink" ? "text-ink" : "text-ink",
        className,
      )}
      style={{ fontSize: "1.375rem" }}
    >
      {/*
        The monogram, extracted from the brand's logo-reveal video
        (public/brand). 64px source for a ~34px mark: sharp on 2x screens and
        2KB, rather than the 22KB master. Decorative -- the parent link
        carries the accessible name.
      */}
      <Image
        src="/brand/monogram-64.png"
        alt=""
        width={64}
        height={64}
        unoptimized
        className="logo-mark h-[1.55em] w-[1.55em] shrink-0"
      />
      <span aria-hidden="true">AIVORRAA</span>
    </span>
  );
}
