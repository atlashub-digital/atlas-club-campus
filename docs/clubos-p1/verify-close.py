#!/usr/bin/env python3
"""Atlas ClubOS P1 — verificação de fecho (assets, curso, acessos, progresso)."""
import json, subprocess, sys

BASE = "https://clubos-p1.atlashub.si"
API = BASE + "/api/v1"
AJAR, SJAR = "/tmp/p1cj.txt", "/tmp/p1aluno_cj.txt"
CU = "course_78c9a911-f7bb-4c39-96b3-52d6e5707690"
A_TXT = "activity_39ca3c9a-3397-47c1-ab7a-d791d8a2df41"
A_VID = "activity_d96e3a29-71f8-45c1-90b9-80baf2d28f77"
A_PDF = "activity_03363d70-7497-4344-af6d-9e066e7fa512"
A_QZ  = "activity_57596ead-c853-4621-8386-e4da080ec6f9"
ASG   = "assignment_e81afb9d-67d8-4575-aa14-8a62bad1d117"
ORG_UUID = "org_ca66374d-0dfa-41f2-911e-138148337248"
PDF_URL = f"{BASE}/content/orgs/{ORG_UUID}/courses/{CU}/activities/{A_PDF}/documentpdf/f1f735e6-605d-4931-b776-3fc386268379_documentpdf.pdf"

res = []
def check(name, ok, detail=""):
    res.append((name, "PASS" if ok else "FAIL", detail))
    print(f"[{'PASS' if ok else 'FAIL'}] {name} {detail}")

def code(url, jar=None, method="GET", body=None):
    cmd = ["curl", "-s", "-o", "/dev/null", "-w", "%{http_code}", "-X", method]
    if jar: cmd += ["-b", jar]
    if body is not None:
        cmd += ["-H", "Content-Type: application/json", "-d", json.dumps(body)]
    cmd += [url]
    return subprocess.run(cmd, capture_output=True, text=True).stdout.strip()

def get(url, jar=None):
    cmd = ["curl", "-s"]
    if jar: cmd += ["-b", jar]
    cmd += [url]
    out = subprocess.run(cmd, capture_output=True, text=True).stdout
    try: return json.loads(out)
    except Exception: return {"_raw": out[:200]}

print("=== 1. ASSETS ATLAS ===")
for f in ("atlas-clubos-mark.svg", "atlas-avatar.webp"):
    c = code(f"{BASE}/atlas/{f}")
    check(f"asset {f} HTTP 200", c == "200", f"({c})")
for path in ("/login", "/registo"):
    html = subprocess.run(["curl","-s",BASE+path], capture_output=True, text=True).stdout
    check(f"{path} serve a marca Atlas", "Atlas ClubOS" in html)
    check(f"{path} referencia o símbolo Atlas", "atlas" in html.lower())

print("\n=== 2. CURSO E EXPERIÊNCIAS (aluna) ===")
check("curso legível pela aluna", code(f"{API}/courses/{CU}/meta", SJAR) == "200")
for label, a in (("texto", A_TXT), ("vídeo", A_VID), ("pdf", A_PDF), ("quiz", A_QZ)):
    check(f"atividade {label} legível", code(f"{API}/activities/{a}", SJAR) == "200")
vid = get(f"{API}/activities/{A_VID}", SJAR)
check("vídeo é YouTube externo (sem upload)",
      vid.get("activity_sub_type") == "SUBTYPE_VIDEO_YOUTUBE" and "youtube.com" in json.dumps(vid.get("content") or {}))
check("PDF servido à aluna (byte-idêntico)", code(PDF_URL, SJAR) == "200")
tasks = get(f"{API}/assignments/{ASG}/tasks", SJAR)
check("quiz com 4 tarefas", isinstance(tasks, list) and len(tasks) == 4, f"({len(tasks) if isinstance(tasks,list) else '?'})")
check("chaves de resposta NÃO expostas", "assigned_right_answer" not in json.dumps(tasks))
sub = get(f"{API}/assignments/{ASG}/submissions/me", SJAR)
g = (sub[0] if isinstance(sub, list) and sub else {})
check("nota registada e corrigida no servidor",
      g.get("submission_status") == "GRADED" and g.get("grade") == 300,
      f"(status={g.get('submission_status')} bruta={g.get('grade')}/400 = 75%)")

print("\n=== 3. ACESSOS INDEVIDOS (anónimo) ===")
# O endpoint de atividades devolve METADADOS a qualquer visitante (decisão da
# Direção: catálogo e metadados públicos). O que tem de estar fechado é o
# CONTEÚDO: sem sessão autorizada o campo content vem vazio.
def content_of(url, jar=None):
    cmd = ["curl", "-s"] + (["-b", jar] if jar else []) + [url]
    try:
        d = json.loads(subprocess.run(cmd, capture_output=True, text=True).stdout)
        return json.dumps(d.get("content") or {})
    except Exception:
        return ""

for label, a in (("texto", A_TXT), ("vídeo", A_VID), ("pdf", A_PDF)):
    anon, auth = content_of(f"{API}/activities/{a}"), content_of(f"{API}/activities/{a}", SJAR)
    check(f"conteúdo de {label} oculto ao anónimo",
          len(anon) <= 2 and len(auth) > 2,
          f"(anónimo={len(anon)}B, aluna={len(auth)}B)")

# O quiz não usa activity.content (os dados vivem nas tarefas): o gate é o
# endpoint das tarefas, que exige sessão.
check("quiz: tarefas acessíveis à aluna", isinstance(tasks, list) and len(tasks) == 4)

c = code(f"{API}/assignments/{ASG}/tasks")
check("anónimo bloqueado nas tarefas do quiz", c in ("401", "403"), f"({c})")
c = code(PDF_URL)
check("anónimo bloqueado no ficheiro PDF", c in ("401", "403"), f"({c})")

print("\n=== 4. AVISOS LEGAIS ===")
lic = subprocess.run(["head","-3","/tmp/acc/LICENSE"], capture_output=True, text=True).stdout
check("LICENSE AGPL-3.0 no repositório", "AFFERO" in lic.upper())
home = subprocess.run(["curl","-s",BASE+"/"], capture_output=True, text=True).stdout
check("atribuição upstream visível na UI", "learnhouse" in home.lower())

print("\n=== RESUMO ===")
fails = [r for r in res if r[1] == "FAIL"]
print(f"{len(res)-len(fails)}/{len(res)} PASS")
for n, s, d in fails: print(f"  FAIL: {n} {d}")
sys.exit(1 if fails else 0)
