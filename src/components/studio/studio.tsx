import { useEffect, useRef, useState } from "react";
import { Toaster, toast } from "sonner";
import { extraFontHref, type Brief, type Direction, type DirectionSeed, type Origin } from "@/lib/brand/model";
import { aiAvailable, generateDirections } from "@/lib/brand/generate";
import { LEVEL_META, type Level, type LineageMark } from "@/lib/brand/lineage";
import { useStudio } from "@/lib/brand/store";
import { BriefForm } from "@/components/studio/brief-form";
import { Board, type PendingDraft } from "@/components/studio/board";
import { SystemSheet } from "@/components/studio/system-sheet";

const DIRECTION_CAP = 30;

export function Studio() {
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

  const [composer, setComposer] = useState<"closed" | "new" | "edit">("closed");
  const [pane, setPane] = useState<"board" | "system">("board");
  const [pending, setPending] = useState<PendingDraft | null>(null);
  const [error, setError] = useState("");
  const [ai, setAi] = useState<boolean | null>(null);
  const lock = useRef(false);

  useEffect(() => {
    void useStudio.persist.rehydrate();
    let live = true;
    aiAvailable()
      .then((result) => {
        if (live) setAi(result.available);
      })
      .catch(() => {
        if (live) setAi(false);
      });
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    const families = directions.flatMap((direction) => [
      direction.displayFont,
      direction.bodyFont,
      direction.monoFont,
    ]);
    const href = extraFontHref(families);
    if (!href) return;
    let link = document.getElementById("graft-fonts") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.id = "graft-fonts";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    if (link.getAttribute("href") !== href) link.setAttribute("href", href);
  }, [directions]);

  const project =
    projects.find((item) => item.id === activeProjectId) ?? (projects.length ? projects[0] : null);
  const mine = project ? directions.filter((direction) => direction.projectId === project.id) : [];
  const selected = mine.find((direction) => direction.id === selectedId) ?? null;
  const parent = selected?.parentId ? mine.find((direction) => direction.id === selected.parentId) : undefined;
  const favorites = mine.filter((direction) => direction.favorite);
  const canon = mine.find((direction) => direction.canon);
  const showBrief = !project || composer !== "closed";

  function openDirection(id: string) {
    selectDirection(id);
    setPane("system");
    setComposer("closed");
    setError("");
  }

  async function draft(brief: Brief, mode: "seed" | Level, source?: Direction, instruction = "") {
    if (lock.current) return;
    if (!project && mode !== "seed") return;
    if (ai === false) {
      setError("AI drafting is not available in this session.");
      return;
    }
    const count = mode === "seed" ? 3 : LEVEL_META[mode].count;
    const projectId = mode === "seed" && composer === "new" ? null : project?.id;
    const existing = projectId ? directions.filter((direction) => direction.projectId === projectId).length : 0;
    if (existing + count > DIRECTION_CAP) {
      setError("This brand has 30 directions. Remove a few before drafting more.");
      return;
    }
    setError("");
    lock.current = true;
    setPending({
      parentId: source?.id ?? null,
      count,
      label: mode === "seed" ? "Drafting a direction" : LEVEL_META[mode].pending,
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
      const parentSeed: DirectionSeed | undefined = source ? seedOf(source) : undefined;
      const result = await generateDirections({
        data: {
          mode,
          brief,
          parent: parentSeed,
          instruction,
        },
      });
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

  return (
    <div
      className="g-shell"
      data-pane={pane}
      data-sheet={selected && !showBrief ? "open" : "closed"}
      data-composer={showBrief ? "open" : "closed"}
    >
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "var(--color-sheet)",
            color: "var(--color-ink)",
            border: "1px solid var(--color-line)",
          },
        }}
      />
      <header className="g-mobile-bar">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="g-mark" aria-hidden="true" />
            <span className="font-display text-2xl leading-none tracking-tight">Graft</span>
          </div>
          <button
            type="button"
            className="g-btn g-btn-primary"
            onClick={() => {
              setComposer("new");
              setPane("board");
            }}
          >
            New brand
          </button>
        </div>
        {projects.length > 0 ? (
          <label className="block text-sm">
            <span className="sr-only">Brand</span>
            <select
              className="g-field"
              value={project?.id ?? ""}
              onChange={(event) => {
                selectProject(event.target.value);
                setComposer("closed");
                setPane("board");
              }}
            >
              {projects.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.brief.name}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <div className="g-tabs" role="tablist" aria-label="Studio">
          <button
            type="button"
            className={`g-tab${pane === "board" ? " is-on" : ""}`}
            onClick={() => setPane("board")}
          >
            Board
          </button>
          <button
            type="button"
            className={`g-tab${pane === "system" ? " is-on" : ""}`}
            onClick={() => setPane("system")}
          >
            System
          </button>
        </div>
        {favorites.length > 0 ? (
          <div className="flex gap-2 overflow-x-auto">
            {favorites.map((direction) => (
              <button
                key={direction.id}
                type="button"
                className="g-btn g-btn-ghost shrink-0"
                onClick={() => openDirection(direction.id)}
              >
                {direction.title}
              </button>
            ))}
          </div>
        ) : null}
      </header>

      <aside className="g-side">
        <div className="px-4 pt-5 pb-3">
          <div className="flex items-center gap-2">
            <span className="g-mark" aria-hidden="true" />
            <span className="font-display text-3xl leading-none tracking-tight">Graft</span>
          </div>
          <p className="mt-2 text-sm text-pretty text-muted">Branch a brand until it holds.</p>
        </div>
        <div className="px-3">
          <button
            type="button"
            className="g-btn g-btn-primary w-full"
            onClick={() => {
              setComposer("new");
              setPane("board");
            }}
          >
            New brand
          </button>
        </div>
        <div className="g-side-scroll mt-4 px-2">
          <p className="g-kicker px-2">Brands</p>
          <div className="mt-1">
            {projects.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`g-project${item.id === project?.id ? " is-active" : ""}`}
                onClick={() => {
                  selectProject(item.id);
                  setComposer("closed");
                  setPane("board");
                }}
              >
                <span className="truncate">{item.brief.name}</span>
                {item.sample ? <span className="text-xs text-muted">Sample</span> : null}
              </button>
            ))}
          </div>
          {favorites.length > 0 ? (
            <>
              <p className="g-kicker mt-5 px-2">Kept</p>
              <div className="mt-1">
                {favorites.map((direction) => (
                  <button
                    key={direction.id}
                    type="button"
                    className={`g-kept${direction.id === selected?.id ? " is-active" : ""}`}
                    onClick={() => openDirection(direction.id)}
                  >
                    <span className="truncate">{direction.title}</span>
                  </button>
                ))}
              </div>
            </>
          ) : null}
          {canon ? (
            <>
              <p className="g-kicker mt-5 px-2">System</p>
              <button type="button" className="g-kept" onClick={() => openDirection(canon.id)}>
                <span className="truncate">{canon.title}</span>
              </button>
            </>
          ) : null}
          <p className="mt-6 px-2 pb-4 text-xs text-muted">
            {ai == null ? "" : ai ? "Drafting with Grok" : "Drafting unavailable"}
          </p>
        </div>
      </aside>

      <section className="g-main">
        <div className="g-board">
          {error && !selected ? (
            <p role="alert" className="mb-4 max-w-xl text-sm">
              {error}
            </p>
          ) : null}
          {showBrief ? (
            <BriefForm
              key={composer === "edit" ? project?.id : "new"}
              mode={project && composer === "edit" ? "edit" : "new"}
              initial={composer === "edit" ? project?.brief : undefined}
              pending={pending != null}
              onCancel={project ? () => setComposer("closed") : undefined}
              onSave={
                project
                  ? (brief) => {
                      updateBrief(project.id, brief);
                      setComposer("closed");
                      toast("Brief saved");
                    }
                  : undefined
              }
              onDraft={(brief) => {
                if (composer === "edit" && project) {
                  updateBrief(project.id, brief);
                  setComposer("closed");
                  void draft(brief, "seed");
                  return;
                }
                void draft(brief, "seed");
              }}
            />
          ) : project ? (
            <Board
              project={project}
              directions={mine}
              selectedId={selected?.id ?? null}
              pending={pending}
              ai={ai}
              onSelect={openDirection}
              onToggleFavorite={toggleFavorite}
              onEditBrief={() => setComposer("edit")}
              onDraftMore={() => void draft(project.brief, "seed")}
              onRemoveProject={() => {
                removeProject(project.id);
                setComposer("closed");
                setPane("board");
              }}
            />
          ) : null}
        </div>
      </section>

      <section className="g-sheet" aria-label="Design system">
        {selected && project ? (
          <SystemSheet
            project={project}
            direction={selected}
            parent={parent}
            pending={pending != null}
            ai={ai}
            notice={error}
            onClose={() => {
              selectDirection(null);
              setPane("board");
            }}
            onToggleFavorite={() => toggleFavorite(selected.id)}
            onCanon={() => setCanon(selected.id)}
            onBranch={(level, instruction) => void draft(project.brief, level, selected, instruction)}
            onRemove={() => {
              removeDirection(selected.id);
              setPane("board");
            }}
          />
        ) : (
          <div className="g-sheet-body">
            <p className="g-kicker">Design system</p>
            <h2 className="font-display mt-2 text-3xl tracking-tight">Open a direction</h2>
            <p className="mt-3 max-w-sm text-pretty text-muted">
              Choose a cut on the board to see its palette, type, and guidelines. Set one as the system when it holds.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function seedOf(direction: Direction): DirectionSeed {
  const {
    id: _id,
    projectId: _projectId,
    parentId: _parentId,
    origin: _origin,
    createdAt: _createdAt,
    favorite: _favorite,
    canon: _canon,
    ...seed
  } = direction;
  return seed;
}

function materialize(
  seeds: DirectionSeed[],
  lineage: LineageMark[],
  projectId: string,
  parentId: string | null,
): Direction[] {
  const now = Date.now();
  return seeds.map((seed, index) => {
    const mark = lineage[index];
    const origin: Origin = mark?.level ?? "seed";
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
      canon: false,
    };
  });
}
