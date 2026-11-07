"""Plays a whole Maths Quest level in headless Chrome at iPhone size and reports every answer.
usage: CHROME=... quizplay.py <level e.g. c2> <screenshot dir>   (run from the repo root)
About every fifth question is answered wrongly (with a listed common mistake when there is one) to test the feedback;
a screenshot is saved for the first question of each type, the mistakes and the results screen."""
import sys, json, time, subprocess, base64, urllib.request, os, tempfile, socket
import websocket
root=os.getcwd(); level=sys.argv[1]; outdir=sys.argv[2]; os.makedirs(outdir,exist_ok=True)
src=open(os.path.join(root,'maths-quiz.html')).read()
src='\n'.join(l for l in src.split('\n') if 'data-account' not in l)
src=src.replace('<head>','<head><script>window.__errs=[];addEventListener("error",e=>__errs.push(e.message));window.AudioContext=undefined;window.webkitAudioContext=undefined;window.confirm=()=>true;</script>',1)
tmp=os.path.join(root,'.mqplay_%d.html'%os.getpid());open(tmp,'w').write(src)
s=socket.socket();s.bind(('',0));port=s.getsockname()[1];s.close()
prof=tempfile.mkdtemp()
p=subprocess.Popen([os.environ.get('CHROME','chromium'),'--headless=new','--disable-gpu','--hide-scrollbars',f'--remote-debugging-port={port}',f'--user-data-dir={prof}','--window-size=390,844','about:blank'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
try:
  for _ in range(60):
    try: tabs=json.loads(urllib.request.urlopen(f'http://127.0.0.1:{port}/json').read());break
    except Exception: time.sleep(.25)
  ws=websocket.create_connection([t for t in tabs if t['type']=='page'][0]['webSocketDebuggerUrl'],timeout=30);mid=[0]
  def cmd(m,**pa):
    mid[0]+=1;ws.send(json.dumps({'id':mid[0],'method':m,'params':pa}))
    while True:
      r=json.loads(ws.recv())
      if r.get('id')==mid[0]:return r.get('result',{})
  def js(e):
    r=cmd('Runtime.evaluate',expression=e,returnByValue=True,awaitPromise=True)
    if 'exceptionDetails' in r: raise RuntimeError(json.dumps(r['exceptionDetails'])[:400])
    return r['result'].get('value')
  def shot(name,full=True):
    if full:
      h=js('document.documentElement.scrollHeight');cmd('Emulation.setDeviceMetricsOverride',width=390,height=max(844,h),deviceScaleFactor=1,mobile=True)
    d=cmd('Page.captureScreenshot',format='png');open(os.path.join(outdir,name+'.png'),'wb').write(base64.b64decode(d['data']))
    cmd('Emulation.setDeviceMetricsOverride',width=390,height=844,deviceScaleFactor=1,mobile=True)
  cmd('Emulation.setDeviceMetricsOverride',width=390,height=844,deviceScaleFactor=1,mobile=True)
  cmd('Page.enable');cmd('Page.navigate',url='file://'+tmp);time.sleep(1.5)
  shot('00-menu')
  js(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'quizdriver.js')).read())
  js(f"start({json.dumps(level)},MODES.find(m=>m.id==={json.dumps(level)}).pick())")
  total=js('S.qs.length');seen=set();log=[]
  for i in range(total):
    q=js('({id:S.qs[S.i].id,type:S.qs[S.i].type,mist:Object.keys(S.qs[S.i].mist||{})[0]||null})');qid=q['id']
    bad=i%5==4
    w=None
    if bad: w=q['mist'] or ('0' if q['type']=='type' else 'swap' if q['type']=='match' else 'wrongdir' if q['type']=='line' else 'wrong')
    js(f"answer({json.dumps(w)});check()");time.sleep(.35)
    res=js("({ok:!!document.querySelector('.fb.ok'),fb:(document.querySelector('.fb')||{}).innerText||''})")
    good=res['ok']!=bad
    log.append((qid,q['type'],'right' if res['ok'] else 'wrong','' if good else 'UNEXPECTED',res['fb'].replace('\n',' ')[:100]))
    if q['type'] not in seen or bad: seen.add(q['type']);shot(f"{i+1:02d}-{qid}{'-wrong' if bad else ''}")
    js("next()");time.sleep(.25)
  time.sleep(1);shot('99-end')
  for l in log:print(*l)
  print('errs',js('window.__errs'),'right',js('S.right'),'of',js('S.qs.length'),'wrong ids',js('S.wrong.map(q=>q.id)'))
finally:
  p.kill();os.remove(tmp)
