<template>
  <div class='ft-plant-div1'>
    <Collapse simple v-model="openAry">
      <Panel :name="item.plantiffId"  v-for="(item, index) in accused_confirmList" :key="'info1'+index">
        {{item.name ? item.name :"暂无被告姓名(点此填写)"}}
        <div slot="content" class="ft-plant-div2">
          <Form :model="item" :label-width="190" :ref="'info1'+index" style="margin:0 auto">
            <Tooltip content="删除当前被告" v-show="accused_confirmList.length >1" @click.native="delPlantiff(accused_confirmList,item,'openAry')" placement="bottom">
              <Icon type="ios-close"  class="iconSet"/>
            </Tooltip>
            <FormItem label="被告类型" class="ft_form ft-plant-chooseType" >
                <a href="javascript:void(0)" v-for="(item2,index2) in orgrin" :key="'info1'+index+index2"  @click="changePlantStep(item,item2.name,index2)" :class="index2==item.accusedPlantNowIndex?'plant_active ft-plant-a1':'ft-plant-a1'">{{item2.name}}</a>
                <a href="javascript:void(0)" style="margin-left:30px;visibility:hidden" class='ft-plant-a1'>从我的委托人库中选择</a>
            </FormItem>
            <!-- 自然人 -->
            <div v-show="item.litigantType == '自然人'" style="width:820px">
              <Form :model="item" label-position="right" :label-width="190" :rules="accused_natureRule" :ref="'accusedFromRule'+index" style="margin:0 auto">
                <FormItem label="姓名" class="ft_form ft-plant-chooseType" prop="name">
                    <Input v-model="item.name" placeholder="必填"></Input>
                </FormItem>
                  <FormItem label="公民身份证号" class="ft_form ft-plant-chooseType" prop="identityCard">
                    <Input v-model="item.identityCard" placeholder="必填" @on-blur="mAccused_autoFillId(item,'accusedFromRule'+index)"></Input>
                </FormItem>
                <FormItem label="出生日期" class="ft_form ft-plant-chooseType" prop="litigantBirthday">
                    <DatePicker
                    type="date"
                    :editable="false"
                    :clearable="false"
                    format="yyyy年MM月dd日"
                    placeholder="请选择出生年月"
                    style="width: 300px"
                    :value="item.litigantBirthday"></DatePicker>
                </FormItem>
                  <FormItem label="性别" class="ft_form ft-plant-chooseType"  prop="litigantSex">
                  <RadioGroup v-model="item.litigantSex" class="ft-confirm-radio">
                        <Radio label="男" class='ft-public-color'>男</Radio>
                        <Radio label="女" class='ft-public-color'>女</Radio>
                    </RadioGroup>
                </FormItem>
                  <FormItem label="民族" class="ft_form ft-plant-chooseType" prop="litigantNation">
                    <Select
                      v-model="item.litigantNation"
                      placeholder="请选择民族"
                      clearable
                      filterable
                    >
                      <Option
                        v-for="(item3,index3) in nationAry"
                        :value="item3.name"
                        :key="index3"
                      >{{ item3.name }}</Option>
                    </Select>
                </FormItem>
                  <FormItem label="户籍地址" class="ft_form ft-plant-chooseType" prop="litigantPermanentAddress">
                    <Input v-model="item.litigantPermanentAddress" placeholder="必填"></Input>
                </FormItem>
                  <FormItem label="常住地址" class="ft_form ft-plant-chooseType" prop="address">
                    <Input v-model="item.address" placeholder="选填"></Input>
                </FormItem>
                  <FormItem label="手机号" class="ft_form ft-plant-chooseType" prop="phone">
                    <Input v-model="item.phone" placeholder="选填"></Input>
                </FormItem>
                  <FormItem label="电子邮箱" class="ft_form ft-plant-chooseType" prop="email">
                    <Input v-model="item.email" placeholder="选填"></Input>
                </FormItem>
                <FormItem label="个人身份证明文件" class="ft_form ft-plant-upload ft-plant-chooseType" prop="businessLicense">
                    <Input v-model="item.businessLicense" placeholder="选填"></Input>
                    <span>{{item.accused_fileName1}}</span>
                    <Upload action="/api/court/case/upScanning.jhtml" class="ft-plant-upload-button" :on-success="(res)=> accused_uploadSuccess(res,accused_confirmList)" :data="{fileType:'个人身份证明文件',id:item.plantiffId}">
                        <Button type="ghost" icon="ios-cloud-upload-outline">选择文件</Button>
                    </Upload>
                </FormItem>
              </Form>
            </div>
            <!-- 法人 -->
            <div v-show="item.litigantType == '法人'" style="width:848px;">
              <Form :model="item" label-position="right" :label-width="200" :rules="accused_legalRule" :ref="'accusedLegalFromRule'+index" style="margin:0 auto">
                  <FormItem label="名称" class="ft_form ft-plant-chooseType" prop="name">
                      <Input v-model="item.name" placeholder="必填"></Input>
                  </FormItem>
                    <FormItem label="社会统一信用代码" class="ft_form ft-plant-chooseType" prop="identityCard">
                      <Input v-model="item.identityCard" placeholder="必填"></Input>
                  </FormItem>
                    <FormItem label="注册地址" class="ft_form ft-plant-chooseType" prop="address">
                      <Input v-model="item.address" placeholder="必填"></Input>
                  </FormItem>
                  <FormItem label="单位证明文件" class="ft_form ft-plant-upload ft-plant-chooseType" prop="businessLicense">
                      <Input v-model="item.businessLicense" placeholder="选填"></Input>
                      <span>{{item.accused_fileName2}}</span>
                      <Upload action="/api/court/case/upScanning.jhtml" class="ft-plant-upload-button" :on-success="(res)=> accused_uploadSuccess(res,accused_confirmList)" :data="{fileType:'单位证明文件',id:item.plantiffId}">
                          <Button type="ghost" icon="ios-cloud-upload-outline">选择文件</Button>
                      </Upload>
                  </FormItem>
                  <FormItem label="单位固定电话" class="ft_form ft-plant-chooseType" prop="phone">
                      <Input v-model="item.phone" placeholder="选填"></Input>
                  </FormItem>
                    <FormItem label="单位电子邮箱" class="ft_form ft-plant-chooseType" prop="email">
                      <Input v-model="item.email" placeholder="选填"></Input>
                  </FormItem>
                  <FormItem label="法定代表人" class="ft_form ft-plant-chooseType" prop="legalManName">
                      <Input v-model="item.legalManName" placeholder="必填"></Input>
                  </FormItem>
                  <FormItem label="法定代表人职务" class="ft_form ft-plant-chooseType" prop="legalDuty">
                      <Input v-model="item.legalDuty" placeholder="选填" clearable></Input>
                  </FormItem>
                  <FormItem label="法定代表人手机号" class="ft_form ft-plant-chooseType" prop="legalManPhone">
                      <Input v-model="item.legalManPhone" placeholder="选填"></Input>
                  </FormItem>
                    <FormItem label="法定代表人身份证号码" class="ft_form ft-plant-chooseType" prop="legalManId">
                      <Input v-model="item.legalManId" placeholder="选填"></Input>
                  </FormItem>
                  <FormItem label="法定代表人身份证明文件" class="ft_form ft-plant-upload ft-plant-chooseType" prop="legalIdentity">
                      <Input v-model="item.legalIdentity" placeholder="选填"></Input>
                      <span>{{item.accused_fileName4}}</span>
                      <Upload action="/api/court/case/upScanning.jhtml" class="ft-plant-upload-button" :on-success="(res)=> accused_uploadSuccess(res,accused_confirmList)" :data="{fileType:'法定代表人身份证明文件',id:item.plantiffId}">
                          <Button type="ghost" icon="ios-cloud-upload-outline">选择文件</Button>
                      </Upload>
                  </FormItem>
              </Form>
            </div>
            <!-- 非法人组织 -->
            <div v-show="item.litigantType == '非法人组织'"  style="width:848px;">
              <Form :model="item" label-position="right" :label-width="200" :rules="accused_legalRule" :ref="'accusednoLegalFromRule'+index" style="margin:0 auto">
                  <FormItem label="名称" class="ft_form ft-plant-chooseType" prop="name">
                      <Input v-model="item.name" placeholder="必填"></Input>
                  </FormItem>
                    <FormItem label="社会统一信用代码" class="ft_form ft-plant-chooseType" prop="identityCard">
                      <Input v-model="item.identityCard" placeholder="必填"></Input>
                  </FormItem>
                    <FormItem label="注册地址" class="ft_form ft-plant-chooseType" prop="address">
                      <Input v-model="item.address" placeholder="必填"></Input>
                  </FormItem>
                  <FormItem label="单位证明文件" class="ft_form ft-plant-upload ft-plant-chooseType" prop="businessLicense">
                      <Input v-model="item.businessLicense" placeholder="选填"></Input>
                      <span>{{item.accused_fileName3}}</span>
                      <Upload action="/api/court/case/upScanning.jhtml" class="ft-plant-upload-button" :on-success="(res)=> accused_uploadSuccess(res,accused_confirmList)" :data="{fileType:'单位证明文件',id:item.plantiffId}">
                          <Button type="ghost" icon="ios-cloud-upload-outline">选择文件</Button>
                      </Upload>
                  </FormItem>
                  <FormItem label="单位固定电话" class="ft_form ft-plant-chooseType" prop="phone">
                      <Input v-model="item.phone" placeholder="选填"></Input>
                  </FormItem>
                  <FormItem label="单位电子邮箱" class="ft_form ft-plant-chooseType" prop="email">
                      <Input v-model="item.email" placeholder="选填"></Input>
                  </FormItem>
                  <FormItem label="负责人" class="ft_form ft-plant-chooseType" prop="legalManName">
                      <Input v-model="item.legalManName" placeholder="必填"></Input>
                  </FormItem>
                  <FormItem label="负责人职务" class="ft_form ft-plant-chooseType" prop="legalDuty">
                      <Input v-model="item.legalDuty" placeholder="选填" clearable></Input>
                  </FormItem>
                  <FormItem label="负责人手机号" class="ft_form ft-plant-chooseType" prop="legalManPhone">
                      <Input v-model="item.legalManPhone" placeholder="选填"></Input>
                  </FormItem>
                  <FormItem label="负责人身份证号码" class="ft_form ft-plant-chooseType" prop="legalManId">
                      <Input v-model="item.legalManId" placeholder="选填"></Input>
                  </FormItem>
                  <FormItem label="负责人身份证明文件" class="ft_form ft-plant-upload ft-plant-chooseType" prop="legalIdentity">
                      <Input v-model="item.legalIdentity" placeholder="选填"></Input>
                      <span>{{item.accused_fileName5}}</span>
                      <Upload action="/api/court/case/upScanning.jhtml" class="ft-plant-upload-button" :on-success="(res)=> accused_uploadSuccess(res,accused_confirmList)" :data="{fileType:'法定代表人身份证明文件',id:item.plantiffId}">
                          <Button type="ghost" icon="ios-cloud-upload-outline">选择文件</Button>
                      </Upload>
                  </FormItem>
              </Form>
            </div>
          </Form>
        </div>
      </Panel>
    </Collapse>
    <!-- 提交按钮 -->
    <Form label-position="right" style="margin:0 auto -20px;width: 441px;margin-top:15px">
      <FormItem>
        <div class='ft_public1'>
          <a href="javascript:void(0)" style="" class="addCommon" @click="handleAdd(accused_confirmList,accused_obj)">增加共同被告</a>
        </div>
      </FormItem>
    </Form>
    <!-- 第三人信息表单 -->
    <Collapse simple v-model="openAry2" >
      <Panel :name="item.plantiffId"  v-for="(item,index) in third_confirmList" :key="'info2'+index">
        {{item.name ? item.name :"暂无第三人姓名(点此填写)"}}
        <div slot="content" class="ft-plant-div2">
          <Form :model="item" :label-width="190" :ref="'info2'+index"  style="margin:0 auto">
            <Tooltip content="删除当前第三人" @click.native="delPlantiff(third_confirmList,item,'openAry2')" placement="bottom">
              <Icon type="ios-close"  class="iconSet"/>
            </Tooltip>
            <FormItem label="第三人类型" class="ft_form ft-plant-chooseType" >
                <a href="javascript:void(0)" v-for="(item2,index2) in orgrin2" :key="'info2'+index +index2"  @click="changePlantStep(item,item2.name,index2)" :class="index2==item.accusedPlantNowIndex?'plant_active ft-plant-a1':'ft-plant-a1'">{{item2.name}}</a>
                <a href="javascript:void(0)" style="margin-left:30px;visibility:hidden" class='ft-plant-a1'>从我的委托人库中选择</a>
            </FormItem>
            <!-- 自然人 -->
            <div v-show="item.litigantType == '自然人'" style="width:820px">
              <Form :model="item" label-position="right" :label-width="190" :rules="accused_natureRule" :ref="'thirdFromRule'+index" style="margin:0 auto">
                <FormItem label="姓名" class="ft_form ft-plant-chooseType" prop="name">
                    <Input v-model="item.name" placeholder="必填"></Input>
                </FormItem>
                  <FormItem label="公民身份证号" class="ft_form ft-plant-chooseType" prop="identityCard">
                    <Input v-model="item.identityCard" placeholder="必填" @on-blur="mAccused_autoFillId(item,'thirdFromRule'+index)"></Input>
                </FormItem>
                <FormItem label="出生日期" class="ft_form ft-plant-chooseType" prop="litigantBirthday">
                    <DatePicker
                    type="date"
                    :editable="false"
                    :clearable="false"
                    format="yyyy年MM月dd日"
                    placeholder="请选择出生年月"
                    style="width: 300px"
                    :value="item.litigantBirthday"></DatePicker>
                </FormItem>
                  <FormItem label="性别" class="ft_form ft-plant-chooseType"  prop="litigantSex">
                  <RadioGroup v-model="item.litigantSex" class="ft-confirm-radio">
                        <Radio label="男" class='ft-public-color'>男</Radio>
                        <Radio label="女" class='ft-public-color'>女</Radio>
                    </RadioGroup>
                </FormItem>
                  <FormItem label="民族" class="ft_form ft-plant-chooseType" prop="litigantNation">
                    <Select
                      v-model="item.litigantNation"
                      placeholder="请选择民族"
                      clearable
                      filterable
                    >
                      <Option
                        v-for="(item3,index3) in nationAry"
                        :value="item3.name"
                        :key="index3"
                      >{{ item3.name }}</Option>
                    </Select>
                </FormItem>
                  <FormItem label="户籍地址" class="ft_form ft-plant-chooseType" prop="litigantPermanentAddress">
                    <Input v-model="item.litigantPermanentAddress" placeholder="必填"></Input>
                </FormItem>
                  <FormItem label="常住地址" class="ft_form ft-plant-chooseType" prop="address">
                    <Input v-model="item.address" placeholder="选填"></Input>
                </FormItem>
                  <FormItem label="手机号" class="ft_form ft-plant-chooseType" prop="phone">
                    <Input v-model="item.phone" placeholder="选填"></Input>
                </FormItem>
                  <FormItem label="电子邮箱" class="ft_form ft-plant-chooseType" prop="email">
                    <Input v-model="item.email" placeholder="选填"></Input>
                </FormItem>
                <FormItem label="个人身份证明文件" class="ft_form ft-plant-upload ft-plant-chooseType" prop="businessLicense">
                    <Input v-model="item.businessLicense" placeholder="选填"></Input>
                    <span>{{item.accused_fileName1}}</span>
                    <Upload action="/api/court/case/upScanning.jhtml" class="ft-plant-upload-button" :on-success="(res)=> accused_uploadSuccess(res,third_confirmList)" :data="{fileType:'个人身份证明文件',id:item.plantiffId}">
                        <Button type="ghost" icon="ios-cloud-upload-outline">选择文件</Button>
                    </Upload>
                </FormItem>
              </Form>
            </div>
            <!-- 法人 -->
            <div v-show="item.litigantType == '法人'" style="width:848px;">
              <Form :model="item" label-position="right" :label-width="200" :rules="accused_legalRule" :ref="'thirdLegalFromRule'+index" style="margin:0 auto">
                  <FormItem label="名称" class="ft_form ft-plant-chooseType" prop="name">
                      <Input v-model="item.name" placeholder="必填"></Input>
                  </FormItem>
                  <FormItem label="社会统一信用代码" class="ft_form ft-plant-chooseType" prop="identityCard">
                      <Input v-model="item.identityCard" placeholder="必填"></Input>
                  </FormItem>
                  <FormItem label="注册地址" class="ft_form ft-plant-chooseType" prop="address">
                      <Input v-model="item.address" placeholder="必填"></Input>
                  </FormItem>
                  <FormItem label="单位证明文件" class="ft_form ft-plant-upload ft-plant-chooseType" prop="businessLicense">
                      <Input v-model="item.businessLicense" placeholder="选填"></Input>
                      <span>{{item.accused_fileName2}}</span>
                      <Upload action="/api/court/case/upScanning.jhtml" class="ft-plant-upload-button" :on-success="(res)=> accused_uploadSuccess(res,third_confirmList)" :data="{fileType:'单位证明文件',id:item.plantiffId}">
                          <Button type="ghost" icon="ios-cloud-upload-outline">选择文件</Button>
                      </Upload>
                  </FormItem>
                  <FormItem label="单位固定电话" class="ft_form ft-plant-chooseType" prop="phone">
                      <Input v-model="item.phone" placeholder="选填"></Input>
                  </FormItem>
                  <FormItem label="单位电子邮箱" class="ft_form ft-plant-chooseType" prop="email">
                      <Input v-model="item.email" placeholder="选填"></Input>
                  </FormItem>
                  <FormItem label="法定代表人" class="ft_form ft-plant-chooseType" prop="legalManName">
                      <Input v-model="item.legalManName" placeholder="必填"></Input>
                  </FormItem>
                  <FormItem label="法定代表人职务" class="ft_form ft-plant-chooseType" prop="legalDuty">
                      <Input v-model="item.legalDuty" placeholder="选填" clearable></Input>
                  </FormItem>
                  <FormItem label="法定代表人手机号" class="ft_form ft-plant-chooseType" prop="legalManPhone">
                      <Input v-model="item.legalManPhone" placeholder="选填"></Input>
                  </FormItem>
                  <FormItem label="法定代表人身份证号码" class="ft_form ft-plant-chooseType" prop="legalManId">
                      <Input v-model="item.legalManId" placeholder="选填"></Input>
                  </FormItem>
                  <FormItem label="法定代表人身份证明文件" class="ft_form ft-plant-upload ft-plant-chooseType" prop="legalIdentity">
                      <Input v-model="item.legalIdentity" placeholder="选填"></Input>
                      <span>{{item.accused_fileName4}}</span>
                      <Upload action="/api/court/case/upScanning.jhtml" class="ft-plant-upload-button" :on-success="(res)=> accused_uploadSuccess(res,third_confirmList)" :data="{fileType:'法定代表人身份证明文件',id:item.plantiffId}">
                          <Button type="ghost" icon="ios-cloud-upload-outline">选择文件</Button>
                      </Upload>
                  </FormItem>
              </Form>
            </div>
            <!-- 非法人组织 -->
            <div v-show="item.litigantType == '非法人组织'"  style="width:848px;">
              <Form :model="item" label-position="right" :label-width="200" :rules="accused_notlegalRule" :ref="'thirdnoLegalFromRule'+index" style="margin:0 auto">
                  <FormItem label="名称" class="ft_form ft-plant-chooseType" prop="name">
                      <Input v-model="item.name" placeholder="必填"></Input>
                  </FormItem>
                  <FormItem label="社会统一信用代码" class="ft_form ft-plant-chooseType" prop="identityCard">
                      <Input v-model="item.identityCard" placeholder="必填"></Input>
                  </FormItem>
                  <FormItem label="注册地址" class="ft_form ft-plant-chooseType" prop="address">
                      <Input v-model="item.address" placeholder="必填"></Input>
                  </FormItem>
                  <FormItem label="单位证明文件" class="ft_form ft-plant-upload ft-plant-chooseType" prop="businessLicense">
                      <Input v-model="item.businessLicense" placeholder="选填"></Input>
                      <span>{{item.accused_fileName3}}</span>
                      <Upload action="/api/court/case/upScanning.jhtml" class="ft-plant-upload-button" :on-success="(res)=> accused_uploadSuccess(res,third_confirmList)" :data="{fileType:'单位证明文件',id:item.plantiffId}">
                          <Button type="ghost" icon="ios-cloud-upload-outline">选择文件</Button>
                      </Upload>
                  </FormItem>
                  <FormItem label="单位固定电话" class="ft_form ft-plant-chooseType" prop="phone">
                      <Input v-model="item.phone" placeholder="选填"></Input>
                  </FormItem>
                  <FormItem label="单位电子邮箱" class="ft_form ft-plant-chooseType" prop="email">
                      <Input v-model="item.email" placeholder="选填"></Input>
                  </FormItem>
                  <FormItem label="负责人" class="ft_form ft-plant-chooseType" prop="legalManName">
                      <Input v-model="item.legalManName" placeholder="必填"></Input>
                  </FormItem>
                  <FormItem label="负责人职务" class="ft_form ft-plant-chooseType" prop="legalDuty">
                      <Input v-model="item.legalDuty" placeholder="选填" clearable></Input>
                  </FormItem>
                  <FormItem label="负责人手机号" class="ft_form ft-plant-chooseType" prop="legalManPhone">
                      <Input v-model="item.legalManPhone" placeholder="选填"></Input>
                  </FormItem>
                    <FormItem label="负责人身份证号码" class="ft_form ft-plant-chooseType" prop="legalManId">
                      <Input v-model="item.legalManId" placeholder="选填"></Input>
                  </FormItem>
                  <FormItem label="负责人身份证明文件" class="ft_form ft-plant-upload ft-plant-chooseType" prop="legalIdentity">
                      <Input v-model="item.legalIdentity" placeholder="选填"></Input>
                      <span>{{item.accused_fileName5}}</span>
                      <Upload action="/api/court/case/upScanning.jhtml" class="ft-plant-upload-button" :on-success="(res)=> accused_uploadSuccess(res,third_confirmList)" :data="{fileType:'负责人身份证明文件',id:item.plantiffId}">
                          <Button type="ghost" icon="ios-cloud-upload-outline">选择文件</Button>
                      </Upload>
                  </FormItem>
              </Form>
            </div>
          </Form>
        </div>
      </Panel>
    </Collapse>
    <!-- 提交按钮 -->
    <Form  label-position="right" style="margin:0 auto;width: 441px;margin-top:15px">
      <div class='ft_public1' style="margin-left: 73px;">{{third_confirmList.length==0 ? "暂无第三人，可选添加（非必选）" : ""}}</div>
      <FormItem>
        <div class='ft_public1'>
          <a href="javascript:void(0)" style="" class="addCommon" @click="handleAdd(third_confirmList,accused_obj)">增加共同第三人</a>
        </div>
      </FormItem>
    </Form>
    <div class='ft_public1' style="width:778px;margin: 0 auto;margin-bottom:30px;">
      <a href="javascript:void(0)" class="ft-accused-btn1" @click="ft_accused_backToStep2" v-show="backShow">返回上一步</a>
      <a href="javascript:void(0)" class="ft_public3" @click="ft_accused_jumptoStep3" ref="nextBtn">下一步，要素信息</a>
    </div>
  </div>
