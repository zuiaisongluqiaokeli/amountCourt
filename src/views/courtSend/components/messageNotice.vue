<style lang="less">
@import "./../courtSend.less";
</style>
<template>
    <div class="courtSendInfo" style="position:relative">
        <!-- 原告 -->
        <Spin size="large" fix v-show="isLoading"></Spin>
        <div class="bookbuilding-table">
            <Row >
                <Col span="24" class="noemalTb th-header">
                    <span>短信通知</span>
                </Col>
            </Row>
            <div class="contain">
                <Row >
                    <Table size="small" stripe  :loading="loading" border :columns="Columns" :data="this.data" ref="table" sortable="custom"  ></Table>
                    <!-- <div class="maininfo-col-label" style="display:inline-block;padding:10px;margin:10px;">当事人关系：</div> -->
                    <!-- <template v-if="this.data.length>1"> 
                        <Button size='large' @click="addLitigantRelation" style="background:#2083D8;color:#fff;padding: 6px 31px;border-radius: 17px;" >添加</Button>
                    </template> -->
                    <!-- <Table :columns="columns1"  :data="this.relation" width="100%"></Table> -->
                </Row>
            </div>
            <div>
                <Row style="margin-bottom:15px">
                    <Col span="24" class="sendRo" style="margin-top:15px;padding-left:10px;padding-right:10px;">
                        <Input disabled v-model="phoneTips" type="textarea" :rows="2" placeholder="点击上面短信发送对象的号码，可多次点击添加多个号码" />
                    </Col>
                </Row> 
            </div>
            <div>
                <Row style="margin-bottom:15px">
                    <Col span="2" class="sendRo" style="text-align:right">
                        短信模板
                    </Col>
                    <Col span="22" class="sendRo" style="padding-left:15px;">
                        <Select v-model="messageId" @on-change="selMessaheId"  style="width:245px">
                            <Option v-for="(st, key) in messageLit" :value="st.id" :key="key">{{ st.name }}</Option>
                        </Select>
                    </Col>
                    <Col span="24" class="sendRo" style="margin-top:15px;padding-left:10px;padding-right:10px;">
                        <Input disabled v-model="messageContain" type="textarea" :rows="4" placeholder="短信模板内容" />
                    </Col>
                </Row>    
            </div>
            <div class="button-clas">
                <Button size='large' @click="pro" :loading="buttunLoading" style="background:#2083D8;color:#fff;padding: 6px 31px;font-size:16px;" >发送</Button>
            </div>
        </div>

        <div class="bookbuilding-table">
            <Row >
                <Col span="24" class="noemalTb th-header">
                    <span>短信通知记录</span>
                </Col>
            </Row>
            <div class="contain">
                <Row >
                    <Table size="small" stripe  :loading="loading" border :columns="ColumnsRecord" :data="this.dataList" ref="table" sortable="custom"  ></Table>
                </Row>
            </div>
            <!-- <div class="button-clas">
                <Button size='large' @click="pro" style="background:#2083D8;color:#fff;padding: 6px 31px;font-size:16px;" >下载记录表</Button>
                <Button size='large' @click="pro" style="background:#2083D8;color:#fff;padding: 6px 31px;font-size:16px;" >打印记录表</Button>
            </div> -->
        </div>
    </div>
