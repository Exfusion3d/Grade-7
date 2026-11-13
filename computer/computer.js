/* Computer Science helpers, loaded by every Computer lesson after ../lessons/engine.js:
   Chip the Mouse (the Computer tutor), speech that reads code properly, coloured code, little windows
   (Notepad, a code editor, a web browser, Python IDLE) that type and run things live, the step-by-step
   routine for the worksheet's written answers (teachA), "build the code" tiles and the recap scene.

   Writing code on the stage:
   - C('<IMG>')            inline code chip, coloured. Spoken as "image tag".
   - C('print("Hi")','print hi')  the 2nd argument is what the voice says instead.
   - hl(src,'html'|'css'|'py')  coloured code (escaped) for windows.
   In say() text, write tags escaped (&lt;HTML&gt;) or use C(): the voice reads &lt;HTML&gt; as "HTML tag"
   and &lt;/HTML&gt; as "closing HTML tag". Words like HTML, CSS, W3C, URL and .py are spelled out. */
const COMPUTER={subject:'Computer',home:'../computer.html',guide:'Chip the Mouse',
  mascot:`<ellipse cx="40" cy="77" rx="20" ry="3" fill="#1f2433" opacity=".12"/>
    <path class="cable" d="M40 15 C40 5 54 3 57 9 C60 15 69 12 71 4" stroke="#1f2433" stroke-width="3" fill="none" stroke-linecap="round"/>
    <rect x="15" y="14" width="50" height="61" rx="25" fill="#22b8c9" stroke="#0e7490" stroke-width="2.5"/>
    <path d="M16 37 H64 M40 15 V37" stroke="#0e7490" stroke-width="2"/>
    <rect class="wheel" x="37" y="20" width="6" height="12" rx="3" fill="#ffd84d" stroke="#e0a800" stroke-width="1.2"/>
    <circle cx="31" cy="49" r="6.2" fill="#fff"/><circle cx="49" cy="49" r="6.2" fill="#fff"/>
    <circle cx="32" cy="50" r="3.6" fill="#1f2433"/><circle cx="50" cy="50" r="3.6" fill="#1f2433"/>
    <circle cx="33.3" cy="48.6" r="1.3" fill="#fff"/><circle cx="51.3" cy="48.6" r="1.3" fill="#fff"/>
    <circle cx="23.5" cy="59" r="3.2" fill="#ff9f9f" opacity=".75"/><circle cx="56.5" cy="59" r="3.2" fill="#ff9f9f" opacity=".75"/>
    <path id="mouth" d="M34 61 Q40 67 46 61" stroke="#1f2433" stroke-width="2.6" fill="none" stroke-linecap="round"/>`};

