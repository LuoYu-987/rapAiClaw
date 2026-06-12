---
name: mcp-version-check
description: Check local MCP service source versions against the RpaAiClaw documentation site release versions, update changed MCP version docs, and publish the docs site to GitHub Pages. Use when Codex needs to scan D:\DevEnvironment\Project\RPA\MCP for package/Cargo/pyproject versions, compare them with docs/releases/mcp*.md, or prepare MCP service version documentation before publishing.
---

# MCP Version Check

## Workflow

1. Run `node .skills/mcp-version-check/scripts/check-mcp-versions.js` from the docs project root.
2. Treat `D:\DevEnvironment\Project\RPA\MCP` as the source of truth for local MCP versions.
3. Update `docs/releases/mcp-services.md` and the matching `docs/releases/mcp/*.md` only for services whose source version is newer than the documented version.
4. If a service has a public management page with a concrete current-version row, update that row as well.
5. Preserve unrelated existing document edits.
6. Build and publish with SSH when GitHub HTTPS is unavailable:

```powershell
$env:RPA_PAGE_REPO_GIT_URL='git@github.com:LuoYu-987/rapAiClaw.git'; npm run release:page
```

## Service Map

| Source directory | Service name | Release doc |
| --- | --- | --- |
| `desktopMcp` | Desktop MCP | `docs/releases/mcp/desktop.md` |
| `applicationMcp` | Application MCP | `docs/releases/mcp/application.md` |
| `ocrMcp` | OCR MCP | `docs/releases/mcp/ocr.md` |
| `verificationCodeMcp` | Verification Code MCP | `docs/releases/mcp/verification.md` |
| `chromeBrowser` | Browser MCP | `docs/releases/mcp/browser.md` |
| `SeleniumBrowserMcp` | Selenium Browser MCP | `docs/releases/mcp/selenium-browser.md` |
| `playwrightBrowserMcp` | Playwright Browser MCP | `docs/releases/mcp/playwright-browser.md` |
| `pyMcp` | Python MCP | `docs/releases/mcp/python.md` |
| `nodeMcp` | Node MCP | `docs/releases/mcp/node.md` |
| `mobileMcp` | Mobile MCP | `docs/releases/mcp/mobile.md` |
| `cppMcp` | C++ MCP | `docs/releases/mcp/cpp.md` |
| `wechatBridgeMcp` | Wechat Bridge MCP | `docs/releases/mcp/wechat-bridge.md` |
| `testMcpRust` | Test MCP Example | `docs/releases/mcp/test-example.md` |

`Browser Extension MCP` and `Modular Tools` do not currently map to directories under `D:\DevEnvironment\Project\RPA\MCP`; leave their documented versions unchanged unless a source directory is added.

## Version Sources

Prefer versions in this order for each service:

1. Root `package.json` `version`
2. Root `Cargo.toml` `package.version`
3. Root `pyproject.toml` `project.version`

If multiple root files exist, they should match. Investigate before publishing if they differ.
