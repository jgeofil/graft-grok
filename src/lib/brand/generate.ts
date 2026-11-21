import { createServerFn } from "@tanstack/react-start";
import {
  MONO_FONTS,
  TEXT_FONTS,
  TRAITS,
  toSeeds,
  type Brief,
  type DirectionSeed,
} from "@/lib/brand/model";
import {
  LEVEL_META,
  applyLineage,
  describePlans,
  diffLineage,
  isLevel,
  plansFor,
  type Level,
  type LineageMark,
} from "@/lib/brand/lineage";

export type GenerateResult =
  | { ok: true; directions: DirectionSeed[]; lineage: LineageMark[] }
  | { ok: false; error: string };

type Mode = "seed" | Level;

type GenerateInput = {
  mode: Mode;
  brief: Brief;
  parent?: DirectionSeed;
  instruction: string;
};

const SYSTEM = `You are the identity director inside Graft, a studio for branching brand systems. You design buildable visual identities: a palette with roles, a type pairing, and guidelines a designer can execute without a follow-up meeting.

Color rules:
- Hex is #RRGGBB.
- Use each role once: canvas (page ground), surface (cards and inputs), ink (primary text), muted (secondary text), line (hairlines), accent (the single action color), onAccent (text on accent fills).
- Contrast: ink on canvas at least 7:1. muted on canvas at least 4.5:1. onAccent on accent at least 4.5:1. line is visible on canvas but quieter than muted.
- canvas and surface are close, not identical.
- One accent hue. Do not invent extra hues in the usage copy.

Type rules:
- displayFont and bodyFont must be different names from the allowed text list.
- monoFont must be from the mono list.
- Prefer a serif with a grotesque, or two grotesques with different voices. Do not pair two high-contrast fashion serifs.

Direction rules:
- Titles are 1 to 3 words and are not the brand name.
- Epithets are under 8 words and name the actual move.
- Rationale is two sentences: the idea, then why the palette and type prove it.
- sampleHeadline, sampleBody, and buttonLabel are in the brand's voice, not commentary about the design. No lorem. No "welcome to".
- Guidelines are concrete. Name sentence length, photographic subject, radius, shadow attitude, motion duration, and how buttons behave.
- dos and donts are three short imperatives each.
- radius must be one of 0px, 2px, 8px, 16px, 24px, 999px and must agree with the shape note.
- density is tight, balanced, or airy.
- Never produce a purple-gradient SaaS look, glassmorphism, or a wordmark that depends on an icon.

When drafting several directions, they must differ in hue family, type pairing, and radius. Three tints of one idea are a failure.
When a parent is present, the user message assigns every aspect of every direction as LOCKED, LIGHT, or STRONG. Obey that assignment. It is how the parent stays visible.
LOCKED means copy the parent: same hex values, same font names, same radius, same density, same sentences.
LIGHT means one step inside the parent's family. Do not change hue family, type class, or the metaphor.
STRONG means new, and still a consequence of whatever is locked. A new palette has to live with a locked serif. A new voice has to live with a locked palette.
The epithet names the actual move. Do not use the words polish, mutate, sibling, remix, creative, or cousin.
On a polish, an instruction unlocks only the aspects it names, and only as a small step. On every other level, an instruction never unlocks a locked aspect.`;

function clip(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}

function parseBrief(value: unknown): Brief {
  const record = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const traits = Array.isArray(record.traits)
    ? record.traits.map((trait) => clip(trait, 24)).filter((trait) => (TRAITS as readonly string[]).includes(trait))
    : [];
  return {
    name: clip(record.name, 60),
    category: clip(record.category, 200),
    audience: clip(record.audience, 160),
    traits: traits.slice(0, 4),
    avoid: clip(record.avoid, 240),
    notes: clip(record.notes, 500),
  };
}

function parseParent(value: unknown): DirectionSeed | undefined {
  const seeds = toSeeds({ directions: [value] });
  return seeds[0];
}

