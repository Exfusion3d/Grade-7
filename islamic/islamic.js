/* Islamic Studies helpers, loaded by every Islamic lesson after ../lessons/engine.js:
   Hudhud the Hoopoe (the tutor), the Arabic voice, the 🇬🇧 English and 🔤 Sounds buttons, and the activities built for
   a student who does not read Arabic well: clue cards (find the keyword, know the answer), coloured answer blocks,
   "build the answer" tiles and finger tracing.

   Arabic text on screen is written with ar(arabic, english, sounds). It is spoken with an Arabic voice; the 🇬🇧 button
   swaps every ar() to its English, and the 🔤 button shows the sounds (an easy English spelling) under the Arabic.
   aw(arabic, sounds) is an Arabic word Hudhud is explaining in English: it stays Arabic in both modes. */
const ISLAMIC={subject:'Islamic Studies',home:'../islamic.html',guide:'Hudhud the Hoopoe',
  mascot:`<ellipse cx="38" cy="75" rx="20" ry="4" fill="#1f2433" opacity=".12"/>
    <g class="crest">
      <path d="M44 24 Q30 2 40 0 Q46 8 47 22 Z" fill="#f0a868"/><path d="M40 3 Q38 0 40 0 Q42 1 42 4 Z" fill="#1f2433"/>
      <path d="M47 22 Q44 -1 53 1 Q55 10 51 22 Z" fill="#f4b57a"/><path d="M51.5 3.5 Q51 0 53 1 Q54.5 2 54 5 Z" fill="#1f2433"/>
      <path d="M50 23 Q58 3 65 7 Q62 15 54 25 Z" fill="#f0a868"/><path d="M62.5 9 Q63 5 65 7 Q65.5 8.5 63.5 10.5 Z" fill="#1f2433"/>
      <path d="M41 26 Q22 12 28 7 Q37 12 45 25 Z" fill="#e8955a"/><path d="M28.5 10 Q26 8 28 7 Q30 7.5 31 9.5 Z" fill="#1f2433"/>
    </g>
    <path d="M14 56 L2 66 L8 68 L4 74 L20 64 Z" fill="#1f2433"/>
    <ellipse cx="34" cy="54" rx="21" ry="16" fill="#eaa46a" stroke="#b86a2c" stroke-width="2"/>
    <path d="M18 48 Q30 40 46 50 Q36 66 18 62 Z" fill="#1f2433"/>
    <path d="M22 47 L26 61 M29 45 L32 63 M36 46 L38 61" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>
    <circle cx="52" cy="36" r="14" fill="#f2b47c" stroke="#b86a2c" stroke-width="2"/>
    <path id="mouth" d="M63 37 Q72 38 79 46 Q71 42 63 41 Z" fill="#3a2a22" stroke="#1f2433" stroke-width="1"/>
    <circle cx="56" cy="33" r="4.4" fill="#1f2433"/><circle cx="57.5" cy="31.5" r="1.5" fill="#fff"/>
    <circle cx="51" cy="41" r="3" fill="#ff9f9f" opacity=".7"/>
    <path d="M30 69 L28 77 M38 69 L38 77" stroke="#6b4a2a" stroke-width="2.4" stroke-linecap="round"/>`};

document.head.insertAdjacentHTML('beforeend',`<style>
#mascot .crest{transform-origin:48px 26px;animation:crest 2.6s ease-in-out infinite alternate}
@keyframes crest{to{transform:rotate(-7deg) scale(1.04)}}
/* the two buttons (header; in the side layout they sit next to ⚙️ as icons) */
#tr,#snds{white-space:nowrap;font-size:15px}
#tr.on,#snds.on{background:#fff4dc;border-color:#d9a441;color:#7a4a00}
body.side #tr,body.side #snds{display:block;grid-column:2;grid-row:1;justify-self:start;align-self:center}
body.side #tr{margin-left:52px}body.side #snds{margin-left:104px}
body.side #tr .lbl,body.side #snds .lbl{display:none}
/* Arabic text */
.ax,.aw,.ar-font{font-family:"Geeza Pro","Noto Naskh Arabic","Noto Sans Arabic","Traditional Arabic","Segoe UI","DejaVu Sans",sans-serif}
.ax,.aw{unicode-bidi:isolate}
#stage .ax,#stage .aw{cursor:pointer}
#text .ax,#text .aw{color:#8a4b00}
.ax.en,.aw.en,.axg.en{background:#fff1d6;border-radius:6px;box-shadow:0 0 0 2px #fff1d6;color:#7a4a00;font-family:"Avenir Next","Nunito","Segoe UI",system-ui,sans-serif}
/* English mode: answer blocks and tiles show their English (or sounds) instead of the Arabic */
body.en-mode .is-b .a,body.en-mode .is-tile .a{display:none}
body.en-mode .is-blocks{flex-direction:row;flex-wrap:wrap;justify-content:flex-end}
body.en-mode .is-slot{flex-direction:row}
body.en-mode .is-b .m{font-size:20px;font-weight:800;opacity:1}
body.en-mode .is-b:not(:has(.m)) .s,body.en-mode .is-tile .s{font-size:18px}
body.en-mode .is-tile .m{display:block}
.is-tile .m{display:none;font-size:13px;font-weight:700;color:#5a3c00}
/* sounds under the Arabic (🔤 button) */
body.snd-mode .ax[data-tr]:not(.en),body.snd-mode .aw[data-tr]:not(.en){display:inline-flex;flex-direction:column;align-items:center;vertical-align:top;line-height:1.25}
body.snd-mode .ax[data-tr]:not(.en)::after,body.snd-mode .aw[data-tr]:not(.en)::after{content:attr(data-tr);direction:ltr;unicode-bidi:isolate;font-family:"Avenir Next","Nunito","Segoe UI",system-ui,sans-serif;
  font-size:max(12px,.52em);font-weight:700;color:#2c66cf;line-height:1.15;margin-top:1px;white-space:normal;text-align:center}
body.snd-mode #text .ax[data-tr]:not(.en)::after,body.snd-mode #text .aw[data-tr]:not(.en)::after{font-size:13px}
.ax.blk{display:block;text-align:right}.ax.blk.en{text-align:left}
.ex-q .ax.blk:not(.en),.ex-model .ax:not(.en){font-size:1.3em;line-height:1.5}.ex-opt .ax:not(.en){font-size:1.4em}
body.snd-mode .ax.blk[data-tr]:not(.en){display:block}
body.snd-mode .ax.blk[data-tr]:not(.en)::after{display:block;text-align:right}
body.snd-mode .ax:not(.en) .kw[data-tr]{display:inline-flex;flex-direction:column;align-items:center;vertical-align:top;line-height:1.25}
body.snd-mode .ax:not(.en) .kw[data-tr]::after{content:attr(data-tr);direction:ltr;unicode-bidi:isolate;font-family:"Avenir Next","Nunito","Segoe UI",system-ui,sans-serif;
  font-size:max(12px,.45em);font-weight:800;color:#2c66cf;line-height:1.1}
/* keywords and the "keyword only" view */
.kw{border-radius:7px;padding:0 4px;transition:background .3s,color .3s}
.lit .kw,.ex-q .kw,#text .kw{background:#ffe680;box-shadow:0 0 0 2px #ffd84d}
#text .kw{border-radius:5px}
.dim .q{color:#c8c2d6}.dim .q .kw{color:#1f2433}
.is-card{position:absolute;background:#fff;border:3px solid #f0d9a8;border-radius:18px;padding:10px 16px;box-shadow:0 5px 0 #f3e3c0}
.is-card .src{font-size:12px;font-weight:800;letter-spacing:.06em;color:#a0742a;text-transform:uppercase}
.is-card .q{font-size:30px;font-weight:700;line-height:1.55;margin:4px 0 4px;color:#1f2433}
.is-card .q .ax.en{font-size:22px}
.is-card .stamp{position:static;display:inline-block;font-size:24px;padding:4px 16px;white-space:normal;visibility:hidden}
.is-chip{display:inline-flex;align-items:center;gap:10px;background:#fff8e6;border:3px solid #f2c200;border-radius:16px;padding:6px 14px;font-size:19px;font-weight:800;color:#5a3c00}
.is-chip .ar-font{font-size:26px}
.is-clue{background:#fff;border:3px dashed #d9a441;border-radius:16px;padding:6px 14px;font-size:22px;font-weight:800;color:#7a4a00;white-space:nowrap}
.is-clue .ar-font{font-size:28px}
.is-why{background:#fff8e6;border:3px solid #f2c200;border-radius:16px;padding:8px 16px;font-size:17px;font-weight:700;line-height:1.35}
.is-point{font-size:40px;pointer-events:none;z-index:40}
/* coloured answer blocks: Arabic, its sounds and its meaning */
.is-blocks{display:flex;flex-direction:row-reverse;flex-wrap:wrap-reverse;justify-content:flex-start;gap:8px}
.is-b{border-radius:14px;padding:6px 12px 7px;text-align:center;color:#fff;box-shadow:0 4px 0 rgba(0,0,0,.18)}
.is-b .a{font-size:36px;font-weight:700;line-height:1.35}
.is-b .s{font-size:14px;font-weight:800;opacity:.97}
.is-b .m{font-size:12.5px;font-weight:700;opacity:.88}
/* build the answer */
.is-tile{display:flex;flex-direction:column;align-items:center;justify-content:center;min-width:64px;height:76px;padding:0 14px;background:#fff;border:3px solid #d9a441;border-radius:14px;
  box-shadow:0 4px 0 #f3e3c0;cursor:pointer;user-select:none;-webkit-user-select:none;line-height:1.15}
.is-tile .a{font-size:30px;font-weight:700;color:#5a3c00}
.is-tile .s{font-size:12.5px;font-weight:800;color:#2c66cf}
.is-tile:active{transform:translateY(3px);box-shadow:0 1px 0 #f3e3c0}
.is-tile.used{opacity:.3;pointer-events:none}
.is-del{display:flex;align-items:center;justify-content:center;width:64px;height:76px;background:#fff8e6;border:3px solid #f2c200;border-radius:14px;font-size:24px;cursor:pointer}
.is-slot{display:flex;flex-direction:row-reverse;align-items:center;justify-content:center;flex-wrap:wrap;gap:4px 14px;min-height:84px;padding:6px 14px;border:3px dashed #d9a441;border-radius:18px;
  background:#fffaf0;font-size:38px;font-weight:700;color:#5a3c00}
.is-slot i{font-size:18px;font-style:normal;color:#a89577;font-weight:700;font-family:"Avenir Next","Nunito","Segoe UI",system-ui,sans-serif}
.is-slot.ok{border-style:solid;border-color:#18a058;background:#e6f7ee;color:#0f7a40}
.is-slot.bad{border-style:solid;border-color:#e04848;background:#fdecec;color:#b02a2a}
/* tracing */
.is-pad{background:#fff;border:3px solid #f0d9a8;border-radius:22px;box-shadow:0 5px 0 #f3e3c0;touch-action:none}
.is-pad canvas{position:absolute;left:0;top:0;border-radius:20px;touch-action:none}
.is-meter{height:16px;border-radius:9px;background:#f3ead6;overflow:hidden}
.is-meter i{display:block;height:100%;width:0;background:linear-gradient(90deg,#f2c200,#18a058);transition:width .2s}
</style>`);

