<style lang="less">
@import "./../batch.less";
</style>

<template>
<div>
    <div class="batchModel">
        <div style="position: fixed;top:0;left:0;z-index:9999;width:100%;height:100%;background:#000;opacity:0.5" v-show="modal2back">
        </div>
        <div class="noneShow" v-show="modal4" style="width:500px;position: fixed;top: 130px;z-index: 99999;left: 50%;margin-left: -250px;background: #fff;border-radius: 15px;">
            <div class="ivu-modal-header">
                <div class="ivu-modal-header-inner">单个案件增加/减少发送的文书</div>
            </div>
            <div class="ivu-modal-body">
                <Checkbox @on-change="ckeckAllLiti2" v-model="allCkeckLitiOne">全选/取消全选</Checkbox>
                <CheckboxGroup v-model="checkdisabledGroup" @on-change="checkValue3">
                    <Checkbox v-for="(item) in checkTemplate" :label="item"></Checkbox>
                </CheckboxGroup>
            </div>
            <div class="ivu-modal-footer">
                <Button @click="oneCheckSure"  type="primary" size="large">确定</Button>
            </div>
        </div>
        <Row>
            <Form ref="searchForm" :model="searchForm" style="text-align:left" inline :label-width="120" class="search-form">
                
                <Form-item label="原告文书列表：" style="display:block">
                    <Checkbox @on-change="ckeckAllLiti" v-model="allCkeckLiti">全选/取消全选</Checkbox>
                    <CheckboxGroup v-model="plaintiffdisabledGroup" @on-change="checkValue1">
                        <Checkbox v-for="(item) in plaintiffTemplate" :label="item"></Checkbox>
                    </CheckboxGroup>
                </Form-item>
                <Form-item label="被告文书列表：">
                    <Checkbox @on-change="ckeckAllF" v-model="allCkeckF">全选/取消全选</Checkbox>
                    <CheckboxGroup v-model="defendantdisabledGroup" @on-change="checkValue2">
                        <Checkbox v-for="(item) in defendantTemplate" :label="item"></Checkbox>
                    </CheckboxGroup>
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
                    <Table size="small" stripe :height="listData.length > 9 ? minHeight : ''" :loading="loading" border :columns="columns" :data="listData" ref="table" sortable="custom"  @on-selection-change="changeSelect"></Table>
                </Col>
            </Row >  
        </div>
        <div class='button-clas' style='text-align:center;'>
            <Button size='large' :loading="buttonLoading" @click="save" style="background:#2083D8;color:#fff;font-size:16px;width:128px;" >选择完毕</Button>
            <Button size='large' @click="cancel" style="background:#F54C4C;color:#fff;padding: 6px 31px;font-size:16px;width:128px;" >取消</Button>
        </div>
        
    </div>
    </div>
