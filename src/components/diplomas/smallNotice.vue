<template>
   <div class="box">
       <div class="header">
             <h2>厦门市思明区人民法院</h2>
             <h2>小额诉讼须知</h2>
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
           </Row>
            
                <div class="textIndent">小额诉讼是对事实清楚、权利义务关系明确、争议不大且争议
标的额低于当年公布的小额诉讼案件金额标准的单一金钱给付之诉
的案件，以更低廉的诉讼成本，简便、快速审理的诉讼程序。</div>
                <div class="textIndent"><strong>一、小额诉讼的特点</strong> </div>
                <div class="textIndent">根据《中华人民共和国民事诉讼法》第一百六十二条之规定，
基层人民法院和它派出的法庭审理符合本法第一百五十七条第一款
规定的简单的民事案件，标的额为各省、自治区、直辖市上年度就
业人员年均工资百分之三十以下的，实行一审终审，当事人不得上
诉。</div>
                <div class="textIndent">二、旁听人员不得随便走动，不得进入审判区；</div>
                <div class="textIndent">
                   三、当事人和其他诉讼参与人不得中途退庭，未经审判长同
意，不得发言、提问，发言时应当起立，注意文明礼貌，不得攻
击、辱骂他人；
                </div>
                <div class="textIndent"> 四、未经法庭许可，任何人不得在法庭录音、摄影、录像；</div>
                <div class="textIndent">五、不准吸烟和随地吐痰；</div>
                <div class="textIndent">
                   六、关闭寻呼机、移动电话和其他通讯设备。对违反法庭纪
律的，法庭将给予口头警告、训诫，不听劝告的，经审
判长决定，可以没收录音、录像、摄影器材，责令退出
法庭，或者经院长批准予以罚款、拘留。对于哄闹、冲
击法庭等严重扰乱法庭秩序的人，依法迫究刑事责任。
                </div>
                <Row>
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