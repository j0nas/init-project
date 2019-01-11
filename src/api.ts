// @ts-ignore
import { run } from "npm-check-updates";
import * as path from "path";
import execa from "execa";
import cpy from "cpy";
import opn from "opn";

export const copyFiles = async (directoryName: string) => {
  const targetPath = path.join(process.cwd(), directoryName);
  const cwd = path.join(__dirname, "..", "resources");
  await cpy(["**/*", ".gitignore", ".babelrc"], targetPath, {
    cwd,
    parents: true
  });

  return targetPath;
};

export const gitInit = async () => {
  const { stdout, stderr, code } = await execa.shellSync("git init");
  if (code !== 0) {
    throw new Error(stderr);
  }

  return stdout;
};

export const upgradePackageJson = async (packageJsonPath: string) =>
  run({ packageFile: packageJsonPath, upgrade: true, upgradeAll: true });

export const installDependencies = async () => {
  try {
    const child = execa("npm", ["install"]);
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
    return await child;
  } catch (e) {
    console.log(`npm install error: ${e}`);
    return Promise.resolve();
  }
};

export const gitInitCommit = async () => {
  const { stdout, stderr } = await execa.shellSync(
    'git add --all && git commit --message "init commit"'
  );
  return stdout || stderr;
};

export const runDevServer = async () => {
  const child = execa("npm", ["run", "dev"]);
  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);

  setTimeout(() => opn("http://localhost:3000"), 5000);
  return child;
};
