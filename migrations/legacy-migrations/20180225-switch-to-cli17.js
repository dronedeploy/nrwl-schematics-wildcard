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
var fs_1 = require("fs");
exports.default = {
    description: 'Switch to Angular CLI 1.7',
    run: function () {
        fileutils_1.updateJsonFile('package.json', function (json) {
            var _a;
            json.devDependencies = __assign({}, json.devDependencies, (_a = { '@angular/cli': '1.7.1', '@angular/compiler-cli': '5.2.7', '@angular/language-service': '5.2.7', '@types/jasmine': '~2.5.53' }, _a['@angular-devkit/core'] = undefined, _a['@angular-devkit/schematics'] = undefined, _a['@schematics/angular'] = undefined, _a['karma-cli'] = undefined, _a));
            json.dependencies = __assign({}, json.dependencies, { '@angular/animations': '5.2.7', '@angular/common': '5.2.7', '@angular/compiler': '5.2.7', '@angular/core': '5.2.7', '@angular/forms': '5.2.7', '@angular/platform-browser': '5.2.7', '@angular/platform-browser-dynamic': '5.2.7', '@angular/router': '5.2.7', '@ngrx/effects': '5.1.0', '@ngrx/router-store': '5.0.1', '@ngrx/store': '5.1.0', '@ngrx/store-devtools': '5.1.0' });
            if (json.dependencies['@angular/http']) {
                json.dependencies['@angular/http'] = '5.2.7';
            }
        });
        try {
            fs_1.unlinkSync('.angular_cli165.tgz');
        }
        catch (e) { }
    }
};
