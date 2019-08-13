<style lang="less">
@import "./../courtDiplomas.less";
</style>
<template>
    <div class="diplomasRecordInfo" style="position:relative">
        <Spin size="large" fix v-show="isLoading"></Spin>
        <!-- 原告 -->
        <div class="bookbuilding-table">
            <Row >
                <Col span="24" class="noemalTb th-header">
                    <span>文书生成记录</span>
                </Col>
            </Row>
            <div v-show="numList.length == 0" style="text-align:center;padding:30px">
                <h3>暂无数据</h3>
            </div>
            <div class="contain" v-for="item in numList">
                <Row class="tabls">
                    <Col span="24" class="noemalTb tb-head">
                        {{item.litigant ? item.litigant.litigantName +'(' +item.litigant.litigationStatus.litigantStatusName + ")"+ "&nbsp;&nbsp;文书生成概况" : ""}} 
                    </Col>
                    <Col span="2" class="noemalTb tb-head">
                        生成时间
                    </Col>
                    <Col span="6" class="noemalTb">
                        <span>{{item.buildTime | formatStartDate}}</span>
                    </Col>
                    <Col span="2" class="noemalTb tb-head">
                        操作员
                    </Col>
                    <Col span="6" class="noemalTb">
                        <span>{{item.operatorName}}</span>
                    </Col>
                    <Col span="2" class="noemalTb tb-head">
                        生成批次
                    </Col>
                    <Col span="6" class="noemalTb">
                        <span>{{item.batch}}</span>
                    </Col>
                    <!-- <Col span="2" class="noemalTb tb-head">
                        生成覆盖情况
                    </Col>
                    <Col span="4" class="noemalTb">
                        <span>非覆盖</span>
                    </Col> -->
                    <Col span="24" class="noemalTb tb-head">
                        本次生成文书列表
                    </Col>
                    <div span="24" class="noemalTb">
                        <CheckboxGroup v-model="item.dipGroup" @on-change="checkDip(item)">
                            <span v-for="d in item.diplomsList"><Checkbox :label="d"></Checkbox></span>
                        </CheckboxGroup>
                        <div style="text-align:right">
                            <Checkbox @on-change="checkAllDip(item)" v-model="item.allCkeck">全选/取消全选</Checkbox>
                        </div>
                    </div>
                    <Col span="24" class="noemalTb">
                        <div class="button-clas">
                            <Button size='large' @click="downAll(item)" :loading="item.loading1" style="background:#2083D8;color:#fff;padding: 6px 31px;font-size:16px;" >下载全部文书</Button>
                            <Button size='large' @click="downSel(item)" style="background:#2083D8;color:#fff;padding: 6px 31px;font-size:16px;" >下载所选文书</Button>
                            <Button size='large' @click="viewAll(item)" style="background:#2083D8;color:#fff;padding: 6px 31px;font-size:16px;" >打印全部文书</Button>
                            <Button size='large' @click="viewSel(item)" style="background:#2083D8;color:#fff;padding: 6px 31px;font-size:16px;" >打印所选文书</Button>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    </div>
</template>
<script>
import { formatDate } from '@/libs/date'
import { 
    historyDiplomsList,
    downloadDiploms,
    viewDiploms
} from "@/api/diplomas";
import { tools_downLoad } from '@/libs/tools.js';
export default {
    data(){
        return{
            caseInfo:{
                time:''
            },
            editState:false,
            allCkeck:false,
            isLoading:false,
            caseId:this.$store.getters.caseId,
            numList:[],
            diplist:[
                {
                    name:'传票'
                },
                {
                    name:'传票（存根）'
                },
            ],
            SchedulingList:[
                {
                    name:1
                },
                {
                    name:2
                },
            ]
        }
    },
    methods:{
        /**
         * 选中文书
         */
        checkDip(data){
            console.log(data.dipGroup)
            if(data.dipGroup.length < data.diplomsList.length){
                data.allCkeck = false;
            }else{
                data.allCkeck = true;
            }
        },
        /**
         * 全选
         */
        checkAllDip(data){
            console.log(data.allCkeck)
            if(data.allCkeck){
                data.dipGroup = data.diplomsList;
            }else{
                data.dipGroup = [];
            }
        },
        /**
         * 下载所有的文书
         */
        downAll(data){
            downloadDiploms(
                data.litigant.id,
                data.batch,
                data.diplomsList.join(',')
            ).then(res => {
                if(res.data.state == 100){
                    tools_downLoad(res.data.data)
                }else{
                    this.$Notice.warning({
                        title: '',
                        desc: res.data.message,
                        duration: 5
                    });
                }
            })
        },
        /**
         *下载选中的文件
         */
        downSel(data){
            if(data.dipGroup){
                if(data.dipGroup.length < 1){
                    this.$Notice.warning({
                        title: '',
                        desc: '请选择需要下载的文书',
                        duration: 5
                    });
                    return false;
                }
            }else{
                this.$Notice.warning({
                    title: '',
                    desc: '请选择需要下载的文书',
                    duration: 5
                });
                return false;
            }
            downloadDiploms(
                data.litigant.id,
                data.batch,
                data.dipGroup.join(',')
            ).then(res => {
                if(res.data.state == 100){
                    tools_downLoad(res.data.data)
                }else{
                    this.$Notice.warning({
                        title: '',
                        desc: res.data.message,
                        duration: 5
                    });
                }
            })
        },
        /**
         * 打印所有文书
         */
        viewAll(data){
            viewDiploms(
                data.litigant.id,
                data.batch,
                data.diplomsList.join(',')
            ).then(res => {
                if(res.data.state == 100){
                    window.open(res.data.data)
                }else{
                    this.$Notice.warning({
                        title: '',
                        desc: res.data.message,
                        duration: 5
                    });
                }
            })
        },
        /**
         * 打印选中文书
         */
        viewSel(data){
            if(data.dipGroup){
                if(data.dipGroup.length < 1){
                    this.$Notice.warning({
                        title: '',
                        desc: '请选择需要下载的文书',
                        duration: 5
                    });
                    return false;
                }
            }else{
                this.$Notice.warning({
                    title: '',
                    desc: '请选择需要下载的文书',
                    duration: 5
                });
                return false;
            }
            viewDiploms(
                data.litigant.id,
                data.batch,
                data.dipGroup.join(',')
            ).then(res => {
                if(res.data.state == 100){
                    window.open(res.data.data)
                }else{
                    this.$Notice.warning({
                        title: '',
                        desc: res.data.message,
                        duration: 5
                    });
                }
            })
        },
        pro(){

        },
        init(){
            this.isLoading = true;
            historyDiplomsList(this.caseId).then(res => {
                this.isLoading = false;   
                if(res.data.state == 100){
                    if(res.data.data){
                        this.numList = res.data.data.sort(this.listSet('batch'));
                    }   
                    
                }             
            })
        },
        listSet(property){
            return function(a,b){
                var value1 = a[property];
                var value2 = b[property];
                return value2 - value1;
            }
        }
    },
    filters: {
      formatDate(time) {
          if (time == '') {
              return '';
          }
          var date = new Date(time);
          return formatDate(date, 'yyyy-MM-dd');
      },
      whether(boole) {
          return boole ? '是' : '否';
      },
      filCheck(boole) {
          return boole == 0 ? '未确认' : '已确认';
      },
      formatStartDate(time) {
          if (time == '') {
              return '';
          }
          var date = new Date(time);
          return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
}
</script>

