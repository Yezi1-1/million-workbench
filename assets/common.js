// 百万搞钱工作台 - 共享脚本

// 侧边栏导航配置
const NAV_ITEMS = [
  { label: "数据仪表盘", href: "index.html", icon: "📊", section: "核心" },
  { label: "赛道规划", href: "tracks.html", icon: "🎯", section: "核心" },
  { label: "财务记账", href: "finance.html", icon: "💰", section: "核心" },
  { label: "客户CRM", href: "crm.html", icon: "👥", section: "核心" },
  { label: "每日打卡", href: "daily.html", icon: "✅", section: "执行" },
  { label: "月度复盘", href: "review.html", icon: "📈", section: "执行" },
  { label: "资源库", href: "resources.html", icon: "📚", section: "辅助" },
];

// 渲染侧边栏
function renderNav(activeIndex) {
  // 移动端汉堡按钮
  const menuBtn = document.createElement("button");
  menuBtn.className = "mobile-menu-btn";
  menuBtn.innerHTML = "☰";
  menuBtn.onclick = () => {
    document.querySelector(".sidebar").classList.toggle("open");
  };
  document.body.appendChild(menuBtn);

  // 侧边栏
  const sidebar = document.createElement("aside");
  sidebar.className = "sidebar";

  // 头部
  const header = document.createElement("div");
  header.className = "sidebar-header";
  header.innerHTML = `
    <div class="sidebar-logo">
      <div class="logo-icon">¥</div>
      <div>
        <div class="logo-text">百万工作台</div>
        <div class="logo-subtext">1年100万目标管控</div>
      </div>
    </div>
    <div class="sidebar-user">
      <div class="avatar">耶</div>
      <div class="user-info">
        <div class="name">Yezi1-1</div>
        <div class="role">独立创业者</div>
      </div>
    </div>
  `;
  sidebar.appendChild(header);

  // 导航链接（按分组）
  const nav = document.createElement("nav");
  nav.className = "sidebar-nav";
  let lastSection = "";
  NAV_ITEMS.forEach((item, i) => {
    if (item.section !== lastSection) {
      const label = document.createElement("div");
      label.className = "nav-section-label";
      label.textContent = item.section;
      nav.appendChild(label);
      lastSection = item.section;
    }
    const a = document.createElement("a");
    a.className = "sidebar-link" + (i === activeIndex ? " active" : "");
    a.href = item.href;
    a.innerHTML = `<span class="nav-icon">${item.icon}</span><span>${item.label}</span>`;
    a.onclick = (e) => {
      // 移动端点击后关闭侧边栏
      if (window.innerWidth <= 768) {
        sidebar.classList.remove("open");
      }
    };
    nav.appendChild(a);
  });
  sidebar.appendChild(nav);

  // 底部状态
  const footer = document.createElement("div");
  footer.className = "sidebar-footer";
  footer.innerHTML = `
    <div class="status-row">
      <span class="status-dot"></span>
      <span>系统运行中</span>
      <span style="margin-left:auto;" id="nav-time"></span>
    </div>
    <div class="progress-mini">
      <div class="label">
        <span>目标进度</span>
        <span class="pct">38.4%</span>
      </div>
      <div class="progress-bar"><div class="progress-fill" style="width:38.4%;"></div></div>
    </div>
    <div style="margin-top:8px; font-size:11px; color:var(--text-muted);">
      今日收入 <span class="text-gold">¥1,860</span> · 连续打卡 <span class="text-gold">23天</span>
    </div>
  `;
  sidebar.appendChild(footer);

  document.body.appendChild(sidebar);

  // 遮罩层
  const overlay = document.createElement("div");
  overlay.className = "sidebar-overlay";
  overlay.onclick = () => sidebar.classList.remove("open");
  document.body.appendChild(overlay);

  // 实时时间
  function updateTime() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, "0");
    const mi = String(now.getMinutes()).padStart(2, "0");
    const el = document.getElementById("nav-time");
    if (el) el.textContent = `${h}:${mi}`;
  }
  updateTime();
  setInterval(updateTime, 1000);
}

// 货币格式化
function formatMoney(num) {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + "万";
  }
  return "¥" + num.toLocaleString();
}

// 百分比
function formatPercent(num) {
  return num.toFixed(1) + "%";
}

