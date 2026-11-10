(function(root){
'use strict';
const C=typeof module!=='undefined'&&module.exports?require('./sea-content.js'):root.SeaContent,o=C.option;
const year=s=>[2,3].includes(s.flags.year)?s.flags.year:1;
const phase=s=>s.flags.home_stage3?3:s.flags.home_stage2?2:s.flags.home_stage1?1:0;
const item=s=>s.flags.forest_seed?'seed':s.flags.mountain_heart?'stone':null;
const unsettled=s=>s.affair&&['secret','repair','hide'].includes(s.affair.status);
const keys=['home_stage1','home_stage2','home_stage3'];
const restBonus=s=>s.flags.home_water?6:0,workBonus=s=>s.flags.home_wind?6:0;
function begin(s,next=2){s.flags[next===2?'first_ending_title':'second_ending_title']=s.ending.title;s.flags.year=next;s.turn=0;s.ended=false;s.ending=null;s.pending=next===2?'year2_intro':'year3_intro';s.queue=[];s.lastChoice=null;s.energy=Math.max(60,s.energy);for(const p of C.people){const n=s.npcs[p.id];n.lastScene-=36;n.place=['云津浮桥','照雪斋','回潮湾'][p.home];n.activity='准备这一年的新事';if(Number.isFinite(s.flags['love_at_'+p.id]))s.flags['love_at_'+p.id]-=36;if(s.flags['slow_'+p.id])delete s.flags['asked_'+p.id];}if(s.affair)s.affair.started-=36;}
function gate(s){if(year(s)!==2)return '第二年开潮以后，再照料这趟路带回的发现';if(!item(s))return '先走完三段外海航路，带回云木种子或暖石';if(phase(s)===3)return '舟中小院已经写进这年的手札';if(36-s.turn<1+(2-phase(s))*3)return '本年剩余时辰不够，先把这一段生活留在手札里';if(phase(s)&&s.turn-(s.flags.home_last_turn??-10)<2)return '等它再过两旬潮。期间可以修炼、歇息或见人';return '';}
function visit(s,id){return year(s)===2&&phase(s)>=1&&s.npcs[id].met&&s.npcs[id].stage>=2&&!s.flags['year2_reply_'+id]&&!unsettled(s)?'year2_reply_'+id:null;}
const replies={
  "sword": [
    "窗边的新灯",
    "沈照寒来时，你正踩着凳子修窗扣。他站在舟口问：“凳子稳吗？要不要我扶着？”\n\n“你先别上来，舟会晃。”你拧紧最后一颗钉子，才让他进门。\n\n他带来一盏防风灯。你看了眼旧灯：“我这盏还没坏。”\n\n“我知道。上次坐在这里，风一大，灯就灭了。我看到这种灯罩，就买了一盏。”他把灯放到桌上，“你试试，喜欢再换。”\n\n你抬手去拨灯罩，里面的光果然没动。你问他多少钱，他说：“送你的。你真要跟我算，今晚请我吃碗面就行。”"
  ],
  "brother": [
    "这回先说舟里的事",
    "沈照野在岸边喊你。你探出头，他还没开口，你先问：“又有哪座山要沉了？”\n\n“今天没有。”他扶着窗沿往里看，“你上次说舟里添了东西，我来看看。”\n\n你笑他难得空手。他翻出一小包糕：“也不算空手。路上买的，你吃过这家的没有？”\n\n你请他进来，挪开桌上的试养记录。他刚坐下便想拿来看，被你按住纸角。\n\n“别急着翻，我自己都还没记清楚。”\n\n“那你讲给我听。”他把糕推到你面前，“我今天不赶船，讲乱了也可以从头来。”"
  ],
  "array": [
    "差点拿错的纸",
    "陆停云把阵纸放到桌上，你一看便笑了：“你把桥务所的报销单带来了。”\n\n他连忙翻过那一叠纸，从底下抽出一张干净的：“这张才是给你的。刚才收东西太急。”\n\n“你又有什么阵要画？”\n\n“你上次说，带回来的东西在舟里有了变化。我想听听。”他将笔递给你，“你可以画给我看。画不好也没事，我的桥图你又不是没见过。”\n\n你把自己的记录拿出来，指给他看几道乱线。他没急着动笔，先问：“这两次之间，你换过水没有？”"
  ],
  "father": [
    "茶壶放在哪里",
    "陆归岳提着茶来。你从窄舱里抬头：“你先别迈进来，我还在挪箱子。”\n\n他停在门口，问：“茶壶先放哪儿？”\n\n“放桌上……等等，那块布下面压着我刚写的纸。你放灶边吧。”\n\n等你腾出地方，他才坐下。你问是不是又要找你试水，他笑着摇头：“我今天只是来喝茶。你说舟里有了新变化，我还没见过。”\n\n你让他别嫌舱里乱。他看了看灶边、舟池和挤满纸的小桌：“我家里也没整齐到哪里去。你先坐下，东西可以慢慢收。你刚才说的变化，在哪里？”"
  ],
  "demon": [
    "闻溪也有不知道的事",
    "闻溪走进舱，先问你鞋干了没有。你指了指灶边，他便把手里那捆水草放到空桶里。\n\n“你又给我找了什么草？”\n\n“岸边长的，还没认全。我带来给你看看。”他说完，才注意到舟池旁的记录，“这就是你前几日写信说的变化？”\n\n你让他猜。他蹲着看了一会儿，摇头：“我没见过。你试出什么来了吗？”\n\n“还没试明白，我已经换过两次水了。”\n\n“那我先不乱猜。”他拉过凳子，“你讲讲两次有什么不同，我帮你记。”"
  ]
};
const responses={
  "sword": [
    "你指着反复失败的那一处，讲了昨天怎样重新调水。照寒问：“你现在还想试一次吗？还是已经累了？”\n\n你问他能不能看出问题。他把两份记录并在一起：“我只能看出这里的水温变了，原因还得你查。我可以帮你记时。”\n\n“你带了灯，还带了饭？”\n\n“饭没带。不过面摊还开着，你要是饿了，我们先去吃。”",
    "照寒把约好的时辰记在灯匣里。你笑他：“你验货也记这里，我这一项会不会被写成待验？”\n\n“不会。我会写你的名字。”他转过匣子让你看，“这天我已经换好班了。你想在舟上吃，还是到街上去？”\n\n你说先看天气，他在日期下面又添了四个字：来前写信。"
  ],
  "brother": [
    "你说自己连这道线该往哪边画都拿不准。照野听完，从袖里抽出路册：“我也弄错过。你看这一页，我第一回把入口画在北边，回来才发现绕了整座岛。”\n\n“所以你涂了这么多箭头？”\n\n“有两个还是你上回替我改的。”他把路册铺好，“我们先把走过的写清楚，没走过的别急着画。你昨天试到哪儿了？”",
    "照野把时辰写到船票背面。你问：“你会不会当天又跑去外港？”\n\n“这天我不接出海的活。”他拿票给你看，“你已经约了我，我还临时改主意，你下次肯定不带我看了。”\n\n你指出他把月份写错了。他低头改掉，自己也笑：“这个不算改主意，是我写错了。”"
  ],
  "array": [
    "你讲完那道接不上的水，停云指着纸问：“你当时把线接在这里，是因为下面比较暖吗？”\n\n你说是，但过了一息就凉了。他另取一张纸，画出一个小圈：“我们能不能先只试这么一小段？水温一变就停，看看究竟是哪边先断。”\n\n你让他别又把整张图画满。他把笔收到纸边：“我只画试法。你原来的记录留着，我们得拿来比较。”",
    "你们把下次见面的时辰记在纸角。停云问：“这张纸要我带回去抄吗？”\n\n“你留在这儿吧。我还想继续看，省得明日又找你讨。”\n\n他将纸压好：“那我下次带一张大的来。今天这些线挤在一起，我快分不清哪条是哪次试的了。”\n\n你问他不会又带报销单吧。他笑着把那张错带的单子收进袖里。"
  ],
  "father": [
    "你说自己已经试过好几次，仍不知道是不是找对了方向。归岳听完，问你最近一次用了多少水。\n\n“和前一回一样。”\n\n“先别急着再添。你把前后两次记的温度给我看看，我也得想一想。”\n\n你笑他也会答不出来。他坦然说：“当然。我有道门，改了六次才开对。下次你来我那里，我指给你看，门框上还留着第三次弄坏的痕。”",
    "归岳问下次怎么过来，你说走有灯的那道水阶就好。\n\n“你不必为这一趟再开门，我怕你一试，又把我的舟接到屋里。”\n\n他笑着把水阶的方位记下：“那我照常走过来。茶我带，饭由你做？”\n\n“饭我会做，不过你得帮我洗碗。”\n\n“可以。上次那个裂了边的碗，你记得先收起来，别又割到手。”"
  ],
  "demon": [
    "你把两次记录摊开，闻溪先看日期，又问你那两天的风向。你告诉他，第二天正好起了北风。\n\n“我下次来，我们再用同样的水试一遍，挑一个没风的日子。”他说。\n\n你问要是还是没变化呢。他把今天的水温写在下面：“那就说明可能不是风的问题。我们先记结果，别急着给它起名字。”",
    "闻溪问下次带纸还是带茶。你说纸还多，茶已经喝完了。\n\n“那我带茶。你要上回那种，还是想换一种？”\n\n你挑好茶，又让他别带一捆新草来占地方。他看了看脚边的桶，笑着答应：“这捆我走的时候就拿走。等我认清了，再写信告诉你。”"
  ]
};
function event(s){const key=s.pending;if(key==='year2_intro'){const opening=item(s)==='seed'?'舟池边的云木种子已经长出第一片叶，细根还认得你带它回来的那阵风。':item(s)==='stone'?'暖石仍放在旧航图边。第二次开潮时，它轻轻转向一个你还没有画过的方向。':'旧航图在窗边展开。第一年没走完的路仍在，你不必假装已经到过那里。';return {title:'第二次开潮，带着自己的生活回来',chapter:'第二年 · 潮路小院',background:'home',location:'听潮舟',body:'海市再次从云里亮起来。你这回没有在船板上试探脚步，先将缆绳打好，才抬头看岸上的灯。\n\n'+opening+'\n\n修为、灵舟与相处过的人都还在。你没有换一副人生重新开始，只是带着上一年的选择，回来过下一段日子。\n\n开潮前你已经歇过几日。桌上添好灯油，接下来先忙什么，可以自己决定。',options:[o('先照看舟里带回的东西','开启第二年；保留资源、关系与记忆','你把小舟泊稳，替旧湖水试了试温度，再看向航图边的发现。它们不会因为被带回来就自己成为答案，这一年，想慢慢弄明白。',{heart:3}),o('先推开舟窗，看看这一年想走哪条路','开启第二年；未完成的外海航路仍可继续','你推开窗，将旧航图压在桌边。还有空白的地方，就继续往前走；已经亲自走过的，也能成为往后生活的一部分。你先将这一旬留给自己的打算。',{heart:3})]};}
if(key?.startsWith('year2_reply_')){const id=key.slice(12),p=C.people.find(p=>p.id===id);if(!p)return null;const a=replies[id],same=s.flags.expedition_partner===id&&s.flags.sail_mountain,bond=s.bond===id&&!unsettled(s);return {title:a[0],person:id,chapter:'第二年 · 相处的后续',background:'home',location:'听潮舟',art:bond?'evening':null,body:a[1].replace('一缕根或一道潮声',item(s)==='seed'?'舟池里那一缕细根':'暖石里那一道潮声')+(same?'\n\n你们又提起一起赶上迁山的那一天。这一次，远方已经在舟里留下了一点形状。':'')+(bond?'\n\n他在你身旁坐下，手背轻轻碰过来。你望向他，他没有借这点亲近把刚才的话带过去，仍在认真等你讲完。':''),options:[o('把照料中最难弄懂的那一段讲给他听','让他认识你的生活 · 信任 +4','你没有只讲顺利的那一部分，也说起自己拿不准时怎样停下来。他听完，先问你想再试哪种办法，没有把答案直接换成他的。\n\n这一回，话题终于可以从“你去了哪里”，继续到“你想怎样生活”。',{trust:4,memory:'第二年，认真听过你照料舟中发现时的困惑'}),o(bond?'握住他的手，约好下次一起来看变化':'约他下次一起看看新的变化','自己发起下一次邀约 · 亲近 +2、信任 +2',bond?'你握住他的手，先将下一次有空的时辰说清。他笑着应了，问到时要不要带早饭。你说想吃的那一种，他认真记下。\n\n亲近已经是你们生活里的一部分，却仍有许多小事值得继续认识。':'你先说下次想看的变化，也问他哪一日有空。他把自己的安排说清，你们挑好一段可以一道坐着的时辰。\n\n这份熟悉从往日的见面继续往前走，没有人急着把它叫作别的关系。',{favor:2,trust:2,memory:'第二年，约好一起看舟中新的变化'})]};}
if(!keys.includes(key))return null;const stage=keys.indexOf(key),seed=item(s)==='seed',base={background:'home',location:'听潮舟',chapter:'第二年 · 舟中生活 · '+(stage+1)+' / 3'};
if(stage===0)return {...base,title:seed?'它长出的第一片叶，没有朝你想的方向':'暖石里有潮，却不肯按你的阵法响',body:seed?'云木的第一片叶偏向舟窗。你将小池转了转，叶片仍朝原来的方向伸。\n\n你原以为带回来，就能按湖里水草的习惯养它。试过几次才发现，它的根要湖水，叶却仍在等云上的风。\n\n一只船，可以有自己的水，也可以留一扇真正朝外开的窗。你坐在池边，决定先照顾它最需要的那一件事。':'你将暖石放进小池，潮声便响起来。拿出来，声音又停了。你照着旧阵试了两遍，石头却只认每一旬自己到来的潮。\n\n原来带回一块记着山路的石，不等于能叫山按你的时辰走。\n\n你摸着它的温度，决定先给这道陌生的潮留一点位置。',options:[o(seed?'先稳住根边的湖水，再慢慢等它长':'把暖石留在水边，留一段安稳的潮','舟中水息更稳 · 每次歇息额外恢复 6 精力','你没有催着它回应，把湖水引过船阵最柔和的一处。夜里回舟时，那一点灵息已经先认出了你的脚步。\n\n往后每次歇息，都能在熟悉的水声里多恢复一点精神。窗外的变化还在，你也终于有一处能慢慢等的地方。',{flag:'home_water',xp:8}),o(seed?'替叶片开一扇窗，记下风从哪里来':'顺着石里的山歌，补好新的委托航线','潮路记得更准 · 每次水路委托额外获得 6 灵石','你将风与潮的来处记得细些，把新的航线添进自己的路册。岸上的委托多了一种你能认出的变化，盘缠也更容易靠自己的本事挣来。\n\n往后每份水路委托，都能按这份新见闻多收一点酬劳。',{flag:'home_wind',xp:8})]};
if(stage===1)return {...base,title:seed?'过了三轮潮，它自己伸向了窗外':'这一道山歌，原来会回答另一道潮',body:(seed?'云木长出第二片叶，细根贴着舟池慢慢展开。这一回你没有转动池子，先看它自己找来的方向。':'暖石的潮声在清早变了一次。你将旧湖水放到旁边，它没有盖过山歌，反而与那一段曲调接上了。')+'\n\n桌上留着从前画了一半的航图。你忽然明白，修行不只是在身上积攒灵息，还可以让自己认识的水、风与远方，在生活里找到彼此。\n\n你把今日的新变化写下，留下另一页，等下一次自己来回答。',options:[o('照着它的变化，修好一处自己的舟阵','用新的见闻反过来改造灵舟 · 修为 +16','你将阵纹接得慢些，等湖水、风与新的潮声都能各自经过。原本急着填满的那一处，终于留出了呼吸的空隙。\n\n你不是照抄谁的旧法。听潮舟里多出来的这一笔，是从自己生活中学来的。',{xp:16,heart:4}),o('把这一段记录送去渡口，换回新的材料','分享自己的发现 · 灵石 +24','你将能公开的潮路变化抄好，留给来往渡船，收回约好的酬劳。真正属于舟里的那一小段声音，没有为了成交被一同卖走。\n\n你带着材料回舟，继续过自己的这一日。',{money:24,heart:4})]};
return {...base,title:seed?'小院不是一座岸上的宅子':'山仍在走，你也有了自己的泊位',body:(seed?'云木的细枝越过舟窗，在船舷外撑起一小片树影。池里的水映着叶，叶外仍是很大的海。':'你沿暖石指着的方向调好船阵。潮来时，听潮舟不再只认一处岸，而能在自己熟悉的水息里找到安稳的泊位。')+'\n\n你没有把船停成再也不能出门的地方。留在这里的，是能休息、能想念、也能重新出发的一小段生活。\n\n修仙路没有替你规定应该住在哪里，更没有替你决定与谁相处。眼前这点形状，是你一旬一旬养出来的。',options:[o('留一处只属于自己的水与灯','舟中小院完成 · 修为 +24、心境 +6','你把最后一盏灯挂到自己想挂的位置，给舟池留出安静的水。有人来访时，你会亲自开窗；想独处时，也可以把帘放下来。\n\n外海仍很远，今夜却已经有地方能够好好歇息。',{flag:'home_private',xp:24,heart:6}),o('添一只客杯，留给自己愿意见的人','舟中小院完成 · 修为 +24、心境 +6','你给桌边添了一只杯子，却没有预先写上谁的名字。每一次相邀，都仍由两个人自己回答。\n\n灯照着窗边那一小片地方。你知道能请人坐下，也知道自己仍能带着小舟驶向别处。',{flag:'home_guest',xp:24,heart:6})]};}
const originalEvent=event;function eventWithReplies(s){const e=originalEvent(s);if(s.pending?.startsWith("year2_reply_")&&e){const id=s.pending.slice(12);e.options.forEach((choice,i)=>{choice.result=responses[id][i]+(s.bond===id&&!unsettled(s)&&i===1?"\n\n分别前，你握了握他的手。他回握过来，等你把下一回想吃的早饭说完，才肯起身。":"");});}return e;}
function afterChoice(s,key){if(keys.includes(key))s.flags.home_last_turn=s.turn;}
function reason(s){const key=s.pending;if(key==='year2_intro'||keys.includes(key)||key?.startsWith('year2_reply_')){if(year(s)!==2)return '第二年开潮后，才能回应这段生活';if(keys.includes(key)){if(!item(s))return '先带回云木种子或暖石';if(s.flags[key])return '这一段变化已经写进手札';}if(key.startsWith('year2_reply_')){const n=s.npcs[key.slice(12)];if(!n?.met||n.stage<2||phase(s)<1)return '先相识、相处，再邀他听这段新事';if(unsettled(s))return '先处理彼此尚未说清的事';if(s.flags[key])return '这次相谈已经写进手札';}}return '';}
function goal(s,external){if(!item(s))return external;const done=phase(s);return {done,progressLabel:'舟中生活',hint:keys.includes(s.pending)?'正在照料第 '+(keys.indexOf(s.pending)+1)+' 段变化，先回应眼前的故事。':done===3?'舟中小院已成。可以继续修行、相处，或在年末回看这一程。':gate(s)||'选择“'+(item(s)==='seed'?'照料舟中的云木':'听暖石的一次回潮')+'”，看看新的变化。',steps:[['水与风的习惯',done>=1],['记下新的变化',done>=2],['舟中小院',done===3]],discoveries:[item(s)==='seed'?'外海留物 · 云木种子':'外海留物 · 暖石',s.flags.home_water?'歇息恢复额外 +6 精力':null,s.flags.home_wind?'水路委托额外 +6 灵石':null,s.flags.home_private?'留了一处自己的水与灯':null,s.flags.home_guest?'添了一只没有预写名字的客杯':null].filter(Boolean),partner:null};}
function ending(s){let body=phase(s)===3?'第二次收潮时，你先将舟池里的水添满，再系好窗边那盏灯。航图旁的远方，已经在日常里养出一小片能歇息的地方。\n\n'+(s.flags.forest_seed?'云木的枝叶仍向外伸，提醒你树影以外还有很大的海。':'暖石的山歌仍指着下一次开潮的方向，船有泊位，路却没有被关上。'):'第二次收潮时，你收好这一年的记录。舟里的变化还没完全长成，没想通的那一处，也没有因为年末到了就被勉强补上答案。\n\n你知道自己已经比第一回更熟悉这副身体，更能分清什么是想走的路，什么是愿意留下的时辰。';const p=C.people.find(p=>p.id===s.bond);if(p)body+='\n\n'+(unsettled(s)?'你与'+p.name+'之间仍有需要说清的事。过了一年不等于已经原谅，留下的距离还要靠往后的行动回答。':p.name+'的潮信到了。他没有替你写定去处，只问下一回何时有空。你将自己的打算写清，留出一段愿意一起过的时辰。');return {title:phase(s)===3?'带着自己的生活，再出发':'第二年的灯，仍在舟上',body};}
const api={year,phase,item,keys,begin,gate,visit,event:eventWithReplies,afterChoice,reason,goal,ending,restBonus,workBonus};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SeaYear2=api;
})(typeof globalThis!=='undefined'?globalThis:this);
