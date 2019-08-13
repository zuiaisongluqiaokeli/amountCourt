<template>
  <div class="ft-plant-div1">
    <div class="ft-plant-div2">
      <Form
        :model="keyList"
        label-position="right"
        :label-width="230"
        :rules="keyRule"
        ref="keyFromRule"
        style="margin:40px auto;width:821px"
      >
        <FormItem label="案号" class="ft_form ft-plant-chooseType" prop="caseNo">
          <Input v-model="keyList.caseNo" placeholder="请输入案号（非必填）"></Input>
        </FormItem>
        <FormItem
          label="案件类型"
          class="ft_form ft-plant-chooseType ft-plant-slectType"
          prop="lawCaseType"
        >
          <Select v-model="keyList.lawCaseType" style="width:300px" placeholder="请选择案件类型" filterable>
            <Option value="1">金融借款合同纠纷</Option>
            <Option value="2">保证保险合同追偿</Option>
            <Option value="3">信用卡纠纷</Option>
            <Option value="4">融资租赁合同纠纷</Option>
            <Option value="5">保险人代位求偿</Option>
            <Option value="6">金融不良债权追偿</Option>
            <Option value="0">其他案件</Option>
          </Select>
        </FormItem>
        <FormItem label="诉讼标的(元)" class="ft_form ft-plant-chooseType" prop="applyStandard">
          <Input v-model="keyList.applyStandard" @on-blur="onNumberChange($event,keyList,'applyStandard')" placeholder="请输入诉讼标的"></Input>
        </FormItem>
        <FormItem label="诉讼请求" class="ft_form ft-plant-chooseType" prop="litigationRequest">
          <Input
            v-model="keyList.litigationRequest"
            type="textarea"
            placeholder="书写格式规范：
            1.序号后用“.”而非“、”
            2.不出现“原告”、“被告”字样，直接用原告、被告的姓名表述
            3.不出现多余的空格
            4.请求支付实现债权费用的一项，表述为：“判令XXX偿付XX费用XX元、XX费用XX元...“"
            :rows="6"
          ></Input>
        </FormItem>
        <FormItem label="事实与理由(字数限制800字以下)" class="ft_form ft-plant-chooseType" prop="reason">
          <Input v-model="keyList.reason" type="textarea" placeholder="请输入事实与理由(字数限制800字以下)" :rows="4" :maxlength="800"></Input>
        </FormItem>
        <FormItem
          label="起诉状扫描件"
          :label-width="230"
          class="ft_form ft-plant-chooseType ft-plant-upload"
          prop="isUploaDindictment"
        >
          <Upload
            action="/api/court/case/upScanning.jhtml"
            :data="{fileType:'起诉状扫描件'}"
            :multiple="true"
            class="ft-plant-upload-button"
            :on-success="plant_uploadSuccess"
          >
            <Button type="ghost" style="width:200px" icon="ios-cloud-upload-outline">选择文件（可多选）</Button>
          </Upload>
        </FormItem>
        <FormItem>
          <div v-for="item in plant_fileName">
            <span class="fileName">{{item}}</span>
            <a @click="delFile('file1',item)">删除</a>
          </div>
        </FormItem>

        <!-- 金融案件 -->
        <Finance v-show="keyList.lawCaseType==='1'" ref="finance"></Finance>

        <!-- 保证保险合同追偿 -->
        <Insurance v-show="keyList.lawCaseType==='2'" ref="insurance"></Insurance>

        <!-- 信用卡纠纷 -->
        <Creditcard v-show="keyList.lawCaseType==='3'" ref="creditcard"></Creditcard>
      </Form>

      <div class="ft-agent-footer">
        <a
          href="javascript:void(0)"
          class="ft-agent-btn1"
          style="margin-left:-110px"
          @click="ft_handle_dealAgentTotalData(0)"
        >返回上一步</a>
        <a
          href="javascript:void(0)"
          class="ft_public3"
          @click="ft_keyinfo_toStep5('keyFromRule')"
        >下一步，证据上传</a>
      </div>
    </div>
  </div>
</template>

