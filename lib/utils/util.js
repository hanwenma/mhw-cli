const { renderFile } = require("ejs");
const path = require("path");
const fs = require("fs");

/**
 * 编译模板
 * @param {*} templateName
 * @param {*} data
 * @returns
 */
function complie(templateName, data) {
  const templatePath = path.resolve(
    __dirname,
    `../templates/${templateName}.ejs`
  );

  return new Promise((resolve, reject) => {
    renderFile(templatePath, { data }, {}, (err, str) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(str);
    });
  });
}

/**
 * 生成文件
 * @param {*} path
 * @param {*} content
 * @returns
 */
function writeToFile(path, content) {
  return fs.promises.writeFile(path, content);
}

/**
 * 判断传入路径是否存在，不存在则创建
 * @param {*} pathName
 * @returns
 */
function createDirSyn(pathName) {
  if (fs.existsSync(pathName)) {
    return true;
  } else {
    if (createDirSyn(path.dirname(pathName))) {
      fs.mkdirSync(pathName);
      return true;
    }
  }
}

module.exports = {
  complie,
  writeToFile,
  createDirSyn,
};
