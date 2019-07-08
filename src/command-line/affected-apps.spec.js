"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var affected_apps_1 = require("./affected-apps");
var deps_calculator_1 = require("./deps-calculator");
var fs = require("fs");
describe('affected-apps', function () {
    var deps;
    var projects;
    beforeEach(function () {
        spyOn(fs, 'writeFileSync');
        deps = {
            app1Name: [],
            app2Name: [],
            lib1Name: [],
            lib2Name: []
        };
        projects = [
            {
                name: 'app1Name',
                root: 'apps/app1',
                files: ['apps/app1/app1.ts'],
                fileMTimes: {
                    'apps/app1/app1.ts': 1
                },
                tags: [],
                implicitDependencies: [],
                architect: {},
                type: affected_apps_1.ProjectType.app
            },
            {
                name: 'app2Name',
                root: 'apps/app2',
                files: ['apps/app2/app2.ts'],
                fileMTimes: {
                    'apps/app2/app2.ts': 1
                },
                tags: [],
                implicitDependencies: [],
                architect: {},
                type: affected_apps_1.ProjectType.app
            },
            {
                name: 'lib1Name',
                root: 'libs/lib1',
                files: ['libs/lib1/lib1.ts'],
                fileMTimes: {
                    'libs/lib1/lib1.ts': 1
                },
                tags: [],
                implicitDependencies: [],
                architect: {},
                type: affected_apps_1.ProjectType.lib
            },
            {
                name: 'lib2Name',
                root: 'libs/lib2',
                files: ['libs/lib2/lib2.ts'],
                fileMTimes: {
                    'libs/lib2/lib2.ts': 1
                },
                tags: [],
                implicitDependencies: [],
                architect: {},
                type: affected_apps_1.ProjectType.lib
            }
        ];
    });
    describe('affectedAppNames', function () {
        it('should return the list of affected apps', function () {
            deps = __assign({}, deps, { app1Name: [
                    {
                        projectName: 'lib1Name',
                        type: deps_calculator_1.DependencyType.es6Import
                    }
                ] });
            var affected = affected_apps_1.affectedAppNames(projects, deps, ['lib1Name']);
            expect(affected).toEqual(['app1Name']);
        });
        it('should handle circular dependencies', function () {
            deps = __assign({}, deps, { app1Name: [
                    {
                        projectName: 'app2Name',
                        type: deps_calculator_1.DependencyType.es6Import
                    }
                ], app2Name: [
                    {
                        projectName: 'app1Name',
                        type: deps_calculator_1.DependencyType.es6Import
                    }
                ] });
            var affected = affected_apps_1.affectedAppNames(projects, deps, ['app1Name']);
            expect(affected).toEqual(['app1Name', 'app2Name']);
        });
    });
});
