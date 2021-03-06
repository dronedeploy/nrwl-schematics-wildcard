"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fileutils_1 = require("../../src/utils/fileutils");
exports.default = {
    description: 'Update the schema file to reflect the `allow` option for `nx-enforce-module-boundaries`.',
    run: function () {
        fileutils_1.updateJsonFile('tslint.json', function (json) {
            var ruleName = 'nx-enforce-module-boundaries';
            var ruleOptionName = 'allow';
            var rule = ruleName in json.rules ? json.rules[ruleName] : null;
            // Only modify when the rule is configured with optional arguments
            if (Array.isArray(rule) &&
                typeof rule[1] === 'object' &&
                rule[1] !== null) {
                rule[1][ruleOptionName] = [];
            }
        });
    }
};
