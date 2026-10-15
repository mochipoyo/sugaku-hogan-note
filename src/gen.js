// ===== helpers =====
const ri=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const rnz=(a,b)=>{let v;do{v=ri(a,b)}while(v===0);return v};
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b]}return a||1};
const neg=n=>n<0?'−'+(-n):''+(n===0?0:n);
const paren=n=>n<0?'('+neg(n)+')':''+n;
const fr=(n,d)=>`<span class="fr"><span class="nu">${n}</span><span class="de">${d}</span></span>`;
const rt=x=>`√<span class="rt">${x}</span>`;
const X2='x<sup>2</sup>',X3='x<sup>3</sup>';
function poly(terms){let s='';terms.forEach(([c,v])=>{if(c===0)return;const ab=Math.abs(c);const cs=(ab===1&&v)?'':ab;if(!s)s=(c<0?'−':'')+cs+v;else s+=(c<0?' − ':' + ')+cs+v});return s||'0'}
function F(n,d=1){if(d<0){n=-n;d=-d}const g=gcd(n,d);n/=g;d/=g;if(d===1)return neg(n);return (n<0?'−':'')+fr(Math.abs(n),d)}
function Fpi(n,d){if(n===0)return '0';if(d<0){n=-n;d=-d}const g=gcd(n,d);n/=g;d/=g;const s=n<0?'−':'';n=Math.abs(n);if(d===1)return s+(n===1?'':n)+'π';return s+fr((n===1?'':n)+'π',d)}
function simpRt(n){let k=1,m=n;for(let i=Math.floor(Math.sqrt(n));i>1;i--){if(n%(i*i)===0){k=i;m=n/(i*i);break}}if(m===1)return String(k);return (k===1?'':k)+rt(m)}
function cplx(a,b){if(b===0)return neg(a);const ib=(Math.abs(b)===1?'':Math.abs(b))+'i';if(a===0)return (b<0?'−':'')+ib;return neg(a)+(b<0?' − ':' + ')+ib}
const pt=(x,y)=>`(${neg(x)}, ${neg(y)})`;
const deg=v=>v+'°';
const fac=a=>a>0?`(x + ${a})`:`(x − ${-a})`;
function fac2(p,q){if(p<q)[p,q]=[q,p];return p===q?fac(p)+'<sup>2</sup>':fac(p)+fac(q)}
const xs=(p,q)=>{if(p>q)[p,q]=[q,p];return p===q?`x = ${neg(p)}`:`x = ${neg(p)}, ${neg(q)}`};
const lg=(b,x)=>`log<sub>${b}</sub> ${x}`;
const pw=(b,e)=>`${b}<sup>${e}</sup>`;
const LIM='lim<sub>n→∞</sub> ';
// trig table
const TV={'0':'0','1':'1','h':fr(1,2),'r2':fr(1,rt(2)),'r3h':fr(rt(3),2),'ir3':fr(1,rt(3)),'r3':rt(3)};
const tv=k=>k[0]==='-'?'−'+TV[k.slice(1)]:TV[k];
const negKey=k=>k==='0'?'0':k[0]==='-'?k.slice(1):'-'+k;
const TRIG={0:{s:'0',c:'1',t:'0'},30:{s:'h',c:'r3h',t:'ir3'},45:{s:'r2',c:'r2',t:'1'},60:{s:'r3h',c:'h',t:'r3'},90:{s:'1',c:'0',t:null},120:{s:'r3h',c:'-h',t:'-r3'},135:{s:'r2',c:'-r2',t:'-1'},150:{s:'h',c:'-r3h',t:'-ir3'},180:{s:'0',c:'-1',t:'0'}};
const TPOOL=['0','1','-1','h','-h','r2','-r2','r3h','-r3h','ir3','-ir3','r3','-r3'];
const FN={s:'sin',c:'cos',t:'tan'};
function trigQ(ang,label){let fns=ang===90?['s','c']:['s','c','t'];const f=pick(fns);const k=TRIG[ang][f];
  const cand=[...['s','c','t'].filter(x=>x!==f).map(x=>TRIG[ang][x]).filter(Boolean),negKey(k),...shuffle(TPOOL.slice())];
  const d=[];cand.forEach(x=>{if(x!==k&&!d.includes(x))d.push(x)});
  return {q:`${FN[f]} ${label} の値は?`,a:tv(k),d:d.map(tv),
    ex:`半径1の円(単位円)で角 ${label} の点は (cos, sin) = (${tv(TRIG[ang].c)}, ${tv(TRIG[ang].s)})。${f==='t'?'tan = sin ÷ cos で '+tv(k)+'。':FN[f]+' は '+(f==='s'?'高さ':'横の位置')+'なので '+tv(k)+'。'}`}}

// ===== units =====
const U=[];
const unit=o=>U.push(o);

// ---------- 中1 ----------
unit({id:'j1a',g:'中1',t:'正の数・負の数',tag:'マイナスは「反対向き」',lab:'numberline',
one:'マイナスは「反対の向き」をあらわす記号。',
story:'数直線を東西にのびる道と考えよう。0 が家、＋は東へ、−は西へ進む。「−3」は西に3歩の場所。たし算は「そこからさらに歩く」、ひき算は「向きを反対にして歩く」こと。',
key:'(−) × (−) = (+)<br><small>反対の反対は、もとの向き。</small>',
trap:'−3 − (−5) は「−5 を取りのぞく」こと。これは +5 と同じなので、答えは 2。',
gen(){const a=rnz(-9,9),b=rnz(-9,9),op=pick(['+','−','×']);const ans=op==='+'?a+b:op==='−'?a-b:a*b;const alt=op==='+'?a-b:op==='−'?a+b:-ans;
 let ex;if(op==='+')ex=`数直線で ${neg(a)} から${b>0?'右':'左'}へ ${Math.abs(b)} 進むと ${neg(ans)}。`;
 else if(op==='−')ex=`「${paren(b)} をひく」は「${paren(-b)} をたす」と同じ。${neg(a)} + ${paren(-b)} = ${neg(ans)}。`;
 else ex=`符号は ${(a<0)!==(b<0)?'(＋と−なので) −':'(同じ符号なので) ＋'}、数の部分は ${Math.abs(a)}×${Math.abs(b)} = ${Math.abs(ans)}。`;
 return {q:`${neg(a)} ${op} ${paren(b)} を計算しよう`,a:neg(ans),d:[neg(-ans),neg(alt),neg(ans+1),neg(ans-2)],ex}}});

unit({id:'j1b',g:'中1',t:'文字と式',tag:'文字は「あとで数を入れる箱」',lab:'machine',
one:'文字は「あとで数を入れる箱」。',
story:'1個 x 円のパンを3個と、100円の牛乳を買うと代金は 3x + 100 円。x にいくらを入れても使える「計算のレシピ」になる。',
key:'3x は 3 × x のこと。<br>同じ文字どうしだけまとめられる:2x + 5x = 7x',
trap:'2x + 3 を 5x にしない。x の箱と、ただの数は別の種類。',
gen(){if(Math.random()<.5){const a=rnz(-5,5),b=rnz(-9,9),k=rnz(-4,4);const ans=a*k+b;
  return {q:`x = ${neg(k)} のとき、${poly([[a,'x'],[b,'']])} の値は?`,a:neg(ans),d:[neg(a*k-b),neg(-a*k+b),neg(a+k+b),neg(ans+a)],
  ex:`x の箱に ${paren(k)} を入れる:${neg(a)} × ${paren(k)} ${b<0?'−':'+'} ${Math.abs(b)} = ${neg(a*k)} ${b<0?'−':'+'} ${Math.abs(b)} = ${neg(ans)}。`}}
 const a=rnz(-6,6),b=rnz(-9,9),c=rnz(-6,6),d=rnz(-9,9);
 return {q:`(${poly([[a,'x'],[b,'']])}) + (${poly([[c,'x'],[d,'']])}) を簡単にしよう`,a:poly([[a+c,'x'],[b+d,'']]),
 d:[poly([[a+c+b+d,'x']]),poly([[a+c,'x'],[b-d,'']]),poly([[a-c,'x'],[b+d,'']]),poly([[a*c,'x'],[b+d,'']])],
 ex:`x の仲間どうし:${neg(a)} + ${paren(c)} = ${neg(a+c)}。数どうし:${neg(b)} + ${paren(d)} = ${neg(b+d)}。`}}});

