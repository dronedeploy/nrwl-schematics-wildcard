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
    description: 'Add postinstall script to run nx-migrate:check',
    run: function () {
        fileutils_1.updateJsonFile('package.json', function (json) {
            if (!json.scripts.postinstall) {
                json.scripts = __assign({}, json.scripts, { postinstall: './node_modules/.bin/nx migrate check' });
            }
        });
    }
};
