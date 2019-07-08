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
var updateAngularCLI = update_task_1.addUpdateTask('@angular/cli', '7.2.2');
var ɵ0 = function (json) {
    json.devDependencies = json.devDependencies || {};
    json.devDependencies = __assign({}, json.devDependencies, { typescript: '~3.2.2' });
    return json;
};
exports.ɵ0 = ɵ0;
var updateTypescript = ast_utils_1.updateJsonInTree('package.json', ɵ0);
function default_1() {
    return schematics_1.chain([updateTypescript, updateAngularCLI]);
}
exports.default = default_1;