unit({id:'j1c',g:'中1',t:'一次方程式',tag:'方程式は「つり合った天びん」',lab:'balance',
one:'方程式は「つり合った天びん」。両側に同じことをすれば、つり合いはくずれない。',
story:'左の皿に箱(x)が2つと重り3個、右の皿に重り11個。両側から重りを3個ずつ取ると「箱2つ = 重り8個」。だから箱1つは重り4個分、x = 4。',
key:'ax + b = c<br>→ ax = c − b<br>→ x = (c − b) ÷ a',
trap:'移項すると符号が変わる。左の +3 を右へ移すと −3 になる。',
gen(){const x=rnz(-5,8),a=pick([2,3,4,5,6,-2,-3,-4]),b=rnz(-9,9),c=a*x+b;
 return {q:`${poly([[a,'x'],[b,'']])} = ${neg(c)} を解こう`,a:`x = ${neg(x)}`,
 d:[`x = ${neg(-x)}`,`x = ${F(c+b,a)}`,`x = ${neg(x+1)}`,`x = ${F(c-b,-a)}`,`x = ${neg(c-b)}`],
 ex:`${b>0?'両辺から '+b+' をひく':'両辺に '+(-b)+' をたす'} → ${poly([[a,'x']])} = ${neg(c-b)} → 両辺を ${paren(a)} でわって x = ${neg(x)}。`}}});

const DIV={12:[1,2,3,4,6,12],18:[1,2,3,6,9,18],24:[1,2,3,4,6,8,12,24],36:[1,2,3,4,6,9,12,18,36]};
unit({id:'j1d',g:'中1',t:'比例・反比例',tag:'「一緒にふえる」と「かけると一定」',lab:'prop',
one:'比例は「一緒に同じ倍率でふえる」、反比例は「かけた答えがいつも同じ」。',
story:'1本80円のペンは、本数が2倍なら代金も2倍(比例 y = 80x)。12枚のクッキーを分けるとき、人数が2倍なら1人分は半分(反比例 y = 12 ÷ x)。',
key:`比例 y = ax(原点を通る直線)<br>反比例 y = ${fr('a','x')}(双曲線)`,
trap:'「片方がふえて片方がへる」だけでは反比例とは限らない。x × y がいつも同じかを確かめよう。',
gen(){if(Math.random()<.5){const a=rnz(-5,5),p=ri(1,5),r=rnz(-6,6);
  return {q:`y は x に比例し、x = ${p} のとき y = ${neg(a*p)}。x = ${neg(r)} のときの y は?`,a:neg(a*r),d:[neg(-a*r),F(a*p*p,r),neg(a*r+a),neg(a*p+r)],
  ex:`y = ax に代入して a = ${neg(a*p)} ÷ ${p} = ${neg(a)}。y = ${neg(a)} × ${paren(r)} = ${neg(a*r)}。`}}
 const k=pick([12,18,24,36])*pick([1,-1]);const ds=DIV[Math.abs(k)];const p=pick(ds);let r;do{r=pick(ds)}while(r===p);
 return {q:`y は x に反比例し、x = ${p} のとき y = ${neg(k/p)}。x = ${r} のときの y は?`,a:neg(k/r),d:[F(k*r,p*p),neg(-k/r),F(r,k),neg(k/r+1)],
 ex:`反比例は x × y が一定。${p} × ${paren(k/p)} = ${neg(k)}。だから y = ${neg(k)} ÷ ${r} = ${neg(k/r)}。`}}});

unit({id:'j1e',g:'中1',t:'おうぎ形',tag:'ピザ1切れは円の何分のいくつ?',lab:'sector',
one:'おうぎ形は「ピザの1切れ」。円全体の何分のいくつかを考える。',
story:'中心角が90°なら、360°のうちの90°なので円の4分の1。面積も、弧(まわりの曲線)の長さも、円の4分の1になる。',
key:`弧の長さ = 2πr × ${fr('a','360')}<br>面積 = πr<sup>2</sup> × ${fr('a','360')}`,
trap:'面積は半径を2乗する。弧の式(2πr)と面積の式(πr²)を取りちがえやすい。',
gen(){const r=ri(2,9),t=pick([30,45,60,90,120,135,150,240,270]);const area=Math.random()<.6;
 const A=Fpi(r*r*t,360),L=Fpi(2*r*t,360);
 return area?{q:`半径 ${r} cm、中心角 ${t}° のおうぎ形の面積は?`,a:A+' cm<sup>2</sup>',d:[L+' cm<sup>2</sup>',Fpi(r*r*t,180)+' cm<sup>2</sup>',Fpi(r*t,360)+' cm<sup>2</sup>',Fpi(r*r,1)+' cm<sup>2</sup>'],
   ex:`円全体の ${F(t,360)}。π × ${r}<sup>2</sup> × ${F(t,360)} = ${A} cm<sup>2</sup>。`}
 :{q:`半径 ${r} cm、中心角 ${t}° のおうぎ形の弧の長さは?`,a:L+' cm',d:[A+' cm',Fpi(r*t,360)+' cm',Fpi(4*r*t,360)+' cm',Fpi(2*r,1)+' cm'],
   ex:`円周 2π × ${r} の ${F(t,360)}。2π × ${r} × ${F(t,360)} = ${L} cm。`}}});

unit({id:'j1f',g:'中1',t:'データの活用',tag:'たくさんの数を「ひとこと」で',lab:'dots',
one:'たくさんの数を「ひとことで言う」ための値が代表値。',
story:'平均値は全部を同じ高さにならした値。中央値は小さい順に並べたときのまん中。最頻値はいちばん多く出てくる値。',
key:'平均値 = 合計 ÷ 個数<br>中央値 = 並べたまん中の値',
trap:'1つだけ極端な値があると、平均値は大きく引っぱられる。中央値はほとんど動かない(「さわってみる」で確かめよう)。',
gen(){const v=[ri(1,20),ri(1,20),ri(1,20),ri(1,20)];const s=v.reduce((a,b)=>a+b,0);let f=ri(1,20);f+=(5-(s+f)%5)%5;if(f>20)f-=5;v.push(f);
 const sorted=v.slice().sort((a,b)=>a-b);const mean=(s+f)/5,med=sorted[2];const list=shuffle(v.slice()).join(', ');
 if(Math.random()<.5)return {q:`データ「${list}」の平均値は?`,a:''+mean,d:[''+med,''+(s+f),''+(sorted[4]-sorted[0]),''+(mean+1)],ex:`合計 ${s+f} を個数 5 でわって ${mean}。`};
 return {q:`データ「${list}」の中央値は?`,a:''+med,d:[''+mean,''+v[2],''+(sorted[4]-sorted[0]),''+sorted[1]],ex:`小さい順に ${sorted.join(', ')}。まん中(3番目)は ${med}。`}}});

// ---------- 中2 ----------
unit({id:'j2a',g:'中2',t:'連立方程式',tag:'2本の直線が交わる1点',lab:'system',
one:'連立方程式の答えは、2本の直線が交わる1点。',
story:'「りんご1個とみかん2個で200円、りんご1個とみかん1個で150円」。2つを見くらべると、ちがいはみかん1個で50円。片方の文字を消すのがコツ。',
key:'加減法:式どうしをたす・ひくで文字を消す<br>代入法:x = … を、もう一方の式に入れる',
trap:'式を何倍かするときは、右辺(= の右側)にも同じ数をかけるのを忘れない。',
gen(){const x=rnz(-4,5),y=rnz(-4,5);let a1,b1,a2,b2;do{a1=rnz(-3,3);b1=rnz(-3,3);a2=rnz(-3,3);b2=rnz(-3,3)}while(a1*b2-a2*b1===0);
 const c1=a1*x+b1*y,c2=a2*x+b2*y;const s=(p,q)=>`x = ${neg(p)}, y = ${neg(q)}`;
 return {q:`次の連立方程式を解こう<br><span class="eqs">${poly([[a1,'x'],[b1,'y']])} = ${neg(c1)}<br>${poly([[a2,'x'],[b2,'y']])} = ${neg(c2)}</span>`,a:s(x,y),
 d:[s(y,x),s(-x,-y),s(x,-y),s(x+1,y-1),s(-x,y)],
 ex:`x か y の係数をそろえてたす(ひく)と片方が消える。確かめ:${neg(a1)}×${paren(x)} ${b1<0?'−':'+'} ${Math.abs(b1)}×${paren(y)} = ${neg(c1)} ✓`}}});

