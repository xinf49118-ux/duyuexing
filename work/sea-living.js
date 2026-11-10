(function(root){
'use strict';
const C=typeof module!=='undefined'&&module.exports?require('./sea-content.js'):root.SeaContent,o=C.option;
const places=['云津浮桥','照雪斋','回潮湾'],keys=['bridge_name','bridge_choice','bridge_open'];
const leads=[
 {id:'trace',key:'bridge_trace',at:0,title:'潜入桥影，追倒流的水',item:'分开的水纹',energy:12},
 {id:'archive',key:'bridge_archive',at:1,title:'去照雪斋鉴定旧阵残片',item:'旧阵残片',energy:8},
 {id:'shoal',key:'bridge_shoal',at:2,title:'随闻溪追一座迁徙浮岛',item:'迁岛潮迹',energy:16}
];
const phase=s=>s.flags.bridge_open?3:s.flags.bridge_choice?2:s.flags.bridge_name?1:0;
const evidence=s=>leads.filter(l=>s.flags[l.key]).length;
const elapsed=s=>s.turn-(s.flags.bridge_last_turn??s.turn);
const protectedSide=s=>s.flags.bridge_solution_cut&&!s.flags.bridge_sidegate;
function gate(s){
 if(!s.npcs.array.met||s.npcs.array.stage<2)return '先与停云相识到熟悉，再收到新桥邀约';
 const p=phase(s);if(p===3)return '这一段新桥故事已完成，航路变化留在地图上';
 if(p===1&&evidence(s)<2)return '先调查两处不同的线索，再决定怎样改桥';
 if(p===2&&!s.flags.bridge_crisis)return '先进行试潮，处理旧水回涌，再决定航路';
 if(s.place!==0)return '会合在云津浮桥，可以从地图直接移舟';return '';
}
function actionGate(s,id){
 const lead=leads.find(l=>l.id===id),p=phase(s);
 if(lead){if(p<1||p===3||s.flags.bridge_crisis)return '先接下新桥邀约，调查在最终试潮前进行';if(s.flags[lead.key])return '这处线索已记下，不会重复取得奖励';if(s.place!==lead.at)return '线索在'+places[lead.at]+'，可以直接移舟过去';return '';}
 if(id==='trial'){if(p!==2||s.flags.bridge_crisis)return '带回两处线索，与停云定好方案后，再试一次潮';if(s.place!==0)return '试潮在云津浮桥，先移舟过去';return '';}
 return '';
}
function world(s){
 const p=phase(s),opening=s.queue.includes('bridge_name')||s.pending==='bridge_name';
 const trial=s.queue.includes('bridge_crisis')||s.pending==='bridge_crisis';
 const returning=s.queue.includes('bridge_open')||s.pending==='bridge_open'||trial;
 if(p===2&&!s.flags.bridge_crisis&&!s.flags.bridge_trial_started&&elapsed(s)>=4&&!s.flags.bridge_late){
  s.flags.bridge_late=true;
  if(!s.flags.bridge_tide_notice&&!s.queue.includes('bridge_tide_notice'))s.queue.push('bridge_tide_notice');
 }
 if(p===2&&!s.flags.bridge_crisis&&!s.flags.bridge_ready&&elapsed(s)>=6){
  s.flags.bridge_ready=true;
  if(!returning&&!s.flags.bridge_progress&&!s.queue.includes('bridge_progress'))s.queue.push('bridge_progress');
 }
 if((p>0&&p<3)||opening||returning){
  const away=p===2&&s.flags.bridge_space&&!s.flags.bridge_ready&&!s.flags.bridge_crisis&&!returning;
  s.npcs.array.place=places[away?2:0];
  s.npcs.array.activity=s.flags.bridge_crisis?'修补试潮留下的桥板，等候航路定案':s.flags.bridge_ready?'完成新阵初测，复核回涌的旧水':away?'独自拆看旧潮门，准备新的试潮图':'重写桥法，记录不同来路的水';
 }
}
function nextPlace(s,id){if(id!=='array'||!phase(s)||phase(s)===3)return null;return places[phase(s)===2&&s.flags.bridge_space&&!s.flags.bridge_ready&&!s.flags.bridge_crisis?2:0];}
function begin(s){if(Number.isFinite(s.flags.bridge_last_turn))s.flags.bridge_last_turn-=36;world(s);}
function goal(s,id){if(id!=='array'||!s.npcs.array.met)return '';return ['试造一座署自己名字的新桥','封住旧桥，等候不同来路的调查结果',s.flags.bridge_crisis?'试潮已经结束，正修补桥板':s.flags.bridge_ready?'自行完成新阵初测，回到云津复核':s.flags.bridge_space?'去了回潮湾拆看旧潮门，会在试潮时回云津':'留在云津试新法，自己的阵纸仍要自己写','完成不归桥，准备下一段潮路'][phase(s)];}
function nodes(s){const p=phase(s);return places.map((name,i)=>({name,here:s.place===i,people:C.people.filter(n=>s.npcs[n.id].place===name).map(n=>n.name),change:i===0?(p===3?(protectedSide(s)?'不归桥暂封主桥 · 过客船接驳':'不归桥已开放 · '+(s.flags.bridge_public?'新航路加入委托':'新桥认得你的水息')):p===2&&s.flags.bridge_crisis?'试潮已处理 · 等待航路定案':p===2&&s.flags.bridge_late?'灯潮已过 · 桥板受损，仍可处理回涌':p===2&&s.flags.bridge_ready?'新阵初测完成 · 仍需复核旧水':p?'旧阵停渡 · 新桥调查中':'浮桥来往 · 新桥尚在试造'):i===2&&p===2&&s.flags.bridge_space&&!s.flags.bridge_ready&&!s.flags.bridge_crisis?'停云正在这里拆看旧潮门':'潮路照常开放'}));}
const workBonus=s=>s.flags.bridge_public?(protectedSide(s)?2:4):0;
const energy=(s,id,base)=>id==='travel'&&s.flags.bridge_quiet?Math.max(0,base-(protectedSide(s)?1:2)):base;
function journal(s){
 const p=phase(s);if(!s.npcs.array.met||s.npcs.array.stage<2)return null;
 const items=[];if(s.flags.bridge_jar)items.push('一囊分开的旧湖水');if(s.flags.bridge_sidegate)items.push('旁路阵图');if(s.flags.bridge_anchor)items.push('能钉住旧水的潮锚');if(s.flags.bridge_flow)items.push('转潮记法');if(s.flags.bridge_testimony)items.push('补阵证词');
 if(s.flags.bridge_anchor_used)items.push('潮锚已留在桥底');
 const hint=p===0?'一座桥将你认回旧湖。先接下邀约，亲自试一轮水。':p===1?'三处线索，至少查两处。调查顺序与带回的东西，会改变试潮时能用的办法。':p===2&&s.flags.bridge_crisis?'试潮已有结果。回云津，与停云决定这条新路怎样使用。':p===2?'方案已定。可以立即回云津试潮，也可以再找第三处线索或先处理自己的事。':'新桥的去处已写进航图，完成后不会重复发放奖励。';
 const countdown=p===2&&!s.flags.bridge_crisis?(s.flags.bridge_late?'灯潮已过：主桥有损，仍有解决办法。':'距离灯潮还有 '+Math.max(0,4-elapsed(s))+' 旬，试潮占一旬；其他行动同样会推进潮期。'):'';
 return {phase:p,title:['不归桥 · 邀约','不归桥 · 寻证','不归桥 · 试潮','不归桥 · 留在世界里的新路'][p],hint,countdown,evidence:evidence(s),items,leads:leads.map(l=>({...l,done:!!s.flags[l.key]})),resolution:s.flags.bridge_solution_water?'你引开旧湖水，桥的归路仍在':s.flags.bridge_solution_anchor?'潮锚留在桥底，保住稳定的夜路':s.flags.bridge_solution_cut?(s.flags.bridge_sidegate?'切断主阵，用残片里记下的旁路接回归途':'切断主阵，暂用过客船接驳'):''};
}
function event(s){
 const key=s.pending;if(![...keys,...leads.map(l=>l.key),'bridge_crisis','bridge_progress','bridge_tide_notice'].includes(key))return null;
 const base={chapter:'不归桥 · '+({bridge_name:'试桥',bridge_choice:'分工',bridge_open:'定案',bridge_trace:'水下调查',bridge_archive:'残片鉴定',bridge_shoal:'迁岛寻迹',bridge_crisis:'第一次试潮',bridge_progress:'他的进展',bridge_tide_notice:'潮期变化'}[key]),background:'bridge',location:'云津新桥',person:'array'};
 if(key==='bridge_tide_notice')return {...base,person:null,location:null,title:'灯潮不会等一张没有落款的图',body:'夜市的灯一盏盏往上浮，桥下的水却开始倒着走。停云托渡船带来一截断裂的桥板，上面还留着旧湖的荷叶影。\n\n他已经停下通行，将桥上的人带离。新阵并未失败；是整片旧湖的水，同时要求回到同一个地方。\n\n“坏的桥板我会重接。”纸条最后一行写得重，“这轮试潮结束以前，别让客人上桥。”\n\n你错过了水势最轻的那一轮。云津仍能试潮，但引水要用更多灵息，手里的证据也比先前更要紧。',options:[o('记下新的水势，再按自己的准备去处理','潮期已过 · 引水的精力消耗提高；仍可完成事件','你将裂开的桥板翻过来，把回涌方向画在背面。哪一段水能放，哪一段必须截住，这次要先认清再动手。')]};
 if(key==='bridge_progress')return {...base,location:null,title:'你不在桥边的这些旬',body:'潮信跟着渡船来到。前半页是新阵的误差，后半页才提起停云已独自走完两轮初测。\n\n'+(s.flags.bridge_space?'他从回潮湾带回拆开的旧潮门，回云津时袖口全是细细的白盐。':'你留下的水线分开了第一笔，其余几处，他一笔一笔亲自试过。')+'\n\n图纸边上有一小块空白，写着：“你找的那段水，我还没有亲自走过。等你回来，我们再把这处对一下。”\n\n初测做完了，旧湖同时回涌的问题仍在。你收好他寄来的新图，下次去桥边，不必从头替他做，却有一段只有你带回的东西能回答。',options:[o('在空白处画上自己的近况，把新图收好','停云回到云津 · 新阵初测完成，最终试潮仍由你决定','你画了舟窗、一只停在窗边的水鸟，以及今日的潮位。信寄出时，新桥不是唯一在往前走的事。',{trust:1,memory:'各自行动的日子里，停云自行完成初测，寄来留有空白的新图'})]};
 if(key==='bridge_name')return {...base,title:'你走过桥，桥却把你送回了从前',body:'停云的邀约只有两行：新桥试最后一轮潮，酬劳照付，认错路的部分另算。你将舟系在云津，他站在第三块桥板旁，靴尖已经湿了。\n\n你刚迈过他身边，灯火便退进雾里。脚下竟是旧湖。荷叶贴着肩，你差点摆动那条已经不在的尾巴。\n\n“停云，你不是说桥接到对岸了吗？怎么把我送回湖里了？”\n\n他赶进桥影，阵纸被你拍上来的水浸湿一角。桥要先认过客的来处，才敢接下一段路。你身上两百年的湖水，比化形后的脚步更重；它便把旧湖认作你唯一能到的地方。\n\n桥下还有一道陌生的水，正挤进湖影。停云把手伸过去，指尖竟结了盐。\n\n“我先把桥封了，不能再让客人上来。”他翻过阵纸，“你先退到岸边，把水囊放上来。我得查清楚，是它认错了人，还是这段湖水出了问题。”',options:[o('放一囊旧湖水上桥，自己留在岸边','先分开水与人 · 修为 +8','水囊被送回旧湖，你仍站在岸边。轮到你自己踏上桥，它又想将脚步拖回去。\n\n“它照着我身上的旧湖水往回送，根本没管我想去哪儿。”你按住那条细水。停云在纸上留下两道分开的线，封住第三块桥板。\n\n他递给你一角旧阵：照雪斋能鉴残墨，回潮湾的行记师常记迁岛水位。至于桥下的水，你自己最熟。你把三处圈进潮记。',{flag:'bridge_seen_water',xp:8}),o('写上自己的名字，再踩过第三块桥板','试名字能否改变去处 · 心境 +4','“'+s.name+'”三个字亮起来，很快又被旧水纹压住。\n\n“我已经把名字写上去了，它怎么还是送我回湖？”\n\n“它认出了你的名字。”他把湿透的阵纸合上，“但下面接的还是旧水样。它没记你现在的气息，只会照着你以前的样子送。”\n\n你将纸从他手里抽回来。既然要重新做，你想先找清那道不属于旧湖的水。\n\n停云递来一角旧阵，说照雪斋能鉴残墨，回潮湾的行记师常记迁岛水位。你把这两处与桥下的水，一起圈进潮记。',{flag:'bridge_seen_name',heart:4})]};
 if(key==='bridge_trace')return {...base,person:null,title:'桥下的湖，没有天上的月亮',body:'你沿桥柱潜下去。化形后的身子游得比从前笨，旧湖的水息却还认得你。到了第三块桥板下，你看见荷叶的影子在海水里长。\n\n它们全朝同一处倾斜，天上明明没有风。更奇怪的是：海面的月亮在右边，湖影里却一轮月也没有。\n\n这不是湖。是许多过桥者留下的“回到原处”，被旧阵养成了一道会抢路的水。\n\n你试着松开一缕水息，湖影立刻追来。可以带走一小囊供试阵，也可以冒一点险，认清它追赶时怎样转弯。',options:[o('用水囊封住一缕，把它带回去试','取得分开的水纹与旧湖水 · 修为 +6','你把水囊口留在身后，自己向侧面游。湖影扑进囊中，你收紧袋口。回到岸上，它仍一下一下撞着薄壁。\n\n往后引水时，这一囊足够让旧湖先认定一个方向。',{flag:'bridge_jar',xp:6}),o('让它追自己半圈，记下转潮的顺序','取得分开的水纹与转潮记法 · 精力 −6、修为 +12','你没有与它比快。湖影一动，你便贴着桥柱换向，数过它折回时迟了几息。\n\n回到岸上，袖子里全是水，你却终于知道：它会追来，但转弯远没有银鲤灵活。',{flag:'bridge_flow',xp:12,energy:6})]};
 if(key==='bridge_archive')return {...base,background:'market',location:'照雪斋',person:'sword',...(!s.npcs.sword.met?{stage:1}:{}),title:'鉴物单上，少了一段回程',body:'你把旧阵残片压在照雪斋的灯下。沈照寒没碰它，先将整盏灯移开半尺。碎纸上的水影随灯走了，墨却还留在原处。\n\n“你先别照着这道水影补线。”他说，“这道影子是旧阵映出来的，你看后面的墨，实际的线已经断了。”\n\n翻过残片，背面还有一道很淡的旁路。陆归岳当年曾留它给退潮后归来的人；后来主阵接得太稳，旁路竟被当作错笔擦掉了。\n\n沈照寒将细针递给你：“你想先把下面那段旁路挑出来，还是查一查，谁把它删掉了？我帮你把补阵单找来。”',options:[o('用针挑开叠墨，抄出被遮住的旁路','取得旧阵残片与旁路阵图 · 信任 +2','你一层一层挑开墨迹，沈照寒替你将灯举稳。最后一笔露出来时，你的指尖已经染黑。\n\n旁路不漂亮，却能在主阵断开时，把过客接回船上。他把细针留给你：“这根针先借你，用完记得还我。针尖很细，你用布擦，别拿袖口蹭，会扎手。”',{flag:'bridge_sidegate',trust:2,memory:'在照雪斋一起挑开旧阵叠墨，找回被擦掉的旁路'}),o('先对照历年的补阵单，找出删笔的缘由','取得旧阵残片与补阵证词 · 信任 +3、灵石 +8','你在三张补阵单上找到了同一个注记：为赶灯潮，暂将归路并入主阵。不是哪位阵师想困住谁，是一笔被反复沿用的“暂时”。\n\n沈照寒替你签好鉴物单，将酬劳推过来：“你把这份单子带过去，上面写了改桥的日期。他们再说旧桥一直这样，就请他们解释这一笔。”',{flag:'bridge_testimony',trust:3,money:8,memory:'一起核对补阵单，找出旧桥失去归路的缘由'})]};
 if(key==='bridge_shoal')return {...base,background:'outer',location:'回潮湾外水',person:'demon',...(!s.npcs.demon.met?{stage:1}:{}),title:'山已经走了，影子还停在昨天',body:(s.npcs.demon.met?'你带着新的桥图问起迁岛潮迹。闻溪正要出湾核对水位，招呼你将舟接到他的船旁。':'你按停云写的铺名找到回潮湾的行记师。他听完桥的怪事，将自己的潮图展开：他正要出湾核对迁岛的水位，船边还空着一个位子。他说自己叫闻溪，问你要不要一起认认这段水。')+'\n\n闻溪的行记铺在船头，他圈出的浮岛并不在圈里。你们等到落潮，才看见一截山影从船底缓缓经过。\n\n“这座岛昨夜已经往南挪了。”他将旧坐标划去，“桥里的坐标没更新，还把船往昨天那个泊位送。”\n\n一只废潮锚被影子拖着，锚尖钉住一线倒流水。你伸手，锚便随旧水向后拉；闻溪按住舟沿，看你准备怎么取。\n\n带走锚能钉住桥下的回涌，但也会失去观测这道影子换向的机会。',options:[o('取下废潮锚，让这道旧影自己散去','取得迁岛潮迹与潮锚 · 信任 +2','你顺着旧影的去处绕到后方，一把将锚拔出。山影散进浪里，船终于不再被往后拖。\n\n闻溪将你湿透的袖子拧了一遍，没把滴下的水抹去，反而看它们往哪边流：“你把锚带回去吧。我记下新的坐标，再给你抄一份。”',{flag:'bridge_anchor',trust:2,memory:'与闻溪追回迁岛留下的旧影，取出钉住倒流的潮锚'}),o('不动潮锚，顺着山影记一轮转潮','取得迁岛潮迹与转潮记法 · 信任 +3、修为 +8','你让舟与山影隔开半个浪头，不去追它昨日的位置，只看它怎样松开旧水。\n\n闻溪写下最后一个潮位，把笔插进你掌心：“下面这道转弯你刚才亲自游过，比我看得清楚。你来画，我把潮时补在旁边。”你将银鲤转身时留下的空隙，画进他的图。',{flag:'bridge_flow',trust:3,xp:8,memory:'与闻溪记录迁岛转潮，各自在同一张图上留下新笔'})]};
 if(key==='bridge_choice'){
  const found=leads.filter(l=>s.flags[l.key]).map(l=>l.item).join('、');
  return {...base,title:'这次，他没有先替你写答案',body:'你将'+found+'铺在桥旁。停云伸手要接，见你还在排顺序，又把手收了回去。\n\n'+(s.flags.bridge_seen_water?'他认出那两道分开的水线，将新图推到它们旁边。':'你写过的名字还留在新图开头，没再被旧水纹压住。')+'\n\n你讲完最后一处，他将自己的新图翻过来。图上有三次试错，没有一次被擦掉。\n\n“我父亲来过。”他说，“他建议我拆掉主阵，先用客船接人。他说得有道理，不过我还想试试，能不能把旧水和客路分开，留下这座桥。”\n\n你指向桥下的旧湖影：若整片旧水一起回涌，新阵也撑不住。停云点头，在新图上圈出一个试潮的时辰。\n\n还有四旬，灯潮就会带旧水回来。你们可以一起试图，也可以分别做最后的准备，再回云津试潮。',options:[o('留一段时辰，一起把彼此的图对上','停云留在云津 · 信任 +4；开始四旬潮期','你把自己找到的转折指给他看。他先试，走错一笔，你拿笔尾轻敲他的指节。\n\n“这道窄口，我游过去没问题。但你不能照着我的路线直接接桥，桥板放不下。”\n\n停云抬眼：“那我把阵线往外挪半寸呢？你看看，会不会碰到回流。”\n\n你挪开手，他在你留下的空隙里接上自己的线。两张图第一次没有互相盖住。',{flag:'bridge_shared',trust:4,memory:'改桥时一起对图，你留出水路，他接上自己的阵纹'}),o('我去补最后的见闻，你拆旧潮门。试潮时会合','停云去回潮湾 · 信任 +4；开始四旬潮期','你将另一张图递给他。他收进袖中，却把手边唯一一盏防水舟灯推给了你。\n\n“你把这盏灯带上。回潮湾处处有灯，你去的那段水却没人在岸边照着。”\n\n你问他怕不怕你把桥的事忘了。停云指指你的新图：“你要是忘了，我会写信找你。不过我这边也不会停着等你回来，能先修的部分，我会继续修。”\n\n你笑起来，带灯登舟。他走向自己的潮门。',{flag:'bridge_space',trust:4,memory:'各自准备改桥时，停云将防水舟灯留给你，约好试潮再见'})]};
 }
 if(key==='bridge_crisis')return {...base,title:s.flags.bridge_late?'晚到的潮，把桥板推成了两截':'第二盏灯亮时，水忽然向后走',body:(s.flags.bridge_late?'你回到云津，主桥已经缺了一段。停云用临时栈板接到岸边，先让你看清没有人的桥面，才展开新阵。':'第一轮试水很稳。你正要收起水囊，第二盏灯亮了，桥下的湖影忽然挤到同一处。')+'\n\n停云撤下客路，桥面没有过客，旧水仍在抢那个“回到原处”的方向。灯潮把许多人的旧来处接到了一起，桥便被往两岸同时拉。\n\n陆归岳托渡船送来一截断阵刀：切开主阵，先保住水域。停云握住刀柄，没有动手，转头看你带回的东西。\n\n“我来封住桥面的客路。”他将新图按在桥柱上，“你能从下面引开旧水吗？要是你也没把握，我们就一起切断主阵，先保住这片水。”\n\n你认得那片假湖。现在要用哪一段见闻，必须由你亲自回答。',options:[o('下水引开回涌，让旧水绕过人走的桥','需旧湖水或转潮记法 · 精力 −'+(s.flags.bridge_late?22:14)+'，修为 +14；保留归路',(s.flags.bridge_jar?'你将旧湖水引向桥柱外侧，等它转身，再在它原先抢路的空处接一线新水。':'你依着潮记里记下的转向，领旧水绕过桥柱。它折回时慢了几息，足够你接一线向前的新水。')+'停云在桥上跟着你的手势逐笔落阵。\n\n你浮上来时，湿发贴着脸。他先接住你递来的图，才将手伸过来。你抓牢，借力回到桥上。\n\n“你刚才不是说要送客吗？这回倒真把一条鱼拉上来了。”你说。\n\n他忍着笑，将舟灯放到你身边：“那这位刚上岸的鱼修想去哪儿？你说个地方，我看看桥有没有接对。”',{trial:'water',energy:s.flags.bridge_late?22:14,flag:'bridge_solution_water',xp:14,trust:3,memory:'试潮时你引开回涌，他依照你的手势接稳新路'}),o('把潮锚留在桥底，钉住水，再重接桥板','需潮锚 · 消耗潮锚，精力 −8；留下稳定的夜路','你将潮锚沉到桥底，旧水猛地一顿。停云趁这一息将新阵接上；你没有松手，直到桥柱的水影停住。\n\n锚再也取不出来。他俯身看了一会儿，说会把它记进图里。你问算谁的落款，他将笔递给你。\n\n新阵旁，多了一行你亲手写的字。往后的夜潮，这一处有了能靠得住的东西。',{trial:'anchor',energy:8,flag:'bridge_solution_anchor',trust:3,memory:'将寻来的潮锚留在桥底，与停云为稳定的夜路共同落款'}),o('切断主阵，先保住这片水域，再安排归路',s.flags.bridge_sidegate?'已有旁路阵图 · 不耗精力，仍能接回完整航路':'不耗精力 · 暂封主桥，以过客船接驳，航路收益较少','你握住断阵刀，停云替你稳住落刀的那一笔。旧水松开，新桥没有立刻变成一条通向远方的路。\n\n'+(s.flags.bridge_sidegate?'你从残片里抄出的旁路此时有了用处。断开的主桥两端被另一线水接稳，退潮后仍能认回泊位。':'你们把过客船的泊位重新标好。主桥先停渡，新的水路要借船接驳，走得慢些。')+'\n\n停云收起父亲送来的刀，没有将未完成的那一截藏起来。“这座桥我们明天还能继续修。”他说，“但今天不能让客人冒险过桥。我们先把接驳船排好。”',{trial:'cut',flag:'bridge_solution_cut',trust:4,memory:'一起切断抢路的主阵，按实际准备安排过客的归途'})]};
 const resolution=s.flags.bridge_solution_water?'那道由你引开的旧水仍绕着桥柱走，过客的归路留在它内侧。':s.flags.bridge_solution_anchor?'桥底的潮锚不再晃动，你的落款留在夜路的新阵旁。':s.flags.bridge_solution_cut?(s.flags.bridge_sidegate?'旁路沿着旧阵残片的笔路接通，断开的主桥也有了可回来的水。':'主桥暂时停渡，桥两端的过客船将人接向自己选择的泊位。'):'停云初测的阵纸摊在桥边，你们按记下的潮期再次复核。';
 return {...base,title:'不归桥，今天多了一条由你走出的路',body:resolution+'\n\n你把想去的另一岸写在纸上。湖影仍在水下浮现，这回没再将你拖回去。\n\n“那我再写一次名字，它还会把我送回去吗？”你问。\n\n“不会了。我把名字和旧水样分开了。”停云说。\n\n你挑眉。他将纸翻到另一面：“你要回湖，桥就接回湖的路。你要去别处，也可以重新填泊位。旧水样不会再把去处锁死。”\n\n'+(s.flags.bridge_jar?'你把用过的水囊挂回舟边。囊底还留着一点旧湖水，终于不再撞着薄壁。':s.flags.bridge_anchor_used?'那只从迁岛影子里取出的锚，从此留在了桥底。每次经过，你都认得自己的那一笔。':'你把沿途的潮迹收进手札。纸上有你去过的地方，也有那些地方反过来改变桥的部分。')+'\n\n这条路要怎样留给往后的人，你们还要再定一次。',options:[o('将实测过的水路交给渡口，接新的委托','航路加入地图 · 每次水路委托额外 +'+(protectedSide(s)?2:4)+' 灵石','你把已经试过的潮期与仍需接驳的泊位写明，交给渡口。路册没有把缺口画成完整的桥。\n\n新委托里，多了你亲自走出来的那一段。停云收到第一份过客回图时，照例留了一块空白给你。',{flag:'bridge_public',memory:'新桥定案后，将实测水路写入渡口的委托路册'}),o('先留下自己的试行路，与他继续记录下一轮潮','航路加入地图 · 移舟精力减少 '+(protectedSide(s)?1:2),'你将自己的试行路接稳，把没有试过的地方留成空白。停云在图角写下下一轮潮期，没有替你把归期一并定下。\n\n你起身收缆，他忽然问今晚还回不回舟。你说要先去看看那座山。\n\n“好。”他把灯重新交给你，“你看完山回来，记得告诉我，它这次往哪边走了。我也得把桥图上的位置改一改。”',{flag:'bridge_quiet',memory:'留下自己的试行路，约好交换下一轮潮与迁山的新见闻'})]};
}
function reason(s,option){
 const key=s.pending,lead=leads.find(l=>l.key===key);
 if(lead){if(s.flags[key])return '这处线索已经记下';if(option?.energy&&s.energy<option.energy)return '追水的精力不够，可以先封住一缕水带回去';return '';}
 if(![...keys,'bridge_crisis','bridge_progress','bridge_tide_notice'].includes(key))return '';
 if(!s.npcs.array.met||s.npcs.array.stage<2)return '先与停云相识到熟悉，再一起试新桥';
 if(key==='bridge_progress')return s.flags.bridge_progress||!s.flags.bridge_ready?'这段进展已经收好，或还未发生':'';
 if(key==='bridge_tide_notice')return s.flags.bridge_tide_notice||!s.flags.bridge_late?'这一轮潮期变化已经记下':'';
 if(key==='bridge_crisis'){
  if(s.flags.bridge_crisis)return '这一轮试潮已经处理';
  if(option?.trial==='water'&&!s.flags.bridge_jar&&!s.flags.bridge_flow)return '需要水下取得的旧湖水，或调查转潮时记下的办法';
  if(option?.trial==='anchor'&&!s.flags.bridge_anchor)return '需要在回潮湾带回的潮锚；仍可选择引水或断阵';
  if(option?.energy&&s.energy<option.energy)return '这次试潮的精力不够，可以选择不耗精力的断阵办法';return '';
 }
 if(s.flags[key]||keys[phase(s)]!==key)return '先完成眼前这一段新桥故事';return '';
}
function afterChoice(s,key,option){
 if(key==='bridge_crisis'){s.flags.bridge_crisis=true;if(option.trial==='anchor'){s.flags.bridge_anchor=false;s.flags.bridge_anchor_used=true;}}
 if(keys.includes(key)){s.flags[key]=true;s.flags.bridge_last_turn=s.turn;}
 world(s);if(key==='bridge_open'){s.npcs.array.place=places[0];s.npcs.array.activity='复核不归桥，也准备下一段潮路';}
}
function closing(s){if(!phase(s))return '';return '\n\n'+(phase(s)<3?'不归桥的改法还没有定案。你将已经找到的线索带上舟，未走过的部分仍留在图里。':s.flags.bridge_solution_anchor?'收潮时，桥底的潮锚仍钉着那段夜水。你留下的东西，成了别人也能经过的一条路。':s.flags.bridge_solution_cut&&protectedSide(s)?'不归桥主桥仍待复核，过客船照着你留下的路册接驳。停云继续修自己的桥，你也继续走自己的路。':'不归桥按你们实测的潮期开放。路册记着你的水脉，也留着下一次见面可以补写的空白。');}
const api={keys,leads,phase,evidence,gate,actionGate,world,nextPlace,begin,goal,nodes,journal,workBonus,energy,event,reason,afterChoice,closing};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SeaLiving=api;
})(typeof globalThis!=='undefined'?globalThis:this);
