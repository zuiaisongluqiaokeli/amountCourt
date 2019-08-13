<style lang="less">
@import "./reset.less";
</style>
<template>
    <div class="reviewsCase fde" style="height:100%">
        <Row>
            <Col span="24" style="min-height:100%">
                <!-- <Card style="min-height:95%" class="">      -->
                    <Row class="operation" style="margin-bottom:15px;">
                      <!-- <Button size='large' @click="showRject" :loading="proLoading" style="background:#2083D8;color:#fff;float:right;margin-right:15px;" >生成并查看</Button> -->
                        <Button size='large' @click="showGO" style="background:#2083D8;float:right;margin-right:15px;"  type="primary" >为选中的案件转普并修改审限</Button>
                        
                        <Button size='large' @click="addBatchList"  style="background:#2083D8;color:#fff;float:left;margin-right:15px;" >添加案件到批量工作列表</Button>
                        <Dropdown  class="dropMenu"  @on-click="handleDropdown">
                          <Button size='large' type="primary" >
                            更多操作
                            <Icon type="ios-arrow-down"></Icon>
                          </Button>
                          <DropdownMenu size='large' slot="list">
                            <DropdownItem size='large' style="color:red" name="clear">清空工作列表</DropdownItem>
                            <DropdownItem size='large' name="refresh">刷新</DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                        
                    </Row>

                     <Row>
                        <Alert show-icon>
                            已选择 <span class="select-count">{{selectCount}}</span> 项
                            <a class="select-clear" @click="clearSelectAll">清空</a>
                        </Alert>
                        <Alert type="warning" v-show="isError" show-icon closable>
                            <span>成功案件个数：{{successNumber}}</span><br/>
                            <span>失败案件个数：{{failedNumber}}</span><br/>
                            <span>失败原因：{{reason}}</span>
                        </Alert>
                    </Row>
                    <Row class="tables">
                        <Table size="small" stripe style="min-height:350px" :loading="loading" border :columns="columns" :data="data" ref="table" sortable="custom"  @on-selection-change="changeSelect"></Table>
                    </Row>
                    <Row type="flex" justify="end" class="page" style="margin-top:10px;height:30px;">
                        <Page :current="pageNumber" :total="total" :page-size="pageSize" @on-change="changePage" @on-page-size-change="changePageSize" placement='top' :page-size-opts="[10,20,50,100]" size="small" show-total show-elevator show-sizer></Page>
                    </Row>
                <!-- </Card> -->
            </Col>
        </Row>
        <Modal
            v-model="modal1"
            title="添加案件到批量处理列表"
            :mask-closable="false"
            :styles="{top: '20px'}"
            :width="modalWidth">
            <div class="components-container">
              <batch @cancelEvent="closeModel" @saveEvent='changeList'  ref="batch" />
            </div>
            <div slot="footer">
            </div>
        </Modal>
        <Modal
            v-model="modal2"
            title="转普通程序并修改审限"
            :mask-closable="false"
            :styles="{top: '20px'}"
            :width="modalWidth">
            <div class="components-container">
              <changeNormalBatch @cancelEvent="closeModel2" :listData2='selectList' ref="handle" />
            </div>
            <div slot="footer">
            </div>
        </Modal>
        <!-- 转普审批表查看 -->
        <Modal
            v-model="fileShow"
            width="720px"
            :styles="{top: '20px'}"
            :mask-closable="false"
            title="转普审批表查看">
            <div v-if="filePath != ''">
                <iframe
                  scrolling="auto"
                  :src="'http://view.officeapps.live.com/op/view.aspx?src='+allHost+filePath"
                  class="scrollStyle"
                  frameborder="0"
                  style="height:670px"
                  width="100%"
                  height="100%"
                >该浏览器暂不支持文档浏览，您可以下载该文件进行查看:
                  <a :src="allHost+filePath" rel="external nofollow">下载文档文件</a>
                </iframe>
            </div>
            <div slot="footer">
                <Button @click="fileShow = false"  type="dashed" size="large">关闭</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import {
  downloadZip
} from "@/api/batch";
import {
  findLawCaseList,
} from "@/api/case";
import { tools_downLoad } from '@/libs/tools.js';
import { formatDate } from '@/libs/date';
import batch from "@/components/batch/dipmosAss/dipmosAssBatchList.vue";
import changeNormalBatch from "@/components/batch/changeNormal/changeNormalBatch.vue";
export default {
  name: "role-manage",
  components: {
    batch,
    changeNormalBatch
  },
  data() {
    var width = window.innerWidth - 100;
    return {
      loading: false,
      modal1:false,
      modalWidth:width,
      filePath:"",
      allHost: "",
      fileShow:false,
      modal2:false,
      isError:false,
      successNumber:"",
      failedNumber:"",
      reason:"",
      proLoading:false,
      selectList:[],  //选择的数据
      selectCount:0,   //选择数量
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center",
        },
        // {
        //   title: "网申号",
        //   key: "netApplicationNo",
        //   width: 160,
        // },
        {
          title: "案号",
          key: "caseNo",
          align: "center",
          width: 180,
        },
        {
          title: "案由",
          key: "briefName",
          align: "center",
          // width: 150,
        },
        {
          title: "原告",
          align: "center",
          key: "plaintiffName",
        },
        {
          title: "被告",
          align: "center",
          key: "defendantName",
          // width: 300,
        },
        {
          title: "承办法官",
          align: "center",
          key: "judgeName",
        },
        {
          title: "书记员",
          align: "center",
          key: "clerkName",
          // width:90,
        },
        {
          title: "立案日期",
          align: "center",
          key: "clerk",
          width:100,
          render: (h, params) => {
                return h(
                    'span',
                    {},
                    formatDate(new Date(params.row.filingDate), 'yyyy-MM-dd')
                );
          }
        },
        {
          title: "审限届满日期",
          key: "clerk",
          align: "center",
          width:100,
          render: (h, params) => {
                return h(
                    'span',
                    {},
                    formatDate(new Date(params.row.endTrialDate), 'yyyy-MM-dd')
                );
          }
        },
        {
          title: "适用程序",
          key: "procedureType",
          align: "center",
          width:110,
        },
        {
          title: "转普审批表",
          key: "clerk",
          // width:200,
          align: "center",
          render: (h, params) => {
                let objD = "";
                if(params.row.diplomsPath == '' || params.row.procedureType=="简易程序"){
                  objD = "暂无"
                }else{
                  objD = [
                    h(
                      "Button",
                      {
                        props: {
                          type: "success",
                          size: "small",
                        },
                        on: {
                          click: () => {
                            this.fileShow = true;
                            let protocolStr = document.location.protocol;
                            let k_host = document.domain;
                            this.allHost = protocolStr + "//" + k_host + "/";
                            // this.allHost = 'http://courtfinancedev.ptnetwork001.com' + "/";
                            this.filePath = params.row.diplomsPath;
                            console.log(this.allHost + this.filePath)
                          }
                        }
                      },
                      "查看"
                    )
                  ]
                }
                return h(
                    'div',
                    {},
                    objD
                );
          }
        },
      ],
      data: [],
      pageNumber: 1,
      pageSize: 10,
      total: 0,
    };
  },
  methods: {
    init() {
      // this.getRoleList();
    },
    changePage(v) {
      this.pageNumber = v;
      this.getRoleList();
    },
    changePageSize(v) {
      this.pageSize = v;
      this.getRoleList();
    },
    getRoleList() {
      this.selectList = [];
      this.selectCount = 0;
      this.loading = true;
      let params = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        submitType:"已提交",//提交类型 已提交/暂存 法院端的统一都是已提交
        type:"已分案",  //案件类型，枚举类型 已分案
      };
      findLawCaseList(params).then(res => {
        this.loading = false;
        if (res.data.state == 100) {
          let data=res.data.data;
          this.data = data.lawCaseList;
          this.total = data.total;
          //这里给数据添加_disabled属性
          for(var i=0;i<this.data.length;i++){
            if(this.data[i].procedureType=="普通程序"){
              this.data[i]['_disabled'] = true
            }
          } 
        }else{
            this.$Message.info(res.data.message);
        }
      });
    },
    changeSelect(e){
      this.selectList = e;
      this.selectCount = e.length;
    },
    /**
     * 打开审核模态框
     */
    showGO(){
      if (this.selectCount <= 0) {
          this.$Notice.warning({
              title: '',
              desc: '您还未选择需要操作案件',
              duration: 5
          });
        return;
      }
      this.$refs.handle.getList();
      this.modal2 = true;
    },
    closeModel(){
      this.modal1 = false;
    },
    closeModel2(data){
      if(data){ //表示选择成功 刷新
        this.selectList = [];
        this.selectCount = 0;
        this.modal2 = false;
        this.data = data;
        let ys = true;
        let that = this;
        setTimeout(function(){
					that.$refs.table.selectAll(ys);
				}, 500)
        this.getRoleList();
      }else{
        this.modal2 = false;
      }
    },
    showRject(){
      
    },
     /**
     * 批量操作的案件
     */
    changeList(data){
      this.data = data;
      this.modal1 = false;
      let ys = true;
      let that = this;
      setTimeout(function(){
        that.$refs.table.selectAll(ys);
      }, 500)
    },
    clearSelectAll(){
      this.$refs.table.selectAll(false);
    },
    addBatchList(){
      this.$refs.batch.init();
      this.modal1 = true;
    },
    handleDropdown(name){
      if(name == 'clear'){
        this.selectList = [];
        this.selectCount = '';
        this.data = [];
      }else if(name == 'refresh'){
        this.getRoleList()
      }
    },
  },
  mounted() {
    // this.init();
  },
  filters: {
      formatDate(time) {
          if (time == '') {
              return '';
          }
          var date = new Date(time);
          return formatDate(date, 'yyyy-MM-dd');
      },
    },
};
</script>