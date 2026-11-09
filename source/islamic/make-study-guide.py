# Run from the repo root: python3 source/islamic/make-study-guide.py, then print the PDF (see README.md).
# Generates source/islamic/study-guide-source.html (run from the repo root).
import html
E=html.escape
def AR(t): return f'<span class="ar">{t}</span>'
def K(t): return f'<span class="kw">{t}</span>'
SEC=[
 dict(n='Q2',ar='العقيدة',en='Belief: the angels',emo='👼',col='#b8862b',lesson='Lesson 2',items=[
  dict(id='(a)',kind=('اكتب','uktub','write'),q=f'اكتب {K("وظيفة")} كل ملك في الجدول التالي',en='Write the <b>job</b> of each angel in the following table.',
   rows=[('جبريل ← ملك الوحي','malak al-wahy','Jibreel: the angel of revelation 📜'),('ميكائيل ← موكل بالأرزاق والنبات والمطر','muwakkal bil-arzaaq wan-nabaat wal-matar','Mikail: in charge of provisions, plants and rain 🌧️🌱🍞'),('ملك الموت ← قبض الأرواح','qabd al-arwaah','the Angel of Death: taking the souls ⏳')],
   trick='Mikail\'s chain: rain 🌧️ grows plants 🌱, plants give food 🍞. The answer lists them food, plants, rain (read it right to left!).'),
  dict(id='(b)',kind=('دون','dawwin','write down a list'),q=f'دون أربعة من {K("ثمرات")} الإيمان {K("بالملائكة")} .',en='Write down four of the <b>benefits</b> of believing in <b>the angels</b>.',
   rows=[('محبة الملائكة لطاعتهم لله','mahabbat al-malaa\'ika li-taa\'atihim lillaah','❤️ loving the angels because they obey Allah'),('التخلق بأخلاق الملائكة','at-takhalluq bi-akhlaaq al-malaa\'ika','🪞 taking on the good manners of the angels'),('العلم بعظمة الله وقوته','al-\'ilm bi-\'azamat Allaah wa quwwatih','🌌 knowing the greatness and power of Allah'),('شكر الله تعالى على عنايته ببني آدم','shukr Allaah ta\'aalaa \'alaa \'inaayatihi bi-banee Aadam','🙏 thanking Allah the Exalted for His care for the children of Adam')],
   trick='<b>L</b>ovely <b>M</b>anners <b>G</b>et <b>T</b>hanks: love ❤️, manners 🪞, greatness 🌌, thanks 🙏.',
   warn=f'Q3 (b) also asks for {AR("ثمرات")}. Look at the next word: {AR("الملائكة")} (angels) → this list; {AR("الإخلاص")} (sincerity) → the Q3 list.'),
  dict(id='(c)',kind=('أكمل','akmil','complete: fill the gap'),q='أكمل ما يأتي',en='Complete the following.',
   rows=[(f'خلق الله تعالى {K("الملائكة")} الكرام {K("من")} …… نور','noor','angels from … <b>light</b> 💡'),(f'{K("فطرت")} الملائكة {K("وجبلت")} على …… الطاعة','at-taa\'a','made by nature for … <b>obedience</b> 🙇'),
         (f'الإيمان بالملائكة {K("ركن من أركان")} …… الإيمان','al-eemaan','a pillar of … <b>faith</b> 🏛️'),(f'خلق الله تعالى {K("الإنسان")} {K("من")} …… طين','teen','mankind from … <b>clay</b> 🟫')],
   trick=f'Hadith 1 gives two answers: angels from {AR("نور")} 💡, jinn from {AR("نار")} 🔥, Adam from clay {AR("طين")} 🟫. Light has the round {AR("و")} (a bulb); fire has the tall {AR("ا")} (a flame).')]),
 dict(n='Q3',ar='الحديث وعلومه',en='Hadith: sincerity and Hijra',emo='🤲',col='#17935b',lesson='Lesson 3',items=[
  dict(id='(a)',kind=('ضع خطا تحت','da\' khattan taht','underline the right choice'),q='ضع خطا تحت المكمل الصحيح لكل مما يأتي',en='Underline the correct ending for each.',
   rows=[(f'{K("ترك بلد")} الشرك إلى بلد الإسلام ← <u>الهجرة</u>','al-hijra','leaving a land → <b>Hijra</b> 🧳 (not intention, not sincerity)'),(f'من الوسائل التي {K("تعين")} على الإخلاص ← <u>مصاحبة الأخيار</u>','musaahabat al-akhyaar','things that <b>help</b> sincerity → keeping company with good people 👫'),
         (f'من {K("شروط")} صحة العمل أن يكون ← <u>خالصا لله وموافقا لسنة النبي</u>','khaalisan lillaah wa muwaafiqan li-sunnat an-nabee','<b>conditions</b> (two!) → purely for Allah <b>and</b> following the Sunnah'),(f'معنى ( {K("يصيبها")} ) ← <u>يحصل عليها</u>','yahsulu \'alayhaa','yuseebuhaa means → <b>gets it</b> 🎯')],
   warn=f'{AR("الرياء")} (showing off) is the opposite of sincerity: never the answer for what helps it.'),
  dict(id='(b)',kind=('اكتب','uktub','write'),q=f'اكتب {K("ثمرات")} {K("الإخلاص")} :',en='Write the <b>benefits</b> of <b>sincerity</b>.',
   rows=[('صحة الأعمال','sihhat al-a\'maal','✅ deeds are valid (accepted)'),('النجاة من الفتن','an-najaat min al-fitan','🛟 being saved from trials'),('العصمة من الشيطان','al-\'isma min ash-shaytaan','🛡️ protection from Shaytan'),('نيل شفاعة النبي ﷺ','nayl shafaa\'at an-nabee','🤲 earning the intercession of the Prophet ﷺ')],
   trick='Valid deeds ✅, saved 🛟, shielded 🛡️, and the Prophet ﷺ speaks for you 🤲: four rewards for doing it only for Allah.')]),
 dict(n='Q4',ar='السيرة',en='Life of the Prophet ﷺ: the first revelation',emo='📜',col='#2c66cf',lesson='Lesson 4',items=[
  dict(id='(a)',kind=('أكمل','akmil','complete'),q='أكمل ما يأتي بما هو مناسب',en='Complete with what fits.',
   rows=[(f'{K("أول")} ما نزل من القرآن أول آيات من {K("سورة")} …… العلق','al-\'alaq','the first verses: Surah <b>Al-\'Alaq</b> 📖'),(f'كان النبي ﷺ يتعبد في {K("غار")} …… حراء','hiraa\'','the <b>cave</b> of … <b>Hira</b> ⛰️'),(f'{K("الملك")} الذي نزل على النبي ﷺ هو …… جبريل عليه السلام','jibreel \'alayhis-salaam','the <b>angel</b> … <b>Jibreel</b>, peace be upon him')]),
  dict(id='(b)',kind=('ضع علامة ( √ ) أو ( × )','da\' \'alaama','tick or cross'),q='ضع علامة ( √ ) أو ( × ) أمام العبارات التالية',en='Tick or cross.',
   rows=[(f'نزل الوحي على النبي ﷺ عند بلوغه {K("أربعين")} سنة ( √ )','√','at <b>forty</b>: true'),(f'كان الوحي ينزل على النبي في {K("صورة واحدة")} ( × )','×','in <b>one form</b>: false, it came in different forms'),(f'كان نزول الوحي على النبي ﷺ في شهر {K("رمضان")} ( √ )','√','in <b>Ramadan</b>: true 🌙')]),
  dict(id='(c)',kind=('أجب','ajib','answer'),q='أجب عما يأتي',en='Answer the following.',
   rows=[(f'عرف الوحي {K("لغة")} : يطلق على الإعلام في خفاء وسرعة','yutlaqu \'alal-i\'laam fee khafaa\' wa sur\'a','in <b>language</b>: telling something secretly 🤫 and quickly ⚡'),(f'{K("شرعا")} : إعلام الله تعالى أنبياءه ورسله بما يريد أن يبلغه إليهم','i\'laam Allaah ta\'aalaa anbiyaa\'ahu wa rusulahu bimaa yureedu an yuballighahu ilayhim','in <b>Islamic law</b>: Allah telling His prophets and messengers what He wants to pass on to them 📨'),
         (f'ما {K("حال")} النبي ﷺ {K("بعد")} نزول الوحي ؟ أصبح مستعدا لقبول الوحي','asbaha musta\'iddan li-qabool al-wahy','<b>after</b> the revelation: he became ready to receive it'),(f'ما المقصود {K("بالناموس")} من كلام ورقة بن نوفل ؟ ملك الوحي ( جبريل عليه السلام )','malak al-wahy (jibreel \'alayhis-salaam)','<b>an-Naamoos</b> = the angel of revelation, Jibreel')],
   warn=f'Write the two definitions with their labels: {AR("لغة :")} first, then {AR("شرعا :")}.')]),
 dict(n='Q5',ar='الفقه',en='Fiqh: prayer',emo='🕌',col='#6a45d8',lesson='Lesson 5',items=[
  dict(id='(a)',kind=('اكتب','uktub','write'),q=f'اكتب خمسة من {K("واجبات الصلاة")} :',en='Write five of the <b>required acts of prayer</b>.',
   rows=[('تكبيرات الانتقال','takbeeraat al-intiqaal','🔄 "Allahu akbar" when moving'),('التحميد','at-tahmeed','🙌 "Rabbanaa wa lakal-hamd" (from حمد, praise)'),('التسميع','at-tasmee\'','👂 "Sami\'a Allaahu liman hamidah" (from سمع, hear)'),('التشهد الأول','at-tashahhud al-awwal','☝️ the first tashahhud'),('الجلوس للتشهد الأول','al-juloos lit-tashahhud al-awwal','🧎 sitting for the first tashahhud')],
   trick='Five dotted lines → five answers. Follow the prayer: move 🔄, rise 👂🙌, sit 🧎 and say the tashahhud ☝️.'),
  dict(id='(b)',kind=('ضع علامة ( √ ) أو ( × )','da\' \'alaama','tick or cross'),q='ضع علامة ( √ ) أو ( × ) أمام العبارات التالية',en='Tick or cross.',
   rows=[(f'من سنن الصلاة القولية {K("الاستعاذة")} ( √ )','√','a\'oodhu billaah is a spoken sunnah: true'),(f'من واجبات الصلاة {K("الالتفات")} بلا حاجة ( × )','×','turning around is <b>not</b> a wajib (it is disliked): false'),(f'من مبطلات الصلاة {K("القهقهة")} ( √ )','√','laughing out loud breaks the prayer: true 😆')]),
  dict(id='(c)',kind=('عرف','\'arrif','define'),q='عرف ما يأتي',en='Define the following.',
   rows=[(f'{K("الواجب")} : ما يثاب فاعله ويأثم تاركه','maa yuthaabu faa\'iluhu wa ya\'thamu taarikuh','required: do it ⭐ rewarded, leave it ⚠️ sinful'),(f'{K("السنة")} : ما يثاب فاعلها ولا يأثم تاركها','maa yuthaabu faa\'iluhaa wa laa ya\'thamu taarikuhaa','sunnah: do it ⭐ rewarded, leave it ✔️ no sin'),(f'{K("المكروه")} : ما يثاب تاركه ولا يأثم فاعله','maa yuthaabu taarikuhu wa laa ya\'thamu faa\'iluh','disliked: <b>leave</b> it ⭐ rewarded, do it ✔️ no sin')],
   trick=f'Six building blocks make all three: {AR("ما")} · {AR("يثاب")} (rewarded) · {AR("يأثم")} (sinful) · {AR("فاعل")} (doer) · {AR("تارك")} (leaver) · {AR("ولا")} (and not).',
   warn=f'{AR("السنة")} is feminine, so its answer ends in {AR("ـها")}: {AR("فاعلها")}, {AR("تاركها")}.')]),
 dict(n='Q6',ar='التهذيب',en='Manners: sins of the tongue',emo='👅',col='#e06a1b',lesson='Lesson 6',items=[
  dict(id='(a)',kind=('دون','dawwin','write down a list'),q=f'دون {K("أسباب")} {K("آفات اللسان")} :',en='Write down the <b>causes</b> of the <b>sins of the tongue</b>.',
   rows=[('عدم مراقبة الله','\'adam muraaqabat Allaah','👁️ forgetting that Allah is watching'),('سوء التربية','soo\' at-tarbiya','🏠 a bad upbringing'),('الحسد والكبر','al-hasad wal-kibr','😒 envy and 😤 arrogance'),('الغفلة عن الجزاء','al-ghafla \'an al-jazaa\'','⚖️ forgetting about reward and punishment')]),
  dict(id='(b)',kind=('اكتب المصطلح','uktub al-mustalah','write the term'),q='اكتب المصطلح الصحيح للعبارات الآتية',en='Write the correct term.',
   rows=[(f'ذكر الناس بما {K("يكرهونه")} بالقول أو الفعل ← الغيبة','al-gheeba','they <b>hate</b> it → backbiting 🙈'),(f'{K("احتقار")} الناس بالهمز واللمز ← السخرية','as-sukhriyya','<b>looking down on</b> → mocking 😏'),(f'{K("نقل")} الكلام للإفساد بين الناس ← النميمة','an-nameema','<b>carrying</b> talk → spreading tales 📨')]),
  dict(id='(c)',kind=('ضع علامة ( √ ) أو ( × )','da\' \'alaama','tick or cross'),q='ضع علامة ( √ ) أو ( × ) أمام العبارات التالية',en='Tick or cross.',
   rows=[(f'حرم الإسلام الغيبة في حال {K("تغيير المنكر")} ( × )','×','telling someone who can stop a wrong is allowed: false'),(f'{K("الحسد والكبر")} سبب لانتشار آفات اللسان ( √ )','√','envy and arrogance are a cause: true'),(f'{K("تقتصر")} الغيبة على القول ( × )','×','backbiting is by words <b>or actions</b>: false')])]),
 dict(n='Q7',ar='الثقافة الإسلامية',en='Islamic culture: responsibility',emo='🧩',col='#d6336c',lesson='Lesson 7',items=[
  dict(id='(a)',kind=('حدد','haddid','choose the label'),q='حدد نوع التصرف الصادر بكتابة كلمة ( مسؤول أو غير مسؤول )',en='Label each action <b>responsible</b> or <b>irresponsible</b>.',
   rows=[(f'شاب {K("أسرف")} بالسهر خلال شهر رمضان ← غير مسؤول','ghayr mas\'ool','stayed up far too late → irresponsible'),(f'فتاة {K("تكثر")} من مشروبات الطاقة ← غير مسؤول','ghayr mas\'ool','too many energy drinks → irresponsible'),(f'أب {K("يعلم")} أولاده {K("الصلاة")} ← مسؤول','mas\'ool','teaches his children to pray → responsible')],
   warn=f'{AR("غير")} means <b>not</b>. In {AR("مسؤول")} the hamza sits on a waw: {AR("ؤ")}.'),
  dict(id='(b)',kind=('دون','dawwin','write down a list'),q=f'دون {K("أقسام المسؤولية")} الفردية :',en='Write down the <b>kinds of personal responsibility</b>.',
   rows=[('المسؤولية الدينية','al-mas\'ooliyya ad-deeniyya','🕌 religious'),('المسؤولية الشخصية','al-mas\'ooliyya ash-shakhsiyya','🧍 personal'),('المسؤولية الأسرية','al-mas\'ooliyya al-usariyya','👨‍👩‍👧 family'),('المسؤولية المجتمعية','al-mas\'ooliyya al-mujtama\'iyya','🏙️ society')],
   trick=f'Write {AR("المسؤولية")} four times, then add the endings. All four end in {AR("ـية")}.'),
  dict(id='(c)',kind=('وضح','wadd-dih','explain'),q=f'وضح المسؤولية {K("تجاه الدين")} .',en='Explain responsibility <b>towards religion</b>.',
   rows=[('في العبادات ( الصلاة )','fil-\'ibaadaat (as-salaah)','🕌 in acts of worship (prayer)'),('في المعاملات ( البيع والشراء )','fil-mu\'aamalaat (al-bay\' wash-shiraa\')','🛒 in dealings with people (buying and selling)')])]),
]
COL2={'#b8862b': '#e0b45a', '#17935b': '#45c288', '#2c66cf': '#5aa0f0', '#6a45d8': '#9b7cf0', '#e06a1b': '#f5a54a', '#d6336c': '#f07aa0'}
HAD=[('الحديث الأول','Lesson 2','عن عائشة رضي الله عنها أن رسول الله ﷺ قال : ( خلقت {k1} من {k2} وخلق الجان من مارج من {k3} وخلق آدم مما وصف لكم ) .',dict(k1='الملائكة',k2='نور',k3='نار'),
      'The angels were created from <b>light</b>, the jinn from a smokeless flame of <b>fire</b>, and Adam from what has been described to you (<b>clay</b>).'),
     ('الحديث الثاني','Lesson 6','عن أبي هريرة رضي الله عنه قال : قال رسول الله ﷺ : ( تجد من شر الناس يوم القيامة عند الله {k1} ، الذي يأتي هؤلاء بوجه وهؤلاء بوجه ) .',dict(k1='ذا الوجهين'),
      'You will find among the worst of people on the Day of Resurrection, in the sight of Allah, the <b>two-faced</b> person, who comes to some people with one face and to others with another face.'),
     ('الحديث الثالث','Lesson 5','عن أنس بن مالك رضي الله عنه أن رسول الله ﷺ قال : ( ما بال أقوام {k1} ، فاشتد قوله في ذلك حتى قال : لينتهن عن ذلك أو لتخطفن أبصارهم ) .',dict(k1='يرفعون أبصارهم إلى السماء في صلاتهم'),
      'What is wrong with people who <b>raise their eyes to the sky</b> in their prayer? He spoke very strongly about it, until he said: they must stop that, or their sight will be snatched away.')]
