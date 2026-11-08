/* French helpers, loaded by every French lesson after ../lessons/engine.js:
   Coco the Parrot (the French tutor), French pronunciation, the 🇬🇧 English translate button,
   and the step-by-step teaching routine (teachFR), conjugation cards and "build the sentence".

   French text on screen is written with fr(french, english). It is spoken with a French voice, and the
   translate button swaps every fr() on the page (stage, speech bubble, exam questions) to its English. */
const FRENCH={subject:'French',home:'../french.html',guide:'Coco the Parrot',
  mascot:`<ellipse cx="40" cy="74" rx="20" ry="4" fill="#1f2433" opacity=".12"/>
    <path d="M22 50 Q14 70 30 74 L40 60 Z" fill="#1d4b9e"/>
    <circle cx="40" cy="44" r="25" fill="#2c66cf" stroke="#1d4b9e" stroke-width="2"/>
    <ellipse cx="47" cy="43" rx="14" ry="13" fill="#fff"/>
    <ellipse cx="27" cy="54" rx="9" ry="13" fill="#1d4b9e" transform="rotate(18 27 54)"/>
    <circle cx="47" cy="39" r="4.6" fill="#1f2433"/><circle cx="48.6" cy="37.4" r="1.6" fill="#fff"/>
    <circle cx="40" cy="49" r="3" fill="#ff9f9f" opacity=".75"/>
    <path d="M56 40 Q70 41 66 52 Q62 47 55 48 Z" fill="#ffb02e" stroke="#d68400" stroke-width="1.5"/>
    <path id="mouth" d="M55 50 Q63 51 61 56 Q57 55 55 52 Z" fill="#e08a00" stroke="#b36b00" stroke-width="1"/>
    <ellipse class="beret" cx="34" cy="21" rx="19" ry="7" fill="#e04848" transform="rotate(-10 34 21)"/>
    <circle cx="35" cy="13" r="2.6" fill="#b02a2a"/>`};

document.head.insertAdjacentHTML('beforeend',`<style>
#mascot .beret{transform-origin:34px 21px;animation:beret 2.4s ease-in-out infinite alternate}
@keyframes beret{to{transform:rotate(-4deg) translateY(-1px)}}
/* translate button (header; in the side layout it sits next to ⚙️) */
#tr{white-space:nowrap;font-size:15px}
#tr.on{background:#e6f7ee;border-color:#18a058;color:#0f7a40}
body.side #tr{display:block;grid-column:2;grid-row:1;justify-self:start;align-self:center;margin-left:52px}
/* French text: tap it to hear it; when translated, English shows on a light green background */
#stage .fx{cursor:pointer}
.fx.en{background:#dff5e8;border-radius:6px;box-shadow:0 0 0 2px #dff5e8;color:#0d5c33}
#text .fx,.fw{color:#1d4b9e}#text .fx.en{color:#0d5c33}
#stage .fw{cursor:pointer}
.fq{font-family:"Avenir Next","Nunito","Segoe UI",system-ui,sans-serif;font-weight:800;color:#1d3f8a}
.fq-step{background:#fff;border:3px solid #c6d8f6;border-radius:16px;padding:6px 16px;
  font-family:"Avenir Next","Nunito","Segoe UI",system-ui,sans-serif;font-size:25px;font-weight:800;color:#1d3f8a;box-shadow:0 3px 0 #c6d8f6}
.fq-step i{margin-left:12px;font-style:normal;font-size:17px;font-weight:700;color:#5a6a8a}
.fq-step.try{font-size:22px;background:#fff8ec;border-color:#f7d3b5;box-shadow:0 3px 0 #f7d3b5;color:#7a2e00}
.fq-step.try i{color:#8a6a55}
.fq-why{background:#fff8e6;border:3px solid #f2c200;border-radius:16px;padding:8px 16px;font-size:17px;font-weight:700;line-height:1.35}
.fq-key{background:#ffe680;border-radius:6px;padding:0 4px;box-shadow:0 0 0 2px #ffd84d}
.fq-end{color:#e04848}
.fq-stem{color:#2c66cf}
.fq-point{font-size:40px;pointer-events:none;z-index:40}
.fq-card{background:#fff;border:3px solid #c6d8f6;border-radius:20px;box-shadow:0 5px 0 #c6d8f6;padding:10px 16px}
.fq-card h4{margin:0 0 6px;font-size:22px;color:#2c66cf}
.fq-row{font-size:23px;font-weight:800;color:#1f2433;line-height:1.5}
.fq-row>.fx{display:flex;align-items:baseline}
.fq-row .e{margin-left:12px;font-size:.72em;color:#0d5c33}
.fq-row .p{white-space:nowrap;min-width:118px;text-align:right;margin-right:12px;color:#6a45d8}.fq-row .p.ap{margin-right:0}
.fq-chip{display:inline-block;padding:6px 14px;border-radius:14px;background:#eef4ff;border:3px solid #bcd2f7;font-size:22px;font-weight:800;color:#1d3f8a}
.fq-tile{display:flex;align-items:center;justify-content:center;min-width:60px;height:56px;padding:0 16px;background:#fff;border:3px solid #2c66cf;border-radius:14px;
  font-size:24px;font-weight:800;color:#1d3f8a;box-shadow:0 4px 0 #c6d8f6;cursor:pointer;user-select:none;-webkit-user-select:none}
.fq-tile:active{transform:translateY(3px);box-shadow:0 1px 0 #c6d8f6}
.fq-del{display:flex;align-items:center;justify-content:center;width:64px;height:56px;background:#eef4ff;border:3px solid #5d9cf5;border-radius:14px;font-size:24px;cursor:pointer}
.fq-slot{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:4px 10px;min-height:72px;padding:6px 14px;border:3px dashed #5d9cf5;border-radius:18px;background:#f5f9ff;
  font-size:30px;font-weight:800;color:#1d3f8a}
.fq-slot i{font-size:18px;font-style:normal;color:#8a9ab5;font-weight:700}
.fq-slot.ok{border-style:solid;border-color:#18a058;background:#e6f7ee;color:#0f7a40}
.fq-slot.bad{border-style:solid;border-color:#e04848;background:#fdecec;color:#b02a2a}
.fq-flag{display:inline-block;width:30px;height:20px;border-radius:3px;vertical-align:middle;background:linear-gradient(90deg,#2c66cf 33%,#fff 33% 66%,#e04848 66%);box-shadow:0 0 0 1px #ccd}
</style>`);

