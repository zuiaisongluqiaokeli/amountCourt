<template>
  <div>
    <Form ref="searchForm" :model="searchForm" inline :label-width="80" class="search-form">
      <Form-item label="承办法官">
        <Select
          v-model="searchForm.people"
          clearable
          filterable
          placeholder="请选择"
          @on-change="selJudge"
          style="width: 160px"
        >
          <Option v-for="(item) in judgeList" :value="item.id">{{item.name}}</Option>
        </Select>
      </Form-item>
      <Form-item label="书记员">
        <Select
          v-model="searchForm.clerk"
          clearable
          filterable
          placeholder="请选择"
          @on-change="selClerk"
          style="width: 160px"
        >
          <Option v-for="(item) in clerkList" :value="item.id">{{item.name}}</Option>
        </Select>
      </Form-item>
      <Form-item label="法官助理">
        <Select
          v-model="searchForm.selassistant"
          clearable
          filterable
          placeholder="请选择"
          @on-change="selassistant"
          style="width: 160px"
        >
          <Option v-for="(item) in assistantJudgeList" :value="item.id">{{item.name}}</Option>
        </Select>
      </Form-item>
    </Form>
    <Alert type="warning" v-show="isError" show-icon closable>
      <span>成功案件个数：{{successNumber}}</span>
      <br>
      <span>失败案件个数：{{failedNumber}}</span>
      <br>
      <span>失败原因：{{reason}}</span>
    </Alert>
    <div style="margin-bottom:25px">
      <Row class="tables">
        <Col span="24">
          <Table
            size="small"
            stripe
            :height="listData.length > 10 ? minHeight : ''"
            :loading="loading"
            border
            :columns="columns"
            :data="listData"
            ref="table"
            sortable="custom"
            @on-selection-change="changeSelect"
          ></Table>
        </Col>
      </Row>
    </div>
    <div class="button-clas" style="text-align:center;">
      <Button
        size="large"
        :loading="buttonLoading"
        @click="save"
        style="background:#2083D8;color:#fff;font-size:16px;width:128px;"
      >确认分案</Button>
      <Button
        size="large"
        @click="nextStep('排庭')"
        v-show="stepShow"
        style="background:#2083D8;color:#fff;font-size:16px;width:128px;"
      >下一步(排庭)</Button>
      <Button
        size="large"
        @click="cancel"
        style="background:#F54C4C;color:#fff;padding: 6px 31px;font-size:16px;width:128px;"
      >取消</Button>
    </div>
  </div>
