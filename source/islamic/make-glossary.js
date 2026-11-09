/* Builds the Islamic Studies glossary (Arabic → English and sounds) used by the 🇬🇧 button in every Islamic lesson:
   it collects the Arabic from Islamic Quest, the Memory Trainer, the Exam check keywords and the lessons, plus the
   hand-written names, headings and letters below (which win), and writes it into islamic/islamic.js between the
   GLOSSARY markers. Run from the repo root after adding Arabic: node source/islamic/make-glossary.js */
const fs=require('fs');const out=new Map();
const add=(a,en,tr)=>{a=String(a).replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();if(!a||!/[\u0600-\u06FF]/.test(a))return;const p=out.get(a)||{};if(en&&!/[\u0600-\u06FF]/.test(en)&&!p.en)p.en=en.replace(/<[^>]+>/g,'').trim();if(tr&&!p.tr)p.tr=tr;out.set(a,p);};
// trainer cards
const t=fs.readFileSync('islamic-trainer.html','utf8');
for(const m of t.matchAll(/a:'((?:[^'\\]|\\.)*)',tr:'((?:[^'\\]|\\.)*)',m:'((?:[^'\\]|\\.)*)'/g))add(m[1],m[3].replace(/\\'/g,"'"),m[2].replace(/\\'/g,"'"));
// quiz: T('ar','en','tr') and o/oe/otr arrays and tiles [ar,tr]
const q=fs.readFileSync('islamic-quiz.html','utf8');const un=s=>s.replace(/\\'/g,"'");
for(const m of q.matchAll(/T\('((?:[^'\\]|\\.)*)','((?:[^'\\]|\\.)*)'(?:,'((?:[^'\\]|\\.)*)')?\)/g))add(un(m[1]),un(m[2]),m[3]&&un(m[3]));
const arr=s=>[...s.matchAll(/'((?:[^'\\]|\\.)*)'/g)].map(x=>un(x[1]));
for(const m of q.matchAll(/o:\[([^\]]*)\],oe:\[([^\]]*)\](?:,otr:\[([^\]]*)\])?/g)){const o=arr(m[1]),oe=arr(m[2]),ot=m[3]?arr(m[3]):[];o.forEach((x,i)=>add(x,oe[i],ot[i]));}
for(const m of q.matchAll(/\['((?:[^'\\]|\\.)*)','((?:[^'\\]|\\.)*)'\]/g))add(un(m[1]),'',un(m[2]));
// exam keys (sounds)
const j=fs.readFileSync('islamic/islamic.js','utf8');
for(const m of j.slice(j.indexOf('const EXAM_KEYS'),j.indexOf('function markKeys')).matchAll(/\['((?:[^'\\]|\\.)*)','((?:[^'\\]|\\.)*)'\]/g))add(un(m[1]),'',un(m[2]));
// lessons: ar('..','..','..'), aw('..','..'), blocks ['ar','tr','en']
for(const f of fs.readdirSync('islamic').filter(f=>/^i0\d/.test(f))){const h=fs.readFileSync('islamic/'+f,'utf8');
  for(const m of h.matchAll(/\bar\('((?:[^'\\]|\\.)*)','((?:[^'\\]|\\.)*)'(?:,'((?:[^'\\]|\\.)*)')?/g))add(un(m[1]),un(m[2]),m[3]&&un(m[3]));
  for(const m of h.matchAll(/\['((?:[^'\\]|\\.)*)','((?:[^'\\]|\\.)*)','((?:[^'\\]|\\.)*)'/g)){if(/[\u0600-\u06FF]/.test(m[1])&&!/[\u0600-\u06FF]/.test(m[2]))add(un(m[1]),un(m[3]),un(m[2]));}
  for(const m of h.matchAll(/\baw\('((?:[^'\\]|\\.)*)','((?:[^'\\]|\\.)*)'\)/g))add(un(m[1]),'',un(m[2]));}
// hand-written: names, headings, letters, common words
const H=[['الحديث الأول','Hadith 1'],['الحديث الثاني','Hadith 2'],['الحديث الثالث','Hadith 3'],['السؤال','question'],['الإجابة','the answer'],
['العقيدة','Belief'],['الحديث','Hadith'],['الحديث وعلومه','Hadith and its sciences'],['السيرة','Life of the Prophet ﷺ'],['الفقه','Fiqh'],['التهذيب','Manners'],['الثقافة الإسلامية','Islamic culture'],
['جبريل','Jibreel'],['ميكائيل','Mikail'],['ملك الموت','the Angel of Death'],['الملائكة','the angels'],['ملائكة','angels'],['الجان','the jinn'],['آدم','Adam'],['الإنسان','mankind'],
['نور','light'],['نار','fire'],['طين','clay'],['الطاعة','obedience'],['الإيمان','faith'],['من','from'],['على','on'],['في','in'],['و','waaw'],['ا','alif'],['ة','taa\' marbooTa'],['ه','haa\''],
['ى','alif maqsoora'],['ي','yaa\''],['ء','hamza'],['أ','alif with hamza'],['إ','alif with hamza below'],['ؤ','waaw with hamza'],['ـها','-haa'],['ـه','-hu'],['ها','-haa'],['ال','al- (the)'],['ـية','-iyya'],
['السلام عليكم','Peace be upon you'],['هيا بنا','Let\'s go'],['ما شاء الله','Maa shaa\' Allaah (well done!)'],['أحسنت','Well done'],['ممتاز','Excellent'],['بالتوفيق إن شاء الله','Good luck, God willing'],
['اكتب','write'],['دون','write down'],['أكمل','complete'],['ضع خطا تحت','underline'],['ضع علامة','put a mark'],['ضع علامة ( √ ) أو ( × )','put a tick or a cross'],['عرف','define'],['أجب','answer'],['حدد','decide'],['وضح','explain'],
['ثمرات','benefits'],['وظيفة','job'],['فطرت','made by nature'],['جبلت','made by nature'],['وجبلت','and made by nature'],['ركن من أركان','one of the pillars of'],['الإخلاص','sincerity'],['النية','intention'],['الهجرة','Hijra'],['الرياء','showing off'],
['شروط','conditions'],['يصيبها','gets it'],['غار','cave'],['حراء','Hira'],['العلق','Al-\'Alaq'],['رمضان','Ramadan'],['أربعين','forty'],['الوحي','revelation'],['لغة','in language'],['شرعا','in Islamic law'],['الناموس','an-Naamoos'],
['ورقة بن نوفل','Waraqa ibn Nawfal'],['خديجة','Khadijah'],['مكة','Makkah'],['الصلاة','prayer'],['واجبات','required acts'],['الواجب','the required (waajib)'],['السنة','the sunnah'],['المكروه','the disliked (makrooh)'],['مبطلات','things that break'],
['يثاب','is rewarded'],['يأثم','is sinful'],['فاعل','doer'],['تارك','leaver'],['فاعله','its doer'],['تاركه','its leaver'],['فاعلها','its doer'],['تاركها','its leaver'],['ولا','and not'],['ما','what'],
['الغيبة','backbiting'],['السخرية','mocking'],['النميمة','spreading tales'],['آفات اللسان','sins of the tongue'],['أسباب','causes'],['يكرهونه','they hate it'],['احتقار','looking down on'],['نقل','carrying'],['ذا الوجهين','the two-faced one'],
['مسؤول','responsible'],['غير','not'],['غير مسؤول','irresponsible'],['المسؤولية','responsibility'],['الدينية','religious'],['الشخصية','personal'],['الأسرية','family'],['المجتمعية','society'],['تجاه','towards'],['الدين','religion'],
['العبادات','acts of worship'],['المعاملات','dealings with people'],['البيع والشراء','buying and selling'],['هؤلاء','these people'],['الله','Allah'],['تعالى','the Exalted'],['النبي','the Prophet'],['النبي ﷺ','the Prophet ﷺ'],['ﷺ','ﷺ'],
['ط','taa\''],['ع','\'ayn'],['حال','how he was'],['بعد','after'],['حال … بعد','how he was … after'],['الت','at-ta-'],['يع','-ee\''],['يد','-eed'],['واجب','required'],['سنة','sunnah'],['مبطل','breaks it'],
['مسـ','mas-'],['ول','-ool'],['الشخص','ash-shakhs-'],['الأسر','al-usr-'],['ة ى أ','taa\' marbooTa, alif maqsoora, hamza']];
H.forEach(([a,e])=>{const p=out.get(a)||{};p.en=e;out.set(a,p);}); // hand-written English wins
const rows=[...out.entries()].filter(([a,p])=>p.en||p.tr).map(([a,p])=>[a,p.en||'',p.tr||'']);
rows.sort((a,b)=>a[0].localeCompare(b[0]));
const js=fs.readFileSync('islamic/islamic.js','utf8');const A='/* GLOSSARY START (generated by source/islamic/make-glossary.js) */',B='/* GLOSSARY END */';
const body=A+'\nconst ISL_GLOSS='+JSON.stringify(rows).replace(/\],\[/g,'],\n[')+';\n'+B;
fs.writeFileSync('islamic/islamic.js',js.includes(A)?js.slice(0,js.indexOf(A))+body+js.slice(js.indexOf(B)+B.length):js.replace('/* ---------- 🇬🇧 English and 🔤 Sounds buttons ---------- */',body+'\nISL_GLOSS.forEach(([a,e,t])=>gloss(a,e,t));\n\n/* ---------- 🇬🇧 English and 🔤 Sounds buttons ---------- */'));
console.log(rows.length,'glossary entries written to islamic/islamic.js');
