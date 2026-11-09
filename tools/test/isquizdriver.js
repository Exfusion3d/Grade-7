/* Answers the current Islamic Quest question in the page (used by quizplay.py with QUIZ=islamic-quiz.html DRIVER=isquizdriver.js).
   w = null: the right answer; otherwise a wrong one. */
window.check=()=>{const b=[...document.querySelectorAll('#card .actions .go')][0];if(b&&!b.disabled&&!b.closest('.hidden')&&/Check/.test(b.textContent))b.click();};
window.next=()=>{const b=document.querySelector('#card .actions .go.green');if(b)b.click();};
window.answer=(w)=>{const q=S.qs[S.i];const tap=i=>document.querySelector(`#card .tiles .tile[data-i="${i}"]`).click();
  if(q.type==='mcq'||q.type==='tf'){const i=w==null?q.a:(q.a+1)%q.o.length;document.querySelectorAll('.opt')[i].click();return;}
  if(q.type==='spot'){const i=w==null?q.keys[0]:q.words.findIndex((_,k)=>!q.keys.includes(k));document.querySelectorAll('.sw')[i].click();return;}
  if(q.type==='tiles'){const idx=q.answer.map(t=>q.tiles.findIndex(x=>x[0]===t));(w?idx.reverse():idx).forEach(tap);return;}
  if(q.type==='spell'){const used=[];const idx=[...q.answer].map(ch=>{const i=q.letters.findIndex((l,k)=>l===ch&&!used.includes(k));used.push(i);return i;});
    (w?[q.letters.findIndex((_,k)=>!used.includes(k))]:idx).forEach(tap);return;}
  if(q.type==='write'){document.querySelector('.selfmark .go').click();[...document.querySelectorAll('.selfmark button')][w?1:0].click();return;}
  if(q.type==='match'){const L=[...document.querySelectorAll('.match .mcol:first-child .mi')],Rr=[...document.querySelectorAll('.match .mcol:last-child .mi')];
    q.pairs.forEach((p,i)=>{if(!L[i].classList.contains('sel'))L[i].click();const want=w?(i+1)%q.pairs.length:i;Rr.find(b=>+b.dataset.i===want).click();});return;}
};
