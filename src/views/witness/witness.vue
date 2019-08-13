<template>
<div class="witness demo-tabs-style2" style="overflow:scroll">
    <Row >
        <Col span="24" class="change-tab">
            <div @click="changeMenu('tuote')" id="tuote"  class="selTabs tabOn">
                <span>举证</span>
            </div>
            <div @click="changeMenu('questionInWitness')" id="questionInWitness" class="selTabs">
                <span>质证</span>
            </div>
            <div @click="changeMenu('focusOn')" id="focusOn" class="selTabs">
                <span>争议焦点</span>
            </div>
            <div @click="changeMenu('minutes')" id="minutes" class="selTabs">
                <span>庭前会议笔录</span>
            </div>
        </Col>
    </Row>
    <div >
        <!-- 举证 -->
            <tuote v-show="showComponents == 'tuote'" :type="1" panelTitle="在线举证状态信息"/>
            <onlineProof name="eviList" ref="eviList" v-show="showComponents == 'tuote'"/>
        <!-- 质证 -->
            <tuote v-show="showComponents == 'questionInWitness'" :type="2" panelTitle="在线质证状态信息"/>
            <!-- 代理人/当事人 -->
            <onlineCertificate v-show="showComponents == 'questionInWitness' && isLawyer" ref="revertsList1" />
            <!-- 法官 -->
            <courtOnlineCertificate v-show="showComponents == 'questionInWitness' && !isLawyer" ref="revertsList2" />
        <!-- 争议焦点 -->
            <!-- 代理人/当事人 -->
            <focusInfo v-show="showComponents == 'focusOn' && isLawyer" ref="contentsd1"/>
            <!-- 法官 -->
            <courFocusInfo v-show="showComponents == 'focusOn' && !isLawyer" ref="contentsd2"/>
        <!-- 会议笔录 -->
            <!-- 代理人/当事人 -->
            <lawcaseRecord v-show="showComponents == 'minutes' && isLawyer" ref="content1"/>
            <!-- 法官 -->
            <courtLawcaseRecord v-show="showComponents == 'minutes' && !isLawyer" ref="content2" />
    </div>
