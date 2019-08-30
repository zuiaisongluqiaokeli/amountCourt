<style lang="less">
@import "./reset.less";
</style>
<template>
  <div class="reviewsCase fde" style="height:100%">
    <Row>
      <Col span="24" style="min-height:100%">
        <Row>
          <Col span="24" style="min-height:100%">
            <Row class="operation" style="margin-bottom:15px;">
              <Button
                size="large"
                @click="showGO"
                style="background:#2083D8;;color:#fff;float:right"
                type="primary"
              >为选中的案件批量提交材料</Button>
              <Button
                size="large"
                @click="addBatchList"
                style="background:#2083D8;color:#fff;float:left;"
                type="primary"
              >添加案件到批量工作列表</Button>
              <Dropdown
                class="dropMenu"
                @on-click="handleDropdown"
                style="float:left;margin-left:15px"
              >
                <Button size="large" type="primary">
                  更多操作
                  <Icon type="ios-arrow-down"></Icon>
                </Button>
                <DropdownMenu size="large" slot="list">
                  <DropdownItem size="large" style="color:red" name="clear">清空工作列表</DropdownItem>
                  <DropdownItem size="large" name="refresh">刷新</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Row>
            <Row>
              <Alert show-icon>
                已选择
                <span class="select-count">{{selectCount}}</span> 项
                <a class="select-clear" @click="clearSelectAll">清空</a>
              </Alert>
              <!-- 这个不用 -->
              <Alert type="warning" v-show="isError" show-icon closable>
                <span>成功案件个数：{{successNumber}}</span>
                <br />
                <span>失败案件个数：{{failedNumber}}</span>
                <br />
                <span>失败原因：{{reason}}</span>
              </Alert>
            </Row>
            <Row class="tables">
              <Table
                size="small"
                stripe
                style="min-height:350px"
                :loading="loading"
                border
                :columns="columns"
                :data="listData"
                ref="table"
                sortable="custom"
                @on-row-click="rowClick"
                @on-selection-change="changeSelect"
              ></Table>
            </Row>
            <Row type="flex" justify="end" class="page" style="margin-top:10px;height:30px;">
              <Page
                :current="searchForm.pageNumber"
                :total="total"
                :page-size="searchForm.pageSize"
                @on-change="changePage"
                @on-page-size-change="changePageSize"
                placement="top"
                :page-size-opts="[10,20,50,100]"
                size="small"
                show-total
                show-elevator
                show-sizer
              ></Page>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>

      <Modal
        v-model="modal1"
        title="添加案件到批量处理列表"
        :mask-closable="false"
        :styles="{top: '20px'}"
        :width="modalWidth"
      >
        <div class="components-container">
          <batchCaseList @cancelEvent="closeModel" @saveEvent="changeList" ref="batchCaseList" />
        </div>
        <div slot="footer"></div>
      </Modal>
      <Modal
        v-model="modal2"
        title="批量材料提交"
        :mask-closable="false"
        :styles="{top: '20px'}"
        :width="modalWidth"
      >
        <div class="components-container">
          <batchSubmission @cancelEvent="closeModel2" :listDatas="selectList" ref="handle" />
        </div>
        <div slot="footer"></div>
      </Modal>
      <Modal
        v-model="modal3"
        title="证明文件查看"
        :mask-closable="false"
        :styles="{top: '10px'}"
        :width="modalWidth"
      >
        <div class="components-container">
          <!-- 证明文件显示组件 -->
          <materials ref="materials" />
        </div>
        <div slot="footer">
          <Button @click="closeLiti('modal3')" type="dashed" size="large">关闭</Button>
        </div>
      </Modal>
      <Modal
        v-model="modal4"
        title="证据文件查看"
        :mask-closable="false"
        :styles="{top: '10px'}"
        :width="modalWidth"
      >
        <div class="components-container">
          <!-- 证据文件显示组件 -->
          <evidences ref="evidences" />
        </div>
        <div slot="footer">
          <Button @click="closeLiti('modal4')" type="dashed" size="large">关闭</Button>
        </div>
      </Modal>
  </div>
</template>

