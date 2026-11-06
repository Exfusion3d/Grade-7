"""Real-time headless Chrome driver for one lesson scene (used by runall.py).
usage: cdp.py <html file> <scene> <out.png> [wait_seconds] [--fast]
Loads the page (with the fast patch if --fast), waits, prints JSON {errs, ready, scene}, saves screenshot."""
import sys, json, time, subprocess, base64, urllib.request, os, tempfile, socket
import websocket
f, scene, out = sys.argv[1], sys.argv[2], sys.argv[3]
wait = float(sys.argv[4]) if len(sys.argv) > 4 and not sys.argv[4].startswith('--') else 25
fast = '--fast' in sys.argv
here = os.path.dirname(os.path.abspath(__file__))
src = open(f).read()
# lessons run here without an account: drop the login gate and account scripts
src = '\n'.join(l for l in src.split('\n') if 'data-account' not in l)
patch = open(os.path.join(here, 'fastpatch.html')).read()
if not fast:  # keep only error capture + autoplayer, real speed
    patch = patch.split('window.__errs=[]', 1)[1]
    patch = '<script>try{localStorage.setItem("pta_voice","0")}catch(e){};window.AudioContext=undefined;window.webkitAudioContext=undefined;window.speechSynthesis&&(window.speechSynthesis.speak=()=>{});window.__st=setTimeout;window.__errs=[]' + patch
tmp = os.path.join(os.path.dirname(f), '.cdp_%d_' % os.getpid() + os.path.basename(f))
open(tmp, 'w').write(src.replace('<head>', '<head>' + patch, 1))
s = socket.socket(); s.bind(('', 0)); port = s.getsockname()[1]; s.close()
prof = tempfile.mkdtemp()
p = subprocess.Popen(["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "--headless=new", "--disable-gpu", "--hide-scrollbars",
    f"--remote-debugging-port={port}", f"--user-data-dir={prof}", "--window-size=980,760", "--mute-audio", "about:blank"],
    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
try:
    for _ in range(300):
        try:
            tabs = json.load(urllib.request.urlopen(f"http://127.0.0.1:{port}/json")); break
        except Exception: time.sleep(.2)
    ws = websocket.create_connection([t for t in tabs if t['type'] == 'page'][0]['webSocketDebuggerUrl'])
    mid = [0]
    def cmd(m, **pr):
        mid[0] += 1; ws.send(json.dumps({'id': mid[0], 'method': m, 'params': pr}))
        while True:
            r = json.loads(ws.recv())
            if r.get('id') == mid[0]: return r.get('result', {})
    cmd('Page.enable'); cmd('Page.navigate', url=f"file://{tmp}?scene={scene}")
    time.sleep(wait)
    r = cmd('Runtime.evaluate', expression="JSON.stringify({n:(typeof SC!=='undefined'?SC.length:0),errs:window.__errs,ready:document.querySelector('#next')&&document.querySelector('#next').classList.contains('ready'),text:(document.querySelector('#text')||{}).innerText})", returnByValue=True)
    print(r['result'].get('value'))
    shot = cmd('Page.captureScreenshot', format='png')
    open(out, 'wb').write(base64.b64decode(shot['data']))
finally:
    p.kill(); os.remove(tmp)
