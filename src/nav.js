// Navigation : page d'accueil avec les chapitres en scènes, une page par chapitre
import { T } from './i18n.js'
import { scene } from './scenes.js'

// La face cachée est le 7e chapitre (plus d'interrupteur)
export const CHAPTERS = ['import', 'voyage', 'climat', 'neige', 'commerce', 'traditions', 'cache']
export const ICONS = { import: '🎁', voyage: '🌍', climat: '🌡️', neige: '❄️', commerce: '🛍️', traditions: '🎶', cache: '🌙' }

// Route courante : '' = accueil, sinon un identifiant de chapitre (#/neige)
export function routeFromHash() {
  const h = location.hash.replace(/^#\/?/, '')
  return CHAPTERS.includes(h) ? h : ''
}

// Barre du haut : accueil, chapitres en icônes, langue
export function topNav(page, langBtns) {
  return `<div class="topbar" id="top">
    <a class="home-btn ${page ? '' : 'on'}" href="#/" data-go=""><span aria-hidden="true">🏠</span><span class="hb-t">${T.home}</span></a>
    <nav class="chapnav" aria-label="${T.navAria}">${CHAPTERS.map((id, i) => `
      <a href="#/${id}" class="cn ${id === page ? 'on' : ''} ${id === 'cache' ? 'dark' : ''}" data-go="${id}" title="${T.chaps[id][0]}" ${id === page ? 'aria-current="page"' : ''}>
        <span class="cn-n">${id === 'cache' ? '★' : i + 1}</span><span class="cn-ico" aria-hidden="true">${ICONS[id]}</span><span class="cn-t">${T.chaps[id][0]}</span></a>`).join('')}
    </nav>
    <div class="meta">${langBtns}</div>
  </div>`
}

// Carte-scène d'un chapitre
const card = (id, i, cls = '') => `
  <a class="scene-card ${id === 'cache' ? 'dark' : ''} ${cls}" href="#/${id}" data-go="${id}">
    <div class="sc-art">${scene(id)}</div>
    <div class="sc-body">
      <span class="sc-n">${id === 'cache' ? '★' : String(i + 1).padStart(2, '0')}</span>
      <b>${T.chaps[id][0]}</b>
      <span>${T.chaps[id][1]}</span>
    </div>
  </a>`

// Page d'accueil
export function homeView(header) {
  return `<div class="home">
    ${header}
    <p class="lead home-lead">${T.homeLead}</p>
    <div class="scene-grid-home">${CHAPTERS.map((id, i) => card(id, i, id === 'cache' ? 'wide' : '')).join('')}</div>
  </div>`
}

// Haut et bas d'une page chapitre
export function chapterHead(id) {
  const i = CHAPTERS.indexOf(id)
  const k = `<p class="chap-k"><span class="chap-ico" aria-hidden="true">${ICONS[id]}</span>${id === 'cache' ? T.chapHidden : T.chapter(i + 1, 6)}</p>`
  return id === 'cache' ? `${k}<div class="section-head"><h2 class="h2 hidden-h">${T.h1Hidden}</h2><p class="lead">${T.chaps.cache[1]}.</p></div>` : k
}
export function chapterFoot(id) {
  const i = CHAPTERS.indexOf(id), next = CHAPTERS[i + 1]
  return `<div class="chap-foot">
    ${next ? `<p class="kicker">${T.continueWith}</p>${card(next, i + 1, 'mini')}` : ''}
    <a class="back-home" href="#/" data-go="">← ${T.backHome}</a>
  </div>`
}
