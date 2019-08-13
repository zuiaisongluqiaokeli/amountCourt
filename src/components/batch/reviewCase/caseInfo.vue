<template>
   <div class="box">
       <Modal
            v-model="modal2"
            title="案件信息"
            :mask-closable="false"
            :styles="{top: '20px'}"
            width="1000px">
            <div class="components-container">
                    <Tabs  @on-click="changeTab" >
                        <TabPane label="案件信息">
                            <div v-show="caInfo">
                            <Row  style="margin-bottom:20px;margin-top:35px">
                            <Col span="6" style=" padding-right: 5px;text-align: right;">
                                案件类别：
                            </Col>
                            <Col span="6" style=" padding-right: 5px">
                                {{caseType == '' ? "无" : caseType}}
                            </Col>
                            <Col span="4" style=" padding-right: 5px">
                                标的金额：
                            </Col>
                            <Col span="6" style=" padding-right: 5px">
                                {{standardMoney == '' ? 0 : standardMoney}}元
                            </Col>
                        </Row>
                        <!-- <Row  style="margin-bottom:20px;margin-top:15px">
                            <Col span="6" style=" padding-right: 5px;text-align: right;">
                                案件案由：
                            </Col>
                            <Col span="18" style=" padding-right: 5px">
                                {{briefName == '' ? "无" : briefName}}
                            </Col>
                        </Row> -->
                        <Row  style="margin-bottom:5px">
                            <Col span="6" style=" padding-right: 5px;text-align: right;">
                                诉讼请求：
                            </Col>
                            <Col span="16" style=" padding-right: 5px">
                                {{factContent == '' ? "无" : factContent}}
                            </Col>
                        </Row>
                        <Row  style="margin-bottom:5px">
                            <Col span="6" style=" padding-right: 5px;text-align: right;">
                                事实和理由：
                            </Col>
                            <Col span="16" style=" padding-right: 5px">
                                {{reasonContent == '' ? "无" : reasonContent}}
                            </Col>
                        </Row>
                        </div>
                    </TabPane>
                    <TabPane label="当事人信息" >
                        <div>
                            <div v-for="item in liniList">
                                <div class="info matr">
                                    <div class="bmbox" @click="getOneLini(item.id)"><span class="title" >查看详情</span></div>
                                    <p>名称：<span>{{item.name}}</span>（{{item.typeStatus}}）</p>
                                    <p>证件号：<span>{{item.card}}</span></p>
                                    <p>手机号码：<span>{{item.phone}}</span></p>
                                    <p>地址：<span>{{item.adress}}</span></p>
                                </div>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane  label="代理人信息"  >
                        <h5 style="text-align: center;" v-show="lawyerList.length == 0">暂无代理人信息</h5>
                        <div v-for="item in lawyerList">
                            <div class="info matr">
                                <div class="bmbox"  @click="getLaw(item.id)"><span class="title">查看详情</span></div>
                                <p>名称：{{item.name}}</p>
                                <p>证件号：{{item.card}}</p>
                                <p>手机号码：{{item.phone}}</p>
                                <p>地址：{{item.adress}}</p>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane label="附件信息"  >
                            <div style="margin-top:40px" v-show="fileInfo">
                                <Row  style="margin-bottom:5px">
                                <Col span="6" style=" padding-right: 5px;text-align: right;margin-bottom:15px">
                                    起诉状：
                                </Col>
                                <Col span="18" style=" padding-right: 5px;margin-bottom:15px">
                                    <span v-if="qFileName.name == ''">无</span>
                                    <a v-else :href="qFileName.path" download="">{{ qFileName.name }}</a>
                                </Col>
                                <Col span="6" style=" padding-right: 5px;text-align: right;">
                                    身份证明材料：
                                </Col>
                                <Col span="6" style=" padding-right: 5px">
                                    <span v-if="fileName1.name == ''">无</span>
                                    <a v-else :href="fileName1.path" download="">{{ fileName1.name }}</a>
                                </Col>
                                <Col span="6" style=" padding-right: 5px;text-align: right;">
                                    授权委托材料：
                                </Col>
                                <Col span="6" style=" padding-right: 5px">
                                    <span v-if="fileName2.name == ''">无</span>
                                    <a v-else :href="fileName2.path" download="">{{ fileName2.name }}</a>
                                </Col>
                            </Row>
                            <Row  style="margin-bottom:5px;margin-bottom:10px">
                                <p class="sdws">
                                    申请书：
                                </p>
                                <Col span="6" style=" padding-right: 5px;text-align: right;margin-bottom:10px">
                                    财产保全申请书：
                                </Col>
                                <Col span="6" style=" padding-right: 5px;margin-bottom:10px">
                                    <span v-if="fileNameShen1 == ''">无</span>
                                    <a v-else :href="onlineEAIdShen1" download="">{{ fileNameShen1 }}</a>
                                </Col>
                                <Col span="5" style=" padding-right: 5px;text-align: right;margin-bottom:10px">
                                    调查取证申请书：
                                </Col>
                                <Col span="7" style=" padding-right: 5px;margin-bottom:10px">
                                    <span v-if="fileNameShen2 == ''">无</span>
                                    <a v-else :href="onlineEAIdShen2" download="">{{ fileNameShen2 }}</a>
                                </Col>
                                <Col span="6" style=" padding-right: 5px;text-align: right;margin-bottom:10px">
                                    证据保全申请书：
                                </Col>
                                <Col span="6" style=" padding-right: 5px;margin-bottom:10px">
                                    <span v-if="fileNameShen3 == ''">无</span>
                                    <a v-else :href="onlineEAIdShen3" download="">{{ fileNameShen3 }}</a>
                                </Col>
                                <Col span="5" style=" padding-right: 5px;text-align: right;margin-bottom:10px">
                                    证人出庭申请书：
                                </Col>
                                <Col span="7" style=" padding-right: 5px;margin-bottom:10px">
                                    <span v-if="fileNameShen4 == ''">无</span>
                                    <a v-else :href="onlineEAIdShen2" download="">{{ fileNameShen4 }}</a>
                                </Col>
                                <Col span="6" style=" padding-right: 5px;text-align: right;margin-bottom:10px">
                                    现场勘验申请书：
                                </Col>
                                <Col span="6" style=" padding-right: 5px;margin-bottom:10px">
                                    <span v-if="fileNameShen5 == ''">无</span>
                                    <a v-else :href="onlineEAIdShen5" download="">{{ fileNameShen5 }}</a>
                                </Col>
                                <Col span="5" style=" padding-right: 5px;text-align: right;margin-bottom:10px">
                                    鉴定评估申请书：
                                </Col>
                                <Col span="7" style=" padding-right: 5px;margin-bottom:10px">
                                    <span v-if="fileNameShen6 == ''">无</span>
                                    <a v-else :href="onlineEAIdShen6" download="">{{ fileNameShen6 }}</a>
                                </Col>
                            </Row>
                            <div>
                                <p class="sdws">
                                    证据材料：
                                </p>
                                <Table :columns="columnsEvi" :data="EviList"></Table>
                            </div>
                        </div>
                    </TabPane>
                </Tabs>
            </div>
            <div slot="footer">
                <Button @click="closeInfo"  type="dashed" size="large">关闭</Button>
            </div>
    </Modal>
       <!-- 当事人信息 -->
        <Modal
            v-model="completeMol"
            width="560px"
            :mask-closable="closeM"
            title="当事人信息">
            <div>
                <Form :model="addFormItem" :label-width="100" inline>
                    <FormItem :label="addFormItem.litigantType == '自然人'? '姓名:' : '公司名称:'" style="width: 505px;">
                        <span>{{addFormItem.litigantName}}</span>
                    </FormItem>
                    <FormItem label="类型:" style="width: 245px;">
                        <span>{{addFormItem.litigantType}}</span>
                    </FormItem>
                    <FormItem label="诉讼地位:" style="width: 245px;">
                        <span>{{addFormItem.litigantStatus}}</span>
                    </FormItem>
                    <FormItem :label="addFormItem.litigantType == '自然人' ? '身份证号码:' : '统一信用代码:'" style="width: 245px;">
                        <span>{{addFormItem.identityCard}}</span>
                    </FormItem>
                    <FormItem label="出生日期:" style="width: 245px;" v-show="addFormItem.litigantType == '自然人'">
                        <span>{{addFormItem.birthday}}</span>
                    </FormItem>
                    <FormItem label="性别:" style="width: 245px;" v-show="addFormItem.litigantType == '自然人'">
                        <span>{{addFormItem.litigantSex}}</span>
                    </FormItem>
                    <FormItem label="国籍:" style="width: 245px;" v-show="addFormItem.litigantType == '自然人'">
                        <span>{{addFormItem.nationality}}</span>
                    </FormItem>
                    <FormItem label="民族:" style="width: 245px;" v-show="addFormItem.litigantType == '自然人'">
                        <span>{{addFormItem.nation}}</span>
                    </FormItem>
                    <!-- <FormItem label="政治面貌:" style="width: 245px;" v-show="addFormItem.litigantType == '自然人'">
                        <span>{{addFormItem.politicalStatus}}</span>
                    </FormItem> -->
                    <FormItem label="文化程度:" style="width: 245px;" v-show="addFormItem.litigantType == '自然人'">
                        <span>{{addFormItem.education}}</span>
                    </FormItem>
                    

                    <FormItem label="当事人关系:" style="width: 245px;display:none">
                        <span>{{addFormItem.relationType}}</span>
                    </FormItem>
                    <FormItem label="当事人:" style="width: 245px;display:none">
                        <span>{{addFormItem.litigantName}}</span>
                    </FormItem>
                    
                    <FormItem label="手机号码:" style="width: 245px;" v-show="addFormItem.litigantType != '法人' && addFormItem.litigantType != '非法人组织'">
                        <span>{{addFormItem.litigantPhone}}</span>
                    </FormItem>
                    <!-- <FormItem label="固定电话:" style="width: 245px;">
                        <span>{{addFormItem.litigantTelPhone}}</span>
                    </FormItem>
                    <FormItem label="成立日期:" style="width: 245px;" v-show="addFormItem.litigantType != '自然人'">
                        <span>{{addFormItem.birthday2}}</span>
                    </FormItem> -->

                    <FormItem v-bind:label="addFormItem.litigantType == '法人' ? '法定代表人:' : '负责人：'" style="width: 505px;" v-show="addFormItem.litigantType != '自然人'">
                        <span>{{addFormItem.legalManName}}</span>
                    </FormItem>
                    <FormItem v-bind:label="addFormItem.litigantType == '法人' ? '职务:' : '职务：'" style="width: 505px;" v-show="addFormItem.litigantType != '自然人'">
                        <span>{{addFormItem.legalManJob}}</span>
                    </FormItem>
                    <!-- <FormItem label="身份证号码：" style="width: 505px;" v-show="addFormItem.litigantType != '自然人'">
                        <span>{{addFormItem.legalManId}}</span>
                    </FormItem> -->
                    <FormItem label="联系方式：" style="width: 505px;" v-show="addFormItem.litigantType != '自然人'">
                        <span>{{addFormItem.legalManPhone}}</span>
                    </FormItem>

                    <FormItem label="工作单位：" style="width: 505px;" v-show="addFormItem.litigantType == '自然人'">
                        <span>{{addFormItem.employer}}</span>
                    </FormItem>
                    <FormItem label="电子邮箱：" style="width: 505px" v-show="addFormItem.litigantType == '自然人'">
                        <span>{{addFormItem.email}}</span>
                    </FormItem>
                    <FormItem :label="addFormItem.litigantType == '自然人' ? '户籍地址：' : '公司注册地址：'" style="width: 505px">
                        <span>{{addFormItem.nativePlace}}</span>
                    </FormItem>
                    <FormItem :label="addFormItem.litigantType == '自然人' ? '经常居住地址：' : '公司经营地址：'" style="width: 505px">
                        <span>{{addFormItem.address}}</span>
                    </FormItem>
                    <FormItem :label="addFormItem.litigantType == '自然人' ? '确认送达地址：' : '确认送达地址：'" style="width: 505px">
                        <span>{{addFormItem.sendAddress}}</span>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button @click="closeLiti"  type="dashed" size="large">关闭</Button>
            </div>
        </Modal>
        <!-- 代理人信息 -->
         <Modal
            v-model="lawyerMol"
            width="560px"
            :mask-closable="closeM"
            title="代理人信息">
            <div>
                <Form :model="addFormItem" :label-width="100" inline>
                    <FormItem label="代理人身份:" style="width: 245px;">
                        <span>{{addFormItem.lawerType}}</span>
                    </FormItem>
                    <FormItem label="当事人:" style="width: 245px;">
                        <span>{{addFormItem.name}}</span>
                    </FormItem>
                    <FormItem label="姓名:" style="width: 245px;">
                        <span>{{addFormItem.lawerName}}</span>
                    </FormItem>
                    <FormItem label="电话:" style="width: 245px;">
                        <span>{{addFormItem.lawermobile}}</span>
                    </FormItem>
                     <FormItem label="律所:" v-show="!lawyerT1" style="width: 505px;">
                        <span>{{addFormItem.lawyerOfficeName}}</span>
                    </FormItem>
                    <FormItem label="公民身份证号码:" v-show="lawyerT1" style="width: 505px;">
                        <span>{{addFormItem.lawIdentiCard}}</span>
                    </FormItem>
                    <FormItem label="公民身份证号码:" v-show="!lawyerT1" style="width: 505px;">
                        <span>{{addFormItem.lawIdentiCard2}}</span>
                    </FormItem>
                    <FormItem label="工作证件号码:" v-show="!lawyerT1" style="width: 505px;">
                        <span>{{addFormItem.lawIdentiCard}}</span>
                    </FormItem>
                    <FormItem label="电子邮箱:" style="width: 505px">
                        <span>{{addFormItem.email}}</span>
                    </FormItem>
                    <FormItem label="联系地址:"  style="width: 505px;">
                        <span>{{addFormItem.address}}</span>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button @click="cloaselawyer"  type="dashed" size="large">关闭</Button>
            </div>
        </Modal>
   </div>

