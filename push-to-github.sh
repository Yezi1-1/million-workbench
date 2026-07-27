#!/bin/bash
# ==========================================
# 一键推送百万搞钱工作台到 GitHub
# 用户名：Yezi1-1
# ==========================================

echo "🚀 开始推送百万搞钱工作台到 GitHub..."
echo ""

# 进入工作台目录（修改为你本地的实际路径）
cd /workspace  # ← 如果路径不同，改成你下载的文件夹路径

# 添加远程仓库
git remote remove origin 2>/dev/null
git remote add origin https://github.com/Yezi1-1/million-workbench.git

# 推送到 GitHub
git branch -M main
git push -u origin main

echo ""
echo "=========================================="
if [ $? -eq 0 ]; then
  echo "✅ 推送成功！"
  echo ""
  echo "📦 仓库地址：https://github.com/Yezi1-1/million-workbench"
  echo ""
  echo "下一步：开启 GitHub Pages"
  echo "1. 打开上面的仓库地址"
  echo "2. 点 Settings → Pages"
  echo "3. Source 选 main / (root)"
  echo "4. 点 Save"
  echo "5. 等1分钟，访问："
  echo "   https://yezi1-1.github.io/million-workbench/"
  echo "=========================================="
else
  echo "❌ 推送失败，请检查："
  echo "1. 是否已在 GitHub 创建仓库 million-workbench"
  echo "2. GitHub 登录是否正常"
  echo "3. 网络是否正常"
fi
