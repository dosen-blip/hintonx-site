// Render controls as SVG so mobile platforms never substitute emoji glyphs.
const paths={
 '↗':'M5 19 19 5M5 5h14v14',
 '↖':'M19 19 5 5M5 19V5h14',
 '↘':'M5 5 19 19M5 19h14V5',
 '→':'M4 12h16m-7-7 7 7-7 7',
 '←':'M20 12H4m7-7-7 7 7 7',
 '↓':'M12 4v16m-7-7 7 7 7-7',
 '↑':'M12 20V4m-7 7 7-7 7 7',
 '×':'m6 6 12 12M6 18 18 6',
 '▶':'m8 5 11 7-11 7Z'
};
export function icon(symbol){
 return `<svg class="site-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="${paths[symbol]}"/></svg>`;
}
export function renderIcons(html){
 // Process text nodes only, leaving attributes, URLs and escaped copy intact.
 return html.split(/(<[^>]*>)/g).map(part=>part.startsWith('<')?part:part.replace(/[↗↖↘→←↓↑×▶]\uFE0F?/gu,symbol=>icon(symbol.replace('\uFE0F','')))).join('');
}
