// ===== app =====
const GR=[{k:'中1',n:'中学1年'},{k:'中2',n:'中学2年'},{k:'中3',n:'中学3年'},{k:'数I',n:'数学Ⅰ'},{k:'数A',n:'数学A'},{k:'数II',n:'数学Ⅱ'},{k:'数B',n:'数学B'},{k:'数III',n:'数学Ⅲ'},{k:'数C',n:'数学C'}];
const GL=k=>k.replace('III','Ⅲ').replace('II','Ⅱ').replace(/I$/,'Ⅰ');
const byId=id=>U.find(u=>u.id===id);
const inG=g=>U.filter(u=>u.g===g);
const KEY='sugaku-hogan-v1';
const DEF={xp:0,stars:{},read:{},lab:{},correct:0,answered:0,maxCombo:0,streak:0,last:'',daily:{d:'',xp:0},badges:{},lastUnit:null,grade:'中1'};
let S=(()=>{try{const s=JSON.parse(localStorage.getItem(KEY));return s?{...DEF,...s}:{...DEF}}catch(e){return {...DEF}}})();
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const today=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const yest=()=>{const d=new Date();d.setDate(d.getDate()-1);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const DAILY=50;
const TITLES=['はじめの一歩','計算みならい','文字つかい','グラフ読み','図形の目','関数ハンター','証明の探偵','微積の旅人','ベクトル使い','数学の達人'];
const lvOf=xp=>{let L=1;while(25*(L+1)*L<=xp)L++;return L};
const lvBase=L=>25*L*(L-1);
const title=L=>TITLES[Math.min(L-1,TITLES.length-1)];
const starsOf=id=>S.stars[id]||0;
const totalStars=()=>U.reduce((s,u)=>s+starsOf(u.id),0);

function toast(msg,cls){const t=document.getElementById('toast');const d=document.createElement('div');d.innerHTML=msg;if(cls)d.className=cls;t.appendChild(d);setTimeout(()=>d.remove(),2600)}
function addXP(n){const before=lvOf(S.xp);S.xp+=n;const d=today();
 if(S.last!==d){S.streak=S.last===yest()?S.streak+1:1;S.last=d}
 if(S.daily.d!==d)S.daily={d,xp:0};const wasDone=S.daily.xp>=DAILY;S.daily.xp+=n;
 const after=lvOf(S.xp);if(after>before){toast(`レベルアップ! Lv.${after}「${title(after)}」`,'lvup');confetti()}
 if(!wasDone&&S.daily.xp>=DAILY)toast('きょうの目標 達成!','lvup');
 checkBadges();save();renderChip()}

const BADGES=[
 {id:'first',n:'はじめての正解',s:'初正解',ok:()=>S.correct>=1},
 {id:'c50',n:'正解 50 問',s:'50問',ok:()=>S.correct>=50},
 {id:'c200',n:'正解 200 問',s:'200問',ok:()=>S.correct>=200},
 {id:'cb5',n:'5 問連続正解',s:'5連続',ok:()=>S.maxCombo>=5},
 {id:'cb10',n:'10 問連続正解',s:'10連続',ok:()=>S.maxCombo>=10},
 {id:'perfect',n:'はじめての満点',s:'満点',ok:()=>Object.values(S.stars).some(v=>v>=3)},
 {id:'lab10',n:'実験を 10 単元',s:'実験家',ok:()=>Object.keys(S.lab).length>=10},
 {id:'st3',n:'3 日連続で学習',s:'3日',ok:()=>S.streak>=3},
 {id:'st7',n:'7 日連続で学習',s:'7日',ok:()=>S.streak>=7},
 {id:'mix',n:'ミックス 8 問以上',s:'ミックス',ok:()=>!!S.mixClear},
 ...GR.map(g=>({id:'g'+g.k,n:`${g.n} を全単元クリア`,s:GL(g.k)+'<br>修了',ok:()=>inG(g.k).every(u=>starsOf(u.id)>=1)})),
 {id:'all',n:'全単元で星3つ',s:'全制覇',ok:()=>U.every(u=>starsOf(u.id)>=3)}];
function checkBadges(){BADGES.forEach(b=>{if(!S.badges[b.id]&&b.ok()){S.badges[b.id]=today();setTimeout(()=>toast(`スタンプ獲得:${b.n}`),400)}})}

function renderChip(){const L=lvOf(S.xp),b=lvBase(L),nx=lvBase(L+1);document.getElementById('chip').innerHTML=`<span class="lv">Lv.${L}</span><span class="xpbar" title="次のレベルまで ${nx-S.xp} XP"><span style="width:${(S.xp-b)/(nx-b)*100}%"></span></span><span class="lv">${S.xp} XP</span>`}

// ---------- router ----------
let V={name:'home'};let curDraw=null;
function go(v){V=v;curDraw=null;render();window.scrollTo({top:0,behavior:'instant'in window?'instant':'auto'})}
function render(){renderChip();const app=document.getElementById('app');if(V.name==='home')return home(app);if(V.name==='unit')return unitView(app);if(V.name==='mix')return quizView(app)}

// ---------- home ----------
function ring(p){const r=54,c=2*Math.PI*r;return `<svg viewBox="0 0 118 118" aria-hidden="true"><circle cx="59" cy="59" r="${r}" fill="none" stroke="var(--grid2)" stroke-width="7"/><circle cx="59" cy="59" r="${r}" fill="none" stroke="var(--red)" stroke-width="7" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c*(1-Math.min(1,p))}" transform="rotate(-90 59 59)"/></svg>`}
function home(app){const L=lvOf(S.xp),dx=S.daily.d===today()?S.daily.xp:0,lu=S.lastUnit&&byId(S.lastUnit);const g=S.grade;
 const nextU=inG(g).find(u=>starsOf(u.id)<1)||inG(g)[0];
 app.innerHTML=`
 <section class="sheet hero">
  <div class="lvbig">${ring(dx/DAILY)}<div><div class="s">LEVEL</div><div class="n">${L}</div><div class="s">${dx>=DAILY?'目標達成':'きょう '+dx+'/'+DAILY}</div></div></div>
  <div style="min-width:0">
   <div class="eyebrow">きょうのノート</div>
   <h1>${title(L)}</h1>
   <div class="stats"><span><b>${S.streak}</b>日連続</span><span><b>${totalStars()}</b>/ ${U.length*3} 星</span><span><b>${S.correct}</b>問 正解</span><span><b>${lvBase(L+1)-S.xp}</b>XP で次のレベル</span></div>
   <div class="row">
    ${lu?`<button class="btn hl" data-go="${lu.id}">続きから:${lu.t}</button>`:`<button class="btn hl" data-go="${nextU.id}">はじめる:${nextU.t}</button>`}
    <button class="btn ghost" id="mixbtn">ミックス10問に挑戦</button>
   </div>
  </div>
 </section>
 <section>
  <div class="eyebrow">学年のみちのり</div>
  <div class="tabs" role="tablist" style="margin-top:8px">${GR.map(x=>{const us=inG(x.k),st=us.reduce((s,u)=>s+starsOf(u.id),0);return `<button class="tab" role="tab" aria-selected="${x.k===g}" data-g="${x.k}">${GL(x.k)}<small>★${st}/${us.length*3}</small></button>`}).join('')}</div>
  <div class="sheet units">${inG(g).map((u,i)=>{const s=starsOf(u.id);return `<button class="unit ${s?'done':''}" data-go="${u.id}">
   <span class="no">${String(i+1).padStart(2,'0')}</span>
   <span style="min-width:0"><span class="tt">${u.t}</span><span class="tg">${u.tag}</span>
   <span class="marks"><span class="${S.read[u.id]?'on':''}">イメージ</span><span class="${S.lab[u.id]?'on':''}">さわる</span><span class="${s?'on':''}">チャレンジ</span></span></span>
   <span class="stars" aria-label="星 ${s} つ">${[1,2,3].map(k=>`<span class="${k<=s?'on':''}">★</span>`).join('')}</span></button>`}).join('')}</div>
 </section>
 <section>
  <div class="eyebrow">スタンプ帳　${Object.keys(S.badges).length} / ${BADGES.length}</div>
  <div class="stamps">${BADGES.map(b=>`<div class="stamp ${S.badges[b.id]?'got':''}"><div class="seal">${b.s}</div>${b.n}</div>`).join('')}</div>
 </section>
 <section class="foot">
  単元の並びは現行の学習指導要領(中学:2021年度〜、高校:2022年度入学生〜)の科目区分にもとづく目安です。教科書や学校によって扱う学年・順番が異なる場合があります。学習の記録はこのブラウザの中だけに保存されます。
  <div class="confirm" id="reset" style="margin-top:8px"><button class="btn ghost" data-reset="1" style="padding:5px 14px;font-size:12px">記録をリセット</button></div>
 </section>`;
 app.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>go({name:'unit',id:b.dataset.go,step:0}));
 app.querySelectorAll('[data-g]').forEach(b=>b.onclick=()=>{S.grade=b.dataset.g;save();home(app)});
 app.querySelector('#mixbtn').onclick=startMix;
 const rs=app.querySelector('#reset');rs.onclick=e=>{const t=e.target.closest('button');if(!t)return;
  if(t.dataset.reset==='1')rs.innerHTML=`<span>本当に消しますか?</span><button class="btn" data-reset="2" style="padding:5px 14px;font-size:12px;background:var(--red);border-color:var(--red)">消す</button><button class="btn ghost" data-reset="0" style="padding:5px 14px;font-size:12px">やめる</button>`;
  else if(t.dataset.reset==='2'){S={...DEF};save();go({name:'home'})}else home(app)};
}

