<style scoped>
    .expand-row{
        margin-bottom: 5px;
    }
</style>
<template>
    <div style="height:95%">
        <Card style="margin-bottom:10px;text-align:center;height:95%;" >
            <div style="text-align:center;margin-bottom:10px">
                <h2>庭前会议笔录</h2>
            </div>
            <div style="height:80%;overflow-y:scroll;padding:20px 30px;border:2px solid #A6C7FF;text-align:left" contenteditable="true" v-html="content" ref="allInfo">
</div>
        <div style="margin-top:10px">
            <Button @click="save" style="margin-left:15px" type="info">保存</Button>
            <Button @click="show" style="margin-left:15px" type="info">发布</Button>
        </div>
    </Card>
        <Modal
            v-model="modalAdd"
            title="补充争议焦点"
            :loading="loading"
            cancel-text=""
            ok-text="提交"
            @on-ok="asyncOK">
            <Input name="fouce" v-model="value8" type="textarea" :autosize="{minRows: 4,maxRows: 5}" placeholder="争议焦点"></Input>
        </Modal>
    </div>
</template>
<script>
import myUpload from '../upload';
import { fouceList, getNotes, editRecord, publishRecord } from "@/api/courtWitness/lawCase.js";
export default {
    components: {
        myUpload
    },
    created: function() {
        console.log(222);
    },
    data() {
        return{
            caseLoading: false,
            disabled:true,
            dex:false,
            content:"",
            disabled2:true,
            linightDex:true,
            loading:false,
            modalAdd:false,
            value8:'',
            conId:'',
            allInfo:"",
            plaintiffList: [],
            defendantList: [],
            thirdList: [],
            linightInfo:"",
            suggessInfo:"",
            revertsInfo:"",
            fonceInfo:"",
            agreeInfo:"",
            plaintiff:"",
            plaintifflawyer:"",
            defendant:"",
            record:false,
            title:"",
            caseInfo: {
                id: "",
                caseNo: "",
                court: "",
                judge: "",
                clerk: "",
                filingDate: "",
                expireDate: "",
                brief: "",
                applyStandard: "",
                allMembers: ""
            },
            addFormItem:{
                evidenceName:'',
                pageNum:'',
                evidenceObject:'',
                evidenceWhere:''
            },
            title:""
        }       
    },
    props: {
    },
    computed: {
        lowCaseId () {
            return this.$store.getters.caseId
        }
    },
    methods:{
        save(){
            var str = this.$refs.allInfo.innerHTML;
            str = str.replace('<div>',"<br/>");
            str = str.replace(/<div>/g," ");
            str = str.replace(/nbsp;/g," ");
            str = str.replace(/<\/div>/g,"<br/>");
            str = str.replace(/<br>/g,"<br/>");
            var sasd = '<span style="text-align: right;>';
            str = str.replace(/<span style="text-align: right;">/g," ");
            str = str.replace(/<\/span>/g,"<br/>");
            // console.log(this.$refs.allInfo.innerText.replace(" ", "\n"));
            editRecord(this.conId, str).then(res => {
                if (res.data.state == 100) {
                    // this.evidenceInfo.evidenceId = res.data.result.evidenceId
                    this.$Message.success(res.data.message);
                } else {
                    this.$Message.error(res.data.message);
                }
            })
        },
        show(){
            publishRecord(this.conId).then(res => {
                if (res.data.state == 100) {
                    // this.evidenceInfo.evidenceId = res.data.result.evidenceId;
                    this.$Message.success(res.data.message);
                } else {
                    this.$Message.error(res.data.message);
                }
            })
        },
      edite(){
        if(this.disabled==true){
          this.disabled = false;
        }else{
          this.disabled = true;
        }
        
      },
      showMod(){
          this.modalAdd = true;
      },
      printer(){
          console.log(this.$refs.allInfo.innerText)
          console.log(this.$refs.allInfo.innerText.replace(" ", "\n"));
      },
      getNote(){
        getNotes(this.lowCaseId).then(res => {
            if(res.data.state == 100){
                this.conId = res.data.result.id;
                this.content = res.data.result.content;
                console.log(this.content)
                if(res.data.result.isShow == false){
                    this.record = true;
                }else{
                    this.record = false;
                }
            }else{
                this.$Message.error(res.data.message);
            }
        })
      },
      edite2(){
        if(this.disabled2==true){
          this.disabled2 = false;
        }else{
          this.disabled2 = true;
        }
        
      },
      uploadSuccess (response) {
            if (response.state == 100) {
                this.evidenceInfo.evidenceId = response.result.evidenceId
            } else {
                this.$Message.error(response.message);
            }
        },
      asyncOK(){

      }
    }
};
</script>
<style>
.labe{
    display: inline-block;
    /* text-align: left; */
    margin-left:80px;
}
.ivu-card-body{
    height:100%
}
</style>
