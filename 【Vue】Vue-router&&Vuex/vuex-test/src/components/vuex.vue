<template>
    <div>

        <!-- 这是modules state -->
        {{$store.state.count.count}}
        {{$store.state.number.number}}


        <!-- 这是单份的 -->
        <button @click="increment">+</button>
        {{$store.state.count}}
        <button @click="decrement">-</button> 
    </div>
</template>

<script>
    // import {mapActions} from 'vuex'
    export default {
        // methods: mapActions([
        //     'increment',
        //     'decrement'      
        // ]),
        
        methods: {
            ...mapActions([
                'increment',
                'incrementBy' 
            ])
        },
    }
</script>

<style scoped>

</style>