<style lang="less">
@import "./../batch.less";
</style>

<template>
<div>
    <div class="batchModel">
        <Row>
            <Form ref="searchForm" :model="searchForm" style="text-align:left" inline :label-width="80" class="search-form">
                <Form-item label="批量开启举证质证：" :label-width="150">
                    <i-switch size="large" @on-change='openJzz' v-model='allOpenValue'>
                        <span slot="open">开启</span>
                        <span slot="close">关闭</span>
                    </i-switch>
                </Form-item>
            </Form>
        </Row>
        <Alert type="warning" v-show="isError" show-icon closable>
            <span>开启成功案件个数：{{successNumber}}</span><br/>
            <span>开启失败案件个数：{{failedNumber}}</span><br/>
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
            <Button size='large' :loading="buttonLoading" @click="save" style="background:#2083D8;color:#fff;font-size:16px;width:128px;" >选择完毕</Button>
            <Button size='large' @click="cancel" style="background:#F54C4C;color:#fff;padding: 6px 31px;font-size:16px;width:128px;" >取消</Button>
        </div>
        
    </div>
    </div>
</template>
<script>
import allColums from './../batch.js';
import {
  docxTemplatesName
} from "@/api/global";
import {
  batchEditProcess
} from "@/api/batch";
import { formatDate } from "@/libs/date";
import Vue from 'vue';
export default {
    data(){
        return{
            searchForm:{},
            loading:false,
            buttonLoading:false,
            isError:false,
            successNumber:"",
            failedNumber:"",
            reason:"",
            listData:[],
            minHeight:450,
            dipmosList:[],
            briefName:"",
            allOpenValue:false,//批量开启按钮值
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
                //     width: 140,
                // },
                {
                    title: "案号",
                    key: "caseNo",
                    width: 180,
                },
                {
                    title: "案由",
                    key: "briefName",
                    width: 120,
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
                    title: "举质证状态",
                    width:150,
                    render: (h, params) => {
                        let state=false;
                        switch(params.row.progress){
                        case '举证':
                        case '质证':
                            state=true;
                        break;
                        }
                        return h('div', [
                            h('i-switch', {
                                props: {
                                size: 'large',
                                value: state,
                                },
                                on: {
                                    'on-change': (value) => {
                                        //设置单个举质证开启状态
                                        this.progressSet(value,params.row.lawCaseId)
                                    }
                                }
                            },[
                            h('span', {
                                slot: 'open'
                            }, '开启'),
                            h('span', {
                                slot: 'close'
                            }, '关闭')
                            ])
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
        openJzz(value){//批量开启
            //批量设置举质证开启状态
            let caseids='';
            //获取所选案件的id
            let count=this.listData2.length;
            this.listData2.forEach((item,index) => {
                count-1==index ? caseids+=item.lawCaseId : caseids+=item.lawCaseId+','
            });
            this.progressSet(value,caseids);
        },
        progressSet(value,caseid){//设置举质证开启状态
            console.log(caseid)
            let data={
                lawCaseIds:caseid,
                open:value,
                progress:'质证',
            }
            //发送更改状态请求
            batchEditProcess(data).then(res=>{
                if(res.data.state==100){
                    //判断是单个开启还是批量开启
                    if(caseid.indexOf(',')>-1){//批量
                        this.listData2.forEach((item,index) => {
                            if(value){
                                item.progress = '质证';
                            }else{
                                item.progress = '';
                            }
                            //更新当前窗口表格数据
                            Vue.set(this.listData2,index,item);
                        });
                    }else{//单个
                        this.listData2.forEach((item,index) => {
                            if(item.lawCaseId==caseid){
                                if(value){
                                    item.progress = '质证';
                                }else{
                                    item.progress = '';
                                }
                                //更新当前窗口表格数据
                                Vue.set(this.listData2,index,item);
                                return;
                            }
                        });
                    }
                    this.$Message.success(res.data.message);
                }else{
                   this.$Message.error(res.data.message);
                }
            });
        },
        getList(){
            this.listData = this.listData2;
            this.buttonLoading = false;
            this.tribunalId= '';
            this.briefName = this.listData[0].briefName;
            docxTemplatesName(this.briefName).then(res => {
                if(res.data.state == 100){
                    this.dipmosList = res.data.data;
                    console.log(this.dipmosList)
                }
            })
        },
        cancel(){
            this.$emit('cancelEvent',this.listData);
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

