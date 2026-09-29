import {projects, videoProjects, solutions} from './site-data.mjs';
import {publicSectorCases, publicSectorHref} from './publicsector-content.mjs';

export const workFilters = ['View All', 'UX Design', 'Mobile Apps', 'Web Applications', 'AI Acceleration', 'Videography', 'Web design'];
const categories = {
 'government-of-alberta-atlas':['UX Design','Web Applications','AI Acceleration'],
 'innodata':['UX Design','Web Applications'],
 'social-platform':['UX Design','Mobile Apps'],
 'mobile-app':['UX Design','Mobile Apps'],
 '1valet':['UX Design','Mobile Apps','Web Applications'],
 'press':['Web design'],
 'spectrum-management-platform':['UX Design','Web Applications'],
 'cbsa-connect':['UX Design','Mobile Apps','Web Applications'],
 'canada-border-services-agency':['UX Design','Web Applications','AI Acceleration'],
 'osfi-oasis':['UX Design','Web Applications'],
 'ised-spectrum-cloud':['UX Design','Web Applications'],
 'cbsa-traveller-modernization':['UX Design','Mobile Apps','Web Applications'],
 'federal-judicial-affairs-phoenix':['UX Design','Web Applications','Web design'],
 'cbsa-import-information':['UX Design','Web design'],
};
const featureCopy = new Map(solutions[0].featuredProjects.map(feature => [feature.slug,feature]));
const order = ['government-of-alberta-atlas','innodata','social-platform','mobile-app','1valet','press','spectrum-management-platform','cbsa-connect','canada-border-services-agency'];
export const workCards = [
 ...order.map(slug => {
  const project = projects.find(item => item.slug === slug), feature = featureCopy.get(slug);
  return {id:slug,href:`/projects/${slug}/`,client:project.shortClient||project.client,
   title:feature ? feature.heading.join(' ') : project.tagline,
   description:slug==='mobile-app' ? 'A personal survey app that turns an iMessage conversation into quick feedback from friends.' : feature?.description || project.description,
   category:slug==='mobile-app' ? 'Consumer / iOS' : project.title,
   image:{src:project.thumbnail,alt:project.alt},categories:categories[slug]};
 }),
 ...publicSectorCases.filter(story=>!projects.some(project=>project.slug===story.slug)).map(story=>({
  id:story.slug,href:publicSectorHref(story),client:story.shortClient,title:story.title,
  description:story.summary,category:'Public sector',image:story.hero,categories:categories[story.slug]
 })),
 ...videoProjects.map((film,index)=>({id:`film-${index}`,href:`https://www.youtube.com/watch?v=${film.src.match(/vi_webp\/([^/]+)/)[1]}`,filmId:film.src.match(/vi_webp\/([^/]+)/)[1],client:film.title,title:film.title,description:film.subtitle,category:'Videography',image:{src:film.src,alt:`${film.title} — film still`},categories:['Videography']})),
];
