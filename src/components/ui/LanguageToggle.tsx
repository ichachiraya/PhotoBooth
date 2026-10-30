import { useI18n } from '../../i18n/useI18n';

/** Simple EN/TH text toggle — no flags, no icons, just the two labels. */
export function LanguageToggle() {
  const { lang, setLang } = useI18n();

  return (
    <div className="flex items-center gap-1 text-xs">
      <button
        type="button"
        onClick={() => setLang('en')}
        aria-pressed={lang === 'en'}
        className={`u-label px-1 ${lang === 'en' ? 'text-text' : 'text-text-secondary hover:text-text'}`}
      >
        EN
      </button>
      <span className="text-text-secondary">/</span>
      <button
        type="button"
        onClick={() => setLang('th')}
        aria-pressed={lang === 'th'}
        className={`u-label px-1 ${lang === 'th' ? 'text-text' : 'text-text-secondary hover:text-text'}`}
      >
        TH
      </button>
    </div>
  );
}
