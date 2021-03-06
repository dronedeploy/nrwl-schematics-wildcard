"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fileutils_1 = require("../../src/utils/fileutils");
exports.default = {
    description: 'Update tsconfig.spec.json to exclude e2e specs',
    run: function () {
        fileutils_1.updateJsonFile('tsconfig.spec.json', function (json) {
            if (!json.exclude) {
                json.exclude = ['node_modules', 'tmp'];
            }
            json.exclude = json.exclude.concat([
                '**/e2e/*.ts',
                '**/*.e2e-spec.ts',
                '**/*.po.ts'
            ]);
        });
    }
};
