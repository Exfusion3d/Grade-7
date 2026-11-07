/* The subjects and their lessons, shared by the home page, the subject pages and the parent page.
   Lesson ids are one letter per subject plus a number: l = Science (named before subjects existed), m = Maths.
   A lesson without an href is planned but not built yet ("coming soon"). Hrefs are relative to the site root.
   To add a subject: add it here (soon:true until its first lesson exists), give it a page like maths.html,
   and put its lessons in a folder of their own. */
window.SUBJECTS = [
  {id:'science', name:'Science', emoji:'🔬', page:'science.html', grad:'#6a45d8,#2c66cf', guide:'Professor Atom',
    blurb:'Units 4, 5 and 9 · with Professor Atom',
    quiz:{href:'quiz.html', title:'Science Quest Quiz', desc:'111 fun questions: drag, match, slide, build circuits and earn stars.',
      modes:[['u4','🦓','Unit 4'],['u5','⚗️','Unit 5'],['u9','⚡','Unit 9'],['boss','👑','Final Boss']]},
    guidePdf:{href:'study-guide.pdf', title:'Study Guide (PDF)', desc:'Every worksheet topic explained, plus a one-page cheat sheet.'},
    units:[
      {tag:'Unit 4', name:'Grouping & identifying organisms', color:'#17935b', soft:'#bfe7d2', les:[
        ['l01','lessons/l01-life-processes.html','🦓','Is it alive? The 7 life processes'],
        ['l02','lessons/l02-viruses.html','🦠','Viruses: alive or not?'],
        ['l03','lessons/l03-species.html','🦁','What is a species?'],
        ['l04','lessons/l04-keys.html','🔍','Dichotomous keys']]},
      {tag:'Unit 5', name:'Properties of materials', color:'#e06a1b', soft:'#f7d3b5', les:[
        ['l05','lessons/l05-metals-nonmetals.html','⚛️','Metals & non-metals: Periodic Table Adventure'],
        ['l06','lessons/l06-choosing-materials.html','🧰','Choosing materials: the property toolkit'],
        ['l07','lessons/l07-alloys-rusting.html','⚙️','Alloys and rusting'],
        ['l08','lessons/l08-particles-heat.html','🔥','Particles and heat'],
        ['l09','lessons/l09-acids-alkalis.html','🌈','Acids, alkalis & the pH scale'],
        ['l10','lessons/l10-hazards-safety.html','⚠️','Hazard symbols & lab safety']]},
      {tag:'Unit 9', name:'Electricity', color:'#2c66cf', soft:'#c6d8f6', les:[
        ['l11','lessons/l11-current-components.html','💡','Current & circuit components'],
        ['l12','lessons/l12-measuring-current.html','📟','Measuring current: ammeters & amps'],
        ['l13','lessons/l13-series-circuits.html','🔋','Series circuits: brighter, dimmer, off'],
        ['l14','lessons/l14-conductors-insulators.html','🔌','Conductors & insulators']]}]},
  {id:'maths', name:'Maths', emoji:'➗', page:'maths.html', grad:'#e06a1b,#f5a54a', guide:'Pi the Robot',
    blurb:'2nd Term · with Pi the Robot',
    quiz:{title:'Maths Quest Quiz', desc:'One level per chapter plus a Final Boss. Coming after the lessons.'},
    guidePdf:{title:'Study Guide (PDF)', desc:'Every worksheet topic plus a cheat sheet. Coming after the lessons.'},
    units:[
      {tag:'Chapter 2', name:'Expressions, formulae and equations', color:'#e06a1b', soft:'#f7d3b5', les:[
        ['m01','maths/m01-writing-expressions.html','✏️','Writing expressions'],
        ['m02',null,'🔢','Substituting into expressions and formulae'],
        ['m03',null,'🧱','Simplifying and like terms'],
        ['m04',null,'📦','Expanding brackets'],
        ['m05',null,'⚖️','Solving equations'],
        ['m06',null,'↔️','Inequalities']]},
      {tag:'Chapter 4', name:'Decimals', color:'#2c66cf', soft:'#c6d8f6', les:[
        ['m07',null,'🔍','Ordering and comparing decimals'],
        ['m08',null,'🧠','Mental methods with decimals'],
        ['m09',null,'✖️','Multiplying decimals'],
        ['m10',null,'💰','Dividing decimals and money problems']]},
      {tag:'Chapter 6', name:'Collecting data', color:'#17935b', soft:'#bfe7d2', les:[
        ['m11',null,'📊','Types of data, mode, median and mean']]},
      {tag:'Chapter 9', name:'Sequences and functions', color:'#6a45d8', soft:'#ddd3fb', les:[
        ['m12',null,'🧮','Order of operations and negative numbers'],
        ['m13',null,'🔁','Sequences and patterns'],
        ['m14',null,'⚙️','The nth term and function machines']]},
      {tag:'Chapter 10', name:'Percentages', color:'#d6336c', soft:'#f6c9da', les:[
        ['m15',null,'💯','Percentages, fractions and decimals']]}]},
  {id:'french', name:'French', emoji:'🇫🇷', grad:'#2c66cf,#5d9cf5', soon:true, units:[]},
  {id:'kss', name:'KSS', emoji:'🇰🇼', grad:'#17935b,#45c288', soon:true, units:[]},
  {id:'arabic', name:'Arabic', native:'اللغة العربية', emoji:'✒️', grad:'#0f7a6e,#2bb39c', soon:true, units:[]},
  {id:'islamic', name:'Islamic Studies', emoji:'🌙', grad:'#8a5a00,#d9a441', soon:true, units:[]},
];
/* Every lesson by id: {id, href, e, t, num, subject, unit} */
window.LESSONS = {};
SUBJECTS.forEach(S => S.units.forEach(U => U.les.forEach(([id, href, e, t]) => {
  LESSONS[id] = {id, href, e, t, num: +id.slice(1), subject: S, unit: U};
})));

