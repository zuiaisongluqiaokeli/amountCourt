<template>
<div>
  <div class="ft_d1" ref="ft_d1">
    <Steps :current="nowIndex" class='ft-step1'>
        <Step :title="item.stepName"  v-for="(item,index) in caseStep" :key="index"></Step>
    </Steps>
  </div>
    <div class="ft_d3">
      <!-- 第一步 -->
      <Plantiiff
      v-show="nowIndex==0"
      @ft_nextStep_tab="ft_nextStep_tab"
      ref="ftPlant1"
      >
      </Plantiiff>
        <!-- 第二步 -->
      <Plantagent
      v-show="nowIndex==1"
      @ft_agent_backStep="ft_agent_backStep"
      @ft_index_toStep="ft_index_toStep"
      ref="ftAgent2"
      >
      </Plantagent>
      <!-- 第三步 -->
      <Accused
      v-show="nowIndex==2"
      @ft_accused_backToStep2="ft_accused_backToStep2"
      ref='ftAccused3'
      >
      </Accused>
      <!-- 第四步 -->
      <Keyinfo
      v-show="nowIndex==3"
      @toNextStep="ft_toStep5"
      ref="ftKeyinfo4"
      >
      </Keyinfo>
      <!-- 要素展示 -->
      <!-- 第五步 -->
      <Myevidence
      v-show="nowIndex==4"
      @ft_evi_toStep6="ft_evi_toStep6"
      @ft_evi_backToStep4="ft_evi_backToStep4"
      ref="ftEvi4"
      ></Myevidence>
      <!-- 第六步 -->
      <Confirm
      v-show="nowIndex==5"
      ref="ftConfirm"
      @ft_toFinalStep="ft_toFinalStep"
      @ft_backToStep5="ft_backToStep5"
      ></Confirm>
      <!-- 第七步 -->
      <Review
      v-show="nowIndex==6"
      @ft_review_backToStep6="ft_review_backToStep6"
      @ft_final_addForm="ft_final_addForm"
      ref="ftReview6"
      ></Review>
      <!-- 成功页面 -->
      <Singlesuccess
      v-show="nowIndex==7"
      @mSingle_backToStep1="mSingle_backToStep1"
      ref="ftSingleSuccess7"
      ></Singlesuccess>
    </div>
  </div>
</template>

