// ===== canvas helper =====
function makeG(cv){
 const dpr=Math.min(2,window.devicePixelRatio||1),w=cv.clientWidth,h=cv.clientHeight;
 cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr);
 const c=cv.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,w,h);
 const css=getComputedStyle(document.documentElement);const col=n=>css.getPropertyValue('--'+n).trim();
 const FONT='"Zen Maru Gothic","Hiragino Maru Gothic ProN","Hiragino Sans",sans-serif';
 const g={c,w,h,col,x0:-5,x1:5,y0:-5,y1:5};
 g.view=(x0,x1,y0,y1,eq)=>{if(eq){const s=Math.min(w/(x1-x0),h/(y1-y0)),cx=(x0+x1)/2,cy=(y0+y1)/2;x0=cx-w/s/2;x1=cx+w/s/2;y0=cy-h/s/2;y1=cy+h/s/2}Object.assign(g,{x0,x1,y0,y1})};
 g.X=x=>(x-g.x0)/(g.x1-g.x0)*w;g.Y=y=>h-(y-g.y0)/(g.y1-g.y0)*h;g.S=d=>d/(g.x1-g.x0)*w;
 g.font=(sz=13,wt=700)=>{c.font=`${wt} ${sz}px ${FONT}`};
 g.grid=(sx=1,sy=sx)=>{c.lineWidth=1;c.strokeStyle=col('grid2');c.beginPath();
  for(let x=Math.ceil(g.x0/sx)*sx;x<=g.x1;x+=sx){const p=Math.round(g.X(x))+.5;c.moveTo(p,0);c.lineTo(p,h)}
  for(let y=Math.ceil(g.y0/sy)*sy;y<=g.y1;y+=sy){const p=Math.round(g.Y(y))+.5;c.moveTo(0,p);c.lineTo(w,p)}c.stroke()};
 g.axes=(lx=1,ly=lx,labels=true)=>{c.strokeStyle=col('muted');c.lineWidth=1.5;c.beginPath();c.moveTo(0,g.Y(0));c.lineTo(w,g.Y(0));c.moveTo(g.X(0),0);c.lineTo(g.X(0),h);c.stroke();
  if(!labels)return;g.font(11,600);c.fillStyle=col('muted');c.textAlign='center';c.textBaseline='top';
  for(let x=Math.ceil(g.x0/lx)*lx;x<=g.x1;x+=lx){if(Math.abs(x)<1e-9)continue;c.fillText(fmtN(x),g.X(x),Math.min(h-14,Math.max(2,g.Y(0)+4)))}
  c.textAlign='right';c.textBaseline='middle';
  for(let y=Math.ceil(g.y0/ly)*ly;y<=g.y1;y+=ly){if(Math.abs(y)<1e-9)continue;c.fillText(fmtN(y),Math.max(22,Math.min(w-4,g.X(0)-5)),g.Y(y))}};
 g.fn=(f,color,lw=3,a=g.x0,b=g.x1)=>{c.strokeStyle=color;c.lineWidth=lw;c.lineJoin='round';c.beginPath();let pen=false;
  const i0=Math.max(0,g.X(a)),i1=Math.min(w,g.X(b));
  for(let i=i0;i<=i1+.5;i+=1.5){const x=g.x0+(g.x1-g.x0)*Math.min(i,i1)/w,y=f(x);if(!isFinite(y)){pen=false;continue}const py=g.Y(y);if(py<-2*h||py>3*h){pen=false;continue}pen?c.lineTo(i,py):c.moveTo(i,py);pen=true}c.stroke()};
 g.seg=(x1,y1,x2,y2,color,lw=2,dash)=>{c.strokeStyle=color;c.lineWidth=lw;c.setLineDash(dash||[]);c.beginPath();c.moveTo(g.X(x1),g.Y(y1));c.lineTo(g.X(x2),g.Y(y2));c.stroke();c.setLineDash([])};
 g.arrow=(x1,y1,x2,y2,color,lw=3)=>{const X1=g.X(x1),Y1=g.Y(y1),X2=g.X(x2),Y2=g.Y(y2);const L=Math.hypot(X2-X1,Y2-Y1);if(L<1)return;
  c.strokeStyle=color;c.fillStyle=color;c.lineWidth=lw;c.lineCap='round';const ux=(X2-X1)/L,uy=(Y2-Y1)/L,hs=Math.min(12,L*.5);
  c.beginPath();c.moveTo(X1,Y1);c.lineTo(X2-ux*hs*.8,Y2-uy*hs*.8);c.stroke();
  c.beginPath();c.moveTo(X2,Y2);c.lineTo(X2-ux*hs-uy*hs*.55,Y2-uy*hs+ux*hs*.55);c.lineTo(X2-ux*hs+uy*hs*.55,Y2-uy*hs-ux*hs*.55);c.closePath();c.fill()};
 g.dot=(x,y,color,r=5,ring)=>{c.beginPath();c.arc(g.X(x),g.Y(y),r,0,7);c.fillStyle=color;c.fill();if(ring){c.lineWidth=2.5;c.strokeStyle=col('sheet');c.stroke()}};
 g.txt=(s,x,y,color,align='center',sz=13,base='middle')=>{g.font(sz);c.fillStyle=color||col('ink');c.textAlign=align;c.textBaseline=base;c.fillText(s,g.X(x),g.Y(y))};
 g.ptxt=(s,px,py,color,align='left',sz=13,base='top')=>{g.font(sz);c.fillStyle=color||col('ink');c.textAlign=align;c.textBaseline=base;c.fillText(s,px,py)};
 g.poly=(pts,fill,stroke,lw=2)=>{c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(g.X(x),g.Y(y)):c.moveTo(g.X(x),g.Y(y)));c.closePath();if(fill){c.fillStyle=fill;c.fill()}if(stroke){c.strokeStyle=stroke;c.lineWidth=lw;c.stroke()}};
 g.circ=(x,y,r,stroke,fill,lw=2)=>{c.beginPath();c.arc(g.X(x),g.Y(y),g.S(r),0,7);if(fill){c.fillStyle=fill;c.fill()}if(stroke){c.strokeStyle=stroke;c.lineWidth=lw;c.stroke()}};
 g.alpha=(color,a)=>{const m=/^#([0-9a-f]{6})$/i.exec(color);if(!m)return color;const n=parseInt(m[1],16);return `rgba(${n>>16},${n>>8&255},${n&255},${a})`};
 return g;
}
const fmtN=x=>{const r=Math.round(x*100)/100;return (r<0?'−':'')+Math.abs(r)};
const r2=x=>fmtN(x);
const B=s=>`<b>${s}</b>`;

