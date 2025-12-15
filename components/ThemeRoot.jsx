"use client";
import { useEffect } from "react";
import { useSettings } from "@/hooks/useSettings";

const FALLBACK_THEME = "dark";

export default function ThemeRoot() {
  const { settings } = useSettings();

  useEffect(() => {
    const theme = settings?.theme || FALLBACK_THEME;
    const root = document.documentElement;
    root.dataset.theme = theme;
  }, [settings?.theme]);

  return null;
}
