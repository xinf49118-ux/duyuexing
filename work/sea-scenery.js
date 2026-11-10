// Silent local cinemagraphs. Scenery preferences never alter the game save or clock.
const Scenery=(()=>{
 const key='duyuexing.scenery.motion.v1',reduced=matchMedia('(prefers-reduced-motion:reduce)'),tracked=new Map();
 let wanted=!reduced.matches&&!navigator.connection?.saveData;
 try{const saved=localStorage.getItem(key);if(saved!==null)wanted=saved==='play'&&!reduced.matches;}catch{}
 const captions={lake:'月色照着旧湖，水雾沿荷叶慢慢散开。',market:'旧器与灯影相映，窗外的潮水慢慢换向。',outer:'云根垂入潮水，远山藏在换层的雾里。',bridge:'银色潮路绕过桥面，湖与远海在此相认。',home:'推开舟窗，看云影从小池上走过。',wind:'长风穿过高台，云河从脚下经过。',dock:'灯火从泊位延向外海，水纹一层层推过来。',bay:'回潮入湾，沿水的薄雾掠过石岸。',forge:'阵件映着潮光，校准池里的水纹逐渐合拢。',lantern:'灯摊在水面相望，灵光沿小舟的归路游动。',ruins:'潮流穿过断环，残阵一笔一笔亮起。',mountain:'迁山落脚的水息，绕着石足扩散。',sky:'云海与潮水相接，银色灵流从隙口垂下来。'};
 const background=(context,fallback='market')=>Game.atlas.locations.find(n=>n.name===context?.location)?.bg||context?.background||fallback;
 const describe=bg=>captions[bg]||'云雾沿着海图上的潮路散开。';
 function controls(){
  document.body.dataset.sceneryMotion=wanted?'play':'still';
  document.querySelectorAll('[data-scenery-toggle]').forEach(b=>{b.textContent=wanted?'暂停风景':'播放风景';b.setAttribute('aria-pressed',String(wanted));});
 }
 function step(v,visible){
  if(!visible||document.hidden||v.hidden||document.querySelector('.arrival-dialog[open]')||v.dataset.failed||($('scenery-dialog').open&&!v.closest('#scenery-dialog'))){v.pause();return;}
  if(!v.dataset.bound){
   v.muted=true;v.defaultMuted=true;v.loop=true;v.playsInline=true;
   v.dataset.bound='true';v.src=SceneryFilms[v.dataset.film];
   v.addEventListener('loadeddata',()=>{v.dataset.ready='true';status(v);});
   v.addEventListener('playing',()=>{v.dataset.ready='true';delete v.dataset.blocked;status(v);});
   v.addEventListener('pause',()=>status(v));
   v.addEventListener('timeupdate',()=>status(v));
   v.addEventListener('error',()=>{v.dataset.failed='true';v.dataset.ready='false';v.pause();status(v);});
  }
  if(!wanted){v.pause();status(v);return;}
  const playing=v.play();if(playing)playing.catch(()=>{if(!v.paused)return;v.dataset.blocked='true';status(v);});
 }
 function status(v){
  const note=v.closest('.scenery-view')?.querySelector('[data-scenery-status]');if(!note)return;
  const clock=s=>Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0');
  note.textContent=v.dataset.failed?'画面暂未载入，点击播放重试':v.dataset.blocked?'点击画面中的播放按钮':v.readyState<2?'正在载入风景':(v.paused?'已暂停':'正在播放')+' · '+clock(v.currentTime)+' / '+clock(Number.isFinite(v.duration)?v.duration:8);
 }
 const observer='IntersectionObserver' in window?new IntersectionObserver(entries=>{
  for(const e of entries){tracked.set(e.target,e.isIntersecting);step(e.target,e.isIntersecting);}
 },{threshold:0.08}):null;
 function sync(){
  controls();for(const v of tracked.keys())if(!v.isConnected){v.pause();observer?.unobserve(v);tracked.delete(v);}
  document.querySelectorAll('video[data-film]').forEach(v=>{
   if(!tracked.has(v)){tracked.set(v,false);if(observer)observer.observe(v);else tracked.set(v,true);}
   step(v,tracked.get(v));
  });
 }
 function set(v,bg){
  if(v.dataset.film===bg)return;
  v.pause();v.removeAttribute('src');v.load();delete v.dataset.bound;delete v.dataset.ready;delete v.dataset.failed;
  v.dataset.film=bg;v.poster=Backdrops[bg];
  if(!SceneryFilms[bg])v.hidden=true;else v.hidden=false;
 }
 function film(bg,name,expand=true){
  return '<figure class="scenery-view"><div class="scenery-frame"><img loading="lazy" src="'+Backdrops[bg]+'" alt="'+esc(name)+'的风景"><video data-film="'+bg+'" muted loop playsinline preload="none" poster="'+Backdrops[bg]+'" aria-label="'+esc(name)+'动态风景"></video></div><figcaption><span>'+esc(captions[bg]||'云雾沿着海图上的潮路散开。')+'</span><span class="scenery-buttons"><button class="plain" data-scenery-toggle type="button"></button>'+(expand?'<button class="plain" data-scenery-open="'+bg+'" data-scenery-name="'+esc(name)+'" type="button">展开风景</button>':'')+'</span><small class="scenery-status" data-scenery-status>正在载入风景</small></figcaption></figure>';
 }
 function open(bg,name){
  const d=$('scenery-dialog');$('scenery-title').textContent=name;
  $('scenery-full').innerHTML=film(bg,name,false);const v=d.querySelector('video');v.controls=true;d.showModal();sync();
 }
 function toggle(){wanted=!wanted;if(wanted)for(const v of tracked.keys())if(v.dataset.failed){delete v.dataset.failed;delete v.dataset.bound;v.load();}try{localStorage.setItem(key,wanted?'play':'still');}catch{}sync();}
 document.addEventListener('visibilitychange',sync);
 reduced.addEventListener('change',()=>{if(reduced.matches)wanted=false;sync();});
 $('scenery-dialog').addEventListener('close',()=>{$('scenery-full').innerHTML='';sync();});
 return {sync,set,film,open,toggle,background,describe};
})();
