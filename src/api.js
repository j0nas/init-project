const { join } = require("path");
const { promisify } = require("util");
const { exec, spawn } = require("child_process");
const { createWriteStream } = require("fs");
const { writeFile } = require("gitignore");
const { run } = require("npm-check-updates");
const cpy = require("cpy");
const opn = require("opn");

const execP = promisify(exec);
const writeFileP = promisify(writeFile);

const copyFiles = async directoryName => {
  const targetPath = join(process.cwd(), directoryName);
  const cwd = join(__dirname, "..", "resources");
  await cpy("**/*", targetPath, { cwd, parents: true });

  return targetPath;
};

const gitInit = async () => {
  const { stdout, stderr } = await execP("git init");
  if (stderr) {
    throw new Error(stderr);
  }

  return stdout;
};

const upgradePackageJson = async packageJsonPath =>
  run({ packageFile: packageJsonPath, upgrade: true, upgradeAll: true });

const createGitIgnore = async (fileDirectory, types) => {
  const gitIgnorePath = join(fileDirectory, ".gitignore");
  const promises = types.map(type => {
    const file = createWriteStream(gitIgnorePath, { flags: "a" });
    return writeFileP({ type, file });
  });

  await Promise.all(promises);
};

const installDependencies = async () =>
  new Promise((resolve, reject) => {
    const child = spawn("npm", ["install"]);
    child.stdout.on("data", data => process.stdout.write(data));
    child.stderr.on("data", data => process.stdout.write(data));
    child.on("error", data => reject("npm install error:" + data));
    child.on("exit", resolve);
  });

const gitInitCommit = async () => {
  const { stdout, stderr } = await execP(
    'git add --all && git commit --message "init commit"'
  );
  return stdout || stderr;
};

const runDevServer = async () => {
  const child = spawn("npm", ["run", "dev"]);
  child.stdout.on("data", data => process.stdout.write(data));
  child.stderr.on("data", data => process.stdout.write(data));
  child.on("error", data => console.log("Error!", data));

  setTimeout(() => opn("http://localhost:3000"), 5000);

  return child;
};

module.exports = {
  copyFiles,
  gitInit,
  upgradePackageJson,
  createGitIgnore,
  installDependencies,
  gitInitCommit,
  runDevServer
};
