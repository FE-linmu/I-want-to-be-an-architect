<template>
    <div>
        this is page A
    </div>
</template>

<script>
    export default {
        beforeRouteEnter (to, from, next) {
            // ...
            // console.log('before router enter')
            console.log(this,'enter');
            next()
        },
        beforeRouteUpdate(to, from, next){
            // console.log('before router update')
            console.log(this,'update');
            next()
        },
        beforeRouteLeave (to, from, next) {
            // ...
            // console.log('before router leave')
            console.log(this,'leave');
            next()
        }
    }
</script>

<style scoped>

</style>