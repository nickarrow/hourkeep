// HourKeep: static, browser-only organizer. State lives in localStorage on this device.
const KEY = 'hourkeep-prototype-v1';
const MONTH_OPTIONS = ['2026-12', '2027-01', '2027-02', '2027-03'];
const METHODS = ['By mail', 'Online portal', 'In person', 'By fax'];
const SUGGESTED = [
  'Pay stubs or a work schedule',
  'Volunteer sign-in sheet or a note from the group',
  'Class schedule or a letter from the school',
];
const STEPS = ['Your Notice', 'Notice Details', 'Months and Evidence', 'Hours', 'Packet'];
const REF = 'HK-2027-0142';

let n = 0;
const uid = () => `x${Date.now().toString(36)}${(n++).toString(36)}`;

const defaults = () => ({
  step: 0,
  letter: { noticeDate: '2027-03-02', responseDate: '2027-03-31', months: ['2027-01', '2027-02'], method: 'By mail' },
  activities: [
    { id: 'a1', month: '2027-01', name: 'Food pantry volunteer shifts', perWeek: 6, weeks: 4 },
    { id: 'a2', month: '2027-01', name: 'Adult education classes', perWeek: 5, weeks: 4 },
    { id: 'a3', month: '2027-02', name: 'Food pantry volunteer shifts', perWeek: 6, weeks: 4 },
    { id: 'a4', month: '2027-02', name: 'Retail work shifts', perWeek: 3, weeks: 3 },
  ],
  proofs: [
    { id: 'p1', month: '2027-01', text: 'Volunteer sign-in sheet, four pages' },
    { id: 'p2', month: '2027-02', text: 'Retail pay stub dated February 26, 2027' },
  ],
  checks: {},
});

let recovered = false;
let confirmReset = false;
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaults();
    const d = JSON.parse(raw);
    if (!d || !d.letter || !Array.isArray(d.activities) || !Array.isArray(d.proofs) || !Array.isArray(d.letter.months)) throw new Error('bad');
    return { ...defaults(), ...d };
  } catch {
    recovered = true;
    return defaults();
  }
}
let S = load();
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* storage blocked: in-memory only */ } };

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const parseDate = (s) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || '');
  if (!m) return null;
  const d = new Date(+m[1], +m[2] - 1, +m[3]);
  return isNaN(d.getTime()) ? null : d;
};
const fmtDate = (s) => { const d = parseDate(s); return d ? d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not set'; };
const monthLabel = (m) => { const [y, mo] = m.split('-').map(Number); return new Date(y, mo - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }); };
const hoursOf = (a) => (Number(a.perWeek) || 0) * (Number(a.weeks) || 0);
const num = (v) => Math.round(v * 100) / 100;
const months = () => [...S.letter.months].sort();
const sum = (rows) => num(rows.reduce((s, a) => s + hoursOf(a), 0));
const monthActs = (m) => S.activities.filter((a) => a.month === m);
const totalHours = () => sum(S.activities.filter((a) => months().includes(a.month)));
const dateError = () => {
  const a = parseDate(S.letter.noticeDate), b = parseDate(S.letter.responseDate);
  if (!a || !b) return 'Enter both dates as printed on the notice.';
  if (b < a) return 'The response date is before the notice date. Check the notice again.';
  return '';
};

