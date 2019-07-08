#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _a;
var child_process_1 = require("child_process");
var tmp_1 = require("tmp");
var fs_1 = require("fs");
var path = require("path");
var yargsParser = require("yargs-parser");
var parsedArgs = yargsParser(process.argv, {
    string: ['directory'],
    boolean: ['help']
});
if (parsedArgs.help) {
    console.log("\n    Usage: create-nx-workspace <directory> [options] [ng new options]\n\n    Create a new Nx workspace\n\n    Options:\n\n      directory             path to the workspace root directory\n\n      [ng new options]      any 'ng new' options\n                            run 'ng new --help' for more information\n  ");
    process.exit(0);
}
var nxTool = {
    name: 'Schematics',
    packageName: '@nrwl/schematics'
};
var useYarn = true;
try {
    child_process_1.execSync('yarn --version', { stdio: ['ignore', 'ignore', 'ignore'] });
}
catch (e) {
    useYarn = false;
}
var projectName = parsedArgs._[2];
// check that the workspace name is passed in
if (!projectName) {
    console.error('Please provide a project name (e.g., create-nx-workspace nrwl-proj)');
    process.exit(1);
}
// creating the sandbox
console.log("Creating a sandbox with Nx...");
var tmpDir = tmp_1.dirSync().name;
var nxVersion = '7.8.7';
var cliVersion = '7.3.1';
fs_1.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify({
    dependencies: (_a = {},
        _a[nxTool.packageName] = nxVersion,
        _a['@angular/cli'] = cliVersion,
        _a),
    license: 'MIT'
}));
if (useYarn) {
    child_process_1.execSync('yarn install --silent', { cwd: tmpDir, stdio: [0, 1, 2] });
}
else {
    child_process_1.execSync('npm install --silent', { cwd: tmpDir, stdio: [0, 1, 2] });
}
var ɵ0 = function (a) { return "\"" + a + "\""; };
exports.ɵ0 = ɵ0;
// creating the app itself
var args = process.argv
    .slice(2)
    .map(ɵ0)
    .join(' ');
console.log("ng new " + args + " --collection=" + nxTool.packageName);
child_process_1.execSync(path.join("\"" + tmpDir + "\"", 'node_modules', '.bin', 'ng') + " new " + args + " --collection=" + nxTool.packageName, {
    stdio: [0, 1, 2]
});
