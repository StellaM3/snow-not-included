// Petits outils partagés
export const C = {
  red: '#E0434B', snow: '#EAF4FF', gold: '#F4C95D', land: '#1D3529', landOn: '#3A5E4C',
  bar: '#3E6455', line: '#2C4A3F', t1: '#F4F1EA', t2: '#D2DED8', t3: '#A9BDB4', dark: '#0B1712',
}

// Section titre + sous-titre
export const head = (title, lead) => `
  <div class="section-head">
    <h2 class="h2">${title}</h2>
    ${lead ? `<p class="lead">${lead}</p>` : ''}
  </div>`

// Barres horizontales simples (face cachée)
export const hbars = (rows, max) => `<div class="hbars">${rows.map(([label, v, color, txt]) => `
  <div class="hbar"><span class="l">${label}</span>
    <div class="r"><div class="b" style="width:${Math.max(4, (v / max) * 100) * 0.75}%;background:${color}"></div><span class="v">${txt}</span></div>
  </div>`).join('')}</div>`

// Info-bulle partagée pour les graphiques : tout élément SVG avec data-tip
let tipEl
export function initTips() {
  tipEl = document.createElement('div')
  tipEl.className = 'tip'
  document.body.appendChild(tipEl)
  document.addEventListener('pointermove', (e) => {
    const t = e.target.closest?.('[data-tip]')
    if (!t) { tipEl.style.opacity = 0; return }
    tipEl.textContent = t.dataset.tip
    tipEl.style.left = e.clientX + 14 + 'px'
    tipEl.style.top = e.clientY + 14 + 'px'
    tipEl.style.opacity = 1
  })
}

// Sélecteur « comparer deux années » (même état partout sur le site)
export const COMPARE_YEARS = [1990, 2000, 2010, 2017, 2024]
export function yearCompare(years, T) {
  return `<div class="compare">
    <span class="compare-label">${T.compareLabel}</span>
    <div class="chips">${COMPARE_YEARS.map((y) => {
      const i = years.indexOf(y)
      const cls = i < 0 ? '' : i === 0 && years.length > 1 ? 'on year-a' : 'on'
      return `<button class="chip ${cls}" data-year="${y}" aria-pressed="${i >= 0}">${y}</button>`
    }).join('')}</div>
    <span class="compare-hint">${T.compareHint}</span>
  </div>`
}

// Pictogramme de caquelon (fondue)
export const ICON_FONDUE = `<svg viewBox="0 0 48 48" width="40" height="40" aria-hidden="true"><path d="M8 20h32l-3 14a6 6 0 0 1-6 5H17a6 6 0 0 1-6-5z" fill="#F4C95D"/><rect x="5" y="17" width="38" height="5" rx="2.5" fill="#E9B53F"/><path d="M40 20l6-3" stroke="#F4C95D" stroke-width="3" stroke-linecap="round"/><path d="M14 44h20" stroke="#A9BDB4" stroke-width="2.5" stroke-linecap="round"/><path d="M30 4l-6 16" stroke="#D2DED8" stroke-width="2" stroke-linecap="round"/><circle cx="23.5" cy="21" r="3" fill="#F7E3A3"/></svg>`
