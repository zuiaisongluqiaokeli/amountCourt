<template>
 <div>

 </div>
</template>

<script>
 export default {
   components: {

   },
   data () {
     return {

     }
   },
   methods: {
        intoRtc(str){
            let refsLocal = window.location.host;
            let httpStr ='https://'+ refsLocal + '/'+ str
            window.open(httpStr);//新窗口打开
            this.$router.go(-1)//返回
        },
   },
   mounted() {
     switch (this.$route.name) {
      case "intoRtc_index":
        this.intoRtc("rtc")
      break;
      case "intoRtctj_index":
        this.intoRtc("rtctj")
      break;
     }
   },
 }
</script>

<style>

 
</style>
