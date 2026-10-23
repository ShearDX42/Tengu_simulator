/* ================= 引擎 ================= */
const $ = s => document.querySelector(s);
const KEY = 'tengu_save_v1', KEY_END = 'tengu_end_v1', KEY_SONG = 'tengu_song_v1', KEY_CK = 'tengu_ckpt_v1';
const store = {
  get(k, d){ try{ const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; }catch(e){ return d; } },
  set(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} },
  del(k){ try{ localStorage.removeItem(k); }catch(e){} }
};
let G = null;
const fresh = () => ({
  scene:'birth', yr:1127, lastCh:-1,
  s:{in:15, zai:20, bu:5, bo:35, ima:30, ten:0},
  r:{hei:0, gen:0, fuji:10, ji:5, tei:0},
  f:{}, log:[], back:null
});
const clamp = (v,a,b) => Math.max(a, Math.min(b, v));

function tenguTier(v){
  if(v>=80) return tr('日本国第一之大天狗');
  if(v>=60) return tr('爱宕山太郎坊');
  if(v>=40) return tr('鞍马僧正坊');
  if(v>=20) return tr('山中小天狗');
  return tr('尚是寻常天子');
}

/* ---------- 视图 ---------- */
const VIEWS = ['title','game','ending','people','chron','ends','songs','about'];
function show(v){
  VIEWS.forEach(x => { const el = $('#v-'+x); if(el) el.hidden = (x !== v); });
  document.querySelectorAll('#nav button').forEach(b => b.setAttribute('aria-current', b.dataset.v === v || (v==='ending' && b.dataset.v==='game') ? 'true' : 'false'));
  if(v==='people') renderPeople();
  if(v==='chron') renderChron();
  if(v==='ends') renderEnds();
  if(v==='songs') renderSongs();
  if(v==='about') renderAbout();
  if(v==='title') renderTitle();
  if(v==='game'){ if(!G){ G = store.get(KEY, null); } if(!G){ show('title'); return; } render(); }
  try{ if(v!=='game' && v!=='ending' && v!=='title') history.replaceState(null,'','#'+v); else history.replaceState(null,'',location.pathname+location.search); }catch(e){}
  window.scrollTo({top:0});
}

/* ---------- 文本 ---------- */
function para(t){
  t = tr(t);
  if(t.startsWith('@')){
    const i = t.indexOf('|'); const k = t.slice(1,i); const body = t.slice(i+1).replace(/\*(.+?)\*/g,'<em>$1</em>');
    const d = document.createElement('div'); d.className = 'say' + (k==='me'?' me':'');
    d.innerHTML = `<div class="pt">${castSvg(k)}</div><div class="bub"><div class="nm">${castName(k)}</div><div>${body}</div></div>`;
    return d;
  }
  const p = document.createElement('p');
  let s = t;
  if(s.startsWith('>')){ p.className='speech'; s = s.slice(1); }
  else if(s.startsWith('~')){ p.className='verse'; s = s.slice(1); }
  p.innerHTML = s.replace(/\*(.+?)\*/g,'<em>$1</em>');
  return p;
}
const resolve = (x) => typeof x === 'function' ? x(G) : x;

function setKasane(chIdx){
  const ch = CH[chIdx] || CH[0];
  document.documentElement.style.setProperty('--k1', ch.k[1]);
  document.documentElement.style.setProperty('--k2', ch.k[2]);
}

function curtain(chIdx, then){
  const ch = CH[chIdx]; const c = $('#curtain');
  const bgk = CH_IMG[chIdx];
  c.style.setProperty('--bgimg', bgk ? `url(${IMG[bgk]})` : 'none');
  c.innerHTML = `<div class="cur-in"><div class="kas"><i style="background:${ch.k[1]}"></i><i style="background:${ch.k[2]}"></i></div>
    <div class="no">${tr(ch.no)}</div><h2 style="color:${ch.k[1]}">${tr(ch.name)}</h2><div class="yrs">${tr(ch.yrs)}</div>
    <p class="epi">${tr(ch.epi)}</p><div class="kn">${tr('帖色 · 襲色目')}${q(tr(ch.k[0]))}</div>
    <button class="btn" id="cur-go">${tr('展　卷')}</button>${bgk?`<div class="cur-cap">${tr('图：')}${tr(SCAP[bgk]||'')}</div>`:''}</div>`;
  c.hidden = false;
  const go = () => { c.hidden = true; then && then(); };
  $('#cur-go').onclick = go; $('#cur-go').focus();
}

