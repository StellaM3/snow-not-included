// Chapitre « Les traditions » et carte « Réveillon » (huîtres, bulles)
import { C, head, yearCompare } from '../util.js'
import { T, pct, dec } from '../i18n.js'
import culture from '../data/culture.json'
import rev from '../data/reveillon.json'

const YCOL = [C.red, C.snow]

/* ---------- Réveillon : huîtres et bulles ---------- */
function oysterBars(years) {
  const W = 620, H = 230, pad = 34, bw = (W - pad * 2) / 12
  const n = years.length
  let s = `<line x1="${pad}" x2="${W - pad}" y1="${H - 30 - (8.3 / 55) * (H - 60)}" y2="${H - 30 - (8.3 / 55) * (H - 60)}" stroke="${C.t3}" stroke-dasharray="4 5"/>`
  for (let m = 0; m < 12; m++) {
    years.forEach((y, k) => {
      const v = rev.oysters[y].months[m], h = (v / 55) * (H - 60)
      const w = (bw - 8) / n, x = pad + m * bw + 4 + k * w
      s += `<rect x="${x}" y="${H - 30 - h}" width="${w - 2}" height="${h}" rx="3" fill="${YCOL[n > 1 ? k : 1]}" data-tip="${T.monthsLong[m]} ${y} : ${pct(v)}"/>`
      if (m === 11) s += `<text x="${x + (w - 2) / 2}" y="${H - 36 - h}" text-anchor="middle" font-family="IBM Plex Mono" font-size="14" font-weight="700" fill="${YCOL[n > 1 ? k : 1]}">${Math.round(v)} %</text>`
    })
    s += `<text x="${pad + m * bw + bw / 2}" y="${H - 8}" text-anchor="middle" font-family="IBM Plex Mono" font-size="14" fill="${m === 11 ? C.t1 : C.t3}" font-weight="${m === 11 ? 700 : 400}">${T.months[m]}</text>`
  }
  return `<svg viewBox="0 0 ${W} ${H}" class="oy-svg">${s}</svg>`
}

// Flûte de champagne remplie par pays d'origine (du bas vers le haut)
const BCOL = { FR: C.gold, IT: '#9FD3B4', ES: '#E99A5B', other: '#5E7D70' }
function flute(y) {
  const b = rev.bubbles[y], x0 = 30, w = 70, top = 20, bot = 230
  const H = bot - top
  let yy = bot, s = ''
  for (const k of ['IT', 'FR', 'ES', 'other']) {
    const h = (b[k] / 100) * H
    yy -= h
    s += `<rect x="${x0}" y="${yy}" width="${w}" height="${h}" fill="${BCOL[k]}" data-tip="${y} · ${T.bubOrigins[k]} : ${pct(b[k])}"/>`
  }
  // bulles décoratives
  for (let i = 0; i < 7; i++) s += `<circle cx="${x0 + 12 + ((i * 23) % (w - 20))}" cy="${bot - 20 - i * 26}" r="${2 + (i % 3)}" fill="#fff" opacity=".45"/>`
  return `<svg viewBox="0 0 130 300" class="flute" role="img" aria-label="${y}">
    <defs><clipPath id="fl${y}"><path d="M${x0} ${top} h${w} v${H - 40} q0 40 -${w / 2} 40 q-${w / 2} 0 -${w / 2} -40z"/></clipPath></defs>
    <g clip-path="url(#fl${y})">${s}</g>
    <path d="M${x0} ${top} h${w} v${H - 40} q0 40 -${w / 2} 40 q-${w / 2} 0 -${w / 2} -40z" fill="none" stroke="${C.t1}" stroke-width="2.5"/>
    <path d="M${x0 + w / 2} ${bot} v46 M${x0 + 8} ${bot + 50} h${w - 16}" stroke="${C.t1}" stroke-width="3" stroke-linecap="round"/>
    <text x="${x0 + w / 2}" y="${top - 4}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="16" fill="${C.t1}">${y}</text>
  </svg>`
}

