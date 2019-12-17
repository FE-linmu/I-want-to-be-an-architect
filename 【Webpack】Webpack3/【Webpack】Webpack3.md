
## 引言
***
此篇文章主要涉及以下内容：
1. 如何自己编写一个`loader`
2. 如何自己编写一个`plugins`
3. 梳理`webpack`打包原理
4. 手写一个`bundle.js`文件

## 如何自己编写一个Loader
***
自己编写一个`loader`的过程是比较简单的，`loader`就是一个函数，**声明式函数**，不能用箭头函数，拿到源代码，作进一步的修饰处理，再返回处理后的源码就可以了。

### 简单案例

- 创建一个替换源码中字符串的`loader`

```
//index.js
console.log('hello loader')

// replaceLoader.js
module.exports = function(source){
  console.log(source,this,this.query)
  return source.replace('loader','替换的loader')
}

// 需要用声明式函数，因为要上到上下文的this，用到this的数据，该函数接受一个参数，是源码
```

- 在配置文件中使用`loader`

```
// 需要使用node核心模块path来处理路径
const path = require('path')
module:{
  rules:[
    {
      test: /\.js$/,
      use: path.resolve(__dirname,"./loader/replaceLoader.js")
    }
  ]
}
```

- 如何给`loader`配置参数，`loader`如何接受参数？
    - this.query
    - loader-utils（官方推荐的工具接受参数）

```
//webpack.config.js 
module: { 
  rules: [{ 
    test: /\.js$/, 
    use: [{ 
      loader: path.resolve(__dirname, "./loader/replaceLoader.js"),
      options: { 
        name: "开课吧" 
      } 
    }] 
  }] 
}
//replaceLoader.js
//const loaderUtils = require("loader-utils");//官方推荐处理loader,query的工具
module.exports = function (source) {  //this.query 通过this.query来接受配置文件传递进来的参数

  //return source.replace("kkb", this.query.name);  
  const options = loaderUtils.getOptions(this); const result = source.replace("kkb", options.name); return source.replace("kkb", options.name);
}
```

- **this.callback**:如何返回多个信息，不止是处理好的源码呢，可以使用this.callback来处理返回多个结果

```
//replaceLoader.js 
const loaderUtils = require("loader-utils");//官⽅方推荐处理理loader,query的⼯工具

module.exports = function (source) { 
  const options = loaderUtils.getOptions(this); 
  const result = source.replace("kkb", options.name); 
  this.callback(null, result); 
};

this.callback(
  err: Error | null, 
  content: string | Buffer, 
  sourceMap ?: SourceMap, 
  meta ?: any
);
```

- **this.async:**如果`loader`里面有异步的事情要怎么处理呢

```
const loaderUtils = require("loader-utils");

module.exports = function(source) {
    const options = loaderUtils.getOptions(this);  
    setTimeout(() => {    
      const result = source.replace("kkb", options.name);
      return result;  
    }, 1000); 
  };
  
  //先⽤用setTimeout处理理下试试，发现会报错
```

我们使用this.async来处理，它会返回this.callback，最后由callback来处理

```
const loaderUtils = require("loader-utils");
module.exports = function(source) {  
  const options = loaderUtils.getOptions(this);
  //定义⼀一个异步处理理，告诉webpack,这个loader⾥里里有异步事件,在⾥里里⾯面调⽤用下这个异步 
   //callback 就是 this.callback 注意参数的使⽤用  
  const callback = this.async();  
  setTimeout(() => {    
    const result = source.replace("kkb", options.name);    
    callback(null, result);  
  }, 3000); 
};

```

- 多个`loader`的使用

```
//replaceLoader.js 
module.exports = function(source) {  
  return source.replace("要替换的内容", "word"); 
};

//replaceLoaderAsync.js 
const loaderUtils = require("loader-utils"); 
module.exports = function(source) {
    const options = loaderUtils.getOptions(this);
  //定义⼀一个异步处理理，告诉webpack,这个loader⾥里里有异步事件,在⾥里里⾯面调⽤用下这个异步  
  const callback = this.async();  
  setTimeout(() => {    
    const result = source.replace("kkb", options.name);    
    callback(null, result);  
  }, 3000); 
};

//webpack.config.js
module: {    
  rules: [      
    {        
      test: /\.js$/,        
      use: [         
        path.resolve(__dirname, "./loader/replaceLoader.js"),      {            
          loader: path.resolve(__dirname, "./loader/replaceLoaderAsync.js"),
          options: {              
            name: "开课吧"            
          }          
        }        
      ]        
      // use: [path.resolve(__dirname, "./loader/replaceLoader.js")]      
    }    
  ] 
}
```

