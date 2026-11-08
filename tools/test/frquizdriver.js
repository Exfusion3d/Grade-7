/* Answers the current French Quest question in the page (used by quizplay.py with QUIZ=french-quiz.html). w = null: the right answer; otherwise a wrong one. */
window.check=()=>{const b=[...document.querySelectorAll('#card .actions .go')][0];if(b&&!b.disabled&&!b.closest('.hidden')&&/Check/.test(b.textContent))b.click();};
window.next=()=>{const b=document.querySelector('#card .actions .go.green');if(b)b.click();};
window.answer=(w)=>{const q=S.qs[S.i];const tap=(sel,txt)=>{const b=[...document.querySelectorAll(sel)].find(b=>b.textContent===txt&&!b.disabled);if(!b)throw new Error('no tile '+txt);b.click();};
  if(q.type==='type'){const i=document.querySelector('.tin');i.value=w||q.ans[0];i.dispatchEvent(new Event('input'));return;}
  if(q.type==='mcq'||q.type==='tf'){const i=w==null?q.a:(q.a+1)%q.o.length;document.querySelectorAll('.opt')[i].click();return;}
  if(q.type==='tiles'){(w?[...q.answers[0]].reverse():q.answers[0]).forEach(t=>tap('.tile',t));return;}
  if(q.type==='match'){const L=[...document.querySelectorAll('.match .mcol:first-child .mi')],Rr=[...document.querySelectorAll('.match .mcol:last-child .mi')];
    q.pairs.forEach((p,i)=>{if(!L[i].classList.contains('sel'))L[i].click();const want=w?(i+1)%q.pairs.length:i;Rr.find(b=>+b.dataset.i===want).click();});return;}
  if(q.type==='order'){const idx=w?q.items.map((_,i)=>q.items.length-1-i):q.items.map((_,i)=>i);idx.forEach(i=>document.querySelector(`.ord~.tiles .tile[data-i="${i}"]`).click());return;}
  if(q.type==='conj'){const rows=[...document.querySelectorAll('.cr')];const forms=w?[...q.forms].reverse():q.forms;
    forms.forEach((f,i)=>{rows[i].click();tap('.conj~.tiles .tile',f);});return;}
};
