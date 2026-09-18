/**
 * Prompt templates — single source of truth.
 *
 * `packText` is The Design for Differences Prompt Pack, version 2, verbatim. The app's
 * `base` is derived from it by replacing the pack's manual markers only, so the two can
 * never drift apart. The preamble and closing are added by lib/assemble.ts.
 */

export type PromptId = 'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6';

export type Placeholder =
  | 'material'
  | 'outcome'
  | 'competency'
  | 'delivery'
  | 'presence'
  | 'constraints'
  | 'barriers';

export interface PromptTemplate {
  id: PromptId;
  number: number;
  title: string;
  tagline: string;
  /** Grey explainer paragraph from the pack, shown as a tip. */
  intro?: string;
  /** Pack text, uninterpolated, as printed. */
  packText: string;
  /** Pack text with markers replaced by {{placeholders}} or instructions to the AI. */
  base: string;
  lenses?: {
    text?: string;
    procedural?: string;
  };
}

/** Replace each manual marker in the pack text; throws if a marker is missing so edits can't silently drift. */
function fromPack(packText: string, substitutions: [marker: string, replacement: string][]): string {
  return substitutions.reduce((text, [marker, replacement]) => {
    if (!text.includes(marker)) throw new Error(`Marker ${marker} not found in prompt text`);
    return text.split(marker).join(replacement);
  }, packText);
}

const SEE_ABOVE = 'see "My material" above';

export const PREAMBLE = `You are helping an educator redesign teaching material using Universal Design for
Learning. I am not a disability specialist, so explain things plainly and avoid jargon.

My material: {{material}}

What the learner must be able to do at the end: {{outcome}}
The part that must not change: {{competency}}
The part that could be done another way: {{delivery}}
Where it's used: {{presence}}
Fixed constraints: {{constraints}}
Access barriers I already know about: {{barriers}}

---`;

export const CLOSING = `---
Before you finish, tell me anything you needed and had to assume. Do not invent detail
about my learners or my room.`;

export const MERGE_INSTRUCTION =
  'Run both lenses and give me one combined list, flagging anything that appears in both.';

/** Added to prompt 3 when the material has to work without the educator present. */
export const STANDALONE_P3_LINE =
  'This material has to work without me in the room. Treat every point where a learner would need to ask me something as a failure of the design, not a fallback.';

export const ROUTING_PROMPT = {
  number: 0,
  title: 'Route my material',
  tagline: 'Always run this first',
  packText: `You are helping an educator redesign teaching material using Universal Design for
Learning. I am not a disability specialist, so explain things plainly.

Before giving me any advice, interview me. Ask ONE question at a time and wait for my
answer. Do not skip ahead, and do not offer suggestions until the interview is finished.

Ask me:
1. What is the material? I will paste it or describe it.
2. Is it (a) something to read or understand, (b) something to physically do,
   or (c) both?
3. What must the learner be able to do at the end? State it as an observable action.
4. Which part of that is the actual competency being assessed, and which part is just
   how I happen to deliver it?
5. Will I be present while they use it, or does it have to work on its own?
6. What is fixed and cannot change - time, room, equipment, assessment rules?
7. Is there anything about access barriers in this group I already know?
   Describe barriers only. Do not ask me to name conditions or individuals.

When the interview is done, tell me:
- Which track applies: TEXT, PROCEDURAL, or BOTH.
- Which of prompts 1-6 I should run, and in what order.
- Anything you still need from me before prompt 1 will work.

Do not begin the redesign yet.`,
};

const p1Pack = `Here is my material: [PASTE]
Here is the outcome learners must reach: [FROM PROMPT 0]

Go through it one section or numbered step at a time. For each one, tell me what it
assumes the learner can already do, and where exactly the hard point is.

Before you finish, ask me any question you need in order to be accurate about my room,
my equipment or my learners. Do not guess.`;

const p2Pack = `Outcome: [FROM PROMPT 0]
How I currently deliver it: [DESCRIBE]

Give me three genuinely different routes to the same outcome. Not three rewordings of
the same channel - three different channels.

For each route tell me: (a) what it is, (b) who it works better for, (c) what it costs
me to prepare the first time and every time after, (d) what it does NOT solve.

Keep every route realistic for one person with limited prep time and no extra budget.
Ask me what equipment I actually have before you assume any of it.`;

const p3Pack = `Here is my improved material: [PASTE]

Interrogate it honestly. Do not reassure me.
1. Who would find this harder than I intend, and at which exact point?
2. What does it assume about vision, hearing, fine motor control, mental rotation,
   language, technology access, private space, or confidence to ask for help?
3. Where would a learner have to identify themselves in order to get what they need?
   That is a disclosure I have designed in. Name every one.
4. What is the smallest change that removes each one?

Then tell me which of your own suggestions you are least confident about, and why.`;

const p4Pack = `Here are the barriers you identified: [PASTE]
Here is how a learner currently gets help in my session: [DESCRIBE]

For each barrier, tell me what I could set up IN ADVANCE, available to everyone, so that
no learner has to identify themselves, explain themselves, or ask.

For each suggestion state:
- what I prepare once, before the session
- what it costs the first time, and what it costs thereafter
- whether it is visible to the room as a special provision (it should not be)
- what genuinely cannot be handled this way and should go to the accessibility service

Be honest about that last list. I would rather know the limits.`;