</template>

<script type="text/javascript">
// import { dbList } from '@/api/diplomas.js';
export default {
    data(){
        return{
        //   backFill:{
        //         caseNo:'',
        //         briefName:'',
        //         litiganName:'',
        //         startTime:'',
        //         tribunalAddress:''

        //     }
        caInfo:true,
        modal2:false,
        closeM:false,
        addFormItem:{},
        completeMol:false,
        lawyerMol:false,
        fileInfo:true,
        caseType:'',
        fileNameShen1:"",
        onlineEAIdShen1:"",
        fileNameShen2:"",
        onlineEAIdShen2:"",
        fileNameShen3:"",
        onlineEAIdShen3:"",
        fileNameShen4:"",
        onlineEAIdShen4:"",
        fileNameShen5:"",
        onlineEAIdShen5:"",
        fileNameShen6:"",
        onlineEAIdShen6:"",
        standardMoney:'',
        factContent:'',
        reasonContent:'',
        briefName:"",
        lawyerT1:false,
        liniList:[],
        lawyerList:[],
        EviList:[],
        qFileName:{
            path:"",
            name:"",
        },
        fileName1:{
            path:"",
            name:"",
        },
        fileName2:{
            path:"",
            name:"",
        },
        columnsEvi:[
            {
            title: "证据名称",
            key: "name",
            width: 150,
            align: "center",
            },
            {
            title: "证明对象",
            key: "proves",
            width: 170,
            align: "center",
            },
            {
            title: "证明来源",
            key: "where",
            align: "center",
            },
            {
            title: "附件",
            key: "fileName",
            width: 100,
            align: "center",
            render: (h, params) => {
                return h("div", [
                    h(
                        "b",
                        {
                        props: {
                            type: "img",
                            size: "small"
                        },
                        on: {
                            click: () => {
                                var fileStr = params.row.filePa;
                                if(fileStr == null){
                                    this.$Message.info("暂无附件");
                                    return false;
                                }
                                // 创建隐藏的可下载链接
                                var eleLink = document.createElement("a");
                                var strs = fileStr.split("/");
                                for (var i = 0; i < strs.length; i++) {
                                    if (i == strs.length - 1) {
                                    var filename = strs[i];
                                    }
                                }
                                eleLink.download = filename;
                                eleLink.style.display = "none";
                                // 字符内容转变成blob地址
                                eleLink.href = fileStr;
                                // 触发点击
                                document.body.appendChild(eleLink);
                                eleLink.click();
                                // 然后移除
                                document.body.removeChild(eleLink);
                            }
                        }
                        },
                        ""
                    ),
                ]);
            }
            },
        ],
        title:'公告'
        }
    },
     props: {
        // backFill:[Array,Object]
    },
    methods: {
        init(){
            this.modal2 = true;
        },
        changeTab(){
            console.log(4949)
           this.completeMol = true;
        },
        /**
         * 查看当事人
         */
        getOneLini(){

        },
        /**
         * 查看代理人
         */
        getLaw(){

        },
        /**
         * 关闭当事人信息弹框
         */
        closeLiti(){

        },
        /**
         * 关闭律师弹框
         */
        cloaselawyer(){

        },
        closeInfo(){
            this.modal2 = false;
        }
        
        
    }
}

