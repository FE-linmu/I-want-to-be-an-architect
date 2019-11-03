export const user = (
  state = { isLogin: false, loading: false, error: "" },
  action
) => {
  switch (action.type) {
    case "requestLogin":
      return { isLogin: false, loading: true, error: "" };
    case "loginSuccess":
      return { isLogin: true, loading: false, error: "" };
    case "loginFailure":
      return { isLogin: false, loading: false, error: action.message };
    default:
      return state;
  }
};
export function login(uname) {
  return { type: "login", uname };
}
// export function login() {
//   return dispatch => {
//     dispatch({ type: "requestLogin" });
//     setTimeout(() => {
//       dispatch({ type: "login" });
//     }, 2000);
//   };
// }
