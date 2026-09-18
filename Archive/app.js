const reflection = [
  ["You're attending a 90-minute presentation. What helps you most?", ["Listening continuously works well for me", "Short breaks help me refocus", "Activities or questions keep me engaged", "I often lose concentration regardless"]],
  ["Someone explains an unfamiliar idea quickly. What usually works best?", ["I understand immediately", "Give me an example", "Let me see it visually", "Give me time to process it"]],
  ["A facilitator gives six verbal instructions at once. What happens?", ["I remember them easily", "I remember most", "I need them written down", "I usually lose track"]],
  ["You receive three pages of dense instructions. Your reaction?", ["Fine — I prefer detailed text", "I scan for key points", "I wish there were headings or visuals", "I feel overwhelmed before starting"]],
  ["You understand an idea but are unexpectedly asked to explain it to the whole room.", ["Easy", "I can, but prefer preparation time", "I'd explain it better another way", "My performance would not reflect my understanding"]],
  ["You're learning while people nearby are talking and moving around.", ["It doesn't affect me", "Slightly distracting", "Significantly affects my concentration", "I need a quieter environment"]],
  ["After several hours of learning, what happens to your performance?", ["It remains fairly consistent", "I need occasional breaks", "My concentration drops noticeably", "My performance varies substantially"]],
  ["If you truly understand something, which format best lets you demonstrate it?", ["Written explanation", "Spoken explanation", "Visual/example/demonstration", "It depends on what I am learning"]]
];

const weights = [14, 13, 14, 12, 12, 13, 12, 10];
const responseValues = [
  [100, 65, 30, 0], [100, 65, 30, 0], [100, 65, 30, 0], [100, 65, 30, 0],
  [100, 65, 30, 0], [100, 65, 30, 0], [100, 65, 30, 0], [75, 75, 35, 0]
];
let stage = 'landing', index = 0, personal = [];
const app = document.querySelector('#app');

const wordmark = () => `<div class="wordmark"><span class="mark" aria-hidden="true"></span>Designed for Difference</div>`;
const footer = () => `<footer class="footer">Vibecoded by <a href="https://linkedin.com/in/maylyntan" target="_blank" rel="noreferrer">Dr Maylyn Tan</a></footer>`;
const progress = (total, current) => `<div class="progress" aria-label="Question ${current} of ${total}">${Array.from({ length: total }, (_, i) => `<span class="${i < current ? 'active' : ''}"></span>`).join('')}</div>`;
const button = (text, action, className = 'primary-button') => `<button class="${className}" data-action="${action}">${text}</button>`;
const header = (action, label) => `<div class="topbar">${wordmark()}${action ? `<button class="back" data-action="${action}">${label}</button>` : ''}</div>`;

function render() {
  if (stage === 'landing') return renderLanding();
  if (stage === 'reflection') return renderQuestion();
  if (stage === 'result') return renderResult();
  renderLens();
}

function renderLanding() {
  app.innerHTML = `<section class="screen landing">${header()}<div><h1>Have you ever been disabled by a learning environment?</h1><p class="lead"><span>Not medically disabled.</span>Simply prevented from learning as well as you could have.</p></div><div>${button('Find out →', 'start')}<p class="quiet-note">No diagnosis. No personal health information. About 3 minutes.</p></div>${footer()}</section>`;
}

function renderQuestion() {
  const [question, options] = reflection[index];
  const current = index + 1;
  app.innerHTML = `<section class="screen question">${header('back', '← Back')}<div class="question-topline"><p class="screen-label">Your experience · ${current} of 8</p>${progress(8, current)}</div><h1>${question}</h1><p class="question-copy">Choose the answer that feels most true for you.</p><div class="choices">${options.map((option, i) => `<button class="choice" data-choice="${i}">${option}</button>`).join('')}</div>${footer()}</section>`;
}

function score() {
  const total = personal.reduce((sum, answer, i) => sum + weights[i] * responseValues[i][answer], 0);
  return Math.max(1, Math.round(total / 100));
}