</template>
<script>
import allColums from './../batch.js';
import {
  diplomsTemplateList
} from "@/api/global";
import { formatDate } from "@/libs/date";
import Vue from 'vue';
export default {
    data(){
        return{
            searchForm:{},
            plaintiffdisabledGroup:[],  //原告选择文书
            defendantdisabledGroup:[],  //被告选择文书
            loading:false,
            buttonLoading:false,
            modal4:false,
            modal2back:false,   //遮罩层
            checkTemplate:[],   //单个案件时的文书列表选择
            checkdisabledGroup:[],  //单个案件时的文书选中
            allCkeckLitiOne:false,  //单个案件全选样式
            dexSel:"",  //选中的下标
            isError:false,
            allCkeckLiti:false,
            allCkeckF:false,
            successNumber:"",
            failedNumber:"",
            reason:"",
            listData:[],
            plaintiffTemplate:[],
            defendantTemplate:[],
            minHeight:650,
            dipmosList:[],
            disabledGroup:[],
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
                //     width: 160,
                //     align: "center"
                // },
                {
                    title: "案号",
                    key: "caseNo",
                    width: 160,
                    align: "center"
                },
                {
                    title: "案由",
                    key: "briefName",
                    align: "center"
                },
                {
                    title: "当事人",
                    key: "litigantName",
                    align: "center"
                },
                {
                    title: "诉讼地位",
                    key: "litigantStatusName",
                    align: "center"
                    // width:100,
                },
                {
                    title: "承办法官",
                    key: "judgeName",
                    width:120,
                    align: "center"
                },
                {
                    title: "书记员",
                    key: "clerkName",
                    width:120,
                    align: "center"
                },
                {
                    title: "开庭时间",
                    key: "startDate",
                    width:120,
                    align: "center",
                    render: (h, params) => {
                        return h(
                            'span',
                            {},
                            formatDate(new Date(params.row.startDate), 'yyyy-MM-dd hh:mm')
                        );
                    }
                },

                {
                    title: "将生产的文书列表",
                    key: "clerk",
                    width:260,
                    render: (h, params) => {
                        return h("div", [
                            h(
                                "div",
                                {
                                },
                                params.row.checkboxValue ? params.row.checkboxValue.map(item => {
                                    return h('p', {
                                    }, item);
                                }) : ""
                            ),
                            h(
                                "span",
                                {
                                style: {
                                    color:'#2d8cf0',
                                    cursor:'pointer'
                                },
                                on: {
                                    click: () => {
                                        this.modal4 = true;
                                        this.modal2back = true;
                                        
                                        if(params.row.litigantStatusName == '原告'){
                                            this.checkTemplate = this.plaintiffTemplate;
                                        }else{
                                            this.checkTemplate = this.defendantTemplate;
                                        }
                                        this.checkdisabledGroup = params.row.checkboxValue;
                                        this.dexSel = params.index;
                                    }
                                }
                                },
                                "增加/减少发送的文书"
                            ),
                        ]);
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
            this.$emit('cancelEvent',this.listData);
        },
        /**
         * 选择文书
         */
        checkValue(value){
            for(let i=0;i<this.listData.length;i++){
                this.listData[i].checkboxValue = this.disabledGroup;
                Vue.set(this.listData, i, this.listData[i]);
            }
        },
        //原告全选
        ckeckAllLiti(){
            console.log("8888",this.listData)
            if(this.allCkeckLiti){
                this.plaintiffdisabledGroup = [];
                for(let i=0;i<this.plaintiffTemplate.length;i++){
                    this.plaintiffdisabledGroup.push(this.plaintiffTemplate[i])
                }
            }else{
                this.plaintiffdisabledGroup = [];
            }
            for(let i=0;i<this.listData.length;i++){
                if(this.listData[i].litigantStatusName == '原告'){
                    this.listData[i].checkboxValue = this.plaintiffdisabledGroup;
                    // Vue.set(this.listData, i, this.listData[i]);
                }  
            }
            this.listData = JSON.parse(JSON.stringify(this.listData));
        },
        // 原告单选
        checkValue1(value){
            for(let i=0;i<this.listData.length;i++){
                if(this.listData[i].litigantStatusName == '原告'){
                    this.listData[i].checkboxValue = this.plaintiffdisabledGroup;
                    // Vue.set(this.listData, i, this.listData[i]);
                }
            }
            this.listData = JSON.parse(JSON.stringify(this.listData));
            if(this.plaintiffdisabledGroup.length < this.plaintiffTemplate.length){
                this.allCkeckLiti = false;
            }else{
                this.allCkeckLiti = true;
            }
        },
        //被告全选
        ckeckAllF(){
            if(this.allCkeckF){
                this.defendantdisabledGroup = [];
                for(let i=0;i<this.defendantTemplate.length;i++){
                    this.defendantdisabledGroup.push(this.defendantTemplate[i])
                }
            }else{
                this.defendantdisabledGroup = [];
            }
            for(let i=0;i<this.listData.length;i++){
                if(this.listData[i].litigantStatusName == '被告'){
                    this.listData[i].checkboxValue = this.defendantdisabledGroup;
                    // Vue.set(this.listData, i, this.listData[i]);
                }
            }
            this.listData = JSON.parse(JSON.stringify(this.listData));
            
        },
        // 被告单选
        checkValue2(value){
            for(let i=0;i<this.listData.length;i++){
                if(this.listData[i].litigantStatusName == '被告'){
                    this.listData[i].checkboxValue = this.defendantdisabledGroup;
                    // Vue.set(this.listData, i, this.listData[i]);
                }
            }
            this.listData = JSON.parse(JSON.stringify(this.listData));
            if(this.defendantdisabledGroup.length < this.defendantTemplate.length){
                this.allCkeckF = false;
            }else{
                this.allCkeckF = true;
            }
        },
        //单个案件全选
        ckeckAllLiti2(){
            if(this.allCkeckLitiOne){
                this.checkdisabledGroup = this.checkTemplate;
            }else{
                this.checkdisabledGroup = [];
            }
        },
        //单个案件单选文书
        checkValue3(){
            if(this.checkdisabledGroup.length < this.checkTemplate.length){
                this.allCkeckLitiOne = false;
            }else{
                this.allCkeckLitiOne = true;
            }
        },
        oneCheckSure(){
            this.listData[this.dexSel].checkboxValue = this.checkdisabledGroup;
            Vue.set(this.listData, this.dexSel, this.listData[this.dexSel]);
            this.modal4 = false;
            this.modal2back = false;
        },
        getList(){
            this.listData = this.listData2;
            this.buttonLoading = false;
            this.tribunalId= '';
            diplomsTemplateList().then(res => {
                if(res.data.state == 100){
                    let data=res.data.data;
                    this.dipmosList = data.diplomsTemplate;        //所有文书列表
                    this.disabledGroup = data.defaultTemplate;     //所有文书默认选择列表
                    this.plaintiffTemplate = data.plaintiffTemplate;     //原告所有文书列表
                    this.defendantTemplate = data.defendantTemplate;     //被告所有文书列表
                    this.plaintiffdisabledGroup = data.plaintiffDefaultTemplate;       //原告默认选择文书列表
                    this.defendantdisabledGroup = data.defendantDefaultTemplate;       //被告默认选择文书列表
                    for(let i=0;i<this.listData.length;i++){
                        if(this.listData[i].litigantStatusName == '原告'){
                            this.listData[i].checkboxValue = data.plaintiffDefaultTemplate;
                        }else{
                            this.listData[i].checkboxValue = data.defendantDefaultTemplate;
                        }
                        this.listData = JSON.parse(JSON.stringify(this.listData));
                    }
                    console.log(this.dipmosList)
                }
            })
        },
        cancel(){
            this.$emit('cancelEvent');
        },
        closeModel2(){
            this.modal2 = false;
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