/* ---------- writing Arabic with its English and its sounds ---------- */
const escA=s=>String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
/* The glossary: every Arabic word or phrase whose English (GM) or sounds (GS) appear on the page. In English mode it
   translates any other Arabic left on the stage (labels, cards, sort bins, badges), so the whole scene switches. */
const GM=new Map(),GS=new Map(),HASAR=/[\u0600-\u06FF]/;
const plain=t=>String(t??'').replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();
function gloss(a,en,tr){a=plain(a);if(!a||!HASAR.test(a))return;en=plain(en);tr=plain(tr);
  if(en&&!HASAR.test(en)&&!GM.has(a))GM.set(a,en);if(tr&&!HASAR.test(tr)&&!GS.has(a))GS.set(a,tr);}
const ar=(a,en,tr,cls)=>{gloss(a,en,tr);return `<span class="ax${cls?' '+cls:''}" dir="rtl" lang="ar" data-en="${escA(en)}"${tr?` data-tr="${escA(tr)}"`:''}>${a}</span>`;};
/* aw(arabic, sounds, english?): in English mode it shows its English, or its sounds when it has no English */
const aw=(a,tr,en)=>{gloss(a,en,tr);const e=en||tr;return `<span class="aw" dir="rtl" lang="ar"${tr?` data-tr="${escA(tr)}"`:''}${e?` data-en="${escA(e)}"`:''}>${a}</span>`;};
/* a keyword inside a question, with its sounds: ar(`خلق الله تعالى ${kw('الملائكة','al-malaa\'ika')} …`, `… the noble ${kw('angels')} …`) */
const kw=(t,tr)=>{gloss(t,'',tr);return `<span class="kw"${tr?` data-tr="${escA(tr)}"`:''}>${t}</span>`;};

