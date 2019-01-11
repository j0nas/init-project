#!/usr/bin/env node
"use strict";

// @ts-ignore
import isValid from "valid-filename";
import meow from "meow";
import { join } from "path";
import {
  copyFiles,
  gitInit,
  gitInitCommit,
  installDependencies,
  runDevServer,
  upgradePackageJson
} from "./api";

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
  console.log(
    "Upgraded package.json dependency versions, installing dependencies .."
  );

  await installDependencies();
  console.log("Dependencies installed");

  console.log(await gitInitCommit());
  console.log("Created initial commit");

  console.log("Starting dev server..");
  await runDevServer();
})();