// 简易柱状图（Canvas）
function drawBarChart(canvasId, labels, data, color = "#d4af37") {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.offsetWidth;
  const h = canvas.offsetHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.scale(dpr, dpr);

  const padding = { top: 20, right: 20, bottom: 30, left: 50 };
  const chartW = w - padding.left - padding.right;
  const chartH = h - padding.top - padding.bottom;

  const maxVal = Math.max(...data) * 1.15;
  const barW = chartW / data.length * 0.6;
  const gap = chartW / data.length * 0.4;

  // 网格线
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padding.top + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(w - padding.right, y);
    ctx.stroke();
    // Y轴标签
    const val = maxVal - (maxVal / 4) * i;
    ctx.fillStyle = "#666";
    ctx.font = "11px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(formatMoney(val), padding.left - 8, y + 4);
  }

  // 柱子
  data.forEach((val, i) => {
    const x = padding.left + (chartW / data.length) * i + gap / 2;
    const barH = (val / maxVal) * chartH;
    const y = padding.top + chartH - barH;

    const grad = ctx.createLinearGradient(0, y, 0, padding.top + chartH);
    grad.addColorStop(0, color);
    grad.addColorStop(1, "rgba(212,175,55,0.2)");
    ctx.fillStyle = grad;

    // 圆角矩形
    ctx.beginPath();
    const r = 4;
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + barW - r, y);
    ctx.quadraticCurveTo(x + barW, y, x + barW, y + r);
    ctx.lineTo(x + barW, padding.top + chartH);
    ctx.lineTo(x, padding.top + chartH);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.fill();

    // 数值
    ctx.fillStyle = "#a0a0a0";
    ctx.font = "11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(formatMoney(val), x + barW / 2, y - 6);

    // X轴标签
    ctx.fillStyle = "#666";
    ctx.font = "11px sans-serif";
    ctx.fillText(labels[i], x + barW / 2, h - 10);
  });
}

// 简易折线图（Canvas）
function drawLineChart(canvasId, labels, data, color = "#d4af37") {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.offsetWidth;
  const h = canvas.offsetHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.scale(dpr, dpr);

  const padding = { top: 20, right: 20, bottom: 30, left: 50 };
  const chartW = w - padding.left - padding.right;
  const chartH = h - padding.top - padding.bottom;
  const maxVal = Math.max(...data) * 1.15;

  // 网格
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padding.top + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(w - padding.right, y);
    ctx.stroke();
    const val = maxVal - (maxVal / 4) * i;
    ctx.fillStyle = "#666";
    ctx.font = "11px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(formatMoney(val), padding.left - 8, y + 4);
  }

  // 线
  const points = data.map((val, i) => ({
    x: padding.left + (chartW / (data.length - 1)) * i,
    y: padding.top + chartH - (val / maxVal) * chartH,
  }));

  // 填充区域
  const grad = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
  grad.addColorStop(0, "rgba(212,175,55,0.2)");
  grad.addColorStop(1, "rgba(212,175,55,0)");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(points[0].x, padding.top + chartH);
  points.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(points[points.length - 1].x, padding.top + chartH);
  ctx.closePath();
  ctx.fill();

  // 线条
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  points.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
  ctx.stroke();

  // 数据点
  points.forEach((p, i) => {
    ctx.fillStyle = "#0a0a0a";
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  // X轴标签
  ctx.fillStyle = "#666";
  ctx.font = "11px sans-serif";
  ctx.textAlign = "center";
  labels.forEach((label, i) => {
    ctx.fillText(label, points[i].x, h - 10);
  });
}

// 环形进度图
function drawRingChart(canvasId, percent, color = "#d4af37", label = "") {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const size = canvas.offsetWidth;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  ctx.scale(dpr, dpr);

  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 20;
  const lineWidth = 12;

  // 背景圆环
  ctx.strokeStyle = "#2a2a2a";
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();

  // 进度环
  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + (Math.PI * 2 * percent) / 100;
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, color);
  grad.addColorStop(1, "#8a7228");
  ctx.strokeStyle = grad;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(cx, cy, radius, startAngle, endAngle);
  ctx.stroke();

  // 中心文字
  ctx.fillStyle = "#fff";
  ctx.font = "bold 24px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(percent.toFixed(1) + "%", cx, cy - 8);
  ctx.fillStyle = "#666";
  ctx.font = "12px sans-serif";
  ctx.fillText(label, cx, cy + 16);
}
