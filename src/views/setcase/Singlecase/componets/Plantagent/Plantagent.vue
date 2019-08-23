<template>
  <div class='ft-plant-div1'>
    
    <Collapse simple v-for="(value, key) in infos.formValidate" v-model="openAry" :key="key" >
      <Panel :name="item.agPlantId" class="ft-plant-div2" v-for="(item,ind) in value" :key="ind">  
        {{item.agentName}}
        <Form slot="content" :model="item" label-position="right" :label-width="190" :rules="infos.agentRule" :ref="'agFromRule' + key + ind" style="margin:0 auto;width:821px">
            <Tooltip content="删除当前原告代理人" v-show="item.agPlantId != 'agent_0'" @click.native="delAgPlant(item)" class="" placement="bottom">
              <Icon type="ios-close"  class="iconSet"/>
            </Tooltip>
              <FormItem label="代理人类型" class="ft_form ft-plant-chooseType ft-plant-slectType" prop="agentType">
                <Select v-model="item.agentType" style="width:300px" filterable clearable>
                    <Option v-for="item in agType" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
              </FormItem>
            
              <FormItem label="姓名" class="ft_form ft-plant-chooseType" prop="agentName">
                  <Input v-model="item.agentName" placeholder="请输入姓名"></Input>
              </FormItem>

              <FormItem label="公民身份证号" class="ft_form ft-plant-chooseType" prop="agentIdentiCard">
                <Input v-model="item.agentIdentiCard" placeholder="请输入公民身份证号"></Input>
              </FormItem>

              <FormItem label="手机号" class="ft_form ft-plant-chooseType"  prop="agentMobile">
                  <Input v-model="item.agentMobile" placeholder="请输入手机号"></Input>
              </FormItem>

              <FormItem label="联系地址" class="ft_form ft-plant-chooseType" prop="agentAddress">
                  <Input v-model="item.agentAddress" placeholder="请输入联系地址"></Input>
              </FormItem>

              <FormItem label="邮箱地址" class="ft_form ft-plant-chooseType" prop="agentMail">
                  <Input v-model="item.agentMail" placeholder="请输入邮箱地址"></Input>
              </FormItem>

              <div v-show="item.agentType=='律师'">
                <FormItem label="律师执业证号" class="ft_form ft-plant-chooseType" prop="lawerNum">
                    <Input v-model="item.lawerNum" placeholder="请输入律师执业证号"></Input>
                </FormItem>

                <FormItem label="律所名称/住处" class="ft_form ft-plant-chooseType" prop="lawFirm">
                    <Input v-model="item.lawFirm" placeholder="请输入律师所,普通用户请填写住处名称"></Input>
                </FormItem>

                <FormItem label="所函"  class="ft_form ft-plant-chooseType ft-plant-upload" prop="lawFirmLetter">
                    <Input v-model="item.lawFirmLetter" placeholder="请上传所函扫描件"></Input>
                    <span>{{item.agent_fileName1}}</span>
                    <Upload action="/api/court/case/upScanning.jhtml" class="ft-plant-upload-button" :show-upload-list="false" :on-success="agent_uploadSuccess" :data="{fileType:'律师函',id:item.agPlantId}">
                        <Button type="ghost" icon="ios-cloud-upload-outline">选择文件</Button>
                        <span>请上传*.jpg/png/bmp/pdf后缀格式的文件</span>
                    </Upload>
                </FormItem>

                <FormItem label="律师执业证" class="ft_form ft-plant-chooseType ft-plant-upload" prop="lawerCardUrl">
                    <Input v-model="item.lawerCardUrl" placeholder="请上传律师扫描证件"></Input>
                    <span>{{item.agent_fileName2}}</span>
                    <Upload action="/api/court/case/upScanning.jhtml" class="ft-plant-upload-button" :show-upload-list="false" :on-success="agent_uploadSuccess" :data="{fileType:'律师执业证',id:item.agPlantId}">
                        <Button type="ghost" icon="ios-cloud-upload-outline">选择文件</Button>
                        <span>请上传*.jpg/png/bmp/pdf后缀格式的文件</span>
                    </Upload>
                </FormItem>

                <FormItem label="委托书" class="ft_form ft-plant-chooseType ft-plant-upload" prop="commission">
                    <Input v-model="item.commission" placeholder="请上传委托书"></Input>
                    <span>{{item.agent_fileName3}}</span>
                    <Upload action="/api/court/case/upScanning.jhtml" class="ft-plant-upload-button" :show-upload-list="false" :on-success="agent_uploadSuccess" :data="{fileType:'委托书',id:item.agPlantId}">
                        <Button type="ghost" icon="ios-cloud-upload-outline">选择文件</Button>
                        <span>请上传*.jpg/png/bmp/pdf后缀格式的文件</span>
                    </Upload>
                </FormItem>
              </div>
        </Form>
        
      
      </Panel>
      <!-- </div> -->
    </Collapse>
    <!-- 提交按钮 -->
    <Form  label-position="right"    style="margin:0 auto;width: 441px;margin-top:15px">
      <FormItem>
        <div class='ft_public1'>
          <a href="javascript:void(0)" class="addCommon" @click="ft_agent_handleAddNature">添加代理人</a>
        </div>
      </FormItem>
    </Form>
    <div class='ft-agent-footer' style="margin:47px auto;">
      <a href="javascript:void(0)" class="ft-agent-btn1" style="margin-left:-110px" @click="plantAgent(0)">返回上一步</a>
      <a href="javascript:void(0)" class="ft_public3"  @click="ft_agent_toStep3('1')">下一步， 被告、第三人信息</a>
      <a href="javascript:void(0)" class="ft-agent-btn1" v-show="this.$store.getters.roLeName!='代理人'"  @click="ft_agent_toStep3('2')">跳过</a>
    </div>  
  </div>
