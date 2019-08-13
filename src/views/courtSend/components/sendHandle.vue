<style lang="less">
@import "./../courtSend.less";
</style>
<template>
  <div class="courtSendInfo" style="position:relative">
    <Spin size="large" fix v-show="isLoading"></Spin>
    <!-- 原告 -->
    <div class="bookbuilding-table">
      <Row>
        <Col span="24" class="noemalTb th-header">
          <span>送达</span>
          <span style="float:right">
            <Checkbox @on-change="ckeckAllF" v-model="allCkeckF">全选/取消全选</Checkbox>
          </span>
        </Col>
      </Row>
      <div class="contain">
        <Row style="margin-bottom:15px">
          <Col span="3" class="sendRo" style="text-align:right">送达方式</Col>
          <Col span="6" class="sendRo" style="margin-left:15px;">
            <Select v-model="sendType" style="width:245px">
              <Option v-for="(st, key) in sendTypesLit" :value="st" :key="key">{{ st }}</Option>
            </Select>
          </Col>
        </Row>
        <Row style="margin-bottom:15px">
          <Col span="3" class="sendRo" style="text-align:right">受送达人</Col>
          <Col span="6" class="sendRo" style="margin-left:15px;">
            <Select v-model="caseInfo.litigantId" @on-change="changeLitigant" style="width:245px">
              <Option
                v-for="(st, key) in litigantList"
                :value="st.litigantId"
                :key="key"
              >{{ st.litigantName + "("+st.litigantStatusName+")" }}</Option>
            </Select>
          </Col>
        </Row>
        <Row style="margin-bottom:15px">
          <Col span="3" class="sendRo" style="text-align:right">送达文书</Col>
          <Col span="20" class="sendRo" style="margin-left:15px;">
            <span v-show="diplist.length == 0">{{tips}}</span>
            <div v-show="diplist.length > 0">
              <CheckboxGroup v-model="dipGroup">
                <span v-for="d in diplist">
                  <Checkbox :label="d"></Checkbox>
                </span>
              </CheckboxGroup>
            </div>
          </Col>
        </Row>
        <Row style="margin-bottom:15px" v-show="sendType === '电子邮件送达'">
          <Col span="3" class="sendRo" style="text-align:right">邮箱地址</Col>
          <Col span="20" class="sendRo" style="margin-left:15px;">
            <Input type="text" v-model="email" clearable placeholder="邮箱地址" style="width: 245px"/>
          </Col>
        </Row>
        <Row style="margin-bottom:15px" v-show="sendType === '电子邮件送达'">
          <Col span="3" class="sendRo" style="text-align:right">邮件模板</Col>
          <Col span="20" class="sendRo" style="margin-left:15px;">
            <Select v-model="emailId" @on-change="changeEmail" clearable style="width:245px">
              <Option v-for="(st, key) in emailLit" :value="st.id" :key="key">{{ st.name }}</Option>
            </Select>
          </Col>
          <Col span="3" class="sendRo" style="text-align:right">模板内容</Col>
          <Col span="20" class="sendRo" style="margin-left:15px;">
            <span>{{eamilContent}}</span>
          </Col>
        </Row>

        <Row style="margin-bottom:15px" v-show="sendType === 'EMS送达' || sendType === '工作人员上门送达'">
          <Col span="3" class="sendRo" style="text-align:right">当事人地址</Col>
          <Col span="20" class="sendRo" style="margin-left:15px;">
            <div v-for="(item) in adressList" style="display:block" v-show="item.address != ''">
              <Col span="1" style="padding-left:10px;">
                <Checkbox v-model="item.check"></Checkbox>
              </Col>
              <Col span="3" class="sendRo" style="text-align:left">{{item.litigantAddressType}}</Col>
              <Col span="8" class="sendRo" style="text-align:right">
                <Input
                  type="text"
                  v-model="item.address"
                  clearable
                  placeholder="地址"
                  style="width: 100%"
                />
              </Col>
              <Col
                span="2"
                class="sendRo"
                push="1"
                style="text-align:left"
                v-show="sendType === 'EMS送达'"
              >邮单号</Col>
              <Col
                span="8"
                class="sendRo"
                push="1"
                style="text-align:left"
                v-show="sendType === 'EMS送达'"
              >
                <Input
                  type="text"
                  v-model="item.oddNumbers"
                  clearable
                  placeholder="邮单号"
                  style="width: 100%"
                />
              </Col>
            </div>
          </Col>
        </Row>
        <Row style="margin-bottom:15px" v-show="sendType === 'EMS送达' || sendType === '工作人员上门送达'">
          <Col span="3" class="sendRo" style="text-align:right">联系电话</Col>
          <Col span="20" class="sendRo" style="margin-left:15px;">
            <Input v-model="contactPhone" placeholder="请输入联系电话" style="width: 300px"/>
          </Col>
        </Row>
      </div>
      <div class="button-clas">
        <Button
          size="large"
          @click="pro"
          :loading="buttonLoading"
          style="background:#2083D8;color:#fff;padding: 6px 31px;font-size:16px;"
        >送达发送</Button>
        <Button
          size="large"
          v-show="sendType=='EMS送达'"
          @click="print"
          :loading="buttonLoading"
          style="background:#2083D8;color:#fff;padding: 6px 31px;font-size:16px;"
        >打印快递单</Button>
      </div>
    </div>
  </div>
