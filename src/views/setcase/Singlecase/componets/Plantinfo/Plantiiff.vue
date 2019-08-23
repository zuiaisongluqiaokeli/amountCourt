<style scoped src='./plantiiff.css'></style>
<template>
  <div class="ft-plant-div1">
    <Collapse simple v-for="(value, key) in infos.formValidate" v-model="openAry" :key="key">
      <Panel :name="item.plantiffId" v-for="(item,ind) in value" :key="ind">
        <span>{{item.name ? item.name : "暂无原告姓名(点此填写)"}}</span>
        <div class="ft-plant-div2" slot="content">
          <!-- v-for="item in confirmPlantList" -->
          <!-- 自然人 -->

          <Form
            :model="item"
            label-position="right"
            :label-width="190"
            :rules="infos.natureRule"
            :ref="'natureRule' + key + ind"
            style="margin:0 auto"
          >
            <Tooltip
              content="删除当前原告"
              v-show="item.plantiffId != 'plant_0'"
              @click.native="delPlantiff(item)"
              class
              placement="bottom"
            >
              <Icon type="ios-close" class="iconSet" />
            </Tooltip>
            <FormItem
              label="当事人类型"
              class="ft_form ft-plant-chooseType"
              :class="isToRight?'isRight':''"
            >
              <a
                href="javascript:void(0)"
                v-for="(i,index) in orgrin"
                :key="index"
                @click="ft_handleChgStep1_tab(item,i.name,index)"
                :class="index==item.plantNowIndex?'plant_active ft-plant-a1':'ft-plant-a1'"
              >{{i.name}}</a>
            </FormItem>
            <div v-show="item.litigantType == '自然人'" style="width:820px">
              <FormItem label="姓名" class="ft_form ft-plant-chooseType" prop="name">
                <Input v-model="item.name" placeholder="必填" clearable></Input>
              </FormItem>
              <FormItem label="公民身份证号" class="ft_form ft-plant-chooseType" prop="identityCard">
                <Input
                  v-model="item.identityCard"
                  placeholder="必填"
                  @on-change="plant_autoFillId(item)"
                  clearable
                ></Input>
              </FormItem>
              <FormItem label="出生日期" class="ft_form ft-plant-chooseType" prop="litigantBirthday">
                <DatePicker
                  type="date"
                  :editable="false"
                  placeholder="请选择出生年月"
                  :clearable="false"
                  format="yyyy年MM月dd日"
                  style="width: 300px"
                  :value="item.litigantBirthday"
                  @on-change="ft_plant_chgBirth"
                ></DatePicker>
              </FormItem>
              <FormItem label="性别" class="ft_form ft-plant-chooseType" prop="litigantSex">
                <RadioGroup v-model="item.litigantSex" class="ft-confirm-radio">
                  <Radio label="男" class="ft-public-color">男</Radio>
                  <Radio label="女" class="ft-public-color">女</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="民族" class="ft_form ft-plant-chooseType" prop="litigantNation">
                <Select v-model="item.litigantNation" placeholder="请选择民族" clearable filterable>
                  <Option
                    v-for="(item,index) in nationAry"
                    :value="item.name"
                    :key="index"
                  >{{ item.name }}</Option>
                </Select>
              </FormItem>
              <FormItem
                label="户籍地址"
                class="ft_form ft-plant-chooseType"
                prop="litigantPermanentAddress"
              >
                <Input v-model="item.litigantPermanentAddress" placeholder="必填" clearable></Input>
              </FormItem>
              <FormItem label="常住地址" class="ft_form ft-plant-chooseType" prop="address">
                <Input v-model="item.address" placeholder="选填（请加上省份）" clearable></Input>
              </FormItem>
              <FormItem label="文书送达地址" class="ft_form ft-plant-chooseType" prop="serviceAddress">
                <Input v-model="item.serviceAddress" placeholder="必填" clearable></Input>
              </FormItem>
              <FormItem label="手机号" class="ft_form ft-plant-chooseType" prop="phone">
                <Input v-model="item.phone" placeholder="必填" clearable></Input>
              </FormItem>
              <FormItem label="电子邮箱" class="ft_form ft-plant-chooseType" prop="email">
                <Input v-model="item.email" placeholder="选填" clearable></Input>
              </FormItem>
              <FormItem
                label="个人身份证明文件"
                class="ft_form ft-plant-upload ft-plant-chooseType"
                prop="businessLicense"
              >
                <Input v-model="item.businessLicense" placeholder="必填"></Input>
                <span>{{item.plant_fileName1}}</span>
                <Upload
                  action="/api/court/case/upScanning.jhtml"
                  class="ft-plant-upload-button"
                  :show-upload-list="false"
                  :on-success="plant_uploadSuccess"
                  :data="{fileType:'个人身份证明文件',id:item.plantiffId}"
                >
                  <Button type="ghost" icon="ios-cloud-upload-outline">选择文件</Button>
                  <span>请上传*.jpg/png/bmp/pdf后缀格式的文件</span>
                </Upload>
              </FormItem>
            </div>
          </Form>
          <!-- 法人 -->
          <div v-show="item.litigantType == '法人'" style="width:848px;margin:0px auto">
            <Form
              :model="item"
              label-position="right"
              :label-width="200"
              :rules="infos.legalRule"
              :ref="'legalRule' + key + ind"
              style="margin:0 auto"
            >
              <FormItem label="名称" class="ft_form ft-plant-chooseType" prop="name">
                <Input v-model="item.name" placeholder="必填" clearable></Input>
              </FormItem>
              <FormItem label="社会统一信用代码" class="ft_form ft-plant-chooseType" prop="identityCard">
                <Input v-model="item.identityCard" placeholder="必填" clearable></Input>
              </FormItem>
              <FormItem label="注册地址" class="ft_form ft-plant-chooseType" prop="address">
                <Input v-model="item.address" placeholder="必填" clearable></Input>
              </FormItem>
              <FormItem label="文书送达地址" class="ft_form ft-plant-chooseType" prop="serviceAddress">
                <Input v-model="item.serviceAddress" placeholder="必填" clearable></Input>
              </FormItem>
              <FormItem
                label="单位证明文件"
                class="ft_form ft-plant-upload ft-plant-chooseType"
                prop="businessLicense"
              >
                <Input v-model="item.businessLicense" placeholder="必填"></Input>
                <span>{{item.plant_fileName2}}</span>
                <Upload
                  action="/api/court/case/upScanning.jhtml"
                  class="ft-plant-upload-button"
                  :show-upload-list="false"
                  :on-success="plant_uploadSuccess"
                  :data="{fileType:'单位证明文件',id:item.plantiffId}"
                >
                  <Button type="ghost" icon="ios-cloud-upload-outline">选择文件</Button>
                  <span>请上传*.jpg/png/bmp/pdf后缀格式的文件</span>
                </Upload>
              </FormItem>
              <FormItem label="单位固定电话" class="ft_form ft-plant-chooseType" prop="phone">
                <Input v-model="item.phone" placeholder="选填" clearable></Input>
              </FormItem>
              <FormItem label="单位电子邮箱" class="ft_form ft-plant-chooseType" prop="email">
                <Input v-model="item.email" placeholder="选填" clearable></Input>
              </FormItem>
              <FormItem label="法定代表人" class="ft_form ft-plant-chooseType" prop="legalManName">
                <Input v-model="item.legalManName" placeholder="必填" clearable></Input>
              </FormItem>
              <FormItem label="法定代表人职务" class="ft_form ft-plant-chooseType" prop="legalDuty">
                  <Input v-model="item.legalDuty" placeholder="选填" clearable></Input>
              </FormItem>
              <FormItem label="法定代表人手机号" class="ft_form ft-plant-chooseType" prop="legalManPhone">
                <Input v-model="item.legalManPhone" placeholder="选填" clearable></Input>
              </FormItem>
              <FormItem label="法定代表人身份证号码" class="ft_form ft-plant-chooseType" prop="legalManId">
                <Input v-model="item.legalManId" placeholder="选填" clearable></Input>
              </FormItem>
              <FormItem
                label="法定代表人身份证明文件"
                class="ft_form ft-plant-upload ft-plant-chooseType"
                prop="legalIdentity"
              >
                <Input v-model="item.legalIdentity" placeholder="必填"></Input>
                <span>{{item.plant_fileName4}}</span>
                <Upload
                  action="/api/court/case/upScanning.jhtml"
                  class="ft-plant-upload-button"
                  :show-upload-list="false"
                  :on-success="plant_uploadSuccess"
                  :data="{fileType:'法定代表人身份证明文件',id:item.plantiffId}"
                >
                  <Button type="ghost" icon="ios-cloud-upload-outline">选择文件</Button>
                  <span>请上传*.jpg/png/bmp/pdf后缀格式的文件</span>
                </Upload>
              </FormItem>
            </Form>
          </div>
          <!-- 非法人 -->
          <div v-show="item.litigantType == '非法人组织'" style="width:848px;margin:0px auto">
            <Form
              :model="item"
              label-position="right"
              :label-width="200"
              :rules="infos.nolegalRule"
              :ref="'legalRule2' + key + ind"
              style="margin:0 auto"
            >
              <FormItem label="名称" class="ft_form ft-plant-chooseType" prop="name">
                <Input v-model="item.name" placeholder="必填" clearable></Input>
              </FormItem>
              <FormItem label="社会统一信用代码" class="ft_form ft-plant-chooseType" prop="identityCard">
                <Input v-model="item.identityCard" placeholder="必填" clearable></Input>
              </FormItem>
              <FormItem label="注册地址" class="ft_form ft-plant-chooseType" prop="address">
                <Input v-model="item.address" placeholder="必填" clearable></Input>
              </FormItem>
              <FormItem label="文书送达地址" class="ft_form ft-plant-chooseType" prop="serviceAddress">
                <Input v-model="item.serviceAddress" placeholder="必填" clearable></Input>
              </FormItem>
              <FormItem
                label="单位证明文件"
                class="ft_form ft-plant-upload ft-plant-chooseType"
                prop="businessLicense"
              >
                <Input v-model="item.businessLicense" placeholder="必填"></Input>
                <span>{{item.plant_fileName3}}</span>
                <Upload
                  action="/api/court/case/upScanning.jhtml"
                  class="ft-plant-upload-button"
                  :show-upload-list="false"
                  :on-success="plant_uploadSuccess"
                  :data="{fileType:'单位证明文件',id:item.plantiffId}"
                >
                  <Button type="ghost" icon="ios-cloud-upload-outline">选择文件</Button>
                  <span>请上传*.jpg/png/bmp/pdf后缀格式的文件</span>
                </Upload>
              </FormItem>
              <FormItem label="单位固定电话" class="ft_form ft-plant-chooseType" prop="phone">
                <Input v-model="item.phone" placeholder="选填" clearable></Input>
              </FormItem>
              <FormItem label="单位电子邮箱" class="ft_form ft-plant-chooseType" prop="email">
                <Input v-model="item.email" placeholder="选填" clearable></Input>
              </FormItem>
              <FormItem label="负责人" class="ft_form ft-plant-chooseType" prop="legalManName">
                <Input v-model="item.legalManName" placeholder="必填" clearable></Input>
              </FormItem>
              <FormItem label="负责人职务" class="ft_form ft-plant-chooseType" prop="legalDuty">
                  <Input v-model="item.legalDuty" placeholder="选填" clearable></Input>
              </FormItem>
              <FormItem label="负责人手机号" class="ft_form ft-plant-chooseType" prop="legalManPhone">
                <Input v-model="item.legalManPhone" placeholder="选填" clearable></Input>
              </FormItem>
              <FormItem label="负责人身份证号码" class="ft_form ft-plant-chooseType" prop="legalManId">
                <Input v-model="item.legalManId" placeholder="选填" clearable></Input>
              </FormItem>
              <FormItem
                label="负责人身份证明文件"
                class="ft_form ft-plant-upload ft-plant-chooseType"
                prop="legalIdentity"
              >
                <Input v-model="item.legalIdentity" placeholder="必填"></Input>
                <span>{{item.plant_fileName5}}</span>
                <Upload
                  action="/api/court/case/upScanning.jhtml"
                  class="ft-plant-upload-button"
                  :show-upload-list="false"
                  :on-success="plant_uploadSuccess"
                  :data="{fileType:'法定代表人身份证明文件',id:item.plantiffId}"
                >
                  <Button type="ghost" icon="ios-cloud-upload-outline">选择文件</Button>
                  <span>请上传*.jpg/png/bmp/pdf后缀格式的文件</span>
                </Upload>
              </FormItem>
            </Form>
          </div>
        </div>
      </Panel>
    </Collapse>
    <!-- 提交按钮 -->
    <Form label-position="right" style="margin:0 auto;width: 441px;margin-top:15px">
      <FormItem>
        <div class="ft_public1" @click="ft_handleFormValid_step1">
          <a href="javascript:void(0)" class="addCommon">增加共同原告</a>
        </div>
      </FormItem>
      <FormItem>
        <div class="ft_public1">
          <a href="javascript:void(0)" class="ft_public3" @click="ft_plantNext">下一步，代理人信息</a>
        </div>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import "../../casecommon/casereset.css";
