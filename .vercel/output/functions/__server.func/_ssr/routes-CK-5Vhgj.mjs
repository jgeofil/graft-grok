import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { d as colorOf, f as columnsOf, g as formatRatio, h as finalizePalette, l as TRAITS, m as extraFontHref, n as ASPECT_LABEL, p as descendantIds, s as ROLE_LABEL, u as brandVars, v as slugify, y as toSeeds } from "./model-BBCco-ZW.mjs";
import { c as relationLine, l as relationTitle, n as LEVEL_META, o as isLevel, t as LEVELS } from "./lineage-DQ3j3A2H.mjs";
import { r as Star, t as X } from "../_libs/lucide-react.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CK-5Vhgj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function clip(value, max) {
	if (typeof value !== "string") return "";
	return value.replace(/\s+/g, " ").trim().slice(0, max);
}
function parseBrief(value) {
	const record = value && typeof value === "object" ? value : {};
	const traits = Array.isArray(record.traits) ? record.traits.map((trait) => clip(trait, 24)).filter((trait) => TRAITS.includes(trait)) : [];
	return {
		name: clip(record.name, 60),
		category: clip(record.category, 200),
		audience: clip(record.audience, 160),
		traits: traits.slice(0, 4),
		avoid: clip(record.avoid, 240),
		notes: clip(record.notes, 500)
	};
}
function parseParent(value) {
	return toSeeds({ directions: [value] })[0];
}
function parseMode(value) {
	if (value === "refine" || value === "polish") return "polish";
	if (value === "branch" || value === "siblings") return "siblings";
	if (typeof value === "string" && isLevel(value)) return value;
	return "seed";
}
function parseInput(input) {
	const record = input && typeof input === "object" ? input : {};
	const mode = parseMode(record.mode);
	const brief = parseBrief(record.brief);
	if (!brief.name || !brief.category) throw new Error("Add a name and what the brand is before drafting.");
	const parent = mode === "seed" ? void 0 : parseParent(record.parent);
	if (mode !== "seed" && !parent) throw new Error("Choose a direction to branch from.");
	return {
		mode,
		brief,
		parent,
		instruction: clip(record.instruction, 400)
	};
}
var aiAvailable = createServerFn({ method: "GET" }).handler(createSsrRpc("faa6b852513aa0fa6366ca38bd0e3246aca72570c1b1f49cd77e99b41a08a97d"));
var generateDirections = createServerFn({ method: "POST" }).validator((input) => parseInput(input)).handler(createSsrRpc("0738a3038ac6ca8ec7ceb32cd86b474db197d8cd29db5d386fe1ac91c7de378c"));
function palette(colors) {
	return finalizePalette(Object.fromEntries(colors.map((color) => [color.role, color])));
}
var sampleProject = {
	id: "proj_keel",
	createdAt: 1,
	updatedAt: 4,
	sample: true,
	brief: {
		name: "Keel",
		category: "Hand instruments for coastal navigation — compasses, glasses, and tide clocks.",
		audience: "Skippers, and the people who buy gifts for them.",
		traits: [
			"Precise",
			"Quiet",
			"Technical"
		],
		avoid: "Yacht-club clichés, gold foil, anchor icons, stock sunsets.",
		notes: "The object is the brand. Copy should sound like someone who has used the instrument in weather."
	}
};
var shared = {
	projectId: "proj_keel",
	favorite: false,
	canon: false
};
var sampleDirections = [
	{
		...shared,
		id: "dir_chartroom",
		parentId: null,
		origin: "seed",
		createdAt: 1,
		favorite: true,
		title: "Chartroom",
		epithet: "Brass hardware on warm paper",
		rationale: "Treats Keel like a working chart table: warm paper, one brass action, type that could be engraved on a bezel. The navy ink keeps it from slipping into souvenir nautical.",
		wordmarkStyle: "Newsreader, small size, slight tracking. No symbol.",
		palette: palette([
			{
				role: "canvas",
				name: "Bone",
				hex: "#f3eee4",
				usage: "Page ground, like unmarked chart paper."
			},
			{
				role: "surface",
				name: "Cream",
				hex: "#fbf7f0",
				usage: "Logbook cards and input fields."
			},
			{
				role: "ink",
				name: "Navy",
				hex: "#1b2433",
				usage: "Wordmark, headlines, and body."
			},
			{
				role: "muted",
				name: "Slate",
				hex: "#4e5968",
				usage: "Captions, axis labels, metadata."
			},
			{
				role: "line",
				name: "Rule",
				hex: "#ddd4c4",
				usage: "Hairlines in place of shadows."
			},
			{
				role: "accent",
				name: "Brass",
				hex: "#7a5424",
				usage: "One action per view. Never a fill for large areas."
			},
			{
				role: "onAccent",
				name: "Cream",
				hex: "#fbf7f0",
				usage: "Label on the brass button."
			}
		]),
		radius: "2px",
		density: "balanced",
		displayFont: "Newsreader",
		bodyFont: "Instrument Sans",
		monoFont: "IBM Plex Mono",
		typeNotes: "Newsreader for the name and headlines. Instrument Sans for UI and reading. Bearings in mono.",
		voice: "Short sentences. Measurements are welcome. No nautical slang as costume.",
		imagery: "Overhead of instruments on unmarked paper. No people, no horizons, no rope.",
		shape: "Nearly square. 2px corners. Hairline rules, no drop shadows.",
		motion: "120ms color fades. Nothing travels, nothing bounces.",
		spacing: "8px grid. Labels sit tight to the thing they name. Comfortable page margins.",
		uiNotes: "The primary button is filled brass. Secondary actions are navy hairlines. Inputs look like logbook fields.",
		dos: [
			"Use real measurements in the copy.",
			"Keep brass to one element per view.",
			"Set bearings and prices in mono."
		],
		donts: [
			"No anchors, wheels, or script wordmarks.",
			"No gold gradients or foil effects.",
			"No full-bleed ocean photography."
		],
		sampleHeadline: "Bearing, not decoration.",
		sampleBody: "Keel makes hand instruments for people who still look at the water. Brass where the hand rests. Glass you can trust at dusk.",
		buttonLabel: "See the compass"
	},
	{
		...shared,
		id: "dir_fog",
		parentId: null,
		origin: "seed",
		createdAt: 2,
		canon: true,
		title: "Fog Glass",
		epithet: "Quiet instruments, cool light",
		rationale: "Puts the dial at the center and lets everything else recede into sea-glass light. A soft radius and a serif with a plain grotesque feel considered, not maritime.",
		wordmarkStyle: "Instrument Serif, sentence case, no tracking tricks.",
		palette: palette([
			{
				role: "canvas",
				name: "Fog",
				hex: "#e6eeef",
				usage: "Page ground. Cool, never blue-gray sludge."
			},
			{
				role: "surface",
				name: "Glass",
				hex: "#f4f8f8",
				usage: "Panels that sit just above the fog."
			},
			{
				role: "ink",
				name: "Deep",
				hex: "#1a282b",
				usage: "All primary reading text."
			},
			{
				role: "muted",
				name: "Tide",
				hex: "#4d6468",
				usage: "Secondary sentences and captions."
			},
			{
				role: "line",
				name: "Mist",
				hex: "#c9d8d9",
				usage: "Quiet rules between sections."
			},
			{
				role: "accent",
				name: "Kelp",
				hex: "#1f5f5c",
				usage: "The single action. Also small luminous marks."
			},
			{
				role: "onAccent",
				name: "Glass",
				hex: "#f4f8f8",
				usage: "Text on kelp fills."
			}
		]),
		radius: "16px",
		density: "airy",
		displayFont: "Instrument Serif",
		bodyFont: "Instrument Sans",
		monoFont: "IBM Plex Mono",
		typeNotes: "Instrument Serif only for headlines and the wordmark. Instrument Sans does all the work below.",
		voice: "Calm, concrete, a little dry. Say what the instrument does, then stop.",
		imagery: "Diffuse daylight, objects isolated on the fog ground. Condensation is allowed. Sunsets are not.",
		shape: "One radius, 16px, on buttons, inputs, and cards. No mixed corners.",
		motion: "Opacity only, 200ms. No slides that show off.",
		spacing: "Airy margins. Captions stay tight. Let the object occupy the quiet.",
		uiNotes: "Filled kelp button for the one action. Links are kelp, not underlined. Inputs are glass on fog.",
		dos: [
			"Leave more paper than type.",
			"Photograph objects, not lifestyles.",
			"Use kelp only for the action and small marks."
		],
		donts: [
			"Do not add a second accent.",
			"Do not illustrate waves or boats.",
			"Do not tighten this into a dashboard."
		],
		sampleHeadline: "See farther. Say less.",
		sampleBody: "A Keel instrument is a small, exact object. The dial is the brand. Everything else stays out of its way.",
		buttonLabel: "Hold one"
	},
	{
		...shared,
		id: "dir_harbor",
		parentId: null,
		origin: "seed",
		createdAt: 3,
		title: "Harbor Cut",
		epithet: "Utilitarian, high contrast",
		rationale: "Speaks like equipment, not a gift shop. Sharp corners, a grotesk with a hard mono, and red reserved for the control you actually press.",
		wordmarkStyle: "Syne, medium weight, tight. All caps only on labels, never the name.",
		palette: palette([
			{
				role: "canvas",
				name: "Deck",
				hex: "#f2f1ee",
				usage: "Ground. Warm only by a degree."
			},
			{
				role: "surface",
				name: "Plate",
				hex: "#ffffff",
				usage: "Spec cards and input plates."
			},
			{
				role: "ink",
				name: "Black",
				hex: "#141414",
				usage: "Everything that must be read."
			},
			{
				role: "muted",
				name: "Iron",
				hex: "#55524c",
				usage: "Secondary spec lines."
			},
			{
				role: "line",
				name: "Edge",
				hex: "#d5d2cb",
				usage: "Structural rules, 1px."
			},
			{
				role: "accent",
				name: "Signal",
				hex: "#c4392b",
				usage: "Controls only. Never a background wash."
			},
			{
				role: "onAccent",
				name: "White",
				hex: "#ffffff",
				usage: "Label on the signal button."
			}
		]),
		radius: "0px",
		density: "tight",
		displayFont: "Syne",
		bodyFont: "IBM Plex Sans",
		monoFont: "IBM Plex Mono",
		typeNotes: "Syne for the name and short headlines. Plex Sans for specs. Plex Mono for every number.",
		voice: "Blunt. Specs before story. No romance, no puns.",
		imagery: "Workshop light, stamped metal, close crops of markings. Red appears only on controls.",
		shape: "Sharp corners. Thick rules. No shadows, no pills.",
		motion: "State changes snap. No easing that feels soft.",
		spacing: "Tight. 4px between a label and its value. Page margins stay modest.",
		uiNotes: "The signal button is the only fill. Secondary actions are black rules. Tables are welcome.",
		dos: [
			"Lead with the specification.",
			"Use red only on a control.",
			"Align numbers in columns."
		],
		donts: [
			"No rounded gift-shop buttons.",
			"No lifestyle photography.",
			"No script or serif display."
		],
		sampleHeadline: "Tools for weather.",
		sampleBody: "Keel builds compasses and glasses that work when your hands are cold. Red is for the thing you press. Everything else is equipment.",
		buttonLabel: "Specifications"
	},
	{
		...shared,
		id: "dir_night",
		parentId: "dir_fog",
		origin: "remix",
		kept: [
			"type",
			"radius",
			"density",
			"shape",
			"motion"
		],
		changed: [
			"palette",
			"voice",
			"imagery"
		],
		createdAt: 4,
		favorite: true,
		title: "Night Watch",
		epithet: "Same glass, after dusk",
		rationale: "A dark-field sibling of Fog Glass for the instrument UI and evening product pages. The serif, the radius, and the kelp family stay. The field flips.",
		wordmarkStyle: "Same Instrument Serif setting as Fog Glass. Do not invert the tracking.",
		palette: palette([
			{
				role: "canvas",
				name: "Water",
				hex: "#12181a",
				usage: "Night ground. Not pure black."
			},
			{
				role: "surface",
				name: "Hull",
				hex: "#1c2527",
				usage: "Raised panels on the water."
			},
			{
				role: "ink",
				name: "Lamp",
				hex: "#e5eeee",
				usage: "Primary text."
			},
			{
				role: "muted",
				name: "Mist",
				hex: "#9bb0b2",
				usage: "Secondary text that still clears the water."
			},
			{
				role: "line",
				name: "Wake",
				hex: "#2e3d40",
				usage: "Hairlines that separate, not glow."
			},
			{
				role: "accent",
				name: "Lume",
				hex: "#7eccc6",
				usage: "The luminous mark. Also the one button."
			},
			{
				role: "onAccent",
				name: "Depth",
				hex: "#10211f",
				usage: "Text on the luminous button."
			}
		]),
		radius: "16px",
		density: "airy",
		displayFont: "Instrument Serif",
		bodyFont: "Instrument Sans",
		monoFont: "IBM Plex Mono",
		typeNotes: "Keep the Fog Glass pairing. Do not swap in a condensed grotesk just because the field is dark.",
		voice: "The same dry voice, fewer words. Night pages do not explain the philosophy again.",
		imagery: "The instrument lit by its own marks. No city bokeh, no moon photos.",
		shape: "Same 16px radius as Fog Glass, so the two cuts feel like one system.",
		motion: "Same 200ms opacity. The lume does not pulse.",
		spacing: "Airy, like the day system. Do not pack the night UI just because it is an interface.",
		uiNotes: "Lume is the button and the active mark. Links are lume. Never outline the button in white.",
		dos: [
			"Keep the day system's type and radius.",
			"Use lume for the action and active marks only.",
			"Let the ground stay a deep green-black, not #000."
		],
		donts: [
			"Do not add a second night accent.",
			"Do not pulse or glow the lume.",
			"Do not set long text in the serif."
		],
		sampleHeadline: "The dial, after dark.",
		sampleBody: "Night Watch is Fog Glass with the lights down. The accent is the luminous mark. The page is the water around it.",
		buttonLabel: "View the night set"
	}
];
var initial = {
	projects: [sampleProject],
	directions: sampleDirections,
	activeProjectId: sampleProject.id,
	selectedId: "dir_fog"
};
var useStudio = create()(persist((set) => ({
	...initial,
	selectProject: (id) => set((state) => {
		const directions = state.directions.filter((direction) => direction.projectId === id);
		return {
			activeProjectId: id,
			selectedId: directions.find((direction) => direction.canon)?.id ?? directions[0]?.id ?? null
		};
	}),
	selectDirection: (id) => set({ selectedId: id }),
	createProject: (brief) => {
		const id = `proj_${crypto.randomUUID().slice(0, 8)}`;
		const now = Date.now();
		const project = {
			id,
			brief,
			createdAt: now,
			updatedAt: now
		};
		set((state) => ({
			projects: [project, ...state.projects],
			activeProjectId: id,
			selectedId: null
		}));
		return id;
	},
	updateBrief: (id, brief) => set((state) => ({ projects: state.projects.map((project) => project.id === id ? {
		...project,
		brief,
		updatedAt: Date.now()
	} : project) })),
	removeProject: (id) => set((state) => {
		const projects = state.projects.filter((project) => project.id !== id);
		const directions = state.directions.filter((direction) => direction.projectId !== id);
		const active = projects[0];
		const nextDirections = active ? directions.filter((direction) => direction.projectId === active.id) : [];
		return {
			projects,
			directions,
			activeProjectId: active?.id ?? "",
			selectedId: nextDirections.find((direction) => direction.canon)?.id ?? nextDirections[0]?.id ?? null
		};
	}),
	addDirections: (items) => set((state) => ({
		directions: [...state.directions, ...items],
		selectedId: items[0]?.id ?? state.selectedId,
		projects: state.projects.map((project) => project.id === items[0]?.projectId ? {
			...project,
			updatedAt: Date.now()
		} : project)
	})),
	toggleFavorite: (id) => set((state) => ({ directions: state.directions.map((direction) => direction.id === id ? {
		...direction,
		favorite: !direction.favorite
	} : direction) })),
	setCanon: (id) => set((state) => {
		const target = state.directions.find((direction) => direction.id === id);
		if (!target) return state;
		const next = !target.canon;
		return { directions: state.directions.map((direction) => direction.projectId === target.projectId ? {
			...direction,
			canon: next && direction.id === id
		} : direction) };
	}),
	removeDirection: (id) => set((state) => {
		const drop = new Set(descendantIds(state.directions, id));
		return {
			directions: state.directions.filter((direction) => !drop.has(direction.id)),
			selectedId: state.selectedId && drop.has(state.selectedId) ? null : state.selectedId
		};
	})
}), {
	name: "graft-studio-v1",
	skipHydration: true,
	partialize: (state) => ({
		projects: state.projects,
		directions: state.directions,
		activeProjectId: state.activeProjectId,
		selectedId: state.selectedId
	})
}));
var empty = {
	name: "",
	category: "",
	audience: "",
	traits: [],
	avoid: "",
	notes: ""
};
function BriefForm({ initial, pending, mode, onCancel, onSave, onDraft }) {
	const [brief, setBrief] = (0, import_react.useState)(initial ?? empty);
	const [error, setError] = (0, import_react.useState)("");
	function update(key, value) {
		setBrief((current) => ({
			...current,
			[key]: value
		}));
	}
	function toggleTrait(trait) {
		setBrief((current) => {
			if (current.traits.includes(trait)) return {
				...current,
				traits: current.traits.filter((item) => item !== trait)
			};
			if (current.traits.length >= 4) return current;
			return {
				...current,
				traits: [...current.traits, trait]
			};
		});
	}
	function ready() {
		if (!brief.name.trim() || !brief.category.trim()) {
			setError("Name the brand and say what it is.");
			return false;
		}
		setError("");
		return true;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "mx-auto flex max-w-xl flex-col gap-6",
		onSubmit: (event) => {
			event.preventDefault();
			if (!ready()) return;
			onDraft(brief);
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "g-kicker",
					children: mode === "new" ? "New brand" : "Brief"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display mt-2 text-4xl leading-none tracking-tight",
					children: mode === "new" ? "Start from a brief." : brief.name || "Edit the brief."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-md text-pretty text-muted",
					children: "Three opening directions, different in color, type, and shape. Keep one, then branch it — closer levels leave more of the parent in place."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "01  Name",
				hint: "The word you’ll set as a wordmark.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "g-field",
					value: brief.name,
					maxLength: 60,
					autoComplete: "off",
					placeholder: "Keel",
					onChange: (event) => update("name", event.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "02  What it is",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					className: "g-field",
					value: brief.category,
					maxLength: 200,
					placeholder: "Hand instruments for coastal navigation.",
					onChange: (event) => update("category", event.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "03  Who it’s for",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "g-field",
					value: brief.audience,
					maxLength: 160,
					placeholder: "Skippers, and the people who buy gifts for them.",
					onChange: (event) => update("audience", event.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
					className: "g-kicker",
					children: "04  Temperament"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "Pick up to four."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: TRAITS.map((trait) => {
						const on = brief.traits.includes(trait);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: `g-chip${on ? " is-on" : ""}`,
							"aria-pressed": on,
							onClick: () => toggleTrait(trait),
							children: trait
						}, trait);
					})
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "05  Keep away from",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "g-field",
					value: brief.avoid,
					maxLength: 240,
					placeholder: "Gold foil, anchor icons, stock sunsets.",
					onChange: (event) => update("avoid", event.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "06  Anything else",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					className: "g-field",
					value: brief.notes,
					maxLength: 500,
					placeholder: "The object is the brand. Copy should sound used, not advertised.",
					onChange: (event) => update("notes", event.target.value)
				})
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "alert",
				className: "text-sm",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "g-btn g-btn-primary",
						type: "submit",
						disabled: pending,
						children: pending ? "Drafting three directions…" : mode === "edit" ? "Save and draft three" : "Draft three directions"
					}),
					mode === "edit" && onSave ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "g-btn g-btn-ghost",
						type: "button",
						disabled: pending,
						onClick: () => {
							if (!ready()) return;
							onSave(brief);
						},
						children: "Save brief"
					}) : null,
					onCancel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "g-btn g-btn-quiet",
						type: "button",
						disabled: pending,
						onClick: onCancel,
						children: "Cancel"
					}) : null
				]
			})
		]
	});
}
function Field({ label, hint, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "g-kicker",
				children: label
			}),
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1 block text-sm text-muted",
				children: hint
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-2 block",
				children
			})
		]
	});
}
function Board({ project, directions, selectedId, pending, ai, onSelect, onToggleFavorite, onEditBrief, onDraftMore, onRemoveProject }) {
	const columns = columnsOf(directions);
	const depthOf = /* @__PURE__ */ new Map();
	columns.forEach((column, depth) => {
		for (const direction of column) depthOf.set(direction.id, depth);
	});
	const pendingDepth = pending == null ? null : pending.parentId ? (depthOf.get(pending.parentId) ?? 0) + 1 : 0;
	const columnCount = Math.max(columns.length, pendingDepth == null ? 0 : pendingDepth + 1);
	const byId = new Map(directions.map((direction) => [direction.id, direction]));
	const order = [...directions].sort((a, b) => a.createdAt - b.createdAt);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "g-kicker",
							children: project.sample ? "Studio sample" : "Brand"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display mt-1 text-4xl leading-none tracking-tight",
							children: project.brief.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 max-w-xl text-pretty text-muted",
							children: project.brief.category
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: [project.brief.audience ? `For ${project.brief.audience}` : "", project.brief.traits.join(" · ")].filter(Boolean).join("  ·  ")
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "g-btn g-btn-ghost",
						type: "button",
						onClick: onEditBrief,
						children: "Edit brief"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "g-btn g-btn-primary",
						type: "button",
						disabled: pending != null || ai === false,
						onClick: onDraftMore,
						children: pending && !pending.parentId ? "Drafting…" : "New directions"
					})]
				})]
			}),
			ai === false ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-xl text-sm text-muted",
				children: "Generative drafting isn’t available in this session. You can still study the sample, keep favorites, and export a system."
			}) : null,
			directions.length === 0 && !pending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-md rounded-2xl border border-line bg-sheet p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl tracking-tight",
						children: "No directions yet"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-pretty text-muted",
						children: "Draft three opening cuts from this brief. They’ll land here as a lineage you can branch."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "g-btn g-btn-primary mt-4",
						type: "button",
						disabled: ai === false,
						onClick: onDraftMore,
						children: "Draft three directions"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "g-cols",
				children: Array.from({ length: columnCount }, (_, depth) => {
					const column = columns[depth] ?? [];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "g-col",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "g-kicker",
								children: depth === 0 ? "Opening directions" : `Cut ${depth + 1}`
							}),
							column.map((direction) => {
								const parent = direction.parentId ? byId.get(direction.parentId) : void 0;
								const index = order.findIndex((item) => item.id === direction.id) + 1;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
									className: `g-card${selectedId === direction.id ? " is-selected" : ""}`,
									style: brandVars(direction),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: `g-card-star${direction.favorite ? " is-on" : ""}`,
										"aria-pressed": direction.favorite,
										"aria-label": direction.favorite ? `Unkeep ${direction.title}` : `Keep ${direction.title}`,
										onClick: () => onToggleFavorite(direction.id),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
											className: "size-4",
											fill: direction.favorite ? "currentColor" : "none"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "g-card-hit",
										onClick: () => onSelect(direction.id),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "g-mono text-xs opacity-70",
												children: String(index).padStart(2, "0")
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "g-word mt-2 block pr-8",
												children: project.brief.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "g-card-title mt-3 block",
												children: direction.title
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "mt-1 block text-sm",
												style: { color: "var(--b-muted)" },
												children: direction.epithet
											}),
											parent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "mt-2 block text-xs",
												style: { color: "var(--b-muted)" },
												children: relationLine(direction.origin, parent.title, direction.kept, direction.changed)
											}) : null,
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "g-stripe",
												"aria-hidden": "true",
												children: direction.palette.map((swatch) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { background: swatch.hex } }, swatch.role))
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "mt-2 block text-xs",
												style: { color: "var(--b-muted)" },
												children: [
													direction.displayFont,
													" · ",
													direction.bodyFont
												]
											}),
											direction.canon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "mt-2 inline-block text-xs font-medium",
												style: { color: "var(--b-accent)" },
												children: "Design system"
											}) : null
										]
									})]
								}, direction.id);
							}),
							pending && pendingDepth === depth ? Array.from({ length: pending.count }, (_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
								className: "g-skel",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm",
									children: pending.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "g-skel-bar" })]
							}, index)) : null
						]
					}, depth);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RemoveBrand, {
				name: project.brief.name,
				onRemove: onRemoveProject
			})
		]
	});
}
function RemoveBrand({ name, onRemove }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
		className: "max-w-md text-sm text-muted",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
				className: "cursor-pointer",
				children: ["Remove ", name]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2",
				children: "This deletes the brief and every direction on this brand. It stays on this device only."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "g-btn g-btn-ghost mt-3",
				type: "button",
				onClick: onRemove,
				children: "Remove brand"
			})
		]
	});
}
var SPACE = {
	tight: {
		"1": "4px",
		"2": "8px",
		"3": "12px",
		"4": "16px",
		"5": "24px"
	},
	balanced: {
		"1": "8px",
		"2": "12px",
		"3": "16px",
		"4": "24px",
		"5": "40px"
	},
	airy: {
		"1": "8px",
		"2": "16px",
		"3": "24px",
		"4": "40px",
		"5": "64px"
	}
};
function cssOf(project, direction) {
	const space = SPACE[direction.density];
	return [
		`/* ${project.brief.name} — ${direction.title}`,
		`   Design system from Graft */`,
		`:root {`,
		...direction.palette.map((color) => `  --color-${color.role.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}: ${color.hex};`),
		`  --radius: ${direction.radius};`,
		`  --font-display: "${direction.displayFont}", Georgia, serif;`,
		`  --font-body: "${direction.bodyFont}", "Avenir Next", sans-serif;`,
		`  --font-mono: "${direction.monoFont}", ui-monospace, monospace;`,
		`  --text-display: 2.75rem;`,
		`  --text-title: 1.5rem;`,
		`  --text-body: 1rem;`,
		`  --text-label: 0.75rem;`,
		...Object.entries(space).map(([step, value]) => `  --space-${step}: ${value};`),
		`}`
	].join("\n");
}
function markdownOf(project, direction) {
	const ink = colorOf(direction, "ink").hex;
	const canvas = colorOf(direction, "canvas").hex;
	const accent = colorOf(direction, "accent").hex;
	const onAccent = colorOf(direction, "onAccent").hex;
	const name = project.brief.name;
	const palette = direction.palette.map((color) => `| ${ROLE_LABEL[color.role]} | ${color.name} | ${color.hex} | ${color.usage} |`).join("\n");
	return [
		`# ${name} — ${direction.title}`,
		``,
		`Design system. ${direction.epithet}.`,
		``,
		direction.rationale,
		``,
		`## Color palette`,
		``,
		`Ink on canvas ${formatRatio(ink, canvas)}. Accent pair ${formatRatio(onAccent, accent)}.`,
		``,
		`| Role | Name | Hex | Usage |`,
		`| --- | --- | --- | --- |`,
		palette,
		``,
		`## Type`,
		``,
		`- Display: ${direction.displayFont}`,
		`- Body: ${direction.bodyFont}`,
		`- Mono: ${direction.monoFont}`,
		`- Radius: ${direction.radius}`,
		`- Density: ${direction.density}`,
		``,
		direction.typeNotes,
		``,
		`Wordmark: ${direction.wordmarkStyle}`,
		``,
		`| Step | Size | Use |`,
		`| --- | --- | --- |`,
		`| Display | 2.75rem | Headlines |`,
		`| Title | 1.5rem | Sections |`,
		`| Body | 1rem | Reading |`,
		`| Label | 0.75rem | Tracked UI labels |`,
		``,
		`## Visual guidelines`,
		``,
		`### Voice`,
		direction.voice,
		``,
		`### Imagery`,
		direction.imagery,
		``,
		`### Shape`,
		direction.shape,
		``,
		`### Motion`,
		direction.motion,
		``,
		`### Spacing`,
		direction.spacing,
		``,
		`### Interface`,
		direction.uiNotes,
		``,
		`### Do`,
		...direction.dos.map((line) => `- ${line}`),
		``,
		`### Don't`,
		...direction.donts.map((line) => `- ${line}`),
		``,
		`## CSS variables`,
		``,
		"```css",
		cssOf(project, direction),
		"```",
		``
	].join("\n");
}
function cssExport(project, direction) {
	return cssOf(project, direction);
}
function exportBasename(project, direction) {
	return `${slugify(project.brief.name)}-${slugify(direction.title)}`;
}
function SystemSheet({ project, direction, parent, pending, ai, notice, onClose, onToggleFavorite, onCanon, onBranch, onRemove }) {
	const [level, setLevel] = (0, import_react.useState)("siblings");
	const [noteOpen, setNoteOpen] = (0, import_react.useState)(false);
	const [instruction, setInstruction] = (0, import_react.useState)("");
	const [confirmRemove, setConfirmRemove] = (0, import_react.useState)(false);
	const [heldFile, setHeldFile] = (0, import_react.useState)(null);
	const vars = brandVars(direction);
	const ink = colorOf(direction, "ink").hex;
	const canvas = colorOf(direction, "canvas").hex;
	const accent = colorOf(direction, "accent").hex;
	const onAccent = colorOf(direction, "onAccent").hex;
	const blocked = pending || ai === false;
	const meta = LEVEL_META[level];
	const kept = direction.kept ?? [];
	const changed = direction.changed ?? [];
	(0, import_react.useEffect)(() => {
		setInstruction("");
		setNoteOpen(false);
		setConfirmRemove(false);
		setHeldFile(null);
	}, [direction.id]);
	(0, import_react.useEffect)(() => {
		if (!heldFile) return;
		const node = document.getElementById("g-held-file");
		if (!(node instanceof HTMLTextAreaElement)) return;
		node.focus();
		node.select();
	}, [heldFile]);
	async function copy(text, label) {
		try {
			await navigator.clipboard.writeText(text);
			toast(label);
		} catch {
			toast("Couldn’t copy from this browser.");
		}
	}
	function onDownload() {
		const filename = `${exportBasename(project, direction)}.md`;
		const text = markdownOf(project, direction);
		if (window.parent === window) {
			toast(`Downloading ${filename}`);
			return;
		}
		const reveal = () => {
			setHeldFile(text);
			toast(`Can’t save a file from this preview. Select ${filename} below.`);
		};
		try {
			const write = navigator.clipboard?.writeText?.(text);
			if (!write) {
				reveal();
				return;
			}
			write.then(() => {
				setHeldFile(null);
				toast(`Copied ${filename}. Paste it if no file saved.`);
			}, reveal);
		} catch {
			reveal();
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "g-sheet-head",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "g-kicker",
						children: direction.canon ? "Design system" : "Direction"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display mt-1 text-2xl leading-none tracking-tight",
						children: direction.title
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "g-btn g-btn-quiet shrink-0 px-3",
					onClick: onClose,
					"aria-label": "Close system",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: `g-btn g-btn-ghost min-w-0 flex-1${direction.favorite ? " is-on" : ""}`,
					"aria-pressed": direction.favorite,
					onClick: onToggleFavorite,
					children: direction.favorite ? "Kept" : "Keep"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: `g-btn g-btn-ghost min-w-0 flex-1${direction.canon ? " is-on" : ""}`,
					"aria-pressed": direction.canon,
					onClick: onCanon,
					children: direction.canon ? "Clear system" : "Set system"
				})]
			}),
			notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "alert",
				className: "mt-3 text-sm",
				children: notice
			}) : null
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "g-sheet-body",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: direction.epithet
			}),
			parent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: relationTitle(direction.origin, parent.title)
			}) : null,
			kept.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "g-kicker mt-4",
				children: ["Kept from ", parent?.title ?? "the parent"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm",
				children: kept.map((id) => ASPECT_LABEL[id]).join(" · ")
			})] }) : null,
			changed.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "g-kicker mt-3",
				children: "Changed"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm",
				children: changed.map((id) => ASPECT_LABEL[id]).join(" · ")
			})] }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-col gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "g-kicker",
						children: "Branch"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "g-levels",
						role: "radiogroup",
						"aria-label": "How far to branch",
						children: LEVELS.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							role: "radio",
							"aria-checked": level === id,
							className: `g-chip${level === id ? " is-on" : ""}`,
							disabled: blocked,
							onClick: () => setLevel(id),
							children: LEVEL_META[id].label
						}, id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-pretty text-muted",
						children: meta.hint
					}),
					noteOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						id: "branch-note",
						className: "g-field",
						value: instruction,
						maxLength: 400,
						"aria-label": "Instruction",
						placeholder: level === "polish" ? "Harmonize the yellow." : "Optional. Steers only the aspects this level is allowed to change.",
						onChange: (event) => setInstruction(event.target.value)
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "g-btn g-btn-quiet px-0",
						disabled: blocked,
						onClick: () => setNoteOpen(true),
						children: "Add an instruction"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "g-btn g-btn-primary w-full",
						disabled: blocked,
						onClick: () => onBranch(level, instruction.trim()),
						children: pending ? "Drafting…" : meta.count === 1 ? "Polish this cut" : `${meta.label} into 3`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 text-pretty",
				children: direction.rationale
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Jump, {
						id: "g-palette",
						label: "Palette"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Jump, {
						id: "g-type",
						label: "Type"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Jump, {
						id: "g-guidelines",
						label: "Guidelines"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Jump, {
						id: "g-export",
						label: "Export"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display mt-6 text-xl tracking-tight",
				children: "Specimen"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "g-specimen mt-3",
				"data-density": direction.density,
				style: vars,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "g-spec-bar",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "g-spec-name",
							children: project.brief.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "g-spec-nav",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Work" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Notes" })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "g-spec-headline",
						children: direction.sampleHeadline
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "g-spec-copy",
						children: direction.sampleBody
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "g-spec-actions",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "g-spec-btn g-spec-btn-fill",
							children: direction.buttonLabel
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "g-spec-btn g-spec-btn-line",
							children: "Details"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "g-kit",
				style: vars,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "g-kit-piece",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "g-spec-meta",
							children: "Primary"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "g-spec-btn g-spec-btn-fill",
							children: direction.buttonLabel
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "g-kit-piece",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "g-spec-meta",
							children: "Secondary"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "g-spec-btn g-spec-btn-line",
							children: "Details"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "g-kit-piece",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "g-spec-meta",
							children: "Field"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "g-spec-input",
							children: "Write a note"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "g-kit-piece",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "g-spec-meta",
							children: "Surface"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "g-mono text-sm",
							style: { color: "var(--b-ink)" },
							children: "01"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: direction.wordmarkStyle
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "g-palette",
				className: "mt-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-xl tracking-tight",
						children: "Color palette"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted tabular-nums",
						children: [
							"Ink on canvas ",
							formatRatio(ink, canvas),
							" · Accent pair ",
							formatRatio(onAccent, accent)
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 grid grid-cols-4 gap-3",
						children: direction.palette.map((swatch) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "g-swatch",
								style: { background: swatch.hex },
								"aria-label": `${swatch.name} ${swatch.hex}. Copy hex.`,
								onClick: () => void copy(swatch.hex, `${swatch.hex} copied`)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted",
								children: ROLE_LABEL[swatch.role]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm",
								children: swatch.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs tabular-nums text-muted",
								children: swatch.hex
							})
						] }, swatch.role))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
						className: "mt-4 flex flex-col gap-3",
						children: direction.palette.map((swatch) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "g-kicker",
							children: ROLE_LABEL[swatch.role]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "mt-1 text-sm text-pretty",
							children: swatch.usage
						})] }, `${swatch.role}-use`))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "g-type",
				className: "mt-8",
				style: vars,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-xl tracking-tight",
						children: "Type"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "g-display mt-4 text-5xl leading-none",
						style: {
							fontFamily: "var(--b-display)",
							color: "var(--b-ink)"
						},
						children: "Aa"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm",
						children: direction.displayFont
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-base leading-relaxed",
						style: { fontFamily: "var(--b-body)" },
						children: direction.sampleBody
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: direction.bodyFont
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "g-mono mt-4 text-sm",
						style: { fontFamily: "var(--b-mono)" },
						children: "01  14.2  09:40"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: direction.monoFont
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-pretty text-sm",
						children: direction.typeNotes
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "mt-4 w-full text-left text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "text-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-1 font-medium",
									children: "Step"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-1 font-medium",
									children: "Size"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-1 font-medium",
									children: "Use"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-1",
									children: "Display"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-1 tabular-nums",
									children: "2.75rem"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-1",
									children: "Headlines"
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-1",
									children: "Title"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-1 tabular-nums",
									children: "1.5rem"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-1",
									children: "Sections"
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-1",
									children: "Body"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-1 tabular-nums",
									children: "1rem"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-1",
									children: "Reading"
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-1",
									children: "Label"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-1 tabular-nums",
									children: "0.75rem"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-1",
									children: "Tracked UI labels"
								})
							] })
						] })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "g-guidelines",
				className: "mt-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-xl tracking-tight",
						children: "Visual guidelines"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-4 flex flex-col gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Guide, {
								term: "Voice",
								text: direction.voice
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Guide, {
								term: "Imagery",
								text: direction.imagery
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Guide, {
								term: "Shape",
								text: direction.shape
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Guide, {
								term: "Motion",
								text: direction.motion
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Guide, {
								term: "Spacing",
								text: direction.spacing
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Guide, {
								term: "Interface",
								text: direction.uiNotes
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 grid gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "g-kicker",
							children: "Do"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 flex flex-col gap-1 text-sm",
							children: direction.dos.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: line }, line))
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "g-kicker",
							children: "Don’t"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 flex flex-col gap-1 text-sm",
							children: direction.donts.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: line }, line))
						})] })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "g-export",
				className: "mt-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-xl tracking-tight",
						children: "Export"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-pretty text-muted",
						children: [
							"CSS variables and a markdown design system for ",
							project.brief.name,
							" / ",
							direction.title,
							"."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "g-btn g-btn-primary",
								onClick: () => void copy(cssExport(project, direction), "CSS copied"),
								children: "Copy CSS"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "g-btn g-btn-ghost",
								onClick: () => void copy(markdownOf(project, direction), "Design system copied"),
								children: "Copy markdown"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								className: "g-btn g-btn-ghost inline-flex items-center justify-center no-underline",
								href: `data:text/markdown;charset=utf-8,${encodeURIComponent(markdownOf(project, direction))}`,
								download: `${exportBasename(project, direction)}.md`,
								onClick: onDownload,
								children: "Download"
							})
						]
					}),
					heldFile ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						id: "g-held-file",
						className: "g-field mt-3 font-mono text-xs",
						readOnly: true,
						rows: 8,
						value: heldFile,
						"aria-label": "Design system file",
						onFocus: (event) => event.currentTarget.select()
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "g-pre mt-3",
						children: cssExport(project, direction)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8",
				children: confirmRemove ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"Remove ",
							direction.title,
							" and its branches?"
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "g-btn g-btn-ghost",
							onClick: onRemove,
							children: "Remove"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "g-btn g-btn-quiet",
							onClick: () => setConfirmRemove(false),
							children: "Cancel"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "g-btn g-btn-quiet px-0",
					onClick: () => setConfirmRemove(true),
					children: "Remove this direction"
				})
			})
		]
	})] });
}
function Jump({ id, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: "text-ink underline underline-offset-4",
		onClick: () => document.getElementById(id)?.scrollIntoView({ block: "start" }),
		children: label
	});
}
function Guide({ term, text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "g-kicker",
		children: term
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: "mt-1 text-sm text-pretty",
		children: text
	})] });
}
var DIRECTION_CAP = 30;
function Studio() {
	const projects = useStudio((state) => state.projects);
	const directions = useStudio((state) => state.directions);
	const activeProjectId = useStudio((state) => state.activeProjectId);
	const selectedId = useStudio((state) => state.selectedId);
	const selectProject = useStudio((state) => state.selectProject);
	const selectDirection = useStudio((state) => state.selectDirection);
	const createProject = useStudio((state) => state.createProject);
	const updateBrief = useStudio((state) => state.updateBrief);
	const removeProject = useStudio((state) => state.removeProject);
	const addDirections = useStudio((state) => state.addDirections);
	const toggleFavorite = useStudio((state) => state.toggleFavorite);
	const setCanon = useStudio((state) => state.setCanon);
	const removeDirection = useStudio((state) => state.removeDirection);
	const [composer, setComposer] = (0, import_react.useState)("closed");
	const [pane, setPane] = (0, import_react.useState)("board");
	const [pending, setPending] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	const [ai, setAi] = (0, import_react.useState)(null);
	const lock = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		useStudio.persist.rehydrate();
		let live = true;
		aiAvailable().then((result) => {
			if (live) setAi(result.available);
		}).catch(() => {
			if (live) setAi(false);
		});
		return () => {
			live = false;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		const families = directions.flatMap((direction) => [
			direction.displayFont,
			direction.bodyFont,
			direction.monoFont
		]);
		const href = extraFontHref(families);
		if (!href) return;
		let link = document.getElementById("graft-fonts");
		if (!link) {
			link = document.createElement("link");
			link.id = "graft-fonts";
			link.rel = "stylesheet";
			document.head.appendChild(link);
		}
		if (link.getAttribute("href") !== href) link.setAttribute("href", href);
	}, [directions]);
	const project = projects.find((item) => item.id === activeProjectId) ?? (projects.length ? projects[0] : null);
	const mine = project ? directions.filter((direction) => direction.projectId === project.id) : [];
	const selected = mine.find((direction) => direction.id === selectedId) ?? null;
	const parent = selected?.parentId ? mine.find((direction) => direction.id === selected.parentId) : void 0;
	const favorites = mine.filter((direction) => direction.favorite);
	const canon = mine.find((direction) => direction.canon);
	const showBrief = !project || composer !== "closed";
	function openDirection(id) {
		selectDirection(id);
		setPane("system");
		setComposer("closed");
		setError("");
	}
	async function draft(brief, mode, source, instruction = "") {
		if (lock.current) return;
		if (!project && mode !== "seed") return;
		if (ai === false) {
			setError("AI drafting is not available in this session.");
			return;
		}
		const count = mode === "seed" ? 3 : LEVEL_META[mode].count;
		const projectId = mode === "seed" && composer === "new" ? null : project?.id;
		if ((projectId ? directions.filter((direction) => direction.projectId === projectId).length : 0) + count > DIRECTION_CAP) {
			setError("This brand has 30 directions. Remove a few before drafting more.");
			return;
		}
		setError("");
		lock.current = true;
		setPending({
			parentId: source?.id ?? null,
			count,
			label: mode === "seed" ? "Drafting a direction" : LEVEL_META[mode].pending
		});
		let nextProjectId = project?.id ?? "";
		if (mode === "seed" && composer === "new") {
			if (projects.length >= 12) {
				setPending(null);
				setError("Remove a brand before starting another.");
				lock.current = false;
				return;
			}
			nextProjectId = createProject(brief);
			setComposer("closed");
		}
		try {
			const result = await generateDirections({ data: {
				mode,
				brief,
				parent: source ? seedOf(source) : void 0,
				instruction
			} });
			if (!result.ok) {
				setError(result.error);
				toast(result.error);
				return;
			}
			addDirections(materialize(result.directions, result.lineage, nextProjectId, source?.id ?? null));
			setPane("board");
			toast(mode === "seed" ? "Three directions added" : LEVEL_META[mode].toast);
		} catch (caught) {
			const message = caught instanceof Error ? caught.message : "Drafting failed.";
			setError(message);
			toast(message);
		} finally {
			lock.current = false;
			setPending(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "g-shell",
		"data-pane": pane,
		"data-sheet": selected && !showBrief ? "open" : "closed",
		"data-composer": showBrief ? "open" : "closed",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				position: "bottom-center",
				toastOptions: { style: {
					background: "var(--color-sheet)",
					color: "var(--color-ink)",
					border: "1px solid var(--color-line)"
				} }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "g-mobile-bar",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "g-mark",
								"aria-hidden": "true"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-2xl leading-none tracking-tight",
								children: "Graft"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "g-btn g-btn-primary",
							onClick: () => {
								setComposer("new");
								setPane("board");
							},
							children: "New brand"
						})]
					}),
					projects.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "sr-only",
							children: "Brand"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: "g-field",
							value: project?.id ?? "",
							onChange: (event) => {
								selectProject(event.target.value);
								setComposer("closed");
								setPane("board");
							},
							children: projects.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: item.id,
								children: item.brief.name
							}, item.id))
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "g-tabs",
						role: "tablist",
						"aria-label": "Studio",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: `g-tab${pane === "board" ? " is-on" : ""}`,
							onClick: () => setPane("board"),
							children: "Board"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: `g-tab${pane === "system" ? " is-on" : ""}`,
							onClick: () => setPane("system"),
							children: "System"
						})]
					}),
					favorites.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2 overflow-x-auto",
						children: favorites.map((direction) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "g-btn g-btn-ghost shrink-0",
							onClick: () => openDirection(direction.id),
							children: direction.title
						}, direction.id))
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "g-side",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-4 pt-5 pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "g-mark",
								"aria-hidden": "true"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-3xl leading-none tracking-tight",
								children: "Graft"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-pretty text-muted",
							children: "Branch a brand until it holds."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "g-btn g-btn-primary w-full",
							onClick: () => {
								setComposer("new");
								setPane("board");
							},
							children: "New brand"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "g-side-scroll mt-4 px-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "g-kicker px-2",
								children: "Brands"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1",
								children: projects.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: `g-project${item.id === project?.id ? " is-active" : ""}`,
									onClick: () => {
										selectProject(item.id);
										setComposer("closed");
										setPane("board");
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: item.brief.name
									}), item.sample ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted",
										children: "Sample"
									}) : null]
								}, item.id))
							}),
							favorites.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "g-kicker mt-5 px-2",
								children: "Kept"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1",
								children: favorites.map((direction) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: `g-kept${direction.id === selected?.id ? " is-active" : ""}`,
									onClick: () => openDirection(direction.id),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: direction.title
									})
								}, direction.id))
							})] }) : null,
							canon ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "g-kicker mt-5 px-2",
								children: "System"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "g-kept",
								onClick: () => openDirection(canon.id),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: canon.title
								})
							})] }) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-6 px-2 pb-4 text-xs text-muted",
								children: ai == null ? "" : ai ? "Drafting with Grok" : "Drafting unavailable"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "g-main",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "g-board",
					children: [error && !selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						role: "alert",
						className: "mb-4 max-w-xl text-sm",
						children: error
					}) : null, showBrief ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BriefForm, {
						mode: project && composer === "edit" ? "edit" : "new",
						initial: composer === "edit" ? project?.brief : void 0,
						pending: pending != null,
						onCancel: project ? () => setComposer("closed") : void 0,
						onSave: project ? (brief) => {
							updateBrief(project.id, brief);
							setComposer("closed");
							toast("Brief saved");
						} : void 0,
						onDraft: (brief) => {
							if (composer === "edit" && project) {
								updateBrief(project.id, brief);
								setComposer("closed");
								draft(brief, "seed");
								return;
							}
							draft(brief, "seed");
						}
					}, composer === "edit" ? project?.id : "new") : project ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Board, {
						project,
						directions: mine,
						selectedId: selected?.id ?? null,
						pending,
						ai,
						onSelect: openDirection,
						onToggleFavorite: toggleFavorite,
						onEditBrief: () => setComposer("edit"),
						onDraftMore: () => void draft(project.brief, "seed"),
						onRemoveProject: () => {
							removeProject(project.id);
							setComposer("closed");
							setPane("board");
						}
					}) : null]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "g-sheet",
				"aria-label": "Design system",
				children: selected && project ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SystemSheet, {
					project,
					direction: selected,
					parent,
					pending: pending != null,
					ai,
					notice: error,
					onClose: () => {
						selectDirection(null);
						setPane("board");
					},
					onToggleFavorite: () => toggleFavorite(selected.id),
					onCanon: () => setCanon(selected.id),
					onBranch: (level, instruction) => void draft(project.brief, level, selected, instruction),
					onRemove: () => {
						removeDirection(selected.id);
						setPane("board");
					}
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "g-sheet-body",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "g-kicker",
							children: "Design system"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display mt-2 text-3xl tracking-tight",
							children: "Open a direction"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 max-w-sm text-pretty text-muted",
							children: "Choose a cut on the board to see its palette, type, and guidelines. Set one as the system when it holds."
						})
					]
				})
			})
		]
	});
}
function seedOf(direction) {
	const { id: _id, projectId: _projectId, parentId: _parentId, origin: _origin, createdAt: _createdAt, favorite: _favorite, canon: _canon, ...seed } = direction;
	return seed;
}
function materialize(seeds, lineage, projectId, parentId) {
	const now = Date.now();
	return seeds.map((seed, index) => {
		const mark = lineage[index];
		const origin = mark?.level ?? "seed";
		return {
			...seed,
			id: `dir_${crypto.randomUUID().slice(0, 8)}`,
			projectId,
			parentId,
			origin,
			kept: mark?.kept ?? [],
			changed: mark?.changed ?? [],
			createdAt: now + index,
			favorite: false,
			canon: false
		};
	});
}
var SplitComponent = Studio;
//#endregion
export { SplitComponent as component };
