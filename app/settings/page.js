"use client";

import { useEffect, useRef, useState } from "react";
import { useSettings } from "@/hooks/useSettings";

const THEME_OPTIONS = [
  { value: "dark", label: "Dark", note: "Original charcoal palette", swatch: "from-slate-900 via-slate-800 to-indigo-900" },
  { value: "midnight", label: "Midnight", note: "Deep navy with violet glow", swatch: "from-indigo-950 via-slate-900 to-violet-900" },
  { value: "forest", label: "Forest", note: "Muted greens with teal accents", swatch: "from-emerald-950 via-emerald-900 to-emerald-800" },
  { value: "sunset", label: "Sunset", note: "Wine and amber gradient", swatch: "from-fuchsia-950 via-rose-900 to-amber-800" },
];

export default function SettingsPage() {
  const { settings, update } = useSettings();
  const [savedAt, setSavedAt] = useState(null);
  const hydrated = useRef(false);
  const [selectedTheme, setSelectedTheme] = useState(settings.theme);

  useEffect(() => {
    setSelectedTheme(settings.theme);
  }, [settings.theme]);

  useEffect(() => {
    if (!hydrated.current) {
      hydrated.current = true;
      return;
    }
    setSavedAt(Date.now());
  }, [settings]);

  return (
    <main className="min-h-screen p-6 text-neutral-200">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-xl font-semibold mb-4">Settings</h1>

        {/* Preferences */}
        <section className="rounded-lg border border-neutral-700/60 bg-neutral-800 p-4 mb-6">
          <h2 className="font-semibold mb-3">Preferences</h2>

          <div className="grid gap-4">
            {/* Theme */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Change themes</label>
                <span className="text-xs text-neutral-400">Switches the background on every page</span>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {THEME_OPTIONS.map(({ value, label, note, swatch }) => {
                  const active = selectedTheme === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setSelectedTheme(value)}
                      className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition ${
                        active
                          ? "ring-2 ring-indigo-400 border-transparent"
                          : "border-neutral-700/60 hover:border-neutral-500"
                      }`}
                    >
                      <div>
                        <div className="font-medium">{label}</div>
                        <div className="text-xs text-neutral-400">{note}</div>
                      </div>
                      <div
                        className={`h-10 w-14 rounded-md bg-gradient-to-br ${swatch} ring-1 ring-neutral-700/60`}
                        aria-hidden
                      />
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => update({ theme: selectedTheme })}
                  disabled={selectedTheme === settings.theme}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                    selectedTheme === settings.theme
                      ? "bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-500"
                  }`}
                >
                  Save theme
                </button>
                <span className="text-xs text-neutral-400">
                  Current: {settings.theme}
                </span>
              </div>
            </div>

            {/* Currency */}
            <div className="flex items-center justify-between gap-4">
              <label className="text-sm">Currency</label>
              <select
                className="bg-neutral-900 rounded-md px-3 py-2 outline-none"
                value={settings.currency || "USD"}
                onChange={(e) => update({ currency: e.target.value })}
              >
                <option value="USD">USD - $</option>
                <option value="EUR">EUR - EUR</option>
                <option value="GBP">GBP - GBP</option>
                <option value="CAD">CAD - $</option>
                <option value="AUD">AUD - $</option>
                <option value="BDT">BDT - BDT</option>
                <option value="INR">INR - INR</option>
              </select>
            </div>

            {/* Confirm deletes */}
            <div className="flex items-center justify-between gap-4">
              <label className="text-sm">Confirm before deleting</label>
              <button
                onClick={() => update({ confirmDeletes: !settings.confirmDeletes })}
                className={`px-3 py-1 rounded-md text-sm ${
                  settings.confirmDeletes ? "bg-emerald-600" : "bg-neutral-700"
                }`}
              >
                {settings.confirmDeletes ? "On" : "Off"}
              </button>
            </div>

            {/* Hotkeys */}
            <div className="flex items-center justify-between gap-4">
              <label className="text-sm">Enable keyboard shortcuts</label>
              <button
                onClick={() => update({ enableHotkeys: !settings.enableHotkeys })}
                className={`px-3 py-1 rounded-md text-sm ${
                  settings.enableHotkeys ? "bg-emerald-600" : "bg-neutral-700"
                }`}
              >
                {settings.enableHotkeys ? "On" : "Off"}
              </button>
            </div>
          </div>

          {/* Saved indicator */}
          <div className="mt-3 text-xs text-neutral-400">
            {savedAt ? "Saved" : "\u00A0"}
          </div>
        </section>

        {/* Data (stubs for now; we can wire later) */}
        <section className="rounded-lg border border-neutral-700/60 bg-neutral-800 p-4">
          <h2 className="font-semibold mb-3">Data</h2>
          <p className="text-sm text-neutral-400 mb-3">
            Import/Export and Clear Data can be wired to your expenses store next.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              className="rounded-md border border-neutral-700/60 bg-neutral-900 px-3 py-2 text-sm hover:bg-neutral-800"
              onClick={() => alert("Export not wired yet - we will hook this to your expenses store.")}
            >
              Export data (JSON)
            </button>
            <label className="rounded-md border border-neutral-700/60 bg-neutral-900 px-3 py-2 text-sm hover:bg-neutral-800 cursor-pointer">
              Import data
              <input
                type="file"
                accept="application/json"
                className="hidden"
                onChange={() => alert("Import not wired yet - we will hook this to your expenses store.")}
              />
            </label>
            <button
              className="rounded-md border border-red-700/60 bg-red-800/60 px-3 py-2 text-sm hover:bg-red-700/60"
              onClick={() => alert("Clear not wired yet - optional hook method needed.")}
            >
              Clear all data
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
