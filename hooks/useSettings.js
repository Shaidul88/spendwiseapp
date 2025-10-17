// hooks/useSettings.js
"use client";
import { useEffect, useRef, useState } from "react";

const KEY = "spendwise:settings:v1";
const PROFILE_KEY = "spendwise:profile:v1";

const DEFAULTS = {
  theme: "dark",
  currency: "USD",
  locale: "en-US",
};

function readJSON(key, fallback) {
  try {
    if (typeof window === "undefined") return fallback;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}
function writeJSON(key, value) {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function useSettings() {
  const [settings, setSettings] = useState(DEFAULTS);
  const hydrated = useRef(false);

  useEffect(() => {
    // Load settings
    let s = readJSON(KEY, null);

    // Migrate once from profile 
    if (!s) {
      const profile = readJSON(PROFILE_KEY, null);
      s = {
        ...DEFAULTS,
        ...(profile?.currency ? { currency: profile.currency } : {}),
        ...(profile?.locale ? { locale: profile.locale } : {}),
      };
    } else {
      s = { ...DEFAULTS, ...s };
    }

    setSettings(s);
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    writeJSON(KEY, settings);
  }, [settings]);

  function update(patch) {
    setSettings((s) => ({ ...s, ...patch }));
  }
  const setCurrency = (c) => update({ currency: c });
  const setLocale = (l) => update({ locale: l });
  const setTheme = (t) => update({ theme: t });

  return { settings, update, setCurrency, setLocale, setTheme };
}
