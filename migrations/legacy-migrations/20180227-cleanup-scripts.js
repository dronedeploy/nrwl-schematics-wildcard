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
    description: 'Add update, update:skip, update:check scripts',
    run: function () {
        fileutils_1.updateJsonFile('package.json', function (json) {
            json.scripts = __assign({}, json.scripts, { update: './node_modules/.bin/nx update', 'update:check': './node_modules/.bin/nx update check', 'update:skip': './node_modules/.bin/nx update skip', 'nx-migrate': undefined, 'nx-migrate:check': undefined, 'nx-migrate:skip': undefined, 'apps:affected': undefined, 'build:affected': undefined, 'e2e:affected': undefined });
            if (json.scripts.postinstall === './node_modules/.bin/nx migrate check') {
                json.scripts.postinstall = './node_modules/.bin/nx postinstall';
            }
        });
    }
};