function summary() {
  const factors = [];
  if (personal[0] >= 1 || personal[6] >= 1) factors.push('pace, breaks or stamina');
  if (personal[1] >= 1 || personal[2] >= 1 || personal[3] >= 1) factors.push('how information is explained and structured');
  if (personal[4] >= 1 || personal[7] >= 2) factors.push('how you participate or demonstrate understanding');
  if (personal[5] >= 1) factors.push('the sensory environment');
  if (!factors.length) return 'Across these eight situations, you reported that the conditions described rarely change how you learn or demonstrate understanding.';
  const list = factors.length === 1 ? factors[0] : `${factors.slice(0, -1).join(', ')} and ${factors.at(-1)}`;
  return `Your answers suggest that ${list} can shape how easily you access, process or demonstrate learning.`;
}

function meaning(s) {
  if (s >= 80) return 'You reported relatively little change across the learning conditions in this reflection. A high score is not “better”; it only means these particular conditions appeared less influential for you.';
  if (s >= 50) return 'You reported that some learning conditions can make a noticeable difference. The score reflects context sensitivity, not ability or diagnosis.';
  return 'You reported that learning conditions can substantially shape your experience. The score reflects how strongly context may influence access, not your capability or a diagnosis.';
}

function socialStatement(s) {
  if (s >= 80) return 'These particular learning conditions appeared less influential for me.';
  if (s >= 50) return 'Some learning conditions can make a noticeable difference for me.';
  return 'Learning conditions can substantially shape my experience.';
}

function homepageUrl() {
  return /^https?:$/.test(window.location.protocol) ? window.location.origin : 'Designed for Difference';
}

function roundedRect(context, x, y, width, height, radius) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
}

function wrapCanvasText(context, text, maxWidth) {
  const words = text.split(' '); const lines = []; let line = '';
  words.forEach(word => {
    const candidate = line ? `${line} ${word}` : word;
    if (context.measureText(candidate).width > maxWidth && line) { lines.push(line); line = word; } else line = candidate;
  });
  if (line) lines.push(line);
  return lines;
}

function scoreCardBlob() {
  const canvas = document.createElement('canvas'); canvas.width = 1080; canvas.height = 1080;
  const context = canvas.getContext('2d'); const s = score();
  context.fillStyle = '#ffffff'; context.fillRect(0, 0, 1080, 1080);
  context.fillStyle = '#007d75'; roundedRect(context, 96, 88, 54, 54, 16); context.fill();
  context.strokeStyle = '#ffffff'; context.lineWidth = 5; context.beginPath(); context.arc(123, 115, 11, 0, Math.PI * 2); context.stroke();
  context.fillStyle = '#075a58'; context.font = '700 32px system-ui, sans-serif'; context.fillText('Designed for Difference', 174, 124);
  context.fillStyle = '#075a58'; context.font = '700 25px system-ui, sans-serif'; context.fillText('MY REFLECTION SCORE', 96, 248);
  context.fillStyle = '#075a58'; context.font = '800 238px system-ui, sans-serif';
  const scoreText = String(s); const scoreX = 96; const scoreBaseline = 468;
  const scoreWidth = context.measureText(scoreText).width; context.fillText(scoreText, scoreX, scoreBaseline);
  context.fillStyle = '#52666a'; context.font = '600 50px system-ui, sans-serif'; context.textBaseline = 'middle';
  context.fillText('/ 100', scoreX + scoreWidth + 38, scoreBaseline - 82); context.textBaseline = 'alphabetic';
  context.fillStyle = '#5c2467'; context.font = '800 42px system-ui, sans-serif'; context.fillText('Variation-Independence Score', 96, 536);
  context.fillStyle = '#eef8f7'; roundedRect(context, 96, 602, 888, 228, 22); context.fill();
  context.fillStyle = '#112f36'; context.font = '700 50px system-ui, sans-serif';
  const lines = wrapCanvasText(context, socialStatement(s), 760);
  lines.slice(0, 3).forEach((line, i) => context.fillText(line, 138, 680 + i * 62));
  context.fillStyle = '#52666a'; context.font = '400 27px system-ui, sans-serif'; context.fillText('A reflection on context — not ability or diagnosis.', 96, 905);
  context.fillStyle = '#075a58'; context.fillRect(96, 956, 888, 2);
  context.font = '600 27px system-ui, sans-serif'; context.fillText(homepageUrl(), 96, 1012);
  return new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
}

