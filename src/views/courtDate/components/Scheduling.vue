<style lang="less" src="./common.less" scope>
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
                <h3>当前排期</h3>
            </div>
            <div class="contain">
                
                 <Row class="tabls">
                    <Col span="3" class="noemalTb tb-head">
                        开庭时间
                    </Col>
                    <Col span="9" class="noemalTb">
                        <span v-if="!editState && caseInfo.startDate">{{ caseInfo.startDate | formatStartDate }}</span>
                        <span v-if="caseInfo.startDate==null && !editState">未设置</span>
                        <div v-show="editState">
                            <dateTimeSelect :data='caseInfo' :judgeInfo='judgeInfo'  @saveEvent='changeDate' @changeState='changeState' ref="dates" style="width:360px;margin:0 auto"/>
                        </div>
                        
                        <!-- <DatePicker v-show="editState" placement="top-start" type="date" confirm :options="dateOptions" :open="datePickerOpen" transfer @on-change="selectDate" @on-ok="submitDate" @on-clear="clearDate" style="width: 98%;vertical-align:baseline;">
                            <a href="javascript:void(0)" @click="handleClick">
                            <Icon type="ios-calendar-outline"></Icon>
                            <template v-if="caseInfo.time === ''">选择时间</template>
                            <template v-else>{{ caseInfo.showTime }}</template>
                            </a>
                        </DatePicker>
                        <div class="ivu-select-dropdown time-wrapper" v-show="selectTime">
                            <ul>
                            <li v-for="(item, index) in timeList" :class="{ 'checked': item.isCheck, 'disable': !item.able }" @click="selectTimeVal(index)">{{ item.value }}</li>
                            </ul>
                        </div>
                        <div v-show="caseNoList.length != 0" class="ivu-select-dropdown time-wrapper"  style="width:200px;margin-left:165px">
                            <ul>
                            <li v-for="(item, index) in caseNoList" @click="detailM(item.id)">{{item.caseNo}}</li>
                            </ul>
                        </div> -->
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
                        <Select v-if="editState" transfer v-model="caseInfo.tribunalId" style="width:100%">
                            <Option v-for="(item) in tribunalList" :value="item.id">{{item.name}}</Option>
                        </Select>
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
                        <span>{{caseInfo.state}}</span>
                    </Col>
                </Row>
            </div>
            <div class="button-clas" v-if="allowRole.indexOf(this.$store.getters.roLeName)>-1">
                <Button size='large' @click="edit" :loading="buttunLoading" v-show="!isAddp" style="background:#2083D8;color:#fff;padding: 6px 31px;" >{{editState ? '保存排期' : (isOneTime ? '排期' : '修改排期') }}</Button>
                <Button size='large' @click="edit" :loading="buttunLoading" v-show="isAddp" style="background:#2083D8;color:#fff;padding: 6px 31px;" >保存排期</Button>
                <Button size='large' @click="cancel" v-show="editState" style="background:#F54C4C;color:#fff;padding: 6px 31px;" >取消</Button>
                <Button size='large' @click="addAdit" v-show="!isAddp && !editState && caseInfo.startDate"  style="background:#2083D8;color:#fff;padding: 6px 31px;" >重新排期</Button>
            </div>
        </div>
    </div>
