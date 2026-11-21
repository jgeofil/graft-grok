import { Star } from "lucide-react";
import { brandVars, columnsOf, type Direction, type Project } from "@/lib/brand/model";
import { relationLine } from "@/lib/brand/lineage";

export type PendingDraft = {
  parentId: string | null;
  count: number;
  label: string;
};

export function Board({
  project,
  directions,
  selectedId,
  pending,
  ai,
  onSelect,
  onToggleFavorite,
  onEditBrief,
  onDraftMore,
  onRemoveProject,
}: {
  project: Project;
  directions: Direction[];
  selectedId: string | null;
  pending: PendingDraft | null;
  ai: boolean | null;
  onSelect: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onEditBrief: () => void;
  onDraftMore: () => void;
  onRemoveProject: () => void;
}) {
  const columns = columnsOf(directions);
  const depthOf = new Map<string, number>();
  columns.forEach((column, depth) => {
    for (const direction of column) depthOf.set(direction.id, depth);
  });
  const pendingDepth =
    pending == null ? null : pending.parentId ? (depthOf.get(pending.parentId) ?? 0) + 1 : 0;
  const columnCount = Math.max(columns.length, pendingDepth == null ? 0 : pendingDepth + 1);
  const byId = new Map(directions.map((direction) => [direction.id, direction]));
  const order = [...directions].sort((a, b) => a.createdAt - b.createdAt);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="g-kicker">{project.sample ? "Studio sample" : "Brand"}</p>
          <h1 className="font-display mt-1 text-4xl leading-none tracking-tight">{project.brief.name}</h1>
          <p className="mt-3 max-w-xl text-pretty text-muted">{project.brief.category}</p>
          <p className="mt-1 text-sm text-muted">
            {[project.brief.audience ? `For ${project.brief.audience}` : "", project.brief.traits.join(" · ")]
              .filter(Boolean)
              .join("  ·  ")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="g-btn g-btn-ghost" type="button" onClick={onEditBrief}>
            Edit brief
          </button>
          <button className="g-btn g-btn-primary" type="button" disabled={pending != null || ai === false} onClick={onDraftMore}>
            {pending && !pending.parentId ? "Drafting…" : "New directions"}
          </button>
        </div>
      </header>

      {ai === false ? (
        <p className="max-w-xl text-sm text-muted">
          Generative drafting isn’t available in this session. You can still study the sample, keep favorites, and
          export a system.
        </p>
      ) : null}

      {directions.length === 0 && !pending ? (
        <div className="max-w-md rounded-2xl border border-line bg-sheet p-6">
          <h2 className="font-display text-2xl tracking-tight">No directions yet</h2>
          <p className="mt-2 text-pretty text-muted">
            Draft three opening cuts from this brief. They’ll land here as a lineage you can branch.
          </p>
          <button className="g-btn g-btn-primary mt-4" type="button" disabled={ai === false} onClick={onDraftMore}>
            Draft three directions
          </button>
        </div>
      ) : (
        <div className="g-cols">
          {Array.from({ length: columnCount }, (_, depth) => {
            const column = columns[depth] ?? [];
            return (
              <div className="g-col" key={depth}>
                <p className="g-kicker">{depth === 0 ? "Opening directions" : `Cut ${depth + 1}`}</p>
                {column.map((direction) => {
                  const parent = direction.parentId ? byId.get(direction.parentId) : undefined;
                  const index = order.findIndex((item) => item.id === direction.id) + 1;
                  return (
                    <article
                      key={direction.id}
                      className={`g-card${selectedId === direction.id ? " is-selected" : ""}`}
                      style={brandVars(direction)}
                    >
                      <button
                        type="button"
                        className={`g-card-star${direction.favorite ? " is-on" : ""}`}
                        aria-pressed={direction.favorite}
                        aria-label={direction.favorite ? `Unkeep ${direction.title}` : `Keep ${direction.title}`}
                        onClick={() => onToggleFavorite(direction.id)}
                      >
                        <Star className="size-4" fill={direction.favorite ? "currentColor" : "none"} />
                      </button>
                      <button type="button" className="g-card-hit" onClick={() => onSelect(direction.id)}>
                        <span className="g-mono text-xs opacity-70">{String(index).padStart(2, "0")}</span>
                        <span className="g-word mt-2 block pr-8">{project.brief.name}</span>
                        <span className="g-card-title mt-3 block">{direction.title}</span>
                        <span className="mt-1 block text-sm" style={{ color: "var(--b-muted)" }}>
                          {direction.epithet}
                        </span>
                        {parent ? (
                          <span className="mt-2 block text-xs" style={{ color: "var(--b-muted)" }}>
                            {relationLine(direction.origin, parent.title, direction.kept, direction.changed)}
                          </span>
                        ) : null}
                        <span className="g-stripe" aria-hidden="true">
                          {direction.palette.map((swatch) => (
                            <span key={swatch.role} style={{ background: swatch.hex }} />
                          ))}
                        </span>
                        <span className="mt-2 block text-xs" style={{ color: "var(--b-muted)" }}>
                          {direction.displayFont} · {direction.bodyFont}
                        </span>
                        {direction.canon ? (
                          <span className="mt-2 inline-block text-xs font-medium" style={{ color: "var(--b-accent)" }}>
                            Design system
                          </span>
                        ) : null}
                      </button>
                    </article>
                  );
                })}
                {pending && pendingDepth === depth
                  ? Array.from({ length: pending.count }, (_, index) => (
                      <article className="g-skel" key={index}>
                        <p className="text-sm">{pending.label}</p>
                        <div className="g-skel-bar" />
                      </article>
                    ))
                  : null}
              </div>
            );
          })}
        </div>
      )}

      <RemoveBrand name={project.brief.name} onRemove={onRemoveProject} />
    </div>
  );
}

function RemoveBrand({ name, onRemove }: { name: string; onRemove: () => void }) {
  return (
    <details className="max-w-md text-sm text-muted">
      <summary className="cursor-pointer">Remove {name}</summary>
      <p className="mt-2">This deletes the brief and every direction on this brand. It stays on this device only.</p>
      <button className="g-btn g-btn-ghost mt-3" type="button" onClick={onRemove}>
        Remove brand
      </button>
    </details>
  );
}
