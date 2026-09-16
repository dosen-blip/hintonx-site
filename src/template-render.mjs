import {homeBody} from './home-render.mjs';
import {workBody} from './work-render.mjs';
import {verticalBody} from './vertical-render.mjs';
import {caseBody} from './case-render.mjs';
import {publicSectorBody, publicSectorCaseBody} from './publicsector-render.mjs';
import {projects} from './site-data.mjs';
import {verticals} from './verticals.mjs';
import {publicSectorCases} from './publicsector-content.mjs';
import {icon} from './icons.mjs';
import {videoBackgroundControls} from './video-background.mjs';

const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// Read the outer section boundaries in our trusted renderer output. Track depth
// so a nested section stays with its parent. No page markup is copied here.
export function sectionsFrom(html) {
  const sections = [];
  let depth = 0, start = 0;
  for (const match of html.matchAll(/<\/?section\b[^>]*>/g)) {
    if (match[0].startsWith('</')) {
      if (--depth === 0) sections.push(html.slice(start, match.index + match[0].length));
    } else if (depth++ === 0) start = match.index;
  }
  if (depth !== 0) throw new Error('Unbalanced template source sections');
  return sections;
}

export function templateContainers({studio, contact, video}) {
  const items = [];
  function group(prefix, label, className, html, names) {
    // Namespace references together, including links between sibling sections.
    const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
    html = html.replace(/\b(id|aria-labelledby|aria-describedby|aria-controls|for)="([^"]+)"/g,
      (_, attr, value) => `${attr}="${value.split(' ').map(id => ids.has(id) ? `${prefix}-${id}` : id).join(' ')}"`)
      .replace(/href="#([^"]+)"/g, (_, id) => `href="#${ids.has(id) ? `${prefix}-${id}` : 'template-top'}"`)
      .replace(/<h1\b/g, '<h1 role="heading" aria-level="2"');
    const sections = sectionsFrom(html);
    if (sections.length !== names.length) throw new Error(`${label}: update container inventory (${sections.length} sections, ${names.length} labels)`);
    sections.forEach((body, index) => {
      if (names[index]) items.push({id: `${prefix}-${index}`, label: names[index], group: label, className, body});
    });
  }
  // Home originally groups the hero and wheel in one section. Split only this
  // preview at the wheel boundary so Hero can be selected independently.
  const home = homeBody().replace('<div class="wheel-track"', '</section><section class="home-band band-black"><div class="wheel-track"');
  group('home', 'Home', 'home', home, ['Hero', 'Selected project collection', 'Studio introduction and clients', 'Solutions accordion', 'Services accordion', 'Featured film', 'Featured editorial story', 'Project invitation']);
  group('work', 'Work', 'work-page', workBody(), ['Work introduction and discipline navigation', 'Full-width project feature', 'Paired projects', 'Editorial feature', 'Project index', 'Work invitation']);
  const service = slug => verticalBody(verticals.find(v => v.slug === slug));
  group('service', 'Services', 'vertical-page service-page', service('product-design'), ['Service hero', 'Capabilities', 'Selected service work and related projects', 'Approach', 'Service enquiry']);
  group('branding', 'Services', 'vertical-page service-page', service('branding'), [null, null, 'Editorial service feature', null, null]);
  group('film', 'Services', 'vertical-page service-page', service('video'), ['Film service hero', null, 'Selected films and film grid', null, null]);
  const project = slug => projects.find(p => p.slug === slug);
  group('case', 'Case studies', 'case-page case-study', caseBody(project('1valet')), ['Case study hero', 'Overview and project facts', 'Project gallery', 'Result', 'Next project']);
  group('editorial', 'Case studies', 'case-page case-study case-editorial', caseBody(project('press')), [null, null, 'Editorial gallery', null, null]);
  const compact = projects.find(p => p.media.length === 1);
  group('compact', 'Case studies', 'case-page case-study', caseBody(compact), [null, null, 'Compact result', null]);
  group('public', 'Public Sector', 'publicsector-page ps-page', publicSectorBody(), ['Public Sector hero', 'Public Sector services', 'Recognition', 'Client groups', 'Case study cards', 'Public Sector contact']);
  // The existing optional gallery renderer uses a labelled placeholder until
  // approved imagery arrives, just like the live Public Sector scaffolds.
  const story = publicSectorCases.find(s => s.slug === 'ised-spectrum-cloud');
  group('public-case', 'Public Sector', 'publicsector-page ps-page', publicSectorCaseBody({...story, images: [null]}), ['Public Sector case hero and breadcrumbs', 'Challenge and work', 'Public Sector gallery', 'Services and outcome', 'Previous and next case', null]);
  group('studio', 'Studio', 'studio-page', studio, ['Studio introduction', 'People and biography', 'Studio project strip']);
  group('contact', 'Contact', 'contact-page', contact, ['Contact information']);
  group('video', 'Video', 'video-page', video, ['Video introduction', 'Video thumbnail grid']);
  return items;
}

export function templateBody(sources) {
  const items = templateContainers(sources);
  const option = (id, label, locked = false) => `<label class="template-option"><input type="checkbox" value="${id}" checked${locked ? ' disabled' : ` aria-controls="container-${id}"`}><span>${esc(label)}</span>${locked ? '<small>Required</small>' : ''}</label>`;
  const groups = [...new Set(items.map(item => item.group))];
  const toolbar = `<aside class="template-toolbar" aria-label="Page layout controls"><span>Template preview</span>${videoBackgroundControls()}<details class="template-picker"><summary>Containers ${icon('↓')}</summary><div class="template-menu"><p>Select the sections to preview.</p>${option('navigation', 'Navigation', true)}${groups.map(group => `<fieldset><legend>${esc(group)}</legend>${items.filter(item => item.group === group).map(item => option(item.id, item.label)).join('')}</fieldset>`).join('')}${option('footer', 'Footer', true)}</div></details><span class="template-sr" role="status" aria-live="polite" data-template-status></span></aside>`;
  const body = `<div id="template-top" class="template-sr"><h1>Page layout preview</h1></div>${items.map(item => `<div id="container-${item.id}" class="template-container ${item.className}" data-template-container="${item.id}" aria-label="${esc(item.label)}">${item.body}</div>`).join('')}
    <dialog class="template-player" aria-label="Film player"><div><span data-template-film-title>Film</span><button type="button" data-template-close>Close ${icon('×')}</button></div><div data-template-player></div><a data-template-external href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">Watch on YouTube ${icon('↗')}</a></dialog>`;
  return {toolbar, body};
}
