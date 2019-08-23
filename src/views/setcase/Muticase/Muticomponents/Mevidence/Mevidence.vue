<template>
  <div class='ft-magenttype-step1'>
    <Table
      border
      style="margin-top:20px"
      ref="mEvidenceSelect"
      :columns="mColumns"
      :data="mEvidenceKeyInfoList"
      v-show="mEviTableShow==1"
      @on-selection-change="mEvidenceHasSelect"
      @on-select="mEvidenceHasSelect"
    ></Table>
    <div style="margin-top:20px">
      <Checkbox
        v-show="mEviTableShow==1"
        class='ft-confirm-checkboxSingle'
        v-model="mEvidenceStatus"
        @on-change="mEvidenceSelect"
      >全选/取消所有数据</Checkbox>
    </div>
    <Form
      :model="mEvidenceList"
      label-position="right"
      :label-width="180" 
      :rules="mEvidenceRule"
      ref="mEvidenceRule"
      style="width:850px;margin:0 auto;position:relative"
    >
      <!-- <FormItem label="证据名称" class="ft_form ft-plant-chooseType ft-plant-slectType" prop="name">
        <Input v-model="mEvidenceList.name" placeholder="请输入证据名称"></Input>
      </FormItem>

      <FormItem label="证明对象" class="ft_form ft-plant-chooseType" prop="object">
          <Input v-model="mEvidenceList.object" placeholder="请输入证明对象"></Input>
      </FormItem>

      <FormItem label="证据来源" class="ft_form ft-plant-chooseType" prop="source">
        <Input v-model="mEvidenceList.source" placeholder="请输入证据来源"></Input>
      </FormItem> -->

      <!-- <FormItem label="证据数量" class="ft_form ft-plant-chooseType" prop="number">
          <Input v-model="mEvidenceList.number" placeholder="请输入证据数量"></Input>
      </FormItem> -->

      <!-- <FormItem label="页数" class="ft_form ft-plant-chooseType" prop="pageNumber">
          <Input v-model="mEvidenceList.pageNumber" placeholder="请输入页数"></Input>
      </FormItem> -->
      <!-- <div class="addModelBtn"> -->
        <!-- <Button type="primary" shape="circle" class="zh-addModelBtn" @click="addModel">添加</Button> -->
        <!-- <Button type="primary" shape="circle" class="zh-downModelBtn" @click="mEvidenceDownMuti">本次批量案件证据模板包下载</Button>
      </div> -->
      <!-- <Table
        border
        style="margin-top:20px"
        ref="setModeData"
        :columns="modeColumns"
        :data="modelInfoList"
      ></Table> -->
      <!-- 上传证据 -->
      <FormItem label="下载证据模板包"
        :label-width="180"
        class="ft-plant-chooseType ft-plant-upload"
        style="margin:10px 0"
      >
        <Button type="primary" shape="circle" class="zh-downModelBtn" @click="NewmEvidenceDownMuti">点击下载至本地</Button>
      </FormItem>
      <FormItem
        label="上传证据压缩包"
        :label-width="180"
        class="ft-plant-chooseType ft-plant-upload"
        prop="mKeyInfoPath"
        style="margin:10px 0"
      >
        <Input
          v-model="mEvidenceList.mKeyInfoPath"
          placeholder="请上传证据包"
        ></Input>
        <span class='mEvidence-span'>{{mEvidence_fileName1}}</span>
        <!-- 七牛云上传 -->
        <zh-upload 
        ref="myupload" 
        :refid="'myfile'" 
        :uploadType="'2'" 
        @next="fileNext(arguments)" 
        @complete="fileComplete" 
        @error="fileError"></zh-upload>
      </FormItem>

      <FormItem>
          <div style="height: 0px;border-top: 2px dashed #4873C5;width: 750px;margin-left: -203px;margin-top: 50px;"></div>                
      </FormItem>

      <!-- 上传诉前材料 -->
      <FormItem label="下载诉前材料模板包"
        :label-width="180"
        class="ft-plant-chooseType ft-plant-upload"
        style="margin:10px 0"
      >
        <Button type="primary" shape="circle" class="zh-downModelBtn" @click="downPic">点击下载至本地</Button>
      </FormItem>
      <FormItem
        label="上传诉前材料压缩包"
        :label-width="180"
        class="ft-plant-chooseType ft-plant-upload"
        style="margin:10px 0"
      >
        <Input
          placeholder="请上传诉前材料压缩包"
        ></Input>
        <span class='mEvidence-span'>{{mEvidence_fileName2}}</span>
        <Upload
          action="/api/court/case/importEviPicList.jhtml "
          :on-success="picMaterialsUpload"
          :before-upload="picBeforeUpload"
          :show-upload-list="false"
          ref="up2"
          style="display: inline-block;"
        >
          <Button
          type="ghost"
          icon="ios-cloud-upload-outline"
          >选择文件</Button>
        </Upload>
      </FormItem>
    </Form>
    <div
      class='ft-agent-footer'
      v-show="mEviTableShow==1"
      style="margin-top:50px;text-align:center"
    >
      <a href="javascript:void(0)" class="ft-magent-btn4" @click="mSendBacktoStep2">返回上一步</a>
      <a
        href="javascript:void(0)"
        class="ft_public3 ft-agent-btn1 ft-magent-btn1"
        @click="mEvidence_removeMany"
      >移除所选案件</a>
      <a
        href="javascript:void(0)"
        class="ft_public3 ft-magent-btn2"
        @click="mEvidence_addMany"
      >下一步送达事项确认</a>
    </div>
  </div>
