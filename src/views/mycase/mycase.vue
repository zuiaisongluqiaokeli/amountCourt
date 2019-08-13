<style lang="less" >
@import "./mycase.less";
.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;

  .ivu-modal {
    top: 0;
  }
  .ivu-modal-wrap {
    z-index: 100;
  }
  .ivu-collapse-content {
    overflow-y: scroll;
  }
}
</style>
<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <Row>
            <Form ref="searchForm" :model="searchForm" inline :label-width="80" class="search-form">
              <Form-item label="网申号" prop="username">
                <Input
                  type="text"
                  v-model="searchForm.netApplicationNo"
                  clearable
                  placeholder="网申号"
                  style="width: 185px"
                />
              </Form-item>
              <Form-item label="案号" prop="username">
                <Input
                  type="text"
                  v-model="searchForm.caseNo"
                  clearable
                  placeholder="案号"
                  style="width: 185px"
                />
              </Form-item>
              <Form-item label="案由" prop="department">
                <Select
                  v-model="searchForm.briefName"
                  clearable
                  filterable
                  placeholder="请选择"
                  style="width: 185px"
                >
                  <Option v-for="(item) in briefList" :value="item.name">{{item.name}}</Option>
                </Select>
              </Form-item>
              <Form-item label="当事人姓名" prop="department">
                <Input
                  type="text"
                  v-model="searchForm.litigantName"
                  clearable
                  placeholder="当事人姓名"
                  style="width: 185px"
                />
              </Form-item>

              <span v-if="drop">
                <Form-item label="时间范围">
                  <DatePicker
                    v-model="selectDate"
                    type="daterange"
                    format="yyyy-MM-dd"
                    clearable
                    @on-change="selectDateRange"
                    placeholder="选择起始时间"
                    style="width: 200px"
                  ></DatePicker>
                </Form-item>
                <Form-item label="案件状态" prop="sex">
                  <Select
                    v-model="searchForm.progress"
                    clearable
                    filterable
                    placeholder="请选择"
                    style="width: 185px"
                  >
                    <Option value="立案申请">立案申请</Option>
                    <Option value="立案">立案</Option>
                    <Option value="排班">排班</Option>
                    <Option value="送达">送达</Option>
                    <Option value="举证">举证</Option>
                    <Option value="质证">质证</Option>
                    <Option value="开庭">开庭</Option>
                    <Option value="已开庭">已开庭</Option>
                    <Option value="已结案">已结案</Option>
                  </Select>
                </Form-item>
              </span>
              <Form-item style="margin-left:-35px;" class="br">
                <Button
                  @click="handleSearch"
                  style="background:#2083D8"
                  type="primary"
                  icon="ios-search"
                >搜索</Button>
                <Button @click="handleReset">重置</Button>
                <a class="drop-down" @click="dropDown">
                  {{dropDownContent}}
                  <Icon :type="dropDownIcon"></Icon>
                </a>
              </Form-item>
            </Form>
          </Row>
          <Row class="tables">
            <Table
              size="small"
              highlight-row
              stripe
              style="min-height:350px"
              :loading="loading"
              border
              :columns="columns"
              :data="data"
              sortable="custom"
              @on-sort-change="changeSort"
              @on-row-click="selCase"
              v-show="!isClick"
              @on-selection-change="showSelect"
              ref="table"
            ></Table>
            <Table
              size="small"
              highlight-row
              stripe
              :loading="loading"
              border
              :columns="columns"
              :data="onedata"
              sortable="custom"
              @on-sort-change="changeSort"
              @on-row-click="selCase"
              @on-selection-change="showSelect"
              v-show="isClick"
              ref="table"
            ></Table>
          </Row>
          <Row type="flex" justify="end" class="page" style="margin-top:10px;height:30px;">
            <Page
              :current="searchForm.pageNumber"
              v-show="!isClick"
              :total="total"
              placement="top"
              :page-size="searchForm.pageSize"
              @on-change="changePage"
              @on-page-size-change="changePageSize"
              :page-size-opts="[10,20,50,100]"
              size="small"
              show-total
              show-elevator
              show-sizer
            ></Page>
            <a
              href="javascript:;"
              style="margin-left: 20px;line-height:24px"
              @click="showAll"
              v-show="isClick"
            >显示全部</a>
          </Row>
        </Card>
      </Col>
    </Row>
    <Row v-show="selectCase">
      <Card class="case-main">
        <Tabs type="line" size="small" v-model="chanelName" @on-click="changeTab">
          <TabPane name="案件信息" label="案件信息">
            <!-- <caseInfo /> -->
          </TabPane>
          <TabPane name="庭审排期信息" label="庭审排期信息" v-if="lawOrLiti"></TabPane>
          <TabPane name="受送达文书" label="受送达文书">
            <!-- <dipsmos /> -->
          </TabPane>
          <TabPane name="在线质证举证" label="在线质证举证">
            <!-- <witness /> -->
          </TabPane>
          <TabPane name="在线调解" label="在线调解"></TabPane>
          <TabPane name="在线庭审" label="在线庭审"></TabPane>
          <!-- <TabPane name="判决确认" label="判决确认" v-if="lawOrLiti">
          </TabPane>-->
        </Tabs>
        <div class="upc" @click="handleClearCurrentRow">
          收起工作区
          <Icon type="ios-arrow-up"></Icon>
        </div>
        <div>
          <div class="single-page" style="height:100%">
            <!-- <keep-alive> -->
            <router-view></router-view>
            <!-- </keep-alive> -->
          </div>
        </div>
      </Card>
    </Row>
    <Modal
      v-model="modal4"
      title="案件信息"
      :mask-closable="false"
      :styles="{top: '10px'}"
      :width="modalWidth"
    >
      <div class="components-container">
        <caseInfo ref="info" />
      </div>
      <div slot="footer">
        <Button @click="closeLiti" type="dashed" size="large">关闭</Button>
      </div>
    </Modal>
    <Modal
      title="确认送达地址"
      v-model="modaladdrVal"
      :mask-closable="false"
      :closable="false"
      class-name="vertical-center-modal"
    >
      <div>
        <Input v-model.trim="addrVal" placeholder="请输入确认送达地址" style="width: 100%"></Input>
      </div>
      <div style="margin-top: 10px;" slot="footer">
        <Button type="primary" @click="handleAddr">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import circleLoading from "@/components/circleLoad/circle-loading.vue";
