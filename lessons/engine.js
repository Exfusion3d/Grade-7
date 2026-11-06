/* Grade 7 Science lesson engine (shared by every lesson page).
   A lesson page loads engine.css + engine.js, then calls Lesson.start({...}). */
document.body.insertAdjacentHTML('afterbegin',`<canvas id="fx"></canvas>
<div id="rotate"><div class="ph">📱</div><h2>Turn your phone sideways!</h2><p>Professor Atom's lessons fit best in landscape.</p><button onclick="document.body.classList.add('anyway')">Keep it upright anyway</button></div>
<div id="holder"><div id="app">
  <header>
    <div class="brand" id="brand"></div>
    <div id="dots"></div>
    <button class="icon" id="vset" title="Voice settings">⚙️</button>
    <a class="icon home" href="../index.html" title="All activities">🏠</a>
    <button class="icon" id="snd">🔊</button>
  </header>
  <div id="narr">
    <svg id="mascot" viewBox="0 0 80 80">
      <g class="orb" fill="none" stroke="#6a45d8" stroke-width="3">
        <ellipse cx="40" cy="40" rx="37" ry="13"/><ellipse cx="40" cy="40" rx="37" ry="13" transform="rotate(60 40 40)"/><ellipse cx="40" cy="40" rx="37" ry="13" transform="rotate(-60 40 40)"/>
      </g>
      <circle cx="40" cy="40" r="18" fill="#ffd84d" stroke="#e0a800" stroke-width="2"/>
      <circle cx="34" cy="37" r="2.8" fill="#1f2433"/><circle cx="46" cy="37" r="2.8" fill="#1f2433"/>
      <path id="mouth" d="M33 45 Q40 52 47 45" stroke="#1f2433" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      <circle cx="29" cy="44" r="3" fill="#ff9f9f" opacity=".7"/><circle cx="51" cy="44" r="3" fill="#ff9f9f" opacity=".7"/>
    </svg>
    <div id="bubble" title="Tap to hear this again"><span class="again">🔈 tap to hear again</span><div id="stitle"></div><div id="text"></div></div>
  </div>
  <div id="stage"></div>
  <footer>
    <button class="nav" id="back">◀ Back</button>
    <button class="nav" id="replay">⟲ Replay</button>
    <div class="voice"><button id="vbtn">🗣️ Tutor voice: on</button><select id="vsel" title="Choose a voice"></select><select id="vrate" title="Speaking speed"><option value="0.85">🐢 Slow</option><option value="1" selected>Normal</option><option value="1.15">🐇 Fast</option></select><a class="vhelp" href="../index.html#voice-help">🗣️ Sound robotic? Get a better voice ➜</a></div>
    <div class="sp" id="count"></div>
    <button class="nav" id="next">Next ▶</button>
  </footer>
</div></div>`);
let SC=[],LCFG={};
/* ====================== basics ====================== */
const $=s=>document.querySelector(s);
const stage=$('#stage');
let token=0,cur=0,soundOn=true,actx=null;
try{soundOn=localStorage.getItem('pta_sound')!=='0';}catch(e){}
function beep(f=600,d=.08,type='triangle',v=.12,t0=0){if(!soundOn)return;try{actx=actx||new (window.AudioContext||window.webkitAudioContext)();if(actx.state==='suspended')actx.resume();
  const o=actx.createOscillator(),g=actx.createGain();o.type=type;o.frequency.value=f;o.connect(g);g.connect(actx.destination);const t=actx.currentTime+t0;
  g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.start(t);o.stop(t+d+.02);}catch(e){}}
const yay=()=>{[523,659,784,1047].forEach((f,i)=>beep(f,.25,'triangle',.12,i*.1));};
const boo=()=>{beep(220,.25,'sawtooth',.06);beep(160,.3,'sawtooth',.06,.12);};
/* ---------- tutor voice (Web Speech API) ---------- */
const HAS_TTS='speechSynthesis' in window&&'SpeechSynthesisUtterance' in window;
let voiceOn=true,voice=null,rate=1,speakUntil=0,speakId=0,lastSay='';
try{voiceOn=localStorage.getItem('pta_voice')!=='0';rate=+(localStorage.getItem('pta_rate')||1);}catch(e){}
const NOVELTY=/Albert|Bad News|Bahh|Bells|Boing|Bubbles|Cellos|Good News|Jester|Organ|Superstar|Trinoids|Whisper|Wobble|Zarvox|Fred|Junior|Ralph|Kathy|Grandma|Grandpa|Eddy|Flo|Reed|Rocko|Sandy|Shelley/;
function voices(){return HAS_TTS?speechSynthesis.getVoices().filter(v=>/^en[-_]/i.test(v.lang)&&!NOVELTY.test(v.name)):[];}
function pickVoice(){const vs=voices();if(!vs.length)return;let saved='';try{saved=localStorage.getItem('pta_vname')||'';}catch(e){}
  let v=vs.find(x=>x.name===saved);
  if(!v){const pref=[/Enhanced|Premium|Natural|Neural/i,/Google UK English Female/,/Serena|Stephanie|Kate|Martha/,/Daniel|Arthur|Oliver/,/Google UK English Male/,/Microsoft (Sonia|Libby|Hazel|Ryan)/,/Samantha|Karen|Moira|Tessa/,/Google US English/,/Microsoft (Aria|Jenny|Zira)/];
    const gb=vs.filter(x=>/en[-_]GB/i.test(x.lang));for(const r of pref){v=gb.find(x=>r.test(x.name))||vs.find(x=>r.test(x.name));if(v)break;}}
  voice=v||vs.find(x=>/en[-_]GB/i.test(x.lang))||vs[0];
  const sel=document.getElementById('vsel');if(sel){sel.innerHTML=vs.map(x=>`<option ${x===voice?'selected':''}>${x.name}</option>`).join('');}}
