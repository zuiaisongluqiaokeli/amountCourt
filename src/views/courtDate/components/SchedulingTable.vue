<style scoped>
.maininfo-col {
    /* height: 38px; */
    line-height: 38px;
    padding: 0 4px;
    border-right: 1px solid #e9eaec;
    border-bottom: 1px solid #e9eaec;
}
</style>
<template lang="html">
  <div class="demo">
    <schedule-calendar :events="events"
                        :dateItemRender="itemRender"
                        @event-updateView="updateView"
                        @event-click="showDetail"
                        ref="calen"></schedule-calendar>
            <Modal
              v-model="detailModal"
              width="630"
              :ok-text="'确认'"
              :loading="loading"
              @on-ok="submi"
              :cancel-text="'关闭'"
              title="详情">
                <Row>
                  <Col span="3" class="maininfo-col maininfo-col-label">
                      原告
                  </Col>
                  <Col span="21" class="" style="min-height:38px;padding: 0 4px;line-height: 30px;border-right: 1px solid #e9eaec;border-bottom: 1px solid #e9eaec;">
                      {{detailLawcase.plaintiffName}}
                      
                  </Col>
              </Row>
              <Row>
                  <Col span="3" class="maininfo-col maininfo-col-label">
                      被告
                  </Col>
                  <Col span="21" class=""  style="min-height:38px;padding: 0 4px;line-height: 30px;border-right: 1px solid #e9eaec;border-bottom: 1px solid #e9eaec;">
                      {{detailLawcase.defendantName}}
                      
                  </Col>
              </Row>
              <Row>
                  <Col span="3" class="maininfo-col maininfo-col-label">
                      案号
                  </Col>
                  <Col span="9" class="maininfo-col">
                      {{detailLawcase.caseNo}}
                  </Col>
                  <Col span="3" class="maininfo-col maininfo-col-label">
                      案由
                  </Col>
                  <Col span="9" class="maininfo-col">
                      {{detailLawcase.briefName}}
                  </Col>
              </Row>
              <Row> 
                  <Col span="3" class="maininfo-col maininfo-col-label">
                      法官
                  </Col>
                  <Col span="9" class="maininfo-col">
                      {{detailLawcase.judgeName}}
                  </Col>
                  <Col span="3" class="maininfo-col maininfo-col-label">
                      书记员
                  </Col>
                  <Col span="9" class="maininfo-col">
                      {{detailLawcase.clerkName}}
                  </Col>
              </Row>
              <Row>
                  <Col span="3" class="maininfo-col maininfo-col-label">
                      开庭时间
                  </Col>
                  <Col span="9" class="maininfo-col">
                      {{detailLawcase.startDate | formatDate}}
                  </Col>
                  <Col span="3" class="maininfo-col maininfo-col-label">
                      法庭
                  </Col>
                  <Col span="9" class="maininfo-col">
                      {{detailLawcase.tribunalName}}
                  </Col>
              </Row>
              <Row v-show="isEdit">
                  <Col span="3" class="maininfo-col maininfo-col-label">
                      修改状态
                  </Col>
                  <Col span="21"  class="maininfo-col">
                      <RadioGroup  v-model="isConfrimOpen">
                        <Radio label="1">
                            <span>确认开庭</span>
                        </Radio>
                        <Radio label="2">
                            <span>确认不开庭</span>
                        </Radio>
                    </RadioGroup>
                  </Col>
              </Row>
              <Row v-show="this.isConfrimOpen == 2">
                  <Col span="3" class="maininfo-col maininfo-col-label" style="height:90px">
                      备注
                  </Col>
                  <Col span="21" class="maininfo-col"  style="height:90px">
                      <RadioGroup v-model="remark">
                        <Radio label="庭前调解撤诉">
                            <span>庭前调解撤诉</span>
                        </Radio>
                        <Radio label="管辖权异议">
                            <span>管辖权异议</span>
                        </Radio>
                        <Radio label="未送达成功">
                            <span>未送达成功</span>
                        </Radio>
                        <Radio label="延期开庭">
                            <span>延期开庭</span>
                        </Radio>
                        <Radio label="其他">
                            <span>其他</span>
                            <Input style="width: 200px" v-model="otherRemark" />
                        </Radio>
                    </RadioGroup>
                  </Col>
              </Row>
              <Row v-show="this.isConfrimOpen == 3">
                  <Col span="4" class="maininfo-col maininfo-col-label"  style="line-height: 38px;">
                      不开庭原因
                  </Col>
                  <Col span="20" class="maininfo-col"  style="line-height: 38px;">
                      <span>{{detailLawcase.remark ? detailLawcase.remark : '无'}}</span>
                  </Col>
              </Row>
              <Row>
                  <Col span="3" class="table-border-t" :style="{minHeight: '38px'}">
                      关联案件
                  </Col>
                  <Col span="21" class="table-border-t"  v-if="detailLawcase.associateLawCase != ''" :style="{minHeight: '38px'}">
                      <a v-for="item in detailLawcase.associateLawCase" >{{ item.caseNo }}</a><br/>
                  </Col>
                  <Col span="21"  class="table-border-t" v-else>
                      <span>无</span>
                  </Col>
              </Row>
              <Row v-show="dateChecks" style="text-align:right">
                <Button  type="success" @click="goDateC">前往排期</Button>
              </Row>
          </Modal>
