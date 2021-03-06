"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fileutils_1 = require("../../src/utils/fileutils");
var fs_1 = require("fs");
var common_1 = require("../../src/utils/common");
var path = require("path");
exports.default = {
    description: 'Create tsconfig.app.json for every app',
    run: function () {
        var config = fileutils_1.readCliConfigFile();
        config.apps.forEach(function (app) {
            if (!app.root.startsWith('apps/'))
                return;
            var offset = common_1.offsetFromRoot(app.root);
            fs_1.writeFileSync(app.root + "/tsconfig.app.json", "{\n  \"extends\": \"" + offset + "tsconfig.json\",\n  \"compilerOptions\": {\n    \"outDir\": \"" + offset + "dist/out-tsc/apps/" + app.name + "\",\n    \"module\": \"es2015\"\n  },\n  \"include\": [\n    \"**/*.ts\"\n    /* add all lazy-loaded libraries here: \"" + offset + "libs/my-lib/index.ts\" */\n  ],\n  \"exclude\": [\n    \"**/*.spec.ts\"\n  ]\n}");
            fs_1.writeFileSync(path.dirname(app.root) + "/e2e/tsconfig.e2e.json", "{\n  \"extends\": \"" + offset + "tsconfig.json\",\n  \"compilerOptions\": {\n    \"outDir\": \"" + offset + "dist/out-tsc/e2e/" + app.name + "\",\n    \"module\": \"commonjs\",\n    \"target\": \"es5\",\n    \"types\": [\n      \"jasmine\",\n      \"jasminewd2\",\n      \"node\"\n    ]\n  },\n  \"include\": [\n    \"../**/*.ts\"\n    /* add all lazy-loaded libraries here: \"" + offset + "libs/my-lib/index.ts\" */\n  ],\n  \"exclude\": [\n    \"**/*.spec.ts\"\n  ]\n}");
        });
        fs_1.writeFileSync('protractor.conf.js', "\n// Protractor configuration file, see link for more information\n// https://github.com/angular/protractor/blob/master/lib/config.ts\n\nconst { SpecReporter } = require('jasmine-spec-reporter');\nconst { getAppDirectoryUsingCliConfig } = require('@nrwl/schematics/src/utils/cli-config-utils');\nconst appDir = getAppDirectoryUsingCliConfig();\n\nexports.config = {\n  allScriptsTimeout: 11000,\n  specs: [\n    appDir + '/e2e/**/*.e2e-spec.ts'\n  ],\n  capabilities: {\n    'browserName': 'chrome'\n  },\n  directConnect: true,\n  baseUrl: 'http://localhost:4200/',\n  framework: 'jasmine',\n  jasmineNodeOpts: {\n    showColors: true,\n    defaultTimeoutInterval: 30000,\n    print: function() {}\n  },\n  onPrepare() {\n    require('ts-node').register({\n      project: appDir + '/e2e/tsconfig.e2e.json'\n    });\n    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));\n  }\n};");
        fs_1.writeFileSync("tsconfig.spec.json", "{\n  \"extends\": \"./tsconfig.json\",\n  \"compilerOptions\": {\n    \"outDir\": \"./dist/out-tsc/spec\",\n    \"module\": \"commonjs\",\n    \"target\": \"es5\",\n    \"types\": [\n      \"jasmine\",\n      \"node\"\n    ]\n  },\n  \"include\": [\n    \"**/*.ts\"\n  ],\n  \"exclude\": [\n    \"node_modules\",\n    \"tmp\"\n  ]\n}");
        fs_1.unlinkSync('tsconfig.app.json');
        fs_1.unlinkSync('tsconfig.e2e.json');
        fileutils_1.updateJsonFile('.angular-cli.json', function (json) {
            json.apps.forEach(function (app) {
                app['tsconfig'] = 'tsconfig.app.json';
            });
            json.lint = [
                {
                    project: './tsconfig.spec.json',
                    exclude: '**/node_modules/**'
                }
            ];
            json.apps.forEach(function (app) {
                if (!app.root.startsWith('apps/'))
                    return;
                json.lint.push({
                    project: "./" + app.root + "/tsconfig.app.json",
                    exclude: '**/node_modules/**'
                });
                json.lint.push({
                    project: "./apps/" + app.name + "/e2e/tsconfig.e2e.json",
                    exclude: '**/node_modules/**'
                });
            });
        });
    }
};
