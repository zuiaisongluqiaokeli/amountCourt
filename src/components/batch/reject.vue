<style lang="less">
@import "./batch.less";
</style>

<template>
    <div class="batchModel">
        <Row>
            <Form ref="searchForm" :model="searchForm" inline :label-width="80" class="search-form">
                <Form-item label="理由">
                    <AutoComplete
                        v-model="searchForm.reason"
                        :data="data3"
                       @on-change="changeReason"
                        placeholder="理由"
                        style="width:185px">
                    </AutoComplete>
                    <!-- @on-change="changeReason" -->
                    <!-- <Select v-model="searchForm.brief" @on-change="selBrief" clearable filterable placeholder="请选择" clearable style="width: 185px">
                        <Option v-for="(item) in briefList" :value="item.id">{{item.name}}</Option>
                    </Select> -->
                </Form-item>
                <Form-item label="修改意见">
                    <AutoComplete
                        v-model="searchForm.proposal"
                        :data="data2"
                        @on-change="changeproposal"
                        placeholder="理由"
                        style="width:185px">
                    </AutoComplete>
                    <!-- <Select v-model="searchForm.mkk" clearable filterable placeholder="请选择" @on-change="selCourt" clearable style="width: 185px">
                        <Option v-for="(item) in courtList" :value="item.id">{{item.name}}</Option>
                    </Select> -->
                </Form-item>
            </Form>
        </Row>
        <div  style="margin-bottom:25px">
            <Row class="tables">
                <Col span='24'>
                    <Table size="small" stripe :height="listData.length > 10 ? minHeight : ''" :loading="loading" border :columns="columns" :data="listData" ref="table" sortable="custom"  @on-selection-change="changeSelect"></Table>
                </Col>
            </Row >  
        </div>
        <div class='button-clas' style='text-align:center;'>
            <Button size='large' :loading="buttonLoading" @click="save" style="background:#F54C4C;color:#fff;font-size:16px;width:128px;" >确认驳回</Button>
            <Button size='large' @click="cancel" style="border:1px solid #F54C4C;color:#F54C4C;padding: 6px 31px;font-size:16px;width:128px;" >取消</Button>
        </div>
    </div>
