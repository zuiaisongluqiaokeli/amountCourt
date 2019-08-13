<style lang="less">
@import "./reset.less";
</style>
<template>
    <div class="reviewsCase fde" style="height:100%">
        <Row>
            <Col span="24" style="min-height:100%">
              <Row class="operation" style="margin-bottom:15px;">
                  <Button size='large' @click="downRject" :loading="proLoading" style="background:#2083D8;color:#fff;float:right;margin-right:15px;" >生成并下载</Button>                      
                  <Button size='large' @click="showGO" style="background:#2083D8;float:right;margin-right:15px;"  type="primary" >为选中的案件选择文书</Button>
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
                  <Alert type="warning" v-show="isError" show-icon closable>
                      <span>成功案件个数：{{successNumber}}</span><br/>
                      <span>失败案件个数：{{failedNumber}}</span><br/>
                      <span>失败原因：{{reason}}</span>
                  </Alert>
              </Row>
              <Row class="tables">
                  <Table size="small" height="460" stripe style="min-height:350px" :loading="loading" border :columns="columns" :data="data" ref="table" sortable="custom"  @on-selection-change="changeSelect"></Table>
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
              <batch @cancelEvent="closeModel" @saveEvent='changeList'  ref="batch" />
            </div>
            <div slot="footer">
            </div>
        </Modal>
        <Modal
            v-model="modal2"
            title="选择文书"
            :mask-closable="false"
            :styles="{top: '20px'}"
            :width="modalWidth">
            <div class="components-container">
              <dipmosBatch @cancelEvent="closeModel2" :listData2='selectList' ref="handle" />
            </div>
            <div slot="footer">
            </div>
        </Modal>
    </div>
</template>

<script>
import {
  findLitigantLawCaseQuery,
  batchBuildDiploms
} from "@/api/batch";
import { formatDate } from '@/libs/date';
import { tools_downLoad } from "@/libs/tools.js";
import batch from "@/components/batch/dipmos/dipmosBatchList.vue";
import dipmosBatch from "@/components/batch/dipmos/dipmosBatch.vue";
export default {
  name: "role-manage",
  components: {
    batch,
    dipmosBatch
  },
  data() {
    var width = window.innerWidth - 100;
    return {
      loading: false,
      modal1:false,
      modalWidth:width,
      modal2:false,
      isError:false,
      successNumber:"",
      failedNumber:"",
      reason:"",
      proLoading:false,
      selectList:[],  //选择的数据
      selectCount:0,   //选择数量
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        // {
        //   title: "网申号",
        //   key: "netApplicationNo",
        //   width: 140,
        // },
        {
          title: "案号",
          key: "caseNo",
          align: "center",
          width: 180
        },
        {
          title: "案由",
          key: "briefName",
          align: "center",
        },
        {
          title: "当事人",
          key: "litigantName",
          align: "center",
        },
        {
          title: "诉讼地位",
          key: "litigantStatusName",
          align: "center",
          // width:100,
        },
        {
          title: "承办法官",
          key: "judgeName",
          align: "center",
          // width:110,
          render: (h, params) => {
            return h(
                'span',
                {},
                params.row.judgeName ? params.row.judgeName : "暂无"
            );
          }
        },
        {
          title: "书记员",
          key: "clerkName",
          align: "center",
          // width:110,
          render: (h, params) => {
            return h(
                'span',
                {},
                params.row.clerkName ? params.row.clerkName : "暂无"
            );
          }
        },
        {
          title: "开庭时间",
          key: "startDate",
          align: "center",
          width:150,
          render: (h, params) => {
                return h(
                    'span',
                    {},
                    params.row.startDate ? formatDate(new Date(params.row.startDate), 'yyyy-MM-dd hh:mm') :"暂无"
                );
          }
        },

        {
          title: "将生成的文书列表",
          align: "center",
          width:150,
          render: (h, params) => {
                return h(
                    'div',
                    {},
                    params.row.checkboxValue ? params.row.checkboxValue.map(item => {
                      return h('p', {
                      }, item);
                    }) : "暂无"
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
    init() {
      // this.getRoleList();
    },
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
      };
      findLitigantLawCaseQuery(params).then(res => {
        this.loading = false;
        if (res.data.state == 100) {
          let data=res.data.data;
          this.data = data.list;
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
    closeModel(){
      this.modal1 = false;
    },
    closeModel2(data){
      if(data){ //表示选择成功 刷新
        this.selectList = [];
        this.selectCount = 0;
        this.modal2 = false;
        this.data = data;
        let ys = true;
        let that = this;
        setTimeout(function(){
					that.$refs.table.selectAll(ys);
				}, 500)
        // this.getRoleList();
      }else{
        this.modal2 = false;
      }
    },
    downRject(){
      if (this.selectCount <= 0) {
          this.$Notice.warning({
              title: '',
              desc: '您还未选择需要操作案件',
              duration: 5
          });
        return;
      }
      this.proLoading = true;
      this.isError = false;
      let data = [];
      for(let i=0;i<this.selectList.length;i++){
        const da = {
          litigantId:this.selectList[i].litigantId.toString(),
          buildDiplomsName:this.selectList[i].checkboxValue ? this.selectList[i].checkboxValue.join(",") : ""
        }
        data.push(da)
      }
      batchBuildDiploms(data).then(res => {
          this.proLoading = false;
          if(res.data.state == 100){
            // window.open(res.data.data.path);//查看
            tools_downLoad(res.data.data.path);//下载
          }else if(res.data.state == 104){
              this.isError = true;
              this.successNumber = res.data.data.success;
              this.failedNumber = res.data.data.error;
              this.reason = res.data.message;
              let ary = [];
                for(let i=0;i<this.data.length;i++){
                    for(let j=0;j<res.data.data.errorIdList.length;j++){
                        if(res.data.data.errorIdList[j] == this.data[i].litigantId){
                            ary.push(this.data[i])
                        }
                    }
                }
                this.data = ary;
                this.selectList = [];
                this.selectCount = 0;
              // window.open(res.data.data.path);//查看
              tools_downLoad(res.data.data.path);//下载
          }else{
            this.$Notice.warning({
                title: '',
                desc: res.data.message,
                duration: 5
            });
          }
      })
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

  mounted() {
    // this.init();
  },
  filters: {
      formatDate(time) {
          if (time == '') {
              return '';
          }
          var date = new Date(time);
          return formatDate(date, 'yyyy-MM-dd');
      },
      whether(boole) {
          return boole ? '是' : '否';
      },
      filCheck(boole) {
          return boole == 0 ? '未确认' : '已确认';
      },
      formatStartDate(time) {
          if (time == '') {
              return '';
          }
          var date = new Date(time);
          return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
};
</script>