/* GLOSSARY START (generated by source/islamic/make-glossary.js) */
const ISL_GLOSS=[["( البيع والشراء )","(buying and selling)","(al-bay' wash-shiraa')"],
["( الصلاة )","(prayer)","as-salaah"],
["( جبريل عليه السلام )","(Jibreel, peace be upon him)","(jibreel 'alayhis-salaam)"],
["ء","hamza","hamza"],
["آدم","Adam","aadam"],
["آفات اللسان","sins of the tongue","aafaat al-lisaan"],
["أ","alif with hamza",""],
["أ إ ؤ ء","","hamza"],
["أب يعلم أولاده الصلاة","A father who teaches his children to pray.",""],
["أبصارهم","their eyes","absaarahum"],
["أبصارهم إلى السماء","","absaarahum ilas-samaa'"],
["أجب","answer","ajib"],
["أحسنت","Well done",""],
["أربعة","","arba'a"],
["أربعين","forty","arba'een"],
["أسباب","causes","asbaab"],
["أسرف","","asrafa"],
["أسرف بالسهر","","asrafa bis-sahar"],
["أصبح","he became","asbaha"],
["أصبح مستعدا لقبول الوحي","he became ready to receive the revelation","asbaha musta'iddan li-qabool al-wahy"],
["أعوذ بالله من الشيطان الرجيم","I seek refuge with Allah from Satan, the outcast","a'oodhu billaahi minash-shaytaanir-rajeem"],
["أقسام","","aqsaam"],
["أكمل","complete","akmil"],
["أكمل ما يأتي","Complete the following",""],
["أكمل ما يأتي بما هو مناسب","Complete with what fits.",""],
["أن","to","an"],
["أنبياءه","His prophets","anbiyaa'ahu"],
["أو","","aw"],
["أول","","awwal"],
["أول … سورة","first … Surah","awwal … soorat"],
["ؤ","waaw with hamza",""],
["إ","alif with hamza below",""],
["إعلام","telling","i'laam"],
["إعلام الله تعالى أنبياءه ورسله بما يريد أن يبلغه إليهم","Allah the Exalted telling His prophets and messengers what He wants to pass on to them","i'laam Allaah ta'aalaa anbiyaa'ahu wa rusulahu bimaa yureedu an yuballighahu ilayhim"],
["إلى","to","ilaa"],
["إليهم","to them","ilayhim"],
["إنما الأعمال بالنيات","“Actions are judged by intentions.”","innamal a'maalu bin-niyyaat"],
["إيمان","faith","eemaan"],
["ا","alif","alif"],
["احتقار","looking down on","ihtiqaar"],
["احتقار الناس بالهمز واللمز","looking down on people",""],
["اكتب","write","uktub"],
["اكتب المصطلح الصحيح","write the correct term","uktub al-mustalah as-saheeh"],
["اكتب المصطلح الصحيح للعبارات الآتية","Write the correct term for the following phrases.",""],
["اكتب ثمرات الإخلاص","Write the benefits of sincerity",""],
["اكتب خمسة من واجبات الصلاة","Write five of the required acts of prayer.",""],
["اكتب وظيفة كل ملك في الجدول التالي","Write the job of each angel in the following table.",""],
["ال","al- (the)","al"],
["الأخيار","good people","al-akhyaar"],
["الأرواح","the souls","al-arwaah"],
["الأسر","al-usr-",""],
["الأسرة","","al-usra"],
["الأسرية","family","al-usariyya"],
["الأعمال","deeds","al-a'maal"],
["الأمين","al-Ameen: the trustworthy one","al-ameen"],
["الأول","first","al-awwal"],
["الإجابة","the answer","al-ijaaba"],
["الإخلاص","sincerity","al-ikhlaas"],
["الإسلام","","al-islaam"],
["الإعلام","telling","al-i'laam"],
["الإنسان","mankind","al-insaan"],
["الإنسان … من","","al-insaan … min"],
["الإيمان","faith","al-eemaan"],
["الاستعاذة","saying a'oodhu billaah","al-isti'aadha"],
["الالتفات","","al-iltifaat"],
["الالتفات بلا حاجة","turning around without need","al-iltifaat bilaa haaja"],
["الالتفات بلا حاجة مكروه","turning around without need is disliked","al-iltifaat bilaa haaja makrooh"],
["الانتقال","when moving","al-intiqaal"],
["البقرة","Al-Baqara","al-baqara"],
["البيع والشراء","buying and selling","al-bay' wash-shiraa'"],
["الت","at-ta-",""],
["التحميد","saying \"Rabbanaa wa lakal-hamd\"","at-tahmeed"],
["التحيات لله","All greetings are for Allah","at-tahiyyaatu lillaah"],
["التخلق","taking on","at-takhalluq"],
["التخلق بأخلاق الملائكة","taking on the good manners of the angels","at-takhalluq bi-akhlaaq al-malaa'ika"],
["التربية","upbringing","at-tarbiya"],
["التسميع","saying \"Sami'a Allaahu liman hamidah\"","at-tasmee'"],
["التشهد","the tashahhud","at-tashahhud"],
["التشهد الأول","the first tashahhud","at-tashahhud al-awwal"],
["التهذيب","Manners","at-tahdheeb"],
["الثقافة الإسلامية","Islamic culture","ath-thaqaafa al-islaamiyya"],
["الجان","the jinn","al-jaann"],
["الجزاء","the reward and punishment","al-jazaa'"],
["الجلوس","sitting","al-juloos"],
["الجلوس للتشهد الأول","sitting for the first tashahhud","al-juloos lit-tashahhud al-awwal"],
["الحديث","Hadith","al-hadeeth"],
["الحديث الأول","Hadith 1",""],
["الحديث الثالث","Hadith 3",""],
["الحديث الثاني","Hadith 2",""],
["الحديث وعلومه","Hadith and its sciences",""],
["الحسد","envy","al-hasad"],
["الحسد والكبر","envy and arrogance","al-hasad wal-kibr"],
["الحسد والكبر سبب لانتشار آفات اللسان","Envy and arrogance are a cause of the spread of the sins of the tongue.",""],
["الدين","religion","ad-deen"],
["الدينية","religious","ad-deeniyya"],
["الرياء","showing off","ar-riyaa'"],
["السؤال","question","as-su'aal"],
["السؤال الثاني : في مجال : العقيدة","Question 2: in the area of Belief",""],
["السخرية","mocking","as-sukhriyya"],
["السلام عليكم","Peace be upon you","assalaamu 'alaykum"],
["السماء","the sky","as-samaa'"],
["السنة","the sunnah","as-sunna"],
["السيرة","Life of the Prophet ﷺ","as-seera"],
["الشخص","ash-shakhs-",""],
["الشخصية","personal","ash-shakhsiyya"],
["الشرك","","ash-shirk"],
["الشيطان","Shaytan","ash-shaytaan"],
["الصلاة","prayer","as-salaah"],
["الطاعة","obedience","at-taa'a"],
["العبادات","acts of worship","al-'ibaadaat"],
["العصمة","protection","al-'isma"],
["العصمة من الشيطان","protection from Shaytan","al-'isma min ash-shaytaan"],
["العقيدة","Belief","al-'aqeeda"],
["العلق","Al-'Alaq","al-'alaq"],
["العلم","knowing","al-'ilm"],
["العلم بعظمة الله وقوته","knowing the greatness and power of Allah","al-'ilm bi-'azamat Allaah wa quwwatih"],
["العمل","","al-'amal"],
["الغفلة","forgetting","al-ghafla"],
["الغفلة عن الجزاء","forgetting about reward and punishment","al-ghafla 'an al-jazaa'"],
["الغيبة","backbiting","al-gheeba"],
["الغيبة بالقول أو الفعل","Backbiting is by words or actions","al-gheeba bil-qawl aw al-fi'l"],
["الفاتحة","Al-Fatiha","al-faatiha"],
["الفتن","trials","al-fitan"],
["الفعل","","al-fi'l"],
["الفقه","Fiqh","al-fiqh"],
["القهقهة","","al-qahqaha"],
["القول","","al-qawl"],
["القولية","","al-qawliyya"],
["الكرام","","al-kiraam"],
["الكلام","","al-kalaam"],
["الله","Allah","Allaah"],
["الله أكبر","Allah is the greatest","Allaahu akbar"],
["المجتمع","","al-mujtama'"],
["المجتمعية","society","al-mujtama'iyya"],
["المسؤولية","responsibility","al-mas'ooliyya"],
["المسؤولية الأسرية","family responsibility","al-mas'ooliyya al-usariyya"],
["المسؤولية الدينية","religious responsibility","al-mas'ooliyya ad-deeniyya"],
["المسؤولية الشخصية","personal responsibility","al-mas'ooliyya ash-shakhsiyya"],
["المسؤولية الفردية","","al-mas'ooliyya al-fardiyya"],
["المسؤولية المجتمعية","responsibility to society","al-mas'ooliyya al-mujtama'iyya"],
["المصطلح","the term: the name of it","al-mustalah"],
["المعاملات","dealings with people","al-mu'aamalaat"],
["المكروه","the disliked (makrooh)","al-makrooh"],
["الملائكة","the angels","al-malaa'ika"],
["الملائكة … من","","al-malaa'ika … min"],
["الملك","the angel","al-malak"],
["الملك الذي نزل","","al-malak alladhee nazal"],
["الناس","","an-naas"],
["الناموس","an-Naamoos","an-naamoos"],
["النبي","the Prophet","an-nabee"],
["النبي ﷺ","the Prophet ﷺ","an-nabee"],
["النجاة","being saved","an-najaat"],
["النجاة من الفتن","being saved from trials","an-najaat min al-fitan"],
["النميمة","spreading tales","an-nameema"],
["النية","intention","an-niyya"],
["الهجرة","Hijra","al-hijra"],
["الواجب","the required (waajib)","al-waajib"],
["الوجهين","two faces","al-wajhayn"],
["الوحي","revelation","al-wahy"],
["الوحي شرعا","revelation in Islamic law","al-wahy shar'an"],
["الوحي لغة","revelation in language","al-wahy lugha"],
["الوسائل","","al-wasaa'il"],
["الوسائل … تعين","","al-wasaa'il … tu'een"],
["بأخلاق","the manners of","bi-akhlaaq"],
["بالأرزاق","provisions","bil-arzaaq"],
["بالتوفيق إن شاء الله","Good luck, God willing",""],
["بالسهر","","bis-sahar"],
["بالقول","","bil-qawl"],
["بالقول أو الفعل","by words or actions","bil-qawl aw al-fi'l"],
["بالملائكة","","bil-malaa'ika"],
["بالناموس","","bin-naamoos"],
["بالهمز واللمز","","bil-hamz wal-lamz"],
["ببني آدم","for the children of Adam","bi-banee Aadam"],
["بعد","after",""],
["بعد نزول الوحي","","ba'da nuzool al-wahy"],
["بعظمة","the greatness of","bi-'azamat"],
["بلا","","bilaa"],
["بلد","","balad"],
["بلد الإسلام","the land of Islam","balad al-islaam"],
["بلد الشرك","the land of shirk","balad ash-shirk"],
["بما","what","bimaa"],
["بين","","bayna"],
["ة","taa' marbooTa","taa marboota"],
["ة ه · ى ي · ؤ","the dots and the hamza",""],
["ة ى أ","taa' marbooTa, alif maqsoora, hamza",""],
["تارك","leaver","taarik"],
["تاركه","its leaver","taarikuh"],
["تاركها","its leaver","taarikuhaa"],
["تجاه","towards","tujaah"],
["تجوز الغيبة لتغيير المنكر","Mentioning a wrong to stop it is allowed","tajooz al-gheeba li-taghyeer al-munkar"],
["ترك","","tark"],
["ترك بلد","","tark balad"],
["ترك بلد الشرك إلى بلد الإسلام ( النية – الهجرة – الإخلاص )","Leaving the land of shirk for the land of Islam: intention, Hijra, or sincerity?",""],
["تعالى","the Exalted","ta'aalaa"],
["تعين","","tu'een"],
["تغيير المنكر","stopping a wrong","taghyeer al-munkar"],
["تقتصر","only","taqtasir"],
["تقتصر الغيبة على القول","Backbiting is only done with words",""],
["تكبيرات","saying Allahu akbar","takbeeraat"],
["تكبيرات الانتقال","saying \"Allahu akbar\" when moving","takbeeraat al-intiqaal"],
["تكثر","","tukthir"],
["تكثر من مشروبات الطاقة","","tukthir min mashroobaat at-taaqa"],
["ثمرات","benefits","thamaraat"],
["ثور","Thawr","thawr"],
["جبريل","Jibreel","jibreel"],
["جبريل عليه السلام","Jibreel, peace be upon him","jibreel 'alayhis-salaam"],
["جبلت","made by nature","jubilat"],
["حاجة","","haaja"],
["حال","how he was","haal"],
["حال … بعد","how he was … after",""],
["حال … بعد نزول الوحي","how … after the revelation came","haal … ba'da nuzool al-wahy"],
["حدد","decide","haddid"],
["حدد نوع التصرف الصادر بكتابة كلمة ( مسؤول أو غير مسؤول )","Decide the type of action by writing the word responsible or irresponsible.",""],
["حراء","Hira","hiraa'"],
["حرم","","harrama"],
["حرم الإسلام الغيبة في حال تغيير المنكر","Islam forbids backbiting when it is done to stop a wrong.",""],
["حمد","","hamd"],
["خالصا","purely","khaalisan"],
["خالصا لله","purely for Allah","khaalisan lillaah"],
["خالصا لله وموافقا لسنة النبي","purely for Allah and following the Sunnah of the Prophet","khaalisan lillaah wa muwaafiqan li-sunnat an-nabee"],
["خديجة","Khadijah","khadeeja"],
["خفاء","secret","khafaa'"],
["خلال","","khilaal"],
["خلق","","khalaqa"],
["خلق الله تعالى الإنسان من ..........","Allah the Exalted created mankind from …",""],
["خلقت الملائكة من نور وخلق الجان من مارج من نار وخلق آدم مما وصف لكم","The angels were created from light, the jinn from a smokeless flame of fire, and Adam from what has been described to you.",""],
["خمسة","","khamsa"],
["دون","write down","dawwin"],
["دون أربعة من ثمرات الإيمان بالملائكة","Write down four benefits of believing in the angels",""],
["دون أسباب آفات اللسان","Write down the causes of the sins of the tongue",""],
["دون أقسام المسؤولية الفردية","Write down the kinds of personal responsibility.",""],
["ذا","the one with","dha"],
["ذا الوجهين","the two-faced one","dhal-wajhayn"],
["ذكر","","dhikr"],
["ذكر الناس بما يكرهونه","mentioning people with what they hate",""],
["ذكر الناس بما يكرهونه بالقول أو الفعل","Mentioning people with what they hate, by words or actions.",""],
["ربنا ولك الحمد","Our Lord, and all praise is Yours","rabbanaa wa lakal-hamd"],
["ركن من أركان","one of the pillars of","rukn min arkaan"],
["رمضان","Ramadan","ramadaan"],
["سمع","","sami'a"],
["سمع الله لمن حمده","Allah hears the one who praises Him","sami'a Allaahu liman hamidah"],
["سنة","sunnah",""],
["سنن","","sunan"],
["سوء","bad","soo'"],
["سوء التربية","a bad upbringing","soo' at-tarbiya"],
["سورة","","soora"],
["سورة العلق","Surah Al-'Alaq","soorat al-'alaq"],
["شاب","","shaabb"],
["شاب أسرف بالسهر خلال شهر رمضان","A young man who stayed up far too late in Ramadan.",""],
["شر الناس","the worst of people","sharr an-naas"],
["شرعا","in Islamic law","shar'an"],
["شرعا :","in Islamic law","shar'an"],
["شروط","conditions","shuroot"],
["شفاعة","the intercession of","shafaa'at"],
["شكر","thanking","shukr"],
["شكر الله تعالى على عنايته ببني آدم","thanking Allah the Exalted for His care for the children of Adam","shukr Allaah ta'aalaa 'alaa 'inaayatihi bi-banee Aadam"],
["شهر","","shahr"],
["صحة","validity of","sihhat"],
["صحة الأعمال","deeds are valid (accepted)","sihhat al-a'maal"],
["ﷺ","ﷺ",""],
["صورة","","soora"],
["صورة واحدة","one single form","soora waahida"],
["ضع خطا تحت","underline","da' khattan taht"],
["ضع علامة","put a mark","da' 'alaama"],
["ضع علامة ( √ ) أو ( × )","put a tick or a cross","da' 'alaama"],
["ضع علامة ( √ ) أو ( × ) أمام العبارات التالية","Put a tick or a cross next to the following statements.",""],
["ط","taa'",""],
["طاعة","obedience","taa'a"],
["طين","clay","teen"],
["ع","'ayn",""],
["عدم","not","'adam"],
["عدم مراقبة الله","forgetting that Allah is watching","'adam muraaqabat Allaah"],
["عرف","define","'arrif"],
["عرف الوحي لغة وشرعا","Define revelation in language and in Islamic law.",""],
["عرف ما يأتي","Define the following",""],
["على","on","'alaa"],
["عليه السلام","peace be upon him","'alayhis-salaam"],
["عليها","it","'alayhaa"],
["عن","about","'an"],
["عنايته","His care","'inaayatihi"],
["غار","cave","ghaar"],
["غار حراء","the cave of Hira","ghaar hiraa'"],
["غير","not","ghayr"],
["غير مسؤول","irresponsible","ghayr mas'ool"],
["فاعل","doer","faa'il"],
["فاعله","its doer","faa'iluhu"],
["فاعلها","its doer","faa'iluhaa"],
["فتاة تكثر من مشروبات الطاقة","A girl who drinks a lot of energy drinks.",""],
["فطرت","made by nature","futirat"],
["فطرت … جبلت","","futirat … jubilat"],
["في","in","fee"],
["في العبادات ( الصلاة )","in acts of worship (prayer)","fil-'ibaadaat (as-salaah)"],
["في العبادات ( الصلاة ) وفي المعاملات ( البيع والشراء )","in worship (prayer) and in dealings (buying and selling)",""],
["في المعاملات ( البيع والشراء )","in dealings with people (buying and selling)","fil-mu'aamalaat (al-bay' wash-shiraa')"],
["قبض","taking","qabd"],
["قبض الأرواح","taking the souls","qabd al-arwaah"],
["كان","","kaana"],
["كان الوحي ينزل على النبي في صورة واحدة","×","Revelation always came to the Prophet in one single form."],
["كثرة المال","lots of money","kathrat al-maal"],
["ل","","laam"],
["لسنة","the Sunnah of","li-sunnat"],
["لطاعتهم","for their obeying","li-taa'atihim"],
["لغة","in language","lugha"],
["لغة :","in language","lugha"],
["لقبول","to receive","li-qabool"],
["للإفساد","","lil-ifsaad"],
["للتشهد","for the tashahhud","lit-tashahhud"],
["لله","Allah","lillaah"],
["ما","what","maa"],
["ما بال أقوام يرفعون أبصارهم إلى السماء في صلاتهم","What is wrong with people who raise their eyes to the sky in their prayer?",""],
["ما حال النبي ﷺ بعد نزول الوحي ؟","How was the Prophet ﷺ after the revelation came?",""],
["ما شاء الله","Maa shaa' Allaah (well done!)","maa shaa' Allaah"],
["ما يثاب تاركه ولا يأثم فاعله","its leaver is rewarded, its doer is not sinful","maa yuthaabu taarikuhu wa laa ya'thamu faa'iluh"],
["ما يثاب فاعله ويأثم تاركه","its doer is rewarded, its leaver is sinful","maa yuthaabu faa'iluhu wa ya'thamu taarikuh"],
["ما يثاب فاعلها ولا يأثم تاركها","its doer is rewarded, its leaver is not sinful","maa yuthaabu faa'iluhaa wa laa ya'thamu taarikuhaa"],
["مبطل","breaks it",""],
["مبطلات","things that break","mubtilaat"],
["محبة","love of","mahabbat"],
["محبة الملائكة لطاعتهم لله","loving the angels because they obey Allah","mahabbat al-malaa'ika li-taa'atihim lillaah"],
["مراقبة","being watched by","muraaqabat"],
["مسـ","mas-",""],
["مسؤول","responsible","mas'ool"],
["مستعدا","ready","musta'iddan"],
["مشروبات الطاقة","energy drinks","mashroobaat at-taaqa"],
["مصاحبة","keeping company with","musaahabat"],
["مصاحبة الأخيار","keeping company with good people","musaahabat al-akhyaar"],
["معنى","the meaning of","ma'naa"],
["مكة","Makkah","makka"],
["مكروه","","makrooh"],
["ملائكة","angels","malaa'ika"],
["ملك","angel","malak"],
["ملك الموت","the Angel of Death","malak al-mawt"],
["ملك الوحي","the angel of revelation","malak al-wahy"],
["ملك الوحي ( جبريل عليه السلام )","the angel of revelation (Jibreel, peace be upon him)","malak al-wahy (jibreel 'alayhis-salaam)"],
["ممتاز","Excellent",""],
["من","from","min"],
["من سنن الصلاة القولية الاستعاذة","al-isti'aadha is one of the spoken sunnahs of prayer",""],
["من مبطلات الصلاة القهقهة","laughing out loud breaks the prayer",""],
["من واجبات الصلاة الالتفات بلا حاجة","turning around without need is one of the required acts of prayer",""],
["موافقا لسنة النبي","following the Sunnah of the Prophet","muwaafiqan li-sunnat an-nabee"],
["موافقا لسنة النبي ﷺ","following the Sunnah of the Prophet ﷺ","muwaafiqan li-sunnat an-nabee"],
["موكل","in charge of","muwakkal"],
["موكل بالأرزاق والنبات والمطر","in charge of provisions, plants and rain","muwakkal bil-arzaaq wan-nabaat wal-matar"],
["ميكائيل","Mikail","meekaa'eel"],
["نار","fire","naar"],
["نزل الوحي على النبي ﷺ عند بلوغه أربعين سنة","√","Revelation came to the Prophet ﷺ when he reached forty."],
["نقل","carrying","naql"],
["نقل الكلام","carrying talk","naql al-kalaam"],
["نقل الكلام للإفساد","carrying talk to make trouble",""],
["نقل الكلام للإفساد بين الناس","Carrying talk to make trouble between people.",""],
["نور","light","noor"],
["نيل","earning","nayl"],
["نيل شفاعة النبي ﷺ","earning the intercession of the Prophet ﷺ","nayl shafaa'at an-nabee"],
["ه","haa'","haa"],
["ـه","-hu",""],
["هؤلاء","these people","haa'ulaa'"],
["ها","-haa","haa"],
["ـها","-haa",""],
["هيا بنا","Let's go","hayyaa binaa"],
["و","waaw","waaw"],
["واجب","required",""],
["واجبات","required acts","waajibaat"],
["واجبات الصلاة","","waajibaat as-salaah"],
["واحدة","","waahida"],
["والكبر","and arrogance","wal-kibr"],
["والمطر","and rain","wal-matar"],
["والنبات","and plants","wan-nabaat"],
["وجبلت","and made by nature","wa jubilat"],
["وجه","","wajh"],
["وحي","","wahy"],
["ورسله","and His messengers","wa rusulahu"],
["ورقة بن نوفل","Waraqa ibn Nawfal","waraqa ibn nawfal"],
["وسرعة","and quickly","wa sur'a"],
["وشرعا","","wa shar'an"],
["وضح","explain","wadd-dih"],
["وضح المسؤولية تجاه الدين","Explain responsibility towards religion.",""],
["وظيفة","job","wadheefa"],
["وقوته","and His power","wa quwwatih"],
["ول","-ool",""],
["ولا","and not","wa laa"],
["ولا يأثم تاركها","","wa laa ya'thamu taarikuhaa"],
["وموافقا","and following","wa muwaafiqan"],
["وهؤلاء","","wa haa'ulaa'"],
["ويأثم","and is sinful","wa ya'thamu"],
["ويأثم تاركه","","wa ya'thamu taarikuh"],
["ى","alif maqsoora","alif maqsoora"],
["ي","yaa'","yaa"],
["يأثم","is sinful","ya'thamu"],
["يبتعد عنها","keeps away from it","yabta'idu 'anhaa"],
["يبلغه","pass it on","yuballighahu"],
["ية","","iyya"],
["ـية","-iyya",""],
["يثاب","is rewarded","yuthaabu"],
["يثاب تاركه","","yuthaabu taarikuh"],
["يحبها","loves it","yuhibbuhaa"],
["يحصل","he gets","yahsulu"],
["يحصل عليها","gets it","yahsulu 'alayhaa"],
["يد","-eed",""],
["يرفعون","they raise","yarfa'oona"],
["يرفعون أبصارهم إلى السماء","they raise their eyes to the sky","yarfa'oona absaarahum ilas-samaa'"],
["يريد","He wants","yureedu"],
["يصيبها","gets it","yuseebuhaa"],
["يطلق","it is used","yutlaqu"],
["يطلق على الإعلام في خفاء وسرعة","telling someone something secretly and quickly","yutlaqu 'alal-i'laam fee khafaa' wa sur'a"],
["يع","-ee'",""],
["يعلم","","yu'allim"],
["يعلم أولاده الصلاة","","yu'allim awlaadahu as-salaah"],
["يكرهونه","they hate it","yakrahoonahu"],
["يكون","","yakoon"],
["ينزل","","yanzil"]];
/* GLOSSARY END */
ISL_GLOSS.forEach(([a,e,t])=>gloss(a,e,t));

