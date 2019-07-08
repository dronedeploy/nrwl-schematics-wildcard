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
var shared_1 = require("./shared");
function touchedProjects(implicitDependencies, projects, touchedFiles) {
    projects = normalizeProjects(projects);
    touchedFiles = normalizeFiles(touchedFiles);
    var itp = implicitlyTouchedProjects(implicitDependencies, touchedFiles);
    // Return if all projects were implicitly touched
    if (itp.length === projects.length) {
        return itp;
    }
    var dtp = directlyTouchedProjects(projects, touchedFiles);
    return projects
        .filter(function (project) { return itp.includes(project.name) || dtp.includes(project.name); })
        .map(function (project) { return project.name; });
}
exports.touchedProjects = touchedProjects;
function getTouchedProjects(touchedFiles) {
    var angularJson = shared_1.readAngularJson();
    var nxJson = shared_1.readNxJson();
    var projects = shared_1.getProjectNodes(angularJson, nxJson);
    var implicitDeps = shared_1.getImplicitDependencies(projects, angularJson, nxJson);
    return touchedProjects(implicitDeps, projects, touchedFiles).filter(function (p) { return !!p; });
}
exports.getTouchedProjects = getTouchedProjects;
function implicitlyTouchedProjects(implicitDependencies, touchedFiles) {
    return Array.from(Object.entries(implicitDependencies.files).reduce(function (projectSet, _a) {
        var file = _a[0], projectNames = _a[1];
        if (touchedFiles.find(function (tf) { return tf.endsWith(file); })) {
            projectNames.forEach(function (projectName) {
                projectSet.add(projectName);
            });
        }
        return projectSet;
    }, new Set()));
}
function directlyTouchedProjects(projects, touchedFiles) {
    return projects
        .filter(function (project) {
        return touchedFiles.some(function (file) {
            return project.files.some(function (projectFile) {
                return file.endsWith(projectFile);
            });
        });
    })
        .map(function (project) { return project.name; });
}
function normalizeProjects(projects) {
    return projects.map(function (p) {
        return __assign({}, p, { files: normalizeFiles(p.files) });
    });
}
function normalizeFiles(files) {
    return files.map(function (f) { return f.replace(/[\\\/]+/g, '/'); });
}
