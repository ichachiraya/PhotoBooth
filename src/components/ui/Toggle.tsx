interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

/**
 * A small rectangular switch (not a rounded "pill") to match the app's
 * restrained, thin-border visual language.
 */
export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-[var(--radius-sm)] border transition-colors duration-150 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage ${
        checked ? 'border-sage bg-sage/25' : 'border-line bg-surface'
      }`}
    >
      <span
        className={`block h-4 w-4 rounded-[1px] bg-text transition-transform duration-150 ease-out ${
          checked ? 'translate-x-[22px]' : 'translate-x-[3px]'
        }`}
      />
    </button>
  );
}
