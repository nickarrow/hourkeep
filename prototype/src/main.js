// HourKeep prototype: a static, browser-only draft of the screens in docs/design.md. State lives in this browser's
// localStorage and nothing is sent anywhere. Words on screen follow .kiro/skills/interface-copy/SKILL.md.
const KEY = 'hourkeep-prototype-v2';
const MADE_BY = 'HourKeep prototype, not a release';
const REF = 'HK-2027-0142';
const PERSON = 'Jordan Lee';
const MONTH_OPTIONS = ['2026-10', '2026-11', '2026-12', '2027-01', '2027-02', '2027-03', '2027-04', '2027-05', '2027-06'];
const METHODS = ['By mail', 'Online portal', 'In person', 'By phone', 'By fax'];
const THRESHOLD = 80;

/* ---------- Sources ----------
   Every rule a screen relies on. `row` names its row in docs/domain/community-engagement-extract.md, which is the
   authority. `verified: false` means the rule comes from docs/design.md and no verified row carries it yet, so the
   screen says so rather than presenting it as checked. */
const SOURCES = {
  responsePeriod: { row: 'notice-response-period', cite: '42 CFR 435.558(a)(2)', verified: true,
    says: 'You get 30 calendar days to respond, counted from the day you receive the notice.' },
  presumedReceipt: { row: 'notice-presumed-received-after-5-days', cite: '42 CFR 435.558(c)(4)', verified: true,
    says: 'The notice counts as received 5 days after the date on it, unless you show you got it later.' },
  dayOneOpen: { row: 'notice-response-period (its Note)', cite: '42 CFR 435.558(a)(2)', verified: true,
    says: 'The rule does not say whether the day you receive the notice is the first of the 30 days. That is an open question.' },
  stateCounts: { row: null, cite: 'docs/design.md, The letter; research L4-23, L6-3, L6-5', verified: false,
    says: 'States describe the count differently. Some count from the date the notice was issued.' },
  coverageContinues: { row: 'coverage-continues-during-noncompliance', cite: '42 CFR 435.558(a)(3)', verified: true,
    says: 'If you are enrolled, your Medicaid continues until the state decides you are not eligible.' },
  noticeSaysHow: { row: 'notice-says-how-to-show-compliance', cite: '42 CFR 435.558(c)(1)(i)', verified: true,
    says: 'The notice must say which months the state is checking and how to show you met the requirement.' },
  noticeSaysNotApply: { row: 'notice-says-how-to-show-not-applicable', cite: '42 CFR 435.558(c)(1)(ii)', verified: true,
    says: 'The notice must say how to show the requirement does not apply to you.' },
  noticeDeadline: { row: 'notice-states-the-deadline', cite: '42 CFR 435.558(c)(1)(iii)', verified: true,
    says: 'The notice must clearly state the deadline.' },
  otherBases: { row: 'consider-all-other-bases-before-denial', cite: '42 CFR 435.558(d)(1)', verified: true,
    says: 'Before ending coverage, the state must check every other way you might qualify.' },
  hearingRight: { row: 'hearing-required-on-request', cite: '42 CFR 431.220(a)(1)', verified: true,
    says: 'The state must give you a hearing if you ask for one because you think it got your case wrong.' },
  hearingWindow: { row: 'hearing-request-window-at-most-90-days', cite: '42 CFR 431.221(d)', verified: true,
    says: 'You get a reasonable time to ask, no more than 90 days from the date the notice was mailed. Your state may give less.' },
  hearingKeepsCoverage: { row: 'services-maintained-when-hearing-requested-before-action', cite: '42 CFR 431.230(a)', verified: true,
    says: 'Ask before the date of action and your coverage continues until the hearing decision, with some exceptions.' },
  recovery: { row: 'recovery-if-action-upheld', cite: '42 CFR 431.230(b)', verified: true,
    says: 'If the hearing agrees with the state, the state may recover the cost of care you got only because the hearing kept your coverage going.' },
  hearingAnyWay: { row: 'hearing-request-by-any-modality', cite: '42 CFR 431.221(a)(1)(i)', verified: true,
    says: 'You can ask for a hearing in any of the ways you can apply: online, by phone, by mail, or in person.' },
  represent: { row: 'hearing-rights-information', cite: '42 CFR 431.206(b)', verified: true,
    says: 'You can speak for yourself, or have a relative, a friend, a lawyer, or someone else speak for you.' },
  reapply: { row: 'no-restriction-on-reapplying', cite: '42 CFR 435.558(e)', verified: true,
    says: 'Losing coverage over this rule does not stop you from applying again.' },
  threshold: { row: null, cite: '42 CFR 435.552(a), per docs/design.md', verified: false,
    says: 'The requirement is 80 hours a month of work, volunteering, school, job training, or a mix.' },
  halfTime: { row: null, cite: '42 CFR 435.552(a)(4), per docs/design.md', verified: false,
    says: 'Enrollment in school at least half-time counts without any hours.' },
  snapWarning: { row: null, cite: '7 CFR 273.7(a)(1)(vii); SNAP research, section 4.4', verified: false,
    says: 'Working fewer hours can cost a household SNAP even when it would be enough for Medicaid.' },
  signature: { row: null, cite: '42 CFR 435.557(f)(1)(ii), per docs/design.md', verified: false,
    says: 'The packet ends with a plain signature line, not a sworn statement. From 2028 a sworn statement of medical frailty can be accepted only once per enrollment period.' },
  advice: { row: null, cite: 'HourKeep', verified: false,
    says: 'What to tell the state and what to gather are plain advice from HourKeep, not rules.' },
};

/* ---------- What the person chooses from ---------- */
const ROUTES = {
  letter: { label: 'I got a letter', hint: 'About Medicaid, the work requirement, or my coverage.' },
  renewing: { label: 'I’m applying or renewing soon', hint: 'No letter yet, and I want to be ready.' },
  helping: { label: 'I’m helping someone else', hint: 'A relative, a neighbor, or someone at my organization.' },
  tracking: { label: 'I want to keep track as I go', hint: 'Save proof month by month, before anyone asks.' },
};

// HourKeep asks what the letter says, never what it is called (docs/design.md, The letter).
const LETTERS = {
  noncompliance: 'It says the state could not confirm the work requirement, and asks for proof',
  denial: 'It says my coverage is denied, ending, or being cut back',
  renewal: 'It asks me to renew, or to send other information',
  outreach: 'It tells me about the new rules, and asks for nothing yet',
  unsure: 'I’m not sure what it says',
};

