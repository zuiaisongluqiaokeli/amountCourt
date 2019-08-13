<template>
   <div class="box">
       <div class="header">
             <!-- <h2>福建省厦门市思明区人民法院</h2> -->
             <h2>立案审批表</h2>
         
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
                    案由
                </Col>
                <Col span="8" class="maininfo-col">
                    <!-- <FormItem  style="width: 100%;"> -->
                        <Input v-model="backFill.briefName"></Input>
                    <!-- </FormItem> -->
                </Col>
                <Col span="4" class="maininfo-col maininfo-col-label">
                    收到诉状日期
                </Col>
                <Col span="8" class="maininfo-col">
                    <!-- <FormItem  style="width: 100%;"> -->
                        <Input v-model="backFill.receiceDate"></Input>
                    <!-- </FormItem> -->
                </Col>
            </Row>
            <Row>
                <Col span="4" class="maininfo-col maininfo-col-label" style="height:76px !important;line-height:76px">
                    当事人
                </Col>
                <Col span="20" class="maininfo-col" style="height:76px !important;">
                <p>原告：<Input v-model="backFill.plaintiffName" style="display:inline-block;width:80%;margin-top:5px"></Input></p>
                <p>原告：<Input v-model="backFill.defendantName" style="display:inline-block;width:80%;margin-top:5px"></Input></p>                   
                </Col>
            </Row>
            <Row>
                <Col span="4" class="maininfo-col maininfo-col-label" style="height:76px !important;line-height:76px">
                    诉状内容摘要
                </Col>
                <Col span="20" class="maininfo-col" style="height:76px !important;">
                      见诉状                
                </Col>
            </Row>
            <Row>
                <Col span="4" class="maininfo-col maininfo-col-label" >
                    起诉标的金额
                </Col>
                <Col span="20" class="maininfo-col" >
                        <Input v-model="backFill.litigationRequestMoeny" ></Input>          
                </Col>
            </Row>
            <Row>
                <Col span="4" class="maininfo-col maininfo-col-label" style="height:76px !important;line-height:76px">
                    审查意见
                </Col>
                <Col span="20" class="maininfo-col" style="height:76px !important;">
                    <p style="text-align:left">建议立案</p> 
                    <p style="text-align:left">（签名）</p> 
                    <p style="text-align:right"> 年&emsp;&emsp;月&emsp;&emsp;日</p>                 
                </Col>
            </Row>
            <Row>
                <Col span="4" class="maininfo-col maininfo-col-label" style="height:76px !important;line-height:76px">
                    立案庭领导意见
                </Col>
                <Col span="20" class="maininfo-col" style="height:76px !important;">
                    <p style="text-align:left">决定立案</p> 
                    <p style="text-align:left">（签名）</p> 
                    <p style="text-align:right"> 年&emsp;&emsp;月&emsp;&emsp;日</p>                 
                </Col>
            </Row>
            <Row>
                <Col span="4" class="maininfo-col maininfo-col-label" style="height:76px !important;line-height:76px">
                    分案意见
                </Col>
                <Col span="20" class="maininfo-col" style="height:76px !important;">                 
                </Col>
            </Row>
            <Row>
                <Col span="4" class="maininfo-col maininfo-col-label">
                    立案时间
                </Col>
                <Col span="8" class="maininfo-col">
                        <Input v-model="backFill.fillingDate"></Input>
                </Col>
                <Col span="4" class="maininfo-col maininfo-col-label">
                    案号
                </Col>
                <Col span="8" class="maininfo-col">
                        <Input v-model="backFill.caseNo"></Input>
                </Col>
            </Row>
            <Row>
                <Col span="12" class="maininfo-col maininfo-col-label">
                    发出受理案件通知书或者作出不予受理裁定书的日期
                </Col>
                <Col span="12" class="maininfo-col maininfo-col-label">
                    <Input v-model="backFill.fill_3"></Input>
                </Col>
            </Row>
           </Form>
      </div>
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
                briefName:this.backFill.briefName,
                receiceDate:this.backFill.receiceDate,
                plaintiffName:this.backFill.plaintiffName,
                defendantName:this.backFill.defendantName,
                litigationRequestMoeny:this.backFill.litigationRequestMoeny,
                fillingDate:this.backFill.fillingDate,
                fill_3:this.backFill.fill_3,
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