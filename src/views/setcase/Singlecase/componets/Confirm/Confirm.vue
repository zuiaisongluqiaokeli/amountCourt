<template>
  <div class='ft-plant-div1'>
    <div class="ft-plant-div2">
      <Form :model="confirm_bindData[index]" label-position="right" :label-width="190" :rules="ft_confirmRule" :ref="'confirmFromRule'+index" style="margin:0 auto;width:821px" v-for="(item,index) in confirm_plantiff">
          <FormItem label="原告确认" class="ft_form ft-plant-chooseType ft-plant-slectType">
            <Tag closable color="#4873c5" :closable="false" style="font-size:16px;">{{item.name}}</Tag>
          </FormItem>
          <FormItem label="指定送达人" class="ft_form ft-plant-chooseType ft-plant-slectType">
              <RadioGroup v-model="confirm_bindData[index].radioGroup" prop="radioGroup" @on-change="ft_confirm_changeSendMan(index,$event)" class="ft-confirm-radio">
                  <Radio :label="item.plantiffId" >{{item.name}}(原告)</Radio>
                  <Radio :label="item2.agPlantId" v-for="(item2,index2) in item.layers">{{item2.agentName}}({{item2.agentType}})</Radio>
              </RadioGroup>
          </FormItem>

          <FormItem label="联系手机号码" class="ft_form ft-plant-chooseType" prop="servicePhone">
              <!-- <Tag color="#4873c5" style="font-size:16px;">{{confirm_bindData[index].servicePhone}}</Tag> -->
              <Input v-model="confirm_bindData[index].servicePhone" placeholder="请输入手机号码"></Input>
          </FormItem>

          <FormItem label="送达地址" class="ft_form ft-plant-chooseType" prop="serviceAddress">
            <Input v-model="confirm_bindData[index].serviceAddress" placeholder="请输入送达地址"></Input>
          </FormItem>

          <FormItem label="送达电子邮箱" class="ft_form ft-plant-chooseType" prop="serviceEmail">
              <Input v-model="confirm_bindData[index].serviceEmail" placeholder="请输入送达电子邮箱"></Input>
          </FormItem>

          <FormItem label="其他送达方式" class="ft_form ft-plant-chooseType  ft-plant-upload">
              <CheckboxGroup v-model="confirm_bindData[index].checkAllGroup" class='ft-confirm-checkbox'>
                  <Checkbox label='0' :disabled="true">站内告之</Checkbox>
                  <Checkbox label="1">微信公众号领取</Checkbox>
              </CheckboxGroup>
          </FormItem>
      <hr style='width:100%;border:1px solid #f5f6f7'></hr>
      </Form>
      <div class='ft-agent-footer'>
        <a href="javascript:void(0)" class="ft-agent-btn1" style="margin-left:-110px" @click="ft_backToStep5">返回上一步</a>
        <a href="javascript:void(0)" class="ft_public3" @click="ft_confirmSendInfo">下一步，预览与提交</a>
      </div>
    </div>
    <ConfrimModal
    ref='ftConfirmModal'
    @backtoSingle="ft_confirmFinalInfo"
    />
  </div>
</template>


