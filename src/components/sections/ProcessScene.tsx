import { cx } from "@/components/ui";

/**
 * One small CSS-drawn scene per delivery stage.
 *
 * WHY CSS AND NOT IMAGES OR SVG FILES
 * Six illustrations would be six more requests against a 1200KB page budget
 * (PRD §21), and raster ones would need art direction the brand does not have
 * yet. These are a few divs each, they inherit the theme tokens, and they cost
 * nothing to ship.
 *
 * Every scene is decorative: the stage is already named and described in the
 * copy beside it, so the whole box is hidden from assistive technology rather
 * than narrated a second time in worse words.
 *
 * Markup here, motion in motion-process.css §3.
 */
export type SceneName =
  | "discover"
  | "define"
  | "design"
  | "build"
  | "review"
  | "launch";

/** Indexes a child for the stagger delays and per-dot ranges in the CSS. */
const step = (i: number) => ({ "--i": i }) as React.CSSProperties;

export function ProcessScene({
  name,
  className,
}: {
  name: SceneName;
  className?: string;
}) {
  return (
    <div className={cx("stage-scene", className)} aria-hidden="true">
      {name === "discover" ? (
        <>
          <span className="sc-ring" />
          <span className="sc-ring" />
          <span className="sc-ring" />
          <span className="sc-sweep" />
          <span className="sc-target" />
        </>
      ) : null}

      {name === "define" ? (
        <span className="sc-doc">
          <i />
          <i />
          <i />
          <i />
        </span>
      ) : null}

      {name === "design" ? (
        <span className="sc-boards">
          <i />
          <i />
          <i />
        </span>
      ) : null}

      {name === "build" ? (
        <>
          <span className="sc-win" />
          <span className="sc-code">
            <i />
            <i />
            <i />
            <i />
          </span>
          <span className="sc-caret" />
        </>
      ) : null}

      {name === "review" ? (
        <span className="sc-list">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="sc-row">
              <b style={step(i)} />
              <i />
            </span>
          ))}
        </span>
      ) : null}

      {name === "launch" ? (
        <>
          {[0, 1, 2].map((i) => (
            <span key={i} className="sc-pulse" style={step(i)} />
          ))}
          <span className="sc-mark" />
        </>
      ) : null}
    </div>
  );
}
