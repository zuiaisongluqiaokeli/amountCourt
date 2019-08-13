<style lang="less">
@import "./reset.less";
</style>
<template>
    <div class="reviewsCase fde" style="height:100%">
        <Row>
            <Col span="24" style="min-height:100%">
                    <Row class="operation" style="margin-bottom:15px;">
                        <Button size='large' @click="showGO" style="background:#2083D8;float:right;margin-right:15px;"  type="primary" >为选中的案件开启/关闭举证质证</Button>
                        <!-- <Button size='large' @click="openJzz(true)" style="background:#2083D8;float:right;margin-right:15px;"  type="primary" >为选中的案件开启举证质证</Button>
                        <Button size='large' @click="openJzz(false)" style="background:#2083D8;float:right;margin-right:15px;"  type="primary" >为选中的案件关闭举证质证</Button> -->
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
            title="批量开启/关闭举质证"
            :mask-closable="false"
            :styles="{top: '20px'}"
            :width="modalWidth"
            :closable="false"
            @on-cancel="closeModel2"
            >
            <div class="components-container">
              <allopenjzzBatch @cancelEvent="closeModel2" :listData2='selectList' ref="handle" />
            </div>
            <div slot="footer">
            </div>
        </Modal>
    </div>
</template>

<script>
import {
  batchEditProcess
} from "@/api/batch";
import {
  findLawCaseList,
} from "@/api/case";
import { formatDate } from '@/libs/date';
import batch from "@/components/batch/allopenjzz/allopenjzzBatchList.vue";
import allopenjzzBatch from "@/components/batch/allopenjzz/allopenjzzBatch.vue";
import Vue from 'vue';
export default {
  name: "role-manage",
  components: {
    batch,
    allopenjzzBatch
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
        //   width: 200,
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
          title: "举质证状态",
          // width:150,
          align: "center",
          render: (h, params) => {
            let state=false;
            switch(params.row.progress){
              case '举证':
              case '质证':
                state=true;
              break;
            }
            return h('div', [
                h('i-switch', {
                    props: {
                      size: 'large',
                      value:state,
                    },
                    on: {
                      'on-change': (value) => {
                        this.progressSet(value,params.row.lawCaseId)
                      }
                    },
                },[
                  h('span', {
                    slot: 'open'
                  }, '开启'),
                  h('span', {
                    slot: 'close'
                  }, '关闭')
                ])
            ]);
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
      let isOneBrief = true;
      let brifN ="";
      for(let i=0;i<this.selectList.length;i++){
          if(i == 0){
            brifN = this.selectList[i].briefName
          } 
          if(i > 0 && brifN != this.selectList[i].briefName){
            isOneBrief = false;
          }
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
    openJzz(value){//批量开启
        //批量设置举质证开启状态
        let caseids='';
        //获取所选案件的id
        let count=this.selectList.length;
        this.selectList.forEach((item,index) => {
            count-1==index ? caseids+=item.lawCaseId : caseids+=item.lawCaseId+','
        });
        this.progressSet(value,caseids);
    },
    progressSet(value,caseid){//设置举质证开启状态
        console.log(caseid)
        let data={
            lawCaseIds:caseid,
            open:value,
            progress:'质证',
        }
        //发送更改状态请求
        batchEditProcess(data).then(res=>{
            if(res.data.state==100){
                //判断是单个开启还是批量开启
                if(caseid.indexOf(',')>-1){//批量
                    this.data.forEach((item,index) => {
                        if(value){
                            item.progress = '质证';
                        }else{
                            item.progress = '';
                        }
                        //更新当前窗口表格数据
                        Vue.set(this.data,index,item);
                    });
                }else{//单个
                    this.data.forEach((item,index) => {
                        if(item.lawCaseId==caseid){
                            if(value){
                                item.progress = '质证';
                            }else{
                                item.progress = '';
                            }
                            //更新当前窗口表格数据
                            Vue.set(this.data,index,item);
                            return;
                        }
                    });
                }
                this.$Message.success(res.data.message);
            }else{
                this.$Message.error(res.data.message);
            }
        });
    },
    closeModel(){
      this.modal1 = false;
    },
    closeModel2(data){
        //刷新
        this.selectList = [];
        this.selectCount = 0;
        this.modal2 = false;
        this.data = data;
        let ys = true;
        let that = this;
        setTimeout(function(){
					that.$refs.table.selectAll(ys);
				}, 500)
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