"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var touched_1 = require("./touched");
var affected_apps_1 = require("./affected-apps");
describe('touchedProjects', function () {
    it('should return the list of touchedProjects', function () {
        var tp = touched_1.touchedProjects({
            files: {
                'package.json': ['app1Name', 'app2Name', 'lib1Name', 'lib2Name']
            },
            projects: {}
        }, [
            {
                name: 'app1Name',
                root: 'apps/app1',
                files: ['app1.ts'],
                fileMTimes: {
                    'app1.ts': 1
                },
                tags: [],
                implicitDependencies: [],
                architect: {},
                type: affected_apps_1.ProjectType.app
            },
            {
                name: 'app2Name',
                root: 'apps/app2',
                files: ['app2.ts'],
                fileMTimes: {
                    'app2.ts': 1
                },
                tags: [],
                implicitDependencies: [],
                architect: {},
                type: affected_apps_1.ProjectType.app
            },
            {
                name: 'lib1Name',
                root: 'libs/lib1',
                files: ['lib1.ts'],
                fileMTimes: {
                    'lib1.ts': 1
                },
                tags: [],
                implicitDependencies: [],
                architect: {},
                type: affected_apps_1.ProjectType.lib
            },
            {
                name: 'lib2Name',
                root: 'libs/lib2',
                files: ['lib2.ts'],
                fileMTimes: {
                    'lib2.ts': 1
                },
                tags: [],
                implicitDependencies: [],
                architect: {},
                type: affected_apps_1.ProjectType.lib
            }
        ], ['lib2.ts', 'app2.ts', 'package.json']);
        expect(tp).toEqual(['app1Name', 'app2Name', 'lib1Name', 'lib2Name']);
    });
    it('should return the list of touchedProjects independent from the git structure', function () {
        var tp = touched_1.touchedProjects({
            files: {
                'package.json': ['app1Name', 'app2Name', 'lib1Name', 'lib2Name']
            },
            projects: {}
        }, [
            {
                name: 'app1Name',
                root: 'apps/app1',
                files: ['app1.ts'],
                fileMTimes: {
                    'app1.ts': 1
                },
                tags: [],
                implicitDependencies: [],
                architect: {},
                type: affected_apps_1.ProjectType.app
            },
            {
                name: 'app2Name',
                root: 'apps/app2',
                files: ['app2.ts'],
                fileMTimes: {
                    'app2.ts': 1
                },
                tags: [],
                implicitDependencies: [],
                architect: {},
                type: affected_apps_1.ProjectType.app
            },
            {
                name: 'lib1Name',
                root: 'libs/lib1',
                files: ['lib1.ts'],
                fileMTimes: {
                    'lib1.ts': 1
                },
                tags: [],
                implicitDependencies: [],
                architect: {},
                type: affected_apps_1.ProjectType.lib
            },
            {
                name: 'lib2Name',
                root: 'libs/lib2',
                files: ['lib2.ts'],
                fileMTimes: {
                    'lib2.ts': 1
                },
                tags: [],
                implicitDependencies: [],
                architect: {},
                type: affected_apps_1.ProjectType.lib
            }
        ], ['gitrepo/some/path/inside/nx/libs/lib2/lib2.ts', 'apps/app2/app2.ts']);
        expect(tp).toEqual(['app2Name', 'lib2Name']);
    });
    it('should return the list of implicitly touched projects', function () {
        var tp = touched_1.touchedProjects({
            files: {
                'package.json': ['app1Name', 'app2Name', 'lib1Name', 'lib2Name'],
                Jenkinsfile: ['app1Name', 'app2Name']
            },
            projects: {}
        }, [
            {
                name: 'app1Name',
                root: 'apps/app1',
                files: ['app1.ts'],
                fileMTimes: {
                    'app1.ts': 1
                },
                tags: [],
                implicitDependencies: [],
                architect: {},
                type: affected_apps_1.ProjectType.app
            },
            {
                name: 'app2Name',
                root: 'apps/app2',
                files: ['app2.ts'],
                fileMTimes: {
                    'app2.ts': 1
                },
                tags: [],
                implicitDependencies: [],
                architect: {},
                type: affected_apps_1.ProjectType.app
            },
            {
                name: 'lib1Name',
                root: 'libs/lib1',
                files: ['lib1.ts'],
                fileMTimes: {
                    'lib1.ts': 1
                },
                tags: [],
                implicitDependencies: [],
                architect: {},
                type: affected_apps_1.ProjectType.lib
            },
            {
                name: 'lib2Name',
                root: 'libs/lib2',
                files: ['lib2.ts'],
                fileMTimes: {
                    'lib2.ts': 1
                },
                tags: [],
                implicitDependencies: [],
                architect: {},
                type: affected_apps_1.ProjectType.lib
            }
        ], ['Jenkinsfile']);
        expect(tp).toEqual(['app1Name', 'app2Name']);
    });
    it('should return the list of implicitly touched projects independent from the git structure', function () {
        var tp = touched_1.touchedProjects({
            files: {
                'package.json': ['app1Name', 'app2Name', 'lib1Name', 'lib2Name'],
                Jenkinsfile: ['app1Name', 'app2Name']
            },
            projects: {}
        }, [
            {
                name: 'app1Name',
                root: 'apps/app1',
                files: ['app1.ts'],
                fileMTimes: {
                    'app1.ts': 1
                },
                tags: [],
                implicitDependencies: [],
                architect: {},
                type: affected_apps_1.ProjectType.app
            },
            {
                name: 'app2Name',
                root: 'apps/app2',
                files: ['app2.ts'],
                fileMTimes: {
                    'app2.ts': 1
                },
                tags: [],
                implicitDependencies: [],
                architect: {},
                type: affected_apps_1.ProjectType.app
            },
            {
                name: 'lib1Name',
                root: 'libs/lib1',
                files: ['lib1.ts'],
                fileMTimes: {
                    'lib1.ts': 1
                },
                tags: [],
                implicitDependencies: [],
                architect: {},
                type: affected_apps_1.ProjectType.lib
            },
            {
                name: 'lib2Name',
                root: 'libs/lib2',
                files: ['lib2.ts'],
                fileMTimes: {
                    'lib2.ts': 1
                },
                tags: [],
                implicitDependencies: [],
                architect: {},
                type: affected_apps_1.ProjectType.lib
            }
        ], ['gitrepo/some/path/Jenkinsfile']);
        expect(tp).toEqual(['app1Name', 'app2Name']);
    });
});