顺序：自下而上，自右到左

- 处理`loader`的路径问题

```
resolveLoader: {    
  modules: ["node_modules", "./loader"]  },  
  module: {    
    rules: [      
      {        
        test: /\.js$/,        
        use: [          
          "replaceLoader",          
          {            
            loader: "replaceLoaderAsync",            
            options: {              
              name: "开课吧"            
            }          
          }        
        ]        
        // use: [path.resolve(__dirname, "./loader/replaceLoader.js")]      
      }    
    ]  
  }
```

> 参考：loader API
> https://webpack.js.org/api/loaders

## 如何自己编写一个plugins
***
`Plugin`:开始打包，在某个时刻，帮助我们处理一些什么事情的机制

`plugin`要比`loader`稍微复杂一些，在`webpack`的源码中，用`plugin`的机制还是占有非常大的场景，可以说`plugin`是`webpack`的灵魂。

~~设计模式~~

~~事件驱动~~

~~发布订阅~~

`plugin`实际上就是一个类，里面包含一个`apply`函数，接受一个参数compiler

案例：

- 创建copyright-webpack-plugin.js

```
class CopyrightWebpackPlugin {  
  constructor() {  

  }
  //compiler：webpack实例  
  apply(compiler) {

  } 
} 

module.exports = CopyrightWebpackPlugin;
```

- 配置文件里使用

```
const CopyrightWebpackPlugin = require("./plugin/copyright-webpack-plugin");

plugins: [new CopyrightWebpackPlugin()]
```

- 如何传递参数

```
//webpack配置⽂文件 
plugins: [
  new CopyrightWebpackPlugin({
    name: "开课吧"
  })
]
//copyright-webpack-plugin.js 
class CopyrightWebpackPlugin {
  constructor(options) {
    //接受参数    
    console.log(options);
  }
  apply (compiler) {

  }
}
module.exports = CopyrightWebpackPlugin; 
```

- 配置plugin在什么时刻进行

```
class CopyrightWebpackPlugin {
  constructor(options) {
    // console.log(options);  
  }
  apply (compiler) {
    //hooks.emit 定义在某个时刻    
    compiler.hooks.emit.tapAsync(
      "CopyrightWebpackPlugin",
      (compilation, cb) => {
        compilation.assets["copyright.txt"] = {
          source: function () {
            return "hello copy";
          },
          size: function () {
            return 20;
          }
        };
        cb();
      }
    );
    //同步的写法    
    //compiler.hooks.compile.tap("CopyrightWebpackPlugin", compilation => {    
    //  console.log("开始了了");    
    //});  
  }
}

module.exports = CopyrightWebpackPlugin;
```

