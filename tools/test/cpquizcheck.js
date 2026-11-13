/* Checks every Computer Quest question offline: unique ids that match their level, an explanation and a known lesson (c01–c10)
   for each, answers that are valid for their type (MCQ / tool / blank answers in range with a whyNot for every wrong option,
   T/F answers, buildable code tiles whose model matches, spot-the-mistake tokens), GIMP tool icons, level sizes, that every
   worksheet A/B/C question is in the right level, and that the parent page can read every question's wording
   (q: on the same line as id:). usage: node tools/test/cpquizcheck.js [computer-quiz.html] */
const fs=require('fs'),path=require('path');const file=process.argv[2]||path.join(__dirname,'../../computer-quiz.html');const s=fs.readFileSync(file,'utf8');
const a=s.indexOf('/* ================= text and code');const b=s.indexOf('/* ================= modes');
eval(s.slice(a,b).replace('const BANK=','globalThis.BANK=').replace('const LESSONS=','globalThis.LESSONS=').replace(/^const (esc|fmt|joinCode|ICON)=/gm,'globalThis.$1='));
let bad=0;const ids=new Set();const err=(q,m)=>{bad++;console.log('PROBLEM',q.id,m);};
const lessonIds=new Set(Object.keys(LESSONS));
const subj=fs.readFileSync(path.join(__dirname,'../../subjects.js'),'utf8');
for(const [id,[f]] of Object.entries(LESSONS))if(!subj.includes(`'${id}','computer/${f}.html'`)){bad++;console.log('PROBLEM lesson file name differs from subjects.js:',id,f);}
const TYPES=['mcq','tf','blank','match','order','build','spot','tool'];
for(const q of BANK){if(ids.has(q.id))err(q,'duplicate id');ids.add(q.id);
  if(!/^p[1-4]-\d\d$/.test(q.id)||+q.id[1]!==q.lv)err(q,'id does not match its level');
  if(!q.q)err(q,'no q');if(!q.why)err(q,'no why');if(!/^c(0[1-9]|10)$/.test(q.l)||!lessonIds.has(q.l))err(q,'unknown lesson '+q.l);
  if(/`/.test(q.q))err(q,'q has backticks: write code in q as <code>&lt;…&gt;</code>');
  if(/<(?!\/?(b|i|code)>)/i.test(q.q))err(q,'q has a raw < that is not a tag: use &lt;');
  if(!TYPES.includes(q.type))err(q,'unknown type '+q.type);
  if(q.type==='mcq'||q.type==='tool'||q.type==='blank'){if(!(q.a>=0&&q.a<q.o.length))err(q,'bad a');if(new Set(q.o).size!==q.o.length)err(q,'duplicate options');
    if(q.o.length<2)err(q,'needs 2+ options');q.o.forEach((_,i)=>{if(i!==q.a&&!(q.whyNot&&q.whyNot[i]))err(q,'no whyNot for option '+i);});}
  if(q.type==='tool')q.o.forEach(t=>{if(!ICON[t]&&!/^Both/.test(t))err(q,'no icon for tool '+t);});
  if(q.type==='blank'&&(q.q.match(/___/g)||[]).length!==1)err(q,'blank needs exactly one ___');
  if(q.type==='tf'&&!['T','F'].includes(q.ans))err(q,'tf ans must be T or F');
  if(q.type==='match'){if(q.pairs.length<3)err(q,'match needs 3+ pairs');if(new Set(q.pairs.map(p=>p[1])).size!==q.pairs.length||new Set(q.pairs.map(p=>p[0])).size!==q.pairs.length)err(q,'duplicate match items');}
  if(q.type==='order'&&(q.items.length<3||new Set(q.items).size!==q.items.length))err(q,'order needs 3+ different items');
  if(q.type==='build'){if(!q.answers||!q.answers.length)err(q,'no answers');const tiles=[...q.answers[0],...q.extra];
    for(const ans of q.answers){const pool=tiles.slice();for(const t of ans){const i=pool.indexOf(t);if(i<0)err(q,'tile missing: '+t);else pool.splice(i,1);}}
    if(!q.extra||!q.extra.length)err(q,'build needs wrong tiles (extra)');
    for(const x of q.extra){const ex=q.answers[0].map((_,k)=>{const c=q.answers[0].slice();c[k]=x;return joinCode(c);});if(q.answers.some(an=>ex.includes(joinCode(an))&&x!==an[0]))err(q,'extra tile could also be right: '+x);}
    if(joinCode(q.answers[0])!==q.model)err(q,'model does not match the answer: '+q.model+' / '+joinCode(q.answers[0]));}
  if(q.type==='spot'){if(!(q.bad>=0&&q.bad<q.code.length))err(q,'bad index');if(!q.fix||q.fix===q.code[q.bad])err(q,'fix must differ');}
  for(const k of ['why','exam','no'])if(q[k]&&(q[k].match(/`/g)||[]).length%2)err(q,'odd number of backticks in '+k);
  for(const v of Object.values(q.whyNot||{}))if((v.match(/`/g)||[]).length%2)err(q,'odd number of backticks in whyNot');}
/* the parent page's reading of the wording (admin.html) */
const seen=new Set();for(const m of s.matchAll(/^\{id:'([a-z]\d+-\d\d)',[^\n]*?\bq:(['`])((?:(?!\2)[^\\]|\\.)*)\2/gm))seen.add(m[1]);
for(const q of BANK)if(!seen.has(q.id))err(q,'parent page cannot read the wording');
/* every worksheet question, in its level */
const WS={1:'A1 A6 A7 A8 A9 B1 B3 B6 B7 B8 B9 C2 C6 C7 C8 C9',2:'A2 A3 A4 A5 B2 B4 B5 C1 C3 C4 C5',4:'A10 A11 A12 A13 B10 B11 B12 B13 C10 C11 C12 C13'};
for(const [lv,list] of Object.entries(WS))for(const w of list.split(' ')){const hit=BANK.filter(q=>q.src==='Worksheet · '+w);
  if(hit.length!==1){bad++;console.log('PROBLEM worksheet',w,'appears',hit.length,'times');}else if(hit[0].lv!==+lv){bad++;console.log('PROBLEM worksheet',w,'is in level',hit[0].lv,'not',lv);}}
for(const q of BANK)if(q.src&&!/^Worksheet · [ABC]\d+$/.test(q.src))err(q,'odd src '+q.src);
if(BANK.some(q=>q.lv===3&&q.src)){bad++;console.log('PROBLEM level 3 should have no worksheet MCQs');}
const per={},types={};BANK.forEach(q=>{per[q.lv]=(per[q.lv]||0)+1;types[q.type]=(types[q.type]||0)+1;});
for(const [lv,n] of Object.entries(per))if(n<22||n>30){bad++;console.log('PROBLEM level',lv,'has',n,'questions');}
if(Object.keys(types).length<6){bad++;console.log('PROBLEM fewer than 6 question types');}
console.log(`${BANK.length} questions (${Object.entries(per).map(([k,v])=>'p'+k+': '+v).join(', ')}); types: ${Object.entries(types).map(([k,v])=>k+' '+v).join(', ')}; worksheet ${BANK.filter(q=>q.src).length}; ${bad} problems`);process.exit(bad?1:0);
