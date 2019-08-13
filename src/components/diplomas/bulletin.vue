<template>
   <div class="box">
       <div class="header">
             <h2>福建省厦门市思明区人民法院</h2>
             <h2>公&emsp;&emsp;告</h2>
       </div>
    <div>
     <Form>
          <Row>
                <Col span="8" push="14"  class="maininfo-col headerCase">
                   <input type="text" v-model="backFill.caseNo" style="width: 140%;font-size: 12px;">
                </Col>
               
         </Row>
         <div class="main">
            <Row>
                <!-- <Col span="8" class="maininfo-col headerCase"> -->
                   <div style="width: 22%; display:inline-block;border-bottom:1px solid black;text-align: center;"><input type="text" v-model="backFill.defendantName"></div>：
                <!-- </Col> -->
           </Row>
            
                <div class="lineHeight">
                     &emsp;&emsp;本院受理
                    <div class="minInput"><input type="text" v-model="backFill.plaintiffName"></div>
                    诉你方<div class="minInput"><input type="text" v-model="backFill.briefName"></div>
                    一案，<div class="minInput"><input type="text" v-model="backFill.plaintiffName"></div>请求判令：
                
                </div>
                <div style="min-width:100%;max-width:150%; display:inline-block;text-align: center;"  v-model="backFill.requestContent"><textarea style="width: 100%;height: 100px;margin: 10px;resize:none" name="" id="" cols="30" rows="10"  v-model="backFill.requestContent"></textarea></div>
                
                因<div style="width: 35%; display:inline-block;border-bottom:1px solid black;text-align: center;"><input type="text" v-model="backFill.you"></div>下落不明，现依法向
                <div style="width: 35%; display:inline-block;border-bottom:1px solid black;text-align: center;"><input type="text" v-model="backFill.you"></div>公告送达
                <div style="min-width:100%;max-width:150%; display:inline-block;text-align: center;"  ><textarea style="width: 100%;    padding: 10px;height: 100px;margin: 10px;resize:none" name="" id="" cols="30" rows="10"  v-model="backFill.diplomsListJoin"></textarea></div>。自本公告发出之日起，经过60日即视为送达。提出答辩状和举证的期限分别为公告期满后的15日和30日内，并定于举证期满后的次日上午8时45分（遇节假日顺延），在福建省厦门市思明区人民法院莲前人民法庭第二法庭公开开庭审理，逾期将依法裁判。
                <div class="textIndent">特此公告。</div>
 
                <Row>
                    <Col span="8" push="18" class="maininfo-col headerCase" style="margin-top:36px;">
                        <p>{{backFill.noticeTime}}</p>
                        <!-- <p>（院印）</p> -->
                    </Col>
                </Row>
                <div class="textIndent">法院联系人：<div style="text-indent: 0em;;width: 15%; display:inline-block;text-align: center;">{{backFill.otherClerkName}}</div> 电话：<div style="text-indent: 0em;;width: 15%; display:inline-block;text-align: center;">{{backFill.otherClerkPhone}}</div></div>
                <div class="textIndent"><div style="text-indent: 0em;;width: 65%; display:inline-block;border-bottom:1px solid black;text-align: center;"><input style="text-align:left" type="text" v-model="backFill.plaintiffNameOrLawyerNameAndPhone"></div></div>
                <div class="textIndent">邮寄样报地址：<div style="text-indent: 0em;;width: 65%; display:inline-block;text-align: center;">{{backFill.courtAddressAndcourtAllName}}</div></div>
                <div class="textIndent">法院莲前人民法庭。邮编：<div style="text-indent: 0em;;width: 15%; display:inline-block;text-align: center;">{{backFill.codeNumber}}</div></div>
                <div class="textIndent">备注：公告限领取之日起七日内前往报社联系刊登，逾期按规定依法处理。</div>
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
        title:'公告'
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
                
                this.backFill.requestContent,
                this.backFill.diplomsListJoin,
                this.backFill.you,
                this.backFill.otherProofPeriod,
                this.backFill.plaintiffNameOrLawyerNameAndPhone,
                
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
  .minInput{
width: 35%; display:inline-block;border-bottom:1px solid black;text-align: center;
  }
</style>