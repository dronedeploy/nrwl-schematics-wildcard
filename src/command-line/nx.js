#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nx_commands_1 = require("@nrwl/schematics/src/command-line/nx-commands");
/**
 * The commandsObject is a Yargs object declared in `nx-commands.ts`,
 * It is exposed and bootstrapped here to provide CLI features.
 */
nx_commands_1.commandsObject.argv; // .argv bootstraps the CLI creation;
