(function(root){
'use strict';
function unpack(text,G){
 if(typeof text!=='string'||text.length>5*1024*1024)throw Error('存档文件过大。');
 const data=JSON.parse(text),wrapped=data?.format==='duyuexing-save';
 if(wrapped&&data.formatVersion!==1)throw Error('不支持此存档版本。');
 const state=wrapped?data.state:data;
 if(!G.validate(state)||!state.log.every(l=>l&&typeof l.title==='string'&&typeof l.body==='string'&&typeof l.date==='string'))throw Error('这不是完整的渡月行存档。');
 const records=wrapped&&Array.isArray(data.endings)?data.endings.filter(x=>x&&Object.hasOwn(G.coda.names,x.mode)&&typeof x.title==='string').slice(-24):[];
 return {state,records};
}
function pack(state,records=[]){return JSON.stringify({format:'duyuexing-save',formatVersion:1,exportedAt:new Date().toISOString(),state,endings:records},null,2);}
const api={unpack,pack};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SeaSave=api;
})(typeof globalThis!=='undefined'?globalThis:this);
