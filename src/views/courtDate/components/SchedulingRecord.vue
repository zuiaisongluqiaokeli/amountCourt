<style lang="less">
@import "./common.less";
</style>
<template>
    <div class="SchedulingInfo" style="position:relative">
        <Spin size="large" fix v-show="isLoading"></Spin>
        
        <div class="bookbuilding-table">
            <Row >
                <Col span="24" class="noemalTb th-header">
                    庭审排期纪录
                </Col>
            </Row>
            <div style="text-align:center;height:200px;padding:20px;" v-show="SchedulingList.length == 0">
                <h3>暂无记录</h3>
            </div>
            <div v-for="item in SchedulingList">
                <div class="schTitle">
                    <h3>本案第{{item.times}}次排期</h3>
                </div>
                <div class="contain">
                    <Row class="tabls">
                        <Col span="3" class="noemalTb tb-head">
                            开庭时间
                        </Col>
                        <Col span="9" class="noemalTb">
                            <span v-show="!editState">{{ item.startDate | formatStartDate }}</span>
                        </Col>
                        <Col span="3" class="noemalTb tb-head">
                            地点
                        </Col>
                        <Col span="9" class="noemalTb">
                            <span>{{ item.judge ? item.judge.court.name : "无" }}</span>
                        </Col>
                        <Col span="3" class="noemalTb tb-head">
                            审判庭室（场所）
                        </Col>
                        <Col span="9" class="noemalTb">
                            <span  v-show="!editState">{{ item.tribunal ? item.tribunal.name : "无" }}</span>
                        </Col>
                        <Col span="3" class="noemalTb tb-head">
                            法庭类型
                        </Col>
                        <Col span="9" class="noemalTb">
                            <span>{{ item.tribunal ? item.tribunal.tribunalType : "无" }}</span>
                        </Col>
                        <Col span="3" class="noemalTb tb-head">
                            审判长/审判员
                        </Col>
                        <Col span="9" class="noemalTb">
                            <span>{{ item.judge ? item.judge.name : "" }}</span>
                        </Col>
                        <Col span="3" class="noemalTb tb-head">
                            书记员
                        </Col>
                        <Col span="9" class="noemalTb">
                            <span>{{ item.clerk ? item.clerk.name  : '无'}}</span>
                        </Col>
                        <Col span="3" class="noemalTb tb-head">
                            是否已开庭
                        </Col>
                        <Col span="9" class="noemalTb">
                            <span>{{ item.isOpen ? '是' : '否' }}</span>
                        </Col>
                        <Col span="3" class="noemalTb tb-head">
                            确认状态
                        </Col>
                        <Col span="9" class="noemalTb">
                            <span>{{ item.state == 0 ? "未确认" : (
                                    item.state == 1 ? "原告已确认" : (
                                        item.state == 1 ? "被告已确认" : '暂无'
                                    )
                                ) }}</span>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { formatDate } from '@/libs/date'
import {
  holiday,
  getAllList,
} from "@/api/courtDate";
export default {
    data(){
        return{
            caseInfo:{
                time:''
            },
            editState:false,
            isLoading:false,
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
        init(){
            this.isLoading = true;
           getAllList(this.$store.getters.caseId).then(res => {
               this.isLoading = false;
               if(res.data.state == 100){
                   console.log(res.data.data.length)
                   if(res.data.data.length == 0){
                       this.SchedulingList = [];
                   }else{
                        this.SchedulingList = res.data.data.sort(this.listSet('times'));
                   }
                  
                    // this.SchedulingList = res.data.roleMenus.sort(util.compare('orderNumber'))
                    // this.listSet('times')
               }
           }) 
        },
        listSet(property){
            return function(a,b){
                var value1 = a[property];
                var value2 = b[property];
                return value2 - value1;
            }
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

