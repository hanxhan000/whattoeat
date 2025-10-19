# GitHub Pages 部署脚本
# 使用方法: .\deploy.ps1

Write-Host "🚀 开始部署到GitHub Pages..." -ForegroundColor Green

# 检查是否在正确的目录
if (-not (Test-Path "h5")) {
    Write-Host "❌ 错误: 请在项目根目录运行此脚本" -ForegroundColor Red
    exit 1
}

# 进入h5目录
Set-Location h5

# 构建项目
Write-Host "📦 构建项目..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 构建失败" -ForegroundColor Red
    exit 1
}

# 返回根目录
Set-Location ..

# 检查是否存在gh-pages分支
$ghPagesExists = git show-ref --verify --quiet refs/heads/gh-pages
if ($LASTEXITCODE -eq 0) {
    Write-Host "📋 切换到gh-pages分支..." -ForegroundColor Yellow
    git checkout gh-pages
} else {
    Write-Host "📋 创建gh-pages分支..." -ForegroundColor Yellow
    git checkout --orphan gh-pages
    git rm -rf .
}

# 复制构建产物
Write-Host "📁 复制构建产物..." -ForegroundColor Yellow
Copy-Item -Path "h5\dist\*" -Destination "." -Recurse -Force

# 添加文件到Git
git add .

# 提交更改
git commit -m "Deploy to GitHub Pages - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

# 推送到GitHub
Write-Host "🚀 推送到GitHub..." -ForegroundColor Yellow
git push origin gh-pages

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ 部署成功！" -ForegroundColor Green
    Write-Host "🌐 访问地址: https://yourusername.github.io/whattoeat/" -ForegroundColor Cyan
} else {
    Write-Host "❌ 推送失败，请检查网络连接和GitHub配置" -ForegroundColor Red
}

# 切换回主分支
git checkout master

Write-Host "🎉 部署完成！" -ForegroundColor Green