</div>
</template>
<script>
import lawcaseInfo from "@/components/lawcaseInfo/lawcaseInfo.vue";
import onlineProof from "@/components/onlineProof/onlineProof.vue";
import onlineCertificate from "@/components/onlineCertificate/onlineCertificate.vue";
import courtOnlineCertificate from "@/components/onlineCertificate/courtOnlineCertificate.vue";
import focusInfo from "@/components/focusInfo/focusInfo.vue";
import courFocusInfo from "@/components/focusInfo/courFocusInfo.vue";
import lawcaseRecord from "@/components/lawcaseRecord/lawcaseRecord.vue";
import courtLawcaseRecord from "@/components/lawcaseRecord/courtLawcaseRecord.vue";
import tuote from "./componens/Tuote/tuote.vue";
import {
  findByCaseLitigant,
  modifyCaseInfo,
  addLitigant,
  createDiploms,
  queryCaseNo,
  NetworkKyc,
  listJudgeAndClerk
} from "@/api/caseCenter";
import { getEvi, getReverts } from "@/api/witness/lawcaseInfo.js";
import { fouceList, getNotes } from "@/api/courtWitness/lawCase.js";
import { formatDate } from "@/libs/date";
export default {
  components: {
    lawcaseInfo,
    onlineProof,
    onlineCertificate,
    courtOnlineCertificate,
    focusInfo,
    courFocusInfo,
    lawcaseRecord,
    courtLawcaseRecord,
    tuote,
  },
  data() {
      return{
        caseLoading: false,
        showComponents:'tuote',
        lawCaseId:this.$store.getters.caseId,
        briefName:'',
        vtab:"lawcaseInfo",
        contents:{
            content:"",
            flags:"",
            conId:""
        },
        isLawyer:true,
        litiRole:"",
        plaintiffList:[],
        defendantList:[],
        thirdList:[],
        deadDate:"",
        deadDate2:'',
        disabled:true,
        isself:1,
        caseInfo: {
            id: "",
            caseNo: "",
            court: "",
            judge: "",
            clerk: "",
            filingDate: "",
            expireDate: "",
            brief: "",
            applyStandard: "",
            allMembers: "",
            judgeId:'',
            clerkId:''
        },
        eviList:[],
        revertsList:[],
        onlineName:""
      }
  },
  created() {
  },
  mounted() {
        console.log(this.$store.getters.roLeName);
        if(this.$store.getters.roLeName=="当事人" || this.$store.getters.roLeName=="代理人"){
           this.isLawyer=true;
           this.onlineName="在线举证";
        }else{
           this.isLawyer=false;
           this.onlineName="提交证据";
        }
    },
  methods:{
      changeMenu(idName){
        let menuCard = document.getElementsByClassName("selTabs");
        for(let i=0;i<menuCard.length;i++){
            menuCard[i].classList.remove('tabOn');
        }
        let addClassN = document.getElementById(idName);
        addClassN.classList.add('tabOn');
        this.showComponents = idName;
        console.log(this.$store.getters.caseId)
        if(idName=="tuote"){ //在线举证
            getEvi(this.lawCaseId, this.isself).then(res => {
                if(res.data.state == 100){
                    var arr = [];
                    res.data.result.map((item, index) => {
                        const ss = {};
                        ss.dsrName = item.dsrName;
                        ss.dsrStatus = item.dsrStatus;
                        arr.push(ss);
                    });
                    for(var i = 0; i < arr.length-1; i++){
                       for(var j = i+1; j < arr.length; j++){
                            if(arr[i].dsrName==arr[j].dsrName){
                                arr.splice(j,1);
                                j--;
                            }
                        }
                    }
                    var newArr = arr;
                    for(var i=0;i<newArr.length;i++){
                        var arySmall = [];
                        res.data.result.map((item, index) => {
                            if(item.dsrName==newArr[i].dsrName){
                                const data = {};
                                data.id = item.evidenceId;
                                data.prove = item.prove;
                                data.name = item.name;
                                if(data.prove.length > 35){
                                    data.cellClassName = { proves: 'longText'}
                                    data.allText = 1;
                                }else{
                                    data.cellClassName = { proves: 'nolongText'}
                                    data.allText = 0;
                                }
                                data.fileAddr = item.fileAddr;
                                data.fileName = item.fileName;
                                data.fileL = item.file;
                                data.where = item.source;
                                // data.pageNum = item.
                                data.proveTime = item.time;
                                arySmall.push(data);
                            }
                        });
                        newArr[i].eviList = arySmall;
                    }
                    this.$refs.eviList.getEviList(newArr);
                }else{
                    this.$Message.error(res.data.message);
                }
            })
        }else if(idName=="questionInWitness"){     //质证列表
                getReverts(this.lawCaseId).then(res => {
                    if(res.data.state == 100){
                        if(res.data.deadlineDate == "已过期"){
                            this.deadDate2 ="已过期";
                        }else{
                            var sto = formatDate(new Date(res.data.deadlineDate), 'yyyy-MM-dd');
                            var aryStr = sto.split('-')
                            this.deadDate2 = aryStr[0] + '年' + aryStr[1] + "月" + aryStr[2] + "日";
                        }
                        console.log(this.deadDate2)
                        console.log("ssssazxx")
                        var arr = [];
                        res.data.result.map((item, index) => {
                            const ss = {};
                            ss.dsrName = item.dsrName;
                            ss.dsrStatus = item.dsrStatus;
                            ss.isLawyer = item.isLawyer;
                            arr.push(ss);
                        });
                        for(var i = 0; i < arr.length-1; i++){
                            for(var j = i+1; j < arr.length; j++){
                                if(arr[i].dsrName==arr[j].dsrName){
                                    arr.splice(j,1);
                                    j--;
                                }
                            }
                        }
                        var newArr = arr;
                        for(var i=0;i<newArr.length;i++){
                            var arySmall = [];
                            res.data.result.map((item, index) => {
                                var ty1 = 0;
                                var ty2 = 0;
                                var ty3 = 0;
                                var ty4 = 0;
                                var ty5 = 0;
                                if(item.dsrName==newArr[i].dsrName){
                                    for(var t=0;t<item.reverts.length;t++){
                                        item.reverts[t].zhen = item.reverts[t].result.substr(0,1);
                                        item.reverts[t].he = item.reverts[t].result.substr(1,1);
                                        item.reverts[t].guan = item.reverts[t].result.substr(2,1);
                                        if(item.reverts[t].result == '110' || item.reverts[t].result == '011' || item.reverts[t].result == '101'){
                                            ty2 = 1;
                                        }else if(item.reverts[t].result == '100' || item.reverts[t].result == '001' || item.reverts[t].result == '010'){
                                            ty3 = 1;
                                        }else if(item.reverts[t].result == '000'){
                                            ty4 = 1;
                                        }else if(item.reverts[t].result == '111'){
                                            ty5 = 1;
                                        }
                                    }
                                    if(ty5 == 1){
                                        ty1 = 4;     //全绿色
                                    }
                                    //越来越多反对
                                    if(ty2 == 1){
                                        ty1 = 1;
                                    }
                                    if(ty3 == 1){
                                        ty1 = 2;
                                    }
                                    if(ty4 == 1){
                                        ty1 = 3;
                                    }
                                    if(item.reverts == []){
                                        ty1 = 0;       
                                    }
                                    for(var t=0;t<item.reverts2.length;t++){
                                        var str1 = item.reverts2[t].result.substr(0,1) == 1 ? "真实性" : "";
                                        var str2 = item.reverts2[t].result.substr(1,1) ==1 ? "合法性" : "";
                                        var str3 = item.reverts2[t].result.substr(2,1) ==1 ? "关联性" : "";
                                        item.reverts2[t].ary = [];
                                        if(str1 != ""){
                                            item.reverts2[t].ary.push(str1);
                                        }
                                        if(str2 != ""){
                                            item.reverts2[t].ary.push(str2);
                                        }
                                        if(str3 != ""){
                                            item.reverts2[t].ary.push(str3);
                                        }
                                    }
                                    const data2 = {};
                                    data2.id = item.evidenceId;
                                    data2.prove = item.prove==null? "" : item.prove;
                                    data2.name = item.name;
                                    data2.fileAddr = item.fileAddr;
                                    data2.colorState = ty1;
                                    data2.fileName = item.fileName;
                                    data2.fileL = item.file;
                                    data2.proveTime = item.time;
                                    if(ty1 == 0){
                                        if(data2.prove.length > 35){
                                            data2.cellClassName = { proves: 'longText', reState: 'demo-table-error-row' }
                                            data2.allText = 1;
                                        }else{
                                            data2.cellClassName = { proves: 'nolongText', reState: 'demo-table-error-row' }
                                            data2.allText = 0;
                                        }
                                    }else if(ty1 == 1){
                                        if(data2.prove.length > 35){
                                            data2.cellClassName = { proves: 'longText', reState: 'demo-table-error-row1' }
                                            data2.allText = 1;
                                        }else{
                                            data2.cellClassName = { proves: 'nolongText', reState: 'demo-table-error-row1' }
                                            data2.allText = 0;
                                        }
                                    }else if(ty1 == 2){
                                        if(data2.prove.length > 35){
                                            data2.cellClassName = { proves: 'longText', reState: 'demo-table-error-row2' }
                                            data2.allText = 1;
                                        }else{
                                            data2.cellClassName = { proves: 'nolongText', reState: 'demo-table-error-row2' }
                                            data2.allText = 0;
                                        }
                                    }else if(ty1 == 3){
                                        if(data2.prove.length > 35){
                                            data2.cellClassName = { proves: 'longText', reState: 'demo-table-error-row3' }
                                            data2.allText = 1;
                                        }else{
                                            data2.cellClassName = { proves: 'nolongText', reState: 'demo-table-error-row3' }
                                            data2.allText = 0;
                                        }
                                    }else if(ty1 == 4){
                                        if(data2.prove.length > 35){
                                            data2.cellClassName = { proves: 'longText', reState: 'demo-table-error-row4' }
                                            data2.allText = 1;
                                        }else{
                                            data2.cellClassName = { proves: 'nolongText', reState: 'demo-table-error-row4' }
                                            data2.allText = 0;
                                        }
                                    }
                                    data2.reverts = item.reverts;
                                    data2.reverts2 = item.reverts2;
                                    data2.dsrStatus = newArr[i].dsrStatus;
                                    data2.dsrName = newArr[i].dsrName;
                                    data2.isLawyer = item.isLawyer;
                                    data2.where = item.source;
                                    data2.isSameSite = item.isSameSite;
                                    data2.isself = item.isself;
                                    data2.peopleNum = item.reverts.length;
                                    arySmall.push(data2);
                                }
                            });
                            newArr[i].eviList = arySmall;
                        }
                        var plaintiff = [];
                        var defendant = [];
                        var third = [];
                        var allNewArr = [];
                        var judgeArr = [];
                        console.log("newArr",newArr)
                        for(var i=0;i<newArr.length;i++){
                            if(newArr[i].dsrStatus == '原告'){
                                plaintiff.push(newArr[i]);
                            }else if(newArr[i].dsrStatus == '被告'){
                                defendant.push(newArr[i]);
                            }else if(newArr[i].dsrStatus == '第三人'){
                                third.push(newArr[i])
                            }else if (newArr[i].dsrStatus == '法官'){
                                judgeArr.push(newArr[i])
                            }
                        }
                        allNewArr = {
                            plaintiff:plaintiff,
                            defendant:defendant,
                            third:third,
                            judge:judgeArr,
                        }
                        console.log(allNewArr)
                        if(this.isLawyer){
                           this.$refs.revertsList1.getRevertsList(allNewArr,this.deadDate2);
                        }else{
                           this.$refs.revertsList2.getRevertsList(allNewArr,this.deadDate2);
                        }
                    }else{
                        this.$Message.error(res.data.message);
                    }
                })
            }else if(idName=="focusOn"){   //争议焦点
                if(this.isLawyer){
                    this.$refs.contentsd1.getContents();
                }else{
                    this.$refs.contentsd2.getContents();
                }
            } else if(idName=="minutes"){  //庭前会议笔录
                if(this.isLawyer){
                    this.$refs.content1.getNote();
                }else{
                    this.$refs.content2.getNote();
                }
            } 
       },
      showCase(id) {
        findByCaseLitigant(id)
          .then(res => {
            this.plaintiffList = [];
            this.defendantList = [];
            this.thirdList = [];
            if (res.data.state === 100) {
              const caseInfo = res.data.result.caseInfo;
              const defendantList = res.data.result.defendantList;
              const plaintiffList = res.data.result.plaintiffList;
              const thirdList = res.data.result.thirdList;
              this.briefName = caseInfo.brief.name + '　(' +caseInfo.caseNo + ')' ;
              this.caseInfo.id = caseInfo.id.toString();
              this.litiRole = res.data.roleName;
              this.caseInfo.caseNo = caseInfo.caseNo;
              this.caseInfo.court = caseInfo.court.name;
              this.caseInfo.judge = caseInfo.judge.name;
              this.caseInfo.clerk = caseInfo.clerk.name;
              this.caseInfo.filingDate = caseInfo.filingDate;
              this.caseInfo.expireDate = caseInfo.expireDate;
              this.caseInfo.brief = caseInfo.brief.name;
              this.caseInfo.applyStandard = caseInfo.applyStandard;
              this.caseInfo.allMembers =
                caseInfo.allMembers == null ? "" : caseInfo.allMembers;
              plaintiffList.map((item, index) => {
                const data = {};
                data.id = item.id;
                data.litigantName = item.litigantName;
                data.identityCard = item.identityCard;
                data.litigantPhone = item.litigantPhone;
                data.address = item.address;
                this.plaintiffList.push(data);
              });
              defendantList.map((item, index) => {
                const data = {};
                data.id = item.id;
                data.litigantName = item.litigantName;
                data.identityCard = item.identityCard;
                data.litigantPhone = item.litigantPhone;
                data.address = item.address;
                this.defendantList.push(data);
              });
              thirdList.map((item, index) => {
                const data = {};
                data.id = item.id;
                data.litigantName = item.litigantName;
                data.identityCard = item.identityCard;
                data.litigantPhone = item.litigantPhone;
                data.address = item.address;
                this.thirdList.push(data);
              });
            }
          })
          .catch(() => {});
        },
  }

}
</script>

<style>
.demo-tabs-style > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab{
    border-radius: 0;
    background: #fff;
}
.demo-tabs-style2 > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active{
    border-top: 1px solid #3399ff;
}
.demo-tabs-style2 > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active:before{
    content: '';
    display: block;
    width: 100%;
    height: 1px;
    background: #3399ff;
    position: absolute;
    top: 0;
    left: 0;
}
.demo-tabs-style1 > .ivu-tabs-card > .ivu-tabs-content {
        height: 120px;
        margin-top: -16px;
    }

    .demo-tabs-style1 > .ivu-tabs-card > .ivu-tabs-content > .ivu-tabs-tabpane {
        background: #fff;
        padding: 16px;
    }

    .demo-tabs-style1 > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
        border-color: transparent;
        
    }
</style>