// ---------- unit ----------
function unitView(app){const u=byId(V.id);S.lastUnit=u.id;save();const st=V.step||0;const done=[S.read[u.id],S.lab[u.id],starsOf(u.id)>0];
 const names=['イメージ','さわってみる','チャレンジ'];
 app.innerHTML=`<div class="uhead"><button class="back" id="bk">← 学年のみちのりへ</button><div style="margin-top:10px"><span class="gtag">${GR.find(x=>x.k===u.g).n}</span></div><h1>${u.t}</h1><div style="color:var(--muted)">${u.tag}</div></div>
 <div class="steps" role="tablist">${names.map((n,i)=>`<button class="step" role="tab" aria-selected="${i===st}" data-st="${i}"><small>STEP ${i+1}${done[i]?'<span class="ck">✓</span>':''}</small>${n}</button>`).join('')}</div>
 <section class="sheet panel" id="pn"></section>`;
 app.querySelector('#bk').onclick=()=>{S.grade=u.g;go({name:'home'})};
 app.querySelectorAll('[data-st]').forEach(b=>b.onclick=()=>{V.step=+b.dataset.st;unitView(app)});
 const pn=app.querySelector('#pn');
 if(st===0){pn.innerHTML=`<div class="eyebrow">ひとことで</div><p class="one"><span class="mk">${u.one}</span></p>
  <div class="sec"><h3>たとえば</h3><p style="margin:0">${u.story}</p></div>
  <div class="sec"><h3>これだけ覚える</h3><div class="keybox">${u.key}</div></div>
  <div class="sec"><p class="trap" style="margin:0">${u.trap}</p></div>
  <div class="next"><button class="btn hl" id="nx">わかった!さわってみる →</button></div>`;
  pn.querySelector('#nx').onclick=()=>{if(!S.read[u.id]){S.read[u.id]=1;addXP(5);toast('+5 XP イメージをつかんだ')}V.step=1;unitView(app)}}
 else if(st===1){mountLab(u,pn);const nx=document.createElement('div');nx.className='next';nx.innerHTML=`<button class="btn hl">チャレンジ 5問へ →</button>`;pn.appendChild(nx);nx.firstChild.onclick=()=>{V.step=2;unitView(app)}}
 else startQuiz(pn,[u],5,'unit');
}

