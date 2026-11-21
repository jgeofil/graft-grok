import { useState, type ReactNode } from "react";
import { TRAITS, type Brief } from "@/lib/brand/model";

const empty: Brief = {
  name: "",
  category: "",
  audience: "",
  traits: [],
  avoid: "",
  notes: "",
};

export function BriefForm({
  initial,
  pending,
  mode,
  onCancel,
  onSave,
  onDraft,
}: {
  initial?: Brief;
  pending: boolean;
  mode: "new" | "edit";
  onCancel?: () => void;
  onSave?: (brief: Brief) => void;
  onDraft: (brief: Brief) => void;
}) {
  const [brief, setBrief] = useState<Brief>(initial ?? empty);
  const [error, setError] = useState("");

  function update<K extends keyof Brief>(key: K, value: Brief[K]) {
    setBrief((current) => ({ ...current, [key]: value }));
  }

  function toggleTrait(trait: string) {
    setBrief((current) => {
      const on = current.traits.includes(trait);
      if (on) return { ...current, traits: current.traits.filter((item) => item !== trait) };
      if (current.traits.length >= 4) return current;
      return { ...current, traits: [...current.traits, trait] };
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

  return (
    <form
      className="mx-auto flex max-w-xl flex-col gap-6"
      onSubmit={(event) => {
        event.preventDefault();
        if (!ready()) return;
        onDraft(brief);
      }}
    >
      <div>
        <p className="g-kicker">{mode === "new" ? "New brand" : "Brief"}</p>
        <h1 className="font-display mt-2 text-4xl leading-none tracking-tight">
          {mode === "new" ? "Start from a brief." : brief.name || "Edit the brief."}
        </h1>
        <p className="mt-3 max-w-md text-pretty text-muted">
          Three opening directions, different in color, type, and shape. Keep one, then branch it — closer levels leave more of the parent in place.
        </p>
      </div>

      <Field label="01  Name" hint="The word you’ll set as a wordmark.">
        <input
          className="g-field"
          value={brief.name}
          maxLength={60}
          autoComplete="off"
          placeholder="Keel"
          onChange={(event) => update("name", event.target.value)}
        />
      </Field>
      <Field label="02  What it is">
        <textarea
          className="g-field"
          value={brief.category}
          maxLength={200}
          placeholder="Hand instruments for coastal navigation."
          onChange={(event) => update("category", event.target.value)}
        />
      </Field>
      <Field label="03  Who it’s for">
        <input
          className="g-field"
          value={brief.audience}
          maxLength={160}
          placeholder="Skippers, and the people who buy gifts for them."
          onChange={(event) => update("audience", event.target.value)}
        />
      </Field>
      <fieldset>
        <legend className="g-kicker">04  Temperament</legend>
        <p className="mt-2 text-sm text-muted">Pick up to four.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {TRAITS.map((trait) => {
            const on = brief.traits.includes(trait);
            return (
              <button
                key={trait}
                type="button"
                className={`g-chip${on ? " is-on" : ""}`}
                aria-pressed={on}
                onClick={() => toggleTrait(trait)}
              >
                {trait}
              </button>
            );
          })}
        </div>
      </fieldset>
      <Field label="05  Keep away from">
        <input
          className="g-field"
          value={brief.avoid}
          maxLength={240}
          placeholder="Gold foil, anchor icons, stock sunsets."
          onChange={(event) => update("avoid", event.target.value)}
        />
      </Field>
      <Field label="06  Anything else">
        <textarea
          className="g-field"
          value={brief.notes}
          maxLength={500}
          placeholder="The object is the brand. Copy should sound used, not advertised."
          onChange={(event) => update("notes", event.target.value)}
        />
      </Field>

      {error ? (
        <p role="alert" className="text-sm">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button className="g-btn g-btn-primary" type="submit" disabled={pending}>
          {pending ? "Drafting three directions…" : mode === "edit" ? "Save and draft three" : "Draft three directions"}
        </button>
        {mode === "edit" && onSave ? (
          <button
            className="g-btn g-btn-ghost"
            type="button"
            disabled={pending}
            onClick={() => {
              if (!ready()) return;
              onSave(brief);
            }}
          >
            Save brief
          </button>
        ) : null}
        {onCancel ? (
          <button className="g-btn g-btn-quiet" type="button" disabled={pending} onClick={onCancel}>
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="g-kicker">{label}</span>
      {hint ? <span className="mt-1 block text-sm text-muted">{hint}</span> : null}
      <span className="mt-2 block">{children}</span>
    </label>
  );
}
