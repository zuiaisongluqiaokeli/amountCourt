<style lang="less">
@import "./courtSend.less";
</style>
<template>
<div class="courtSendInfo">
    <Row >
        <Col span="24" class="change-tab">
            <div @click="changeMenu('sendHandle')" id="sendHandle" class="selTab  tabOn">
                <span>送达操作</span>
            </div>
            <div @click="changeMenu('sendHistory')" id="sendHistory" class="selTab ">
                <span>送达历史记录</span>
            </div>
            <!-- <div @click="changeMenu('phoneNotice')" id="phoneNotice" class="selTab ">
                <span>电话通知</span>
            </div> -->
            <div @click="changeMenu('messageNotice')" id="messageNotice" class="selTab ">
                <span>短信通知</span>
            </div>
        </Col>
    </Row>
    <div>
        <div v-if="showComponents == 'sendHandle'">
            <sendHandle />
        </div>
        <div v-show="showComponents == 'sendHistory'">
            <sendHistory ref="history"/>
        </div>
        <div v-if="showComponents == 'phoneNotice'">
            <phoneNotice />
        </div>
        <div v-show="showComponents == 'messageNotice'">
            <messageNotice ref="message"/>
        </div>
        
    </div>
</div>
</template>
<script>
import { formatDate } from '@/libs/date'
//送达操作
import sendHandle from "./components/sendHandle.vue";
// 送达历史记录
import sendHistory from "@/views/sendDiplomas/diplomas.vue";
// 电话通知
import phoneNotice from "./components/phoneNotice.vue";
// 短信通知
import messageNotice from "./components/messageNotice.vue";
export default {
    components: {
        sendHandle,
        sendHistory,
        phoneNotice,
        messageNotice,
    },
    data(){
        return{
            caseInfo:{

            },
            showComponents:'sendHandle',
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
            if(idName == 'sendHistory'){
                this.$refs.history.getList()
            }else if(idName == 'messageNotice'){
                this.$refs.message.init()
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
        }
    }

}
</script>

