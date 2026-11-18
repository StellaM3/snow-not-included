// Page d'accueil : récit défilant (hier → aujourd'hui → demain), style noir, ivoire, bordeaux et or
import { lang } from '../i18n.js'
import { HOME, TREND_SOURCES } from '../homeTexts.js'
import { CHAPTERS } from '../nav.js'

const H = () => HOME[lang] || HOME.fr

// Visuel collant d'une étape : avant (petit, barré) → aujourd'hui (grand) + jauge
function stepVisual(s, i, active) {
  const [a, b, max] = s.bar
  const h = H()
  return `<div class="sv ${i === active ? 'on' : ''}" data-sv="${i}" aria-hidden="${i !== active}">
    <p class="sv-theme"><span>${String(i + 1).padStart(2, '0')}</span>${s.theme}</p>
    <div class="sv-then"><small>${h.then} · ${s.ay}</small><b>${s.a}</b></div>
    <div class="sv-now"><small>${h.now} · ${s.by}</small><b>${s.b}</b></div>
    <div class="sv-gauge"><i class="g-a" style="width:${(a / max) * 100}%"></i><i class="g-b" style="width:${(b / max) * 100}%"></i></div>
  </div>`
}

export function homeView() {
  const h = H()
  return `<div class="lp">
    <section class="lp-hero">
      <div class="lp-snow" aria-hidden="true">${Array.from({ length: 28 }, (_, i) => `<i style="left:${(i * 37) % 100}%;animation-delay:${(i % 9) * 1.3}s;animation-duration:${9 + (i % 5) * 2}s"></i>`).join('')}</div>
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
