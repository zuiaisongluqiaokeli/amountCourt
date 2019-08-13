<template>
  <div class="dbSet-reviewsCase fde" style="height:100%">
    <Row>
        <Col span="24" style="min-height:100%">
            <Card style="min-height:95%" class="">     
                <Row class="operation" style="margin-bottom:15px;">
                  <Form ref="searchForm" inline :label-width="100">
                    <span class="addDepartment" @click="showBox('add')">
                      <Icon type="plus-circled" color="#4873C5" size="25"></Icon>
                      <span>添加新部门</span>
                    </span>
                    <FormItem label="部门/庭室名称" prop="name">
                        <Input  v-model="pageData.name" @on-change="getNowPageContent" clearable></Input>
                    </FormItem>
                    <FormItem label="部门类型" prop="departmentType">
                      <Select clearable placeholder='请选择部门类型' v-model="pageData.departmentType" @on-change="getNowPageContent">
                          <Option v-for="item in boxInfo.courtTypeList" :value="item" :key="item.index">{{ item }}</Option>
                      </Select>
                    </FormItem>
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
            <Modal v-model="boxInfo.show" width="500" :mask-closable="false">
              <p slot="header" style="color:black;text-align:center">
                  <Icon type="ios-information-circle"></Icon>
                  <span>{{boxInfo.title}}</span>
              </p>
              <div style="text-align:center">
                  <Form ref="courtInfo" :model="courtInfo" :label-width="100" :rules="ruleList" class="box_form">
                      <FormItem label="部门名称" prop="name">
                          <Input placeholder="必填" v-model="courtInfo.name"></Input>
                      </FormItem>
                      <!-- <FormItem label="上级部门" prop="parentId">
                        <Select clearable placeholder='请选择上级部门' v-model="courtInfo.parentId">
                            <Option v-for="item in boxInfo.departMentList" :value="item.id" :key="item.index">{{ item.name }}</Option>
                        </Select>
                      </FormItem> -->
                      <FormItem label="所属法院" prop="originCourtId">
                        <Select clearable placeholder='请选择所属法院' v-model="courtInfo.originCourtId">
                            <Option v-for="item in boxInfo.originCourtList" :value="item.value" :key="item.index">{{ item.label }}</Option>
                        </Select>
                      </FormItem>
                      <FormItem label="部门类型" prop="departmentType">
                        <Select clearable placeholder='请选择部门类型' v-model="courtInfo.departmentType">
                            <Option v-for="item in boxInfo.courtTypeList" :value="item" :key="item.index">{{ item }}</Option>
                        </Select>
                      </FormItem>
                      <FormItem label="地址" prop="address">
                          <Input placeholder="选填" v-model="courtInfo.address"></Input>
                      </FormItem>
                      <FormItem label="办公电话" prop="telephone">
                          <Input placeholder="选填" v-model="courtInfo.telephone"></Input>
                      </FormItem>
                  </Form>
              </div>
              <div slot="footer">
                  <Button style="background-color:#4873C5;color:white" size="large" long :loading="boxInfo.loading" @click="addInfo('courtInfo')">{{boxInfo.footerBtn1}}</Button>
              </div>
          </Modal>
        </Col>
    </Row>
  </div>
</template>