</template>
<script>
import { formatDate } from '@/libs/date'
import {
  smsLitigantInfo,
  getMsgTemp,
  sendMsg,
  smsNoteList
} from "@/api/send";
export default {
    data(){
        return{
            caseInfo:{
                time:''
            },
            editState:false,
            loading:false,
            isLoading:false,
            buttunLoading:false,
            messageId:"",
            messageContain:"",
            phoneTips:'',
            sendObj:[],
            messageLit:[],
            data:[],
            relation:[],
            dataList:[],
            columns1:[
                {
                    title: '关系',
                    key: 'type',
                    width: '',
                    align: 'center'
                },
                 {
                    title: '当事人',
                    key: 'litigantNames',
                    width: '',
                    align: 'center'
                },
                {
                    title: '操作',
                    width: '',
                    align: 'center',
                 }
            ],
            ColumnsRecord:[
                {
                    title: "发送对象",
                    key: "sendName",
                    width: 170,
                    align:'center',
                    // fixed:'left',
                },
                {
                    title: "身份",
                    key: "roleType",
                    width: 120,
                    align:'center',
                },
                {
                    title: "拨打号码",
                    key: "dstNum",
                    // width: 170,
                    align:'center',
                    // fixed:'left',
                },
                {
                    title: "通信商回执信息",
                    key: "litigantType",
                    // width: 120,
                    align:'center',
                    render: (h, params) => {
                        if(params.row.status == 1){
                            return h(
                                'span',
                                {
                                    style:{
                                        color:'green'
                                    }
                                },
                               "发送成功"
                            );
                        }else{
                            return h(
                                'span',
                                {
                                    style:{
                                        color:'red'
                                    }
                                },
                               "发送失败"
                            );
                        }
                            
                    }
                },
                {
                    title: "发送时间",
                    key: "litigantType",
                    width: 150,
                    align:'center',
                    render: (h, params) => {
                            return h(
                                'span',
                                {},
                               params.row.sendTime ? formatDate(new Date(params.row.sendTime), 'yyyy-MM-dd hh:mm') : ""
                            );
                    }
                },
                {
                    title: "回执反馈时间",
                    key: "litigantType",
                    width: 150,
                    align:'center',
                    render: (h, params) => {
                            return h(
                                'span',
                                {},
                               params.row.reqTime ? formatDate(new Date(params.row.reqTime), 'yyyy-MM-dd hh:mm') : ""
                            );
                    }
                },
                {
                    title: "短信内容",
                    key: "subjectType",
                    width: 150,
                    align:'center',
                },
            ],
            Columns:[
                {
                    title: "姓名名称",
                    key: "litigantName",
                    width: 170,
                    align:'center',
                    // fixed:'left',
                },
                {
                    title: "诉讼地位",
                    key: "litigantType",
                    width: 120,
                    align:'center',
                    render: (h, params) => {
                        return h(
                            'span',
                            {},
                            params.row.litigationStatus ? params.row.litigationStatus.litigantStatusName : ""
                        );
                    }
                },
                {
                    title: "手机号码/法人手机",
                    key: "name",
                    width: 170,
                    align:'center',
                    render: (h, params) => {
                        return h(
                            'div',
                            {},
                            params.row.litigantPhones ? params.row.litigantPhones.map(item => {
                                return h('p', {
                                    style:{
                                        color:'#2d8cf0',
                                        cursor:'pointer'
                                    },
                                    on: {
                                        click: () => {
                                            let str = params.row.litigantName + "（"+ params.row.litigantType+"）："+item.phone + "；" ;
                                            let data = {
                                                name:params.row.litigantName,
                                                status:params.row.litigationStatus ? params.row.litigationStatus.litigantStatusName : "",
                                                phone:item.phone,
                                                id:params.row.id.toString(),
                                                str:str
                                            }
                                            
                                            this.sendObj.push(data)
                                            // console.log(this.sendObj)
                                            let r = 0;
                                            let phone = '';
                                            let id = '';
                                            for(let i=0;i<this.sendObj.length;i++){
                                                if(this.sendObj[i].id == params.row.id && this.sendObj[i].phone == item.phone ){
                                                    if(r == 1){
                                                        phone = item.phone;
                                                        id = params.row.id;
                                                        this.sendObj.splice(i,1);
                                                        i--;
                                                        break;
                                                    }
                                                    r = 1;
                                                }
                                            }
                                            this.phoneTips = "";
                                            for(let i=0;i<this.sendObj.length;i++){
                                                if(phone != '' && id != '' && this.sendObj[i].id == id && this.sendObj[i].phone == phone){
                                                    this.sendObj.splice(i,1);
                                                    i--;
                                                }else{
                                                    this.phoneTips = this.phoneTips + this.sendObj[i].str;
                                                }
                                                
                                            }
                                            console.log(this.sendObj)
                                        }
                                    },
                                }, item.phone);
                            }) : "无"
                        );
                    }
                },
                {
                    title: "户籍地址/注册地址",
                    key: "name",
                    width: 170,
                    align:'center',
                    render: (h, params) => {
                        return h(
                            'div',
                            {},
                            params.row.litigantAddresss ? params.row.litigantAddresss.map(item => {
                                if(params.row.litigantType == '自然人' && item.litigantAddressType == '户籍地址'){
                                    return h('p', {
                                    }, item.address);
                                }
                                if(params.row.litigantType == '法人' && item.litigantAddressType == '注册地址'){
                                    return h('p', {
                                    }, item.address);
                                }
                                
                            }) : "无"
                        );
                    }
                },
                {
                    title: "代理人",
                    key: "name",
                    align:'center',
                    width: 150,
                    render: (h, params) => {
                        return h(
                            'div',
                            {},
                            params.row.litigantLawyers ? params.row.litigantLawyers.map(item => {
                                return h('p', {
                                }, item.lawyer.agentName);
                                
                            }) : "无"
                        );
                    }
                },
                {
                    title: "代理人手机号",
                    key: "name",
                    align:'center',
                    render: (h, params) => {
                        return h(
                            'div',
                            {},
                            params.row.litigantLawyers ? params.row.litigantLawyers.map(item => {
                                return h('p', {
                                    style:{
                                        color:'#2d8cf0',
                                        cursor:'pointer'
                                    },
                                    on: {
                                        click: () => {
                                            let str = item.lawyer.agentName + "（代理人）："+item.lawyer.agentMobile + "；";
                                            let data = {
                                                name:item.lawyer.agentName,
                                                status:'代理人',
                                                phone:item.lawyer.agentMobile,
                                                id:item.lawyer.id.toString(),
                                                str:str,
                                            }
                                            this.sendObj.push(data)
                                            let r = 0;
                                            let id = '';
                                            for(let i=0;i<this.sendObj.length;i++){
                                                if(this.sendObj[i].id == item.lawyer.id ){
                                                    if(r == 1){
                                                        id = item.lawyer.id;
                                                        this.sendObj.splice(i,1);
                                                        i--;
                                                        break;
                                                    }
                                                    r = 1;
                                                }
                                            }
                                            this.phoneTips = "";
                                            for(let i=0;i<this.sendObj.length;i++){
                                                if(id != '' && this.sendObj[i].id == id){
                                                    this.sendObj.splice(i,1);
                                                    i--;
                                                }else{
                                                    this.phoneTips = this.phoneTips + this.sendObj[i].str;
                                                }
                                            }
                                            
                                        }
                                    },
                                }, item.lawyer.agentMobile);
                                
                            }) : "无"
                        );
                    }
                },
                // {
                //     title: "操作",
                //     key: "name",
                //     width: 150,
                //     fixed:'right'
                // },
            ],
            diplist:[
                {
                    name:'传票'
                },
                {
                    name:'传票（存根）'
                },
            ],

        }
    },
    methods:{
        /**
         * 选择邮件模板
         */
        selMessaheId(){
            console.log(this.messageId)
            for(let i=0;i<this.messageLit.length;i++){
                if(this.messageLit[i].id == this.messageId){
                    this.messageContain = this.messageLit[i].content;
                }
            }
        },
        addLitigantRelation(){

        },
        pro(){
            this.buttunLoading = true;
            let obj = {
                lawcaseId:this.$store.getters.caseId.toString(),
                msgTempId:this.messageId.toString(),
                user:this.sendObj
            }
            sendMsg(obj).then(res => {
                this.buttunLoading = false;
                if(res.data.state == 100){
                    
                    this.$Notice.success({
                        title: '',
                        desc: res.data.message,
                        duration: 3
                    });
                    this.init();
                }else{
                    this.$Notice.warning({
                        title: '',
                        desc: res.data.message,
                        duration: 5
                    });
                }
            })
            
        },
        init(){
            this.sendObj = [];
            this.phoneTips = "";
            this.messageId = "";
            this.isLoading = true;
            smsLitigantInfo(this.$store.getters.caseId).then(res => {
                this.isLoading = false;
                if(res.data.state == 100){
                    this.data = res.data.data;
                }
            })
            getMsgTemp().then(res => {
                if(res.data.state == 100){
                    this.messageLit = res.data.data;
                }
            })
            smsNoteList(this.$store.getters.caseId,10,1).then(res => {
                if(res.data.state == 100){
                    this.dataList = res.data.data;
                }
            })
        }
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

