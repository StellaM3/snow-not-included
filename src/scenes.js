// Petites scènes illustrées pour les chapitres (page d'accueil et liens « chapitre suivant »)
const R = '#E0434B', G = '#F4C95D', S = '#EAF4FF', M = '#9FD3B4', D = '#0F1F1A', L = '#2C4A3F', B = '#8C5A3C'

const tree = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -60 L22 -22 H12 L30 6 H18 L36 34 H-36 L-18 6 H-30 L-12 -22 H-22Z" fill="#3E8E63"/><rect x="-5" y="34" width="10" height="12" fill="${B}"/><path d="M0 -70 l4 8 h-8z" fill="${G}"/><circle cx="-8" cy="-10" r="3" fill="${R}"/><circle cx="10" cy="14" r="3" fill="${S}"/><circle cx="-14" cy="22" r="3" fill="${G}"/></g>`
const flag = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-12" y="-12" width="24" height="24" rx="5" fill="${R}"/><path d="M-3 -7h6v4h4v6h-4v4h-6v-4h-4v-6h4z" fill="#fff"/></g>`
const snowflakes = (n, seed = 1) => Array.from({ length: n }, (_, i) => {
  const x = (i * 73 + seed * 31) % 320, y = (i * 41 + seed * 17) % 120
  return `<circle class="flake" style="animation-delay:${(i % 5) * 0.4}s" cx="${x}" cy="${y}" r="${1.5 + (i % 3)}" fill="#fff" opacity=".7"/>`
}).join('')

