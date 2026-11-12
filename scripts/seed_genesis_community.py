#!/usr/bin/env python3
"""AtlasClub Genesis: native LearnHouse community bootstrap.
No network or writes by default. --apply requires GENESIS_CAMPUS_TOKEN.
No deletion, course linking, payment modification or automatic renaming.
"""
import argparse
import json
import os
import sys
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen

NAME = "AtlasClub Genesis"
# Existing early branding is recognized, never renamed or duplicated automatically.
NAME_ALIASES = {"atlasclub genesis", "atlasclub | genesis"}
DESCRIPTION = ("A comunidade de quem constrói o futuro com IA. "
               "Aprenda. Construa. Colabore. Transforme ideias em projetos AI-First e AI-Native.")
TOPICS = [
 ("01 | COMECE AQUI — Bem-vindo ao Genesis", "announcement",
  "Bem-vindo ao ATLASCLUB | GENESIS! Aprenda. Construa. Colabore. "
  "Apresente-se e conte que problema gostaria de resolver com IA. "
  "Diana é uma interlocutora DIGITAL supervisionada por pessoas. "
  "Não partilhe documentos, dados de clientes, senhas ou informações privadas."),
 ("02 | APRENDA — Primeiros passos com IA", "question",
  "Este é o espaço para perguntas, microaulas e materiais práticos. "
  "Não precisa de saber programar. Partilhe a sua dúvida e o contexto autorizado. "
  "Formações pagas e replays mantêm direitos de acesso próprios."),
 ("03 | CONSTRUA — Missão 001: uma ideia, um agente", "idea",
  "Desafio Semente: D0 escolher problema; D1 definir tarefa; D2 limites/permissões; "
  "D3 contexto seguro; D4 primeiro teste V1; D5 revisão e V2; "
  "D6 partilha opcional; D7 próximo projeto. "
  "Sem runtime homologado, classificar explicitamente como simulação."),
 ("04 | COLABORE — Projetos, feedback e parceiros", "showcase",
  "Mostre projetos com objetivo, fase real (ideia, protótipo, teste ou produção), "
  "evidências e necessidades. Colaborações produtivas exigem acordo próprio. "
  "Ser membro não concede emprego, remuneração, quotas ou acesso à GWD.")
]

def call(method, url, token, data=None):
    payload = None if data is None else json.dumps(data, ensure_ascii=False).encode("utf-8")
    headers = {"Accept": "application/json", "Authorization": "Bearer " + token}
    if payload is not None:
        headers["Content-Type"] = "application/json"
    try:
        with urlopen(Request(url, data=payload, headers=headers, method=method), timeout=20) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except HTTPError as exc:
        raise RuntimeError(f"{method} failed: HTTP {exc.code}: {exc.read().decode('utf-8', 'replace')[:300]}") from None
    except URLError as exc:
        raise RuntimeError(f"Connection failed: {exc.reason}") from None

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--api-base", default="")
    parser.add_argument("--org-id", type=int, default=0)
    parser.add_argument("--community-uuid", default="")
    parser.add_argument("--create-if-missing", action="store_true")
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()
    if not args.apply:
        print(json.dumps({"mode":"OFFLINE_DRY_RUN", "name":NAME,
            "topics":[{"title":x[0],"label":x[1],"pin":True} for x in TOPICS],
            "writes":0}, ensure_ascii=False, indent=2))
        return
    token = os.environ.get("GENESIS_CAMPUS_TOKEN", "")
    if not token:
        parser.error("GENESIS_CAMPUS_TOKEN required in environment (never pass in chat/CLI argument)")
    if args.org_id <= 0 or not args.api_base:
        parser.error("--org-id and --api-base required")
    if not (args.api_base.startswith("https://") or args.api_base.startswith("http://localhost")):
        parser.error("Only HTTPS or localhost permitted")
    base = args.api_base.rstrip("/") + "/"
    listing = call("GET", base + f"communities/org/{args.org_id}/page/1/limit/50", token)
    if not isinstance(listing, list):
        raise RuntimeError("Invalid community inventory response")
    if args.community_uuid:
        candidate = [x for x in listing if x.get("community_uuid")==args.community_uuid]
        if not candidate:
            raise RuntimeError("Requested community not in this organization's first page; review manually")
    else:
        candidate = [x for x in listing if x.get("name","").strip().casefold() in NAME_ALIASES]
    if len(candidate)>1:
        raise RuntimeError("Duplicate communities; select --community-uuid explicitly")
    if candidate:
        community = candidate[0]
        print("Reusing existing community:", community.get("community_uuid"))
    elif args.create_if_missing:
        community = call("POST", base + f"communities/?org_id={args.org_id}", token,
                         {"name":NAME,"description":DESCRIPTION,"public":True})
        print("Created community:", community.get("community_uuid"))
    else:
        raise RuntimeError("No Genesis community found. Use existing --community-uuid or --create-if-missing after audit")
    uuid = community.get("community_uuid")
    if not uuid:
        raise RuntimeError("Missing community UUID")
    existing=[]
    for page in range(1,11):
        result=call("GET", base+f"communities/{quote(uuid,safe='')}/discussions?page={page}&limit=100",token)
        if not isinstance(result,list):
            raise RuntimeError("Invalid discussion list")
        existing.extend(result)
        if len(result)<100:
            break
    else:
        raise RuntimeError("More than 1000 posts: manual review before seeding")
    for title,label,body in TOPICS:
        matches=[x for x in existing if x.get("title","").strip()==title]
        if len(matches)>1:
            print("Duplicate existing title; skipping:",title)
            continue
        item=matches[0] if matches else call("POST",base+f"communities/{quote(uuid,safe='')}/discussions",
            token,{"title":title,"label":label,"content":body})
        print("Reused" if matches else "Created",title)
        if item.get("discussion_uuid") and not item.get("is_pinned"):
            call("PUT",base+f"discussions/{quote(item['discussion_uuid'],safe='')}/pin",token,{"is_pinned":True})
            print("Pinned",title)
    print("Seed complete. Validate in guest/member browser before publishing.")
if __name__=="__main__":
    try:
        main()
    except RuntimeError as error:
        print("ERROR:",error,file=sys.stderr)
        sys.exit(1)