document.head.insertAdjacentHTML('beforeend',`<style>
#mascot .wheel{animation:cwheel 1.2s ease-in-out infinite alternate}
@keyframes cwheel{to{fill:#fff3a6;filter:drop-shadow(0 0 4px #ffd84d)}}
#mascot .cable{transform-origin:40px 15px;animation:ccable 2.6s ease-in-out infinite alternate}
@keyframes ccable{to{transform:rotate(-7deg)}}
/* code chips and coloured code */
.cd{font-family:"SF Mono",Menlo,Consolas,"Courier New",monospace;font-weight:700;background:#1e2433;color:#e8ecf5;border-radius:7px;padding:1px 7px;font-size:.92em;white-space:pre-wrap}
#text .cd{font-size:.85em}
.code{font-family:"SF Mono",Menlo,Consolas,"Courier New",monospace;white-space:pre-wrap;word-break:break-word;line-height:1.45}
.t-tag{color:#7cc4ff}.t-att{color:#ffd27a}.t-str{color:#9be38f}.t-pun{color:#c9b6f4}.t-sel{color:#ff9f6b}.t-prop{color:#7cc4ff}.t-val{color:#9be38f}
.t-kw{color:#ff8fb1}.t-fn{color:#7cc4ff}.t-num{color:#ffd27a}.t-com{color:#8a93ab;font-style:italic}.t-out{color:#9be38f}
.light .t-tag{color:#1d4ed8}.light .t-att{color:#b45309}.light .t-str{color:#15803d}.light .t-pun{color:#7c3aed}.light .t-sel{color:#c2410c}.light .t-prop{color:#1d4ed8}.light .t-val{color:#15803d}
.light .t-kw{color:#e06a00}.light .t-fn{color:#900090}.light .t-num{color:#1f2433}.light .t-com{color:#dd0000}.light .t-out{color:#0000dd}
.caret{display:inline-block;width:.55em;height:1.05em;vertical-align:-.15em;background:currentColor;margin-left:1px;animation:ccaret .8s steps(1) infinite}
@keyframes ccaret{50%{opacity:0}}
/* windows */
.cw{background:#fff;border:2px solid #9aa7bd;border-radius:12px;box-shadow:0 8px 22px rgba(31,36,51,.18);overflow:hidden;display:flex;flex-direction:column}
.cw-bar{flex:none;height:34px;display:flex;align-items:center;gap:8px;padding:0 12px;background:linear-gradient(#f4f6fa,#e3e8f0);border-bottom:1px solid #c5cdda;font-size:15px;font-weight:800;color:#3a4256;white-space:nowrap;overflow:hidden}
.cw-bar .d{width:12px;height:12px;border-radius:50%;flex:none}
.cw-bar .tt{overflow:hidden;text-overflow:ellipsis}
.cw-body{flex:1;position:relative;overflow:hidden;padding:10px 14px;font-size:19px}
.cw.dark .cw-body{background:#1e2433;color:#e8ecf5}
.cw.dark .cw-bar{background:linear-gradient(#3a4256,#2a3044);color:#e8ecf5;border-bottom-color:#141826}
.cw.note .cw-body{background:#fff;color:#1f2433}
.cw-menu{flex:none;display:flex;gap:16px;padding:3px 12px;font-size:13px;color:#3a4256;background:#fff;border-bottom:1px solid #e3e8f0}
.cw-addr{flex:none;display:flex;align-items:center;gap:8px;padding:5px 10px;background:#eef1f6;border-bottom:1px solid #d5dbe6;font-size:15px}
.cw-addr .nb{color:#7a849a;font-size:17px}
.cw-addr .url{flex:1;background:#fff;border:1px solid #cfd6e2;border-radius:16px;padding:3px 12px;color:#2a3044;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-family:"SF Mono",Menlo,Consolas,monospace;font-size:13.5px}
.cw-tab{display:inline-block;background:#fff;border:1px solid #cfd6e2;border-bottom:0;border-radius:8px 8px 0 0;padding:3px 14px;font-size:13px;font-weight:700;color:#2a3044;max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:5px}
.cw.browser .cw-bar{height:30px;align-items:flex-end;background:#dfe5ee}
.cw-page{font-family:"Times New Roman",Times,Georgia,serif;color:#111;font-size:20px;line-height:1.35}
.cw-page h1{font-size:34px;margin:4px 0 8px}.cw-page h2{font-size:26px;margin:4px 0 6px}.cw-page p{margin:6px 0}
.cw-page a{color:#0000ee;text-decoration:underline;cursor:pointer}
.cw.idle .cw-body{background:#fff;color:#1f2433;font-family:"SF Mono",Menlo,Consolas,"Courier New",monospace;font-size:18px;line-height:1.45;white-space:pre-wrap}
.idle-p{color:#8a5a00}
/* worksheet written answers (teachA) */
.ca-q{background:#fff;border:3px solid #9fdfe6;border-radius:18px;box-shadow:0 4px 0 #9fdfe6;padding:10px 18px}
.ca-q .src{font-size:13px;font-weight:800;color:#0e7490;text-transform:uppercase;letter-spacing:.04em}
.ca-q .q{font-size:23px;font-weight:800;color:#1f2433;margin-top:2px;line-height:1.3}
.ca-key{background:#ffe680;border-radius:6px;padding:0 4px;box-shadow:0 0 0 2px #ffd84d}
.ca-ans{background:#f2fbfc;border:3px dashed #22b8c9;border-radius:18px;padding:10px 18px 12px}
.ca-ans .h{font-size:13px;font-weight:800;color:#0e7490;text-transform:uppercase;letter-spacing:.04em;margin-bottom:2px}
.ca-line{font-size:20.5px;font-weight:600;color:#1f2433;line-height:1.38;margin-top:3px}
.ca-line b{color:#0e5f75}
.ca-line.now{background:#fff8d6;border-radius:8px;box-shadow:0 0 0 4px #fff8d6}
.ca-trick{background:#fff8e6;border:3px solid #f2c200;border-radius:16px;padding:8px 16px;font-size:18px;font-weight:700;line-height:1.35}
.ca-point{font-size:40px;pointer-events:none;z-index:40}
.ca-note{background:#eef4ff;border:3px solid #9cbcf2;border-radius:16px;padding:8px 16px;font-size:17px;font-weight:700;line-height:1.35;color:#1d3f8a}
/* build the code */
.cb-tile{display:flex;align-items:center;justify-content:center;min-width:56px;height:54px;padding:0 14px;background:#1e2433;border:3px solid #22b8c9;border-radius:12px;
  font-family:"SF Mono",Menlo,Consolas,monospace;font-size:21px;font-weight:700;color:#e8ecf5;box-shadow:0 4px 0 #0e7490;cursor:pointer;user-select:none;-webkit-user-select:none;white-space:pre}
.cb-tile:active{transform:translateY(3px);box-shadow:0 1px 0 #0e7490}
.cb-del{display:flex;align-items:center;justify-content:center;width:62px;height:54px;background:#e7f7f9;border:3px solid #22b8c9;border-radius:12px;font-size:24px;cursor:pointer}
.cb-slot{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:4px 8px;min-height:72px;padding:6px 14px;border:3px dashed #22b8c9;border-radius:16px;background:#1e2433;
  font-family:"SF Mono",Menlo,Consolas,monospace;font-size:23px;font-weight:700;color:#e8ecf5;white-space:pre}
.cb-slot i{font-family:"Avenir Next","Nunito","Segoe UI",system-ui,sans-serif;font-size:18px;font-style:normal;color:#9aa7bd;font-weight:700;white-space:normal}
.cb-slot.ok{border-style:solid;border-color:#18a058;box-shadow:0 0 0 4px #bfe7d2}
.cb-slot.bad{border-style:solid;border-color:#e04848;box-shadow:0 0 0 4px #f8cccc}
</style>`);

