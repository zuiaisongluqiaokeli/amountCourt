<style lang="less">
@import "./../batch.less";
</style>

<template>
  <div>
    <div class="batchModel">
      <div
        style="position: fixed;top:0;left:0;z-index:9999;width:100%;height:100%;background:#000;opacity:0.5"
        v-show="modal2back"
      ></div>
      <div
        class="noneShow"
        v-show="modal3"
        style="width:230px;position: fixed;top: 130px;z-index: 99999;left: 50%;margin-left: -100px;background: #fff;border-radius: 15px;"
      >
        <div class="ivu-modal-header">
          <div class="ivu-modal-header-inner">单个案件选择送达方式</div>
        </div>
        <div class="ivu-modal-body">
          <Select v-model="sendTypes" transfer @on-change="showType2" style="width:200px">
            <Option v-for="(st, key) in sendTypesLit" :value="st" :key="key">{{ st }}</Option>
          </Select>
        </div>
        <div class="ivu-modal-footer">
          <Button @click="modal3 = false;modal2back = false" type="dashed" size="large">关闭</Button>
        </div>
      </div>
      <div
        class="noneShow"
        v-show="modal4"
        style="width:500px;position: fixed;top: 130px;z-index: 99999;left: 50%;margin-left: -250px;background: #fff;border-radius: 15px;"
      >
        <div class="ivu-modal-header">
          <div class="ivu-modal-header-inner">单个案件增加/减少发送的文书</div>
        </div>
        <div class="ivu-modal-body">
          <Checkbox @on-change="ckeckAllLiti2" v-model="allCkeckLitiOne">全选/取消全选</Checkbox>
          <CheckboxGroup v-model="checkdisabledGroup" @on-change="checkValue3">
            <Checkbox v-for="(item) in checkTemplate" :label="item"></Checkbox>
          </CheckboxGroup>
        </div>
        <div class="ivu-modal-footer">
          <Button @click="oneCheckSure" type="primary" size="large">确定</Button>
        </div>
      </div>
      <Row>
        <Form
          ref="searchForm"
          :model="searchForm"
          style="text-align:left"
          inline
          :label-width="120"
          class="search-form"
        >
          <Form-item label="送达方式：">
            <Select v-model="sendType" @on-change="showType" style="width:200px">
              <Option v-for="(st, key) in sendTypesLit" :value="st" :key="key">{{ st }}</Option>
            </Select>
          </Form-item>
          <Form-item label="原告文书列表：" style="display:block">
            <Checkbox @on-change="ckeckAllLiti" v-model="allCkeckLiti">全选/取消全选</Checkbox>
            <CheckboxGroup v-model="plaintiffdisabledGroup" @on-change="checkValue1">
              <Checkbox v-for="(item) in plaintiffTemplate" :label="item"></Checkbox>
            </CheckboxGroup>
          </Form-item>
          <Form-item label="被告文书列表：">
            <Checkbox @on-change="ckeckAllF" v-model="allCkeckF">全选/取消全选</Checkbox>
            <CheckboxGroup v-model="defendantdisabledGroup" @on-change="checkValue2">
              <Checkbox v-for="(item) in defendantTemplate" :label="item"></Checkbox>
            </CheckboxGroup>
          </Form-item>
          <!-- <Form-item label="文书列表：" style="display:block">
                    <CheckboxGroup v-model="disabledGroup" @on-change="checkValue">
                        <Checkbox v-for="(item) in dipmosList" :label="item"></Checkbox>
                    </CheckboxGroup>
          </Form-item>-->
        </Form>
        <Form
          ref="searchForm"
          v-show="sendType === '电子邮件送达'"
          :model="searchForm"
          style="text-align:left"
          inline
          :label-width="80"
          class="search-form"
        >
          <Form-item label="邮件模板：">
            <Select v-model="emailId" transfer @on-change="changeEmail" style="width:200px">
              <Option v-for="(st, key) in emailLit" :value="st.id" :key="key">{{ st.name }}</Option>
            </Select>
          </Form-item>
          <Form-item label="邮件模板：" style="display:block">
            <div style="padding: 5px 6px;">{{ emailContent }}</div>
          </Form-item>
        </Form>
      </Row>
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
              height="450"
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
        >选择完毕</Button>
        <Button
          size="large"
          @click="cancel"
          style="background:#F54C4C;color:#fff;padding: 6px 31px;font-size:16px;width:128px;"
        >取消</Button>
        <Button
          size="large"
          :loading="buttonLoading"
          v-show="sendType=='EMS送达' "
          @click="print"
          style="background:#2083D8;color:#fff;font-size:16px;width:128px;"
        >批量打印</Button>
      </div>
    </div>
  </div>
