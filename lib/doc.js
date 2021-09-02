"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var fs_1 = require("fs");
var path_1 = require("path");
var process_1 = require("process");
var start = '/**@next-doc';
var identifier = /[\s\*]+@([a-zA-Z]+)/i;
function createDoc(dir, v) {
    if (v === void 0) { v = false; }
    var files = explorer(dir);
    var out = {};
    var count = 0;
    files.forEach(function (file) {
        if (['.ts', '.js'].indexOf(path_1.extname(file)) < 0)
            return;
        var content = fs_1.readFileSync(file).toString();
        if (content.indexOf(start) < 0)
            return v ? console.log(chalk_1.default.yellow('Skipped ' + file)) : 0;
        var lines = content.split('\n');
        var desc = false;
        lines.forEach(function (line, i) {
            line = line.trim();
            if (line == start)
                return (desc = true);
            if (!desc)
                return;
            if (line.indexOf('*/') >= 0)
                return (desc = false);
            if (line.indexOf('* @') != 0)
                return;
            var match = identifier.exec(line);
            if (!match)
                return console.log(line);
            switch (match[1]) {
                case 'body':
                case 'error':
                    break;
                case 'method':
                    var method = line.replace(match[0], '').trim();
                    if (['POST', 'GET', 'PUT', 'DELETE'].indexOf(method) < 0) {
                        console.log(chalk_1.default.red("The method " + method + " (" + file + ":" + (i + 1) + ") is not recognized by next-doc. Next-doc could not continue. "));
                        process_1.exit();
                    }
                    if (v)
                        console.log(chalk_1.default.green('Found declaration for ' +
                            file
                                .replace(dir, '')
                                .split('.')
                                .slice(0, -1)
                                .join('.') +
                            ' using method ' +
                            method));
                    break;
                case 'description':
                    break;
                default:
                    if (v)
                        console.log(chalk_1.default.yellow('Unrecognized identifier ' +
                            match[1] +
                            ' - Skipped'));
                    break;
            }
        });
        count++;
    });
}
exports.default = createDoc;
function explorer(dir) {
    var files = fs_1.readdirSync(dir);
    var result = [];
    files.forEach(function (file) {
        file = dir + '/' + file;
        if (fs_1.lstatSync(file).isDirectory()) {
            result = __spreadArray(__spreadArray([], result), explorer(file));
        }
        else {
            result.push(file);
        }
    });
    return result;
}
