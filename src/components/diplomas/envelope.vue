<template>
   <div class="box">
      <div class="main">
          <Form>
            <Row>
                <Col span="6" class=" grid152">
                    <Row>
                        <Col span="24" class="maininfo-col">
                            案号
                        </Col>
                        
                    </Row>
                    <Row>
                        <Col span="24" class="maininfo-col">
                        <!-- <FormItem  style="width: 100%;"> -->
                                <Input v-model="backFill.converCaseNo"></Input>
                            <!-- </FormItem> -->
                        
                        </Col>
                    </Row>
                    <Row>
                        <Col span="24" class="maininfo-col">
                            案由
                        </Col>
                    
                    </Row>
                    <Row>
                        <Col span="24" class="maininfo-col">
                            <!-- <FormItem  style="width: 100%;"> -->
                                <Input v-model="backFill.briefName"></Input>
                            <!-- </FormItem> -->
                        </Col>
                    </Row>
                </Col>
                <Col span="1" class="maininfo-col grid152">
                    <Row>
                           <Col  span="24" class="row"> &nbsp;&nbsp;&nbsp;原&emsp;告</Col> 
                    </Row>
                    <Row>
                           <Col  span="24" class="row"  style="border-top:1px solid black;"> &nbsp;&nbsp;&nbsp;律&emsp;师</Col> 
                    </Row> 
                </Col>
                
                <Col span="8" class="maininfo-col grid152">
                      <Row>
                           <Col  span="24" class="row"><input type="text" v-model="backFill.plaintiffNamePhone" class="inputHeight"></Col> 
                      </Row>  
                      <Row>
                         <Col span="24" class="row"  style="border-top:1px solid black;"> <input type="text" v-model="backFill.plaintiffLawyerNamePhone" class="inputHeight"></Col>
                      </Row> 
                </Col>
                 <Col span="1" class="maininfo-col grid152">
                    <Row>
                           <Col  span="24" class="row"> &nbsp;&nbsp;&nbsp;被&emsp;告</Col> 
                    </Row>
                    <Row>
                           <Col  span="24" class="row"  style="border-top:1px solid black;"> &nbsp;&nbsp;&nbsp;律&emsp;师</Col> 
                    </Row>
                       
                </Col>
                <Col span="8" class="maininfo-col grid152">
                      <Row>
                           <Col span="24" class="row"><input type="text" v-model="backFill.defendantNamePhone" class="inputHeight"></Col>
                      </Row>  
                      <Row>
                          <Col span="24" class="row"  style="border-top:1px solid black;"><input type="text" v-model="backFill.defendantLawyerNamePhone" class="inputHeight"></Col>
                      </Row> 
                </Col>
            </Row>
            <Row>
                <Col span="6" class="grid114">
                    <Row>
                        <Col span="24" class="maininfo-col row76">审判人员 </Col>
                    </Row>
                    <Row>
                         <Col span="24" class="maininfo-col row38">审限届满日期 </Col>
                    </Row>
                </Col>
                <Col span="4" class="grid114">
                    <Row>
                        <Col span="24" class="maininfo-col row76"><input type="text" v-model="backFill.judgeName" class="row"></Col>
                    </Row>
                    <Row>
                        <Col  span="24" class="maininfo-col row38">
                            <!-- <input type="text" v-model="backFill.closeDate"> -->
                            {{backFill.closeDate}}
                        </Col>
                    </Row>
                </Col>
                <Col span="1" class="maininfo-col grid114">
                      保 全
                </Col>
                 <Col span="4" class="grid114">
                    <Row>
                        <Col span="24" class="maininfo-col row38">申请时间:</Col>
                    </Row>
                    <Row>
                        <Col  span="24" class="maininfo-col row76">执行时间:</Col>
                    </Row>
                </Col>
                <Col span="1" class="maininfo-col grid114">
                       解 保
                </Col>
                 <Col span="4" class="grid114">
                    <Row>
                        <Col span="24" class="maininfo-col row38">申请时间：</Col>
                    </Row>
                    <Row>
                        <Col  span="24" class="maininfo-col row76">执行时间：</Col>
                    </Row>
                    
                </Col>
                <Col span="1" class="maininfo-col grid114">
                      鉴定
                </Col>
                 <Col span="3" class="grid114">
                    <Row>
                        <Col span="24" class="maininfo-col row28">申请时间：</Col>
                    </Row>
                    <Row>
                        <Col  span="24" class="maininfo-col row28">移送时间：</Col>
                    </Row>
                    <Row>
                        <Col span="24" class="maininfo-col row28">补充时间：</Col>
                    </Row>
                    <Row>
                        <Col  span="24" class="maininfo-col row28">完成时间：</Col>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col span="6" class="grid380">
                    <Row>
                        <Col span="24" class="maininfo-col">立案时间 </Col>
                    </Row>
                    <Row>
                         <Col span="24" class="maininfo-col"><p>{{backFill.filingDate}}</p></Col>
                    </Row>
                    <Col span="24">
                        <Col span="4" class="maininfo-col grid304">
                         &nbsp;&nbsp;&nbsp;中&emsp;止 &emsp;、&emsp;&nbsp;&nbsp;&nbsp;管&emsp;辖 &emsp;、&emsp;&nbsp;&nbsp;&nbsp;反&emsp;诉 &emsp;、&emsp;&nbsp;&nbsp;&nbsp;调&emsp;查
                        </Col>
                        <Col span="20" class=" grid304">
                            <Row>
                                <Col span="24" class="maininfo-col"></Col>
                            </Row>
                            <Row>
                                <Col span="24" class="maininfo-col"></Col>
                            </Row>
                            <Row>
                                <Col span="24" class="maininfo-col"></Col>
                            </Row>
                            <Row>
                                <Col span="24" class="maininfo-col"></Col>
                            </Row>
                            <Row>
                                <Col span="24" class="maininfo-col"></Col>
                            </Row>
                            <Row>
                                <Col span="24" class="maininfo-col"></Col>
                            </Row>
                            <Row>
                                <Col span="24" class="maininfo-col"></Col>
                            </Row>
                            <Row>
                                <Col span="24" class="maininfo-col"></Col>
                            </Row>
                            <Row>
                                <Col span="24" class="maininfo-col"></Col>
                            </Row>
                            <Row>
                                <Col span="24" class="maininfo-col"></Col>
                            </Row>
                        </Col>
                    </Col>
                </Col>
                <Col span="9" class="grid380">
                   <Row>
                       <Col span="3" class="maininfo-col grid152"> &nbsp;&nbsp;&nbsp;开&emsp;&nbsp;&nbsp;&nbsp;庭&emsp; &nbsp; &nbsp;时&emsp; 间</Col>
                       <Col span="21" class="maininfo-col grid152"></Col>
                   </Row>
                    <Row>
                        <Col span="24" class="maininfo-col grid228">
                            备注(与当事人)
                        </Col>
                    </Row>
                </Col>
                <Col span="9" class="grid380">
                    <Row class="row54">
                         <Col span="3" class="maininfo-col row54">
                          序号
                        </Col>
                        <Col span="6" class="maininfo-col row54">
                        时间
                        </Col>
                        <Col span="15" class="maininfo-col row54">
                            交办事项
                        </Col>
                    </Row>
                    <Row class="row54">
                         <Col span="3" class="maininfo-col row54">
                         1
                        </Col>
                        <Col span="6" class="maininfo-col row54 ">
                        
                        </Col>
                        <Col span="15" class="maininfo-col row54">
                            
                        </Col>
                    </Row>
                    <Row class="row54">
                         <Col span="3" class="maininfo-col row54">
                       2
                        </Col>
                        <Col span="6" class="maininfo-col row54">
                        
                        </Col>
                        <Col span="15" class="maininfo-col row54">
                            
                        </Col>
                    </Row>
                    <Row class="row54">
                         <Col span="3" class="maininfo-col row54">
                       3
                        </Col>
                        <Col span="6" class="maininfo-col  row54">
                        
                        </Col>
                        <Col span="15" class="maininfo-col row54">
                            
                        </Col>
                    </Row>
                    <Row class="row54">
                         <Col span="3" class="maininfo-col row54">
                       4
                        </Col>
                        <Col span="6" class="maininfo-col row54">
                        
                        </Col>
                        <Col span="15" class="maininfo-col row54">
                            
                        </Col>
                    </Row>
                    <Row class="row54">
                         <Col span="3" class="maininfo-col row54">
                       5
                        </Col>
                        <Col span="6" class="maininfo-col row54">
                        
                        </Col>
                        <Col span="15" class="maininfo-col row54">
                            
                        </Col>
                    </Row>
                    <Row class="row54">
                         <Col span="3" class="maininfo-col row54">
                       6
                        </Col>
                        <Col span="6" class="maininfo-col row54">
                        
                        </Col>
                        <Col span="15" class="maininfo-col row54">
                            
                        </Col>
                    </Row>
                       
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
            modelHid:true
        }
    },
     props: {
        backFill:[Array,Object]
    },
    methods: {
        dipPro(litigantId,panelList){
            // var _this = this;
            console.log(panelList);
            console.log('组件调用')  
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
                //    console.log('请求成功'+JSON.stringifyres.data.state))
               if(res.data.state == 100){
                console.log('请求成功'+res)
                this.modelHid = false
                 this.$emit('model',this.modelHid,res.data.result);
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
      width: 900px;
      height: 100%;
      display: block;
    //   border: 1px solid black;
      font-size: 14px;
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
      text-align: center;
      line-height:25px;
    //   display: flex;
    //   align-items: center;
    //   justify-content: center; 
      padding: 0;
  }
 .grid152{
     height: 152px;
 }
 .grid114{
     height: 114px;
 }
 .grid380{
     height: 455px;
 }
  .grid304{
     height: 380px;
 }
  .grid228{
     height: 304px;
 }
 .row76{
     height: 76px;
 }
 .row38{
     height: 38px;
 }
 .row28{
     height: 28.5px;
 }
  .row54{
     height: 65.2px;
 }
    input{
      width: 100%;
      height: 30px;
      border: none;
      font-size: 15px;
      text-align: center;
  }
  .row{
      height: 75px;
  }
  .inputHeight{
        height: 72px;
  }
</style>