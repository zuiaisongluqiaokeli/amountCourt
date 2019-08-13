<style lang="less">
@import "./../mycase.less";
</style>
<template>
<div class="witness">
    <Row >
        <Col span="24" class="change-tab">
            <div @click="changeMenu(0)" class="selTabs tabOn">
                <span>起诉状与答辩状</span>
            </div>
            <div @click="changeMenu(1)" class="selTabs">
                <span>举证</span>
            </div>
            <div @click="changeMenu(2)" class="selTabs">
                <span>质证</span>
            </div>
            <div @click="changeMenu(3)" class="selTabs">
                <span>争议焦点</span>
            </div>
            <div @click="changeMenu(4)" class="selTabs">
                <span>庭前会议笔录</span>
            </div>
        </Col>
    </Row>
    <div v-if='showNum === 0'>
        <indictment />
    </div>
</div>
</template>
<script>
import { formatDate } from '@/libs/date'
//起诉装与答辩状
import indictment from "./witnessComponens/indictment.vue";
export default {
    components: {
        indictment
    },
    data(){
        return{
            caseInfo:{

            },
            showNum:0,
        }
    },
    methods:{
        changeMenu(num){
            let menuCard = document.getElementsByClassName("selTabs");
            for(let i=0;i<menuCard.length;i++){
                menuCard[i].classList.remove('tabOn');
            }
            menuCard[num].classList.add('tabOn');
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
      whether(boole) {
          return boole ? '是' : '否';
      },
      filCheck(boole) {
          return boole == 0 ? '未确认' : '已确认';
      },
      formatStartDate(time) {
          if (time == '') {
              return '';
          }
          var date = new Date(time);
          return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
  }

}
</script>

