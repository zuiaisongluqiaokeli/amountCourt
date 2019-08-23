<style lang="less">
@import "./reset.less";
</style>
<template>
    <div class="reviewsCase fde" style="height:100%">
        <Row>
            <Col span="24" style="min-height:100%">
              <Row class="operation" style="margin-bottom:15px;">
                <Button size='large' @click="showGO" style="background:#2083D8;float:right;margin-right:15px;"  type="primary" >分案选中的案件</Button>
                <Button size='large' @click="getExcel" style="background:#2083D8;float:right;margin-right:15px;"  type="primary"  :loading="excelLoading">导出选中的案件</Button>
                <Button size='large' @click="setInside" style="background:#2083D8;float:right;margin-right:15px;"  type="primary" :loading="setInsideLoading">为选中的案件导出到内网</Button>
                  <!-- <Button size='large' @click="showRject" style="background:#F54C4C;color:#fff" >退回选中的案件</Button> -->
                  <Button size='large' @click="addBatchList"  style="background:#2083D8;color:#fff;float:left;margin-right:15px;" >添加案件到批量工作列表</Button>
                  <Dropdown  class="dropMenu"  @on-click="handleDropdown">
                    <Button size='large' type="primary">
                      更多操作
                      <Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu size='large' slot="list">
                      <DropdownItem size='large' style="color:red" name="clear">清空工作列表</DropdownItem>
                      <DropdownItem size='large'  name="refresh">刷新</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                  
                  <circleLoading v-if="operationLoading"/>
              </Row>
              <Row>
                  <Alert show-icon>
                      已选择 <span class="select-count">{{selectCount}}</span> 项
                      <a class="select-clear" @click="clearSelectAll">清空</a>
                  </Alert>
              </Row>
              <Row class="tables">
                  <Table size="small" stripe style="min-height:350px" :loading="loading" border :columns="columns" :data="data" ref="table" sortable="custom" @on-row-click="rowClick" @on-selection-change="changeSelect"></Table>
              </Row>
              <Row type="flex" justify="end" class="page" style="margin-top:10px;height:30px;">
                  <Page :current="pageNumber" :total="total" :page-size="pageSize" @on-change="changePage" @on-page-size-change="changePageSize" placement='top' :page-size-opts="[10,20,50,100]" size="small" show-total show-elevator show-sizer></Page>
              </Row>
            </Col>
        </Row>
        <Modal
            v-model="modal1"
            title="添加案件到批量处理列表"
            :mask-closable="false"
            :styles="{top: '20px'}"
            :width="modalWidth">
            <div class="components-container">
              <batch @cancelEvent="closeModel" @saveEvent='changeList' ref="batch" />
            </div>
            <div slot="footer">
            </div>
        </Modal>
        <Modal
            v-model="modal2"
            title="批量分案"
            :mask-closable="false"
            :styles="{top: '20px'}"
            :width="modalWidth">
            <div class="components-container">
              <batchHandle @cancelEvent="closeModel2" :listData='selectList' ref="handle" />
            </div>
            <div slot="footer">
            </div>
        </Modal>
        <Modal
            v-model="modal4"
            title="案件信息"
            :mask-closable="false"
            :styles="{top: '20px'}"
            :width="modalWidth">
            <div class="components-container">
              <caseInfo  ref="info"/>
            </div>
            <div slot="footer">
              <Button @click="closeLiti"  type="dashed" size="large">关闭</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import {
  findLawCaseList,
} from "@/api/case";
import {
  exportLawCaseInfo,
  exportLawCase
} from "@/api/batch";
import {
  tools_downLoad,
} from "@/libs/tools.js";
import util from "@/libs/util.js";
import batch from "@/components/batch/batchList.vue";
import batchHandle from "@/components/batch/division/bitchdivision.vue";
// import batch from "@/components/batch/division/divisionList.vue";
import caseInfo from "@/components/batch/reviewCase/caseInfo2.vue";
import circleLoading from "@/components/circleLoad/circle-loading.vue";
export default {
  components: {
    circleLoading,
    batch,
    batchHandle,
    caseInfo
  },
  data() {
    var width = window.innerWidth - 100;
    return {
      loading: true,
      modal1:false,
      modalWidth:width,
      modal2:false,
      modal4:false,
      briefList:[],
      selectList:[],  //选择的数据
      selectCount:0,   //选择数量
      operationLoading: false,
      sortType: "desc",
      excelLoading:false,
      setInsideLoading:false,
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "批次-流水号",
          key: "flowNumber",
          align: "center",
          width: 180,
        },
        {
          title: "案号",
          key: "caseNo",
          align: "center",
          width: 180,
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
          title: "审核操作",
          key: "action",
          align: "center",
          width: 300,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    size: "small",
                    type: "primary",
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.stopPropagation();
                      this.$store.commit("SET_CASEID", params.row.lawCaseId);
                      this.modal4 = true;
                      this.$refs.info.init();
                    }
                  }
                },
                "查看详情"
              ),
              h(
                "Button",
                {
                  props: {
                    size: "small",
                    type: "success",
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                        this.stopPropagation();
                        this.$refs.table.selectAll(false);//取消选择，清空数据
                        this.selectList.push(params.row);
                        this.$refs.handle.getList();
                        this.modal2 = true;
                    }
                  }
                },
                "分案"
              ),
            ]);
          }
        }
      ],
      data: [],
      pageNumber: 1,
      pageSize: 10,
      total: 0,
    };
  },
  methods: {
    getRoleList() {
      this.getList();
    },
    changePage(v) {
      this.pageNumber = v;
      this.getList();
      this.clearSelectAll();
    },
    changePageSize(v) {
      this.pageSize = v;
      this.getList();
    },
    getList() {
      this.selectList = [];
      this.selectCount = 0;
      this.loading = true;
      let params = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        submitType:"已提交",//提交类型 已提交/暂存 法院端的统一都是已提交
        type:"分案",  //案件类型，枚举类型 待审核/审核通过待分案
      };
      findLawCaseList(params).then(res => {
        this.loading = false;
        if (res.data.state == 100) {
          let data=res.data.data;
          this.data = data.lawCaseList;
          this.total = data.total;
        }else{
            this.$Message.info(res.data.message);
        }
      });
    },
    //行点击事件
    rowClick(data,index){
      this.$refs.table.toggleSelect(index);// 选中/取消该行（若已选中则是取消，若已取消则是选中）
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
    setInside(){//导出案件到内网
      if (this.selectCount <= 0) {
          this.$Notice.warning({
              title: '',
              desc: '您还未选择需要操作案件',
              duration: 5
          });
        return;
      }
      let ids=[];
      this.selectList.forEach((item,index) => {
        ids.push(item.lawCaseId);
      });
      this.setInsideLoading=true;
      exportLawCase(ids).then(res => {
        this.setInsideLoading=false;
        if (res.data.state == 100) {
          let data=res.data.data;
          tools_downLoad(data);
        }else{
          this.$Message.info(res.data.message);
        }
      });
    },
    changeSelect(e){
      this.selectList = e;
      this.selectCount = e.length;
    },
    /**
     * 打开审核模态框
     */
    showGO(){
      if (this.selectCount <= 0) {
          this.$Notice.warning({
              title: '',
              desc: '您还未选择需要操作案件',
              duration: 5
          });
        return;
      }
      this.$refs.handle.getList();
      this.modal2 = true;
    },
    closeModel(){
      this.modal1 = false;
    },
    /**
     * 关闭批量审批
     */
    closeModel2(dex){
      if(dex == 1){ //表示立案成功 刷新
        this.modal2 = false;
        this.getList();
      }else{
        this.modal2 = false;
      }
      
    },
    /**
     * 批量操作的案件
     */
    changeList(data){
      this.data = data;
      this.modal1 = false;
      let ys = true;
      let that = this;
      setTimeout(function(){
        that.$refs.table.selectAll(ys);
      }, 500)
    },
    getExcel(){//导出案件
      if (this.selectCount <= 0) {
          this.$Notice.warning({
              title: '',
              desc: '您还未选择需要操作案件',
              duration: 5
          });
        return;
      }
      let ids=[];
      this.selectList.forEach((item,index) => {
        ids.push(item.lawCaseId);
      });
      this.excelLoading=true;
      exportLawCaseInfo(ids).then(res => {
        this.excelLoading=false;
        if (res.data.state == 100) {
          let data=res.data.data;
          tools_downLoad(data);
        }else{
          this.$Message.info(res.data.message);
        }
      });
    },
    clearSelectAll(){
      this.$refs.table.selectAll(false);
    },
    addBatchList(){
      console.log(this.$store.getters.roLeName)
      this.$refs.batch.init(9);
      this.modal1 = true;
    },
    closeLiti(){
      this.modal4 = false;
    },
    handleDropdown(name){
    if(name == 'clear'){
        this.selectList = [];
        this.selectCount = '';
        this.data = [];
      }else if(name == 'refresh'){
        this.getList()
      }
    },
    
  },
  mounted() {
    // this.getRoleList();
  }
};
</script>