/* ---------- writing French with its English ---------- */
const escA=s=>String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
/* fr(): French text with its English translation (both may contain <b> etc.); the 🇬🇧 button swaps it.
   fw(): a French word being explained in English ("${fw('matière')} means subject"): it stays French in both modes. */
const fw=f=>`<span class="fw">${f}</span>`;
const fr=(f,en)=>`<span class="fx" data-en="${escA(en)}">${f}</span>`;

/* ---------- 🇬🇧 translate button ---------- */
let EN=new URLSearchParams(location.search).get('en')==='1';
function applyEN(root){if(!root||root.nodeType!==1)return;
  const list=[...(root.matches('.fx')?[root]:[]),...root.querySelectorAll('.fx')];
  list.forEach(e=>{if(e.dataset.fr==null)e.dataset.fr=e.innerHTML;const want=EN?e.dataset.en:e.dataset.fr;if(e.innerHTML!==want)e.innerHTML=want;e.classList.toggle('en',EN);});}
document.getElementById('vset').insertAdjacentHTML('beforebegin','<button class="icon" id="tr" title="Show everything in English">🇬🇧 English</button>');
const trBtn=document.getElementById('tr');
function trUI(){trBtn.textContent=EN?'🇫🇷 Français':'🇬🇧 English';trBtn.title=EN?'Back to French':'Show everything in English';trBtn.classList.toggle('on',EN);document.body.classList.toggle('en-mode',EN);}
function setEN(on){EN=on;trUI();applyEN(document.body);beep(EN?760:600,.06);if(lastSay)speak(lastSay);}
trBtn.onclick=()=>setEN(!EN);
addEventListener('keydown',e=>{if(e.key==='t'||e.key==='T')setEN(!EN);});
new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1&&(EN||n.querySelector?.('.fx')||n.matches?.('.fx')))applyEN(n);})))
  .observe(document.body,{childList:true,subtree:true});
trUI();

/* ---------- French voice ----------
   The tutor speaks English with the chosen voice (⚙️) and every fr() part with the device's French voice.
   In English mode the translations are read instead, all in English. */