/* ---------- helpers for the home and subject pages ---------- */
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
/* This student's own lesson progress saved on this device (src/account.js), which includes saves not yet sent. */
function localLessons(){try{const me=JSON.parse(localStorage.getItem('g7_me'));return JSON.parse(localStorage.getItem('g7_resume_'+me.username)).lessons||{};}catch(e){return{};}}
/* The student's saved overview (from Convex, cached by src/account.js) so pages draw instantly and offline. */
function cachedOverview(){try{const me=JSON.parse(localStorage.getItem('g7_me'));return JSON.parse(localStorage.getItem('g7_overview_'+me.username));}catch(e){return null;}}
/* Finished and started state of every lesson, merging the overview with this device's own saves. */
function lessonState(ov){
  const prog=Object.fromEntries((ov?.lessons||[]).map(l=>[l.lessonId,l])),mine=localLessons(),out={};
  Object.keys(LESSONS).forEach(id=>{const p=mine[id]||prog[id];out[id]={done:!!prog[id]?.done||!!mine[id]?.done,lastScene:p?.lastScene||0};});
  return out;}
/* Built lessons of a subject and how many are finished. */
function subjectCount(S,st){const built=S.units.flatMap(U=>U.les).filter(l=>l[1]);return{total:built.length,fin:built.filter(l=>st[l[0]].done).length};}

/* "Lessons to revise": all subjects (with a subject label) or just one. */
function renderRevise(ov,onlySubject){
  const rv=document.getElementById('revise');if(!rv)return;
  const list=(ov?.revise||[]).filter(r=>LESSONS[r.lessonId]?.href&&(!onlySubject||LESSONS[r.lessonId].subject.id===onlySubject));
  if(list.length){
    rv.innerHTML=`<h2>📖 Lessons to revise</h2><p class="why">Based on your quizzes and Exam checks. A lesson leaves this list once you get its questions right.</p>`+
      list.map(r=>{const L=LESSONS[r.lessonId];return `<a class="rv" href="${L.href}"><span class="e">${L.e}</span><div><div class="n">`+
        (onlySubject?'':`<span class="chip" style="background:linear-gradient(135deg,${L.subject.grad})">${L.subject.name}</span>`)+
        `Lesson ${L.num}</div><div class="t">${esc(L.t)}</div></div><span class="cnt">${r.wrong} question${r.wrong>1?'s':''} to fix</span></a>`;}).join('');
    rv.hidden=false;
  }else if(ov&&ov.answered){rv.innerHTML=`<p class="clear">🎉 <b>Nothing to revise right now!</b> Every question you got wrong, you've since got right.</p>`;rv.hidden=false;}
  else rv.hidden=true;}

