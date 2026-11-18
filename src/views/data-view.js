import { alcoholCard, traditionsSection } from './culture-view.js'
// Vue « Magique » : les données (maquette F2)
import fdata from '../data/fdata.json'
import origins from '../data/origins.json'
import europe from '../data/europe.json'
import snow from '../data/snow.json'
import industry from '../data/industry.json'
import months from '../data/months.json'
import { C, head, yearCompare, ICON_FONDUE } from '../util.js'
import { T, fmt, dec, pct } from '../i18n.js'

const BASE = import.meta.env.BASE_URL

/* ---------- 1. Noël-mètre ---------- */
// Icône du produit, dessinée au centre de chaque boule (dans un médaillon clair pour rester lisible)
const ORN_ICONS = [
  // mandarine
  `<circle cx="0" cy="4" r="17" fill="#F2994A"/><circle cx="-6" cy="-2" r="2" fill="#F8C08A"/><path d="M0 -13 q2 -7 8 -9" stroke="#3E6455" stroke-width="3" fill="none"/><path d="M2 -14 q10 -10 16 -2 q-8 6 -16 2z" fill="#6FCF97"/>`,
  // foie gras : canard
  `<ellipse cx="2" cy="8" rx="17" ry="11" fill="#F4C95D"/><circle cx="-10" cy="-8" r="9" fill="#F4C95D"/><path d="M-19 -8 l-8 3 l8 2z" fill="#E99A5B"/><circle cx="-12" cy="-10" r="1.8" fill="#0F1F1A"/><path d="M6 4 q8 -6 14 2" stroke="#E0B040" stroke-width="2.5" fill="none"/>`,
  // sapin
  `<path d="M0 -22 L13 -2 H6 L16 13 H-16 L-6 -2 H-13Z" fill="#3E8E63"/><rect x="-3" y="13" width="6" height="8" fill="#8C5A3C"/><circle cx="-4" cy="2" r="2" fill="#E0434B"/><circle cx="5" cy="8" r="2" fill="#F4C95D"/>`,
  // fromage
  `<path d="M-19 10 L-19 -4 L18 -14 L19 10 Z" fill="#F4C95D"/><path d="M-19 -4 L18 -14 L19 -6 Z" fill="#F8DC8A"/><circle cx="-8" cy="3" r="3" fill="#E0B040"/><circle cx="6" cy="0" r="2.4" fill="#E0B040"/><circle cx="10" cy="6" r="2" fill="#E0B040"/>`,
  // électricité : ampoule
  `<path d="M0 -20 a13 13 0 0 1 8 23 v5 h-16 v-5 a13 13 0 0 1 8 -23z" fill="#F4C95D"/><rect x="-7" y="10" width="14" height="4" rx="1" fill="#A9BDB4"/><rect x="-5" y="15" width="10" height="4" rx="1" fill="#A9BDB4"/><path d="M-3 -6 l4 6 h-4 l4 6" stroke="#E0434B" stroke-width="2" fill="none"/>`,
]
const METER = () => [[100, pct(100)], [100, pct(100)], [55, '≈ ' + pct(55)], [37, pct(37)], [30, pct('1–30')], [0, pct(0)]]
// Une boule de Noël remplie : rouge = importé, vert = fait en Suisse. lo/hi pour une fourchette (électricité)
function ornament(i, hi, lo = hi) {
  const id = `orn${i}`, r = 70, cx = 90, cy = 110, top = cy - r, h = 2 * r
  const yHi = top + h * (1 - hi / 100), yLo = top + h * (1 - lo / 100)
  const snow = hi === 0
  return `<svg viewBox="0 0 180 190" class="orn-svg" aria-hidden="true">
    <defs><clipPath id="${id}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>
      <pattern id="${id}h" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill="#2E5A47"/><rect width="4" height="8" fill="${C.red}"/></pattern>
      <radialGradient id="${id}s" cx="35%" cy="30%" r="70%"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
    <line x1="${cx}" y1="0" x2="${cx}" y2="${top - 14}" stroke="${C.gold}" stroke-width="2"/>
    <rect x="${cx - 14}" y="${top - 16}" width="28" height="16" rx="3" fill="${C.gold}"/>
    <g clip-path="url(#${id})">
      <rect x="0" y="0" width="180" height="190" fill="${snow ? '#0B1712' : '#2E5A47'}"/>
      ${lo < hi ? `<rect x="0" y="${yHi}" width="180" height="${yLo - yHi}" fill="url(#${id}h)"/>` : ''}
      <rect x="0" y="${yLo}" width="180" height="${190 - yLo}" fill="${C.red}" class="orn-fill"/>
      ${snow ? `<g fill="${C.snow}" opacity=".9">${[[60, 90], [110, 75], [95, 130], [55, 140], [125, 120]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3"/>`).join('')}</g><text x="${cx}" y="${cy + 14}" text-anchor="middle" font-size="40" fill="${C.snow}">❄</text>` : ''}
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id}s)"/>
    </g>
    ${ORN_ICONS[i] ? `<g transform="translate(${cx} ${cy})"><circle r="29" fill="#F4F1EA" opacity=".94"/><circle r="29" fill="none" stroke="${C.gold}" stroke-width="2"/>${ORN_ICONS[i]}</g>` : ''}
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${snow ? C.snow : C.gold}" stroke-width="3" ${snow ? 'stroke-dasharray="6 6"' : ''}/>
  </svg>`
}
function snowflakes(n, on) {
  return `<span class="flakes">${Array.from({ length: n }, (_, i) => `<i class="${i < on ? 'on' : ''}">❄</i>`).join('')}</span>`
}
function meter() {
  const M = [[100], [100], [55], [37], [30, 1], [0]]
  const labels = [pct(100), pct(100), '≈ ' + pct(55), pct(37), pct('1–30'), pct(0)]
  return `<section class="section meter2">
    <div class="garland" aria-hidden="true"></div>
    ${head(T.meterTitle, T.meterLead)}
    <div class="legend"><span><i style="background:${C.red}"></i>${T.originImp}</span><span><i style="background:#2E5A47"></i>${T.originCh}</span></div>
    <div class="orn-grid">${M.map(([hi, lo], i) => { const [n, note] = T.meter[i]; return `
      <div class="orn-card ${i === 5 ? 'snow' : ''}">${ornament(i, hi, lo ?? hi)}
        <span class="orn-val">${labels[i]}</span>
        <span class="orn-name">${n}</span>
        <span class="orn-note">${note}</span>
      </div>` }).join('')}</div>
    <div class="card white-xmas">
      <h3 class="card-title">${T.meterFootK}</h3>
      <div class="wx-rows">
        <div class="wx-row"><span class="wx-y">${T.decTitle('1960')}</span>${snowflakes(10, 4)}<b>${pct(38)}</b></div>
        <div class="wx-row"><span class="wx-y">2016–2025</span>${snowflakes(10, 1)}<b class="red">${pct(9)}</b></div>
      </div>
      <p class="chart-note">${T.meterFoot}</p>
    </div>
    <p class="src">${T.meterSrc}</p>
  </section>`
}

/* ---------- 2. Le voyage de ton Noël ---------- */
const COLORS = { sapins: '#6FCF97', decorations: '#E0434B', mandarines: '#F2994A', fromage: '#EAF4FF', dinde: '#C9A27E', foie: '#F4C95D' }
const PRODUCTS = () => Object.fromEntries(Object.entries(COLORS).map(([k, c]) => [k, [T.products[k], c]]))
// Pays hors carte : on entre par le bord, route maritime approximative (km) + 800 km de camion
const FAR = {
  CN: [[860 - 6, 300], 20000], TW: [[860 - 6, 340], 19000], AU: [[860 - 6, 620], 22000],
  IL: [[860 - 6, 560], 3500], ZA: [[470, 660 - 6], 11000], BR: [[6, 630], 10500],
  CL: [[6, 590], 13000], US: [[6, 250], 7500], IS: [[150, 6], 2500],
}
const COORDS = { ...europe.coords, LU: [49.8, 6.1], RO: [45.9, 24.9], BA: [44.2, 17.8] }
const BERNE = [46.95, 7.45]
function hav(a, b) {
  const r = Math.PI / 180, dl = (b[0] - a[0]) * r, dn = (b[1] - a[1]) * r
  const h = Math.sin(dl / 2) ** 2 + Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin(dn / 2) ** 2
  return 2 * 6371 * Math.asin(Math.sqrt(h))
}
// point projeté d'un pays européen (projection Mercator identique à europe.json)
function proj(c) {
  if (europe.pts[c]) return europe.pts[c]
  const [la, lo] = COORDS[c]
  // approximation linéaire à partir de deux points connus (DE et ES)
  const a = europe.pts.DE, b = europe.pts.ES, A = COORDS.DE, B = COORDS.ES
  const kx = (a[0] - b[0]) / (A[1] - B[1])
  const merc = (lat) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360))
  const ky = (a[1] - b[1]) / (merc(A[0]) - merc(B[0]))
  return [Math.round(a[0] + (lo - A[1]) * kx), Math.round(a[1] + (merc(la) - merc(A[0])) * ky)]
}

export function flows(prod, year) {
  const v = origins.origins[prod]?.[year]
  if (!v) return null
  let co2 = 0, tkm = 0
  const cov = v.top.reduce((s, r) => s + r[1], 0)
  const rows = v.top.map(([c, sh]) => {
    const t = (v.total_t * sh) / 100
    let km, kg
    if (FAR[c]) { km = FAR[c][1] + 800; kg = t * (FAR[c][1] * 0.015 + 800 * 0.09) }
    else { km = hav(COORDS[c], BERNE) * 1.2; kg = t * km * 0.09 }
    co2 += kg; tkm += t * km
    return { c, sh, t, km, far: !!FAR[c], pt: FAR[c] ? FAR[c][0] : proj(c) }
  })
  return { total: v.total_t, rows, km: tkm / ((v.total_t * cov) / 100), co2: co2 / 1000 / (cov / 100) }
}

function flowMap(prod, year) {
  const f = flows(prod, year)
  const { w, h, ch } = europe
  const col = COLORS[prod]
  const on = new Set(f ? f.rows.map((r) => europe.num[r.c]).filter(Boolean) : [])
  let s = europe.countries.map((k) => `<path d="${k.d}" fill="${k.id === '756' ? C.snow : on.has(k.id) ? C.landOn : C.land}" stroke="${C.dark}" stroke-width="0.8"/>`).join('')
  if (!f) {
    s += `<text x="${w / 2}" y="${h / 2}" text-anchor="middle" font-family="Inter" font-size="20" fill="${C.t2}">${T.noData(year)}</text>`
    return `<svg viewBox="0 0 ${w} ${h}">${s}</svg>`
  }
  const maxT = Math.max(...f.rows.map((r) => r.t))
  const LW = 230, boxes = []
  let fl = '', lab = ''
  f.rows.forEach((r) => {
    const [x, y] = r.pt
    const dx = ch[0] - x, dy = ch[1] - y
    const mx = (x + ch[0]) / 2 - dy * 0.15, my = (y + ch[1]) / 2 + dx * 0.15
    const sw = 3 + 16 * Math.sqrt(r.t / maxT)
    fl += `<path class="flow" d="M${x},${y} Q${mx},${my} ${ch[0]},${ch[1]}" fill="none" stroke="${col}" stroke-width="${sw.toFixed(1)}" stroke-linecap="round" opacity=".9" data-tip="${T.countries[r.c]} : ${fmt(r.t)} t"/>`
    fl += `<circle cx="${x}" cy="${y}" r="${(4 + sw / 3).toFixed(1)}" fill="${col}"/>`
    let bx = x < ch[0] ? x - LW - 16 : x + 16, by = y - 30
    bx = Math.max(6, Math.min(w - LW - 6, bx)); by = Math.max(6, Math.min(h - 70, by))
    for (const o of boxes) if (Math.abs(o[0] - bx) < LW && Math.abs(o[1] - by) < 68) { by = o[1] - 72; if (by < 6) by = o[1] + 72 }
    boxes.push([bx, by])
    lab += `<rect x="${bx}" y="${by}" width="${LW}" height="62" rx="12" fill="${C.dark}" opacity=".94" stroke="${col}" stroke-width="1.5"/>
      <text x="${bx + 14}" y="${by + 24}" font-family="Inter" font-size="16" font-weight="800" fill="${C.t1}">${T.countries[r.c] || r.c}</text>
      <text x="${bx + LW - 14}" y="${by + 25}" text-anchor="end" font-family="Fraunces" font-size="22" font-weight="900" fill="${col}">${pct(r.sh)}</text>
      <text x="${bx + 14}" y="${by + 48}" font-family="IBM Plex Mono" font-size="13" fill="${C.t2}">${fmt(r.t)} t · ${fmt(r.km)} km${r.far ? ` (${T.sea})` : ''}</text>`
  })
  lab += `<circle cx="${ch[0]}" cy="${ch[1]}" r="10" fill="${C.snow}" stroke="${C.dark}" stroke-width="3"/><text x="${ch[0]}" y="${ch[1] + 32}" text-anchor="middle" font-family="IBM Plex Mono" font-size="15" font-weight="700" fill="${C.snow}">${T.switzerland}</text>`
  return `<svg viewBox="0 0 ${w} ${h}">${s}${fl}${lab}</svg>`
}
// Liste lisible sur mobile (la carte y est trop petite pour ses étiquettes)
function originList(prod, year) {
  const f = flows(prod, year)
  if (!f) return ''
  const col = COLORS[prod]
  return `<ul class="origins">${f.rows.map((r) => `<li><span class="dot" style="background:${col}"></span><b>${T.countries[r.c] || r.c}</b><span class="pct" style="color:${col}">${pct(r.sh)}</span><span class="mono">${fmt(r.t)} t · ${fmt(r.km)} km${r.far ? ` (${T.sea})` : ''}</span></li>`).join('')}</ul>`
}

function voyage(st) {
  const year = st.voyageYear
  const P = PRODUCTS()
  const cards = Object.entries(P).map(([p, [n, col]]) => {
    const f = flows(p, year)
    if (!f) return `<button class="pcard" data-prod="${p}" disabled><div class="top"><span class="name"><span class="dot" style="background:${col}"></span>${n}</span><span class="mono">${T.noDataShort(year)}</span></div></button>`
    const r0 = f.rows[0]
    return `<button class="pcard ${p === st.prod ? 'on' : ''}" data-prod="${p}" style="${p === st.prod ? `border-color:${col}` : ''}">
      <div class="top"><span class="name"><span class="dot" style="background:${col}"></span>${n}</span><span class="mono">${fmt(f.total)} t</span></div>
      <div class="row"><span class="pct">${pct(r0.sh)}</span><span>${T.countries[r0.c]}</span><span class="mono">≈ ${fmt(f.km)} km · ${fmt(f.co2)} t CO₂</span></div>
    </button>`
  }).join('')
  return `<section class="section" id="voyage">
    ${head(T.voyageTitle(year), T.voyageLead)}
    <div class="compare"><span class="compare-label">${T.yearShown}</span><div class="chips">${[1990, 2000, 2010, 2017, 2024].map((y) => `<button class="chip ${y === year ? 'on' : ''}" data-vyear="${y}" aria-pressed="${y === year}">${y}</button>`).join('')}</div></div>
    <div class="chips">${Object.entries(P).map(([k, [n, c]]) => `<button class="chip ${k === st.prod ? 'on' : ''}" data-prod="${k}" style="${k === st.prod ? `background:${c};border-color:${c};color:#0F1F1A` : ''}"><span class="dot" style="background:${k === st.prod ? '#0F1F1A' : c}"></span>${n}</button>`).join('')}</div>
    <div class="voyage-grid"><div><div class="map-box">${flowMap(st.prod, year)}</div><p class="legend-txt">${T.mapLegend}</p>${originList(st.prod, year)}</div><div class="pcards"><p class="legend-txt">${T.cardLegend}</p>${cards}</div></div>
    <p class="src">${T.voyageSrc}</p>
  </section>`
}

/* ---------- 3. Ce qui s'en va ---------- */
function stripes() {
  const yrs = Object.keys(fdata.TMAX).map(Number).filter((y) => y >= 1960 && y <= 2025)
  const sw = 1300 / yrs.length
  const col = (v) => {
    const t = Math.max(0, Math.min(1, (v + 0.5) / 8))
    const cs = [[36, 82, 140], [120, 160, 200], [236, 236, 236], [230, 140, 140], [180, 20, 40]]
    const k = t * 4, i = Math.min(3, Math.floor(k)), f = k - i
    return `rgb(${cs[i].map((x, j) => Math.round(x + (cs[i + 1][j] - x) * f))})`
  }
  return `<svg viewBox="0 0 1300 200">${yrs.map((y, i) => `<rect x="${(i * sw).toFixed(1)}" y="0" width="${(sw + 0.6).toFixed(1)}" height="170" fill="${col(fdata.TMAX[y])}" data-tip="${T.stripesTip(y, dec(fdata.TMAX[y]))}"/>`).join('')}
    ${[1960, 1980, 2000, 2024].map((y) => `<text x="${y === 1960 ? 0 : y === 2024 ? 1300 : (yrs.indexOf(y) * sw + sw / 2).toFixed(0)}" y="194" text-anchor="${y === 1960 ? 'start' : y === 2024 ? 'end' : 'middle'}" font-family="IBM Plex Mono" font-size="14" fill="${C.t2}">${y}</text>`).join('')}</svg>`
}
function series(data, color, unit, w = 600, h = 280) {
  const ys = Object.keys(data).map(Number).filter((y) => y >= 1960 && y <= 2025)
  const vmax = Math.max(...ys.map((y) => data[y]))
  const X = (y) => 56 + ((y - 1960) / 65) * (w - 76), Y = (v) => h - 40 - (v / vmax) * (h - 70)
  let s = [0.5, 1].map((f) => `<line x1="56" x2="${w - 10}" y1="${Y(vmax * f)}" y2="${Y(vmax * f)}" stroke="${C.line}"/><text x="48" y="${Y(vmax * f) + 5}" text-anchor="end" font-family="IBM Plex Mono" font-size="13" fill="${C.t3}">${Math.round(vmax * f)}${unit.trim() === '%' ? unit : ''}</text>`).join('')
  s += ys.map((y) => `<rect x="${X(y) - 4}" y="${Y(data[y])}" width="8" height="${h - 40 - Y(data[y])}" fill="${C.bar}" data-tip="${y} : ${data[y]}${unit}"/>`).join('')
  const pts = ys.filter((y) => y >= 1969).map((y) => { let a = 0; for (let k = y - 9; k <= y; k++) a += data[k]; return `${X(y)},${Y(a / 10)}` })
  s += `<polyline points="${pts.join(' ')}" fill="none" stroke="${color}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round" pointer-events="none"/>`
  s += [1960, 1980, 2000, 2025].map((y) => `<text x="${X(y)}" y="${h - 12}" text-anchor="middle" font-family="IBM Plex Mono" font-size="14" fill="${C.t2}">${y}</text>`).join('')
  return `<svg viewBox="0 0 ${w} ${h}">${s}</svg>`
}
const bigPair = (a, b, col) => `<span class="big">${a} <span class="arrow">→</span> <span style="color:${col}">${b}</span></span>`
function goes() {
  return `<section class="section">
    ${head(T.goesTitle, T.goesLead)}
    <div class="card">
      <div class="split"><div style="flex:1;min-width:280px"><h3 class="card-title">${T.stripesTitle}</h3><p class="chart-note" style="margin-top:8px">${T.stripesNote}</p></div>${bigPair(dec(4.1) + ' °C', dec(5.6) + ' °C', C.red)}</div>
      <p class="hint">${T.hintHover}</p>
      ${stripes()}
      <p class="src">${T.stripesSrc}</p>
    </div>
    <div class="grid2">
      <div class="card"><h3 class="card-title">${T.whiteTitle}</h3>${bigPair(pct(38), pct(9), C.snow)}
        <p class="chart-note">${T.whiteNote}</p><p class="hint">${T.hintHover}</p>
        ${series(fdata.S600, C.snow, pct('x').slice(1))}<p class="src">${T.whiteSrc}</p></div>
      <div class="card"><h3 class="card-title">${T.fondueTitle}</h3>
        <p class="why">${T.fondueWhat}</p>${bigPair('65', '40' + T.days, C.gold)}
        <p class="chart-note">${T.fondueNote}</p><p class="hint">${T.hintHover}</p>
        ${series(fdata.FON, C.gold, T.days)}<p class="src">${T.fondueSrc}</p></div>
    </div>
  </section>`
}

/* ---------- 4. Où tombe la neige ---------- */
const DECS = ['1960', '1970', '1980', '1990', '2000', '2010', '2020']
const decLabel = (d) => T.dec(d)
function snowMap(d) {
  const { W, H, cities } = snow
  const pins = Object.entries(cities).map(([k, [x, y]]) => `<circle cx="${x}" cy="${y}" r="7" fill="${C.red}" stroke="${C.dark}" stroke-width="3"/><rect x="${x + 12}" y="${y - 17}" width="${k.length * 13 + 16}" height="30" rx="8" fill="${C.dark}" opacity=".85"/><text x="${x + 20}" y="${y + 5}" font-family="Inter" font-size="22" font-weight="700" fill="${C.t1}">${T.cities[k] || k}</text>`).join('')
  return `<div class="snowmap"><img src="${BASE}snow/${d}.jpg" alt="${T.snowAlt(decLabel(d))}" width="${W}" height="${H}"><svg viewBox="0 0 ${W} ${H}">${pins}</svg></div>`
}
function snowHead(title, d, col) {
  const r = snow.res[d]
  return `<div class="snow-head"><span class="t">${title}</span><div class="nums">
    <div><b style="color:${col}">${pct(r.share50)}</b><span>${T.snowShare}</span></div>
    <div><b>${fmt(r.alt50)} m</b><span>${T.snowLine}</span></div></div></div>`
}
// La montagne : une limite de la neige qui monte, et des villes au-dessus ou au-dessous
const TOWNS = [
  ['Bâle', 260, 'L'], ['Lugano', 273, 'R'], ['Zurich', 408, 'L'], ['Lausanne', 495, 'R'], ['Berne', 540, 'L'],
  ['Coire', 593, 'R'], ['St-Gall', 670, 'L'], ['La Chaux-de-Fonds', 1000, 'R'], ['Davos', 1560, 'L'], ['Zermatt', 1608, 'R'], ['St-Moritz', 1822, 'L'],
]
export function mountainCard(dm, playing) {
  const W = 1240, H = 500, base = 470, top = 50, AMAX = 2200
  const Y = (a) => base - (a / AMAX) * (base - top)
  const cx = 660, half = 540 // la montagne va de cx-half à cx+half
  // flancs légèrement irréguliers ; x pour une altitude donnée sur un flanc
  const xAt = (a, side) => { const f = 1 - a / AMAX; return side === 'L' ? cx - half * f : cx + half * f }
  const peak = `M${cx - half - 60},${base} L${cx - half},${base} ` +
    [0.12, 0.25, 0.4, 0.55, 0.7, 0.82, 0.93].map((f, i) => `L${xAt(AMAX * f, 'L') + (i % 2 ? 14 : -10)},${Y(AMAX * f)}`).join(' ') +
    ` L${cx - 40},${Y(AMAX * 0.99)} L${cx},${Y(AMAX * 1.08)} L${cx + 44},${Y(AMAX * 0.98)} ` +
    [0.86, 0.74, 0.6, 0.46, 0.32, 0.18, 0.08].map((f, i) => `L${xAt(AMAX * f, 'R') + (i % 2 ? -12 : 10)},${Y(AMAX * f)}`).join(' ') +
    ` L${cx + half},${base} L${cx + half + 60},${base} Z`
  const a0 = snow.res['1960'].alt50, a = snow.res[dm].alt50
  let s = `<defs><clipPath id="mclip"><path d="${peak}"/></clipPath></defs>`
  for (const g of [500, 1000, 1500, 2000]) s += `<line x1="90" x2="${W}" y1="${Y(g)}" y2="${Y(g)}" stroke="${C.line}" stroke-dasharray="2 6"/><text x="80" y="${Y(g) + 5}" text-anchor="end" font-family="IBM Plex Mono" font-size="13" fill="${C.t3}">${fmt(g)} m</text>`
  s += `<path d="${peak}" fill="#24412F"/>`
  s += `<g clip-path="url(#mclip)"><rect x="0" y="0" width="${W}" height="${Y(a)}" fill="${C.snow}"/>`
  if (a > a0) s += `<rect x="0" y="${Y(a)}" width="${W}" height="${Y(a0) - Y(a)}" fill="${C.red}" opacity=".55"/>`
  s += `</g>`
  s += `<line x1="60" x2="${W}" y1="${Y(a0)}" y2="${Y(a0)}" stroke="${C.snow}" stroke-width="1.5" stroke-dasharray="6 6" opacity=".7"/><text x="94" y="${Y(a0) - 8}" text-anchor="start" font-family="IBM Plex Mono" font-size="13" fill="${C.t2}">${T.mtnRef(fmt(a0))}</text>`
  s += `<line x1="60" x2="${W}" y1="${Y(a)}" y2="${Y(a)}" stroke="${C.red}" stroke-width="3"/><rect x="${W - 250}" y="${Y(a) - 34}" width="246" height="28" rx="8" fill="${C.red}"/><text x="${W - 127}" y="${Y(a) - 14}" text-anchor="middle" font-family="IBM Plex Mono" font-size="14" font-weight="700" fill="#fff">${T.mtnLine(fmt(a))}</text>`
  let above = 0
  for (const [name, alt, side] of TOWNS) {
    const x = xAt(alt, side), y = Y(alt), up = alt >= a
    if (up) above++
    const lx = side === 'L' ? x - 14 : x + 14
    s += `<g data-tip="${T.cities[name] || name} · ${fmt(alt)} m"><circle cx="${x}" cy="${y}" r="${up ? 9 : 7}" fill="${up ? C.snow : '#6FCF97'}" stroke="${C.dark}" stroke-width="3"/>`
    s += `<text x="${lx}" y="${y + 5}" text-anchor="${side === 'L' ? 'end' : 'start'}" font-family="Inter" font-size="15" font-weight="700" fill="${up ? C.t1 : '#9FD9B4'}">${up ? '❄ ' : ''}${T.cities[name] || name}</text></g>`
  }
  s += `<text x="${cx + 30}" y="${Y(AMAX * 1.08) + 4}" text-anchor="start" font-family="IBM Plex Mono" font-size="13" fill="${C.t3}">${T.mtnPeak}</text>`
  return `<div class="card" id="mountain">
    <h3 class="card-title">${T.mtnTitle}</h3>
    <p class="chart-note">${T.mtnLead}</p>
    <div class="mtn-controls">
      <button class="chip play" data-play="1" aria-pressed="${!!playing}">${playing ? '❚❚ ' + T.pause : '▶ ' + T.play}</button>
      <div class="chips">${DECS.map((x) => `<button class="chip ${x === dm ? 'on' : ''}" data-decm="${x}" aria-pressed="${x === dm}">${decLabel(x)}${x === '2020' ? '*' : ''}</button>`).join('')}</div>
    </div>
    <div class="mtn-nums"><div><b style="color:${C.red}">${fmt(a)} m</b><span>${T.mtnNum1}</span></div><div><b>${above} / ${TOWNS.length}</b><span>${T.mtnNum2}</span></div></div>
    <div class="scroll-x"><svg viewBox="0 0 ${W} ${H}">${s}</svg></div>
    <div class="legend"><span><i style="background:${C.snow}"></i>${T.mtnLeg1}</span><span><i style="background:${C.red};opacity:.7"></i>${T.mtnLeg2}</span><span><i style="background:#6FCF97;border-radius:50%"></i>${T.mtnLeg3}</span></div>
    <p class="chart-note" style="font-size:14px">${T.snowLineNote}</p>
  </div>`
}

function decPicker(attr, sel, label, other) {
  return `<div class="compare"><span class="compare-label">${label}</span><div class="chips">${DECS.map((x) => `<button class="chip ${x === sel ? 'on' : ''}" data-${attr}="${x}" aria-pressed="${x === sel}" ${x === other ? 'disabled' : ''}>${decLabel(x)}</button>`).join('')}</div></div>`
}
function snowSection(st) {
  const da = st.decA, db = st.decB
  const ra = snow.res[da], rb = snow.res[db]
  return `<section class="section" id="neige">
    ${head(T.snowTitle, T.snowLead)}
    <div class="grid2">
      <div class="card">${decPicker('deca', da, T.before, db)}${snowHead(T.decTitle(da), da, C.snow)}${snowMap(da)}</div>
      <div class="card">${decPicker('decb', db, T.after, da)}${snowHead(T.decTitle(db), db, rb.share50 < ra.share50 ? C.red : C.t1)}${snowMap(db)}</div>
    </div>
    ${mountainCard(st.decM, st.playing)}
    <p class="src">${T.snowSrc}</p>
  </section>`
}

/* ---------- 5. L'industrie de Noël en Suisse ---------- */
const YCOL = [C.red, C.snow] // année ancienne, année récente
// Part importée de ce que la Suisse consomme (le reste est fait en Suisse), quand c'est connu
const ORIGIN = { chocolat: 41, vins_mousseux: 96, agrumes: 100 }
const IMP_KEYS = ['jouets', 'consoles_jeux', 'decorations_fete', 'parfums', 'chocolat', 'agrumes'] // les mousseux ont leur carte « réveillon »
function budgetChart() {
  const b = industry.ey.budget, ys = Object.keys(b).map(Number)
  const W = 600, H = 240, max = 360, bw = (W - 40) / ys.length
  let s = ''
  ys.forEach((y, i) => {
    const h = (b[y] / max) * (H - 60), x = 30 + i * bw, last = i === ys.length - 1
    s += `<rect x="${x + 6}" y="${H - 30 - h}" width="${bw - 12}" height="${h}" rx="4" fill="${last ? C.gold : C.bar}" data-tip="${y} : ${b[y]} CHF"/>`
    s += `<text x="${x + bw / 2}" y="${H - 36 - h}" text-anchor="middle" font-family="IBM Plex Mono" font-size="14" font-weight="700" fill="${C.t1}">${b[y]}</text>`
    s += `<text x="${x + bw / 2}" y="${H - 8}" text-anchor="middle" font-family="IBM Plex Mono" font-size="14" fill="${C.t2}">${y}</text>`
  })
  return `<svg viewBox="0 0 ${W} ${H}">${s}</svg>`
}
function onlineViz() {
  const o = industry.ey.online
  return `<div class="online"><p class="mini-title">${T.onlineTitle}</p>${Object.entries(o).map(([y, v]) => `
    <div class="on-row"><span class="on-y">${y}</span>
      <div class="on-bar" data-tip="${y} : ${pct(v)} ${T.onlineWeb}"><div class="on-web" style="width:${v}%"><span>📦 ${pct(v)}</span></div><div class="on-shop"><span>${T.onlineShop}</span></div></div></div>`).join('')}
    <p class="legend-txt"><span class="o-key web"></span> ${T.onlineWeb} <span class="o-key shop"></span> ${T.onlineShop} · ${T.onlineFoot}</p></div>`
}
function giftBars() {
  const H = industry.ey.giftsHist, Y0 = 2014, Y1 = 2025, LAB = [2014, 2016, 2021, 2022, 2023, 2024, 2025]
  const W = 340, h = 64, x = (yy) => 14 + ((yy - Y0) / (Y1 - Y0)) * (W - 28), y = (v) => h - 6 - (v / 60) * (h - 12)
  const row = (k) => {
    const d = H[k], ys = Object.keys(d).map(Number).sort((a, b) => a - b)
    const first = d[ys[0]], last = d[ys[ys.length - 1]], diff = last - first
    const col = diff >= 4 ? C.gold : diff <= -4 ? C.red : C.snow
    let s = ''
    for (let i = 1; i < ys.length; i++) {
      const a = ys[i - 1], b = ys[i]
      s += `<line x1="${x(a)}" y1="${y(d[a])}" x2="${x(b)}" y2="${y(d[b])}" stroke="${col}" stroke-width="3" stroke-linecap="round" ${b - a > 1 ? 'stroke-dasharray="2 6" opacity=".7"' : ''}/>`
    }
    s += ys.map((yy, i) => `<circle cx="${x(yy)}" cy="${y(d[yy])}" r="${i === ys.length - 1 ? 6 : 4}" fill="${i === ys.length - 1 ? col : '#16291F'}" stroke="${col}" stroke-width="2.5" data-tip="${T.gifts[k]} · ${yy} : ${pct(d[yy])}"/>`).join('')
    s += `<text x="${x(ys[0]) - 8}" y="${y(first) + 4}" text-anchor="end" font-family="IBM Plex Mono" font-size="12" fill="${C.t3}">${first}</text>`
    const tag = diff >= 4 ? `▲ ${T.giftsUp}` : diff <= -4 ? `▼ ${T.giftsDown}` : ''
    return `<div class="gh-row"><span class="g-name">${T.gifts[k]}${tag ? `<small style="color:${col}">${tag}</small>` : ''}</span>
      <svg viewBox="0 0 ${W} ${h}" class="gh-svg">${s}</svg>
      <span class="g-val" style="color:${col}">${pct(last)}</span></div>`
  }
  return `<div class="gift-hist">
    <div class="gh-row gh-head"><span></span><svg viewBox="0 0 ${W} 18" class="gh-svg">${LAB.map((yy) => `<text x="${x(yy)}" y="13" text-anchor="middle" font-family="IBM Plex Mono" font-size="12" fill="${C.t3}">’${String(yy).slice(2)}</text>`).join('')}</svg><span></span></div>
    ${Object.keys(H).map(row).join('')}</div>`
}
// Quand arrivent les importations ? 12 mini-barres par produit (part de l'année, mois par mois)
const IMP_ORDER = ['huitres', 'decorations_fete', 'consoles_jeux', 'agrumes', 'parfums', 'chocolat', 'jouets']
const IMP_ICON = { huitres: '🦪', decorations_fete: '✨', consoles_jeux: '🎮', agrumes: '🍊', parfums: '🌸', chocolat: '🍫', jouets: '🧸' }
function monthBars(k, years) {
  const yA = years.length > 1 ? years[0] : null, yB = years[years.length - 1]
  const B = months.months[k][yB], A = yA ? months.months[k][yA] : null
  const W = 480, H = 76, bw = W / 12, max = Math.max(50, ...B)
  let s = `<rect x="${bw * 9}" y="0" width="${bw * 3}" height="${H - 16}" rx="6" fill="${C.gold}" opacity=".12"/>`
  B.forEach((v, m) => {
    const h = (v / max) * (H - 24), x = m * bw + 4
    s += `<rect x="${x}" y="${H - 18 - h}" width="${bw - 8}" height="${Math.max(h, 1.5)}" rx="3" fill="${m >= 9 ? C.snow : '#5E7D70'}" data-tip="${T.monthsLong[m]} ${yB} : ${pct(v)}"/>`
    if (A) { const ha = (A[m] / max) * (H - 24); s += `<line x1="${x - 1}" x2="${x + bw - 7}" y1="${H - 18 - ha}" y2="${H - 18 - ha}" stroke="${C.red}" stroke-width="3" stroke-linecap="round" data-tip="${T.monthsLong[m]} ${yA} : ${pct(A[m])}"/>` }
    s += `<text x="${m * bw + bw / 2}" y="${H - 3}" text-anchor="middle" font-family="IBM Plex Mono" font-size="11" fill="${m === 11 ? C.t1 : C.t3}" font-weight="${m === 11 ? 700 : 400}">${T.months[m]}</text>`
  })
  return `<svg viewBox="0 0 ${W} ${H}" class="mb-svg">${s}</svg>`
}
function monthSpark(k, y) {
  const B = months.months[k][y], max = Math.max(...B), W = 132, H = 34, bw = W / 12
  return `<svg viewBox="0 0 ${W} ${H}" class="m-spark" aria-hidden="true"><rect x="${bw * 9}" y="0" width="${bw * 3}" height="${H}" rx="3" fill="${C.gold}" opacity=".14"/>${B.map((v, m) => { const h = Math.max(1.5, (v / max) * (H - 4)); return `<rect x="${m * bw + 1.5}" y="${H - h}" width="${bw - 3}" height="${h}" rx="1.5" fill="${m >= 9 ? C.snow : '#5E7D70'}" data-tip="${T.monthsLong[m]} ${y} : ${pct(Math.round(v))}"/>` }).join('')}</svg>`
}
function importRows(years) {
  const I = industry.imports, yB = years[years.length - 1], yA = years.length > 1 ? years[0] : null
  const val = (k, y) => k === 'huitres' ? months.oysterValue[y] : I[k][y]?.[0]
  const f = (v) => (v < 10 ? dec(v) : fmt(v))
  const keys = [...IMP_ORDER].sort((a, b) => val(b, yB) - val(a, yB))
  const max = Math.max(...keys.flatMap((k) => [val(k, yB), yA ? val(k, yA) : 0]))
  return `<div class="imp3">${keys.map((k) => {
    const b = val(k, yB), a = yA ? val(k, yA) : null
    const B = months.months[k][yB], peak = B.indexOf(Math.max(...B))
    const g = a ? Math.round((b / a - 1) * 100) : null
    return `<div class="imp3-row">
      <div class="i3-name"><span class="i3-ico">${IMP_ICON[k]}</span><b>${T.impNames[k]}</b></div>
      <div class="i3-bars">
        <div class="i3-bar now" style="width:${Math.max(0.6, (b / max) * 100)}%" data-tip="${T.impNames[k]} ${yB} : ${f(b)} ${T.mioChf}"></div>
        ${a !== null ? `<div class="i3-bar then" style="width:${Math.max(0.6, (a / max) * 100)}%" data-tip="${T.impNames[k]} ${yA} : ${f(a)} ${T.mioChf}"></div>` : ''}
      </div>
      <div class="i3-val"><b>${f(b)}</b><small>${T.mioChf}</small>${g !== null ? `<em class="${g >= 0 ? 'up' : 'down'}">${g >= 0 ? '+' : '−'}${Math.abs(g)} %<span>${T.vsYear ? T.vsYear(yA) : 'vs ' + yA}</span></em>` : ''}</div>
      <div class="i3-when">${monthSpark(k, yB)}<span>${T.peakLabel} : ${T.monthsLong[peak]}</span></div>
    </div>`
  }).join('')}</div>`
}
function originBar(k) {
  const v = ORIGIN[k]
  if (v === undefined) return `<div class="i-origin unknown">${T.originUnknown}</div>`
  return `<div class="i-origin"><div class="o-bar"><div class="o-imp" style="width:${v}%" data-tip="${T.originImp} : ${pct(v)}">${pct(v)}</div><div class="o-ch" style="width:${100 - v}%" data-tip="${T.originCh} : ${pct(100 - v)}">${v < 90 ? pct(100 - v) : ''}</div></div></div>`
}
function parcelsViz() {
  const p = industry.post.parcels
  return `<div class="parcel-rows">${Object.entries(p).map(([y, n]) => `<div class="p-row"><span class="p-year">${y}</span><span class="p-boxes">${'<i></i>'.repeat(Math.floor(n))}${n % 1 ? `<i style="width:${(n % 1) * 18}px"></i>` : ''}</span><span class="p-n">${dec(n)} ${T.mioShort}</span></div>`).join('')}</div>`
}
function industrySection(st) {
  const b = industry.ey.budget
  return `<section class="section">
    ${head(T.indTitle, T.indLead)}
    <div class="grid2">
      <div class="card"><h3 class="card-title">${T.budgetTitle}</h3>
        <div class="detail-big"><span class="big" style="color:${C.gold}">${b[2025]} CHF</span><span class="yr">2025</span></div>
        <p class="chart-note">${T.budgetNote}</p><p class="hint">${T.hintHover}</p>
        ${budgetChart()}
        ${onlineViz()}
        <p class="src">${T.eySrc}</p></div>
      <div class="card"><h3 class="card-title">${T.giftsTitle}</h3>
        <p class="chart-note">${T.giftsNote}</p>
        <p class="why">${T.giftsRead}</p>
        ${giftBars()}
        <p class="hint">${T.hintHover}</p>
        <p class="legend-txt">${T.giftsBefore}</p>
        <p class="src">${T.eySrc}</p></div>
    </div>
    <div class="card"><h3 class="card-title">${T.impTitle}</h3>
      <p class="chart-note">${T.impNote}</p>
      ${yearCompare(st.years, T)}
      <p class="legend-txt imp-legend"><span class="k-bar"></span> ${st.years[st.years.length - 1]} ${st.years.length > 1 ? `<span class="k-line2"></span> ${st.years[0]}` : ''} <span class="k-zone"></span> ${T.impWhen} : ${T.impZone}</p>
      ${importRows(st.years)}
      <p class="src">${T.impSrc}</p></div>
    ${alcoholCard(st)}
    <div class="grid2">
      <div class="card"><h3 class="card-title">${T.parcelsTitle}</h3>
        <p class="chart-note">${T.parcelsNote}</p>
        ${parcelsViz()}
        <ul class="facts">${T.workFacts.map((f) => `<li>${f}</li>`).join('')}</ul>
        <p class="src">${T.postSrc}</p></div>
      <div class="card"><h3 class="card-title">${T.shopsTitle}</h3>
        <ul class="facts">${T.shopsFacts.map((f) => `<li>${f}</li>`).join('')}</ul>
        <p class="why">${T.shopsUnknown}</p>
        <p class="src">${T.shopsSrc}</p></div>
    </div>
  </section>`
}

// Contenu d'un chapitre (une page par chapitre)
export function chapterContent(id, st) {
  const f = { import: meter, voyage, neige: (x) => goes(x) + snowSection(x), commerce: industrySection, traditions: traditionsSection }[id]
  return `<div class="view">${f(st)}</div>`
}
