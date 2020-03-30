<style lang="less">
@import "./caseInfo.less";
</style>
<template>
<div class="caseInfo">
    <Row >
        <Col span="24" class="change-tab" style="display:flex">
            <div @click="changeMenu('lian')" id="lian" class="selTab  tabOn" ref="lian">
                <span>立案信息</span>
            </div>
            <div @click="changeMenu('essential')" id="essential" class="selTab  tabOn" ref="essential">
                <span>要素修改</span>
            </div>
            <div @click="changeMenu('payfor')" id="payfor" class="selTab ">
                <span>诉费缴交</span>
            </div>
            <div @click="changeMenu('litigantInfo')" id="litigantInfo" class="selTab ">
                <span>当事人与代理人信息</span>
            </div>
            <div @click="changeMenu('indictment')" id="indictment" class="selTab ">
                <span>起诉状</span>
            </div>
            <div @click="changeMenu('materials')" id="materials" class="selTab ">
                <span>证明与委托材料</span>
            </div>
            <div @click="changeMenu('evidences')" id="evidences" class="selTab ">
                <span>证据材料</span>
            </div>
            <div @click="changeMenu('refund')" id="refund" class="selTab ">
                <span>退费</span>
            </div>
            <div @click="changeMenu('timeAxis')" id="timeAxis" class="selTab">
                <span>案件时间轴</span>
            </div>
            <div @click="changeMenu('tjAgreementSend')" id="tjAgreementSend" class="selTab">
                <span>调解协议与送达回执</span>
            </div>
        </Col>
    </Row>
    <div v-show="showComponents == 'lian'">
        <setCaseInfo ref="setCaseInfo"/>
    </div>
    <div v-show="showComponents == 'essential'">
        <essential  ref="essential"/>
    </div>
    <div v-show="showComponents == 'litigantInfo'">
        <litigantInfo ref="litigantInfo"/>
    </div>
    <div v-show="showComponents == 'payfor'">
        <payfor ref="payfor"/>
    </div>
    <div v-show="showComponents == 'indictment'">
        <indictment ref="indictment"/>
    </div>
    <div v-show="showComponents == 'materials'">
        <materials ref="materials"/>
    </div>
    <div v-show="showComponents == 'evidences'">
        <evidences ref="evidences"/>
    </div>
    <div v-show="showComponents == 'refund'">
        <refund ref="refund"/>
    </div>
    <div v-show="showComponents == 'timeAxis'">
        <timeAxis ref="timeAxis"/>
    </div>
    <div v-show="showComponents == 'tjAgreementSend'">
        <tjAgreementSend ref="tjAgreementSend"/>
    </div>
</div>
</template>
<script>
import { formatDate } from '@/libs/date'
//立案信息
import setCaseInfo from "./components/setCaseInfo.vue";
// 要素修改
import essential from "@/views/caseInfo/components/essential.vue";
// 当事人与代理人信息
import litigantInfo from "./components/litigantInfo.vue";
// 诉费缴交
import payfor from "./components/payfor.vue";
// 起诉状
import indictment from "./components/indictment.vue";
// 证明与委托材料
import materials from "./components/materials.vue";
// 证据材料
import evidences from "./components/evidences.vue";
// 退费
import refund from "./components/refund.vue";
// 立案时间轴
import timeAxis from "./components/timeAxis.vue";
// 调解协议与送达回执
import tjAgreementSend from "@/views/handleInfo/components/tjAgreementSend.vue";

export default {
    components: {
        setCaseInfo,
        essential,
        payfor,
        litigantInfo,
        indictment,
        materials,
        evidences,
        refund,
        timeAxis,
        tjAgreementSend
    },
    data(){
        return{
            caseInfo:{
            },
            showComponents:'lian',
            caseId:this.$store.getters.caseId,
            isEviLoad:true,
        }
    },
    mounted(){
        this.changeMenu(this.showComponents)
    },
    methods:{
        //点击初始化数据
        changeMenu(idName){
            let menuCard = document.getElementsByClassName("selTab");
            for(let i=0;i<menuCard.length;i++){
                menuCard[i].classList.remove('tabOn');
            }
            let addClassN = document.getElementById(idName);
            addClassN.classList.add('tabOn');
            this.showComponents = idName;
            if(idName == 'lian'){
                this.$refs.setCaseInfo.lawCaseQuery(this.$store.getters.caseId);
                // if(this.$store.getters.caseId){//提前加载证据文件（只首次加载）
                //     this.$refs.evidences.getEvidenceList();
                // }
            }
            if(idName == 'essential'){
                this.$refs.essential.init();
            }
            if(idName == 'litigantInfo'){
                this.$refs.litigantInfo.getLawyerList()
            }
            if(idName == 'payfor'){
                this.$refs.payfor.getLitigationPay()
            }
            if(idName == 'indictment'){
                this.$refs.indictment.getIndictment();
            }
            if(idName == 'evidences'){
                this.$refs.evidences.getEvidenceList();
            }
            if(idName == 'materials'){
                this.$refs.materials.getMaterials();
            }
            if(idName == 'refund'){
                this.$refs.refund.getLitigationPay();
            }
            if(idName == 'timeAxis'){
                this.$refs.timeAxis.getProcessNote();
            }
            if(idName == 'timeAxis'){
                this.$refs.tjAgreementSend.init();
            }
        },
    },
    watch:{
        "$store.getters.caseId":function(){
            let that = this;
            setTimeout(function(){
                console.log(999)
                that.changeMenu('lian')
             }, 500);
        }
    }

}
</script>

