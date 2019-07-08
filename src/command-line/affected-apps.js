"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ProjectType;
(function (ProjectType) {
    ProjectType["app"] = "app";
    ProjectType["e2e"] = "e2e";
    ProjectType["lib"] = "lib";
})(ProjectType = exports.ProjectType || (exports.ProjectType = {}));
function affectedAppNames(projects, dependencies, touchedProjects) {
    return affectedProjects(projects, dependencies, touchedProjects)
        .filter(function (p) { return p.type === ProjectType.app; })
        .map(function (p) { return p.name; });
}
exports.affectedAppNames = affectedAppNames;
function affectedLibNames(projects, dependencies, touchedProjects) {
    return affectedProjects(projects, dependencies, touchedProjects)
        .filter(function (p) { return p.type === ProjectType.lib; })
        .map(function (p) { return p.name; });
}
exports.affectedLibNames = affectedLibNames;
function affectedProjectNames(projects, dependencies, touchedProjects) {
    return affectedProjects(projects, dependencies, touchedProjects).map(function (p) { return p.name; });
}
exports.affectedProjectNames = affectedProjectNames;
function affectedProjectNamesWithTarget(target) {
    return function (projects, dependencies, touchedProjects) {
        return affectedProjects(projects, dependencies, touchedProjects)
            .filter(function (p) { return p.architect[target]; })
            .map(function (p) { return p.name; });
    };
}
exports.affectedProjectNamesWithTarget = affectedProjectNamesWithTarget;
function affectedProjects(projects, dependencies, touchedProjects) {
    return projects.filter(function (proj) {
        return hasDependencyOnTouchedProjects(proj.name, touchedProjects, dependencies, []);
    });
}
function hasDependencyOnTouchedProjects(project, touchedProjects, deps, visisted) {
    if (touchedProjects.indexOf(project) > -1)
        return true;
    if (visisted.indexOf(project) > -1)
        return false;
    return (deps[project]
        .map(function (d) { return d.projectName; })
        .filter(function (k) {
        return hasDependencyOnTouchedProjects(k, touchedProjects, deps, visisted.concat([
            project
        ]));
    }).length > 0);
}
