#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var clear_1 = __importDefault(require("clear"));
var figlet_1 = __importDefault(require("figlet"));
var fs_1 = __importDefault(require("fs"));
var process_1 = require("process");
var doc_1 = __importDefault(require("./doc"));
var program = require('commander');
var dir = process.cwd();
program
    .version('0.0.1')
    .description('A documentation generator for next.js')
    .option('-j, --json', 'Export as JSON')
    .option('-v, --verbose', 'Show logs')
    .option('-d, --dir <dir>', 'Specifies the working directory')
    .parse(process.argv);
var options = program.opts();
clear_1.default();
console.log(chalk_1.default.red(figlet_1.default.textSync('NextDoc', {
    horizontalLayout: 'full',
})));
if (options.dir)
    dir = options.dir;
dir = dir + '/pages/api';
if (!fs_1.default.existsSync(dir)) {
    console.log("Could not locate (" + dir + ")");
    process_1.exit(1);
}
console.log('Current dir : ' + dir);
doc_1.default(dir, options.verbose);
