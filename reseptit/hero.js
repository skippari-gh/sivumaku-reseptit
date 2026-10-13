'use strict';
Promise.all(Array.from({length:8},(_,i)=>fetch(`/assets/hero-${i+1}.txt`).then(r=>{if(!r.ok)throw new Error(`Hero chunk ${i+1} failed`);return r.text();})))
  .then(parts=>{document.querySelector('.hero').style.backgroundImage=`url("data:image/webp;base64,${parts.join('')}")`;})
  .catch(console.error);