function mountLab(u,host){const spec=LABS[u.lab];const st={opt:u.labOpt||{}};spec.init&&spec.init(st);const v={};spec.sliders.forEach(s=>v[s.k]=s.v);
 const fmt=(s,x)=>(s.step<1?fmtN(x):neg(x))+(s.u||'');
 host.innerHTML=`<div class="lab"><div class="eyebrow">スライダーを動かして、変化を見てみよう</div><div class="cvwrap"><canvas class="cv" role="img" aria-label="${u.t}の動く図"></canvas></div><div class="readout" aria-live="polite"></div>
 <div class="ctrls">${spec.sliders.map(s=>`<div class="sl"><label for="s-${u.id}-${s.k}">${s.l}<output data-sv="${s.k}">${fmt(s,s.v)}</output></label><input type="range" id="s-${u.id}-${s.k}" data-k="${s.k}" min="${s.min}" max="${s.max}" step="${s.step}" value="${s.v}"></div>`).join('')}</div>
 ${spec.buttons?`<div class="row">${spec.buttons.map((b,i)=>`<button class="btn ghost" data-b="${i}">${b.l}</button>`).join('')}</div>`:''}</div>`;
 const cv=host.querySelector('canvas'),ro=host.querySelector('.readout');
 const draw=()=>{const w=cv.parentElement.clientWidth;cv.style.height=Math.round(Math.max(190,Math.min(440,w*(spec.ratio||.62))))+'px';const g=makeG(cv);ro.innerHTML=spec.draw(g,v,st)||'';
  spec.sliders.forEach(s=>{const o=host.querySelector(`[data-sv="${s.k}"]`);if(o)o.textContent=fmt(s,v[s.k])})};
 const touched=()=>{if(!S.lab[u.id]){S.lab[u.id]=1;addXP(5);toast('+5 XP 実験した!')}};
 host.querySelectorAll('input[type=range]').forEach(el=>el.addEventListener('input',()=>{v[el.dataset.k]=+el.value;touched();draw()}));
 host.querySelectorAll('[data-b]').forEach(el=>el.onclick=()=>{spec.buttons[+el.dataset.b].f(st,v);touched();draw()});
 curDraw=draw;draw();
 if(window.ResizeObserver){let lw=0;new ResizeObserver(()=>{const w=cv.parentElement.clientWidth;if(w!==lw&&curDraw===draw){lw=w;draw()}}).observe(cv.parentElement)}
}