unit({id:'j2b',g:'中2',t:'一次関数',tag:'スタート地点と、1歩ごとの増え方',lab:'linear',
one:'y = ax + b は「スタート地点 b から、x が1増えるごとに a ずつ進む」。',
story:'基本料金500円、1時間ごとに200円の駐車場は y = 200x + 500。b(切片)はグラフが y 軸と交わる高さ、a(傾き)は坂の急さ。',
key:'傾き a = (y の増加量) ÷ (x の増加量)',
trap:'傾きの分母と分子を逆にしない。「たての変化 ÷ よこの変化」。',
gen(){const a=rnz(-4,4),b=ri(-6,6),x1=ri(-3,2),x2=x1+ri(1,4),y1=a*x1+b,y2=a*x2+b;
 const head=`2点 ${pt(x1,y1)}, ${pt(x2,y2)} を通る直線の`;
 if(Math.random()<.5)return {q:head+'傾きは?',a:neg(a),d:[F(x2-x1,y2-y1),neg(-a),neg(y2-y1),neg(a+1)],ex:`(${neg(y2)} − ${paren(y1)}) ÷ (${neg(x2)} − ${paren(x1)}) = ${neg(y2-y1)} ÷ ${x2-x1} = ${neg(a)}。`};
 const L=(p,q)=>'y = '+poly([[p,'x'],[q,'']]);
 return {q:head+'式は?',a:L(a,b),d:[L(a,-b),L(-a,b),L(b||1,a),L(a,b+a)],ex:`傾きは ${neg(y2-y1)} ÷ ${x2-x1} = ${neg(a)}。y = ${neg(a)}x + b に ${pt(x1,y1)} を入れて b = ${neg(b)}。`}}});

unit({id:'j2c',g:'中2',t:'図形の角度',tag:'三角形の角を集めると一直線',lab:'triangle',
one:'三角形の3つの角を切り取って並べると、ちょうど一直線(180°)になる。',
story:'紙の三角形の角を3つちぎって並べてみると、まっすぐな線になる。n角形は、対角線で三角形 (n − 2) 個に分けられる。',
key:'三角形の内角の和 = 180°<br>n角形の内角の和 = 180° × (n − 2)<br>多角形の外角の和 = 360°',
trap:'外角の和は、何角形でもいつも360°。角の数で変わらない。',
gen(){const t=ri(0,3);
 if(t===0){const A=ri(25,95),B=ri(20,150-A),C=180-A-B;return {q:`三角形の2つの角が ${A}° と ${B}°。残りの角は?`,a:deg(C),d:[deg(360-A-B),deg(180-A),deg(A+B),deg(C+10)],ex:`180° − ${A}° − ${B}° = ${C}°。`}}
 if(t===1){const n=ri(5,10);return {q:`${n}角形の内角の和は?`,a:deg(180*(n-2)),d:[deg(180*n),deg(180*(n-1)),deg(360),deg(180*(n-3))],ex:`三角形 ${n-2} 個に分けられるので 180° × ${n-2} = ${180*(n-2)}°。`}}
 if(t===2){const A=ri(30,80),B=ri(30,80);return {q:`三角形の2つの内角が ${A}° と ${B}°。残りの頂点の外角は?`,a:deg(A+B),d:[deg(180-A-B),deg(180-A),deg(Math.abs(A-B)||5),deg(360-A-B)],ex:`外角 = となりにない2つの内角の和 = ${A}° + ${B}° = ${A+B}°。`}}
 const n=pick([5,6,8,9,10,12]);return {q:`正${n}角形の1つの外角は?`,a:deg(360/n),d:[deg(180*(n-2)/n),deg(180/n),deg(360/(n-2)),deg(360)].map(s=>s.includes('.')?deg(Math.round(parseFloat(s))+1):s),ex:`外角の和は360°。それを ${n} 等分して ${360/n}°。`}}});

unit({id:'j2d',g:'中2',t:'確率',tag:'全部を「同じ起こりやすさ」で数える',lab:'dice',
one:'確率 = (起こる場合の数) ÷ (全部の場合の数)。ただし全部が同じくらい起こりやすいことが条件。',
story:'さいころ2個の目の和は 2〜12 の11種類。でも7がいちばん出やすい。2個を区別して36通りを表にすると、和が7は (1,6)(2,5)…(6,1) の6通りもあるから。',
key:`確率 = ${fr('起こる場合の数','すべての場合の数')}`,
trap:'「和は11通りだから 1/11」はまちがい。2個のさいころは区別して36通りで数える。',
gen(){const t=ri(0,3);
 if(t===0){const s=ri(2,12),c=6-Math.abs(s-7);return {q:`さいころを2個投げる。目の和が ${s} になる確率は?`,a:F(c,36),d:[F(1,11),F(c,11),F(c+1,36),F(1,6)],ex:`36通りのうち、和が ${s} になるのは ${c} 通り。${c}/36 = ${F(c,36)}。`}}
 if(t===1)return {q:'さいころを2個投げる。少なくとも1個が6になる確率は?',a:F(11,36),d:[F(1,6),F(1,3),F(1,36),F(25,36)],ex:'「どちらも6でない」は 5×5 = 25 通り。1 − 25/36 = 11/36(余事象)。'};
 const n=ri(2,4),N=2**n;
 if(t===2)return {q:`コインを ${n} 回投げる。すべて表になる確率は?`,a:F(1,N),d:[F(1,2*n),F(n,N),F(1,n+1),F(1,2)],ex:`表裏の出方は 2<sup>${n}</sup> = ${N} 通り。すべて表は1通りなので 1/${N}。`};
 return {q:`コインを ${n} 回投げる。少なくとも1回表が出る確率は?`,a:F(N-1,N),d:[F(1,N),F(1,2),F(n,N),F(N-2,N)],ex:`「1回も表が出ない」は1通り。1 − 1/${N} = ${(N-1)}/${N}。`}}});

// ---------- 中3 ----------
unit({id:'j3a',g:'中3',t:'展開と因数分解',tag:'長方形の面積を分けて考える',lab:'area',
one:'展開は「長方形の面積を分けて足す」こと。因数分解はその逆。',
story:'たて x + a、よこ x + b の長方形は、x² の正方形、ax と bx の細長い長方形、ab の小さな長方形の4つに分けられる。',
key:`(x + a)(x + b) = ${X2} + (a + b)x + ab<br><small>因数分解は「かけて ab、たして a + b」の2数さがし</small>`,
trap:`定数項がプラスでも、2数が両方マイナスのことがある。${X2} − 5x + 6 = (x − 2)(x − 3)`,
gen(){const a=rnz(-7,7),b=rnz(-7,7);let p=a,q=b;if(p<q)[p,q]=[q,p];
 return {q:`${poly([[1,X2],[a+b,'x'],[a*b,'']])} を因数分解しよう`,a:fac2(p,q),d:[fac2(-p,-q),fac2(p,-q),fac2(-p,q)],
 ex:`かけて ${neg(a*b)}、たして ${neg(a+b)} になる2数は ${neg(p)} と ${neg(q)}。`}}});

