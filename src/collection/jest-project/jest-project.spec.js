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
describe('jestProject', function () {
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
                    return [2 /*return*/];
            }
        });
    }); });
    it('should generate files', function () { return __awaiter(_this, void 0, void 0, function () {
        var resultTree;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testing_utils_1.runSchematic('jest-project', {
                        project: 'lib1'
                    }, appTree)];
                case 1:
                    resultTree = _a.sent();
                    expect(resultTree.exists('/libs/lib1/src/test-setup.ts')).toBeTruthy();
                    expect(resultTree.exists('/libs/lib1/jest.config.js')).toBeTruthy();
                    expect(resultTree.exists('/libs/lib1/tsconfig.spec.json')).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should alter angular.json', function () { return __awaiter(_this, void 0, void 0, function () {
        var resultTree, angularJson;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testing_utils_1.runSchematic('jest-project', {
                        project: 'lib1'
                    }, appTree)];
                case 1:
                    resultTree = _a.sent();
                    angularJson = ast_utils_1.readJsonInTree(resultTree, 'angular.json');
                    expect(angularJson.projects.lib1.architect.test).toEqual({
                        builder: '@nrwl/builders:jest',
                        options: {
                            jestConfig: 'libs/lib1/jest.config.js',
                            setupFile: 'libs/lib1/src/test-setup.ts',
                            tsConfig: 'libs/lib1/tsconfig.spec.json'
                        }
                    });
                    expect(angularJson.projects.lib1.architect.lint.options.tsConfig).toContain('libs/lib1/tsconfig.spec.json');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should create a jest.config.js', function () { return __awaiter(_this, void 0, void 0, function () {
        var resultTree;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testing_utils_1.runSchematic('jest-project', {
                        project: 'lib1'
                    }, appTree)];
                case 1:
                    resultTree = _a.sent();
                    expect(resultTree.readContent('libs/lib1/jest.config.js'))
                        .toBe("module.exports = {\n  name: 'lib1',\n  preset: '../../jest.config.js',\n  coverageDirectory: '../../coverage/libs/lib1',\n  snapshotSerializers: [\n    'jest-preset-angular/AngularSnapshotSerializer.js',\n    'jest-preset-angular/HTMLCommentSerializer.js'\n  ]\n};\n");
                    return [2 /*return*/];
            }
        });
    }); });
    it('should update the local tsconfig.json', function () { return __awaiter(_this, void 0, void 0, function () {
        var resultTree, tsConfig;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testing_utils_1.runSchematic('jest-project', {
                        project: 'lib1'
                    }, appTree)];
                case 1:
                    resultTree = _a.sent();
                    tsConfig = ast_utils_1.readJsonInTree(resultTree, 'libs/lib1/tsconfig.json');
                    expect(tsConfig.compilerOptions.types).toContain('jest');
                    expect(tsConfig.compilerOptions.types).toContain('node');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should create a tsconfig.spec.json', function () { return __awaiter(_this, void 0, void 0, function () {
        var resultTree, tsConfig;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testing_utils_1.runSchematic('jest-project', {
                        project: 'lib1'
                    }, appTree)];
                case 1:
                    resultTree = _a.sent();
                    tsConfig = ast_utils_1.readJsonInTree(resultTree, 'libs/lib1/tsconfig.spec.json');
                    expect(tsConfig).toEqual({
                        extends: './tsconfig.json',
                        compilerOptions: {
                            module: 'commonjs',
                            outDir: '../../dist/out-tsc/libs/lib1',
                            types: ['jest', 'node']
                        },
                        files: ['src/test-setup.ts'],
                        include: ['**/*.spec.ts', '**/*.d.ts']
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    describe('--setup-file', function () {
        it('should generate src/test-setup.ts', function () { return __awaiter(_this, void 0, void 0, function () {
            var resultTree;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('jest-project', {
                            project: 'lib1',
                            setupFile: 'none'
                        }, appTree)];
                    case 1:
                        resultTree = _a.sent();
                        expect(resultTree.exists('src/test-setup.ts')).toBeFalsy();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not list the setup file in angular.json', function () { return __awaiter(_this, void 0, void 0, function () {
            var resultTree, angularJson;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('jest-project', {
                            project: 'lib1',
                            setupFile: 'none'
                        }, appTree)];
                    case 1:
                        resultTree = _a.sent();
                        angularJson = ast_utils_1.readJsonInTree(resultTree, 'angular.json');
                        expect(angularJson.projects.lib1.architect.test.options.setupFile).toBeUndefined();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not list the setup file in tsconfig.spec.json', function () { return __awaiter(_this, void 0, void 0, function () {
            var resultTree, tsConfig;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('jest-project', {
                            project: 'lib1',
                            setupFile: 'none'
                        }, appTree)];
                    case 1:
                        resultTree = _a.sent();
                        tsConfig = ast_utils_1.readJsonInTree(resultTree, 'libs/lib1/tsconfig.spec.json');
                        expect(tsConfig.files).toBeUndefined();
                        return [2 /*return*/];
                }
            });
        }); });
        describe('angular', function () {
            it('should add jest-angular-preset dependency', function () { return __awaiter(_this, void 0, void 0, function () {
                var resultTree, packageJson;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testing_utils_1.runSchematic('jest-project', {
                                project: 'lib1',
                                setupFile: 'angular'
                            }, appTree)];
                        case 1:
                            resultTree = _a.sent();
                            packageJson = ast_utils_1.readJsonInTree(resultTree, 'package.json');
                            expect(packageJson.devDependencies['jest-preset-angular']).toBeDefined();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('not angular', function () {
            it('should add ts-jest dependency', function () { return __awaiter(_this, void 0, void 0, function () {
                var resultTree, packageJson;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testing_utils_1.runSchematic('jest-project', {
                                project: 'lib1',
                                setupFile: 'web-components'
                            }, appTree)];
                        case 1:
                            resultTree = _a.sent();
                            packageJson = ast_utils_1.readJsonInTree(resultTree, 'package.json');
                            expect(packageJson.devDependencies['ts-jest']).toBeDefined();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('--skip-setup-file', function () {
        it('should generate src/test-setup.ts', function () { return __awaiter(_this, void 0, void 0, function () {
            var resultTree;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('jest-project', {
                            project: 'lib1',
                            skipSetupFile: true
                        }, appTree)];
                    case 1:
                        resultTree = _a.sent();
                        expect(resultTree.exists('src/test-setup.ts')).toBeFalsy();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not list the setup file in angular.json', function () { return __awaiter(_this, void 0, void 0, function () {
            var resultTree, angularJson;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('jest-project', {
                            project: 'lib1',
                            skipSetupFile: true
                        }, appTree)];
                    case 1:
                        resultTree = _a.sent();
                        angularJson = ast_utils_1.readJsonInTree(resultTree, 'angular.json');
                        expect(angularJson.projects.lib1.architect.test.options.setupFile).toBeUndefined();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not list the setup file in tsconfig.spec.json', function () { return __awaiter(_this, void 0, void 0, function () {
            var resultTree, tsConfig;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('jest-project', {
                            project: 'lib1',
                            skipSetupFile: true
                        }, appTree)];
                    case 1:
                        resultTree = _a.sent();
                        tsConfig = ast_utils_1.readJsonInTree(resultTree, 'libs/lib1/tsconfig.spec.json');
                        expect(tsConfig.files).toBeUndefined();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('--skip-serializers', function () {
        it('should not list the serializers in jest.config.js', function () { return __awaiter(_this, void 0, void 0, function () {
            var resultTree, jestConfig;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('jest-project', {
                            project: 'lib1',
                            skipSerializers: true
                        }, appTree)];
                    case 1:
                        resultTree = _a.sent();
                        jestConfig = resultTree.readContent('libs/lib1/jest.config.js');
                        expect(jestConfig).not.toContain("\n  snapshotSerializers: [\n    'jest-preset-angular/AngularSnapshotSerializer.js',\n    'jest-preset-angular/HTMLCommentSerializer.js'\n  ]\n");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('--support-tsx', function () {
        it('should add tsx to moduleExtensions', function () { return __awaiter(_this, void 0, void 0, function () {
            var resultTree, jestConfig;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('jest-project', {
                            project: 'lib1',
                            supportTsx: true
                        }, appTree)];
                    case 1:
                        resultTree = _a.sent();
                        jestConfig = resultTree.readContent('libs/lib1/jest.config.js');
                        expect(jestConfig).toContain("moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],");
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
