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
        @toNextStep="toNextStep"
        @editConfirmPlantInfo="editConfirmPlantInfo"
        @editAgentPlantInfo="editAgentPlantInfo"
        @getConfirmPlantInfo="init"
        :confirmPlantAry="confirmPlantAry"
        :agentAry="agentAry"
        ref="ftPlant1"
        >
        </Plantiiff>
        <!-- 第二步 -->
        <Accused
        v-show="nowIndex==1"
        @toNextStep="toNextStep"
        ref='ftAccused3'
        >
        </Accused>
        <!-- 第三步 -->
        <Keyinfo
        v-show="nowIndex==2"
        @toNextStep="toNextStep"
        ref="ftKeyinfo4"
        >
        </Keyinfo>
        <!-- 第四步 -->
        <Myevidence
        v-show="nowIndex==3"
        @toNextStep="toNextStep"
        ref="ftEvi4"
        ></Myevidence>
        <!-- 第五步 -->
        <PreviewTemporary
        v-show="nowIndex==4"
        ref="PreviewTemporary"
        @toNextStep="toNextStep"
        ></PreviewTemporary>
        <!-- 第六步 -->
        <Confirm
        v-show="nowIndex==5"
        ref="ftConfirm"
        @toNextStep="toNextStep"
        ></Confirm>
        <!-- 第七步 -->
        <!-- <Review
        v-show="nowIndex==6"
        @toNextStep="toNextStep"
        @ft_final_addForm="ft_final_addForm"
        ref="ftReview6"
        ></Review> -->
        <!-- 成功页面 -->
        <Singlesuccess
        v-show="nowIndex==6"
        @mSingle_backToStep1="mSingle_backToStep1"
        ref="ftSingleSuccess7"
        ></Singlesuccess>
    </div>
  </div>
</template>
<style lang='css' scoped>
@import "./newcase.css";
</style>
<script>
import caseStep from './casestep'; //导入步骤
import Plantiiff from './componets/Plantinfo/Plantiiff.vue'; //原告信息
import Plantagent from './componets/Plantagent/Plantagent.vue'; //原告代理人
import Accused from './componets/Accused/Accused.vue'; //被告信息
import Keyinfo from './componets/Keyinfo/Keyinfo.vue'; //要素信息
import Myevidence from './componets/Evidence/Evidence.vue'; //证据上传
import PreviewTemporary from './componets/Mpreview/PreviewTemporary.vue' //预览与暂存
import Confirm from './componets/Confirm/Confirm.vue'; //送达事项
import Review from './componets/Review/Review.vue'; //提交
import Singlesuccess from './componets/Singlesuccess/Singlesuccess.vue'; //成功页面
import { ftAddCaseSingle,single,defLitigantInfo,defLawyerInfo,findLawPlaintiffLawyerName,changeLawCaseToNormal,delLawCaseAll} from '@/api/setcase.js'
import { findLawCaseList} from "@/api/case";
import {deepClone}  from '@/libs/tools.js';

