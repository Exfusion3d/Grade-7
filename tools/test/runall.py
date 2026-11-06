"""Play every scene of every lesson (or the ones named) in headless Chrome and report problems.

usage:  python3 tools/test/runall.py                 # all lessons
        python3 tools/test/runall.py l03 l13         # only these lessons
Needs: Google Chrome installed, and `pip install websocket-client`.
Screenshots of each scene's final frame go to tools/test/shots/<lesson>-s<scene>.png (git-ignored)."""
import subprocess, json, sys, os, concurrent.futures as cf
here = os.path.dirname(os.path.abspath(__file__))
D = os.path.normpath(os.path.join(here, '..', '..', 'lessons'))
only = sys.argv[1:]
files = sorted(f for f in os.listdir(D) if f.startswith('l') and f.endswith('.html') and (not only or f[:3] in only))
os.makedirs(here + '/shots', exist_ok=True)

def run(f, n, wait=22):
    out = f"{here}/shots/{f[:3]}-s{n}.png"
    r = subprocess.run([sys.executable, here + '/cdp.py', f"{D}/{f}", str(n), out, str(wait), '--fast'],
                       capture_output=True, text=True, timeout=wait + 120)
    try:
        return f, n, json.loads(r.stdout.strip().splitlines()[-1])
    except Exception:
        return f, n, {'crash': (r.stderr or r.stdout)[-200:]}

res = {}
with cf.ThreadPoolExecutor(6) as ex:
    counts = {}
    for f, fu in {f: ex.submit(run, f, 1) for f in files}.items():
        _, _, j = fu.result(); res[(f, 1)] = j; counts[f] = j.get('n') or 9
    for fu in cf.as_completed([ex.submit(run, f, n) for f in files for n in range(2, counts[f] + 1)]):
        f, n, j = fu.result(); res[(f, n)] = j
bad = [(f, n, j) for (f, n), j in sorted(res.items()) if not (j.get('ready') and not j.get('errs'))]
print("total scenes:", len(res), "  passing:", len(res) - len(bad))
for f, n, j in bad:
    print("PROBLEM", f, "scene", n, json.dumps(j)[:300])
sys.exit(1 if bad else 0)
