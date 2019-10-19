<template>
    <div>
        this is page B
        {{id}}

        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        props:['id'],
        mounted(){
            
            console.log(this.id)
        }
    }
</script>

<style scoped>

</style>