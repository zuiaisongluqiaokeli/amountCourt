<template>
  <div class="ft-plant-div1">
    <div class="ft-plant-div2">
      <Form
        :model="keyList"
        label-position="right"
        :label-width="230"
        :rules="keyRule"
        ref="keyFromRule"
        style="margin:40px auto;width:821px"
      >
        <FormItem label="案号" class="ft_form ft-plant-chooseType" prop="caseNo">
          <Input v-model="keyList.caseNo" placeholder="请输入案号（非必填）"></Input>
        </FormItem>
        <FormItem
          label="案件类型"
          class="ft_form ft-plant-chooseType ft-plant-slectType"
          prop="lawCaseType"
        >
          <Select v-model="keyList.lawCaseType" style="width:300px" placeholder="请选择案件类型" :disabled="true" filterable>
            <Option v-for="(item,index) in briefAry" :key="index" :value="item.type">{{item.name}}</Option>
            <Option value="0">其他案件</Option>
          </Select>
        </FormItem>
        <FormItem label="诉讼标的(元)" class="ft_form ft-plant-chooseType" prop="applyStandard">
          <Input
            v-model="keyList.applyStandard"
            @on-blur="onNumberChange($event,keyList,'applyStandard')"
            placeholder="请输入诉讼标的"
          ></Input>
        </FormItem>
        <FormItem label="诉讼请求" class="ft_form ft-plant-chooseType" prop="litigationRequest">
          <Input
            v-model="keyList.litigationRequest"
            type="textarea"
            placeholder="书写格式规范：
            1.序号后用“.”而非“、”
            2.不出现“原告”、“被告”字样，直接用原告、被告的姓名表述
            3.不出现多余的空格
            4.请求支付实现债权费用的一项，表述为：“判令XXX偿付XX费用XX元、XX费用XX元...“"
            :rows="6"
          ></Input>
        </FormItem>
        <FormItem label="事实与理由(字数限制800字以下)" class="ft_form ft-plant-chooseType" prop="reason">
          <Input
            v-model="keyList.reason"
            type="textarea"
            placeholder="请输入事实与理由(字数限制800字以下)"
            :rows="4"
            :maxlength="800"
          ></Input>
        </FormItem>

        <!-- 金融案件 -->
        <Finance v-show="keyList.lawCaseType==='1'" ref="finance" :keyList="keyList"></Finance>

        <!-- 保证保险合同追偿 -->
        <Insurance
          v-show="keyList.lawCaseType==='2'"
          ref="insurance"
          :secureList="secureList"
        ></Insurance>

        <!-- 信用卡纠纷 -->
        <Creditcard
          v-show="keyList.lawCaseType==='3'"
          ref="creditcard"
          :creditCaseBaseInfo="creditCaseBaseInfo"
        ></Creditcard>
      </Form>

      <div class="ft-agent-footer">
        <a
          href="javascript:void(0)"
          class="ft_public3"
          @click="ft_keyinfo_toStep5('keyFromRule')"
        >确认修改</a>
      </div>
    </div>
  </div>
</template>

