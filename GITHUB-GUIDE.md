# 📖 如何把工作台上传到 GitHub 并长期使用

> 跟着做，10分钟搞定。完成后你将拥有：
> 1. 代码永久保存在 GitHub
> 2. 免费在线访问网址（手机/电脑都能打开）
> 3. 随时修改、随时更新

---

## 一、注册 GitHub 账号（已有跳过）

访问 [github.com](https://github.com) → 点 `Sign up` → 填邮箱+密码完成注册

---

## 二、在 GitHub 上创建仓库

1. 登录后点右上角 **`+`** → **`New repository`**
2. 填写信息：

| 项目 | 填写内容 |
|------|---------|
| Repository name | `million-workbench`（或任意英文名） |
| Description | `1年百万搞钱工作台` |
| Public / Private | 选 **Public**（免费托管网页必须公开） |
| Initialize | **不要勾选** Add README（本地已有） |

3. 点 **`Create repository`**
4. 创建后会显示仓库地址，形如：
   ```
   https://github.com/你的用户名/million-workbench.git
   ```
   **复制这个地址**，下一步要用。

---

## 三、上传代码到 GitHub

### 方法 A：用 GitHub Desktop（推荐新手）

1. 下载安装 [GitHub Desktop](https://desktop.github.com/)
2. 登录你的 GitHub 账号
3. 点 `File` → `Add local repository`
4. 选择工作台文件夹路径（`/workspace` 对应你本地下载的文件夹）
5. 点 `Publish repository` → 完成

### 方法 B：用命令行（推荐熟悉终端的用户）

```bash
# 1. 进入工作台目录
cd /你的路径/million-workbench

# 2. 关联远程仓库（把下面地址换成你的）
git remote add origin https://github.com/你的用户名/million-workbench.git

# 3. 推送到 GitHub
git branch -M main
git push -u origin main
```

首次推送时会弹出登录窗口，按提示授权即可。

### 方法 C：网页直接上传（最简单）

1. 打开你刚创建的 GitHub 仓库页面
2. 点 `Add file` → `Upload files`
3. 把本地所有文件拖进去（包括 `assets` 文件夹）
4. 填写提交信息 → 点 `Commit changes`

---

## 四、开启 GitHub Pages（免费在线访问）

这一步让你的工作台变成一个**网址**，手机/电脑/平板都能打开。

1. 进入你的仓库页面
2. 点顶部 **`Settings`** 标签
3. 左侧菜单找到 **`Pages`**
4. 在 **`Source`** 下拉框选择：
   - Branch：`main`
   - Folder：`/ (root)`
5. 点 **`Save`**
6. 等待 1-2 分钟，刷新页面，顶部会出现：

   > 🎉 Your site is published at **https://你的用户名.github.io/million-workbench/**

**这就是你的永久网址**，随时随地访问。

---

## 五、长期使用与更新

### 日常更新代码

修改了文件后，重新提交推送即可：

```bash
git add -A
git commit -m "更新说明"
git push
```

推送后 GitHub Pages 会**自动更新**，1-2分钟后刷新网址即可看到最新版。

### 用 GitHub Desktop 更新（更简单）

1. 打开 GitHub Desktop
2. 修改本地文件
3. 左下角填写更新说明 → 点 `Commit to main`
4. 点右上角 `Push origin` → 同步到 GitHub

### 设置自定义域名（可选）

如果你有自己的域名：
1. 仓库根目录创建文件 `CNAME`，内容写你的域名
2. 到域名服务商添加 CNAME 记录指向 `你的用户名.github.io`
3. Settings → Pages → Custom domain 填入域名 → Save

---

## 六、备份与安全建议

| 建议 | 说明 |
|------|------|
| 定期推送 | 每次修改后 push，GitHub 就是你的云备份 |
| 私有副本 | 如果不想公开，可以再建一个 Private 仓库做备份 |
| 导出归档 | GitHub 仓库页面 → Code → Download ZIP，定期下载本地副本 |
| 分支管理 | 大改动时先建 `dev` 分支，测试OK再合并到 `main` |

---

## 七、常见问题

**Q：GitHub Pages 免费吗？会过期吗？**
A：完全免费，不 expire。只要 GitHub 在（它短期内不会消失），你的页面就在。Public 仓库无限免费。

**Q：能不能设密码访问？**
A：GitHub Pages 本身不支持密码。如果需要私密，可以：
- 仓库设为 Private + 使用 GitHub Pro（$4/月）开启 Private Pages
- 或改用 Vercel / Netlify 部署，它们支持免费密码保护

**Q：手机能访问吗？**
A：能。页面是响应式设计，手机浏览器打开网址直接用。

**Q：数据会保存吗？**
A：当前版本数据写死在代码里。如需数据持久化，后续可接入 localStorage 或后端 API。

---

## 快速命令速查

```bash
# 首次上传
git remote add origin https://github.com/用户名/仓库名.git
git branch -M main
git push -u origin main

# 日常更新
git add -A
git commit -m "更新说明"
git push

# 查看状态
git status

# 查看历史
git log --oneline
```

---

完成以上步骤后，你的【1年百万搞钱工作台】就拥有了一个永久在线网址，随时随地可用。