const LABS={};
LABS.numberline={ratio:.4,sliders:[{k:'a',l:'スタート a',min:-8,max:8,step:1,v:-3},{k:'b',l:'たす数 b',min:-8,max:8,step:1,v:5}],
draw(g,v){g.view(-11,11,-1.4,3);const C=g.col;g.seg(-11,0,11,0,C('muted'),2);
 for(let x=-10;x<=10;x++){g.seg(x,-.12,x,.12,C('muted'),x%5?1:2);if(x%2===0)g.txt(neg(x),x,-.45,C('muted'),'center',11)}
 g.dot(0,0,C('ink'),4);g.arrow(0,.9,v.a,.9,C('blue'),4);g.arrow(v.a,1.9,v.a+v.b,1.9,C('red'),4);
 g.seg(v.a,.9,v.a,1.9,C('muted'),1,[3,3]);g.seg(v.a+v.b,1.9,v.a+v.b,0,C('muted'),1,[3,3]);
 if(Math.abs(v.a+v.b)<=10)g.dot(v.a+v.b,0,C('green'),8,true);
 g.txt('a',v.a/2,1.2,C('blue'));g.txt('b',v.a+v.b/2,2.25,C('red'));
 return `${neg(v.a)} + ${paren(v.b)} = ${B(neg(v.a+v.b))}<br><small>b が${v.b>=0?'プラスなので右':'マイナスなので左'}へ ${Math.abs(v.b)} 進んだ。ひき算 a − b は「b の向きを反対にして進む」こと。</small>`}};

LABS.machine={ratio:.55,sliders:[{k:'x',l:'箱に入れる数 x',min:-5,max:5,step:1,v:2},{k:'a',l:'係数 a',min:-4,max:5,step:1,v:3},{k:'b',l:'たす数 b',min:-6,max:6,step:1,v:1}],
draw(g,v){g.view(-6,6,-32,32);const C=g.col;g.grid(1,5);g.axes(1,10);
 for(let x=-5;x<=5;x++){const y=v.a*x+v.b,on=x===v.x,bw=.36;g.poly([[x-bw,0],[x+bw,0],[x+bw,y],[x-bw,y]],on?C('blue'):g.alpha(C('blue'),.22),null)}
 const y=v.a*v.x+v.b;g.txt(neg(y),v.x,y+(y>=0?3:-3),C('blue'),'center',14);
 return `式 ${poly([[v.a,'x'],[v.b,'']])} に x = ${neg(v.x)} を入れると ${neg(v.a)} × ${paren(v.x)} ${v.b<0?'−':'+'} ${Math.abs(v.b)} = ${B(neg(y))}<br><small>棒の1本1本が、x にいろいろな数を入れた結果。同じ式(レシピ)で何度でも計算できる。</small>`}};

LABS.balance={ratio:.52,init(st){st.sol=ri(1,6)},sliders:[{k:'a',l:'箱 x の数 a',min:1,max:4,step:1,v:2},{k:'b',l:'左の重り b',min:0,max:6,step:1,v:3},{k:'x',l:'箱の重さ x を予想',min:0,max:8,step:1,v:0}],
buttons:[{l:'別の問題にする',f(st){let s;do{s=ri(1,7)}while(s===st.sol);st.sol=s}}],
draw(g,v,st){const C=g.col,c=g.c,w=g.w,h=g.h;const R=v.a*st.sol+v.b,L=v.a*v.x+v.b;const tilt=Math.max(-.28,Math.min(.28,(L-R)*.03));
 const cx=w/2,cy=h*.26,arm=Math.min(w*.36,240);
 c.fillStyle=C('muted');c.beginPath();c.moveTo(cx,cy);c.lineTo(cx-26,h-14);c.lineTo(cx+26,h-14);c.closePath();c.fill();
 c.save();c.translate(cx,cy);c.rotate(tilt);c.strokeStyle=C('ink');c.lineWidth=5;c.lineCap='round';c.beginPath();c.moveTo(-arm,0);c.lineTo(arm,0);c.stroke();c.restore();
 const pan=(side,draw)=>{const px=cx+side*arm*Math.cos(tilt),py=cy+side*arm*Math.sin(tilt);const pw=Math.min(arm*.9,150),top=py+h*.32;
  c.strokeStyle=C('muted');c.lineWidth=1.5;c.beginPath();c.moveTo(px,py);c.lineTo(px-pw/2,top);c.moveTo(px,py);c.lineTo(px+pw/2,top);c.stroke();
  c.fillStyle=C('ink');c.fillRect(px-pw/2-6,top,pw+12,5);draw(px,top,pw)};
 const weights=(n,x0,y0,pw,start=0)=>{const per=Math.max(4,Math.floor(pw/16));for(let i=0;i<n;i++){const k=i+start,col=k%per,row=Math.floor(k/per);c.beginPath();c.arc(x0-pw/2+8+col*16,y0-8-row*15,6.5,0,7);c.fillStyle=C('muted');c.fill()}};
 pan(-1,(px,top,pw)=>{const bs=Math.min(30,pw/(v.a+.5));for(let i=0;i<v.a;i++){const bx=px-pw/2+i*(bs+4);c.fillStyle=C('blue');c.fillRect(bx,top-bs-2,bs,bs);g.ptxt('x',bx+bs/2,top-bs/2-2,C('sheet'),'center',14,'middle')}
  const used=Math.ceil(v.a*(bs+4)/16);weights(v.b,px,top-bs-4,pw,0)});
 pan(1,(px,top,pw)=>weights(R,px,top,pw));
 g.ptxt('左',cx-arm,8,C('muted'),'center',12);g.ptxt('右',cx+arm,8,C('muted'),'center',12);
 const ok=L===R;
 return `左 ${poly([[v.a,'x'],[v.b,'']])} = ${L}　/　右 = ${R}<br>${ok?`<span class="good">つり合った! x = ${v.x} が答え</span>`:L>R?'左が重い → x をもっと小さく':'右が重い → x をもっと大きく'}<br><small>両側から重り ${v.b} 個を取ると「箱 ${v.a} 個 = 重り ${R-v.b} 個」。だから箱1つは ${R-v.b} ÷ ${v.a}。</small>`}};

