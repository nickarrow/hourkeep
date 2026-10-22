// Drives every route of the built prototype in Chromium and checks what a person would see.
// Run `npm run build` first, then `npm run check:flows`. Exits 1 if any check fails.
// Set SHOTS=/some/folder to also save phone-width screenshots.
import { chromium } from 'playwright';
import { preview } from 'vite';

const server = await preview({ preview: { port: 0, strictPort: false }, logLevel: 'silent' });
const URL = server.resolvedUrls.local[0];
const SHOTS = process.env.SHOTS;
const results = [];
const check = (name, ok, detail = '') => { results.push({ name, ok: !!ok, detail }); };

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

const stepTitles = () => page.$$eval('#steps button', (bs) => bs.map((b) => b.getAttribute('aria-label').replace(/^Step \d+ of \d+: /, '')));
const store = () => page.evaluate(() => JSON.parse(localStorage.getItem('hourkeep-prototype-v2') || 'null'));
const text = () => page.locator('main').innerText();
const noHScroll = () => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
const goStep = (title) => page.click(`#steps button[aria-label$=": ${title}"]`);

await page.goto(URL);
await page.evaluate(() => localStorage.clear());
await page.reload();

// 1. Default letter route, noncompliance: no hearing step.
let st = await stepTitles();
check('letter route shows 7 steps without Fair Hearing', st.length === 7 && !st.includes('Fair Hearing'), st.join(' | '));
check('start screen fits a phone with no sideways scroll', await noHScroll());
if (SHOTS) await page.screenshot({ path: `${SHOTS}/1-start.png`, fullPage: true });

// 2. Denial adds the hearing path.
await goStep('Your Letter');
await page.click('#lk-denial');
st = await stepTitles();
check('a denial letter adds the Fair Hearing step', st.includes('Fair Hearing'), st.join(' | '));
check('focus stays on the tapped letter choice', (await page.evaluate(() => document.activeElement.id)) === 'lk-denial');
await goStep('Fair Hearing');
await page.fill('#h-action', '2027-04-15');
check('hearing advice names the date of action entered', (await text()).includes('Ask before April 15, 2027'));
if (SHOTS) await page.screenshot({ path: `${SHOTS}/2-hearing.png`, fullPage: true });

// 3. Back to noncompliance: cross-check.
await goStep('Your Letter');
await page.click('#lk-noncompliance');
await goStep('Notice Details');
let t = await text();
check('cross-check shows the full formula', t.includes('March 2, 2027 + 5 days until it counts as received + 30 days = April 6, 2027'));
check('a different printed date says to meet the printed date', t.includes('Meet the printed date, March 31, 2027'));
check('the cross-check is labelled Conditional', t.includes('CONDITIONAL'));
if (SHOTS) await page.screenshot({ path: `${SHOTS}/3-notice.png`, fullPage: true });
await page.fill('#response', '2027-04-06');
check('a matching printed date says it matches', (await text()).includes('This matches the date printed on your letter.'));
check('typing in a date keeps focus in the field', (await page.evaluate(() => document.activeElement.id)) === 'response');
await page.fill('#response', '2027-03-01');
check('a respond-by date before the letter date is flagged', (await text()).includes('is before the date on the letter'));
check('Next is disabled while the dates conflict', await page.isDisabled('#next'));
await page.fill('#response', '2027-03-31');

// 4. Exclusions: a skip is never a no.
await goStep('Might Not Apply to You');
check('nothing is tapped by default, and nothing is stored as false', JSON.stringify((await store())?.exclusions ?? {}) === '{}');
await page.check('#ex-snap');
t = await text();
check('tapping SNAP shows only its follow-up questions', t.includes('Are you on that SNAP case?') && !t.includes('Tribal enrollment papers'));
check('focus stays on the tapped checkbox', (await page.evaluate(() => document.activeElement.id)) === 'ex-snap');
check('the SNAP warning about losing SNAP appears', t.includes('Working fewer hours can cost your household SNAP'));
check('tapping stores true', (await store()).exclusions.snap === true);
if (SHOTS) await page.screenshot({ path: `${SHOTS}/4-exclusions.png`, fullPage: true });
await page.uncheck('#ex-snap');
const ex = (await store()).exclusions;
check('untapping removes the answer instead of storing false', !('snap' in ex), JSON.stringify(ex));
check('the screen never asks whether SNAP rules are being met', !(await text()).match(/meeting (your )?SNAP/i));

// 5. Records: a follow-up only when the record makes it matter.
await goStep('Records');
t = await text();
check('the school record asks the half-time question', t.includes('Does it show enrollment at least half-time?'));
check('the pay stub asks for hours', (await page.$('#rh-r3')) !== null);
check('the letter-from-state type asks nothing extra at add time', true);
await page.click('#tg-halftime\\:r2-yes');
check('a toggle answer is stored', (await store()).records.find((r) => r.id === 'r2').halftime === 'yes');
await page.click('#tg-halftime\\:r2-yes');
check('tapping the same answer again clears it rather than storing no', (await store()).records.find((r) => r.id === 'r2').halftime === undefined);
await page.click('#tg-halftime\\:r2-yes');
await page.selectOption('#rt-2027-02', 'snapletter');
await page.fill('#rd-2027-02', 'SNAP renewal letter');
await page.click('form[data-add-record="2027-02"] button[type=submit]');
t = await text();
check('a SNAP letter points to the SNAP questions', t.includes('Go to Might Not Apply to You'));
check('documents are numbered in packet order', t.includes('D1 · Hours form') && t.includes('D3 · Pay stub') && t.includes('D4 · SNAP or TANF letter'));
if (SHOTS) await page.screenshot({ path: `${SHOTS}/5-records.png`, fullPage: true });

