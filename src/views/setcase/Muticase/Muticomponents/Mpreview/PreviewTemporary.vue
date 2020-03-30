<template>
  <div class="ft-magenttype-step1">
    <Table
      border
      style="margin-top:20px"
      ref="mEvidenceSelect"
      :columns="mColumns"
      :data="mEvidenceKeyInfoList"
      v-show="mEviTableShow==1"
      @on-selection-change="mEvidenceHasSelect"
      @on-select="mEvidenceHasSelect"
    ></Table>
    <div style="margin-top:20px">
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
      <a href="javascript:void(0)" class="ft-magent-btn4" @click="mSendBacktoStep4">返回上一步</a>
      <a
        href="javascript:void(0)"
        class="ft_public3 ft-agent-btn1 ft-magent-btn1"
        @click="mEvidence_removeMany"
      >移除所选案件</a>
      <a
        href="javascript:void(0)"
        class="ft_public3 ft-magent-btn2"
        @click="mEvidence_addMany"
      >提交</a>
    </div>
  </div>
</template>


<script>
import { ftAddCaseMuti } from "@/api/setcase.js";
export default {
  data() {
    return {
      mEvidenceKeyInfoList: [], //表格绑定数据
      mEviTableShow: 1, //表格显示状态
      mEvidenceStatus: false, //全选反选状态
      mEvidenceHasSelectList: [], //已经要素列表
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
            return h("span", params.row.caseInfo.ids);
          }
        },
        {
          title: "批次-流水号",
          align: "center",
          key: "orderNo"
        },
        {
          title: "案号",
          align: "center",
          render: (h, params) => {
            return h("span", params.row.caseInfo.caseNo ? params.row.caseInfo.caseNo :"暂无");
          }
        },
        {
          title: "案由",
          align: "center",
          key: "orderNo",
          render: (h, params) => {
            let brifName="";
            switch (params.row.caseInfo.lawCaseType) {
              case "2":
                brifName="保证保险合同追偿"
              break;
              case "1":
                brifName="金融借款合同纠纷"
              break;
              case "3":
                brifName="信用卡纠纷"
              break;
            }
            return h("span", brifName ? brifName :"暂无");
          }
        },
        {
          title: "原告姓名",
          align: "center",
          render: (h, params) => {
            return h("span", params.row.caseInfo.plaintiffs[0].name);
          }
        },
        {
          title: "被告姓名",
          align: "center",
          render: (h, params) => {
            let arrTemp = [];
            let strTemp = "";
            params.row.caseInfo.defendants.forEach(val => {
              arrTemp.push(val.name);
            });
            strTemp = arrTemp.join(";");
            return h("span", strTemp);
          }
        },
        {
          title: "操作",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: { color: "#F54C4C", cursor: "pointer" },
                  on: {
                    click: () => {
                      this.mEvidenceRemoveNowRow(params.row.orderNo);
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
    //接收上一步骤的list
    mreReceiveList(mKeyInfoList) {
      console.log("66666",mKeyInfoList)
      this.mEviTableShow = 1;
      this.mEvidenceKeyInfoList = mKeyInfoList;
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

    //移除当条案件
    mEvidenceRemoveNowRow(orderNo) {
      for (let index = 0; index < this.mEvidenceKeyInfoList.length; index++) {
        if (orderNo === this.mEvidenceKeyInfoList[index].orderNo) {
          this.mEvidenceKeyInfoList.splice(index, 1);
        }
      }
    },
    //批量删除案件
    mEvidence_removeMany() {
      for (let i = 0; i < this.mEvidenceKeyInfoList.length; i++) {
        for (let j = 0; j < this.mEvidenceHasSelectList.length; j++) {
          if (
            this.mEvidenceKeyInfoList[i].orderNo ===
            this.mEvidenceHasSelectList[j].orderNo
          ) {
            this.mEvidenceKeyInfoList.splice(i, 1);
          }
        }
      }
    },
    //提交案件
    mEvidence_addMany() {
      console.log("ccc", this.mEvidenceHasSelectList);
      //判断选中的数组
      if (this.mEvidenceHasSelectList.length === 0) {
        this.$Notice.error({ title: "请勾选案件" });
      } else {
        //加载中提示
        this.$Spin.show({
          render: (h) => {
              return h('div', [
                  h('Icon', {
                      'class': 'demo-spin-icon-load',
                      props: {
                          type: 'load-c',
                          size: 50
                      }
                  }),
                  h('div', {
                    style:{
                      fontSize: '30px',
                    }
                  },'案件提交中，请稍后...')
              ])
          }
        });
        //提交案件
        ftAddCaseMuti(this.mEvidenceHasSelectList)
        .then(res=>{
          if(res.data.state === 100) {
            this.$Spin.hide();
            this.$Notice.success({'title':'提交成功'})
            this.$emit("mEvitoStep6", this.mEvidenceHasSelectList);
          }else{
            this.$Spin.hide();
            this.$Notice.error({
                title: '',
                desc: res.data.message,
                duration: 5
            });
          }
        })
        .catch(rep=>{
          this.$Spin.hide();
          this.$Notice.error({'title':'服务器出现错误，请稍后重试'});
        })
      }
    },

    //返回上一步
    mSendBacktoStep4() {
      this.$emit("mSendBacktoStep4");
    }
  }
};
</script>
