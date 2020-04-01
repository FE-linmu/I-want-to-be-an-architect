function fibonacci (n) {
  if (n === 0) return 0
  if (n === 1) return 1
  var first = 0
  var second = 1
  var three = 0
  for (var i = 2; i <= n; i++) {
    console.log(first, second, three)
    three = first + second
    first = second
    second = three
  }
  return three
}

console.log(fibonacci(5))