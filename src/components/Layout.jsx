/* =====================================================================
   <Layout isAuthenticated currentUser={{display_name}} activeNav onNav
            onLogin onLogout onCompose>{children}</Layout>
   ===================================================================== */
import React, { useState } from "react";

const NAV = [
  { key: "dispacci", label: "DISPACCI" },
  { key: "materiale", label: "MATERIALE DI COMBATTIMENTO" },
  { key: "rapporti", label: "RAPPORTI SUL CAMPO" },
  { key: "propaganda", label: "PROPAGANDA" },
];

function Eagle() {
  return (
    <div className="flex h-10 w-10 items-center justify-center border-2 border-hazard bg-ink font-stencil text-hazard">
      <span className="text-lg leading-none">SE</span>
    </div>
  );
}

function NavLink({ item, active, onNav }) {
  return (
    <button
      type="button"
      onClick={() => onNav && onNav(item.key)}
      className={`relative whitespace-nowrap px-1 py-2 font-mono text-[11px] font-semibold tracking-[0.18em] transition-colors ${
        active ? "text-hazard" : "text-bone/60 hover:text-bone"
      }`}
    >
      {item.label}
      <span className={`absolute inset-x-0 -bottom-px h-[2px] bg-hazard transition-transform ${active ? "scale-x-100" : "scale-x-0"}`} />
    </button>
  );
}

export default function Layout({ isAuthenticated, currentUser, activeNav, onNav, onLogin, onLogout, onCompose, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ink">
      {/* nastro di pericolo superiore */}
      <div className="se-hazard-bar h-2 w-full" />

      <header className="sticky top-0 z-40 border-b border-hazard/25 bg-ink/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
          {/* logo */}
          <button type="button" onClick={() => onNav && onNav("dispacci")} className="flex items-center gap-3 text-left">
            <Eagle />
            <div className="leading-none">
              <div className="font-stencil text-base tracking-wide text-bone sm:text-lg">SUPER EARTH</div>
              <div className="font-mono text-[9px] tracking-[0.25em] text-hazard/70">MINISTERO DELLA DIFESA</div>
            </div>
          </button>

          {/* nav desktop */}
          <nav className="ml-6 hidden flex-1 items-center gap-5 lg:flex">
            {NAV.map((item) => (
              <NavLink key={item.key} item={item} active={activeNav === item.key} onNav={onNav} />
            ))}
          </nav>

          {/* stato login (desktop) */}
          <div className="ml-auto hidden items-center gap-3 lg:flex">
            {isAuthenticated ? (
              <React.Fragment>
                <div className="text-right font-mono text-[10px] leading-tight">
                  <div className="text-bone/45">OPERATORE</div>
                  <div className="text-hazard">{currentUser ? currentUser.display_name : "—"}</div>
                </div>
                <button
                  type="button"
                  onClick={onCompose}
                  className="border-2 border-hazard bg-hazard px-3 py-2 font-mono text-[11px] font-bold tracking-[0.15em] text-ink transition hover:bg-alarm hover:border-alarm hover:text-bone"
                >
                  ✚ INVIA RAPPORTO
                </button>
                <button
                  type="button"
                  onClick={onLogout}
                  className="border border-bone/25 px-2 py-2 font-mono text-[11px] tracking-[0.15em] text-bone/60 transition hover:border-alarm hover:text-alarm"
                  title="Disconnetti"
                >
                  ⏻
                </button>
              </React.Fragment>
            ) : (
              <button
                type="button"
                onClick={onLogin}
                className="flex items-center gap-2 border border-hazard/50 px-3 py-2 font-mono text-[11px] tracking-[0.15em] text-hazard transition hover:bg-hazard hover:text-ink"
              >
                <span className="se-cursor" /> ACCESSO TERMINALE
              </button>
            )}
          </div>

          {/* toggle mobile */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="ml-auto flex h-9 w-9 items-center justify-center border border-hazard/40 text-hazard lg:hidden"
            aria-label="Menu"
          >
            <span className="font-mono text-lg leading-none">{open ? "✕" : "≡"}</span>
          </button>
        </div>

        {/* nav mobile */}
        {open && (
          <div className="border-t border-hazard/20 bg-anthracite px-4 py-3 lg:hidden">
            <nav className="flex flex-col">
              {NAV.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    onNav && onNav(item.key);
                    setOpen(false);
                  }}
                  className={`border-l-2 py-2 pl-3 text-left font-mono text-xs tracking-[0.15em] ${
                    activeNav === item.key ? "border-hazard text-hazard" : "border-transparent text-bone/60"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="mt-3 border-t border-bone/10 pt-3">
              {isAuthenticated ? (
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] text-hazard">{currentUser ? currentUser.display_name : "—"}</span>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => { onCompose && onCompose(); setOpen(false); }} className="bg-hazard px-3 py-2 font-mono text-[11px] font-bold text-ink">✚ INVIA RAPPORTO</button>
                    <button type="button" onClick={() => { onLogout && onLogout(); setOpen(false); }} className="border border-alarm px-2 py-2 font-mono text-[11px] text-alarm">⏻</button>
                  </div>
                </div>
              ) : (
                <button type="button" onClick={() => { onLogin && onLogin(); setOpen(false); }} className="w-full border border-hazard/50 py-2 font-mono text-[11px] tracking-[0.15em] text-hazard">ACCESSO TERMINALE</button>
              )}
            </div>
          </div>
        )}
      </header>

      <main>{children}</main>

      <footer className="mt-16 border-t border-hazard/20">
        <div className="se-hazard-bar h-1.5 w-full opacity-70" />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <p className="font-stencil text-sm text-bone/70">LA LIBERTÀ NON È GRATIS.</p>
          <p className="mt-1 font-mono text-[10px] leading-relaxed text-bone/35">
            SUPER EARTH ARMED FORCES // RETE DISPACCI NON UFFICIALE // FAN SITE — © 2287 CITTADINI PER LA DEMOCRAZIA CONTROLLATA
          </p>
        </div>
      </footer>
    </div>
  );
}
