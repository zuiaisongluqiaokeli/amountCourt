<style lang="less">
@import "./common.less";
</style>
<template>
<div class="caseInfo litigantInfo" style="position:relative">
    <Spin size="large" fix v-show="isLoading"></Spin>
    <div class="bookbuilding-table">
        <Row >
            <Col span="24" class="noemalTb th-header">
                起诉状
            </Col>
        </Row>
    </div>
    <Row class="bsDiv">
        <Col style="width:48%;float:left;box-shadow: 3px 3px 5px #DCDCDC;" >
            <Collapse v-model="catation3">
                <Panel name="1">电子起诉状(当事人在线立案填写提交后自动生成)
                    <div slot="content" class="elendi">
                        <zh-viewer :viewerId="'electronicsIndictment'" :fileUrls="electronicsIndictment"></zh-viewer>
                    </div>
                </Panel>
            </Collapse>
        </Col>
        <Col style="width:48%;float:right;box-shadow: 3px 3px 5px #DCDCDC;"> 
            <Collapse v-model="catation4">
                <Panel name="1">纸质起诉状（当事人上传扫描件）
                    <div slot="content" class="elendi">
                        <zh-viewer :viewerId="'paperIndictment'" :fileUrls="paperIndictment"></zh-viewer>
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
  indictment
} from "@/api/caseInfo"
export default {
    components:{
        ZhViewer
    },
    data(){
        return{
            catation3:'1',
            catation4:'1',
            isLoading: false,
            litigationRequest: '暂无数据',//诉讼请求
            reason: '暂无数据',//事实与理由
            electronicsIndictment: [],//电子起诉讼
            paperIndictment: [],//纸质起诉讼
        }
    },
    mounted(){
    },
    methods:{
        getIndictment(){
            this.isLoading = true;
            let that=this;
            indictment(this.changeMemberTab).then(res => {
                this.isLoading = false;
                if(res.data.state == 100){
                    let data = res.data.data;
                    this.litigationRequest = data.litigationRequest;
                    this.reason = data.reason;
                    this.electronicsIndictment=[];
                    this.paperIndictment=[];
                    if(data.electronicsIndictment){
                        this.electronicsIndictment.push(data.electronicsIndictment.addr);
                    }
                    
                    data.paperIndictment.forEach((item,index) => {
                        that.paperIndictment.push(item.addr);
                    });
                    console.log(this.paperIndictment)
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
    },
    computed: {
        changeMemberTab() {
        return this.$store.getters.caseId;
        }
    },
}
</script>