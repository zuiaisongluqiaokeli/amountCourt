<style lang="less">
@import "../common.less";
</style>
<template>
    <div class="tuoteInfo">
        <div class="bookbuilding-table">
            <Row >
                <Col span="24" class="noemalTb th-header">
                    <span>在线质证状态信息</span>
                </Col>
            </Row>
            <div class="contain">
                <Row class="tabls">
                    <Col span="2" class="noemalTb tb-head">
                        案件状态
                    </Col>
                    <Col span="4" class="noemalTb">
                        <span>举证期</span>
                    </Col>
                    <Col span="2" class="noemalTb tb-head">
                        在线举证端口
                    </Col>
                    <Col span="4" class="noemalTb">
                        <span>3</span>
                    </Col>
                    <Col span="2" class="noemalTb tb-head">
                        举证截止时间
                    </Col>
                    <Col span="4" class="noemalTb">
                        <span>非覆盖</span>
                    </Col>
                    <Col span="2" class="noemalTb tb-head">
                        举证情况
                    </Col>
                    <Col span="4" class="noemalTb">
                        <span>非覆盖</span>
                    </Col>

                </Row>
                <Row class="tabs" style="">
                    <Col span="3" align="left" valign="middle" class="Tbs height-wit tb-head" style="position:absolute;font-size:13px;">
                        有关条款说明
                    </Col>
                    <Col span="21" align="left" class="Tbs height-wit" style="float: right;">
                        <span>
                            多打手打搜房和说说到被次撒大大合伙人多打手打搜房和说说到被次撒大大合伙人多打手打搜房和说说到被次撒大大合伙人
                            多打手打搜房和说说到被次撒大大合伙人多打手打搜房和说说到被次撒大大合伙人多打手打搜房和说说到被次撒大大合伙人
                            多打手打搜房和说说到被次撒大大合伙人多打手打搜房和说说到被次撒大大合伙人多打手打搜房和说说到被次撒大大合伙人
                            多打手打搜房和说说到被次撒大大合伙人多打手打搜房和说说到被次撒大大合伙人多打手打搜房和说说到被次撒大大合伙人
                            多打手打搜房和说说到被次撒大大合伙人多打手打搜房和说说到被次撒大大合伙人多打手打搜房和说说到被次撒大大合伙人
                        </span>
                    </Col>
                </Row>
            </div>
            <div class="button-clas">
                <Button size='large' @click="pro" style="background:#2083D8;color:#fff;padding: 6px 31px;font-size:16px;" >编辑</Button>
            </div>
        </div>

        <div class="bookbuilding-table">
            <Row >
                <Col span="24" class="noemalTb th-header">
                    <span>在线质证详情</span>
                </Col>
            </Row>
            <div class="contain">
                <Table :columns="columns"  :data="eviList"></Table>
            </div>
            <div class="button-clas">
                <Button size='large' @click="pro" style="background:#2083D8;color:#fff;padding: 6px 31px;font-size:16px;" >发表/修改法庭意见</Button>
                <Button size='large' @click="pro" style="background:#2083D8;color:#fff;padding: 6px 31px;font-size:16px;" >发表/撤回质证意见</Button>
            </div>
        </div>
    </div>
</template>
<script>
import { formatDate } from '@/libs/date'
import {
  holiday,
} from "@/api/courtDate";
import expandRow from '@/components/tableExpand/tableExpand.vue';
export default {
    data(){
        return{
            caseInfo:{
                time:''
            },
            editState:false,
            diplist:[
                {
                    name:'传票'
                },
                {
                    name:'传票（存根）'
                },
            ],
            eviList:[
                {
                    name:'测试数据'
                }
            ],
            columns:[

                {
                    title: "证据名称",
                    key: "name",
                    width: 180,
                    align: "center",
                },
                {
                    title: "证明对象",
                    key: "proves",
                    width: 240,
                    align: "center",
                },
                {
                    title: "证据来源",
                    key: "proves",
                    width: 200,
                    align: "center",
                },
                {
                    title: "证据页数",
                    key: "reState",
                    // width: 115,
                    align: "center",
                },
                {
                    title: "提交者",
                    key: "reState",
                    width: 115,
                    align: "center",
                },
                {
                    title: "提交时间",
                    key: "reState",
                    width: 115,
                    align: "center",
                },
                {
                    title: "状态",
                    key: "reState",
                    width: 115,
                    align: "center",
                },
                {
                    type: 'expand',
                    key:"seld",
                    align: "center",
                    width: 50,
                    _expanded:true,
                    className:"",
                    render: (h, params) => {
                        return h(expandRow, {
                            props: {
                                row: params.row.reverts,
                                row2: params.row.reverts2
                            }
                        })
                    }
                },
            ],
        }
    },
    methods:{
        pro(){

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

