<template>
  <div class='ft-magenttype-step1'>
    <div class='ft-magenttype-tip1'>
      <p>请将所有word文件要素表压缩成包（zip/7z）后上传（rar暂不支持），Excel文件直接上传。</p>
      <p>压缩包名称应包含案由如：AAA银行保证保险合同纠纷。身份证明，代理人要有"律师执业证"字样， 授权与所函里面要有 "委托书"和"律所函"字样 ，原告里面要有原告 "营业执照" 字样。</p>
      <p>为确保平台运行稳定性，单次限制至多50个案件要素表。超出部分请在本次批量立案提交后，再次进行批量立案提交操作</p>
      <p>批量案件提交过程中，请尽可能关闭其他运行程序，并保证网络稳定</p>
    </div>
    <Form
      :model="mAgentList"
      label-position="right"
      :label-width="190"
      :rules="mAgentRule"
      ref="mAgentRule"
      style="margin:0 auto;width:821px"
    >
      <FormItem label="选择文件类型" class="ft_form ft-plant-chooseType ft-plant-slectType" prop="lawCaseType">
        <RadioGroup v-model="fileType">
            <Radio label="1"><span>word压缩文件</span></Radio>
            <Radio label="2"><span>excel文件</span></Radio>
        </RadioGroup>
      </FormItem>
      <FormItem  label="选择案件类型" class="ft_form ft-plant-chooseType ft-plant-slectType" prop="lawCaseType">
        <RadioGroup v-model="caseType" @on-change="caseTypeChange">
            <Radio label="1"><span>保证保险合同追偿</span></Radio>
            <Radio label="2"><span>金融借款合同纠纷</span></Radio>
            <Radio v-show="fileType == 2" label="3"><span>信用卡纠纷</span></Radio>
            <Radio v-show="fileType == 1" label="4"><span>融资租赁合同纠纷</span></Radio>
            <Radio v-show="fileType == 1" label="5"><span>保险人代位求偿</span></Radio>
            <Radio v-show="fileType == 1" label="6"><span>金融不良债权追偿</span></Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="下载要素模板包"
        class="ft_form ft-plant-chooseType ft-plant-slectType"
      >
        <Button type="primary" shape="circle" class="zh-downModelBtn" @click="downDemo">点击下载至本地</Button>
        <p style="color:#d40f0f">温馨提示：要素模板因业务调整随时可能发生变动，请及时下载最新模板提交！</p>
      </FormItem>
      <FormItem
        label="导入word压缩要素文件"
        class="ft_form ft-plant-chooseType ft-plant-upload"
        prop="mKeyInfoPath"
        v-show="fileType=='1'"
      >
        <Input
          v-model="mAgentList.mKeyInfoPath"
          placeholder="请上传要素信息表"
        ></Input>
        <span class='mAgent-span'>{{mAgent_fileName1}}</span>
        <Upload
          action="/api/court/case/importCase.jhtml"
          class="ft-plant-upload-button"
          :on-success="mAgent_uploadSuccess"
          :before-upload="mAgent_beforeUpload"
          :data="{fileType:'要素表'}"
        >
          <Button
            type="ghost"
            icon="ios-cloud-upload-outline"
          >选择文件</Button>
        </Upload>
      </FormItem>

      <FormItem
        label="导入excel要素文件"
        class="ft_form ft-plant-chooseType ft-plant-upload"
        prop="mKeyInfoPath"
        v-show="fileType=='2'"
      >
        <Input
          v-model="mAgentList.mKeyInfoPath"
          placeholder="请上传要素信息表"
        ></Input>
        <span class='mAgent-span'>{{mAgent_fileName2}}</span>
        <Upload
          action="/api/court/judgement_result/uploadExcel.jhtml"
          class="ft-plant-upload-button"
          :on-success="excel_uploadSuccess"
          :before-upload="mAgent_beforeUpload"
        >
          <Button
            type="ghost"
            icon="ios-cloud-upload-outline"
          >选择文件</Button>
        </Upload>
      </FormItem>

    </Form>
    <Alert type="warning" show-icon v-show="upErrorShow">
        文件内容上传错误提示（错误文件将不会被录入，请根据提示修改后重新上传！）：
      <div slot="desc" v-for="item in errorMsgs" style="color:red">
        {{item}}
      </div>
    </Alert>


    <Table
      border
      ref="mAgentSelect"
      :columns="mColumns"
      :data="mAgentKeyInfoList"
      v-show="mTableShow==1"
      @on-row-click="rowClick"
      @on-selection-change="mAgentHasSelect"
    ></Table>
    <div style="margin-top:20px">
      <Checkbox
        v-show="mTableShow==1"
        class='ft-confirm-checkboxSingle'
        v-model="mAgentStatus"
        @on-change="mAgentSelect"
      >全选/取消所有数据</Checkbox>
    </div>
    <div
      class='ft-agent-footer'
      v-show="mTableShow==1"
      style="text-align:center"
    >
      <a
        href="javascript:void(0)"
        class="ft_public3 ft-agent-btn1 ft-magent-btn1"
        style="margin-left:-110px"
        @click="mAgent_removeMany"
      >移除所选案件</a>
      <a
        href="javascript:void(0)"
        class="ft_public3 ft-magent-btn2"
        @click="mAgent_addMany(true,true)"
      >跳过证据、证明文件上传</a>
      <a
        href="javascript:void(0)"
        class="ft_public3 ft-magent-btn2"
        @click="mAgent_addMany(true)"
      >下一步证明文件上传</a>
    </div>
    <div
      class='ft-agent-footer'
      v-show="mTableShow==1"
    >
    </div>
  </div>
