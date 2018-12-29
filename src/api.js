const path = require('path');
const cpy = require('cpy');

const copyFiles = async directoryName => {
  const resourcesPath = path.join(__dirname, 'resources');
  const targetPath = path.join(process.cwd(), directoryName);
  await cpy(resourcesPath, targetPath);

  return targetPath;
};

module.exports = {
  copyFiles,
};