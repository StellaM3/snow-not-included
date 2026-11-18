// Page d'accueil : récit défilant (hier → aujourd'hui → demain), style noir, ivoire, bordeaux et or
import { lang } from '../i18n.js'
import { HOME, TREND_SOURCES } from '../homeTexts.js'
import { CHAPTERS } from '../nav.js'

const H = () => HOME[lang] || HOME.fr

// Petites visualisations de données, une par étape (traits fins, or et ivoire)
const GOLD = '#C9A45C', IV = '#F3ECDF', MUTE = '#5A4F47'
function dots(n, on, cols, r, gap, colOn, colOff) {
  let s = ''
  for (let i = 0; i < n; i++) s += `<circle cx="${(i % cols) * gap + r}" cy="${Math.floor(i / cols) * gap + r}" r="${r}" fill="${i < on ? colOn : 'none'}" stroke="${i < on ? colOn : colOff}" stroke-width="1"/>`
  return s
}
const label = (x, y, t, c = MUTE, a = 'start') => `<text x="${x}" y="${y}" fill="${c}" font-family="Inter" font-size="11" letter-spacing="2" text-anchor="${a}">${t}</text>`
function stepViz(i, s) {
  const W = 520, H = 200
  let g = ''
  if (i === 0) { // montagne et limites de neige
    const y = (alt) => H - 20 - (alt / 1500) * (H - 30)
    g += `<path d="M0 ${H - 20} L70 ${y(600)} L120 ${y(480)} L210 ${y(1350)} L300 ${y(820)} L360 ${y(1050)} L440 ${y(560)} L520 ${y(700)} L520 ${H - 20} Z" fill="none" stroke="${IV}" stroke-width="1.2"/>`
    g += `<line x1="0" x2="520" y1="${y(570)}" y2="${y(570)}" stroke="${MUTE}" stroke-dasharray="3 5"/>${label(516, y(570) + 16, s.ay.toUpperCase() + ' · 570 M', MUTE, 'end')}`
    g += `<line x1="0" x2="520" y1="${y(927)}" y2="${y(927)}" stroke="${GOLD}" stroke-width="1.5"/>${label(516, y(927) - 8, s.by.toUpperCase() + ' · 927 M', GOLD, 'end')}`
    g += `<rect x="0" y="${y(927)}" width="520" height="${y(570) - y(927)}" fill="${GOLD}" opacity=".08"/>`
  } else if (i === 1) { // 100 décorations : part chinoise
    g += `<g transform="translate(0 20)">${dots(100, 14, 20, 4, 12, MUTE, '#3A302B')}</g>${label(0, 10, s.ay)}`
    g += `<g transform="translate(270 20)">${dots(100, 65, 20, 4, 12, GOLD, '#3A302B')}</g>${label(270, 10, s.by, GOLD)}`
  } else if (i === 2) { // meules de fromage proportionnelles
    const r1 = Math.sqrt(26) * 9.5, r2 = Math.sqrt(79) * 9.5 + 8
    g += `<circle cx="${80}" cy="${H - 20 - r1}" r="${r1}" fill="none" stroke="${MUTE}" stroke-width="1.2"/><circle cx="80" cy="${H - 20 - r1}" r="${r1 * .35}" fill="none" stroke="${MUTE}" stroke-dasharray="2 4"/>${label(80, H - 4, s.ay, MUTE, 'middle')}`
    g += `<circle cx="${320}" cy="${H - 20 - r2 + 8}" r="${r2 - 8}" fill="${GOLD}" fill-opacity=".1" stroke="${GOLD}" stroke-width="1.2"/><circle cx="320" cy="${H - 20 - r2 + 8}" r="${(r2 - 8) * .35}" fill="none" stroke="${GOLD}" stroke-dasharray="2 4"/>${label(320, H - 4, s.by, GOLD, 'middle')}`
  } else if (i === 3) { // bulles : France et Italie, deux années
    const bar = (x, yr, fr, it, c) => {
      const h = 150, w = 46
      return `<rect x="${x}" y="${30 + h * (1 - it / 100)}" width="${w}" height="${h * it / 100}" fill="${IV}" opacity=".85"/><rect x="${x}" y="${30 + h * (1 - (it + fr) / 100)}" width="${w}" height="${h * fr / 100}" fill="${GOLD}"/><rect x="${x}" y="30" width="${w}" height="${h}" fill="none" stroke="${MUTE}"/>${label(x + w / 2, H - 4, yr, c, 'middle')}`
    }
    g += bar(40, s.ay, 67, 4.5, MUTE) + bar(150, s.by, 23, 64, GOLD)
    g += `<rect x="260" y="60" width="12" height="12" fill="${GOLD}"/>${label(280, 70, lang === 'fr' ? 'FRANCE · CHAMPAGNE' : 'FRANCE · CHAMPAGNE', IV)}<rect x="260" y="90" width="12" height="12" fill="${IV}" opacity=".85"/>${label(280, 100, lang === 'fr' ? 'ITALIE · PROSECCO' : 'ITALY · PROSECCO', IV)}`
  } else if (i === 4) { // livres : 10 dos de livres, deux années
    const row = (y0, on, c, yr) => { let r = label(0, y0 + 44, yr, c); for (let k = 0; k < 10; k++) r += `<rect x="${60 + k * 30}" y="${y0 + (k % 3) * 4}" width="20" height="${56 - (k % 3) * 4}" rx="2" fill="${k < on ? c : 'none'}" stroke="${k < on ? c : '#3A302B'}"/>`; return r }
    g += row(20, 5.6, MUTE, s.ay) + row(110, 3, GOLD, s.by)
  } else if (i === 5) { // 100 personnes : sans religion
    g += `<g transform="translate(0 20)">${dots(100, 1, 20, 4, 12, MUTE, '#3A302B')}</g>${label(0, 10, s.ay)}`
    g += `<g transform="translate(270 20)">${dots(100, 36, 20, 4, 12, GOLD, '#3A302B')}</g>${label(270, 10, s.by, GOLD)}`
  } else { // top 30 : cases des chansons de Noël
    const grid = (x0, on, c, yr) => { let r = label(x0, 10, yr, c); for (let k = 0; k < 30; k++) r += `<rect x="${x0 + (k % 6) * 34}" y="${22 + Math.floor(k / 6) * 34}" width="26" height="26" fill="${k < on ? c : 'none'}" stroke="${k < on ? c : '#3A302B'}"/>`; return r }
    g += grid(0, 0, MUTE, s.ay) + grid(280, 26, GOLD, s.by)
  }
  return `<svg class="sv-viz" viewBox="0 0 ${W} ${H}" role="img" aria-label="${s.theme}">${g}</svg>`
}