LABS.prop={ratio:.62,init(st){st.inv=false},sliders:[{k:'a',l:'比例定数 a',min:-6,max:6,step:1,v:3}],buttons:[{l:'比例 ⇄ 反比例 を切りかえ',f(st){st.inv=!st.inv}}],
draw(g,v,st){g.view(-7,7,-7,7,true);const C=g.col;g.grid(1);g.axes(2);const a=v.a;
 if(st.inv){g.fn(x=>Math.abs(x)<.02?NaN:a/x,C('red'),3,g.x0,-.02);g.fn(x=>a/x,C('red'),3,.02,g.x1)}else g.fn(x=>a*x,C('blue'),3);
 const rows=[1,2,3,6].map(x=>{const y=st.inv?a/x:a*x;g.dot(x,y,st.inv?C('red'):C('blue'),4);return `<td>${x}</td><td>${r2(y)}</td><td>${st.inv?r2(x*y):r2(x?y/x:0)}</td>`});
 return `${st.inv?`反比例 y = ${a}/x`:`比例 y = ${neg(a)}x`}<div class="tbl"><table><tr><th>x</th><th>y</th><th>${st.inv?'x × y':'y ÷ x'}</th></tr>${rows.map(r=>'<tr>'+r+'</tr>').join('')}</table></div><small>${st.inv?'x × y がいつも同じ':'y ÷ x がいつも同じ'}(= ${neg(a)})なのがポイント。</small>`}};

LABS.sector={ratio:.62,sliders:[{k:'r',l:'半径 r',min:1,max:6,step:1,v:4},{k:'t',l:'中心角',min:5,max:360,step:5,v:90,u:'°'}],
draw(g,v){g.view(-7,7,-7,7,true);const C=g.col,c=g.c;g.circ(0,0,v.r,C('grid2'),g.alpha(C('blue'),.06),2);
 c.beginPath();c.moveTo(g.X(0),g.Y(0));c.arc(g.X(0),g.Y(0),g.S(v.r),0,-v.t*Math.PI/180,true);c.closePath();c.fillStyle=g.alpha(C('marker'),.85);c.fill();
 c.beginPath();c.arc(g.X(0),g.Y(0),g.S(v.r),0,-v.t*Math.PI/180,true);c.strokeStyle=C('red');c.lineWidth=4;c.stroke();
 g.seg(0,0,v.r,0,C('ink'),2);g.txt('r = '+v.r,v.r/2,-.5,C('ink'));g.dot(0,0,C('ink'),3);
 return `円全体の ${F(v.t,360)}<br>弧の長さ = 2π × ${v.r} × ${F(v.t,360)} = ${B(Fpi(2*v.r*v.t,360))} ≈ ${r2(2*Math.PI*v.r*v.t/360)}<br>面積 = π × ${v.r}<sup>2</sup> × ${F(v.t,360)} = ${B(Fpi(v.r*v.r*v.t,360))} ≈ ${r2(Math.PI*v.r*v.r*v.t/360)}`}};

LABS.dots={ratio:.45,sliders:[{k:'o',l:'6人目の点数',min:0,max:30,step:1,v:9}],
draw(g,v){const base=[3,5,5,6,7,8],d=[...base,v.o].sort((a,b)=>a-b);const mean=d.reduce((a,b)=>a+b,0)/d.length,med=d[3];g.view(-1,31,-2.2,6);const C=g.col;
 g.seg(-1,0,31,0,C('muted'),2);for(let x=0;x<=30;x+=5){g.seg(x,-.15,x,.15,C('muted'),1.5);g.txt(''+x,x,-.6,C('muted'),'center',11)}
 const cnt={};d.forEach(x=>{cnt[x]=(cnt[x]||0)+1;g.dot(x,cnt[x]*.75,x===v.o?C('red'):C('ink'),7)});
 g.poly([[mean,-.9],[mean-.5,-1.7],[mean+.5,-1.7]],C('blue'));g.txt('平均',mean,-2,C('blue'),'center',11);
 g.seg(med,0,med,4.8,C('green'),2.5,[6,4]);g.txt('中央値',med,5.3,C('green'),'center',11);
 return `データ ${d.join(', ')}<br>平均値 ${B(r2(mean))}　中央値 ${B(med)}　最頻値 ${B(5)}<br><small>赤い点を大きくしても、中央値はほとんど動かない。平均値だけが引っぱられる。</small>`}};

LABS.system={ratio:.68,sliders:[{k:'a1',l:'直線① 傾き',min:-3,max:3,step:.5,v:1},{k:'b1',l:'直線① 切片',min:-5,max:5,step:1,v:-1},{k:'a2',l:'直線② 傾き',min:-3,max:3,step:.5,v:-1},{k:'b2',l:'直線② 切片',min:-5,max:5,step:1,v:3}],
draw(g,v){g.view(-7,7,-7,7,true);const C=g.col;g.grid(1);g.axes(2);g.fn(x=>v.a1*x+v.b1,C('blue'));g.fn(x=>v.a2*x+v.b2,C('red'));
 if(v.a1===v.a2)return v.b1===v.b2?'2本が重なった → 解は無数にある':'平行で交わらない → 解なし';
 const x=(v.b2-v.b1)/(v.a1-v.a2),y=v.a1*x+v.b1;g.dot(x,y,C('green'),8,true);
 const L=(a,b)=>'y = '+(a===0?neg(b):(a===1?'':a===-1?'−':fmtN(a))+'x'+(b?(b<0?' − ':' + ')+Math.abs(b):''));
 return `交点 (${r2(x)}, ${r2(y)})<br><small>= 連立方程式「${L(v.a1,v.b1)}」「${L(v.a2,v.b2)}」の解</small>`}};

LABS.linear={ratio:.68,sliders:[{k:'a',l:'傾き a',min:-4,max:4,step:.5,v:2},{k:'b',l:'切片 b',min:-5,max:5,step:1,v:1}],
draw(g,v){g.view(-7,7,-7,7,true);const C=g.col;g.grid(1);g.axes(2);g.fn(x=>v.a*x+v.b,C('blue'));
 for(let i=0;i<3;i++){const x=i,y=v.a*i+v.b;g.seg(x,y,x+1,y,C('red'),2.5);g.seg(x+1,y,x+1,y+v.a,C('green'),2.5)}
 g.dot(0,v.b,C('marker'),8,true);g.txt('切片',0.9,v.b-.6,C('ink'),'left',12);
 return `y = ${fmtN(v.a)}x ${v.b<0?'−':'+'} ${Math.abs(v.b)}<br>右へ <span class="pr">1</span> 進むと、上へ <span class="pg">${r2(v.a)}</span>(傾き)。スタートは高さ ${neg(v.b)}(切片)。`}};

