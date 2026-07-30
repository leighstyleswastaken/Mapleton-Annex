from pathlib import Path
from collections import Counter,defaultdict
import csv
from simulator import POLICIES,run
OUT=Path(__file__).parent/"outputs";OUT.mkdir(exist_ok=True)
rows=[]
for key in POLICIES:
 for seed in range(1,21):
  s=run(seed,key);end=next(x for x in reversed(s.transcript) if x.startswith("ENDING:")).split(":",1)[1].strip()
  rows.append({"policy":key,"seed":seed,"ending":end,"safety":s.safety,"influence":s.influence,"mog":s.mog,"evidence":s.evidence,"hardship":s.hardship,"warnings":len(s.warnings)})
  if seed in (1,7):
   (OUT/f"transcript_{key}_seed_{seed}.md").write_text("\n\n".join(s.transcript)+"\n\n## Narrative warnings\n"+("\n".join("- "+w for w in s.warnings) if s.warnings else "- None"),encoding="utf-8")
with (OUT/"run_metrics.csv").open("w",newline="",encoding="utf-8") as f:
 w=csv.DictWriter(f,fieldnames=rows[0].keys());w.writeheader();w.writerows(rows)
counts=Counter(r["ending"] for r in rows);by=defaultdict(Counter)
for r in rows:by[r["policy"]][r["ending"]]+=1
lines=["# Baseline simulation report","","100 structural runs: 5 policies × 20 seeds.","","## Ending distribution"]
lines += [f"- {k}: {v}" for k,v in counts.most_common()]
lines += ["","## Endings by policy"]
for p,c in by.items():
 lines += [f"### {p}"]+[f"- {k}: {v}" for k,v in c.most_common()]
lines += ["","## Immediate baseline observations","- The ghost/49220 reveal occurs before Ollie is introduced in many routes.","- Fixed scenes dominate the early and middle narrative timeline.","- Policy differences often change ending flags more than the scenes experienced.","- Representative transcripts should be reviewed before prose replacement."]
(OUT/"baseline_report.md").write_text("\n".join(lines),encoding="utf-8")
print("runs",len(rows),"outputs",OUT)
