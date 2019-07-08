"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var schematics_1 = require("@angular-devkit/schematics");
var ast_utils_1 = require("../../src/utils/ast-utils");
var format_files_1 = require("../../src/utils/rules/format-files");
var ts = require("typescript");
var ast_utils_2 = require("@schematics/angular/utility/ast-utils");
var change_1 = require("@schematics/angular/utility/change");
var ɵ0 = function (json) {
    if (!json.schematics) {
        json.schematics = {};
    }
    if (!json.schematics['@nrwl/schematics:library']) {
        json.schematics['@nrwl/schematics:library'] = {};
    }
    if (!json.schematics['@nrwl/schematics:library'].framework) {
        json.schematics['@nrwl/schematics:library'].framework = "angular" /* Angular */;
    }
    return json;
};
exports.ɵ0 = ɵ0;
var setDefaults = ast_utils_1.updateJsonInTree('angular.json', ɵ0);
var ɵ1 = function (json) {
    json.devDependencies = json.devDependencies || {};
    if (json.devDependencies['jest']) {
        json.devDependencies['jest'] = '24.1.0';
    }
    if (json.devDependencies['@types/jest']) {
        json.devDependencies['@types/jest'] = '24.0.9';
    }
    if (json.devDependencies['jest-preset-angular']) {
        json.devDependencies['jest-preset-angular'] = '7.0.0';
    }
    return json;
};
exports.ɵ1 = ɵ1;
var updateDependencies = ast_utils_1.updateJsonInTree('package.json', ɵ1);
function updateJestConfig(host) {
    if (host.exists('jest.config.js')) {
        var contents = host.read('jest.config.js').toString();
        var sourceFile_1 = ts.createSourceFile('jest.config.js', contents, ts.ScriptTarget.Latest);
        var changes_1 = [];
        ast_utils_2.getSourceNodes(sourceFile_1).forEach(function (node) {
            if (ts.isPropertyAssignment(node) &&
                ts.isStringLiteral(node.initializer) &&
                node.initializer.text === 'jest-preset-angular/preprocessor.js') {
                changes_1.push(new change_1.ReplaceChange('jest.config.js', node.initializer.getStart(sourceFile_1), node.initializer.getText(sourceFile_1), "'ts-jest'"));
            }
        });
        ast_utils_1.insert(host, 'jest.config.js', changes_1);
    }
}
function default_1() {
    return schematics_1.chain([
        setDefaults,
        updateDependencies,
        updateJestConfig,
        format_files_1.formatFiles()
    ]);
}
exports.default = default_1;