/* ---------- speech: read code the way a person would ---------- */
const TAGSAY={HTML:'H T M L',HEAD:'head',BODY:'body',IMG:'image',A:'A',P:'P',B:'bold',I:'italic',U:'underline',BR:'line break',HR:'line',
  TITLE:'title',H1:'heading 1',H2:'heading 2',H3:'heading 3',STYLE:'style',LINK:'link',FONT:'font',DIV:'div',SPAN:'span',UL:'list',LI:'list item',TABLE:'table'};
const tagSay=n=>TAGSAY[n.toUpperCase()]||n;
const _engineSpeech=cleanSpeech;
cleanSpeech=function(html){
  let t=String(html).replace(/<(code|span|b|i)\b[^>]*?data-say="([^"]*)"[^>]*>[\s\S]*?<\/\1>/g,' $2 ');
  t=t.replace(/&gt;&gt;&gt;/g,' ').replace(/&lt;\/\s*([A-Za-z][A-Za-z0-9]*)[^&]*?&gt;(?:\s+tags?\b)?/g,(m,n)=>` closing ${tagSay(n)} tag `)
     .replace(/&lt;([A-Za-z][A-Za-z0-9]*)[^&]*?&gt;(?:\s+tags?\b)?/g,(m,n)=>` ${tagSay(n)} tag `)
     .replace(/&lt;\s*&gt;/g,' angle brackets ').replace(/\(\s*&lt;\s*\)/g,' ').replace(/\(\s*&gt;\s*\)/g,' ')
     .replace(/&lt;/g,' less than ').replace(/&gt;(?!&gt;)/g,' greater than ');
  t=t
     .replace(/\.(CSS|css)\b/g,' dot C S S').replace(/\.html?\b/gi,' dot H T M L').replace(/\.py\b/g,' dot P Y').replace(/\.jpe?g\b/gi,' dot J P G')
     .replace(/\.gif\b/gi,' dot gif').replace(/\.png\b/gi,' dot P N G').replace(/\.xlsx\b/gi,' dot X L S X').replace(/\.docx\b/gi,' dot doc X').replace(/\.exe\b/gi,' dot E X E')
     .replace(/\bHTML ?5\b/g,'H T M L 5').replace(/\bHTML\b/g,'H T M L').replace(/\bCSS\b/g,'C S S').replace(/\bW3C\b/g,'W 3 C').replace(/\bURLs\b/g,'U R Ls').replace(/\bURL\b/g,'U R L')
     .replace(/\bWWW\b/g,'W W W').replace(/\bIDLE\b/g,'Idle').replace(/\bGIMP\b/g,'Gimp').replace(/\bIMG\b/g,'image').replace(/\bCtrl\b/g,'Control')
     .replace(/\bSRC\b/g,'source').replace(/\bHREF\b/gi,'H ref').replace(/\b_blank\b|(?<=\W)_blank\b/g,' blank').replace(/\bALT\b/g,'alt')
     .replace(/\balink\b/gi,'A link').replace(/\bvlink\b/gi,'V link').replace(/\bsrc\b/g,'source').replace(/\bCPU\b/g,'C P U').replace(/\bPC\b/g,'P C')
     .replace(/[{}]/g,' ').replace(/&nbsp;/g,' ').replace(/(?<!&\w{1,8});(?=\s|$|<)/g,'. ').replace(/(\w)-(?=[a-z])/g,'$1 ');
  return _engineSpeech(t);};

