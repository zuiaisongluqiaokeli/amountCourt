<template>
   <div class="box">
       <div class="header">
             <h2>福建省厦门市思明区人民法院</h2>
             <h2>委托送达函</h2>
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
                     &emsp;&emsp;我院受理原告
                    <div style="width: 35%; display:inline-block;border-bottom:1px solid black;"><input type="text" v-model="backFill.plaintiffName"></div>
                    与被告<div style="width:35%; display:inline-block;border-bottom:1px solid black;"><input type="text" v-model="backFill.defendantName"></div>
                    <div style="width:35%; display:inline-block;border-bottom:1px solid black;"><input type="text" v-model="backFill.briefName"></div>
                    一案，被告
                    <div style="width: 35%; display:inline-block;border-bottom:1px solid black;"><input type="text" v-model="backFill.defendantName"></div>
                    <div style="width: 35%; display:inline-block;border-bottom:1px solid black;"><input type="text" v-model="backFill.defendantLitigantAddress"></div>
                    户籍地在贵院辖区，故委托你院代为向其送达有关诉讼文书。随函附
                    <div style="width: 40%; display:inline-block;border-bottom:1px solid black;"><input type="text" v-model="backFill.defendantDiplomsNameList"></div>
                    各壹份，在收到后10日内代为向被告送达，并将送达证及经其签名盖章确认的送达地址确认书寄回给我院立案庭或来函告知送达结果。
                    
                </div>
                <Row>
                    <Col span="8" push="18" class="maininfo-col headerCase">
                        <p>{{backFill.noticeTime}}</p>
                    </Col>
                </Row>
                <Row>
                    <Col span="3"  class="maininfo-col headerCase">
                        经办人：
                    </Col>
                    <Col span="5" class="maininfo-col headerCase">
                        <input type="text" v-model="backFill.judgeNamePhone">
                    </Col>
                </Row>
                <Row>
                    <Col span="3"  class="maininfo-col headerCase">
                        邮寄地址：
                    </Col>
                    <Col span="8" class="maininfo-col headerCase">
                        <input type="text" v-model="backFill.judgeReviceAddress">
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
        title:'委托送达函'
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
                 this.backFill.filingDate
              ).then(res=>{
               if(res.data.state == 100){
                    this.modelHid = false;
                     this.$emit('model',this.modelHid,res.data.result,this.title);
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
      text-align: center;
    border-bottom: 1px solid black; 
    display: inline-block;
    width: 10%;
  }
     input{
      width: 100%;
      height: 30px;
      border: none;
      font-size: 15px;
      text-align: center;
  }
</style>