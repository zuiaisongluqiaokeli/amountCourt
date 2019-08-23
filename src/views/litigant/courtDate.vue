<style lang="less">
@import "./courtDate.less";
</style>
<template>
<div class="courtDateInfo">
    <Row >
        <Col span="24" class="change-tab">
            <div @click="changeMenu('Scheduling')" id="Scheduling" class="selTab  tabOn">
                <span>排期</span>
            </div>
        </Col>
    </Row>
    <div>
        <div v-show="showComponents == 'Scheduling'">
            <Scheduling/>
        </div>
    </div>
</div>
</template>
<script>
//排期
import Scheduling from "@/views/courtDate/components/Scheduling.vue";
export default {
    components: {
        Scheduling,
    },
    data(){
        return{
            caseInfo:{},
            showComponents:'Scheduling',
            caseId:this.$store.getters.caseId,
        }
    },
    
    methods:{
        changeMenu(idName){
            let menuCard = document.getElementsByClassName("selTab");
            for(let i=0;i<menuCard.length;i++){
                menuCard[i].classList.remove('tabOn');
            }
            let addClassN = document.getElementById(idName);
            addClassN.classList.add('tabOn');
            this.showComponents = idName;
        },
    },
    computed: {
        changeMemberTab() {
            return this.$store.getters.caseId;
        }
    },
}
</script>