<style lang="less">
.time-wrapper {
        width: 150px;
        left: 220px;
        top: 26px;
        li {
          padding-left: 10px;
          cursor: pointer;
        }
        li:hover {
          color: #40a9ff;
        }
        li.checked {
          color: #fff;
          background-color: #40a9ff;
        }
        li.disable {
          color: #aaa;
          cursor: not-allowed;
        }
}
</style>
<template>
    <div style="text-align:center;position: relative;">
        <DatePicker :placement=" isOne ? 'bottom-start' : 'top-start'" type="date" confirm :options="dateOptions" :open="datePickerOpen" transfer @on-change="selectDate" @on-ok="submitDate" @on-clear="clearDate" style="vertical-align:baseline;">
            <a href="javascript:void(0)" @click="handleClick">
            <Icon type="ios-calendar-outline"></Icon>
            <template v-if="selTime1 === ''">选择时间</template>
            <template v-else>{{ selTime }}</template>
            </a>
        </DatePicker>
        <div class="ivu-select-dropdown time-wrapper" style="left:333px;top:-156px" v-show="selectTime">
            <ul>
            <li v-for="(item, index) in timeList" style="height:40px;cursor: pointer;" :class="{ 'checked': item.isCheck, 'disable': !item.able }" @click="selectTimeVal(index)">{{ item.value }}</li>
            </ul>
        </div>
        <div v-show="caseNoList.length != 0" class="ivu-select-dropdown time-wrapper"  style="width:200px;margin-left:165px">
            <ul>
            <li v-for="(item, index) in caseNoList" @click="detailM(item.id)">{{item.caseNo}}</li>
            <!-- <li >暂无排期案件</li>                -->
            </ul>
        </div>
        <div class='button-clas' style='text-align:center;margin-top:20px' v-show="isOne">
            <Button size='large'  @click="save" style="background:#2083D8;color:#fff;font-size:16px;width:128px;margin-right:0px;margin-bottom:5px;" >选择完毕</Button>
            <Button size='large' @click="cancel" style="background:#F54C4C;color:#fff;padding: 6px 31px;font-size:16px;width:128px;margin-right:0px" >取消</Button>
        </div>
    </div>
</template>
<script>
import {
  holiday,
  findDayTimes
} from "@/api/courtDate";
import { formatDate } from '@/libs/date';
export default {
    data(){
        return{
            dateOptions: {
                disabledDate: date => {
                let array = this.disabledDateArr;
                return (
                    (date && date.valueOf() < Date.now()) ||
                    (date && array.indexOf(new Date(date).getTime()) !== -1)
                );
                }
            },
            datePickerOpen: false,
            selectTime:false,
            caseNoList:[],
            timeList:[],
            dayTimes:"",
            isOne:true,
            selTime:'',
            selTime1:'',
            isClickTimeList:false,  //是否选择时间段
        }
    },
    props: {
      data:Object,
      judgeInfo:Object
    },
    methods:{
        changeShow(){
            console.log(this.data)
            this.isOne = false;
            if(this.data.startDate){
                this.selTime = formatDate(new Date(this.data.startDate), 'yyyy-MM-dd hh:mm');
                this.selTime1 = formatDate(new Date(this.data.startDate), 'yyyy-MM-dd hh:mm');
            }
            this.$emit('saveEvent',this.selTime,this.data);
        },
        handleClick(){
            if(!this.data.tribunalId){
                this.$Notice.warning({
                    title: '',
                    desc: '请先选择审判庭室',
                    duration: 5
                });
                return false;
            }
            this.disabledDateArr = [];
            let pushArr = [];
            this.datePickerOpen = !this.datePickerOpen;
            if (this.selectTime) {
                this.selectTime = false;
            }
            holiday(this.judgeId).then(res => {
                if (res.data.state == 100) {
                res.data.data.holidays.map((item, index) => {
                    pushArr.push(item.date);
                });
                res.data.data.judgeVacations.map((item, index) => {
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
                // console.log(this.disabledDateArr);
                }
            });
        },
        /**
         * 选择时间
         */
        selectDate(value){
            if(value == ''){
                return false;
            }
            
            value = value + " 00:00:00";
            console.log(new Date(value))
            let params = {
                batchSchedulding:false,
                date:new Date(value).getTime(),
                tribunalId:this.data.tribunalId,
                judgeId:this.judgeInfo.id,
            }
            if(this.selTime == ''){
                this.selTime = value;
            }
            this.selTime1 = value;
            this.isClickTimeList = false;
            findDayTimes(params).then(res => {
                if (res.data.state==100) {
                    this.selectTime = true;
                    this.timeList=res.data.data.map(val => {
                        let json = {};
                        json.value = val.startTime
                        json.able = true;
                        json.isCheck = false;
                        json.dayTimes = val.dayTime;
                        return json;
                    });
                    console.log(this.timeList)

                }else{
                    this.$Notice.warning({
                        title: '',
                        desc: res.data.message,
                        duration: 5
                    });
                }
            })
        },
        /**
         * 提交时间
         */
        submitDate() {
            if(!this.isClickTimeList){
                this.$Notice.warning({
                    title: '',
                    desc: '未选择时间段！',
                    duration: 5
                });
                this.selTime = formatDate(new Date(this.data.startDate), 'yyyy-MM-dd hh:mm');
            }
            this.datePickerOpen = false;
            this.selectTime = false;
            this.caseNoList = [];
            this.data.dayTimes = this.dayTimes;
            this.$emit('saveEvent',this.selTime,this.data);
            if(!this.isOne){
                this.$emit('changeState',1);
            }
        },
        /**
         * 清除时间
         */
        clearDate() {
            // this.clear = true;
            this.datePickerOpen = false;
            this.selectTime = false;
            this.isClickTimeList = false;
            this.selTime = "";
            this.selTime1 = '';
            this.caseNoList = [];
            if(!this.isOne){
                this.$emit('changeState',0);
            }
        },
        selectTimeVal(selectIndex){
            this.isClickTimeList = true;
            if (this.timeList[selectIndex].able){
                this.timeList.map((item, index) => {
                    if (selectIndex == index) {
                        item.isCheck = true;
                        let selectTimer = item.value;
                        this.dayTimes = item.dayTimes;
                        this.selTime1 =
                        this.selTime1.split(" ")[0] +
                        " " +
                        selectTimer.split("、")[0];
                        this.selTime =
                        this.selTime1.split(" ")[0] + " " + selectTimer;
                        // this.dayTimes = index + 1;
                    } else {
                        item.isCheck = false;
                    }
                });
            }
        },
        detailM(){

        },
        save(){
            if(this.selTime == ''){
                this.$Notice.warning({
                    title: '',
                    desc: '请先选择排期时间！',
                    duration: 5
                });
                return false;
            }
            console.log(this.isClickTimeList)
            if(!this.isClickTimeList){
                this.$Notice.warning({
                    title: '',
                    desc: '未选择时间段！',
                    duration: 5
                });
            }
            this.$emit('saveEvent',this.selTime,this.data);
            
        },
        cancel(){
            this.$emit('cancelEvent');
        },

    }
}
</script>



