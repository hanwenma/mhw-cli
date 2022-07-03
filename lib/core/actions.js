const { promisify } = require("util");
const download = promisify(require("download-git-repo"));
const path = require("path");
const Spinnies = require("spinnies");
const open = require("open");

const spinner = { interval: 80, frames: ["🍇", "🍈", "🍉", "🍋"] };
const spinnies = new Spinnies({
  color: "blue",
  succeedColor: "green",
  spinner,
});

const { spawnCommand } = require("../utils/terminal");
const { complie, writeToFile, createDirSyn } = require("../utils/util");

// github url
const { vue2Repo, vue3Repo } = require("../config/repo-config");

/**
 * 创建项目 action
 * @param {*} project
 * @param {*} others
 */
async function createProjectAction(project, others) {
  // 1. clone 项目
  spinnies.add("clone", {
    text: "It may take a few minutes to clone the project",
  });
  const cloneResult = await download(vue3Repo, project, { clone: true });
  cloneResult.then(
    () => spinnies.succeed("clone"),
    () => spinnies.fail("clone")
  );

  const command = process.platform === "win32" ? "npm.cmd" : "npm";
  const options = { cwd: `./${project}` };

  // 2. npm install 安装依赖
  spinnies.add("install", {
    text: "It may take a few minutes to npm install for the project",
  });
  const installResult = await spawnCommand(command, ["install"], options);
  installResult.then(
    () => spinnies.succeed("install"),
    () => spinnies.fail("install")
  );

  // 3. npm run dev 启动项目
  spinnies.add("run", {
    text: "It may take a few minutes to npm install for the project",
  });
  const runResult = await spawnCommand(command, ["run", "dev"], options);
  runResult.then(
    () => spinnies.succeed("run"),
    () => spinnies.fail("run")
  );

  // 4. 自动打开浏览器：【使用 open 手动打开】或 【使用模板项目中的 webpack 配置打开】
  // open('http://localhost:8080');
}

/**
 * 创建组件 action
 * @param {*} project
 * @param {*} others
 */
async function addComponentAction(name, dest) {
  spinnies.add("addComponent", {
    text: `creating component file with name "${name}"`,
  });

  // 编译 ejs 模板
  const content = await complie("vue3-component", {
    name,
    lowerName: name.toLowerCase(),
  });

  // 生成 .vue 文件
  dest = `${dest}/${name}`;
  const targetUrl = path.resolve(dest, "index.vue");

  // 将文件写入到对应目录中
  createDirSyn(dest);
  writeToFile(targetUrl, content).then(
    () => spinnies.succeed("addComponent"),
    () => spinnies.fail("addComponent")
  );
}

/**
 * 创建路由文件
 * @param {*} name
 * @param {*} dest
 */
async function addRouterAction(name, dest) {
  spinnies.add("addRouter", {
    text: `creating router file with name "${name}"`,
  });

  // 编译 ejs 模板
  const content = await complie("router", {
    name,
    lowerName: name.toLowerCase(),
  });

  // 生成 .ts 文件
  const targetUrl = path.resolve(dest, `${name.toLowerCase()}.ts`);

  // 将文件写入对应目录
  createDirSyn(dest);
  writeToFile(targetUrl, content).then(
    () => spinnies.succeed("addRouter"),
    () => spinnies.fail("addRouter")
  );
}

module.exports = {
  createProjectAction,
  addComponentAction,
  addRouterAction,
};
