import './style.css'
import { chapterContent, mountainCard } from './views/data-view.js'
import { hiddenView } from './views/hidden-view.js'
import { initTips } from './util.js'
import { topNav, homeView, chapterHead, chapterFoot, routeFromHash } from './nav.js'
import { T, setLang, lang } from './i18n.js'

// État de la page. Le mode « face cachée » est gardé dans l'URL (#cache) pour pouvoir partager un lien.
const params = new URLSearchParams(location.search)
const st = {
  page: location.hash === '#cache' ? 'cache' : routeFromHash(), // '' = accueil
  picked: [2010, 2024], // ordre des clics, pour remplacer l'année choisie le plus anciennement
  years: [2010, 2024], // les deux années comparées, triées
  voyageYear: 2024, // la carte du voyage montre une seule année
  prod: params.get('prod') || 'sapins',
  decA: '1960',
  decB: '2010',
  item: 'lights',
  decM: '2010', // décennie affichée sur la montagne
  playing: false,
  relYear: '2023',
  songYear: 2025, // année du hit-parade affichée
  filmYear: '2025', // décembre Netflix affiché // année comparée à 1970 (religion)
}

// Langue : ?lang=en dans l'URL, sinon le choix mémorisé, sinon le navigateur (français par défaut)
let saved = null
try { saved = localStorage.getItem('lang') } catch (e) { /* stockage indisponible */ }
const browser = (navigator.language || 'fr').slice(0, 2) === 'en' ? 'en' : 'fr'
setLang(params.get('lang') || saved || browser)

// Petites icônes du titre : drapeau suisse et sapin
const ICON_CH = '<svg class="h1-ico" viewBox="0 0 32 32" role="img" aria-label="Suisse"><rect width="32" height="32" rx="6" fill="#E0434B"/><path d="M13 6h6v7h7v6h-7v7h-6v-7H6v-6h7z" fill="#fff"/></svg>'
const ICON_TREE = '<svg class="h1-ico tree" viewBox="4 1 24 35" role="img" aria-label="Sapin"><path d="M16 2l3 3.2h-6z" fill="#F4C95D"/><path d="M16 4L7 15h4.5L5 24h6L3 32h26l-8-8h6l-6.5-9H25z" fill="#6FCF97"/><rect x="14" y="31" width="4" height="5" fill="#8C5A3C"/><circle cx="12" cy="20" r="1.8" fill="#E0434B"/><circle cx="20" cy="26" r="1.8" fill="#EAF4FF"/><circle cx="19" cy="15" r="1.6" fill="#F4C95D"/></svg>'

// Barre du haut : accueil, chapitres, langue (plus d'interrupteur : la face cachée est un chapitre)
const langBtns = () => `<span class="lang" role="group" aria-label="Langue / Language"><button class="${lang === 'fr' ? 'on' : ''}" data-lang="fr" aria-pressed="${lang === 'fr'}">FR</button><button class="${lang === 'en' ? 'on' : ''}" data-lang="en" aria-pressed="${lang === 'en'}">EN</button></span>`
function header() {
  return `<header class="header">
    <h1 class="h1">${T.h1.replace('{CH}', ICON_CH).replace('{TREE}', ICON_TREE)}</h1>
    <div class="byline">
      <span class="by">${T.byBy} <b>Estelle Rossier</b></span>
      <span class="by-meta">${T.byLines.map((l) => `<span>${l}</span>`).join('')}</span>
    </div>
  </header>`
}
function footer() {
  return `<footer class="footer"><p class="src">${T.sources}</p><p class="src">${T.credits}</p></footer>`
}

const app = document.querySelector('#app')
function render(keepScroll = true) {
  const y = window.scrollY
  const p = st.page
  document.body.classList.toggle('hidden', p === 'cache')
  document.body.classList.toggle('is-home', !p)
  let body
  if (!p) body = homeView(header())
  else body = `<div class="chapter-page">${chapterHead(p)}${p === 'cache' ? hiddenView(st) : chapterContent(p, st)}${chapterFoot(p)}</div>`
  app.innerHTML = `${topNav(p, langBtns())}<main class="page">${body}${footer()}</main>`
  if (keepScroll) window.scrollTo({ top: y, behavior: 'instant' })
}
function go(page) {
  stopPlay()
  st.page = page
  history.pushState(null, '', page ? '#/' + page : location.pathname + location.search)
  render(false)
  window.scrollTo({ top: 0, behavior: 'instant' })
}
window.addEventListener('popstate', () => { st.page = routeFromHash(); render(false); window.scrollTo({ top: 0, behavior: 'instant' }) })

function pickYear(y) {
  const i = st.picked.indexOf(y)
  if (i >= 0) { if (st.picked.length > 1) st.picked.splice(i, 1) }
  else { st.picked.push(y); if (st.picked.length > 2) st.picked.shift() }
  st.years = [...st.picked].sort((a, b) => a - b)
}

const SEL = '[data-songy],[data-filmy],[data-go],[data-rel],[data-play],[data-decm],[data-year],[data-vyear],[data-prod],[data-deca],[data-decb],[data-item],[data-lang]'
app.addEventListener('click', (e) => {
  const b = e.target.closest(SEL)
  if (!b || b.disabled) return
  const d = b.dataset
  if (d.go !== undefined) { e.preventDefault(); go(d.go); return }
  if (d.rel) st.relYear = d.rel
  if (d.songy) st.songYear = +d.songy
  if (d.filmy) st.filmYear = d.filmy
  if (d.lang) { setLang(d.lang); try { localStorage.setItem('lang', d.lang) } catch (err) { /* rien */ } }
  if (d.year) pickYear(+d.year)
  if (d.vyear) st.voyageYear = +d.vyear
  if (d.prod) st.prod = d.prod
  if (d.deca && d.deca !== st.decB) st.decA = d.deca
  if (d.decb && d.decb !== st.decA) st.decB = d.decb
  if (d.item) st.item = d.item
  if (d.decm) { stopPlay(); st.decM = d.decm; updateMountain(); return }
  if (d.play) { st.playing ? stopPlay() : startPlay(); updateMountain(); return }
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

// Animation de la montagne : décennie après décennie, sans redessiner toute la page
const DECADES = ['1960', '1970', '1980', '1990', '2000', '2010', '2020']
let timer = null
function updateMountain() {
  const el = document.getElementById('mountain')
  if (el) el.outerHTML = mountainCard(st.decM, st.playing)
}
function startPlay() {
  st.playing = true
  if (st.decM === '2020') st.decM = '1960'
  timer = setInterval(() => {
    const i = DECADES.indexOf(st.decM)
    if (i >= DECADES.length - 1) { stopPlay(); updateMountain(); return }
    st.decM = DECADES[i + 1]
    updateMountain()
  }, 1100)
}
function stopPlay() { st.playing = false; clearInterval(timer); timer = null }

initTips()
render(false)
