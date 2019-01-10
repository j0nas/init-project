// @ts-ignore
import { run } from "npm-check-updates";
import { join } from "path";
import * as execa from "execa";
import * as cpy from "cpy";
// @ts-ignore
import * as opn from "opn";

export const copyFiles = async (directoryName: string) => {
  const targetPath = join(process.cwd(), directoryName);
  const cwd = join(__dirname, "..", "resources");
  await cpy(["**/*", ".gitignore"], targetPath, { cwd, parents: true });

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
