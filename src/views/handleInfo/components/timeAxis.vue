<style lang="less">
@import "./common.less";
</style>
<template>
<div class="caseInfo litigantInfo" style="position:relative">
    <Spin size="large" fix v-show="isLoading"></Spin>
    <div class="bookbuilding-table">
        <Row >
            <Col span="24" class="noemalTb th-header">
                案件时间轴
            </Col>
        </Row>
        <div class="timeaxis">
            <div class="timeDiv" ref="scroller">
                <div class="timeaxisList" ref="timeaxisList" :style="{ top: top + 'px'}">
                    <p>(时间由近至远)</p>
                    <p class="tip">操作日期时间+操作者身份+操作者名称+操作的动作+操作的事项</p>
                    <p v-for="(item,index) in timeList" :key=index>{{item}}</p>
                </div>
                <div class="timeBtn">
                    <img @click="up()" src="../../../images/up.png" />
                    <img @click="down()" src="../../../images/down.png"/>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import { formatDate } from '@/libs/date'
import {
  processNote
} from "@/api/handleInfo";
export default {
    data(){
        return{
            isLoading: false,
            top: 0,
            height: 0,
            clickCount: 0,
            timeListCount: 0,
            upFlag: false,
            downFlag: false,
            topHeight: Number,
            timeList: {},
        }
    },
    mounted(){},
    methods:{
        up () {
            if(this.timeListCount > 1 && this.topHeight >528){
                if(Math.abs(this.top) ==this.topHeight){
                    return false
                }else{
                    this.top = this.top - this.height;
                }
            }
            console.log('clickCountUPPPPP',this.topHeight)
        },
        down () {
            if(this.timeListCount > 1 && this.topHeight >528){
                if(Math.abs(this.top) <=0){
                    return false
                }else{
                    this.top = this.top + this.height;
                }
            }
            console.log('clickCountDownnnnn',this.topHeight)
        },
        getProcessNote(){
            this.isLoading = true;
            this.top = 0;
            processNote(this.changeMemberTab).then(res => {
                this.isLoading = false;
                console.log(res.data.data)
                if(res.data.state == 100){
                    this.timeList = res.data.data;
                    this.height = this.$refs.scroller.offsetHeight;
                }else{
                    this.$Notice.warning({
                        title: '',
                        desc: res.data.message,
                        duration: 5
                    });
                }
            }).then(data => {
                let height = this.$refs.timeaxisList.offsetHeight / 528;
                console.log('heght', this.$refs.timeaxisList.offsetHeight)
                if((height%1) === 0){
                    this.timeListCount = parseInt(height);
                }else{
                    this.timeListCount = parseInt(height+1);
                }
                this.topHeight = (this.timeListCount-1) * 528;
            })
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
        formatStartDate(time) {
            if (time == '') {
                return '';
            }
            var date = new Date(time);
            return formatDate(date, 'yyyy-MM-dd hh:mm');
        }
    },
    computed: {
        changeMemberTab() {
            return this.$store.getters.caseId;
        }
    },
    watch:{
        changeMemberTab(val) {
            console.log(val)
        },
    }
}
</script>

