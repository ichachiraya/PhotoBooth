import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { en, type Dictionary } from './en';
import { th } from './th';

export type Lang = 'en' | 'th';

const DICTIONARIES: Record<Lang, Dictionary> = { en, th };
const STORAGE_KEY = 'photobooth.lang';

interface I18nContextValue {
  lang: Lang;
  t: Dictionary;
  setLang: (lang: Lang) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function readStoredLang(): Lang | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'en' || stored === 'th' ? stored : null;
  } catch {
    return null;
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  // Default language is English; a previously-chosen language wins if stored.
  const [lang, setLangState] = useState<Lang>(() => readStoredLang() ?? 'en');

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // localStorage unavailable (private mode, etc.) — language just won't persist.
    }
  }, [lang]);

  const value = useMemo<I18nContextValue>(
    () => ({ lang, t: DICTIONARIES[lang], setLang: setLangState }),
    [lang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within an I18nProvider');
  return ctx;
}
