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
var testing_utils_1 = require("@nrwl/schematics/src/utils/testing-utils");
var ast_utils_1 = require("@nrwl/schematics/src/utils/ast-utils");
describe('schematic:cypress-project', function () {
    var appTree;
    beforeEach(function () {
        appTree = new schematics_1.VirtualTree();
        appTree = testing_utils_1.createEmptyWorkspace(appTree);
    });
    describe('generate app --e2e-test-runner=cypress', function () {
        it('should not contain any protractor files', function () { return __awaiter(_this, void 0, void 0, function () {
            var tree;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('application', { name: 'myApp', e2eTestRunner: 'cypress' }, appTree)];
                    case 1:
                        tree = _a.sent();
                        expect(tree.exists('apps/my-app-e2e/protractor.e2e.json')).not.toBeTruthy();
                        expect(tree.exists('apps/my-app-e2e/protractor.conf.js')).not.toBeTruthy();
                        expect(tree.exists('apps/my-app-e2e/src/app.e2e-spec.ts')).not.toBeTruthy();
                        expect(tree.exists('apps/my-app-e2e/src/app.po.ts')).not.toBeTruthy();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should generate files', function () { return __awaiter(_this, void 0, void 0, function () {
            var tree;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('application', { name: 'myApp', e2eTestRunner: 'cypress' }, appTree)];
                    case 1:
                        tree = _a.sent();
                        expect(tree.exists('apps/my-app-e2e/cypress.json')).toBeTruthy();
                        expect(tree.exists('apps/my-app-e2e/tsconfig.e2e.json')).toBeTruthy();
                        expect(tree.exists('apps/my-app-e2e/src/fixtures/example.json')).toBeTruthy();
                        expect(tree.exists('apps/my-app-e2e/src/integration/app.spec.ts')).toBeTruthy();
                        expect(tree.exists('apps/my-app-e2e/src/plugins/index.ts')).toBeTruthy();
                        expect(tree.exists('apps/my-app-e2e/src/support/app.po.ts')).toBeTruthy();
                        expect(tree.exists('apps/my-app-e2e/src/support/commands.ts')).toBeTruthy();
                        expect(tree.exists('apps/my-app-e2e/src/support/index.ts')).toBeTruthy();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should add dependencies into `package.json` file', function () { return __awaiter(_this, void 0, void 0, function () {
            var tree, packageJson;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('application', { name: 'myApp', e2eTestRunner: 'cypress' }, appTree)];
                    case 1:
                        tree = _a.sent();
                        packageJson = ast_utils_1.readJsonInTree(tree, 'package.json');
                        expect(packageJson.devDependencies.cypress).toBeDefined();
                        expect(packageJson.devDependencies['@nrwl/builders']).toBeDefined();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should add update `angular.json` file', function () { return __awaiter(_this, void 0, void 0, function () {
            var tree, angularJson, project;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('application', { name: 'myApp', e2eTestRunner: 'cypress' }, appTree)];
                    case 1:
                        tree = _a.sent();
                        angularJson = ast_utils_1.readJsonInTree(tree, 'angular.json');
                        project = angularJson.projects['my-app-e2e'];
                        expect(project.root).toEqual('apps/my-app-e2e');
                        expect(project.architect.e2e.builder).toEqual('@nrwl/builders:cypress');
                        expect(project.architect.lint.options.tsConfig).toEqual('apps/my-app-e2e/tsconfig.e2e.json');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should set right path names in `cypress.json`', function () { return __awaiter(_this, void 0, void 0, function () {
            var tree, cypressJson;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('application', { name: 'myApp', e2eTestRunner: 'cypress' }, appTree)];
                    case 1:
                        tree = _a.sent();
                        cypressJson = ast_utils_1.readJsonInTree(tree, 'apps/my-app-e2e/cypress.json');
                        expect(cypressJson).toEqual({
                            fileServerFolder: '../../dist/out-tsc/apps/my-app-e2e',
                            fixturesFolder: '../../dist/out-tsc/apps/my-app-e2e/src/fixtures',
                            integrationFolder: '../../dist/out-tsc/apps/my-app-e2e/src/integration',
                            pluginsFile: '../../dist/out-tsc/apps/my-app-e2e/src/plugins/index.js',
                            supportFile: false,
                            video: true,
                            videosFolder: '../../dist/out-tsc/apps/my-app-e2e/videos',
                            screenshotsFolder: '../../dist/out-tsc/apps/my-app-e2e/screenshots',
                            chromeWebSecurity: false
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should set right path names in `tsconfig.e2e.json`', function () { return __awaiter(_this, void 0, void 0, function () {
            var tree, tsconfigJson;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('application', { name: 'myApp', e2eTestRunner: 'cypress' }, appTree)];
                    case 1:
                        tree = _a.sent();
                        tsconfigJson = ast_utils_1.readJsonInTree(tree, 'apps/my-app-e2e/tsconfig.e2e.json');
                        expect(tsconfigJson.extends).toEqual('./tsconfig.json');
                        expect(tsconfigJson.compilerOptions.outDir).toEqual('../../dist/out-tsc/apps/my-app-e2e/src');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('generate app --e2e-test-runner=cypress --directory=my-dir', function () {
        it('should set right path names in `cypress.json`', function () { return __awaiter(_this, void 0, void 0, function () {
            var tree, cypressJson;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('application', { name: 'myApp', e2eTestRunner: 'cypress', directory: 'my-dir' }, appTree)];
                    case 1:
                        tree = _a.sent();
                        cypressJson = ast_utils_1.readJsonInTree(tree, 'apps/my-dir/my-app-e2e/cypress.json');
                        expect(cypressJson).toEqual({
                            fileServerFolder: '../../../dist/out-tsc/apps/my-dir/my-app-e2e',
                            fixturesFolder: '../../../dist/out-tsc/apps/my-dir/my-app-e2e/src/fixtures',
                            integrationFolder: '../../../dist/out-tsc/apps/my-dir/my-app-e2e/src/integration',
                            pluginsFile: '../../../dist/out-tsc/apps/my-dir/my-app-e2e/src/plugins/index.js',
                            supportFile: false,
                            video: true,
                            videosFolder: '../../../dist/out-tsc/apps/my-dir/my-app-e2e/videos',
                            screenshotsFolder: '../../../dist/out-tsc/apps/my-dir/my-app-e2e/screenshots',
                            chromeWebSecurity: false
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should set right path names in `tsconfig.e2e.json`', function () { return __awaiter(_this, void 0, void 0, function () {
            var tree, tsconfigJson;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('application', { name: 'myApp', e2eTestRunner: 'cypress', directory: 'my-dir' }, appTree)];
                    case 1:
                        tree = _a.sent();
                        tsconfigJson = ast_utils_1.readJsonInTree(tree, 'apps/my-dir/my-app-e2e/tsconfig.e2e.json');
                        expect(tsconfigJson.compilerOptions.outDir).toEqual('../../../dist/out-tsc/apps/my-dir/my-app-e2e/src');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
