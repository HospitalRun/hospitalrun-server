#!/usr/bin/env node

import path from 'path'
import fs from 'fs'
import { promisify } from 'util'
import sade from 'sade'
import ts from 'typescript'
import requireFromString from 'require-from-string'
import originalGlob from 'glob'
import mkdirp from 'mkdirp'

const stat = promisify(fs.stat)
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const glob = promisify(originalGlob)

const prog = sade('ddoc')

prog.version('0.1.0')

prog
  .command('build <src>', 'Build design document(s) from TypeScript soruce directory or file.', {
    default: true,
  })
  // .describe('Build design documents from TypeScript soruce directory or file.')
  .option('-c, --config', 'Provide path to custom tsconfig.json', './tsconfig.json')
  .example('build src/db/designs')
  .example('build src/db/designs/patient.ts -c src/db/tsconfig.json')
  .action(async (src, opts) => {
    try {
      const cwd = process.cwd()
      const tsconfigPath = path.isAbsolute(opts.config) ? opts.config : path.join(cwd, opts.config)

      console.log(`> using ${tsconfigPath} config`)
      const tsconfig = require(tsconfigPath) // eslint-disable-line

      src = path.isAbsolute(src) ? path.normalize(src) : path.join(cwd, src) // eslint-disable-line

      const srcStats = await stat(src)
      // use outDir if specified inside tsconfig, otherwise build json alongside ts files
      let dest: string = tsconfig?.compilerOptions?.outDir
        ? path.join(path.dirname(tsconfigPath), tsconfig.compilerOptions.outDir)
        : ''
      let ddocs: string[]
      if (srcStats.isDirectory()) {
        dest = dest || src
        ddocs = await glob(path.join(src, '**/*.ts'))
      } else {
        dest = dest || path.dirname(src)
        ddocs = [src]
      }

      console.log(`> src directory is ${src}`)
      await mkdirp(dest)
      console.log(`> destination directory is ${dest}`)

      const errors: Error[] = []
      await Promise.all(
        ddocs.map(async srcPath => {
          try {
            const sourceFile = (await readFile(srcPath)).toString()
            const output = ts.transpileModule(sourceFile, tsconfig)
            const ddoc = requireFromString(output.outputText)
            const filename = path.basename(srcPath, '.ts')
            const stringifiedDesign = JSON.stringify(
              ddoc,
              (_, val) => {
                if (typeof val === 'function') {
                  return val.toString()
                }
                return val
              },
              1,
            )
            await writeFile(path.join(dest, `${filename}.json`), stringifiedDesign)
          } catch (err) {
            errors.push(err)
          }
        }),
      )
      if (errors.length > 0) {
        errors.forEach(err => {
          console.error(err)
        })
        throw new Error(`Compilation failed. Resolve errors in your code and try again.`)
      }
    } catch (err) {
      console.error(err)
      process.exit(1)
    }
  })

prog.parse(process.argv)
