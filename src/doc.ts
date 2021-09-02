import chalk from 'chalk';
import { lstatSync, readdirSync, readFileSync } from 'fs';
import { basename, extname } from 'path';
import { exit } from 'process';
const start = '/**@next-doc';
const identifier = /[\s\*]+@([a-zA-Z]+)/i;

export default function createDoc(dir: string, v = false) {
    const files = explorer(dir);
    const out = {};

    let count = 0;

    files.forEach((file) => {
        if (['.ts', '.js'].indexOf(extname(file)) < 0) return;

        const content = readFileSync(file).toString();

        if (content.indexOf(start) < 0)
            return v ? console.log(chalk.yellow('Skipped ' + file)) : 0;

        const lines = content.split('\n');

        let desc = false;

        lines.forEach((line, i) => {
            line = line.trim();
            if (line == start) return (desc = true);
            if (!desc) return;
            if (line.indexOf('*/') >= 0) return (desc = false);
            if (line.indexOf('* @') != 0) return;

            const match = identifier.exec(line);

            if (!match) return console.log(line);

            switch (match[1]) {
                case 'body':
                case 'error':
                    break;
                case 'method':
                    const method = line.replace(match[0], '').trim();
                    if (['POST', 'GET', 'PUT', 'DELETE'].indexOf(method) < 0) {
                        console.log(
                            chalk.red(
                                `The method ${method} (${file}:${
                                    i + 1
                                }) is not recognized by next-doc. Next-doc could not continue. `
                            )
                        );
                        exit();
                    }
                    if (v)
                        console.log(
                            chalk.green(
                                'Found declaration for ' +
                                    file
                                        .replace(dir, '')
                                        .split('.')
                                        .slice(0, -1)
                                        .join('.') +
                                    ' using method ' +
                                    method
                            )
                        );
                    break;

                case 'description':
                    break;

                default:
                    if (v)
                        console.log(
                            chalk.yellow(
                                'Unrecognized identifier ' +
                                    match[1] +
                                    ' - Skipped'
                            )
                        );
                    break;
            }
        });

        count++;
    });
}

function explorer(dir: string) {
    const files = readdirSync(dir);
    let result: string[] = [];

    files.forEach((file) => {
        file = dir + '/' + file;
        if (lstatSync(file).isDirectory()) {
            result = [...result, ...explorer(file)];
        } else {
            result.push(file);
        }
    });

    return result;
}
