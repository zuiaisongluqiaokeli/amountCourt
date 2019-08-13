<style lang="less">
@import "./../batch.less";
</style>

<template>
<div>
    <div class="batchModel">
        <Row>
            <Form ref="searchForm" :model="searchForm" style="text-align:left" inline :label-width="80" class="search-form">
                
                <Form-item label="修改审限：">
                    <Checkbox @on-change="ckeckAllLiti" v-model="allCkeckLiti">扣除60天公告期</Checkbox>
                    <!-- <CheckboxGroup v-model="disabledGroup" @on-change="checkValue">
                        <Checkbox v-for="(item) in dipmosList" :label="item"></Checkbox>
                    </CheckboxGroup> -->
                </Form-item>
            </Form>
        </Row>
        <Alert type="warning" v-show="isError" show-icon closable>
            <span>成功案件个数：{{successNumber}}</span><br/>
            <span>失败案件个数：{{failedNumber}}</span><br/>
            <span>失败原因：{{reason}}</span>
        </Alert>
        <div  style="margin-bottom:25px">
            <Row class="tables">
                <Col span='24'>
                    <Table size="small" stripe :height="listData.length > 10 ? minHeight : ''" :loading="loading" border :columns="columns" :data="listData" ref="table" sortable="custom"  @on-selection-change="changeSelect"></Table>
                </Col>
            </Row >  
        </div>
        <div class='button-clas' style='text-align:center;'>
            <Button size='large' :loading="buttonLoading" @click="save" style="background:#2083D8;color:#fff;font-size:16px;width:128px;" >完成</Button>
            <Button size='large' @click="cancel" style="background:#F54C4C;color:#fff;padding: 6px 31px;font-size:16px;width:128px;" >取消</Button>
        </div>
        
    </div>
    </div>
</template>
<script>
import allColums from './../batch.js';
import {
  changeOrdinary
} from "@/api/batch";
import {
  docxTemplatesName
} from "@/api/global";
import { formatDate } from "@/libs/date";
import Vue from 'vue';
export default {
    data(){
        return{
            searchForm:{},
            allCkeckLiti:true,
            loading:false,
            buttonLoading:false,
            isError:false,
            successNumber:"",
            failedNumber:"",
            reason:"",
            listData:[],
            minHeight:450,
            dipmosList:['转普审批表'],
            disabledGroup:[],
            briefName:"",
            columns:[
                {
                    title: '序号',
                    type: "index",
                    width: 55,
                    align: "center"
                },
                // {
                //     title: "网申号",
                //     key: "netApplicationNo",
                //     width: 170,
                // },
                {
                    title: "案号",
                    key: "caseNo",
                    width: 170,
                },
                {
                    title: "案由",
                    key: "briefName",
                    width: 130,
                },
                {
                    title: "原告",
                    key: "plaintiffName",
                },
                {
                    title: "被告",
                    key: "defendantName",
                },
                {
                    title: "承办法官",
                    key: "judgeName",
                    width:110,
                },
                {
                    title: "书记员",
                    key: "clerkName",
                    width:110,
                },
                {
                    title: "立案日期",
                    key: "clerk",
                    width:120,
                    render: (h, params) => {
                        return h(
                            'span',
                            {},
                            formatDate(new Date(params.row.filingDate), 'yyyy-MM-dd')
                        );
                    }
                },
                {
                    title: "适用程序",
                    key: "procedureType",
                    width:120,
                },

                {
                    title: "将生产的文书列表",
                    key: "clerk",
                    width:160,
                    render: (h, params) => {
                        return h('CheckboxGroup', {
                            props:{
                                value: this.listData[params.index].checkboxValue,
                            },
                            on: {
                                'on-change':(value) => {
                                    this.listData[params.index].checkboxValue = value;
                                    console.log(this.listData[params.index].checkboxValue)
                                }
                            },
                        },
                        this.dipmosList.map(item => {
                                return h('span', {},item );
                        })
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
            this.buttonLoading = true;
            let ary = [];
            for(let i=0;i<this.listData.length;i++){
                ary.push(this.listData[i].lawCaseId)
            }
            let data = {
                lawCaseId:ary,
                modifyTrialLimit:this.allCkeckLiti
            }
            changeOrdinary(data).then(res => {
                this.buttonLoading = false;
                if(res.data.state == 100){
                    let arr = res.data.data;
                    for(let i=0;i<this.listData.length;i++){
                        for(let y=0;y<arr.length;y++){
                            if(arr[y].lawCaseId == this.listData[i].lawCaseId){
                                this.listData[i].diplomsPath = arr[y].diplomsPath
                            }
                        }
                        // this.listData[i].checkboxValue = ['转普审批表'];
                    }
                    console.log(this.listData)
                    this.$emit('cancelEvent',this.listData);
                    
                }else{
                    this.$Message.info(res.data.message);
                }
            })
            
        },
        //全选
        ckeckAllLiti(){
            if(this.allCkeckLiti){
                this.disabledGroup = [];
                for(let i=0;i<this.dipmosList.length;i++){
                    this.disabledGroup.push(this.dipmosList[i])
                }
            }else{
                this.disabledGroup = [];
            }
            for(let i=0;i<this.listData.length;i++){
                this.listData[i].checkboxValue = this.disabledGroup;
                Vue.set(this.listData, i, this.listData[i]);
            }
        },
        /**
         * 单选择文书
         */
        checkValue(value){
            for(let i=0;i<this.listData.length;i++){
                this.listData[i].checkboxValue = this.disabledGroup;
                Vue.set(this.listData, i, this.listData[i]);
            }
            if(this.disabledGroup.length < this.dipmosList.length){
                this.allCkeckLiti = false;
            }else{
                this.allCkeckLiti = true;
            }
        },
        getList(){
            this.listData = this.listData2;
            for(let i=0;i<this.listData.length;i++){
                this.listData[i].checkboxValue = ['转普审批表'];
                // Vue.set(this.listData, i, this.listData[i]);
            }
            this.buttonLoading = false;
            this.tribunalId= '';
            // this.briefName = this.listData[0].brief.name;
            // docxTemplatesName(this.briefName).then(res => {
            //     if(res.data.state == 100){
            //         this.dipmosList = res.data.data;
            //         console.log(this.dipmosList)
            //     }
            // })
        },
        cancel(){
            this.$emit('cancelEvent');
        },
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

