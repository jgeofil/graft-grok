import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import {
  ASPECT_LABEL,
  ROLE_LABEL,
  brandVars,
  colorOf,
  formatRatio,
  type Direction,
  type Project,
} from "@/lib/brand/model";
import { LEVELS, LEVEL_META, relationTitle, type Level } from "@/lib/brand/lineage";
import { cssExport, exportBasename, markdownOf } from "@/lib/brand/export";

export function SystemSheet({
  project,
  direction,
  parent,
  pending,
  ai,
  notice,
  onClose,
  onToggleFavorite,
  onCanon,
  onBranch,
  onRemove,
}: {
  project: Project;
  direction: Direction;
  parent?: Direction;
  pending: boolean;
  ai: boolean | null;
  notice: string;
  onClose: () => void;
  onToggleFavorite: () => void;
  onCanon: () => void;
  onBranch: (level: Level, instruction: string) => void;
  onRemove: () => void;
}) {
  const [level, setLevel] = useState<Level>("siblings");
  const [noteOpen, setNoteOpen] = useState(false);
  const [instruction, setInstruction] = useState("");
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [heldFile, setHeldFile] = useState<string | null>(null);
  const vars = brandVars(direction);
  const ink = colorOf(direction, "ink").hex;
  const canvas = colorOf(direction, "canvas").hex;
  const accent = colorOf(direction, "accent").hex;
  const onAccent = colorOf(direction, "onAccent").hex;
  const blocked = pending || ai === false;
  const meta = LEVEL_META[level];
  const kept = direction.kept ?? [];
  const changed = direction.changed ?? [];

  useEffect(() => {
    setInstruction("");
    setNoteOpen(false);
    setConfirmRemove(false);
    setHeldFile(null);
  }, [direction.id]);

  useEffect(() => {
    if (!heldFile) return;
    const node = document.getElementById("g-held-file");
    if (!(node instanceof HTMLTextAreaElement)) return;
    node.focus();
    node.select();
  }, [heldFile]);

  async function copy(text: string, label: string) {
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
      void write.then(
        () => {
          setHeldFile(null);
          toast(`Copied ${filename}. Paste it if no file saved.`);
        },
        reveal,
      );
    } catch {
      reveal();
    }
  }

  return (
    <>
      <header className="g-sheet-head">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="g-kicker">{direction.canon ? "Design system" : "Direction"}</p>
            <h2 className="font-display mt-1 text-2xl leading-none tracking-tight">{direction.title}</h2>
          </div>
          <button type="button" className="g-btn g-btn-quiet shrink-0 px-3" onClick={onClose} aria-label="Close system">
            <X className="size-4" />
          </button>
        </div>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            className={`g-btn g-btn-ghost min-w-0 flex-1${direction.favorite ? " is-on" : ""}`}
            aria-pressed={direction.favorite}
            onClick={onToggleFavorite}
          >
            {direction.favorite ? "Kept" : "Keep"}
          </button>
          <button
            type="button"
            className={`g-btn g-btn-ghost min-w-0 flex-1${direction.canon ? " is-on" : ""}`}
            aria-pressed={direction.canon}
            onClick={onCanon}
          >
            {direction.canon ? "Clear system" : "Set system"}
          </button>
        </div>
        {notice ? (
          <p role="alert" className="mt-3 text-sm">
            {notice}
          </p>
        ) : null}
      </header>
      <div className="g-sheet-body">
        <p className="text-sm text-muted">{direction.epithet}</p>
        {parent ? (
          <p className="mt-1 text-sm text-muted">{relationTitle(direction.origin, parent.title)}</p>
        ) : null}
        {kept.length > 0 ? (
          <>
            <p className="g-kicker mt-4">Kept from {parent?.title ?? "the parent"}</p>
            <p className="mt-1 text-sm">{kept.map((id) => ASPECT_LABEL[id]).join(" · ")}</p>
          </>
        ) : null}
        {changed.length > 0 ? (
          <>
            <p className="g-kicker mt-3">Changed</p>
            <p className="mt-1 text-sm">{changed.map((id) => ASPECT_LABEL[id]).join(" · ")}</p>
          </>
        ) : null}

        <div className="mt-5 flex flex-col gap-2">
          <p className="g-kicker">Branch</p>
          <div className="g-levels" role="radiogroup" aria-label="How far to branch">
            {LEVELS.map((id) => (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={level === id}
                className={`g-chip${level === id ? " is-on" : ""}`}
                disabled={blocked}
                onClick={() => setLevel(id)}
              >
                {LEVEL_META[id].label}
              </button>
            ))}
          </div>
          <p className="text-sm text-pretty text-muted">{meta.hint}</p>
          {noteOpen ? (
            <textarea
              id="branch-note"
              className="g-field"
              value={instruction}
              maxLength={400}
              aria-label="Instruction"
              placeholder={level === "polish" ? "Harmonize the yellow." : "Optional. Steers only the aspects this level is allowed to change."}
              onChange={(event) => setInstruction(event.target.value)}
            />
          ) : (
            <button type="button" className="g-btn g-btn-quiet px-0" disabled={blocked} onClick={() => setNoteOpen(true)}>
              Add an instruction
            </button>
          )}
          <button
            type="button"
            className="g-btn g-btn-primary w-full"
            disabled={blocked}
            onClick={() => onBranch(level, instruction.trim())}
          >
            {pending ? "Drafting…" : meta.count === 1 ? "Polish this cut" : `${meta.label} into 3`}
          </button>
        </div>

        <p className="mt-5 text-pretty">{direction.rationale}</p>

        <nav className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          <Jump id="g-palette" label="Palette" />
          <Jump id="g-type" label="Type" />
          <Jump id="g-guidelines" label="Guidelines" />
          <Jump id="g-export" label="Export" />
        </nav>

        <h3 className="font-display mt-6 text-xl tracking-tight">Specimen</h3>
        <article className="g-specimen mt-3" data-density={direction.density} style={vars}>
          <div className="g-spec-bar">
            <span className="g-spec-name">{project.brief.name}</span>
            <span className="g-spec-nav">
              <span>Work</span>
              <span>Notes</span>
            </span>
          </div>
          <h4 className="g-spec-headline">{direction.sampleHeadline}</h4>
          <p className="g-spec-copy">{direction.sampleBody}</p>
          <div className="g-spec-actions">
            <span className="g-spec-btn g-spec-btn-fill">{direction.buttonLabel}</span>
            <span className="g-spec-btn g-spec-btn-line">Details</span>
          </div>
        </article>
        <div className="g-kit" style={vars}>
          <div className="g-kit-piece">
            <span className="g-spec-meta">Primary</span>
            <span className="g-spec-btn g-spec-btn-fill">{direction.buttonLabel}</span>
          </div>
          <div className="g-kit-piece">
            <span className="g-spec-meta">Secondary</span>
            <span className="g-spec-btn g-spec-btn-line">Details</span>
          </div>
          <div className="g-kit-piece">
            <span className="g-spec-meta">Field</span>
            <span className="g-spec-input">Write a note</span>
          </div>
          <div className="g-kit-piece">
            <span className="g-spec-meta">Surface</span>
            <span className="g-mono text-sm" style={{ color: "var(--b-ink)" }}>
              01
            </span>
          </div>
        </div>
        <p className="mt-2 text-sm text-muted">{direction.wordmarkStyle}</p>

        <section id="g-palette" className="mt-8">
          <h3 className="font-display text-xl tracking-tight">Color palette</h3>
          <p className="mt-2 text-sm text-muted tabular-nums">
            Ink on canvas {formatRatio(ink, canvas)} · Accent pair {formatRatio(onAccent, accent)}
          </p>
          <ul className="mt-4 grid grid-cols-4 gap-3">
            {direction.palette.map((swatch) => (
              <li key={swatch.role}>
                <button
                  type="button"
                  className="g-swatch"
                  style={{ background: swatch.hex }}
                  aria-label={`${swatch.name} ${swatch.hex}. Copy hex.`}
                  onClick={() => void copy(swatch.hex, `${swatch.hex} copied`)}
                />
                <p className="mt-1 text-xs text-muted">{ROLE_LABEL[swatch.role]}</p>
                <p className="text-sm">{swatch.name}</p>
                <p className="text-xs tabular-nums text-muted">{swatch.hex}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-4 flex flex-col gap-3">
            {direction.palette.map((swatch) => (
              <div key={`${swatch.role}-use`}>
                <dt className="g-kicker">{ROLE_LABEL[swatch.role]}</dt>
                <dd className="mt-1 text-sm text-pretty">{swatch.usage}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="g-type" className="mt-8" style={vars}>
          <h3 className="font-display text-xl tracking-tight">Type</h3>
          <p className="g-display mt-4 text-5xl leading-none" style={{ fontFamily: "var(--b-display)", color: "var(--b-ink)" }}>
            Aa
          </p>
          <p className="mt-2 text-sm">{direction.displayFont}</p>
          <p className="mt-4 text-base leading-relaxed" style={{ fontFamily: "var(--b-body)" }}>
            {direction.sampleBody}
          </p>
          <p className="mt-1 text-sm text-muted">{direction.bodyFont}</p>
          <p className="g-mono mt-4 text-sm" style={{ fontFamily: "var(--b-mono)" }}>
            01  14.2  09:40
          </p>
          <p className="mt-1 text-sm text-muted">{direction.monoFont}</p>
          <p className="mt-4 text-pretty text-sm">{direction.typeNotes}</p>
          <table className="mt-4 w-full text-left text-sm">
            <thead className="text-muted">
              <tr>
                <th className="py-1 font-medium">Step</th>
                <th className="py-1 font-medium">Size</th>
                <th className="py-1 font-medium">Use</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-1">Display</td>
                <td className="py-1 tabular-nums">2.75rem</td>
                <td className="py-1">Headlines</td>
              </tr>
              <tr>
                <td className="py-1">Title</td>
                <td className="py-1 tabular-nums">1.5rem</td>
                <td className="py-1">Sections</td>
              </tr>
              <tr>
                <td className="py-1">Body</td>
                <td className="py-1 tabular-nums">1rem</td>
                <td className="py-1">Reading</td>
              </tr>
              <tr>
                <td className="py-1">Label</td>
                <td className="py-1 tabular-nums">0.75rem</td>
                <td className="py-1">Tracked UI labels</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section id="g-guidelines" className="mt-8">
          <h3 className="font-display text-xl tracking-tight">Visual guidelines</h3>
          <dl className="mt-4 flex flex-col gap-4">
            <Guide term="Voice" text={direction.voice} />
            <Guide term="Imagery" text={direction.imagery} />
            <Guide term="Shape" text={direction.shape} />
            <Guide term="Motion" text={direction.motion} />
            <Guide term="Spacing" text={direction.spacing} />
            <Guide term="Interface" text={direction.uiNotes} />
          </dl>
          <div className="mt-5 grid gap-4">
            <div>
              <h4 className="g-kicker">Do</h4>
              <ul className="mt-2 flex flex-col gap-1 text-sm">
                {direction.dos.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="g-kicker">Don’t</h4>
              <ul className="mt-2 flex flex-col gap-1 text-sm">
                {direction.donts.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="g-export" className="mt-8">
          <h3 className="font-display text-xl tracking-tight">Export</h3>
          <p className="mt-2 text-sm text-pretty text-muted">
            CSS variables and a markdown design system for {project.brief.name} / {direction.title}.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className="g-btn g-btn-primary"
              onClick={() => void copy(cssExport(project, direction), "CSS copied")}
            >
              Copy CSS
            </button>
            <button
              type="button"
              className="g-btn g-btn-ghost"
              onClick={() => void copy(markdownOf(project, direction), "Design system copied")}
            >
              Copy markdown
            </button>
            <a
              className="g-btn g-btn-ghost inline-flex items-center justify-center no-underline"
              href={`data:text/markdown;charset=utf-8,${encodeURIComponent(markdownOf(project, direction))}`}
              download={`${exportBasename(project, direction)}.md`}
              onClick={onDownload}
            >
              Download
            </a>
          </div>
          {heldFile ? (
            <textarea
              id="g-held-file"
              className="g-field mt-3 font-mono text-xs"
              readOnly
              rows={8}
              value={heldFile}
              aria-label="Design system file"
              onFocus={(event) => event.currentTarget.select()}
            />
          ) : null}
          <pre className="g-pre mt-3">{cssExport(project, direction)}</pre>
        </section>

        <div className="mt-8">
          {confirmRemove ? (
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span>Remove {direction.title} and its branches?</span>
              <button type="button" className="g-btn g-btn-ghost" onClick={onRemove}>
                Remove
              </button>
              <button type="button" className="g-btn g-btn-quiet" onClick={() => setConfirmRemove(false)}>
                Cancel
              </button>
            </div>
          ) : (
            <button type="button" className="g-btn g-btn-quiet px-0" onClick={() => setConfirmRemove(true)}>
              Remove this direction
            </button>
          )}
        </div>
      </div>
    </>
  );
}

function Jump({ id, label }: { id: string; label: string }) {
  return (
    <button
      type="button"
      className="text-ink underline underline-offset-4"
      onClick={() => document.getElementById(id)?.scrollIntoView({ block: "start" })}
    >
      {label}
    </button>
  );
}

function Guide({ term, text }: { term: string; text: string }) {
  return (
    <div>
      <dt className="g-kicker">{term}</dt>
      <dd className="mt-1 text-sm text-pretty">{text}</dd>
    </div>
  );
}
