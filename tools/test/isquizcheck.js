/* Checks every Islamic Quest question offline: unique ids that match their level, an explanation, English and a known lesson
   for each, MCQ answers in range with a whyNot for every wrong option and English for every Arabic choice list, tiles and
   letters that can build the answer, spot keywords in range, written questions with a model and its English, and that the
   parent page can read every question's wording (q: on the same line as id:). usage: node tools/test/isquizcheck.js */
const fs=require('fs');const file=process.argv[2]||require('path').join(__dirname,'../../islamic-quiz.html');const s=fs.readFileSync(file,'utf8');
const a=s.indexOf('const escA=');const b=s.indexOf('let EN=false');const c=s.indexOf('const TF=');const d=s.indexOf('/* ================= modes');
eval(s.slice(a,b).replace(/^const (escA|T|W)=/gm,'globalThis.$1=')+s.slice(c,d).replace('const BANK=','globalThis.BANK=').replace('const LESSONS=','globalThis.LESSONS=').replace(/^const (TF|TFE|TFT)=/m,'globalThis.TF='));
let bad=0;const ids=new Set();const err=(q,m)=>{bad++;console.log('PROBLEM',q.id,m);};
const lessonIds=new Set(Object.keys(LESSONS));
for(const q of BANK){if(ids.has(q.id))err(q,'duplicate id');ids.add(q.id);
  if(!/^i[2-7]-\d\d$/.test(q.id)||+q.id[1]!==q.lv)err(q,'id does not match its level');
  if(!q.why)err(q,'no why');if(!lessonIds.has(q.l))err(q,'unknown lesson '+q.l);if(!q.en)err(q,'no English (en)');
  if(!fs.existsSync(require('path').join(__dirname,'../../islamic/'+LESSONS[q.l]?.[0]+'.html')))err(q,'lesson file missing for '+q.l);
  if(q.type==='mcq'||q.type==='tf'){if(!(q.a>=0&&q.a<q.o.length))err(q,'bad a');if(new Set(q.o).size!==q.o.length)err(q,'duplicate options');
    q.o.forEach((_,i)=>{if(i!==q.a&&!(q.whyNot&&q.whyNot[i]))err(q,'no whyNot for option '+i);});
    if(/[؀-ۿ]/.test(q.o.join(''))&&!(q.oe&&q.oe.length===q.o.length))err(q,'Arabic choices need oe');}
  if(q.type==='tiles'){const t=q.tiles.map(x=>x[0]);for(const w of q.answer)if(!t.includes(w))err(q,'tile missing: '+w);if(t.length<=q.answer.length)err(q,'no wrong tile');}
  if(q.type==='spell'){const L=[...q.letters];for(const ch of q.answer){const i=L.indexOf(ch);if(i<0)err(q,'letter missing: '+ch);else L.splice(i,1);}if(!L.length)err(q,'no wrong letter');}
  if(q.type==='spot'){if(!q.keys.length||q.keys.some(k=>!q.words[k]))err(q,'bad keys');}
  if(q.type==='write'&&!(q.model&&q.men))err(q,'write needs model and men');
  if(q.type==='match'&&new Set(q.pairs.map(p=>p[1])).size!==q.pairs.length)err(q,'duplicate right-hand items');
  if(!['mcq','tf','match','tiles','spell','spot','write'].includes(q.type))err(q,'unknown type');}
const seen=new Set();for(const m of s.matchAll(/^\{id:'([a-z]\d+-\d\d)',[^\n]*?\bq:(['`])((?:(?!\2)[^\\]|\\.)*)\2/gm))seen.add(m[1]);
for(const q of BANK)if(!seen.has(q.id))err(q,'parent page cannot read the wording');
const per={};BANK.forEach(q=>per[q.lv]=(per[q.lv]||0)+1);
console.log(`${BANK.length} questions (${Object.entries(per).map(([k,v])=>'Q'+k+': '+v).join(', ')}), ${bad} problems`);process.exit(bad?1:0);
