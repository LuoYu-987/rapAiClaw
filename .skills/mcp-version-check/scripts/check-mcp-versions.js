#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const projectRoot = process.cwd()
const defaultMcpRoot = 'D:\\DevEnvironment\\Project\\RPA\\MCP'
const mcpRoot = process.env.RPA_MCP_ROOT || defaultMcpRoot

const services = [
  ['desktopMcp', 'Desktop MCP', 'docs/releases/mcp/desktop.md'],
  ['applicationMcp', 'Application MCP', 'docs/releases/mcp/application.md'],
  ['ocrMcp', 'OCR MCP', 'docs/releases/mcp/ocr.md'],
  ['verificationCodeMcp', 'Verification Code MCP', 'docs/releases/mcp/verification.md'],
  ['chromeBrowser', 'Browser MCP', 'docs/releases/mcp/browser.md'],
  ['SeleniumBrowserMcp', 'Selenium Browser MCP', 'docs/releases/mcp/selenium-browser.md'],
  ['playwrightBrowserMcp', 'Playwright Browser MCP', 'docs/releases/mcp/playwright-browser.md'],
  ['pyMcp', 'Python MCP', 'docs/releases/mcp/python.md'],
  ['nodeMcp', 'Node MCP', 'docs/releases/mcp/node.md'],
  ['mobileMcp', 'Mobile MCP', 'docs/releases/mcp/mobile.md'],
  ['cppMcp', 'C++ MCP', 'docs/releases/mcp/cpp.md'],
  ['wechatBridgeMcp', 'Wechat Bridge MCP', 'docs/releases/mcp/wechat-bridge.md'],
  ['testMcpRust', 'Test MCP Example', 'docs/releases/mcp/test-example.md'],
]

function readText(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null
}

function parsePackageVersion(serviceRoot) {
  const packageJsonPath = path.join(serviceRoot, 'package.json')
  const text = readText(packageJsonPath)
  if (!text) return null
  return JSON.parse(text).version || null
}

function parseCargoVersion(serviceRoot) {
  const cargoPath = path.join(serviceRoot, 'Cargo.toml')
  const text = readText(cargoPath)
  if (!text) return null
  const match = text.match(/^\s*version\s*=\s*"([^"]+)"/m)
  return match?.[1] || null
}

function parsePyprojectVersion(serviceRoot) {
  const pyprojectPath = path.join(serviceRoot, 'pyproject.toml')
  const text = readText(pyprojectPath)
  if (!text) return null
  const match = text.match(/^\s*version\s*=\s*"([^"]+)"/m)
  return match?.[1] || null
}

function parseDocVersion(docPath) {
  const text = readText(docPath)
  if (!text) return null
  const match = text.match(/\|\s*版本号\s*\|\s*([0-9]+\.[0-9]+\.[0-9]+)\s*\|/)
  return match?.[1] || null
}

function compareVersions(a, b) {
  const left = a.split('.').map(Number)
  const right = b.split('.').map(Number)
  for (let index = 0; index < Math.max(left.length, right.length); index += 1) {
    const diff = (left[index] || 0) - (right[index] || 0)
    if (diff !== 0) return diff
  }
  return 0
}

const rows = services.map(([directory, service, releaseDoc]) => {
  const serviceRoot = path.join(mcpRoot, directory)
  const versions = [
    ['package.json', parsePackageVersion(serviceRoot)],
    ['Cargo.toml', parseCargoVersion(serviceRoot)],
    ['pyproject.toml', parsePyprojectVersion(serviceRoot)],
  ].filter(([, version]) => version)
  const sourceVersion = versions[0]?.[1] || null
  const uniqueVersions = [...new Set(versions.map(([, version]) => version))]
  const docPath = path.join(projectRoot, releaseDoc)
  const docVersion = parseDocVersion(docPath)
  const status =
    !sourceVersion || !docVersion
      ? 'missing'
      : uniqueVersions.length > 1
        ? 'source-version-mismatch'
        : compareVersions(sourceVersion, docVersion) > 0
          ? 'update'
          : 'current'

  return {
    service,
    directory,
    sourceVersion,
    docVersion,
    status,
    versionFiles: versions.map(([file, version]) => `${file}:${version}`).join(', '),
    releaseDoc,
  }
})

console.table(rows)

const needsAttention = rows.filter(row => row.status !== 'current')
if (needsAttention.length) {
  console.log('\nNeeds attention:')
  for (const row of needsAttention) {
    console.log(
      `- ${row.service}: source=${row.sourceVersion || 'n/a'}, docs=${row.docVersion || 'n/a'}, status=${row.status}`
    )
  }
} else {
  console.log('\nAll mapped MCP service versions match the documentation.')
}
