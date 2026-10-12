/* HER ERA. — offline-first personal tracker */
const STORE_KEY = "herEraTracker.v1";
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);
const localDateKey = (d=new Date()) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const dateLabel = (d=new Date()) => new Intl.DateTimeFormat("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(d);
const esc = (v="") => String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const safeNum = (v,min=0,max=100) => Math.max(min,Math.min(max,Number(v)||0));

const defaultHabits = [
 {id:"move",name:"Movement / olahraga ringan",category:"Health",emoji:"✦"},
 {id:"water",name:"Hidrasi cukup",category:"Health",emoji:"＋"},
 {id:"sugar",name:"Sadar konsumsi gula",category:"Health",emoji:"◇"},
 {id:"sleep",name:"Tidur cukup",category:"Health",emoji:"☾"},
 {id:"study",name:"Belajar minimal 25 menit",category:"Study",emoji:"Ａ"},
 {id:"read",name:"Baca buku",category:"Growth",emoji:"▤"}
];
const vocabBank = [
 ["consistent","konsisten","Small consistent actions create progress."],
 ["resilient","tangguh; mampu bangkit","She stayed resilient during a difficult semester."],
 ["achieve","mencapai","I want to achieve my academic goals."],
 ["improve","meningkatkan","I practise daily to improve my English."],
 ["insight","wawasan atau pemahaman mendalam","The article gave me a useful insight."],
 ["commitment","komitmen","Learning a language requires commitment."],
 ["evidence","bukti","The researcher collected evidence."],
 ["maintain","mempertahankan; menjaga","It is important to maintain a healthy routine."],
 ["reluctant","enggan; ragu-ragu","He was reluctant to speak at first."],
 ["significant","penting; berarti","Sleep has a significant effect on concentration."],
 ["approach","pendekatan; cara","We need a different approach to this problem."],
 ["contribute","berkontribusi","Small habits contribute to long-term growth."],
 ["perceive","memandang; memahami","People may perceive the same event differently."],
 ["sufficient","cukup; memadai","Make sure you get sufficient rest."],
 ["enhance","meningkatkan; memperkuat","Reading can enhance your vocabulary."],
 ["consequence","akibat; konsekuensi","Every choice can have a consequence."],
 ["whereas","sedangkan","I enjoy reading, whereas my friend prefers podcasts."],
 ["despite","meskipun","Despite the challenge, she kept practising."],
 ["therefore","oleh karena itu","The data were incomplete; therefore, we repeated the test."],
 ["reliable","dapat dipercaya","Use a reliable source for your assignment."],
 ["interpret","menafsirkan","Students interpret the graph in different ways."],
 ["establish","membangun; menetapkan","She established a practical study routine."],
 ["occur","terjadi","The change may occur gradually."],
 ["require","membutuhkan","This task will require careful planning."],
 ["awareness","kesadaran","Environmental awareness can inspire action."],
 ["allocate","mengalokasikan","I allocate thirty minutes for English."],
 ["approach","pendekatan","The teacher tried a new approach."],
 ["beneficial","bermanfaat","Regular review is beneficial for memory."],
 ["accurate","akurat; tepat","Make sure your answer is accurate."],
 ["assess","menilai; mengevaluasi","We assess our progress every month."],
 ["comprehend","memahami","Read the paragraph and comprehend its main idea."],
 ["derive","memperoleh; menurunkan","We can derive a formula from the relationship."],
 ["emerge","muncul","A pattern began to emerge in the results."],
 ["feasible","layak; memungkinkan","We need a feasible plan."],
 ["indicate","menunjukkan","The results indicate an improvement."],
 ["obtain","memperoleh","Students obtain information from several sources."],
 ["relevant","relevan","Choose relevant examples for your essay."],
 ["strategy","strategi","A clear strategy makes revision easier."],
 ["vary","bervariasi","Study methods vary from person to person."],
 ["widespread","tersebar luas; umum","The issue has become widespread."]
];
const grammarChallenges = [
 {title:"Subject–verb agreement",task:"Choose the correct form: “She ___ English every morning.”",options:["study","studies","studying","studied"],answer:1,why:"Subjek orang ketiga tunggal (she) memakai verb + -s/-es pada simple present."},
 {title:"Present perfect",task:"“I ___ this book twice.”",options:["read","have read","am reading","will read"],answer:1,why:"Present perfect memakai have/has + past participle untuk pengalaman atau hasil yang relevan."},
 {title:"Articles",task:"“She is ___ honest student.”",options:["a","an","the","no article"],answer:1,why:"Honest diawali bunyi vokal karena h tidak dibunyikan, jadi gunakan an."},
 {title:"Conditional sentence",task:"“If I had more time, I ___ another book.”",options:["read","will read","would read","have read"],answer:2,why:"Second conditional: If + past simple, would + verb."},
 {title:"Passive voice",task:"“The report ___ by the students yesterday.”",options:["writes","was written","is writing","has write"],answer:1,why:"Passive simple past: was/were + past participle."},
 {title:"Preposition",task:"“She is interested ___ environmental science.”",options:["on","at","in","for"],answer:2,why:"Frasa yang benar adalah interested in."},
 {title:"Relative clause",task:"“The book ___ I borrowed was helpful.”",options:["who","where","that","whose"],answer:2,why:"That dapat merujuk pada benda sebagai objek relative clause."},
 {title:"Comparative",task:"“This explanation is ___ than the previous one.”",options:["clear","clearest","clearer","more clear than"],answer:2,why:"Clear adalah kata sifat pendek; bentuk comparative-nya clearer than."}
];
const toeflBank = [
 {q:"Choose the grammatically correct sentence.",opts:["Each of the students have a notebook.","Each of the students has a notebook.","Each students has a notebook.","Each of student have a notebook."],a:1,exp:"Each bersifat singular, jadi gunakan has."},
 {q:"The experiment was repeated ___ the first results were inconsistent.",opts:["although","because","unless","despite"],a:1,exp:"Because menunjukkan alasan: eksperimen diulang karena hasil awal tidak konsisten."},
 {q:"Neither the teacher nor the students ___ aware of the schedule change.",opts:["was","is","were","has"],a:2,exp:"Pada neither...nor, kata kerja umumnya mengikuti subjek terdekat; students → were."},
 {q:"The word “approximately” is closest in meaning to ...",opts:["exactly","roughly","rarely","immediately"],a:1,exp:"Approximately berarti kira-kira atau roughly."},
 {q:"By the time we arrived, the lecture ___.",opts:["begins","has begun","had begun","will begin"],a:2,exp:"Past perfect menandai kejadian yang sudah terjadi sebelum kejadian lampau lainnya."},
 {q:"The findings, along with the raw data, ___ available in the appendix.",opts:["is","are","was","has"],a:1,exp:"Subjek utamanya findings (jamak); along with tidak mengubah jumlah subjek."},
 {q:"Choose the correct connector: ___ being tired, she completed the assignment.",opts:["Although","Despite","Because","Unless"],a:1,exp:"Despite diikuti noun/gerund phrase: despite being tired."},
 {q:"The scientist proposed a theory ___ could explain the observations.",opts:["who","whose","that","where"],a:2,exp:"That menghubungkan noun benda (theory) dengan relative clause."},
 {q:"Not only ___ the data, but she also presented the conclusion.",opts:["she analysed","did she analyse","she did analyse","analysed she"],a:1,exp:"Not only di awal klausa memerlukan inversion: did + subject + base verb."},
 {q:"A number of participants ___ completed the questionnaire.",opts:["has","have","is","was"],a:1,exp:"A number of + plural noun memakai kata kerja jamak: have."},
 {q:"The book is worth ___ carefully.",opts:["read","to read","reading","to reading"],a:2,exp:"Worth diikuti gerund: worth reading."},
 {q:"Had the team checked the equipment, the error ___ avoided.",opts:["could have been","can be","will have","is"],a:0,exp:"Inverted third conditional: Had + subject + past participle, ... could have been + past participle."}
];

function initialData(){
 return {
  habits:defaultHabits.map(x=>({...x})),habitChecks:{},moods:{},music:{},events:[],
  health:{startDate:localDateKey(),checks:{},notes:{}},
  worshipChecks:{},vocabLearned:{},grammarAnswers:{},toeflAnswers:{},
  books:[],journals:[],semester:"1",semesters:{}
 };
}
function load(){
 try{
  const raw=localStorage.getItem(STORE_KEY);if(!raw)return initialData();
  const x=JSON.parse(raw),d=initialData();
  return {...d,...x,habits:Array.isArray(x.habits)?x.habits:d.habits,events:Array.isArray(x.events)?x.events:[],books:Array.isArray(x.books)?x.books:[],journals:Array.isArray(x.journals)?x.journals:[],semesters:x.semesters||{},health:{...d.health,...x.health,checks:x.health?.checks||{},notes:x.health?.notes||{}}};
 }catch(e){console.error(e);return initialData()}
}
let db=load(),page="home",calendarCursor=new Date(),englishTab="vocab";
function persist(){try{localStorage.setItem(STORE_KEY,JSON.stringify(db));return true}catch(e){alert("Penyimpanan penuh atau browser menolak data. Coba ekspor backup dan kurangi ukuran gambar.");console.error(e);return false}}
function todayObj(){return new Date()}
function checksFor(store,key=localDateKey()){if(!store[key])store[key]={};return store[key]}
function dayNumber(dateStr){return Math.max(1,Math.floor((new Date(dateStr+"T12:00:00")-new Date(db.health.startDate+"T12:00:00"))/86400000)+1)}
function healthDay(){return Math.min(30,dayNumber(localDateKey()))}
function healthItems(){return [
 {id:"move",label:"Movement",desc:"Gerak aktif sesuai kemampuan",emoji:"✦"},
 {id:"water",label:"Hydration",desc:"Minum cukup sepanjang hari",emoji:"＋"},
 {id:"sugar",label:"Less sugar",desc:"Pilih minuman/makanan lebih sadar",emoji:"◇"},
 {id:"sleep",label:"Sleep care",desc:"Usahakan tidur yang cukup",emoji:"☾"},
 {id:"fruit",label:"Fruit / veggies",desc:"Tambahkan buah atau sayur",emoji:"✳"},
 {id:"screen",label:"Mindful break",desc:"Istirahat dari layar",emoji:"○"}
]}
function worshipItems(){return [
 {id:"tahajud",label:"Tahajud",emoji:"☾"},{id:"qunut",label:"Qunut",emoji:"✧"},
 {id:"puasa",label:"Puasa (jika direncanakan dan memungkinkan)",emoji:"◇"},
 {id:"tadarus",label:"Tadarus",emoji:"▤"},{id:"shadaqah",label:"Shadaqah",emoji:"♡"}
]}
function pct(a,b){return b?Math.round(a/b*100):0}
function renderStats(){
 const hc=checksFor(db.habitChecks),done=db.habits.filter(h=>hc[h.id]).length;
 const w=checksFor(db.worshipChecks),wd=worshipItems().filter(h=>w[h.id]).length;
 const todayTasks=checksFor(db.health.checks),hd=healthItems().filter(h=>todayTasks[h.id]).length;
 return `<div class="grid stats-grid">
  <article class="card"><div class="tiny">DAILY HABITS</div><div class="stat-number">${done}<span class="muted">/${db.habits.length}</span></div><div class="stat-label">Kebiasaan selesai hari ini</div><div class="progress-track"><div class="progress-fill" style="width:${pct(done,db.habits.length)}%"></div></div></article>
  <article class="card"><div class="tiny">HEALTH ERA</div><div class="stat-number">${hd}<span class="muted">/${healthItems().length}</span></div><div class="stat-label">Health checks hari ini</div><div class="progress-track"><div class="progress-fill" style="width:${pct(hd,healthItems().length)}%"></div></div></article>
  <article class="card"><div class="tiny">IBADAH</div><div class="stat-number">${wd}<span class="muted">/${worshipItems().length}</span></div><div class="stat-label">Target ibadah tercatat</div><div class="progress-track"><div class="progress-fill" style="width:${pct(wd,worshipItems().length)}%"></div></div></article>
  <article class="card"><div class="tiny">READING LOG</div><div class="stat-number">${db.books.filter(b=>b.status==="reading").length}</div><div class="stat-label">Buku sedang dibaca</div><div class="stat-foot">${db.books.length} buku di koleksi</div></article>
 </div>`;
}
function habitRows(){
 const c=checksFor(db.habitChecks);
 return `<div class="check-list">${db.habits.map(h=>`<label class="check-row ${c[h.id]?"done":""}"><input type="checkbox" data-habit="${esc(h.id)}" ${c[h.id]?"checked":""}><span class="check-emoji">${esc(h.emoji)}</span><span class="check-text">${esc(h.name)}<span class="check-category">${esc(h.category)}</span></span></label>`).join("")||`<div class="empty-state">Belum ada habit.</div>`}</div>`;
}
function renderHome(){
 const mood=db.moods[localDateKey()]||"";
 const music=db.music[localDateKey()]||{};
 return `<section class="hero"><p class="hero-date">${esc(dateLabel().toUpperCase())} / YOUR PERSONAL ARCHIVE</p><h2>Welcome to your era.</h2><p>Build a life you love. One focused day, one brave choice, one small promise at a time.</p><span class="hero-tag">DISCIPLINE IS SELF-RESPECT ✳</span></section>
 ${renderStats()}
 <section class="section grid two-col">
  <div class="card"><div class="section-head"><div><h2>Today's non-negotiables.</h2><p class="muted small">Small actions, real progress.</p></div><button class="button" data-page="health">Health →</button></div>${habitRows()}</div>
  <div class="card dark"><div class="tiny" style="color:#aaa">SOUNDTRACK OF THE DAY</div><div class="music-note">♫</div><h2>${esc(music.title||"What is today's soundtrack?")}</h2><p>${esc(music.artist||"Add the song that matches your mood.")}</p><div class="pill" style="border-color:#555;color:#ddd">${esc(mood||"MOOD NOT LOGGED")}</div><div class="section"><button class="button inverse" data-page="mood">Set today's vibe ↗</button></div></div>
 </section>
 <section class="section grid two-col">
  <div class="card"><div class="section-head"><div><h2>Academic focus</h2><p class="muted small">Keep showing up for your goals.</p></div><button class="button" data-page="academic">Open →</button></div><div class="stat-number">${currentSemesterGPA().toFixed(2)}</div><div class="stat-label">Estimated GPA — semester ${esc(db.semester)}</div><p class="small muted">Isi nilai TU, UTS, UAS, kuis, dan SKS untuk melihat estimasi.</p></div>
  <div class="card"><div class="section-head"><div><h2>One line for today</h2><p class="muted small">A memory worth keeping.</p></div><button class="button" data-page="journal">Journal →</button></div><p>${db.journals.some(j=>j.date===localDateKey())?"You have captured a memory today. Keep it.":"Hari ini belum ditulis. Simpan satu momen kecil yang ingin kamu ingat."}</p><button class="button primary" data-page="journal">Open journal ✎</button></div>
 </section>`;
}
function renderMood(){
 const m=db.moods[localDateKey()]||"",song=db.music[localDateKey()]||{};
 const moods=["✦ Focused","♡ Happy","☾ Calm","⚡ Motivated","☁ Tired","✧ Grateful","◇ Anxious","✳ Hopeful"];
 return `<section class="hero"><p class="hero-date">DAILY SOUNDTRACK / EMOTIONAL CHECK-IN</p><h2>What does today sound like?</h2><p>Catat lagu yang menemani hari ini dan beri nama pada mood-mu—tanpa perlu menghakimi perasaan sendiri.</p></section>
 <section class="grid two-col"><div class="card"><h2>Today's mood</h2><p class="muted small">Pilih yang paling mendekati perasaanmu.</p><div class="mood-options">${moods.map(x=>`<button class="mood-button ${m===x?"active":""}" data-mood="${esc(x)}">${esc(x)}</button>`).join("")}</div><div class="field section"><label for="mood-note">A little note (optional)</label><textarea id="mood-note" maxlength="1000" placeholder="Apa yang mungkin memengaruhi mood hari ini?">${esc(db.moodNotes?.[localDateKey()]||"")}</textarea></div><button class="button primary" id="save-mood-note">Save mood note</button></div>
 <div class="card"><div class="music-note">♫</div><h2>Music of the day</h2><p class="muted small">Soundtrack untuk chapter hari ini.</p><form id="music-form" class="form-stack"><div class="field"><label for="song-title">Song title</label><input id="song-title" name="title" maxlength="120" value="${esc(song.title||"")}" placeholder="Song title"></div><div class="field"><label for="song-artist">Artist</label><input id="song-artist" name="artist" maxlength="100" value="${esc(song.artist||"")}" placeholder="Artist name"></div><div class="field"><label for="song-link">Link (optional)</label><input id="song-link" name="link" type="url" maxlength="500" value="${esc(song.link||"")}" placeholder="https://..."></div><div class="field"><label for="song-note">Why this song?</label><textarea id="song-note" name="note" maxlength="1000" placeholder="This song feels like...">${esc(song.note||"")}</textarea></div><button class="button primary" type="submit">Save soundtrack ♫</button></form>${song.link?`<p><a href="${esc(song.link)}" target="_blank" rel="noopener noreferrer">Open song ↗</a></p>`:""}</div></section>`;
}
function renderCalendar(){
 const year=calendarCursor.getFullYear(),month=calendarCursor.getMonth(),first=new Date(year,month,1),last=new Date(year,month+1,0);
 const offset=(first.getDay()+6)%7,days=["MON","TUE","WED","THU","FRI","SAT","SUN"];
 let cells="";
 for(let i=0;i<offset;i++){const d=new Date(year,month,1-offset+i);cells+=`<div class="calendar-cell outside"><span class="day-number">${d.getDate()}</span></div>`}
 for(let day=1;day<=last.getDate();day++){
  const key=`${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`,events=db.events.filter(e=>e.date===key);
  cells+=`<div class="calendar-cell ${key===localDateKey()?"today":""}"><span class="day-number">${day}</span>${events.slice(0,2).map(e=>`<span class="calendar-event-dot" title="${esc(e.title)}">${esc(e.title)}</span>`).join("")}${events.length>2?`<span class="tiny">+${events.length-2}</span>`:""}<button class="add-day" data-event-date="${key}" aria-label="Tambah acara tanggal ${day}">+</button></div>`;
 }
 const total=Math.ceil((offset+last.getDate())/7)*7-(offset+last.getDate());
 for(let i=1;i<=total;i++)cells+=`<div class="calendar-cell outside"><span class="day-number">${i}</span></div>`;
 return `<section class="hero"><p class="hero-date">DATES THAT MATTER</p><h2>Make room for what matters.</h2><p>Catat hari penting, deadline, ulang tahun, acara, dan momen yang ingin kamu ingat.</p></section>
 <section class="grid two-col"><div class="card"><div class="calendar-head"><button class="button" id="prev-month">←</button><h2>${new Intl.DateTimeFormat("id-ID",{month:"long",year:"numeric"}).format(calendarCursor)}</h2><button class="button" id="next-month">→</button></div><div class="calendar-grid">${days.map(d=>`<div class="calendar-day-label">${d}</div>`).join("")}${cells}</div><p class="tiny">Klik tanda + pada tanggal untuk menambahkan hari penting.</p></div>
 <div class="card"><h2>Add an important day ✳</h2><p class="muted small">Tanggal pentingmu, tersimpan secara lokal.</p><form id="event-form" class="form-stack"><div class="field"><label for="event-title">Event name</label><input id="event-title" name="title" required maxlength="100" placeholder="Contoh: Ulang tahun / deadline"></div><div class="field"><label for="event-date">Date</label><input id="event-date" name="date" type="date" required value="${localDateKey()}"></div><div class="field"><label for="event-type">Category</label><select id="event-type" name="type"><option>Personal</option><option>Academic</option><option>Family</option><option>Health</option><option>Other</option></select></div><div class="field"><label for="event-note">Note (optional)</label><textarea id="event-note" name="note" maxlength="1000" placeholder="Details..."></textarea></div><button class="button primary" type="submit">+ Save date</button></form></div></section>
 <section class="section card"><div class="section-head"><div><h2>Upcoming dates</h2><p class="muted small">Acara mendatang yang sudah kamu simpan.</p></div></div>${renderEvents()}</section>`;
}
function renderEvents(){
 const list=[...db.events].sort((a,b)=>a.date.localeCompare(b.date));
 if(!list.length)return `<div class="empty-state">Belum ada tanggal penting. Tambahkan yang pertama ✳</div>`;
 return `<div class="item-list">${list.map(e=>`<article class="item-row"><div class="item-main"><strong>${esc(e.title)}</strong><div class="item-meta">${esc(e.date)} · ${esc(e.type||"Personal")}</div>${e.note?`<p class="small">${esc(e.note)}</p>`:""}</div><button class="icon-button" data-event-delete="${esc(e.id)}" aria-label="Hapus acara">✕</button></article>`).join("")}</div>`;
}
function renderHealth(){
 const day=healthDay(),checks=checksFor(db.health.checks),today=healthItems().filter(h=>checks[h.id]).length;
 const start=new Date(db.health.startDate+"T12:00:00"),end=new Date(start);end.setDate(end.getDate()+29);
 return `<section class="hero"><p class="hero-date">30-DAY RESET / DAY ${day} OF 30</p><h2>Take care of the body that carries your dreams.</h2><p>Challenge kesehatan yang fleksibel: fokus pada kebiasaan yang mendukung energi dan kesejahteraan, bukan mengejar kesempurnaan.</p><span class="hero-tag">${esc(db.health.startDate)} — ${esc(localDateKey(end))}</span></section>
 <section class="grid stats-grid"><article class="card"><div class="tiny">CHALLENGE DAY</div><div class="stat-number">${day}<span class="muted">/30</span></div><div class="stat-label">Hari dalam challenge</div><div class="progress-track"><div class="progress-fill" style="width:${day/30*100}%"></div></div></article><article class="card"><div class="tiny">TODAY</div><div class="stat-number">${today}/${healthItems().length}</div><div class="stat-label">Health actions logged</div></article><article class="card"><div class="tiny">WEEKLY RESET</div><div class="stat-number">${Object.keys(db.health.checks).filter(k=>{const d=(new Date(localDateKey()+"T12:00:00")-new Date(k+"T12:00:00"))/86400000;return d>=0&&d<7}).length}</div><div class="stat-label">Hari yang tercatat 7 hari terakhir</div></article><article class="card"><div class="tiny">REMINDER</div><div class="stat-number">♡</div><div class="stat-label">Progress, not perfection.</div></article></section>
 <section class="section grid two-col"><div class="card"><div class="section-head"><div><h2>Daily wellness checklist</h2><p class="muted small">${today} dari ${healthItems().length} selesai</p></div><span class="pill">DAY ${day}</span></div>${healthItems().map(h=>`<label class="check-row ${checks[h.id]?"done":""}"><input type="checkbox" data-health="${h.id}" ${checks[h.id]?"checked":""}><span class="check-emoji">${h.emoji}</span><span class="check-text">${h.label}<span class="check-category">${h.desc}</span></span></label>`).join("")}<div class="field section"><label for="health-note">Today's wellness note</label><textarea id="health-note" maxlength="1000" placeholder="Apa yang membantu kamu merasa lebih baik hari ini?">${esc(db.health.notes[localDateKey()]||"")}</textarea></div><button class="button primary" id="save-health-note">Save reflection</button></div>
 <div class="card"><h2>Your 30-day challenge</h2><p class="muted small">Centang sesuai kemampuan. Kamu boleh mengulang atau mengubah challenge kapan pun.</p><div class="item-list">${[
 ["DAYS 01–07","Build awareness","Amati kebiasaan tidur, minum, dan gerak tanpa menghakimi."],
 ["DAYS 08–14","Create a rhythm","Pilih rutinitas ringan yang realistis untuk diulang."],
 ["DAYS 15–21","Make it sustainable","Siapkan pengingat dan lingkungan yang mendukung."],
 ["DAYS 22–30","Reflect & adjust","Lihat kebiasaan yang terasa membantu dan sesuaikan target."]
 ].map((x,i)=>`<div class="item-row"><span class="pill">${x[0]}</span><div class="item-main"><strong>${x[1]}</strong><p class="small muted">${x[2]}</p>${day>=(i*7+1)?`<span class="tiny">${day>=((i+1)*7+1)||day===30?"IN PROGRESS / REACHED":"UP NEXT"}</span>`:""}</div></div>`).join("")}</div><div class="section"><button class="button" id="restart-health">Restart 30-day challenge</button></div><p class="tiny">Less sugar berarti lebih sadar memilih, bukan melarang semua makanan. Target hidrasi dan tidur sesuaikan kebutuhan serta kondisi tubuhmu.</p></div></section>`;
}
function renderWorship(){
 const checks=checksFor(db.worshipChecks);
 return `<section class="hero"><p class="hero-date">SPIRITUAL CHECK-IN / DAILY INTENTION</p><h2>Quiet moments, sincere intentions.</h2><p>Catat ibadah yang kamu usahakan hari ini dengan lembut. Checklist ini untuk refleksi pribadi, bukan penilaian diri.</p></section>
 <section class="grid two-col"><div class="card"><div class="section-head"><div><h2>Today's ibadah tracker</h2><p class="muted small">${worshipItems().filter(h=>checks[h.id]).length} aktivitas tercatat</p></div><span class="top-star">☾</span></div>${worshipItems().map(h=>`<label class="check-row ${checks[h.id]?"done":""}"><input type="checkbox" data-worship="${h.id}" ${checks[h.id]?"checked":""}><span class="check-emoji">${h.emoji}</span><span class="check-text">${h.label}</span></label>`).join("")}<p class="tiny">Qunut dapat dicatat sesuai praktik yang kamu ikuti. Puasa hanya dicentang jika memang dilakukan.</p></div>
 <div class="card"><h2>Weekly reflection</h2><p class="muted small">Lihat catatan 7 hari terakhir.</p>${renderWorshipWeek()}<div class="field section"><label for="worship-note">Personal reflection</label><textarea id="worship-note" maxlength="1000" placeholder="Hal yang ingin aku syukuri atau usahakan...">${esc(db.worshipNotes?.[localDateKey()]||"")}</textarea></div><button class="button primary" id="save-worship-note">Save reflection</button></div></section>`;
}
function renderWorshipWeek(){
 const rows=[];for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);const key=localDateKey(d),c=db.worshipChecks[key]||{},n=worshipItems().filter(x=>c[x.id]).length;rows.push(`<div class="item-row"><div class="item-main"><strong>${esc(new Intl.DateTimeFormat("id-ID",{weekday:"short",day:"numeric",month:"short"}).format(d))}</strong><div class="progress-track"><div class="progress-fill" style="width:${pct(n,worshipItems().length)}%"></div></div></div><span class="pill">${n}/${worshipItems().length}</span></div>`)}
 return `<div class="item-list">${rows.join("")}</div>`;
}
function dayIndex(){const d=new Date();return Math.floor(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/86400000)}
function dailyVocab(){const start=(dayIndex()*5)%vocabBank.length;return Array.from({length:5},(_,i)=>vocabBank[(start+i)%vocabBank.length])}
function dailyQuestions(bank,count=3){const start=(dayIndex()*count)%bank.length;return Array.from({length:count},(_,i)=>({q:bank[(start+i)%bank.length],index:(start+i)%bank.length}))}
function renderEnglish(){
 const tab=englishTab,learned=checksFor(db.vocabLearned);
 return `<section class="hero"><p class="hero-date">LANGUAGE LAB / DAILY PRACTICE</p><h2>Fluent is built one word at a time.</h2><p>Lima kosakata per hari, satu tantangan grammar, dan tiga soal latihan TOEFL setiap hari. Practice a little, every day.</p></section>
 <div class="button-row section-head"><div class="button-row"><button class="button ${tab==="vocab"?"primary":""}" data-eng-tab="vocab">01 / Vocabulary</button><button class="button ${tab==="grammar"?"primary":""}" data-eng-tab="grammar">02 / Grammar</button><button class="button ${tab==="toefl"?"primary":""}" data-eng-tab="toefl">03 / TOEFL</button></div><span class="pill">DAY ${dayIndex()+1}</span></div>
 ${tab==="vocab"?renderVocab():tab==="grammar"?renderGrammar():renderToefl()}`;
}
function renderVocab(){
 const words=dailyVocab(),learned=checksFor(db.vocabLearned);
 return `<section class="section"><div class="section-head"><div><h2>Today's 5 words</h2><p class="muted small">Pelajari arti, baca contoh, lalu centang saat sudah kamu pahami.</p></div><span class="pill">${words.filter(w=>learned[w[0]]).length}/5 LEARNED</span></div><div class="grid three-col">${words.map((w,i)=>`<article class="vocab-card"><div class="tiny">WORD 0${i+1}</div><div class="vocab-word">${esc(w[0])}</div><div class="vocab-meaning">${esc(w[1])}</div><div class="vocab-example">${esc(w[2])}</div><label class="check-row section"><input type="checkbox" data-vocab="${esc(w[0])}" ${learned[w[0]]?"checked":""}><span class="check-text">I know this word</span></label></article>`).join("")}</div></section>
 <section class="section card"><h2>Quick recall ✎</h2><p class="muted small">Tutup arti di atas, lalu coba tulis kembali makna satu kata.</p><form id="vocab-recall" class="form-stack"><div class="field"><label for="recall-word">Choose today's word</label><select id="recall-word" name="word">${words.map(w=>`<option value="${esc(w[0])}">${esc(w[0])}</option>`).join("")}</select></div><div class="field"><label for="recall-meaning">Meaning from memory</label><input id="recall-meaning" name="meaning" maxlength="200" required placeholder="Tulis arti dengan kata-katamu sendiri"></div><button class="button primary" type="submit">Save recall note</button></form>${db.vocabRecall?.[localDateKey()]?`<p class="small">Last recall: <strong>${esc(db.vocabRecall[localDateKey()].word)}</strong> — ${esc(db.vocabRecall[localDateKey()].meaning)}</p>`:""}</section>`;
}
function renderGrammar(){
 const q=grammarChallenges[dayIndex()%grammarChallenges.length],key=localDateKey(),saved=db.grammarAnswers[key]||{};
 return `<section class="grid two-col"><div class="card"><div class="tiny">GRAMMAR CHALLENGE / DAILY</div><h2 class="section">${esc(q.title)}</h2><p>${esc(q.task)}</p><div id="grammar-options">${q.options.map((o,i)=>`<button class="quiz-option ${saved.answer===i?"selected":""}" data-grammar-answer="${i}">${String.fromCharCode(65+i)}. ${esc(o)}</button>`).join("")}</div><div id="grammar-feedback" class="section small">${saved.answer!==undefined?`<strong>${saved.answer===q.answer?"Correct!":"Let's review."}</strong><p>${esc(q.why)}</p>`:""}</div></div><div class="card"><h2>Grammar notebook</h2><p class="muted small">Tulis contoh kalimat buatanmu menggunakan materi hari ini.</p><div class="field"><label for="grammar-note">My example sentence</label><textarea id="grammar-note" maxlength="1000" placeholder="Example: She studies physics every day.">${esc(db.grammarNotes?.[key]||"")}</textarea></div><button class="button primary section" id="save-grammar-note">Save grammar note</button><div class="quote-card section"><strong>Today's tip</strong><p>Jangan cuma menghafal jawaban. Perhatikan pola kalimat dan alasan pilihan itu benar.</p></div></div></section>`;
}
function renderToefl(){
 const qs=dailyQuestions(toeflBank,3),key=localDateKey(),saved=db.toeflAnswers[key]||{};
 return `<section class="section"><div class="section-head"><div><h2>Daily TOEFL practice</h2><p class="muted small">Tiga soal per hari · latihan grammar dan academic English.</p></div><span class="pill">${Object.keys(saved).length}/3 ANSWERED</span></div><div class="grid two-col">${qs.map((item,i)=>{const q=item.q,answer=saved[i];return `<article class="card"><div class="tiny">QUESTION 0${i+1} / DAILY SET</div><h3 class="section">${esc(q.q)}</h3><div>${q.opts.map((o,j)=>`<button class="quiz-option ${answer===j?"selected":""}" data-toefl-q="${i}" data-toefl-a="${j}">${String.fromCharCode(65+j)}. ${esc(o)}</button>`).join("")}</div><div class="section small" id="toefl-feedback-${i}">${answer!==undefined?`<strong>${answer===q.a?"Correct!":"Review this one."}</strong><p>${esc(q.exp)}</p>`:""}</div></article>`}).join("")}</div><div class="card section"><div class="tiny">YOUR SCORE TODAY</div><div class="stat-number">${qs.filter((item,i)=>saved[i]===item.q.a).length}<span class="muted">/3</span></div><p class="muted small">Setiap hari soal berganti berdasarkan tanggal. Soal ini latihan buatan untuk belajar, bukan soal TOEFL resmi.</p></div></section>`;
}
function getSem(){
 if(!db.semesters[db.semester])db.semesters[db.semester]={courses:[]};
 const sem=db.semesters[db.semester];
 if(!sem.weights)sem.weights={tu:15,quiz:15,uts:30,uas:40};
 if(!Array.isArray(sem.courses))sem.courses=[];
 return sem;
}
function courseParts(c){return {tu:Array.isArray(c.tuScores)&&c.tuScores.length?c.tuScores.reduce((a,b)=>a+b,0)/c.tuScores.length:c.tu,quiz:Array.isArray(c.quizScores)&&c.quizScores.length?c.quizScores.reduce((a,b)=>a+b,0)/c.quizScores.length:c.quiz,uts:c.uts,uas:c.uas}}
function courseScore(c,weightsOverride){
 const parts=courseParts(c),weights=weightsOverride||getSem().weights||{tu:15,quiz:15,uts:30,uas:40};
 const available=Object.entries(parts).filter(([k,v])=>v!==null&&v!==undefined&&v!=="");
 const totalWeight=available.reduce((sum,[k])=>sum+Math.max(0,Number(weights[k])||0),0);
 if(!available.length||!totalWeight)return null;
 return available.reduce((sum,[k,v])=>sum+safeNum(v,0,100)*(Math.max(0,Number(weights[k])||0)),0)/totalWeight;
}
function scoreToGP(score){if(score===null||score===undefined)return null;if(score>=85)return 4;if(score>=80)return 3.7;if(score>=75)return 3.3;if(score>=70)return 3;if(score>=65)return 2.7;if(score>=60)return 2.3;if(score>=55)return 2;if(score>=50)return 1.0;return 0}
function gpaForCourses(courses,weightsOverride){let credits=0,points=0;courses.forEach(c=>{const score=courseScore(c,weightsOverride),gp=scoreToGP(score);if(gp===null)return;const sks=Math.max(1,Number(c.sks)||2);credits+=sks;points+=gp*sks});return {gpa:credits?points/credits:0,credits}}
function currentSemesterGPA(){const s=getSem();return gpaForCourses(s.courses,s.weights).gpa}
function assessmentSummary(scores){return Array.isArray(scores)&&scores.length?`<span class="assessment-summary">${scores.map(n=>Number(n).toFixed(0)).join(" · ")}</span>`:`<span class="assessment-summary muted">Belum ada nilai</span>`}
function renderAcademic(){
 const sem=getSem(),courses=sem.courses,weights=sem.weights;
 const rows=courses.map(c=>{
  const parts=courseParts(c),score=courseScore(c),tuCount=(c.tuScores||[]).length,quizCount=(c.quizScores||[]).length;
  return `<tr><td class="course-cell"><input class="course-name" data-grade-field="name" data-course="${esc(c.id)}" value="${esc(c.name)}" aria-label="Nama mata kuliah"><span class="assessment-summary">${Number(c.sks)||2} SKS</span></td><td><button class="button assessment-button" data-manage-scores="tu" data-course="${esc(c.id)}">＋ Kelola TU <span>${tuCount?`(${tuCount})`:(c.tu!==null&&c.tu!==undefined?`(${Number(c.tu).toFixed(0)})`:`(0)`)}</span></button>${assessmentSummary(c.tuScores)}</td><td><input type="number" min="0" max="100" step="0.1" data-grade-field="uts" data-course="${esc(c.id)}" value="${c.uts??""}" placeholder="—" aria-label="Nilai UTS"></td><td><input type="number" min="0" max="100" step="0.1" data-grade-field="uas" data-course="${esc(c.id)}" value="${c.uas??""}" placeholder="—" aria-label="Nilai UAS"></td><td><button class="button assessment-button" data-manage-scores="quiz" data-course="${esc(c.id)}">＋ Kelola kuis <span>${quizCount?`(${quizCount})`:(c.quiz!==null&&c.quiz!==undefined?`(${Number(c.quiz).toFixed(0)})`:`(0)`)}</span></button>${assessmentSummary(c.quizScores)}</td><td><input type="number" min="1" max="8" data-grade-field="sks" data-course="${esc(c.id)}" value="${c.sks??2}" aria-label="SKS"></td><td><strong>${score===null?"—":score.toFixed(1)}</strong><span class="assessment-summary">${score===null?"Isi nilai":"Estimasi akhir"}</span></td><td><button class="icon-button" data-course-delete="${esc(c.id)}" aria-label="Hapus mata kuliah">✕</button></td></tr>`;
 }).join("");
 const sems=Array.from({length:8},(_,i)=>String(i+1)),current=gpaForCourses(courses);
 return `<section class="hero"><p class="hero-date">ACADEMIC ERA / SEMESTER TRACKER</p><h2>Make your effort visible.</h2><p>Kelola nilai setiap tugas dan kuis, catat UTS/UAS, lalu pantau estimasi IP semester dan IPK kumulatif.</p><span class="hero-tag">ESTIMASI ≠ NILAI RESMI KAMPUS</span></section>
 <div class="card"><div class="section-head"><div><h2>Choose your semester</h2><p class="muted small">Setiap semester punya daftar mata kuliah dan bobot penilaian sendiri.</p></div><span class="pill">SEMESTER ${esc(db.semester)}</span></div><div class="semester-tabs">${sems.map(s=>`<button class="semester-tab ${db.semester===s?"active":""}" data-semester="${s}">SEM ${s}</button>`).join("")}</div></div>
 <section class="section grid three-col"><article class="card"><div class="tiny">SEMESTER GPA / IP</div><div class="stat-number">${current.gpa.toFixed(2)}</div><div class="stat-label">Estimasi IP semester ${esc(db.semester)}</div><p class="tiny">${current.credits} SKS dengan nilai terisi</p></article><article class="card"><div class="tiny">COURSES</div><div class="stat-number">${courses.length}</div><div class="stat-label">Mata kuliah semester ini</div><p class="tiny">${courses.filter(c=>courseScore(c)!==null).length} sudah punya nilai</p></article><article class="card"><div class="tiny">CUMULATIVE GPA / IPK</div><div class="stat-number">${cumulativeGPA().toFixed(2)}</div><div class="stat-label">Estimasi IPK dari seluruh semester</div><p class="tiny">Dihitung berbobot SKS, hanya mata kuliah yang punya nilai</p></article></section>
 <section class="section grid two-col"><div class="card"><h2>Add a course +</h2><p class="muted small">Masukkan mata kuliah dan SKS. Nilai bisa ditambahkan bertahap.</p><form id="course-form" class="form-stack"><div class="field"><label for="course-name">Nama mata kuliah</label><input id="course-name" name="name" required maxlength="100" placeholder="Contoh: Termodinamika"></div><div class="field"><label for="course-sks">SKS</label><input id="course-sks" name="sks" type="number" min="1" max="8" value="2" required></div><button class="button primary" type="submit">+ Tambah mata kuliah</button></form></div><div class="card"><h2>Bobot penilaian (%)</h2><p class="muted small">Sesuaikan dengan RPS/dosen. Total idealnya 100%. Jika sebagian nilai belum ada, bobot yang tersedia akan dinormalisasi sementara.</p><form id="weight-form" class="form-stack"><div class="weight-grid"><div class="field"><label for="weight-tu">Tugas (TU)</label><input id="weight-tu" name="tu" type="number" min="0" max="100" value="${weights.tu}" required></div><div class="field"><label for="weight-quiz">Kuis</label><input id="weight-quiz" name="quiz" type="number" min="0" max="100" value="${weights.quiz}" required></div><div class="field"><label for="weight-uts">UTS</label><input id="weight-uts" name="uts" type="number" min="0" max="100" value="${weights.uts}" required></div><div class="field"><label for="weight-uas">UAS</label><input id="weight-uas" name="uas" type="number" min="0" max="100" value="${weights.uas}" required></div></div><div class="tiny" id="weight-total">Total bobot: ${Number(weights.tu)+Number(weights.quiz)+Number(weights.uts)+Number(weights.uas)}%</div><button class="button primary" type="submit">Simpan bobot</button></form></div></section>
 <section class="section card"><div class="section-head"><div><h2>Gradebook / semester ${esc(db.semester)}</h2><p class="muted small">Kelola daftar nilai tugas dan kuis lewat tombol. Nilai UTS/UAS dapat diisi langsung.</p></div></div><div class="table-wrap"><table class="grade-table academic-table"><thead><tr><th>Mata kuliah</th><th>Tugas</th><th>UTS</th><th>UAS</th><th>Kuis</th><th>SKS</th><th>Nilai akhir*</th><th></th></tr></thead><tbody>${rows||`<tr><td colspan="8">Belum ada mata kuliah. Tambahkan dari formulir di atas.</td></tr>`}</tbody></table></div><p class="tiny">*Nilai akhir memakai bobot yang kamu atur dan hanya menghitung komponen yang sudah terisi. Nilai tugas/kuis adalah rata-rata dari daftar nilai masing-masing.</p></section>
 <section class="section card"><h2>Semester overview</h2><p class="muted small">IP dihitung dari konversi estimasi nilai ke bobot mutu, lalu dirata-ratakan berdasarkan SKS. Cocokkan konversi dengan pedoman resmi kampus.</p>${renderSemesterOverview()}</section>`;
}
function cumulativeGPA(){let credits=0,points=0;Object.values(db.semesters).forEach(s=>(s.courses||[]).forEach(c=>{const gp=scoreToGP(courseScore(c,s.weights||{tu:15,quiz:15,uts:30,uas:40}));if(gp===null)return;const sks=Math.max(1,Number(c.sks)||2);credits+=sks;points+=gp*sks}));return credits?points/credits:0}
function renderSemesterOverview(){
 const rows=Object.keys(db.semesters).sort((a,b)=>Number(a)-Number(b)).filter(s=>(db.semesters[s].courses||[]).length).map(s=>{const courses=db.semesters[s].courses,calc=gpaForCourses(courses,db.semesters[s].weights||{tu:15,quiz:15,uts:30,uas:40});return `<div class="item-row"><div class="item-main"><strong>Semester ${esc(s)}</strong><div class="item-meta">${courses.length} mata kuliah · ${calc.credits} SKS dengan nilai</div></div><strong>${calc.gpa.toFixed(2)}</strong></div>`});
 return rows.length?`<div class="item-list">${rows.join("")}</div>`:`<div class="empty-state">Belum ada nilai yang direkap.</div>`;
}
function compressImage(file){
 return new Promise((resolve,reject)=>{
  if(!file.type.startsWith("image/"))return reject(new Error("File harus berupa gambar."));
  const reader=new FileReader();
  reader.onerror=()=>reject(new Error("Gambar tidak bisa dibaca."));
  reader.onload=()=>{
   const img=new Image();
   img.onerror=()=>reject(new Error("Format gambar tidak didukung."));
   img.onload=()=>{
    const max=1100,scale=Math.min(1,max/Math.max(img.width,img.height)),canvas=document.createElement("canvas");
    canvas.width=Math.max(1,Math.round(img.width*scale));canvas.height=Math.max(1,Math.round(img.height*scale));
    canvas.getContext("2d").drawImage(img,0,0,canvas.width,canvas.height);
    resolve(canvas.toDataURL("image/jpeg",.76));
   };
   img.src=reader.result;
  };
  reader.readAsDataURL(file);
 });
}
function renderBooks(){
 const books=db.books;
 return `<section class="hero"><p class="hero-date">READING LOG / STORIES THAT STAY</p><h2>Collect stories, not just pages.</h2><p>Catat buku yang kamu baca, durasi membaca, target menyelesaikan, review pribadi, rating, dan foto sampul.</p></section>
 <section class="grid two-col"><div class="card"><h2>Add a book +</h2><form id="book-form" class="form-stack section"><div class="field"><label for="book-title">Book title</label><input id="book-title" name="title" maxlength="150" required placeholder="Judul buku"></div><div class="field"><label for="book-author">Author</label><input id="book-author" name="author" maxlength="100" placeholder="Nama penulis"></div><div class="field"><label for="book-start">Start date</label><input id="book-start" name="start" type="date" value="${localDateKey()}"></div><div class="field"><label for="book-target">Target selesai (hari)</label><input id="book-target" name="target" type="number" min="1" max="3650" value="14"></div><div class="field"><label for="book-minutes">Reading minutes today</label><input id="book-minutes" name="minutes" type="number" min="0" max="1440" value="0"></div><div class="field"><label for="book-status">Status</label><select id="book-status" name="status"><option value="reading">Currently reading</option><option value="planned">Want to read</option><option value="finished">Finished</option></select></div><div class="field"><label for="book-image">Book cover photo (optional)</label><input id="book-image" type="file" accept="image/*"></div><div class="field"><label for="book-review">First impression / review</label><textarea id="book-review" name="review" maxlength="3000" placeholder="Apa yang menarik dari buku ini?"></textarea></div><button class="button primary" type="submit">Save to reading log</button></form></div>
 <div class="card"><div class="section-head"><div><h2>My bookshelf</h2><p class="muted small">${books.length} buku tersimpan</p></div></div>${books.length?`<div class="item-list">${books.map(b=>`<article class="item-row">${b.image?`<img class="book-cover" src="${b.image}" alt="Sampul ${esc(b.title)}">`:`<div class="book-cover" style="display:grid;place-items:center;font-size:25px">▤</div>`}<div class="item-main"><strong>${esc(b.title)}</strong><div class="item-meta">${esc(b.author||"Author not added")} · ${b.minutes||0} menit tercatat</div><div class="item-meta">Status: ${esc(b.status)} · Target ${b.target||14} hari</div><div class="rating-row">${[1,2,3,4,5].map(n=>`<button class="rating-star ${n<=(b.rating||0)?"active":""}" data-book-rating="${b.id}" data-rating="${n}" aria-label="Rating ${n}">★</button>`).join("")}</div>${b.review?`<p class="small">${esc(b.review)}</p>`:""}<div class="button-row section"><button class="button" data-book-minute="${b.id}">+ 10 min</button><button class="button" data-book-edit="${b.id}">Review / edit</button><button class="button danger" data-book-delete="${b.id}">Delete</button></div></div></article>`).join("")}</div>`:`<div class="empty-state">Your next favorite book is waiting.<br>Tambahkan buku pertamamu di sini.</div>`}</div></section>`;
}
function renderJournal(){
 return `<section class="hero"><p class="hero-date">DAILY JOURNAL / MEMORY ARCHIVE</p><h2>Dear me, remember this.</h2><p>Simpan pikiran, momen kecil, hal yang kamu syukuri, dan foto yang ingin kamu kenang. Tidak harus selalu indah—cukup jujur.</p></section>
 <section class="grid two-col"><div class="card"><h2>Capture a memory ✎</h2><form id="journal-form" class="form-stack section"><div class="field"><label for="journal-date">Date</label><input id="journal-date" name="date" type="date" required value="${localDateKey()}"></div><div class="field"><label for="journal-title">Title</label><input id="journal-title" name="title" maxlength="120" placeholder="A little moment..."></div><div class="field"><label for="journal-mood">Mood</label><select id="journal-mood" name="mood"><option>✦ Focused</option><option>♡ Happy</option><option>☾ Calm</option><option>⚡ Motivated</option><option>☁ Tired</option><option>✧ Grateful</option><option>◇ Anxious</option><option>✳ Hopeful</option></select></div><div class="field"><label for="journal-body">Your story</label><textarea id="journal-body" name="body" required maxlength="5000" placeholder="Today, I want to remember..."></textarea></div><div class="field"><label for="journal-images">Add memories (up to 3 images)</label><input id="journal-images" type="file" accept="image/*" multiple><div id="journal-image-preview" class="image-preview"></div></div><button class="button primary" type="submit">Save this memory ♡</button></form><p class="tiny">Gambar dikompres dan disimpan di browser lokal. Hindari foto berukuran besar atau terlalu banyak agar penyimpanan tidak penuh.</p></div>
 <div class="card"><div class="section-head"><div><h2>Memory archive</h2><p class="muted small">${db.journals.length} memories collected</p></div></div>${db.journals.length?`<div>${[...db.journals].sort((a,b)=>b.date.localeCompare(a.date)||b.createdAt-a.createdAt).map(j=>`<article class="item-row"><div class="item-main"><div class="item-meta">${esc(j.date)} · ${esc(j.mood||"")}</div><h3>${esc(j.title||"Untitled memory")}</h3><p>${esc(j.body)}</p>${(j.images||[]).map(src=>`<img class="memory-image" src="${src}" alt="Memory photo">`).join("")}<button class="button danger section" data-journal-delete="${j.id}">Delete memory</button></div></article>`).join("")}</div>`:`<div class="empty-state">No memories yet.<br>Save a little piece of today.</div>`}</div></section>`;
}
const pageMap={
 home:{title:"Your era starts here.",render:renderHome},
 mood:{title:"Music & mood archive.",render:renderMood},
 calendar:{title:"Dates that matter.",render:renderCalendar},
 health:{title:"Your health era.",render:renderHealth},
 worship:{title:"A quiet kind of progress.",render:renderWorship},
 english:{title:"Build your English era.",render:renderEnglish},
 books:{title:"Reading, one page at a time.",render:renderBooks},
 journal:{title:"Keep the memories.",render:renderJournal},
 academic:{title:"Make your effort visible.",render:renderAcademic}
};
function render(){
 const meta=pageMap[page]||pageMap.home;
 $("#page-title").textContent=meta.title;$("#today-label").textContent=`PERSONAL ARCHIVE / ${dateLabel().toUpperCase()}`;
 $("#page-content").innerHTML=meta.render();
 $$("[data-page]").forEach(b=>{const active=b.dataset.page===page;b.classList.toggle("active",active);if(b.classList.contains("nav-item")||b.classList.contains("mobile-nav-item"))b.setAttribute("aria-current",active?"page":"false")});
}
function go(p){if(!pageMap[p])return;page=p;render();window.scrollTo({top:0,behavior:"smooth"})}
function exportData(){
 const blob=new Blob([JSON.stringify(db,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=url;a.download=`her-era-backup-${localDateKey()}.json`;a.click();URL.revokeObjectURL(url);
}
function importData(file){
 const reader=new FileReader();reader.onload=()=>{try{const x=JSON.parse(reader.result);if(!x||typeof x!=="object"||!Array.isArray(x.habits)||!Array.isArray(x.books)||!Array.isArray(x.journals))throw new Error("Format backup tidak dikenali.");if(!confirm("Import akan mengganti data tracker yang sekarang. Pastikan sudah punya backup. Lanjutkan?"))return;db={...initialData(),...x};persist();render();alert("Backup berhasil diimpor.")}catch(e){alert("Backup gagal diimpor: "+e.message)}};reader.readAsText(file);
}
document.addEventListener("click",async e=>{
 const nav=e.target.closest("[data-page]");if(nav){e.preventDefault();go(nav.dataset.page);return}
 const mood=e.target.closest("[data-mood]");if(mood){db.moods[localDateKey()]=mood.dataset.mood;persist();render();return}
 const tab=e.target.closest("[data-eng-tab]");if(tab){englishTab=tab.dataset.engTab;render();return}
 const sem=e.target.closest("[data-semester]");if(sem){db.semester=sem.dataset.semester;persist();render();return}
 const manageScores=e.target.closest("[data-manage-scores]");if(manageScores){const c=getSem().courses.find(x=>x.id===manageScores.dataset.course);if(!c)return;const type=manageScores.dataset.manageScores,key=type==="tu"?"tuScores":"quizScores",label=type==="tu"?"nilai tugas":"nilai kuis",old=(c[key]||[]).join(", ");const raw=prompt(`Masukkan ${label} untuk ${c.name}, pisahkan dengan koma. Contoh: 85, 90, 78\\nKosongkan jika ingin menghapus daftar nilai.`,old);if(raw===null)return;const values=raw.trim()===""?[]:raw.split(",").map(v=>Number(v.trim()));if(values.some(v=>!Number.isFinite(v)||v<0||v>100)){alert("Setiap nilai harus berupa angka 0–100, dipisahkan koma.");return}c[key]=values;if(values.length)c[type]=values.reduce((a,b)=>a+b,0)/values.length;else c[type]=null;persist();render();return}
 const addDay=e.target.closest("[data-event-date]");if(addDay){$("#event-date").value=addDay.dataset.eventDate;$("#event-title").focus();return}
 const delEvent=e.target.closest("[data-event-delete]");if(delEvent&&confirm("Hapus hari penting ini?")){db.events=db.events.filter(x=>x.id!==delEvent.dataset.eventDelete);persist();render();return}
 const rate=e.target.closest("[data-book-rating]");if(rate){const b=db.books.find(x=>x.id===rate.dataset.bookRating);if(b){b.rating=Number(rate.dataset.rating);persist();render()}return}
 const minute=e.target.closest("[data-book-minute]");if(minute){const b=db.books.find(x=>x.id===minute.dataset.bookMinute);if(b){b.minutes=(Number(b.minutes)||0)+10;b.lastRead=localDateKey();persist();render()}return}
 const editBook=e.target.closest("[data-book-edit]");if(editBook){const b=db.books.find(x=>x.id===editBook.dataset.bookEdit);if(b){const review=prompt("Tulis atau perbarui review:",b.review||"");if(review!==null){b.review=review.slice(0,3000);const rating=prompt("Rating 1–5 (kosong untuk tidak mengubah):",b.rating||"");if(rating!==null&&rating.trim()!=="")b.rating=safeNum(rating,1,5);const status=prompt("Status: planned / reading / finished",b.status||"reading");if(["planned","reading","finished"].includes(status))b.status=status;persist();render()}}return}
 const delBook=e.target.closest("[data-book-delete]");if(delBook&&confirm("Hapus buku ini?")){db.books=db.books.filter(b=>b.id!==delBook.dataset.bookDelete);persist();render();return}
 const delJournal=e.target.closest("[data-journal-delete]");if(delJournal&&confirm("Hapus memory ini?")){db.journals=db.journals.filter(j=>j.id!==delJournal.dataset.journalDelete);persist();render();return}
 if(e.target.id==="prev-month"){calendarCursor=new Date(calendarCursor.getFullYear(),calendarCursor.getMonth()-1,1);render();return}
 if(e.target.id==="next-month"){calendarCursor=new Date(calendarCursor.getFullYear(),calendarCursor.getMonth()+1,1);render();return}
 if(e.target.id==="restart-health"&&confirm("Mulai ulang challenge dari hari pertama? Riwayat checklist sebelumnya akan tetap ada, tetapi tanggal awal berubah.")){db.health.startDate=localDateKey();persist();render();return}
 if(e.target.id==="save-mood-note"){db.moodNotes=db.moodNotes||{};db.moodNotes[localDateKey()]=$("#mood-note").value;persist();alert("Mood note tersimpan.");return}
 if(e.target.id==="save-health-note"){db.health.notes[localDateKey()]=$("#health-note").value;persist();alert("Wellness note tersimpan.");return}
 if(e.target.id==="save-worship-note"){db.worshipNotes=db.worshipNotes||{};db.worshipNotes[localDateKey()]=$("#worship-note").value;persist();alert("Reflection tersimpan.");return}
 if(e.target.id==="save-grammar-note"){db.grammarNotes=db.grammarNotes||{};db.grammarNotes[localDateKey()]=$("#grammar-note").value;persist();alert("Grammar note tersimpan.");return}
 if(e.target.id==="export-data-inline"){exportData();return}
 const grammar=e.target.closest("[data-grammar-answer]");if(grammar){const q=grammarChallenges[dayIndex()%grammarChallenges.length],answer=Number(grammar.dataset.grammarAnswer);db.grammarAnswers[localDateKey()]={answer};persist();render();return}
 const tq=e.target.closest("[data-toefl-q]");if(tq){const key=localDateKey(),set=dailyQuestions(toeflBank,3),i=Number(tq.dataset.toeflQ),a=Number(tq.dataset.toeflA);db.toeflAnswers[key]=db.toeflAnswers[key]||{};db.toeflAnswers[key][i]=a;persist();render();return}
});
document.addEventListener("change",async e=>{
 const h=e.target.closest("[data-habit]");if(h){checksFor(db.habitChecks)[h.dataset.habit]=h.checked;persist();render();return}
 const he=e.target.closest("[data-health]");if(he){checksFor(db.health.checks)[he.dataset.health]=he.checked;persist();render();return}
 const w=e.target.closest("[data-worship]");if(w){checksFor(db.worshipChecks)[w.dataset.worship]=w.checked;persist();render();return}
 const v=e.target.closest("[data-vocab]");if(v){checksFor(db.vocabLearned)[v.dataset.vocab]=v.checked;persist();render();return}
 const grade=e.target.closest("[data-grade-field]");if(grade){const c=getSem().courses.find(x=>x.id===grade.dataset.course);if(c){const f=grade.dataset.gradeField;c[f]=f==="name"?grade.value:(grade.value===""?null:safeNum(grade.value, f==="sks"?1:0,f==="sks"?8:100));if(f==="uts"||f==="uas"){persist();render()}else{persist();render()}}return}
 if(e.target.id==="journal-images"){const box=$("#journal-image-preview");box.innerHTML="";for(const file of [...e.target.files].slice(0,3)){try{const src=await compressImage(file);const wrap=document.createElement("div");wrap.className="image-card";const img=document.createElement("img");img.src=src;img.alt="Preview memory";wrap.append(img);box.append(wrap)}catch(err){alert(err.message)}}}
});
document.addEventListener("submit",async e=>{
 e.preventDefault();const form=e.target,fd=new FormData(form);
 if(form.id==="music-form"){db.music[localDateKey()]={title:String(fd.get("title")||"").trim(),artist:String(fd.get("artist")||"").trim(),link:String(fd.get("link")||"").trim(),note:String(fd.get("note")||"").trim()};persist();render();return}
 if(form.id==="event-form"){db.events.push({id:uid(),title:String(fd.get("title")).trim(),date:String(fd.get("date")),type:String(fd.get("type")),note:String(fd.get("note")||"").trim()});persist();render();return}
 if(form.id==="course-form"){const s=getSem();s.courses.push({id:uid(),name:String(fd.get("name")).trim(),sks:safeNum(fd.get("sks"),1,8),tu:null,uts:null,uas:null,quiz:null,tuScores:[],quizScores:[]});persist();render();return}
 if(form.id==="weight-form"){const values={tu:safeNum(fd.get("tu"),0,100),quiz:safeNum(fd.get("quiz"),0,100),uts:safeNum(fd.get("uts"),0,100),uas:safeNum(fd.get("uas"),0,100)},total=Object.values(values).reduce((a,b)=>a+b,0);if(total!==100){alert(`Total bobot saat ini ${total}%. Atur agar totalnya tepat 100% sebelum menyimpan.`);return}getSem().weights=values;persist();render();return}
 if(form.id==="book-form"){
  const file=$("#book-image").files[0];let image="";
  if(file){try{image=await compressImage(file)}catch(err){alert(err.message);return}}
  db.books.push({id:uid(),title:String(fd.get("title")).trim(),author:String(fd.get("author")||"").trim(),start:String(fd.get("start")||localDateKey()),target:safeNum(fd.get("target"),1,3650),minutes:safeNum(fd.get("minutes"),0,1440),status:String(fd.get("status")),review:String(fd.get("review")||"").trim(),rating:0,image,createdAt:Date.now()});persist();render();return
 }
 if(form.id==="journal-form"){
  const files=[...$("#journal-images").files].slice(0,3),images=[];
  try{for(const file of files)images.push(await compressImage(file))}catch(err){alert(err.message);return}
  db.journals.push({id:uid(),date:String(fd.get("date")||localDateKey()),title:String(fd.get("title")||"").trim(),mood:String(fd.get("mood")||""),body:String(fd.get("body")||"").trim(),images,createdAt:Date.now()});persist();render();return
 }
 if(form.id==="vocab-recall"){db.vocabRecall=db.vocabRecall||{};db.vocabRecall[localDateKey()]={word:String(fd.get("word")),meaning:String(fd.get("meaning")).trim()};persist();render();return}
});
$("#export-data").addEventListener("click",exportData);
$("#import-data").addEventListener("change",e=>{if(e.target.files[0])importData(e.target.files[0]);e.target.value=""});
function currentGradeDelete(id){const s=getSem();s.courses=s.courses.filter(c=>c.id!==id);persist();render()}
document.addEventListener("click",e=>{const d=e.target.closest("[data-course-delete]");if(d&&confirm("Hapus mata kuliah ini?"))currentGradeDelete(d.dataset.courseDelete)});
if("serviceWorker" in navigator && location.protocol!=="file:"){
 window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").then(()=>console.log("HER ERA offline cache ready")).catch(console.error));
}
render();
