(()=>{
const C=window.INVITE,$=id=>document.getElementById(id),D=new Date(C.dateISO);
const day=23,month=C.monthName,year=2026;
$('n1').textContent=C.groom;$('n2').textContent=C.bride;$('gn').textContent=C.groom;$('bn').textContent=C.bride;
[['gp1',C.groomParents[0]],['gp2',C.groomParents[1]],['bp1',C.brideParents[0]],['bp2',C.brideParents[1]]].forEach(([i,t])=>$(i).textContent=t);
$('invLine1').textContent=`Mr. ${C.groom} & Miss ${C.bride}`;
$('invLine2').innerHTML=`on ${C.dayName}, ${day} ${month} ${year}<br>at ${C.timeText}`;
$('invLine3').textContent=`at ${C.venueName}`;
$('dayName').textContent=C.dayName;$('timeWords').textContent=C.timeText;
$('dNum').textContent=day;$('dMonth').textContent=month;$('dYear').textContent=year;
$('tStart').textContent=C.startTime;$('tGuests').textContent=C.guestsTime;
$('venueName').textContent=`${C.venueName}, ${C.venueCity}`;
$('mapFrame').src=`https://maps.google.com/maps?q=${C.lat},${C.lng}&z=16&hl=en&output=embed`;
$('mapLink').href=C.mapsLink;
$('foot').textContent=`${C.groom} & ${C.bride} · ${year} ♡`;
$('giftMsg').textContent=C.thankYou;
$('timeline').innerHTML=C.program.map(([t,h])=>`<li><span>${t}</span><em>${h}</em></li>`).join('');
// calendar (Monday first)
document.querySelector('.dow').innerHTML=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(x=>`<span>${x}</span>`).join('');
$('calTitle').textContent=`${month} ${year}`;
const first=(new Date(year,10,1).getDay()+6)%7;let h='';
for(let i=0;i<first;i++)h+='<span></span>';
for(let d=1;d<=30;d++)h+=`<span class="${d===day?'on':''}">${d}</span>`;
document.querySelector('.days').innerHTML=h;
// countdown
function tick(){const s=Math.max(0,Math.floor((D-Date.now())/1000));
 [Math.floor(s/86400),Math.floor(s%86400/3600),Math.floor(s%3600/60),s%60].forEach((v,i)=>$(['cd','ch','cm','cs'][i]).textContent=v)}
tick();setInterval(tick,1000);
const toast=m=>{const t=$('toast');t.textContent=m;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),2600)};
// music: starts the moment the envelope is opened (tap = user gesture, needed on iPhone & Android)
const audio=$('audio'),mus=$('music');audio.src=C.song;
const play=()=>{const p=audio.play();if(p)p.then(()=>mus.classList.add('on')).catch(()=>{})};
$('cover').addEventListener('click',()=>{play();$('cover').classList.add('open');document.body.classList.remove('locked');mus.classList.add('show')});
mus.addEventListener('click',()=>{if(audio.paused)play();else{audio.pause();mus.classList.remove('on')}});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&!audio.paused){audio.pause();audio._auto=1}else if(audio._auto){audio._auto=0;play()}});
// add to calendar
$('addCal').onclick=e=>{e.preventDefault();const f=d=>d.toISOString().replace(/[-:]|\.\d{3}/g,'');
 const ics=['BEGIN:VCALENDAR','VERSION:2.0','BEGIN:VEVENT',`DTSTART:${f(D)}`,`DTEND:${f(new Date(D.getTime()+5*3600e3))}`,`SUMMARY:${C.groom} & ${C.bride} Wedding`,`LOCATION:${C.venueName}`,`DESCRIPTION:${C.mapsLink}`,'END:VEVENT','END:VCALENDAR'].join('\r\n');
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([ics],{type:'text/calendar'}));a.download='wedding.ics';document.body.appendChild(a);a.click();a.remove()};
// RSVP
$('rsvp').onclick=()=>{const t=encodeURIComponent(`I'm happy to confirm my attendance at ${C.groom} & ${C.bride}'s wedding 🤍`);
 if(C.whatsapp)window.open(`https://wa.me/${C.whatsapp}?text=${t}`,'_blank');else toast('Thank you! Your attendance is confirmed')};
// wishes
const wl=()=>{try{return JSON.parse(localStorage.getItem('wishes')||'[]')}catch(e){return[]}};
const showWishes=()=>{const l=$('wishes');l.innerHTML='';wl().forEach(w=>{const li=document.createElement('li'),b=document.createElement('b'),s=document.createElement('span');b.textContent=w.n;s.textContent=w.m;li.append(b,s);l.append(li)})};
showWishes();
$('wishForm').addEventListener('submit',e=>{e.preventDefault();const n=$('wName').value.trim(),m=$('wMsg').value.trim();
 if(!n||!m){toast('Please enter your name and your wish');return}
 try{localStorage.setItem('wishes',JSON.stringify([{n,m},...wl()]))}catch(e){}
 e.target.reset();showWishes();toast('Your wish was sent. Thank you 🤍')});
// album
const tr=$('track'),pg=$('pager');
for(let i=1;i<=C.albumPhotos;i++){tr.insertAdjacentHTML('beforeend',`<img src="img/album-${i}.jpeg" alt="Wedding photo ${i}">`);pg.insertAdjacentHTML('beforeend','<i></i>')}
const imgs=[...tr.children],dots=[...pg.children],mid=im=>im.offsetLeft-(tr.clientWidth-im.offsetWidth)/2;
function cur(){const c=tr.scrollLeft+tr.clientWidth/2;let b=0,bd=1e9;imgs.forEach((im,i)=>{const d=Math.abs(im.offsetLeft+im.offsetWidth/2-c);if(d<bd){bd=d;b=i}});
 imgs.forEach((im,i)=>im.classList.toggle('cur',i===b));dots.forEach((d,i)=>d.classList.toggle('cur',i===b))}
tr.addEventListener('scroll',cur,{passive:true});addEventListener('load',()=>{if(imgs[0])tr.scrollLeft=mid(imgs[0]);cur()});cur();
dots.forEach((d,i)=>d.onclick=()=>tr.scrollTo({left:mid(imgs[i]),behavior:'smooth'}));
// gift: the thank-you message appears only after tapping the gift
let opened=false;
const toggleGift=e=>{e.preventDefault();opened=!opened;$('giftMsg').classList.toggle('show',opened);$('giftBtn').classList.toggle('open',opened);$('giftToggle').textContent=opened?'Tap to close':'Tap to open'};
$('giftToggle').onclick=$('giftBtn').onclick=toggleGift;
// reveal on scroll
const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.12});
document.querySelectorAll('.card,.venue,.dress,.gallery,.gift').forEach(el=>{el.classList.add('reveal');io.observe(el)});
})();
