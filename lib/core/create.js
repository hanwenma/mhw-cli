const program = require("commander");

const {
  createProjectAction,
  addComponentAction,
  addRouterAction,
} = require("./actions");

function createCommands() {
  // 创建项目
  program
    .command("create <project> [others...]")
    .description("clone a repository to local folder")
    .action(createProjectAction);

  // 创建组件
  program
    .command("addComp <component>")
    .description(
      "add a component file for project, example: mhw addComp Header -d /src/components"
    )
    .action((name) => {
      addComponentAction(name, program.dest || "src/components");
    });

  // 创建路由
  program
    .command("addRouter <name>")
    .description(
      "add a router file for project, example: mhw addRouter header -d /src/router/routes"
    )
    .action((name) => {
      addRouterAction(name, program.dest || "src/router/routes");
    });
}

module.exports = createCommands;
