import { copy } from '../../content/copy';

interface ProgressBarProps {
  current: number;
  total: number;
  name: string;
}

export function ProgressBar({ current, total, name }: ProgressBarProps) {
  const percent = Math.round((current / total) * 100);
  return (
    <div className="mb-6">
      <div className="mb-2 flex items-baseline justify-between gap-4 text-sm">
        <span className="kicker">{name}</span>
        <span className="font-semibold text-mute">{copy.interview.stepOf(current, total)}</span>
      </div>
      <div
        role="progressbar"
        aria-label="Interview progress"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-valuetext={copy.interview.announce(current, total, name)}
        className="h-2 overflow-hidden rounded-full bg-tint"
      >
        <div className="h-full rounded-full bg-deep motion-safe:transition-[width]" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
