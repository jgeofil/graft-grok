import {
  ASPECTS,
  ASPECT_LABEL,
  DENSITIES,
  MONO_FONTS,
  RADII,
  TEXT_FONTS,
  finalizePalette,
  isSerifFont,
  type AspectId,
  type Density,
  type DirectionSeed,
  type Origin,
  type PaletteColor,
} from "./model.ts";

export const LEVELS = ["polish", "mutate", "siblings", "remix", "creative", "cousins"] as const;
export type Level = (typeof LEVELS)[number];

export type ChangeKind = "locked" | "light" | "strong";

export type SlotPlan = {
  level: Level;
  aspects: Record<AspectId, ChangeKind>;
  /** Polish instruction, when one was given. */
  note?: string;
};

export type LineageMark = {
  level: Level | "seed";
  kept: AspectId[];
  changed: AspectId[];
};

export const LEVEL_META: Record<
  Level,
  { label: string; hint: string; count: 1 | 3; pending: string; toast: string }
> = {
  polish: {
    label: "Polish",
    hint: "Small tweaks. An instruction moves the thing it names, and the rest stays.",
    count: 1,
    pending: "Polishing this cut…",
    toast: "Polish added",
  },
  mutate: {
    label: "Mutate",
    hint: "One aspect changes at random. Every other aspect stays.",
    count: 3,
    pending: "Mutating one aspect",
    toast: "Three mutations added",
  },
  siblings: {
    label: "Siblings",
    hint: "Light variations. A few aspects shift; the rest stay put.",
    count: 3,
    pending: "Drafting siblings",
    toast: "Three siblings added",
  },
  remix: {
    label: "Remix",
    hint: "Half the aspects stay fixed. The rest is generated from that half.",
    count: 3,
    pending: "Remixing from this cut",
    toast: "Three remixes added",
  },
  creative: {
    label: "Creative",
    hint: "One or two aspects stay fixed. Everything else follows from those.",
    count: 3,
    pending: "Building from the anchors",
    toast: "Three creative cuts added",
  },
  cousins: {
    label: "Cousins",
    hint: "Strong variations. A few aspects of the parent stay, so the line is still visible.",
    count: 3,
    pending: "Drafting cousins",
    toast: "Three cousins added",
  },
};

export function isLevel(value: string): value is Level {
  return (LEVELS as readonly string[]).includes(value);
}

function pickN<T>(items: readonly T[], count: number, random: () => number): T[] {
  const pool = [...items];
  for (let index = pool.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    const current = pool[index];
    pool[index] = pool[swap] as T;
    pool[swap] = current as T;
  }
  return pool.slice(0, Math.max(0, Math.min(count, pool.length)));
}

function signature(aspects: readonly AspectId[]): string {
  return [...aspects].sort().join(",");
}

function distinctPicks(count: number, random: () => number, avoid: Set<string>): AspectId[] {
  let picked = pickN(ASPECTS, count, random);
  for (let attempt = 0; attempt < 6 && avoid.has(signature(picked)); attempt += 1) {
    picked = pickN(ASPECTS, count, random);
  }
  avoid.add(signature(picked));
  return picked;
}

function planFrom(level: Level, free: ReadonlySet<AspectId>, kind: ChangeKind): SlotPlan {
  const aspects = {} as Record<AspectId, ChangeKind>;
  for (const aspect of ASPECTS) aspects[aspect] = free.has(aspect) ? kind : "locked";
  return { level, aspects };
}

function repeat(plan: SlotPlan, count: number): SlotPlan[] {
  return Array.from({ length: count }, () => ({
    level: plan.level,
    aspects: { ...plan.aspects },
  }));
}

