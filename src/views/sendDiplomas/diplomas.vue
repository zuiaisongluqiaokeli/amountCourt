<style lang="less">
@import "./dipsmos.less";
</style>
<template>
<div class="caseInfo" style="position:relative">
    <Spin size="large" fix v-show="isLoading"></Spin>
    <Row >
        <Col span="24" class="change-tab">
            <div  class="selTab">
                <span>受送达文书材料列表</span>
            </div>
        </Col>
    </Row>
    <div v-show="sendList.length == 0" style="text-align:center">
        <h3>暂无数据</h3>
    </div>
    <div class="bookbuilding-table" v-for="(item,index) in sendList" style="border-bottom:1px solid #e9eaec;border-left:1px solid #e9eaec;margin-bottom:20px;">
        <Row >
            <Col span="24" class="noemalTb th-header">
                第{{item.sendNumber}}次受送达文书材料列表
            </Col>
        </Row>
        <Row >
            <Col span="2" class="noemalTb tb-head">
                发送时间
            </Col>
            <Col span="4" class="noemalTb">
                <span>{{ item.createDate | formatStartDate }}</span>
            </Col>
            <Col span="2" class="noemalTb tb-head">
                收到时间
            </Col>
            <Col span="4" class="noemalTb" v-if="item.receiveDate">
                <span>{{ item.receiveDate | formatStartDate }}</span>
            </Col>
            <Col span="4" class="noemalTb" else>
                <span>{{ '暂无' }}</span>
            </Col>
            <Col span="2" class="noemalTb tb-head">
                查看时间
            </Col>
            <Col span="4" class="noemalTb" v-if="item.firstViewDate">
                <span>{{ item.firstViewDate | formatStartDate }}</span>
            </Col>
            <Col span="4" class="noemalTb" else>
                <span>{{ '暂无' }}</span>
            </Col>
            <Col span="2" class="noemalTb tb-head">
                送达方式
            </Col>
            <Col span="4" class="noemalTb">
                <span>{{ item.sendType }}</span>
            </Col>
            <Col span="2" v-show="item.sendType == 'EMS送达'" class="noemalTb tb-head">
                邮单号
            </Col>
            <Col span="4" v-show="item.sendType == 'EMS送达'"  class="noemalTb">
                <span>{{ item.oddNumbers }}</span>
            </Col>
            <Col span="2" class="noemalTb tb-head">
                送达员
            </Col>
            <Col span="4" class="noemalTb">
                <span>{{ item.operatorName}}</span>
            </Col>
            <Col span="2" class="noemalTb tb-head">
                送达状态
            </Col>
            <Col :span="item.sendType == 'EMS送达' ? 10 :4" class="noemalTb">
                <span>{{ item.sendState}}</span>
            </Col>
            <Col span="2" class="noemalTb tb-head">
                受送达人
            </Col>
            <Col :span="item.sendType == 'EMS送达' ? 22 :10" class="noemalTb">
                <span>{{ item.litigant ? item.litigant.litigantName : '无'}}</span>
            </Col>
            <Col span="2" class="noemalTb tb-head">
                条款说明
            </Col>
            <Col span="22" class="noemalTb">
                <span>根据《管理办法》，诉讼方通过本平台诉讼的，法庭通过平台内电子送达渠道进行送达，除系统故障等非诉讼方规避送达情况外，无论诉讼方是否查收均视为有效送达。</span>
            </Col>
            <Col span="2" class="noemalTb tb-head">
                送达附言
            </Col>
            <Col span="22" class="noemalTb">
                <span>如需纸质文书，请自行打印或到法院领取纸质版。</span>
            </Col>
        </Row>
        <Row >
            <p><h4 style="padding-left:10px;margin:10px 0px;">本次送达文书列表</h4></p>
            <Col span="24" class="maininfo-warp">
                <Col  v-for="(d, key) in item.diplomsSends" :key="key" span="6" class="maininfo-col" style="overflow: hidden;">
                    <span>{{d.diplomsName}}</span>
                </Col>
            </Col>
        </Row>
        <Row v-if="item.content">
            <p><h4 style="padding-left:10px;margin:10px 0px;">物流信息</h4></p>
            <Collapse v-model="PanelValue">
                <Panel name="1">
                    查看物流
                    <p slot="content">
                        <Timeline>
                            <TimelineItem v-for="(item1,index)  in delEmsData(item.content)" :key="index">
                                <p class="time">{{item1.time}}</p>
                                <p class="content">{{item1.content}}</p>
                            </TimelineItem>
                        </Timeline>
                    </p>
                </Panel>
            </Collapse>
        </Row>
        <div class="button-clas">
            <Button size='large' @click="downAll(item)" style="background:#2083D8;color:#fff" >下载全部文书</Button>
            <Button size='large' @click="viewAll(item)" style="background:#2083D8;color:#fff" >打印全部文书</Button>
            <Button size='large' @click="sureSend(item)" style="background:#2083D8;color:#fff" >确认送达</Button>
        </div>
    </div>
    