</div>
</template>

<script>
import { orderByTimes,updateScheduldingIsConfirmOpen } from "@/api/courtDate.js";
import { formatDate } from "@/libs/date.js";
import scheduleCalendar from "../../../components/scheduleCalendar";
import { calendarList } from "@/api/courtDate.js";
import { getJudgeList } from "@/api/judgeInfo.js";
import { lawCaseSchedulding } from "@/api/homeDate";
import Vue from "vue";

Vue.component(scheduleCalendar.name, scheduleCalendar);

export default {
    data() {
        return {
            events: [],
            itemRender(item) {
                const h = this.$createElement;
                return h("span", item.text);
            },
            isConfrimOpen:"1",
            judgeColorData: [],
            detailModal: false,
            loading: true,
            isEdit:true,
            dateChecks:false,
            otheI:true,
            year:"",
            remark:"",
            otherRemark:"",
            month:"",
            judgeIdStr:[],
            openStateid:[],
            scheduldingId:"",
            detailLawcase: {}
        };
    },
    created: function() {
        // 在vue初始化时调用
        // const now = new Date();
        // this.events = this.events.map(item => {
        //     const d = item.date.split("-")[2];
        //     item.date = `${now.getFullYear()}-${now.getMonth() + 1}-${d}`;
        //     return item;
        // });
        // this.updateView(now.getFullYear(), now.getMonth(), []);
        
    },
  methods: {
      init(){
        const now = new Date();
        this.events = this.events.map(item => {
            const d = item.date.split("-")[2];
            item.date = `${now.getFullYear()}-${now.getMonth() + 1}-${d}`;
            return item;
        });
         this.$refs.calen.showReload();
        this.updateView(now.getFullYear(), now.getMonth(), []);
       getJudgeList().then(res => {
            res.data.data.map((item, i) => {
                var obj = {};
                obj.id = item.id;
                obj.cnum = i + 1;
                this.judgeColorData.push(obj);
            });
        });
        
      },
    // changeDate(e, item, date) {
    //   const updateIndex = this.events.findIndex(ele => ele.id === item.id);
    //   this.$set(this.events, updateIndex, {
    //     ...this.events[updateIndex],
    //     date
    //   });
    // },
    changeLoading () {
        this.loading = false;
        this.$nextTick(() => {
            this.loading = true;
        });
    },
    submi(){
      if(this.isEdit == false){
        this.detailModal = false;
      }else{
        if(this.isConfrimOpen == 2){
          if(this.remark == ''){
            this.$Message.info("请添加备注");
            this.changeLoading();
            return false;
          }else if(this.remark == '其他'){
            if(this.otherRemark == ''){
              this.$Message.info("其他备注请填写");
              this.changeLoading();
              return false;
            }else{
              this.remark = this.otherRemark;
            }
          }
        }
        updateScheduldingIsConfirmOpen(this.isConfrimOpen,this.scheduldingId,this.remark).then(res => {
          if(res.data.state == 100){
            this.$Message.success(res.data.message);
            this.detailModal = false;
            this.updateView(this.year, this.month, this.judgeIdStr,this.openStateid);
          }else{
            this.changeLoading();
            this.$Message.error(res.data.message);
          }
          
        })
      }
    },
    goDateC(){
      this.$store.commit("SET_CASENO", this.detailLawcase.caseNo);
      this.$router.push({
          name: 'courtdate_index'
      });
    },
    updateView(year, month, judgeIdStr,progress) {
      let judgeIdStrForm=''
      if(judgeIdStr){
          judgeIdStrForm = judgeIdStr.join(',')
        console.log(judgeIdStrForm)
      }
      let progressStr = '';
      if(progress){
          progressStr = progress.join(',')
      }
      this.year = year;
      this.month = month;
      this.judgeIdStr = judgeIdStr;
    //   this.openStateid = openStateid;
        //openStateid=JSON.stringify(openStateid)
        // console.log(year, month, judgeIdStr,openStateid);
      calendarList(year, month + 1, judgeIdStrForm,progressStr).then(res => {
        this.$refs.calen.cloaseReload();
        if (res.data.state == 100) {
          this.events = [];
          let arr = [];
          res.data.data.result.map((item,index) => {
            //   if(index > 20){
            //       return false;
            //   }
            var obj = {};
            obj.date = formatDate(new Date(item.startDate), "yyyy-MM-dd");
            obj.text =
            item.caseNum +
              "," +
              formatDate(new Date(item.startDate), "hh:mm") +
              "," +
              item.judgeName +
              "," +
              item.tribunalName +
              "," +
              item.progress;
            obj.caseId = item.lawCaseId;
            obj.scheduldingId = item.scheduldingId ? item.scheduldingId : '';
            obj.judgeName = item.judgeName;
            // obj.openState = item.state;
            for (var i = 0; i < this.judgeColorData.length; i++) {
              if (item.judgeId == this.judgeColorData[i].id) {
                obj.status = this.judgeColorData[i].cnum;
              }
            }
            arr.push(obj);
          });
          this.events = arr;
          for(let i =0;i<this.events.length;i++){
              this.$set(this.events,i,this.events[i]);
          }
        //   this.events = JSON.parse(JSON.stringify(this.events));
        //   console.log(this.events);
        }
      });
    },
    showDetail(e, item) {
      console.log(item)
      this.isConfrimOpen = '';
      if(item.openState == 0 || item.openState == 1 ){
        this.isEdit = true;
        this.isConfrimOpen = 1;
      }else if(item.openState == 3){
        this.isEdit = true;
        this.isConfrimOpen = 2;
      }else if(item.openState == 2){
        this.isEdit = false;
        this.isConfrimOpen = 3;
      }
      if(item.openState == 3){
        this.dateChecks = true; 
      }else{
        this.dateChecks = false;
      }
      
      this.scheduldingId = item.scheduldingId;
      lawCaseSchedulding(item.caseId).then(res => {
        if (res.data.state == 100) {
          this.detailLawcase = res.data.result;
          if (this.detailLawcase.tribunalName.replace('湖里区人民法院',"")) {
              this.detailLawcase.tribunalName= this.detailLawcase.tribunalName.replace('湖里区人民法院',"");
          }
          
          this.detailModal = true;
        } else {
          this.$Message.error(res.data.message);
        }
      });
    }
  },
  filters: {
    formatDate(time) {
      if (time == "") {
        return "";
      }
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    }
  }
};
</script>

<style lang="css">
html {
  background: #eee;
}

body,
html {
  height: 100%;
  overflow: hidden;
}

body {
  margin: 0;
}

.demo {
  display: flex;
  flex-direction: column;
  height: 1000px;
  padding: 0 30px 30px;
  box-sizing: border-box;
}

.demo-title {
  text-align: center;
}
.schedule-calendar-month {
  position: inherit;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  z-index: 99;
}
.dspan_0{ 
  background: #FFE001;
}
.dspan_1{
  background: #00FF18;
}
.dspan_2{
  background: #FF2E07;
}
.dspan {
    float: left;
    line-height: 24px;
    width: 10px!important;
    height: 10px!important;
    margin: 10px 4px 4px 4px!important;
    border-radius: 8px;
}
.judgeInfo {
    width: 400px;
    background: #fff;
    position: absolute;
    right: 0px;
    top: 46px;
    z-index: 99;
    border-radius: 15px;
    padding: 5px 10px;
    box-shadow: 3px 3px 10px #9999!important;
}
</style>

