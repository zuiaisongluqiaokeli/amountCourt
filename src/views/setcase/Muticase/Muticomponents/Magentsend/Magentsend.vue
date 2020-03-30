<template>
  <div class='ft-plant-div1'>
    <div class="ft-plant-div2">
      <Card>
         <Button type="primary" @click="openModel">{{ModleInfo.btnName}}</Button>
        <!-- 批量填写模板 -->
        <Form  label-position="right" :label-width="190"  :ref="'sendModel'" :model="sendModelData" :rules="ft_mSendRule" style="margin:0 auto;width:821px" v-show="ModleInfo.show">
            <FormItem label="指定送达人" class="ft_form ft-plant-chooseType ft-plant-slectType">
                <RadioGroup v-model="sendModelData.radioGroup" prop="radioGroup" class="ft-confirm-radio" @on-change="ModelSendChange" v-if="mSendList.length!=0">
                    <Radio :label="'plant0'" >{{mSendList[0].caseInfo.plaintiffs[0].name}}(原告)</Radio>
                    <Radio :label="'agent'+index2" v-for="(item2,index2) in mSendList[0].caseInfo.plaintiffs[0].layers" :key="index2">{{item2.agentName}}({{item2.agentType}})</Radio>
                </RadioGroup>
            </FormItem>

            <FormItem label="联系电话" class="ft_form ft-plant-chooseType" prop="servicePhone">
                <Input v-model="sendModelData.servicePhone" placeholder="请输入手机号码" @on-change="setAllInfo"></Input>
            </FormItem>

            <FormItem label="文书送达地址" class="ft_form ft-plant-chooseType" prop="serviceAddress">
              <Input v-model="sendModelData.serviceAddress" placeholder="请输入文书送达地址" @on-change="setAllInfo"></Input>
            </FormItem>

            <FormItem label="送达电子邮箱" class="ft_form ft-plant-chooseType" prop="serviceEmail">
              <Input v-model="sendModelData.serviceEmail" placeholder="请输入送达电子邮箱"  @on-change="setAllInfo"></Input>          
            </FormItem>

            <FormItem label="其他送达方式" class="ft_form ft-plant-chooseType  ft-plant-upload">
                <CheckboxGroup v-model="sendModelData.sendGroup" class='ft-confirm-checkbox'  @on-change="setAllInfo">
                    <Checkbox label='0' :disabled="true">站内告之</Checkbox>
                    <Checkbox label="1">微信公众号领取</Checkbox>
                </CheckboxGroup>
            </FormItem>
            <hr style='width:100%;border:1px solid #f5f6f7'></hr>
        </Form>
      </Card>
      <!-- 送达内容 -->
      <Collapse v-model="openPandel">
        <Panel :name="item.orderNo" v-for="(item,index) in mSendList" :key="index">
          <span>被告:</span>
          <span v-for="(that,index2) in item.caseInfo.defendants" :key="index2" class="beigaoStyle">{{that.name}}</span>
          <p slot="content">
            <Form :model="mSendBindData[index]" label-position="right" :label-width="190"  :ref="'mSendFromRule'+index" :rules="ft_mSendRule" style="margin:0 auto;width:821px">
                <FormItem label="原告确认" class="ft_form ft-plant-chooseType ft-plant-slectType">
                  <Tag color="#4873c5" :closable="false" style="font-size:16px;">{{item.caseInfo.plaintiffs[0].name}}</Tag>
                </FormItem>
                <FormItem label="指定送达人" class="ft_form ft-plant-chooseType ft-plant-slectType">
                    <RadioGroup v-model="mSendBindData[index].radioGroup" prop="radioGroup" @on-change="mSend_chgRadio(item.orderNo,index,$event)" class="ft-confirm-radio">
                        <Radio :label="'plant0'" >{{item.caseInfo.plaintiffs[0].name}}(原告)</Radio>
                        <Radio :label="'agent'+index2" v-for="(item2,index2) in item.caseInfo.plaintiffs[0].layers" :key="index2">{{item2.agentName}}({{item2.agentType}})</Radio>
                    </RadioGroup>
                </FormItem>

                <FormItem label="联系电话" class="ft_form ft-plant-chooseType" prop="servicePhone">
                    <Input v-model="mSendBindData[index].servicePhone" placeholder="请输入手机号码"></Input>
                </FormItem>

                <FormItem label="文书送达地址" class="ft_form ft-plant-chooseType" prop="serviceAddress">
                  <Input v-model="mSendBindData[index].serviceAddress" placeholder="请输入文书送达地址"></Input>
                </FormItem>

                <FormItem label="送达电子邮箱" class="ft_form ft-plant-chooseType" prop="mSendBindData">
                  <Input v-model="mSendBindData[index].serviceEmail" placeholder="请输入送达电子邮箱"></Input>          
                </FormItem>

                <FormItem label="其他送达方式" class="ft_form ft-plant-chooseType  ft-plant-upload">
                    <CheckboxGroup v-model="mSendBindData[index].sendGroup" class='ft-confirm-checkbox'>
                        <Checkbox label='0' :disabled="true">站内告之</Checkbox>
                        <Checkbox label="1">微信公众号领取</Checkbox>
                    </CheckboxGroup>
                </FormItem>
                <hr style='width:100%;border:1px solid #f5f6f7'></hr>
            </Form>
          </p>
        </Panel>
      </Collapse>
    </div>
      <div class='ft-agent-footer'>
        <a href="javascript:void(0)" class="ft-magent-btn4" style="margin-left:-110px"  @click="mSendBacktoStep3">返回上一步</a>
        <a href="javascript:void(0)" class="ft_public3 ft-magent-btn2" @click="mSendConfirmModal">下一步浏览与暂存</a>
      </div>
      <Mutisendmodal
      ref="mutiSend"
      @backtoMuti="mSendFinalConfirm"
      />
  </div>
