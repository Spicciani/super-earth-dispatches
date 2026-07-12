/* =====================================================================
   <PostGrid posts={posts} onOpen={fn} />
   Griglia masonry responsive di PostCard. Gestisce l'array vuoto.
   ===================================================================== */
import React from "react";
import PostCard from "./PostCard";

function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center border border-dashed border-hazard/30 bg-anthracite/60 px-6 py-20 text-center se-scanlines">
      <div className="se-stamp mb-6 text-sm">NESSUN DATO</div>
      <h3 className="mb-2 font-stencil text-2xl text-bone">NESSUN DISPACCIO</h3>
      <p className="max-w-sm font-mono text-xs leading-relaxed text-bone/50">
        &gt; Il terminale non ha rilevato trasmissioni per questo filtro.
        <br />
        &gt; Continua a diffondere la Democrazia Controllata, soldato.
      </p>
    </div>
  );
}

export default function PostGrid({ posts, onOpen }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="grid grid-cols-1">
        <EmptyState />
      </div>
    );
  }
  return (
    <div className="[column-fill:_balance] gap-4 sm:gap-5 columns-1 sm:columns-2 lg:columns-3">
      {posts.map((post) => (
        <div key={post.id} className="mb-4 break-inside-avoid sm:mb-5">
          <PostCard post={post} onOpen={onOpen} />
        </div>
      ))}
    </div>
  );
}
