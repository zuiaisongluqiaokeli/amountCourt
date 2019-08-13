<style lang="less">
@import "./common.less";
</style>
<template>
<div class="caseInfo litigantInfo" style="position:relative">
    <Spin size="large" fix v-show="isLoading"></Spin>
    <Row class="bsDiv">
        <Col style="width:48%;float: left;margin: 0px 1% 20px 1%;box-shadow: 3px 3px 5px #DCDCDC" v-for="(item,index) in evidenceList" :key="index">
            <Collapse value="1">
                <Panel name="1">
                    {{item.evidenceNum}}
                    <div slot="content" class="carou">
                        <div class="carouRow">
                            <Row class="tabs" style="">
                                <Col span="4" align="left" valign="middle" class="Tbs height-wit tb-head" style="position:absolute;">
                                    证据名称
                                </Col>
                                <Col span="20" align="left" class="Tbs height-wit" style="float: right;">
                                    <span>{{item.name}}</span>
                                </Col>
                            </Row>
                            <!-- <Row class="tabs" style="">
                                <Col span="4" align="left" valign="middle" class="Tbs height-wit tb-head" style="position:absolute;">
                                    证明对象
                                </Col>
                                <Col span="20" align="left" class="Tbs height-wit" style="float: right;">
                                    <span>{{item.prove}}</span>
                                </Col>
                            </Row> -->
                        </div>
                        <div slot="content" class="elendi">
                            <zh-viewer :viewerId="'evidence'+index" :fileUrls="delUrl(item.filePaths)"></zh-viewer>
                        </div>
                    </div>
                </Panel>
            </Collapse>
        </Col>
    </Row>
</div>
</template>
<script>
import { formatDate } from '@/libs/date'
import ZhViewer from '@/components/moreFileViewer/moreFileViewer.vue';
import {
  evidenceList
} from "@/api/caseInfo";
export default {
    components:{
        ZhViewer
    },
    data(){
        return{
            caseInfo:{},
            isLoading: false,
            evidenceList:[],
        }
    },
    mounted(){
    },
    methods:{
        getEvidenceList(){
            this.evidenceList = [];
            this.isLoading = true;
            evidenceList(this.$store.getters.caseId).then(res => {
                this.isLoading = false;
                if(res.data.state == 100){
                    this.evidenceList = res.data.data;
                    console.log(this.evidenceList)
                }else{
                    this.$Notice.warning({
                        title: '',
                        desc: res.data.message,
                        duration: 5
                    });
                }
            })
        },
        changeMenu(num){
            let menuCard = document.getElementsByClassName("selTabs");
            for(let i=0;i<menuCard.length;i++){
                menuCard[i].classList.remove('tabOn');
            }
            menuCard[num].classList.add('tabOn');
        },
        delUrl(fileAry){
            console.log("aaa",fileAry)
           let newAry=[];
           fileAry.forEach((item,index) => {
               newAry.push(item.addr);
           });
           console.log("bbb",newAry)
           return newAry;
        },
    },
}
</script>

