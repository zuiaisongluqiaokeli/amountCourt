<template>
  <div class='muti-notice-window'>
    <Steps :current="mutNowIndex" class='ft-step1'>
        <Step :title="item.stepName"  v-for="(item,index) in mutiCaseStep" :key="index"></Step>
    </Steps>
    <div class='muti-notice-area'>
      <!-- step1 -->
      <Magenttype
      ref="Magenttype"
      v-show="mutNowIndex==0"
      @ft_muti_toStep2="ft_muti_toStep2"
      @jumpIt="jumpIt"
      ></Magenttype>
      <!-- step2 -->
      <Mprove
      v-show="mutNowIndex==1"
      ref="mProve"
      @ft_muti_toStep3="ft_muti_toStep3"
      @mSendBacktoStep1="mSendBacktoStep1"
       ></Mprove>
      <!-- step3 -->
      <Mevidence
      v-show="mutNowIndex==2"
      ref="mEvi"
      @mEvitoStep4="mEvitoStep4"
      @mSendBacktoStep2="mSendBacktoStep2"
       ></Mevidence>
       <!-- step4 -->
      <Magentsend
      v-show="mutNowIndex==3"
      ref="mSend"
      @mEvitoStep5="mEvitoStep5"
      @mSendBacktoStep3="mSendBacktoStep3"
      ></Magentsend>
      <!-- step5 -->
      <PreviewTemporary
      v-show="mutNowIndex==4"
      ref="PreviewTemporary"
      @mEvitoStep6="mEvitoStep6"
      @mSendBacktoStep4="mSendBacktoStep4"
      ></PreviewTemporary>
      <!-- step6 -->
      <Mutireview
      v-show="mutNowIndex==5"
      ref="mutiReview"
      @mview_backToStep1="mSendBacktoStep1"
      ></Mutireview>
    </div>
  </div>
</template>


<script>
import mutiCaseStep from "./Muticase.js";
import Magenttype from './Muticomponents/MagentType/Magenttype.vue' //要素模板批量导入
import Mprove from './Muticomponents/Mprove/Mprove.vue' //证明模板批量导入
import Mevidence from './Muticomponents/Mevidence/Mevidence.vue' //证据模板批量导入
import Magentsend from './Muticomponents/Magentsend/Magentsend.vue' //送达确认
import PreviewTemporary from './Muticomponents/Mpreview/PreviewTemporary.vue' //预览与暂存
import Mutireview from './Muticomponents/Mutireview/Mutireview.vue' //提交
export default {
  components:{
    Magenttype,
    Mevidence,
    Magentsend,
    PreviewTemporary,
    Mutireview,
    Mprove
  },
  data () {
    return {
      mutNowIndex:0,
      mutiCaseStep:mutiCaseStep,
      //子传来的选中数组
      mKeyInfoList:[],
    }
  },
  methods:{
    jumpIt(payload){
      this.mKeyInfoList = payload;
      this.$refs.mProve.mProveSendList(this.mKeyInfoList);
      this.$refs.mEvi.meEviSendList(this.mKeyInfoList);
      this.$refs.mSend.meEviSendList(this.mKeyInfoList);
      this.mutNowIndex = 3;
    },
    //进入第二步
    ft_muti_toStep2(payload) {
      this.mKeyInfoList = payload;
      this.$refs.mProve.mProveSendList(this.mKeyInfoList);
      this.mutNowIndex = 1;
    },

    //进入第三步
    ft_muti_toStep3(payload) {
      console.log(this.mKeyInfoList)
      this.mKeyInfoList = payload;
      this.$refs.mEvi.meEviSendList(this.mKeyInfoList);
      this.mutNowIndex = 2;
    },

    //进入第四步
    mEvitoStep4(payload) {
      console.log(this.mKeyInfoList)
      this.mKeyInfoList = payload;
      this.$refs.mSend.meEviSendList(this.mKeyInfoList);
      this.mutNowIndex = 3;
    },

    //进入第五步
    mEvitoStep5(payload) {
      this.mKeyInfoList = payload;
      this.$refs.PreviewTemporary.mreReceiveList(this.mKeyInfoList);
      this.mutNowIndex = 4;
    },

     //进入第六步
    mEvitoStep6(payload) {
      this.mKeyInfoList = payload;
      this.$refs.mutiReview.mreReceiveList(this.mKeyInfoList);
      this.mutNowIndex = 5;
    },

    //返回第一步
    mSendBacktoStep1 () {
      this.mutNowIndex = 0;
    },
    //返回第二步
    mSendBacktoStep2 () {
      this.mutNowIndex = 1;
    },
    //返回第三步
    mSendBacktoStep3 () {
      this.mutNowIndex = 2;
    },
    //返回第四步
    mSendBacktoStep4 () {
      this.mutNowIndex = 3;
    },
  }
}
</script>

<style scoped>
 @import './Muticase.css';
</style>

