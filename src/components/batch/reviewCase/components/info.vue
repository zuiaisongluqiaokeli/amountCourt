<style lang="less">
// @import "./../caseInfo.less";
@import "./common.less";
</style>
<template>
<div class="litigantInfosS" style="position:relative">
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
                <span>{{ caseInfo.netApplicationNo}}</span>
            </Col>
            <Col span="2" class="noemalTb tb-head">
                标的（元）
            </Col>
            <Col span="4" class="noemalTb">
                <span>{{ caseInfo.applyStandard }}</span>
            </Col>
            <Col span="2" class="noemalTb tb-head">
                案件类型
            </Col>
            <Col span="4" class="noemalTb">
                <span>{{ caseInfo.brief ? caseInfo.brief.name : "" }}</span>
            </Col>
            <Col span="2" class="noemalTb tb-head">
                网申时间
            </Col>
            <Col span="4" class="noemalTb">
                <span>{{ caseInfo.receiceDate | formatDate }}</span>
            </Col>
            
        </Row>
    </div>
    <div class="bookbuilding-table">
        <Row >
            <Col span="24" class="noemalTb th-header">
                起诉状
            </Col>
        </Row>
        <Card>
            <Row class="tabs" style="">
                <Col span="3" align="left" valign="middle" class="Tbs height-wit tb-head" style="position:absolute;">
                    诉讼请求
                </Col>
                <Col span="21" align="left" class="Tbs height-wit" style="float: right;">
                    <span>{{litigationRequest}}</span>
                </Col>
            </Row>

            <Row class="tabs" style="margin-top:15px;">
                <Col span="3" class="Tbs height-wit tb-head" style="position:absolute;">
                    事实与理由
                </Col>
                <Col span="21" class="Tbs height-wit" style="float: right;">
                    <span>{{reason}}</span>
                </Col>
            </Row>

        </Card>
    </div>
</div>
</template>
<script>
import { formatDate } from '@/libs/date'
// import '../../../../static/viewer/viewer.css'
// import Viewer from '@/libs/viewer'
import {
  lawCaseQuery,
  indictment
} from "@/api/caseInfo";
export default {
    data(){
        return{
            caseInfo:[],
            // caseId:this.changeMemberTab,
            judgeData: [],
            catation3:'1',
            catation4:'1',
            value1: 0,
            isLoading:false,
            litigationRequest:"暂无数据",
            reason:"暂无数据",
            value2: 0,
            setting: {
                dots: 'outside',
                radiusDot: true
            },
            loading:false,
            clerk: String,
            hackReset: false,
            electronicsNotice: '',//电子
            paperIndictment: '',//纸质
        }
    },
    methods:{
        lawCaseQuery(caseId){
            if(!caseId)  return false;
            console.log(999)
            this.isLoading = true;
            lawCaseQuery(caseId).then(res => {
                this.isLoading = false;
                if(res.data.state == 100){
                    let data = res.data.data[0];
                    this.caseInfo = data;
                    //获取原告类型并保存（其他同级选项卡需要用到，勿删）
                    this.$store.commit("SET_litigantType",data.plaintiffList[0].litigantType);
                    //获取代理人类型并保存（其他同级选项卡需要用到，勿删）
                    let agenTypes=[];
                    data.plaintiffList[0].litigantLawyers.forEach((item,index) => {
                        agenTypes.push(item.lawyer.agentType)
                    });
                    this.$store.commit("SET_agentType",agenTypes);

                    if(!res.data.data[0].clerk) this.judgeData=data.clerk;
                    console.log('this.caseInfo',this.caseInfo) 
                    //可设置或返回当前 URL 的协议。
                    let protocolStr = document.location.protocol;
                    //可返回下载当前文档的服务器域名
                    let k_host = document.domain;
                    let htStr =  protocolStr + "//" + k_host + "/";
                    this.electronicsNotice = htStr + data.electronicsNotice;
                    this.paperIndictment = htStr + data.paperNotice;
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
            indictment(caseId).then(res => {
                this.isLoading = false;
                if(res.data.state == 100){
                    let data = res.data.data;
                    this.litigationRequest = data.litigationRequest;
                    this.reason = data.reason;
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
    filters: {
      formatDate(time) {
          if (time == '') {
              return '';
          }
          var date = new Date(time);
          return formatDate(date, 'yyyy-MM-dd');
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

