import type { ChangeEvent } from 'react';

interface ChipProps {
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

/** A real checkbox, visually restyled as a chip. */
export function Chip({ name, value, label, checked, onChange }: ChipProps) {
  return (
    <label className="relative inline-flex cursor-pointer">
      <input type="checkbox" name={name} value={value} checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        className={`inline-flex min-h-11 items-center gap-2 rounded-full border-2 px-4 py-2 text-base leading-tight motion-safe:transition-colors peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-deep ${
          checked ? 'border-deep bg-deep text-white' : 'border-mute bg-white text-ink hover:bg-tint'
        }`}
      >
        <span aria-hidden="true" className="inline-block w-4 text-center font-bold">
          {checked ? '✓' : '+'}
        </span>
        {label}
      </span>
    </label>
  );
}
