<template>
  <div>
    <Modal
      v-model="agreeModalStatus"
      :loading="loading"
      width="750px"
      :mask-closable="false"
      title="送达地址确认书"
    >
      <div style="height:500px;overflow-x:hidden; overflow-y:visible">
        <div style="border-top:1px solid #e9eaec;border-left:1px solid #e9eaec;">
          <Row>
            <!-- <Col
              span="2"
              class="maininfo-col top-col"
              style="min-height: 50px;background-color: #f7f7f7;line-height: 50px;text-align: center;"
            >
            <span>案号</span>
            </Col>
            <Col
              span="10"
              class="maininfo-col"
              style="min-height: 50px;"
            >
            <span>暂无</span>
            </Col> -->
            <Col
              span="2"
              class="maininfo-col  top-col"
              style="min-height: 50px;background-color: #f7f7f7;line-height: 50px;text-align: center;"
            >
            <span>案由</span>
            </Col>
            <Col
              span="22"
              class="maininfo-col"
              style="min-height: 50px;height: 50px;line-height: 50px;"
            >
            <span>{{nowCaseType}}</span>
            </Col>
          </Row>
          <Row>
            <Col
              span="2"
              class="maininfo-col top-col"
              style="min-height: 200px;background-color: #f7f7f7;text-align:center"
            >
            <p>告</p>
            <p>知</p>
            <p>事</p>
            <p>项</p>
            </Col>
            <Col
              span="22"
              class="maininfo-col content-col ft-send-confirm-modal"
              style="min-height: 200px;"
            >
            <p style="text-indent:2em">根据《民事诉讼法》第八十七条、八十八条以及最高人民法院《关于以法院专递方式邮寄送达民事诉讼文书的若干规定》第一条、第三条、第四条、第五条和第十一条的规定，告知如下：</p>
            <p style="text-indent:2em">一、为便于当事人及时收到人民法院诉讼文书，保证诉讼程序顺利进行，当事人应当如实提供确切的送达地址；</p>
            <p style="text-indent:2em">二、当事人拒绝提供自己的送达地址的，自然人依其户籍登记中的住所地或者经常居住地为送达地址；法人或者其他组织以其工商登记或者其他依法登记、备案中的住所地为送达地址；</p>
            <p style="text-indent:2em">三、因受送达人自已提供或者确认的送达地址不准确、拒不提供送达地址、送达地址变更未及时告知人民法院、受送达人本人或者受送达人的委托代理人、指定的代收人拒绝签收，导致诉讼文书未能被受送达人实际接收的，文书退回之日视为送达之日。</p>
            </Col>
          </Row>
          <Row
            v-for="(item,index) in agreeList"
            :key="index"
          >
            <Col
              span="2"
              class="maininfo-col top-col"
              style="min-height: 155px;background-color: #f7f7f7;text-align:center"
            >
            <p>送</p>
            <p>达</p>
            <p>地</p>
            <p>址</p>
            <p>{{index+1}}</p>
            </Col>
            <Col
              span="22"
              class="maininfo-col content-col ft-send-confirm-modal"
              style="min-height: 155px;"
            >
            <p style="text-indent:2em;">收件人：{{item.serviceName}}({{item.radioGroup.indexOf('agent')>-1?'代理人':'当事人'}})</p>
            <p style="text-indent:2em;">文书送达地址及邮政编码：{{item.serviceAddress}}</p>
            <p style="text-indent:2em;">联系电话：{{item.servicePhone}}</p>
            <p style="text-indent:2em;">电子送达地址（包括传真、电子邮件等）：{{item.serviceEmail}}</p>
            <Checkbox
              v-model="agreeConfirm"
              style="font-weight:600;padding-left: 2.3em;"
              disabled
            >本人同意人民法院可以采用传真、电子邮件等电子送达方式送达除判决书、栽定书、调解书以外的诉讼文书，并以传真、电子邮件等到达本人特定系统的日期为送达日期。</Checkbox>
            </Col>
          </Row>

          <Row>
            <Col
              span="2"
              class="maininfo-col top-col"
              style="min-height: 230px;background-color: #f7f7f7;text-align:center"
            >
            <p>当</p>
            <p>事</p>
            <p>人</p>
            <p>确</p>
            <p>认</p>
            </Col>
            <Col
              span="22"
              class="maininfo-col content-col ft-send-confirm-modal"
              style="min-height: 230px;"
            >
            <p style="text-indent:2em;font-weight:600">一、本人已阅读人民法院对当事人填写送达地址确认书的告知事项并清楚了解其内容及法律意义；</p>
            <p style="text-indent:2em;font-weight:600">二、本人承诺基于诚信原则进行所有诉讼活动，保证上述送达地址是准确、有效的，如无法送达，将承担相应法律责任；</p>
            <p style="text-indent:2em;font-weight:600">三、本人承诺，诉讼过程中，本人送达地址、联系方式（包括手机号码、传真号码、电子邮箱等）若有变更，或者中途撤销委托代理、委托新的代理人，需要变更送达地址人的，将以书面形式告知人民法院，确认新的送达地址，否则，人民法院可以上述地址为送达地址；</p>
            <p style="text-indent:2em;font-weight:600">四、本人确认以上地址为本案一审、二审、执行、再审等程序的送达地址；</p>
            <p style="text-indent:2em;font-weight:600">五、若本人上诉状中地址与送达地址确定书中确认的送达地址不一致的，视为本人向人民法院提供变更后的送达地址，变更后的地址相应为本案二审、执行、再审等程序的送达地址。</p>
            <p style="text-align:right">{{nowDateTime}}</p>
            </Col>
          </Row>

          <Row>
            <Col
              span="2"
              class="maininfo-col top-col"
              style="min-height: 54px;background-color: #f7f7f7;text-align:center"
            >
            <span>备注</span>
            </Col>
            <Col
              span="22"
              class="maininfo-col content-col ft-send-confirm-modal"
              style="min-height: 54px;"
            >
            <p style="text-indent:2em">当事人授权委托代理人代为签收法律文书的，代理人应当同时提交当事人签名确认的本人送达地址。</p>
            </Col>
          </Row>
        </div>
      </div>
      <div
        style="margin-top: 10px; "
        slot="footer"
      >
        <p style="float:left">
          <Checkbox
            v-model="agree_check"
            @on-change="agree_btnStatus=!agree_check"
          >我已阅读并同意以上内容</Checkbox>
        </p><br />
        <p style="text-align: right;"><Button
            type="info"
            :disabled="agree_btnStatus"
            @click="nextStepSure"
          >{{buttonStr}}</Button></p>

      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      agree_receiveType:0, //组件复用类型，单个添加or批量添加
      agreeModalStatus: false, //模态框状态
      agreeConfirm: true, //是否同意送达事项
      sureMoInfo:{},
      loading: true,
      agree_check: true,
      agree_btnStatus:false, //按钮同意状态
      buttonStr: "同意并继续",
      agreeList:[], //得到的送达列表
    };
  },

  methods: {
    //显示模态框,展示出所有数据后再开始倒计时
    async showAgreeSendModal(payload,status) {
      this.agree_receiveType = status;
      this.$Message.loading('加载中....');
      await this.showAgreeDealData(payload);
      await this.showAgreeCountTime()
    },

  //处理数据
  showAgreeDealData (payload) {
    this.agreeList = payload;
  },

  //倒计时
  showAgreeCountTime () {
    let cnt = 5;
    this.$Message.destroy();
    this.agreeModalStatus = true;
    this.agree_btnStatus = true;
    let timer = setInterval(() => {
      this.buttonStr = `同意并继续(${cnt}s)`;
      cnt  = cnt - 1;
      if(cnt <= 0) {
        clearInterval(timer);
        this.agree_btnStatus = false;
        this.buttonStr = '同意并继续';
      }
    }, 1000);
  },

  nextStepSure(){
    if (this.agree_receiveType === 0) {
      this.agreeModalStatus = false;
      this.$emit('backtoSingle');
    } else {
      this.agreeModalStatus = false;
      this.$emit('backtoMuti');
    }
    },
  },

  computed: {
    nowDateTime () {
      let myDate = new Date();
      let year =  myDate.getFullYear().toString() + '年';
      let month = (myDate.getMonth() - 0 + 1).toString() + '月';
      let date = myDate.getDate().toString() + '日';
      return year + month + date;
    },
    nowCaseType(){
      let caseType="";
      if(JSON.parse(window.localStorage.getItem("nowCase"))){
        caseType=JSON.parse(window.localStorage.getItem("nowCase")).nowCaseType;
      }
      console.log(caseType)
      return caseType;
    }
  }
};
</script>

<style scoped src='./confirmation.css'></style>
