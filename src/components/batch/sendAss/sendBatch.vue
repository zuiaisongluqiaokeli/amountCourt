<style lang="less">
@import "./../batch.less";
</style>

<template>
<div>
    <div class="batchModel">
        <Row>
            <Form ref="searchForm" :model="searchForm" style="text-align:left" inline :label-width="80" class="search-form">
                <Form-item label="送达方式：">
                    <Select v-model="sendType"  @on-change="showType" style="width:200px">
                        <Option v-for="(st, key) in sendTypesLit" :value="st" :key="key">{{ st }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="送达文书：" style="display:block">
                    <zh-upload ref="mproveUpload" :refid="'mproveFile'" :uploadType="'3'" @next="fileNext(arguments)" @complete="fileComplete" @error="fileError"></zh-upload>
                </Form-item>
            </Form>
            <Form ref="searchForm" v-show="sendType === '电子邮件送达'" :model="searchForm" style="text-align:left" inline :label-width="80" class="search-form">
                <Form-item label="邮件模板：">
                    <Select v-model="emailId"  @on-change="changeEmail" style="width:200px">
                        <Option v-for="(st, key) in emailLit" :value="st.id" :key="key">{{ st.name }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="邮件模板：" style="display:block">
                    <div style="padding: 5px 6px;">
                            {{ emailContent }}
                    </div>
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
                    <Table size="small" stripe height="450"  :loading="loading" border :columns="columns" :data="listData" ref="table" sortable="custom"  @on-selection-change="changeSelect"></Table>
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
  afterCourtUpload
} from "@/api/batch";
import {
  diplomsTemplateList,
  emailMessageTemplate
} from "@/api/global";
import { formatDate } from "@/libs/date";
import {formatSeconds,uniq} from "@/libs/tools.js";
import ZhUpload from '@/components/qiniu-upload/quick-upload.vue';
import Vue from 'vue';
export default {
    components : {
      ZhUpload,
    },
    data(){
        return{
            searchForm:{},
            loading:false,
            buttonLoading:false,
            isError:false,
            fileName:"",
            successNumber:"",
            failedNumber:"",
            reason:"",
            emailLit:[],
            emailContent:"",
            emailId:"",
            flieFalg:true,
            flieProgress:0,//文件上传进度
            leastTime:0,//剩余时间
            sendType:"",
            sendTypesLit:[
                "现场领取",
                "平台送达",
                "EMS送达",
                "工作人员上门送达",
                "电子邮件送达",
            ],
            listData:[],
            dipmosList:[],
            disabledGroup:[],
            columns:[
                {
                    title: '序号',
                    type: "index",
                    width: 55,
                    align: "center",
                },
                // {
                //     title: "网申号",
                //     key: "netApplicationNo",
                //     width: 170,
                //     align: "center",
                // },
                {
                    title: "案号",
                    key: "caseNo",
                    width: 170,
                    align: "center",
                },
                {
                    title: "案由",
                    key: "briefName",
                    width: 150,
                    align: "center",
                },
                {
                    title: "受送达人",
                    key: "litigantName",
                    align: "center",
                    // fixed:'right',
                },
                {
                    title: "诉讼地位",
                    key: "litigantStatusName",
                    width:90,
                    align: "center",
                },
                {
                    title: "送达方式",
                    key: "litigantStatusName",
                    width:130,
                    align: "center",
                    // fixed:'right',
                    render: (h, params) => {
                        return h('Select', {
                            props:{
                                value: this.listData[params.index].sendType,
                                filterable:'filterable',
                                clearable:'clearable',
                                transfer:'transfer'
                            },
                            on: {
                                'on-change':(value) => {
                                    this.listData[params.index].sendType = value;
                                }
                            },
                        },
                        this.sendTypesLit.map(item => {
                            return h('Option', {
                                props: {value: item}
                            }, item);
                        })
                        )
                    }
                },
                {
                    title: "地址",
                    key: "judge",
                    align: "center",
                    // fixed:'right',
                    render: (h, params) => {
                        return h('div', {
                            props:{
                               
                            },
                        },
                        // this.listData[params.index].sendType == '电子邮件送达' ? "邮箱号" : 
                        this.listData[params.index].litigantAddress.map(item => {
                                if(item.address == ""){
                                    return false
                                }
                                return h('p', {
                                    
                                }, 
                                item.litigantAddressType + '：' + item.address
                            )
                        })
                        )
                    }
                },
                {
                    title: "邮单编号",
                    key: "clerk",
                    width:170,
                    align: "center",
                    // fixed:'right',
                    render: (h, params) => {
                        if(this.listData[params.index].sendType && this.listData[params.index].sendType == 'EMS送达'){
                            return h('div', {
                                props:{
                                
                                },
                            },
                            // this.listData[params.index].sendType == '电子邮件送达' ? "邮箱号" : 
                            this.listData[params.index].litigantAddress.map(item => {
                                    if(item.address == ""){
                                        return false
                                    }
                                    return h('Input', {
                                        props:{
                                            value:item.oddNumbers,
                                            autosize: true
                                        },
                                        attrs: {
                                            id: 'rwmc'+item.id,//保证每个输入框的id唯一
                                            placeholder:item.litigantAddressType + '邮单编号'
                                        },
                                        style:{
                                            marginBottom:'5px'
                                        },                   
                                        on: {
                                            'on-focus': () => {
                                                this.$nextTick(()=>{                       
                                                    document.getElementById('rwmc'+item.id).
                                                    childNodes.forEach(item=>{
                                                        if(item.tagName == 'INPUT'){
                                                            item.focus();
                                                        }
                                                    })
                                                })                       
                                            },
                                            'on-blur': (event) => {
                                                for(let i=0;i<this.listData[params.index].litigantAddress.length;i++){
                                                    if(this.listData[params.index].litigantAddress[i].id == item.id){
                                                        this.listData[params.index].litigantAddress[i].oddNumbers = event.target.value;
                                                    }
                                                }
                                            }
                                        }
                                    }, 
                                )
                                ;
                            })
                            )
                        }else{
                            return h(
                                'span',
                                {},
                                "无需填写"
                            );
                        }
                    }
                },
                {
                    title: "邮箱",
                    key: "emails",
                    width:150,
                    align: "center",
                    // fixed:'right',
                    render: (h, params) => {
                        if(this.listData[params.index].sendType && this.listData[params.index].sendType == '电子邮件送达'){
                            return h('Input', {
                                props:{
                                    value:params.row.litiganteEmail,
                                    autosize: true
                                },
                                attrs: {
                                    id: 'rwm'+params.index//保证每个输入框的id唯一
                                },                      
                                on: {
                                    'on-focus': () => {
                                        this.$nextTick(()=>{                       
                                            document.getElementById('rwm'+params.index).
                                            childNodes.forEach(item=>{
                                                if(item.tagName == 'INPUT'){
                                                    item.focus();
                                                }
                                            })
                                        })                       
                                    },
                                    'on-blur': (event) => {
                                        for(let i=0;i<this.listData.length;i++){
                                            if(this.listData[i].lawCaseId == params.row.lawCaseId){
                                                this.listData[i].litiganteEmail = event.target.value;
                                            }
                                        }
                                    }
                                }
                            })
                        }else{
                            return h(
                                'span',
                                {},
                                this.listData[params.index].litiganteEmail
                            );
                        }
                    }
                },

                {
                    title: "送达文书",
                    key: "clerk",
                    // fixed:'right',
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
                        ]);
                        // return h('CheckboxGroup', {
                        //     props:{
                        //         value: this.listData[params.index].checkboxValue,
                        //     },
                        //     on: {
                        //         'on-change':(value) => {
                        //             this.listData[params.index].checkboxValue = value;
                        //         }
                        //     },
                        // },
                        // this.dipmosList.map(item => {
                        //         return h('checkbox', {
                        //             props: {label: item}
                        //         }, );
                        // })
                        // )
                    }
                },
            ],
        }
    },
    props: {
      listData2:Array,
    },
    methods:{
        fileNext (result) {
            this.flieProgress=result[0].total.percent.toFixed(2);
            //转化时间
            this.leastTime=formatSeconds(result[1]);                                                                                                                                                                                                                                                                                                                                                                                                             
            if(this.flieFalg){
                this.flieFalg=false;
                // 主要用来展示进度
                this.$Notice.info({
                title: "上传中，请稍后....",
                duration: 0,
                render: h => {
                    return h('span', [
                        h('div',{
                        style:{
                            color:"red",
                        },
                        },`上传过程请勿关闭浏览器或执行其他操作！`),
                        h('div',`进度${this.flieProgress}%,预计剩余${this.leastTime}`),
                    ])
                },
                onClose:()=>{
                    this.$refs.mproveUpload.cancelUpload();//取消文件上传
                    this.$Message.warning({content:'文件上传已取消',duration:2});
                    this.flieFalg=true;
                }
                });
            }
        },

        fileError (errResult) {
            // 失败报错信息
            this.$Notice.destroy();
            this.$Notice.error(errResult);
        },
        fileComplete (result) {
            // 接收成功后返回的信息
            console.log(result)
            this.fileName = result.key;
            // this.mEviPath ='hasLoad';
            this.mProve_fileName1 ='已上传';
            this.$Notice.destroy();
            this.$Message.success("上传成功");
            this.flieFalg=true;
            this.flieProgress=0;
            this.loading = true;
            let arys = [];
            this.listData.forEach((item,index) => {
                arys.push(item.lawCaseId)
            })
            console.log(arys)
            let params = {
                fileName:this.fileName,
                sendWay:3,
                lawCaseIdList:uniq(arys)
            }
            const msg = this.$Message.loading({
                content: '文件校验中...',
                duration: 0
            });
            this.isError = false;
            //发送上传的文件名给后端由后端解析文件返回证明文件信息
            afterCourtUpload(params).then(res => {
                this.loading = false;
                setTimeout(msg, 1000);
                if(res.data.state == 100){
                    this.$Notice.success({
                        title: '',
                        desc: '校验成功',
                        duration: 3
                    });
                    let dt= res.data.data;
                    console.log(dt.result)
                    for(let i=0;i<this.listData.length;i++){
                        this.listData[i].checkboxValue = [];
                        this.listData[i].afterCourtDiplomsList = [];
                        dt.result[this.listData[i].lawCaseId] ? dt.result[this.listData[i].lawCaseId].forEach((item,index) => {
                            this.listData[i].checkboxValue.push(item.name)
                            let dd = {
                                path:item.path,
                                name:item.name
                            }
                            this.listData[i].afterCourtDiplomsList.push(dd)
                        }) : this.listData[i].checkboxValue = [];
                        // for(let u=0;u<dt.result[0].length;u++){
                        //     if(this.listData[i].lawCaseId == dt.result[0][u].lawCaseId){
                                
                        //         this.listData[i].checkboxValue.push(dt.result[0][u].name)
                        //     }
                        // }
                        this.$set(this.listData,i,this.listData[i])
                    }
                    console.log(this.listData)
                    
                }else if(res.data.state == 104){
                    this.isError = true;
                    this.successNumber = res.data.data.success;
                    this.failedNumber = res.data.data.error;
                    this.reason = res.data.message;
                }else{
                    this.$Notice.warning({
                        title: '',
                        desc: res.data.message,
                        duration: 5
                    });
                }

            })
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
        getList(){
            this.listData = this.listData2;
            this.emailId = "";
            this.disabledGroup = [];
            this.sendType = "";
            this.emailContent = "";
            this.isError = false;
            // for(let i=0;i<this.listData.length;i++){
            //     this.listData[i].checkboxValue = [];
            //     Vue.set(this.listData, i, this.listData[i]);
            // }
            this.buttonLoading = false;
            this.tribunalId= '';
            this.briefName = this.listData[0].briefName;
            emailMessageTemplate().then(res => {
                if(res.data.state == 100){
                    this.emailLit = res.data.data;
                    this.emailId=this.emailLit[0].id;
                }
            })
        },
        cancel(){
            this.$emit('cancelEvent');
        },
        closeModel2(){
            this.modal2 = false;
        },
        changeEmail(){
            for(let i=0;i<this.emailLit.length;i++){
                if(this.emailLit[i].id == this.emailId){
                    this.emailContent = this.emailLit[i].content;
                }
            }
            for(let i=0;i<this.listData.length;i++){
                this.listData[i].emailModelId = this.emailId;
            }
            
        },
        showType(){
            for(let i=0;i<this.listData.length;i++){
                this.listData[i].sendType = this.sendType;
                Vue.set(this.listData, i, this.listData[i]);
            }
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