if(HAS_TTS){pickVoice();speechSynthesis.onvoiceschanged=pickVoice;}
function cleanSpeech(html){let t=html.replace(/<br\s*\/?>/gi,'. ').replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/&amp;/g,' and ');
  t=t.replace(/\((?:[A-Z][a-z]?)\)/g,'').replace(/÷/g,' divided by ').replace(/≈/g,' about ').replace(/[→➡]/g,', ').replace(/=/g,' equals ').replace(/%/g,' percent').replace(/°C/g,' degrees Celsius')
     .replace(/\bB\)/g,'B,').replace(/\bvs\b/g,'versus').replace(/\be\.g\./g,'for example');
  const EMO=/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{2190}-\u{21FF}\u{FE0F}\u{200D}\u{20E3}]+/gu;
  t=t.replace(/Try Fe, Au and O!/,'Try iron, gold and oxygen!');
  t=t.replace(/_{2,}/g,' blank ');
  t=t.replace(/(\d)\s*A\b/g,'$1 amps').replace(/\bamps \(A\)/g,'amps');
  t=t.replace(new RegExp('([a-z0-9])\\s*'+EMO.source+'\\s+(?=[A-Z])','gu'),'$1. ').replace(EMO,' ');
  t=t.replace(/\b[A-Z]{3,}\b/g,w=>w.toLowerCase());
  return t.replace(/…/g,'... ').replace(/\s+/g,' ').replace(/\s+([.,!?])/g,'$1').trim();}
function talk(on){$('#mascot').classList.toggle('talking',on);}
function speak(html){if(!HAS_TTS)return;speechSynthesis.cancel();speakUntil=0;talk(false);if(!voiceOn)return;
  const t=cleanSpeech(html);if(!t)return;const my=++speakId;
  const u=new SpeechSynthesisUtterance(t);if(voice){u.voice=voice;u.lang=voice.lang;}else u.lang='en-GB';u.rate=rate;u.pitch=1.05;
  speakUntil=Date.now()+(t.split(' ').length/(2.4*rate))*1000+2500; /* safety cap if 'end' never fires */
  u.onstart=()=>{if(my===speakId)talk(true);};u.onend=u.onerror=()=>{if(my===speakId){speakUntil=0;talk(false);}};
  if(!speechSynthesis.speaking&&!speechSynthesis.pending)speechSynthesis.speak(u); /* direct call keeps iPad/iPhone happy */
  else setTimeout(()=>{if(my===speakId)speechSynthesis.speak(u);},60);}
function stopVoice(){speakId++;speakUntil=0;talk(false);if(HAS_TTS)speechSynthesis.cancel();}
/* wait at least ms AND until the tutor has finished speaking */
function sleep(ms,my){return new Promise((res,rej)=>{const t0=Date.now();(function tick(){if(my!==token)return rej('cancel');
  if(Date.now()-t0>=ms&&!(voiceOn&&speakUntil&&Date.now()<speakUntil))return res();setTimeout(tick,100);})();});}
function mk(cls,css,html,parent){const e=document.createElement('div');if(cls)e.className=cls;e.style.cssText='position:absolute;'+(css||'');if(html!=null)e.innerHTML=html;(parent||stage).appendChild(e);return e;}
function an(e,kf,o){const op=Object.assign({duration:600,easing:'cubic-bezier(.2,.8,.2,1)',fill:'forwards'},o||{});const a=e.animate(kf,op);
  return Promise.race([a.finished.catch(()=>{}),new Promise(r=>setTimeout(r,op.duration+(op.delay||0)+80))]);}
function loop(e,kf,dur,o){return e.animate(kf,Object.assign({duration:dur,iterations:Infinity,easing:'ease-in-out'},o||{}));}
function pop(e,delay){return an(e,[{transform:'scale(0)',opacity:0},{transform:'scale(1.1)',opacity:1,offset:.7},{transform:'scale(1)',opacity:1}],{duration:500,delay:delay||0});}
function shake(e){e.animate([{transform:'translateX(0)'},{transform:'translateX(-8px)'},{transform:'translateX(8px)'},{transform:'translateX(-5px)'},{transform:'translateX(0)'}],{duration:400});}
function say(html){lastSay=html;speak(html);const t=$('#text');t.innerHTML=html;t.animate([{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'none'}],{duration:350});
  $('#mascot').animate([{transform:'translateY(0)'},{transform:'translateY(-9px) rotate(-6deg)'},{transform:'translateY(0)'}],{duration:450});beep(880,.04,'sine',.05);}

/* ====================== confetti ====================== */
const cv=$('#fx'),cx=cv.getContext('2d');let parts=[];
function rs(){cv.width=innerWidth;cv.height=innerHeight;}addEventListener('resize',rs);rs();
function confetti(n=120){const cols=['#6a45d8','#2c66cf','#17935b','#e06a1b','#ffd84d','#e04848'];const start=!parts.length;
  for(let i=0;i<n;i++)parts.push({x:innerWidth*(.2+Math.random()*.6),y:innerHeight*.35,vx:(Math.random()-.5)*14,vy:-Math.random()*12-4,r:Math.random()*7+4,c:cols[i%6],a:Math.random()*6,va:(Math.random()-.5)*.3,l:140});
  if(start)requestAnimationFrame(fx);}
