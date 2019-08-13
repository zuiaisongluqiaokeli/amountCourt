<style lang="less">
@import "./../caseInfo.less";
</style>
<template>
<div class="caseInfo litigantInfo" style="position:relative">
    <Spin size="large" fix v-show="isLoading"></Spin>
    <div class="bookbuilding-table">
        <Row >
            <Col span="24" class="noemalTb th-header">
                退费信息
            </Col>
        </Row>
        <Row >
            <Col span="2" class="noemalTb tb-head">
                网申号
            </Col>
            <Col span="4" class="noemalTb">
                <span>{{ payInfo.netApplicationNo || '无'}}</span>
            </Col>
            <Col span="2" class="noemalTb tb-head">
                案号
            </Col>
            <Col span="4" class="noemalTb">
                <span>{{ payInfo.caseNo  || '无'}}</span>
            </Col>
            <Col span="2" class="noemalTb tb-head">
                标的（元）
            </Col>
            <Col span="4" class="noemalTb">
                <span>{{ payInfo.applyStandard || '无' }}</span>
            </Col>
            <Col span="2" class="noemalTb tb-head">
                立案案由
            </Col>
            <Col span="4" class="noemalTb">
                <span>{{ payInfo.brief || '无' }}</span>
            </Col>
        </Row>
        <Row >
            <Col span="2" class="noemalTb tb-head">
                诉讼费金额(元)
            </Col>
            <Col span="4" class="noemalTb">
                <span>{{ payInfo.litigationCost || '无'}}</span>
            </Col>
            <Col span="2" class="noemalTb tb-head">
                减免金额(元)
            </Col>
            <Col span="4" class="noemalTb">
                <span>{{ payInfo.reductionMoney || '无'}}</span>
            </Col>
            <Col span="2" class="noemalTb tb-head">
                减免条款
            </Col>
            <Col span="10" class="noemalTb">
                <span>{{ payInfo.reductionClause || '无'}}</span>
            </Col>
        </Row>
        <Row >
            <Col span="2" class="noemalTb tb-head">
                实际应缴(元)
            </Col>
            <Col span="4" class="noemalTb">
                <span>{{ payInfo.actualPay}}</span>
            </Col>
            <Col span="2" class="noemalTb tb-head">
                可退费用
            </Col>
            <Col span="4" class="noemalTb">
                <span>{{ payInfo.refund  || '无'}}</span>
            </Col>
            <Col span="2" class="noemalTb tb-head">
                退费说明
            </Col>
            <Col span="10" class="noemalTb">
                <span>{{ payInfo.refundRemark || '无'}}</span>
            </Col>
        </Row>
        
        <div class="btn">
            <Button style="background-color: #f5f5f5">申请退费</Button>
        </div>
    </div>
</div>
</template>
<script>
import { formatDate } from '@/libs/date'
import {
  litigationPay
} from "@/api/caseInfo";
export default {
    data(){
        return{
            payInfo:{},
            isLoading: false,
        }
    },
    methods:{
        getLitigationPay(){
            this.isLoading= true;
            litigationPay(this.$store.getters.caseId).then(res => {
                this.isLoading= false;
                if(res.data.state == 100){
                    this.payInfo = res.data.data;
                }else{
                    this.$Notice.warning({
                        title: '',
                        desc: res.data.message,
                        duration: 5
                    });
                }
            })
        },
    },
    filters: {
      formatDate(time) {
          if (time == '') {
              return '';
          }
          var date = new Date(time);
          return formatDate(date, 'yyyy-MM-dd');
      },
    },
}
</script>

