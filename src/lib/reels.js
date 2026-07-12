/* =====================================================================
   Parser dei link reel.
   Riconosce YouTube (watch, shorts, youtu.be) e Vimeo e restituisce un
   URL di embed incorporabile in un <iframe>, più la thumbnail quando
   disponibile. Per le altre piattaforme (TikTok, Instagram, ...) torna
   platform "other": l'app mostrerà il link-out invece dell'embed, perché
   i loro embed richiedono script esterni e sono poco affidabili.
   NB: usiamo youtube-nocookie per non impostare cookie finché non si
   preme play (più rispettoso della privacy dei visitatori).
   ===================================================================== */
export function parseReel(url) {
  if (!url) return { platform: "other", url };
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");

    // --- YouTube ---
    if (["youtube.com", "m.youtube.com", "music.youtube.com"].includes(host)) {
      let id = u.searchParams.get("v");
      if (!id && u.pathname.startsWith("/shorts/")) id = u.pathname.split("/")[2];
      if (!id && u.pathname.startsWith("/embed/")) id = u.pathname.split("/")[2];
      if (id) return youtube(id, url);
    }
    if (host === "youtu.be") {
      const id = u.pathname.slice(1).split("/")[0];
      if (id) return youtube(id, url);
    }

    // --- Vimeo ---
    if (host === "vimeo.com" || host === "player.vimeo.com") {
      const id = u.pathname.split("/").filter(Boolean).pop();
      if (id && /^\d+$/.test(id)) {
        return {
          platform: "vimeo",
          id,
          embedUrl: `https://player.vimeo.com/video/${id}`,
          thumbnailUrl: null,
          url,
        };
      }
    }
  } catch {
    /* URL non valido: cade nel fallback */
  }
  return { platform: "other", url };
}

function youtube(id, url) {
  return {
    platform: "youtube",
    id,
    embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
    thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    url,
  };
}

// true se il reel si può incorporare in un player (altrimenti: link-out)
export function isEmbeddable(url) {
  return ["youtube", "vimeo"].includes(parseReel(url).platform);
}
