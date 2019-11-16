const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'

function MyPromise(fn) {
  const that = this
  that.state = PENDING
  that.value = null
  that.resolvedCallbacks = []
  that.rejectedCallbacks = []

  function resolve(value) {
    // if (that.state === PENDING) {
    //   that.state = RESOLVED
    //   that.value = value
    //   that.resolvedCallbacks.map(cb => cb(that.value))
    // }
    if (value instanceof MyPromise) {
      return value.then(resolve, reject)
    }
    setTimeout(() => {
      if (that.state === PENDING) {
        that.state = RESOLVED
        that.value = value
        that.resolvedCallbacks.map(cb => cb(that.value))
      }
    }, 0)
  }

  function reject(value) {
    // if (that.state === PENDING) {
    //   that.state = REJECTED
    //   that.value = value
    //   that.rejectedCallbacks.map(cb => cb(that.value))
    // }
    setTimeout(() => {
      if (that.state === PENDING) {
        that.state = REJECTED
        that.value = value
        that.rejectedCallbacks.map(cb => cb(that.value))
      }
    }, 0)
  }
  try {
    fn(resolve, reject)
  } catch (e) {
    reject(e)
  }
}
MyPromise.prototype.then = function (onFulfilled, onRejected) {
  const that = this
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
  onRejected = typeof onRejected === 'function' ? onRejected : r => {
    throw r
  }
  if (that.state === PENDING) {
    // that.resolvedCallbacks.push(onFulfilled)
    // that.rejectedCallbacks.push(onRejected)
    return (promise2 = new MyPromise((resolve, reject) => {
      that.resolvedCallbacks.push(() => {
        try {
          const x = onFulfilled(that.value)
          resolutionProcedure(promise2, x, resolve, reject)
        } catch (r) {
          reject(r)
        }
      })
      that.rejectedCallbacks.push(() => {
        try {
          const x = onRejected(that.value)
          resolutionProcedure(promise2, x, resolve, reject)
        } catch (r) {
          reject(r)
        }
      })
    }))
  }
  if (that.state === RESOLVED) {
    // onFulfilled(that.value)
    return (promise2 = new MyPromise((resolve, reject) => {
      setTimeout(() => {
        try {
          const x = onFulfilled(that.value)
          resolutionProcedure(promise2, x, resolve, reject)
        } catch (r) {
          reject(r)
        }
      })
    }))
  }
  if (that.state === REJECTED) {
    // onRejected(that.value)
    return (promise2 = new MyPromise((resolve, reject) => {
      setTimeout(() => {
        try {
          const x = onRejected(that.value)
          resolutionProcedure(promise2, x, resolve, reject)
        } catch (r) {
          reject(r)
        }
      })
    }))
  }

  function resolutionProcedure(promise2, x, resolve, reject) {
    if (promise2 === x) {
      return reject(new TypeError('Error'))
    }
    if (x instanceof MyPromise) {
      x.then(function (value) {
        resolutionProcedure(promise2, value, resolve, reject)
      }, reject)
    }
    let called = false
    if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
      try {
        let then = x.then
        if (typeof then === 'function') {
          then.call(x, y => {
            if (called) return
            called = true
            resolutionProcedure(promise2, y, resolve, rejecct)
          }, e => {
            if (called) return
            called = true
            reject(e)
          })
        } else {
          resolve(x)
        }
      } catch (e) {
        if (called) return
        called = true
        reject(e)
      }
    } else {
      resolve(x)
    }
  }
}

const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'

function MyPromise(fn) {
  const that = this
  that.value = PENDING
  that.value = null
  that.resolvedCallbacks = []
  that.rejectedCallbacks = []

  function resolve(value) {
    if (that.state === PENDING) {
      that.state = RESOLVED
      that.value = value
      that.resolvedCallbacks.map(cb => cb(that.value))
    }
  }

  function reject(value) {
    if (that.state === PENDING) {
      that.state = REJECTED
      that.value = value
      that.rejectedCallbacks.map(cb => cb(that.value))
    }
  }
  try {
    fn(resolve, reject)
  } catch (e) {
    reject(e)
  }
}
MyPromise.prototype.then = function (onFulfilled, onRejected) {
  const that = this
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
  onRejected = typeof onRejected === 'function' ? onRejected : r => {
    throw r
  }
  if (that.state === PENDING) {
    that.resolvedCallbacks.push(onFulfilled)
    that.rejectedCallbacks.push(onRejected)
  }
  if (that.state === RESOLVED) {
    onFulfilled(that.value)
  }
  if (that.state === REJECTED) {
    onRejected(that.value)
  }
}