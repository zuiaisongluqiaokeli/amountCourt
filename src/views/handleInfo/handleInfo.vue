<style lang="less">
@import "./handleInfo.less";
</style>
<template>
<div class="courtcaseInfo">
    <Row >
        <Col span="24" class="change-tab">
            <div @click="changeMenu('lian')" id="lian" class="selTab  tabOn">
                <span>综合信息</span>
            </div>
            <!-- <div @click="changeMenu('payfor')" id="payfor" class="selTab ">
                <span>诉费信息</span>
            </div> -->
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
            <div @click="changeMenu('electarch')" id="electarch" class="selTab ">
                <span>电子卷宗</span>
            </div>
            <div @click="changeMenu('timeAxis')" id="timeAxis" class="selTab" ref="timeAxis">
                <span>案件时间轴</span>
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
</div>
</template>
<script>
import { formatDate } from '@/libs/date'
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
export default {
    components: {
        setCaseInfo,
        litigantInfo,
        indictment,
        materials,
        evidences,
        timeAxis,
        electarch
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
            if(idName == 'lian'){
                this.$refs.setCaseInfo.lawCaseQuery(this.$store.getters.caseId);
                // if(this.$store.getters.caseId){//提前加载证据文件
                //     this.$refs.evidences.getEvidenceList();
                // }
            }
            if(idName == 'litigantInfo'){
                this.$refs.litigantInfo.onRefreshList();
            }
            if(idName == 'indictment'){
                this.$refs.indictment.getIndictment();
            }
            if(idName == 'materials'){
                this.$refs.materials.getMaterials();
            }
            if(idName == 'evidences'){
                this.$refs.evidences.getEvidenceList();
            }
            if(idName == 'timeAxis'){
                this.$refs.timeAxis.getProcessNote();
            }
            if(idName == 'electarch'){
                this.$refs.electarch.ft_elec_init();
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
    },
    // mounted: {
    //     // changeMemberTab() {
    //     // return this.$store.getters.caseId;
    //     // }
    // },
    watch:{
        "$store.getters.caseId":function(){
            let that = this;
            setTimeout(function(){
                that.changeMenu('lian')
             }, 500);

        }
        // changeMemberTab(val) {
        //     this.changeMenu('lian')
        // }
    }

}
</script>

