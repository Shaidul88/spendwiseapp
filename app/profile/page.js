"use client";

import { useEffect, useState } from "react";

const KEY = "spendwise.profile";
const DEFAULT = {
  displayName: "User",
  email: "",        // leave blank for now; fill when auth added
  avatarUrl: "",    // optional
};

export default function ProfilePage() {
  const [profile, setProfile] = useState(DEFAULT);
  const [saved, setSaved] = useState(false);

  // load
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setProfile({ ...DEFAULT, ...JSON.parse(raw) });
    } catch {}
  }, []);

  // save
  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(profile));
      setSaved(true);
      setTimeout(() => setSaved(false), 1200);
    } catch {}
  }

  return (
    <main className="min-h-screen p-6 text-neutral-200 bg-neutral-900">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-xl font-semibold mb-4">Profile</h1>

        <section className="rounded-lg border border-neutral-700/60 bg-neutral-800 p-4 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-neutral-700 overflow-hidden flex items-center justify-center">
              {profile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm text-neutral-300">No Avatar</span>
              )}
            </div>
            <div className="flex-1">
              <label className="text-xs text-neutral-400">Avatar URL</label>
              <input
                className="mt-1 w-full bg-neutral-900 rounded-md px-3 py-2 outline-none"
                placeholder="https://…"
                value={profile.avatarUrl}
                onChange={(e) => setProfile(p => ({ ...p, avatarUrl: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs text-neutral-400">Display name</label>
              <input
                className="mt-1 w-full bg-neutral-900 rounded-md px-3 py-2 outline-none"
                placeholder="Your name"
                value={profile.displayName}
                onChange={(e) => setProfile(p => ({ ...p, displayName: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-xs text-neutral-400">Email</label>
              <input
                className="mt-1 w-full bg-neutral-900 rounded-md px-3 py-2 outline-none"
                placeholder="(set when auth is added)"
                value={profile.email}
                onChange={(e) => setProfile(p => ({ ...p, email: e.target.value }))}
              />
            </div>
          </div>

          {/* Password stub (disabled until auth) */}
          <div className="mt-4">
            <label className="text-xs text-neutral-400">Password</label>
            <input
              className="mt-1 w-full bg-neutral-900 rounded-md px-3 py-2 outline-none opacity-60 cursor-not-allowed"
              placeholder="Managed by your auth provider"
              disabled
              value=""
              readOnly
            />
            <p className="mt-1 text-xs text-neutral-400">
              Password changes will be enabled after connecting an auth provider.
            </p>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={save}
              className="rounded-md border border-neutral-700/60 bg-neutral-900 px-3 py-2 text-sm hover:bg-neutral-800"
            >
              Save
            </button>
            {saved && <span className="text-xs text-emerald-400 self-center">Saved</span>}
          </div>
        </section>
      </div>
    </main>
  );
}
