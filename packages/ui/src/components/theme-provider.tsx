"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Mode = "light" | "dark";

interface ThemeCtx {
  mode: Mode;
  setMode: (m: Mode) => void;
}

const Ctx = createContext<ThemeCtx>({
  mode: "light",
  setMode: () => {},
});

const STORAGE_MODE = "iui:mode";

export function ThemeProvider({
  defaultMode = "light",
  children,
}: {
  defaultMode?: Mode;
  children: ReactNode;
}) {
  const [mode, setModeState] = useState<Mode>(defaultMode);

  useEffect(() => {
    const m = (localStorage.getItem(STORAGE_MODE) as Mode | null) ?? defaultMode;
    setModeState(m);
    document.documentElement.dataset.mode = m;
  }, [defaultMode]);

  const setMode = useCallback((m: Mode) => {
    setModeState(m);
    document.documentElement.dataset.mode = m;
    localStorage.setItem(STORAGE_MODE, m);
  }, []);

  return <Ctx.Provider value={{ mode, setMode }}>{children}</Ctx.Provider>;
}

export function useTheme() {
  return useContext(Ctx);
}

export const themeBootstrapScript = `(function(){try{
var m=localStorage.getItem('${STORAGE_MODE}')||'light';
document.documentElement.dataset.mode=m;
}catch(e){}})();`;