LABS.triangle={ratio:.75,sliders:[{k:'A',l:'角 A',min:20,max:130,step:5,v:60},{k:'B',l:'角 B',min:20,max:130,step:5,v:70}],
draw(g,v){const C=g.col,c=g.c,w=g.w,h=g.h;let A=v.A,B=v.B;if(A+B>170)B=170-A;const Cc=180-A-B;const rad=x=>x*Math.PI/180;
 const top=h*.56,base=Math.min(w*.7,320),bx=w/2-base/2;const a=base*Math.sin(rad(A))/Math.sin(rad(Cc)),b=base*Math.sin(rad(B))/Math.sin(rad(Cc));
 let px=bx+b*Math.cos(rad(A)),py=top-b*Math.sin(rad(A));const sc=Math.min(1,(top-12)/(top-py));
 const P=[[bx,top],[bx+base*sc,top],[bx+(px-bx)*sc,top-(top-py)*sc]];
 c.beginPath();P.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fillStyle=g.alpha(C('blue'),.08);c.fill();c.strokeStyle=C('ink');c.lineWidth=2.5;c.stroke();
 const cols=[C('blue'),C('red'),C('green')];const angs=[A,B,Cc];
 const wedge=(x,y,r,s,e,col)=>{c.beginPath();c.moveTo(x,y);c.arc(x,y,r,s,e,false);c.closePath();c.fillStyle=g.alpha(col,.55);c.fill()};
 wedge(P[0][0],P[0][1],26,-rad(A),0,cols[0]);wedge(P[1][0],P[1][1],26,Math.PI,Math.PI+rad(B),cols[1]);
 const d0=Math.atan2(P[0][1]-P[2][1],P[0][0]-P[2][0]),d1=Math.atan2(P[1][1]-P[2][1],P[1][0]-P[2][0]);wedge(P[2][0],P[2][1],26,d1,d0,cols[2]);
 const cx=w/2,cy=h-12,R=Math.min(70,h*.3);let s=Math.PI;
 c.strokeStyle=C('muted');c.lineWidth=2;c.beginPath();c.moveTo(cx-R-30,cy);c.lineTo(cx+R+30,cy);c.stroke();
 angs.forEach((an,i)=>{wedge(cx,cy,R,s,s+rad(an),cols[i]);s+=rad(an)});
 g.ptxt('3つの角を集めると…',cx,cy-R-22,C('muted'),'center',12);
 return `${A}° + ${B}° + <b>${Cc}°</b> = 180°<br><small>どんな形の三角形にしても、3つの角を並べると一直線(180°)になる。</small>`}};

LABS.dice={ratio:.55,init(st){st.c=Array(13).fill(0);st.n=0},sliders:[],
buttons:[{l:'1回ふる',f(st){roll(st,1)}},{l:'100回',f(st){roll(st,100)}},{l:'1000回',f(st){roll(st,1000)}},{l:'リセット',f(st){st.c=Array(13).fill(0);st.n=0}}],
draw(g,v,st){g.view(1,13,-.035,.24);const C=g.col;g.grid(1,.05);
 for(let s=2;s<=12;s++){const th=(6-Math.abs(s-7))/36,fq=st.n?st.c[s]/st.n:0;g.poly([[s-.38,0],[s+.38,0],[s+.38,fq],[s-.38,fq]],g.alpha(C('blue'),.7));
  g.seg(s-.42,th,s+.42,th,C('red'),3);g.txt(''+s,s,-.018,C('muted'),'center',11)}
 return `${st.n} 回ふった　和が7: ${st.n?r2(st.c[7]/st.n*100):0}%(理論値 ${r2(600/36)}%)<br><small>青い棒が実際の割合、赤い線が 36 通りから計算した確率。たくさんふるほど近づく。</small>`}};
function roll(st,n){for(let i=0;i<n;i++)st.c[ri(1,6)+ri(1,6)]++;st.n+=n}

LABS.area={ratio:.75,sliders:[{k:'a',l:'a',min:1,max:5,step:1,v:2},{k:'b',l:'b',min:1,max:5,step:1,v:3}],
draw(g,v){const C=g.col,X=5,tot=X+5;g.view(-1.4,tot+1.4,-1.2,tot+.6,true);const a=v.a,b=v.b;
 const R=(x,y,ww,hh,f,lab)=>{g.poly([[x,y],[x+ww,y],[x+ww,y+hh],[x,y+hh]],f,C('ink'),1.5);g.txt(lab,x+ww/2,y+hh/2,C('ink'),'center',14)};
 const y0=tot-X-a;R(0,y0+a,X,X,g.alpha(C('blue'),.25),'x²');R(X,y0+a,b,X,g.alpha(C('red'),.25),b+'x');R(0,y0,X,a,g.alpha(C('green'),.25),a+'x');R(X,y0,b,a,g.alpha(C('marker'),.8),''+a*b);
 g.txt('x',X/2,tot+.25,C('muted'),'center',12);g.txt(''+b,X+b/2,tot+.25,C('muted'),'center',12);g.txt('x',-.5,y0+a+X/2,C('muted'),'center',12);g.txt(''+a,-.5,y0+a/2,C('muted'),'center',12);
 return `(x + ${a})(x + ${b}) = x<sup>2</sup> + ${b}x + ${a}x + ${a*b} = ${B(`x<sup>2</sup> + ${a+b}x + ${a*b}`)}<br><small>逆にたどると因数分解:「かけて ${a*b}、たして ${a+b}」になる2数 ${a} と ${b} を探す。</small>`}};

LABS.sqrt={ratio:.62,sliders:[{k:'s',l:'正方形の面積',min:1,max:50,step:1,v:2}],
draw(g,v){const s=Math.sqrt(v.s);g.view(-.6,8,-.6,8,true);const C=g.col;g.grid(1);g.axes(1);
 g.poly([[0,0],[s,0],[s,s],[0,s]],g.alpha(C('marker'),.75),C('ink'),2);g.txt('面積 '+v.s,s/2,s/2,C('ink'),'center',13);
 g.seg(0,-.3,s,-.3,C('red'),3);
 const f=Math.floor(s);return `1辺 = √${v.s} ${Number.isInteger(s)?'= '+B(s):`≈ ${B(s.toFixed(3))}`}　${simpRt(v.s)!==rt(v.s)&&!Number.isInteger(s)?'= '+simpRt(v.s):''}<br><small>${Number.isInteger(s)?'ぴったり整数になる!':`${f}<sup>2</sup> = ${f*f} と ${f+1}<sup>2</sup> = ${(f+1)**2} の間なので、${f} と ${f+1} の間。`}</small>`}};

