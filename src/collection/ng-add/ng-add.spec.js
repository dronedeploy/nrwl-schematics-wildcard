"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var schematics_1 = require("@angular-devkit/schematics");
var testing_utils_1 = require("@nrwl/schematics/src/utils/testing-utils");
describe('workspace', function () {
    var appTree;
    beforeEach(function () {
        appTree = new schematics_1.VirtualTree();
    });
    it('should error if no package.json is present', function () {
        expect(function () {
            testing_utils_1.schematicRunner.runSchematic('ng-add', { name: 'myApp' }, appTree);
        }).toThrow('Cannot find package.json');
    });
    it('should error if no e2e/protractor.conf.js is present', function () {
        expect(function () {
            appTree.create('/package.json', JSON.stringify({}));
            appTree.create('/angular.json', JSON.stringify({
                projects: {
                    proj1: {
                        architect: {}
                    },
                    'proj1-e2e': {
                        architect: {
                            e2e: {
                                options: {
                                    protractorConfig: 'e2e/protractor.conf.js'
                                }
                            }
                        }
                    }
                }
            }));
            testing_utils_1.schematicRunner.runSchematic('ng-add', { name: 'proj1' }, appTree);
        }).toThrow('An e2e project was specified but e2e/protractor.conf.js could not be found.');
    });
    it('should error if no angular.json is present', function () {
        expect(function () {
            appTree.create('/package.json', JSON.stringify({}));
            appTree.create('/e2e/protractor.conf.js', '');
            testing_utils_1.schematicRunner.runSchematic('ng-add', { name: 'myApp' }, appTree);
        }).toThrow('Cannot find angular.json');
    });
    it('should error if the angular.json specifies more than one app', function () {
        appTree.create('/package.json', JSON.stringify({}));
        appTree.create('/e2e/protractor.conf.js', '');
        appTree.create('/angular.json', JSON.stringify({
            projects: {
                proj1: {},
                'proj1-e2e': {},
                proj2: {},
                'proj2-e2e': {}
            }
        }));
        expect(function () {
            testing_utils_1.schematicRunner.runSchematic('ng-add', { name: 'myApp' }, appTree);
        }).toThrow('Can only convert projects with one app');
    });
});