function fx(){cx.clearRect(0,0,cv.width,cv.height);parts.forEach(p=>{p.vy+=.33;p.x+=p.vx;p.y+=p.vy;p.a+=p.va;p.l--;cx.save();cx.translate(p.x,p.y);cx.rotate(p.a);
  cx.globalAlpha=Math.max(0,Math.min(1,p.l/40));cx.fillStyle=p.c;cx.fillRect(-p.r/2,-p.r/4,p.r,p.r/2);cx.restore();});parts=parts.filter(p=>p.l>0&&p.y<cv.height+50);
  if(parts.length)requestAnimationFrame(fx);else cx.clearRect(0,0,cv.width,cv.height);}

/* ====================== periodic table data ====================== */
const SYM='H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr Rf Db Sg Bh Hs Mt Ds Rg Cn Nh Fl Mc Lv Ts Og'.split(' ');
const NAME='Hydrogen Helium Lithium Beryllium Boron Carbon Nitrogen Oxygen Fluorine Neon Sodium Magnesium Aluminium Silicon Phosphorus Sulfur Chlorine Argon Potassium Calcium Scandium Titanium Vanadium Chromium Manganese Iron Cobalt Nickel Copper Zinc Gallium Germanium Arsenic Selenium Bromine Krypton Rubidium Strontium Yttrium Zirconium Niobium Molybdenum Technetium Ruthenium Rhodium Palladium Silver Cadmium Indium Tin Antimony Tellurium Iodine Xenon Caesium Barium Lanthanum Cerium Praseodymium Neodymium Promethium Samarium Europium Gadolinium Terbium Dysprosium Holmium Erbium Thulium Ytterbium Lutetium Hafnium Tantalum Tungsten Rhenium Osmium Iridium Platinum Gold Mercury Thallium Lead Bismuth Polonium Astatine Radon Francium Radium Actinium Thorium Protactinium Uranium Neptunium Plutonium Americium Curium Berkelium Californium Einsteinium Fermium Mendelevium Nobelium Lawrencium Rutherfordium Dubnium Seaborgium Bohrium Hassium Meitnerium Darmstadtium Roentgenium Copernicium Nihonium Flerovium Moscovium Livermorium Tennessine Oganesson'.split(' ');
const NONMET=new Set('H He C N O F Ne P S Cl Ar Se Br Kr I Xe Rn Og'.split(' '));
const SEMI=new Set('B Si Ge As Sb Te At'.split(' '));
const GAS=new Set('H He N O F Ne Cl Ar Kr Xe Rn'.split(' '));
const kind=s=>NONMET.has(s)?'nonmetal':SEMI.has(s)?'semi':'metal';
const KLABEL={metal:['Metal','#f7ad5f','#5c2c00'],nonmetal:['Non-metal','#5d9cf5','#fff'],semi:['In-between (metalloid)','#c9b6f4','#3b2477']};
function POS(z){
  if(z===1)return[1,1];if(z===2)return[18,1];
  if(z<=4)return[z-2,2];if(z<=10)return[z+8,2];
  if(z<=12)return[z-10,3];if(z<=18)return[z,3];
  if(z<=36)return[z-18,4];if(z<=54)return[z-36,5];
  if(z<=56)return[z-54,6];if(z===57)return[3,6];if(z<=71)return[z-54,9];if(z<=86)return[z-68,6];
  if(z<=88)return[z-86,7];if(z===89)return[3,7];if(z<=103)return[z-86,10];return[z-100,7];}
function makeTable({x,y,s,nums=false,on=false}){
  const wrap=mk('','left:0;top:0;width:960px;height:520px;pointer-events:none');const tiles={};
  SYM.forEach((sym,i)=>{const z=i+1,[c,r]=POS(z);const tx=x+(c-1)*s,ty=y+(r>=9?(r-2)*s+s*.3:(r-1)*s);
    const t=mk('tile '+kind(sym)+(on?' on':''),`left:${tx}px;top:${ty}px;width:${s-3}px;height:${s-3}px;font-size:${Math.round(s*.38)}px;border-radius:${Math.max(3,Math.round(s*.16))}px;pointer-events:auto`,(nums?`<i>${z}</i>`:'')+sym,wrap);
    tiles[sym]={el:t,x:tx,y:ty,c,r,z,sym,s};});
  return{wrap,tiles,s,x,y,all:()=>Object.values(tiles)};}
/* create a big tile at (tx,ty) that flies out of a table tile */
function flyFrom(o,el,tx,ty,dur=800){const w=el.offsetWidth||60;el.style.transformOrigin='0 0';
  return an(el,[{transform:`translate(${o.x-tx}px,${o.y-ty}px) scale(${(o.s-3)/w})`},{transform:'none'}],{duration:dur,easing:'cubic-bezier(.3,1.25,.5,1)'});}

