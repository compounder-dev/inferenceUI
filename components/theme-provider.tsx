"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Mode = "dark" | "light";
export type Accent = "amber" | "ember";

interface ThemeCtx {
  mode: Mode;
  accent: Accent;
  setMode: (m: Mode) => void;
  setAccent: (a: Accent) => void;
}

const Ctx = createContext<ThemeCtx>({
  mode: "dark",
  accent: "amber",
  setMode: () => {},
  setAccent: () => {},
});

const STORAGE_MODE = "iui:mode";
const STORAGE_ACCENT = "iui:accent";

/**
 * Reads the persisted theme on the client and applies it to <html> before
 * paint to avoid the FOUC. Mounted near the top of the layout.
 */
export function ThemeProvider({
  defaultMode = "dark",
  defaultAccent = "ember",
  children,
}: {
  defaultMode?: Mode;
  defaultAccent?: Accent;
  children: ReactNode;
}) {
  const [mode, setModeState] = useState<Mode>(defaultMode);
  const [accent, setAccentState] = useState<Accent>(defaultAccent);

  useEffect(() => {
    const m = (localStorage.getItem(STORAGE_MODE) as Mode | null) ?? defaultMode;
    const a = (localStorage.getItem(STORAGE_ACCENT) as Accent | null) ?? defaultAccent;
    setModeState(m);
    setAccentState(a);
    document.documentElement.dataset.mode = m;
    document.documentElement.dataset.accent = a;
  }, [defaultMode, defaultAccent]);

  const setMode = useCallback((m: Mode) => {
    setModeState(m);
    document.documentElement.dataset.mode = m;
    localStorage.setItem(STORAGE_MODE, m);
  }, []);

  const setAccent = useCallback((a: Accent) => {
    setAccentState(a);
    document.documentElement.dataset.accent = a;
    localStorage.setItem(STORAGE_ACCENT, a);
  }, []);

  return (
    <Ctx.Provider value={{ mode, accent, setMode, setAccent }}>
      {children}
    </Ctx.Provider>
  );
}

export function useTheme() {
  return useContext(Ctx);
}

/**
 * Inline pre-paint script. Mounts as a `<script>` so that the
 * <html data-mode/-accent> attributes are present on first byte.
 */
export const themeBootstrapScript = `(function(){try{
var m=localStorage.getItem('${STORAGE_MODE}')||'dark';
var a=localStorage.getItem('${STORAGE_ACCENT}')||'ember';
var d=document.documentElement;
d.dataset.mode=m;d.dataset.accent=a;
}catch(e){}})();`;
