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
var path = require("path");
var ts = require("typescript");
var appRoot = require("app-root-path");
var shared_1 = require("./shared");
var fs_1 = require("fs");
var fileutils_1 = require("../utils/fileutils");
var strip_source_code_1 = require("../utils/strip-source-code");
var DependencyType;
(function (DependencyType) {
    DependencyType["es6Import"] = "es6Import";
    DependencyType["loadChildren"] = "loadChildren";
    DependencyType["implicit"] = "implicit";
})(DependencyType = exports.DependencyType || (exports.DependencyType = {}));
function readDependencies(npmScope, projectNodes) {
    var nxDepsPath = appRoot.path + "/dist/nxdeps.json";
    var m = shared_1.lastModifiedAmongProjectFiles(projectNodes);
    if (!fileutils_1.directoryExists(appRoot.path + "/dist")) {
        fs_1.mkdirSync(appRoot.path + "/dist");
    }
    var existingDeps = fileutils_1.fileExists(nxDepsPath) ? fileutils_1.readJsonFile(nxDepsPath) : null;
    if (!existingDeps || m > shared_1.mtime(nxDepsPath)) {
        return dependencies(npmScope, projectNodes, existingDeps, function (f) {
            return fs_1.readFileSync(appRoot.path + "/" + f, 'UTF-8');
        });
    }
    else {
        return existingDeps.dependencies;
    }
}
exports.readDependencies = readDependencies;
/**
 * DO NOT USE
 * Only exported for unit testing
 *
 * USE `readDependencies`
 */
function dependencies(npmScope, projects, existingDependencies, fileRead) {
    var nxDepsPath = appRoot.path + "/dist/nxdeps.json";
    var nxDepsExists = fileutils_1.fileExists(nxDepsPath);
    var nxDepsMTime = nxDepsExists ? shared_1.mtime(nxDepsPath) : -Infinity;
    var calculator = new DepsCalculator(npmScope, projects, existingDependencies, fileRead);
    projects
        .filter(function (project) {
        return !calculator.incrementalEnabled ||
            shared_1.getProjectMTime(project) >= nxDepsMTime;
    })
        .forEach(function (project) {
        project.files
            .filter(function (file) {
            return !calculator.incrementalEnabled ||
                !project.fileMTimes[file] ||
                project.fileMTimes[file] >= nxDepsMTime;
        })
            .forEach(function (file) {
            calculator.processFile(file);
        });
    });
    calculator.commitDeps(nxDepsPath);
    return calculator.getDeps();
}
exports.dependencies = dependencies;
/**
 * Class for calculating dependencies between projects by processing files.
 */
