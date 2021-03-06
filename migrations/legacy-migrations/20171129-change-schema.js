"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fileutils_1 = require("../../src/utils/fileutils");
exports.default = {
    description: 'Update the schema file to point to the nrwl schema.',
    run: function () {
        fileutils_1.updateJsonFile('.angular-cli.json', function (json) {
            json['$schema'] = './node_modules/@nrwl/schematics/src/schema.json';
        });
    }
};
