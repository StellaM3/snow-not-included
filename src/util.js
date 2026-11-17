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