/* ---------- 🇬🇧 English and 🔤 Sounds buttons ---------- */
const QP=new URLSearchParams(location.search);
let EN=QP.get('en')==='1',SND=true;
try{SND=localStorage.getItem('isl_sounds')!=='0';}catch(e){}
if(QP.get('tr'))SND=QP.get('tr')==='1';
/* English for a piece of Arabic: the whole phrase, else word by word (known words only); null if nothing is known */
function trAR(t){const k=plain(t);if(GM.has(k))return GM.get(k);if(GS.has(k))return GS.get(k);
  const look=w=>GM.get(w)||GS.get(w)||GM.get(w.replace(/^[وب](?=ال)/,''))||GS.get(w.replace(/^[وب](?=ال)/,''));
  /* the longest known run of Arabic words first ("ملك الموت" before "ملك") */
  const tk=k.split(/([\s+→←·:،,()\[\]\-–…\/"«»=؟?.!]+)/);let out='',hit=false,miss=false;
  for(let i=0;i<tk.length;){if(!HASAR.test(tk[i])){out+=tk[i];i++;continue;}
    let done=false;
    for(let n=Math.min(tk.length-i,11);n>=1;n-=2){const run=tk.slice(i,i+n);if(run.some((x,q)=>q%2&&!/^\s+$/.test(x)))continue;
      const e=look(run.join(' ').replace(/\s+/g,' '));if(e){out+=e;hit=true;i+=n;done=true;break;}}
    if(!done){out+=tk[i];miss=true;i++;}}
  return hit&&!miss?out:null;}
/* wrap Arabic text on the stage that has no English of its own, so the 🇬🇧 button switches it too */
const SKIP='.ax,.aw,.axg,.is-b,.is-tile,.is-slot,.nogl,script,style';
function glossWalk(root){if(!root.closest)return;const bases=root.closest('#stage,#text')?[root]:[...root.querySelectorAll('#stage,#text')];
  const todo=[];let n;
  for(const base of bases){const tw=document.createTreeWalker(base,NodeFilter.SHOW_TEXT);while((n=tw.nextNode()))if(HASAR.test(n.textContent)&&!n.parentElement.closest(SKIP))todo.push(n);}
  todo.forEach(n=>{const e=trAR(n.textContent);if(e==null){(window.__untr=window.__untr||new Set()).add(plain(n.textContent));return;}
    const sp=document.createElement('span');sp.className='axg';sp.dataset.ar=n.textContent;sp.dataset.en=e;sp.textContent=n.textContent;n.replaceWith(sp);});}
function applyEN(root){if(!root||root.nodeType!==1)return;
  if(EN){glossWalk(root);[...(root.matches('.aw:not([data-en])')?[root]:[]),...root.querySelectorAll('.aw:not([data-en])')].forEach(e=>{const t=trAR(e.textContent);if(t)e.dataset.en=t;});}
  const list=[...(root.matches('.ax,.aw,.axg')?[root]:[]),...root.querySelectorAll('.ax,.aw,.axg')];
  list.forEach(e=>{if(e.dataset.ar==null)e.dataset.ar=e.innerHTML;if(e.dataset.en==null)return;const want=EN?e.dataset.en:e.dataset.ar;if(e.innerHTML!==want)e.innerHTML=want;
    e.classList.toggle('en',EN);e.dir=EN?'ltr':'rtl';e.lang=EN?'en':'ar';
    /* a word swapped for much longer English shrinks so it still fits where the Arabic was */
    if(!e.classList.contains('ax')){if(EN){const al=plain(e.dataset.ar).length,el=plain(e.dataset.en).length,r=(al*1.1+4)/el;e.style.fontSize=r<1?Math.max(.42,r).toFixed(2)+'em':'';}else e.style.fontSize='';}});}
document.getElementById('vset').insertAdjacentHTML('beforebegin',
  '<button class="icon" id="tr" title="Show everything in English">🇬🇧 <span class="lbl">English</span></button>'+
  '<button class="icon" id="snds" title="Show how the Arabic sounds">🔤 <span class="lbl">Sounds</span></button>');
const trBtn=document.getElementById('tr'),sndBtn=document.getElementById('snds');
function trUI(){trBtn.innerHTML=EN?'🇰🇼 <span class="lbl">العربية</span>':'🇬🇧 <span class="lbl">English</span>';trBtn.title=EN?'Back to Arabic':'Show everything in English';trBtn.classList.toggle('on',EN);
  sndBtn.classList.toggle('on',SND);sndBtn.title=SND?'Hide the sounds under the Arabic':'Show how the Arabic sounds';
  document.body.classList.toggle('en-mode',EN);document.body.classList.toggle('snd-mode',SND);}
function setEN(on){EN=on;trUI();applyEN(document.body);beep(EN?760:600,.06);if(lastSay)speak(lastSay);}
function setSND(on){SND=on;try{localStorage.setItem('isl_sounds',on?'1':'0');}catch(e){}trUI();beep(SND?700:560,.06);}
trBtn.onclick=()=>setEN(!EN);sndBtn.onclick=()=>setSND(!SND);
addEventListener('keydown',e=>{if(e.key==='t'||e.key==='T')setEN(!EN);if(e.key==='s'||e.key==='S')setSND(!SND);});
new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===3&&EN&&n.parentElement)applyEN(n.parentElement);
  else if(n.nodeType===1&&(EN||n.querySelector?.('.ax')||n.matches?.('.ax')))applyEN(n);})))
  .observe(document.body,{childList:true,subtree:true});