</template>
<script>
import {
  courtList,
  judgeList,
  assistantJudgeList,
  clerkList
} from "@/api/global";
import { distributionJudge, judgeLinkage } from "@/api/batch";
import Vue from "vue";
export default {
  props: {
    listDatas: Array
  },
  data() {
    return {
      searchForm: {
        // brief:'金融借款合同纠纷'
      },
      selRow: {},
      loading: false,
      buttonLoading: false,
      isError: false,
      successNumber: "",
      failedNumber: "",
      reason: "",
      courtList: [], //法院列表
      judgeList: [], //承办法官列表
      clerkList: [], //承办书记员列表
      assistantJudgeList: [], //法官助理列表
      stepShow:false,
      minHeight: 450,
      columns: [
        {
          title: "序号",
          type: "index",
          width: 55,
          align: "center"
        },
        {
          title: "批次-流水号",
          key: "flowNumber",
          width: 160,
          align: "center"
        },
        // {
        //     title: "网申号",
        //     key: "netApplicationNo",
        //     width: 160,
        //     align: "center",
        // },
        {
          title: "案号",
          key: "caseNo",
          width: 160,
          align: "center"
        },
        {
          title: "原告",
          key: "plaintiffName",
          align: "center"
        },
        {
          title: "原告代理人",
          key: "plaintiffLawyerName",
          align: "center"
        },
        {
          title: "被告",
          key: "defendantName",
          align: "center"
        },
        {
          title: "标的",
          key: "phone",
          width: 120,
          align: "center",
          // fixed:'right',
          render: (h, params) => {
            return h("span", params.row.applyStandard + " 元");
          }
        },
        {
          title: "案由",
          key: "phone",
          width: 130,
          align: "center",
          // fixed:'right',
          render: (h, params) => {
            return h(
              "span",
              params.row.briefName ? params.row.briefName : "无"
            );
          }
        },
        {
          title: "承办部门",
          key: "phone",
          width: 130,
          align: "center",
          // fixed:'right',
          render: (h, params) => {
            return h(
              "span",
              params.row.courtName ? params.row.courtName : "无"
            );
          }
        },
        {
          title: "承办法官",
          key: "phone",
          width: 110,
          align: "center",
          // fixed:'right',
          render: (h, params) => {
            return h(
              "Select",
              {
                props: {
                  value: this.listData[params.index].judgeId,
                  filterable: "filterable",
                  clearable: "clearable",
                  transfer: "transfer"
                },
                on: {
                  "on-change": value => {
                    this.listData[params.index].judgeId = value;
                    //获取法官姓名
                    for(let j=0;j<this.judgeList.length;j++){
                        if(this.listData[params.index].judgeId==this.judgeList[j].id){
                            this.listData[params.index].judgeName=this.judgeList[j].name
                            this.$set(this.listData,index,this.listData[params.index])
                        }
                    }
                  }
                }
              },
              this.judgeList.map(item => {
                return h(
                  "Option",
                  {
                    props: { value: item.id }
                  },
                  item.name
                );
              })
            );
          }
        },
        {
          title: "书记员",
          key: "phone",
          width: 110,
          align: "center",
          // fixed:'right',
          render: (h, params) => {
            return h(
              "Select",
              {
                props: {
                  value: this.listData[params.index].clerkId,
                  filterable: "filterable",
                  clearable: "clearable",
                  transfer: "transfer"
                },
                on: {
                  "on-change": value => {
                    this.listData[params.index].clerkId = value;
                    //获取书记员姓名
                    for(let j=0;j<this.clerkList.length;j++){
                        if(this.listData[params.index].clerkId==this.clerkList[j].id){
                            this.listData[params.index].clerkName=this.clerkList[j].name
                            this.$set(this.listData,index,this.listData[params.index])
                        }
                    }
                  }
                }
              },
              this.clerkList.map(item => {
                return h(
                  "Option",
                  {
                    props: { value: item.id }
                  },
                  item.name
                );
              })
            );
          }
        },
        {
          title: "法官助理",
          key: "phone",
          width: 110,
          align: "center",
          // fixed:'right',
          render: (h, params) => {
            return h(
              "Select",
              {
                props: {
                  value: this.listData[params.index].assistId,
                  filterable: "filterable",
                  clearable: "clearable",
                  transfer: "transfer"
                },
                on: {
                  "on-change": value => {
                    this.listData[params.index].assistId = value;
                    //获取法官助理姓名
                    for(let j=0;j<this.assistantJudgeList.length;j++){
                        if(this.listData[params.index].assistId==this.assistantJudgeList[j].id){
                            this.listData[params.index].assistName=this.assistantJudgeList[j].name
                            this.$set(this.listData,index,this.listData[params.index])
                        }
                    }
                  }
                }
              },
              this.assistantJudgeList.map(item => {
                return h(
                  "Option",
                  {
                    props: { value: item.id }
                  },
                  item.name
                );
              })
            );
          }
        }

        // {
        //     title: "诉讼费",
        //     key: "phone",
        //     width: 100,
        //     fixed:'right',
        //     render: (h, params) => {
        //         return h('Input', {
        //             props:{
        //                 value:params.row.litigationCost,
        //                 autosize: true
        //             },
        //             attrs: {
        //                 id: 'rwmc'+params.index//保证每个输入框的id唯一
        //             },
        //             on: {
        //                 'on-focus': () => {
        //                     this.$nextTick(()=>{
        //                         document.getElementById('rwmc'+params.index).
        //                         childNodes.forEach(item=>{
        //                             if(item.tagName == 'INPUT'){
        //                                 item.focus();
        //                             }
        //                         })
        //                     })
        //                 },
        //                 'on-blur': (event) => {
        //                     for(let i=0;i<this.listData.length;i++){
        //                         if(this.listData[i].id == params.row.id){
        //                             this.listData[i].litigationCost = event.target.value;
        //                         }
        //                     }
        //                 }
        //             }
        //         })
        //     }
        // },
        // {
        //     title: "适用程序",
        //     key: "phone",
        //     width: 100,
        //     fixed:'right',
        //     render: (h, params) => {
        //         return h('Select', {
        //             props:{
        //                 value: this.listData[params.index].ProcedureType,
        //                 filterable:'filterable',
        //                 clearable:'clearable',
        //                 transfer:'transfer'
        //             },
        //             on: {
        //                 'on-change':(value) => {
        //                     this.listData[params.index].ProcedureType = value;
        //                 }
        //             },
        //         },[
        //             h("Option",{
        //                 props: {value: '简易程序'},

        //             },"简易程序"),
        //             h("Option",{
        //                 props: {value: '普通程序'},

        //             },"普通程序"),
        //              h("Option",{
        //                 props: {value: '小额诉讼程序'},

        //             },"小额诉讼程序"),
        //         ]
        //         )
        //     }
        // },
      ],
      listData: this.listDatas
    };
  },
  props: {
    listDatas: Array
  },
  methods: {
    handleSearch() {},
    changeSelect() {},
    save() {
      console.log(this.listData);
      let ary = [];
      this.listData.map(item => {
        const data = {
          lawCaseId: item.lawCaseId.toString(), //案件id
          judgeId: item.judgeId ? item.judgeId.toString() : "", //法官id
          clerkId: item.clerkId ? item.clerkId.toString() : "", //书记 代理书记员id
          assistId: item.assistId ? item.assistId.toString() : "" //法官助理id
        };
        ary.push(data);
      });
      this.isError = false;
      this.buttonLoading = true;
      distributionJudge(ary).then(res => {
        this.buttonLoading = false;
        if (res.data.state == 100) {
            //显示下一步
            this.stepShow=true;
            this.$Notice.success({
                title: "",
                desc: res.data.message,
                duration: 3
            });
            //   this.$emit("cancelEvent", 1);
            // this.nextStep('排庭')//如果成功直接接入下一步
            this.reSetList(this.listData)//重置父组件数据
        } else {
            this.isError = true;
            this.successNumber = res.data.data.success;
            this.failedNumber = res.data.data.error;
            this.reason = res.data.message;
            //隐藏下一步
            this.stepShow=false;
            //剔除成功案件，显示错误案件
            let errorAry = [];
            let successAry=[];
            for(let i=0;i<this.listData.length;i++){
                var mark=0;
                for(let j=0;j<res.data.data.errorIdList.length;j++){
                    if(res.data.data.errorIdList[j] == this.listData[i].lawCaseId){
                        mark=1
                        errorAry.push(this.listData[i])//错误案件
                    }
                }
                if(mark==0){
                    successAry.push(this.listData[i])//正确案件
                }
            }
            this.listData = errorAry;//显示错误案件
            this.reSetList(successAry)//重置成功的数据到父组件
        }
      });
    },
    /**
     * 选择承办法官
     */
    selJudge(id) {
      for (let i = 0; i < this.listData.length; i++) {
        //获取法官id
        this.listData[i].judgeId = id;
        //获取法官姓名
        for(let j=0;j<this.judgeList.length;j++){
          if(this.listData[i].judgeId==this.judgeList[j].id){
             this.listData[i].judgeName=this.judgeList[j].name
          }
        }
        Vue.set(this.listData, i, this.listData[i]);
      }
      if (id == "") {
        return false;
      }
      judgeLinkage(id).then(res => {
        if (res.data.state == 100) {
          if (res.data.data.clerk != "") {
            //获取书记员id
            this.searchForm.clerk = res.data.data.clerk;
            this.selClerk(res.data.data.clerk);
            // //获取书记员名称
            for (let i = 0; i < this.listData.length; i++) {
                for(let j=0;j<this.clerkList.length;j++){
                    if(this.listData[i].clerkId==this.clerkList[j].id){
                        this.listData[i].clerkName=this.clerkList[j].name
                        Vue.set(this.listData, i, this.listData[i]);
                    }
                }
            }
          }
          if (res.data.data.assistant != "") {
            //获取法官助理id
            this.searchForm.selassistant = res.data.data.assistant;
            this.selassistant(res.data.data.assistant);
            // //获取法官助理名称
            for (let i = 0; i < this.listData.length; i++) {
                for(let j=0;j<this.assistantJudgeList.length;j++){
                    if(this.listData[i].assistId==this.assistantJudgeList[j].id){
                        this.listData[i].assistName=this.assistantJudgeList[j].name
                        Vue.set(this.listData, i, this.listData[i]);
                    }
                }
            }
          }
        }
      });
    },
    /**
     * 选择书记员
     */
    selClerk(id) {
      for (let i = 0; i < this.listData.length; i++) {
        this.listData[i].clerkId = id;
        Vue.set(this.listData, i, this.listData[i]);
      }
    },
    /**
     * 选择法官助理
     */
    selassistant(id) {
      for (let i = 0; i < this.listData.length; i++) {
        this.listData[i].assistId = id;
        Vue.set(this.listData, i, this.listData[i]);
      }
    },
    nextStep(type){//下一步
      this.$emit('nextStep',type)
    },
    reSetList(list){//重置父组件数据
      this.$emit('reSetList',list)      
    },
    getList() {
      this.listData = this.listDatas;
      this.buttonLoading = false;
      this.searchForm.caseno = "";
      this.searchForm.people = "";
      this.searchForm.clerk = "";
      this.searchForm.selassistant = "";
      judgeList().then(res => {
        if (res.data.state == 100) {
          this.judgeList = res.data.data;
        }
      });
      clerkList().then(res => {
        if (res.data.state == 100) {
          this.clerkList = res.data.data.clerk;
        }
      });
      assistantJudgeList().then(res => {
        if (res.data.state == 100) {
          this.assistantJudgeList = res.data.data.judgeAssistant;
        }
      });

      // for(let i=0;i<this.listData.length;i++){
      //     this.listData[i].briefName = '金融借款合同纠纷';
      //     this.listData[i].courtId = this.searchForm.mkk;
      //     Vue.set(this.listData, i, this.listData[i]);
      // }
    },
    cancel() {
      this.$emit("cancelEvent");
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    resetData () { // 更新时调用
      Object.assign(this.$data, this.$options.data.call(this));
    },
  }
};
</script>