</template>

<script>

import accusedViald from './Accused.js';
import nation from "@/api/nations.js";
import { tools_transDate,tools_calcIdentiyInfo } from '@/libs/tools.js';

export default {
  data () {
    return {
      nationAry:nation,//民族列表
      backShow:true,
      orgrin:accusedViald.manType, //当事人类型数组
      orgrin2:accusedViald.thirdManType, //第三人类型数组
      openAry:['plant_0'],//被告折叠需要展开的name
      openAry2:['plant_0'],//第三人折叠需要展开的name

      accused_natureRule: accusedViald.accusedNatureRule, //自然人表单规则
      accused_legalRule: accusedViald.accusedLegalRule, //法人表单规则
      accused_notlegalRule: accusedViald.accusedNotLegalRule, //非法人表单规则

      // 被告初始化表单数据
      accused_obj: accusedViald.accused_obj,//被告申请模板
      accused_confirmList:[Object.assign({},accusedViald.accused_obj)], //要提交的被告列表

      // 第三人初始化表单数据
      third_obj: accusedViald.accused_obj,//自然人申请模板
      third_confirmList:[], //要提交的第三人列表
    }
  },
  mounted () {
    console.log("accused_confirmList",this.accused_confirmList)
  },
  computed:{
   //取到ID值，commit的时候会自增ID
    ft_plant_getId () {
      return this.$store.state.setcaseModules.plantiffId;
    }
  },
  methods:{

    //切换被告类型
    changePlantStep(data,name,index) {
       data.litigantType = name;
       data.accusedPlantNowIndex = index;
    },

    //被告/第三人增加
    handleAdd (list,obj) {
      let newObj = JSON.parse(JSON.stringify(obj))
      this.$store.commit('addPlantiffId'); //ID自增长
      newObj.plantiffId=this.ft_plant_getId//设置id
      //添加进列表
      list.push(newObj);
      console.log(list)
    },

    //被告上传文件
    accused_uploadSuccess (res,list) {
      if(res.state === 100) {
        this.$Message.success(res.message);
        let data=res.data.result[0];
        list.forEach((item,index) => {
          if(item.plantiffId == data.id){
            switch (data.fileType) {
              case "个人身份证明文件":
                  item.businessLicense = data.filePath;
                  item.accused_fileName1 = data.fileName;
                break;
              case "单位证明文件":
                if(item.accusedPlantNowIndex === 1) {
                  item.businessLicense = data.filePath;
                  item.accused_fileName2 = data.fileName;
                }else if (item.accusedPlantNowIndex === 2) {
                  item.businessLicense = data.filePath;
                  item.accused_fileName3 = data.fileName;
                }
                break;
              case "法定代表人身份证明文件":
                if(item.accusedPlantNowIndex === 1) {
                  item.legalIdentity = data.filePath;
                  item.accused_fileName4 = data.fileName;
                }else if (item.accusedPlantNowIndex === 2) {
                  item.legalIdentity = data.filePath;
                  item.accused_fileName5 = data.fileName;
                }
                break;
            }
          }
        })
        
      }else{
        this.$Message.error(res.message);
      }
    },

    //返回第二步
    ft_accused_backToStep2 () {
      this.$emit('toNextStep',{type:'被告信息',state:'back',data:{accused_confirmList:this.accused_confirmList,third_confirmList:this.third_confirmList}});
    },

    //进行第四步
    ft_accused_jumptoStep3 () {
      let res1=this.checkAccused(this.accused_confirmList,0);
      let res2=this.checkAccused(this.third_confirmList,1);
      if(!res1 || !res2){
        return
      }
      this.nextSteps(res1,res2);
    },
    checkAccused(list,type){//检查信息
      let isFalse = true;
      let formData=JSON.parse(JSON.stringify(list))
      let typeName= type==0 ? '被告' : '第三人' 
      formData.forEach((item, index) => {
        let form = "";
        switch (type) {
          case 0://被告
            if(item.litigantType == '自然人'){
              form = 'accusedFromRule' + index;
            }else if(item.litigantType == '法人'){
              form = 'accusedLegalFromRule' + index;
            }else if(item.litigantType == '非法人组织'){
              form = 'accusednoLegalFromRule' + index;
            }
          break;
          case 1://第三人
            if(item.litigantType == '自然人'){
              form = 'thirdFromRule' + index;
            }else if(item.litigantType == '法人'){
              form = 'thirdLegalFromRule' + index;
            }else if(item.litigantType == '非法人组织'){
              form = 'thirdnoLegalFromRule' + index;
            }
          break;
        }
        this.$refs[form][0].validate((valid) => {
            if (valid) {
            } else {
              isFalse = false;
            }
        });
      });
      if(!isFalse){
        this.$Notice.info({'title':typeName+'信息请完善带*星号必填项!'});
        return false;
      }
      //转换时间戳
      formData.forEach((item,index) => {
        item.litigantBirthday = new Date(item.litigantBirthday).getTime().toString();
      })
      let obj = {};
      //对象去重
      formData = formData.reduce((item, next)=> {
          obj[next.plantiffId] ? '' : obj[next.plantiffId] = true && item.push(next);
          return item;
      }, []);
      if(formData.length>0){
        this.$Notice.success({'title':typeName+'信息添加成功!'});
      }
      console.log(formData)
      return formData
    },
    //下一步
    nextSteps(res1,res2){
      console.log("accused_confirmList",res1)
      console.log("third_confirmList",res2)
      if(!res1) {
        this.$Notice.warning({'title':'请至少填写一位被告人'});
      }else{
        this.$emit('toNextStep',{type:'被告信息',state:'next',data:{accused_confirmList:res1,third_confirmList:res2}});
      }
    },
    //删除被告、第三人信息
    delPlantiff(list,that,openAry){
      list.forEach((item,index) => {
        if(item.plantiffId == that.plantiffId){
          list.splice(index,1)
        }
      })
      console.log(this.third_confirmList)
      this[openAry]=[];
    },

    //被告、第三人身份证信息获取
    mAccused_autoFillId (data,name){
      this.$refs[name][0].fields.forEach(function (e) {
      if (e.prop == 'litigantSex' || e.prop == 'litigantBirthday' || e.prop == 'litigantNation') {//这个条件限制可以去掉就是全部重置了
          e.resetField()
      }
      let obj = tools_calcIdentiyInfo(data.identityCard);
      data.litigantSex = obj.sex;
      data.litigantBirthday = obj.birth;
})
    },
    clearError(){//清除错误提示
      //清除被告表单错误提示
      this.accused_confirmList.forEach((item, index) => {
        let form = "";
        if(item.litigantType == '自然人'){
          form = 'accusedFromRule' + index;
        }else if(item.litigantType == '法人'){
          form = 'accusedLegalFromRule' + index;
        }else if(item.litigantType == '非法人组织'){
          form = 'accusednoLegalFromRule' + index;
        }
        this.$refs[form][0].fields.forEach(function (e) {
          e.resetField()
        })
      });
      //清除第三人表单错误提示
      this.third_confirmList.forEach((item, index) => {
        let form = "";
        if(item.litigantType == '自然人'){
          form = 'thirdFromRule' + index;
        }else if(item.litigantType == '法人'){
          form = 'thirdLegalFromRule' + index;
        }else if(item.litigantType == '非法人组织'){
          form = 'thirdnoLegalFromRule' + index;
        }
        this.$refs[form][0].fields.forEach(function (e) {
          e.resetField()
        })
      });
    },
    //清空表单
    ft_step3_restForm () {
    this.accused_confirmList.forEach((item,index)=>{
      this.$refs['accusedFromRule'+ index].resetFields();
      this.$refs['accusedLegalFromRule'+ index].resetFields();
      this.$refs['accusednoLegalFromRule'+ index].resetFields();
      item.accused_fileName1 = '';
      item.accused_fileName2 = '';
      item.accused_fileName3 = '';
      item.accused_fileName4 = '';
      item.accused_fileName5 = '';
    })
    this.third_confirmList.forEach((item,index)=>{
      this.$refs['thirdFromRule'+ index].resetFields();
      this.$refs['thirdLegalFromRule'+ index].resetFields();
      this.$refs['thirdnoLegalFromRule'+ index].resetFields();
      item.accused_fileName1 = '';
      item.accused_fileName2 = '';
      item.accused_fileName3 = '';
      item.accused_fileName4 = '';
      item.accused_fileName5 = '';
    })
   }
  }
};
</script>

<style scoped>
 @import './Accused.css';
 @import '../../casecommon/casereset.css';
</style>
