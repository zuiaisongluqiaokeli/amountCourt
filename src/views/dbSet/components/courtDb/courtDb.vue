<template>
  <div class="dbSet-reviewsCase fde" style="height:100%">
    <Row>
        <Col span="24" style="min-height:100%">
            <Card style="min-height:95%" class="">     
                <Row class="operation" style="margin-bottom:15px;">
                  <Form ref="searchForm" inline :label-width="100">
                    <span class="addDepartment" @click="showBox('add')">
                      <Icon type="plus-circled" color="#4873C5" size="25"></Icon>
                      <span>添加新审判庭室（场所）</span>
                    </span>
                    <FormItem label="审判庭室名称" prop="name">
                        <Input  v-model="pageData.name" @on-change="getNowPageContent" clearable></Input>
                    </FormItem>
                    <FormItem label="庭室类型" prop="tribunalType">
                      <Select clearable placeholder='请选择庭室类型' v-model="pageData.tribunalType" @on-change="getNowPageContent" width="150px">
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
                      <FormItem label="审判庭室名称" prop="name">
                          <Input placeholder="必填" v-model="courtInfo.name"></Input>
                      </FormItem>
                      <FormItem label="场所所在地" prop="place">
                        <Select clearable placeholder='请选择场所所在地' v-model="courtInfo.place">
                            <Option v-for="item in boxInfo.useCourtList" :value="item" :key="item.index">{{ item }}</Option>
                        </Select>
                      </FormItem>
                      <FormItem label="详细地址" prop="address">
                          <Input placeholder="必填" v-model="courtInfo.address"></Input>
                      </FormItem>
                      <FormItem label="类型" prop="tribunalType">
                        <Select clearable placeholder='请选择庭室类型' v-model="courtInfo.tribunalType">
                            <Option v-for="item in boxInfo.courtTypeList" :value="item" :key="item.index">{{ item }}</Option>
                        </Select>
                      </FormItem>
                      <FormItem label="使用部门" prop="superCourtIds">
                        <CheckboxGroup v-model="courtInfo.superCourtIds" @on-change="changeBox">
                            <Checkbox v-for="item in boxInfo.departMentList" :label="item.id">
                                <span>{{item.name}}</span>
                            </Checkbox>
                        </CheckboxGroup>
                      </FormItem>
                      <FormItem label="是否自动排班"   style="text-align:left">
                          <RadioGroup v-model="courtInfo.auto">
                            <Radio label='true' ><span>是</span></Radio>
                            <Radio label='false' ><span>否</span></Radio>
                          </RadioGroup>
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
  getCourtInfo,
  getAllDepartMentName,
  addCourtInfo,
} from "@/api/dbSet.js";
export default {
  name: "courtDb",
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
        tribunalType:"",//庭室类型
        name:""//庭室名称
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
          title: "审判庭名称",
          key: "name",
          align: "center"
        },
        {
          title: "使用部门",
          key: "useCourt",
          align: "center"
        },
        {
          title: "场所所在地",
          key: "place",
          align: "center"
        },
        {
          title: "详细地址",
          key: "address",
          align: "center"
        },
        {
          title: "类型",
          key: "tribunalType",
          align: "center"
        },
        {
          title: "操作",
          key: "",
          width: 150,
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
                            this.showBox("edit",params.row.id);
                        }
                    }
                }, '修改'),
                h('Button', {
                    props: {
                        type: 'error',
                        size: 'small'
                    },
                    on: {
                        click: () => {
                            this.removeInfo(params.row.id)
                        }
                    }
                }, '删除')
            ]);
          }
        },
      ],
      tableData: [
      ],
      boxInfo:{
        show:false,
        title:"",
        boxType:"",//当前盒子类型（增加、修改）
        loading:false,
        footerBtn1:"",
        courtTypeList:["普通法庭","科技法庭","互联网法庭"],
        useCourtList:["厦门市思明区人民法院院部","莲前人民法庭","滨海人民法庭"],
        departMentList:[],
      },
      courtInfo:{
        name:"",//审判庭室名称
        place:"",//场所所在地
        address:"",//详细地址
        tribunalType:"",//类型
        superCourtIds:[],//使用部门
        auto:'',//是否自动排班
      },
      nowId:"",//当前选择项id
      ruleList:{
        name: [
          { required: true, message: '请输入审判庭室名称!',trigger: 'blur'},
        ],
        place:[
          { required: true, message: '请输入场所所在地!',trigger: 'blur'},
        ],
        address:[
          { required: true, message: '请输入详细地址!',trigger: 'blur'},
        ],
        tribunalType: [
          { required: true, type: 'string', message: '请选择庭室类型', trigger: 'blur' },
        ],
        superCourtIds:[
          { required: true, type: 'array', min: 1, message: '请勾选使用部门', trigger: 'change' },
          
        ],
        auto: [
          { required: true, type: 'string', message: '请选择是否自动排班', trigger: 'change' },
        ],
      }
    };
  },
  methods: {
    changeBox(e){
      console.log(e)
    },
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
      getCourtInfo(this.pageData).then(res=>{
        console.log(res);
        if(res.data.state==100){
          this.loading=false;
          let data = res.data.data;
          this.tableData = data.peopleAssessorList;
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
        total,
        tribunalType:this.pageData.tribunalType,
        name:this.pageData.name,
      }
    },
    clearSelectAll(){
      this.$refs.table.selectAll(false);
    },
    async showBox(type,id){//显示弹窗
      this.$Message.loading({
          content: '正在加载数据...',
          duration: 0
      });
      this.boxInfo.boxType=type;
      //获取部门信息
      await getAllDepartMentName().then(res=>{
        if(res.data.state==100){
          this.$Message.destroy();
          this.boxInfo.show=true;
          this.boxInfo.departMentList=res.data.data;
          console.log(this.boxInfo)
        }else{
          this.$Message.error(res.data.message);          
        } 
      });
      //增加
      if(type=='add'){
        this.boxInfo.title="添加新审判庭室";
        this.boxInfo.footerBtn1="添加";
        //清空数据绑定
        for(var key in this.courtInfo){
            this.courtInfo = {
              name:"",//审判庭室名称
              place:"",//场所所在地
              address:"",//详细地址
              tribunalType:"",//类型
              superCourtIds:[],//使用部门
              auto:'false',//是否自动排班
            }
        }
      }
      //修改
      if(type=='edit'){
        this.boxInfo.title="修改审判庭室信息";
        this.boxInfo.footerBtn1="保存修改";
        this.nowId=id;
        //获取该条信息
        this.tableData.forEach((item,index) => {
          if(item.id==this.nowId){
            // console.log("useCourt",item.useCourt)
            // console.log("departMentList",this.boxInfo.departMentList)
            //获取该条信息对应的使用部门id数组
            let superCourtIds = this.delUseCourt(item.useCourt,this.boxInfo.departMentList)
            this.courtInfo={
              name:item.name,//审判庭室名称
              place:item.place,//场所所在地
              address:item.address,//详细地址
              tribunalType:item.tribunalType,//类型
              superCourtIds,
              auto:item.auto.toString(),//是否自动排班
            };
          }
        });
      }
    },
    delUseCourt(useCourt,departMentList){//处理匹配要显示的使用部门数据
      let courtAry=useCourt.split(",");//分割字符串为数组
      courtAry.pop()//并去掉最后一项（后端返回的是 名称1,名称2,名称3,）
      let courtIds=[]
      departMentList.forEach((item,index) => {
        courtAry.forEach((item1,index1) => {
          if(item.name==item1){//查找符合名称的id
            courtIds.push(item.id)
          }
        });
      });
      console.log("courtIds",courtIds)
      return courtIds;
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
          if(this.boxInfo.boxType=="add"){
            addCourtInfo(data).then(res=>{
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
          if(this.boxInfo.boxType=="edit"){
            data.tribunalId=this.nowId;
            addCourtInfo(data).then(res=>{
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