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
var fs = require("fs");
var deps_calculator_1 = require("./deps-calculator");
var affected_apps_1 = require("./affected-apps");
var fileutils_1 = require("../utils/fileutils");
describe('DepsCalculator', function () {
    var depsCalculator;
    var initialDeps;
    var virtualFs;
    var projects;
    var fileRead;
    beforeEach(function () {
        initialDeps = {
            dependencies: {},
            files: {}
        };
        virtualFs = {};
        projects = [
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
        ];
        fileRead = function (file) {
            switch (file) {
                case 'dist/nxdeps.json':
                    return fileutils_1.serializeJson(initialDeps);
                default:
                    return virtualFs[file];
            }
        };
    });
    describe('initialization', function () {
        it('should not be incremental for new graphs', function () {
            depsCalculator = new deps_calculator_1.DepsCalculator('nrwl', projects, null, fileRead);
            expect(depsCalculator.getDeps()).toEqual({
                lib2Name: [],
                lib1Name: [],
                app1Name: []
            });
            expect(depsCalculator.incrementalEnabled).toEqual(false);
        });
        it('should be incremental for an existing graph with no projects added or removed', function () {
            initialDeps.dependencies = {
                app1Name: [
                    {
                        projectName: 'lib1Name',
                        type: deps_calculator_1.DependencyType.loadChildren
                    },
                    {
                        projectName: 'lib2Name',
                        type: deps_calculator_1.DependencyType.loadChildren
                    }
                ],
                lib1Name: [],
                lib2Name: []
            };
            initialDeps.files = {
                'app1.ts': [
                    {
                        projectName: 'lib1Name',
                        type: deps_calculator_1.DependencyType.loadChildren
                    },
                    {
                        projectName: 'lib2Name',
                        type: deps_calculator_1.DependencyType.loadChildren
                    }
                ],
                'lib1.ts': [],
                'lib2.ts': []
            };
            var result = new deps_calculator_1.DepsCalculator('nrwl', projects, initialDeps, fileRead);
            expect(result.incrementalEnabled).toEqual(true);
            expect(result.getDeps()).toEqual({
                lib2Name: [],
                lib1Name: [],
                app1Name: [
                    {
                        projectName: 'lib1Name',
                        type: 'loadChildren'
                    },
                    {
                        projectName: 'lib2Name',
                        type: 'loadChildren'
                    }
                ]
            });
        });
        it('should not be incremental if projects are added to an existing graph', function () {
            initialDeps.dependencies = {
                app1Name: [
                    {
                        projectName: 'lib1Name',
                        type: deps_calculator_1.DependencyType.loadChildren
                    },
                    {
                        projectName: 'lib2Name',
                        type: deps_calculator_1.DependencyType.loadChildren
                    }
                ],
                lib1Name: [],
                lib2Name: []
            };
            initialDeps.files = {
                'app1.ts': [
                    {
                        projectName: 'lib1Name',
                        type: deps_calculator_1.DependencyType.loadChildren
                    },
                    {
                        projectName: 'lib2Name',
                        type: deps_calculator_1.DependencyType.loadChildren
                    }
                ],
                'lib1.ts': [],
                'lib2.ts': []
            };
            projects = projects.concat([
                {
                    name: 'lib3Name',
                    root: 'libs/lib3',
                    files: ['lib3.ts'],
                    fileMTimes: {
                        'lib3.ts': 1
                    },
                    tags: [],
                    implicitDependencies: [],
                    architect: {},
                    type: affected_apps_1.ProjectType.lib
                }
            ]);
            var result = new deps_calculator_1.DepsCalculator('nrwl', projects, initialDeps, fileRead);
            expect(result.incrementalEnabled).toEqual(false);
            expect(result.getDeps()).toEqual({
                app1Name: [],
                lib1Name: [],
                lib2Name: [],
                lib3Name: []
            });
        });
        it('should not be incremental if projects are removed from an existing graph', function () {
            initialDeps.dependencies = {
                app1Name: [
                    {
                        projectName: 'lib1Name',
                        type: deps_calculator_1.DependencyType.loadChildren
                    },
                    {
                        projectName: 'lib2Name',
                        type: deps_calculator_1.DependencyType.loadChildren
                    }
                ],
                lib1Name: [],
                lib2Name: []
            };
            initialDeps.files = {
                'app1.ts': [
                    {
                        projectName: 'lib1Name',
                        type: deps_calculator_1.DependencyType.loadChildren
                    },
                    {
                        projectName: 'lib2Name',
                        type: deps_calculator_1.DependencyType.loadChildren
                    }
                ],
                'lib1.ts': [],
                'lib2.ts': []
            };
            projects = projects.filter(function (p) { return p.name !== 'lib2Name'; });
            var result = new deps_calculator_1.DepsCalculator('nrwl', projects, initialDeps, fileRead);
            expect(result.incrementalEnabled).toEqual(false);
            expect(result.getDeps()).toEqual({
                lib1Name: [],
                app1Name: []
            });
        });
        it('should not be incremental if projects are renamed in an existing graph', function () {
            initialDeps.dependencies = {
                app1Name: [
                    {
                        projectName: 'lib1Name',
                        type: deps_calculator_1.DependencyType.loadChildren
                    },
                    {
                        projectName: 'lib2Name',
                        type: deps_calculator_1.DependencyType.loadChildren
                    }
                ],
                lib1Name: [],
                lib2Name: []
            };
            initialDeps.files = {
                'app1.ts': [
                    {
                        projectName: 'lib1Name',
                        type: deps_calculator_1.DependencyType.loadChildren
                    },
                    {
                        projectName: 'lib2Name',
                        type: deps_calculator_1.DependencyType.loadChildren
                    }
                ],
                'lib1.ts': [],
                'lib2.ts': []
            };
            projects = projects.map(function (proj) {
                if (proj.name !== 'app1Name') {
                    return proj;
                }
                return __assign({}, proj, { name: 'newApp1Name' });
            });
            var result = new deps_calculator_1.DepsCalculator('nrwl', projects, initialDeps, fileRead);
            expect(result.incrementalEnabled).toEqual(false);
            expect(result.getDeps()).toEqual({
                newApp1Name: [],
                lib1Name: [],
                lib2Name: []
            });
        });
        it('should not be incremental if a legacy existing dependencies exists', function () {
            delete initialDeps.dependencies;
            delete initialDeps.files;
            var result = new deps_calculator_1.DepsCalculator('nrwl', projects, initialDeps, fileRead);
            expect(result.incrementalEnabled).toEqual(false);
            expect(result.getDeps()).toEqual({
                app1Name: [],
                lib1Name: [],
                lib2Name: []
            });
        });
    });
    describe('incremental', function () {
        beforeEach(function () {
            virtualFs = {
                'app1.ts': "\n          const routes = {\n            path: 'a', loadChildren: '@nrwl/lib1#LibModule',\n            path: 'b', loadChildren: '@nrwl/lib2/deep#LibModule'\n          };"
            };
            initialDeps.dependencies = {
                app1Name: [
                    {
                        projectName: 'lib1Name',
                        type: deps_calculator_1.DependencyType.loadChildren
                    },
                    {
                        projectName: 'lib2Name',
                        type: deps_calculator_1.DependencyType.loadChildren
                    }
                ],
                lib1Name: [],
                lib2Name: [
                    {
                        projectName: 'lib3Name',
                        type: deps_calculator_1.DependencyType.es6Import
                    }
                ]
            };
            initialDeps.files = {
                'app1.ts': [
                    {
                        projectName: 'lib1Name',
                        type: deps_calculator_1.DependencyType.loadChildren
                    },
                    {
                        projectName: 'lib2Name',
                        type: deps_calculator_1.DependencyType.loadChildren
                    }
                ],
                'lib1.ts': [],
                'lib2.ts': [
                    {
                        projectName: 'lib1Name',
                        type: deps_calculator_1.DependencyType.es6Import
                    }
                ]
            };
            depsCalculator = new deps_calculator_1.DepsCalculator('nrwl', projects, initialDeps, fileRead);
        });
        it('should be able to add edges to the graph', function () {
            virtualFs['lib1.ts'] = "import '@nrwl/lib2';";
            depsCalculator.processFile('lib1.ts');
            var deps = depsCalculator.getDeps();
            expect(deps.lib1Name).toEqual([
                {
                    projectName: 'lib2Name',
                    type: deps_calculator_1.DependencyType.es6Import
                }
            ]);
        });
        it('should be able to remove edges from the graph', function () {
            virtualFs['lib2.ts'] = '';
            depsCalculator.processFile('lib2.ts');
            var deps = depsCalculator.getDeps();
            expect(deps.lib2Name).toEqual([]);
        });
        it('should be able change the type of edges for the graph ', function () {
            virtualFs['app1.ts'] = "\n        import { LibModule } from '@nrwl/lib1';\n        import { Lib2Module } from '@nrwl/lib2';";
            depsCalculator.processFile('app1.ts');
            var deps = depsCalculator.getDeps();
            expect(deps.app1Name).toEqual([
                {
                    projectName: 'lib1Name',
                    type: deps_calculator_1.DependencyType.es6Import
                },
                {
                    projectName: 'lib2Name',
                    type: deps_calculator_1.DependencyType.es6Import
                }
            ]);
        });
        it('should be able to recalculate the same edges for the graph ', function () {
            virtualFs['app1.ts'] = "\n        const routes = {\n          path: 'a', loadChildren: '@nrwl/lib1#LibModule',\n          path: 'b', loadChildren: '@nrwl/lib2/deep#LibModule'\n        };";
            depsCalculator.processFile('app1.ts');
            var deps = depsCalculator.getDeps();
            expect(deps.app1Name).toEqual([
                {
                    projectName: 'lib1Name',
                    type: deps_calculator_1.DependencyType.loadChildren
                },
                {
                    projectName: 'lib2Name',
                    type: deps_calculator_1.DependencyType.loadChildren
                }
            ]);
        });
    });
});
describe('Calculates Dependencies Between Apps and Libs', function () {
    describe('dependencies', function () {
        beforeEach(function () {
            spyOn(fs, 'writeFileSync');
        });
        it('should return a graph with a key for every project', function () {
            var deps = deps_calculator_1.dependencies('nrwl', [
                {
                    name: 'app1Name',
                    root: 'apps/app1',
                    files: [],
                    fileMTimes: {},
                    tags: [],
                    implicitDependencies: [],
                    architect: {},
                    type: affected_apps_1.ProjectType.app
                },
                {
                    name: 'app2Name',
                    root: 'apps/app2',
                    files: [],
                    fileMTimes: {},
                    tags: [],
                    implicitDependencies: [],
                    architect: {},
                    type: affected_apps_1.ProjectType.app
                }
            ], null, function () { return null; });
            expect(deps).toEqual({ app1Name: [], app2Name: [] });
        });
        // NOTE: previously we did create an implicit dependency here, but that is now handled in `getProjectNodes`
        it('should not create implicit dependencies between e2e and apps', function () {
            var deps = deps_calculator_1.dependencies('nrwl', [
                {
                    name: 'app1Name',
                    root: 'apps/app1',
                    files: [],
                    fileMTimes: {},
                    tags: [],
                    implicitDependencies: [],
                    architect: {},
                    type: affected_apps_1.ProjectType.app
                },
                {
                    name: 'app1Name-e2e',
                    root: 'apps/app1Name-e2e',
                    files: [],
                    fileMTimes: {},
                    tags: [],
                    implicitDependencies: [],
                    architect: {},
                    type: affected_apps_1.ProjectType.e2e
                }
            ], null, function () { return null; });
            expect(deps).toEqual({
                app1Name: [],
                'app1Name-e2e': []
            });
        });
        it('should support providing implicit deps for e2e project with custom name', function () {
            var deps = deps_calculator_1.dependencies('nrwl', [
                {
                    name: 'app1Name',
                    root: 'apps/app1',
                    files: [],
                    fileMTimes: {},
                    tags: [],
                    implicitDependencies: [],
                    architect: {},
                    type: affected_apps_1.ProjectType.app
                },
                {
                    name: 'customName-e2e',
                    root: 'apps/customName-e2e',
                    files: [],
                    fileMTimes: {},
                    tags: [],
                    implicitDependencies: ['app1Name'],
                    architect: {},
                    type: affected_apps_1.ProjectType.e2e
                }
            ], null, function () { return null; });
            expect(deps).toEqual({
                app1Name: [],
                'customName-e2e': [
                    { projectName: 'app1Name', type: deps_calculator_1.DependencyType.implicit }
                ]
            });
        });
        it('should support providing implicit deps for e2e project with standard name', function () {
            var deps = deps_calculator_1.dependencies('nrwl', [
                {
                    name: 'app1Name',
                    root: 'apps/app1',
                    files: [],
                    fileMTimes: {},
                    tags: [],
                    implicitDependencies: [],
                    architect: {},
                    type: affected_apps_1.ProjectType.app
                },
                {
                    name: 'app2Name',
                    root: 'apps/app2',
                    files: [],
                    fileMTimes: {},
                    tags: [],
                    implicitDependencies: [],
                    architect: {},
                    type: affected_apps_1.ProjectType.app
                },
                {
                    name: 'app1Name-e2e',
                    root: 'apps/app1Name-e2e',
                    files: [],
                    fileMTimes: {},
                    tags: [],
                    implicitDependencies: ['app2Name'],
                    architect: {},
                    type: affected_apps_1.ProjectType.e2e
                }
            ], null, function () { return null; });
            expect(deps).toEqual({
                app1Name: [],
                app2Name: [],
                'app1Name-e2e': [
                    { projectName: 'app2Name', type: deps_calculator_1.DependencyType.implicit }
                ]
            });
        });
        it('should infer deps between projects based on imports', function () {
            var deps = deps_calculator_1.dependencies('nrwl', [
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
            ], null, function (file) {
                switch (file) {
                    case 'app1.ts':
                        return "\n            import '@nrwl/lib1';\n            import '@nrwl/lib2/deep';\n          ";
                    case 'lib1.ts':
                        return "import '@nrwl/lib2'";
                    case 'lib2.ts':
                        return '';
                }
            });
            expect(deps).toEqual({
                app1Name: [
                    { projectName: 'lib1Name', type: deps_calculator_1.DependencyType.es6Import },
                    { projectName: 'lib2Name', type: deps_calculator_1.DependencyType.es6Import }
                ],
                lib1Name: [{ projectName: 'lib2Name', type: deps_calculator_1.DependencyType.es6Import }],
                lib2Name: []
            });
        });
        it('should infer deps between projects based on exports', function () {
            var deps = deps_calculator_1.dependencies('nrwl', [
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
            ], null, function (file) {
                switch (file) {
                    case 'app1.ts':
                        return "\n            export * from '@nrwl/lib1';\n            export { } from '@nrwl/lib2/deep';\n          ";
                    case 'lib1.ts':
                        return "import '@nrwl/lib2'";
                    case 'lib2.ts':
                        return '';
                }
            });
            expect(deps).toEqual({
                app1Name: [
                    { projectName: 'lib1Name', type: deps_calculator_1.DependencyType.es6Import },
                    { projectName: 'lib2Name', type: deps_calculator_1.DependencyType.es6Import }
                ],
                lib1Name: [{ projectName: 'lib2Name', type: deps_calculator_1.DependencyType.es6Import }],
                lib2Name: []
            });
        });
        it("should handle an ExportDeclaration w/ moduleSpecifier and w/o moduleSpecifier", function () {
            var deps = deps_calculator_1.dependencies('nrwl', [
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
                },
                {
                    name: 'lib3Name',
                    root: 'libs/lib3',
                    files: ['lib3.ts'],
                    fileMTimes: {
                        'lib3.ts': 1
                    },
                    tags: [],
                    implicitDependencies: [],
                    architect: {},
                    type: affected_apps_1.ProjectType.lib
                }
            ], null, function (file) {
                switch (file) {
                    case 'lib1.ts':
                        return "\n            const FOO = 23;\n            export { FOO };\n          ";
                    case 'lib2.ts':
                        return "\n            export const BAR = 24;\n          ";
                    case 'lib3.ts':
                        return "\n              import { FOO } from '@nrwl/lib1';\n              export { FOO };\n              export { BAR } from '@nrwl/lib2';\n            ";
                }
            });
            expect(deps).toEqual({
                lib1Name: [],
                lib2Name: [],
                lib3Name: [
                    { projectName: 'lib1Name', type: deps_calculator_1.DependencyType.es6Import },
                    { projectName: 'lib2Name', type: deps_calculator_1.DependencyType.es6Import }
                ]
            });
        });
        it('should calculate dependencies in .tsx files', function () {
            var deps = deps_calculator_1.dependencies('nrwl', [
                {
                    name: 'app1Name',
                    root: 'apps/app1',
                    files: ['app1.tsx'],
                    fileMTimes: {
                        'app1.tsx': 1
                    },
                    tags: [],
                    implicitDependencies: [],
                    architect: {},
                    type: affected_apps_1.ProjectType.app
                },
                {
                    name: 'lib1Name',
                    root: 'libs/lib1',
                    files: ['lib1.tsx'],
                    fileMTimes: {
                        'lib1.tsx': 1
                    },
                    tags: [],
                    implicitDependencies: [],
                    architect: {},
                    type: affected_apps_1.ProjectType.lib
                },
                {
                    name: 'lib2Name',
                    root: 'libs/lib2',
                    files: ['lib2.tsx'],
                    fileMTimes: {
                        'lib2.tsx': 1
                    },
                    tags: [],
                    implicitDependencies: [],
                    architect: {},
                    type: affected_apps_1.ProjectType.lib
                }
            ], null, function (file) {
                switch (file) {
                    case 'app1.tsx':
                        return "\n            import '@nrwl/lib1';\n            import '@nrwl/lib2/deep';\n          ";
                    case 'lib1.tsx':
                        return "import '@nrwl/lib2'";
                    case 'lib2.tsx':
                        return '';
                }
            });
            expect(deps).toEqual({
                app1Name: [
                    { projectName: 'lib1Name', type: deps_calculator_1.DependencyType.es6Import },
                    { projectName: 'lib2Name', type: deps_calculator_1.DependencyType.es6Import }
                ],
                lib1Name: [{ projectName: 'lib2Name', type: deps_calculator_1.DependencyType.es6Import }],
                lib2Name: []
            });
        });
        it('should calculate dependencies in .js files', function () {
            var deps = deps_calculator_1.dependencies('nrwl', [
                {
                    name: 'app1Name',
                    root: 'apps/app1',
                    files: ['app1.js'],
                    fileMTimes: {
                        'app1.js': 1
                    },
                    tags: [],
                    implicitDependencies: [],
                    architect: {},
                    type: affected_apps_1.ProjectType.app
                },
                {
                    name: 'lib1Name',
                    root: 'libs/lib1',
                    files: ['lib1.js'],
                    fileMTimes: {
                        'lib1.js': 1
                    },
                    tags: [],
                    implicitDependencies: [],
                    architect: {},
                    type: affected_apps_1.ProjectType.lib
                },
                {
                    name: 'lib2Name',
                    root: 'libs/lib2',
                    files: ['lib2.js'],
                    fileMTimes: {
                        'lib2.js': 1
                    },
                    tags: [],
                    implicitDependencies: [],
                    architect: {},
                    type: affected_apps_1.ProjectType.lib
                }
            ], null, function (file) {
                switch (file) {
                    case 'app1.js':
                        return "\n            import '@nrwl/lib1';\n            import '@nrwl/lib2/deep';\n          ";
                    case 'lib1.js':
                        return "import '@nrwl/lib2'";
                    case 'lib2.js':
                        return '';
                }
            });
            expect(deps).toEqual({
                app1Name: [
                    { projectName: 'lib1Name', type: deps_calculator_1.DependencyType.es6Import },
                    { projectName: 'lib2Name', type: deps_calculator_1.DependencyType.es6Import }
                ],
                lib1Name: [{ projectName: 'lib2Name', type: deps_calculator_1.DependencyType.es6Import }],
                lib2Name: []
            });
        });
        it('should calculate dependencies in .jsx files', function () {
            var deps = deps_calculator_1.dependencies('nrwl', [
                {
                    name: 'app1Name',
                    root: 'apps/app1',
                    files: ['app1.jsx'],
                    fileMTimes: {
                        'app1.jsx': 1
                    },
                    tags: [],
                    implicitDependencies: [],
                    architect: {},
                    type: affected_apps_1.ProjectType.app
                },
                {
                    name: 'lib1Name',
                    root: 'libs/lib1',
                    files: ['lib1.jsx'],
                    fileMTimes: {
                        'lib1.jsx': 1
                    },
                    tags: [],
                    implicitDependencies: [],
                    architect: {},
                    type: affected_apps_1.ProjectType.lib
                },
                {
                    name: 'lib2Name',
                    root: 'libs/lib2',
                    files: ['lib2.jsx'],
                    fileMTimes: {
                        'lib2.jsx': 1
                    },
                    tags: [],
                    implicitDependencies: [],
                    architect: {},
                    type: affected_apps_1.ProjectType.lib
                }
            ], null, function (file) {
                switch (file) {
                    case 'app1.jsx':
                        return "\n            import '@nrwl/lib1';\n            import '@nrwl/lib2/deep';\n          ";
                    case 'lib1.jsx':
                        return "import '@nrwl/lib2'";
                    case 'lib2.jsx':
                        return '';
                }
            });
            expect(deps).toEqual({
                app1Name: [
                    { projectName: 'lib1Name', type: deps_calculator_1.DependencyType.es6Import },
                    { projectName: 'lib2Name', type: deps_calculator_1.DependencyType.es6Import }
                ],
                lib1Name: [{ projectName: 'lib2Name', type: deps_calculator_1.DependencyType.es6Import }],
                lib2Name: []
            });
        });
        it('should infer dependencies expressed via loadChildren', function () {
            var deps = deps_calculator_1.dependencies('nrwl', [
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
            ], null, function (file) {
                switch (file) {
                    case 'app1.ts':
                        return "\n            const routes = {\n              path: 'a', loadChildren: '@nrwl/lib1#LibModule',\n              path: 'b', loadChildren: '@nrwl/lib2/deep#LibModule'\n            };\n          ";
                    case 'lib1.ts':
                        return '';
                    case 'lib2.ts':
                        return '';
                }
            });
            expect(deps).toEqual({
                app1Name: [
                    { projectName: 'lib1Name', type: deps_calculator_1.DependencyType.loadChildren },
                    { projectName: 'lib2Name', type: deps_calculator_1.DependencyType.loadChildren }
                ],
                lib1Name: [],
                lib2Name: []
            });
        });
        it('should handle non-ts files', function () {
            var deps = deps_calculator_1.dependencies('nrwl', [
                {
                    name: 'app1Name',
                    root: 'apps/app1',
                    files: ['index.html'],
                    fileMTimes: {
                        'index.html': 1
                    },
                    tags: [],
                    implicitDependencies: [],
                    architect: {},
                    type: affected_apps_1.ProjectType.app
                }
            ], null, function () { return null; });
            expect(deps).toEqual({ app1Name: [] });
        });
        it('should handle projects with the names starting with the same string', function () {
            var deps = deps_calculator_1.dependencies('nrwl', [
                {
                    name: 'aaName',
                    root: 'libs/aa',
                    files: ['aa.ts'],
                    fileMTimes: {
                        'aa.ts': 1
                    },
                    tags: [],
                    implicitDependencies: [],
                    architect: {},
                    type: affected_apps_1.ProjectType.app
                },
                {
                    name: 'aaBbName',
                    root: 'libs/aa/bb',
                    files: ['bb.ts'],
                    fileMTimes: {
                        'bb.ts': 1
                    },
                    tags: [],
                    implicitDependencies: [],
                    architect: {},
                    type: affected_apps_1.ProjectType.app
                }
            ], null, function (file) {
                switch (file) {
                    case 'aa.ts':
                        return "import '@nrwl/aa/bb'";
                    case 'bb.ts':
                        return '';
                }
            });
            expect(deps).toEqual({
                aaBbName: [],
                aaName: [{ projectName: 'aaBbName', type: deps_calculator_1.DependencyType.es6Import }]
            });
        });
        it('should not add the same dependency twice', function () {
            var deps = deps_calculator_1.dependencies('nrwl', [
                {
                    name: 'aaName',
                    root: 'libs/aa',
                    files: ['aa.ts'],
                    fileMTimes: {
                        'aa.ts': 1
                    },
                    tags: [],
                    implicitDependencies: [],
                    architect: {},
                    type: affected_apps_1.ProjectType.app
                },
                {
                    name: 'bbName',
                    root: 'libs/bb',
                    files: ['bb.ts'],
                    fileMTimes: {
                        'bb.ts': 1
                    },
                    tags: [],
                    implicitDependencies: [],
                    architect: {},
                    type: affected_apps_1.ProjectType.app
                }
            ], null, function (file) {
                switch (file) {
                    case 'aa.ts':
                        return "\n              import '@nrwl/bb/bb'\n              import '@nrwl/bb/bb'\n              ";
                    case 'bb.ts':
                        return '';
                }
            });
            expect(deps).toEqual({
                aaName: [{ projectName: 'bbName', type: deps_calculator_1.DependencyType.es6Import }],
                bbName: []
            });
        });
        it('should not add a dependency on self', function () {
            var deps = deps_calculator_1.dependencies('nrwl', [
                {
                    name: 'aaName',
                    root: 'libs/aa',
                    files: ['aa.ts'],
                    fileMTimes: {
                        'aa.ts': 1
                    },
                    tags: [],
                    implicitDependencies: [],
                    architect: {},
                    type: affected_apps_1.ProjectType.app
                }
            ], null, function (file) {
                switch (file) {
                    case 'aa.ts':
                        return "\n              import '@nrwl/aa/aa'\n              ";
                }
            });
            expect(deps).toEqual({ aaName: [] });
        });
    });
});
