#!/usr/bin/env node
"use strict";

const isValid = require("valid-filename");
const meow = require("meow");
const { join } = require("path");
const {
  copyFiles,
  gitInit,
  upgradePackageJson,
  createGitIgnore,
  installDependencies,
  gitInitCommit,
  runDevServer
} = require("./api");

(async () => {
  const cli = meow(`
  Usage:
    $ init <project-name>`);

  const targetDirectory = cli.input[0];
  if (!isValid(targetDirectory)) {
    console.error(`[${targetDirectory}] is not a valid directory name`);
    cli.showHelp();
  }

  const dirPath = await copyFiles(targetDirectory);
  console.log("Successfully created new project:");
  console.log(dirPath);

  const createdProjectDirectory = join(process.cwd(), targetDirectory);
  process.chdir(createdProjectDirectory);
  console.log(await gitInit());

  const packageJsonPath = join(createdProjectDirectory, "package.json");
  await upgradePackageJson(packageJsonPath);
  console.log("Upgraded package.json dependency versions");

  await createGitIgnore(createdProjectDirectory, [
    "Node",
    "Global/JetBrains",
    "Global/macOS"
  ]);
  console.log("Created .gitignore");

  console.log("Installing npm dependencies..");
  console.log(await installDependencies());
  console.log("Dependencies installed");

  console.log(await gitInitCommit());
  console.log("Created initial commit");

  console.log("Starting dev server..");
  await runDevServer();
})();
