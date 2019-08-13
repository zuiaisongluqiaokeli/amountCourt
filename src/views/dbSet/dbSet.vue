<template>
 <div>
     <Card class="dbSet-main" >
            <Tabs type="line" size='small'  @on-click="changeTab" >
                <TabPane name='partyDb' label="当事人数据库">
                    <partyDb ref="partyDb"/>
                </TabPane>
                <TabPane  name='lawyerDb' label="律师数据库">
                    <lawyerDb ref="lawyerDb"/>
                </TabPane>
                <TabPane  name='departMentDb' label="部门庭室信息库">
                    <departMentDb ref="departMentDb"/>
                </TabPane>
                <TabPane  name='courtDb' label="审判庭室信息库">
                    <courtDb ref="courtDb"/>
                </TabPane>
                <TabPane  name='courtWorkerDb' label="法院工作者">
                    <courtWorkerDb ref="courtWorkerDb"/>
                </TabPane>
                <TabPane  name='jurorDb' label="人民陪审员">
                    <jurorDb ref="jurorDb"/>
                </TabPane>
                <TabPane  name='legalInfoDb' label="全国法院信息库">
                    <legalInfoDb ref="legalInfoDb"/>
                </TabPane>
                <TabPane  name='caseNumberDb' label="案号管理">
                    <caseNumberDb ref="caseNumberDb"/>
                </TabPane>
                <TabPane  name='ruleTable' label="排班规则">
                    <ruleTable ref="ruleTable"/>
                </TabPane>
            </Tabs>
    </Card>
 </div>
</template>

<script>
//当事人数据库
import partyDb from "./components/partyDb/partyDb.vue";
//律师数据库
import lawyerDb from "./components/lawyerDb/lawyerDb.vue";
//历史委托人信息
import historyClientDb from "./components/historyClientDb/historyClientDb.vue";
//部门庭室信息库
import departMentDb from "./components/departMentDb/departMentDb.vue";
//审判庭室信息库
import courtDb from "./components/courtDb/courtDb.vue";
//法院工作者
import courtWorkerDb from "./components/courtWorkerDb/courtWorkerDb.vue";
//人民陪审员
import jurorDb from "./components/jurorDb/jurorDb.vue";
//全国法律信息库
import legalInfoDb from "./components/legalInfoDb/legalInfoDb.vue";
//案号管理
import caseNumberDb from "./components/caseNumberDb/caseNumberDb.vue";
//排班规则设置
import ruleTable from "./components/ruleTable/ruleTable.vue";

 export default {
   name:"dbSet_index",
   components: {
     partyDb,
     lawyerDb,
     historyClientDb,
     departMentDb,
     courtDb,
     courtWorkerDb,
     jurorDb,
     legalInfoDb,
     caseNumberDb,
     ruleTable,
   },
   data () {
     return {

     }
   },
   methods:{
      changeTab(e){
        console.log(e);
        this.$refs[e].getNowPageContent();
      }
   },
   mounted() {
        //初始化默认获取的选项卡内容
        this.$refs.partyDb.getNowPageContent();     
   },
 }
</script>

<style lang="less" src='./dbSet.less'>
</style>