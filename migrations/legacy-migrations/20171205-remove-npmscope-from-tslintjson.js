"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fileutils_1 = require("../../src/utils/fileutils");
exports.default = {
    description: 'Remove npmScope from tslint.json',
    run: function () {
        fileutils_1.updateJsonFile('tslint.json', function (json) {
            var ruleName = 'nx-enforce-module-boundaries';
            var rule = ruleName in json.rules ? json.rules[ruleName] : null;
            // Only modify when the rule is configured with optional arguments
            if (Array.isArray(rule) &&
                typeof rule[1] === 'object' &&
                rule[1] !== null) {
                rule[1].npmScope = undefined;
            }
        });
    }
};