LABS.roots={ratio:.62,sliders:[{k:'b',l:'b',min:-6,max:6,step:1,v:-1},{k:'c',l:'c',min:-9,max:9,step:1,v:-6}],
draw(g,v){g.view(-7,7,-10,10);const C=g.col;g.grid(1,2);g.axes(2,4);g.fn(x=>x*x+v.b*x+v.c,C('blue'));const D=v.b*v.b-4*v.c;
 let msg;if(D<0)msg='x 軸と交わらない → 実数の解なし';else{const r1=(-v.b-Math.sqrt(D))/2,r2_=(-v.b+Math.sqrt(D))/2;g.dot(r1,0,C('red'),7,true);g.dot(r2_,0,C('red'),7,true);msg=D===0?`接している → 解は x = ${r2(r1)} の1つ(重解)`:`x 軸と2点で交わる → x = ${r2(r1)}, ${r2(r2_)}`}
 return `${poly([[1,X2],[v.b,'x'],[v.c,'']])} = 0<br>${msg}<br><small>判別式 b<sup>2</sup> − 4ac = ${D}(${D>0?'プラス → 2つ':D===0?'0 → 1つ':'マイナス → なし'})</small>`}};

LABS.ax2={ratio:.62,sliders:[{k:'a',l:'a',min:-2,max:2,step:.5,v:1},{k:'p',l:'x の始まり p',min:-3,max:3,step:1,v:1},{k:'q',l:'x の終わり q',min:-3,max:3,step:1,v:3}],
draw(g,v){g.view(-4,4,-10,10);const C=g.col;g.grid(1,2);g.axes(1,4);const f=x=>v.a*x*x;g.fn(f,C('blue'));
 if(v.p===v.q)return 'p と q を別の値にしてみよう';const sl=(f(v.q)-f(v.p))/(v.q-v.p);g.fn(x=>f(v.p)+sl*(x-v.p),C('red'),2);g.dot(v.p,f(v.p),C('red'),6,true);g.dot(v.q,f(v.q),C('red'),6,true);
 return `y = ${v.a}x<sup>2</sup>　x: ${neg(v.p)} → ${neg(v.q)}<br>変化の割合 = ${r2(f(v.q)-f(v.p))} ÷ ${v.q-v.p} = ${B(r2(sl))}(公式 a(p + q) = ${r2(v.a*(v.p+v.q))})`}};

LABS.similar={ratio:.55,sliders:[{k:'k',l:'拡大の倍率 k',min:.5,max:3,step:.25,v:2}],
draw(g,v){const C=g.col,k=v.k;g.view(-.3,9,-.6,4.2,true);g.poly([[0,0],[1,0],[1,1],[0,1]],g.alpha(C('blue'),.3),C('ink'),1.5);g.txt('もと',.5,-.35,C('muted'),'center',11);
 g.poly([[1.5,0],[1.5+k,0],[1.5+k,k],[1.5,k]],g.alpha(C('marker'),.7),C('ink'),1.5);g.txt(k+'倍',1.5+k/2,-.35,C('muted'),'center',11);
 const bars=[['長さ',k],['面積',k*k],['体積',k**3]],mx=27,x0=5.4;bars.forEach(([l,val],i)=>{const hh=val/mx*3.8;g.poly([[x0+i*1.2,0],[x0+i*1.2+.8,0],[x0+i*1.2+.8,hh],[x0+i*1.2,hh]],[C('blue'),C('red'),C('green')][i]);g.txt(l,x0+i*1.2+.4,-.35,C('muted'),'center',11);g.txt(r2(val),x0+i*1.2+.4,hh+.25,C('ink'),'center',11)});
 return `長さ ${k} 倍 → 面積 ${B(r2(k*k))} 倍 → 体積 ${B(r2(k**3))} 倍<br><small>面積は「たて × よこ」で k が2回、体積は3回かかる。</small>`}};

LABS.pythag={ratio:.85,sliders:[{k:'a',l:'たて a',min:1,max:6,step:1,v:3},{k:'b',l:'よこ b',min:1,max:6,step:1,v:4}],
draw(g,v){const C=g.col,a=v.b,b=v.a;g.view(-b-.5,a+b+.5,-a-.5,b+a+.5,true);
 g.poly([[0,0],[a,0],[a,-a],[0,-a]],g.alpha(C('blue'),.3),C('ink'),1.5);g.txt(''+a*a,a/2,-a/2,C('ink'),'center',15);
 g.poly([[0,0],[0,b],[-b,b],[-b,0]],g.alpha(C('red'),.3),C('ink'),1.5);g.txt(''+b*b,-b/2,b/2,C('ink'),'center',15);
 g.poly([[a,0],[0,b],[b,b+a],[a+b,a]],g.alpha(C('marker'),.75),C('ink'),1.5);g.txt(''+(a*a+b*b),(a+b)/2,(a+b)/2,C('ink'),'center',16);
 g.poly([[0,0],[a,0],[0,b]],C('sheet'),C('ink'),2.5);
 const s=a*a+b*b;return `${b}<sup>2</sup> + ${a}<sup>2</sup> = ${b*b} + ${a*a} = ${B(s)}<br>斜辺 = √${s} ${Number.isInteger(Math.sqrt(s))?'= '+B(Math.sqrt(s)):'≈ '+Math.sqrt(s).toFixed(3)}<small><br>小さい2つの正方形の面積を足すと、大きい正方形の面積と同じ。</small>`}};

LABS.inscribed={ratio:.8,sliders:[{k:'c',l:'中心角',min:30,max:160,step:5,v:80,u:'°'},{k:'t',l:'点 P の位置',min:0,max:100,step:1,v:40}],
draw(g,v){g.view(-1.35,1.35,-1.3,1.3,true);const C=g.col,rad=x=>x*Math.PI/180;g.circ(0,0,1,C('ink'),null,2);
 const aA=rad(270-v.c/2),aB=rad(270+v.c/2),A=[Math.cos(aA),Math.sin(aA)],Bp=[Math.cos(aB),Math.sin(aB)];const m=rad(8);const s=aB+m,e=aA+2*Math.PI-m;const ap=s+(e-s)*v.t/100,P=[Math.cos(ap),Math.sin(ap)];
 g.poly([[0,0],A,Bp],g.alpha(C('red'),.15),null);g.seg(0,0,A[0],A[1],C('red'),2);g.seg(0,0,Bp[0],Bp[1],C('red'),2);g.seg(P[0],P[1],A[0],A[1],C('blue'),2.5);g.seg(P[0],P[1],Bp[0],Bp[1],C('blue'),2.5);
 const ang=(o,p,q)=>{const u=[p[0]-o[0],p[1]-o[1]],w=[q[0]-o[0],q[1]-o[1]];return Math.acos((u[0]*w[0]+u[1]*w[1])/Math.hypot(...u)/Math.hypot(...w))*180/Math.PI};
 [[A,'A'],[Bp,'B'],[P,'P'],[[0,0],'O']].forEach(([p,l])=>{g.dot(p[0],p[1],l==='P'?C('blue'):C('ink'),5);g.txt(l,p[0]*1.14,p[1]*1.14+(l==='O'?.12:0),C('ink'),'center',13)});
 return `中心角 ∠AOB = <span class="pr">${v.c}°</span>　円周角 ∠APB = <span class="pb">${r2(ang(P,A,Bp))}°</span><br><small>点 P をどこに動かしても円周角は ${v.c/2}°(中心角の半分)のまま。</small>`}};