/* ====================== mini animations ====================== */
const M={
 shiny(a){const b=mk('','left:39px;top:28px;width:120px;height:80px;border-radius:14px;background:linear-gradient(110deg,#8f98a8 0%,#dfe4ec 40%,#fff 50%,#dfe4ec 60%,#8f98a8 100%);background-size:300% 100%;box-shadow:inset 0 -6px 0 rgba(0,0,0,.12)',null,a);
   loop(b,[{backgroundPosition:'120% 0'},{backgroundPosition:'-20% 0'}],1800,{easing:'linear'});
   [[24,10,0],[150,20,600],[140,92,1100]].forEach(([x,y,d])=>{const s=mk('',`left:${x}px;top:${y}px;font-size:26px`,'✨',a);loop(s,[{transform:'scale(0)',opacity:0},{transform:'scale(1.2) rotate(30deg)',opacity:1},{transform:'scale(0)',opacity:0}],1500,{delay:d});});},
 elec(a){for(let i=0;i<7;i++){const d=mk('','left:20px;top:20px;width:12px;height:12px;border-radius:50%;background:#2c66cf;box-shadow:0 0 8px #5aa0f0;z-index:1',null,a);
     d.animate([{transform:'translate(0,0)'},{transform:'translate(154px,0)',offset:.333},{transform:'translate(154px,80px)',offset:.5},{transform:'translate(0,80px)',offset:.833},{transform:'translate(0,0)'}],{duration:3500,iterations:Infinity,delay:-i*500});}
   mk('','left:24px;top:24px;width:158px;height:84px;border:4px solid #c86a2a;border-radius:8px',null,a);
   mk('','left:8px;top:46px;font-size:28px;background:#fff;z-index:2;line-height:1','🔋',a);
   const b=mk('','left:164px;top:44px;font-size:30px;background:#fff;z-index:2;line-height:1;border-radius:50%','💡',a);
   loop(b,[{filter:'drop-shadow(0 0 2px #ffd000)'},{filter:'drop-shadow(0 0 16px #ffc400)'}],700,{direction:'alternate'});},
 heat(a){const bar=mk('','left:14px;top:60px;width:170px;height:26px;border-radius:13px;background:linear-gradient(90deg,#ff3d1f,#ff9a2e 30%,#d5d9e1 50%,#d5d9e1);background-size:300% 100%',null,a);
   loop(bar,[{backgroundPosition:'100% 0'},{backgroundPosition:'0% 0'}],2600,{easing:'linear'});
   const f=mk('','left:2px;top:84px;font-size:30px','🔥',a);loop(f,[{transform:'scale(1)'},{transform:'scale(1.2) translateY(-3px)'}],380,{direction:'alternate'});
   const h=mk('','left:156px;top:16px;font-size:32px','✋',a);loop(h,[{transform:'none'},{transform:'none',offset:.72},{transform:'translateY(-16px) rotate(-18deg)',offset:.82},{transform:'none'}],2600);
   const o=mk('','left:110px;top:4px;font-size:15px;font-weight:800;color:#e04848','Hot!',a);loop(o,[{opacity:0},{opacity:0,offset:.72},{opacity:1,offset:.8},{opacity:0}],2600);},
 mall(a){const b=mk('','left:54px;top:76px;width:90px;height:50px;border-radius:6px;background:linear-gradient(#f5cf6a,#d99a2b);transform-origin:50% 100%',null,a);
   b.animate([{transform:'scale(1,1)'},{transform:'scale(1,1)',offset:.3},{transform:'scale(1.7,.32)',offset:.38},{transform:'scale(1.7,.32)',offset:.82},{transform:'scale(1,1)'}],{duration:2600,iterations:Infinity});
   const hm=mk('','left:104px;top:0;font-size:46px;transform-origin:80% 80%','🔨',a);
   hm.animate([{transform:'rotate(-35deg)'},{transform:'rotate(-35deg)',offset:.24},{transform:'rotate(18deg) translateY(12px)',offset:.36},{transform:'rotate(-35deg)',offset:.56},{transform:'rotate(-35deg)'}],{duration:2600,iterations:Infinity});
   const t=mk('','left:20px;top:8px;font-size:15px;font-weight:800;color:#d66a0a','BONK!',a);loop(t,[{opacity:0},{opacity:0,offset:.34},{opacity:1,offset:.4},{opacity:0,offset:.6},{opacity:0}],2600);},
 duct(a){const b=mk('','left:64px;top:52px;width:70px;height:40px;border-radius:6px;background:linear-gradient(#efa874,#c4652a)',null,a);
   b.animate([{transform:'scale(1,1)'},{transform:'scale(1,1)',offset:.2},{transform:'scale(2.7,.14)',offset:.55},{transform:'scale(2.7,.14)',offset:.85},{transform:'scale(1,1)'}],{duration:3000,iterations:Infinity});
   const l=mk('','left:0;top:54px;font-size:26px','⬅️',a),r=mk('','left:164px;top:54px;font-size:26px','➡️',a);
   [l,r].forEach((e,i)=>e.animate([{transform:'translateX(0)'},{transform:'translateX(0)',offset:.2},{transform:`translateX(${i?14:-14}px)`,offset:.55},{transform:`translateX(${i?14:-14}px)`,offset:.85},{transform:'translateX(0)'}],{duration:3000,iterations:Infinity}));
   const t=mk('','left:56px;top:104px;font-size:14px;font-weight:800;color:#c4652a','→ copper wire',a);loop(t,[{opacity:0},{opacity:0,offset:.5},{opacity:1,offset:.6},{opacity:1,offset:.85},{opacity:0}],3000);},
 bell(a){for(let i=0;i<3;i++){const r=mk('','left:72px;top:32px;width:50px;height:50px;border-radius:50%;border:3px solid #6a45d8',null,a);r.animate([{transform:'scale(.6)',opacity:.9},{transform:'scale(2.6)',opacity:0}],{duration:1500,iterations:Infinity,delay:i*500});}
   const b=mk('','left:68px;top:22px;font-size:56px;transform-origin:50% 10%;line-height:1','🔔',a);loop(b,[{transform:'rotate(-20deg)'},{transform:'rotate(20deg)'}],280,{direction:'alternate'});
   const t=mk('','left:132px;top:6px;font-size:18px;font-weight:800;color:#6a45d8','DING!',a);loop(t,[{opacity:.2,transform:'scale(.9)'},{opacity:1,transform:'scale(1.1)'}],560,{direction:'alternate'});},
 strong(a){mk('','left:10px;top:104px;width:178px;height:14px;border-radius:4px;background:linear-gradient(#c3cad5,#7d8796)',null,a);
   mk('','left:16px;top:116px;width:10px;height:22px;background:#7d8796',null,a);mk('','left:172px;top:116px;width:10px;height:22px;background:#7d8796',null,a);
   const e=mk('','left:66px;top:48px;font-size:52px;line-height:1','🐘',a);loop(e,[{transform:'translateY(0)'},{transform:'translateY(-16px)',offset:.4},{transform:'translateY(0)',offset:.6},{transform:'translateY(0)'}],1000);
   const t=mk('','left:132px;top:20px;font-size:14px;font-weight:800;color:#18a058','No bend!',a);loop(t,[{opacity:0},{opacity:1}],1000,{direction:'alternate'});},
 dull(a){mk('','left:46px;top:40px;width:110px;height:76px;border-radius:42% 52% 46% 56%;background:radial-gradient(circle at 40% 35%,#a29f97,#7c7970)',null,a);
   const s=mk('','left:84px;top:12px;font-size:30px','✨',a);
   loop(s,[{transform:'scale(0)',opacity:0},{transform:'scale(1)',opacity:1,offset:.3},{transform:'scale(.5) translateY(14px)',opacity:0,filter:'grayscale(1)',offset:.6},{opacity:0}],2200);
   const t=mk('','left:120px;top:10px;font-size:15px;font-weight:800;color:#7c7970','…no shine',a);loop(t,[{opacity:0},{opacity:0,offset:.45},{opacity:1,offset:.6},{opacity:0}],2200);},
 brittle(a){[[0,0,-46,-34,-40],[46,0,44,-36,35],[0,36,-40,30,25],[46,36,46,30,-30]].forEach(([x,y,dx,dy,r])=>{const p=mk('',`left:${52+x}px;top:${60+y}px;width:46px;height:36px;background:#f5d64a;border:1px solid #d6b21a`,null,a);
     p.animate([{transform:'none'},{transform:'none',offset:.36},{transform:`translate(${dx}px,${dy}px) rotate(${r}deg)`,offset:.5},{transform:`translate(${dx}px,${dy}px) rotate(${r}deg)`,offset:.85},{transform:'none'}],{duration:2800,iterations:Infinity});});
   const hm=mk('','left:110px;top:0;font-size:42px;transform-origin:80% 80%','🔨',a);
   hm.animate([{transform:'rotate(-35deg)'},{transform:'rotate(-35deg)',offset:.24},{transform:'rotate(18deg) translateY(12px)',offset:.36},{transform:'rotate(-35deg)',offset:.56},{transform:'rotate(-35deg)'}],{duration:2800,iterations:Infinity});
   const t=mk('','left:6px;top:4px;font-size:16px;font-weight:800;color:#e04848','CRACK!',a);loop(t,[{opacity:0},{opacity:0,offset:.36},{opacity:1,offset:.42},{opacity:0,offset:.7},{opacity:0}],2800);},
 ins(a){mk('','left:4px;top:70px;width:82px;height:6px;background:#c86a2a',null,a);mk('','left:116px;top:70px;width:52px;height:6px;background:#c86a2a',null,a);
   for(let i=0;i<3;i++){const d=mk('','left:2px;top:67px;width:12px;height:12px;border-radius:50%;background:#2c66cf',null,a);
     d.animate([{transform:'translateX(0)',opacity:1},{transform:'translateX(70px)',opacity:1,offset:.6},{transform:'translateX(70px)',opacity:0}],{duration:1800,iterations:Infinity,delay:-i*600});}
   mk('','left:84px;top:52px;width:36px;height:42px;border-radius:8px;background:#efe9ff;border:2px solid #6a45d8;font-size:10px;font-weight:800;color:#6a45d8;display:flex;align-items:center;justify-content:center;text-align:center;line-height:1','non-<br>metal',a);
   mk('','left:160px;top:50px;font-size:32px;filter:grayscale(1);opacity:.55','💡',a);mk('','left:178px;top:40px;font-size:18px','❌',a);
   const t=mk('','left:44px;top:104px;font-size:14px;font-weight:800;color:#e04848','STOP! 🚫',a);loop(t,[{transform:'scale(.9)'},{transform:'scale(1.1)'}],600,{direction:'alternate'});},
 gases(a){['O₂','N₂','He','Cl₂','Ne'].forEach((g,i)=>{const b=mk('',`left:${8+i*36}px;top:96px;width:36px;height:36px;border-radius:50%;background:rgba(93,156,245,.18);border:2px solid #5d9cf5;color:#2c66cf;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center`,g,a);
     b.animate([{transform:'translate(0,0)',opacity:0},{opacity:1,offset:.2},{transform:`translate(${i%2?10:-10}px,-100px)`,opacity:0}],{duration:2600,iterations:Infinity,delay:i*450});});},
};
function card(x,y,w,h,title,desc,color){const c=mk('card',`left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-color:${color}`,`<h4 style="color:${color}">${title}</h4><div class="area"></div><p>${desc}</p>`);pop(c);return c.querySelector('.area');}
function panel(x,y,w,h,title,cap){return mk('panel',`left:${x}px;top:${y}px;width:${w}px;height:${h}px`,`<h4>${title}</h4>`+(cap?`<div class="cap">${cap}</div>`:''));}


