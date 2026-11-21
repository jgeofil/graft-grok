//#region node_modules/.nitro/vite/services/ssr/assets/model-BBCco-ZW.js
var ROLES = [
	"canvas",
	"surface",
	"ink",
	"muted",
	"line",
	"accent",
	"onAccent"
];
var ROLE_LABEL = {
	canvas: "Canvas",
	surface: "Surface",
	ink: "Ink",
	muted: "Muted",
	line: "Line",
	accent: "Accent",
	onAccent: "On accent"
};
var TEXT_FONTS = [
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
	"DM Serif Display"
];
var MONO_FONTS = ["IBM Plex Mono", "Space Mono"];
var TRAITS = [
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
	"Formal"
];
var RADII = [
	"0px",
	"2px",
	"8px",
	"16px",
	"24px",
	"999px"
];
var DENSITIES = [
	"tight",
	"balanced",
	"airy"
];
var ASPECTS = [
	"palette",
	"type",
	"radius",
	"density",
	"voice",
	"imagery",
	"shape",
	"motion"
];
var ASPECT_LABEL = {
	palette: "Palette",
	type: "Type",
	radius: "Radius",
	density: "Density",
	voice: "Voice",
	imagery: "Imagery",
	shape: "Shape",
	motion: "Motion"
};
var SERIF = /* @__PURE__ */ new Set([
	"Fraunces",
	"Newsreader",
	"Instrument Serif",
	"Playfair Display",
	"Cormorant Garamond",
	"Source Serif 4",
	"Bodoni Moda",
	"Literata",
	"Libre Baskerville",
	"DM Serif Display"
]);
function isSerifFont(family) {
	return SERIF.has(family);
}
var WEIGHTS = {
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
	"Space Mono": "400;700"
};
var BASE_FONTS = [
	"Fraunces",
	"Outfit",
	"Newsreader",
	"Instrument Serif",
	"Instrument Sans",
	"Syne",
	"IBM Plex Sans",
	"IBM Plex Mono"
];
var BASE_FONT_HREF = fontStylesheetHref(BASE_FONTS);
function fontStylesheetHref(families) {
	const unique = [...new Set(families)].filter((family) => family in WEIGHTS);
	if (!unique.length) return "";
	return `https://fonts.googleapis.com/css2?${unique.map((family) => {
		const name = family.replace(/ /g, "+");
		const weight = WEIGHTS[family];
		return weight ? `family=${name}:wght@${weight}` : `family=${name}`;
	}).join("&")}&display=swap`;
}
function extraFontHref(families) {
	const base = new Set(BASE_FONTS);
	return fontStylesheetHref(families.filter((family) => !base.has(family)));
}
function fontStack(family) {
	const safe = family.replace(/"/g, "");
	if (SERIF.has(safe)) return `"${safe}", Georgia, serif`;
	if (safe.toLowerCase().includes("mono")) return `"${safe}", ui-monospace, monospace`;
	return `"${safe}", "Avenir Next", sans-serif`;
}
function brandVars(direction) {
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
		"--b-mono": fontStack(direction.monoFont)
	};
}
function colorOf(direction, role) {
	return direction.palette.find((color) => color.role === role) ?? {
		role,
		name: ROLE_LABEL[role],
		hex: "#888888",
		usage: ""
	};
}
function rgb(hex) {
	const value = parseInt(hex.slice(1), 16);
	return [
		value >> 16 & 255,
		value >> 8 & 255,
		value & 255
	];
}
function toHex(channels) {
	return `#${channels.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}
function linear(channel) {
	const s = channel / 255;
	return s <= .04045 ? s / 12.92 : ((s + .055) / 1.055) ** 2.4;
}
function luminance(hex) {
	const [r, g, b] = rgb(hex);
	return .2126 * linear(r) + .7152 * linear(g) + .0722 * linear(b);
}
function contrast(a, b) {
	const l1 = luminance(a);
	const l2 = luminance(b);
	const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
	return (hi + .05) / (lo + .05);
}
function formatRatio(a, b) {
	return `${contrast(a, b).toFixed(1)}:1`;
}
function mix(a, b, t) {
	const pa = rgb(a);
	const pb = rgb(b);
	return toHex(pa.map((channel, index) => Math.round(channel + (pb[index] - channel) * t)));
}
function bestInk(bg) {
	const dark = "#14120f";
	const light = "#f7f4ee";
	return contrast(bg, dark) >= contrast(bg, light) ? dark : light;
}
function parseHex(value) {
	if (typeof value !== "string") return null;
	const match = value.trim().match(/^#?([0-9a-f]{6})$/i);
	return match ? `#${match[1].toLowerCase()}` : null;
}
var FALLBACK = {
	canvas: {
		role: "canvas",
		name: "Paper",
		hex: "#f3efe6",
		usage: "Page ground."
	},
	surface: {
		role: "surface",
		name: "Card",
		hex: "#fbf8f2",
		usage: "Cards, inputs, and raised panels."
	},
	ink: {
		role: "ink",
		name: "Ink",
		hex: "#1a1916",
		usage: "Primary text and icons."
	},
	muted: {
		role: "muted",
		name: "Graphite",
		hex: "#5c574f",
		usage: "Secondary text and metadata."
	},
	line: {
		role: "line",
		name: "Rule",
		hex: "#e0d8cc",
		usage: "Hairline separators."
	},
	accent: {
		role: "accent",
		name: "Leaf",
		hex: "#1e6a48",
		usage: "The single action color."
	},
	onAccent: {
		role: "onAccent",
		name: "On leaf",
		hex: "#f3faf6",
		usage: "Text on accent fills."
	}
};
function finalizePalette(input) {
	const palette = {};
	for (const role of ROLES) {
		const given = input[role];
		const hex = given ? parseHex(given.hex) : null;
		palette[role] = hex ? {
			role,
			name: clip(given?.name, 24) || FALLBACK[role].name,
			hex,
			usage: clip(given?.usage, 140) || FALLBACK[role].usage
		} : { ...FALLBACK[role] };
	}
	if (contrast(palette.ink.hex, palette.canvas.hex) < 7) {
		palette.ink.hex = bestInk(palette.canvas.hex);
		palette.ink.name = luminance(palette.ink.hex) < .2 ? "Ink" : "Paper";
	}
	let guard = 0;
	while (contrast(palette.muted.hex, palette.canvas.hex) < 4.5 && guard < 8) {
		palette.muted.hex = mix(palette.muted.hex, palette.ink.hex, .28);
		guard += 1;
	}
	if (contrast(palette.onAccent.hex, palette.accent.hex) < 4.5) {
		palette.onAccent.hex = bestInk(palette.accent.hex);
		palette.onAccent.name = luminance(palette.onAccent.hex) < .2 ? "On accent" : "On accent light";
	}
	guard = 0;
	while (contrast(palette.line.hex, palette.canvas.hex) < 1.2 && guard < 6) {
		palette.line.hex = mix(palette.line.hex, palette.ink.hex, .18);
		guard += 1;
	}
	if (contrast(palette.surface.hex, palette.canvas.hex) < 1.03) {
		const toward = luminance(palette.canvas.hex) > .5 ? "#000000" : "#ffffff";
		palette.surface.hex = mix(palette.canvas.hex, toward, .06);
	}
	return ROLES.map((role) => palette[role]);
}
function clip(value, max) {
	if (typeof value !== "string") return "";
	return value.replace(/\s+/g, " ").trim().slice(0, max);
}
function asRecord(value) {
	return value && typeof value === "object" && !Array.isArray(value) ? value : null;
}
function pickFont(value, allowed, fallback) {
	const text = clip(value, 40);
	return allowed.includes(text) ? text : fallback;
}
function pickRadius(value) {
	const text = clip(value, 8);
	return RADII.includes(text) ? text : "8px";
}
function pickDensity(value) {
	const text = clip(value, 12);
	return DENSITIES.includes(text) ? text : "balanced";
}
function threeLines(value, fallback) {
	const next = (Array.isArray(value) ? value.map((item) => clip(item, 140)).filter(Boolean) : []).slice(0, 3);
	while (next.length < 3) next.push(fallback[next.length] ?? fallback[0]);
	return next;
}
function toSeeds(raw) {
	const record = asRecord(raw);
	const list = Array.isArray(record?.directions) ? record.directions : [];
	const seeds = [];
	for (const item of list) {
		const seed = toSeed(item);
		if (seed) seeds.push(seed);
	}
	return seeds.slice(0, 3);
}
function toSeed(item) {
	const record = asRecord(item);
	if (!record) return null;
	const incoming = /* @__PURE__ */ new Map();
	if (Array.isArray(record.palette)) for (const entry of record.palette) {
		const color = asRecord(entry);
		if (!color) continue;
		const role = clip(color.role, 16);
		if (!ROLES.includes(role) || incoming.has(role)) continue;
		const hex = parseHex(color.hex);
		if (!hex) continue;
		incoming.set(role, {
			role,
			name: clip(color.name, 24) || ROLE_LABEL[role],
			hex,
			usage: clip(color.usage, 140)
		});
	}
	if (incoming.size < 4) return null;
	const displayFont = pickFont(record.displayFont, TEXT_FONTS, "Fraunces");
	let bodyFont = pickFont(record.bodyFont, TEXT_FONTS, "Outfit");
	if (bodyFont === displayFont) bodyFont = displayFont === "Outfit" ? "Instrument Sans" : "Outfit";
	return {
		title: clip(record.title, 48) || "Untitled cut",
		epithet: clip(record.epithet, 80) || "A distinct cut of the brief",
		rationale: clip(record.rationale, 360) || "A workable direction derived from the brief.",
		wordmarkStyle: clip(record.wordmarkStyle, 160) || "Set the name in the display face, without a symbol.",
		palette: finalizePalette(Object.fromEntries(incoming)),
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
			"Keep headlines to one idea."
		]),
		donts: threeLines(record.donts, [
			"Do not add a second accent hue.",
			"Do not put text on photographs.",
			"Do not use a gradient wordmark."
		]),
		sampleHeadline: clip(record.sampleHeadline, 90) || "Make the object the brand.",
		sampleBody: clip(record.sampleBody, 280) || "The system is a set of decisions a product team can ship without a second meeting.",
		buttonLabel: clip(record.buttonLabel, 28) || "Continue"
	};
}
function slugify(value) {
	return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "system";
}
function columnsOf(directions) {
	const ids = new Set(directions.map((direction) => direction.id));
	const depth = /* @__PURE__ */ new Map();
	const queue = directions.filter((direction) => !direction.parentId || !ids.has(direction.parentId)).map((direction) => ({
		direction,
		depth: 0
	}));
	const columns = [];
	const seen = /* @__PURE__ */ new Set();
	while (queue.length) {
		const next = queue.shift();
		if (!next || seen.has(next.direction.id)) continue;
		seen.add(next.direction.id);
		depth.set(next.direction.id, next.depth);
		columns[next.depth] ??= [];
		columns[next.depth].push(next.direction);
		for (const child of directions) if (child.parentId === next.direction.id) queue.push({
			direction: child,
			depth: next.depth + 1
		});
	}
	for (const column of columns) column.sort((a, b) => a.createdAt - b.createdAt);
	return columns.filter(Boolean);
}
function descendantIds(directions, id) {
	const ids = [id];
	for (const direction of directions) if (direction.parentId === id) ids.push(...descendantIds(directions, direction.id));
	return ids;
}
//#endregion
export { isSerifFont as _, MONO_FONTS as a, TEXT_FONTS as c, colorOf as d, columnsOf as f, formatRatio as g, finalizePalette as h, DENSITIES as i, TRAITS as l, extraFontHref as m, ASPECT_LABEL as n, RADII as o, descendantIds as p, BASE_FONT_HREF as r, ROLE_LABEL as s, ASPECTS as t, brandVars as u, slugify as v, toSeeds as y };
