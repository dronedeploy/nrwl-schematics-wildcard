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
var schematics_1 = require("@angular-devkit/schematics");
var change_1 = require("@schematics/angular/utility/change");
var ast_utils_1 = require("@schematics/angular/utility/ast-utils");
var ts = require("typescript");
var ast_utils_2 = require("../../src/utils/ast-utils");
var update_task_1 = require("../../src/utils/update-task");
var format_files_1 = require("../../src/utils/rules/format-files");
var ɵ0 = function (json) {
    json.recommendations = json.recommendations || [];
    [
        'nrwl.angular-console',
        'angular.ng-template',
        'esbenp.prettier-vscode'
    ].forEach(function (extension) {
        if (!json.recommendations.includes(extension)) {
            json.recommendations.push(extension);
        }
    });
    return json;
};
exports.ɵ0 = ɵ0;
var addExtensionRecommendations = ast_utils_2.updateJsonInTree('.vscode/extensions.json', ɵ0);
function addItemToImport(path, sourceFile, printer, importStatement, symbol) {
    var newImport = ts.createImportDeclaration(importStatement.decorators, importStatement.modifiers, ts.createImportClause(importStatement.importClause.name, ts.createNamedImports(importStatement.importClause.namedBindings
        .elements.concat([
        ts.createImportSpecifier(undefined, ts.createIdentifier(symbol))
    ]))), importStatement.moduleSpecifier);
    return new change_1.ReplaceChange(path, importStatement.getStart(sourceFile), importStatement.getText(sourceFile), printer.printNode(ts.EmitHint.Unspecified, newImport, sourceFile));
}
function isEffectDecorator(decorator) {
    return (ts.isCallExpression(decorator.expression) &&
        ts.isIdentifier(decorator.expression.expression) &&
        decorator.expression.expression.text === 'Effect');
}
function getImport(sourceFile, path, symbol) {
    return sourceFile.statements
        .filter(ts.isImportDeclaration)
        .filter(function (statement) {
        return statement.moduleSpecifier.getText(sourceFile).includes(path);
    })
        .find(function (statement) {
        if (!ts.isNamedImports(statement.importClause.namedBindings)) {
            return false;
        }
        return statement.importClause.namedBindings.elements.some(function (element) { return element.getText(sourceFile) === symbol; });
    });
}
function updateOfTypeCode(path, sourceFile) {
    var effectsImport = getImport(sourceFile, '@ngrx/effects', 'Effect');
    if (!effectsImport) {
        return [];
    }
    var effects = [];
    var changes = [];
    var printer = ts.createPrinter();
    sourceFile.statements
        .filter(ts.isClassDeclaration)
        .map(function (clazz) {
        return clazz.members
            .filter(ts.isPropertyDeclaration)
            .filter(function (member) {
            return member.decorators && member.decorators.some(isEffectDecorator);
        });
    })
        .forEach(function (properties) {
        effects.push.apply(effects, properties);
    });
    effects.forEach(function (effect) {
        if (ts.isCallExpression(effect.initializer) &&
            ts.isPropertyAccessExpression(effect.initializer.expression) &&
            effect.initializer.expression.name.text === 'pipe' &&
            ts.isCallExpression(effect.initializer.expression.expression) &&
            ts.isPropertyAccessExpression(effect.initializer.expression.expression.expression) &&
            effect.initializer.expression.expression.expression.name.text === 'ofType') {
            var originalText = effect.initializer.getText(sourceFile);
            var ofTypeExpression = ts.createCall(ts.createIdentifier('ofType'), effect.initializer.expression.expression.typeArguments, effect.initializer.expression.expression.arguments);
            var node = ts.createCall(ts.createPropertyAccess(effect.initializer.expression.expression.expression.expression, 'pipe'), effect.initializer.typeArguments, ts.createNodeArray([
                ofTypeExpression
            ].concat(effect.initializer.arguments)));
            var newEffect = printer.printNode(ts.EmitHint.Expression, node, sourceFile);
            var change = new change_1.ReplaceChange(path, effect.initializer.getStart(sourceFile), originalText, newEffect);
            changes.push(change);
        }
    });
    if (changes.length > 0) {
        changes.unshift(addItemToImport(path, sourceFile, printer, effectsImport, 'ofType'));
    }
    return changes;
}
function getConstructor(classDeclaration) {
    return classDeclaration.members.find(ts.isConstructorDeclaration);
}
function getStoreProperty(sourceFile, constructor) {
    var storeParameter = constructor.parameters.find(function (parameter) {
        return parameter.type && parameter.type.getText(sourceFile).includes('Store');
    });
    return storeParameter ? storeParameter.name.getText(sourceFile) : null;
}
function updateSelectorCode(path, sourceFile) {
    var storeImport = getImport(sourceFile, '@ngrx/store', 'Store');
    if (!storeImport) {
        return [];
    }
    var changes = [];
    var printer = ts.createPrinter();
    sourceFile.statements
        .filter(ts.isClassDeclaration)
        .forEach(function (classDeclaration) {
        var constructor = getConstructor(classDeclaration);
        if (!constructor) {
            return;
        }
        var storeProperty = getStoreProperty(sourceFile, constructor);
        ast_utils_1.getSourceNodes(sourceFile).forEach(function (node) {
            if (ts.isCallExpression(node) &&
                ts.isPropertyAccessExpression(node.expression) &&
                ts.isPropertyAccessExpression(node.expression.expression) &&
                ts.isIdentifier(node.expression.name) &&
                ts.isIdentifier(node.expression.expression.name) &&
                node.expression.name.getText(sourceFile) === 'select' &&
                node.expression.expression.name.getText(sourceFile) ===
                    storeProperty &&
                node.expression.expression.expression.kind ===
                    ts.SyntaxKind.ThisKeyword) {
                var newExpression = ts.createCall(ts.createPropertyAccess(ts.createPropertyAccess(ts.createIdentifier('this'), ts.createIdentifier(storeProperty)), ts.createIdentifier('pipe')), [], [
                    ts.createCall(ts.createIdentifier('select'), node.typeArguments, node.arguments)
                ]);
                var newNode = printer.printNode(ts.EmitHint.Expression, newExpression, sourceFile);
                changes.push(new change_1.ReplaceChange(path, node.getStart(sourceFile), node.getText(sourceFile), newNode));
            }
        });
    });
    if (changes.length > 0) {
        changes.unshift(addItemToImport(path, sourceFile, printer, storeImport, 'select'));
    }
    return changes;
}
function migrateNgrx(host) {
    var ngrxVersion = ast_utils_2.readJsonInTree(host, 'package.json').dependencies['@ngrx/store'];
    if (ngrxVersion &&
        !(ngrxVersion.startsWith('6.') ||
            ngrxVersion.startsWith('~6.') ||
            ngrxVersion.startsWith('^6.'))) {
        return host;
    }
    host.visit(function (path) {
        if (!path.endsWith('.ts')) {
            return;
        }
        var sourceFile = ts.createSourceFile(path, host.read(path).toString(), ts.ScriptTarget.Latest);
        if (sourceFile.isDeclarationFile) {
            return;
        }
        ast_utils_2.insert(host, path, updateOfTypeCode(path, sourceFile));
        sourceFile = ts.createSourceFile(path, host.read(path).toString(), ts.ScriptTarget.Latest);
        ast_utils_2.insert(host, path, updateSelectorCode(path, sourceFile));
        sourceFile = ts.createSourceFile(path, host.read(path).toString(), ts.ScriptTarget.Latest);
        ast_utils_2.insert(host, path, cleanUpDoublePipes(path, sourceFile));
    });
}
function cleanUpDoublePipes(path, sourceFile) {
    var changes = [];
    var printer = ts.createPrinter();
    ast_utils_1.getSourceNodes(sourceFile).forEach(function (node) {
        if (ts.isCallExpression(node) &&
            ts.isPropertyAccessExpression(node.expression) &&
            ts.isCallExpression(node.expression.expression) &&
            ts.isPropertyAccessExpression(node.expression.expression.expression) &&
            node.expression.name.text === 'pipe' &&
            node.expression.expression.expression.name.text === 'pipe') {
            var singlePipe = ts.createCall(node.expression.expression.expression, node.typeArguments, node.expression.expression.arguments.concat(node.arguments));
            changes.push(new change_1.ReplaceChange(path, node.getStart(sourceFile), node.getText(sourceFile), printer.printNode(ts.EmitHint.Expression, singlePipe, sourceFile)));
        }
    });
    return changes;
}
var ɵ1 = function (json) {
    json.devDependencies = json.devDependencies || {};
    json.dependencies = json.dependencies || {};
    json.dependencies = __assign({}, json.dependencies, { '@ngrx/effects': '7.2.0', '@ngrx/router-store': '7.2.0', '@ngrx/store': '7.2.0' });
    json.devDependencies = __assign({}, json.devDependencies, { '@ngrx/schematics': '7.2.0', '@ngrx/store-devtools': '7.2.0' });
    return json;
};
exports.ɵ1 = ɵ1;
var updateNgrx = ast_utils_2.updateJsonInTree('package.json', ɵ1);
var ɵ2 = function (json) {
    json.devDependencies = json.devDependencies || {};
    json.devDependencies = __assign({}, json.devDependencies, { dotenv: '6.2.0' });
    return json;
};
exports.ɵ2 = ɵ2;
var addDotEnv = ast_utils_2.updateJsonInTree('package.json', ɵ2);
var ɵ3 = function (json) {
    if (!json.schematics) {
        json.schematics = {};
    }
    if (!json.schematics['@nrwl/schematics:library']) {
        json.schematics['@nrwl/schematics:library'] = {};
    }
    if (!json.schematics['@nrwl/schematics:library'].unitTestRunner) {
        json.schematics['@nrwl/schematics:library'].unitTestRunner = 'karma';
    }
    if (!json.schematics['@nrwl/schematics:application']) {
        json.schematics['@nrwl/schematics:application'] = {};
    }
    if (!json.schematics['@nrwl/schematics:application'].unitTestRunner) {
        json.schematics['@nrwl/schematics:application'].unitTestRunner = 'karma';
    }
    if (!json.schematics['@nrwl/schematics:application'].e2eTestRunner) {
        json.schematics['@nrwl/schematics:application'].e2eTestRunner =
            'protractor';
    }
    if (!json.schematics['@nrwl/schematics:node-application']) {
        json.schematics['@nrwl/schematics:node-application'] = {};
    }
    if (!json.schematics['@nrwl/schematics:node-application'].framework) {
        json.schematics['@nrwl/schematics:node-application'].framework = 'express';
    }
    return json;
};
exports.ɵ3 = ɵ3;
var setDefaults = ast_utils_2.updateJsonInTree('angular.json', ɵ3);
var updateAngularCLI = schematics_1.chain([
    update_task_1.addUpdateTask('@angular/cli', '7.3.1'),
    ast_utils_2.addDepsToPackageJson({}, {
        '@angular-devkit/build-angular': '~0.13.1'
    })
]);
function default_1() {
    return schematics_1.chain([
        addExtensionRecommendations,
        addDotEnv,
        updateAngularCLI,
        migrateNgrx,
        updateNgrx,
        setDefaults,
        format_files_1.formatFiles()
    ]);
}
exports.default = default_1;
