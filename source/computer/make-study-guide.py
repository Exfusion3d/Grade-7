"""Writes source/computer/study-guide-source.html (the Computer study guide), which is then printed to
computer-study-guide.pdf (command in README.md). The 25 written questions, their model answers (key phrases in
{curly brackets}) and memory tricks are read from computer-trainer.html, so the guide and the Answer Trainer always
match: edit an answer there, then run this script again. Everything else (lesson sections, cheat sheet) is below."""
import re, html, os
ROOT=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
js=open(ROOT+'/computer-trainer.html').read()
S=r"'((?:[^'\\]|\\.)*)'"
Q={}
for m in re.finditer(r"\{id:'(q\d+)',s:'(Q\d+)',l:'(c\d+)',q:"+S+r",\s*a:"+S+r",\s*k:\[.*?\],\s*hint:"+S+r", t:"+S, js, re.S):
    id_,s,l,q,a,hint,t=m.groups()
    un=lambda x:x.replace("\\'","'")
    Q[id_]=dict(s=s,l=l,q=un(q),a=un(a),t=un(t))
assert len(Q)==25, len(Q)
def qh(q,kw=True): return re.sub(r'\[([^\]]*)\]', (r'<span class="kw">\1</span>' if kw else r'\1'), html.escape(q,quote=False).replace('&#x27;',"'"))
def ah(a):
    a=re.sub(r'\{([^}]*)\}', r'<b class="kp">\1</b>', a)
    out='';ol=''
    for x in a.split('|'):
        if re.match(r'^\d\.\s*',x): ol+='<li>'+re.sub(r'^\d\.\s*','',x)+'</li>'
        else:
            if ol: out+='<ol>'+ol+'</ol>'; ol=''
            out+='<p>'+x+'</p>'
    return out+('<ol>'+ol+'</ol>' if ol else '')
def written(ids):
    r=''
    for i in ids:
        c=Q[i]
        r+=f'<div class="wq"><div class="wqh"><span class="qn">{c["s"]}</span><span class="wqq">{qh(c["q"])}</span></div><div class="wqa">{ah(c["a"])}</div><div class="wqt">💡 {c["t"]}</div></div>'
    return r
def mcq(rows):
    r='<table class="ws"><tr><th style="width:40px">#</th><th>Tick the correct option</th></tr>'
    for n,q,opts,ok in rows:
        o=' '.join(f'<span class="opt{" ok" if i==ok else ""}">{"✔ " if i==ok else ""}({"abc"[i]}) {x}</span>' for i,x in enumerate(opts))
        r+=f'<tr><td class="n">{n}</td><td><div class="mq">{q}</div><div>{o}</div></td></tr>'
    return r+'</table>'
def blanks(rows):
    r='<table class="ws"><tr><th style="width:40px">#</th><th>Fill in the blanks</th></tr>'
    for n,s in rows: r+=f'<tr><td class="n">{n}</td><td>{s.replace("{","<span class=\"fill\">").replace("}","</span>")}</td></tr>'
    return r+'</table>'
def tf(rows):
    r='<table class="ws"><tr><th style="width:40px">#</th><th>Write T for true and F for false</th><th style="width:44px">Ans</th></tr>'
    for n,s,a,*why in rows:
        w=f'<div class="why">{why[0]}</div>' if why else ''
        r+=f'<tr><td class="n">{n}</td><td>{s}{w}</td><td class="tf {a}">{a}</td></tr>'
    return r+'</table>'
def box(kind,lab,body): return f'<div class="box {kind}"><span class="lab">{lab}</span>{body}</div>'
def tryq(items): return '<div class="try"><span class="lab">✏️ Try these (answers at the back)</span><ol>'+''.join(f'<li>{x}</li>' for x in items)+'</ol></div>'
def kws(words): return '<div class="kwl"><span class="lab">Key words</span> '+' '.join(f'<span class="chip">{w}</span>' for w in words)+'</div>'
def code(s): return f'<span class="cd">{s}</span>'
T=lambda s:f'<span class="t-tag">{s}</span>'
A=lambda s:f'<span class="t-att">{s}</span>'
V=lambda s:f'<span class="t-str">{s}</span>'

PARTS={1:('Part 1 · Web pages with HTML','#0e7490','#22b8c9','p1'),2:('Part 2 · Styling with CSS','#6a45d8','#9b7cf0','p2'),3:('Part 3 · Programming and Python','#e06a1b','#f5a54a','p3'),4:('Part 4 · Drawing in GIMP','#17935b','#4cc28a','p4')}
SECT=[]
def lesson(n,part,emoji,title,big,keywords,body):
    p=PARTS[part];brk=n in (1,5,7,9)
    body=re.sub(r'(<div class="box tip">.*?</div>)\n(<div class="box warn">.*?</div>)',r'<div class="duo">\1\2</div>',body,flags=re.S)
    SECT.append(f'''<section class="les {p[3]}{'' if brk else ' flow'}"><div class="banner" style="background:linear-gradient(120deg,{p[1]},{p[2]})"><div class="e">{emoji}</div><div><div class="pt">{p[0]}</div><h2>Lesson {n} · {title}</h2></div></div>
<div class="bigidea"><span class="lab">The big idea</span>{big}</div>{kws(keywords)}{body}</section>''')

# ---------------- c01
lesson(1,1,'🌐','What is HTML?',
 '<b>HTML</b> (Hypertext Markup Language) is the language web pages are written in. It was developed in <b>1990</b> by the scientist <b>Tim Berners-Lee</b>. An HTML file is just plain text, so you can type it in <b>Notepad</b> and open it in any <b>web browser</b>.',
 ['HTML','web page','World Wide Web','hyperlink','W3C','HTML editor','text editor','web browser'],
 f'''<div class="two"><div class="fig"><div class="win"><div class="wbar">🗒️ index.html - Notepad</div><div class="wcode">{T('&lt;HTML&gt;')}<br>&nbsp;{T('&lt;BODY&gt;')}<br>&nbsp;&nbsp;Hello, world!<br>&nbsp;{T('&lt;/BODY&gt;')}<br>{T('&lt;/HTML&gt;')}</div></div><div class="cap">1. Type the HTML in a text editor and save it as <b>.html</b></div></div>
<div class="fig"><div class="win"><div class="wbar">🌐 Microsoft Edge</div><div class="wpage">Hello, world!</div></div><div class="cap">2. Double-click the file, or open Edge and press <b>Ctrl + O</b></div></div></div>
<h3>From your worksheet</h3>
{blanks([('B1','{W3C} is an organisation which sets international standards for the World Wide Web.'),('B3','{HTML} documents can be viewed on any type of web browser.')])}
{tf([('C2','You can create HTML documents with Notepad, WordPad, or any other text editor.','T','HTML is just text, so any text editor works.')])}
<h3>Written questions (learn these answers)</h3>
{written(['q1','q2','q3','q4','q5'])}
{box('warn','⚠️ Watch out','<b>Notepad</b> is a <i>text</i> editor; <b>Dreamweaver</b>, <b>UltraEdit</b> and <b>TextMate</b> are <i>HTML</i> editors. Don\'t swap them. <b>W3C</b> (World Wide Web Consortium) sets the rules for the web; it is not a program.')}
{tryq(['Who developed HTML, and in which year?','Name two text editors you can use to write HTML.','Which two keys open an HTML file in Microsoft Edge?'])}''')

