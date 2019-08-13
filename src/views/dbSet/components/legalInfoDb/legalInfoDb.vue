<template>
  <div class="dbSet-reviewsCase fde" style="height:100%">
    <Row>
        <Col span="24" style="min-height:100%">
            <Card style="min-height:95%" class="">     
                <Row class="operation" style="margin-bottom:15px;">
                  <Form ref="searchForm" inline :label-width="100">
                    <span class="addDepartment" @click="showBox('add')">
                      <Icon type="plus-circled" color="#4873C5" size="25"></Icon>
                      <span>添加法院信息</span>
                    </span>
                      <FormItem label="姓名" prop="name">
                          <Input v-model="pageData.name" @on-change="getNowPageContent" clearable></Input>
                      </FormItem>
                      <FormItem label="联系电话" prop="telephone">
                          <Input v-model="pageData.telephone" @on-change="getNowPageContent" clearable></Input>
                      </FormItem>
                      <FormItem label="部门类型" prop="courtType">
                        <Select placeholder='请选择部门类型' v-model="pageData.courtType" @on-change="getNowPageContent" clearable>
                            <Option v-for="item in boxInfo.courtTypeList" :value="item.value" :key="item.index">{{ item.label }}</Option>
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
                      <FormItem label="姓名" prop="name">
                          <Input placeholder="必填" v-model="courtInfo.name"></Input>
                      </FormItem>
                      <FormItem label="省" prop="province">
                          <Input placeholder="必填" v-model="courtInfo.province"></Input>
                      </FormItem>
                      <FormItem label="市" prop="city">
                          <Input placeholder="必填" v-model="courtInfo.city"></Input>
                      </FormItem>
                      <FormItem label="区" prop="county">
                          <Input placeholder="必填" v-model="courtInfo.county"></Input>
                      </FormItem>
                      <FormItem label="部门类型" prop="courtType">
                        <Select clearable placeholder='请选择部门类型' v-model="courtInfo.courtType">
                            <Option v-for="item in boxInfo.courtTypeList" :value="item.value" :key="item.index">{{ item.label }}</Option>
                        </Select>
                      </FormItem>
                      <FormItem label="具体地址" prop="address">
                          <Input placeholder="必填" v-model="courtInfo.address"></Input>
                      </FormItem>
                      <FormItem label="联系电话" prop="telephone">
                          <Input placeholder="必填" v-model="courtInfo.telephone"></Input>
                      </FormItem>
                      <FormItem label="官网" prop="url">
                          <Input placeholder="必填" v-model="courtInfo.url"></Input>
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
  getLegalInfo,
  addLegalInfo,
  editLegalInfo
} from "@/api/dbSet.js";
export default {
  name: "legalInfoDb",
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
        name:"",
        telephone:"",
        courtType:"",
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
          width: 120,
          align: "center",
          render: (h, params) => {
            return h('span',params.index + (this.pageData.pageNumber- 1) * this.pageData.pageSize + 1);
          }
        },
        {
          title: "名称",
          key: "name",
          align: "center"
        },
        {
          title: "所属行政区",
          width: 195,
          align: "center",
          render: (h, params) => {
              return h('span', params.row.province + params.row.city + params.row.county )
          }
        },
        {
          title: "类别",
          key: "courtType",
          align: "center",
          width:150,
        },
        {
          title: "地址",
          key: "address",
          align: "center",
        },
        {
          title: "联系电话",
          key: "telephone",
          width: 150,
          align: "center"
        },
        {
          title: "官网网址",
          key: "url",
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
      tableData: [
      ],
      boxInfo:{
        show:false,
        title:"",
        loading:false,
        footerBtn1:"",
        courtTypeList:[
          {value: '高级人民法院',label: '高级人民法院'},
          {value: '中级人民法院',label: '中级人民法院'},
          {value: '基层人民法院',label: '基层人民法院'},
          {value: '专门人民法院',label: '专门人民法院'},
        ],
      },
      courtInfo:{
        name:"",//名称
        province:"",//省
        city:"",//市
        county:"",//区
        courtType:"",//法院类别
        telephone:"",//联系电话
        address:"",//具体地址
        url:"",//官网
      },
      nowId:"",//当前选择项id
      ruleList:{
        name: [
          { required: true, message: '请输入陪审员姓名!',trigger: 'blur'},
        ],
        province:[
          { required: true, message: '请输入省份!',trigger: 'blur'},
        ],
        city:[
          { required: true, message: '请输入城市!',trigger: 'blur'},
        ],
        county:[
          { required: true, message: '请输入区域!',trigger: 'blur'},
        ],
        courtType: [
          { required: true, type: 'string', message: '请选择法院类别', trigger: 'blur' },
        ],
        telephone:[
          { required: true, message: '请输入联系电话!',trigger: 'blur'},
        ],
        address: [
          { required: true, message: '请输入地址!',trigger: 'blur'},
        ],
        url:[
          { required: true, message: '请输入官网!',trigger: 'blur'},
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
      getLegalInfo(this.pageData).then(res=>{
        console.log(res);
        if(res.data.state==100){
          this.loading=false;
          let data = res.data.data;
          this.tableData = data.content;
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
        telephone:this.pageData.telephone,
        courtType:this.pageData.courtType,
      }
    },
    clearSelectAll(){
      this.$refs.table.selectAll(false);
    },
    showBox(type,id){//显示弹窗
      //增加
      if(type=='add'){
        this.boxInfo.title="添加法院信息";
        this.boxInfo.footerBtn1="添加";
        //清空数据绑定
        for(var key in this.courtInfo){
            this.courtInfo[key]="";
        }
      }
      //修改
      if(type=='edit'){
        this.boxInfo.title="修改法院信息";
        this.boxInfo.footerBtn1="保存修改";
        this.nowId=id;
        //获取该条部门信息
        this.tableData.forEach((item,index) => {
          if(item.id==this.nowId){
            this.courtInfo={
              name:item.name,//名称
              province:item.province,//省
              city:item.city,//市
              county:item.county,//区
              courtType:item.courtType,//法院类别
              telephone:item.telephone,//联系电话
              address:item.address,//具体地址
              url:item.url,//官网
            };
          }
        });
      }
      this.boxInfo.show=true;
    },
    addInfo(name,id){//添加/修改工作人员信息
        //表单校验
        this.$refs[name].validate((valid) => {
        if (valid) {
          let data =  Object.assign({},this.courtInfo);
          console.log(data)
          this.$Message.loading({
                content: '正在提交数据...',
                duration: 0
          });
          //添加
          if(this.boxInfo.title=="添加法院信息"){
            addLegalInfo(data).then(res=>{
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
          if(this.boxInfo.title=="修改法院信息"){
            data.id=this.nowId;
            editLegalInfo(data).then(res=>{
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

<style>

 
</style>




