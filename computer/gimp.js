/* A small GIMP on the stage, for Part 4 of the Computer lessons (Drawing in GIMP).
   Loaded after ../lessons/engine.js and computer.js. Everything is drawn on a real <canvas>, so the student SEES
   what each tool does to the pixels.

   Making the window
   - G = gimp(x,y,wd,ht,{tools,title,tw,cols,menu,parent,cw,ch,fg,bg})
       tools: tool ids for the toolbox (see GP_TOOLS: brush pencil airbrush ink bucket gradient eraser clone heal
       dodge burn smudge fuzzy rect filters shear); tw = toolbox width; cols 1 = icon + name rows, 2+ = icons only
       (the name shows in the status bar); cw/ch = canvas size (default: fill the image area).
       G.cv / G.ctx / G.W / G.H the canvas; G.btn[id] a toolbox button; G.spots named points of the last picture.
   - G.pic(name,opts) draws a ready-made picture and returns G.spots:
       'blank' · 'house' (outline for colouring: spots wall roof door window sun sky grass) ·
       'meadow' ({flowers:[[x,y,size,colour]], spot:[x,y,r], shade:true|radius×H}; spots sky grass sun tree ground) ·
       'face' ({spot:[x,y,r]}) · 'balloon' (sky, balloon, a separate lake) · 'stripes' (paint for smudging).
   - G.select(id,detail) light a tool and show it in the status bar · await G.use(w,id,detail) point at it, then select ·
     G.color(fg,bg) change the colour swatch · G.status(html) · G.snap()/G.put(img) save and restore the pixels.

   Using tools (all animated; await them; cancel-safe because they pause with nap())
   - await G.stroke(w,pts,{tool,size,color,ms,shape,exposure}) paint along a path of [x,y] points:
       brush (soft, fuzzy edge; shape 'soft' | 'star' | 'square' = the brush type), pencil (hard, jagged edge),
       airbrush (spray), ink (calligraphic nib: thick or thin with the direction), eraser (paints the background
       colour), dodge (lighter), burn (darker), smudge (smears); exposure = how strong one pass is (default .2).
   - await G.fill(w,x,y,{color,tol}) bucket fill a closed area (spreads out from the tap).
   - await G.gradient(w,[x0,y0],[x1,y1],{c1,c2,seed}) blend two colours (in the area around seed, the selection or all).
   - await G.fuzzy(w,x,y,{tol}) fuzzy select (magic wand): the touching area of a similar colour, marching ants.
   - await G.rectSel(w,x,y,wd,ht) rectangle select · G.noSel() · await G.eraseSel(w) erase the selected part.
   - await G.clone(w,[sx,sy],[dx,dy],{area,r}) copy the round area around src onto dst (source cross-hair shown).
   - await G.heal(w,x,y,r) remove a spot by blending it with its surroundings.
   - await G.filter(w,'blur'|'emboss'|'invert'|'grey'|'sepia') a special effect over the whole image (or the selection).
   - await G.shear(w,k) slant the whole picture (a transform tool, not a painting tool).
   - G.dropdown(menuName,[html rows]) opens a menu under the menu bar -> {el, rows}; el.close().
   - G.zoom(sx,sy,sw,sh,{x,y,scale,label}) a magnifier (stage position x,y) with hard pixels; .refresh() after painting.
   Paths: gpWave(x0,y0,x1,amp,waves) · gpArc(cx,cy,r,deg0,deg1) · gpZig(x,y,wd,ht,rows) · gpSpiral(cx,cy,r,turns).

   The student's turn (each sets window.AUTOPLAY so the tester can finish)
   - await G.pick(w,id,{hint,onWrong}) wait until the student taps that tool (it glows after hint ms).
   - p = await G.tap(w,{auto:[x,y],ok:(x,y)=>bool,miss,target}) wait for a tap on the picture (target:true shows a
     pulsing ring at auto). Returns [x,y] in canvas pixels.
   - off = G.freePaint(tool,{size,color}) let the student paint with a finger; G.drew counts their strokes. */
const GP_SVG={
  gradient:'<span style="display:inline-block;width:20px;height:16px;border-radius:3px;background:linear-gradient(90deg,#1f2433,#fff);border:1px solid #888"></span>',
  eraser:'<svg width="22" height="20" viewBox="0 0 22 20"><path d="M2 13 L10 4 L19 11 L12 18 L6 18 Z" fill="#ff9ec4" stroke="#333" stroke-width="1.3"/><path d="M2 13 L6 18 L12 18 L7 9 Z" fill="#fff" stroke="#333" stroke-width="1.3"/></svg>',
  clone:'<svg width="22" height="22" viewBox="0 0 22 22"><rect x="8" y="2" width="6" height="9" rx="2.5" fill="#c58b4d" stroke="#333" stroke-width="1.2"/><rect x="3" y="11" width="16" height="5" rx="1.5" fill="#8a5a2b" stroke="#333" stroke-width="1.2"/><rect x="2" y="16" width="18" height="3" rx="1" fill="#e04848" stroke="#333" stroke-width="1"/></svg>',
  shear:'<svg width="24" height="20" viewBox="0 0 24 20"><path d="M7 3 H22 L17 17 H2 Z" fill="#8fd3ff" stroke="#fff" stroke-width="1.6"/></svg>',
  rect:'<svg width="22" height="18" viewBox="0 0 22 18"><rect x="2" y="2" width="18" height="14" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="3 2"/></svg>'};
const GP_TOOLS={brush:{n:'Paintbrush',i:'🖌️'},pencil:{n:'Pencil',i:'✏️'},airbrush:{n:'Airbrush',i:'💨'},ink:{n:'Ink',i:'🖋️'},
  bucket:{n:'Bucket Fill',i:'🪣'},gradient:{n:'Gradient',i:GP_SVG.gradient},eraser:{n:'Eraser',i:GP_SVG.eraser},
  clone:{n:'Clone',i:GP_SVG.clone},heal:{n:'Heal',i:'🩹'},dodge:{n:'Dodge',i:'☀️'},burn:{n:'Burn',i:'🔥'},smudge:{n:'Smudge',i:'👆'},
  fuzzy:{n:'Fuzzy Select',i:'🪄'},rect:{n:'Rectangle Select',i:GP_SVG.rect},filters:{n:'Filters',i:'✨'},shear:{n:'Shear',i:GP_SVG.shear}};
const GP_MENU=['File','Edit','Select','View','Image','Layer','Colors','Tools','Filters','Help'];