trUI();

/* ---------- Arabic voice ----------
   Hudhud speaks English with the chosen voice (⚙️) and every Arabic part with the device's Arabic voice.
   In English mode the translations are read instead. Qur'an verses are never given to the voice. */
const ARPREF=[/Maged|Majed|Tarik|Laila|Mariam|Hamed|Zariyah|Naayf|Shakir|Salma/i,/Google العربية|Google Arabic/i,/Microsoft/i];
function arVoice(){if(!HAS_TTS)return null;
  const sc=v=>vq(v)*100+(/ar[-_]SA/i.test(v.lang)?50:0)+Math.max(0,...ARPREF.map((r,i)=>r.test(v.name)?ARPREF.length-i:0));
  return speechSynthesis.getVoices().filter(v=>/^ar([-_]|$)/i.test(v.lang)&&!NOVELTY.test(v.name)).sort((a,b)=>sc(b)-sc(a))[0]||null;}
function arClean(t){return t.replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,' و ').replace(/ﷺ/g,' صلى الله عليه وسلم ')
  .replace(/[.…]{2,}|_{2,}/g,'، ').replace(/[()«»√×–]/g,' ').replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{FE0F}\u{200D}]/gu,' ')
  .replace(/\s+/g,' ').replace(/^[،,\s]+/,'').trim();}
function speechParts(html){const d=document.createElement('div');d.innerHTML=html;const out=[];
  const push=(a,t)=>{const l=out[out.length-1];if(l&&l.ar===a)l.t+=' '+t;else out.push({ar:a,t});};
  (function walk(n){n.childNodes.forEach(c=>{
    if(c.nodeType===3){let t=c.textContent;if(EN&&HASAR.test(t)){const e=trAR(t);if(e)t=e;else{push(true,t);return;}}push(false,t.replace(/&/g,'&amp;').replace(/</g,'&lt;'));}
    else if(c.nodeType===1){if(c.classList.contains('aw')){const t=EN?(c.dataset.en||trAR(c.textContent)):null;if(t)push(false,t);else push(true,c.dataset.ar??c.innerHTML);}
      else if(c.classList.contains('ax')){if(EN)push(false,c.dataset.en||'');else push(true,c.dataset.ar??c.innerHTML);}
      else if(c.classList.contains('nospeak'));else if(c.tagName==='BR')push(false,'. ');else walk(c);}});})(d);
  return out.map(p=>({ar:p.ar,t:p.ar?arClean(p.t):cleanSpeech(p.t)})).filter(p=>/[\p{L}\p{N}]/u.test(p.t));}
