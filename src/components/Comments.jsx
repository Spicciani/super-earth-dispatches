/* =====================================================================
   <Comments postId={id} session={session} />
   Blocco commenti sotto al dettaglio del post.
   - Tutti leggono; solo utenti loggati scrivono (form nascosto agli ospiti).
   - Bottoni emoji rapidi a tema Helldivers, inseriti nel testo con un tap.
   - Ognuno può cancellare solo i propri commenti (bottone visibile solo lì).
   ===================================================================== */
import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { fmtDate } from "../lib/helpers";

const QUICK_EMOJI = ["🦅", "🫡", "💥", "🔥", "☕", "💀"];

export default function Comments({ postId, session }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);

  const isAuth = !!session;
  const userId = session?.user?.id || null;

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    if (!error) setComments(data || []);
    setLoading(false);
  }, [postId]);

  useEffect(() => {
    load();
  }, [load]);

  async function add() {
    const text = body.trim();
    if (!text || !session) return;
    setBusy(true);
    try {
      const author_name = session.user.user_metadata?.display_name || "Helldiver";
      const { error } = await supabase.from("comments").insert({
        post_id: postId,
        author_id: session.user.id,
        author_name,
        body: text,
      });
      if (error) throw error;
      setBody("");
      await load();
    } catch (e) {
      alert("Errore invio comunicazione: " + (e.message || e));
    } finally {
      setBusy(false);
    }
  }

  async function remove(id) {
    if (!window.confirm("Eliminare questa comunicazione?")) return;
    const { error } = await supabase.from("comments").delete().eq("id", id);
    if (error) {
      alert("Errore: " + error.message);
      return;
    }
    setComments((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <section className="mt-8 border border-hazard/25 bg-anthracite se-scanlines">
      <div className="flex items-center justify-between border-b border-hazard/20 px-5 py-3">
        <span className="font-mono text-[11px] tracking-[0.2em] text-hazard">
          COMUNICAZIONI DAL FRONTE
        </span>
        <span className="font-mono text-[11px] text-bone/45">
          {loading ? "…" : comments.length}
        </span>
      </div>

      <div className="p-5">
        {/* lista */}
        {loading ? (
          <p className="font-mono text-[11px] tracking-[0.2em] text-bone/40">&gt; RICEZIONE IN CORSO…</p>
        ) : comments.length === 0 ? (
          <p className="font-mono text-[11px] leading-relaxed text-bone/40">
            &gt; Nessuna comunicazione. Rompi il silenzio radio, soldato.
          </p>
        ) : (
          <ul className="space-y-4">
            {comments.map((c) => (
              <li key={c.id} className="border-l-2 border-hazard/40 pl-4">
                <div className="mb-1 flex items-center gap-2 font-mono text-[11px] leading-none">
                  <span className="text-hazard">▸</span>
                  <span className="text-bone/85">{c.author_name}</span>
                  <span className="text-bone/25">/</span>
                  <span className="text-bone/45">{fmtDate(c.created_at)}</span>
                  {userId === c.author_id && (
                    <button
                      type="button"
                      onClick={() => remove(c.id)}
                      className="ml-auto font-mono text-[10px] tracking-[0.15em] text-bone/35 transition hover:text-alarm"
                      title="Elimina"
                    >
                      ✕ ELIMINA
                    </button>
                  )}
                </div>
                <p className="whitespace-pre-line text-sm leading-relaxed text-bone/80">{c.body}</p>
              </li>
            ))}
          </ul>
        )}

        {/* form (solo loggati) */}
        <div className="mt-6 border-t border-bone/10 pt-5">
          {isAuth ? (
            <div>
              {/* reazioni rapide a tema */}
              <div className="mb-2 flex flex-wrap gap-1">
                {QUICK_EMOJI.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setBody((b) => b + e)}
                    className="border border-hazard/25 px-2 py-1 text-base leading-none transition hover:border-hazard hover:bg-hazard/10"
                    aria-label={"Inserisci " + e}
                  >
                    {e}
                  </button>
                ))}
              </div>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Trasmetti un messaggio, soldato..."
                className="min-h-[80px] w-full resize-y border border-hazard/30 bg-ink px-3 py-3 font-mono text-sm leading-relaxed text-bone placeholder-bone/25 outline-none focus:border-hazard"
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={add}
                  disabled={busy || !body.trim()}
                  className="border-2 border-hazard bg-hazard px-4 py-2 font-mono text-[11px] font-bold tracking-[0.2em] text-ink transition hover:bg-alarm hover:border-alarm hover:text-bone disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {busy ? "▶ INVIO…" : "▶ TRASMETTI"}
                </button>
              </div>
            </div>
          ) : (
            <p className="font-mono text-[11px] tracking-[0.15em] text-bone/40">
              &gt; ACCESSO RICHIESTO PER TRASMETTERE. Solo il personale autorizzato può commentare.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
