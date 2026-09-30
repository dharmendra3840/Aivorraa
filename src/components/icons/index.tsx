import type { SVGProps } from "react";
import type { IconKey } from "@/content/types";

/**
 * Inline SVG icon set. Inline rather than sprite or image files so icons cost
 * no extra request, carry no layout shift and inherit currentColor.
 * All icons are 24x24 on a 1.75 stroke, decorative by default.
 */
type IconProps = SVGProps<SVGSVGElement>;

function Svg({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export const CodeIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m8.5 8.5-4 3.5 4 3.5" />
    <path d="m15.5 8.5 4 3.5-4 3.5" />
    <path d="m13.5 5-3 14" />
  </Svg>
);

export const LayersIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3.5 3.5 8 12 12.5 20.5 8 12 3.5Z" />
    <path d="m4.5 12.6 7.5 4 7.5-4" />
    <path d="m4.5 16.8 7.5 4 7.5-4" />
  </Svg>
);

export const PhoneIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="6.5" y="2.5" width="11" height="19" rx="2.6" />
    <path d="M10.5 5.5h3" />
    <path d="M11 18.5h2" />
  </Svg>
);

export const SparkIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3.5l1.7 4.6 4.8 1.7-4.8 1.7L12 16.1l-1.7-4.6L5.5 9.8l4.8-1.7L12 3.5Z" />
    <path d="M18.5 16.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8Z" />
  </Svg>
);

export const SearchIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="10.5" cy="10.5" r="6" />
    <path d="m15 15 4.5 4.5" />
  </Svg>
);

export const MegaphoneIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 10.5v3a1.5 1.5 0 0 0 1.5 1.5h1.8L14 19.5V4.5L7.3 9H5.5A1.5 1.5 0 0 0 4 10.5Z" />
    <path d="M17.5 9.2a4 4 0 0 1 0 5.6" />
    <path d="M7.3 15v4.5" />
  </Svg>
);

export const PaletteIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3.5a8.5 8.5 0 1 0 0 17c1.3 0 1.9-.9 1.9-1.8 0-1.6-1.6-1.9-1.6-3.2 0-1 .8-1.8 1.9-1.8h1.4a4.9 4.9 0 0 0 4.9-4.9c0-3-3.6-5.3-8.5-5.3Z" />
    <circle cx="8.6" cy="9.4" r="1.15" fill="currentColor" stroke="none" />
    <circle cx="12" cy="7.6" r="1.15" fill="currentColor" stroke="none" />
    <circle cx="15.4" cy="9.4" r="1.15" fill="currentColor" stroke="none" />
  </Svg>
);

export const PlayIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="2.5" y="5" width="19" height="14" rx="3" />
    <path d="M10.5 9.3l4.2 2.7-4.2 2.7V9.3Z" />
  </Svg>
);

export const ChartIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 20V4" />
    <path d="M4 20h16" />
    <path d="M8.5 20v-6" />
    <path d="M13 20V9" />
    <path d="M17.5 20v-9.5" />
  </Svg>
);

export const ShieldIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3 5 5.6v5.2c0 4.2 2.8 7.6 7 9.2 4.2-1.6 7-5 7-9.2V5.6L12 3Z" />
    <path d="m9.3 11.8 2 2 3.4-3.6" />
  </Svg>
);

export const BoltIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M13.5 3 6 13.2h4.6L10 21l7.5-10.2h-4.6L13.5 3Z" />
  </Svg>
);

export const CartIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 4h2.2l2 10.4h9.9" />
    <path d="M6.6 7.6h14L18.7 14" />
    <circle cx="8.6" cy="19" r="1.5" />
    <circle cx="16.8" cy="19" r="1.5" />
  </Svg>
);

export const ArrowRightIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4.5 12h14" />
    <path d="m13 6.5 5.5 5.5L13 17.5" />
  </Svg>
);

export const ChevronDownIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m6.5 9.5 5.5 5 5.5-5" />
  </Svg>
);

export const CheckIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Svg>
);

export const MinusIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 12h12" />
  </Svg>
);

export const MailIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
    <path d="m4 7.5 8 5.5 8-5.5" />
  </Svg>
);

export const WhatsAppIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20.5 11.7a8.4 8.4 0 0 1-12.4 7.4L3.5 20.5l1.4-4.5A8.4 8.4 0 1 1 20.5 11.7Z" />
    <path d="M9 9.2c0 3 2.3 5.3 5.3 5.3.6 0 1-.5 1-1l-.1-.8-1.7-.5-.8.9a4.4 4.4 0 0 1-2-2l.9-.8-.5-1.7-.8-.1c-.5 0-1 .4-1 1Z" />
  </Svg>
);

export const InstagramIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4.6" />
    <circle cx="12" cy="12" r="3.6" />
    <circle cx="16.9" cy="7.1" r="1" fill="currentColor" stroke="none" />
  </Svg>
);

export const LinkedInIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="3.4" />
    <path d="M8 10.5V16" />
    <path d="M8 7.8v.1" />
    <path d="M11.8 16v-3.1a2 2 0 0 1 4 0V16" />
    <path d="M11.8 10.5V16" />
  </Svg>
);

export const YouTubeIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
    <path d="M10.5 9.6l4.4 2.4-4.4 2.4V9.6Z" />
  </Svg>
);

export const MenuIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 7h16" />
    <path d="M4 12h16" />
    <path d="M4 17h16" />
  </Svg>
);

export const CloseIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 6l12 12" />
    <path d="M18 6 6 18" />
  </Svg>
);

const ICONS: Record<IconKey, (p: IconProps) => React.ReactElement> = {
  code: CodeIcon,
  layers: LayersIcon,
  phone: PhoneIcon,
  spark: SparkIcon,
  search: SearchIcon,
  megaphone: MegaphoneIcon,
  palette: PaletteIcon,
  play: PlayIcon,
  chart: ChartIcon,
  shield: ShieldIcon,
  bolt: BoltIcon,
  cart: CartIcon,
};

/** Renders an icon by its content key. */
export function Icon({
  name,
  ...props
}: { name: IconKey } & IconProps) {
  const Cmp = ICONS[name] ?? CodeIcon;
  return <Cmp {...props} />;
}
