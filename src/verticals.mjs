// Curated by HintonX's documented contribution, rather than client industry alone.
export const verticals = [
 {slug:'product-design',service:'product-design',label:'Product Design & UX',title:'Product Design & UX',intro:'Digital products shaped around the people using them.',projects:['social-platform','mobile-app','1valet','innodata','spectrum-management-platform','cbsa-connect','canada-border-services-agency']},
 {slug:'web-development',service:'development',label:'Web & Apps',title:'Web & App Development',intro:'From digital storefronts to connected products, carrying the thinking into the build.',projects:['press','1valet','mobile-app','social-platform']},
 {slug:'ai',service:'generative-ai',label:'AI',title:'AI & Intelligent Experiences',intro:'Making complex systems understandable and useful.',note:'Our role in these projects: UX, interface design and product strategy for AI and data-driven systems.',projects:['canada-border-services-agency','innodata']},
 {slug:'branding',service:'branding',label:'Branding',title:'Branding & Editorial',intro:'A point of view, carried from identity to the printed page and digital storefront.',projects:['press']},
 {slug:'video',service:'video-production',label:'Video',title:'Video Production',intro:'Documentary, brand stories and product films by Matia Dosen / HintonX.',projects:[]}
];
export const verticalHref = v => `/work/${v.slug}/`;
