// 百万搞钱工作台 - 共享脚本

// 顶部导航配置
const NAV_ITEMS = [
  { label: "总仪表盘", href: "index.html", icon: "📊" },
  { label: "赛道规划", href: "tracks.html", icon: "🎯" },
  { label: "财务记账", href: "finance.html", icon: "💰" },
  { label: "客户CRM", href: "crm.html", icon: "👥" },
  { label: "每日打卡", href: "daily.html", icon: "✅" },
  { label: "月度复盘", href: "review.html", icon: "📈" },
  { label: "资源库", href: "resources.html", icon: "📚" },
];

// 渲染顶部导航
function renderNav(activeIndex) {
  const nav = document.createElement("nav");
  nav.className = "top-nav";

  const logo = document.createElement("div");
  logo.className = "nav-logo";
  logo.innerHTML = `<span class="logo-icon">¥</span>百万工作台`;
  nav.appendChild(logo);

  const links = document.createElement("div");
  links.className = "nav-links";
  NAV_ITEMS.forEach((item, i) => {
    const a = document.createElement("a");
    a.className = "nav-link" + (i === activeIndex ? " active" : "");
    a.href = item.href;
    a.textContent = item.label;
    links.appendChild(a);
  });
  nav.appendChild(links);

  const time = document.createElement("div");
  time.className = "nav-time";
  time.id = "nav-time";
  nav.appendChild(time);

  document.body.insertBefore(nav, document.body.firstChild);

  // 实时时间
  function updateTime() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    const h = String(now.getHours()).padStart(2, "0");
    const mi = String(now.getMinutes()).padStart(2, "0");
    const s = String(now.getSeconds()).padStart(2, "0");
    document.getElementById("nav-time").textContent = `${y}.${m}.${d} ${h}:${mi}:${s}`;
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
