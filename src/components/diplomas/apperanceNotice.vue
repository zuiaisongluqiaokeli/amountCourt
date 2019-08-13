<template>
   <div class="box">
       <div class="header">
             <h2>福建省厦门市思明区人民法院</h2>
             <h2>应诉通知书</h2>
       </div>
    <div>
     <Form>
          <Row>
                <Col span="8" push="14"  class="maininfo-col headerCase">
                   <input type="text" v-model="backFill.caseNo">
                </Col>
               
         </Row>
         <div class="main">
            <Row>
                <!-- <Col span="8" class="maininfo-col headerCase"> -->
                   <div style="width: 22%; display:inline-block;border-bottom:1px solid black;text-align: center;"><input type="text" v-model="backFill.litigantName"></div>：
                <!-- </Col> -->
           </Row>
            
                <div class="lineHeight">
                     &emsp;&emsp;
                    本院已受理&emsp;<div style="width: 35%; display:inline-block;border-bottom:1px solid black;text-align: center;"><input type="text" v-model="backFill.plaintiffName"></div>
                    与<div style="width: 35%; display:inline-block;border-bottom:1px solid black;text-align: center;"><input type="text" v-model="backFill.defendantBriefName"></div>
                    一案，现随文发送起诉状副本一份，并将有关应诉事项通知如下：
                </div>
                <div class="textIndent"> 一、在诉讼进程中，当事人必须依法行使诉讼权利，有权行使
民事诉讼法第四十九条、第五十条、第五十一条等规定的诉讼权利
，同时也必须遵守诉讼秩序，履行诉讼义务。 </div>
                <div class="textIndent"> 二、在收到起诉状副本后七日内提出答辩状（正本一份，副本
<div style="width: 5%; display:inline-block;border-bottom:1px solid black;text-align: center;"><input type="text" style="margin-left: -30px;" v-model="backFill.indictmentNumber"></div>份），送交本院金融和互联网法庭。如不按时提交答辩状，不影响
本案的审理。</div>
                <div class="textIndent">三、如需委托代理人代为诉讼，还应递交由委托人签名或者盖
章的授权委托书。授权委托书须几名委托事项和权限。</div>
                
 
                <Row>
                    <Col span="8" push="18" class="maininfo-col headerCase" style="margin-top:36px;">
                        <p>{{backFill.noticeTime}}</p>
                    </Col>
                </Row>
         </div>
         
       </Form>
     
     </div> 
   </div>

</template>

<script type="text/javascript">
import { dbList } from '@/api/diplomas.js';
export default {
    data(){
        return{
        //   backFill:{
        //         caseNo:'',
        //         briefName:'',
        //         litiganName:'',
        //         startTime:'',
        //         tribunalAddress:''

        //     }
        modelHid:true,
        title:'应诉通知书'
        }
    },
     props: {
        backFill:[Array,Object]
    },
    methods: {
           
        dipPro(litigantId,panelList){
            // var _this = this;
            // console.log(panelList);
            // console.log('组件调用')  
            let data = {
                litigantId:litigantId,
                buildDiplomsName:panelList,
                caseNo:this.backFill.caseNo,
                litigantName:this.backFill.litigantName,
                plaintiffName:this.backFill.plaintiffName,
                defendantBriefName:this.backFill.defendantBriefName,
                indictmentNumber:this.backFill.indictmentNumber
            }
            console.log(data)
              dbList(
                  data
              ).then(res=>{
               if(res.data.state == 100){
                    this.modelHid = false;
                     this.$emit('model',this.modelHid,res.data.data.path,this.title);
               }else{
                   this.$Message.info(res.data.message);  
               }
          }).catch(() => {
                this.$Message.error('网络错误，生成失败。');  
            });
        }
        
    }
}

</script>
<style lang="less" scoped>
  .box{
      margin: 0 auto;
      width: 700px;
      height: 100%;
      display: block;
    font-size: 15px;
  }
  .header{
      width:100%;
      text-align: center;
  }
  .main{
      width: 100%;
      height: 100%;
  }
.headerCase{
    border:none !important;
    background-color: white !important;
}
 .textIndent{
      text-indent:2em;  
  }
.lineHeight{
    line-height: 26px;
}
.ivu-form-item{
    margin-bottom:11px;
}
  .underline100{
    border-bottom: 1px solid black; 
    display: inline-block;
    width: 5%;
  }
    input{
      width: 100%;
      height: 30px;
      border: none;
      font-size: 15px;
      text-align: center;
  }
</style>