</script>
<style lang="css">
 .matr {
    width: 135px;
    height: 150px;
    border: 1px solid #ccc;
    display: inline-block;
    border-radius: 10px;
    margin: 10px;
    float: left;
}
.info{
    font-size: 0.2rem;
    color: #000;
    overflow:hidden; 
    word-wrap:break-word;
    text-align: left;
    position: relative;
    padding: 5px;
}
.info:before{
    content: "";
    width: 0;
    height: 100%;
    background: #000;
    padding: 14px 18px;
    position: absolute;
    top: 0;
    left: 50%;
    opacity: 0;
    transition: all 500ms cubic-bezier(0.47, 0, 0.745, 0.715) 0s;
}
.info:hover:before{
    width: 100%;
    left: 0;
    opacity: 0.5;
}
.bmbox{
     width: 100%;
    padding: 14px 18px;
    color: #fff;
    position: absolute;
    top: 38%;
    left: 0;
    text-align: center;
    cursor: pointer;
}
.bmbox .title{
    opacity: 0;
}
.info:hover .title,
.info:hover .post{
    opacity: 1;
    transition-delay: 0.7s;
}
.ivu-table .table-green-row1 span{
    color:green;
}
.ivu-table .table-blue-row1 span{
    color:blue;
    
}
.ivu-table .table-red-row1 span{
    color:red;
}
.a-upload {
    padding: 4px 10px;
    line-height: 20px;
    position: relative;
    cursor: pointer;
    color: #888;
    background: #fafafa;
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
    display: inline-block;
    *display: inline;
    *zoom: 1
}
.a-upload  input {
    position: absolute;
    font-size: 100px;
    right: 0;
    top: 0;
    opacity: 0;
    filter: alpha(opacity=0);
    cursor: pointer
}

.a-upload:hover {
    color: #444;
    background: #eee;
    border-color: #ccc;
    text-decoration: none
}
.stepse{
    width: 270px;
    border-right: 1px solid #ccc;
    height: 100%;
    text-align: center;
    display: inline-block;
    margin-top: 25px;
}
.step{
    width: 80%;
    border: 1px solid #ccc;
    height: 65px;
    margin-left: 10%;
    border-radius: 10px;
    cursor: pointer;
}
.step span{
    color:black;
    line-height: 65px;
    font-size: 14px;
}
.active{
    border: 2px solid #007FD5;
}
.content_main{
    display: inline-block;
    width: 625px;
    float: right;
    text-align: center;
    min-height: 200px;
}
.stepse .ivu-icon {
    /* font-size: 40px; */
}
.ivu-table-cell b{
    background-image:url('../../../images/download.png');
    background-size: 100% 100%; 
    display:inline-block;
    cursor: pointer;
    height: 30px;
    width:30px;
}
.sdws{
    display: block;
    text-align: left;
    line-height: 40px;
    padding-left: 10px;
    /* border-top:1px solid #dddee1;
    border-left:1px solid #dddee1;
    border-right:1px solid #dddee1; */
}
</style>