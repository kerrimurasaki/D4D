interface OptionCardProps {
  name: string;
  value: string;
  label: string;
  hint?: string;
  checked: boolean;
  onChange: () => void;
  describedBy?: string;
}

/** A real radio button, visually restyled as a selectable card. */
export function OptionCard({ name, value, label, hint, checked, onChange, describedBy }: OptionCardProps) {
  const hintId = hint ? `${name}-${value}-hint` : undefined;
  return (
    <label className="relative block cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        aria-describedby={[hintId, describedBy].filter(Boolean).join(' ') || undefined}
        className="peer sr-only"
      />
      <span
        className={`flex min-h-11 items-start gap-3 rounded-xl border-2 p-4 motion-safe:transition-colors peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-deep ${
          checked ? 'border-deep bg-tint' : 'border-mute bg-white hover:bg-sand'
        }`}
      >
        <span
          aria-hidden="true"
          className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full border-2 border-deep bg-white"
        >
          {checked && <span className="h-2.5 w-2.5 rounded-full bg-deep" />}
        </span>
        <span>
          <span className="block font-semibold text-deep">{label}</span>
          {hint && (
            <span id={hintId} className="mt-0.5 block text-sm text-mute">
              {hint}
            </span>
          )}
        </span>
      </span>
    </label>
  );
}
