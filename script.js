// ===== DATA =====
const DATA = [
  { name:"Languages", icon:"https://img.icons8.com/fluency/96/000000/open-book.png", courses:[
    { title:"English", levels:["Level 1","Level 2","Level 3"] },
    { title:"Arabic", levels:["Level 1","Level 2"] }
  ]},
  { name:"Academic Subjects", icon:"https://img.icons8.com/fluency/96/000000/school-building.png", courses:[
    { title:"Mathematics 101", yt:"Jf4t6J2Q4qk", desc:"Core math foundations." },
    { title:"Physics Fundamentals", yt:"a8FTr2qMutA", desc:"Intro to physics concepts." }
  ]},
  { name:"Professional Skills", icon:"https://img.icons8.com/fluency/96/000000/business.png", courses:[
    { title:"Public Speaking", yt:"0EkYJ0jT8kQ", desc:"Confidence & delivery." },
    { title:"Project Management", yt:"7s0jS8zjK7A", desc:"Plan & deliver projects." }
  ]},
  { name:"Islamic Education", icon:"https://img.icons8.com/fluency/96/000000/mosque.png", courses:[
    { title:"Quran Reading", yt:"UkgK8eUdpAo", desc:"Tajweed basics." },
    { title:"Hadith Studies", yt:"zDoKq7vD3XU", desc:"Understanding Hadith." }
  ]},
  { name:"Computer & Modern Skills", icon:"https://img.icons8.com/fluency/96/000000/artificial-intelligence.png", courses:[
    { title:"AI Basics", yt:"aircAruvnKk", desc:"Intro to AI concepts." },
    { title:"Web Development", yt:"UB1O30fR-EE", desc:"Build interactive websites." },
    { title:"Data Science Intro", yt:"ua-CiDNNj30", desc:"Data analysis fundamentals." },
    { title:"ADAC", adac:["Office Tools","Graphic Design","Accounting","Database & Programming","Internet Skills","Extra Tools"] }
  ]}
];

// ===== ELEMENTS =====
const EL = {
  pages: document.querySelectorAll('.page'),
  btnLogin: document.getElementById('btn-login'),
  btnGuest: document.getElementById('btn-guest'),
  btnLogout: document.getElementById('btn-logout'),
  userGreet: document.getElementById('user-greet'),
  subjectsRow: document.getElementById('subjects-row'),
  coursesRow: document.getElementById('courses-row'),
  levelsRow: document.getElementById('levels-row'),
  levelSubjectName: document.getElementById('level-subject-name'),
  subjectName: document.getElementById('subject-name'),
  btnBackHome: document.getElementById('btn-back-home'),
  btnBackCourses: document.getElementById('btn-back-courses'),
  btnBackLevels: document.getElementById('btn-back-levels'),
  lessonTitle: document.getElementById('lesson-title'),
  ytPlayer: document.getElementById('yt-player'),
  videoTitle: document.getElementById('video-title'),
  videoDesc: document.getElementById('video-desc'),
  chatMessages: document.getElementById('chat-messages'),
  chatForm: document.getElementById('chat-form'),
  chatInput: document.getElementById('chat-input'),
  emojiBtn: document.getElementById('emoji-btn'),
  emojiPicker: document.getElementById('emoji-picker'),
  btnBackFromChat: document.getElementById('btn-back-home-from-chat'),
  globalChatMessages: document.getElementById('global-chat-messages'),
  globalChatForm: document.getElementById('global-chat-form'),
  globalChatInput: document.getElementById('global-chat-input'),
  btnBackFromAdmin: document.getElementById('btn-back-home-from-admin'),
  adminPage: document.getElementById('page-admin'),
  adminSubjectSelect: document.getElementById('admin-subject-select'),
  adminCourseName: document.getElementById('admin-course-name'),
  adminYtId: document.getElementById('admin-yt-id'),
  adminVideoForm: document.getElementById('admin-video-form'),
  studentTable: document.querySelector('#student-table tbody'),
  openAdminBtn: document.getElementById('open-admin'),
  openLiveBtn: document.getElementById('open-live'),
  btnBackFromLive: document.getElementById('btn-back-home-from-live'),
  liveChatMessages: document.getElementById('live-chat-messages'),
  liveChatForm: document.getElementById('live-chat-form'),
  liveChatInput: document.getElementById('live-chat-input')
};

