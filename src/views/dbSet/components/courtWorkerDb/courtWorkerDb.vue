<template>
  <div class="dbSet-reviewsCase fde" style="height:100%">
    <Row>
        <Col span="24" style="min-height:100%">
            <Card style="min-height:95%" class="">     
                <Row class="operation" style="margin-bottom:15px;">
                  <Form ref="searchForm" inline :label-width="100">
                    <span class="addDepartment" @click="showBox('add')">
                      <Icon type="plus-circled" color="#4873C5" size="25"></Icon>
                      <span>添加工作人员信息</span>
                    </span>
                    <FormItem label="姓名" prop="name">
                        <Input v-model="pageData.name" @on-change="getNowPageContent" clearable></Input>
                    </FormItem>
                    <FormItem label="职务/岗位" prop="judgeType">
                      <Select placeholder='请选择职务/岗位' v-model="pageData.judgeType" @on-change="getNowPageContent" clearable>
                          <Option v-for="item in boxInfo.jobList" :value="item" :key="item.index">{{ item }}</Option>
                      </Select>
                    </FormItem>
                    <FormItem label="身份证号" prop="identity">
                        <Input v-model="pageData.identity" @on-change="getNowPageContent" clearable></Input>
                    </FormItem>
                    <FormItem label="手机号" prop="phone">
                        <Input v-model="pageData.phone" @on-change="getNowPageContent" clearable></Input>
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
                  <Form ref="courtWorkerInfo" :model="courtWorkerInfo" :label-width="80" :rules="ruleList" class="box_form">
                      <FormItem label="姓名" prop="name">
                          <Input placeholder="必填" v-model="courtWorkerInfo.name"></Input>
                      </FormItem>
                      <FormItem label="所属部门"  prop="courtName">
                        <Select clearable placeholder='请选择部门' v-model="courtWorkerInfo.courtName">
                            <Option v-for="item in boxInfo.departMentList" :value="item.name" :key="item.index">{{ item.name }}</Option>
                        </Select>
                      </FormItem>
                      <FormItem label="职务/岗位" prop="judgeType">
                        <Select clearable placeholder='请选择职务/岗位' v-model="courtWorkerInfo.judgeType" @on-change="judgeTypeChange">
                            <Option v-for="item in boxInfo.jobList" :value="item" :key="item.index">{{ item }}</Option>
                        </Select>
                      </FormItem>
                      <FormItem label="法官助理" prop="assistantJudgeId" v-if="courtWorkerInfo.judgeType=='法官'">
                        <Select clearable placeholder='请选择法官助理' v-model="courtWorkerInfo.assistantJudgeId">
                            <Option v-for="item in boxInfo.judgeAgentList" :value="item.id" :key="item.index">{{ item.name }}</Option>
                        </Select>
                      </FormItem>
                      <FormItem label="书记员/代理书记员" prop="clerkId" v-if="courtWorkerInfo.judgeType=='法官'">
                        <Select clearable placeholder='请选择书记员/代理书记员' v-model="courtWorkerInfo.clerkId">
                            <Option v-for="item in boxInfo.clerkIdList" :value="item.id" :key="item.index">{{ item.name }}</Option>
                        </Select>
                      </FormItem>
                      <FormItem label="身份证号" prop="identity">
                          <Input placeholder="必填" v-model="courtWorkerInfo.identity"></Input>
                      </FormItem>
                      <FormItem label="手机号" prop="phone">
                          <Input placeholder="必填" v-model="courtWorkerInfo.phone"></Input>
                      </FormItem>
                      <FormItem label="办公电话" prop="telephone">
                          <Input placeholder="必填" v-model="courtWorkerInfo.telephone"></Input>
                      </FormItem>
                  </Form>
              </div>
              <div slot="footer">
                  <Button style="background-color:#4873C5;color:white" size="large" long :loading="boxInfo.loading" @click="addInfo('courtWorkerInfo')">{{boxInfo.footerBtn1}}</Button>
              </div>
          </Modal>
        </Col>
    </Row>
    <Modal
      v-model="upMod"
      title="上传电子签章"
      :mask-closable="false"
    >
      <div style="text-align:center">
        <Upload action="/api/court/judgement_result/uploadSign.jhtml" ref="uploadFile" :show-upload-list="false" :default-file-list="nowUploadSign ? [{name:'已上传',url:nowUploadSign}] : []" :on-success="plant_uploadSuccess" :data="{type:'法院工作者',id:nowId}">
            <Button icon="ios-cloud-upload-outline">上传电子签章</Button>
        </Upload>
        <div v-if="nowUploadSign">
          <p>浏览：</p>
          <iframe :src="nowUploadSign"></iframe>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  getCourtWorkerInfo,
  getAllDepartMentName,
  assistantJudgeList,
  clerkList,
  addJudgeNew,
  getJudgeInfo,
  editCourtWorkerInfo,
  uploadSign,
} from "@/api/dbSet.js";
export default {
  name: "courtWorkerDb",
  components: {

  },
  data() {
    return {
      loading:false,
      selectList:[],  //选择的数据
      selectCount:0,   //选择数量
      pageData: {
        pageNumber: 1,
        pageSize: 10,
        total: 0,
        name:"",
        judgeType:"",
        identity:"",
        phone:"",
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
          title: "所属部门",
          key: "courtName",
          align: "center"
        },
        {
          title: "职务/岗位",
          key: "judgeType",
          align: "center"
        },
        {
          title: "身份证号",
          key: "identity",
          width: 180,
          align: "center"
        },
        {
          title: "手机号",
          key: "phone",
          width: 130,
          align: "center"
        },
        {
          title: "办公电话",
          key: "telephone",
          width: 150,
          align: "center"
        },
        {
          title: "法官助理",
          key: "assistantJudgeId",
          align: "center",
          render(h,params) {
            return h('span',params.row.judgeAssistant)
          },
        },
        {
          title: "书记员/代理书记员",
          key: "clerkId",
          align: "center",
          render(h,params) {
            return h('span',params.row.clerkName)
          },
        },
        {
          title: "是否上传电子签章",
          key: "uploadSign",
          align: "center",
          render(h,params) {
            return h('span',params.row.uploadSign ? "已上传" : "未上传")
          },
        },
        {
          title: "操作",
          key: "",
          width: 200,
          align: "center",
          render: (h, params) => {
            return h('div', [
                h('Button', {
                    props: {
                        type: 'primary',
                        size: 'small'
                    },
                    style: {
                        marginRight: '5px'
                    },
                    on: {
                        click: () => {
                            this.showBox("edit",params.row.id,params.row);
                        }
                    }
                }, '修改'),
                h('Button', {
                    props: {
                        type: 'primary',
                        size: 'small'
                    },
                    style: {
                        marginRight: '5px'
                    },
                    on: {
                        click: () => {
                            this.showUpBox(params.row.id,params.row.uploadSign);
                        }
                    }
                }, params.row.uploadSign ? "修改电子签章" : "上传电子签章"),
                // h('Button', {
                //     props: {
                //         type: 'error',
                //         size: 'small'
                //     },
                //     on: {
                //         click: () => {
                //             this.removeInfo(params.row.id)
                //         }
                //     }
                // }, '删除')
            ]);
          }
        },
      ],
      tableData: [],
      boxInfo:{
        show:false,
        title:"",
        loading:false,
        footerBtn1:"",
        departMentList:[],
        jobList:["法官","书记员","审判长","法官助理","代书记员","法院调解员","机构调解员","调解员"],
        judgeAgentList:[],//法官助理列表
        clerkIdList:[],//书记员（代理）列表
        mark:"",
      },
      courtWorkerInfo:{
        name:"",//姓名
        judgeType:"",//职务
        courtName:"",//所属部门
        assistantJudgeId:"",//法官助理id
        clerkId:"",//书记员id
        identity:"",//身份证
        enable:"true",//是否启用
        phone:"",//手机号
        telephone:"",//固话
      },
      nowId:"",//当前选择项id
      nowState:"",//当前状态
      nowUploadSign:"",//当前起诉状
      upMod:false,
      ruleList:{
        name: [
          { required: true, message: '请输入姓名!',trigger: 'blur'},
        ],
        judgeType:[
          { required: true,  message: '请选择职务', trigger: 'blur' },
        ],
        assistantJudgeId:[
          { required: true,  message: '请选择法官助理', trigger: 'blur' },
        ],
        clerkId:[
          { required: true,  message: '请选择书记员/代理书记员', trigger: 'blur' },
        ],
        courtName:[
          { required: true, message: '请选择所属部门', trigger: 'blur' },
        ],
        identity: [
            { required: true,type: "string", message: '请输入身份证号!', trigger: 'blur' },
            { type: "string", pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/, message: '身份证不匹配!', trigger: 'blur' }
        ],
        phone:[
            { required: true, message: '请输入手机号!',trigger: 'blur'},
            { type: 'string',pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,message: '请正确填写手机号!', trigger: 'blur'}
        ],
        telephone:[
            { required: true, message: '请输入固话!',trigger: 'blur'},
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
    judgeTypeChange(name){//职务改变
      if(name=='法官'){
        // 获取法官助理列表
        assistantJudgeList().then(res=>{
          if(res.data.state==100){
            let data=res.data;
            this.boxInfo.judgeAgentList=data.data.judgeAssistant;
          }else{
            this.$Message.error(res.data.message);
          }
        });
        // 获取书记员或者代理书记员列表
        clerkList().then(res=>{
          if(res.data.state==100){
            let data=res.data;
            this.boxInfo.clerkIdList=data.data.clerk;
          }else{
            this.$Message.error(res.data.message);
          }
        });
      }
    },
    menuClick(name){//菜单点击事件
    console.log("name",name)

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
    //上传之前
    mAgent_beforeUpload() {
      this.$refs.upload.clearFiles();
      this.$Message.info({
        content: "文件上传中...",
        duration: 0
      });
    },
    plant_uploadSuccess (res,item) {//文件上传成功事件
      console.log("888888888888888888888",item)
      this.$Message.destroy()
      if(res.state === 100) {
        this.$Message.success(res.message);
        this.getNowPageContent(this.nowId);
      }else{
        this.$Message.error(res.message);
      }
    },
    getNowPageContent(id){//获取当前页内容
      this.loading=true;
      getCourtWorkerInfo(this.pageData).then(res=>{
        console.log(res);
        if(res.data.state==100){
          this.loading=false;
          let data = res.data.data[0];
          this.tableData = data.content;
          if(id){//获取对应的电子签章
             data.content.forEach((item,index) => {
              if(item.id==id){
                this.nowUploadSign=item.uploadSign;
              }
             });
          }
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
        judgeType:this.pageData.judgeType,
        identity:this.pageData.identity,
        phone:this.pageData.phone,
      }
    },
    clearSelectAll(){
      this.$refs.table.selectAll(false);
    },
    addInfo(name,id){//添加/修改工作人员信息
        console.log(this.nowState)
        console.log(this.$refs[name])
        //表单校验
        this.$refs[name].validate((valid) => {
          if (valid) {
          let data =  Object.assign({},this.courtWorkerInfo);
          console.log(data)
          this.$Message.loading({
                content: '正在提交数据...',
                duration: 0
          });
          //添加
          if(this.nowState=="add"){
            addJudgeNew(data).then(res=>{
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
          if(this.nowState=="edit"){
            data.id=this.nowId;
            editCourtWorkerInfo(data).then(res=>{
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
    removeInfo(){//删除信息
       
    },
    showBox(type,id,payload){//显示弹窗
      this.$Message.loading({
          content: '正在加载数据...',
          duration: 0
      });
      this.nowState=type;
      //获取部门信息
      getAllDepartMentName().then(res=>{
        if(res.data.state==100){
          this.$Message.destroy();
          this.boxInfo.show=true;
          this.boxInfo.departMentList=res.data.data;
        }else{
          this.$Message.error(res.data.message);          
        } 
      });
      //增加
      if(type=='add'){
        this.boxInfo.title="添加新工作人员";
        this.boxInfo.footerBtn1="添加";
        //清空数据绑定
        for(var key in this.courtWorkerInfo){
            //不清空的内容
            if(key=="enable"){
              continue;
            }
            this.courtWorkerInfo[key]="";
        }
      }
      //修改
      if(type=='edit'){
        this.boxInfo.title="修改工作人员信息";
        this.boxInfo.footerBtn1="保存修改";
        this.nowId=id;
        console.log(payload)
        //获取部门信息
        this.courtWorkerInfo = {
          name:payload.name,//姓名
          judgeType:payload.judgeType,//职务
          assistantJudgeId:payload.assistantJudgeId,//法官助理
          clerkId:payload.clerkId,//书记员（代理）
          courtName:payload.courtName,//所属部门
          identity:payload.identity,//身份证
          phone:payload.phone,//手机号
          telephone:payload.telephone,//固话
        };
      }
    },
    showUpBox(id,uploadSign){//上传电子签章的模态框
      this.$refs.uploadFile.clearFiles()
      this.nowUploadSign= uploadSign ? uploadSign : '';
      this.nowId=id;
      this.upMod=true;
    }
  },
  mounted() {
  }
}
</script>

<style>

 
</style>




