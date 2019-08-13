<style lang="less">
@import "./reset.less";
</style>
<template>
    <div class="reviewsCase fde" style="height:100%">
        <Row>
            <Col span="24" style="min-height:100%">
              <Row class="operation" style="margin-bottom:15px;">
                  <Button size='large' @click="showGO" style="background:#2083D8;float:right;margin-right:15px;"  type="primary" >为选中的案件选择排庭信息</Button>
                  <Button size='large' @click="getExcel" style="background:#2083D8;float:right;margin-right:15px;"  type="primary" :loading="excelLoading">为选中的案件导出排班列表</Button>
                  <!-- <Button size='large' @click="setInside" style="background:#2083D8;float:right;margin-right:15px;"  type="primary" :loading="setInsideLoading">为选中的案件导出到内网</Button> -->
                  <Button size='large' @click="addBatchList"  style="background:#2083D8;color:#fff;float:left;margin-right:15px;" >添加案件到批量工作列表</Button>
                  <Dropdown  class="dropMenu"  @on-click="handleDropdown">
                    <Button size='large' type="primary"  >
                      更多操作
                      <Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu size='large' slot="list">
                      <DropdownItem size='large' style="color:red" name="clear">清空工作列表</DropdownItem>
                      <DropdownItem size='large' name="refresh">刷新</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                  
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
            title="添加排庭信息"
            :mask-closable="false"
            :styles="{top: '20px'}"
            :width="modalWidth">
            <div class="components-container">
              <courtDateBatch @cancelEvent="closeModel2" :listData2='selectList' ref="handle" />
            </div>
            <div slot="footer">
            </div>
        </Modal>
    </div>
</template>

<script>
import {
  findLawCaseList,
} from "@/api/case";
import {
  exportScheduldingLawCase,
  exportLawCase
} from "@/api/batch";
import {
  tools_downLoad,
} from "@/libs/tools.js";
import batch from "@/components/batch/courtDate/courtdateBatchList.vue";
// import batch from "@/components/batch/batchList.vue";
import { formatDate } from '@/libs/date';
import courtDateBatch from "@/components/batch/courtDate/courtDateBatch.vue";
export default {
  name: "role-manage",
  components: {
    batch,
    courtDateBatch
  },
  data() {
    var width = window.innerWidth - 100;
    return {
      loading: false,
      treeLoading: false,
      modal1:false,
      modalWidth:width,
      modal2:false,
      selectList:[],  //选择的数据
      selectCount:0,   //选择数量
      excelLoading:false,
      setInsideLoading:false,
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        // {
        //   title: "网申号",
        //   key: "netApplicationNo",
        //   width: 145,
        // },
        {
          title: "案号",
          key: "caseNo",
          align: "center",
          width: 180,
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
          title: "承办法官",
          key: "judgeName",
          align: "center",
          // width: 120,
        },
        {
          title: "书记员",
          key: "clerkName",
          align: "center",
          // width: 120,
        },
        {
          title: "开庭时间",
          key: "startDate",
          align: "center",
          width: 150,
          render: (h, params) => {
            return h(
                'span',
                {},
              params.row.startDate ?  formatDate(new Date(params.row.startDate), 'yyyy-MM-dd hh:mm') : "暂无"
            );
          }
        },
        {
          title: "地点",
          key: "tribunalName",
          align: "center",
          // width: 200,
          render: (h, params) => {
            return h(
                'span',
                {},
              params.row.tribunalName ? params.row.tribunalName  : "暂无"
            );
          }
        },
      ],
      data: [],
      pageNumber: 1,
      pageSize: 10,
      total: 0,
    };
  },
  methods: {
    changePage(v) {
      this.pageNumber = v;
      this.getRoleList();
    },
    changePageSize(v) {
      this.pageSize = v;
      this.getRoleList();
    },
    getRoleList() {
      this.selectList = [];
      this.selectCount = 0;
      this.loading = true;
      let params = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        submitType:"已提交",//提交类型 已提交/暂存 法院端的统一都是已提交
        type:"排庭",  //案件类型，枚举类型 已分案
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
      for(let i=0;i<this.selectList.length;i++){
          this.selectList[i].selTime = "";
          this.selectList[i].selTime1 = "";
          this.selectList[i].isopen = false;
          this.selectList[i].timeList = [];
          this.selectList[i].datePickerOpen = false;
          this.selectList[i].selectTime = false;
      }
      console.log(this.selectList)
      this.$refs.handle.getList();
      this.modal2 = true;
    },
    getExcel(){//导出排班列表
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
      exportScheduldingLawCase(ids).then(res => {
        this.excelLoading=false;
        if (res.data.state == 100) {
          let data=res.data.data;
          tools_downLoad(data);
        }else{
          this.$Message.info(res.data.message);
        }
      });
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
    closeModel(){
      this.modal1 = false;
    },
    closeModel2(dex){
      if(dex == 1){ //表示立案成功 刷新
        this.modal2 = false;
        this.getRoleList();
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
    clearSelectAll(){
      this.$refs.table.selectAll(false);
    },
    addBatchList(){
      this.$refs.batch.init();
      this.modal1 = true;
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
};
</script>