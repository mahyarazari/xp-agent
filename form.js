/* XP agent - intake form. Usage: XPForm(elementId, data) where data = {p:[[key,name]],ph:[[key,name,projectKey]],u:[names]} (+ optional t:[involved teams], o:[owner teams]) */
(function(){
const CSS='#xf{direction:rtl;font-size:14px;padding:4px 0}\n#xf .tp{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}\n#xf .tp button[aria-pressed=true],#xf .ch button[aria-pressed=true]{background:var(--bg-accent);color:var(--text-accent);border-color:var(--border-accent)}\n#xf .g{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px 14px}\n#xf label{display:block;font-size:13px;color:var(--text-secondary);margin-bottom:4px}\n#xf input,#xf select,#xf textarea{width:100%;box-sizing:border-box}\n#xf .w{grid-column:1/-1}\n#xf .ch{display:flex;flex-wrap:wrap;gap:6px}\n#xf .ch button{font-size:12px;padding:2px 10px}\n#xf .er{color:var(--text-danger);font-size:13px;min-height:18px;margin:6px 0}\n#xf .it{display:flex;justify-content:space-between;gap:8px;border-top:0.5px solid var(--border);padding:8px 0;font-size:13px}\n#xf .mu{color:var(--text-secondary);font-size:12px}\n#xf .q{display:flex;gap:4px;flex-wrap:wrap;margin-top:4px}\n#xf .q button{font-size:11px;padding:0 8px;color:var(--text-secondary)}\n#xf .op{margin:14px 0 4px;font-size:13px;color:var(--text-secondary);border-top:0.5px solid var(--border);padding-top:10px}';
window.XPForm=function(id,D){
D=D||{p:[],ph:[],u:[]};
if(!document.getElementById("xp-form-css")){const st=document.createElement("style");st.id="xp-form-css";st.textContent=CSS;document.head.appendChild(st);}
document.getElementById(id).innerHTML='<div id="xf">\n<div class="tp" id="tp"></div>\n<div id="fm"></div>\n<div class="er" id="er"></div>\n<div style="display:flex;gap:8px;justify-content:flex-start;margin-bottom:12px"><button type="button" id="ad">\u0627\u0641\u0632\u0648\u062f\u0646 \u0628\u0647 \u0644\u06cc\u0633\u062a</button></div>\n<div id="ls"></div>\n<div style="display:flex;gap:8px;align-items:center;margin-top:10px"><button type="button" id="sd">\u0627\u0631\u0633\u0627\u0644 \u0628\u0631\u0627\u06cc \u0627\u06cc\u062c\u0646\u062a \u2197</button><span class="mu" id="ct"></span></div>\n</div>';

const TY={project:"\u067e\u0631\u0648\u0698\u0647",phase:"\u0641\u0627\u0632",task:"\u062a\u0633\u06a9",standalone:"\u062a\u0633\u06a9 \u0645\u0633\u062a\u0642\u0644"};
const PR=["Critical","High","Medium","Low","Lowest"],RE=["0%","<10%","10\u201325%","25\u201350%","50\u201375%",">75%"];
const PT=["Research","Automation","Campaign / Event","OKR","Black Friday","Product"];
const TT=["Meeting","Follow-up","Analysis","Research","PRD","Data Request","Development","Testing","Communication","Documentation","Decision"];
const ST=["To Do","In Progress","On Hold","Blocked"],STP=["To Do","In Progress","On Hold"];
const TM0=["XD","XI","Commercial-Vertical","Commercial-Platform","Operation","Marketing","Product-Shopping","Product-Commercial","Product-CS","Product-Express","Finance","HR","CSR","BI Core"];
const OW0=["Commercial-Vertical","Commercial-Platform","Operation","Marketing","Product-Shopping","Product-Commercial","Product-CS","Product-Express","Finance","HR","CSR","BI Core"];
const TM=D.t&&D.t.length?D.t:TM0,OW=D.o&&D.o.length?D.o:OW0;
const S=["subject","\u0645\u0648\u0636\u0648\u0639","t",1,1],O=["owner","\u0645\u0633\u0626\u0648\u0644","u",1],DU=["due","\u062a\u0627\u0631\u06cc\u062e \u067e\u0627\u06cc\u0627\u0646","d",1],SS=["status","\u0648\u0636\u0639\u06cc\u062a","s",1,0,ST],BL=["blocker","\u062f\u0644\u06cc\u0644 Blocked","t",1,1];
const PJ=["project","\u067e\u0631\u0648\u0698\u0647","p",1,1],PH=["phase","\u0641\u0627\u0632","h",1,1];
const OS=["start","\u062a\u0627\u0631\u06cc\u062e \u0634\u0631\u0648\u0639","d",0],OP=["priority","\u0627\u0647\u0645\u06cc\u062a","s",0,0,PR],OC=["contrib","\u0647\u0645\u06a9\u0627\u0631\u0627\u0646","n",0,1],OX=["external","\u0627\u0641\u0631\u0627\u062f \u0628\u06cc\u0631\u0648\u0646 \u0627\u0632 \u062a\u06cc\u0645 \u2014 \u0646\u0627\u0645 (\u062a\u06cc\u0645)\u060c \u2026","t",0],OL=["links","\u0644\u06cc\u0646\u06a9\u200c\u0647\u0627 \u2014 \u0647\u0631 \u062e\u0637: \u0639\u0646\u0648\u0627\u0646 : \u0644\u06cc\u0646\u06a9","a",0,1],OD=["desc","\u062a\u0648\u0636\u06cc\u062d\u0627\u062a","a",0,1];
const TO=["teams","\u062a\u06cc\u0645\u200c\u0647\u0627\u06cc \u062f\u0631\u06af\u06cc\u0631","m",0,1],SR=["seller","\u0627\u062b\u0631 \u0631\u0648\u06cc \u0641\u0631\u0648\u0634\u0646\u062f\u0647\u200c\u0647\u0627","s",1,0,RE],CR=["customer","\u0627\u062b\u0631 \u0631\u0648\u06cc \u0645\u0634\u062a\u0631\u06cc\u200c\u0647\u0627","s",1,0,RE],OT=["ownerTeam","\u062a\u06cc\u0645 \u0645\u0627\u0644\u06a9","o",1,1],DD=["dod","\u0645\u0639\u06cc\u0627\u0631 \u0645\u0648\u0641\u0642\u06cc\u062a (DoD)","a",0,1];
const OPT={project:[DD,OC,OL,OD],phase:[OS,OP,TO,OC,OX,OL,OD],task:[OS,OP,OC,OX,OL,OD],standalone:[OS,OP,OC,OX,OL,OD]};
const F={project:[S,["goal","\u0647\u062f\u0641 \u0627\u0635\u0644\u06cc","a",1,1],["start","\u062a\u0627\u0631\u06cc\u062e \u0634\u0631\u0648\u0639","d",1],DU,["ptype","\u0646\u0648\u0639 \u067e\u0631\u0648\u0698\u0647","s",1,0,PT],["priority","\u0627\u0647\u0645\u06cc\u062a","s",1,0,PR],O,["status","\u0648\u0636\u0639\u06cc\u062a","s",1,0,STP],OT],
phase:[PJ,S,DU,SR,CR,O,SS,BL],task:[PJ,PH,S,["ttype","\u0646\u0648\u0639 \u062a\u0633\u06a9","s",1,0,TT],DU,O,SS,BL],standalone:[S,["ttype","\u0646\u0648\u0639 \u062a\u0633\u06a9","s",1,0,TT],DU,O,SS,BL]};
let ty=null,v={},L=[];
const $=i=>document.getElementById(i),e=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const fa=n=>String(n).replace(/\d/g,d=>"\u06f0\u06f1\u06f2\u06f3\u06f4\u06f5\u06f6\u06f7\u06f8\u06f9"[d]);
const MN=["\u0641\u0631\u0648\u0631\u062f\u06cc\u0646","\u0627\u0631\u062f\u06cc\u0628\u0647\u0634\u062a","\u062e\u0631\u062f\u0627\u062f","\u062a\u06cc\u0631","\u0645\u0631\u062f\u0627\u062f","\u0634\u0647\u0631\u06cc\u0648\u0631","\u0645\u0647\u0631","\u0622\u0628\u0627\u0646","\u0622\u0630\u0631","\u062f\u06cc","\u0628\u0647\u0645\u0646","\u0627\u0633\u0641\u0646\u062f"];
function gj(t){const gy=t.getFullYear(),gm=t.getMonth()+1,gd=t.getDate(),g=[0,31,59,90,120,151,181,212,243,273,304,334],y2=gm>2?gy+1:gy;let d=355666+365*gy+Math.floor((y2+3)/4)-Math.floor((y2+99)/100)+Math.floor((y2+399)/400)+gd+g[gm-1];let y=-1595+33*Math.floor(d/12053);d%=12053;y+=4*Math.floor(d/1461);d%=1461;if(d>365){y+=Math.floor((d-1)/365);d=(d-1)%365}return d<186?[y,1+Math.floor(d/31),1+d%31]:[y,7+Math.floor((d-186)/30),1+(d-186)%30]}
function qd(k){const t=new Date();if(k==="w")t.setDate(t.getDate()+7);if(k==="t")t.setDate(t.getDate()+1);let[y,m,d]=gj(t);if(k==="m")d=m<=6?31:m<=11?30:29;return fa(d+" "+MN[m-1]+" "+y)}
const vis=f=>f[0]!=="blocker"||v.status==="Blocked";
function po(){const o=D.p.map(x=>[x[0],x[1]]);L.forEach((b,i)=>{if(b.t==="project")o.push(["n"+i,b.v.subject+" (\u062c\u062f\u06cc\u062f\u060c \u0645\u0648\u0631\u062f "+fa(i+1)+")"])});return o}
function ho(){const p=v.project;if(!p)return[];const o=p[0]==="n"?[]:D.ph.filter(x=>x[2]===p).map(x=>[x[0],x[1]]);L.forEach((b,i)=>{if(b.t==="phase"&&b.v.project===p)o.push(["n"+i,b.v.subject+" (\u062c\u062f\u06cc\u062f\u060c \u0645\u0648\u0631\u062f "+fa(i+1)+")"])});o.push(["general","\u0628\u062f\u0648\u0646 \u0641\u0627\u0632 \u062e\u0627\u0635 (General)"]);return o}
function sel(id,o,ph){return `<select data-k="${id}"><option value="">${ph||"\u0627\u0646\u062a\u062e\u0627\u0628 \u06a9\u0646\u06cc\u062f"}</option>${o.map(x=>`<option value="${e(x[0])}"${v[id]===x[0]?" selected":""}>${e(x[1])}</option>`).join("")}</select>`}
function fld(f){const[id,lb,k,rq,w,op]=f;let c="";
if(k==="t")c=`<input data-k="${id}" value="${e(v[id])}">`;
if(k==="a")c=`<textarea data-k="${id}" rows="2">${e(v[id])}</textarea>`;
if(k==="d")c=`<input data-k="${id}" value="${e(v[id])}" placeholder="\u0645\u062b\u0644\u0627\u064b \u06f1\u06f5 \u0622\u0628\u0627\u0646 \u06f1\u06f4\u06f0\u06f5"><div class="q">${[["n","\u0627\u0645\u0631\u0648\u0632"],["t","\u0641\u0631\u062f\u0627"],["w","\u06cc\u06a9 \u0647\u0641\u062a\u0647 \u0628\u0639\u062f"],["m","\u0622\u062e\u0631 \u0645\u0627\u0647"]].map(x=>`<button type="button" data-q="${id}" data-w="${x[0]}">${x[1]}</button>`).join("")}</div>`;
if(k==="n")c=`<div class="ch">${D.u.map(x=>`<button type="button" data-c="${e(x)}" aria-pressed="${(v.contrib||[]).includes(x)}">${e(x)}</button>`).join("")}</div>`;
if(k==="u")c=`<input data-k="${id}" list="xpu" value="${e(v[id])}" placeholder="\u0646\u0627\u0645 \u062f\u0631 Jira">`;
if(k==="s")c=sel(id,op.map(x=>[x,x]));
if(k==="p")c=sel(id,po());
if(k==="h")c=v.project?sel(id,ho()):`<select disabled><option>\u0627\u0648\u0644 \u067e\u0631\u0648\u0698\u0647 \u0631\u0627 \u0627\u0646\u062a\u062e\u0627\u0628 \u06a9\u0646\u06cc\u062f</option></select>`;
if(k==="o"){const ot=!!v._ow;c=`<div class="ch"><button type="button" data-ow="our" aria-pressed="${!ot}">\u062a\u06cc\u0645 \u062e\u0648\u062f\u0645\u0627\u0646 (Experience)</button><button type="button" data-ow="other" aria-pressed="${ot}">\u062a\u06cc\u0645 \u062f\u06cc\u06af\u0631 (\u0647\u0645\u200c\u0631\u0627\u0633\u062a\u0627)</button></div>`+(ot?`<div style="margin-top:6px">${sel(id,OW.map(x=>[x,x]),"\u06a9\u062f\u0627\u0645 \u062a\u06cc\u0645\u061f")}</div>`:"")}
if(k==="m")c=`<div class="ch">${TM.map(x=>`<button type="button" data-m="${e(x)}" aria-pressed="${(v.teams||[]).includes(x)}">${e(x)}</button>`).join("")}</div>`;
return `<div class="${w?"w":""}"><label>${lb}${rq?" *":""}</label>${c}</div>`}
function R(){$("tp").innerHTML=Object.keys(TY).map(k=>`<button type="button" data-t="${k}" aria-pressed="${ty===k}">${TY[k]}</button>`).join("");
$("fm").innerHTML=ty?`<datalist id="xpu">${D.u.map(x=>`<option value="${e(x)}">`).join("")}</datalist><div class="g">${F[ty].filter(vis).map(fld).join("")}</div><div class="op">\u0627\u062e\u062a\u06cc\u0627\u0631\u06cc \u2014 \u0627\u06af\u0631 \u062f\u0627\u0631\u06cc\u062f\u060c \u0628\u0627 \u06cc\u06a9 \u06a9\u0644\u06cc\u06a9 \u067e\u0631 \u06a9\u0646\u06cc\u062f</div><div class="g">${OPT[ty].map(fld).join("")}</div>`:`<p class="mu">\u0646\u0648\u0639 \u06a9\u0627\u0631 \u0631\u0627 \u0627\u0646\u062a\u062e\u0627\u0628 \u06a9\u0646\u06cc\u062f.</p>`;
$("ad").style.display=ty?"":"none";
$("ls").innerHTML=L.map((b,i)=>`<div class="it"><span>${fa(i+1)}. ${TY[b.t]}: ${e(b.v.subject)} <span class="mu">${e(b.v.owner||"")} \u00b7 ${e(b.v.due||"")}</span></span><button type="button" data-x="${i}" style="font-size:12px;padding:0 8px">\u062d\u0630\u0641</button></div>`).join("");
$("ct").textContent=L.length?fa(L.length)+" \u0645\u0648\u0631\u062f \u062f\u0631 \u0644\u06cc\u0633\u062a":"\u0627\u0648\u0644 \u0645\u0648\u0627\u0631\u062f \u0631\u0627 \u0628\u0647 \u0644\u06cc\u0633\u062a \u0627\u0636\u0627\u0641\u0647 \u06a9\u0646\u06cc\u062f."}
function nm(k,x){if(!x)return"";if(x==="general")return"General (\u0628\u062f\u0648\u0646 \u0641\u0627\u0632 \u062e\u0627\u0635)";if(x[0]==="n")return L[+x.slice(1)].v.subject+" (\u062c\u062f\u06cc\u062f\u060c \u0645\u0648\u0631\u062f "+fa(+x.slice(1)+1)+")";const a=(k==="project"?D.p:D.ph).find(y=>y[0]===x);return a?x+" \u00b7 "+a[1]:x}
$("xf").addEventListener("click",ev=>{const b=ev.target.closest("button");if(!b)return;
if(b.dataset.ow){v._ow=b.dataset.ow==="other";v.ownerTeam=v._ow?"":"Experience";R();return}
if(b.dataset.t){ty=b.dataset.t;v={status:"To Do",owner:v.owner||"",ownerTeam:"Experience"};$("er").textContent="";R()}
if(b.dataset.q){v[b.dataset.q]=qd(b.dataset.w);R();return}
if(b.dataset.c){const a=v.contrib||[];v.contrib=a.includes(b.dataset.c)?a.filter(x=>x!==b.dataset.c):[...a,b.dataset.c];R();return}
if(b.dataset.m){const a=v.teams||[];v.teams=a.includes(b.dataset.m)?a.filter(x=>x!==b.dataset.m):[...a,b.dataset.m];R()}
if(b.dataset.x){L.splice(+b.dataset.x,1);L.forEach(q=>["project","phase"].forEach(k=>{if(q.v[k]&&q.v[k][0]==="n")delete q.v[k]}));R()}
if(b.id==="ad"){const m=F[ty].filter(vis).filter(f=>f[3]&&!(Array.isArray(v[f[0]])?v[f[0]].length:String(v[f[0]]||"").trim())).map(f=>f[1].split(" (")[0]);
if(m.length){$("er").textContent="\u0627\u06cc\u0646 \u0645\u0648\u0627\u0631\u062f \u0631\u0627 \u067e\u0631 \u06a9\u0646\u06cc\u062f: "+m.join("\u060c ");return}
L.push({t:ty,v:JSON.parse(JSON.stringify(v))});v={status:"To Do",owner:v.owner,ownerTeam:"Experience"};$("er").textContent="";R()}
if(b.id==="sd"){if(!L.length){$("er").textContent="\u0627\u0648\u0644 \u062d\u062f\u0627\u0642\u0644 \u06cc\u06a9 \u0645\u0648\u0631\u062f \u0628\u0647 \u0644\u06cc\u0633\u062a \u0627\u0636\u0627\u0641\u0647 \u06a9\u0646\u06cc\u062f.";return}
const o=["#\u0641\u0631\u0645_\u062b\u0628\u062a ("+fa(L.length)+" \u0645\u0648\u0631\u062f)"];L.forEach((q,i)=>{o.push("","\u2014 \u0645\u0648\u0631\u062f "+fa(i+1)+": "+TY[q.t]+" \u062c\u062f\u06cc\u062f");[...F[q.t],...OPT[q.t]].filter(f=>f[0]!=="blocker"||q.v.status==="Blocked").filter(f=>!(f[0]==="ownerTeam"&&q.v.ownerTeam==="Experience")).forEach(f=>{let x=q.v[f[0]];if(f[0]==="project"||f[0]==="phase")x=nm(f[0],x);if(Array.isArray(x))x=x.join("\u060c ");if(x&&String(x).trim())o.push(f[1].split(/ \(| \u2014/)[0]+": "+(f[0]==="links"?"\n":"")+String(x).trim())})});
sendPrompt(o.join("\n"))}});
$("xf").addEventListener("input",ev=>{const k=ev.target.dataset.k;if(!k)return;v[k]=ev.target.value;if(ev.target.tagName==="SELECT"&&(k==="project"||k==="status")){if(k==="project")delete v.phase;R()}else{$("er").textContent=""}});
$("xf").addEventListener("change",ev=>{const k=ev.target.dataset.k;if(k&&ev.target.tagName==="SELECT"){v[k]=ev.target.value;if(k==="project"||k==="status"){if(k==="project")delete v.phase;R()}}});
R();
};
})();
