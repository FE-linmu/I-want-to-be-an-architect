// 定义生成器函数
function* g() {
  yield "a";
  yield "b";
  yield "c";
  return "ending";
}
// 返回Generator对象
console.log(g()); // g {<suspended>}
console.log(g().toString()); // [object Generator]
