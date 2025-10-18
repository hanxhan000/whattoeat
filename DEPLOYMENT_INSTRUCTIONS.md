# 部署说明

## 本地测试
1. 确保已安装Node.js和npm
2. 在项目根目录运行以下命令：
   ```
   npm install
   npm run dev
   ```
3. 在浏览器中访问 http://localhost:5173/whattoeat/ 查看应用

## 构建生产版本
运行以下命令构建生产版本：
```
npm run build
```
构建后的文件将位于 `dist` 目录中。

## 部署到GitHub Pages
由于网络问题，如果无法直接推送，可以手动部署：

1. 构建项目：
   ```
   npm run build
   ```

2. 复制 `dist` 目录中的所有文件到 `h5-gh-pages` 目录

3. 在 `h5-gh-pages` 目录中提交更改：
   ```
   git add .
   git commit -m "Deploy new version"
   ```

4. 推送到GitHub：
   ```
   git push origin gh-pages
   ```

## 应用功能说明
- 首页：显示应用标题和导航
- 点餐页：选择菜品并提交订单
- 食谱页：查看未来7天的食谱计划

## 简化版本说明
此版本已简化框架，移除了复杂的后端模拟，使用本地数据存储，确保应用能正常运行且易于部署。