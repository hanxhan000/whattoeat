# 手动部署到GitHub Pages指南

由于网络连接问题，您可以按照以下步骤手动部署应用到GitHub Pages：

## 步骤1：准备部署文件

1. 确保您已在本地成功构建项目：
   ```
   npm run build
   ```

2. 构建后的文件位于 `dist` 目录中

## 步骤2：更新GitHub Pages分支

1. 复制 `dist` 目录中的所有文件到 `h5-gh-pages` 目录：
   - Windows PowerShell命令：
     ```powershell
     xcopy dist\* ..\h5-gh-pages\ /E /Y
     ```

2. 切换到 `h5-gh-pages` 目录：
   ```bash
   cd ../h5-gh-pages
   ```

3. 提交更改：
   ```bash
   git add .
   git commit -m "Deploy new version"
   ```

## 步骤3：推送到GitHub

1. 推送到gh-pages分支：
   ```bash
   git push origin gh-pages
   ```

## 步骤4：配置GitHub Pages

1. 访问您的GitHub仓库：https://github.com/hanxhan000/whattoeat
2. 点击 "Settings" 选项卡
3. 在左侧菜单中找到 "Pages"
4. 在 "Source" 部分选择：
   - Branch: gh-pages
   - Folder: / (root)
5. 点击 "Save" 保存设置

## 步骤5：访问您的应用

部署完成后，您的应用将可以通过以下URL访问：
https://hanxhan000.github.io/whattoeat/

## 故障排除

如果遇到问题，请检查：
1. 确保GitHub Pages已正确配置为使用gh-pages分支
2. 确保所有文件都已正确复制到gh-pages分支
3. 检查GitHub Actions是否有任何错误信息