LABS.vertex={ratio:.62,sliders:[{k:'a',l:'開き方 a',min:-2,max:2,step:.5,v:1},{k:'p',l:'右へ p',min:-4,max:4,step:1,v:1},{k:'q',l:'上へ q',min:-5,max:5,step:1,v:-2}],
draw(g,v){g.view(-7,7,-8,8);const C=g.col;g.grid(1,2);g.axes(2,4);g.fn(x=>x*x,C('grid2'),2);g.fn(x=>v.a*(x-v.p)**2+v.q,C('blue'));g.dot(v.p,v.q,C('red'),7,true);
 const b=-2*v.a*v.p,c=v.a*v.p*v.p+v.q;
 return `y = ${v.a===1?'':v.a===-1?'−':v.a}(x ${v.p<=0?'+':'−'} ${Math.abs(v.p)})<sup>2</sup> ${v.q<0?'−':'+'} ${Math.abs(v.q)}　頂点 ${B(`(${neg(v.p)}, ${neg(v.q)})`)}<br><small>展開すると y = ${r2(v.a)}x<sup>2</sup> ${b<0?'−':'+'} ${r2(Math.abs(b))}x ${c<0?'−':'+'} ${r2(Math.abs(c))}。${v.a===0?'a = 0 だと直線になる。':'灰色の y = x² をスライドさせた形。'}</small>`}};

const SPEC={0:['0','1','0'],30:[fr(1,2),fr(rt(3),2),fr(1,rt(3))],45:[fr(1,rt(2)),fr(1,rt(2)),'1'],60:[fr(rt(3),2),fr(1,2),rt(3)],90:['1','0','なし'],120:[fr(rt(3),2),'−'+fr(1,2),'−'+rt(3)],135:[fr(1,rt(2)),'−'+fr(1,rt(2)),'−1'],150:[fr(1,2),'−'+fr(rt(3),2),'−'+fr(1,rt(3))],180:['0','−1','0']};
LABS.unitcircle={ratio:.8,sliders:[{k:'t',l:'角度 θ',min:0,max:360,step:5,v:30,u:'°'}],
draw(g,v){g.view(-1.5,1.5,-1.4,1.4,true);const C=g.col,c=g.c,t=v.t*Math.PI/180,x=Math.cos(t),y=Math.sin(t);g.grid(.5);g.axes(.5);g.circ(0,0,1,C('ink'),null,2);
 c.beginPath();c.arc(g.X(0),g.Y(0),g.S(.22),0,-t,true);c.strokeStyle=C('muted');c.lineWidth=2;c.stroke();
 g.seg(0,0,x,y,C('ink'),2);g.seg(0,0,x,0,C('blue'),5);g.seg(x,0,x,y,C('red'),5);g.dot(x,y,C('ink'),6,true);
 const sp=SPEC[v.t];const tn=Math.abs(x)<1e-9?'なし':r2(y/x);
 return `<span class="pb">cos ${v.t}° = ${sp?sp[1]:r2(x)}</span>${sp?' ≈ '+r2(x):''}　<span class="pr">sin ${v.t}° = ${sp?sp[0]:r2(y)}</span>${sp?' ≈ '+r2(y):''}<br>tan ${v.t}° = ${sp&&v.t<=180?sp[2]:tn}<small><br>青(横)が cos、赤(高さ)が sin。cos<sup>2</sup> + sin<sup>2</sup> = ${r2(x*x+y*y)}。</small>`}};

LABS.ineq={ratio:.32,sliders:[{k:'a',l:'x の係数 a',min:-4,max:4,step:1,v:-2},{k:'b',l:'b',min:-6,max:6,step:1,v:1},{k:'c',l:'右辺 c',min:-8,max:8,step:1,v:-5}],
draw(g,v){g.view(-10.5,10.5,-1.2,1.6);const C=g.col;g.seg(-10.5,0,10.5,0,C('muted'),2);for(let x=-10;x<=10;x++){g.seg(x,-.1,x,.1,C('muted'),1);if(x%2===0)g.txt(neg(x),x,-.5,C('muted'),'center',11)}
 if(v.a===0)return 'a = 0 だと x が消えてしまう。a を 0 以外にしよう';const k=(v.c-v.b)/v.a,right=v.a>0;
 g.seg(k,.55,right?10.5:-10.5,.55,C('blue'),6);g.c.beginPath();g.c.arc(g.X(k),g.Y(.55),7,0,7);g.c.fillStyle=C('sheet');g.c.fill();g.c.lineWidth=3;g.c.strokeStyle=C('blue');g.c.stroke();
 return `${poly([[v.a,'x'],[v.b,'']])} > ${neg(v.c)}<br>→ ${poly([[v.a,'x']])} > ${neg(v.c-v.b)} → ${B(`x ${right?'>':'<'} ${r2(k)}`)}${v.a<0?'<br><span class="bad">負の数でわったので向きが逆になった!</span>':''}`}};

LABS.variance={ratio:.6,sliders:[{k:'s',l:'ちらばり',min:0,max:3,step:.25,v:1.5}],
draw(g,v){const pat=[-2,-1,0,.5,2.5],m=10,d=pat.map(p=>m+p*v.s);g.view(0,20,-1.5,9.5,true);const C=g.col;
 g.seg(0,0,20,0,C('muted'),2);for(let x=0;x<=20;x+=5)g.txt(''+x,x,-.7,C('muted'),'center',11);g.seg(m,-.3,m,9,C('blue'),2,[5,4]);g.txt('平均 '+m,m,9.2,C('blue'),'center',11);
 d.forEach((x,i)=>{const dv=x-m;if(Math.abs(dv)>.01){const s=Math.abs(dv);g.poly([[Math.min(x,m),0],[Math.max(x,m),0],[Math.max(x,m),s],[Math.min(x,m),s]],g.alpha(C('red'),.15),g.alpha(C('red'),.6),1)}g.dot(x,0,C('ink'),6,true)});
 const V=d.reduce((s,x)=>s+(x-m)**2,0)/d.length;
 return `データ ${d.map(r2).join(', ')}<br>分散 = ${B(r2(V))}　標準偏差 = ${B(r2(Math.sqrt(V)))}<small><br>赤い正方形(偏差の2乗)の面積の平均が分散。ちらばるほど大きくなる。</small>`}};

