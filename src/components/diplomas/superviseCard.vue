<template>
   <div class="box">
       <div class="header">
             <h2>厦门市思明区人民法院廉政监督卡</h2>
       </div>
    <div>
     <Form>
      <!-- <div class="textIndent">
          为进一步加强对案件管理监督，规范办案行为，促进公正、廉洁、高效司法，维护你的合法权益，请对办案法官行为进行监督评议，并将结果及时向
          <strong>厦门市思明区人民法院纪检组监察室反馈（邮编：361000，举报电话：0592-6036057，或直接投至设在厦门市思明区人民法院的意见箱内）</strong>
      </div> -->
      <div class="main" style="margin-top:20px;">
            <Row>
                 <Col span="24" class="maininfo-col">
                   <strong> 案件当事人及被监督人基本信息 </strong>
                </Col>
            </Row>
            <Row>
                <Col span="4" class="maininfo-col maininfo-col-label">
                    案号或案由
                </Col>
                <Col span="20" class="maininfo-col">
                        <Input v-model="backFill.caseNoAndBriefName"></Input>
                </Col>
            </Row>
            <Row>
                <Col span="4" class="maininfo-col maininfo-col-label" style="height:76px !important;line-height:78px">
                    案件当事人
                </Col>
                <div span="20" class="" style="height:78px !important;padding: 0;">
                    <Row>
                        <Col span="4" class="maininfo-col maininfo-col-label">
                            姓名（名称）
                        </Col>
                        <Col span="6" class="maininfo-col">
                                <Input v-model="backFill.litigantName"></Input>
                        </Col>
                        <Col span="4" class="maininfo-col maininfo-col-label">
                            电话
                        </Col>
                        <Col span="6"  class="maininfo-col">
                                <Input v-model="backFill.litigantPhone"></Input>
                        </Col>
                        <Col span="4"    class="maininfo-col maininfo-col-label">
                            地址
                        </Col>
                        <Col span="16"  class="maininfo-col">
                                <Input v-model="backFill.litigantAddress"></Input>
                        </Col>
                    </Row>                                            
                </div>
            </Row>
            <Row>
                <Col span="4" class="maininfo-col maininfo-col-label">
                    被监督人
                </Col>
                <Col span="20" class="maininfo-col">
                        <Input v-model="backFill.supervisedPeople"></Input>
                </Col>
            </Row>
            <Row>
                 <Col span="24" class="maininfo-col">
                   <strong> 廉政监督意见 </strong>
                </Col>
            </Row>
            <Row>
                <Col span="24" class="maininfo-col" style="height:76px !important;text-align:left">
                      &nbsp;&nbsp;&nbsp;提示：请案件当事人按照本卡背面载明的监督事项范围，实事求是地填写监督意见，并请写明具体事实依据。案件当事人若只是对审判执行结果不服，请通过正常法律程序反映。              
                </Col>
            </Row>
            <Row>
                 <Col  span="24" class=" grid290" style="height: 330px;text-align:bottom">

                    <p style="text-align:right;display:block;margin-top:250px;padding-right:50px">案件当事人签名（盖章） ：</p>
                    <p style="text-align:right;padding-right:25px"> 年&emsp;&emsp;月&emsp;&emsp;日</p> 
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
          title:'廉政监督卡'
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
                caseNoAndBriefName:this.backFill.caseNoAndBriefName,
                litigantName:this.backFill.litigantName,
                litigantPhone:this.backFill.litigantPhone,
                litigantAddress:this.backFill.litigantAddress,
                supervisedPeople:this.backFill.supervisedPeople,
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
      border:1px solid black;
  }
  .maininfo-col{
     border-right:1px solid black !important;
     border-bottom:1px solid black !important;
  }
 .fosu{
     height: 38px;
     line-height:25px;
     border-right:1px solid black !important;
     border-bottom:1px solid black !important;
 }
  .maininfo-col{
      text-align: center;
      line-height:25px;
      display: flex;
      align-items: center;
      justify-content: center;
  }
  .ivu-form-item{
      margin-bottom: 3px;
  }
  .grid70{
      height: 70px;
  }

    .textIndent{
      text-indent:2em;  
      font-size: 15px;
  }
  .border{
      border-right:1px solid black !important;
     border-bottom:1px solid black !important;
     height: 40px;
  }
</style>