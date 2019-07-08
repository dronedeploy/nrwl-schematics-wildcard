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
var ast_utils_1 = require("../../utils/ast-utils");
var ts = require("typescript");
var ast_utils_2 = require("@schematics/angular/utility/ast-utils");
var tasks_1 = require("@angular-devkit/schematics/tasks");
var format_files_1 = require("../../utils/rules/format-files");
var name_utils_1 = require("../../utils/name-utils");
function default_1(options) {
    options = normalizeOptions(options);
    var workspaceOpts = __assign({}, options, { preset: undefined });
    return function (host, context) {
        return schematics_1.chain([
            schematics_1.schematic('workspace', workspaceOpts),
            createPreset(options),
            schematics_1.move('/', options.directory),
            addTasks(options),
            format_files_1.formatFiles()
        ])(schematics_1.Tree.empty(), context);
    };
}
exports.default = default_1;
function createPreset(options) {
    if (options.preset === 'empty') {
        return schematics_1.noop();
    }
    else if (options.preset === 'angular') {
        return schematics_1.chain([
            schematics_1.schematic('application', {
                name: options.name,
                style: options.style,
                framework: "angular" /* Angular */
            }, { interactive: false }),
            setDefaultAppFramework("angular" /* Angular */)
        ]);
    }
    else if (options.preset === 'react') {
        return schematics_1.chain([
            schematics_1.schematic('application', {
                name: options.name,
                style: options.style,
                framework: "react" /* React */
            }, { interactive: false }),
            setDefaultAppFramework("react" /* React */)
        ]);
    }
    else if (options.preset === 'web-components') {
        return schematics_1.chain([
            schematics_1.schematic('application', {
                name: options.name,
                style: options.style,
                framework: "web-components" /* WebComponents */
            }, { interactive: false }),
            setDefaultAppFramework("web-components" /* WebComponents */)
        ]);
    }
    else {
        return schematics_1.chain([
            schematics_1.schematic('application', { name: options.name, style: options.style }, { interactive: false }),
            schematics_1.schematic('node-application', {
                name: 'api',
                frontendProject: options.name
            }, { interactive: false }),
            schematics_1.schematic('library', { name: 'api-interface', framework: 'none' }, { interactive: false }),
            setDefaultAppFramework("angular" /* Angular */),
            connectFrontendAndApi(options)
        ]);
    }
}
function connectFrontendAndApi(options) {
    return function (host) {
        host.create('libs/api-interface/src/lib/interfaces.ts', "export interface Message { message: string }");
        host.overwrite('libs/api-interface/src/index.ts', "export * from './lib/interfaces';");
        var modulePath = "apps/" + options.name + "/src/app/app.module.ts";
        var moduleFile = ts.createSourceFile(modulePath, host.read(modulePath).toString(), ts.ScriptTarget.Latest, true);
        ast_utils_1.insert(host, modulePath, [
            ast_utils_2.insertImport(moduleFile, modulePath, 'HttpClientModule', "@angular/common/http")
        ].concat(ast_utils_1.addImportToModule(moduleFile, "@angular/common/http", "HttpClientModule")));
        var scope = options.npmScope ? options.npmScope : options.name;
        var style = options.style ? options.style : 'css';
        host.overwrite("apps/" + options.name + "/src/app/app.component.ts", "import { Component } from '@angular/core';\nimport { HttpClient } from '@angular/common/http';\nimport { Message } from '@" + scope + "/api-interface';\n\n@Component({\n  selector: '" + scope + "-root',\n  templateUrl: './app.component.html',\n  styleUrls: ['./app.component." + style + "']\n})\nexport class AppComponent {\n  hello$ = this.http.get<Message>('/api/hello')\n  constructor(private http: HttpClient) {}\n}    \n    ");
        host.overwrite("apps/" + options.name + "/src/app/app.component.spec.ts", "import { Component } from '@angular/core';\nimport { TestBed, async } from '@angular/core/testing';\nimport { HttpClientModule } from '@angular/common/http';\nimport { AppComponent } from './app.component';\n\ndescribe('AppComponent', () => {\n  beforeEach(async(() => {\n    TestBed.configureTestingModule({\n      declarations: [AppComponent],\n      imports: [HttpClientModule]\n    }).compileComponents();\n  }));\n\n  it('should create the app', () => {\n    const fixture = TestBed.createComponent(AppComponent);\n    const app = fixture.debugElement.componentInstance;\n    expect(app).toBeTruthy();\n  });\n});    \n    ");
        host.overwrite("apps/" + options.name + "/src/app/app.component.html", "<div style=\"text-align:center\">\n  <h1>Welcome to " + options.name + "!</h1>\n  <img\n    width=\"450\"\n    src=\"https://raw.githubusercontent.com/nrwl/nx/master/nx-logo.png\"\n  />\n</div>\n<div>Message: {{ (hello$|async)|json }}</div>\n    ");
        host.overwrite("apps/api/src/app/app.controller.ts", "import { Controller, Get } from '@nestjs/common';\n\nimport { Message } from '@" + scope + "/api-interface';\n\nimport { AppService } from './app.service';\n\n@Controller()\nexport class AppController {\n  constructor(private readonly appService: AppService) {}\n\n  @Get('hello')\n  getData(): Message {\n    return this.appService.getData();\n  }\n}\n    ");
        host.overwrite("apps/api/src/app/app.service.ts", "import { Injectable } from '@nestjs/common';\nimport { Message } from '@" + scope + "/api-interface';\n\n@Injectable()\nexport class AppService {\n  getData(): Message {\n    return { message: 'Welcome to api!' };\n  }\n}\n    ");
    };
}
function addTasks(options) {
    return function (host, context) {
        var packageTask;
        if (!options.skipInstall) {
            packageTask = context.addTask(new tasks_1.NodePackageInstallTask(options.directory));
        }
        if (!options.skipGit) {
            var commit = typeof options.commit == 'object'
                ? options.commit
                : !!options.commit
                    ? {}
                    : false;
            context.addTask(new tasks_1.RepositoryInitializerTask(options.directory, commit), packageTask ? [packageTask] : []);
        }
    };
}
function setDefaultAppFramework(framework) {
    return ast_utils_1.updateJsonInTree('angular.json', function (json) {
        if (!json.schematics) {
            json.schematics = {};
        }
        if (!json.schematics['@nrwl/schematics:application']) {
            json.schematics['@nrwl/schematics:application'] = {};
        }
        if (!json.schematics['@nrwl/schematics:application'].framework) {
            json.schematics['@nrwl/schematics:application'].framework = framework;
        }
        return json;
    });
}
function normalizeOptions(options) {
    options.name = name_utils_1.toFileName(options.name);
    if (!options.directory) {
        options.directory = options.name;
    }
    return options;
}
