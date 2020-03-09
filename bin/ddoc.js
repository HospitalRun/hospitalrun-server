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
const chalk_1 = __importDefault(require("chalk"));
const stat = util_1.promisify(fs_1.default.stat);
const readFile = util_1.promisify(fs_1.default.readFile);
const writeFile = util_1.promisify(fs_1.default.writeFile);
const unlink = util_1.promisify(fs_1.default.unlink);
const glob = util_1.promisify(glob_1.default);
async function deleteOldDdocs(dest) {
    const oldDdocs = await glob(path_1.default.join(dest, '**/*.json'));
    return Promise.all(oldDdocs.map(file => unlink(file)));
}
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
        console.log(`> ${chalk_1.default.bgBlueBright(chalk_1.default.black(' ddoc build config '))} ${chalk_1.default.cyan(tsconfigPath)}`);
        const tsconfig = require(tsconfigPath);
        src = path_1.default.isAbsolute(src) ? path_1.default.normalize(src) : path_1.default.join(cwd, src);
        let srcStats;
        try {
            srcStats = await stat(src);
        }
        catch (err) {
            if (err.code === 'ENOENT') {
                console.log(chalk_1.default.bgGreen(chalk_1.default.black(`\n ddoc build - No input files found. Done. `)));
                process.exit(0);
            }
            throw err;
        }
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
        console.log(`> ${chalk_1.default.bgBlueBright(chalk_1.default.black(' ddoc build src '))} ${chalk_1.default.cyan(src)}`);
        await mkdirp_1.default(dest);
        await deleteOldDdocs(dest);
        console.log(`> ${chalk_1.default.bgBlueBright(chalk_1.default.black(' ddoc build dest '))} ${chalk_1.default.cyan(dest)}`);
        const errors = [];
        await Promise.all(ddocs.map(async (srcPath) => {
            var _a;
            try {
                const sourceFile = (await readFile(srcPath)).toString();
                const output = typescript_1.default.transpileModule(sourceFile, tsconfig);
                const filename = path_1.default.basename(srcPath, '.ts');
                const ddoc = require_from_string_1.default(output.outputText);
                const stringifiedDesign = JSON.stringify((_a = ddoc.default) !== null && _a !== void 0 ? _a : ddoc, (_, val) => {
                    if (typeof val === 'function') {
                        return val.toString();
                    }
                    return val;
                }, 1);
                await writeFile(path_1.default.join(dest, `${filename}.json`), stringifiedDesign);
            }
            catch (error) {
                errors.push({ file: srcPath, error });
            }
        }));
        if (errors.length > 0) {
            errors.forEach(err => {
                var _a;
                console.log(`\n> ${chalk_1.default.bgRed(chalk_1.default.white(' ddoc build compile error '))} ${chalk_1.default.cyan(err.file)}${(_a = err.error.stack) === null || _a === void 0 ? void 0 : _a.toString()}\n`);
            });
            throw new Error(`ddoc compilation failed. Resolve errors ${errors.length} ${errors.length > 1 ? 'files' : 'file'} and try again.`);
        }
        console.log(chalk_1.default.bgGreen(chalk_1.default.black(`\n ddoc build - done on ${ddocs.length} files. `)));
    }
    catch (err) {
        console.error(chalk_1.default.bgRed(chalk_1.default.white(` ${err.message} `)));
        process.exit(1);
    }
});
prog.parse(process.argv);