const ASPECT_HINT: Record<AspectId, RegExp> = {
  palette:
    /\b(colou?rs?|palette|hues?|hex|harmon\w*|yellow|gold(?:en)?|brass|amber|lemon|mustard|red|crimson|orange|green|teal|cyan|blue|navy|purple|violet|pink|black|white|cream|night|darker|lighter|brighter|accent)\b/i,
  type: /\b(type|fonts?|serif|sans|grotesk|lettering)\b/i,
  radius: /\b(radius|corners?|round(?:er|ed)?|sharp(?:er)?|pills?)\b/i,
  density: /\b(density|tight(?:er)?|air(?:y|ier)|spacing|margins?)\b/i,
  voice: /\b(voice|tone|copy|headline|wording)\b/i,
  imagery: /\b(photos?|imagery|photographs?)\b/i,
  shape: /\b(shape|geometry)\b/i,
  motion: /\b(motion|animation|animate)\b/i,
};

const NAMED_COLORS: { pattern: RegExp; hue: number }[] = [
  { pattern: /\b(yellow|gold(?:en)?|brass|amber|lemon|mustard)\b/i, hue: 48 },
  { pattern: /\b(orange|copper)\b/i, hue: 28 },
  { pattern: /\b(red|crimson|scarlet)\b/i, hue: 4 },
  { pattern: /\b(green|olive|kelp)\b/i, hue: 140 },
  { pattern: /\b(teal|cyan)\b/i, hue: 175 },
  { pattern: /\b(blue|navy)\b/i, hue: 220 },
  { pattern: /\b(purple|violet)\b/i, hue: 275 },
  { pattern: /\b(pink|rose)\b/i, hue: 345 },
];

/** Aspects a polish instruction is allowed to nudge. Empty when it only asks for tighter words. */
export function aspectsTouched(instruction: string): AspectId[] {
  return ASPECTS.filter((aspect) => ASPECT_HINT[aspect].test(instruction));
}

/** Roll which aspects stay locked for each child of this level. */
export function plansFor(level: Level, random: () => number = Math.random, instruction = ""): SlotPlan[] {
  if (level === "polish") {
    const plan = planFrom(level, new Set(aspectsTouched(instruction)), "light");
    if (instruction.trim()) plan.note = instruction.trim();
    return [plan];
  }

  if (level === "mutate") {
    return pickN(ASPECTS, 3, random).map((aspect) => planFrom(level, new Set([aspect]), "strong"));
  }

  if (level === "remix") {
    const free = new Set(pickN(ASPECTS, ASPECTS.length / 2, random));
    return repeat(planFrom(level, free, "strong"), 3);
  }

  if (level === "creative") {
    const lockedCount = random() < 0.5 ? 1 : 2;
    const locked = new Set(pickN(ASPECTS, lockedCount, random));
    const free = new Set(ASPECTS.filter((aspect) => !locked.has(aspect)));
    return repeat(planFrom(level, free, "strong"), 3);
  }

  const avoid = new Set<string>();
  if (level === "siblings") {
    return [0, 1, 2].map(() => {
      const count = 1 + Math.floor(random() * 4);
      return planFrom(level, new Set(distinctPicks(count, random, avoid)), "light");
    });
  }

  return [0, 1, 2].map(() => {
    const lockedCount = 2 + Math.floor(random() * 3);
    const locked = new Set(distinctPicks(lockedCount, random, avoid));
    const free = new Set(ASPECTS.filter((aspect) => !locked.has(aspect)));
    return planFrom(level, free, "strong");
  });
}