/* ---------- coloured code ---------- */
const escC=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const sp=(c,s)=>s?`<span class="t-${c}">${escC(s)}</span>`:'';
function hlHTML(s){return String(s).split(/(<[^>]*>?)/).map(p=>{if(p[0]!=='<')return escC(p);
  const m=p.match(/^<(\/?)([A-Za-z0-9!]*)([\s\S]*?)(>?)$/);if(!m)return escC(p);
  const at=m[3].replace(/("[^"]*"?|'[^']*'?)|([A-Za-z-]+)|([^"'A-Za-z-]+)/g,(x,str,word,oth)=>str?sp('str',str):word?sp('att',word):escC(oth));
  return sp('pun','<'+m[1])+sp('tag',m[2])+at+sp('pun',m[4]);}).join('');}
function hlCSS(s){let out='',st='sel',buf='';const flush=()=>{out+=st==='sel'?sp('sel',buf):st==='prop'?sp('prop',buf):sp('val',buf);buf='';};
  for(const ch of String(s)){if(ch==='{'){flush();out+=sp('pun','{');st='prop';}else if(ch==='}'){flush();out+=sp('pun','}');st='sel';}
    else if(ch===':'&&st==='prop'){flush();out+=sp('pun',':');st='val';}else if(ch===';'&&st==='val'){flush();out+=sp('pun',';');st='prop';}else buf+=ch;}
  flush();return out;}
const PYKW=/^(print|input|def|if|elif|else|for|in|while|import|from|return|True|False|None|and|or|not|class|range|int|str|len)$/;
function hlPY(s){return String(s).replace(/(#[^\n]*)|("[^"\n]*"?|'[^'\n]*'?)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)|([^#"'\w]+)/g,(x,com,str,num,id,oth)=>
  com?sp('com',com):str?sp('str',str):num?sp('num',num):id?(PYKW.test(id)?sp('kw',id):sp('fn',id)):escC(oth));}
function hl(s,lang='html'){return lang==='css'?hlCSS(s):lang==='py'?hlPY(s):lang==='text'?escC(s):hlHTML(s);}
/* how a piece of code is read aloud: <IMG> "image tag", </HTML> "closing H T M L tag" */
const codeSay=s=>String(s).replace(/<\/\s*([A-Za-z][A-Za-z0-9]*)[^>]*>/g,(m,n)=>` closing ${tagSay(n)} tag `).replace(/<([A-Za-z][A-Za-z0-9]*)[^>]*>/g,(m,n)=>` ${tagSay(n)} tag `).replace(/\s+/g,' ').trim();
/* inline code chip; say = what the voice reads (optional; tags are read as "image tag" etc.) */
const C=(s,say,lang)=>`<code class="cd" data-say="${escC(say!=null?say:codeSay(s))}">${hl(s,lang||(/^\s*</.test(s)?'html':'text'))}</code>`;

/* a cancel-safe pause that does NOT wait for the voice (for typing while Chip talks) */
const nap=(w,ms)=>new Promise((res,rej)=>{const t0=Date.now();(function t(){if(w.my!==token)return rej('cancel');if(Date.now()-t0>=ms)return res();setTimeout(t,Math.min(ms,25));})();});

/* ---------- windows ---------- */
/* win(x,y,w,h,{title, kind:'note'|'dark'|'browser'|'idle', menu, parent}) -> {el, body, bar} */
function win(x,y,wd,ht,{title='',kind='note',menu,parent}={}){
  const el=mk('cw '+kind,`left:${x}px;top:${y}px;width:${wd}px;height:${ht}px`,'',parent);
  const bar=mk('','position:relative','',el);bar.className='cw-bar';
  bar.innerHTML=kind==='browser'?`<span class="d" style="background:#ff5f57;margin-bottom:9px"></span><span class="d" style="background:#febc2e;margin-bottom:9px"></span><span class="d" style="background:#28c840;margin-bottom:9px"></span><span class="cw-tab">${title}</span>`
    :`<span class="d" style="background:#ff5f57"></span><span class="d" style="background:#febc2e"></span><span class="d" style="background:#28c840"></span><span class="tt">${title}</span>`;
  if(menu){const m=mk('','position:relative','',el);m.className='cw-menu';m.innerHTML=menu.map(t=>`<span>${t}</span>`).join('');}
  let addr=null;if(kind==='browser'){addr=mk('','position:relative','<span class="nb">←</span><span class="nb">→</span><span class="nb">⟳</span><span class="url"></span>',el);addr.className='cw-addr';}
  const body=mk('','position:relative','',el);body.className='cw-body'+(kind==='browser'?' cw-page':'')+(kind==='note'||kind==='idle'?' light':'');
  return{el,body,bar,addr};}
/* Notepad (or another text editor) showing code. lang: 'html'|'css'|'py'. dark:true = coloured code editor. */
function editor(x,y,wd,ht,{title='index.html - Notepad',dark=false,menu=['File','Edit','Format','View','Help'],parent,size=18}={}){
  const W=win(x,y,wd,ht,{title,kind:dark?'dark':'note',menu,parent});
  const c=mk('code',`position:relative;font-size:${size}px`,'',W.body);c.className='code';W.code=c;W.src='';return W;}
/* Type src into an editor (or any element) character by character, coloured as it goes. speed = ms per character. */
async function typeCode(w,E,src,{lang='html',speed=28,append=true}={}){const el=E.code||E;const start=append?(E.src||''):'';
  for(let i=1;i<=src.length;i++){el.innerHTML=hl(start+src.slice(0,i),lang)+'<span class="caret"></span>';
    if(src[i-1]!==' ')beep(900+Math.random()*300,.012,'square',.03);if(i%2===0||src[i-1]==='\n')await nap(w,speed*2);}
  E.src=start+src;el.innerHTML=hl(E.src,lang);return E;}
function setCode(E,src,lang='html'){E.src=src;(E.code||E).innerHTML=hl(src,lang);return E;}
/* A web browser. page = the white page area (Times-style font like a real unstyled page). */
function browser(x,y,wd,ht,{url='file:///C:/Users/Student/Documents/index.html',title='index.html',parent}={}){
  const W=win(x,y,wd,ht,{title,kind:'browser',parent});W.page=W.body;
  W.go=(u,t)=>{W.addr.querySelector('.url').textContent=u;if(t!=null)W.bar.querySelector('.cw-tab').textContent=t;};W.go(url);return W;}
/* Python IDLE Shell. run(w, command, output) types a command after >>>, presses Enter and prints the output (string or list). */
function idle(x,y,wd,ht,{title='IDLE Shell 3.12',parent,size=18}={}){
  const W=win(x,y,wd,ht,{title:'🐍 '+title,kind:'idle',menu:['File','Edit','Shell','Debug','Options','Window','Help'],parent});
  W.body.style.fontSize=size+'px';W.log=mk('','position:relative','',W.body);
  W.log.innerHTML=`<span class="t-out">Python 3.12 on win32\nType "help" for more information.</span>\n`;
  const prompt=()=>{W.cur=document.createElement('span');W.log.insertAdjacentHTML('beforeend','<span class="idle-p">&gt;&gt;&gt; </span>');W.log.appendChild(W.cur);W.cur.innerHTML='<span class="caret"></span>';};
  prompt();
  W.run=async(w,cmd,out,{speed=45}={})=>{for(let i=1;i<=cmd.length;i++){W.cur.innerHTML=hlPY(cmd.slice(0,i))+'<span class="caret"></span>';if(i%2===0)await nap(w,speed*2);}
    W.cur.innerHTML=hlPY(cmd);await nap(w,250);beep(500,.05);
    const o=out==null?[]:[].concat(out);W.log.insertAdjacentHTML('beforeend','\n'+o.map(l=>`<span class="t-out">${escC(l)}</span>\n`).join(''));prompt();
    while(W.log.offsetHeight>W.body.clientHeight-20&&W.log.firstChild)W.log.firstChild.remove();
    return W.log.querySelectorAll('.t-out')[W.log.querySelectorAll('.t-out').length-1];};
  return W;}

/* ---------- pointing ---------- */
function point(el){
  let h=stage.querySelector('.ca-point');
  if(!h){h=mk('ca-point','left:0;top:0;opacity:0','👉');loop(h,[{marginLeft:'0px'},{marginLeft:'-9px'}],550,{direction:'alternate'});}
  let l=0,t=0,e=el;while(e&&e!==stage){l+=e.offsetLeft;t+=e.offsetTop;e=e.offsetParent;}
  const x=Math.max(0,l-50),y=t+Math.min(el.offsetHeight,60)/2-26;
  an(h,[{opacity:1,transform:`translate(${x}px,${y}px)`}],{duration:550});return h;}
const unpoint=()=>stage.querySelector('.ca-point')?.remove();
/* light up the first appearance of `word` inside an element */
function markIn(box,word){const i=box.innerHTML.indexOf(word);if(i<0)return null;
  box.innerHTML=box.innerHTML.slice(0,i)+'<span class="ca-key">'+word+'</span>'+box.innerHTML.slice(i+word.length);
  const k=box.querySelectorAll('.ca-key');const el=k[k.length-1];
  el.animate([{background:'#fff'},{background:'#ffd84d'},{background:'#ffe680'}],{duration:900});return el;}

/* ---------- a worksheet written question, step by step ----------
   1. the question appears alone and Chip reads it; 2. its key words light up (keys: [[word, spoken meaning]]);
   3. the student thinks, then taps "Show me"; 4. the model answer is built one line at a time
   (lines: [{t: html line, say: spoken (default t), act: async animation}] or plain strings);
   5. "✍️ Learn it" is stamped and the memory trick appears. Use one question per screen.
   x,y,wd position the question; the answer goes under it. Returns {card, ans}. */
async function teachA(w,{src,q,read,keys=[],lines=[],trick,think,x=24,y=10,wd=912,size}={}){
  const c=mk('ca-q',`left:${x}px;top:${y}px;width:${wd}px;z-index:20`,`<div class="src">${src}</div><div class="q">${q}</div>`);pop(c);
  await w(60);const qq=c.querySelector('.q');point(qq);
  say(read||q);await w(1500);
  for(const [word,means] of keys){const k=markIn(qq,word);if(k)point(k);say(means);await w(1800);}
  say(think||`Think: what would you write? When you're ready, tap <b>Show me</b>.`);let open=false;
  const b=btn('ex-btn green',`left:${x+wd/2-120}px;top:${y+c.offsetHeight+24}px;width:240px;z-index:30`,'👀 Show me',()=>{open=true;});pop(b);point(b);
  window.AUTOPLAY=()=>{open=true;};await w.until(()=>open);window.AUTOPLAY=null;b.remove();
  const a=mk('ca-ans',`left:${x}px;top:${y+c.offsetHeight+12}px;width:${wd}px`,'<div class="h">✍️ Model answer: learn it and write it</div>');pop(a);
  if(size)a.style.setProperty('--sz',size);
  for(const L of lines){const o=typeof L==='string'?{t:L}:L;if(o.act)await o.act();
    a.querySelectorAll('.ca-line.now').forEach(e=>e.classList.remove('now'));
    const e=mk('ca-line now','position:relative',o.t,a);if(size)e.style.fontSize=size+'px';
    e.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:400});point(e);beep(640,.05);
    say(o.say||o.t);await w(o.wait||1800);}
  a.querySelectorAll('.ca-line.now').forEach(e=>e.classList.remove('now'));
  const st=mk('stamp',`left:${x+wd-200}px;top:${a.offsetTop+a.offsetHeight-14}px;z-index:25;font-size:20px`,'✍️ Learn it!');
  an(st,[{transform:'scale(3) rotate(-20deg)',opacity:0},{transform:'rotate(-4deg)',opacity:1}],{duration:500,fill:'both',easing:'cubic-bezier(.5,1.6,.5,1)'});yay();
  if(trick){const ty=a.offsetTop+a.offsetHeight+34,tr=mk('ca-trick',`left:${x}px;top:${ty}px;width:${wd}px`,'💡 '+trick);pop(tr);point(tr);say(trick);await w(2400);}
  unpoint();return{card:c,ans:a};}