function parseMode(value: unknown): Mode {
  if (value === "refine" || value === "polish") return "polish";
  if (value === "branch" || value === "siblings") return "siblings";
  if (typeof value === "string" && isLevel(value)) return value;
  return "seed";
}

function parseInput(input: unknown): GenerateInput {
  const record = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
  const mode = parseMode(record.mode);
  const brief = parseBrief(record.brief);
  if (!brief.name || !brief.category) {
    throw new Error("Add a name and what the brand is before drafting.");
  }
  const parent = mode === "seed" ? undefined : parseParent(record.parent);
  if (mode !== "seed" && !parent) {
    throw new Error("Choose a direction to branch from.");
  }
  const instruction = clip(record.instruction, 400);
  return { mode, brief, parent, instruction };
}

function directionSchema() {
  const color = {
    type: "object",
    additionalProperties: false,
    required: ["role", "name", "hex", "usage"],
    properties: {
      role: { type: "string", enum: ["canvas", "surface", "ink", "muted", "line", "accent", "onAccent"] },
      name: { type: "string" },
      hex: { type: "string" },
      usage: { type: "string" },
    },
  };
  const direction = {
    type: "object",
    additionalProperties: false,
    required: [
      "title",
      "epithet",
      "rationale",
      "wordmarkStyle",
      "palette",
      "radius",
      "density",
      "displayFont",
      "bodyFont",
      "monoFont",
      "typeNotes",
      "voice",
      "imagery",
      "shape",
      "motion",
      "spacing",
      "uiNotes",
      "dos",
      "donts",
      "sampleHeadline",
      "sampleBody",
      "buttonLabel",
    ],
    properties: {
      title: { type: "string" },
      epithet: { type: "string" },
      rationale: { type: "string" },
      wordmarkStyle: { type: "string" },
      palette: { type: "array", items: color },
      radius: { type: "string", enum: ["0px", "2px", "8px", "16px", "24px", "999px"] },
      density: { type: "string", enum: ["tight", "balanced", "airy"] },
      displayFont: { type: "string", enum: [...TEXT_FONTS] },
      bodyFont: { type: "string", enum: [...TEXT_FONTS] },
      monoFont: { type: "string", enum: [...MONO_FONTS] },
      typeNotes: { type: "string" },
      voice: { type: "string" },
      imagery: { type: "string" },
      shape: { type: "string" },
      motion: { type: "string" },
      spacing: { type: "string" },
      uiNotes: { type: "string" },
      dos: { type: "array", items: { type: "string" } },
      donts: { type: "array", items: { type: "string" } },
      sampleHeadline: { type: "string" },
      sampleBody: { type: "string" },
      buttonLabel: { type: "string" },
    },
  };
  return {
    type: "object",
    additionalProperties: false,
    required: ["directions"],
    properties: {
      directions: { type: "array", items: direction },
    },
  };
}

function userPrompt(input: GenerateInput, plans: ReturnType<typeof plansFor> | null): string {
  const count = input.mode === "seed" ? 3 : LEVEL_META[input.mode].count;
  const lines = [
    `Brand name: ${input.brief.name}`,
    `What it is: ${input.brief.category}`,
    input.brief.audience ? `Audience: ${input.brief.audience}` : "",
    input.brief.traits.length ? `Temperament: ${input.brief.traits.join(", ")}` : "",
    input.brief.avoid ? `Avoid: ${input.brief.avoid}` : "",
    input.brief.notes ? `Notes: ${input.brief.notes}` : "",
    `Allowed text fonts: ${TEXT_FONTS.join(", ")}`,
    `Allowed mono fonts: ${MONO_FONTS.join(", ")}`,
    `Mode: ${input.mode}`,
    `Produce exactly ${count} direction${count === 1 ? "" : "s"}.`,
  ];
  if (input.parent) {
    lines.push(`Parent direction:\n${JSON.stringify(input.parent)}`);
  }
  if (plans) {
    lines.push(describePlans(plans));
    if (input.mode === "polish") {
      lines.push(
        input.instruction
          ? "Apply the instruction as a small tweak to the LIGHT aspects only. Name that tweak in the epithet and rationale. Copy every LOCKED aspect from the parent, including hex values and font names."
          : "No instruction. Change only the editorial layer: title, epithet, rationale, wordmarkStyle, typeNotes, uiNotes, dos, and donts. Do not restyle the system.",
      );
    }
  }
  if (input.instruction) {
    lines.push(
      `Instruction: ${input.instruction}`,
      "Follow the instruction only where the aspect is LIGHT or STRONG. Leave LOCKED aspects copied from the parent.",
    );
  }
  return lines.filter(Boolean).join("\n");
}

