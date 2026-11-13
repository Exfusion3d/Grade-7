/* Answers the current Computer Quest question in the page (used by quizplay.py with QUIZ=computer-quiz.html DRIVER=cpquizdriver.js).
   w = null: the right answer; otherwise a wrong one. */
window.check=()=>{const b=[...document.querySelectorAll('#card .actions .go')][0];if(b&&!b.disabled&&!b.closest('.hidden')&&/Check/.test(b.textContent))b.click();};
window.next=()=>{const b=document.querySelector('#card .actions .go.green');if(b)b.click();};
window.answer=(w)=>{const q=S.qs[S.i];
  if(q.type==='mcq'||q.type==='tool'){const i=w==null?q.a:(q.a+1)%q.o.length;document.querySelectorAll('.opt')[i].click();return;}
  if(q.type==='tf'){const v=w==null?q.ans:(q.ans==='T'?'F':'T');document.querySelector(`.opt[data-v="${v}"]`).click();return;}
  if(q.type==='blank'){const i=w==null?q.a:(q.a+1)%q.o.length;document.querySelector(`.bt[data-i="${i}"]`).click();return;}
  if(q.type==='spot'){const i=w==null?q.bad:(q.bad+1)%q.code.length;document.querySelector(`.tok[data-i="${i}"]`).click();return;}
  if(q.type==='build'){const n=q.answers[0].length;const idx=[...Array(n).keys()];(w?idx.reverse():idx).forEach(i=>document.querySelector(`.slot~.tiles .tile[data-i="${i}"]`).click());return;}
  if(q.type==='match'){const L=[...document.querySelectorAll('.match .mcol:first-child .mi')],Rr=[...document.querySelectorAll('.match .mcol:last-child .mi')];
    q.pairs.forEach((p,i)=>{if(!L[i].classList.contains('sel'))L[i].click();const want=w?(i+1)%q.pairs.length:i;Rr.find(b=>+b.dataset.i===want).click();});return;}
  if(q.type==='order'){const idx=w?q.items.map((_,i)=>q.items.length-1-i):q.items.map((_,i)=>i);idx.forEach(i=>document.querySelector(`.ord~.tiles .tile[data-i="${i}"]`).click());return;}
  throw new Error('unknown type '+q.type);
};
