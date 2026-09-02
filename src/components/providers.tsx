"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatarSeed: string;
  city: string;
  state: string;
  bio: string | null;
  createdAt: Date;
};

type ThemeMode = "light" | "dark" | "system";
type FontScale = 1 | 1.125 | 1.25 | 1.4;

type A11yState = {
  theme: ThemeMode;
  resolvedTheme: "light" | "dark";
  setTheme: (t: ThemeMode) => void;
  fontScale: FontScale;
  setFontScale: (s: FontScale) => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
  reduceMotion: boolean;
  toggleReduceMotion: () => void;
};

const A11yContext = createContext<A11yState | null>(null);

type Toast = { id: string; title: string; description?: string; tone?: "default" | "success" | "danger" };
type ToastState = { toasts: Toast[]; push: (t: Omit<Toast, "id">) => void; dismiss: (id: string) => void };
const ToastContext = createContext<ToastState | null>(null);

type UserState = {
  user: PublicUser | null;
  setUser: (u: PublicUser | null) => void;
  unreadCount: number;
  setUnreadCount: (n: number) => void;
};
const UserContext = createContext<UserState | null>(null);

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function AppProviders({
  children,
  user,
  unreadCount,
}: {
  children: React.ReactNode;
  user: PublicUser | null;
  unreadCount: number;
}) {
  const [theme, setThemeState] = useState<ThemeMode>("light");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const [fontScale, setFontScaleState] = useState<FontScale>(1);
  const [highContrast, setHighContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [currentUser, setCurrentUser] = useState<PublicUser | null>(user);
  const [unread, setUnread] = useState(unreadCount);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  useEffect(() => {
    setUnread(unreadCount);
  }, [unreadCount]);

  useEffect(() => {
    const stored = window.localStorage.getItem("achou:theme") as ThemeMode | null;
    const storedScale = window.localStorage.getItem("achou:fontScale");
    const storedContrast = window.localStorage.getItem("achou:contrast");
    const storedMotion = window.localStorage.getItem("achou:motion");
    if (stored) setThemeState(stored);
    if (storedScale) setFontScaleState(Number(storedScale) as FontScale);
    if (storedContrast) setHighContrast(storedContrast === "1");
    if (storedMotion) setReduceMotion(storedMotion === "1");
  }, []);

  useEffect(() => {
    const apply = () => {
      const resolved = theme === "system" ? getSystemTheme() : theme;
      setResolvedTheme(resolved);
      document.documentElement.setAttribute("data-theme", resolved);
    };
    apply();
    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.addEventListener("change", apply);
      return () => mq.removeEventListener("change", apply);
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty("--a11y-scale", String(fontScale));
    document.documentElement.setAttribute("data-contrast", highContrast ? "high" : "normal");
    document.documentElement.setAttribute("data-motion", reduceMotion ? "reduce" : "normal");
  }, [fontScale, highContrast, reduceMotion]);

  const setTheme = useCallback((t: ThemeMode) => {
    setThemeState(t);
    window.localStorage.setItem("achou:theme", t);
  }, []);

  const setFontScale = useCallback((s: FontScale) => {
    setFontScaleState(s);
    window.localStorage.setItem("achou:fontScale", String(s));
  }, []);

  const toggleHighContrast = useCallback(() => {
    setHighContrast((prev) => {
      window.localStorage.setItem("achou:contrast", prev ? "0" : "1");
      return !prev;
    });
  }, []);

  const toggleReduceMotion = useCallback(() => {
    setReduceMotion((prev) => {
      window.localStorage.setItem("achou:motion", prev ? "0" : "1");
      return !prev;
    });
  }, []);

  const push = useCallback((t: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...t, id }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, 4200);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const a11yValue = useMemo<A11yState>(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      fontScale,
      setFontScale,
      highContrast,
      toggleHighContrast,
      reduceMotion,
      toggleReduceMotion,
    }),
    [theme, resolvedTheme, setTheme, fontScale, setFontScale, highContrast, toggleHighContrast, reduceMotion, toggleReduceMotion]
  );

  const userValue = useMemo<UserState>(
    () => ({ user: currentUser, setUser: setCurrentUser, unreadCount: unread, setUnreadCount: setUnread }),
    [currentUser, unread]
  );

  const toastValue = useMemo<ToastState>(() => ({ toasts, push, dismiss }), [toasts, push, dismiss]);

  return (
    <A11yContext.Provider value={a11yValue}>
      <UserContext.Provider value={userValue}>
        <ToastContext.Provider value={toastValue}>
          {children}
          <ToastViewport />
        </ToastContext.Provider>
      </UserContext.Provider>
    </A11yContext.Provider>
  );
}

function ToastViewport() {
  const ctx = useContext(ToastContext);
  if (!ctx) return null;
  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed bottom-4 right-4 z-[100] flex w-[min(92vw,360px)] flex-col gap-2"
    >
      {ctx.toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={`rise-in rounded-xl border px-4 py-3 shadow-lg backdrop-blur ${
            t.tone === "success"
              ? "bg-olive text-olive-ink border-olive"
              : t.tone === "danger"
                ? "bg-danger text-white border-danger"
                : "bg-[var(--paper-raised)] text-ink border-line"
          }`}
        >
          <p className="text-sm font-semibold">{t.title}</p>
          {t.description && <p className="text-xs opacity-80 mt-0.5">{t.description}</p>}
        </div>
      ))}
    </div>
  );
}

export function useA11y() {
  const ctx = useContext(A11yContext);
  if (!ctx) throw new Error("useA11y deve ser usado dentro de AppProviders");
  return ctx;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser deve ser usado dentro de AppProviders");
  return ctx;
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast deve ser usado dentro de AppProviders");
  return ctx;
}
