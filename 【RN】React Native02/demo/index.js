/**
 * @format
 */

import { AppRegistry } from "react-native";
import App from "./js/App";
import WebViewDemo from "./js/Pages/WebViewDemo";
import { name as appName } from "./app.json";

AppRegistry.registerComponent(appName, () => WebViewDemo);
