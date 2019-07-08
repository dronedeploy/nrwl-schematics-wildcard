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
    description: 'Update npm scripts to use the nx command',
    run: function () {
        fileutils_1.updateJsonFile('package.json', function (json) {
            json.scripts = __assign({}, json.scripts, { 'apps:affected': './node_modules/.bin/nx affected apps', 'build:affected': './node_modules/.bin/nx affected build', 'e2e:affected': './node_modules/.bin/nx affected e2e', 'affected:apps': './node_modules/.bin/nx affected apps', 'affected:build': './node_modules/.bin/nx affected build', 'affected:e2e': './node_modules/.bin/nx affected e2e', format: './node_modules/.bin/nx format write', 'format:write': './node_modules/.bin/nx format write', 'format:check': './node_modules/.bin/nx format check', 'nx-migrate': './node_modules/.bin/nx migrate' });
        });
    }
};