// Huîtres : bloc placé en tête de la carte des importations
export function oysterBlock(st) {
  const ys = st.years
  const big = ys.map((y, k) => `<span class="big" style="color:${YCOL[ys.length > 1 ? k : 1]}">${Math.round(rev.oysters[y].months[11])} %</span>`).join('<span class="big arrow">→</span>')
  return `<div class="oy-block">
    <div class="oy-text">
      <h4 class="mini-title">${T.oyTitle}</h4>
      <div class="detail-big">${big}</div>
      <p class="chart-note">${T.oyRead(ys.join(' / '))}. ${T.oyNote}</p>
      <ul class="facts"><li>${ys.map((y) => `${y} : ${T.oyTonnes(rev.oysters[y].t)}`).join(' · ')}</li><li>${T.oyFrance}</li></ul>
    </div>
    <div class="scroll-x">${oysterBars(ys)}</div>
  </div>`
}

// Alcool : les bulles importées, la baisse de la consommation, le sans-alcool
function glasses(n, color) {
  return `<div class="glasses">${Array.from({ length: n }, () => `<i style="background:${color}"></i>`).join('')}</div>`
}
function bottle(v, max, col, y) {
  const top = 46, bot = 236, h = ((bot - top) * v) / max
  const shape = 'M38 6 H62 V40 C62 58 84 66 84 92 V230 C84 238 78 242 70 242 H30 C22 242 16 238 16 230 V92 C16 66 38 58 38 40 Z'
  const id = 'bt' + y
  return `<figure class="bt"><svg viewBox="0 0 100 250" data-tip="${y} : ${String(v).replace('.', ',')} L"><defs><clipPath id="${id}"><path d="${shape}"/></clipPath></defs>
    <rect x="0" y="${bot - h + 6}" width="100" height="${h + 10}" fill="${col}" opacity=".9" clip-path="url(#${id})"/>
    <path d="${shape}" fill="none" stroke="${C.t1}" stroke-width="2.5"/><rect x="34" y="0" width="32" height="10" rx="2" fill="${C.gold}"/></svg>
    <figcaption><b style="color:${col}">${String(v).replace('.', ',')} L</b><span>${y}</span></figcaption></figure>`
}
function mug(on) {
  return `<svg viewBox="0 0 40 48" class="mug ${on ? 'on' : ''}" aria-hidden="true"><path d="M6 10 H28 V42 C28 45 26 46 24 46 H10 C8 46 6 45 6 42 Z" fill="${on ? '#9FD3B4' : 'rgba(234,244,255,.16)'}" stroke="${on ? '#9FD3B4' : 'rgba(234,244,255,.35)'}" stroke-width="2"/><path d="M28 16 H33 C36 16 37 18 37 21 V29 C37 32 36 34 33 34 H28" fill="none" stroke="${on ? '#9FD3B4' : 'rgba(234,244,255,.35)'}" stroke-width="2.5"/><path d="M5 10 C5 4 12 3 14 6 C16 2 24 2 26 6 C30 4 33 8 29 11 Z" fill="${on ? '#E8F6EE' : 'rgba(234,244,255,.3)'}"/></svg>`
}
export function alcoholCard(st) {
  const ys = st.years, last = ys[ys.length - 1]
  const A = T.alc
  return `<div class="card alc-card">
    <div class="section-sub"><h3 class="card-title">${A.title}</h3>${A.lead ? `<p class="chart-note">${A.lead}</p>` : ''}</div>
    <div class="grid2 rev-grid">
      <div class="rev-col">
        <h4 class="mini-title">${A.downTitle}</h4>
        <div class="bottles">
          ${bottle(10.6, 10.6, C.red, '2001')}
          <div class="bt-mid"><b>−28 %</b><span>${A.downRead}</span></div>
          ${bottle(7.6, 10.6, C.snow, '2024')}
        </div>
        <h4 class="mini-title" style="margin-top:34px">${A.zeroTitle}</h4>
        <div class="mugs">${Array.from({ length: 13 }, (_, i) => mug(i === 0)).join('')}</div>
        <p class="chart-note">${A.zeroBeerNote}</p>
        ${A.zeroWine.length ? `<p class="chart-note">${A.zeroWine[0]}</p>` : ''}
      </div>
      <div class="rev-col">
        <h4 class="mini-title">${T.bubTitle}</h4>
        ${yearCompare(ys, T)}
        <div class="flutes">${ys.map((y) => `<div class="fl-wrap">${flute(y)}<div class="fl-txt"><b>${pct(rev.bubbles[y].IT)}</b> ${T.bubOrigins.IT.split(' (')[0]}<br><b>${pct(rev.bubbles[y].FR)}</b> ${T.bubOrigins.FR.split(' (')[0]}<br><span>${T.bubPerCap(dec(rev.bubbles[y].perCap))}</span></div></div>`).join('')}</div>
        <div class="b-legend">${Object.keys(BCOL).map((k) => `<span><i style="background:${BCOL[k]}"></i>${T.bubOrigins[k]}</span>`).join('')}</div>
        <p class="chart-note">${T.bubNote}</p>
        <p class="chart-note">${T.bubPrice(dec(rev.bubbles[last].chfL_FR), dec(rev.bubbles[last].chfL_IT))}</p>
      </div>
    </div>
    <p class="src">${A.src} · ${T.revSrc}</p>
  </div>`
}