</template>


<script>
import mStep2 from "./Mevidence.js";
import {ftDowntemplate} from "@/api/setcase.js";
import {tools_downLoad,formatSeconds} from "@/libs/tools.js";
import {getQiniuToken} from "@/api/setcase.js";
import {hUpload,downloadPic} from "@/api/setcase.js";
import ZhUpload from '@/components/qiniu-upload/quick-upload.vue';

export default {
  components : {
      ZhUpload,
  },
  data() {
    return {
      mEvidenceOrderList:'', //流水案件号，用于获取批量案件模板
      mEvidenceList: mStep2.mEvidenceList, //表单绑定数据
      mEvidenceRule: mStep2.mEvidenceRule, //表单验证规则
      mEvidence_fileName1: "暂未上传任何文件",
      mEvidence_fileName2: "暂未上传任何文件",
      mEvidenceKeyInfoList: mStep2.mEvidenceKeyInfoList, //表格绑定数据
      modelInfoList:{},//模板数据表格绑定数据
      mEviPath: mStep2.mEvidenceList.mKeyInfoPath,//文件是否上传规则
      mEviTableShow: 1, //表格显示状态
      mEvidenceStatus: false, //全选反选状态
      mEvidenceHasSelectList: [], //已经要素列表
      mEvidence_subType: false, //提交状态（暂存or直接提交)
      uploadDataPicList:"",//诉前文件上传后返回的数据
      flieFalg:true,//文件上传按钮控制
      flieProgress:0,//上传进度
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
                    this.mEvidenceRemoveNowRow(params.row.orderNo);
                  }
                }
              },
              "直接移除"
            );
          }
        },
        {
          title: "证据包是否上传",
          align: "center",
          width: 100,
          render: (h, params) => {
            return h(
              "span",
              {
                style: { color: "#4873C5", cursor: "pointer" },
                class: {'ft-change-index':true},
              },
              params.row.evidenceZip
            );
          }
        },
        {
          title: "诉前材料是否上传",
          align: "center",
          width: 100,
          render: (h, params) => {
            return h(
              "span",
              {
                style: { color: "#4873C5", cursor: "pointer" },
                class: {'ft-change-index':true},
              },
              params.row.picZip
            );
          }
        },
        {
          title: "文件操作",
          align: "center",
          width:400,
          render: (h, params) => {
            return h("div", [
              h(
                "Upload",
                {
                  props: {
                    action: "/api/court/case/importEvidence.jhtml",
                    "show-upload-list":false,
                    "on-success": res => {
                      if (res.state === 100) {
                        this.$Notice.destroy();
                        this.mEviPath = 'hasload';
                        this.mEvidence_fileName1 = '已上传';
                        this.$Notice.info({ title: "上传成功" });
                        this.mEvidenceShow(res.data);
                      } else {
                        this.$Notice.error({ title: res.message });
                      }
                    },
                    "before-upload": () => {
                      this.$Notice.open({
                        title: "上传中",
                        desc: "如果上传文件较大，请耐心等待.....",
                        duration: 0
                      });
                    }
                  },
                  class: "ft-plant-upload-button",
                  style: {
                    color: "#4873C5",
                    cursor: "pointer",
                    margin: "0 10px 0 5px",
                  }
                },
                "上传证据包"
              ),

              h(
                "span",
                {
                  style: {
                    color: "#4873C5",
                    cursor: "pointer",
                    margin: "0 10px 0 5px"
                  },
                  on:{
                    click: () =>{
                      console.log(params)
                        let eviListArr=  [];
                        let obj={};
                        let val=params.row;
                        //添加流水号
                        obj.flowNumber=val.caseInfo.orderNo;

                        //添加案件号
                        //判断是保险保证还是金融案件
                        if(val.caseInfo.hasOwnProperty("policyNo")){
                          //保险
                          obj.policyNo=val.caseInfo.policyNo;
                        }else{
                          //金融
                          obj.caseNumber =val.caseInfo.caseNumber;
                        }

                        //添加被告姓名（多个组合）
                        val.caseInfo.defendants.forEach((item,index)=>{
                          if(index>0){
                            obj.defendantName+=','+item.name
                          }else{
                            obj.defendantName=item.name
                          }
                        });

                        //追加数组
                        eviListArr.push(obj);
                        // //添加type和orderNo
                        // this.modelInfoList.forEach((item,index) => {
                        //   item.type='2';
                        //   item.orderNo=eviListArr;
                        // });
                        //添加type和orderNo
                        this.modelInfoList=eviListArr;
                        console.log(this.modelInfoList)
                        
                        this.$Message.loading({content: '获取文件中,请稍后...', duration: 0});
                        ftDowntemplate({evidence:this.modelInfoList,lawCaseType:val.lawCaseType})
                        .then(res=>{
                          this.$Message.destroy();
                          if(res.data.state === 100) {
                              tools_downLoad(res.data.data)
                            }else{
                            this.$Message.error('获取文件出错，请稍后再试');
                          }
                        })
                    }
                  }
                },
                "下载证据包模板"
              ),

              h(
                "span",
                {
                  style: {
                    color: "#F54C4C",
                    cursor: "pointer",
                    margin: "0 10px 0 5px"
                  },
                  on: {
                    click: () => {
                      this.mEvidenceClearSingle(params.row.orderNo,'evidence');
                    }
                  }
                },
                "清除证据"
              ),

              h(
                "span",
                {
                  style: {
                    color: "#F54C4C",
                    cursor: "pointer",
                    margin: "0 10px 0 5px"
                  },
                  on: {
                    click: () => {
                      this.mEvidenceClearSingle(params.row.orderNo,'pic');
                    }
                  }
                },
                "清除诉前材料"
              )
            ]);
          }
        }
      ],
      modeColumns:[
        {
          title: "序号",
          align: "center",
          key: "evidenceId"
        },
        {
          title: "证据名称",
          align: "center",
          key: "name"
        },
        {
          title: "证据对象",
          align: "center",
          key: "object"
        },
        {
          title: "证据来源",
          align: "center",
          key: "source"
        },
        {
          title: "页数",
          align: "center",
          key: "pageNumber"
        },
        {
          title: "操作",
          align: "center",
          key: "",
          render: (h, params) => {
            return h('div', [
              h('Button', {
                  props: {
                      type: 'error',
                      size: 'small'
                  },
                  on: {
                      click: () => {
                          this.removeInfo(params.index)
                      }
                  }
              }, '删除')
            ]);
          }
        },
      ],
    };
  },
  watch: {
    'mEvidenceKeyInfoList':{
      handler:function(newValue,oldValue){
        //dom已更新后执行
        this.$nextTick(()=>{
          this.mEvidenceStatus=true;//全选
          this.$refs.mEvidenceSelect.selectAll(this.mEvidenceStatus);
        })
      },
      deep:true,
    }
  },
  methods: {

    //接收步骤一的list
    meEviSendList(payload) {
      this.mEviTableShow = 1;
      this.mEvidenceOrderList = payload[0].orderNo;
      this.mEvidenceKeyInfoList = payload;
      //用于显示证据包用
      this.mEvidenceKeyInfoList.forEach(val => {
        val.evidenceZip = "暂无";
        val.picZip = "暂无";
        val._checked = false;
      });
    },
    //上传中
    fileNext (result) {
      //百分比保存2位小数
      this.flieProgress=result[0].total.percent.toFixed(2);
      //时间转化整数
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
                h('div', `进度${this.flieProgress}%,预计剩余${this.leastTime}`),
              ])
          },
          onClose:()=>{
            this.$refs.myupload.cancelUpload();//取消文件上传
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
      this.$Notice.destroy();
      this.flieFalg=true;
      this.flieProgress=0;//初始化
      //发送上传的文件名给后端由后端解析文件返回证据文件信息
      this.$Notice.info({
          title: '正在解压文件..请稍后',
          duration:0,
      });
      hUpload({filePath:result.key,type:'2'}).then(res=>{
          this.mEvidenceShow(res.data.data);
          this.mEvidence_fileName1 ='已上传';
          this.$Message.success("上传成功");
          this.$Notice.destroy();
      });
    },
    //添加证据文件到每个案件
    mEvidenceShow(orderArr) {
      console.log("ccccc",orderArr)
      for (let i = 0; i < this.mEvidenceKeyInfoList.length; i++) {
        for (let j = 0; j < orderArr.length; j++) {
          if ( this.mEvidenceKeyInfoList[i].orderNo.indexOf(orderArr[j].orderNo) > -1 ) {
            this.mEvidenceKeyInfoList[i].caseInfo.evidence = [];
            this.mEvidenceKeyInfoList[i].caseInfo.evidence = orderArr[j].evidence;
            this.mEvidenceKeyInfoList[i].caseInfo.indictmentScanning = orderArr[j].indictmentScanning;
            this.mEvidenceKeyInfoList[i].evidenceZip = '已上传';
            this.$set(this.mEvidenceKeyInfoList, i, this.mEvidenceKeyInfoList[i]); //dom更新数据
          }
        }
      }
      console.log("b",this.mEvidenceKeyInfoList)
      this.$forceUpdate();
    },
    //按钮触发全选和反选
    mEvidenceSelect() {
      this.$refs.mEvidenceSelect.selectAll(this.mEvidenceStatus);
    },

    //全选反选
    mEvidenceHasSelect(event) {
      console.log(event)
      this.mEvidenceHasSelectList = event;
    },

    //移除当条案件
    mEvidenceRemoveNowRow(orderNo) {
      for (let index = 0; index < this.mEvidenceKeyInfoList.length; index++) {
        if (orderNo === this.mEvidenceKeyInfoList[index].orderNo) {
          this.mEvidenceKeyInfoList.splice(index, 1);
        }
      }
    },

    //批量删除案件
    mEvidence_removeMany() {
      for (let i = 0; i < this.mEvidenceKeyInfoList.length; i++) {
        for (let j = 0; j < this.mEvidenceHasSelectList.length; j++) {
          if ( this.mEvidenceKeyInfoList[i].orderNo === this.mEvidenceHasSelectList[j].orderNo ) {
            this.mEvidenceKeyInfoList.splice(i, 1);
          }
        }
      }
    },

    // //下载多条证据包模板
    // mEvidenceDownMuti() {
    //   if(this.mEvidenceHasSelectList.length === 0) {
    //     this.$Notice.warning({title:'您还未选中任何案件'});
    //   }
    //   else {
    //     if(this.modelInfoList.length!=0){//判断是否有添加模板
    //       this.$refs['mEvidenceRule'].validate(valid=>{
    //         let eviListArr = [];
    //         //已选案件列表
    //         this.mEvidenceHasSelectList.forEach(val=>{
    //           console.log(val)
    //           let obj={};

    //           //添加流水号
    //           obj.flowNumber=val.caseInfo.orderNo;

    //           //添加案件号
    //           //判断是保险保证还是金融案件
    //           if(val.caseInfo.hasOwnProperty("policyNo")){
    //             //保险
    //             obj.policyNo=val.caseInfo.policyNo;
    //           }else{
    //             //金融
    //             obj.caseNumber =val.caseInfo.caseNumber;
    //           }

    //           //添加被告姓名（多个组合）
    //           val.caseInfo.defendants.forEach((item,index)=>{
    //             if(index>0){
    //               obj.defendantName+=','+item.name
    //             }else{
    //               obj.defendantName=item.name
    //             }
    //           });

    //           //追加数组
    //           eviListArr.push(obj);
    //         })

    //         //循环添加type和orderNo
    //         this.modelInfoList.forEach((item,index) => {
    //           item.type='2';
    //           item.orderNo=eviListArr;
    //         });
    //         console.log(this.modelInfoList)
    //         this.$Message.loading({content: '获取文件中,请稍后...', duration: 0});
    //         ftDowntemplate({evidence:this.modelInfoList})
    //         .then(res=>{
    //           this.$Message.destroy();
    //           if(res.data.state === 100) {
    //             tools_downLoad(res.data.data);
    //           }else{
    //             this.$Message.error('获取文件出错，请稍后再试');
    //           }
    //         })
    //       })
    //     }else{
    //       this.$Message.error('请先添加证据模板！');
    //     }
    //   }
    // },
    //下载证据模板
    NewmEvidenceDownMuti(){
      if(this.mEvidenceHasSelectList.length === 0) {
        this.$Notice.warning({title:'您还未选中任何案件'});
      }
      else {
          this.modelInfoList=this.getEviListArr();
          console.log(this.modelInfoList)
          this.$Message.loading({content: '获取文件中,请稍后...', duration: 0});
          ftDowntemplate({evidence:this.modelInfoList})
          .then(res=>{
            this.$Message.destroy();
            if(res.data.state === 100) {
              tools_downLoad(res.data.data);
            }else{
              this.$Message.error('获取文件出错，请稍后再试');
            }
          })
      }
    },
    //获取处理的证据
    getEviListArr(){
      let eviListArr = [];
      //已选案件列表
      this.mEvidenceHasSelectList.forEach(val=>{
        console.log(val)
        let obj={};

        //添加案件类型
        obj.lawCaseType=val.caseInfo.lawCaseType;
        //添加流水号
        obj.flowNumber=val.caseInfo.orderNo;

        //添加案件号
        //判断是保险保证还是金融案件
        if(val.caseInfo.hasOwnProperty("policyNo")){
          //保险
          obj.policyNo=val.caseInfo.policyNo;
        }else{
          //金融
          obj.caseNumber =val.caseInfo.caseNumber;
        }

        //添加被告姓名（多个组合）
        val.caseInfo.defendants.forEach((item,index)=>{
          if(index>0){
            obj.defendantName+=','+item.name
          }else{
            obj.defendantName=item.name
          }
        });

        //追加数组
        eviListArr.push(obj);
      })
      return eviListArr
    },
    //清除单个证据
    mEvidenceClearSingle(orderNo,type) {
      this.mEvidenceKeyInfoList.forEach((val, index) => {
        if (val.orderNo === orderNo) {
          this.mEvidenceKeyInfoList[index]._checked = false;
          switch (type) {
            case "evidence":
              this.mEvidenceKeyInfoList[index].evidenceZip = "暂无";
              this.mEvidenceKeyInfoList[index].caseInfo.evidence = [];
              this.$Notice.success({ title: "清除成功" });
            break;
            case "pic":
              this.mEvidenceKeyInfoList[index].picZip = "暂无";
              this.mEvidenceKeyInfoList[index].caseInfo.pic = [];
              this.$Notice.success({ title: "清除成功" });
            break;
          }

        }
      });
    },
    //下载诉前案件
    downPic() {
      //诉前案件材料的参数
      let picListArr=this.getEviListArr();
      let params = {
        evidence: picListArr//被告订单流水号
      };
      this.$Message.loading("获取中,请稍后....");
      downloadPic(params).then(res => {
        if (res.data.state === 100) {
          this.$Message.destroy();
          this.$Message.success("获取成功");
          tools_downLoad(res.data.data);
        } else {
          this.$Message.error(res.data.mesaage);
        }
      });
    },
    //诉前案件资料上传前
    picBeforeUpload() {
      this.$refs.up2.clearFiles();
      this.$Notice.info({
        title: "正在上传文件请稍后",
        duration: 0
      });
    },
    //诉前案件资料上传
    picMaterialsUpload(res) {
      this.$Notice.destroy(); //关闭上传提示
      console.log(res)
      if(res.state==100){
          this.$Message.success("上传成功！");
          this.mEvidence_fileName2 = "已上传";
          this.uploadDataPicList=res.data;
          //判断哪一个上传成功
          this.mPicShow(this.uploadDataPicList)
      }else{//文件上传失败提示
        this.$Notice.warning({
          title: res.message,
          duration: 5
        });
      }
    },
    //添加诉前文件到每个案件
    mPicShow(orderArr) {
      console.log("ccccc",orderArr)
      for (let i = 0; i < this.mEvidenceKeyInfoList.length; i++) {
        for (let j = 0; j < orderArr.length; j++) {
          if ( this.mEvidenceKeyInfoList[i].orderNo.indexOf(orderArr[j].orderNo) > -1 ) {
            this.mEvidenceKeyInfoList[i].caseInfo.pic = [];
            this.mEvidenceKeyInfoList[i].caseInfo.pic = orderArr[j].fileList;
            this.mEvidenceKeyInfoList[i].picZip = '已上传';
            this.$set(this.mEvidenceKeyInfoList, i, this.mEvidenceKeyInfoList[i]); //dom更新数据
          }
        }
      }
      console.log("b",this.mEvidenceKeyInfoList)
      this.$forceUpdate();
    },
    //提交案件，前提判断是否都有上传案件
    mEvidence_addMany() {
      console.log("ccc",this.mEvidenceHasSelectList)
      //判断选中的数组
      if (this.mEvidenceHasSelectList.length === 0) {
        this.$Notice.error({ title: "请勾选案件" });
      } else {
        //判断选中数组是否都有上传证据
        // let flag = true;
        // for (let i = 0; i < this.mEvidenceHasSelectList.length; i++) {
        //   if(this.mEvidenceHasSelectList[i].caseInfo.evidence.length==0 ||this.mEvidenceHasSelectList[i].caseInfo.evidence=='') {
        //     flag = false;
        //     break;
        //   }else{
        //   }
        // }
        // if(flag === false) {
        //   this.$Notice.error({ title: "请勾选已上传证据的案件！" });
        // }else{
        //   this.$emit("mEvitoStep4", this.mEvidenceHasSelectList);
        // }
        this.$emit("mEvitoStep4", this.mEvidenceHasSelectList);
      }
    },
   
    dataURItoBlob(dataURI) {
        var byteString = atob(dataURI.split(',')[1]);
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], {type: mimeString});
    },
    // //添加模板
    // addModel(){
    //   this.$refs['mEvidenceRule'].validate(valid=>{
    //     if(valid) {
    //       let data =  Object.assign({},this.mEvidenceList);
    //       data.evidenceId=this.modelInfoList.length+1;
    //       this.modelInfoList.push(data);
    //       //清空数据绑定
    //       for(var key in this.mEvidenceList){
    //           this.mEvidenceList[key]="";
    //       }
    //     }else{
    //       this.$Notice.error({ title: "请正确填写模板信息！" });
    //     }
    //   })
    // },
    // //删除指定模板
    // removeInfo(index){
    //   console.log(index);
    //   //清除该条数据
    //   this.modelInfoList.splice(index,1);
    //   //重置序号
    //   this.modelInfoList.forEach((item,key)=> {
    //     item.evidenceId=key+1;
    //   });
    // },

    //返回上一步
    mSendBacktoStep2 () {
      this.$emit('mSendBacktoStep2');
    },
  },
};
</script>

<style scoped>
@import "./Mevidence.css";
</style>
