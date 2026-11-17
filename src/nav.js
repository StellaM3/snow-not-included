// Navigation par chapitres : barre fixe, sommaire, « chapitre suivant », chapitre actif au défilement
import { T } from './i18n.js'

export const CHAPTERS = {
  magic: [['import', '🎁'], ['voyage', '🌍'], ['climat', '🌡️'], ['neige', '❄️'], ['commerce', '🛍️'], ['traditions', '🎶']],
  hidden: [['elec', '⚡'], ['salon', '🛋️'], ['mythe', '🕯️']],
}

// Barre de chapitres (dans la barre du haut)
export function chapterNav(mode) {
  const list = CHAPTERS[mode]
  return `<nav class="chapnav" aria-label="${T.navAria}">${list.map(([id, ico], i) => `
    <a href="#c-${id}" class="cn" data-goto="${id}" title="${T.chaps[id][0]}"><span class="cn-n">${i + 1}</span><span class="cn-ico" aria-hidden="true">${ico}</span><span class="cn-t">${T.chaps[id][0]}</span></a>`).join('')}
  </nav><div class="progress"><i></i></div>`
}

// Sommaire illustré sous le titre
export function toc(mode) {
  const list = CHAPTERS[mode]
  return `<section class="toc">
    <div class="toc-head"><p class="kicker">${T.tocTitle}</p><p class="lead">${mode === 'hidden' ? T.tocHiddenLead : T.tocLead}</p></div>
    <div class="toc-grid ${mode}">${list.map(([id, ico], i) => `
      <a class="toc-card" href="#c-${id}" data-goto="${id}">
        <span class="toc-ico" aria-hidden="true">${ico}</span>
        <span class="toc-n">${String(i + 1).padStart(2, '0')}</span>
        <b>${T.chaps[id][0]}</b><span>${T.chaps[id][1]}</span>
      </a>`).join('')}</div>
  </section>`
}

// Enveloppe d'un chapitre : repère « chapitre n sur N » et bouton vers la suite
export function chap(mode, id, html) {
  const list = CHAPTERS[mode], i = list.findIndex(([k]) => k === id), n = list.length
  const next = list[i + 1]
  let foot
  if (next) foot = `<a class="next" href="#c-${next[0]}" data-goto="${next[0]}"><span>${T.nextChap}</span><b>${next[1]} ${T.chaps[next[0]][0]}</b><i aria-hidden="true">↓</i></a>`
  else foot = `<div class="end-row">${mode === 'magic'
    ? `<button class="next dark" data-mode="hidden"><span>🌙</span><b>${T.toHidden}</b><i aria-hidden="true">→</i></button>`
    : `<button class="next gold" data-mode="magic"><span>☀️</span><b>${T.toMagic}</b><i aria-hidden="true">→</i></button>`}
    <a class="next ghost" href="#top" data-goto="top"><b>${T.backTop}</b><i aria-hidden="true">↑</i></a></div>`
  return `<div class="chapter" id="c-${id}" data-ch="${id}">
    <p class="chap-k"><span class="chap-ico" aria-hidden="true">${list[i][1]}</span>${T.chapter(i + 1, n)}</p>
    ${html}
    ${foot}
  </div>`
}

// Chapitre actif et barre de progression, selon le défilement
let obs, onScroll
export function watchChapters() {
  obs?.disconnect()
  if (onScroll) window.removeEventListener('scroll', onScroll)
  const links = [...document.querySelectorAll('.chapnav .cn')]
  const setActive = (id) => links.forEach((a) => {
    const on = a.dataset.goto === id
    a.classList.toggle('on', on)
    if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current')
    if (on) { const nav = a.parentElement; nav.scrollTo({ left: a.offsetLeft - nav.clientWidth / 2 + a.clientWidth / 2, behavior: 'smooth' }) }
  })
  obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.dataset.ch) })
  }, { rootMargin: '-35% 0px -60% 0px' })
  document.querySelectorAll('.chapter').forEach((c) => obs.observe(c))
  const bar = document.querySelector('.progress i')
  onScroll = () => {
    const h = document.documentElement.scrollHeight - innerHeight
    if (bar) bar.style.transform = `scaleX(${h > 0 ? Math.min(1, scrollY / h) : 0})`
    if (scrollY < 200) setActive(null)
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
}

// Défilement doux vers un chapitre (la barre du haut est déduite par scroll-margin)
export function goTo(id) {
  if (id === 'top') { window.scrollTo({ top: 0, behavior: 'smooth' }); return }
  document.getElementById('c-' + id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