export const SCENES = {
  // 1 · Importé : un cadeau couvert d'étiquettes de pays
  import: `<rect width="320" height="200" fill="#1B3427"/>${snowflakes(10, 1)}
    <g class="bob"><rect x="105" y="70" width="110" height="90" rx="8" fill="${R}"/><rect x="98" y="58" width="124" height="26" rx="6" fill="#C93840"/>
    <rect x="152" y="58" width="16" height="102" fill="${G}"/><path d="M160 58c-18-26-44-10-24 0zM160 58c18-26 44-10 24 0z" fill="${G}"/>
    <g transform="rotate(-12 128 115)"><rect x="112" y="104" width="34" height="20" rx="3" fill="${S}"/><text x="129" y="118" font-family="IBM Plex Mono" font-size="10" font-weight="700" text-anchor="middle" fill="${D}">DK</text></g>
    <g transform="rotate(10 196 132)"><rect x="180" y="122" width="34" height="20" rx="3" fill="${S}"/><text x="197" y="136" font-family="IBM Plex Mono" font-size="10" font-weight="700" text-anchor="middle" fill="${D}">CN</text></g>
    <g transform="rotate(-6 190 96)"><rect x="176" y="88" width="30" height="18" rx="3" fill="${M}"/><text x="191" y="101" font-family="IBM Plex Mono" font-size="10" font-weight="700" text-anchor="middle" fill="${D}">ES</text></g></g>
    <rect y="172" width="320" height="28" fill="#16291F"/>`,
  // 2 · Le voyage : des arcs depuis l'Europe vers la Suisse
  voyage: `<rect width="320" height="200" fill="#3A1D22"/>
    <path d="M30 150 C70 40 140 30 160 110" fill="none" stroke="${G}" stroke-width="3" stroke-dasharray="6 6" class="dash"/>
    <path d="M290 60 C250 20 190 40 168 104" fill="none" stroke="${M}" stroke-width="3" stroke-dasharray="6 6" class="dash"/>
    <path d="M280 170 C230 180 190 160 166 120" fill="none" stroke="${S}" stroke-width="3" stroke-dasharray="6 6" class="dash"/>
    <circle cx="30" cy="150" r="7" fill="${G}"/><circle cx="290" cy="60" r="7" fill="${M}"/><circle cx="280" cy="170" r="7" fill="${S}"/>
    <g class="bob">${flag(162, 112, 1.6)}</g>
    <g transform="translate(70 70) rotate(-25)"><path d="M0 0 l26 -4 l4 4 l-26 6z M8 0 l-6 -10 h5 l8 9z M8 2 l-5 10 h5 l8 -9z" fill="${S}"/></g>`,
  // 3 · Le climat : un thermomètre qui monte et un bonhomme de neige qui fond
  climat: `<rect width="320" height="200" fill="#1B3427"/>
    <rect x="0" y="0" width="320" height="200" fill="url(#hot)" opacity=".5"/>
    <defs><linearGradient id="hot" x1="0" x2="1"><stop offset="0" stop-color="#2E5A8C"/><stop offset=".5" stop-color="#1B3427"/><stop offset="1" stop-color="${R}"/></linearGradient></defs>
    ${Array.from({ length: 16 }, (_, i) => `<rect x="${i * 20}" y="176" width="20" height="24" fill="${['#2E5A8C', '#3F79B0', '#7FB0D8', '#E8C2A0', '#E99A5B', R][Math.min(5, Math.floor(i / 2.8))]}"/>`).join('')}
    <g transform="translate(110 0)"><ellipse cx="0" cy="160" rx="46" ry="12" fill="${S}" opacity=".6"/><circle cx="0" cy="132" r="30" fill="${S}"/><circle cx="0" cy="88" r="20" fill="${S}"/><path d="M0 86 l16 4 l-16 3z" fill="#E99A5B"/><circle cx="-6" cy="82" r="2.5" fill="${D}"/><circle cx="6" cy="82" r="2.5" fill="${D}"/><path d="M-22 70 h44 v-6 h-8 v-20 h-28 v20 h-8z" fill="${D}"/><path class="drip" d="M18 140 q4 10 0 16 q-4 -6 0 -16z" fill="${S}"/></g>
    <g transform="translate(232 30)"><rect x="-9" y="0" width="18" height="110" rx="9" fill="${S}"/><rect class="rise" x="-5" y="40" width="10" height="70" rx="5" fill="${R}"/><circle cx="0" cy="118" r="17" fill="${R}"/></g>`,
  // 4 · La neige : une montagne avec la limite de la neige qui monte
  neige: `<rect width="320" height="200" fill="#22344A"/>${snowflakes(14, 3)}
    <path d="M0 200 L90 70 L130 110 L190 30 L320 200Z" fill="#3A5E4C"/>
    <path d="M190 30 L222 72 L208 68 L196 80 L184 66 L170 72 Z" fill="${S}"/><path d="M90 70 L104 90 L96 88 L90 94 L82 88 L76 90 Z" fill="${S}"/>
    <line class="snowline" x1="0" x2="320" y1="96" y2="96" stroke="${R}" stroke-width="3" stroke-dasharray="8 6"/>
    <g fill="${G}"><rect x="40" y="168" width="14" height="12"/><rect x="60" y="164" width="12" height="16"/><rect x="250" y="170" width="16" height="10"/></g>
    <path d="M38 168 l9 -8 l9 8z M58 164 l8 -7 l8 7z M248 170 l10 -8 l10 8z" fill="${R}"/>
    <g transform="translate(286 34)"><rect x="-7" y="0" width="14" height="80" rx="7" fill="${S}"/><rect class="rise" x="-4" y="30" width="8" height="50" rx="4" fill="${R}"/><circle cx="0" cy="86" r="13" fill="${R}"/></g>`,
  // 5 · Le commerce : sacs, huître et flûte
  commerce: `<rect width="320" height="200" fill="#40341A"/>
    <g class="bob"><path d="M70 80 h70 l8 90 h-86z" fill="${R}"/><path d="M88 80 q17 -34 34 0" fill="none" stroke="${G}" stroke-width="5"/>
    <path d="M140 96 h56 l6 74 h-68z" fill="${M}"/><path d="M154 96 q14 -26 28 0" fill="none" stroke="${D}" stroke-width="4"/>
    <text x="105" y="135" font-family="Fraunces" font-weight="900" font-size="26" fill="#fff" text-anchor="middle">CHF</text></g>
    <g transform="translate(250 130)"><path d="M-14 -70 h28 v44 q0 16 -14 16 q-14 0 -14 -16z" fill="${G}" opacity=".9"/><path d="M-14 -70 h28 v44 q0 16 -14 16 q-14 0 -14 -16z" fill="none" stroke="${S}" stroke-width="2.5"/><path d="M0 -10 v34 M-12 26 h24" stroke="${S}" stroke-width="3"/><circle class="fizz" cx="-4" cy="-40" r="2" fill="#fff"/><circle class="fizz" style="animation-delay:.6s" cx="5" cy="-52" r="1.6" fill="#fff"/></g>
    <g transform="translate(232 178)"><ellipse cx="0" cy="0" rx="30" ry="12" fill="#B9B3A6"/><ellipse cx="0" cy="-3" rx="20" ry="7" fill="#E9E2D3"/></g>`,
  // 6 · Les traditions : notes de musique, télé et étoile
  traditions: `<rect width="320" height="200" fill="#2A2347"/>${snowflakes(8, 5)}
    <rect x="40" y="70" width="120" height="84" rx="10" fill="${D}" stroke="${S}" stroke-width="3"/><rect x="52" y="82" width="96" height="60" rx="4" fill="#3E8E63"/>${tree(100, 118, 0.6)}
    <path d="M86 70 l14 -16 l14 16" fill="none" stroke="${S}" stroke-width="3"/><path d="M80 154 v10 M120 154 v10" stroke="${S}" stroke-width="3"/>
    <g class="note"><path d="M210 60 v58" stroke="${G}" stroke-width="5"/><ellipse cx="202" cy="120" rx="11" ry="8" fill="${G}"/><path d="M210 60 q24 6 26 26" fill="none" stroke="${G}" stroke-width="5"/></g>
    <g class="note" style="animation-delay:.8s"><path d="M262 90 v46" stroke="${M}" stroke-width="5"/><ellipse cx="254" cy="138" rx="10" ry="7" fill="${M}"/></g>
    <path d="M260 40 l5 10 l11 2 l-8 8 l2 11 l-10 -5 l-10 5 l2 -11 l-8 -8 l11 -2z" fill="${G}"/>`,
  // 7 · La face cachée : salon sombre, sapin allumé, prise électrique
  cache: `<rect width="320" height="200" fill="#060A09"/><circle cx="270" cy="40" r="18" fill="#D6DDD9"/><circle cx="278" cy="34" r="16" fill="#060A09"/>
    <rect x="30" y="40" width="70" height="60" rx="4" fill="#0B1712" stroke="#1C2723" stroke-width="3"/><path d="M65 40 v60 M30 70 h70" stroke="#1C2723" stroke-width="3"/>
    <g class="glow">${tree(170, 122, 1.15)}</g>
    <path d="M170 172 q40 10 70 -10 t60 -20" fill="none" stroke="#2A2A2A" stroke-width="4"/>
    <rect x="276" y="130" width="22" height="30" rx="4" fill="#1C2723"/><circle cx="283" cy="142" r="2.5" fill="#060A09"/><circle cx="291" cy="142" r="2.5" fill="#060A09"/>
    <g class="spark"><path d="M268 118 l6 -12 l-2 9 l7 -2 l-7 12 l2 -9z" fill="${R}"/></g>
    <rect y="184" width="320" height="16" fill="#0B1210"/>`,
}

export const scene = (id) => `<svg class="scene-svg" viewBox="0 0 320 200" role="img" aria-hidden="true">${SCENES[id]}</svg>`