function render(){
  const sc = SC[G.scene];
  if(!sc){ console.error('missing scene', G.scene); return; }
  if(G.scene.startsWith('end_')) return renderEnding(sc);
  if(sc.yr) G.yr = sc.yr;
  setKasane(sc.ch);
  G.seen = G.seen || [];
  if(!G.seen.includes(sc.ch)){
    G.seen.push(sc.ch); G.lastCh = sc.ch;
    const ck = store.get(KEY_CK, {}); if(!ck[sc.ch]) { ck[sc.ch] = JSON.parse(JSON.stringify(Object.assign({}, G, {back:null}))); store.set(KEY_CK, ck); }
    store.set(KEY, G);
    show('game');
    curtain(sc.ch, () => {});
    return;
  }
  show_game_body(sc);
}

function show_game_body(sc){
  VIEWS.forEach(x => { const el = $('#v-'+x); if(el) el.hidden = (x !== 'game'); });
  const ch = CH[sc.ch];
  $('#sc-ch').textContent = `${tr(ch.no)}${q(tr(ch.name))}`;
  $('#sc-era').textContent = tr(sc.era || '');
  $('#sc-title').textContent = tr(sc.title);
  $('#sc-loc').textContent = tr(sc.loc || '');
  $('#sc-loc').dataset.pre = tr('所');
  $('#sc-plate').innerHTML = SCENE_IMG[sc.id] ? figure(SCENE_IMG[sc.id]) : '';
  $('#sc-cast').innerHTML = (WHO[sc.id]||'').split(' ').filter(Boolean).map(k => `<div class="cm"><div class="f">${castSvg(k)}</div><span>${castName(k)}</span></div>`).join('');
  $('#era').innerHTML = `<b>${tr(ch.no)}·${tr(ch.name)}</b>${tr(sc.era||'')}`;
  const pr = $('#sc-prose'); pr.innerHTML = '';
  let i = 0;
  (sc.text||[]).forEach(t => { const s = resolve(t); if(!s) return; const p = para(s); p.style.animationDelay = (i++*0.08)+'s'; pr.appendChild(p); });
  const note = $('#sc-note');
  if(sc.note){ note.hidden = false; note.open = false; $('#sc-note-b').innerHTML = (Array.isArray(sc.note)?sc.note:[sc.note]).map(n=>`<p>${tr(n)}</p>`).join(''); } else note.hidden = true;
  const box = $('#sc-choices'); box.innerHTML = '';
  const marks = LANG==='en' ? ['I','II','III','IV','V','VI'] : '壹贰叁肆伍陆';
  let n = 0;
  (sc.c||[]).forEach(c => {
    const okv = !c.req || c.req(G);
    if(!okv && !c.need) return;
    const b = document.createElement('button'); b.className='choice'; b.disabled = !okv;
    b.innerHTML = `<span class="t"><span class="k">${marks[n++]||'·'}</span>${tr(c.t)}</span>` +
      (c.h ? `<span class="h">${tr(resolve(c.h))}</span>` : '') +
      (!okv ? `<span class="need">${tr('需：')}${tr(c.need)}</span>` : '');
    b.onclick = () => pick(sc, c);
    box.appendChild(b);
  });
  renderSide();
  window.scrollTo({top:0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto':'smooth'});
}

function pick(sc, c){
  G.back = JSON.stringify(Object.assign({}, G, {back:null}));
  const deltas = [];
  for(const k in (c.e||{})){
    const v = c.e[k];
    if(k in STATS){ const o = G.s[k]; G.s[k] = clamp(o+v,0,100); if(G.s[k]!==o) deltas.push([STATS[k][0], G.s[k]-o]); }
    else if(k in FAC){ const o = G.r[k]; G.r[k] = clamp(o+v,-100,100); if(G.r[k]!==o) deltas.push([FAC[k], G.r[k]-o]); }
  }
  (c.f||[]).forEach(f => G.f[f] = true);
  (c.uf||[]).forEach(f => delete G.f[f]);
  if(c.song){ const sg = store.get(KEY_SONG, []); if(!sg.includes(c.song)){ sg.push(c.song); store.set(KEY_SONG, sg); deltas.push(['今样帖·得新歌', 0]); } }
  G.log.push({era: sc.era, y: sc.yr, t: sc.title, c: c.t});
  let nx = typeof c.go === 'function' ? c.go(G) : c.go;
  if(c.fx) c.fx(G);
  G.scene = nx;
  store.set(KEY, G);
  toast(deltas);
  render();
}

function toast(ds){
  const t = $('#toast'); t.innerHTML = '';
  ds.forEach(([n,v],i) => { const s = document.createElement('span'); s.style.animationDelay = (i*0.07)+'s';
    if(v===0){ s.textContent = tr(n); s.className='up'; } else { s.textContent = `${tr(n)} ${v>0?'+':''}${v}`; s.className = v>0?'up':'dn'; }
    t.appendChild(s); });
  clearTimeout(toast._t); toast._t = setTimeout(()=>{ t.innerHTML=''; }, 3200);
}

function renderSide(){
  const colors = {in:'var(--sumire)', zai:'var(--gold)', bu:'var(--shu)', bo:'var(--moegi)', ima:'#6fb1b8', ten:'#c0392b'};
  $('#stats').innerHTML = Object.keys(STATS).filter(k=>k!=='ten').map(k =>
    `<div class="stat" title="${tr(STATS[k][1])}"><span class="n">${tr(STATS[k][0])}</span><span class="bar" style="--c:${colors[k]}"><i style="width:${G.s[k]}%"></i></span><span class="v">${G.s[k]}</span></div>`).join('');
  $('#facs').innerHTML = Object.keys(FAC).map(k => { const v = G.r[k]; const w = Math.abs(v)/2;
    const st = v>=0 ? `left:50%;width:${w}%;background:var(--moegi)` : `right:50%;width:${w}%;background:var(--shu)`;
    return `<div class="fac" title="${tr(FAC_DESC[k])}"><span class="n">${tr(FAC[k])}</span><span class="fbar"><i style="${st}"></i></span><span class="v" style="text-align:right;font-variant-numeric:tabular-nums;color:var(--dim)">${v>0?'+':''}${v}</span></div>`; }).join('');
  $('#t-val').textContent = G.s.ten;
  $('#t-mask').innerHTML = tenguGauge(G.s.ten);
  $('#t-txt').textContent = tenguTier(G.s.ten);
  $('#mob-sum').textContent = `${tr('院威')} ${G.s.in} · ${tr('天狗')} ${G.s.ten}`;
  const rec = G.log.slice(-4).reverse();
  $('#recent').innerHTML = rec.length ? rec.map(l => `<div><span style="color:var(--gold)">${tr(l.t)}</span>　${tr(l.c)}</div>`).join('') : `<div>${tr('尚无抉择。')}</div>`;
}

/* ---------- 结局 ---------- */
function renderEnding(sc){
  const e = END[sc.end];
  const got = store.get(KEY_END, []); if(!got.includes(e.id)){ got.push(e.id); store.set(KEY_END, got); }
  setKasane(e.ch ?? 8);
  VIEWS.forEach(x => { const el = $('#v-'+x); if(el) el.hidden = (x !== 'ending'); });
  $('#era').innerHTML = `<b>${tr('结局')}</b>${tr(e.name)}`;
  const idx = Object.keys(END).indexOf(e.id)+1;
  $('#ending').innerHTML = `<div class="seal2">${tr('结局')} ${ord(idx)}</div>
    <h2 style="color:var(--k1)">${tr(e.name)}</h2><div class="kind">${tr(e.kind)}</div>
    ${END_IMG[e.id] ? figure(END_IMG[e.id]) : ''}<div class="hero">${e.id==='onryo'?`<div class="f">${imgTag('sutoku2',tr('崇德院'))}</div>`:''}${(ENDCAST[e.id]||'').split(' ').filter(Boolean).map(k=>`<div class="f" title="${castName(k)}">${castSvg(k)}</div>`).join('')}</div>
    <div class="prose">${resolve(e.text).map(t=>resolve(t)).filter(Boolean).map(t => { const el = para(t); el.style.opacity = 1; el.style.animation = 'none'; return el.outerHTML; }).join('')}</div>
    <div class="summary">${Object.keys(STATS).map(k=>`<div>${tr(STATS[k][0])}<b>${G.s[k]}</b></div>`).join('')}${Object.keys(FAC).map(k=>`<div>${tr(FAC[k])}<b>${G.r[k]>0?'+':''}${G.r[k]}</b></div>`).join('')}</div>
    <div class="hist"><b>${tr('史实')}</b><p>${tr(e.hist)}</p></div>
    <div class="btns" style="margin-top:20px">
      ${G.back ? `<button class="btn" id="e-back">${tr('悔此一着')}</button>` : ''}
      <button class="btn solid" id="e-new">${tr('再　始')}</button>
      <button class="btn ghost" id="e-ends">${tr('结局录')}</button>
      <button class="btn ghost" id="e-chron">${tr('此世年表')}</button>
    </div>`;
  const b = $('#e-back'); if(b) b.onclick = () => { G = JSON.parse(G.back); G.back=null; store.set(KEY,G); show('game'); };
  $('#e-new').onclick = () => { G = fresh(); store.set(KEY, G); store.del(KEY_CK); show('game'); };
  $('#e-ends').onclick = () => show('ends');
  $('#e-chron').onclick = () => show('chron');
  store.set(KEY, G);
  window.scrollTo({top:0});
}

/* ---------- 卷首 ---------- */
function renderTitle(){
  $('#title-mask').innerHTML = figure('t_sojo');
  const sv = store.get(KEY, null);
  $('#b-cont').disabled = !sv;
  const ck = store.get(KEY_CK, {});
  $('#chlist').innerHTML = CH.slice(0,9).map((c,i) => `<button class="chip" ${ck[i]?'':'disabled'} data-ck="${i}" style="--a:${c.k[1]};--b:${c.k[2]};text-align:left;border-left:0;border-right:0;border-bottom:0;cursor:${ck[i]?'pointer':'default'};opacity:${ck[i]?1:.55}">
     <span>${tr(c.no)}</span><b>${tr(c.name)}</b><span>${ck[i]?tr('自此帖再始'):tr('未至')}</span></button>`).join('');
  document.querySelectorAll('[data-ck]').forEach(b => b.onclick = () => { const s = store.get(KEY_CK,{})[b.dataset.ck]; if(!s) return; G = s; G.seen = (G.seen||[]).filter(x => x !== +b.dataset.ck); G.log = G.log||[]; store.set(KEY, G); show('game'); });
}

/* ---------- 人物志 ---------- */
const GRPS = [['all','全部'],['imp','皇室·后宫'],['kug','摄关·公卿·院近臣'],['hei','平氏'],['gen','源氏·东国'],['ji','寺社·艺能·奥州']];
let pgrp = 'all';
function pstatus(p){
  if(!G) return null;
  if(p.alt){ const s = p.alt(G); if(s) return ['alt', tr(s)]; }
  if(G.yr < p.b) return ['yet',tr('未生')];
  if(p.d>0 && G.yr > p.d) return ['dead',tr('已殁')];
  if(p.d>0 && G.yr === p.d) return ['dead',tr('是年殁')];
  if(!(p.d>0) && G.yr > 1192) return ['dead',tr('已殁')];
  return ['alive',tr('在世')];
}
function renderPeople(){
  $('#ptabs').innerHTML = GRPS.map(([k,n]) => `<button data-g="${k}" aria-pressed="${pgrp===k}">${tr(n)}（${k==='all'?PEOPLE.length:PEOPLE.filter(p=>p.grp===k).length}）</button>`).join('');
  document.querySelectorAll('#ptabs button').forEach(b => b.onclick = () => { pgrp = b.dataset.g; renderPeople(); });
  if(!G) G = store.get(KEY, null);
  $('#plist').innerHTML = PEOPLE.filter(p => pgrp==='all' || p.grp===pgrp).map(p => {
    const st = pstatus(p);
    const yr = `${p.b<0?'？':p.b}—${p.d>0?p.d:'？'}`;
    return `<div class="pc"><div class="ph">${personSvg(p)}</div><div class="row"><h4>${tr(p.name)}</h4>${st?`<span class="st ${st[0]}">${st[1]}</span>`:''}</div>
      <div class="row"><span class="role">${tr(p.role)}</span><span class="yr">${yr}</span></div><p>${tr(p.bio)}</p></div>`; }).join('');
}

/* ---------- 年表 ---------- */
function renderChron(){
  if(!G) G = store.get(KEY, null);
  const yr = G ? G.yr : 0;
  $('#tl-hist').innerHTML = CHRON.map(e => `<div class="ev ${e.y<=yr?'passed':''}"><div class="y">${e.y}</div><p>${tr(e.t)}</p></div>`).join('');
  $('#tl-mine').innerHTML = (G && G.log.length) ? G.log.map(l => `<div class="ev passed mine"><div class="y">${tr(l.era||'')||l.y}</div><p><b style="color:var(--paper)">${tr(l.t)}</b>——${tr(l.c)}</p></div>`).join('') : `<p style="color:var(--dim)">${tr('尚未始卷。')}</p>`;
}

/* ---------- 结局录 ---------- */
function renderEnds(){
  const got = store.get(KEY_END, []);
  const ids = Object.keys(END);
  $('#end-count').textContent = fmt(tr('已得 {a} / {b}。结局由此世诸般抉择与起居之札共同决定。'), {a:got.length, b:ids.length});
  $('#elist').innerHTML = ids.map((id,i) => { const e = END[id]; const ok = got.includes(id);
    return `<div class="ec ${ok?'':'lock'}"><div class="no">${ord(i+1)}</div><div class="tag">${tr(e.kind)}</div><h4>${ok?tr(e.name):'？？？'}</h4><p>${ok?tr(e.blurb):tr(e.hint)}</p></div>`; }).join('');
}

/* ---------- 今样帖 ---------- */
function renderSongs(){
  const got = store.get(KEY_SONG, []);
  $('#slist').innerHTML = Object.keys(SONGS).map(k => { const s = SONGS[k]; const ok = got.includes(k);
    return `<div class="song ${ok?'':'lock'}"><div class="v">${ok?s.ja:tr('〔未得〕')}</div><div class="tr">${ok?`<p>${tr(s.zh)}</p><p class="c">${tr(s.note)}</p>`:`<p class="c">${tr(s.hint)}</p>`}</div></div>`; }).join('');
}

/* ---------- 卷末 ---------- */
function renderAbout(){
  $('#about').innerHTML = ABOUT();
}

/* ---------- 启动 ---------- */
function boot(){
  initLang();
  musInit();
  document.querySelectorAll('#nav button').forEach(b => b.onclick = () => show(b.dataset.v));
  $('#logo').onclick = () => show('title');
  $('#b-new').onclick = () => { if(store.get(KEY,null)){ $('#newconfirm').hidden = false; return; } startNew(); };
  $('#b-new-yes').onclick = () => { $('#newconfirm').hidden = true; startNew(); };
  $('#b-new-no').onclick = () => { $('#newconfirm').hidden = true; };
  $('#b-cont').onclick = () => { G = store.get(KEY, null); if(G){ G.lastCh = G.lastCh ?? -1; show('game'); } };
  $('#b-people').onclick = () => show('people');
  $('#b-about').onclick = () => show('about');
  $('#mob-toggle').onclick = () => $('#side').classList.toggle('closed');
  $('#b-restart').onclick = () => { $('#rsconfirm').hidden = false; };
  $('#b-rs-no').onclick = () => { $('#rsconfirm').hidden = true; };
  $('#b-rs-yes').onclick = () => { $('#rsconfirm').hidden = true; startNew(); };
  G = store.get(KEY, null);
  const h = (location.hash||'').slice(1);
  show(VIEWS.includes(h) && h!=='ending' ? h : 'title');
}
function startNew(){ G = fresh(); store.del(KEY_CK); store.set(KEY, G); show('game'); }
document.addEventListener('DOMContentLoaded', boot);

/* ---------- 语言切换 ---------- */
function initLang(){
  document.querySelectorAll('[data-t]').forEach(el => el.dataset.zh = el.innerHTML);
  document.querySelectorAll('#lang button').forEach(b => b.onclick = () => setLang(b.dataset.l));
  applyLang();
}
function applyLang(){
  document.documentElement.lang = LANG === 'zh' ? 'zh-Hans' : LANG;
  document.querySelectorAll('[data-t]').forEach(el => { el.innerHTML = tr(el.dataset.zh); });
  document.querySelectorAll('#lang button').forEach(b => b.setAttribute('aria-pressed', b.dataset.l === LANG));
  document.title = LANG === 'en' ? 'Tengu' : '天狗';
  if(MUS.el) musRender();
}
function setLang(l){
  LANG = l; try{ localStorage.setItem('tengu_lang', l); }catch(e){}
  applyLang();
  const cur = VIEWS.find(v => { const el = $('#v-'+v); return el && !el.hidden; }) || 'title';
  const curtainOpen = !$('#curtain').hidden;
  if(cur === 'game' && G){ show_game_body(SC[G.scene]); if(curtainOpen) curtain(SC[G.scene].ch); }
  else if(cur === 'ending' && G){ renderEnding(SC[G.scene]); }
  else show(cur);
}
