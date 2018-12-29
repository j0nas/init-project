#!/usr/bin/env node
'use strict';

const isValid = require('valid-filename');
const meow = require('meow');
const { copyFiles } = require('./api');

(async () => {
  const cli = meow(`
  Usage
    $ newp <project-name>`);

  const targetDirectory = cli.input[0];
  if (!isValid(targetDirectory)) {
    console.error(`[${targetDirectory}] is not a valid directory name`);
    cli.showHelp();
  }

  const dirPath = await copyFiles(targetDirectory);
  console.log('Successfully created new project:');
  console.log(dirPath);
})();