<script>
import keyInfoRule from "./keyinfo/componets/keyinfo.js";
import { tools_transDate, tools_objHasStr } from "@/libs/tools.js";
import Finance from "./keyinfo/componets/finance.vue"; //金融借款
import Insurance from "./keyinfo/componets/insurance.vue"; //保险保证
import Creditcard from "./keyinfo/componets/creditcard.vue"; //信用卡纠纷
import { essential, essentialSave } from "@/api/caseInfo";
import { briefList} from '@/api/setcase.js'
export default {
  data() {
    return {
      keyRule: keyInfoRule.Rule, // 表单验证规则
      isNatureInfo: true,
      keyList: {
        lawCaseType: "0", //案件类型
        applyStandard: NaN, //标的
        litigationRequest: "", //诉讼请求
        reason: "", //事实与理由
      }, //信息列表
      secureList: {}, //保证保险合同追偿
      creditCaseBaseInfo: {},//信用卡纠纷
      //案由列表 {名称、案由类型ID、支持的文件类型}
      briefAry:[],
    };
  },
  components: {
    Finance,
    Insurance,
    Creditcard
  },
  mounted() {},
  methods: {
    init(){//初始化
      console.log("init")
      //获取案由
      briefList().then(res=>{
        if(res.data.state === 100) {
          let data=res.data.data;
          console.log("data",data)
          this.briefAry=data;
          this.getEssential();
        }else{
          this.$Message.error(res.data.message);
        }
      })
    },
    getEssential() {
      let data = [];
      data.push(this.$store.getters.caseId);
      essential(data).then(res => {
        console.log("数据开始请求！");
        if (res.data.state == 100) {
          console.log("数据请求完毕！");
          let keyList = res.data.data[0];
          keyList.applyStandard = keyList.applyStandard.toString();
          if (keyList.lawCaseType === "金融借款合同纠纷") {
            // 更改字段
            if (keyList.debtNewlyEndTime) {
              keyList.debtNewlyEndTime = keyList.debtNewlyEndTime.split(" ")[0];
            }

            keyList.creditContract.forEach((item, index) => {
              if (item.terminateContract == false) {
                item.terminateContract = "否";
              } else {
                item.terminateContract = "是";
              }
              if (item.signDate) {
                item.signDate = item.signDate.split(" ")[0];
              }
            });
            keyList.ensureContract.forEach((item, index) => {
              if (item.signDate) {
                item.signDate = item.signDate.split(" ")[0];
              }
            });
            keyList.impawnContract.forEach((item, index) => {
              if (item.signDate) {
                item.signDate = item.signDate.split(" ")[0];
              }
            });
            keyList.mortgageContract.forEach((item, index) => {
              if (item.signDate) {
                item.signDate = item.signDate.split(" ")[0];
              }
              if (item.registerDate) {
                item.registerDate = item.registerDate.split(" ")[0];
              }
            });
            keyList.loanContract.forEach((item, index) => {
              if (item.terminateContract == false) {
                item.terminateContract = "否";
              } else {
                item.terminateContract = "是";
              }
              if (item.signDate) {
                item.signDate = item.signDate.split(" ")[0];
              }
            });
            if (keyList.coupleCommonDebt == false) {
              keyList.coupleCommonDebt = "否";
            } else {
              keyList.coupleCommonDebt = "是";
            }
          }
          if (
            keyList.lawCaseType === "保证保险合同纠纷" ||
            keyList.lawCaseType === "其他案件"
          ) {
            let arr = [
              "claimsDate",
              "debtNewlyEndTime",
              "defaultMoneyDate",
              "insurancePeriod",
              "insureDate",
              "loanContractDate",
              "loanIssuanceDate",
              "overdueRepaymentTime"
            ];
            arr.forEach(item => {
              if (keyList.item) {
                keyList.item = keyList.item.split(" ")[0];
              }
            });
            this.secureList = keyList;
          }
          if (keyList.lawCaseType === "信用卡纠纷") {
            //夫妻共同财产

          
              if (keyList.coupleCommonDebt == false) {
                //coupleShow是夫妻的switch开关
                keyList.coupleShow = false
                keyList.coupleCommonDebt = "否";
              } else {
                keyList.coupleShow = true
                keyList.coupleCommonDebt = "是";
              }

            //时间格式转化
            if (keyList.cridtCardList[0].ensureContract.length) {
              keyList.cridtCardList.forEach((item, index) => {
                item.sw2 = true;
                item.ensureContract.forEach((item1, index1) => {
                  if (item1.signDate) {
                    item1.signDate = item1.signDate.split(" ")[0];
                  }
                });
              });
            }
            if (keyList.cridtCardList[0].mortgageContract.length) {
              keyList.cridtCardList.forEach((item, index) => {
                item.sw3 = true;
                item.mortgageContract.forEach((item1, index1) => {
                  if (item1.signDate) {
                    item1.signDate = item1.signDate.split(" ")[0];
                  }
                  if (item.registerDate) {
                    item.registerDate = item.registerDate.split(" ")[0];
                  }
                });
              });
            }
            if (keyList.cridtCardList[0].impawnContract.length) {
              keyList.cridtCardList.forEach((item, index) => {
                item.sw4 = true;
                item.impawnContract.forEach((item1, index1) => {
                  if (item1.signDate) {
                    item1.signDate = item1.signDate.split(" ")[0];
                  }
                  if (item.registerDate) {
                    item.registerDate = item.registerDate.split(" ")[0];
                  }
                });
              });
            }

            let arr = [
              "creditNewArrearsDate",
              "marryTime",
              "divorceDate",
              "mediateDate",
              "applyPayDate",
              "doPayDate",
              "endSupervisionDate"
            ];
            arr.forEach(item => {
              if (keyList.item) {
                keyList.item = keyList.item.split(" ")[0];
              }
            });
            this.creditCaseBaseInfo = keyList;
          }
          // 获取lawCaseType
          let lawCaseType=keyList.lawCaseType;
          this.briefAry.forEach((item,index) => {
             if(lawCaseType==item.name){
                keyList.lawCaseType=item.type;
             }
          });
          this.keyList = keyList;
          console.log("keylist", this.keyList);
        } 
      });
    },

    // 表单验证
    ft_keyinfo_toStep5(name) {
      this.$refs[name].validate(valid => {
        console.log(valid);
        if (valid) {
          this.ft_handle_dealAgentTotalData(1);
        } else {
          this.$Notice.warning({ title: "信息未填写完全" });
        }
      });
    },

    //解决浅拷贝
    ft_handle_assignObj(obj) {
      return JSON.parse(JSON.stringify(obj));
    },
    //除了object和arr以外输出的格式string
    characterObject(obj) {
      for (var value in obj) {
        if (obj[value]) {
          let tag = true;
          switch (typeof obj[value]) {
            case "array":
            case "object":
              tag = false;
              break;
          }
          if (tag) {
            obj[value] = obj[value].toString();
          }
        } else {
          obj[value] = "";
        }
      }
    },
    characterCreditcard(obj) {
      for (var value in obj) {
        if (obj[value]) {
          let tag = true;
          switch (typeof obj[value]) {
            case "array":
            case "object":
              tag = false;
              break;
          }
          if (tag) {
            obj[value] = obj[value].toString();
          }
          if (!tag) {
            for (var val in value) {
              if (value[val]) {
                let flag = true;
                switch (typeof value[val]) {
                  case "array":
                  case "object":
                    tag = false;
                    break;
                }
              }
              if (flag) {
                value[val] = value[val].toString();
              }
            }
          }
        } else {
          obj[value] = "";
        }
      }
    },
    //因为是用switch的，没有写的就删除数组，填写的就拷贝传给父元素
    ft_handle_dealAgentTotalData(index) {
      //普通要素信息
      let baseData = {
        caseNo: this.keyList.caseNo,
        lawCaseType: this.keyList.lawCaseType, //案件类型
        litigationRequest: this.keyList.litigationRequest, //诉讼请求
        applyStandard: this.keyList.applyStandard, //标的
        reason: this.keyList.reason, //事实理由
      };
      let arr=[];
      //金融借款案件
      if (this.keyList.lawCaseType === "1") {
        let keyList = JSON.parse(JSON.stringify(this.$refs.finance.keyList));
        keyList.creditContract.forEach((item, index) => {
          item.money = item.money ? item.money.toString() : "";
        });
        keyList.loanContract.forEach((item, index) => {
          item.money = item.money ? item.money.toString() : "";
        });

        //授信合同是否填写
        keyList.creditContract.forEach((item, index) => {
          if (item.name == "") {
            keyList.creditContract.splice(index, 1); //无填写删除
          }
          if (!item.contractId) {
            item.contractId = "";
          }
        });

        //借款合同是否填写
        keyList.loanContract.forEach((item, index) => {
          if (item.name == "") {
            keyList.loanContract.splice(index, 1); //无填写删除
          }
          if (!item.contractId) {
            item.contractId = "";
          }
        });

        //保证合同是否填写
        keyList.ensureContract.forEach((item, index) => {
          if (item.name == "") {
            keyList.ensureContract.splice(index, 1); //无填写删除
          }
          if (!item.contractId) {
            item.contractId = "";
          }
        });

        //抵押合同是否填写
        keyList.mortgageContract.forEach((item, index) => {
          if (item.name == "") {
            keyList.mortgageContract.splice(index, 1); //无填写删除
          }
          if (!item.contractId) {
            item.contractId = "";
          }
          if (item.registerDate) {
            item.registerDate = item.registerDate.split(" ")[0];
          }
        });

        //质押合同是否填写
        keyList.impawnContract.forEach((item, index) => {
          if (item.name == "") {
            keyList.impawnContract.splice(index, 1); //无填写删除
          }
          if (!item.contractId) {
            item.contractId = "";
          }
        });
        this.characterObject(keyList);
        let newData = Object.assign(baseData, keyList);
        arr.push(newData);
        console.log(arr)
        //保障保险案件
      } else if (this.keyList.lawCaseType === "2") {
        let keyList = JSON.parse(
          JSON.stringify(this.$refs.insurance.secureList)
        );
        this.characterObject(keyList);
        let newData = Object.assign(baseData, keyList);
        arr.push(newData);
        console.log(arr)
        //信用卡案件
      } else if (this.keyList.lawCaseType === "3") {
        let keyList = JSON.parse(
          JSON.stringify(this.$refs.creditcard.creditCaseBaseInfo)
        );
        this.characterObject(keyList);
        keyList.cridtCardList.forEach((item, index, arr) => {
          for (const key in item) {
            if (
              key == "ensureContract" ||
              key == "impawnContract" ||
              key == "mortgageContract"
            ) {
            } else {
              if (item[key]) {
                item[key] = item[key].toString();
                console.log(typeof item[key]);
              } else {
                item[key] = "";
              }
            }
          }
        });
        //判断信用卡是否填写
        keyList.cridtCardList.forEach((item, index) => {
          if (item.creditCardId == "") {
            keyList.cridtCardList.splice(index, 1); //无填写删除
          }
        });
        //判断信用卡合同是否填写
        keyList.cridtCardList.forEach((item, index) => {
          //保证合同是否填写
          item.ensureContract.forEach((item1, index1) => {
            if (item1.name == "") {
              item.ensureContract.splice(index1, 1); //无填写删除
            }
            if (!item.contractId) {
              item.contractId = "";
            }
          });
          //抵押合同是否填写
          item.mortgageContract.forEach((item1, index1) => {
            if (item1.name == "") {
              item.mortgageContract.splice(index1, 1); //无填写删除
            }
            if (!item.contractId) {
              item.contractId = "";
            }
          });
          //质押合同是否填写
          item.impawnContract.forEach((item1, index1) => {
            if (item1.name == "") {
              item.impawnContract.splice(index1, 1); //无填写删除
            }
            if (!item.contractId) {
              item.contractId = "";
            }
          });
        });
        let newData = Object.assign(baseData, keyList);
        arr.push(newData);
        console.log(arr)
      }else{//其他案件
        let newData = Object.assign({}, baseData);
        arr.push(newData);
        console.log(arr)
      }
      essentialSave(arr).then(res => {
        if (res.data.state == 100) {
          this.$Notice.success({
            title: "修改成功",
            desc: res.data.message,
            duration: 5
          });
        }
      });
    },
    //清空表单
    ft_step4_restForm() {
      this.$refs["keyFromRule"].resetFields();
    },
    //过滤金额保留2位
    onNumberChange(e, obj, prop) {
      obj[prop] = obj[prop]
        ? parseFloat(obj[prop])
            .toFixed(2)
            .toString()
        : "";
    }
  }
};
</script>

