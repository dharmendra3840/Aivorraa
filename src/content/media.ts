/**
 * Photography and video used across the site.
 *
 * All photos are from Unsplash (Unsplash License: free for commercial use,
 * no attribution required) and the reel from Pexels (Pexels License, same
 * terms). Credits are kept here anyway, with the source page for each, so any
 * image can be traced and replaced.
 *
 * These are ILLUSTRATIVE images, never presented as client work: PRD §17
 * requires written permission before any client project is shown. Each was
 * graded as one set (slightly desaturated, gentle contrast lift) and exported
 * as responsive WebP renditions in /public/media.
 *
 * `lqip` is a 24px blurred preview painted behind the image while it loads.
 */

export type MediaKey =
  | "hero-desk"
  | "hero-form"
  | "svc-web"
  | "svc-uiux"
  | "svc-app"
  | "svc-ai"
  | "svc-seo"
  | "svc-marketing"
  | "svc-brand"
  | "svc-video"
  | "ind-startup"
  | "ind-retail"
  | "ind-pro"
  | "ind-ops"
  | "bp-ecom"
  | "bp-crm"
  | "bp-report"
  | "form-voxel"
  | "form-teal"
  | "form-knot";

export interface MediaItem {
  /** Basename in /public/media; renditions are `<name>-<width>.webp`. */
  name: MediaKey;
  alt: string;
  width: number;
  height: number;
  widths: number[];
  lqip: string;
  credit: string;
}

