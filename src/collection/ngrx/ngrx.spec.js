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
var test_1 = require("@schematics/angular/utility/test");
var ast_utils_1 = require("../../utils/ast-utils");
var name_utils_1 = require("../../utils/name-utils");
var testing_utils_1 = require("../../utils/testing-utils");
describe('ngrx', function () {
    var appTree;
    beforeEach(function () {
        appTree = new schematics_1.VirtualTree();
        appTree = testing_utils_1.createEmptyWorkspace(appTree);
        appTree = testing_utils_1.createApp(appTree, 'myapp');
    });
    it('should add empty root', function () { return __awaiter(_this, void 0, void 0, function () {
        var tree, appModule;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testing_utils_1.runSchematic('ngrx', {
                        name: 'state',
                        module: 'apps/myapp/src/app/app.module.ts',
                        onlyEmptyRoot: true
                    }, appTree)];
                case 1:
                    tree = _a.sent();
                    appModule = test_1.getFileContent(tree, '/apps/myapp/src/app/app.module.ts');
                    expect(tree.exists('apps/myapp/src/app/+state/state.actions.ts')).toBeFalsy();
                    expect(appModule).toContain('StoreModule.forRoot(');
                    expect(appModule).toContain('{ metaReducers : !environment.production ? [storeFreeze] : [] }');
                    expect(appModule).toContain('EffectsModule.forRoot');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should add root', function () { return __awaiter(_this, void 0, void 0, function () {
        var tree, appModule;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testing_utils_1.runSchematic('ngrx', {
                        name: 'app',
                        module: 'apps/myapp/src/app/app.module.ts',
                        root: true
                    }, appTree)];
                case 1:
                    tree = _a.sent();
                    [
                        '/apps/myapp/src/app/+state/app.actions.ts',
                        '/apps/myapp/src/app/+state/app.effects.ts',
                        '/apps/myapp/src/app/+state/app.effects.spec.ts',
                        '/apps/myapp/src/app/+state/app.reducer.ts',
                        '/apps/myapp/src/app/+state/app.reducer.spec.ts',
                        '/apps/myapp/src/app/+state/app.selectors.ts',
                        '/apps/myapp/src/app/+state/app.selectors.spec.ts'
                    ].forEach(function (fileName) {
                        expect(tree.exists(fileName)).toBeTruthy();
                    });
                    // Since we did not include the `--facade` option
                    expect(tree.exists('/apps/myapp/src/app/+state/app.facade.ts')).toBeFalsy();
                    expect(tree.exists('/apps/myapp/src/app/+state/app.facade.spec.ts')).toBeFalsy();
                    appModule = test_1.getFileContent(tree, '/apps/myapp/src/app/app.module.ts');
                    expect(appModule).toContain("import { NxModule } from '@nrwl/nx';");
                    expect(appModule).toContain('NxModule.forRoot');
                    expect(appModule).toContain('StoreModule.forRoot');
                    expect(appModule).toContain('EffectsModule.forRoot');
                    expect(appModule).toContain('!environment.production ? [storeFreeze] : []');
                    expect(appModule).toContain('app: appReducer');
                    expect(appModule).toContain('initialState : { app : appInitialState }');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should add facade to root', function () { return __awaiter(_this, void 0, void 0, function () {
        var tree, appModule;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testing_utils_1.runSchematic('ngrx', {
                        name: 'app',
                        module: 'apps/myapp/src/app/app.module.ts',
                        root: true,
                        facade: true
                    }, appTree)];
                case 1:
                    tree = _a.sent();
                    appModule = test_1.getFileContent(tree, '/apps/myapp/src/app/app.module.ts');
                    expect(appModule).toContain("import { NxModule } from '@nrwl/nx';");
                    expect(appModule).toContain('NxModule.forRoot');
                    expect(appModule).toContain('StoreModule.forRoot');
                    expect(appModule).toContain('EffectsModule.forRoot');
                    expect(appModule).toContain('!environment.production ? [storeFreeze] : []');
                    // Do not add Effects file to providers; already registered in EffectsModule
                    expect(appModule).toContain('providers: [AppFacade]');
                    expect(appModule).toContain('app: appReducer');
                    expect(appModule).toContain('initialState : { app : appInitialState }');
                    [
                        '/apps/myapp/src/app/+state/app.actions.ts',
                        '/apps/myapp/src/app/+state/app.effects.ts',
                        '/apps/myapp/src/app/+state/app.effects.spec.ts',
                        '/apps/myapp/src/app/+state/app.reducer.ts',
                        '/apps/myapp/src/app/+state/app.reducer.spec.ts',
                        '/apps/myapp/src/app/+state/app.facade.ts',
                        '/apps/myapp/src/app/+state/app.facade.spec.ts',
                        '/apps/myapp/src/app/+state/app.selectors.ts',
                        '/apps/myapp/src/app/+state/app.selectors.spec.ts'
                    ].forEach(function (fileName) {
                        expect(tree.exists(fileName)).toBeTruthy();
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it('should not add RouterStoreModule only if the module does not reference the router', function () { return __awaiter(_this, void 0, void 0, function () {
        var newTree, tree, appModule;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    newTree = testing_utils_1.createApp(appTree, 'myapp-norouter', false);
                    return [4 /*yield*/, testing_utils_1.runSchematic('ngrx', {
                            name: 'app',
                            module: 'apps/myapp-norouter/src/app/app.module.ts',
                            root: true
                        }, newTree)];
                case 1:
                    tree = _a.sent();
                    appModule = test_1.getFileContent(tree, '/apps/myapp-norouter/src/app/app.module.ts');
                    expect(appModule).not.toContain('StoreRouterConnectingModule');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should add feature', function () { return __awaiter(_this, void 0, void 0, function () {
        var tree, appModule;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testing_utils_1.runSchematic('ngrx', {
                        name: 'state',
                        module: 'apps/myapp/src/app/app.module.ts'
                    }, appTree)];
                case 1:
                    tree = _a.sent();
                    appModule = test_1.getFileContent(tree, '/apps/myapp/src/app/app.module.ts');
                    expect(appModule).toContain('StoreModule.forFeature');
                    expect(appModule).toContain('EffectsModule.forFeature');
                    expect(appModule).toContain('STATE_FEATURE_KEY, stateReducer');
                    expect(appModule).toContain('initialState: stateInitialState');
                    expect(appModule).not.toContain('!environment.production ? [storeFreeze] : []');
                    expect(tree.exists("/apps/myapp/src/app/+state/state.actions.ts")).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should add with custom directoryName', function () { return __awaiter(_this, void 0, void 0, function () {
        var tree, appModule;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testing_utils_1.runSchematic('ngrx', {
                        name: 'state',
                        module: 'apps/myapp/src/app/app.module.ts',
                        directory: 'myCustomState'
                    }, appTree)];
                case 1:
                    tree = _a.sent();
                    appModule = test_1.getFileContent(tree, '/apps/myapp/src/app/app.module.ts');
                    expect(appModule).toContain('StoreModule.forFeature');
                    expect(appModule).toContain('EffectsModule.forFeature');
                    expect(appModule).not.toContain('!environment.production ? [storeFreeze] : []');
                    expect(tree.exists("/apps/myapp/src/app/my-custom-state/state.actions.ts")).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should only add files', function () { return __awaiter(_this, void 0, void 0, function () {
        var tree, appModule;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testing_utils_1.runSchematic('ngrx', {
                        name: 'state',
                        module: 'apps/myapp/src/app/app.module.ts',
                        onlyAddFiles: true,
                        facade: true
                    }, appTree)];
                case 1:
                    tree = _a.sent();
                    appModule = test_1.getFileContent(tree, '/apps/myapp/src/app/app.module.ts');
                    expect(appModule).not.toContain('StoreModule');
                    expect(appModule).not.toContain('!environment.production ? [storeFreeze] : []');
                    [
                        '/apps/myapp/src/app/+state/state.effects.ts',
                        '/apps/myapp/src/app/+state/state.facade.ts',
                        '/apps/myapp/src/app/+state/state.reducer.ts',
                        '/apps/myapp/src/app/+state/state.selectors.ts',
                        '/apps/myapp/src/app/+state/state.effects.spec.ts',
                        '/apps/myapp/src/app/+state/state.facade.spec.ts',
                        '/apps/myapp/src/app/+state/state.selectors.spec.ts'
                    ].forEach(function (fileName) {
                        expect(tree.exists(fileName)).toBeTruthy();
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it('should update package.json', function () { return __awaiter(_this, void 0, void 0, function () {
        var tree, packageJson;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testing_utils_1.runSchematic('ngrx', {
                        name: 'state',
                        module: 'apps/myapp/src/app/app.module.ts'
                    }, appTree)];
                case 1:
                    tree = _a.sent();
                    packageJson = ast_utils_1.readJsonInTree(tree, 'package.json');
                    expect(packageJson.dependencies['@ngrx/store']).toBeDefined();
                    expect(packageJson.dependencies['@ngrx/router-store']).toBeDefined();
                    expect(packageJson.dependencies['@ngrx/effects']).toBeDefined();
                    expect(packageJson.devDependencies['@ngrx/store-devtools']).toBeDefined();
                    expect(packageJson.devDependencies['ngrx-store-freeze']).toBeDefined();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should error when no module is provided', function () { return __awaiter(_this, void 0, void 0, function () {
        var e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, testing_utils_1.runSchematic('ngrx', {
                            name: 'state',
                            module: ''
                        }, appTree)];
                case 1:
                    _a.sent();
                    fail();
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    expect(e_1.message).toEqual('The required --module option must be passed');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    it('should error the module could not be found', function () { return __awaiter(_this, void 0, void 0, function () {
        var e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, testing_utils_1.runSchematic('ngrx', {
                            name: 'state',
                            module: 'does-not-exist.ts'
                        }, appTree)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    e_2 = _a.sent();
                    expect(e_2.message).toEqual('Path does not exist: does-not-exist.ts');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    describe('code generation', function () {
        it('should scaffold the ngrx "user" files without a facade', function () { return __awaiter(_this, void 0, void 0, function () {
            var appConfig, hasFile, missingFile, statePath, tree;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        appConfig = testing_utils_1.getAppConfig();
                        hasFile = function (file) { return expect(tree.exists(file)).toBeTruthy(); };
                        missingFile = function (file) { return expect(tree.exists(file)).not.toBeTruthy(); };
                        statePath = name_utils_1.findModuleParent(appConfig.appModule) + "/+state";
                        return [4 /*yield*/, buildNgrxTree(appConfig)];
                    case 1:
                        tree = _a.sent();
                        hasFile(statePath + "/user.actions.ts");
                        hasFile(statePath + "/user.effects.ts");
                        hasFile(statePath + "/user.effects.spec.ts");
                        missingFile(statePath + "/user.facade.ts");
                        missingFile(statePath + "/user.facade.spec.ts");
                        hasFile(statePath + "/user.reducer.ts");
                        hasFile(statePath + "/user.reducer.spec.ts");
                        hasFile(statePath + "/user.selectors.ts");
                        return [2 /*return*/];
                }
            });
        }); });
        it('should scaffold the ngrx "user" files WITH a facade', function () { return __awaiter(_this, void 0, void 0, function () {
            var appConfig, hasFile, tree, statePath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        appConfig = testing_utils_1.getAppConfig();
                        hasFile = function (file) { return expect(tree.exists(file)).toBeTruthy(); };
                        return [4 /*yield*/, buildNgrxTree(appConfig, 'user', true)];
                    case 1:
                        tree = _a.sent();
                        statePath = name_utils_1.findModuleParent(appConfig.appModule) + "/+state";
                        hasFile(statePath + "/user.actions.ts");
                        hasFile(statePath + "/user.effects.ts");
                        hasFile(statePath + "/user.facade.ts");
                        hasFile(statePath + "/user.reducer.ts");
                        hasFile(statePath + "/user.selectors.ts");
                        hasFile(statePath + "/user.reducer.spec.ts");
                        hasFile(statePath + "/user.effects.spec.ts");
                        hasFile(statePath + "/user.selectors.spec.ts");
                        hasFile(statePath + "/user.facade.spec.ts");
                        return [2 /*return*/];
                }
            });
        }); });
        it('should build the ngrx actions', function () { return __awaiter(_this, void 0, void 0, function () {
            var appConfig, tree, statePath, content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        appConfig = testing_utils_1.getAppConfig();
                        return [4 /*yield*/, buildNgrxTree(appConfig, 'users')];
                    case 1:
                        tree = _a.sent();
                        statePath = name_utils_1.findModuleParent(appConfig.appModule) + "/+state";
                        content = test_1.getFileContent(tree, statePath + "/users.actions.ts");
                        expect(content).toContain('UsersActionTypes');
                        expect(content).toContain("LoadUsers = \"[Users] Load Users\"");
                        expect(content).toContain("UsersLoaded = \"[Users] Users Loaded\"");
                        expect(content).toContain("UsersLoadError = \"[Users] Users Load Error\"");
                        expect(content).toContain('class LoadUsers implements Action');
                        expect(content).toContain('class UsersLoaded implements Action');
                        expect(content).toContain('type UsersAction = LoadUsers | UsersLoaded | UsersLoadError');
                        expect(content).toContain('export const fromUsersActions');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should build the ngrx selectors', function () { return __awaiter(_this, void 0, void 0, function () {
            var appConfig, tree, statePath, content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        appConfig = testing_utils_1.getAppConfig();
                        return [4 /*yield*/, buildNgrxTree(appConfig, 'users')];
                    case 1:
                        tree = _a.sent();
                        statePath = name_utils_1.findModuleParent(appConfig.appModule) + "/+state";
                        content = test_1.getFileContent(tree, statePath + "/users.selectors.ts");
                        [
                            "import { USERS_FEATURE_KEY, UsersState } from './users.reducer'",
                            "export const usersQuery"
                        ].forEach(function (text) {
                            expect(content).toContain(text);
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should build the ngrx facade', function () { return __awaiter(_this, void 0, void 0, function () {
            var appConfig, includeFacade, tree, statePath, content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        appConfig = testing_utils_1.getAppConfig();
                        includeFacade = true;
                        return [4 /*yield*/, buildNgrxTree(appConfig, 'users', includeFacade)];
                    case 1:
                        tree = _a.sent();
                        statePath = name_utils_1.findModuleParent(appConfig.appModule) + "/+state";
                        content = test_1.getFileContent(tree, statePath + "/users.facade.ts");
                        [
                            "import { UsersPartialState } from './users.reducer'",
                            "import { usersQuery } from './users.selectors'",
                            "export class UsersFacade"
                        ].forEach(function (text) {
                            expect(content).toContain(text);
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should build the ngrx reducer', function () { return __awaiter(_this, void 0, void 0, function () {
            var appConfig, tree, statePath, content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        appConfig = testing_utils_1.getAppConfig();
                        return [4 /*yield*/, buildNgrxTree(appConfig, 'user')];
                    case 1:
                        tree = _a.sent();
                        statePath = name_utils_1.findModuleParent(appConfig.appModule) + "/+state";
                        content = test_1.getFileContent(tree, statePath + "/user.reducer.ts");
                        expect(content).not.toContain('function reducer');
                        [
                            "import { UserAction, UserActionTypes } from './user.actions'",
                            "export interface User",
                            "export interface UserState",
                            'export function userReducer',
                            'state: UserState = initialState',
                            'action: UserAction',
                            '): UserState',
                            'case UserActionTypes.UserLoaded'
                        ].forEach(function (text) {
                            expect(content).toContain(text);
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should build the ngrx effects', function () { return __awaiter(_this, void 0, void 0, function () {
            var appConfig, tree, statePath, content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        appConfig = testing_utils_1.getAppConfig();
                        return [4 /*yield*/, buildNgrxTree(appConfig, 'users')];
                    case 1:
                        tree = _a.sent();
                        statePath = name_utils_1.findModuleParent(appConfig.appModule) + "/+state";
                        content = test_1.getFileContent(tree, statePath + "/users.effects.ts");
                        [
                            "import { DataPersistence } from '@nrwl/nx'",
                            "import { LoadUsers, UsersLoaded, UsersLoadError, UsersActionTypes } from './users.actions';",
                            "loadUsers$",
                            "run: (action: LoadUsers, state: UsersPartialState)",
                            "return new UsersLoaded([])",
                            "return new UsersLoadError(error)",
                            'private actions$: Actions',
                            'private dataPersistence: DataPersistence<UsersPartialState>'
                        ].forEach(function (text) {
                            expect(content).toContain(text);
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('unit tests', function () {
        it('should produce proper specs for the ngrx reducer', function () { return __awaiter(_this, void 0, void 0, function () {
            var appConfig, tree, statePath, contents;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        appConfig = testing_utils_1.getAppConfig();
                        return [4 /*yield*/, buildNgrxTree(appConfig)];
                    case 1:
                        tree = _a.sent();
                        statePath = name_utils_1.findModuleParent(appConfig.appModule) + "/+state";
                        contents = tree.readContent(statePath + "/user.reducer.spec.ts");
                        expect(contents).toContain("describe('User Reducer', () => {");
                        expect(contents).toContain('const result = userReducer(initialState, action);');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should update the barrel API with exports for ngrx facade, selector, and reducer', function () { return __awaiter(_this, void 0, void 0, function () {
            var libConfig, tree, barrel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        appTree = testing_utils_1.createLib(appTree, 'flights');
                        libConfig = testing_utils_1.getLibConfig();
                        return [4 /*yield*/, testing_utils_1.runSchematic('ngrx', {
                                name: 'super-users',
                                module: libConfig.module,
                                facade: true
                            }, appTree)];
                    case 1:
                        tree = _a.sent();
                        barrel = tree.readContent(libConfig.barrel);
                        expect(barrel).toContain("export * from './lib/+state/super-users.facade';");
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not update the barrel API with a facade', function () { return __awaiter(_this, void 0, void 0, function () {
            var libConfig, tree, barrel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        appTree = testing_utils_1.createLib(appTree, 'flights');
                        libConfig = testing_utils_1.getLibConfig();
                        return [4 /*yield*/, testing_utils_1.runSchematic('ngrx', {
                                name: 'super-users',
                                module: libConfig.module,
                                facade: false
                            }, appTree)];
                    case 1:
                        tree = _a.sent();
                        barrel = tree.readContent(libConfig.barrel);
                        expect(barrel).not.toContain("export * from './lib/+state/super-users.facade';");
                        return [2 /*return*/];
                }
            });
        }); });
        it('should produce proper tests for the ngrx reducer for a name with a dash', function () { return __awaiter(_this, void 0, void 0, function () {
            var appConfig, tree, statePath, contents;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        appConfig = testing_utils_1.getAppConfig();
                        return [4 /*yield*/, testing_utils_1.runSchematic('ngrx', {
                                name: 'super-users',
                                module: appConfig.appModule
                            }, appTree)];
                    case 1:
                        tree = _a.sent();
                        statePath = name_utils_1.findModuleParent(appConfig.appModule) + "/+state";
                        contents = tree.readContent(statePath + "/super-users.reducer.spec.ts");
                        expect(contents).toContain("describe('SuperUsers Reducer', () => {");
                        expect(contents).toContain("const result = superUsersReducer(initialState, action);");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    function buildNgrxTree(appConfig, featureName, withFacade) {
        if (featureName === void 0) { featureName = 'user'; }
        if (withFacade === void 0) { withFacade = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_utils_1.runSchematic('ngrx', {
                            name: featureName,
                            module: appConfig.appModule,
                            facade: withFacade
                        }, appTree)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    }
});