/* ---------- build the code: tap tiles in order ----------
   tiles: tiles to choose from (add a few wrong ones); answer: list of accepted tile sequences. Resolves {ok, built}. */
async function buildCode(w,{q,src,tiles,answer,top=20,lang='html'}){
  const box=mk('ex-q',`top:${top}px`,(src?`<span class="src">${src}</span>`:'')+q);pop(box);
  await w(60);const y=top+box.offsetHeight+14;
  const slot=mk('cb-slot',`left:60px;top:${y}px;width:840px`,'');pop(slot);
  let seq=[],checked=false,ck=null,ckTop=y+160;
  const show=()=>{slot.innerHTML=seq.length?seq.map(t=>`<span>${hl(t,lang)}</span>`).join(''):'<i>Tap the tiles in order to build the code</i>';
    if(seq.length&&!ck&&!checked)ck=btn('ex-btn green',`left:380px;top:${ckTop}px;width:200px`,'Check ✔',()=>{checked=true;});
    if(!seq.length&&ck){ck.remove();ck=null;}};
  const T=tiles.map(t=>btn('cb-tile','left:0;top:0;visibility:hidden',hl(t,lang),()=>{if(checked)return;seq.push(t);beep(560+seq.length*40,.05);show();}));
  const del=btn('cb-del','left:0;top:0;visibility:hidden','⌫',()=>{if(checked)return;seq.pop();beep(300,.05);show();});
  await w(30);
  const all=[...T,del],gap=10,rows=[[]];let rw=0;
  all.forEach(b=>{const bw=b.offsetWidth;if(rw+bw>900&&rows[rows.length-1].length){rows.push([]);rw=0;}rows[rows.length-1].push(b);rw+=bw+gap;});
  rows.forEach((r,ri)=>{let x=480-(r.reduce((s,b)=>s+b.offsetWidth+gap,0)-gap)/2;r.forEach((b,i)=>{b.style.left=x+'px';b.style.top=(y+slot.offsetHeight+16+ri*64)+'px';b.style.visibility='';pop(b,i*40);x+=b.offsetWidth+gap;});});
  ckTop=y+slot.offsetHeight+16+rows.length*64+6;show();
  window.AUTOPLAY=()=>{if(!seq.length){seq=answer[0].slice();show();}};
  await w.until(()=>checked);window.AUTOPLAY=null;
  if(ck)ck.remove();T.forEach(b=>b.remove());del.remove();
  const norm=a=>a.join('').replace(/\s+/g,'').toLowerCase();const ok=answer.some(a=>norm(a)===norm(seq));
  slot.classList.add(ok?'ok':'bad');if(ok){yay();confetti(40);}else{boo();shake(slot);}
  if(!ok){const r=mk('ca-note',`left:60px;top:${y+slot.offsetHeight+16}px;width:840px`,`The right code is: <span class="code">${answer[0].map(t=>hl(t,lang)).join(' ')}</span>`);r.style.background='#1e2433';r.style.color='#e8ecf5';pop(r);}
  return{ok,built:seq.join(' '),y:y+slot.offsetHeight+16};}