LABS.combo={ratio:.6,sliders:[{k:'n',l:'人数 n',min:3,max:7,step:1,v:5},{k:'r',l:'選ぶ人数 r',min:1,max:4,step:1,v:3}],
draw(g,v){const n=v.n,r=Math.min(v.r,n),L='ABCDEFG'.slice(0,n).split('');const out=[];(function rec(s,a){if(a.length===r){out.push(a.join(''));return}for(let i=s;i<n;i++)rec(i+1,[...a,L[i]])})(0,[]);
 const C=g.col,cols=Math.max(1,Math.floor(g.w/62)),rows=Math.ceil(out.length/cols),lh=Math.min(26,(g.h-10)/rows);
 out.forEach((s,i)=>{const x=(i%cols)*62+8,y=Math.floor(i/cols)*lh+6;g.c.fillStyle=g.alpha(C('blue'),.12);g.c.fillRect(x,y,56,lh-4);g.ptxt(s,x+28,y+(lh-4)/2,C('ink'),'center',Math.min(14,lh-8),'middle')});
 const P=fact(n)/fact(n-r);
 return `<sub>${n}</sub>P<sub>${r}</sub> = ${P}(並べる)　<sub>${n}</sub>C<sub>${r}</sub> = ${P} ÷ ${r}! = ${B(out.length)}(選ぶだけ)<small><br>上の ${out.length} 通りの組それぞれに、並べ方が ${fact(r)} 通りずつある。</small>`}};

LABS.euclid={ratio:.62,sliders:[{k:'a',l:'横 a',min:2,max:30,step:1,v:18},{k:'b',l:'たて b',min:2,max:30,step:1,v:12}],
draw(g,v){const C=g.col;g.view(-.5,v.a+.5,-.5,v.b+.5,true);let x=0,y=0,W=v.a,H=v.b,i=0;const steps=[];const pal=[C('blue'),C('red'),C('green'),C('marker')];
 while(W>0&&H>0&&i<60){if(W>=H){const q=Math.floor(W/H);steps.push(`${W} = ${H} × ${q} + ${W%H}`);for(let j=0;j<q;j++){g.poly([[x,y],[x+H,y],[x+H,y+H],[x,y+H]],g.alpha(pal[i%4],.5),C('ink'),1);x+=H}W%=H}
  else{const q=Math.floor(H/W);steps.push(`${H} = ${W} × ${q} + ${H%W}`);for(let j=0;j<q;j++){g.poly([[x,y],[x+W,y],[x+W,y+W],[x,y+W]],g.alpha(pal[i%4],.5),C('ink'),1);y+=W}H%=W}i++}
 return `${steps.join('<br>')}<br>最大公約数 ${B(gcd(v.a,v.b))}　最小公倍数 ${B(v.a*v.b/gcd(v.a,v.b))}`}};

LABS.expo={ratio:.62,sliders:[{k:'a',l:'底 a',min:.25,max:3,step:.25,v:2}],
draw(g,v){g.view(-3.5,3.5,-1,9);const C=g.col;g.grid(1);g.axes(1,2);g.fn(x=>v.a**x,C('blue'));g.dot(0,1,C('red'),6,true);
 return `y = ${v.a}<sup>x</sup>　x = −1, 0, 1, 2, 3 → ${[-1,0,1,2,3].map(x=>r2(v.a**x)).join(', ')}<small><br>どんな a でも (0, 1) を通る(a<sup>0</sup> = 1)。a > 1 なら倍々で増え、a < 1 なら減っていく。</small>`}};

LABS.log={ratio:.8,sliders:[{k:'k',l:'2 を何回かける? k',min:-2,max:3,step:.5,v:3}],
draw(g,v){g.view(-3,9,-3,9,true);const C=g.col;g.grid(1);g.axes(2);g.seg(-3,-3,9,9,C('muted'),1,[4,4]);g.fn(x=>2**x,C('blue'));g.fn(x=>x>0?Math.log2(x):NaN,C('red'));
 const x=2**v.k;g.dot(v.k,x,C('blue'),6,true);g.dot(x,v.k,C('red'),6,true);g.seg(v.k,x,x,v.k,C('muted'),1,[3,3]);
 return `<span class="pb">2<sup>${v.k}</sup> = ${r2(x)}</span>　なので　<span class="pr">log<sub>2</sub> ${r2(x)} = ${v.k}</span><small><br>青(指数)と赤(対数)は点線 y = x で折り返した関係。</small>`}};

LABS.sinwave={ratio:.42,sliders:[{k:'t',l:'回転した角度',min:0,max:720,step:5,v:120,u:'°'}],
draw(g,v){g.view(-2.4,7,-1.25,1.25,true);const C=g.col,t=v.t*Math.PI/180,cx=-1.2,sc=.5;g.seg(-.05,0,g.x1,0,C('muted'),1.5);
 g.circ(cx,0,1,C('ink'),null,2);const px=cx+Math.cos(t),py=Math.sin(t);g.seg(cx,0,px,py,C('ink'),2);
 g.fn(x=>Math.sin(x/sc),C('grid2'),2,0,4*Math.PI*sc);g.fn(x=>Math.sin(x/sc),C('red'),3,0,t*sc);
 g.seg(px,py,t*sc,py,C('muted'),1,[4,4]);g.dot(px,py,C('red'),6,true);g.dot(t*sc,py,C('red'),6,true);
 [[Math.PI,'π'],[2*Math.PI,'2π'],[3*Math.PI,'3π'],[4*Math.PI,'4π']].forEach(([x,l])=>{g.seg(x*sc,-.06,x*sc,.06,C('muted'),1.5);g.txt(l,x*sc,-.22,C('muted'),'center',11)});
 return `${v.t}° = ${Fpi(v.t,180)} ラジアン　sin = ${B(r2(Math.sin(t)))}<small><br>円の点の高さを横に写していくと波になる。2π(360°)ごとに同じ形がくり返す。</small>`}};

LABS.tangent={ratio:.62,init(st){st.fs=st.opt.fs||['sq'];st.i=0},sliders:[{k:'x',l:'接点 x',min:-2.5,max:2.5,step:.1,v:1},{k:'h',l:'2点の間かく h',min:.01,max:2,step:.01,v:1}],
buttons:[{l:'関数をかえる',f(st){st.i=(st.i+1)%st.fs.length}}],
draw(g,v,st){const T=TANF[st.fs[st.i]];g.view(-3.2,3.2,-4,4,true);const C=g.col;g.grid(1);g.axes(1);g.fn(T.f,C('ink'),3);
 const x=v.x,y=T.f(x),m=T.df(x),sec=(T.f(x+v.h)-y)/v.h;g.fn(X=>y+sec*(X-x),C('red'),2);g.fn(X=>y+m*(X-x),C('blue'),2.5);g.dot(x,y,C('blue'),6,true);g.dot(x+v.h,T.f(x+v.h),C('red'),6,true);
 return `${T.l}　x = ${r2(x)}<br><span class="pr">2点を結ぶ直線の傾き ${sec.toFixed(3)}</span>　→　<span class="pb">接線の傾き ${m.toFixed(3)}</span><small><br>h を小さくしていくと、赤い直線が青い接線に近づく。それが微分。</small>`}};

