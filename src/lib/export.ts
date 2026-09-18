/** Copy-all text and markdown export. Pure; no React imports. */
import type { AssembledPrompt } from './assemble';
import { copy } from '../content/copy';

const DIVIDER = '='.repeat(64);

function heading(item: AssembledPrompt, index: number, total: number): string {
  const { template, recommendation } = item;
  const status = copy.results.statusLabel[recommendation.status];
  return `STEP ${index + 1} OF ${total} · PROMPT ${template.number}: ${template.title.toUpperCase()} (${status})`;
}

export function copyAllText(items: AssembledPrompt[]): string {
  const blocks = items.map((item, i) => `${DIVIDER}\n${heading(item, i, items.length)}\n${DIVIDER}\n\n${item.text}`);
  return [`${copy.export.heading.toUpperCase()}\n${copy.export.intro}`, ...blocks].join('\n\n\n');
}

/** A code fence longer than any backtick run in the content, so pasted material can't break it. */
function fence(content: string): string {
  const longest = Math.max(0, ...(content.match(/`+/g) ?? []).map((run) => run.length));
  return '`'.repeat(Math.max(3, longest + 1));
}

export function markdownExport(items: AssembledPrompt[]): string {
  const lines: string[] = [`# ${copy.export.heading}`, '', copy.export.intro, ''];

  items.forEach((item, i) => {
    const { template, recommendation, text } = item;
    const f = fence(text);
    lines.push(
      `## Step ${i + 1}: Prompt ${template.number} — ${template.title}`,
      '',
      `**${copy.results.statusLabel[recommendation.status]}** · _${template.tagline}_`,
      '',
      `**${copy.results.why}** ${recommendation.reason}`,
      '',
      ...(template.intro ? [`> ${template.intro}`, ''] : []),
      `${f}text`,
      text,
      f,
      '',
    );
  });

  const { stopAndRefer } = copy;
  lines.push(`## ${stopAndRefer.title}`, '', stopAndRefer.lede, '', ...stopAndRefer.items.map((item) => `- ${item}`), '');
  lines.push('---', '', `_${copy.disclaimer}_`, '');
  return lines.join('\n');
}
