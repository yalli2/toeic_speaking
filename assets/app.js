/* TOEIC Speaking interactive study site — shared engine */
(function(){
'use strict';

/* ---------- helpers ---------- */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const el=(tag,attrs={},html)=>{const e=document.createElement(tag);for(const k in attrs){if(k==='class')e.className=attrs[k];else if(k.startsWith('on'))e.addEventListener(k.slice(2),attrs[k]);else e.setAttribute(k,attrs[k]);}if(html!=null)e.innerHTML=html;return e;};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function fnv(str){let h=0x811c9dc5;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0;}return ('0000000'+h.toString(16)).slice(-8);}
const strip=s=>String(s).replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
const norm=s=>strip(s).toLowerCase().replace(/[’']/g,"'").replace(/[^a-z0-9' ]+/g,' ').replace(/\s+/g,' ').trim();
const words=s=>norm(s).split(' ').filter(Boolean);
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
function toast(msg){let t=$('.toast');if(!t){t=el('div',{class:'toast'});document.body.appendChild(t);}t.textContent=msg;t.classList.add('show');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('show'),2200);}

/* ---------- audio ---------- */
const VOICE_NAMES={F:'미국 여성',M:'미국 남성',F2:'미국 여성 2',M2:'미국 남성 2',UKF:'영국 여성',UKM:'영국 남성'};
const aclean=t=>strip(t).replace(/[↗↘]/g,'').replace(/\s\/(?=\s)/g,'').replace(/\s+/g,' ').replace(/\s+([,.?!])/g,'$1').trim();
const audioKey=(text,v)=>fnv((v||'F')+'|'+aclean(text));
let cur=null,curBtn=null;
function stopAudio(){if(cur){cur.pause();cur=null;}if('speechSynthesis' in window)speechSynthesis.cancel();if(curBtn){curBtn.classList.remove('playing');curBtn.innerHTML='▶';curBtn=null;}}
function bestVoice(v){
  const vs=('speechSynthesis' in window)?speechSynthesis.getVoices().filter(x=>/^en[-_]/i.test(x.lang)):[];
  const uk=/^UK/.test(v||''), male=/M/.test((v||'').replace('UK',''));
  const pref=[/natural/i,/online/i,/google/i,/samantha|ava|allison|aria|jenny|guy|daniel|serena/i];
  let pool=vs.filter(x=>uk?/GB/i.test(x.lang):/US/i.test(x.lang)); if(!pool.length)pool=vs;
  for(const p of pref){const m=pool.filter(x=>p.test(x.name));if(m.length){const g=m.find(x=>male?/male|guy|daniel|david|mark|ryan|andrew/i.test(x.name):!/male|guy|david|mark/i.test(x.name));return g||m[0];}}
  return pool[0]||null;
}
function speakFallback(text,v,done){
  if(!('speechSynthesis' in window)){done&&done();return;}
  const u=new SpeechSynthesisUtterance(aclean(text));const bv=bestVoice(v);if(bv)u.voice=bv;u.lang=bv?bv.lang:'en-US';u.rate=0.95;
  u.onend=()=>done&&done();u.onerror=()=>done&&done();speechSynthesis.speak(u);
}
function play(text,v,btn,done){
  const same=btn&&btn===curBtn; stopAudio(); if(same)return;
  if(btn){curBtn=btn;btn.classList.add('playing');btn.innerHTML='■';}
  const fin=()=>{if(btn&&curBtn===btn){btn.classList.remove('playing');btn.innerHTML='▶';curBtn=null;}cur=null;done&&done();};
  const a=new Audio('audio/'+audioKey(text,v)+'.mp3'); cur=a;
  a.onended=fin; a.onerror=()=>{if(cur===a){cur=null;speakFallback(text,v,fin);}};
  a.play().catch(()=>{if(cur===a){cur=null;speakFallback(text,v,fin);}});
}
function playBtn(text,v,title){const b=el('button',{class:'play',title:title||('듣기 · '+(VOICE_NAMES[v||'F']||'')),type:'button'},'▶');b.onclick=()=>play(text,v,b);return b;}
function beep(f=880,d=.18){try{const c=beep.c||(beep.c=new (window.AudioContext||window.webkitAudioContext)());const o=c.createOscillator(),g=c.createGain();o.frequency.value=f;o.connect(g);g.connect(c.destination);g.gain.setValueAtTime(.18,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+d);o.start();o.stop(c.currentTime+d);}catch(e){}}

/* ---------- score store ---------- */
const CHID=(window.CH&&window.CH.id)||'x';
const store={
  all(){try{return JSON.parse(localStorage.getItem('ts_scores')||'{}');}catch(e){return {};}},
  set(ch,bid,e,m){const a=store.all();a[ch]=a[ch]||{};a[ch][bid]={e,m,t:Date.now()};try{localStorage.setItem('ts_scores',JSON.stringify(a));}catch(x){}},
  ch(ch){return store.all()[ch]||{};}
};
const blocks=[]; // {id,sec,max,earned}
function registerBlock(id,sec,max){const b={id,sec,max,earned:null};const saved=store.ch(CHID)[id];if(saved)b.earned=saved.e;blocks.push(b);return b;}
function setScore(b,e){b.earned=Math.round(e*10)/10;store.set(CHID,b.id,b.earned,b.max);refreshScore();}
function refreshScore(){
  let E=0,M=0;const secs={};
  blocks.forEach(b=>{M+=b.max;secs[b.sec]=secs[b.sec]||{e:0,m:0,done:0,n:0};secs[b.sec].m+=b.max;secs[b.sec].n++;if(b.earned!=null){E+=b.earned;secs[b.sec].e+=b.earned;secs[b.sec].done++;}});
  const done=blocks.filter(b=>b.earned!=null).length;
  const big=$('#chScore'),sm=$('#chScoreSm'),pg=$('#chProg');
  if(big){const att=blocks.filter(b=>b.earned!=null).reduce((s,b)=>s+b.max,0);big.textContent=att?Math.round(E/att*100)+'점':'–';}
  if(sm)sm.textContent=`완료 ${done}/${blocks.length} 활동 · 획득 ${Math.round(E*10)/10} / ${M}`;
  if(pg)pg.style.width=(blocks.length?done/blocks.length*100:0)+'%';
  for(const s in secs){const a=$(`.side a[data-sec="${s}"] small`);if(a)a.textContent=secs[s].done?`${secs[s].done}/${secs[s].n}`:'';}
}

/* ---------- speech recognition / recording ---------- */
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
function makeRecorder(){
  let rec=null,chunks=[],stream=null,recog=null,finalTxt='',interim='';
  return {
    async start(onText){
      finalTxt='';interim='';
      try{stream=await navigator.mediaDevices.getUserMedia({audio:true});rec=new MediaRecorder(stream);chunks=[];rec.ondataavailable=e=>chunks.push(e.data);rec.start();}catch(e){stream=null;rec=null;}
      if(SR){try{recog=new SR();recog.lang='en-US';recog.continuous=true;recog.interimResults=true;
        recog.onresult=ev=>{interim='';for(let i=ev.resultIndex;i<ev.results.length;i++){const r=ev.results[i];if(r.isFinal)finalTxt+=r[0].transcript+' ';else interim+=r[0].transcript;}onText&&onText((finalTxt+interim).trim());};
        recog.onend=()=>{if(recog&&recog._keep){try{recog.start();}catch(e){}}};
        recog._keep=true;recog.start();}catch(e){recog=null;}}
      return {mic:!!rec,sr:!!recog};
    },
    stop(){return new Promise(res=>{
      if(recog){recog._keep=false;try{recog.stop();}catch(e){}}
      const finish=url=>{if(stream)stream.getTracks().forEach(t=>t.stop());setTimeout(()=>res({text:(finalTxt+' '+interim).trim(),url}),700);};
      if(rec&&rec.state!=='inactive'){rec.onstop=()=>finish(URL.createObjectURL(new Blob(chunks,{type:rec.mimeType||'audio/webm'})));rec.stop();}else finish(null);
    });}
  };
}

/* ---------- scoring for speech ---------- */
function lcsAlign(ref,hyp){ // returns boolean array for ref words matched
  const n=ref.length,m=hyp.length,dp=Array.from({length:n+1},()=>new Uint16Array(m+1));
  for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)dp[i][j]=ref[i]===hyp[j]?dp[i+1][j+1]+1:Math.max(dp[i+1][j],dp[i][j+1]);
  const ok=new Array(n).fill(false);let i=0,j=0;while(i<n&&j<m){if(ref[i]===hyp[j]){ok[i]=true;i++;j++;}else if(dp[i+1][j]>=dp[i][j+1])i++;else j++;}
  return ok;
}
const NUMW={'0':'zero','1':'one','2':'two','3':'three','4':'four','5':'five','6':'six','7':'seven','8':'eight','9':'nine','10':'ten','11':'eleven','12':'twelve','15':'fifteen','20':'twenty','30':'thirty'};
const canon=w=>NUMW[w]||w.replace(/'s$/,'');
function readScore(script,said){
  const ref=words(script).map(canon),hyp=words(said).map(canon);
  if(!hyp.length)return {pct:0,ok:ref.map(()=>false)};
  const ok=lcsAlign(ref,hyp);return {pct:ok.filter(Boolean).length/ref.length,ok};
}
function kwScore(kws,said,resp){
  const t=' '+norm(said)+' ';const hits=(kws||[]).map(k=>k.split('|').some(a=>t.includes(' '+norm(a)+' ')||t.includes(' '+norm(a))));
  const content=kws&&kws.length?hits.filter(Boolean).length/kws.length:1;
  const wc=words(said).length,target=Math.max(12,Math.round(resp*1.5));
  const len=Math.min(1,wc/target);
  return {pct:wc?0.6*content+0.4*len:0,hits,wc,target};
}

/* ---------- speaking task widget ---------- */
function speakingTask(opts){
  // opts: {prep,resp,scale,mode:'read'|'kw',script,kws,model,modelKo,modelV,onScore,questionAudio:{text,v}|null,passageEl, beforeStart}
  const box=el('div');
  const timer=el('div',{class:'timer'});
  const phase=el('span',{class:'phase'},'대기');const clock=el('span',{class:'clock'},'0:00');const tb=el('div',{class:'tbar'},'<i></i>');
  timer.append(phase,clock,tb);
  const btnStart=el('button',{class:'btn',type:'button'},`▶ 시작 (준비 ${opts.prep}초 · 답변 ${opts.resp}초)`);
  const btnStop=el('button',{class:'btn red sm',type:'button',style:'display:none'},'■ 답변 종료');
  const btnMy=el('button',{class:'btn ghost sm',type:'button',style:'display:none'},'🎧 내 녹음 듣기');
  const btnModel=el('button',{class:'btn ghost sm',type:'button'},'💡 모범답안 보기');
  const bar=el('div',{class:'bar',style:'justify-content:flex-start'});bar.append(btnStart,btnStop,btnMy,btnModel);
  const ta=el('textarea',{class:'transcript',placeholder:'답변이 자동으로 받아적어집니다 (Chrome/Edge 권장). 마이크가 없으면 여기에 답변을 직접 영어로 입력한 뒤 [채점하기]를 누르세요.'});
  const btnGrade=el('button',{class:'btn acc sm',type:'button'},'✔ 채점하기');
  const gbar=el('div',{class:'bar'});gbar.append(el('span',{class:'small',style:'margin-right:auto'},SR?'🎙 음성 인식 사용 가능':'⚠ 이 브라우저는 음성 인식을 지원하지 않아요. 답변을 입력해서 채점할 수 있어요.'),btnGrade);
  const sc=el('div',{class:'scorecard'});
  const model=el('div',{class:'model'});
  if(opts.model){const h=el('h5',{},'모범답안 ');h.appendChild(playBtn(opts.model,opts.modelV||'F'));model.append(h,el('div',{class:'en'},opts.model));if(opts.modelKo)model.append(el('div',{class:'ko'},opts.modelKo));}
  box.append(timer,bar,ta,gbar,sc,model);
  let iv=null,running=false,recorder=null,myUrl=null,stage=0;
  const fmt=s=>Math.floor(s/60)+':'+String(Math.max(0,s)%60).padStart(2,'0');
  function countdown(sec,cls,label){return new Promise(res=>{let left=sec;phase.className='phase '+cls;phase.innerHTML=label;clock.textContent=fmt(left);tb.firstChild.style.width='0%';tb.firstChild.style.background=cls==='prep'?'var(--acc)':'var(--bad)';
    const t0=Date.now();clearInterval(iv);iv=setInterval(()=>{const el2=(Date.now()-t0)/1000;left=Math.ceil(sec-el2);clock.textContent=fmt(left);tb.firstChild.style.width=Math.min(100,el2/sec*100)+'%';if(el2>=sec||stage<0){clearInterval(iv);res();}},200);
    box._skip=()=>{clearInterval(iv);res();};});}
  async function run(){
    if(running)return;running=true;stage=1;btnStart.disabled=true;ta.value='';sc.classList.remove('show');
    if(opts.beforeStart)opts.beforeStart();
    if(opts.questionAudio){phase.className='phase';phase.textContent='질문 듣기';await new Promise(r=>play(opts.questionAudio.text,opts.questionAudio.v,null,r));}
    beep(660);await countdown(opts.prep,'prep','준비 시간');
    beep(990,.3);recorder=makeRecorder();const st=await recorder.start(t=>{ta.value=t;});
    if(!st.mic&&!st.sr)toast('마이크를 사용할 수 없어요. 답변을 직접 입력해 채점할 수 있어요.');
    btnStop.style.display='';phase.innerHTML='';
    stage=2;await countdown(opts.resp,'speak','<span class="rec-dot"></span> 답변 중');phase.innerHTML='<span class="rec-dot"></span> 답변 중';
    await finish();
  }
  async function finish(){
    if(stage!==2)return;stage=3;beep(520,.25);btnStop.style.display='none';phase.className='phase done';phase.textContent='종료';
    const r=await recorder.stop();if(r.text&&r.text.length>ta.value.length)ta.value=r.text;
    if(r.url){myUrl=r.url;btnMy.style.display='';}
    running=false;btnStart.disabled=false;btnStart.textContent='↻ 다시 하기';
    grade();
  }
  function grade(){
    const said=ta.value.trim();
    let pct,html='';
    if(opts.mode==='read'){
      const r=readScore(opts.script,said);pct=r.pct;
      if(opts.passageEl){let i=0;opts.passageEl.innerHTML=opts.script.replace(/<[^>]+>/g,'').split(/(\s+)/).map(tok=>{if(/^\s+$/.test(tok)||!norm(tok))return esc(tok);const ok=r.ok[i++];return `<span class="${ok?'hitw':'miss'}">${esc(tok)}</span>`;}).join('');}
      html=`<div class="small">정확하게 읽은 단어 비율: <b>${Math.round(pct*100)}%</b> · 빨간색 단어는 인식되지 않은 단어예요. 발음·끊어 읽기를 확인하세요.</div>`;
    }else{
      const r=kwScore(opts.kws,said,opts.resp);pct=r.pct;
      html=`<div class="small">단어 수 ${r.wc} / 목표 약 ${r.target}단어 · 핵심 표현 ${r.hits.filter(Boolean).length}/${(opts.kws||[]).length}</div>`+((opts.kws||[]).length?`<div class="kw">${opts.kws.map((k,i)=>`<span class="${r.hits[i]?'hit':''}">${esc(k.split('|')[0])}</span>`).join('')}</div>`:'');
    }
    const s=Math.round(pct*opts.scale*2)/2;
    sc.innerHTML=`<div class="sc">예상 점수 ${s} / ${opts.scale}</div>${html}<div class="small" style="margin-top:6px">※ 자동 채점은 연습용 추정치입니다. 모범답안과 비교해 보세요.</div>`;
    sc.classList.add('show');
    if(said)opts.onScore&&opts.onScore(s);
  }
  btnStart.onclick=run;
  btnStop.onclick=()=>{if(box._skip)box._skip();};
  btnMy.onclick=()=>{if(myUrl){stopAudio();const a=new Audio(myUrl);cur=a;a.play();}};
  btnModel.onclick=()=>{model.classList.toggle('show');btnModel.textContent=model.classList.contains('show')?'💡 모범답안 숨기기':'💡 모범답안 보기';};
  btnGrade.onclick=()=>{if(!ta.value.trim()){toast('먼저 답변을 말하거나 입력하세요.');return;}grade();};
  // skip prep by clicking phase
  phase.title='클릭하면 준비 시간을 건너뜁니다';phase.style.cursor='pointer';phase.onclick=()=>{if(stage===1&&box._skip)box._skip();};
  return box;
}

/* ---------- block renderers ---------- */
const R={};
function blockShell(b,sec,idx){
  const d=el('div',{class:'block',id:b._id});
  if(b.title)d.appendChild(el('h3',{},esc(b.title)+(b.badge?` <span class="badge">${esc(b.badge)}</span>`:'')));
  if(b.desc)d.appendChild(el('div',{class:'bdesc'},b.desc));
  return d;
}
function checkBar(onCheck,onReset){
  const bar=el('div',{class:'bar'});const res=el('span',{class:'result'});
  const c=el('button',{class:'btn',type:'button'},'정답 확인');const r=el('button',{class:'btn ghost',type:'button'},'다시 풀기');
  c.onclick=()=>{const s=onCheck();res.textContent=s[2]?`${s[2]} ${Math.round(s[0]/s[1]*100)}점`:`${s[0]} / ${s[1]} 정답 · ${Math.round(s[0]/s[1]*100)}점`;res.classList.add('show');};
  r.onclick=()=>{onReset();res.classList.remove('show');};
  bar.append(res,r,c);return bar;
}
R.note=(b,d)=>{d.appendChild(el('div',{class:b.style||'note'},b.html));};
R.template=(b,d)=>{d.appendChild(el('div',{class:'tmpl'},b.html));};
R.examples=(b,d)=>{
  const tg=el('button',{class:'ko-toggle',type:'button'},'해석 숨기기');tg.onclick=()=>{d.classList.toggle('hide-ko');tg.textContent=d.classList.contains('hide-ko')?'해석 보기':'해석 숨기기';};
  const h=$('h3',d);if(h)h.appendChild(tg);else d.appendChild(tg);
  b.items.forEach((it,i)=>{const r=el('div',{class:'ex'});r.append(el('span',{class:'n'},i+1),el('div',{class:'t'},`<div class="en">${it.en}</div>${it.ko?`<div class="ko">${it.ko}</div>`:''}`),playBtn(it.en,it.v||b.v||'F'));d.appendChild(r);});
};
R.mcq=(b,d,blk)=>{
  const st=[];
  b.items.forEach((it,i)=>{
    const q=el('div',{class:'q'});const qt=el('div',{class:'qt'},`<span class="n">${i+1}.</span><span>${it.q}</span>`);
    if(it.audio){qt.appendChild(playBtn(it.audio,it.v||'F'));}
    q.appendChild(qt);const opts=el('div',{class:'opts'});const fb=el('div',{class:'fb'});
    const s={sel:-1,btns:[]};st.push(s);
    it.opts.forEach((o,j)=>{const bt=el('button',{class:'opt',type:'button'},`<span class="l">${'ABCDE'[j]}</span><span>${o}</span>`);bt.onclick=()=>{if(s.locked)return;s.sel=j;s.btns.forEach(x=>x.classList.remove('sel'));bt.classList.add('sel');};s.btns.push(bt);opts.appendChild(bt);});
    q.append(opts,fb);s.fb=fb;d.appendChild(q);
  });
  d.appendChild(checkBar(()=>{let c=0;b.items.forEach((it,i)=>{const s=st[i];s.locked=true;s.btns.forEach((x,j)=>{x.classList.remove('sel');if(j===it.a)x.classList.add('right');else if(j===s.sel)x.classList.add('wrong');});const ok=s.sel===it.a;if(ok)c++;s.fb.innerHTML=(ok?'<span class="r">✔ 정답</span>':'<span class="w">✘ 오답</span> 정답: '+'ABCDE'[it.a])+(it.exp?` <span class="exp">— ${it.exp}</span>`:'');s.fb.classList.add('show');});setScore(blk,c/b.items.length*blk.max);return [c,b.items.length];},
  ()=>{st.forEach(s=>{s.locked=false;s.sel=-1;s.btns.forEach(x=>x.className='opt');s.fb.classList.remove('show');});}));
};
R.fill=(b,d,blk)=>{
  const st=[];
  b.items.forEach((it,i)=>{
    const q=el('div',{class:'q'});q.appendChild(el('div',{class:'qt'},`<span class="n">${i+1}.</span><span>${it.ko?esc(it.ko):''}${it.hint?` <span class="small">(${it.hint})</span>`:''}</span>`));
    const line=el('div',{class:'fillline'});const ins=[];
    const parts=it.s.split('___');parts.forEach((p,k)=>{line.appendChild(document.createTextNode(p));if(k<parts.length-1){const inp=el('input',{class:'blank',type:'text',autocomplete:'off',autocapitalize:'off',spellcheck:'false'});inp.style.width=Math.max(90,(String(it.a[k]).split('|')[0].length*11+30))+'px';ins.push(inp);line.appendChild(inp);}});
    const full=it.s.replace(/___/g,()=>'{}');
    const fb=el('div',{class:'fb'});q.append(line,fb);d.appendChild(q);st.push({ins,fb,full});
  });
  d.appendChild(checkBar(()=>{let c=0,t=0;b.items.forEach((it,i)=>{const s=st[i];let allok=true;s.ins.forEach((inp,k)=>{t++;const alts=String(it.a[k]).split('|').map(norm);const ok=alts.includes(norm(inp.value));inp.classList.toggle('right',ok);inp.classList.toggle('wrong',!ok);if(ok)c++;else allok=false;});
    let sent=it.s;it.a.forEach(a=>{sent=sent.replace('___','<u>'+String(a).split('|')[0]+'</u>');});
    s.fb.innerHTML=(allok?'<span class="r">✔</span> ':'<span class="w">✘</span> ')+`<b>${sent}</b>`+(it.exp?` <span class="exp">— ${it.exp}</span>`:'');s.fb.appendChild(playBtn(strip(sent),'F'));s.fb.classList.add('show');});setScore(blk,c/t*blk.max);return [c,t];},
  ()=>{st.forEach(s=>{s.ins.forEach(x=>{x.value='';x.className='blank';});s.fb.classList.remove('show');});}));
};
R.order=(b,d,blk)=>{
  const st=[];
  b.items.forEach((it,i)=>{
    const q=el('div',{class:'q'});q.appendChild(el('div',{class:'qt'},`<span class="n">${i+1}.</span><span>${esc(it.ko||'')}</span>`));
    const toks=it.chunks?it.chunks:it.a.replace(/[.?!]$/,'').split(' ');const end=(it.a.match(/[.?!]$/)||[''])[0];
    const built=el('div',{class:'built'});const chips=el('div',{class:'chips'});const fb=el('div',{class:'fb'});
    const s={seq:[],built,chips,fb,toks,end};st.push(s);
    function render(){built.innerHTML='';s.seq.forEach((k,pos)=>{const c=el('button',{class:'chip',type:'button'},esc(toks[k]));c.onclick=()=>{if(s.locked)return;s.seq.splice(pos,1);render();};built.appendChild(c);});$$('.chip',chips).forEach(c=>c.classList.toggle('used',s.seq.includes(+c.dataset.k)));}
    shuffle(toks.map((t,k)=>k)).forEach(k=>{const c=el('button',{class:'chip',type:'button','data-k':k},esc(toks[k]));c.onclick=()=>{if(s.locked)return;s.seq.push(k);render();};chips.appendChild(c);});
    s.render=render;q.append(built,chips,fb);d.appendChild(q);
  });
  d.appendChild(checkBar(()=>{let c=0;b.items.forEach((it,i)=>{const s=st[i];s.locked=true;const ans=s.seq.map(k=>s.toks[k]).join(' ')+s.end;const ok=norm(ans)===norm(it.a)||(it.alt||[]).some(x=>norm(x)===norm(ans));if(ok)c++;s.built.classList.toggle('right',ok);s.built.classList.toggle('wrong',!ok);s.fb.innerHTML=(ok?'<span class="r">✔ 정답</span> ':'<span class="w">✘ 정답:</span> ')+`<b>${esc(it.a)}</b>`+(it.exp?` <span class="exp">— ${it.exp}</span>`:'');s.fb.appendChild(playBtn(it.a,'F'));s.fb.classList.add('show');});setScore(blk,c/b.items.length*blk.max);return [c,b.items.length];},
  ()=>{st.forEach(s=>{s.locked=false;s.seq=[];s.built.className='built';s.fb.classList.remove('show');s.render();});}));
};
R.pause=(b,d,blk)=>{
  const st=[];
  b.items.forEach((it,i)=>{
    const q=el('div',{class:'q'});const qt=el('div',{class:'qt'},`<span class="n">${i+1}.</span><span>${it.title?esc(it.title)+' · ':''}<span class="small">단어 사이를 클릭해 끊어 읽을 곳(/)을 표시하세요.</span></span>`);
    const plain=it.text.replace(/\s*\/\s*/g,' ').replace(/\s+/g,' ').trim();qt.appendChild(playBtn(plain,it.v||'F'));q.appendChild(qt);
    const segs=it.text.split(/\s+/);const ws=[],ans=new Set();segs.forEach(tk=>{if(tk==='/'){ans.add(ws.length-1);}else ws.push(tk);});
    const box=el('div',{class:'pausetext'});const gaps=[];
    ws.forEach((w,k)=>{box.appendChild(el('span',{class:'w'},esc(w)));if(k<ws.length-1){const g=el('span',{class:'g'},'/');g.onclick=()=>{if(st[i].locked)return;g.classList.toggle('on');};gaps.push(g);box.appendChild(g);}});
    const fb=el('div',{class:'fb'});q.append(box,fb);d.appendChild(q);st.push({gaps,ans,fb});
  });
  d.appendChild(checkBar(()=>{let tot=0,E=0;b.items.forEach((it,i)=>{const s=st[i];s.locked=true;let hit=0,extra=0;s.gaps.forEach((g,k)=>{const on=g.classList.contains('on'),a=s.ans.has(k);g.classList.remove('on','hit','miss','extra');if(on&&a){g.classList.add('hit');hit++;}else if(a){g.classList.add('miss');}else if(on){g.classList.add('extra');extra++;}});
    const sc=Math.max(0,(hit-extra*0.5))/s.ans.size;E+=sc;tot++;s.fb.innerHTML=`<span class="r">초록 / = 맞힘</span> · <span class="w">빨강 / = 놓친 곳</span> · <span style="color:var(--warn);font-weight:700">노랑 = 불필요</span> → 일치도 ${Math.round(sc*100)}%`+(it.exp?`<div class="exp">${it.exp}</div>`:'');s.fb.classList.add('show');});setScore(blk,E/tot*blk.max);return [E,tot,'평균 일치도'];},
  ()=>{st.forEach(s=>{s.locked=false;s.gaps.forEach(g=>g.className='g');s.fb.classList.remove('show');});}));
};
/* speaking blocks */
function speakRegister(b,d,blk,n){blk._parts=new Array(n).fill(null);return (k,s,scale)=>{blk._parts[k]=s/scale;const done=blk._parts.filter(x=>x!=null);setScore(blk,done.reduce((a,c)=>a+c,0)/n*blk.max);};}
function dirs(t){return el('div',{class:'directions'},t);}
R.read=(b,d,blk)=>{
  const upd=speakRegister(b,d,blk,b.items.length);
  b.items.forEach((it,i)=>{
    const t=el('div',{class:'task'});t.appendChild(el('div',{class:'thead'},`<b>${it.qn?`Q${it.qn}. `:`${i+1}. `}${esc(it.title||'Read a text aloud')}</b><span class="kind">${esc(it.kind||'지문 읽기')}</span>`));
    if(i===0&&!b.noDir)t.appendChild(dirs('<b>Directions:</b> 화면의 지문을 소리 내어 읽으세요. 준비 시간 45초, 읽기 시간 45초입니다.'));
    const p=el('div',{class:'passage'},it.text);t.appendChild(p);
    if(it.tips)t.appendChild(el('div',{class:'tip'},it.tips));
    const plain=strip(it.text);
    t.appendChild(speakingTask({prep:it.prep||45,resp:it.resp||45,scale:3,mode:'read',script:plain,model:plain,modelKo:it.ko,modelV:it.v||'F',passageEl:p,onScore:s=>upd(i,s,3)}));
    d.appendChild(t);
  });
};
R.picture=(b,d,blk)=>{
  const upd=speakRegister(b,d,blk,b.items.length);
  b.items.forEach((it,i)=>{
    const t=el('div',{class:'task'});t.appendChild(el('div',{class:'thead'},`<b>${it.qn?`Q${it.qn}. `:`${i+1}. `}${esc(it.title||'Describe a picture')}</b><span class="kind">사진 묘사</span>`));
    if(i===0&&!b.noDir)t.appendChild(dirs('<b>Directions:</b> 화면의 사진을 최대한 자세히 묘사하세요. 준비 시간 45초, 답변 시간 30초입니다.'));
    t.appendChild(el('img',{class:'scene',src:it.img,alt:'practice picture'}));
    if(it.vocab)t.appendChild(el('div',{class:'tip'},'<b>핵심 어휘</b> · '+it.vocab));
    t.appendChild(speakingTask({prep:it.prep||45,resp:it.resp||30,scale:3,mode:'kw',kws:it.kws,model:it.model,modelKo:it.ko,modelV:it.v||'F',onScore:s=>upd(i,s,3)}));
    d.appendChild(t);
  });
};
function qList(t,qs,upd,offset,voiceQ,tableToggle){
  const showAll=el('button',{class:'btn ghost sm',type:'button',style:'margin-bottom:8px'},'질문 텍스트 보기');let vis=false;
  t.appendChild(showAll);const qtexts=[];
  showAll.onclick=()=>{vis=!vis;qtexts.forEach(x=>x.style.display=vis?'':'none');showAll.textContent=vis?'질문 텍스트 숨기기':'질문 텍스트 보기';};
  qs.forEach((q,k)=>{
    const qa=el('div',{class:'qa'});const h=el('div',{class:'qhead'},`<span class="qn">Q${q.qn||k+1}</span><span class="small">준비 ${q.prep||3}초 · 답변 ${q.resp}초</span>`);
    h.appendChild(playBtn(q.q,q.v||voiceQ||'M','질문 듣기'));qa.appendChild(h);
    const qt=el('div',{style:'display:none;font-weight:600;margin:4px 0 6px'},esc(q.q)+(q.qko?` <span class="small">${esc(q.qko)}</span>`:''));qtexts.push(qt);qa.appendChild(qt);
    qa.appendChild(speakingTask({prep:q.prep||3,resp:q.resp,scale:3,mode:'kw',kws:q.kws,model:q.model,modelKo:q.ko,modelV:q.mv||'F',questionAudio:{text:q.q,v:q.v||voiceQ||'M'},onScore:s=>upd(offset+k,s,3)}));
    t.appendChild(qa);
  });
}
R.qset=(b,d,blk)=>{
  const n=b.items.reduce((a,it)=>a+it.qs.length,0);const upd=speakRegister(b,d,blk,n);let off=0;
  b.items.forEach((it,i)=>{
    const t=el('div',{class:'task'});t.appendChild(el('div',{class:'thead'},`<b>${i+1}. ${esc(it.topic)}</b><span class="kind">${esc(it.kind||'질문에 답하기')}</span>`));
    if(i===0&&!b.noDir)t.appendChild(dirs('<b>Directions:</b> 세 개의 질문에 답하세요. 각 질문마다 준비 시간 3초, 앞의 두 질문은 15초, 마지막 질문은 30초 동안 답변합니다.'));
    const intro=el('div',{class:'prompt'},esc(it.intro));intro.appendChild(playBtn(it.intro,it.iv||'UKF','상황 설명 듣기'));t.appendChild(intro);
    if(it.ko)t.appendChild(el('div',{class:'small',style:'margin:6px 0 10px'},esc(it.ko)));
    qList(t,it.qs,upd,off,it.qv||'M');off+=it.qs.length;d.appendChild(t);
  });
};
function renderTable(tb){
  const t=el('table',{class:'infotable'});t.appendChild(el('caption',{},esc(tb.caption)+(tb.sub?`<span class="sub">${esc(tb.sub)}</span>`:'')));
  if(tb.head){const tr=el('tr');tb.head.forEach(h=>tr.appendChild(el('th',{},esc(h))));t.appendChild(tr);}
  tb.rows.forEach(r=>{const tr=el('tr');r.forEach((c,ci)=>{const cell=el(ci===0&&tb.rowHead?'th':'td',{},c);if(Array.isArray(r.hl)&&r.hl.includes(ci))cell.classList.add('hl');tr.appendChild(cell);});t.appendChild(tr);});
  if(tb.foot){const tr=el('tr');tr.appendChild(el('td',{colspan:tb.head?tb.head.length:2,style:'font-size:13px;background:#fafbff'},tb.foot));t.appendChild(tr);}
  return t;
}
R.table=(b,d,blk)=>{
  const n=b.items.reduce((a,it)=>a+it.qs.length,0);const upd=speakRegister(b,d,blk,n);let off=0;
  b.items.forEach((it,i)=>{
    const t=el('div',{class:'task'});t.appendChild(el('div',{class:'thead'},`<b>${i+1}. ${esc(it.table.caption)}</b><span class="kind">${esc(it.kind||'표 보고 답하기')}</span>`));
    if(i===0&&!b.noDir)t.appendChild(dirs('<b>Directions:</b> 표를 읽을 시간 45초가 주어집니다. 이어서 세 개의 질문에 답하세요. 각 질문 준비 3초, Q1·Q2 답변 15초, Q3 답변 30초입니다.'));
    t.appendChild(renderTable(it.table));
    const intro=el('div',{class:'prompt',style:'margin-top:10px;font-weight:500'},'<b>📞 '+esc(it.intro)+'</b>');intro.appendChild(playBtn(it.intro,it.qv||'M','전화 내용 듣기'));t.appendChild(intro);
    qList(t,it.qs,upd,off,it.qv||'M');off+=it.qs.length;d.appendChild(t);
  });
};
R.voicemail=(b,d,blk)=>{
  const upd=speakRegister(b,d,blk,b.items.length);
  b.items.forEach((it,i)=>{
    const t=el('div',{class:'task'});t.appendChild(el('div',{class:'thead'},`<b>${i+1}. ${esc(it.title)}</b><span class="kind">해결책 제안</span>`));
    if(i===0&&!b.noDir)t.appendChild(dirs('<b>Directions:</b> 문제점을 설명하는 음성 메시지를 듣고, 메시지를 남긴 사람에게 해결책을 제안하세요. 준비 시간 45초(구 시험 30초), 답변 시간 60초입니다. 답변에는 ① 문제 확인 ② 해결책 ③ 마무리가 들어가야 합니다.'));
    const msgWrap=el('div',{class:'prompt',style:'font-weight:500'});const lb=el('div',{style:'display:flex;align-items:center;gap:10px'},'<b>📩 음성 메시지 듣기</b>');lb.appendChild(playBtn(it.msg,it.v||'UKM','음성 메시지 듣기'));msgWrap.appendChild(lb);
    const sh=el('button',{class:'btn ghost sm',type:'button',style:'margin-top:8px'},'스크립트 보기');const sc=el('div',{style:'display:none;margin-top:8px;font-size:15px'},esc(it.msg)+(it.msgKo?`<div class="small" style="margin-top:6px">${esc(it.msgKo)}</div>`:''));sh.onclick=()=>{sc.style.display=sc.style.display?'':'none';sh.textContent=sc.style.display?'스크립트 보기':'스크립트 숨기기';};msgWrap.append(sh,sc);t.appendChild(msgWrap);
    t.appendChild(speakingTask({prep:it.prep||45,resp:60,scale:5,mode:'kw',kws:it.kws,model:it.model,modelKo:it.ko,modelV:it.mv||'F',onScore:s=>upd(i,s,5)}));
    d.appendChild(t);
  });
};
R.opinion=(b,d,blk)=>{
  const upd=speakRegister(b,d,blk,b.items.length);
  b.items.forEach((it,i)=>{
    const t=el('div',{class:'task'});t.appendChild(el('div',{class:'thead'},`<b>${it.qn?`Q${it.qn}. `:`${i+1}. `}${esc(it.kind||'Express an opinion')}</b><span class="kind">의견 제시</span>`));
    if(i===0&&!b.noDir)t.appendChild(dirs('<b>Directions:</b> 주어진 주제에 대해 자신의 의견을 말하세요. 준비 시간 45초, 답변 시간 60초입니다. 이유와 구체적인 예를 들어 주세요.'));
    const p=el('div',{class:'prompt'},esc(it.prompt));p.appendChild(playBtn(it.prompt,it.v||'UKF','문제 듣기'));t.appendChild(p);
    if(it.pko)t.appendChild(el('div',{class:'small',style:'margin:6px 0 4px'},esc(it.pko)));
    if(it.outline){const o=el('div',{class:'tip'},'<b>🗂 답변 아웃라인 예시</b><br>'+it.outline);o.style.display='none';const ob=el('button',{class:'btn ghost sm',type:'button',style:'margin-top:8px'},'아웃라인 힌트 보기');ob.onclick=()=>{o.style.display=o.style.display?'':'none';};t.append(ob,o);}
    t.appendChild(speakingTask({prep:45,resp:60,scale:5,mode:'kw',kws:it.kws,model:it.model,modelKo:it.ko,modelV:it.mv||'F',onScore:s=>upd(i,s,5)}));
    d.appendChild(t);
  });
};

/* ---------- chapter builder ---------- */
const MAX={mcq:b=>b.items.length,fill:b=>b.items.reduce((a,it)=>a+it.a.length,0),order:b=>b.items.length,pause:b=>b.items.length,read:b=>b.items.length*3,picture:b=>b.items.length*3,qset:b=>b.items.reduce((a,it)=>a+it.qs.length,0)*3,table:b=>b.items.reduce((a,it)=>a+it.qs.length,0)*3,voicemail:b=>b.items.length*5,opinion:b=>b.items.length*5};
function buildChapter(){
  const C=window.CH;if(!C)return;document.title=C.title+' | TOEIC Speaking 인터랙티브';
  // top nav
  const nav=$('.topnav');if(nav&&window.CHAPTERS){window.CHAPTERS.forEach(c=>{nav.appendChild(el('a',{href:c.href,class:c.id===C.id?'on':''},c.short));});}
  $('#chTitle').innerHTML=C.title;$('#chSub').innerHTML=C.subtitle||'';
  const meta=$('#chMeta');(C.meta||[]).forEach(m=>meta.appendChild(el('span',{},m)));
  const side=$('#sideNav'),main=$('#main');
  C.sections.forEach((s,si)=>{
    const sid='s'+(si+1);side.appendChild(el('a',{href:'#'+sid,'data-sec':sid},`${esc(s.title)} <small></small>`));
    const sec=el('section',{class:'sec',id:sid});sec.appendChild(el('h2',{},`<span class="num">${si+1}</span>${esc(s.title)}`));
    if(s.desc)sec.appendChild(el('p',{class:'desc'},s.desc));
    s.blocks.forEach((b,bi)=>{b._id=sid+'b'+(bi+1);const d=blockShell(b);const r=R[b.type];
      if(!r){d.appendChild(el('div',{},'unknown block '+b.type));}
      else{let blk=null;if(MAX[b.type]){blk=registerBlock(b._id,sid,MAX[b.type](b));}r(b,d,blk);}
      sec.appendChild(d);});
    main.appendChild(sec);
  });
  // prev/next
  if(window.CHAPTERS){const i=window.CHAPTERS.findIndex(c=>c.id===C.id);const end=el('div',{class:'chend'});
    end.appendChild(i>0?el('a',{class:'btn ghost',href:window.CHAPTERS[i-1].href},'← '+window.CHAPTERS[i-1].short):el('span'));
    end.appendChild(el('a',{class:'btn ghost',href:'index.html'},'🏠 메인'));
    end.appendChild(i<window.CHAPTERS.length-1?el('a',{class:'btn',href:window.CHAPTERS[i+1].href},window.CHAPTERS[i+1].short+' →'):el('span'));main.appendChild(end);}
  // reset scores
  $('#resetScores').onclick=()=>{if(confirm('이 챕터의 점수 기록을 모두 지울까요?')){const a=store.all();delete a[CHID];localStorage.setItem('ts_scores',JSON.stringify(a));blocks.forEach(b=>b.earned=null);refreshScore();}};
  refreshScore();
  // scrollspy
  const links=$$('.side a');const obs=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){links.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id));}});},{rootMargin:'-30% 0px -60% 0px'});$$('.sec').forEach(s=>obs.observe(s));
  if('speechSynthesis' in window)speechSynthesis.getVoices();
}
window.TS={play,playBtn,store,buildChapter,fnv,audioKey,stopAudio};
document.addEventListener('DOMContentLoaded',()=>{if(window.CH)buildChapter();});
})();
