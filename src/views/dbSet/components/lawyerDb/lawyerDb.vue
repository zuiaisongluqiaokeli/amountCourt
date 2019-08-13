<template>
  <div class="dbSet-reviewsCase fde" style="height:100%">
    <Row>
        <Col span="24" style="min-height:100%">
            <Card style="min-height:95%" class="">     
                <Row class="operation" style="margin-bottom:15px;">
                    <Form ref="searchForm" inline :label-width="80">
                        <Form-item label="姓名/名称">
                          <Input type="text" clearable placeholder="姓名/名称" style="width:150px" @on-change="nameChange" v-model="selects.agentName"/>
                        </Form-item>
                        <Form-item label="证件号">
                          <Input type="text" clearable placeholder="证件号" style="width:150px" @on-change="lawerNumChange" v-model="selects.agentIdentiCard"/>
                        </Form-item>
                        <Dropdown  class="dropMenu"  @on-click="handleDropdown">
                          <Button size='large' type="primary">
                            更多操作
                            <Icon type="ios-arrow-down"></Icon>
                          </Button>
                          <DropdownMenu size='large' slot="list">
                            <DropdownItem size='large' name="refresh">刷新</DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                    </Form>
                </Row>
                <Row>
                    <Alert show-icon>
                        已选择 <span class="select-count">{{selectCount}}</span> 项
                        <a class="select-clear" @click="clearSelectAll">清空</a>
                    </Alert>
                </Row>
                <Row class="tables">
                    <Table size="small" stripe style="min-height:350px" :loading="loading" border :columns="columns" :data="tableData" ref="table" sortable="custom"  @on-selection-change="changeSelect"></Table>
                </Row>
                <Row type="flex" justify="end" class="page" style="margin-top:10px;height:30px;">
                    <Page :current="pageData.pageNumber" :total="pageData.total" :page-size="pageData.pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" placement='top' :page-size-opts="[10,20,50,100]" size="small" show-total show-elevator show-sizer></Page>
                </Row>
            </Card>
        </Col>
    </Row>
  </div>
</template>

<script>
import {
getLawyerInfo,
} from "@/api/dbSet.js";
export default {
  name: "lawyerDb",
  components: {

  },
  data() {
    return {
      loading: false,
      selectList:[],  //选择的数据
      selectCount:0,   //选择数量
      pageData: {
        pageNumber: 1,
        pageSize: 10,
        total: 0,
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
            return h('span',params.index + (this.pageData.pageNumber- 1) * this.pageData.pageSize + 1);
          }
        },
        {
          title: "姓名",
          key: "name",
          align: "center"
        },
        {
          title: "公民身份证号",
          key: "idcard",
          width: 180,
          align: "center"
        },
        {
          title: "律师证号",
          key: "lawerNum",
          width: 180,
          align: "center"
        },
        {
          title: "联系地址",
          key: "personAddresss",
          align: "center",
          render: (h, params) => {
            var arr = params.row.personAddresss;//数据数组
            var newArr = [];
            arr.forEach((item,index)=>{
                newArr.push(h('p',item.address))
            })
            return h('div',newArr);
          }
        },
        {
          title: "手机号",
          key: "lawyerPhone",
          width: 150,
          align: "center"
        },
        // {
        //   title: "数据来源",
        //   key: "remark",
        //   align: "center"
        // },
        {
          title: "操作",
          key: "",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h('a',"查看详细信息");
          }
        },
      ],
      tableData: [],
      boxInfo:{
        show:false,
        title:"",
        loading:false,
        footerBtn1:"",
      },
      courtInfo:{
        agentName:"",//姓名
        agentIdentiCard:"",//公民身份证号
        lawerNum:"",//律师证号
        agentAddress:"",//联系地址
        agentMobile:"",//手机号
        remark:"",//数据来源
      },
      selects:{
        agentName:"",
        agentIdentiCard:"",
      },
      nowId:"",//当前选择项id
      ruleList:{
      }
    };
  },
  methods: {
    pageChange(pageNum) {//页码改变
        this.pageData.pageNumber = pageNum;
        this.getNowPageContent();
    },
    pageSizeChange(pageSize) {//页码大小改变
        this.pageData.pageSize = pageSize;
        this.getNowPageContent();
    },
    changeSelect(e){
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
    getNowPageContent(){//获取当前页内容
      this.loading=true;
      console.log(this.pageData)
      //获取律师信息
      getLawyerInfo(this.pageData.pageSize,this.pageData.pageNumber,this.selects.agentName,this.selects.agentIdentiCard).then(res=>{
        console.log(res);
        if(res.data.state==100){
          this.loading=false;
          let data = res.data.data;
          this.tableData = data.personList;
          this.setPageData(data.pageNum, data.pageSize, data.total);
        }else{
            this.$Message.error(res.data.message);
        }
      });
    },
    setPageData(pageNumber, pageSize, total) {//设置分页参数
      this.pageData = {
        pageNumber,
        pageSize,
        total
      }
    },
    nameChange(){
      this.courtInfo.agentName = this.selects.agentName;
      this.getNowPageContent();
    },
    lawerNumChange(){
      this.courtInfo.lawerNum = this.selects.agentIdentiCard;
      this.getNowPageContent();
    },
    clearSelectAll(){
      this.$refs.table.selectAll(false);
    },
 }
}
</script>

<style lang='css' scoped>
</style>



