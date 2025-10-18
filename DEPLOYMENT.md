# GitHub Pages 部署信息（保存）

- GitHub 用户：`hanxhan000`
- 账号邮箱：`114579298@qq.com`
- 仓库名：`whattoeat`
- 站点地址（发布后）：`https://hanxhan000.github.io/whattoeat/`

## 项目配置
- 路由模式：Hash（`createWebHashHistory`），避免 Pages 404。
- Vite `base`：`/whattoeat/`（已在 `vite.config.ts` 设置）。
- Actions 工作流：`/.github/workflows/deploy.yml`，推送到 `main` 自动构建并发布到 `gh-pages`。

## 本地推送步骤
1. 设置用户信息（已在本地配置）：
   ```bash
   git config user.name "hanxhan000"
   git config user.email "114579298@qq.com"
   ```
2. 设置远程：
   ```bash
   git remote set-url origin https://github.com/hanxhan000/whattoeat.git
   ```
3. 推送：
   ```bash
   git push -u origin main
   ```
   如果提示需要登录或网络失败，建议使用以下两种方式之一：
   - 使用 PAT（推荐）：在 GitHub 创建 Personal Access Token（`repo` 权限），然后在推送时用用户名 `hanxhan000` 和 Token 作为密码。
   - 使用 SSH：
     - 生成 SSH Key（Windows PowerShell）：`ssh-keygen -t ed25519 -C "114579298@qq.com"`
     - 将 `~/.ssh/id_ed25519.pub` 的内容粘贴到 GitHub 的 `Settings > SSH and GPG keys`。
     - 更改远程：`git remote set-url origin git@github.com:hanxhan000/whattoeat.git`
     - 推送：`git push -u origin main`

## 发布验证
- 首次推送后，GitHub Actions 会自动执行构建并将产物发布到 `gh-pages` 分支。
- 完成后，访问 `https://hanxhan000.github.io/whattoeat/` 验证：
  - 首页 Hero 与家庭 Logo 显示正常；
  - “今天汇总”显示当天的已选菜品；
  - 进入点餐页，默认餐次根据时间切换（<10 早餐、10–15:59 午餐、≥16 晚餐）。

## 备注
- 如仓库名更改，需要同步修改 `vite.config.ts` 中的 `base`。
- 如需自定义域名，可在 `public` 下添加 `CNAME` 文件并配置 Pages 自定义域。