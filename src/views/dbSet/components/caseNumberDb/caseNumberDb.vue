<template>
  <div class="ownInfo">
    <div class="bookbuilding-table">
      <Row>
        <Col span="24" class="noemalTb th-header">民初案号</Col>
      </Row>
      <Card>
        <div class="zh-plant-div1">
          <div class="zh-plant-div2">
            <Form ref='pwdList' label-position="right" :label-width="210" style="margin:0 auto" >
              <FormItem label="字号格式" class="zh_form zh-plant-chooseType">
                  <div>
                    <Input placeholder="例：(年份)闽(0203)民初" class="reg_groupSelect1" v-model="contrTypeTabList.numFormat" @on-keyup="numFormatChange"></Input>
                    <Input placeholder="自然数" :disabled="true" class="reg_groupSelect"></Input>
                    <Input placeholder="号" :disabled="true" class="reg_groupSelect"></Input>
                </div>
              </FormItem>
              <FormItem label="可分配号（段）" class="zh_form zh-plant-chooseType">
                <Input type="textarea" placeholder="多个用;隔开，连续号段用-表示（例：1;2;3-5）" v-model="contrTypeTabList.caseNos"></Input>
              </FormItem>
              <FormItem label="当前字号" class="zh_form zh-plant-chooseType">
                <Input :disabled="true" v-model="contrTypeTabList.nowCaseNo"></Input>
              </FormItem>
              <FormItem label="设置下一起始字号" class="zh_form zh-plant-chooseType">
                <InputNumber v-model="contrTypeTabList.nextCaseNos" :min="0"></InputNumber>
              </FormItem>
              <FormItem label="临时禁用自动分配号（段）" class="zh_form zh-plant-chooseType">
                <Input type="textarea" placeholder="多个用;隔开，连续号段用-表示（例：1;2;3-5）" v-model="contrTypeTabList.prohibitNums"></Input>
              </FormItem>
              <FormItem label="启用时间" class="zh_form zh-plant-chooseType">
                <RadioGroup v-model="enableTimeSelect" vertical @on-change="enableTimeChange">
                    <Radio label="即时启用">
                      <span>即时启用</span>
                    </Radio>
                    <Radio label="自定义时间">
                      <span>自定义时间</span>
                    </Radio>
                    <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" placeholder="请选择时间" style="width: 200px" :disabled="DatePickerShow" v-model="contrTypeTabList.newNumDate"></DatePicker>
                </RadioGroup>
              </FormItem>
            </Form>
            <div class="textCenter editBtnDiv">
              <Button type="primary" shape="circle" class="editBtn" @click="saveEdit">保存编辑</Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import {findCaseNoFormat,caseNoAndProhibit} from '@/api/dbSet.js'
import {changeDatePicker,delSpace} from '@/libs/tools.js'
export default {
  name:"caseNumberDb",
  components: {},
  data() {
    return {
      contrTypeTabList:{
        numFormat:'',//字号格式
        nowCaseNo:'',//当前字号
        caseNos:'',//可分配号（段）
        prohibitNums:'',//临时禁用自动分配号（段）
        nextCaseNos:0,//下一起始字号
        newNumDate:'',//启用时间
      },
      contrTypeClicked:0,
      enableTimeSelect:"即时启用",
      DatePickerShow:true,
    }
  },
  methods:{
    enableTimeChange(e){
      console.log(e)
      switch(e){
        case "即时启用":
          this.DatePickerShow=true;
        break;
        case "自定义时间":
          this.DatePickerShow=false;
        break;
      }
    },
    getNowPageContent(){
      findCaseNoFormat().then(res=>{//获取字号格式和当前字号
        let data=res.data;
        if(data.state==100){
          this.contrTypeTabList.numFormat=this.getNumFormat(data.data.numFormat);
          this.contrTypeTabList.nowCaseNo=data.data.nowCaseNo;
        }else{
          this.$Message.warning(data.message);
          this.contrTypeTabList.numFormat=this.getNumFormat(data.data.numFormat);
          this.contrTypeTabList.nowCaseNo=data.data.nowCaseNo;
        }
      });
    },
    getNumFormat(numFormat){//获取字号格式
       let num=numFormat.indexOf("#number#");
       let res=numFormat.substring(0,num)
       return res;
    },
    numFormatChange(){
      this.contrTypeTabList.numFormat=delSpace(this.contrTypeTabList.numFormat,"g");
    },
    saveEdit(){//保存编辑
      let editList={
        caseNos:this.contrTypeTabList.caseNos,//可分配号（段）
        prohibitNums:this.contrTypeTabList.prohibitNums,//临时禁用自动分配号（段）
        newNumDate:this.DatePickerShow?'':changeDatePicker(this.contrTypeTabList.newNumDate),//启用时间
        nextCaseNos:this.contrTypeTabList.nextCaseNos,//下一起始字号
        numberFormats:this.contrTypeTabList.numFormat,//字号格式
      }
      console.log(editList)
      //发送编辑请求
      caseNoAndProhibit(editList).then(res=>{
        let data=res.data;
        if(data.state==100){
          this.$Message.success(data.message);
        }else{
          this.$Message.warning(data.message);
        }
      });
    },
  },
  mounted() {
  },
}
</script>

<style lang='css' scoped>
</style>
