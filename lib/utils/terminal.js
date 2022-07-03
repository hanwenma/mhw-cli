/**
 * 执行终端命令
 */
const { spawn } = require("child_process");

function spawnCommand(command, args, options) {
  return new Promise((resolve, reject) => {
    // 执行命令实际上是打开了另一个新的进程
    const childProcess = spawn(command, args, options);

    // 执行命令的进程中输出的内容，可通过 pipe 输出到 当前进程 process 中
    childProcess.stdout.pipe(process.stadout);

    // 错误信息也需要从新进程中流向当前进程
    childProcess.stderr.pipe(process.stderr);

    // 新进程执行结束，需要通知当前进程，便于进行后续操作
    childProcess.on("close", () => {
        resolve();
    });
  });
}

module.exports = {
  spawnCommand,
};
