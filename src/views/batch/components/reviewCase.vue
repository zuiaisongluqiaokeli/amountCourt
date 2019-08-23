<style lang="less">
@import "./reset.less";
</style>
<template>
    <div class="reviewsCase fde" style="height:100%">
        <Row>
            <Col span="24" style="min-height:100%">
                    <Row class="operation" style="margin-bottom:15px;">
                        <Button size='large' @click="showRject" style="background:#F54C4C;color:#fff;float:right;margin-right:15px;" >退回选中的案件</Button>
                        <Button size='large' @click="showGO" style="background:rgb(32, 131, 216);float:right;margin-right:15px;"  type="primary" >为选中的案件分配案号</Button>
                        <Button size='large' @click="addBatchList" style="background:#2083D8;color:#fff;margin-right:15px;float:left;" >添加案件到批量工作列表</Button>
                        <Dropdown  class="dropMenu"  @on-click="handleDropdown">
                          <Button size='large' type="primary" >
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
            title="分配案号"
            :mask-closable="false"
            :styles="{top: '20px'}"
            :width="modalWidth">
            <div class="components-container">
              <batchHandle @cancelEvent="closeModel2" :listDatas='selectList' ref="handle" />
            </div>
            <div slot="footer">
            </div>
        </Modal>
        <Modal
            v-model="modal3"
            title="退回申请"
            :mask-closable="false"
            :styles="{top: '20px'}"
            :width="modalWidth">
            <div class="components-container">
              <batchreject @cancelEvent="closeModel3" :listData='selectList' ref="handleReject" />
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
import util from "@/libs/util.js";
import batch from "@/components/batch/reviewCase/components/batchList.vue";
import batchHandle from "@/components/batch/batchHandle.vue";
import caseInfo from "@/components/batch/reviewCase/caseInfo2.vue";
import batchreject from "@/components/batch/reject.vue";
import circleLoading from "@/components/circleLoad/circle-loading.vue";
export default {
  components: {
    circleLoading,
    batch,
    batchHandle,
    batchreject,
    caseInfo
  },
  
  data() {
    var width = window.innerWidth - 100;
    return {
      loading: true,
      treeLoading: false,
      modal1:false,
      modalWidth:width,
      modal2:false,
      modal3:false,
      modal4:false,
      selectList:[],  //选择的数据
      selectCount:0,   //选择数量
      nowList:[],//当前选中的案件
      operationLoading: false,
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
          title: "案由",
          key: "briefName",
          align: "center",
          width: 180,
          render: (h, params) => {
            return h("span",params.row.briefName ? params.row.briefName : "其他案件")
          }
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
        // {
        //   title: "审核状态",
        //   key: "authState",
        //   align: "center",
        // },
        {
          title: "操作",
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
                      this.$store.commit("SET_BREIFNAME",params.row.briefName);
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
                        this.selectList = []
                        this.selectList.push(params.row);
                        let that = this;
                        window.setTimeout(function(){
                          that.$refs.handle.getList();
                          that.modal2 = true;
                        },300)
                    }
                  }
                },
                "分配案号"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.$refs.table.selectAll(false);//取消选择，清空数据
                      this.selectList.push(params.row);  //选择的数据
                      let that = this;
                      window.setTimeout(function(){
                        that.$refs.handleReject.getList();
                        that.modal3 = true;
                      },300)
                      
                    }
                  }
                },
                "退回申请"
              )
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
    init() {
      this.getRoleList();
    },
    changePage(v) {
      this.pageNumber = v;
      this.getRoleList();
      this.clearSelectAll();
    },
    changePageSize(v) {
      this.pageSize = v;
      this.getRoleList();
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
    getRoleList() {
      this.selectList = [];
      this.selectCount = 0;
      this.loading = true;
      let params = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        submitType:"已提交",//提交类型 已提交/暂存 法院端的统一都是已提交
        type:"立案",  //案件类型，枚举类型 待审核/审核通过待分案
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
    /**
     * 打开退回模态框
     */
    showRject(){
      if (this.selectCount <= 0) {
          this.$Notice.warning({
              title: '',
              desc: '您还未选择需要操作案件',
              duration: 5
          });
        return;
      }
      this.$refs.handleReject.getList();
      this.modal3 = true;

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
        this.getRoleList();
      }else{
        this.modal2 = false;
      }
    },
    /**
     * 关闭退回申请
     */
    closeModel3(dex){
      if(dex == 1){ //表示立案成功 刷新
        this.modal3 = false;
        this.getRoleList();
      }else{
        this.modal3 = false;
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
    clearSelectAll(){
      this.$refs.table.selectAll(false);
    },
    addBatchList(){
      console.log(this.$store.getters.roLeName)
      this.$refs.batch.init();
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
        this.getRoleList()
      }
    },
    
  },
  mounted() {
    // this.init();
  }
};
</script>