<template>
 <div>
    <batchCase ref="batchCase" />
 </div>
</template>

<script>
import batchCase from "./components/batchCase.vue";
 export default {
   components: {
       batchCase
   },
   data () {
     return {

     }
   },
   mounted() {
      this.$refs.batchCase.getRoleList();
   },
 }
</script>

<style>
</style>