export const MEDIA: Record<MediaKey, MediaItem> = {
  "hero-desk": {
    name: "hero-desk",
    alt: "Hands typing on a laptop at a bright, minimal desk",
    width: 2400,
    height: 1600,
    widths: [640, 1080, 1600, 2200],
    lqip: "data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAAAQBACdASoYABAAPu1qrU8ppiQiMAgBMB2JZACdABjo5aLRgvCTSkYWAAD89hgdKCt5ADn8PyVBe5k6rDR+oB57F6AxxhKtjVw9r2crz0g3nKFOGO6p/xhKm0wEHXgz6AA=",
    credit: "https://unsplash.com/photos/person-wearing-silver-ring-using-a-surface-device-jZ-PLZTTjPk",
  },
  "hero-form": {
    name: "hero-form",
    alt: "Soft sculpted ribbons of light in sage and peach",
    width: 2400,
    height: 3200,
    widths: [640, 1080, 1600, 2200],
    lqip: "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAABwBACdASoYACAAPu1qr1CppaQiqAqpMB2JZQDG9BEc8fWhTs4jTWOFpca0AAD+wycgmvNiPKj53y+mxHGq2g4fw833/9ACxkHodq5m2YAAAA==",
    credit: "https://unsplash.com/photos/a-stack-of-white-plates-sitting-on-top-of-a-blue-surface-NPJF9xPoCHk",
  },
  "svc-web": {
    name: "svc-web",
    alt: "A clean desk with a large monitor and keyboard",
    width: 2400,
    height: 1341,
    widths: [640, 1080, 1600, 2200],
    lqip: "data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAACQAwCdASoYAA0APu1oqk6ppiQiMAgBMB2JZQAAR0C9UJps4R3gAP6NN72PLzKZ2YAdGKUzW0imTOpCyMWkYetyiUGwFxCQfEPvZcsqxWR6eAAA",
    credit: "https://unsplash.com/photos/silver-imac-on-brown-wooden-desk-3BMIntVUsjQ",
  },
  "svc-uiux": {
    name: "svc-uiux",
    alt: "A designer sketching wireframes with an orange pen",
    width: 2400,
    height: 1600,
    widths: [640, 1080, 1600, 2200],
    lqip: "data:image/webp;base64,UklGRngAAABXRUJQVlA4IGwAAAAwBACdASoYABAAPu1mqk2ppaQiMAgBMB2JYwDE2B9THogRTMUNcucC/XAA/umnL5dLGwiTK4ZJ78099mjIVhjeeRisIF/XbY1HkZ6LIWL9riMvUoX0Mhefphy1rEpg5zgDSu8XTU7BqxIgAAA=",
    credit: "https://unsplash.com/photos/yellow-click-pen-on-white-printer-paper-gcHFXsdcmJE",
  },
  "svc-app": {
    name: "svc-app",
    alt: "A hand holding a phone that reads hello world",
    width: 2400,
    height: 1600,
    widths: [640, 1080, 1600, 2200],
    lqip: "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAACwAwCdASoYABAAPu1Ct1apoqakGAEwHYlnAABbn54QOlCmT4YEAAD+ERf4JbuvFOhpUMWcvjCvNL8LowdqVwvZ6HobPkKAAAA=",
    credit: "https://unsplash.com/photos/a-person-holding-a-cell-phone-in-their-hand-kpmwxeDoNR4",
  },
  "svc-ai": {
    name: "svc-ai",
    alt: "A clear glass ribbon curving against a pale background",
    width: 2400,
    height: 4265,
    widths: [640, 1080, 1600, 2200],
    lqip: "data:image/webp;base64,UklGRngAAABXRUJQVlA4IGwAAABQBQCdASoYACsAPtlcpk2oJaOiNVv8AQAbCWcAyRAhXzDOnUzozvcY8QBFN8mLn2wPVmgA/sPf5Rv7z9alvkrSYBEmdvxqxcTzlp9ZSccSaVu72Pf6Nwzn+y7zXK48yeueY8AQAxgrx1QAAAA=",
    credit: "https://unsplash.com/photos/a-clear-abstract-twisted-glass-form-gdZ8e1DgOJs",
  },
  "svc-seo": {
    name: "svc-seo",
    alt: "Someone reviewing an analytics dashboard on a laptop",
    width: 2400,
    height: 1737,
    widths: [640, 1080, 1600, 2200],
    lqip: "data:image/webp;base64,UklGRpAAAABXRUJQVlA4IIQAAACwBACdASoYABEAPu1qrFEppaQiqAqpMB2JZQDA3A44YeM22bDR8CWmDx+oU3twAP7xfzb1tNAtb9B7KwEWNMUf8QjWYJ/L/acmeTedJ899xTYQCFf88p98IO6ob37s9sZ7RqM6uk/dd5zPz+PnyO8Gp8vJvf1BDove7ip1cZM2cMxAIAA=",
    credit: "https://unsplash.com/photos/person-using-macbook-pro-pypeCEaJeZY",
  },
  "svc-marketing": {
    name: "svc-marketing",
    alt: "A phone showing a social feed beside a camera lens",
    width: 2400,
    height: 3600,
    widths: [640, 1080, 1600, 2200],
    lqip: "data:image/webp;base64,UklGRqQAAABXRUJQVlA4IJgAAAAwBgCdASoYACQAPuVcpk2pJSOiOrM4ASAciWcAzrBAaSC4NB+ZlRjm8CMMfjxE/9wCUN1kaamQ5BCQAPjSNB9oVvjj66VhPDt9Aqhk1T8aFv0k0Vh27R9fe7an3HeopFRq/P2e7Ac5ogc3i70jWMj1GNzBvWkGgGRjICAT22ds502GVF56GwTGbIzjBCu38YsALIjKAAAAAA==",
    credit: "https://unsplash.com/photos/a-person-holding-up-a-cell-phone-with-pictures-on-it-lAKdQZOCnrM",
  },
  "svc-brand": {
    name: "svc-brand",
    alt: "Blank stationery and an envelope in soft daylight",
    width: 2400,
    height: 1600,
    widths: [640, 1080, 1600, 2200],
    lqip: "data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAACQAwCdASoYABAALrV2u12jqampiYC0SygABHWVzynb3/8g6sBYAP6tIgs87Xz59zFCsJZOFNC4enEzsWoAtd0rj/pXy95UTjeOWd8K/4gqy8VKAAA=",
    credit: "https://unsplash.com/photos/white-printer-paper-on-white-table-UOHsMdmn9TE",
  },
  "svc-video": {
    name: "svc-video",
    alt: "A white cyclorama studio set up with lights and camera",
    width: 2400,
    height: 1600,
    widths: [640, 1080, 1600, 2200],
    lqip: "data:image/webp;base64,UklGRngAAABXRUJQVlA4IGwAAACwAwCdASoYABAAPu1kqk2ppaQiMAgBMB2JZwDA3CHulsa4zaMUAAD+6yNKH03SP2vN/gtNsPJsdxRXZrWsZHxi+2KFqvw5bBuLqSg9tX3r/0XQhgF4ARhsfp2Haw4pRjnz4XtUvMutGx+lmAA=",
    credit: "https://unsplash.com/photos/a-white-tent-with-a-camera-on-it-ZEhkny-7w1c",
  },
  "ind-startup": {
    name: "ind-startup",
    alt: "Two founders working together in a bright office",
    width: 2400,
    height: 1600,
    widths: [640, 1080, 1600, 2200],
    lqip: "data:image/webp;base64,UklGRm4AAABXRUJQVlA4IGIAAADQAwCdASoYABAALrV2u12jqampiYC0SgDG9EPADX5shsCt7rH5xmAA/uqDM5fu+KGUR3BvfMViGH2k/MzSd7jVF7FV5AsfgfyhrJ57C2brVAai2Xvr2M81dltwtifngAAAAA==",
    credit: "https://unsplash.com/photos/two-men-sitting-at-a-table-with-a-laptop-6NLQL05UwXs",
  },
  "ind-retail": {
    name: "ind-retail",
    alt: "A floral-wrapped parcel packed in tissue paper",
    width: 2400,
    height: 1600,
    widths: [640, 1080, 1600, 2200],
    lqip: "data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAADwAwCdASoYABAAPu1qrU8ppiQiMAgBMB2JYwCzgGjSrFrRZrFIx6eAAP79LgFLD/O0ONKD2ZYXwwoAXXqi9wPa5xKvSiXzdNvZI4dwRkdiKa8qCAA=",
    credit: "https://unsplash.com/photos/a-box-with-a-blue-and-white-flowered-cloth-inside-of-it-c0ULfRC7vts",
  },
  "ind-pro": {
    name: "ind-pro",
    alt: "Two people reviewing and signing documents at a table",
    width: 2400,
    height: 1600,
    widths: [640, 1080, 1600, 2200],
    lqip: "data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAABwAwCdASoYABAAPu1iqk4ppaQiMAgBMB2JYwCw7BtcwdERgAAA/mB7cOq7r7JCi++9mp/LtP92DvdhKsT/ZUlS3RxAaYHNrHg+qKqOoCfKR5B9s/gAAA==",
    credit: "https://unsplash.com/photos/woman-signing-on-white-printer-paper-beside-woman-about-to-touch-the-documents-HJckKnwCXxQ",
  },
  "ind-ops": {
    name: "ind-ops",
    alt: "An operations manager working on a laptop in a warehouse",
    width: 2400,
    height: 1349,
    widths: [640, 1080, 1600, 2200],
    lqip: "data:image/webp;base64,UklGRnAAAABXRUJQVlA4IGQAAACwAwCdASoYAA0APu1krU6ppaSiMAgBMB2JZQDKABobZSDWvXCdegD+6d0WLxSA6T0d0WNboYKNjzmqMhhwsReulO62Pjmi/QElZowMjgQgyikZrBQ9TzE2wqsaT1S4l/B1gAAA",
    credit: "https://unsplash.com/photos/man-in-blue-polo-shirt-using-laptop-computer-pn6tf73O2As",
  },
  "bp-ecom": {
    name: "bp-ecom",
    alt: "Hands taping up a parcel ready for dispatch",
    width: 2400,
    height: 1600,
    widths: [640, 1080, 1600, 2200],
    lqip: "data:image/webp;base64,UklGRoAAAABXRUJQVlA4IHQAAADQBACdASoYABAAPu1iqk2ppaQiMAgBMB2JYgCdMoRwCQAAmnMvA3f58bR7VY5wAAD+iHH/YW+c75UjaSDIBphDRmRf1SjP5qXpARwEh0PXZtTMaKelQq/NpWfb8qxbb6tX63qo1c0/gJz7dyapQVrQq+lkAA==",
    credit: "https://unsplash.com/photos/a-person-holding-a-brown-paper-bag-on-top-of-a-table-mErtCMDgUEM",
  },
  "bp-crm": {
    name: "bp-crm",
    alt: "A hand drawing a process diagram on a glass wall",
    width: 2400,
    height: 1600,
    widths: [640, 1080, 1600, 2200],
    lqip: "data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAACwAwCdASoYABAAPu1kqU2ppaQiMAgBMB2JQAAj2m+0iNto9+CJgAD+/JcbbhAZ8E5ymAWLO8KgUXqzDc0fJh0gbM6n/km2Y9Weu1+EiFr8k2vu5z04AAAA",
    credit: "https://unsplash.com/photos/hand-drawing-a-diagram-on-a-whiteboard-ajTN690FnUg",
  },
  "bp-report": {
    name: "bp-report",
    alt: "A hand-drawn growth chart with a pen and ruler",
    width: 2400,
    height: 1600,
    widths: [640, 1080, 1600, 2200],
    lqip: "data:image/webp;base64,UklGRnIAAABXRUJQVlA4IGYAAABQBACdASoYABAAPu1iqk4ppaQiMAgBMB2JZQCw7CPq3+7I/1OXwVDXXuGAAP7PeHVrMxHzYl7LITfxbUmM8LNlX4cjsXHee0vpZKN28PQtwXIPnfnaL/hwQPstG+tuvJiCLIewAAA=",
    credit: "https://unsplash.com/photos/pen-om-paper-AT77Q0Njnt0",
  },
  "form-voxel": {
    name: "form-voxel",
    alt: "An abstract cube built from small mint-green blocks",
    width: 2400,
    height: 4267,
    widths: [640, 1080, 1600, 2200],
    lqip: "data:image/webp;base64,UklGRnoAAABXRUJQVlA4IG4AAADwBACdASoYACsAPuFco02opSMsNVv4AYAcCWUAAFsyCva+VNqK0cNBlPLNbVA1MgAA/cuBPZ5oIWu/l/vctFFCOcHfJOzoh+cJJD3qKFS0QaJkM9CSGrLJcu4beTNIXGmaIlllHgVwfCoiM0wAAA==",
    credit: "https://unsplash.com/photos/a-cube-that-is-floating-in-the-air-1QGxRD55taw",
  },
  "form-teal": {
    name: "form-teal",
    alt: "Abstract folded forms in deep teal",
    width: 2400,
    height: 3600,
    widths: [640, 1080, 1600, 2200],
    lqip: "data:image/webp;base64,UklGRowAAABXRUJQVlA4IIAAAADwBQCdASoYACQAPuVYqE2pJKQiNVgMASAciWcAwNxFbWX/ZS6wp51S8nfO8RnkMwgEZxx/lXSAcAD+2IcGWYr4xBmicTZasO21a0Ztw84H6W33gXoQZG/4RfOZcW9MnOPkXblVFoNRYARVRRi9e8GZGlRXoCv9i+Eq2I8n5oAAAA==",
    credit: "https://unsplash.com/photos/a-group-of-cups-sitting-on-top-of-each-other-dGdTaKvzmxc",
  },
  "form-knot": {
    name: "form-knot",
    alt: "An iridescent glass knot floating on black",
    width: 2400,
    height: 1350,
    widths: [640, 1080, 1600, 2200],
    lqip: "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAACQAwCdASoYAA0APu1qrU8ppiQiMAgBMB2JZwAAWlPaNAV6btVAAP70JRmC8EfD/L6nboeamlnxZNmSWN/7z8sdt74CmKgCUw8gAA==",
    credit: "https://unsplash.com/photos/abstract-colorful-glass-sculpture-on-black-background-qyJwdg2evZE",
  },
};

