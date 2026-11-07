/* Answers the current Maths Quest question in the page (used by quizplay.py). w = null: the right answer; otherwise a wrong one. */
window.clickKey=k=>{const b=[...document.querySelectorAll('.kp button')].find(b=>b.textContent===k);if(!b)throw new Error('no key '+k);b.click();};
window.clearKeys=()=>clickKey('C');
window.check=()=>{const b=[...document.querySelectorAll('#card .actions .go')][0];if(b&&!b.disabled&&!b.closest('.hidden')&&/Check/.test(b.textContent))b.click();};
window.next=()=>{const b=document.querySelector('#card .actions .go.green');if(b)b.click();};
window.answer=(w)=>{const q=S.qs[S.i];
  if(q.type==='type'){[...(w||q.ans[0].split(' or ')[0]).replace(/\s/g,'')].forEach(clickKey);return;}
  if(q.type==='mcq'||q.type==='tf'){const i=w==null?q.a:(q.a+1)%q.o.length;document.querySelectorAll('.opt')[i].click();return;}
  if(q.type==='tiles'){(Array.isArray(w)?w:w?[...q.answers[0]].reverse():q.answers[0]).forEach(t=>[...document.querySelectorAll('.tile')].find(b=>b.textContent===t).click());return;}
  if(q.type==='match'){const L=[...document.querySelectorAll('.match .mcol:first-child .mi')],Rr=[...document.querySelectorAll('.match .mcol:last-child .mi')];
    q.pairs.forEach((p,i)=>{if(!L[i].classList.contains('sel'))L[i].click();const want=w==='swap'?q.pairs[(i+1)%q.pairs.length][1]:p[1];Rr.find(b=>b.querySelector('span:last-child').innerHTML===want).click();});return;}
  if(q.type==='line'){document.querySelector(`.tk[data-n="${q.at}"]`).dispatchEvent(new MouseEvent('click',{bubbles:true}));
    document.querySelector(`[data-c="${q.closed?1:0}"]`).click();document.querySelector(`[data-d="${w==='wrongdir'?-q.dir:q.dir}"]`).click();return;}
  if(q.type==='order'){(w?[...q.items].reverse():q.items).forEach(t=>[...document.querySelectorAll('.tile')].find(b=>b.textContent===t&&!b.disabled).click());return;}
};
