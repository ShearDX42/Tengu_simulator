/* ================= 乐 · 歌单 ================= */
/* 开源版不附带任何音频。把你有权使用的音频放进 bgm/ 文件夹，再按下例登记即可：
   The open-source edition ships with no audio. Put audio you have the rights to use into bgm/ and list it here:
   {id:'a', src:'bgm/etenraku.mp3', t:'越天乐', from:'雅乐 · 平调'},                                     */
const TRACKS = [
];
const ttl = t => t.id === 'a' ? tr(t.t) : t.t;
const MUS = { el:null, i:0, mode:'all', vol:.55, open:false };
function musLoad(){ try{ const s = JSON.parse(localStorage.getItem('tengu_music')||'{}'); Object.assign(MUS, {i:s.i??0, mode:s.mode||'all', vol:s.vol??.55}); }catch(e){} }
function musSave(){ try{ localStorage.setItem('tengu_music', JSON.stringify({i:MUS.i, mode:MUS.mode, vol:MUS.vol})); }catch(e){} }
const fmtT = s => isFinite(s) ? `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}` : '–:––';
function musSet(i, play){
  MUS.i = (i + TRACKS.length) % TRACKS.length;
  MUS.el.src = TRACKS[MUS.i].src;
  musSave(); musRender();
  if(play) MUS.el.play().catch(()=>{});
}
function musNext(auto){
  if(MUS.mode === 'one' && auto){ MUS.el.currentTime = 0; MUS.el.play().catch(()=>{}); return; }
  if(MUS.mode === 'shuffle'){ let j; do{ j = Math.floor(Math.random()*TRACKS.length); }while(TRACKS.length>1 && j===MUS.i); musSet(j, true); return; }
  musSet(MUS.i + 1, true);
}
function musToggle(){ if(MUS.el.paused) MUS.el.play().catch(()=>{}); else MUS.el.pause(); }
function musRender(){
  const playing = MUS.el && !MUS.el.paused;
  const tr0 = TRACKS[MUS.i];
  $('#mus-btn').setAttribute('aria-pressed', playing);
  $('#mus-btn').innerHTML = `<span class="mi">${playing?'❚❚':'♪'}</span><span class="ml">${playing ? ttl(tr0) : tr('乐')}</span>`;
  const p = $('#mus-panel'); if(!p) return;
  p.hidden = !MUS.open;
  if(!MUS.open) return;
  const modes = [['all',tr('顺序')],['shuffle',tr('随机')],['one',tr('单曲')]];
  p.innerHTML = `<div class="mp-now"><div><b>${ttl(tr0)}</b><small>${tr(tr0.from)}</small></div>
      <div class="mp-ctl"><button id="mp-prev" aria-label="${tr('上一曲')}">⏮</button><button id="mp-play" class="big" aria-label="${playing?tr('暂停'):tr('播放')}">${playing?'❚❚':'▶'}</button><button id="mp-next" aria-label="${tr('下一曲')}">⏭</button></div></div>
    <div class="mp-bar"><span id="mp-cur">${fmtT(MUS.el.currentTime)}</span><input type="range" id="mp-seek" min="0" max="1000" value="${MUS.el.duration ? MUS.el.currentTime/MUS.el.duration*1000 : 0}" aria-label="${tr('进度')}"><span id="mp-dur">${fmtT(MUS.el.duration)}</span></div>
    <div class="mp-opt"><div class="mp-modes">${modes.map(([k,n])=>`<button data-m="${k}" aria-pressed="${MUS.mode===k}">${n}</button>`).join('')}</div>
      <label class="mp-vol">${tr('音量')}<input type="range" id="mp-vol" min="0" max="100" value="${Math.round(MUS.vol*100)}"></label></div>
    <ol class="mp-list">${TRACKS.map((t,i)=>`<li><button data-i="${i}" aria-current="${i===MUS.i}"><span class="n">${i+1}</span><span class="tt">${ttl(t)}<small>${tr(t.from)}</small></span>${i===MUS.i&&playing?'<span class="eq">♪</span>':''}</button></li>`).join('')}</ol>`;
  $('#mp-prev').onclick = () => musSet(MUS.i - 1, true);
  $('#mp-next').onclick = () => musNext(false);
  $('#mp-play').onclick = musToggle;
  $('#mp-seek').oninput = e => { if(MUS.el.duration) MUS.el.currentTime = e.target.value/1000*MUS.el.duration; };
  $('#mp-vol').oninput = e => { MUS.vol = e.target.value/100; MUS.el.volume = MUS.vol; musSave(); };
  p.querySelectorAll('[data-m]').forEach(b => b.onclick = () => { MUS.mode = b.dataset.m; musSave(); musRender(); });
  p.querySelectorAll('[data-i]').forEach(b => b.onclick = () => musSet(+b.dataset.i, true));
}
function musInit(){
  if(!TRACKS.length){ const b = $('#mus-btn'); if(b) b.hidden = true; return; }
  musLoad();
  MUS.el = new Audio(); MUS.el.preload = 'none'; MUS.el.volume = MUS.vol;
  MUS.el.src = TRACKS[MUS.i] ? TRACKS[MUS.i].src : TRACKS[0].src;
  MUS.el.addEventListener('ended', () => musNext(true));
  ['play','pause','loadedmetadata'].forEach(ev => MUS.el.addEventListener(ev, musRender));
  MUS.el.addEventListener('timeupdate', () => { const c = $('#mp-cur'), s = $('#mp-seek'); if(c && MUS.open){ c.textContent = fmtT(MUS.el.currentTime); if(MUS.el.duration && document.activeElement !== s) s.value = MUS.el.currentTime/MUS.el.duration*1000; } });
  MUS.el.addEventListener('error', () => { const b = $('#mus-btn'); if(b) b.title = tr('乐曲文件未找到：请将 bgm 文件夹与 index.html 放在一起。'); });
  $('#mus-btn').onclick = (e) => { if(MUS.el.paused && !MUS.open){ MUS.el.play().catch(()=>{}); } MUS.open = !MUS.open; musRender(); e.stopPropagation(); };
  document.addEventListener('click', e => { if(MUS.open && !e.target.closest('#mus-panel') && !e.target.closest('#mus-btn')){ MUS.open = false; musRender(); } });
  musRender();
}
