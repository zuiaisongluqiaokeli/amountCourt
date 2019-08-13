<style lang="less">
@import "../common.less";
@import "./tuote.less";
</style>
<template>
    <div class="tuoteInfo">
        <div class="bookbuilding-table">
            <Row >
                <Col span="24" class="noemalTb th-header">
                    <span>{{panelTitle}}</span>
                </Col>
            </Row>
            <div class="contain">
                <Row class="tabls">
                    <Col span="2" class="noemalTb tb-head">
                        案件状态
                    </Col>
                    <Col span="4" class="noemalTb">
                        <span>{{tuote_witnessDate}}</span>
                    </Col>
                    <Col span="2" class="noemalTb tb-head">
                        在线举证质证端口
                    </Col>
                    <Col span="4" class="noemalTb">
                        <span v-bind:class="tuote_port===true?'portActive':'protStatic'">{{tuote_portText}}</span>
                        <i-switch
                        v-model="tuote_port"
                        @on-change="ft_tuote_portChange"
                        class="tuote-port-switch"
                        :disabled="editDisabled"
                        ></i-switch>
                    </Col>
                    <Col span="2" class="noemalTb tb-head">
                        举证质证截止时间
                    </Col>
                    <Col span="4" class="noemalTb">
                        <DatePicker type="datetime" v-model="tuote_deadTime" :disabled="isDatePickerShow" placeholder="请选择时间" style="width:100%"></DatePicker>
                    </Col>
                    <Col span="2" class="noemalTb tb-head">
                        举证质证情况
                    </Col>
                    <Col span="4" class="noemalTb">
                        <span>{{tuote_environment}}</span>
                    </Col>
                </Row>
                <Row class="tabs" style="">
                    <Col span="2" align="left" valign="middle" class="Tbs height-wit tb-head" style="position:absolute;font-size:13px;">
                        有关条款说明
                    </Col>
                    <Col span="22" align="left" class="Tbs height-wit" style="float: right;">
                        <Input v-model="text_content" type="textarea" :disabled="editDisabled"></Input>
                    </Col>
                </Row>
            </div>
            <div class="button-clas">
                <Button size='large' @click="editAndSave" style="background:#2083D8;color:#fff;padding: 6px 31px;font-size:16px;" v-show="isEdit">{{btnName}}</Button>
            </div>
        </div>
    </div>
</template>
<script>
import { formatDate } from '@/libs/date';
import {changeDatePicker} from "@/libs/tools.js";
import { ft_getCaseInfoStep2 ,ft_setCaseInfoStep2} from '@/api/witness.js';
import {
  holiday,
} from "@/api/courtDate";
export default {
    data(){
        return{
            tuote_isEdit:true, //日期是否可编辑
            tuote_witnessDate: '举证期',//举证期
            tuote_portText:'已关闭', //举证端口文字
            tuote_port:false, //举证端口
            tuote_deadTime:'', //举证截止时间
            tuote_environment:'', //举证情况
            text_content:'',//文书内容
            editDisabled:true,
            isDatePickerShow:true,
            btnName:"编辑",
            isEdit:false,
        }
    },
    props:{
        type:{
            type: Number,
            required: true
        },
        panelTitle:{
            type: String,
            required: true
        }
    },
    mounted() {
        //判断是质证还是举证
        switch(this.type){
           case 1:
                this.panelTitle="在线举证状态信息";
           break;
           case 2:
                this.panelTitle="在线质证状态信息";
           break
        }
        this.ft_getCaseInoStep2();//获取状态信息
    },
    computed: {
        
    },
    methods:{
        //获取质证列表
        ft_getCaseInoStep2 () {
            let params = {
                lawCaseId:this.$store.getters.caseId,
                type:this.type,
            }
            console.log(params)
            ft_getCaseInfoStep2(params)
            .then(res=>{
                console.log(res.data);
                if(res.data.state==100){
                    var data=res.data.data;
                    this.tuote_witnessDate=data.lawCaseStatus;
                    this.tuote_deadTime=data.endTime;
                    this.tuote_environment=data.uploadStatus;
                    this.text_content=data.stipulation;
                    this.isEdit=data.isEdit;
                    this.tuote_port=data.isOpen;
                    this.tuote_portText = this.tuote_port===true?'已开启':'已关闭';
                }
            })
        },
        //端口更改事件
        ft_tuote_portChange (e) {
            this.tuote_portText = this.tuote_port===true?'已开启':'已关闭';
            if(e){
                this.isDatePickerShow=false;//开启日期
            }else{
                this.isDatePickerShow=true;//关闭日期
            }
        },
        //编辑和保存按钮
        editAndSave(){
            if(this.btnName=="编辑"){
               this.btnName="保存"
               this.editDisabled=false;
               this.isDatePickerShow=false;//关闭日期
            }else{
                let data={
                    lawCaseId:this.$store.getters.caseId,
                    type:this.tuote_port ? this.type : 3,
                    endTime:changeDatePicker(this.tuote_deadTime),
                    stipulation:this.text_content,
                }
               ft_setCaseInfoStep2(data).then(res=>{
                   this.$Message.success(res.data.message);
                   this.btnName="编辑";
                   this.editDisabled=true;//关闭文本里编辑
                   this.tuote_isEdit=true;//关闭切换按钮
                   this.isDatePickerShow=true;//关闭日期
               })
            }
        }
    },
}
</script>

