"use client";
import { useState, useMemo } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useSettings } from "@/hooks/useSettings"; // currency/locale shown from Settings

export default function ProfilePage() {
  const { profile, update, clear } = useProfile();
  const { settings } = useSettings();
  const [form, setForm] = useState({ name: profile.name, email: profile.email });

  useMemo(() => { setForm({ name: profile.name, email: profile.email }); }, [profile.name, profile.email]);

  const initials =
    (form.name || form.email || "S W")
      .split(/\s+/).slice(0,2).map(s => s[0]?.toUpperCase()).join("") || "SW";

  async function onSubmit(e) {
    e.preventDefault();
    // Only name/email are editable here; currency/locale live in Settings
    update({ name: form.name, email: form.email });
  }

  async function onPickFile(ev) {
    const file = ev.target.files?.[0];
    ev.target.value = ""; // reset input
    if (!file || !file.type.startsWith("image/")) return;
    const dataUrl = await compressToDataURL(file, 512, 0.85); // keep under a few hundred KB
    update({ avatar: dataUrl });
  }

  function onRemovePhoto() {
    update({ avatar: "" });
  }

  return (
    <main className="min-h-screen space-y-6">
      <h1 className="text-2xl font-semibold">Profile</h1>

      {/* Header card with avatar */}
      <section className="panel p-4 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-neutral-700 flex items-center justify-center overflow-hidden">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xl font-semibold">{initials}</span>
          )}
        </div>

        <div className="text-sm text-neutral-300 flex-1">
          <div className="font-medium text-neutral-100">{form.name || "Your name"}</div>
          <div>{form.email || "you@example.com"}</div>
          <div className="mt-1">
            Currency: <span className="badge">{settings.currency}</span>
            <a href="/settings" className="ml-2 underline text-neutral-300">Manage in Settings</a>
          </div>
          <div>
            Locale: <span className="badge">{settings.locale}</span>
            <a href="/settings" className="ml-2 underline text-neutral-300">Manage in Settings</a>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="btn cursor-pointer">
            Change photo
            <input type="file" accept="image/*" className="hidden" onChange={onPickFile} />
          </label>
          {profile.avatar && (
            <button className="btn" onClick={onRemovePhoto}>Remove</button>
          )}
        </div>
      </section>

      {/* Edit name/email */}
      <form onSubmit={onSubmit} className="panel p-4 grid md:grid-cols-2 gap-4">
        <div>
          <label className="panel-header">Name</label>
          <input
            className="input mt-1"
            value={form.name}
            onChange={(e)=>setForm(f=>({...f,name:e.target.value}))}
            placeholder="Shaidul Islam"
          />
        </div>

        <div>
          <label className="panel-header">Email</label>
          <input
            className="input mt-1"
            type="email"
            value={form.email}
            onChange={(e)=>setForm(f=>({...f,email:e.target.value}))}
            placeholder="you@example.com"
          />
        </div>

        <div className="md:col-span-2 flex gap-2 justify-end">
          <button type="button" onClick={clear} className="btn">Reset</button>
          <button className="btn btn-primary">Save</button>
        </div>
      </form>

      {/* Export / Import */}
      <section className="panel p-4">
        <div className="panel-header mb-2">Data Controls</div>
        <div className="flex flex-wrap gap-2">
          <button
            className="btn"
            onClick={()=>{
              const blob = new Blob([JSON.stringify(profile, null, 2)], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url; a.download = "spendwise-profile.json"; a.click();
              URL.revokeObjectURL(url);
            }}
          >
            Export Profile JSON
          </button>

          <label className="btn cursor-pointer">
            Import JSON
            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e)=>{
                const file = e.target.files?.[0];
                if(!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  try {
                    const data = JSON.parse(String(reader.result||"{}"));
                    // Accept name/email/avatar from file; ignore currency/locale (Settings owns those)
                    update({
                      name: data.name ?? "",
                      email: data.email ?? "",
                      avatar: data.avatar ?? "",
                    });
                  } catch {}
                };
                reader.readAsText(file);
                e.currentTarget.value = "";
              }}
            />
          </label>
        </div>
      </section>
    </main>
  );
}

/** Compress an image file to a data URL, max side in px, JPEG by default */
function compressToDataURL(file, maxSide = 512, quality = 0.85) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        const scale = Math.min(1, maxSide / Math.max(width, height));
        width = Math.round(width * scale);
        height = Math.round(height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Prefer JPEG to keep size small; fall back to PNG if transparent images matter to you
        const out = canvas.toDataURL("image/jpeg", quality);
        resolve(out);
      };
      img.onerror = () => resolve(String(reader.result || "")); // original data URL
      img.src = String(reader.result || "");
    };
    reader.readAsDataURL(file);
  });
}
