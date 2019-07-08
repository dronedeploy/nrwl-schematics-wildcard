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
var testing_1 = require("@angular-devkit/schematics/testing");
var schematics_1 = require("@angular-devkit/schematics");
var prettier = require("prettier");
var path = require("path");
var format_files_1 = require("./format-files");
var appRoot = require("app-root-path");
describe('formatFiles', function () {
    var tree;
    var schematicRunner;
    beforeEach(function () {
        schematicRunner = new testing_1.SchematicTestRunner('@nrwl/schematics', path.join(__dirname, '../../collection.json'));
        spyOn(prettier, 'format').and.callFake(function (input) { return 'formated :: ' + input; });
        tree = schematics_1.Tree.empty();
    });
    it('should format created files', function () { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    spyOn(prettier, 'resolveConfig').and.returnValue(Promise.resolve({
                        printWidth: 80
                    }));
                    tree.create('a.ts', 'const a=a');
                    return [4 /*yield*/, schematicRunner
                            .callRule(format_files_1.formatFiles(), tree)
                            .toPromise()];
                case 1:
                    result = _a.sent();
                    expect(prettier.format).toHaveBeenCalledWith('const a=a', {
                        printWidth: 80,
                        filepath: appRoot.resolve('a.ts')
                    });
                    expect(result.read('a.ts').toString()).toEqual('formated :: const a=a');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should not format deleted files', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    spyOn(prettier, 'resolveConfig').and.returnValue(Promise.resolve({
                        printWidth: 80
                    }));
                    tree.create('b.ts', '');
                    tree.delete('b.ts');
                    return [4 /*yield*/, schematicRunner.callRule(format_files_1.formatFiles(), tree).toPromise()];
                case 1:
                    _a.sent();
                    expect(prettier.format).not.toHaveBeenCalledWith('const b=b', jasmine.anything());
                    return [2 /*return*/];
            }
        });
    }); });
    it('should format overwritten files', function () { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    spyOn(prettier, 'resolveConfig').and.returnValue(Promise.resolve(null));
                    tree.create('a.ts', 'const a=a');
                    tree.overwrite('a.ts', 'const a=b');
                    return [4 /*yield*/, schematicRunner
                            .callRule(format_files_1.formatFiles(), tree)
                            .toPromise()];
                case 1:
                    result = _a.sent();
                    expect(prettier.format).toHaveBeenCalledWith('const a=b', {
                        filepath: appRoot.resolve('a.ts')
                    });
                    expect(result.read('a.ts').toString()).toEqual('formated :: const a=b');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should not format renamed files', function () { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    spyOn(prettier, 'resolveConfig').and.returnValue(Promise.resolve(null));
                    tree.create('a.ts', 'const a=a');
                    tree.rename('a.ts', 'b.ts');
                    return [4 /*yield*/, schematicRunner
                            .callRule(format_files_1.formatFiles(), tree)
                            .toPromise()];
                case 1:
                    result = _a.sent();
                    expect(prettier.format).toHaveBeenCalledWith('const a=a', {
                        filepath: appRoot.resolve('b.ts')
                    });
                    expect(result.read('b.ts').toString()).toEqual('formated :: const a=a');
                    return [2 /*return*/];
            }
        });
    }); });
    describe('--skip-format', function () {
        it('should not format created files', function () { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spyOn(prettier, 'resolveConfig').and.returnValue(Promise.resolve({
                            printWidth: 80
                        }));
                        tree.create('a.ts', 'const a=a');
                        return [4 /*yield*/, schematicRunner
                                .callRule(format_files_1.formatFiles({
                                skipFormat: true
                            }), tree)
                                .toPromise()];
                    case 1:
                        result = _a.sent();
                        expect(prettier.format).not.toHaveBeenCalledWith('const a=a', {
                            printWidth: 80,
                            filepath: appRoot.resolve('a.ts')
                        });
                        expect(result.read('a.ts').toString()).toEqual('const a=a');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
