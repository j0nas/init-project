const { join } = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');
const { createWriteStream } = require('fs');
const { writeFile } = require('gitignore');
const { run } = require('npm-check-updates');
const cpy = require('cpy');

const execP = promisify(exec);
const writeFileP = promisify(writeFile);

const copyFiles = async directoryName => {
  const targetPath = join(process.cwd(), directoryName);
  const cwd = join(__dirname, '..', 'resources');
  await cpy('**/*', targetPath, { cwd, parents: true });

  return targetPath;
};

const gitInit = async () => {
  const { stdout, stderr } = await execP('git init');
  if (stderr) {
    throw new Error(stderr);
  }

  return stdout;
};

const upgradePackageJson = async packageJsonPath =>
  run({ packageFile: packageJsonPath, upgrade: true, upgradeAll: true });

const createGitIgnore = async (fileDirectory, types) => {
  const gitIgnorePath = join(fileDirectory, '.gitignore');
  const promises = types.map(type => {
    const file = createWriteStream(gitIgnorePath, { flags: "a" });
    return writeFileP({ type, file });
  });

  await Promise.all(promises);
};

module.exports = {
  copyFiles,
  gitInit,
  upgradePackageJson,
  createGitIgnore,
};