function speakParts(parts){if(!HAS_TTS)return;speechSynthesis.cancel();speakUntil=0;talk(false);if(!voiceOn||!parts.length)return;
  const my=++speakId,av=arVoice();
  const words=parts.reduce((n,p)=>n+p.t.split(' ').length*(p.ar?1.5:1),0);
  speakUntil=Date.now()+(words/(2.2*rate))*1000+2500+parts.length*500; /* safety cap if 'end' never fires */
  const us=parts.map((p,i)=>{const u=new SpeechSynthesisUtterance(p.t);
    if(p.ar){if(av){u.voice=av;u.lang=av.lang;}else u.lang='ar-SA';u.rate=rate*.85;u.pitch=1;}
    else{if(voice){u.voice=voice;u.lang=voice.lang;}u.rate=rate;u.pitch=1.05;}
    u.onstart=()=>{if(my===speakId)talk(true);};
    if(i===parts.length-1)u.onend=u.onerror=()=>{if(my===speakId){speakUntil=0;talk(false);}};
    return u;});
  const go=()=>us.forEach(u=>speechSynthesis.speak(u));
  if(!speechSynthesis.speaking&&!speechSynthesis.pending)go(); /* direct call keeps iPad/iPhone happy */
  else setTimeout(()=>{if(my===speakId)go();},60);}
speak=html=>speakParts(speechParts(html));
/* Say some Arabic on its own (tapping Arabic on the stage, an answer block or a tile). */
function hearAR(t){if(!voiceOn){voiceOn=true;vUI();}speakParts([{ar:true,t:arClean(t)}].filter(p=>p.t));}
stage.addEventListener('click',e=>{const f=e.target.closest('.ax,.aw,.is-b');if(!f||e.target.closest('.ex-opt,.ex-btn,.bigbtn,button,.sg-chip,.sg-bin,.is-tile'))return;
  if(!voiceOn){voiceOn=true;vUI();}
  if(f.classList.contains('is-b'))hearAR(f.dataset.a);
  else if(EN&&f.classList.contains('ax'))speakParts([{ar:false,t:cleanSpeech(f.dataset.en||'')}]);else hearAR(f.dataset.ar??f.innerHTML);
  f.animate([{transform:'scale(1)'},{transform:'scale(1.1)'},{transform:'scale(1)'}],{duration:350});});

/* ---------- exam checks in Arabic with translations ----------
   examCheck items: q is the Arabic question (literal string), en its English; o the Arabic choices, oe their English;
   tr / otr optional sounds. Written questions: model (Arabic), men (English), mtr (sounds). src stays a literal string.
   The keywords taught in the lessons light up in yellow in the question (with their sounds), so the student links the
   exam question to the clue card. They come from EXAM_KEYS (by src) or from the item's own keys: [[arabic, sounds]] and
   ekeys: [english words]. */
const EXAM_KEYS={
  'Worksheet · Q2 · (a) · جبريل':[[['وظيفة','wadheefa'],['جبريل','jibreel']],['job','Jibreel']],
  'Worksheet · Q2 · (a) · ميكائيل':[[['وظيفة','wadheefa'],['ميكائيل','meekaa\'eel']],['job','Mikail']],
  'Worksheet · Q2 · (a) · ملك الموت':[[['وظيفة','wadheefa'],['ملك الموت','malak al-mawt']],['job','Angel of Death']],
  'Worksheet · Q2 · (b)':[[['ثمرات','thamaraat'],['بالملائكة','bil-malaa\'ika']],['benefits','the angels']],
  'Worksheet · Q2 · (c) · 1':[[['الملائكة','al-malaa\'ika'],['من','min']],['angels','from']],
  'Worksheet · Q2 · (c) · 2':[[['فطرت','futirat'],['وجبلت','wa jubilat']],['made by nature']],
  'Worksheet · Q2 · (c) · 3':[[['ركن من أركان','rukn min arkaan']],['one of the pillars of']],
  'Worksheet · Q2 · (c) · 4':[[['الإنسان','al-insaan'],['من','min']],['mankind','from']],
  'Worksheet · Q3 · (a) · 1':[[['ترك بلد','tark balad']],['Leaving the land']],
  'Worksheet · Q3 · (a) · 2':[[['الوسائل','al-wasaa\'il'],['تعين','tu\'een'],['الإخلاص','al-ikhlaas']],['things','help','sincerity']],
  'Worksheet · Q3 · (a) · 3':[[['شروط','shuroot']],['condition']],
  'Worksheet · Q3 · (a) · 4':[[['يصيبها','yuseebuhaa']],['yuseebuhaa']],
  'Worksheet · Q3 · (b)':[[['ثمرات','thamaraat'],['الإخلاص','al-ikhlaas']],['benefits','sincerity']],
  'Worksheet · Q4 · (a) · 1':[[['أول','awwal'],['سورة','soora']],['first','Surah']],
  'Worksheet · Q4 · (a) · 2':[[['غار','ghaar']],['cave']],
  'Worksheet · Q4 · (a) · 3':[[['الملك','al-malak']],['angel']],
  'Worksheet · Q4 · (b) · 1':[[['أربعين','arba\'een']],['forty']],
  'Worksheet · Q4 · (b) · 2':[[['صورة واحدة','soora waahida']],['one single form']],
  'Worksheet · Q4 · (b) · 3':[[['رمضان','ramadaan']],['Ramadan']],
  'Worksheet · Q4 · (c) · 1':[[['لغة','lugha'],['وشرعا','wa shar\'an']],['in language','in Islamic law']],
  'Worksheet · Q4 · (c) · 2':[[['حال','haal'],['بعد نزول الوحي','ba\'da nuzool al-wahy']],['How','after the revelation came']],
  'Worksheet · Q4 · (c) · 3':[[['بالناموس','bin-naamoos'],['ورقة بن نوفل','waraqa ibn nawfal']],['an-Naamoos','Waraqa ibn Nawfal']],
  'Worksheet · Q5 · (a)':[[['واجبات','waajibaat'],['الصلاة','as-salaah']],['required acts','prayer']],
  'Worksheet · Q5 · (b) · 1':[[['سنن','sunan'],['القولية','al-qawliyya'],['الاستعاذة','al-isti\'aadha']],['spoken sunnahs']],
  'Worksheet · Q5 · (b) · 2':[[['واجبات','waajibaat'],['الالتفات بلا حاجة','al-iltifaat bilaa haaja']],['Turning around without need','required acts']],
  'Worksheet · Q5 · (b) · 3':[[['مبطلات','mubtilaat'],['القهقهة','al-qahqaha']],['Laughing out loud','breaks']],
  'Worksheet · Q5 · (c) · 1':[[['الواجب','al-waajib']],['al-waajib']],
  'Worksheet · Q5 · (c) · 2':[[['السنة','as-sunna']],['as-sunna']],
  'Worksheet · Q5 · (c) · 3':[[['المكروه','al-makrooh']],['al-makrooh']],
  'Hadith 3 · الحديث الثالث':[[['أبصارهم إلى السماء','absaarahum ilas-samaa\'']],['their eyes to the sky']],
  'Worksheet · Q6 · (a)':[[['أسباب','asbaab'],['آفات اللسان','aafaat al-lisaan']],['causes','sins of the tongue']],
  'Worksheet · Q6 · (b) · 1':[[['يكرهونه','yakrahoonahu']],['they hate']],
  'Worksheet · Q6 · (b) · 2':[[['احتقار','ihtiqaar'],['بالهمز واللمز','bil-hamz wal-lamz']],['ooking down on','mocking gestures and digs']],
  'Worksheet · Q6 · (b) · 3':[[['نقل الكلام','naql al-kalaam'],['للإفساد','lil-ifsaad']],['carrying talk','to make trouble']],
  'Worksheet · Q6 · (c) · 1':[[['حرم','harrama'],['تغيير المنكر','taghyeer al-munkar']],['forbids','to stop a wrong']],
  'Worksheet · Q6 · (c) · 2':[[['الحسد والكبر','al-hasad wal-kibr']],['Envy and arrogance']],
  'Worksheet · Q6 · (c) · 3':[[['تقتصر','taqtasir'],['القول','al-qawl']],['only','words']],
  'Worksheet · Q7 · (a) · 1':[[['أسرف','asrafa'],['بالسهر','bis-sahar']],['stayed up far too late']],
  'Worksheet · Q7 · (a) · 2':[[['تكثر','tukthir'],['مشروبات الطاقة','mashroobaat at-taaqa']],['a lot of','energy drinks']],
  'Worksheet · Q7 · (a) · 3':[[['يعلم','yu\'allim'],['الصلاة','as-salaah']],['teaches','to pray']],
  'Worksheet · Q7 · (b)':[[['أقسام','aqsaam'],['المسؤولية الفردية','al-mas\'ooliyya al-fardiyya']],['kinds','personal responsibility']],
  'Worksheet · Q7 · (c)':[[['تجاه','tujaah'],['الدين','ad-deen']],['towards','religion']],
  'Practice · Q7 · (b) · the endings · الأسرية':[[['الأسرة','al-usra']],['the family']],
  'Practice · Q7 · (b) · the endings · المجتمعية':[[['المجتمع','al-mujtama\'']],['society']],
  'Toolkit · instruction words · أكمل':[[['أكمل','akmil']],[]],
  'Toolkit · instruction words · ضع خطا تحت':[[['ضع خطا تحت','da\' khattan taht']],[]],
  'Toolkit · instruction words · عرف':[[['عرف','\'arrif']],[]],
  'Toolkit · instruction words · حدد':[[['حدد','haddid']],[]],
  'Toolkit · dotted lines · دون':[[['دون','dawwin'],['......','4 lines']],['four dotted lines']],
  'Toolkit · section headings · الفقه':[[['الفقه','al-fiqh']],[]],
  'Toolkit · section headings · الثقافة الإسلامية':[[['الثقافة الإسلامية','ath-thaqaafa al-islaamiyya']],[]],
};
/* Light up the first appearance of each keyword in a plain-text question (longest keywords first, never overlapping). */
function markKeys(text,keys){if(!keys||!keys.length)return text;const used=[];
  [...keys].sort((a,b)=>b[0].length-a[0].length).forEach(([k,tr])=>{let from=0,i;
    while((i=text.indexOf(k,from))>=0&&used.some(u=>i<u.e&&i+k.length>u.s))from=i+1;
    if(i>=0)used.push({s:i,e:i+k.length,tr});});
  used.sort((a,b)=>b.s-a.s).forEach(u=>{text=text.slice(0,u.s)+kw(text.slice(u.s,u.e),u.tr)+text.slice(u.e);});
  return text;}
