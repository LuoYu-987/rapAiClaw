# Wechat Bridge MCP 版本更新说明

## 版本信息
| 字段 | 内容 |
| --- | --- |
| 版本号 | 0.0.12 |
| 服务定位 | 微信桥接服务 |
| 下载地址 | [wechat-bridge-mcp-v0.0.12-windows-x86_64.zip](https://gitee.com/luoyu250zh/wechat-bridge/releases/download/v0.0.12/wechat-bridge-mcp-v0.0.12-windows-x86_64.zip) |
| SHA256 | `aee0378deb80a647c1b611724a08491dd42e49e79287d1c62dba7b0991f251a7` |
| 包大小 | 15.32 MB |

## 当前版本说明

- 发布微信连接器 MCP 0.0.12，固化生产环境扫码和授权恢复修复。
- 修复生产打包后 OpenClaw 微信插件文件被解析到 `C:\snapshot\dist-ncc\dist\src\auth\login-qr.js`，导致扫码登录失败的问题。
- 修复 `Wechat-Bridge-Authorize` 恢复授权时提前加载微信插件资源，导致缺少插件目录时报错的问题。
- 微信插件资源随独立 MCP 发布包分发，并在打包阶段应用独立运行补丁，避免生产环境依赖 OpenClaw 主程序资源目录。
- 修复打包后扫码登录响应中二维码字段解析不兼容的问题。
- 兼容 `qrcodeUrl`、`qrcode_img_content`、`qrCodeUrl`、`qrcode_url` 等返回字段。
- 前端连接页同步增强二维码字段解析，降低插件返回结构变化对扫码显示的影响。

## 后续记录项

- 新增微信桥接或会话辅助能力
- 连接稳定性和状态同步优化
- 登录状态和错误提示修复
- 微信版本兼容性变化
- 升级提醒