/* ====================== engine helpers for lessons ====================== */
/* w.until(cond): wait (cancel-safe) until cond() is true; used for interactive steps */
function makeWait(my){const w=ms=>sleep(ms,my);
  w.until=cond=>new Promise((res,rej)=>{(function t(){if(my!==token)return rej('cancel');if(cond())return res();setTimeout(t,120);})();});
  w.my=my;return w;}
function btn(cls,css,html,onclick){const b=mk(cls,css,html);b.onclick=onclick;return b;}

/* Multiple-choice question inside the stage. Resolves to true/false (right first time). */
async function ask(w,{q,o,a,why,src,top=40,cols=2,optH=58}){
  const box=mk('ex-q',`top:${top}px`,(src?`<span class="src">${src}</span>`:'')+q);pop(box);
  await w(60);const qh=box.offsetHeight;const y0=top+qh+16;const colW=(880-(cols-1)*14)/cols;let picked=-1;
  const opts=o.map((t,i)=>{const r=Math.floor(i/cols),c=i%cols;
    const e=mk('ex-opt',`left:${40+c*(colW+14)}px;top:${y0+r*(optH+12)}px;width:${colW}px;min-height:${optH}px`,`<span class="k">${'ABCDEF'[i]}</span><span>${t}</span>`);pop(e,i*60);
    e.onclick=()=>{if(picked>=0)return;picked=i;};return e;});
  /* size each row to its tallest option so long answers never overlap */
  await w(40);let yy=y0;const rows=Math.ceil(o.length/cols);
  for(let r=0;r<rows;r++){const rowEls=opts.slice(r*cols,r*cols+cols);const hgt=Math.max(optH,...rowEls.map(e=>e.offsetHeight));rowEls.forEach(e=>{e.style.top=yy+'px';e.style.minHeight=hgt+'px';});yy+=hgt+12;}
  say(`<b>Exam check:</b> ${q.replace(/<br>/g,' ')} Tap your answer!`);
  await w.until(()=>picked>=0);
  const ok=picked===a;opts.forEach(e=>e.classList.add('locked'));opts[a].classList.add('ok');
  track('answer',{questionId:LCFG.id+':'+(src?src.replace(/<[^>]*>/g,'').trim():q.replace(/<[^>]*>/g,'').slice(0,60)),lessonId:LCFG.id,source:'lesson',correct:ok});
  if(!ok){opts[picked].classList.add('bad');shake(opts[picked]);boo();}else{yay();confetti(40);}
  const yb=yy+4;
  if(why){const wb=mk('ex-why',`top:${yb}px`,(ok?'✅ <b>Correct!</b> ':'💡 <b>The answer is '+'ABCDEF'[a]+'.</b> ')+why);pop(wb);}
  say((ok?'Correct! ':'Not quite. The answer is '+'ABCDEF'[a]+'. ')+(why||''));
  return ok;}

