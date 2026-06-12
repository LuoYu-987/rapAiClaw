#!/usr/bin/env node

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const pageRoot = projectRoot

const DEFAULT_OWNER = 'LuoYu-987'
const DEFAULT_REPO = 'rapAiClaw'
const DEFAULT_BRANCH = 'page'

function parseArgs(argv) {
  return {
    dryRun: argv.includes('--dry-run'),
    skipBuild: argv.includes('--skip-build'),
    keepTemp: argv.includes('--keep-temp'),
  }
}

function exec(command, args, options = {}) {
  const executable = process.platform === 'win32' && command === 'npm' ? 'cmd.exe' : command
  const executableArgs =
    process.platform === 'win32' && command === 'npm'
      ? ['/d', '/s', '/c', ['npm', ...args].join(' ')]
      : args
  try {
    return execFileSync(executable, executableArgs, {
      cwd: options.cwd ?? projectRoot,
      encoding: 'utf8',
      stdio: options.silent ? 'pipe' : 'inherit',
      env: options.env ?? process.env,
    })
  } catch (error) {
    const commandText = [command, ...args].join(' ')
    throw new Error(`命令执行失败: ${commandText}\n${error.message}`)
  }
}

function resolveConfig() {
  const owner = process.env.RPA_PAGE_REPO_OWNER || DEFAULT_OWNER
  const repo = process.env.RPA_PAGE_REPO_NAME || DEFAULT_REPO
  const branch = process.env.RPA_PAGE_REPO_BRANCH || DEFAULT_BRANCH
  const remoteUrl =
    process.env.RPA_PAGE_REPO_GIT_URL ||
    `https://github.com/${owner}/${repo}.git`
  const basePath = process.env.RPA_PAGE_BASE_PATH || `/${repo}/`

  return {
    owner,
    repo,
    branch,
    remoteUrl,
    basePath,
  }
}

function ensurePageProjectReady() {
  const packageJsonPath = path.join(pageRoot, 'package.json')
  const packageLockPath = path.join(pageRoot, 'package-lock.json')
  const docsRoot = path.join(pageRoot, 'docs')
  const workflowPath = path.join(
    pageRoot,
    '.github',
    'workflows',
    'rpa-ai-claw-pages.yml'
  )

  for (const requiredPath of [
    packageJsonPath,
    packageLockPath,
    docsRoot,
    workflowPath,
  ]) {
    if (!fs.existsSync(requiredPath)) {
      throw new Error(`页面发布缺少必要文件: ${requiredPath}`)
    }
  }
}

function buildPage(basePath) {
  console.log(`\n🔨 构建 RpaAiClaw Pages（BASE_PATH=${basePath}）...`)
  exec('npm', ['run', 'build'], {
    cwd: pageRoot,
    env: {
      ...process.env,
      BASE_PATH: basePath,
    },
  })
}

function copyDirectoryContents(sourceDir, targetDir, options = {}) {
  const excludeNames = new Set(options.excludeNames ?? [])
  fs.mkdirSync(targetDir, { recursive: true })

  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    if (excludeNames.has(entry.name)) {
      continue
    }

    const sourcePath = path.join(sourceDir, entry.name)
    const targetPath = path.join(targetDir, entry.name)
    if (entry.isDirectory()) {
      copyDirectoryContents(sourcePath, targetPath, options)
    } else if (entry.isFile()) {
      fs.mkdirSync(path.dirname(targetPath), { recursive: true })
      fs.copyFileSync(sourcePath, targetPath)
    }
  }
}

function removeIfExists(targetPath) {
  fs.rmSync(targetPath, {
    recursive: true,
    force: true,
  })
}

function preparePublishDirectory() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rapAiClaw-page-'))
  const distDir = path.join(pageRoot, 'docs', '.vitepress', 'dist')
  const distIndexPath = path.join(distDir, 'index.html')

  if (!fs.existsSync(distIndexPath)) {
    throw new Error(`构建产物缺少 index.html: ${distIndexPath}`)
  }

  copyDirectoryContents(pageRoot, tempDir, {
    excludeNames: new Set(['.git', 'node_modules']),
  })

  removeIfExists(path.join(tempDir, 'docs', '.vitepress', 'cache'))
  removeIfExists(path.join(tempDir, 'docs', '.vitepress', 'dist'))

  // 分支根目录直接放静态产物，用于 GitHub Pages 的分支根目录发布模式。
  copyDirectoryContents(distDir, tempDir)

  const rootIndexPath = path.join(tempDir, 'index.html')
  const workflowPath = path.join(
    tempDir,
    '.github',
    'workflows',
    'rpa-ai-claw-pages.yml'
  )
  if (!fs.existsSync(rootIndexPath)) {
    throw new Error(`发布目录根部缺少 index.html: ${rootIndexPath}`)
  }
  if (!fs.existsSync(workflowPath)) {
    throw new Error(`发布目录缺少 GitHub Actions workflow: ${workflowPath}`)
  }

  return tempDir
}

function publishToGitHubPagesBranch(tempDir, config, dryRun) {
  const commitMessage = 'docs: publish RpaAiClaw GitHub Pages site'

  console.log(`\n📦 准备发布到 ${config.remoteUrl} (${config.branch})...`)
  exec('git', ['init', '-b', config.branch], { cwd: tempDir })
  exec('git', ['config', 'user.name', 'Codex'], { cwd: tempDir })
  exec('git', ['config', 'user.email', 'codex@local'], { cwd: tempDir })
  exec('git', ['add', '-A'], { cwd: tempDir })
  exec('git', ['commit', '-m', commitMessage], { cwd: tempDir })

  const commitHash = exec('git', ['rev-parse', 'HEAD'], {
    cwd: tempDir,
    silent: true,
  }).trim()

  if (dryRun) {
    console.log('\n🧪 dry-run 模式，仅完成构建和临时提交，不执行 git push')
    return commitHash
  }

  exec('git', ['remote', 'add', 'origin', config.remoteUrl], { cwd: tempDir })
  exec('git', ['push', '--force', 'origin', config.branch], { cwd: tempDir })
  return commitHash
}

function printSummary({ config, commitHash, tempDir, dryRun }) {
  const pageUrl = `https://${config.owner.toLowerCase()}.github.io/${config.repo}/`

  console.log('\n✅ RpaAiClaw Pages 发布流程完成')
  console.log(`   • 仓库: ${config.remoteUrl}`)
  console.log(`   • 分支: ${config.branch}`)
  console.log(`   • 提交: ${commitHash}`)
  console.log(`   • 页面: ${pageUrl}`)
  if (dryRun) {
    console.log(`   • 临时目录: ${tempDir}`)
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  const config = resolveConfig()

  console.log('\n🚀 RpaAiClaw GitHub Pages 发布工具\n')
  ensurePageProjectReady()

  if (!args.skipBuild) {
    buildPage(config.basePath)
  }

  const tempDir = preparePublishDirectory()
  try {
    const commitHash = publishToGitHubPagesBranch(
      tempDir,
      config,
      args.dryRun
    )
    printSummary({
      config,
      commitHash,
      tempDir,
      dryRun: args.dryRun,
    })
  } finally {
    if (!args.keepTemp && !args.dryRun) {
      removeIfExists(tempDir)
    }
  }
}

try {
  main()
} catch (error) {
  console.error(`\n❌ Pages 发布失败: ${error.message}`)
  process.exit(1)
}
