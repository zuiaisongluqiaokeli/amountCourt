<style lang="less" > 
@import "./caseInfo.less";
.ivu-collapse-content {
    overflow-y: scroll;
  }
</style>
<template>
<div class="caseInfo">
    <Row >
        <Col span="24" class="change-tab">
            <div v-for="(item) in menuName" @click="changeMenu1(item.name)"  id="lian2" :class="item.acClass">
                <span>{{item.name}}</span>
            </div>
        </Col>
    </Row>
    <div>
        <div v-show="showComponents == '立案信息'">
            <setCaseInfo  ref="setCaseInfo"/>
        </div>
        <div v-show="showComponents == '当事人与代理人信息'">
            <litigantInfo  ref="litigantInfo"/>
        </div>
        <div v-show="showComponents == '起诉状'">
            <indictment  ref="indictment"/>
        </div>
        <div v-show="showComponents == '证明与委托材料'">
            <materials  ref="materials"/>
        </div>
        <div v-show="showComponents == '证据材料'">
            <evidences  ref="evidences"/>
        </div>
        <div v-show="showComponents == '要素修改'">
            <essential  ref="essential"/>
        </div>            
    </div>
</div>
</template>
<script>
import { formatDate } from '@/libs/date'
//立案信息
import setCaseInfo from "./components/info.vue";
// 当事人与代理人信息
import litigantInfo from "@/views/caseInfo/components/litigantInfo.vue";
// 起诉状
import indictment from "@/views/caseInfo/components/indictment.vue";
// 证明与委托材料
import materials from "@/views/caseInfo/components/materials.vue";
// 证据材料
import evidences from "@/views/caseInfo/components/evidences.vue";
// 要素修改
import essential from "@/views/caseInfo/components/essential.vue";
export default {
    components: {
        setCaseInfo,
        litigantInfo,
        indictment,
        materials,
        evidences,
        essential,
    },
    data(){
        return{
            caseInfo:{

            },
            showComponents:'立案信息',
            menuName:[
                {
                    acClass:"selTab2 tabOn",
                    name:'立案信息'
                },
                {
                    acClass:"selTab2",
                    name:'当事人与代理人信息'
                },
                {
                    acClass:"selTab2",
                    name:'起诉状'
                },
                {
                    acClass:"selTab2",
                    name:'证明与委托材料'
                },
                {
                    acClass:"selTab2",
                    name:'证据材料'
                },
                {
                    acClass:"selTab2",
                    name:'要素修改'
                },
                // {
                //     acClass:"selTab2",
                //     name:'合同附件'
                // },
            ],
            caseId:this.$store.getters.caseId,
            isEviLoad:true,
        }
    },
    mounted(){
        // this.changeMenu(this.showComponents)
    },
    methods:{
        init(){
            this.changeMenu1('立案信息')
            this.$refs.setCaseInfo.lawCaseQuery(this.$store.getters.caseId);
        },
        changeMenu1(idName){
            //这里可以采用三元表达式更改样式更简单
            for(let i=0;i<this.menuName.length;i++){
                this.menuName[i].acClass = "selTab2";
                if(this.menuName[i].name == idName){
                    this.menuName[i].acClass = "selTab2 tabOn";
                }
            }
            this.showComponents = idName;
            if(idName == '立案信息'){
                // this.$refs.setCaseInfo.lawCaseQuery(this.$store.getters.caseId);
                // if(this.$store.getters.caseId){//提前加载证据文件（只首次加载）
                //     this.$refs.evidences.getEvidenceList();
                // }
            }
            if(idName == '当事人与代理人信息'){
                this.$refs.litigantInfo.getLawyerList()
            }
            if(idName == '起诉状'){
                this.$refs.indictment.getIndictment();
            }
            if(idName == '证明与委托材料'){
                this.$refs.materials.getMaterials();
            }
            if(idName == '证据材料'){
                this.$refs.evidences.getEvidenceList();
            }
            if(idName == '要素修改'){
                this.$refs.essential.init();
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
    // computed: {
    //     changeMemberTab() {
    //     return this.$store.getters.caseId;
    //     }
    // },

}
</script>
