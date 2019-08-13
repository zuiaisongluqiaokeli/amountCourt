<style lang="less">
@import "./common.less";
</style>
<template>
    <div class="SchedulingInfo">
        
        <div class="bookbuilding-table" style="position:relative">
            <Spin size="large" fix v-show="isLoading"></Spin>
            <Row >
                <Col span="24" class="noemalTb th-header">
                    庭审排期
                </Col>
            </Row>
            <div class="schTitle">
                <h3>本案第{{caseInfo.times ? caseInfo.times : 0}}次排期</h3>
            </div>
            <div class="contain">
                
                 <Row class="tabls">
                    <Col span="3" class="noemalTb tb-head">
                        开庭时间
                    </Col>
                    <Col span="9" class="noemalTb">
                        <span >{{ caseInfo.startDate | formatStartDate   }}</span>
                    </Col>
                    <Col span="3" class="noemalTb tb-head">
                        地点
                    </Col>
                    <Col span="9" class="noemalTb">
                        <span>{{ courtInfo.name ? courtInfo.name : "暂无" }}</span>
                    </Col>
                    <Col span="3" class="noemalTb tb-head">
                        审判庭室（场所）
                    </Col>
                    <Col span="9" class="noemalTb">
                        <span  v-show="!editState">{{ caseInfo.tribunal ? caseInfo.tribunal.name : "暂无" }}</span>
                    </Col>
                    <Col span="3" class="noemalTb tb-head">
                        法庭类型
                    </Col>
                    <Col span="9" class="noemalTb">
                        <span>{{ caseInfo.tribunal ? caseInfo.tribunal.tribunalType : "暂无" }}</span>
                    </Col>
                    <Col span="3" class="noemalTb tb-head">
                        审判长/审判员
                    </Col>
                    <Col span="9" class="noemalTb">
                        <span>{{ judgeInfo.name ? judgeInfo.name : "暂无" }}</span>
                    </Col>
                    <Col span="3" class="noemalTb tb-head">
                        书记员
                    </Col>
                    <Col span="9" class="noemalTb">
                        <span>{{ clerkInfo.name ? clerkInfo.name : "暂无" }}</span>
                    </Col>
                    <Col span="3" class="noemalTb tb-head">
                        是否已开庭
                    </Col>
                    <Col span="9" class="noemalTb">
                        <span>{{ caseInfo.isOpen ? '是' : '否' }}</span>
                    </Col>
                    <Col span="3" class="noemalTb tb-head">
                        确认状态
                    </Col>
                    <Col span="9" class="noemalTb">
                        <span>{{caseInfo.state  }}</span>
                    </Col>
                </Row>
            </div>
            <div class="button-clas">
                
                <!-- <Button size='large' @click="cancelEdit" style="background:#F54C4C;color:#fff" >取消编辑</Button> -->
            </div>
        </div>
    </div>
</template>
<script>
import {
  newlySchedulding,
} from "@/api/courtDate";
import { formatDate } from '@/libs/date'
export default {
    components: {
    },
    data(){
        return{
            caseInfo:{},
            caseNoList:[],
            tribunalId:"",
            tribunalList:[
                {
                    id:1,
                    name:"无"
                }
            ],
            courtInfo:{},
            judgeInfo:{},
            clerkInfo:{},
            isAddp:false,
            timeList:[],
            isLoading:false,
            buttunLoading:false,
            selectTime:false,
            saveTime:"",
            isOneTime:false,
            editState:false,
            datePickerOpen: false,
            disabledDateArr: [],
            caseId:"",
            dateOptions: {
                disabledDate: date => {
                let array = this.disabledDateArr;
                return (
                    (date && date.valueOf() < Date.now()) ||
                    (date && array.indexOf(new Date(date).getTime()) !== -1)
                );
                }
            },
        }
    },
    methods:{
        selectDate(){

        },
        selectTimeVal(val){

        },
        /**
         * 初始化数据
         */
        init(){
            this.caseId = this.$store.getters.caseId;
            this.isLoading = true;
            this.editState = false;
            this.isAddp = false;
            newlySchedulding(this.caseId).then(res => {
                 this.isLoading = false;
                 console.log(988)
                 if(res.data.state == 100){
                     if(res.data.data == null){
                         this.isOneTime = true;
                     }else{
                         this.isOneTime = false;
                     }
                     if(res.data.data){
                         this.caseInfo = res.data.data;
                         if(res.data.data.tribunal){
                             this.caseInfo.tribunalId = res.data.data.tribunal.id;
                         }
                     }
                     
                     
                     if(this.caseInfo){
                         if(this.caseInfo.state == 0){
                             this.caseInfo.state = '未确认'
                         }else if(this.caseInfo.state == 1){
                             this.caseInfo.state = '原告已确认'
                         }else if(this.caseInfo.state == 2){
                             this.caseInfo.state = '被告已确认'
                         }else{
                             this.caseInfo.state = '无'
                         }  
                     }
                 }else{
                     this.$Notice.warning({
                        title: '',
                        desc: res.data.message,
                        duration: 5
                    });
                 }
            })
        },
    },
    mounted() {
        this.init();
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