// Visuel collant d'une étape : avant (petit, barré) → aujourd'hui (grand) + jauge
function stepVisual(s, i, active) {
  const h = H()
  return `<div class="sv ${i === active ? 'on' : ''}" data-sv="${i}" aria-hidden="${i !== active}">
    <p class="sv-theme"><span>${String(i + 1).padStart(2, '0')}</span>${s.theme}</p>
    <div class="sv-nums"><div class="sv-then"><small>${h.then} · ${s.ay}</small><b>${s.a}</b></div>
    <div class="sv-now"><small>${h.now} · ${s.by}</small><b>${s.b}</b></div></div>
    ${stepViz(i, s)}
  </div>`
}

// Illustration d'ambiance du héros : montagnes au trait, sapins, chalet à la fenêtre allumée
function heroArt() {
  const trees = [[620, 560, 1], [660, 575, .8], [700, 568, .9], [1000, 560, 1.1], [1040, 572, .75]].map(([x, y, k]) =>
    `<g transform="translate(${x} ${y}) scale(${k})"><path d="M0 -70 L18 -38 H9 L26 -6 H12 L32 24 H-32 L-12 -6 H-26 L-9 -38 H-18 Z" fill="none" stroke="${GOLD}" stroke-width="1"/><line x1="0" y1="24" x2="0" y2="36" stroke="${GOLD}"/></g>`).join('')
  return `<svg class="lp-art" viewBox="0 0 1200 700" aria-hidden="true" preserveAspectRatio="xMaxYMax meet">
    <path d="M380 700 L520 470 L580 520 L720 260 L800 380 L880 320 L1040 540 L1200 440 L1200 700Z" fill="url(#mtn)" stroke="${IV}" stroke-opacity=".35" stroke-width="1"/>
    <path d="M720 260 L756 316 L738 310 L724 326 L708 308 L688 318 Z M880 320 L904 352 L890 348 L878 358 L866 348 L858 354Z" fill="${IV}" opacity=".55"/>
    <line x1="440" x2="1200" y1="560" y2="560" stroke="${GOLD}" stroke-dasharray="2 6" opacity=".7"/>
    <text x="1170" y="552" text-anchor="end" fill="${GOLD}" font-family="Inter" font-size="11" letter-spacing="2" opacity=".9">${lang === 'fr' ? 'LIMITE DU NOËL BLANC · 927 M' : 'WHITE-CHRISTMAS LINE · 927 M'}</text>
    ${trees}
    <g transform="translate(820 600)"><path d="M-46 0 V-40 L0 -74 L46 -40 V0 Z" fill="#0E0B0A" stroke="${IV}" stroke-opacity=".6"/><rect x="-14" y="-34" width="28" height="22" fill="${GOLD}" class="lp-window"/><path d="M0 -34 V-12 M-14 -23 H14" stroke="#0E0B0A" stroke-width="2"/></g>
    <defs><linearGradient id="mtn" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#2A1416" stop-opacity=".6"/><stop offset="1" stop-color="#0E0B0A"/></linearGradient></defs>
  </svg>`
}

