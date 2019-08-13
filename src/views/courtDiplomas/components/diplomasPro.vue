<style lang="less">
@import "./../courtDiplomas.less";
</style>
<template>
    <div class="diplomasProInfo" style="position:relative">
        <!-- 文书列表  -->
        <Spin size="large" fix v-show="isLoading"></Spin>
        <div class="bookbuilding-table">
            <Row >
                <Col span="24" class="noemalTb th-header">
                    <span>自动生成文书列表</span>
                    <span style="float:right">
                        <Checkbox @on-change="ckeckAllLiti" v-model="allCkeckLiti">全选/取消全选</Checkbox>
                    </span>
                </Col>
            </Row>
            <div class="contain">
                <Row >
                    <Col span="2" push='1'>
                        <span>适用对象</span>
                    </Col>
                    <Col span="21" push='1'>
                        <Select v-model="selLitigant" clearable filterable placeholder="请选择"  @on-change="selLiti" style="width:305px">
                            <Option v-for="(item) in litigantList" :value="item.id">{{item.litigantName + '(' +item.litigationStatus.litigantStatusName + ')'}}</Option>
                        </Select>
                    </Col>
                </Row>
                <Row style="margin-top:20px">
                    <Col span="2" push='1'>
                        <span>文书选择</span>
                    </Col>
                    <Col span="21" push='1'>
                    <CheckboxGroup v-model="disabledGroup" @on-change="ckeckOneLiti">
                        <span v-for="d in diplist"><Checkbox :label="d"></Checkbox></span>
                    </CheckboxGroup>
                    </Col>
                </Row>
            </div>
            <div class="button-clas">
                <Button size='large' @click="pro" :loading='loading1' style="background:#2083D8;color:#fff;padding: 6px 31px;font-size:16px;" >生成</Button>
            </div>
        </div>

        <!-- 自定义文书 -->
        <div class="bookbuilding-table">
            <Row >
                <Col span="24" class="noemalTb th-header">
                    <span>自定义生成文书列表</span>
                    <span style="float:right">
                        <!-- <Checkbox v-model="allCkeck">全选/取消全选</Checkbox> -->
                    </span>
                </Col>
            </Row>
            <div class="contain">
                <div class="maininfo-warp"  style="border-left:none">
                    <CheckboxGroup size="large" v-model="dipChecked" @on-change="dipCheckedChange()">
                        <Row>

                            <Col  v-for="(d, key) in diplistEdit" :key="key" span="6" class="maininfo-col" style="overflow: hidden;">
                                <template v-if="d.ispro">
                                   <template   v-if="item.isproduct">
                                     <Checkbox :label="d.name" class="created"></Checkbox>
                                   </template>
                                   <template   v-else>
                                     <!-- <Checkbox :label="d.name"></Checkbox> -->
                                   </template>
                               </template>
                                <template v-else>
                                   <!-- <Checkbox :label="d.name"></Checkbox> -->
                                   <span>{{d.name}}</span>
                               </template>
                                <template v-if="d.edit">
                                    <Badge   count="已编辑"  type="success" class-name="demo-badge-alone"></Badge>
                                </template>
                                <template v-if="d.name !='送达地址有关事项告知书'">
                                 <span v-if="d.name !='诉讼权利义务告知书' && d.name !='送达地址有关事项告知书'
                                    && d.name !='人民法院民事诉讼风险提示书' && d.name !='小额诉讼须知'  && d.name !='诉讼权利义务告知书'
                                    && d.name !='文书上网告知书' && d.name !='人民法院民事诉讼风险提示书' && d.name !='当事人在法庭上应当遵守的纪律'
                                 " @click="editor(d.name)" style="float:right;cursor: pointer;" >编辑</span>
                                </template>
                            </Col>
                        </Row>
                    </CheckboxGroup>
                </div>
                
            </div>
            <div class="button-clas">
                <!-- <Button size='large' @click="pro" style="background:#2083D8;color:#fff;padding: 6px 31px;font-size:16px;" >生成</Button> -->
            </div>
        </div>
        <!-- 辅助性文书 -->
        <div class="bookbuilding-table">
            <Row >
                <Col span="24" class="noemalTb th-header">
                    <span>辅助型文书生成</span>
                    <span style="float:right">
                        <Checkbox @on-change="ckeckAllF" v-model="allCkeckF">全选/取消全选</Checkbox>
                    </span>
                </Col>
            </Row>
            <div class="contain">
                <Row >
                    <Col span="2" push='1'>
                        <span>文书选择</span>
                    </Col>
                    <Col span="21" push='1'>
                    <CheckboxGroup v-model="assGroup" @on-change="assChange()">
                        <span v-for="d in judgeDipList"><Checkbox :label="d"></Checkbox></span>
                    </CheckboxGroup>
                    </Col>
                </Row>
            </div>
            <div class="button-clas">
                <Button size='large' @click="proAss" :loading='loading2' style="background:#2083D8;color:#fff;padding: 6px 31px;font-size:16px;" >生成</Button>
            </div>
        </div>
        <!-- 结构化文书 -->
        <!-- <div class="bookbuilding-table">
            <Row >
                <Col span="24" class="noemalTb th-header">
                    <span>结构化文书</span>
                </Col>
            </Row>
            <div class="button-clas" style="padding:30px 0px;">
                <Button size='large'  style="background:#2083D8;color:#fff;padding: 6px 31px;font-size:16px;" >前往庭审笔录结构选择与生成</Button>
                <Button size='large'  style="background:#2083D8;color:#fff;padding: 6px 31px;font-size:16px;" >前往判决书结构选择与生成</Button>
            </div>
        </div> -->
        <!-- 文书编辑 -->
        <Modal
            v-model="modal1"
            title="文书编辑"
            :mask-closable="false"
            :styles="{top: '20px'}"
            :width="modalWidth">

                <!-- <TabPane  v-for="(dip, key) in diplist" :key="key" :label="dip.name" :name="dip.name">    -->
            <div class="components-container">

                <div class="editor-container">
                    <receipt :backFill="backFill" ref="cita"  @model="modelIshid" v-if="panelList=='送达证'"></receipt>
                    <citation :backFill="backFill" ref="cita" @model="modelIshid" v-else-if="panelList=='传票'"></citation>
                    <setCaseForm :backFill="backFill" ref="cita" @model="modelIshid" v-else-if="panelList=='立案审批表'" />
                    <superviseCard :backFill="backFill" ref="cita" @model="modelIshid" v-else-if="panelList=='廉政监督卡'"></superviseCard>
                    <sendAddressConfirm :backFill="backFill" ref="cita" @model="modelIshid" v-else-if="panelList=='送达地址确认书'"></sendAddressConfirm>
                    <discipline :backFill="backFill" ref="cita" @model="modelIshid" v-else-if="panelList=='当事人在法庭上应当遵守的纪律'" />
                    <proofNotice :backFill="backFill" ref="cita" @model="modelIshid" v-else-if="panelList=='民事举证通知书'"></proofNotice>
                    <smallNotice :backFill="backFill" ref="cita" @model="modelIshid" v-else-if="panelList=='小额诉讼须知'"/>
                    <joinLitigationAdviceNote :backFill="backFill" ref="cita" @model="modelIshid" v-else-if="panelList=='参加诉讼通知书'"></joinLitigationAdviceNote>
                    <caseAccept :backFill="backFill" ref="cita" @model="modelIshid" v-else-if="panelList=='受理案件通知书'"></caseAccept>

                    <citationStub :backFill="backFill" ref="cita" @model="modelIshid" v-else-if="panelList=='传票存根'"></citationStub>
                    <phoneNotification :backFill="backFill" ref="cita" @model="modelIshid" v-else-if="panelList=='电话通知记录表'"></phoneNotification>
                    <ComponentMembers :backFill="backFill" ref="cita" @model="modelIshid" v-else-if="panelList=='合议庭组成人员通知书'"></ComponentMembers>
                    
                    
                    
                    <apperanceNotice :backFill="backFill" ref="cita" @model="modelIshid" v-else-if="panelList=='应诉通知书'"></apperanceNotice>
                    <envelope :backFill="backFill" ref="cita" @model="modelIshid" v-else-if="panelList=='封皮'"></envelope>
                    <entrustSend :backFill="backFill" ref="cita" @model="modelIshid" v-else-if="panelList=='委托送达函'"></entrustSend>
                    <bulletin :backFill="backFill" ref="cita" @model="modelIshid" v-else-if="panelList=='公告'"></bulletin>
                    <verdict :backFill="backFill" ref="cita" @model="modelIshid" v-else-if="panelList=='口头裁定笔录'"></verdict>
                    <!-- <UE v-if="modal1" :defaultMsg="dip.content || ''" :config="config" :ref="dip.name"></UE> -->
                </div>
                <div :style="{marginTop: '10px', textAlign: 'right', width: ueWidth}">

                    <Button  @click="produceDip(panelList)">生成</Button>
                </div>
            </div>
                    <!-- <Spin size="large" fix v-if="dip.spin"></Spin> -->
                <!-- </TabPane> -->

            <div slot="footer"></div>
        </Modal>
    </div>
