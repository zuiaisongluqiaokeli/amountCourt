<template>
  <div class='ft-electarch-main'>
    <div class='ft-elect-index'>
      <div class='ft-elect-index-header'>卷宗目录</div>
      <div class='ft-elect-index-content'>
        <ul class='ft-elect-li'>
          <li v-for="(item,key) in ft_elect_indexList"
          :key="key"
          :class="ft_elect_Indexactive==key?'ft-elec-book-li-active':''"
          @click="ft_elect_chgIndex(key)"
          >{{item.dirTypeName}}</li>
        </ul>
      </div>
    </div>
    <div class='ft-elect-list'>
      <div class='ft-elect-index-header'>文书列表</div>
      <div class='ft-elect-index-header-content'>
        <ul v-show='ft_elec_hasBook===2'>
          <li
          v-for="(val,index) in ft_elect_fileList"
          :key="index"
          class="ft-elec-books-li"
          :class="ft_elect_active==index?'ft-elec-book-li-active':''"
          @click="ft_elect_viewBooks(val,index)"
          >{{val.fileName}}</li>
        </ul>
        <h5
        class="ft-elec-books-li"
        v-show='ft_elec_hasBook===0'
        >暂无文书</h5>
        <h5
        class="ft-elec-books-li"
        v-show='ft_elec_hasBook===1'
        >暂无材料</h5>
      </div>
    </div>
    <div class='ft-elect-showArea'>
      <!-- <iframe :src="ft_elect_pdfViewer" frameborder="0" width="100%" height="600px"></iframe> -->
      <zh-viewer :viewerId="'file'" :fileUrls="ft_elect_pdfViewer" @setNowItem="setNowItem"></zh-viewer>
    </div>
  </div>
</template>



<script>
import { ft_getElecArchInfo,fileList,textwww,decDiploms } from "@/api/casetemp.js";
import ZhViewer from "@/components/moreFileViewer/moreFileViewer.vue";
export default {
  components: {
    ZhViewer
  },
  data () {
    return {
      ft_elect_Indexactive:0,
      ft_elect_active:0,
      ft_elec_hasBook:1,
      ft_elect_pdfViewer:[],
      ft_elect_indexList:[],
      ft_elect_fileList:[],
    }
  },

  computed :{
    ft_Elect_isDevEnv () {
      let Envpro = location.protocol;
      let EnvdoName = location.host;
      let requestUrl = Envpro+'//'+EnvdoName
      return requestUrl;
    },
  },
  methods:{
    //初始化
    ft_elec_init(){
      this.ft_elec_hasBook =1;
      this.ft_elect_Indexactive = 0;
      this.ft_elect_pdfViewer = [];
      this.$Message.loading({content: '正在加载文件目录,请稍后...', duration: 0});
      //获取目录
      let params = {
        lawCaseId:this.$store.getters.caseId
      }
      fileList(params).then(res=>{
        this.$Message.destroy();
        if(res.data.state === 100) {
          this.ft_elect_indexList=res.data.data;
          this.ft_elect_chgIndex(0);//默认选中第一个文件目录
        }else{
          this.$Message.error(res.data.message);
        }
      });
    },
    //处理数据
    ft_elec_dealList(payload) {
      console.log(payload)
      this.ft_elect_fileList = payload;
      this.getfile_url(payload[0].fileId);//默认获取第一个文件url
    },
    //查看文件
    ft_elect_viewBooks(val,index) {
      this.ft_elect_active = index;
      this.getfile_url(val.fileId);
    },
    //获取解密文件路径
    getfile_url(id){
      this.$Message.loading({content: '正在打开文件,请稍后...', duration: 0});
      decDiploms({fileId:id}).then(res=>{
        this.$Message.destroy();
        if(res.data.state === 100) {
          let data=res.data.data;
          //保证每次添加不重复
          if(this.ft_elect_pdfViewer.indexOf(data.result)>-1){
            console.log("99999",this.ft_elect_pdfViewer.indexOf(data.result))
            let index=this.ft_elect_pdfViewer.indexOf(data.result);
            this.ft_elect_pdfViewer.splice(index,1)
          }
          this.ft_elect_pdfViewer.push(data.result);
        }else{
          this.$Message.error(res.data.message);
        }
      });
    },
    setNowItem(nowUrl){//设置当前选中项
      //提取文件名
      let fileName=nowUrl.split('/')[nowUrl.split('/').length-1]
      console.log(fileName)
      console.log(this.ft_elect_fileList)
      //查找数组对象属性中相同文件名的索引
      this.ft_elect_active= this.ft_elect_fileList.findIndex((value, index, arr) => {
        return value.fileName==fileName
      })
    },
    //更改案宗目录
    ft_elect_chgIndex(index) {
      this.ft_elect_Indexactive = index;
      this.ft_elect_pdfViewer=[];
      console.log(this.ft_elect_indexList)
      if(this.ft_elect_indexList[index].caseFileList.length !== 0) {
        this.ft_elect_active = 0;
        this.ft_elec_hasBook=2;
        this.ft_elec_dealList(this.ft_elect_indexList[index].caseFileList);
      }else{
        this.ft_elec_hasBook=0;
      }
    }
  }
}
</script>

<style>
  .ft-electarch-main {
    width: 100%;
    height: 600px;
    margin-bottom: 20px;
  }

  .ft-elect-index {
    width: 18%;
    height: 600px;
    float: left;
    margin:0 10px 0 0;
    border: 1px solid #dddee1;
    border-color: #e9eaec;
  }

  .ft-elect-index-content {
    width: 100%;
    height: calc(600px - 40px);
  }

  .ft-elect-index-header-content{
    width: 100%;
    height: calc(600px - 40px);
    overflow-y: scroll;
  }
  .ft-elect-list {
    width: 18%;
    height: 600px;
    float: left;
    margin:0 20px 0 20px;
    border: 1px solid #dddee1;
    border-color: #e9eaec;
  }
  .ft-elect-showArea{
    width: 60%;
    height: 600px;
    float: left;
    border: 1px solid #dddee1;
    border-color: #e9eaec;
  }

  .ft-elect-index-header {
    width:100%;
    height: 40px;
    text-align: center;
    font-size: 16px;
    line-height: 40px;
    color: #fff;
    background: #4873C5;
  }

  .ft-elect-li li{
    width: 100%;
    cursor: pointer;
    font-size: 16px;
    padding: 10px;
    margin: 10px auto 10px auto;
  }

  .ft-elect-li li:hover{
    background: #4873C5;
    color:#fff;
    cursor: pointer;
    transition: .2s all linear;
  }

  .ft-elec-books-li{
    text-indent: 10px;
    font-size: 14px;
    padding-top: 5px;
    padding-bottom: 5px;
    cursor: pointer;
    margin-top:10px;
  }

  .ft-elec-books-li:hover{
    background: #4873C5;
    color:#fff;
    cursor: pointer;
    transition: .2s all linear;
  }

  .ft-elec-book-li-active {
    background: #4873C5;
    color: #fff;
  }
</style>
