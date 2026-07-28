// ==========================================
// 女生成长工作台 - 核心脚本
// 侧边栏导航 + localStorage + 图表
// ==========================================

// ===== 数据存储 =====
const DB = {
  get(key, def) {
    try { const v = localStorage.getItem('gr_' + key); return v ? JSON.parse(v) : def; }
    catch(e) { return def; }
  },
  set(key, val) { localStorage.setItem('gr_' + key, JSON.stringify(val)); }
};

// ===== 导航配置 =====
const NAV = [
  { id: "dashboard", label: "首页", icon: "🌿", section: "总览" },
  { id: "money", label: "存钱记账", icon: "💰", section: "成长" },
  { id: "fitness", label: "减脂管理", icon: "🌸", section: "成长" },
  { id: "english", label: "英语学习", icon: "📖", section: "成长" },
  { id: "trending", label: "爆款捕捉", icon: "✨", section: "成长" },
  { id: "daily", label: "每日打卡", icon: "✅", section: "打卡" },
  { id: "review", label: "月度复盘", icon: "📝", section: "打卡" },
];

// ===== 渲染侧边栏 =====
function renderSidebar(activeId) {
  // 汉堡按钮
  const btn = document.createElement("button");
  btn.className = "mobile-menu-btn";
  btn.innerHTML = "☰";
  btn.onclick = () => document.querySelector(".sidebar").classList.toggle("open");
  document.body.appendChild(btn);

  // 侧边栏
  const sb = document.createElement("aside");
  sb.className = "sidebar";

  sb.innerHTML = `
    <div class="sidebar-header">
      <div class="sidebar-logo">
        <div class="logo-icon">🌿</div>
        <div>
          <div class="logo-text">成长工作台</div>
          <div class="logo-sub">自律 · 治愈 · 向上</div>
        </div>
      </div>
      <div class="sidebar-user">
        <div class="avatar">小</div>
        <div>
          <div class="name">小叶子</div>
          <div class="role">大三 · 自媒体人</div>
        </div>
      </div>
    </div>
    <nav class="sidebar-nav" id="nav-list"></nav>
    <div class="sidebar-footer">
      <span class="streak-dot"></span> 连续打卡 <b style="color:var(--green-deep)">23</b> 天<br>
      <span style="opacity:0.6">今天也要加油呀 🌸</span>
    </div>
  `;
  document.body.appendChild(sb);

  // 导航项
  const navList = sb.querySelector("#nav-list");
  let lastSection = "";
  NAV.forEach(item => {
    if (item.section !== lastSection) {
      const sec = document.createElement("div");
      sec.className = "nav-section";
      sec.textContent = item.section;
      navList.appendChild(sec);
      lastSection = item.section;
    }
    const a = document.createElement("button");
    a.className = "nav-link" + (item.id === activeId ? " active" : "");
    a.innerHTML = `<span class="nav-icon">${item.icon}</span><span>${item.label}</span>`;
    a.onclick = () => location.href = item.id + ".html";
    navList.appendChild(a);
  });

  // 遮罩
  const overlay = document.createElement("div");
  overlay.className = "sidebar-overlay";
  overlay.onclick = () => sb.classList.remove("open");
  document.body.appendChild(overlay);
}

// ===== 页面切换（SPA模式备用） =====
function go(pageId) { location.href = pageId + ".html"; }

// ===== 货币格式化 =====
function fmtMoney(num) {
  if (num >= 10000) return "¥" + (num/10000).toFixed(1) + "万";
  return "¥" + num.toLocaleString();
}

// ===== 环形进度 =====
function drawRing(canvasId, percent, color1, color2, label, sublabel) {
  const c = document.getElementById(canvasId);
  if (!c) return;
  const ctx = c.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const size = c.offsetWidth;
  c.width = size * dpr; c.height = size * dpr;
  ctx.scale(dpr, dpr);
  const cx = size/2, cy = size/2, r = size/2 - 14, lw = 10;

  // 背景环
  ctx.strokeStyle = "#f0f4f1";
  ctx.lineWidth = lw;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.stroke();

  // 进度环
  if (percent > 0) {
    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, color1); grad.addColorStop(1, color2);
    ctx.strokeStyle = grad; ctx.lineWidth = lw; ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(cx, cy, r, -Math.PI/2, -Math.PI/2 + Math.PI*2 * percent/100);
    ctx.stroke();
  }

  // 文字
  ctx.fillStyle = "#4a5c4f";
  ctx.font = "bold 22px sans-serif";
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(percent.toFixed(0) + "%", cx, cy - 8);
  ctx.fillStyle = "#b8c5bc";
  ctx.font = "11px sans-serif";
  ctx.fillText(label, cx, cy + 14);
  if (sublabel) {
    ctx.fillStyle = "#8a9b8e";
    ctx.font = "10px sans-serif";
    ctx.fillText(sublabel, cx, cy + 28);
  }
}

