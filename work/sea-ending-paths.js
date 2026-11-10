(function(root){
'use strict';
const C=typeof module!=='undefined'&&module.exports?require('./sea-content.js'):root.SeaContent;
const W=typeof module!=='undefined'&&module.exports?require('./sea-world.js'):root.SeaWorld;
const names={voyage:'逐山远游',lake:'月荷新生',network:'千灯共潮'};
const mode=s=>Object.keys(names).find(id=>s.flags['coda_'+id])||null;
const towns=s=>Object.keys(W.names).filter(id=>W.helped(s,id)>0).length;
function reason(s,id){
 if(id==='voyage'){if(!s.flags.future_sky||!s.flags.future_method)return '先选择云潮航向，并完成新潮复核';if(!s.flags.coda_team_channel)return '逐山要提前安排开路分工';if(!s.flags.coda_living_compass)return '需借用云木或暖石作活罗盘，才跟得上迁山';if(!s.flags.coda_cross_water&&!s.flags.coda_cross_reverse)return '需完整带回引路船与灯料，才能给移动的岸留够灯';}
 if(id==='lake'){if(!s.flags.future_harbor)return '先选择经营泊地的航向，再决定让泊地落在旧湖';if(!s.flags.home_stage3||!s.flags.home_water)return '需养成舟中小院，并用自己的水息养护';if(!s.flags.coda_migration_record)return '需调查取得迁水记，分清旧岸与旧湖的淡水';}
 if(id==='network'){if(!s.flags.future_chart||!s.flags.future_public)return '先选择行记航向，并公开复核新海图';if(!s.flags.plot_public_chart)return '需将新潮册交给大家共同复核';if(towns(s)<3)return '需在三个不同地点实际参与互助，当前已帮过 '+towns(s)+' 地';}
 return '';
}
function options(){return [
 C.option('把旧岸接到迁山的活水旁，随山走向远海','逐山远游 · 需云潮复核、开路分工、活罗盘与完整返航','你没有将旧街钉到山上，先撤去代填的归期，再用活罗盘接住正在换向的水。迁山抬脚，旧岸跟着它离开旧址；几只愿意同行的舟在外侧点亮自己的灯。不是每个人都上船。沈照寒先把该返港的舟送回，照野把不同意远行的名字划出同行单。你收回引路的最后一缕湖水，第一次看见整条街随潮越过海市的灯。',{flag:'coda_voyage',requires:'ending_voyage'}),
 C.option('拆掉旧街的客路，把淡水送回月荷，开一处新水阶','月荷新生 · 需泊地航向、水息小院与迁水记','你按迁水记分开淡水与海潮，让旧街顺水散去，留下够内湖承接的那一段清流。月荷石旁原本只有你从前藏身的空隙，今日多了一排能自己上岸的浅阶。你不把谁的新名字写进返潮簿，只让每一个来练脚步的人自己决定住几日。听潮舟仍留着能解缆的窗，湖也开始认得从海上带回的新水。',{flag:'coda_lake',requires:'ending_lake'}),
 C.option('让旧岸散开，把退路交给各地互相接续的灯','千灯共潮 · 需公开行记、公用新册与三地互助','你将旧街拆成可以复核的水线，一份寄回渡口，一份送给沿路愿意接灯的人。你帮过的几处水阶陆续回信：能照哪一段、什么时候换人，都由他们自己写清。海上没有一座必须靠回去的中心岸，今日的船可以沿几处真实的灯接着走。你留给大家的是错了也能寄回更正的图，不是只有你在场才有效的一道阵。',{flag:'coda_network',requires:'ending_network'})
 ];}
function consequence(s){const m=mode(s);if(!m)return '';const loss=s.flags.coda_cross_water||s.flags.coda_cross_reverse?'引路船与货箱完整返航。':'过客安全返航，一箱灯料留在旧水里，下一季仍要补上。';return {voyage:'旧岸离开了原先的断环，沿迁山旁的活水缓缓转向。灯会随山走，想回海市的舟另留返港的图。'+loss+'没有人能许山下一次在哪里落脚，同行者每轮潮都要重新确认愿不愿意继续。',lake:'旧街已经散去，月荷湖边多了一排浅水阶。苔九把幼鱼路让出来，最先来的妖修扶着石边试了三次，终于用自己的脚站稳。'+loss+'新水阶只接淡水，海船仍泊在湖外；清砂、换水与接人，都要按湖实际承受得住的程度慢慢做。',network:'旧岸没有留下一个中心泊位。渡口与几处真实的水阶轮流接灯，每一份新图都带着测潮的日期和可以改正的空页。'+loss+'有一处今轮缺灯油，便在路册上标停泊暂停，船改从别处接水。大家学会的是互相接着走，也接受有人暂时做不到。'}[m];}
function morning(s){return {voyage:'清晨，窗外的岸已经移了一段。你把回湖的图压在桌角，再登上仍跟得住迁山的听潮舟。今日想一起走的人会来，不愿走的人也有自己的退路。',lake:'石旁传来一次笨拙的脚步声。你推窗，看见新来的妖修正认真收起额边的鳞。你从自己的手札里翻出第一日的桥票，没有替她挑去处，只告诉她脚滑时可以先坐下。',network:'今晨第一封回图来自你帮过的水阶。信里划掉了你画错的一段，又接上一盏新灯。你笑着把更正誊进自己的图，原来路交出去之后，真的会从别人的手里回来。'}[mode(s)]||'';}
function revisit(s){const m=mode(s);if(!m)return null;return {title:{voyage:'山已经走远，断环旁留下返航的灯',lake:'旧岸空了，湖里的新脚步仍在',network:'旧址不再收齐所有的回图'}[m],body:{voyage:'你又到断环旁，旧街已经随山离开。溯石指给你看同行者留的返港灯：它只认这一轮真实的水，不催谁回来。你将迁山的新方向写在灯旁，旧址成了能换图、能分路的地方，今后仍有人可以自己决定是否追上山。',lake:'旧址的淡水已经接回月荷，海潮在环外照常走。溯石递来苔九的短信，说新来的妖修第一次出湖去了，临行没有被要求留下归期。你先记下海侧的水位，再沿自己接好的浅路回湖。',network:'断环旁只有一盏轮值灯，旁边收着几处不同的回图。溯石将一张未署测潮日期的纸退回去，另一张添了日期的则照常寄走。谁的名字写在图上都不能省掉复核，连你的图也一样。'}[m]+'\n\n危机之后，这里仍在过自己的日子。你可以留下今日亲测的潮位，也可以在断环外试一轮灵息。'};}
const edges={voyage:[['ruins','mountain']],lake:[['ruins','lake']],network:[['ruins','market'],['ruins','forge']]};
const backgrounds={voyage:'mountain',lake:'lake',network:'lantern'};
function description(s){return {voyage:'借岸已随迁山走向远海，旧址留下返港灯。新测水线接向行山渡，追山与返航都能各自选择。',lake:'旧街散去，淡水按迁水记接回月荷。浅水阶与旧址相通，海船泊在湖外，新化形的妖修可自己练习上岸。',network:'旧岸散成几地共同复核的水线。轮值灯接向万灯集与鸣潮坊，接泊能停、能换，不依靠一座永久的中心岸。'}[mode(s)]||'';}
function enrichment(s,e){if(mode(s)!=='lake'||s.pending!=='future_arrive')return e;return {...e,title:'回到旧湖的人，也带回了新的水',background:'lake',location:'月荷新水阶',body:'你在月荷石旁试好最后一级浅阶。淡水按迁水记接回湖，海潮留在外侧，没有抢进幼鱼的路。\n\n最先来的是一位刚化形的妖修。她扶着石边，问这里能住多久。你让她先试这双脚，把可歇息的水与可出去的路都指给她看，没有替她写一个必须离开的日子。\n\n舟里的小院曾教你怎样照看一段新水，如今你将做得来的那部分放大一点。水阶仍需清砂，新客也会有想独自试的一步。\n\n你可以留在湖边，也可以随时从自己接好的浅路解缆。回来这一次，同样是你走出来的选择。'};}
function achievement(s){return mode(s)==='lake'?'如今月荷湖边有一排由你接稳的浅水阶。新化形的妖修可以在这里练脚步，也能自行走向海市。你从远方带回的水，终于能在来处养出不同的生活。':'';}
function guide(s){return Object.keys(names).map(id=>({id,name:names[id],reason:reason(s,id)}));}
const api={names,mode,reason,options,consequence,morning,revisit,edges,backgrounds,description,enrichment,achievement,guide,towns};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SeaEndingPaths=api;
})(typeof globalThis!=='undefined'?globalThis:this);
