(function(root){
'use strict';
function paginate(text,limit=80){
const out=[];for(const paragraph of String(text||'').split(/\n\s*\n/).filter(Boolean)){let block='';const sentences=paragraph.match(/[^。！？]+[。！？][”’」』]?|[^。！？]+$/gu)||[paragraph];for(const sentence of sentences){if(block&&block.length+sentence.length>limit){out.push(block);block='';}if(sentence.length>limit){if(block){out.push(block);block='';}for(let i=0;i<sentence.length;i+=limit)out.push(sentence.slice(i,i+limit));}else block+=sentence;}if(block)out.push(block);}return out.length?out:['窗外的潮水正沿泊位换向。'];
}
function model(game,state){
const event=game.event(state),latest=state.log.find(l=>l.kind!=='world'),scene=event||state.ending||latest||{title:'推开听潮舟的窗',body:'舟已泊稳。你可以去岸上接委托，也可以先在舟里修炼。'};
const person=(event?event.person:state.ended?state.ending?.person:latest?.person)||null;
const context=event||(state.ended?state.ending:state.lastChoice||game.atlas.context(state));
const bg=game.atlas.locations.find(n=>n.name===context?.location)?.bg||context?.background||scene.background||'market';
const pages=[];if(state.lastChoice&&(event||state.ended)){for(const text of paginate(state.lastChoice.body))pages.push({text,label:'刚才的选择',title:state.lastChoice.title});}for(const text of paginate(scene.body))pages.push({text,label:person?game.people.find(p=>p.id===person)?.name:'旁白',title:scene.title});
const key=JSON.stringify([state.pending,state.turn,game.year(state),state.ended,scene.title,scene.body,state.lastChoice?.body]);
return {key,title:scene.title,bg,person,night:(scene.art||(!event?state.lastChoice?.art:null))==='evening',pages,event,location:context?.location||(state.pending==='intro'?'月荷旧湖':null)||game.atlas.context(state)?.location||game.places[state.place],date:game.date(state),ended:state.ended,year:game.year(state)};
}
function mount({game,getState,assets,scenery,arrival,onChoose,onSelect,onCommand}){
const uiKey='duyuexing.screen-mode.v1';let enabled=true;try{enabled=localStorage.getItem(uiKey)!=='paper';}catch{}
const stage=document.createElement('section');stage.className='screen-stage';stage.setAttribute('aria-label','全屏剧情演出');
stage.innerHTML='<img class="screen-backdrop" alt=""><video class="screen-video" muted loop playsinline preload="none" aria-label="当前地点的动态风景"></video><figure class="screen-person" hidden><img alt=""></figure><header class="screen-top"><span class="screen-brand">渡月行</span><span class="screen-date"></span><button type="button" data-screen-auto aria-pressed="false">自动推进</button><button class="screen-paper" type="button" data-screen-paper>手札模式</button><button type="button" data-scenery-toggle>暂停风景</button></header><div class="screen-resources"></div><div class="screen-scene"><p></p><button class="plain" type="button" data-screen-arrival style="color:#ffdfaa;min-height:44px">重看乘舟入市</button></div><div class="screen-lower"><section class="screen-dialogue" aria-label="剧情与选择"><div class="screen-who"><h2></h2><small></small></div><div class="screen-text"></div><nav class="screen-choices" aria-label="剧情选项" hidden></nav><div class="screen-turn"><button type="button" data-screen-back>上一段</button><span class="screen-count"></span><button type="button" data-screen-next>继续</button></div></section><nav class="screen-navigation" aria-label="游戏功能"><button type="button" data-screen-panel="actions">行动</button><button type="button" data-screen-panel="map">地图</button><button type="button" data-screen-panel="people">相逢</button><button type="button" data-screen-panel="journal">手札</button><button type="button" data-screen-panel="save">存档</button></nav></div>';
document.body.append(stage);
const drawer=document.createElement('aside');drawer.className='screen-drawer';drawer.hidden=true;drawer.setAttribute('aria-label','游戏功能侧栏');drawer.innerHTML='<header class="screen-drawer-head"><h2></h2><button type="button" data-screen-dismiss>回到画面</button></header><div class="screen-drawer-body"></div>';document.body.append(drawer);
const returnButton=document.createElement('button');returnButton.type='button';returnButton.className='screen-return';returnButton.textContent='回到全屏演出';document.body.append(returnButton);
const q=s=>stage.querySelector(s),b=s=>drawer.querySelector(s);
let current=null,page=0,activePanel=null,openingKey=null,focusBeforePanel=null,automatic=false,autoTimer;
function scheduleAuto(){clearTimeout(autoTimer);if(!automatic||!enabled||!current||activePanel||document.hidden||document.querySelector('dialog[open]')||page>=current.pages.length||current.ended)return;const delay=Math.min(18000,Math.max(6500,3600+current.pages[page].text.length*95));autoTimer=setTimeout(()=>{if(!activePanel&&!document.hidden&&!document.querySelector('dialog[open]'))q('[data-screen-next]').click();},delay);}
const escape=text=>String(text??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function clonePanel(id){const original=document.getElementById(id);if(!original)return '';const copy=original.cloneNode(true);copy.hidden=false;copy.removeAttribute('id');copy.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));copy.querySelectorAll('select').forEach(el=>el.setAttribute('data-screen-recipient',''));return copy.outerHTML;}
function setMode(value){enabled=value;document.body.classList.toggle('screen-mode',value);try{localStorage.setItem(uiKey,value?'screen':'paper');}catch{}if(!value)closePanel();scheduleAuto();scenery.sync();}
function closePanel(){activePanel=null;drawer.hidden=true;stage.inert=false;stage.querySelectorAll('[data-screen-panel]').forEach(el=>el.setAttribute('aria-expanded','false'));focusBeforePanel?.focus();scheduleAuto();scenery.sync();}
function panelHTML(type){
const s=getState();
if(type==='actions')return clonePanel('plot-board')+clonePanel('journey-goal')+clonePanel('action-zone')+(s.pending?'<p>先回到画面回应眼前的剧情，再安排下一旬行动。</p>':'');
if(type==='map')return clonePanel('atlas');
if(type==='people'){const reason=game.available(s,'visit'),letter=game.available(s,'letter');return clonePanel('roster')+clonePanel('person-info')+'<button class="choice" data-action="visit" '+(reason?'disabled':'')+'><span><strong>去见'+escape(game.people.find(p=>p.id===s.selected)?.name)+'</strong><small>'+escape(reason||'过一旬 · 精力 −8')+'</small></span></button><button class="plain" data-action="letter" '+(letter?'disabled':'')+'>写一封信'+(letter?' · '+escape(letter):' · 过一旬')+'</button>';}
if(type==='journal'){return (s.ended?'<h3>'+escape(s.ending.title)+'</h3><p>'+escape(s.ending.body).replace(/\n\n/g,'</p><p>')+'</p>':'')+(s.ended?(document.querySelector('#story .ending-record')?.outerHTML||''):'')+(s.log.length?s.log.map(l=>'<article class="entry"><small>'+escape(l.date)+'</small><h3>'+escape(l.title)+'</h3><p>'+escape(l.body).replace(/\n\n/g,'</p><p>')+'</p></article>').join(''):'<p>这一程刚刚开始。作出选择后，经历会记在这里。</p>')+'<button type="button" data-screen-command="journal">导出手札文本</button>';}
return '<h3>保留这一程</h3><p>进度会自动保存在当前浏览器。换设备或换网址前，先导出可恢复存档。</p><div style="display:grid;gap:12px"><button data-screen-command="save">存下此刻</button><button data-screen-command="export">导出可恢复存档</button><button data-screen-command="import">导入存档</button></div><p>改变名字只会修改称呼，不会重置修行与关系。</p><label>女修姓名<input data-screen-name aria-label="修改女修姓名" maxlength="16" value="'+escape(s.name)+'" style="display:block;min-height:44px;width:100%;font-size:16px;margin:10px 0 20px;padding:8px"></label><details><summary style="min-height:44px;cursor:pointer">重新开始另一条旅程</summary><p>重新开始会覆盖当前进度。请先导出存档。结局记录会保留。</p><button data-screen-command="restart">我已保存，重新开始</button></details>';
}
function refreshPanel(){if(!activePanel)return;b('.screen-drawer-body').innerHTML=panelHTML(activePanel);scenery.sync();}
function openPanel(type){clearTimeout(autoTimer);focusBeforePanel=document.activeElement;activePanel=type;openingKey=current?.key;drawer.hidden=false;stage.inert=true;b('h2').textContent=({actions:'修行与行动',map:'海市与外海',people:'灯火间的相逢',journal:'这一程的手札',save:'存档与设置'})[type];stage.querySelectorAll('[data-screen-panel]').forEach(el=>el.setAttribute('aria-expanded',String(el.dataset.screenPanel===type)));refreshPanel();b('[data-screen-dismiss]').focus();}
function renderPage(){
if(!current)return;const choicePage=page===current.pages.length&&!!current.event;
q('.screen-choices').hidden=!choicePage;q('.screen-text').hidden=choicePage;
const entry=current.pages[Math.min(page,current.pages.length-1)];
q('.screen-who h2').textContent=choicePage?'你想怎么做？':entry.label;
q('.screen-who small').textContent=choicePage?current.title:entry.title;
q('.screen-text').textContent=entry.text;
q('.screen-count').textContent=choicePage?'作出选择':(page+1)+' / '+current.pages.length;
q('[data-screen-back]').disabled=page===0;
const last=page===current.pages.length-1;
q('[data-screen-next]').hidden=choicePage;
q('[data-screen-next]').textContent=last?(current.event?'作出选择':current.ended?(current.year<3?'开启下一年':'查看这一卷结局'):'安排下一旬'):'继续';
if(choicePage){const list=q('.screen-choices');list.replaceChildren();current.event.options.forEach((option,index)=>{const reason=game.choiceReason(getState(),index),button=document.createElement('button');button.className='screen-choice';button.type='button';button.disabled=!!reason;const strong=document.createElement('strong'),small=document.createElement('small');strong.textContent=option.text;small.textContent=reason||option.hint;button.append(strong,small);button.onclick=()=>onChoose(index);list.append(button);});}
scheduleAuto();
}
function sync(){
const next=model(game,getState()),changed=next.key!==current?.key;
if(changed){page=0;if(activePanel&&openingKey!==next.key)closePanel();}
current=next;
q('.screen-date').textContent=next.date;
q('.screen-scene p').textContent=next.location+' · '+next.title;
const s=getState();q('.screen-resources').innerHTML='<span>修为 <b>'+s.xp+'</b></span><span>精力 <b>'+s.energy+'</b></span><span>灵石 <b>'+s.money+'</b></span><span>第 <b>'+next.year+'</b> 年</span>';
const bg=assets.backdrops[next.bg]?next.bg:'market';
if(q('.screen-backdrop').dataset.scene!==bg){q('.screen-backdrop').src=assets.backdrops[bg];q('.screen-backdrop').alt=scenery.describe(bg);q('.screen-backdrop').dataset.scene=bg;scenery.set(q('.screen-video'),bg);}
const person=game.people.find(p=>p.id===next.person);q('.screen-person').hidden=!person;
if(person){const src=(next.night?assets.evenings:assets.portraits)[person.id];if(q('.screen-person img').getAttribute('src')!==src)q('.screen-person img').src=src;q('.screen-person img').alt=person.name+(next.night?'夜约':'日常')+'立绘';}
renderPage();if(activePanel)refreshPanel();scenery.sync();
}
q('[data-screen-next]').onclick=()=>{if(page<current.pages.length-1){page++;renderPage();}else if(current.event){page=current.pages.length;renderPage();}else if(current.ended&&current.year<3)onCommand('continue');else openPanel(current.ended?'journal':'actions');};
q('[data-screen-auto]').onclick=()=>{automatic=!automatic;q('[data-screen-auto]').setAttribute('aria-pressed',String(automatic));q('[data-screen-auto]').textContent=automatic?'停止自动':'自动推进';scheduleAuto();};
document.addEventListener('visibilitychange',scheduleAuto);
q('[data-screen-back]').onclick=()=>{page=Math.max(0,page-1);renderPage();};q('[data-screen-paper]').onclick=()=>setMode(false);returnButton.onclick=()=>{setMode(true);sync();};q('[data-screen-arrival]').onclick=()=>{clearTimeout(autoTimer);arrival.open();scenery.sync();};
document.addEventListener('close',()=>{scheduleAuto();scenery.sync();},true);
stage.querySelectorAll('[data-screen-panel]').forEach(button=>{button.onclick=()=>openPanel(button.dataset.screenPanel);});
b('[data-screen-dismiss]').onclick=closePanel;
drawer.addEventListener('click',event=>{const command=event.target.closest('[data-screen-command]');if(command){const id=command.dataset.screenCommand;if(['restart','continue'].includes(id))closePanel();onCommand(id);return;}const target=event.target.closest('button');if(!target)return;if(target.hasAttribute('data-plot-story'))closePanel();});
drawer.addEventListener('change',event=>{if(event.target.hasAttribute('data-screen-recipient'))onSelect(event.target.value);if(event.target.hasAttribute('data-screen-name'))onCommand('name',event.target.value);});
document.addEventListener('keydown',event=>{if(!enabled||document.querySelector('dialog[open]'))return;if(event.key==='Escape'&&activePanel){event.preventDefault();closePanel();return;}if(activePanel){if(event.key==='Tab'){const controls=Array.from(drawer.querySelectorAll('button:not(:disabled),input,select,summary,[tabindex="0"]')).filter(el=>el.offsetParent!==null);if(controls.length){const first=controls[0],last=controls.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}}return;}if(event.altKey||event.ctrlKey||event.metaKey||event.target.closest?.('button,a,summary,input,select,textarea,[contenteditable="true"],[role="button"],[role="slider"]'))return;if(event.code==='Space'||event.key==='ArrowRight'){event.preventDefault();if(!q('[data-screen-next]').hidden)q('[data-screen-next]').click();}if(event.key==='ArrowLeft'){event.preventDefault();q('[data-screen-back]').click();}});
setMode(enabled);sync();return {sync,openPanel,closePanel,enabled:()=>enabled};
}
const api={paginate,model,mount};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SeaScreen=api;
})(typeof globalThis!=='undefined'?globalThis:this);
