const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const babel = require("@babel/core");

//分析入口文件
const rukoufenxi = entry => {
  const content = fs.readFileSync(entry, "utf-8");
  const ast = parser.parse(content, {
    sourceType: "module"
  });
  const yilai = {};
  traverse(ast, {
    ImportDeclaration({ node }) {
      const dirname = path.dirname(entry);
      const newFile = "./" + path.join(dirname, node.source.value);
      yilai[node.source.value] = newFile;
    }
  });
  const { code } = babel.transformFromAst(ast, null, {
    presets: ["@babel/preset-env"]
  });
  return {
    entry,
    yilai,
    code
  };
};

const yilaifenxi = entry => {
  const rukou = rukoufenxi(entry);
  const yilaiArr = [rukou];
  for (let i = 0; i < yilaiArr.length; i++) {
    const item = yilaiArr[i];
    const { yilai } = item;
    if (yilai) {
      for (let j in yilai) {
        yilaiArr.push(rukoufenxi(yilai[j]));
      }
    }
  }
  const newData = {};
  yilaiArr.forEach(item => {
    newData[item.entry] = {
      yilai: item.yilai,
      code: item.code
    };
  });
  return newData;
};
//entry "./src/index.js"
const generateCode = entry => {
  const data = JSON.stringify(yilaifenxi(entry));
  return `
		(function(graph){
			function require(module) { 
				function localRequire(relativePath) {
					return require(graph[module].yilai[relativePath]);
                }
                var exports = {};
				(function(require, exports, code){
					eval(code)
				})(localRequire, exports, graph[module].code);
				return exports;
			};
			require('${entry}')
		})(${data});
	`;
};
const code = generateCode("./src/index.js");

console.log(code);
