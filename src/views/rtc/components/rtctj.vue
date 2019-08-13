<style lang="less">
@import "./../rtc.less";
</style>
<template>
    <div class="diplomasRecordInfo">
        <!-- 原告 -->
        <div class="bookbuilding-table">
            <Row >
                <Col span="24" class="noemalTb th-header">
                    <span>调解状态信息</span>
                </Col>
            </Row>
            <div class="contain" >
               
            </div>
            <div class="button-clas">
                <Button size='large' @click="pro" style="background:#2083D8;color:#fff;padding: 6px 31px;font-size:16px;" >进入调解室</Button>
            </div>
        </div>
    </div>
</template>
<script>
import { formatDate } from '@/libs/date'
import {
  holiday,
} from "@/api/courtDate";
export default {
    data(){
        return{
            caseInfo:{
                time:''
            },
            editState:false,
            allCkeck:false,
            numList:[
                1,2
            ],
            diplist:[
                {
                    name:'传票'
                },
                {
                    name:'传票（存根）'
                },
            ],
            SchedulingList:[
                {
                    name:1
                },
                {
                    name:2
                },
            ]
        }
    },
    methods:{
        pro(){
            var protocolStr = document.location.protocol;
            let refsLocal = window.location.host;
            // let httpStr = 'https://courtfinancedev.ptnetwork001.com/rtc/?caseId=' + this.$store.getters.caseId;
            let httpStr ='https://'+  refsLocal + '/rtctj/?caseId=' + this.$store.getters.caseId;
            console.log(httpStr)
            window.open(httpStr)
        }
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
    },
}
</script>