> 参考：compiler-hooks
> [https://webpack.js.org/api/compiler-hooks/](https://webpack.js.org/api/compiler-hooks/)

### node调试工具使用

- 修改scripts

```
"debug": "node --inspect --inspect-brk node_modules/webpack/bin/webpack.js"
```

## webpack打包原理分析
***
`webpack`在执行`npx webpack`进行打包后，都干了什么事情？

从启动构建到输出结果一系列过程：

（1）初始化参数：解析webpack配置参数，合并shell传入和webpack.config.js文件配置的参数，形成最后的配置结果。

（2）开始编译：上一步得到的参数初始化compiler对象，注册所有配置的插件，插件监听webpack构建生命周期的事件节点，做出相应的反应，执行对象的 run 方法开始执行编译。

（3）确定入口：从配置的entry入口，开始解析文件构建AST语法树，找出依赖，递归下去。

（4）编译模块：递归中根据文件类型和loader配置，调用所有配置的loader对文件进行转换，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理。

（5）完成模块编译并输出：递归完事后，得到每个文件结果，包含每个模块以及他们之间的依赖关系，根据entry配置生成代码块chunk。

（6）输出完成：输出所有的chunk到文件系统。

注意：在构建生命周期中有一系列插件在做合适的时机做合适事情，比如UglifyPlugin会在loader转换递归完对结果使用UglifyJs压缩覆盖之前的结果。

```
(function (modules) {
  var installedModules = {};

  function __webpack_require__ (moduleId) { 
    if (installedModules[moduleId]) { 
      return installedModules[moduleId].exports; 
    } 
    var module = (installedModules[moduleId] = { 
      i: moduleId, l: false, exports: {} 
    }); 
    modules[moduleId].call(
      module.exports, 
      module, 
      module.exports, 
      __webpack_require__
    ); 
    module.l = true; 
    return module.exports; 
  } 
  return __webpack_require__((__webpack_require__.s = "./index.js"));
})({
  "./index.js": function (module, exports) {
    eval('// import a from "./a";\n\nconsole.log("hello word");\n\n\n//# sourceURL=webpack:///./index.js?'
    );
  }
});
```

大概的意思就是，我们实现了一个**webpack_require**来实现自己的模块化，把代码都缓存在installedModules里，代码文件以对象传递进来，key是路径，value是包裹的代码字符串，并且代码内部的require，都被替换成了**webpack_require**。

## 自己实现一个bundle.js
***
- 模块分析：读取入口文件，分析代码

```
const fs = require("fs");

const fenximokuai = filename => {
  const content = fs.readFileSync(filename, "utf-8");
  console.log(content); 
};

fenximokuai("./index.js");
```

- 拿到文件中依赖，这里我们不推荐使用字符串截取，引入的模块名越多，就越麻烦，不灵活，这里我们推荐使用@babel/parser，这是babel7的工具，来帮助我们分析内部的语法，包括es6，返回一个AST抽象语法树。

@babel/parser:[https://babeljs.io/docs/en/babel-parser](https://babeljs.io/docs/en/babel-parser)

```
//安装@babel/parser
npm install @babel/parser --save
//bundle.js 
const fs = require("fs");
const parser = require("@babel/parser");

const fenximokuai = filename => {
  const content = fs.readFileSync(filename, "utf-8");

  const Ast = parser.parse(content, {
    sourceType: "module"
  });
  console.log(Ast.program.body);
};
fenximokuai("./index.js");
```

- 接下来我们就可以根据body里面的分析结果，遍历出所有的引入模块，但是比较麻烦，这里还是推荐babel推荐的一个模块@babel/traverse来帮我们处理。

```
const fs = require("fs"); 
const path = require("path"); 
const parser = require("@babel/parser"); 
const traverse = require("@babel/traverse").default;

const fenximokuai = filename => {  
  const content = fs.readFileSync(filename, "utf-8");

  const Ast = parser.parse(content, {    
    sourceType: "module"  
  });

  const dependencies = [];  //分析ast抽象语法树，根据需要返回对应数据，  //根据结果返回对应的模块，定义⼀一个数组，接受⼀一下node.source.value的值  
  traverse(Ast, {    
    ImportDeclaration({ node }) {      
      console.log(node);      
      dependencies.push(node.source.value);    
    }  
  });  
  console.log(dependencies); 
};
fenximokuai("./index.js");
```

![](https://upload-images.jianshu.io/upload_images/15424855-54975dddaeadebd5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

分析上图，我们要分析出信息：

- 入口文件
- 入口文件引入的模块
    - 引入路径
    - 在项目里的路径
- 可以在浏览器里执行的代码

处理现在的路径问题：

```
//需要⽤用到path模块 
const parser = require("@babel/parser");

//修改 dependencies 为对象，保存更更多的信息 
const dependencies = {};

//分析出引⼊入模块，在项⽬目中的路路径 
const newfilename =        
"./" + path.join(path.dirname(filename), node.source.value);
 
//保存在dependencies⾥里里 
dependencies[node.source.value] = newfilename;
```
把代码处理成浏览器可运行的代码，需要借助@babel/core和@babel/preset-env，把AST语法树转换成合适的代码

```
const babel = require("@babel/core");

const { code } = babel.transformFromAst(Ast, null, {    presets: ["@babel/preset-env"]  });
```

导出所有分析出的信息：

```
return {
    filename,
    dependencies,
    code
  };
```

完整代码参考：

```
const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const babel = require('@babel/core');
const moduleAnalyser = (filename) => {
  const content = fs.readFileSync(filename, 'utf-8');
  const ast = parser.parse(content, {
    sourceType: 'module'
  });
  const dependencies = {};
  traverse(ast, {
    ImportDeclaration ({ node }) {
      const dirname = path.dirname(filename);
      const newFile = './' + path.join(dirname, node.source.value);
      dependencies[node.source.value] = newFile;
    }
  });
  const { code } = babel.transformFromAst(ast, null, {
    presets: ["@babel/preset-env"]
  });
  return {
    filename,
    dependencies,
    code
  }
}
const moduleInfo = moduleAnalyser('./src/index.js');
console.log(moduleInfo);
```

- 分析依赖

上一步我们已经完成了一个模块的分析，接下来我们要完成项目里所有模块的分析：

```
const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const babel = require('@babel/core');
const moduleAnalyser = (filename) => {
  const content = fs.readFileSync(filename, 'utf-8');
  const ast = parser.parse(content, {
    sourceType: 'module'
  });
  const dependencies = {};
  traverse(ast, {
    ImportDeclaration ({ node }) {
      const dirname = path.dirname(filename);
      const newFile = './' + path.join(dirname, node.source.value);
      dependencies[node.source.value] = newFile;
    }
  });
  const { code } = babel.transformFromAst(ast, null, {
    presets: ["@babel/preset-env"]
  });
  return {
    filename,
    dependencies,
    code
  }
}
const makeDependenciesGraph = (entry) => {
  const entryModule = moduleAnalyser(entry);
  const graphArray = [entryModule];
  for (let i = 0; i < graphArray.length; i++) {
    const item = graphArray[i];
    const { dependencies } = item;
    if (dependencies) {
      for (let j in dependencies) {
        graphArray.push(
          moduleAnalyser(dependencies[j])
        );
      }
    }
  }
  const graph = {};
  graphArray.forEach(item => {
    graph[item.filename] = {
      dependencies: item.dependencies,
      code: item.code
    }
  });
  return graph;
}
const graghInfo = makeDependenciesGraph('./src/index.js'); console.log(graghInfo);
```

- 生成代码

```
const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const babel = require('@babel/core');
const moduleAnalyser = (filename) => {
  const content = fs.readFileSync(filename, 'utf-8');
  const ast = parser.parse(content, { sourceType: 'module' }); const dependencies = {};
  traverse(ast, {
    ImportDeclaration ({ node }) {
      const dirname = path.dirname(filename);
      const newFile = './' + path.join(dirname, node.source.value);
      dependencies[node.source.value] = newFile;
    }
  });
  const { code } = babel.transformFromAst(ast, null, {
    presets: ["@babel/preset-env"]
  });
  return { filename, dependencies, code }
}
const makeDependenciesGraph = (entry) => {
  const entryModule = moduleAnalyser(entry);
  const graphArray = [entryModule];
  for (let i = 0; i < graphArray.length; i++) {
    const item = graphArray[i];
    const { dependencies } = item;
    if (dependencies) {
      for (let j in dependencies) {
        graphArray.push(moduleAnalyser(dependencies[j]));
      }
    }
  }
  const graph = {};
  graphArray.forEach(item => {
    graph[item.filename] = { dependencies: item.dependencies, code: item.code }
  });
  return graph;
}
const generateCode = (entry) => {
  const graph = JSON.stringify(makeDependenciesGraph(entry)); return `    
  (function(graph){      
    function require(module) {         
      function localRequire(relativePath) {          
        return require(graph[module].dependencies[relativePath]); 
      }        
      var exports = {};        
      (function(require, exports, code){          
        eval(code)        
      })(localRequire, exports, graph[module].code);        
      return exports;      
    };      
    require('${entry}')    
  })(${graph});`;
}
const code = generateCode('./src/index.js'); console.log(code);
```