<style lang="less">
@import "./courtDiplomas.less";
</style>
<template>
<div class="courtDiplomasInfo">
    <Row >
        <Col span="24" class="change-tab">
            <div @click="changeMenu('diplomasPro')" id="diplomasPro" class="selTab  tabOn">
                <span>文书生成</span>
            </div>
            <div @click="changeMenu('diplomasRecord')" id="diplomasRecord" class="selTab ">
                <span>文书生成历史记录</span>
            </div>
        </Col>
    </Row>
    <div>
        <div v-show="showComponents == 'diplomasPro'">
            <diplomasPro />
        </div>
        <div v-show="showComponents == 'diplomasRecord'">
            <diplomasRecord ref="reCo"/>
        </div>
        
    </div>
</div>
</template>
<script>
import { formatDate } from '@/libs/date'
//文书生成
import diplomasPro from "./components/diplomasPro.vue";
// 文书生成历史记录
import diplomasRecord from "./components/diplomasRecord.vue";
export default {
    components: {
        diplomasPro,
        diplomasRecord,
    },
    data(){
        return{
            caseInfo:{

            },
            showComponents:'diplomasPro',
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
            if(idName == 'diplomasRecord'){
                this.$refs.reCo.init()
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

