<template>
  <div class="dbSet-reviewsCase fde" style="height:100%">
    <Row>
      <span span="24" style="min-height:100%">
        <Card style="min-height:95%" class>
          <Row class="operation" style="margin-bottom:15px;">
            <Form ref="searchForm" inline :label-width="100">
              <Form-item label="网申号/案号">
                <Input
                  type="text"
                  clearable
                  placeholder="网申号"
                  style="width:150px"
                  @on-change="lawCaseNoChange"
                  v-model="selects.lawCaseNo"
                />
              </Form-item>
              <Form-item label="姓名/名称">
                <Input
                  type="text"
                  clearable
                  placeholder="姓名/名称"
                  style="width:150px"
                  @on-change="litigantNameChange"
                  v-model="selects.litigantName"
                />
              </Form-item>
              <Form-item label="证件号">
                <Input
                  type="text"
                  clearable
                  placeholder="证件号"
                  style="width:150px"
                  @on-change="identityCardChange"
                  v-model="selects.identityCard"
                />
              </Form-item>
              <Dropdown class="dropMenu" @on-click="handleDropdown">
                <Button size="large" type="primary">
                  更多操作
                  <Icon type="ios-arrow-down"></Icon>
                </Button>
                <DropdownMenu size="large" slot="list">
                  <DropdownItem size="large" name="refresh">刷新</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Form>
          </Row>
          <Row>
            <Alert show-icon>
              已选择
              <span class="select-count">{{selectCount}}</span> 项
              <a class="select-clear" @click="clearSelectAll">清空</a>
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
              :data="tableData"
              ref="table"
              sortable="custom"
              @on-selection-change="changeSelect"
            ></Table>
          </Row>
          <Row type="flex" justify="end" class="page" style="margin-top:10px;height:30px;">
            <Page
              :current="pageData.pageNum"
              :total="pageData.total"
              :page-size="pageData.pageSize"
              @on-change="pageChange"
              @on-page-size-change="pageSizeChange"
              placement="top"
              :page-size-opts="[10,20,50,100]"
              size="small"
              show-total
              show-elevator
              show-sizer
            ></Page>
          </Row>
        </Card>
      </span>
    </Row>
    <!-- 查看详情模态框 -->
    <Modal
      v-model="showBox"
      title="当事人详细信息"
      @on-ok="asyncOK"
      :mask-closable="false"
      width="800"
      class="myInputDisableType"
    >
      <div v-if="nowItem.organizationType=='自然人'">
        <Row>
          <Col span="24">
            <Input :value="nowItem.name" disabled>
              <span slot="prepend">当事人姓名：</span>
            </Input>
          </Col>
        </Row>
        <Row>
          <Col span="9">
            <Input :value="nowItem.idcard ? nowItem.idcard : '暂无'" disabled>
              <span slot="prepend">公民身份证：</span>
            </Input>
          </Col>
          <Col span="5">
            <Input :value="nowItem.birthday ? nowItem.birthday : '暂无'" disabled>
              <span slot="prepend">出生日期：</span>
            </Input>
          </Col>
          <Col span="5">
            <Input :value="nowItem.sex ? nowItem.sex : '暂无'" disabled>
              <span slot="prepend">性别：</span>
            </Input>
          </Col>
          <Col span="5">
            <Input :value="nowItem.nation ? nowItem.nation : '暂无'" disabled>
              <span slot="prepend">民族：</span>
            </Input>
          </Col>
        </Row>
        <!-- 地址类 -->
        <Row>
          <Col span="24" v-for="(item,index) in nowItem.personAddresss" :key="index">
            <Input :value="item.address ? item.address : '暂无'" disabled>
              <span slot="prepend">{{item.addressType+item.num}}：</span>
            </Input>
          </Col>
        </Row>
        <!-- 电话类 -->
        <Row>
          <Col span="12" v-for="(item,index) in nowItem.personPhone" :key="index">
            <Input :value="item.phone ? item.phone : '暂无'" disabled>
              <span slot="prepend">{{item.phoneType+item.num}}：</span>
            </Input>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <Input :value="nowItem.email ? nowItem.email : '暂无'" disabled>
              <span slot="prepend">电子邮箱：</span>
            </Input>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <Input :value="nowItem.commission ? nowItem.commission : '暂无'" disabled>
              <span slot="prepend">个人身份证明文件：</span>
              <Button
                v-if="nowItem.commission"
                slot="append"
                @click="watchFile(nowItem.commission)"
              >查看</Button>
            </Input>
          </Col>
        </Row>
      </div>
      <div
        v-if="nowItem.organizationType=='法人' || nowItem.organizationType=='非法人组织' || nowItem.organizationType=='非法人'"
      >
        <Row>
          <Col span="24">
            <Input :value="nowItem.name" disabled>
              <span slot="prepend">当事人姓名：</span>
            </Input>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <Input :value="nowItem.idcard ? nowItem.idcard : '暂无'" disabled>
              <span slot="prepend">社会统一信用代码：</span>
            </Input>
          </Col>
        </Row>
        <!-- 地址类 -->
        <Row>
          <Col span="24" v-for="(item,index) in nowItem.personAddresss" :key="index">
            <Input :value="item.address ? item.address : '暂无'" disabled>
              <span slot="prepend">{{item.addressType+item.num}}：</span>
            </Input>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <Input :value="nowItem.idcardPath ? nowItem.idcardPath : '暂无'" disabled>
              <span slot="prepend">单位证明文件：</span>
              <Button
                v-if="nowItem.idcardPath"
                slot="append"
                @click="watchFile(nowItem.idcardPath)"
              >查看</Button>
            </Input>
          </Col>
        </Row>
        <!-- 电话类 -->
        <Row>
          <Col span="12" v-for="(item,index) in nowItem.personPhone" :key="index">
            <Input :value="item.phone ? item.phone : '暂无'" disabled>
              <span slot="prepend">{{item.phoneType+item.num}}：</span>
            </Input>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <Input :value="nowItem.email ? nowItem.email : '暂无'" disabled>
              <span slot="prepend">电子邮箱：</span>
            </Input>
          </Col>
        </Row>
        <Row>
          <Col span="6">
            <Input :value="nowItem.legalName ? nowItem.legalName : '暂无'" disabled>
              <span slot="prepend">{{nowItem.organizationType=='法人' ? "法人姓名" : "负责人姓名"}}：</span>
            </Input>
          </Col>
          <Col span="9">
            <Input :value="nowItem.legalPhone ? nowItem.legalPhone : '暂无'" disabled>
              <span slot="prepend">{{nowItem.organizationType=='法人' ? "法人手机号" : "负责人手机号"}}：</span>
            </Input>
          </Col>
          <Col span="9">
            <Input :value="nowItem.legalIdCard ? nowItem.legalIdCard : '暂无'" disabled>
              <span slot="prepend">{{nowItem.organizationType=='法人' ? "法人公民身份证号" : "负责人身份证号"}}：</span>
            </Input>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <Input :value="nowItem.provePath ? nowItem.provePath : '暂无'" disabled>
              <span slot="prepend">{{nowItem.organizationType=='法人' ? "法人身份证明文件" : "负责人身份证明文件"}}：</span>
              <Button
                v-if="nowItem.provePath"
                slot="append"
                @click="watchFile(nowItem.provePath)"
              >查看</Button>
            </Input>
          </Col>
        </Row>
      </div>
      <div v-if="!nowItem.organizationType">
        <P>该当事人无当事人类型：自然人/法人/非法人组织</P>
      </div>
    </Modal>
    <Modal
      v-model="fileModal"
      title="文件查看"
      :mask-closable="false"
      :styles="{top: '10px'}"
      :width="modalWidth"
    >
      <div class="components-container">
        <!-- 文件显示组件 -->
        <zh-viewer :viewerId="'viewer'" :fileUrls="fileUrls"></zh-viewer>
      </div>
      <div slot="footer">
        <Button @click="closeLiti('fileModal')" type="dashed" size="large">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getPartyInfo } from "@/api/dbSet.js";
