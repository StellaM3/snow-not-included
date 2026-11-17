import './style.css'
import { dataView } from './views/data-view.js'
import { hiddenView } from './views/hidden-view.js'
import { initTips } from './util.js'
import { T, setLang, lang } from './i18n.js'

// État de la page. Le mode « face cachée » est gardé dans l'URL (#cache) pour pouvoir partager un lien.
const params = new URLSearchParams(location.search)
const st = {
  mode: location.hash === '#cache' ? 'hidden' : 'magic',
  picked: [2010, 2024], // ordre des clics, pour remplacer l'année choisie le plus anciennement
  years: [2010, 2024], // les deux années comparées, triées
  voyageYear: 2024, // la carte du voyage montre une seule année
  prod: params.get('prod') || 'sapins',
  decA: '1960',
  decB: '2010',
  item: 'lights',
}

// Langue : ?lang=en dans l'URL, sinon le choix mémorisé, sinon le navigateur (français par défaut)
let saved = null
try { saved = localStorage.getItem('lang') } catch (e) { /* stockage indisponible */ }
const browser = (navigator.language || 'fr').slice(0, 2) === 'en' ? 'en' : 'fr'
setLang(params.get('lang') || saved || browser)

const ICON_SUN = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="6" fill="currentColor"/><g stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 1v3M12 20v3M1 12h3M20 12h3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></g></svg>'
const ICON_MOON = '<svg viewBox="0 0 24 24"><path d="M15 3a9 9 0 1 0 6 15A8 8 0 0 1 15 3z" fill="currentColor"/></svg>'

// Barre du haut : identique dans les deux modes (langue à gauche, interrupteur à droite)
function topbar() {
  const hidden = st.mode === 'hidden'
  return `<div class="topbar">
    <div class="meta">
      <span class="lang" role="group" aria-label="Langue / Language"><button class="${lang === 'fr' ? 'on' : ''}" data-lang="fr" aria-pressed="${lang === 'fr'}">FR</button><button class="${lang === 'en' ? 'on' : ''}" data-lang="en" aria-pressed="${lang === 'en'}">EN</button></span>
      <span class="meta-txt">${T.meta}</span>
    </div>
    <div class="switch-wrap">
      <span class="kicker switch-label">${T.lights}</span>
      <div class="switch" role="group" aria-label="${T.lightsAria}">
        <button class="magic ${hidden ? '' : 'on'}" data-mode="magic" aria-pressed="${!hidden}">${ICON_SUN}${T.magic}</button>
        <button class="dark ${hidden ? 'on' : ''}" data-mode="hidden" aria-pressed="${hidden}">${ICON_MOON}${T.hidden}</button>
      </div>
    </div>
  </div>`
}
function header() {
  const hidden = st.mode === 'hidden'
  return `<header class="header">
    ${hidden ? `<span class="dossier">${T.dossier}</span>` : ''}
    <h1 class="h1">${hidden ? T.h1Hidden : T.h1}</h1>
  </header>`
}
function footer() {
  return `<footer class="footer"><p class="src">${T.sources}</p><p class="src">${T.credits}</p></footer>`
}

const app = document.querySelector('#app')
function render(keepScroll = true) {
  const y = window.scrollY
  document.body.classList.toggle('hidden', st.mode === 'hidden')
  app.innerHTML = `${topbar()}<main class="page">${header()}${st.mode === 'hidden' ? hiddenView(st) : dataView(st)}${footer()}</main>`
  if (keepScroll) window.scrollTo(0, y)
}

function pickYear(y) {
  const i = st.picked.indexOf(y)
  if (i >= 0) { if (st.picked.length > 1) st.picked.splice(i, 1) }
  else { st.picked.push(y); if (st.picked.length > 2) st.picked.shift() }
  st.years = [...st.picked].sort((a, b) => a - b)
}

const SEL = '[data-mode],[data-year],[data-vyear],[data-prod],[data-deca],[data-decb],[data-item],[data-lang]'
app.addEventListener('click', (e) => {
  const b = e.target.closest(SEL)
  if (!b || b.disabled) return
  const d = b.dataset
  if (d.lang) { setLang(d.lang); try { localStorage.setItem('lang', d.lang) } catch (err) { /* rien */ } }
  if (d.mode) {
    if (st.mode === d.mode) return
    st.mode = d.mode
    history.replaceState(null, '', d.mode === 'hidden' ? '#cache' : location.pathname + location.search)
    render(false)
    window.scrollTo({ top: 0 })
    return
  }
  if (d.year) pickYear(+d.year)
  if (d.vyear) st.voyageYear = +d.vyear
  if (d.prod) st.prod = d.prod
  if (d.deca && d.deca !== st.decB) st.decA = d.deca
  if (d.decb && d.decb !== st.decA) st.decB = d.decb
  if (d.item) st.item = d.item
  render()
})

// Survoler un objet du salon l'affiche aussi (sans clic)
app.addEventListener('pointerover', (e) => {
  if (e.pointerType !== 'mouse') return
  const it = e.target.closest('.scene [data-item]')
  if (it && it.dataset.item !== st.item) { st.item = it.dataset.item; render() }
})
// Clavier : Entrée ou Espace sur un objet du salon
app.addEventListener('keydown', (e) => {
  const it = e.target.closest('.scene [data-item]')
  if (it && (e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault(); st.item = it.dataset.item; render()
    app.querySelector(`.scene [data-item="${st.item}"]`)?.focus()
  }
})

initTips()
render(false)