import caseInfo from "@/components/batch/reviewCase/caseInfo2.vue";
import { findLawCaseList, checkSendAddress, addSendAddress } from "@/api/case";
import { getBrief } from "@/api/global";
import { formatDate } from "@/libs/date";
export default {
  name: "user-manage",
  components: {
    circleLoading,
    caseInfo
  },
  data() {
    var width = window.innerWidth - 100;
    return {
      lawOrLiti: true,
      loading: true,
      modalWidth: width,
      onedata: [],
      briefList: [],
      isClick: false,
      selectCase: false,
      modal4: false,
      drop: false,
      dropDownContent: "展开",
      dropDownIcon: "ios-arrow-down",
      selectCount: 0,
      selectList: [],
      department: [],
      selectDep: [],
      chanelName: "",
      dataDep: [],
      searchForm: {
        netApplicationNo: "", //网申号
        startDate: "", //开始时间
        endDate: "", //结束时间
        caseNo: "", //案号
        litigantName: "", //当事人姓名
        submitType: "已提交", //提交类型
        type: "所有案件", //案件类型
        pageSize: 10,
        pageNumber: 1,
        briefName: ""
      },
      selectDate: null,
      columns: [
        {
          title: "网申号",
          key: "netApplicationNo",
          width: 180,
          align: "center"
        },
        {
          title: "案号",
          key: "caseNo",
          width: 180,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {},
              params.row.caseNo ? params.row.caseNo : "暂未分配"
            );
          }
        },
        {
          title: "案由",
          key: "briefName",
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {},
              params.row.briefName ? params.row.briefName : "暂无"
            );
          }
        },
        {
          title: "原告",
          key: "plaintiffName",
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {},
              params.row.plaintiffName ? params.row.plaintiffName : "暂无"
            );
          }
        },
        {
          title: "被告",
          key: "defendantName",
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {},
              params.row.defendantName ? params.row.defendantName : "暂无"
            );
          }
        },
        {
          title: "立案日期",
          key: "filingDate",
          align: "center",
          width: 120,
          render: (h, params) => {
            return h(
              "span",
              {},
              params.row.filingDate
                ? formatDate(new Date(params.row.filingDate), "yyyy-MM-dd")
                : "无"
            );
          }
        },
        {
          title: "状态",
          key: "progress",
          align: "center",
          width: 140
        },
        {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            if (params.row.progress == "立案申请") {
              return h("div", [
                h(
                  "Button",
                  {
                    props: {
                      size: "small",
                      type: "primary"
                    },
                    on: {
                      click: () => {
                        this.$refs.info.init();
                        this.modal4 = true;
                      }
                    }
                  },
                  "补充与修改"
                )
              ]);
            } else {
              return h("span", "暂无操作");
            }
          }
        }
      ],
      data: [],
      exportData: [],
      total: 0,
      addrVal: "",
      modaladdrVal: false
    };
  },
  methods: {
    //初始化数据
    init() {
      //代理人没有庭审排期信息面板
      if (this.$store.getters.roLeName == "代理人") {
        this.lawOrLiti = false;
      }
      console.log(this.lawOrLiti);
      this.isClick = false;
      this.getUserList();
    },
    showAll() {
      this.isClick = false;
    },
    //为什么关闭框的时候需要更新ID 
    closeLiti() {
      this.$store.commit("SET_CASEID", "");
      this.modal4 = false;
      this.getUserList()
    },
    loadData(item, callback) {
      item.loading = true;
    },
    handleChangeDep(value, selectedData) {
      // 获取最后一个值
      if (value && value.length > 0) {
        this.searchForm.departmentId = value[value.length - 1];
      } else {
        this.searchForm.departmentId = "";
      }
    },
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getUserList();
      this.clearSelectAll();
    },
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getUserList();
    },
    //得到时间数组
    selectDateRange(v) {
      if (v) {
        this.searchForm.startDate = v[0];
        this.searchForm.endDate = v[1];
      }
    },
    //获取表格数据
    getUserList() {
      // 多条件搜索用户列表
      this.loading = true;
      findLawCaseList(this.searchForm).then(res => {
        this.loading = false;
        console.log(res.data);
        if (res.data.state == 100) {
          this.data = res.data.data.lawCaseList;
          this.total = res.data.data.total;
        } else {
          this.$Message.info(res.data.message);
        }
      });
      //案由列表获取
      getBrief().then(res => {
        if (res.data.state == 100) {
          this.briefList = res.data.data;
        }
      });
    },
    //搜索的时候需要只显示表格1
    handleSearch() {
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.showAll();
      this.getUserList();
    },
    //表单重置
    handleReset() {
      this.$refs.searchForm.resetFields();
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.selectDate = null;
      this.searchForm.startDate = "";
      this.searchForm.netApplicationNo = "";
      this.searchForm.caseNo = "";
      this.searchForm.litigantName = "";
      this.searchForm.progress = "";
      this.searchForm.endDate = "";
      this.selectDep = [];
      this.searchForm.departmentId = "";
      // 重新加载数据
      this.getUserList();
    },
    //改变排序
    changeSort(e) {
      this.searchForm.sort = e.key;
      this.searchForm.order = e.order;
      if (e.order === "normal") {
        this.searchForm.order = "";
      }
      this.getUserList();
    },
    //展开与收起按钮
    dropDown() {
      if (this.drop) {
        this.dropDownContent = "展开";
        this.dropDownIcon = "ios-arrow-down";
      } else {
        this.dropDownContent = "收起";
        this.dropDownIcon = "ios-arrow-up";
      }
      this.drop = !this.drop;
    },
    //选中一个案件
    selCase(dex) {
      // this.$store.commit("SET_CASEID", dex.idCard);
      //记录选中案件的ID，其余tabs请求数据用此ID
      this.$store.commit("SET_CASEID", dex.lawCaseId);
      this.$store.commit("SET_BREIFNAME", dex.briefName); //获取案由并保存（子选项卡需要用到，勿删）
      console.log("item88889999", dex);
      //只有立案申请会打开弹窗，其余都是下部展示
      if (dex.progress == "立案申请") {
        this.$refs.info.init();
        this.modal4 = true;
        this.selectCase = false;
        return false;
      }
      this.selectCase = true;
      this.isClick = true; //选中就显示当前一行表格内容
      //每次只展示当前选中的一个案件，先清空数组
      this.onedata = [];
      this.onedata.push(dex);
      this.$router.push({
        name: "caseInfo_index"
      });
    },
    showSelect(e) {
      this.selectList = e;
      this.selectCount = e.length;
    },
    clearSelectAll() {
      this.$refs.table.selectAll(false);
    },
    //切换tab
    changeTab(name) {
      console.log(name);
      if (name == "受送达文书") {
        this.$router.push({
          name: "diplomas_index"
        });
      } else if (name == "案件信息") {
        this.$router.push({
          name: "caseInfo_index"
        });
      } else if (name == "在线质证举证") {
        this.$router.push({
          name: "witness_index"
        });
      } else if (name == "在线庭审") {
        this.$router.push({
          name: "rtcs_index",
          params: {
            name: "在线庭审"
          }
        });
      } else if (name == "在线调解") {
        this.$router.push({
          name: "rtctjs_index",
          params: {
            name: "在线调解"
          }
        });
      } else if (name == "庭审排期信息") {
        this.$router.push({
          name: "dateInfo_index"
        });
      }
    },
    //收起工作区
    handleClearCurrentRow() {
      this.selectCase = false;
      this.$refs.table.clearCurrentRow();
    },
    //送达地址
    getCheckSendAddress() {
      checkSendAddress().then(res => {
        if (res.data.state == 100) {
          if (res.data.data.isEmptyAddress === true) {
            this.modaladdrVal = true;
            this.addrVal = res.data.data.address;
          }
        } else {
          this.$Notice.warning({
            title: "",
            desc: res.data.message,
            duration: 5
          });
        }
      });
    },
    //提交送达地址
    handleAddr() {
      let that = this;
      if (!this.addrVal) {
        this.$Notice.warning({
          title: "",
          desc: "请填写确认送达信息",
          duration: 5
        });
        return;
      }
      let params = {
        address: this.addrVal
      };
      addSendAddress(params).then(res => {
        if (res.data.state == 100) {
          this.$Notice.success({
            title: "",
            desc: res.data.message,
            duration: 3
          });
          this.modaladdrVal = false;
        } else {
          this.$Notice.warning({
            title: "",
            desc: res.data.message,
            duration: 5
          });
          this.modaladdrVal = false;
        }
      });
    }
  },
  mounted() {
    this.init();
    this.getCheckSendAddress();
  },
  watch: {
    $route(to, from) {
      console.log(to.name);
      if (to.name == "mycase_index") {
        this.selectCase = false;
        this.$refs.table.clearCurrentRow();
      }
      if (to.name == "caseInfo_index") {
        this.chanelName = "案件信息";
      }
    }
  }
};
</script>