/* ---------- the last scene: badges, confetti and the way home ----------
   badges: [[emoji, label html, spoken line]] (up to 8); next: what the next lesson is about (spoken). */
async function recap(w,{title,badges,next}){
  say(`Brilliant! 🎉 You finished <b>${title}</b>. Let's look back at what you learned.`);await w(2400);
  const n=badges.length,cols=Math.min(4,n),rows=Math.ceil(n/4),bh=rows>1?200:250;
  for(let i=0;i<n;i++){const r=Math.floor(i/4),inRow=Math.min(4,n-r*4),x0=480-(inRow*237-15)/2;
    const b=mk('badge',`left:${x0+(i%4)*237}px;top:${14+r*214}px;width:222px;height:${bh}px`,`<span class="e">${badges[i][0]}</span><div style="font-size:19px;line-height:1.25">${badges[i][1]}</div>`);
    pop(b);beep(500+i*70,.08);point(b);say(badges[i][2]);await w(1900);}
  unpoint();confetti(200);yay();await w(1000);
  const f=mk('',`left:180px;top:448px;width:600px;height:58px;border-radius:18px;background:linear-gradient(135deg,#0e7490,#22b8c9);color:#fff;font-size:21px;font-weight:800;display:flex;align-items:center;justify-content:center;cursor:pointer`,'🏠 Back to the Computer lessons ➜');
  f.onclick=()=>{location.href=COMPUTER.home;};pop(f);
  say(next?`Great job! Next up: ${next}`:`Fantastic! You've finished every Computer lesson. Try <b>Computer Quest</b> next!`);await w(2000);}
