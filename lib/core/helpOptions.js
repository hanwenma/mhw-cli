const program = require("commander");

function helpOptions() {
  // 添加可选参数 options
  program.option(
    "-d, --dest <dest>",
    "a destination folder, example: -d /src/components"
  );
  program.option("-f, --frame <frame>", "choose your frame, example: -f vue2");

  // 通过监听事件的方式
  program.on("--help", function () {
    console.log("");
    console.log("Other:");
    console.log(" other options~");
  });
}

module.exports = helpOptions;
