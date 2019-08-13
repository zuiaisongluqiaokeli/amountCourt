<template>
  <div class='ft-magenttype-step1'>
    <Table
      border
      style="margin-top:20px"
      ref="mProveSelect"
      :columns="mColumns"
      :data="mProveKeyInfoList"
      @on-selection-change="mProveHasSelect"
      @on-select="mProveHasSelect"
    ></Table>
    <div style="margin-top:20px">
      <Checkbox
        class='ft-confirm-checkboxSingle'
        v-model="mProveStatus"
        @on-change="mProveSelect"
      >全选/取消所有数据</Checkbox>
    </div>
    <Form
      :model="mProveList"
      label-position="right"
      :label-width="190"
      :rules="mProveRule"
      ref="mProveRule"
      style="margin:0 auto;width:821px"
    >
      <FormItem
        label="上传证明文件统一上传包"
        class="ft_form ft-plant-chooseType ft-plant-upload"
        prop="mKeyInfoPath"
      >
        <Input
          v-model="mProveList.mKeyInfoPath"
          placeholder="请上传证明文件"
        ></Input>
        <span class='mProve-span'>{{mProve_fileName1}}</span>
        <zh-upload ref="mproveUpload" :refid="'mproveFile'" :uploadType="'1'" @next="fileNext(arguments)" @complete="fileComplete" @error="fileError"></zh-upload>
        <span
          class="mEvidence-downspan"
          @click="mProve_downProveFile"
        >本次批量案件证明文件包模板下载</span>
      </FormItem>
    </Form>
    <div
      class='ft-agent-footer'
      style="margin-top:50px;text-align:center"
    >
      <a href="javascript:void(0)" class="ft-magent-btn4" @click="mSendBacktoStep1">返回上一步</a>
      <a
        href="javascript:void(0)"
        class="ft_public3 ft-agent-btn1 ft-magent-btn1"
        @click="mProve_removeMany"
      >移除所选案件</a>
      <a
        href="javascript:void(0)"
        class="ft_public3 ft-magent-btn2"
        @click="mProve_toStep3"
      >下一步证据批量上传</a>
    </div>
  </div>
</template>


