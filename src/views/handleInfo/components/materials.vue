<style lang="less">
@import "./common.less";
</style>
<template>
  <div class="caseInfo litigantInfo" style="position:relative">
    <Spin size="large" fix v-show="isLoading"></Spin>
    <Row class="bsDiv">
      <Col style="width:48%;float:left;box-shadow: 3px 3px 5px #DCDCDC;">
        <Collapse v-model="catation3">
          <Panel name="1">原告身份证
            <div slot="content" class="elendi">
               <zh-viewer :viewerId="'idCard'" :fileUrls="plaintiffBusinesss"></zh-viewer>
            </div>
          </Panel>
        </Collapse>
      </Col>
      <Col style="width:48%;float:right;box-shadow: 3px 3px 5px #DCDCDC;">
        <Collapse v-model="catation4">
          <Panel name="1">委托代理人授权书
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
import { formatDate } from "@/libs/date";
import { material } from "@/api/caseInfo";
import ZhViewer from '@/components/moreFileViewer/moreFileViewer.vue';
var gallery;
export default {
  components:{
    ZhViewer
  },
  data() {
    return {
      isLoading: false,
      catation3: "1",
      catation4: "1",
      plaintiffBusinesss: [], //原告
      lawyerBusinesss: [], //代理
    };
  },
  methods: {
    getMaterials() {
      this.isLoading = true;
      material(this.changeMemberTab).then(res => {
        this.isLoading = false;
        if (res.data.state == 100) {
          let data=res.data.data;
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
    },
  },
  computed: {
    changeMemberTab() {
      return this.$store.getters.caseId;
    }
  },
};
</script>