<script>
import {
  getDepartMentInfo,
  addDepartMentInfo,
  editDepartMentInfo,
  getAllDepartMentName,
} from "@/api/dbSet.js";
export default {
  name: "departMentDb",
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
        name:'',
        departmentType:'',
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
          title: "部门/庭室名称",
          key: "name",
          align: "center"
        },
        {
          title: "所属法院",
          key: "originCourtId",
          align: "center",
          render: (h, params) => {
            let tempName = ''
            for(var i=0;i<this.subData.length;i++){
              if(this.subData[i].id==params.row.originCourtId){
                  tempName =  this.subData[i].name;
              }
            }
            return h('span',tempName)
          }
        },
        // {
        //   title: "上级部门",
        //   key: "parentId",
        //   align: "center",
        //   render: (h, params) => {
        //     let tempName = ''
        //     for(var i=0;i<this.subData.length;i++){
        //       if(this.subData[i].id==params.row.parentId){
        //           tempName =  this.subData[i].name;
        //       }
        //     }
        //     return h('span',tempName)
        //   }
        // },
        {
          title: "部门类型",
          key: "departmentType",
          align: "center"
        },
        {
          title: "地址",
          key: "address",
          align: "center"
        },
        {
          title: "办公电话",
          key: "telephone",
          width: 150,
          align: "center"
        },
        // {
        //   title: "操作",
        //   key: "",
        //   width: 150,
        //   align: "center",
        //   render: (h, params) => {
        //     return h('div', [
        //         h('Button', {
        //             props: {
        //                 type: 'primary',
        //                 size: 'small'
        //             },
        //             style: {
        //                 marginRight: '5px'
        //             },
        //             on: {
        //                 click: () => {
        //                     this.showBox("edit",params.row.id);
        //                 }
        //             }
        //         }, '修改'),
        //         h('Button', {
        //             props: {
        //                 type: 'error',
        //                 size: 'small'
        //             },
        //             on: {
        //                 click: () => {
        //                     this.removeInfo(params.row.id)
        //                 }
        //             }
        //         }, '删除')
        //     ]);
        //   }
        // },
      ],
      tableData: [],
      subData:[],
      boxInfo:{
        show:false,
        title:"",
        loading:false,
        footerBtn1:"",
        departMentList:"",
        originCourtList:[{value: 1,label: '厦门金融司法协同中心'}],
        courtTypeList:["审判业务庭","行政职能部门"],
      },
      courtInfo:{
        name:"",//部门名称
        parentId:"",//上级部门
        originCourtId:1,//所属法院
        departmentType:"",//部门类型
        address:"",//地址
        telephone:"",//办公电话
      },
      nowId:"",//当前选择项id
      ruleList:{
        name: [
          { required: true, message: '请输入部门名称!',trigger: 'blur'},
        ],
        parentId:[
          { required: true, type: 'number', message: '请选择上级部门', trigger: 'change' },
        ],
        originCourtId:[
          { required: true, type: 'number', message: '请选择所属部门', trigger: 'change' },
        ],
        departmentType: [
          { required: true, type: 'string', message: '请选择部门类型', trigger: 'change' },
        ],
        address:[
          { message: '请输入地址!',trigger: 'blur'},
        ],
        telephone:[
          { message: '请输入办公电话!',trigger: 'blur'},
        ],
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
      //获取部门信息
      getDepartMentInfo(this.pageData).then(res=>{
        console.log(res);
        if(res.data.state==100){
          this.loading=false;
          let data = res.data.data;
          this.tableData = data.result;
          this.subData=data.idNames;
          this.setPageData(data.pageNumber, data.pageSize, data.total);
        }else{
            this.$Message.error(res.data.message);
        }
      });
    },
    setPageData(pageNumber, pageSize, total) {//设置分页参数
      this.pageData = {
        pageNumber,
        pageSize,
        total,
        name:this.pageData.name,
        departmentType:this.pageData.departmentType,
      }
    },
    clearSelectAll(){
      this.$refs.table.selectAll(false);
    },
    showBox(type,id){//显示弹窗
      this.$Message.loading({
          content: '正在加载数据...',
          duration: 0
      });
      this.$Message.destroy();
      this.boxInfo.show=true;
      // //获取上级部门信息
      // getAllDepartMentName().then(res=>{
      //   if(res.data.state==100){
      //     this.$Message.destroy();
      //     this.boxInfo.show=true;
      //     this.boxInfo.departMentList=res.data.data;
      //   }else{
      //     this.$Message.error(res.data.message);          
      //   } 
      // });
      //增加
      if(type=='add'){
        this.boxInfo.title="添加新部门";
        this.boxInfo.footerBtn1="添加";
        //清空数据绑定
        for(var key in this.courtInfo){
            //不清空的内容
            if(key=="originCourtId"){
              continue;
            }
            this.courtInfo[key]="";
        }
      }
      //修改
      if(type=='edit'){
        this.boxInfo.title="修改部门信息";
        this.boxInfo.footerBtn1="保存修改";
        this.nowId=id;
        //获取该条部门信息
        this.tableData.forEach((item,index) => {
          if(item.id==this.nowId){
            this.courtInfo={
              name:item.name,//部门名称
              parentId:item.parentId,//上级部门
              originCourtId:item.originCourtId,//所属法院
              departmentType:item.departmentType,//部门类型
              address:item.address,//地址
              telephone:item.telephone,//办公电话
            };
          }
        });
      }
    },
    addInfo(name,id){//添加/修改部门信息
        //表单校验
        this.$refs[name].validate((valid) => {
        if (valid) {
          let data =  Object.assign({},this.courtInfo);
          this.$Message.loading({
                content: '正在提交数据...',
                duration: 0
          });
          //添加
          if(this.boxInfo.title=="添加新部门"){
            addDepartMentInfo(data).then(res=>{
              this.$Message.destroy();
              //  console.log(res);
              if(res.data.state==100){
                  this.boxInfo.show=false;
                  this.$Modal.success({content: res.data.message});
                  this.getNowPageContent();//刷新列表
              }else{
                  this.$Modal.error({content: res.data.message});
              }
            })
          }
          //修改
          if(this.boxInfo.title=="修改部门信息"){
            data.id=this.nowId;
            editDepartMentInfo(data).then(res=>{
              this.$Message.destroy();
              //  console.log(res);
              if(res.data.state==100){
                  this.boxInfo.show=false;
                  this.$Modal.success({content: res.data.message});
                  this.getNowPageContent();//刷新列表
              }else{
                  this.$Modal.error({content: res.data.message});
              }
            })
          }
        }
      });
    },
 }
}
</script>

<style lang='css' scoped>
</style>