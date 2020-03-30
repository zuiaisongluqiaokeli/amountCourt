<style lang="less">
@import "./batch.less";
</style>
<template>
    <div class="reviewsCase fde" style="height:100%">
        <Row>
            <Col span="24" style="min-height:100%">
                    <Row class="operation" style="margin-bottom:15px;">
                        <Button size='large' @click="showGO" style="background:#2083D8;float:right;margin-right:15px;"  type="primary" >为选中的案件确认{{myType}}信息</Button>
                        <Button size='large' @click="addBatchList"  style="background:#2083D8;color:#fff;margin-right:15px;float:left;" >添加案件到批量工作列表</Button>
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
                        <Table 
                        size="small" 
                        stripe 
                        style="min-height:350px" 
                        :loading="loading" 
                        border 
                        :columns="columns" 
                        @on-row-click="rowClick" 
                        :data="data" 
                        ref="table" 
                        sortable="custom" 
                        @on-selection-change="changeSelect"></Table>
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
              <batch 
              @cancelEvent="closeModel" 
              @saveEvent='changeList' 
              @typeEvent='setMyType' 
              ref="batch" />
            </div>
            <div slot="footer">
            </div>
        </Modal>
        <Modal
            v-model="modal2"
            :title="'确认'+myType+'信息'"
            :mask-closable="false"
            :styles="{top: '20px'}"
            :width="modalWidth">
            <div class="components-container">
              <batchHandle 
              @cancelEvent="closeModel2"
              @nextStep="nextStep" 
              @reSetList="reSetList" 
              :listDatas='selectList' 
              :myType="myType" 
              ref="handle" />
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
import { formatDate } from "@/libs/date";
import batch from "@/components/caseSure/batchList/batchList.vue";
import batchHandle from "@/components/caseSure/batchHandle/batchHandle.vue";
import circleLoading from "@/components/circleLoad/circle-loading.vue";
export default {
  components: {
    circleLoading,
    batch,
    batchHandle,
  },
  data() {
    var width = window.innerWidth - 100;
    return {
      loading: true,
      treeLoading: false,
      modal1:false,
      modalWidth:width,
      modal2:false,
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
          title: "流水号",
          key: "flowNumber",
          align: "center",
          width: 200,
          render: (h, params) => {
            return h(
                'span',
                {},
              params.row.flowNumber ?  params.row.flowNumber : "暂无"
            );
          }
        },
        {
          title: "案号",
          key: "caseNo",
          align: "center",
          width: 180,
          render: (h, params) => {
            return h(
                'span',
                {},
              params.row.caseNo ?  params.row.caseNo : "暂无"
            );
          }
        },
        {
          title: "案由",
          key: "briefName",
          align: "center",
          render: (h, params) => {
            return h(
                'span',
                {},
              params.row.briefName ? params.row.briefName : "暂无"
            );
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
        {
          title: "承办法官",
          key: "judgeName",
          align: "center",
          // width: 120,
          render: (h, params) => {
            return h(
                'span',
                {},
              params.row.judgeName ? params.row.judgeName : "暂无"
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
                'span',
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
                'span',
                {},
              params.row.clerkName ? params.row.clerkName : "暂无"
            );
          }
        },
        {
          title: "立案时间",
          key: "filingDate",
          align: "center",
          width: 150,
          render: (h, params) => {
            return h(
                'span',
                {},
              params.row.filingDate ?  formatDate(new Date(params.row.filingDate), 'yyyy-MM-dd hh:mm') : params.row.receiceDate ? formatDate(new Date(params.row.receiceDate), 'yyyy-MM-dd hh:mm') :'暂无'
            );
          }
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
              params.row.startDate ?  formatDate(new Date(params.row.startDate), 'yyyy-MM-dd hh:mm') : params.row.selTime ? formatDate(new Date(params.row.selTime), 'yyyy-MM-dd hh:mm') :'暂无'
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
      data: [], //表格的数据
      myType:"立案",//我操作的案件类型
      pageNumber: 1,
      pageSize: 10,
      total: 0,
    };
  },
  methods: {
    init() {
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
    
    //下拉菜单
    handleDropdown(name){
      if(name == 'clear'){
          this.selectList = [];
          this.selectCount = '';
          this.data = [];
        }else if(name == 'refresh'){
          this.getRoleList()
        }
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
      this.loading = true; //table的加载样式
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
          // setTimeout(() => {
          //   //数据全选
          //   this.$refs.table.selectAll(true);
          // }, 500);
        }else{
            this.$Message.info(res.data.message);
        }
      });
    },
    changeSelect(e){
      this.selectList = e;
      this.selectCount = e.length;
    },
    setMyType(type){
      console.log("mytype",type)
      this.myType=type;
    },
    /**
     * 批量操作的选择数据显示在当前表格
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
    //打开批量操作台
    addBatchList(){
      console.log(this.$store.getters.roLeName)
      this.$refs.batch.init();
      this.modal1 = true;
    },
    /**
     * 打开审核模态框
     */
    showGO(){
      console.log(this.myType)
      if (this.selectCount <= 0) {
          this.$Notice.warning({
              title: '',
              desc: '您还未选择需要操作案件',
              duration: 5
          });
        return;
      }
      //清空表单
      this.$refs.handle.resetData();
      let result =this.selectType();//选择对应流程
      if(!result){
        this.modal2 = false;
      }else{
        this.modal2 = true;
      }
    },
    //关闭窗口1 
    closeModel(){
      this.modal1 = false;
    },
     //初始化数据获取案由等等
    selectType(){
      switch(this.myType){
         case '立案':
            let firstBriefName = this.selectList[0].briefName;
            if(firstBriefName){
              for (var x of this.selectList) {
                console.log("x.briefName",x.briefName,"firstBriefName",firstBriefName)
                if (firstBriefName.indexOf(x.briefName) < 0) {
                  this.$Notice.warning({
                    title: "请选择同类型的案由！",
                    desc: "",
                    duration: 5
                  });
                  return false;
                }
              }
            }else{
              this.$Notice.warning({
                title: "请选择有案由的案件！",
                desc: "",
                duration: 5
              });
              return false;
            }
            this.$refs.handle.$refs.setCase.getList();
         break
         case '分案':
            this.$refs.handle.$refs.division.getList();
         break
         case '排庭':
            this.$refs.handle.$refs.courtDate.getList();
         break
      }
      return true;
    },
    
    /**
     * 关闭批量信息确认
     */
    closeModel2(){
      this.modal2 = false;
    },
    
    nextStep(type){//下一步
      this.myType=type;
      this.selectType();
    },
   
    reSetList(list){//更新数据
      list.forEach((item,index)=>{
        this.selectList.forEach((item1,index1)=>{
            if(item.lawCaseId==item1.lawCaseId){//找到对应案件
              item1=item;//替换更新
              this.$set(this.selectList,index1,item1)
            }
        })
        this.data.forEach((item1,index1)=>{
            if(item.lawCaseId==item1.lawCaseId){//找到对应案件
              item1=item;//替换更新
              this.$set(this.data,index1,item1)
            }
        })
      })
      console.log('selectList',this.selectList,'data',this.data)
    }
  },
  mounted() {
    this.init();
  },
};
</script>