document.head.insertAdjacentHTML('beforeend',`<style>
.cw.gp .cw-body{padding:0;background:#3b3b40}
.gp-box{position:absolute;top:8px;bottom:34px;left:8px;background:#2a2a2f;border-radius:8px;padding:6px;box-sizing:border-box}
.gp-list{display:flex;flex-wrap:wrap;gap:5px}
.gp-tool{display:flex;align-items:center;gap:7px;height:34px;padding:0 5px;border-radius:7px;background:#46464d;color:#f0f0f0;font-size:14px;font-weight:700;cursor:pointer;
  box-sizing:border-box;border:2px solid transparent;white-space:nowrap;overflow:hidden;user-select:none;-webkit-user-select:none}
.gp-tool.sq{justify-content:center;height:38px}
.gp-tool .ic{width:24px;height:24px;font-size:19px;flex:none;display:flex;align-items:center;justify-content:center;line-height:1}
.gp-tool.on{background:#0e7490;border-color:#7fe6f2}
.gp-tool.want{animation:gpwant .6s ease-in-out infinite alternate}
@keyframes gpwant{to{box-shadow:0 0 0 4px #ffd84d;background:#7a6418}}
.gp-sw{position:absolute;left:8px;bottom:8px;width:52px;height:40px}
.gp-sw div{position:absolute;width:28px;height:28px;border:2px solid #ddd;border-radius:4px;box-shadow:0 1px 3px rgba(0,0,0,.6)}
.gp-sw .f{left:0;top:0;z-index:1}.gp-sw .b{left:16px;top:12px}
.gp-area{position:absolute;top:8px;right:8px;bottom:34px;background:#56565c;border-radius:6px;overflow:hidden}
.gp-cvw{box-shadow:0 2px 10px rgba(0,0,0,.55);touch-action:none}
.gp-cvw canvas{display:block}
.gp-cur{left:0;top:0;pointer-events:none;font-size:28px;line-height:1;z-index:5}
.gp-ring{left:0;top:0;border:1.5px solid #fff;box-shadow:0 0 0 1px rgba(0,0,0,.65);border-radius:50%;pointer-events:none;box-sizing:border-box;z-index:4}
.gp-cross{width:22px;height:22px;pointer-events:none;z-index:5}
.gp-cross:before,.gp-cross:after{content:"";position:absolute;background:#fff;box-shadow:0 0 0 1px #1f2433}
.gp-cross:before{left:10px;top:0;width:2px;height:22px}.gp-cross:after{top:10px;left:0;width:22px;height:2px}
.gp-target{border:4px dashed #ffd84d;border-radius:50%;pointer-events:none;box-sizing:border-box;z-index:4}
.gp-scan{top:0;width:4px;background:#ffd84d;box-shadow:0 0 12px 4px rgba(255,216,77,.8);pointer-events:none;z-index:4}
.gp-stat{position:absolute;left:8px;right:8px;bottom:5px;height:24px;color:#e6e6e6;font-size:14px;font-weight:700;display:flex;align-items:center;gap:8px;white-space:nowrap;overflow:hidden}
.gp-stat .ic{display:inline-flex;align-items:center}
.gp-zoom{background:#2a2a2f;border:3px solid #22b8c9;border-radius:12px;padding:4px;box-shadow:0 6px 18px rgba(0,0,0,.25);z-index:15}
.gp-zoom canvas{display:block;border-radius:6px}
.gp-zoom .lb{color:#fff;font-size:15px;font-weight:800;text-align:center;padding:1px 0 4px}
.gp-drop{background:#fff;border:1px solid #9aa7bd;border-radius:0 0 8px 8px;box-shadow:0 8px 20px rgba(0,0,0,.35);padding:4px 0;z-index:12}
.gp-di{padding:7px 14px;font-size:16px;font-weight:700;color:#1f2433;cursor:pointer;white-space:nowrap}
.gp-di.on{background:#0e7490;color:#fff}
.gp-zmark{border:2px solid #ffd84d;box-shadow:0 0 0 1px #1f2433;pointer-events:none;z-index:4}
</style>`);

/* ---------- little helpers ---------- */
const gpHex=c=>{c=String(c).replace('#','');if(c.length===3)c=c.split('').map(x=>x+x).join('');const n=parseInt(c,16);return[n>>16&255,n>>8&255,n&255];};
const gpRand=seed=>()=>{seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
const gpCl=(v,a=0,b=1)=>v<a?a:v>b?b:v;
const gpSoft=(d,r,hard=.35)=>{if(d>=r)return 0;if(d<=r*hard)return 1;const c=(r-d)/(r*(1-hard));return c*c*(3-2*c);};
/* paths */
function gpWave(x0,y0,x1,amp=20,waves=2,n=60){const p=[];for(let i=0;i<=n;i++){const t=i/n;p.push([x0+(x1-x0)*t,y0+Math.sin(t*waves*2*Math.PI)*amp]);}return p;}
function gpArc(cx,cy,r,a0=0,a1=360,n=60){const p=[];for(let i=0;i<=n;i++){const a=(a0+(a1-a0)*i/n)*Math.PI/180;p.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r]);}return p;}
function gpZig(x,y,wd,ht,rows=4){const p=[];for(let i=0;i<=rows;i++){const yy=y+ht*i/rows;p.push(...(i%2?[[x+wd,yy],[x,yy]]:[[x,yy],[x+wd,yy]]));}return p;}
function gpSpiral(cx,cy,r,turns=3,n=90){const p=[];for(let i=0;i<=n;i++){const t=i/n,a=t*turns*2*Math.PI;p.push([cx+Math.cos(a)*r*t,cy+Math.sin(a)*r*t]);}return p;}
function gpResample(pts,sp){if(pts.length<2)return pts.slice();const out=[pts[0].slice()];let carry=0;
  for(let i=1;i<pts.length;i++){const [ax,ay]=pts[i-1],[bx,by]=pts[i];const L=Math.hypot(bx-ax,by-ay);if(!L)continue;let t=sp-carry;
    while(t<=L){out.push([ax+(bx-ax)*t/L,ay+(by-ay)*t/L]);t+=sp;}carry=L-(t-sp);}
  return out;}
const GP_COV=new Set(['brush','pencil','eraser','airbrush','ink']);
function gpSpacing(tool,o){const s=o.size||16;
  if(tool==='brush'||tool==='eraser')return o.shape&&o.shape!=='soft'?Math.max(2,s*(o.spacing||.9)):Math.max(1,s*.1);
  return {pencil:1,ink:1,airbrush:2,dodge:3,burn:3,smudge:2,clone:2,heal:2}[tool]||2;}

/* ---------- flood (bucket fill, fuzzy select) ---------- */
function gpFlood(W,H,d,x,y,tol,only){x=Math.round(gpCl(x,0,W-1));y=Math.round(gpCl(y,0,H-1));const s=(y*W+x)*4,r0=d[s],g0=d[s+1],b0=d[s+2];
  const mask=new Uint8Array(W*H),order=new Int32Array(W*H);let head=0,tail=0;
  const okp=i=>{if(mask[i])return false;if(only&&!only[i])return false;const j=i*4;return Math.max(Math.abs(d[j]-r0),Math.abs(d[j+1]-g0),Math.abs(d[j+2]-b0))<=tol;};
  const st=y*W+x;mask[st]=1;order[tail++]=st;
  while(head<tail){const i=order[head++],px=i%W;
    if(px>0&&okp(i-1)){mask[i-1]=1;order[tail++]=i-1;}if(px<W-1&&okp(i+1)){mask[i+1]=1;order[tail++]=i+1;}
    if(i>=W&&okp(i-W)){mask[i-W]=1;order[tail++]=i-W;}if(i<W*(H-1)&&okp(i+W)){mask[i+W]=1;order[tail++]=i+W;}}
  return{mask,order,n:tail};}

