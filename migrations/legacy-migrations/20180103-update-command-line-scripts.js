"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var fileutils_1 = require("../../src/utils/fileutils");
exports.default = {
    description: 'Add format:write and format:check to npm scripts',
    run: function () {
        fileutils_1.updateJsonFile('package.json', function (json) {
            json.scripts = __assign({}, json.scripts, { 'apps:affected': 'node ./node_modules/@nrwl/schematics/src/command-line/affected.js apps', 'build:affected': 'node ./node_modules/@nrwl/schematics/src/command-line/affected.js build', 'e2e:affected': 'node ./node_modules/@nrwl/schematics/src/command-line/affected.js e2e', 'affected:apps': 'node ./node_modules/@nrwl/schematics/src/command-line/affected.js apps', 'affected:build': 'node ./node_modules/@nrwl/schematics/src/command-line/affected.js build', 'affected:e2e': 'node ./node_modules/@nrwl/schematics/src/command-line/affected.js e2e', format: 'node ./node_modules/@nrwl/schematics/src/command-line/format.js write', 'format:write': 'node ./node_modules/@nrwl/schematics/src/command-line/format.js write', 'format:check': 'node ./node_modules/@nrwl/schematics/src/command-line/format.js check', 'nx-migrate': 'node ./node_modules/@nrwl/schematics/src/command-line/nx-migrate.js' });
        });
    }
};
