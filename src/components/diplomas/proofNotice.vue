<template>
   <div class="box">
       <div class="header">
             <h2>福建省厦门市思明区人民法院</h2>
             <h2>民事诉讼举证通知书</h2>
       </div>
    <div>
     <Form>
          <Row>
                <Col span="8" push="14"  class="maininfo-col headerCase">
                   <!-- <Input ></Input> -->
                   <input type="text" v-model="backFill.caseNo">
                </Col>
               
         </Row>
         <div class="main">
            <Row>
                <!-- <Col span="8" class="maininfo-col headerCase"> -->
                    <!-- <div style="width: 30%; display:inline-block;border-bottom:1px solid black;"><input type="text" v-model="backFill.litigantName"></div>： -->
                <!-- </Col> -->
           </Row>
            
                <div class="lineHeight">
                    <div class="textIndent">本院已受理你（单位）与 <div style="width: 30%; display:inline-block;border-bottom:1px solid black;"><input type="text" style="width:80%" v-model="backFill.defendantBriefName"></div>一案。
依据《中华人民共和国民事诉讼法》和《最高人民法院关于民事诉讼证据的若干规定》，现
将有关举证事项通知如下：</div>
                    <div class="textIndent">1、当事人对自己提出的诉讼请求所依据的事实或者反驳对方诉讼请求所依据的事实，
应当提供证据加以证明，但法律另有规定的除外。 
                    </div>
                    <div class="textIndent">在作出判决前，当事人未能提供证据或者证据不足以证明其事实主张的，由负有举证
证明责任的当事人承担不利的后果。
                    </div>
                    <div> &nbsp;&nbsp;&nbsp;当事人应在收到本通知次日起的<div style="width: 10%; display:inline-block;border-bottom:1px solid black;"><input type="text" v-model="backFill.proiefTeam"></div> 日内向本院提交证据材料，在举证期限内不提
交的，视为放弃举证权利。
                    </div>
                    <div class="textIndent">双方当事人协商一致，可依法变更上述举证期限，但需在收到本通知的次日起七日内
共同向本院提出变更举证期限的书面请求。经本院认可，方可变更。
                    </div>
                    <div class="textIndent">当事人超过举证期限提交证据材料拒不说明理由或理由不成立的，本院可以不予采纳
证据，或者采纳该证据但予以训诫、罚款。
                    </div>
                    <div class="textIndent">当事人增加、变更诉讼请求或提起反诉的，应当在法庭辩论结束前提出。
                    </div>
                    <div class="textIndent">
                        3、当事人申请延长举证期限的，应当在举证期限届满前向人民法院提出书面申请。经
本院准许，可以适当延长举证期限。
                    </div>
                    <div class="textIndent">4、当事人向本院提供证据，应当提供原件或原物。如需自己保存证据原件、原物或者
提供原件、原物确有困难的，可以提供复制件或复制品，但应当将原件、原物在举证期限
内带至本院进行核对，携带原件、原物有困难的，可以申请本院派员前往核对。</div>
                    <div class="textIndent">当事人应当对其提交的证据材料逐一分类编号，对证据材料的来源、证明对象和内容
作简要说明，签名盖章，注明提交日期，一式两份，并依照对方当事人人数提出副本。</div>
                    <div class="textIndent">当事人提供的书面证据复印件， 应一律使用A4 型纸， 其成品幅面尺寸为：
210mm×297mm。</div>
                    <div class="textIndent">5、当事人提供的证据系在中华人民共和国领域外形成的，该证据应当经所在国公证机
关予以证明，并经中华人民共和国驻该国使领馆予以认证，或者履行中华人民共和国与该
所在国订立的有关条约中规定的证明手续。</div>
                    <div class="textIndent">当事人提供的证据是在香港、澳门、台湾地区形成的，应当履行相关的证明手续。</div>
                    <div class="textIndent">当事人提供的外文书证或者外文说明资料，应当附有中文译本。</div>
                    <div class="textIndent">6、与本案有关且符合下列条件之一的，当事人及其诉讼代理人可以申请本院调查收集
证据，但不得迟于举证期限届满前，并应按规定提交书面申请书：</div>
                    <div class="textIndent">（一）证据由国家有关部门保存，当事人及其诉讼代理人无权查阅调取的；</div>
                    <div class="textIndent">（二）涉及国家秘密、商业秘密或者个人隐私的材料；</div>
                    <div class="textIndent">（三）当事人及其诉讼代理人因客观原因不能自行收集的其他证据。</div>
                    <div class="textIndent">申请本院调查收集证据的申请书，应当载明被调查人的姓名或者单位名称、住所地等
基本情况、所要调查收集的证据内容，需要由本院调查收集证据的原因及其要证明的事实。</div>
                    <div class="textIndent">
                        7、当事人依法申请保全证据的，可以在举证期限届满前提出书面申请。
                    </div>
                    <div class="textIndent">
                        8、当事人申请鉴定，可以在举证期限届满前提出。申请鉴定的事项与待证事实无关联，
或者对证明待证事实无意义的，人民法院不予准许。人民法院准许当事人鉴定申请的，应
当组织双方当事人协商确定具备相应资格的鉴定人。当事人协商不成的，由人民法院指定。
当事人对鉴定意见有异议或本院认为鉴定人有必要出庭的，鉴定人应当出庭作证，经本院
通知鉴定人拒不出庭作证的，鉴定意见不作为认定事实的根据，支付鉴定费用的当事人可
以要求返还鉴定费用。
                    </div>
                    <div class="textIndent">
                        9、当事人申请证人出庭作证，应当在举证期限届满前提出，并经人民法院许可。证人
因履行出庭作证义务而支出的交通、住宿、就餐等必要费用以及误工损失，由败诉一方当
事人负担，但申请证人作证的当事人应先行垫付。
                    </div>
                    <div class="textIndent">
                        10、经本院许可，当事人可以申请一至二名具有专门知识的人员出庭，就鉴定人作出
的鉴定意见或专业问题提出意见。
                    </div>
                    <div class="textIndent">
                       11、当事人举证应当诚实，当事人或者其他诉讼参与人伪造、毁灭证据，提供假证据，
阻止证人作证，指使、贿买、胁迫他人作伪证或者对证人、鉴定人、勘验人打击报复的，
依照《中华人民共和国民事诉讼法》第一百一十一条的规定将承担相应法律责任。
                    </div>
                </div>
               
         
                <Row>
                    <Col span="8" push="18" class="maininfo-col headerCase">
                        &nbsp;&nbsp;年 &nbsp;&nbsp;月 &nbsp;&nbsp;日
                        
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
        title:'举证通知书'

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
                defendantBriefName:this.backFill.defendantBriefName,
                proiefTeam:this.backFill.proiefTeam,
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
      font-size: 16px;
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
  strong{
      text-decoration: underline;
      font-size: 16px;
  }
  input{
        width: 100%;
      height: 30px;
      border: none;
      font-size: 15px;
      text-align: center;
  }
</style>