/* =====================================================================
   <App /> — applicazione reale, collegata a Supabase.
   Sostituisce l'orchestrazione mock della demo:
     - MOCK_POSTS      -> fetch da tabella `posts`
     - handleLogin     -> supabase.auth.signInWithPassword
     - handleLogout    -> supabase.auth.signOut
     - handleCreate    -> upload su Storage (foto) + insert riga
   La UI (schermate, card, form) è quella prodotta da Claude Design.
   ===================================================================== */
import React, { useState, useEffect, useCallback } from "react";
import { supabase, PHOTO_BUCKET } from "./lib/supabase";
import { fmtDate, TYPE_LABEL } from "./lib/helpers";
import { compressImage } from "./lib/image";
import { parseReel } from "./lib/reels";
import Layout from "./components/Layout";
import PostGrid from "./components/PostGrid";
import PostForm from "./components/PostForm";
import LoginForm from "./components/LoginForm";

/* Converte una riga del DB nella forma attesa dai componenti:
   il DB salva image_path, ma la UI vuole image_url (URL pubblico). */
function toView(row) {
  let image_url = null;
  if (row.type === "photo" && row.image_path) {
    image_url = supabase.storage.from(PHOTO_BUCKET).getPublicUrl(row.image_path).data.publicUrl;
  }
  return { ...row, image_url };
}

/* ---------- pezzi di UI (invariati dalla demo) ---------- */
const FILTERS = [
  { key: "all", label: "TUTTI" },
  { key: "photo", label: "FOTO" },
  { key: "story", label: "RACCONTI" },
  { key: "reel", label: "REEL" },
];

function SectionHeader({ tag, title, subtitle }) {
  return (
    <div className="mb-6 border-b border-hazard/20 pb-4">
      <div className="mb-2 flex items-center gap-3">
        <span className="se-hazard-bar h-4 w-8" />
        <span className="font-mono text-[11px] tracking-[0.3em] text-hazard">{tag}</span>
      </div>
      <h1 className="font-stencil text-3xl leading-none text-bone sm:text-4xl">{title}</h1>
      {subtitle && <p className="mt-2 max-w-2xl font-mono text-xs leading-relaxed text-bone/45">{subtitle}</p>}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center font-mono text-[13px] tracking-[0.2em] text-hazard">
      <span>&gt; RECUPERO DISPACCI DAL FRONTE…</span>
      <span className="se-cursor ml-1" />
    </div>
  );
}

function HomeScreen({ posts, filter, setFilter, onOpen, loading }) {
  const list = filter === "all" ? posts : posts.filter((p) => p.type === filter);
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <SectionHeader
        tag="RETE DISPACCI // SETTORE ATTIVO"
        title="DISPACCI"
        subtitle="Trasmissioni dal fronte. Foto, racconti e reel dei cittadini in servizio per la Democrazia Controllata."
      />
      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`border px-3 py-1.5 font-mono text-[11px] font-semibold tracking-[0.15em] transition ${
              filter === f.key
                ? "border-hazard bg-hazard text-ink"
                : "border-bone/20 text-bone/60 hover:border-hazard/60 hover:text-bone"
            }`}
          >
            {f.label}
            <span className="ml-2 text-current/60">
              {f.key === "all" ? posts.length : posts.filter((p) => p.type === f.key).length}
            </span>
          </button>
        ))}
      </div>
      {loading ? <LoadingState /> : <PostGrid posts={list} onOpen={onOpen} />}
    </div>
  );
}

function GalleryScreen({ posts, onOpen, loading }) {
  const photos = posts.filter((p) => p.type === "photo");
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <SectionHeader
        tag="ARCHIVIO VISIVO // IMMAGINI DAL FRONTE"
        title="MATERIALE DI COMBATTIMENTO"
        subtitle="Documentazione fotografica declassificata. Ogni immagine è una prova della nostra determinazione."
      />
      {loading ? <LoadingState /> : <PostGrid posts={photos} onOpen={onOpen} />}
    </div>
  );
}

/* Player reel: embed inline per YouTube/Vimeo, link-out per il resto. */
function ReelPlayer({ url, title }) {
  const reel = parseReel(url);

  if (reel.platform === "youtube" || reel.platform === "vimeo") {
    return (
      <div className="border border-hazard/20">
        <div className="relative aspect-video bg-ink">
          <iframe
            src={reel.embedUrl}
            title={title || "Reel"}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-hazard/20 bg-ink/60 px-4 py-2">
          <span className="font-mono text-[10px] tracking-[0.2em] text-bone/45">
            &gt; TRASMISSIONE INCORPORATA — {reel.platform.toUpperCase()}
          </span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 font-mono text-[10px] tracking-[0.15em] text-hazard hover:text-bone"
          >
            APRI ORIGINALE ↗
          </a>
        </div>
      </div>
    );
  }

  // Fallback: piattaforma non incorporabile (es. TikTok/Instagram) -> link-out
  return (
    <div className="border border-alarm/40 se-hazard-stripes">
      <div className="bg-ink/85 p-6 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-hazard text-hazard">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <p className="mb-4 font-mono text-xs text-bone/60">&gt; QUESTA PIATTAFORMA NON PERMETTE L'ANTEPRIMA INCORPORATA</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block break-all border-2 border-hazard bg-hazard px-5 py-3 font-mono text-sm font-bold tracking-[0.15em] text-ink transition hover:bg-alarm hover:border-alarm hover:text-bone"
        >
          ▶ APRI REEL ESTERNO
        </a>
        <p className="mt-3 break-all font-mono text-[11px] text-alarm">{url}</p>
      </div>
    </div>
  );
}

