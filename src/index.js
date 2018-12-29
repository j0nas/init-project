const path = require('path');
const cpy = require('cpy');

(async () => {
  const resourcesPath = path.join(__dirname, 'resources');
  await cpy(resourcesPath, process.cwd());
})();