# ---------------- c02
lesson(2,1,'🏷️','HTML tags and page structure',
 '<b>Tags</b> are the instructions of HTML. Each tag sits inside <b>angular brackets</b> &lt; &gt;. Most tags come in pairs: an <b>opening tag</b> like '+code('&lt;BODY&gt;')+' and a <b>closing tag</b> with a slash like '+code('&lt;/BODY&gt;')+'; these are <b>container tags</b>. Every page has the same skeleton: HTML on the outside, then HEAD, then BODY.',
 ['tag','angular brackets &lt; &gt;','opening tag','closing tag','container tag','HEAD','BODY'],
 f'''<div class="two"><div class="fig"><div class="nest"><div class="n1"><span class="tg">{code('&lt;HTML&gt;')}</span><div class="n2 h"><span class="tg">{code('&lt;HEAD&gt;')}</span> the title and styles <span class="tg">{code('&lt;/HEAD&gt;')}</span></div><div class="n2 b"><span class="tg">{code('&lt;BODY&gt;')}</span> what you see on the page <span class="tg">{code('&lt;/BODY&gt;')}</span></div><span class="tg">{code('&lt;/HTML&gt;')}</span></div></div><div class="cap">The page skeleton: boxes inside a box</div></div>
<div class="fig"><div class="tagpic"><div><span class="big">{T('&lt;')}</span><span class="big">P</span><span class="big">{T('&gt;')}</span><div class="lb">opening tag</div></div><div><span class="big">{T('&lt;')}</span><span class="big">{T('/')}</span><span class="big">P</span><span class="big">{T('&gt;')}</span><div class="lb">closing tag: the slash <b>/</b> closes</div></div></div><div class="cap">&lt; is "less than", &gt; is "greater than": together, angular brackets</div></div></div>
<h3>From your worksheet</h3>
{mcq([('A1','Which of the following is the correct structure of HTML tags?',[code('&lt;HTML&gt; &lt;HTML&gt; &lt;/HEAD&gt; &lt;HEAD&gt; &lt;/BODY&gt; &lt;/BODY&gt;'),code('&lt;HTML&gt; &lt;/HTML&gt; &lt;HEAD&gt; &lt;/HEAD&gt; &lt;BODY&gt; &lt;/BODY&gt;'),code('&lt;HTML&gt; &lt;HEAD&gt; &lt;/HEAD&gt; &lt;BODY&gt; &lt;/BODY&gt; &lt;/HTML&gt;')],2)])}
<h3>Written questions (learn these answers)</h3>
{written(['q6','q7'])}
{box('tip','💡 Memory trick','<b>H-H-B-H</b>: open <b>H</b>TML, then <b>H</b>EAD (open and close), then <b>B</b>ODY (open and close), and close <b>H</b>TML last. The head comes before the body, like on you! 🙂')}
{box('warn','⚠️ Watch out','In A1, option (b) closes HTML straight away, so HEAD and BODY end up outside the page. '+code('&lt;/HTML&gt;')+' is always the <b>very last</b> tag. The slash goes at the <b>start</b>: '+code('&lt;/BODY&gt;')+', not '+code('&lt;BODY/&gt;')+'.')}
{tryq(['Write the closing tag for '+code('&lt;HEAD&gt;')+'.','Which tag is always the last tag on the page?','What do we call tags that have both an opening and a closing tag?'])}''')

# ---------------- c03
lesson(3,1,'🖼️','Pictures on a web page',
 'The '+code('&lt;IMG&gt;')+' tag adds a picture to a web page. Its <b>attributes</b> give extra details: <b>src</b> (which picture file), <b>alt</b> (the alternate text shown if the picture can\'t be displayed), <b>height</b> and <b>width</b>. Pictures can be <b>.jpg</b>, <b>.gif</b>, <b>.png</b> or <b>.bmp</b> files.',
 ['&lt;IMG&gt;','attribute','src','alt (alternate text)','height','width','.jpg .gif .png'],
 f'''<div class="fig"><div class="cbox">{T('&lt;IMG')} {A('src')}={V('"cat.png"')} {A('alt')}={V('"My cat"')} {A('height')}={V('"200"')} {A('width')}={V('"300"')}{T('&gt;')}</div>
<div class="arrows"><span>the tag</span><span>the picture file</span><span>text if the picture can't show</span><span>size</span></div></div>
<div class="two"><table class="mini"><tr><th>Picture file? ✔</th><th>Not a picture ✘</th></tr><tr><td>.jpg &nbsp;.gif &nbsp;.png &nbsp;.bmp</td><td>.xlsx (Excel) &nbsp;.docx (Word)</td></tr></table>
<div class="fig"><div class="broken">🖼️❌ <i>My cat</i></div><div class="cap">If the picture can't load, the <b>alt</b> text is shown</div></div></div>
<h3>From your worksheet</h3>
{mcq([('A6','Which of the following is not an image file format?',['.jpg','.gif','.xlsx'],2),('A8','Which of the following is not an attribute of the '+code('&lt;IMG&gt;')+' tag?',['Height','Width','Target'],2)])}
{blanks([('B6','The {&lt;IMG&gt;} tag is used to add a picture to a web page.'),('B7','The {alt} attribute is used to specify an alternate text.')])}
{tf([('C6','You cannot insert .png images on a web page.','F','.png is a picture format, so you <b>can</b> insert it.'),('C9','Alt attribute is used to specify the text if an image is not displayed on a web page.','T')])}
{box('tip','💡 Memory trick','<b>alt</b> = <b>alt</b>ernate text: the picture\'s <b>alt</b>ernative when it can\'t be seen. <b>.xlsx</b> has an <b>x</b> for e<b>x</b>cel: a spreadsheet, not a picture.')}
{box('warn','⚠️ Watch out','<b>target</b> is an attribute of <b>links</b>, not of '+code('&lt;IMG&gt;')+'. The sentence "You cannot insert .png images" is <b>False</b>: .png <b>can</b> be inserted.')}
{tryq(['Which attribute gives the text shown when a picture cannot be displayed?','Is .gif a picture format? Is .xlsx?','Write an '+code('&lt;IMG&gt;')+' tag for a picture called <b>sun.jpg</b>.'])}''')

# ---------------- c04
lesson(4,1,'🔗','Links: internal, external and URLs',
 'A <b>link</b> (hyperlink) takes you to another page when you click it. There are two types of linking: <b>internal</b> and <b>external</b>. The address of a page is its <b>URL</b>: an <b>absolute URL</b> is the complete address; a <b>relative URL</b> is a short one. The <b>target</b> attribute says where the link opens, and <b>link</b>, <b>alink</b> and <b>vlink</b> set link colours.',
 ['link (hyperlink)','internal linking','external linking','URL','absolute URL','relative URL','target','link · alink · vlink'],
 f'''<div class="fig"><div class="url"><span class="u1">https://</span><span class="u2">www.myschool.com</span><span class="u3">/pages/</span><span class="u4">news.html</span></div>
<div class="arrows"><span>how</span><span>the website</span><span>the folder</span><span>the file</span></div><div class="cap">An <b>absolute URL</b> has every part: the complete path. A <b>relative URL</b> is just the end, e.g. <b>news.html</b>.</div></div>
<div class="two"><table class="mini"><tr><th>Attribute (in &lt;BODY&gt;)</th><th>Colours…</th></tr><tr><td><b>link</b></td><td>links not clicked yet</td></tr><tr><td><b>alink</b></td><td><b>a</b>ctive links (being clicked)</td></tr><tr><td><b>vlink</b></td><td><b>v</b>isited links</td></tr></table>
<div class="cbox small">{T('&lt;A')} {A('href')}={V('"news.html"')} {A('target')}={V('"_blank"')}{T('&gt;')}News{T('&lt;/A&gt;')}<div class="lbw">target="_blank" opens the link in a new tab</div></div></div>
<h3>From your worksheet</h3>
{mcq([('A7','Which of the following is a type of linking?',['Internal linking','External linking','Both (a) and (b)'],2),('A9','Which of the following is used to change the colour of a link?',['Alink','Vlink','All of these'],2)])}
{blanks([('B8','The {target} attribute is used to specify a target.'),('B9','{Absolute URL} includes a complete description of the file.')])}
{tf([('C7','Internal linking is used to link a page to another page.','T','In the exam write <b>T</b>. Many books say internal links go to another page of the same website, or another part of the same page.'),('C8','An absolute URL refers to the complete path of a file.','T')])}
{box('tip','💡 Memory trick','<b>A</b>bsolute = <b>A</b>ll of the address. <b>a</b>link = <b>a</b>ctive, <b>v</b>link = <b>v</b>isited. When a question says "All of these" or "Both", check that every option is true!')}
{box('warn','⚠️ Watch out','<b>target</b> belongs to a <b>link</b>, not to a picture. Internal = links inside your own website; external = links to a <b>different</b> website.')}
{tryq(['Which attribute sets the colour of visited links?','Is <b>news.html</b> an absolute URL or a relative URL?','Name the two types of linking.'])}''')

