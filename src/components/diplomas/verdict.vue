<template>
   <div class="box">
       <div class="header">
             <h2>福建省厦门市思明区人民法院</h2>
             <h2>口头裁定笔录</h2>
       </div>
    <div>
     <Form>
          <Row>
            <Col span="8" push="14"  class="maininfo-col headerCase">
                <input type="text" v-model="backFill.caseNo">
            </Col>
         </Row>
         <div class="main">
            <div class="">时间：{{backFill.executeTime}}</div>
            <div class="">地点：莲前法庭办公室</div>
            <div class="">审判长：<div class="smallInput"><input type="text" v-model="backFill.judgeName"></div></div>
            <div class="">代书记员：<div class="smallInput" style=""><input type="text" v-model="backFill.otherClerkName"></div></div>
            <div class="">原告<div class="smallInput"><input type="text" v-model="backFill.plaintiffName"></div>与被告<div class="smallInput"><input type="text" v-model="backFill.defendantNameBriefName"></div>一案。</div>
            <div class="">到场人员：<div class="smallInput"><input type="text" v-model="backFill.plaintiffNameOrLawyerName"></div>。</div>
            <div>审：经本院合法传唤，被告均未到庭参加诉讼。原告是否还有其他方式可以向被告送达诉讼材料？原告是否还有其他方式可以向被告送达诉讼材料？</div>
            <div class=""><div class="smallInput"><input type="text" v-model="backFill.plaintiffNameOrLawyerName"></div>:现在无法联系到被告，找过被告但是没有找到。原告无法提供其他联系方式及地址。建议用公告方式向被告送达诉讼材料。</div>
            <div>审：根据法律规定，被告下落不明需要公告送达的，适用普通程序进行审理，现口头裁定本案由简易程序转为普通程序审理，由审判员姚亮担任审判长，与人民陪审员&emsp;&emsp;&emsp;&emsp;组成合议庭进行合议，是否清楚？</div>
            <div class=""><div class="smallInput"><input type="text" v-model="backFill.plaintiffNameOrLawyerName"></div>：清楚了，对合议庭组成人员无异议。</div>    
            <div>审：从今天开始你方还有二十天举证期限，是否清楚？</div>
            <div class=""><div class="smallInput"><input type="text" v-model="backFill.plaintiffNameOrLawyerName"></div>：清楚。</div>  
            <div>审：告知结束。</div>
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
        title:'口头裁定笔录'
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
              dbList(
                  litigantId.toString(),
                  panelList,
                this.backFill.caseNo,
                this.backFill.briefName,
                this.backFill.litigantName,
                this.backFill.startTime,
                this.backFill.tribunalAddress,
                this.backFill.contactPhone,
                this.backFill.judgeName,
                this.backFill.clerkName,
                this.backFill.noticeTime,
                this.backFill.plaintiffName,
                this.backFill.defendantName,
                this.backFill.defendantNameBriefName,
                this.backFill.litigantStatusName,
                this.backFill.allMembers,
                this.backFill.department,
                this.backFill.sendAddress,
                this.backFill.sendDiploms,
                this.backFill.costMoney,
                this.backFill.converCaseNo,
                this.backFill.plaintiffNamePhone,
                this.backFill.defendantNamePhone,
                this.backFill.plaintiffLawyerNamePhone,
                this.backFill.defendantLawyerNamePhone,
                this.backFill.closeDate,
                this.backFill.converStartDate,
                this.backFill.startDate,
                this.backFill.proofPeriod,
                this.backFill.filingDate,

                '',
                '',
                '',
                '',
                '',
                this.backFill.otherClerkName,
                this.backFill.plaintiffNameOrLawyerName,
              ).then(res=>{
               if(res.data.state == 100){
                    this.modelHid = false;
                     this.$emit('model',this.modelHid,res.data.result,this.title);
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
  .smallInput{
width: 44%; display:inline-block;border-bottom:1px solid black;text-align: center;
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