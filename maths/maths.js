/* Maths helpers, loaded by every Maths lesson after ../lessons/engine.js:
   Pi the Robot (the Maths tutor), fractions, and the "build the expression" activity. */
const MATHS={subject:'Maths',home:'../maths.html',guide:'Pi the Robot',
  mascot:`<line x1="40" y1="5" x2="40" y2="16" stroke="#7a2e00" stroke-width="3"/>
    <circle class="bulb" cx="40" cy="6" r="5" fill="#ffd84d" stroke="#e0a800" stroke-width="1.5"/>
    <rect x="5" y="31" width="9" height="18" rx="3" fill="#c4520e"/><rect x="66" y="31" width="9" height="18" rx="3" fill="#c4520e"/>
    <rect x="12" y="15" width="56" height="50" rx="14" fill="#f5a54a" stroke="#c4520e" stroke-width="2.5"/>
    <rect x="19" y="23" width="42" height="34" rx="9" fill="#fff6e8"/>
    <circle cx="31" cy="36" r="4.2" fill="#1f2433"/><circle cx="49" cy="36" r="4.2" fill="#1f2433"/>
    <circle cx="32.5" cy="34.6" r="1.4" fill="#fff"/><circle cx="50.5" cy="34.6" r="1.4" fill="#fff"/>
    <path id="mouth" d="M33 47 Q40 53 47 47" stroke="#1f2433" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <circle cx="25" cy="45" r="3" fill="#ff9f9f" opacity=".7"/><circle cx="55" cy="45" r="3" fill="#ff9f9f" opacity=".7"/>
    <rect x="29" y="65" width="22" height="13" rx="4" fill="#c4520e"/>
    <text x="40" y="75.5" text-anchor="middle" font-size="11" font-weight="800" fill="#fff" font-family="Georgia,serif">π</text>`};
document.head.insertAdjacentHTML('beforeend',`<style>
#mascot .bulb{animation:bulb 1.1s ease-in-out infinite alternate}
@keyframes bulb{to{fill:#fff3a6;filter:drop-shadow(0 0 4px #ffd84d)}}
.fr{display:inline-flex;flex-direction:column;vertical-align:middle;text-align:center;line-height:1.05;margin:0 .12em}
.fr>span:first-child{border-bottom:.09em solid currentColor;padding:0 .15em}
.mx{font-family:"Avenir Next","Nunito","Segoe UI",system-ui,sans-serif;font-weight:800;color:#7a2e00}
.mx-tile{display:flex;align-items:center;justify-content:center;min-width:64px;height:58px;padding:0 16px;background:#fff;border:3px solid #e06a1b;border-radius:14px;
  font-size:27px;font-weight:800;color:#7a2e00;box-shadow:0 4px 0 #f7d3b5;cursor:pointer;user-select:none;-webkit-user-select:none}
.mx-tile:active{transform:translateY(3px);box-shadow:0 1px 0 #f7d3b5}
.mx-del{display:flex;align-items:center;justify-content:center;width:64px;height:58px;background:#fff1e6;border:3px solid #f5a54a;border-radius:14px;font-size:26px;cursor:pointer}
.mx-slot{display:flex;align-items:center;justify-content:center;gap:8px;min-height:74px;border:3px dashed #f5a54a;border-radius:18px;background:#fffaf3;
  font-size:34px;font-weight:800;color:#7a2e00}
.mx-slot i{font-size:18px;font-style:normal;color:#b39a85;font-weight:700}
.mx-slot.ok{border-style:solid;border-color:#18a058;background:#e6f7ee;color:#0f7a40}
.mx-slot.bad{border-style:solid;border-color:#e04848;background:#fdecec;color:#b02a2a}
.mx-key{background:#ffe680;border-radius:6px;padding:0 4px;box-shadow:0 0 0 2px #ffd84d}
.mx-step{background:#fff;border:3px solid #f7d3b5;border-radius:16px;padding:6px 16px;
  font-family:"Avenir Next","Nunito","Segoe UI",system-ui,sans-serif;font-size:27px;font-weight:800;color:#7a2e00;box-shadow:0 3px 0 #f7d3b5}
.mx-step i{margin-left:12px;font-style:normal;font-size:17px;font-weight:700;color:#8a6a55}
.mx-step.try{font-size:23px;background:#eef4ff;border-color:#bcd2f7;box-shadow:0 3px 0 #bcd2f7;color:#1d4b9e}
.mx-step.try i{color:#4a6a9e}
.mx-why{background:#fff8e6;border:3px solid #f2c200;border-radius:16px;padding:8px 16px;font-size:17px;font-weight:700;line-height:1.35}
.mx-point{font-size:40px;pointer-events:none;z-index:40}
</style>`);
/* A fraction for on-screen maths, e.g. frac('t',2). The voice reads it as "t over 2". */
const frac=(n,d)=>`<span class="fr"><span>${n}</span><span>${d}</span></span>`;

/* "Build the expression": the student taps tiles in order to build an answer, then presses Check.
   tiles: the tiles to choose from (include a few wrong ones); answer: a list of accepted tile sequences
   (they are compared as text, so ['y','÷','2'] and ['y÷2'] match). Resolves to {ok, built}. */
