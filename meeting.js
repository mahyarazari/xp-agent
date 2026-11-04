/* XP agent - meeting note. Usage: XPMeeting(elementId, data) where data = {p:[[key,name]], u:[names]} */
(function(){
const CSS = `#xm{direction:rtl;font-size:14px;padding:4px 0}
#xm .g{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px 14px}
#xm label{display:block;font-size:13px;color:var(--text-secondary);margin-bottom:4px}
#xm input,#xm select,#xm textarea{width:100%;box-sizing:border-box}
#xm textarea{min-height:64px;resize:vertical}
#xm .w{grid-column:1/-1}
#xm .er{color:var(--text-danger);font-size:13px;min-height:18px;margin:6px 0}
#xm .mu{color:var(--text-secondary);font-size:12px}
#xm .wh{display:inline-flex;gap:4px;position:relative;border:0.5px solid var(--border);border-radius:10px;padding:0 6px}
#xm .wh:before{content:"";position:absolute;left:4px;right:4px;top:32px;height:32px;border-radius:7px;background:var(--bg-secondary);pointer-events:none}
#xm .wc{position:relative;height:96px;overflow-y:auto;scroll-snap-type:y mandatory;padding:32px 0;box-sizing:border-box;scrollbar-width:none;min-width:52px;text-align:center}
#xm .wc::-webkit-scrollbar{display:none}
#xm .wc.m{min-width:84px}
#xm .wi{height:32px;line-height:32px;scroll-snap-align:center;color:var(--text-secondary);cursor:pointer;font-size:13px}
#xm .wi.on{color:var(--text-primary);font-weight:600}
#xm .ck{display:flex;gap:8px;align-items:center;font-size:13px;color:var(--text-secondary)}
#xm .ck input{width:auto}`;
const JM = ["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"], YRS = [1405,1406,1407,1408,1409,1410], H = 32;
const fa = n => String(n).replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[d]);
const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[c]);
function g2j(gy, gm, gd) {
  const g = [0,31,59,90,120,151,181,212,243,273,304,334], gy2 = gm > 2 ? gy + 1 : gy;
  let d = 355666 + 365 * gy + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) + gd + g[gm - 1];
  let jy = -1595 + 33 * Math.floor(d / 12053); d %= 12053; jy += 4 * Math.floor(d / 1461); d %= 1461;
  if (d > 365) { jy += Math.floor((d - 1) / 365); d = (d - 1) % 365; }
  return [jy, d < 186 ? 1 + Math.floor(d / 31) : 7 + Math.floor((d - 186) / 30), d < 186 ? 1 + d % 31 : 1 + (d - 186) % 30];
}
function j2g(jy, jm, jd) {
  jy += 1595; let d = -355668 + 365 * jy + Math.floor(jy / 33) * 8 + Math.floor(((jy % 33) + 3) / 4) + jd + (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);
  let gy = 400 * Math.floor(d / 146097); d %= 146097;
  if (d > 36524) { gy += 100 * Math.floor(--d / 36524); d %= 36524; if (d >= 365) d++; }
  gy += 4 * Math.floor(d / 1461); d %= 1461;
  if (d > 365) { gy += Math.floor((d - 1) / 365); d = (d - 1) % 365; }
  let gd = d + 1; const sal = [0,31,(gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0 ? 29 : 28,31,30,31,30,31,31,30,31,30,31]; let gm = 0;
  for (gm = 0; gm < 13 && gd > sal[gm]; gm++) gd -= sal[gm];
  return [gy, gm, gd];
}
const iso = (y, m, d) => y + "-" + String(m).padStart(2, "0") + "-" + String(d).padStart(2, "0");
const jLen = (y, m) => { if (m <= 6) return 31; if (m <= 11) return 30; const g = j2g(y, 12, 30); return g2j(g[0], g[1], g[2])[1] === 12 ? 30 : 29; };

window.XPMeeting = function (id, D) {
  D = D || { p: [], u: [] };
  if (!document.getElementById("xp-meeting-css")) { const st = document.createElement("style"); st.id = "xp-meeting-css"; st.textContent = CSS; document.head.appendChild(st); }
  const n = new Date(), t = g2j(n.getFullYear(), n.getMonth() + 1, n.getDate());
  const col = (k, list, cur, cls) => `<div class="wc ${cls || ""}" data-w="${k}">${list.map(([v, l]) => `<div class="wi${v === cur ? " on" : ""}" data-v="${v}">${l}</div>`).join("")}</div>`;
  document.getElementById(id).innerHTML = `<div id="xm"><div class="g">
    <div><label>پروژه *</label><select id="pj"><option value="">انتخاب پروژه</option>${(D.p || []).map(p => `<option value="${esc(p[0])}">${esc(p[1])} (${esc(p[0])})</option>`).join("")}</select></div>
    <div><label>نویسنده</label><select id="by"><option value="">—</option>${(D.u || []).map(u => `<option>${esc(u)}</option>`).join("")}</select></div>
    <div class="w"><label>تاریخ جلسه</label><div class="wh">${col("d", Array.from({ length: 31 }, (_, i) => [i + 1, fa(i + 1)]), t[2])}${col("m", JM.map((x, i) => [i + 1, x]), t[1], "m")}${col("y", YRS.map(y => [y, fa(y)]), YRS.includes(t[0]) ? t[0] : 1405)}</div></div>
    <div class="w"><label>تصمیمات جلسه (هر تصمیم یک خط)</label><textarea id="dc" dir="auto" placeholder="مثلاً: داده‌ی فایننس تا هفته‌ی بعد آماده شود"></textarea></div>
    <div class="w"><label>یادداشت (یک پاراگراف)</label><textarea id="nt" dir="auto" placeholder="چه گفته شد و وضعیت پروژه چیست"></textarea></div>
    <div class="w"><label>قدم بعدی</label><input id="ns" dir="auto" placeholder="یک خط، کار بعدی پروژه"></div>
    <div class="w ck"><input type="checkbox" id="vc"><span>ویس یا متن کامل جلسه را هم در پیام بعدی می‌فرستم (موارد کاری از آن استخراج می‌شود)</span></div>
  </div><div class="er" id="er"></div>
  <div style="display:flex;gap:8px;align-items:center"><button type="button" id="sd">ارسال برای ایجنت ↗</button><span class="mu">قبل از ثبت در Jira پیش‌نمایش می‌بینید.</span></div></div>`;
  const root = document.getElementById("xm"), $ = q => root.querySelector(q), pick = {};
  root.querySelectorAll(".wc").forEach(c => {
    const it = [...c.children], k = c.dataset.w, start = Math.max(0, it.findIndex(x => x.classList.contains("on")));
    const set = i => { it.forEach((x, j) => x.classList.toggle("on", j === i)); pick[k] = +it[i].dataset.v; };
    set(start); let touched = false;
    [0, 120, 400].forEach(ms => setTimeout(() => { if (!touched) c.scrollTop = start * H; }, ms));
    c.addEventListener("pointerdown", () => { touched = true; }); c.addEventListener("wheel", () => { touched = true; });
    let tm; c.addEventListener("scroll", () => { clearTimeout(tm); tm = setTimeout(() => { set(Math.min(it.length - 1, Math.max(0, Math.round(c.scrollTop / H)))); }, 90); });
    it.forEach((x, j) => x.onclick = () => { touched = true; c.scrollTo({ top: j * H, behavior: "smooth" }); });
  });
  root.addEventListener("input", () => { $("#er").textContent = ""; });
  $("#sd").onclick = () => {
    root.querySelectorAll(".wc").forEach(c => { const it = c.children, i = Math.min(it.length - 1, Math.max(0, Math.round(c.scrollTop / H))); pick[c.dataset.w] = +it[i].dataset.v; });
    const pj = $("#pj").value, dc = $("#dc").value.trim(), nt = $("#nt").value.trim(), ns = $("#ns").value.trim(), vc = $("#vc").checked;
    if (!pj) { $("#er").textContent = "پروژه را انتخاب کنید."; return; }
    if (!dc && !nt && !ns && !vc) { $("#er").textContent = "حداقل یکی از تصمیمات، یادداشت یا قدم بعدی را بنویسید."; return; }
    const d = Math.min(pick.d, jLen(pick.y, pick.m)), g = j2g(pick.y, pick.m, d), name = ((D.p || []).find(p => p[0] === pj) || [pj, ""])[1];
    const o = ["#یادداشت_جلسه", "پروژه: " + pj + " · " + name, "تاریخ جلسه: " + pick.y + "/" + String(pick.m).padStart(2, "0") + "/" + String(d).padStart(2, "0") + " (" + iso(g[0], g[1], g[2]) + ")"];
    if ($("#by").value) o.push("نویسنده: " + $("#by").value);
    if (dc) o.push("تصمیمات:", ...dc.split(/\n+/).map(x => x.trim()).filter(Boolean).map(x => "- " + x.replace(/^[-•*]\s*/, "")));
    if (nt) o.push("یادداشت: " + nt.replace(/\s*\n+\s*/g, " "));
    if (ns) o.push("قدم بعدی: " + ns);
    o.push("متن یا ویس جلسه: " + (vc ? "در پیام بعدی می‌فرستم" : "ندارد"));
    $("#er").textContent = "";
    sendPrompt(o.join("\n"));
  };
};
})();