/* ---------- Les traditions ---------- */
function wordBubbles() {
  const R = (v) => Math.sqrt(v) * 13
  const pos = [[150, 160], [345, 122], [330, 272], [180, 330]]
  const col = [C.gold, C.snow, '#9FD3B4', C.red]
  // petit crochet et capuchon doré, comme une boule de Noël
  const hook = (x, y, r) => {
    const cw = Math.max(16, r * 0.34), ch = Math.max(8, r * 0.14), top = y - r - ch + 3
    return `<path d="M${x} ${top - 1} c -7 -3 -7 -15 0 -15 c 7 0 7 9 2 11" fill="none" stroke="#C9A45C" stroke-width="2" stroke-linecap="round"/>
      <rect x="${x - cw / 2}" y="${top}" width="${cw}" height="${ch}" rx="2" fill="#C9A45C"/>
      <line x1="${x - cw / 2 + 3}" x2="${x + cw / 2 - 3}" y1="${top + ch * 0.45}" y2="${top + ch * 0.45}" stroke="#8C6E33" stroke-width="1"/>`
  }
  let s = ''
  T.words.forEach(([w, v], i) => {
    const [x, y] = pos[i], r = R(v)
    s += hook(x, y, r)
    s += `<circle cx="${x}" cy="${y}" r="${r}" fill="${col[i]}" data-tip="${w} : ${pct(v)}"/>`
    s += `<text x="${x}" y="${y - 4}" text-anchor="middle" font-family="Fraunces" font-weight="900" font-size="${i === 0 ? 46 : 30}" fill="#0F1F1A" pointer-events="none">${v} %</text>`
    s += `<text x="${x}" y="${y + (i === 0 ? 30 : 22)}" text-anchor="middle" font-family="Inter" font-weight="700" font-size="${i === 0 ? 20 : 15}" fill="#0F1F1A" pointer-events="none">${w}</text>`
  })
  // la foi : boule pleine elle aussi, avec son explication juste à côté
  const fx = 70, fy = 440, fr = R(8)
  s += hook(fx, fy, fr)
  s += `<circle cx="${fx}" cy="${fy}" r="${fr}" fill="#7E9C8F" data-tip="8 % : ${T.faith8}"/>`
  s += `<text x="${fx}" y="${fy + 7}" text-anchor="middle" font-family="Fraunces" font-weight="900" font-size="20" fill="#0F1F1A" pointer-events="none">8 %</text>`
  s += `<text x="122" y="434" font-family="Inter" font-size="17" fill="${C.t2}">${T.faith8a}</text><text x="122" y="456" font-family="Inter" font-size="17" fill="${C.t2}">${T.faith8b}</text>`
  return `<svg viewBox="0 0 500 486" class="words">${s}</svg>`
}

