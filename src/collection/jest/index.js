"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var schematics_1 = require("@angular-devkit/schematics");
var ast_utils_1 = require("../../utils/ast-utils");
var lib_versions_1 = require("../../lib-versions");
var updatePackageJson = ast_utils_1.addDepsToPackageJson({}, {
    '@nrwl/builders': lib_versions_1.nxVersion,
    jest: lib_versions_1.jestVersion,
    '@types/jest': lib_versions_1.jestTypesVersion
});
function default_1() {
    return schematics_1.chain([schematics_1.mergeWith(schematics_1.url('./files')), updatePackageJson]);
}
exports.default = default_1;
