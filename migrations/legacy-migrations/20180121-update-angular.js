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
var path = require("path");
exports.default = {
    description: 'Upgrade Angular and the CLI',
    run: function () {
        fileutils_1.updateJsonFile('package.json', function (json) {
            json.dependencies = __assign({}, json.dependencies, { '@angular/animations': '^5.2.0', '@angular/common': '^5.2.0', '@angular/compiler': '^5.2.0', '@angular/core': '^5.2.0', '@angular/forms': '^5.2.0', '@angular/platform-browser': '^5.2.0', '@angular/platform-browser-dynamic': '^5.2.0', '@angular/router': '^5.2.0', 'core-js': '^2.4.1', rxjs: '^5.5.6', 'zone.js': '^0.8.19', '@ngrx/effects': '4.1.1', '@ngrx/router-store': '4.1.1', '@ngrx/store': '4.1.1' });
            json.devDependencies = __assign({}, json.devDependencies, { '@angular/cli': 'file:.angular_cli165.tgz', '@angular/compiler-cli': '^5.2.0', '@angular/language-service': '^5.2.0', 'jasmine-core': '~2.8.0', 'jasmine-spec-reporter': '~4.2.1', karma: '~2.0.0', 'karma-chrome-launcher': '~2.2.0', 'ts-node': '~4.1.0', tslint: '~5.9.1', typescript: '2.6.2' });
        });
        fileutils_1.updateJsonFile('tslint.json', function (json) {
            json.rules['deprecation'] = { severity: 'warn' };
            json.rules['typeof-compare'] = undefined;
            json.rules['whitespace'] = undefined;
        });
        fileutils_1.copyFile(path.join(__dirname, '..', 'src', 'collection', 'application', 'files', '__directory__', '.angular_cli165.tgz'), '.');
    }
};
