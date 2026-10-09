import Link from "next/link";
import type { CSSProperties, ComponentProps, ReactNode } from "react";
import type { Accent } from "@/content/types";
import { ArrowRightIcon } from "@/components/icons";
import { Reveal } from "@/components/motion/Reveal";
import { splitWords } from "@/components/motion/SplitWords";

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

/**
 * A page band. The reference is almost entirely white with generous air, so
 * the default is plain; `surface` is the quiet grey band and `ink` the
 * charcoal contrast panel (its tokens flip via `.scope-dark`).
 */
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
  /*
    `cx` does not resolve conflicts, and the responsive defaults (`sm:`,
    `lg:`) are emitted after a plain `pt-8`, so they would win above 640px.
    A caller that sets its own top or bottom padding therefore gets no
    default on that side at all.
  */
  const ownTop = /(?:^|\s)!?(?:[a-z]+:)?(?:pt|py)-/.test(className ?? "");
  const ownBottom = /(?:^|\s)!?(?:[a-z]+:)?(?:pb|py)-/.test(className ?? "");
  return (
    <section
      id={id}
      className={cx(
        !ownTop && "pt-20 sm:pt-28 lg:pt-36",
        !ownBottom && "pb-20 sm:pb-28 lg:pb-36",
        tone === "surface" && "bg-page-tint",
        tone === "ink" && "scope-dark bg-panel text-ink",
        className,
      )}
    >
      {children}
    </section>
  );
}

/** The small "✦ Label" that sits above a section heading. */
export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cx("eyebrow mb-5", className)}>
      <span aria-hidden="true" className="bg-brand-500 inline-block h-px w-6" />
      {children}
    </p>
  );
}

/**
 * Section heading: eyebrow, a light display headline that rises word by word
 * (motion.css §1), and an optional lede.
 *
 * `layout="split"` is the reference's arrangement -- the headline on the left
 * and the lede as a small column on the right, aligned to its last line.
 */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  layout = "stack",
  as: Tag = "h2",
  action,
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
  layout?: "stack" | "split";
  as?: "h1" | "h2";
  /** A link or button set at the end of the heading row. */
  action?: ReactNode;
}) {
  const head = (
    <Reveal className={cx(layout === "stack" && "max-w-4xl", align === "center" && "mx-auto text-center")}>
      {eyebrow ? <Eyebrow className={align === "center" ? "justify-center" : undefined}>{eyebrow}</Eyebrow> : null}
      <Tag className="text-[2.35rem] sm:text-[3rem] lg:text-[3.6rem]">
        {splitWords(title)}
      </Tag>
    </Reveal>
  );

  if (layout === "split") {
    return (
      <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:items-end lg:gap-20">
        {head}
        <Reveal delay={150} className="flex flex-col gap-6 lg:items-end">
          {lede ? (
            <p className="text-ink-500 max-w-md text-[0.9375rem] leading-relaxed">
              {lede}
            </p>
          ) : null}
          {action}
        </Reveal>
      </div>
    );
  }

  return (
    <div className={cx(align === "center" && "mx-auto text-center")}>
      {action ? (
        <div className="flex flex-wrap items-end justify-between gap-6">
          {head}
          <Reveal delay={150}>{action}</Reveal>
        </div>
      ) : (
        head
      )}
      {lede ? (
        <Reveal delay={120}>
          <p
            className={cx(
              "text-ink-500 mt-6 max-w-2xl text-lg leading-relaxed",
              align === "center" && "mx-auto",
            )}
          >
            {lede}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Buttons                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * NOTE ON `className` OVERRIDES
 * `cx` only concatenates; it does not resolve Tailwind conflicts. Safe to pass:
 * margin, width, and anything the base does not set. To control visibility or
 * layout, wrap the component instead.
 *
 * `magnetic` (PointerFX) owns the `translate` property, so no variant uses a
 * translate utility on hover -- the two would fight.
 *
 * The reference's buttons: small, squared-off (6px), charcoal with a chevron;
 * here the hover fills them with the lime accent.
 */
const BUTTON_BASE =
  "magnetic group/btn inline-flex items-center justify-center gap-2.5 rounded-md font-medium whitespace-nowrap disabled:pointer-events-none disabled:opacity-60";

const BUTTON_VARIANTS = {
  /** Mint with night text in the dark theme (11.6:1); ink with paper text
   *  in the light one. */
  primary: "bg-signal text-page hover:bg-signal-soft",
  /** Same weight as primary -- kept for existing call sites. */
  ink: "bg-signal text-page hover:bg-signal-soft",
  /** Hairline outline; fills with ink on hover. */
  outline:
    "text-ink border border-line-strong hover:bg-ink hover:text-page hover:border-ink",
  /** Outline for charcoal panels. */
  ghostLight:
    "text-ink border border-line-strong hover:bg-ink hover:text-page hover:border-ink",
  /** The reference's text link: small capitals over a mint rule. */
  link: "text-ink text-[0.75rem] font-medium uppercase tracking-[0.08em]",
} as const;

const BUTTON_SIZES = {
  sm: "h-9 px-3.5 text-[0.8125rem]",
  md: "h-11 px-4.5 text-[0.9375rem]",
  lg: "h-13 px-6 text-base",
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
    variant === "link" ? "py-1" : BUTTON_SIZES[size],
    className,
  );
}

function ButtonInner({
  children,
  variant,
  withArrow,
}: {
  children: ReactNode;
  variant: ButtonVariant;
  withArrow: boolean;
}) {
  return (
    <>
      <span className={variant === "link" ? "link-line" : undefined}>
        {children}
      </span>
      {withArrow || variant === "link" ? (
        <ArrowRightIcon className="h-[1.05em] w-[1.05em] shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-1" />
      ) : null}
    </>
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
      <ButtonInner variant={variant} withArrow={withArrow}>
        {children}
      </ButtonInner>
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
      <ButtonInner variant={variant} withArrow={withArrow}>
        {children}
      </ButtonInner>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Surfaces                                                                   */
/* -------------------------------------------------------------------------- */

/** The reference's quiet grey card: no border, no shadow, generous padding. */
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
      className={cx("bg-surface rounded-card p-7 sm:p-8", className)}
    >
      {children}
    </Tag>
  );
}

/** Small outlined tag, as under the reference's project images. */
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
        "bg-surface text-ink-600 inline-flex items-center gap-1.5 rounded-[0.3rem] px-2 py-1 text-[0.6875rem] font-medium tracking-[0.01em]",
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Accents                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Per-service accent theming. The monochrome system gives every service the
 * same treatment; the `accent` field stays on each service so a future
 * treatment can use it.
 */
export const ACCENT: Record<
  Accent,
  { bg: string; text: string; ring: string; dot: string }
> = (() => {
  const unified = {
    bg: "bg-surface",
    text: "text-ink",
    ring: "group-hover:ring-ink/20",
    dot: "bg-lime-400",
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
