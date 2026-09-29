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

// Two-line editorial breaks keep card titles readable without truncation.
const titleLines = {
 'government-of-alberta-atlas':['Accelerating delivery.','Putting people first.'],
 'innodata':['Complex workflows.','Clearer experiences.'],
 'social-platform':['Real-time Sports','Prediction'],
 'mobile-app':['A conversation.','More possibilities.'],
 '1valet':['A better way','to come home.'],
 'press':['A Global Publisher','of Sports Excellence'],
 'spectrum-management-platform':['A national platform.','A clearer experience.'],
 'cbsa-connect':['Admin Portal','+ Mobile App'],
 'canada-border-services-agency':['Enhancing Border Intelligence','with Machine Learning'],
 'osfi-oasis':['OASIS Operational Actuarial','System Integrated Services'],
 'ised-spectrum-cloud':['Spectrum Cloud and','Pulsar Data Platforms'],
 'cbsa-traveller-modernization':['Traveller Modernization','and Digital Traveller Products'],
 'federal-judicial-affairs-phoenix':['Phoenix Web Application','and Online Services Portal'],
 'cbsa-import-information':['Commercial Architecture','and Import Information'],
 'film-0':['The','Legend'],
 'film-1':['Creativity in','Public Sector'],
 'film-2':['The 2024','Tennis Season'],
 'film-3':['Adobe and','Service Canada'],
 'film-4':['Novak','Djokovic'],
 'film-6':['100','Mobile'],
};
for (const card of workCards) card.titleLines = titleLines[card.id] || [card.title];