INSTR=[('اكتب','uktub','write','write the answer(s)'),('دون','dawwin','write down','write a list: count the dotted lines'),('أكمل','akmil','complete','fill the gap'),('ضع خطا تحت','da\' khattan taht','underline','underline one choice'),
       ('ضع علامة ( √ ) أو ( × )','da\' \'alaama','put a mark','tick or cross'),('عرف','\'arrif','define','write the definition'),('أجب','ajib','answer','write a short answer'),('حدد','haddid','decide','choose a label'),('وضح','wadd-dih','explain','write the explanation')]
# the 46 answers to write, for the tracing pages
TRACE=[]
for S in SEC:
  for it in S['items']:
    for r in it['rows']:
      if '<u>' in r[0]: continue
      a=r[0].split('←')[-1].split('……')[-1].split(' : ',1)[-1].strip()
      a=a.replace('<u>','').replace('</u>','')
      if '( √ )' in a or '( × )' in a or a in ('√','×'): continue
      if '؟' in a: a=a.split('؟')[-1].strip()
      if 'span' in a: continue
      TRACE.append((S['n']+' '+it['id'],a,r[1]))
CSS='''@page{size:A4;margin:13mm 14mm 15mm 14mm;@bottom-center{content:counter(page);font:600 9pt "Avenir Next",sans-serif;color:#8a90a2}}
@page :first{@bottom-center{content:none}}
*{box-sizing:border-box}html{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font-family:"Avenir Next","Helvetica Neue",Arial,sans-serif;color:#1f2433;font-size:10.5pt;line-height:1.45;margin:0}
.ar,.q,.a,.trace,.hd{font-family:"Geeza Pro","Noto Naskh Arabic","Noto Sans Arabic","Traditional Arabic","DejaVu Sans",sans-serif;unicode-bidi:isolate}
.ar{direction:rtl}
h1,h2,h3{margin:0;line-height:1.15}
.cover .top{background:linear-gradient(135deg,#5a3a00,#8a5a00 45%,#d9a441);color:#fff;border-radius:22px;padding:30px 28px}
.cover h1{font-size:34pt;font-weight:800;margin:6px 0}.cover .k{font-size:11pt;letter-spacing:.14em;text-transform:uppercase;opacity:.85;font-weight:700}
.box{border-radius:12px;padding:9px 13px;margin:9px 0;break-inside:avoid;border-left:6px solid}
.box .lab{font-weight:800;font-size:9pt;letter-spacing:.06em;text-transform:uppercase;display:block;margin-bottom:2px}
.tip{background:#fff4c2;border-color:#f2c200}.tip .lab{color:#8a6a00}
.warn{background:#fde6e6;border-color:#e04848}.warn .lab{color:#b02525}
.how{border:2px solid #e8dcc0;border-radius:16px;padding:8px 14px;margin-top:10px;break-inside:avoid}
.cover table td,.cover table th{padding:2px 7px;font-size:9pt}.cover td.a{font-size:12pt}.cover .top{padding:22px 26px}.cover h1{font-size:30pt}
table{border-collapse:collapse;width:100%;margin:6px 0;font-size:10pt}tr{break-inside:avoid}
th,td{border:1px solid #e3dccb;padding:5px 8px;vertical-align:middle}th{background:#fbf0d9;text-align:left}
.sec{break-before:page}
.banner{border-radius:16px;padding:14px 20px;color:#fff;display:flex;align-items:center;gap:14px;margin-bottom:8px}
.banner .e{font-size:34pt}.banner h2{font-size:20pt;font-weight:800}.banner p{margin:2px 0 0;font-size:11pt;opacity:.95}
.item{break-inside:avoid;margin:10px 0 4px}
.qhead{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap}
.qid{font-weight:800;font-size:11pt;color:#fff;border-radius:8px;padding:1px 8px}
.kind{font-size:9.5pt;font-weight:700;color:#7a4a00;background:#fff8e6;border-radius:8px;padding:1px 8px}
.q{direction:rtl;text-align:right;font-size:15pt;font-weight:700;line-height:1.7;margin:3px 0 0}
.en{font-size:10pt;color:#2c4a9c;margin:0 0 4px}
.kw{background:#ffe680;border-radius:5px;padding:0 3px;box-shadow:0 0 0 1.5px #ffd84d}
td.a{direction:rtl;text-align:right;font-size:14pt;font-weight:700;width:46%}
td.s{color:#2c66cf;font-weight:700;font-size:9.5pt;width:24%}
.hd{direction:rtl;text-align:right;font-size:14pt;line-height:1.9;font-weight:700}
.had{border:2px solid #e8dcc0;border-radius:14px;padding:10px 14px;margin:10px 0;break-inside:avoid}
.had h3{font-size:12pt;color:#8a5a00;display:flex;justify-content:space-between}
.cheat td.k{direction:rtl;text-align:right;font-size:12pt;font-weight:700;width:34%}
.cheat td.a{font-size:12pt;width:38%}
.trace-row{display:flex;gap:10px;align-items:center;border-bottom:1px solid #eee3cc;padding:4px 0;break-inside:avoid}
.trace-row .lab{width:68px;flex:none;font-size:8.5pt;font-weight:800;color:#8a5a00}
.trace{flex:1;direction:rtl;text-align:right;font-size:22pt;font-weight:700;color:transparent;-webkit-text-stroke:1px #b9a27a;line-height:1.5}
.blank{flex:1;border-bottom:2px dotted #c9b48a;height:34px}
.small{font-size:9pt;color:#5b6275}
'''
o=[f'<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Grade 7 Islamic Studies – Exam Study Guide</title><style>{CSS}</style></head><body>']
o.append('''<section class="cover"><div class="top"><div class="k">Grade 7 · Islamic Studies · 2nd Term</div><h1>Exam Study Guide 🌙</h1>
<p style="font-size:13pt;margin:0">Every question on your review sheet with its <b>keyword</b>, its <b>answer</b>, how it <b>sounds</b> and what it <b>means</b>. With Hudhud the Hoopoe 🐦.</p></div>
<div class="how"><h3>🔎 → 🧠 → ✍️ How to use this guide</h3><p>You don't need to understand every Arabic word. For each question:</p>
<p><b>1. Spot the keyword</b> (in <span class="kw">yellow</span>): it tells you which answer to write. &nbsp; <b>2. Remember the answer</b>: read the Arabic, say the sounds (in blue), know the meaning. &nbsp; <b>3. Write it</b>: look, cover, write, check. Trace the answers on the last pages.</p></div>
<div class="how"><h3>📝 Instruction words: what the question wants you to do</h3><table><tr><th>Arabic</th><th>Sounds</th><th>Means</th><th>What to do</th></tr>'''+
''.join(f'<tr><td class="a ar" style="font-size:13pt">{a}</td><td class="s">{s}</td><td>{m}</td><td>{d}</td></tr>' for a,s,m,d in INSTR)+'''</table>
<p class="small">The number of dotted lines on the sheet tells you how many answers to write. الإجابة = the answer · السؤال = question.</p></div>
<div class="how"><h3>✍️ Writing tips</h3><p>Arabic is written <b>right to left</b> and the letters join. Many answers start with <span class="ar">ال</span> (the) and end with
<span class="ar">ة</span> (الطاعة, السخرية). Don't mix <span class="ar">ة</span> with <span class="ar">ه</span> (فاعله) or <span class="ar">ى</span> (تعالى) with <span class="ar">ي</span> (النبي).
The hamza sits on different letters: <span class="ar">الإيمان · مسؤول · الجزاء · حراء</span>. Write answers <b>without</b> vowel marks, like the sheet.</p></div></section>''')
for S in SEC:
  o.append(f'<section class="sec"><div class="banner" style="background:linear-gradient(120deg,{S["col"]},{COL2[S["col"]]})"><div class="e">{S["emo"]}</div><div><h2>{S["n"]} · <span class="ar">{S["ar"]}</span></h2><p>{S["en"]} · {S["lesson"]}</p></div></div>')
  for it in S['items']:
    a,s,m=it['kind']
    o.append(f'<div class="item"><div class="qhead"><span class="qid" style="background:{S["col"]}">{S["n"]} {it["id"]}</span><span class="kind"><span class="ar">{a}</span> ({s}) = {m}</span></div>'
             f'<div class="q">{it["q"]}</div><div class="en">{it["en"]}</div><table>'+''.join(f'<tr><td class="a">{r[0]}</td><td class="s">{r[1]}</td><td>{r[2]}</td></tr>' for r in it['rows'])+'</table>')
    if it.get('trick'):o.append(f'<div class="box tip"><span class="lab">💡 Memory trick</span>{it["trick"]}</div>')
    if it.get('warn'):o.append(f'<div class="box warn"><span class="lab">⚠️ Watch out</span>{it["warn"]}</div>')
    o.append('</div>')
  o.append('</section>')
