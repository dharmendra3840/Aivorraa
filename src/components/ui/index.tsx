import Link from "next/link";
import type { CSSProperties, ComponentProps, ReactNode } from "react";
import type { Accent } from "@/content/types";
import { ArrowRightIcon } from "@/components/icons";

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/* -------------------------------------------------------------------------- */
/* Layout                                                                     */
/* -------------------------------------------------------------------------- */

export function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cx("container-page", className)}>{children}</div>;
}

export function Section({
  className,
  children,
  id,
  tone = "plain",
}: {
  className?: string;
  children: ReactNode;
  id?: string;
  tone?: "plain" | "surface" | "ink";
}) {
  return (
    <section
      id={id}
      className={cx(
        "py-16 sm:py-20 lg:py-28",
        /*
          A soft vertical wash rather than a flat tinted band: a flat band has
          hard top and bottom edges that read as a rendering seam.
        */
        tone === "surface" &&
          "bg-[linear-gradient(180deg,transparent,var(--color-page-tint)_18%,var(--color-page-tint)_82%,transparent)]",
        // "ink" is the historical name for the contrast panel: an espresso
        // band, with every token inside it flipped by .scope-dark.
        tone === "ink" && "scope-dark bg-panel text-ink",
        className,
      )}
    >
      {children}
    </section>
  );
}

/** Small uppercase label that sits above a section heading. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-4 flex items-center gap-2.5 text-[0.7rem] font-semibold tracking-[0.16em] text-ink-400 uppercase">
      <span
        aria-hidden="true"
        className="bg-lime-400 inline-block h-1.5 w-1.5 rounded-full shadow-[0_0_10px_rgba(var(--glow-rgb),0.44)]"
      />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
}) {
  return (
    <div
      className={cx(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <Tag className="sd-enter text-[2rem] sm:text-[2.5rem] lg:text-[3rem]">
        {title}
      </Tag>
      {lede ? (
        <p className="text-ink-500 mt-5 text-lg leading-relaxed">{lede}</p>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Buttons                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * NOTE ON `className` OVERRIDES
 *
 * `cx` only concatenates; it does not resolve Tailwind conflicts. Two utilities
 * that set the same property are decided by their order in the generated
 * stylesheet, not by their order in the attribute — so passing `hidden` to a
 * component whose base classes include `inline-flex` does NOT hide it.
 *
 * Safe to pass: margin, width, and anything the base does not already set.
 * NOT safe: display, padding, font-size, border-radius. To control visibility
 * or layout, wrap the component in an element that carries those classes.
 *
 * `whitespace-nowrap` is in the base deliberately: a wrapped label turns a pill
 * button into a blob, which is what happens to "Let's Talk" at 320px.
 */
/*
 * `magnetic` makes the button drift a few pixels toward the cursor as it
 * approaches — see PointerFX and motion-advanced.css. It animates the
 * `translate` property, NOT `transform`, so the Tailwind
 * `hover:-translate-y-0.5` in the variants below still applies
 * independently rather than one clobbering the other.
 */
const BUTTON_BASE =
  "magnetic group/btn inline-flex items-center justify-center gap-2 rounded-pill font-semibold whitespace-nowrap transition duration-200 disabled:pointer-events-none disabled:opacity-60";

const BUTTON_VARIANTS = {
  /** Espresso with paper text on the page (15.6:1), cream with espresso text
   *  inside .scope-dark -- the primary conversion action. */
  primary:
    "bg-signal text-page shadow-glow hover:bg-signal-soft hover:-translate-y-0.5 active:translate-y-0",
  /** Solid full-contrast pill -- a strong secondary action. */
  ink: "bg-ink text-page shadow-pill hover:bg-ink-700 hover:-translate-y-0.5 active:translate-y-0",
  /** Glass pill with hairline border — secondary action. */
  outline:
    "bg-[rgba(var(--hi-rgb),0.03)] text-ink border border-line-strong backdrop-blur-sm hover:border-brand-400 hover:bg-[rgba(var(--hi-rgb),0.06)] hover:-translate-y-0.5 active:translate-y-0",
  /** Transparent, for use inside dark sections. */
  ghostLight:
    "bg-[rgba(var(--hi-rgb),0.1)] text-ink border border-line hover:bg-[rgba(var(--hi-rgb),0.16)]",
  /** Text-only with an arrow. */
  link: "text-brand-700 hover:text-brand-800 underline-offset-4 hover:underline",
} as const;

