<template>
  <div class='ft-plant-div1'>
    <div class="ft-plant-div2">
      <Form :model="eviList" label-position="right" :label-width="190" :rules="eviList" ref="eviFromRule" style="margin:50px auto;width:920px">
          <!-- <FormItem label="证据列表" class="ft_form ft-plant-chooseType ft-plant-slectType">
              <Tag v-for="(item,key) in eviCount" color="#2F60BD" :key="key">证据{{key+1}}</Tag>
          </FormItem>
          <FormItem label="证据名称" class="ft_form ft-plant-chooseType ft-plant-slectType" prop="evidenceName">
            <Input v-model="eviList.evidenceName" placeholder="请输入证据名称"></Input>
          </FormItem>

          <FormItem label="证明对象" class="ft_form ft-plant-chooseType" prop="evidenceTarget">
              <Input v-model="eviList.evidenceTarget" placeholder="请输入证明对象"></Input>
          </FormItem>

          <FormItem label="证据来源" class="ft_form ft-plant-chooseType" prop="evidenceSource">
            <Input v-model="eviList.evidenceSource" placeholder="请输入证据来源"></Input>
          </FormItem>

          <FormItem label="页数" class="ft_form ft-plant-chooseType" prop="pagesNum">
              <Input v-model="eviList.pagesNum" placeholder="请输入页数"></Input>
          </FormItem> -->

          <!-- <FormItem label="证据文件" class="ft_form ft-plant-chooseType  ft-plant-upload"  prop="evidenceFile">
              <span>{{evi_fileName}}</span>
              <Input v-model="eviList.evidenceFile" placeholder="请上证据文件" style="visibility:hidden;"></Input>
              <Upload action="/api/court/case/upScanning.jhtml" :data="{fileType:'证据文件'}" class="ft-plant-upload-button" :on-success="evi_uploadSuccess">
                  <Button type="ghost" icon="ios-cloud-upload-outline">选择文件</Button>
              </Upload>
          </FormItem> -->

          <FormItem label="证明被告主体信息类证据" :label-width="300" class="ft_form ft-plant-chooseType  ft-plant-upload"  prop="evidenceFile">
              <Upload action="/api/court/case/upScanning.jhtml"  :show-upload-list="false" :data="{fileType:'证据文件1'}" :multiple="true" class="ft-plant-upload-button" :before-upload="sucai_UpBefore" :on-success="evi_uploadSuccess">
                  <Button type="ghost" style="width:200px" icon="ios-cloud-upload-outline">选择文件（可多选）</Button>
                  <span>请上传*.jpg/png/bmp/pdf后缀格式的文件</span>
              </Upload>
          </FormItem>
          <FormItem>
            <div v-for="item in evi_fileName1"><span class="fileName">{{item}}</span><a @click='delFile("file1",item)'>删除</a></div>                
          </FormItem>
         

          <FormItem label="证明借贷及担保关系存在的证据" :label-width="300" class="ft_form ft-plant-chooseType  ft-plant-upload"  prop="evidenceFile">
              <Upload action="/api/court/case/upScanning.jhtml"  :show-upload-list="false" :data="{fileType:'证据文件2'}" :multiple="true" class="ft-plant-upload-button" :before-upload="sucai_UpBefore" :on-success="evi_uploadSuccess">
                  <Button type="ghost" style="width:200px" icon="ios-cloud-upload-outline">选择文件（可多选）</Button>
                  <span>请上传*.jpg/png/bmp/pdf后缀格式的文件</span>
              </Upload>
          </FormItem>
          <FormItem>
            <div v-for="item in evi_fileName2"><span class="fileName">{{item}}</span><a @click='delFile("file2",item)'>删除</a></div>                
          </FormItem>

          <FormItem label="证明放款、还款及最新欠款金额的证据" :label-width="300" class="ft_form ft-plant-chooseType  ft-plant-upload"  prop="evidenceFile">
              <Upload action="/api/court/case/upScanning.jhtml"  :show-upload-list="false" :data="{fileType:'证据文件3'}" :multiple="true" class="ft-plant-upload-button" :before-upload="sucai_UpBefore" :on-success="evi_uploadSuccess">
                  <Button type="ghost" style="width:200px" icon="ios-cloud-upload-outline">选择文件（可多选）</Button>
                  <span>请上传*.jpg/png/bmp/pdf后缀格式的文件</span>
              </Upload>
          </FormItem>
          <FormItem>
            <div v-for="item in evi_fileName3"><span class="fileName">{{item}}</span><a @click='delFile("file3",item)'>删除</a></div>                
          </FormItem>

          <FormItem label="证明实现债权费用的证据" :label-width="300" class="ft_form ft-plant-chooseType  ft-plant-upload"  prop="evidenceFile">
              <Upload action="/api/court/case/upScanning.jhtml"  :show-upload-list="false" :data="{fileType:'证据文件4'}" :multiple="true" class="ft-plant-upload-button" :before-upload="sucai_UpBefore" :on-success="evi_uploadSuccess">
                  <Button type="ghost" style="width:200px" icon="ios-cloud-upload-outline">选择文件（可多选）</Button>
                  <span>请上传*.jpg/png/bmp/pdf后缀格式的文件</span>
              </Upload>
          </FormItem>
          <FormItem>
            <div v-for="item in evi_fileName4"><span class="fileName">{{item}}</span><a @click='delFile("file4",item)'>删除</a></div>                
          </FormItem>

          <FormItem>
             <div style="height: 0px;border-top: 2px dashed #4873C5;width: 850px;margin-left: -203px;"></div>                
          </FormItem>
          
          <FormItem label="诉前案件材料" :label-width="300" class="ft_form ft-plant-chooseType  ft-plant-upload"  prop="evidenceFile">
              <Upload action="/api/court/case/importEvidence.jhtml" :data="{fileType:'诉前案件材料'}" :show-upload-list="false" class="ft-plant-upload-button" :before-upload="sucai_UpBefore" :on-success="suqian_uploadSuccess">
                  <Button type="ghost" style="width:200px" icon="ios-cloud-upload-outline">选择文件（压缩包单文件）</Button>
              </Upload>
              <span class="fileName" style="width:70px;line-height: 10px;">{{evi_fileName5}}</span><a v-if="evi_fileName5=='已上传'" @click="delFile('file5')">删除</a>
          </FormItem>
          <!-- <FormItem>
            <div class='ft_public1'>
              <a href="javascript:void(0)" style="" class="ft_public2" @click="ft_evi_addEvidence('eviFromRule')">添加证据</a>
              <a href="javascript:void(0)" style="" class="ft_public2" @click="ft_evi_NewaddEvidence('eviFromRule')">添加证据</a>
            </div>
          </FormItem> -->
      </Form>
      <div class='ft-agent-footer'>
        <a href="javascript:void(0)" class="ft-agent-btn1" style="margin-left:-110px" @click="ft_evi_backTostep3">返回上一步</a>
        <a href="javascript:void(0)" class="ft_public3" @click="ft_evi_toStep5">下一步，浏览与暂存</a>
      </div>
    </div>
  </div>
