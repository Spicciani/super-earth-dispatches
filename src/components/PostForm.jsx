/* =====================================================================
   <PostForm onSubmit={fn} busy={bool} />  — "INVIA RAPPORTO" (solo loggati)
   Selettore di type (photo/story/reel) che mostra solo i campi
   pertinenti. onSubmit riceve un oggetto con SOLO i campi del type:
     - photo : { type, title, file }   <- File reale da caricare
     - story : { type, title, body }
     - reel  : { type, title, reel_url }
   ===================================================================== */
import React, { useState } from "react";

const TYPES = [
  { key: "photo", label: "FOTO" },
  { key: "story", label: "RACCONTO" },
  { key: "reel", label: "REEL" },
];

function Label({ children }) {
  return <span className="mb-1 block font-mono text-[11px] tracking-[0.2em] text-hazard/80">{children}</span>;
}

const inputCls =
  "w-full border border-hazard/30 bg-ink px-3 py-3 font-mono text-sm text-bone placeholder-bone/25 outline-none focus:border-hazard";

export default function PostForm({ onSubmit, busy }) {
  const [type, setType] = useState("photo");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [reelUrl, setReelUrl] = useState("");
  const [file, setFile] = useState(null);

  function reset() {
    setTitle("");
    setBody("");
    setReelUrl("");
    setFile(null);
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Costruisce l'oggetto con SOLO i campi pertinenti al type scelto.
    const payload = { type, title: title.trim() || null };
    if (type === "photo") {
      payload.file = file; // File reale -> caricato su Supabase Storage
    } else if (type === "story") {
      payload.body = body.trim() || null;
    } else if (type === "reel") {
      payload.reel_url = reelUrl.trim() || null;
    }
    onSubmit && onSubmit(payload);
    reset();
  }

  const photoMissing = type === "photo" && !file;

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="border border-hazard/40 bg-anthracite se-scanlines">
        <div className="flex items-center justify-between border-b border-hazard/30 bg-ink px-4 py-3">
          <h2 className="font-stencil text-xl text-hazard">INVIA RAPPORTO</h2>
          <span className="font-mono text-[10px] tracking-[0.2em] text-alarm">CLASSIFICATO</span>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-7">
          {/* selettore type segmentato */}
          <Label>TIPO DI DISPACCIO</Label>
          <div className="mb-6 grid grid-cols-3 gap-1 border border-hazard/25 p-1">
            {TYPES.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setType(t.key)}
                className={`py-2 font-mono text-[11px] font-bold tracking-[0.15em] transition ${
                  type === t.key ? "bg-hazard text-ink" : "text-bone/60 hover:bg-bone/5"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* campo title (comune a tutti) */}
          <div className="mb-5">
            <Label>TITOLO</Label>
            <input
              className={inputCls}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Es. SBARCO SU MALEVELON CREEK"
            />
          </div>

          {/* campi condizionali */}
          {type === "photo" && (
            <div className="mb-5">
              <Label>IMMAGINE</Label>
              <label className="flex cursor-pointer items-center justify-between border border-dashed border-hazard/40 bg-ink px-3 py-4 transition hover:border-hazard">
                <span className="truncate font-mono text-xs text-bone/60">
                  {file ? file.name : "▲ SELEZIONA FILE IMMAGINE"}
                </span>
                <span className="ml-3 shrink-0 border border-hazard/50 px-2 py-1 font-mono text-[10px] tracking-[0.15em] text-hazard">SFOGLIA</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                />
              </label>
              <p className="mt-1 font-mono text-[10px] text-bone/30">&gt; L'immagine viene compressa prima dell'upload.</p>
            </div>
          )}

          {type === "story" && (
            <div className="mb-5">
              <Label>RACCONTO</Label>
              <textarea
                className={inputCls + " min-h-[160px] resize-y leading-relaxed"}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Descrivi la missione, soldato..."
              />
            </div>
          )}

          {type === "reel" && (
            <div className="mb-5">
              <Label>URL DEL REEL</Label>
              <input
                className={inputCls}
                value={reelUrl}
                onChange={(e) => setReelUrl(e.target.value)}
                placeholder="https://youtube.com/... · tiktok.com/... · instagram.com/..."
              />
              <p className="mt-1 font-mono text-[10px] text-bone/30">&gt; Solo link. Nessun video incorporato.</p>
            </div>
          )}

          <button
            type="submit"
            disabled={busy || photoMissing}
            className="mt-2 flex w-full items-center justify-center gap-2 border-2 border-hazard bg-hazard py-3 font-mono text-sm font-bold tracking-[0.2em] text-ink transition hover:bg-alarm hover:border-alarm hover:text-bone disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "▶ TRASMISSIONE IN CORSO…" : "▶ TRASMETTI DISPACCIO"}
          </button>
        </form>
      </div>
    </div>
  );
}