</template>


<script>
import mStep1 from "./Magenttype.js";
import { ftAddkeyInfoMany,downloadFact } from "@/api/setcase.js";
import {tools_downLoad} from "@/libs/tools.js";
export default {
  data() {
    return {
      fileType:'1',
      caseType:'1',
      mAgentList: mStep1.mAgentList, //表单绑定数据
      mAgentRule: mStep1.mAgentRule, //表单验证规则
      mAgent_fileName1: "暂未上传任何文件",
      mAgent_fileName2: "暂未上传任何文件",
      mAgentKeyInfoList: mStep1.mAgentKeyInfoList, //表格绑定数据
      mTableShow: 0, //表格显示状态
      mAgentStatus: false, //全选反选状态
      mAgentHasSelectList: [], //已经要素列表
      mAgent_subType: false, //提交状态（暂存or直接提交)
      upErrorShow:false,//上传文件错误提示开关
      errorMsgs:["暂无错误信息"],//部分文件上传错误信息
      mColumns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "本表序号",
          width: 80,
          align: "center",
          key: "ids"
        },
        {
          title: "批次-流水号",
          align: "center",
          width: 180,
          key: "orderNo"
        },
        {
          title: "原告姓名/名称",
          align: "center",
          render: (h, params) => {
            return h("span", params.row.plaintiffs[0].name);
          }
        },
        {
          title: "被告姓名/名称",
          align: "center",
          render: (h, params) => {
            let arrTemp = [];
            let strTemp = "";
            params.row.defendants.forEach(val => {
              arrTemp.push(val.name);
            });
            strTemp = arrTemp.join(";");
            return h("span", strTemp);
          }
        },
        {
          title: "操作",
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {
                style: { color: "#F54C4C", cursor: "pointer" },
                on: {
                  click: () => {
                    this.mAgentRemoveNowRow(params.row.orderNo);
                  }
                }
              },
              "直接移除"
            );
          }
        }
      ]
    };
  },
  watch: {
    //表格启动深度监听
    'mAgentKeyInfoList':{
      handler:function(newValue,oldValue){
        //dom已更新后执行
        this.$nextTick(()=>{
          this.mAgentStatus=true;//全选
          this.$refs.mAgentSelect.selectAll(this.mAgentStatus);
        })
      },
      deep:true,
    }
  },
  //不是很清楚这里保存这个字段的含义
  mounted() {
    this.setLocalStorage("保证保险合同追偿");
  },
  methods: {
    //下载
    downDemo(){
      this.$Message.loading({content: '获取要素模板中,请稍后...', duration: 0});
      downloadFact({type:this.fileType,lawType:this.caseType})
      .then(res=>{
        this.$Message.destroy();
        if(res.data.state === 100) {
            let data=res.data.data;
            //解析文件路径
            tools_downLoad(data.path)
          }else{
          this.$Message.error(res.data.message);
        }
      })
    },
    //压缩文件上传成功
    mAgent_uploadSuccess(res) {
      this.$Notice.destroy();
      if (res.state === 100) {
        if(res.data.error.length>0){
          this.mAgent_fileName1 = "要素信息有误";
          this.$Message.error("要素信息有误");
          //表格数据渲染
          this.mTableShow=1;
          this.mAgentKeyInfoList = res.data.content;
          //部分上传错误信息
          this.upErrorShow=true;
          this.errorMsgs=res.data.error;
        }else{
          this.mAgent_fileName1 = "要素信息已上传";
          this.$Message.success("上传成功");
          this.mAgentList.mKeyInfoPath = "hasUpload";
          this.upErrorShow=false;
          //表格数据渲染
          this.mTableShow=1;
          this.mAgentKeyInfoList = res.data.content;
        }
      }else{
        this.$Message.error(res.message);
      }
    },

    //excel文件上传成功
    excel_uploadSuccess(res) {
      this.$Notice.destroy();
      if (res.state === 100) {
        if(res.data.error.length>0){
          this.mAgent_fileName2 = "要素信息有误";
          this.$Message.error("要素信息有误");
          //表格数据渲染
          this.mTableShow=1;
          this.mAgentKeyInfoList = res.data.elementData;
          //部分上传错误信息
          this.upErrorShow=true;
          this.errorMsgs=res.data.error;
        }else{
          this.$Message.success("上传成功！");
          this.mAgentList.mKeyInfoPath = "hasUpload";
          this.upErrorShow=false;
          //显示表格
          this.mTableShow=1;
          this.mAgentKeyInfoList = res.data.elementData;
          //异步下载文件
          if(res.data.filePath!=""){
            tools_downLoad(res.data.filePath);
          }
          this.mAgent_fileName2 = "已下载要素包至本地";
        }
      }else{
        this.$Message.error(res.message);
      }
    },

    //上传之前
    mAgent_beforeUpload() {
      this.$Notice.open({
        title: "上传解压中",
        desc: "如果上传文件较大，请耐心等待.....",
        duration: 0
      });
    },

    //按钮触发全选和反选
    mAgentSelect() {
      this.$refs.mAgentSelect.selectAll(this.mAgentStatus);
    },

    //全选反选
    mAgentHasSelect(event) {
      this.mAgentHasSelectList = event;
    },

    //移除当条案件,（这里没有请求接口）
    mAgentRemoveNowRow(orderNo) {
      for (let index = 0; index < this.mAgentKeyInfoList.length; index++) {
        if (orderNo === this.mAgentKeyInfoList[index].orderNo) {
          this.mAgentKeyInfoList.splice(index, 1);
        }
      }
      this.mAgentHasSelectList = [];
    },

    //批量删除案件
    mAgent_removeMany() {
      if (this.mAgentHasSelectList.length === 0 ) {
        this.$Notice.warning({title:'您还没有选择案件'});
      }else{
      for (let i = 0; i < this.mAgentKeyInfoList.length; i++) {
        for (let j = 0; j < this.mAgentHasSelectList.length; j++) {
          if (this.mAgentKeyInfoList[i].orderNo ===this.mAgentHasSelectList[j].orderNo) {
            this.mAgentKeyInfoList.splice(i, 1);
          }
        }
      }
      this.mAgentHasSelectList = [];
      }

    },

    //提交案件
    mAgent_addMany(subType,skip) {
      if (this.mAgentHasSelectList.length === 0) {
        this.$Notice.error({ title: "您还没有勾选要素信息" });
      } else {
        //获取提交方式
        this.mAgent_subType = subType;
        //提交
        let confirmList = [];
        this.mAgentHasSelectList.forEach(val=>{
          let confrimObj = {}
          val.submitType = this.mAgent_subType;
          confrimObj.orderNo = val.orderNo;
          confrimObj.caseInfo = val;
          confirmList.push(confrimObj);
        })
          this.$Notice.success({ title: "上传成功！" });
          if(skip){
            this.$emit("jumpIt", confirmList);//跳过证据、证明文件上传
          }else{
            this.$emit("ft_muti_toStep2", confirmList);//到下一步
          }
      }
    },
    //文件类型改变
    caseTypeChange(e){
      switch (e) {
        case "1":
          this.setLocalStorage("保证保险合同追偿");
        break;
        case "2":
          this.setLocalStorage("金融借款合同纠纷");
        break;
        case "3":
          this.setLocalStorage("信用卡纠纷");
        break;
      }
    },
    //设置本地存储
    setLocalStorage(nowCaseType){
      let obj={
        nowCaseType:nowCaseType,
      }
      window.localStorage.setItem("nowCase",JSON.stringify({obj}))
    },
    rowClick(val,index){
        this.$refs.mAgentSelect.toggleSelect(index)
    }
  }
};
</script>

<style scoped>
@import "./Magenttype.css";
</style>