</div>
</template>
<script>
import { formatDate } from '@/libs/date'
import {
  historySendList,
  downloadSendDiploms,
  viewDiploms,
  confirmSend,
  printEms
} from "@/api/send";
import { tools_downLoad } from '@/libs/tools.js';
export default {
    data(){
        return{
            caseInfo:{

            },
            isLoading:false,
            sendList:[
                {
                    time:'2018年12月11日',
                    num:'一'
                },
                {
                    time:'2018年12月13日',
                    num:'二'

                },
            ],
            catation:'',
            catation2:"",
            catation3:"",
            catation4:"",
            PanelValue:"0",
        }
    },
    // computed: {
    //     reverseSum() {
    //         return this.sendList.reverse();
    //     }
    // },
    mounted(){
        this.getList();
    },
    methods:{
        /**
         * 下载
         */
        downAll(data){
            let ary = [];
            for(let i=0;i<data.diplomsSends.length;i++){
                ary.push(data.diplomsSends[i].id)
            }
            downloadSendDiploms(
                data.id,
                ary.join(','),
                ""
            ).then(res => {
                 if(res.data.state == 100){
                    tools_downLoad(res.data.data)
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
         * 预览
         */
        viewAll(data){
            let ary = [];
            for(let i=0;i<data.diplomsSends.length;i++){
                ary.push(data.diplomsSends[i].id)
            }
            viewDiploms(ary.join(',')).then(res => {
                if(res.data.state == 100){
                    window.open(res.data.data)
                }else{
                    this.$Notice.warning({
                        title: '',
                        desc: res.data.message,
                        duration: 5
                    });
                }
            })
        },
        //确认送达
        sureSend(data){
            this.$Modal.confirm({
                title: '送达确认',
                content: '<p>确认是否送达？</p>',
                loading: true,
                onOk: () => {
                    let sendObj={
                        sendId:data.id,
                        litigantId:data.litigant.id,
                        lawCaseId:this.$store.getters.caseId,
                    }
                    confirmSend(sendObj).then(res => {
                        this.$Modal.remove();
                        if(res.data.state == 100){
                            this.getList();//刷新数据
                            this.$Notice.success({
                                title: '送达成功！',
                                duration: 3
                            });
                        }else{
                            this.$Notice.error({
                                title: '送达失败',
                                desc: res.data.message,
                                duration: 5
                            });
                        }
                    }).catch(error=>{
                        this.$Modal.remove();
                        // 处理前一个回调函数运行时发生的错误
                        this.$Notice.warning({
                            title: '发生错误！',
                            desc: error,
                            duration: 5
                        });
                    });
                },
                onCancel: () => {
                }
            });
        },
        getList(){
            this.isLoading = true;
            historySendList(this.$store.getters.caseId).then(res => {
                this.isLoading = false;
                if(res.data.state == 100){
                    this.sendList = res.data.data;
                    console.log(this.sendList)
                }
            })
        },
        delEmsData(emsData){//处理物流数据
            let ary=emsData.split("    ;");
            let newData=[];
            ary.forEach((item,index) => {
                let obj={
                   time:item.split("   |   ")[0],
                   content:item.split("   |   ")[1],
                }
                newData.push(obj);
            });
            console.log(newData)
            return newData;
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
  }

}
</script>

