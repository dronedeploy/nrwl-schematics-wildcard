"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var schematics_1 = require("@angular-devkit/schematics");
var ast_utils_1 = require("../../utils/ast-utils");
var lib_versions_1 = require("../../lib-versions");
var updatePackageJson = ast_utils_1.addDepsToPackageJson({}, {
    karma: '~3.0.0',
    'karma-chrome-launcher': '~2.2.0',
    'karma-coverage-istanbul-reporter': '~2.0.1',
    'karma-jasmine': '~1.1.0',
    'karma-jasmine-html-reporter': '^0.2.2',
    'jasmine-core': '~2.99.1',
    'jasmine-spec-reporter': '~4.2.1',
    'jasmine-marbles': lib_versions_1.jasmineMarblesVersion,
    '@types/jasmine': '~2.8.6',
    '@types/jasminewd2': '~2.0.3'
});
function default_1() {
    return schematics_1.chain([schematics_1.mergeWith(schematics_1.url('./files')), updatePackageJson]);
}
exports.default = default_1;
