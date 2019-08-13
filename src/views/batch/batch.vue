<style lang="less">
@import "./batch.less";
</style>
<template>
    <div>
        <Card class="batch-main">
            <!-- {{this.$store.getters.getIndexTab}} -->
            <Tabs type="line" size='small' v-model="selectName"  @on-click="changeTab" >
                <TabPane name='setcase' label="立案" v-if="this.$store.getters.hastabList('立案审核')">
                    <reviewCase ref="setcase"/>
                </TabPane>
                <TabPane name='divicase' label="分案" v-if="this.$store.getters.hastabList('分案')">
                    <division ref="divicase" />
                </TabPane>
                <TabPane  name='courtdate' label="排庭" v-if="this.$store.getters.hastabList('排庭')">
                    <courtDate ref="courtdate"/>
                </TabPane>
                <!-- <TabPane  name='dipmos' label="庭前文书生成" v-if="this.$store.getters.hastabList('庭前文书生成')">
                    <dipmos  ref="dipmos"/>
                </TabPane> -->
                <!-- <TabPane  name='handdle' label="批量庭前送达" v-if="this.$store.getters.hastabList('批量庭前送达')">
                    <send ref="handdle" />
                </TabPane> -->
                <TabPane  name='courtHearing' label="批量庭审" v-if="this.$store.getters.hastabList('批量庭审')">
                    <courtHearing ref="courtHearing" />
                </TabPane>
                <TabPane  name='dipmosAss' label="庭后文书生成" v-if="this.$store.getters.hastabList('调解、裁判文书生成')">
                    <dipmosAss ref="dipmosAss" />
                </TabPane>
                <!-- <TabPane  name='changeNormal' label="批量转普" v-if="this.$store.getters.hastabList('批量转普')">
                    <changeNormal ref="changeNormal" />
                </TabPane> -->
                <!-- <TabPane  name='trialTerm' label="批量修改审限" v-if="this.$store.getters.hastabList('批量修改审限')">
                    <trialTerm ref="trialTerm" />
                </TabPane> -->
                <!-- <TabPane  name='allopenjzz' label="批量开启举证质证" v-if="this.$store.getters.hastabList('批量开启举证质证')">
                    <allopenjzz ref="allopenjzz" />
                </TabPane> -->
                <!-- <TabPane  name='sendAss' label="批量庭后送达" v-if="this.$store.getters.hastabList('批量庭后送达')">
                    <sendAss ref="sendAss" />
                </TabPane> -->
                <!-- <TabPane  name='endCase' label="批量结案" v-if="this.$store.getters.hastabList('批量结案')">
                    <endCase ref="endCase" />
                </TabPane>  -->
                 <!-- <TabPane  name='batchCase' label="庭前案件信息确认" v-if="this.$store.getters.hastabList('批量结案')">
                    <batchCase ref="batchCase" />
                </TabPane> -->
            </Tabs>
        </Card>
    </div>
</template>

<script>
import reviewCase from "./components/reviewCase.vue";
import division from "./components/division.vue";
import courtDate from "./components/courtDate.vue";
import dipmos from "./components/dipmos.vue";
import send from "./components/send.vue";
import dipmosAss from "./components/dipmosAss.vue";
import changeNormal from "./components/changeNormal.vue";
import trialTerm from "./components/trialTerm.vue";
import allopenjzz from "./components/allopenjzz.vue";
import courtHearing from "./components/courtHearing.vue";
import endCase from "./components/endCase.vue";
import batchCase from "./components/batchCase.vue";
import sendAss from "./components/sendAss.vue";
export default {
    components: {
        reviewCase,
        division,
        courtDate,
        dipmos,
        dipmosAss,
        send,
        changeNormal,
        trialTerm,
        allopenjzz,
        courtHearing,
        endCase,
        batchCase,
        sendAss
    },
    data (){
        return{
            isOpenDivision:false,
            isOpenCourtDate:false,
            isOpenDipmos:false,
            isOpenSetcase:false,
            isOpenDipmoAss:false,
            isOpenhanddle:false,
            isOpensendAss:false,
            changeNormal:false,
            isOpenalljzz:false,
            trialTerm:false,
            courtHearing:false,
            endCase:false,
            batchCase:false,
            selectName:"",
        }
    },
    watch: {
		'$route' (to, from) {
            console.log(to.name)
            let ob1 =    document.getElementById('courtSel');
            let ob2 =    document.getElementById('litigantSel');
            if(to.name == 'login_court'){
                ob1.classList.add('on')
                ob2.classList.remove('on')
            }else{
                ob2.classList.add('on')
                ob1.classList.remove('on')
            }
        },
        tabList: {
            immediate: true, // 关键，，将立即以表达式的当前值触发回调
            handler (val) {
                if(val.length){
                    this.showTab(val[0].title);//监听异步获取的选项卡数据变化
                }
            }
        },
    },
    computed: {
        tabList(){
            return this.$store.getters.tabList //获取异步的选项卡数据
        }
    },
    methods: {
        showTab(name){
            console.log('88888888888888888',name)                         
           switch (name) {
                case '立案审核':
                   this.selectName='setcase';//默认选中该选项卡
                break;
                case '分案':
                   this.selectName='divicase';//默认选中该选项卡
                break;
                case '排庭':
                   this.selectName='courtdate';//默认选中该选项卡
                break;
                case '批量庭审':
                   this.selectName='courtHearing';//默认选中该选项卡
                break;
                case '调解、裁判文书生成':
                   this.selectName='dipmosAss';//默认选中该选项卡
                break;
           }         
            //不延迟获取不到
            setTimeout(() => {
                this.$refs[this.selectName].getRoleList();//获取该选项卡列表
            }, 300);
        },
        /**
         * 切换选项卡
         */
        changeTab(e){
            console.log(e)
            this.$refs[e].getRoleList();
        },
        changeMenu(num){
            var menuCard = document.getElementsByClassName("menuCard");
            for(let i=0;i<menuCard.length;i++){
                menuCard[i].classList.remove('menuACtive');
            }
            menuCard[num].classList.add('menuACtive');
        },
        changeLogin(el){
            console.log(el + '98998')
            if(el=='litigant'){
                this.$router.push({
                    name: 'login_index'
                });
            }else{
                this.$router.push({
                    name: 'login_court'
                });
            }
        }
    }
}
</script>