/* ---------- a painting session: pixels in, pixels out ---------- */
function gpBegin(G,tool,o){const img=G.ctx.getImageData(0,0,G.W,G.H);
  const S={tool,o,img,d:img.data,base:new Uint8ClampedArray(img.data),cov:GP_COV.has(tool)?new Float32Array(G.W*G.H):null,
    col:gpHex(tool==='eraser'?G.bg:(o.color||G.fg)),x0:1e9,y0:1e9,x1:-1,y1:-1,carry:null,rnd:gpRand(o.seed||7)};
  return S;}
function gpDirty(G,S,x0,y0,x1,y1){S.x0=Math.max(0,Math.min(S.x0,Math.floor(x0)));S.y0=Math.max(0,Math.min(S.y0,Math.floor(y0)));
  S.x1=Math.min(G.W-1,Math.max(S.x1,Math.ceil(x1)));S.y1=Math.min(G.H-1,Math.max(S.y1,Math.ceil(y1)));}
function gpFlush(G,S){if(S.x1<S.x0)return;const W=G.W,d=S.d,b=S.base,c=S.col,op=S.o.op==null?1:S.o.op;
  if(S.cov)for(let y=S.y0;y<=S.y1;y++)for(let x=S.x0;x<=S.x1;x++){const i=y*W+x,a=S.cov[i]*op;if(a<=0)continue;const j=i*4;
    d[j]=b[j]+(c[0]-b[j])*a;d[j+1]=b[j+1]+(c[1]-b[j+1])*a;d[j+2]=b[j+2]+(c[2]-b[j+2])*a;d[j+3]=255;}
  G.ctx.putImageData(S.img,0,0,S.x0,S.y0,S.x1-S.x0+1,S.y1-S.y0+1);S.x0=S.y0=1e9;S.x1=S.y1=-1;}
/* the star brush outline */
function gpInStar(dx,dy,r){const P=[];for(let k=0;k<10;k++){const a=-Math.PI/2+k*Math.PI/5,rr=k%2?r*.45:r;P.push([Math.cos(a)*rr,Math.sin(a)*rr]);}
  let inside=false;for(let i=0,j=9;i<10;j=i++){const [xi,yi]=P[i],[xj,yj]=P[j];if((yi>dy)!==(yj>dy)&&dx<(xj-xi)*(dy-yi)/(yj-yi)+xi)inside=!inside;}return inside;}
function gpCov(G,S,x,y,r,shape){const W=G.W,H=G.H,R=Math.ceil(r)+1;
  const x0=Math.max(0,Math.floor(x-R)),x1=Math.min(W-1,Math.ceil(x+R)),y0=Math.max(0,Math.floor(y-R)),y1=Math.min(H-1,Math.ceil(y+R));
  for(let yy=y0;yy<=y1;yy++)for(let xx=x0;xx<=x1;xx++){const dx=xx+.5-x,dy=yy+.5-y,dd=Math.hypot(dx,dy);let c;
    if(shape==='hard')c=dd<=r?1:0;
    else if(shape==='star')c=gpInStar(dx,dy,r)?1:0;
    else if(shape==='square')c=Math.max(Math.abs(dx),Math.abs(dy))<=r*.8?1:0;
    else c=gpSoft(dd,r);
    if(c>0){const i=yy*W+xx;if(c>S.cov[i])S.cov[i]=c;}}
  gpDirty(G,S,x0,y0,x1,y1);}
function gpApply(G,S,[x,y]){const o=S.o,r=(o.size||16)/2,W=G.W,H=G.H,d=S.d,b=S.base;
  const disc=(R,f)=>{const x0=Math.max(0,Math.floor(x-R)),x1=Math.min(W-1,Math.ceil(x+R)),y0=Math.max(0,Math.floor(y-R)),y1=Math.min(H-1,Math.ceil(y+R));
    for(let yy=y0;yy<=y1;yy++)for(let xx=x0;xx<=x1;xx++){const dd=Math.hypot(xx+.5-x,yy+.5-y);if(dd<R)f(xx,yy,dd,(yy*W+xx)*4);}gpDirty(G,S,x0,y0,x1,y1);};
  switch(S.tool){
    case 'brush':case 'eraser':gpCov(G,S,x,y,r,o.shape||'soft');break;
    case 'pencil':gpCov(G,S,Math.round(x),Math.round(y),r,'hard');break;
    case 'airbrush':{const fl=(o.flow||16)/16;for(let yy=Math.max(0,Math.floor(y-r));yy<=Math.min(H-1,Math.ceil(y+r));yy++)for(let xx=Math.max(0,Math.floor(x-r));xx<=Math.min(W-1,Math.ceil(x+r));xx++){
        const c=gpSoft(Math.hypot(xx+.5-x,yy+.5-y),r,0)*.035*fl;if(c>0){const i=yy*W+xx;S.cov[i]=Math.min(1,S.cov[i]+c);}}}
      for(let k=0;k<(o.flow||16);k++){const a=S.rnd()*6.2832,dd=r*S.rnd(),px=Math.round(x+Math.cos(a)*dd),py=Math.round(y+Math.sin(a)*dd);
        if(px>=0&&py>=0&&px<W&&py<H){const i=py*W+px;S.cov[i]=Math.min(1,S.cov[i]+.4);}}gpDirty(G,S,x-r-1,y-r-1,x+r+1,y+r+1);break;
    case 'ink':{const a=(o.angle==null?-45:o.angle)*Math.PI/180,nx=Math.cos(a)*r,ny=Math.sin(a)*r;
      for(let t=-1;t<=1;t+=.5/r){const px=x+nx*t,py=y+ny*t;
        for(let yy=Math.floor(py-1);yy<=Math.ceil(py+1);yy++)for(let xx=Math.floor(px-1);xx<=Math.ceil(px+1);xx++){if(xx<0||yy<0||xx>=W||yy>=H)continue;
          const c=gpCl(1.7-Math.hypot(xx+.5-px,yy+.5-py)),i=yy*W+xx;if(c>S.cov[i])S.cov[i]=c;}}
      gpDirty(G,S,x-r-2,y-r-2,x+r+2,y+r+2);break;}
    case 'dodge':case 'burn':{const e=(o.exposure||.2)*3/Math.max(3,r),up=S.tool==='dodge';
      disc(r,(xx,yy,dd,j)=>{const g=up?1/(1+gpSoft(dd,r,.2)*e):1+gpSoft(dd,r,.2)*e;for(let k=0;k<3;k++)d[j+k]=255*Math.pow(d[j+k]/255,g);});break;}
    case 'smudge':{const R=Math.ceil(r),n=2*R+1,x0=Math.round(x)-R,y0=Math.round(y)-R;
      if(!S.carry){S.carry=new Float32Array(n*n*4);for(let v=0;v<n;v++)for(let u=0;u<n;u++){const px=gpCl(x0+u,0,W-1),py=gpCl(y0+v,0,H-1),j=(py*W+px)*4,q=(v*n+u)*4;for(let k=0;k<3;k++)S.carry[q+k]=d[j+k];}break;}
      for(let v=0;v<n;v++)for(let u=0;u<n;u++){const px=x0+u,py=y0+v;if(px<0||py<0||px>=W||py>=H)continue;const s=gpSoft(Math.hypot(u-R,v-R),r,.3)*(o.strength||.6);if(s<=0)continue;
        const j=(py*W+px)*4,q=(v*n+u)*4;for(let k=0;k<3;k++){const nv=d[j+k]*(1-s)+S.carry[q+k]*s;d[j+k]=nv;S.carry[q+k]=S.carry[q+k]*.88+nv*.12;}}
      gpDirty(G,S,x0,y0,x0+n,y0+n);break;}
    case 'clone':{const ox=Math.round(o.off[0]),oy=Math.round(o.off[1]);disc(r,(xx,yy,dd,j)=>{const sx=xx+ox,sy=yy+oy;if(sx<0||sy<0||sx>=W||sy>=H)return;const s=gpSoft(dd,r,.6),q=(sy*W+sx)*4;
        for(let k=0;k<3;k++)d[j+k]=d[j+k]*(1-s)+b[q+k]*s;});break;}
    case 'heal':{const T=o.target;disc(r,(xx,yy,dd,j)=>{const t=T.get(yy*W+xx);if(!t)return;const s=gpSoft(dd,r,.4)*.45*t[3];
        for(let k=0;k<3;k++)d[j+k]=d[j+k]*(1-s)+t[k]*s;});break;}}}