</template>
<script>
import {
  newlySchedulding,
  modify,
  handArrangeConfirm,
  scheduldingInfo
} from "@/api/courtDate";
import {
  getTribunalList,
} from "@/api/global";
import { formatDate } from '@/libs/date'
import dateTimeSelect from "@/components/courtDate/dateTimeSelect2.vue";
import {
  holiday,
} from "@/api/courtDate";
export default {
    components: {
    dateTimeSelect
    },
    data(){
        return{
            caseInfo:{},
            caseNoList:[],
            allowRole:["法官","法官助理"],//允许排期操作的角色
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
            isCanSave:true,    //是否可以保存
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
        //改变状态是否可以保存
        changeState(num){
            if(num == 0){
                this.isCanSave = false;
            }else{
                this.isCanSave = true;
            }
            
        },
        edit(){
            
            if(this.editState == false){
                this.$refs.dates.changeShow();
                this.editState = true;
            }else{
                if(!this.isCanSave){
                    this.$Notice.warning({
                        title: '',
                        desc: '请选择排期时间段',
                        duration: 5
                    });
                    return false;
                }
                if(this.saveTime == ''){
                    this.$Notice.warning({
                        title: '',
                        desc: '请先排期选择时间',
                        duration: 5
                    });
                    return false;
                }
                this.buttunLoading = true;
                if(this.isOneTime || this.isAddp){
                    //首次排班/排庭
                    handArrangeConfirm(
                        this.caseId,
                        this.judgeInfo.id,
                        this.clerkInfo.id,
                        this.caseInfo.tribunalId,
                        this.saveTime.split(" ")[0],
                        this.caseInfo.dayTimes,
                    ).then(res => {
                        this.buttunLoading = false;
                        if(res.data.state == 100){
                            this.init();
                        }else{
                            this.$Notice.warning({
                                title: '',
                                desc: res.data.message,
                                duration: 5
                            });
                        }
                    })
                }else{
                    //修改排班
                    modify(
                        this.caseInfo.id,
                        this.caseInfo.tribunalId,
                        this.caseInfo.dayTimes,
                        this.saveTime.split(" ")[0],
                    ).then(res => {
                        this.buttunLoading = false;
                        if(res.data.state == 100){
                            this.init();
                        }else{
                            this.$Notice.warning({
                                title: '',
                                desc: res.data.message,
                                duration: 5
                            });
                        }
                    })
                }
                
            }
            
            
        },
        addAdit(){
            this.$refs.dates.changeShow();
            // this.isOneTime = true;
            this.isAddp = true;
            this.editState = true;
            
        },
        cancel(){
            this.$refs.dates.clearDate();
            this.editState = false;
            this.isAddp = false;
        },
        selectDate(){

        },
        submitDate() {
            this.datePickerOpen = false;
            this.addDatePickerOpen = false;
            this.selectTime = false;
            this.caseNoList = [];
            this.selectAddTime = false;
        },
        clearDate() {
            this.clear = true;
            this.selectTime = false;
            this.datePickerOpen = false;
            this.caseNoList = [];
            this.caseInfo.time = this.time;
        },
        handleClick(){
            this.disabledDateArr = [];
            let pushArr = [];
            this.datePickerOpen = !this.datePickerOpen;
            if (this.selectTime) {
                this.selectTime = false;
            }
            holiday(this.judgeId).then(res => {
                if (res.data.state == 100) {
                res.data.result.holidays.map((item, index) => {
                    pushArr.push(item.date);
                });
                res.data.result.judgeVacations.map((item, index) => {
                    let startDateHours = formatDate(
                    new Date(item.leaveStartDate),
                    "hh"
                    );
                    let endDateHours = formatDate(new Date(item.leaveCloseDate), "hh");
                    let startDate = formatDate(
                    new Date(item.leaveStartDate),
                    "yyyy-MM-dd"
                    );
                    let endDate = formatDate(
                    new Date(item.leaveCloseDate),
                    "yyyy-MM-dd"
                    );
                    let oneDay = 60 * 60 * 24 * 1000;
                    if (startDateHours == "08") {
                    pushArr.push(new Date(startDate).getTime() - 60 * 60 * 8 * 1000);
                    }
                    if (endDateHours == "17") {
                    pushArr.push(new Date(endDate).getTime() - 60 * 60 * 8 * 1000);
                    }
                    let stepDate = new Date(startDate).getTime() + oneDay;
                    while (stepDate < new Date(endDate).getTime()) {
                    pushArr.push(stepDate - 60 * 60 * 8 * 1000);
                    stepDate += oneDay;
                    }
                });
                this.disabledDateArr = pushArr;
                console.log(this.disabledDateArr);
                }
            });
        },
        selectTimeVal(val){

        },
        changeDate(times,data){
            console.log(times)
            this.saveTime = times;
            console.log(data)
            this.caseInfo = data;
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
                    //  this.$Notice.warning({
                    //     title: '',
                    //     desc: res.data.message,
                    //     duration: 5
                    // });
                 }
            })
            scheduldingInfo(this.caseId).then(res => {
                if(res.data.state == 100){
                    this.tribunalList = res.data.data.tribunals;
                    this.courtInfo=res.data.data.court ? res.data.data.court : {};
                    this.judgeInfo=res.data.data.judge ? res.data.data.judge : {};
                    this.clerkInfo=res.data.data.clerk ? res.data.data.clerk : {};
                }
            })
            // getTribunalList().then(res => {
            //     this.isLoading = false;
            //     if(res.data.state == 100){
            //         this.tribunalList = res.data.data;
            //     }
            // })
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