function spoilBars() {
  return `<div class="spoil">${T.spoils.map(([l, v], i) => `
    <div class="sp-row" data-tip="${l} : ${pct(v)}"><span class="sp-l">${l}</span>
      <div class="sp-track"><div class="sp-bar" style="width:${v}%"></div></div><b class="sp-v">${pct(v)}</b></div>`).join('')}</div>`
}

const RCOL = { cat: C.gold, prot: '#9FD3B4', other: '#5E7D70', none: C.red }
const NSHARE = [.38, .22, .30, .10], NCOL = [C.red, '#F2A0A4', '#A8323A', '#6E2026']
function dots(y) {
  const r = culture.religion[y], keys = ['cat', 'prot', 'other', 'none']
  const tot = keys.reduce((a, k) => a + r[k], 0)
  // arrondi à 100 points (plus grands restes)
  const raw = keys.map((k) => (r[k] / tot) * 100), fl = raw.map(Math.floor)
  let rest = 100 - fl.reduce((a, b) => a + b, 0)
  raw.map((v, i) => [v - fl[i], i]).sort((a, b) => b[0] - a[0]).slice(0, rest).forEach(([, i]) => fl[i]++)
  let cells = []
  keys.forEach((k, i) => { for (let j = 0; j < fl[i]; j++) cells.push(k) })
  // 2023 : les sans-religion répartis selon ce qu'ils croient (OFS, ELRC 2019 : 38 % aucune divinité, 22 % agnostiques, 30 % force supérieure, 10 % un dieu)
  const nNone = fl[3], split = y === '2023' ? NSHARE.map((v) => Math.round(v * nNone)) : null
  if (split) split[0] += nNone - split.reduce((a, b) => a + b, 0)
  const sub = []; if (split) split.forEach((n, c) => { for (let j = 0; j < n; j++) sub.push(c) })
  let ni = 0
  const s = cells.map((k, i) => {
    const cx = 14 + (i % 10) * 26, cy = 14 + Math.floor(i / 10) * 26
    const c = k === 'none' && split ? sub[ni++] : -1, col = c >= 0 ? NCOL[c] : RCOL[k], tip = c >= 0 ? `${T.relCats.none} · ${T.relSub[c]}` : `${T.relCats[k]} : ${pct(Math.round(r[k]))}`
    return `<g data-tip="${y} · ${tip}"><circle cx="${cx}" cy="${cy - 4}" r="5" fill="${col}"/><path d="M${cx - 7} ${cy + 10} q7 -12 14 0z" fill="${col}"/></g>`
  }).join('')
  return `<div class="dots"><svg viewBox="0 0 262 262">${s}</svg><div class="dots-y">${y}</div><p class="dots-n"><b style="color:${C.red}">${Math.round(r.none)}</b> / 100 ${T.relCats.none.toLowerCase()}</p></div>`
}
function religionCard(st) {
  const y = st.relYear
  const ys = Object.keys(culture.religion).filter((k) => k !== '1970')
  return `<div class="card">
    <h3 class="card-title">${T.relTitle}</h3>
    <p class="chart-note">${T.relRead(y, Math.round(culture.religion[y].none))} ${T.relNote}</p>
    <div class="compare"><span class="compare-label">${T.relPick}</span><div class="chips">${ys.map((k) => `<button class="chip ${k === y ? 'on' : ''}" data-rel="${k}" aria-pressed="${k === y}">${k}</button>`).join('')}</div></div>
    <div class="dots-pair">${dots('1970')}<span class="big arrow">→</span>${dots(y)}</div>
    <div class="b-legend">${Object.keys(RCOL).map((k) => `<span><i style="background:${RCOL[k]}"></i>${T.relCats[k]}</span>`).join('')}</div>
    ${y === '2023' ? `<div class="b-legend rel-sub"><b>${T.relSubK}</b>${T.relSub.map((t, c) => `<span><i style="background:${NCOL[c]}"></i>${t}</span>`).join('')}</div>` : ''}
    <p class="why">${T.relBut}</p>
    <p class="src">${T.relSrc}</p>
  </div>`
}

