export function initWorkFilters(root) {
 if (!root) return;
 const buttons=[...root.querySelectorAll('[data-work-filter]')];
 const cards=[...root.querySelectorAll('[data-work-card]')].map(element=>({element,categories:JSON.parse(element.dataset.categories)}));
 const status=root.querySelector('[data-work-status]');
 for(const button of buttons) button.addEventListener('click',()=>{
  const filter=button.dataset.workFilter;
  buttons.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  let count=0;
  for(const card of cards){card.element.hidden=filter!=='View All'&&!card.categories.includes(filter);if(!card.element.hidden)count++;}
  status.textContent=`${filter}: ${count} ${count===1?'project':'projects'} shown.`;
 });
}
