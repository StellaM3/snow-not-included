// Vue « Face cachée » : le salon éteint, interactif (maquette G2)
import elec from '../data/elec.json'
import hidden from '../data/hidden.json'
import origins from '../data/origins.json'
import { C, hbars, yearCompare } from '../util.js'
import { T, dec, pct } from '../i18n.js'

const M = '#2A3A34'
const YC = [C.red, '#E9E4DA'] // année A (ancienne), année B (récente)

/* ---------- Pictogrammes ---------- */
function picto(n, hi, shape, cols = 10, s = 22, gap = 5) {
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

/* ---------- Séries par année (pour comparer) ---------- */
function elecStats(y) {
  const v = elec[y]
  if (!v) return null
  const work = []
  for (let d = 1; d <= 20; d++) { const wd = new Date(Date.UTC(+y, 11, d)).getUTCDay(); if (wd >= 1 && wd <= 5) work.push(v[d - 1]) }
  const ref = work.reduce((a, b) => a + b, 0) / work.length
  return { v, ref, drop: Math.round((1 - v[24] / ref) * 100) }
}
const SERIES = {
  lights: () => Object.fromEntries(Object.keys(elec).map((y) => [y, elecStats(y).drop])),
  ornaments: () => Object.fromEntries(Object.entries(origins.origins.decorations).filter(([, v]) => v).map(([y, v]) => [y, (v.top.find((r) => r[0] === 'CN') || [0, 0])[1]])),
  chocolate: () => hidden.cacao,
  chair: () => ({ 2012: 5, 2022: 15 }),
}
const SIGN = { lights: '−' }

// Mini-graphique : toutes les années disponibles, les deux années choisies en couleur
function seriesBars(key, years) {
  const data = SERIES[key](), ys = Object.keys(data).map(Number).sort((a, b) => a - b)
  const W = 520, H = 150, bw = Math.min(40, (W - 20) / ys.length), max = Math.max(...Object.values(data))
  let s = ''
  ys.forEach((y, i) => {
    const k = years.indexOf(y), c = k < 0 ? M : YC[years.length > 1 ? k : 1]
    const x = 10 + i * bw, h = (data[y] / max) * (H - 50)
    s += `<rect x="${x + 2}" y="${H - 24 - h}" width="${bw - 4}" height="${h}" rx="3" fill="${c}" data-tip="${y} : ${SIGN[key] || ''}${pct(data[y])}"/>`
    if (k >= 0 || i === 0 || i === ys.length - 1) s += `<text x="${x + bw / 2}" y="${H - 6}" text-anchor="middle" font-family="IBM Plex Mono" font-size="12" fill="${k >= 0 ? C.t1 : '#8E9C96'}">${ys.length > 8 ? "'" + String(y).slice(2) : y}</text>`
    if (k >= 0) s += `<text x="${x + bw / 2}" y="${H - 30 - h}" text-anchor="middle" font-family="IBM Plex Mono" font-size="12" font-weight="700" fill="${C.t1}">${data[y]}</text>`
  })
  const missing = years.filter((y) => data[y] === undefined)
  return `<div class="series"><p class="kicker">${T.allYears}</p><svg viewBox="0 0 ${W} ${H}">${s}</svg>${missing.length ? `<p class="src">${missing.map((y) => T.noYear(y)).join(' · ')}</p>` : ''}</div>`
}
// Valeurs A → B pour un objet qui a une série
function compareBig(key, years) {
  const data = SERIES[key](), sg = SIGN[key] || ''
  if (years.every((y) => data[y] === undefined)) {
    const last = Object.keys(data).map(Number).sort((a, b) => a - b).pop()
    return `<span class="big">${sg}${pct(data[last])}</span><span class="yr">${last}</span>`
  }
  return years.map((y, k) => data[y] === undefined ? '' : `<span class="big" style="color:${YC[years.length > 1 ? k : 1]}">${sg}${pct(data[y])}</span><span class="yr">${y}</span>`).filter(Boolean).join('<span class="big arrow">→</span>')
}

/* ---------- Le panneau de détail d'un objet ---------- */
function detail(item, st) {
  const [name, sub, text, src] = T.items[item]
  const years = st.years
  const yB = years[years.length - 1]
  let big = '', visual = ''
  switch (item) {
    case 'lights': big = compareBig('lights', years); visual = seriesBars('lights', years); break
    case 'tree': big = `<span class="big">${pct(85)}</span>`; visual = picto(100, 85, 'tree'); break
    case 'ornaments': {
      const d = SERIES.ornaments()
      big = compareBig('ornaments', years)
      visual = picto(100, d[yB] ?? d[2024], 'ball') + seriesBars('ornaments', years) + hbars([[T.overtime[0], 36, M, '36 h'], [T.overtime[1], 80, '#B3353C', '80 h'], [T.overtime[2], 140, C.red, '140 h']], 140)
      break
    }
    case 'chocolate': {
      const d = SERIES.chocolate()
      big = compareBig('chocolate', years)
      visual = picto(100, d[yB] ?? d[2024], 'bean') + seriesBars('chocolate', years)
      break
    }
    case 'candles': big = '<span class="big">×5</span>'; visual = hbars([[T.candleBars[0], 14, M, '≈ 14'], [T.candleBars[1], 70, C.red, T.candleBars[2]]], 70); break
    case 'knife': big = `<span class="big">+${pct(60)}</span>`; break
    case 'parcels': big = `<span class="big">${dec(21.6)}</span><span class="yr">${T.millions}</span>`; visual = parcels(); break
    case 'chair': big = compareBig('chair', [2012, 2022]); visual = picto(20, 3, 'person', 10, 30); break
    case 'phone': big = `<span class="big">+${pct(35)}</span>`; visual = hbars([[T.callBars[0], 100, M, '100'], [T.callBars[1], 135, C.red, T.callBars[2]]], 135); break
  }
  return `<div class="detail" aria-live="polite">
    <p class="kicker">${String(ITEMS.indexOf(item) + 1).padStart(2, '0')} · ${name}</p>
    <div class="detail-big">${big}</div>
    <p class="detail-sub">${sub}</p>
    ${visual}
    <p class="txt">${text}</p>
    <p class="src">${src}</p>
  </div>`
}
// 21,6 millions de colis : un carton = 1 million
function parcels() {
  let s = ''
  for (let i = 0; i < 22; i++) {
    const x = (i % 11) * 44, y = Math.floor(i / 11) * 44, w = i === 21 ? 0.6 : 1
    s += `<rect x="${x}" y="${y}" width="${36 * w}" height="34" rx="3" fill="${C.red}"/><line x1="${x + 18 * w}" x2="${x + 18 * w}" y1="${y}" y2="${y + 34}" stroke="#0B1210" stroke-width="2"/>`
  }
  return `<svg viewBox="0 0 484 80" style="width:484px">${s}</svg>`
}

/* ---------- La scène : un salon éteint ---------- */
export const ITEMS = ['lights', 'tree', 'ornaments', 'chocolate', 'candles', 'knife', 'parcels', 'chair', 'phone']
function scene(sel) {
  const g = (id, body, bx, by) => `<g class="item ${id === sel ? 'sel' : ''}" data-item="${id}" tabindex="0" role="button" aria-label="${T.items[id][0]}">${body}<g class="badge"><circle cx="${bx}" cy="${by}" r="15"/><text x="${bx}" y="${by + 5}" text-anchor="middle">${ITEMS.indexOf(id) + 1}</text></g></g>`
  let s = `<rect width="1200" height="640" fill="#0D1513"/><rect y="540" width="1200" height="100" fill="#070C0B"/>`
  s += `<g stroke="#131D1A">${[90, 180, 270, 360, 450].map((y) => `<line x1="0" x2="1200" y1="${y}" y2="${y}"/>`).join('')}</g>`
  // fenêtre : la nuit, pas de neige
  s += `<rect x="60" y="100" width="250" height="210" rx="4" fill="#05080A" stroke="#1E2A26" stroke-width="10"/><path d="M68,302 L130,200 L172,246 L232,150 L302,302Z" fill="#141E1B"/><line x1="185" y1="100" x2="185" y2="310" stroke="#1E2A26" stroke-width="6"/><rect x="68" y="296" width="234" height="6" fill="#2A3A34"/>`
  // 1 guirlande, son câble et la prise
  const bulbs = Array.from({ length: 15 }, (_, i) => [40 + i * 80, 46 + Math.round(Math.sin(i * 1.3) * 10)])
  s += g('lights', `<path d="M0,28 Q150,70 300,34 T600,34 T900,34 T1200,30" fill="none" stroke="#2A3A34" stroke-width="2.5"/>${bulbs.map(([x, y]) => `<circle class="bulb" cx="${x}" cy="${y}" r="8"/>`).join('')}<path d="M1150,40 L1150,520 L1175,520" fill="none" stroke="#2A3A34" stroke-width="2" stroke-dasharray="4 5"/><rect x="1165" y="508" width="22" height="26" rx="3" fill="#1E2A26" stroke="#2A3A34"/>`, 600, 92)
  // 2 sapin, 3 décorations
  s += g('tree', `<g transform="translate(930,535)"><path class="fill" d="M0,-380 L-80,-250 L-44,-250 L-116,-132 L-72,-132 L-150,0 L150,0 L72,-132 L116,-132 L44,-250 L80,-250Z" stroke-width="2"/><rect x="-14" y="0" width="28" height="22" fill="#24322D"/></g>`, 930, 120)
  s += g('ornaments', `<g transform="translate(930,535)">${[[-30, -300], [24, -276], [-56, -210], [6, -192], [64, -178], [-90, -90], [-32, -72], [34, -100], [96, -56], [-116, -24]].map(([x, y]) => `<circle class="orn" cx="${x}" cy="${y}" r="12"/>`).join('')}</g>`, 1060, 330)
  // 7 colis
  s += g('parcels', `<g class="box"><rect x="740" y="500" width="80" height="44"/><rect x="765" y="470" width="50" height="30"/><rect x="1020" y="505" width="70" height="40"/></g><g stroke="#2A3A34" stroke-width="2"><line x1="780" y1="500" x2="780" y2="544"/><line x1="1055" y1="505" x2="1055" y2="545"/></g>`, 720, 470)
  // table
  s += `<rect x="360" y="420" width="400" height="14" rx="3" fill="#1E2A26"/><rect x="378" y="434" width="12" height="106" fill="#17211E"/><rect x="730" y="434" width="12" height="106" fill="#17211E"/>`
  // 5 bougies
  s += g('candles', `<rect x="400" y="380" width="10" height="40" fill="#3A4642"/><path class="flame" d="M405,364 q8,8 0,15 q-8,-7 0,-15Z"/><rect x="420" y="390" width="10" height="30" fill="#3A4642"/><path class="flame" d="M425,374 q8,8 0,15 q-8,-7 0,-15Z"/>`, 415, 340)
  // 6 couteau et planche
  s += g('knife', `<rect x="470" y="410" width="110" height="10" rx="3" fill="#2A1F18"/><path class="blade" d="M490,406 L560,400 L562,405 L492,411Z"/><rect x="556" y="398" width="28" height="9" rx="3" fill="#2A3A34"/>`, 530, 372)
  // 4 chocolat
  s += g('chocolate', `<rect class="choc" x="620" y="392" width="110" height="28" rx="4" stroke-width="2"/><g fill="#3A2A22">${[630, 654, 678, 702].map((x) => `<rect x="${x}" y="398" width="18" height="16" rx="3"/>`).join('')}</g>`, 675, 362)
  // 8 chaise vide
  s += g('chair', `<g class="chair" fill="none" stroke-width="3"><path d="M235,540 L235,380 Q235,362 253,362 L283,362 Q301,362 301,380 L301,450 L320,450 L320,540"/><line x1="235" y1="450" x2="301" y2="450"/></g>`, 268, 330)
  // 9 téléphone
  s += g('phone', `<rect x="60" y="470" width="120" height="10" rx="3" fill="#1E2A26"/><rect x="110" y="480" width="10" height="60" fill="#17211E"/><rect class="tel" x="88" y="452" width="56" height="18" rx="5" stroke-width="2"/><path class="tel-h" d="M92,452 Q116,428 140,452" fill="none" stroke-width="6" stroke-linecap="round"/>`, 116, 410)
  return `<svg class="scene" viewBox="0 0 1200 640">${s}</svg>`
}

/* ---------- Courbe d'électricité, deux années superposées ---------- */
function elecCurve(years) {
  const ok = years.filter((y) => elec[y])
  const W = 1240, H = 300, x0 = 60, y0 = 20
  const all = ok.flatMap((y) => elec[y])
  const lo = Math.floor((Math.min(...all, 150) - 10) / 10) * 10, hi = Math.ceil((Math.max(...all, 190) + 10) / 10) * 10
  const px = (i) => x0 + (i * (W - x0 - 20)) / 30, py = (val) => y0 + ((hi - val) / (hi - lo)) * (H - y0 - 40)
  let s = ''
  for (let gl = lo + 20; gl < hi; gl += 20) s += `<line x1="${x0}" x2="${W - 20}" y1="${py(gl)}" y2="${py(gl)}" stroke="#16211D"/><text x="${x0 - 10}" y="${py(gl) + 4}" text-anchor="end" fill="#8E9C96" font-size="12" font-family="IBM Plex Mono">${gl}</text>`
  s += `<rect x="${px(23) - 12}" y="${y0}" width="${px(25) - px(23) + 24}" height="${H - y0 - 40}" fill="${C.red}" opacity=".12"/>`
  ok.forEach((y) => {
    const k = years.indexOf(y), col = YC[years.length > 1 ? k : 1], v = elec[y]
    s += `<polyline points="${v.map((val, i) => `${px(i).toFixed(1)},${py(val).toFixed(1)}`).join(' ')}" fill="none" stroke="${col}" stroke-width="3" stroke-linejoin="round"/>`
    s += `<circle cx="${px(24)}" cy="${py(v[24])}" r="7" fill="${col}"/>`
    v.forEach((val, i) => { s += `<rect x="${px(i) - 18}" y="${py(val) - 12}" width="36" height="24" fill="transparent" data-tip="${T.elecTip(i + 1, y, dec(val))}"/>` })
  })
  for (let i = 0; i < 31; i++) if ((i + 1) % 5 === 0 || i === 0 || (i >= 23 && i <= 25)) s += `<text x="${px(i)}" y="${H - 8}" text-anchor="middle" fill="${i >= 23 && i <= 25 ? C.red : '#8E9C96'}" font-size="12" font-family="IBM Plex Mono">${i + 1}</text>`
  return `<svg viewBox="0 0 ${W} ${H}">${s}</svg>`
}

export function hiddenView(st) {
  const ys = st.years
  const big = ys.map((y, k) => { const e = elecStats(y); return e ? `<span class="big" style="color:${YC[ys.length > 1 ? k : 1]}">−${pct(e.drop)}</span><span class="yr">${y}</span>` : '' }).filter(Boolean).join('<span class="big arrow">→</span>')
  const missing = ys.filter((y) => !elec[y])
  const firstOk = ys.find((y) => elec[y]) || 2024
  return `<div class="view">
    ${yearCompare(ys, T)}
    <section class="card">
      <p class="kicker">${T.elecK(ys[0], ys[ys.length - 1])}</p>
      <div class="detail-big">${big}</div>
      ${missing.length ? `<p class="src">${missing.map((y) => T.elecMissing(y)).join(' · ')}</p>` : ''}
      <div class="scroll-x">${elecCurve(ys)}</div>
      <p class="src">${T.elecSrc(elecStats(firstOk).drop)}</p>
    </section>
    <section class="section">
      <div class="section-head"><h2 class="h2">${T.sceneTitle}</h2><p class="lead">${T.sceneLead}</p></div>
      <div class="scene-grid">
        <div class="scene-box">${scene(st.item)}</div>
        <div class="card">${detail(st.item, st)}</div>
      </div>
      <div class="chips item-chips">${ITEMS.map((id, i) => `<button class="chip ${id === st.item ? 'on' : ''}" data-item="${id}">${i + 1} · ${T.items[id][0]}</button>`).join('')}</div>
    </section>
    <div class="card">
      <p class="kicker">${T.mythK}</p>
      <p class="myth">${T.myth}</p>
      <p class="txt" style="margin:0;font-size:15px;line-height:1.5;color:var(--t2)">${T.mythTxt}</p>
      <p class="src">${T.mythSrc}</p>
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