</template>
<script>
import { formatDate } from '@/libs/date'
import {holiday,} from "@/api/courtDate";
import { tools_downLoad } from '@/libs/tools.js';
import { 
    buildInfo,
    buildDiploms,
    buildView
} from "@/api/diplomas";
import {
  downloadZip
} from "@/api/batch";
import citation from '@/components/diplomas/citation.vue'; //传票
import citationStub from '@/components/diplomas/citationStub.vue';  //传票存根
import setCaseForm from '@/components/diplomas/setCaseForm.vue';  //立案审批表
import superviseCard from '@/components/diplomas/superviseCard.vue'; //廉政监督卡
import sendAddressConfirm from '@/components/diplomas/sendAddressConfirm.vue'; //送达地址确认书
import receipt from '@/components/diplomas/receipt.vue'; //送达证
import discipline from '@/components/diplomas/discipline.vue'; //送达证
import proofNotice from '@/components/diplomas/proofNotice.vue';//民事举证通知书
import smallNotice from '@/components/diplomas/smallNotice.vue';//民事举证通知书
import caseAccept from '@/components/diplomas/caseAccept.vue';//受理案件通知书
import joinLitigationAdviceNote from '@/components/diplomas/joinLitigationAdviceNote.vue';

import phoneNotification from '@/components/diplomas/phoneNotification.vue';
import ComponentMembers from '@/components/diplomas/ComponentMembers.vue';



