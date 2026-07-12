/* =====================================================================
   <PostCard post={post} onOpen={fn} />
   Un'unica card che cambia layout in base a post.type.
   ===================================================================== */
import React from "react";
import { fmtDate, truncate, TYPE_LABEL } from "../lib/helpers";
import { parseReel } from "../lib/reels";

const BADGE_STYLE = {
  photo: "bg-hazard text-ink",
  story: "bg-bone text-ink",
  reel: "bg-alarm text-bone",
};

export function TypeBadge({ type }) {
  return (
    <span className={`inline-block px-2 py-[3px] font-mono text-[10px] font-bold tracking-[0.2em] ${BADGE_STYLE[type]}`}>
      {TYPE_LABEL[type]}
    </span>
  );
}

function Meta({ author_name, created_at }) {
  return (
    <div className="flex items-center gap-2 font-mono text-[11px] leading-none text-bone/55">
      <span className="text-hazard">▸</span>
      <span className="truncate text-bone/85">{author_name}</span>
      <span className="text-bone/25">/</span>
      <span className="shrink-0">{fmtDate(created_at)}</span>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

/* ---- PHOTO ---- */
function PhotoCard({ post, onOpen }) {
  return (
    <article
      onClick={() => onOpen && onOpen(post)}
      className="group relative block cursor-pointer overflow-hidden border border-hazard/25 bg-anthracite se-scanlines"
    >
      <div className="min-h-[180px] overflow-hidden bg-ink">
        <img
          src={post.image_url}
          alt={post.title || "Dispaccio fotografico"}
          className="block w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />
      <div className="absolute left-0 top-0 flex w-full items-center justify-between p-3">
        <TypeBadge type={post.type} />
        <span className="font-mono text-[10px] tracking-[0.2em] text-hazard/70">SE//IMG</span>
      </div>
      <div className="absolute inset-x-0 bottom-0 z-10 p-4">
        {post.title && (
          <h3 className="mb-2 font-stencil text-lg leading-tight text-bone drop-shadow-[0_2px_0_rgba(0,0,0,0.6)] sm:text-xl">
            {post.title}
          </h3>
        )}
        <Meta author_name={post.author_name} created_at={post.created_at} />
      </div>
    </article>
  );
}

/* ---- STORY ---- */
function StoryCard({ post, onOpen }) {
  return (
    <article
      onClick={() => onOpen && onOpen(post)}
      className="group relative flex cursor-pointer flex-col border border-bone/15 bg-anthracite p-5 transition-colors hover:border-hazard/60 se-scanlines"
    >
      <div className="mb-3 flex items-center justify-between">
        <TypeBadge type={post.type} />
        <span className="font-mono text-[10px] tracking-[0.2em] text-bone/30">RAPPORTO</span>
      </div>
      {post.title && (
        <h3 className="mb-3 font-stencil text-lg leading-tight text-hazard sm:text-xl">{post.title}</h3>
      )}
      <p className="mb-4 flex-1 border-l-2 border-hazard/40 pl-3 text-sm leading-relaxed text-bone/75">
        {truncate(post.body, 150)}
      </p>
      <Meta author_name={post.author_name} created_at={post.created_at} />
    </article>
  );
}

/* ---- REEL ---- */
function ReelCard({ post, onOpen }) {
  const thumb = parseReel(post.reel_url).thumbnailUrl;
  return (
    <a
      href={post.reel_url || "#"}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        if (onOpen) {
          e.preventDefault();
          onOpen(post);
        }
      }}
      className="group relative flex flex-col overflow-hidden border border-alarm/40 bg-anthracite se-scanlines"
    >
      {/* anteprima: thumbnail reale del video se disponibile, altrimenti motivo hazard */}
      <div className={`relative flex aspect-video items-center justify-center bg-ink ${thumb ? "" : "se-hazard-stripes"}`}>
        {thumb && (
          <img src={thumb} alt={post.title || "Reel"} className="absolute inset-0 h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-ink/70" />
        <span className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-2 border-hazard bg-ink/80 text-hazard transition group-hover:scale-110 group-hover:bg-alarm group-hover:text-bone group-hover:border-alarm">
          <PlayIcon />
        </span>
        <span className="absolute right-3 top-3 z-10">
          <TypeBadge type={post.type} />
        </span>
      </div>
      <div className="p-4">
        {post.title && (
          <h3 className="mb-2 font-stencil text-base leading-tight text-bone group-hover:text-hazard sm:text-lg">
            {post.title}
          </h3>
        )}
        <div className="mb-3 flex items-center gap-2 font-mono text-[11px] text-alarm">
          <span>▶</span>
          <span className="truncate">{post.reel_url}</span>
        </div>
        <Meta author_name={post.author_name} created_at={post.created_at} />
      </div>
    </a>
  );
}

export default function PostCard({ post, onOpen }) {
  if (!post) return null;
  switch (post.type) {
    case "photo":
      return <PhotoCard post={post} onOpen={onOpen} />;
    case "story":
      return <StoryCard post={post} onOpen={onOpen} />;
    case "reel":
      return <ReelCard post={post} onOpen={onOpen} />;
    default:
      return null;
  }
}
