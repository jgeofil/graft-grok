export const ROLES = [
  "canvas",
  "surface",
  "ink",
  "muted",
  "line",
  "accent",
  "onAccent",
] as const;

export type ColorRole = (typeof ROLES)[number];

export const ROLE_LABEL: Record<ColorRole, string> = {
  canvas: "Canvas",
  surface: "Surface",
  ink: "Ink",
  muted: "Muted",
  line: "Line",
  accent: "Accent",
  onAccent: "On accent",
};

export const TEXT_FONTS = [
  "Fraunces",
  "Newsreader",
  "Instrument Serif",
  "Instrument Sans",
  "Playfair Display",
  "Cormorant Garamond",
  "Source Serif 4",
  "Bodoni Moda",
  "Literata",
  "Libre Baskerville",
  "Outfit",
  "Manrope",
  "Schibsted Grotesk",
  "Space Grotesk",
  "IBM Plex Sans",
  "Syne",
  "Familjen Grotesk",
  "Sora",
  "DM Sans",
  "DM Serif Display",
] as const;

export const MONO_FONTS = ["IBM Plex Mono", "Space Mono"] as const;

export const TRAITS = [
  "Precise",
  "Warm",
  "Severe",
  "Playful",
  "Quiet",
  "Technical",
  "Editorial",
  "Luxe",
  "Utilitarian",
  "Wild",
  "Tender",
  "Formal",
] as const;

export const RADII = ["0px", "2px", "8px", "16px", "24px", "999px"] as const;
export const DENSITIES = ["tight", "balanced", "airy"] as const;

export type Density = (typeof DENSITIES)[number];
export type Origin =
  | "seed"
  | "branch"
  | "refine"
  | "polish"
  | "mutate"
  | "siblings"
  | "remix"
  | "creative"
  | "cousins";

export const ASPECTS = [
  "palette",
  "type",
  "radius",
  "density",
  "voice",
  "imagery",
  "shape",
  "motion",
] as const;

export type AspectId = (typeof ASPECTS)[number];

export const ASPECT_LABEL: Record<AspectId, string> = {
  palette: "Palette",
  type: "Type",
  radius: "Radius",
  density: "Density",
  voice: "Voice",
  imagery: "Imagery",
  shape: "Shape",
  motion: "Motion",
};

export type PaletteColor = {
  role: ColorRole;
  name: string;
  hex: string;
  usage: string;
};

export type Brief = {
  name: string;
  category: string;
  audience: string;
  traits: string[];
  avoid: string;
  notes: string;
};

export type Project = {
  id: string;
  brief: Brief;
  createdAt: number;
  updatedAt: number;
  sample?: boolean;
};

export type Direction = {
  id: string;
  projectId: string;
  parentId: string | null;
  origin: Origin;
  createdAt: number;
  favorite: boolean;
  canon: boolean;
  /** Aspects copied from the parent. Empty on opening directions. */
  kept?: AspectId[];
  /** Aspects this cut was allowed to move. */
  changed?: AspectId[];
  title: string;
  epithet: string;
  rationale: string;
  wordmarkStyle: string;
  palette: PaletteColor[];
  radius: string;
  density: Density;
  displayFont: string;
  bodyFont: string;
  monoFont: string;
  typeNotes: string;
  voice: string;
  imagery: string;
  shape: string;
  motion: string;
  spacing: string;
  uiNotes: string;
  dos: string[];
  donts: string[];
  sampleHeadline: string;
  sampleBody: string;
  buttonLabel: string;
};

export type DirectionSeed = Omit<
  Direction,
  "id" | "projectId" | "parentId" | "origin" | "createdAt" | "favorite" | "canon" | "kept" | "changed"
>;

const SERIF = new Set<string>([
  "Fraunces",
  "Newsreader",
  "Instrument Serif",
  "Playfair Display",
  "Cormorant Garamond",
  "Source Serif 4",
  "Bodoni Moda",
  "Literata",
  "Libre Baskerville",
  "DM Serif Display",
]);

export function isSerifFont(family: string): boolean {
  return SERIF.has(family);
}

