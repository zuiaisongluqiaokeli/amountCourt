<style lang="less" scope>
.myIndex {
  z-index: 9999 !important;
}
</style>
<template>
  <div class="caseInfo litigantInfo" style="position:relative">
    <Button type="primary" @click="addFile">补充证据文件</Button>
    <Modal
      v-model="evidenceShow"
      title="补充证据文件"
      width="750"
      @on-ok="ok"
      id="evidenceModel"
      class-name="myIndex"
    >
      <Form
        label-position="right"
        :label-width="190"
        ref="eviFromRule"
        style="margin:0 auto;width:821px;"
      >
        <FormItem
          :label="qtwNames[0]"
          :label-width="300"
          class="ft_form ft-plant-chooseType ft-plant-upload"
          prop="evidenceFile"
        >
          <Upload
            action="/api/court/case/upScanning.jhtml"
            :data="{fileType:qtwNames[0]}"
            :multiple="true"
            class="ft-plant-upload-button"
            :on-success="evi_uploadSuccess"
          >
            <Button type="ghost" style="width:200px" icon="ios-cloud-upload-outline">选择文件（可多选）</Button>
          </Upload>
        </FormItem>
        <FormItem>
          <div v-for="item in evi_fileName1">
            <span class="fileName">{{item}}</span>
            <a @click="delFile('file1',item)">删除</a>
          </div>
        </FormItem>

        <FormItem
          :label="qtwNames[1]"
          :label-width="300"
          class="ft_form ft-plant-chooseType ft-plant-upload"
          prop="evidenceFile"
        >
          <Upload
            action="/api/court/case/upScanning.jhtml"
            :data="{fileType:qtwNames[1]}"
            :multiple="true"
            class="ft-plant-upload-button"
            :on-success="evi_uploadSuccess"
          >
            <Button type="ghost" style="width:200px" icon="ios-cloud-upload-outline">选择文件（可多选）</Button>
          </Upload>
        </FormItem>
        <FormItem>
          <div v-for="item in evi_fileName2">
            <span class="fileName">{{item}}</span>
            <a @click="delFile('file2',item)">删除</a>
          </div>
        </FormItem>

        <FormItem
          :label="qtwNames[2]"
          :label-width="300"
          class="ft_form ft-plant-chooseType ft-plant-upload"
          prop="evidenceFile"
        >
          <Upload
            action="/api/court/case/upScanning.jhtml"
            :data="{fileType:qtwNames[2]}"
            :multiple="true"
            class="ft-plant-upload-button"
            :on-success="evi_uploadSuccess"
          >
            <Button type="ghost" style="width:200px" icon="ios-cloud-upload-outline">选择文件（可多选）</Button>
          </Upload>
        </FormItem>
        <FormItem>
          <div v-for="item in evi_fileName3">
            <span class="fileName">{{item}}</span>
            <a @click="delFile('file3',item)">删除</a>
          </div>
        </FormItem>

        <FormItem
          :label="qtwNames[3]"
          :label-width="300"
          class="ft_form ft-plant-chooseType ft-plant-upload"
          prop="evidenceFile"
        >
          <Upload
            action="/api/court/case/upScanning.jhtml"
            :data="{fileType:qtwNames[3]}"
            :multiple="true"
            class="ft-plant-upload-button"
            :on-success="evi_uploadSuccess"
          >
            <Button type="ghost" style="width:200px" icon="ios-cloud-upload-outline">选择文件（可多选）</Button>
          </Upload>
        </FormItem>
        <FormItem>
          <div v-for="item in evi_fileName4">
            <span class="fileName">{{item}}</span>
            <a @click="delFile('file4',item)">删除</a>
          </div>
        </FormItem>
      </Form>
    </Modal>
    <Spin size="large" fix v-show="isLoading"></Spin>
    <Row class="bsDiv">
      <Col
        style="width:48%;float: left;margin: 0px 1% 20px 1%;box-shadow: 3px 3px 5px #DCDCDC"
        v-for="(item,index) in evidenceList"
        :key="index"
      >
        <Collapse value="1">
          <Panel name="1">
            {{item.evidenceNum}}
            <div slot="content" class="carou">
              <div class="carouRow">
                <Row class="tabs" style>
                  <Col
                    span="4"
                    align="left"
                    valign="middle"
                    class="Tbs height-wit tb-head"
                    style="position:absolute;"
                  >证据名称</Col>
                  <Col span="20" align="left" class="Tbs height-wit" style="float: right;">
                    <span>{{item.name}}</span>
                  </Col>
                </Row>
                <!-- <Row class="tabs" style="">
                                <Col span="4" align="left" valign="middle" class="Tbs height-wit tb-head" style="position:absolute;">
                                    证明对象
                                </Col>
                                <Col span="20" align="left" class="Tbs height-wit" style="float: right;">
                                    <span>{{item.prove}}</span>
                                </Col>
                </Row>-->
              </div>
              <div slot="content" class="elendi">
                <zh-viewer :viewerId="'evidence'+index" :fileUrls="delUrl(item.filePaths)"></zh-viewer>
              </div>
            </div>
          </Panel>
        </Collapse>
      </Col>
    </Row>
  </div>