/* Written question: think, then reveal the model answer. */
async function reveal(w,{q,model,src,top=40,think='Think of your answer first…'}){
  const box=mk('ex-q',`top:${top}px`,(src?`<span class="src">${src}</span>`:'')+q);pop(box);
  say(`<b>Exam check:</b> ${q.replace(/<br>/g,' ')} ${think}`);
  await w(60);const y=top+box.offsetHeight+18;let open=false;
  const b=btn('ex-btn green',`left:360px;top:${y}px;width:240px`,'👀 Reveal answer',()=>{open=true;});pop(b);
  await w.until(()=>open);b.remove();
  const m=mk('ex-model',`top:${y}px`,`<b class="t">Model answer</b>${model}`);pop(m);beep(700,.1);
  say('Here is a model answer. '+model);return true;}

/* Worksheet card: the exam question word for word, then its answer stamped underneath.
   css positions the card (left/top/width); src like 'Worksheet · Unit 5 · MCQ 10'; a like '✔ A) Hardness'. */
function wsCard(css,{src,q,a},parent){const c=mk('ws-card',css+';z-index:20',`<div class="src">${src}</div><div class="q">${q}</div><div class="stamp">${a}</div>`,parent);
  pop(c);an(c.querySelector('.stamp'),[{transform:'scale(3) rotate(-20deg)',opacity:0},{transform:'rotate(-2deg)',opacity:1}],{duration:500,delay:500,fill:'both',easing:'cubic-bezier(.5,1.6,.5,1)'});
  setTimeout(yay,500);return c;}

/* Run a list of exam questions one after another, with a "Next question" button between them. */
async function examCheck(w,list,{title='Exam check'}={}){
  let right=0,mcq=0,i0=0;
  if(RESUME&&RESUME.lastScene===cur+1)i0=Math.max(0,Math.min(RESUME.step||0,list.length-1));/* continue at the question reached last time */
  RESUME=null;
  for(let i=i0;i<list.length;i++){stage.innerHTML='';track('lesson',LCFG.id,cur+1,false,i);
    mk('ex-head','',`📝 ${title} · question ${i+1} of ${list.length}`);
    const it=list[i];
    if(it.o){mcq++;if(await ask(w,it))right++;}else await reveal(w,it);
    await w(400);let nx=false;
    const b=btn('ex-btn',`left:${i<list.length-1?700:680}px;top:452px`,i<list.length-1?'Next question ▶':'Finish ✔',()=>{nx=true;});pop(b);
    await w.until(()=>nx);}
  stage.innerHTML='';
  const s=mk('','left:180px;top:120px;width:600px;text-align:center',`<div style="font-size:70px">🏆</div><div style="font-size:30px;font-weight:800;color:#4a2ea6;margin-top:6px">Exam check complete!</div>`+
    (mcq?`<div style="font-size:21px;font-weight:700;margin-top:10px">You got <b>${right} of ${mcq}</b> multiple-choice questions right first time.</div>`:''));pop(s);yay();confetti(120);
  say(mcq&&right===mcq?'Perfect score! You really know this lesson. Well done!':'Great work! If you missed any, press Replay to try them again.');
  return right;}

