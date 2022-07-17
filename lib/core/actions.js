const { promisify } = require("util");
const download = promisify(require("download-git-repo"));
const path = require("path");
const open = require("open");

const { spawnCommand } = require("../utils/terminal");
const { complie, writeToFile, createDirSyn } = require("../utils/util");

// github url
const { vue2Repo, vue3Repo } = require("../config/repo-config");
const { spinniesAction } = require("../utils/spinnies");

/**
 * 创建项目 action
 * @param {*} project
 * @param {*} others
 */
async function createProjectAction(project, others) {
  // 1. clone 项目
  await spinniesAction({
    name: "clone",
    text: "It may take a few time to clone the project",
    handler: () => download(vue3Repo, project, { clone: true }),
  });

  const command = process.platform === "win32" ? "npm.cmd" : "npm";
  const options = { cwd: `./${project}` };

  // 2. npm install 安装依赖
  await spinniesAction({
    name: "install",
    text: "It may take a few time to npm install for your project",
    handler: () => spawnCommand(command, ["install"], options),
  });

  // 3. npm run dev 启动项目
  await spinniesAction({
    name: "run",
    text: "It may take a few time to npm run server for your project",
    handler: () => spawnCommand(command, ["run", "dev"], options),
  });

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
