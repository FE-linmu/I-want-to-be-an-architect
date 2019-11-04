
# 引言
***
此篇文章主要涉及以下内容：
1. `react`核心`api`
2. 探究`setState`
3. 探究`diff`算法
# 学习资源
***
1. [react](https://github.com/facebook/react/blob/master/packages/react/src/React.js)
#react核心API
***
```
const React = {
     Children: {
      map,
      forEach,
      count,
      toArray,
      only,
    },
     createRef,
     Component,
     PureComponent,
     createContext,
     forwardRef,
     lazy,
     memo,
     useCallback,
     useContext,
     useEffect,
     useImperativeHandle,
     useDebugValue,
     useLayoutEffect,
     useMemo,
     useReducer,
     useRef,
     useState,
     Fragment: REACT_FRAGMENT_TYPE,
     StrictMode: REACT_STRICT_MODE_TYPE,
     Suspense: REACT_SUSPENSE_TYPE,
     createElement: __DEV__ ? createElementWithValidation : createElement,
     cloneElement: __DEV__ ? cloneElementWithValidation : cloneElement,
     createFactory: __DEV__ ? createFactoryWithValidation : createFactory,
     isValidElement: isValidElement,
     version: ReactVersion,
     unstable_ConcurrentMode: REACT_CONCURRENT_MODE_TYPE,
     unstable_Profiler: REACT_PROFILER_TYPE,
     __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: ReactSharedInternals,
    };
    // Note: some APIs are added with feature flags.
    // Make sure that stable builds for open source
    // don't modify the React object to avoid deopts.
    // Also let's not expose their names in stable builds.
    if (enableStableConcurrentModeAPIs) {
     React.ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
     React.Profiler = REACT_PROFILER_TYPE;
     React.unstable_ConcurrentMode = undefined;
     React.unstable_Profiler = undefined;
    }
    export default React;
```
核心精简后：
```
const React = {
  createElement,
  Component
}
```
[react-dom](https://github.com/facebook/react/blob/master/packages/react-dom/src/client/ReactDOM.js)主要是`render`逻辑
最核心的api:
- React.createElement：创建虚拟dom
- React.Component：实现自定义组件
- ReactDOM.render：渲染真实DOM
#JSX
***
JSX是对js的扩展，能带来更好的执行速度。
[在线尝试](https://reactjs.org/)
JSX预处理前：
![](https://upload-images.jianshu.io/upload_images/15424855-968fe7b7b9a69814.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
JSX预处理后：
![](https://upload-images.jianshu.io/upload_images/15424855-7c53f2ef95f1a497.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
使用自定义组件的情况 
```
function Comp(props) {
 return <h2>hi {props.name}</h2>;
}
const jsx = (
 <div id="demo">
  <span>hi</span>
  <Comp name="kaikeba" />
 </div>
);
console.log(jsx);
ReactDOM.render(jsx, document.querySelector("#root"));
```
build后
```
function Comp(props) {
 return React.createElement(
  "h2",
  null,
  "hi ",
  props.name
)
}
ReactDOM.render(React.createElement(
 "div",
{ id: "demo" },
 React.createElement("span", null, "hi"),
 React.createElement(Comp, { name: "kaikeba" })
), mountNode)
```
构建vdom用js对象形式来描述dom树结构一一对应
![](https://upload-images.jianshu.io/upload_images/15424855-fc41f59e0cbbb21c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
> 输出vdom观察其结构
# 实现三大接口：React.createElement,React.Component,ReactDom.render
***
## CreateElement
- 创建./src/kreact.js，它需要包含createElement方法
```
function createElement() {
  console.log(arguments)
}
export default {createElement}
```
- 修改index.js实际引入kcreate，测试
```
import React from "./kreact"
```
- 更新kcreate.js：为createElement添加参数并返回结果对象
```
function createElement(type, props,...children){
  // 父元素需要子元素返回结果，这里可以通过JSX编译后的代码得出结论
  props.children = children;
  return {type,props}
}
export default {createElement}
```
##render
- kreact-dom需要提供一个render函数，能够将vdom渲染出来，这里先打印vdom
```
function render(vnode, container){
  container.innerHTML = `<pre>${JSON.stringify(vnode,null,2)}</pre>`
}
export default {render}
```
页面效果
![](https://upload-images.jianshu.io/upload_images/15424855-d833877defd34b4c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
##创建kvdom.js：将createElement返回的结果对象转换为vdom
- 传递给createElement的组件有三种组件类型，使用type属性标识，并且抽离vdom相关代码到kvdom.js
1. dom组件
2. 函数式组件
3. class组件
```
// kvdom.js
export function createVNode(vtype, type, props) {
  let vnode = {
    vtype: vtype, // 用于区分函数组件、类组件、原生组件
    type: type,
    props: props
 }
  return vnode
}
```
- 添加Component类，kreact.js
```
export class Component {
  // 这个组件来区分是不是class组件
  static isClassComponent = true
  constructor(props){
    this.props = props
    this.state = {}
 }
}
```
> 浅层封装，setState现在只是一个占位符

- 添加类组件，index.js
```
import React, {Component} from "./kreact";
class Comp2 extends Component {
 render() {
  return (
   <div>
    <h2>hi {this.props.name}</h2>
   </div>
 )
}
}
```
- 判断组件类型，kreact.js
```
import { createVNode } from "./kvdom";
function createElement(type, props, ...children) {
 //...
 //判断组件类型
 let vtype;
 if (typeof type === "string") {
  // 原生标签
  vtype = 1;
}  else if (typeof type === "function") {
  if (type.isReactComponent) {
   // 类组件
   vtype = 2;
 } else {
   // 函数组件
   vtype = 3;
 }
}
 return createVNode(vtype, type, props);
}
```
- 转换vdom为真实dom
```

export function initVNode(vnode) {
     let { vtype } = vnode;
     if (!vtype) {
      // 没有vtype，是一个文本节点
      return document.createTextNode(vnode);
    }
     if (vtype === 1) {
      // 1是原生元素
      return createElement(vnode);
    } else if (vtype === 2) {
      // 2是类组件
      return createClassComp(vnode);
    } else if (vtype === 3) {
      // 3是函数组件
      return createFuncComp(vnode);
    }
    }
    // 创建原生元素
    function createElement(vnode) {
     const { type, props } = vnode;
     const node = document.createElement(type);
     // 过滤key，children等特殊props
     const { key, children, ...rest } = props;
     Object.keys(rest).forEach(k => {
      // 需要特殊处理的属性名：class和for
      if (k === "className") {
       node.setAttribute("class", rest[k]);
     } else if (k === "htmlFor") {
       node.setAttribute("for", rest[k]);
     } else {
       node.setAttribute(k, rest[k]);
     }
    });
     
     // 递归初始化子元素
     children.forEach(c => {
      // 子元素也是一个vnode，所以调用initVNode
      node.appendChild(initVNode(c));
    });
     return node;
    }
    // 创建函数组件
    function createFuncComp(vnode) {
     const { type, props } = vnode;
     // type是函数，它本身即是渲染函数，返回vdom
     const newNode = type(props);
     return initVNode(newNode);
    }
    // 创建类组件
    function createClassComp(vnode) {
     const { type } = vnode;
     // 创建类组件实例
     const component = new type(vnode.props);
     // 调用其render获得vdom
     const newNode = component.render();
     return initVNode(newNode);
    }
```
- 执行渲染，kreact-dom.js
```
import { initVNode } from "./kvdom";
function render(vnode, container) {
 const node = initVNode(vnode);
 container.appendChild(node);
 // container.innerHTML = `<pre>${JSON.stringify(vnode,null,2)}</pre>`
}
```
- 渲染vdom数组，index.js
```
class Comp2 extends Component {
 render() {
  const users=[{id:1,name:'tom'},{id:2,name:'jerry'}]
  return (
   <div>
    <h2>hi {this.props.name}</h2>
    <ul>
    {users.map(user=>(<li key={user.id}>{user.name}</li>))}
    </ul>
   </div>
 )
}
}
// 测试报错，因为kvdom中没有考虑到该情况
```
- 处理vdom数组，kvdom.js
```
children.forEach(c => {
  if (Array.isArray(c)) {// c是vdom数组的情况
   c.forEach(n => {
    node.appendChild(initVNode(n));
  });
 } else {
   node.appendChild(initVNode(c));
 }
});
```
##总结
1. webpack+babel编译时，替换JSX为React.createElement(type,props,...children)
2. 所有React.createElement()执行结束后得到一个JS对象，它能够完整描述dom结构，称之为vdom
3. ReactDOM.render(vdom,container)可以将vdom转换为dom并追加到container中，通过递归遍历vdom树，根据vtype不同，执行不同逻辑：vtype为1生成原生元素，为2则需要将类组件实例化并执行其render将返回vdom初始化，为3则将函数执行并将返回vdom初始化。
##PureComponent
继承Component，主要是设置了shouldComponentUpdate生命周期
```
import shallowEqual from './shallowEqual'
import Component from './Component'
export default function PureComponent(props, context) {
Component.call(this, props, context)
}
PureComponent.prototype = Object.create(Component.prototype)
PureComponent.prototype.constructor = PureComponent
PureComponent.prototype.isPureReactComponent = true
PureComponent.prototype.shouldComponentUpdate = shallowCompare
function shallowCompare(nextProps, nextState) {
return !shallowEqual(this.props, nextProps) ||
      !shallowEqual(this.state, nextState)
}
```
#setState
***
class组件的特点，就是拥有特殊状态并且可以通过setState更新状态，从而重新渲染视图，是学习react中最重要的api。
setState并没有直接操作去渲染，而是执行了一个异步的update队列，我们使用一个类来专门管理，./kkreact/Component.js
```
export let updateQueue = {
  updaters: [],
  isPending: false,
  add(updater) {
    _.addItem(this.updaters, updater);
  },
  batchUpdate() {
    if (this.isPending) {
      return;
    }
    this.isPending = true;
    /*
    each updater.update may add new updater to updateQueue
    clear them with a loop
    event bubbles from bottom-level to top-level
    reverse the updater order can merge some props and state and reduce the
    refresh times
    see Updater.update method below to know why
    */
    let { updaters } = this;
    let updater;
    while ((updater = updaters.pop())) {
      updater.updateComponent();
    }
    this.isPending = false;
  }
};
function Updater(instance) {
  this.instance = instance;
  this.pendingStates = [];
  this.pendingCallbacks = [];
  this.isPending = false;
  this.nextProps = this.nextContext = null;
  this.clearCallbacks = this.clearCallbacks.bind(this);
}
Updater.prototype = {
  emitUpdate(nextProps, nextContext) {
    this.nextProps = nextProps;
    this.nextContext = nextContext;
    // receive nextProps!! should update immediately
    nextProps || !updateQueue.isPending
      ? this.updateComponent()
      : updateQueue.add(this);
  },
  updateComponent() {
    let { instance, pendingStates, nextProps, nextContext } = this;
    if (nextProps || pendingStates.length > 0) {
      nextProps = nextProps || instance.props;
      nextContext = nextContext || instance.context;
      this.nextProps = this.nextContext = null;
      // merge the nextProps and nextState and update by one time
      shouldUpdate(
        instance,
        nextProps,
        this.getState(),
        nextContext,
        this.clearCallbacks
      );
    }
  },
  addState(nextState) {
    if (nextState) {
      _.addItem(this.pendingStates, nextState);
      if (!this.isPending) {
        this.emitUpdate();
      }
    }
  },
  replaceState(nextState) {
    let { pendingStates } = this;
    pendingStates.pop();
    // push special params to point out should replace state
    _.addItem(pendingStates, [nextState]);
  },
  getState() {
    let { instance, pendingStates } = this;
    let { state, props } = instance;
    if (pendingStates.length) {
      state = _.extend({}, state);
      pendingStates.forEach(nextState => {
        let isReplace = _.isArr(nextState);
        if (isReplace) {
          nextState = nextState[0];
        }
        if (_.isFn(nextState)) {
          nextState = nextState.call(instance, state, props);
        }
        // replace state
        if (isReplace) {
          state = _.extend({}, nextState);
        } else {
          _.extend(state, nextState);
        }
      });
      pendingStates.length = 0;
    }
    return state;
  },
  clearCallbacks() {
    let { pendingCallbacks, instance } = this;
    if (pendingCallbacks.length > 0) {
      this.pendingCallbacks = [];
      pendingCallbacks.forEach(callback => callback.call(instance));
    }
  },
  addCallback(callback) {
    if (_.isFn(callback)) {
      _.addItem(this.pendingCallbacks, callback);
    }
  }
};

```
#虚拟dom&&diff算法
***
常见问题：react virtual dom 是什么？说一下diff算法？
what?用JavaScript对象表示DOM信息和结构，当状态变更的时候，重新渲染这个JavaScript的对象结构，这个JavaScript对象称为virtual dom；
传统dom渲染流程
![](https://upload-images.jianshu.io/upload_images/15424855-2a5fce7fd6d5fc83.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
##diff算法
![](https://upload-images.jianshu.io/upload_images/15424855-a8573026aee46066.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
## diff策略
1. 同级比较，Web UI中DOM节点跨层级的移动操作特别少，可以忽略不计。
![](https://upload-images.jianshu.io/upload_images/15424855-bc17c031c060ba8c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![](https://upload-images.jianshu.io/upload_images/15424855-6a843a8a8f3e595a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
2. 拥有相同类的两个组件将会生成相似的树形结构，拥有不同类的两个组件将会生成不同的树形结构。
例如：div->p,CompA->CompB
3. 对于同一层级的一组子节点，通过唯一的key进行区分。

基于以上三个前提策略，React分别对tree diff、component diff以及element diff进行算法优化，事实也证明这三个前提策略是合理且准确的，它保证了整体界面构建的性能。
- **tree diff**
- **component diff**
- **element diff**
#element diff
***
**差异类型：**
1. **替换原来的节点**，例如把div换成了p，Comp1换成Comp2；
2. **移动、删除、新增子节点**，例如ul中的多个子节点li中出现了顺序互换；
3. 修改了节点的**属性**，例如节点类名发生了变化；
4.  对于**文本节点**，文本内容可能会改变。

重排（reorder）操作：
**INSERT_MARKUP（插入）、MOVE_EXISTING（移动）和REMOVE_NODE（删除）**。
- **INSERT_MARKUP**，新的component类型不在老集合里，即是全新的节点，需要对新节点执行插入操作。
- **MOVE_EXISTING**，在老集合有新component类型，且element是可更新的类型。

- **REMOVE_NODE**，老component类型，在新集合里也有，但对应的element不同则不能直接复用和更新，需要执行删除操作，或者老component不在新集合里的，也需要执行删除操作。
![](https://upload-images.jianshu.io/upload_images/15424855-74eca2ab92b1f4ba.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![](https://upload-images.jianshu.io/upload_images/15424855-535c34a608a32215.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![](https://upload-images.jianshu.io/upload_images/15424855-a6e4e8e30d81ba5b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
## ReactDom.render
```
function renderTreeIntoContainer(vnode, container, callback, parentContext) {
  if (!vnode.vtype) {
    throw new Error(`cannot render ${vnode} to container`);
  }
  if (!isValidContainer(container)) {
    throw new Error(`container ${container} is not a DOM element`);
  }
  let id = container[COMPONENT_ID] || (container[COMPONENT_ID] = _.getUid());
  let argsCache = pendingRendering[id];
  // component lify cycle method maybe call root rendering
  // should bundle them and render by only one time
  if (argsCache) {
    if (argsCache === true) {
      pendingRendering[id] = argsCache = { vnode, callback, parentContext };
    } else {
      argsCache.vnode = vnode;
      argsCache.parentContext = parentContext;
      argsCache.callback = argsCache.callback
        ? _.pipe(
            argsCache.callback,
            callback
          )
        : callback;
    }
    return;
  }
  pendingRendering[id] = true;
  let oldVnode = null;
  let rootNode = null;
  if ((oldVnode = vnodeStore[id])) {
    rootNode = compareTwoVnodes(
      oldVnode,
      vnode,
      container.firstChild,
      parentContext
    );
  } else {
    rootNode = initVnode(vnode, parentContext, container.namespaceURI);
    var childNode = null;
    while ((childNode = container.lastChild)) {
      container.removeChild(childNode);
    }
    container.appendChild(rootNode);
  }
  vnodeStore[id] = vnode;
  let isPending = updateQueue.isPending;
  updateQueue.isPending = true;
  clearPending();
  argsCache = pendingRendering[id];
  delete pendingRendering[id];
  let result = null;
  if (typeof argsCache === "object") {
    result = renderTreeIntoContainer(
      argsCache.vnode,
      container,
      argsCache.callback,
      argsCache.parentContext
    );
  } else if (vnode.vtype === VELEMENT) {
    result = rootNode;
  } else if (vnode.vtype === VCOMPONENT) {
    result = rootNode.cache[vnode.uid];
  }
  if (!isPending) {
    updateQueue.isPending = false;
    updateQueue.batchUpdate();
  }
  if (callback) {
    callback.call(result);
  }
  return result;
}
```
## redux
1. 为什么需要redux，他是什么
2. 解决了什么问题
3. 如何使用
4. 单向数据流
```
export function createStore(reducer, enhancer) {
  if (enhancer) {
    return enhancer(createStore)(reducer);
  }
  let currentState = {};
  let currentListeners = [];
  function getState() {
    return currentState;
  }
  function subscribe(listener) {
    currentListeners.push(listener);
  }
  function dispatch(action) {
    currentState = reducer(currentState, action);
    currentListeners.forEach(v => v());
    return action;
  }
  dispatch({ type: "@kaikeba/sheng" });
  return { getState, subscribe, dispatch };
}
export function applyMiddleware(...middlewares) {
  return createStore => (...args) => {
    const store = createStore(...args);
    let dispatch = store.dispatch;
    const midApi = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args)
    };
    const middlewareChain = middlewares.map(middleware => middleware(midApi));
    dispatch = compose(...middlewareChain)(store.dispatch);
    return {
      ...store,
      dispatch
    };
  };
}
export function compose(...funcs) {
  if (funcs.length == 0) {
    return arg => arg;
  }
  if (funcs.length == 1) {
    return funcs[0];
  }
  return funcs.reduce((ret, item) => (...args) => ret(item(...args)));
}
function bindActionCreator(creator, dispatch) {
  return (...args) => dispatch(creator(...args));
}
export function bindActionCreators(creators, dispatch) {
  return Object.keys(creators).reduce((ret, item) => {
    ret[item] = bindActionCreator(creators[item], dispatch);
    return ret;
  }, {});
}
```
##react-redux
```
import React from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "./woniu-redux";
export const connect = (
  mapStateToProps = state => state,
  mapDispatchToProps = {}
) => WrapComponent => {
  return class ConnectComponent extends React.Component {
    static contextTypes = {
      store: PropTypes.object
    };
    constructor(props, context) {
      super(props, context);
      this.state = {
        props: {}
      };
    }
    componentDidMount() {
      const { store } = this.context;
      store.subscribe(() => this.update());
      this.update();
    }
    update() {
      const { store } = this.context;
      const stateProps = mapStateToProps(store.getState());
      const dispatchProps = bindActionCreators(
        mapDispatchToProps,
        store.dispatch
      );
      this.setState({
        props: {
          ...this.state.props,
          ...stateProps,
          ...dispatchProps
        }
      });
    }
    render() {
      return <WrapComponent {...this.state.props}></WrapComponent>;
    }
  };
};
export class Provider extends React.Component {
  static childContextTypes = {
    store: PropTypes.object
  };
  getChildContext() {
    return { store: this.store };
  }
  constructor(props, context) {
    super(props, context);
    this.store = props.store;
  }
  render() {
    return this.props.children;
  }
}
```