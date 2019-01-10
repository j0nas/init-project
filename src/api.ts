// @ts-ignore
import { run } from "npm-check-updates";
import { join } from "path";
import { promisify } from "util";
import { exec, spawn } from "child_process";
import cpy from "cpy";
import opn from "opn";

const execP = promisify(exec);

const copyFiles = async (directoryName: string) => {
  const targetPath = join(process.cwd(), directoryName);
  const cwd = join(__dirname, "..", "resources");
  await cpy(["**/*", ".gitignore"], targetPath, { cwd, parents: true });

  return targetPath;
};

const gitInit = async () => {
  const { stdout, stderr } = await execP("git init");
  if (stderr) {
    throw new Error(stderr);
  }

  return stdout;
};

const upgradePackageJson = async (packageJsonPath: string) =>
  run({ packageFile: packageJsonPath, upgrade: true, upgradeAll: true });

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
  installDependencies,
  gitInitCommit,
  runDevServer
};
