<template>
  <div class="ft-magenttype-step1">
    <Table
      border
      style="margin-top:20px"
      ref="mEvidenceSelect"
      :loading="loading"
      :columns="mColumns"
      :data="mEvidenceKeyInfoList"
      v-show="mEviTableShow==1"
      @on-selection-change="mEvidenceHasSelect"
      @on-select="mEvidenceHasSelect"
    ></Table>
    <Row type="flex" justify="end" class="page" style="margin-top:10px;height:30px;">
        <Page :current="pageNumber" :total="total" :page-size="pageSize" @on-change="changePage" @on-page-size-change="changePageSize" placement='top' :page-size-opts="[10,20,50,100]" size="small" show-total show-elevator show-sizer></Page>
    </Row>
    <div style="margin-top:20px;float:left">
      <Checkbox
        class="ft-confirm-checkboxSingle"
        v-model="mEvidenceStatus"
        @on-change="mEvidenceSelect"
      >全选/取消所有数据</Checkbox>
    </div>
    <div
      class="ft-agent-footer"
      style="margin-top:50px;text-align:center"
    >
      <a href="javascript:void(0)" class="ft-magent-btn4" @click="mSendBacktoStep4" v-if="isUpStepShow">返回上一步</a>
      <a
        href="javascript:void(0)"
        class="ft_public3 ft-agent-btn1 ft-magent-btn1"
        @click="mEvidence_removeMany"
      >移除所选案件</a>
      <a
        href="javascript:void(0)"
        class="ft_public3 ft-magent-btn2"
        @click="mEvidence_addMany"
      >继续添加新案件</a>
      <a
        href="javascript:void(0)"
        class="ft_public3 nextStep"
        @click="mEvidence_next"
      >下一步,送达事项确认</a>
    </div>
  </div>
</template>


<script>
import { ftAddCaseMuti,delLawCase } from "@/api/setcase.js";
import {
  findLawCaseList,
} from "@/api/case";

export default {
  data() {
    return {
      mEvidenceKeyInfoList: [], //表格绑定数据
      mEviTableShow: 1, //表格显示状态
      mEvidenceStatus: false, //全选反选状态
      mEvidenceHasSelectList: [], //已经要素列表
      isUpStepShow:true,//是否显示上一步按钮
      pageNumber: 1,//当前第几页
      pageSize: 10,//每页几条
      total: 0,//总条数
      loading: false,//表格加载状态
      mColumns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "本表序号",
          align: "center",
          width: 100,
          render: (h, params) => {
            return h("span", params.index+1);
          }
        },
        {
          title: "案号",
          align: "center",
          render: (h, params) => {
            return h("span", params.row.caseNo ? params.row.caseNo :"暂无");
          }
        },
        {
          title: "案由",
          align: "center",
          render: (h, params) => {
            return h("span", params.row.briefName ? params.row.briefName :"暂无");
          }
        },
        {
          title: "原告姓名",
          align: "center",
          render: (h, params) => {
            return h("span", params.row.plaintiffName ? params.row.plaintiffName :"暂无");
          }
        },
        {
          title: "被告姓名",
          align: "center",
          render: (h, params) => {
            return h("span", params.row.defendantName ? params.row.defendantName :"暂无");
          }
        },
        {
          title: "操作",
          align: "center",
          render: (h, params) => {
            return h("div", [
              // h(
              //   "span",
              //   {
              //     style: { color: "#4873C5", cursor: "pointer",marginRight:"10px" },
              //     on: {
              //       click: () => {}
              //     }
              //   },
              //   "查看详情"
              // ),
              h(
                "span",
                {
                  style: { color: "#F54C4C", cursor: "pointer" },
                  on: {
                    click: () => {
                      let ids=[];
                      ids.push(params.row.lawCaseId)
                      this.mEvidenceRemoveNowRow(ids);
                    }
                  }
                },
                "直接移除"
              )
            ]);
          }
        }
      ]
    };
  },
  watch: {
    mEvidenceKeyInfoList: {
      handler: function(newValue, oldValue) {
        //dom已更新后执行
        this.$nextTick(() => {
          this.mEvidenceStatus = true; //全选
          this.$refs.mEvidenceSelect.selectAll(this.mEvidenceStatus);
        });
      },
      deep: true
    }
  },
  methods: {
    changePage(v) {//页码改变
      this.pageNumber = v;
      this.getBackCaseList();
    },
    changePageSize(v) {//
      this.pageSize = v;
      this.getBackCaseList();
    },
    getBackCaseList(){//获取暂存信息并显示
      //设置请求参数
      let params = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        submitType:"暂存",//提交类型 已提交/暂存 法院端的统一都是已提交
        type:"所有案件",  //案件类型，枚举类型 已分案
      };
      this.loading=true;
      //获取暂存案件
      findLawCaseList(params).then(res => {
        this.loading = false;
        if (res.data.state == 100) {
          let data=res.data.data;
          this.mEvidenceKeyInfoList = data.lawCaseList;
          this.total = data.total;
        }else{
          this.$Message.info(res.data.message);
        }
      });
    },
    setBackCaseList(res){
      let data=res.data.data;
      this.mEvidenceKeyInfoList = data.lawCaseList;
      this.total = data.total;
      this.isUpStepShow=false;
    },
    //接收上一步骤的list
    mreReceiveList(payload) {
      console.log("66666",payload)
      this.mEviTableShow = 1;
      // this.mEvidenceKeyInfoList = payload;
    },
    //按钮触发全选和反选
    mEvidenceSelect() {
      this.$refs.mEvidenceSelect.selectAll(this.mEvidenceStatus);
    },

    //全选反选
    mEvidenceHasSelect(event) {
      console.log(event);
      this.mEvidenceHasSelectList = event;
    },

    //移除案件
    mEvidenceRemoveNowRow(ids) {
      if(ids.length==0){
        this.$Notice.warning({ title: "请勾选案件" });
        return
      }    
      this.$Modal.confirm({
        title: '删除提示',
        content: '<p>确认是否删除？</p>',
        loading: true,
        onOk: () => {
          this.$Modal.remove();//关闭
          //发送删除请求
          delLawCase(ids).then(res => {
            if (res.data.state == 100) {
              this.$Message.success(res.data.message);
              this.getBackCaseList();
            }else{
              this.$Message.info(res.data.message);
            }
          });
        }
      });
    },
    //查看当条案件
    mEvidenceLook() {},
    //批量删除案件
    mEvidence_removeMany() {
      let ids=[];
      for (let j = 0; j < this.mEvidenceHasSelectList.length; j++) {
          ids.push(this.mEvidenceHasSelectList[j].lawCaseId);
      }
      this.mEvidenceRemoveNowRow(ids);
    },

    //继续添加新案件
    mEvidence_addMany() {
      this.isUpStepShow=true;
      this.$emit('toNextStep',{type:'浏览与暂存',state:'continue'});
    },

    //返回上一步
    mSendBacktoStep4() {
      this.$emit('toNextStep',{type:'浏览与暂存',state:'back'});
    },

    //下一步
    mEvidence_next() {
      if(this.mEvidenceHasSelectList.length==0){
        this.$Notice.warning({ title: "请勾选案件" });
        return
      }
      this.$emit('toNextStep',{type:'浏览与暂存',state:'next',selectList:this.mEvidenceKeyInfoList});
    },
  }
};
</script>
<style scoped>
  .nextStep{
    background: #40a9ff;
    color: #fff;
    margin-left: 32px;
    margin-top: 40px;
  }
</style>

