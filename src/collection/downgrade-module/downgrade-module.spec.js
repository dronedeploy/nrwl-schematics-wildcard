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
var ast_utils_1 = require("../../utils/ast-utils");
describe('downgrade-module', function () {
    var appTree;
    beforeEach(function () {
        appTree = new schematics_1.VirtualTree();
        appTree = testing_utils_1.createEmptyWorkspace(appTree);
        appTree = testing_utils_1.createApp(appTree, 'myapp');
    });
    it('should update main.ts', function () { return __awaiter(_this, void 0, void 0, function () {
        var tree, main;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testing_utils_1.runSchematic('downgrade-module', {
                        name: 'legacy',
                        project: 'myapp'
                    }, appTree)];
                case 1:
                    tree = _a.sent();
                    main = test_1.getFileContent(tree, '/apps/myapp/src/main.ts');
                    expect(main).toContain('downgradeModule(bootstrapAngular)');
                    expect(main).toContain("import 'legacy';");
                    expect(main).toContain("angular.bootstrap(document, ['legacy', downgraded.name]);");
                    return [2 /*return*/];
            }
        });
    }); });
    it('should update module', function () { return __awaiter(_this, void 0, void 0, function () {
        var tree, appModule;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testing_utils_1.runSchematic('downgrade-module', {
                        name: 'legacy',
                        project: 'myapp'
                    }, appTree)];
                case 1:
                    tree = _a.sent();
                    appModule = test_1.getFileContent(tree, 'apps/myapp/src/app/app.module.ts');
                    expect(appModule).not.toContain('bootstrap:');
                    expect(appModule).toContain('entryComponents: [AppComponent]');
                    expect(appModule).toContain('ngDoBootstrap');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should update package.json by default', function () { return __awaiter(_this, void 0, void 0, function () {
        var tree, packageJson;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    appTree.overwrite("/package.json", JSON.stringify({
                        dependencies: {
                            '@angular/core': '4.4.4'
                        }
                    }));
                    return [4 /*yield*/, testing_utils_1.runSchematic('downgrade-module', {
                            name: 'legacy',
                            project: 'myapp'
                        }, appTree)];
                case 1:
                    tree = _a.sent();
                    packageJson = ast_utils_1.readJsonInTree(tree, '/package.json');
                    expect(packageJson.dependencies['@angular/upgrade']).toEqual('4.4.4');
                    expect(packageJson.dependencies['angular']).toBeDefined();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should not package.json when --skipPackageJson=true', function () { return __awaiter(_this, void 0, void 0, function () {
        var tree, packageJson;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    appTree.overwrite("/package.json", JSON.stringify({
                        dependencies: {
                            '@angular/core': '4.4.4'
                        }
                    }));
                    return [4 /*yield*/, testing_utils_1.runSchematic('downgrade-module', {
                            name: 'legacy',
                            skipPackageJson: true,
                            project: 'myapp'
                        }, appTree)];
                case 1:
                    tree = _a.sent();
                    packageJson = ast_utils_1.readJsonInTree(tree, 'package.json');
                    expect(packageJson.dependencies['@angular/upgrade']).not.toBeDefined();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should support custom angularJsImport', function () { return __awaiter(_this, void 0, void 0, function () {
        var tree, main;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testing_utils_1.runSchematic('downgrade-module', {
                        name: 'legacy',
                        angularJsImport: 'legacy-app',
                        project: 'myapp'
                    }, appTree)];
                case 1:
                    tree = _a.sent();
                    main = test_1.getFileContent(tree, '/apps/myapp/src/main.ts');
                    expect(main).toContain("import 'legacy-app';");
                    expect(main).not.toContain("import 'legacy';");
                    return [2 /*return*/];
            }
        });
    }); });
});