</template>

<script>
import { deepClone } from "@/libs/tools.js";
import Mutisendmodal from '@/components/confirmation/confirmation.vue';
export default {
  components:{
    Mutisendmodal,
  },
  data () {
    return {
      mSendList:[], //获取到的数据
      mSendBindData:[],//绑定的数据
      sendModelData:{},//模板数据
      openPandel:[],//折叠面板要展开的面板
      ModleInfo:{
        show:true,//模板开关
        btnName:"关闭批量填写模板",
      },
      ft_mSendRule :{
        radioGroup: [
          { message: '请选择接收人', trigger: 'blur' }
        ],
        servicePhone: [
          { message: '请输入手机号', trigger: 'blur' },
          { type: 'string', pattern: /^[1][0-9][0-9]{9}$/, message: '请输入正确的手机号', trigger: 'change' }
        ],
        serviceAddress: [
          { required: true, message: '请输入送达地址', trigger: 'blur' }
        ],
        serviceEmail: [
          {  message: '请输入邮箱', trigger: 'blur' },
          { type: 'string', pattern: /^[0-9a-z][a-z0-9\._-]{1,}@[a-z0-9-]{1,}[a-z0-9](\.[a-z]{1,})+$/, message: '邮箱格式不正确', trigger: 'blur' }
        ],
      },
    }
  },
  methods:{
    //接收数据
    meEviSendList (payload) {
      this.mSendList = payload;
      // // //设置默认打开的面板
      // this.openPandel = [];
      // setTimeout(() => {
      //   this.openPandel.push(this.mSendList[0].orderNo);//默认打开第一个
      // }, 500);
      this.meSendDeal2();
      this.meSendDeal();
    },
    //处理数据，动态绑定表单规则
    meSendDeal () {
      let cnt = 0;
      this.mSendBindData = [];
      let sendObj = {};
      for (let i = 0; i < this.mSendList.length; i++) {
        this.mSendList[i].caseInfo.plaintiffs[0].plantId = 'plant'+ cnt;
        if(this.mSendList[i].caseInfo.plaintiffs[0].layers.length !== 0) {
          //默认送达为律师
          sendObj = {
            sendGroup:['0'], //推送方式
            radioGroup:this.mSendList[i].caseInfo.plaintiffs[0].layers[0].agentId, //送达人员
            servicePhone:this.mSendList[i].caseInfo.plaintiffs[0].layers[0].agentMobile, //送达电话，不可手动输入
            serviceAddress:this.mSendList[i].caseInfo.plaintiffs[0].layers[0].agentAddress, //送达地址
            serviceEmail:this.mSendList[i].caseInfo.plaintiffs[0].layers[0].agentMail, //送达地址
            serviceName:this.mSendList[i].caseInfo.plaintiffs[0].layers[0].agentName, //送达名称
          }
        }else{
          sendObj = {
            sendGroup:['0'], //推送方式
            radioGroup:this.mSendList[i].caseInfo.plaintiffs[0].plantId, //送达人员
            servicePhone:this.mSendList[i].caseInfo.plaintiffs[0].phone, //送达电话，不可手动输入
            serviceAddress:this.mSendList[i].caseInfo.plaintiffs[0].address, //送达地址
            serviceEmail:this.mSendList[i].caseInfo.plaintiffs[0].email, //送达地址
            serviceName:this.mSendList[i].caseInfo.plaintiffs[0].name, //送达名称
          }
        }
        this.mSendBindData.push(sendObj);
      }
      this.sendModelData={//模板数据
        radioGroup:this.mSendBindData[0].radioGroup,
        servicePhone:this.mSendBindData[0].servicePhone,
        serviceAddress:this.mSendBindData[0].serviceAddress,
        serviceEmail:this.mSendBindData[0].serviceEmail,
        serviceName:this.mSendBindData[0].serviceName,
        sendGroup:['0'],
      }
    },
    //处理数据，动态绑定表单规则
    meSendDeal2 () {
      for (let i = 0; i < this.mSendList.length; i++) {
        let cnt = 0;
        for (let j = 0; j < this.mSendList[i].caseInfo.plaintiffs[0].layers.length; j++) {
          this.mSendList[i].caseInfo.plaintiffs[0].layers[j].agentId = 'agent' + cnt;
          cnt ++;
        }
      }
    },

    //选择送达人变化事件
    mSend_chgRadio (orderNo,index,chgType) {
      console.log(chgType)
      console.log(this.mSendList)
    if(chgType.indexOf('plant') >-1) {
      this.mSendBindData[index].servicePhone = this.mSendList[index].caseInfo.plaintiffs[0].phone;
      this.mSendBindData[index].serviceAddress = this.mSendList[index].caseInfo.plaintiffs[0].address;
      this.mSendBindData[index].serviceEmail = this.mSendList[index].caseInfo.plaintiffs[0].email;
      this.mSendBindData[index].serviceName = this.mSendList[index].caseInfo.plaintiffs[0].name;
      }else if(chgType.indexOf('agent') >-1) {
        for (let i = 0; i < this.mSendList[index].caseInfo.plaintiffs[0].layers.length; i++) {
          if(chgType === this.mSendList[index].caseInfo.plaintiffs[0].layers[i].agentId) {
            this.mSendBindData[index].servicePhone = this.mSendList[index].caseInfo.plaintiffs[0].layers[i].agentMobile;
            this.mSendBindData[index].serviceAddress = this.mSendList[index].caseInfo.plaintiffs[0].layers[i].agentAddress;
            this.mSendBindData[index].serviceEmail = this.mSendList[index].caseInfo.plaintiffs[0].layers[i].agentMail;
            this.mSendBindData[index].serviceName = this.mSendList[index].caseInfo.plaintiffs[0].layers[i].agentName;
          }
        }
      }
    },
    //模板送达人改变事件
    ModelSendChange(chgType){
      console.log(chgType)
      for (var value of this.mSendList){//获取当事人信息
        if(chgType.indexOf('plant') >-1) {
          console.log(value)
          this.sendModelData.servicePhone = value.caseInfo.plaintiffs[0].phone;
          this.sendModelData.serviceAddress = value.caseInfo.plaintiffs[0].address;
          this.sendModelData.serviceEmail = value.caseInfo.plaintiffs[0].email;
          this.sendModelData.serviceName = value.caseInfo.plaintiffs[0].name;
          break;
          }else if(chgType.indexOf('agent') >-1) {//获取代理人信息
            for (let i = 0; i < value.caseInfo.plaintiffs[0].layers.length; i++) {
              if(chgType === value.caseInfo.plaintiffs[0].layers[i].agentId) {
                this.sendModelData.servicePhone = value.caseInfo.plaintiffs[0].layers[i].agentMobile;
                this.sendModelData.serviceAddress = value.caseInfo.plaintiffs[0].layers[i].agentAddress;
                this.sendModelData.serviceEmail = value.caseInfo.plaintiffs[0].layers[i].agentMail;
                this.sendModelData.serviceName = value.caseInfo.plaintiffs[0].layers[i].agentName;
                break;
              }
            }
        }
      }
      //设置统一的代理人信息
      this.setAllInfo();
    },
    //设置统一的代理人信息
    setAllInfo(){
      console.log(this.sendModelData)
      console.log(this.mSendBindData)
      this.mSendBindData.forEach((item,index) => {
        var newObj={
          radioGroup:this.sendModelData.radioGroup,
          serviceName:this.sendModelData.serviceName,
          servicePhone:this.sendModelData.servicePhone,
          serviceAddress:this.sendModelData.serviceAddress,
          serviceEmail:this.sendModelData.serviceEmail,
          sendGroup:this.sendModelData.sendGroup,
        }
        this.mSendBindData.splice(index, 1, newObj);
      });

      console.log(this.mSendBindData)
    },
    //确认送达事项
    mSendConfirmModal() {
      if(this.ft_confirm_judegeInfo()){
        this.$refs.mutiSend.showAgreeSendModal(this.mSendBindData,1);
      }else{
        this.$Notice.warning({'title':'请完善确认信息',duration: 5})
      }
    },

    //判断表单
    ft_confirm_judegeInfo () {
      let flag = true
      console.log(this.mSendBindData)
      this.mSendBindData.forEach((item,index)=>{
        let form = 'mSendFromRule' + index;
        console.log(this.$refs[form][0])
        this.$refs[form][0].validate((valid) => {
          console.log(valid)
          if (!valid) {
              flag = false;
          }
        });
      })
      return flag
    },

    //提交数据到下一步
    mSendFinalConfirm (toIntranet) {
      this.ft_mSend_changeSendMan();//清除原被告sendChoice属性
      // 提交数据
      for (let j = 0; j < this.mSendBindData.length; j++) {
        // 获取原告的送达信息
        if (this.mSendBindData[j].radioGroup.indexOf('plant') > -1)  {
            let strTemp = this.mSendBindData[j].sendGroup.join(',');
            //送达信息
            this.mSendList[j].caseInfo.plaintiffs[0].sendChoice = {
              serviceType:strTemp,
              serviceAddress:this.mSendBindData[j].serviceAddress,
              servicePhone:this.mSendBindData[j].servicePhone,
              serviceEmail:this.mSendBindData[j].serviceEmail,
            }
            // 获取律师的送达信息
        }  else if(this.mSendBindData[j].radioGroup.indexOf('agent') > -1) {
            for (let k = 0; k < this.mSendList[j].caseInfo.plaintiffs[0].layers.length; k++) {
              if(this.mSendBindData[j].radioGroup === this.mSendList[j].caseInfo.plaintiffs[0].layers[k].agentId) {
                let strTemp = this.mSendBindData[j].sendGroup.join(',');
                //送达信息
                this.mSendList[j].caseInfo.plaintiffs[0].layers[k].sendChoice = {
                  serviceType:strTemp,
                  serviceAddress:this.mSendBindData[j].serviceAddress,
                  servicePhone:this.mSendBindData[j].servicePhone,
                  serviceEmail:this.mSendBindData[j].serviceEmail,
                }
              }
            }
        }
        // 插入是否导入内网标签
        this.mSendList.forEach((item,index)=>{
           item.toIntranet=toIntranet;
        })
      }
      this.$emit('mEvitoStep5',this.mSendList);//提交数据到下一步
    },

    //返回上一步
    mSendBacktoStep3 () {//提交数据到下一步
      this.$emit('mSendBacktoStep3');
    },

    //送达人变化事件
    ft_mSend_changeSendMan () {
      //清除原告的sendChoice属性
      this.mSendList.forEach((val,index)=>{
        val.caseInfo.plaintiffs.forEach((plaval,plaindex)=>{
          if(plaval.hasOwnProperty('sendChoice')){
            delete plaval['sendChoice'];
            delete plaval['serviceType'];
          }
          //清除代理人的sendChoice属性
          plaval.layers.forEach((item,key) =>{
            if(item.hasOwnProperty('sendChoice')){
            delete item['sendChoice'];
            delete item['serviceType'];
            }
          })
       })
      })
    },
    //打开模板
    openModel(){
       if(this.ModleInfo.btnName.indexOf("开启")>-1){
          this.ModleInfo.btnName="关闭批量填写模板";
          this.ModleInfo.show=true;
       }else{
          this.ModleInfo.btnName="开启批量填写模板";
          this.ModleInfo.show=false;
       }
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
.beigaoStyle{
  margin: 0px 5px;
  background-color: #4873C5;
  color: white;
  padding: 0 10px;
  display: inline-block;
  border-radius: 10px;
  height: 30px;
  line-height: 30px;
}
</style>
