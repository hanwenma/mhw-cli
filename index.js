#!/usr/bin/env node
const program = require('commander');

const helpOptions = require('./lib/core/helpOptions');
const createCommands = require('./lib/core/create');
const color = require('colors/safe');

console.log(color.green('~ mhw cli runing for you ~'));

// 查看版本号
program.version(require('./package.json').version);

// 添加帮助选项
helpOptions();

// 创建命令
createCommands();

// 解析命令行参数
program.parse(process.argv);