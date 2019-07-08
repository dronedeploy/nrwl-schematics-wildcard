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
var core_1 = require("@angular-devkit/core");
var common_1 = require("../../utils/common");
var ast_utils_1 = require("../../utils/ast-utils");
var name_utils_1 = require("../../utils/name-utils");
var lib_versions_1 = require("../../lib-versions");
function addTypes(options) {
    var tsConfigPath = core_1.join(options.appProjectRoot, 'tsconfig.json');
    switch (options.framework) {
        case 'express':
            return ast_utils_1.updateJsonInTree(tsConfigPath, function (json) {
                json.compilerOptions.types = json.compilerOptions.types.concat(['express']);
                return json;
            });
        default:
            return schematics_1.noop();
    }
}
function addDependencies(options) {
    var deps = {};
    var devDeps = {};
    switch (options.framework) {
        case 'express':
            deps = {
                express: lib_versions_1.expressVersion
            };
            devDeps = {
                '@types/express': lib_versions_1.expressTypingsVersion
            };
            break;
        case 'nestjs':
            deps = {
                '@nestjs/common': lib_versions_1.nestJsVersion,
                '@nestjs/core': lib_versions_1.nestJsVersion
            };
            devDeps = {
                '@nestjs/schematics': lib_versions_1.nestJsSchematicsVersion,
                '@nestjs/testing': lib_versions_1.nestJsVersion
            };
            break;
    }
    return ast_utils_1.addDepsToPackageJson(deps, devDeps);
}
function createSourceCode(options) {
    return function (host, context) {
        return schematics_1.chain([
            schematics_1.mergeWith(schematics_1.apply(schematics_1.url("./files/" + options.framework), [
                schematics_1.template({
                    tmpl: '',
                    name: options.name
                }),
                schematics_1.move(core_1.join(options.appProjectRoot, 'src'))
            ])),
            options.framework !== 'none' ? addDependencies(options) : schematics_1.noop()
        ])(host, context);
    };
}
function updateNxJson(options) {
    return ast_utils_1.updateJsonInTree("/nx.json", function (json) {
        var _a;
        return __assign({}, json, { projects: __assign({}, json.projects, (_a = {}, _a[options.name] = { tags: options.parsedTags }, _a)) });
    });
}
function getBuildConfig(project, options) {
    return {
        builder: '@nrwl/builders:node-build',
        options: {
            outputPath: core_1.join(core_1.normalize('dist'), options.appProjectRoot),
            main: core_1.join(project.sourceRoot, 'main.ts'),
            tsConfig: core_1.join(options.appProjectRoot, 'tsconfig.app.json'),
            assets: [core_1.join(project.sourceRoot, 'assets')]
        },
        configurations: {
            production: {
                optimization: true,
                extractLicenses: true,
                inspect: false,
                fileReplacements: [
                    {
                        replace: core_1.join(project.sourceRoot, 'environments/environment.ts'),
                        with: core_1.join(project.sourceRoot, 'environments/environment.prod.ts')
                    }
                ]
            }
        }
    };
}
function getLintConfig(project) {
    return {
        builder: '@angular-devkit/build-angular:tslint',
        options: {
            tsConfig: [core_1.join(project.root, 'tsconfig.app.json')],
            exclude: ['**/node_modules/**']
        }
    };
}
function getServeConfig(options) {
    return {
        builder: '@nrwl/builders:node-execute',
        options: {
            buildTarget: options.name + ":build"
        }
    };
}
function updateAngularJson(options) {
    return ast_utils_1.updateJsonInTree('angular.json', function (angularJson) {
        var project = {
            root: options.appProjectRoot,
            sourceRoot: core_1.join(options.appProjectRoot, 'src'),
            projectType: 'application',
            prefix: options.name,
            schematics: {},
            architect: {}
        };
        project.architect.build = getBuildConfig(project, options);
        project.architect.serve = getServeConfig(options);
        project.architect.lint = getLintConfig(project);
        angularJson.projects[options.name] = project;
        return angularJson;
    });
}
function addAppFiles(options) {
    return schematics_1.mergeWith(schematics_1.apply(schematics_1.url("./files/app"), [
        schematics_1.template({
            tmpl: '',
            name: options.name,
            root: options.appProjectRoot,
            offset: common_1.offsetFromRoot(options.appProjectRoot)
        }),
        schematics_1.move(options.appProjectRoot)
    ]));
}
function addProxy(options) {
    return function (host, context) {
        var projectConfig = ast_utils_1.getProjectConfig(host, options.frontendProject);
        if (projectConfig.architect && projectConfig.architect.serve) {
            var pathToProxyFile_1 = projectConfig.root + "/proxy.conf.json";
            host.create(pathToProxyFile_1, JSON.stringify({
                '/api': {
                    target: 'http://localhost:3333',
                    secure: false
                }
            }, null, 2));
            ast_utils_1.updateJsonInTree('angular.json', function (json) {
                projectConfig.architect.serve.options.proxyConfig = pathToProxyFile_1;
                json.projects[options.frontendProject] = projectConfig;
                return json;
            })(host, context);
        }
    };
}
function default_1(schema) {
    return function (host, context) {
        var options = normalizeOptions(schema);
        return schematics_1.chain([
            addAppFiles(options),
            updateAngularJson(options),
            updateNxJson(options),
            options.framework !== 'none' ? createSourceCode(options) : schematics_1.noop(),
            options.unitTestRunner === 'jest'
                ? schematics_1.schematic('jest-project', {
                    project: options.name,
                    setupFile: 'none',
                    skipSerializers: true
                })
                : schematics_1.noop(),
            addTypes(options),
            options.frontendProject ? addProxy(options) : schematics_1.noop()
        ])(host, context);
    };
}
exports.default = default_1;
function normalizeOptions(options) {
    var appDirectory = options.directory
        ? name_utils_1.toFileName(options.directory) + "/" + name_utils_1.toFileName(options.name)
        : name_utils_1.toFileName(options.name);
    var appProjectName = appDirectory.replace(new RegExp('/', 'g'), '-');
    var appProjectRoot = core_1.join(core_1.normalize('apps'), appDirectory);
    var parsedTags = options.tags
        ? options.tags.split(',').map(function (s) { return s.trim(); })
        : [];
    return __assign({}, options, { name: name_utils_1.toFileName(appProjectName), frontendProject: options.frontendProject
            ? name_utils_1.toFileName(options.frontendProject)
            : undefined, appProjectRoot: appProjectRoot,
        parsedTags: parsedTags });
}
