import type { Answers, Kind, Presence, Sequence } from '../lib/answers';

export interface Option<T extends string> {
  value: T;
  label: string;
  hint?: string;
}

export interface QuestionDef {
  step: number;
  /** Short name used in progress announcements and page titles. */
  name: string;
  question: string;
  helper?: string;
  required: boolean;
  /** Answer fields this step owns; cleared when the step is skipped. */
  fields: (keyof Answers)[];
}

export const QUESTIONS: QuestionDef[] = [
  {
    step: 1,
    name: 'Your material',
    question: 'What are you redesigning?',
    helper: 'This stays in your browser. It is never sent anywhere.',
    required: true,
    fields: ['material'],
  },
  {
    step: 2,
    name: 'Kind of material',
    question: 'Is this something to read, something to do, or both?',
    required: true,
    fields: ['kind'],
  },
  {
    step: 3,
    name: 'Sequence',
    question: 'Does the order matter?',
    helper: 'If a learner does step 4 before step 3, does it go wrong?',
    required: false,
    fields: ['sequence'],
  },
  {
    step: 4,
    name: 'Outcome',
    question: 'What must the learner be able to do at the end?',
    helper:
      "Write it as something you could watch them do. Not 'understand buoyancy' — 'fold a boat that floats for two minutes'.",
    required: true,
    fields: ['outcome'],
  },
  {
    step: 5,
    name: 'Competency and delivery',
    question: 'What part of that is the actual skill, and what part is just how you happen to deliver it?',
    helper:
      "Example: the competency is explaining the process. Delivering it as a spoken presentation is just how you've been doing it.",
    required: false,
    fields: ['competency', 'delivery'],
  },
  {
    step: 6,
    name: 'Presence',
    question: 'Will you be there when they use it?',
    required: false,
    fields: ['presence'],
  },
  {
    step: 7,
    name: 'Constraints',
    question: "What can't you change?",
    required: false,
    fields: ['constraints', 'constraintsOther'],
  },
  {
    step: 8,
    name: 'Known barriers',
    question: 'Anything you already know about access barriers in this group?',
    helper: "Describe what's hard to do, not who anyone is. Don't name learners or conditions.",
    required: false,
    fields: ['barriers', 'barriersOther'],
  },
];

export const questionForStep = (step: number): QuestionDef => QUESTIONS[step - 1];

export const MATERIAL_PLACEHOLDER =
  "Paste your handout, instructions, slide text or task brief — or describe it if you don't have it to hand.";

export const KIND_OPTIONS: Option<Kind>[] = [
  { value: 'text', label: 'Something to read or understand', hint: 'A handout, a reading, an explanation' },
  {
    value: 'procedural',
    label: 'Something to physically do',
    hint: 'A technique, a folding task, equipment, a lab or workshop process',
  },
  { value: 'both', label: 'Both', hint: 'Instructions for a physical task, with reading involved' },
];

export const SEQUENCE_OPTIONS: Option<Sequence>[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'not-sure', label: 'Not sure' },
];

export const PRESENCE_OPTIONS: Option<Presence>[] = [
  { value: 'present', label: "I'll be in the room" },
  { value: 'standalone', label: 'It has to work on its own' },
  { value: 'mixed', label: 'Some of each' },
];

export const NOTHING_CONSTRAINT = 'nothing';
export const CONSTRAINT_OPTIONS: Option<string>[] = [
  { value: 'time', label: 'Time in session' },
  { value: 'room', label: 'Room or layout' },
  { value: 'equipment', label: 'Equipment or budget' },
  { value: 'assessment', label: 'Assessment rules' },
  { value: 'class-size', label: 'Class size' },
  { value: 'fixed-materials', label: 'Fixed materials' },
  { value: NOTHING_CONSTRAINT, label: 'Nothing much' },
];

export const NO_BARRIERS = 'none';
export const VISION_BARRIER = 'vision';
export const BARRIER_OPTIONS: Option<string>[] = [
  { value: 'reading-writing', label: 'Reading or writing speed' },
  { value: VISION_BARRIER, label: 'Vision' },
  { value: 'hearing', label: 'Hearing' },
  { value: 'fine-motor', label: 'Fine motor control' },
  { value: 'spatial', label: 'Mental rotation / spatial' },
  { value: 'language', label: 'Language of instruction' },
  { value: 'attention', label: 'Sustained attention' },
  { value: 'stamina', label: 'Stamina or fatigue' },
  { value: 'tech-access', label: 'Technology or connectivity access' },
  { value: 'confidence', label: 'Confidence to ask for help' },
  { value: NO_BARRIERS, label: 'None that I know of' },
];
