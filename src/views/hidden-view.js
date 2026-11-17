// Vue « Face cachée » (maquette G2)
import elec from '../data/elec.json'
import { fmt, C, hbars } from '../util.js'

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
  s += `<line x1="${px(0)}" x2="${px(30)}" y1="${py(ref)}" y2="${py(ref)}" stroke="#E9E4DA" stroke-width="1.5" stroke-dasharray="4 6" opacity=".6"/><text x="${px(30)}" y="${py(ref) - 10}" text-anchor="end" fill="#E9E4DA" font-size="13" font-family="Inter">jour ouvrable moyen ≈ ${Math.round(ref)} GWh</text>`
  v.forEach((val, i) => { s += `<rect x="${px(i) - 18}" y="${y0}" width="36" height="${H - y0 - 40}" fill="transparent" data-tip="${i + 1} déc. ${y} : ${String(val).replace('.', ',')} GWh"/>` })
  s += `<circle cx="${px(24)}" cy="${py(v[24])}" r="7" fill="${C.red}" pointer-events="none"/><text x="${px(24)}" y="${py(v[24]) + 30}" text-anchor="middle" fill="${C.red}" font-size="14" font-weight="700" font-family="Inter">25.12 · ${Math.round(v[24])} GWh</text>`
  for (let i = 0; i < 31; i++) if ((i + 1) % 5 === 0 || i === 0 || (i >= 23 && i <= 25)) s += `<text x="${px(i)}" y="${H - 8}" text-anchor="middle" fill="${i >= 23 && i <= 25 ? C.red : '#8E9C96'}" font-size="12" font-family="IBM Plex Mono">${i + 1}</text>`
  return `<svg viewBox="0 0 ${W} ${H}">${s}</svg>`
}

export function hiddenView(st) {
  const years = Object.keys(elec)
  const { drop } = elecStats(st.elecYear)
  const tiles = [
    tile('01 · Neige', '9 %', 'des Noëls sont encore blancs sous 600 m', hbars([['Années 60', 38, '#E9E4DA', '38 %'], ['2016–2025', 9, C.red, '9 %']], 40),
      "Part des stations de plaine enneigées le 25 décembre, moyenne sur 10 ans. La seule chose qu'on n'importe pas, c'est celle qui disparaît.", 'MétéoSuisse · 14 stations sous 600 m'),
    tile('02 · Sapin', '62', 'sapins sur 100 viennent du Danemark', picto(100, 62, 'tree'),
      'Environ 5000 tonnes importées par an, surtout en novembre. Monoculture, engrais et pesticides là-bas, le sapin ici.', 'OFDF · TN8 0604.2021, 2021–2025'),
    tile('03 · Décorations', '65', 'boules sur 100 viennent de Chine', picto(100, 65, 'ball'),
      'Les importations de décorations culminent en septembre : Noël commence dans les conteneurs trois mois avant le salon.', 'OFDF · TN8 9505'),
    tile('04 · Chocolat', '51', "fèves sur 100 viennent du Ghana ou de Côte d'Ivoire", picto(100, 51, 'bean'),
      "Deux pays où 1,56 million d'enfants travaillent dans le cacao (enquête NORC 2018–2019).", 'OFDF · TN8 1801, 2021–2025 · NORC / Plateforme suisse du cacao durable'),
    tile('05 · Bougies', '×5', "plus d'incendies dus aux bougies pendant l'Avent", hbars([["Une semaine le reste de l'année", 14, M, '≈ 14'], ["Une semaine de l'Avent", 70, C.red, "jusqu'à 70"]], 70),
      'Couronnes, sapins secs, bougies oubliées. Chez AXA, les sinistres feu doublent à Noël.', 'Suva · BPA · CIPI (assurances cantonales), 2022 · AXA, 2024'),
    tile('06 · La chaise vide', '3/20', 'jeunes de 15 à 25 ans se sentent souvent seuls (1/20 en 2012)', picto(20, 3, 'person', 10, 34),
      "La solitude des jeunes a triplé en dix ans. Les fêtes ne l'inventent pas, elles la rendent visible.", 'Statistique Vaud, Enquête suisse sur la santé 2022 (Vaud)'),
  ].join('')

  return `<div class="view">
    <section class="card">
      <div class="split">
        <p class="kicker">00 · Le pays s'éteint · Consommation électrique, décembre ${st.elecYear} (GWh par jour)</p>
        <span class="big" style="color:${C.red}">−${drop} %</span>
      </div>
      <div class="elec-years">${years.map((y) => `<button class="chip ${+y === +st.elecYear ? 'on' : ''}" data-elec="${y}">${y}</button>`).join('')}</div>
      ${elecCurve(st.elecYear)}
      <p class="src">Swissgrid · consommation finale, quarts d'heure additionnés par jour · −${drop} % : le 25 décembre comparé à un jour ouvrable moyen du 1er au 20 décembre</p>
    </section>
    <div class="grid3">${tiles}</div>
    <div class="grid2" style="grid-template-columns:1fr 1.4fr">
      <div class="card">
        <p class="kicker">07 · Le mythe</p>
        <p class="myth">Plus de suicides à Noël ?<br><em>Faux.</em></p>
        <p class="txt" style="margin:0;font-size:15px;line-height:1.5;color:var(--t2)">Les études ne trouvent pas de hausse en décembre, et la Suisse ne publie pas de chiffres mensuels. Répéter ce mythe est lui-même jugé à risque par les spécialistes de la prévention.</p>
        <p class="src">Le Temps / Annenberg Public Policy Center · Santé publique France · OFSP</p>
      </div>
      <div class="card">
        <p class="kicker">08 · Ce qui augmente vraiment : les appels</p>
        ${hbars([['Jour ordinaire', 100, M, '100'], ['Avant Noël', 135, C.red, "jusqu'à 135"]], 135)}
        <div class="calls-nums">
          <div><b>240'000</b><span>appels par an à La Main Tendue (143), 640 bénévoles</span></div>
          <div><b>60 %+</b><span>des thèmes : solitude, isolement, souffrance psychique</span></div>
        </div>
        <p class="src">Hausse : Telefonseelsorge Wien (jusqu'à +35 %) · La Main Tendue 2018 · Main Tendue Genève 2024</p>
      </div>
    </div>
    <section class="help">
      <p>Le 24 décembre aussi, quelqu'un répond.</p>
      <div class="nums">
        <div><b>143</b><span>La Main Tendue</span></div>
        <div><b>147</b><span>Pro Juventute (jeunes)</span></div>
        <div><b>144</b><span>Urgences</span></div>
        <a href="https://stopsuicide.ch" target="_blank" rel="noopener">stopsuicide.ch</a>
      </div>
    </section>
  </div>`
}