const FRPREF=[/Thomas|Amélie|Amelie|Audrey|Aurélie|Marie|Daniel \(fr/i,/Google français/i,/Microsoft (Denise|Henri|Julie|Paul|Hortense)/i];
function frVoice(){if(!HAS_TTS)return null;
  const sc=v=>vq(v)*100+(/fr[-_]FR/i.test(v.lang)?50:0)+Math.max(0,...FRPREF.map((r,i)=>r.test(v.name)?FRPREF.length-i:0));
  return speechSynthesis.getVoices().filter(v=>/^fr[-_]/i.test(v.lang)&&!NOVELTY.test(v.name)).sort((a,b)=>sc(b)-sc(a))[0]||null;}
function frClean(t){return t.replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,' et ').replace(/[.…]{2,}|_{2,}/g,', ').replace(/\s\/\s/g,', ')
  .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{FE0F}\u{200D}]/gu,' ').replace(/[«»]/g,'').replace(/\s+/g,' ').replace(/\s+([,!?.])/g,'$1').replace(/^[,\s]+/,'').trim();}
/* split narration into English and French parts */
function speechParts(html){const d=document.createElement('div');d.innerHTML=html;const out=[];
  const push=(fr,t)=>{const l=out[out.length-1];if(l&&l.fr===fr)l.t+=' '+t;else out.push({fr,t});};
  (function walk(n){n.childNodes.forEach(c=>{
    if(c.nodeType===3)push(false,c.textContent.replace(/&/g,'&amp;').replace(/</g,'&lt;'));
    else if(c.nodeType===1){if(c.classList.contains('fw'))push(true,c.innerHTML);else if(c.classList.contains('fx')){if(EN)push(false,c.dataset.en||'');else push(true,c.dataset.fr??c.innerHTML);}
      else if(c.tagName==='BR')push(false,'. ');else walk(c);}});})(d);
  return out.map(p=>({fr:p.fr,t:p.fr?frClean(p.t):cleanSpeech(p.t)})).filter(p=>/[\p{L}\p{N}]/u.test(p.t));}
function speakParts(parts){if(!HAS_TTS)return;speechSynthesis.cancel();speakUntil=0;talk(false);if(!voiceOn||!parts.length)return;
  const my=++speakId,fv=frVoice();
  const words=parts.reduce((n,p)=>n+p.t.split(' ').length,0);
  speakUntil=Date.now()+(words/(2.2*rate))*1000+2500+parts.length*500; /* safety cap if 'end' never fires */
  const us=parts.map((p,i)=>{const u=new SpeechSynthesisUtterance(p.t);
    if(p.fr){if(fv){u.voice=fv;u.lang=fv.lang;}else u.lang='fr-FR';u.rate=rate*.92;u.pitch=1.05;}
    else{if(voice){u.voice=voice;u.lang=voice.lang;}u.rate=rate;u.pitch=1.05;}
    u.onstart=()=>{if(my===speakId)talk(true);};
    if(i===parts.length-1)u.onend=u.onerror=()=>{if(my===speakId){speakUntil=0;talk(false);}};
    return u;});
  const go=()=>us.forEach(u=>speechSynthesis.speak(u));
  if(!speechSynthesis.speaking&&!speechSynthesis.pending)go(); /* direct call keeps iPad/iPhone happy */
  else setTimeout(()=>{if(my===speakId)go();},60);}
speak=html=>speakParts(speechParts(html));
/* Say a French word or sentence on its own (tapping French text on the stage). */
function hearFR(t){speakParts([{fr:true,t:frClean(t)}].filter(p=>p.t));}
stage.addEventListener('click',e=>{const f=e.target.closest('.fx,.fw');if(!f||e.target.closest('.ex-opt,.ex-btn,.bigbtn,button,.sg-chip,.sg-bin,.fq-tile'))return;
  if(!voiceOn){voiceOn=true;vUI();}
  if(EN&&f.classList.contains('fx'))speakParts([{fr:false,t:cleanSpeech(f.dataset.en||'')}]);else hearFR(f.dataset.fr??f.innerHTML);
  f.animate([{transform:'scale(1)'},{transform:'scale(1.12)'},{transform:'scale(1)'}],{duration:350});});

/* ---------- exam checks with translations ----------
   examCheck items may add en (the question in English), oe (each choice in English) and men (a model answer in English). */
{const ask0=ask,reveal0=reveal;
  ask=(w,it)=>ask0(w,Object.assign({},it,{q:it.en!=null?fr(it.q,it.en):it.q,o:it.o.map((t,i)=>it.oe&&it.oe[i]!=null?fr(t,it.oe[i]):t)}));
  reveal=(w,it)=>reveal0(w,Object.assign({},it,{q:it.en!=null?fr(it.q,it.en):it.q,model:it.men!=null?fr(it.model,it.men):it.model}));}

