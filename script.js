(()=>{'use strict';
const app=document.getElementById('app'),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const suits=['dots','bamboo','characters'];const types=[];for(const suit of suits)for(let n=1;n<=9;n++)types.push({id:suit+n,suit,n});for(const [id,label] of [['east','E'],['south','S'],['west','W'],['north','N']])types.push({id,suit:'wind',label});for(const [id,label] of [['red','中'],['green','發'],['white','□']])types.push({id,suit:'dragon',label});types.push({id:'flower',suit:'flower',label:'✿'},{id:'season',suit:'flower',label:'❀'});
const levels=[{name:'Lotus Path',subtitle:'A classic layered warm-up',layout:[{rows:6,cols:8,x:2,y:1},{rows:4,cols:6,x:3,y:2}],tiles:72},{name:'Jade Terrace',subtitle:'More layers, more strategy',layout:[{rows:6,cols:10,x:1,y:1},{rows:4,cols:8,x:2,y:2},{rows:2,cols:2,x:5,y:3}],tiles:96},{name:'Grand Garden',subtitle:'The full 144-tile Mahjong challenge',layout:[{rows:8,cols:12,x:0,y:0},{rows:4,cols:10,x:1,y:2},{rows:2,cols:4,x:4,y:3}],tiles:144}];
let unlocked=Number(localStorage.getItem('bloom-classic-unlocked')||1);let state={screen:'home',level:0,tiles:[],selected:null,history:[],matches:0,message:'',hints:[],modal:null};
function shuffle(a){for(let i=a.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function positions(level){let arr=[];level.layout.forEach((l,layer)=>{for(let row=0;row<l.rows;row++)for(let col=0;col<l.cols;col++)arr.push({id:arr.length,row:row+l.y,col:col+l.x,layer,removed:false,type:null});});return arr;}
function free(t,board){if(t.removed)return false;const current=board.filter(x=>!x.removed&&x.id!==t.id);if(current.some(x=>x.layer>t.layer&&Math.abs(x.row-t.row)<.51&&Math.abs(x.col-t.col)<.51))return false;const l=current.some(x=>x.layer===t.layer&&x.row===t.row&&x.col===t.col-1),r=current.some(x=>x.layer===t.layer&&x.row===t.row&&x.col===t.col+1);return !l||!r;}
function freePairs(board){let a=board.filter(t=>free(t,board)),result=[];for(let i=0;i<a.length;i++)for(let j=i+1;j<a.length;j++)if(a[i].type===a[j].type)result.push([a[i],a[j]]);return result;}
function buildBoard(levelIndex){const cfg=levels[levelIndex],count=cfg.tiles/2;for(let attempt=0;attempt<80;attempt++){let board=positions(cfg),work=board.map(x=>({...x})),pairs=[];while(pairs.length<count){const open=work.filter(t=>free(t,work));if(open.length<2)break;let choices=[];for(let i=0;i<open.length;i++)for(let j=i+1;j<open.length;j++)choices.push([open[i].id,open[j].id]);let pick=choices[Math.floor(Math.random()*choices.length)];pairs.push(pick);for(const id of pick)work[id].removed=true;}if(pairs.length!==count)continue;
// Each pair belongs to a traditional tile type. Four copies max per type, exactly like a Mahjong set.
let pool=shuffle(types.slice()).slice(0,Math.ceil(count/2)).flatMap(x=>[x.id,x.id]).slice(0,count);shuffle(pool);pairs.forEach((pair,i)=>{board[pair[0]].type=pool[i];board[pair[1]].type=pool[i];});if(freePairs(board).length)return board;}throw Error('Unable to generate this board');}
function svgFace(id){let type=types.find(x=>x.id===id);if(!type)return '';let out='<svg viewBox="0 0 44 54" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">';const circ=(x,y,r,color)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" stroke="#365b51" stroke-width=".7"/>`;
if(type.suit==='dots'){const coords=[[22,26],[14,15],[30,36],[12,12],[32,12],[12,40],[32,40],[22,25],[14,26],[30,26]];let pts=type.n===1?[[22,26]]:type.n===2?[[13,13],[31,39]]:type.n===3?[[12,12],[22,26],[32,40]]:type.n===4?[[12,12],[32,12],[12,40],[32,40]]:type.n===5?[[12,12],[32,12],[22,26],[12,40],[32,40]]:type.n===6?[[12,10],[32,10],[12,26],[32,26],[12,42],[32,42]]:type.n===7?[[12,10],[32,10],[12,26],[32,26],[12,42],[32,42],[22,26]]:type.n===8?[[12,10],[32,10],[12,21],[32,21],[12,32],[32,32],[12,43],[32,43]]:[[10,10],[22,10],[34,10],[10,26],[22,26],[34,26],[10,42],[22,42],[34,42]];pts.forEach(([x,y],i)=>out+=circ(x,y,type.n===1?9:4.9,['#a94744','#447e9a','#538566'][i%3]));}
else if(type.suit==='bamboo'){let pts=[];for(let i=0;i<type.n;i++){let c=i%3,r=Math.floor(i/3),rows=Math.ceil(type.n/3);pts.push([12+c*10,26+(r-(rows-1)/2)*15]);}pts.forEach(([x,y],i)=>{out+=`<rect x="${x-2.6}" y="${y-7}" width="5.2" height="14" rx="2.5" fill="${i%2?'#4c9a76':'#448a9b'}"/><path d="M${x} ${y-7}v14" stroke="#f9eee2" stroke-width="1.1"/>`;});}
else if(type.suit==='characters'){
// Illustrated botanical suit: a distinct arrangement of petals for 1–9.
const n=type.n, columns=n<=3?n:n<=6?3:3, rows=Math.ceil(n/columns);
for(let i=0;i<n;i++){const col=i%columns,row=Math.floor(i/columns);const px=22+(col-(Math.min(columns,n)-1)/2)*12,py=27+(row-(rows-1)/2)*15;
out+=`<path d="M${px} ${py-6} Q${px+6} ${py} ${px} ${py+6} Q${px-6} ${py} ${px} ${py-6}Z" fill="${i%2?'#d38d9c':'#c56e77'}" stroke="#a75465" stroke-width=".8"/><circle cx="${px}" cy="${py}" r="1.7" fill="#ffe9ae"/>`;}
}
else if(type.suit==='wind'){
// Four scenic/ornamental picture tiles with no text.
const theme=type.id;
if(theme==='east'){
// Cherry blossoms.
for(const [cx,cy,sc] of [[18,20,1],[29,34,.8]]) {
out+=`<g transform="translate(${cx} ${cy}) scale(${sc})">`;
for(let i=0;i<5;i++){const a=i*72;out+=`<ellipse cx="0" cy="-7.5" rx="5.1" ry="8" fill="#e797ac" stroke="#c8738c" stroke-width=".8" transform="rotate(${a})"/>`;}
out+=`<circle r="3.2" fill="#f3c95d"/></g>`;}
out+=`<path d="M7 48 Q18 32 36 15" stroke="#8b6456" stroke-width="2.4" fill="none"/>`;
} else if(theme==='south'){
// Mount Fuji and sunrise.
out+=`<circle cx="32" cy="15" r="8" fill="#efbe71"/>`;
out+=`<path d="M3 44 L22 12 L41 44 Z" fill="#6895a0" stroke="#477780" stroke-width="1.4"/>`;
out+=`<path d="M15 24 L22 12 L29 24 L25 22 L22 25 L18 22 Z" fill="#fff9e9"/>`;
out+=`<path d="M4 45 Q15 40 25 45 T43 45" stroke="#7eb8a5" stroke-width="2" fill="none"/>`;
} else if(theme==='west'){
// Traditional torii gate.
out+=`<path d="M4 14 Q22 19 40 14 L40 19 Q22 23 4 19 Z" fill="#b9514c"/>`;
out+=`<path d="M8 24 H36" stroke="#ae5148" stroke-width="5" stroke-linecap="round"/>`;
out+=`<rect x="11" y="21" width="5" height="28" fill="#bc6151"/><rect x="28" y="21" width="5" height="28" fill="#bc6151"/>`;
out+=`<path d="M12 45 H32" stroke="#db9a72" stroke-width="3"/>`;
} else {
// Pagoda.
out+=`<path d="M11 16 H33" stroke="#7a658d" stroke-width="2.2"/>`;
out+=`<path d="M8 18 L22 10 L36 18 Z" fill="#9b89c9" stroke="#74619f" stroke-width="1.2"/>`;
out+=`<path d="M10 28 L22 20 L34 28 Z" fill="#b9a8ea" stroke="#7867a7" stroke-width="1.2"/>`;
out+=`<rect x="15" y="28" width="14" height="13" fill="#f0e5cf" stroke="#88795f" stroke-width="1"/>`;
out+=`<path d="M8 42 H36" stroke="#8b7263" stroke-width="2.4" stroke-linecap="round"/>`;
out+=`<path d="M14 46 H30" stroke="#8b7263" stroke-width="2.4" stroke-linecap="round"/>`;
}
}
else if(type.suit==='dragon'){
// Three decorative picture tiles to replace text dragons.
if(type.id==='red'){
// Lantern.
out+=`<path d="M22 8 V14" stroke="#8d5d44" stroke-width="1.8"/>`;
out+=`<path d="M14 16 Q22 12 30 16 L29 37 Q22 43 15 37 Z" fill="#d9776a" stroke="#b55e54" stroke-width="1.6"/>`;
out+=`<path d="M16 21 H28 M16 27 H28 M17 33 H27" stroke="#f8e2c0" stroke-width="1.4"/>`;
out+=`<path d="M22 38 V45" stroke="#8d5d44" stroke-width="1.6"/>`;
out+=`<path d="M18 45 H26" stroke="#c89b55" stroke-width="2" stroke-linecap="round"/>`;
}else if(type.id==='green'){
// Chrysanthemum flower.
for(let i=0;i<12;i++){const a=i*30;out+=`<ellipse cx="22" cy="27" rx="4.4" ry="12" fill="#89b87a" stroke="#5c8c56" stroke-width=".8" transform="rotate(${a} 22 27)"/>`;}
out+=`<circle cx="22" cy="27" r="5" fill="#f0d56b" stroke="#c7a74a" stroke-width="1"/>`;
}else{
// Folding fan.
out+=`<path d="M22 44 L4 21 Q22 4 40 21 Z" fill="#7da9b6" stroke="#577e94" stroke-width="1.5"/>`;
for(let i=0;i<7;i++){let x=6+i*5.2;out+=`<path d="M22 44 L${x} ${19-Math.sin(i/6*Math.PI)*9}" stroke="#e9e2d0" stroke-width=".9"/>`;}
out+=`<circle cx="22" cy="44" r="3" fill="#a76a59"/>`;
}
}
else {
// Flower and season tiles use petal and sun icons, not typographic glyphs.
if(type.id==='flower'){for(let i=0;i<6;i++){const a=i*Math.PI/3;out+=`<ellipse cx="${22+10*Math.cos(a)}" cy="${27+10*Math.sin(a)}" rx="7" ry="9" fill="#d98ca2"/>`;}out+=circ(22,27,6,'#f5c75e');}
else {out+=`<circle cx="22" cy="27" r="11" fill="#f1ca69"/>`;for(let i=0;i<8;i++){const a=i*Math.PI/4;out+=`<path d="M${22+15*Math.cos(a)} ${27+15*Math.sin(a)} L${22+22*Math.cos(a)} ${27+22*Math.sin(a)}" stroke="#ac9a49" stroke-width="3" stroke-linecap="round"/>`;}}
}
return out+'</svg>';}

// Original calm Japanese-inspired ambient soundtrack; generated offline with Web Audio.
const music={enabled:localStorage.getItem('bloom-music')!=='off',ctx:null,timer:null,next:0,step:0,master:null};
const melody=[0,null,null,4,null,null,7,null,9,null,null,7,null,4,null,null,
              2,null,null,4,null,7,null,null,9,null,7,null,4,null,null,null,
              0,null,2,null,null,4,null,7,null,null,4,null,2,null,null,null];
const scale=[0,2,5,7,9,12,14,17,19,21]; // peaceful pentatonic tones
function softTone(freq,time,vel=.048,length=2.9){
 const ctx=music.ctx;if(!ctx)return;
 const osc=ctx.createOscillator(),gain=ctx.createGain(),filter=ctx.createBiquadFilter();
 osc.type='sine';osc.frequency.setValueAtTime(freq,time);
 filter.type='lowpass';filter.frequency.setValueAtTime(850,time);filter.Q.value=.5;
 gain.gain.setValueAtTime(.0001,time);
 gain.gain.linearRampToValueAtTime(vel,time+.19);
 gain.gain.exponentialRampToValueAtTime(.0001,time+length);
 osc.connect(filter);filter.connect(gain);gain.connect(music.master);
 osc.start(time);osc.stop(time+length+.05);
}
function scheduleMusic(){
 if(!music.ctx||!music.enabled)return;
 while(music.next<music.ctx.currentTime+.32){
   const n=melody[music.step%melody.length];
   if(n!==null)softTone(196*Math.pow(2,scale[n%10]/12),music.next,.043,2.6);
   if(music.step%16===0) {
     softTone(98,music.next,.018,6.0);
     softTone(147,music.next+.18,.012,5.5);
   }
   music.step++;music.next+=.75;
 }
}
function startMusic(){if(!music.enabled)return;
 try{
 if(!music.ctx){const AudioCtor=window.AudioContext||window.webkitAudioContext;if(!AudioCtor)return;
 music.ctx=new AudioCtor();music.master=music.ctx.createGain();music.master.gain.value=.48;music.master.connect(music.ctx.destination);
 music.next=music.ctx.currentTime+.08;}
 music.ctx.resume();if(!music.timer)music.timer=setInterval(scheduleMusic,110);
 }catch(e){console.warn('Audio unavailable',e);}
}
function pauseMusic(){if(music.timer){clearInterval(music.timer);music.timer=null;}if(music.ctx){music.ctx.suspend();music.next=music.ctx.currentTime+.1;}}
function musicButton(){return `<button class="music-toggle" data-action="music" aria-label="${music.enabled?'Mute':'Play'} background music" aria-pressed="${music.enabled}">${music.enabled?'♫ Music On':'♪ Music Off'}</button>`;}
function header(right){return `<div class="top"><div class="brand">BLOOM <span>✿</span></div><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">${musicButton()}<div class="pill">${right}</div></div></div>`;}
function home(){app.innerHTML=`<main class="screen">${header('Classic Mahjong · Big boards')}<div class="start"><div class="hero-symbol">🀄</div><h1>BLOOM Mahjong</h1><p class="subtitle">Classic Mahjong-style picture tiles, layered layouts, and calm garden progression. Clear matching free pairs from a full-size board.</p><button class="btn" data-action="levels">Choose a board →</button><button class="btn secondary" data-action="rules">How to play</button></div></main>`;}
function choose(){app.innerHTML=`<main class="screen">${header('3 handmade board shapes')}<div style="margin-top:35px"><h1>Choose your board</h1><p class="subtitle">Larger layered puzzles, up to a full 144-tile board.</p></div><div class="level-grid">${levels.map((l,i)=>`<button class="level" data-action="play" data-level="${i}" ${i>=unlocked?'disabled':''}><span class="num">0${i+1}</span><strong>${l.name}</strong><small>${l.subtitle}</small><span class="pill">${l.tiles} tiles · ${l.tiles/2} pairs ${i>=unlocked?'🔒':'→'}</span></button>`).join('')}</div><p class="subtitle">Complete a board to unlock the next one.</p><button class="btn secondary" data-action="home">← Back</button></main>`;}
function begin(n){state={screen:'game',level:n,tiles:buildBoard(n),selected:null,history:[],matches:0,message:'Select two matching free tiles.',hints:[],modal:null};render();}
function tilesHTML(){return state.tiles.filter(t=>!t.removed).sort((a,b)=>a.layer-b.layer).map(t=>{let isfree=free(t,state.tiles);let x=22+t.col*52+t.layer*4,y=10+t.row*65-t.layer*5;return `<button class="tile ${isfree?'free':'blocked'} ${state.selected===t.id?'selected':''} ${state.hints.includes(t.id)?'hint':''}" style="left:${x}px;top:${y}px;z-index:${t.layer+1}" data-action="tile" data-id="${t.id}" ${isfree?'':'disabled'} aria-label="${t.type}, ${isfree?'free':'blocked'} tile">${svgFace(t.type)}</button>`;}).join('');}
function game(){let lvl=levels[state.level],remaining=state.tiles.filter(t=>!t.removed).length,percent=100*(1-remaining/lvl.tiles);let width=22+12*52+65,height=10+8*65+90;app.innerHTML=`<main class="screen"><div class="game-head"><button class="btn secondary" data-action="levels">← Levels</button>${musicButton()}<div><strong>${lvl.name}</strong><div class="helper">Level ${state.level+1} · ${lvl.tiles} tiles</div></div><button class="btn light" data-action="rules">Rules ?</button></div><div class="stats"><span>${remaining} tiles left</span><span>${state.matches} / ${lvl.tiles/2} pairs matched</span><span>${Math.round(percent)}% cleared</span></div><div class="progress"><div style="width:${percent}%"></div></div><div class="garden">${['🌱','🌷','🌼','🌸','🦋'].map((v,i)=>`<span class="plant ${percent>=(i+1)*20?'on':''}">${v}</span>`).join('')}</div><div class="board-head"><strong>Classic layered Mahjong board</strong><span>Swipe sideways to view the whole board ↔</span></div><div class="board-viewport" id="viewport"><div class="board" style="width:${width}px;height:${height}px">${tilesHTML()}</div></div><div class="notice" aria-live="polite">${esc(state.message)}</div><div class="toolbar"><button class="btn secondary" data-action="hint">💡 Hint</button><button class="btn secondary" data-action="undo" ${state.history.length?'':'disabled'}>↶ Undo</button><button class="btn secondary" data-action="restart">⟳ Restart</button></div><p class="helper">Free = nothing on top and at least one open left or right edge.</p></main>${state.modal?modal():''}`;}
function modal(){let m=state.modal;if(m==='win')return `<div class="modal"><div class="dialog"><div style="font-size:68px">🌺</div><h2>Garden complete!</h2><p>You cleared ${levels[state.level].tiles} Mahjong tiles and brought the garden to life.</p><button class="btn" data-action="${state.level===2?'levels':'next'}">${state.level===2?'All boards complete!':'Next board →'}</button><button class="btn secondary" data-action="replay">Play again</button></div></div>`;if(m==='stuck')return `<div class="modal"><div class="dialog"><h2>No available pairs</h2><p>Even a solvable Mahjong board can become blocked after a different choice. Undo to find another path.</p><button class="btn" data-action="undo">Undo last match</button><button class="btn secondary" data-action="restart">Restart</button></div></div>`;return `<div class="modal"><div class="dialog"><h2>How to play</h2><div class="tips">1. Match two identical Mahjong tiles.<br>2. Both must be exposed and have at least one open side.<br>3. Tiles stacked above other tiles block them.<br>4. Swipe the board horizontally on small screens.<br>5. Use Hint and Undo if needed.</div><button class="btn" data-action="close">Got it!</button></div></div>`;}
function render(){if(state.screen==='home')home();else if(state.screen==='levels')choose();else game();if(state.modal&&state.screen!=='game')app.insertAdjacentHTML('beforeend',modal());}
function pickTile(id){let t=state.tiles[id];if(!t||!free(t,state.tiles))return;state.hints=[];if(state.selected===id){state.selected=null;state.message='Tile deselected.';render();return;}if(state.selected===null){state.selected=id;state.message='Find the identical free tile.';render();return;}let a=state.tiles[state.selected];if(a.type!==t.type){state.selected=id;state.message='Different tiles. Try again.';render();return;}state.history.push([a.id,t.id]);a.removed=t.removed=true;state.selected=null;state.matches++;state.message='Beautiful match! ✿';if(state.matches===levels[state.level].tiles/2){unlocked=Math.max(unlocked,state.level+2);localStorage.setItem('bloom-classic-unlocked',String(unlocked));state.modal='win';}else if(!freePairs(state.tiles).length)state.modal='stuck';render();}
function undo(){if(!state.history.length)return;let pair=state.history.pop();pair.forEach(id=>state.tiles[id].removed=false);state.matches--;state.modal=null;state.selected=null;state.hints=[];state.message='Last pair restored.';render();}
app.addEventListener('click',e=>{let b=e.target.closest('[data-action]');if(!b)return;let a=b.dataset.action;if(a==='music'){music.enabled=!music.enabled;localStorage.setItem('bloom-music',music.enabled?'on':'off');if(music.enabled)startMusic();else pauseMusic();render();return;}if(a==='tile'){let vp=document.getElementById('viewport'),scroll=vp?.scrollLeft||0;pickTile(Number(b.dataset.id));if(vp)document.getElementById('viewport').scrollLeft=scroll;}else if(a==='home'){state.screen='home';state.modal=null;render();}else if(a==='levels'){state.screen='levels';state.modal=null;render();}else if(a==='play'){startMusic();begin(Number(b.dataset.level));}else if(a==='rules'){state.modal='rules';render();}else if(a==='close'){state.modal=null;render();}else if(a==='hint'){let pair=freePairs(state.tiles)[0];state.hints=pair?pair.map(x=>x.id):[];state.message=pair?'Highlighted tiles match.':'No free pair found.';render();}else if(a==='undo')undo();else if(a==='restart'||a==='replay')begin(state.level);else if(a==='next'){startMusic();begin(state.level+1);}});render();
window.__BLOOM_TEST__={levels,positions,buildBoard,free,freePairs,types};
})();
