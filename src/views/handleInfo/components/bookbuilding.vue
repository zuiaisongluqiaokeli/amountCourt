<style lang="less">
@import "./common.less";
</style>
<template>
<div class="litigantInfo" style="position:relative">
    <Spin size="large" fix v-show="isLoading"></Spin>
    <div class="bookbuidInfo">
        <!-- 原告信息 -->
        <litigantInfo 
        @refreshList="onRefreshList" 
        title="原告、原告间关系及代理人信息" 
        type="plaintiff" 
        :data="plaintiffList" 
        :relationArr="plaintiffRelation"
        :caseLoading="caseLoading" 
        ref="revertsList1" />
        <!-- 被告信息 -->
        <litigantInfo 
        @refreshList="onRefreshList" 
        title="被告、被告间关系及代理人信息" 
        type="defendant" 
        :data="defendantList" 
        :relationArr="defendantRelation"
        :caseLoading="caseLoading" 
        ref="revertsList2" />
        <!-- 第三人信息 -->
        <litigantInfo 
        @refreshList="onRefreshList" 
        title="第三人、第三人间关系及代理人信息" 
        type="third" 
        :data="thirdList" 
        :relationArr="thirdRelation"
        :caseLoading="caseLoading" 
        ref="revertsList3" />
    </div>
</div>
</template>
<script>
import litigantInfo from './litigant/litigantInfo.vue';
import {
    litigantLawyerList,
} from "@/api/handleInfo";
export default {
    components: {
        litigantInfo,
    },
    data(){
        return{
            plaintiffList:[],
            defendantList:[],
            thirdList:[],
            caseLoading:true,
            isLoading: false,
            caseId: this.$store.getters.caseId,
            plaintiffRelation: [],
            defendantRelation: [],
            thirdRelation: [],
        }
    },
    methods:{
        onRefreshList(){
            this.isLoading = true;
            litigantLawyerList(this.$store.getters.caseId).then(res => {
                this.isLoading = false;
                if(res.data.state == 100){
                    let data = res.data.data;
                    this.plaintiffList = data.plaintiffList;
                    this.defendantList = data.defendantList;
                    this.thirdList = data.thirdList;
                    this.plaintiffRelation =  data.plaintiffRelation;
                    this.defendantRelation = data.defendantRelation;
                    this.thirdRelation = data.thirdRelation;
                }else{
                    this.$Notice.warning({
                        title: '',
                        desc: res.data.message,
                        duration: 5
                    });
                }
            })
        },
    },
}
</script>

