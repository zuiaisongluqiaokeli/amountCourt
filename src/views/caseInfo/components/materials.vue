<style lang="less" scope>
.myIndex {
  z-index: 9999 !important;
}
</style>
<template>
  <div class="caseInfo litigantInfo" style="position:relative">
    <Button type="primary" @click="addFile">补充证明文件</Button>
    <Modal
      v-model="evidenceShow"
      title="补充证明文件"
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
          :label="qtwNames"
          :label-width="300"
          class="ft_form ft-plant-chooseType ft-plant-upload"
          prop="evidenceFile"
        >
          <Upload
            action="/api/court/case/upScanning.jhtml"
            :data="{fileType:'原告身份证明文件'}"
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
          label="代理人身份证明文件"
          :label-width="300"
          class="ft_form ft-plant-chooseType ft-plant-upload"
          prop="evidenceFile"
        >
          <Upload
            action="/api/court/case/upScanning.jhtml"
            :data="{fileType:'代理人身份证明文件'}"
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
          :label="qtwNames1"
          :label-width="300"
          class="ft_form ft-plant-chooseType ft-plant-upload"
          prop="evidenceFile"
        >
          <Upload
            action="/api/court/case/upScanning.jhtml"
            :data="{fileType:'授权与所函/劳动合同或公积金缴交证明'}"
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
      </Form>
    </Modal>
    <Spin size="large" fix v-show="isLoading"></Spin>
    <Row class="bsDiv">
      <Col style="width:48%;float:left;box-shadow: 3px 3px 5px #DCDCDC;">
        <Collapse v-model="catation3">
          <Panel name="1">
            原告身份证明文件（自然人）/营业执照（单位）
            <div slot="content" class="elendi">
              <zh-viewer :viewerId="'idCard'" :fileUrls="plaintiffBusinesss"></zh-viewer>
            </div>
          </Panel>
        </Collapse>
      </Col>
      <Col style="width:48%;float:left;box-shadow: 3px 3px 5px #DCDCDC;">
        <Collapse v-model="catation3">
          <Panel name="1">
            代理人身份证明文件
            <div slot="content" class="elendi">
              <zh-viewer :viewerId="'idCard'" :fileUrls="plaintiffBusinesss"></zh-viewer>
            </div>
          </Panel>
        </Collapse>
      </Col>
    </Row>
    <Row class="bsDiv">
      <Col style="width:48%;float:left;box-shadow: 3px 3px 5px #DCDCDC;">
        <Collapse v-model="catation4">
          <Panel name="1">
            授权与所函（律师）/劳动合同或公积金缴交证明（职员、公民）
            <div slot="content" class="elendi">
              <zh-viewer :viewerId="'agentBook'" :fileUrls="lawyerBusinesss"></zh-viewer>
            </div>
          </Panel>
        </Collapse>
      </Col>
    </Row>
  </div>
