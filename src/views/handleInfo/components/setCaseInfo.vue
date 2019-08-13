<style lang="less">
@import "./../handleInfo.less";
.transfer{
    .source,.destination{
        height: 300px;
        overflow-y: auto;
        border-left: 1px solid #2083D8;
        border-right: 1px solid #2083D8;
        border-bottom: 1px solid #2083D8;
    }
    .source .gridDiv{
        border: 1px solid #2083D8;
        width: 98%;
        line-height: 30px;
        text-align: center;
        border-radius: 3px;
        margin: 1%;
        // float: left;
        background-color: #fff;
        cursor: pointer;
        &.active{
            background-color: #2083D8;
            color: #fff;
        }
    }
    .destination .gridDiv{
        width: 98%;
        border: 1px solid #2083D8;
        line-height: 30px;
        text-align: center;
        border-radius: 3px;
        margin: 1%;
        // float: left;
        background-color: #fff;
        cursor: pointer;
        &.active{
            background-color: #2083D8;
            color: #fff;
        }
    }
    .tabSpan{
        line-height: 40px;
        color: #2083D8;
        border: 1px solid #2083D8;
        span{
            width: 50%;
            display: inline-block;
            text-align: center;
            cursor: pointer;
            &.tabed{
                background-color: #2083D8;
                color: #fff;
            }
        }
    }
    .btns{
        .btn{
            display: block;
            margin: 20px auto;
            width: 110px;
        }
    }
}
</style>
<template>
<div class="courtcaseInfo" style="position:relative">
    <Spin size="large" fix v-show="isLoading"></Spin>
    <div class="bookbuilding-table">
        <Row >
            <Col span="24" class="noemalTb th-header">
                立案信息表
            </Col>
        </Row>
        <Row >
            <Col span="2" class="noemalTb tb-head">
                网申号
            </Col>
            <Col span="4" class="noemalTb">
                <span>{{ caseInfo.netApplicationNo ? caseInfo.netApplicationNo : '无'}}</span>
            </Col>
            <Col span="2" class="noemalTb tb-head">
                网申时间
            </Col>
            <Col span="4" class="noemalTb">
                <span>{{ caseInfo.receiceDate | formatDate }}</span>
            </Col>
            <Col span="2" class="noemalTb tb-head">
                标的（元）
            </Col>
            <Col span="4" class="noemalTb">
                <span>{{ caseInfo.applyStandard ? caseInfo.applyStandard : '无'}}</span>
            </Col>
            <Col span="2" class="noemalTb tb-head">
                立案案由
            </Col>
            <Col span="4" class="noemalTb">
                <span v-show="!editState">{{ caseInfo.brief ? caseInfo.brief.name : '无'}}</span>
                <Select v-if="editState" filterable clearable transfer v-model="selBrief" style="width:100%">
                    <Option :value="briefItem.id" v-for="(briefItem,index) in briefList" :key="index" >
                        <span>{{briefItem.name}}</span>
                    </Option>
                </Select>
            </Col>
            <Col span="2" class="noemalTb tb-head">
                案件摘要
            </Col>
            <Col span="22" class="noemalTb">
                <span>{{ caseInfo.digest ? caseInfo.digest : '无'}}</span>
            </Col>
            <Col span="2" class="noemalTb tb-head">
                审核意见
            </Col>
            <Col span="22" class="noemalTb">
                <span>{{ caseInfo.lawCaseExamines ? caseInfo.lawCaseExamines : '无'}}</span>
            </Col>
        </Row>
        <Row >
            <Col span="2" class="noemalTb tb-head">
                案号
            </Col>
            <Col span="4" class="noemalTb">
                <span>{{ caseInfo.caseNo ? caseInfo.caseNo : '无'}}</span>
            </Col>
            <Col span="2" class="noemalTb tb-head">
                适用程序
            </Col>
            <Col span="4" class="noemalTb">
                <span v-show="!editState">{{ caseInfo.procedureType ? caseInfo.procedureType : '无'}}</span>
                <Select v-if="editState" filterable clearable transfer v-model="procedureType" style="width:100%">
                    <Option value="简易程序" label="简易程序">
                        <span>简易程序</span>
                    </Option>
                    <Option value="普通程序" label="普通程序">
                        <span>普通程序</span>
                    </Option>
                </Select>
            </Col>
            <Col span="2" class="noemalTb tb-head">
                立案日期
            </Col>
            <Col span="4" class="noemalTb">
                <span>{{ caseInfo.filingDate | formatDate}}</span>
            </Col>
            <Col span="2" class="noemalTb tb-head">
                审限届满
            </Col>
            <Col span="4" class="noemalTb">
                <span v-show="!editState">{{ caseInfo.endTrialDate | formatDate}}</span>
                <span v-if="editState">
                    <DatePicker
                        :open="open"
                        :value="endTrialDate"
                        @on-change="handleChange"
                        type="date">
                        <a href="javascript:void(0)">
                            <!-- <Icon type="ios-calendar-outline"></Icon> -->
                            <template v-if="endTrialDate === ''">请选时间</template>
                            <template v-else>{{ endTrialDate| formatDate}}</template>
                        </a>
                    </DatePicker>
                    <Button @click="changeDate" style="float: right;margin-top: 2px;" shape="circle">审限改期</Button>
                </span>
            </Col>
        </Row>
        <Row >
            <Col span="2" class="noemalTb tb-head">
                承办部门
            </Col>
            <Col span="4" class="noemalTb">
                <span v-show="!editState">{{ caseInfo.court ? caseInfo.court.name : '无'}}</span>
                <Select v-if="editState" filterable clearable transfer v-model="selCourt" style="width:100%">
                    <Option :value="courtItem.id" v-for="(courtItem,index) in courtList" :key="index" >
                        <span>{{courtItem.name}}</span>
                    </Option>
                </Select>
            </Col>
            <Col span="2" class="noemalTb tb-head">
                承办法官
            </Col>
            <Col span="4" class="noemalTb">
                <span v-show="!editState">{{ caseInfo.judge ? caseInfo.judge.judge.name : '无'}}</span>
                <Select v-if="editState" filterable clearable transfer v-model="selJudge" style="width:100%">
                    <Option :value="judgeItem.id" v-for="(judgeItem,index) in judgeList" :key="index">
                        <span>{{judgeItem.name}}</span>
                    </Option>
                </Select>
            </Col>
            <Col span="2" class="noemalTb tb-head">
                法官助理
            </Col>
            <Col span="4" class="noemalTb">
                <span v-show="!editState">{{ caseInfo.assistantJudge ? caseInfo.assistantJudge.judge.name : '无'}}</span>
                <Select v-if="editState" filterable clearable transfer v-model="selAssistantJudge" style="width:100%">
                    <Option :value="assistantJudgeItem.id" v-for="(assistantJudgeItem,index) in assistantJudgeList" :key="index" >
                        <span>{{assistantJudgeItem.name}}</span>
                    </Option>
                </Select>
            </Col>
            <Col span="2" class="noemalTb tb-head">
                书记员姓名
            </Col>
            <Col span="4" class="noemalTb">
                <span v-show="!editState">{{ caseInfo.clerk ? caseInfo.clerk.judge.name : '无'}}</span>
                <Select v-if="editState" filterable clearable transfer v-model="selClerk" style="width:100%">
                    <Option :value="clerkItem.id" v-for="(clerkItem,index) in clerkList" :key="index" >
                        <span>{{clerkItem.name}}</span>
                    </Option>
                </Select>
            </Col>
        </Row>
        <Row>
            <Col span="2" class="noemalTb tb-head">
                合议庭成员
            </Col>
            <Col span="22" class="noemalTb">
                <span v-show="!editState">{{ caseInfo.collegiateBench ? caseInfo.collegiateBench : '无'}}</span>
                <div v-if="editState" style="float: right;" @click="showModel"><Icon type="plus-circled" size="30"></Icon></div>
            </Col>
            <Col span="2" class="noemalTb tb-head">
                案件信息备注
            </Col>
            <Col span="22" class="noemalTb">
                <span v-show="!editState">{{ caseInfo.remark || '无'}}</span>
                <Input v-if="editState" v-model="remark" size="large" placeholder="" />
            </Col>
        </Row>
    </div>
    <div class="button-clas" style="margin-top: 50px;">
        <Button size='large' @click="edit" style="background:#2083D8;color:#fff;padding: 6px 31px;" >编辑</Button>
        <Button size='large' @click="saveHandle" v-show="editState" type="success" style="padding: 6px 31px;">保存</Button>
        <Button size='large' @click="cancelEdit" v-show="editState" style="background:#F54C4C;color:#fff" >取消编辑</Button>
    </div>
    <Modal
        title="合议庭成员选择"
        v-model="modal10"
        width='800'
        @on-ok="addCollegiateBenchHandle"
        class-name="vertical-center-modal" class="transfer">
        <Row>
            <Col span="12">
                <div class="tabWrap">
                    <div class="tabSpan"><span v-for="(tab,index) in tabs" :key="index" :class="{tabed:curtab==index}" @click="toggletab(index)">{{tab.title}}</span></div>
                    <div class="source" v-show="isShowOwnCards">
                        <div class="gridDiv" v-for="(judgeItem2,index) in judgeShift" :key="index" :class="{active: judgeItem2.active}" @click="sourceSel(judgeItem2, type)">{{judgeItem2.name}}</div>
                    </div>
                    <div class="source" v-show="!isShowOwnCards">
                        <div class="gridDiv" v-for="(peopleItem,index) in peopleAssessorList" :key="index" :class="{active: peopleItem.active}" @click="sourceSel(peopleItem, type)">{{peopleItem.name}}</div>
                    </div>
                </div>
            </Col>
            <Col span="6" class="btns">
                <Button type="primary" class="btn" shape="circle" @click="shiftInHandle(type)">将选中移入<Icon type="chevron-right"></Icon></Button>
                <Button type="primary" class="btn" shape="circle" @click="allShiftInHandle(type)">全部移入<Icon type="chevron-right"></Icon></Button>
                <Button type="primary" class="btn" shape="circle" @click="shiftOutHandle"><Icon type="chevron-left"></Icon> 将选中迁出</Button>
                <Button type="primary" class="btn" shape="circle" @click="allShiftOutHandle"><Icon type="chevron-left"></Icon>全部迁出</Button>
            </Col>
            <Col span="6">
                <div class="tabSpan"><span class="tabed" style="width: 100%;">合议庭成员</span></div>
                <div class="destination">
                    <div class="gridDiv" v-for="(judgeItem,index) in selectedData" :key="index"  :class="{active: judgeItem.active2}"  @click="terminalSel(judgeItem, type)" >{{judgeItem.name}}</div>
                </div>
            </Col>
        </Row>
    </Modal>