</template>


<script>
import evidenceRule from './evidence.js';
export default {
  data () {
    return {
      eviList:evidenceRule.eviList,
      eviCount:[], //证据列表
      evi_fileName:'',
      evi_fileName1:[],
      evi_fileName2:[],
      evi_fileName3:[],
      evi_fileName4:[],
      evi_fileName5:'未上传',
      eviFileList:[], //证据文件列表
      eviFileList1:[],
      eviFileList2:[],
      eviFileList3:[],
      eviFileList4:[],
      eviFileList5:[],

    }
  },
  methods:{
    //上传成功事件
    // evi_uploadSuccess (response,file,fileList) {
    //   if(response.state === 100) {
    //     this.$Message.success('上传成功!');
    //     this.eviList.evidenceFile = response.data.filePath;
    //     this.eviList.fileName = response.data.fileName;
    //     this.evi_fileName = response.data.fileName;
    //     let eviFile = {
    //       fileName:response.data.fileName,
    //       evidenceFile: response.data.filePath,
    //     }
    //     this.eviFileList.push(eviFile);
    //   }else{
    //     this.$Notice.error({'title':response.message})
    //   }
    // },
   
    //上传成功事件
    evi_uploadSuccess (response,file,fileList) {
      this.$Notice.destroy()
      if(response.state === 100) {
        this.$Message.success('上传成功!');
        let data=response.data.result[0];
        let fileName=data.fileName;
        let filePath=data.filePath;
        let eviFile = {
          fileName:fileName,
          evidenceFile:filePath,
        }
        switch (data.fileType) {
          case "证据文件1":
            this.evi_fileName1.push(fileName);
            this.eviFileList1.push(eviFile);
          break;
          case "证据文件2":
            this.evi_fileName2.push(fileName);
            this.eviFileList2.push(eviFile);
          break;
          case "证据文件3":
            this.evi_fileName3.push(fileName);
            this.eviFileList3.push(eviFile);
          break;
          case "证据文件4":
            this.evi_fileName4.push(fileName);
            this.eviFileList4.push(eviFile);
          break;
        }
      }else{
        this.$Notice.error({'title':response.message,duration: 5})
      }
    },
    //诉前案件材料上传前事件
    sucai_UpBefore(){
      this.$Notice.info({'title':"正在上传文件，请稍后...！",duration: 0})
    },
    //诉前案件材料上传成功事件
    suqian_uploadSuccess (response,file,fileList) {
      this.$Notice.destroy()
      if(response.state === 100) {
        this.$Notice.success({'title':'上传成功!'});
        let data=response.data;
        this.evi_fileName5="已上传";
        this.eviFileList5=data;
      }else{
        this.$Notice.error({'title':response.message,duration: 5})
      }
    },
    //删除文件
    delFile(type,name){
      switch(type){
        case "file1":
          this.evi_fileName1.forEach((item,index) => {
            if(item==name){
              this.evi_fileName1.splice(index,1);
              this.eviFileList1.splice(index,1);
            }
          });
        break;
        case "file2":
          this.evi_fileName2.forEach((item,index) => {
            if(item==name){
              this.evi_fileName2.splice(index,1);
              this.eviFileList2.splice(index,1);
            }
          });
        break;
        case "file3":
          this.evi_fileName3.forEach((item,index) => {
            if(item==name){
              this.evi_fileName3.splice(index,1);
              this.eviFileList3.splice(index,1);
            }
          });
        break;
        case "file4":
          this.evi_fileName4.forEach((item,index) => {
            if(item==name){
              this.evi_fileName4.splice(index,1);
              this.eviFileList4.splice(index,1); //删除文件列表
            }
          });
        break;
        case "file5":
          this.evi_fileName5='未上传';
          this.eviFileList5=[]; //删除文件列表
        break;
      }
    },
    //上传证据
    // ft_evi_addEvidence (name) {
    //   this.$refs[name].validate(valid =>{
    //     if (valid) {
    //         //数据处理
    //         let hasconfrimEvidence = Object.assign({},this.eviList); //防止object浅复制
    //         delete hasconfrimEvidence['evidenceFile'];
    //         delete hasconfrimEvidence['fileName'];
    //         Array.from([],hasconfrimEvidence.file);
    //         hasconfrimEvidence.file = this.eviFileList; //防止array浅复制
    //         this.eviCount.push(hasconfrimEvidence);
    //         //清空数据
    //         this.$Notice.success({'title':'添加成功'});
    //         this.$refs.eviFromRule.resetFields();
    //         this.eviFileList = [];
    //         this.evi_fileName = '';
    //     }else{
    //       this.$Notice.warning({'title':'请完善证据信息'})
    //     }
    //   })
    // },

    //上传证据
    ft_evi_NewaddEvidence(eviList,eviFileList){
      //数据处理
      let hasconfrimEvidence = eviList;
      hasconfrimEvidence.file = eviFileList;
      this.eviCount.push(hasconfrimEvidence);
      console.log(this.eviCount)
    },
    //前往第五步
    ft_evi_toStep5 () {
      this.eviCount=[];
      this.ft_evi_NewaddEvidence({evidenceName: '证明被告主体信息类证据'},this.eviFileList1);
      this.ft_evi_NewaddEvidence({evidenceName: '证明借贷及担保关系存在的证据'},this.eviFileList2);
      this.ft_evi_NewaddEvidence({evidenceName: '证明放款、还款及最新欠款金额的证据'},this.eviFileList3);
      this.ft_evi_NewaddEvidence({evidenceName: '证明实现债权费用的证据'},this.eviFileList4);
      console.log(this.eviCount,this.eviFileList5);
      this.$emit('toNextStep',{type:'证据信息',state:'next',eviCount:this.eviCount,suqianCaiLiao:this.eviFileList5});
    },

    //返回第三步
    ft_evi_backTostep3 () {
      this.$emit('toNextStep',{type:'证据信息',state:'back',eviCount:this.eviCount,suqianCaiLiao:this.eviFileList5});
    },

    //清空表单
    ft_step5_restForm () {
      this.$refs['eviFromRule'].resetFields();
      this.evi_fileName = '';
      this.eviFileList = [];
      this.eviCount = [];
    }

  }
}
</script>

<style scoped>
 @import './evidence.css';
 @import '../../casecommon/casereset.css';
</style>