<style type="text/css">
.ft-plant-div1 {
  width: 100%;
  text-align: center;
}

.ft-plant-div2 {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  text-align: left;
}

.ft-plant-p1 {
  color: #3d6ac1;
  font-size: 20px;
  white-space: nowrap;
  margin-right: 10px;
}

.ft-plant-a1 {
  width: auto;
  display: inline-block;
  white-space: nowrap;
  padding: 0 20px 0 20px;
  height: auto;
  border-radius: 30px;
  line-height: 30px;
  margin: 0 10px 0 10px;
  color: #3a5c8b;
  border: 1px solid #e9eef8;
}

.ft-plant-a1:hover {
  color: #3a5c8b;
}

.plant_active {
  background: #2f60bd;
  color: #fff !important;
}

.ft_form {
  margin: 20px 100px 20px 20px;
}

.ft_form input {
  width: 300px;
  border-radius: 30px;
}

.ft_public1 {
  text-align: left;
  margin-top: 40px;
  margin-bottom: 30px;
}

.ft_public2 {
  width: 124px !important;
  font-size: 16px !important;
  height: 35px !important;
  border-radius: 10px !important;
  display: block;
  border: 1px solid #dedfe2;
  margin-left: 77px !important;
  text-align: center;
  padding: 0 !important;
  margin: 0 auto !important;
}

