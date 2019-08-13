<template>
   <div class="box">
       <div class="header">
             <!-- <h2>福建省厦门市思明区人民法院</h2> -->
             <h2>送达地址确认书</h2>
       </div>
    <div>
     
      <div class="main">
          <Form>
            <Row>
                <Col span="2" class="maininfo-col maininfo-col-label">
                    案号
                </Col>
                <Col span="10" class="maininfo-col">
                    <Input v-model="backFill.caseNo"></Input>
                </Col>
                <Col span="2" class="maininfo-col maininfo-col-label">
                    案由
                </Col>
                <Col span="10" class="maininfo-col">
                    <Input v-model="backFill.briefName"></Input>
                </Col>
            </Row>
            <Row>
                <Col span="2" class="maininfo-col grid290">
                    告知事项
                </Col>
                <Col span="22" class="maininfo-col grid290">
                   <div>
                    <p style="text-indent:2rem;">根据《民事诉讼法》第八十七条、八十八条以及最高人民法院《关于以法院专递方式邮寄送达民事诉讼文书的若干规定》第一条、第三条、第四条、第五条和第十一条的规定，告知如下：</p>
                    <p style="text-indent:2rem;">一、为便于当事人及时收到人民法院诉讼文书，保证诉讼程序顺利进行，当事人应当如实提供确切的送达地址；</p>
                    <p style="text-indent:2rem;">二、当事人拒绝提供自己的送达地址的，自然人依其户籍登记中的住所地或经常居住地为送达地址；法人或者其他组织以其工商登记或者其他依法登记、备案中的住所为送达地址；</p>
                    <p style="text-indent:2rem;">三、因受送达人自己提供或者确认的送达地址不准确、拒不提供送达地址、送达地址变更未及时告知人民法院、受送达人本人或者受送达人的委托代理人、指定的代收人拒绝签收，导致诉讼文书未能被受送达人实际接收的，文书退回之日视为送达之日。</p>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col span="2" class="maininfo-col grid250">
                    送达地址
                </Col>
                 <Col span="22" class="maininfo-col grid250">
                   <div style="width:100%;">
                        <div>收件人<div class="underline"><Input v-model="backFill.litigantName" ></Input></div> （如系他人，请注明与当事人关系）</div>
                        <div>文书送达地址：<div class="underline" style="width:80%"><Input v-model="backFill.sendAddress" ></Input></div></div>
                        <div>邮政编码：<div class="underline"></div>联系电话：<div class="underline">
                            <Input v-model="backFill.litigantPhone" ></Input></div></div>
                        <div class="dis">电子送达地址（包括传真、电子邮件等）：<div class="underline100" style="width:80%;"></div></div>
                        <p>本人同意人民法院可以采用传真、电子邮件等电子送达方式送达除判决书、裁定书、调解书以外的诉讼文书，并以传真、电子邮件等送达到本人特定系统的日期为送达日期。</p>
                    </div>
                </Col>  
            </Row>
            <Row>
                <Col  span="2" class="maininfo-col grid290">
                  当事人确认
                </Col>
                 <Col  span="22" class="maininfo-col grid290">
                   <div>
                       <p class="textIndent">一、本人已经阅读了人民法院对当事人填写送达地址确认书的告知事项并清楚了解其内容及法律意义；</p>
                       <p class="textIndent">二、本人承诺基于诚信原则进行所有诉讼活动，保证上述送达地址是准确、有效有，如无法送达，将承担相应法律责任；</p>
                       <p class="textIndent">三、本人承诺，诉讼过程中，本人送达地址、联系方式（包括手机号码、传真号码、电子邮箱等）若有变更，或者中途撤销委托代理，委托新的代理人，需要变更送达地址的，将以书面形式告知人民法院，确认新的送达地址，否则，人民法院可以上述地址为送达地址；</p>
                       <p class="textIndent">四、本人确认以上地址为本案一审、二审、执行、再审等程序的送达地址；</p>
                       <p class="textIndent">五、若本人上诉状中地址与送达地址确定中确认的送达地址不一致的，视为本人向人民法院提供变更后送达地址，变更后的地址相应为本案二审、执行、再审等程序的送达地址。</p>
                       <Col push="9" class="paddings"> 受送达人签名、盖章或捺印:</Col>
                       <Col push="17" class="paddings"> 年&emsp;&emsp;月&emsp;&emsp;日</Col>
                   </div>
                    
                </Col>
                
            </Row>
             <Row> 
                 <Col  span="2" class="maininfo-col grid50">
                  备注
                </Col>
                 <Col  span="22" class="maininfo-col textIndent grid50">
                  当事人授权委托代理人代为签收法律文书的，代理人应当同时提交当事人签名确认的本人送达地址。
                </Col>
             </Row>
       </Form>
      
     </div>
     <div>
            注：收到后请于三内填妥并寄回本院
    </div> 
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
        title:'送达地址确认书'
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
                litigantName:this.backFill.litigantName,
                sendAddress:this.backFill.sendAddress,
                litigantPhone:this.backFill.litigantPhone,
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
  .maininfo-col{
      line-height:25px;
      display: flex;
      align-items: center;
    //   justify-content: center;
  }
  .ivu-form-item{
      margin-bottom: 3px;
  }
  .grid250{
      height: 250px;
  }
.grid290{
      height: 330px;
  }
  .grid50{
      height: 50px;
  }
  .underline{
    border-bottom: 1px solid black; 
    display: inline-block;
    width: 35.5%;
  }
  .dis{
      display: flex;
      }
  .underline100{
    border-bottom: 1px solid black; 
    // display: inline-block;
    // width: 79%;
  }
  .textIndent{
      text-indent:2em;  
  }
  .paddings{
           padding: 10px 0;
  }
</style>