export default {
  inject:["reload"],
  components:{
    Plantiiff,
    Plantagent,
    Accused,
    Keyinfo,
    Myevidence,
    PreviewTemporary,
    Confirm,
    Review,
    Singlesuccess
  },
  data () {
    return {
      caseStep:caseStep,
      nowIndex:0,
      submitType:false,
      //获取的原告信息
      confirmPlantAry:[],
      //获取的代理人信息
      agentAry:[],
      //送达信息
      sendChoice:{},

      // 原告与被告
      plaintiffs:[], //原告列表
      defendants:[], //被告列表
      thirdPeople:[],//第三人列表
      evidence:[], //证据列表
      pic:[],//诉前材料
      allCaseList:[],//所有案件列表
      selectList:[],//选择的案件列表

      // 要素信息
      keyInfo:{},
    }
  },
  created(){
    this.$store.commit("getCaseRandom")
  },
  methods:{
    //切换步骤
    async toNextStep(payload) {
      console.log(payload)
      switch(payload.type){
        case '原告信息':
          this.plaintiffs = payload.plaintiffs; //获取原告列表
          if(payload.state=='next'){
            this.nowIndex=1;
          }
        break;
        case '被告信息':
          this.defendants = payload.data.accused_confirmList;//获取被告列表
          this.thirdPeople = payload.data.third_confirmList;//获取第三人列表
          if(payload.state=='next'){
            this.nowIndex=2;
          }else if(payload.state=='back'){
            this.nowIndex=0;
          }
        break;
        case '要素信息': 
          // 基础要素
          this.keyInfo=payload.newData
          if(this.keyInfo.state==1){
            this.nowIndex=3;
          }else if(this.keyInfo.state==0){
            this.nowIndex=1;
          }
         console.log("3333333",this.plaintiffs);
        break;
        case '证据信息':
          this.evidence = payload.eviCount;//获取证据列表
          this.pic=payload.suqianCaiLiao;//获取诉前材料
          console.log("pic",this.pic)
          if(payload.state=='next'){
            //提交暂存参数并回显信息
            let result= await this.ft_final_addForm(0);//0代表暂存。1代表不暂存
            if(result){//提交成功才到下一步
              this.$refs.PreviewTemporary.mreReceiveList(this.allCaseList);
              this.nowIndex = 4;
            }
          }else if(payload.state=='back'){
            this.nowIndex = 2;
          }
         console.log("444444",this.plaintiffs);

        break;
        case '浏览与暂存':
          if(payload.state=='next'){
            this.selectList = payload.selectList;//获取已选案件列表
            this.$refs.ftConfirm.ft_confirm_receivePayload(this.plaintiffs);//送达事项传入原被告信息绑定
            this.nowIndex = 5;
          }else if(payload.state=='back'){
            this.nowIndex = 3;
          }else if(payload.state=='continue'){
            //清除页面填写数据
            Object.assign(this.$refs.ftAccused3.$data, this.$refs.ftAccused3.$options.data())
            this.$refs.ftAccused3.clearError()//清除红色错误提示
            Object.assign(this.$refs.ftKeyinfo4.$data, this.$refs.ftKeyinfo4.$options.data())
            Object.assign(this.$refs.ftKeyinfo4.$refs.finance.$data, this.$refs.ftKeyinfo4.$refs.finance.$options.data())
            Object.assign(this.$refs.ftKeyinfo4.$refs.insurance.$data, this.$refs.ftKeyinfo4.$refs.insurance.$options.data())
            Object.assign(this.$refs.ftKeyinfo4.$refs.creditcard.$data, this.$refs.ftKeyinfo4.$refs.creditcard.$options.data())
            Object.assign(this.$refs.ftEvi4.$data, this.$refs.ftEvi4.$options.data())
            this.nowIndex=1;//回到第二步
            this.$refs.ftAccused3.backShow=false;//隐藏上一步按钮
            this.$refs.ftAccused3.$refs.nextBtn.style.marginLeft="210px";//下一步按钮居中
            this.$store.commit("getCaseRandom")//刷新案件标识
          }
         console.log("555555",this.plaintiffs);
        break;
        case '送达事项':
          this.sendChoice= payload.sendChoice;//送达信息
          if(payload.state=='next'){
            let sendAry=[]
            this.selectList.forEach((item,index)=>{
              let obj={
                lawCaseId:item.lawCaseId,
                flowNumber:item.flowNumber,
                ...this.sendChoice
              }
              sendAry.push(obj)
            })
            console.log("889977",sendAry)
            this.changeCase(sendAry);
          }else if(payload.state=='back'){
            this.plaintiffs = payload.plaintiffs;//原告、代理人信息
            this.nowIndex = 4;
          }
         console.log("555555",this.plaintiffs);
        break;
        // case '浏览提交':
        //   if(payload.state=='back'){
        //     this.nowIndex = 5;
        //   }
        //  console.log("666666",this.plaintiffs);
        // break;
      }
    },
    compare(property){//排序规则
      return function(a,b){
          var value1 = a[property];
          var value2 = b[property];
          return Number(value1) - Number(value2);
      }
    },
    //转暂存为正常案件
    changeCase(arr){
      let data=arr.sort(this.compare('flowNumber'));//转案件流水号为正序排序
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
      changeLawCaseToNormal(data).then(res=>{
        this.$Spin.hide();
        if(res.data.state === 100) {
          this.$Notice.success({'title':'提交成功'});
          this.nowIndex = 6;
        }else{
          this.$Notice.error({'title':res.data.message,duration: 5})
        }
      })
    },
    //提交暂存案件
    ft_final_addForm (type) {
      return new Promise((resolve, reject) => {
        this.submitType = type===0 ? false : true;
        console.log(this.plaintiffs);
        let data={
          //是否直接提交（true 直接提交 false 暂存 ） 
          submitType:this.submitType,
          //原告、被告、证据
          plaintiffs:this.plaintiffs,
          defendants:this.defendants,
          thirdPeople:this.thirdPeople,
          evidence:this.evidence,
          pic:this.pic,
          //要素信息
          ...this.keyInfo,
          // 立案标记
          remark:'0',
          //随机数标识
          rendom:this.$store.getters.caseRandom,
        }
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
                    },'案件暂存中，请稍后...')
                ])
            }
          });
          single(data).then(res=>{
            if(res.data.state === 100) {
              this.$Spin.hide();
              this.$Notice.success({'title':'提交成功'});
              resolve(true)
              if(!this.submitType){//如果是暂存则要回显数据
                this.$refs.PreviewTemporary.getBackCaseList()
              }
              this.nowIndex = 4;
            }else{
              resolve(false)
              this.$Spin.hide();
              this.$Notice.error({'title':res.data.message,duration: 5})
            }
          })
        }else{
          this.$Notice.warning({'title':"请选择案件类型",duration: 5})
        }
      })
    },
    //返回首页
    mSingle_backToStep1 () {
      // this.nowIndex = 0;
      // //清空表单数据
      // this.$refs.ftPlant1.ft_step1_restForm();
      // this.$refs.ftAccused3.ft_step3_restForm();
      // this.$refs.ftKeyinfo4.ft_step4_restForm();
      // this.$refs.ftEvi4.ft_step5_restForm();
      // Object.assign(this.$data, this.$options.data())
      // Object.assign(this.$refs.ftPlant1.$data, this.$refs.ftPlant1.$options.data())
      // Object.assign(this.$refs.ftAccused3.$data, this.$refs.ftAccused3.$options.data())
      // Object.assign(this.$refs.ftKeyinfo4.$data, this.$refs.ftKeyinfo4.$options.data())
      // Object.assign(this.$refs.ftEvi4.$data, this.$refs.ftEvi4.$options.data())
      // Object.assign(this.$refs.ftConfirm.$data, this.$refs.ftConfirm.$options.data())
      // Object.assign(this.$refs.ftReview6.$data, this.$refs.ftReview6.$options.data())
      // Object.assign(this.$refs.ftSingleSuccess7.$data, this.$refs.ftSingleSuccess7.$options.data())
      // this.init()
      // this.reload()
      this.$router.go(0)
    },
    init(){//初始化获取原告及代理人信息
      //设置请求参数
      let params = {
        pageNumber: 1,
        pageSize: 10,
        submitType:"暂存",//提交类型 已提交/暂存 法院端的统一都是已提交
        type:"所有案件",  //案件类型，枚举类型 已分案
      };
      //获取暂存案件
      findLawCaseList(params).then(res => {
        this.loading = false;
        if (res.data.state == 100) {
          let data=res.data.data;
          let list = data.lawCaseList;
          if(list.length!=0){//如果暂存列表不为空，则跳转到第二步，不再调用原先的接口获取所有原告、代理人数据
            this.$Modal.confirm({
              title: '暂存案件提示',
              content: '<p>发现当前有暂存的案件是否继续进行操作？选择取消将清空目前暂存的案件！</p>',
              loading: true,
              onOk: () => {//确认
                this.$Modal.remove();//关闭提示
                this.nowIndex=4;
                let obj={
                  plaintffName:list[0].plaintiffName,
                  plaintiffLawerName:list[0].plaintiffLawyerName,
                }
                //获取指定的原告。代理人数据
                findLawPlaintiffLawyerName(obj).then(res=>{
                  let data=res.data.data
                  this.plaintiffs=data;
                })
                //显示暂存案件
                this.$refs.PreviewTemporary.setBackCaseList(res)
              },
              onCancel: () => {//取消
                //获取原告、代理人信息
                this.getInfo()
                //发送清空暂存案件请求
                delLawCaseAll().then(res => {
                  if (res.data.state == 100) {
                    this.$Message.success(res.data.message);
                  }else{
                    this.$Message.info(res.data.message);
                  }
                });
              }
            });
          }else{
            //获取原告、代理人信息
            this.getInfo()
          }
        }else{
          this.$Message.info(res.data.message);
        }
      });
    },
    getInfo(){//获取原告、代理人信息
      defLitigantInfo().then(res=>{//原告
        if(res.data.state==100){
          this.confirmPlantAry=res.data.data;
        }else{
          this.$refs.ftPlant1.isConfirmPlantShow=false;
          this.$Notice.warning({
              desc: res.data.message,
              duration: 5
          });
        }
      })
      defLawyerInfo().then(res=>{//代理人
        if(res.data.state==100){
          this.agentAry=res.data.data;
        }else{
          this.$refs.ftPlant1.isAgentShow=false;
          this.$Notice.warning({
              desc: res.data.message,
              duration: 5
          });
        }
      })
    },
    editConfirmPlantInfo(info){//本次修改当事人信息
     console.log(info)
      for(let value of this.confirmPlantAry){
        if(value.id==info.id){
          switch(info.type){
            case "自然人":
              value.agentType="自然人";
              value.name=info.natureList.name;
              value.idcard=info.natureList.identityCard;
              value.birthday=info.natureList.litigantBirthday;
              value.sex=info.natureList.litigantSex;
              value.nation=info.natureList.litigantNation;
              for(let item of value.personAddresss){
                switch(item.addressType){
                  case "户籍地址":
                    item.address=info.natureList.litigantPermanentAddress;
                  break;
                  case "经常居住地址":
                    item.address=info.natureList.address;
                  break;
                  case "送达地址":
                    item.address=info.natureList.serviceAddress;
                  break;
                }
              }
              for(let item of value.personPhone){
                if(item.phoneType=="手机"){
                  item.phone=info.natureList.phone;
                  break;
                }
              }
              value.email=info.natureList.email;
              // value.provePath=info.natureList.businessLicense;// 获取多个个身份证明文件，后期需要多个的时候开启
              value.provePath=info.natureList.businessLicense[0];// 获取单个身份证明文件
              break;
            break;
            case "法人":
              value.agentType="法人";
              value.name=info.legealList.name;
              value.idcard=info.legealList.identityCard;
              for(let item of value.personAddresss){
                switch(item.addressType){
                  case "注册地址":
                    item.address=info.legealList.address;
                  break;
                  case "经营地址":
                    item.address=info.legealList.address1;
                  break;
                }
              }
              // value.provePath=info.legealList.businessLicense;// 获取多个单位证明文件，后期需要多个的时候开启
              value.provePath=info.legealList.businessLicense[0];// 获取单个单位证明文件
              for(let item of value.personPhone){
                if(item.phoneType=="固话"){
                  item.phone=info.legealList.phone;
                  break;
                }
              }
              value.email=info.legealList.email, // 单位电子邮箱
              value.legalName=info.legealList.legalManName // 法定代表人
              value.legalPhone=info.legealList.legalManPhone // 法定代表人手机号
              value.legalIdCard=info.legealList.legalManId // 法定代表人身份证号码
              // value.idcardPath=info.legealList.legalIdentity;// 获取多个法定代表人身份证明文件，后期需要多个的时候开启
              value.idcardPath=info.legealList.legalIdentity[0];// 获取单个法定代表人身份证明文件
              break;
            break;
            case "非法人组织":
              value.agentType="非法人组织";
              value.name=info.notlegealList.name;
              value.idcard=info.notlegealList.identityCard;
              for(let item of value.personAddresss){
                switch(item.addressType){
                  case "注册地址":
                    item.address=info.notlegealList.address;
                  break;
                  case "经营地址":
                    item.address=info.notlegealList.address1;
                  break;
                }
              }
              // value.provePath=info.notlegealList.businessLicense;// 获取多个单位证明文件，后期需要多个的时候开启
              value.provePath=info.notlegealList.businessLicense[0];// 获取单个单位证明文件
              for(let item of value.personPhone){
                if(item.phoneType=="固话"){
                  item.phone=info.notlegealList.phone;
                  break;
                }
              }
              value.email=info.notlegealList.email, // 单位电子邮箱
              value.legalName=info.notlegealList.legalManName // 法定代表人
              value.legalPhone=info.notlegealList.legalManPhone // 法定代表人手机号
              value.legalIdCard=info.notlegealList.legalManId // 法定代表人身份证号码
              // value.idcardPath=info.notlegealList.legalIdentity;// 获取多个法定代表人身份证明文件，后期需要多个的时候开启
              value.idcardPath=info.notlegealList.legalIdentity[0];// 获取单个法定代表人身份证明文件
              break;
            break;
          }
        }
      }
      console.log(info,this.confirmPlantAry)
    },
    editAgentPlantInfo(info){//本次修改代理人信息
     console.log(info)
      for(let value of this.agentAry){
        if(value.id==info.id){
          switch(info.type){
            case "律师":
              value.agentType=info.lawyerList.agentType;
              value.name=info.lawyerList.agentName;
              value.idcard=info.lawyerList.agentIdentiCard;
              value.lawyerType=info.lawyerList.lawyerType;
              value.empowerType=info.lawyerList.empowerType;
              value.lawerNum=info.lawyerList.lawerNum;
              for(let item of value.personPhone){
                if(item.phoneType=="手机"){
                  item.phone=info.lawyerList.agentMobile;
                  break;
                }
              }
              for(let item of value.personAddresss){
                if(item.addressType=="工作地址"){
                  item.address=info.lawyerList.agentAddress;
                  break;
                }
              }
              value.email=info.lawyerList.agentMail;
              value.lawFirm=info.lawyerList.lawFirm;

              // value.lawFirmLetter=info.lawyerList.lawFirmLetter; // 获取多个律师函文件，后期需要数组文件改为这个
              value.lawFirmLetter=info.lawyerList.lawFirmLetter[0];// 获取单个律师函文件

              // value.lawerCardUrl=info.lawyerList.lawerCardUrl;  // 获取多个律师执业证文件，后期需要数组文件改为这个
              value.lawerCardUrl=info.lawyerList.lawerCardUrl[0];// 获取单个律师执业证文件

              // value.commission=info.lawyerList.commission;  // 获取多个委托书文件，后期需要数组文件改为这个
              value.commission=info.lawyerList.commission[0];  // 获取单个委托书文件
            break;
            case "职工":
              value.agentType=info.workerList.agentType;
              value.name=info.workerList.agentName;
              value.idcard=info.workerList.agentIdentiCard;
              value.birthday=info.workerList.birthday;
              value.nation=info.workerList.nation;
              value.sex=info.workerList.sex;
              value.personAddresss=info.workerList.addressList;
              value.personPhone=info.workerList.phoneList;
              for(let item of value.personPhone){
                if(item.phoneType=="手机"){
                  item.phone=info.workerList.agentMobile;
                  break;
                }
              }
              for(let item of value.personAddresss){
                switch (value.addressType) {
                  case "户籍地址":
                    item.address=info.workerList.agentAddress;
                  break;
                  case "经常居住地址":
                    item.address=info.workerList.agentAddress1;
                  break;
                }
              }
              value.email=info.workerList.agentMail;
            break;
            case "公民":
              value.agentType=info.citizenList.agentType;
              value.name=info.citizenList.agentName;
              value.idcard=info.citizenList.agentIdentiCard;
              value.birthday=info.citizenList.birthday;
              value.nation=info.citizenList.nation;
              value.sex=info.citizenList.sex;
              value.personAddresss=info.citizenList.addressList;
              value.personPhone=info.citizenList.phoneList;
              for(let item of value.personPhone){
                if(item.phoneType=="手机"){
                  item.phone=info.citizenList.agentMobile;
                  break;
                }
              }
              for(let item of value.personAddresss){
                switch (value.addressType) {
                  case "户籍地址":
                    item.address=info.citizenList.agentAddress;
                  break;
                  case "经常居住地址":
                    item.address=info.citizenList.agentAddress1;
                  break;
                }
              }
              value.email=info.citizenList.agentMail;
              value.litigatRelation=info.citizenList.litigatRelation;
            break;
          }
        }
      }
      console.log(info,this.agentAry)
    },
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