unit({id:'j3b',g:'中3',t:'平方根',tag:'面積から1辺の長さを知る',lab:'sqrt',
one:'√a は「面積が a の正方形の1辺の長さ」。',
story:'面積2の正方形の1辺は 1.414… とどこまでも続き、分数では表せない。だから √2 という記号で表す。',
key:`√(a<sup>2</sup>b) = a√b(例:√12 = √(4×3) = 2√3)<br>√a × √b = √(ab)`,
trap:'√2 + √3 は √5 にならない。中身が違う√のたし算はまとめられない。',
gen(){const t=ri(0,2);
 if(t===0){const k=ri(2,5),m=pick([2,3,5,6,7]),n=k*k*m;return {q:`${rt(n)} を a√b の形にしよう`,a:k+rt(m),d:[m+rt(k),(k*k)+rt(m),(k+1)+rt(m),k+rt(m+1)],ex:`${n} = ${k*k} × ${m}。${rt(k*k)} = ${k} なので ${k}${rt(m)}。`}}
 if(t===1){const [a,b]=pick([[2,8],[3,12],[2,18],[5,20],[3,27],[6,24],[2,6],[3,6],[2,10],[6,10],[3,15]]);const ans=simpRt(a*b);
  return {q:`${rt(a)} × ${rt(b)} = ?`,a:ans,d:[rt(a+b),''+(a*b),simpRt(a*b*2),simpRt(a+b)].filter(x=>x!==ans),ex:`√a × √b = √(ab) = ${rt(a*b)} = ${ans}。`}}
 let n;do{n=ri(2,80)}while(Number.isInteger(Math.sqrt(n)));const f=Math.floor(Math.sqrt(n));const R=x=>`${x} と ${x+1} の間`;
 return {q:`${rt(n)} はどの整数の間にある?`,a:R(f),d:[R(f+1),R(f-1),R(Math.floor(n/2)),R(f+2)],ex:`${f}<sup>2</sup> = ${f*f}、${f+1}<sup>2</sup> = ${(f+1)**2}。${n} はその間なので ${rt(n)} は ${f} と ${f+1} の間。`}}});

unit({id:'j3c',g:'中3',t:'二次方程式',tag:'放物線が x 軸と交わる場所',lab:'roots',
one:'二次方程式の答えは「放物線が x 軸と交わる場所」。',
story:'2つの数をかけて0になるなら、どちらかが0。(x − 2)(x − 5) = 0 なら、x = 2 か x = 5。',
key:`AB = 0 ならば A = 0 または B = 0<br>解の公式 x = ${fr('−b ± √(b<sup>2</sup> − 4ac)','2a')}`,
trap:'解は2つあることが多い。片方だけ書いて終わりにしない。',
gen(){const p=rnz(-6,6),q=rnz(-6,6);
 return {q:`${poly([[1,X2],[-(p+q),'x'],[p*q,'']])} = 0 を解こう`,a:xs(p,q),d:[xs(-p,-q),xs(p,-q),xs(-p,q),xs(p+1,q)],
 ex:`因数分解すると ${fac2(-p,-q)} = 0。だから ${xs(p,q)}。`}}});

unit({id:'j3d',g:'中3',t:'関数 y = ax²',tag:'2倍進むと4倍の距離',lab:'ax2',
one:'y = ax² では、x が2倍になると y は4倍になる。',
story:'坂を転がるボールが進む距離は、時間の2乗に比例する。1秒で1m なら、2秒で4m、3秒で9m。',
key:'変化の割合 = (y の増加量) ÷ (x の増加量)<br>x が p から q まで → a(p + q)',
trap:'一次関数と違って、変化の割合は区間ごとに変わる。',
gen(){const a=pick([1,2,3,-1,-2,-3]),p=ri(-3,2),q=p+ri(1,4);
 if(Math.random()<.6)return {q:`y = ${poly([[a,X2]])} で、x が ${neg(p)} から ${neg(q)} まで増加するときの変化の割合は?`,a:neg(a*(p+q)),d:[neg(a*(q-p)),neg(a*(q*q-p*p)),neg(-a*(p+q)),neg(a*(p+q)+a)],
  ex:`y は ${neg(a*p*p)} から ${neg(a*q*q)} まで ${neg(a*(q*q-p*p))} 増える。÷ ${q-p} で ${neg(a*(p+q))}。`};
 const r=rnz(-4,4);return {q:`y = ${poly([[a,X2]])} で x = ${neg(r)} のときの y は?`,a:neg(a*r*r),d:[neg(2*a*r),neg(a*r),neg(-a*r*r),neg(a*r*r+a)],ex:`${neg(a)} × ${paren(r)}<sup>2</sup> = ${neg(a)} × ${r*r} = ${neg(a*r*r)}。`}}});

unit({id:'j3e',g:'中3',t:'相似',tag:'拡大コピーで面積と体積はどうなる?',lab:'similar',
one:'形を k 倍に拡大すると、長さは k 倍、面積は k² 倍、体積は k³ 倍。',
story:'写真を2倍に引きのばすと、たても横も2倍。だから紙の面積は 2 × 2 = 4 倍になる。',
key:'相似比 m : n → 面積比 m<sup>2</sup> : n<sup>2</sup>、体積比 m<sup>3</sup> : n<sup>3</sup>',
trap:'面積比を m : n のままにしない。2乗する。',
gen(){const [m,n]=pick([[1,2],[2,3],[1,3],[3,4],[2,5],[3,5]]);const R=(a,b)=>`${a} : ${b}`;const t=ri(0,2);
 if(t===0)return {q:`相似比が ${R(m,n)} の2つの図形。面積比は?`,a:R(m*m,n*n),d:[R(m,n),R(m**3,n**3),R(2*m,2*n+1),R(m*m,n)],ex:`面積は2乗。${m}<sup>2</sup> : ${n}<sup>2</sup> = ${R(m*m,n*n)}。`};
 if(t===1)return {q:`相似比が ${R(m,n)} の2つの立体。体積比は?`,a:R(m**3,n**3),d:[R(m*m,n*n),R(m,n),R(3*m,3*n+1),R(m**3,n*n)],ex:`体積は3乗。${m}<sup>3</sup> : ${n}<sup>3</sup> = ${R(m**3,n**3)}。`};
 return {q:`面積比が ${R(m*m,n*n)} の相似な図形。相似比は?`,a:R(m,n),d:[R(m*m,n*n),R(m**3,n**3),R(2*m,n),R(m,2*n)],ex:`面積比は相似比の2乗。√ をとって ${R(m,n)}。`}}});

unit({id:'j3f',g:'中3',t:'三平方の定理',tag:'直角三角形と3つの正方形',lab:'pythag',
one:'直角三角形では、短い2辺でつくった正方形の面積の合計が、いちばん長い辺(斜辺)の正方形の面積と同じ。',
story:'辺が 3, 4, 5 の三角形を考えると、3² + 4² = 9 + 16 = 25 = 5²。「さわってみる」で正方形の面積を見くらべよう。',
key:'a<sup>2</sup> + b<sup>2</sup> = c<sup>2</sup><br><small>c は直角の向かいの辺(斜辺)</small>',
trap:'斜辺を求めるときは足す。ほかの辺を求めるときは引く。',
gen(){const t=ri(0,2);
 if(t===0){const [a,b,c]=pick([[3,4,5],[5,12,13],[6,8,10],[8,15,17],[9,12,15],[7,24,25]]);return {q:`直角をはさむ2辺が ${a} と ${b} の直角三角形。斜辺は?`,a:''+c,d:[''+(a+b),simpRt(a+b),''+(c+1),''+(b-a+c)],ex:`${a}<sup>2</sup> + ${b}<sup>2</sup> = ${a*a} + ${b*b} = ${c*c}。√${c*c} = ${c}。`}}
 if(t===1){const [a,b,c]=pick([[3,4,5],[5,12,13],[6,8,10],[8,15,17],[9,12,15]]);return {q:`斜辺が ${c}、もう1辺が ${a} の直角三角形。残りの辺は?`,a:''+b,d:[simpRt(a*a+c*c),''+(c-a),''+(c+a),''+(b+1)],ex:`${c}<sup>2</sup> − ${a}<sup>2</sup> = ${c*c-a*a}。√${c*c-a*a} = ${b}。`}}
 const [a,b]=pick([[1,1],[1,2],[2,3],[1,3],[2,4],[3,3],[2,2]]);const s=a*a+b*b;return {q:`直角をはさむ2辺が ${a} と ${b} の直角三角形。斜辺は?`,a:simpRt(s),d:[''+(a+b),simpRt(a+b),simpRt(s+1),''+s],ex:`${a*a} + ${b*b} = ${s}。斜辺は ${rt(s)}${simpRt(s)!==rt(s)?' = '+simpRt(s):''}。`}}});

