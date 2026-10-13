'use strict';
const DATA=Array.isArray(window.SIVUMAKU_DATA)?window.SIVUMAKU_DATA:[];
const GROUPS=["Lihapullat", "Kana", "Kala & äyriäiset", "Liha", "Pasta & lasagne", "Risotto & riisi", "Texmex & meksikolainen", "Keitot", "Kasvis & lisukkeet", "Kastikkeet & tahnat", "Pizza & leivät", "Jälkiruoat & makeat", "Muut"];
const YEARS=[2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019];
let state={q:"",year:"all",group:"all"};

const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
const norm=s=>String(s??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("fi").replace(/[^\p{L}\p{N}]+/gu," ").trim();

function groupCounts(items){
  const m={};
  items.forEach(x=>m[x.group]=(m[x.group]||0)+1);
  return m;
}
function renderControls(){
  const years=document.getElementById("years");
  years.innerHTML=`<button class="year-btn active" data-year="all">Kaikki vuodet</button>`+
    YEARS.map(y=>`<button class="year-btn" data-year="${y}">${y}</button>`).join("");
  years.onclick=e=>{
    const b=e.target.closest("button"); if(!b)return;
    state.year=b.dataset.year;
    [...years.children].forEach(x=>x.classList.toggle("active",x===b));
    render();
  };
  const counts=groupCounts(DATA);
  const cats=document.getElementById("cats");
  cats.innerHTML=`<button class="cat-btn active" data-group="all"><span>Kaikki</span><span class="count">${DATA.length}</span></button>`+
    GROUPS.filter(g=>counts[g]).map(g=>`<button class="cat-btn" data-group="${esc(g)}"><span>${esc(g)}</span><span class="count">${counts[g]}</span></button>`).join("");
  cats.onclick=e=>{
    const b=e.target.closest("button"); if(!b)return;
    state.group=b.dataset.group;
    [...cats.children].forEach(x=>x.classList.toggle("active",x===b));
    render();
  };
}
function filtered(){
  const q=norm(state.q.trim());
  return DATA.filter(x=>{
    if(state.year!=="all" && String(x.year)!==state.year)return false;
    if(state.group!=="all" && x.group!==state.group)return false;
    if(q && !q.split(/\s+/).every(word=>norm([x.name,x.group,x.subgroup,x.year].join(" ")).includes(word)))return false;
    return true;
  });
}
function itemHTML(x){
  const badge=x.direct
    ? `<span class="badge">↗ MTV-resepti</span>`
    : `<span class="badge searchlink">⌕ MTV-haku</span>`;
  return `<article class="recipe">
    <a class="name" href="${esc(x.href)}" target="_blank" rel="noopener noreferrer">${esc(x.name)}</a>
    <div class="meta"><span>${esc(x.date)}</span>${x.subgroup?`<span class="subgroup">· ${esc(x.subgroup)}</span>`:""}${badge}</div>
  </article>`;
}
function render(){
  const items=filtered();
  document.body.classList.toggle("is-searching",Boolean(state.q.trim()));
  const content=document.getElementById("content");
  const empty=document.getElementById("empty");
  const title=document.getElementById("view-title");
  const count=document.getElementById("result-count");
  title.textContent=state.group==="all"?"Kaikki reseptit":state.group;
  count.textContent=`${items.length} reseptiä`+(state.year!=="all"?` · ${state.year}`:"")+(state.q.trim()?` · haku: ${state.q.trim()}`:"");
  if(!items.length){content.innerHTML="";empty.style.display="block";return;}
  empty.style.display="none";
  const groups=GROUPS.filter(g=>items.some(x=>x.group===g));
  content.innerHTML=groups.map(g=>{
    const gi=items.filter(x=>x.group===g);
    return `<section class="category" id="${encodeURIComponent(g)}">
      <h3 class="category-title"><span class="icon">${esc({"Lihapullat": "●", "Kana": "◒", "Kala & äyriäiset": "≈", "Liha": "◆", "Pasta & lasagne": "⌁", "Risotto & riisi": "◌", "Texmex & meksikolainen": "✦", "Keitot": "◉", "Kasvis & lisukkeet": "❧", "Kastikkeet & tahnat": "✺", "Pizza & leivät": "△", "Jälkiruoat & makeat": "◇", "Muut": "•"}[g]||"•")}</span>${esc(g)} <small style="font:600 12px system-ui;color:#8a8175">${gi.length}</small></h3>
      <div class="recipe-list">${gi.map(itemHTML).join("")}</div>
    </section>`;
  }).join("");
}
document.getElementById("search").addEventListener("input",e=>{state.q=e.target.value;render();});
renderControls(); render();
