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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var schematics_1 = require("@angular-devkit/schematics");
var testing_utils_1 = require("../../utils/testing-utils");
var test_1 = require("@schematics/angular/utility/test");
var stripJsonComments = require("strip-json-comments");
var ast_utils_1 = require("../../utils/ast-utils");
describe('app', function () {
    var appTree;
    beforeEach(function () {
        appTree = new schematics_1.VirtualTree();
        appTree = testing_utils_1.createEmptyWorkspace(appTree);
    });
    describe('not nested', function () {
        it('should update angular.json', function () { return __awaiter(_this, void 0, void 0, function () {
            var tree, angularJson;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('app', { name: 'myApp' }, appTree)];
                    case 1:
                        tree = _a.sent();
                        angularJson = ast_utils_1.readJsonInTree(tree, '/angular.json');
                        expect(angularJson.projects['my-app'].root).toEqual('apps/my-app/');
                        expect(angularJson.projects['my-app-e2e'].root).toEqual('apps/my-app-e2e');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should update nx.json', function () { return __awaiter(_this, void 0, void 0, function () {
            var tree, nxJson;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('app', { name: 'myApp', tags: 'one,two' }, appTree)];
                    case 1:
                        tree = _a.sent();
                        nxJson = ast_utils_1.readJsonInTree(tree, '/nx.json');
                        expect(nxJson).toEqual({
                            npmScope: 'proj',
                            projects: {
                                'my-app': {
                                    tags: ['one', 'two']
                                },
                                'my-app-e2e': {
                                    tags: []
                                }
                            }
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should generate files', function () { return __awaiter(_this, void 0, void 0, function () {
            var tree, tsconfig, tsconfigApp, tslintJson, tsconfigE2E;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('app', { name: 'myApp' }, appTree)];
                    case 1:
                        tree = _a.sent();
                        expect(tree.exists("apps/my-app/jest.config.js")).toBeTruthy();
                        expect(tree.exists('apps/my-app/src/main.ts')).toBeTruthy();
                        expect(tree.exists('apps/my-app/src/app/app.module.ts')).toBeTruthy();
                        expect(tree.exists('apps/my-app/src/app/app.component.ts')).toBeTruthy();
                        expect(test_1.getFileContent(tree, 'apps/my-app/src/app/app.module.ts')).toContain('class AppModule');
                        tsconfig = ast_utils_1.readJsonInTree(tree, 'apps/my-app/tsconfig.json');
                        expect(tsconfig.extends).toEqual('../../tsconfig.json');
                        expect(tsconfig.compilerOptions.types).toContain('jest');
                        tsconfigApp = JSON.parse(stripJsonComments(test_1.getFileContent(tree, 'apps/my-app/tsconfig.app.json')));
                        expect(tsconfigApp.compilerOptions.outDir).toEqual('../../dist/out-tsc/apps/my-app');
                        expect(tsconfigApp.extends).toEqual('./tsconfig.json');
                        tslintJson = JSON.parse(stripJsonComments(test_1.getFileContent(tree, 'apps/my-app/tslint.json')));
                        expect(tslintJson.extends).toEqual('../../tslint.json');
                        expect(tree.exists('apps/my-app-e2e/cypress.json')).toBeTruthy();
                        tsconfigE2E = JSON.parse(stripJsonComments(test_1.getFileContent(tree, 'apps/my-app-e2e/tsconfig.e2e.json')));
                        // expect(tsconfigE2E.compilerOptions.outDir).toEqual(
                        //   '../../dist/out-tsc/apps/my-app-e2e'
                        // );
                        expect(tsconfigE2E.extends).toEqual('./tsconfig.json');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should default the prefix to npmScope', function () { return __awaiter(_this, void 0, void 0, function () {
            var noPrefix, withPrefix, appE2eSpec, angularJson, myAppPrefix;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('app', { name: 'myApp', e2eTestRunner: 'protractor' }, appTree)];
                    case 1:
                        noPrefix = _a.sent();
                        return [4 /*yield*/, testing_utils_1.runSchematic('app', { name: 'myApp', prefix: 'custom', e2eTestRunner: 'protractor' }, appTree)];
                    case 2:
                        withPrefix = _a.sent();
                        appE2eSpec = noPrefix
                            .read('apps/my-app-e2e/src/app.e2e-spec.ts')
                            .toString();
                        angularJson = JSON.parse(noPrefix.read('angular.json').toString());
                        myAppPrefix = angularJson.projects['my-app'].prefix;
                        expect(myAppPrefix).toEqual('proj');
                        expect(appE2eSpec).toContain('Welcome to my-app!');
                        // Testing WITH prefix
                        appE2eSpec = withPrefix
                            .read('apps/my-app-e2e/src/app.e2e-spec.ts')
                            .toString();
                        angularJson = JSON.parse(withPrefix.read('angular.json').toString());
                        myAppPrefix = angularJson.projects['my-app'].prefix;
                        expect(myAppPrefix).toEqual('custom');
                        expect(appE2eSpec).toContain('Welcome to my-app!');
                        return [2 /*return*/];
                }
            });
        }); });
        xit('should work if the new project root is changed', function () { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.schematicRunner
                            .callRule(ast_utils_1.updateJsonInTree('/angular.json', function (json) { return (__assign({}, json, { newProjectRoot: 'newProjectRoot' })); }), appTree)
                            .toPromise()];
                    case 1:
                        appTree = _a.sent();
                        return [4 /*yield*/, testing_utils_1.runSchematic('app', { name: 'myApp' }, appTree)];
                    case 2:
                        result = _a.sent();
                        expect(result.exists('apps/my-app/src/main.ts')).toEqual(true);
                        expect(result.exists('apps/my-app-e2e/protractor.conf.js')).toEqual(true);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('nested', function () {
        it('should update angular.json', function () { return __awaiter(_this, void 0, void 0, function () {
            var tree, angularJson;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('app', { name: 'myApp', directory: 'myDir' }, appTree)];
                    case 1:
                        tree = _a.sent();
                        angularJson = ast_utils_1.readJsonInTree(tree, '/angular.json');
                        expect(angularJson.projects['my-dir-my-app'].root).toEqual('apps/my-dir/my-app/');
                        expect(angularJson.projects['my-dir-my-app-e2e'].root).toEqual('apps/my-dir/my-app-e2e');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should update nx.json', function () { return __awaiter(_this, void 0, void 0, function () {
            var tree, nxJson;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('app', { name: 'myApp', directory: 'myDir', tags: 'one,two' }, appTree)];
                    case 1:
                        tree = _a.sent();
                        nxJson = ast_utils_1.readJsonInTree(tree, '/nx.json');
                        expect(nxJson).toEqual({
                            npmScope: 'proj',
                            projects: {
                                'my-dir-my-app': {
                                    tags: ['one', 'two']
                                },
                                'my-dir-my-app-e2e': {
                                    tags: []
                                }
                            }
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should generate files', function () { return __awaiter(_this, void 0, void 0, function () {
            var hasJsonValue, tree, appModulePath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        hasJsonValue = function (_a) {
                            var path = _a.path, expectedValue = _a.expectedValue, lookupFn = _a.lookupFn;
                            var content = test_1.getFileContent(tree, path);
                            var config = JSON.parse(stripJsonComments(content));
                            expect(lookupFn(config)).toEqual(expectedValue);
                        };
                        return [4 /*yield*/, testing_utils_1.runSchematic('app', { name: 'myApp', directory: 'myDir' }, appTree)];
                    case 1:
                        tree = _a.sent();
                        appModulePath = 'apps/my-dir/my-app/src/app/app.module.ts';
                        expect(test_1.getFileContent(tree, appModulePath)).toContain('class AppModule');
                        // Make sure these exist
                        [
                            "apps/my-dir/my-app/jest.config.js",
                            'apps/my-dir/my-app/src/main.ts',
                            'apps/my-dir/my-app/src/app/app.module.ts',
                            'apps/my-dir/my-app/src/app/app.component.ts',
                            'apps/my-dir/my-app-e2e/cypress.json'
                        ].forEach(function (path) {
                            expect(tree.exists(path)).toBeTruthy();
                        });
                        // Make sure these have properties
                        [
                            {
                                path: 'apps/my-dir/my-app/tsconfig.json',
                                lookupFn: function (json) { return json.extends; },
                                expectedValue: '../../../tsconfig.json'
                            },
                            {
                                path: 'apps/my-dir/my-app/tsconfig.app.json',
                                lookupFn: function (json) { return json.compilerOptions.outDir; },
                                expectedValue: '../../../dist/out-tsc/apps/my-dir/my-app'
                            },
                            {
                                path: 'apps/my-dir/my-app-e2e/tsconfig.json',
                                lookupFn: function (json) { return json.extends; },
                                expectedValue: '../../../tsconfig.json'
                            },
                            // {
                            //   path: 'apps/my-dir/my-app-e2e/tsconfig.e2e.json',
                            //   lookupFn: json => json.compilerOptions.outDir,
                            //   expectedValue: '../../../dist/out-tsc/apps/my-dir/my-app-e2e'
                            // },
                            {
                                path: 'apps/my-dir/my-app/tslint.json',
                                lookupFn: function (json) { return json.extends; },
                                expectedValue: '../../../tslint.json'
                            }
                        ].forEach(hasJsonValue);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('routing', function () {
        it('should include RouterTestingModule', function () { return __awaiter(_this, void 0, void 0, function () {
            var tree;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('app', { name: 'myApp', directory: 'myDir', routing: true }, appTree)];
                    case 1:
                        tree = _a.sent();
                        expect(test_1.getFileContent(tree, 'apps/my-dir/my-app/src/app/app.module.ts')).toContain('RouterModule.forRoot');
                        expect(test_1.getFileContent(tree, 'apps/my-dir/my-app/src/app/app.component.spec.ts')).toContain('imports: [RouterTestingModule]');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not modify tests when --skip-tests is set', function () { return __awaiter(_this, void 0, void 0, function () {
            var tree;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('app', { name: 'myApp', directory: 'myDir', routing: true, skipTests: true }, appTree)];
                    case 1:
                        tree = _a.sent();
                        expect(tree.exists('apps/my-dir/my-app/src/app/app.component.spec.ts')).toBeFalsy();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('template generation mode', function () {
        it('should create Nx specific `app.component.html` template', function () { return __awaiter(_this, void 0, void 0, function () {
            var tree;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('app', { name: 'myApp', directory: 'myDir' }, appTree)];
                    case 1:
                        tree = _a.sent();
                        expect(test_1.getFileContent(tree, 'apps/my-dir/my-app/src/app/app.component.html')).toBeTruthy();
                        expect(test_1.getFileContent(tree, 'apps/my-dir/my-app/src/app/app.component.html')).toContain('This is an Angular app built with');
                        return [2 /*return*/];
                }
            });
        }); });
        it("should update `template`'s property of AppComponent with Nx content", function () { return __awaiter(_this, void 0, void 0, function () {
            var tree;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('app', { name: 'myApp', directory: 'myDir', inlineTemplate: true }, appTree)];
                    case 1:
                        tree = _a.sent();
                        expect(test_1.getFileContent(tree, 'apps/my-dir/my-app/src/app/app.component.ts')).toContain('This is an Angular app built with');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('--style scss', function () {
        it('should generate scss styles', function () { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('app', { name: 'myApp', style: 'scss' }, appTree)];
                    case 1:
                        result = _a.sent();
                        expect(result.exists('apps/my-app/src/app/app.component.scss')).toEqual(true);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should set it as default', function () { return __awaiter(_this, void 0, void 0, function () {
            var result, angularJson;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('app', { name: 'myApp', style: 'scss' }, appTree)];
                    case 1:
                        result = _a.sent();
                        angularJson = ast_utils_1.readJsonInTree(result, 'angular.json');
                        expect(angularJson.projects['my-app'].schematics).toEqual({
                            '@nrwl/schematics:component': {
                                style: 'scss'
                            }
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('--unit-test-runner karma', function () {
        it('should generate a karma config', function () { return __awaiter(_this, void 0, void 0, function () {
            var tree, angularJson, tsconfigAppJson;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('app', { name: 'myApp', unitTestRunner: 'karma' }, appTree)];
                    case 1:
                        tree = _a.sent();
                        expect(tree.exists('apps/my-app/tsconfig.spec.json')).toBeTruthy();
                        expect(tree.exists('apps/my-app/karma.conf.js')).toBeTruthy();
                        angularJson = ast_utils_1.readJsonInTree(tree, 'angular.json');
                        expect(angularJson.projects['my-app'].architect.test.builder).toEqual('@angular-devkit/build-angular:karma');
                        expect(angularJson.projects['my-app'].architect.lint.options.tsConfig).toEqual([
                            'apps/my-app/tsconfig.app.json',
                            'apps/my-app/tsconfig.spec.json'
                        ]);
                        tsconfigAppJson = ast_utils_1.readJsonInTree(tree, 'apps/my-app/tsconfig.app.json');
                        expect(tsconfigAppJson.exclude).toEqual(['src/test.ts', '**/*.spec.ts']);
                        expect(tsconfigAppJson.compilerOptions.outDir).toEqual('../../dist/out-tsc/apps/my-app');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('--framework', function () {
        describe('web-components', function () {
            it('should replace app files', function () { return __awaiter(_this, void 0, void 0, function () {
                var tree;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testing_utils_1.runSchematic('app', { name: 'myApp', framework: "web-components" /* WebComponents */ }, appTree)];
                        case 1:
                            tree = _a.sent();
                            expect(tree.exists('apps/my-app/src/main.ts')).toBeTruthy();
                            expect(tree.exists('apps/my-app/src/app/app.component.ts')).toBeFalsy();
                            expect(tree.exists('apps/my-app/src/app/app.component.css')).toBeFalsy();
                            expect(tree.exists('apps/my-app/src/app/app.component.html')).toBeFalsy();
                            expect(tree.exists('apps/my-app/src/app/app.component.spec.ts')).toBeFalsy();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('react', function () {
            it('should replace app files', function () { return __awaiter(_this, void 0, void 0, function () {
                var tree;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testing_utils_1.runSchematic('app', {
                                name: 'my-App',
                                framework: "react" /* React */
                            }, appTree)];
                        case 1:
                            tree = _a.sent();
                            expect(tree.exists('apps/my-app/src/main.ts')).toBeFalsy();
                            expect(tree.exists('apps/my-app/src/app/app.component.ts')).toBeFalsy();
                            expect(tree.exists('apps/my-app/src/app/app.component.css')).toBeFalsy();
                            expect(tree.exists('apps/my-app/src/app/app.component.html')).toBeFalsy();
                            expect(tree.exists('apps/my-app/src/app/app.component.spec.ts')).toBeFalsy();
                            expect(tree.exists('apps/my-app/src/main.tsx')).toBeTruthy();
                            expect(tree.exists('apps/my-app/src/app/app.tsx')).toBeTruthy();
                            expect(tree.exists('apps/my-app/src/app/app.spec.tsx')).toBeTruthy();
                            expect(tree.exists('apps/my-app/src/app/app.css')).toBeTruthy();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should setup jest with tsx support', function () { return __awaiter(_this, void 0, void 0, function () {
                var tree;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testing_utils_1.runSchematic('app', {
                                name: 'my-App',
                                framework: "react" /* React */
                            }, appTree)];
                        case 1:
                            tree = _a.sent();
                            expect(tree.readContent('apps/my-app/jest.config.js')).toContain("moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],");
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should setup jest without serializers', function () { return __awaiter(_this, void 0, void 0, function () {
                var tree;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testing_utils_1.runSchematic('app', {
                                name: 'my-App',
                                framework: "react" /* React */
                            }, appTree)];
                        case 1:
                            tree = _a.sent();
                            expect(tree.readContent('apps/my-app/jest.config.js')).not.toContain("'jest-preset-angular/AngularSnapshotSerializer.js',");
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should remove the extract-i18n target', function () { return __awaiter(_this, void 0, void 0, function () {
                var tree, angularJson, architectConfig;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testing_utils_1.runSchematic('app', {
                                name: 'my-App',
                                framework: "react" /* React */
                            }, appTree)];
                        case 1:
                            tree = _a.sent();
                            angularJson = ast_utils_1.readJsonInTree(tree, 'angular.json');
                            architectConfig = angularJson.projects['my-app'].architect;
                            expect(architectConfig['extract-i18n']).not.toBeDefined();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should setup the nrwl web build builder', function () { return __awaiter(_this, void 0, void 0, function () {
                var tree, angularJson, architectConfig;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testing_utils_1.runSchematic('app', {
                                name: 'my-App',
                                framework: "react" /* React */
                            }, appTree)];
                        case 1:
                            tree = _a.sent();
                            angularJson = ast_utils_1.readJsonInTree(tree, 'angular.json');
                            architectConfig = angularJson.projects['my-app'].architect;
                            expect(architectConfig.build.builder).toEqual('@nrwl/builders:web-build');
                            expect(architectConfig.build.options).toEqual({
                                assets: ['apps/my-app/src/favicon.ico', 'apps/my-app/src/assets'],
                                index: 'apps/my-app/src/index.html',
                                main: 'apps/my-app/src/main.tsx',
                                outputPath: 'dist/apps/my-app',
                                polyfills: 'apps/my-app/src/polyfills.ts',
                                scripts: [],
                                styles: ['apps/my-app/src/styles.css'],
                                tsConfig: 'apps/my-app/tsconfig.app.json'
                            });
                            expect(architectConfig.build.configurations.production).toEqual({
                                optimization: true,
                                budgets: [
                                    {
                                        maximumError: '5mb',
                                        maximumWarning: '2mb',
                                        type: 'initial'
                                    }
                                ],
                                extractCss: true,
                                extractLicenses: true,
                                fileReplacements: [
                                    {
                                        replace: 'apps/my-app/src/environments/environment.ts',
                                        with: 'apps/my-app/src/environments/environment.prod.ts'
                                    }
                                ],
                                namedChunks: false,
                                outputHashing: 'all',
                                sourceMap: false,
                                vendorChunk: false
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should setup the nrwl web dev server builder', function () { return __awaiter(_this, void 0, void 0, function () {
                var tree, angularJson, architectConfig;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testing_utils_1.runSchematic('app', {
                                name: 'my-App',
                                framework: "react" /* React */
                            }, appTree)];
                        case 1:
                            tree = _a.sent();
                            angularJson = ast_utils_1.readJsonInTree(tree, 'angular.json');
                            architectConfig = angularJson.projects['my-app'].architect;
                            expect(architectConfig.serve.builder).toEqual('@nrwl/builders:web-dev-server');
                            expect(architectConfig.serve.options).toEqual({
                                buildTarget: 'my-app:build'
                            });
                            expect(architectConfig.serve.configurations.production).toEqual({
                                buildTarget: 'my-app:build:production'
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('--unit-test-runner none', function () {
        it('should not generate test configuration', function () { return __awaiter(_this, void 0, void 0, function () {
            var tree, angularJson;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('app', { name: 'myApp', unitTestRunner: 'none' }, appTree)];
                    case 1:
                        tree = _a.sent();
                        expect(tree.exists('apps/my-app/src/test-setup.ts')).toBeFalsy();
                        expect(tree.exists('apps/my-app/src/test.ts')).toBeFalsy();
                        expect(tree.exists('apps/my-app/tsconfig.spec.json')).toBeFalsy();
                        expect(tree.exists('apps/my-app/jest.config.js')).toBeFalsy();
                        expect(tree.exists('apps/my-app/karma.config.js')).toBeFalsy();
                        angularJson = ast_utils_1.readJsonInTree(tree, 'angular.json');
                        expect(angularJson.projects['my-app'].architect.test).toBeUndefined();
                        expect(angularJson.projects['my-app'].architect.lint.options.tsConfig).toEqual(['apps/my-app/tsconfig.app.json']);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('--e2e-test-runner none', function () {
        it('should not generate test configuration', function () { return __awaiter(_this, void 0, void 0, function () {
            var tree, angularJson;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('app', { name: 'myApp', e2eTestRunner: 'none' }, appTree)];
                    case 1:
                        tree = _a.sent();
                        expect(tree.exists('apps/my-app-e2e')).toBeFalsy();
                        angularJson = ast_utils_1.readJsonInTree(tree, 'angular.json');
                        expect(angularJson.projects['my-app-e2e']).toBeUndefined();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('replaceAppNameWithPath', function () {
        it('should protect `angular.json` commands and properties', function () { return __awaiter(_this, void 0, void 0, function () {
            var tree, angularJson;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('app', { name: 'ui' }, appTree)];
                    case 1:
                        tree = _a.sent();
                        angularJson = ast_utils_1.readJsonInTree(tree, 'angular.json');
                        expect(angularJson.projects['ui']).toBeDefined();
                        expect(angularJson.projects['ui']['architect']['build']['builder']).toEqual('@angular-devkit/build-angular:browser');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should protect `angular.json` sensible properties value to be renamed', function () { return __awaiter(_this, void 0, void 0, function () {
            var tree, angularJson;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('app', { name: 'ui', prefix: 'ui' }, appTree)];
                    case 1:
                        tree = _a.sent();
                        angularJson = ast_utils_1.readJsonInTree(tree, 'angular.json');
                        expect(angularJson.projects['ui'].prefix).toEqual('ui');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
