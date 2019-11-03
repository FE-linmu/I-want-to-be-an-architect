function* g() {
  yield "a";
  yield "b";
  yield "c";
  return "ending";
}

var gen = g();
// console.log(gen.next()); // {value: "a", done: false}
// console.log(gen.next()); // {value: "b", done: false}
// console.log(gen.next()); // {value: "c", done: false}
// console.log(gen.next()); // {value: "ending", done: true}

function next() {
  let { value, done } = gen.next();
  console.log(value); // 依次打印输出 a b c end
  if (!done) next(); // 直到全部完成
}
next();
