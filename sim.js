const fs=require('fs');const vm=require('vm');
const src=fs.readFileSync('all.js','utf8').replace("document.addEventListener('DOMContentLoaded', boot);","");
const ctx={console,localStorage:{getItem(){return null},setItem(){},removeItem(){}},document:{},window:{},location:{hash:''},history:{},matchMedia:()=>({matches:false})};
vm.createContext(ctx);vm.runInContext(src+';this.SC=SC;this.END=END;this.fresh=fresh;this.clamp=clamp;this.STATS=STATS;this.FAC=FAC;',ctx);
const {SC,END,fresh,STATS,FAC}=ctx;
const ends={},seen=new Set(),bad=new Set();
for(let i=0;i<20000;i++){
 const G=fresh();let steps=0;
 while(steps++<200){
  const sc=SC[G.scene]; if(!sc){bad.add(G.scene);break;}
  seen.add(G.scene);
  if(G.scene.startsWith('end_')){ends[G.scene]=(ends[G.scene]||0)+1;break;}
  if(sc.yr)G.yr=sc.yr;
  // eval text funcs
  (sc.text||[]).forEach(t=>{if(typeof t==='function')t(G)});
  const av=(sc.c||[]).filter(c=>!c.req||c.req(G));
  if(!av.length){bad.add('nochoice:'+G.scene);break;}
  const c=av[Math.floor(Math.random()*av.length)];
  for(const k in c.e||{}){if(k in STATS)G.s[k]=Math.max(0,Math.min(100,G.s[k]+c.e[k]));else if(k in FAC)G.r[k]=Math.max(-100,Math.min(100,G.r[k]+c.e[k]));else bad.add('key:'+k);}
  (c.f||[]).forEach(f=>G.f[f]=true);
  const nx=typeof c.go==='function'?c.go(G):c.go; if(c.fx)c.fx(G); G.scene=nx;
 }
}
console.log(ends);console.log('bad',[...bad]);
console.log('unreached',Object.keys(SC).filter(k=>!seen.has(k)));