<script>
import keyInfoRule from "./keyinfo.js";
import { tools_transDate, tools_objHasStr } from "@/libs/tools.js";
import Finance from "./componets/finance.vue"; //金融借款
import Insurance from "./componets/insurance.vue"; //保险保证
import Creditcard from "./componets/creditcard.vue"; //信用卡纠纷
export default {
  components: {
    Finance,
    Insurance,
    Creditcard
  },
  data() {
    return {
      keyRule: keyInfoRule.Rule, // 表单验证规则
      keyList: {//基础要素信息
        lawCaseType:'',//案件类型
        applyStandard:'',//标的
        litigationRequest:"",//诉讼请求
        reason:"",//事实与理由
        indictmentScanning: [], // 起诉状扫描件
      },
      ensureList: {}, //保证合同数据
      pawnList: {}, //抵押同数据
      credidList: {}, //授信合同数据
      impawnList: {}, //质押合同数据
      loanList: {}, //借贷合同数据
      secureList: {}, //保证保险合同追偿
      plant_fileName: [] //起诉状扫描件
    };
  },
  mounted() {},
  methods: {
    // 表单验证
    ft_keyinfo_toStep5(name) {
      this.$refs[name].validate(valid => {
        console.log(valid);
        if (valid) {
          this.ft_handle_dealAgentTotalData(1);
        } else {
          this.$Notice.warning({ title: "信息未填写完全" });
        }
      });
    },

    //解决浅拷贝
    ft_handle_assignObj(obj) {
      return JSON.parse(JSON.stringify(obj));
    },

    //上传文件
    plant_uploadSuccess(res) {
      if (res.state === 100) {
        this.$Message.success(res.message);
        let data = res.data.result[0];
        switch (data.fileType) {
          case "起诉状扫描件":
            this.plant_fileName.push(data.fileName);
            this.keyList.indictmentScanning.push(data.filePath);
            break;
        }
      } else {
        this.$Message.error(res.message);
      }
    },
    //处理数据..
    ft_handle_dealAgentTotalData(index) {
      let baseData={
        state:index,// 0上一步 1下一步 
        caseNo:this.keyList.caseNo,
        lawCaseType: this.keyList.lawCaseType,//案件类型
        litigationRequest: this.keyList.litigationRequest,//诉讼请求
        applyStandard: this.keyList.applyStandard,//标的
        reason: this.keyList.reason,//事实理由
        indictmentScanning: this.keyList.indictmentScanning//起诉状
      }
      //一般案件
      if (this.keyList.lawCaseType === "0") {
        let newData=Object.assign({},baseData)
        this.$emit("toNextStep",{newData:newData,type:"要素信息"});
      //金融案件
      } else if (this.keyList.lawCaseType === "1") { 

        let keyList=this.$refs.finance.keyList

        //授信合同是否填写
        keyList.creditContract.forEach((item,index)=>{
          if(item.name==''){
            keyList.creditContract.splice(index,1)//无填写删除
          }
        })

        //借款合同是否填写
        keyList.loanContract.forEach((item,index)=>{
          if(item.name==''){
            keyList.loanContract.splice(index,1)//无填写删除
          }
        })

        //保证合同是否填写
        keyList.ensureContract.forEach((item,index)=>{
          if(item.name==''){
            keyList.ensureContract.splice(index,1)//无填写删除
          }
        })

        //抵押合同是否填写
        keyList.mortgageContract.forEach((item,index)=>{
          if(item.name==''){
            keyList.mortgageContract.splice(index,1)//无填写删除
          }
        })

        //质押合同是否填写
        keyList.impawnContract.forEach((item,index)=>{
          if(item.name==''){
            keyList.impawnContract.splice(index,1)//无填写删除
          }
        })

        let newData=Object.assign(baseData,keyList)
        this.$emit("toNextStep",{newData:newData,type:"要素信息"});
      //保障保险案件
      } else if (this.keyList.lawCaseType === "2") {
        let keyList=this.$refs.insurance.secureList
        let newData=Object.assign(baseData,keyList)
        this.$emit("toNextStep",{newData:newData,type:"要素信息"});
      //信用卡案件
      }else if (this.keyList.lawCaseType === "3") {
        let keyList=this.$refs.creditcard.creditCaseBaseInfo
        //判断信用卡是否填写
        keyList.cridtCardList.forEach((item,index)=>{
          if(item.creditCardId==''){
            keyList.cridtCardList.splice(index,1)//无填写删除
          }
        })
        //判断信用卡合同是否填写
        keyList.cridtCardList.forEach((item,index)=>{
          //保证合同是否填写
          item.ensureContract.forEach((item1,index1)=>{
            if(item1.guarantyContract==''){
              item.ensureContract.splice(index1,1)//无填写删除
            }
          })
          //抵押合同是否填写
          item.pledgeContract.forEach((item1,index1)=>{
            if(item1.pledgeContract==''){
              item.pledgeContract.splice(index1,1)//无填写删除
            }
          })
          //分期合同是否填写
          // item.installmentContract.forEach((item1,index1)=>{
          //   if(item1.installmentContract==''){
          //     item.installmentContract.splice(index1,1)//无填写删除
          //   }
          // })
          //质押合同是否填写
          item.impawnContract.forEach((item1,index1)=>{
            if(item1.impawnContract==''){
              item.impawnContract.splice(index1,1)//无填写删除
            }
          })
        })
        let newData=Object.assign(baseData,keyList)
        this.$emit("toNextStep",{newData:newData,type:"要素信息"});
      }else if (this.keyList.lawCaseType === "4") {//融资租赁合同纠纷
        // let keyList= this.$refs.financial.baseData
        let newData=Object.assign({},baseData)
        this.$emit("toNextStep",{newData:newData,type:"要素信息"});
      }else if (this.keyList.lawCaseType === "5") {//保险人代位求偿
        // let keyList=this.$refs.subrogation.baseData
        let newData=Object.assign({},baseData)
        this.$emit("toNextStep",{newData:newData,type:"要素信息"});
      }else if (this.keyList.lawCaseType === "6") {//金融不良债权追偿
        // let keyList=this.$refs.subrogation.baseData
        let newData=Object.assign({},baseData)
        this.$emit("toNextStep",{newData:newData,type:"要素信息"});
      }
    },
    //删除文件
    delFile(type, name) {
      switch (type) {
        case "file1":
          this.plant_fileName.forEach((item, index) => {
            if (item == name) {
              this.plant_fileName.splice(index, 1);
              this.keyList.indictmentScanning.splice(index, 1);
            }
          });
          break;
      }
    },
    //清空表单
    ft_step4_restForm() {
      this.$refs["keyFromRule"].resetFields();
    },
    onNumberChange(e,obj,prop){//过滤金额
      obj[prop] = e.target.value ? parseFloat(e.target.value).toFixed(2).toString() : ''
    },
  }
};
</script>

<style scoped>
@import "./keyinfo.css";
@import "../../casecommon/casereset.css";
</style>