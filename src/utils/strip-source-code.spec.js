"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var strip_source_code_1 = require("./strip-source-code");
var typescript_1 = require("typescript");
describe('stripSourceCode', function () {
    var scanner;
    beforeEach(function () {
        scanner = typescript_1.createScanner(typescript_1.ScriptTarget.Latest, false);
    });
    it('should work on different types of imports', function () {
        var input = "\n      import * as React from \"react\";\n      import { Component } from \"react\";\n      import {\n        Component\n      } from \"react\"\n      import {\n        Component\n      } from \"react\";\n      \n      import \"./app.scss\";\n\n      import('./module.ts')\n\n      const a = 1;\n      export class App {}\n    ";
        var expected = "import * as React from \"react\"\nimport { Component } from \"react\"\nimport {\n        Component\n      } from \"react\"\nimport {\n        Component\n      } from \"react\"\nimport \"./app.scss\"";
        expect(strip_source_code_1.stripSourceCode(scanner, input)).toEqual(expected);
    });
    it('should work on different types of exports', function () {
        var input = "export * from './module';\n      export {\n        A\n      } from './a';\n\n      export { B } from './b';\n\n      export { C as D } from './c';\n\n      const a = 1;\n      export class App {}\n    ";
        var expected = "export * from './module'\nexport {\n        A\n      } from './a'\nexport { B } from './b'\nexport { C as D } from './c'";
        expect(strip_source_code_1.stripSourceCode(scanner, input)).toEqual(expected);
    });
    it('should not strip files containing "loadChildren"', function () {
        var input = "const routes = [\n      {\n        path: 'lazy',\n        loadChildren: '@nrwl/lazy'\n      }\n    ];";
        expect(strip_source_code_1.stripSourceCode(scanner, input)).toEqual(input);
    });
});