/* Tap-to-sort game. bins:[names], items:[[text,binIndex]], colors optional. Resolves when checked. */
async function sortGame(w,{bins,items,top=150,colors=['#f7ad5f','#5d9cf5','#45c288','#c9b6f4'],intro}){
  const n=bins.length,bw=(900-(n-1)*20)/n,bh=520-top-80;let sel=null,checked=false;
  const B=bins.map((t,i)=>{const b=mk('sg-bin',`left:${30+i*(bw+20)}px;top:${top}px;width:${bw}px;height:${bh}px;border-color:${colors[i]};background:${colors[i]}1a`,`<h4>${t}</h4>`);b.dataset.i=i;b.items=[];pop(b,i*80);return b;});
  const trayY=top-110;const chips=[];let x=30,y=trayY;
  const sh=items.map(v=>v).sort(()=>Math.random()-.5);
  sh.forEach(([t,want])=>{const c=mk('sg-chip',`left:${x}px;top:${y}px`,t);c.dataset.want=want;c.home=[x,y];c.bin=null;chips.push(c);});
  await w(30);x=30;y=trayY;chips.forEach(c=>{const wd=c.offsetWidth;if(x+wd>930){x=30;y+=52;}c.home=[x,y];c.style.left=x+'px';c.style.top=y+'px';x+=wd+10;pop(c);});
  const layout=()=>{B.forEach((b,bi)=>{let cx=0,cy=0;b.items.forEach(c=>{const wd=c.offsetWidth;if(cx+wd>bw-24){cx=0;cy+=52;}c.style.left=(30+bi*(bw+20)+12+cx)+'px';c.style.top=(top+44+cy)+'px';cx+=wd+8;});});};
  chips.forEach(c=>c.onclick=e=>{e.stopPropagation();if(checked)return;beep(650,.05);chips.forEach(x=>x.classList.toggle('sel',x===c&&sel!==c));sel=sel===c?null:c;});
  B.forEach(b=>b.onclick=()=>{if(checked||!sel)return;const c=sel;if(c.bin)c.bin.items=c.bin.items.filter(x=>x!==c);c.bin=b;b.items.push(c);c.classList.remove('sel');sel=null;beep(520,.06);layout();});
  if(intro)say(intro);
  const ck=btn('ex-btn',`left:380px;top:${520-66}px;width:200px;opacity:.4`,'Check ✔',()=>{if(chips.every(c=>c.bin))checked=true;});
  const iv=setInterval(()=>{ck.style.opacity=chips.every(c=>c.bin)?1:.4;},200);
  await w.until(()=>checked);clearInterval(iv);ck.remove();
  let ok=0;chips.forEach(c=>{const g=+c.bin.dataset.i===+c.dataset.want;c.classList.add(g?'ok':'bad');if(g)ok++;});
  if(ok===chips.length){yay();confetti(90);}else boo();
  return{ok,total:chips.length,wrong:chips.filter(c=>!c.classList.contains('ok')).map(c=>c.textContent)};}

/* ====================== navigation ====================== */
/* ====================== navigation ====================== */
function dots(){const d=$('#dots');d.innerHTML='';SC.forEach((s,i)=>{const b=document.createElement('button');b.title=s.t;b.className=i===cur?'cur':i<cur?'done':'';b.onclick=()=>go(i);d.appendChild(b);});
  $('#count').textContent=`Scene ${cur+1} of ${SC.length}`;$('#back').style.visibility=cur?'visible':'hidden';$('#next').textContent=cur===SC.length-1?'Start over ⟲':'Next ▶';}
async function run(){const my=++token;started=true;if(RESUME&&RESUME.lastScene!==cur+1)RESUME=null;track('lesson',LCFG.id,cur+1,false,RESUME?RESUME.step:undefined);stopVoice();window.AUTOPLAY=null;stage.getAnimations&&stage.getAnimations({subtree:true}).forEach(a=>a.cancel());stage.innerHTML='';
  $('#next').classList.remove('ready');$('#stitle').textContent=`Scene ${cur+1} · ${SC[cur].t}`;dots();
  try{await SC[cur].run(makeWait(my));if(my===token){$('#next').classList.add('ready');if(cur===SC.length-1)markDone();}}catch(e){if(e!=='cancel')console.error(e);}}
function go(i){cur=(i+SC.length)%SC.length;run();}
$('#next').onclick=()=>go(cur+1);$('#back').onclick=()=>go(cur-1);$('#replay').onclick=()=>run();
$('#snd').onclick=()=>{soundOn=!soundOn;$('#snd').textContent=soundOn?'🔊':'🔇';try{localStorage.setItem('pta_sound',soundOn?'1':'0');}catch(e){}};
$('#snd').textContent=soundOn?'🔊':'🔇';
function vUI(){const b=$('#vbtn');b.textContent=voiceOn?'🗣️ Tutor voice: on':'🤐 Tutor voice: off';b.classList.toggle('off',!voiceOn);
  $('#vsel').style.display=$('#vrate').style.display=voiceOn&&HAS_TTS?'':'none';$('#vrate').value=String(rate);
  if(!HAS_TTS){b.textContent='🗣️ Voice not supported';b.disabled=true;}}