<script>
import {
  downloadZip,
  batchCloseLawCase,
  exportCloseLawCase
} from "@/api/batch";
import { findLawCaseList } from "@/api/case";
import batchSubmission from "@/components/batch/batchSubmission.vue";
import { tools_downLoad } from "@/libs/tools.js";
import { formatDate } from "@/libs/date";
import { getBrief } from "@/api/global";
import batchCaseList from "@/components/batch/batchCaseList/batchCaseList.vue";
// 证明与委托材料
import materials from "../../caseInfo/components/materials.vue";
// 证据材料
import evidences from "../../caseInfo/components/evidences.vue";
export default {
  name: "role-manage",
  components: {
    batchCaseList,
    batchSubmission,
    materials,
    evidences
  },
  data() {
    var width = window.innerWidth - 100;
    return {
      searchForm: {
        netApplicationNo: "",
        briefName: "",
        startDate: "",
        endDate: "",
        plaintiffName: "",
        plaintiffLawyerName: "",
        flowNumber: "",
        caseNo: "",
        submitType: "已提交", //提交类型 已提交/暂存 法院端的统一都是已提交
        type: "所有案件", //案件类型，枚举类型 待审核/审核通过待分案
        pageNumber: 1,
        pageSize: 10
      },
      loading: false,
      treeLoading: false,
      modal1: false,
      TermLoading: false,
      modalWidth: width,
      closeType: "",
      closeDate: "",
      modal2: false,
      modal3: false,
      modal4: false,
      //错误信息提示
      isError: false,
      successNumber: "",
      failedNumber: "",
      reason: "",
      proLoading: false,
      selectList: [], //选择的数据
      selectCount: 0, //选择数量
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        // {
        //   title: "网申号",
        //   key: "netApplicationNo",
        //   width: 130,
        // },
        {
          title: "流水号",
          key: "flowNumber",
          align: "center",
          width: 200
        },
        {
          title: "案号",
          key: "caseNo",
          width: 200,
          align: "center",
          render: (h, params) => {
            return (
              "div", [h("span", params.row.caseNo ? params.row.caseNo : "暂无")]
            );
          }
        },
        {
          title: "案由",
          key: "briefName",
          align: "center",
          // width: 150,
          render: (h, params) => {
            return (
              "div",
              [h("span", params.row.briefName ? params.row.briefName : "暂无")]
            );
          }
        },
        {
          title: "原告",
          key: "plaintiffName",
          align: "center"
        },
        {
          title: "被告",
          key: "defendantName",
          align: "center"
        },
        {
          title: "立案日期",
          key: "clerk",
          width: 120,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {},
              formatDate(new Date(params.row.filingDate), "yyyy-MM-dd")
            );
          }
        },
        {
          title: "承办法官",
          key: "judgeName",
          align: "center",
          // width:120,
          render: (h, params) => {
            return (
              "div",
              [h("span", params.row.judgeName ? params.row.judgeName : "暂无")]
            );
          }
        },
        {
          title: "法官助理",
          key: "assistName",
          align: "center",
          // width: 120,
          render: (h, params) => {
            return h(
              "span",
              {},
              params.row.assistName ? params.row.assistName : "暂无"
            );
          }
        },
        {
          title: "书记员",
          key: "clerkName",
          align: "center",
          // width: 120,
          render: (h, params) => {
            return h(
              "span",
              {},
              params.row.clerkName ? params.row.clerkName : "暂无"
            );
          }
        },
        {
          title: "证明材料",
          key: "proUp",
          // width:80,
          align: "center",
          render: (h, params) => {
            return (
              "div",
              [
                h(
                  "span",
                  {
                    props: {},
                    style: {
                      color: "#2d8cf0",
                      cursor: "pointer"
                    },
                    on: {
                      click: () => {
                        this.showProFile(params.row.lawCaseId); //显示证明文件
                      }
                    }
                  },
                  params.row.proUp ? "查看" : ""
                ),
                h("span", {}, params.row.proUp ? "" : "未上传")
              ]
            );
          }
        },
        {
          title: "证据材料",
          key: "eviUp",
          // width:100,
          align: "center",
          render: (h, params) => {
            return (
              "div",
              [
                h(
                  "span",
                  {
                    props: {},
                    style: {
                      color: "#2d8cf0",
                      cursor: "pointer"
                    },
                    on: {
                      click: () => {
                        this.showEviFile(params.row.lawCaseId); //显示证据文件
                      }
                    }
                  },
                  params.row.eviUp ? "查看" : ""
                ),
                h("span", {}, params.row.eviUp ? "" : "未上传")
              ]
            );
          }
        },
        {
          title: "诉前材料",
          key: "appealUp",
          // width:100,
          align: "center",
          render: (h, params) => {
            return (
              "div",
              [
                h("span", {}, params.row.appealUp ? "" : "未上传")
              ]
            );
          }
        }
      ],
      listData: [],

      total: 0
    };
  },
  methods: {
    clearSelectAll() {
      this.$refs.table.selectAll(false);
    },
    getRoleList() {
      this.selectedData = [];
      this.handleSearch();
    },
     //时间选择器
    selectDateRange(v) {
      if (v) {
        this.searchForm.startDate = v[0];
        this.searchForm.endDate = v[1];
      }
    },
    //已选择的数据
    changeSelect(e) {
      this.selectList = e;
      this.selectCount = e.length;
    },
    //下拉菜单
    handleDropdown(name) {
      if (name == "clear") {
        this.selectList = [];
        this.selectCount = "";
        this.data = [];
      } else if (name == "refresh") {
        this.handleSearch();
      }
    },
    //行点击事件
    rowClick(data, index) {
      this.$refs.table.toggleSelect(index);
    },
    selBrief(name) {
      this.searchForm.briefName = name;
    },
    //页码和页尺寸改变
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.handleSearch();
    },
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.handleSearch();
    },
    //初始化获取表格数据
    handleSearch() {
      this.selectList = [];
      this.selectCount = 0;
      this.loading = true;
      findLawCaseList(this.searchForm).then(res => {
        this.loading = false;
        if (res.data.state == 100) {
          let data = res.data.data;
          this.listData = data.lawCaseList;
          this.total = data.total;
          // setTimeout(() => {
          //   //数据全选
          //   this.$refs.table.selectAll(true);
          // }, 500);
        } else {
          this.$Message.info(res.data.message);
        }
      });
    },
    //证据与证明的弹窗关闭
    closeLiti(modal) {
      this.$store.commit("SET_CASEID", "");
      this[modal] = false;
    },
    //证名文件弹窗打开，其实就是传ID
    showProFile(id) {
      this.modal3 = true;
      this.$store.commit("SET_CASEID", id);
      this.$refs.materials.getMaterials(); //获取证明文件
    },
    //显示证据文件
    showEviFile(id) {
      this.modal4 = true;
      this.$store.commit("SET_CASEID", id);
      this.$refs.evidences.getEvidenceList(); //获取证据文件
    },
    //打开窗口1
    addBatchList() {
      this.$refs.batchCaseList.init();
      this.modal1 = true;
    },
    /**
     * 批量操作的案件
     */
    changeList(data) {
      this.listData = data;
      this.modal1 = false;
      let that = this;
      setTimeout(function() {
        that.$refs.table.selectAll(true);
      }, 500);
    },
    closeModel() {
      this.modal1 = false;
    },
    /**
     * 打开审核模态框
     */
    showGO() {
      if (this.selectCount <= 0) {
        this.$Notice.warning({
          title: "",
          desc: "您还未选择需要操作案件！",
          duration: 5
        });
        return;
      }
      for (var x of this.selectList) {
        if(!x.briefName){//是否有案由
          this.$Notice.warning({
            title: "请选择有案由的案件！",
            desc: "",
            duration: 5
          });
          return
        }else{
          let firstBriefName = this.selectList[0].briefName;
          //是否符合案由
          if (x.briefName.indexOf(firstBriefName) < 0) {
            this.$Notice.warning({
              title: "请选择同类型的案由！",
              desc: "",
              duration: 5
            });
            return;
          }
        }
      }
      this.modal2 = true;
      this.$refs.handle.init();
      //获取已选择的参数数据
      this.$refs.handle.getList();
    }, 
    closeModel2(data) {
      //有参数表示提交成功，清空全选
      if (data) {
        this.selectList = [];
        this.selectCount = 0;
        this.modal2 = false;
        this.data = data;
        let ys = false;
        let that = this;
        setTimeout(function() {
          that.$refs.table.selectAll(ys);
        }, 500);
        this.getRoleList();
      } else {
        this.modal2 = false;
      }
    },
    showRject() {
      if (this.selectCount <= 0) {
        this.$Notice.warning({
          title: "",
          desc: "您还未选择需要操作案件",
          duration: 5
        });
        return;
      }
      this.proLoading = true;
      let ary = [];
      for (let i = 0; i < this.selectList.length; i++) {
        ary.push(this.selectList[i].lawCaseId);
      }
      exportCloseLawCase(ary).then(res => {
        this.proLoading = false;
        if (res.data.state == 100) {
          this.$Notice.success({
            title: "",
            desc: res.data.message,
            duration: 3
          });
          tools_downLoad(res.data.data.path);
        } else {
          this.$Notice.warning({
            title: "",
            desc: res.data.message,
            duration: 5
          });
        }
      });
    },
   
    
     changeTerm() {
      //   if (this.closeDate == "") {
      //     this.$Notice.warning({
      //       title: "",
      //       desc: "请选择时间",
      //       duration: 2
      //     });
      //     return false;
      //   }
      //   if (this.closeType == "") {
      //     this.$Notice.warning({
      //       title: "",
      //       desc: "请选择结案类型",
      //       duration: 2
      //     });
      //     return false;
      //   }
      this.TermLoading = true;
      let ary = [];
      for (let i = 0; i < this.selectList.length; i++) {
        let data = {
          lawCaseId: this.selectList[i].lawCaseId,
          closeType: this.closeType,
          closeDate: new Date(this.closeDate).getTime()
        };
        ary.push(data);
      }
      batchCloseLawCase(ary).then(res => {
        this.TermLoading = false;
        if (res.data.state == 100) {
          this.$Notice.success({
            title: "",
            desc: res.data.message,
            duration: 3
          });
          this.modal2 = false;
          this.handleSearch();
        } else {
          this.$Notice.warning({
            title: "",
            desc: res.data.message,
            duration: 5
          });
        }
      });
    },
  },

};
</script>