<style lang="less">
@import "./batch.less";
</style>

<template>
    <div class="batchModel">
        <Row>
            <Form ref="searchForm" :model="searchForm" inline :label-width="90" class="search-form">
                <Form-item label="请选择流程">
                    <RadioGroup v-model="step" @on-change="stepChange">
                        <Radio v-for="item in stepList" :label="item.value" :key="item.value">
                            <span style="color:red">{{item.label}}</span>
                        </Radio>
                    </RadioGroup>
                </Form-item>
                <Form-item label="案号">
                    <Input type="text" v-model="searchForm.caseNo" clearable placeholder="案号" style="width: 160px"/>
                </Form-item>
                <Form-item label="流水号">
                    <Input type="text" v-model="searchForm.flowNumber" clearable placeholder="请输入流水号" style="width: 160px"/>
                </Form-item>
                <Form-item label="当事人姓名">
                    <Input type="text" v-model="searchForm.litigantName" clearable placeholder="请输入当事人姓名" style="width: 160px"/>
                </Form-item>
                <Form-item label="代理人姓名">
                    <Input type="text" v-model="searchForm.lawyerName" clearable placeholder="请输入代理人姓名" style="width: 160px"/>
                </Form-item>
                <Form-item label="立案时间">
                    <DatePicker v-model="selectDate" type="daterange" format="yyyy-MM-dd" clearable @on-change="selectDateRange" placeholder="选择起始时间" style="width: 160px"></DatePicker>
                </Form-item>
                <Form-item style="margin-left:-35px;float:right" class="br">
                    <Button @click="handleSearch" style="background:#2083D8" type="primary" icon="ios-search">查找</Button>
                </Form-item>
            </Form>
        </Row>
        <div  style="margin-bottom:25px">
            <Row class="tables">
                <Col span='15'>
                    <Table size="small" stripe height='450' :loading="loading" border :columns="columns" :data="listData" ref="tables" sortable="custom" @on-row-click="(data,index)=> rowClick(data,index,'tables')"  @on-selection-change="changeSelect"></Table>
                    <Page style="margin:10px 0" :current="searchForm.pageNumber" :total="total" :page-size="searchForm.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" placement='top' :page-size-opts="[10,20,50,100]" size="small" show-total show-elevator show-sizer></Page>
                </Col>
                <Col span='3' class='minddleButton'>
                    <div class="middle-inner"> 
                    <Button size='large' @click="shiftIn" style="background:#2083D8;color:#fff;padding: 6px 20px;font-size:14px;width:60%" >
                        将选中移入
                        <Icon type="ios-arrow-forward"></Icon>
                    </Button>
                    <Button size='large' @click="allShiftIn" style="border:1px solid #2083D8;color:#2083D8;padding: 6px 20px;font-size:14px;width:60%" >
                        全部移入
                        <Icon type="ios-arrow-forward"></Icon>
                    </Button>
                    <Button size='large' @click="ShiftOut" style="background:#F54C4C;color:#fff;padding: 6px 20px;font-size:14px;width:60%" >
                        <Icon type="ios-arrow-back"></Icon>
                        将选中迁出
                    </Button>
                    <Button size='large' @click="allShiftOut" style="border:1px solid #F54C4C;color:#F54C4C;padding: 6px 20px;font-size:14px;width:60%" >
                        <Icon type="ios-arrow-back"></Icon>
                        全部迁出
                    </Button>
                    </div>
                </Col>
                <Col span='6'>
                    <Table size="small"  stripe height='420'  border :columns="columnsRight" :data="selectedData" ref="table" sortable="custom" @on-row-click="(data,index)=> rowClick(data,index,'table')" @on-selection-change="changeSelect2"></Table>
                </Col>
            </Row >  
        </div>
        <div class='button-clas' style='text-align:right;padding-right:30px;'>
            <Button size='large' @click="save"  style="background:#2083D8;color:#fff;padding: 6px 31px;font-size:16px;" >完成</Button>
            <Button size='large' @click="cancel" style="background:#F54C4C;color:#fff;padding: 6px 31px;font-size:16px;" >取消本次添加</Button>
        </div>
    </div>
