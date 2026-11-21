import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { finalizePalette, type DirectionSeed, type PaletteColor } from "./model.ts";
import { applyLineage, diffLineage, plansFor, relationLine, type SlotPlan } from "./lineage.ts";

function randomOf(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function swatch(role: PaletteColor["role"], hex: string): PaletteColor {
  return { role, name: role, hex, usage: `${role} usage` };
}

const parent: DirectionSeed = {
  title: "Fog Glass",
  epithet: "Quiet instruments, cool light",
  rationale: "A cool field and a serif.",
  wordmarkStyle: "Instrument Serif, sentence case.",
  palette: finalizePalette({
    canvas: swatch("canvas", "#e6eeef"),
    surface: swatch("surface", "#f4f8f8"),
    ink: swatch("ink", "#1a282b"),
    muted: swatch("muted", "#4d6468"),
    line: swatch("line", "#c9d8d9"),
    accent: swatch("accent", "#1f5f5c"),
    onAccent: swatch("onAccent", "#f4f8f8"),
  }),
  radius: "16px",
  density: "balanced",
  displayFont: "Instrument Serif",
  bodyFont: "Instrument Sans",
  monoFont: "IBM Plex Mono",
  typeNotes: "Serif for headlines only.",
  voice: "Calm and dry.",
  imagery: "Objects on a fog ground.",
  shape: "One radius, 16px, on every control.",
  motion: "Opacity only, 200ms.",
  spacing: "Airy margins.",
  uiNotes: "One filled button.",
  dos: ["Leave paper.", "Photograph objects.", "Use kelp once."],
  donts: ["No second accent.", "No waves.", "No glow."],
  sampleHeadline: "See farther.",
  sampleBody: "The dial is the brand.",
  buttonLabel: "Hold one",
};

function alien(): DirectionSeed {
  return {
    ...parent,
    title: "Harbor",
    epithet: "A hard utilitarian cut",
    rationale: "Different on purpose.",
    wordmarkStyle: "Syne, tight.",
    palette: finalizePalette({
      canvas: swatch("canvas", "#141414"),
      surface: swatch("surface", "#1c1c1c"),
      ink: swatch("ink", "#f5f4f0"),
      muted: swatch("muted", "#b3b0a8"),
      line: swatch("line", "#333330"),
      accent: swatch("accent", "#c4392b"),
      onAccent: swatch("onAccent", "#ffffff"),
    }),
    radius: "0px",
    density: "tight",
    displayFont: "Syne",
    bodyFont: "IBM Plex Sans",
    monoFont: "Space Mono",
    typeNotes: "Grotesk and mono.",
    voice: "Blunt specs.",
    imagery: "Stamped metal.",
    shape: "Sharp corners and thick rules.",
    motion: "State changes snap.",
    spacing: "Tight 4px.",
    uiNotes: "Red is the only fill.",
    dos: ["Lead with the spec.", "Red on controls.", "Align numbers."],
    donts: ["No pills.", "No lifestyle.", "No serif."],
    sampleHeadline: "Tools for weather.",
    sampleBody: "Red is for the thing you press.",
    buttonLabel: "Specifications",
  };
}

function plan(level: SlotPlan["level"], changed: keyof SlotPlan["aspects"] | "", kind: SlotPlan["aspects"]["palette"]): SlotPlan {
  const aspects: SlotPlan["aspects"] = {
    palette: "locked",
    type: "locked",
    radius: "locked",
    density: "locked",
    voice: "locked",
    imagery: "locked",
    shape: "locked",
    motion: "locked",
  };
  if (changed) aspects[changed] = kind;
  return { level, aspects };
}

describe("plansFor", () => {
  it("keeps a visible parent at every level", () => {
    for (let seed = 1; seed <= 24; seed += 1) {
      const random = randomOf(seed);
      for (const level of ["polish", "mutate", "siblings", "remix", "creative", "cousins"] as const) {
        const plans = plansFor(level, random);
        assert.equal(plans.length, level === "polish" ? 1 : 3);
        for (const slot of plans) {
          const locked = Object.values(slot.aspects).filter((kind) => kind === "locked").length;
          if (level === "polish") assert.equal(locked, 8);
          if (level === "mutate") assert.equal(locked, 7);
          if (level === "siblings") assert.ok(locked >= 4 && locked <= 7);
          if (level === "remix") assert.equal(locked, 4);
          if (level === "creative") assert.ok(locked === 1 || locked === 2);
          if (level === "cousins") assert.ok(locked >= 2 && locked <= 4);
        }
        if (level === "mutate") {
          const changed = plans.map((slot) => Object.entries(slot.aspects).find(([, kind]) => kind === "strong")?.[0]);
          assert.equal(new Set(changed).size, 3);
        }
        if (level === "remix" || level === "creative") {
          assert.deepEqual(plans[0]?.aspects, plans[1]?.aspects);
          assert.deepEqual(plans[1]?.aspects, plans[2]?.aspects);
        }
      }
    }
  });
});

describe("applyLineage", () => {
  it("copies every aspect on polish and still allows a new title", () => {
    const next = applyLineage(parent, { ...alien(), title: "Fog Glass", epithet: parent.epithet }, plan("polish", "", "locked"), 0);
    const mark = diffLineage(parent, next, "polish");
    assert.equal(mark.changed.length, 0);
    assert.equal(mark.kept.length, 8);
    assert.equal(next.palette.find((color) => color.role === "accent")?.hex, parent.palette.find((color) => color.role === "accent")?.hex);
    assert.notEqual(next.title, parent.title);
    assert.notEqual(next.epithet, parent.epithet);
  });

  it("polish with a color instruction moves that color and keeps the rest", () => {
    const plan = plansFor("polish", randomOf(2), "harmonize the yellow")[0];
    assert.ok(plan);
    assert.equal(plan.aspects.palette, "light");
    assert.equal(plan.aspects.type, "locked");
    assert.equal(plan.aspects.voice, "locked");
    const yellow = {
      ...parent,
      palette: parent.palette.map((swatch) =>
        swatch.role === "accent" ? { ...swatch, name: "Yellow", hex: "#e0b000" } : { ...swatch },
      ),
    };
    const next = applyLineage(yellow, yellow, plan, 0);
    assert.equal(next.displayFont, yellow.displayFont);
    assert.equal(next.bodyFont, yellow.bodyFont);
    assert.equal(next.radius, yellow.radius);
    assert.equal(next.voice, yellow.voice);
    assert.equal(next.sampleHeadline, yellow.sampleHeadline);
    assert.notEqual(next.palette.find((swatch) => swatch.role === "accent")?.hex, "#e0b000");
    assert.notEqual(next.epithet, yellow.epithet);
    assert.deepEqual(diffLineage(yellow, next, "polish").changed, ["palette"]);
  });

  it("changes only the palette on a palette mutation", () => {
    const next = applyLineage(parent, alien(), plan("mutate", "palette", "strong"), 0);
    const mark = diffLineage(parent, next, "mutate");
    assert.deepEqual(mark.changed, ["palette"]);
    assert.notEqual(
      next.palette.find((color) => color.role === "accent")?.hex,
      parent.palette.find((color) => color.role === "accent")?.hex,
    );
    assert.equal(next.displayFont, parent.displayFont);
    assert.equal(next.bodyFont, parent.bodyFont);
    assert.equal(next.radius, parent.radius);
    assert.equal(next.voice, parent.voice);
    assert.equal(next.sampleHeadline, parent.sampleHeadline);
  });

  it("moves radius by one step for a light sibling", () => {
    const next = applyLineage(parent, alien(), plan("siblings", "radius", "light"), 0);
    assert.equal(next.radius, "8px");
    assert.equal(next.displayFont, parent.displayFont);
    const mark = diffLineage(parent, next, "siblings");
    assert.deepEqual(mark.changed, ["radius"]);
  });

  it("keeps type class when type is a light change", () => {
    const next = applyLineage(parent, alien(), plan("siblings", "type", "light"), 1);
    assert.notEqual(next.displayFont, parent.displayFont);
    assert.equal(next.bodyFont, parent.bodyFont);
    assert.ok(["Fraunces", "Newsreader", "Instrument Serif", "Playfair Display", "Cormorant Garamond", "Source Serif 4", "Bodoni Moda", "Literata", "Libre Baskerville", "DM Serif Display"].includes(next.displayFont));
  });
});

describe("relationLine", () => {
  it("names the kept or changed aspects", () => {
    assert.equal(relationLine("polish", "Fog Glass"), "Polish of Fog Glass");
    assert.equal(relationLine("mutate", "Fog Glass", ["type"], ["palette"]), "Mutated palette · Fog Glass");
    assert.equal(
      relationLine("remix", "Fog Glass", ["type", "radius", "density", "shape", "motion"], ["palette"]),
      "Remix of Fog Glass · kept type, radius, density, shape, motion",
    );
  });
});