</template>
<script>
import allColums from "./../batch.js";
import {
  diplomsTemplateList,
  emailMessageTemplate,
  batchPrint
} from "@/api/global";
import { formatDate } from "@/libs/date";
import Vue from "vue";
export default {
  data() {
    return {
      searchForm: {},
      batchPrint: {
        list: []
      }, //批量打印参数

      plaintiffdisabledGroup: [], //原告选择文书
      defendantdisabledGroup: [], //被告选择文书
      checkTemplate: [], //单个案件时的文书列表选择
      checkdisabledGroup: [], //单个案件时的文书选中
      allCkeckLitiOne: false, //单个案件全选样式
      plaintiffTemplate: [], //原告文书列表
      defendantTemplate: [], //被告文书列表
      dexSel: "", //选中的下标
      loading: false, //加载动画
      allCkeckLiti: false, //全选样式
      allCkeckF: false, //全选样式
      modal2back: false, //遮罩层
      sendTypes: "", //文书发送方式
      modal3: false,
      modal4: false,
      buttonLoading: false,
      isError: false,
      successNumber: "",
      failedNumber: "",
      reason: "",
      emailLit: [],
      emailContent: "",
      emailId: "",
      sendType: "",
      sendTypesLit: [
        "现场领取",
        "平台送达",
        "EMS送达",
        "工作人员上门送达",
        "电子邮件送达"
      ],
      listData: [],
      selRow: {},
      selDex: "",
      dipmosList: [],
      disabledGroup: [],
      columns: [
        {
          title: "序号",
          type: "index",

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

          align: "center"
        },
        {
          title: "案由",
          key: "briefName",
          align: "center"
        },
        {
          title: "受送达人",
          key: "litigantName",
          align: "center"
          // fixed:'right',
        },
        {
          title: "诉讼地位",
          key: "litigantStatusName",
          // width: 120,
          align: "center"
        },
        {
          title: "送达方式",
          key: "litigantStatusName",
          align: "center",

          // fixed:'right',
          render: (h, params) => {
            return (
              "div",
              [
                h(
                  "span",
                  {
                    props: {},
                    style: {
                      color: "#2d8cf0",
                      cursor: "pointer"
                    },
                    on: {
                      click: () => {
                        this.modal3 = true;
                        this.modal2back = true;
                        this.selRow = this.listData[params.index];
                        this.selDex = params.index;
                        this.sendTypes = this.selRow.sendType
                          ? this.selRow.sendType
                          : "";
                        console.log(this.selRow);
                        console.log(this.modal3);
                      }
                    }
                  },
                  this.listData[params.index].sendType
                    ? this.listData[params.index].sendType
                    : "请选择"
                )
              ]
            );
          }
        },
        {
          title: "地址",
          key: "judge",

          align: "center",
          // fixed:'right',
          render: (h, params) => {
            return h(
              "div",
              {
                props: {}
              },
              // this.listData[params.index].sendType == '电子邮件送达' ? "邮箱号" :
              this.listData[params.index].litigantAddress.map((item, index) => {
                if (item.address == "") {
                  return false;
                }
                return h("p", {}, [
                  h(
                    "span",
                    {
                      style: {
                        fontWeight: "600"
                      }
                    },
                    item.litigantAddressType + "："
                  ),
                  h("Input", {
                    props: {
                      value: item.address,
                      autosize: true
                    },
                    attrs: {
                      id: "adress" + params.index + index //保证每个输入框的id唯一
                    },
                    on: {
                      "on-focus": () => {
                        this.$nextTick(() => {
                          document
                            .getElementById("adress" + params.index + index)
                            .childNodes.forEach(item => {
                              if (item.tagName == "INPUT") {
                                item.focus();
                              }
                            });
                        });
                      },
                      "on-blur": event => {
                        if (
                          event.target.value ==
                          this.listData[params.index].litigantAddress[index]
                            .address
                        ) {
                          return false;
                        }
                        this.listData[params.index].litigantAddress[
                          index
                        ].address = event.target.value;
                      }
                    }
                  })
                ]);
              })
            );
          }
        },
        {
          title: "邮单编号",
          key: "clerk",

          align: "center",
          // fixed:'right',
          render: (h, params) => {
            if (
              this.listData[params.index].sendType &&
              this.listData[params.index].sendType == "EMS送达"
            ) {
              return h(
                "div",
                {
                  props: {}
                },
                // this.listData[params.index].sendType == '电子邮件送达' ? "邮箱号" :
                this.listData[params.index].litigantAddress.map(item => {
                  if (item.address == "") {
                    return false;
                  }
                  return h("Input", {
                    props: {
                      value: item.oddNumbers,
                      autosize: true
                    },
                    attrs: {
                      id: "rwmc" + item.id, //保证每个输入框的id唯一
                      placeholder: item.litigantAddressType + "邮单编号"
                    },
                    style: {
                      marginBottom: "5px"
                    },
                    on: {
                      "on-focus": () => {
                        this.$nextTick(() => {
                          document
                            .getElementById("rwmc" + item.id)
                            .childNodes.forEach(item => {
                              if (item.tagName == "INPUT") {
                                item.focus();
                              }
                            });
                        });
                      },
                      "on-blur": event => {
                        for (
                          let i = 0;
                          i <
                          this.listData[params.index].litigantAddress.length;
                          i++
                        ) {
                          if (
                            this.listData[params.index].litigantAddress[i].id ==
                            item.id
                          ) {
                            this.listData[params.index].litigantAddress[
                              i
                            ].oddNumbers = event.target.value;
                          }
                        }
                      }
                    }
                  });
                })
              );
            } else {
              return h("span", {}, "无需填写");
            }
          }
        },
        {
          title: "邮箱",
          key: "emails",

          align: "center",
          // fixed:'right',
          render: (h, params) => {
            if (
              this.listData[params.index].sendType &&
              this.listData[params.index].sendType == "电子邮件送达"
            ) {
              return h("Input", {
                props: {
                  value: params.row.litiganteEmail,
                  autosize: true
                },
                attrs: {
                  id: "rwm" + params.index //保证每个输入框的id唯一
                },
                on: {
                  "on-focus": () => {
                    this.$nextTick(() => {
                      document
                        .getElementById("rwm" + params.index)
                        .childNodes.forEach(item => {
                          if (item.tagName == "INPUT") {
                            item.focus();
                          }
                        });
                    });
                  },
                  "on-blur": event => {
                    console.log(params.row.lawCaseId);
                    for (let i = 0; i < this.listData.length; i++) {
                      if (this.listData[i].lawCaseId == params.row.lawCaseId) {
                        this.listData[i].litiganteEmail = event.target.value;
                      }
                    }
                  }
                }
              });
            } else {
              return h("span", {}, this.listData[params.index].litiganteEmail);
            }
          }
        },

        {
          title: "送达文书",
          key: "clerk",

          // fixed:'right',
          render: (h, params) => {
            return h("div", [
              h(
                "div",
                {},
                params.row.checkboxValue
                  ? params.row.checkboxValue.map(item => {
                      return h("p", {}, item);
                    })
                  : ""
              ),
              h(
                "span",
                {
                  style: {
                    color: "#2d8cf0",
                    cursor: "pointer"
                  },
                  on: {
                    click: () => {
                      this.modal4 = true;
                      this.modal2back = true;

                      if (params.row.litigantStatusName == "原告") {
                        this.checkTemplate = this.plaintiffTemplate;
                      } else {
                        this.checkTemplate = this.defendantTemplate;
                      }
                      this.checkdisabledGroup = params.row.checkboxValue;
                      this.dexSel = params.index;
                    }
                  }
                },
                "增加/减少发送的文书"
              )
            ]);
          }
        }
      ]
    };
  },
  props: {
    listData2: Array
  },
  methods: {
    changeSelect() {},
    detailM(id) {},
    save() {
      if (this.listData.length < 1) {
        this.$Notice.warning({
          title: "",
          desc: "您还未选择需要操作的案件",
          duration: 5
        });
        return false;
      }
      this.$emit("cancelEvent", this.listData);
    },
    /**
     * 选择文书
     */
    checkValue(value) {
      for (let i = 0; i < this.listData.length; i++) {
        this.listData[i].checkboxValue = this.disabledGroup;
        Vue.set(this.listData, i, this.listData[i]);
      }
    },
    // 原告全选
    ckeckAllLiti() {
      if (this.allCkeckLiti) {
        this.plaintiffdisabledGroup = [];
        for (let i = 0; i < this.plaintiffTemplate.length; i++) {
          this.plaintiffdisabledGroup.push(this.plaintiffTemplate[i]);
        }
      } else {
        this.plaintiffdisabledGroup = [];
      }
      for (let i = 0; i < this.listData.length; i++) {
        if (this.listData[i].litigantStatusName == "原告") {
          this.listData[i].checkboxValue = this.plaintiffdisabledGroup;
          // Vue.set(this.listData, i, this.listData[i]);
        }
      }
      this.listData = JSON.parse(JSON.stringify(this.listData));
    },
    //单个案件全选
    ckeckAllLiti2() {
      if (this.allCkeckLitiOne) {
        this.checkdisabledGroup = this.checkTemplate;
      } else {
        this.checkdisabledGroup = [];
      }
    },
    //单个案件单选文书
    checkValue3() {
      if (this.checkdisabledGroup.length < this.checkTemplate.length) {
        this.allCkeckLitiOne = false;
      } else {
        this.allCkeckLitiOne = true;
      }
    },
    oneCheckSure() {
      this.listData[this.dexSel].checkboxValue = this.checkdisabledGroup;
      Vue.set(this.listData, this.dexSel, this.listData[this.dexSel]);
      this.modal4 = false;
      this.modal2back = false;
    },
    // 原告单选
    checkValue1(value) {
      for (let i = 0; i < this.listData.length; i++) {
        if (this.listData[i].litigantStatusName == "原告") {
          this.listData[i].checkboxValue = this.plaintiffdisabledGroup;
          // Vue.set(this.listData, i, this.listData[i]);
        }
      }
      this.listData = JSON.parse(JSON.stringify(this.listData));
      if (this.plaintiffdisabledGroup.length < this.plaintiffTemplate.length) {
        this.allCkeckLiti = false;
      } else {
        this.allCkeckLiti = true;
      }
    },
    // 被告全选
    ckeckAllF() {
      if (this.allCkeckF) {
        this.defendantdisabledGroup = [];
        for (let i = 0; i < this.defendantTemplate.length; i++) {
          this.defendantdisabledGroup.push(this.defendantTemplate[i]);
        }
      } else {
        this.defendantdisabledGroup = [];
      }
      for (let i = 0; i < this.listData.length; i++) {
        if (this.listData[i].litigantStatusName == "被告") {
          this.listData[i].checkboxValue = this.defendantdisabledGroup;
          // Vue.set(this.listData, i, this.listData[i]);
        }
      }
      this.listData = JSON.parse(JSON.stringify(this.listData));
    },
    // 被告单选
    checkValue2(value) {
      for (let i = 0; i < this.listData.length; i++) {
        if (this.listData[i].litigantStatusName == "被告") {
          this.listData[i].checkboxValue = this.defendantdisabledGroup;
          // Vue.set(this.listData, i, this.listData[i]);
        }
      }
      this.listData = JSON.parse(JSON.stringify(this.listData));
      if (this.defendantdisabledGroup.length < this.defendantTemplate.length) {
        this.allCkeckF = false;
      } else {
        this.allCkeckF = true;
      }
    },

    getList() {
      this.listData = this.listData2;
      this.emailId = "";
      this.disabledGroup = [];
      this.sendType = "";
      this.emailContent = "";
      this.buttonLoading = false;
      this.tribunalId = "";
      diplomsTemplateList().then(res => {
        if (res.data.state == 100) {
          this.dipmosList = res.data.data.diplomsTemplate;
          this.plaintiffTemplate = res.data.data.plaintiffTemplate; //原告所有文书列表
          this.defendantTemplate = res.data.data.defendantTemplate; //被告所有文书列表
          this.plaintiffdisabledGroup = res.data.data.plaintiffDefaultTemplate; //原告默认选择文书列表
          this.defendantdisabledGroup = res.data.data.defendantDefaultTemplate; //被告默认选择文书列表
          for (let i = 0; i < this.listData.length; i++) {
            if (this.listData[i].litigantStatusName == "原告") {
              this.listData[i].checkboxValue =
                res.data.data.plaintiffDefaultTemplate;
            } else {
              this.listData[i].checkboxValue =
                res.data.data.defendantDefaultTemplate;
            }
          }
          this.listData = JSON.parse(JSON.stringify(this.listData));
        }
      });
      emailMessageTemplate().then(res => {
        if (res.data.state == 100) {
          this.emailLit = res.data.data;
          this.emailId = this.emailLit[0].id;
        }
      });
    },
    cancel() {
      this.$emit("cancelEvent");
    },
    closeModel2() {
      this.modal2 = false;
    },
    print() {
      batchPrint(this.batchPrint.list).then(res => {
        if (res.data.state == 100) {
        }
      });
    },
    changeEmail() {
      for (let i = 0; i < this.emailLit.length; i++) {
        if (this.emailLit[i].id == this.emailId) {
          this.emailContent = this.emailLit[i].content;
        }
      }
      for (let i = 0; i < this.listData.length; i++) {
        this.listData[i].emailModelId = this.emailId;
      }
    },
    showType2() {
      this.listData[this.selDex].sendType = this.sendTypes;
      Vue.set(this.listData, this.selDex, this.listData[this.selDex]);
      this.modal3 = false;
      this.modal2back = false;
    },
    showType() {
      for (let i = 0; i < this.listData.length; i++) {
        this.listData[i].sendType = this.sendType;
        this.batchPrint.list.push({
          lawCaseId: this.listData[i].lawCaseId,
          litigantId: this.listData[i].litigantId,
          address: this.listData[i].litigantAddress[0].address,
          telephone: this.listData[i].litigantPhone,
          diploms: this.listData[i].checkboxValue.join(",")
        });
        // Vue.set(this.listData, i, this.listData[i]);
      }
      console.log(this.batchPrint);
      console.log(this.listData);
      this.listData = JSON.parse(JSON.stringify(this.listData));
    }
  },
  filters: {
    formatDate(time) {
      if (time == "") {
        return "";
      }
      try {
        var date = new Date(time.replace(/-/g, "/"));
      } catch (e) {
        var date = new Date(time);
      }
      return formatDate(date, "yyyy-MM-dd");
    }
  }
};
</script>