/* what a spot should look like: each pixel blended from the clean pixels around it (across and up/down) */
function gpHealTarget(G,cx,cy,R){const W=G.W,H=G.H,d=G.ctx.getImageData(0,0,W,H).data,T=new Map(),R2=R+3;
  const px=(x,y)=>{x=gpCl(Math.round(x),0,W-1);y=gpCl(Math.round(y),0,H-1);const j=(y*W+x)*4;return[d[j],d[j+1],d[j+2]];};
  for(let y=Math.floor(cy-R2);y<=Math.ceil(cy+R2);y++)for(let x=Math.floor(cx-R2);x<=Math.ceil(cx+R2);x++){if(x<0||y<0||x>=W||y>=H)continue;
    const dx=x-cx,dy=y-cy,dd=Math.hypot(dx,dy);if(dd>R2)continue;
    const hx=Math.sqrt(Math.max(0,R2*R2-dy*dy))+1,vy=Math.sqrt(Math.max(0,R2*R2-dx*dx))+1;
    const L=px(cx-hx,y),Rr=px(cx+hx,y),U=px(x,cy-vy),D=px(x,cy+vy),th=(dx+hx)/(2*hx),tv=(dy+vy)/(2*vy),wh=1/hx,wv=1/vy,out=[];
    for(let k=0;k<3;k++)out.push(((L[k]+(Rr[k]-L[k])*th)*wh+(U[k]+(D[k]-U[k])*tv)*wv)/(wh+wv));
    out.push(dd<=R?1:gpCl((R2-dd)/3));T.set(y*W+x,out);}
  return T;}
/* special effects */
function gpFx(kind,src,W,H){const out=new Uint8ClampedArray(src.length);out.set(src);const lum=j=>.3*src[j]+.59*src[j+1]+.11*src[j+2];
  if(kind==='invert'){for(let j=0;j<src.length;j+=4){out[j]=255-src[j];out[j+1]=255-src[j+1];out[j+2]=255-src[j+2];}}
  else if(kind==='grey'){for(let j=0;j<src.length;j+=4){const l=lum(j);out[j]=out[j+1]=out[j+2]=l;}}
  else if(kind==='sepia'){for(let j=0;j<src.length;j+=4){const l=lum(j);out[j]=l*1.07+30;out[j+1]=l*.9+18;out[j+2]=l*.66;}}
  else if(kind==='emboss'){for(let y=0;y<H;y++)for(let x=0;x<W;x++){const j=(y*W+x)*4,a=(Math.max(0,y-1)*W+Math.max(0,x-1))*4,b=(Math.min(H-1,y+1)*W+Math.min(W-1,x+1))*4;
      const v=128+(lum(b)-lum(a))*1.6;out[j]=out[j+1]=out[j+2]=v;}}
  else if(kind==='blur'){const R=5,tmp=new Float32Array(src.length);let a=Float32Array.from(src);
    for(let pass=0;pass<2;pass++){
      for(let y=0;y<H;y++)for(let x=0;x<W;x++){let s0=0,s1=0,s2=0,n=0;for(let k=-R;k<=R;k++){const xx=gpCl(x+k,0,W-1),j=(y*W+xx)*4;s0+=a[j];s1+=a[j+1];s2+=a[j+2];n++;}const j=(y*W+x)*4;tmp[j]=s0/n;tmp[j+1]=s1/n;tmp[j+2]=s2/n;}
      for(let y=0;y<H;y++)for(let x=0;x<W;x++){let s0=0,s1=0,s2=0,n=0;for(let k=-R;k<=R;k++){const yy=gpCl(y+k,0,H-1),j=(yy*W+x)*4;s0+=tmp[j];s1+=tmp[j+1];s2+=tmp[j+2];n++;}const j=(y*W+x)*4;a[j]=s0/n;a[j+1]=s1/n;a[j+2]=s2/n;}}
    for(let j=0;j<src.length;j+=4){out[j]=a[j];out[j+1]=a[j+1];out[j+2]=a[j+2];}}
  return out;}

/* ---------- pictures ---------- */
function gpFlower(c,x,y,s,petal='#ff5fa2',mid='#ffd84d'){c.strokeStyle='#2e7d32';c.lineWidth=Math.max(2,s*.18);c.beginPath();c.moveTo(x,y);c.lineTo(x,y+s*2.2);c.stroke();
  c.fillStyle='#43a047';c.beginPath();c.ellipse(x+s*.45,y+s*1.4,s*.45,s*.2,-.5,0,6.29);c.fill();
  c.fillStyle=petal;for(let k=0;k<6;k++){const a=k*Math.PI/3;c.beginPath();c.arc(x+Math.cos(a)*s*.62,y+Math.sin(a)*s*.62,s*.45,0,6.29);c.fill();}
  c.fillStyle=mid;c.beginPath();c.arc(x,y,s*.42,0,6.29);c.fill();}
function gpGrass(c,x,y,wd,ht,seed=3){const r=gpRand(seed);c.fillStyle='#4caf50';c.fillRect(x,y,wd,ht);
  for(let k=0;k<wd*ht/60;k++){const px=x+r()*wd,py=y+r()*ht;c.strokeStyle=r()<.5?'#3d9440':'#66c26a';c.lineWidth=1.4;c.beginPath();c.moveTo(px,py);c.lineTo(px+(r()-.5)*4,py-4-r()*5);c.stroke();}}
