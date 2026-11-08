/* Checks every French Quest question offline: unique ids, an explanation and a lesson for each, MCQ answers in range with a
   whyNot for every wrong option and an English for every choice list, tiles/answers that can be built, conjugation tables with
   6 forms and wrong extras, typed "mistakes" that differ from the answer, and that the parent page can read every question's
   wording (q: on the same line as id:, in backticks). usage: node tools/test/frquizcheck.js [french-quiz.html] */
const fs=require('fs');const file=process.argv[2]||require('path').join(__dirname,'../../french-quiz.html');const s=fs.readFileSync(file,'utf8');
const a=s.indexOf('/* ================= typed answers');const b=s.indexOf('/* ================= modes');
eval(s.slice(a,b).replace('const BANK=','globalThis.BANK=').replace('const LESSONS=','globalThis.LESSONS=').replace(/^const (normFR|noAcc|joinFR)=/gm,'globalThis.$1='));
let bad=0;const ids=new Set();const err=(q,m)=>{bad++;console.log('PROBLEM',q.id,m);};
const lessonIds=new Set(Object.keys(LESSONS));
for(const q of BANK){if(ids.has(q.id))err(q,'duplicate id');ids.add(q.id);
  if(!/^f[1-4]-\d\d$/.test(q.id)||+q.id[1]!==q.lv)err(q,'id does not match its level');
  if(!q.why)err(q,'no why');if(!lessonIds.has(q.l))err(q,'unknown lesson '+q.l);if(!q.en)err(q,'no English (en)');
  if(q.type==='mcq'||q.type==='tf'){if(!(q.a>=0&&q.a<q.o.length))err(q,'bad a');if(new Set(q.o).size!==q.o.length)err(q,'duplicate options');
    q.o.forEach((_,i)=>{if(i!==q.a&&!(q.whyNot&&q.whyNot[i]))err(q,'no whyNot for option '+i);});
    if(q.oe&&q.oe.length!==q.o.length)err(q,'oe and o differ in length');}
  if(q.type==='type'){if(!q.ans||!q.ans.length)err(q,'no answers');for(const m of Object.keys(q.mist||{}))if(q.ans.some(x=>normFR(x)===normFR(m)))err(q,'mistake equals the answer: '+m);}
  if(q.type==='tiles'){for(const ans of q.answers)for(const t of ans)if(!q.tiles.includes(t))err(q,'tile missing: '+t);
    if(!q.model||normFR(q.model).replace(/^oui,\s*/,'')!==normFR(joinFR(q.answers[0])))err(q,'model does not match the answer: '+q.model+' / '+joinFR(q.answers[0]));}
  if(q.type==='order'){if(new Set(q.items).size!==q.items.length)err(q,'duplicate order items');if(q.ie&&q.ie.length!==q.items.length)err(q,'ie length');}
  if(q.type==='match'){if(new Set(q.pairs.map(p=>p[1])).size!==q.pairs.length)err(q,'duplicate right-hand items');if(q.pe&&q.pe.length!==q.pairs.length)err(q,'pe length');}
  if(q.type==='conj'){if(q.forms.length!==6)err(q,'needs 6 forms');for(const x of q.extra||[])if(q.forms.includes(x))err(q,'extra is a right form: '+x);}
  if(!['mcq','tf','type','tiles','order','match','conj'].includes(q.type))err(q,'unknown type');}
/* the parent page's reading of the wording (admin.html) */
const seen=new Set();for(const m of s.matchAll(/^\{id:'([a-z]\d+-\d\d)',[^\n]*?\bq:(['`])((?:(?!\2)[^\\]|\\.)*)\2/gm))seen.add(m[1]);
for(const q of BANK)if(!seen.has(q.id))err(q,'parent page cannot read the wording');
/* checker behaviour */
const t=[["J'en veux","j'en veux",true],['après','après !',true],['Tu vas faire le devoir ?','tu vas faire le devoir',true],["j’en ai deux","j'en ai deux",true],['apres','après',false]];
for(const [x,y,want] of t)if((normFR(x)===normFR(y))!==want){bad++;console.log('CHECKER',x,y);}
const per={};BANK.forEach(q=>per[q.lv]=(per[q.lv]||0)+1);
console.log(`${BANK.length} questions (${Object.entries(per).map(([k,v])=>'level '+k+': '+v).join(', ')}), ${bad} problems`);process.exit(bad?1:0);