/* Home page: one card per subject. */
function renderHome(ov){
  const st=lessonState(ov);let T=0,F=0;
  document.getElementById('subjects').innerHTML=SUBJECTS.map(S=>{
    const name=S.name+(S.native?` · <span dir="rtl" lang="ar">${S.native}</span>`:'');
    if(S.soon)return `<div class="subj soon" style="background:linear-gradient(135deg,${S.grad})"><span class="tag">Coming soon</span><div class="e">${S.emoji}</div><h3>${name}</h3><p>Lessons will appear here</p></div>`;
    const {total,fin}=subjectCount(S,st);T+=total;F+=fin;
    return `<a class="subj" href="${S.page}" style="background:linear-gradient(135deg,${S.grad})">${fin&&fin===total?'<span class="tag">🏆 All done</span>':''}<div class="e">${S.emoji}</div><h3>${name}</h3>`+
      `<p>${fin} of ${total} lesson${total>1?'s':''} finished · ${S.blurb}</p><div class="bar"><i style="width:${total?fin/total*100:0}%"></i></div></a>`;}).join('');
  document.getElementById('bar').style.width=(T?F/T*100:0)+'%';
  document.getElementById('ptxt').textContent=F?`${F} of ${T} lessons finished across all subjects`:`${T} lessons ready · pick a subject to start!`;
  renderRevise(ov);}

/* A subject page: lessons by unit, progress bar, Lessons to revise, quiz and study guide cards. */
function renderSubject(id,ov){
  const S=SUBJECTS.find(s=>s.id===id),st=lessonState(ov);
  const box=document.getElementById('units');box.innerHTML='';
  S.units.forEach(U=>{box.insertAdjacentHTML('beforeend',`<h2 class="sec"><span class="u" style="background:${U.color}">${U.tag}</span>${U.name}</h2><div class="lessons" style="--soft:${U.soft}">`+
    U.les.map(([lid,href,e,t])=>{const s=st[lid];
      if(!href)return `<div class="les soon"><span class="e">${e}</span><div><div class="n">Lesson ${+lid.slice(1)} · coming soon</div><div class="t">${t}</div></div></div>`;
      const cont=!s.done&&s.lastScene>=2?` <span class="cont">▶ continue at scene ${s.lastScene}</span>`:'';
      return `<a class="les${s.done?' done':''}" href="${href}"><span class="e">${e}</span><div><div class="n">Lesson ${+lid.slice(1)}${cont}</div><div class="t">${t}</div></div><span class="ok">✅</span></a>`;}).join('')+'</div>');});
  const {total,fin}=subjectCount(S,st);
  document.getElementById('bar').style.width=(total?fin/total*100:0)+'%';
  const planned=S.units.reduce((n,U)=>n+U.les.length,0);
  document.getElementById('ptxt').textContent=(fin?`${fin} of ${total} lessons finished${fin===total&&total===planned?' 🏆 All done!':''}`:`${total} lesson${total>1?'s':''} ready · start with Lesson 1!`)+(planned>total?` · ${planned-total} more coming`:'');
  renderRevise(ov,id);
  const qb=ov?.quizBest||{},q=S.quiz,g=S.guidePdf;
  const best=q.modes&&Object.keys(qb).some(m=>q.modes.some(x=>x[0]===m))?'Your best: '+q.modes.map(([m,e,n])=>`<span title="${n}">${e} ${qb[m]?'⭐'.repeat(qb[m].stars)+'☆'.repeat(3-qb[m].stars):'–'}</span>`).join(' · '):'';
  document.getElementById('practise').innerHTML=
    (q.href?`<a class="card c2" href="${q.href}">`:`<div class="card c2 soon">`)+`<span class="e">🎮</span><div><h3>${q.title}</h3><p>${q.desc}</p>${best?`<p class="qbest">${best}</p>`:''}</div>`+(q.href?'</a>':'</div>')+
    (g.href?`<a class="card c3" href="${g.href}">`:`<div class="card c3 soon">`)+`<span class="e">📄</span><div><h3>${g.title}</h3><p>${g.desc}</p></div>`+(g.href?'</a>':'</div>');}
