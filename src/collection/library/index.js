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
var core_1 = require("@angular-devkit/core");
var schematics_1 = require("@angular-devkit/schematics");
var path = require("path");
var ast_utils_1 = require("@schematics/angular/utility/ast-utils");
var ts = require("typescript");
var ast_utils_2 = require("../../utils/ast-utils");
var common_1 = require("../../utils/common");
var name_utils_1 = require("../../utils/name-utils");
var cli_config_utils_1 = require("../../utils/cli-config-utils");
var format_files_1 = require("../../utils/rules/format-files");
function addLazyLoadedRouterConfiguration(options) {
    return function (host) {
        var moduleSource = host.read(options.modulePath).toString('utf-8');
        var sourceFile = ts.createSourceFile(options.modulePath, moduleSource, ts.ScriptTarget.Latest, true);
        ast_utils_2.insert(host, options.modulePath, [
            ast_utils_1.insertImport(sourceFile, options.modulePath, 'RouterModule', '@angular/router')
        ].concat(ast_utils_2.addImportToModule(sourceFile, options.modulePath, "\n        RouterModule.forChild([\n        /* {path: '', pathMatch: 'full', component: InsertYourComponentHere} */\n       ]) ")));
        return host;
    };
}
function addRouterConfiguration(options) {
    return function (host) {
        var moduleSource = host.read(options.modulePath).toString('utf-8');
        var moduleSourceFile = ts.createSourceFile(options.modulePath, moduleSource, ts.ScriptTarget.Latest, true);
        var constName = name_utils_1.toPropertyName(options.fileName) + "Routes";
        ast_utils_2.insert(host, options.modulePath, [
            ast_utils_1.insertImport(moduleSourceFile, options.modulePath, 'RouterModule, Route', '@angular/router')
        ].concat(ast_utils_2.addImportToModule(moduleSourceFile, options.modulePath, "RouterModule"), ast_utils_2.addGlobal(moduleSourceFile, options.modulePath, "export const " + constName + ": Route[] = [];")));
        return host;
    };
}
function addLoadChildren(options) {
    return function (host) {
        var npmScope = cli_config_utils_1.getNpmScope(host);
        if (!host.exists(options.parentModule)) {
            throw new Error("Cannot find '" + options.parentModule + "'");
        }
        var moduleSource = host.read(options.parentModule).toString('utf-8');
        var sourceFile = ts.createSourceFile(options.parentModule, moduleSource, ts.ScriptTarget.Latest, true);
        var loadChildren = "@" + npmScope + "/" + options.projectDirectory + "#" + options.moduleName;
        ast_utils_2.insert(host, options.parentModule, ast_utils_2.addRoute(options.parentModule, sourceFile, "{path: '" + name_utils_1.toFileName(options.fileName) + "', loadChildren: '" + loadChildren + "'}").slice());
        var tsConfig = findClosestTsConfigApp(host, options.parentModule);
        if (tsConfig) {
            var tsConfigAppSource = host.read(tsConfig).toString('utf-8');
            var tsConfigAppFile = ts.createSourceFile(tsConfig, tsConfigAppSource, ts.ScriptTarget.Latest, true);
            var offset = common_1.offsetFromRoot(path.dirname(tsConfig));
            ast_utils_2.insert(host, tsConfig, ast_utils_2.addIncludeToTsConfig(tsConfig, tsConfigAppFile, "\n    , \"" + offset + options.projectRoot + "/src/index.ts\"\n").slice());
        }
        else {
            // we should warn the user about not finding the config
        }
        return host;
    };
}
function findClosestTsConfigApp(host, parentModule) {
    var dir = path.parse(parentModule).dir;
    if (host.exists(dir + "/tsconfig.app.json")) {
        return dir + "/tsconfig.app.json";
    }
    else if (dir != '') {
        return findClosestTsConfigApp(host, dir);
    }
    else {
        return null;
    }
}
function addChildren(options) {
    return function (host) {
        var npmScope = cli_config_utils_1.getNpmScope(host);
        if (!host.exists(options.parentModule)) {
            throw new Error("Cannot find '" + options.parentModule + "'");
        }
        var moduleSource = host.read(options.parentModule).toString('utf-8');
        var sourceFile = ts.createSourceFile(options.parentModule, moduleSource, ts.ScriptTarget.Latest, true);
        var constName = name_utils_1.toPropertyName(options.fileName) + "Routes";
        var importPath = "@" + npmScope + "/" + options.projectDirectory;
        ast_utils_2.insert(host, options.parentModule, [
            ast_utils_1.insertImport(sourceFile, options.parentModule, options.moduleName + ", " + constName, importPath)
        ].concat(ast_utils_2.addImportToModule(sourceFile, options.parentModule, options.moduleName), ast_utils_2.addRoute(options.parentModule, sourceFile, "{path: '" + name_utils_1.toFileName(options.fileName) + "', children: " + constName + "}")));
        return host;
    };
}
function updateNgPackage(options) {
    if (!options.publishable) {
        return schematics_1.noop();
    }
    var dest = common_1.offsetFromRoot(options.projectRoot) + "dist/libs/" + options.projectDirectory;
    return schematics_1.chain([
        ast_utils_2.updateJsonInTree(options.projectRoot + "/ng-package.json", function (json) {
            return __assign({}, json, { dest: dest });
        })
    ]);
}
function updateProject(options) {
    return function (host, context) {
        var libRoot = options.projectRoot + "/src/lib/";
        host.delete(path.join(libRoot, options.name + ".service.ts"));
        host.delete(path.join(libRoot, options.name + ".service.spec.ts"));
        host.delete(path.join(libRoot, options.name + ".component.ts"));
        host.delete(path.join(libRoot, options.name + ".component.spec.ts"));
        if (!options.publishable) {
            host.delete(path.join(options.projectRoot, 'ng-package.json'));
            host.delete(path.join(options.projectRoot, 'package.json'));
        }
        host.delete(path.join(options.projectRoot, 'karma.conf.js'));
        host.delete(path.join(options.projectRoot, 'src/test.ts'));
        host.delete(path.join(options.projectRoot, 'tsconfig.spec.json'));
        if (options.framework === "angular" /* Angular */) {
            host.delete(path.join(libRoot, options.name + ".module.ts"));
            host.create(path.join(libRoot, options.fileName + ".module.ts"), "\n        import { NgModule } from '@angular/core';\n        import { CommonModule } from '@angular/common';\n        \n        @NgModule({\n          imports: [\n            CommonModule\n          ]\n        })\n        export class " + options.moduleName + " { }\n        ");
            if (options.unitTestRunner !== 'none') {
                host.create(path.join(libRoot, options.fileName + ".module.spec.ts"), "\n    import { async, TestBed } from '@angular/core/testing';\n    import { " + options.moduleName + " } from './" + options.fileName + ".module';\n    \n    describe('" + options.moduleName + "', () => {\n      beforeEach(async(() => {\n        TestBed.configureTestingModule({\n          imports: [ " + options.moduleName + " ]\n        })\n        .compileComponents();\n      }));\n    \n      it('should create', () => {\n        expect(" + options.moduleName + ").toBeDefined();\n      });\n    });\n          ");
            }
            host.overwrite(options.projectRoot + "/src/index.ts", "\n        export * from './lib/" + options.fileName + ".module';\n        ");
        }
        else {
            host.delete(path.join(libRoot, options.fileName + ".module.ts"));
            host.create(path.join(libRoot, ".gitkeep"), '');
            host.overwrite(options.projectRoot + "/src/index.ts", '');
        }
        return schematics_1.chain([
            schematics_1.mergeWith(schematics_1.apply(schematics_1.url('./files/lib'), [
                schematics_1.template(__assign({}, options, { offsetFromRoot: common_1.offsetFromRoot(options.projectRoot) })),
                schematics_1.move(options.projectRoot)
            ])),
            ast_utils_2.updateJsonInTree(cli_config_utils_1.getWorkspacePath(host), function (json) {
                var project = json.projects[options.name];
                var fixedProject = cli_config_utils_1.replaceAppNameWithPath(project, options.name, options.projectRoot);
                fixedProject.schematics = fixedProject.schematics || {};
                if (options.style !== 'css') {
                    fixedProject.schematics = __assign({}, fixedProject.schematics, { '@nrwl/schematics:component': {
                            styleext: options.style
                        } });
                }
                if (!options.publishable) {
                    delete fixedProject.architect.build;
                }
                delete fixedProject.architect.test;
                fixedProject.architect.lint.options.tsConfig = fixedProject.architect.lint.options.tsConfig.filter(function (path) {
                    return path !== core_1.join(core_1.normalize(options.projectRoot), 'tsconfig.spec.json');
                });
                json.projects[options.name] = fixedProject;
                return json;
            }),
            ast_utils_2.updateJsonInTree(options.projectRoot + "/tsconfig.lib.json", function (json) {
                json.exclude = json.exclude || [];
                return __assign({}, json, { extends: "./tsconfig.json", compilerOptions: __assign({}, json.compilerOptions, { outDir: common_1.offsetFromRoot(options.projectRoot) + "dist/out-tsc/" + options.projectRoot }), angularCompilerOptions: options.framework === "angular" /* Angular */
                        ? json.angularCompilerOptions
                        : undefined });
            }),
            ast_utils_2.updateJsonInTree(options.projectRoot + "/tslint.json", function (json) {
                return __assign({}, json, { rules: options.framework === "angular" /* Angular */ ? json.rules : [], extends: common_1.offsetFromRoot(options.projectRoot) + "tslint.json" });
            }),
            ast_utils_2.updateJsonInTree("/nx.json", function (json) {
                var _a;
                return __assign({}, json, { projects: __assign({}, json.projects, (_a = {}, _a[options.name] = { tags: options.parsedTags }, _a)) });
            }),
            updateNgPackage(options)
        ])(host, context);
    };
}
function updateTsConfig(options) {
    return schematics_1.chain([
        function (host, context) {
            var nxJson = ast_utils_2.readJsonInTree(host, 'nx.json');
            return ast_utils_2.updateJsonInTree('tsconfig.json', function (json) {
                var c = json.compilerOptions;
                delete c.paths[options.name];
                c.paths["@" + nxJson.npmScope + "/" + options.projectDirectory] = [
                    "libs/" + options.projectDirectory + "/src/index.ts"
                ];
                return json;
            })(host, context);
        }
    ]);
}
function createAdditionalFiles(options) {
    switch (options.framework) {
        case "react" /* React */:
            return schematics_1.chain([
                schematics_1.mergeWith(schematics_1.apply(schematics_1.url("./files/" + options.framework), [
                    schematics_1.template(__assign({}, options, { tmpl: '' }, name_utils_1.names(options.name))),
                    schematics_1.move(options.projectRoot)
                ])),
                function (host) {
                    host.overwrite(options.projectRoot + "/src/index.ts", " export * from './lib/" + options.fileName + "';\n");
                }
            ]);
        default:
            return schematics_1.noop();
    }
}
function updateLibPackageNpmScope(options) {
    return function (host) {
        return ast_utils_2.updateJsonInTree(options.projectRoot + "/package.json", function (json) {
            json.name = "@" + cli_config_utils_1.getNpmScope(host) + "/" + options.name;
            return json;
        });
    };
}
function addModule(options) {
    return schematics_1.chain([
        options.routing && options.lazy
            ? addLazyLoadedRouterConfiguration(options)
            : schematics_1.noop(),
        options.routing && options.lazy && options.parentModule
            ? addLoadChildren(options)
            : schematics_1.noop(),
        options.routing && !options.lazy ? addRouterConfiguration(options) : schematics_1.noop(),
        options.routing && !options.lazy && options.parentModule
            ? addChildren(options)
            : schematics_1.noop()
    ]);
}
function default_1(schema) {
    return function (host, context) {
        var options = normalizeOptions(host, context, schema);
        if (!options.routing && options.lazy) {
            throw new Error("routing must be set");
        }
        return schematics_1.chain([
            schematics_1.externalSchematic('@schematics/angular', 'library', {
                name: options.name,
                prefix: options.prefix,
                style: options.style,
                entryFile: 'index',
                skipPackageJson: !options.publishable,
                skipTsConfig: true
            }),
            schematics_1.move(options.name, options.projectRoot),
            updateProject(options),
            updateTsConfig(options),
            createAdditionalFiles(options),
            options.unitTestRunner === 'jest'
                ? schematics_1.schematic('jest-project', {
                    project: options.name,
                    setupFile: options.framework === "angular" /* Angular */ ? 'angular' : 'none',
                    supportTsx: options.framework === "react" /* React */,
                    skipSerializers: options.framework !== "angular" /* Angular */
                })
                : schematics_1.noop(),
            options.unitTestRunner === 'karma'
                ? schematics_1.schematic('karma-project', {
                    project: options.name
                })
                : schematics_1.noop(),
            options.publishable ? updateLibPackageNpmScope(options) : schematics_1.noop(),
            options.framework === "angular" /* Angular */ ? addModule(options) : schematics_1.noop(),
            format_files_1.formatFiles(options)
        ])(host, context);
    };
}
exports.default = default_1;
function normalizeOptions(host, context, options) {
    var name = name_utils_1.toFileName(options.name);
    var projectDirectory = options.directory
        ? name_utils_1.toFileName(options.directory) + "/" + name
        : name;
    var projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
    var fileName = options.simpleModuleName ? name : projectName;
    var projectRoot = "libs/" + projectDirectory;
    var moduleName = name_utils_1.toClassName(fileName) + "Module";
    var parsedTags = options.tags
        ? options.tags.split(',').map(function (s) { return s.trim(); })
        : [];
    var modulePath = projectRoot + "/src/lib/" + fileName + ".module.ts";
    var defaultPrefix = cli_config_utils_1.getNpmScope(host);
    if (!options.module) {
        context.logger.warn('Deprecated: --module is deprecated in favor of --framework');
        options.framework = "none" /* None */;
    }
    return __assign({}, options, { prefix: options.prefix ? options.prefix : defaultPrefix, name: projectName, projectRoot: projectRoot, entryFile: 'index', moduleName: moduleName,
        projectDirectory: projectDirectory,
        modulePath: modulePath,
        parsedTags: parsedTags,
        fileName: fileName });
}
