<style lang="less">
@import "./../common.less";
.adds {
    border:1px solid #ccc;
    cursor: pointer;
    .ivu-icon{
        font-size: 30px;
        display: block;
        margin-top: 5px;
    }
    p{
        display: inline-block;
        line-height: 11px;
    }
}
.addOtherAdress .ivu-icon{
    font-size: 18px;
    margin-left: 5px;
    cursor: pointer;
}
.vertical-center-modal{
    display: flex;
    align-items: center;
    justify-content: center;
    .ivu-modal{
        top: 0;
    }
}
</style>
<template>
<div class="litigantInfo">
    <!-- 原告信息 -->
    <div class="bookbuilding-table">
        <Row >
            <Col span="24" class="noemalTb th-header">
                {{this.title}}<span class="addRelation"  @click="add">+添加</span>
            </Col>
        </Row>
        <div class="contain">
            <Row >
                <Table size="small" stripe  :loading="loading" border :columns="Columns" :data="this.data" ref="table" sortable="custom"  ></Table>
                <div class="maininfo-col-label" style="display:inline-block;padding:10px;margin:10px;">当事人关系：</div>
                <template v-if="this.data.length>1" > 
                <!-- <template>  -->
                    <Button size='large' @click="addLitigantRelation" style="background:#2083D8;color:#fff;padding: 6px 31px;border-radius: 17px;" >添加</Button>
                </template>
                <Table :columns="columns1" :data="this.relationArr" width="100%"></Table>
            </Row>
        </div>
    </div>
    <Modal :title="this.type === 'plaintiff' ? this.litigantId != '' ? '修改原告' : '添加原告' : this.type === 'defendant' ? this.litigantId != '' ? '修改被告' : '添加被告' : this.litigantId != '' ? '修改第三人' : '添加第三人'" v-model="showAdd" width="546px" :loading="loading" ok-text="提交" @on-ok="submit" :mask-closable="false">
        <div>
            <Form :model="addFormItem" :label-width="100" inline>
                <FormItem label="类型" style="width: 245px;">
                    <Select v-model="addFormItem.litigantType" transfer placeholder="请选择" :disabled="this.litigantId != ''" @on-change="changeLitigantType">
                        <Option value="自然人">自然人</Option>
                        <Option value="法人">法人</Option>
                        <Option value="非法人组织">非法人组织</Option>
                    </Select>
                </FormItem>
                <FormItem :label="addFormItem.litigantType == '自然人'? '姓名' : '名称'" style="width: 505px;">
                    <Input v-model="addFormItem.litigantName" placeholder="请输入"></Input>
                </FormItem>
                <FormItem :label="addFormItem.litigantType == '自然人' ? '身份证号码' : '统一信用代码'"  style="width: 505px;">
                    <Input v-model="addFormItem.identityCard" @on-blur="idCardtoBirth" placeholder="请输入"></Input>
                </FormItem>
                <FormItem label="性别" v-show="addFormItem.litigantType == '自然人'"  style="width: 505px;">
                    <Select v-model="addFormItem.litigantSex" transfer placeholder="请选择">
                        <Option value="男">男</Option>
                        <Option value="女">女</Option>
                    </Select>
                </FormItem>
                <FormItem label="出生日期" style="width: 245px !important;" v-show="addFormItem.litigantType == '自然人'">
                    <DatePicker type="date" transfer :value="addFormItem.birthday" @on-change="changeDate"></DatePicker>
                </FormItem>
                
                <!-- <FormItem label="当事人关系" style="width: 245px;display:none">
                    <Select v-model="addFormItem.relationType" transfer placeholder="请选择">
                        <Option value="0">无</Option>
                        <Option value="1">夫妻</Option>
                        <Option value="2">同住成员家属</Option>
                        <Option value="3">其他</Option>
                    </Select>
                </FormItem>
                <FormItem label="当事人" style="width: 245px;display:none">
                    <Select v-model="addFormItem.relationLitigantId" transfer placeholder="请选择">
                        <Option v-for="item in this.data" :value="item.id" :key="item.litigantName">{{ item.litigantName }}</Option>
                    </Select>
                </FormItem> -->
                <FormItem label="民族" v-show="addFormItem.litigantType == '自然人'" style="width: 505px;">
                    <Select
                    v-model="addFormItem.nation"
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
                <FormItem label="手机号码" v-show="addFormItem.litigantType == '自然人'" style="width: 505px;">
                    <Input v-model="addFormItem.litigantPhone" placeholder="请输入手机号码"></Input>
                    <div style="color: #ed3f14;position:absolute;top:28px;left:5px;">多个手机号码请用逗号分隔</div>
                </FormItem>
                <FormItem v-bind:label="addFormItem.litigantType == '法人' ? '法定代表人' : '负责人'" style="width: 505px;" v-show="addFormItem.litigantType != '自然人'">
                    <Input v-model="addFormItem.legalManName" v-bind:placeholder="addFormItem.litigantType == '法人' ? '请输入法定代表人姓名' : '请输入负责人姓名'"></Input>
                </FormItem>
                <FormItem label="身份证号码" v-show="addFormItem.litigantType != '自然人'" style="width: 505px;">
                    <Input v-model="addFormItem.legalManId" v-bind:placeholder="addFormItem.litigantType == '法人' ? '请输入法定代表人身份证号码' : '请输入负责人身份证号码'"></Input>
                </FormItem>
                <FormItem label="法定代表人身份证明文件" style="width: 505px"  v-show="addFormItem.litigantType != '自然人'">
                    <span>{{legalIdentity}}</span>
                    <Upload action="/api/court/case/upScanning.jhtml" class="ft-plant-upload-button" :on-success="plant_uploadSuccess" :data="{fileType:'法定代表人身份证明文件'}">
                        <Button type="ghost" icon="ios-cloud-upload-outline">选择文件</Button>
                    </Upload>
                </FormItem>
                <FormItem label="手机号码" style="width: 505px;" v-show="addFormItem.litigantType != '自然人'">
                    <Input v-model="addFormItem.legalManPhone" v-bind:placeholder="addFormItem.litigantType == '法人' ? '请输入法定代表人手机号码' : '请输入负责人手机号码'"></Input>
                </FormItem>
                <FormItem label="电子邮箱" style="width: 505px">
                    <Input v-model="addFormItem.email" placeholder="请输入电子邮箱"></Input>
                </FormItem>
                <FormItem :label="addFormItem.litigantType == '自然人' ? '户籍地址' : '公司注册地址'" style="width: 505px">
                    <Input v-model="addFormItem.nativePlace" v-bind:placeholder="addFormItem.litigantType == '自然人' ? '请输入户籍地址' : '请输入公司注册地址'"></Input>
                </FormItem>
                <FormItem :label="addFormItem.litigantType == '自然人' ? '经常居住地址' : '公司经营地址'" style="width: 505px">
                    <Input v-model="addFormItem.address" v-bind:placeholder="addFormItem.litigantType == '自然人' ? '请输入经常居住地址' : '请输入公司经营地址'"></Input>
                </FormItem>
                <FormItem label="送达地址" style="width: 505px" v-show="addFormItem.litigantType == '自然人'">
                    <Input v-model="addFormItem.sendAddress" v-bind:placeholder="addFormItem.litigantType == '自然人' ? '请输入送达地址' : '请输入确认公司经营地址'"></Input>
                </FormItem>
                <FormItem :label="addFormItem.litigantType == '自然人' ? '个人身份证明文件' : '单位证明文件'" style="width: 505px">
                    <span>{{businessLicense}}</span>
                    <Upload action="/api/court/case/upScanning.jhtml" class="ft-plant-upload-button" :on-success="plant_uploadSuccess" :data="{fileType:addFormItem.litigantType == '自然人' ? '个人身份证明文件' : '单位证明文件'}">
                        <Button type="ghost" icon="ios-cloud-upload-outline">选择文件</Button>
                    </Upload>
                </FormItem>
                <div v-show="lawyerAdd1">
                    <FormItem label="代理人一身份" style="width: 505px;">
                        <Select v-model="addFormItem.lawerType1" transfer @on-change="changeType" placeholder="请选择">
                            <Option v-for="item in lawerType" :value="item.label">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="姓名" style="width: 505px;">
                        <Input v-model="addFormItem.lawerName1" placeholder="请输入代理人一姓名"></Input>
                    </FormItem>
                    <FormItem label="公民身份证号码" v-show="lawyerT1" style="width: 505px;">
                        <Input v-model="addFormItem.lawIdentiCard1" placeholder="请输入代理人一公民身份证号码"></Input>
                    </FormItem>
                    <FormItem label="律师职业证号" v-show="!lawyerT1" style="width: 505px;">
                        <Input v-model="addFormItem.lawerNum1" placeholder="请输入代理人一律师职业证号"></Input>
                    </FormItem>
                    <FormItem label="代理人电话号码" style="width: 505px;">
                        <Input v-model="addFormItem.lawermobile1"  placeholder="请输入代理人一电话号码"></Input>
                    </FormItem>
                    <FormItem label="代理人联系地址" style="width: 505px;">
                        <Input v-model="addFormItem.agentAddress1" placeholder="请输入代理人一联系地址"></Input>
                    </FormItem>
                    <FormItem label="代理人邮箱" style="width: 505px;">
                        <Input v-model="addFormItem.agentMail1" placeholder="请输入代理人一邮箱"></Input>
                    </FormItem>
                    <FormItem label="律所" v-show="!lawyerT1" style="width: 505px;">
                        <Input v-model="addFormItem.lawFirm1" placeholder="请输入律所"></Input>
                    </FormItem>
                    <FormItem label="律所函" v-show="!lawyerT1" style="width: 505px;">
                        <span>{{lawFirmLetter1}}</span>
                        <Upload action="/api/court/case/upScanning.jhtml" class="ft-plant-upload-button" :on-success="plant_uploadSuccess" :data="{fileType:'代理人一律所函'}">
                            <Button type="ghost" icon="ios-cloud-upload-outline">选择文件</Button>
                        </Upload>
                    </FormItem>
                    <FormItem label="律师执业证" v-show="!lawyerT1" style="width: 505px;">
                        <span>{{lawerCardUrl1}}</span>
                        <Upload action="/api/court/case/upScanning.jhtml" class="ft-plant-upload-button" :on-success="plant_uploadSuccess" :data="{fileType:'代理人一律师执业证'}">
                            <Button type="ghost" icon="ios-cloud-upload-outline">选择文件</Button>
                        </Upload>
                    </FormItem>
                    <FormItem label="委托书" v-show="!lawyerT1" style="width: 505px;">
                        <span>{{commission1}}</span>
                        <Upload action="/api/court/case/upScanning.jhtml" class="ft-plant-upload-button" :on-success="plant_uploadSuccess" :data="{fileType:'代理人一委托书'}">
                            <Button type="ghost" icon="ios-cloud-upload-outline">选择文件</Button>
                        </Upload>
                    </FormItem>
                </div>
                <div v-show="lawyerAdd2">
                    <FormItem label="代理人二身份" style="width: 505px;">
                        <Select v-model="addFormItem.lawerType2" transfer @on-change="changeType1" placeholder="请选择">
                            <Option v-for="item in lawerType" :value="item.label">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="姓名" style="width: 505px;">
                        <Input v-model="addFormItem.lawerName2" placeholder="请输入代理人二姓名"></Input>
                    </FormItem>
                    <FormItem label="公民身份证号码" v-show="lawyerT2" style="width: 505px;">
                        <Input v-model="addFormItem.lawIdentiCard2" placeholder="请输入代理人二公民身份证号码"></Input>
                    </FormItem>
                    <FormItem label="律师职业证号" v-show="!lawyerT2" style="width: 505px;">
                        <Input v-model="addFormItem.lawerNum2" placeholder="请输入代理人二律师职业证号"></Input>
                    </FormItem>
                    <FormItem label="代理人电话号码" style="width: 505px;">
                        <Input v-model="addFormItem.lawermobile2"  placeholder="请输入代理人二电话号码"></Input>
                    </FormItem>
                    <FormItem label="代理人联系地址" style="width: 505px;">
                        <Input v-model="addFormItem.agentAddress2" placeholder="请输入代理人二联系地址"></Input>
                    </FormItem>
                    <FormItem label="代理人邮箱" style="width: 505px;">
                        <Input v-model="addFormItem.agentMail2" placeholder="请输入代理人二邮箱"></Input>
                    </FormItem>
                    <FormItem label="律所" v-show="!lawyerT2" style="width: 505px;">
                        <Input v-model="addFormItem.lawFirm2" placeholder="请输入律所"></Input>
                    </FormItem>
                    <FormItem label="律所函" v-show="!lawyerT2" style="width: 505px;">
                        <span>{{lawFirmLetter2}}</span>
                        <Upload action="/api/court/case/upScanning.jhtml" class="ft-plant-upload-button" :on-success="plant_uploadSuccess" :data="{fileType:'代理人二律所函'}">
                            <Button type="ghost" icon="ios-cloud-upload-outline">选择文件</Button>
                        </Upload>
                    </FormItem>
                    <FormItem label="律师执业证" v-show="!lawyerT2" style="width: 505px;">
                        <span>{{lawerCardUrl2}}</span>
                        <Upload action="/api/court/case/upScanning.jhtml" class="ft-plant-upload-button" :on-success="plant_uploadSuccess" :data="{fileType:'代理人二律师执业证'}">
                            <Button type="ghost" icon="ios-cloud-upload-outline">选择文件</Button>
                        </Upload>
                    </FormItem>
                    <FormItem label="委托书" v-show="!lawyerT2" style="width: 505px;">
                        <span>{{commission2}}</span>
                        <Upload action="/api/court/case/upScanning.jhtml" class="ft-plant-upload-button" :on-success="plant_uploadSuccess" :data="{fileType:'代理人二委托书'}">
                            <Button type="ghost" icon="ios-cloud-upload-outline">选择文件</Button>
                        </Upload>
                    </FormItem>
                </div>
                <div v-show="!lawyerAdd2" class="adds"  @click="addShowLawyer" style="text-align:center">
                    <Icon type="plus-round"></Icon>
                    <p>添加代理人</p>
                </div>
            </Form>
        </div>
    </Modal>
    <Modal v-model="deleteModal" width="360" class-name="vertical-center-modal">
        <p slot="header" style="color:#f60;text-align:center">
            <Icon type="information-circled"></Icon>
            <span>确认删除？</span>
        </p>
        <div style="text-align:center">
            <p>您将删除“{{ deleteName }}”</p>
            <p>是否继续删除?</p>
        </div>
        <div slot="footer">
            <Button type="error" size="large" long @click="deleteLitigant">删除</Button>
        </div>
    </Modal>
    <!-- 当事人关系 -->
    <Modal v-model="addmodel" :title="this.type === 'plaintiff' ? this.litigantrelationId != '' ? '修改原告关系' : '添加原告关系' : this.type === 'defendant' ? this.litigantrelationId != '' ? '修改被告关系' : '添加被告关系' : this.litigantrelationId != '' ? '修改第三人关系' : '添加第三人关系'"  width="400px" :loading="loading" ok-text="提交" @on-ok="submitRelation" :mask-closable="false" class-name="vertical-center-modal">
        <Form :model="addLitigantRelationFormItem" :label-width="100" inline>
                <FormItem label="当事人关系" style="width: 245px;">
                <Select v-model="addLitigantRelationFormItem.relationshipType" transfer placeholder="请选择">
                    <Option v-for="item in relationType" :value="item.label">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem label=" 当事人：" v-if="!this.litigantrelationId">
                <CheckboxGroup size="large" @on-change="checkLitigantName" v-model="addLitigantRelationFormItem.litigantIdArr">
                    <Row>
                        <Col  v-for="(d, key) in data" :key="key" >
                            <Checkbox :label="d.id" >{{d.litigantName}}</Checkbox>      
                        </Col>
                    </Row>
                </CheckboxGroup>
            </FormItem>
        </Form>
    </Modal>
    <!-- 删除当事人关系 -->
    <Modal v-model="deleteRelationModal" width="360" class-name="vertical-center-modal">
        <p slot="header" style="color:#f60;text-align:center">
            <Icon type="information-circled"></Icon>
            <span>确认删除？</span>
        </p>
        <div style="text-align:center">
            <!-- <p>您将删除“{{ deleteName }}”</p> -->
            <p>是否继续删除?</p>
        </div>
        <div slot="footer">
            <Button type="error" size="large" long @click="deleteRelation">删除</Button>
        </div>
    </Modal>
