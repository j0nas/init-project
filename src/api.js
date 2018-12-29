const path = require('path');
const cpy = require('cpy');

const copyFiles = async directoryName => {
  const targetPath = path.join(process.cwd(), directoryName);
  await cpy('**/*', targetPath, { cwd: path.join(__dirname, '..', 'resources'), parents: true });

  return targetPath;
};

module.exports = {
  copyFiles,
};