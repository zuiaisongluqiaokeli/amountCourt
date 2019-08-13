<style lang="less">
@import "./../batch.less";
</style>

<template>
    <div class="batchModel">
        <Row>
            <Form ref="searchForm" :model="searchForm" inline :label-width="80" class="search-form">
                <!-- <Form-item label="网申号">
                    <Input type="text" v-model="searchForm.netApplicationNo" clearable placeholder="网申号" style="width: 190px"/>
                </Form-item> -->
                <Form-item label="案号">
                    <Input type="text" v-model="searchForm.caseNo" clearable placeholder="案号" style="width: 190px"/>
                </Form-item>
                <Form-item label="批次流水号">
                    <Input type="text" v-model="searchForm.flowNumber" clearable placeholder="请输入批次流水号" style="width: 190px"/>
                </Form-item>
                <Form-item label="原告">
                    <Input type="text" v-model="searchForm.plaintiffName" clearable placeholder="请输入原告姓名" style="width: 190px"/>
                </Form-item>
                <Form-item label="原告代理人">
                    <Input type="text" v-model="searchForm.plaintiffLawyerName" clearable placeholder="请输入原告代理人姓名" style="width: 190px"/>
                </Form-item>
                <Form-item label="时间范围">
                    <DatePicker v-model="selectDate" type="daterange" format="yyyy-MM-dd" clearable @on-change="selectDateRange" placeholder="选择起始时间" style="width: 200px"></DatePicker>
                </Form-item>
                <Form-item label="送达对象">
                    <CheckboxGroup v-model="dipObj">
                        <Checkbox label="原告" ></Checkbox>
                        <Checkbox label="被告" ></Checkbox>
                    </CheckboxGroup>
                </Form-item>
                <Form-item label="地址选择" style="width: 700px;">
                    <Checkbox
                    :indeterminate="indeterminate"
                    :value="checkAll"
                    @click.prevent.native="handleCheckAll">所有地址</Checkbox>
                    <CheckboxGroup v-model="adressObj" @on-change="checkAllGroupChange" style="display: inline-block;">
                        <Checkbox label="户籍地址" ><span>户籍地址</span></Checkbox>
                        <Checkbox label="经常居住地址" ><span>经常居住地址</span></Checkbox>
                        <Checkbox label="送达地址" ><span>送达地址</span></Checkbox>
                        <Checkbox label="注册地址" ><span>注册地址</span></Checkbox>
                        <Checkbox label="其他地址" ><span>其他地址</span></Checkbox>
                        <Checkbox label="工作单位地址" ><span>工作单位地址</span></Checkbox>
                    </CheckboxGroup>
                </Form-item>
                <Form-item style="margin-left:-35px;float:right" class="br">
                    <Button @click="handleSearch" style="background:#2083D8" type="primary" icon="ios-search">查找</Button>
                </Form-item>
            </Form>
        </Row>
        <div  style="margin-bottom:25px">
            <Row class="tables">
                <Col span='15'>
                    <Table size="small" stripe height='420' :loading="loading" border :columns="columns" :data="listData" ref="tables" sortable="custom"  @on-selection-change="changeSelect"></Table>
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
                    <Table size="small"  stripe height='420'  border :columns="columnsRight" :data="selectedData" ref="table" sortable="custom"  @on-selection-change="changeSelect2"></Table>
                </Col>
            </Row >  
        </div>
        <div class='button-clas' style='text-align:right;padding-right:30px;'>
            <Button size='large' :loading="buttonLoading" @click="save"  style="background:#2083D8;color:#fff;padding: 6px 31px;font-size:16px;" >完成</Button>
            <Button size='large' @click="cancel" style="background:#F54C4C;color:#fff;padding: 6px 31px;font-size:16px;" >取消本次添加</Button>
        </div>
    </div>
</template>
<script>
import allColums from './../batch.js';
import {
  findLawCaseList,
} from "@/api/case";
import {
  findLitigantLawCaseQuery,
} from "@/api/batch";
export default {
    data(){
        return{
            searchForm:{
                netApplicationNo:"",
                startDate:"",
                endDate:"",
                plaintiffName:"",
                plaintiffLawyerName:"",
                flowNumber:"",
                caseNo:"",
                submitType:"已提交",//提交类型 已提交/暂存 法院端的统一都是已提交
                type:"已分案",  //案件类型，枚举类型 待审核/审核通过待分案/已分案
                pageNumber: 1,
                pageSize: 50,
            },
            total: 0,
            dipObj:['原告','被告'],
            adressObj:[],
            listData:[],
            indeterminate: false,
            buttonLoading:false,
            checkAll: false,
            loading:false,
            selectedData:[],    //完成移入的案件
            selectList:[],  //选择的数据
            selectCount:'',   //选择数量
            selectList2:[],  //选择的数据
            selectCount2:'',   //选择数量
            selectDate: null,
            columns:allColums.caseLeftColums,
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
                }else{
                    this.$Message.info(res.data.message)
                }
            })
        },
        /**
         * 全选
         */
        handleCheckAll () {
            if (this.indeterminate) {
                this.checkAll = false;
            } else {
                this.checkAll = !this.checkAll;
            }
            this.indeterminate = false;

            if (this.checkAll) {
                this.adressObj = ['户籍地址', '经常居住地址', '送达地址','注册地址','其他地址','工作单位地址'];
            } else {
                this.adressObj = [];
            }
        },
        checkAllGroupChange (data) {
            if (data.length === 3) {
                this.indeterminate = false;
                this.checkAll = true;
            } else if (data.length > 0) {
                this.indeterminate = true;
                this.checkAll = false;
            } else {
                this.indeterminate = false;
                this.checkAll = false;
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
        changeSelect(e){
            this.selectList = e;
            this.selectCount = e.length;
        },
        changeSelect2(e){
            this.selectList2 = e;
            this.selectCount2 = e.length;
        },
        save(){
            if(this.selectedData.length < 1){
                this.$Notice.warning({
                    title: '',
                    desc: '您还未选择需要操作的案件',
                    duration: 5
                });
                return false;
            }
            let ary = [];
            for(let i=0;i<this.selectedData.length;i++){
                ary.push(this.selectedData[i].lawCaseId)
            }
            let type = "";
            for (let i = 0; i < this.dipObj.length; i++) {
                if(this.dipObj.length==1){
                   if(this.dipObj[i]=='原告'){
                        type = 0;
                        break;
                   }
                   if(this.dipObj[i]=='被告'){
                        type = 1;
                        break;
                   }
                }
            }
            let params ={
                lawCaseId:ary,
                litigantType:type,
                addressType:this.adressObj
            }
            this.buttonLoading = true;
            findLitigantLawCaseQuery(params).then(res => {
                if(res.data.state == 100){
                    this.buttonLoading = false;
                    this.$emit('saveEvent', res.data.data.list);
                }else{
                    this.$Notice.warning({
                        title: '',
                        desc: res.data.message,
                        duration: 5
                    });
                }
            })

        },
        cancel(){
            this.$emit('cancelEvent');
        },
    }

}
</script>

