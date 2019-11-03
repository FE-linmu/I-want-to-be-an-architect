import dva from 'dva';
import createLoading from 'dva-loading';

const runtimeDva = window.g_plugins.mergeConfig('dva');
let app = dva({
  history: window.g_history,
  
  ...(runtimeDva.config || {}),
});

window.g_app = app;
app.use(createLoading());
(runtimeDva.plugins || []).forEach(plugin => {
  app.use(plugin);
});

app.model({ namespace: 'cart', ...(require('C:/Users/yt037/Desktop/kaikeba/projects/umi-test/src/models/cart.js').default) });
app.model({ namespace: 'user', ...(require('C:/Users/yt037/Desktop/kaikeba/projects/umi-test/src/models/user.js').default) });
app.model({ namespace: 'goods', ...(require('C:/Users/yt037/Desktop/kaikeba/projects/umi-test/src/pages/goods/models/goods.js').default) });