export function homeView() {
  const h = H()
  return `<div class="lp">
    <section class="lp-hero">
      <div class="lp-snow" aria-hidden="true">${Array.from({ length: 28 }, (_, i) => `<i style="left:${(i * 37) % 100}%;animation-delay:${(i % 9) * 1.3}s;animation-duration:${9 + (i % 5) * 2}s"></i>`).join('')}</div>
      ${heroArt()}
      <p class="lp-k">${h.kicker}</p>
      <h1 class="lp-h1">${h.title}</h1>
      <p class="lp-lead">${h.lead}</p>
      <div class="lp-by"><b>${h.by}</b><span>${h.byMeta}</span></div>
      <a class="lp-scroll" href="#act1" data-anchor="act1"><span>${h.scroll}</span><i aria-hidden="true"></i></a>
    </section>

    <section class="lp-act" id="act1">
      <header class="lp-sec-head"><p class="lp-k">${h.actK}</p><h2>${h.actT}</h2></header>
      <div class="scrolly">
        <div class="scrolly-vis"><div class="sv-stack">${h.steps.map((s, i) => stepVisual(s, i, 0)).join('')}</div></div>
        <div class="scrolly-steps">${h.steps.map((s, i) => `
          <article class="step ${i === 0 ? 'on' : ''}" data-step="${i}">
            <p class="st-theme">${String(i + 1).padStart(2, '0')} · ${s.theme}</p>
            <p class="st-nums"><span>${s.a}</span> → <b>${s.b}</b></p>
            <p class="st-text">${s.text}</p>
            <a class="st-link" href="#/${s.ch}" data-go="${s.ch}">${h.see} →</a>
          </article>`).join('')}</div>
      </div>
    </section>

    <section class="lp-band lp-forces">
      <header class="lp-sec-head"><p class="lp-k">${h.forcesK}</p><h2>${h.forcesT}</h2></header>
      <ol class="forces">${h.forces.map(([t, d, n], i) => `
        <li class="reveal"><span class="f-n">${n}</span><b>${t}</b><p>${d}</p><i class="f-i">${String(i + 1).padStart(2, '0')}</i></li>`).join('')}</ol>
    </section>

    <section class="lp-ivory">
      <header class="lp-sec-head"><p class="lp-k">${h.trendsK}</p><h2>${h.trendsT}</h2></header>
      <div class="trends">${h.trends.map(([c, t, st]) => `
        <div class="tr reveal"><span class="tr-c">${c}</span><p>${t}</p><span class="pill ${st}">${h.status[st]}</span></div>`).join('')}</div>
    </section>

    <section class="lp-next">
      <header class="lp-sec-head"><p class="lp-k">${h.nextK}</p><h2>${h.nextT}</h2><p class="lp-lead small">${h.nextLead}</p></header>
      <div class="next-grid">${h.next.map(([t, d, c], i) => `
        <article class="nx reveal"><span class="nx-n">${String(i + 1).padStart(2, '0')}</span><b>${t}</b><p>${d}</p>
          <span class="conf ${c}"><i></i><i></i><i></i>${h.conf[c]}</span></article>`).join('')}</div>
      <div class="far">
        <p class="lp-k">${h.farK}</p>
        <div class="far-grid">${h.far.map(([t, d]) => `<div class="reveal"><b>${t}</b><p>${d}</p></div>`).join('')}</div>
      </div>
      <div class="impl">
        <p class="lp-k">${h.implK}</p>
        <div class="impl-grid">${h.impl.map(([t, d]) => `<div class="reveal"><b>${t}</b><p>${d}</p></div>`).join('')}</div>
        <p class="impl-note">${h.implNote}</p>
      </div>
    </section>

    <section class="lp-explore">
      <header class="lp-sec-head"><p class="lp-k">${h.exploreK}</p><h2>${h.exploreT}</h2></header>
      <div class="ex-grid">${CHAPTERS.map((id) => { const [n, d, t] = h.cards[id]; return `
        <a class="ex reveal ${id === 'cache' ? 'dark' : ''}" href="#/${id}" data-go="${id}">
          <span class="ex-t">${t}</span><b class="ex-n">${n}</b><p>${d}</p><span class="ex-go">${h.explore} →</span></a>` }).join('')}</div>
      <details class="lp-src"><summary>${h.srcK}</summary><ul>${TREND_SOURCES.map(([t, u]) => `<li><a href="${u}" target="_blank" rel="noopener">${t}</a></li>`).join('')}</ul></details>
    </section>
  </div>`
}

// Défilement : étape active du récit et apparition douce des blocs
let obs1, obs2
export function watchHome() {
  obs1?.disconnect(); obs2?.disconnect()
  const vis = [...document.querySelectorAll('.sv')], steps = [...document.querySelectorAll('.step')]
  if (!steps.length) return
  obs1 = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return
    const i = +e.target.dataset.step
    steps.forEach((s) => s.classList.toggle('on', s === e.target))
    vis.forEach((v) => { const on = +v.dataset.sv === i; v.classList.toggle('on', on); v.setAttribute('aria-hidden', String(!on)) })
  }), { rootMargin: '-45% 0px -45% 0px' })
  steps.forEach((s) => obs1.observe(s))
  obs2 = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); obs2.unobserve(e.target) } }), { rootMargin: '0px 0px -10% 0px' })
  document.querySelectorAll('.reveal').forEach((r) => obs2.observe(r))
}
