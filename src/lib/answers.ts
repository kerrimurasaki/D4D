export type Kind = 'text' | 'procedural' | 'both';
export type Sequence = 'yes' | 'no' | 'not-sure';
export type Presence = 'present' | 'standalone' | 'mixed';

export interface Answers {
  material: string; // Q1
  kind: Kind | null; // Q2
  sequence: Sequence | null; // Q3
  outcome: string; // Q4
  competency: string; // Q5 field A
  delivery: string; // Q5 field B
  presence: Presence | null; // Q6
  constraints: string[]; // Q7 chip ids
  constraintsOther: string;
  barriers: string[]; // Q8 chip ids
  barriersOther: string;
}

export const emptyAnswers: Answers = {
  material: '',
  kind: null,
  sequence: null,
  outcome: '',
  competency: '',
  delivery: '',
  presence: null,
  constraints: [],
  constraintsOther: '',
  barriers: [],
  barriersOther: '',
};

export const TOTAL_STEPS = 8;

export const MATERIAL_MIN_LENGTH = 20;
