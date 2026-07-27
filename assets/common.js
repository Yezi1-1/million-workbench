// ==========================================
// 百万搞钱工作台 - App核心脚本
// 底部Tab + localStorage数据持久化 + 可编辑
// ==========================================

// ===== 数据存储系统 =====
const DB = {
  get(key, def) {
    try { const v = localStorage.getItem('wb_' + key); return v ? JSON.parse(v) : def; }
    catch(e) { return def; }
  },
  set(key, val) { localStorage.setItem('wb_' + key, JSON.stringify(val)); }
};

// ===== 底部Tab配置 =====
const TABS = [
  { id: "dashboard", label: "首页", icon: "📊" },
  { id: "tracks",    label: "赛道", icon: "🎯" },
  { id: "finance",   label: "记账", icon: "💰" },
  { id: "crm",       label: "客户", icon: "👥" },
  { id: "more",      label: "更多", icon: "☰" },
];

// ===== 渲染底部Tab =====
function renderBottomTab(activeId) {
  const tab = document.createElement("nav");
  tab.className = "bottom-tab";
  TABS.forEach(t => {
    const item = document.createElement("div");
    item.className = "tab-item" + (t.id === activeId ? " active" : "");
    item.innerHTML = `<span class="tab-icon">${t.icon}</span><span>${t.label}</span>`;
    item.onclick = () => switchPage(t.id);
    tab.appendChild(item);
  });
  document.body.appendChild(tab);
}

// ===== 页面切换 =====
function switchPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  const page = document.getElementById("page-" + pageId);
  if (page) page.classList.add("active");
  document.querySelectorAll(".tab-item").forEach((t, i) => {
    t.classList.toggle("active", TABS[i].id === pageId);
  });
  window.scrollTo(0, 0);
}

// ===== "更多"菜单子页面 =====
function switchSub(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  const page = document.getElementById("page-" + pageId);
  if (page) page.classList.add("active");
  document.querySelectorAll(".tab-item").forEach(t => t.classList.remove("active"));
  document.querySelector('.tab-item:last-child').classList.add("active");
  window.scrollTo(0, 0);
}

// ===== 顶部头部 =====
function renderHeader() {
  const header = document.createElement("header");
  header.className = "app-header";
  const now = new Date();
  const dateStr = `${now.getMonth()+1}月${now.getDate()}日`;
  header.innerHTML = `
    <div class="app-header-top">
      <div class="app-header-user">
        <div class="avatar">耶</div>
        <div>
          <div class="name">Yezi1-1</div>
          <div class="date">${dateStr} · 独立创业者</div>
        </div>
      </div>
      <div class="app-header-stats">
        <div class="stat-pill">💰 <span class="num" id="header-income">¥1,860</span></div>
        <div class="stat-pill">🔥 <span class="num">23</span></div>
      </div>
    </div>
  `;
  document.body.insertBefore(header, document.body.firstChild);
}

// ===== 货币格式化 =====
function fmtMoney(num) {
  if (num >= 10000) return "¥" + (num/10000).toFixed(1) + "万";
  return "¥" + num.toLocaleString();
}

// ===== 环形进度图 =====
function drawRing(canvasId, percent, colors, label) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const size = canvas.offsetWidth;
  canvas.width = size * dpr; canvas.height = size * dpr;
  ctx.scale(dpr, dpr);
  const cx = size/2, cy = size/2, r = size/2 - 14, lw = 10;

  ctx.strokeStyle = "#f0f1f5";
  ctx.lineWidth = lw;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.stroke();

  const start = -Math.PI/2;
  const end = start + Math.PI*2 * percent/100;
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, colors[0]); grad.addColorStop(1, colors[1]);
  ctx.strokeStyle = grad; ctx.lineWidth = lw; ctx.lineCap = "round";
  ctx.beginPath(); ctx.arc(cx, cy, r, start, end); ctx.stroke();

  ctx.fillStyle = "#2d3436";
  ctx.font = "bold 24px sans-serif";
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(percent.toFixed(0) + "%", cx, cy - 6);
  ctx.fillStyle = "#b2bec3";
  ctx.font = "11px sans-serif";
  ctx.fillText(label, cx, cy + 16);
}

