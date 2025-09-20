"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "spendwise.settings";

const DEFAULTS = {
  currency: "USD",
  confirmDeletes: true,
  enableHotkeys: true,
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(DEFAULTS);
  const [savedAt, setSavedAt] = useState(null);

  // load once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSettings({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch {}
  }, []);

  // save on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      setSavedAt(Date.now());
    } catch {}
  }, [settings]);

  return (
    <main className="min-h-screen p-6 text-neutral-200 bg-neutral-900">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-xl font-semibold mb-4">Settings</h1>

        {/* Preferences */}
        <section className="rounded-lg border border-neutral-700/60 bg-neutral-800 p-4 mb-6">
          <h2 className="font-semibold mb-3">Preferences</h2>

          <div className="grid gap-4">
            {/* Currency */}
            <div className="flex items-center justify-between gap-4">
              <label className="text-sm">Currency</label>
              <select
                className="bg-neutral-900 rounded-md px-3 py-2 outline-none"
                value={settings.currency}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, currency: e.target.value }))
                }
              >
                <option value="USD">USD — $</option>
                <option value="EUR">EUR — €</option>
                <option value="GBP">GBP — £</option>
                <option value="CAD">CAD — $</option>
                <option value="AUD">AUD — $</option>
                <option value="BDT">BDT — ৳</option>
                <option value="INR">INR — ₹</option>
              </select>
            </div>

            {/* Confirm deletes */}
            <div className="flex items-center justify-between gap-4">
              <label className="text-sm">Confirm before deleting</label>
              <button
                onClick={() =>
                  setSettings((s) => ({ ...s, confirmDeletes: !s.confirmDeletes }))
                }
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
                onClick={() =>
                  setSettings((s) => ({ ...s, enableHotkeys: !s.enableHotkeys }))
                }
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
              onClick={() => alert("Export not wired yet — we’ll hook this to your expenses store.")}
            >
              Export data (JSON)
            </button>
            <label className="rounded-md border border-neutral-700/60 bg-neutral-900 px-3 py-2 text-sm hover:bg-neutral-800 cursor-pointer">
              Import data…
              <input
                type="file"
                accept="application/json"
                className="hidden"
                onChange={() => alert("Import not wired yet — we’ll hook this to your expenses store.")}
              />
            </label>
            <button
              className="rounded-md border border-red-700/60 bg-red-800/60 px-3 py-2 text-sm hover:bg-red-700/60"
              onClick={() => alert("Clear not wired yet — optional hook method needed.")}
            >
              Clear all data
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
