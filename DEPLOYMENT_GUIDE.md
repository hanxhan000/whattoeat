# 🚀 GitHub Pages 部署指南

## 方法1: 使用GitHub Actions自动部署 (推荐)

### 步骤1: 创建GitHub仓库
1. 在GitHub上创建一个新仓库，命名为 `whattoeat`
2. 将本地代码推送到GitHub：

```bash
# 添加远程仓库 (替换yourusername为你的GitHub用户名)
git remote add origin https://github.com/yourusername/whattoeat.git

# 推送代码
git push -u origin master
```

### 步骤2: 启用GitHub Pages
1. 进入仓库的 Settings 页面
2. 滚动到 "Pages" 部分
3. 在 "Source" 下选择 "GitHub Actions"
4. 保存设置

### 步骤3: 自动部署
- 每次推送到 `master` 分支时，GitHub Actions会自动构建并部署
- 部署完成后，访问 `https://yourusername.github.io/whattoeat/`

## 方法2: 手动部署

### 使用PowerShell脚本
```powershell
# 在项目根目录运行
.\deploy.ps1
```

### 手动步骤
```bash
# 1. 构建项目
cd h5
npm run build

# 2. 创建gh-pages分支
git checkout --orphan gh-pages
git rm -rf .

# 3. 复制构建产物
cp -r h5/dist/* .

# 4. 提交并推送
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages

# 5. 切换回主分支
git checkout master
```

## 方法3: 使用GitHub CLI

```bash
# 安装GitHub CLI后
gh repo create whattoeat --public
gh pages deploy h5/dist --branch gh-pages
```

## 🔧 配置说明

### 重要配置项
- **base路径**: `/whattoeat/` (在vite.config.ts中配置)
- **路由模式**: history模式 (适配GitHub Pages)
- **PWA配置**: 完整的manifest.json配置

### 自定义域名
如果需要使用自定义域名，在仓库根目录创建 `CNAME` 文件：
```
yourdomain.com
```

## 🐛 常见问题

### 1. 页面404错误
- 确保base路径配置正确
- 检查GitHub Pages设置

### 2. 资源加载失败
- 检查相对路径配置
- 确保所有静态资源都在public目录

### 3. 路由不工作
- 确保使用history模式
- 检查GitHub Pages的404重定向配置

## 📱 测试部署

部署完成后，测试以下功能：
- [ ] 首页正常加载
- [ ] 路由跳转正常
- [ ] 移动端适配
- [ ] PWA功能
- [ ] 所有页面功能正常

---

**注意**: 首次部署可能需要几分钟时间，请耐心等待。