import ZhViewer from "@/components/moreFileViewer/moreFileViewer.vue";
export default {
  name: "partyDb",
  components: { ZhViewer },
  data() {
    var width = window.innerWidth - 100;
    return {
      fileModal: false,
      modalWidth: width,
      fileUrls: [],
      loading: false,
      selectList: [], //选择的数据
      selectCount: 0, //选择数量
      pageData: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "序号",
          key: "id",
          width: 80,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              params.index +
                (this.pageData.pageNum - 1) * this.pageData.pageSize +
                1
            );
          }
        },
        {
          title: "姓名/名称",
          key: "name",
          align: "center"
        },
        {
          title: "身份证件类型",
          key: "identityType",
          align: "center"
        },
        {
          title: "身份证件号",
          key: "idcard",
          width: 180,
          align: "center"
        },
        {
          title: "户籍地址/注册地址",
          key: "address",
          align: "center",
          render: (h, params) => {
            console.log(params.row, params.index);
            return h(
              "span",
              params.row.personAddresss.length != 0
                ? params.row.personAddresss[0].address
                : ""
            );
          }
        },
        {
          title: "数据来源",
          key: "source",
          width: 120,
          align: "center"
        },
        {
          title: "操作",
          key: "",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {
                props: {},
                style: {
                  color: "#2d8cf0",
                  cursor: "pointer"
                },
                on: {
                  click: () => {
                    let data = params.row;
                    let nowAddress1 = 0;
                    let nowAddress2 = 0;
                    let nowAddress3 = 0;
                    let nowAddress4 = 0;
                    let nowAddress5 = 0;
                    let nowAddress6 = 0;
                    let nowPhone1 = 0;
                    let nowPhone2 = 0;
                    // 统计同种类型地址个数
                    data.personAddresss.map((item, index) => {
                      switch (item.addressType) {
                        case "户籍地址":
                          nowAddress1 += 1;
                          item.num = nowAddress1;
                          break;
                        case "经常居住地址":
                          nowAddress2 += 1;
                          item.num = nowAddress2;
                          break;
                        case "送达地址":
                          nowAddress3 += 1;
                          item.num = nowAddress3;
                          break;
                        case "注册地址":
                          nowAddress4 += 1;
                          item.num = nowAddress4;
                          break;
                        case "经营地址":
                          nowAddress5 += 1;
                          item.num = nowAddress5;
                          break;
                        case "工作地址":
                          nowAddress6 += 1;
                          item.num = nowAddress6;
                          break;
                      }
                      return item;
                    });
                    // 统计同种类型联系方式个数
                    data.personPhone.map((item, index) => {
                      switch (item.phoneType) {
                        case "固话":
                          nowPhone1 += 1;
                          item.num = nowPhone1;
                          break;
                        case "手机":
                          nowPhone2 += 1;
                          item.num = nowPhone2;
                          break;
                      }
                      return item;
                    });
                    this.showDetail(data);
                  }
                }
              },
              "查看详情"
            );
          }
        }
      ],
      tableData: [],
      nowItem: {},
      showBox: false,
      boxInfo: {
        show: false,
        title: "",
        loading: false,
        footerBtn1: ""
      },
      courtInfo: {
        litigantName: "", //姓名
        identityType: "", //身份证件类型
        identityCard: "", //身份证件号
        address: "", //户籍地址
        remark: "", //数据来源
        lawCaseNo: "" //涉案案号
      },
      selects: {
        litigantName: "", //姓名
        lawCaseNo: "", //涉案案号
        identityCard: "" //身份证件号
      },
      nowId: "", //当前选择项id
      ruleList: {}
    };
  },
  methods: {
    pageChange(pageNum) {
      //页码改变
      this.pageData.pageNum = pageNum;
      this.getNowPageContent();
    },
    pageSizeChange(pageSize) {
      //页码大小改变
      this.pageData.pageSize = pageSize;
      this.getNowPageContent();
    },
    changeSelect(e) {
      this.selectList = e;
      this.selectCount = e.length;
    },
    handleDropdown(name){
      switch (name) {
        case "refresh":
          Object.assign(this.$data, this.$options.data.call(this));
          this.getNowPageContent();
        break;
        case "clear":
          this.selectList = [];
          this.selectCount = '';
          this.tableData = [];
        break;
      }
    },
    getNowPageContent() {
      //获取当前页内容
      this.loading = true;
      console.log(this.pageData);
      //获取律师信息
      getPartyInfo(
        this.pageData.pageSize,
        this.pageData.pageNum,
        this.selects.lawCaseNo,
        this.selects.litigantName,
        this.selects.identityCard
      ).then(res => {
        console.log(res);
        if (res.data.state == 100) {
          this.loading = false;
          let data = res.data.data;
          this.tableData = data.personList;
          this.setPageData(data.pageNum, data.pageSize, data.total);
        } else {
          this.$Message.error(res.data.message);
        }
      });
    },
    watchFile(url) {
      //查看文件
      this.fileUrls.push(url);
      this.fileModal = true;
    },
    setPageData(pageNum, pageSize, total) {
      //设置分页参数
      this.pageData = {
        pageNum,
        pageSize,
        total
      };
    },
    showDetail(item) {
      this.nowItem = item;
      this.showBox = true;
    },
    closeLiti(modal) {
      this[modal] = false;
    },
    asyncOK() {},
    lawCaseNoChange() {
      this.courtInfo.lawCaseNo = this.selects.lawCaseNo;
      this.getNowPageContent();
    },
    litigantNameChange() {
      this.courtInfo.litigantName = this.selects.litigantName;
      this.getNowPageContent();
    },
    identityCardChange() {
      this.courtInfo.identityCard = this.selects.identityCard;
      this.getNowPageContent();
    },
    clearSelectAll() {
      this.$refs.table.selectAll(false);
    }
  }
};
</script>

<style lang='less' scoped>
@deep: ~">>>";
.myInputDisableType {
  @{deep} .ivu-input[disabled],
  fieldset[disabled] .ivu-input {
    background-color: #ffff;
    color: black;
  }
}
</style>