unit({id:'j3g',g:'中3',t:'円周角',tag:'どこから見ても同じ角度',lab:'inscribed',
one:'同じ弧に向かう円周角は、点が円周上のどこに動いても同じ。そして中心角の半分。',
story:'円形の客席から舞台の両はしを見る角度は、円周上の席ならどこに座っても同じになる。',
key:'円周角 = 中心角 ÷ 2<br>直径に対する円周角 = 90°',
trap:'中心角 → 円周角は「半分」、円周角 → 中心角は「2倍」。逆にしない。',
gen(){const t=ri(0,2);
 if(t===0){const c=2*ri(20,80);return {q:`弧 AB に対する中心角が ${c}°。同じ弧に対する円周角は?`,a:deg(c/2),d:[deg(c),deg(180-c/2),deg(90+c/2),deg(c*2>360?c-10:c*2)],ex:`円周角は中心角の半分。${c}° ÷ 2 = ${c/2}°。`}}
 if(t===1){const x=ri(20,80);return {q:`弧 AB に対する円周角が ${x}°。中心角は?`,a:deg(2*x),d:[deg(x),deg(x/2|0),deg(180-x),deg(360-2*x)],ex:`中心角は円周角の2倍。${x}° × 2 = ${2*x}°。`}}
 const x=ri(25,65);return {q:`AB が円の直径で、円周上の点 P について ∠PAB = ${x}°。∠PBA は?`,a:deg(90-x),d:[deg(x),deg(180-x),deg(90+x),deg(2*x)],ex:`直径に対する円周角 ∠APB = 90°。三角形の内角の和から 180° − 90° − ${x}° = ${90-x}°。`}}});

// ---------- 数I ----------
unit({id:'h1a',g:'数I',t:'二次関数',tag:'放物線をスライドさせる',lab:'vertex',
one:'y = a(x − p)² + q の形にすれば、頂点 (p, q) がひと目でわかる。',
story:'y = x² のグラフを、右に p、上に q だけスライドさせたものが y = (x − p)² + q。この形に直すことを平方完成という。',
key:`${X2} + bx + c = (x + ${fr('b','2')})<sup>2</sup> + c − ${fr('b<sup>2</sup>','4')}<br>頂点 (−${fr('b','2')}, c − ${fr('b<sup>2</sup>','4')})`,
trap:'(x − 3)² の頂点の x 座標は +3。かっこの中の符号と逆になる。',
gen(){if(Math.random()<.7){const b=2*rnz(-4,4),c=ri(-6,8),h=-b/2,k=c-b*b/4;
  return {q:`y = ${poly([[1,X2],[b,'x'],[c,'']])} の頂点は?`,a:pt(h,k),d:[pt(-h,k),pt(h,c),pt(h,c+b*b/4),pt(-h,c)],ex:`平方完成:y = ${fac(-h)}<sup>2</sup> ${k<0?'−':'+'} ${Math.abs(k)}。頂点は ${pt(h,k)}。`}}
 const a=pick([2,3,-1,-2]),p=rnz(-4,4),q=ri(-5,5);return {q:`y = ${a===-1?'−':a}${fac(-p)}<sup>2</sup> ${q<0?'−':'+'} ${Math.abs(q)} の頂点は?`,a:pt(p,q),d:[pt(-p,q),pt(p,-q),pt(-p,-q),pt(a*p,q)],ex:`y = a(x − p)<sup>2</sup> + q の頂点は (p, q)。かっこの中が ${fac(-p)} なので p = ${neg(p)}。`}}});

unit({id:'h1b',g:'数I',t:'三角比',tag:'観覧車の高さと横の位置',lab:'unitcircle',
one:'sin と cos は「半径1の円をまわる点の、高さ(sin)と横の位置(cos)」。',
story:'半径1の観覧車に乗って角度 θ だけまわったとき、中心からの高さが sin θ、横のずれが cos θ。tan θ はその坂の傾き。',
key:`sin30° = ${fr(1,2)}、cos30° = ${fr(rt(3),2)}、sin45° = cos45° = ${fr(1,rt(2))}<br>tan θ = ${fr('sin θ','cos θ')}、sin<sup>2</sup>θ + cos<sup>2</sup>θ = 1`,
trap:'90° をこえると cos はマイナスになる(点が中心より左側にあるから)。',
gen(){const ang=pick([0,30,45,60,90,120,135,150,180]);return trigQ(ang,ang+'°')}});

unit({id:'h1c',g:'数I',t:'一次不等式',tag:'マイナスをかけると向きが逆',lab:'ineq',
one:'不等式も天びんのように変形できる。ただし、マイナスをかけたり割ったりすると不等号の向きが逆になる。',
story:'3 < 5 の両辺に −1 をかけると −3 と −5。数直線では −3 の方が右にあるので −3 > −5。大小がひっくり返る。',
key:'両辺を負の数でかける・割る → 不等号の向きが逆',
trap:'−2x > 6 は x < −3。向きを変え忘れて x > −3 にしない。',
gen(){const a=pick([2,3,4,5,-2,-3,-4,-5]),k=rnz(-5,6),b=rnz(-9,9),c=a*k+b;const sym=pick(['>','<','≥','≤']);
 const flip={'>':'<','<':'>','≥':'≤','≤':'≥'};const s2=a>0?sym:flip[sym];
 return {q:`${poly([[a,'x'],[b,'']])} ${sym} ${neg(c)} を解こう`,a:`x ${s2} ${neg(k)}`,d:[`x ${flip[s2]} ${neg(k)}`,`x ${s2} ${neg(-k)}`,`x ${flip[s2]} ${neg(-k)}`,`x ${s2} ${neg(k+1)}`],
 ex:`${poly([[a,'x']])} ${sym} ${neg(c-b)}。両辺を ${paren(a)} でわる${a<0?'(負の数なので向きが逆)':''} → x ${s2} ${neg(k)}。`}}});

unit({id:'h1d',g:'数I',t:'分散と標準偏差',tag:'平均からのはなれ具合',lab:'variance',
one:'分散は「平均からどれくらいはなれているか」を1つの数にしたもの。',
story:'平均がどちらも60点でも、全員60点のクラスと、0点と100点がまざるクラスは違う。その違いをはかるのが分散。',
key:'偏差 = 値 − 平均<br>分散 = (偏差)<sup>2</sup> の平均、標準偏差 = √分散',
trap:'偏差をそのまま足すと必ず0になる。だから2乗してから平均する。',
gen(){const pats=[[-2,0,0,2],[-3,-1,1,3],[-1,-1,1,1],[-2,-1,1,2],[-4,0,1,3],[-3,0,1,2],[-2,-1,0,1,2],[-3,-1,0,1,3],[-2,-2,0,2,2],[-4,-1,0,2,3]];
 const dv=pick(pats),m=ri(3,8),n=dv.length;const data=shuffle(dv.map(x=>m+x));const S=dv.reduce((s,x)=>s+x*x,0),A=dv.reduce((s,x)=>s+Math.abs(x),0);
 return {q:`データ「${data.join(', ')}」の分散は?`,a:F(S,n),d:[neg(S),F(A,n),F(S,n-1),F(S+n,n)],ex:`平均は ${m}。偏差の2乗の合計は ${S}。${n} 個でわって ${F(S,n)}。`}}});

// ---------- 数A ----------
const fact=n=>n<=1?1:n*fact(n-1);
unit({id:'hAa',g:'数A',t:'場合の数',tag:'並べる? 選ぶだけ?',lab:'combo',
one:'並べ方(順列)は順番が大事。選び方(組合せ)は順番を気にしない。',
story:'5人からリレーの走る順番を3人分決めると 5 × 4 × 3 = 60 通り。3人の代表を選ぶだけなら、同じ3人の並べ方6通りを1つにまとめて 60 ÷ 6 = 10 通り。',
key:'<sub>n</sub>P<sub>r</sub> = n(n−1)…(n−r+1)<br><sub>n</sub>C<sub>r</sub> = <sub>n</sub>P<sub>r</sub> ÷ r!',
trap:'最初に「選ぶだけ」か「並べる」かを確認する。',
gen(){const n=ri(4,8),r=pick([2,3]),P=fact(n)/fact(n-r),C=P/fact(r);const T=v=>v+' 通り';
 if(Math.random()<.5)return {q:`${n} 人から ${r} 人の委員を選ぶ方法は?`,a:T(C),d:[T(P),T(n**r),T(n*r),T(C+n)],ex:`並べると <sub>${n}</sub>P<sub>${r}</sub> = ${P}。順番は関係ないので ${r}! = ${fact(r)} でわって ${C} 通り。`};
 return {q:`${n} 人から ${r} 人を選んで1列に並べる方法は?`,a:T(P),d:[T(C),T(n**r),T(n*r),T(P/2)],ex:`1番目 ${n} 通り、2番目 ${n-1} 通り${r===3?'、3番目 '+(n-2)+' 通り':''}。かけて ${P} 通り。`}}});

