#!/usr/bin/env bash
# rename-kebab.sh
# Simplified: rename directories and files to kebab/lowercase.
# - Folders: "Box"     -> "box"
# - Files:   "Box.tsx" -> "box.tsx"
# - Others:  "FooBar.js" -> "foo-bar.js"  (basename kebab; extension preserved as-is)
# No Git usage. Handles duplicates by merging dirs and suffixing file conflicts.
#
# Usage:
#   ./rename-kebab.sh                # from project root
#   ./rename-kebab.sh path1 path2    # limit to specific roots
#   DRY_RUN=true ./rename-kebab.sh   # preview without changes

set -euo pipefail
DRY_RUN="${DRY_RUN:-false}"

node --input-type=module <<'NODE'
import fs from 'node:fs'
import path from 'node:path'

/* ---------- config & utils ---------- */
const args = process.env.SCRIPT_ARGS ? process.env.SCRIPT_ARGS.split(' ') : ['.']
const DRY = (process.env.DRY_RUN || 'false').toLowerCase() === 'true'
const CWD = process.cwd()
const IGNORED_TOP = new Set(['.git','node_modules','dist','build','.next','out','coverage','.turbo','.cache'])

const toPosix = p => p.split(path.sep).join('/')
const rel = p => toPosix(path.relative(CWD, p))
const exists = p => { try { fs.lstatSync(p); return true } catch { return false } }
const isDir = p => { try { return fs.lstatSync(p).isDirectory() } catch { return false } }
const isFile = p => { try { return fs.lstatSync(p).isFile() } catch { return false } }

/* ---------- walk current tree ---------- */
function walkRoots(roots) {
  const seenDirs = new Set(), seenFiles = new Set()
  for (const r of roots) {
    if (!exists(r)) continue
    const abs = path.resolve(r)
    if (isFile(abs)) { seenFiles.add(rel(abs)); continue }
    const stack = [abs]
    while (stack.length) {
      const d = stack.pop()
      const base = path.basename(d)
      if (IGNORED_TOP.has(base)) continue
      seenDirs.add(rel(d))
      for (const ent of fs.readdirSync(d, { withFileTypes:true })) {
        const p = path.join(d, ent.name)
        if (ent.isDirectory()) stack.push(p)
        else if (ent.isFile()) seenFiles.add(rel(p))
      }
    }
  }
  // sort: dirs deepest-first (for renaming), files deepest-first
  const dirs = [...seenDirs].filter(Boolean).sort((a,b)=> b.split('/').length - a.split('/').length)
  const files = [...seenFiles].sort((a,b)=> b.split('/').length - a.split('/').length)
  return { dirs, files }
}

/* ---------- kebab helpers ---------- */
function splitBaseExt(name) {
  const lower = name.toLowerCase()
  if (lower.endsWith('.d.ts')) return [name.slice(0,-5), '.d.ts'] // ".d.ts" is 5 chars
  const ext = path.extname(name)
  return ext ? [name.slice(0,-ext.length) || name, ext] : [name, '']
}
function kebabify(seg) {
  let s = seg.replace(/[_\s]+/g, '-')
  s = s.replace(/([a-z0-9])([A-Z])/g, '$1-$2')                  // camel → dash
  s = s.replace(/([A-Z]+)([A-Z][a-z0-9]+)/g, '$1-$2')           // ABCDef → ABC-Def
  s = s.replace(/-+/g, '-').replace(/\.+/g, '-')                // collapse runs
  return s.toLowerCase()
}
function kebabDirPath(relPath) {
  return relPath.split('/').filter(Boolean).map(kebabify).join('/')
}
function kebabFilePath(relPath) {
  const parts = relPath.split('/').filter(Boolean)
  const file = parts.pop() || ''
  const [base, ext] = splitBaseExt(file)
  return [...parts.map(kebabify), `${kebabify(base)}${ext}`].join('/')
}

/* ---------- conflict-safe renamers ---------- */
function samePathCaseInsensitive(a,b){ return path.resolve(a).toLowerCase() === path.resolve(b).toLowerCase() }
function ensureParent(p){ fs.mkdirSync(path.dirname(p), { recursive:true }) }

function nextConflictPath(dstAbs) {
  const dir = path.dirname(dstAbs)
  const name = path.basename(dstAbs)
  const [base, ext] = splitBaseExt(name)
  let i = 1
  while (true) {
    const cand = path.join(dir, `${base}__dup${i}${ext}`)
    if (!exists(cand)) return cand
    i++
  }
}