</template>
<script>
import { material, evidenceSubmitted } from "@/api/caseInfo";
import ZhViewer from "@/components/moreFileViewer/moreFileViewer.vue";
var gallery;
export default {
  components: {
    ZhViewer
  },
  data() {
    return {
      isLoading: false,
      supplementaryEvidence: {
        lawCaseId: "",
        file: []
      }, //补充证明文件提交列表
      evidenceShow: false, //补充证据提示弹窗显示
      eviCount: [], //证据列表
      evi_fileName: "",
      eviType:[
        ["原告身份证明文件","营业执照"],
        ["授权与所函","劳动合同或公积金缴交证明","授权与所函（律师）/劳动合同或公积金缴交证明（职员、公民）"],
      ],
      evi_fileName1: [],
      evi_fileName2: [],
      evi_fileName3: [],
      eviFileList: [], //证据文件列表
      eviFileList1: [],
      eviFileList2: [],
      eviFileList3: [],
      catation3: "1",
      catation4: "1",
      plaintiffBusinesss: [], //原告
      lawyerBusinesss: [] //代理
    };
  },
  methods: {
    //补充证明材料，每次进入清空
    addFile(){
        this.evidenceShow = true
        this.eviFileList1 = []
        this.eviFileList2 = []
        this.eviFileList3 = []
        this.evi_fileName1 = []
        this.evi_fileName2 = []
        this.evi_fileName3 = []
        this.supplementaryEvidence.file = []
        this.supplementaryEvidence.lawCaseId = []
    },
    //补充证据提交
    ok() {
      this.supplementaryEvidence.lawCaseId = this.changeMemberTab;
    
      let obj1={
        qtwName:"原告身份证明文件",
        file:[]
      }
      this.eviFileList1.forEach((item2, index) => {
        this.setFileLsit(obj1.file,item2.fileName,item2.filePath,3)
      });
      let obj2={
        qtwName:"代理人身份证明文件",
        file:[]
      }
      this.eviFileList2.forEach((item2, index) => {
        this.setFileLsit(obj2.file,item2.fileName,item2.filePath,3)
      });
      let obj3={
        qtwName:"授权与所函",
        file:[]
      }
      this.eviFileList3.forEach((item2, index) => {
        this.setFileLsit(obj3.file,item2.fileName,item2.filePath,3)
      });
      this.supplementaryEvidence.file.push(obj1,obj2,obj3);
      console.log(this.supplementaryEvidence);
      //提交：重新整理数据一并提交
      evidenceSubmitted(this.supplementaryEvidence).then(res => {
        this.isLoading = false;
        if (res.data.state == 100) {
          this.$Message.success("提交成功");
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
          fileName,
          filePath
        };
        switch (data.fileType) {
          case "原告身份证明文件":
            this.evi_fileName1.push(fileName);
            this.eviFileList1.push(eviFile);
            console.log("111111",this.eviFileList1)
            break;
          case "代理人身份证明文件":
            this.evi_fileName2.push(fileName);
            this.eviFileList2.push(eviFile);
            break;
          case "授权与所函/劳动合同或公积金缴交证明":
            this.evi_fileName3.push(fileName);
            this.eviFileList3.push(eviFile);
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
      }
    },
    //获取原告列表和代理人列表
    getMaterials() {
      this.isLoading = true;
      material(this.changeMemberTab).then(res => {
        this.isLoading = false;
        if (res.data.state == 100) {
          let data = res.data.data;
          this.plaintiffBusinesss = data.plaintiffBusinesss;
          this.lawyerBusinesss = data.lawyerBusinesss;
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
      let menuCard = document.getElementsByClassName("selTabs");
      for (let i = 0; i < menuCard.length; i++) {
        menuCard[i].classList.remove("tabOn");
      }
      menuCard[num].classList.add("tabOn");
    }
  },
  //上传证据的时候label是依据代理人或原告人类型来显示的
  computed: {
    changeMemberTab() {
      return this.$store.getters.caseId;
    },
    litigantType: function() {//原告类型
      return this.$store.getters.litigantType;
    },
    agentType: function() {//代理人类型（这里获取到的是两个代理人的类型数组）
      return this.$store.getters.agentType;
    },
    //判断原告身份类型，显示对应上传文件接口
    qtwNames:function(){
      let qtwNames='';
      console.log("litigantType",this.litigantType)
      //如果是自然人或者非法人是原告身份证明文件
      switch (this.litigantType) {
        case "自然人":
        case "非法人组织":
          qtwNames=this.eviType[0][0];
        break;
        case "法人":
          qtwNames=this.eviType[0][1];
        break;
      }
      console.log("qtwNames",qtwNames)
      return qtwNames
    },
    //判断代理人类型，显示对应上传文件接口
    qtwNames1:function(){
      let qtwNames='';
      console.log("agentType",this.agentType)
      //代理人是只有1个或者两个相同的情况
      if(this.agentType.length==1 || this.agentType[0]==this.agentType[1]){//判断代理人类型是否一致
        switch (this.agentType[0]) {
          case "律师":
          case "法律工作者":
            qtwNames=this.eviType[1][0];
          break;
          case "公民":
          case "职员":
          case "职工":
          case "亲属":
            qtwNames=this.eviType[1][1];
          break;
        }
        console.log("qtwNames",qtwNames)
      }else{
        qtwNames=this.eviType[1][2];
      }
      return qtwNames
    }
  }
};
</script>