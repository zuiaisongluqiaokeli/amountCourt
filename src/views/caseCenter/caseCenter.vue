<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <Row>
            <Form ref="searchForm" :model="searchForm" inline :label-width="80" class="search-form">
              <Form-item label="网申号" prop="netApplicationNo">
                <Input
                  type="text"
                  v-model="searchForm.netApplicationNo"
                  clearable
                  placeholder="网申号"
                  style="width: 180px"
                />
              </Form-item>
              <Form-item label="案号" prop="caseNo">
                <Input
                  type="text"
                  v-model="searchForm.caseNo"
                  clearable
                  placeholder="案号"
                  style="width: 180px"
                />
              </Form-item>
              <Form-item label="案由" prop="briefName">
                <Select
                  v-model="searchForm.briefName"
                  @on-selection-change="changeSelect"
                  clearable
                  filterable
                  placeholder="请选择"
                  style="width: 180px"
                >
                  <Option v-for="(item,index) in briefList" :value="item.name" :key="index">{{item.name}}</Option>
                </Select>
              </Form-item>
              <Form-item label="当事人" prop="litigantName">
                  <Input
                    type="text"
                    v-model="searchForm.litigantName"
                    clearable
                    placeholder="当事人"
                    style="width: 180px"
                  />
              </Form-item>

              <span v-if="drop">
                <Form-item label="代理人" prop="lawyerName">
                  <Input
                    type="text"
                    v-model="searchForm.lawyerName"
                    clearable
                    placeholder="代理人"
                    style="width: 180px"
                  />
                </Form-item>
                <Form-item label="案件状态" prop="sex">
                  <Select
                    v-model="searchForm.progress"
                    clearable
                    filterable
                    placeholder="请选择"
                    style="width: 180px"
                  >
                    <Option v-for="(item,index) in progressList" :value="item" :key="index">{{item}}</Option>
                  </Select>
                </Form-item>
                <Form-item label="时间范围">
                  <DatePicker
                    v-model="selectDate"
                    type="daterange"
                    format="yyyy-MM-dd"
                    clearable
                    @on-change="selectDateRange"
                    placeholder="选择起始时间"
                    style="width: 180px"
                  ></DatePicker>
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
              @on-selection-change="showSelect"
              v-show="!isClick"
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
              ref="tables"
            ></Table>
          </Row>
          <Row type="flex" justify="end" class="page" style="margin-top:10px;height:30px;">
            <Page
              :current="searchForm.pageNumber"
              :total="total"
              v-show="!isClick"
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
        <Tabs type="line" v-model="chanelName" size="small" @on-click="changeTab">
          <TabPane name="综合信息" label="综合信息"></TabPane>
          <!-- <TabPane name="立案审核" label="立案审核"></TabPane> -->
          <!-- <TabPane name="分案" label="分案"></TabPane> -->
          <TabPane name="庭审排期" label="庭审排期"></TabPane>
          <TabPane name="文书" label="文书"></TabPane>
          <TabPane name="送达" label="送达"></TabPane>
          <TabPane name="举质证" label="举质证"></TabPane>
          <TabPane name="在线调解" label="在线调解"></TabPane>
          <!-- <TabPane name="转普" label="转普"></TabPane>
          <TabPane name="修改审限" label="修改审限"></TabPane>
          <TabPane name="庭后送达" label="庭后送达"></TabPane> -->
          <TabPane name="在线庭审" label="在线庭审"></TabPane>
        </Tabs>
        <div class="upc" @click="handleClearCurrentRow">
          收起工作区
          <Icon type="ios-arrow-up"></Icon>
        </div>
        <div>
          <div class="single-page" style="height:100%">
            <router-view></router-view>
          </div>
        </div>
      </Card>
    </Row>
    <BackTop></BackTop>
    <Modal v-model="preRegisterModal" title="预立案号" :mask-closable="false" width="250">
      <Input v-model="preRegisterInput" placeholder="输入预立案号" />
      <div slot="footer">
        <Button type="primary" size="large" long @click="preRegister(preRegisterID)">确认</Button>
      </div>
    </Modal>
    <Modal
      v-model="pushBoxShow"
      title="推送调解员"
      :mask-closable="false"
      width="250"
    >
      <Select clearable multiple :placeholder="this.$store.getters.roLeName=='法官'? '请选择法院调解员' : '请选择机构调解员'"  :class="sendSelectClass" v-model="sendData.tjIds" @click.native="onOpen">
          <Option v-for="item in tjList" :value="item.id" :key="item.index">{{ item.name }}</Option>
      </Select>
      <div slot="footer">
          <Button type="primary" size="large" long  @click="pushSure">确认推送</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import circleLoading from "@/components/circleLoad/circle-loading.vue";
