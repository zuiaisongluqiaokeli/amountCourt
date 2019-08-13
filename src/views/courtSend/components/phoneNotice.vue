<style lang="less">
@import "./../courtSend.less";
</style>
<template>
    <div class="courtSendInfo">
        <!-- 原告 -->
        <div class="bookbuilding-table">
            <Row >
                <Col span="24" class="noemalTb th-header">
                    <span>电话通知</span>
                </Col>
            </Row>
            <div class="contain">
                <Row >
                    <Table size="small" stripe  :loading="loading" border :columns="Columns" :data="this.data" ref="table" sortable="custom"  ></Table>
                    <div class="maininfo-col-label" style="display:inline-block;padding:10px;margin:10px;">当事人关系：</div>
                    <template v-if="this.data.length>1"> 
                        <Button size='large' @click="addLitigantRelation" style="background:#2083D8;color:#fff;padding: 6px 31px;border-radius: 17px;" >添加</Button>
                    </template>
                    <Table :columns="columns1"  :data="this.relation" width="100%"></Table>
                </Row>
            </div>
            <div class="button-clas">
                <Button size='large' @click="pro" style="background:#2083D8;color:#fff;padding: 6px 31px;font-size:16px;" >保存记录</Button>
            </div>
        </div>

        <div class="bookbuilding-table">
            <Row >
                <Col span="24" class="noemalTb th-header">
                    <span>电话通知记录</span>
                </Col>
            </Row>
            <div class="contain">
                <Row >
                    <Table size="small" stripe  :loading="loading" border :columns="Columns" :data="this.data" ref="table" sortable="custom"  ></Table>
                </Row>
            </div>
            <div class="button-clas">
                <Button size='large' @click="pro" style="background:#2083D8;color:#fff;padding: 6px 31px;font-size:16px;" >下载记录列表</Button>
                <Button size='large' @click="pro" style="background:#2083D8;color:#fff;padding: 6px 31px;font-size:16px;" >打印记录列表</Button>
            </div>
        </div>
    </div>
</template>
<script>
import { formatDate } from '@/libs/date'
import {
  holiday,
} from "@/api/courtDate";
export default {
    data(){
        return{
            caseInfo:{
                time:''
            },
            editState:false,
            loading:false,
            data:[],
            relation:[],
            columns1:[
                {
                    title: '关系',
                    key: 'type',
                    width: '',
                    align: 'center'
                },
                 {
                    title: '当事人',
                    key: 'litigantNames',
                    width: '',
                    align: 'center'
                },
                {
                    title: '操作',
                    width: '',
                    align: 'center',
                 }
            ],
            Columns:[
                {
                    title: "姓名名称",
                    key: "name",
                    width: 150,
                    fixed:'left',
                },
                {
                    title: "证件号",
                    key: "name",
                    width: 150,
                },
                {
                    title: "手机号码/法人手机",
                    key: "name",
                    width: 170,
                },
                {
                    title: "户籍地址/注册地址",
                    key: "name",
                    width: 170,
                },
                {
                    title: "代理人一",
                    key: "name",
                    width: 150,
                },
                {
                    title: "代理人一手机",
                    key: "name",
                    width: 150,
                },
                 {
                    title: "代理人二",
                    key: "name",
                    width: 150,
                },
                {
                    title: "代理人二手机",
                    key: "name",
                    width: 150,
                },
                {
                    title: "操作",
                    key: "name",
                    width: 150,
                    fixed:'right'
                },
            ],
            diplist:[
                {
                    name:'传票'
                },
                {
                    name:'传票（存根）'
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

