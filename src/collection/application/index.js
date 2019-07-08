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
var ts = require("typescript");
var ast_utils_1 = require("@schematics/angular/utility/ast-utils");
var ast_utils_2 = require("../../utils/ast-utils");
var name_utils_1 = require("../../utils/name-utils");
var common_1 = require("../../utils/common");
var cli_config_utils_1 = require("../../utils/cli-config-utils");
var format_files_1 = require("../../utils/rules/format-files");
var core_1 = require("@angular-devkit/core");
var lib_versions_1 = require("../../lib-versions");
function addRouterRootConfiguration(options) {
    return function (host) {
        var modulePath = options.appProjectRoot + "/src/app/app.module.ts";
        var moduleSource = host.read(modulePath).toString('utf-8');
        var sourceFile = ts.createSourceFile(modulePath, moduleSource, ts.ScriptTarget.Latest, true);
        ast_utils_2.insert(host, modulePath, [
            ast_utils_1.insertImport(sourceFile, modulePath, 'RouterModule', '@angular/router')
        ].concat(ast_utils_2.addImportToModule(sourceFile, modulePath, "RouterModule.forRoot([], {initialNavigation: 'enabled'})")));
        if (options.skipTests !== true) {
            var componentSpecPath = options.appProjectRoot + "/src/app/app.component.spec.ts";
            var componentSpecSource = host
                .read(componentSpecPath)
                .toString('utf-8');
            var componentSpecSourceFile = ts.createSourceFile(componentSpecPath, componentSpecSource, ts.ScriptTarget.Latest, true);
            ast_utils_2.insert(host, componentSpecPath, [
                ast_utils_1.insertImport(componentSpecSourceFile, componentSpecPath, 'RouterTestingModule', '@angular/router/testing')
            ].concat(ast_utils_2.addImportToTestBed(componentSpecSourceFile, componentSpecPath, "RouterTestingModule")));
        }
        return host;
    };
}
function updateComponentTemplate(options) {
    return function (host) {
        var baseContent = "\n<div style=\"text-align:center\">\n  <h1>Welcome to {{title}}!</h1>\n  <img width=\"450\" src=\"https://raw.githubusercontent.com/nrwl/nx/master/nx-logo.png\">\n</div>\n\n<p>This is an Angular app built with <a href=\"https://nx.dev\">Nx</a>.</p>\n<p>\uD83D\uDD0E **Nx is a set of Angular CLI power-ups for modern development.**</p>\n\n<h2>Quick Start & Documentation</h2>\n\n<ul>\n<li><a href=\"https://nx.dev/getting-started/what-is-nx\">30-minute video showing all Nx features</a></li>\n<li><a href=\"https://nx.dev/tutorial/01-create-application\">Interactive tutorial</a></li>\n</ul>\n";
        var content = options.routing
            ? baseContent + "\n<router-outlet></router-outlet>"
            : baseContent;
        if (!options.inlineTemplate) {
            return host.overwrite(options.appProjectRoot + "/src/app/app.component.html", content);
        }
        var modulePath = options.appProjectRoot + "/src/app/app.component.ts";
        var templateNodeValue = ast_utils_2.getDecoratorPropertyValueNode(host, modulePath, 'Component', 'template', '@angular/core');
        ast_utils_2.replaceNodeValue(host, modulePath, templateNodeValue, "`\n" + baseContent + "\n`,\n");
    };
}
function updateBuilders(options) {
    return function (host) {
        return ast_utils_2.updateJsonInTree(cli_config_utils_1.getWorkspacePath(host), function (json) {
            var project = json.projects[options.name];
            delete project.architect['extract-i18n'];
            var buildOptions = project.architect.build;
            var serveOptions = project.architect.serve;
            buildOptions.builder = '@nrwl/builders:web-build';
            delete buildOptions.options.es5BrowserSupport;
            delete buildOptions.configurations.production.aot;
            delete buildOptions.configurations.production.buildOptimizer;
            serveOptions.builder = '@nrwl/builders:web-dev-server';
            serveOptions.options.buildTarget = serveOptions.options.browserTarget;
            delete serveOptions.options.browserTarget;
            serveOptions.configurations.production.buildTarget =
                serveOptions.configurations.production.browserTarget;
            delete serveOptions.configurations.production.browserTarget;
            if (options.framework === "react" /* React */) {
                buildOptions.options.main = buildOptions.options.main.replace('.ts', '.tsx');
            }
            return json;
        });
    };
}
function updateApplicationFiles(options) {
    return schematics_1.chain([
        deleteAngularApplicationFiles(options),
        addApplicationFiles(options)
    ]);
}
function addApplicationFiles(options) {
    return schematics_1.mergeWith(schematics_1.apply(schematics_1.url("./files/" + options.framework), [
        schematics_1.template(__assign({}, options, { tmpl: '' })),
        schematics_1.move(options.appProjectRoot)
    ]), schematics_1.MergeStrategy.Overwrite);
}
function deleteAngularApplicationFiles(options) {
    return function (host) {
        var projectRoot = core_1.normalize(options.appProjectRoot);
        [
            'src/main.ts',
            'src/polyfills.ts',
            'src/app/app.module.ts',
            'src/app/app.component.ts',
            'src/app/app.component.spec.ts',
            "src/app/app.component." + options.style,
            'src/app/app.component.html'
        ].forEach(function (path) {
            path = core_1.join(projectRoot, path);
            if (host.exists(path)) {
                host.delete(path);
            }
        });
    };
}
function updateDependencies(options) {
    var deps = {};
    var devDeps = {};
    switch (options.framework) {
        case "react" /* React */:
            deps = {
                react: lib_versions_1.reactVersions.framework,
                'react-dom': lib_versions_1.reactVersions.framework
            };
            devDeps = {
                '@types/react': lib_versions_1.reactVersions.reactTypes,
                '@types/react-dom': lib_versions_1.reactVersions.reactDomTypes,
                'react-testing-library': lib_versions_1.reactVersions.testingLibrary
            };
            break;
        case "angular" /* Angular */:
            deps = {
                '@angular/animations': lib_versions_1.angularVersion,
                '@angular/common': lib_versions_1.angularVersion,
                '@angular/compiler': lib_versions_1.angularVersion,
                '@angular/core': lib_versions_1.angularVersion,
                '@angular/forms': lib_versions_1.angularVersion,
                '@angular/platform-browser': lib_versions_1.angularVersion,
                '@angular/platform-browser-dynamic': lib_versions_1.angularVersion,
                '@angular/router': lib_versions_1.angularVersion,
                'core-js': '^2.5.4',
                rxjs: lib_versions_1.rxjsVersion,
                'zone.js': '^0.8.26'
            };
            devDeps = {
                '@angular/compiler-cli': lib_versions_1.angularVersion,
                '@angular/language-service': lib_versions_1.angularVersion,
                '@angular-devkit/build-angular': lib_versions_1.angularDevkitVersion,
                codelyzer: '~4.5.0'
            };
            break;
        case "web-components" /* WebComponents */:
            deps = {
                'document-register-element': lib_versions_1.documentRegisterElementVersion
            };
            break;
    }
    return ast_utils_2.addDepsToPackageJson(deps, devDeps);
}
function updateLinting(options) {
    switch (options.framework) {
        case "angular" /* Angular */:
            return schematics_1.chain([
                ast_utils_2.updateJsonInTree('tslint.json', function (json) {
                    if (json.rulesDirectory &&
                        json.rulesDirectory.indexOf('node_modules/codelyzer') === -1) {
                        json.rulesDirectory.push('node_modules/codelyzer');
                        json.rules = __assign({}, json.rules, { 'directive-selector': [true, 'attribute', 'app', 'camelCase'], 'component-selector': [true, 'element', 'app', 'kebab-case'], 'no-output-on-prefix': true, 'use-input-property-decorator': true, 'use-output-property-decorator': true, 'use-host-property-decorator': true, 'no-input-rename': true, 'no-output-rename': true, 'use-life-cycle-interface': true, 'use-pipe-transform-interface': true, 'component-class-suffix': true, 'directive-class-suffix': true });
                    }
                    return json;
                }),
                ast_utils_2.updateJsonInTree(options.appProjectRoot + "/tslint.json", function (json) {
                    json.extends = common_1.offsetFromRoot(options.appProjectRoot) + "tslint.json";
                    return json;
                })
            ]);
        case "react" /* React */:
        case "web-components" /* WebComponents */:
            return ast_utils_2.updateJsonInTree(options.appProjectRoot + "/tslint.json", function (json) {
                json.extends = common_1.offsetFromRoot(options.appProjectRoot) + "tslint.json";
                json.rules = [];
                return json;
            });
    }
}
function addTsconfigs(options) {
    return schematics_1.chain([
        schematics_1.mergeWith(schematics_1.apply(schematics_1.url('./files/app'), [
            schematics_1.template(__assign({}, options, { offsetFromRoot: common_1.offsetFromRoot(options.appProjectRoot) })),
            schematics_1.move(options.appProjectRoot)
        ])),
        schematics_1.mergeWith(schematics_1.apply(schematics_1.url('./files/app'), [
            schematics_1.template(__assign({}, options, { offsetFromRoot: common_1.offsetFromRoot(options.e2eProjectRoot) })),
            schematics_1.move(options.e2eProjectRoot)
        ]))
    ]);
}
function updateProject(options) {
    return function (host) {
        return schematics_1.chain([
            ast_utils_2.updateJsonInTree(cli_config_utils_1.getWorkspacePath(host), function (json) {
                var project = json.projects[options.name];
                var fixedProject = cli_config_utils_1.replaceAppNameWithPath(project, options.name, options.appProjectRoot);
                if (fixedProject.schematics) {
                    cli_config_utils_1.angularSchematicNames.forEach(function (type) {
                        var schematic = "@schematics/angular:" + type;
                        if (schematic in fixedProject.schematics) {
                            fixedProject.schematics["@nrwl/schematics:" + type] =
                                fixedProject.schematics[schematic];
                            delete fixedProject.schematics[schematic];
                        }
                    });
                }
                delete fixedProject.architect.test;
                fixedProject.architect.lint.options.tsConfig = fixedProject.architect.lint.options.tsConfig.filter(function (path) {
                    return path !==
                        core_1.join(core_1.normalize(options.appProjectRoot), 'tsconfig.spec.json');
                });
                if (options.e2eTestRunner === 'none') {
                    delete json.projects[options.e2eProjectName];
                }
                json.projects[options.name] = fixedProject;
                return json;
            }),
            ast_utils_2.updateJsonInTree(options.appProjectRoot + "/tsconfig.app.json", function (json) {
                return __assign({}, json, { extends: "./tsconfig.json", compilerOptions: __assign({}, json.compilerOptions, { outDir: common_1.offsetFromRoot(options.appProjectRoot) + "dist/out-tsc/" + options.appProjectRoot }), exclude: options.unitTestRunner === 'jest'
                        ? ['src/test-setup.ts', '**/*.spec.ts']
                        : ['src/test.ts', '**/*.spec.ts'], include: ['**/*.ts'] });
            }),
            function (host) {
                host.delete(options.appProjectRoot + "/tsconfig.spec.json");
                return host;
            },
            ast_utils_2.updateJsonInTree("/nx.json", function (json) {
                var _a;
                var resultJson = __assign({}, json, { projects: __assign({}, json.projects, (_a = {}, _a[options.name] = { tags: options.parsedTags }, _a)) });
                if (options.e2eTestRunner !== 'none') {
                    resultJson.projects[options.e2eProjectName] = { tags: [] };
                }
                return resultJson;
            }),
            function (host) {
                host.delete(options.appProjectRoot + "/karma.conf.js");
                host.delete(options.appProjectRoot + "/src/test.ts");
                if (options.e2eTestRunner !== 'protractor') {
                    host.delete(options.e2eProjectRoot + "/src/app.e2e-spec.ts");
                    host.delete(options.e2eProjectRoot + "/src/app.po.ts");
                    host.delete(options.e2eProjectRoot + "/protractor.conf.js");
                }
            },
            options.e2eTestRunner === 'protractor'
                ? ast_utils_2.addDepsToPackageJson({}, { protractor: '~5.4.0' })
                : schematics_1.noop()
        ]);
    };
}
function updateE2eProject(options) {
    return function (host) {
        // patching the spec file because of a bug in the CLI application schematic
        // it hardcodes "app" in the e2e tests
        var spec = options.e2eProjectRoot + "/src/app.e2e-spec.ts";
        var content = host.read(spec).toString();
        host.overwrite(spec, content.replace('Welcome to app!', "Welcome to " + options.prefix + "!"));
        return schematics_1.chain([
            ast_utils_2.updateJsonInTree(cli_config_utils_1.getWorkspacePath(host), function (json) {
                var project = json.projects[options.e2eProjectName];
                project.root = options.e2eProjectRoot;
                project.architect.e2e.options.protractorConfig = options.e2eProjectRoot + "/protractor.conf.js";
                project.architect.lint.options.tsConfig = options.e2eProjectRoot + "/tsconfig.e2e.json";
                json.projects[options.e2eProjectName] = project;
                return json;
            }),
            ast_utils_2.updateJsonInTree(options.e2eProjectRoot + "/tsconfig.json", function (json) {
                return __assign({}, json, { compilerOptions: __assign({}, json.compilerOptions, { types: (json.compilerOptions.types || []).concat([
                            'jasmine',
                            'jasminewd2'
                        ]) }) });
            }),
            ast_utils_2.updateJsonInTree(options.e2eProjectRoot + "/tsconfig.e2e.json", function (json) {
                return __assign({}, json, { extends: "./tsconfig.json", compilerOptions: __assign({}, json.compilerOptions, { outDir: common_1.offsetFromRoot(options.e2eProjectRoot) + "dist/out-tsc/" + options.e2eProjectRoot }) });
            })
        ]);
    };
}
function default_1(schema) {
    return function (host, context) {
        var options = normalizeOptions(host, schema);
        // Determine the roots where @schematics/angular will place the projects
        // This is not where the projects actually end up
        var angularJson = ast_utils_2.readJsonInTree(host, cli_config_utils_1.getWorkspacePath(host));
        var appProjectRoot = angularJson.newProjectRoot
            ? angularJson.newProjectRoot + "/" + options.name
            : options.name;
        var e2eProjectRoot = angularJson.newProjectRoot
            ? angularJson.newProjectRoot + "/" + options.e2eProjectName
            : 'e2e';
        return schematics_1.chain([
            schematics_1.externalSchematic('@schematics/angular', 'application', {
                name: options.name,
                inlineStyle: options.inlineStyle,
                inlineTemplate: options.inlineTemplate,
                prefix: options.prefix,
                skipTests: options.skipTests,
                style: options.style,
                viewEncapsulation: options.viewEncapsulation,
                routing: false,
                skipInstall: true,
                skipPackageJson: options.framework !== "angular" /* Angular */
            }),
            addTsconfigs(options),
            schematics_1.move(e2eProjectRoot, options.e2eProjectRoot),
            options.e2eTestRunner === 'protractor'
                ? updateE2eProject(options)
                : schematics_1.noop(),
            options.e2eTestRunner === 'cypress'
                ? schematics_1.schematic('cypress-project', __assign({}, options, { project: options.name }))
                : schematics_1.noop(),
            schematics_1.move(appProjectRoot, options.appProjectRoot),
            updateProject(options),
            options.framework !== "angular" /* Angular */
                ? updateBuilders(options)
                : schematics_1.noop(),
            options.framework === "angular" /* Angular */
                ? updateComponentTemplate(options)
                : updateApplicationFiles(options),
            options.framework === "angular" /* Angular */ && options.routing
                ? addRouterRootConfiguration(options)
                : schematics_1.noop(),
            updateDependencies(options),
            updateLinting(options),
            options.unitTestRunner === 'jest'
                ? schematics_1.schematic('jest-project', {
                    project: options.name,
                    supportTsx: options.framework === "react" /* React */,
                    skipSerializers: options.framework !== "angular" /* Angular */,
                    setupFile: options.framework === "angular" /* Angular */
                        ? 'angular'
                        : options.framework === "web-components" /* WebComponents */
                            ? 'web-components'
                            : 'none'
                })
                : schematics_1.noop(),
            options.unitTestRunner === 'karma'
                ? schematics_1.schematic('karma-project', {
                    project: options.name
                })
                : schematics_1.noop(),
            format_files_1.formatFiles(options)
        ])(host, context);
    };
}
exports.default = default_1;
function normalizeOptions(host, options) {
    if (options.framework !== "angular" /* Angular */ && options.routing) {
        throw new Error("Routing is not supported yet with frameworks other than Angular");
    }
    var appDirectory = options.directory
        ? name_utils_1.toFileName(options.directory) + "/" + name_utils_1.toFileName(options.name)
        : name_utils_1.toFileName(options.name);
    var appProjectName = appDirectory.replace(new RegExp('/', 'g'), '-');
    var e2eProjectName = appProjectName + "-e2e";
    var appProjectRoot = "apps/" + appDirectory;
    var e2eProjectRoot = "apps/" + appDirectory + "-e2e";
    var parsedTags = options.tags
        ? options.tags.split(',').map(function (s) { return s.trim(); })
        : [];
    var defaultPrefix = cli_config_utils_1.getNpmScope(host);
    return __assign({}, options, { prefix: options.prefix ? options.prefix : defaultPrefix, name: appProjectName, appProjectRoot: appProjectRoot,
        e2eProjectRoot: e2eProjectRoot,
        e2eProjectName: e2eProjectName,
        parsedTags: parsedTags });
}
