"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lib_versions_1 = require("../../../lib-versions");
var ast_utils_1 = require("@nrwl/schematics/src/utils/ast-utils");
function addNgRxToPackageJson() {
    return ast_utils_1.addDepsToPackageJson({
        '@ngrx/store': lib_versions_1.ngrxVersion,
        '@ngrx/effects': lib_versions_1.ngrxVersion,
        '@ngrx/entity': lib_versions_1.ngrxVersion,
        '@ngrx/router-store': lib_versions_1.ngrxVersion,
        '@nrwl/nx': lib_versions_1.nxVersion
    }, {
        '@ngrx/store-devtools': lib_versions_1.ngrxVersion,
        'ngrx-store-freeze': lib_versions_1.ngrxStoreFreezeVersion
    });
}
exports.addNgRxToPackageJson = addNgRxToPackageJson;