function songChart(sel) {
  const d = culture.songs, ys = Object.keys(d).map(Number)
  const W = 1000, H = 300, pad = 30, bw = (W - pad * 2) / ys.length
  let s = ''
  for (let g = 0; g <= 30; g += 10) {
    const y = H - 34 - (g / 30) * (H - 70)
    s += `<line x1="${pad}" x2="${W - pad}" y1="${y}" y2="${y}" stroke="${C.line}"/><text x="${pad - 6}" y="${y + 4}" text-anchor="end" font-family="IBM Plex Mono" font-size="12" fill="${C.t3}">${g}</text>`
  }
  ys.forEach((y, i) => {
    const v = d[y], h = (v / 30) * (H - 70), x = pad + i * bw
    const hot = v >= 20
    const on = y === sel
    s += `<g class="sb ${on ? 'on' : ''}" data-songy="${y}" role="button" tabindex="0"><rect x="${x}" y="20" width="${bw}" height="${H - 34}" fill="${on ? 'rgba(234,244,255,.08)' : 'transparent'}" rx="4"/><rect x="${x + 3}" y="${H - 34 - Math.max(h, 2)}" width="${bw - 6}" height="${Math.max(h, 2)}" rx="3" fill="${hot ? C.red : v ? C.gold : C.line}" ${on ? `stroke="${C.snow}" stroke-width="2.5"` : ''} data-tip="${T.songTip(y, v)}"/></g>`
    if (v && (y % 5 === 0 || y === 2025 || y === 2017)) s += `<text x="${x + bw / 2}" y="${H - 40 - h}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="13" fill="${C.t1}">${v}</text>`
    if (y % 5 === 0 || y === 2025 || y === sel) s += `<text font-weight="${y === sel ? 700 : 400}"  x="${x + bw / 2}" y="${H - 12}" text-anchor="middle" font-family="IBM Plex Mono" font-size="13" fill="${C.t2}">${y}</text>`
  })
  return `<svg viewBox="0 0 ${W} ${H}">${s}</svg>`
}

function songPanel(y) {
  const o = culture.songTop[y], n = culture.songs[y]
  const ages = o.x.slice(0, 5).map((x) => y - +x[3]), avg = ages.length ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length) : null
  const discs = o.x.slice(0, 5).map(([r, a, t, ry], i) => `<div class="vinyl"><div class="disc"><span>${ry}</span></div><b>#${r} · ${t}</b><span>${a}</span></div>`).join('')
  return `<div class="song-panel">
    <div class="sp-head"><span class="big" style="color:${n >= 20 ? C.red : C.gold}">${n}</span><span>${T.songPanelHead(y)}</span>${avg !== null ? `<em>${T.songAvg(avg)}</em>` : ''}</div>
    ${o.x.length ? `<div class="vinyls">${discs}</div>` : `<p class="chart-note">${T.songNone}</p>`}
    ${o.n1 && !(o.x[0] && o.x[0][0] === 1) ? `<p class="legend-txt">${T.songN1(o.n1[1], o.n1[0])}</p>` : ''}
  </div>`
}
function filmList(y) {
  return `<ol class="film-list">${culture.films[y].map(([t, w, best, x]) => `<li class="${x ? 'x' : ''}"><span class="fl-t">${t}</span><span class="fl-m">${T.filmWeeks(w, best)}</span></li>`).join('')}</ol>`
}
function filmStrips() {
  const N = culture.netflix
  return `<div class="strips">${Object.entries(N).map(([y, weeks]) => {
    const n = weeks.reduce((a, [, w]) => a + w.split('').filter((c) => c === '1').length, 0)
    const p = Math.round((n / (weeks.length * 10)) * 100)
    return `<div class="strip"><span class="st-y">${y}</span><div class="st-cells">${weeks.map(([d, w]) => `<div class="st-week">${w.split('').map((c, i) => `<i class="${c === '1' ? 'x' : ''}" data-tip="${d} · #${i + 1}"></i>`).join('')}</div>`).join('')}</div><b class="st-p">${p} %</b></div>`
  }).join('')}</div>`
}

