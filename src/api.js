const path = require('path');
const cpy = require('cpy');
const { promisify } = require('util');
const { exec } = require('child_process');
const execP = promisify(exec);

const copyFiles = async directoryName => {
  const targetPath = path.join(process.cwd(), directoryName);
  const cwd = path.join(__dirname, '..', 'resources');
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

module.exports = {
  copyFiles,
  gitInit,
};