// ===== 折线图 =====
function drawLine(canvasId, labels, data, color1, color2) {
  const c = document.getElementById(canvasId);
  if (!c) return;
  const ctx = c.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const w = c.offsetWidth, h = c.offsetHeight;
  c.width = w*dpr; c.height = h*dpr; ctx.scale(dpr, dpr);
  const pad = {t:16,r:16,b:28,l:16};
  const cw = w-pad.l-pad.r, ch = h-pad.t-pad.b;
  const max = Math.max(...data)*1.15, min = Math.min(...data)*0.9;
  const range = max - min || 1;

  // 网格
  ctx.strokeStyle = "#f0f4f1"; ctx.lineWidth = 1;
  for (let i=0; i<=3; i++) {
    const y = pad.t + ch/3*i;
    ctx.beginPath(); ctx.moveTo(pad.l,y); ctx.lineTo(w-pad.r,y); ctx.stroke();
  }

  const pts = data.map((v,i) => ({
    x: pad.l + (cw/(data.length-1))*i,
    y: pad.t + ch - ((v-min)/range)*ch
  }));

  // 填充
  const g = ctx.createLinearGradient(0, pad.t, 0, pad.t+ch);
  g.addColorStop(0, color1 + "40"); g.addColorStop(1, color1 + "00");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pad.t+ch);
  pts.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(pts[pts.length-1].x, pad.t+ch); ctx.closePath(); ctx.fill();

  // 线
  const lg = ctx.createLinearGradient(0,0,w,0);
  lg.addColorStop(0, color1); lg.addColorStop(1, color2);
  ctx.strokeStyle = lg; ctx.lineWidth = 2.5; ctx.lineCap = "round";
  ctx.beginPath();
  pts.forEach((p,i) => i===0 ? ctx.moveTo(p.x,p.y) : ctx.lineTo(p.x,p.y));
  ctx.stroke();

  // 点
  pts.forEach(p => {
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(p.x,p.y,4,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle = color1; ctx.lineWidth = 2; ctx.stroke();
  });

  // 标签
  ctx.fillStyle = "#b8c5bc"; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
  labels.forEach((l,i) => ctx.fillText(l, pts[i].x, h-8));
}

// ===== 柱状图 =====
function drawBars(canvasId, labels, data, color1, color2) {
  const c = document.getElementById(canvasId);
  if (!c) return;
  const ctx = c.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const w = c.offsetWidth, h = c.offsetHeight;
  c.width = w*dpr; c.height = h*dpr; ctx.scale(dpr, dpr);
  const pad = {t:16,r:16,b:28,l:16};
  const cw = w-pad.l-pad.r, ch = h-pad.t-pad.b;
  const max = Math.max(...data)*1.2;
  const barW = cw/data.length*0.55, gap = cw/data.length*0.45;

  ctx.strokeStyle = "#f0f4f1"; ctx.lineWidth = 1;
  for (let i=0; i<=3; i++) {
    const y = pad.t+ch/3*i;
    ctx.beginPath(); ctx.moveTo(pad.l,y); ctx.lineTo(w-pad.r,y); ctx.stroke();
  }

  data.forEach((v,i) => {
    const x = pad.l + cw/data.length*i + gap/2;
    const bh = v/max*ch, y = pad.t+ch-bh;
    const g = ctx.createLinearGradient(0,y,0,pad.t+ch);
    g.addColorStop(0, color1); g.addColorStop(1, color2);
    ctx.fillStyle = g;
    const r = 5;
    ctx.beginPath();
    ctx.moveTo(x+r,y); ctx.lineTo(x+barW-r,y);
    ctx.quadraticCurveTo(x+barW,y,x+barW,y+r);
    ctx.lineTo(x+barW,pad.t+ch); ctx.lineTo(x,pad.t+ch);
    ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y); ctx.fill();

    ctx.fillStyle = "#b8c5bc"; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
    ctx.fillText(labels[i], x+barW/2, h-8);
  });
}

// ===== 任务打卡 =====
function toggleTask(el, storageKey, idx) {
  el.classList.toggle("done");
  const arr = DB.get(storageKey, []);
  arr[idx].done = el.classList.contains("done");
  DB.set(storageKey, arr);
}

// ===== 渲染热力图 =====
function renderHeatmap(containerId, days, doneDays) {
  const c = document.getElementById(containerId);
  if (!c) return;
  c.innerHTML = "";
  for (let i = 0; i < days; i++) {
    const cell = document.createElement("div");
    cell.className = "heat-cell";
    if (doneDays.includes(i)) {
      cell.classList.add(i % 3 === 0 ? "heat-done-2" : "heat-done");
    }
    if (i === days - 1) cell.classList.add("heat-today");
    c.appendChild(cell);
  }
}

// ===== 弹窗 =====
function openModal(id) { document.getElementById(id).classList.add("show"); }
function closeModal(id) { document.getElementById(id).classList.remove("show"); }

// ===== 内联编辑 =====
function editValue(key, label, current, type) {
  const v = prompt(label + "：", current || "");
  if (v !== null && v !== "") {
    DB.set(key, type === "number" ? Number(v) : v);
    location.reload();
  }
}

// ===== 获取今天日期 =====
function todayStr() {
  const d = new Date();
  return `${d.getMonth()+1}/${d.getDate()}`;
}
