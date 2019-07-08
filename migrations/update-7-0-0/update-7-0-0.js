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
var schematics_1 = require("@angular-devkit/schematics");
var ast_utils_1 = require("../../src/utils/ast-utils");
var update_task_1 = require("../../src/utils/update-task");
function default_1() {
    return schematics_1.chain([
        ast_utils_1.updateJsonInTree('package.json', function (json) {
            json.devDependencies = json.devDependencies || {};
            json.devDependencies = __assign({}, json.devDependencies, { codelyzer: '~4.5.0', 'jasmine-marbles': '0.4.0' });
            if (json.devDependencies['ng-packagr']) {
                json.devDependencies['ng-packagr'] = '^4.2.0';
            }
            return json;
        }),
        update_task_1.addUpdateTask('@angular/core', '7.0.0'),
        update_task_1.addUpdateTask('@angular/cli', '7.0.1')
    ]);
}
exports.default = default_1;