unit({id:'hAb',g:'数A',t:'整数の性質',tag:'正方形タイルでしきつめる',lab:'euclid',
one:'最大公約数は「長方形をすき間なくしきつめられる、いちばん大きい正方形タイル」の1辺。',
story:'18 × 12 の長方形から 12 × 12 の正方形を取ると 6 × 12 が残る。そこから 6 × 6 を2枚取るとぴったり終わる。だから最大公約数は6。これがユークリッドの互除法。',
key:'最大公約数 G、最小公倍数 L のとき<br>a × b = G × L',
trap:'公約数は「わり切れる小さい数」、公倍数は「両方の倍数で大きい数」。名前で混乱しないように。',
gen(){const g=ri(2,9),[m,n]=pick([[2,3],[3,4],[2,5],[3,5],[4,5],[5,6],[3,7],[2,7]]),a=g*m,b=g*n;
 if(Math.random()<.5)return {q:`${a} と ${b} の最大公約数は?`,a:''+g,d:[''+(g*m*n),''+(m*n),''+(g*2>a?g+1:g*2),''+Math.abs(a-b-1)],ex:`${a} = ${g} × ${m}、${b} = ${g} × ${n}。共通の約数で最大は ${g}。`};
 return {q:`${a} と ${b} の最小公倍数は?`,a:''+(g*m*n),d:[''+g,''+(a*b),''+(g*m*n*2),''+(a+b)],ex:`最大公約数 ${g} を使って ${a} × ${b} ÷ ${g} = ${g*m*n}。`}}});

// ---------- 数II ----------
unit({id:'h2a',g:'数II',t:'指数関数',tag:'倍々ゲームの数学',lab:'expo',
one:'指数は「何回かけるか」。2<sup>3</sup> = 2 × 2 × 2。',
story:'紙を半分に折るたびに厚さは2倍。10回折ると 2<sup>10</sup> = 1024 倍。指数関数は「倍々ゲーム」のグラフ。',
key:'a<sup>m</sup> × a<sup>n</sup> = a<sup>m+n</sup>、(a<sup>m</sup>)<sup>n</sup> = a<sup>mn</sup><br>a<sup>0</sup> = 1、a<sup>−n</sup> = 1 ÷ a<sup>n</sup>',
trap:'2<sup>3</sup> × 2<sup>4</sup> は 2<sup>12</sup> ではなく 2<sup>7</sup>。かける回数は足し算。',
gen(){const t=ri(0,3);
 if(t===0){const a=ri(2,6),b=ri(2,6);return {q:`${pw(2,a)} × ${pw(2,b)} = ?`,a:pw(2,a+b),d:[pw(2,a*b),pw(4,a+b),pw(2,Math.abs(a-b)||1),pw(4,a*b)],ex:`2を ${a} 回かけたものと ${b} 回かけたもの。合わせて ${a+b} 回。`}}
 if(t===1){const a=ri(2,5),b=ri(2,4);return {q:`(${pw(2,a)})<sup>${b}</sup> = ?`,a:pw(2,a*b),d:[pw(2,a+b),pw(2,a**b),pw(2*b,a),pw(2,a*b+1)],ex:`${pw(2,a)} を ${b} 回かけるので、2を ${a} × ${b} = ${a*b} 回かける。`}}
 if(t===2){const b=pick([2,3]),k=rnz(-3,b===2?6:4);const N=k>=0?''+b**k:fr(1,b**-k);return {q:`${pw(b,'x')} = ${N} のとき x は?`,a:neg(k),d:[neg(-k),neg(k+1),neg(k-1),''+(b**Math.abs(k))],ex:`${N} は ${b} を ${k>=0?k+' 回かけた数':(-k)+' 回かけた数の逆数'}。だから x = ${neg(k)}。`}}
 const [q,a,d]=pick([[pw(8,'1/3'),'2',['8/3','3','4']],[pw(27,'2/3'),'9','3,18,6'.split(',')],[pw(4,'3/2'),'8',['6','2','16']],[pw(16,'3/4'),'8',['12','4','2']],[pw(9,'−1/2'),fr(1,3),['−3','3',fr(1,9)]],[pw(25,'1/2'),'5',['12.5','10','625']]]);
 return {q:`${q} = ?`,a,d:d.map(s=>s.includes('/')&&!s.includes('<')?fr(...s.split('/')):s),ex:'分数の指数 a<sup>m/n</sup> は「n 乗根をとってから m 乗」。マイナスの指数は逆数。'}}});

unit({id:'h2b',g:'数II',t:'対数関数',tag:'「何回かけた?」をきく記号',lab:'log',
one:`${lg(2,8)} は「2 を何回かけたら 8 になる?」の答え。だから 3。`,
story:'対数は指数の逆向きの質問。ケタがまったく違う量(とても小さい数から、とても大きい数まで)を、扱いやすい大きさにして比べるときに使われる。',
key:`log<sub>a</sub> M + log<sub>a</sub> N = log<sub>a</sub> MN<br>log<sub>a</sub> a = 1、log<sub>a</sub> 1 = 0`,
trap:`${lg(2,'(8 + 4)')} は ${lg(2,8)} + ${lg(2,4)} ではない。足し算になるのは、中身がかけ算のとき。`,
gen(){const t=ri(0,2);
 if(t===0){const b=pick([2,3,5,10]),k=ri(-2,b===2?6:3);const arg=k>=0?''+b**k:fr(1,b**-k);return {q:`${lg(b,arg)} = ?`,a:neg(k),d:[neg(-k),neg(k+1),neg(k-1),neg(k*b)],ex:`${b} を ${neg(k)} 乗すると ${arg}。だから答えは ${neg(k)}。`}}
 if(t===1){const i=ri(1,4),j=ri(1,4);return {q:`${lg(2,2**i)} + ${lg(2,2**j)} = ?`,a:''+(i+j),d:[''+(i*j),''+(i+j+1),''+Math.abs(i-j),''+(2**i+2**j)],ex:`${lg(2,2**i)} = ${i}、${lg(2,2**j)} = ${j}。合わせて ${i+j}(${lg(2,2**(i+j))} と同じ)。`}}
 const b=pick([2,3,5,7]);return Math.random()<.5?{q:`${lg(b,1)} = ?`,a:'0',d:['1',''+b,fr(1,b)],ex:`どんな数も0乗すると1。だから ${lg(b,1)} = 0。`}:{q:`${lg(b,b)} = ?`,a:'1',d:['0',''+b,''+(b*b)],ex:`${b} を1回かけると ${b}。だから 1。`}}});

const RADS=[30,45,60,90,120,135,150,180,210,240,270,300,315,330,360];
unit({id:'h2c',g:'数II',t:'三角関数',tag:'くるくる回ると波になる',lab:'sinwave',
one:'円をくるくる回る点の高さを、時間にそって記録すると波(サインカーブ)になる。',
story:'観覧車の高さを横に記録していくと、山と谷がくり返す。角度は「半径何本分の弧か」で測る弧度法を使い、180° = π と表す。',
key:'180° = π ラジアン<br>sin(θ + 2π) = sin θ(2π ごとにくり返す)',
trap:'1ラジアンは約57°。度数のつもりで計算しない。',
gen(){const t=ri(0,2);
 if(t===0){const d=pick(RADS);return {q:`${d}° を弧度法で表すと?`,a:Fpi(d,180),d:[Fpi(d,360),Fpi(d,90),Fpi(d+30,180),Fpi(d-15,180)],ex:`180° = π なので ${d}° = π × ${F(d,180)} = ${Fpi(d,180)}。`}}
 if(t===1){const d=pick(RADS);return {q:`${Fpi(d,180)} は何度?`,a:deg(d),d:[deg(d*2),deg(d/2),deg(d+30),deg(d+180)],ex:`π = 180° を入れて ${d}°。`}}
 const ang=pick([0,30,45,60,90,120,135,150,180]);return trigQ(ang,ang===0?'0':Fpi(ang,180))}});

