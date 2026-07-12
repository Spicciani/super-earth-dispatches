/* =====================================================================
   Helper condivisi (ex lib.js, ora moduli ES).
   ===================================================================== */

// Etichette bulletin per i tipi di post
export const TYPE_LABEL = { photo: "FOTO", story: "RACCONTO", reel: "REEL" };

// Data ISO -> "05 MAG 2287"
export function fmtDate(iso) {
  try {
    return new Intl.DateTimeFormat("it-IT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
      .format(new Date(iso))
      .replace(".", "")
      .toUpperCase();
  } catch {
    return String(iso || "");
  }
}

// Tronca il testo a n caratteri sul confine di parola
export function truncate(text, n) {
  if (!text) return "";
  const s = String(text).trim();
  if (s.length <= n) return s;
  return s.slice(0, n).replace(/\s+\S*$/, "") + "…";
}