</div>
</template>
<script>
import { formatDate } from '@/libs/date'
import {
  lawCaseQuery,
  briefList,
  courtList,
  judgeList,
  assistantJudgeList,
  clerkList,
  editLawCase,
  peopleAssessorList,
  addCollegiateBench,
} from "@/api/handleInfo";
export default {
    data(){
        return{
            caseInfo:[],
            isLoading: false,
            caseId:this.$store.getters.caseId,
            editState:false,
            modal10: false,
            tabs:[{id:0,title:"审判员",iscurTab:true},{id:1,title:"人民陪审员",iscurTab:false}], //tab项
            curtab:0,        //当前被选择tab标识，用来渲染tab选中样式
            isShowOwnCards:true,     //用来渲染tab对应的内容块
            selSpan: -1,
            judgeShift: [],
            peopleAssessorList: [],//人民陪审
            selectList: [],
            curdestination: [],
            selectedData:[],
            procedureType: '',//程序
            briefList: [],//案由列表
            selBrief: '',//案由列表
            courtList: [],//承办部门
            selCourt: '',//承办部门
            judgeList:[],//承办法官
            selJudge: '',//承办法官
            assistantJudgeList: [],//法官助理
            selAssistantJudge: '',//法官助理
            clerkList: [],//书记员
            selClerk: '',//书记员
            remark: '',
            open: false,
            endTrialDate: '',
            applyStandard: 0,
            type: 'judgeShift',
        }
    },
    methods:{
        edit(){
            this.editState = true;
        },
        cancelEdit(){
            this.editState = false;
        },
        lawCaseQuery(caseId){
            this.isLoading = true;
            this.editState = false;
            if(!caseId)  return false;
            lawCaseQuery(caseId).then(res => {
                this.isLoading = false;
                if(res.data.state == 100){
                    let data = res.data.data[0];
                    this.caseInfo = data;
                    this.remark = data.remark;
                    this.procedureType = data.procedureType;
                    this.endTrialDate = data.endTrialDate;
                    this.applyStandard = data.applyStandard;
                    this.selBrief = data.brief ? data.brief.id : '';//案由列表
                    this.selCourt = data.court ? data.court.id : '';//承办部门
                    this.selJudge = data.judge ? data.judge.judge.id : '';//承办法官
                    this.selAssistantJudge = data.assistantJudge ? data.assistantJudge.judge.id : '';//法官助理
                    this.selClerk = data.clerk ? data.clerk.judge.id : '';//书记员
                    this.hackReset = false
                    this.$nextTick(() => {
                        this.hackReset = true;
                    })
                }else{
                    this.$Notice.warning({
                        title: '',
                        desc: res.data.message,
                        duration: 5
                    });
                }
            })
        },
        getBriefList(){
            briefList().then(res => {
                if(res.data.state == 100){
                    this.briefList = res.data.data;
                }else{
                    this.$Notice.warning({
                        title: '',
                        desc: res.data.message,
                        duration: 5
                    });
                }
            })
            courtList().then(res => {
                if(res.data.state == 100){
                    this.courtList = res.data.data;
                }else{
                    this.$Notice.warning({
                        title: '',
                        desc: res.data.message,
                        duration: 5
                    });
                }
            })
            judgeList().then(res => {
                if(res.data.state == 100){
                    this.judgeList = res.data.data;
                    this.judgeShift = res.data.data;
                    this.judgeShift = this.concatArr(this.judgeShift,'active','left')
                    console.log('this.judgeShift------------',this.judgeShift)
                }else{
                    this.$Notice.warning({
                        title: '',
                        desc: res.data.message,
                        duration: 5
                    });
                }
            })
            assistantJudgeList().then(res => {
                if(res.data.state == 100){
                    this.assistantJudgeList = res.data.data.judgeAssistant;
                }else{
                    this.$Notice.warning({
                        title: '',
                        desc: res.data.message,
                        duration: 5
                    });
                }
            })
            clerkList().then(res => {
                if(res.data.state == 100){
                    this.clerkList = res.data.data.clerk;
                }else{
                    this.$Notice.warning({
                        title: '',
                        desc: res.data.message,
                        duration: 5
                    });
                }
            })
        },
        saveHandle(){
            console.log("data")
            let data = {
                lawCase: {
                    lawCaseId: (this.$store.getters.caseId).toString(),
                    applyStandard: this.applyStandard ? this.applyStandard.toFixed(2) : '',
                    briefId: this.selBrief ? this.selBrief.toString() : '',
                    procedureType: this.procedureType ? this.procedureType : '',
                    endTrialDate: this.endTrialDate ? new Date(this.endTrialDate).getTime().toString() : '',
                    courtId: this.selCourt ? this.selCourt.toString() : '',
                    judgeId: this.selJudge ? this.selJudge.toString() : '',
                    assistantJudgeId: this.selAssistantJudge ? this.selAssistantJudge.toString() :'',
                    clerkId: this.selClerk ? this.selClerk.toString() : '',
                    remark: this.remark,
                }
            }
            this.isLoading = true;
            editLawCase(data).then(res => {
                this.isLoading = false;
                if(res.data.state == 100){
                    this.$Notice.success({
                        title: '',
                        desc: res.data.message,
                        duration: 3
                    });
                    this.editState = false;
                    this.lawCaseQuery(this.caseId);
                }else{
                    this.$Notice.warning({
                        title: '',
                        desc: res.data.message,
                        duration: 5
                    });
                }
            })
        },
        getPeopleAssessorList(){
            this.isLoading = true;
            peopleAssessorList().then(res => {
                this.isLoading = false;
                if(res.data.state == 100){
                    let data = res.data.data;
                    this.peopleAssessorList = data;
                    this.peopleAssessorList = this.concatArr(this.peopleAssessorList,'active','left');
                }else{
                    this.$Notice.warning({
                        title: '',
                        desc: res.data.message,
                        duration: 5
                    });
                }
            })
        },
        addCollegiateBenchHandle(){
            console.log("我是回调");
            // type 0->审判员  1->人民评审员
            // this.selectedData =[{id: id,type: type}]
            let collegiateBench = [];
            this.selectedData.map(item => {
                collegiateBench.push({id: item.id,name: item.name, type:item.type})
            })
            let data = {
                lawCaseId: (this.$store.getters.caseId).toString(),
                collegiateBench: collegiateBench,
            }
            this.isLoading = true;
            addCollegiateBench(data).then(res => {
                this.isLoading = false;
                if(res.data.state == 100){
                    this.$Notice.success({
                        title: '',
                        desc: res.data.message,
                        duration: 3
                    });
                    // this.editState = false;
                    // this.lawCaseQuery(this.caseId);
                }else{
                    this.$Notice.warning({
                        title: '',
                        desc: res.data.message,
                        duration: 5
                    });
                }
            })
        },
        changeDate(){
            this.open = !this.open;
        },
        handleChange (date) {
            this.endTrialDate = date;
            this.open = false;
        },
        showModel(){
            this.toggletab(0);
            this.modal10 = true;
            this.selectedData = [];
        },
        toggletab: function(index){
            this.curtab=index;   
            if(index==0){         
                this.isShowOwnCards=true;        
                this.type = 'judgeShift';
                this.peopleAssessorList.map(item => {
                    item.active = false;
                })
                this.selectList = [];
            }else{
                this.isShowOwnCards=false;      
                this.type = 'peopleAssessorList';
                this.judgeShift.map(item => {
                    item.active = false;
                }) 
                this.selectList = [];
            }
        },
        sourceSel(judgeItem, type){
            let  data = {};
            if(type == 'judgeShift'){
                judgeItem.active = !judgeItem.active;
                data = {'id': judgeItem.id,'idIdentification': judgeItem.idIdentification,'name': judgeItem.name, 'active2': false, type: "0"};
                if(judgeItem.active){
                    this.selectList.push(data);
                }else{
                    this.selectList.map((item, idx) => {
                        if((item.id == judgeItem.id) && (item.idIdentification == judgeItem.idIdentification)){
                            this.selectList.splice(idx, 1)
                        }
                    })
                }
                this.judgeShift = JSON.parse(JSON.stringify(this.judgeShift));
            }else{
                judgeItem.active = !judgeItem.active;
                data = {'id': judgeItem.id,'idIdentification': judgeItem.idIdentification,'name': judgeItem.name, 'active2': false, type: "1"};
                if(judgeItem.active){
                    this.selectList.push(data);
                }else{
                    this.selectList.map((item, idx) => {
                        if((item.id == judgeItem.id) && (item.idIdentification == judgeItem.idIdentification)){
                            this.selectList.splice(idx, 1)
                        }
                    })
                }
                this.peopleAssessorList = JSON.parse(JSON.stringify(this.peopleAssessorList));
            }
            this.selectedData.map(item => {
                item.active2 = false;
            })
        },
        terminalSel(judgeItem, type){
            judgeItem.active2 = !judgeItem.active2;
            let data = {};
            if(type == 'judgeShift'){
                data = {'id': judgeItem.id,'idIdentification': judgeItem.idIdentification, 'name': judgeItem.name, 'active2': false, type: "0"};
            }else{
                data = {'id': judgeItem.id,'idIdentification': judgeItem.idIdentification,'name': judgeItem.name, 'active2': false, type: "1"};
            }
            if(judgeItem.active2){
                this.curdestination.push(data);
            }else{
                this.curdestination.map((item, idx) => {
                    if((item.id == judgeItem.id) && (item.idIdentification == judgeItem.idIdentification)){
                        this.curdestination.splice(idx, 1)
                    }
                })
            }
            this.judgeShift.map(item => {
                item.active = false;
            })
            this.peopleAssessorList.map(item => {
                item.active = false;
            })
        },
        shiftInHandle(type){
            if (this.selectList.length <= 0) {
                this.$Notice.warning({
                    title: '',
                    desc: '您还未选择需要移入的成员',
                    duration: 5
                });
                return;
            }
            this.selectList.map(item => {
                this.selectedData.push(item);
                this.selectedData=this.distinct(this.selectedData);
            })
            if(type == 'judgeShift'){
                this.judgeShift.map(item => {
                    item.active = false;
                })
            }else{
                this.peopleAssessorList.map(item => {
                    item.active = false;
                })
            }
            this.selectList= [];
            console.log('移入',this.selectedData)
        },
        shiftOutHandle(){
            if(!this.selectedData.length){
                this.$Notice.warning({
                    title: '',
                    desc: '您当前还没有合议庭成员',
                    duration: 5
                });
                return;
            }else if(!this.curdestination.length){
                this.$Notice.warning({
                    title: '',
                    desc: '您还未选择需要移出的成员',
                    duration: 5
                });
                return;
            }
            for(let j=0;j<this.curdestination.length;j++){
                for(let i=0;i<this.selectedData.length;i++){
                    if(this.selectedData[i].id==this.curdestination[j].id){
                        this.selectedData.splice(i, 1)
                    }
                }
            }
            this.curdestination=[];
        },
        allShiftInHandle(type){
            if(type == 'judgeShift'){
                this.judgeShift.map(item => {
                    item.active = false;
                    let data = {'id': item.id,'idIdentification': item.idIdentification,'name': item.name, 'active2': false, type: "0"};
                    this.selectedData.push(data)
                    this.selectedData=this.distinct(this.selectedData);
                })
            }else{
                this.peopleAssessorList.map(item => {
                    item.active = false;
                    let data = {'id': item.id,'idIdentification': item.idIdentification,'name': item.name, 'active2': false, type: "1"};
                    this.selectedData.push(data)
                    this.selectedData=this.distinct(this.selectedData);
                })
            }
            console.log('全部移入',type)
            console.log('全部移入',this.selectedData)
        },
        allShiftOutHandle(){
            this.selectedData = [];
        },
        distinct(arr){
            var result = [];
            var obj = {};
            for(var i =0; i<arr.length; i++){
                if(!obj[arr[i].idIdentification]){
                    result.push(arr[i]);
                    obj[arr[i].idIdentification] = true;
                }
            }
            return result;
        },
        concatArr(outArr,activeType,tabType){
            if(outArr.length){
                for(let i = 0; i < outArr.length; i++){
                    if(activeType == 'active' && tabType == 'left'){
                        outArr[i].active = false;
                        outArr[i].type = "0";
                    }else{
                        outArr[i].active2 = false;
                        outArr[i].type = "1";
                    }
                }
                return outArr
            }else{
                if(activeType == 'active' && tabType == 'left'){
                    outArr.active = false;
                    outArr.type = "0";
                }else{
                    outArr.active2 = false;
                    outArr.type = "1";
                }
                return outArr
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
    mounted() {
        this.lawCaseQuery(this.caseId);
        this.getBriefList();
        this.getPeopleAssessorList();
    },

}
</script>