/* ---------- small helpers ---------- */
const w0=ms=>new Promise(r=>setTimeout(r,ms));
/* clear the stage but keep some elements (e.g. a picture used by several questions) */
const clear=keep=>[...stage.children].forEach(e=>{if(!keep||!keep.includes(e))e.remove();});
/* a conjugated form with its ending in red: endF('parlons','ons') */
const endF=(form,end)=>end?`<span class="fq-stem">${form.slice(0,form.length-end.length)}</span><span class="fq-end">${end}</span>`:form;
const PRON=['je','tu','il / elle','nous','vous','ils / elles'];
const PRON_EN=['I','you','he / she','we','you','they'];

/* A conjugation card: rows [[pronoun, form, ending, english]] appear one at a time with show(i) (or all with showAll()).
   Each row is French with its English, and is read aloud in French as it appears. */
function conjCard(x,y,wd,{verb,en,rows,fs}){
  const c=mk('fq-card',`left:${x}px;top:${y}px;width:${wd}px`,`<h4>${fr(verb,verb+' = '+en)}</h4>`);pop(c);
  const R=rows.map(([p,f,e,eng])=>{const el=document.createElement('div');el.className='fq-row';el.style.visibility='hidden';if(fs)el.style.fontSize=fs+'px';
    const frH=`<span class="p${/'$/.test(p)?' ap':''}">${p}</span><span>${endF(f,e)}</span>`;
    el.innerHTML=fr(frH,frH+`<span class="e">= ${eng}</span>`); /* English mode keeps the French form and adds its English */c.appendChild(el);return el;});
  const show=async(i,w)=>{const r=R[i];r.style.visibility='visible';pop(r);point(r);beep(560+i*60,.06);
    if(w){const [p,f]=rows[i];say(fr((/'$/.test(p)?p:p.split(' / ')[0]+' ')+f,rows[i][3]));await w(1500);}};
  return{el:c,rows:R,show,showAll:()=>R.forEach((r,i)=>{r.style.visibility='visible';pop(r,i*60);})};}

/* ---------- teaching a worksheet question step by step (same pattern as Maths) ---------- */
/* A pointing hand that glides to whatever Coco is talking about (one per scene). */
function point(el){
  let h=stage.querySelector('.fq-point');
  if(!h){h=mk('fq-point','left:0;top:0;opacity:0','👉');loop(h,[{marginLeft:'0px'},{marginLeft:'-9px'}],550,{direction:'alternate'});}
  let l=0,t=0,e=el;while(e&&e!==stage){l+=e.offsetLeft;t+=e.offsetTop;e=e.offsetParent;}
  const x=Math.max(0,l-50),y=t+Math.min(el.offsetHeight,60)/2-26;
  an(h,[{opacity:1,transform:`translate(${x}px,${y}px)`}],{duration:550});return h;}
/* Light up the first appearance of `word` inside a question card (only in the text being shown, French or English). */
function mark(card,word){const q=card.querySelector('.q'),tw=document.createTreeWalker(q,NodeFilter.SHOW_TEXT);let n;
  while((n=tw.nextNode())&&!n.textContent.includes(word));if(!n)return null;
  const i=n.textContent.indexOf(word),rest=n.splitText(i);rest.splitText(word.length);
  const el=document.createElement('span');el.className='fq-key';rest.replaceWith(el);el.textContent=word;
  const host=el.closest('.fx');if(host&&!EN)host.dataset.fr=host.innerHTML;
  el.animate([{background:'#fff'},{background:'#ffd84d'},{background:'#ffe680'}],{duration:900});return el;}
/* The whole routine for one worksheet question:
   1. the question appears on its own (no answer) and Coco reads it out (French parts in the French voice);
   2. its key words light up one at a time and Coco says what each means (keys: [[French word, spoken explanation, English word]]);
   3. `before` steps give a hint or try an example;
   4. the student thinks, then taps "Show me";
   5. `steps` build the answer one line at a time; 6. the answer is stamped and `why` explains it.
   A step is {show (html line, optional), say (spoken), act (async animation, optional), try (true = orange "hint" line)}.
   q is the French question (use fr() for it), answer the French answer (fr() too). */
async function teachFR(w,{src,q,read,keys=[],before=[],steps=[],answer,why,x=40,y=12,wd=880,workX,workY,
    think:th=`Your turn to think. What is the answer? When you're ready, tap <b>Show me</b>.`}){
  const c=mk('ws-card',`left:${x}px;top:${y}px;width:${wd}px;z-index:20`,`<div class="src">${src}</div><div class="q">${q}</div>`+
    `<div class="stamp" style="visibility:hidden">✔ ${answer}</div>`);pop(c);
  await w(60);point(c.querySelector('.q'));
  say(`Here's the question. ${read||q}`);await w(1500);
  for(const [word,means,enWord] of keys){const k=mark(c,EN&&enWord?enWord:word);if(k)point(k);say(means);await w(1800);}
  const wx=workX??x+56,ww=x+wd-wx;let wy=workY??y+c.offsetHeight+14;
  const line=async st=>{if(st.act)await st.act();
    if(st.show){const e=mk('fq-step'+(st.try?' try':''),`left:${wx}px;top:${wy}px;max-width:${ww}px`,st.show);pop(e);await w(30);wy+=e.offsetHeight+10;point(e);}
    if(st.say)say(st.say);await w(st.wait||1800);};
  for(const st of before)await line(st);
  say(th);let open=false;
  const b=btn('ex-btn green',`left:${wx}px;top:${wy}px;width:220px;z-index:30`,'👀 Show me',()=>{open=true;});pop(b);point(b);
  window.AUTOPLAY=()=>{open=true;};
  await w.until(()=>open);window.AUTOPLAY=null;b.remove();
  for(const st of steps)await line(st);
  const sp=c.querySelector('.stamp');sp.style.visibility='visible';
  an(sp,[{transform:'scale(3) rotate(-20deg)',opacity:0},{transform:'rotate(-2deg)',opacity:1}],{duration:500,fill:'both',easing:'cubic-bezier(.5,1.6,.5,1)'});yay();point(sp);
  say(`So the answer is <b>${answer}</b>.`);await w(1600);
  if(why){const e=mk('fq-why',`left:${wx}px;top:${wy}px;width:${ww}px`,'💡 '+why);pop(e);point(e);say(why);await w(2200);}
  return c;}

/* ---------- "Build the sentence" ----------
   The student taps word tiles in order, then presses Check. tiles: words to choose from (add a few wrong ones);
   answer: list of accepted word sequences. q: the instruction (with fr()). Resolves to {ok, built, y}. */
const joinFR=a=>a.join(' ').replace(/' /g,"'").replace(/ ([?!])/g,' $1');
async function buildSentence(w,{q,src,tiles,answer,top=24}){
  const box=mk('ex-q',`top:${top}px`,(src?`<span class="src">${src}</span>`:'')+q);pop(box);
  await w(60);const y=top+box.offsetHeight+16;
  const slot=mk('fq-slot',`left:110px;top:${y}px;width:740px`,'');pop(slot);
  let seq=[],checked=false,ck=null,ckTop=y+162;
  const show=()=>{slot.innerHTML=seq.length?`<span>${joinFR(seq)}</span>`:'<i>Tap the words in order to build the sentence</i>';
    if(seq.length&&!ck&&!checked)ck=btn('ex-btn green',`left:380px;top:${ckTop}px;width:200px`,'Check ✔',()=>{checked=true;});
    if(!seq.length&&ck){ck.remove();ck=null;}};
  const T=tiles.map(t=>btn('fq-tile','left:0;top:0;visibility:hidden',t,()=>{if(checked)return;seq.push(t);beep(560+seq.length*40,.05);show();}));
  const del=btn('fq-del','left:0;top:0;visibility:hidden','⌫',()=>{if(checked)return;seq.pop();beep(300,.05);show();});
  await w(30);
  const all=[...T,del],gap=12,rows=[[]];let rw=0;
  all.forEach(b=>{const bw=b.offsetWidth;if(rw+bw>880&&rows[rows.length-1].length){rows.push([]);rw=0;}rows[rows.length-1].push(b);rw+=bw+gap;});
  rows.forEach((r,ri)=>{let x=480-(r.reduce((s,b)=>s+b.offsetWidth+gap,0)-gap)/2;r.forEach((b,i)=>{b.style.left=x+'px';b.style.top=(y+90+ri*68)+'px';b.style.visibility='';pop(b,i*40);x+=b.offsetWidth+gap;});});
  ckTop=y+90+rows.length*68+6;show();
  window.AUTOPLAY=()=>{if(!seq.length){seq=answer[0].slice();show();}};
  await w.until(()=>checked);window.AUTOPLAY=null;
  if(ck)ck.remove();T.forEach(b=>b.remove());del.remove();
  const norm=a=>joinFR(a).toLowerCase().replace(/\s+/g,' ').trim();const ok=answer.some(a=>norm(a)===norm(seq));
  slot.classList.add(ok?'ok':'bad');if(ok){yay();confetti(40);}else{boo();shake(slot);}
  return{ok,built:joinFR(seq),y:y+86};}