// ===== STATE =====
let state = {
  user: null,
  currentSubject: null,
  currentCourse: null,
  users: [],
  globalChat: [],
  liveChat: []
};

// ===== HELPERS =====
function showPage(id){
  EL.pages.forEach(p=>p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
}
function escapeHTML(s){ return String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
function addMessage(text,type,container){
  const div = document.createElement('div');
  div.className = `msg ${type}`;
  div.innerHTML = escapeHTML(text) + `<small>${type==='me'?state.user.name:'Instructor'}</small>`;
  container.appendChild(div);
  div.scrollIntoView({behavior:'smooth'});
}

// ===== LOGIN =====
EL.btnLogin.addEventListener('click',()=>{
  const name = (document.getElementById('input-name').value||'Student').trim();
  const role = document.querySelector('input[name="role"]:checked').value;
  state.user = {name, role};
  state.users.push(state.user);
  EL.userGreet.innerText = `Hi, ${name}`;
  populateSubjects();
  if(role==='admin'){ showPage('page-admin'); renderStudentTable(); initAdminSubjects(); }
  else showPage('page-home');
});
EL.btnGuest.addEventListener('click',()=>{
  state.user={name:'Guest',role:'student'};
  state.users.push(state.user);
  EL.userGreet.innerText='Hi, Guest';
  populateSubjects();
  showPage('page-home');
});
EL.btnLogout.addEventListener('click',()=>{ location.reload(); });

// ===== POPULATE SUBJECTS =====
function populateSubjects(){
  EL.subjectsRow.innerHTML='';
  DATA.forEach(s=>{
    const div=document.createElement('div'); div.className='subject-card';
    div.innerHTML=`<img src="${s.icon}"><h3>${s.name}</h3>`;
    div.addEventListener('click',()=>openCourses(s.name));
    EL.subjectsRow.appendChild(div);
  });
}

// ===== OPEN COURSES =====
function openCourses(subjectName){
  state.currentSubject = DATA.find(s=>s.name===subjectName);
  EL.coursesRow.innerHTML='';
  EL.subjectName.innerText = state.currentSubject.name;
  document.getElementById('subject-icon').src = state.currentSubject.icon;
  state.currentSubject.courses.forEach(c=>{
    const div=document.createElement('div'); div.className='course-card';
    div.innerHTML=`<h4>${c.title}</h4>`;
    div.addEventListener('click',()=>{
      if(c.levels) openLevels(c);
      else if(c.adac) openADAC(c);
      else openLesson(c);
    });
    EL.coursesRow.appendChild(div);
  });
  showPage('page-courses');
}

// ===== OPEN LEVELS =====
function openLevels(course){
  state.currentCourse = course;
  EL.levelSubjectName.innerText = course.title;
  EL.levelsRow.innerHTML = '';
  course.levels.forEach(lv=>{
    const div = document.createElement('div'); div.className = 'level-card';
    div.innerText = lv;
    div.addEventListener('click', ()=>openLesson({title: lv + ' - ' + course.title, yt:'', desc:'Level content placeholder'}));
    EL.levelsRow.appendChild(div);
  });
  showPage('page-levels');
}

// ===== OPEN ADAC =====
function openADAC(course){
  state.currentCourse = course;
  EL.levelSubjectName.innerText = course.title;
  EL.levelsRow.innerHTML = '';
  course.adac.forEach(item=>{
    const div = document.createElement('div'); div.className = 'level-card';
    div.innerText = item;
    div.addEventListener('click', ()=>alert('ADAC lesson: '+item));
    EL.levelsRow.appendChild(div);
  });
  showPage('page-levels');
}

// ===== OPEN LESSON =====
function openLesson(course){
  state.currentCourse = course;
  EL.lessonTitle.innerText = course.title;
  EL.videoTitle.innerText = course.title;
  EL.videoDesc.innerText = course.desc || '';
  EL.ytPlayer.src = course.yt ? `https://www.youtube.com/embed/${course.yt}` : '';
  EL.chatMessages.innerHTML='';
  showPage('page-lesson');
}

// ===== NAVIGATION =====
EL.btnBackHome.addEventListener('click', ()=>showPage('page-home'));
EL.btnBackCourses.addEventListener('click', ()=>showPage('page-courses'));
EL.btnBackLevels.addEventListener('click', ()=>showPage('page-levels'));
EL.btnBackFromChat.addEventListener('click', ()=>showPage('page-home'));
EL.btnBackFromAdmin.addEventListener('click', ()=>showPage('page-home'));
EL.btnBackFromLive.addEventListener('click', ()=>showPage('page-home'));

// ===== LESSON CHAT =====
EL.chatForm.addEventListener('submit', e=>{
  e.preventDefault();
  const msgText = EL.chatInput.value.trim();
  if(!msgText) return;
  addMessage(msgText,'me',EL.chatMessages);
  EL.chatInput.value='';
});

// ===== EMOJI PICKER =====
EL.emojiBtn.addEventListener('click', ()=>{
  EL.emojiPicker.style.display = EL.emojiPicker.style.display==='flex'?'none':'flex';
  if(EL.emojiPicker.style.display==='flex' && !EL.emojiPicker.innerHTML){
    const emojis = ['😊','😂','😍','😎','👍','🙏','💡','🎯','🔥','🚀'];
    EL.emojiPicker.innerHTML = emojis.map(e=>`<span>${e}</span>`).join('');
    EL.emojiPicker.querySelectorAll('span').forEach(span=>{
      span.addEventListener('click', ()=>{ EL.chatInput.value += span.innerText; EL.chatInput.focus(); });
    });
  }
});

// ===== GLOBAL CHAT =====
EL.globalChatForm.addEventListener('submit', e=>{
  e.preventDefault();
  const msg = EL.globalChatInput.value.trim();
  if(!msg) return;
  state.globalChat.push({text:msg,user:state.user.name});
  renderGlobalChat();
  EL.globalChatInput.value='';
});
function renderGlobalChat(){
  EL.globalChatMessages.innerHTML='';
  state.globalChat.forEach(m=>{
    addMessage(m.text, m.user===state.user.name?'me':'other', EL.globalChatMessages);
  });
}

// ===== LIVE CLASS =====
EL.openLiveBtn.addEventListener('click', ()=> showPage('page-live-class'));
EL.liveChatForm.addEventListener('submit', e=>{
  e.preventDefault();
  const msg = EL.liveChatInput.value.trim();
  if(!msg) return;
  state.liveChat.push({text:msg,user:state.user.name});
  renderLiveChat();
  EL.liveChatInput.value='';
});
function renderLiveChat(){
  EL.liveChatMessages.innerHTML='';
  state.liveChat.forEach(m=>{
    addMessage(m.text, m.user===state.user.name?'me':'other', EL.liveChatMessages);
  });
}

// ===== ADMIN PANEL =====
function renderStudentTable(){
  EL.studentTable.innerHTML='';
  state.users.forEach(u=>{
    const tr = document.createElement('tr');
    tr.innerHTML=`<td>${u.name}</td><td>${u.role}</td>`;
    EL.studentTable.appendChild(tr);
  });
}
function initAdminSubjects(){
  EL.adminSubjectSelect.innerHTML = '';
  DATA.forEach(s=>{
    const opt = document.createElement('option'); opt.value = s.name; opt.innerText = s.name;
    EL.adminSubjectSelect.appendChild(opt);
  });
}
EL.adminVideoForm.addEventListener('submit', e=>{
  e.preventDefault();
  const subName = EL.adminSubjectSelect.value;
  const courseName = EL.adminCourseName.value;
  const ytId = EL.adminYtId.value;
  const subject = DATA.find(s=>s.name===subName);
  subject.courses.push({title:courseName, yt:ytId, desc:'Added by Admin'});
  alert('Video added!');
  EL.adminCourseName.value = EL.adminYtId.value = '';
  renderStudentTable();
});