var DepsCalculator = /** @class */ (function () {
    function DepsCalculator(npmScope, projects, existingDeps, fileRead) {
        this.npmScope = npmScope;
        this.projects = projects;
        this.existingDeps = existingDeps;
        this.fileRead = fileRead;
        this.scanner = ts.createScanner(ts.ScriptTarget.Latest, false);
        this.projects.sort(function (a, b) {
            if (!a.root)
                return -1;
            if (!b.root)
                return -1;
            return a.root.length > b.root.length ? -1 : 1;
        });
        this._incremental = this.shouldIncrementallyRecalculate();
        this.deps = this.initializeDeps();
    }
    Object.defineProperty(DepsCalculator.prototype, "incrementalEnabled", {
        get: function () {
            return this._incremental;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Write the current state of dependencies to a file
     * @param path Path of file to write to
     */
    DepsCalculator.prototype.commitDeps = function (path) {
        this.deps.dependencies = this.getDeps();
        var files = this.deps.files;
        // This removes files with no dependencies from the cache because it doesn't matter.
        Object.entries(files).forEach(function (_a) {
            var key = _a[0], val = _a[1];
            if (!val || val.length < 1) {
                delete files[key];
            }
        });
        fileutils_1.writeToFile(path, JSON.stringify(__assign({}, this.deps, { files: files })));
    };
    /**
     * Retrieve the current dependencies
     */
    DepsCalculator.prototype.getDeps = function () {
        var _this = this;
        var dependencies = this.projects.reduce(function (deps, project) {
            var _a;
            var dependencies = project.files
                .map(function (file) { return _this.deps.files[file] || []; })
                .reduce(function (arr, deps) {
                return arr.concat(deps.filter(function (dep) { return !arr.some(function (item) { return item.projectName === dep.projectName; }); }));
            }, [])
                .filter(function (dep) { return dep.projectName !== project.name; });
            return __assign({}, deps, (_a = {}, _a[project.name] = dependencies, _a));
        }, {});
        this.setImplicitDepsFromProjects(dependencies, this.projects);
        return dependencies;
    };
    /**
     * Process a file and update it's dependencies
     */
    DepsCalculator.prototype.processFile = function (filePath) {
        var extension = path.extname(filePath);
        if (extension !== '.ts' &&
            extension !== '.tsx' &&
            extension !== '.js' &&
            extension !== '.jsx') {
            return;
        }
        this.deps.files[filePath] = [];
        var content = this.fileRead(filePath);
        var strippedContent = strip_source_code_1.stripSourceCode(this.scanner, content);
        if (strippedContent !== '') {
            var tsFile = ts.createSourceFile(filePath, strippedContent, ts.ScriptTarget.Latest, true);
            this.processNode(filePath, tsFile);
        }
    };
    DepsCalculator.prototype.isLegacyFormat = function (existingDeps) {
        return !existingDeps.dependencies && !existingDeps.files;
    };
    DepsCalculator.prototype.shouldIncrementallyRecalculate = function () {
        if (!this.existingDeps || this.isLegacyFormat(this.existingDeps)) {
            return false;
        }
        var currentProjects = this.projects.map(function (p) { return p.name; }).sort();
        var previousProjects = Object.keys(this.existingDeps.dependencies).sort();
        return (currentProjects.length === previousProjects.length &&
            !currentProjects.some(function (val, index) { return val !== previousProjects[index]; }));
    };
    DepsCalculator.prototype.initializeDeps = function () {
        var _this = this;
        var files = [];
        this.projects.forEach(function (p) {
            files.push.apply(files, p.files);
        });
        var dependencies = this.projects.reduce(function (m, c) {
            var _a;
            return (__assign({}, m, (_a = {}, _a[c.name] = [], _a)));
        }, {});
        var fileDependencies = {};
        files.forEach(function (file) {
            fileDependencies[file] = _this.incrementalEnabled
                ? _this.existingDeps.files[file] || []
                : [];
        });
        return {
            dependencies: dependencies,
            files: fileDependencies
        };
    };
    DepsCalculator.prototype.setImplicitDepsFromProjects = function (deps, projects) {
        var _this = this;
        projects.forEach(function (project) {
            if (project.implicitDependencies.length === 0) {
                return;
            }
            project.implicitDependencies.forEach(function (depName) {
                _this.setDependencyIfNotAlreadySet(deps, project.name, depName, DependencyType.implicit);
            });
        });
    };
    DepsCalculator.prototype.processNode = function (filePath, node) {
        var _this = this;
        if (ts.isImportDeclaration(node) ||
            (ts.isExportDeclaration(node) && node.moduleSpecifier)) {
            var imp = this.getStringLiteralValue(node.moduleSpecifier);
            this.addDepIfNeeded(imp, filePath, DependencyType.es6Import);
            return; // stop traversing downwards
        }
        if (node.kind === ts.SyntaxKind.PropertyAssignment) {
            var name = this.getPropertyAssignmentName(node.name);
            if (name === 'loadChildren') {
                var init = node.initializer;
                if (init.kind === ts.SyntaxKind.StringLiteral) {
                    var childrenExpr = this.getStringLiteralValue(init);
                    this.addDepIfNeeded(childrenExpr, filePath, DependencyType.loadChildren);
                    return; // stop traversing downwards
                }
            }
        }
        /**
         * Continue traversing down the AST from the current node
         */
        ts.forEachChild(node, function (child) { return _this.processNode(filePath, child); });
    };
    DepsCalculator.prototype.getPropertyAssignmentName = function (nameNode) {
        switch (nameNode.kind) {
            case ts.SyntaxKind.Identifier:
                return nameNode.getText();
            case ts.SyntaxKind.StringLiteral:
                return nameNode.text;
            default:
                return null;
        }
    };
    DepsCalculator.prototype.addDepIfNeeded = function (expr, filePath, depType) {
        var _this = this;
        var matchingProject = this.projects.filter(function (a) {
            var normalizedRoot = shared_1.normalizedProjectRoot(a);
            return (expr === "@" + _this.npmScope + "/" + normalizedRoot ||
                expr.startsWith("@" + _this.npmScope + "/" + normalizedRoot + "#") ||
                expr.startsWith("@" + _this.npmScope + "/" + normalizedRoot + "/"));
        })[0];
        if (matchingProject) {
            this.setDependencyIfNotAlreadySet(this.deps.files, filePath, matchingProject.name, depType);
        }
    };
    DepsCalculator.prototype.setDependencyIfNotAlreadySet = function (deps, key, depTarget, depType) {
        var alreadyHasDep = deps[key].some(function (d) { return d.projectName === depTarget && d.type === depType; });
        if (!alreadyHasDep) {
            var dep = { projectName: depTarget, type: depType };
            deps[key].push(dep);
        }
    };
    DepsCalculator.prototype.getStringLiteralValue = function (node) {
        return node.getText().substr(1, node.getText().length - 2);
    };
    return DepsCalculator;
}());
exports.DepsCalculator = DepsCalculator;
