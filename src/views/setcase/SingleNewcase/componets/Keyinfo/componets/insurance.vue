<template>
  <div>
    <FormItem label="保证保险合同名称" class="ft_form ft-plant-chooseType" prop="insuranceName">
      <Input v-model="secureList.insuranceName" placeholder="请输入保证保险合同名称"></Input>
    </FormItem>
    <FormItem label="保险单编号" class="ft_form ft-plant-chooseType" prop="policyNo">
      <Input v-model="secureList.policyNo" placeholder="请输入保险单编号"></Input>
    </FormItem>
    <FormItem label="投保日期" class="ft_form ft-plant-chooseType" prop="insureDate">
      <DatePicker
        type="date"
        :editable="false"
        placeholder="请选择投保日期"
        :clearable="false"
        format="yyyy年MM月dd日"
        style="width: 300px"
        :value="secureList.insureDate"
        @on-change="ft_keyInfo_chgSecureDate($event,'insureDate')"
      ></DatePicker>
    </FormItem>
    <FormItem label="投保人" class="ft_form ft-plant-chooseType" prop="policyHolders">
      <Input v-model="secureList.policyHolders" placeholder="请输入投保人"></Input>
    </FormItem>
    <FormItem label="被投保人" class="ft_form ft-plant-chooseType" prop="insured">
      <Input v-model="secureList.insured" placeholder="请输入被投保人"></Input>
    </FormItem>
    <FormItem label="保险金额（元）" class="ft_form ft-plant-chooseType" prop="insuranceMoney">
      <Input v-model="secureList.insuranceMoney" @on-blur="onNumberChange($event,secureList,'insuranceMoney')"  placeholder="请输入保险金额（元）"></Input>
    </FormItem>
    <FormItem label="每月保费（元）" class="ft_form ft-plant-chooseType" prop="monthPremium">
      <Input v-model="secureList.monthPremium" @on-blur="onNumberChange($event,secureList,'monthPremium')" placeholder="请输入每月保费（元）"></Input>
    </FormItem>
    <FormItem label="理赔条件" class="ft_form ft-plant-chooseType" prop="claimsCondition">
      <Input v-model="secureList.claimsCondition" placeholder="请输入理赔条件"></Input>
    </FormItem>
    <FormItem label="违约条款" class="ft_form ft-plant-chooseType" prop="defaultClause">
      <Input v-model="secureList.defaultClause" placeholder="请输入违约条款"></Input>
    </FormItem>
    <FormItem label="拖欠贷款日期" class="ft_form ft-plant-chooseType" prop="defaultMoneyDate">
      <DatePicker
        type="date"
        :editable="false"
        placeholder="请选择拖欠贷款日期"
        :clearable="false"
        format="yyyy年MM月dd日"
        style="width: 300px"
        :value="secureList.defaultMoneyDate"
        @on-change="ft_keyInfo_chgSecureDate($event,'defaultMoneyDate')"
      ></DatePicker>
    </FormItem>
    <!-- <FormItem label="理赔时间" class="ft_form ft-plant-chooseType" prop="claimsDate">
      <Input v-model="secureList.claimsDate" placeholder="请输入理赔时间"></Input>
    </FormItem> -->
    <FormItem label="理赔时间" class="ft_form ft-plant-chooseType" prop="claimsDate">
      <DatePicker
        type="date"
        :editable="false"
        placeholder="请选择理赔时间"
        :clearable="false"
        format="yyyy年MM月dd日"
        style="width: 300px"
        :value="secureList.claimsDate"
        @on-change="ft_keyInfo_chgSecureDate($event,'claimsDate')"
      ></DatePicker>
    </FormItem>
    <FormItem label="理赔金额（元）" class="ft_form ft-plant-chooseType" prop="claimsMoney">
      <Input v-model="secureList.claimsMoney" @on-blur="onNumberChange($event,secureList,'claimsMoney')" placeholder="请输入理赔金额（元）"></Input>
    </FormItem>
    <FormItem label="尚欠保费（元）" class="ft_form ft-plant-chooseType" prop="defaultPremium">
      <Input v-model="secureList.defaultPremium" @on-blur="onNumberChange($event,secureList,'defaultPremium')" placeholder="请输入尚欠保费（元）"></Input>
    </FormItem>
    <FormItem label="催收费用（元）" class="ft_form ft-plant-chooseType" prop="collectionMoney">
      <Input v-model="secureList.collectionMoney" @on-blur="onNumberChange($event,secureList,'collectionMoney')" placeholder="请输入催收费用（元）"></Input>
    </FormItem>
    <FormItem label="借款合同名称" class="ft_form ft-plant-chooseType" prop="loanContractName">
      <Input v-model="secureList.loanContractName" placeholder="请输入借款合同名称"></Input>
    </FormItem>
    <FormItem label="借款合同编号" class="ft_form ft-plant-chooseType" prop="loanContractNo">
      <Input v-model="secureList.loanContractNo" placeholder="请输入借款合同编号"></Input>
    </FormItem>
    <FormItem label="借款合同签订时间" class="ft_form ft-plant-chooseType" prop="loanContractDate">
      <DatePicker
        type="date"
        :editable="false"
        placeholder="请选择借款合同签订时间"
        :clearable="false"
        format="yyyy年MM月dd日"
        style="width: 300px"
        :value="secureList.loanContractDate"
        @on-change="ft_keyInfo_chgSecureDate($event,'loanContractDate')"
      ></DatePicker>
    </FormItem>
    <FormItem label="借款人" class="ft_form ft-plant-chooseType" prop="borrower">
      <Input v-model="secureList.borrower" placeholder="请输入借款人"></Input>
    </FormItem>
    <FormItem label="出借人" class="ft_form ft-plant-chooseType" prop="lender">
      <Input v-model="secureList.lender" placeholder="请输入出借人"></Input>
    </FormItem>
    <FormItem label="借款本金（元）" class="ft_form ft-plant-chooseType" prop="loanPrincipal">
      <Input v-model="secureList.loanPrincipal" @on-blur="onNumberChange($event,secureList,'loanPrincipal')" placeholder="请输入借款本金"></Input>
    </FormItem>
    <!-- <FormItem label="借款期限" class="ft_form ft-plant-chooseType" prop="loanPeriod">
      <DatePicker
        type="date"
        :editable="false"
        placeholder="请选择借款期限"
        :clearable="false"
        format="yyyy年MM月dd日"
        style="width: 300px"
        :value="secureList.loanPeriod"
        @on-change="ft_keyInfo_chgSecureDate($event,'loanPeriod')"
      ></DatePicker>
    </FormItem> -->
    <FormItem label="借款期限" class="ft_form ft-plant-chooseType" prop="loanPeriod">
      <Input v-model="secureList.loanPeriod" placeholder="请输入借款期限"></Input>
    </FormItem>
    <FormItem label="还款方式" class="ft_form ft-plant-chooseType ft-plant-slectType" prop="repaymentMethod">
      <Select v-model="secureList.repaymentMethod" style="width:300px" filterable>
        <Option value="等额本息">等额本息</Option>
      </Select>
    </FormItem>
    <FormItem label="借款发放日期" class="ft_form ft-plant-chooseType" prop="loanIssuanceDate">
      <DatePicker
        type="date"
        :editable="false"
        placeholder="请选择借款发放日期"
        :clearable="false"
        format="yyyy年MM月dd日"
        style="width: 300px"
        :value="secureList.loanIssuanceDate"
        @on-change="ft_keyInfo_chgSecureDate($event,'loanIssuanceDate')"
      ></DatePicker>
    </FormItem>
    <FormItem label="送达约定" class="ft_form ft-plant-chooseType" prop="sendAppointment">
      <Input v-model="secureList.sendAppointment" placeholder="请输入送达约定"></Input>
    </FormItem>
  </div>
</template>

<script>
import keyInfoRule from "../keyinfo.js";
import { tools_transDate, tools_objHasStr } from "@/libs/tools.js";
export default {
  components: {},
  data() {
    return {
      secureList: keyInfoRule.secureList //保证保险合同追偿
    };
  },
  methods: {
    // 处理单个时间格式
    ft_keyinfo_chgTime(listName, keyName, event) {
      this[listName][keyName] = tools_transDate(event);
    },

    // 同步时间范围格式
    ft_keyinfo_chgTimeArea(listName, keyName, event) {
      this[listName][keyName] = event;
    },
    //保障保证合同追偿日期绑定
    ft_keyInfo_chgSecureDate(e, key) {
      this.ensureList[key] = e;
    },
    onNumberChange(e,obj,prop){//过滤金额
      obj[prop] = e.target.value ? parseFloat(e.target.value).toFixed(2).toString() : ''
    },
  }
};
</script>

<style>
</style>

