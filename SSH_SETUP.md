# SSH密钥设置指南

为了通过SSH推送代码到GitHub，您需要生成SSH密钥并将其添加到GitHub账户。

## 步骤1：生成SSH密钥

在Windows PowerShell中运行以下命令：

```powershell
ssh-keygen -t ed25519 -C "114579298@qq.com"
```

按提示操作：
1. 当提示"Enter file in which to save the key"时，直接按回车使用默认位置
2. 当提示输入密码时，可以留空或设置一个安全密码

## 步骤2：启动ssh-agent

```powershell
Get-Service -Name ssh-agent | Set-Service -StartupType Manual
Start-Service ssh-agent
```

## 步骤3：添加SSH私钥到ssh-agent

```powershell
ssh-add ~/.ssh/id_ed25519
```

## 步骤4：复制公钥

```powershell
cat ~/.ssh/id_ed25519.pub
```

复制输出的内容。

## 步骤5：将SSH密钥添加到GitHub

1. 登录到GitHub
2. 点击右上角的头像，选择"Settings"
3. 在左侧菜单中选择"SSH and GPG keys"
4. 点击"New SSH key"
5. 在"Title"字段中输入一个描述性名称，如"Windows Laptop"
6. 在"Key"字段中粘贴您之前复制的公钥
7. 点击"Add SSH key"

## 步骤6：测试SSH连接

```powershell
ssh -T git@github.com
```

如果看到类似以下消息，说明连接成功：
```
Hi hanxhan000! You've successfully authenticated, but GitHub does not provide shell access.
```

## 步骤7：推送代码

现在您可以推送代码到GitHub：

```bash
git push -u origin main
```