o.append('<section class="sec"><div class="banner" style="background:linear-gradient(120deg,#5a3a00,#b8862b)"><div class="e">📿</div><div><h2>The three hadiths</h2><p>Learn them by heart · the keyword is in yellow</p></div></div>')
for t,l,txt,ks,en in HAD:
  o.append(f'<div class="had"><h3><span class="ar">{t}</span><span class="small">{l}</span></h3><div class="hd">{txt.format(**{k:K(v) for k,v in ks.items()})}</div><p class="en" style="font-size:10.5pt">{en}</p></div>')
o.append('</section>')
# cheat sheet
o.append('<section class="sec"><div class="banner" style="background:linear-gradient(120deg,#8a5a00,#d9a441)"><div class="e">🔑</div><div><h2>Cheat sheet: keyword → answer</h2><p>Cover the right-hand columns and test yourself</p></div></div><table class="cheat"><tr><th>Q</th><th>Keyword</th><th>Answer</th><th>Meaning</th></tr>')
import re
for S in SEC:
  for it in S['items']:
    for r in it['rows']:
      kws=re.findall(r'<span class="kw">(.*?)</span>',r[0]) or re.findall(r'<span class="kw">(.*?)</span>',it['q'])
      ans=r[0].split('←')[-1].split('……')[-1].split(' : ',1)[-1].replace('<u>','').replace('</u>','')
      if '؟' in ans: ans=ans.split('؟')[-1]
      ans=re.sub(r'<span class="kw">(.*?)</span>',r'\1',ans).strip()
      o.append(f'<tr><td class="small" style="white-space:nowrap">{S["n"]} {it["id"]}</td><td class="k">{" + ".join(kws)}</td><td class="a ar" style="direction:rtl;text-align:right;font-weight:700">{ans}</td><td class="small">{re.sub("<[^>]+>","",r[2])}</td></tr>')
o.append('</table></section>')
o.append('<section class="sec"><div class="banner" style="background:linear-gradient(120deg,#17935b,#45c288)"><div class="e">✍️</div><div><h2>Tracing sheets</h2><p>Trace the grey letters (right to left ⬅), then write it again on the dotted line from memory</p></div></div>')
for lab,a,s in TRACE:
  o.append(f'<div class="trace-row"><div class="lab">{lab}<br><span style="color:#2c66cf;font-weight:700">{s}</span></div><div class="blank"></div><div class="trace">{a}</div></div>')
o.append('<p style="text-align:center;margin-top:16px;font-size:13pt"><span class="ar">بالتوفيق إن شاء الله</span> · Good luck in the exam! 🍀</p></section></body></html>')
open('source/islamic/study-guide-source.html','w').write('\n'.join(o))
print(len(TRACE),'tracing rows')