function examQ(it){const K=EXAM_KEYS[it.src]||[];const keys=it.keys||K[0],ekeys=it.ekeys||K[1];
  if(it.en==null)return it.q;
  return ar(markKeys(it.q,keys),markKeys(it.en,(ekeys||[]).map(e=>[e])),it.tr,'blk');}
{const ask0=ask,reveal0=reveal;
  ask=(w,it)=>ask0(w,Object.assign({},it,{q:examQ(it),o:it.o.map((t,i)=>it.oe&&it.oe[i]!=null?ar(t,it.oe[i],it.otr&&it.otr[i]):t)}));
  reveal=(w,it)=>reveal0(w,Object.assign({},it,{q:examQ(it),model:it.men!=null?ar(it.model,it.men,it.mtr):it.model}));}

/* ---------- small helpers ---------- */
const clear=keep=>[...stage.children].forEach(e=>{if(!keep||!keep.includes(e))e.remove();});
/* A pointing hand that glides to whatever Hudhud is talking about (one per scene). */
function point(el){
  let h=stage.querySelector('.is-point');
  if(!h){h=mk('is-point','left:0;top:0;opacity:0','👉');loop(h,[{marginLeft:'0px'},{marginLeft:'-9px'}],550,{direction:'alternate'});}
  let l=0,t=0,e=el;while(e&&e!==stage){l+=e.offsetLeft;t+=e.offsetTop;e=e.offsetParent;}
  const x=Math.max(0,l-50),y=t+Math.min(el.offsetHeight,60)/2-26;
  an(h,[{opacity:1,transform:`translate(${x}px,${y}px)`}],{duration:550});return h;}
const unpoint=()=>stage.querySelector('.is-point')?.remove();
const BCOL=['#18a058','#2c66cf','#e06a1b','#6a45d8','#c2367a','#0f7a6e','#b8860b'];
/* Coloured answer blocks, read right to left like Arabic: blocks [[arabic, sounds, meaning, colour?]].
   Tap a block to hear it. Returns the container (its children are the blocks, in reading order). */
function ansBlocks(x,y,wd,blocks,{size,show=true}={}){
  const c=mk('is-blocks',`left:${x}px;top:${y}px;width:${wd}px`,'');
  gloss(blocks.map(b=>b[0]).join(' '),blocks.every(b=>b[2])?blocks.map(b=>b[2]).join(' '):'',blocks.map(b=>b[1]).join(' '));
  blocks.forEach(([a,s,m,col],i)=>{gloss(a,m,s);const b=document.createElement('div');b.className='is-b ar-font';b.dataset.a=a;b.style.background=col||BCOL[i%BCOL.length];
    b.innerHTML=`<div class="a" dir="rtl"${size?` style="font-size:${size}px"`:''}>${a}</div><div class="s">${s}</div>${m?`<div class="m">${m}</div>`:''}`;
    if(!show)b.style.visibility='hidden';c.appendChild(b);});
  return c;}
/* show the blocks one at a time, each read aloud in Arabic with its meaning */
async function revealBlocks(w,c,{say:sayIt=true,wait=1300}={}){for(const b of c.children){b.style.visibility='visible';pop(b);beep(520+[...c.children].indexOf(b)*60,.06);point(b);
    if(sayIt){const m=b.querySelector('.m');say(`${aw(b.dataset.a,b.querySelector('.s').textContent)}${m?': '+m.textContent:''}`);}await w(wait);}}

/* ---------- a clue card: find the keyword, know the answer ----------
   The routine for one worksheet question:
   1. the question appears (Arabic, no answer) and Hudhud reads it;
   2. the instruction word is shown (kind: [arabic, sounds, meaning]);
   3. "keyword only": the rest of the question fades and each keyword lights up while Hudhud explains it
      (keys: [[spoken explanation]] in order of the kw() spans in q);
   4. the clue (keyword → picture → answer) is shown: clue: 'html';
   5. the student thinks, then taps "Show me"; 6. the answer appears as coloured blocks, is stamped and explained.
   q / en: the question in Arabic and English, with the keywords marked with kw(). tr: optional sounds of the question.
   answer: [[arabic, sounds, meaning]] blocks; stamp: the answer's Arabic (default: the blocks joined). */
async function clueCard(w,{src,q,en,tr,kind,keys=[],clue,answer,stamp,why,x=30,y=10,wd=900,blockSize,readQ=true,
    think:th=`Your turn. Which answer goes with this keyword? When you're ready, tap <b>Show me</b>.`}){
  const st=stamp||answer.map(b=>b[0]).join(' ');gloss(st,answer.every(b=>b[2])?answer.map(b=>b[2]).join(' '):'',answer.map(b=>b[1]).join(' '));
  const c=mk('is-card',`left:${x}px;top:${y}px;width:${wd}px;z-index:20`,`<div class="src">${src}</div><div class="q">${ar(q,en,tr,'blk')}</div>`+
    `<div class="stamp">${st==='√'||st==='×'?`<span style="font-size:1.4em">${st}</span>`:`<span class="ar-font" dir="rtl">✔ ${st}</span>`}</div>`);pop(c);
  await w(60);point(c.querySelector('.q'));
  if(readQ){say(`Here's the question: ${ar(q,en)}`);await w(1800);}
  let cy=y+c.offsetHeight+12;
  const extra=[]; /* the instruction chip and the clue line: removed later if the explanation would not fit */
  if(kind){const k=mk('is-chip',`left:${x+20}px;top:${cy}px`,`<span class="ar-font">${aw(kind[0],kind[1])}</span><span>= ${kind[2]}</span>`);pop(k);point(k);extra.push(k);
    say(`The instruction word is ${aw(kind[0],kind[1])}. It means <b>${kind[2]}</b>.`);await w(2200);cy+=k.offsetHeight+10;}
  if(keys.length){c.classList.add('dim');say(`You don't need every word. Look for the <b>keyword</b>.`);await w(1600);c.classList.add('lit');
    const K=[...c.querySelectorAll('.kw')];
    for(let i=0;i<keys.length;i++){const k=K[Math.min(i,K.length-1)];if(k){point(k);k.animate([{transform:'scale(1)'},{transform:'scale(1.25)'},{transform:'scale(1)'}],{duration:600});}
      say(keys[i]);await w(2000);}
    c.classList.remove('dim');}
  if(clue){const k=mk('is-clue',`left:${x+20}px;top:${cy}px`,'🔎 '+clue);pop(k);point(k);extra.push(k);await w(400);cy+=k.offsetHeight+12;}
  say(th);let open=false;
  const b=btn('ex-btn green',`left:${x+20}px;top:${cy}px;width:220px;z-index:30`,'👀 Show me',()=>{open=true;});pop(b);point(b);
  window.AUTOPLAY=()=>{open=true;};
  await w.until(()=>open);window.AUTOPLAY=null;b.remove();
  const bl=ansBlocks(x+20,cy,wd-40,answer,{size:blockSize,show:false});await w(30);
  await revealBlocks(w,bl,{wait:answer.length>2?900:1300});
  const sp=c.querySelector('.stamp');sp.style.visibility='visible';
  an(sp,[{transform:'scale(3) rotate(-20deg)',opacity:0},{transform:'rotate(-2deg)',opacity:1}],{duration:500,fill:'both',easing:'cubic-bezier(.5,1.6,.5,1)'});yay();point(sp);
  say(st==='√'?`So it's <b>true</b>: put a tick √.`:st==='×'?`So it's <b>false</b>: put a cross ×.`:`So the answer is ${aw(st,answer.map(b=>b[1]).join(' '))}.`);await w(1800);
  if(why){const e=mk('is-why',`left:${x+20}px;top:${cy+bl.offsetHeight+12}px;width:${wd-40}px`,'💡 '+why);await w(30);
    /* too tall for the stage: drop the chip and clue (already read) and move the answer up */
    const over=e.offsetTop+e.offsetHeight-512;
    if(over>0&&extra.length){const top=Math.min(...extra.map(el=>el.offsetTop)),up=Math.min(over,bl.offsetTop-top);
      extra.forEach(el=>el.remove());bl.style.top=(bl.offsetTop-up)+'px';e.style.top=(e.offsetTop-up)+'px';}
    if(e.offsetTop+e.offsetHeight>512)e.style.fontSize='15px';
    pop(e);point(e);say(why);await w(2400);}
  return c;}

