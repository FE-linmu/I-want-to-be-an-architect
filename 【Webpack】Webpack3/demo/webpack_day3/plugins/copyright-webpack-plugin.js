class CopyrightWebpackPlugin {
  //compiler：webpack实例,包含配置信息
  apply(compiler) {
    compiler.hooks.compile.tap("CopyrightWebpackPlugin", compilation => {
      console.log("开始！");
    });
    compiler.hooks.emit.tapAsync(
      "CopyrightWebpackPlugin",
      (compilation, cb) => {
        compilation.assets["test.txt"] = {
          source: () => {
            return "hello txt";
          },
          size: () => {
            return 1024;
          }
        };
        cb();
      }
    );
  }
}
module.exports = CopyrightWebpackPlugin;