export function traditionsSection(st) {
  const d = culture.songs
  return `<section class="section">
    ${head(T.tradTitle, T.tradLead)}
    <div class="grid2">
      <div class="card"><h3 class="card-title">${T.wordTitle}</h3><p class="chart-note">${T.wordNote}</p>${wordBubbles()}
        <p class="src">${T.marketSrc}</p></div>
      <div class="card"><h3 class="card-title">${T.spoilTitle}</h3><p class="chart-note">${T.spoilNote}</p>${spoilBars()}<p class="src">${T.marketSrc}</p></div>
    </div>
    ${religionCard(st)}
    <div class="grid2">
      <div class="card debate"><h3 class="card-title">${T.debTitle}</h3><p class="chart-note">${T.debLead}</p>
        <div class="bubbles"><p class="bub l">${T.debFor}</p><p class="bub r">${T.debAgainst}</p><p class="bub l">${T.debMid}</p></div>
        <p class="why">${T.debKnow}</p><p class="src">${T.debSrc}</p></div>
      <div class="card"><h3 class="card-title">${T.litTitle}</h3><p class="chart-note">${T.litNote}</p>
        <div class="lit">${T.litRows.map(([l, v]) => `<div class="lit-row"><div class="bulbs">${Array.from({ length: 10 }, (_, i) => `<i class="${i < Math.round(v / 10) ? 'off' : 'on'}"></i>`).join('')}</div><b>${v} %</b><span>${l}</span></div>`).join('')}</div>
        <p class="src">${T.litSrc}</p></div>
    </div>
    <div class="card"><h3 class="card-title">${T.songTitle}</h3>
      <div class="detail-big"><span class="big" style="color:${C.gold}">${d[1990]}</span><span class="yr">1990</span><span class="big arrow">→</span><span class="big" style="color:${C.red}">${d[2025]}</span><span class="yr">2025</span></div>
      <p class="chart-note">${T.songRead(d[1990], d[2025], 1990, 2025)} ${T.songNote}</p>
      <p class="hint">${T.songClick}</p>
      <div class="scroll-x">${songChart(st.songYear)}</div>
      ${songPanel(st.songYear)}
      <p class="why">${T.songOld} ${T.songMariah}</p>
      <p class="src">${T.songSrc}</p></div>
    <div class="grid2">
      <div class="card"><h3 class="card-title">${T.filmTitle}</h3><p class="chart-note">${T.filmNote}</p>${filmStrips()}
        <div class="compare"><span class="compare-label">${T.filmPick}</span><div class="chips">${Object.keys(culture.films).map((k) => `<button class="chip ${k === st.filmYear ? 'on' : ''}" data-filmy="${k}">${k}</button>`).join('')}</div></div>
        <p class="mini-title">${T.filmTopTitle(st.filmYear)}</p>
        ${filmList(st.filmYear)}
        <ul class="facts">${T.filmClassics.map((f) => `<li>${f}</li>`).join('')}</ul>
        <p class="src">${T.filmSrc}</p></div>
      <div class="card"><h3 class="card-title">${T.tvTitle}</h3><ul class="facts">${T.tvFacts.map((f) => `<li>${f}</li>`).join('')}</ul>
        <p class="why">${T.tvUnknown}</p><p class="src">${T.tvSrc}</p></div>
    </div>
  </section>`
}
