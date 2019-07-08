"use strict";
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
describe('lib', function () {
    var appTree;
    beforeEach(function () {
        appTree = new schematics_1.VirtualTree();
        appTree = testing_utils_1.createEmptyWorkspace(appTree);
    });
    describe('not nested', function () {
        it('should update ng-package.json', function () { return __awaiter(_this, void 0, void 0, function () {
            var publishableTree, ngPackage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('lib', { name: 'myLib', framework: 'angular', publishable: true }, appTree)];
                    case 1:
                        publishableTree = _a.sent();
                        ngPackage = ast_utils_1.readJsonInTree(publishableTree, 'libs/my-lib/ng-package.json');
                        expect(ngPackage.dest).toEqual('../../dist/libs/my-lib');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not update package.json by default', function () { return __awaiter(_this, void 0, void 0, function () {
            var tree, packageJson;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('lib', { name: 'myLib' }, appTree)];
                    case 1:
                        tree = _a.sent();
                        packageJson = ast_utils_1.readJsonInTree(tree, '/package.json');
                        expect(packageJson.devDependencies['ng-packagr']).toBeUndefined();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should update package.json when publishable', function () { return __awaiter(_this, void 0, void 0, function () {
            var tree, packageJson;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('lib', { name: 'myLib', framework: 'angular', publishable: true }, appTree)];
                    case 1:
                        tree = _a.sent();
                        packageJson = ast_utils_1.readJsonInTree(tree, '/package.json');
                        expect(packageJson.devDependencies['ng-packagr']).toBeDefined();
                        return [2 /*return*/];
                }
            });
        }); });
        it("should update npmScope of lib's package.json when publishable", function () { return __awaiter(_this, void 0, void 0, function () {
            var tree, packageJson;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('lib', { name: 'myLib', framework: 'angular', publishable: true }, appTree)];
                    case 1:
                        tree = _a.sent();
                        packageJson = ast_utils_1.readJsonInTree(tree, '/libs/my-lib/package.json');
                        expect(packageJson.name).toEqual('@proj/my-lib');
                        return [2 /*return*/];
                }
            });
        }); });
        it("should update npmScope of lib's package.json when publishable", function () { return __awaiter(_this, void 0, void 0, function () {
            var tree, packageJson;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('lib', { name: 'myLib', publishable: true, prefix: 'lib' }, appTree)];
                    case 1:
                        tree = _a.sent();
                        packageJson = ast_utils_1.readJsonInTree(tree, '/libs/my-lib/package.json');
                        expect(packageJson.name).toEqual('@proj/my-lib');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should update angular.json', function () { return __awaiter(_this, void 0, void 0, function () {
            var tree, angularJson;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('lib', { name: 'myLib', framework: 'angular', publishable: true }, appTree)];
                    case 1:
                        tree = _a.sent();
                        angularJson = ast_utils_1.readJsonInTree(tree, '/angular.json');
                        expect(angularJson.projects['my-lib'].root).toEqual('libs/my-lib');
                        expect(angularJson.projects['my-lib'].architect.build).toBeDefined();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should remove "build" target from angular.json when a library is not publishable', function () { return __awaiter(_this, void 0, void 0, function () {
            var tree, angularJson;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('lib', { name: 'myLib', publishable: false }, appTree)];
                    case 1:
                        tree = _a.sent();
                        angularJson = ast_utils_1.readJsonInTree(tree, '/angular.json');
                        expect(angularJson.projects['my-lib'].root).toEqual('libs/my-lib');
                        expect(angularJson.projects['my-lib'].architect.build).not.toBeDefined();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should update nx.json', function () { return __awaiter(_this, void 0, void 0, function () {
            var tree, nxJson;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('lib', { name: 'myLib', tags: 'one,two' }, appTree)];
                    case 1:
                        tree = _a.sent();
                        nxJson = ast_utils_1.readJsonInTree(tree, '/nx.json');
                        expect(nxJson).toEqual({
                            npmScope: 'proj',
                            projects: {
                                'my-lib': {
                                    tags: ['one', 'two']
                                }
                            }
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should update root tsconfig.json', function () { return __awaiter(_this, void 0, void 0, function () {
            var tree, tsconfigJson;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('lib', { name: 'myLib' }, appTree)];
                    case 1:
                        tree = _a.sent();
                        tsconfigJson = ast_utils_1.readJsonInTree(tree, '/tsconfig.json');
                        expect(tsconfigJson.compilerOptions.paths['@proj/my-lib']).toEqual([
                            'libs/my-lib/src/index.ts'
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should create a local tsconfig.json', function () { return __awaiter(_this, void 0, void 0, function () {
            var tree, tsconfigJson;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('lib', { name: 'myLib' }, appTree)];
                    case 1:
                        tree = _a.sent();
                        tsconfigJson = ast_utils_1.readJsonInTree(tree, 'libs/my-lib/tsconfig.json');
                        expect(tsconfigJson).toEqual({
                            extends: '../../tsconfig.json',
                            compilerOptions: {
                                types: ['node', 'jest']
                            },
                            include: ['**/*.ts']
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should extend the local tsconfig.json with tsconfig.spec.json', function () { return __awaiter(_this, void 0, void 0, function () {
            var tree, tsconfigJson;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('lib', { name: 'myLib' }, appTree)];
                    case 1:
                        tree = _a.sent();
                        tsconfigJson = ast_utils_1.readJsonInTree(tree, 'libs/my-lib/tsconfig.spec.json');
                        expect(tsconfigJson.extends).toEqual('./tsconfig.json');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should extend the local tsconfig.json with tsconfig.lib.json', function () { return __awaiter(_this, void 0, void 0, function () {
            var tree, tsconfigJson;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('lib', { name: 'myLib' }, appTree)];
                    case 1:
                        tree = _a.sent();
                        tsconfigJson = ast_utils_1.readJsonInTree(tree, 'libs/my-lib/tsconfig.lib.json');
                        expect(tsconfigJson.extends).toEqual('./tsconfig.json');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should generate files', function () { return __awaiter(_this, void 0, void 0, function () {
            var tree, tree2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('lib', { name: 'myLib', framework: 'angular' }, appTree)];
                    case 1:
                        tree = _a.sent();
                        expect(tree.exists("libs/my-lib/jest.config.js")).toBeTruthy();
                        expect(tree.exists('libs/my-lib/src/index.ts')).toBeTruthy();
                        expect(tree.exists('libs/my-lib/src/lib/my-lib.module.ts')).toBeTruthy();
                        expect(tree.exists('libs/my-lib/src/lib/my-lib.component.ts')).toBeFalsy();
                        expect(tree.exists('libs/my-lib/src/lib/my-lib.component.spec.ts')).toBeFalsy();
                        expect(tree.exists('libs/my-lib/src/lib/my-lib.service.ts')).toBeFalsy();
                        expect(tree.exists('libs/my-lib/src/lib/my-lib.service.spec.ts')).toBeFalsy();
                        return [4 /*yield*/, testing_utils_1.runSchematic('lib', { name: 'myLib2', framework: 'angular', simpleModuleName: true }, tree)];
                    case 2:
                        tree2 = _a.sent();
                        expect(tree2.exists("libs/my-lib2/jest.config.js")).toBeTruthy();
                        expect(tree2.exists('libs/my-lib2/src/index.ts')).toBeTruthy();
                        expect(tree2.exists('libs/my-lib2/src/lib/my-lib2.module.ts')).toBeTruthy();
                        expect(tree.exists('libs/my-lib2/src/lib/my-lib2.component.ts')).toBeFalsy();
                        expect(tree.exists('libs/my-lib2/src/lib/my-lib2.component.spec.ts')).toBeFalsy();
                        expect(tree2.exists('libs/my-lib2/src/lib/my-lib2.service.ts')).toBeFalsy();
                        expect(tree2.exists('libs/my-lib2/src/lib/my-lib2.service.spec.ts')).toBeFalsy();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not generate a module for --module false', function () { return __awaiter(_this, void 0, void 0, function () {
            var tree;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('lib', { name: 'myLib', module: false }, appTree)];
                    case 1:
                        tree = _a.sent();
                        expect(tree.exists('libs/my-lib/src/lib/my-lib.module.ts')).toEqual(false);
                        expect(tree.exists('libs/my-lib/src/lib/my-lib.module.spec.ts')).toEqual(false);
                        expect(tree.exists('libs/my-lib/src/lib/.gitkeep')).toEqual(true);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should default the prefix to npmScope', function () { return __awaiter(_this, void 0, void 0, function () {
            var noPrefix, withPrefix;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('lib', { name: 'myLib' }, appTree)];
                    case 1:
                        noPrefix = _a.sent();
                        expect(JSON.parse(noPrefix.read('angular.json').toString()).projects['my-lib']
                            .prefix).toEqual('proj');
                        return [4 /*yield*/, testing_utils_1.runSchematic('lib', { name: 'myLib', prefix: 'custom' }, appTree)];
                    case 2:
                        withPrefix = _a.sent();
                        expect(JSON.parse(withPrefix.read('angular.json').toString()).projects['my-lib'].prefix).toEqual('custom');
                        return [2 /*return*/];
                }
            });
        }); });
        describe('--framework', function () {
            describe('react', function () {
                var tree;
                beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, testing_utils_1.runSchematic('lib', {
                                    name: 'home',
                                    framework: 'react'
                                }, appTree)];
                            case 1:
                                tree = _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should generate a basic react lib', function () {
                    expect(tree.exists('libs/home/src/lib/home.module.ts')).toEqual(false);
                    expect(tree.exists('libs/home/src/lib/home.module.spec.ts')).toEqual(false);
                    expect(tree.exists('libs/home/src/lib/home.css')).toEqual(true);
                    expect(tree.exists('libs/home/src/lib/home.tsx')).toEqual(true);
                    expect(tree.exists('libs/home/src/lib/home.spec.tsx')).toEqual(true);
                    expect(ast_utils_1.readJsonInTree(tree, 'libs/home/tsconfig.json').compilerOptions.jsx).toEqual('react');
                    expect(tree.readContent('libs/home/src/lib/home.tsx')).toContain('<div>home works!</div>');
                    expect(tree.readContent('libs/home/src/lib/home.tsx')).toContain('export class Home extends Component {');
                    expect(tree.readContent('libs/home/src/lib/home.spec.tsx')).toContain("describe('Home', () => {");
                });
            });
            describe('none', function () {
                var tree;
                beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, testing_utils_1.runSchematic('lib', {
                                    name: 'myLib',
                                    framework: 'none'
                                }, appTree)];
                            case 1:
                                tree = _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should generate a basic typescript lib', function () {
                    expect(tree.exists('libs/my-dir/my-lib/src/lib/my-dir-my-lib.module.ts')).toEqual(false);
                    expect(tree.exists('libs/my-dir/my-lib/src/lib/my-dir-my-lib.module.spec.ts')).toEqual(false);
                });
            });
        });
    });
    describe('nested', function () {
        it('should update nx.json', function () { return __awaiter(_this, void 0, void 0, function () {
            var tree, nxJson, tree2, nxJson2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('lib', {
                            name: 'myLib',
                            directory: 'myDir',
                            framework: 'angular',
                            tags: 'one'
                        }, appTree)];
                    case 1:
                        tree = _a.sent();
                        nxJson = ast_utils_1.readJsonInTree(tree, '/nx.json');
                        expect(nxJson).toEqual({
                            npmScope: 'proj',
                            projects: {
                                'my-dir-my-lib': {
                                    tags: ['one']
                                }
                            }
                        });
                        return [4 /*yield*/, testing_utils_1.runSchematic('lib', {
                                name: 'myLib2',
                                directory: 'myDir',
                                framework: 'angular',
                                tags: 'one,two',
                                simpleModuleName: true
                            }, tree)];
                    case 2:
                        tree2 = _a.sent();
                        nxJson2 = ast_utils_1.readJsonInTree(tree2, '/nx.json');
                        expect(nxJson2).toEqual({
                            npmScope: 'proj',
                            projects: {
                                'my-dir-my-lib': {
                                    tags: ['one']
                                },
                                'my-dir-my-lib2': {
                                    tags: ['one', 'two']
                                }
                            }
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should generate files', function () { return __awaiter(_this, void 0, void 0, function () {
            var tree, tree2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('lib', { name: 'myLib', directory: 'myDir', framework: 'angular' }, appTree)];
                    case 1:
                        tree = _a.sent();
                        expect(tree.exists("libs/my-dir/my-lib/jest.config.js")).toBeTruthy();
                        expect(tree.exists('libs/my-dir/my-lib/src/index.ts')).toBeTruthy();
                        expect(tree.exists('libs/my-dir/my-lib/src/lib/my-dir-my-lib.module.ts')).toBeTruthy();
                        expect(tree.exists('libs/my-dir/my-lib/src/lib/my-lib.component.ts')).toBeFalsy();
                        expect(tree.exists('libs/my-dir/my-lib/src/lib/my-lib.component.spec.ts')).toBeFalsy();
                        expect(tree.exists('libs/my-dir/my-lib/src/lib/my-lib.service.ts')).toBeFalsy();
                        expect(tree.exists('libs/my-dir/my-lib/src/lib/my-lib.service.spec.ts')).toBeFalsy();
                        return [4 /*yield*/, testing_utils_1.runSchematic('lib', {
                                name: 'myLib2',
                                directory: 'myDir',
                                framework: 'angular',
                                simpleModuleName: true
                            }, tree)];
                    case 2:
                        tree2 = _a.sent();
                        expect(tree2.exists("libs/my-dir/my-lib2/jest.config.js")).toBeTruthy();
                        expect(tree2.exists('libs/my-dir/my-lib2/src/index.ts')).toBeTruthy();
                        expect(tree2.exists('libs/my-dir/my-lib2/src/lib/my-lib2.module.ts')).toBeTruthy();
                        expect(tree2.exists('libs/my-dir/my-lib2/src/lib/my-lib2.component.ts')).toBeFalsy();
                        expect(tree2.exists('libs/my-dir/my-lib2/src/lib/my-lib2.component.spec.ts')).toBeFalsy();
                        expect(tree2.exists('libs/my-dir/my-lib2/src/lib/my-lib2.service.ts')).toBeFalsy();
                        expect(tree2.exists('libs/my-dir/my-lib2/src/lib/my-lib2.service.spec.ts')).toBeFalsy();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should update ng-package.json', function () { return __awaiter(_this, void 0, void 0, function () {
            var publishableTree, ngPackage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('lib', {
                            name: 'myLib',
                            directory: 'myDir',
                            framework: 'angular',
                            publishable: true
                        }, appTree)];
                    case 1:
                        publishableTree = _a.sent();
                        ngPackage = ast_utils_1.readJsonInTree(publishableTree, 'libs/my-dir/my-lib/ng-package.json');
                        expect(ngPackage.dest).toEqual('../../../dist/libs/my-dir/my-lib');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should update angular.json', function () { return __awaiter(_this, void 0, void 0, function () {
            var tree, angularJson;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('lib', { name: 'myLib', directory: 'myDir' }, appTree)];
                    case 1:
                        tree = _a.sent();
                        angularJson = ast_utils_1.readJsonInTree(tree, '/angular.json');
                        expect(angularJson.projects['my-dir-my-lib'].root).toEqual('libs/my-dir/my-lib');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should update tsconfig.json', function () { return __awaiter(_this, void 0, void 0, function () {
            var tree, tsconfigJson;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('lib', { name: 'myLib', directory: 'myDir' }, appTree)];
                    case 1:
                        tree = _a.sent();
                        tsconfigJson = ast_utils_1.readJsonInTree(tree, '/tsconfig.json');
                        expect(tsconfigJson.compilerOptions.paths['@proj/my-dir/my-lib']).toEqual(['libs/my-dir/my-lib/src/index.ts']);
                        expect(tsconfigJson.compilerOptions.paths['my-dir-my-lib/*']).toBeUndefined();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should create a local tsconfig.json', function () { return __awaiter(_this, void 0, void 0, function () {
            var tree, tsconfigJson;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('lib', { name: 'myLib', directory: 'myDir' }, appTree)];
                    case 1:
                        tree = _a.sent();
                        tsconfigJson = ast_utils_1.readJsonInTree(tree, 'libs/my-dir/my-lib/tsconfig.json');
                        expect(tsconfigJson).toEqual({
                            extends: '../../../tsconfig.json',
                            compilerOptions: {
                                types: ['node', 'jest']
                            },
                            include: ['**/*.ts']
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not generate a module for --module false', function () { return __awaiter(_this, void 0, void 0, function () {
            var tree;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('lib', { name: 'myLib', directory: 'myDir', module: false }, appTree)];
                    case 1:
                        tree = _a.sent();
                        expect(tree.exists('libs/my-dir/my-lib/src/lib/my-dir-my-lib.module.ts')).toEqual(false);
                        expect(tree.exists('libs/my-dir/my-lib/src/lib/my-dir-my-lib.module.spec.ts')).toEqual(false);
                        expect(tree.exists('libs/my-dir/my-lib/src/lib/.gitkeep')).toEqual(true);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('router', function () {
        it('should error when lazy is set without routing', function () { return __awaiter(_this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, testing_utils_1.runSchematic('lib', { name: 'myLib', lazy: true }, appTree)];
                    case 1:
                        _a.sent();
                        fail();
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        expect(e_1.message).toEqual('routing must be set');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        describe('lazy', function () {
            it('should add RouterModule.forChild', function () { return __awaiter(_this, void 0, void 0, function () {
                var tree, tree2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testing_utils_1.runSchematic('lib', {
                                name: 'myLib',
                                directory: 'myDir',
                                framework: 'angular',
                                routing: true,
                                lazy: true
                            }, appTree)];
                        case 1:
                            tree = _a.sent();
                            expect(tree.exists('libs/my-dir/my-lib/src/lib/my-dir-my-lib.module.ts')).toBeTruthy();
                            expect(test_1.getFileContent(tree, 'libs/my-dir/my-lib/src/lib/my-dir-my-lib.module.ts')).toContain('RouterModule.forChild');
                            return [4 /*yield*/, testing_utils_1.runSchematic('lib', {
                                    name: 'myLib2',
                                    directory: 'myDir',
                                    routing: true,
                                    framework: 'angular',
                                    lazy: true,
                                    simpleModuleName: true
                                }, tree)];
                        case 2:
                            tree2 = _a.sent();
                            expect(tree2.exists('libs/my-dir/my-lib2/src/lib/my-lib2.module.ts')).toBeTruthy();
                            expect(test_1.getFileContent(tree2, 'libs/my-dir/my-lib2/src/lib/my-lib2.module.ts')).toContain('RouterModule.forChild');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should update the parent module', function () { return __awaiter(_this, void 0, void 0, function () {
                var tree, moduleContents, tsConfigAppJson, tree2, moduleContents2, tsConfigAppJson2, tree3, moduleContents3, tsConfigAppJson3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            appTree = testing_utils_1.createApp(appTree, 'myapp');
                            return [4 /*yield*/, testing_utils_1.runSchematic('lib', {
                                    name: 'myLib',
                                    directory: 'myDir',
                                    routing: true,
                                    lazy: true,
                                    framework: 'angular',
                                    parentModule: 'apps/myapp/src/app/app.module.ts'
                                }, appTree)];
                        case 1:
                            tree = _a.sent();
                            moduleContents = test_1.getFileContent(tree, 'apps/myapp/src/app/app.module.ts');
                            expect(moduleContents).toContain('RouterModule.forRoot([');
                            expect(moduleContents).toContain("{path: 'my-dir-my-lib', loadChildren: '@proj/my-dir/my-lib#MyDirMyLibModule'}");
                            tsConfigAppJson = JSON.parse(stripJsonComments(test_1.getFileContent(tree, 'apps/myapp/tsconfig.app.json')));
                            expect(tsConfigAppJson.include).toEqual([
                                '**/*.ts',
                                '../../libs/my-dir/my-lib/src/index.ts'
                            ]);
                            return [4 /*yield*/, testing_utils_1.runSchematic('lib', {
                                    name: 'myLib2',
                                    directory: 'myDir',
                                    routing: true,
                                    framework: 'angular',
                                    lazy: true,
                                    parentModule: 'apps/myapp/src/app/app.module.ts'
                                }, tree)];
                        case 2:
                            tree2 = _a.sent();
                            moduleContents2 = test_1.getFileContent(tree2, 'apps/myapp/src/app/app.module.ts');
                            expect(moduleContents2).toContain('RouterModule.forRoot([');
                            expect(moduleContents2).toContain("{path: 'my-dir-my-lib', loadChildren: '@proj/my-dir/my-lib#MyDirMyLibModule'}");
                            expect(moduleContents2).toContain("{path: 'my-dir-my-lib', loadChildren: '@proj/my-dir/my-lib#MyDirMyLibModule'}");
                            expect(moduleContents2).toContain("{path: 'my-dir-my-lib2', loadChildren: '@proj/my-dir/my-lib2#MyDirMyLib2Module'}");
                            tsConfigAppJson2 = JSON.parse(stripJsonComments(test_1.getFileContent(tree2, 'apps/myapp/tsconfig.app.json')));
                            expect(tsConfigAppJson2.include).toEqual([
                                '**/*.ts',
                                '../../libs/my-dir/my-lib/src/index.ts',
                                '../../libs/my-dir/my-lib2/src/index.ts'
                            ]);
                            return [4 /*yield*/, testing_utils_1.runSchematic('lib', {
                                    name: 'myLib3',
                                    directory: 'myDir',
                                    routing: true,
                                    framework: 'angular',
                                    lazy: true,
                                    parentModule: 'apps/myapp/src/app/app.module.ts',
                                    simpleModuleName: true
                                }, tree2)];
                        case 3:
                            tree3 = _a.sent();
                            moduleContents3 = test_1.getFileContent(tree3, 'apps/myapp/src/app/app.module.ts');
                            expect(moduleContents3).toContain('RouterModule.forRoot([');
                            expect(moduleContents3).toContain("{path: 'my-dir-my-lib', loadChildren: '@proj/my-dir/my-lib#MyDirMyLibModule'}");
                            expect(moduleContents3).toContain("{path: 'my-dir-my-lib2', loadChildren: '@proj/my-dir/my-lib2#MyDirMyLib2Module'}");
                            expect(moduleContents3).toContain("{path: 'my-lib3', loadChildren: '@proj/my-dir/my-lib3#MyLib3Module'}");
                            tsConfigAppJson3 = JSON.parse(stripJsonComments(test_1.getFileContent(tree3, 'apps/myapp/tsconfig.app.json')));
                            expect(tsConfigAppJson3.include).toEqual([
                                '**/*.ts',
                                '../../libs/my-dir/my-lib/src/index.ts',
                                '../../libs/my-dir/my-lib2/src/index.ts',
                                '../../libs/my-dir/my-lib3/src/index.ts'
                            ]);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('eager', function () {
            it('should add RouterModule and define an array of routes', function () { return __awaiter(_this, void 0, void 0, function () {
                var tree, tree2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testing_utils_1.runSchematic('lib', {
                                name: 'myLib',
                                directory: 'myDir',
                                framework: 'angular',
                                routing: true
                            }, appTree)];
                        case 1:
                            tree = _a.sent();
                            expect(tree.exists('libs/my-dir/my-lib/src/lib/my-dir-my-lib.module.ts')).toBeTruthy();
                            expect(test_1.getFileContent(tree, 'libs/my-dir/my-lib/src/lib/my-dir-my-lib.module.ts')).toContain('RouterModule');
                            expect(test_1.getFileContent(tree, 'libs/my-dir/my-lib/src/lib/my-dir-my-lib.module.ts')).toContain('const myDirMyLibRoutes: Route[] = ');
                            return [4 /*yield*/, testing_utils_1.runSchematic('lib', {
                                    name: 'myLib2',
                                    directory: 'myDir',
                                    routing: true,
                                    framework: 'angular',
                                    simpleModuleName: true
                                }, tree)];
                        case 2:
                            tree2 = _a.sent();
                            expect(tree2.exists('libs/my-dir/my-lib2/src/lib/my-lib2.module.ts')).toBeTruthy();
                            expect(test_1.getFileContent(tree2, 'libs/my-dir/my-lib2/src/lib/my-lib2.module.ts')).toContain('RouterModule');
                            expect(test_1.getFileContent(tree2, 'libs/my-dir/my-lib2/src/lib/my-lib2.module.ts')).toContain('const myLib2Routes: Route[] = ');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should update the parent module', function () { return __awaiter(_this, void 0, void 0, function () {
                var tree, moduleContents, tree2, moduleContents2, tree3, moduleContents3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            appTree = testing_utils_1.createApp(appTree, 'myapp');
                            return [4 /*yield*/, testing_utils_1.runSchematic('lib', {
                                    name: 'myLib',
                                    directory: 'myDir',
                                    routing: true,
                                    framework: 'angular',
                                    parentModule: 'apps/myapp/src/app/app.module.ts'
                                }, appTree)];
                        case 1:
                            tree = _a.sent();
                            moduleContents = test_1.getFileContent(tree, 'apps/myapp/src/app/app.module.ts');
                            expect(moduleContents).toContain('MyDirMyLibModule');
                            expect(moduleContents).toContain('RouterModule.forRoot([');
                            expect(moduleContents).toContain("{path: 'my-dir-my-lib', children: myDirMyLibRoutes}");
                            return [4 /*yield*/, testing_utils_1.runSchematic('lib', {
                                    name: 'myLib2',
                                    directory: 'myDir',
                                    routing: true,
                                    framework: 'angular',
                                    parentModule: 'apps/myapp/src/app/app.module.ts'
                                }, tree)];
                        case 2:
                            tree2 = _a.sent();
                            moduleContents2 = test_1.getFileContent(tree2, 'apps/myapp/src/app/app.module.ts');
                            expect(moduleContents2).toContain('MyDirMyLib2Module');
                            expect(moduleContents2).toContain('RouterModule.forRoot([');
                            expect(moduleContents2).toContain("{path: 'my-dir-my-lib', children: myDirMyLibRoutes}");
                            expect(moduleContents2).toContain("{path: 'my-dir-my-lib2', children: myDirMyLib2Routes}");
                            return [4 /*yield*/, testing_utils_1.runSchematic('lib', {
                                    name: 'myLib3',
                                    directory: 'myDir',
                                    routing: true,
                                    framework: 'angular',
                                    parentModule: 'apps/myapp/src/app/app.module.ts',
                                    simpleModuleName: true
                                }, tree2)];
                        case 3:
                            tree3 = _a.sent();
                            moduleContents3 = test_1.getFileContent(tree3, 'apps/myapp/src/app/app.module.ts');
                            expect(moduleContents3).toContain('MyLib3Module');
                            expect(moduleContents3).toContain('RouterModule.forRoot([');
                            expect(moduleContents3).toContain("{path: 'my-dir-my-lib', children: myDirMyLibRoutes}");
                            expect(moduleContents3).toContain("{path: 'my-dir-my-lib2', children: myDirMyLib2Routes}");
                            expect(moduleContents3).toContain("{path: 'my-lib3', children: myLib3Routes}");
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('--style scss', function () {
        it('should set it as default', function () { return __awaiter(_this, void 0, void 0, function () {
            var result, angularJson;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('lib', { name: 'myLib', style: 'scss' }, appTree)];
                    case 1:
                        result = _a.sent();
                        angularJson = ast_utils_1.readJsonInTree(result, 'angular.json');
                        expect(angularJson.projects['my-lib'].schematics).toEqual({
                            '@nrwl/schematics:component': {
                                styleext: 'scss'
                            }
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('--unit-test-runner karma', function () {
        it('should generate karma configuration', function () { return __awaiter(_this, void 0, void 0, function () {
            var resultTree, angularJson;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('lib', { name: 'myLib', unitTestRunner: 'karma' }, appTree)];
                    case 1:
                        resultTree = _a.sent();
                        expect(resultTree.exists('libs/my-lib/src/test.ts')).toBeTruthy();
                        expect(resultTree.exists('libs/my-lib/src/test-setup.ts')).toBeFalsy();
                        expect(resultTree.exists('libs/my-lib/tsconfig.spec.json')).toBeTruthy();
                        expect(resultTree.exists('libs/my-lib/karma.conf.js')).toBeTruthy();
                        angularJson = ast_utils_1.readJsonInTree(resultTree, 'angular.json');
                        expect(angularJson.projects['my-lib'].architect.test.builder).toEqual('@angular-devkit/build-angular:karma');
                        expect(angularJson.projects['my-lib'].architect.lint.options.tsConfig).toEqual([
                            'libs/my-lib/tsconfig.lib.json',
                            'libs/my-lib/tsconfig.spec.json'
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should skip the setup file and serializers if no module is generated', function () { return __awaiter(_this, void 0, void 0, function () {
            var resultTree;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('lib', { name: 'myLib', unitTestRunner: 'jest', module: false }, appTree)];
                    case 1:
                        resultTree = _a.sent();
                        expect(resultTree.exists('libs/my-lib/src/test-setup.ts')).toBeFalsy();
                        expect(resultTree.readContent('libs/my-lib/jest.config.js')).not
                            .toContain("\n  snapshotSerializers: [\n    'jest-preset-angular/AngularSnapshotSerializer.js',\n    'jest-preset-angular/HTMLCommentSerializer.js'\n  ]\n");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('--unit-test-runner none', function () {
        it('should not generate test configuration', function () { return __awaiter(_this, void 0, void 0, function () {
            var resultTree, angularJson;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('lib', { name: 'myLib', unitTestRunner: 'none' }, appTree)];
                    case 1:
                        resultTree = _a.sent();
                        expect(resultTree.exists('libs/my-lib/src/lib/my-lib.module.spec.ts')).toBeFalsy();
                        expect(resultTree.exists('libs/my-lib/src/test.ts')).toBeFalsy();
                        expect(resultTree.exists('libs/my-lib/src/test.ts')).toBeFalsy();
                        expect(resultTree.exists('libs/my-lib/tsconfig.spec.json')).toBeFalsy();
                        expect(resultTree.exists('libs/my-lib/jest.config.js')).toBeFalsy();
                        expect(resultTree.exists('libs/my-lib/karma.conf.js')).toBeFalsy();
                        angularJson = ast_utils_1.readJsonInTree(resultTree, 'angular.json');
                        expect(angularJson.projects['my-lib'].architect.test).toBeUndefined();
                        expect(angularJson.projects['my-lib'].architect.lint.options.tsConfig).toEqual(['libs/my-lib/tsconfig.lib.json']);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