async function shareScoreCard(buttonElement) {
  buttonElement.disabled = true; buttonElement.textContent = 'Creating your score card…';
  try {
    const blob = await scoreCardBlob();
    if (!blob) throw new Error('Unable to create image');
    const file = new File([blob], 'my-d4d-score.png', { type: 'image/png' });
    const shareData = { files: [file], title: 'My Variation-Independence Score', text: `${socialStatement(score())} ${homepageUrl()}` };
    if (navigator.canShare?.(shareData)) await navigator.share(shareData);
    else {
      const url = URL.createObjectURL(blob); const download = document.createElement('a');
      download.href = url; download.download = 'my-d4d-score.png'; document.body.append(download); download.click(); download.remove(); URL.revokeObjectURL(url);
      toast('Your score card has been downloaded.');
    }
  } catch (error) {
    if (error.name !== 'AbortError') toast('We could not create your score card. Please try again.');
  } finally {
    buttonElement.disabled = false; buttonElement.textContent = 'Share my Variation-Independence Score';
  }
}

function renderResult() {
  const s = score();
  app.innerHTML = `<section class="screen result">${header('start-over', 'Start over')}<div><p class="screen-label">Your reflection score</p><div class="score">${s}<span aria-hidden="true"> / 100</span></div><p class="band">Variation-Independence Score</p></div><div class="report"><h1>What your answers tell us</h1><p>${summary()}</p></div><div class="result-section"><h2>What this score means</h2><p>${meaning(s)}</p></div><p class="explanation">This is a reflection on the interaction between person, task and environment. It does not assess ability, disability or health.</p><div>${button('Use the Barrier Lens →', 'lens')}</div>${footer()}</section>`;
}

function renderLens() {
  app.innerHTML = `<section class="screen lens">${header('back', '← Back')}<div><p class="screen-label">A different starting point</p><h1>Before asking “What is wrong with this learner?”, try three different questions.</h1></div><div class="lens-chain"><div class="lens-card"><strong>PERSON</strong><p>What difference is this learner experiencing?</p></div><div class="arrow">↓</div><div class="lens-card"><strong>TASK</strong><p>What are we actually asking them to do?</p></div><div class="arrow">↓</div><div class="lens-card"><strong>ENVIRONMENT</strong><p>Which part of the environment turns that difference into a barrier?</p></div></div><p class="equation">Difference ≠ Disability<br>Difference × Environment → Barrier</p><div class="button-stack">${button('Share my Variation-Independence Score', 'share-score', 'secondary-button')}<a class="primary-button guidance-link" href="https://admissionsguide.netlify.app/" target="_blank" rel="noreferrer">I want guidance to design for difference →</a></div>${footer()}</section>`;
}

function toast(message) {
  const node = document.createElement('div'); node.className = 'toast'; node.textContent = message; node.setAttribute('role', 'status'); document.body.append(node); setTimeout(() => node.remove(), 2600);
}

app.addEventListener('click', async event => {
  const target = event.target.closest('button'); if (!target) return;
  const action = target.dataset.action;
  if (target.dataset.choice !== undefined) {
    const answer = Number(target.dataset.choice); target.classList.add('selected');
    if (navigator.vibrate) navigator.vibrate(12);
    setTimeout(() => { personal[index] = answer; index += 1; if (index === reflection.length) { stage = 'result'; index = 0; } render(); }, 230);
    return;
  }
  if (action === 'start') { stage = 'reflection'; index = 0; }
  if (action === 'back') { if (stage === 'reflection' && index === 0) stage = 'landing'; else if (stage === 'reflection') index -= 1; else stage = 'result'; }
  if (action === 'start-over') { stage = 'landing'; index = 0; personal = []; }
  if (action === 'lens') stage = 'lens';
  if (action === 'share-score') {
    await shareScoreCard(target);
    return;
  }
  render();
});

render();
