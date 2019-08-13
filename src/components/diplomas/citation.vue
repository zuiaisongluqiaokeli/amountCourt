<template>
   <div class="box">
       <div class="header">
             <h2>福建省厦门市思明区人民法院</h2>
             <h2>传票</h2>
         
       </div>
       <div style="margin-top:10px;margin-bottom:10px">
           <Input v-model="backFill.caseNo" style="text-align: center;" placeholder="案号"></Input>
       </div>
      <div class="main">
          <Form>
            <!-- <Row>
                <Col span="6" class="maininfo-col maininfo-col-label">
                    案号
                </Col>
                <Col span="18" class="maininfo-col">
                        <Input v-model="backFill.caseNo"></Input>
                </Col>
            </Row> -->
            <!-- <Row>
                <Col span="6" class="maininfo-col maininfo-col-label">
                    案由
                </Col>
                <Col span="18" class="maininfo-col">
                        <Input v-model="backFill.briefName"></Input>
                </Col>
            </Row> -->
            <Row>
                <Col span="4" class="maininfo-col maininfo-col-label">
                    被传人姓名
                </Col>
                <Col span="8" class="maininfo-col">
                    <!-- <FormItem  style="width: 100%;"> -->
                        <Input v-model="backFill.litigantName"></Input>
                    <!-- </FormItem> -->
                </Col>
                <Col span="4" class="maininfo-col maininfo-col-label">
                    住址
                </Col>
                <Col span="8" class="maininfo-col">
                    <!-- <FormItem  style="width: 100%;"> -->
                        <Input v-model="backFill.sendAddress"></Input>
                    <!-- </FormItem> -->
                </Col>
            </Row>
            <Row>
                <Col span="4" class="maininfo-col maininfo-col-label">
                    被传事由
                </Col>
                <Col span="20" class="maininfo-col">
                    <Input v-model="backFill.callingMatter"></Input>
                </Col>
            </Row>
            <Row>
                <Col span="4" class="maininfo-col maininfo-col-label">
                    应到时间
                </Col>
                <Col span="8" class="maininfo-col">
                        <Input v-model="backFill.startTime"></Input>
                </Col>
                <Col span="4" class="maininfo-col maininfo-col-label">
                    应到处所
                </Col>
                <Col span="8" class="maininfo-col">
                        <Input v-model="backFill.tribunalAddress"></Input>
                </Col>
            </Row>
            
            <Row>
                <Col span="4" class=" maininfo-col-label maininfo-col" style="height:145px;line-height:145px">
                    注意事项
                </Col>
                <Col span = "20" class="notes">
                    <p>注意事项：</p>
                    <p>
                        1.被传唤人必须准时到达应到场所，并 <strong> 携带有效证件</strong>；
                    </p>
                    <p>2.本传票由被传唤人携带来院报到;</p>
                    <p>3.被传唤人收到传票后，应在送达回证上签名或盖章;</p>
                    <p>4.<strong>律师须着律师袍出庭;</strong></p>
                    <!-- <p>5.若有调解意愿可提前联系审判员或书记员进行调解。联系方式：</p>
                    <FormItem  style="width: 30%;">
                        <Input v-model="backFill.contactPhone"></Input>
                    </FormItem> -->
                    <!-- <p>提示：为提高效率，请在开庭前将诉讼材料电子档（包括起诉状、答辩状、证据清单）发至法庭邮箱：e-court@hlcourt.gov.cn。</p> -->
                </Col>
                <!-- <Col span="9"push="15">
                        <span>法&nbsp;&nbsp;&nbsp;官:</span>
                        <FormItem>
                            <Input v-model="backFill.judgeName"></Input>
                        </FormItem><br>
                        <span>书记员:</span>
                        <FormItem>
                            <Input v-model="backFill.clerkName"></Input>
                        </FormItem>
                       
                        <p>{{backFill.noticeTime}}</p>
                        <p style="margin-bottom:45px;">（院印）</p>
                </Col> -->

            </Row>
            <Row>
                <Col span="4" class="maininfo-col maininfo-col-label">
                    签发人
                </Col>
                <Col span="8" class="maininfo-col">
                        <Input v-model="backFill.judgeName"></Input>
                </Col>
                <Col span="4" class="maininfo-col maininfo-col-label">
                    送达人
                </Col>
                <Col span="8" class="maininfo-col">
                        <Input v-model="backFill.operatorName"></Input>
                </Col>
            </Row>
            <Row>
                <Col span="9"push="15" style="margin-top:30px;margin-bottom:20px">
                    <Input v-model="backFill.noticeTime"></Input>
                </Col>
            </Row>
           </Form>
      </div>
      <p>本联送达被传唤人</p>
   </div>

</template>

<script type="text/javascript">
import { dbList } from '@/api/diplomas.js';
export default {
    data(){
        return{
            modelHid:true,
            title:'传票'
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
                litigantName:this.backFill.litigantName,
                sendAddress:this.backFill.sendAddress,
                callingMatter:this.backFill.callingMatter,
                startTime:this.backFill.startTime,
                tribunalAddress:this.backFill.tribunalAddress,
                judgeName:this.backFill.judgeName,
                operatorName:this.backFill.operatorName,
                noticeTime:this.backFill.noticeTime,
            }  
              dbList(
                  data
              ).then(res=>{
                //    console.log('请求成功'+JSON.stringifyres.data.state))
               if(res.data.state == 100){
                console.log('请求成功'+res)
                this.modelHid = false
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
      width: 800px;
      height: 100%;
      display: block;
    //   border: 1px solid black;
    font-size: 15px;
  }
  .header{
      width:100%;
      text-align: center;
  }
  .main{
      width: 100%;
      height: 100%;
      border:1px solid black;
  }
  .maininfo-col{
     border-right:1px solid black !important;
     border-bottom:1px solid black !important;
  }
 
  .maininfo-col{
      text-align: center;
  }
  p{
      line-height:26px;
  }
  .notes{
   padding: 8px;
   border-right:1px solid black !important;
     border-bottom:1px solid black !important;
  }
  .ivu-form-item{
      display: inline-block;
  }
</style>