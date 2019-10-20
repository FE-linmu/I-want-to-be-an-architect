    import History from './utils/history';
    import router from './【Vue】Vue项目实战2/vue-mart/src/router';

    Vue.use(History);

    router.prototype.goBack=function(){
      this.isBack=true;
      this.back();
    };

    router.afterEach((to,from)=>{
      if(router.isBack){
        History.pop();
        router.isBack=false;
        router.transitionName='route-back';
      }else{
        History.push(to.path);
        router.transitionName='route-forward';
      }
    })