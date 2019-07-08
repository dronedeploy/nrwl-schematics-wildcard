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
var ast_utils_1 = require("@nrwl/schematics/src/utils/ast-utils");
describe('karmaProject', function () {
    var appTree;
    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    appTree = new schematics_1.VirtualTree();
                    appTree = testing_utils_1.createEmptyWorkspace(appTree);
                    return [4 /*yield*/, testing_utils_1.runSchematic('lib', {
                            name: 'lib1',
                            unitTestRunner: 'none'
                        }, appTree)];
                case 1:
                    appTree = _a.sent();
                    return [4 /*yield*/, testing_utils_1.runSchematic('app', {
                            name: 'app1',
                            unitTestRunner: 'none'
                        }, appTree)];
                case 2:
                    appTree = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should generate files', function () { return __awaiter(_this, void 0, void 0, function () {
        var resultTree;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testing_utils_1.runSchematic('karma-project', {
                        project: 'lib1'
                    }, appTree)];
                case 1:
                    resultTree = _a.sent();
                    expect(resultTree.exists('/libs/lib1/karma.conf.js')).toBeTruthy();
                    expect(resultTree.exists('/libs/lib1/tsconfig.spec.json')).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should create a karma.conf.js', function () { return __awaiter(_this, void 0, void 0, function () {
        var resultTree;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testing_utils_1.runSchematic('karma-project', {
                        project: 'lib1'
                    }, appTree)];
                case 1:
                    resultTree = _a.sent();
                    expect(resultTree.readContent('libs/lib1/karma.conf.js'))
                        .toBe("// Karma configuration file, see link for more information\n// https://karma-runner.github.io/1.0/config/configuration-file.html\n\nconst { join } = require('path');\nconst getBaseKarmaConfig = require('../../karma.conf');\n\nmodule.exports = function(config) {\n  const baseConfig = getBaseKarmaConfig();\n  config.set({\n    ...baseConfig,\n    coverageIstanbulReporter: {\n      ...baseConfig.coverageIstanbulReporter,\n      dir: join(__dirname, '../../coverage/libs/lib1')\n    }\n  });\n};\n");
                    return [2 /*return*/];
            }
        });
    }); });
    it('should update the local tsconfig.json', function () { return __awaiter(_this, void 0, void 0, function () {
        var resultTree, tsConfig;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testing_utils_1.runSchematic('karma-project', {
                        project: 'lib1'
                    }, appTree)];
                case 1:
                    resultTree = _a.sent();
                    tsConfig = ast_utils_1.readJsonInTree(resultTree, 'libs/lib1/tsconfig.json');
                    expect(tsConfig.compilerOptions.types).toContain('jasmine');
                    expect(tsConfig.compilerOptions.types).not.toContain('node');
                    return [2 /*return*/];
            }
        });
    }); });
    describe('library', function () {
        it('should alter angular.json', function () { return __awaiter(_this, void 0, void 0, function () {
            var resultTree, angularJson;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('karma-project', {
                            project: 'lib1'
                        }, appTree)];
                    case 1:
                        resultTree = _a.sent();
                        angularJson = ast_utils_1.readJsonInTree(resultTree, 'angular.json');
                        expect(angularJson.projects.lib1.architect.test).toEqual({
                            builder: '@angular-devkit/build-angular:karma',
                            options: {
                                main: 'libs/lib1/src/test.ts',
                                tsConfig: 'libs/lib1/tsconfig.spec.json',
                                karmaConfig: 'libs/lib1/karma.conf.js'
                            }
                        });
                        expect(angularJson.projects.lib1.architect.lint.options.tsConfig).toContain('libs/lib1/tsconfig.spec.json');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should create a tsconfig.spec.json', function () { return __awaiter(_this, void 0, void 0, function () {
            var resultTree, tsConfig;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('karma-project', {
                            project: 'lib1'
                        }, appTree)];
                    case 1:
                        resultTree = _a.sent();
                        tsConfig = ast_utils_1.readJsonInTree(resultTree, 'libs/lib1/tsconfig.spec.json');
                        expect(tsConfig).toEqual({
                            extends: './tsconfig.json',
                            compilerOptions: {
                                outDir: '../../dist/out-tsc/libs/lib1',
                                types: ['jasmine', 'node']
                            },
                            files: ['src/test.ts'],
                            include: ['**/*.spec.ts', '**/*.d.ts']
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should create test.ts', function () { return __awaiter(_this, void 0, void 0, function () {
            var resultTree, testTs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('karma-project', {
                            project: 'lib1'
                        }, appTree)];
                    case 1:
                        resultTree = _a.sent();
                        testTs = resultTree.read('libs/lib1/src/test.ts').toString();
                        expect(testTs).toContain("import 'core-js/es7/reflect';");
                        expect(testTs).toContain("import 'zone.js/dist/zone';");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('applications', function () {
        it('should alter angular.json', function () { return __awaiter(_this, void 0, void 0, function () {
            var resultTree, angularJson;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('karma-project', {
                            project: 'app1'
                        }, appTree)];
                    case 1:
                        resultTree = _a.sent();
                        angularJson = ast_utils_1.readJsonInTree(resultTree, 'angular.json');
                        expect(angularJson.projects.app1.architect.test).toEqual({
                            builder: '@angular-devkit/build-angular:karma',
                            options: {
                                main: 'apps/app1/src/test.ts',
                                polyfills: 'apps/app1/src/polyfills.ts',
                                tsConfig: 'apps/app1/tsconfig.spec.json',
                                karmaConfig: 'apps/app1/karma.conf.js',
                                styles: [],
                                scripts: [],
                                assets: []
                            }
                        });
                        expect(angularJson.projects.app1.architect.lint.options.tsConfig).toContain('apps/app1/tsconfig.spec.json');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should create a tsconfig.spec.json', function () { return __awaiter(_this, void 0, void 0, function () {
            var resultTree, tsConfig;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('karma-project', {
                            project: 'app1'
                        }, appTree)];
                    case 1:
                        resultTree = _a.sent();
                        tsConfig = ast_utils_1.readJsonInTree(resultTree, 'apps/app1/tsconfig.spec.json');
                        expect(tsConfig).toEqual({
                            extends: './tsconfig.json',
                            compilerOptions: {
                                outDir: '../../dist/out-tsc/apps/app1/',
                                types: ['jasmine', 'node']
                            },
                            files: ['src/test.ts', 'src/polyfills.ts'],
                            include: ['**/*.spec.ts', '**/*.d.ts']
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should create test.ts', function () { return __awaiter(_this, void 0, void 0, function () {
            var resultTree, testTs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('karma-project', {
                            project: 'app1'
                        }, appTree)];
                    case 1:
                        resultTree = _a.sent();
                        testTs = resultTree.read('apps/app1/src/test.ts').toString();
                        expect(testTs).not.toContain("import 'core-js/es7/reflect';");
                        expect(testTs).not.toContain("import 'zone.js/dist/zone';");
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
