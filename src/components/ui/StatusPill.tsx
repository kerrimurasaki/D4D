import type { Status } from '../../lib/router';
import { copy } from '../../content/copy';

const styles: Record<Status, string> = {
  required: 'bg-amber text-white',
  recommended: 'bg-sage text-white',
  optional: 'bg-mute text-white',
};

const marks: Record<Status, string> = { required: '●', recommended: '◐', optional: '○' };

/** Status carries text and a shape, never colour alone. */
export function StatusPill({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${styles[status]}`}
    >
      <span aria-hidden="true">{marks[status]}</span>
      {copy.results.statusLabel[status]}
    </span>
  );
}