</template>
<script>
import {
  getBrief,
  courtList,
  judgeList,
  caseNoList
} from "@/api/global";
import {
  lawCaseAuditing
} from "@/api/batch";
import Vue from 'vue';
export default {
    data(){
        return{
            searchForm:{},
            loading:false,
            data3:["立案材料不全"],
            data2:["补齐材料再次提交"],
            buttonLoading:false,
            briefList:[],   //案由列表
            courtList:[],   //法院列表
            judgeList:[],   //承办人列表
            data:[],
            minHeight:450,
            columns:[
                {
                    type: 'index',
                    width: 55,
                    align: 'center'
                },
                {
                    title: "批次-流水号",
                    key: "flowNumber",
                    width: 180,
                },
                {
                    title: "网申号",
                    key: "netApplicationNo",
                    width: 180,
                },
                {
                    title: "原告",
                    key: "plaintiffName",
                    // width: 120,
                },
                {
                    title: "被告",
                    key: "defendantName",
                    // width: 120,
                },
                {
                    title: "驳回理由",
                    key: "phone",
                    width: 200,
                    className:'backRed',
                    render: (h, params) => {
                        return h('AutoComplete', {
                            props:{
                                value:this.listData[params.index].reason,
                                autosize: true,
                                data:this.listData[params.index].reasonData
                            },
                            attrs: {
                                id: 'rwmc'+params.index//保证每个输入框的id唯一
                            },                      
                            on: {
                                'on-focus': () => {
                                    this.$nextTick(()=>{                       
                                        document.getElementById('rwmc'+params.index).
                                        childNodes.forEach(item=>{
                                            if(item.tagName == 'INPUT'){
                                                item.focus();
                                            }
                                        })
                                    })                       
                                },
                                'on-change': (event) => {
                                    for(let i=0;i<this.listData.length;i++){
                                        if(this.listData[i].lawCaseId == params.row.lawCaseId){
                                            this.listData[i].reason = event;
                                        }
                                    }
                                }
                            }
                        })
                    },
                },
                {
                    title: "修改建议",
                    key: "phone",
                    width: 300,
                    className:'backRed',
                    render: (h, params) => {
                        return h('AutoComplete', {
                            props:{
                                value:this.listData[params.index].proposal,
                                autosize: true,
                                data:this.listData[params.index].proposalData
                            },
                            attrs: {
                                id: 'rwmc'+params.index//保证每个输入框的id唯一
                            },                      
                            on: {
                                'on-focus': () => {
                                    this.$nextTick(()=>{                       
                                        document.getElementById('rwmc'+params.index).
                                        childNodes.forEach(item=>{
                                            if(item.tagName == 'INPUT'){
                                                item.focus();
                                            }
                                        })
                                    })                       
                                },
                                'on-change': (event) => {
                                    console.log(event)
                                    for(let i=0;i<this.listData.length;i++){
                                        if(this.listData[i].lawCaseId == params.row.lawCaseId){
                                            this.listData[i].proposal = event;
                                        }
                                    }
                                }
                            }
                        })
                    }
                },
            ],
        }
    },
    props: {
    //   lowCaseId:[Number, String],
    //   briefName:String,
      listData:Array,
    },
    methods:{
        
        handleSearch(){

        },
        changeSelect(){

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
            // this.buttonLoading = true;
            let ary = [];
            this.listData.map(item => {
                const data = {
                    examine:false,       //true审核通过或者驳回
                    lawCaseId:item.lawCaseId.toString(),  //案件id
                    briefId:item.briefId ? item.briefId.toString() : '',
                    courtId:item.courtId ? item.courtId.toString() : '',
                    judgeId:item.judgeId ? item.judgeId.toString() : '',
                    caseNo:item.caseNo ? item.caseNo.toString() : '',
                    reason:item.reason ? item.reason : "",
                    proposal:item.proposal ? item.proposal : "",
                }
                ary.push(data)
            })
            this.buttonLoading = true;
            lawCaseAuditing({lawCase:ary,division:"0"}).then(res => {
                if(res.data.state == 100){
                    this.$Notice.success({
                        title: '',
                        desc: res.data.message,
                        duration: 5
                    });
                }else{
                    this.$Notice.warning({
                        title: '',
                        desc: res.data.message,
                        duration: 5
                    });
                }
                this.buttonLoading = false;
                this.$emit('cancelEvent',1);
            })
        },
        /**
         * 选中案由
         */
        selBrief(name){
            for(let i=0;i<this.listData.length;i++){
                this.listData[i].briefId = name;
                Vue.set(this.listData, i, this.listData[i]);
            }
        },
        changeReason(name){
            console.log(9595)
            console.log(this.searchForm.reason)
            for(let i=0;i<this.listData.length;i++){
                this.listData[i].reason = name;
                Vue.set(this.listData, i, this.listData[i]);
            }
        },
        changeproposal(name){
            for(let i=0;i<this.listData.length;i++){
                this.listData[i].proposal = name;
                Vue.set(this.listData, i, this.listData[i]);
            }
        },
        /**
         * 选择承办部门
         */
        selCourt(id){
            for(let i=0;i<this.listData.length;i++){
                this.listData[i].courtId = id;
                Vue.set(this.listData, i, this.listData[i]);
            }
        },
        /**
         * 选择承办人
         */
        selJudge(id){
            for(let i=0;i<this.listData.length;i++){
                this.listData[i].judgeId = id;
                Vue.set(this.listData, i, this.listData[i]);
            }
        },
        /**
         * 案号分配规则
         */
        selCaseNo(name){
            if(name == '自动分配'){
                let ary = [];
                this.loading = true;
                caseNoList(0,this.listData.length).then(res => {
                    if(res.data.state == 100){
                        
                        ary = res.data.data;
                        for(let i=0;i<this.listData.length;i++){
                            this.listData[i].caseNo = ary[i];
                            Vue.set(this.listData, i, this.listData[i]);
                        }
                        this.loading = false;
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
        getList(){
            for(let i=0;i<this.listData.length;i++){
                this.listData[i].proposalData = this.data2;
                this.listData[i].reasonData = this.data3;
                Vue.set(this.listData, i, this.listData[i]);
            }
            this.searchForm.reason = "";
            this.searchForm.proposal = "";
        },
        cancel(){
            this.$emit('cancelEvent');
        },
    }

}
</script>