$('#vbtn').onclick=()=>{voiceOn=!voiceOn;try{localStorage.setItem('pta_voice',voiceOn?'1':'0');}catch(e){}vUI();if(voiceOn)speak(lastSay);else stopVoice();};
$('#vsel').onchange=e=>{voice=voices().find(v=>v.name===e.target.value)||voice;try{localStorage.setItem('pta_vname',voice.name);}catch(_){}speak(lastSay);};
$('#vrate').onchange=e=>{rate=+e.target.value;try{localStorage.setItem('pta_rate',rate);}catch(_){}speak(lastSay);};
$('#bubble').onclick=()=>{if(lastSay){if(!voiceOn){voiceOn=true;vUI();}speak(lastSay);}};
vUI();if(HAS_TTS)pickVoice();
addEventListener('keydown',e=>{if(e.key==='ArrowRight')go(cur+1);if(e.key==='ArrowLeft'&&cur)go(cur-1);});
/* Landscape screens (phones held sideways, iPad, Mac, Windows) get the side-panel layout: stage full height,
   narration and buttons in a right-hand panel. Portrait screens keep the stacked layout. */
function fit(){const side=innerWidth>innerHeight;document.body.classList.toggle('side',side);if(!side)document.body.classList.remove('vopen');
  const W=side?1286:980,H=side?536:760,s=Math.min(innerWidth/W,innerHeight/H);const a=$('#app'),h=$('#holder');a.style.transform=`scale(${s})`;h.style.width=W*s+'px';h.style.height=H*s+'px';h.style.marginTop=side?Math.max(0,(innerHeight-H*s)/2)+'px':'';}
$('#vset').onclick=()=>document.body.classList.toggle('vopen');
addEventListener('resize',fit);fit();
addEventListener('scroll',()=>{if(scrollX||scrollY)scrollTo(0,0);});$('#holder').addEventListener('scroll',e=>{e.target.scrollLeft=0;e.target.scrollTop=0;});
/* Finishing the last scene marks the lesson done in the student's account. (Before logins this was a device-wide
   g7_done_<id> key; the home page offers to import those once, see index.html.) */
function markDone(){track('lesson',LCFG.id,cur+1,true);}
/* Progress saving: handed to src/account.js (which may load after this file), via window.__track. */
function track(method,...args){(window.__track=window.__track||[]).push([method,args]);}
window.Lesson={start(cfg){LCFG=cfg;SC=cfg.scenes;document.title=cfg.title+' · Grade 7 Science';
  $('#brand').textContent=(cfg.emoji||'⚛️')+' '+cfg.title;
  const st=new URLSearchParams(location.search).get('scene');
  if(st){go(Math.max(0,Math.min(SC.length-1,+st-1)));return;}
  dots();$('#stitle').textContent=`Lesson ${cfg.num} · Unit ${cfg.unit}`;say(cfg.intro||`Hi! I'm <b>Professor Atom</b> ⚛️ Ready? Press <b>Start</b>!`);
  startScreen();addEventListener('g7-resume',()=>{if(!started)startScreen();});}};

/* ====================== start screen and resuming ====================== */
let RESUME=null,started=false;
/* Where this student stopped in this lesson last time (cached by src/account.js), or null. */
function resumePoint(){try{const me=JSON.parse(localStorage.getItem('g7_me'));const p=JSON.parse(localStorage.getItem('g7_resume_'+me.username)).lessons[LCFG.id];
  if(p&&p.lastScene>=2&&p.lastScene<=SC.length&&!(p.done&&p.lastScene===SC.length))return p;}catch(e){}return null;}
function startScreen(){stage.getAnimations&&stage.getAnimations({subtree:true}).forEach(a=>a.cancel());stage.innerHTML='';
  mk('','left:0;top:70px;width:960px;text-align:center;font-size:84px',LCFG.emoji||'⚛️');
  mk('','left:0;top:170px;width:960px;text-align:center;font-size:34px;font-weight:800;color:#4a2ea6',LCFG.title);
  const p=resumePoint();
  if(!p){
    const b=mk('bigbtn','left:290px;top:250px;width:380px;height:100px;background:linear-gradient(135deg,#6a45d8,#2c66cf);display:flex;align-items:center;justify-content:center;font-size:30px;white-space:nowrap','▶ Start the lesson!');
    loop(b,[{transform:'scale(1)'},{transform:'scale(1.06)'}],700,{direction:'alternate'});
    mk('','left:0;top:380px;width:960px;text-align:center;font-size:17px;color:#626a80;font-weight:700',`${SC.length} short animated scenes · tap ▶ Next to move on · 🔊 sound on`);
    b.onclick=()=>{beep(660,.1);go(0);};return;}
  const where=`Scene ${p.lastScene}: ${SC[p.lastScene-1].t}`+(p.step?` · question ${p.step+1}`:'');
  const c=mk('bigbtn','left:140px;top:250px;width:400px;height:100px;background:linear-gradient(135deg,#6a45d8,#2c66cf);display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:30px;line-height:1.15',
    `▶ Continue<span style="font-size:15px;font-weight:700;opacity:.92;max-width:370px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${where}</span>`);
  loop(c,[{transform:'scale(1)'},{transform:'scale(1.05)'}],700,{direction:'alternate'});
  const s=mk('bigbtn','left:560px;top:250px;width:260px;height:100px;background:#fff;color:#4a2ea6;border:3px solid #d9d2f5;box-shadow:0 6px 0 #e3dcff;display:flex;align-items:center;justify-content:center;text-align:center;font-size:21px;line-height:1.2','⟲ Start from<br>the beginning');
  mk('','left:0;top:380px;width:960px;text-align:center;font-size:17px;color:#626a80;font-weight:700',`You stopped at scene ${p.lastScene} of ${SC.length} last time.`);
  c.onclick=()=>{beep(660,.1);RESUME=p;go(p.lastScene-1);};
  s.onclick=()=>{beep(660,.1);go(0);};}