// docs/design.md, What may mean the rule does not apply. Proposed 2026-10-16, with no verified row yet.
const EXCLUSIONS = [
  { id: 'pregnant', label: 'I’m pregnant, or I was recently pregnant', cite: '42 CFR 435.554(c)(10)',
    tell: 'Tell the state you are pregnant, or when your pregnancy ended.',
    gather: ['A note from a doctor, clinic, or midwife, if you have one'] },
  { id: 'child', label: 'I care for a child 13 or younger', cite: '42 CFR 435.554(a), (c)(3)',
    tell: 'Tell the state the child’s name and age, and that you care for them.',
    gather: ['Something that shows the child lives with you, such as a school or medical record'] },
  { id: 'carer', label: 'I care for someone with a disability', cite: null,
    tell: 'Tell the state who you care for.',
    gather: ['A note from their doctor, or a letter about their disability benefits, if you have one'] },
  { id: 'aian', label: 'I’m American Indian or Alaska Native', cite: null,
    tell: 'Tell the state you are American Indian or Alaska Native.',
    gather: ['Tribal enrollment papers, or a letter from an Indian health program, if you have them'] },
  { id: 'snap', label: 'Someone in my home gets SNAP, also called food stamps', cite: '42 CFR 435.554(c)(7)',
    tell: 'Tell the state who in your home gets SNAP.',
    gather: ['Your most recent SNAP letter'] },
  { id: 'health', label: 'A health condition makes it hard for me to work', cite: null,
    tell: 'Tell the state about the condition and how it affects your work.',
    gather: ['A note from a doctor or clinic'],
    note: 'Whether a condition is on the state’s list is the state’s decision. Ask the office that sent your letter whether yours counts.' },
  { id: 'treatment', label: 'I’m in treatment for drug or alcohol use', cite: null,
    tell: 'Tell the state you are in treatment.',
    gather: ['A letter from your treatment program'] },
  { id: 'veteran', label: 'I’m a veteran with a total disability rating from the VA', cite: '42 CFR 435.554(c)(4)',
    tell: 'Tell the state your VA disability rating.',
    gather: ['Your VA rating letter'] },
];

// docs/design.md, Proof, month by month. A follow-up appears only when the record makes it relevant.
const RECORD_TYPES = {
  paystub: { label: 'Pay stub', asks: 'hours' },
  school: { label: 'School record', asks: 'halftime' },
  hoursform: { label: 'Hours form', asks: 'hours' },
  stateletter: { label: 'Letter from the state' },
  snapletter: { label: 'SNAP or TANF letter', asks: 'snap' },
  doctor: { label: 'Doctor’s note' },
  other: { label: 'Other' },
};

/* ---------- State ---------- */
let n = 0;
const uid = () => `x${Date.now().toString(36)}${(n++).toString(36)}`;

const defaults = () => ({
  v: 2,
  step: 'start',
  returnTo: null,
  route: 'letter',
  helperHasLetter: undefined,
  letter: {
    kind: 'noncompliance', noticeDate: '2027-03-02', responseDate: '2027-03-31',
    months: ['2027-01', '2027-02'], method: 'By mail', actionDate: '', hearingLimit: '',
  },
  // Only a tapped reason is stored. An untapped one is absent, never false, so a skip is never saved as a no.
  exclusions: {},
  snap: {},
  records: [
    { id: 'r1', month: '2027-01', type: 'hoursform', text: 'Volunteer sign-in sheet from the food pantry', pages: 4, hours: 24 },
    { id: 'r2', month: '2027-01', type: 'school', text: 'Adult education class schedule', pages: 1 },
    { id: 'r3', month: '2027-02', type: 'paystub', text: 'Pay stub from Corner Market, dated February 26, 2027', pages: 1, hours: 62 },
  ],
  activities: [
    { id: 'a1', month: '2027-01', name: 'Adult education classes', perWeek: 5, weeks: 4 },
    { id: 'a2', month: '2027-02', name: 'Food pantry volunteer shifts', perWeek: 6, weeks: 4 },
  ],
});

let recovered = false;
let confirmReset = false;
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaults();
    const d = JSON.parse(raw);
    const ok = d && d.v === 2 && d.letter && Array.isArray(d.letter.months) && Array.isArray(d.records)
      && Array.isArray(d.activities) && d.exclusions && typeof d.exclusions === 'object';
    if (!ok) throw new Error('bad');
    return { ...defaults(), ...d, letter: { ...defaults().letter, ...d.letter } };
  } catch {
    recovered = true;
    return defaults();
  }
}
let S = load();
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* storage blocked: in-memory only */ } };

/* ---------- Helpers ---------- */
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const parseDate = (s) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || '');
  if (!m) return null;
  const d = new Date(+m[1], +m[2] - 1, +m[3]);
  return isNaN(d.getTime()) ? null : d;
};
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const addDays = (s, days) => { const d = parseDate(s); if (!d) return null; d.setDate(d.getDate() + days); return iso(d); };
const fmtDate = (s, missing = 'Not entered yet') => { const d = parseDate(s); return d ? d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : missing; };
const monthLabel = (m) => { const [y, mo] = m.split('-').map(Number); return new Date(y, mo - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }); };
const num = (v) => Math.round((Number(v) || 0) * 100) / 100;
const hoursOf = (a) => num((Number(a.perWeek) || 0) * (Number(a.weeks) || 0));

const hasLetter = () => S.route === 'letter' || (S.route === 'helping' && S.helperHasLetter === 'yes');
const months = () => [...S.letter.months].sort();
const monthRecords = (m) => S.records.filter((r) => r.month === m);
const monthActs = (m) => S.activities.filter((a) => a.month === m);
const tapped = () => EXCLUSIONS.filter((x) => S.exclusions[x.id] === true);

// Each logged hour, with where it came from, so the arithmetic can be shown in full.
function loggedTerms(m) {
  const fromRecords = monthRecords(m).filter((r) => RECORD_TYPES[r.type]?.asks === 'hours' && Number(r.hours) > 0)
    .map((r) => ({ label: `${RECORD_TYPES[r.type].label}, ${docRef(r.id)}`, value: num(r.hours) }));
  const fromActs = monthActs(m).filter((a) => hoursOf(a) > 0).map((a) => ({ label: a.name || 'Activity', value: hoursOf(a) }));
  return [...fromRecords, ...fromActs];
}
const loggedTotal = (m) => num(loggedTerms(m).reduce((s, t) => s + t.value, 0));

// Documents are numbered in packet order: by month, then in the order they were added.
function docOrder() { return months().flatMap((m) => monthRecords(m)); }
function docRef(id) { const i = docOrder().findIndex((r) => r.id === id); return i < 0 ? 'D?' : `D${i + 1}`; }

