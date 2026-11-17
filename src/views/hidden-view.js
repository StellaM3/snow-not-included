// Vue « Face cachée » (maquette G2)
import elec from '../data/elec.json'
import { C, hbars } from '../util.js'
import { T, fmt, dec, pct } from '../i18n.js'

const M = '#2A3A34', G = '#B5C2BC'

// Pictogrammes : n symboles, les `hi` premiers en rouge
function picto(n, hi, shape, cols = 10, s = 26, gap = 6) {
  const w = cols * (s + gap), h = Math.ceil(n / cols) * (s + gap)
  let out = ''
  for (let i = 0; i < n; i++) {
    const x = (i % cols) * (s + gap), y = Math.floor(i / cols) * (s + gap), c = i < hi ? C.red : M
    if (shape === 'tree') out += `<path d="M${x + s / 2},${y} L${x + s},${y + s * 0.8} L${x},${y + s * 0.8}Z" fill="${c}"/><rect x="${x + s / 2 - 2}" y="${y + s * 0.8}" width="4" height="${s * 0.2}" fill="${c}"/>`
    else if (shape === 'ball') out += `<circle cx="${x + s / 2}" cy="${y + s / 2 + 2}" r="${s / 2 - 2}" fill="${c}"/><rect x="${x + s / 2 - 3}" y="${y}" width="6" height="4" fill="${c}"/>`
    else if (shape === 'bean') out += `<ellipse cx="${x + s / 2}" cy="${y + s / 2}" rx="${s / 2 - 3}" ry="${s / 2 - 1}" fill="${c}"/>`
    else out += `<circle cx="${x + s / 2}" cy="${y + s * 0.25}" r="${s * 0.2}" fill="${c}"/><path d="M${x + s * 0.15},${y + s} Q${x + s / 2},${y + s * 0.35} ${x + s * 0.85},${y + s}Z" fill="${c}"/>`
  }
  return `<svg viewBox="0 0 ${w} ${h}" style="width:${w}px">${out}</svg>`
}

const tile = (kicker, big, unit, visual, text, src) => `
  <div class="card tile">
    <p class="kicker">${kicker}</p>
    <div class="head"><span class="big">${big}</span><span>${unit}</span></div>
    ${visual}
    <p class="txt">${text}</p>
    <p class="src">${src}</p>
  </div>`

/* Courbe d'électricité de décembre (Swissgrid) */
function elecStats(y) {
  const v = elec[y]
  // jours ouvrables du 1er au 20 décembre (lundi-vendredi)
  const work = []
  for (let d = 1; d <= 20; d++) { const wd = new Date(Date.UTC(+y, 11, d)).getUTCDay(); if (wd >= 1 && wd <= 5) work.push(v[d - 1]) }
  const ref = work.reduce((a, b) => a + b, 0) / work.length
  return { v, ref, drop: Math.round((1 - v[24] / ref) * 100) }
}
function elecCurve(y) {
  const { v, ref } = elecStats(y)
  const W = 1240, H = 300, x0 = 60, y0 = 20
  const lo = Math.floor((Math.min(...v) - 10) / 10) * 10, hi = Math.ceil((Math.max(...v) + 10) / 10) * 10
  const px = (i) => x0 + (i * (W - x0 - 20)) / 30, py = (val) => y0 + ((hi - val) / (hi - lo)) * (H - y0 - 40)
  const step = (hi - lo) > 60 ? 20 : 10
  let s = ''
  for (let g = lo + step; g < hi; g += step) s += `<line x1="${x0}" x2="${W - 20}" y1="${py(g)}" y2="${py(g)}" stroke="#16211D"/><text x="${x0 - 10}" y="${py(g) + 4}" text-anchor="end" fill="#8E9C96" font-size="12" font-family="IBM Plex Mono">${g}</text>`
  s += `<rect x="${px(23) - 12}" y="${y0}" width="${px(25) - px(23) + 24}" height="${H - y0 - 40}" fill="${C.red}" opacity=".12"/>`
  const pts = v.map((val, i) => `${px(i).toFixed(1)},${py(val).toFixed(1)}`)
  s += `<path d="M${px(0)},${py(lo)} L${pts.join(' L')} L${px(30)},${py(lo)}Z" fill="${C.red}" opacity=".08"/>`
  s += `<polyline points="${pts.join(' ')}" fill="none" stroke="#E9E4DA" stroke-width="3" stroke-linejoin="round"/>`
  s += `<line x1="${px(0)}" x2="${px(30)}" y1="${py(ref)}" y2="${py(ref)}" stroke="#E9E4DA" stroke-width="1.5" stroke-dasharray="4 6" opacity=".6"/><text x="${px(30)}" y="${py(ref) - 10}" text-anchor="end" fill="#E9E4DA" font-size="13" font-family="Inter">${T.elecRef(Math.round(ref))}</text>`
  v.forEach((val, i) => { s += `<rect x="${px(i) - 18}" y="${y0}" width="36" height="${H - y0 - 40}" fill="transparent" data-tip="${T.elecTip(i + 1, y, dec(val))}"/>` })
  s += `<circle cx="${px(24)}" cy="${py(v[24])}" r="7" fill="${C.red}" pointer-events="none"/><text x="${px(24)}" y="${py(v[24]) + 30}" text-anchor="middle" fill="${C.red}" font-size="14" font-weight="700" font-family="Inter">25.12 · ${Math.round(v[24])} GWh</text>`
  for (let i = 0; i < 31; i++) if ((i + 1) % 5 === 0 || i === 0 || (i >= 23 && i <= 25)) s += `<text x="${px(i)}" y="${H - 8}" text-anchor="middle" fill="${i >= 23 && i <= 25 ? C.red : '#8E9C96'}" font-size="12" font-family="IBM Plex Mono">${i + 1}</text>`
  return `<svg viewBox="0 0 ${W} ${H}">${s}</svg>`
}

