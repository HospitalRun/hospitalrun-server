#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const util_1 = require("util");
const sade_1 = __importDefault(require("sade"));
const typescript_1 = __importDefault(require("typescript"));
const require_from_string_1 = __importDefault(require("require-from-string"));
const glob_1 = __importDefault(require("glob"));
const mkdirp_1 = __importDefault(require("mkdirp"));
const stat = util_1.promisify(fs_1.default.stat);
const readFile = util_1.promisify(fs_1.default.readFile);
const writeFile = util_1.promisify(fs_1.default.writeFile);
const glob = util_1.promisify(glob_1.default);
const prog = sade_1.default('ddoc');
prog.version('0.1.0');
prog
    .command('build <src>', 'Build design document(s) from TypeScript soruce directory or file.', {
    default: true,
})
    .option('-c, --config', 'Provide path to custom tsconfig.json', './tsconfig.json')
    .example('build src/db/designs')
    .example('build src/db/designs/patient.ts -c src/db/tsconfig.json')
    .action(async (src, opts) => {
    var _a;
    try {
        const cwd = process.cwd();
        const tsconfigPath = path_1.default.isAbsolute(opts.config) ? opts.config : path_1.default.join(cwd, opts.config);
        console.log(`> using ${tsconfigPath} config`);
        const tsconfig = require(tsconfigPath);
        src = path_1.default.isAbsolute(src) ? path_1.default.normalize(src) : path_1.default.join(cwd, src);
        const srcStats = await stat(src);
        let dest = ((_a = tsconfig === null || tsconfig === void 0 ? void 0 : tsconfig.compilerOptions) === null || _a === void 0 ? void 0 : _a.outDir) ? path_1.default.join(path_1.default.dirname(tsconfigPath), tsconfig.compilerOptions.outDir)
            : '';
        let ddocs;
        if (srcStats.isDirectory()) {
            dest = dest || src;
            ddocs = await glob(path_1.default.join(src, '**/*.ts'));
        }
        else {
            dest = dest || path_1.default.dirname(src);
            ddocs = [src];
        }
        console.log(`> src directory is ${src}`);
        await mkdirp_1.default(dest);
        console.log(`> destination directory is ${dest}`);
        const errors = [];
        await Promise.all(ddocs.map(async (srcPath) => {
            try {
                const sourceFile = (await readFile(srcPath)).toString();
                const output = typescript_1.default.transpileModule(sourceFile, tsconfig);
                const ddoc = require_from_string_1.default(output.outputText);
                const filename = path_1.default.basename(srcPath, '.ts');
                const stringifiedDesign = JSON.stringify(ddoc, (_, val) => {
                    if (typeof val === 'function') {
                        return val.toString();
                    }
                    return val;
                }, 1);
                await writeFile(path_1.default.join(dest, `${filename}.json`), stringifiedDesign);
            }
            catch (err) {
                errors.push(err);
            }
        }));
        if (errors.length > 0) {
            errors.forEach(err => {
                console.error(err);
            });
            throw new Error(`Compilation failed. Resolve errors in your code and try again.`);
        }
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
});
prog.parse(process.argv);
