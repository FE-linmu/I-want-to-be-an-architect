import {
  createAppContainer,
  createStackNavigator,
  createSwitchNavigator
} from "react-navigation";
import LoginPage from "../Pages/LoginPage";
import WelcomePage from "../Pages/WelcomePage";
import HomePage from "../Pages/HomePage";
import DetailPage from "../Pages/DetailPage";

import { connect } from "react-redux";
import {
  createReactNavigationReduxMiddleware,
  createReduxContainer
} from "react-navigation-redux-helpers";

export const rootCom = "Init"; //设置根路由

let Init = createStackNavigator({
  WelcomePage: {
    screen: WelcomePage
  }
});

let Auth = createStackNavigator({
  LoginPage: {
    screen: LoginPage
  }
});

let Main = createStackNavigator({
  HomePage: {
    screen: HomePage
  },
  DetailPage: {
    screen: DetailPage
  }
});

const AppNavigator = createSwitchNavigator({
  Init: Init,
  Main: Main,
  Auth: Auth
});

export const RootNavigator = createAppContainer(AppNavigator);

const AppWithNavigationState = createReduxContainer(RootNavigator, "root");

export const middleware = createReactNavigationReduxMiddleware(
  state => state.nav,
  "root"
);

const mapStateToProps = state => {
  return {
    state: state.nav
  };
};

export default connect(mapStateToProps)(AppWithNavigationState);
