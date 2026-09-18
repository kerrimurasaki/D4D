/** All user-facing strings that are not questions or prompt text. */

export const copy = {
  appName: 'Design for Differences',
  skipLink: 'Skip to main content',

  landing: {
    kicker: 'Prompt pack · interactive',
    title: 'Get the right redesign prompts for your teaching material',
    lede: 'Answer eight short questions about something you teach. You get the UDL redesign prompts that fit it, already filled in, ready to paste into whichever AI assistant you use.',
    privacy: 'Everything stays in your browser. Nothing is sent to a server.',
    time: 'About 5 minutes',
    start: 'Start',
    resume: 'Continue where you left off',
    startOver: 'Start over',
    allPrompts: 'See all seven prompts',
    needTitle: "What you'll need",
    needLede: 'Having these to hand turns a twenty-minute exchange into a five-minute one.',
  },

  // The pack's pre-flight table.
  preflight: [
    ['Your actual material', 'If you only describe your handout, the AI can only comment on your description. Paste in the real material to get advice on the real thing.'],
    ['What learners must be able to do (something you can see)', '“Understand buoyancy” is too vague to redesign. “Fold a paper boat that floats for two minutes” is clear, so the AI has something concrete to work with.'],
    ['The skill versus how you teach it', 'The skill you are assessing must stay the same. How you teach it can change. Most educators have never written these two down separately.'],
    ['Will you be there?', 'If you are in the room, you can deal with some difficulties as they come up. If learners use the material on their own, such as a handout or an online lesson, every difficulty has to be removed beforehand.'],
    ['What you cannot change', 'For example, lesson time, room layout, equipment, budget or assessment rules. Advice you cannot carry out is wasted.'],
    ['Known difficulties, described by what is hard to do', '“Two learners cannot use the stairs” is useful. A diagnosis is not needed, and it is private information that should not go into a public AI tool.'],
  ] as [string, string][],

  interview: {
    stepOf: (step: number, total: number) => `${step} of ${total}`,
    announce: (step: number, total: number, name: string) => `Step ${step} of ${total}, ${name}`,
    back: 'Back',
    next: 'Next',
    seeResults: 'See my prompts',
    skip: 'Skip this',
    backToResults: 'Back to my prompts',
    startOver: 'Start over',
    confirmStartOver: 'Clear all your answers and start again?',
    required: 'Required',
    optional: 'Optional — you can skip this',
    materialLabel: 'Your material',
    materialError: 'Add a bit more so the prompts can refer to it.',
    kindError: 'Choose one so the prompts use the right lens.',
    outcomeLabel: 'By the end, the learner can…',
    outcomeError: 'Say what the learner must be able to do, so the prompts have something to aim at.',
    outcomeNudge: "That's hard to design around. Can you name something observable?",
    keepAnyway: 'Keep it anyway',
    competencyLabel: 'The part that must not change',
    competencyHint: 'This is the competency.',
    deliveryLabel: 'The part that could be done another way',
    deliveryHint: 'This is the delivery.',
    constraintsOtherLabel: "Anything else that's fixed",
    barriersOtherLabel: 'Anything else, described as a barrier',
    chipsLegendHint: 'Choose any that apply.',
    optionsLegendHint: 'Choose one.',
  },

  privacyGuard: {
    title: 'Worth rewording.',
    body: "It looks like there's a diagnosis or a named learner in here. The prompts work better with the barrier described instead — and that information isn't yours to put into a general-purpose AI tool.",
    dismiss: 'Dismiss',
  },

  results: {
    kicker: 'Your prompts',
    title: 'Run these, in this order.',
    intro: 'Paste them into your AI assistant one at a time, in the same conversation, and read each answer before moving on.',
    skipped: (n: number) =>
      `${n} ${n === 1 ? 'answer' : 'answers'} skipped — prompts will ask for ${n === 1 ? 'this' : 'these'}`,
    skippedEdit: 'Answer it now',
    incompleteTitle: 'A few answers needed first',
    incompleteBody: 'The prompts need your material, what kind of material it is, and the outcome.',
    incompleteLink: (name: string) => `Go to: ${name}`,
    why: 'Why this one:',
    showPrompt: 'Show prompt',
    hidePrompt: 'Hide prompt',
    copyPrompt: 'Copy prompt',
    copied: 'Copied',
    copyFailed: 'Copy failed — select the text and copy it manually',
    announceCopied: (label: string) => `${label} copied to clipboard`,
    announceCopyFailed: 'Copy failed. Show the prompt and select the text to copy it.',
    promptLabel: (n: number, title: string) => `Prompt ${n}, ${title}`,
    stepLabel: (i: number) => `Step ${i}`,
    copyAll: 'Copy all prompts',
    copyAllDone: 'All copied',
    announceCopyAll: (n: number) => `All ${n} prompts copied to clipboard`,
    download: 'Download .md',
    announceDownload: 'Markdown file downloaded',
    downloadPdf: 'Download PDF',
    announceDownloadPdf: 'PDF downloaded',
    preparingPdf: 'Preparing…',
    editAnswers: 'Edit my answers',
    answersTitle: 'Your answers',
    answersHint: 'Change any answer and the prompts above update straight away.',
    edit: 'Edit',
    notAnswered: 'Skipped',
    allPromptsLink: 'See the whole prompt pack',
    actionsLabel: 'Prompt actions',
    statusLabel: { required: 'Required', recommended: 'Recommended', optional: 'Optional' },
  },

  reasons: {
    p1: 'Start here. It tells you what your material assumes.',
    p2: 'Three real alternatives, before anyone has to ask.',
    p3: 'Run this on your new version, not just the old one.',
    p4: "Turns the barriers you found into things nobody has to ask for.",
    p5Sequence: 'Your material has an order that matters, so an early mistake stays hidden.',
    p5SequenceAssumed:
      "You skipped the sequence question. Physical tasks usually have an order that matters, so we've assumed yours does — an early mistake stays hidden.",
    p5Standalone: 'Nobody will be there to catch a wrong turn.',
    p5Recommended: 'If any part of your material depends on order, a mistake made early can stay hidden until late.',
    p6Vision: "You've flagged a vision barrier. This is the one that actually addresses it.",
    p6Optional:
      'Worth running even with nobody visually impaired in the room — it exposes assumptions the other prompts miss.',
  },

  presenceSentence: {
    present: 'I will be in the room while learners use it.',
    standalone: 'It has to work on its own — I will not be there.',
    mixed: 'Some of each — sometimes I am in the room, sometimes it has to work on its own.',
  },

  /** §5.3 fallback lines, used in place of a skipped answer. */
  askFallback: {
    material: '[The educator did not provide the material. Ask them to paste or describe it before you give any advice.]',
    outcome: '[The educator did not specify the outcome. Ask them what the learner must be able to do at the end, as an observable action.]',
    competency: '[The educator did not specify the competency. Ask them what part of the outcome must not change before you give redesign advice.]',
    delivery: '[The educator did not say how they currently deliver it. Ask them before you suggest alternatives.]',
    presence: '[The educator did not say whether they will be present. Ask them whether the material has to work without them before you give advice.]',
    constraints: '[The educator did not list fixed constraints. Ask them what cannot change — time, room, equipment, assessment rules — before you suggest anything.]',
    barriers: '[The educator did not list known access barriers. Ask them whether they know of any, described as what is hard to do rather than as a condition.]',
  },

  skippedNames: {
    sequence: 'Whether the order matters',
    competency: 'The part that must not change',
    delivery: 'The part that could be done another way',
    presence: 'Whether you will be there',
    constraints: "What you can't change",
    barriers: 'Known access barriers',
  },

  stopAndRefer: {
    title: 'When to stop and ask for help',
    lede: "Use AI to understand the problem and to plan your teaching. Leave decisions to your school's SEN or disability support team. Stop and refer to them when:",
    items: [
      'A learner asks for an official change to an assessment, such as access arrangements for an exam, or for anything that affects their grades or promotion.',
      'You are asked to decide whether a change is fair, or whether it changes what the assessment is testing.',
      'A learner tells you about a diagnosis, a medical condition or a mental health difficulty.',
      'A learner seems to have several needs at once, or the situation feels bigger than what everyday teaching changes can handle.',
      'An AI tool confidently recommends a specific arrangement for a learner. Sounding sure is not the same as being right, and you are not in a position to check its advice.',
    ],
  },

  footer: {
    prefix: 'Vibecoded by',
    name: 'Dr Maylyn Tan',
    url: 'https://www.linkedin.com/in/maylyntan',
  },

  disclaimer:
    "A practice aid for teaching design. Not a diagnostic tool, an accommodation-decision tool, or a legal determination. Formal adjustments are decided by your institution's accessibility service under institutional policy and applicable law.",

  pack: {
    title: 'The Design for Differences Prompt Pack',
    sub: 'Seven prompts for any AI assistant. Start with prompt 0 — it decides which of the others you need.',
    whyTitle: 'Why prompt 0 exists.',
    why: 'Written material and physical procedures fail in different places. A handout fails on reading load, structure and vocabulary. A folding task, a lab technique or a machine checklist fails on mental rotation, motor demand and packed actions. Run the wrong lens over your material and you get confident, plausible, useless advice — so the pack asks what it is before it advises.',
    neverTitle: 'Never paste identifying details about a real learner',
    never: 'into a general-purpose AI tool. Describe the barrier, not the person.',
    appCallout: 'Prefer not to answer prompt 0 in a chat window?',
    appCalloutLink: 'Let this app ask the questions instead',
    startHere: 'Start here',
    coreTitle: 'The four plus two core prompts',
    coreLede:
      'Each has a shared opening and a track-specific lens. Use the lens prompt 0 told you to use. If it said BOTH, run both lenses and merge the findings yourself.',
    textLens: 'Text lens',
    textLensAdd: 'add this:',
    procLens: 'Procedural lens',
    procLensAdd: 'add this instead:',
    readyTitle: 'What to have ready before you start',
    readyLede: 'Prompt 0 will ask for all of these. Having them to hand turns a twenty-minute exchange into a five-minute one.',
    tableNeed: 'What to prepare',
    tableWhy: 'Why it matters',
  },

  export: {
    heading: 'Design for Differences — your prompts',
    intro: 'Run these in order, one at a time, in the same conversation with your AI assistant.',
    fileName: 'design-for-differences-prompts.md',
    pdfFileName: 'design-for-differences-prompts.pdf',
  },

  titles: {
    landing: 'Design for Differences',
    step: (step: number, total: number, name: string) => `Step ${step} of ${total}: ${name} — Design for Differences`,
    results: 'Your prompts — Design for Differences',
    prompts: 'All prompts — Design for Differences',
    notFound: 'Page not found — Design for Differences',
  },

  notFound: {
    title: 'That page does not exist',
    home: 'Go to the start',
  },
};
