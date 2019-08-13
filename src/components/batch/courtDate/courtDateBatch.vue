<style lang="less">
@import "./../batch.less";
</style>

<template>
<div>
    <div class="batchModel">
        <Row>
            <Form ref="searchForm" :model="searchForm" style="text-align:center" inline :label-width="80" class="search-form">
                <Form-item label="开庭地点">
                    <Select v-model="searchForm.mkk" clearable filterable placeholder="请选择" @on-change="selCourt" style="width: 185px">
                        <Option v-for="(item,index) in courtList" :value="item.id" :key="index">{{item.name}}</Option>
                    </Select>
                </Form-item>
                <Form-item label="审判庭室">
                   <Select v-model="tribunalId" clearable filterable placeholder="请选择"  @on-change="selJudge" style="width: 185px">
                        <Option v-for="(item,index) in tribunalList" :value="item.id" :key="index">{{item.name}}</Option>
                    </Select>
                </Form-item>
                <Form-item label="开庭时间" class='selr'>
                    <DatePicker placement="bottom-start" type="date" confirm :options="dateOptions" :open="datePickerOpen" transfer @on-change="selectDate" @on-ok="submitDate" @on-clear="clearDate" style="width: 200px;vertical-align:baseline;">
                        <a href="javascript:void(0)" @click="handleClick">
                        <Icon type="ios-calendar-outline"></Icon>
                        <template v-if="selTime1 === ''">选择时间</template>
                        <template v-else>{{ selTime }}</template>
                        </a>
                    </DatePicker>
                    <div class="ivu-select-dropdown time-wrapper" v-show="selectTime">
                        <ul>
                        <li v-for="(item, index) in timeList" :key="index" :class="{ 'checked': item.isCheck, 'disable': !item.able }" @click="selectTimeVal(index)">{{ item.value }}</li>
                        </ul>
                    </div>
                    <div v-show="caseNoList.length != 0" class="ivu-select-dropdown time-wrapper"  style="width:200px;margin-left:165px">
                        <ul>
                        <li v-for="(item, index) in caseNoList" :key="index" @click="detailM(item.id)">{{item.caseNo}}</li>
                        <!-- <li >暂无排期案件</li>                -->
                        </ul>
                    </div>
                </Form-item>
            </Form>
        </Row>
        <Alert type="warning" v-show="isError" show-icon closable>
            <span>成功案件个数：{{successNumber}}</span><br/>
            <span>失败案件个数：{{failedNumber}}</span><br/>
            <span>失败原因：{{reason}}</span>
        </Alert>

        <Alert type="warning" v-show="isWornning" show-icon >
            <span>失败原因：未选择庭审时间段</span><br/><br/>
            <span>失败案件：{{reason2}}</span>
        </Alert>
        <div  style="margin-bottom:25px">
            <Row class="tables">
                <Col span='24'>
                    <Table size="small" stripe :height="listData.length > 10 ? minHeight : ''" :loading="loading" border :columns="columns" :data="listData" ref="table" sortable="custom"  @on-selection-change="changeSelect"></Table>
                </Col>
            </Row >  
        </div>
        <div class='button-clas' style='text-align:center;'>
            <Button size='large' :loading="buttonLoading" @click="save" style="background:#2083D8;color:#fff;font-size:16px;width:128px;" >确认</Button>
            <Button size='large' @click="cancel" style="background:#F54C4C;color:#fff;padding: 6px 31px;font-size:16px;width:128px;" >取消</Button>
        </div>
        
    </div>
    <div class="noneShow" v-show="modal2" style="width:200px;position: fixed;top: 20px;z-index: 99999;left: 50%;margin-left: -100px;background: #fff;border-radius: 15px;">
        <div class="ivu-modal-header">
            <div class="ivu-modal-header-inner">单个案件排期</div>
        </div>
        <div class="ivu-modal-body">
            <dateTimeSelect :data='selRow' @saveEvent='changeList' @cancelEvent="closeModel2"/>
        </div>
    </div>
    <div class="noneShow" v-show="modal3" style="width:230px;position: fixed;top: 130px;z-index: 99999;left: 50%;margin-left: -100px;background: #fff;border-radius: 15px;">
        <div class="ivu-modal-header">
            <div class="ivu-modal-header-inner">单个案件选择开庭地点</div>
        </div>
        <div class="ivu-modal-body">
            <Select v-model="searchForm.mkks" transfer clearable filterable placeholder="请选择" @on-change="selCourt2" clearable style="width: 185px">
                <Option v-for="(item) in courtList" :value="item.id">{{item.name}}</Option>
            </Select>
        </div>
        <div class="ivu-modal-footer">
            <Button @click="modal3 = false;"  type="dashed" size="large">确认</Button>
        </div>
    </div>
    <div class="noneShow" v-show="modal4" style="width:230px;position: fixed;top: 130px;z-index: 99999;left: 50%;margin-left: -100px;background: #fff;border-radius: 15px;">
        <div class="ivu-modal-header">
            <div class="ivu-modal-header-inner">单个案件选择审判庭室</div>
        </div>
        <div class="ivu-modal-body">
            <Select v-model="tribunalIds" transfer clearable filterable placeholder="请选择"  @on-change="selJudge2" clearable style="width: 185px">
                <Option v-for="(item) in tribunalList2" :value="item.id" :key="item.id">{{item.name}}</Option>
            </Select>
        </div>
        <div class="ivu-modal-footer">
            <Button @click="modal4 = false;"  type="dashed" size="large">确认</Button>
        </div>
    </div>
