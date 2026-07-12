/* =====================================================================
   <LoginForm onSubmit={fn} error={string} busy={bool} />  — "ACCESSO TERMINALE"
   onSubmit riceve { email, password }. `error` mostra l'esito reale di
   Supabase; `busy` disabilita il pulsante durante il login.
   ===================================================================== */
import React, { useState } from "react";

function Field({ label, type, value, onChange, placeholder, autoFocus }) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-[11px] tracking-[0.2em] text-hazard/80">{label}</span>
      <div className="flex items-center border border-hazard/30 bg-ink px-3 focus-within:border-hazard">
        <span className="mr-2 font-mono text-hazard/60">&gt;</span>
        <input
          type={type}
          value={value}
          autoFocus={autoFocus}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent py-3 font-mono text-sm text-bone placeholder-bone/25 outline-none"
        />
      </div>
    </label>
  );
}

export default function LoginForm({ onSubmit, error, busy }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit && onSubmit({ email, password });
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="border border-hazard/40 bg-anthracite se-scanlines">
        {/* barra terminale */}
        <div className="flex items-center gap-2 border-b border-hazard/30 bg-ink px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-alarm" />
          <span className="h-2.5 w-2.5 rounded-full bg-hazard" />
          <span className="h-2.5 w-2.5 rounded-full bg-bone/30" />
          <span className="ml-2 font-mono text-[10px] tracking-[0.2em] text-bone/40">SE-SEC//TERMINALE-04</span>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="font-stencil text-2xl text-hazard">ACCESSO TERMINALE</h2>
            <p className="mt-2 font-mono text-[11px] leading-relaxed text-bone/50">
              &gt; AUTENTICAZIONE RICHIESTA
              <br />
              &gt; SOLO PERSONALE AUTORIZZATO<span className="se-cursor ml-1 align-middle" />
            </p>
          </div>

          <div className="space-y-4">
            <Field label="MATRICOLA / EMAIL" type="email" value={email} onChange={setEmail} placeholder="operatore@super.earth" autoFocus />
            <Field label="CODICE DI SICUREZZA" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
          </div>

          {error && (
            <p className="mt-4 border border-alarm/50 bg-alarm/10 px-3 py-2 font-mono text-[11px] leading-relaxed text-alarm">
              &gt; {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="mt-7 flex w-full items-center justify-center gap-2 border-2 border-hazard bg-hazard py-3 font-mono text-sm font-bold tracking-[0.2em] text-ink transition hover:bg-alarm hover:border-alarm hover:text-bone disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "▶ VERIFICA IN CORSO…" : "▶ AUTORIZZA ACCESSO"}
          </button>

          <p className="mt-4 text-center font-mono text-[10px] tracking-[0.15em] text-bone/30">
            OGNI ACCESSO È REGISTRATO PER LA TUA SICUREZZA
          </p>
        </form>
      </div>
    </div>
  );
}