const icon = (d) => `<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const ICON = {
  trash: icon('<path d="M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14"/>'),
  plus: icon('<path d="M12 5v14M5 12h14"/>'),
  print: icon('<path d="M6 9V3h12v6M6 18H4v-8h16v8h-2M7 14h10v7H7z"/>'),
  arrow: icon('<path d="M5 12h14m-6-6 6 6-6 6"/>'),
  back: icon('<path d="M19 12H5m6-6-6 6 6 6"/>'),
};

const main = document.getElementById('main');
const stepsEl = document.getElementById('steps');
const resetArea = document.getElementById('reset-area');
const recSlot = document.getElementById('recovered-slot');

function commit(structural = true) {
  save();
  if (structural) renderBody(); else updateDerived();
}
function go(i) {
  S.step = Math.max(0, Math.min(4, i));
  save();
  render();
  window.scrollTo({ top: 0 });
  main.focus({ preventScroll: true });
}

const field = (id, label, hint, input) => `<div><label class="field-label" for="${id}">${label}</label>${hint ? `<p class="mb-1 text-sm text-aeblack-700">${hint}</p>` : ''}${input}</div>`;

/* ---------- Views ---------- */
const views = [
  // 0 Overview
  () => `
  <section class="card" aria-labelledby="t">
    <h1 id="t" class="text-3xl font-bold text-aegold-900">Your Notice and Records</h1>
    <p class="mt-2 text-lg">Enter what the notice says, describe the records you have for each month it names, add up your hours, and print one packet.</p>
    <dl class="mt-5 grid gap-3 sm:grid-cols-3">
      <div class="rounded bg-aeblack-50 p-3"><dt class="text-sm font-semibold text-aeblack-700">Notice date</dt><dd class="font-semibold" data-bind="ov-notice"></dd></div>
      <div class="rounded bg-aeblack-50 p-3"><dt class="text-sm font-semibold text-aeblack-700">Response date printed on notice</dt><dd class="font-semibold" data-bind="ov-response"></dd></div>
      <div class="rounded bg-aeblack-50 p-3"><dt class="text-sm font-semibold text-aeblack-700">Months requested</dt><dd class="font-semibold" data-bind="ov-months"></dd></div>
    </dl>
    <div class="aegov-alert alert-info mt-5" role="note"><div class="alert-content"><p class="alert-title">What this tool does</p><p>It organizes your paperwork on this device. It does not send anything, check anything, or decide anything. The state makes all determinations.</p></div></div>
    <div class="mt-5 flex flex-wrap gap-3">
      <button type="button" class="aegov-btn btn-lg" data-go="1">Start with the notice ${ICON.arrow}</button>
      <button type="button" class="aegov-btn btn-outline btn-lg" data-go="4">Go to packet</button>
    </div>
  </section>`,
  // 1 Notice details
  () => `
  <section class="card" aria-labelledby="t">
    <h2 id="t" class="text-2xl font-bold text-aegold-900">Notice Details</h2>
    <p class="mt-1">Copy these from the notice you received.</p>
    <div class="mt-5 grid gap-5 sm:grid-cols-2">
      ${field('notice', 'Notice date', 'The date printed on the notice.', `<input id="notice" type="date" class="aegov-form-control" value="${esc(S.letter.noticeDate)}" data-letter="noticeDate" />`)}
      ${field('response', 'Response date', 'The date the notice says to respond by. We use it exactly as printed.', `<input id="response" type="date" class="aegov-form-control" value="${esc(S.letter.responseDate)}" data-letter="responseDate" />`)}
    </div>
    <div id="date-error" aria-live="polite"></div>
    <p class="mt-3 text-sm text-aeblack-700">HourKeep does not calculate deadlines. If the date is unclear, contact the office that sent the notice.</p>
    <fieldset class="mt-6">
      <legend class="field-label">Months the notice asks about</legend>
      <div class="aegov-check-group mt-2 grid gap-2 sm:grid-cols-2">
        ${MONTH_OPTIONS.map((m) => `<div class="aegov-check-item"><input type="checkbox" id="mo-${m}" data-month="${m}" ${S.letter.months.includes(m) ? 'checked' : ''} /><label for="mo-${m}">${monthLabel(m)}</label></div>`).join('')}
      </div>
      <div id="months-error" aria-live="polite"></div>
    </fieldset>
    <fieldset class="mt-6">
      <legend class="field-label">How the notice says to respond</legend>
      <div class="mt-2 grid gap-2 sm:grid-cols-4">
        ${METHODS.map((m, i) => `<label class="flex min-h-11 cursor-pointer items-center gap-2 rounded border border-aeblack-300 bg-white px-3"><input type="radio" name="method" value="${m}" ${S.letter.method === m ? 'checked' : ''} data-method="${i}" /> ${m}</label>`).join('')}
      </div>
    </fieldset>
  </section>`,
  // 2 Months and evidence
  () => `
  <section class="card" aria-labelledby="t">
    <h2 id="t" class="text-2xl font-bold text-aegold-900">Requested Months and Evidence</h2>
    <p class="mt-1">For each month, tick what you have gathered and describe each record in a few words. Files are not uploaded.</p>
    ${months().length === 0 ? `<div class="aegov-alert alert-warning mt-5" role="status"><div class="alert-content"><p>No months selected.</p></div></div><button type="button" class="aegov-btn btn-outline mt-3" data-go="1">Choose months in Notice details</button>` : ''}
    <div class="mt-5 space-y-5">
      ${months().map((m) => {
        const rows = S.proofs.filter((p) => p.month === m);
        return `<div class="rounded border border-aeblack-200 bg-aeblack-50 p-4">
          <h3 class="text-xl font-bold">${monthLabel(m)}</h3>
          <p class="mt-2 text-sm font-semibold">Things you may look for</p>
          <div class="aegov-check-group mt-1">${SUGGESTED.map((s, i) => { const k = `${m}:${i}`; return `<div class="aegov-check-item"><input type="checkbox" id="g-${k}" data-check="${k}" ${S.checks[k] ? 'checked' : ''} /><label for="g-${k}">${s}</label></div>`; }).join('')}</div>
          <p class="mt-3 text-sm font-semibold">Records you described</p>
          ${rows.length === 0 ? '<p class="mt-1 rounded border border-dashed border-aeblack-400 p-3 text-aeblack-700">None yet. Add a description below.</p>' : `<ul class="mt-1 space-y-2">${rows.map((p) => `<li class="flex items-center justify-between gap-3 rounded bg-white p-3"><span>${esc(p.text)}</span><button type="button" class="aegov-btn btn-outline btn-sm shrink-0" data-rm-proof="${p.id}" aria-label="Remove record: ${esc(p.text)}">${ICON.trash} Remove</button></li>`).join('')}</ul>`}
          <form class="mt-3 flex flex-col gap-2 sm:flex-row" data-add-proof="${m}">
            <label for="pf-${m}" class="sr-only">Record description for ${monthLabel(m)}</label>
            <input id="pf-${m}" class="aegov-form-control" placeholder="Example: Volunteer sign-in sheet" autocomplete="off" />
            <button type="submit" class="aegov-btn shrink-0">${ICON.plus} Add</button>
          </form>
        </div>`;
      }).join('')}
    </div>
    <p class="mt-4 text-sm text-aeblack-700">Listing a record here does not mean it will be accepted. The state decides.</p>
  </section>`,
  // 3 Hours
  () => `
  <section class="card" aria-labelledby="t">
    <h2 id="t" class="text-2xl font-bold text-aegold-900">Hours Arithmetic</h2>
    <p class="mt-1">Enter the hours for each activity. Hours = hours a week × weeks. HourKeep adds them up and does not judge them.</p>
    ${months().length === 0 ? `<div class="aegov-alert alert-warning mt-5" role="status"><div class="alert-content"><p>No months selected.</p></div></div><button type="button" class="aegov-btn btn-outline mt-3" data-go="1">Choose months in Notice details</button>` : ''}
    <div class="mt-5 space-y-5">
      ${months().map((m) => {
        const rows = monthActs(m);
        return `<div class="rounded border border-aeblack-200 bg-aeblack-50 p-4">
          <div class="flex items-baseline justify-between gap-2"><h3 class="text-xl font-bold">${monthLabel(m)}</h3><p class="font-semibold" data-bind="sub-${m}"></p></div>
          ${rows.length === 0 ? '<p class="mt-2 rounded border border-dashed border-aeblack-400 p-3 text-aeblack-700">No activities yet.</p>' : ''}
          <ul class="mt-2 space-y-3">${rows.map((a) => `<li class="rounded bg-white p-3">
            <div class="grid gap-2 sm:grid-cols-[1fr_7rem_7rem]">
              ${field(`n-${a.id}`, 'Activity', '', `<input id="n-${a.id}" class="aegov-form-control" value="${esc(a.name)}" data-act="${a.id}" data-f="name" />`)}
              ${field(`h-${a.id}`, 'Hours a week', '', `<input id="h-${a.id}" type="number" inputmode="decimal" min="0" step="any" class="aegov-form-control" value="${a.perWeek}" data-act="${a.id}" data-f="perWeek" />`)}
              ${field(`w-${a.id}`, 'Weeks', '', `<input id="w-${a.id}" type="number" inputmode="decimal" min="0" step="any" class="aegov-form-control" value="${a.weeks}" data-act="${a.id}" data-f="weeks" />`)}
            </div>
            <div class="mt-2 flex items-center justify-between gap-2"><p class="font-semibold" data-bind="math-${a.id}"></p>
              <button type="button" class="aegov-btn btn-outline btn-sm" data-rm-act="${a.id}" aria-label="Remove activity ${esc(a.name)}">${ICON.trash} Remove</button></div>
          </li>`).join('')}</ul>
          <button type="button" class="aegov-btn btn-outline mt-3" data-add-act="${m}">${ICON.plus} Add an activity</button>
        </div>`;
      }).join('')}
    </div>
    <div class="mt-6 rounded bg-aegold-900 p-5 text-white" aria-live="polite">
      <p class="text-sm font-semibold uppercase tracking-wide">Adding it up</p>
      <p class="mt-1 text-2xl font-bold" data-bind="total-line"></p>
      <p class="mt-2 text-sm">This is arithmetic only. The state decides which hours count.</p>
    </div>
  </section>`,
  // 4 Packet
  () => `
  <div class="no-print card mb-4">
    <h2 class="text-2xl font-bold text-aegold-900">Printable Packet</h2>
    <p class="mt-1">Review the pages below, then print or save as PDF from your browser. Nothing is submitted.</p>
    <div class="mt-3 flex flex-wrap gap-3">
      <button type="button" class="aegov-btn btn-lg" data-print>${ICON.print} Print this packet</button>
      <button type="button" class="aegov-btn btn-outline btn-lg" data-go="1">Edit notice details</button>
    </div>
  </div>
  <article aria-label="Packet">${packetHtml()}</article>`,
];

function foot(p) { return `<div class="mt-8 flex justify-between border-t border-aeblack-300 pt-2 text-xs"><span>HourKeep &middot; ${REF}</span><span>Page ${p} of 3</span></div>`; }
function packetHtml() {
  const ms = months();
  return `
  <section class="packet-page" aria-labelledby="pk1">
    <h2 id="pk1" class="text-2xl font-bold">1. Packet Summary</h2>
    <dl class="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
      <dt class="font-semibold">Person</dt><dd>Jordan Lee</dd>
      <dt class="font-semibold">Reference</dt><dd>${REF}</dd>
      <dt class="font-semibold">Requested months</dt><dd data-bind="pk-months"></dd>
      <dt class="font-semibold">Notice date</dt><dd data-bind="pk-notice"></dd>
      <dt class="font-semibold">Response date (as printed)</dt><dd data-bind="pk-response"></dd>
      <dt class="font-semibold">How to respond</dt><dd data-bind="pk-method"></dd>
    </dl>
    <h3 class="mt-6 text-lg font-bold">Inside</h3>
    <ol class="mt-1 list-decimal pl-6"><li>Packet summary</li><li>Hours and arithmetic</li><li>Records described and signature</li></ol>
    <p class="mt-6 text-sm">This packet is not connected to any agency or submission channel. The state makes all determinations.</p>
    ${foot(1)}
  </section>
  <section class="packet-page" aria-labelledby="pk2">
    <h2 id="pk2" class="text-2xl font-bold">2. Hours and Arithmetic</h2>
    <p class="mt-1 text-sm">Hours shown = hours a week × weeks.</p>
    ${ms.map((m) => { const rows = monthActs(m); return `<div class="mt-5"><h3 class="text-lg font-bold">${monthLabel(m)}</h3>${rows.length === 0 ? '<p class="text-sm">No response was provided for this month’s activities.</p>' : `<table class="mt-1 w-full border-collapse text-sm"><tbody>${rows.map((a) => `<tr class="border-b border-aeblack-300"><td class="py-1 pr-2">${esc(a.name)}</td><td class="whitespace-nowrap py-1 pr-2">${a.perWeek} × ${a.weeks}</td><td class="whitespace-nowrap py-1 text-right">= ${num(hoursOf(a))} hours</td></tr>`).join('')}<tr><td class="py-1 font-bold" colspan="2">Month subtotal</td><td class="py-1 text-right font-bold">${sum(rows)} hours</td></tr></tbody></table>`}</div>`; }).join('')}
    <div class="mt-6 border-2 border-aeblack-800 p-3"><p class="font-bold" data-bind="pk-total"></p><p class="text-sm">Arithmetic only. No eligibility decision is made here.</p></div>
    ${foot(2)}
  </section>
  <section class="packet-page" aria-labelledby="pk3">
    <h2 id="pk3" class="text-2xl font-bold">3. Records Described</h2>
    <p class="mt-1 text-sm">Descriptions only. No files are attached.</p>
    ${ms.map((m) => { const rows = S.proofs.filter((p) => p.month === m); return `<div class="mt-4"><h3 class="text-lg font-bold">${monthLabel(m)}</h3>${rows.length === 0 ? '<p class="text-sm">No response was provided describing this month’s records.</p>' : `<ol class="list-decimal pl-6 text-sm">${rows.map((p) => `<li>${esc(p.text)}</li>`).join('')}</ol>`}</div>`; }).join('')}
    <div class="mt-10 grid gap-8 sm:grid-cols-2"><div><div class="h-10 border-b-2 border-aeblack-800"></div><p class="mt-1 text-sm">Signature</p></div><div><div class="h-10 border-b-2 border-aeblack-800"></div><p class="mt-1 text-sm">Date</p></div></div>
    <p class="mt-8 border-2 border-aeblack-800 p-3 text-sm">This packet does not determine whether a person is exempt or has met any requirement. The state makes that determination.</p>
    ${foot(3)}
  </section>`;
}

/* ---------- Rendering ---------- */
function bind(k, v) { main.querySelectorAll(`[data-bind="${k}"]`).forEach((e) => { e.textContent = v; }); }
function updateDerived() {
  const ms = months();
  bind('ov-notice', fmtDate(S.letter.noticeDate));
  bind('ov-response', fmtDate(S.letter.responseDate));
  bind('ov-months', ms.map(monthLabel).join(', ') || 'None selected');
  bind('pk-months', ms.map(monthLabel).join(' and ') || 'None selected');
  bind('pk-notice', fmtDate(S.letter.noticeDate));
  bind('pk-response', fmtDate(S.letter.responseDate));
  bind('pk-method', S.letter.method);
  bind('pk-total', `Total listed: ${totalHours()} hours`);
  S.activities.forEach((a) => bind(`math-${a.id}`, `${num(Number(a.perWeek) || 0)} × ${num(Number(a.weeks) || 0)} = ${num(hoursOf(a))} hours`));
  ms.forEach((m) => bind(`sub-${m}`, `${sum(monthActs(m))} hours`));
  bind('total-line', `${ms.map((m) => sum(monthActs(m))).join(' + ') || '0'} = ${totalHours()} hours`);
  const de = document.getElementById('date-error');
  if (de) de.innerHTML = dateError() ? `<div class="aegov-alert alert-error mt-3" role="alert"><div class="alert-content"><p>${dateError()}</p></div></div>` : '';
  const me = document.getElementById('months-error');
  if (me) me.innerHTML = ms.length === 0 ? `<div class="aegov-alert alert-error mt-3" role="alert"><div class="alert-content"><p>Select at least one month to continue.</p></div></div>` : '';
  const nx = document.getElementById('next');
  if (nx) nx.disabled = S.step === 1 && (ms.length === 0 || !!dateError());
}

function renderChrome() {
  stepsEl.innerHTML = STEPS.map((s, i) => `<li><button type="button" class="step-btn w-full rounded border border-aeblack-300 bg-white px-1 py-2 text-center text-sm font-semibold hover:bg-aegold-50" data-go="${i}" ${i === S.step ? 'aria-current="step"' : ''} aria-label="Step ${i + 1}: ${s}"><span class="sm:hidden">${i + 1}</span><span class="hidden sm:inline">${i + 1}. ${s}</span></button></li>`).join('');
  resetArea.innerHTML = confirmReset
    ? `<span class="flex items-center gap-2" role="group" aria-label="Confirm reset"><span class="text-sm font-semibold">Reset sample case?</span><button type="button" class="aegov-btn btn-sm" data-reset-yes>Reset</button><button type="button" class="aegov-btn btn-outline btn-sm" data-reset-no>Keep</button></span>`
    : `<button type="button" class="aegov-btn btn-outline btn-sm" data-reset>Start over</button>`;
  recSlot.innerHTML = recovered ? `<div class="mx-auto max-w-4xl px-4 pt-4"><div class="aegov-alert alert-warning" role="status"><div class="alert-content"><p>Saved information could not be read, so a fresh sample case was loaded.</p></div><button type="button" class="aegov-btn btn-sm btn-outline" data-dismiss>OK</button></div></div>` : '';
}
function renderBody() {
  const active = document.activeElement && document.activeElement.id;
  main.innerHTML = views[S.step]() + (S.step > 0 && S.step < 4
    ? `<div class="no-print mt-4 flex justify-between gap-3"><button type="button" class="aegov-btn btn-outline" data-go="${S.step - 1}">${ICON.back} Back</button><button type="button" id="next" class="aegov-btn" data-go="${S.step + 1}">Next: ${STEPS[S.step + 1]} ${ICON.arrow}</button></div>`
    : S.step === 4 ? `<div class="no-print mt-4"><button type="button" class="aegov-btn btn-outline" data-go="3">${ICON.back} Back</button></div>` : '');
  updateDerived();
  if (active) { const el = document.getElementById(active); if (el) el.focus(); }
}
function render() { renderChrome(); renderBody(); }

/* ---------- Events ---------- */
document.addEventListener('click', (e) => {
  const t = e.target.closest('button');
  if (!t) return;
  const d = t.dataset;
  if (d.go !== undefined) return go(+d.go);
  if (d.print !== undefined) return window.print();
  if (d.reset !== undefined) { confirmReset = true; return renderChrome(); }
  if (d.resetNo !== undefined) { confirmReset = false; return renderChrome(); }
  if (d.resetYes !== undefined) { try { localStorage.removeItem(KEY); } catch { /* ignore */ } S = defaults(); recovered = false; confirmReset = false; return render(); }
  if (d.dismiss !== undefined) { recovered = false; return renderChrome(); }
  if (d.rmProof) { S.proofs = S.proofs.filter((p) => p.id !== d.rmProof); return commit(); }
  if (d.rmAct) { S.activities = S.activities.filter((a) => a.id !== d.rmAct); return commit(); }
  if (d.addAct) {
    const id = uid();
    S.activities.push({ id, month: d.addAct, name: 'Activity', perWeek: 1, weeks: 1 });
    save(); renderBody();
    const el = document.getElementById(`n-${id}`); if (el) { el.focus(); el.select(); }
  }
});
document.addEventListener('submit', (e) => {
  const m = e.target.dataset && e.target.dataset.addProof;
  if (!m) return;
  e.preventDefault();
  const inp = e.target.querySelector('input');
  const text = inp.value.trim();
  if (!text) { inp.focus(); return; }
  S.proofs.push({ id: uid(), month: m, text });
  save(); renderBody();
  const el = document.getElementById(`pf-${m}`); if (el) el.focus();
});
document.addEventListener('input', (e) => {
  const t = e.target;
  if (t.dataset.letter) { S.letter[t.dataset.letter] = t.value; return commit(false); }
  if (t.dataset.act) {
    const a = S.activities.find((x) => x.id === t.dataset.act);
    if (!a) return;
    a[t.dataset.f] = t.dataset.f === 'name' ? t.value : Math.max(0, Number(t.value) || 0);
    commit(false);
  }
});
document.addEventListener('change', (e) => {
  const t = e.target;
  if (t.dataset.month) {
    const m = t.dataset.month;
    S.letter.months = t.checked ? [...new Set([...S.letter.months, m])] : S.letter.months.filter((x) => x !== m);
    return commit(false);
  }
  if (t.dataset.method !== undefined) { S.letter.method = METHODS[+t.dataset.method]; return commit(false); }
  if (t.dataset.check) { S.checks[t.dataset.check] = t.checked; save(); }
});

render();
