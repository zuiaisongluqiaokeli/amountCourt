<template>
  <div class="dbSet-reviewsCase fde" style="height:100%">
    <Row>
        <Col span="24" style="min-height:100%">
            <Card style="min-height:95%" class="">     
                <Row class="operation" style="margin-bottom:15px;">
                  <Form ref="searchForm" inline :label-width="100">
                    <span class="addDepartment" @click="showBox('add')">
                      <Icon type="plus-circled" color="#4873C5" size="25"></Icon>
                      <span>添加新的人民陪审员信息</span>
                    </span>
                    <FormItem label="姓名" prop="name">
                        <Input v-model="pageData.name" @on-change="getNowPageContent" clearable></Input>
                    </FormItem>
                    <FormItem label="身份证" prop="idcard">
                        <Input v-model="pageData.idcard" @on-change="getNowPageContent" clearable></Input>
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
                  <Form ref="courtInfo" :model="courtInfo" :label-width="100" :rules="ruleList" class="box_form">
                      <FormItem label="姓名" prop="name">
                          <Input placeholder="必填" v-model="courtInfo.name"></Input>
                      </FormItem>
                      <FormItem label="身份证" prop="idcard">
                          <Input placeholder="必填" v-model="courtInfo.idcard"></Input>
                      </FormItem>
                      <FormItem label="职业" prop="work">
                          <Input placeholder="必填" v-model="courtInfo.work"></Input>
                      </FormItem>
                      <FormItem label="联系地址" prop="address">
                          <Input placeholder="必填" v-model="courtInfo.address"></Input>
                      </FormItem>
                      <FormItem label="手机号" prop="phone">
                          <Input placeholder="必填" v-model="courtInfo.phone"></Input>
                      </FormItem>
                      <FormItem label="任期截止" prop="endDate" style="text-align:left">
                          <DatePicker type="datetime" placeholder="请选择截止时间" style="width: 200px" v-model="courtInfo.endDate"></DatePicker>
                      </FormItem>
                  </Form>
              </div>
              <div slot="footer">
                  <Button style="background-color:#4873C5;color:white" size="large" long :loading="boxInfo.loading" @click="addInfo('courtInfo')">{{boxInfo.footerBtn1}}</Button>
              </div>
          </Modal>
        </Col>
    </Row>
    <Modal
      v-model="upMod"
      title="上传电子签章"
      :mask-closable="false"
      width="250"
    >
      <div style="text-align:center">
        <Upload action="/api/court/judgement_result/uploadSign.jhtml" ref="uploadFile" :show-upload-list="false" :default-file-list="nowUploadSign ? [{name:'已上传',url:nowUploadSign}] : []" :on-success="plant_uploadSuccess" :data="{type:'陪审员',id:nowId}">
            <Button icon="ios-cloud-upload-outline">上传电子签章</Button>
        </Upload>
        <div v-if="nowUploadSign">
          <p>预览：</p>
          <iframe :src="nowUploadSign"></iframe>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  getJurorInfo,
  addJurorInfo,
  editJurorInfo
} from "@/api/dbSet.js";
export default {
  name: "jurorDb",
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
        phone:"",
        idcard:"",
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
          title: "职业",
          key: "work",
          align: "center",
        },
        {
          title: "联系地址",
          key: "address",
          align: "center",
        },
        {
          title: "手机号",
          key: "phone",
          width: 130,
          align: "center"
        },
        {
          title: "任期截止",
          key: "endDate",
          width: 170,
          align: "center",
          render: function (h, params) {
            return h('span', new Date(params.row.endDate).Format('yyyy-MM-dd hh:mm:ss'));/*这里的this.row能够获取当前行的数据*/
          }
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
                // h('Button', {
                //     props: {
                //         type: 'primary',
                //         size: 'small'
                //     },
                //     style: {
                //         marginRight: '5px'
                //     },
                //     on: {
                //         click: () => {
                //             this.showBox("edit",params.row.id);
                //         }
                //     }
                // }, '修改'),
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
                }, '上传电子签章'),
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
      tableData: [
      ],
      boxInfo:{
        show:false,
        title:"",
        loading:false,
        footerBtn1:"",
      },
      courtInfo:{
        name:"",//姓名
        idcard:"",//身份证
        work:" ",//职业
        address:"",//联系地址
        phone:"",//手机号
        endDate:"",//任期截止
      },
      nowId:"",//当前选择项id
      nowState:"",//当前状态
      nowUploadSign:"",//当前起诉状
      upMod:false,
      ruleList:{
        name: [
          { required: true, message: '请输入陪审员姓名!',trigger: 'blur'},
        ],
        idcard:[
          { required: true,type: "string", message: '请输入身份证号!', trigger: 'blur' },
          { type: "string", pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/, message: '身份证不匹配!', trigger: 'blur' }
        ],
        work:[
          { required: true, message: '请输入职业!',trigger: 'blur'},
        ],
        address:[
          {  message: '请输入联系地址!',trigger: 'blur'},
        ],
        phone: [
          { required: true, message: '请输入手机号!',trigger: 'blur'},
          { type: 'string',pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,message: '请正确填写手机号!', trigger: 'blur'}
        ],
        endDate:[
          { required: true, type: 'date',message: '请选择任期截止时间', trigger: 'change' }
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
    getNowPageContent(id){//获取当前页内容
      this.loading=true;
      getJurorInfo(this.pageData).then(res=>{
        console.log(res);
        if(res.data.state==100){
          this.loading=false;
          let data = res.data.data[0];
          this.tableData = data.content;
          if(id){//获取对应的电子签章
             this.tableData.forEach((item,index) => {
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
    setPageData(pageNumber, pageSize, total) {//设置分页参数
      this.pageData = {
        pageNumber,
        pageSize,
        total,
        name:this.pageData.name,
        phone:this.pageData.phone,
        idcard:this.pageData.idcard,
      }
    },
    clearSelectAll(){
      this.$refs.table.selectAll(false);
    },
    showBox(type,id){//显示弹窗
      this.nowState=type;
      //增加
      if(type=='add'){
        this.boxInfo.title="添加人民陪审员";
        this.boxInfo.footerBtn1="添加";
        //清空数据绑定
        for(var key in this.courtInfo){
            this.courtInfo[key]="";
        }
      }
      //修改
      if(type=='edit'){
        this.boxInfo.title="修改人民陪审员信息";
        this.boxInfo.footerBtn1="保存修改";
        this.nowId=id;
        //获取该条信息
        this.tableData.forEach((item,index) => {
          if(item.id==this.nowId){
            this.courtInfo={
              name:item.name,//姓名
              idcard:item.idcard,//身份证
              work:item.work,//职业
              address:item.address,//联系地址
              phone:item.phone,//手机号
              endDate:new Date(item.endDate)//任期截止
            };
          }
        });
      }
      this.boxInfo.show=true;
    },
    showUpBox(id,uploadSign){//上传电子签章的模态框
      this.$refs.uploadFile.clearFiles()
      this.nowUploadSign= uploadSign ? uploadSign : '';
      this.nowId=id;
      this.upMod=true;
    },
    addInfo(name,id){//添加/修改工作人员信息
        //表单校验
        console.log(this.courtInfo)
        this.$refs[name].validate((valid) => {

        if (valid) {
          let data =  Object.assign({},this.courtInfo);
          console.log(data)
          this.$Message.loading({
                content: '正在提交数据...',
                duration: 0
          });
          //添加
          if(this.nowState=="add"){
            addJurorInfo(data).then(res=>{
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
            editJurorInfo(data).then(res=>{
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
    initFormatter(){//时间戳转换时间
      Date.prototype.Format = function(fmt) { //
        let o = {  
            "M+" : this.getMonth()+1,                 //月份  
            "d+" : this.getDate(),                    //日  
            "h+" : this.getHours(),                   //小时  
            "m+" : this.getMinutes(),                 //分  
            "s+" : this.getSeconds(),                 //秒  
            "q+" : Math.floor((this.getMonth()+3)/3), //季度  
            "S"  : this.getMilliseconds()             //毫秒  
        };  
        if(/(y+)/.test(fmt))  
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));  
        for(var k in o)  
            if(new RegExp("("+ k +")").test(fmt))  
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));  
        return fmt;  
      }
    },
  },
  changeDate(dateA) {//去除日期T/Z格式
    var dateee = new Date(dateA).toJSON();
    var date = new Date(+new Date(dateee)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
    return date;
  },
  created() {
    this.initFormatter();// 为Date 对象添加Format方法
  },
}
</script>

<style>

 
</style>