</template>
<script>
import { formatDate } from "@/libs/date";
import ZhViewer from "@/components/moreFileViewer/moreFileViewer.vue";
import { evidenceList, evidenceSubmitted } from "@/api/caseInfo";

export default {
  components: {
    ZhViewer
  },
  data() {
    return {
      caseInfo: {},
      supplementaryEvidence: {
        lawCaseId: "",
        file: []
      }, //补充证据提交列表
      isLoading: false,
      evidenceList: [],
      evidenceShow: false, //补充证据提示弹窗显示
      eviCount: [], //证据列表
      eviType:[
        ["证明被告主体信息类证据","证明信用卡合同关系存在的证据","证明信用卡消费及最新欠款金额的证据","证明实现债权费用的证据"],
        ["证明被告主体信息类证据","证明借贷及担保关系存在的证据","证明放款、还款及最新欠款金额的证据","证明实现债权费用的证据"],
        ["证明被告主体信息类证据","证明借贷及保证保险关系存在的证据","证明放款、还款、保险赔款支付及最新欠款金额的证据","证明实现债权费用的证据"]
      ],
      qtwNames:[],//需要的证据列表
      evi_fileName: "",
      evi_fileName1: [],
      evi_fileName2: [],
      evi_fileName3: [],
      evi_fileName4: [],
      eviFileList: [], //证据文件列表
      eviFileList1: [],
      eviFileList2: [],
      eviFileList3: [],
      eviFileList4: [],
    };
  },
  mounted() {},
  computed: {
    caseId: function() {
      return this.$store.getters.caseId;
    }
  },
  methods: {
    //显示补充证据模态框
    addFile(){
      this.evidenceShow = true
      this.evi_fileName1 = []
      this.evi_fileName2 = []
      this.evi_fileName3 = []
      this.evi_fileName4 = []
      this.eviFileList1 = []
      this.eviFileList2 = []
      this.eviFileList3 = []
      this.eviFileList4 = []
      this.supplementaryEvidence.file = []
      this.supplementaryEvidence.lawCaseId = ""
      this.getBreif()
    },
    getBreif(){//获取案由
      let qtwNames=[];
      let breifName=this.$store.getters.breifName
      switch (breifName) {
        case "信用卡纠纷":
          qtwNames=this.eviType[0];
        break;
        case "金融借款合同纠纷":
          qtwNames=this.eviType[1];
        break;
        case "保证保险合同纠纷":
          qtwNames=this.eviType[2];
        break;
      }
      console.log("qtwNames",qtwNames)
      this.qtwNames=qtwNames
    },
    //补充证据提交
    ok() {
      this.supplementaryEvidence.lawCaseId = this.caseId;
      let obj1={
        qtwName:this.qtwNames[0],
        file:[]
      }
      this.eviFileList1.forEach((item2, index) => {
        this.setFileLsit(obj1.file,item2.fileName,item2.evidenceFile,0)
      });
      let obj2={
        qtwName:this.qtwNames[1],
        file:[]
      }
      this.eviFileList2.forEach((item2, index) => {
        this.setFileLsit(obj2.file,item2.fileName,item2.evidenceFile,0)
      });
      let obj3={
        qtwName:this.qtwNames[2],
        file:[]
      }
      this.eviFileList3.forEach((item2, index) => {
        this.setFileLsit(obj3.file,item2.fileName,item2.evidenceFile,0)
      });
      let obj4={
        qtwName:this.qtwNames[3],
        file:[]
      }
      this.eviFileList4.forEach((item2, index) => {
        this.setFileLsit(obj4.file,item2.fileName,item2.evidenceFile,0)
      });
      this.supplementaryEvidence.file.push(obj1,obj2,obj3,obj4);
      console.log(this.supplementaryEvidence);
      evidenceSubmitted(this.supplementaryEvidence).then(res => {
        this.isLoading = false;
        if (res.data.state == 100) {
          this.$Message.success("提交成功");
          this.evidenceShow=false;
          this.getEvidenceList()//更新证据文件
        } else {
          this.$Notice.warning({
            title: "",
            desc: res.data.message,
            duration: 5
          });
        }
      });
    },
    setFileLsit(ary,fileName,filePath,fileFlag){//添加文件列表
        let obj={
          fileName,
          filePath,
          fileFlag,
        }
        ary.push(obj)
    },
    //上传成功事件
    evi_uploadSuccess(response, file, fileList) {
      if (response.state === 100) {
        this.$Message.success("上传成功!");
        let data = response.data.result[0];
        let fileName = data.fileName;
        let filePath = data.filePath;
        let eviFile = {
          fileName: fileName,
          evidenceFile: filePath
        };
        switch (data.fileType) {
          case "证明被告主体信息类证据":
            this.evi_fileName1.push(fileName);
            this.eviFileList1.push(eviFile);
            break;
          case "证明借贷及担保关系存在的证据":
          case "证明信用卡合同关系存在的证据":
          case "证明借贷及保证保险关系存在的证据":
            this.evi_fileName2.push(fileName);
            this.eviFileList2.push(eviFile);
            break;
          case "证明信用卡消费及最新欠款金额的证据":
          case "证明放款、还款及最新欠款金额的证据":
          case "证明放款、还款、保险赔款支付及最新欠款金额的证据":
            this.evi_fileName3.push(fileName);
            this.eviFileList3.push(eviFile);
            break;
          case "证明实现债权费用的证据":
            this.evi_fileName4.push(fileName);
            this.eviFileList4.push(eviFile);
            break;
        }
      } else {
        this.$Notice.error({ title: response.message });
      }
    },
    //删除文件
    delFile(type, name) {
      switch (type) {
        case "file1":
          this.evi_fileName1.forEach((item, index) => {
            if (item == name) {
              this.evi_fileName1.splice(index, 1);
              this.eviFileList1.splice(index, 1);
            }
          });
          break;
        case "file2":
          this.evi_fileName2.forEach((item, index) => {
            if (item == name) {
              this.evi_fileName2.splice(index, 1);
              this.eviFileList2.splice(index, 1);
            }
          });
          break;
        case "file3":
          this.evi_fileName3.forEach((item, index) => {
            if (item == name) {
              this.evi_fileName3.splice(index, 1);
              this.eviFileList3.splice(index, 1);
            }
          });
          break;
        case "file4":
          this.evi_fileName4.forEach((item, index) => {
            if (item == name) {
              this.evi_fileName4.splice(index, 1);
              this.eviFileList4.splice(index, 1); //删除文件列表
            }
          });
          break;
      }
    },
    //上传证据
    // ft_evi_addEvidence (name) {
    //   this.$refs[name].validate(valid =>{
    //     if (valid) {
    //         //数据处理
    //         let hasconfrimEvidence = Object.assign({},this.eviList); //防止object浅复制
    //         delete hasconfrimEvidence['evidenceFile'];
    //         delete hasconfrimEvidence['fileName'];
    //         Array.from([],hasconfrimEvidence.file);
    //         hasconfrimEvidence.file = this.eviFileList; //防止array浅复制
    //         this.eviCount.push(hasconfrimEvidence);
    //         //清空数据
    //         this.$Notice.success({'title':'添加成功'});
    //         this.$refs.eviFromRule.resetFields();
    //         this.eviFileList = [];
    //         this.evi_fileName = '';
    //     }else{
    //       this.$Notice.warning({'title':'请完善证据信息'})
    //     }
    //   })
    // },
    getEvidenceList() {
      //获取证据列表
      this.evidenceList = [];
      this.isLoading = true;
      evidenceList(this.$store.getters.caseId).then(res => {
        this.isLoading = false;
        if (res.data.state == 100) {
          this.evidenceList = res.data.data;
          console.log("获取证据列表",this.evidenceList);
        } else {
          this.$Notice.warning({
            title: "",
            desc: res.data.message,
            duration: 5
          });
        }
      });
    },
    changeMenu(num) {
      //菜单改变切换
      let menuCard = document.getElementsByClassName("selTabs");
      for (let i = 0; i < menuCard.length; i++) {
        menuCard[i].classList.remove("tabOn");
      }
      menuCard[num].classList.add("tabOn");
    },
    delUrl(fileAry) {
      //获取处理文件地址
      let newAry = [];
      fileAry.forEach((item, index) => {
        newAry.push(item.addr);
      });
      return newAry;
    }
  }
};
</script>

