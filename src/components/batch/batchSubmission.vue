<style lang="less">
@import "./batch.less";
</style>
<style scoped>
.bg-blue {
  background: #2083d8;
  color: #ffffff;
}
.ivu-btn-primary {
  background-color: #2083d8 !important;
  border-color: #2083d8 !important;
}
.ft-plant-upload-button > .ivu-upload > button {
  background: #ffffff;
  color: black;
}
span.mProve-span {
  margin-left: 20px;
}
</style>

<template>
  <div class="batchModel">
    <Row>
      <Form ref="searchForm" :model="searchForm" :label-width="120" class="search-form">
        <Form-item label="材料类型">
          <div
            style="margin-right:20px;display:inline-block;"
            v-for="(i,index) in materialType"
            :key="index"
            @click="changeType(i.id)"
          >
            <Button shape="circle" :class="i.id==active_id?'bg-blue':''">{{i.title}}</Button>
          </div>
        </Form-item>
        <Form-item label="选择文件类型">
          <RadioGroup v-model="fileType">
              <Radio label="压缩文件">{{active_id==1 ? "world压缩文件": "压缩文件"}}</Radio>
              <Radio label="excel文件" v-if="active_id==1">excel文件（个人信息不能修改）</Radio>
          </RadioGroup>
        </Form-item>
        <Form-item label="下载材料模板">
          <Button shape="circle" style="width:190px;" type="primary" @click="download">点击下载至本地</Button>
        </Form-item>
        <Form-item label="导入材料文件">
          <!-- 要素普通上传，剩下两个七牛云上传 -->
          <!-- 要素表 压缩文件上传 -->
          <Upload
            action="/api/court/case/importCase.jhtml"
            class="ft-plant-upload-button"
            :show-upload-list="false"
            :on-success="mAgent_uploadSuccess"
            :before-upload="mAgent_beforeUpload"
            :data="{fileType:'要素表'}"
            v-show="active_id==1 && fileType=='压缩文件'"
            ref="up1"
          >
            <Button type="ghost" icon="ios-cloud-upload-outline">选择文件</Button>
          </Upload>
          <!-- 要素表 excel文件上传 -->
          <Upload
            action="/api/court/case/uploadExcel.jhtml"
            class="ft-plant-upload-button"
            :show-upload-list="false"
            :on-success="mAgent_uploadSuccess"
            :before-upload="mAgent_beforeUpload"
            :data="{fileType:'要素表'}"
            v-show="active_id==1 && fileType=='excel文件'"
            ref="up12"
          >
            <Button type="ghost" icon="ios-cloud-upload-outline">选择文件</Button>
          </Upload>
          <!-- 证明文件 压缩文件上传 -->
          <zh-upload
            ref="mproveUpload1"
            :refid="'mproveFile1'"
            :uploadType="'1'"
            @next="fileNext(arguments,'mproveUpload1')"
            @complete="fileComplete($event,'1')"
            @error="fileError"
            v-show="active_id==2"
          ></zh-upload>
          <!-- 证据文件 压缩文件上传 -->
          <zh-upload
            ref="mproveUpload2"
            :refid="'mproveFile2'"
            :uploadType="'2'"
            @next="fileNext(arguments,'mproveUpload2')"
            @complete="fileComplete($event,'2')"
            @error="fileError"
            v-show="active_id==3"
          ></zh-upload>
          <!-- 诉前案件材料 压缩文件上传 -->
          <Upload
            action="/api/court/case/importEviPicList.jhtml "
            class="ft-plant-upload-button"
            :show-upload-list="false"
            :on-success="picMaterialsUpload"
            :before-upload="picBeforeUpload"
            v-show="active_id==4"
            ref="up2"
          >
            <Button type="ghost" icon="ios-cloud-upload-outline">选择文件</Button>
          </Upload>
          <span class="mProve-span" v-show="active_id==1">{{mProve_fileName0}}</span>
          <span class="mProve-span" v-show="active_id==2">{{mProve_fileName1}}</span>
          <span class="mProve-span" v-show="active_id==3">{{mProve_fileName2}}</span>
          <span class="mProve-span" v-show="active_id==4">{{mProve_fileName3}}</span>
        </Form-item>
      </Form>
    </Row>
    <Alert type="warning" v-show="isError" show-icon closable>
      <span>成功案件个数：{{successNumber}}</span>
      <br>
      <span>失败案件个数：{{failedNumber}}</span>
      <br>
      <span>失败原因：{{reason}}</span>
    </Alert>
    <div style="margin-bottom:25px">
      <Row class="tables">
        <Col span="24">
          <Table
            size="small"
            stripe
            :height="listData.length > 10 ? minHeight : ''"
            :loading="loading"
            border
            :columns="columns"
            :data="listData"
            ref="table"
            sortable="custom"
            @on-selection-change="changeSelect"
          ></Table>
        </Col>
      </Row>
    </div>
    <div class="button-clas" style="text-align:center;">
      <Button
        size="large"
        :loading="buttonLoading"
        @click="save"
        style="background:#2083D8;color:#fff;font-size:16px;width:128px;"
      >提交</Button>
      <Button
        size="large"
        @click="cancel"
        style="background:#F54C4C;color:#fff;padding: 6px 31px;font-size:16px;width:128px;"
      >取消</Button>
    </div>
    <div
      style="position: fixed;top:0;left:0;z-index:9999;width:100%;height:100%;background:#000;opacity:0.5"
      v-show="modal2back"
    ></div>
    <div
      class="noneShow"
      v-show="modal3"
      style="width:200px;position: absolute;top: 20px;z-index: 99999;left: 50%;margin-left: -100px;background: #fff;border-radius: 15px;"
    >
      <div class="ivu-modal-header">
        <div class="ivu-modal-header-inner">单个案件选择承办部门</div>
      </div>
      <div class="ivu-modal-body">
        <Select
          v-model="searchForm.mkks"
          clearable
          filterable
          placeholder="请选择"
          @on-change="selCourt2"
          style="width: 170px"
        >
          <Option v-for="(item,index) in courtList" :key="index" :value="item.id">{{item.name}}</Option>
        </Select>
      </div>
      <div class="ivu-modal-footer">
        <Button @click="modal3 = false;modal2back = false" type="dashed" size="large">关闭</Button>
      </div>
    </div>
    <div
      class="noneShow"
      v-show="modal2"
      style="width:200px;position: absolute;top: 20px;z-index: 99999;left: 50%;margin-left: -100px;background: #fff;border-radius: 15px;"
    >
      <div class="ivu-modal-header">
        <div class="ivu-modal-header-inner">单个案由选择</div>
      </div>
      <div class="ivu-modal-body">
        <Select
          v-model="searchForm2.briefs"
          @on-change="selBrief2"
          clearable
          filterable
          placeholder="请选择"
          style="width: 170px"
        >
          <Option v-for="(item,index) in briefList" :key="index" :value="item.id">{{item.name}}</Option>
        </Select>
      </div>
      <div class="ivu-modal-footer">
        <Button @click="modal2 = false;modal2back = false" type="dashed" size="large">关闭</Button>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getBrief,
  courtList,
  judgeList,
  caseNoList,
  assistantJudgeList,
  clerkList,
  essential,
  downloadFactExcel,
  addProveFile,
  updataLawCase,
  addEvidence,
  addPic,
} from "@/api/global";
import ZhUpload from "@/components/qiniu-upload/quick-upload.vue";
import { distribution, litigationFeeCalculation } from "@/api/batch";
import { ftDownMutiProve, hUpload, ftDowntemplate ,downloadPic} from "@/api/setcase.js";
import { tools_downLoad, formatSeconds } from "@/libs/tools.js";
import Vue from "vue";
export default {
  components: {
    ZhUpload
  },
  data() {
    return {
      mProve_fileName0: "暂未上传任何文件",
      mProve_fileName1: "暂未上传任何文件",
      mProve_fileName2: "暂未上传任何文件",
      mProve_fileName3: "暂未上传任何文件",
      flieFalg: true, //文件上传按钮控制
      flieProgress: 0, //上传进度
      leastTime: 0, //剩余时间
      searchForm: {},
      materialType: [
        {
          id: 1,
          title: "要素表"
        },
        {
          id: 2,
          title: "证明材料"
        },
        {
          id: 3,
          title: "证据文件"
        },
        {
          id: 4,
          title: "诉前案件材料"
        }
      ],
      lawCaseID: [],
      plaintiffName: "",
      lawyerNames: [],
      caseInfos: [],
      eviListArr: [],
      picListArr:[],
      uploadData1: [], //要素上传成功暂存的数据
      uploadData2: [], //证明上传成功暂存的数据
      uploadData3: [], //证据上传成功暂存的数据
      uploadData4: [], //诉前案件上传成功暂存的数据
      commit2:[],//证明提交数据
      commit3:[],//证据提交数据
      commit4:[],//诉前案件提交数据
      active_id: 1,//材料类型id
      fileType:'压缩文件',//材料文件格式
      materialInfo: "",
      searchForm2: {},
      selRow: {},
      loading: false,
      buttonLoading: false,
      isError: false,
      successNumber: "",
      failedNumber: "",
      briefIdData: "",
      reason: "",
      briefList: [], //案由列表
      courtList: [], //法院列表
      judgeList: [], //承办法官列表
      clerkList: [], //承办书记员列表
      assistantJudgeList: [], //法官助理列表
      data: [],
      modal2back: false,
      modal2: false,
      modal3: false,
      minHeight: 450,
      columns: [
        {
          title: "序号",
          type: "index",
          align: "center"
        },
        {
          title: "批次-流水号",
          key: "flowNumber",
          align: "center"
        },
        {
          title: "案号",
          key: "caseNo",
          align: "center",
          // fixed:'right',
          render: (h, params) => {
            return "div", [h("span", params.row.caseNo ? params.row.caseNo : "暂无")];
          }
        },
        {
          title: "案由",
          key: "briefName",
          align: "center",
          // fixed:'right',
          render: (h, params) => {
            return "div", [h("span", params.row.briefName ? params.row.briefName : "暂无")];
          }
        },
        {
          title: "原告",
          key: "plaintiffName",
          // width: 200,
          align: "center"
        },
        {
          title: "原告代理人",
          key: "plaintiffLawyerName",
          // width: 120,
          align: "center"
        },
        {
          title: "被告",
          key: "defendantName",
          // width: 120,
          align: "center"
        },
        {
          title: "承办法官",
          key: "judgeName",
          align: "center",
          // fixed:'right',
          render: (h, params) => {
            return "div", [h("span", params.row.judgeName ? params.row.judgeName : "暂无")];
          }
        },
        {
          title: "要素表",
          key: "keyInfoUp",
          align: "center",
          // fixed:'right',
          render: (h, params) => {
            return (
              "div", [h("span", params.row.keyInfoUp ? "已上传" : "未上传")]
            );
          }
        },
        {
          title: "证明材料",
          key: "proUp",
          align: "center",
          // fixed:'right',
          render: (h, params) => {
            return "div", [h("span", params.row.proUp ? "已上传" : "未上传")];
          }
        },
        {
          title: "证据材料",
          key: "eviUp",
          align: "center",
          // fixed:'right',
          render: (h, params) => {
            return "div", [h("span", params.row.eviUp ? "已上传" : "未上传")];
          }
        },
        {
          title: "诉前案件材料",
          key: "appealUp",
          align: "center",
          // fixed:'right',
          render: (h, params) => {
            return "div", [h("span", params.row.appealUp ? "已上传" : "未上传")];
          }
        },
      ],
      listData: this.listDatas
    };
  },
  props: {
    listDatas: Array
  },
  methods: {
    handleSearch() {},
    changeSelect() {},
    init(){//初始化清空数据
      Object.assign(this.$data, this.$options.data.call(this))
    },
    //提交按钮
    save() {
      console.log(this.listData);
      this.buttonLoading = true;
      switch (this.active_id) {
        case 1: //要素提交
          if(this.fileType=='压缩文件'){
            updataLawCase(this.uploadData1).then(res => {
              this.buttonLoading = false;
              if (res.data.state == 100) {
                this.$Notice.success({
                  title: "",
                  desc: res.data.message,
                  duration: 3
                });
                this.$emit("cancelEvent", 1);
              } else {
                //对应的alert错误提示
                this.isError = true;
                this.successNumber = res.data.data.success;
                this.failedNumber = res.data.data.error;
                this.reason = res.data.message;
              }
            });
          }
          if(this.fileType=='excel文件'){
            this.buttonLoading = false;
            if(this.mProve_fileName0=='已上传'){
              this.$Notice.success({
                    title: "",
                    desc: "提交成功！",
                    duration: 3
              });
              this.$emit("cancelEvent", 1);
            }else{
              this.$Notice.info({
                    title: "",
                    desc: "未上传要素文件！",
                    duration: 3
              });
            }
          }
          break;
        case 2: //证明提交
           addProveFile(this.commit2).then(res => {
            this.buttonLoading = false;
            if (res.data.state == 100) {
              this.$Notice.success({
                title: "",
                desc: res.data.message,
                duration: 3
              });
              //传出已改变的证明证据的字段
              this.$emit("cancelEvent", this.listData);
            } else {
              this.isError = true;
              this.successNumber = res.data.data.success;
              this.failedNumber = res.data.data.error;
              this.reason = res.data.message;
            }
          });
          break;
        case 3: //证据提交
        addEvidence(this.commit3).then(res => {
            this.buttonLoading = false;
            if (res.data.state == 100) {
              this.$Notice.success({
                title: "",
                desc: res.data.message,
                duration: 3
              });
              this.$emit("cancelEvent", this.listData);
            } else {
              this.isError = true;
              this.successNumber = res.data.data.success;
              this.failedNumber = res.data.data.error;
              this.reason = res.data.message;
            }
          });
          break;
          case 4: //诉前案件提交
            addPic(this.commit4).then(res => {
              this.buttonLoading = false;
              if (res.data.state == 100) {
                this.$Notice.success({
                  title: "",
                  desc: res.data.message,
                  duration: 3
                });
                this.$emit("cancelEvent", this.listData);
              } else {
                this.isError = true;
                this.successNumber = res.data.data.success;
                this.failedNumber = res.data.data.error;
                this.reason = res.data.message;
              }
            });
          break;
      }
    },
    fileComplete(result, type) {
      //证据。证明文件上传成功回调
      //上传成功回调
      // 接收成功后返回的信息
      console.log("result", result);
      this.$Notice.destroy();
      this.flieFalg = true;
      this.flieProgress = 0;
      //发送上传的文件名给后端由后端解析文件返回证明文件信息
      this.$Notice.info({
        title: "正在解压文件..请稍后",
        duration: 0
      });
      //解压文件
      hUpload({ filePath: result.key, type: type }).then(res => {
        this.$Notice.destroy();
        //返回解压文件信息
        // this.mProve_dealFeedData(res.data.data);
        if (res.data.state == 100) {
          if (type == "1") {//证明
            this.mProve_fileName1 = "已上传";
            this.uploadData2 = res.data.data.caseInfo;
            this.commit2 = res.data.data
            //判断哪一个上传成功
            this.uploadData2.forEach((item, index) => {
              this.listData.forEach((item1, index1) => {
                if (item.orderNo == item1.flowNumber) {
                  //如果流水号匹对的上说明该案件要素上传成功
                  item1.proUp = true; //设置当前列表项对应的案件的上传转状态
                  item.proUp = true;
                  this.$set(this.listData, index1, item1); //dom更新数据
                }
              });
            });
          } else if(type == "2") {//证据
            this.mProve_fileName2 = "已上传";
            this.uploadData3 = res.data.data;
            this.commit3 = res.data.data
            //匹对上传成功的案件
            this.uploadData3.forEach((item, index) => {
              this.listData.forEach((item1, index1) => {
                if (item.orderNo == item1.flowNumber) {
                  //如果流水号匹对的上说明该案件要素上传成功
                  item1.eviUp = true; //设置当前列表项对应的案件的上传转状态
                  item.eviUp = true; 
                  this.$set(this.listData, index1, item1); //dom更新数据
                }
              });
            });
          }
        }else{
          this.$Notice.warning({
            title: res.data.message,
            duration: 5
          });
        }
      });
    },
     //过程显示进度，ref用来对应哪一个执行了取消上传操作
    fileNext(result, ref) {
      this.flieProgress = result[0].total.percent.toFixed(2);
      //转化时间
      this.leastTime = formatSeconds(result[1]);
      if (this.flieFalg) {
        this.flieFalg = false;
        // 主要用来展示进度
        this.$Notice.info({
          title: "上传中，请稍后....",
          duration: 0,
          render: h => {
            return h("span", [
              h(
                "div",
                {
                  style: {
                    color: "red"
                  }
                },
                `上传过程请勿关闭浏览器或执行其他操作！`
              ),
              h("div", `进度${this.flieProgress}%,预计剩余${this.leastTime}`)
            ]);
          },
          onClose: () => {
            this.$refs[ref].cancelUpload(); //取消文件上传
            this.$Message.warning({ content: "文件上传已取消", duration: 2 });
            this.flieFalg = true;
          }
        });
      }
    },
    //文件上传出错信息
    fileError(errResult) {
      // 失败报错信息
      this.$Notice.destroy();
      this.$Notice.error(errResult);
    },
    //要素表上传
    mAgent_uploadSuccess(res) {
      this.$Notice.destroy(); //关闭上传提示
      console.log("resres",res)
      if(res.state==100){
        this.mProve_fileName0 = "已上传";
        //要素上传成功回调
        if (res.data.content.length != 0) {
          this.uploadData1 = res.data.content; //接收上传成功的数据
          //匹对上传成功的案件
          this.uploadData1.forEach((item, index) => {
            this.listData.forEach((item1, index1) => {
              if (item.flow == item1.flowNumber || item.orderNo == item1.flowNumber) {
                //如果流水号匹对的上说明该案件要素上传成功
                item1.keyInfoUp = true; //设置当前列表项对应的案件的上传转状态
                item.keyInfoUp = true; 
                this.$set(this.listData, index1, item1); //dom更新数据
              }
            });
          });
          console.log("6666", this.listData);
          //部分层失败的案件
          if(res.data.error.length !=0){
            this.showErroMsg(res.data.error)
          }
        }else {
          this.showErroMsg(res.data.error)
        }
      }else{//文件上传失败提示
        this.$Notice.warning({
          title: res.message,
          duration: 5
        });
      }
    },
    showErroMsg(errorAry){//显示错误信息
      // 要素有误提示
      this.$Notice.open({
        title: "上传提示",
        render: (h, params) => {
          return h(
            "div",
            errorAry.map(function(item, index) {
              return h(
                "p",
                {
                  style: {
                    color: "red",
                    marginTop: "10px"
                  }
                },
                item
              );
            })
          );
        },
        duration: 0
      });
    },
    mAgent_beforeUpload(name) {
      this.$refs.up1.clearFiles();
      this.$Notice.info({
        title: "正在上传文件请稍后",
        duration: 0
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
          this.mProve_fileName3 = "已上传";
          this.uploadData4=res.data;
          this.commit4=res.data;
          //判断哪一个上传成功
          this.uploadData4.forEach((item, index) => {
            this.listData.forEach((item1, index1) => {
              if (item.orderNo == item1.flowNumber) {
                //如果流水号匹对的上说明上传成功
                item1.appealUp = true; //设置当前列表项对应的案件的上传状态
                item.appealUp = true;
                this.$set(this.listData, index1, item1); //dom更新数据
              }
            });
          });
      }else{//文件上传失败提示
        this.$Notice.warning({
          title: res.message,
          duration: 5
        });
      }
    },
    /**
     * 选中案由
     */
    selBrief(name) {
      for (let i = 0; i < this.listData.length; i++) {
        this.listData[i].briefId = name;
        for (let u = 0; u < this.briefList.length; u++) {
          if (this.briefList[u].id == name) {
            this.listData[i].briefName = this.briefList[u].name;
          }
        }
        //
        // Vue.set(this.listData, i, this.listData[i]);
      }
      this.listData = JSON.parse(JSON.stringify(this.listData));
    },
    selBrief2(id) {
      for (let i = 0; i < this.listData.length; i++) {
        if (this.listData[i].lawCaseId == this.selRow.lawCaseId) {
          this.listData[i].briefId = id;
          for (let u = 0; u < this.briefList.length; u++) {
            if (this.briefList[u].id == id) {
              this.listData[i].briefName = this.briefList[u].name;
            }
          }
          Vue.set(this.listData, i, this.listData[i]);
        }
      }
      // this.listData = JSON.parse(JSON.stringify(this.listData));
      this.modal2 = false;
      this.modal2back = false;
    },
    /**
     * 选择承办部门
     */
    selCourt(id) {
      for (let i = 0; i < this.listData.length; i++) {
        this.listData[i].courtId = id;
        for (let u = 0; u < this.courtList.length; u++) {
          if (this.courtList[u].id == id) {
            this.listData[i].courtName = this.courtList[u].name;
          }
        }
        // Vue.set(this.listData, i, this.listData[i]);
      }
      this.listData = JSON.parse(JSON.stringify(this.listData));
    },
    /**
     * 单个案件选择承办部门
     */
    selCourt2(id) {
      for (let i = 0; i < this.listData.length; i++) {
        if (this.listData[i].lawCaseId == this.selRow.lawCaseId) {
          this.listData[i].courtId = id;
          for (let u = 0; u < this.courtList.length; u++) {
            if (this.courtList[u].id == id) {
              this.listData[i].courtName = this.courtList[u].name;
            }
          }
          Vue.set(this.listData, i, this.listData[i]);
        }
      }
      // this.listData = JSON.parse(JSON.stringify(this.listData));
      this.modal3 = false;
      this.modal2back = false;
    },
    /**
     * 选择承办人
     */
    selJudge(id) {
      for (let i = 0; i < this.listData.length; i++) {
        this.listData[i].judgeId = id;
        Vue.set(this.listData, i, this.listData[i]);
      }
    },
    changeType(id) {
      this.active_id = id;
    },
    /**
     * 下载文件
     */
    download() {
      let sendObj={}
      //参数是已选择的数组中每项lawCaseID的集合
      sendObj["lawCaseList"] = this.lawCaseID
      sendObj["brief"] = this.listData[0].briefName
      switch (this.active_id) {
        case 1:
          console.log(sendObj);
          if(this.fileType=="压缩文件"){
            essential(sendObj).then(res => {
              if (res.data.state == 100) {
                let path = res.data.data.filePath;
                tools_downLoad(path);
              }
            });
          }
          if(this.fileType=="excel文件"){
            downloadFactExcel(sendObj).then(res => {
              if (res.data.state == 100) {
                let path = res.data.data.filePath;
                tools_downLoad(path);
              }
            });
          }
          break;
        case 2:
          this.downProveFile();
          break;
        case 3:
          this.downEviFile();
          break;
        case 4:
          this.downPic();
          break;
      }
    },

    //下载模板
    downProveFile() {
      let params = {
        plainffName: this.plaintiffName,
        lawyerNames: this.lawyerNames,
        caseInfos: this.caseInfos //被告订单流水号
      };

      this.$Message.loading("获取中,请稍后....");
      ftDownMutiProve(params).then(res => {
        if (res.data.state === 100) {
          this.$Message.destroy();
          this.$Message.success("获取成功");
          tools_downLoad(res.data.data);
        } else {
          this.$Message.error(res.data.mesaage);
        }
      });
    },

    //下载证据
    downEviFile() {
      let params = {
        evidence: this.eviListArr //被告订单流水号案件类型
      };
      this.$Message.loading("获取中,请稍后....");
      ftDowntemplate(params).then(res => {
        if (res.data.state === 100) {
          this.$Message.destroy();
          this.$Message.success("获取成功");
          tools_downLoad(res.data.data);
        } else {
          this.$Message.error(res.data.mesaage);
        }
      });
    },

    //下载诉前案件
    downPic() {
      let params = {
        evidence: this.picListArr//被告订单流水号
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
    /**
     * 选择书记员
     */
    selClerk(id) {
      for (let i = 0; i < this.listData.length; i++) {
        this.listData[i].clerkId = id;
        Vue.set(this.listData, i, this.listData[i]);
      }
    },
    /**
     * 选择书记员
     */
    selassistant(id) {
      for (let i = 0; i < this.listData.length; i++) {
        this.listData[i].assistantJudgeId = id;
        Vue.set(this.listData, i, this.listData[i]);
      }
    },
    /**
     * 案号分配规则
     */
    selCaseNo(name) {
      if (name == "自动分配") {
        let ary = [];
        this.loading = true;
        caseNoList(0, this.listData.length).then(res => {
          if (res.data.state == 100) {
            ary = res.data.data;
            for (let i = 0; i < this.listData.length; i++) {
              this.listData[i].caseNo = ary[i];
              Vue.set(this.listData, i, this.listData[i]);
            }
            this.loading = false;
          } else {
            this.$Notice.warning({
              title: "",
              desc: res.data.message,
              duration: 5
            });
          }
        });
      }
    },
    /**
     * 适用程序
     */
    selProcedure(name) {
      for (let i = 0; i < this.listData.length; i++) {
        this.listData[i].ProcedureType = name;
        Vue.set(this.listData, i, this.listData[i]);
      }
      // this.listData = JSON.parse(JSON.stringify(this.listData));
    },
    //初始化获取数据
    getList() {
      this.buttonLoading = false;
      this.isError = false;
      (this.listData = this.listDatas), (this.searchForm.caseno = "");
      this.searchForm.Procedure = "";
      this.briefIdData = "";
      //获取案由
      getBrief().then(res => {
        if (res.data.state == 100) {
          this.briefList = res.data.data;
          for (let i = 0; i < this.briefList.length; i++) {
            for (let j = 0; j < this.listData.length; j++) {
              if (this.briefList[i].name == this.listData[j].briefName) {
                this.listData[j].briefId = this.briefList[i].id;
              }
            }
          }
        }
      }),
      //获取法院部门列表
      courtList().then(res => {
        if (res.data.state == 100) {
          this.courtList = res.data.data;
          for (let i = 0; i < this.courtList.length; i++) {
            if (this.courtList[i].name == "厦门金融协同中心") {
              this.searchForm.mkk = this.courtList[i].id;
              this.selCourt(this.courtList[i].id);
            }
          }
        }
      });
      // judgeList().then(res =>{
      //     if(res.data.state == 100){
      //         this.judgeList = res.data.data;
      //     }
      // })
      // clerkList().then(res => {
      //     if(res.data.state == 100){
      //         this.clerkList = res.data.data.clerk;
      //     }
      // })
      // assistantJudgeList().then(res => {
      //     if(res.data.state == 100){
      //         this.assistantJudgeList = res.data.data.judgeAssistant;
      //     }
      // })
      let ary = [];
      for (let i = 0; i < this.listData.length; i++) {
        const data = {
          type: 1,
          lawCaseId: this.listData[i].lawCaseId.toString(),
          basicCost: "0.0",
          property: "0.0",
          applyStandard: this.listData[i].applyStandard
            ? this.listData[i].applyStandard.toString()
            : "0.0"
        };
        ary.push(data);
      }
      this.lawCaseID = [];
      for (let i = 0; i < this.listData.length; i++) {
        this.lawCaseID.push(this.listData[i].lawCaseId);
      }

      //因为选取的是一组类型
      this.plaintiffName = this.listData[0].plaintiffName;

      //代理人律师
      this.lawyerNames = this.listData[0].plaintiffLawyerName.split(",");
      //证明材料的参数
      this.listData.forEach((item, index) => {
        let obj = {};
        obj.defendantName = item.defendantName; //被告
        obj.caseNumber = ""; //订单号
        obj.flowNumber = item.flowNumber; //流水号
        this.caseInfos.push(obj);
      });

      //证据材料的参数
      this.listData.forEach((item, index) => {
        let obj = {};
        obj.defendantName = item.defendantName; //被告
        obj.caseNumber = ""; //订单号
        obj.lawCaseType = item.lawCaseType //案件类型
        obj.flowNumber = item.flowNumber; //流水号
        this.eviListArr.push(obj);
      });
      
      //诉前案件材料的参数
      this.listData.forEach((item, index) => {
        let obj = {};
        obj.defendantName = item.defendantName; //被告
        obj.caseNumber = item.caseNo;//订单号
        obj.flowNumber = item.flowNumber; //流水号
        this.picListArr.push(obj);
      });
      let ds  = {
        lawCaseList: ary
      };
      this.searchForm.Procedure = "简易程序";
      litigationFeeCalculation(ds).then(res => {
        if (res.data.state == 100) {
          for (let i = 0; i < this.listData.length; i++) {
            let list = res.data.data;
            for (let u = 0; u < list.length; u++) {
              if (list[u].lawCaseId == this.listData[i].lawCaseId) {
                this.listData[i].litigationCost = list[u].discount;
              }
            }
          }
          this.listData = JSON.parse(JSON.stringify(this.listData));
        }
      });
      console.log(this.listData);
    },
    cancel() {
      this.handleReset("searchForm");
      this.$emit("cancelEvent");
    },
    //表单清空
    handleReset(name) {
      this.$refs[name].resetFields();
    }
  }
};
</script>

