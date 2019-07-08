"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular-devkit/schematics/testing");
var path = require("path");
var schematics_1 = require("@angular-devkit/schematics");
var ast_utils_1 = require("../../utils/ast-utils");
describe('workspace', function () {
    var schematicRunner = new testing_1.SchematicTestRunner('@nrwl/schematics', path.join(__dirname, '../../collection.json'));
    var projectTree;
    beforeEach(function () {
        projectTree = schematics_1.Tree.empty();
    });
    it('should update angular.json', function () {
        var tree = schematicRunner.runSchematic('workspace', { name: 'proj' }, projectTree);
    });
    it('should create files', function () {
        var tree = schematicRunner.runSchematic('workspace', { name: 'proj' }, projectTree);
        expect(tree.exists('/nx.json')).toBe(true);
        expect(tree.exists('/angular.json')).toBe(true);
        expect(tree.exists('/.prettierrc')).toBe(true);
        expect(tree.exists('/.prettierignore')).toBe(true);
    });
    it('should create nx.json', function () {
        var tree = schematicRunner.runSchematic('workspace', { name: 'proj' }, projectTree);
        var nxJson = ast_utils_1.readJsonInTree(tree, '/nx.json');
        expect(nxJson).toEqual({
            npmScope: 'proj',
            implicitDependencies: {
                'angular.json': '*',
                'package.json': '*',
                'tsconfig.json': '*',
                'tslint.json': '*',
                'nx.json': '*'
            },
            projects: {}
        });
    });
    it('should recommend vscode extensions', function () {
        var tree = schematicRunner.runSchematic('workspace', { name: 'proj' }, projectTree);
        var recommendations = ast_utils_1.readJsonInTree(tree, '/.vscode/extensions.json').recommendations;
        expect(recommendations).toEqual([
            'nrwl.angular-console',
            'angular.ng-template',
            'ms-vscode.vscode-typescript-tslint-plugin',
            'esbenp.prettier-vscode'
        ]);
    });
    it('should configure the project to use style argument', function () {
        var tree = schematicRunner.runSchematic('workspace', { name: 'proj', style: 'scss' }, projectTree);
        expect(JSON.parse(tree.readContent('/angular.json')).schematics).toEqual({
            '@nrwl/schematics:application': {
                style: 'scss'
            },
            '@nrwl/schematics:library': {
                style: 'scss'
            }
        });
    });
});
