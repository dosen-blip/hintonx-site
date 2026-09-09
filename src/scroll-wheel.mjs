export const clamp = (n,min,max) => Math.max(min,Math.min(max,n));
export function wheelProgress(scroll,start,travel,steps){return clamp((scroll-start)/Math.max(1,travel),0,1)*steps}
export function cardPose(index,progress,width,mobile=false){
 const offset=index-progress-(mobile?0:.5);
 const angle=offset*(mobile?24:22);
 const radians=angle*Math.PI/180;
 const radius=width*(mobile?1.8:1.27);
 return {x:Math.sin(radians)*radius,y:(1-Math.cos(radians))*radius,angle,near:Math.abs(offset)<2.2,reachable:Math.abs(offset)<(mobile?.55:.85)};
}
export function wheelPosition(index,start,travel,steps){return start+clamp(index,0,steps)/Math.max(1,steps)*travel}
export function fitCardHeight(cardWidth,viewportHeight,sceneWidth,mobile=false){
 const pose=cardPose(0,0,sceneWidth,mobile),angle=Math.abs(pose.angle)*Math.PI/180;
 const available=viewportHeight-(mobile?15:35)-18-pose.y-Math.sin(angle)*cardWidth/2;
 return Math.min(cardWidth*1.15,available*2/(1+Math.cos(angle)));
}
// Time-based damping gives the same response at 60Hz and 120Hz, without overshoot.
export function easeProgress(current,target,elapsed,timeConstant=115){
 return target+(current-target)*Math.exp(-Math.max(0,elapsed)/timeConstant);
}

// Cards settle one header-height lower than the previous card; later cards cover
// imagery while preserving every earlier project name. The scene stays native-scroll driven.
export function stackPose(index,progress,viewportHeight,tabHeight=44){
 const settledY=8+index*tabHeight;
 const phase=index===0?1:clamp(progress-index+1,0,1);
 const y=settledY+(viewportHeight+24-settledY)*(1-phase);
 return {y,height:Math.max(1,viewportHeight-settledY-8),near:y<viewportHeight,reachable:viewportHeight-y>=tabHeight};
}