export function describePlans(plans: SlotPlan[]): string {
  return plans
    .map((plan, index) => {
      const locked = ASPECTS.filter((aspect) => plan.aspects[aspect] === "locked");
      const light = ASPECTS.filter((aspect) => plan.aspects[aspect] === "light");
      const strong = ASPECTS.filter((aspect) => plan.aspects[aspect] === "strong");
      return [
        `Direction ${index + 1}:`,
        locked.length ? `LOCKED — copy these exactly from the parent: ${locked.join(", ")}.` : "",
        light.length
          ? `LIGHT — stay in the same family, one step away: ${light.join(", ")}.`
          : "",
        strong.length
          ? `STRONG — make these new, but derive them from the locked aspects: ${strong.join(", ")}.`
          : "",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");
}

function clonePalette(palette: PaletteColor[]): PaletteColor[] {
  return palette.map((color) => ({ ...color }));
}

function color(palette: PaletteColor[], role: PaletteColor["role"]): PaletteColor {
  const found = palette.find((entry) => entry.role === role);
  if (found) return found;
  return palette[0] as PaletteColor;
}

function rgbOf(hex: string): [number, number, number] {
  const value = Number.parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function hslOf(hex: string): [number, number, number] {
  const [r, g, b] = rgbOf(hex).map((channel) => channel / 255) as [number, number, number];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const light = (max + min) / 2;
  if (max === min) return [0, 0, light];
  const delta = max - min;
  const sat = light > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  let hue = 0;
  if (max === r) hue = (g - b) / delta + (g < b ? 6 : 0);
  else if (max === g) hue = (b - r) / delta + 2;
  else hue = (r - g) / delta + 4;
  return [hue * 60, sat, light];
}

function hslToHex(hue: number, sat: number, light: number): string {
  const h = ((hue % 360) + 360) % 360;
  const s = Math.min(1, Math.max(0, sat));
  const l = Math.min(1, Math.max(0, light));
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const channels = [r, g, b].map((channel) => Math.round((channel + m) * 255));
  return `#${channels.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

function signedDelta(from: number, to: number): number {
  return ((to - from + 540) % 360) - 180;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function paint(palette: PaletteColor[], role: PaletteColor["role"], hex: string) {
  const entry = palette.find((color) => color.role === role);
  if (entry) entry.hex = hex;
}

function mixHex(a: string, b: string, t: number): string {
  const from = rgbOf(a);
  const to = rgbOf(b);
  const channels = from.map((channel, index) => Math.round(channel + ((to[index] ?? channel) - channel) * t));
  return `#${channels.map((channel) => clamp(channel, 0, 255).toString(16).padStart(2, "0")).join("")}`;
}

function namedColor(instruction: string): { pattern: RegExp; hue: number } | undefined {
  return NAMED_COLORS.find((color) => color.pattern.test(instruction));
}

function swatchIsNamed(swatch: PaletteColor, named: { pattern: RegExp; hue: number }): boolean {
  if (named.pattern.test(`${swatch.name} ${swatch.usage}`)) return true;
  const [hue, sat] = hslOf(swatch.hex);
  return sat >= 0.35 && Math.abs(signedDelta(hue, named.hue)) <= 22;
}

/**
 * A polish instruction may move color, but only a step. Named colors are pulled
 * toward the rest of the palette so "harmonize the yellow" is visible and still
 * the same system.
 */
function polishPalette(parent: PaletteColor[], model: PaletteColor[], instruction: string): PaletteColor[] {
  const next = clonePalette(parent);
  const named = namedColor(instruction);
  const targets = named ? next.filter((swatch) => swatchIsNamed(swatch, named)) : [];

  if (targets.length) {
    const family = next.filter((swatch) => !targets.includes(swatch) && hslOf(swatch.hex)[1] >= 0.12);
    const anchor = [...family].sort((a, b) => hslOf(b.hex)[1] - hslOf(a.hex)[1])[0];
    const familyHue = anchor ? hslOf(anchor.hex)[0] : (named?.hue ?? 48);
    for (const swatch of targets) {
      const [hue, sat, light] = hslOf(swatch.hex);
      const delta = signedDelta(hue, familyHue);
      const step = Math.sign(delta || 1) * clamp(Math.abs(delta) * 0.45, 8, 16);
      swatch.hex = hslToHex((hue + step + 360) % 360, clamp(sat + (sat > 0.75 ? -0.06 : 0.04), 0.28, 0.88), light);
      const suggested = model.find((entry) => entry.role === swatch.role);
      if (suggested && suggested.usage && suggested.usage !== swatch.usage) swatch.usage = suggested.usage;
    }
    const lead = targets[0];
    if (lead) {
      for (const role of ["canvas", "surface"] as const) {
        if (targets.some((swatch) => swatch.role === role)) continue;
        const swatch = next.find((entry) => entry.role === role);
        if (swatch) swatch.hex = mixHex(swatch.hex, lead.hex, 0.1);
      }
    }
  } else {
    let moved = false;
    for (const swatch of next) {
      const suggested = model.find((entry) => entry.role === swatch.role);
      if (!suggested || suggested.hex === swatch.hex) continue;
      const [hue, sat, light] = hslOf(swatch.hex);
      const [modelHue, modelSat, modelLight] = hslOf(suggested.hex);
      const hueStep = Math.sign(signedDelta(hue, modelHue) || 1) * clamp(Math.abs(signedDelta(hue, modelHue)), 0, 14);
      swatch.hex = hslToHex(
        (hue + hueStep + 360) % 360,
        clamp(sat + clamp(modelSat - sat, -0.1, 0.1), 0, 1),
        clamp(light + clamp(modelLight - light, -0.06, 0.06), 0.04, 0.98),
      );
      if (suggested.usage) swatch.usage = suggested.usage;
      moved = moved || swatch.hex !== parent.find((entry) => entry.role === swatch.role)?.hex;
    }
    if (!moved) {
      const lead = [...next].sort((a, b) => hslOf(b.hex)[1] - hslOf(a.hex)[1])[0];
      if (lead) {
        const [hue, sat, light] = hslOf(lead.hex);
        lead.hex = hslToHex((hue + 10) % 360, clamp(sat, 0.2, 0.85), light);
      }
    }
  }

  return finalizePalette(Object.fromEntries(next.map((entry) => [entry.role, entry])));
}

function lightPalette(parent: PaletteColor[], model: PaletteColor[], slot: number): PaletteColor[] {
  const next = clonePalette(parent);
  const parentAccent = hslOf(color(parent, "accent").hex);
  const modelAccent = hslOf(color(model, "accent").hex);
  const fallback = slot % 2 === 0 ? 1 : -1;
  let hueDelta = signedDelta(parentAccent[0], modelAccent[0]);
  if (Math.abs(hueDelta) < 1) hueDelta = fallback * 14;
  const hue = (parentAccent[0] + Math.sign(hueDelta) * clamp(Math.abs(hueDelta), 12, 22) + 360) % 360;
  paint(next, "accent", hslToHex(hue, clamp(parentAccent[1], 0.28, 0.72), clamp(parentAccent[2], 0.22, 0.62)));

  const parentCanvas = hslOf(color(parent, "canvas").hex);
  const modelCanvas = hslOf(color(model, "canvas").hex);
  let lightDelta = modelCanvas[2] - parentCanvas[2];
  if (Math.abs(lightDelta) < 0.01) lightDelta = fallback * 0.05;
  paint(
    next,
    "canvas",
    hslToHex(parentCanvas[0], parentCanvas[1], clamp(parentCanvas[2] + Math.sign(lightDelta) * clamp(Math.abs(lightDelta), 0.04, 0.08), 0.08, 0.96)),
  );
  const surface = hslOf(color(parent, "surface").hex);
  paint(
    next,
    "surface",
    hslToHex(surface[0], surface[1], clamp(surface[2] + Math.sign(lightDelta) * 0.04, 0.08, 0.98)),
  );
  return finalizePalette(Object.fromEntries(next.map((entry) => [entry.role, entry])));
}

function strongPalette(parent: PaletteColor[], model: PaletteColor[], slot: number): PaletteColor[] {
  const parentHue = hslOf(color(parent, "accent").hex)[0];
  const modelHue = hslOf(color(model, "accent").hex)[0];
  const parentLight = hslOf(color(parent, "canvas").hex)[2];
  const modelLight = hslOf(color(model, "canvas").hex)[2];
  const distinct = Math.abs(signedDelta(parentHue, modelHue)) >= 28 || Math.abs(parentLight - modelLight) >= 0.15;
  const base = distinct ? clonePalette(model) : clonePalette(parent);
  const accent = hslOf(color(base, "accent").hex);
  const spin = (distinct ? slot * 16 : 48 + slot * 14) * (slot % 2 === 0 ? 1 : -1);
  paint(base, "accent", hslToHex((accent[0] + spin + 360) % 360, clamp(accent[1], 0.3, 0.75), clamp(accent[2], 0.2, 0.64)));
  if (!distinct) {
    const canvas = hslOf(color(parent, "canvas").hex);
    const flipped = canvas[2] > 0.5 ? Math.max(0.1, canvas[2] - 0.38) : Math.min(0.94, canvas[2] + 0.38);
    paint(base, "canvas", hslToHex(canvas[0], canvas[1], flipped));
  }
  return finalizePalette(Object.fromEntries(base.map((entry) => [entry.role, entry])));
}

function otherInClass(current: string, blocked: string, slot: number): string {
  const pool = TEXT_FONTS.filter(
    (font) => font !== current && font !== blocked && isSerifFont(font) === isSerifFont(current),
  );
  if (!pool.length) return current;
  return pool[Math.abs(slot) % pool.length] ?? current;
}

function oppositeClass(current: string, blocked: string, slot: number): string {
  const pool = TEXT_FONTS.filter((font) => font !== blocked && isSerifFont(font) !== isSerifFont(current));
  if (!pool.length) return current;
  return pool[Math.abs(slot) % pool.length] ?? current;
}

function applyLightType(next: DirectionSeed, parent: DirectionSeed, slot: number) {
  next.displayFont = parent.displayFont;
  next.bodyFont = parent.bodyFont;
  next.monoFont = parent.monoFont;
  const which = slot % 3;
  if (which === 2) {
    next.monoFont = parent.monoFont === MONO_FONTS[0] ? MONO_FONTS[1] : MONO_FONTS[0];
    return;
  }
  if (which === 1) {
    next.displayFont = otherInClass(parent.displayFont, parent.bodyFont, slot);
    return;
  }
  next.bodyFont = otherInClass(parent.bodyFont, parent.displayFont, slot);
}

function applyStrongType(next: DirectionSeed, parent: DirectionSeed, slot: number) {
  const moved = next.displayFont !== parent.displayFont || next.bodyFont !== parent.bodyFont;
  if (!moved) next.displayFont = oppositeClass(parent.displayFont, parent.bodyFont, slot);
  if (next.displayFont === next.bodyFont) next.bodyFont = otherInClass(next.bodyFont, next.displayFont, slot + 1);
  if (next.bodyFont === next.displayFont) next.bodyFont = oppositeClass(next.displayFont, next.displayFont, slot + 2);
  if (slot % 2 === 1 && next.monoFont === parent.monoFont) {
    next.monoFont = parent.monoFont === MONO_FONTS[0] ? MONO_FONTS[1] : MONO_FONTS[0];
  }
}

function indexOf(list: readonly string[], value: string): number {
  const index = list.indexOf(value);
  return index < 0 ? 0 : index;
}

function stepRadius(current: string, delta: number): string {
  const index = indexOf(RADII, current);
  let next = index + delta;
  if (next < 0 || next >= RADII.length) next = index - Math.sign(delta || 1);
  if (next === index) next = index === 0 ? 1 : index - 1;
  return RADII[next] ?? current;
}

function stepDensity(current: Density, delta: number): Density {
  const index = indexOf(DENSITIES, current);
  let next = index + delta;
  if (next < 0 || next >= DENSITIES.length) next = index - Math.sign(delta || 1);
  if (next === index) next = index === 0 ? 1 : index - 1;
  return (DENSITIES[next] ?? current) as Density;
}

function replaceToken(text: string, from: string, to: string): string {
  if (!from || from === to || !text.includes(from)) return text;
  return text.split(from).join(to);
}

function copyVoice(next: DirectionSeed, parent: DirectionSeed) {
  next.voice = parent.voice;
  next.sampleHeadline = parent.sampleHeadline;
  next.sampleBody = parent.sampleBody;
  next.buttonLabel = parent.buttonLabel;
}

function polishEpithet(note: string): string {
  const words = note.replace(/\s+/g, " ").trim().split(" ").slice(0, 8).join(" ");
  if (!words) return "Same system, tighter rules";
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function polishTitle(note: string | undefined): string {
  const named = note ? NAMED_COLORS.find((color) => color.pattern.test(note)) : undefined;
  if (!named || !note) return "Polished";
  const word = note.match(named.pattern)?.[0] ?? "Color";
  return `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()} tuned`;
}

/**
 * Force the draft to obey the plan. Locked aspects are copied from the parent,
 * so a child cannot drift away from the cut it came from.
 */
export function applyLineage(parent: DirectionSeed, draft: DirectionSeed, plan: SlotPlan, slot: number): DirectionSeed {
  const next: DirectionSeed = {
    ...draft,
    palette: clonePalette(draft.palette),
    dos: [...draft.dos],
    donts: [...draft.donts],
  };

  if (plan.aspects.palette === "locked") next.palette = clonePalette(parent.palette);
  else if (plan.aspects.palette === "light" && plan.level === "polish") {
    next.palette = polishPalette(parent.palette, draft.palette, plan.note ?? "");
  } else if (plan.aspects.palette === "light") next.palette = lightPalette(parent.palette, draft.palette, slot);
  else next.palette = strongPalette(parent.palette, draft.palette, slot);

  if (plan.aspects.type === "locked") {
    next.displayFont = parent.displayFont;
    next.bodyFont = parent.bodyFont;
    next.monoFont = parent.monoFont;
    if (plan.level !== "polish") {
      next.typeNotes = parent.typeNotes;
      next.wordmarkStyle = parent.wordmarkStyle;
    }
  } else if (plan.aspects.type === "light") applyLightType(next, parent, slot);
  else applyStrongType(next, parent, slot);

  if (plan.aspects.radius === "locked") next.radius = parent.radius;
  else if (plan.aspects.radius === "light") next.radius = stepRadius(parent.radius, slot % 2 === 0 ? -1 : 1);
  else if (Math.abs(indexOf(RADII, next.radius) - indexOf(RADII, parent.radius)) < 2) {
    next.radius = stepRadius(parent.radius, slot % 2 === 0 ? -2 : 2);
  }

  if (plan.aspects.density === "locked") {
    next.density = parent.density;
    next.spacing = parent.spacing;
  } else if (plan.aspects.density === "light") {
    next.density = stepDensity(parent.density, slot % 2 === 0 ? -1 : 1);
  } else if (next.density === parent.density) {
    next.density = parent.density === "balanced" ? (slot % 2 === 0 ? "tight" : "airy") : parent.density === "tight" ? "airy" : "tight";
  }

  if (plan.aspects.voice === "locked") copyVoice(next, parent);
  if (plan.aspects.imagery === "locked") next.imagery = parent.imagery;
  if (plan.aspects.shape === "locked") next.shape = parent.shape;
  if (plan.aspects.motion === "locked") next.motion = parent.motion;

  if (next.radius !== parent.radius && next.shape === parent.shape) {
    next.shape = replaceToken(parent.shape, parent.radius, next.radius);
  }

  const structural = (["palette", "type", "radius", "density", "shape"] as const).some(
    (aspect) => plan.aspects[aspect] !== "locked",
  );
  if (plan.level !== "polish" && !structural) {
    next.uiNotes = parent.uiNotes;
    next.dos = [...parent.dos];
    next.donts = [...parent.donts];
  }

  if (next.title.trim().toLowerCase() === parent.title.trim().toLowerCase()) {
    const moved = ASPECTS.find((aspect) => plan.aspects[aspect] !== "locked");
    next.title = plan.level === "polish" ? polishTitle(plan.note) : moved ? `${ASPECT_LABEL[moved]} cut` : "Another cut";
  }
  if (plan.level === "polish" && plan.note) {
    if (next.epithet.trim() === parent.epithet.trim()) next.epithet = polishEpithet(plan.note);
    if (next.rationale.trim() === parent.rationale.trim()) {
      next.rationale = `${polishEpithet(plan.note)}. The rest of the system stays where it was.`;
    }
  } else if (next.epithet.trim() === parent.epithet.trim() && plan.level === "polish") {
    next.epithet = "Same system, tighter rules";
  }

  return next;
}

function paletteKey(palette: PaletteColor[]): string {
  return ASPECTS.length
    ? ["canvas", "surface", "ink", "muted", "line", "accent", "onAccent"]
        .map((role) => palette.find((color) => color.role === role)?.hex ?? "")
        .join(",")
    : "";
}

function aspectSame(parent: DirectionSeed, child: DirectionSeed, aspect: AspectId): boolean {
  switch (aspect) {
    case "palette":
      return paletteKey(parent.palette) === paletteKey(child.palette);
    case "type":
      return (
        parent.displayFont === child.displayFont &&
        parent.bodyFont === child.bodyFont &&
        parent.monoFont === child.monoFont
      );
    case "radius":
      return parent.radius === child.radius;
    case "density":
      return parent.density === child.density;
    case "voice":
      return (
        parent.voice === child.voice &&
        parent.sampleHeadline === child.sampleHeadline &&
        parent.sampleBody === child.sampleBody &&
        parent.buttonLabel === child.buttonLabel
      );
    case "imagery":
      return parent.imagery === child.imagery;
    case "shape":
      return parent.shape.split(parent.radius).join("RADIUS") === child.shape.split(child.radius).join("RADIUS");
    case "motion":
      return parent.motion === child.motion;
    default:
      return true;
  }
}

export function diffLineage(parent: DirectionSeed, child: DirectionSeed, level: Level): LineageMark {
  const kept: AspectId[] = [];
  const changed: AspectId[] = [];
  for (const aspect of ASPECTS) {
    if (aspectSame(parent, child, aspect)) kept.push(aspect);
    else changed.push(aspect);
  }
  return { level, kept, changed };
}

function listAspects(ids: AspectId[]): string {
  return ids.map((id) => ASPECT_LABEL[id].toLowerCase()).join(", ");
}

export function relationTitle(origin: Origin, parentTitle: string): string {
  switch (origin) {
    case "polish":
      return `Polish of ${parentTitle}`;
    case "mutate":
      return `Mutation of ${parentTitle}`;
    case "siblings":
      return `Sibling of ${parentTitle}`;
    case "remix":
      return `Remix of ${parentTitle}`;
    case "creative":
      return `Creative from ${parentTitle}`;
    case "cousins":
      return `Cousin of ${parentTitle}`;
    case "refine":
      return `Refined from ${parentTitle}`;
    default:
      return `Variation from ${parentTitle}`;
  }
}

export function relationLine(origin: Origin, parentTitle: string, kept: AspectId[] = [], changed: AspectId[] = []): string {
  const keep = listAspects(kept);
  const change = listAspects(changed);
  switch (origin) {
    case "polish":
      return relationTitle(origin, parentTitle);
    case "mutate":
      return change ? `Mutated ${change} · ${parentTitle}` : relationTitle(origin, parentTitle);
    case "siblings":
      return change ? `Sibling of ${parentTitle} · ${change}` : relationTitle(origin, parentTitle);
    case "remix":
      return keep ? `Remix of ${parentTitle} · kept ${keep}` : relationTitle(origin, parentTitle);
    case "creative":
      return keep ? `Creative from ${parentTitle} · kept ${keep}` : relationTitle(origin, parentTitle);
    case "cousins":
      return keep ? `Cousin of ${parentTitle} · kept ${keep}` : relationTitle(origin, parentTitle);
    default:
      return relationTitle(origin, parentTitle);
  }
}
