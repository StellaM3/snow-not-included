import './style.css'
import { dataView } from './views/data-view.js'
import { hiddenView } from './views/hidden-view.js'
import { initTips } from './util.js'

// État de la page. Il est aussi gardé dans l'URL (#cache, ?prod=…) pour pouvoir partager un lien.
const params = new URLSearchParams(location.search)
const st = {
  mode: location.hash === '#cache' ? 'hidden' : 'magic',
  years: [2010, 2024],
  prod: params.get('prod') || 'sapins',
  dec: '2010',
  elecYear: 2024,
}
const YEARS = [1990, 2000, 2010, 2017, 2024]

const ICON_SUN = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="6" fill="currentColor"/><g stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 1v3M12 20v3M1 12h3M20 12h3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></g></svg>'
const ICON_MOON = '<svg viewBox="0 0 24 24"><path d="M15 3a9 9 0 1 0 6 15A8 8 0 0 1 15 3z" fill="currentColor"/></svg>'

function header() {
  const hidden = st.mode === 'hidden'
  return `<header class="header">
    <div class="header-left">
      <div class="meta">
        ${hidden ? '<span class="dossier">Dossier n° 25.12 · Guirlandes éteintes</span>' : '<span>ECAL · Make Sense · 2026</span>'}
        <span class="lang" title="Version anglaise bientôt"><button class="on">FR</button><button disabled>EN</button></span>
      </div>
      <h1 class="h1">${hidden ? 'La face cachée<br><em>de Noël.</em>' : "Tout s'importe à Noël.<br><em>Sauf la neige.</em>"}</h1>
      ${hidden ? '' : `<div class="chips"><span style="font-size:15px;color:var(--t2);margin-right:6px">Compare :</span>${YEARS.map((y) => {
        const i = st.years.indexOf(y)
        return `<button class="chip ${i >= 0 ? 'on' : ''} ${i === 0 && st.years.length > 1 ? 'year-a' : ''}" data-year="${y}">${y}</button>`
      }).join('')}</div>`}
    </div>
    <div class="switch-wrap">
      <span class="kicker" style="color:var(--t2)">Guirlandes</span>
      <div class="switch" role="group" aria-label="Allumer ou éteindre les guirlandes">
        <button class="magic ${hidden ? '' : 'on'}" data-mode="magic" aria-pressed="${!hidden}">${ICON_SUN}Magique</button>
        <button class="dark ${hidden ? 'on' : ''}" data-mode="hidden" aria-pressed="${hidden}">${ICON_MOON}Face cachée</button>
      </div>
    </div>
  </header>`
}

function footer() {
  return `<footer class="footer">
    <p class="src">Sources : MétéoSuisse (neige manuelle, séries homogénéisées) · OFDF commerce extérieur (TN8) · Swissgrid · OFS · swisstopo (swissALTIRegio) · Suva, BPA, AXA · La Main Tendue · Statistique Vaud. Foie gras : nomenclature douanière modifiée en 2012.</p>
    <p class="src">Estelle Rossier · Master Digital Experience Design, ECAL · workshop « Make Sense » avec Pascal Wicht · 2026</p>
  </footer>`
}

const app = document.querySelector('#app')
function render(keepScroll = true) {
  const y = window.scrollY
  document.body.classList.toggle('hidden', st.mode === 'hidden')
  app.innerHTML = `<main class="page">${header()}${st.mode === 'hidden' ? hiddenView(st) : dataView(st)}${footer()}</main>`
  if (keepScroll) window.scrollTo(0, y)
}

app.addEventListener('click', (e) => {
  const b = e.target.closest('[data-mode],[data-year],[data-prod],[data-dec],[data-elec]')
  if (!b || b.disabled) return
  const d = b.dataset
  if (d.mode) {
    if (st.mode === d.mode) return
    st.mode = d.mode
    history.replaceState(null, '', d.mode === 'hidden' ? '#cache' : location.pathname + location.search)
    render(false)
    window.scrollTo({ top: 0 })
    return
  }
  if (d.year) {
    const y = +d.year
    const i = st.years.indexOf(y)
    if (i >= 0) { if (st.years.length > 1) st.years.splice(i, 1) }
    else { st.years.push(y); if (st.years.length > 2) st.years.shift() }
    st.years.sort((a, b) => a - b)
  }
  if (d.prod) st.prod = d.prod
  if (d.dec) st.dec = d.dec
  if (d.elec) st.elecYear = +d.elec
  render()
})

initTips()
render(false)
