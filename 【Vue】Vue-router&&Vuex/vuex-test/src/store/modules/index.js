import Vue from 'vue'
import Vuex from 'vuex'
import count from './a'
import number from './b'

Vue.use(Vuex)

export default new Vuex.Store({
    modules:{
        count,
        number 
    }
})