</template>
<script>
import allColums from './batch.js';
import {
  findLawCaseList,
} from "@/api/case";
export default {
    data(){
        return{
            searchForm:{
                // netApplicationNo:"",
                startDate:"",//立案开始时间
                endDate:"",//立案结束时间
                // plaintiffName:"",
                // plaintiffLawyerName:"",
                flowNumber:"",//流水号
                caseNo:"",//案号
                litigantName:"",//当事人名称
                lawyerName:"",//代理人名称
                submitType:"已提交",//提交类型 已提交/暂存 法院端的统一都是已提交
                type:"立案",  //案件类型，枚举类型 待审核/审核通过待分案
                pageNumber: 1,
                pageSize: 50,
            },
            stepList:[
                {
                    label:'立案',
                    value:'setCase'
                },
                {
                    label:'分案',
                    value:'division'
                },
                {
                    label:'排庭',
                    value:'courtDate'
                }
            ],
            step:"setCase",
            total: 0,
            listData:[],
            loading:false,
            selectedData:[],    //完成移入的案件
            selectList:[],  //选择的数据
            selectCount:'',   //选择数量
            selectList2:[],  //选择的数据
            selectCount2:'',   //选择数量
            selectDate: null,
            columns:allColums.leftColums,
            columnsRight:allColums.rightColums,
        }
    },
    methods:{
        init(){
            this.selectedData = [];           
            this.handleSearch();
        },
        changePage(v) {
            this.searchForm.pageNumber = v;
            this.handleSearch();
        },
        changePageSize(v) {
            this.searchForm.pageSize  = v;
            this.handleSearch();
        },
        //初始化的时候默认为立案类型
        handleSearch(){
            this.loading = true;
            findLawCaseList(this.searchForm).then(res => {
                this.loading = false;
                if(res.data.state == 100){
                    let data=res.data.data;
                    this.listData = data.lawCaseList;
                    this.total = data.total;
                    setTimeout(() => {//数据全选
                        this.$refs.tables.selectAll(true);
                    }, 500);
                    this.$emit('typeEvent', this.searchForm.type);
                }else{
                    this.$Message.info(res.data.message)
                }
            })
        },
        //类型切换
        stepChange(e){
          console.log(this.step)
          switch(e){
            case "setCase":
               this.searchForm.type="立案"
            break;
            case "division":
               this.searchForm.type="分案"
            break;
            case "courtDate":
               this.searchForm.type="排庭"
            break;
          }
          this.handleSearch();//查找
        },
        //行点击事件
        rowClick(data,index,ref){
            this.$refs[ref].toggleSelect(index);// 选中/取消该行（若已选中则是取消，若已取消则是选中）
        },
        //阻止事件冒泡
        stopPropagation(e) { 
            e = e || window.event; 
            if(e.stopPropagation) { //W3C阻止冒泡方法 
                e.stopPropagation(); 
            } else { 
                e.cancelBubble = true; //IE阻止冒泡方法 
            } 
        },
        /**
         * 将选中移入
         */
        shiftIn(){
            if (this.selectCount <= 0) {
                this.$Notice.warning({
                    title: '',
                    desc: '您还未选择需要移入的案件',
                    duration: 5
                });
                return;
            }
            for(let i=0;i<this.selectList.length;i++){
                for(let u=0;u<this.listData.length;u++){
                    if(this.selectList[i].lawCaseId == this.listData[u].lawCaseId){
                        this.listData.splice(u,1);
                        u = u-1;
                    }
                }
            }

            for(let i=0;i<this.selectList.length;i++){
                this.selectedData.push(this.selectList[i])
            }

            setTimeout(() => {//数据全选
               this.$refs.table.selectAll(true);
            }, 500);

        },
        /**
         * 全部移入
         */
        allShiftIn(){

            for(let i=0;i<this.listData.length;i++){
                this.selectedData.push(this.listData[i])
            }
            this.listData = [];
        },
        /**
         * 将选中迁出
         */
        ShiftOut(){
            if (this.selectCount2 <= 0) {
                this.$Notice.warning({
                    title: '',
                    desc: '您还未选择需要迁出的案件',
                    duration: 5
                });
                return;
            }
            for(let i=0;i<this.selectList2.length;i++){
                for(let u=0;u<this.selectedData.length;u++){
                    if(this.selectList2[i].lawCaseId == this.selectedData[u].lawCaseId){
                        this.selectedData.splice(u,1);
                        u--;
                    }
                }
                
            }
            for(let i=0;i<this.selectList2.length;i++){
                this.listData.push(this.selectList2[i])
            }
        },
        //记录时间
        selectDateRange(v) {
            if (v) {
                this.searchForm.startDate = v[0];
                this.searchForm.endDate = v[1];
            }
        },
        /**
         * 全部迁出
         */
        allShiftOut(){
            for(let i=0;i<this.selectedData.length;i++){
                this.listData.push(this.selectedData[i])
            }
            this.selectedData = [];
        },
        //记录两表选择的元素
        changeSelect(e){
            this.selectList = e;
            this.selectCount = e.length;
        },
        changeSelect2(e){
            this.selectList2 = e;
            this.selectCount2 = e.length;
        },
        //完成操作
        save(){
            if(this.selectedData.length < 1){
                this.$Notice.warning({
                    title: '',
                    desc: '您还未选择需要操作的案件',
                    duration: 5
                });
                return false;
            }
            //当前选中的数据带出到父表格中
            this.$emit('saveEvent', this.selectedData);
            this.$emit('typeEvent', this.searchForm.type);
        },
        cancel(){
            this.$emit('cancelEvent');
        },
    }

}
</script>