async function buildExpr(w,{q,src,tiles,answer,top=24}){
  const box=mk('ex-q',`top:${top}px`,(src?`<span class="src">${src}</span>`:'')+q);pop(box);
  await w(60);const y=top+box.offsetHeight+16;
  const slot=mk('mx-slot',`left:150px;top:${y}px;width:660px`,'');pop(slot);
  let seq=[],checked=false,ck=null,ckTop=y+162;
  const show=()=>{slot.innerHTML=seq.length?seq.map(t=>`<span>${t}</span>`).join(''):'<i>Tap the tiles in order to build your answer</i>';
    if(seq.length&&!ck&&!checked)ck=btn('ex-btn green',`left:380px;top:${ckTop}px;width:200px`,'Check ✔',()=>{checked=true;});
    if(!seq.length&&ck){ck.remove();ck=null;}};
  const T=tiles.map(t=>{const b=btn('mx-tile','left:0;top:0;visibility:hidden',t,()=>{if(checked)return;seq.push(t);beep(560+seq.length*40,.05);show();});return b;});
  const del=btn('mx-del','left:0;top:0;visibility:hidden','⌫',()=>{if(checked)return;seq.pop();beep(300,.05);show();});
  await w(30);
  /* lay the tiles out in centred rows under the answer box */
  const all=[...T,del],gap=12,rows=[[]];let rw=0;
  all.forEach(b=>{const bw=b.offsetWidth;if(rw+bw>880&&rows[rows.length-1].length){rows.push([]);rw=0;}rows[rows.length-1].push(b);rw+=bw+gap;});
  rows.forEach((r,ri)=>{let x=480-(r.reduce((s,b)=>s+b.offsetWidth+gap,0)-gap)/2;r.forEach((b,i)=>{b.style.left=x+'px';b.style.top=(y+92+ri*70)+'px';b.style.visibility='';pop(b,i*40);x+=b.offsetWidth+gap;});});
  ckTop=y+92+rows.length*70+6;show();
  window.AUTOPLAY=()=>{if(!seq.length){seq=answer[0].slice();show();}};
  await w.until(()=>checked);window.AUTOPLAY=null;
  if(ck)ck.remove();T.forEach(b=>b.remove());del.remove();
  const norm=a=>a.join('').replace(/\s+/g,'');const ok=answer.some(a=>norm(a)===norm(seq));
  slot.classList.add(ok?'ok':'bad');if(ok){yay();confetti(40);}else{boo();shake(slot);}
  return{ok,built:seq.join(' '),y:y+90};}

/* ---------- teaching a worksheet question step by step ---------- */
/* A pointing hand that glides to whatever Pi is talking about (one per scene). */
function point(el){
  let h=stage.querySelector('.mx-point');
  if(!h){h=mk('mx-point','left:0;top:0;opacity:0','👉');loop(h,[{marginLeft:'0px'},{marginLeft:'-9px'}],550,{direction:'alternate'});}
  /* stage position from offsets (not the screen rectangle, which is still shrunk while an element pops in) */
  let l=0,t=0,e=el;while(e&&e!==stage){l+=e.offsetLeft;t+=e.offsetTop;e=e.offsetParent;}
  const x=Math.max(0,l-50),y=t+Math.min(el.offsetHeight,60)/2-26;
  an(h,[{opacity:1,transform:`translate(${x}px,${y}px)`}],{duration:550});return h;}
/* Light up the first appearance of `word` inside a question card, so the student sees which words matter. */
function mark(card,word){const q=card.querySelector('.q'),i=q.innerHTML.indexOf(word);if(i<0)return null;
  q.innerHTML=q.innerHTML.slice(0,i)+'<span class="mx-key">'+word+'</span>'+q.innerHTML.slice(i+word.length);
  const k=q.querySelectorAll('.mx-key');const el=k[k.length-1];
  el.animate([{background:'#fff'},{background:'#ffd84d'},{background:'#ffe680'}],{duration:900});return el;}
/* The whole routine for one worksheet question:
   1. the question appears on its own (no answer) and Pi reads it out;
   2. its key words light up one at a time and Pi says what each means (keys: [[word, spoken meaning]]);
   3. `before` steps try the idea with a real number;
   4. the student thinks, then taps "Show me";
   5. `steps` build the answer one line at a time; 6. the answer is stamped and `why` explains it.
   A step is {show (html line, optional), say (spoken), act (async animation, optional), try (true = blue "number" line)}. */
async function teachQ(w,{src,q,read,keys=[],before=[],steps=[],answer,why,x=40,y=12,wd=880,workX,workY,
    think:th=`Your turn to think. What is the answer? When you're ready, tap <b>Show me</b>.`}){
  const c=mk('ws-card',`left:${x}px;top:${y}px;width:${wd}px;z-index:20`,`<div class="src">${src}</div><div class="q">${q}</div>`+
    `<div class="stamp" style="visibility:hidden">✔ ${answer}</div>`);pop(c);
  await w(60);point(c.querySelector('.q'));
  say(`Here's the question. ${read||q}`);await w(1500);
  for(const [word,means] of keys){const k=mark(c,word);if(k)point(k);say(means);await w(1800);}
  const wx=workX??x+56,ww=x+wd-wx;let wy=workY??y+c.offsetHeight+14;
  const line=async st=>{if(st.act)await st.act();
    if(st.show){const e=mk('mx-step'+(st.try?' try':''),`left:${wx}px;top:${wy}px;max-width:${ww}px`,st.show);pop(e);await w(30);wy+=e.offsetHeight+10;point(e);}
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
  if(why){const e=mk('mx-why',`left:${wx}px;top:${wy}px;width:${ww}px`,'💡 '+why);pop(e);point(e);say(why);await w(2200);}
  return c;}
