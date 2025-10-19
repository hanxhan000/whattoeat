# 今天吃什么 - 家庭智能点餐系统

一个基于Vue 3 + TypeScript + Vant的移动端家庭点餐应用。

## 🚀 功能特性

- 📱 移动端优先设计，支持PWA
- 🍽️ 智能菜品分类和点餐
- 📅 7天食谱规划
- 💾 本地数据存储
- 🎨 现代化UI设计
- ⚡ 高性能和快速响应

## 🛠️ 技术栈

- **前端框架**: Vue 3 + TypeScript
- **UI组件库**: Vant 4
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **构建工具**: Vite
- **样式**: CSS3 + 响应式设计

## 📦 项目结构

```
├── h5/                    # 前端应用
│   ├── src/
│   │   ├── components/    # 组件
│   │   ├── pages/         # 页面
│   │   ├── stores/        # 状态管理
│   │   ├── router/        # 路由配置
│   │   └── utils/         # 工具函数
│   ├── public/            # 静态资源
│   └── dist/              # 构建产物
└── docs/                  # 项目文档
```

## 🚀 快速开始

### 环境要求

- Node.js >= 16
- npm >= 8

### 安装依赖

```bash
cd h5
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 🌐 部署到GitHub Pages

### 方法1: 自动部署 (推荐)

1. 将代码推送到GitHub仓库
2. 在仓库设置中启用GitHub Pages
3. 选择gh-pages分支作为源
4. 访问 `https://yourusername.github.io/whattoeat/`

### 方法2: 手动部署

```bash
# 构建项目
cd h5
npm run build

# 复制dist目录内容到gh-pages分支
# 推送到GitHub
```

## 📱 使用说明

1. **首页**: 查看今日汇总和快捷功能
2. **点餐**: 选择日期和餐次，浏览菜品并添加到购物车
3. **食谱**: 查看未来7天的食谱规划

## 🔧 配置说明

- 应用基础路径: `/whattoeat/`
- 支持旧版浏览器兼容
- PWA配置完整
- 响应式设计适配各种屏幕

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request！

---

**注意**: 这是一个演示项目，菜品数据为模拟数据。实际使用时需要连接后端API。
