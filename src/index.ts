#!/usr/bin/env node
import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import fs from 'fs';
import { exit } from 'process';
import createDoc from './doc';
const program = require('commander');
let dir = process.cwd();

program
    .version('0.0.1')
    .description('A documentation generator for next.js')
    .option('-j, --json', 'Export as JSON')
    .option('-v, --verbose', 'Show logs')
    .option('-d, --dir <dir>', 'Specifies the working directory')
    .parse(process.argv);

const options = program.opts();

clear();

console.log(
    chalk.red(
        figlet.textSync('NextDoc', {
            horizontalLayout: 'full',
        })
    )
);

if (options.dir) dir = options.dir;

dir = dir + '/pages/api';

if (!fs.existsSync(dir)) {
    console.log(`Could not locate (${dir})`);
    exit(1);
}

console.log('Current dir : ' + dir);

createDoc(dir, options.verbose);
