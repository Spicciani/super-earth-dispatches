import imageCompression from "browser-image-compression";

/* Comprime l'immagine PRIMA dell'upload: fondamentale col free tier di
   Supabase (1 GB di storage). Riduce a max ~1600px sul lato lungo e
   punta a ~0.8 MB. Se la compressione fallisce, ripiega sul file originale. */
export async function compressImage(file) {
  try {
    return await imageCompression(file, {
      maxSizeMB: 0.8,
      maxWidthOrHeight: 1600,
      useWebWorker: true,
    });
  } catch (e) {
    console.warn("[SE] Compressione fallita, uso il file originale", e);
    return file;
  }
}
