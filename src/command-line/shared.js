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
var child_process_1 = require("child_process");
var path = require("path");
var affected_apps_1 = require("./affected-apps");
var fs = require("fs");
var appRoot = require("app-root-path");
var fileutils_1 = require("../utils/fileutils");
var deps_calculator_1 = require("./deps-calculator");
var touched_1 = require("./touched");
var ignore = require('ignore');
function readFileIfExisting(path) {
    return fs.existsSync(path) ? fs.readFileSync(path, 'UTF-8').toString() : '';
}
var ig = ignore();
ig.add(readFileIfExisting(appRoot.path + "/.gitignore"));
function parseFiles(options) {
    var files = options.files, uncommitted = options.uncommitted, untracked = options.untracked, base = options.base, head = options.head;
    if (files) {
        return {
            files: files
        };
    }
    else if (uncommitted) {
        return {
            files: getUncommittedFiles()
        };
    }
    else if (untracked) {
        return {
            files: getUntrackedFiles()
        };
    }
    else if (base && head) {
        return {
            files: getFilesUsingBaseAndHead(base, head)
        };
    }
    else if (base) {
        return {
            files: Array.from(new Set(getFilesUsingBaseAndHead(base, 'HEAD').concat(getUncommittedFiles(), getUntrackedFiles())))
        };
    }
    else if (options._.length >= 2) {
        return {
            files: getFilesFromShash(options._[1], options._[2])
        };
    }
    else {
        throw new Error('Invalid options provided');
    }
}
exports.parseFiles = parseFiles;
function getUncommittedFiles() {
    return parseGitOutput("git diff --name-only HEAD .");
}
function getUntrackedFiles() {
    return parseGitOutput("git ls-files --others --exclude-standard");
}
function getFilesUsingBaseAndHead(base, head) {
    var mergeBase = child_process_1.execSync("git merge-base " + base + " " + head)
        .toString()
        .trim();
    return parseGitOutput("git diff --name-only " + mergeBase + " " + head);
}
function getFilesFromShash(sha1, sha2) {
    return parseGitOutput("git diff --name-only " + sha1 + " " + sha2);
}
function parseGitOutput(command) {
    return child_process_1.execSync(command)
        .toString('utf-8')
        .split('\n')
        .map(function (a) { return a.trim(); })
        .filter(function (a) { return a.length > 0; });
}
function getFileLevelImplicitDependencies(projects, nxJson) {
    if (!nxJson.implicitDependencies) {
        return {};
    }
    Object.entries(nxJson.implicitDependencies).forEach(function (_a) {
        var key = _a[0], value = _a[1];
        if (value === '*') {
            nxJson.implicitDependencies[key] = projects.map(function (p) { return p.name; });
        }
    });
    return nxJson.implicitDependencies;
}
function getProjectLevelImplicitDependencies(projects) {
    var implicitDependencies = projects.reduce(function (memo, project) {
        project.implicitDependencies.forEach(function (dep) {
            if (memo[dep]) {
                memo[dep].add(project.name);
            }
            else {
                memo[dep] = new Set([project.name]);
            }
        });
        return memo;
    }, {});
    return Object.entries(implicitDependencies).reduce(function (memo, _a) {
        var key = _a[0], val = _a[1];
        memo[key] = Array.from(val);
        return memo;
    }, {});
}
function detectAndSetInvalidProjectValues(map, sourceName, desiredProjectNames, validProjects) {
    var invalidProjects = desiredProjectNames.filter(function (projectName) { return !validProjects[projectName]; });
    if (invalidProjects.length > 0) {
        map.set(sourceName, invalidProjects);
    }
}
function getImplicitDependencies(projects, angularJson, nxJson) {
    assertWorkspaceValidity(angularJson, nxJson);
    var implicitFileDeps = getFileLevelImplicitDependencies(projects, nxJson);
    var implicitProjectDeps = getProjectLevelImplicitDependencies(projects);
    return {
        files: implicitFileDeps,
        projects: implicitProjectDeps
    };
}
exports.getImplicitDependencies = getImplicitDependencies;
function assertWorkspaceValidity(angularJson, nxJson) {
    var angularJsonProjects = Object.keys(angularJson.projects);
    var nxJsonProjects = Object.keys(nxJson.projects);
    if (minus(angularJsonProjects, nxJsonProjects).length > 0) {
        throw new Error("angular.json and nx.json are out of sync. The following projects are missing in nx.json: " + minus(angularJsonProjects, nxJsonProjects).join(', '));
    }
    if (minus(nxJsonProjects, angularJsonProjects).length > 0) {
        throw new Error("angular.json and nx.json are out of sync. The following projects are missing in angular.json: " + minus(nxJsonProjects, angularJsonProjects).join(', '));
    }
    var projects = __assign({}, angularJson.projects, nxJson.projects);
    var invalidImplicitDependencies = new Map();
    Object.entries(nxJson.implicitDependencies || {})
        .filter(function (_a) {
        var _ = _a[0], val = _a[1];
        return val !== '*';
    }) // These are valid since it is calculated
        .reduce(function (map, _a) {
        var filename = _a[0], projectNames = _a[1];
        detectAndSetInvalidProjectValues(map, filename, projectNames, projects);
        return map;
    }, invalidImplicitDependencies);
    nxJsonProjects
        .filter(function (nxJsonProjectName) {
        var project = nxJson.projects[nxJsonProjectName];
        return !!project.implicitDependencies;
    })
        .reduce(function (map, nxJsonProjectName) {
        var project = nxJson.projects[nxJsonProjectName];
        detectAndSetInvalidProjectValues(map, nxJsonProjectName, project.implicitDependencies, projects);
        return map;
    }, invalidImplicitDependencies);
    if (invalidImplicitDependencies.size === 0) {
        return;
    }
    var message = "The following implicitDependencies specified in nx.json are invalid:\n  ";
    invalidImplicitDependencies.forEach(function (projectNames, key) {
        var str = "  " + key + "\n    " + projectNames.map(function (projectName) { return "    " + projectName; }).join('\n');
        message += str;
    });
    throw new Error(message);
}
exports.assertWorkspaceValidity = assertWorkspaceValidity;
function getProjectNodes(angularJson, nxJson) {
    assertWorkspaceValidity(angularJson, nxJson);
    var angularJsonProjects = Object.keys(angularJson.projects);
    return angularJsonProjects.map(function (key) {
        var p = angularJson.projects[key];
        var tags = nxJson.projects[key].tags;
        var projectType = p.projectType === 'application'
            ? key.endsWith('-e2e')
                ? affected_apps_1.ProjectType.e2e
                : affected_apps_1.ProjectType.app
            : affected_apps_1.ProjectType.lib;
        var implicitDependencies = nxJson.projects[key].implicitDependencies || [];
        if (projectType === affected_apps_1.ProjectType.e2e && implicitDependencies.length === 0) {
            implicitDependencies = [key.replace(/-e2e$/, '')];
        }
        var filesWithMTimes = allFilesInDir(appRoot.path + "/" + p.root);
        var fileMTimes = {};
        filesWithMTimes.forEach(function (f) {
            fileMTimes[f.file] = f.mtime;
        });
        return {
            name: key,
            root: p.root,
            type: projectType,
            tags: tags,
            architect: p.architect || {},
            files: filesWithMTimes.map(function (f) { return f.file; }),
            implicitDependencies: implicitDependencies,
            fileMTimes: fileMTimes
        };
    });
}
exports.getProjectNodes = getProjectNodes;
function minus(a, b) {
    var res = [];
    a.forEach(function (aa) {
        if (!b.find(function (bb) { return bb === aa; })) {
            res.push(aa);
        }
    });
    return res;
}
function readAngularJson() {
    return fileutils_1.readJsonFile(appRoot.path + "/angular.json");
}
exports.readAngularJson = readAngularJson;
function readNxJson() {
    var config = fileutils_1.readJsonFile(appRoot.path + "/nx.json");
    if (!config.npmScope) {
        throw new Error("nx.json must define the npmScope property.");
    }
    return config;
}
exports.readNxJson = readNxJson;
exports.getAffected = function (affectedNamesFetcher) { return function (touchedFiles) {
    var angularJson = readAngularJson();
    var nxJson = readNxJson();
    var projects = getProjectNodes(angularJson, nxJson);
    var implicitDeps = getImplicitDependencies(projects, angularJson, nxJson);
    var dependencies = deps_calculator_1.readDependencies(nxJson.npmScope, projects);
    var sortedProjects = topologicallySortProjects(projects, dependencies);
    var tp = touched_1.touchedProjects(implicitDeps, projects, touchedFiles);
    return affectedNamesFetcher(sortedProjects, dependencies, tp);
}; };
function getAffectedProjectsWithTarget(target) {
    return exports.getAffected(affected_apps_1.affectedProjectNamesWithTarget(target));
}
exports.getAffectedProjectsWithTarget = getAffectedProjectsWithTarget;
exports.getAffectedApps = exports.getAffected(affected_apps_1.affectedAppNames);
exports.getAffectedProjects = exports.getAffected(affected_apps_1.affectedProjectNames);
exports.getAffectedLibs = exports.getAffected(affected_apps_1.affectedLibNames);
function getAllAppNames() {
    return getProjectNames(function (p) { return p.type === affected_apps_1.ProjectType.app; });
}
exports.getAllAppNames = getAllAppNames;
function getAllLibNames() {
    return getProjectNames(function (p) { return p.type === affected_apps_1.ProjectType.lib; });
}
exports.getAllLibNames = getAllLibNames;
function getAllProjectNamesWithTarget(target) {
    return getProjectNames(function (p) { return p.architect[target]; });
}
exports.getAllProjectNamesWithTarget = getAllProjectNamesWithTarget;
function getAllProjectsWithTarget(target) {
    var angularJson = readAngularJson();
    var nxJson = readNxJson();
    var projects = getProjectNodes(angularJson, nxJson);
    var dependencies = deps_calculator_1.readDependencies(nxJson.npmScope, projects);
    var sortedProjects = topologicallySortProjects(projects, dependencies);
    return sortedProjects.filter(function (p) { return p.architect[target]; }).map(function (p) { return p.name; });
}
exports.getAllProjectsWithTarget = getAllProjectsWithTarget;
function getProjectNames(predicate) {
    var projects = getProjectNodes(readAngularJson(), readNxJson());
    if (predicate) {
        projects = projects.filter(predicate);
    }
    return projects.map(function (p) { return p.name; });
}
exports.getProjectNames = getProjectNames;
function getProjectRoots(projectNames) {
    var projects = readAngularJson().projects;
    return projectNames.map(function (name) { return projects[name].root; });
}
exports.getProjectRoots = getProjectRoots;
function allFilesInDir(dirName) {
    // Ignore .gitignored files
    if (ig.ignores(path.relative(appRoot.path, dirName))) {
        return [];
    }
    var res = [];
    try {
        fs.readdirSync(dirName).forEach(function (c) {
            var child = path.join(dirName, c);
            if (ig.ignores(path.relative(appRoot.path, child))) {
                return;
            }
            try {
                var s = fs.statSync(child);
                if (!s.isDirectory()) {
                    // add starting with "apps/myapp/..." or "libs/mylib/..."
                    res.push({
                        file: normalizePath(path.relative(appRoot.path, child)),
                        mtime: s.mtimeMs
                    });
                }
                else if (s.isDirectory()) {
                    res = res.concat(allFilesInDir(child));
                }
            }
            catch (e) { }
        });
    }
    catch (e) { }
    return res;
}
exports.allFilesInDir = allFilesInDir;
function lastModifiedAmongProjectFiles(projects) {
    return Math.max.apply(Math, projects.map(function (project) { return getProjectMTime(project); }).concat([
        mtime(appRoot.path + "/angular.json"),
        mtime(appRoot.path + "/nx.json"),
        mtime(appRoot.path + "/tslint.json"),
        mtime(appRoot.path + "/package.json")
    ]));
}
exports.lastModifiedAmongProjectFiles = lastModifiedAmongProjectFiles;
function getProjectMTime(project) {
    return Math.max.apply(Math, Object.values(project.fileMTimes));
}
exports.getProjectMTime = getProjectMTime;
/**
 * Returns the time when file was last modified
 * Returns -Infinity for a non-existent file
 */
function mtime(filePath) {
    if (!fs.existsSync(filePath)) {
        return -Infinity;
    }
    return fs.statSync(filePath).mtimeMs;
}
exports.mtime = mtime;
function normalizePath(file) {
    return file.split(path.sep).join('/');
}
function normalizedProjectRoot(p) {
    return p.root
        .split('/')
        .filter(function (v) { return !!v; })
        .slice(1)
        .join('/');
}
exports.normalizedProjectRoot = normalizedProjectRoot;
function topologicallySortProjects(projects, deps) {
    var temporary = {};
    var marked = {};
    var res = [];
    while (Object.keys(marked).length !== projects.length) {
        visit(projects.find(function (p) { return !marked[p.name]; }));
    }
    function visit(n) {
        if (marked[n.name])
            return;
        if (temporary[n.name])
            return;
        temporary[n.name] = true;
        deps[n.name].forEach(function (e) {
            visit(projects.find(function (pp) { return pp.name === e.projectName; }));
        });
        marked[n.name] = true;
        res.push(n);
    }
    return res;
}