const TANF={cubic:{f:x=>x*x*x-3*x,df:x=>3*x*x-3,l:'y = x³ − 3x'},sq:{f:x=>x*x,df:x=>2*x,l:'y = x²'},sin:{f:Math.sin,df:Math.cos,l:'y = sin x'},exp:{f:Math.exp,df:Math.exp,l:'y = eˣ'}};
unit({id:'h2d',g:'数II',t:'微分',tag:'その瞬間のスピード',lab:'tangent',labOpt:{fs:['sq','cubic']},
one:'微分は「その瞬間の傾き(スピード)」を求めること。',
story:'車のスピードメーターは「ほんの少しの時間」に進んだ距離から、いまのスピードを出している。グラフ上の2点をかぎりなく近づけた直線の傾きが、接線の傾き。',
key:'(x<sup>n</sup>)′ = n x<sup>n−1</sup>、定数の微分は 0<br>f′(a) = x = a での接線の傾き',
trap:'x<sup>3</sup> の微分は 3x<sup>2</sup>。指数を前に出して、指数を1つ減らす。',
gen(){const a=rnz(-3,3),b=ri(-4,4),c=ri(-5,5),d0=rnz(-5,5);const f=poly([[a,X3],[b,X2],[c,'x'],[d0,'']]);
 if(Math.random()<.5)return {q:`f(x) = ${f} のとき f′(x) は?`,a:poly([[3*a,X2],[2*b,'x'],[c,'']]),d:[poly([[a,X2],[b,'x'],[c,'']]),poly([[3*a,X2],[2*b,'x'],[c,''],[d0,'']]),poly([[3*a,X3],[2*b,X2],[c,'x']]),poly([[3*a,X2],[b,'x'],[c,'']])],
  ex:`それぞれの項で「指数を前に出して1つ減らす」。定数 ${neg(d0)} は消える。`};
 const k=rnz(-2,2),v=3*a*k*k+2*b*k+c;return {q:`f(x) = ${f} のとき f′(${neg(k)}) は?`,a:neg(v),d:[neg(a*k**3+b*k*k+c*k+d0),neg(a*k*k+b*k+c),neg(-v),neg(v+3*a)],ex:`f′(x) = ${poly([[3*a,X2],[2*b,'x'],[c,'']])}。x = ${neg(k)} を入れて ${neg(v)}。`}}});

unit({id:'h2e',g:'数II',t:'積分',tag:'細い長方形で面積を集める',lab:'riemann',
one:'積分は「細い長方形をすき間なく足して面積を出す」こと。',
story:'グラフの下を細長い長方形で埋めていく。幅を細くするほど、本当の面積に近づく(「さわってみる」で長方形の数を増やしてみよう)。微分の逆の計算で、その面積がぴったり求まる。',
key:'∫x<sup>n</sup> dx = x<sup>n+1</sup> ÷ (n + 1) + C<br>∫<sub>a</sub><sup>b</sup> f(x) dx = F(b) − F(a)',
trap:'定積分は「上の端を入れた値 − 下の端を入れた値」。順番を逆にすると符号が変わる。',
gen(){const a=rnz(-2,3),b=ri(-3,3),c=ri(-4,4),k=ri(1,3);const ans=a*k**3+b*k*k+c*k;
 return {q:`<span class="int">∫<sub>0</sub><sup>${k}</sup></span> (${poly([[3*a,X2],[2*b,'x'],[c,'']])}) dx = ?`,a:neg(ans),d:[neg(3*a*k*k+2*b*k+c),neg(3*a*k**3+2*b*k*k+c*k),neg(-ans),neg(ans+k)],
 ex:`原始関数は F(x) = ${poly([[a,X3],[b,X2],[c,'x']])}。F(${k}) − F(0) = ${neg(ans)}。`}}});

// ---------- 数B ----------
unit({id:'hBa',g:'数B',t:'数列',tag:'足していく? かけていく?',lab:'sequence',
one:'等差数列は「毎回同じ数を足す」、等比数列は「毎回同じ数をかける」。',
story:'毎月1000円ずつ増える貯金箱 → 等差数列。毎回2つに分かれる細胞の数 → 等比数列。',
key:'等差 a<sub>n</sub> = a<sub>1</sub> + (n − 1)d、和 S<sub>n</sub> = n(a<sub>1</sub> + a<sub>n</sub>) ÷ 2<br>等比 a<sub>n</sub> = a<sub>1</sub> r<sup>n−1</sup>',
trap:'第 n 項までに足す回数は n − 1 回(1番目はまだ何も足していない)。',
gen(){const t=ri(0,2);
 if(t===0){const a=ri(-5,10),d=rnz(-4,6),n=ri(5,20);return {q:`等差数列 ${neg(a)}, ${neg(a+d)}, ${neg(a+2*d)}, … の第 ${n} 項は?`,a:neg(a+(n-1)*d),d:[neg(a+n*d),neg(n*d),neg(a+(n-2)*d),neg(a*(n-1))],ex:`公差 ${neg(d)}。第 ${n} 項は ${neg(a)} + (${n} − 1) × ${paren(d)} = ${neg(a+(n-1)*d)}。`}}
 if(t===1){const a=ri(-3,8),d=rnz(-3,5),n=ri(5,12),an=a+(n-1)*d,S=n*(a+an)/2;return {q:`等差数列 ${neg(a)}, ${neg(a+d)}, ${neg(a+2*d)}, … の初項から第 ${n} 項までの和は?`,a:neg(S),d:[neg(n*(a+an)),neg(S+d),neg(n*an),neg(S-a)],ex:`第 ${n} 項は ${neg(an)}。和 = ${n} × (${neg(a)} + ${paren(an)}) ÷ 2 = ${neg(S)}。`}}
 const a=pick([1,2,3]),r=pick([2,3,-2]),n=ri(4,6);return {q:`等比数列 ${a}, ${neg(a*r)}, ${neg(a*r*r)}, … の第 ${n} 項は?`,a:neg(a*r**(n-1)),d:[neg(a*r**n),neg(a+(n-1)*r),neg((a*r)**(n-1)),neg(-a*r**(n-1))],ex:`公比 ${neg(r)}。${a} × ${paren(r)}<sup>${n-1}</sup> = ${neg(a*r**(n-1))}。`}}});

// ---------- 数III ----------
unit({id:'h3a',g:'数III',t:'極限',tag:'どこまでも近づいた先',lab:'limit',
one:'極限は「どこまでも近づいていった先の値」。',
story:'1, 1/2, 1/3, 1/4, … は0になることはないけれど、いくらでも0に近づく。その行き先を「極限は0」という。',
key:`n → ∞ のとき ${fr(1,'n')} → 0<br>分数の式は、いちばん次数の高い項どうしをくらべる`,
trap:'∞ ÷ ∞ はそのまま計算できない。分母のいちばん高い次数で、分子と分母をわる。',
gen(){const t=ri(0,2);
 if(t===0){const a=rnz(-6,6),b=ri(-5,5),c=pick([1,2,3,4,5]),d=rnz(1,7);return {q:`${LIM}${fr(poly([[a,'n<sup>2</sup>'],[b,'n']]),poly([[c,'n<sup>2</sup>'],[d,'']]))} = ?`,a:F(a,c),d:[F(b,d),'0','∞(発散)',F(a+b,c+d),F(c,a)],ex:`分子と分母を n<sup>2</sup> でわる。n → ∞ で b/n や d/n<sup>2</sup> の部分は 0 に近づくので、残るのは最高次の係数の比 ${F(a,c)}。`}}
 if(t===1){const a=rnz(1,6),c=rnz(1,6);return {q:`${LIM}${fr(poly([[a,'n'],[c,'']]),poly([[c,'n<sup>2</sup>'],[1,'']]))} = ?`,a:'0',d:[F(a,c),'∞(発散)','1',F(c,a)],ex:'分母の方が次数が高い(n<sup>2</sup>)ので、分母がずっと速く大きくなり 0 に近づく。'}}
 const [q,a,d,ex]=pick([[`${LIM}(${fr(1,2)})<sup>n</sup>`,'0',['1',fr(1,2),'∞(発散)'],'半分を何度もかけると、いくらでも0に近づく。'],[`${LIM}2<sup>n</sup>`,'∞(発散)',['0','2','1'],'2倍をくり返すと、かぎりなく大きくなる。'],[`${LIM}(1 + ${fr(1,'n')})<sup>n</sup>`,'e(= 2.718…)',['1','∞(発散)','2'],'この極限が自然対数の底 e の定義の1つ。'],['lim<sub>x→0</sub> '+fr('sin x','x'),'1',['0','∞(発散)',fr(1,2)],'x がとても小さいと sin x ≈ x。だから 1 に近づく。']]);
 return {q:q+' = ?',a,d,ex}}});

