import { call, put, takeEvery } from "redux-saga/effects";

// 模拟登录
const UserService = {
  login(uname) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (uname === "Jerry") {
          resolve({ id: 1, name: "Jerry", age: 20 });
        } else {
          reject("用户名或密码错误");
        }
      }, 1000);
    });
  }
};

// worker Saga
function* login(action) {
  try {
    yield put({ type: "requestLogin" });
    const result = yield call(UserService.login, action.uname);
    yield put({ type: "loginSuccess", result });
  } catch (message) {
    yield put({ type: "loginFailure", message });
  }
}

function* mySaga() {
  // 提前拦截到action，takeEvery是中间件的作用，工作中会拆出来
  yield takeEvery("login", login);
}

export default mySaga;