// ===== 柱状图 =====
function drawBars(canvasId, labels, data, color1, color2) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.offsetWidth, h = canvas.offsetHeight;
  canvas.width = w*dpr; canvas.height = h*dpr; ctx.scale(dpr, dpr);
  const pad = {t:16,r:12,b:28,l:12};
  const cw = w-pad.l-pad.r, ch = h-pad.t-pad.b;
  const max = Math.max(...data)*1.2;
  const barW = cw/data.length*0.55, gap = cw/data.length*0.45;

  ctx.strokeStyle = "#f0f1f5"; ctx.lineWidth = 1;
  for(let i=0;i<=3;i++){
    const y = pad.t + ch/3*i;
    ctx.beginPath(); ctx.moveTo(pad.l,y); ctx.lineTo(w-pad.r,y); ctx.stroke();
  }

  data.forEach((v,i) => {
    const x = pad.l + cw/data.length*i + gap/2;
    const bh = v/max*ch, y = pad.t+ch-bh;
    const g = ctx.createLinearGradient(0,y,0,pad.t+ch);
    g.addColorStop(0,color1); g.addColorStop(1,color2);
    ctx.fillStyle = g;
    const r=4;
    ctx.beginPath();
    ctx.moveTo(x+r,y); ctx.lineTo(x+barW-r,y);
    ctx.quadraticCurveTo(x+barW,y,x+barW,y+r);
    ctx.lineTo(x+barW,pad.t+ch); ctx.lineTo(x,pad.t+ch);
    ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y); ctx.fill();

    ctx.fillStyle = "#b2bec3"; ctx.font = "10px sans-serif"; ctx.textAlign="center";
    ctx.fillText(labels[i], x+barW/2, h-10);
  });
}

// ===== 折线图 =====
function drawLine(canvasId, labels, data, color1, color2) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.offsetWidth, h = canvas.offsetHeight;
  canvas.width = w*dpr; canvas.height = h*dpr; ctx.scale(dpr, dpr);
  const pad = {t:16,r:12,b:28,l:12};
  const cw = w-pad.l-pad.r, ch = h-pad.t-pad.b;
  const max = Math.max(...data)*1.2;

  ctx.strokeStyle = "#f0f1f5"; ctx.lineWidth = 1;
  for(let i=0;i<=3;i++){
    const y = pad.t+ch/3*i;
    ctx.beginPath(); ctx.moveTo(pad.l,y); ctx.lineTo(w-pad.r,y); ctx.stroke();
  }

  const pts = data.map((v,i) => ({
    x: pad.l + cw/(data.length-1)*i,
    y: pad.t + ch - v/max*ch
  }));

  const g = ctx.createLinearGradient(0,pad.t,0,pad.t+ch);
  g.addColorStop(0, color1+'40'); g.addColorStop(1, color1+'00');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pad.t+ch);
  pts.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(pts[pts.length-1].x, pad.t+ch); ctx.closePath(); ctx.fill();

  const lg = ctx.createLinearGradient(0,0,w,0);
  lg.addColorStop(0,color1); lg.addColorStop(1,color2);
  ctx.strokeStyle = lg; ctx.lineWidth = 2.5;
  ctx.beginPath();
  pts.forEach((p,i) => i===0 ? ctx.moveTo(p.x,p.y) : ctx.lineTo(p.x,p.y));
  ctx.stroke();

  pts.forEach(p => {
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(p.x,p.y,4,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle = color1; ctx.lineWidth = 2; ctx.stroke();
  });

  ctx.fillStyle = "#b2bec3"; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
  labels.forEach((l,i) => ctx.fillText(l, pts[i].x, h-10));
}

// ===== 任务打卡切换 =====
function toggleTask(el) {
  el.classList.toggle("done");
  // 保存状态
  const tasks = document.querySelectorAll(".task-item");
  const states = Array.from(tasks).map(t => t.classList.contains("done"));
  DB.set("taskStates", states);
}

// ===== Modal =====
function openModal(id) { document.getElementById(id).classList.add("show"); }
function closeModal(id) { document.getElementById(id).classList.remove("show"); }

// ===== 内联编辑 =====
function editField(key, label, currentVal, type) {
  const newVal = prompt(label + "：", currentVal || "");
  if (newVal !== null) {
    DB.set(key, type === "number" ? Number(newVal) : newVal);
    location.reload();
  }
}