/* ---------- Steps ---------- */
const STEPS = [
  { id: 'start', title: 'Why You’re Here', shown: () => true },
  { id: 'letter', title: 'Your Letter', shown: () => hasLetter() },
  { id: 'hearing', title: 'Fair Hearing', shown: () => hasLetter() && S.letter.kind === 'denial' },
  { id: 'notice', title: 'Notice Details', shown: () => hasLetter() },
  { id: 'exclusions', title: 'Might Not Apply to You', shown: () => S.route !== 'tracking' },
  { id: 'records', title: 'Records', shown: () => true },
  { id: 'months', title: 'Month by Month', shown: () => true },
  { id: 'packet', title: 'Packet', shown: () => true },
];
const visibleSteps = () => STEPS.filter((s) => s.shown());
const stepIndex = () => Math.max(0, visibleSteps().findIndex((s) => s.id === S.step));
const neighbour = (offset) => visibleSteps()[stepIndex() + offset];

/* ---------- Pieces ---------- */
const icon = (d) => `<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const ICON = {
  trash: icon('<path d="M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14"/>'),
  plus: icon('<path d="M12 5v14M5 12h14"/>'),
  print: icon('<path d="M6 9V3h12v6M6 18H4v-8h16v8h-2M7 14h10v7H7z"/>'),
  arrow: icon('<path d="M5 12h14m-6-6 6 6-6 6"/>'),
  back: icon('<path d="M19 12H5m6-6-6 6 6 6"/>'),
  doc: icon('<path d="M14 3H6v18h12V7zM14 3v4h4"/>'),
};

const field = (id, label, hint, input) => `<div><label class="field-label" for="${id}">${label}</label>${hint ? `<p class="hint">${hint}</p>` : ''}${input}</div>`;

// The three labels from .kiro/skills/hhs-benefits/SKILL.md. Every number HourKeep shows carries one.
const LABEL_TEXT = { computed: 'Computed', conditional: 'Conditional', deferred: 'Deferred' };
const tag = (kind) => `<span class="label-tag label-${kind}">${LABEL_TEXT[kind]}</span>`;

// A yes, no or not-sure answer. Nothing chosen stays undefined, which is not the same as no.
function toggle(name, legend, value) {
  const opt = (v, text) => `<button type="button" id="tg-${name}-${v}" class="btn btn-secondary btn-sm" aria-pressed="${value === v}" data-toggle-name="${name}" data-toggle-value="${v}">${text}</button>`;
  return `<fieldset data-toggle class="mt-3"><legend class="field-label">${legend}</legend>
    <div class="flex flex-wrap gap-2">${opt('yes', 'Yes')}${opt('no', 'No')}${opt('unsure', 'Not sure')}</div></fieldset>`;
}

function sources(keys) {
  const items = keys.map((k) => SOURCES[k]).filter(Boolean).map((s) => `<li class="mt-2"><p>${s.says}</p>
    <p class="hint">${esc(s.cite)}${s.row ? ` &middot; row <code>${esc(s.row)}</code>` : ''}${s.verified ? '' : ' &middot; <strong>No verified row yet</strong>'}</p></li>`).join('');
  return `<details class="sources no-print mt-5 border-t border-tan pt-2"><summary>Sources for this screen</summary><ul>${items}</ul></details>`;
}

const deferredNote = (text) => `<p class="mt-3">${tag('deferred')} ${text}</p>`;

function monthPicker(intro) {
  return `<fieldset class="mt-2"><legend class="field-label">Months to gather proof for</legend>
    ${intro ? `<p class="hint">${intro}</p>` : ''}
    <div class="mt-2 grid gap-2 sm:grid-cols-3">
      ${MONTH_OPTIONS.map((m) => `<label class="choice"><input type="checkbox" id="mo-${m}" data-month="${m}" ${S.letter.months.includes(m) ? 'checked' : ''} /> <span>${monthLabel(m)}</span></label>`).join('')}
    </div>
    <div id="months-error" aria-live="polite"></div></fieldset>`;
}

/* ---------- Views ---------- */
const VIEWS = {
  start: () => `
  <section class="card" aria-labelledby="t">
    <h1 id="t" class="text-3xl font-bold text-purple-dark">Gather Your Proof</h1>
    <p class="mt-2 text-lg">HourKeep helps you gather proof for the months your state asks about, and put it in one packet you can send. Everything stays on this device. HourKeep does not decide anything. Your state does.</p>
    <div class="alert mt-4" role="note"><p class="alert-title">Got a letter about your Medicaid?</p>
      <p>Don’t wait for this app. Contact the office that sent your letter, using the phone number on it.</p></div>
    <fieldset class="mt-6"><legend class="field-label text-lg">Why you’re here</legend>
      <div class="mt-2 grid gap-2">
        ${Object.entries(ROUTES).map(([k, r]) => `<button type="button" id="route-${k}" class="choice" aria-pressed="${S.route === k}" data-route="${k}">
          <span><span class="block font-semibold">${r.label}</span><span class="hint block">${r.hint}</span></span></button>`).join('')}
      </div>
    </fieldset>
    ${S.route === 'helping' ? toggle('helperHasLetter', 'Did they get a letter?', S.helperHasLetter) : ''}
  </section>`,

  letter: () => {
    const k = S.letter.kind;
    const result = {
      noncompliance: `<div class="alert mt-5"><p class="alert-title">This sounds like a notice about the work requirement</p>
        <p>You have 30 days to respond, counted from the day you get it. Your Medicaid continues while you respond. The letter has to tell you which months the state is checking, how to show proof, and the deadline.</p></div>`,
      denial: `<div class="alert alert-attention mt-5"><p class="alert-title">You can ask for a fair hearing</p>
        <p>There is a time limit, so don’t wait. The next step explains what a hearing is and what to have ready.</p></div>`,
      renewal: `<div class="alert mt-5"><p class="alert-title">Do what the letter asks, by the date on it</p>
        <p>HourKeep does not have the rules for this kind of letter yet. You can still gather proof here for the months it names.</p></div>`,
      outreach: `<div class="alert mt-5"><p class="alert-title">A letter like this starts no deadline</p>
        <p>You can gather proof now, so you’re ready if your state asks.</p></div>`,
      unsure: `<div class="alert alert-attention mt-5"><p class="alert-title">Look for these on the letter</p>
        <ul class="ml-5 list-disc"><li>A date to respond by</li><li>Months it names</li><li>Words like “could not confirm”, “denied”, or “ending”</li></ul>
        <p class="mt-2">Then call the office that sent it, and ask what it means for you. You can keep going here while you wait.</p></div>`,
    }[k] || '';
    return `
  <section class="card" aria-labelledby="t">
    <h2 id="t" class="text-2xl font-bold text-purple-dark">Your Letter</h2>
    <p class="mt-1">Pick what your letter says. States call these letters different names, so HourKeep asks what yours says.</p>
    <fieldset class="mt-4"><legend class="field-label">What your letter says</legend>
      <div class="mt-2 grid gap-2">
        ${Object.entries(LETTERS).map(([key, text]) => `<button type="button" id="lk-${key}" class="choice" aria-pressed="${k === key}" data-letter-kind="${key}"><span class="font-semibold">${text}</span></button>`).join('')}
      </div>
    </fieldset>
    ${result}
    ${sources(k === 'noncompliance' ? ['responsePeriod', 'coverageContinues', 'noticeSaysHow', 'noticeDeadline'] : k === 'denial' ? ['hearingRight'] : [])}
  </section>`;
  },

  hearing: () => {
    const action = S.letter.actionDate;
    return `
  <section class="card" aria-labelledby="t">
    <h2 id="t" class="text-2xl font-bold text-purple-dark">Fair Hearing</h2>
    <p class="mt-1">Ask for a fair hearing if you think the state got your case wrong. A hearing is a meeting where someone who did not make the decision looks at it again.</p>
    <div class="mt-5 grid gap-5 sm:grid-cols-2">
      ${field('h-letter', 'Date on the letter', 'The date printed at the top.', `<input id="h-letter" type="date" class="input" value="${esc(S.letter.noticeDate)}" data-letter-field="noticeDate" />`)}
      ${field('h-action', 'Date of action', 'The date the letter says your coverage changes.', `<input id="h-action" type="date" class="input" value="${esc(action)}" data-letter-field="actionDate" />`)}
      ${field('h-limit', 'Time limit to ask', 'Copy it as printed, for example 60 days.', `<input id="h-limit" class="input" value="${esc(S.letter.hearingLimit)}" data-letter-field="hearingLimit" autocomplete="off" />`)}
    </div>
    <h3 class="mt-6 text-xl font-bold">What to Know</h3>
    <ul class="mt-2 ml-5 list-disc space-y-2">
      <li>Ask within the time limit on your letter. It can’t be more than 90 days from when the letter was mailed, and your state may give less.</li>
      <li data-bind="hearing-before"></li>
      <li>If the hearing agrees with the state, the state may ask you to pay back the cost of care you got only because the hearing kept your coverage going.</li>
      <li>You can ask online, by phone, by mail, or in person.</li>
      <li>You don’t need a lawyer. You can speak for yourself, or have a relative, a friend, a lawyer, or someone else speak for you.</li>
      <li>You can apply for Medicaid again at any time.</li>
    </ul>
    <p class="mt-4"><a href="https://www.lawhelp.org/">Find free legal help in your state</a></p>
    <p class="mt-4">Gather proof for the hearing in the next steps. The packet works for a hearing too.</p>
    ${sources(['hearingRight', 'hearingWindow', 'hearingKeepsCoverage', 'recovery', 'hearingAnyWay', 'represent', 'reapply'])}
  </section>`;
  },

  notice: () => {
    const k = S.letter.kind;
    const needsResponse = k !== 'outreach' && k !== 'denial';
    return `
  <section class="card" aria-labelledby="t">
    <h2 id="t" class="text-2xl font-bold text-purple-dark">Notice Details</h2>
    <p class="mt-1">Copy these from your letter. Nothing reads the letter for you.</p>
    <div class="mt-5 grid gap-5 sm:grid-cols-2">
      ${k === 'denial' ? '' : field('notice', 'Date on the letter', 'The date printed at the top.', `<input id="notice" type="date" class="input" value="${esc(S.letter.noticeDate)}" data-letter-field="noticeDate" />`)}
      ${needsResponse ? field('response', 'Date to respond by', 'Copy it exactly as printed.', `<input id="response" type="date" class="input" value="${esc(S.letter.responseDate)}" data-letter-field="responseDate" />`) : ''}
    </div>
    <div id="date-error" aria-live="polite"></div>
    ${k === 'noncompliance' ? `<div class="mt-5 rounded-lg border-2 border-dashed border-tan p-4" aria-live="polite">
      <p class="font-semibold">Cross-check of the date ${tag('conditional')}</p>
      <p class="mt-1" data-bind="cross-formula"></p>
      <p class="mt-2" data-bind="cross-result"></p>
      <p class="hint mt-2">This depends on how your state counts the days, and the rule does not say whether the day you get the letter is day 1. The date printed on your letter is the one to meet.</p>
    </div>` : ''}
    <div class="mt-6">${monthPicker('The months your letter names.')}</div>
    <fieldset class="mt-6"><legend class="field-label">How the letter says to send proof</legend>
      <div class="mt-2 grid gap-2 sm:grid-cols-3">
        ${METHODS.map((m) => `<label class="choice"><input type="radio" id="me-${m.replace(/\s+/g, '-')}" name="method" value="${m}" ${S.letter.method === m ? 'checked' : ''} data-method="${m}" /> <span>${m}</span></label>`).join('')}
      </div>
    </fieldset>
    ${sources(k === 'noncompliance' ? ['responsePeriod', 'presumedReceipt', 'dayOneOpen', 'stateCounts', 'noticeDeadline'] : ['noticeDeadline'])}
  </section>`;
  },

  exclusions: () => `
  <section class="card" aria-labelledby="t">
    <h2 id="t" class="text-2xl font-bold text-purple-dark">Might Not Apply to You</h2>
    <p class="mt-1">Tap anything that is true for you. One of these can cover every month at once, so it comes before hours. Skip anything you don’t want to answer.</p>
    <div class="alert mt-4" role="note"><p>${tag('deferred')} HourKeep does not decide whether the rule applies to you. Your state does. Tell the state about anything you tap, using the list that opens under it. A skipped item is not saved as a no.</p></div>
    <div class="mt-4 grid gap-2">
      ${EXCLUSIONS.map((x) => {
        const on = S.exclusions[x.id] === true;
        return `<div>
          <label class="choice"><input type="checkbox" id="ex-${x.id}" data-exclusion="${x.id}" ${on ? 'checked' : ''} /> <span class="font-semibold">${x.label}</span></label>
          ${on ? `<div class="ml-4 mt-2 border-l-4 border-tan pl-4">
            <p class="font-semibold">What to tell the state</p><p>${x.tell}</p>
            <p class="mt-2 font-semibold">What to gather</p><ul class="ml-5 list-disc">${x.gather.map((g) => `<li>${g}</li>`).join('')}</ul>
            ${x.note ? `<p class="mt-2">${tag('deferred')} ${x.note}</p>` : ''}
            <p class="hint mt-2">The state may already know some of this. ${x.cite ? esc(x.cite) : 'Rule source not checked yet'}.</p>
            ${x.id === 'snap' ? snapQuestions() : ''}
          </div>` : ''}
        </div>`;
      }).join('')}
    </div>
    ${sources(['advice', 'snapWarning'])}
  </section>`,

  records: () => `
  <section class="card" aria-labelledby="t">
    <h2 id="t" class="text-2xl font-bold text-purple-dark">Records</h2>
    <p class="mt-1">Add each record you have, and tag what kind it is. A question appears only when a record makes it matter. Files are not attached in this prototype.</p>
    ${hasLetter() ? '' : `<div class="mt-4">${monthPicker('The months you expect your state to ask about.')}</div>`}
    ${months().length === 0 ? `<div class="alert alert-attention mt-5" role="status"><p>Choose at least 1 month first.</p></div>` : ''}
    <div class="mt-5 space-y-5">
      ${months().map((m) => {
        const rows = monthRecords(m);
        return `<div class="rounded-lg border border-tan bg-page p-4">
          <h3 class="text-xl font-bold">${monthLabel(m)}</h3>
          ${rows.length === 0 ? '<p class="mt-2 rounded border border-dashed border-ink-soft p-3">Nothing added yet for this month.</p>' : `<ul class="mt-2 space-y-3">${rows.map(recordItem).join('')}</ul>`}
          <form class="mt-4 grid gap-3 sm:grid-cols-[12rem_1fr_auto] sm:items-end" data-add-record="${m}">
            ${field(`rt-${m}`, 'Record type', '', `<select id="rt-${m}" class="input">${Object.entries(RECORD_TYPES).map(([k, t]) => `<option value="${k}">${t.label}</option>`).join('')}</select>`)}
            ${field(`rd-${m}`, 'Record description', '', `<input id="rd-${m}" class="input" autocomplete="off" />`)}
            <button type="submit" class="btn">${ICON.plus} Add record</button>
          </form>
        </div>`;
      }).join('')}
    </div>
    ${sources(['halfTime', 'snapWarning'])}
  </section>`,

  months: () => `
  <section class="card" aria-labelledby="t">
    <h2 id="t" class="text-2xl font-bold text-purple-dark">Month by Month</h2>
    <p class="mt-1">Check what you have for each month, and add hours for anything not covered yet. HourKeep shows the arithmetic and does not judge it.</p>
    <dl class="mt-4 grid gap-2 rounded-lg border border-tan p-3 text-sm sm:grid-cols-3">
      <div><dt>${tag('computed')}</dt><dd class="mt-1">Worked out from what you entered, by the formula shown.</dd></div>
      <div><dt>${tag('conditional')}</dt><dd class="mt-1">Depends on a choice your state may have made.</dd></div>
      <div><dt>${tag('deferred')}</dt><dd class="mt-1">Only your state can decide it.</dd></div>
    </dl>
    ${months().length === 0 ? `<div class="alert alert-attention mt-5" role="status"><p>Choose at least 1 month first.</p></div>` : ''}
    <div class="mt-5 space-y-5">
      ${months().map((m) => {
        const recs = monthRecords(m);
        const acts = monthActs(m);
        const halftime = recs.some((r) => r.type === 'school' && r.halftime === 'yes');
        return `<div class="rounded-lg border border-tan bg-page p-4">
          <h3 class="text-xl font-bold">${monthLabel(m)}</h3>
          <p class="mt-2 font-semibold">Records added</p>
          ${recs.length === 0 ? '<p>Nothing added yet for this month.</p>' : `<ul class="ml-5 list-disc">${recs.map((r) => `<li>${docRef(r.id)}: ${RECORD_TYPES[r.type].label}, ${esc(r.text)}</li>`).join('')}</ul>`}
          ${halftime ? `<p class="mt-2">You marked a school record as showing at least half-time enrollment. The rule counts that without any hours.</p>` : ''}
          <p class="mt-4 font-semibold">Hours you did</p>
          <ul class="mt-1 space-y-3">${acts.map((a) => `<li class="rounded-lg bg-white p-3">
            <div class="grid gap-2 sm:grid-cols-[1fr_7rem_7rem]">
              ${field(`n-${a.id}`, 'Activity', '', `<input id="n-${a.id}" class="input" value="${esc(a.name)}" data-act="${a.id}" data-f="name" />`)}
              ${field(`h-${a.id}`, 'Hours a week', '', `<input id="h-${a.id}" type="number" inputmode="decimal" min="0" step="any" class="input" value="${a.perWeek}" data-act="${a.id}" data-f="perWeek" />`)}
              ${field(`w-${a.id}`, 'Weeks', '', `<input id="w-${a.id}" type="number" inputmode="decimal" min="0" step="any" class="input" value="${a.weeks}" data-act="${a.id}" data-f="weeks" />`)}
            </div>
            <div class="mt-2 flex flex-wrap items-center justify-between gap-2"><p>${tag('computed')} <span data-bind="math-${a.id}"></span></p>
              <button type="button" class="btn btn-secondary btn-sm" data-rm-act="${a.id}" aria-label="Remove activity ${esc(a.name)}">${ICON.trash} Remove</button></div>
          </li>`).join('')}</ul>
          <button type="button" class="btn btn-secondary mt-3" data-add-act="${m}">${ICON.plus} Add hours</button>
          <div class="mt-4 rounded-lg border-2 border-purple bg-white p-3" aria-live="polite">
            <p>${tag('computed')} <strong>Logged this month</strong></p>
            <ul class="mt-1 ml-5 list-disc" data-terms="${m}"></ul>
            <p class="mt-1 font-semibold" data-bind="logged-${m}"></p>
            <p class="mt-3">Threshold in the rule: ${THRESHOLD} hours a month.</p>
            <p class="hint">${esc(SOURCES.threshold.cite)}. No verified row yet.</p>
            ${deferredNote('Whether these records and hours count, and whether the requirement is met, is for your state to decide. Send this packet by the date on your letter, and call the office that sent it if you’re not sure what counts.')}
          </div>
        </div>`;
      }).join('')}
    </div>
    ${sources(['threshold', 'halfTime', 'otherBases'])}
  </section>`,

  packet: () => `
  <div class="no-print card mb-4">
    <h2 class="text-2xl font-bold text-purple-dark">Your Packet</h2>
    <p class="mt-1">This is what you print or save and send. It matches the printout page for page, so you can talk a caseworker through it on the phone.</p>
    <div class="alert alert-attention mt-4" role="note"><p class="alert-title">What is in this packet</p>
      <p>Your name, your reference number, the dates and months from your letter, each record you described, the hours you entered, and anything you tapped under Might Not Apply to You. Anyone who sees the printout or the file can read all of it.</p></div>
    <div class="mt-4 flex flex-wrap gap-3">
      <button type="button" class="btn" data-print>${ICON.print} Print or save this packet</button>
      ${S.returnTo && S.returnTo !== 'packet' ? `<button type="button" class="btn btn-secondary" data-go="${S.returnTo}">${ICON.back} Back to where you were</button>` : ''}
    </div>
    ${sources(['signature'])}
  </div>
  <article aria-label="Packet">${packetHtml()}</article>`,
};

function recordItem(r) {
  const t = RECORD_TYPES[r.type] || RECORD_TYPES.other;
  let ask = '';
  if (t.asks === 'hours') {
    ask = `<div class="mt-2 max-w-xs">${field(`rh-${r.id}`, 'Hours on this record', '', `<input id="rh-${r.id}" type="number" inputmode="decimal" min="0" step="any" class="input" value="${r.hours ?? ''}" data-rec="${r.id}" data-f="hours" />`)}</div>`;
  } else if (t.asks === 'halftime') {
    ask = toggle(`halftime:${r.id}`, 'Does it show enrollment at least half-time?', r.halftime);
  } else if (t.asks === 'snap') {
    ask = `<p class="mt-2">A SNAP letter can matter for whether the rule applies to you.</p>
      <button type="button" class="btn btn-secondary btn-sm mt-2" data-go="exclusions">Go to Might Not Apply to You</button>`;
  }
  return `<li class="rounded-lg bg-white p-3">
    <div class="flex flex-wrap items-start justify-between gap-2">
      <p><span class="font-semibold">${docRef(r.id)} &middot; ${t.label}</span><br />${esc(r.text)}</p>
      <button type="button" class="btn btn-secondary btn-sm shrink-0" data-rm-rec="${r.id}" aria-label="Remove record: ${esc(r.text)}">${ICON.trash} Remove</button>
    </div>
    <div class="mt-2 max-w-xs">${field(`rp-${r.id}`, 'Pages', '', `<input id="rp-${r.id}" type="number" inputmode="numeric" min="1" step="1" class="input" value="${r.pages ?? ''}" data-rec="${r.id}" data-f="pages" />`)}</div>
    ${ask}
  </li>`;
}

// docs/design.md, SNAP: never ask whether they are meeting SNAP's rules, and never show a SNAP verdict.
function snapQuestions() {
  return `<div class="mt-3">
    ${toggle('snap:onCase', 'Are you on that SNAP case?', S.snap.onCase)}
    <div class="mt-3">${field('snap-letter', 'What your SNAP work-rules letter says about you', 'Copy a few words, if you have one.', `<input id="snap-letter" class="input" value="${esc(S.snap.letterSays)}" data-snap="letterSays" autocomplete="off" />`)}</div>
    <div class="mt-3">${field('snap-dates', 'When SNAP started or stopped', 'A month is enough.', `<input id="snap-dates" class="input" value="${esc(S.snap.dates)}" data-snap="dates" autocomplete="off" />`)}</div>
    <div class="alert alert-attention mt-3"><p>Working fewer hours can cost your household SNAP, even when it is enough for Medicaid. Check with your SNAP office before you change your hours.</p></div>
  </div>`;
}

/* ---------- The packet ----------
   docs/design.md, The package. Every page names the person, the month and the page number, so loose pages still make
   sense. An answer nobody gave says so in the 2 phrases .kiro/skills/interface-copy/SKILL.md sets. */
function packetHtml() {
  const ms = months();
  const monthsText = ms.map(monthLabel).join(', ') || 'Months not specified.';
  const pages = [];
  const docs = docOrder();

  pages.push({ months: monthsText, html: `
    <h2 class="text-2xl font-bold">Packet Summary</h2>
    <table class="mt-4"><tbody>
      <tr><th scope="row">Person</th><td>${PERSON}</td></tr>
      <tr><th scope="row">Reference</th><td>${REF}</td></tr>
      <tr><th scope="row">Months</th><td>${esc(monthsText)}</td></tr>
      ${hasLetter() ? `<tr><th scope="row">What the letter says</th><td>${esc(LETTERS[S.letter.kind] || 'Letter not specified.')}</td></tr>
      <tr><th scope="row">Date on the letter</th><td>${fmtDate(S.letter.noticeDate, 'Date not specified.')}</td></tr>
      ${S.letter.kind !== 'outreach' && S.letter.kind !== 'denial' ? `<tr><th scope="row">Date to respond by, as printed</th><td>${fmtDate(S.letter.responseDate, 'Date not specified.')}</td></tr>` : ''}
      <tr><th scope="row">How to send it</th><td>${esc(S.letter.method || 'Method not specified.')}</td></tr>` : '<tr><th scope="row">Letter</th><td>Gathered before any letter arrived.</td></tr>'}
      <tr><th scope="row">Documents</th><td>${docs.length}</td></tr>
      <tr><th scope="row">Made by</th><td>${MADE_BY}</td></tr>
    </tbody></table>
    <p class="mt-6 border-2 border-ink p-3">This packet states what was gathered and what was logged. It does not say whether anyone meets the requirement or is exempt from it. The state decides.</p>` });

  if (hasLetter() && S.letter.kind === 'denial') {
    pages.push({ months: monthsText, html: `
      <h2 class="text-2xl font-bold">Fair Hearing</h2>
      <table class="mt-4"><tbody>
        <tr><th scope="row">Date on the letter</th><td>${fmtDate(S.letter.noticeDate, 'Date not specified.')}</td></tr>
        <tr><th scope="row">Date of action</th><td>${fmtDate(S.letter.actionDate, 'Date not specified.')}</td></tr>
        <tr><th scope="row">Time limit to ask, as printed</th><td>${esc(S.letter.hearingLimit) || 'Time limit not specified.'}</td></tr>
      </tbody></table>` });
  }

  if (S.route !== 'tracking') {
    const t = tapped();
    pages.push({ months: monthsText, html: `
      <h2 class="text-2xl font-bold">Might Not Apply</h2>
      <p class="mt-1 text-sm">Reasons the person marked. An item not listed was skipped, not answered no.</p>
      ${t.length === 0 ? '<p class="mt-3">No response was provided about reasons the rule might not apply.</p>' : `<ul class="mt-3 ml-5 list-disc">${t.map((x) => `<li>${x.label}</li>`).join('')}</ul>`}
      ${S.exclusions.snap ? `<table class="mt-4"><tbody>
        <tr><th scope="row">On that SNAP case</th><td>${({ yes: 'Yes', no: 'No', unsure: 'Not sure' })[S.snap.onCase] || 'Answer not specified.'}</td></tr>
        <tr><th scope="row">SNAP work-rules letter says</th><td>${esc(S.snap.letterSays) || 'No response was provided.'}</td></tr>
        <tr><th scope="row">SNAP started or stopped</th><td>${esc(S.snap.dates) || 'Date not specified.'}</td></tr>
      </tbody></table>` : ''}` });
  }

  ms.forEach((m) => {
    const recs = monthRecords(m);
    const terms = loggedTerms(m);
    pages.push({ months: monthLabel(m), html: `
      <h2 class="text-2xl font-bold">${monthLabel(m)}</h2>
      <h3 class="mt-4 text-lg font-bold">Records</h3>
      ${recs.length === 0 ? '<p>No response was provided describing records for this month.</p>' : `<table class="mt-1"><thead><tr><th scope="col">Ref</th><th scope="col">Type</th><th scope="col">Description</th><th scope="col">Pages</th></tr></thead><tbody>
        ${recs.map((r) => `<tr><td>${docRef(r.id)}</td><td>${RECORD_TYPES[r.type].label}</td><td>${esc(r.text)}${r.type === 'school' && r.halftime ? `<br />Shows at least half-time: ${({ yes: 'Yes', no: 'No', unsure: 'Not sure' })[r.halftime]}` : ''}</td><td>${r.pages || 'Not specified.'}</td></tr>`).join('')}
      </tbody></table>`}
      <h3 class="mt-5 text-lg font-bold">Hours Logged</h3>
      ${terms.length === 0 ? '<p>No response was provided for hours this month.</p>' : `<table class="mt-1"><tbody>
        ${terms.map((t) => `<tr><td>${esc(t.label)}</td><td class="text-right">${t.value} hours</td></tr>`).join('')}
        ${monthActs(m).filter((a) => hoursOf(a) > 0).length ? `<tr><td colspan="2" class="text-sm">Activity hours = hours a week × weeks.</td></tr>` : ''}
        <tr><th scope="row">Total logged</th><td class="text-right font-bold">${terms.map((t) => t.value).join(' + ')} = ${loggedTotal(m)} hours</td></tr>
      </tbody></table>`}
      <p class="mt-4">Threshold in the rule: ${THRESHOLD} hours a month. This page states what was logged and concludes nothing.</p>` });
  });

  pages.push({ months: monthsText, html: `
    <h2 class="text-2xl font-bold">Documents and Signature</h2>
    ${docs.length === 0 ? '<p class="mt-2">No response was provided describing any documents.</p>' : `<table class="mt-3"><thead><tr><th scope="col">Ref</th><th scope="col">Month</th><th scope="col">Document</th></tr></thead><tbody>
      ${docs.map((r, i) => `<tr><td>D${i + 1}</td><td>${monthLabel(r.month)}</td><td>${RECORD_TYPES[r.type].label}: ${esc(r.text)}</td></tr>`).join('')}
    </tbody></table>`}
    <div class="mt-10 grid gap-8 sm:grid-cols-2"><div><div class="h-10 border-b-2 border-ink"></div><p class="mt-1 text-sm">Signature</p></div><div><div class="h-10 border-b-2 border-ink"></div><p class="mt-1 text-sm">Date</p></div></div>
    <p class="mt-6 text-sm">A signature here is not a sworn statement.</p>` });

  const total = pages.length;
  return pages.map((p, i) => `<section class="packet-page" aria-label="Page ${i + 1} of ${total}">${p.html}
    <div class="mt-8 flex flex-wrap justify-between gap-2 border-t border-ink pt-2 text-xs"><span>${PERSON} &middot; ${REF} &middot; ${esc(p.months)}</span><span>Page ${i + 1} of ${total}</span></div>
  </section>`).join('');
}

/* ---------- Rendering ---------- */
const main = document.getElementById('main');
const stepsEl = document.getElementById('steps');
const resetArea = document.getElementById('reset-area');
const recSlot = document.getElementById('recovered-slot');
const helperSlot = document.getElementById('helper-slot');

function bind(k, v) { main.querySelectorAll(`[data-bind="${k}"]`).forEach((e) => { e.textContent = v; }); }

function dateError() {
  const k = S.letter.kind;
  if (S.step !== 'notice' || k === 'denial' || k === 'outreach') return '';
  const a = parseDate(S.letter.noticeDate), b = parseDate(S.letter.responseDate);
  if (!a || !b) return 'Enter both dates as printed on the letter.';
  if (b < a) return 'The date to respond by is before the date on the letter. Check the letter again.';
  return '';
}

function updateDerived() {
  const ms = months();
  // docs/design.md, The letter: the printed deadline always wins; HourKeep's own count is only a cross-check.
  const counted = addDays(S.letter.noticeDate, 35);
  if (counted) {
    bind('cross-formula', `${fmtDate(S.letter.noticeDate)} + 5 days until it counts as received + 30 days = ${fmtDate(counted)}`);
    const printed = S.letter.responseDate;
    bind('cross-result', !parseDate(printed) ? 'Enter the date printed on your letter to compare.'
      : printed === counted ? 'This matches the date printed on your letter.'
        : `This is different from the date printed on your letter. Meet the printed date, ${fmtDate(printed)}. If you’re not sure, call the office that sent the letter.`);
  } else {
    bind('cross-formula', 'Enter the date on the letter to see the count.');
    bind('cross-result', '');
  }
  const action = fmtDate(S.letter.actionDate, '');
  bind('hearing-before', action
    ? `Ask before ${action}, the date of action, and your coverage can continue until the hearing decision, with some exceptions.`
    : 'Ask before the date of action on your letter, and your coverage can continue until the hearing decision, with some exceptions.');
  S.activities.forEach((a) => bind(`math-${a.id}`, `${num(a.perWeek)} × ${num(a.weeks)} = ${hoursOf(a)} hours`));
  ms.forEach((m) => {
    const terms = loggedTerms(m);
    bind(`logged-${m}`, terms.length ? `${terms.map((t) => t.value).join(' + ')} = ${loggedTotal(m)} hours` : 'Nothing logged yet for this month.');
    main.querySelectorAll(`[data-terms="${m}"]`).forEach((ul) => { ul.innerHTML = terms.map((t) => `<li>${esc(t.label)}: ${t.value} hours</li>`).join(''); });
  });
  const de = document.getElementById('date-error');
  if (de) de.innerHTML = dateError() ? `<div class="alert alert-attention mt-3" role="alert"><p>${dateError()}</p></div>` : '';
  const me = document.getElementById('months-error');
  if (me) me.innerHTML = ms.length === 0 ? `<div class="alert alert-attention mt-3" role="alert"><p>Choose at least 1 month to continue.</p></div>` : '';
  const nx = document.getElementById('next');
  if (nx) nx.disabled = (S.step === 'notice' && (ms.length === 0 || !!dateError()))
    || (S.step === 'start' && S.route === 'helping' && S.helperHasLetter === undefined);
}

function renderChrome() {
  const vs = visibleSteps();
  stepsEl.style.gridTemplateColumns = `repeat(${vs.length}, minmax(0, 1fr))`;
  stepsEl.innerHTML = vs.map((s, i) => `<li><button type="button" class="step-btn w-full rounded-lg border border-tan bg-white px-1 py-2 text-center text-sm font-semibold hover:bg-purple-tint" data-go="${s.id}" ${s.id === S.step ? 'aria-current="step"' : ''} aria-label="Step ${i + 1} of ${vs.length}: ${s.title}"><span class="lg:hidden">${i + 1}</span><span class="hidden lg:inline">${s.title}</span></button></li>`).join('');
  resetArea.innerHTML = (S.step !== 'packet' ? `<button type="button" class="btn btn-sm" data-preview>${ICON.doc} Preview packet</button>` : '')
    + (confirmReset
      ? `<span class="flex items-center gap-2" role="group" aria-label="Confirm start over"><span class="text-sm font-semibold">Start over with the sample case?</span><button type="button" class="btn btn-sm" data-reset-yes>Start over</button><button type="button" class="btn btn-secondary btn-sm" data-reset-no>Keep my work</button></span>`
      : `<button type="button" class="btn btn-secondary btn-sm" data-reset>Start over</button>`);
  recSlot.innerHTML = recovered ? `<div class="mx-auto max-w-4xl px-4 pt-4"><div class="alert alert-attention flex flex-wrap items-center justify-between gap-2" role="status"><p>Saved information could not be read, so a fresh sample case was loaded.</p><button type="button" class="btn btn-secondary btn-sm" data-dismiss>OK</button></div></div>` : '';
  helperSlot.innerHTML = S.route === 'helping' ? `<div class="mx-auto max-w-4xl px-4 pt-4"><div class="alert" role="note"><p>You’re helping someone. Answer as they would, with them there if you can. Nothing here leaves this device.</p></div></div>` : '';
}

function renderBody() {
  if (!visibleSteps().some((s) => s.id === S.step)) S.step = 'start';
  const active = document.activeElement && document.activeElement.id;
  const prev = neighbour(-1), next = neighbour(1);
  const nav = S.step === 'packet' ? '' : `<div class="no-print mt-4 flex flex-wrap justify-between gap-3">
    ${prev ? `<button type="button" class="btn btn-secondary" data-go="${prev.id}">${ICON.back} Back</button>` : '<span></span>'}
    ${next ? `<button type="button" id="next" class="btn" data-go="${next.id}">Next: ${next.title} ${ICON.arrow}</button>` : ''}
  </div>`;
  const vs = visibleSteps();
  const where = `<p class="no-print mb-2 text-sm font-semibold text-ink-soft lg:hidden">Step ${stepIndex() + 1} of ${vs.length}: ${vs[stepIndex()].title}</p>`;
  main.innerHTML = where + VIEWS[S.step]() + nav;
  updateDerived();
  if (active) { const el = document.getElementById(active); if (el) el.focus(); }
}

function render() { renderChrome(); renderBody(); }

function go(id) {
  if (id === 'packet' && S.step !== 'packet') S.returnTo = S.step;
  S.step = id;
  save();
  render();
  window.scrollTo({ top: 0 });
  main.focus({ preventScroll: true });
}

function commit(structural = true) {
  save();
  if (structural) render(); else updateDerived();
}

/* ---------- Events ---------- */
document.addEventListener('click', (e) => {
  const t = e.target.closest('button');
  if (!t) return;
  const d = t.dataset;
  if (d.go !== undefined) return go(d.go);
  if (d.preview !== undefined) return go('packet');
  if (d.print !== undefined) return window.print();
  if (d.reset !== undefined) { confirmReset = true; return renderChrome(); }
  if (d.resetNo !== undefined) { confirmReset = false; return renderChrome(); }
  if (d.resetYes !== undefined) { try { localStorage.removeItem(KEY); } catch { /* ignore */ } S = defaults(); recovered = false; confirmReset = false; return render(); }
  if (d.dismiss !== undefined) { recovered = false; return renderChrome(); }
  if (d.route) { S.route = d.route; return commit(); }
  if (d.letterKind) { S.letter.kind = d.letterKind; return commit(); }
  if (d.toggleName) {
    const [scope, id] = d.toggleName.split(':');
    const v = d.toggleValue;
    if (scope === 'helperHasLetter') S.helperHasLetter = S.helperHasLetter === v ? undefined : v;
    else if (scope === 'halftime') { const r = S.records.find((x) => x.id === id); if (r) r.halftime = r.halftime === v ? undefined : v; }
    else if (scope === 'snap') S.snap[id] = S.snap[id] === v ? undefined : v;
    return commit();
  }
  if (d.rmRec) { S.records = S.records.filter((r) => r.id !== d.rmRec); return commit(); }
  if (d.rmAct) { S.activities = S.activities.filter((a) => a.id !== d.rmAct); return commit(); }
  if (d.addAct) {
    const id = uid();
    S.activities.push({ id, month: d.addAct, name: 'Activity', perWeek: 1, weeks: 1 });
    commit();
    const el = document.getElementById(`n-${id}`); if (el) { el.focus(); el.select(); }
  }
});

document.addEventListener('submit', (e) => {
  const m = e.target.dataset && e.target.dataset.addRecord;
  if (!m) return;
  e.preventDefault();
  const type = document.getElementById(`rt-${m}`).value;
  const inp = document.getElementById(`rd-${m}`);
  const text = inp.value.trim();
  if (!text) { inp.focus(); return; }
  S.records.push({ id: uid(), month: m, type, text, pages: 1 });
  commit();
  const el = document.getElementById(`rd-${m}`); if (el) el.focus();
});

document.addEventListener('input', (e) => {
  const t = e.target;
  if (t.dataset.letterField) { S.letter[t.dataset.letterField] = t.value; return commit(false); }
  if (t.dataset.snap) { S.snap[t.dataset.snap] = t.value; return save(); }
  if (t.dataset.act) {
    const a = S.activities.find((x) => x.id === t.dataset.act);
    if (!a) return;
    a[t.dataset.f] = t.dataset.f === 'name' ? t.value : Math.max(0, Number(t.value) || 0);
    return commit(false);
  }
  if (t.dataset.rec) {
    const r = S.records.find((x) => x.id === t.dataset.rec);
    if (!r) return;
    r[t.dataset.f] = t.value === '' ? undefined : Math.max(0, Number(t.value) || 0);
    return commit(false);
  }
});

document.addEventListener('change', (e) => {
  const t = e.target;
  if (t.dataset.month) {
    const m = t.dataset.month;
    S.letter.months = t.checked ? [...new Set([...S.letter.months, m])] : S.letter.months.filter((x) => x !== m);
    return commit(S.step !== 'notice');
  }
  if (t.dataset.method) { S.letter.method = t.dataset.method; return save(); }
  if (t.dataset.exclusion) {
    // Unticking removes the answer. It never stores false.
    if (t.checked) S.exclusions[t.dataset.exclusion] = true; else delete S.exclusions[t.dataset.exclusion];
    return commit();
  }
});

render();