<script>
import './newcase.css'; //导入样式
import  caseStep from './casestep'; //导入步骤
import Plantiiff from './componets/Plantinfo/Plantiiff.vue'; //原告信息
import Plantagent from './componets/Plantagent/Plantagent.vue'; //原告代理人
import Accused from './componets/Accused/Accused.vue'; //被告信息
import Keyinfo from './componets/Keyinfo/Keyinfo.vue'; //要素信息
import Myevidence from './componets/Evidence/Evidence.vue'; //证据上传
import Confirm from './componets/Confirm/Confirm.vue'; //送达事项
import Review from './componets/Review/Review.vue'; //预览与提交
import Singlesuccess from './componets/Singlesuccess/Singlesuccess.vue'; //预览与提交
import { ftAddCaseSingle } from '@/api/setcase.js' //提交事件
export default {
  inject:["reload"],
  components:{
    Plantiiff,
    Plantagent,
    Accused,
    Keyinfo,
    Myevidence,
    Confirm,
    Review,
    Singlesuccess
  },
  data () {
    return {
      caseStep:caseStep,
      nowIndex:0,
      submitType:false,
      toIntranet:true,//是否导入内网
      // 原告与被告
      plaintiffs:[], //原告列表
      defendants:[], //被告列表
      thirdPeople:[],//第三人列表
      evidence:[], //证据列表
      pic:[],//诉前材料
      // 要素信息
      keyInfo:{},
    }
  },
  methods:{
    //第一步切换至第二步
    ft_nextStep_tab(payLoad) {
      this.nowIndex = parseInt(payLoad.nowIndex);
      this.plaintiffs = payLoad.plaintiffs; //得到原告列表
      document.getElementsByClassName('single-page-con')[0].scrollTop = 0;
    },

    //第二步返回上一步
    ft_agent_backStep (index) {
      this.nowIndex = parseInt(index);
    },

    //跳过第二步&第二步切换至第三步
    ft_index_toStep (payload) {
      switch (payload.state) {
        case '1':
          this.plaintiffs = payload.list
          this.nowIndex = 2;
          break;
        case '2':
          this.nowIndex = 2;
          break
        default:
          break;
      }
    },

    //第三步返回第二步&第三步进入到第四步
    ft_accused_backToStep2 (payload) {
      if(payload.type === 0) {
        this.nowIndex = 1;
      }else{
        this.nowIndex = 3;
        this.$refs.ftKeyinfo4.init();//获取案由
      }
      this.defendants = payload.data.accused_confirmList;
      this.thirdPeople = payload.data.third_confirmList;
    },

    //第四步进入第五步&第四步返回第三步
    ft_toStep5 (payload) {
      // 基础要素
      this.keyInfo=payload.newData
      if(this.keyInfo.state === 1) {
        this.nowIndex = 4;
        //this.$refs.ftEvi4.essData(payload.newData)
      }else if(this.keyInfo.state === 0) {
        this.nowIndex = 2;
      }
    },

    //第五步进入第六步
    ft_evi_toStep6(payload) {
      this.evidence = payload.eviCount;
      this.pic = payload.suqianCaiLiao;
      this.$refs.ftConfirm.ft_confirm_receivePayload(this.plaintiffs);
      this.nowIndex = 5;
    },

    //第五步返回第四步
    ft_evi_backToStep4 (payload) {
      this.evidence = payload.eviCount;
      this.pic = payload.suqianCaiLiao;
      this.nowIndex = 3;
    },

    //第六步进入第七步
    ft_toFinalStep (payload) {
      this.plaintiffs = payload.plaintiffs;
      this.toIntranet = payload.toIntranet;
      this.nowIndex = 6;
    },

    //第六步返回第五步
    ft_backToStep5 (payload) {
      this.plaintiffs = payload;
      this.nowIndex = 4;
    },

    //第七步返回第六步
    ft_review_backToStep6 () {
      this.nowIndex = 5;
    },

    //提交
    ft_final_addForm (type) {
      this.submitType = type===0 ? false : true;
      let data={
        //是否直接提交（true 直接提交 false 暂存 ） 
        submitType:this.submitType,
        //原告、被告、第三人、证据
        plaintiffs:this.plaintiffs,
        defendants:this.defendants,
        thirdPeople:this.thirdPeople,
        evidence:this.evidence,
        toIntranet:this.toIntranet,
        pic:this.pic,
        //要素信息
        ...this.keyInfo,
        // 立案标记
        remark:'0',
      }
      //发送提交
      if(data.lawCaseType){
        //加载中提示
        this.$Spin.show({
          render: (h) => {
              return h('div', [
                  h('Icon', {
                      'class': 'demo-spin-icon-load',
                      props: {
                          type: 'load-c',
                          size: 50
                      }
                  }),
                  h('div', {
                    style:{
                      fontSize: '30px',
                    }
                  },'案件提交中，请稍后...')
              ])
          }
        });
        ftAddCaseSingle(data).then(res=>{
          if(res.data.state === 100) {
            this.$Spin.hide();
            this.$Notice.success({'title':'提交成功'});
            this.nowIndex = 7;
          }else{
            this.$Spin.hide();
            this.$Notice.error({'title':res.data.message,duration: 5})
          }
        })
      }else{
        this.$Notice.warning({'title':"请选择案件类型",duration: 5})
      }
    },
    //返回首页
    mSingle_backToStep1 () {
      // this.nowIndex = 0;
      // //清空表单数据
      // this.$refs.ftPlant1.ft_step1_restForm();
      // this.$refs.ftAgent2.ft_step2_restForm();
      // this.$refs.ftAccused3.ft_step3_restForm();
      // this.$refs.ftKeyinfo4.ft_step4_restForm();
      // this.$refs.ftEvi4.ft_step5_restForm();
      // this.reload();
      this.$router.go(0)
    }
  }
}
</script>
<style>
/*加载中icon样式*/
.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>