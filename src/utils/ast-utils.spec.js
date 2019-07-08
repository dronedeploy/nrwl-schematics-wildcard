"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ast_utils_1 = require("./ast-utils");
var schematics_1 = require("@angular-devkit/schematics");
var fileutils_1 = require("./fileutils");
describe('readJsonInTree', function () {
    var tree;
    beforeEach(function () {
        tree = schematics_1.Tree.empty();
    });
    it('should read JSON from the tree', function () {
        tree.create('data.json', fileutils_1.serializeJson({
            data: 'data'
        }));
        expect(ast_utils_1.readJsonInTree(tree, 'data.json')).toEqual({
            data: 'data'
        });
    });
    it('should throw an error if the file does not exist', function () {
        expect(function () { return ast_utils_1.readJsonInTree(tree, 'data.json'); }).toThrow('Cannot find data.json');
    });
    it('should throw an error if the file cannot be parsed', function () {
        tree.create('data.json', "{ data: 'data'");
        expect(function () { return ast_utils_1.readJsonInTree(tree, 'data.json'); }).toThrow('Cannot parse data.json: Unexpected token d in JSON at position 2');
    });
});
