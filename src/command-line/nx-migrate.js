"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var fileutils_1 = require("../utils/fileutils");
var ɵ1 = function (f) { return f.endsWith('.js') && !f.endsWith('.d.js'); }, ɵ0 = function (file) { return ({
    migration: require("../../migrations/" + file).default,
    name: path.parse(file).name
}); };
exports.ɵ1 = ɵ1;
exports.ɵ0 = ɵ0;
var allMigrations = fs
    .readdirSync(path.join(__dirname, '/../../migrations'))
    .filter(ɵ1)
    .map(ɵ0);
var latestMigration = readLatestMigration();
var migrationsToRun = calculateMigrationsToRun(allMigrations, latestMigration);
if (migrationsToRun.length === 0) {
    console.log('No migrations to run');
    process.exit(0);
}
printMigrationsNames(latestMigration, migrationsToRun);
runMigrations(migrationsToRun);
updateLatestMigration();
console.log('All migrations run successfully');
function readLatestMigration() {
    var angularCli = fileutils_1.readCliConfigFile();
    return angularCli.project.latestMigration;
}
function calculateMigrationsToRun(migrations, latestMigration) {
    var startingWith = latestMigration
        ? migrations.findIndex(function (item) { return item.name === latestMigration; }) + 1
        : 0;
    return migrations.slice(startingWith);
}
function printMigrationsNames(latestMigration, migrations) {
    console.log("Nx will run the following migrations (after " + latestMigration + "):");
    migrations.forEach(function (m) {
        console.log("- " + m.name);
    });
    console.log('---------------------------------------------');
}
function runMigrations(migrations) {
    migrations.forEach(function (m) {
        try {
            console.log("Running " + m.name);
            console.log(m.migration.description);
            m.migration.run();
            console.log('---------------------------------------------');
        }
        catch (e) {
            console.error("Migration " + m.name + " failed");
            console.error(e);
            console.error("Please run 'git checkout .'");
            process.exit(1);
        }
    });
}
function updateLatestMigration() {
    // we must reread .angular-cli.json because some of the migrations could have modified it
    fileutils_1.updateJsonFile('.angular-cli.json', function (angularCliJson) {
        angularCliJson.project.latestMigration =
            migrationsToRun[migrationsToRun.length - 1].name;
    });
}