LABS.riemann={ratio:.62,sliders:[{k:'n',l:'長方形の数 n',min:1,max:50,step:1,v:4}],
draw(g,v){g.view(-.3,2.4,-.5,4.6);const C=g.col;g.grid(.5,1);g.axes(.5,1);const n=v.n,dx=2/n;let s=0;
 for(let i=1;i<=n;i++){const x=i*dx,y=x*x;s+=y*dx;g.poly([[x-dx,0],[x,0],[x,y],[x-dx,y]],g.alpha(C('marker'),.7),n<30?C('ink'):null,1)}
 g.fn(x=>x*x,C('blue'),3,0,2.2);
 return `長方形 ${n} 本の合計 ${B(s.toFixed(4))}　本当の面積 ${fr(8,3)} ≈ 2.6667<br><small>誤差 ${(s-8/3).toFixed(4)}。n を増やすほど本当の面積に近づく → ∫<sub>0</sub><sup>2</sup> x<sup>2</sup> dx = ${fr(8,3)}</small>`}};

LABS.sequence={ratio:.55,init(st){st.geo=false},sliders:[{k:'a',l:'初項 a₁',min:-5,max:10,step:1,v:2},{k:'d',l:'公差 d(等差)',min:-3,max:5,step:1,v:3},{k:'r',l:'公比 r(等比)',min:-2,max:2,step:.5,v:1.5}],
buttons:[{l:'等差 ⇄ 等比 を切りかえ',f(st){st.geo=!st.geo}}],
draw(g,v,st){const t=[...Array(10)].map((_,i)=>st.geo?v.a*v.r**i:v.a+i*v.d);const mx=Math.max(1,...t.map(Math.abs));g.view(0,11,-mx*1.15,mx*1.15);const C=g.col;g.axes(1,1,false);
 t.forEach((y,i)=>{g.poly([[i+.65,0],[i+1.35,0],[i+1.35,y],[i+.65,y]],st.geo?C('red'):C('blue'));g.txt(''+(i+1),i+1,-mx*1.08,C('muted'),'center',10)});
 const S=t.reduce((a,b)=>a+b,0);
 return `${st.geo?'等比数列(毎回 ×'+v.r+')':'等差数列(毎回 +'+v.d+')'}<br>${t.slice(0,5).map(r2).join(', ')}, …　第10項 ${B(r2(t[9]))}　10項の和 ${r2(S)}`}};

LABS.vector={ratio:.75,sliders:[{k:'a1',l:'a の x 成分',min:-4,max:4,step:1,v:3},{k:'a2',l:'a の y 成分',min:-4,max:4,step:1,v:1},{k:'b1',l:'b の x 成分',min:-4,max:4,step:1,v:1},{k:'b2',l:'b の y 成分',min:-4,max:4,step:1,v:3}],
draw(g,v){g.view(-8,8,-8,8,true);const C=g.col;g.grid(1);g.axes(2);g.arrow(0,0,v.b1,v.b2,g.alpha(C('red'),.35),2);
 g.arrow(0,0,v.a1,v.a2,C('blue'));g.arrow(v.a1,v.a2,v.a1+v.b1,v.a2+v.b2,C('red'));g.arrow(0,0,v.a1+v.b1,v.a2+v.b2,C('green'),3.5);
 const dot=v.a1*v.b1+v.a2*v.b2,la=Math.hypot(v.a1,v.a2),lb=Math.hypot(v.b1,v.b2);const th=la&&lb?Math.acos(Math.max(-1,Math.min(1,dot/la/lb)))*180/Math.PI:0;
 return `<span class="pb">a</span> + <span class="pr">b</span> = <span class="pg">(${neg(v.a1+v.b1)}, ${neg(v.a2+v.b2)})</span>　|a + b| ≈ ${r2(Math.hypot(v.a1+v.b1,v.a2+v.b2))}<br>内積 a·b = ${B(dot)}　なす角 ≈ ${r2(th)}°${dot===0&&la&&lb?'　<span class="good">垂直!</span>':''}`}};

LABS.complex={ratio:.8,sliders:[{k:'re',l:'実部 a',min:-4,max:4,step:1,v:3},{k:'im',l:'虚部 b',min:-4,max:4,step:1,v:1},{k:'k',l:'i をかける回数',min:0,max:4,step:1,v:1}],
draw(g,v){g.view(-5.5,5.5,-5.5,5.5,true);const C=g.col;g.grid(1);g.axes(1);g.txt('実軸',5,.4,C('muted'),'right',11);g.txt('虚軸',.3,5.1,C('muted'),'left',11);
 let x=v.re,y=v.im;g.arrow(0,0,x,y,C('blue'));const pts=[];for(let i=0;i<v.k;i++){[x,y]=[-y,x];pts.push([x,y])}
 pts.forEach((p,i)=>g.arrow(0,0,p[0],p[1],i===pts.length-1?C('red'):g.alpha(C('red'),.3),i===pts.length-1?3:2));
 const m=Math.hypot(v.re,v.im);
 return `<span class="pb">z = ${cplx(v.re,v.im)}</span>　→　<span class="pr">z × i<sup>${v.k}</sup> = ${cplx(x,y)}</span><br>|z| = ${simpRt(v.re*v.re+v.im*v.im)}${Number.isInteger(m)?'':' ≈ '+r2(m)}<small><br>i を1回かけるごとに、長さはそのままで90°回る。4回で1周。</small>`}};

LABS.limit={ratio:.55,sliders:[{k:'n',l:'n',min:1,max:100,step:1,v:5}],
draw(g,v){g.view(-3,104,-.2,2.6);const C=g.col;g.grid(10,.5);g.axes(20,.5);g.seg(0,2,104,2,C('red'),2,[6,4]);g.txt('2',-1,2.12,C('red'),'right',12);
 const a=n=>(2*n+1)/(n+3);for(let n=1;n<=v.n;n++)g.dot(n,a(n),n===v.n?C('blue'):g.alpha(C('blue'),.45),n===v.n?6:3);
 return `a<sub>n</sub> = ${fr('2n + 1','n + 3')}　a<sub>${v.n}</sub> = ${B(a(v.n).toFixed(4))}<br><small>2 との差 ${(2-a(v.n)).toFixed(4)}。n を大きくすると、2 にはならないが、いくらでも 2 に近づく → 極限は 2。</small>`}};