.ft-accused-btn1 {
  width: 300px;
  height: 60px;
  vertical-align: bottom;
  display: inline-block;
  white-space: nowrap;
  text-align: center;
  font-size: 17px !important;
  border-radius: 7px !important;
  line-height: 60px;
  margin: -20px 10px 0 30px;
  color: #4873c5;
  border: 1px solid #e9eef8;
}

.ft_public3 {
  width: 300px;
  height: 60px;
  display: inline-block;
  white-space: nowrap;
  background: #4873c5;
  text-align: center;
  font-size: 20px;
  border-radius: 10px;
  line-height: 60px;
  margin: -20px 10px 0 10px;
  color: #fff;
  border: 1px solid #e9eef8;
}

.ft-public-color {
  color: #2f60bd !important;
  font-size: 16px !important;
}
.iconSet {
  font-size: 50px;
  cursor: pointer;
}

.toolT {
  float: right;
  margin-right: 55px;
  margin-top: 20px;
}

.ivu-collapse {
  /* background-color: #f7f7f7; */
  border-radius: 3px;
  border-bottom: 1px solid #dddee1;
  border-right: none;
  border-left: none;
  border-top: none;
  background-color: #fff;
  margin-top: 15px;
}

.ivu-collapse-header {
  text-align: left;
}
.myTooltip.ivu-tooltip {
  float: right;
}
i.myCloseIco.ivu-icon.ivu-icon-ios-close {
  font-size: 35px !important;
}
.ft-agent-footer {
  text-align: center;
}
</style>
