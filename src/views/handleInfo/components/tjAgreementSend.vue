<template>
 <div>
    <Form ref="searchForm" :label-width="200" class="search-form">
        <Form-item label="选择要上传/下载的文件类型">
          <div
            style="margin-right:20px;display:inline-block;"
            v-for="(item,index) in fileTypeList"
            @click="changeType(item)"
            :key="index"
          >
            <Button shape="circle" :class="item==active_name?'bg-blue':''">{{item}}</Button>
          </div>
        </Form-item>
        <Form-item label="上传文件" v-if="allowUp.indexOf(this.$store.getters.roLeName)>-1">
          <Upload
            action="/api/court/case/upLoadSdTj.jhtml"
            class="ft-plant-upload-button"
            :show-upload-list="false"
            ref="upload"
            :on-success="mAgent_uploadSuccess"
            :before-upload="mAgent_beforeUpload"
            :data="{fileType:active_name,lawCaseId:this.$store.getters.caseId}"
          >
            <Button type="ghost" icon="ios-cloud-upload-outline">上传{{active_name}}文件（world、pdf）</Button>
          </Upload>
        </Form-item>
        <Form-item label="下载文件" v-if="unAllowDown.indexOf(this.$store.getters.roLeName)==-1">
          <Button v-if="active_name=='调解协议' ?  this.tjFileUrl ? true : false : this.sendFileUrl ? true : false" shape="circle" style="width:190px;" type="primary" @click="download()">下载{{active_name}}文件</Button>
          <span>{{active_name=='调解协议' ?  this.tjFileUrl ? "" : "暂无文件" : this.sendFileUrl ? "" : "暂无文件"}}</span>
        </Form-item>
    </Form>
 </div>
</template>

<script>
import {
    downSdTj
} from "@/api/handleInfo";
import { tools_downLoad } from "@/libs/tools.js";
 export default {
   components: {

   },
   data () {
     return {
        fileTypeList:["调解协议","送达回证"],//文件类型列表
        active_name:"调解协议",//当前选中的类型
        tjFileUrl:"",
        sendFileUrl:"",
        allowUp:["庭长","法官助理","法官","书记员","法院调解员","机构调解员"],//允许上传文件的角色
        unAllowDown:[],//不允许下载文件的角色
     }
   },
   computed: {
     
   },
   methods: {
        init(){//初始化
          this.getDownloadUrl();
        },
        //切换文件类型
        changeType(name) {
            this.active_name = name;
        },
        //上传成功
        mAgent_uploadSuccess(res) {
            this.$Notice.destroy(); //关闭上传提示
            this.$Message.success("上传成功！");
            this.getDownloadUrl()//马上获取下载地址以供下载
            console.log(res)
        },
        //上传前
        mAgent_beforeUpload() {
            this.$refs.upload.clearFiles();
            this.$Notice.info({
                title: "正在上传文件请稍后...",
                duration: 0
            });
        },
        //获取调解协议和送达回证下载地址
        getDownloadUrl(){
           let lawCaseId=this.$store.getters.caseId;
           downSdTj({lawCaseId}).then((res)=>{
                console.log(res)
                if(res.data){
                  this.tjFileUrl=res.data[0].tiaojieUrl//调解协议
                  this.sendFileUrl=res.data[0].sondahuizhengUrl//送达回执
                }else{
                  this.tjFileUrl='';
                  this.sendFileUrl='';
                }
           })
        },
        download(){//下载文件
            let url="";
            switch (this.active_name) {
                case "调解协议":
                   url=this.tjFileUrl
                break;
                case "送达回证":
                   url=this.sendFileUrl
                break;
            }
            tools_downLoad(url)
        }
    }
 }
</script>

<style scoped>
.bg-blue {
  background: #2083d8;
  color: #ffffff;
}
.ivu-btn-primary {
  background-color: #2083d8 !important;
  border-color: #2083d8 !important;
}
.ft-plant-upload-button > .ivu-upload > button {
  background: #ffffff;
  color: black;
  width: 300px;
}
span.mProve-span {
  margin-left: 20px;
}
</style>