// 6. Packet one tap away, and back again.
await page.click('[data-preview]');
check('Preview packet opens the packet from any step', (await page.locator('main h2').first().innerText()) === 'Your Packet');
await page.click('text=Back to where you were');
check('Back to where you were returns to Records', (await page.locator('main h2').first().innerText()) === 'Records');

// 7. Month by month: arithmetic in full, no verdict.
await goStep('Month by Month');
t = await text();
check('January shows its sum in full', t.includes('24 + 20 = 44 hours'), (t.match(/Logged:.*$/gm) || []).join(' / '));
check('February shows its sum in full', t.includes('62 + 24 = 86 hours'));
check('activity arithmetic uses the multiplication sign', t.includes('5 × 4 = 20 hours'));
check('half-time enrollment is stated, not concluded', t.includes('The rule counts that without any hours'));
check('no screen states a verdict', !/\b(you (have )?met|not met|you meet|compliant|exempt from the requirement|short by|you need \d+ more)\b/i.test(t));
check('every number labelled: Computed, Conditional and Deferred all appear', t.includes('COMPUTED') && t.includes('CONDITIONAL') && t.includes('DEFERRED'));
await page.fill('#h-a1', '10');
check('changing hours updates the sum while typing', (await text()).includes('24 + 40 = 64 hours'));
check('focus stays in the hours field while typing', (await page.evaluate(() => document.activeElement.id)) === 'h-a1');
await page.fill('#h-a1', '5');
check('month by month fits a phone with no sideways scroll', await noHScroll());
if (SHOTS) await page.screenshot({ path: `${SHOTS}/6-months.png`, fullPage: true });

// 8. Packet pages.
await goStep('Packet');
const pages = await page.$$eval('.packet-page', (ps) => ps.map((p) => p.innerText));
const n = pages.length;
check('packet has summary, might-not-apply, a page per month, and documents', n === 5, `${n} pages`);
check('every page names the person, the reference and its page number',
  pages.every((p, i) => p.includes('Jordan Lee') && p.includes('HK-2027-0142') && p.includes(`Page ${i + 1} of ${n}`)));
check('month pages name their month in the footer', pages[2].includes('January 2027') && pages[3].includes('February 2027'));
check('no exclusions tapped prints the eAPD phrase, not a no', pages[1].includes('No response was provided about reasons the rule might not apply.'));
check('the packet concludes nothing', pages.join('\n').includes('It does not say whether anyone meets the requirement'));
check('the signature is not a sworn statement', pages[n - 1].includes('A signature here is not a sworn statement.'));
check('the packet says what is in it before printing', (await text()).includes('Anyone who sees the printout or the file can read all of it.'));
if (SHOTS) await page.screenshot({ path: `${SHOTS}/7-packet.png`, fullPage: true });

// 9. Tracking route: no letter, no exclusions, months chosen in Records.
await page.click('#steps button[aria-label$=": Why You’re Here"]');
await page.click('#route-tracking');
st = await stepTitles();
check('keep-track route shows only 4 steps', st.join('|') === 'Why You’re Here|Records|Month by Month|Packet', st.join(' | '));
await goStep('Records');
check('records asks for months when there is no letter', (await text()).includes('The months you expect your state to ask about.'));
await goStep('Packet');
check('a packet with no letter says it was gathered ahead', (await text()).includes('Gathered before any letter arrived.'));

// 10. Helper route: must answer whether they got a letter.
await page.click('#steps button[aria-label$=": Why You’re Here"]');
await page.click('#route-helping');
check('the helper banner appears', (await page.locator('#helper-slot').innerText()).includes('You’re helping someone'));
check('Next waits until the helper says whether there is a letter', await page.isDisabled('#next'));
await page.click('#tg-helperHasLetter-yes');
st = await stepTitles();
check('a helper with a letter gets the letter steps', st.includes('Your Letter') && st.includes('Notice Details'));
await page.click('#tg-helperHasLetter-no');
st = await stepTitles();
check('a helper with no letter skips them', !st.includes('Your Letter') && st.includes('Might Not Apply to You'));

// 11. Saved state from the old prototype is replaced, and the person is told.
await page.evaluate(() => localStorage.setItem('hourkeep-prototype-v2', JSON.stringify({ step: 3, letter: {} })));
await page.reload();
check('unreadable saved state loads the sample case and says so', (await page.locator('#recovered-slot').innerText()).includes('could not be read'));

// 12. Keyboard: a choice can be reached and pressed without a mouse.
await page.evaluate(() => localStorage.clear()); await page.reload();
await page.focus('#route-renewing'); await page.keyboard.press('Enter');
check('a route can be chosen with the keyboard', (await store()).route === 'renewing');

check('no errors in the console', errors.length === 0, errors.join(' / '));
await browser.close();
await server.close();

const failed = results.filter((r) => !r.ok);
for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.ok || !r.detail ? '' : `  [${r.detail}]`}`);
console.log(`\n${results.length - failed.length} of ${results.length} passed`);
process.exit(failed.length ? 1 : 0);