const WEIGHTS: Record<string, string> = {
  Fraunces: "500;700",
  Newsreader: "400;600",
  "Instrument Serif": "",
  "Instrument Sans": "400;500;600",
  "Playfair Display": "500;700",
  "Cormorant Garamond": "500;600",
  "Source Serif 4": "400;600",
  "Bodoni Moda": "400;700",
  Literata: "400;700",
  "Libre Baskerville": "400;700",
  Outfit: "400;500;600",
  Manrope: "400;500;600;700",
  "Schibsted Grotesk": "400;500;600",
  "Space Grotesk": "400;500;600",
  "IBM Plex Sans": "400;500;600",
  "IBM Plex Mono": "400;500",
  Syne: "500;700",
  "Familjen Grotesk": "400;500;600",
  Sora: "400;500;600",
  "DM Sans": "400;500;600",
  "DM Serif Display": "",
  "Space Mono": "400;700",
};

const BASE_FONTS = [
  "Fraunces",
  "Outfit",
  "Newsreader",
  "Instrument Serif",
  "Instrument Sans",
  "Syne",
  "IBM Plex Sans",
  "IBM Plex Mono",
];

export const BASE_FONT_HREF = fontStylesheetHref(BASE_FONTS);

export function fontStylesheetHref(families: string[]): string {
  const unique = [...new Set(families)].filter((family) => family in WEIGHTS);
  if (!unique.length) return "";
  const params = unique.map((family) => {
    const name = family.replace(/ /g, "+");
    const weight = WEIGHTS[family];
    return weight ? `family=${name}:wght@${weight}` : `family=${name}`;
  });
  return `https://fonts.googleapis.com/css2?${params.join("&")}&display=swap`;
}

export function extraFontHref(families: string[]): string {
  const base = new Set(BASE_FONTS);
  return fontStylesheetHref(families.filter((family) => !base.has(family)));
}

