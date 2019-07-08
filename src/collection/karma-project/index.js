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
var ast_utils_1 = require("../../utils/ast-utils");
var common_1 = require("../../utils/common");
var core_1 = require("@angular-devkit/core");
// TODO: @jjean implement skipSetupFile
function generateFiles(options) {
    return function (host, context) {
        var projectConfig = ast_utils_1.getProjectConfig(host, options.project);
        return schematics_1.mergeWith(schematics_1.apply(schematics_1.url('./files'), [
            schematics_1.template(__assign({ tmpl: '' }, options, { projectRoot: projectConfig.root, isLibrary: projectConfig.projectType === 'library', offsetFromRoot: common_1.offsetFromRoot(projectConfig.root) })),
            schematics_1.move(projectConfig.root)
        ]))(host, context);
    };
}
function updateTsConfig(options) {
    return function (host, context) {
        var projectConfig = ast_utils_1.getProjectConfig(host, options.project);
        return ast_utils_1.updateJsonInTree(core_1.join(projectConfig.root, 'tsconfig.json'), function (json) {
            return __assign({}, json, { compilerOptions: __assign({}, json.compilerOptions, { types: Array.from(new Set((json.compilerOptions.types || []).concat(['jasmine']))) }) });
        });
    };
}
function updateTsSpecConfig(options) {
    return function (host, context) {
        var projectConfig = ast_utils_1.getProjectConfig(host, options.project);
        var extraFiles = projectConfig.projectType === 'library' ? [] : ['src/polyfills.ts'];
        return ast_utils_1.updateJsonInTree(core_1.join(projectConfig.root, 'tsconfig.spec.json'), function (json) {
            return __assign({}, json, { files: json.files.concat(extraFiles) });
        });
    };
}
function updateAngularJson(options) {
    return ast_utils_1.updateJsonInTree('angular.json', function (json) {
        var projectConfig = json.projects[options.project];
        projectConfig.architect.test = {
            builder: '@angular-devkit/build-angular:karma',
            options: {
                main: core_1.join(core_1.normalize(projectConfig.sourceRoot), 'test.ts'),
                tsConfig: core_1.join(core_1.normalize(projectConfig.root), 'tsconfig.spec.json'),
                karmaConfig: core_1.join(core_1.normalize(projectConfig.root), 'karma.conf.js')
            }
        };
        if (projectConfig.projectType === 'application') {
            projectConfig.architect.test.options = __assign({}, projectConfig.architect.test.options, { polyfills: core_1.join(core_1.normalize(projectConfig.sourceRoot), 'polyfills.ts'), styles: [], scripts: [], assets: [] });
        }
        if (projectConfig.architect.lint) {
            projectConfig.architect.lint.options.tsConfig = projectConfig.architect.lint.options.tsConfig.concat([
                core_1.join(core_1.normalize(projectConfig.root), 'tsconfig.spec.json')
            ]);
        }
        return json;
    });
}
function check(options) {
    return function (host, context) {
        var projectConfig = ast_utils_1.getProjectConfig(host, options.project);
        if (projectConfig.architect.test) {
            throw new Error(options.project + " already has a test architect option.");
        }
        var packageJson = ast_utils_1.readJsonInTree(host, 'package.json');
        if (!packageJson.devDependencies.karma) {
            return schematics_1.schematic('karma', {});
        }
    };
}
function default_1(options) {
    return schematics_1.chain([
        check(options),
        generateFiles(options),
        updateTsConfig(options),
        updateTsSpecConfig(options),
        updateAngularJson(options)
    ]);
}
exports.default = default_1;