const BUTTON_SIZES = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-[0.9375rem]",
  lg: "px-7 py-4 text-base",
} as const;

type ButtonVariant = keyof typeof BUTTON_VARIANTS;
type ButtonSize = keyof typeof BUTTON_SIZES;

interface ButtonStyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  withArrow?: boolean;
  className?: string;
}

function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: ButtonStyleProps) {
  return cx(
    BUTTON_BASE,
    BUTTON_VARIANTS[variant],
    variant === "link" ? "" : BUTTON_SIZES[size],
    className,
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  withArrow = false,
  className,
  ...rest
}: ButtonStyleProps &
  Omit<ComponentProps<typeof Link>, "className"> & { href: string }) {
  return (
    <Link
      href={href}
      className={buttonClasses({ variant, size, className })}
      {...rest}
    >
      {children}
      {withArrow ? (
        <ArrowRightIcon className="h-[1.1em] w-[1.1em] shrink-0 transition-transform duration-300 group-hover/btn:translate-x-1" />
      ) : null}
    </Link>
  );
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  withArrow = false,
  className,
  ...rest
}: ButtonStyleProps & ComponentProps<"button">) {
  return (
    <button className={buttonClasses({ variant, size, className })} {...rest}>
      {children}
      {withArrow ? (
        <ArrowRightIcon className="h-[1.1em] w-[1.1em] shrink-0 transition-transform duration-300 group-hover/btn:translate-x-1" />
      ) : null}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Surfaces                                                                   */
/* -------------------------------------------------------------------------- */

export function Card({
  className,
  children,
  as: Tag = "div",
  style,
}: {
  className?: string;
  children: ReactNode;
  as?: "div" | "article" | "li";
  /** Used to pass motion custom properties such as --stagger-index. */
  style?: CSSProperties;
}) {
  return (
    <Tag
      style={style}
      className={cx(
        "spot bg-surface border-line shadow-card rounded-card border p-6 sm:p-7",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/** White pill chip — used for the hero feature and tech chips. */
export function Chip({
  children,
  icon,
  className,
}: {
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "pill-surface rounded-pill text-ink inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold",
        className,
      )}
    >
      {icon ? (
        <span className="text-brand-600 [&>svg]:h-[1.15em] [&>svg]:w-[1.15em]">
          {icon}
        </span>
      ) : null}
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Accents                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Per-service accent theming, carried over from the existing site's animated
 * mega-menu scenes (PRD §18 — "a genuine differentiator").
 */
export const ACCENT: Record<
  Accent,
  { bg: string; text: string; ring: string; dot: string }
> = (() => {
  /*
    Every service tile shares ONE treatment: a dark tile with a pale icon,
    which fills with the primary grey on hover.

    This used to be six hues (blue, lime, violet, cyan, amber, rose) -- one
    per service. PRD §18 framed per-service colour as a differentiator, but
    the palette study found the opposite at the top tier: one accent, used
    sparingly -- and a one-hue palette has none at all. Six hues is a rainbow. The
    `accent` field stays on each service so a future treatment can use it.
  */
  const unified = {
    bg: "bg-ink-100",
    text: "text-ink-700",
    ring: "group-hover:ring-signal/40",
    dot: "bg-signal",
  };
  return {
    blue: unified,
    lime: unified,
    violet: unified,
    cyan: unified,
    amber: unified,
    rose: unified,
  };
})();

/** Renders a JSON-LD script tag. */
export function JsonLd({ json }: { json: string }) {
  return (
    <script
      type="application/ld+json"
      // Serialised by schemaGraph() from typed objects — never user input.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
