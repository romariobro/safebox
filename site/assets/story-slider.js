document.querySelectorAll('.founder-slider').forEach(slider=>{
 const tabs=[...slider.querySelectorAll('[role=tab]')];
 const panels=[...slider.querySelectorAll('[role=tabpanel]')];
 let current=0,start=null;
 function show(index,focus=false){
  current=(index+tabs.length)%tabs.length;
  tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===current));tab.tabIndex=i===current?0:-1;panels[i].hidden=i!==current;});
  slider.querySelector('.story-counter').textContent=`0${current+1} / 02`;
  if(focus)tabs[current].focus();
 }
 tabs.forEach((tab,i)=>{
  tab.addEventListener('click',()=>show(i));
  tab.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();show(e.key==='Home'?0:e.key==='End'?1:current+(e.key==='ArrowRight'?1:-1),true);}});
 });
 slider.querySelector('.story-prev').addEventListener('click',()=>show(current-1));
 slider.querySelector('.story-next').addEventListener('click',()=>show(current+1));
 panels.forEach(panel=>{
  panel.addEventListener('touchstart',e=>{start=e.touches.length===1?{x:e.touches[0].clientX,y:e.touches[0].clientY}:null;},{passive:true});
  panel.addEventListener('touchend',e=>{if(!start)return;const dx=e.changedTouches[0].clientX-start.x,dy=e.changedTouches[0].clientY-start.y;if(Math.abs(dx)>70&&Math.abs(dx)>Math.abs(dy)*1.5)show(current+(dx<0?1:-1));start=null;},{passive:true});
 });
});
