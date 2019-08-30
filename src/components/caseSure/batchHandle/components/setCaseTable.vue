<template>
  <div>
    <!-- 搜索栏 -->
    <Form ref="searchForm" :model="searchForm" inline :label-width="80" class="search-form">
      <FormItem label="案由" prop="brief">
        <Select
          v-model="searchForm.brief"
          @on-change="selBrief"
          clearable
          filterable
          disabled
          placeholder="请选择"
          style="width: 170px"
        >
          <Option v-for="(item,index) in briefList" :value="item.id" :key="index">{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem label="承办部门" prop="mkk">
        <Select
          v-model="searchForm.mkk"
          clearable
          filterable
          placeholder="请选择"
          @on-change="selCourt"
          style="width: 170px"
        >
          <Option v-for="(item,index) in courtList" :value="item.id" :key="index">{{item.name}}</Option>
        </Select>
      </FormItem>
      <!-- <Form-item label="承办法官">
            <Select v-model="searchForm.people" clearable filterable placeholder="请选择"  @on-change="selJudge" clearable style="width: 160px">
                <Option v-for="(item) in judgeList" :value="item.id">{{item.name}}</Option>
            </Select>
      </Form-item>-->
      <!-- <Form-item label="书记员">
            <Select v-model="searchForm.clerk" clearable filterable placeholder="请选择"  @on-change="selClerk" clearable style="width: 160px">
                <Option v-for="(item) in clerkList" :value="item.id">{{item.name}}</Option>
            </Select>
        </Form-item>
        <Form-item label="法官助理">
            <Select v-model="searchForm.selassistant" clearable filterable placeholder="请选择"  @on-change="selassistant" clearable style="width: 160px">
                <Option v-for="(item) in assistantJudgeList" :value="item.id">{{item.name}}</Option>
            </Select>
      </Form-item>-->
      <!-- <Form-item label="案号分配">
            <Select v-model="searchForm.caseno" clearable filterable placeholder="请选择" @on-change="selCaseNo" style="width: 160px">
      <Option value="自动分配">自动分配</Option>-->
      <!-- <Option value="1">男</Option> -->
      <!-- </Select>
      </Form-item>-->
      <FormItem label="适用程序" prop="Procedure">
        <Select
          v-model="searchForm.Procedure"
          clearable
          filterable
          placeholder="请选择"
          @on-change="selProcedure"
          style="width: 160px"
        >
          <Option value="简易程序">简易程序</Option>
          <Option value="普通程序">普通程序</Option>
          <Option value="小额诉讼程序">小额诉讼程序</Option>
        </Select>
      </FormItem>
      <Form-item label="起始案号">
        <Form ref="contrTypeTabList" :model="contrTypeTabList" inline>
          <Form-item>
            <Input
              placeholder="例：(年份)闽(0203)民初"
              class="reg_groupSelect reg_groupSelectwidth"
              v-model="contrTypeTabList.numFormat"
              @on-keyup="numFormatChange"
            ></Input>
          </Form-item>
          <Form-item prop="startCaseNo">
            <Input
              placeholder="自然数"
              class="reg_groupSelect"
              v-model="contrTypeTabList.startCaseNo"
              @on-keyup="numFormatChange1"
            ></Input>
          </Form-item>
          <Form-item>
            <span>--</span>
          </Form-item>
          <Form-item prop="endCaseNo">
            <Input
              placeholder="自然数"
              class="reg_groupSelect"
              v-model="contrTypeTabList.endCaseNo"
              :disabled="true"
            ></Input>
          </Form-item>
          <Form-item>
            <span>号</span>
          </Form-item>
          <Form-item>
            <Checkbox v-model="isDown" size="large" @on-change="numFormatChange1">倒序</Checkbox>
          </Form-item>
        </Form>
      </Form-item>
    </Form>
    <!-- 提交结果显示 -->
    <Alert type="warning" v-show="isError" show-icon closable>
      <span>成功案件个数：{{successNumber}}</span>
      <br />
      <span>失败案件个数：{{failedNumber}}</span>
      <br />
      <span>失败原因：{{reason}}</span>
    </Alert>
    <!-- 表格 -->
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
    <!-- 按钮 -->
    <div class="button-clas" style="text-align:center;">
      <Button
        size="large"
        :loading="buttonLoading"
        @click="save"
        style="background:#2083D8;color:#fff;font-size:16px;width:128px;"
      >确认立案</Button>
      <Button
        size="large"
        @click="nextStep('分案')"
        v-show="stepShow"
        style="background:#2083D8;color:#fff;font-size:16px;width:128px;"
      >下一步(分案)</Button>
      <Button
        size="large"
        @click="cancel"
        style="background:#F54C4C;color:#fff;padding: 6px 31px;font-size:16px;width:128px;"
      >取消</Button>
    </div>
    <!-- 模态框 -->
    <div
      class="noneShow"
      v-show="modal3"
      style="width:200px;position: absolute;top: 20px;z-index: 99999;left: 50%;margin-left: -100px;background: #fff;border-radius: 15px;"
    >
      <div class="ivu-modal-header">
        <div class="ivu-modal-header-inner">单个案件选择承办部门</div>
      </div>
      <div class="ivu-modal-body">
        <Select
          v-model="searchForm.mkks"
          clearable
          filterable
          placeholder="请选择"
          @on-change="selCourt2"
          style="width: 170px"
        >
          <Option v-for="(item,index) in courtList" :value="item.id" :key="index">{{item.name}}</Option>
        </Select>
      </div>
      <div class="ivu-modal-footer">
        <Button @click="modal3 = false;modal2back = false" type="dashed" size="large">关闭</Button>
      </div>
    </div>
    <div
      class="noneShow"
      v-show="modal2"
      style="width:200px;position: absolute;top: 20px;z-index: 99999;left: 50%;margin-left: -100px;background: #fff;border-radius: 15px;"
    >
      <div class="ivu-modal-header">
        <div class="ivu-modal-header-inner">单个案由选择</div>
      </div>
      <div class="ivu-modal-body">
        <Select
          v-model="searchForm2.briefs"
          @on-change="selBrief2"
          clearable
          filterable
          placeholder="请选择"
          style="width: 170px"
        >
          <Option v-for="(item,index) in briefList" :value="item.id" :key="index">{{item.name}}</Option>
        </Select>
      </div>
      <div class="ivu-modal-footer">
        <Button @click="modal2 = false;modal2back = false" type="dashed" size="large">关闭</Button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getBrief,
  courtList,
  judgeList,
  caseNoList,
  assistantJudgeList,
  clerkList
} from "@/api/global";
import { distribution, litigationFeeCalculation } from "@/api/batch";
import { delSpace } from "@/libs/tools.js";
import Vue from "vue";
export default {
  props: {
    listDatas: Array
  },
  data() {
    return {
      //案由，承办部门，适应程序
      searchForm: {
        brief: "",
        mkk: "",
        Procedure: ""
      },
      //案号
      contrTypeTabList: {
        numFormat: "(2019)闽0203民初", //字号格式
        startCaseNo: "", //当前字号
        endCaseNo: "" //当前字号
      },
      searchForm2: {}, //单个案由选择
      isDown: false, //案号是否倒序分配
      selRow: {},
      loading: false,
      buttonLoading: false,
      isError: false,
      successNumber: "", //成功个数
      failedNumber: "", //失败个数
      reason: "", //失败原因
      briefList: [], //案由列表
      courtList: [], //法院列表
      // judgeList:[],   //承办法官列表
      // clerkList:[],   //承办书记员列表
      // assistantJudgeList:[],  //法官助理列表
      stepShow: false, //显示下一步
      modal2back: false,
      modal2: false,
      modal3: false,
      minHeight: 450,
      columns: [
        {
          title: "序号",
          type: "index",
          align: "center"
        },
        {
          title: "批次-流水号",
          key: "flowNumber",
          align: "center"
        },
        {
          title: "网申号",
          key: "netApplicationNo",
          align: "center"
        },
        {
          title: "原告",
          key: "plaintiffName",
          // width: 200,
          align: "center"
        },
        {
          title: "原告代理人",
          key: "plaintiffLawyerName",
          // width: 120,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {},
              params.row.plaintiffLawyerName? params.row.plaintiffLawyerName: "暂无"
            );
          }
        },
        {
          title: "被告",
          key: "defendantName",
          align: "center"
        },
        {
          title: "标的",
          key: "applyStandard",
          align: "center",
          // fixed:'right',
          render: (h, params) => {
            return h(
              "div",
              {
                style: {
                  display: "flex",
                  alignItems: "center"
                  // textAlign:"center"
                }
              },
              [
                h("Input", {
                  props: {
                    value: params.row.applyStandard,
                    autosize: true
                  },
                  attrs: {
                    id: "rwmc" + params.index //保证每个输入框的id唯一
                  },
                  on: {
                    "on-focus": () => {
                      this.$nextTick(() => {
                        document
                          .getElementById("rwmc" + params.index)
                          .childNodes.forEach(item => {
                            if (item.tagName == "INPUT") {
                              item.focus();
                            }
                          });
                      });
                    },
                    "on-blur": event => {
                      console.log(event.target.value);
                      if (
                        event.target.value ==
                          this.listData[params.index].applyStandard ||
                        event.target.value == "" ||
                        event.target.value <= 0
                      ) {
                        return false;
                      }
                      this.listData[params.index].applyStandard =
                        event.target.value;
                      let ary = [];
                      const data = {
                        type: 1,
                        lawCaseId: this.listData[
                          params.index
                        ].lawCaseId.toString(),
                        basicCost: "0.0",
                        property: "0.0",
                        applyStandard: this.listData[
                          params.index
                        ].applyStandard.toString()
                      };
                      ary.push(data);
                      let ds = {
                        lawCaseList: ary
                      };
                      //请求诉讼费计算的接口
                      litigationFeeCalculation(ds).then(res => {
                        this.loading = false;
                        if (res.data.state == 100) {
                          let list = res.data.data;
                          this.listData[params.index].litigationCost =
                            list[0].discount;
                        }
                        Vue.set(
                          this.listData,
                          params.index,
                          this.listData[params.index]
                        );
                      });
                    }
                  }
                })
                // h('span', {},"元"),
                // h('span', {}, params.row.applyStandard ? params.row.applyStandard + " 元" : "暂无"),
              ]
            );
          }
        },
        {
          title: "案由",
          key: "phone",
          align: "center",
          // fixed:'right',
          render: (h, params) => {
            return (
              "div",
              [
                h(
                  "span",
                  {
                    // props: {
                    //   // href:'javascript:void(0)',
                    // },
                    // style: {
                    //   color: "#2d8cf0",
                    //   cursor: "pointer"
                    // },
                    // on: {
                    //   click: () => {
                    //     console.log(1115);
                    //     this.modal2 = true;
                    //     this.modal2back = true;
                    //     this.selRow = this.listData[params.index];
                    //     this.searchForm2.briefs = this.selRow.briefId
                    //       ? this.selRow.briefId
                    //       : "";
                    //     console.log(this.modal2back);
                    //     // return false;
                    //   }
                    // }
                  },
                  this.listData[params.index].briefName
                    ? this.listData[params.index].briefName
                    : "暂无"
                )
              ]
            );
          }
        },
        {
          title: "承办部门",
          key: "phone",
          align: "center",
          // fixed:'right',
          render: (h, params) => {
            return (
              "div",
              [
                h(
                  "span",
                  {
                    props: {
                      // href:'javascript:void(0)',
                    },
                    style: {
                      color: "#2d8cf0",
                      cursor: "pointer"
                    },
                    on: {
                      click: () => {
                        this.modal3 = true;
                        this.modal2back = true;
                        this.selRow = this.listData[params.index];
                        this.searchForm2.mkks = this.selRow.courtId
                          ? this.selRow.courtId
                          : "";
                        console.log(this.selRow.courtId);
                        console.log(this.modal2back);
                        // return false;
                      }
                    }
                  },
                  this.listData[params.index].courtName
                    ? this.listData[params.index].courtName
                    : "请选择"
                )
              ]
            );

            // return h('Select', {
            //     props:{
            //         value: this.listData[params.index].courtId,
            //         filterable:'filterable',
            //         clearable:'clearable',
            //         transfer:'transfer'
            //     },
            //     on: {
            //         'on-change':(value) => {
            //             this.listData[params.index].courtId = value;
            //         }
            //     },
            // },
            // this.courtList.map(item => {
            //     return h('Option', {
            //         props: {value: item.id}
            //     }, item.name);
            // })
            // )
          }
        },
        {
          title: "案号",
          key: "phone",
          align: "center",
          // fixed:'right',
          render: (h, params) => {
            return h("Input", {
              props: {
                value: params.row.caseNo,
                autosize: true
              },
              attrs: {
                id: "rwmca" + params.index //保证每个输入框的id唯一
              },
              on: {
                "on-focus": () => {
                  this.$nextTick(() => {
                    document
                      .getElementById("rwmca" + params.index)
                      .childNodes.forEach(item => {
                        if (item.tagName == "INPUT") {
                          item.focus();
                        }
                      });
                  });
                },
                "on-blur": event => {
                  for (let i = 0; i < this.listData.length; i++) {
                    if (this.listData[i].lawCaseId == params.row.lawCaseId) {
                      this.listData[i].caseNo = event.target.value;
                    }
                  }
                }
              }
            });
          }
        },
        {
          title: "诉讼费",
          key: "phone",
          align: "center",
          // fixed:'right',
          render: (h, params) => {
            return h(
              "div",
              {
                style: {
                  display: "flex",
                  alignItems: "center"
                }
              },
              [
                h("Input", {
                  props: {
                    value: params.row.litigationCost,
                    autosize: true
                  },
                  attrs: {
                    id: "rwmcs" + params.index //保证每个输入框的id唯一
                  },
                  on: {
                    "on-focus": () => {
                      this.$nextTick(() => {
                        document
                          .getElementById("rwmcs" + params.index)
                          .childNodes.forEach(item => {
                            if (item.tagName == "INPUT") {
                              item.focus();
                            }
                          });
                      });
                    },
                    "on-blur": event => {
                      for (let i = 0; i < this.listData.length; i++) {
                        if (
                          this.listData[i].lawCaseId == params.row.lawCaseId
                        ) {
                          this.listData[i].litigationCost = event.target.value;
                        }
                      }
                    }
                  }
                }),
                h("span", {}, "元")
              ]
            );
          }
        },
        {
          title: "适用程序",
          key: "phone",
          align: "center",
          // fixed:'right',
          render: (h, params) => {
            return h(
              "Select",
              {
                props: {
                  value: this.listData[params.index].procedureType,
                  filterable: "filterable",
                  clearable: "clearable",
                  transfer: "transfer"
                },
                on: {
                  "on-change": value => {
                    this.listData[params.index].procedureType = value;
                    Vue.set(this.listData, index, this.listData[index]);
                  }
                }
              },
              [
                h(
                  "Option",
                  {
                    props: { value: "简易程序" }
                  },
                  "简易程序"
                ),
                h(
                  "Option",
                  {
                    props: { value: "普通程序" }
                  },
                  "普通程序"
                ),
                h(
                  "Option",
                  {
                    props: { value: "小额诉讼程序" }
                  },
                  "小额诉讼程序"
                )
              ]
              // this.clerkList.map(item => {
              //     return h('Option', {
              //         props: {value: item.id}
              //     }, item.name);
              // })
            );
          }
        }
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
          briefId: item.briefId ? item.briefId.toString() : "", //案由id
          courtId: item.courtId ? item.courtId.toString() : "",
          //   judgeId: item.judgeId ? item.judgeId.toString() : "",
          //   clerkId: item.clerkId ? item.clerkId.toString() : "",
          //   assistantJudgeId: item.assistantJudgeId
          //     ? item.assistantJudgeId.toString()
          //     : "",
          applyStandard: item.applyStandard
            ? item.applyStandard.toString()
            : "", //诉讼标的 （字符串的数字）
          litigationCost: item.litigationCost
            ? item.litigationCost.toString()
            : "", //诉讼费（字符串的数字）
          procedureType: item.procedureType ? item.procedureType : "", //适用程序
          caseNo: item.caseNo ? item.caseNo.toString() : "" //案号
        };
        ary.push(data);
      });
      this.isError = false;
      this.buttonLoading = true;
      distribution(ary).then(res => {
        this.buttonLoading = false;
        if (res.data.state == 100) {
          //显示下一步
          this.stepShow = true;
          this.$Notice.success({
            title: "",
            desc: res.data.message,
            duration: 3
          });
          //   this.$emit("cancelEvent", 1);
          // this.nextStep('分案')//如果成功直接接入下一步
          // this.resetData();//重置数据
          // this.$emit('cancelEvent',1);
          this.reSetList(this.listData); //重置父组件数据
        } else {
          this.isError = true;
          this.successNumber = res.data.data.success;
          this.failedNumber = res.data.data.error;
          this.reason = res.data.message;
          //隐藏下一步
          this.stepShow = false;
          //剔除成功案件，显示错误案件
          let errorAry = [];
          let successAry = [];
          for (let i = 0; i < this.listData.length; i++) {
            var mark = 0;
            for (let j = 0; j < res.data.data.errorIdList.length; j++) {
              if (res.data.data.errorIdList[j] == this.listData[i].lawCaseId) {
                mark = 1;
                errorAry.push(this.listData[i]); //错误案件
              }
            }
            if (mark == 0) {
              successAry.push(this.listData[i]); //正确案件
            }
          }
          console.log("errorAry", errorAry, "successAry", successAry);
          this.listData = errorAry; //显示错误案件
          this.reSetList(successAry); //重置成功的数据到父组件
        }
      });
    },
    numFormatChange() {
      //去除案号格式输入填写空格
      this.contrTypeTabList.numFormat = delSpace(
        this.contrTypeTabList.numFormat,
        "g"
      );
    },
    numFormatChange1() {
      //去除起始案号填写空格并设置相关数据
      this.contrTypeTabList.startCaseNo = delSpace(
        this.contrTypeTabList.startCaseNo,
        "g"
      ); //设置起始案号
      if (this.contrTypeTabList.startCaseNo) {
        //判断起始案号非空
        if (!this.isDown) {
          //判断是否倒序
          //正序
          this.contrTypeTabList.endCaseNo =
            Number(this.contrTypeTabList.startCaseNo) +
            this.listDatas.length -
            1; //设置结束案号
        } else {
          //倒序
          this.contrTypeTabList.endCaseNo =
            Number(this.contrTypeTabList.startCaseNo) -
            this.listDatas.length +
            1; //设置结束案号
        }
        //设置表格数据
        let nowNum = Number(this.contrTypeTabList.startCaseNo); //设置当前循环的起始案号
        this.listData.forEach((item, index) => {
          item.caseNo =
            this.contrTypeTabList.numFormat + nowNum.toString() + "号"; //拼接
          this.$set(this.listData, index, item); //DOM强制更新
          this.isDown == false ? nowNum++ : nowNum--;
        });
        console.log("555555", this.listData);
      } else {
        this.contrTypeTabList.endCaseNo = "";
      }
    },
    /**
     * 选中案由
     */
    selBrief(name) {
      for (let i = 0; i < this.listData.length; i++) {
        this.listData[i].briefId = name;
        for (let u = 0; u < this.briefList.length; u++) {
          if (this.briefList[u].id == name) {
            this.listData[i].briefName = this.briefList[u].name;
          }
        }
        //
        // Vue.set(this.listData, i, this.listData[i]);
      }
      this.listData = JSON.parse(JSON.stringify(this.listData));
    },
    selBrief2(id) {
      for (let i = 0; i < this.listData.length; i++) {
        if (this.listData[i].lawCaseId == this.selRow.lawCaseId) {
          this.listData[i].briefId = id;
          for (let u = 0; u < this.briefList.length; u++) {
            if (this.briefList[u].id == id) {
              this.listData[i].briefName = this.briefList[u].name;
            }
          }
          Vue.set(this.listData, i, this.listData[i]);
        }
      }
      this.modal2 = false;
      this.modal2back = false;
    },
    /**
     * 选择承办部门
     */
    selCourt(id) {
      for (let i = 0; i < this.listData.length; i++) {
        this.listData[i].courtId = id;
        for (let u = 0; u < this.courtList.length; u++) {
          if (this.courtList[u].id == id) {
            this.listData[i].courtName = this.courtList[u].name;
          }
        }
      }
      this.listData = JSON.parse(JSON.stringify(this.listData));
    },
    /**
     * 单个案件选择承办部门
     */
    selCourt2(id) {
      for (let i = 0; i < this.listData.length; i++) {
        if (this.listData[i].lawCaseId == this.selRow.lawCaseId) {
          this.listData[i].courtId = id;
          for (let u = 0; u < this.courtList.length; u++) {
            if (this.courtList[u].id == id) {
              this.listData[i].courtName = this.courtList[u].name;
            }
          }
          Vue.set(this.listData, i, this.listData[i]);
        }
      }
      this.modal3 = false;
      this.modal2back = false;
    },
    /**
     * 选择承办人
     */
    selJudge(id) {
      for (let i = 0; i < this.listData.length; i++) {
        this.listData[i].judgeId = id;
        Vue.set(this.listData, i, this.listData[i]);
      }
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
     * 选择书记员
     */
    selassistant(id) {
      for (let i = 0; i < this.listData.length; i++) {
        this.listData[i].assistantJudgeId = id;
        Vue.set(this.listData, i, this.listData[i]);
      }
    },
    /**
     * 案号分配规则
     */
    selCaseNo(name) {
      if (name == "自动分配") {
        let ary = [];
        this.loading = true;
        caseNoList(0, this.listData.length).then(res => {
          if (res.data.state == 100) {
            ary = res.data.data;
            for (let i = 0; i < this.listData.length; i++) {
              this.listData[i].caseNo = ary[i];
              Vue.set(this.listData, i, this.listData[i]);
            }
            this.loading = false;
          } else {
            this.$Notice.warning({
              title: "",
              desc: res.data.message,
              duration: 5
            });
          }
        });
      }
    },
    /**
     * 适用程序
     */
    selProcedure(name) {
      for (let i = 0; i < this.listData.length; i++) {
        this.listData[i].procedureType = name;
        Vue.set(this.listData, i, this.listData[i]);
      }
    },
    nextStep(type) {
      //下一步
      this.$emit("nextStep", type);
    },
    reSetList(list) {
      //重置父组件数据
      this.$emit("reSetList", list);
    },
    getList() {
      this.buttonLoading = false;
      this.isError = false;
      this.listData = this.listDatas;
      //获取案由
      getBrief().then(res => {
        if (res.data.state == 100) {
          this.briefList = res.data.data;
          //添加案由id
          for (let i = 0; i < this.briefList.length; i++) {
            for (let j = 0; j < this.listData.length; j++) {
              if (this.briefList[i].name == this.listData[j].briefName) {
                this.listData[j].briefId = this.briefList[i].id;
              }
            }
          }
          this.searchForm.brief=this.listData[0].briefId;
        }
      });
      //获取法院部门列表
      courtList().then(res => {
        if (res.data.state == 100) {
          this.courtList = res.data.data;
          //添加部门id
          for (let i = 0; i < this.courtList.length; i++) {
            if (this.courtList[i].name == "厦门金融协同中心") {
              this.searchForm.mkk = this.courtList[i].id;
              this.selCourt(this.courtList[i].id);
            }
          }
        }
      });
      //获取初始诉讼费
      this.countCost();
      // judgeList().then(res =>{
      //     if(res.data.state == 100){
      //         this.judgeList = res.data.data;
      //     }
      // })
      // clerkList().then(res => {
      //     if(res.data.state == 100){
      //         this.clerkList = res.data.data.clerk;
      //     }
      // })
      // assistantJudgeList().then(res => {
      //     if(res.data.state == 100){
      //         this.assistantJudgeList = res.data.data.judgeAssistant;
      //     }
      // })
    },
    countCost() {
      //计算诉讼费用
      let ary = [];
      for (let i = 0; i < this.listData.length; i++) {
        const data = {
          type: 1,
          lawCaseId: this.listData[i].lawCaseId.toString(),
          basicCost: "0.0",
          property: "0.0",
          applyStandard: this.listData[i].applyStandard
            ? this.listData[i].applyStandard.toString()
            : "0.0"
        };
        ary.push(data);
      }
      let ds = {
        lawCaseList: ary
      };
      litigationFeeCalculation(ds).then(res => {
        if (res.data.state == 100) {
          for (let i = 0; i < this.listData.length; i++) {
            let list = res.data.data;
            for (let u = 0; u < list.length; u++) {
              if (list[u].lawCaseId == this.listData[i].lawCaseId) {
                this.listData[i].litigationCost = list[u].discount;
              }
            }
          }
          //dom更新
          this.listData = JSON.parse(JSON.stringify(this.listData));
        }
      });
      console.log(this.listData);
    },
    cancel() {
      this.$emit("cancelEvent");
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    resetData() {
      // 更新时调用
      Object.assign(this.$data, this.$options.data.call(this));
    }
  }
};
</script>

<style>
</style>