import { findLawCaseList,
         distributioncourtMediate,//法院端推送给法院调解员
         distributionInstitutionMediate,//法院调解员案件推送给机构调解员
         courtmediatorList,//获取法院调解员列表
         institutionalmediatorList, //获取机构调解员列表
         backLawCase, //退回
         preFiling, //预立案号
} from "@/api/case";
import { getBrief,getProgress } from "@/api/global";
import { formatDate } from "@/libs/date";
export default {
  name: "user-manage",
  components: {
    circleLoading
  },
  data() {
    return {
      lawOrLiti: true,
      isClick: false,
      onedata: [],
      loading: true,
      selectCase: false,
      drop: false,
      briefList: [],//案由列表
      progressList:[],//案件状态列表
      dropDownContent: "展开",
      dropDownIcon: "ios-arrow-down",
      selectCount: 0,
      selectList: [],
      department: [],
      selectDep: [],
      dataDep: [],
      pushBoxShow:false,
      preRegisterModal: false, //预立案号弹框
      preRegisterInput: "", //预立案号
      preRegisterID: "", //预立案号案件
      tjList:[],
      sendSelectClass:"",
      sendData:{
         lawCaseId:"",
         tjIds:[],
      },
      chanelName: "综合信息",
      searchForm: {
        netApplicationNo: "", //网申号
        startDate: "", //开始时间
        endDate: "", //结束时间
        caseNo: "", //案号
        litigantName:"",//当事人姓名
        lawyerName:"",//代理人姓名
        submitType: "已提交", //提交类型 已提交/暂存 法院端的统一都是已提交
        type: "所有案件", //案件类型
        pageNumber: 1,
        pageSize: 10
      },
      selectDate: null,
      columns: [
        {
          title: "网申号",
          key: "netApplicationNo",
          align: "center",
          width: 180
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
        },
        {
          title: "原告",
          key: "plaintiffName",
          align: "center",
        },
        {
          title: "被告",
          key: "defendantName",
          align: "center",
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
          title: "创建时间",
          key: "createDate",
          align: "center",
          width: 120,
          render: (h, params) => {
            return h(
              "span",
              {},
              params.row.createDate
                ? formatDate(new Date(params.row.createDate), "yyyy-MM-dd")
                : "无"
            );
          }
        },
        {
          title: "状态",
          key: "progress",
          align: "center",
           width: 120,
        },
        {
          title: "是否同步内网",
          key: "exportInfo",
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {},
              params.row.exportInfo ? params.row.exportInfo : "未同步"
            );
          }
        },
        {
          title: "操作",
          key: "",
          width: 300,
          align: "center",
          render: (h, params) => {
            let beforeSetCaseBtn=h(
              "Button",
              {
                props: {
                  type: "primary",
                  size: "small"
                },
                style: {
                  marginRight: "5px"
                },
                on: {
                  click: () => {
                    //阻止事件冒泡
                    this.stopPropagation();
                    this.preRegisterModal = true;
                    this.preRegisterID = params.row;
                  }
                }
              },
              "预立案号"
            )
            let backBtn=h(
              "Button",
              {
                props: {
                  type: "primary",
                  size: "small"
                },
                style: {
                  marginRight: "5px"
                },
                on: {
                  click: () => {
                    //阻止事件冒泡
                    this.stopPropagation();
                    this.backoff(params.row.lawCaseId);
                  }
                }
              },
              "退回"
            )
            let pushBtn=h('Button', {
              props: {
                type: 'primary',
                size: 'small',
              },
              on: {
                click: () => {
                  //阻止事件冒泡
                  this.stopPropagation()
                  this.pushIt(params.row);
                }
              }
            }, "推送调解员")

            let btnAry=[];

            //法官类型可以预立案、退回、推送
            if(this.allowRole.indexOf(this.$store.getters.roLeName)>-1){
              //判断是否是立案申请，立案申请时才能预立案和退回
              if(params.row.progress=='立案申请'){
                btnAry.push(beforeSetCaseBtn,backBtn)
              }else{//立案申请后才能推送
                btnAry.push(pushBtn)
              }
            //调解员类型可以推送
            }else if((this.allowRole2.indexOf(this.$store.getters.roLeName)>-1)){
              btnAry.push(pushBtn)
            }

            return btnAry.length>0 ?  h('div',btnAry) : h('span','暂无操作');
          }
        },
      ],
      data: [],
      exportData: [],
      allowRole:["庭长","法官助理","法官","书记员"],//允许的角色1
      allowRole2:["法院调解员"],//允许的角色2
      total: 0
    };
  },
  methods: {
    init() {
      this.isClick = false;
      this.getUserList();
    },
    changeSelect(flag){
        alert(flag)
    },
    showAll() {
      this.isClick = false;
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
    selectDateRange(v) {
      if (v) {
        this.searchForm.startDate = v[0];
        this.searchForm.endDate = v[1];
      }
    },
    getUserList() {
      // 多条件搜索用户列表
      this.loading = true;
      findLawCaseList(this.searchForm).then(res => {
        this.loading = false;
        if (res.data.state == 100) {
          this.data = res.data.data.lawCaseList;
          this.total = res.data.data.total;
        } else {
          this.$Message.info(res.data.message);
        }
      });
      //获取案由
      getBrief().then(res => {
        if (res.data.state == 100) {
          this.briefList = res.data.data;
        }
      });
      //获取案件状态
      getProgress().then(res => {
        if (res.data.state == 100) {
          this.progressList = res.data.data.split(',');
          console.log("progressList",this.progressList)
        }
      });
    },
    handleSearch() {
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.showAll();
      this.getUserList();
    },
    handleReset() {
      this.$refs.searchForm.resetFields();
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.selectDate = null;
      this.searchForm.startDate = "";
      this.searchForm.endDate = "";
      this.searchForm.briefName = "";
      this.searchForm.netApplicationNo = "";
      this.searchForm.caseNo = "";
      this.searchForm.litigantName="",//当事人姓名
      this.searchForm.lawyerName="",//代理人姓名
      this.searchForm.progress = "";
      this.selectDep = [];
      this.searchForm.departmentId = "";
      // 重新加载数据
      this.getUserList();
    },
    changeSort(e) {
      this.searchForm.sort = e.key;
      this.searchForm.order = e.order;
      if (e.order === "normal") {
        this.searchForm.order = "";
      }
      this.getUserList();
    },
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
      this.$store.commit("SET_CASEID", dex.lawCaseId);
      this.$store.commit("SET_BREIFNAME", dex.briefName); //获取案由并保存（子选项卡需要用到，勿删）
      console.log("dex.id", dex.id);
      // if (dex.progress == "立案申请") {
      //   this.$refs.info.init();
      //   this.modal4 = true;
      //   this.selectCase = false;
      //   return false;
      // }
      this.selectCase = true;
      this.isClick = true;
      this.onedata = [];
      this.onedata.push(dex);
      this.$router.push({
        name: "Info_index"
      });
    },
    //预立案号
    preRegister(row) {
      if (this.preRegisterInput == "") {
        this.$Message.error("请输入预立案号");
        return;
      }
      preFiling([
        { lawCaseId: row.lawCaseId, yLCaseNo: this.preRegisterInput }
      ]).then(res => {
        if (res.data.state == 100) {
          this.preRegisterInput == "";
          this.preRegisterModal = false;
          this.$Message.success("成功");
          this.getUserList()
        } else {
          this.$Message.error(res.data.message);
        }
      });
    },
    //调解退回
    backoff(caseID){
      let ary=[]
      let obj={lawCaseId:caseID}
      ary.push(obj)
      backLawCase(ary).then(res => {
        if (res.data.state == 100) {
          this.$Message.success(res.data.message);
          this.getUserList()
        } else {
          this.$Message.error(res.data.message);
        }
      });
    },
    pushIt(row){//推送调解员
      console.log("row",row)
      console.log(this.$store.getters.roLeName)
      this.sendData.lawCaseId=row.lawCaseId;//获取案件id
      this.pushBoxShow=true;
      switch (this.$store.getters.roLeName) {
        case "法官":
          //获取法院调解员列表
          courtmediatorList().then(res=>{
            if(res.data.state==100){
              console.log(res)
              let data=res.data.data;
              this.tjList=data.courtmediator
            }else{
              this.$Message.error(res.data.message);
            }
          });
        break;
        case "法院调解员":
          //获取机构调解员列表
          institutionalmediatorList().then(res=>{
            if(res.data.state==100){
              console.log(res)
              let data=res.data.data;
              this.tjList=data.institutionalmediator
            }else{
              this.$Message.error(res.data.message);
            }
          });
        break;
      }
    },
    pushSure(){//确认推送
      let data={}
      let ary=[];
      data.lawCaseId=this.sendData.lawCaseId;
      if(this.sendData.tjIds.length==0){//是否有选择调解员
        this.$Message.error("请先选择调解员！");
        return
      }
      switch (this.$store.getters.roLeName) {
        case "法官":
          this.sendData.tjIds.forEach((item,index) => {
            data.courtmediatorId=item;
            ary.push(data);
          });
          //法院端推送给法院调解员
          distributioncourtMediate(ary).then(res=>{
            if(res.data.state==100){
              console.log(res)
              this.pushBoxShow=false;
              this.sendData.tjIds=[];
              let data=res.data.data;
              this.$Message.success({
                  content: '成功个数：'+ data.success + ',' + '失败个数：'+ data.error,
                  duration: 5
              });
            }else{
              this.$Message.error(res.data.message);
            }
          });
        break;
        case "法院调解员":
          this.sendData.tjIds.forEach((item,index) => {
            data.institutionmediateId=item;
            ary.push(data);
          });
          //法院调解员案件推送给机构调解员
          distributionInstitutionMediate(ary).then(res=>{
            if(res.data.state==100){
              console.log(res)
              this.pushBoxShow=false;
              this.sendData.tjIds=[];
              let data=res.data.data;
              this.$Message.success({
                  content: '成功个数：'+ data.success + ',' + '失败个数：'+ data.error,
                  duration: 5
              });
            }else{
              this.$Message.error(res.data.message);
            }
          });
        break;
      }
    },
    onOpen(){
      console.log("1111")
      this.$nextTick(()=>{
        this.sendSelectClass="senModal"
      })
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
      if (name == "文书") {
        this.$router.push({
          name: "courtDiplomas_index"
        });
      } else if (name == "综合信息") {
        this.$router.push({
          name: "Info_index"
        });
      } else if (name == "庭审排期") {
        this.$router.push({
          name: "courtDate_index"
        });
      } else if (name == "送达") {
        this.$router.push({
          name: "courtSend_index"
        });
      } else if (name == "举质证") {
        this.$router.push({
          name: "courtWitness_index"
        });
      } else if (name == "在线庭审") {
        this.$router.push({
          name: "rtc_index",
          params: {
            name: "在线庭审"
          }
        });
      } else if (name == "在线调解") {
        this.$router.push({
          name: "rtctj_index",
          params: {
            name: "在线调解"
          }
        });
      }
    },
    //收起工作区
    handleClearCurrentRow() {
      this.selectCase = false;
      this.isClick = false;
      this.$refs.table.clearCurrentRow();
    },
    //阻止事件冒泡
    stopPropagation(e) { 
        e = e || window.event; 
        if(e.stopPropagation) { //W3C阻止冒泡方法 
            e.stopPropagation(); 
        } else { 
            e.cancelBubble = true; //IE阻止冒泡方法 
        } 
    },
  },
  mounted() {
    this.init();
  },
  watch: {
    $route(to, from) {
      console.log(to.name);
      if (to.name == "caseCenter_index") {
        this.isClick = false;
        this.selectCase = false;
        this.$refs.table.clearCurrentRow();
      }
      if (to.name == "Info_index") {
        console.log(999);
        this.chanelName = "综合信息";
      }
    }
  }
};
</script>
<style lang="less" src="./caseCenter.less">
</style>