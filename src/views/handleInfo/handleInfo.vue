<style lang="less">
@import "./handleInfo.less";
</style>
<template>
<div class="courtcaseInfo">
    <Row>
        <Col span="24" class="change-tab" style="display:flex">
            <div @click="changeMenu('lian')" id="lian" class="selTab tabOn">
                <span>综合信息</span>
            </div>
            <div @click="changeMenu('litigantInfo')" id="litigantInfo" class="selTab">
                <span>当事人与代理人信息</span>
            </div>
            <div @click="changeMenu('indictment')" id="indictment" class="selTab">
                <span>起诉状</span>
            </div>
            <div @click="changeMenu('materials')" id="materials" class="selTab">
                <span>证明与委托材料</span>
            </div>
            <div @click="changeMenu('evidences')" id="evidences" class="selTab">
                <span>证据材料</span>
            </div>
            <div @click="changeMenu('electarch')" id="electarch" class="selTab">
                <span>电子卷宗</span>
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
    <div v-show="showComponents == 'litigantInfo'">
        <litigantInfo ref="litigantInfo"/>
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
    <div v-show="showComponents == 'electarch'">
        <electarch ref="electarch"/>
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
// 综合信息
import setCaseInfo from "./components/setCaseInfo.vue";
// 当事人与代理人信息
import litigantInfo from "./components/bookbuilding.vue";
// 起诉状
import indictment from "./components/indictment.vue";
// 证明与委托材料
import materials from "./components/materials.vue";
// 证据材料
import evidences from "./components/evidences.vue";
// 时间轴
import timeAxis from "./components/timeAxis.vue";
// 电子卷宗
import electarch from "./components/electarch.vue";
// 调解协议与送达回执
import tjAgreementSend from "./components/tjAgreementSend.vue";
export default {
    components: {
        setCaseInfo,
        litigantInfo,
        indictment,
        materials,
        evidences,
        timeAxis,
        electarch,
        tjAgreementSend,
    },
    data(){
        return{
            showComponents:'lian',
            caseId:this.$store.getters.caseId,
        }
    },
    methods:{
        changeMenu(idName){
            let menuCard = document.getElementsByClassName("selTab");
            console.log(menuCard)
            for(let i=0;i<menuCard.length;i++){
                menuCard[i].classList.remove('tabOn');
            }
            let addClassN = document.getElementById(idName);
            addClassN.classList.add('tabOn');
            this.showComponents = idName;
            console.log(this.showComponents)
            switch (idName) {
                case 'lian':
                    this.$refs.setCaseInfo.lawCaseQuery(this.$store.getters.caseId);
                break;
                case 'litigantInfo':
                    this.$refs.litigantInfo.onRefreshList();
                break;
                case 'indictment':
                    this.$refs.indictment.getIndictment();
                break;
                case 'materials':
                    this.$refs.materials.getMaterials();
                break;
                case 'evidences':
                    this.$refs.evidences.getEvidenceList();
                break;
                case 'timeAxis':
                    this.$refs.timeAxis.getProcessNote();
                break;
                case 'electarch':
                    this.$refs.electarch.ft_elec_init();
                break;
                case 'tjAgreementSend':
                    this.$refs.tjAgreementSend.init();
                break;
            }
        },
    },
    watch:{
        "$store.getters.caseId":function(){
            let that = this;
            setTimeout(function(){
                that.changeMenu('lian')
            }, 500);
        }
    }

}
</script>

