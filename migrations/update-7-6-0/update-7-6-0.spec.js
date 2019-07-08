"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
var testing_1 = require("@angular-devkit/schematics/testing");
var path_1 = require("path");
var fileutils_1 = require("../../src/utils/fileutils");
var ast_utils_1 = require("../../src/utils/ast-utils");
var literals_1 = require("@angular-devkit/core/src/utils/literals");
var effectContents = "\nimport { Injectable } from '@angular/core';\nimport { Store } from '@ngrx/store';\nimport { Effect, Actions } from '@ngrx/effects';\nimport { DataPersistence } from '@nrwl/nx';\n\nimport { UserPartialState } from './user.reducer';\nimport {\n  LoadUser,\n  UserLoaded,\n  UserLoadError,\n  UserActionTypes\n} from './user.actions';\n\n@Injectable()\nexport class UserEffects {\n  @Effect() effect$ = this.actions$.ofType(LoadUser).pipe(mapTo(UserLoaded));\n  @Effect() effect2$ = this.actions$.ofType<UserLoaded>(LoadUser).pipe(mapTo(UserLoaded));\n  @Effect() effect3$ = this.actions$.ofType<UserLoaded>(LoadUser).pipe(withLatestFrom(this.store.select(selector)), mapTo(UserLoaded));\n\n  constructor(\n    private actions$: Actions,\n    private dataPersistence: DataPersistence<UserPartialState>,\n    private store: Store<AppState>\n  ) {}\n}\n\n";
var selectorContents = "\nimport { Store } from '@ngrx/store';\nimport { Component } from '@angular/core';\nimport { AppState, selector } from '../+state';\n\n@Component({\n  selector: 'app',\n  template: '',\n  styles: []\n})\nexport class AppComponent {\n  slice$ = this.store.select(selector).pipe(\n    map(a => a)\n  );\n\n  slice2$: Observable<string>;\n\n  slice3$ = Observable.from([]).pipe(\n    withLatestFrom(this.store.select(selector5))\n  );\n\n  constructor(\n    private store: Store<AppState>\n  ) {}\n\n  ngOnInit() {\n    this.slice2$ = this.store.select(selector2);\n    this.store.select(selector3).subscribe(console.log);\n  }\n}\n\n";
describe('Update 7.6.0', function () {
    var initialTree;
    var schematicRunner;
    beforeEach(function () {
        initialTree = new testing_1.UnitTestTree(schematics_1.Tree.empty());
        initialTree.create('package.json', fileutils_1.serializeJson({
            dependencies: {
                '@ngrx/effects': '6.1.2',
                '@ngrx/router-store': '6.1.2',
                '@ngrx/store': '6.1.2'
            },
            devDependencies: {
                '@ngrx/schematics': '6.1.2',
                '@ngrx/store-devtools': '6.1.2'
            }
        }));
        schematicRunner = new testing_1.SchematicTestRunner('@nrwl/schematics', path_1.join(__dirname, '../migrations.json'));
    });
    describe('VSCode Extension Recommendations', function () {
        it('should be added', function () { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, schematicRunner
                            .runSchematicAsync('update-7.6.0', {}, initialTree)
                            .toPromise()];
                    case 1:
                        result = _a.sent();
                        expect(ast_utils_1.readJsonInTree(result, '.vscode/extensions.json')).toEqual({
                            recommendations: [
                                'nrwl.angular-console',
                                'angular.ng-template',
                                'esbenp.prettier-vscode'
                            ]
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should be added to existing recommendations', function () { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, schematicRunner
                            .callRule(ast_utils_1.updateJsonInTree('.vscode/extensions.json', function () { return ({
                            recommendations: ['eamodio.gitlens', 'angular.ng-template']
                        }); }), initialTree)
                            .toPromise()];
                    case 1:
                        initialTree = _a.sent();
                        return [4 /*yield*/, schematicRunner
                                .runSchematicAsync('update-7.6.0', {}, initialTree)
                                .toPromise()];
                    case 2:
                        result = _a.sent();
                        expect(ast_utils_1.readJsonInTree(result, '.vscode/extensions.json')).toEqual({
                            recommendations: [
                                'eamodio.gitlens',
                                'angular.ng-template',
                                'nrwl.angular-console',
                                'esbenp.prettier-vscode'
                            ]
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('adding dotenv', function () {
        it('should add dotenv as a dev dependency', function () { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, schematicRunner
                            .runSchematicAsync('update-7.6.0', {}, initialTree)
                            .toPromise()];
                    case 1:
                        result = _a.sent();
                        expect(ast_utils_1.readJsonInTree(result, 'package.json').devDependencies['dotenv']).toEqual('6.2.0');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('setting defaults to karma, protractor, express', function () {
        it('should default to karma, protractor and express', function () { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, schematicRunner
                            .runSchematicAsync('update-7.6.0', {}, initialTree)
                            .toPromise()];
                    case 1:
                        result = _a.sent();
                        expect(ast_utils_1.readJsonInTree(result, 'angular.json').schematics['@nrwl/schematics:library'].unitTestRunner).toEqual('karma');
                        expect(ast_utils_1.readJsonInTree(result, 'angular.json').schematics['@nrwl/schematics:application'].unitTestRunner).toEqual('karma');
                        expect(ast_utils_1.readJsonInTree(result, 'angular.json').schematics['@nrwl/schematics:application'].e2eTestRunner).toEqual('protractor');
                        expect(ast_utils_1.readJsonInTree(result, 'angular.json').schematics['@nrwl/schematics:node-application'].framework).toEqual('express');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('NgRx Migration', function () {
        it('should update ngrx to 7.1.0', function () { return __awaiter(_this, void 0, void 0, function () {
            var result, json;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, schematicRunner
                            .runSchematicAsync('update-7.6.0', {}, initialTree)
                            .toPromise()];
                    case 1:
                        result = _a.sent();
                        json = ast_utils_1.readJsonInTree(result, 'package.json');
                        expect(json.dependencies['@ngrx/effects']).toEqual('7.2.0');
                        expect(json.dependencies['@ngrx/router-store']).toEqual('7.2.0');
                        expect(json.dependencies['@ngrx/store']).toEqual('7.2.0');
                        expect(json.devDependencies['@ngrx/schematics']).toEqual('7.2.0');
                        expect(json.devDependencies['@ngrx/store-devtools']).toEqual('7.2.0');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should convert ofType code', function () { return __awaiter(_this, void 0, void 0, function () {
            var result, contents;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        initialTree.create('user.effects.ts', effectContents);
                        return [4 /*yield*/, schematicRunner
                                .runSchematicAsync('update-7.6.0', {}, initialTree)
                                .toPromise()];
                    case 1:
                        result = _a.sent();
                        contents = result.readContent('user.effects.ts');
                        expect(contents).toContain("import { Effect, Actions, ofType } from '@ngrx/effects';");
                        expect(literals_1.stripIndents(templateObject_1 || (templateObject_1 = __makeTemplateObject(["", ""], ["", ""])), contents)).toContain(literals_1.stripIndents(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n          @Effect() effect$ = this.actions$.pipe(\n            ofType(LoadUser),\n            mapTo(UserLoaded)\n          );"], ["\n          @Effect() effect$ = this.actions$.pipe(\n            ofType(LoadUser),\n            mapTo(UserLoaded)\n          );"]))));
                        expect(literals_1.stripIndents(templateObject_3 || (templateObject_3 = __makeTemplateObject(["", ""], ["", ""])), contents)).toContain(literals_1.stripIndents(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n          @Effect() effect2$ = this.actions$.pipe(\n            ofType<UserLoaded>(LoadUser),\n            mapTo(UserLoaded)\n          );"], ["\n          @Effect() effect2$ = this.actions$.pipe(\n            ofType<UserLoaded>(LoadUser),\n            mapTo(UserLoaded)\n          );"]))));
                        expect(literals_1.stripIndents(templateObject_5 || (templateObject_5 = __makeTemplateObject(["", ""], ["", ""])), contents)).toContain(literals_1.stripIndents(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n          @Effect() effect3$ = this.actions$.pipe(\n            ofType<UserLoaded>(LoadUser),\n            withLatestFrom(this.store.pipe(select(selector))),\n            mapTo(UserLoaded)\n          );"], ["\n          @Effect() effect3$ = this.actions$.pipe(\n            ofType<UserLoaded>(LoadUser),\n            withLatestFrom(this.store.pipe(select(selector))),\n            mapTo(UserLoaded)\n          );"]))));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should convert select code', function () { return __awaiter(_this, void 0, void 0, function () {
            var result, contents;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        initialTree.create('app.component.ts', selectorContents);
                        return [4 /*yield*/, schematicRunner
                                .runSchematicAsync('update-7.6.0', {}, initialTree)
                                .toPromise()];
                    case 1:
                        result = _a.sent();
                        contents = result.readContent('app.component.ts');
                        expect(contents).toContain("import { Store, select } from '@ngrx/store';");
                        expect(literals_1.stripIndents(templateObject_7 || (templateObject_7 = __makeTemplateObject(["", ""], ["", ""])), contents)).toContain(literals_1.stripIndents(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n          slice$ = this.store.pipe(\n            select(selector),\n            map(a => a)\n          );"], ["\n          slice$ = this.store.pipe(\n            select(selector),\n            map(a => a)\n          );"]))));
                        expect(contents).toContain('this.slice2$ = this.store.pipe(select(selector2))');
                        expect(contents).toContain('this.store.pipe(select(selector3)).subscribe(console.log);');
                        expect(literals_1.stripIndents(templateObject_9 || (templateObject_9 = __makeTemplateObject(["", ""], ["", ""])), contents)).toContain(literals_1.stripIndents(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n        slice3$ = Observable.from([]).pipe(\n          withLatestFrom(this.store.pipe(select(selector5)))\n        );"], ["\n        slice3$ = Observable.from([]).pipe(\n          withLatestFrom(this.store.pipe(select(selector5)))\n        );"]))));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Update Angular CLI', function () {
        it('should update @angular-devkit/build-angular', function () { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, schematicRunner
                            .runSchematicAsync('update-7.6.0', {}, initialTree)
                            .toPromise()];
                    case 1:
                        result = _a.sent();
                        expect(ast_utils_1.readJsonInTree(result, 'package.json').devDependencies['@angular-devkit/build-angular']).toEqual('~0.13.1');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10;
