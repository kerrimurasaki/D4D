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
    ['The material itself', 'Advice on a description of your handout is only advice on the description.'],
    ['The outcome, as an observable action', '“Understand buoyancy” cannot be redesigned. “Fold a boat that floats for two minutes” can.'],
    ['Competency vs delivery', 'The competency is protected; everything else is negotiable. Most educators have never separated the two on paper.'],
    ['Present or standalone', 'If you are in the room, some barriers get handled live. If it is a handout, every one has to be designed out.'],
    ['Hard constraints', 'Time, room, equipment, assessment regulations. Suggestions you cannot implement waste the exchange.'],
    ['Known barriers, described by function', '“Two learners cannot use the stairs” is usable. A diagnosis is not yours to put into a general-purpose tool.'],
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
    title: 'Where to stop and refer',
    lede: 'AI to understand and to design. Your accessibility or disability service to decide. Stop and refer when:',
    items: [
      'A learner asks for a formal adjustment to an assessment, or anything affecting a grade or a progression decision',
      'You are being asked to judge whether an adjustment is reasonable, or whether it changes what is being assessed',
      'A learner discloses a diagnosis, a medical condition, or a mental-health difficulty to you',
      'Needs appear multiple or interacting, or the situation feels beyond ordinary teaching adjustment',
      'An AI tool gives you a confident, specific accommodation recommendation — that fluency is not expertise, and you are not positioned to check it',
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
    kicker: 'Take-home toolkit · version 2',
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
    tableNeed: 'What you need',
    tableWhy: 'Why it changes the answer',
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