<script>
import step6Confirm from './confirm.js';
import ConfrimModal from '@/components/confirmation/confirmation.vue';
export default {
  components:{
    ConfrimModal,
  },
  data () {
    return {
      ft_confirmRule:step6Confirm.ft_confirmRule,
      checkAllGroup:['0'],
      confirm_plantiff:[], //原告信息
      confirm_bindData:[], //动态绑定list当中的数据
    }
  },
  methods:{

    //接受父组件的plantiff
    ft_confirm_receivePayload (payload) {
      this.confirm_plantiff = payload;
      this.ft_confirm_dealData();
    },

    //处理数据
    ft_confirm_dealData () {
      let lenTemp = this.confirm_plantiff.length;
      this.confirm_bindData = [];
      for (let index = 0; index < lenTemp; index++) {
        let confirmTemp = {
          radioGroup:this.confirm_plantiff[index].plantiffId, //送达人
          servicePhone:this.confirm_plantiff[index].phone, //送达电话
          serviceAddress:this.confirm_plantiff[index].serviceAddress, //送达地址
          serviceEmail:this.confirm_plantiff[index].email, //送达邮箱
          checkAllGroup:['0'], //送达方式
          serviceName:this.confirm_plantiff[index].name, //送达人名称
        }
        this.confirm_bindData.push(confirmTemp)
      }
    },

    //送达确认书
    ft_confirmSendInfo () {
      if(this.ft_confirm_judegeInfo()){
        this.$refs.ftConfirmModal.showAgreeSendModal(this.confirm_bindData,0);
      }else{
        this.$Notice.warning({'title':'请完善确认信息'})
      }
    },

    //提交表单数据到父级
    ft_confirmFinalInfo (toIntranet) {
        this.ft_clearSendChoice();
        this.confirm_bindData.forEach((val,index)=>{
          //选择送达的对象为原告
          if(val.radioGroup.indexOf('plant') > -1) {
             this.confirm_plantiff[index].sendChoice = {
                servicePhone:val.servicePhone,
                serviceName:val.serviceName,
                serviceAddress:val.serviceAddress,
                serviceEmail:val.serviceEmail,
                serviceType:val.checkAllGroup.join(',')
             }
          //选择送达的对象为代理人
          }else if(val.radioGroup.indexOf('agent') > -1) {
            this.confirm_plantiff[index].layers.forEach((item,key) =>{
              if(item.agPlantId === val.radioGroup) {
                this.confirm_plantiff[index].layers[key].sendChoice ={
                  servicePhone:val.servicePhone,
                  serviceName:val.serviceName,
                  serviceAddress:val.serviceAddress,
                  serviceEmail:val.serviceEmail,
                  serviceType:val.checkAllGroup.join(',')
                }
              }
            })
          }
        })
        this.$emit('ft_toFinalStep',{plaintiffs:this.confirm_plantiff,toIntranet});
        this.$Notice.success({'title':'添加成功'});
    },

    //清空表单内原送达信息，防止返回上一步信息重复
    ft_clearSendChoice () {
      //清除原告sendChoice
      this.confirm_plantiff.forEach((val,index)=>{
        if(val.hasOwnProperty('sendChoice')){
          delete val['sendChoice'];
          delete val['serviceType'];
        }
        val.layers.forEach((item,key)=>{
          if(item.hasOwnProperty('sendChoice')){
            delete item['sendChoice'];
            delete item['serviceType'];
            }
         })
      })
    },

    //判断表单
    ft_confirm_judegeInfo () {
      let flag = true
      this.confirm_bindData.forEach((item,index)=>{
          let form = 'confirmFromRule' + index;
          this.$refs[form][0].validate((valid) => {
            if (!valid) {
               flag = false;
            }
        });
      })
      return flag
    },

    //送达人变化事件
    ft_confirm_changeSendMan (index,event) {
        console.log("6666",this.confirm_plantiff)
      if(event.indexOf('plant') > -1) {
        this.confirm_bindData[index].servicePhone = this.confirm_plantiff[index].phone;
        this.confirm_bindData[index].serviceName = this.confirm_plantiff[index].name;
        this.confirm_bindData[index].serviceEmail = this.confirm_plantiff[index].email;
        this.confirm_bindData[index].serviceAddress = this.confirm_plantiff[index].serviceAddress;
      }else if (event.indexOf('agent') > -1) {
        this.confirm_plantiff[index].layers.forEach((item,key) =>{
          if(item.agPlantId === event) {
            this.confirm_bindData[index].servicePhone  = this.confirm_plantiff[index].layers[key].agentMobile;
            this.confirm_bindData[index].serviceName  = this.confirm_plantiff[index].layers[key].agentName;
            this.confirm_bindData[index].serviceEmail  = this.confirm_plantiff[index].layers[key].agentMail;
            this.confirm_bindData[index].serviceAddress  = this.confirm_plantiff[index].layers[key].agentAddress;
          }
        })
      }
    },

    //返回上一步
    ft_backToStep5 () {
      this.$emit('ft_backToStep5',this.confirm_plantiff);
    },

  }
}
</script>

<style scoped>
 @import './confirm.css';
 @import '../../casecommon/casereset.css';
</style>