import apperanceNotice from '@/components/diplomas/apperanceNotice.vue';
import envelope from '@/components/diplomas/envelope.vue';
import entrustSend from '@/components/diplomas/entrustSend.vue';
import bulletin from '@/components/diplomas/bulletin.vue';
import verdict from '@/components/diplomas/verdict.vue';
import Vue from 'vue';
export default {
    components: { citation,citationStub,setCaseForm,receipt,sendAddressConfirm,discipline,smallNotice,joinLitigationAdviceNote,phoneNotification,
    ComponentMembers,proofNotice,superviseCard,caseAccept,apperanceNotice,envelope,entrustSend,bulletin,verdict,
    },
    data(){
        var width = window.innerWidth - 200;
        var ueWidth = width - 40 + 'px';
        return{
            caseInfo:{
                time:''
            },
            editState:false,
            modal1:false,
            briefName:"",
            modalWidth: width,
            ueWidth: ueWidth,
            panelList:'',
            dipName:"",
            backFill:[],
            allCkeck:false,
            allCkeckLiti:false,
            loading1:false,
            loading2:false,
            allCkeckF:false,
            litigantList:[],
            disabledGroup:[],
            assGroup:[],
            searchForm:"",
            selLitigant:'',
            diplistEdit:[], //可编辑文书列表
            dipChecked:[],
            judgeDipList:[],
            isLoading:false,
            caseId:this.$store.getters.caseId,
            diplist:[], //所有文书
            defendantTemplate:[],//被告文书列表
            defendantDefaultTemplate:[],//被告默认选择文书
            plaintiffTemplate:[],//原告文书列表
            plaintiffDefaultTemplate:[],//原告默认选择文书
            diplist:[
            ],
            SchedulingList:[
                {
                    name:1
                },
                {
                    name:2
                },
            ]
        }
    },
    methods:{
        // 生成
        produceDip(panelList){
            
            this.$refs.cita.dipPro(this.selLitigant,panelList);

        },
        modelIshid(value,result,title){
            console.log(result)
            this.$Message.loading({
                content: '文书生成中，请稍候',
                duration: 0.6, // 按照文书数量给后台一点生成pdf文件的时间
                onClose: () => {
                    window.open(result);
                }
            });
            this.modal1 = false;
            for(let i=0;i<this.diplistEdit.length;i++){
                if(this.diplistEdit[i].name == this.panelList){
                    this.diplistEdit[i].edit = true;
                }
            }
        },
        /**
         * 选择当事人
         */
        selLiti(id){
            this.diplist = [];
            this.disabledGroup = [];
            this.diplist = JSON.parse(JSON.stringify(this.diplist));
            this.disabledGroup = JSON.parse(JSON.stringify(this.disabledGroup));
            for(let i=0;i<this.litigantList.length;i++){
                if(this.litigantList[i].id == id){
                    if(this.litigantList[i].litigationStatus.litigantStatusName == '原告'){
                        this.diplist = this.plaintiffTemplate;
                        let that = this;
                        setTimeout(function(){
                            that.disabledGroup = that.plaintiffDefaultTemplate;
                            // for(let i=0;i<this.disabledGroup.length;i++){
                            //     console.log(this.disabledGroup[i])
                            //     Vue.set(this.disabledGroup, i, this.disabledGroup[i])
                            // }
                        },300)
                        this.diplistEdit = [];
                        for(let i=0;i<this.plaintiffTemplate.length;i++){
                            const da ={
                                name:this.plaintiffTemplate[i],
                                edit:false,
                            }
                            this.diplistEdit.push(da)
                        }
                        console.log(this.disabledGroup)
                    }else  if(this.litigantList[i].litigationStatus.litigantStatusName == '被告'){
                        this.diplist = this.defendantTemplate;  
                        let that = this;
                        setTimeout(function(){
                            that.disabledGroup = that.defendantDefaultTemplate;
                        },300)
                        this.diplistEdit = [];
                        for(let i=0;i<this.defendantTemplate.length;i++){
                            const da ={
                                name:this.defendantTemplate[i],
                                edit:false,
                            }
                            this.diplistEdit.push(da)
                        }
                    }
                }
            }
            
            for(let i=0;i<this.diplist.length;i++){
                 console.log(this.diplist[i])
                Vue.set(this.diplist, i, this.diplist[i])
            }
            //   this.diplist = JSON.parse(JSON.stringify(this.diplist));
            //  this.disabledGroup = JSON.parse(JSON.stringify(this.disabledGroup));
        },
        /**
         * 当事人文书生成
         */
        pro(){
            if(this.selLitigant == ""){
                this.$Notice.warning({
                    title: '',
                    desc: '请选择当事人',
                    duration: 5
                });
                return false;
            }
            this.loading1 = true;
            buildDiploms(this.selLitigant,this.disabledGroup.join(","),'Litigant').then(res => {
                this.loading1 = false;
                if(res.data.state == 100){
                    window.open(res.data.data.path)
                }else{
                    this.$Notice.warning({
                        title: '',
                        desc: res.data.message,
                        duration: 5
                    }); 
                }
            })
        },
        /**
         * 辅助型文书生成
         */
        proAss(){
            let data = [];
            const da = {
                lawCaseId:this.caseId.toString(),
                templateName:this.assGroup.join(","),
                briefName:this.briefName
            }
            data.push(da)
            this.loading2 = true;
            downloadZip(data).then(res => {
                this.loading2 = false;
                if(res.data.state == 100){
                    tools_downLoad(res.data.data)
                    // window.open(res.data.data);
                }else{
                    this.$Notice.warning({
                        title: '',
                        desc: res.data.message,
                        duration: 5
                    });
                }
            })
        },
        /**
         * 自动文书全选
         */
        ckeckAllLiti(){
            if(this.allCkeckLiti){
                this.disabledGroup = [];
                for(let i=0;i<this.diplist.length;i++){
                    this.disabledGroup.push(this.diplist[i])
                }
            }else{
                this.disabledGroup = [];
            }
        },
        /**
         * 自动文书单选
         */
        ckeckOneLiti(){
            if(this.disabledGroup.length < this.diplist.length){
                this.allCkeckLiti = false;
            }else{
                this.allCkeckLiti = true;
            }
        },
        /**
         * 辅助型文书全选
         */
        ckeckAllF(){
            if(this.allCkeckF){
                this.assGroup = [];
                for(let i=0;i<this.judgeDipList.length;i++){
                    this.assGroup.push(this.judgeDipList[i])
                }
            }else{
                this.assGroup = [];
            }
        },
        /**
         * 辅助文书单选
         */
        assChange(){
            if(this.assGroup.length < this.judgeDipList.length){
                this.allCkeckF = false;
            }else{
                this.allCkeckF = true;
            }
        },
        dipCheckedChange(){

        },
        /**
         * 编辑
         */
        editor(value){
            this.panelList = '';
            this.panelList = value;
            if(this.selLitigant == ''){
                this.$Notice.warning({
                    title: '',
                    desc: '请选择当事人',
                    duration: 5
                });
                return false;
            }
            buildView(this.caseId,this.selLitigant,this.panelList).then(res => {
                var data = res.data;
                if (data.state - 0 === 100) {
                    this.modal1 = true;
                        this.backFill = data.data;
                        this.modal1 = true;
                    }else{
                        this.$Message.info(res.data.message)
                    }
            })
            
        },
        init(){
            this.isLoading = true;
            buildInfo(this.$store.getters.caseId).then(res => {
                this.isLoading = false;
                let dt = res.data.data;
                if(res.data.state == 100){
                    this.diplist = [];
                    
                    this.litigantList = dt.litigants;
                    this.diplist = dt.diplomsTemplate;
                    this.diplistEdit = [];
                    for(let i=0;i<dt.diplomsTemplate.length;i++){
                        const da ={
                            name:dt.diplomsTemplate[i],
                            edit:false,
                        }
                        this.diplistEdit.push(da)
                    }
                    this.defendantTemplate=dt.defendantTemplate;//被告文书列表
                    this.defendantDefaultTemplate=dt.defendantDefaultTemplate,//被告默认选择文书
                    this.plaintiffTemplate=dt.plaintiffTemplate;//原告文书列表
                    this.plaintiffDefaultTemplate=dt.plaintiffDefaultTemplate;//原告默认选择文书
                    this.judgeDipList = dt.judgementTemplate;
                    this.briefName = dt.briefName;
                }
            })
        }
    },
    mounted() {
        this.init();
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
    },
}
</script>

