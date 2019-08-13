<style lang="less">
@import "./courtDate.less";
</style>
<template>
<div class="courtDateInfo">
    <Row >
        <Col span="24" class="change-tab">
            <div @click="changeMenu('Scheduling')" id="Scheduling" class="selTab  tabOn">
                <span>排期</span>
            </div>
            <div @click="changeMenu('SchedulingRecord')" id="SchedulingRecord" class="selTab ">
                <span>排期记录</span>
            </div>
            <div @click="changeMenu('SchedulingTable')" id="SchedulingTable" class="selTab ">
                <span>排期-览表</span>
            </div>
        </Col>
    </Row>
    <div>
        <div v-show="showComponents == 'Scheduling'">
            <Scheduling />
        </div>
        <div v-show="showComponents == 'SchedulingRecord'">
            <SchedulingRecord ref="reCord"/>
        </div>
        <div v-show="showComponents == 'SchedulingTable'">
            <SchedulingTable  ref="tables"/>
        </div>
        
    </div>
</div>
</template>
<script>
import { formatDate } from '@/libs/date'
//排期
import Scheduling from "./components/Scheduling.vue";
// 排期记录
import SchedulingRecord from "./components/SchedulingRecord.vue";
// 排期-览表
import SchedulingTable from "./components/SchedulingTable.vue";
export default {
    components: {
        Scheduling,
        SchedulingRecord,
        SchedulingTable
    },
    data(){
        return{
            caseInfo:{

            },
            showComponents:'Scheduling',
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
            if(idName == 'SchedulingRecord'){
                this.$refs.reCord.init();
            }else if(idName == 'SchedulingTable'){
                this.$refs.tables.init();
            }
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
            // console.log(val)
        }
    }

}
</script>

