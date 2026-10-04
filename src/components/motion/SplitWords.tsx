import {
  Fragment,
  cloneElement,
  isValidElement,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";

/**
 * Splits text into per-word masks for the reference's SplitText-style
 * headline reveal (motion.css §1) -- at render time on the server, so it
 * costs no JavaScript and the words are in the HTML from the first byte.
 *
 * Walks the tree, so a two-tone heading keeps its inner
 * <span className="text-signature"> and a <br> stays a <br>: only the text
 * is split. Every word gets a running index (--wi) that staggers the rise.
 *
 * The real spaces stay between the words, so the sentence reads, copies and
 * is announced exactly as written; the wrappers add no semantics.
 */
export function splitWords(node: ReactNode, counter = { n: 0 }): ReactNode {
  if (typeof node === "string" || typeof node === "number") {
    return String(node)
      .split(/(\s+)/)
      .map((part, i) => {
        if (part === "" || /^\s+$/.test(part)) return part;
        const wi = counter.n++;
        return (
          <span key={i} className="split-w">
            <span className="split-i" style={{ "--wi": wi } as CSSProperties}>
              {part}
            </span>
          </span>
        );
      });
  }
  if (Array.isArray(node)) {
    return node.map((child, i) => (
      <Fragment key={i}>{splitWords(child, counter)}</Fragment>
    ));
  }
  if (isValidElement(node)) {
    const el = node as ReactElement<{ children?: ReactNode }>;
    if (el.props.children == null) return el;
    return cloneElement(el, undefined, splitWords(el.props.children, counter));
  }
  return node;
}

/** Component form, for JSX convenience. */
export function SplitWords({ children }: { children: ReactNode }) {
  return <>{splitWords(children)}</>;
}
