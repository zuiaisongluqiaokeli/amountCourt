<style lang="less">
@import "./../rtc.less";
</style>
<template>
    <div class="diplomasRecordInfo">
        <div class="bookbuilding-table">
            <Row >
                <Col span="24" class="noemalTb th-header">
                    <span>调解状态信息</span>
                </Col>
            </Row>
            <div class="contain">
               
            </div>
            <div class="button-clas">
                <Button size='large' @click="pro" style="background:#2083D8;color:#fff;padding: 6px 31px;font-size:16px;" >进入调解室</Button>
            </div>
        </div>
        <!-- 调解记录 -->
        <tjRecord ref="tjRecord"></tjRecord>
    </div>
</template>
<script>
import {
  holiday,
} from "@/api/courtDate";
import tjRecord from "@/views/handleInfo/components/tjRecord.vue";
export default {
    data(){
        return{
        }
    },
    components:{
        tjRecord
    },
    methods:{
        pro(){
            var protocolStr = document.location.protocol;
            let refsLocal = window.location.host;
            let httpStr ='https://'+  refsLocal + '/rtctj/?caseId=' + this.$store.getters.caseId;
            console.log(httpStr)
            window.open(httpStr)
        }
    },
    mounted() {
        this.$refs.tjRecord.init();
    },
}
</script>