/* ---------- "Build the answer" ----------
   The student taps Arabic tiles in order (they fill right to left), then presses Check. tiles: [[arabic, sounds]]
   (add one or two wrong ones); answer: the right list of Arabic tiles. q: the question (html). Resolves to {ok, y}. */
async function buildAR(w,{q,src,tiles,answer,top=16}){
  const box=mk('ex-q',`top:${top}px`,(src?`<span class="src">${src}</span>`:'')+q);pop(box);
  await w(60);const y=top+box.offsetHeight+14;
  const slot=mk('is-slot ar-font',`left:110px;top:${y}px;width:740px`,'');pop(slot);
  let seq=[],checked=false,ck=null,ckTop=y+180;
  const show=()=>{slot.innerHTML=seq.length?seq.map(i=>aw(tiles[i][0],tiles[i][1],GM.get(tiles[i][0]))).join(''):'<i>Tap the tiles in order. Arabic is written from right to left ⬅</i>';
    T.forEach((t,i)=>t.classList.toggle('used',seq.includes(i)));
    if(seq.length&&!ck&&!checked)ck=btn('ex-btn green',`left:380px;top:${ckTop}px;width:200px`,'Check ✔',()=>{checked=true;});
    if(!seq.length&&ck){ck.remove();ck=null;}};
  const T=tiles.map(([a,s],i)=>btn('is-tile ar-font','left:0;top:0;visibility:hidden',`<span class="a" dir="rtl">${a}</span><span class="s">${s}</span>${GM.get(a)?`<span class="m">${GM.get(a)}</span>`:''}`,()=>{if(checked||seq.includes(i))return;seq.push(i);beep(560+seq.length*40,.05);hearAR(a);show();}));
  const del=btn('is-del','left:0;top:0;visibility:hidden','⌫',()=>{if(checked)return;seq.pop();beep(300,.05);show();});
  await w(30);
  const all=[...T,del],gap=12,rows=[[]];let rw=0;
  all.forEach(b=>{const bw=b.offsetWidth;if(rw+bw>880&&rows[rows.length-1].length){rows.push([]);rw=0;}rows[rows.length-1].push(b);rw+=bw+gap;});
  /* tiles are laid out right to left, like the answer */
  rows.forEach((r,ri)=>{let x=480+(r.reduce((s,b)=>s+b.offsetWidth+gap,0)-gap)/2;r.forEach((b,i)=>{x-=b.offsetWidth;b.style.left=x+'px';b.style.top=(y+100+ri*88)+'px';b.style.visibility='';pop(b,i*40);x-=gap;});});
  ckTop=y+100+rows.length*88+4;show();
  window.AUTOPLAY=()=>{if(!seq.length){seq=answer.map(a=>tiles.findIndex(t=>t[0]===a));show();}};
  await w.until(()=>checked);window.AUTOPLAY=null;
  if(ck)ck.remove();T.forEach(b=>b.remove());del.remove();
  const ok=seq.length===answer.length&&seq.every((i,k)=>tiles[i][0]===answer[k]);
  slot.classList.add(ok?'ok':'bad');if(ok){yay();confetti(40);}else{boo();shake(slot);}
  if(!ok){const r=mk('is-blocks',`left:110px;top:${y+100}px;width:740px;justify-content:center`,'');
    r.innerHTML=`<div class="is-why" style="font-size:19px">✔ <span class="ar-font" dir="rtl" style="font-size:30px">${answer.join(' ')}</span></div>`;pop(r);}
  return{ok,y:y+96};}

/* ---------- Trace it ----------
   A big grey Arabic word the student traces over with a finger (or the mouse). The app checks how much of the
   word the strokes have covered (and that they did not just colour the whole box). word: arabic; tr, en: its sounds
   and meaning. Resolves to the share covered (0–1) once the student presses Done (or it is fully traced). */
async function traceAR(w,{word,tr,en,x=60,y=96,wd=840,h=300,need=.6}){
  const pad=mk('is-pad',`left:${x}px;top:${y}px;width:${wd}px;height:${h}px`,'');pop(pad);
  const lab=mk('',`left:${x}px;top:${y-44}px;width:${wd}px;text-align:center;font-size:20px;font-weight:800;color:#7a4a00`,
    `✍️ Trace <span class="ar-font" style="font-size:28px">${aw(word,tr,en)}</span> · <span style="color:#2c66cf">${tr}</span> · ${en}`);pop(lab);
  const R=2,cv=document.createElement('canvas'),ink=document.createElement('canvas');
  [cv,ink].forEach(c=>{c.width=wd*R;c.height=h*R;c.style.width=wd+'px';c.style.height=h+'px';pad.appendChild(c);});
  const g=cv.getContext('2d'),k=ink.getContext('2d');
  /* fit the word to the pad */
  let fs=Math.min(h*.62,220)*R;g.font=`700 ${fs}px "Geeza Pro","Noto Naskh Arabic","Noto Sans Arabic","DejaVu Sans",sans-serif`;g.direction='rtl';
  while(g.measureText(word).width>wd*R*.86&&fs>30){fs*=.92;g.font=`700 ${fs}px "Geeza Pro","Noto Naskh Arabic","Noto Sans Arabic","DejaVu Sans",sans-serif`;}
  g.textAlign='center';g.textBaseline='middle';
  const draw=col=>{g.clearRect(0,0,cv.width,cv.height);g.fillStyle=col;g.fillText(word,cv.width/2,cv.height*.54);};
  draw('#000');
  /* the word's pixels, sampled on a grid */
  const S=4*R,glyph=g.getImageData(0,0,cv.width,cv.height).data,pts=[];
  for(let yy=0;yy<cv.height;yy+=S)for(let xx=0;xx<cv.width;xx+=S)if(glyph[(yy*cv.width+xx)*4+3]>128)pts.push(yy*cv.width+xx);
  draw('#e6dcc6');g.setLineDash([6*R,6*R]);g.lineWidth=1.5*R;g.strokeStyle='#b9a27a';g.strokeText(word,cv.width/2,cv.height*.54);
  const meter=mk('is-meter',`left:${x+wd/2-160}px;top:${y+h+12}px;width:320px`,'<i></i>');pop(meter);
  k.lineCap=k.lineJoin='round';k.lineWidth=Math.max(18,fs*.14);k.strokeStyle='rgba(44,102,207,.85)';
  let down=false,last=null,cover=0,done=false,inkPx=0;
  const pos=e=>{const r=ink.getBoundingClientRect();return[(e.clientX-r.left)*ink.width/r.width,(e.clientY-r.top)*ink.height/r.height];};
  const measure=()=>{const d=k.getImageData(0,0,ink.width,ink.height).data;let hit=0;pts.forEach(p=>{if(d[p*4+3]>40)hit++;});
    let n=0;for(let i=3;i<d.length;i+=4*S*S)if(d[i]>40)n++;inkPx=n;cover=pts.length?hit/pts.length:0;meter.firstChild.style.width=Math.min(100,cover/need*100)+'%';};
  ink.addEventListener('pointerdown',e=>{if(done)return;down=true;last=pos(e);ink.setPointerCapture(e.pointerId);k.beginPath();k.arc(last[0],last[1],k.lineWidth/2,0,7);k.fillStyle=k.strokeStyle;k.fill();});
  ink.addEventListener('pointermove',e=>{if(!down||done)return;const p=pos(e);k.beginPath();k.moveTo(...last);k.lineTo(...p);k.stroke();last=p;});
  const up=()=>{if(!down)return;down=false;measure();beep(500+cover*500,.04);};
  ink.addEventListener('pointerup',up);ink.addEventListener('pointercancel',up);
  const clr=btn('ex-btn',`left:${x+wd-170}px;top:${y+h+30}px;width:160px`,'🧽 Clear',()=>{if(done)return;k.clearRect(0,0,ink.width,ink.height);measure();});
  let fin=false;const ok=btn('ex-btn green',`left:${x+10}px;top:${y+h+30}px;width:190px`,'✔ Done',()=>{measure();fin=true;});pop(ok);pop(clr);
  window.AUTOPLAY=()=>{k.fillStyle='rgba(44,102,207,.85)';k.font=g.font;k.direction='rtl';k.textAlign='center';k.textBaseline='middle';k.fillText(word,ink.width/2,ink.height*.54);measure();fin=true;};
  await w.until(()=>fin);window.AUTOPLAY=null;done=true;ok.remove();clr.remove();
  /* scribbling over the whole box does not count */
  const tooMuch=inkPx>pts.length*3.2;const good=cover>=need&&!tooMuch;
  draw(good?'#18a058':'#e6dcc6');pad.style.borderColor=good?'#18a058':'#f0d9a8';
  if(good){yay();confetti(40);}else beep(300,.12);
  return{ok:good,cover,tooMuch};}

/* ---------- tick or cross (ضع علامة √ أو ×) ----------
   A clue card whose answer is a big √ (true) or × (false). The deciding word is marked with kw() in q and en;
   keys explain it. ok: true for √. */
const TICK=[['√','saheeh','true','#18a058']],CROSS=[['×','khata\'','false','#e04848']];
function tfCard(w,o){return clueCard(w,Object.assign({kind:['ضع علامة ( √ ) أو ( × )','da\' \'alaama','put a tick or a cross'],
  think:`Your turn. Is it true √ or false ×? The keyword decides. Tap <b>Show me</b> when you're ready.`},o,
  {answer:o.ok?TICK:CROSS,stamp:o.ok?'√':'×',blockSize:46}));}