const GP_PICS={
  blank(G,c){c.fillStyle=G.bg;c.fillRect(0,0,G.W,G.H);return{};},
  house(G,c,{fill=false}={}){const W=G.W,H=G.H,gy=Math.round(H*.74);c.fillStyle='#fff';c.fillRect(0,0,W,H);
    c.strokeStyle='#1f2433';c.lineWidth=4;c.lineJoin='round';
    c.beginPath();c.moveTo(-5,gy);c.lineTo(W+5,gy);c.stroke();
    const hx=W*.18,hw=W*.34,hy=H*.42;c.strokeRect(hx,hy,hw,gy-hy);
    c.beginPath();c.moveTo(hx-W*.04,hy);c.lineTo(hx+hw/2,H*.13);c.lineTo(hx+hw+W*.04,hy);c.closePath();c.stroke();
    const dw=W*.075,dx=hx+hw*.62;c.strokeRect(dx,gy-H*.2,dw,H*.2);
    const ws=H*.12;c.strokeRect(hx+hw*.14,hy+H*.07,ws,ws);
    c.beginPath();c.arc(W*.8,H*.2,H*.09,0,6.29);c.stroke();
    return{wall:[hx+hw*.3,gy-H*.05],roof:[hx+hw/2,hy-H*.08],door:[dx+dw/2,gy-H*.1],window:[hx+hw*.14+ws/2,hy+H*.07+ws/2],sun:[W*.8,H*.2],sky:[W*.66,H*.5],grass:[W*.5,H*.87],ground:gy};},
  meadow(G,c,{flowers,spot,shade,seed=3}={}){const W=G.W,H=G.H,gy=H*.6;
    let g=c.createLinearGradient(0,0,0,gy);g.addColorStop(0,'#4fa8e8');g.addColorStop(1,'#cbeeff');c.fillStyle=g;c.fillRect(0,0,W,gy+2);
    g=c.createRadialGradient(W*.84,H*.17,0,W*.84,H*.17,H*.2);g.addColorStop(0,'rgba(255,240,150,.9)');g.addColorStop(1,'rgba(255,240,150,0)');c.fillStyle=g;c.fillRect(0,0,W,H);
    c.fillStyle='#ffd84d';c.beginPath();c.arc(W*.84,H*.17,H*.08,0,6.29);c.fill();
    c.fillStyle='#8fd07a';c.beginPath();c.ellipse(W*.3,gy+6,W*.4,H*.14,0,Math.PI,0);c.fill();
    c.fillStyle='#7cc464';c.beginPath();c.ellipse(W*.85,gy+6,W*.35,H*.1,0,Math.PI,0);c.fill();
    gpGrass(c,0,gy,W,H-gy,seed);
    c.fillStyle='#7a4a24';c.fillRect(W*.1,gy-H*.18,W*.035,H*.26);
    c.fillStyle='#2f8a3a';[[0,-.26,.11],[-.06,-.18,.09],[.07,-.18,.09]].forEach(([a,b,s])=>{c.beginPath();c.arc(W*.1175+W*a,gy+H*b,H*s*1.1,0,6.29);c.fill();});
    (flowers||[[W*.32,H*.75,H*.045]]).forEach(([x,y,s,col])=>gpFlower(c,x,y,s||H*.045,col));
    if(shade){g=c.createRadialGradient(0,H,0,0,H,H*(shade===true?.75:shade));g.addColorStop(0,'rgba(10,20,40,.72)');g.addColorStop(.7,'rgba(10,20,40,.55)');g.addColorStop(1,'rgba(10,20,40,0)');c.fillStyle=g;c.fillRect(0,0,W,H);}
    if(spot){const [x,y,r]=spot;g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'#5a3a1e');g.addColorStop(.75,'#6b4524');g.addColorStop(1,'rgba(107,69,36,0)');c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,6.29);c.fill();}
    return{sky:[W*.55,H*.25],grass:[W*.6,H*.82],ground:gy,sun:[W*.84,H*.17],tree:[W*.12,gy-H*.26]};},
  face(G,c,{spot}={}){const W=G.W,H=G.H,cx=W/2,cy=H*.54,r=H*.36;
    let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#bfe3ff');g.addColorStop(1,'#e8f5ff');c.fillStyle=g;c.fillRect(0,0,W,H);
    c.fillStyle='#5b3a1f';c.beginPath();c.ellipse(cx,cy-r*.35,r*1.12,r*.95,0,0,6.29);c.fill();
    c.fillStyle='#f3c095';[-1,1].forEach(s=>{c.beginPath();c.arc(cx+s*r*1.0,cy,r*.17,0,6.29);c.fill();});
    g=c.createRadialGradient(cx-r*.3,cy-r*.3,r*.2,cx,cy,r);g.addColorStop(0,'#fbd6b2');g.addColorStop(1,'#efb98c');c.fillStyle=g;c.beginPath();c.arc(cx,cy,r,0,6.29);c.fill();
    c.fillStyle='#5b3a1f';c.beginPath();c.ellipse(cx,cy-r*.78,r*.8,r*.3,0,0,6.29);c.fill();
    [-1,1].forEach(s=>{c.fillStyle='#fff';c.beginPath();c.ellipse(cx+s*r*.36,cy-r*.12,r*.15,r*.11,0,0,6.29);c.fill();c.fillStyle='#3a2a1a';c.beginPath();c.arc(cx+s*r*.36,cy-r*.11,r*.075,0,6.29);c.fill();
      c.fillStyle='rgba(255,120,120,.35)';c.beginPath();c.arc(cx+s*r*.55,cy+r*.25,r*.13,0,6.29);c.fill();});
    c.strokeStyle='#a0522d';c.lineWidth=4;c.lineCap='round';c.beginPath();c.arc(cx,cy+r*.12,r*.38,.2*Math.PI,.8*Math.PI);c.stroke();
    if(spot){const [x,y,rr]=spot;g=c.createRadialGradient(x,y,0,x,y,rr);g.addColorStop(0,'#8b2f1a');g.addColorStop(.6,'#b5482a');g.addColorStop(1,'rgba(200,90,60,0)');c.fillStyle=g;c.beginPath();c.arc(x,y,rr,0,6.29);c.fill();}
    return{face:[cx,cy],r};},
  balloon(G,c){const W=G.W,H=G.H,gy=H*.66;c.fillStyle='#62b6f0';c.fillRect(0,0,W,H);
    c.fillStyle='#ffd84d';c.beginPath();c.arc(W*.86,H*.16,H*.08,0,6.29);c.fill();
    gpGrass(c,0,gy,W,H-gy,5);c.fillStyle='#62b6f0';c.beginPath();c.ellipse(W*.68,H*.85,W*.2,H*.08,0,0,6.29);c.fill();
    c.strokeStyle='#1f2433';c.lineWidth=2;c.beginPath();c.moveTo(W*.3,H*.47);c.quadraticCurveTo(W*.27,H*.6,W*.31,H*.74);c.stroke();
    c.fillStyle='#e04848';c.beginPath();c.ellipse(W*.3,H*.3,H*.12,H*.16,0,0,6.29);c.fill();
    c.fillStyle='rgba(255,255,255,.55)';c.beginPath();c.ellipse(W*.3-H*.05,H*.24,H*.025,H*.05,-.4,0,6.29);c.fill();
    return{sky:[W*.6,H*.3],lake:[W*.68,H*.85],balloon:[W*.3,H*.3],grass:[W*.2,H*.85]};},
  stripes(G,c){const W=G.W,H=G.H,cols=['#e04848','#ff9f1a','#ffd84d','#18a058','#2c66cf','#6a45d8'];
    cols.forEach((col,i)=>{c.fillStyle=col;c.fillRect(i*W/cols.length,0,W/cols.length+1,H);});return{};}};