</div>
</template>
<script>
import allColums from './../batch.js';
import {
  getBrief,
  courtList,
  getTribunalList,
  caseNoList
} from "@/api/global";
import {
  holiday,
  findDayTimes,
  batchScheduldingLawCaseList,
  batchTtibunalsList
} from "@/api/courtDate";
import dateTimeSelect from "@/components/courtDate/dateTimeSelect.vue";
import { formatDate } from "@/libs/date";
import Vue from 'vue';
export default {
    components: {
    dateTimeSelect
    },
    data(){
        return{
            searchForm:{},
            modal2:false,
            modal3:false,
            modal4:false,
            tribunalList2:[],
            dexSel:"",
            tribunalIds:"",
            isWornning:false,
            reason2:'',
            loading:false,
            buttonLoading:false,
            selTime:'',
            isError:false,
            successNumber:"",
            failedNumber:"",
            reason:"",
            selTime1:'',
            selectTime:false,
            tribunalId:'',
            cls:'noneShow',
            timeList:[],
            caseNoList:[],
            courtList:[],   //法院列表
            tribunalList:[],   //法庭列表
            listData:[],
            selRow:{},
            minHeight:450,
            dayTimes:'',
            dateOptions: {
                disabledDate: date => {
                    let array = this.disabledDateArr;
                    return (
                        // (date && date.valueOf() < Date.now()) ||
                        date && array.indexOf(new Date(date).getTime()) > -1
                    );
                }
            },
            disabledDateArr:[],
            datePickerOpen: false,
            columns:[
                {
                    title: '序号',
                    type: 'index',
                    width: 55,
                    align: 'center',
                },
                
                // {
                //     title: "网申号",
                //     key: "netApplicationNo",
                //     width: 160,
                //     align: 'center',
                // },
                {
                    title: "案号",
                    key: "caseNo",
                    width: 160,
                    align: 'center',
                },
                {
                    title: "案由",
                    key: "briefName",
                    width: 120,
                    align: 'center',
                },
                {
                    title: "原告",
                    key: "plaintiffName",
                    align: 'center',
                    // width: 120,
                },
                {
                    title: "被告",
                    key: "defendantName",
                    align: 'center',
                    // width: 120,
                },
                {
                    title: "承办法官",
                    key: "judgeName",
                    width: 120,
                    align: 'center',
                },
                {
                    title: "书记员",
                    key: "clerkName",
                    width: 120,
                    align: 'center',
                },
                {
                    title: "开庭时间",
                    key: "phone",
                    width: 170,
                    align: 'center',
                    render: (h, params) => {
                        let aUUI = [];
                        aUUI.push(
                            h('Icon',
                                {
                                    props:{
                                        type: 'ios-calendar-outline',
                                    },
                                    style:{
                                        display: this.listData[params.index].selTime ? 'none' : 'inline-block'
                                    }
                                }
                            ),
                            h('template',
                                {
                                
                                    style:{
                                        display:this.listData[params.index].selTime ? 'none' : 'inline-block',
                                        marginLeft:'3px'
                                    },
                                },
                               this.listData[params.index].selTime1 ? this.listData[params.index].selTime1 : "选择时间"
                            ),
                            h('template',
                                {
                                
                                    style:{
                                        display:this.listData[params.index].selTime ? 'inline-block' : 'none',
                                    }
                                },
                                this.listData[params.index].selTime ? this.listData[params.index].selTime : ""
                            ),
                        )
                        return h('div',[
                            h('DatePicker',
                                {
                                    props:{
                                        value: this.listData[params.index].selTime,
                                        dateOptions:this.dateOptions,
                                        clearable:'clearable',
                                        open:this.listData[params.index].isopen,
                                        type:"date",
                                        confirm:'confirm',
                                    },
                                    style:{
                                        textAlign:'center',
                                        width:'100%',
                                    },
                                    class:'courtTable',
                                    on: {
                                        'on-change':(value) => {
                                        },
                                        'on-ok':(value) => {

                                        },
                                        'on-clear':(value) => {

                                        },
                                    },
                                },
                                [
                                    h('a',
                                        {
                                            props:{
                                                href:'javascript:void(0)',
                                            },
                                            
                                            on: {
                                                click: () => {
                                                    console.log("88888888888",this.listData[params.index])
                                                    if(!this.listData[params.index].tribunalName || this.listData[params.index].tribunalName == ''){
                                                        this.$Notice.warning({
                                                            title: '',
                                                            desc: '请先选择审判庭室！',
                                                            duration: 5
                                                        });
                                                        return false;
                                                    }
                                                    this.modal2 = true;
                                                    this.selRow = this.listData[params.index];
                                                    
                                                    return false;
                                                }
                                            },
                                        },
                                        aUUI
                                    ),
                                    
                                ],
                            ),
                        ] 
                        
                        )
                    }
                },
                {
                    title: "开庭地点",
                    width: 145,
                    align: 'center',
                    render: (h, params) => {
                        return('div',[
                                h('span',
                                    {
                                        props:{
                                        },
                                        style:{
                                            color:'#2d8cf0',
                                            cursor:'pointer'
                                        },
                                        on: {
                                            click: () => {
                                                this.modal3 = true;
                                                this.selRow = this.listData[params.index];
                                                this.searchForm.mkks = this.selRow.courtId ? this.selRow.courtId : "";
                                                this.dexSel = params.index;
                                                console.log(this.selRow.courtId)
                                            }
                                        },
                                    },
                                   this.listData[params.index].courtName ? this.listData[params.index].courtName : "请选择"
                                ),
                            ]

                        )
                    }
                },
                {
                    title: "审判庭室",
                    width: 145,
                    align: 'center',
                    render: (h, params) => {
                        return('div',[
                                h('span',
                                    {
                                        props:{
                                        },
                                        style:{
                                            color:'#2d8cf0',
                                            cursor:'pointer'
                                        },
                                        on: {
                                            click: () => {
                                                console.log(this.listData[params.index]);
                                                if(!this.listData[params.index].courtId){
                                                    this.$Notice.warning({
                                                        title: '',
                                                        desc: '请先选择开庭地点',
                                                        duration: 5
                                                    });
                                                    return;
                                                }else{
                                                    this.modal4 = true;
                                                    this.dexSel = params.index;
                                                    this.selCourt2(this.listData[params.index].courtId)
                                                }

                                            }
                                        },
                                    },
                                   this.listData[params.index].tribunalName ? this.listData[params.index].tribunalName : "请选择"
                                ),
                            ]
                        )
                    }
                },
            ],
        }
    },
    props: {
      listData2:Array,
    },
    methods:{
        /**
         * 选择时间
         */
        selectDate(value){
            console.log(this.searchForm.mkk)
            let params = {
                batchSchedulding:true,
                date:new Date(value).getTime(),
                tribunalId:this.tribunalId,
                courtId:this.searchForm.mkk ? this.searchForm.mkk : "",
            }
            this.selTime = value;
            this.selTime1 = value;
            if(value == ""){
                return false
            }
            this.dayTimes = '';
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
            if(this.dayTimes == ''){
                this.$Notice.warning({
                    title: '',
                    desc: '未选择时间段！',
                    duration: 5
                });
                this.selTime1 = '';
                this.selTime = '';
            }
            this.datePickerOpen = false;
            console.log(this.dayTimes)
            this.selectTime = false;
            this.caseNoList = [];
            for(let i=0;i<this.listData.length;i++){
                this.listData[i].selTime = this.selTime;
                this.listData[i].dayTimes = this.dayTimes;
                Vue.set(this.listData, i, this.listData[i]);
            }
        },
        /**
         * 清除时间
         */
        clearDate() {
            this.datePickerOpen = false;
            this.selectTime = false;
            this.selTime = "";
            this.caseNoList = [];
            for(let i=0;i<this.listData.length;i++){
                this.listData[i].selTime = this.selTime;
                Vue.set(this.listData, i, this.listData[i]);
            }
        },
        handleClick(){
            if(this.tribunalId == ''){
                this.$Notice.warning({
                    title: '',
                    desc: '请先选择审判庭室！',
                    duration: 5
                });
                return false;
            }
            let pushArr = [];
            this.datePickerOpen = !this.datePickerOpen;
            if (this.selectTime) {
                this.selectTime = false;
            }
            holiday().then(res => {
                if (res.data.state == 100) {
                res.data.data.holidays.map((item, index) => {
                    pushArr.push(item.date);
                });
                res.data.data.judgeVacations.map((item, index) => {
                    let startDateHours = formatDate( new Date(item.leaveStartDate),"hh");
                    let endDateHours = formatDate(new Date(item.leaveCloseDate), "hh");
                    let startDate = formatDate(new Date(item.leaveStartDate),"yyyy-MM-dd");
                    let endDate = formatDate(new Date(item.leaveCloseDate),"yyyy-MM-dd");
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
        changeSelect(){

        },
        selectTimeVal(selectIndex){
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
            console.log(this.selTime)
        },
        detailM(id){

        },
        save(){
            if(this.listData.length < 1){
                this.$Notice.warning({
                    title: '',
                    desc: '您还未选择需要操作的案件',
                    duration: 5
                });
                return false;
            }
            let ary = [];
            this.isWornning = false;
            this.isError = false;
            let strings = '';

            this.listData.map(item => {
                let str = item.selTime.split(" ")[0];
                const data = {
                    lawCaseId:item.lawCaseId.toString(),  //案件id
                    dayTimes:item.dayTimes ? item.dayTimes.toString() : '',
                    tribunalId:item.tribunalId ? item.tribunalId.toString() : '',
                    startDate:str
                }
                
                if(!item.dayTimes || item.dayTimes == ''){
                    strings = strings + item.caseNo + "；"
                }
                console.log(strings)
                ary.push(data)
            })
            
            if(strings != ''){
                this.reason2 = strings;
                this.isWornning = true;
                return false;
            }
            console.log(ary)
            this.buttonLoading = true;
            batchScheduldingLawCaseList(ary).then(res => {
                this.buttonLoading = false;
                if(res.data.state == 100){
                    this.$Notice.success({
                        title: '',
                        desc: res.data.message,
                        duration: 3
                    });
                    this.$emit('cancelEvent',1);
                    //初始化本组件data数据
                    Object.assign(this.$data, this.$options.data.call(this));

                }else if(res.data.state == 104){
                    this.isError = true;
                    this.successNumber = res.data.data.success;
                    this.failedNumber = res.data.data.error;
                    this.reason = res.data.message;
                    let ary = [];
                    for(let i=0;i<this.listData.length;i++){
                        for(let j=0;j<res.data.data.errorIdList.length;j++){
                            if(res.data.data.errorIdList[j] == this.listData[i].id){
                                ary.push(this.listData[i])
                            }
                        }
                    }
                    this.listData = ary;
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
         * 单个案件选择开庭地点
         */
        selCourt2(id){
             batchTtibunalsList(id).then(res => {
                console.log(this.listData[this.dexSel])
                if(res.data.state == 100){
                    let that = this;
                    let ary = res.data.data;
                    this.listData[this.dexSel].courtId = id;
                    for(let u=0;u<this.courtList.length;u++){
                        if(this.courtList[u].id == id){
                            this.listData[this.dexSel].courtName = this.courtList[u].name;
                        }
                    }
                    this.listData[this.dexSel].tribunalList = res.data.data;
                    this.tribunalIds = this.listData[this.dexSel].tribunalId ? this.listData[this.dexSel].tribunalId : "";
                    this.tribunalList2 = this.listData[this.dexSel].tribunalList;
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
         * 选择开庭地点
         */
        selCourt(id){
            if(id){
                batchTtibunalsList(id).then(res => {
                    if(res.data.state == 100){
                        let that = this;
                        this.tribunalList = [];
                        this.tribunalId = "";
                        let ary = res.data.data;
                        ary.map(item => {
                            this.tribunalList.push(item)
                        })                     
                        console.log(res.data.data)
                        this.tribunalId = '';
                        this.tribunalList = JSON.parse(JSON.stringify(this.tribunalList));
                        for(let i=0;i<this.listData.length;i++){
                                this.listData[i].courtId = id;
                                for(let u=0;u<this.courtList.length;u++){
                                    if(this.courtList[u].id == id){
                                        this.listData[i].tribunalName = "";
                                        this.listData[i].tribunalId = "";
                                        this.listData[i].courtName = this.courtList[u].name;
                                    }
                                }
                                this.listData[i].tribunalList = this.tribunalList;
                                // Vue.set(this.listData, i, this.listData[i]);
                            }
                        this.listData = JSON.parse(JSON.stringify(this.listData));
                        
                    }else{
                        this.$Notice.warning({
                            title: '',
                            desc: res.data.message,
                            duration: 5
                        });
                    }
                })
            }
        },
        /**
         * 单个案件选择承办法庭
         */
        selJudge2(id){
            this.listData[this.dexSel].tribunalId = id;
            for(let u=0;u<this.tribunalList2.length;u++){
                if(this.tribunalList2[u].id == id){
                    this.listData[this.dexSel].tribunalName = this.tribunalList2[u].name;
                }
            }
            Vue.set(this.listData, this.dexSel, this.listData[this.dexSel]);
        },
        /**
         * 选择承办法庭
         */
        selJudge(id){
            
            for(let i=0;i<this.listData.length;i++){
                this.listData[i].tribunalId = id;
                for(let u=0;u<this.tribunalList.length;u++){
                    if(this.tribunalList[u].id == id){
                        this.listData[i].tribunalName = this.tribunalList[u].name;
                    }
                }
            }
            this.listData = JSON.parse(JSON.stringify(this.listData));
        },
        getList(){
            
            this.listData = this.listData2;
            this.buttonLoading = false;
            this.tribunalId= '';
            courtList().then(res => {
                if(res.data.state == 100){
                    this.courtList = res.data.data;
                }
            })
            // getTribunalList().then(res =>{
            //     if(res.data.state == 100){
            //         this.tribunalList = res.data.data;
            //     }
            // })
        },
        cancel(){
            this.datePickerOpen = false;
            this.selectTime = false;
            this.$emit('cancelEvent');
        },
        closeModel2(){
            this.modal2 = false;
        },
        changeList(data,ary){
            console.log(ary)
            for(let i=0;i<this.listData.length;i++){
                if(this.listData[i].id == ary.id){
                    this.listData[i].selTime = data;
                    Vue.set(this.listData, i, this.listData[i]);
                }
            }
            this.modal2 = false;
        }
    },
    filters: {
    formatDate(time) {
      if (time == "") {
        return "";
      }
      try {
        var date = new Date(time.replace(/-/g, "/"));
      } catch (e) {
        var date = new Date(time);
      }
      return formatDate(date, "yyyy-MM-dd");
    },
    
  }

}
</script>

