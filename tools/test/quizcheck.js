/* Checks every Maths Quest question offline: each listed answer is accepted (also with its terms reordered), every character
   is on that question's keypad, no "common mistake" equals the right answer, every wrong MCQ option has a whyNot, and the
   answer checker itself behaves. usage: node tools/test/quizcheck.js [maths-quiz.html] */
const fs=require('fs');const s=fs.readFileSync(process.argv[2]||require("path").join(__dirname,"../../maths-quiz.html"),'utf8');
const a=s.indexOf('/* ================= typed answers');const b=s.indexOf('const LESSONS=');
const fr="const frac=(n,d)=>`<span class=\"fr\"><span>${n}</span><span>${d}</span></span>`;\n";
eval(fr+s.slice(a,b).replace('const BANK=','globalThis.BANK=').replace(/^const (toJS|PTS|pretty)/m,'var $1')+';globalThis.T={toJS,sameValue,terms};');
let bad=0,n=0;const ids=new Set();
const err=(q,m)=>{bad++;console.log('PROBLEM',q.id,m);};
const swap=x=>{/* reorder top-level terms: a+b-c -> -c+b+a */const t=terms(x).split('|');return t.reverse().map((v,i)=>i&&!v.startsWith('-')?'+'+v:v).join('');};
for(const q of BANK){n++;if(ids.has(q.id))err(q,'duplicate id');ids.add(q.id);
  if(!q.why)err(q,'no why');if(!q.l)err(q,'no lesson');
  if(q.type==='type'){const V=q.num?'':(q.vars||'');
    for(const ans of q.ans){if(toJS(ans,V)==null)err(q,'answer does not parse: '+ans);
      if(!sameValue(ans,q.ans[0],V))err(q,'answers differ in value: '+ans);
      const sw=swap(ans);if(!sameValue(sw,ans,V))err(q,'reordered form not equal: '+sw);
      if(q.simplest&&terms(sw)!==terms(ans))err(q,'reordered form fails simplest: '+sw);
      if(!/[^\x00-\x7f]/.test(ans)&&false);}
    /* every character must be typeable on this question's keypad */
    const keys=new Set(q.num?[...'0123456789−/.']:[...'0123456789+−()×÷/.',...(q.vars||''),...(q.sq?['²']:[])]);
    for(const ans of q.ans)for(const ch of ans.replace(/\s/g,''))if(!keys.has(ch))err(q,`"${ch}" in ${ans} is not on the keypad`);
    for(const m of Object.keys(q.mist||{})){if(toJS(m,V)==null)err(q,'mistake does not parse: '+m);if(sameValue(m,q.ans[0],V))err(q,'mistake equals the answer: '+m);}}
  if(q.type==='mcq'||q.type==='tf'){if(!(q.a>=0&&q.a<q.o.length))err(q,'bad a');
    q.o.forEach((_,i)=>{if(i!==q.a&&!(q.whyNot&&q.whyNot[i]))err(q,'no whyNot for option '+i);});}
  if(q.type==='tiles'){for(const ans of q.answers)for(const t of ans)if(!q.tiles.includes(t))err(q,'tile missing: '+t);}
  if(q.type==='line'&&!(q.at>=(q.lo??-5)&&q.at<=(q.hi??5)))err(q,'circle off the line');
  if(q.type==='order'&&new Set(q.items).size!==q.items.length)err(q,'duplicate order items');}
/* the checker itself */
const t=[['52−5y','−5y+52','y',true],['52-5y','52 − 5y','y',true],['3k+4','4+3k','k',true],['6b−8','2(3b−4)','b',true],['4b²','4b×b','b',true],['15','30/2','',true],['−6','-6','',true],['3/4','0.75','',true],['5y−52','52−5y','y',false],['x+','x','x',null]];
for(const [x,y,v,want] of t){const got=toJS(x,v)==null?null:sameValue(x,y,v);if(got!==want){bad++;console.log('CHECKER',x,y,'got',got,'want',want);}}
console.log(`${n} questions, ${bad} problems`);process.exit(bad?1:0);
