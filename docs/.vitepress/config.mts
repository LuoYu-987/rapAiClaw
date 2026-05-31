import { defineConfig } from 'vitepress'

const base = process.env.BASE_PATH ?? '/'

const mcpSidebar = [
  { text: '服务总览', link: '/mcp/' },
  { text: 'Desktop MCP', link: '/mcp/desktop' },
  { text: 'Application MCP', link: '/mcp/application' },
  { text: 'OCR MCP', link: '/mcp/ocr' },
  { text: 'Verification Code MCP', link: '/mcp/verification' },
  { text: 'Browser MCP', link: '/mcp/browser' },
  { text: 'Browser Extension MCP', link: '/mcp/browser-extension' },
  { text: 'Selenium Browser MCP', link: '/mcp/selenium-browser' },
  { text: 'Playwright Browser MCP', link: '/mcp/playwright-browser' },
  { text: 'Python MCP', link: '/mcp/python' },
  { text: 'Node MCP', link: '/mcp/node' },
  { text: 'Mobile MCP', link: '/mcp/mobile' },
  { text: 'C++ MCP', link: '/mcp/cpp' },
  { text: 'Wechat Bridge MCP', link: '/mcp/wechat-bridge' },
  { text: 'Modular Tools', link: '/mcp/modular-tools' },
  { text: 'Test MCP Example', link: '/mcp/test-example' },
]

const skillSidebar = [
  { text: '技能库总览', link: '/skills/' },
  { text: '应用业务工具', link: '/skills/application' },
  { text: '浏览器自动化', link: '/skills/browser' },
  { text: '桌面自动化', link: '/skills/desktop' },
  { text: '本地集成 MCP', link: '/skills/local-mcp' },
  { text: '移动端自动化', link: '/skills/mobile' },
  { text: 'OCR 文本识别', link: '/skills/ocr' },
  { text: '自动化扩展运行', link: '/skills/runtime' },
  { text: '验证码识别', link: '/skills/verification' },
  { text: '微信桥接工具', link: '/skills/wechat' },
]

export default defineConfig({
  base,
  lang: 'zh-CN',
  title: 'RpaAiClaw',
  description: 'RpaAiClaw 桌面自动化工作台介绍、功能能力和 MCP 服务说明',
  cleanUrls: true,
  themeConfig: {
    logo: '/images/logo.svg',
    nav: [
      { text: '首页', link: '/' },
      { text: '软件介绍', link: '/software/' },
      { text: 'MCP 服务', link: '/mcp/' },
      { text: '技能库', link: '/skills/' },
      { text: '版本说明', link: '/releases/' },
    ],
    sidebar: {
      '/software/': [
        {
          text: '软件管理',
          items: [
            { text: '软件介绍', link: '/software/' },
            { text: 'RpaAiClaw', link: '/software/rpa-ai-claw' },
          ],
        },
      ],
      '/mcp/': [
        {
          text: 'MCP 服务',
          items: mcpSidebar,
        },
      ],
      '/skills/': [
        {
          text: '技能库',
          items: skillSidebar,
        },
      ],
      '/releases/': [
        {
          text: '版本说明',
          items: [
            { text: '说明总览', link: '/releases/' },
            { text: '软件版本', link: '/releases/software' },
            { text: 'MCP 服务版本', link: '/releases/mcp-services' },
            { text: '技能库版本', link: '/releases/skills' },
          ],
        },
        {
          text: 'MCP 服务版本',
          items: [
            { text: 'Desktop MCP', link: '/releases/mcp/desktop' },
            { text: 'Application MCP', link: '/releases/mcp/application' },
            { text: 'OCR MCP', link: '/releases/mcp/ocr' },
            { text: 'Verification Code MCP', link: '/releases/mcp/verification' },
            { text: 'Browser MCP', link: '/releases/mcp/browser' },
            { text: 'Browser Extension MCP', link: '/releases/mcp/browser-extension' },
            { text: 'Selenium Browser MCP', link: '/releases/mcp/selenium-browser' },
            { text: 'Playwright Browser MCP', link: '/releases/mcp/playwright-browser' },
            { text: 'Python MCP', link: '/releases/mcp/python' },
            { text: 'Node MCP', link: '/releases/mcp/node' },
            { text: 'Mobile MCP', link: '/releases/mcp/mobile' },
            { text: 'C++ MCP', link: '/releases/mcp/cpp' },
            { text: 'Wechat Bridge MCP', link: '/releases/mcp/wechat-bridge' },
            { text: 'Modular Tools', link: '/releases/mcp/modular-tools' },
            { text: 'Test MCP Example', link: '/releases/mcp/test-example' },
          ],
        },
      ],
    },
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索',
            buttonAriaLabel: '搜索',
          },
          modal: {
            displayDetails: '显示详情',
            resetButtonTitle: '清空搜索',
            backButtonTitle: '关闭搜索',
            noResultsText: '没有找到相关内容',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
            },
          },
        },
      },
    },
    outline: {
      label: '页面导航',
      level: [2, 3],
    },
    lastUpdated: {
      text: '最后更新',
    },
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
  },
})