# ---------------- c05
lesson(5,2,'🎨','What is CSS?',
 '<b>CSS</b> stands for <b>Cascading Style Sheets</b>. HTML builds the page; CSS <b>styles</b> it: colours, fonts, sizes and positions. CSS does <b>not</b> create pages. A CSS file is saved with a <b>.css</b> extension, and one file can style a whole website, so large websites are easy to format.',
 ['CSS','Cascading Style Sheets','style','selector','property','value','.css'],
 f'''<div class="fig"><div class="rule"><span class="r-sel">h1</span> <span class="r-pun">{{</span> <span class="r-prop">color</span><span class="r-pun">:</span> <span class="r-val">blue</span><span class="r-pun">;</span> <span class="r-pun">}}</span></div>
<div class="rulelab"><span class="l-sel">selector<br><small>which elements</small></span><span class="l-prop">property<br><small>what to change</small></span><span class="l-val">value<br><small>change it to what</small></span></div><div class="cap">A CSS rule has three parts: <b>selector</b>, <b>property</b> and <b>value</b>. "Make every h1 heading blue."</div></div>
<div class="two"><div class="fig"><div class="hc"><div><div class="hcl">🏠</div><b>HTML</b><br>builds the page</div><div class="plus">+</div><div><div class="hcl">🎨</div><b>CSS</b><br>styles the page</div></div></div>
<div class="fig"><div class="hc"><div><div class="hcl">📄</div><b>style.css</b></div><div class="plus">→</div><div><div class="hcl">📄📄📄</div>every page of the website</div></div><div class="cap">Change one file, restyle the whole website</div></div></div>
<h3>From your worksheet</h3>
{mcq([('A2','Which of the following is a full form of CSS?',['Cascading Style Sheets','Common Style Sheet','Common Selector Sheet'],0)])}
{blanks([('B4','A CSS rule is made up of three parts, a selector, property and {value}.'),('B5','CSS files are saved with a {.CSS} extension.')])}
{tf([('C1','CSS is used to create web pages.','F','HTML creates web pages; CSS <b>styles</b> them.'),('C3','It is easy to format large websites using CSS.','T'),('C4','CSS selectors are used to manipulate the HTML elements in a web page.','T','The selector picks (selects) which HTML elements get the style.')])}
<h3>Written questions (learn these answers)</h3>
{written(['q8'])}
{box('tip','💡 Memory trick','<b>S-P-V</b>: "<b>S</b>elect, <b>P</b>ick, <b>V</b>alue": the <b>S</b>elector chooses who, the <b>P</b>roperty says what, the <b>V</b>alue says how.')}
{box('warn','⚠️ Watch out','CSS <b>styles</b> pages but does <b>not create</b> them (C1 is False). The full form is <b>Cascading</b> Style <b>Sheets</b>, with an s.')}
{tryq(['In '+code('p { color: red; }')+' name the selector, the property and the value.','What extension does a CSS file have?','True or false: CSS is used to create web pages.'])}''')

# ---------------- c06
lesson(6,2,'📑','Three kinds of style sheet',
 'There are three types of CSS: <b>inline</b> (a <b>style attribute</b> inside one tag, for a single element), <b>internal</b> (a '+code('&lt;STYLE&gt;')+' block in the <b>head section</b>, for one page) and <b>external</b> (a separate <b>.css</b> file, for many pages). Properties like <b>font-family</b>, <b>text-indent</b> and <b>background-position</b> do the styling.',
 ['inline','internal','external','style attribute','head section','font-family','text-indent','background-position'],
 f'''<div class="three"><div class="ss"><h4>1 · Inline</h4><div class="cbox small">{T('&lt;P')} {A('style')}={V('"color:red"')}{T('&gt;')}Hi{T('&lt;/P&gt;')}</div><p>In <b>one tag</b>: styles a <b>single element</b> with the <b>style attribute</b>.</p></div>
<div class="ss"><h4>2 · Internal</h4><div class="cbox small">{T('&lt;HEAD&gt;')}<br>&nbsp;{T('&lt;STYLE&gt;')}<br>&nbsp;&nbsp;<span class="t-sel">p</span> {{<span class="t-prop">color</span>:<span class="t-val">red</span>}}<br>&nbsp;{T('&lt;/STYLE&gt;')}<br>{T('&lt;/HEAD&gt;')}</div><p>In the <b>head section</b>: styles <b>one page</b>.</p></div>
<div class="ss"><h4>3 · External</h4><div class="cbox small">📄 <b>style.css</b><br><span class="t-sel">p</span> {{<span class="t-prop">color</span>:<span class="t-val">red</span>}}</div><p>In a <b>separate .css file</b>: styles <b>many pages</b>.</p></div></div>
<table class="mini"><tr><th>Property</th><th>What it does</th><th>Example</th></tr>
<tr><td><b>font-family</b></td><td>sets the font of the text</td><td>{code('font-family: Arial;')}</td></tr>
<tr><td><b>text-indent</b></td><td>indents the first line of text</td><td>{code('text-indent: 30px;')}</td></tr>
<tr><td><b>background-image</b></td><td>puts a picture behind the page</td><td>{code('background-image: url("sky.jpg");')}</td></tr>
<tr><td><b>background-position</b></td><td>sets the position of that image</td><td>{code('background-position: center;')}</td></tr></table>
<h3>From your worksheet</h3>
{mcq([('A3','Which of the following is not a type of style sheet?',['External','Internal','Inside'],2),('A4','___ is used to set the font of a text.',['Font family','Font name','Font style'],0),('A5','Which of the following is used to specify the position of an image on the web page?',['Background-image','Background','Background-position'],2)])}
{blanks([('B2','The {text-indent} property is used to set the indentation of the first line of text.')])}
{tf([('C5','The internal style sheet style is defined in the head section of a web page.','T')])}
<h3>Written questions (learn these answers)</h3>
{written(['q9','q10'])}
{box('warn','⚠️ Watch out','"<b>Inside</b>" sounds right but is <b>not</b> a type: the three are <b>In</b>line, <b>In</b>ternal, <b>Ex</b>ternal. The font is set by <b>font-family</b> (not "font name"). <b>background-image</b> chooses the picture; <b>background-position</b> places it.')}
{tryq(['Which type of style sheet uses the <b>style attribute</b>?','Which property sets the indentation of the first line of text?','Where is an internal style sheet written?'])}''')

