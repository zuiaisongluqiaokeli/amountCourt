<style lang="less">
@import "./rtc.less";
</style>
<template>
<div class="courtDiplomasInfo">
    <Row >
        <Col span="24" class="change-tab">
            <div @click="changeMenu('rtcState')" id="rtcState" class="selTab  tabOn">
                <span>庭审状态</span>
            </div>
            <!-- <div @click="changeMenu('diplomasRecord')" id="diplomasRecord" class="selTab ">
                <span>预备开庭信息</span>
            </div>
            <div @click="changeMenu('diplomasRecord')" id="diplomasRecord" class="selTab ">
                <span>庭审历史记录</span>
            </div> -->
        </Col>
    </Row>
    <div v-show="showComponents == 'rtcState'">
        <rtcState />
    </div>
</div>
</template>
<script>
import { formatDate } from '@/libs/date'
//文书生成
import rtcState from "./components/rtcState.vue";

export default {
    components: {
        rtcState,
    },
    data(){
        return{
            caseInfo:{

            },
            showComponents:'rtcState',
            caseId:this.$store.getters.caseId,
        }
    },
    
    methods:{
        changeMenu(idName){
            let menuCard = document.getElementsByClassName("selTab");
            for(let i=0;i<menuCard.length;i++){
                menuCard[i].classList.remove('tabOn');
            }
            let addClassN = document.getElementById(idName);
            addClassN.classList.add('tabOn');
            this.showComponents = idName;
        },
    },
    filters: {
      formatDate(time) {
          if (time == '') {
              return '';
          }
          var date = new Date(time);
          return formatDate(date, 'yyyy-MM-dd');
      },
      formatStartDate(time) {
          if (time == '') {
              return '';
          }
          var date = new Date(time);
          return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    computed: {
        changeMemberTab() {
        return this.$store.getters.caseId;
        }
    },
    watch:{
        changeMemberTab(val) {
            console.log(val)
        }
    }

}
</script>