</template>
<script>
import { formatDate } from "@/libs/date";
import { emailMessageTemplate } from "@/api/global";
import {
  sendInfo,
  sendDiploms,
  emailMessageTemplateContent,
  printEmsSingle
} from "@/api/send";
export default {
  data() {
    return {
      caseInfo: {
        time: ""
      },
      litigantList: [],
      emailLit: [],
      sendType: "",
      tips: "请选择受送达人",
      eamilContent: "",
      buttonLoading: false,
      sendTypesLit: [
        "现场领取",
        "平台送达",
        "EMS送达",
        "工作人员上门送达",
        "电子邮件送达"
      ],
      contactPhone: "", //联系电话
      editState: false,
      isLoading: false,
      allCkeckF: false,
      adressList: [],
      emailId: "",
      email: "",
      emailLit: [],
      dipGroup: [],
      diplist: []
    };
  },
  methods: {
    /**
     * 送达操作
     */
    pro() {
      if (this.sendType == "") {
        this.$Notice.warning({
          title: "",
          desc: "请选择发送方式",
          duration: 5
        });
        return false;
      }
      if (this.sendType == "EMS送达" || this.sendType == "工作人员上门送达") {
        let isSelect = false;
        for (let i = 0; i < this.adressList.length; i++) {
          if (this.adressList[i].check) {
            isSelect = true;
          }
        }
        if (!isSelect) {
          this.$Notice.warning({
            title: "",
            desc: "请勾选发送的地址",
            duration: 5
          });
          return false;
        }
        if (this.sendType == "EMS送达") {
          let isOleNumber = false;
          for (let i = 0; i < this.adressList.length; i++) {
            if (
              this.adressList[i].check &&
              this.adressList[i].oddNumbers &&
              this.adressList[i].oddNumbers != ""
            ) {
              isOleNumber = true;
            }
          }
          if (!isOleNumber) {
            this.$Notice.warning({
              title: "",
              desc: "请填写勾选中地址邮单号",
              duration: 5
            });
            return false;
          }
        }
      }
      if (this.sendType == "电子邮件送达" && this.emailId == "") {
        this.$Notice.warning({
          title: "",
          desc: "请选择邮件模板",
          duration: 5
        });
        return false;
      }
      let oddNumbersAry = [];
      let sendAddressAry = [];
      for (let i = 0; i < this.adressList.length; i++) {
        if (this.adressList[i].check && this.adressList[i].address != "") {
          sendAddressAry.push(this.adressList[i].address);
          oddNumbersAry.push(this.adressList[i].oddNumbers);
        }
      }
      let data = {
        lawCaseId: this.$store.getters.caseId.toString(), //案件id
        litigantId: this.caseInfo.litigantId.toString(), //当事人id
        sendType: this.sendType, //发送方式
        diplmosList: this.dipGroup ? this.dipGroup.join(",") : "", //文书
        oddNumberList: oddNumbersAry.join(","), //邮单号数组
        sendAddressList: sendAddressAry.join(","), //地址数组
        email: this.email, //邮箱
        emailModelId: this.emailId, //邮箱模板id
        sendWay: "庭前送达"
      };
      this.buttonLoading = true;
      sendDiploms(data).then(res => {
        this.buttonLoading = false;
        if (res.data.state == 100) {
          window.open(res.data.data.resultPath);
        } else {
          this.$Notice.warning({
            title: "",
            desc: res.data.message,
            duration: 5
          });
        }
      });
    },
    /**
     * 打印EMS快递单
     */
    print() {
      let address = [];

      this.adressList.forEach(function(value, i) {
        address.push(value.address);
      });

      let printList = [
          //每个快递单，对应的所需要填写的信息
          {
            lawCaseId: this.$store.getters.caseId, // 案件id
            litigantId: this.caseInfo.litigantId, //当事人 id
            address: address.join(","), // 收件地址
            telephone: this.contactPhone, //联系电话
            diploms: this.diplist.join(",") //文书名称列表（使用,分隔）
          }
        ]
      

      printEmsSingle(printList).then(res => {
        if (res.data.state == 100) {
         this.$Message.success(res.data.message);
        }
        else{
                this.$Message.error(res.data.message);
        }
      });
     
    },
    /**
     * 选择邮件模板
     */
    changeEmail() {
      if (this.emailId == "") {
        this.eamilContent = "";
        return false;
      }
      let data = {
        litigantId: this.caseInfo.litigantId,
        emailModelId: this.emailId
      };
      emailMessageTemplateContent(data).then(res => {
        if (res.data.state == 100) {
          this.eamilContent = res.data.data.content;
        }
      });
      // for(let i=0;i<this.emailLit.length;i++){
      //     if(this.emailLit[i].id == this.emailId){
      //         this.eamilContent = this.emailLit[i].content;
      //     }
      // }
    },
    /**
     * 选择当事人
     */
    changeLitigant() {
      console.log(this.caseInfo.litigantId);
      for (let i = 0; i < this.litigantList.length; i++) {
        if (this.litigantList[i].litigantId == this.caseInfo.litigantId) {
          this.diplist = this.litigantList[i].diploms;
          if (this.diplist.length == 0) {
            this.tips = "暂无送达文书记录";
          }
          this.adressList = this.litigantList[i].litigantAddress;
          this.email = this.litigantList[i].emailAddress;
        }
      }
    },
    /**
     * 全选
     */
    ckeckAllF() {
      if (this.allCkeckF) {
        this.dipGroup = this.diplist;
      } else {
        this.dipGroup = [];
      }
    },
    init() {
      this.isLoading = true;
      sendInfo(this.$store.getters.caseId).then(res => {
        this.isLoading = false;
        this.litigantList = res.data.data;
      });
      emailMessageTemplate().then(res => {
        this.isLoading = false;
        if (res.data.state == 100) {
          this.emailLit = res.data.data;
        }
      });
    }
  },
  mounted() {
    this.init();
  },
  filters: {
    formatDate(time) {
      if (time == "") {
        return "";
      }
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd");
    },
    whether(boole) {
      return boole ? "是" : "否";
    },
    filCheck(boole) {
      return boole == 0 ? "未确认" : "已确认";
    },
    formatStartDate(time) {
      if (time == "") {
        return "";
      }
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm");
    }
  }
};
</script>