# ---------------- c07
lesson(7,3,'🤖','Programs and programming languages',
 'A <b>program</b> is a sequence of instructions that tells the computer how to do a particular task. Programs are written in <b>programming languages</b>, and writing them is called <b>programming</b>. There are three main types of language: <b>machine</b>, <b>assembly</b> and <b>high level</b>. A computer only understands machine language, so a <b>translator</b> (a <b>compiler</b> or an <b>interpreter</b>) converts high level code into machine code.',
 ['program','programming','programming language','machine language','assembly language','high level language','translator','compiler','interpreter'],
 f'''<div class="two"><div class="fig"><div class="ladder"><div class="rung r3"><b>3 · High level</b> {code('print("Hi")')}<small>almost English: easy for people</small></div><div class="rung r2"><b>2 · Assembly level</b> {code('MOV A, 5')}<small>short code words</small></div><div class="rung r1"><b>1 · Machine level</b> {code('10110000 0101')}<small>only 0s and 1s: what the computer understands</small></div></div><div class="cap">The three types of programming language</div></div>
<div class="fig"><div class="trans"><div class="tb">{code('print("Hi")')}<small>high level code</small></div><div class="ta">➜ 🗣️ translator ➜<small>compiler or interpreter</small></div><div class="tb">{code('0101 1100')}<small>machine code</small></div></div>
<table class="mini" style="margin-top:8px"><tr><th>Compiler</th><th>Interpreter</th></tr><tr><td>translates the <b>whole</b> program in one go</td><td>translates and runs it <b>one line at a time</b> (Python uses one)</td></tr></table></div></div>
<p class="small">This lesson has no tick, blank or true/false questions on the worksheet: just the three written answers below.</p>
<h3>Written questions (learn these answers)</h3>
{written(['q11','q12','q13'])}
{box('warn','⚠️ Watch out','A computer understands <b>only machine language</b>, never high level code directly. Spell it <b>Assembly</b> (not "assemble") and say "<b>level</b> language" for all three types.')}
{tryq(['Which type of language uses only 0s and 1s?','Name the two kinds of language translator.','What is the process of creating a program called?'])}''')

# ---------------- c08
lesson(8,3,'🐍','Meet Python: interactive and script mode',
 '<b>Python</b> is a high level programming language with <b>simple syntax</b>, so it is easy to read and write. It was developed in <b>1991</b> in the <b>Netherlands</b>. You can use it in two ways: <b>interactive mode</b> (type a line, press Enter, see the answer at once) or <b>script mode</b> (write a long program in the editor and save it as a <b>.py</b> file). <b>IDLE</b> is the program that comes with Python.',
 ['Python','syntax','Object Oriented','reusable code','interactive mode','script mode','.py','IDLE'],
 f'''<div class="two"><div class="fig"><div class="win"><div class="wbar">🐍 IDLE Shell (interactive mode)</div><div class="wcode light"><span class="pr">&gt;&gt;&gt;</span> <span class="t-fn">print</span>(<span class="t-str">"Hello"</span>)<br><span class="t-out">Hello</span><br><span class="pr">&gt;&gt;&gt;</span> 5 + 3<br><span class="t-out">8</span></div></div><div class="cap">Type, press <b>Enter</b>, get the output straight away</div></div>
<div class="fig"><div class="win"><div class="wbar">📄 game.py (script mode)</div><div class="wcode light"><span class="t-com"># my program</span><br>name = <span class="t-str">"Sara"</span><br><span class="t-fn">print</span>(<span class="t-str">"Hi"</span>, name)<br><span class="t-fn">print</span>(<span class="t-str">"Let's play!"</span>)</div></div><div class="cap">Write many lines, <b>save</b> as .py, then <b>Run</b></div></div></div>
<table class="mini"><tr><th></th><th>💬 Interactive mode</th><th>🎬 Script mode</th></tr>
<tr><td><b>Where</b></td><td>the Python shell (the &gt;&gt;&gt; prompt)</td><td>the Python editor (IDLE)</td></tr>
<tr><td><b>Output</b></td><td>straight after you press Enter</td><td>when you run the program</td></tr>
<tr><td><b>Best for</b></td><td>very short lines of code</td><td>long programs with multiple lines</td></tr>
<tr><td><b>Save?</b></td><td>no</td><td>yes, as a <b>.py</b> file you can edit</td></tr></table>
<h3>Written questions (learn these answers)</h3>
{written(['q14','q15','q16','q17','q18','q19'])}
{box('warn','⚠️ Watch out','Python is <b>1991</b>, HTML is <b>1990</b>: don\'t swap them. Python files end in <b>.py</b> (not .python), CSS files in <b>.css</b>. IDLE is <b>I</b>ntegrated <b>D</b>evelopment and <b>L</b>earning <b>E</b>nvironment.')}
{tryq(['You want to write a 50-line game and keep it. Which mode should you use?','What does IDLE stand for?','Give one reason Python is easy to read and write.'])}''')

# ---------------- c09
lesson(9,4,'🖌️','GIMP painting tools',
 '<b>GIMP</b> is a free program for drawing, painting and changing pictures. It has a large variety of <b>painting tools</b>, each with its own job: fill an area, mix two colours, paint soft strokes, draw sharp lines, or rub colour out.',
 ['GIMP','painting tools','bucket fill','gradient','paintbrush','pencil','airbrush','ink','eraser'],
 f'''<table class="tools"><tr><th style="width:44px"></th><th style="width:150px">Painting tool</th><th>Its job</th></tr>
<tr><td class="ic">🪣</td><td><b>Bucket fill</b></td><td>fills colour in an area</td></tr>
<tr><td class="ic"><span class="grad"></span></td><td><b>Gradient</b></td><td>fills a <b>mix of two colours</b> in an area (it does not darken)</td></tr>
<tr><td class="ic">🖌️</td><td><b>Paintbrush</b></td><td>paints with <b>fuzzy</b> (soft-edged) brush strokes; good for freehand drawing</td></tr>
<tr><td class="ic">✏️</td><td><b>Pencil</b></td><td>draws freehand lines with <b>hard edges</b></td></tr>
<tr><td class="ic">💨</td><td><b>Airbrush</b></td><td>sprays soft colour, like a spray can</td></tr>
<tr><td class="ic">🖋️</td><td><b>Ink</b></td><td>draws like a <b>calligraphic ink pen</b></td></tr>
<tr><td class="ic">🧽</td><td><b>Eraser</b></td><td><b>removes areas of colour</b> from an image or a selected part</td></tr></table>
<div class="fig"><div class="edges"><div><span class="soft"></span><small>Paintbrush: fuzzy edge</small></div><div><span class="hard"></span><small>Pencil: hard edge</small></div><div><span class="gr"></span><small>Gradient: two colours mixed</small></div></div></div>
<h3>From your worksheet</h3>
{mcq([('A10','Which of the following is not a Painting Tool?',['Bucket fill','Airbrush','Shear'],2),('A12','Which of the following is similar to a calligraphic ink pen?',['Smudge','Airbrush','Ink tool'],2)])}
{blanks([('B11','The {Gradient} tool fills a mix of two colours in an area.'),('B12','The {Eraser} tool is used to remove areas of colour from an image.')])}
{tf([('C10','The Paintbrush tool is used to do freehand drawings.','T'),('C11','The Gradient tool is used to darken the image.','F','Gradient mixes two colours. The tool that darkens is <b>Burn</b> (Lesson 10).')])}
<h3>Written questions (learn these answers)</h3>
{written(['q20','q21','q22','q23','q24'])}
{box('warn','⚠️ Watch out','<b>Shear</b> is a <b>transform</b> tool (it slants a picture), not a painting tool. <b>Gradient</b> mixes colours; it does <b>not</b> darken. Paintbrush = <b>fuzzy</b>, pencil = <b>hard</b> edges.')}
{tryq(['Which tool is similar to a calligraphic ink pen?','Which tool fills a mix of two colours in an area?','You want a line with hard edges. Pencil or paintbrush?'])}''')