import plantVialte from "./plantrule.js";
import nation from "@/api/nations.js";
import Eventbus from "../Eventbus/Eventbus.js";
import {
  tools_transDate,
  tools_resetObjectKeys,
  tools_calcIdentiyInfo
} from "@/libs/tools.js";
import "./plantiiff.css";

export default {
  data() {
    return {
      isToRight: true, //样式修改
      openAry: ["plant_0"], //给定ID为了在步骤二原告代理人中增加信息
      nationAry: nation, //民族列表
      plantNowIndex: 0, //代理人类型
      orgrin: plantVialte.manType, //当事人类型
      natureList: plantVialte.natureList, //自然人申请数据
      natureRule: plantVialte.naRule, //自然人表单规则
      legalRule: plantVialte.legalRule, //法人表单规则
      nolegalRule: plantVialte.nolegalRule, //法人表单规则
      legalList: plantVialte.legealList, //法人申请数据
      notlegealList: plantVialte.notlegealList, //非法人申请数据
      confirmPlantList: [], //要提交的列表
      //所有的填写信息共用info
      infos: {
        formValidate: [
          [
            {
              //自然人
              name: "", //名字
              identityCard: "", //身份证号码&社会统一信用代码
              litigantBirthday: "", //出生日期
              litigantSex: "", //性别
              litigantNation: "", //民族
              litigantPermanentAddress: "", //户籍地址
              address: "", //常住地址 & 注册地址
              serviceAddress: "", //文书送达地址
              phone: "", //手机号 & 单位固定电话
              email: "", //电子邮箱 & 单位电子邮箱
              businessLicense: "qqq", //个人身份证明文件 & 单位证明文件

              //法人&非法人组织
              legalManName: "", //法定代表人
              legalManPhone: "", //法定代表人手机号
              legalManId: "", //法定代表人身份证号码
              legalIdentity: "qqq", //法定代表人身份证明文件

              plantiffId: "plant_0", //自定义id
              layers: [], //律师代理人数组
              litigantType: "自然人", //类型

              // 上传的文件
              plant_fileName1: "", //个人身份证明文件
              plant_fileName2: "", //单位证明文件-法人
              plant_fileName3: "", //单位证明文件-非法人
              plant_fileName4: "", //身份证明文件-法定代表人
              plant_fileName5: "", //身份证明文件-非法定代表人

              // 样式参数
              plantNowIndex: 0 //切换自然人法人按钮样式
            }
          ]
        ],
        natureRule: plantVialte.naRule, //自然人表单规则
        legalRule: plantVialte.legalRule, //法人表单规则
        nolegalRule: plantVialte.nolegalRule, //非法人表单规则
        legalList: plantVialte.legealList //法人申请数据
      }, //列表信息
      plantTempList: {}, //暂存列表
      //文件显示名称
      plant_fileName1: "q", //个人身份证明文件
      plant_fileName2: "q", //单位证明文件-法人
      plant_fileName3: "w", //单位证明文件-非法人
      plant_fileName4: "1", //身份证明文件-法定代表人
      plant_fileName5: "e" //身份证明文件-非法定代表人
    };
  },
  mounted() {
    //事件总线，为了与原告代理人通信
    Eventbus.$on("ft_plant_receiveStep2", payLoad => {
      this.ft_plant_receiveStep2(payLoad);
    });
  },
  computed: {
    //取到ID值，commit的时候会自增ID
    ft_plant_getId() {
      return this.$store.state.setcaseModules.plantiffId;
    }
  },

  methods: {
    //接收第二步的信息
    ft_plant_receiveStep2(payLoad) {
      this.confirmPlantList = payLoad;
    },

    //切换选项卡，记录类型为了form校验
    ft_handleChgStep1_tab(data, name, index) {
      data.litigantType = name;
      data.plantNowIndex = index;
      // if(this.plantNowIndex == 1 || this.plantNowIndex == 2){
      //   this.isRight = true;
      // }else{
      //   this.isRight = false;
      // }
    },

    //表单验证
    ft_handleFormValid_step1() {
      this.$store.commit("addPlantiffId"); //ID自增长
      let data = {
        name: "", //名字
        identityCard: "", //身份证号码&社会统一信用代码
        litigantBirthday: "", //出生日期
        litigantSex: "", //性别
        litigantNation: "", //民族
        litigantPermanentAddress: "", //户籍地址
        address: "", //常住地址 & 注册地址
        serviceAddress: "", //文书送达地址
        phone: "", //手机号 & 单位固定电话
        email: "", //电子邮箱 & 单位电子邮箱
        businessLicense: "", //个人身份证明文件 & 单位证明文件

        //法人&非法人组织
        legalManName: "", //法定代表人
        legalDuty:"",//法定代表人职务
        legalManPhone: "", //法定代表人手机号
        legalManId: "", //法定代表人身份证号码
        legalIdentity: "", //法定代表人身份证明文件

        plantiffId: this.ft_plant_getId, //自定义id
        layers: [], //律师代理人数组
        litigantType: "自然人", //类型

        // 样式参数
        plantNowIndex: 0, //切换自然人法人按钮样式

        // 上传的文件
        plant_fileName1: "", //个人身份证明文件
        plant_fileName2: "", //单位证明文件-法人
        plant_fileName3: "", //单位证明文件-非法人
        plant_fileName4: "", //身份证明文件-法定代表人
        plant_fileName5: "" //身份证明文件-非法定代表人
      };
      //为了使得每次打开都是最后一次添加的
      if (this.openAry.length > 0) {
        for (let i = 0; i < this.openAry.length; i++) {
          if (
            this.openAry[i] ==
            this.infos.formValidate[this.infos.formValidate.length - 1][0]
              .plantiffId
          ) {
            this.openAry.splice(i, 1);
          }
        }
      }
      //数组添加形成多个面板
      this.openAry.push(this.ft_plant_getId);
      let ary = [];
      ary.push(data);
      this.infos.formValidate.push(ary);
    },

    //获取日期
    ft_plant_chgBirth(event) {
      let plantBirthTemp = tools_transDate(event);
      this.natureList.litigantBirthday = plantBirthTemp;
    },

    // 计算出生年月和日期
    plant_autoFillId(data) {
      let obj = tools_calcIdentiyInfo(data.identityCard);
      data.litigantSex = obj.sex;
      data.litigantBirthday = obj.birth;
      return false;
      this.$refs.naFromRule.validateField("identityCard", res => {
        if (res == "") {
          let obj = tools_calcIdentiyInfo(this.natureList.identityCard);
          this.natureList.litigantSex = obj.sex;
          this.natureList.litigantBirthday = obj.birth;
        }
      });
    },
    //进行下一步操作
    ft_plantNext() {
      let formData=JSON.parse(JSON.stringify(this.infos.formValidate))
      var isPass=true;
      formData.forEach((item, index) => {
        item.forEach((data, key) => {
          let form = "";
          if (data.litigantType == "自然人") {
            form = "natureRule" + index + key;
          } else if (data.litigantType == "法人") {
            form = "legalRule" + index + key;
          } else if (data.litigantType == "非法人组织") {
            form = "legalRule2" + index + key;
          }
          this.$refs[form][0].validate(valid => {
            if (valid) {
              formData.forEach((item, index) => {
                item[0].litigantBirthday = new Date(item[0].litigantBirthday).getTime()//转时间戳
                this.confirmPlantList.push(item[0]);
              });
              this.confirmPlantList = this.confirmPlantList.reverse();
              let obj = {};
              //对象去重，双重for每次push进入都会产生重复数据
              this.confirmPlantList = this.confirmPlantList.reduce(function(
                item,
                next
              ) {
                obj[next.plantiffId]
                  ? ""
                  : (obj[next.plantiffId] = true && item.push(next));
                return item;
              },
              []); 
            } else {
              isPass=false;
            }
          });
        });
      });
      if(isPass){
        this.ft_plantNextSetp();
        this.$Notice.success({ title: "添加成功!" });
      }else{
        this.$Notice.warning({ title: "请完善原告信息!" });
      }
    },
    //去重
    uniq(array, key) {
      var temp = []; //一个新的临时数组
      for (var i = 0; i < array.length; i++) {
        console.log(temp.plantiffId);
        if (temp.indexOf(array[i].plantiffId) == -1) {
          temp.push(array[i]);
        }
      }
      return temp;
    },
    //删除列表的时候，去除当前列表并把面板打开到剩余数组的最后一个
    delPlantiff(data) {
      this.infos.formValidate.forEach((item, index) => {
        if (item[0].plantiffId == data.plantiffId) {
          this.infos.formValidate.splice(index, 1);
        }
      });
      this.openAry.push(
        this.infos.formValidate[this.infos.formValidate.length - 1][0]
          .plantiffId
      );
    },

    //进行下一步
    ft_plantNextSetp() {
      //将第一步的原告列表传给第二步
      Eventbus.$emit("ft_toStep2", this.confirmPlantList);
      //将第一步的原告列表传给父组件
      this.$emit("ft_nextStep_tab", {
        nowIndex: 1,
        plaintiffs: this.confirmPlantList
      });
    },

    //清空表单
    ft_plantReset(name) {
      this.$refs[name].resetFields();
    },

    //上传文件
    plant_uploadSuccess(res) {
      if (res.state === 100) {
        this.$Message.success(res.message);
        let data = res.data.result[0];
        this.infos.formValidate.forEach((item, index) => {
          if (item[0].plantiffId == data.id) {
            switch (data.fileType) {
              case "个人身份证明文件":
                item[0].businessLicense = data.filePath;
                item[0].plant_fileName1 = data.fileName;
                break;
              case "单位证明文件":
                if (item[0].plantNowIndex === 1) {
                  item[0].businessLicense = data.filePath;
                  item[0].plant_fileName2 = data.fileName;
                } else if (item[0].plantNowIndex === 2) {
                  item[0].businessLicense = data.filePath;
                  item[0].plant_fileName3 = data.fileName;
                }
                break;
              case "法定代表人身份证明文件":
                if (item[0].plantNowIndex === 1) {
                  item[0].legalIdentity = data.filePath;
                  item[0].plant_fileName4 = data.fileName;
                } else if (item[0].plantNowIndex === 2) {
                  item[0].legalIdentity = data.filePath;
                  item[0].plant_fileName5 = data.fileName;
                }
                break;
              default:
                break;
            }
          }
        });
        console.log(this.infos.formValidate);
      } else {
        this.$Message.error(res.message);
      }
    },

    //清空表单
    ft_step1_restForm() {
      this.$refs["naFromRule"].resetFields();
      this.$refs["legalFromRule"].resetFields();
      this.$refs["notlegalFromRule"].resetFields();
      this.plant_fileName1 = "";
      this.plant_fileName2 = "";
      this.plant_fileName3 = "";
      this.plant_fileName4 = "";
      this.plant_fileName5 = "";
      this.confirmPlantList = [];
      this.plantTempList = {};
    },
    formatDate(date) {
      var d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();
      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;
      return [year, month, day].join("-");
    },
    time() {
      if (this.confirmPlantList.length != 0) {
        this.confirmPlantList.forEach(item => {
          if (item.litigantBirthday) {
            debugger
            item.litigantBirthday = this.formatDate(
              new Date(item.litigantBirthday).toLocaleDateString()
            );
          }
        });
      }
      console.log(this.confirmPlantList);
    }
  },

  beforeDestroy() {
    this.$Message.destroy();
  }
};
</script>

