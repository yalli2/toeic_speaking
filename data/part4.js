(function(){
const T=(table,intro,qs,o={})=>Object.assign({table,intro,qs:qs.map((q,i)=>Object.assign({qn:8+i,resp:i<2?15:30},q))},o);
window.CH={id:'part4',title:'Part 4 · 표 보고 질문에 답하기 <small style="font-size:.55em;opacity:.8">Respond Using Information (Q8–10)</small>',subtitle:'일정표나 안내문을 45초 동안 읽은 뒤, 전화로 문의하는 사람의 세 가지 질문에 표의 정보를 이용해 답합니다.',
meta:['표 읽기 45초','준비 각 3초','답변 15초 · 15초 · 30초','평가: + 정보의 정확성'],
sections:[
{title:'기초 쌓기 · 표 정보 말하기',desc:'표의 정보를 완전한 문장으로 바꾸는 표현을 익혀요. 시간·장소·사람·요금을 정확하게 말하는 것이 핵심입니다.',blocks:[
 {type:'examples',title:'① 일시 · 장소',items:[
  {en:'The conference will be held on May 14 at the Grand Hotel.',ko:'회의는 5월 14일 그랜드 호텔에서 열립니다.'},
  {en:'It starts at 9:30 a.m. and ends at 4 p.m.',ko:'오전 9시 30분에 시작해서 오후 4시에 끝납니다.'},
  {en:'The workshop will take place in Room 204 on the second floor.',ko:'워크숍은 2층 204호에서 진행됩니다.'}]},
 {type:'examples',title:'② 사람 · 내용 · 요금',items:[
  {en:'At 11 a.m., Dr. Julia Hart will give a talk on healthy eating.',ko:'오전 11시에 Julia Hart 박사가 건강한 식습관에 대해 강연합니다.'},
  {en:'The registration fee is fifty dollars per person, and it includes lunch.',ko:'등록비는 1인당 50달러이고 점심이 포함됩니다.'},
  {en:'Mr. Evans will lead a session called "Marketing on Social Media."',ko:'Mr. Evans가 “소셜 미디어 마케팅”이라는 세션을 진행합니다.'}]},
 {type:'examples',title:'③ 잘못된 정보 바로잡기 (Q9)',items:[
  {en:'I\'m sorry, but you have the wrong information. The meeting has been moved to Thursday.',ko:'죄송하지만 잘못 알고 계십니다. 회의는 목요일로 옮겨졌습니다.'},
  {en:'Actually, that session has been canceled, so you don\'t need to attend it.',ko:'사실 그 세션은 취소되어서 참석하지 않으셔도 됩니다.'},
  {en:'Don\'t worry. The lunch is included in the registration fee.',ko:'걱정 마세요. 점심은 등록비에 포함되어 있습니다.'}]},
 {type:'examples',title:'④ 여러 항목 요약하기 (Q10)',items:[
  {en:'There are two sessions about leadership. First, at 10 a.m., Kevin Brown will talk about team building. Then, at 2 p.m., Lisa Moon will lead a workshop on decision making.',ko:'리더십에 관한 세션이 두 개 있습니다. 먼저 오전 10시에 Kevin Brown이 팀 빌딩에 대해 이야기하고, 오후 2시에 Lisa Moon이 의사 결정 워크숍을 진행합니다.'},
  {en:'You have three interviews in the afternoon. The first one is at 1 p.m. with Sarah Kim, who is applying for the designer position.',ko:'오후에 면접이 세 건 있습니다. 첫 번째는 오후 1시, 디자이너 직에 지원한 Sarah Kim과의 면접입니다.'}]},
 {type:'fill',title:'빈칸 채우기 · 표 표현',items:[
  {ko:'세미나는 3층 회의실에서 열립니다.',s:'The seminar will be held ___ the conference room ___ the third floor.',a:['in','on']},
  {ko:'그 강좌는 Ms. Diaz가 가르칩니다.',s:'The course is taught ___ Ms. Diaz.',a:['by']},
  {ko:'점심은 정오부터 오후 1시까지입니다.',s:'Lunch is ___ noon ___ 1 p.m.',a:['from','to|until']},
  {ko:'그 세션은 취소되었습니다.',s:'That session has been ___.',a:['canceled|cancelled']},
  {ko:'등록비에 저녁 식사가 포함되어 있습니다.',s:'Dinner is ___ in the registration fee.',a:['included']}]}
]},
{title:'스텝별 전략 익히기',desc:'45초 동안 표의 구조를 파악하고, 질문 유형별 답변 패턴에 맞춰 대답해요.',blocks:[
 {type:'template',html:'<b>표 읽기 45초</b> 제목·날짜·장소 → 시간대별 항목 → 특이 사항(취소, 변경, 별표*) 체크<span class="k">별표(*)·괄호·“canceled / moved” 같은 표시는 Q9 오답 정보 질문에 자주 나와요.</span><b>Q8 (15초)</b> 기본 정보 — 언제, 어디서, 얼마<span class="k">The event will be held on ___ at ___. It starts at ___.</span><b>Q9 (15초)</b> 잘못된 정보 정정 또는 확인<span class="k">I\'m sorry, but you have the wrong information. Actually, ___.</span><b>Q10 (30초)</b> 조건에 맞는 항목 2개 이상 요약<span class="k">There are two ___. First, at ___, ___. Second, at ___, ___.</span>'},
 {type:'table',title:'예시 · 학생 리더십 워크숍',items:[
  T({caption:'Student Leadership Workshop',sub:'Saturday, April 18 · Hillcrest High School, Main Hall',head:['Time','Session','Speaker'],rows:[
    ['9:00 – 9:30 a.m.','Welcome & Introduction','Principal Mark Lee'],
    ['9:30 – 10:30 a.m.','Speaking with Confidence','Amanda Ross'],
    ['10:30 – 11:30 a.m.','Planning School Events','Jason Park'],
    ['11:30 a.m. – 12:30 p.m.','Lunch (cafeteria)',''],
    ['12:30 – 1:30 p.m.','<s>Teamwork Games</s> → <b>Canceled</b>','Brian Cho'],
    ['1:30 – 2:30 p.m.','Leading a Student Club','Amanda Ross']],foot:'Registration: $15 (lunch included)'},
   'Hi, I\'m a student council member, and I\'m planning to attend the leadership workshop next week. I\'d like to check some details.',[
   {q:'Where will the workshop take place, and what time does it start?',kws:['Main Hall','Hillcrest','9|nine','April 18|Saturday'],model:'The workshop will take place in the Main Hall at Hillcrest High School. It starts at 9 a.m. on Saturday, April 18.',ko:'워크숍은 Hillcrest 고등학교 대강당에서 열립니다. 4월 18일 토요일 오전 9시에 시작합니다.'},
   {q:'I heard I need to bring my own lunch. Is that right?',kws:['wrong|actually|don\'t','lunch','included','fifteen|15'],model:'Actually, you don\'t need to bring your own lunch. Lunch is included in the fifteen-dollar registration fee, and it will be served in the cafeteria.',ko:'사실 점심은 가져오지 않으셔도 됩니다. 15달러 등록비에 점심이 포함되어 있고 구내식당에서 제공됩니다.'},
   {q:'I really like Amanda Ross. Could you tell me about all the sessions she is leading?',kws:['two','Amanda','9:30|nine thirty','Speaking with Confidence|confidence','1:30|one thirty','Student Club|club'],model:'Sure. Amanda Ross is leading two sessions. First, from 9:30 to 10:30 a.m., she will lead a session called Speaking with Confidence. Then, from 1:30 to 2:30 p.m., she will talk about leading a student club.',ko:'물론이죠. Amanda Ross는 세션 두 개를 진행합니다. 먼저 오전 9시 30분부터 10시 30분까지 “자신 있게 말하기” 세션을, 오후 1시 30분부터 2시 30분까지 학생 동아리 이끌기에 대해 이야기합니다.'}])]},
 {type:'mcq',title:'확인 문제 · 표 정보 빠르게 찾기',desc:'위 워크숍 표를 보고 답하세요.',items:[
  {q:'점심시간 직후에 원래 예정되어 있던 세션은?',opts:['Planning School Events','Teamwork Games','Leading a Student Club'],a:1,exp:'12:30 Teamwork Games — 취소됨'},
  {q:'Jason Park가 진행하는 세션의 시간은?',opts:['9:30 – 10:30 a.m.','10:30 – 11:30 a.m.','1:30 – 2:30 p.m.'],a:1},
  {q:'“Can I join the Teamwork Games session?”에 대한 가장 알맞은 답은?',opts:['Yes, it starts at 12:30 p.m.','I\'m sorry, but that session has been canceled.','Yes, it is led by Amanda Ross.'],a:1}]}
]},
{title:'Hackers Practice',desc:'표를 45초 동안 읽은 뒤 질문을 듣고 답하세요. 질문 텍스트는 숨겨 두고 듣기만으로 도전해 보세요.',blocks:[
 {type:'table',title:'연습 · 컴퓨터 보안 콘퍼런스',items:[
  T({caption:'Global Tech Computer Security Conference',sub:'June 30 – July 1 · Riverside Convention Center',head:['Date / Time','Session','Speaker'],rows:[
    ['June 30, 10:00 a.m.','Keynote: Security Trends This Year','Helen Grant'],
    ['June 30, 1:00 p.m.','Workshop: Protecting Your Passwords','David Lim'],
    ['June 30, 3:00 p.m.','Panel: Safe Online Shopping','Various experts'],
    ['July 1, 10:00 a.m.','Workshop: Securing Mobile Devices','David Lim'],
    ['July 1, 1:00 p.m.','Lecture: Cloud Storage Safety','Nora Hughes']],foot:'Fee: $120 for both days / $70 for one day · Parking is free'},
   'Hello, I\'m interested in your security conference, but I lost the schedule. Can I ask you a few questions?',[
   {q:'When does the conference start, and where is it?',kws:['June 30','10|ten','Riverside','Convention Center'],model:'The conference starts on June 30 at 10 a.m. It will be held at the Riverside Convention Center.',ko:'콘퍼런스는 6월 30일 오전 10시에 시작하며 Riverside 컨벤션 센터에서 열립니다.'},
   {q:'I can only come on the first day. How much will that cost?',kws:['seventy|70','one day','dollars'],model:'If you only come on the first day, the fee is seventy dollars. Also, parking is free.',ko:'첫날만 오시면 참가비는 70달러입니다. 그리고 주차는 무료입니다.'},
   {q:'Could you give me the details of the workshops that are scheduled?',kws:['two','workshops|workshop','June 30','1|one','Passwords|passwords','July 1','Mobile|mobile','David Lim'],model:'Sure. There are two workshops, and both are led by David Lim. The first one is on June 30 at 1 p.m., and it is about protecting your passwords. The second one is on July 1 at 10 a.m., and it is about securing mobile devices.',ko:'네. 워크숍은 두 개이며 모두 David Lim이 진행합니다. 첫 번째는 6월 30일 오후 1시, 비밀번호 보호에 관한 것이고, 두 번째는 7월 1일 오전 10시, 모바일 기기 보안에 관한 것입니다.'}])]}
]},
{title:'유형별 공략하기 · 표 유형별 실전',desc:'자주 나오는 다섯 가지 표 유형을 연습해요. 표마다 정보의 배치가 다르니 45초 안에 구조를 파악하는 연습을 하세요.',blocks:[
 {type:'table',title:'유형 ① 면접 일정표',badge:'Interview',noDir:true,items:[
  T({caption:'Interview Schedule — Brightway Design Co.',sub:'Position: Graphic Designer · Wednesday, March 11 · Room 305',head:['Time','Applicant','Current Job','Experience'],rows:[
    ['9:00 a.m.','Olivia Chen','Freelance designer','3 years'],
    ['10:00 a.m.','Marcus Bell','Art teacher','5 years'],
    ['11:00 a.m.','<s>Yuna Han</s> <b>(canceled)</b>','Web designer','2 years'],
    ['1:30 p.m.','Ethan Moore','Design studio assistant','4 years'],
    ['2:30 p.m.','Grace Lopez','Magazine designer','6 years']]},
   'Hi, this is Rachel. I\'m doing the interviews for the designer position tomorrow, but I left the schedule at home. Can you help me?',[
   {q:'What time is my first interview, and who is it with?',kws:['9|nine','Olivia Chen','freelance'],model:'Your first interview is at 9 a.m. with Olivia Chen. She is currently working as a freelance designer.',ko:'첫 면접은 오전 9시, Olivia Chen과 진행됩니다. 그녀는 현재 프리랜서 디자이너입니다.',mv:'M'},
   {q:'I think I have an interview with Yuna Han at 11. Is that correct?',kws:['sorry|actually|wrong','canceled|cancelled','Yuna Han'],model:'I\'m sorry, but that interview has been canceled. So, you don\'t have an interview at 11 a.m.',ko:'죄송하지만 그 면접은 취소되었습니다. 그래서 오전 11시에는 면접이 없습니다.',mv:'M'},
   {q:'Could you tell me about the applicants who have five or more years of experience?',kws:['two','Marcus Bell','10|ten','art teacher','five|5','Grace Lopez','2:30|two thirty','magazine','six|6'],model:'Sure. There are two applicants with five or more years of experience. First, at 10 a.m., you will meet Marcus Bell. He is an art teacher with five years of experience. Second, at 2:30 p.m., you will meet Grace Lopez, who is a magazine designer with six years of experience.',ko:'네. 경력 5년 이상인 지원자는 두 명입니다. 먼저 오전 10시에 경력 5년의 미술 교사 Marcus Bell을 만나고, 오후 2시 30분에는 경력 6년의 잡지 디자이너 Grace Lopez를 만납니다.',mv:'M'}],{qv:'F2'})]},
 {type:'table',title:'유형 ② 수업 시간표',badge:'Class schedule',noDir:true,items:[
  T({caption:'Maple Community Center — Cooking Classes',sub:'September · Registration fee: $40 per class',head:['Day / Time','Class','Instructor'],rows:[
    ['Mon, 6:00–8:00 p.m.','Italian Pasta Basics','Marco Rossi'],
    ['Tue, 10:00 a.m.–12:00 p.m.','Easy Korean Side Dishes','Jiwoo Kang'],
    ['Wed, 6:00–8:00 p.m.','Baking Bread at Home','Anna White'],
    ['Fri, 7:00–9:00 p.m.','Cheese and Wine Pairing','Marco Rossi'],
    ['Sat, 10:00 a.m.–1:00 p.m.','Family Cupcake Party*','Anna White']],foot:'* Children under 12 must come with a parent.'},
   'Hello. I saw your cooking class schedule online, and I\'m interested in signing up. Can I ask a few questions?',[
   {q:'How much is the registration fee, and when is the first class?',kws:['forty|40','dollars','Monday','6|six'],model:'The registration fee is forty dollars per class. The first class is on Monday from 6 to 8 p.m.',ko:'등록비는 수업당 40달러입니다. 첫 수업은 월요일 오후 6시부터 8시까지입니다.'},
   {q:'I want to bring my eight-year-old son to the cupcake class. Can he come by himself?',kws:['parent|you','under 12|twelve','must|need','Saturday'],model:'I\'m afraid he can\'t come by himself. Children under twelve must come with a parent, so you need to attend the Saturday class with him.',ko:'아쉽지만 혼자서는 올 수 없습니다. 12세 미만 어린이는 부모와 함께 와야 하므로 토요일 수업에 함께 참석하셔야 합니다.'},
   {q:'I heard Marco Rossi is a great chef. Can you tell me about his classes?',kws:['two','Marco','Monday','Italian|pasta','Friday','7|seven','cheese|wine'],model:'Sure. Marco Rossi teaches two classes. First, he teaches Italian Pasta Basics on Mondays from 6 to 8 p.m. Also, he teaches a class called Cheese and Wine Pairing on Fridays from 7 to 9 p.m.',ko:'네. Marco Rossi는 두 개의 수업을 가르칩니다. 월요일 오후 6~8시 이탈리안 파스타 기초, 그리고 금요일 오후 7~9시 치즈와 와인 페어링 수업입니다.'}])]},
 {type:'table',title:'유형 ③ 출장 · 여행 일정표',badge:'Itinerary',noDir:true,items:[
  T({caption:'Business Trip Itinerary — Daniel Park',sub:'Sales Manager, NovaTech',head:['Date','Time','Details'],rows:[
    ['Mon, Nov 9','8:20 a.m.','Depart Seoul (Incheon) → Singapore, SkyAir 205'],
    ['','3:45 p.m.','Arrive Singapore · Check in: Harbor View Hotel'],
    ['Tue, Nov 10','10:00 a.m.','Meeting with Lim Electronics (client office)'],
    ['','7:00 p.m.','Dinner with regional sales team'],
    ['Wed, Nov 11','9:30 a.m.','Product presentation at Marina Expo Hall'],
    ['','6:10 p.m.','Depart Singapore → Seoul, SkyAir 208']]},
   'Hi, this is Daniel. I\'m on my way to the airport, but I can\'t open my travel schedule. Could you check it for me?',[
   {q:'What time does my flight leave, and what is the flight number?',kws:['8:20|eight twenty','SkyAir|Sky Air','205|two oh five|two zero five'],model:'Your flight leaves at 8:20 a.m. today from Incheon, and the flight number is SkyAir 205.',ko:'항공편은 오늘 오전 8시 20분 인천에서 출발하며, 편명은 SkyAir 205입니다.'},
   {q:'Where am I staying in Singapore?',kws:['Harbor View','Hotel','check in|3:45'],model:'You are staying at the Harbor View Hotel. You will check in after you arrive at 3:45 p.m.',ko:'Harbor View 호텔에 묵으십니다. 오후 3시 45분 도착 후 체크인하시면 됩니다.'},
   {q:'Can you tell me everything I have scheduled after I arrive on Monday?',kws:['Tuesday','10|ten','Lim Electronics','dinner','7|seven','Wednesday','9:30|nine thirty','presentation','6:10|six ten'],model:'Sure. On Tuesday at 10 a.m., you have a meeting with Lim Electronics at their office, and at 7 p.m., you will have dinner with the regional sales team. Then, on Wednesday at 9:30 a.m., you will give a product presentation at Marina Expo Hall. Finally, your flight back to Seoul leaves at 6:10 p.m.',ko:'네. 화요일 오전 10시 Lim Electronics 사무실에서 미팅, 오후 7시 지역 영업팀과 저녁 식사가 있습니다. 수요일 오전 9시 30분에는 Marina 엑스포 홀에서 제품 발표를 하시고, 오후 6시 10분에 서울행 비행기가 출발합니다.'}])]},
 {type:'table',title:'유형 ④ 축제 · 행사 안내',badge:'Event',noDir:true,items:[
  T({caption:'Greenfield Youth Festival',sub:'Saturday, May 23 · Greenfield Park · Free admission',head:['Time','Event','Location'],rows:[
    ['10:00 a.m.','Opening Ceremony','Main Stage'],
    ['11:00 a.m. – 1:00 p.m.','Family Softball Game','Field A'],
    ['11:30 a.m. – 2:00 p.m.','Food Trucks','Parking Lot B'],
    ['1:00 p.m.','Student Dance Contest','Main Stage'],
    ['3:00 p.m.','Soccer Tournament (sign-up required)','Field B'],
    ['6:00 p.m.','Live Concert: The Blue Notes','Main Stage']]},
   'Hi. My friends and I are planning to go to the Greenfield Youth Festival. Can I ask you some questions?',[
   {q:'What date is the festival, and how much are the tickets?',kws:['May 23|Saturday','free','admission|tickets'],model:'The festival is on Saturday, May 23, and admission is free, so you don\'t need to buy tickets.',ko:'축제는 5월 23일 토요일이고, 입장료는 무료라서 표를 살 필요가 없습니다.'},
   {q:'We want to join the soccer tournament. Can we just show up?',kws:['sign up|sign-up','required|need','3|three','Field B'],model:'No, you need to sign up in advance because registration is required. The tournament starts at 3 p.m. on Field B.',ko:'아니요, 등록이 필요하니 미리 신청하셔야 합니다. 토너먼트는 오후 3시 B 구장에서 시작합니다.'},
   {q:'Could you tell me about all the events on the Main Stage?',kws:['three','Opening|opening ceremony','10|ten','dance','1|one','concert','6|six','Blue Notes'],model:'Sure. There are three events on the Main Stage. First, the opening ceremony starts at 10 a.m. Then, at 1 p.m., there will be a student dance contest. Finally, at 6 p.m., a band called The Blue Notes will perform a live concert.',ko:'네. 메인 무대에는 세 가지 행사가 있습니다. 먼저 오전 10시 개막식, 오후 1시 학생 댄스 대회, 그리고 오후 6시 The Blue Notes의 라이브 콘서트가 있습니다.'}],{qv:'M2'})]}
]},
{title:'Part Test',desc:'표를 45초 동안 읽고 Q8~Q10에 연속으로 답해 보세요.',blocks:[
 {type:'table',title:'Part 4 실전 테스트',items:[
  T({caption:'Seminar: Buying Your First Home',sub:'Saturday, October 17 · Oakwood Public Library, 3rd Floor Meeting Room',head:['Time','Topic','Speaker'],rows:[
    ['9:30 – 10:00 a.m.','Registration & Coffee',''],
    ['10:00 – 11:00 a.m.','Setting Your Budget','Kelly Adams, financial advisor'],
    ['11:00 a.m. – 12:00 p.m.','Choosing the Right Neighborhood','Tom Reed, real estate agent'],
    ['12:00 – 1:00 p.m.','Lunch (provided)',''],
    ['1:00 – 2:00 p.m.','Understanding Home Loans','Kelly Adams, financial advisor'],
    ['2:00 – 3:00 p.m.','Q&A Session','All speakers']],foot:'Fee: $30 · Seats are limited to 50 people'},
   'Hello, I\'m thinking about attending the home buying seminar. Could you answer a few questions for me?',[
   {q:'Where is the seminar going to be held, and what time should I arrive?',kws:['Oakwood','Library','third floor|3rd','9:30|nine thirty'],model:'The seminar will be held in the meeting room on the third floor of Oakwood Public Library. Registration starts at 9:30 a.m., so you should arrive by then.',ko:'세미나는 Oakwood 공공 도서관 3층 회의실에서 열립니다. 등록이 오전 9시 30분에 시작하니 그때까지 도착하시면 됩니다.'},
   {q:'I heard that I need to buy my own lunch. Is that true?',kws:['wrong|actually|don\'t','lunch','provided','12|noon'],model:'No, actually lunch is provided. It will be served from 12 to 1 p.m., so you don\'t need to buy your own.',ko:'아니요, 사실 점심은 제공됩니다. 12시부터 1시까지 제공되니 따로 사지 않으셔도 됩니다.'},
   {q:'I\'m especially interested in money matters. Can you tell me about the sessions led by the financial advisor?',kws:['two','Kelly Adams','10|ten','budget','1|one','loans|loan'],model:'Of course. There are two sessions led by Kelly Adams, a financial advisor. First, from 10 to 11 a.m., she will talk about setting your budget. Then, after lunch, from 1 to 2 p.m., she will explain how to understand home loans.',ko:'물론이죠. 재무 상담사 Kelly Adams가 진행하는 세션이 두 개 있습니다. 먼저 오전 10~11시 예산 세우기, 점심 후 오후 1~2시 주택 담보 대출 이해하기 세션입니다.'}])]}
]}
]};
})();