# ---------------- c10
lesson(10,4,'🪄','GIMP fixing and effects tools',
 'GIMP also has tools to <b>fix</b> and <b>change</b> photos. <b>Clone</b> copies one part of a picture onto another part; <b>Heal</b> removes defects like spots and scratches; <b>Dodge</b> lightens and <b>Burn</b> darkens; <b>Smudge</b> smears colour. <b>Fuzzy Select</b> selects areas of a similar colour, and <b>Filters</b> add special effects.',
 ['clone','heal','dodge','burn','smudge','fuzzy select','filters','special effects'],
 f'''<table class="tools"><tr><th style="width:44px"></th><th style="width:150px">Tool</th><th>Its job</th></tr>
<tr><td class="ic">🐑</td><td><b>Clone</b></td><td><b>copies</b> the selected part of an image and pastes it in another part</td></tr>
<tr><td class="ic">🩹</td><td><b>Heal</b></td><td>removes <b>defects</b> in images (spots, scratches)</td></tr>
<tr><td class="ic">☀️</td><td><b>Dodge</b></td><td><b>lightens</b> part of the image</td></tr>
<tr><td class="ic">🔥</td><td><b>Burn</b></td><td><b>darkens</b> part of the image</td></tr>
<tr><td class="ic">👆</td><td><b>Smudge</b></td><td>smears colours together, like a finger in wet paint</td></tr>
<tr><td class="ic">🪄</td><td><b>Fuzzy Select</b></td><td><b>selects</b> touching (contiguous) areas of a similar colour, like a magic wand</td></tr>
<tr><td class="ic">✨</td><td><b>Filters</b></td><td>apply <b>special effects</b> to an image (blur, distort, artistic…)</td></tr></table>
<div class="fig"><div class="edges"><div><span class="db d1"></span><small>Dodge ☀️ lightens</small></div><div><span class="db d0"></span><small>original</small></div><div><span class="db d2"></span><small>Burn 🔥 darkens</small></div></div></div>
<h3>From your worksheet</h3>
{mcq([('A11','Which of the following is used to copy a part of an image?',['Clone','Dodge','Both (a) and (b)'],0),('A13','Which of the following is used to apply special effects to an image?',['Filters','Heal','Burn'],0)])}
{blanks([('B10','The {Fuzzy Select} tool allows the selection of contiguous areas of a similar colour range.'),('B13','The {Heal} tool is used to remove defects in images.')])}
{tf([('C12','The Dodge tool is used to lighten the image.','T'),('C13','Filters are used to select objects in GIMP.','F','Filters add special effects. Selecting is done by selection tools like <b>Fuzzy Select</b>.')])}
<h3>Written questions (learn these answers)</h3>
{written(['q25'])}
{box('tip','💡 Memory trick','<b>D</b>odge = <b>D</b>aylight ☀️ (lighter); <b>B</b>urn = <b>B</b>lack toast 🍞 (darker). <b>Heal</b> heals a scratch like a plaster 🩹. <b>F</b>ilters = <b>F</b>un effects ✨.')}
{box('warn','⚠️ Watch out','Only <b>Clone</b> copies (A11 is not "Both": Dodge just lightens). <b>Filters do not select</b> (C13 is False). Contiguous means "touching": Fuzzy Select picks touching areas of a similar colour.')}
{tryq(['Which tool removes defects such as spots and scratches?','Which tool darkens part of an image?','Which tool selects contiguous areas of a similar colour?'])}''')

# ---------------- cheat sheet
cheat=f'''<section class="les cheat"><div class="banner" style="background:linear-gradient(120deg,#0b4f5e,#0e7490 50%,#22b8c9)"><div class="e">⚡</div><div><div class="pt">Read this the night before</div><h2>Cheat sheet</h2></div></div>
<div class="cg">
<div class="cc p1"><h4>🌐 HTML</h4>Hypertext Markup Language · <b>Tim Berners-Lee, 1990</b> · <b>W3C</b> sets web standards · text file, not case sensitive, many tags · HTML editors: Dreamweaver, UltraEdit, TextMate · text editors: Notepad, Notepad++ · view: double-click, or Edge + <b>Ctrl + O</b></div>
<div class="cc p1"><h4>🏷️ Tags</h4>inside <b>angular brackets</b> &lt; &gt; · opening {code('&lt;HTML&gt;')}, closing {code('&lt;/HTML&gt;')} · both = <b>container tags</b> · order: HTML › HEAD › /HEAD › BODY › /BODY › /HTML</div>
<div class="cc p1"><h4>🖼️ Pictures</h4>{code('&lt;IMG&gt;')} adds a picture · attributes: src, <b>alt</b> (alternate text), height, width · formats: .jpg .gif <b>.png</b> .bmp · <b>.xlsx is not</b> a picture · <b>target is not</b> an IMG attribute</div>
<div class="cc p1"><h4>🔗 Links</h4>types: <b>internal</b> and <b>external</b> (both) · <b>target</b> = where a link opens · <b>absolute URL</b> = complete path · colours: link, <b>alink</b> (active), <b>vlink</b> (visited) · C7: write <b>T</b></div>
<div class="cc p2"><h4>🎨 CSS</h4><b>Cascading Style Sheets</b> · styles pages, does <b>not create</b> them · easy to format large websites · rule = <b>selector</b>, <b>property</b>, <b>value</b> · saved as <b>.css</b> · selectors pick HTML elements</div>
<div class="cc p2"><h4>📑 Style sheets</h4><b>inline</b> (style attribute, one element) · <b>internal</b> (in the head section) · <b>external</b> (separate .css file) · NOT "inside" · <b>font-family</b> = font · <b>text-indent</b> = first line · <b>background-position</b> = image position</div>
<div class="cc p3"><h4>🤖 Programs</h4>program = sequence of instructions for a task · programming = creating programs · types: <b>machine</b>, <b>assembly</b>, <b>high</b> level · translator: <b>compiler</b> or <b>interpreter</b> → machine code · computer understands only machine language</div>
<div class="cc p3"><h4>🐍 Python</h4>high level, simple syntax · <b>1991</b>, Netherlands · easy to learn, less code · Object Oriented → reusable code · <b>interactive</b>: Enter → output now, short code · <b>script</b>: long code, editor, <b>.py</b>, save and edit · <b>IDLE</b> = Integrated Development and Learning Environment</div>
<div class="cc p4"><h4>🖌️ Painting tools</h4>🪣 bucket fill · 🌈 <b>gradient</b> = mix of two colours (not darken) · 🖌️ paintbrush = fuzzy, freehand · ✏️ pencil = hard edges · 💨 airbrush · 🖋️ <b>ink</b> = calligraphic pen · 🧽 <b>eraser</b> removes colour · <b>Shear is not</b> a painting tool</div>
<div class="cc p4"><h4>🪄 Fixing tools</h4>🐑 <b>clone</b> copies a part · 🩹 <b>heal</b> removes defects · ☀️ <b>dodge lightens</b> · 🔥 burn darkens · 🪄 <b>fuzzy select</b> = similar colour areas · ✨ <b>filters</b> = special effects (they don't select)</div>
</div>
<h3 class="ch">🔑 Keyword → answer: the 25 written questions</h3><table class="kt">{{KT}}</table></section>'''