const p5Pack = `Here is my material: [PASTE]

For every step or section, write a one-line self-check the learner can apply alone,
without asking me and without comparing themselves to a neighbour.

Rules for the checks:
- Describe an observable state, not a feeling. "You should see four layers" - not
  "it should feel about right."
- Where sight is not reliable, give a check by touch, count or weight instead.
- Never phrase a check as a question the learner cannot answer without already knowing
  the answer.

Then produce a separate troubleshooting list written from the learner's SYMPTOM, not
from the step number - a stuck learner knows what they can see, not what caused it.
For each symptom, name the step to return to. Never say "start again."

Finally, tell me which single step, if done wrong, causes the most damage furthest
downstream. That is where my attention should go.`;

const p6Pack = `Rewrite my material so it works for a learner who cannot see it, and who is not
listening to someone describe pictures to them.

Rules:
- Replace every appearance cue with position, orientation, count or texture.
  "Fold the top corner down" becomes "with the folded edge away from you, take the
  corner nearest your right hand."
- Fix a reference frame at the start and never change it silently. Announce every
  rotation as its own separate instruction.
- Give layer counts, edge counts, and which edges are open and which are closed.
- Replace every visual self-check with a tactile or countable one.
- Left and right are relative to the learner, never to me. Never write "as shown."
- Never use colour to carry meaning.

Then tell me:
(a) which steps could not be made sight-independent, and why
(b) what physical preparation would close that gap - a tactile reference object, a
    pre-marked material, a partner with a defined role
(c) what I should ask the learner beforehand about their own preferred reference terms.
    Some people work from clock positions, others from body sides. Do not assume.`;

export const PROMPTS: Record<PromptId, PromptTemplate> = {
  p1: {
    id: 'p1',
    number: 1,
    title: 'Barrier scan',
    tagline: 'What does this assume?',
    packText: p1Pack,
    base: fromPack(p1Pack, [
      ['[PASTE]', SEE_ABOVE],
      ['[FROM PROMPT 0]', '{{outcome}}'],
    ]),
    lenses: {
      text: `Report per section:
- Reading load: sentence length, unfamiliar words, terms used before they are defined
- Structure: how much has to be held in mind before the section makes sense
- Implicit knowledge: what is assumed but never stated
- Idiom and culture: references that will not travel to every learner
- Where a learner would have to ask me a question in order to continue`,
      procedural: `Report per step:
- Action count: how many distinct physical actions are packed into this one step
- Spatial language: words requiring the learner to rotate, flip, or picture the object
  from another angle
- Motor demand: grip strength, fine control, two-handed coordination, number of layers
  or moving parts
- Sequence risk: would an error here stay invisible until several steps later
- Self-check: how would a learner know, unaided, that this step is correct
Flag any step scoring high on more than two of these.`,
    },
  },
  p2: {
    id: 'p2',
    number: 2,
    title: 'Channel multiplier',
    tagline: 'Before anybody asks',
    packText: p2Pack,
    base: fromPack(p2Pack, [
      ['[FROM PROMPT 0]', '{{outcome}}'],
      ['[DESCRIBE]', '{{delivery}}'],
    ]),
    lenses: {
      text: `Include at least: a plain-language version at roughly half the word count; an audio-first
version written to be listened to rather than read aloud from the page; and a version
where the structure is visible before the detail - a map, a diagram, or a
headings-only skeleton.`,
      procedural: `Include at least: a low-language version with one action per step and a maximum of eight
words per step; a physical-scaffold version - what could I prepare in advance so a
learner copies rather than decodes, such as pre-marked materials or a worked example at
each stage; and a paired version where two learners work together with defined roles.`,
    },
  },
  p3: {
    id: 'p3',
    number: 3,
    title: 'Who does this exclude?',
    tagline: 'Run it on the new version too',
    intro:
      'Running this on the new design is not optional. Redesigns routinely introduce fresh exclusions — a partner activity added for engagement can exclude the learner who will not speak in front of peers.',
    packText: p3Pack,
    base: fromPack(p3Pack, [
      [
        '[PASTE]',
        '[If I have not pasted a redesigned version in this conversation yet, ask me for it. Until I do, use my material above.]',
      ],
    ]),
  },
  p4: {
    id: 'p4',
    number: 4,
    title: 'Disclosure reducer',
    tagline: 'The point of all of it',
    packText: p4Pack,
    base: fromPack(p4Pack, [
      [
        '[PASTE]',
        'the ones from the earlier prompts in this conversation, plus the ones I listed above. [If you do not have the earlier findings, ask me to paste them.]',
      ],
      [
        '[DESCRIBE]',
        '[The educator has not described this. Ask them how a learner currently gets help before you give suggestions.]',
      ],
    ]),
  },
  p5: {
    id: 'p5',
    number: 5,
    title: 'Checkpoints',
    tagline: 'Any material with a sequence',
    intro:
      'The commonest silent failure in both tracks: the learner goes wrong early, finds out late, and cannot recover without restarting. Checkpoints are cheap to write, almost never written, and the highest-value thing AI adds to a set of instructions.',
    packText: p5Pack,
    base: fromPack(p5Pack, [['[PASTE]', SEE_ABOVE]]),
  },
  p6: {
    id: 'p6',
    number: 6,
    title: 'Sight-independent version',
    tagline: 'Not a described picture',
    intro:
      "Most “accessible” instructions describe the visuals aloud. That still asks the learner to build a mental image from someone else's viewpoint. A genuinely sight-independent version replaces appearance with position, count and touch.",
    packText: p6Pack,
    base: p6Pack,
  },
};