// ---------- quiz ----------
let Q=null;
function startMix(){go({name:'mix'})}
function quizView(app){app.innerHTML=`<div class="uhead"><button class="back" id="bk">← もどる</button><h1 style="margin-top:8px">ミックス10問</h1><div style="color:var(--muted)">これまで学んだ単元からランダムに出題</div></div><section class="sheet panel" id="pn"></section>`;
 app.querySelector('#bk').onclick=()=>go({name:'home'});let pool=U.filter(u=>S.read[u.id]||S.lab[u.id]||S.stars[u.id]!=null);if(pool.length<3)pool=inG(S.grade);startQuiz(app.querySelector('#pn'),pool,10,'mix')}
function startQuiz(host,units,n,mode){Q={host,units,n,mode,i:0,score:0,combo:0,xp:0,res:[],cur:null,hint:false};nextQ()}
const HANA=`<svg class="hana" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 6c18 0 27 13 25 26S43 58 29 57 5 45 7 30 22 9 36 12s17 15 14 24-12 13-19 11-9-9-6-14 9-6 12-3"/></svg>`;
function nextQ(){const {host}=Q;if(Q.i>=Q.n)return endQuiz();const u=Q.units.length===1?Q.units[0]:pick(Q.units);Q.cur={u,...buildQ(u)};Q.hint=false;const q=Q.cur;
 host.innerHTML=`<div class="pips">${[...Array(Q.n)].map((_,i)=>`<i class="${i<Q.i?(Q.res[i]?'ok':'ng'):i===Q.i?'cur':''}"></i>`).join('')}</div>
 <div class="qhead"><span>第 ${Q.i+1} 問${Q.mode==='mix'?' ・ '+GL(u.g)+' '+u.t:''}</span><span class="combo">${Q.combo>=2?Q.combo+' 連続正解!':''}</span></div>
 <div class="q">${q.q}</div>
 <div class="opts">${q.opts.map((o,i)=>`<button class="opt" data-i="${i}"><span class="k">${'ABCD'[i]}</span><span>${o}</span></button>`).join('')}</div>
 <div class="row" style="margin-top:12px" id="hrow"><button class="btn ghost" id="hb" style="padding:6px 14px;font-size:13px">ヒントを見る(獲得XP 半分)</button></div><div id="fbx"></div>`;
 host.querySelector('#hb').onclick=()=>{Q.hint=true;host.querySelector('#hrow').innerHTML=`<div class="hint"><b>ヒント</b> ${u.key}</div>`};
 host.querySelectorAll('.opt').forEach(b=>b.onclick=()=>answer(+b.dataset.i));
 const k=e=>{if(!Q||Q.cur!==q)return document.removeEventListener('keydown',k);const i='abcd'.indexOf(e.key.toLowerCase());if(i>=0&&i<q.opts.length&&!host.querySelector('.opt:disabled'))answer(i)};document.addEventListener('keydown',k)}
function answer(i){const {host,cur:q}=Q;const hb=host.querySelector('#hb');if(hb)hb.remove();const ok=i===q.correct;host.querySelectorAll('.opt').forEach((b,j)=>{b.disabled=true;if(j===q.correct)b.classList.add('ok');else if(j===i)b.classList.add('ng')});
 S.answered++;let gain=0;
 if(ok){Q.combo++;Q.score++;S.correct++;S.maxCombo=Math.max(S.maxCombo,Q.combo);gain=(Q.hint?5:10)+Math.min(Q.combo-1,5)*2;Q.xp+=gain;addXP(gain)}else{Q.combo=0;save()}
 Q.res.push(ok);
 const fb=host.querySelector('#fbx');fb.innerHTML=`<div class="fb ${ok?'ok':'ng'}">${ok?HANA:'<div class="verdict" style="font-size:34px">✓</div>'}<div><div class="verdict">${ok?pick(['正解!','おみごと!','その調子!','バッチリ!']):'おしい!'}${ok?` <small>+${gain} XP</small>`:''}</div><div>${q.ex}</div>${ok?'':`<small>正しい答え:${q.a}</small>`}</div></div>
 <div class="next"><button class="btn hl" id="nq">${Q.i+1>=Q.n?'結果を見る':'次の問題 →'}</button></div>`;
 const nb=fb.querySelector('#nq');nb.onclick=()=>{Q.i++;nextQ()};nb.focus({preventScroll:true});fb.scrollIntoView({block:'nearest',behavior:'smooth'})}
