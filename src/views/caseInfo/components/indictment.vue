<style lang="less" scope>
.myIndex {
  z-index: 9999 !important;
}
.fileName {
  margin-left: 40px;
}
</style>
<template>
  <div class="caseInfo litigantInfo" style="position:relative">
    <Button type="primary" @click="evidenceShow = true">补充纸质起诉状</Button>
    <Modal
      v-model="evidenceShow"
      title="补充纸质起诉状"
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
          label="补充起诉状"
          :label-width="300"
          class="ft_form ft-plant-chooseType ft-plant-upload"
          prop="evidenceFile"
        >
          <Upload
            action="/api/court/case/upScanning.jhtml"
            :data="{fileType:'起诉状'}"
            :multiple="true"
            class="ft-plant-upload-button"
            :show-upload-list="false"
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
      </Form>
    </Modal>
    <Spin size="large" fix v-show="isLoading"></Spin>
    <Row class="bsDiv">
      <Col style="width:48%;float:left;box-shadow: 3px 3px 5px #DCDCDC;">
        <Collapse v-model="catation3">
          <Panel name="1">
            电子起诉状(当事人在线立案填写提交后自动生成)
            <div slot="content" class="elendi">
              <zh-viewer :viewerId="'electronicsIndictment'" :fileUrls="electronicsIndictment"></zh-viewer>
            </div>
          </Panel>
        </Collapse>
      </Col>
      <Col style="width:48%;float:right;box-shadow: 3px 3px 5px #DCDCDC;">
        <Collapse v-model="catation4">
          <Panel name="1">
            纸质起诉状（当事人上传扫描件）
            <div slot="content" class="elendi">
              <zh-viewer :viewerId="'paperIndictment'" :fileUrls="paperIndictment"></zh-viewer>
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
import { indictment, evidenceSubmitted } from "@/api/caseInfo";
export default {
  components: {
    ZhViewer
  },
  data() {
    return {
      catation3: "1",
      catation4: "1",
      isLoading: false,
      litigationRequest: "暂无数据", //诉讼请求
      reason: "暂无数据", //事实与理由
      electronicsIndictment: [], //电子起诉讼
      paperIndictment: [], //纸质起诉讼
      evidenceShow: false, //补充证据提示弹窗显示
      evi_fileName1: [],
      eviFileList1: [],
      supplementaryEvidence: {
        //补充证据提交列表
        lawCaseId: "",
        file: []
      }
    };
  },
  mounted() {},
  methods: {
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
          case "起诉状":
            this.evi_fileName1.push(fileName);
            this.eviFileList1.push(eviFile);
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
      }
    },
    //补充证据提交
    ok() {
      this.supplementaryEvidence.lawCaseId = this.changeMemberTab;
      let obj1 = {
        qtwName: "起诉状",
        file: []
      };
      this.eviFileList1.forEach((item2, index) => {
        this.setFileLsit(obj1.file, item2.fileName, item2.evidenceFile, 2);
      });
      this.supplementaryEvidence.file.push(obj1);
      console.log(this.supplementaryEvidence);
      evidenceSubmitted(this.supplementaryEvidence).then(res => {
        this.isLoading = false;
        if (res.data.state == 100) {
          this.$Message.success("提交成功");
          this.evidenceShow=false;
          this.getIndictment()//更新证明文件
        } else {
          this.$Notice.warning({
            title: "",
            desc: res.data.message,
            duration: 5
          });
        }
      });
    },
    setFileLsit(ary, fileName, filePath, fileFlag) {
      //添加文件列表
      let obj = {
        fileName,
        filePath,
        fileFlag
      };
      ary.push(obj);
    },
    getIndictment() {
      this.isLoading = true;
      let that = this;
      indictment(this.changeMemberTab).then(res => {
        this.isLoading = false;
        if (res.data.state == 100) {
          let data = res.data.data;
          this.litigationRequest = data.litigationRequest;
          this.reason = data.reason;
          this.electronicsIndictment = [];
          this.paperIndictment = [];
          if (data.electronicsIndictment) {
            this.electronicsIndictment.push(data.electronicsIndictment.addr);
          }

          data.paperIndictment.forEach((item, index) => {
            that.paperIndictment.push(item.addr);
          });
          console.log(this.paperIndictment);
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
  computed: {
    changeMemberTab() {
      return this.$store.getters.caseId;
    }
  }
};
</script>