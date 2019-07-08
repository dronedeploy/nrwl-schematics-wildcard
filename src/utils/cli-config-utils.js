"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ast_utils_1 = require("./ast-utils");
exports.angularSchematicNames = [
    'class',
    'component',
    'directive',
    'guard',
    'module',
    'pipe',
    'service'
];
function getWorkspacePath(host) {
    var possibleFiles = ['/angular.json', '/.angular.json'];
    return possibleFiles.filter(function (path) { return host.exists(path); })[0];
}
exports.getWorkspacePath = getWorkspacePath;
function getNpmScope(host) {
    return ast_utils_1.readJsonInTree(host, 'nx.json').npmScope;
}
exports.getNpmScope = getNpmScope;
function parseTarget(targetString) {
    var _a = targetString.split(':'), project = _a[0], target = _a[1], config = _a[2];
    return {
        project: project,
        target: target,
        config: config
    };
}
exports.parseTarget = parseTarget;
function editTarget(targetString, callback) {
    var parsedTarget = parseTarget(targetString);
    return serializeTarget(callback(parsedTarget));
}
exports.editTarget = editTarget;
function serializeTarget(_a) {
    var project = _a.project, target = _a.target, config = _a.config;
    return [project, target, config].filter(function (part) { return !!part; }).join(':');
}
exports.serializeTarget = serializeTarget;
function replaceAppNameWithPath(node, appName, root) {
    if (typeof node === 'string') {
        var matchPattern = new RegExp("([^a-z0-9]+(" + appName + "))|((" + appName + ")[^a-z0-9:]+)", 'gi');
        if (!!node.match(matchPattern)) {
            var r = node.replace(appName, root);
            return r.startsWith('/apps') || r.startsWith('/libs')
                ? r.substring(1)
                : r;
        }
        else {
            return node;
        }
    }
    else if (Array.isArray(node)) {
        return node.map(function (j) { return replaceAppNameWithPath(j, appName, root); });
    }
    else if (typeof node === 'object' && node) {
        var forbiddenPropertyList_1 = ['prefix', 'builder']; // Some of the properties should not be renamed
        return Object.keys(node).reduce(function (m, c) { return ((m[c] = !forbiddenPropertyList_1.includes(c)
            ? replaceAppNameWithPath(node[c], appName, root)
            : node[c]),
            m); }, {});
    }
    else {
        return node;
    }
}
exports.replaceAppNameWithPath = replaceAppNameWithPath;
