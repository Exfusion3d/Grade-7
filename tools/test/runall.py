"""Play every scene of every lesson (or the ones named) in headless Chrome and report problems.

usage:  python3 tools/test/runall.py                 # all lessons of every subject
        python3 tools/test/runall.py l03 m01 f02     # only these lessons (l = Science, m = Maths, f = French)
        QS=en=1 python3 tools/test/runall.py f01     # French lessons with everything translated (shots end in -en)
Needs: Google Chrome installed, and `pip install websocket-client`.
Screenshots of each scene's final frame go to tools/test/shots/<lesson>-s<scene>.png (git-ignored)."""
import subprocess, json, sys, os, concurrent.futures as cf
here = os.path.dirname(os.path.abspath(__file__))
root = os.path.normpath(os.path.join(here, '..', '..'))
DIRS = {'lessons': 'l', 'maths': 'm', 'french': 'f'}  # lesson folder -> lesson id letter
only = sys.argv[1:]
where = {f: os.path.join(root, d) for d, letter in DIRS.items() for f in os.listdir(os.path.join(root, d))
         if f.startswith(letter) and f[1:3].isdigit() and f.endswith('.html') and (not only or f[:3] in only)}
files = sorted(where)
os.makedirs(here + '/shots', exist_ok=True)

def run(f, n, wait=22):
    out = f"{here}/shots/{f[:3]}-s{n}{'-en' if os.environ.get('QS') else ''}.png"
    r = subprocess.run([sys.executable, here + '/cdp.py', f"{where[f]}/{f}", str(n), out, str(wait), '--fast'],
                       capture_output=True, text=True, timeout=wait + 120)
    try:
        return f, n, json.loads(r.stdout.strip().splitlines()[-1])
    except Exception:
        return f, n, {'crash': (r.stderr or r.stdout)[-200:]}

res = {}
with cf.ThreadPoolExecutor(int(os.environ.get("WORKERS", 6))) as ex:  # WORKERS=2 when several testers run at once
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
