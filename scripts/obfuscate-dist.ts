import { join, resolve } from 'node:path'
import { readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import JavaScriptObfuscator from 'javascript-obfuscator'
import { obfuscatorOptions } from './obfuscator.options'

const relDist = process.argv[2] || 'dist'
const distDir = resolve(join(import.meta.dir, '..'), relDist)

async function collectJsFiles(dir: string): Promise<string[]> {
  const out: string[] = []
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, ent.name)
    if (ent.isDirectory()) out.push(...(await collectJsFiles(p)))
    else if (ent.name.endsWith('.js')) out.push(p)
  }
  return out
}

if (!existsSync(distDir)) {
  console.error(`[obfuscate] 缺少 ${relDist}，请先 vite build`)
  process.exit(1)
}

const files = await collectJsFiles(distDir)
if (!files.length) {
  console.error(`[obfuscate] ${relDist} 内无 .js 文件`)
  process.exit(1)
}

for (const file of files) {
  const code = await Bun.file(file).text()
  const result = JavaScriptObfuscator.obfuscate(code, obfuscatorOptions)
  await Bun.write(file, result.getObfuscatedCode())
}

console.log(`[obfuscate] done ← ${files.length} files in ${relDist}/`)
