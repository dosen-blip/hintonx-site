// Add stable section identities to generated pages; content stays in its owning renderer.
const families={home:['Home','Hero|Selected project collection|Studio introduction|Solutions|Services|Featured film|Editorial story|Project invitation'],work:['Work','Work introduction|Full-width project|Paired projects|Editorial feature|Project index|Project invitation'],service:['Service','Hero|Capabilities|Selected work|Approach|Project invitation'],case:['Case study','Hero|Overview|Gallery|Result|Next project'],public:['Public Sector','Hero|Services|Recognition|Client groups|Case studies|Contact'],publiccase:['Public Sector case','Hero|Project and challenge|Gallery|Services and outcome|Neighbouring cases|Contact'],studio:['Studio','Introduction|People|Projects'],contact:['Contact','Contact'],video:['Video','Introduction|Films']};
export function annotatePage(html,path) {
 const cls=html.match(/<body class="([^"]*)"/)?.[1]||'';
 const family=cls==='home'?'home':cls==='work-page'?'work':cls==='vertical-page'?'service':cls==='case-page'?'case':cls==='publicsector-page'?(path==='/publicsector/'?'public':'publiccase'):cls==='studio-page'?'studio':cls==='contact-page'?'contact':cls==='video-page'?'video':null;
 if(!family)return {html};
 if(family==='home')html=html.replace('<div class="wheel-track"','</section><section class="home-band band-black" data-tone="dark"><div class="wheel-track"');
 const [familyLabel,names]=families[family],labels=names.split('|'),slots=[];
 let depth=0,index=0;
 html=html.replace(/<\/?section\b[^>]*>/g,tag=>{
   if(tag.startsWith('</')){depth--;return tag;}
   if(depth++!==0)return tag;
   let i=index++;
   if(family==='case')i=tag.includes('case-opening')?0:tag.includes('case-overview')?1:tag.includes('case-gallery')?2:tag.includes('case-result')?3:4;
   if(family==='publiccase'){if(tag.includes('ps-case-opening'))i=0;else if(tag.includes('ps-gallery-band'))i=2;else if(tag.includes('ps-details'))i=3;else if(tag.includes('ps-contact'))i=5;else if(tag.includes('ps-dark'))i=4;else i=1;}
   const label=labels[i];if(!label)throw Error(`Unknown layout section ${family}/${i}`);
   const kind=i===0?'hero':/gallery/i.test(label)?'gallery':/invitation|contact/i.test(label)?'cta':/projects|work|films|cases|collection/i.test(label)?'projects':'content';
   const key=`${family}-${i}`;slots.push({key,label,kind,order:i});
   return tag.replace('>',` data-layout-slot="${key}" data-layout-kind="${kind}">`);
 });
 const title=html.match(/<title>(.*?)<\/title>/)?.[1].replace(/ — HintonX$/,'')||familyLabel;
 const decodedTitle=title.replaceAll('&amp;','&').replaceAll('&#39;',"'").replaceAll('&quot;','"');
 html=html.replace('</head>','<link rel="stylesheet" href="/layout-preview.css"><script type="module" src="/layout-runtime.js"></script></head>');
 return {html,page:{path,title:decodedTitle,family,familyLabel,slots}};
}
