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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular-devkit/core");
var node_1 = require("@angular-devkit/core/node");
var schematics_1 = require("@angular-devkit/schematics");
var tools_1 = require("@angular-devkit/schematics/tools");
var appRoot = require("app-root-path");
var child_process_1 = require("child_process");
var fs = require("fs");
var fs_1 = require("fs");
var fs_extra_1 = require("fs-extra");
var inquirer = require("inquirer");
var path = require("path");
var yargsParser = require("yargs-parser");
var rootDirectory = appRoot.path;
function workspaceSchematic(args) {
    var parsedArgs = parseOptions(args);
    var logger = node_1.createConsoleLogger(parsedArgs.verbose, process.stdout, process.stderr);
    var outDir = compileTools();
    if (parsedArgs.listSchematics) {
        return listSchematics(path.join(outDir, 'workspace-schematics.json'), logger);
    }
    var schematicName = args[0];
    var workflow = createWorkflow(parsedArgs.dryRun);
    executeSchematic(schematicName, parsedArgs, workflow, outDir, logger);
}
exports.workspaceSchematic = workspaceSchematic;
// compile tools
function compileTools() {
    var toolsOutDir = getToolsOutDir();
    fs_extra_1.removeSync(toolsOutDir);
    compileToolsDir(toolsOutDir);
    var schematicsOutDir = path.join(toolsOutDir, 'schematics');
    var collectionData = constructCollection();
    saveCollection(schematicsOutDir, collectionData);
    return schematicsOutDir;
}
function getToolsOutDir() {
    return path.resolve(rootDirectory, 'tools', JSON.parse(fs_1.readFileSync(path.join(rootDirectory, 'tools', 'tsconfig.tools.json'), 'UTF-8')).compilerOptions.outDir);
}
function compileToolsDir(outDir) {
    fs_extra_1.copySync(path.join(rootDirectory, 'tools'), outDir);
    try {
        child_process_1.execSync('tsc -p tools/tsconfig.tools.json', {
            stdio: 'inherit',
            cwd: rootDirectory
        });
    }
    catch (e) {
        process.exit(1);
    }
}
function constructCollection() {
    var schematics = {};
    fs.readdirSync(schematicsDir()).forEach(function (c) {
        var childDir = path.join(schematicsDir(), c);
        if (exists(path.join(childDir, 'schema.json'))) {
            schematics[c] = {
                factory: "./" + c,
                schema: "./" + path.join(c, 'schema.json'),
                description: "Schematic " + c
            };
        }
    });
    return {
        name: 'workspace-schematics',
        version: '1.0',
        schematics: schematics
    };
}
function saveCollection(dir, collection) {
    fs_1.writeFileSync(path.join(dir, 'workspace-schematics.json'), JSON.stringify(collection));
}
function schematicsDir() {
    return path.join('tools', 'schematics');
}
function createWorkflow(dryRun) {
    var root = core_1.normalize(rootDirectory);
    var host = new core_1.virtualFs.ScopedHost(new node_1.NodeJsSyncHost(), root);
    return new tools_1.NodeWorkflow(host, {
        packageManager: fileExists('yarn.lock') ? 'yarn' : 'npm',
        root: root,
        dryRun: dryRun
    });
}
function listSchematics(collectionName, logger) {
    try {
        var engineHost = new tools_1.NodeModulesEngineHost();
        var engine = new schematics_1.SchematicEngine(engineHost);
        var collection = engine.createCollection(collectionName);
        logger.info(engine.listSchematicNames(collection).join('\n'));
    }
    catch (error) {
        logger.fatal(error.message);
        return 1;
    }
    return 0;
}
function createPromptProvider() {
    return function (definitions) {
        var questions = definitions.map(function (definition) {
            var question = {
                name: definition.id,
                message: definition.message,
                default: definition.default
            };
            var validator = definition.validator;
            if (validator) {
                question.validate = function (input) { return validator(input); };
            }
            switch (definition.type) {
                case 'confirmation':
                    return __assign({}, question, { type: 'confirm' });
                case 'list':
                    return __assign({}, question, { type: !!definition.multiselect ? 'checkbox' : 'list', choices: definition.items &&
                            definition.items.map(function (item) {
                                if (typeof item == 'string') {
                                    return item;
                                }
                                else {
                                    return {
                                        name: item.label,
                                        value: item.value
                                    };
                                }
                            }) });
                default:
                    return __assign({}, question, { type: definition.type });
            }
        });
        return inquirer.prompt(questions);
    };
}
// execute schematic
function executeSchematic(schematicName, options, workflow, outDir, logger) {
    return __awaiter(this, void 0, void 0, function () {
        var nothingDone, args, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nothingDone = true;
                    workflow.reporter.subscribe(function (event) {
                        nothingDone = false;
                        var eventPath = event.path.startsWith('/')
                            ? event.path.substr(1)
                            : event.path;
                        switch (event.kind) {
                            case 'error':
                                var desc = event.description == 'alreadyExist'
                                    ? 'already exists'
                                    : 'does not exist.';
                                console.error("error! " + eventPath + " " + desc + ".");
                                break;
                            case 'update':
                                console.log("update " + eventPath + " (" + event.content.length + " bytes)");
                                break;
                            case 'create':
                                console.log("create " + eventPath + " (" + event.content.length + " bytes)");
                                break;
                            case 'delete':
                                console.log("delete " + eventPath);
                                break;
                            case 'rename':
                                var eventToPath = event.to.startsWith('/')
                                    ? event.to.substr(1)
                                    : event.to;
                                console.log("rename " + eventPath + " => " + eventToPath);
                                break;
                        }
                    });
                    args = options._.slice(1);
                    workflow.registry.addSmartDefaultProvider('argv', function (schema) {
                        if ('index' in schema) {
                            return args[+schema.index];
                        }
                        else {
                            return args;
                        }
                    });
                    delete options._;
                    // Add support for interactive prompts
                    if (options.interactive) {
                        workflow.registry.usePromptProvider(createPromptProvider());
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, workflow
                            .execute({
                            collection: path.join(outDir, 'workspace-schematics.json'),
                            schematic: schematicName,
                            options: options,
                            logger: logger
                        })
                            .toPromise()];
                case 2:
                    _a.sent();
                    if (nothingDone) {
                        logger.info('Nothing to be done.');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    if (err_1 instanceof schematics_1.UnsuccessfulWorkflowExecution) {
                        // "See above" because we already printed the error.
                        logger.fatal('The Schematic workflow failed. See above.');
                    }
                    else {
                        logger.fatal(err_1.stack || err_1.message);
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function parseOptions(args) {
    return yargsParser(args, {
        boolean: ['dryRun', 'listSchematics', 'interactive'],
        alias: {
            dryRun: ['d'],
            listSchematics: ['l']
        },
        default: {
            interactive: true
        }
    });
}
function exists(file) {
    try {
        return !!fs.statSync(file);
    }
    catch (e) {
        return false;
    }
}
function fileExists(filePath) {
    try {
        return fs_1.statSync(filePath).isFile();
    }
    catch (err) {
        return false;
    }
}