function DetailScreen({ post, onBack }) {
  if (!post) return null;
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-bone/60 transition hover:text-hazard"
      >
        ◄ TORNA AI DISPACCI
      </button>

      <article className="border border-hazard/25 bg-anthracite se-scanlines">
        <div className="flex items-center justify-between border-b border-hazard/20 px-5 py-3">
          <span className="font-mono text-[11px] tracking-[0.2em] text-hazard">
            {TYPE_LABEL[post.type]} // {post.id}
          </span>
          <span className="font-mono text-[11px] text-bone/45">{fmtDate(post.created_at)}</span>
        </div>

        <div className="p-5 sm:p-8">
          {post.title && <h1 className="mb-4 font-stencil text-2xl leading-tight text-hazard sm:text-4xl">{post.title}</h1>}
          <div className="mb-6 flex items-center gap-2 font-mono text-xs text-bone/60">
            <span className="text-hazard">▸ OPERATORE</span>
            <span className="text-bone/85">{post.author_name}</span>
          </div>

          {post.type === "photo" && post.image_url && (
            <div className="relative border border-hazard/20">
              <img src={post.image_url} alt={post.title || ""} className="block w-full object-cover" />
              <span className="se-stamp absolute right-4 top-4 text-sm">Declassificato</span>
            </div>
          )}

          {post.type === "story" && (
            <div className="border-l-2 border-hazard/50 pl-5">
              <p className="whitespace-pre-line text-[15px] leading-8 text-bone/85">{post.body}</p>
            </div>
          )}

          {post.type === "reel" && <ReelPlayer url={post.reel_url} title={post.title} />}
        </div>
      </article>
    </div>
  );
}

function CenterScreen({ children }) {
  return <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">{children}</div>;
}

/* ---------- APP ---------- */
export default function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState("dispacci"); // dispacci|materiale|detail|login|form
  const [activeNav, setActiveNav] = useState("dispacci");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [session, setSession] = useState(null);
  const [authError, setAuthError] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isAuth = !!session;
  const currentUser = session
    ? { display_name: session.user.user_metadata?.display_name || "Helldiver" }
    : null;

  /* sessione: ripristino all'avvio + sottoscrizione ai cambi di stato */
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  /* lettura dei post (funziona anche da sloggati: RLS select = pubblica) */
  const loadPosts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("[SE] Errore lettura post:", error.message);
      setPosts([]);
    } else {
      setPosts((data || []).map(toView));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  function go(screenKey, navKey) {
    setScreen(screenKey);
    if (navKey) setActiveNav(navKey);
    window.scrollTo({ top: 0 });
  }

  function handleNav(key) {
    if (key === "dispacci") { setFilter("all"); go("dispacci", "dispacci"); }
    if (key === "materiale") { go("materiale", "materiale"); }
    if (key === "rapporti") { setFilter("story"); go("dispacci", "rapporti"); }
    if (key === "propaganda") { setFilter("reel"); go("dispacci", "propaganda"); }
  }

  function openPost(post) {
    setSelected(post);
    go("detail", null);
  }

  async function handleLogin({ email, password }) {
    setAuthError("");
    setAuthBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setAuthBusy(false);
    if (error) {
      setAuthError("Accesso negato. Verifica matricola e codice.");
      return;
    }
    go("dispacci", "dispacci");
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    go("dispacci", "dispacci");
  }

  async function handleCreate(payload) {
    if (!session) return;
    setSubmitting(true);
    try {
      const user = session.user;
      const author_name = user.user_metadata?.display_name || "Helldiver";
      let image_path = null;

      // FOTO: comprimi e carica su Storage, poi salva il path
      if (payload.type === "photo") {
        if (!payload.file) throw new Error("Nessun file selezionato.");
        const compressed = await compressImage(payload.file);
        const ext = (payload.file.name.split(".").pop() || "jpg").toLowerCase();
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from(PHOTO_BUCKET)
          .upload(path, compressed, { upsert: false });
        if (upErr) throw upErr;
        image_path = path;
      }

      // INSERT della riga (RLS: author_id deve essere = auth.uid())
      const row = {
        author_id: user.id,
        author_name,
        type: payload.type,
        title: payload.title || null,
        body: payload.body || null,
        image_path,
        reel_url: payload.reel_url || null,
      };
      const { error: insErr } = await supabase.from("posts").insert(row);
      if (insErr) throw insErr;

      await loadPosts();
      setFilter("all");
      go("dispacci", "dispacci");
    } catch (e) {
      alert("Errore invio dispaccio: " + (e.message || e));
    } finally {
      setSubmitting(false);
    }
  }

  let content;
  if (screen === "detail") content = <DetailScreen post={selected} onBack={() => go("dispacci", "dispacci")} />;
  else if (screen === "materiale") content = <GalleryScreen posts={posts} onOpen={openPost} loading={loading} />;
  else if (screen === "login") content = <CenterScreen><LoginForm onSubmit={handleLogin} error={authError} busy={authBusy} /></CenterScreen>;
  else if (screen === "form") content = <CenterScreen><PostForm onSubmit={handleCreate} busy={submitting} /></CenterScreen>;
  else content = <HomeScreen posts={posts} filter={filter} setFilter={setFilter} onOpen={openPost} loading={loading} />;

  return (
    <Layout
      isAuthenticated={isAuth}
      currentUser={currentUser}
      activeNav={activeNav}
      onNav={handleNav}
      onLogin={() => go("login", null)}
      onLogout={handleLogout}
      onCompose={() => go("form", null)}
    >
      {content}
    </Layout>
  );
}
