<style lang="less">
// @import "./../caseInfo.less";
@import "./common.less";
</style>
<template>
<div class="litigantInfo" style="position:relative">
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
                <span>{{ caseInfo.netApplicationNo ? caseInfo.netApplicationNo :'无'}}</span>
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
                <span>{{ caseInfo.brief ? caseInfo.brief.name : '无'}}</span>
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
                <span>{{caseInfo.lawCaseExamines ? caseInfo.lawCaseExamines : '无'}}</span>
            </Col>
        </Row>
        <Row >
            <Col span="2" class="noemalTb tb-head">
                案号
            </Col>
            <Col span="10" class="noemalTb">
                <span>{{ caseInfo.caseNo ? caseInfo.caseNo : '无'}}</span>
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
                <span>{{ caseInfo.endTrialDate | formatDate}}</span>
            </Col>
        </Row>
        <Row >
            <Col span="2" class="noemalTb tb-head">
                承办部门
            </Col>
            <Col span="10" class="noemalTb">
                <span>{{ caseInfo.court ? caseInfo.court.allName : '无'}}</span>
            </Col>
            <Col span="2" class="noemalTb tb-head">
                承办法官
            </Col>
            <Col span="4" class="noemalTb">
                <span>{{ caseInfo.judge ? caseInfo.judge.judge.name : '无'}}</span>
            </Col>
            <Col span="2" class="noemalTb tb-head">
                书记员姓名
            </Col>
            <Col span="4" class="noemalTb">
                <span>{{ caseInfo.clerk ? caseInfo.clerk.judge.name : '无'}}</span>
            </Col>
        </Row>
        <Row>
            <Col span="2" class="noemalTb tb-head">
                合议庭成员
            </Col>
            <Col span="22" class="noemalTb">
                <span>{{ caseInfo.peopleAssessors ? caseInfo.peopleAssessors : '无'}}</span>
            </Col>
            <Col span="2" class="noemalTb tb-head">
                案件信息备注
            </Col>
            <Col span="22" class="noemalTb">
                <span>{{ caseInfo.remark || '无'}}</span>
            </Col>
        </Row>
    </div>
    <Row class="bsDiv" style="margin-bottom: 20px;">
        <Col style="width:48%;float:left;box-shadow: 3px 3px 5px #DCDCDC;" >
            <Collapse value="1">
                <Panel name="1">
                    案件受理通知书（电子，线上审核通过后自动生成）
                    <div slot="content" class="elendi">
                        <zh-viewer :viewerId="'electronicsNotice'" :fileUrls="electronicsNotice"></zh-viewer>
                    </div>
                </Panel>
            </Collapse>
        </Col>
        <Col style="width:48%;float:right;box-shadow: 3px 3px 5px #DCDCDC;" >
            <Collapse value="1">
                <Panel name="1">
                    案件受理通知书（纸质扫描件）
                    <div slot="content" class="elendi">
                        <zh-viewer :viewerId="'paperIndictment'" :fileUrls="paperIndictment"></zh-viewer>
                    </div>
                </Panel>
            </Collapse>
        </Col>
    </Row>
    <div class="bookbuilding-table">
        <Row >
            <Col span="24" class="noemalTb th-header">
                联系与咨询
            </Col>
        </Row>
        <div>
            <Row >
                <Col span="8" class="noemalTb tb-head">联系对象</Col>
                <Col span="8" class="noemalTb tb-head">姓名</Col>
                <Col span="8" class="noemalTb tb-head">办公电话</Col>
            </Row>
            <Row v-for="(item,index) in judgeData" :key="index">
                <Col span="8" class="noemalTb">{{item.judge.judgeType}}</Col>
                <Col span="8" class="noemalTb">{{item.judge.name}}</Col>
                <Col span="8" class="noemalTb">{{item.judge.phone}}</Col>
            </Row>
        </div>
        
        <div class="warnTip">
            联系咨询时，请注意工作时间<br/>工作时间：<br/>夏令时：08:00-12:00;15:00-18:00<br/>冬令时：08:00-12:00;14:30-17:30
        </div>
    </div>
</div>
</template>
<script>
import { formatDate } from '@/libs/date'
import ZhViewer from '@/components/moreFileViewer/moreFileViewer.vue';
import {
  lawCaseQuery
} from "@/api/caseInfo";
export default {
    components:{
        ZhViewer
    },
    data(){
        return{
            caseInfo:[],
            isLoading: false,
            judgeData: [],
            clerk: String,
            electronicsNotice: [],//电子
            paperIndictment: [],//纸质
        }
    },
    mounted(){
        this.lawCaseQuery(this.caseId);
    },
    methods:{
        lawCaseQuery(caseId){
            this.isLoading = true;
            if(!caseId)  return false;
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
                    //获取案由并保存（其他同级选项卡需要用到，勿删）                    
                    this.$store.commit("SET_BREIFNAME",data.brief.name);

                    if(!res.data.data[0].clerk){
                        this.judgeData=data.clerk;
                    }
                    this.electronicsNotice=[];
                    this.paperIndictment=[];
                    this.electronicsNotice.push(data.electronicsNotice==null ? '' : data.electronicsNotice);
                    this.paperIndictment.push(data.paperNotice==null ? '' : data.paperNotice);
                    console.log(data)
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
    computed: {
        changeMemberTab() {
            return this.$store.getters.caseId;
        },
    },
}
</script>