GIST=['Hypertext Markup Language · 1990 · Tim Berners-Lee','create web pages on the World Wide Web · hyperlinks','simple text files · not case sensitive · many tags','HTML editors: Dreamweaver, UltraEdit, TextMate · text editors: Notepad, Notepad++','double-click · or Edge + Ctrl + O',
'elements, structure · &lt; less than, &gt; greater than = angular brackets','&lt;HTML&gt; opening, &lt;/HTML&gt; closing · both = container tags','Cascading Style Sheets · styles HTML pages','inline · internal · external','single HTML element · style attribute',
'sequence of instructions · particular task · programming languages','machine · assembly · high level','compiler or interpreter · high level → machine code','high level · simple syntax · 1991 · Netherlands','easy to learn and use · complex tasks with less code',
'reusable code · applications with less code','press Enter → output at once · short lines','long code · Python editor · .py · save and edit','Integrated Development and Learning Environment · script mode','large variety of painting tools · draw, paint, modify',
'bucket fill · gradient · paintbrush · pencil · eraser','paint with fuzzy brush strokes · selected brush','free-hand lines, hard edges · not fuzzy','very important · removes areas of colour','copies selected parts · pastes them elsewhere']
def kwof(q): return ' + '.join(re.findall(r'\[([^\]]*)\]',q))
rows=[f'<td class="kq">{Q[f"q{n}"]["s"]}</td><td class="kk"><span class="kw">{html.escape(kwof(Q[f"q{n}"]["q"]))}</span></td><td>{GIST[n-1]}</td>' for n in range(1,26)]
KT=''.join(f'<tr>{r}</tr>' for r in rows)
cheat=cheat.replace('{KT}',KT)
# ---------------- appendix
app='<section class="les app"><div class="banner" style="background:linear-gradient(120deg,#0b4f5e,#0e7490 50%,#22b8c9)"><div class="e">🧠</div><div><div class="pt">Learn, cover, write, check</div><h2>All 25 model answers</h2></div></div><p class="small">The <span class="kw">keyword</span> tells you which answer to write. The <b class="kp">key phrases</b> score the marks. Cover the answer, write it on paper, then check.</p><div class="all">'
for n in range(1,26):
    c=Q[f'q{n}']
    app+=f'<div class="aq"><div class="wqh"><span class="qn">{c["s"]}</span><span class="wqq">{qh(c["q"])}</span></div><div class="wqa">{ah(c["a"])}</div></div>'
app+='</div></section>'

# ---------------- try these answer key
KEY=[('1 · What is HTML?',['Tim Berners-Lee, in 1990.','Notepad and Notepad++ (WordPad also works).','<b>Ctrl + O</b> (Control and O).']),
('2 · Tags and page structure',[code('&lt;/HEAD&gt;'),code('&lt;/HTML&gt;'),'Container tags.']),
('3 · Pictures',['The <b>alt</b> attribute.','.gif is a picture format; .xlsx is not (it is an Excel spreadsheet).',code('&lt;IMG src="sun.jpg"&gt;')+' (you can add alt, height and width too).']),
('4 · Links',['<b>vlink</b>.','Relative (it is not the complete path).','Internal linking and external linking.']),
('5 · What is CSS?',['Selector <b>p</b>, property <b>color</b>, value <b>red</b>.','<b>.css</b>','False: CSS styles web pages; HTML creates them.']),
('6 · Style sheets',['Inline.','<b>text-indent</b>.','In the head section of the web page.']),
('7 · Programs and languages',['Machine level language.','Compiler and interpreter.','Programming.']),
('8 · Python',['Script mode (saved as a .py file).','Integrated Development and Learning Environment.','It has simple syntax.']),
('9 · Painting tools',['The ink tool.','The gradient tool.','Pencil.']),
('10 · Fixing tools',['The heal tool.','The burn tool.','The fuzzy select tool.'])]
key='<section class="les keysec" style="break-before:auto;margin-top:18px"><h2 class="kh">✏️ Answer key: Try these</h2><div class="keygrid">'+''.join(f'<div class="k"><h3>Lesson {t}</h3><ol>'+''.join(f'<li>{x}</li>' for x in xs)+'</ol></div>' for t,xs in KEY)+'</div></section>'

CHIP='''<svg viewBox="0 0 80 80" width="150" height="150"><ellipse cx="40" cy="77" rx="20" ry="3" fill="#1f2433" opacity=".12"/><path d="M40 15 C40 5 54 3 57 9 C60 15 69 12 71 4" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/><rect x="15" y="14" width="50" height="61" rx="25" fill="#22b8c9" stroke="#fff" stroke-width="2.5"/><path d="M16 37 H64 M40 15 V37" stroke="#0e7490" stroke-width="2"/><rect x="37" y="20" width="6" height="12" rx="3" fill="#ffd84d" stroke="#e0a800" stroke-width="1.2"/><circle cx="31" cy="49" r="6.2" fill="#fff"/><circle cx="49" cy="49" r="6.2" fill="#fff"/><circle cx="32" cy="50" r="3.6" fill="#1f2433"/><circle cx="50" cy="50" r="3.6" fill="#1f2433"/><circle cx="33.3" cy="48.6" r="1.3" fill="#fff"/><circle cx="51.3" cy="48.6" r="1.3" fill="#fff"/><circle cx="23.5" cy="59" r="3.2" fill="#ff9f9f" opacity=".75"/><circle cx="56.5" cy="59" r="3.2" fill="#ff9f9f" opacity=".75"/><path d="M34 61 Q40 67 46 61" stroke="#1f2433" stroke-width="2.6" fill="none" stroke-linecap="round"/></svg>'''

cover=f'''<section class="cover"><div class="top"><div><div class="k">Grade 7 · Computer Science · Second Term</div><h1>The Computer<br>Study Guide 💻</h1>
<p>Every question on your worksheet with its answer, the 25 written answers to learn, memory tricks and a cheat sheet. With Chip the Mouse 🖱️.</p></div>{CHIP}</div>
<div class="parts"><div class="pc" style="background:linear-gradient(140deg,#0e7490,#22b8c9)"><small>Part 1 · Lessons 1–4</small><b>Web pages with HTML</b></div><div class="pc" style="background:linear-gradient(140deg,#6a45d8,#9b7cf0)"><small>Part 2 · Lessons 5–6</small><b>Styling with CSS</b></div><div class="pc" style="background:linear-gradient(140deg,#e06a1b,#f5a54a)"><small>Part 3 · Lessons 7–8</small><b>Programming and Python</b></div><div class="pc" style="background:linear-gradient(140deg,#17935b,#4cc28a)"><small>Part 4 · Lessons 9–10</small><b>Drawing in GIMP</b></div></div>
<div class="how"><h3>🧭 How to use this guide</h3><p>There is one section for each of the 10 Computer lessons. Each one has <b>the big idea</b>, the <b>key words</b>, a picture, <b>every worksheet question</b> of that lesson with its answer, the <b>written answers</b> to learn, a <b>memory trick</b>, a <b>Watch out</b> box and <b>Try these</b> questions (answers at the back). At the end: a one-page <b>cheat sheet</b> and <b>all 25 model answers</b> together.</p>
<div class="legend"><div class="box tip"><span class="lab">💡 Memory trick</span>An easy way to remember.</div><div class="box warn"><span class="lab">⚠️ Watch out</span>A mix-up that loses marks.</div><div class="try" style="margin:9px 0"><span class="lab">✏️ Try these</span>Practise, then check.</div></div></div>
<div class="how"><h3>📝 Exam tips</h3><ul>
<li><b>Learn the 25 written answers</b> (Q1–Q25) word for word: they are the biggest part of the exam. Use the Answer Trainer: ten a day.</li>
<li><b>Look for the keyword</b> in each question (in <span class="kw">yellow</span> in this guide). It tells you which answer to write: "<span class="kw">HTML tags</span>" is not the same answer as "<span class="kw">HTML</span>", and "<span class="kw">script mode</span>" is not "<span class="kw">Interactive Mode</span>".</li>
<li>Write the <b class="kp">key phrases</b> (in green): they are what the teacher looks for. Numbered answers (Q3, Q9, Q12, Q21) need every item.</li>
<li><b>Tick the correct option:</b> read all three options first. "Not" questions (A3, A6, A8, A10) want the odd one out.</li>
<li><b>True or false:</b> one wrong word makes a sentence false: "CSS <i>creates</i> web pages" (F), "Gradient <i>darkens</i>" (F), "Filters <i>select</i>" (F).</li></ul></div></section>'''