/* ---------- the window ---------- */
function gimp(x,y,wd,ht,{tools=['brush','pencil','airbrush','ink','bucket','gradient','eraser'],title='picture.png – GIMP',tw=150,cols=1,menu=GP_MENU,parent,cw,ch,fg='#e04848',bg='#ffffff'}={}){
  const Wn=win(x,y,wd,ht,{title:'🎨 '+title,kind:'dark',menu,parent});Wn.el.classList.add('gp');const body=Wn.body;
  const bw=body.clientWidth,bh=body.clientHeight;
  const G={win:Wn,el:Wn.el,btn:{},fg,bg,tool:null,sel:null,onTool:null,drew:0,spots:{}};
  const box=mk('gp-box',`width:${tw}px`,'',body),list=mk('gp-list','position:relative','',box);
  tools.forEach(id=>{const T=GP_TOOLS[id],b=document.createElement('div');b.className='gp-tool'+(cols>1?' sq':'');
    b.style.width=cols>1?`calc(${100/cols}% - ${5*(cols-1)/cols}px)`:'100%';b.title=T.n;
    b.innerHTML=`<span class="ic">${T.i}</span>`+(cols>1?'':`<span>${T.n}</span>`);
    b.onclick=()=>{G.select(id);if(G.onTool)G.onTool(id);};list.appendChild(b);G.btn[id]=b;});
  const sw=mk('gp-sw','','<div class="b"></div><div class="f"></div>',box);
  const aw=bw-tw-24,ah=bh-42,area=mk('gp-area',`left:${tw+16}px`,'',body);
  const W=G.W=Math.round(cw||aw-16),H=G.H=Math.round(ch||ah-16);
  const wrap=G.wrap=mk('gp-cvw',`left:${Math.round((aw-W)/2)}px;top:${Math.round((ah-H)/2)}px;width:${W}px;height:${H}px`,'',area);
  const can=()=>{const c=document.createElement('canvas');c.width=W;c.height=H;c.style.cssText='position:absolute;left:0;top:0;pointer-events:none';wrap.appendChild(c);return c;};
  const cv=G.cv=can();cv.style.position='relative';G.ctx=cv.getContext('2d',{willReadFrequently:true});
  const ants=can(),actx=ants.getContext('2d'),guide=can(),gctx=G.gctx=guide.getContext('2d');
  const cur=mk('gp-cur','opacity:0','',wrap),ring=mk('gp-ring','opacity:0','',wrap),cross=mk('gp-cross','opacity:0','',wrap);
  const stat=mk('gp-stat','','',body);
  G.status=h=>{stat.innerHTML=h;};
  G.select=(id,detail)=>{G.tool=id;Object.entries(G.btn).forEach(([k,b])=>b.classList.toggle('on',k===id));const T=GP_TOOLS[id];
    if(G.btn[id])G.btn[id].animate([{transform:'scale(1.18)'},{transform:'scale(1)'}],{duration:350});
    G.status(`<span class="ic">${T.i}</span> ${T.n}${detail?` <span style="color:#9ad">· ${detail}</span>`:''}`);beep(760,.04);return G.btn[id];};
  G.use=async(w,id,detail,{show=true}={})=>{if(show&&G.btn[id])point(G.btn[id]);await nap(w,350);G.select(id,detail);await nap(w,450);};
  G.color=(f,b)=>{if(f)G.fg=f;if(b)G.bg=b;sw.querySelector('.f').style.background=G.fg;sw.querySelector('.b').style.background=G.bg;
    sw.querySelector('.f').animate([{transform:'scale(1.4)'},{transform:'scale(1)'}],{duration:350});};
  G.color();G.status('<span style="color:#aab">Choose a tool from the toolbox</span>');
  G.cur=(px,py,tool,size)=>{const T=GP_TOOLS[tool]||GP_TOOLS.brush;if(cur.dataset.t!==tool){cur.innerHTML=T.i;cur.dataset.t=tool;}
    cur.style.opacity=1;cur.style.transform=`translate(${px-4}px,${py-26}px)`;
    if(size){ring.style.opacity=1;ring.style.width=ring.style.height=size+'px';ring.style.transform=`translate(${px-size/2}px,${py-size/2}px)`;}else ring.style.opacity=0;};
  G.hideCur=()=>{cur.style.opacity=0;ring.style.opacity=0;cross.style.opacity=0;};
  G.pic=(name,o={})=>{G.noSel();G.lastPic=[name,o];G.spots=GP_PICS[name](G,G.ctx,o)||{};return G.spots;};
  G.snap=()=>G.ctx.getImageData(0,0,W,H);G.put=img=>G.ctx.putImageData(img,0,0);
  const pos=e=>{const r=cv.getBoundingClientRect();return[gpCl((e.clientX-r.left)*W/r.width,0,W-1),gpCl((e.clientY-r.top)*H/r.height,0,H-1)];};

  /* painting along a path */
  G.stroke=async(w,pts,o={})=>{o=Object.assign({tool:G.tool||'brush',size:16,ms:1200,cursor:true},o);const tool=o.tool;
    const S=gpBegin(G,tool,o),smp=gpResample(pts,gpSpacing(tool,o)),frames=Math.max(1,Math.round(o.ms/35)),per=Math.max(1,Math.ceil(smp.length/frames));
    for(let i=0;i<smp.length;i++){gpApply(G,S,smp[i]);
      if((i+1)%per===0||i===smp.length-1){gpFlush(G,S);if(o.cursor){G.cur(smp[i][0],smp[i][1],tool,o.size);
          if(o.off){cross.style.opacity=1;cross.style.transform=`translate(${smp[i][0]+o.off[0]-11}px,${smp[i][1]+o.off[1]-11}px)`;}}
        await nap(w,o.ms/frames);}}
    if(o.cursor&&!o.keepCur)G.hideCur();return S;};
  /* bucket fill: spreads out from the tap */
  G.fill=async(w,px,py,{color=G.fg,tol=90,ms=900,cursor=true}={})=>{const img=G.snap(),d=img.data,F=gpFlood(W,H,d,px,py,tol,G.sel),c=gpHex(color);
    if(cursor)G.cur(px,py,'bucket');beep(500,.08);
    const frames=Math.max(1,Math.round(ms/40)),per=Math.ceil(F.n/frames);
    for(let k=0;k<F.n;k++){const j=F.order[k]*4;d[j]=c[0];d[j+1]=c[1];d[j+2]=c[2];d[j+3]=255;
      if((k+1)%per===0||k===F.n-1){G.ctx.putImageData(img,0,0);await nap(w,ms/frames);}}
    if(cursor)G.hideCur();return F;};
  /* gradient: drag a line, then the two colours blend along it */
  G.gradient=async(w,[x0,y0],[x1,y1],{c1=G.fg,c2=G.bg,seed,tol=90,ms=1400}={})=>{const img=G.snap(),d=img.data;
    const mask=seed?gpFlood(W,H,d,seed[0],seed[1],tol,G.sel).mask:G.sel;
    const A=gpHex(c1),B=gpHex(c2),vx=x1-x0,vy=y1-y0,L2=vx*vx+vy*vy||1,n=Math.max(2,Math.round(ms*.45/35));
    for(let f=1;f<=n;f++){const t=f/n,ex=x0+vx*t,ey=y0+vy*t;gctx.clearRect(0,0,W,H);
      gctx.lineCap='round';gctx.strokeStyle='#1f2433';gctx.lineWidth=5;gctx.beginPath();gctx.moveTo(x0,y0);gctx.lineTo(ex,ey);gctx.stroke();
      gctx.strokeStyle='#fff';gctx.lineWidth=2.5;gctx.stroke();[[x0,y0],[ex,ey]].forEach(([a,b])=>{gctx.fillStyle='#fff';gctx.beginPath();gctx.arc(a,b,6,0,6.29);gctx.fill();gctx.strokeStyle='#1f2433';gctx.lineWidth=2;gctx.stroke();});
      G.cur(ex,ey,'gradient');await nap(w,35);}
    const base=new Uint8ClampedArray(d),tgt=new Uint8ClampedArray(d);
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;if(mask&&!mask[i])continue;const t=gpCl(((x-x0)*vx+(y-y0)*vy)/L2),j=i*4;for(let k=0;k<3;k++)tgt[j+k]=A[k]+(B[k]-A[k])*t;}
    const m=Math.max(2,Math.round(ms*.55/40));
    for(let f=1;f<=m;f++){const a=f/m;for(let j=0;j<d.length;j+=4)for(let k=0;k<3;k++)d[j+k]=base[j+k]+(tgt[j+k]-base[j+k])*a;G.ctx.putImageData(img,0,0);await nap(w,40);}
    gctx.clearRect(0,0,W,H);G.hideCur();beep(700,.06);};
  /* selections with marching ants */
  let antsTok=0;
  G.setSel=mask=>{G.sel=mask;const my=++antsTok;actx.clearRect(0,0,W,H);if(!mask)return;
    const im=actx.createImageData(W,H),a=im.data,edge=[];
    for(let i=0;i<W*H;i++){if(!mask[i])continue;const x=i%W,y=(i-x)/W;
      if(x===0||y===0||x===W-1||y===H-1||!mask[i-1]||!mask[i+1]||!mask[i-W]||!mask[i+W])edge.push(i);else{a[i*4]=34;a[i*4+1]=184;a[i*4+2]=201;a[i*4+3]=60;}}
    let off=0,fr=0;
    (function tick(){if(my!==antsTok||!wrap.isConnected)return;if(fr++%6===0){off++;
        for(const i of edge){const x=i%W,y=(i-x)/W,v=((x+y+off)>>2)&1?255:0,j=i*4;a[j]=a[j+1]=a[j+2]=v;a[j+3]=255;}actx.putImageData(im,0,0);}
      requestAnimationFrame(tick);})();
    for(const i of edge){const j=i*4;a[j+3]=255;}actx.putImageData(im,0,0);};
  G.noSel=()=>{antsTok++;G.sel=null;actx.clearRect(0,0,W,H);};
  G.fuzzy=async(w,px,py,{tol=45,ms=800}={})=>{const img=G.snap(),F=gpFlood(W,H,img.data,px,py,tol);G.cur(px,py,'fuzzy');beep(900,.06);
    /* show the selection spreading out, then the ants */
    const im=actx.createImageData(W,H),a=im.data,frames=Math.max(1,Math.round(ms/40)),per=Math.ceil(F.n/frames);antsTok++;
    for(let k=0;k<F.n;k++){const j=F.order[k]*4;a[j]=255;a[j+1]=216;a[j+2]=77;a[j+3]=120;if((k+1)%per===0||k===F.n-1){actx.putImageData(im,0,0);await nap(w,ms/frames);}}
    G.setSel(F.mask);G.hideCur();beep(1100,.06);return F;};
  G.rectSel=async(w,rx,ry,rw,rh,{ms=700}={})=>{const n=Math.max(2,Math.round(ms/35));G.noSel();
    for(let f=1;f<=n;f++){const t=f/n;gctx.clearRect(0,0,W,H);gctx.setLineDash([6,4]);gctx.strokeStyle='#1f2433';gctx.lineWidth=2;gctx.strokeRect(rx+.5,ry+.5,rw*t,rh*t);gctx.setLineDash([]);
      G.cur(rx+rw*t,ry+rh*t,'rect');await nap(w,35);}
    gctx.clearRect(0,0,W,H);const m=new Uint8Array(W*H);for(let y=Math.max(0,ry);y<Math.min(H,ry+rh);y++)for(let x=Math.max(0,rx);x<Math.min(W,rx+rw);x++)m[y*W+x]=1;
    G.setSel(m);G.hideCur();beep(900,.05);return m;};
  G.eraseSel=async(w,{ms=900}={})=>{if(!G.sel)return;const img=G.snap(),d=img.data,c=gpHex(G.bg),n=Math.max(2,Math.round(ms/40));
    for(let f=1;f<=n;f++){const y0=Math.floor(H*(f-1)/n),y1=Math.floor(H*f/n);
      for(let y=y0;y<y1;y++)for(let x=0;x<W;x++){const i=y*W+x;if(!G.sel[i])continue;const j=i*4;d[j]=c[0];d[j+1]=c[1];d[j+2]=c[2];}
      G.ctx.putImageData(img,0,0);await nap(w,40);}beep(400,.08);};
  /* clone: hold Ctrl and click the source, then paint the copy somewhere else */
  G.clone=async(w,[sx,sy],[dx,dy],{area=34,r=12,ms=2200,turns}={})=>{cross.style.opacity=1;cross.style.transform=`translate(${sx-11}px,${sy-11}px)`;
    cross.animate([{transform:`translate(${sx-11}px,${sy-11}px) scale(2.2)`},{transform:`translate(${sx-11}px,${sy-11}px) scale(1)`}],{duration:500});beep(900,.06);await nap(w,700);
    const path=gpSpiral(dx,dy,area,turns||Math.max(3,Math.round(area/(r*.7))),140);
    await G.stroke(w,path,{tool:'clone',size:r*2,off:[sx-dx,sy-dy],ms});G.hideCur();};
  /* heal: the spot is blended with the clean pixels around it */
  G.heal=async(w,hx,hy,r,{ms=1800}={})=>{const T=gpHealTarget(G,hx,hy,r),bs=Math.max(10,r*.9);
    const p=[...gpSpiral(hx,hy,r*1.05,3,90),...gpSpiral(hx,hy,r*.6,2,60),...gpSpiral(hx,hy,r*1.05,3,90)];
    await G.stroke(w,p,{tool:'heal',size:bs*2,target:T,ms});};
  /* filters: the effect sweeps across the picture */
  G.filter=async(w,kind,{ms=1300}={})=>{const img=G.snap(),src=new Uint8ClampedArray(img.data),out=gpFx(kind,src,W,H);
    if(G.sel)for(let i=0;i<W*H;i++)if(!G.sel[i]){const j=i*4;out[j]=src[j];out[j+1]=src[j+1];out[j+2]=src[j+2];}
    img.data.set(out);const scan=mk('gp-scan',`left:0;height:${H}px`,'',wrap),n=Math.max(2,Math.round(ms/40));let px0=0;
    for(let f=1;f<=n;f++){const px1=Math.round(W*f/n);G.ctx.putImageData(img,0,0,px0,0,px1-px0,H);px0=px1;scan.style.transform=`translateX(${px1-2}px)`;await nap(w,40);}
    scan.remove();beep(800,.08);};
  /* shear: the whole picture slants (a transform tool: it changes the shape, it adds no paint) */
  G.shear=async(w,k=.35,{ms=1300}={})=>{const src=document.createElement('canvas');src.width=W;src.height=H;src.getContext('2d').drawImage(cv,0,0);
    const pc=document.createElement('canvas');pc.width=pc.height=16;const p=pc.getContext('2d');p.fillStyle='#999';p.fillRect(0,0,16,16);p.fillStyle='#666';p.fillRect(0,0,8,8);p.fillRect(8,8,8,8);
    const pat=G.ctx.createPattern(pc,'repeat'),n=Math.max(2,Math.round(ms/40));
    for(let f=1;f<=n;f++){const kk=k*f/n,c=G.ctx;c.save();c.fillStyle=pat;c.fillRect(0,0,W,H);c.setTransform(1,0,kk,1,-kk*H/2,0);c.drawImage(src,0,0);c.restore();
      G.cur(W-8-kk*H/2,6,'shear');await nap(w,40);}G.hideCur();beep(600,.08);};
  /* magnifier with hard pixels (stage coordinates) */
  G.zoom=(zx,zy,zw,zh,{x:ex=0,y:ey=0,scale=6,label,parent:pp}={})=>{const c=document.createElement('canvas');c.width=zw*scale;c.height=zh*scale;
    const el=mk('gp-zoom',`left:${ex}px;top:${ey}px`,label?`<div class="lb">${label}</div>`:'',pp);el.appendChild(c);const zc=c.getContext('2d');
    el.refresh=()=>{zc.imageSmoothingEnabled=false;zc.clearRect(0,0,c.width,c.height);zc.drawImage(cv,zx,zy,zw,zh,0,0,zw*scale,zh*scale);};el.refresh();
    el.mark=mk('gp-zmark',`left:${zx-2}px;top:${zy-2}px;width:${zw+4}px;height:${zh+4}px;box-sizing:border-box`,'',wrap);return el;};

  /* a menu opened from the menu bar: rows are returned so the lesson can make them tappable */
  G.dropdown=(name,items,{wd=170}={})=>{const menuBar=Wn.el.querySelector('.cw-menu'),m=[...menuBar.children].find(s=>s.textContent===name);
    m.style.cssText='background:#0e7490;color:#fff;border-radius:4px;padding:0 4px;margin:0 -4px';
    const d=mk('gp-drop',`left:${menuBar.offsetLeft+m.offsetLeft-4}px;top:${menuBar.offsetTop+menuBar.offsetHeight}px;width:${wd}px`,'',Wn.el);
    const rows=items.map(t=>{const r=document.createElement('div');r.className='gp-di';r.innerHTML=t;d.appendChild(r);return r;});
    an(d,[{opacity:0,transform:'translateY(-8px)'},{opacity:1,transform:'none'}],{duration:300});beep(800,.04);
    d.close=()=>{d.remove();m.style.cssText='';};return{el:d,rows};};

  /* the student's turn */
  G.pick=async(w,id,{hint=2600,onWrong}={})=>{let done=false;const b=G.btn[id],old=G.onTool;
    G.onTool=t=>{if(t===id)done=true;else{beep(250,.12);if(onWrong)onWrong(t);}};
    const t0=Date.now();window.AUTOPLAY=()=>{G.select(id);done=true;};
    await w.until(()=>{if(Date.now()-t0>hint)b.classList.add('want');return done;});
    window.AUTOPLAY=null;b.classList.remove('want');G.onTool=old;};
  G.tap=async(w,{auto=[W/2,H/2],ok,miss,target=false,tr=26}={})=>{let p=null;
    const t=target?mk('gp-target',`left:${auto[0]-tr}px;top:${auto[1]-tr}px;width:${tr*2}px;height:${tr*2}px`,'',wrap):null;
    if(t)loop(t,[{transform:'scale(.8)',opacity:.6},{transform:'scale(1.15)',opacity:1}],600,{direction:'alternate'});
    const h=e=>{const q=pos(e);if(ok&&!ok(q[0],q[1])){beep(250,.12);if(miss)miss(q);return;}p=q;};
    wrap.addEventListener('click',h);wrap.style.cursor='crosshair';window.AUTOPLAY=()=>{p=auto.slice();};
    await w.until(()=>p);window.AUTOPLAY=null;wrap.removeEventListener('click',h);wrap.style.cursor='';if(t)t.remove();return p;};
  G.freePaint=(tool,o={})=>{o=Object.assign({size:16},o);const sp=gpSpacing(tool,o);let S=null,last=null;
    const down=e=>{e.preventDefault();S=gpBegin(G,tool,o);last=pos(e);gpApply(G,S,last);gpFlush(G,S);G.drew++;try{wrap.setPointerCapture(e.pointerId);}catch(x){}};
    const move=e=>{if(!S)return;e.preventDefault();const p=pos(e),sm=gpResample([last,p],sp);if(sm.length<2)return;for(const q of sm.slice(1))gpApply(G,S,q);last=sm[sm.length-1];gpFlush(G,S);};
    const up=()=>{S=null;};
    wrap.addEventListener('pointerdown',down);wrap.addEventListener('pointermove',move);wrap.addEventListener('pointerup',up);wrap.addEventListener('pointercancel',up);wrap.style.cursor='crosshair';
    return()=>{wrap.removeEventListener('pointerdown',down);wrap.removeEventListener('pointermove',move);wrap.removeEventListener('pointerup',up);wrap.removeEventListener('pointercancel',up);wrap.style.cursor='';};};
  G.pic('blank');
  return G;}