function endQuiz(){const {host,mode,units,score,n}=Q;let stars=0,bonus=0,msg='';
 if(mode==='unit'){const u=units[0];stars=score>=5?3:score>=4?2:score>=3?1:0;const prev=starsOf(u.id);if(stars>prev||S.stars[u.id]==null)S.stars[u.id]=Math.max(prev,stars);if(score===n)bonus=20;msg=stars>prev&&prev?'自己ベスト更新!':''}
 else{stars=score>=10?3:score>=8?2:score>=6?1:0;if(score>=8)S.mixClear=1;bonus=score>=8?30:0}
 if(bonus){Q.xp+=bonus;addXP(bonus)}else{checkBadges();save()}
 if(stars===3)confetti();
 const cm=[ 'くり返すほど、確実に力がつく。もう一度やってみよう。','あと少し! ヒントを使ってもう一回。','いい感じ! 星3つまであと一歩。','完ぺき! 次の単元へ進もう。'][stars];
 const u=mode==='unit'?units[0]:null;const nextU=u&&U[U.indexOf(u)+1];
 host.innerHTML=`<div class="result"><div class="eyebrow">${mode==='unit'?u.t+' のチャレンジ':'ミックス10問'}</div>
 <div class="big" style="margin-top:10px">${score}<small style="font-size:22px"> / ${n}</small></div>
 <div class="rst" aria-label="星 ${stars} つ">${[1,2,3].map(k=>`<span class="${k<=stars?'on':''}" style="animation-delay:${k*.15}s">★</span>`).join('')}</div>
 ${msg?`<div class="good">${msg}</div>`:''}
 <div class="gain"><span>獲得 <b>${Q.xp}</b> XP</span>${bonus?`<span>ボーナス <b>+${bonus}</b></span>`:''}<span>最高連続 <b>${Math.max(...Q.res.reduce((a,r)=>{a.push(r?(a[a.length-1]||0)+1:0);return a},[0]))}</b></span></div>
 <p>${cm}</p>
 <div class="row" style="justify-content:center"><button class="btn ghost" id="again">もう一回</button>${nextU?`<button class="btn hl" id="nu">次の単元:${nextU.t} →</button>`:`<button class="btn hl" id="hm">ホームへ</button>`}</div></div>`;
 host.querySelector('#again').onclick=()=>mode==='unit'?startQuiz(host,units,n,mode):quizView(document.getElementById('app'));
 const nu=host.querySelector('#nu');if(nu)nu.onclick=()=>{S.grade=nextU.g;go({name:'unit',id:nextU.id,step:0})};
 const hm=host.querySelector('#hm');if(hm)hm.onclick=()=>go({name:'home'});Q=null}

// ---------- confetti ----------
function confetti(){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const cv=document.getElementById('fx'),c=cv.getContext('2d');const W=cv.width=innerWidth,H=cv.height=innerHeight;
 const css=getComputedStyle(document.documentElement),cols=['--red','--blue','--green','--marker'].map(k=>css.getPropertyValue(k).trim());
 const ps=[...Array(90)].map(()=>({x:W/2+(Math.random()-.5)*W*.3,y:H*.35,vx:(Math.random()-.5)*12,vy:-Math.random()*12-4,r:Math.random()*6+4,a:Math.random()*6,c:pick(cols),s:Math.random()<.5}));let t=0;
 (function f(){c.clearRect(0,0,W,H);ps.forEach(p=>{p.vy+=.35;p.x+=p.vx;p.y+=p.vy;p.a+=.2;c.save();c.translate(p.x,p.y);c.rotate(p.a);c.fillStyle=p.c;p.s?c.fillRect(-p.r/2,-p.r/4,p.r,p.r/2):(c.beginPath(),c.arc(0,0,p.r/2.4,0,7),c.fill());c.restore()});if(++t<110)requestAnimationFrame(f);else c.clearRect(0,0,W,H)})()}

// ---------- boot ----------
document.getElementById('home').onclick=()=>go({name:'home'});
const redraw=()=>{if(curDraw)curDraw()};
try{matchMedia('(prefers-color-scheme: dark)').addEventListener('change',redraw)}catch(e){}
new MutationObserver(redraw).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(redraw);
render();
