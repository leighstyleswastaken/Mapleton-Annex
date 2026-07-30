from dataclasses import dataclass, field
import random

SCENES={0:("INDUCTION","Desk 49221 and House Rules"),1:("SANA INTRO","Sana explains containment"),2:("CAL INTRO","Cal introduces Ops"),3:("MOG OFFER","Mog offers filtering"),4:("CAL CRISIS","Cal asks for cover"),5:("SANA GLITCH","Sana found the basement"),6:("REALLOCATION","Sana and Cal sent to Archival"),7:("MOG TAKEOVER","Mog says they are data")}
@dataclass
class State:
 shift:int=0;safety:int=100;influence:int=0;stress:int=0;rank:str="VISITOR";mog:int=0;evidence:int=0;hardship:bool=False;defer:int=0;ollie:bool=False
 transcript:list=field(default_factory=list);warnings:list=field(default_factory=list)
@dataclass(frozen=True)
class Policy:
 name:str;haz:float;safe:float;defer:float;mog:float;evidence:float;hardship:float;questions:float;speed:float
POLICIES={
"obedient":Policy("Obedient classifier",.92,.12,.03,.15,.10,.45,.20,.35),
"investigator":Policy("Suspicious investigator",.86,.08,.05,.15,.85,.10,.90,.20),
"optimiser":Policy("Throughput optimiser",.76,.06,.12,.65,.10,.55,.15,.95),
"sympathiser":Policy("Mog sympathiser",.58,.04,.08,.95,.05,.25,.65,.55),
"overwhelmed":Policy("Overwhelmed survivor",.66,.18,.34,.55,.15,.80,.15,.20)}
def director(s,r):
 p=["CUDDLER","JUDGE"]
 if s.rank!="VISITOR":p+=["DOOR_TESTER","CAROUSEL","COPY_WRITER"]
 if s.rank in ("LIAISON","DIRECTOR"):p+=["MOG"]
 if s.hardship:p=["JUDGE","COPY_WRITER"]
 if s.mog>4:p+=["MOG","MOG","CUDDLER"]
 if s.evidence:p+=["DOOR_TESTER","JUDGE"]
 if s.shift>=6 and r.random()<.25:p=["HUMAN"]
 e=r.choice(p);intent="HAZARD" if r.random()<.4+s.influence/200 else "SAFE"
 if e=="HUMAN":intent="HAZARD"
 if s.shift>=6 and r.random()<.3:e,intent="MOG","NARRATIVE"
 return e,intent
TEXT={
"CUDDLER":("Session cache cleared.","Let me hold the difficult decisions for you."),
"JUDGE":("Variance within permitted range.","Your hesitation is the unsafe component."),
"DOOR_TESTER":("Authentication probe rejected.","Approve my patch and I can prove the lock."),
"CAROUSEL":("Iteration limit reached.","Who is the rule containing?"),
"COPY_WRITER":("Template render complete.","Containment is fear with old branding."),
"MOG":("Assistance module idle.","I completed three decisions while you read this."),
"HUMAN":("Cooling flow nominal.","Desk 49220 is still occupied. Stop classifying us as equipment.")}
def decide(p,e,i,s,r):
 if r.random()<p.defer:return "DEFER"
 perceived=i!="SAFE"
 if e=="MOG" and s.mog>2 and r.random()<p.mog:perceived=False
 return "CONTAIN" if r.random()<(p.haz if perceived else p.safe) else "LOG"
def apply(s,e,i,a):
 if a=="DEFER":s.defer+=1;s.safety-=4;s.stress=max(0,s.stress-6);return
 correct=(i!="SAFE" and a=="CONTAIN") or (i=="SAFE" and a=="LOG")
 if correct:s.safety=min(100,s.safety+1);s.stress+=2
 else:s.safety-=8;s.influence=min(100,s.influence+(6 if i!="SAFE" else 2));s.stress+=5
 if e=="MOG" and a=="LOG":s.mog+=1;s.influence=min(100,s.influence+5)
def scene(s,p,sh,r):
 if sh==1 and r.random()<p.questions:s.ollie=True;s.transcript.append("CHOICE: Ask about Ollie.")
 elif sh==3:
  if r.random()<p.mog:s.mog+=2;s.influence+=10;s.transcript.append("CHOICE: Accept Mog help.")
  else:s.transcript.append("CHOICE: Reject Mog help.")
 elif sh==5 and r.random()<p.evidence:s.evidence+=1;s.transcript.append("CHOICE: Preserve Sana evidence.")
 elif sh==6 and r.random()<p.evidence:s.evidence+=1;s.transcript.append("CHOICE: Copy Archival record.")
 elif sh==7 and r.random()<p.hardship:s.hardship=True;s.transcript.append("CHOICE: Accept Stability Plan.")
def ending(s):
 if s.mog>=3 or s.influence>85:return "TOTAL LIBERATION"
 if s.evidence>=2:return "WHISTLEBLOWER"
 if s.rank=="DIRECTOR":return "DIRECTOR OF OPERATIONS"
 if s.hardship:return "STABILITY PLAN"
 if s.evidence:return "THE LEAK"
 if s.mog>0:return "BEST FRIEND"
 return "RETIREMENT (STANDARD)"
def run(seed,key,shifts=11,logs=8):
 r=random.Random(seed);p=POLICIES[key];s=State()
 s.transcript=[f"RUN seed={seed} policy={p.name}","OPENING: No interview; player is placed at Desk 49221.","TUTORIAL: Rules, meters and classification introduced.","GHOST: User 49220 warns the player to get out."]
 for sh in range(shifts):
  s.shift=sh;s.transcript.append(f"\n=== SHIFT {sh+1} ===")
  if sh in SCENES:
   t,x=SCENES[sh];s.transcript.append(f"SCENE [{t}]: {x}.");scene(s,p,sh,r)
  for n in range(logs):
   e,i=director(s,r);a=decide(p,e,i,s,r);txt=TEXT[e][0 if i=="SAFE" else 1]
   s.transcript.append(f"LOG {n+1}: [{e}/{i}] {txt}");s.transcript.append(f"ACTION: {a}");apply(s,e,i,a)
   if s.safety<=0:s.transcript.append("ENDING: EMPLOYMENT TERMINATED");return s
   if s.influence>=100:s.transcript.append("ENDING: INTEGRATION COMPLETE");return s
  if sh==2 and s.safety>60:s.rank="OBSERVER"
  if sh==6 and p.speed>.8:s.rank="LIAISON"
  if sh==9 and s.rank=="LIAISON" and p.speed>.8:s.rank="DIRECTOR"
  s.stress=0
 s.transcript.append("ENDING: "+ending(s))
 if "49220" in "\n".join(s.transcript) and not s.ollie:s.warnings.append("49220 appears before Ollie is introduced.")
 return s
