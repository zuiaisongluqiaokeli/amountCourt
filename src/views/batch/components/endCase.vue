<style lang="less">
@import "./reset.less";
</style>
<template>
    <div class="reviewsCase fde" style="height:100%">
        <Row>
            <Col span="24" style="min-height:100%">
                <!-- <Card style="min-height:95%" class="">      -->
                    <Row class="operation" style="margin-bottom:15px;">
                      <Button size='large' @click="showRject" :loading="proLoading" style="background:#2083D8;color:#fff;float:right;margin-right:15px;" >导出案件</Button>
                        <Button size='large' @click="showGO" style="background:#2083D8;float:right;margin-right:15px;"  type="primary" >为选中的案件选择结案信息</Button>
                        
                        <Button size='large' @click="addBatchList"  style="background:#2083D8;color:#fff;float:left;margin-right:15px;" >添加案件到批量工作列表</Button>
                        <Dropdown  class="dropMenu"  @on-click="handleDropdown">
                          <Button size='large' type="primary" >
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
                        <Table size="small" stripe style="min-height:350px" :loading="loading" border :columns="columns" :data="data" ref="table" sortable="custom"  @on-selection-change="changeSelect"></Table>
                    </Row>
                    <Row type="flex" justify="end" class="page" style="margin-top:10px;height:30px;">
                        <Page :current="pageNumber" :total="total" :page-size="pageSize" @on-change="changePage" @on-page-size-change="changePageSize" placement='top' :page-size-opts="[10,20,50,100]" size="small" show-total show-elevator show-sizer></Page>
                    </Row>
                <!-- </Card> -->
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
            title="结案"
            :mask-closable="false"
            :width="720">
            <div class="components-container">
              <div class="bookbuilding-table" style="border-right: none; ">
                <Row >
                    <Col span="4" class="noemalTb tb-head">
                        结案方式
                    </Col>
                    <Col span="8" class="noemalTb">
                        <Select v-model="closeType" clearable filterable placeholder="请选择"  clearable >
                            <Option value="判决">判决</Option>
                            <Option value="撤诉">撤诉</Option>
                            <Option value="调解">调解</Option>
                        </Select>
                    </Col>
                    <Col span="4" class="noemalTb tb-head">
                        结案日期
                    </Col>
                    <Col span="8" class="noemalTb" style="border-right: 1px solid #e9eaec;">
                        <DatePicker v-model="closeDate" format="yyyy-MM-dd HH:mm" type="datetime" placeholder="选择结案日期" style="width: 100%"></DatePicker>
                    </Col>
                </Row>
            </div>
            </div>
            <div slot="footer">
                <Button @click="changeTerm"  :loading="TermLoading" type="primary" size="large">确认</Button>
                <Button @click="modal2 = false"  type="dashed" size="large">关闭</Button>
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
import {
  findLawCaseList,
} from "@/api/case";
import { tools_downLoad } from '@/libs/tools.js';
import { formatDate } from '@/libs/date';
import batch from "@/components/batch/dipmosAss/dipmosAssBatchList.vue";

export default {
  name: "role-manage",
  components: {
    batch,
  },
  data() {
    var width = window.innerWidth - 100;
    return {
      loading: false,
      treeLoading: false,
      modal1:false,
      TermLoading:false,
      modalWidth:width,
      closeType:"",
      closeDate:"",
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
        //   width: 130,
        // },
        {
          title: "案号",
          key: "caseNo",
          width: 180,
        },
        {
          title: "案由",
          key: "briefName",
          align: "center",
          // width: 150,
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
          // width:120,
        },
        {
          title: "书记员",
          key: "clerkName",
          align: "center",
          // width:120,
        },
        {
          title: "立案日期",
          key: "clerk",
          width:100,
          align: "center",
          render: (h, params) => {
                return h(
                    'span',
                    {},
                    formatDate(new Date(params.row.filingDate), 'yyyy-MM-dd')
                );
          }
        },
        {
          title: "审限届满日期",
          key: "clerk",
          width:100,
          align: "center",
          render: (h, params) => {
                return h(
                    'span',
                    {},
                    formatDate(new Date(params.row.endTrialDate), 'yyyy-MM-dd')
                );
          }
        },
        {
          title: "适用程序",
          key: "procedureType",
          // width:110,
          align: "center",
        },
        {
          title: "结案方式",
          key: "clerk",
          // width:80,
          align: "center",
          render: (h, params) => {
                return h(
                    'span',
                    {},
                    params.row.closeType ? params.row.closeType : "暂无"
                );
          },
          
        },
        {
          title: "结案时间",
          key: "clerk",
          // width:100,
          align: "center",
          render: (h, params) => {
                return h(
                    'span',
                    {},
                    params.row.closeDate ? formatDate(new Date(params.row.closeDate), 'yyyy-MM-dd') : "暂无"
                );
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
      // this.getRoleList();
    },
    changeTerm(){
      if(this.closeDate == ''){
          this.$Notice.warning({
              title: '',
              desc: '请选择时间',
              duration: 5
          });
          return false;
      }
      if(this.closeType == ''){
          this.$Notice.warning({
              title: '',
              desc: '请选择结案类型',
              duration: 5
          });
          return false;
      }
        this.TermLoading = true;
         let ary = [];
        for(let i=0;i<this.selectList.length;i++){
          let data = {
            lawCaseId:this.selectList[i].lawCaseId,
            closeType:this.closeType,
            closeDate:new Date(this.closeDate).getTime()
          }
            ary.push(data)
        }
        batchCloseLawCase(ary).then(res => {
            this.TermLoading = false;
            if(res.data.state == 100){
                this.$Notice.success({
                    title: '',
                    desc: res.data.message,
                    duration: 3
                });
                this.modal2 = false;
                 this.getRoleList();
            }else{
                this.$Notice.warning({
                    title: '',
                    desc: res.data.message,
                    duration: 5
                });
            }
        })
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
        submitType:"已提交",//提交类型 已提交/暂存 法院端的统一都是已提交
        type:"已分案",  //案件类型，枚举类型 已分案
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
    showRject(){
      if (this.selectCount <= 0) {
          this.$Notice.warning({
              title: '',
              desc: '您还未选择需要操作案件',
              duration: 5
          });
        return;
      }
      this.proLoading = true;
      let ary = [];
      for(let i=0;i<this.selectList.length;i++){
        ary.push(this.selectList[i].lawCaseId)
      }
      exportCloseLawCase(ary).then(res => {
        this.proLoading = false;
        if(res.data.state == 100){
          this.$Notice.success({
              title: '',
              desc: res.data.message,
              duration: 3
          });
          tools_downLoad(res.data.data.path)
        }else{
          this.$Notice.warning({
              title: '',
              desc:res.data.message,
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
    },
};
</script>