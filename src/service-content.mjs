// Service copy builds on home-content.mjs and the documented roles in site-data.mjs.
// Project references stay separate from client facts and the full discipline membership.
export const serviceContent = {
 'product-design': {
  headline:'Make the complex feel intuitive.',
  intro:'We connect user needs, product strategy and interface design to shape digital products people can understand and use.',
  hero:{slug:'social-platform',media:1},
  capabilities:[
   ['Product strategy & discovery','Clarify the problem, the people it affects and the product decisions that matter first.'],
   ['UX research & interaction design','Understand real tasks, map the experience and work through the details of each interaction.'],
   ['Consumer & enterprise interfaces','Bring clear structure and considered visual design to everyday apps and complex platforms.'],
   ['Design systems','Connect components, patterns and guidance so the experience stays coherent as the product grows.']
  ],
  features:[
   {slug:'social-platform',title:'The experience around the live game.',body:'For ToldYa, HintonX connected product strategy and UX design in a social sports-prediction app, carrying the experience through app development and launch.',media:2},
   {slug:'spectrum-management-platform',title:'Research at a national scale.',body:'HintonX supported ISED’s Spectrum Cloud User Trial, using research and product design to evaluate a prototype for modernizing spectrum management.'},
   {slug:'cbsa-connect',title:'Information that moves with the officer.',body:'Experience design for CBSA’s admin portal and mobile app, shaped through iterative testing with border officers and attention to operational needs.',media:0}
  ],
  approachIntro:'Start with the people. Work through the system. Make the details hold together.',
  approach:[['Understand the context','Explore user needs, existing workflows and the constraints the product has to work within.'],['Make the experience tangible','Map flows and prototype the important interactions so ideas can be discussed and tested.'],['Refine for delivery','Use feedback to develop the interface, its patterns and the guidance needed to carry the design forward.']],
  enquiry:'Have a product to shape?',enquiryBody:'Tell us who it is for, what needs to work better and where you are in the process.',cta:'Let’s talk product design'
 },
 'web-development': {
  headline:'Carry the thinking into the build.',
  intro:'We connect design and development, from the first product decisions through implementation and handover.',
  hero:{slug:'1valet',media:0},
  capabilities:[['Product planning','Define the core experience, priorities and scope before moving into implementation.'],['Web & application development','Carry the product experience into websites and applications, connecting interface decisions with the build.'],['E-commerce implementation','Bring brand, content and the buying experience together in a digital storefront.'],['Delivery & product handover','Plan for the transition from building a product to the team that will own and evolve it.']],
  features:[
   {slug:'1valet',title:'From MVP to product ownership.',body:'HintonX delivered 1VALET’s MVP, led product strategy and development, and supported the internal team’s transition to independent product ownership.',media:1},
   {slug:'mobile-app',title:'A product inside the conversation.',body:'Product design and development for 100, an iMessage app that lets friends compare, score and respond to items directly in their conversations.',media:1},
   {slug:'press',title:'The publication meets the storefront.',body:'E-commerce design and implementation for Hinton Press, connecting its publishing identity with the place readers discover and buy the books.'}
  ],
  approachIntro:'Keep the product intent connected to the implementation, all the way through handover.',
  approach:[['Define the first release','Agree on the essential journeys and a scope that gives the build a clear purpose.'],['Design and build together','Work through interface and implementation decisions as parts of the same product.'],['Prepare for ownership','Review the experience and support the transition to the people responsible for its next chapter.']],
  enquiry:'Ready to build what’s next?',enquiryBody:'Bring an idea, a design or an existing product. Tell us what you want to take forward.',cta:'Let’s talk development'
 },
 'ai': {
  headline:'Make intelligence useful.',
  intro:'We design the human side of intelligent systems: understandable information, clear decisions and workflows grounded in real tasks.',
  hero:{slug:'canada-border-services-agency',media:1},
  capabilities:[['AI opportunity exploration','Identify where intelligent assistance could be useful within an existing product or workflow.'],['Human-centred workflows','Shape how people review information, apply their judgment and take the next action.'],['Interaction concepts','Explore how assistance, system feedback and user control fit into the interface.'],['Prototyping & experience design','Make ideas tangible enough to evaluate before committing to a full product experience.']],
  features:[
   {slug:'canada-border-services-agency',title:'Intelligence in the inspection workflow.',body:'As a UX contractor under CBSA, HintonX contributed experience strategy, interface design and design-system work for ELVIS, supporting the integration of machine-learning insights into tools used by border officers.',media:2},
   {slug:'innodata',title:'Clarity across complex research tasks.',body:'In collaboration with Zephus Limited, HintonX worked on Innodata’s Admin Kit, refining UX and product strategy across search, editorial, validation and data-integration workflows.'}
  ],
  approachIntro:'Begin with the task and the person making the decision. Shape the role of intelligent assistance around them.',
  approach:[['Find the useful role','Look at the workflow and identify where assistance could help someone understand information or move a task forward.'],['Make decisions visible','Prototype how information, feedback and user choices appear in the experience.'],['Refine in context','Review the concepts against real tasks and develop the interaction patterns that support the wider product.']],
  enquiry:'Where could intelligence help?',enquiryBody:'Tell us about the workflow, the people using it and the decisions they need to make.',cta:'Let’s talk intelligent experiences'
 },
 'branding': {
  headline:'A point of view, made visible.',
  intro:'We develop identities and design systems that connect what a brand stands for with how it appears in print and on screen.',
  hero:{slug:'press',media:1},
  capabilities:[['Brand strategy & positioning','Clarify the perspective and character that should guide the identity.'],['Visual identity','Develop a coherent visual language through typography, colour, imagery and composition.'],['Editorial & publication design','Give long-form content structure, rhythm and a distinctive presence on the page.'],['Brand applications','Carry the identity across publications, content and digital touchpoints.']],
  features:[{slug:'press',title:'Greatness, from page to screen.',body:'For Hinton Press, the work spans brand, editorial and book design, and e-commerce implementation. A shared visual language connects the sports publications with their digital storefront.',media:3,extraMedia:4}],
  approachIntro:'Establish the point of view, then carry it through the places people encounter the brand.',
  approach:[['Define the character','Start with the story, audience and perspective the identity needs to express.'],['Develop the visual language','Explore type, image and composition together, using real content to shape the direction.'],['Put the identity to work','Apply and refine the system across the publications and digital experiences that need it.']],
  enquiry:'What does your brand stand for?',enquiryBody:'Tell us about the identity, publication or next chapter you have in mind.',cta:'Let’s talk branding'
 },
 'video': {
  headline:'Give the story a moving image.',
  intro:'Documentary, brand stories and product films by Matia Dosen / HintonX. From the first concept to the final frame.',
  hero:{film:0},
  capabilities:[['Concept & visual storytelling','Find the story and shape a visual direction around what the film needs to communicate.'],['Filming & photography','Build the material for the story through considered images and captured moments.'],['Editing & colour','Shape the rhythm, sequence and visual character of the finished piece.'],['Sound & final production','Bring image and sound together and prepare the film for its intended setting.']],
  features:[{film:1,body:'A client film for Adobe, centred on creativity in the public sector.'},{film:2,body:'The official book trailer for The 2024 Tennis Season, bringing a publication into moving image.'}],
  approachIntro:'Find the thread of the story, then shape how it unfolds in image and sound.',
  approach:[['Shape the story','Start with the subject, audience and purpose. Develop the concept and visual direction.'],['Create the material','Plan and capture the images and sound that give the story its form.'],['Build the final film','Bring the material together through editing, colour and sound, refining the pace and preparing the final production.']],
  enquiry:'Have a story to tell?',enquiryBody:'Tell us about the subject, the audience and where the film will be seen.',cta:'Let’s talk film'
 }
};