CSS=r'''@page{size:A4;margin:12mm 13mm 14mm 13mm;@bottom-center{content:counter(page);font:600 9pt "Avenir Next",sans-serif;color:#8a90a2}}
@page :first{@bottom-center{content:none}}
*{box-sizing:border-box}html{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font-family:"Avenir Next","Helvetica Neue",Arial,sans-serif;color:#1f2433;font-size:10pt;line-height:1.38;margin:0}
h1,h2,h3,h4{margin:0;line-height:1.15}
h3{font-size:12pt;margin:10px 0 4px;break-after:avoid}
p{margin:4px 0}
.small{font-size:9pt;color:#5b6275}
.cd{font-family:"SF Mono",Menlo,Consolas,"DejaVu Sans Mono",monospace;font-weight:700;font-size:.88em;background:#1e2433;color:#e8ecf5;border-radius:5px;padding:0 5px;white-space:nowrap}
.t-tag{color:#7cc4ff}.t-att{color:#ffd27a}.t-str{color:#9be38f}.t-sel{color:#ff9f6b}.t-prop{color:#7cc4ff}.t-val{color:#9be38f}.t-fn{color:#900090}.t-out{color:#0000dd}.t-com{color:#dd0000}
.cd .t-tag,.cbox .t-tag{color:#7cc4ff}
.kw{background:#ffe680;border-radius:4px;padding:0 3px;box-shadow:0 0 0 1.5px #ffd84d}
b.kp{color:#0b6b3a;background:#dcf5e8;border-radius:4px;padding:0 2px}
/* cover */
.cover .top{background:linear-gradient(135deg,#0b4f5e,#0e7490 45%,#22b8c9);color:#fff;border-radius:22px;padding:24px 26px;display:flex;align-items:center;gap:16px}
.cover .top>div{flex:1}
.cover h1{font-size:32pt;font-weight:800;margin:6px 0}.cover .k{font-size:10.5pt;letter-spacing:.14em;text-transform:uppercase;opacity:.88;font-weight:700}
.cover .top p{font-size:12.5pt;margin:0}
.parts{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:10px}
.pc{border-radius:14px;color:#fff;padding:10px 12px;min-height:74px}.pc small{display:block;font-size:8.5pt;opacity:.9;font-weight:700;text-transform:uppercase;letter-spacing:.04em}.pc b{font-size:12pt}
.how{border:2px solid #c4e3e8;border-radius:16px;padding:8px 14px;margin-top:10px;break-inside:avoid}
.how ul{margin:4px 0;padding-left:20px}.how li{margin:3px 0}
.legend{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
/* boxes */
.box{border-radius:12px;padding:7px 12px;margin:8px 0;break-inside:avoid;border-left:6px solid}
.box .lab,.try .lab,.bigidea .lab,.kwl .lab{font-weight:800;font-size:8.8pt;letter-spacing:.06em;text-transform:uppercase;display:block;margin-bottom:2px}
.tip{background:#fff4c2;border-color:#f2c200}.tip .lab{color:#8a6a00}
.warn{background:#fde6e6;border-color:#e04848}.warn .lab{color:#b02525}
.try{border:2px dashed #0e7490;border-radius:12px;padding:6px 12px 4px;margin:8px 0 4px;break-inside:avoid}.try .lab{color:#0e7490}
.try ol{margin:2px 0;padding-left:22px}.try li{margin:2px 0}
/* lesson sections */
.les{break-before:page}
.banner{border-radius:16px;padding:12px 18px;color:#fff;display:flex;align-items:center;gap:14px;margin-bottom:8px}
.banner .e{font-size:30pt}.banner h2{font-size:18pt;font-weight:800}.banner .pt{font-size:9pt;text-transform:uppercase;letter-spacing:.08em;opacity:.9;font-weight:700}
.bigidea{border:2px dashed;border-radius:14px;padding:8px 12px;margin:6px 0;font-size:10.8pt;break-inside:avoid}
.p1 .bigidea{background:#e2f6f8;border-color:#22b8c9}.p1 .bigidea .lab{color:#0e7490}.p1 h3{color:#0b5566}
.p2 .bigidea{background:#efe9ff;border-color:#9b7cf0}.p2 .bigidea .lab{color:#5a35b0}.p2 h3{color:#4a2ea6}
.p3 .bigidea{background:#fdeedf;border-color:#f5a54a}.p3 .bigidea .lab{color:#a84a0c}.p3 h3{color:#a84a0c}
.p4 .bigidea{background:#e4f6ec;border-color:#4cc28a}.p4 .bigidea .lab{color:#0e6b41}.p4 h3{color:#0e6b41}
.kwl{margin:6px 0}.kwl .lab{display:inline;color:#5b6275;margin-right:4px}
.chip{display:inline-block;border:1.5px solid #c9d2e0;border-radius:20px;padding:0 8px;margin:1px 1px;font-size:9pt;font-weight:700;background:#fff}
table{border-collapse:collapse;width:100%;margin:5px 0;font-size:9.6pt}tr{break-inside:avoid}
th,td{border:1px solid #dfe3ec;padding:4px 7px;text-align:left;vertical-align:top}
th{background:#eef2f8;font-weight:800}
.p1 th{background:#e2f6f8}.p2 th{background:#efe9ff}.p3 th{background:#fdeedf}.p4 th{background:#e4f6ec}
td.n{font-weight:800;color:#5b6275;text-align:center}
.mq{font-weight:700;margin-bottom:3px}
.opt{display:inline-block;margin:1px 10px 1px 0;color:#5b6275}
.opt.ok{color:#0b6b3a;font-weight:800;background:#dcf5e8;border-radius:6px;padding:0 6px;box-shadow:0 0 0 1.5px #8fd6b0}
.fill{font-weight:800;color:#0b6b3a;border-bottom:2px solid #18a058;padding:0 3px}
td.tf{text-align:center;font-weight:900;font-size:13pt}td.tf.T{color:#18a058}td.tf.F{color:#e04848}
.why{font-size:8.8pt;color:#5b6275;margin-top:1px}
/* written questions */
.wq{border:1.5px solid #dfe3ec;border-radius:12px;padding:6px 11px;margin:6px 0;break-inside:avoid}
.wqh{display:flex;gap:8px;align-items:baseline}
.qn{flex:none;font-weight:800;font-size:9.5pt;color:#fff;background:#0e7490;border-radius:7px;padding:0 7px}
.p2 .qn{background:#6a45d8}.p3 .qn{background:#e06a1b}.p4 .qn{background:#17935b}
.wqq{font-weight:800;font-size:10.8pt}
.wqa{margin:3px 0 0 4px;padding-left:10px;border-left:3px solid #c4e3e8}
.wqa p{margin:1px 0}.wqa ol{margin:1px 0;padding-left:20px}
.wqt{font-size:9pt;color:#6b5400;margin-top:3px}
/* diagrams */
.fig{margin:6px 0;break-inside:avoid;text-align:center}
.fig .cap{font-size:8.8pt;color:#5b6275;margin-top:3px}
.two{display:grid;grid-template-columns:1fr 1fr;gap:12px;align-items:start}
.three{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;align-items:stretch;margin:6px 0}
.win{border:1.5px solid #9aa7bd;border-radius:9px;overflow:hidden;text-align:left;background:#fff}
.wbar{background:linear-gradient(#f4f6fa,#e3e8f0);border-bottom:1px solid #c5cdda;font-size:8.8pt;font-weight:800;color:#3a4256;padding:3px 9px}
.wcode{background:#1e2433;color:#e8ecf5;font-family:"SF Mono",Menlo,Consolas,"DejaVu Sans Mono",monospace;font-size:9.5pt;padding:7px 10px;line-height:1.45;min-height:84px}
.wcode.light{background:#fff;color:#1f2433}.pr{color:#8a5a00}
.wpage{font-family:"Times New Roman",Georgia,serif;font-size:15pt;padding:10px 12px;min-height:84px}
.nest .n1{border:2px solid #0e7490;border-radius:10px;padding:6px 8px;text-align:left;background:#f2fbfc}
.nest .n2{border:2px dashed #22b8c9;border-radius:8px;padding:5px 7px;margin:5px 0 5px 14px;font-size:9pt;background:#fff}
.nest .n2.b{border-color:#18a058}
.tagpic{display:flex;justify-content:space-around;gap:6px;background:#1e2433;color:#e8ecf5;border-radius:10px;padding:10px 6px;font-family:"SF Mono",Menlo,Consolas,"DejaVu Sans Mono",monospace}
.tagpic .big{font-size:22pt;font-weight:800}.tagpic .lb{font-family:"Avenir Next",Arial,sans-serif;font-size:8.5pt;color:#c9d2e0;margin-top:2px}
.cbox{background:#1e2433;color:#e8ecf5;border-radius:10px;padding:8px 12px;font-family:"SF Mono",Menlo,Consolas,"DejaVu Sans Mono",monospace;font-size:12pt;font-weight:700;text-align:left}
.cbox.small{font-size:9.2pt;font-weight:600}
.lbw{font-family:"Avenir Next",Arial,sans-serif;font-size:8.5pt;color:#c9d2e0;margin-top:3px}
.arrows{display:flex;justify-content:space-around;font-size:8.5pt;color:#5b6275;font-weight:700;margin-top:2px}.arrows span:before{content:"▲ ";color:#22b8c9}
.broken{border:2px dashed #e04848;border-radius:10px;padding:14px;font-size:13pt;background:#fff;color:#5b6275}
.url{display:flex;justify-content:center;font-family:"SF Mono",Menlo,Consolas,"DejaVu Sans Mono",monospace;font-size:14pt;font-weight:700}
.url span{padding:5px 8px}.u1{background:#e2f6f8}.u2{background:#fff4c2}.u3{background:#efe9ff}.u4{background:#dcf5e8}
.rule{font-family:"SF Mono",Menlo,Consolas,"DejaVu Sans Mono",monospace;font-size:22pt;font-weight:800;background:#1e2433;border-radius:12px;padding:8px 14px;display:inline-block}
.r-sel{color:#ff9f6b}.r-prop{color:#7cc4ff}.r-val{color:#9be38f}.r-pun{color:#c9b6f4}
.rulelab{display:flex;justify-content:center;gap:30px;margin-top:4px;font-weight:800;font-size:10pt}.rulelab small{font-weight:600;color:#5b6275}
.l-sel{color:#c2410c}.l-prop{color:#1d4ed8}.l-val{color:#15803d}
.hc{display:flex;align-items:center;justify-content:center;gap:10px;border:1.5px solid #dfe3ec;border-radius:12px;padding:6px;font-size:9.5pt}.hcl{font-size:20pt}.plus{font-size:18pt;font-weight:800;color:#6a45d8}
.ss{border:1.5px solid #d6ccf5;border-radius:12px;padding:6px 8px;background:#faf8ff}.ss h4{color:#4a2ea6;font-size:11pt;margin-bottom:4px}.ss p{font-size:9pt;margin:4px 0 0}
.ladder{display:flex;flex-direction:column;gap:4px;text-align:left}
.rung{border-radius:10px;padding:4px 10px;font-size:9.5pt}.rung small{display:block;color:#5b6275;font-size:8.5pt}
.r3{background:#fdeedf;margin-left:0}.r2{background:#fff4e6;margin-left:14px}.r1{background:#f4f0ea;margin-left:28px}
.trans{display:flex;align-items:center;justify-content:center;gap:6px;font-size:9.5pt}.trans small{display:block;color:#5b6275;font-size:8.5pt}
.ta{font-weight:800;color:#a84a0c;text-align:center}.tb{text-align:center}
.tools td.ic{font-size:12pt;text-align:center;vertical-align:middle;padding:1px 4px}.tools td{padding:3px 7px}
.tools td{vertical-align:middle}
.grad,.edges .gr{display:inline-block;width:24px;height:16px;border-radius:4px;background:linear-gradient(90deg,#22b8c9,#ffd84d)}
.edges{display:flex;justify-content:center;gap:28px}.edges div{text-align:center}.edges small{display:block;font-size:8.5pt;color:#5b6275}
.edges span{display:inline-block;width:90px;height:22px;border-radius:12px}
.edges .soft{background:#0e7490;filter:blur(3px)}.edges .hard{background:#0e7490;border-radius:0}.edges .gr{width:90px;height:22px}
.db{background:linear-gradient(90deg,#6aa86b,#3c7d3e)}.d1{filter:brightness(1.6)}.d2{filter:brightness(.45)}
.mini{font-size:9.2pt}
/* flowing lessons and duo boxes */
.les.flow{break-before:auto;margin-top:16px;padding-top:10px;border-top:2px dashed #dfe3ec}
.banner{break-after:avoid}.banner+.bigidea{break-before:avoid}
.duo{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:8px 0;break-inside:avoid}.duo .box{margin:0}
/* cheat sheet */
.ch{color:#0b5566;margin-top:10px}
.kt{font-size:8.4pt;line-height:1.2;margin:3px 0}.kt td{padding:1px 5px;vertical-align:middle;white-space:nowrap}.kt .kq{font-weight:800;color:#0e7490;white-space:nowrap}.kt .kk{white-space:nowrap}.kt .kw{font-weight:700}
.cg{display:grid;grid-template-columns:1fr 1fr;gap:6px}.cheat .banner{padding:8px 16px}.cheat .banner .e{font-size:24pt}.ch{margin-top:6px!important}
.cc{border-radius:12px;padding:5px 10px;font-size:8.7pt;line-height:1.35;border:1.5px solid}
.cc h4{font-size:10.5pt;margin-bottom:2px}
.cc.p1{background:#e2f6f8;border-color:#9fdfe6}.cc.p1 h4{color:#0b5566}
.cc.p2{background:#efe9ff;border-color:#cbbcf5}.cc.p2 h4{color:#4a2ea6}
.cc.p3{background:#fdeedf;border-color:#f3c79c}.cc.p3 h4{color:#a84a0c}
.cc.p4{background:#e4f6ec;border-color:#a6dfc0}.cc.p4 h4{color:#0e6b41}
.cc .cd{white-space:normal;font-size:.85em}
.oneline{columns:2;column-gap:14px;font-size:8.6pt;line-height:1.3}.oneline span{display:block;break-inside:avoid;margin:1px 0}
/* appendix */
.app .qn{background:#0e7490}
.all{columns:2;column-gap:16px}.app .wqq{font-size:9.6pt}.app .wqa{font-size:9pt;line-height:1.3}.app .qn{font-size:8.5pt}
.aq{border-bottom:1px solid #e3e6ef;padding:4px 0 5px;break-inside:avoid}
.aq .wqa{border-left-color:#ffd84d}
/* key */
.kh{font-size:18pt;color:#0b5566;margin-bottom:8px}
.keygrid{columns:2;column-gap:18px;font-size:9.8pt}.keygrid .k{break-inside:avoid;margin:0 0 6px}.keygrid h3{margin:6px 0 2px;font-size:11pt;color:#0b5566}.keygrid ol{margin:0;padding-left:20px}
'''
doc=f'''<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><title>Grade 7 Computer – Exam Study Guide</title>
<!-- Generated by source/computer/make-study-guide.py (edit that, not this file); printed to computer-study-guide.pdf (command in README.md). -->
<style>
{CSS}</style></head><body>
{cover}
{chr(10).join(SECT)}
{cheat}
{app}
{key}
</body></html>'''
open(ROOT+'/source/computer/study-guide-source.html','w').write(doc)
print('ok',len(doc))
