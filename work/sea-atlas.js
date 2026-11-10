(function(root){
'use strict';
const C=typeof module!=='undefined'&&module.exports?require('./sea-content.js'):root.SeaContent;
const X=typeof module!=='undefined'&&module.exports?require('./sea-expedition.js'):root.SeaExpedition;
const L=typeof module!=='undefined'&&module.exports?require('./sea-living.js'):root.SeaLiving,o=C.option;
const W=typeof module!=='undefined'&&module.exports?require('./sea-world.js'):root.SeaWorld;
const P=typeof module!=='undefined'&&module.exports?require('./sea-plot.js'):root.SeaPlot;
const E=typeof module!=='undefined'&&module.exports?require('./sea-ending-paths.js'):root.SeaEndingPaths;
const ports=['dock','shop','bay'];
const locations=[
 {id:'lake',name:'月荷旧湖',region:'来处',at:0,x:20,y:15,bg:'lake',cost:8,activity:'取一囊月荷水',energy:8,description:'你修行两百年的湖。荷叶还认得旧水息，人身可以带回新的见闻。'},
 {id:'wind',name:'听风台',region:'海市',at:1,x:50,y:15,bg:"wind",cost:10,activity:'测一轮高处的风',energy:10,description:'潮师将风与潮分开记录的高台。云上的路，要先在这里听清。'},
 {id:'cloud',name:'云根林',region:'外海',at:2,x:80,y:15,bg:'outer',cost:16,activity:'听云根换一次气',energy:12,description:'根须从云上垂入海中，整片森林借潮呼吸。抵达以后，还能回来细看。'},
 {id:'shop',name:'照雪斋',region:'海市',port:1,at:1,x:20,y:37,bg:'market',description:'鉴物铺与旧器交易的灯下街区。旧阵残片也能在这里认回原来的笔路。'},
 {id:'dock',name:'云津浮桥',region:'海市',port:0,at:0,x:50,y:37,bg:"dock",description:'海市的中心泊位。渡船、潮记和各地的来信在这里交会。'},
 {id:'bay',name:'回潮湾',region:'海市',port:2,at:2,x:80,y:37,bg:"bay",description:'洞天客路与行记师的小船常在雾中靠岸。潮门的旧水在湾底留下痕迹。'},
 {id:'forge',name:'鸣潮坊',region:'海市',at:1,x:20,y:59,bg:"forge",cost:8,activity:'亲手校准舟上的阵件',energy:10,description:'用潮声检查船阵的工坊。舟要修到能走远路，也要认得自己的水。'},
 {id:'market',name:'万灯集',region:'海市',at:0,x:50,y:59,bg:"lantern",cost:8,activity:'逛一轮换潮的灯摊',energy:6,description:'灯摊与流动渡口。每一轮潮，摊位和小船都会换一个方向。'},
 {id:'ruins',name:'潮门旧址',region:'旧潮域',at:2,x:80,y:59,bg:"ruins",cost:12,activity:'复核旧潮门的归路',energy:14,description:'旧门环已经断开，水却还记得原来的走法。这里藏着通回旧湖的另一段路。'},
 {id:'mountain',name:'行山渡',region:'外海',at:2,x:20,y:81,bg:"mountain",cost:16,activity:'追记迁山的一次落脚',energy:12,description:'会迁徙的山在海上换脚。航图记的是潮息，山的真正去处仍在变化。'},
 {id:'bridge',name:'不归桥',region:'海市',at:0,x:50,y:81,bg:'bridge',cost:8,description:'停云正在重写的新桥。旧水如何认人、过客能去哪里，都会留在这里。'},
 {id:'sky',name:'云潮隙',region:'远海',at:2,x:80,y:81,bg:"sky",cost:18,activity:'留下一页云潮交会图',energy:12,description:'云与海接在一起的隙口。第三年的云潮航路完成后，可以亲自重访。'}
];
const get=id=>locations.find(n=>n.id===id);
const here=s=>s.flags.atlas_stop||ports[s.place];
const edges=[['lake','dock'],['dock','shop'],['dock','bay'],['dock','market'],['dock','bridge'],['shop','wind'],['shop','forge'],['forge','market'],['bay','ruins'],['bay','mountain'],['bridge','bay'],['wind','cloud'],['cloud','mountain'],['cloud','sky']];
function links(s){const list=s.flags.atlas_gate_open?[...edges,['ruins','lake']]:[...edges];if(s.flags.coda_finished){if(E.mode(s))list.push(...E.edges[E.mode(s)]);else list.push(['ruins',s.flags.coda_release?'cloud':s.flags.coda_harbor?'dock':'wind']);}return list.filter((edge,i)=>list.findIndex(e=>[...e].sort().join(':')===[...edge].sort().join(':'))===i);}
function description(s,id){const n=get(id);if(id!=='ruins'||!s.flags.coda_finished)return n?.description||'';if(E.mode(s))return E.description(s);return s.flags.coda_release?'借岸已退潮，真实的水接向云根林。旧址新增一条云根短路，旧泊位仍要按当旬潮息重认。':s.flags.coda_harbor?'众舟泊地接在断环外，真实的小舟按季值灯。接驳已连到云津，养护也留在值守册里。':'潮窗与客路已经分开。旧影可自选停下来看，测风水线接向听风台，来往船不再被旧归期牵回。';}
function unlocked(s,id){if(id==='cloud')return X.phase(s)>=2?'':'先走过外海航路的云根一段，再重访云根林';if(id==='mountain')return X.phase(s)===3?'':'先完成三段外海航路，亲自追上迁山';if(id==='sky')return s.flags.future_sky&&s.flags.future_arrive?'':'第三年选择云潮航向，并完成这条主线后开放';if(id==='ruins')return s.realm&&s.ship>=1?'':'先凝成道基，并将灵舟修到第一重阵';if(id==='bridge')return s.npcs.array.met&&s.npcs.array.stage>=2?'':'先与停云相处到熟悉，再走进新桥的故事';return '';}
function route(s,to){const start=here(s),queue=[[start]],seen=new Set([start]);while(queue.length){const p=queue.shift(),end=p.at(-1);if(end===to)return p;for(const pair of links(s)){const n=pair[0]===end?pair[1]:pair[1]===end?pair[0]:null;if(n&&!seen.has(n)&&!unlocked(s,n)){seen.add(n);queue.push([...p,n]);}}}return [];}
const chartBonus=s=>(s.flags.atlas_trade_route?1:0)+(s.flags.atlas_wind_chart?1:0);
const energy=(s,base)=>Math.max(0,base-chartBonus(s)+W.travel(s)-P.travelBonus(s));
function cost(s,id){const n=get(id);if(!n)return 0;if(n.port!==undefined)return energy(s,L.energy(s,'travel',10));const r=route(s,id);return energy(s,L.energy(s,'travel',Math.min(22,n.cost+Math.max(0,r.length-2)*2)));}
function visited(s,id){if(s.flags['atlas_visit_'+id]||here(s)===id)return true;if(id==='lake'||id==='dock')return !!s.flags.prologue_done;if(id==='shop')return s.npcs.sword.met||s.npcs.brother.met;if(id==='bay')return s.npcs.father.met||s.npcs.demon.met;if(id==='bridge')return !!s.flags.bridge_name;if(id==='cloud')return X.phase(s)>=2;if(id==='mountain')return X.phase(s)===3;if(id==='sky')return !!(s.flags.future_sky&&s.flags.future_arrive);return false;}
function status(s,id){if(here(s)===id)return '你在这里';if(unlocked(s,id))return '航路未通';if(id==='bridge'){return L.nodes(s)[0].change;}if(s.flags['atlas_site_'+id])return id==='ruins'&&s.flags.atlas_gate_open?'回湖捷径已接通':'当地见闻已记下';return visited(s,id)?'已抵达 · 可重访':'可抵达 · 待探索';}
function people(s,id){if(id==='bridge'&&L.phase(s)>0&&L.phase(s)<3&&s.npcs.array.place==='云津浮桥')return [C.people.find(p=>p.id==='array')];return [];}
function nearby(s,id){const n=get(id);if(n.port!==undefined)return C.people.filter(p=>s.npcs[p.id].place===['云津浮桥','照雪斋','回潮湾'][n.port]);return people(s,id);}
function at(s,port){return s.place===port&&(!s.flags.atlas_stop||s.flags.atlas_stop==='bridge'&&port===0);}
function canMeet(s,id){return !s.flags.atlas_stop||s.flags.atlas_stop==='bridge'&&id==='array'&&s.npcs[id].place==='云津浮桥';}
function questGate(s,id){if(!s.flags.atlas_stop)return '';const atPort={project:0,trial:0,trace:0,archive:1,shoal:2};if(Object.hasOwn(atPort,id)&&!at(s,atPort[id]))return '先移舟到'+['云津浮桥','照雪斋','回潮湾'][atPort[id]]+'，再继续这段调查';return '';}
function gate(s,id){const [kind,...rest]=id.split('_'),site=rest.join('_'),n=get(site);if(!n)return '没有这条航路';const blocked=unlocked(s,site);if(blocked)return blocked;if(kind==='map'){if(here(s)===site)return '已经在这里';if(!route(s,site).length)return '这条航路尚未接通';if(s.energy<cost(s,site))return '精力不足，先回舟歇息';return '';}if(kind==='site'){if(here(s)!==site)return '先按航图抵达'+n.name;if(s.flags['atlas_site_'+site])return '这一处见闻已记下，可以继续其他航路';if(!n.activity)return '这里的事从人物与当地剧情展开';if(s.energy<n.energy)return '精力不足，先回舟歇息';return '';}return '未知航图行动';}
const actions=locations.filter(n=>n.port===undefined).flatMap(n=>[{id:'map_'+n.id,title:'移舟到'+n.name,atlas:true},...(n.activity?[{id:'site_'+n.id,title:n.activity,energy:n.energy,atlas:true}]:[])]);
function beforeAction(s,id){const n=get(id.slice(id.indexOf('_')+1));if(id.startsWith('map_')){s.energy-=cost(s,n.id);s.place=n.at;s.flags.atlas_stop=n.id;s.flags['atlas_visit_'+n.id]=true;return ['抵达'+n.name,n.description+'\n\n你将今日的泊位记在自己的航图上。'+(n.id==='mountain'?'山并未停在旧图的落脚处；你沿暖石的水息找到它新留下的脚印。':'可以在这里留一旬，看看当地的事，也可以继续下一段航路。')];}s.queue.push('atlas_site_'+n.id);return ['将这一旬留给'+n.name,'你收好缆绳，带上潮记，亲自去'+n.name+'看一看。'];}
function context(s){const n=s.flags.atlas_stop&&get(s.flags.atlas_stop);return n?{background:n.bg,location:n.name,chapter:'海图见闻 · '+n.name}:null;}
function decorate(s){const c=context(s);if(c&&s.log[0])Object.assign(s.log[0],c);}
const restBonus=s=>(s.flags.atlas_lake_water?4:0)+(s.flags.atlas_lamp?4:0)+(s.flags.atlas_cloud_rain?4:0);
const cultivateBonus=s=>(s.flags.atlas_wind_song?2:0)+(s.flags.atlas_cloud_reed?2:0);
const repairCost=s=>Math.max(25,35-(s.flags.atlas_craft?5:0)-(s.flags.atlas_footstone?3:0)-W.repairBonus(s));
function event(s){if(!s.pending?.startsWith('atlas_site_'))return null;const id=s.pending.slice(11),n=get(id);if(!n?.activity)return null;const base={chapter:'海图见闻 · '+n.name,location:n.name,background:n.bg};
 if(id==='lake')return {...base,title:'湖认得水，却不认得你的舟',body:'听潮舟停在荷叶外。湖里没有码头，你将缆绳系到自己从前藏身的石旁，忽然发现人身的手要多绕半圈。\n\n旧水息迎过来，湖底却多了海上落下的细砂。你带回的东西，也已经开始改变这里。\n\n可以取一囊月荷水慢慢养在舟里，也可以沿新细砂认清一条不必绕桥的回程。',options:[o('带一囊月荷水，留给每日回舟时','回舟歇息额外恢复 4 精力','你没有把整片湖搬进舟里，只取了刚好够养一池的水。离开时，湖岸仍有自己的潮声。',{flag:'atlas_lake_water'}),o('记下新细砂的走向，画一段回湖水路','修为 +12、心境 +4','你沿细砂认到它散开的地方，将湖与海的两种水画在同一页。回程不再只剩来时的一种走法。',{flag:'atlas_lake_chart',xp:12,heart:4})]};
 if(id==='market')return {...base,title:'灯摊随潮挪了半条街',body:'你找到上次见过的灯摊，却发现旧位置只剩一只空木箱。摊主正在浮桥另一头收缆：潮换了，铺子也得走。\n\n一盏防水潮灯放在箱角，旁边压着今日过客船的换泊图。两样都实用，你想先把哪一种带回去？',options:[o('买一盏潮灯，留给听潮舟的夜晚','花费 12 灵石 · 回舟歇息额外恢复 4 精力','潮灯放进舟窗，水珠沿罩边滚下去。阴天也有一小片安稳的光，够你把一日慢慢收好。',{flag:'atlas_lamp',money:-12}),o('跟着摊主走一轮，记住换泊的短路','往后的移舟消耗减少 1 精力','你替摊主提一趟木箱，换来一张亲自走明白的泊位图。少绕的那一段水，可以留给别的见闻。',{flag:'atlas_trade_route'})]};
 if(id==='forge')return {...base,title:'舟阵的声音，原来有一处错拍',body:'鸣潮坊将船阵挂在听潮筒旁，一声潮响，筒里便回一声。轮到你的旧阵，第二声总慢半息。\n\n坊里的人把工具交给你，先让你找到自己水息进入的位置。你可以学会校准这处错拍，也可以先做一套能在海上临时补缝的阵件。',options:[o('亲手校准，再把做法记进舟册','以后整修灵舟少花 5 灵石','你没有照搬坊里的水路，试到自己的灵息与潮声接上才停。下次整修，有一段工可以亲自完成。',{flag:'atlas_craft'}),o('做一套备用阵件，先收好今日的工钱','灵石 +18、精力恢复 16','你把阵件分别装好，不将未试过的那一枚接上船。交回工具时，坊主按做好的数量付清酬劳。',{flag:'atlas_spares',money:18,restore:16})]};
 if(id==='wind')return {...base,title:'高处的风，并不听海面的潮',body:'听风台的纸带向右，台下的船旗却指着左边。你将旧湖的水息伸到纸带旁，才认出两层各走各的风。\n\n修行可以顺着高处的节奏慢慢接息，行船则要记住换层时哪一段最省力。今日先试哪一件？',options:[o('随纸带起落，试一轮收息','以后收拢月华额外获得 2 修为','你等风转过一轮才收息，没有追它最快的那一拍。回舟后，这种节奏也能慢慢留在每日修行里。',{flag:'atlas_wind_song'}),o('记清换风的位置，补上航图','往后的移舟消耗减少 1 精力','你把两层风分别记好，凡经过这一段水都先看纸带。新的路线少了一处白白抵风的弯。',{flag:'atlas_wind_chart'})]};
 if(id==='ruins')return {...base,title:'断开的门环，仍在等一段归途',body:'潮门的两截石环各立在水里。你把水息伸进左边，右边便浮出一片旧湖的荷影。\n\n门并未完全坏。主阵断开的地方，有人留下了一笔可以自己接上的旁路。你如今的道基，刚好能稳住这条细水。\n\n可以接回通向旧湖的潮路，也可以先把未明的笔路记全，不急着开门。',options:[o('接回细水，先试通往旧湖的短路','航图新增潮门旧址 ↔ 月荷旧湖捷径','你逐段接息，不让两岸的潮一口气撞在一起。旧湖的荷影终于留成一条可往返的水路，航图也少了一段绕行。',{flag:'atlas_gate_open'}),o('只画完整的阵图，将门留到下一轮潮','修为 +16、心境 +6','你标明自己试过的部分，将不确定的地方仍留在原水里。没开门，也不算空来：这道细水教会你怎样将两种潮慢慢接上。',{flag:'atlas_gate_chart',xp:16,heart:6})]};
 if(id==='cloud')return {...base,title:'森林换气时，舟也跟着升了一寸',body:'旧航图让你找回云根，真正抵达的却是另一轮呼吸。细雨从叶间落下，落到海上时已经变成柔软的风。\n\n一截脱落的云苇正浮在根旁；根须里还蓄着刚凝成的清雨。你想先带哪一种回舟？',options:[o('收下自然脱落的云苇，试它接息的节奏','以后收拢月华额外获得 2 修为','你没有折下仍在生长的根。云苇放进舟池，起落的节奏与你带来的湖水慢慢合上。',{flag:'atlas_cloud_reed'}),o('带一小瓶清雨，换进自己的舟池','回舟歇息额外恢复 4 精力','雨入旧湖水时没有激起盐味。你将瓶子留在窗边，记下下一次凝雨的潮期。',{flag:'atlas_cloud_rain'})]};
 if(id==='mountain')return {...base,title:'山走远了，脚印里还留着温度',body:'你沿暖石的水息追到山的新落脚处。旧图上的岸已经没有山，深深的脚印却在海水里留了好一阵。\n\n脚印边，一块自然松落的暖石可以稳住舟阵；若把今日的位置画清，渡口也愿意收这份新图。',options:[o('取松落的暖石，试它怎样稳住舟阵','以后整修灵舟少花 3 灵石','你等山抬脚以后再取石，不去撬它仍在踩的那一处。暖石接进舟册，后面的整修少了一段需要买来的稳潮材料。',{flag:'atlas_footstone'}),o('把新落脚处画给渡口，自己留原稿','灵石 +24、修为 +6','你写清记录的潮期，不把会走的山画成永久停泊的岸。渡口收好新图，付的是这段真实见闻。',{flag:'atlas_mountain_chart',money:24,xp:6})]};
 return {...base,title:'你终于能回来，补这一页云潮',body:'第三年的云潮航路让你找到这道隙口。第一次是为了抵达，今日你有空看它怎样在明暗之间换水。\n\n你将听潮舟泊在自己实测过的那一侧，再补一页潮图。远方不再只有一次经过，它也可以成为你愿意回来的地方。',options:[o('将本轮潮位寄回渡口','灵石 +20、心境 +4','你把一页新图寄回去，写明这是今日亲测的潮位。海市会收到一段来自更远处的消息。',{flag:'atlas_sky_chart',money:20,heart:4}),o('将两层灵息分别接回自己的道基','修为 +18','你先让云与水各自走过，再将相接的那一息收好。修行仍在继续，已经走过的远方也还会教你新东西。',{flag:'atlas_sky_breath',xp:18})]};
}
function reason(s,option){if(!s.pending?.startsWith('atlas_site_'))return '';if(s.flags[s.pending])return '这一处见闻已经记下';if(option.money<0&&s.money<-option.money)return '灵石不足，可以改为记下换泊的短路';return '';}
function afterChoice(s,option){if(s.pending?.startsWith('atlas_site_')&&option.restore)s.energy=Math.min(100,s.energy+option.restore);}
function begin(s){delete s.flags.atlas_stop;}
function validate(s){return !s.flags.atlas_stop||!!get(s.flags.atlas_stop)&&get(s.flags.atlas_stop).at===s.place;}
const api={locations,ports,get,here,links,description,unlocked,route,cost,visited,status,nearby,at,canMeet,questGate,gate,actions,beforeAction,context,decorate,restBonus,cultivateBonus,repairCost,energy,event,reason,afterChoice,begin,validate};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SeaAtlas=api;
})(typeof globalThis!=='undefined'?globalThis:this);