function moveFileOrSuffix(srcAbs, dstAbs) {
  if (samePathCaseInsensitive(srcAbs, dstAbs)) {
    // case-only change → two-step
    const mid = path.join(path.dirname(srcAbs), `.__case_tmp__${Date.now()}_${Math.random().toString(36).slice(2)}`)
    fs.renameSync(srcAbs, mid); fs.renameSync(mid, dstAbs); return [rel(srcAbs), rel(dstAbs)]
  }
  if (exists(dstAbs)) dstAbs = nextConflictPath(dstAbs)
  ensureParent(dstAbs); fs.renameSync(srcAbs, dstAbs)
  return [rel(srcAbs), rel(dstAbs)]
}

function mergeDirInto(srcAbs, dstAbs, logs) {
  // merge contents of src into dst (recursively); suffix files on conflict
  for (const ent of fs.readdirSync(srcAbs, { withFileTypes:true })) {
    const s = path.join(srcAbs, ent.name)
    const d = path.join(dstAbs, ent.name)
    if (ent.isDirectory()) {
      if (!exists(d)) { if (!DRY) fs.mkdirSync(d, { recursive:true }); logs.push(`📁 ${rel(s)} -> ${rel(d)}`) }
      mergeDirInto(s, d, logs)
    } else if (ent.isFile()) {
      const [from,to] = DRY ? [rel(s), rel(exists(d) ? nextConflictPath(d) : d)]
                            : moveFileOrSuffix(s, exists(d) ? nextConflictPath(d) : d)
      logs.push(`➡️ ${from} -> ${to}`)
    }
  }
  if (!DRY) { try { fs.rmdirSync(srcAbs) } catch {} }
}

function renameDirSafe(srcRel, dstRel, logs) {
  if (srcRel === dstRel) return
  const srcAbs = path.resolve(srcRel)
  if (!exists(srcAbs)) return
  const dstAbs = path.resolve(dstRel)

  if (DRY) {
    if (!exists(dstAbs)) logs.push(`📁 (dry-run) ${rel(srcAbs)} -> ${rel(dstAbs)}`)
    else logs.push(`📦 (dry-run merge) ${rel(srcAbs)} -> ${rel(dstAbs)}`)
    return
  }

  ensureParent(dstAbs)
  if (samePathCaseInsensitive(srcAbs, dstAbs)) {
    const mid = path.join(path.dirname(srcAbs), `.__case_tmp__${Date.now()}_${Math.random().toString(36).slice(2)}`)
    fs.renameSync(srcAbs, mid); fs.renameSync(mid, dstAbs)
    logs.push(`📁 ${rel(srcAbs)} -> ${rel(dstAbs)}`)
    return
  }

  if (!exists(dstAbs)) {
    fs.renameSync(srcAbs, dstAbs)
    logs.push(`📁 ${rel(srcAbs)} -> ${rel(dstAbs)}`)
  } else {
    // merge
    mergeDirInto(srcAbs, dstAbs, logs)
  }
}

function renameFileSafe(srcRel, dstRel, logs) {
  if (srcRel === dstRel) return
  const srcAbs = path.resolve(srcRel)
  if (!exists(srcAbs)) return
  const dstAbs = path.resolve(dstRel)

  if (DRY) {
    const shownDst = exists(dstAbs) ? rel(nextConflictPath(dstAbs)) : rel(dstAbs)
    logs.push(`➡️ (dry-run) ${rel(srcAbs)} -> ${shownDst}`)
    return
  }

  const [from,to] = moveFileOrSuffix(srcAbs, dstAbs)
  logs.push(`➡️ ${from} -> ${to}`)
}

/* ---------- main flow ---------- */
const roots = args.length ? args : ['.']

// 1) rename directories to kebab (deepest-first) with merging
{
  const logs = []
  const { dirs } = walkRoots(roots)
  const plan = []
  for (const d of dirs) {
    const dst = kebabDirPath(d)
    if (dst !== d) plan.push([d, dst])
  }
  for (const [src,dst] of plan) renameDirSafe(src, dst, logs)
  logs.forEach(l=>console.log(l))
}

// 2) rename files to kebab basenames (re-scan after dir changes)
{
  const logs = []
  const { files } = walkRoots(roots)
  const plan = []
  for (const f of files) {
    const dst = kebabFilePath(f)
    if (dst !== f) plan.push([f, dst])
  }
  for (const [src,dst] of plan) renameFileSafe(src, dst, logs)
  logs.forEach(l=>console.log(l))
}

console.log(`✅ Done${DRY?' (dry-run)':''}.`)
NODE
