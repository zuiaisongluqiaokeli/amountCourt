<style lang="less">
@import "../common.less";
</style>
<template>
    <div class="tuoteInfo">
        <div class="bookbuilding-table">
            <Row >
                <Col span="24" class="noemalTb th-header">
                    <span>庭前会议笔录预览</span>
                </Col>
            </Row>
            <div class="contain">
                <Row class="tabls" style="margin-bottom:10px;">
                    <Col span="24" class="noemalTb tb-head">
                        一、当事人及代理人信息
                    </Col>
                    <Col span="24" class="noemalTb">
                        <Input v-model="value6" type="textarea" :rows="4" placeholder="Enter something..." />
                    </Col>
                </Row>

                <Row class="tabls" style="margin-bottom:10px;">
                    <Col span="24" class="noemalTb tb-head">
                        二、诉辩意见
                    </Col>
                    <Col span="24" class="noemalTb">
                        <Input v-model="value6" type="textarea" :rows="4" placeholder="Enter something..." />
                    </Col>
                </Row>

                <Row class="tabls" style="margin-bottom:10px;">
                    <Col span="24" class="noemalTb tb-head">
                        三、举证质证情况
                    </Col>
                    <Col span="24" class="noemalTb">
                        <Input v-model="value6" type="textarea" :rows="4" placeholder="Enter something..." />
                    </Col>
                </Row>
            </div>
            <div class="button-clas">
                <Button size='large' @click="pro" style="background:#2083D8;color:#fff;padding: 6px 31px;font-size:16px;" >编辑</Button>
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
            value6:'',
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