</div>
</template>
<script>
import { formatDate } from '@/libs/date'
import nation from "@/api/nations.js";
import {
    addLitigant,
    delLitigant,
    addRelationship,
    editRelationship,
    delRelationship,
    onlyLitigantQuery,
    editLitigant,
} from "@/api/handleInfo";
export default {
    data(){
        return{
            caseInfo:{},
            showNum:0,
            nationAry:nation,//民族列表
            loading:false,
            relation:[],
            columns1:[
                {
                    title: '关系',
                    key: 'relation',
                    width: '',
                    align: 'center'
                },
                 {
                    title: '当事人',
                    key: 'litigant',
                    width: '',
                    align: 'center'
                },
                {
                    title: '操作',
                    width: '',
                    key: 'cz',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h(
                                'Button',
                                {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            console.log(params.row)
                                            this.litigantrelationId = params.row.relationId;
                                            this.addmodel = true;
                                            this.addLitigantRelationFormItem.relationshipType = params.row.relation;
                                        }
                                    }
                                },
                                '修改'
                            ),
                            h(
                                'Button',
                                {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                                this.deleteRelationModal = true;
                                                this.deleteRelationId = params.row.relationId;
                                                // this.litigantrelationId='';
                                            // }
                                        }
                                    }
                                },
                                '删除'
                            )
                        ]);
                    }
                 }
            ],
            Columns:[
                {
                    title: "姓名名称",
                    key: "litigantName",
                    width: 150,
                    align:"center"
                },
                {
                    title: "证件号",
                    key: "identityCard",
                    width: 200,
                    align:"center"
                },
                {
                    title: "手机号码/法人手机",
                    key: "phone",
                    width: 170,
                    align:"center"
                },
                {
                    title: "户籍地址/注册地址",
                    key: "registerAddress",
                    align:"center"
                },
                {
                    title: "代理人",
                    key: "name",
                    width: 150,
                    align:"center",
                    render: (h, params) => {
                        return h(
                            'div',
                            {},
                            params.row.lawyer ? params.row.lawyer.map(item => {
                                return h('p', {}, item.agentName);
                            }) : "无"
                        );
                    }
                },
                {
                    title: "代理人手机",
                    key: "name",
                    width: 150,
                    align:"center",
                    render: (h, params) => {
                        return h(
                            'div',
                            {},
                            params.row.lawyer ? params.row.lawyer.map(item => {
                                return h('p', {}, item.agentMobile);
                            }) : "无"
                        );
                    }
                },
                {
                    title: "操作",
                    key: "cz",
                    width: 150,
                    fixed:'right',
                    align:"center",
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                            props: {
                                type: 'text',
                                size: 'small'
                            },
                            on:{
                                click: () => {
                                    this.lawyerAdd1 = false;
                                    this.lawyerAdd2 = false;
                                    this.lawyerId1 = '';
                                    this.lawyerId2 = '';
                                    this.addFormItem.lawerType1 = '';
                                    this.addFormItem.lawerName1 = '';
                                    this.addFormItem.lawIdentiCard1 = '';
                                    this.addFormItem.lawerNum1 = '';
                                    this.addFormItem.lawermobile1 = '';
                                    this.addFormItem.agentAddress1 = '';
                                    this.addFormItem.agentMail1 = '';
                                    this.addFormItem.lawFirm1 = '';
                                    this.addFormItem.lawFirmLetter1 = '';
                                    this.addFormItem.lawerCardUrl1 = '';
                                    this.addFormItem.commission1 = '';
                                    this.addFormItem.lawerType2 = '';
                                    this.addFormItem.lawerName2 = '';
                                    this.addFormItem.lawIdentiCard2 = '';
                                    this.addFormItem.lawerNum2 = '';
                                    this.addFormItem.lawermobile2 = '';
                                    this.addFormItem.agentAddress2 = '';
                                    this.addFormItem.agentMail2 = '';
                                    this.addFormItem.lawFirm2 = '';
                                    this.addFormItem.lawFirmLetter2 = '';
                                    this.addFormItem.lawerCardUrl2 = '';
                                    this.addFormItem.commission2 = '';
                                    this.showAdd = true;
                                    this.litigantId = params.row.id;
                                    onlyLitigantQuery(this.litigantId).then(res => {
                                        let data = res.data.data;
                                        if(res.data.state==100){
                                            this.showAdd = true;
                                            this.legalIdentity='';//法定代表人身份证明文件
                                            this.businessLicense='';//个人身份证明文件    单位证明文件
                                            this.lawFirmLetter1='';//律所函
                                            this.lawerCardUrl1='';//律师执业证
                                            this.commission1='';//委托书
                                            this.lawFirmLetter2='';//律所函
                                            this.lawerCardUrl2='';//律师执业证
                                            this.commission2='';//委托书
                                            this.addFormItem.litigantType = data.litigantType;
                                            this.addFormItem.litigantName = data.litigantName;
                                            this.addFormItem.identityCard = data.identityCard;
                                            this.addFormItem.litigantSex = data.litigantSex;
                                            this.addFormItem.birthday = data.birthday && formatDate(new Date(data.birthday), 'yyyy-MM-dd');
                                            this.addFormItem.nation = data.nation;
                                            this.addFormItem.litigantPhone = data.phone;
                                            this.addFormItem.legalManName = data.legalManName;
                                            this.addFormItem.legalManId = data.legalManIdCard;
                                            this.addFormItem.legalIdentity = '';
                                            this.addFormItem.legalManPhone = data.legalManPhone;
                                            this.addFormItem.email = data.email;
                                            this.addFormItem.nativePlace = data.litigantPermanentAddress;
                                            this.addFormItem.address = data.litigantType == '自然人' ? data.OftenAddress : data.registerAddress;
                                            this.addFormItem.sendAddress = data.serviceAddres;
                                            this.addFormItem.businessLicense = '';//单位文件证明
                                            let lawyer = data.lawyer;
                                            lawyer.map((item, idx) => {
                                                if(idx === 0){
                                                    this.lawyerAdd1 = true;
                                                    this.addFormItem.lawerType1 = item.agentType;
                                                    this.addFormItem.lawerName1 = item.agentName;
                                                    this.addFormItem.lawIdentiCard1 = item.agentIdentiCard;
                                                    this.addFormItem.lawerNum1 = item.lawerNum;
                                                    this.addFormItem.lawermobile1 = item.agentMobile;
                                                    this.addFormItem.agentAddress1 = item.agentAddress;
                                                    this.addFormItem.agentMail1 = item.agentEmail;
                                                    this.addFormItem.lawFirm1 = item.lawFirm;
                                                    this.addFormItem.lawFirmLetter1 = '';
                                                    this.addFormItem.lawerCardUrl1 = '';
                                                    this.addFormItem.commission1 = '';
                                                    this.lawyerId1 = item.id;
                                                }else if(idx === 1){
                                                    this.lawyerAdd2 = true;
                                                    this.addFormItem.lawerType2 = item.agentType;
                                                    this.addFormItem.lawerName2 = item.agentName;
                                                    this.addFormItem.lawIdentiCard2 = item.agentIdentiCard;
                                                    this.addFormItem.lawerNum2 = item.lawerNum;
                                                    this.addFormItem.lawermobile2 = item.agentMobile;
                                                    this.addFormItem.agentAddress2 = item.agentAddress;
                                                    this.addFormItem.agentMail2 = item.agentEmail;
                                                    this.addFormItem.lawFirm2 = item.lawFirm;
                                                    this.addFormItem.lawFirmLetter2 = '';
                                                    this.addFormItem.lawerCardUrl2 = '';
                                                    this.addFormItem.commission2 = '';
                                                    this.lawyerId2 = item.id;
                                                }
                                            })
                                        }else{
                                            this.$Notice.warning({
                                                title: '',
                                                desc: res.data.message,
                                                duration: 5
                                            });
                                        }
                                    })
                                    // this.addFormItem.litigantName = res.data.result.litigantName;
                                }
                                }
                            }, '编辑'),
                            h(
                                'Button',
                                {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.deleteModal = true;
                                            this.deleteName = params.row.litigantName;
                                            this.deleteId = params.row.id;
                                        }
                                    }
                                },
                                '删除'
                            )
                        ])
                    }
                },
            ],
            formItem: {
                input: '',
                select: '',
                radio: 'male',
                checkbox: [],
                switch: true,
                date: '',
                time: '',
                slider: [20, 50],
                textarea: ''
            },
            addFormItem: {
                litigantType : '自然人',
                litigantName : '',
                identityCard : '',
                litigantSex : '',
                birthday : '',
                nation : '',
                litigantPhone : '',
                legalManName : '',
                legalManId : '',
                legalIdentity : '',
                legalManPhone : '',
                email : '',
                nativePlace : '',
                address : '',
                sendAddress : '',
                businessLicense : '',
                lawerType1 : '',
                lawerName1 : '',
                lawIdentiCard1 : '',
                lawerNum1 : '',
                lawermobile1 : '',
                agentAddress1 : '',
                agentMail1 : '',
                lawFirm1 : '',
                lawFirmLetter1 : '',
                lawerCardUrl1 : '',
                commission1 : '',
                lawerType2 : '',
                lawerName2 : '',
                lawIdentiCard2 : '',
                lawerNum2 : '',
                lawermobile2 : '',
                agentAddress2 : '',
                agentMail2 : '',
                lawFirm2 : '',
                lawFirmLetter2 : '',
                lawerCardUrl2 : '',
                commission2 : '',
            },
            adressList: [],
            deleteModal: false,
            deleteName: '',
            deleteId: '',
            showAdd: false,
            litigantId: '',
            lawyerT1: true,
            lawyerT2: true,
            lawyerAdd1:false,
            lawyerAdd2:false,
            lawerType: [
                {
                    value: 1,
                    label: '律师'
                },
                {
                    value: 2,
                    label: '法律工作者'
                },
                {
                    value: 3,
                    label: '单位工作人员'
                },
                {
                    value: 4,
                    label: '近亲属'
                },
                {
                    value: 5,
                    label: '公民'
                }
            ],
            adressList:[],
            acType: '',
            legalIdentity:'',//法定代表人身份证明文件
        	businessLicense:'',//个人身份证明文件    单位证明文件
            lawFirmLetter1:'',//律所函
            lawerCardUrl1:'',//律师执业证
            commission1:'',//委托书
            lawFirmLetter2:'',//律所函
            lawerCardUrl2:'',//律师执业证
            commission2:'',//委托书
            addmodel: false,
            litigantrelationId:'',
            addLitigantRelationFormItem:{
                litigantIdArr: [],
                relationshipType: '',
            },
            relationType:[
                {
                    value:1,
                    label:'夫妻',
                    
                },
                {
                    value:2,
                    label:'同住成员家属'
                },
                {
                    value:3,
                    label:'其他'
                }
            ],
            deleteRelationModal:false,
            deleteRelationId: '',
            lawyerId1: '',
            lawyerId2: '',
        }
    },
    props: {
        title: String,
        data: Array,
        // changeCaseInfo: Boolean,
        caseLoading: Boolean,
        type: String,
        relationArr: Array,
    },
    methods:{
        add () {
            this.showAdd = true;
            this.litigantId = '';
            this.lawyerAdd1 = false;
            this.lawyerAdd2 = false;
            this.adressList = [];
            this.acType = '添加';
            this.legalIdentity='';//法定代表人身份证明文件
            this.businessLicense='';//个人身份证明文件    单位证明文件
            this.lawFirmLetter1='';//律所函
            this.lawerCardUrl1='';//律师执业证
            this.commission1='';//委托书
            this.lawFirmLetter2='';//律所函
            this.lawerCardUrl2='';//律师执业证
            this.commission2='';//委托书
            // this.addFormItem = {};
            this.addFormItem.litigantType = '自然人';
            this.addFormItem.litigantName = '';
            this.addFormItem.identityCard = '';
            this.addFormItem.litigantSex = '';
            this.addFormItem.birthday = '';
            this.addFormItem.nation = '';
            this.addFormItem.litigantPhone = '';
            this.addFormItem.legalManName = '';
            this.addFormItem.legalManId = '';
            this.addFormItem.legalIdentity = '';
            this.addFormItem.legalManPhone = '';
            this.addFormItem.email = '';
            this.addFormItem.nativePlace = '';
            this.addFormItem.address = '';
            this.addFormItem.sendAddress = '';
            this.addFormItem.businessLicense = '';
            this.addFormItem.lawerType1 = '';
            this.addFormItem.lawerName1 = '';
            this.addFormItem.lawIdentiCard1 = '';
            this.addFormItem.lawerNum1 = '';
            this.addFormItem.lawermobile1 = '';
            this.addFormItem.agentAddress1 = '';
            this.addFormItem.agentMail1 = '';
            this.addFormItem.lawFirm1 = '';
            this.addFormItem.lawFirmLetter1 = '';
            this.addFormItem.lawerCardUrl1 = '';
            this.addFormItem.commission1 = '';
            this.addFormItem.lawerType2 = '';
            this.addFormItem.lawerName2 = '';
            this.addFormItem.lawIdentiCard2 = '';
            this.addFormItem.lawerNum2 = '';
            this.addFormItem.lawermobile2 = '';
            this.addFormItem.agentAddress2 = '';
            this.addFormItem.agentMail2 = '';
            this.addFormItem.lawFirm2 = '';
            this.addFormItem.lawFirmLetter2 = '';
            this.addFormItem.lawerCardUrl2 = '';
            this.addFormItem.commission2 = '';
        },
        //上传文件
        plant_uploadSuccess (res) {
            if(res.state === 100) {
                this.$Message.success(res.message);
                switch (res.data.fileType) {
                    case "个人身份证明文件":
                        this.addFormItem.businessLicense = res.data.filePath;
                        this.businessLicense = res.data.fileName;
                        break;
                    case "单位证明文件":
                        this.addFormItem.businessLicense = res.data.filePath;
                        this.businessLicense = res.data.fileName;
                        break;
                    case "法定代表人身份证明文件":
                        this.addFormItem.legalIdentity = res.data.filePath;
                        this.legalIdentity = res.data.fileName;
                        break;
                    case "代理人一律所函":
                        this.addFormItem.lawFirmLetter1 = res.data.filePath;
                        this.lawFirmLetter1 = res.data.fileName;
                        break;
                    case "代理人二律所函":
                        this.addFormItem.lawFirmLetter2 = res.data.filePath;
                        this.lawFirmLetter2 = res.data.fileName;
                        break;
                    case "代理人一律师执业证":
                        this.addFormItem.lawerCardUrl1 = res.data.filePath;
                        this.lawerCardUrl1 = res.data.fileName;
                        break;
                    case "代理人二律师执业证":
                        this.addFormItem.lawerCardUrl2 = res.data.filePath;
                        this.lawerCardUrl2 = res.data.fileName;
                        break;
                    case "代理人一委托书":
                        this.addFormItem.commission1 = res.data.filePath;
                        this.commission1 = res.data.fileName;
                        break;
                    case "代理人二委托书":
                        this.addFormItem.commission2= res.data.filePath;
                        this.commission2 = res.data.fileName;
                        break;
                    default:
                        break;
                }
            }else{
                this.$Message.error(res.message);
            }
        },
        // 类型切换事件
        changeLitigantType(){
            if(this.litigantId == ''){
                this.legalIdentity='';//法定代表人身份证明文件
                this.businessLicense='';//个人身份证明文件    单位证明文件
                this.lawFirmLetter1='';//律所函
                this.lawerCardUrl1='';//律师执业证
                this.commission1='';//委托书
                this.lawFirmLetter2='';//律所函
                this.lawerCardUrl2='';//律师执业证
                this.commission2='';//委托书
                this.addFormItem.litigantName = '';
                this.addFormItem.identityCard = '';
                this.addFormItem.litigantSex = '';
                this.addFormItem.birthday = '';
                this.addFormItem.nation = '';
                this.addFormItem.litigantPhone = '';
                this.addFormItem.legalManName = '';
                this.addFormItem.legalManId = '';
                this.addFormItem.legalIdentity = '';
                this.addFormItem.legalManPhone = '';
                this.addFormItem.email = '';
                this.addFormItem.nativePlace = '';
                this.addFormItem.address = '';
                this.addFormItem.sendAddress = '';
                this.addFormItem.businessLicense = '';
                this.addFormItem.lawerType1 = '';
                this.addFormItem.lawerName1 = '';
                this.addFormItem.lawIdentiCard1 = '';
                this.addFormItem.lawerNum1 = '';
                this.addFormItem.lawermobile1 = '';
                this.addFormItem.agentAddress1 = '';
                this.addFormItem.agentMail1 = '';
                this.addFormItem.lawFirm1 = '';
                this.addFormItem.lawFirmLetter1 = '';
                this.addFormItem.lawerCardUrl1 = '';
                this.addFormItem.commission1 = '';
                this.addFormItem.lawerType2 = '';
                this.addFormItem.lawerName2 = '';
                this.addFormItem.lawIdentiCard2 = '';
                this.addFormItem.lawerNum2 = '';
                this.addFormItem.lawermobile2 = '';
                this.addFormItem.agentAddress2 = '';
                this.addFormItem.agentMail2 = '';
                this.addFormItem.lawFirm2 = '';
                this.addFormItem.lawFirmLetter2 = '';
                this.addFormItem.lawerCardUrl2 = '';
                this.addFormItem.commission2 = '';
            }
        },
        addShowLawyer(){
            if(this.lawyerAdd1 == false){
                this.lawyerAdd1 = true;
            }else if(this.lawyerAdd1 == true && this.lawyerAdd2 == false){
                this.lawyerAdd2 = true;
            }
        },
        // 添加当事人关系
        addLitigantRelation(){
           this.addmodel = true;
           this.addLitigantRelationFormItem.litigantIdArr = [];
           this.addLitigantRelationFormItem.relationshipType='';
           this.litigantrelationId='';
           
        //   this.litigantIdArr=[];
        },
        submitRelation(){
            var litigationStatus;
            if (this.type == 'plaintiff') {
                litigationStatus = '原告';
            } else if (this.type == 'defendant') {
                litigationStatus = '被告';
            } else {
                litigationStatus = '第三人';
            }
            if(this.litigantrelationId!=''){//编辑
                let params = {
                    relationshipId : this.litigantrelationId,
                    relationshipType : this.addLitigantRelationFormItem.relationshipType,
                }
                editRelationship(params).then(res => {
                    if(res.data.state==100){
                        this.$Notice.success({
                            title: '',
                            desc: res.data.message,
                            duration: 3
                        });
                        this.addmodel = false;
                        this.$emit('refreshList');
                    }else{
                        this.$Notice.warning({
                            title: '',
                            desc: res.data.message,
                            duration: 5
                        });
                    }
                })
            }else{
                let litigantIdArr = [];
                this.addLitigantRelationFormItem.litigantIdArr.map(item => {
                    litigantIdArr.push(item.toString())
                })
                if(!this.addLitigantRelationFormItem.relationshipType){
                    this.$Notice.warning({
                        title: '',
                        desc: '请选择关系',
                        duration: 5
                    });
                    return false;
                }
                if(litigantIdArr.length <2){
                    this.$Notice.warning({
                        title: '',
                        desc: '至少要选择二个关系',
                        duration: 5
                    });
                    return false;
                }
                const params = {
                    litigantId: litigantIdArr,
                    relationshipType: this.addLitigantRelationFormItem.relationshipType,
                }

                addRelationship(params).then(res => {
                    if(res.data.state==100){
                        this.$Notice.success({
                            title: '',
                            desc: res.data.message,
                            duration: 3
                        });
                        this.addmodel = false;
                        this.$emit('refreshList');
                    }else{
                        this.$Notice.warning({
                            title: '',
                            desc: res.data.message,
                            duration: 5
                        });
                    }
                })
            }
        },
        checkLitigantName(value){
            // this.litigantIdArr = [];
            // this.litigantIdArr=value
            // this.addLitigantRelationFormItem.litigantId = litigantIdArr;
            // dipChecked
            console.log('value',value)
        },
        // 删除当事人
        deleteRelation () {
            delRelationship(this.deleteRelationId).then(res => {
                if (res.data.state === 100) {
                    this.$Notice.success({
                        title: '',
                        desc: res.data.message,
                        duration: 3
                    });
                    this.deleteRelationModal = false;
                    this.$emit('refreshList');
                } else {
                    this.$Notice.warning({
                        title: '',
                        desc: res.data.message,
                        duration: 5
                    });
                    this.deleteRelationModal = false;
                }
            });
        },
        submit () {
            var litigaStatus;
            if (this.type == 'plaintiff') {
                litigaStatus = '原告';
            } else if (this.type == 'defendant') {
                litigaStatus = '被告';
            } else {
                litigaStatus = '第三人';
            }
            var birthday = this.addFormItem.birthday;
            if (birthday == 'NaN-aN-aN' || birthday == 'NaN') {
                birthday = '';
            }else{
                birthday = new Date(birthday).getTime().toString()
            }
            
            if(this.litigantId != ''){
                let editLayers =[];
                let editLayers1 = {
                    agentType : this.addFormItem.lawerType1,
                    agentName : this.addFormItem.lawerName1,
                    lawIdentiCard : this.addFormItem.lawIdentiCard1,
                    lawerNum : this.addFormItem.lawerNum1,
                    agentMobile : this.addFormItem.lawermobile1,
                    agentAddress : this.addFormItem.agentAddress1,
                    agentMail : this.addFormItem.agentMail1,
                    lawFirm : this.addFormItem.lawFirm1,
                    lawFirmLetter : this.addFormItem.lawFirmLetter1,
                    lawerCardUrl : this.addFormItem.lawerCardUrl1,
                    commission :this.addFormItem.commission1,
                    lawyerId : (this.lawyerId1).toString(),
                };
                let editLayers2 = {
                    agentType : this.addFormItem.lawerType2,
                    agentName : this.addFormItem.lawerName2,
                    lawIdentiCard : this.addFormItem.lawIdentiCard2,
                    lawerNum : this.addFormItem.lawerNum2,
                    agentMobile : this.addFormItem.lawermobile2,
                    agentAddress : this.addFormItem.agentAddress2,
                    agentMail : this.addFormItem.agentMail2,
                    lawFirm : this.addFormItem.lawFirm2,
                    lawFirmLetter : this.addFormItem.lawFirmLetter2,
                    lawerCardUrl : this.addFormItem.lawerCardUrl2,
                    commission :this.addFormItem.commission2,
                    lawyerId : (this.lawyerId2).toString(),
                };
                if(this.addFormItem.lawerType1 && this.addFormItem.lawerName1 && this.addFormItem.lawermobile1){
                    editLayers.push(editLayers1);
                }
                if(this.addFormItem.lawerType2 && this.addFormItem.lawerName2 && this.addFormItem.lawermobile2){
                    editLayers.push(editLayers2);
                }
                let data = {
                    litigantType: this.addFormItem.litigantType,
                    name: this.addFormItem.litigantName,
                    identityCard: this.addFormItem.identityCard,
                    address: this.addFormItem.address,
                    businessLicense: this.addFormItem.businessLicense,
                    phone: this.addFormItem.litigantPhone,
                    email: this.addFormItem.email,
                    legalManName: this.addFormItem.legalManName,
                    legalManPhone: this.addFormItem.legalManPhone,
                    legalManId: this.addFormItem.legalManId,
                    legalIdentity: this.addFormItem.legalIdentity,
                    litigantBirthday: birthday,
                    litigantSex: this.addFormItem.litigantSex,
                    litigantNation: this.addFormItem.nation,
                    litigantPermanentAddress: this.addFormItem.nativePlace,
                    serviceAddress: this.addFormItem.sendAddress,
                    layers: editLayers,
                    litigantStatus: litigaStatus,
                    litigantId: (this.litigantId).toString(),
                    remark: '2',
                }
                editLitigant(data).then(res => {
                    if(res.data.state == 100){
                        this.$Notice.success({
                            title: '',
                            desc: res.data.message,
                            duration: 5
                        });
                        this.$emit('refreshList')
                    }else{
                        this.$Notice.warning({
                            title: '',
                            desc: res.data.message,
                            duration: 5
                        });
                    }
                })
            }else{
                let layers =[];
                let layers1 = {
                    agentType : this.addFormItem.lawerType1,
                    agentName : this.addFormItem.lawerName1,
                    lawIdentiCard : this.addFormItem.lawIdentiCard1,
                    lawerNum : this.addFormItem.lawerNum1,
                    agentMobile : this.addFormItem.lawermobile1,
                    agentAddress : this.addFormItem.agentAddress1,
                    agentMail : this.addFormItem.agentMail1,
                    lawFirm : this.addFormItem.lawFirm1,
                    lawFirmLetter : this.addFormItem.lawFirmLetter1,
                    lawerCardUrl : this.addFormItem.lawerCardUrl1,
                    commission :this.addFormItem.commission1,
                };
                let layers2 = {
                    agentType : this.addFormItem.lawerType2,
                    agentName : this.addFormItem.lawerName2,
                    lawIdentiCard : this.addFormItem.lawIdentiCard2,
                    lawerNum : this.addFormItem.lawerNum2,
                    agentMobile : this.addFormItem.lawermobile2,
                    agentAddress : this.addFormItem.agentAddress2,
                    agentMail : this.addFormItem.agentMail2,
                    lawFirm : this.addFormItem.lawFirm2,
                    lawFirmLetter : this.addFormItem.lawFirmLetter2,
                    lawerCardUrl : this.addFormItem.lawerCardUrl2,
                    commission :this.addFormItem.commission2,
                };
                if(this.addFormItem.lawerType1 && this.addFormItem.lawerName1 && this.addFormItem.lawermobile1){
                    layers.push(layers1);
                }
                if(this.addFormItem.lawerType2 && this.addFormItem.lawerName2 && this.addFormItem.lawermobile2){
                    layers.push(layers2);
                }
                let data = {
                    litigantList: {
                        litigantType: this.addFormItem.litigantType,
                        name: this.addFormItem.litigantName,
                        identityCard: this.addFormItem.identityCard,
                        address: this.addFormItem.address,
                        businessLicense: this.addFormItem.businessLicense,
                        phone: this.addFormItem.litigantPhone,
                        email: this.addFormItem.email,
                        legalManName: this.addFormItem.legalManName,
                        legalManPhone: this.addFormItem.legalManPhone,
                        legalManId: this.addFormItem.legalManId,
                        legalIdentity: this.addFormItem.legalIdentity,
                        litigantBirthday: birthday,
                        litigantSex: this.addFormItem.litigantSex,
                        litigantNation: this.addFormItem.nation,
                        litigantPermanentAddress: this.addFormItem.nativePlace,
                        serviceAddress: this.addFormItem.sendAddress,
                        layers: layers
                    },
                    litigantStatus: litigaStatus,
                    lawCaseId: (this.$store.getters.caseId).toString(),
                    remark: '2',
                }
                addLitigant(data).then(res => {
                    if(res.data.state == 100){
                        this.$Notice.success({
                            title: '',
                            desc: res.data.message,
                            duration: 3
                        });
                        this.$emit('refreshList')
                    }else{
                        this.$Notice.warning({
                            title: '',
                            desc: res.data.message,
                            duration: 5
                        });
                    }
                })
            }
        },
        // 删除
        deleteLitigant () {
            let id = (this.deleteId).toString()
            delLitigant(this.deleteId).then(res => {
                if (res.data.state === 100) {
                    // this.$Message.success(res.data.message);
                    this.$Notice.success({
                        title: '',
                        desc: res.data.message,
                        duration: 3
                    });
                    this.deleteModal = false;
                    this.$emit('refreshList');
                } else {
                    // this.$Message.err(res.data.message);
                    this.$Notice.warning({
                        title: '',
                        desc: res.data.message,
                        duration: 5
                    });
                    this.deleteModal = false;
                }
            });
        },
        trimK(s){
            return s ? s.replace(/(^\s*)|(\s*$)/g, "") : '' ;
        },
        idCardtoBirth () {
            let reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/;
            let ster = this.trimK(this.addFormItem.identityCard);
            if (reg.test(ster)) {
                this.addFormItem.birthday =
                    this.trimK(this.addFormItem.identityCard).substring(6, 10) +
                    '-' +
                    this.trimK(this.addFormItem.identityCard).substring(10, 12) +
                    '-' +
                    this.trimK(this.addFormItem.identityCard).substring(12, 14);
            }
            let str = this.addFormItem.identityCard.substr(this.addFormItem.identityCard.length-2, 1);
            if(str == 1 || str == 3 || str == 5 || str == 7 || str == 9){
                this.addFormItem.litigantSex = '男';
            }else{
                this.addFormItem.litigantSex = '女';
            }
        },
        changeLoading () {
            this.loading = false;
            this.$nextTick(() => {
                this.loading = true;
            });
        },
        changeDate (date) {
            console.log(date)
            if(date != ''){
                this.addFormItem.birthday = new Date(date).getTime();
            }else{
                this.addFormItem.birthday = '';
            }
            
            console.log(this.addFormItem.birthday)
        },
        changeType (e) {
            if (e == '法律工作者' || e == '律师') {
                this.lawyerT1 = false;
            } else {
                this.lawyerT1 = true;
            }
        },
        changeType1 (e) {
            if (e == '法律工作者' || e == '律师') {
                this.lawyerT2 = false;
            } else {
                this.lawyerT2 = true;
            }
        },
    },
    filters: {
      formatDate(time) {
          if (time == '') {
              return '';
          }
          var date = new Date(time);
          return formatDate(date, 'yyyy-MM-dd');
      },
      whether(boole) {
          return boole ? '是' : '否';
      },
      filCheck(boole) {
          return boole == 0 ? '未确认' : '已确认';
      },
      formatStartDate(time) {
          if (time == '') {
              return '';
          }
          var date = new Date(time);
          return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
  }

}
</script>