<script>
import mProveStep from "./Mevidence.js";
import {
  ftDownMutiProve,
  getQiniuToken,
  hUpload,
} from "@/api/setcase.js";
import {tools_downLoad,formatSeconds} from "@/libs/tools.js";
import ZhUpload from '@/components/qiniu-upload/quick-upload.vue';
export default {
  components : {
      ZhUpload,
  },
  data() {
    return {
      mProve_plantiffName: '', // 原告姓名
      mProve_lawyerNames: [], // 代理人姓名列表
      mProve_caseInfos:[],//案件信息列表
      mProveList: mProveStep.mProveList, //表单绑定数据
      mProveRule: mProveStep.mProveRule, //表单验证规则
      mEviPath: mProveStep.mProveList.mKeyInfoPath,//文件是否上传规则
      mProve_fileName1: "暂未上传任何文件",
      mProveKeyInfoList: [], //表格绑定数据
      mProveStatus: false, //全选反选状态
      mProveHasSelectList: [], //已经要素列表
      mProve_agentCount:0,
      flieFalg:true,
      flieProgress:0,//文件上传进度
      leastTime:0,//剩余时间
      mColumns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "本表序号",
          width: 120,
          align: "center",
          render: (h, params) => {
            return h("span", params.row.caseInfo.ids);
          }
        },
        {
          title: "批次-流水号",
          align: "center",
          key: "orderNo"
        },
        {
          title: "原告姓名",
          align: "center",
          width: 220,
          render: (h, params) => {
            return h("span", params.row.caseInfo.plaintiffs[0].name);
          }
        },
        {
          title: "被告姓名",
          align: "center",
          render: (h, params) => {
            let arrTemp = [];
            let strTemp = "";
            params.row.caseInfo.defendants.forEach(val => {
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
                    this.mProveRemoveNowRow(params.row.orderNo);
                  }
                }
              },
              "直接移除"
            );
          }
        },
        {
          title: "证明文件是否上传",
          align: "center",
          width: 150,
          render: (h, params) => {
            return h(
              "span",
              {
                style: { color: "#4873C5", cursor: "pointer" },
                class: {'ft-prove-index':true},
              },
              params.row.fileZip
            );
          }
        },
        // {
        //   title: "证据操作",
        //   align: "center",
        //   width: 300,
        //   render: (h, params) => {
        //     return h("div", [
        //       h(
        //         "span",
        //         {
        //           style: {
        //             color: "#F54C4C",
        //             cursor: "pointer",
        //             margin: "0 10px 0 10px"
        //           },
        //           on: {
        //             click: () => {
        //               // this.mProveClearSingle(params.row.orderNo);
        //             }
        //           }
        //         },
        //         "清除证明文件"
        //       )
        //     ]);
        //   }
        // }
      ]
    };
  },
  watch: {
    'mProveKeyInfoList':{
      handler:function(newValue,oldValue){
        console.log(newValue,oldValue)
        //dom已更新后执行
        this.$nextTick(()=>{
          this.mProveStatus=true;//全选
          this.$refs.mProveSelect.selectAll(this.mProveStatus);
        })
      },
      deep:true,
    }
  },
  methods: {
    //接收步骤一的list
    mProveSendList(payload) {
      this.mProveKeyInfoList = payload;
      console.log(payload);
      //获取原告
      this.mProve_plantiffName = payload[0].caseInfo.plaintiffs[0].name;
      //获取代理人数量
      this.mProve_agentCount = payload[0].caseInfo.plaintiffs[0].layers.length;
      //获取代理人姓名数组
      let layersInfo=payload[0].caseInfo.plaintiffs[0].layers;
      layersInfo.forEach((item,index) => {
        this.mProve_lawyerNames.push(item.agentName);
      });
      //获取案件信息
      payload.forEach((item,index) => {
        //添加被告姓名(多个拼接)
        let obj={};
        item.caseInfo.defendants.forEach((item1,index1)=>{
          if(index1>0){
            obj.defendantName+=','+item1.name
          }else{
            obj.defendantName=item1.name
          }
        });
        
        //添加案件号
        //判断是保险保证还是金融案件
        if(item.caseInfo.hasOwnProperty("policyNo")){
          //保险
          obj.policyNo=item.caseInfo.policyNo;
        }else{
          //金融
          obj.caseNumber =item.caseInfo.caseNumber;
        }
        
        //添加流水号
        obj.flowNumber=item.caseInfo.orderNo;

        this.mProve_caseInfos.push(obj);
      });
      payload[0].caseInfo.plaintiffs[0].layers.forEach((val,index)=>{
        this[`mProve_accusedName${index}`] = val.agentName;
      })
      //用于显示证明文件用
      this.mProveKeyInfoList.forEach(val => {
        val.fileZip = "暂无";
        val._checked = false;
      });
    },

    fileNext (result) {
      this.flieProgress=result[0].total.percent.toFixed(2);
      //转化时间
      this.leastTime=formatSeconds(result[1]);                                                                                                                                                                                                                                                                                                                                                                                                             
      if(this.flieFalg){
        this.flieFalg=false;
        // 主要用来展示进度
        this.$Notice.info({
          title: "上传中，请稍后....",
          duration: 0,
          render: h => {
            return h('span', [
                h('div',{
                  style:{
                    color:"red",
                  },
                },`上传过程请勿关闭浏览器或执行其他操作！`),
                h('div',`进度${this.flieProgress}%,预计剩余${this.leastTime}`),
              ])
          },
          onClose:()=>{
            this.$refs.mproveUpload.cancelUpload();//取消文件上传
            this.$Message.warning({content:'文件上传已取消',duration:2});
            this.flieFalg=true;
          }
        });
      }
    },

    fileError (errResult) {
      // 失败报错信息
      this.$Notice.destroy();
      this.$Notice.error(errResult);
    },

    fileComplete (result) {
      // 接收成功后返回的信息
      console.log(result)
      this.mEviPath ='hasLoad';
      this.$Notice.destroy()
      this.flieFalg=true;
      this.flieProgress=0;
      //发送上传的文件名给后端由后端解析文件返回证明文件信息
      this.$Notice.info({
          title: '正在解压文件..请稍后',
          duration:0,
      });
      hUpload({filePath:result.key,type:'1'}).then(res=>{
        this.mProve_dealFeedData(res.data.data);
        this.mProve_fileName1 ='已上传';
        this.$Message.success("上传成功");
        this.$Notice.destroy();
      });
    },

    //下载模板
    mProve_downProveFile() {
      let params = {
        plainffName:this.mProve_plantiffName,
        lawyerNames:this.mProve_lawyerNames,
        caseInfos:this.mProve_caseInfos,
      }

      this.$Message.loading("获取中,请稍后....");
      ftDownMutiProve(params)
      .then(res=>{
        if(res.data.state === 100) {
          this.$Message.destroy();
          this.$Message.success('获取成功');
          tools_downLoad(res.data.data);
        }else{
          this.$Message.error(res.data.mesaage);
        }
      })
    },

    // 移除当条案件
    mProveRemoveNowRow (orderNo) {
      for (let index = 0; index < this.mProveKeyInfoList.length; index++) {
        if (orderNo === this.mProveKeyInfoList[index].orderNo) {
          this.mProveKeyInfoList.splice(index, 1);
        }
      }
    },

    //批量移除
    mProve_removeMany () {
      if(this.mProveHasSelectList.length === 0) {
        this.$Notice.warning({'title':'请先选择要移除的案件'});
      }else{
        for (let i = 0; i < this.mProveKeyInfoList.length; i++) {
          for (let j = 0; j < this.mProveHasSelectList.length; j++) {
            if ( this.mProveKeyInfoList[i].orderNo === this.mProveHasSelectList[j].orderNo ) {
              this.mProveKeyInfoList.splice(i, 1);
            }
          }
        }
      }
    },

    //处理数据
    mProve_dealFeedData(payload){
      console.log(payload)
      let hasLoadArr = document.getElementsByClassName('ft-prove-index'); // 已上传的元素数组
      
      this.mProveKeyInfoList.forEach((item,index) => {
         item.fileZip = '已上传';
         this.$set(this.mProveKeyInfoList,index,{fileZip:"已上传",_checked:true,orderNo:item.orderNo,caseInfo:item.caseInfo})
         console.log("mProveKeyInfoList",this.mProveKeyInfoList)
         console.log("item",item);
         //填充plaintiffs内的数据
         item.caseInfo.plaintiffs.forEach((item1,index1) => {
            item1.name=payload.plainff.name;
            item1.businessLicense=payload.plainff.businessLicense;
            console.log("item1",item1)
            //循环判断oderNo是否吻合
            payload.caseInfo.forEach((item2,index2) => {
              console.log("item2",item2)
              console.log(item.caseInfo.orderNo,item2.orderNo);
              if(item.caseInfo.orderNo==item2.orderNo){
                //填充layers内的数据
                item1.layers.forEach((item3,index3) => {
                  console.log("item3",item3)
                  //循环判断name是否吻合
                  item2.layers.forEach((item4,index4) => {
                    console.log("item4",item4)
                    if(item3.agentName==item4.agentName){
                      item3.lawerCardUrl=item4.lawerCardUrl;
                      item3.commission=item4.commission;
                      item3.lawFirmLetter=item4.lawFirmLetter;
                    }
                  });
                });
              }
            });
         });
      });
      console.log("a",this.mProveKeyInfoList);
    },

    //按钮触发全选和反选
    mProveSelect() {
      this.$refs.mProveSelect.selectAll(this.mProveStatus);
    },

    //全选反选
    mProveHasSelect(event) {
      this.mProveHasSelectList = event;
    },

    //下一步
    mProve_toStep3 () {
      if(this.mProveHasSelectList.length === 0) {
        this.$Notice.warning({title:'您还没有选中案件'})
      }else{
        this.$emit('ft_muti_toStep3',this.mProveHasSelectList);
      }
    },

    //返回上一步
    mSendBacktoStep1 () {
      this.$emit('mSendBacktoStep1');
    },

  }
};
</script>

<style scoped src='./Mprove.css'></style>
