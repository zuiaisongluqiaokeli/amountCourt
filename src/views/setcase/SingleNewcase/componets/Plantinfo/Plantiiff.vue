<style scoped src='./plantiiff.css'></style>
<template>
  <div class='ft-plant-div1'>

    <Form  label-position="right" style="margin:0 auto;width: 441px;margin-top:15px">
    <!-- 操作区域 -->
      <FormItem>
        <div style="display:flex;justify-content: center;margin:30px 0">
          <div class="ft-tabs-style2" style="margin-right:30px">
            <Tabs type="card" value="1">
              <TabPane label="原告" name='1'>
                <Card style="width:500px">
                    <div class="zh-labelType" style="text-align:center">
                      <Form>
                        <FormItem label="快速选择（可多选）" :label-width="70" class="reg_groupSelect">
                          <div v-for="(item,index) in confirmPlantAry" :key='index' style="margin:5px 0;display:flex">
                            <span 
                            @click="typeChangeTab1($event,index,item)">{{item.name}}{{'（'+item.organizationType+'）'}}
                            </span>
                            <a @click="showConfirmPlantBox($event,'edit',item.id)">查看/编辑</a>
                          </div>
                        </FormItem>
                        <div style="text-aligin:center" v-if="confirmPlantAry.length==0 && !isConfirmPlantShow">暂无数据,请添加！</div>
                        <div style="text-align:center;margin:10px 0">
                            <a href="javascript:void(0)"  @click="showConfirmPlantBox($event,'add')" class="plant_active ft-plant-a1">添加常用当事人</a>
                        </div>
                      </Form>
                    </div>
                    <Spin size="large" fix v-if="isConfirmPlantShow"></Spin>
                </Card>
              </TabPane>
            </Tabs>
          </div>
          <div class="ft-tabs-style2">
            <Tabs type="card" value="2">
              <TabPane label="代理人" name='2'>
                <Card style="width:500px">
                    <div class="zh-labelType" style="text-align:center">
                      <Form>
                        <Alert type="warning" show-icon v-show="agentSelectMsgShow">{{agentSelectMsg}}</Alert>
                        <FormItem label="快速选择（最多两人）" :label-width="70" class="reg_groupSelect">
                          <div v-for="(item,index) in agentAry" :key='index' style="margin:5px 0;">
                            <div style="display:flex">
                              <span @click="typeChangeTab2($event,item,index)">{{item.name}}{{'（'+item.agentType+'）'}}</span>
                              <a  @click="showAgentBox('edit',item.id)">查看/编辑</a>
                            </div>
                            <div style="display:flex;color:#3162BE;height:30px" v-if="item.agentType=='律师'">
                              <Upload style="margin-right:20px;cursor:pointer;" 
                              :show-upload-list="false" 
                              action="/api/court/case/upScanning.jhtml" 
                              :on-success="(res)=> plant_uploadSuccess(res, item)" 
                              :data="{fileType:'委托书',id:agPlantBox.plantiffId}">
                                  <Icon type="ios-cloud-upload" 
                                  style="font-size:20px;cursor:pointer;"></Icon>
                                  <label style="vertical-align: super;cursor:pointer;">
                                    上传委托书{{item.commissionHas ? '（已上传）' : '（未上传）'}}</label>
                              </Upload>
                              <!-- <div v-for="item in agPlantBox.businessFileName"><label style="padding:0 10px">{{item}}</label><a @click='delFile(item,"委托书")'>删除</a></div> -->
                              <Upload 
                              style="margin-right:20px;cursor:pointer;" 
                              :show-upload-list="false" 
                              action="/api/court/case/upScanning.jhtml" 
                              :on-success="(res)=> plant_uploadSuccess(res, item)" 
                              :data="{fileType:'律所函',id:agPlantBox.plantiffId}">
                                  <Icon type="ios-cloud-upload" style="font-size:20px;;"></Icon>
                                  <label style="vertical-align: super;cursor:pointer">上传律所函{{item.lawFirmLetterHas ? '（已上传）' : '（未上传）'}}</label>
                              </Upload>
                              <!-- <div v-for="item in agPlantBox.businessFileName"><label style="padding:0 10px">{{item}}</label><a @click='delFile(item,"律所函")'>删除</a></div> -->
                            </div>
                            <div style="display:flex;color:#3162BE;height:30px" v-if="item.agentType=='公民' || item.agentType=='职工' || item.agentType=='职员'">
                              <Upload style="margin-right:20px;cursor:pointer;" 
                              :show-upload-list="false" 
                              action="/api/court/case/upScanning.jhtml" 
                              :on-success="(res)=> plant_uploadSuccess(res, item)" 
                              :data="{fileType:'上传劳动合同或公积金缴交证明',id:agPlantBox.plantiffId}">
                                  <Icon type="ios-cloud-upload" style="font-size:20px;cursor:pointer;"></Icon><label style="vertical-align: super;cursor:pointer;">
                                    上传劳动合同或公积金缴交证明{{item.commissionHas ? '（已上传）' : '（未上传）'}}</label>
                              </Upload>
                              <!-- <div v-for="item in agPlantBox.businessFileName"><label style="padding:0 10px">{{item}}</label><a @click='delFile(item,"委托书")'>删除</a></div> -->
                            </div>
                          </div>
                        </FormItem>
                        <div style="text-aligin:center" v-if="agentAry.length==0 && !isAgentShow">暂无数据,请添加！</div>
                        <div style="text-align:center;margin:10px 0">
                            <a href="javascript:void(0)"  @click="showAgentBox('add')" class="plant_active ft-plant-a1">添加常用代理人</a>
                        </div>
                      </Form>
                    </div>
                    <Spin size="large" fix v-if="isAgentShow"></Spin>
                </Card>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </FormItem>
      <!-- 提交按钮 -->
      <FormItem>
          <div class='ft_public1'>
            <a href="javascript:void(0)" class="ft_public3" @click="ft_plantNextSetp">下一步，被告、第三人信息</a>
          </div>
      </FormItem>
    </Form>

    <!-- 原告信息模态框 -->
    <Modal v-model="confirmPlantBox.show" :mask-closable="false" width="600">
      <p slot="header" style="color:black;text-align:center">
          <Icon type="ios-information-circle"></Icon>
          <span>{{confirmPlantBox.title}}</span>
      </p>
      <div style="text-align:center">
        <Form :label-width="80" class="box_form">
          <FormItem label="当事人类型" :label-width="80" class="reg_groupSelect2">
            <span v-for="(item,index) in confirmPlantBox.confirmPlantTypeList" :key='index' 
            :class="{'reg_chooseFocus':confirmPlantBox.nowType==item.value}" 
            @click="typeChangeTab3(item.value)">{{item.name}}</span>
          </FormItem>
        </Form>
        <!-- 自然人 -->
        <Form v-show="confirmPlantBox.nowType=='自然人'" :label-width="150" class="box_form" :model="natureList" :rules="natureRule" :ref="'自然人'">
          <FormItem label="姓名" prop="name" >
              <Input v-model="natureList.name" placeholder="必填" clearable></Input>
          </FormItem>
          <FormItem label="公民身份证号" prop="identityCard" >
              <Input v-model="natureList.identityCard" placeholder="必填" clearable @on-change="plant_autoFillId2(natureList,'自然人')"></Input>
          </FormItem>
          <FormItem label="出生日期" prop="litigantBirthday">
            <DatePicker
            type="date"
            :editable="false"
            placeholder="请选择出生年月"
            :clearable="false"
            format="yyyy年MM月dd日"
            style="width: 100%"
            :value="natureList.litigantBirthday"
            @on-change="ft_plant_chgBirth2($event,natureList)"></DatePicker>
          </FormItem>
          <FormItem label="性别"  prop="litigantSex" class="sexType">
            <RadioGroup v-model="natureList.litigantSex">
                <Radio label="男">男</Radio>
                <Radio label="女">女</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="民族" prop="litigantNation">
              <Select
              v-model="natureList.litigantNation"
              placeholder="请选择民族"
              clearable
              filterable
            >
              <Option
                v-for="(item,index) in nationAry"
                :value="item.name"
                :key="index"
              >{{ item.name }}</Option>
            </Select>
          </FormItem>
            <FormItem label="户籍地址" prop="litigantPermanentAddress">
              <Input v-model="natureList.litigantPermanentAddress" placeholder="必填" clearable></Input>
          </FormItem>
          <FormItem label="常住地址" prop="address">
              <Input v-model="natureList.address" placeholder="选填（请加上省份）" clearable></Input>
          </FormItem>
          <FormItem label="文书送达地址" prop="serviceAddress">
              <Input v-model="natureList.serviceAddress" placeholder="必填" clearable></Input>
          </FormItem>
          <FormItem label="手机号" prop="phone">
              <Input v-model="natureList.phone" placeholder="必填" clearable></Input>
          </FormItem>
          <FormItem label="电子邮箱" prop="email">
              <Input v-model="natureList.email" placeholder="选填" clearable></Input>
          </FormItem>
          <!-- <FormItem label="个人身份证明文件" class="ft_form ft-plant-upload" prop="businessLicense">
              <Upload multiple action="/api/court/case/upScanning.jhtml" class="ft-plant-upload-button" :show-upload-list="false" :on-success="plant_uploadSuccess" :data="{fileType:'个人身份证明文件',id:confirmPlantBox.plantiffId}">
                  <Button type="ghost" icon="ios-cloud-upload-outline" style="width:100%">选择文件(按住Ctrl支持多选)</Button>
              </Upload>
          </FormItem> -->
          <FormItem label="个人身份证明文件" class="ft_form zh-plant-upload" prop="businessLicenseUp">
              <Input v-model="natureList.businessLicenseUp" placeholder="选填" clearable></Input>
              <Upload action="/api/court/case/upScanning.jhtml" class="ft-plant-upload-button" :show-upload-list="false" :on-success="plant_uploadSuccess" :data="{fileType:'个人身份证明文件',id:confirmPlantBox.plantiffId}">
                  <Button type="ghost" icon="ios-cloud-upload-outline" style="width:100%">选择文件</Button>
                  <span>请上传*.jpg/png/bmp/pdf后缀格式的文件</span>
              </Upload>
          </FormItem>
          <FormItem class="sexType">
              <div v-for="item in confirmPlantBox.businessFileName"><span style="padding:0 10px">{{item}}</span><a @click='delFile(item,"个人身份证明文件")'>删除</a></div>
          </FormItem>
        </Form>
        <!-- 法人 -->
        <Form v-show="confirmPlantBox.nowType=='法人'" :label-width="150" class="box_form" :model="legealList" :rules="legalRule" :ref="'法人'">
          <FormItem label="名称" prop="name">
              <Input v-model="legealList.name" placeholder="必填" clearable></Input>
          </FormItem>
          <FormItem label="社会统一信用代码" prop="identityCard">
              <Input v-model="legealList.identityCard" placeholder="必填" clearable></Input>
          </FormItem>
          <FormItem label="注册地址" prop="address">
              <Input v-model="legealList.address" placeholder="必填" clearable></Input>
          </FormItem>
          <FormItem label="经营地址" prop="address">
              <Input v-model="legealList.address1" placeholder="必填" clearable></Input>
          </FormItem>
          <FormItem label="文书送达地址" prop="serviceAddress">
              <Input v-model="legealList.serviceAddress" placeholder="必填" clearable></Input>
          </FormItem>
          <!-- <FormItem label="单位证明文件" class="ft_form ft-plant-upload" prop="businessLicense">
              <Upload multiple action="/api/court/case/upScanning.jhtml" class="ft-plant-upload-button" :show-upload-list="false" :on-success="plant_uploadSuccess" :data="{fileType:'单位证明文件（法人）',id:confirmPlantBox.plantiffId}">
                  <Button type="ghost" icon="ios-cloud-upload-outline" style="width:100%">选择文件(按住Ctrl支持多选)</Button>
              </Upload>
          </FormItem> -->
          <FormItem label="单位证明文件" class="ft_form zh-plant-upload" prop="businessLicenseUp1">
              <Input v-model="legealList.businessLicenseUp1"></Input>
              <Upload action="/api/court/case/upScanning.jhtml" class="ft-plant-upload-button" :show-upload-list="false" :on-success="plant_uploadSuccess" :data="{fileType:'单位证明文件（法人）',id:confirmPlantBox.plantiffId}">
                  <Button type="ghost" icon="ios-cloud-upload-outline" style="width:100%">选择文件</Button>
                  <span>请上传*.jpg/png/bmp/pdf后缀格式的文件</span>
              </Upload>
          </FormItem>
          <FormItem class="sexType">
              <div v-for="item in confirmPlantBox.businessFileName1"><span style="padding:0 10px">{{item}}</span><a @click='delFile(item,"单位证明文件（法人）",1)'>删除</a></div>
          </FormItem>
          <FormItem label="单位固定电话" prop="phone">
              <Input v-model="legealList.phone" placeholder="选填" clearable></Input>
          </FormItem>
          <FormItem label="单位电子邮箱" prop="email">
              <Input v-model="legealList.email" placeholder="选填" clearable></Input>
          </FormItem>
          <FormItem label="法定代表人" prop="legalManName">
              <Input v-model="legealList.legalManName" placeholder="必填" clearable></Input>
          </FormItem>
          <FormItem label="法定代表人职务" prop="legalDuty">
              <Input v-model="legealList.legalDuty" placeholder="选填" clearable></Input>
          </FormItem>
          <FormItem label="法定代表人手机号" prop="legalManPhone">
              <Input v-model="legealList.legalManPhone" placeholder="选填" clearable></Input>
          </FormItem>
          <FormItem label="法定代表人身份证号码" prop="legalManId">
              <Input v-model="legealList.legalManId" placeholder="选填" clearable></Input>
          </FormItem>
          <!-- <FormItem label="法定代表人身份证明文件" class="ft_form ft-plant-upload" prop="legalIdentity">
              <Upload multiple action="/api/court/case/upScanning.jhtml" class="ft-plant-upload-button" :show-upload-list="false" :on-success="plant_uploadSuccess" :data="{fileType:'法定代表人身份证明文件（法人）',id:confirmPlantBox.plantiffId}">
                  <Button type="ghost" icon="ios-cloud-upload-outline"  style="width:100%">选择文件(按住Ctrl支持多选)</Button>
              </Upload>
          </FormItem> -->
          <FormItem label="法定代表人身份证明文件" class="ft_form zh-plant-upload" prop="businessLicenseUp2">
              <Input v-model="legealList.businessLicenseUp2"></Input>
              <Upload action="/api/court/case/upScanning.jhtml" class="ft-plant-upload-button" :show-upload-list="false" :on-success="plant_uploadSuccess" :data="{fileType:'法定代表人身份证明文件（法人）',id:confirmPlantBox.plantiffId}">
                  <Button type="ghost" icon="ios-cloud-upload-outline"  style="width:100%">选择文件</Button>
                  <span>请上传*.jpg/png/bmp/pdf后缀格式的文件</span>
              </Upload>
          </FormItem>
          <FormItem class="sexType">
              <div v-for="item in confirmPlantBox.businessFileName2"><span style="padding:0 10px">{{item}}</span><a @click='delFile(item,"法定代表人身份证明文件（法人）")'>删除</a></div>
          </FormItem>
        </Form>
        <!-- 非法人 -->
        <Form v-show="confirmPlantBox.nowType=='非法人组织'" :label-width="150" class="box_form" :model="notlegealList" :rules="nolegalRule" :ref="'非法人组织'">
          <FormItem label="名称" prop="name">
              <Input v-model="notlegealList.name" placeholder="必填" clearable></Input>
          </FormItem>
          <FormItem label="社会统一信用代码" prop="identityCard">
              <Input v-model="notlegealList.identityCard" placeholder="必填" clearable></Input>
          </FormItem>
          <FormItem label="注册地址" prop="address">
              <Input v-model="notlegealList.address" placeholder="必填" clearable></Input>
          </FormItem>
          <FormItem label="经营地址" prop="address">
              <Input v-model="notlegealList.address1" placeholder="必填" clearable></Input>
          </FormItem>
          <FormItem label="文书送达地址" prop="serviceAddress">
              <Input v-model="notlegealList.serviceAddress" placeholder="必填" clearable></Input>
          </FormItem>
          <!-- <FormItem label="单位证明文件" class="ft_form ft-plant-upload" prop="businessLicense">
              <Upload multiple action="/api/court/case/upScanning.jhtml" class="ft-plant-upload-button" :show-upload-list="false" :on-success="plant_uploadSuccess" :data="{fileType:'单位证明文件（非法人）',id:confirmPlantBox.plantiffId}">
                  <Button type="ghost" icon="ios-cloud-upload-outline" style="width:100%">选择文件(按住Ctrl支持多选)</Button>
              </Upload>
          </FormItem> -->
          <FormItem label="单位证明文件" class="ft_form zh-plant-upload" prop="businessLicenseUp1">
              <Input v-model="notlegealList.businessLicenseUp1"></Input>
              <Upload action="/api/court/case/upScanning.jhtml" class="ft-plant-upload-button" :show-upload-list="false" :on-success="plant_uploadSuccess" :data="{fileType:'单位证明文件（非法人）',id:confirmPlantBox.plantiffId}">
                  <Button type="ghost" icon="ios-cloud-upload-outline" style="width:100%">选择文件</Button>
                  <span>请上传*.jpg/png/bmp/pdf后缀格式的文件</span>
              </Upload>
          </FormItem>
          <FormItem class="sexType">
              <div v-for="item in confirmPlantBox.businessFileName3"><span style="padding:0 10px">{{item}}</span><a @click='delFile(item,"单位证明文件（非法人）",1)'>删除</a></div>
          </FormItem>
          <FormItem label="单位固定电话" prop="phone">
              <Input v-model="notlegealList.phone" placeholder="选填" clearable></Input>
          </FormItem>
          <FormItem label="单位电子邮箱" prop="email">
              <Input v-model="notlegealList.email" placeholder="选填" clearable></Input>
          </FormItem>
          <FormItem label="负责人" prop="legalManName">
              <Input v-model="notlegealList.legalManName" placeholder="必填" clearable></Input>
          </FormItem>
          <FormItem label="负责人职务" prop="legalDuty">
              <Input v-model="legealList.legalDuty" placeholder="选填" clearable></Input>
          </FormItem>
          <FormItem label="负责人手机号" prop="legalManPhone">
              <Input v-model="notlegealList.legalManPhone" placeholder="选填" clearable></Input>
          </FormItem>
          <FormItem label="负责人身份证号码" prop="legalManId">
              <Input v-model="notlegealList.legalManId" placeholder="选填" clearable></Input>
          </FormItem>
          <!-- <FormItem label="负责人身份证明文件" class="ft_form ft-plant-upload" prop="legalIdentity">
              <Upload multiple action="/api/court/case/upScanning.jhtml" class="ft-plant-upload-button" :show-upload-list="false" :on-success="plant_uploadSuccess" :data="{fileType:'负责人身份证明文件（非法人）',id:confirmPlantBox.plantiffId}">
                  <Button type="ghost" icon="ios-cloud-upload-outline" style="width:100%">选择文件(按住Ctrl支持多选)</Button>
              </Upload>
          </FormItem> -->
          <FormItem label="负责人身份证明文件" class="ft_form zh-plant-upload" prop="businessLicenseUp2">
              <Input v-model="notlegealList.businessLicenseUp2"></Input>
              <Upload action="/api/court/case/upScanning.jhtml" class="ft-plant-upload-button" :show-upload-list="false" :on-success="plant_uploadSuccess" :data="{fileType:'负责人身份证明文件（非法人）',id:confirmPlantBox.plantiffId}">
                  <Button type="ghost" icon="ios-cloud-upload-outline" style="width:100%">选择文件</Button>
                  <span>请上传*.jpg/png/bmp/pdf后缀格式的文件</span>
              </Upload>
          </FormItem>
          <FormItem class="sexType">
              <div v-for="item in confirmPlantBox.businessFileName4"><span style="padding:0 10px">{{item}}</span><a @click='delFile(item,"负责人身份证明文件（非法人）")'>删除</a></div>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
          <Button v-show='confirmPlantBox.nowState=="add"' style="background-color:#4873C5;color:white" size="large" long :loading="confirmPlantBox.addLoading" @click="editConfirmPlantInfo('save','add')">{{confirmPlantBox.footerBtn1}}</Button>
          <Button v-show='confirmPlantBox.nowState=="edit"' style="background-color:#4873C5;color:white" size="large" :loading="confirmPlantBox.editLoading" @click="editConfirmPlantInfo('save','edit')">{{confirmPlantBox.footerBtn2}}</Button>
          <Button v-show='confirmPlantBox.nowState=="edit"' style="background-color:#F54C4C;color:white" size="large" :loading="confirmPlantBox.nosaveLoading" @click="editConfirmPlantInfo('nosave','')">{{confirmPlantBox.footerBtn3}}</Button>
      </div>
    </Modal>

    <!-- 原告代理人信息模态框 -->
    <Modal v-model="agPlantBox.show" :mask-closable="false" width="620">
      <p slot="header" style="color:black;text-align:center">
          <Icon type="ios-information-circle"></Icon>
          <span>{{agPlantBox.title}}</span>
      </p>
      <div style="text-align:center">
        <Form :label-width="80" class="box_form">
          <FormItem label="代理人类型" :label-width="80" class="reg_groupSelect2">
            <span v-for="(item,index) in agPlantBox.agentTypeList" :key='index' :class="{'reg_chooseFocus':agPlantBox.nowType==item.value}" @click="typeChangeTab6(item.value)">{{item.name}}</span>
          </FormItem>
        </Form>

        <!-- 律师类型 -->
        <Form v-show="agPlantBox.nowType=='律师'" :label-width="150" class="box_form" :model="lawyerList" :rules="lawyerRule" :ref="'律师'">
            <FormItem label="姓名" prop="agentName">
                <Input v-model="lawyerList.agentName" placeholder="请输入姓名"></Input>
            </FormItem>

            <FormItem label="公民身份证号" prop="agentIdentiCard">
              <Input v-model="lawyerList.agentIdentiCard" placeholder="请输入公民身份证号"></Input>
            </FormItem>

            <FormItem label="律师执业资格" prop="lawyerType">
              <div class="reg_groupSelect2">
                <div style="text-align:left">
                  <span v-for="(item,index) in agPlantBox.lawyerTypeList" :key='index' 
                  :class="{'reg_chooseFocus':agPlantBox.lawyerType==item}"
                  @click="typeChangeTab4(item)">{{item}}</span>
                </div>
              </div>
            </FormItem>

            <FormItem label="授权类型" prop="empowerType">
              <div class="reg_groupSelect2">
                <div style="text-align:left">
                  <span v-for="(item,index) in agPlantBox.empowerTypeList" :key='index' :class="{'reg_chooseFocus':agPlantBox.empowerType==item}" @click="typeChangeTab5(item)">{{item}}</span>
                </div>
              </div>
            </FormItem>

            <FormItem label="律师执业证号" prop="lawerNum">
                <Input v-model="lawyerList.lawerNum" placeholder="请输入律师执业证号"></Input>
            </FormItem>

            <FormItem label="手机号" prop="agentMobile">
                <Input v-model="lawyerList.agentMobile" placeholder="请输入手机号"></Input>
            </FormItem>

            <FormItem label="联系地址" prop="agentAddress">
                <Input v-model="lawyerList.agentAddress" placeholder="请输入联系地址"></Input>
            </FormItem>

            <FormItem label="邮箱地址" prop="agentMail">
                <Input v-model="lawyerList.agentMail" placeholder="请输入代理人邮箱地址"></Input>
            </FormItem>

            <FormItem label="律所名称/住处" prop="lawFirm">
                <Input v-model="lawyerList.lawFirm" placeholder="请输入律师所,普通用户请填写住处名称"></Input>
            </FormItem>

            <!-- <FormItem label="律所函" class="ft_form zh-plant-upload" prop="businessLicenseUp1">
                <Input v-model="lawyerList.businessLicenseUp1"></Input>
                <Upload action="/api/court/case/upScanning.jhtml" class="ft-plant-upload-button" :show-upload-list="false" :on-success="plant_uploadSuccess" :data="{fileType:'律所函',id:agPlantBox.plantiffId}">
                    <Button type="ghost" icon="ios-cloud-upload-outline" style="width:100%">选择文件</Button>
                </Upload>
            </FormItem>
            <FormItem class="sexType">
                <div v-for="item in agPlantBox.businessFileName"><span style="padding:0 10px">{{item}}</span><a @click='delFile(item,"律所函")'>删除</a></div>
            </FormItem> -->

            <FormItem label="律师执业证" class="ft_form zh-plant-upload" prop="businessLicenseUp2">
                <Input v-model="lawyerList.businessLicenseUp2"></Input>
                <Upload action="/api/court/case/upScanning.jhtml" class="ft-plant-upload-button" :show-upload-list="false" :on-success="plant_uploadSuccess" :data="{fileType:'律师执业证',id:agPlantBox.plantiffId}">
                    <Button type="ghost" icon="ios-cloud-upload-outline" style="width:100%">选择文件</Button>
                    <span>请上传*.jpg/png/bmp/pdf后缀格式的文件</span>
                </Upload>
            </FormItem>
            <FormItem class="sexType">
                <div v-for="(item,index) in agPlantBox.businessFileName1" :key="index"><span style="padding:0 10px">{{item}}</span><a @click='delFile(item,"律师执业证")'>删除</a></div>
            </FormItem>

            <!-- <FormItem label="委托书" class="ft_form zh-plant-upload" prop="businessLicenseUp3">
                <Input v-model="lawyerList.businessLicenseUp3"></Input>
                <Upload action="/api/court/case/upScanning.jhtml" class="ft-plant-upload-button" :show-upload-list="false" :on-success="plant_uploadSuccess" :data="{fileType:'委托书',id:agPlantBox.plantiffId}">
                    <Button type="ghost" icon="ios-cloud-upload-outline" style="width:100%">选择文件</Button>
                </Upload>
            </FormItem>
            <FormItem class="sexType">
                <div v-for="item in agPlantBox.businessFileName2"><span style="padding:0 10px">{{item}}</span><a @click='delFile(item,"委托书")'>删除</a></div>
            </FormItem> -->
        </Form>

        <!-- 职工类型 -->
        <Form v-show="agPlantBox.nowType=='职工'" :label-width="150" class="box_form" :model="workerList" :rules="workerRule" :ref="'职工'">
            <FormItem label="姓名" prop="agentName">
                <Input v-model="workerList.agentName" placeholder="请输入姓名"></Input>
            </FormItem>
            <FormItem label="公民身份证号" prop="agentIdentiCard" >
                <Input v-model="workerList.agentIdentiCard" placeholder="必填" clearable @on-change="plant_autoFillId(workerList,'职工')"></Input>
            </FormItem>
            <FormItem label="出生日期" prop="birthday">
              <DatePicker
              type="date"
              :editable="false"
              placeholder="请选择出生年月"
              :clearable="false"
              format="yyyy年MM月dd日"
              style="width: 100%"
              :value="workerList.birthday"
              @on-change="ft_plant_chgBirth($event,workerList)"></DatePicker>
            </FormItem>
            <FormItem label="性别"  prop="sex" class="sexType">
              <RadioGroup v-model="workerList.sex">
                  <Radio label="男">男</Radio>
                  <Radio label="女">女</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="民族" prop="nation">
              <Select
                v-model="workerList.nation"
                placeholder="请选择民族"
                clearable
                filterable
              >
                <Option
                  v-for="(item,index) in nationAry"
                  :value="item.name"
                  :key="index"
                >{{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem label="户籍地址" prop="agentAddress">
                <Input v-model="workerList.agentAddress" placeholder="请输入户籍地址"></Input>
            </FormItem>
            <FormItem label="常住地址" prop="agentAddress1">
                <Input v-model="workerList.agentAddress1" placeholder="请输入常住地址"></Input>
            </FormItem>
            <FormItem label="手机号" prop="agentMobile">
                <Input v-model="workerList.agentMobile" placeholder="请输入手机号"></Input>
            </FormItem>
            <FormItem label="邮箱地址" prop="agentMail">
                <Input v-model="workerList.agentMail" placeholder="请输入邮箱地址"></Input>
            </FormItem>
        </Form>


        <!-- 公民类型 -->
        <Form v-show="agPlantBox.nowType=='公民'" :label-width="150" class="box_form" :model="citizenList" :rules="citizenRule" :ref="'公民'">
            <FormItem label="姓名" prop="agentName">
                <Input v-model="citizenList.agentName" placeholder="请输入姓名"></Input>
            </FormItem>
            <FormItem label="公民身份证号" prop="agentIdentiCard" >
                <Input v-model="citizenList.agentIdentiCard" placeholder="必填" clearable @on-change="plant_autoFillId(citizenList,'公民')"></Input>
            </FormItem>
            <FormItem label="出生日期" prop="birthday">
              <DatePicker
              type="date"
              :editable="false"
              placeholder="请选择出生年月"
              :clearable="false"
              format="yyyy年MM月dd日"
              style="width: 100%"
              :value="citizenList.birthday"
              @on-change="ft_plant_chgBirth($event,citizenList)"></DatePicker>
            </FormItem>
            <FormItem label="性别"  prop="sex" class="sexType">
              <RadioGroup v-model="citizenList.sex">
                  <Radio label="男">男</Radio>
                  <Radio label="女">女</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="民族" prop="nation">
              <Select
                v-model="citizenList.nation"
                placeholder="请选择民族"
                clearable
                filterable
              >
                <Option
                  v-for="(item,index) in nationAry"
                  :value="item.name"
                  :key="index"
                >{{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem label="户籍地址" prop="agentAddress">
                <Input v-model="citizenList.agentAddress" placeholder="请输入户籍地址"></Input>
            </FormItem>
            <FormItem label="常住地址" prop="agentAddress1">
                <Input v-model="citizenList.agentAddress1" placeholder="请输入常住地址"></Input>
            </FormItem>
            <FormItem label="手机号" prop="agentMobile">
                <Input v-model="citizenList.agentMobile" placeholder="请输入手机号"></Input>
            </FormItem>
            <FormItem label="邮箱地址" prop="agentMail">
                <Input v-model="citizenList.agentMail" placeholder="请输入邮箱地址"></Input>
            </FormItem>
            <FormItem label="与委托人关系" prop="litigatRelation">
                <Input v-model="citizenList.litigatRelation" placeholder="请输入与委托人关系"></Input>
            </FormItem>
        </Form>
      </div>
      <div slot="footer">
          <Button v-show='agPlantBox.nowState=="add"' style="background-color:#4873C5;color:white" size="large" long :loading="agPlantBox.addLoading" @click="editAgentInfo('save','add')">{{agPlantBox.footerBtn1}}</Button>
          <Button v-show='agPlantBox.nowState=="edit"' style="background-color:#4873C5;color:white" size="large" :loading="agPlantBox.editLoading" @click="editAgentInfo('save','edit')">{{agPlantBox.footerBtn2}}</Button>
          <Button v-show='agPlantBox.nowState=="edit"' style="background-color:#F54C4C;color:white" size="large" :loading="agPlantBox.nosaveLoading" @click="editAgentInfo('nosave','')">{{agPlantBox.footerBtn3}}</Button>
      </div>
    </Modal>
  </div>
</template>
<style lang='css' scoped>
@import "./plantiiff.css";
</style>
<script>
import '../../casecommon/casereset.css';
import plantVialte from './plantrule.js';
import nation from "@/api/nations.js";

import {tools_transDate,tools_resetObjectKeys,tools_calcIdentiyInfo,deepClone,getFileName}  from '@/libs/tools.js';
import { backLitigantInfo,backLawyerInfo,updateLitigantInfo,updateLawyerInfo,addLitigant,adddLawyer} from '@/api/setcase.js' //提交事件
export default {

  data () {
    return {
      //这两个是控制spin
      isConfirmPlantShow:true,
      isAgentShow:true,
      nationAry:nation,//民族列表
      //这两个是空列表
      confirmPlantList:deepClone(plantVialte.confirmPlantList),//当事人列表
      agPlantList:deepClone(plantVialte.agPlantList),//代理人列表
      natureList:deepClone(plantVialte.natureList),// 自然人数据
      legealList:deepClone(plantVialte.legealList),// 法人数据
      notlegealList:deepClone(plantVialte.notlegealList),// 非法人数据
      natureRule:plantVialte.naRule, //自然人表单规则
      legalRule:plantVialte.legalRule, //法人表单规则
      nolegalRule:plantVialte.nolegalRule, //非法人表单规则
      confirmPlantBox:{//当事人信息模态框
        show:false,
        title:"",
        addLoading:false,//增加按钮加载状态
        editLoading:false,//修改按钮加载状态
        nosaveLoading:false,//仅保存按钮加载状态
        footerBtn1:"添加",
        footerBtn2:"同步修改至常用当事人",
        footerBtn3:"仅本次修改",
        confirmPlantTypeList:[
          {name:'自然人',value:'自然人'},
          {name:'法人',value:'法人'},
          {name:'非法人组织',value:'非法人组织'}
        ],
        nowType:'自然人',
        nowState:"",
        //已上传的列表
        businessFileName:[],//个人身份证明文件名称（自然人）
        businessFileName1:[],//单位证明文件名称（法人）
        businessFileName2:[],//法定代表人身份证明文件名称（法人）
        businessFileName3:[],//单位证明文件名称（非法人）
        businessFileName4:[],//法定代表人身份证明文件（非法人）
        plantiffId:"plant_0",//原告ID标识
        nowId:"",//当前对应的当事人ID
      },
      lawyerList:deepClone(plantVialte.lawyerList),// 律师数据
      lawyerRule:plantVialte.lawyerRule,// 律师表单规则
      workerList:deepClone(plantVialte.workerList),// 职工数据
      workerRule:plantVialte.workerRule,// 职工表单规则
      citizenList:deepClone(plantVialte.citizenList),// 公民数据
      citizenRule:plantVialte.citizenRule,// 公民表单规则
      agPlantBox:{//代理人信息模态框
        show:false,
        title:"",
        addLoading:false,//增加按钮加载状态
        editLoading:false,//修改按钮加载状态
        nosaveLoading:false,//仅保存按钮加载状态
        footerBtn1:"添加",
        footerBtn2:"同步修改至常用当事人",
        footerBtn3:"仅本次修改",
        agentTypeList:[
          {name: '律师', value: '律师'},
          {name: '职工', value: '职工'},
          {name: '公民', value: '公民'}
        ],
        lawyerTypeList:["执业律师","实习律师"],
        lawyerType:"执业律师",
        nowState:"",
        empowerTypeList:["一般授权","特别授权"],
        empowerType:"一般授权",
        businessFileName:[],//律所函文件名称
        businessFileName1:[],//律师执业证文件名称
        businessFileName2:[],//委托书文件名称
        agPlantId: 'agent_0', // 原告代理人ID标识
        nowId:"",//当前对应的代理人ID
        nowType:'律师',//当前对应的代理人类型
      },
      agentSelectMsgShow:false,//代理人选择提示信息是否显示
      agentSelectMsg:"",//提示信息
      itSelf:false,//代理人是否包含自己
    }
  },
  props:{
    confirmPlantAry:{//获取的原告数据
        type : Array,
        default : []
    },
    agentAry:{//获取的代理人数据
        type : Array,
        default : []
    },
  },
  //当有值时关闭spin
  watch: {
    confirmPlantAry(val){
      this.isConfirmPlantShow=false;
    },
    agentAry(val){
      this.isAgentShow=false;
    }
  },
  //拿到当前登录用户的身份
  mounted() {
    console.log("UERID",this.$store.getters.userName,this.$store.getters.userIdCard);
  },
  methods:{
    //进行下一步，提交代理人必须存在原告
    ft_plantNextSetp(){
      if(this.$store.getters.roLeName=="代理人"){
        if(this.confirmPlantList.length!=0 && this.agPlantList.length!=0){
          //判断代理人是不是包含自己
          if(!this.itSelf){
            this.$Notice.warning({'title':'代理人必须包含自己！请添加！<br/>且与登陆者姓名、身份证保持一致'});
            return
          }
          //将数据插入下一步
          this.setNextData();
        }else{
          this.$Notice.warning({'title':'至少选择一个当事人和代理人！',duration: 5});
        }
      }
      //提交原告可以不用代理人
      if(this.$store.getters.roLeName=="当事人"){
        if(this.confirmPlantList.length!=0){
          //将数据插入下一步
          this.setNextData();
        }else{
          this.$Notice.warning({'title':'至少选择一个当事人！',duration: 5});
        }
      }
    },
    setNextData(){//将数据插入下一步
        //将原告代理人列表放入原告列表,放在律师下
        this.confirmPlantList.forEach((item,index) => {
          let agPlantList=deepClone(this.agPlantList)
          item.layers=agPlantList;
        });

        //将第一步的原告列表传给总数据列表,这里为空转化
        this.confirmPlantList.forEach(function(value,i){
          if(value.businessLicense==null){
            value.businessLicense=''
          }
          if(value.legalIdentity==null){
            value.legalIdentity=''
          }
          if(value.phone==null){
            value.phone=''
          }
        })
        this.$emit('toNextStep',{type:'原告信息',state:'next',plaintiffs:this.confirmPlantList});
    },
    //当事人切换，拿到当事人列表
    typeChangeTab1(e,index,item){
      //选中就取消
      if(event.target.className=='reg_chooseFocus'){
        event.target.className='';//再次点击清除选中状态
        this.confirmPlantList.forEach((that,index)=>{//删除当前选中项
          if(that.id==item.id){
            this.confirmPlantList.splice(index,1);
          }
        })
        console.log("item",item)
        console.log('confirmPlantList',this.confirmPlantList)
      }else{//未选中就选中,设置背景蓝色
        event.target.className='reg_chooseFocus'//选中
        switch(item.organizationType){
          case "自然人":
            //拷贝空数组赋值
            var newObj=deepClone(this.natureList);
            newObj.id=item.id // 当事人ID
            newObj.name=item.name // 姓名
            newObj.identityCard=item.idcard // 身份证号
            newObj.litigantBirthday=item.birthday // 出生日期
            newObj.litigantSex=item.sex // 性别
            newObj.litigantNation=item.nation// 民族
            for(let value of item.personAddresss){
              switch(value.addressType){
                case "户籍地址":
                  newObj.litigantPermanentAddress= value.address// 户籍地址
                break;
                case "经常居住地址":
                  newObj.address= value.address// 经常居住地址
                break;
                case "送达地址":
                  newObj.serviceAddress= value.address// 送达地址
                break;
              }
            }
            for(let value of item.personPhone){
              if(value.phoneType=="手机"){
                  newObj.phone=value.phone; // 手机号
                break;
              }
            }
            newObj.email=item.email // 电子邮箱
            newObj.businessLicense=item.provePath // 个人身份证明文件
            newObj.layers=[]//代理人信息
          break;
          case "法人":
            var newObj=deepClone(this.legealList);
            newObj.id=item.id // 当事人ID
            newObj.name= item.name // 名称
            newObj.identityCard= item.idcard // 社会统一信用代码
            for(let value of item.personAddresss){
              switch(value.addressType){
                case "注册地址":
                  newObj.address= value.address// 户籍地址
                break;
                case "经营地址":
                  newObj.address1= value.address// 经常居住地址
                break;
                case "送达地址":
                  newObj.serviceAddress= value.address// 送达地址
                break;
              }
            }
            for(let value of item.personPhone){
              if(value.phoneType=="固话" || value.phoneType=="手机"){
                newObj.phone=value.phone; // 手机号
                break;
              }
            }
            newObj.businessLicense= item.provePath // 单位证明文件
            newObj.phone= item.contactPhone // 单位固定电话
            newObj.email=item.email // 单位电子邮箱
            newObj.legalManName= item.legalName // 法定代表人
            newObj.legalDuty= item.legalDuty // 法定代表人职务
            newObj.legalManPhone= item.legalPhone // 法定代表人手机号
            newObj.legalManId= item.legalIdCard // 法定代表人身份证号码
            newObj.legalIdentity= item.provePath // 法定代表人身份证明文件
            newObj.layers= [] //代理人信息
          break;
          case "非法人组织":
            var newObj=deepClone(this.notlegealList);
            newObj.id=item.id // 当事人ID
            newObj.name= item.name // 名称
            for(let value of item.personAddresss){
              switch(value.addressType){
                case "注册地址":
                  newObj.address= value.address// 户籍地址
                break;
                case "经营地址":
                  newObj.address1= value.address// 经常居住地址
                break;
                case "送达地址":
                  newObj.serviceAddress= value.address// 送达地址
                break;
              }
            }
            for(let value of item.personPhone){
              if(value.phoneType=="固话"){
                newObj.phone=value.phone; // 手机号
                break;
              }
            }
            newObj.businessLicense= item.provePath // 单位证明文件
            newObj.phone= item.contactPhone // 单位固定电话
            newObj.email=item.email // 单位电子邮箱
            newObj.legalManName= item.legalName // 法定代表人
            newObj.legalDuty= item.legalDuty // 法定代表人职务
            newObj.legalManPhone= item.legalPhone // 法定代表人手机号
            newObj.legalManId= item.legalIdCard // 法定代表人身份证号码
            newObj.legalIdentity= item.provePath // 法定代表人身份证明文件
            newObj.layers= [] //代理人信息
          break;
        }
        this.confirmPlantList.push(newObj);
        console.log(this.confirmPlantList)
      }
    },
    //代理人切换
    typeChangeTab2(e,item,index){
      this.agentSelectMsgShow=false;//关闭提示信息
      if(event.target.className=='reg_chooseFocus'){
        event.target.className='';//再次点击清除选中状态
        this.itSelf=false
        this.agPlantList.forEach((that,index)=>{//删除当前选中项
          if(that.id==item.id){
            this.agPlantList.splice(index,1);
          }
        })
        console.log('agPlantList',this.agPlantList)
        //判断代理人是否包含自己
        this.checkItSelf();
      }else{
        if(this.agPlantList.length<2){//目前只支持两个代理人，所以两个后限制添加
          event.target.className='reg_chooseFocus'//选中
          switch (item.agentType) {
            case "律师":
              //判断是否有委托书和律所函
              // if(!item.commissionHas || !item.lawFirmLetterHas){
              //   event.target.className=''//取消选中
              //   this.agentSelectMsg=item.name+"该代理人未上传委托书或律所函！"
              //   this.agentSelectMsgShow=true;//超过开启提示信息
              //   return
              // }
              var newObj=deepClone(this.lawyerList);
              newObj.id=item.id
              newObj.agPlantId="agent_"+index// 原告代理人ID标识(自定义)  
              newObj.agPlant= this.confirmPlantList // 原告委托人
              newObj.agentMail= item.email // 代理人邮箱
              newObj.agentType= item.agentType // 代理人类型
              newObj.agentName= item.name // 代理人姓名
              newObj.agentIdentiCard= item.idcard // 身份证号
              newObj.lawerNum= item.lawerNum // 律师执业证号
              for(let value of item.personPhone){
                if(value.phoneType=="手机"){
                  newObj.agentMobile=value.phone; // 手机号
                  break;
                }
              }
              item.personAddresss.forEach((item,index) => {
                if(item.addressType==="经常居住地址"){
                  newObj.agentAddress= item.address// 联系人地址
                }
              });
              newObj.lawFirmLetter= item.lawFirmLetter // 律师函
              newObj.lawerCardUrl= item.lawerCardUrl // 律师执业证
              newObj.commission= item.commission // 委托书
              newObj.lawFirm= item.lawFirm //律师所（住处）
            break;
            case "职工":
              var newObj=deepClone(this.workerList);
              newObj.id=item.id
              newObj.agPlantId="agent_"+index// 原告代理人ID标识(自定义)  
              newObj.agPlant= this.confirmPlantList // 原告委托人
              newObj.agentMail= item.email // 代理人邮箱
              newObj.agentType= item.agentType // 代理人类型
              newObj.agentName= item.name // 代理人姓名
              newObj.agentIdentiCard= item.idcard // 身份证号
              newObj.birthday=item.birthday//出生日期
              newObj.nation=item.nation//民族
              newObj.sex=item.sex//性别
              for(let value of item.personPhone){
                if(value.phoneType=="手机"){
                  newObj.agentMobile=value.phone; // 手机号
                  break;
                }
              }
              item.personAddresss.forEach((item,index) => {
                switch (item.addressType) {
                  case "户籍地址":
                    newObj.agentAddress= item.address// 联系人地址
                  break;
                  case "经常居住地址":
                    newObj.agentAddress1= item.address// 联系人地址
                  break;
                }
              });
            break;
            case "公民":
              var newObj=deepClone(this.citizenList);
              newObj.id=item.id
              newObj.agPlantId="agent_"+index// 原告代理人ID标识(自定义)  
              newObj.agPlant= this.confirmPlantList // 原告委托人
              newObj.agentMail= item.email // 代理人邮箱
              newObj.agentType= item.agentType // 代理人类型
              newObj.agentName= item.name // 代理人姓名
              newObj.agentIdentiCard= item.idcard // 身份证号
              newObj.birthday=item.birthday//出生日期
              newObj.nation=item.nation//民族
              newObj.sex=item.sex//性别
              newObj.litigatRelation=item.litigatRelation//与委托人关系
              for(let value of item.personPhone){
                if(value.phoneType=="手机"){
                  newObj.agentMobile=value.phone; // 手机号
                  break;
                }
              }
              item.personAddresss.forEach((item,index) => {
                switch (item.addressType) {
                  case "户籍地址":
                    newObj.agentAddress= item.address// 联系人地址
                  break;
                  case "经常居住地址":
                    newObj.agentAddress1= item.address// 联系人地址
                  break;
                }
              });
            break;
          }
          this.agPlantList.push(newObj);
          console.log('agPlantList',this.agPlantList)
          //判断代理人是否包含自己
          this.checkItSelf();
        }else{
          this.agentSelectMsg="最多只能选择两个代理人！"
          this.agentSelectMsgShow=true;//超过开启提示信息
        }
      }
    },
     //判断代理人是否包含自己
    checkItSelf(){
      if(this.agPlantList.length>0 && this.$store.getters.roLeName=="代理人"){
        for(let value of this.agPlantList){
          if(!value.agentName || !value.agentIdentiCard){
            this.$Notice.warning({'title':'所选代理人信息不完善，请修改',duration: 5});
            return
          }
           //条件成立就说明是代理人自己
          if(value.agentName==this.$store.getters.userName && value.agentIdentiCard==this.$store.getters.userIdCard){
            // console.log("true")
            this.itSelf=true
          }
        }
        //console.log(this.itSelf)
        if(!this.itSelf){
          this.agentSelectMsg="代理人必须包含自己！请添加！且与登陆者姓名、身份证保持一致"
          this.agentSelectMsgShow=true;//超过开启提示信息
        }
      }
    },
    typeChangeTab3(type){//选择当事人类型
      this.confirmPlantBox.nowType=type;
    },
    typeChangeTab4(type){//选择律师职业资格
      this.agPlantBox.lawyerType=type;
      this.lawyerList.lawyerType=type;
    },
    typeChangeTab5(type){//选择授权类型
      this.agPlantBox.empowerType=type;
      this.lawyerList.empowerType=type;
    },
    typeChangeTab6(type){//选择当事人类型
      this.agPlantBox.nowType=type;
    },
    showConfirmPlantBox(e,type,id){//显示常用当事人窗体
      this.myEvent=event.target.previousElementSibling
      console.log("myEvent",this.myEvent)
      this.confirmPlantBox.nowState=type;  //用来标记新增或修改按钮
      this.confirmPlantBox.nowId=id; 
      this.confirmPlantBox.show=true;
      this.clearConfirmPlantFrom();//清空表单
      this.confirmPlantBox.confirmPlantTypeList.forEach(item => {//重置表单提示
        this.resetField(item.value)
      });
      switch(type){
        case 'add':
          this.confirmPlantBox.title='添加常用当事人';
        break;
        case 'edit':
          this.confirmPlantBox.title='查看/修改常用当事人';
          //回填该当事人信息
          backLitigantInfo({id:this.confirmPlantBox.nowId}).then(res=>{
            console.log(res)
            if(res.data.state==100){
              let data=res.data.data;
              this.confirmPlantBox.nowType=data.organizationType;
              switch(data.organizationType){
                case "自然人":
                  this.natureList.name=data.name;
                  this.natureList.identityCard=data.idcard;
                  this.natureList.litigantBirthday=data.birthday;
                  this.natureList.litigantSex=data.sex;
                  this.natureList.litigantNation=data.nation;
                  this.natureList.addressList=data.personAddresss;
                  this.natureList.phoneList=data.personPhone;
                  for(let value of data.personAddresss){
                    switch(value.addressType){
                      case "户籍地址":
                        this.natureList.litigantPermanentAddress= value.address;
                      break;
                      case "经常居住地址":
                        this.natureList.address= value.address;
                      break;
                      case "送达地址":
                        this.natureList.serviceAddress= value.address;
                      break;
                    }
                  }
                  for(let value of data.personPhone){
                    if(value.phoneType=="手机"){
                      this.natureList.phone=value.phone;
                      break;
                    }
                  }
                  this.natureList.email=data.email;
                  // this.natureList.businessLicense.push=data.provePath;  // 获取多个身份证明文件，后期需要数组文件改为这个
                  this.natureList.businessLicense.push(data.provePath);  // 获取单个身份证明文件
                  this.natureList.businessLicenseUp='hasUp';
                  for(let value of this.natureList.businessLicense){//获取文件名
                    let fileName=getFileName(value)
                    if(fileName!=''){
                      this.confirmPlantBox.businessFileName.push(fileName);
                    }
                  }
                break;
                case "法人":
                  this.legealList.name=data.name;
                  this.legealList.identityCard=data.idcard;
                  this.legealList.addressList=data.personAddresss;
                  this.legealList.phoneList=data.personPhone;
                  for(let value of data.personAddresss){
                    switch(value.addressType){
                      case "注册地址":
                        this.legealList.address= value.address// 注册地址
                      break;
                      case "经营地址":
                        this.legealList.address1= value.address// 经营地址
                      break;
                      case "送达地址":
                        this.legealList.serviceAddress= value.address;//送达地址
                      break;
                    }
                  }
                  // this.legealList.businessLicense.push=data.provePath;  // 获取多个单位证明文件，后期需要数组文件改为这个
                  this.legealList.businessLicense.push(data.provePath);  // 获取单个单位证明文件
                  this.legealList.businessLicenseUp1='hasUp';
                  for(let value of this.legealList.businessLicense){//获取文件名
                    let fileName=getFileName(value)
                    if(fileName!=''){
                      this.confirmPlantBox.businessFileName1.push(fileName);
                    }
                  }
                  for(let value of data.personPhone){
                    if(value.phoneType=="固话"){
                      this.legealList.phone=value.phone;
                      break;
                    }
                  }
                  this.legealList.email=data.email, // 单位电子邮箱
                  this.legealList.legalManName= data.legalName // 法定代表人
                  this.legealList.legalDuty=data.legalDuty; // 法定代表人职务
                  this.legealList.legalManPhone= data.legalPhone // 法定代表人手机号
                  this.legealList.legalManId= data.legalIdCard // 法定代表人身份证号码
                  // this.legealList.legalIdentity.push=data.idcardPath;  // 获取多个法定代表人身份证明文件，后期需要数组文件改为这个
                  this.legealList.legalIdentity.push(data.idcardPath);  // 获取单个法定代表人身份证明文件
                  this.legealList.businessLicenseUp2='hasUp';
                  for(let value of this.legealList.legalIdentity){//获取文件名
                    let fileName=getFileName(value)
                    if(fileName!=''){
                      this.confirmPlantBox.businessFileName2.push(getFileName(value));
                    }
                  }
                break;
                case "非法人组织":
                  this.notlegealList.name=data.name;
                  this.notlegealList.identityCard=data.idcard;
                  this.notlegealList.addressList=data.personAddresss;
                  this.notlegealList.phoneList=data.personPhone;
                  for(let value of data.personAddresss){
                    switch(value.addressType){
                      case "注册地址":
                        this.notlegealList.address= value.address// 注册地址
                      break;
                      case "经营地址":
                        this.notlegealList.address1= value.address// 经营地址
                      break;
                      case "送达地址":
                        this.notlegealList.serviceAddress= value.address;//送达地址
                      break;
                    }
                  }
                  // this.notlegealList.businessLicense.push=data.provePath;  // 获取多个单位证明文件，后期需要数组文件改为这个
                  this.notlegealList.businessLicense.push(data.provePath);  // 获取单个单位证明文件
                  this.notlegealList.businessLicenseUp1='hasUp';
                  for(let value of this.notlegealList.businessLicense){//获取文件名
                    let fileName=getFileName(value)
                    if(fileName!=''){
                      //循环打印并且可以删除操作
                      this.confirmPlantBox.businessFileName3.push(getFileName(value));
                    }
                  }
                  for(let value of data.personPhone){
                    if(value.phoneType=="固话"){
                      this.notlegealList.phone=value.phone;
                      break;
                    }
                  }
                  this.notlegealList.email=data.email, // 单位电子邮箱
                  this.notlegealList.legalManName= data.legalName // 负责人
                  this.notlegealList.legalDuty=data.legalDuty;// 负责人职务
                  this.notlegealList.legalManPhone= data.legalPhone // 负责人手机号
                  this.notlegealList.legalManId= data.legalIdCard // 负责人身份证号码
                  // this.notlegealList.legalIdentity.push=data.idcardPath;  // 获取多个负责人身份证明文件，后期需要数组文件改为这个
                  this.notlegealList.legalIdentity.push(data.idcardPath);  // 获取单个负责人身份证明文件
                  this.notlegealList.businessLicenseUp2='hasUp';
                  for(let value of this.notlegealList.legalIdentity){//获取文件名
                    let fileName=getFileName(value)
                    if(fileName!=''){
                      this.confirmPlantBox.businessFileName4.push(getFileName(value));
                    }
                  }
                break;
              }
            }else{

            }
          })
        break;
      }
    },

    //添加/修改常用当事人
    editConfirmPlantInfo(type,state){
      if(this.myEvent!=null){//判断是添加还是修改操作
        if(this.myEvent.className=='reg_chooseFocus'){
          this.clearSelect(this.confirmPlantBox.nowId,this.confirmPlantList,"plant")//清除选中数据
        }
      }
      switch(type){
        case "save":
          console.log(this.confirmPlantBox.nowId)
          switch (this.confirmPlantBox.nowType) {
            case "自然人":
              var sendData=deepClone(this.natureList);
              //获取地址列表（后端编辑需要）
              for(let value of sendData.addressList){
                 switch(value.addressType){
                    case "户籍地址":
                      value.address=this.natureList.litigantPermanentAddress;
                    break;
                    case "经常居住地址":
                      value.address=this.natureList.address;
                    break;
                    case "送达地址":
                      value.address=this.natureList.serviceAddress;
                    break;
                 }
              }
              //获取电话列表（后端编辑需要）
              for(let value of sendData.phoneList){
                 switch(value.phoneType){
                    case "手机":
                      value.phone=this.natureList.phone;
                    break;
                 }
              }
              //目前只取一个文件，后期需要数组文件可删
              sendData.businessLicense=sendData.businessLicense.length > 0 ? sendData.businessLicense[0] : '';
              console.log(sendData)
            break;
            case "法人":
              var sendData=deepClone(this.legealList);
              //获取地址列表（后端编辑需要）
              for(let value of sendData.addressList){
                 switch(value.addressType){
                    case "注册地址":
                      value.address=this.legealList.address;
                    break;
                    case "经营地址":
                      value.address=this.legealList.address1;
                    break;
                    case "送达地址":
                      value.address=this.legealList.serviceAddress;
                    break;
                 }
              }
              //获取电话列表（后端编辑需要）
              console.log(sendData.phoneList)
              for(let value of sendData.phoneList){
                 switch(value.phoneType){
                    case "固话":
                      value.phone=this.legealList.phone;
                    break;
                 }
              }
              //目前只取一个文件，后期需要数组文件可删
              sendData.businessLicense=sendData.businessLicense.length > 0 ? sendData.businessLicense[0] : '';
              sendData.legalIdentity=sendData.legalIdentity.length > 0 ? sendData.legalIdentity[0] : '';
              console.log(sendData)
            break;
            case "非法人组织":
             console.log(this.notlegealList)
              var sendData=deepClone(this.notlegealList);
              //获取地址列表（后端编辑需要）
              for(let value of sendData.addressList){
                 switch(value.addressType){
                    case "注册地址":
                      value.address=this.notlegealList.address;
                    break;
                    case "经营地址":
                      value.address=this.notlegealList.address1;
                    break;
                    case "送达地址":
                      value.address=this.notlegealList.serviceAddress;
                    break;
                 }
              }
              //获取电话列表（后端编辑需要）
              for(let value of sendData.phoneList){
                 switch(value.phoneType){
                    case "固话":
                      value.phone=this.notlegealList.phone;
                    break;
                 }
              }
              //目前只取一个文件，后期需要数组文件可删
              sendData.businessLicense=sendData.businessLicense.length > 0 ? sendData.businessLicense[0] : '';
              sendData.legalIdentity=sendData.legalIdentity.length > 0 ? sendData.legalIdentity[0] : '';
              console.log(sendData)
            break;
          }
          let name=this.confirmPlantBox.nowType;
          console.log(name)
          switch(state){
            case "edit"://修改当事人信息
              //表单验证
              this.$refs[name].validate((valid) => {
                  if (valid) {
                    //当事人id
                    sendData.id=this.confirmPlantBox.nowId;
                    //设置状态
                    this.confirmPlantBox.editLoading=true;
                    updateLitigantInfo(sendData).then(res=>{
                      if(res.data.state==100){
                        this.$Message.success(res.data.message);
                        this.$emit('getConfirmPlantInfo');//刷新
                      }else{
                        this.$Message.error(res.data.message);
                      }
                      this.confirmPlantBox.editLoading=false;
                    });
                  } else {
                    this.$Message.error('请填写完整信息!');
                  }
              })
            break;
            case "add"://增加当事人信息
              //表单验证
              this.$refs[name].validate((valid) => {
                  if (valid) {
                    //设置状态
                    this.confirmPlantBox.addLoading=true;
                    addLitigant(sendData).then(res=>{
                      if(res.data.state==100){
                        this.$Message.success(res.data.message);
                        this.$emit('getConfirmPlantInfo');//刷新
                        this.confirmPlantBox.show=false;
                      }else{
                        this.$Message.error(res.data.message);
                      }
                      this.confirmPlantBox.addLoading=false;
                    });
                  } else {
                    this.$Message.error('请填写完整信息!');
                  }
              })
            break;
          }
        break;
        case "nosave":
          this.$Modal.confirm({
              title: '提示',
              content: '<p>本次修改只针对此次案件信息进行修改，不会改变当事人信息数据库。',
              onOk: () => {
                switch (this.confirmPlantBox.nowType) {
                  case '自然人':
                    this.$emit("editConfirmPlantInfo",{type:"自然人",natureList:this.natureList,id:this.confirmPlantBox.nowId});//更新数据
                  break
                  case '法人':
                    this.$emit("editConfirmPlantInfo",{type:"法人",legealList:this.legealList,id:this.confirmPlantBox.nowId});//更新数据
                  break
                  case '非法人组织':
                    this.$emit("editConfirmPlantInfo",{type:"非法人组织",notlegealList:this.notlegealList,id:this.confirmPlantBox.nowId});//更新数据
                  break
                }
                  this.confirmPlantBox.show=false;
              },
              onCancel: () => {
              }
          });
        break;
      }
    },
    showAgentBox(type,id){//显示常用代理人窗体
      this.myEvent=event.target.previousElementSibling
      console.log("myEvent",this.myEvent)
      this.agPlantBox.nowState=type;
      this.agPlantBox.nowId=id;
      this.agPlantBox.show=true;
      this.clearAgentFrom();//清空代理人表单
      this.agPlantBox.agentTypeList.forEach((item,index) => {//重置表单提示
        this.resetField(item.value)
      });
      switch(type){
        case 'add':
          this.agPlantBox.title='添加常用代理人';
        break;
        case 'edit':
          this.agPlantBox.title='查看/修改常用代理人';
          //回填代理人信息
          backLawyerInfo({id:this.agPlantBox.nowId}).then(res=>{
            if(res.data.state==100){
                let data=res.data.data;
                this.agPlantBox.nowType=data.agentType;
                switch (data.agentType) {
                  case "律师":
                    this.lawyerList.agentName=data.name;
                    this.lawyerList.agentIdentiCard=data.idcard;
                    this.agPlantBox.lawyerType=data.lawyerType;
                    this.agPlantBox.empowerType=data.empowerType;
                    this.lawyerList.lawerNum=data.lawerNum;
                    this.lawyerList.addressList=data.personAddresss;
                    this.lawyerList.phoneList=data.personPhone;
                    for(let value of data.personPhone){
                      if(value.phoneType=="手机"){
                        this.lawyerList.agentMobile=value.phone;
                        break;
                      }
                    }
                    for(let value of data.personAddresss){
                      if(value.addressType=="工作地址"){
                        this.lawyerList.agentAddress=value.address;
                        break;
                      }
                    }
                    this.lawyerList.agentMail=data.email;
                    this.lawyerList.lawFirm=data.lawFirm;
                    // this.lawyerList.lawFirmLetter.push=data.lawFirmLetter;  // 获取多个律师函文件，后期需要数组文件改为这个
                    this.lawyerList.lawFirmLetter.push(data.lawFirmLetter);  // 获取单个律师函文件
                    this.lawyerList.businessLicenseUp1="hasUp";
                    console.log(this.lawyerList.lawFirmLetter)
                    for(let value of this.lawyerList.lawFirmLetter){//获取文件名
                      let fileName=getFileName(value)
                      if(fileName!=''){
                        this.agPlantBox.businessFileName.push(getFileName(value));
                      }
                    }
                    // this.lawyerList.lawerCardUrl.push=data.lawerCardUrl;  // 获取多个律师执业证文件，后期需要数组文件改为这个
                    this.lawyerList.lawerCardUrl.push(data.lawerCardUrl);  // 获取单个律师执业证文件
                    this.lawyerList.businessLicenseUp2="hasUp";
                    for(let value of this.lawyerList.lawerCardUrl){//获取文件名
                      let fileName=getFileName(value)
                      if(fileName!=''){
                        this.agPlantBox.businessFileName1.push(getFileName(value));
                      }
                    }
                    // this.lawyerList.commission.push=data.commission;  // 获取多个委托书文件，后期需要数组文件改为这个
                    this.lawyerList.commission.push(data.commission);  // 获取单个委托书文件
                    this.lawyerList.businessLicenseUp3="hasUp";
                    for(let value of this.lawyerList.commission){//获取文件名
                      let fileName=getFileName(value)
                      if(fileName!=''){
                        this.agPlantBox.businessFileName2.push(getFileName(value));
                      }
                    }
                  break;
                  case "职工":
                    this.workerList.agentName=data.name;
                    this.workerList.agentIdentiCard=data.idcard;
                    this.workerList.birthday=data.birthday;
                    this.workerList.nation=data.nation;
                    this.workerList.sex=data.sex;
                    this.workerList.addressList=data.personAddresss;
                    this.workerList.phoneList=data.personPhone;
                    for(let value of data.personPhone){
                      if(value.phoneType=="手机"){
                        this.workerList.agentMobile=value.phone;
                        break;
                      }
                    }
                    for(let value of data.personAddresss){
                      switch (value.addressType) {
                        case "户籍地址":
                          this.workerList.agentAddress=value.address;
                        break;
                        case "经常居住地址":
                          this.workerList.agentAddress1=value.address;
                        break;
                      }
                    }
                    this.workerList.agentMail=data.email;
                  break;
                  case "公民":
                    this.citizenList.agentName=data.name;
                    this.citizenList.agentIdentiCard=data.idcard;
                    this.citizenList.birthday=data.birthday;
                    this.citizenList.nation=data.nation;
                    this.citizenList.sex=data.sex;
                    this.citizenList.addressList=data.personAddresss;
                    this.citizenList.phoneList=data.personPhone;
                    for(let value of data.personPhone){
                      if(value.phoneType=="手机"){
                        this.citizenList.agentMobile=value.phone;
                        break;
                      }
                    }
                    for(let value of data.personAddresss){
                      switch (value.addressType) {
                        case "户籍地址":
                          this.citizenList.agentAddress=value.address;
                        break;
                        case "经常居住地址":
                          this.citizenList.agentAddress1=value.address;
                        break;
                      }
                    }
                    this.citizenList.agentMail=data.email;
                    this.citizenList.litigatRelation=data.litigatRelation;
                  break;
                }
            }else{

            }
          })
        break;
      }
    },
    editAgentInfo(type,state){//添加/修改常用代理人
      if(this.myEvent!=null){//判断是添加还是修改操作
        if(this.myEvent.className=='reg_chooseFocus'){
          this.clearSelect(this.agPlantBox.nowId,this.agPlantList,'agent')//清除选中数据
        }
      }
      switch(type){
        case "save":
          switch(this.agPlantBox.nowType){
            case "律师":
              var sendData=deepClone(this.lawyerList);
              //获取地址列表（后端编辑需要）
              for(let value of sendData.addressList){
                  switch(value.addressType){
                    case "工作地址":
                      value.address=this.lawyerList.agentAddress;
                    break;
                  }
              }
              //获取电话列表（后端编辑需要）
              for(let value of sendData.phoneList){
                  switch(value.phoneType){
                    case "手机":
                      value.phone=this.lawyerList.agentMobile;
                    break;
                  }
              }
              //目前只取一个文件，后期需要数组文件可删
              sendData.lawFirmLetter=sendData.lawFirmLetter.length > 0 ? sendData.lawFirmLetter[0] : '';
              sendData.lawerCardUrl=sendData.lawerCardUrl.length > 0 ? sendData.lawerCardUrl[0] : '';
              sendData.commission=sendData.commission.length > 0 ? sendData.commission[0] : '';
              console.log(sendData)
            break;
            case "职工":
              var sendData=deepClone(this.workerList);
              //获取地址列表（后端编辑需要）
              for(let value of sendData.addressList){
                switch(value.addressType){
                  case "户籍地址":
                    value.address=this.workerList.agentAddress;
                  break;
                  case "经常居住地址":
                    value.address=this.workerList.agentAddress1;
                  break;
                }
              }
              //获取电话列表（后端编辑需要）
              for(let value of sendData.phoneList){
                  switch(value.phoneType){
                    case "手机":
                      value.phone=this.workerList.agentMobile;
                    break;
                  }
              }
              console.log(sendData)
            break;
            case "公民":
              var sendData=deepClone(this.citizenList);
              //获取地址列表（后端编辑需要）
              for(let value of sendData.addressList){
                switch(value.addressType){
                  case "户籍地址":
                    value.address=this.citizenList.agentAddress;
                  break;
                  case "经常居住地址":
                    value.address=this.citizenList.agentAddress1;
                  break;
                }
              }
              //获取电话列表（后端编辑需要）
              for(let value of sendData.phoneList){
                  switch(value.phoneType){
                    case "手机":
                      value.phone=this.citizenList.agentMobile;
                    break;
                  }
              }
              console.log(sendData)
            break;
          }

          switch(state){
            case "edit"://修改代理人信息
              //表单验证
              this.$refs[this.agPlantBox.nowType].validate((valid) => {
                  if (valid) {
                    //添加代理人id
                    sendData.id=this.agPlantBox.nowId;
                    //设置状态
                    this.agPlantBox.editLoading=true;
                    updateLawyerInfo(sendData).then(res=>{
                      if(res.data.state==100){
                        this.$Message.success(res.data.message);
                        this.$emit('getConfirmPlantInfo');//刷新
                      }else{
                        this.$Message.error(res.data.message);
                      }
                      this.agPlantBox.editLoading=false;
                    });
                  } else {
                    this.$Message.error('请填写完整信息!');
                  }
              })
            break;
            case "add"://增加代理人信息
              //表单验证
              this.$refs[this.agPlantBox.nowType].validate((valid) => {
                  if (valid) {
                    //设置状态
                    this.agPlantBox.addLoading=true;
                    adddLawyer(sendData).then(res=>{
                      if(res.data.state==100){
                        this.$Message.success(res.data.message);
                        this.$emit('getConfirmPlantInfo');//刷新
                        this.agPlantBox.show=false;
                      }else{
                        this.$Message.error(res.data.message);
                      }
                      this.agPlantBox.addLoading=false;
                    });
                  } else {
                    this.$Message.error('请填写完整信息!');
                  }
              })
            break;
          }
        break;
        //仅本次修改按钮
        case "nosave":
          this.$Modal.confirm({
              title: '提示',
              content: '<p>本次修改只针对此次案件信息进行修改，不会改变代理人信息数据库。',
              onOk: () => {
                switch(this.agPlantBox.nowType){
                  case "律师":
                    this.$emit("editAgentPlantInfo",{type:"律师",lawyerList:this.lawyerList,id:this.agPlantBox.nowId});//更新数据
                  break;
                  case "职工":
                    this.$emit("editAgentPlantInfo",{type:"职工",workerList:this.workerList,id:this.agPlantBox.nowId});//更新数据
                  break;
                  case "公民":
                    this.$emit("editAgentPlantInfo",{type:"公民",citizenList:this.citizenList,id:this.agPlantBox.nowId});//更新数据
                  break;
                }
                this.agPlantBox.show=false;
              },
              onCancel: () => {
              }
          });
        break;
      }
    },
    clearSelect(id,list,type){
      this.myEvent.className='';//清除选中状态
      list.forEach((that,index)=>{//删除选中项
        if(that.id==id){
          list.splice(index,1);
        }
      })
      if(type=='agent'){//如果是代理人，关闭提示信息
        this.agentSelectMsgShow=false;
        this.itSelf=false;
      }
    },
    //上传文件
    plant_uploadSuccess (res,item) {
      console.log("888888888888888888888",item)
      if(res.state === 100) {
        this.$Message.success(res.message);
        let data=res.data.result[0];
        switch(data.fileType){
           case "个人身份证明文件":
           console.log(this.natureList.businessLicense,this.confirmPlantBox.businessFileName)
              this.natureList.businessLicense=[];//后期需要数组文件可删
              this.confirmPlantBox.businessFileName=[];//后期需要数组文件可删
              this.natureList.businessLicense.push(data.filePath);
              this.confirmPlantBox.businessFileName.push(data.fileName);
              this.natureList.businessLicenseUp='hasUp';
              console.log(this.natureList.businessLicense,this.confirmPlantBox.businessFileName)
           break;
           case "单位证明文件（法人）":
              this.legealList.businessLicense=[];//后期需要数组文件可删
              this.confirmPlantBox.businessFileName1=[];//后期需要数组文件可删
              this.legealList.businessLicense.push(data.filePath);
              this.confirmPlantBox.businessFileName1.push(data.fileName);
              this.legealList.businessLicenseUp1='hasUp';
              console.log(this.legealList.businessLicense,this.confirmPlantBox.businessFileName1)
           break;
           case "法定代表人身份证明文件（法人）":
              this.legealList.legalIdentity=[];//后期需要数组文件可删
              this.confirmPlantBox.businessFileName2=[];//后期需要数组文件可删
              this.legealList.legalIdentity.push(data.filePath);
              this.confirmPlantBox.businessFileName2.push(data.fileName);
              this.legealList.businessLicenseUp2='hasUp';
              console.log(this.legealList.legalIdentity,this.confirmPlantBox.businessFileName2)
           break;
           case "单位证明文件（非法人）":
              this.notlegealList.businessLicense=[];//后期需要数组文件可删
              this.confirmPlantBox.businessFileName3=[];//后期需要数组文件可删
              this.notlegealList.businessLicense.push(data.filePath);
              this.confirmPlantBox.businessFileName3.push(data.fileName);
              this.notlegealList.businessLicenseUp1='hasUp';
              console.log(this.notlegealList.businessLicense,this.confirmPlantBox.businessFileName3)
           break;
           case "负责人身份证明文件（非法人）":
              this.notlegealList.legalIdentity=[];//后期需要数组文件可删
              this.confirmPlantBox.businessFileName4=[];//后期需要数组文件可删
              this.notlegealList.legalIdentity.push(data.filePath);
              this.confirmPlantBox.businessFileName4.push(data.fileName);
              this.notlegealList.businessLicenseUp2='hasUp';
              console.log(this.notlegealList.legalIdentity,this.confirmPlantBox.businessFileName4)
           break;
           case "律所函":
              this.lawyerList.lawFirmLetter=[];//后期需要数组文件可删
              this.agPlantBox.businessFileName=[];//后期需要数组文件可删
              this.lawyerList.lawFirmLetter.push(data.filePath);
              this.agPlantBox.businessFileName.push(data.fileName);
              this.lawyerList.businessLicenseUp1="hasUp";
              item.lawFirmLetter= data.filePath// 律师函
              this.$set(item,"lawFirmLetterHas", "hasUp")
              console.log(this.lawyerList.lawFirmLetter,this.agPlantBox.businessFileName)
           break;
           case "律师执业证":
              this.lawyerList.lawerCardUrl=[];//后期需要数组文件可删
              this.agPlantBox.businessFileName1=[];//后期需要数组文件可删
              this.lawyerList.lawerCardUrl.push(data.filePath);
              this.agPlantBox.businessFileName1.push(data.fileName);
              this.lawyerList.businessLicenseUp2="hasUp";
              console.log(this.lawyerList.lawerCardUrl,this.agPlantBox.businessFileName1)
           break;
           case "委托书":
              this.lawyerList.commission=[];//后期需要数组文件可删
              this.agPlantBox.businessFileName2=[];//后期需要数组文件可删
              this.lawyerList.commission.push(data.filePath);
              this.agPlantBox.businessFileName2.push(data.fileName);
              this.lawyerList.businessLicenseUp3="hasUp";
              item.commission= data.filePath // 委托书
              this.$set(item,"commissionHas", "hasUp")
              console.log(this.lawyerList.commission,this.agPlantBox.businessFileName2)
           break;
        }
      }else{
        this.$Message.error(res.message);
      }
    },
    //添加时，删除文件
    delFile(name,type){
      switch(type){
        case "个人身份证明文件":
          this.confirmPlantBox.businessFileName.forEach((item,index) => {
            if(item==name){
              this.confirmPlantBox.businessFileName.splice(index,1);
              this.natureList.businessLicense.splice(index,1);
              this.natureList.businessLicenseUp='';
              console.log(this.natureList.businessLicense)
            }
          })
        break;
        case "单位证明文件（法人）":
          this.confirmPlantBox.businessFileName1.forEach((item,index) => {
            if(item==name){
              this.confirmPlantBox.businessFileName1.splice(index,1);
              this.legealList.businessLicense.splice(index,1);
              this.legealList.businessLicenseUp1='';
              console.log(this.legealList.businessLicense)
            }
          })
        break;
        case "法定代表人身份证明文件（法人）":
          this.confirmPlantBox.businessFileName2.forEach((item,index) => {
            if(item==name){
              this.confirmPlantBox.businessFileName2.splice(index,1);
              this.legealList.legalIdentity.splice(index,1);
              this.legealList.businessLicenseUp2='';
              console.log(this.legealList.legalIdentity)
            }
          })
        break;
        case "单位证明文件（非法人）":
          this.confirmPlantBox.businessFileName3.forEach((item,index) => {
            if(item==name){
              this.confirmPlantBox.businessFileName3.splice(index,1);
              this.notlegealList.businessLicense.splice(index,1);
              this.notlegealList.businessLicenseUp1='';
              console.log(this.notlegealList.businessLicense)
            }
          })
        break;
        case "负责人身份证明文件（非法人）":
          this.confirmPlantBox.businessFileName4.forEach((item,index) => {
            if(item==name){
              this.confirmPlantBox.businessFileName4.splice(index,1);
              this.notlegealList.legalIdentity.splice(index,1);
              this.notlegealList.businessLicenseUp2='';
              console.log(this.notlegealList.legalIdentity)
            }
          })
        break;
        case "律所函":
          this.agPlantBox.businessFileName.forEach((item,index) => {
            if(item==name){
              this.agPlantBox.businessFileName.splice(index,1);
              this.lawyerList.lawFirmLetter.splice(index,1);
              this.lawyerList.businessLicenseUp1="";
              console.log(this.lawyerList.lawFirmLetter)
            }
          })
        break;
        case "律师执业证":
          this.agPlantBox.businessFileName1.forEach((item,index) => {
            if(item==name){
              this.agPlantBox.businessFileName1.splice(index,1);
              this.lawyerList.lawerCardUrl.splice(index,1);
              this.lawyerList.businessLicenseUp2="";
              console.log(this.lawyerList.lawerCardUrl)
            }
          })
        break;
        case "委托书":
          this.agPlantBox.businessFileName2.forEach((item,index) => {
            if(item==name){
              this.agPlantBox.businessFileName2.splice(index,1);
              this.lawyerList.commission.splice(index,1);
              this.lawyerList.businessLicenseUp3="";
              console.log(this.lawyerList.commission)
            }
          })
        break;
      }
    },
    // 代理人计算出生年月和日期
    plant_autoFillId (data,name) {
      let obj =   tools_calcIdentiyInfo(data.agentIdentiCard);
      data.sex = obj.sex;
      data.birthday = obj.birth;
      return false;
      this.$refs[name].validateField('agentIdentiCard',(res)=>{
        if(res == '') {
          let obj =   tools_calcIdentiyInfo(data.agentIdentiCard);
          data.sex = obj.sex;
          data.birthday = obj.birth;
        }
      })
    },
    //代理人获取日期
    ft_plant_chgBirth (event,data) {
      let plantBirthTemp = tools_transDate(event);
      data.birthday = plantBirthTemp;
    },
    // 当事人计算出生年月和日期
    plant_autoFillId2 (data,name) {
      let obj =   tools_calcIdentiyInfo(data.identityCard);
      data.litigantSex = obj.sex;
      data.litigantBirthday = obj.birth;
      return false;
      this.$refs[name].validateField('identityCard',(res)=>{
        if(res == '') {
          let obj =   tools_calcIdentiyInfo(data.identityCard);
          data.litigantSex = obj.sex;
          data.litigantBirthday = obj.birth;
        }
      })
    },
    //当事人获取日期
    ft_plant_chgBirth2 (event,data) {
      let plantBirthTemp = tools_transDate(event);
      data.litigantBirthday = plantBirthTemp;
    },
    //清空提交数据
    ft_step1_restForm () {
      this.confirmPlantList = [];
      this.agPlantList=[];
    },
    //清空当事人表单
    clearConfirmPlantFrom(){
      this.natureList=deepClone(plantVialte.natureList);// 自然人数据
      this.legealList=deepClone(plantVialte.legealList);// 法人数据
      this.notlegealList=deepClone(plantVialte.notlegealList);// 非法人数据
      this.confirmPlantBox.businessFileName=[];//个人身份证明文件名称（自然人）
      this.confirmPlantBox.businessFileName1=[];//单位证明文件名称（法人）
      this.confirmPlantBox.businessFileName2=[];//法定代表人身份证明文件名称（法人）
      this.confirmPlantBox.businessFileName3=[];//单位证明文件名称（非法人）
      this.confirmPlantBox.businessFileName4=[];//法定代表人身份证明文件（非法人）
    },
    //清空代理人表单
    clearAgentFrom(){
      this.lawyerList=deepClone(plantVialte.lawyerList);// 代理人人数据
      this.workerList=deepClone(plantVialte.workerList);// 代理人人数据
      this.citizenList=deepClone(plantVialte.citizenList);// 代理人人数据
      this.agPlantBox.businessFileName=[];//律所函文件名称
      this.agPlantBox.businessFileName1=[];//律师执业证文件名称
      this.agPlantBox.businessFileName2=[];//委托书文件名称
    },
    //重置表单提示
    resetField(refsName){
      this.$refs [refsName].fields.forEach(function (e) {
        e.resetField()
      })
    }
  },
}
</script>
<style lang="less" scoped>
.zh-plant-upload{
   .ivu-form-item-content{
      .ivu-form-item-error-tip {
        padding-top: 10px!important;
        z-index: 999;
      }
      .ivu-input-wrapper {
          visibility: hidden;
          width: 1px;
      }
   }
}
</style>