/** The scroll-grown reel (Pexels, free licence), 1280x720, 8.8s loop. */
export const REEL = {
  src: "/media/reel-liquid.mp4",
  poster: "/media/reel-liquid-poster.webp",
  width: 1280,
  height: 720,
  credit: "https://www.pexels.com/video/28298935/",
};

/** Service slug -> its illustrative photo. */
export const SERVICE_MEDIA: Record<string, MediaKey> = {
  "web-development": "svc-web",
  "ui-ux-design": "svc-uiux",
  "app-development": "svc-app",
  "ai-automation": "svc-ai",
  "seo-ads": "svc-seo",
  "digital-marketing": "svc-marketing",
  "branding-graphics": "svc-brand",
  "video-motion": "svc-video",
};

/** Industry slug -> its illustrative photo. */
export const INDUSTRY_MEDIA: Record<string, MediaKey> = {
  "startups-and-smes": "ind-startup",
  "retail-and-ecommerce": "ind-retail",
  "professional-services": "ind-pro",
  "operations-heavy-businesses": "ind-ops",
};

/** Pixel-art journal covers, generated from the set (Brandium-style). */
export const JOURNAL_COVERS = [
  "/media/journal-automation.webp",
  "/media/journal-cost.webp",
  "/media/journal-web.webp",
];