export function fontStack(family: string): string {
  const safe = family.replace(/"/g, "");
  if (SERIF.has(safe)) return `"${safe}", Georgia, serif`;
  if (safe.toLowerCase().includes("mono")) return `"${safe}", ui-monospace, monospace`;
  return `"${safe}", "Avenir Next", sans-serif`;
}

export function brandVars(direction: Direction): Record<string, string> {
  const byRole = Object.fromEntries(direction.palette.map((color) => [color.role, color.hex]));
  return {
    "--b-canvas": byRole.canvas ?? "#f4f1ea",
    "--b-surface": byRole.surface ?? "#fffdf8",
    "--b-ink": byRole.ink ?? "#1a1916",
    "--b-muted": byRole.muted ?? "#5e5a54",
    "--b-line": byRole.line ?? "#e4ddd2",
    "--b-accent": byRole.accent ?? "#1e6a48",
    "--b-on": byRole.onAccent ?? "#f3faf6",
    "--b-radius": direction.radius,
    "--b-display": fontStack(direction.displayFont),
    "--b-body": fontStack(direction.bodyFont),
    "--b-mono": fontStack(direction.monoFont),
  };
}

export function colorOf(direction: Direction, role: ColorRole): PaletteColor {
  return (
    direction.palette.find((color) => color.role === role) ?? {
      role,
      name: ROLE_LABEL[role],
      hex: "#888888",
      usage: "",
    }
  );
}

function rgb(hex: string): [number, number, number] {
  const value = parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function toHex(channels: [number, number, number]): string {
  return `#${channels.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

function linear(channel: number): number {
  const s = channel / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

export function luminance(hex: string): number {
  const [r, g, b] = rgb(hex);
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

export function contrast(a: string, b: string): number {
  const l1 = luminance(a);
  const l2 = luminance(b);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

export function formatRatio(a: string, b: string): string {
  return `${contrast(a, b).toFixed(1)}:1`;
}

function mix(a: string, b: string, t: number): string {
  const pa = rgb(a);
  const pb = rgb(b);
  return toHex(pa.map((channel, index) => Math.round(channel + (pb[index] - channel) * t)) as [
    number,
    number,
    number,
  ]);
}

function bestInk(bg: string): string {
  const dark = "#14120f";
  const light = "#f7f4ee";
  return contrast(bg, dark) >= contrast(bg, light) ? dark : light;
}

function parseHex(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const match = value.trim().match(/^#?([0-9a-f]{6})$/i);
  return match ? `#${match[1].toLowerCase()}` : null;
}

const FALLBACK: Record<ColorRole, PaletteColor> = {
  canvas: { role: "canvas", name: "Paper", hex: "#f3efe6", usage: "Page ground." },
  surface: { role: "surface", name: "Card", hex: "#fbf8f2", usage: "Cards, inputs, and raised panels." },
  ink: { role: "ink", name: "Ink", hex: "#1a1916", usage: "Primary text and icons." },
  muted: { role: "muted", name: "Graphite", hex: "#5c574f", usage: "Secondary text and metadata." },
  line: { role: "line", name: "Rule", hex: "#e0d8cc", usage: "Hairline separators." },
  accent: { role: "accent", name: "Leaf", hex: "#1e6a48", usage: "The single action color." },
  onAccent: { role: "onAccent", name: "On leaf", hex: "#f3faf6", usage: "Text on accent fills." },
};

export function finalizePalette(input: Partial<Record<ColorRole, PaletteColor>>): PaletteColor[] {
  const palette = {} as Record<ColorRole, PaletteColor>;
  for (const role of ROLES) {
    const given = input[role];
    const hex = given ? parseHex(given.hex) : null;
    palette[role] = hex
      ? {
          role,
          name: clip(given?.name, 24) || FALLBACK[role].name,
          hex,
          usage: clip(given?.usage, 140) || FALLBACK[role].usage,
        }
      : { ...FALLBACK[role] };
  }

  if (contrast(palette.ink.hex, palette.canvas.hex) < 7) {
    palette.ink.hex = bestInk(palette.canvas.hex);
    palette.ink.name = luminance(palette.ink.hex) < 0.2 ? "Ink" : "Paper";
  }

  let guard = 0;
  while (contrast(palette.muted.hex, palette.canvas.hex) < 4.5 && guard < 8) {
    palette.muted.hex = mix(palette.muted.hex, palette.ink.hex, 0.28);
    guard += 1;
  }

  if (contrast(palette.onAccent.hex, palette.accent.hex) < 4.5) {
    palette.onAccent.hex = bestInk(palette.accent.hex);
    palette.onAccent.name = luminance(palette.onAccent.hex) < 0.2 ? "On accent" : "On accent light";
  }

  guard = 0;
  while (contrast(palette.line.hex, palette.canvas.hex) < 1.2 && guard < 6) {
    palette.line.hex = mix(palette.line.hex, palette.ink.hex, 0.18);
    guard += 1;
  }

  if (contrast(palette.surface.hex, palette.canvas.hex) < 1.03) {
    const toward = luminance(palette.canvas.hex) > 0.5 ? "#000000" : "#ffffff";
    palette.surface.hex = mix(palette.canvas.hex, toward, 0.06);
  }

  return ROLES.map((role) => palette[role]);
}

function clip(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function pickFont(value: unknown, allowed: readonly string[], fallback: string): string {
  const text = clip(value, 40);
  return allowed.includes(text) ? text : fallback;
}

function pickRadius(value: unknown): string {
  const text = clip(value, 8);
  return (RADII as readonly string[]).includes(text) ? text : "8px";
}

function pickDensity(value: unknown): Density {
  const text = clip(value, 12);
  return (DENSITIES as readonly string[]).includes(text) ? (text as Density) : "balanced";
}

function threeLines(value: unknown, fallback: string[]): string[] {
  const list = Array.isArray(value) ? value.map((item) => clip(item, 140)).filter(Boolean) : [];
  const next = list.slice(0, 3);
  while (next.length < 3) next.push(fallback[next.length] ?? fallback[0]);
  return next;
}

export function toSeeds(raw: unknown): DirectionSeed[] {
  const record = asRecord(raw);
  const list = Array.isArray(record?.directions) ? record.directions : [];
  const seeds: DirectionSeed[] = [];
  for (const item of list) {
    const seed = toSeed(item);
    if (seed) seeds.push(seed);
  }
  return seeds.slice(0, 3);
}

function toSeed(item: unknown): DirectionSeed | null {
  const record = asRecord(item);
  if (!record) return null;
  const incoming = new Map<ColorRole, PaletteColor>();
  if (Array.isArray(record.palette)) {
    for (const entry of record.palette) {
      const color = asRecord(entry);
      if (!color) continue;
      const role = clip(color.role, 16) as ColorRole;
      if (!(ROLES as readonly string[]).includes(role) || incoming.has(role)) continue;
      const hex = parseHex(color.hex);
      if (!hex) continue;
      incoming.set(role, {
        role,
        name: clip(color.name, 24) || ROLE_LABEL[role],
        hex,
        usage: clip(color.usage, 140),
      });
    }
  }
  if (incoming.size < 4) return null;

  const displayFont = pickFont(record.displayFont, TEXT_FONTS, "Fraunces");
  let bodyFont = pickFont(record.bodyFont, TEXT_FONTS, "Outfit");
  if (bodyFont === displayFont) {
    bodyFont = displayFont === "Outfit" ? "Instrument Sans" : "Outfit";
  }

  return {
    title: clip(record.title, 48) || "Untitled cut",
    epithet: clip(record.epithet, 80) || "A distinct cut of the brief",
    rationale: clip(record.rationale, 360) || "A workable direction derived from the brief.",
    wordmarkStyle: clip(record.wordmarkStyle, 160) || "Set the name in the display face, without a symbol.",
    palette: finalizePalette(Object.fromEntries(incoming) as Partial<Record<ColorRole, PaletteColor>>),
    radius: pickRadius(record.radius),
    density: pickDensity(record.density),
    displayFont,
    bodyFont,
    monoFont: pickFont(record.monoFont, MONO_FONTS, "IBM Plex Mono"),
    typeNotes: clip(record.typeNotes, 240) || "Use the display face for headlines only.",
    voice: clip(record.voice, 280) || "Short sentences. Concrete nouns.",
    imagery: clip(record.imagery, 280) || "Photograph the product on the canvas color. No stock gestures.",
    shape: clip(record.shape, 240) || "One radius for every control.",
    motion: clip(record.motion, 240) || "State changes fade in under 200ms. Nothing bounces.",
    spacing: clip(record.spacing, 240) || "An 8px grid. Labels sit close to what they name.",
    uiNotes: clip(record.uiNotes, 280) || "One filled accent button per view. Everything else is a hairline.",
    dos: threeLines(record.dos, [
      "Use the accent once per view.",
      "Set numerals in the mono face.",
      "Keep headlines to one idea.",
    ]),
    donts: threeLines(record.donts, [
      "Do not add a second accent hue.",
      "Do not put text on photographs.",
      "Do not use a gradient wordmark.",
    ]),
    sampleHeadline: clip(record.sampleHeadline, 90) || "Make the object the brand.",
    sampleBody:
      clip(record.sampleBody, 280) ||
      "The system is a set of decisions a product team can ship without a second meeting.",
    buttonLabel: clip(record.buttonLabel, 28) || "Continue",
  };
}

export function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return slug || "system";
}

export function columnsOf(directions: Direction[]): Direction[][] {
  const ids = new Set(directions.map((direction) => direction.id));
  const depth = new Map<string, number>();
  const roots = directions.filter((direction) => !direction.parentId || !ids.has(direction.parentId));
  const queue = roots.map((direction) => ({ direction, depth: 0 }));
  const columns: Direction[][] = [];
  const seen = new Set<string>();
  while (queue.length) {
    const next = queue.shift();
    if (!next || seen.has(next.direction.id)) continue;
    seen.add(next.direction.id);
    depth.set(next.direction.id, next.depth);
    columns[next.depth] ??= [];
    columns[next.depth].push(next.direction);
    for (const child of directions) {
      if (child.parentId === next.direction.id) {
        queue.push({ direction: child, depth: next.depth + 1 });
      }
    }
  }
  for (const column of columns) {
    column.sort((a, b) => a.createdAt - b.createdAt);
  }
  return columns.filter(Boolean);
}

export function descendantIds(directions: Direction[], id: string): string[] {
  const ids = [id];
  for (const direction of directions) {
    if (direction.parentId === id) ids.push(...descendantIds(directions, direction.id));
  }
  return ids;
}
