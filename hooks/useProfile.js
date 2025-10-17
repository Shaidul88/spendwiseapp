// hooks/useProfile.js
"use client";
import { useEffect, useRef, useState } from "react";

const KEY = "spendwise:profile:v1";
const DEFAULT = { name: "", email: "", avatar: "" }; // avatar added

function read() {
  try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch { return null; }
}
function write(v) {
  try { localStorage.setItem(KEY, JSON.stringify(v)); } catch {}
}

export function useProfile() {
  const [profile, setProfile] = useState(DEFAULT);
  const hydrated = useRef(false);

  useEffect(() => {
    const data = read();
    if (data && typeof data === "object") setProfile({ ...DEFAULT, ...data });
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    write(profile);
  }, [profile]);

  function update(patch) { setProfile(p => ({ ...p, ...patch })); }
  function clear() { setProfile(DEFAULT); write(DEFAULT); }

  return { profile, update, clear };
}