</template>


<script>
import '../../casecommon/casereset.css';
import plantAgentRule from './agentRule';
import Eventbus from '../Eventbus/Eventbus.js';
export default {
  data () {
    return {
      agType:plantAgentRule.agType, //代理人类型
      agentList:plantAgentRule.agentList, //表单数据
      agentRule:plantAgentRule.agentRule, //表单规则
      agPlantConfirmList:[],
      openAry:['agent_0'],
      agent_fileName1:'', //律师函名称
      agent_fileName2:'', //律师函名称
      agent_fileName3:'', //律师函名称
      //所有的填写信息共用info
      infos:{
        formValidate:[
          [
            {
              agPlantId: 'agent_0', // 原告代理人ID标识
              agPlant: [], // 原告委托人
              agentMail:'', // 代理人邮箱地址
              agentType: '律师', // 代理人类型
              agentName: '', // 代理人姓名
              agentIdentiCard: '', // 身份证号
              agentMobile: '', // 手机号
              agentAddress: '', // 联系人地址
              lawerNum: '', // 律师执业证号
              lawFirmLetter: '', // 律师函
              lawerCardUrl: '', // 律师执业证
              commission: '', // 委托书
              lawFirm:'', //律师所（住处）

              // 上传的文件
              agent_fileName1:'', //律师函名称
              agent_fileName2:'', //律师函名称
              agent_fileName3:'', //律师函名称
            }
          ],         
        ],
        agentRule:plantAgentRule.agentRule, //表单规则
      }, //列表信息
    }
  },
  mounted () {
     //事件总线，为了与原告通信
    Eventbus.$on('ft_toStep2',payLoad=>{this.ft_getStep1_list(payLoad)}) //接收步骤一的原告列表
  },

  computed: {
    //取到ID值，commit的时候会自增ID
    ft_agent_getAgentId () {
      return this.$store.state.setcaseModules.agentId
    }
  },
  methods:{

    //返回上一页
    plantAgent (index) {
      Eventbus.$emit('ft_plant_receiveStep2',this.agPlantConfirmList); //将本页信息带回STEP1
      this.$emit('ft_agent_backStep',0);
    },

    //接收步骤一的原告列表并显示并显示到option
    ft_getStep1_list (payLoad){
      this.agPlantConfirmList = payLoad;
    },

    //表单验证,并添加到原告layers当中,注意此方法涉及到浅拷贝问题，可用过json格式转换和assign解决
    ft_agent_handleAddNature (name) {
      this.$store.commit('addAgentId');
      let ary = [
        {
          agPlantId: this.ft_agent_getAgentId, // 原告代理人ID标识
          agPlant: [], // 原告委托人
          agentMail:'', // 代理人邮箱地址
          agentType: '律师', // 代理人类型
          agentName: '', // 代理人姓名
          agentIdentiCard: '', // 身份证号
          lawerNum: '', // 律师执业证号
          agentMobile: '', // 手机号
          agentAddress: '', // 联系人地址
          lawFirmLetter: '', // 律师函
          lawerCardUrl: '', // 律师执业证
          commission: '', // 委托书
          lawFirm:'', //律师所（住处）
          // 上传的文件
          agent_fileName1:'', //律师函名称
          agent_fileName2:'', //律师函名称
          agent_fileName3:'', //律师函名称
        }
      ]
       //为了使得每次打开都是最后一次添加的
      if(this.openAry.length > 0){
        for(let i=0;i<this.openAry.length;i++){
          if(this.openAry[i] == this.infos.formValidate[this.infos.formValidate.length-1][0].agPlantId){
            this.openAry.splice(i,1);
          }
        }
      }
      //数组添加形成多个面板
      this.openAry.push(this.ft_agent_getAgentId);
      this.infos.formValidate.push(ary);
    },

      //跳过此步骤&下一步
      ft_agent_toStep3(type) {
        console.log("hello",this.agPlantConfirmList)
        switch (type) {
          case '1':
              let isFalse = true; 
              var itSelf=false;
              let formData=JSON.parse(JSON.stringify(this.infos.formValidate))
             console.log("formData",formData)
              formData.forEach((item, index) => {
                item.forEach((data, key) => {
                  let  form = 'agFromRule' + index + key;
                  this.$refs[form][0].validate((valid) => {
                    if (valid) {
                      isFalse = true;
                    } else {
                      isFalse = false;
                    }
                  });
                  //条件成立就说明是代理人自己
                  if(data.agentName==this.$store.getters.userName && data.agentIdentiCard==this.$store.getters.userIdCard){
                    itSelf=true
                  }
              });
            });
            if(!isFalse){
              this.$Notice.warning({'title':'请完善代理人信息'});
              return false;
            }
            if(this.itSelf){
              this.$Notice.warning({'title':'代理人必须包含自己！请添加！<br/>且与登陆者姓名、身份证保持一致'});
              return false;
            }
            
            //添加到数组
            for (let i = 0; i < this.agPlantConfirmList.length; i++) {
              formData.forEach((item,index) => {
                  let data=JSON.parse(JSON.stringify(item[0]))
                  this.agPlantConfirmList[i].layers.push(data);
              })
            }
            //对象去重
            for (let j = 0; j < this.agPlantConfirmList.length; j++) {
              this.agPlantConfirmList[j].layers = this.ft_agent_clearLayers(this.agPlantConfirmList[j].layers);
            }
            //提交
            this.$emit('ft_index_toStep',{state:'1',list:this.agPlantConfirmList});
            console.log("agPlantConfirmList",this.agPlantConfirmList)
            this.$Notice.success({'title':'添加成功'});

            return false;
            break;
          case '2':
            this.$emit('ft_index_toStep',{state:'2'});
            break;
          default:
            break;
        }
      },
      //删除当前代理人
      delAgPlant(data){
         
        this.infos.formValidate.forEach((item,index) => {
          
          if(item[0].agPlantId == data.agPlantId){
            this.infos.formValidate.splice(index,1)
          }
          
        })
        this.openAry.push(this.infos.formValidate[this.infos.formValidate.length-1][0].agPlantId);
      },
      //解决对象浅拷贝
      ft_agent_handleObjAssign (arr) {
        return arr.map((e)=>{
            if(typeof e === 'object'){
                return Object.assign({},e)
            }else{
                return e
            }
        })
      },

      //对象去重
      ft_agent_clearLayers (payload) {
          payload = payload.reverse();
          let obj = {};
          payload = payload.reduce(function(item, next) {
              obj[next.agPlantId] ? '' : obj[next.agPlantId] = true && item.push(next);
              return item;
          }, []);
          return payload;
      },

      //上传文件
      agent_uploadSuccess (res) {
      if(res.state === 100) {
        this.$Message.success(res.message);
        let data=res.data.result[0];
        this.infos.formValidate.forEach((item,index) => {
          if(item[0].agPlantId == data.id){
            switch (data.fileType) {
              case "律师函":
                item[0].lawFirmLetter = data.filePath;
                item[0].agent_fileName1 = data.fileName;
                break;
              case "律师执业证":
                item[0].lawerCardUrl = data.filePath;
                item[0].agent_fileName2 = data.fileName;
                break;
              case "委托书":
                item[0].commission = data.filePath;
                item[0].agent_fileName3 = data.fileName;
                break;
              default:
                break;
            }
          }
        })
        
      }else{
        this.$Message.error(res.message);
        }
      },

      //清空表单
      ft_step2_restForm () {
        this.$refs['agFromRule'].resetFields();
        this.agent_fileName1 = '';
        this.agent_fileName2 = '';
        this.agent_fileName3 = '';
        this.agPlantConfirmList = [];
      }
    }
  }
</script>

<style scoped src='./Plantagent.css'></style>

