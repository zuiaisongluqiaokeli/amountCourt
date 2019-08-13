<template>
   <div class="box">
       <div class="header">
             <h2>福建省厦门市思明区人民法院</h2>
             <h2>受理案件通知书</h2>
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
                    <div style="width: 30%; display:inline-block;border-bottom:1px solid black;"><input type="text" v-model="backFill.litigantName"></div>：
                <!-- </Col> -->
           </Row>
            
                <div class="lineHeight">
                     &emsp;&emsp;
                    <div style="width: 35%; display:inline-block;border-bottom:1px solid black;"><input type="text" v-model="backFill.plaintiffName"></div>
                    诉与<div style="width: 35%; display:inline-block;border-bottom:1px solid black;"><input type="text" v-model="backFill.defendantBriefName"></div>
                    一案的
起诉状已收到。经审查，起诉符合法定受理条件，本院决定立案审
理，现将有关事项通知如下：
                </div>
                <div class="textIndent">一、在诉讼进程中，当事人必须依法行使诉讼权利，有权行使
民事诉讼法第四十九条、第五十条、第五十一条等规定的诉讼权利，
同时也必须遵守诉讼秩序，履行诉讼义务。</div>
                <div class="textIndent">二、如需委托代理人代为诉讼，应递交由委托人签名或盖章的
授权委托书。授权委托书应载明委托事项和权限（单位应递交由法
定代表人签名并加盖公章的授权委托书），委托除律师及基层法律服
务工作者外的其他公民个人的，应携带相关证明到法院当场办理委
托手续或者递交由公证机关公证的授权委托手续。</div>
                <div> &emsp;&emsp;三、应在接到本通知书后七日内，向厦门市思明区人民法院预
交案件受理费 <div style="width: 8%; display:inline-block;border-bottom:1px solid black;"><input type="text" v-model="backFill.handleCost"></Input></div>元，逾期按自动撤回起诉处理。</div>
                <div class="textIndent">
                   四、根据《最高人民法院关于人民法院在互联网公布裁判文书
的规定》的规定，生效裁判文书将在《中国裁判文书网》公布。
                </div>
 
                <Row>
                    <Col span="8" push="18" class="maininfo-col headerCase" style="margin-top:36px;">
                        <!-- <p>{{backFill.noticeTime}}</p> -->
                        <p>&nbsp;&nbsp;年 &nbsp;&nbsp;月 &nbsp;&nbsp;日</p>
                        
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
        title:'受理案件通知书'
        }
    },
     props: {
        backFill:[Array,Object]
    },
    methods: {
           
        dipPro(litigantId,panelList){
           let data = {
                litigantId:litigantId,
                buildDiplomsName:panelList,
                caseNo:this.backFill.caseNo,
                plaintiffName:this.backFill.plaintiffName,
                briefName:this.backFill.briefName,
                litigantName:this.backFill.litigantName,
                defendantBriefName:this.backFill.defendantBriefName,
                handleCost:this.backFill.handleCost,
            }  
              dbList(
                  data
              ).then(res=>{
               if(res.data.state == 100){
                    this.modelHid = false;
                     this.$emit('model',this.modelHid,res.data.data.path,this.title);
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