export function hiddenView(st) {
  const years = Object.keys(elec)
  const { drop } = elecStats(st.elecYear)
  const D = T.tiles
  const vis = [
    hbars([[D[0][2][0], 38, '#E9E4DA', pct(38)], [D[0][2][1], 9, C.red, pct(9)]], 40),
    picto(100, 62, 'tree'),
    picto(100, 65, 'ball'),
    picto(100, 51, 'bean'),
    hbars([[D[4][2][0], 14, M, '≈ 14'], [D[4][2][1], 70, C.red, D[4][2][2]]], 70),
    picto(20, 3, 'person', 10, 34),
  ]
  const bigs = [pct(9), '62', '65', '51', '×5', '3/20']
  const tiles = D.map((d, i) => tile(d[0], bigs[i], d[1], vis[i], d[3], d[4])).join('')

  return `<div class="view">
    <section class="card">
      <div class="split">
        <p class="kicker">${T.elecK(st.elecYear)}</p>
        <span class="big" style="color:${C.red}">−${pct(drop)}</span>
      </div>
      <div class="elec-years">${years.map((y) => `<button class="chip ${+y === +st.elecYear ? 'on' : ''}" data-elec="${y}">${y}</button>`).join('')}</div>
      <div class="scroll-x">${elecCurve(st.elecYear)}</div>
      <p class="src">${T.elecSrc(drop)}</p>
    </section>
    <div class="grid3">${tiles}</div>
    <div class="grid2 myth-grid">
      <div class="card">
        <p class="kicker">${T.mythK}</p>
        <p class="myth">${T.myth}</p>
        <p class="txt" style="margin:0;font-size:15px;line-height:1.5;color:var(--t2)">${T.mythTxt}</p>
        <p class="src">${T.mythSrc}</p>
      </div>
      <div class="card">
        <p class="kicker">${T.callsK}</p>
        ${hbars([[T.callsBars[0], 100, M, '100'], [T.callsBars[1], 135, C.red, T.callsBars[2]]], 135)}
        <div class="calls-nums">
          <div><b>${fmt(240000)}</b><span>${T.calls1}</span></div>
          <div><b>${pct(60)}+</b><span>${T.calls2}</span></div>
        </div>
        <p class="src">${T.callsSrc}</p>
      </div>
    </div>
    <section class="help">
      <p>${T.help}</p>
      <div class="nums">
        <div><b>143</b><span>${T.helpN[0]}</span></div>
        <div><b>147</b><span>${T.helpN[1]}</span></div>
        <div><b>144</b><span>${T.helpN[2]}</span></div>
        <a href="https://stopsuicide.ch" target="_blank" rel="noopener">stopsuicide.ch</a>
      </div>
    </section>
  </div>`
}