unit({id:'h3b',g:'数III',t:'いろいろな微分',tag:'波や指数の「瞬間の傾き」',lab:'tangent',labOpt:{fs:['sin','exp','cubic']},
one:'sin x や e<sup>x</sup> のようなグラフにも「瞬間の傾き」がある。',
story:'e<sup>x</sup> は「傾きが、その場所の高さと同じ」という特別な関数。sin x の傾きを記録していくと cos x の波になる。「さわってみる」で接線を動かして確かめよう。',
key:'(sin x)′ = cos x、(cos x)′ = −sin x<br>(e<sup>x</sup>)′ = e<sup>x</sup>、(log x)′ = 1 ÷ x<br>{f(g(x))}′ = f′(g(x)) · g′(x)',
trap:'(sin 2x)′ は 2cos 2x。中身(2x)の微分をかけ忘れない。',
gen(){const k=ri(2,5),n=ri(3,7);const E=s=>`e<sup>${s}</sup>`;
 const P=[[`(sin x)′`,'cos x',['−cos x','sin x','−sin x']],[`(cos x)′`,'−sin x',['sin x','cos x','−cos x']],[`(${E('x')})′`,E('x'),[`x${E('x−1')}`,E('x−1'),'1']],[`(log x)′`,fr(1,'x'),['x','log x',E('x')]],
  [`(sin ${k}x)′`,`${k}cos ${k}x`,[`cos ${k}x`,`${k}sin ${k}x`,`−${k}cos ${k}x`]],[`(${E(k+'x')})′`,`${k}${E(k+'x')}`,[E(k+'x'),`${k}x${E(k+'x−1')}`,fr(E(k+'x'),k)]],
  [`(x${E('x')})′`,`(x + 1)${E('x')}`,[E('x'),`x${E('x')}`,`(x − 1)${E('x')}`]],[`(x<sup>${n}</sup>)′`,`${n}x<sup>${n-1}</sup>`,[`x<sup>${n-1}</sup>`,`${n}x<sup>${n}</sup>`,`${n-1}x<sup>${n}</sup>`]],[`(sin<sup>2</sup> x)′`,'2sin x cos x',['2sin x','cos<sup>2</sup> x','2cos x']]];
 const [q,a,d]=pick(P);return {q:`${q} = ?`,a,d,ex:`公式を使う:${q} = ${a}。合成関数なら「外側の微分 × 中身の微分」。`}}});

// ---------- 数C ----------
unit({id:'hCa',g:'数C',t:'ベクトル',tag:'向きと長さをもつ矢印',lab:'vector',
one:'ベクトルは「向きと長さをもった矢印」。足し算は矢印をつなぐこと。',
story:'東へ3、北へ4歩くと、出発点からまっすぐ5の距離。どう歩いたかに関係なく、最初と最後の位置だけで決まる。',
key:'(a<sub>1</sub>, a<sub>2</sub>) + (b<sub>1</sub>, b<sub>2</sub>) = (a<sub>1</sub> + b<sub>1</sub>, a<sub>2</sub> + b<sub>2</sub>)<br>|a| = √(a<sub>1</sub><sup>2</sup> + a<sub>2</sub><sup>2</sup>)<br>内積 a·b = a<sub>1</sub>b<sub>1</sub> + a<sub>2</sub>b<sub>2</sub> = |a||b|cos θ',
trap:'内積の答えはベクトルではなく、ただの数。内積が0なら2つは垂直。',
gen(){const t=ri(0,2);const V=(x,y)=>`(${neg(x)}, ${neg(y)})`;
 if(t===0){const a1=rnz(-5,5),a2=rnz(-5,5),b1=rnz(-5,5),b2=rnz(-5,5);return {q:`a = ${V(a1,a2)}、b = ${V(b1,b2)} のとき a + b は?`,a:V(a1+b1,a2+b2),d:[V(a1-b1,a2-b2),V(a1+b2,a2+b1),V(a1*b1,a2*b2),V(b1-a1,b2-a2)],ex:'成分ごとに足す:x どうし、y どうし。'}}
 if(t===1){const [x,y]=pick([[3,4],[6,8],[5,12],[1,1],[1,2],[2,2],[-3,4],[2,-1],[1,3]]);const s=x*x+y*y;return {q:`a = ${V(x,y)} の大きさ |a| は?`,a:simpRt(s),d:[''+(Math.abs(x)+Math.abs(y)),''+s,simpRt(Math.abs(x+y)||2),simpRt(s+1)],ex:`√(${paren(x)}<sup>2</sup> + ${paren(y)}<sup>2</sup>) = √${s} = ${simpRt(s)}(三平方の定理と同じ)。`}}
 const a1=rnz(-4,4),a2=rnz(-4,4),b1=rnz(-4,4),b2=rnz(-4,4),v=a1*b1+a2*b2;return {q:`a = ${V(a1,a2)}、b = ${V(b1,b2)} の内積 a·b は?`,a:neg(v),d:[V(a1*b1,a2*b2),neg(a1*b2+a2*b1),neg(a1*b1-a2*b2),neg(-v)],ex:`${neg(a1)}×${paren(b1)} + ${neg(a2)}×${paren(b2)} = ${neg(v)}。${v===0?'0 なので垂直!':''}`}}});

unit({id:'hCb',g:'数C',t:'複素数平面',tag:'i をかけると90°回転',lab:'complex',
one:'複素数を平面の点として見ると、i をかけることは「90°回転」になる。',
story:'i<sup>2</sup> = −1 は、90°回してもう一度90°回すと180°回って反対向きになる、という意味。数が平面の上で回ったり伸びたりする。',
key:'|a + bi| = √(a<sup>2</sup> + b<sup>2</sup>)<br>i をかける → 90°回転、i<sup>4</sup> = 1',
trap:'(a + bi)(c + di) を計算したら、i<sup>2</sup> を −1 に置きかえるのを忘れない。',
gen(){const t=ri(0,2);
 if(t===0){const a=rnz(-3,3),b=rnz(-3,3),c=rnz(-3,3),d=rnz(-3,3);return {q:`(${cplx(a,b)})(${cplx(c,d)}) = ?`,a:cplx(a*c-b*d,a*d+b*c),d:[cplx(a*c+b*d,a*d+b*c),cplx(a*c,b*d),cplx(a*c-b*d,a*d-b*c),cplx(a*c+b*d,a*d-b*c)],ex:`展開すると ${neg(a*c)} + ${paren(a*d+b*c)}i + ${paren(b*d)}i<sup>2</sup>。i<sup>2</sup> = −1 なので ${cplx(a*c-b*d,a*d+b*c)}。`}}
 if(t===1){const [x,y]=pick([[3,4],[5,12],[1,1],[1,2],[2,2],[6,8],[1,3]]).map(v=>v*pick([1,-1]));const s=x*x+y*y;return {q:`|${cplx(x,y)}| = ?`,a:simpRt(s),d:[''+(Math.abs(x)+Math.abs(y)),''+s,simpRt(s+2)],ex:`原点からの距離。√(${paren(x)}<sup>2</sup> + ${paren(y)}<sup>2</sup>) = ${simpRt(s)}。`}}
 const n=ri(2,15),C=['1','i','−1','−i'];return {q:`i<sup>${n}</sup> = ?`,a:C[n%4],d:C.filter(x=>x!==C[n%4]),ex:`4回かけると1周して 1 にもどる。${n} ÷ 4 のあまりは ${n%4} なので ${C[n%4]}。`}}});

function buildQ(u){const r=u.gen();const opts=[r.a];for(const d of r.d){if(!opts.includes(d))opts.push(d);if(opts.length===4)break}
 const m=/^(.*?)(−?)(\d+)([^\d]*)$/.exec(r.a);let g=0;
 while(opts.length<4&&g<60){g++;let x;if(m&&g<30){const v=(m[2]?-1:1)*+m[3]+pick([1,-1,2,-2,3,5,-3,10]);x=m[1]+neg(v)+m[4]}else x=u.gen().a;if(!opts.includes(x))opts.push(x)}
 shuffle(opts);return {...r,opts,correct:opts.indexOf(r.a)}}