function messageText(content: unknown): string {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  return content
    .map((part) => {
      if (typeof part === "string") return part;
      if (part && typeof part === "object" && "text" in part) return String((part as { text: unknown }).text);
      return "";
    })
    .join("");
}

export const aiAvailable = createServerFn({ method: "GET" }).handler(async () => {
  return { available: Boolean(process.env.XAI_API_KEY) };
});

export const generateDirections = createServerFn({ method: "POST" })
  .validator((input: unknown) => parseInput(input))
  .handler(async ({ data }): Promise<GenerateResult> => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false, error: "AI drafting is not available in this session." };

    const count = data.mode === "seed" ? 3 : LEVEL_META[data.mode].count;
    const plans = data.mode === "seed" || !data.parent ? null : plansFor(data.mode, Math.random, data.instruction);
    const temperature =
      data.mode === "polish" ? 0.35 : data.mode === "siblings" ? 0.55 : data.mode === "mutate" ? 0.7 : data.mode === "seed" ? 0.85 : 0.8;
    try {
      const payload = {
        model: "grok-4.5",
        temperature,
        max_tokens: count === 1 ? 2500 : 6000,
        reasoning_effort: "low" as const,
        response_format: {
          type: "json_schema" as const,
          json_schema: {
            name: "brand_directions",
            strict: true,
            schema: directionSchema(),
          },
        },
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: userPrompt(data, plans) },
        ],
      };

      const request = (body: Record<string, unknown>) =>
        fetch("https://api.x.ai/v1/chat/completions", {
          method: "POST",
          signal: AbortSignal.timeout(55_000),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
            "x-grok-conv-id": "graft-studio",
          },
          body: JSON.stringify(body),
        });

      let response = await request(payload);
      if (response.status === 400) {
        const { reasoning_effort: _drop, ...rest } = payload;
        response = await request({ ...rest, response_format: { type: "json_object" } });
      }

      if (!response.ok) {
        return { ok: false, error: `Drafting failed (${response.status}). Try again.` };
      }

      const body = (await response.json()) as {
        choices?: { finish_reason?: string; message?: { content?: unknown } }[];
      };
      const choice = body.choices?.[0];
      if (choice?.finish_reason === "length") {
        return { ok: false, error: "The draft was cut off. Try again." };
      }
      const text = messageText(choice?.message?.content);
      let parsed: unknown;
      try {
        parsed = JSON.parse(text);
      } catch {
        return { ok: false, error: "The draft came back unreadable. Try again." };
      }
      const drafted = toSeeds(parsed).slice(0, count);
      if (!drafted.length) {
        return { ok: false, error: "The draft didn't include a usable palette. Try again." };
      }
      if (data.parent && plans) {
        const directions = drafted.map((seed, index) =>
          applyLineage(data.parent as DirectionSeed, seed, plans[index] ?? plans[0], index),
        );
        const lineage = directions.map((seed) => diffLineage(data.parent as DirectionSeed, seed, data.mode as Level));
        return { ok: true, directions, lineage };
      }
      return {
        ok: true,
        directions: drafted,
        lineage: drafted.map(() => ({ level: "seed" as const, kept: [], changed: [] })),
      };
    } catch {
      return { ok: false, error: "Drafting didn't finish. Try again." };
    }
  });
