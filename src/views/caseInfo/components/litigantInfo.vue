<style lang="less">
@import "./common.less";
.tb-table,.tb-table tr th, .tb-table tr td { border:1px solid #e9eaec; }
.tb-table {text-align: center; border-collapse: collapse;} 
.tb{
    padding: 4px;
    min-height: 30px;
    border-left: 1px solid #e9eaec;
    border-bottom: 1px solid #e9eaec;
    box-sizing: none;
}
</style>
<template>
<div class="litigantInfo" style="position:relative">
    <Spin size="large" fix v-show="isLoading"></Spin>
    <!-- 原告信息 -->
    <div class="bookbuilding-table">
        <Row >
            <Col span="24" class="noemalTb th-header">
                原告、原告间关系及代理人信息
            </Col>
        </Row>
        <div class="contain">
            <div>
                <Row style="margin-bottom:5px;">
                    <Col span="9"  >
                        <div class="nextTip">原告</div>
                    </Col>
                    <Col span="9" push='1' >
                        <div class="nextTip">代理人</div>  
                    </Col>
                    <Col span="4" push='2'  >
                        <div class="nextTip">原告关系</div> 
                    </Col>
                </Row>
                <!-- 原告列表循环 -->
                <div v-for="item in plaintiffList"> 
                    <Row >
                        <Col span="9"  >
                            <!-- <div class="nextTip">原告</div> -->
                            <div style="height:80px;" >
                                <div class="nameDiv" :class="item.onSelectPlaintiff">
                                    <span>{{item.litigantName}}</span>
                                    <p @click="openPlaintiff(item)"><Icon :type="item.iconPlaintiff"></Icon></p>
                                </div>  
                            </div>  
                        </Col>
                        <Col span="9" push='1' >
                            <!-- <div class="nextTip">代理人</div>   -->
                            <div style="height:80px;" :class="item.lawyer ?  (item.lawyer.length > 1 ? 'x_over': '') : ''" v-if="item.lawyer.length">
                                <div v-for="it in item.lawyer"  style="margin-right:8px;" class="nameDiv" :class=" item.onSelectPlaintiff == '' ? it.onSelectLawyer : ''">
                                    <span>{{it.agentName}}</span>
                                    <p @click="openLawyer(item,it)">
                                    <Icon :type=" item.onSelectPlaintiff == '' ? it.iconLawyer : 'ios-arrow-down'"></Icon></p>
                                </div> 
                            </div>
                            <div class="nameDiv" v-else>
                                <div style="margin-right:8px;" class="nameDiv">
                                    <span>无</span>
                                </div> 
                            </div>
                        </Col>
                        <Col span="4" push='2'  >
                            <!-- <div class="nextTip">原告关系</div>  -->
                            <div style="height:80px;" >
                                <div class="nameDiv" :class="item.onSelectRelation">
                                    <span>{{item.relationName || '无'}}</span>
                                    <p><Icon type="ios-minus-empty"></Icon></p>
                                    <!-- <p><Icon :type="item.icoRelation"></Icon></p> -->
                                </div>  
                            </div>  
                        </Col>
                    </Row>
                    <!-- 当事人-法人模板 -->
                    <Row class="tabs" v-show="item.onSelectPlaintiff != ''  && item.litigantType == '法人'">
                        <Col span="24" class="grey-Tip">
                            {{item.litigantName || '无'}}
                        </Col>
                        <Row>
                            <table class="tb-table" cellspacing="0" cellpadding="0" width="100%">
                                <tr>
                                    <td colspan="1" width="10%" class="tb tb-head">当事人类型</td>
                                    <td colspan="1" width="15%" class="tb">{{ item.litigantType  || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">姓名</td>
                                    <td colspan="1" width="15%" class="tb">{{item.litigantName || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">当事人证件</td>
                                    <td colspan="1" width="15%" class="tb">{{ item.identityType  || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">当事人证件号码</td>
                                    <td colspan="1" width="15%" class="tb">{{item.identityCard || '无'}}</td>
                                </tr>
                                <tr>
                                    <td colspan="1" width="10%" class="tb tb-head">法定代表人</td>
                                    <td colspan="1" width="15%" class="tb">{{item.legalManName || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">法定代表人身份证件</td>
                                    <td colspan="1" width="15%" class="tb">{{item.legalManIdCardType || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">法定代表人身份证号码</td>
                                    <td colspan="1" width="15%" class="tb">{{item.legalManIdCard || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">法定代表人手机号码</td>
                                    <td colspan="1" width="15%" class="tb">{{item.legalManPhone || '无'}}</td>
                                </tr>
                                <tr>
                                    <td colspan="1" width="10%" class="tb tb-head">单位固定电话</td>
                                    <td colspan="1" width="15%" class="tb">{{item.phone || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">单位电子邮箱</td>
                                    <td colspan="1" width="15%" class="tb">{{item.email || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">来源</td>
                                    <td colspan="2" width="15%" class="tb">{{ item.remark || '无'}}</td>
                                </tr>
                                <tr v-for="addr in item.address">
                                    <td colspan="1" width="10%" class="tb tb-head">{{addr.litigantAddressType}}</td>
                                    <td colspan="3" width="40%" class="tb">{{ addr.address  || '无'}}</td>
                                </tr>
                            </table>
                        </Row>
                    </Row>
                    <!-- 当事人-自然人模板 -->
                    <Row class="tabs" v-show="item.onSelectPlaintiff != '' && item.litigantType == '自然人'">
                        <Col span="24" class="grey-Tip">
                            {{item.litigantName}}
                        </Col>
                        <Row>
                            <table class="tb-table" cellspacing="0" cellpadding="0" width="100%">
                                <tr>
                                    <td colspan="1" width="10%" class="tb tb-head">当事人类型</td>
                                    <td colspan="1" width="15%" class="tb">{{ item.litigantType  || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">姓名</td>
                                    <td colspan="1" width="15%" class="tb">{{item.litigantName || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">当事人证件</td>
                                    <td colspan="1" width="15%" class="tb">{{item.identityType || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">当事人证件号码</td>
                                    <td colspan="1" width="15%" class="tb">{{item.identityCard || '无'}}</td>
                                </tr>
                                <tr>
                                    <td colspan="1" width="10%" class="tb tb-head">性别</td>
                                    <td colspan="1" width="15%" class="tb">{{item.litigantSex || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head"> 出生日期</td>
                                    <td colspan="1" width="15%" class="tb">{{ item.birthday | formatDate }}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">民族</td>
                                    <td colspan="1" width="15%" class="tb">{{ item.nation || '无' }}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">手机号码</td>
                                    <td colspan="1" width="15%" class="tb">{{ item.phone  || '无'}}</td>
                                </tr>
                                <tr>
                                    <td colspan="1" width="10%" class="tb tb-head">电子邮箱</td>
                                    <td colspan="1" width="15%" class="tb">{{ item.email  || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">工作单位</td>
                                    <td colspan="1" width="15%" class="tb">{{ item.employer  || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">单位地址</td>
                                    <td colspan="1" width="15%" class="tb">{{ item.employerAddress || '无' }}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">来源</td>
                                    <td colspan="1" width="15%" class="tb">{{ item.remark || '无'}}</td>
                                </tr>
                                <tr v-for="addItem in item.address">
                                    <td colspan="1" width="10%" class="tb tb-head">{{addItem.litigantAddressType}}</td>
                                    <td colspan="3" width="40%" class="tb">{{ addItem.address  || '无'}}</td>
                                </tr>
                            </table>
                        </Row>

                    </Row>
                    <!-- 代理人模板 -->
                    <Row class="tabs" v-show="item.openLawyer != '' && lawyerItem.iconLawyer == 'ios-arrow-up'" v-for="lawyerItem in item.lawyer">
                        <Col span="24" class="grey-Tip">
                            <!-- xxx代理人 -->
                            {{lawyerItem.agentName || '无'}}代理人
                        </Col>
                        <Row>
                            <table class="tb-table" cellspacing="0" cellpadding="0" width="100%">
                                <tr>
                                    <td colspan="1" width="10%" class="tb tb-head">代理人类型</td>
                                    <td colspan="1" width="15%" class="tb">{{lawyerItem.agentType || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">姓名</td>
                                    <td colspan="1" width="15%" class="tb">{{lawyerItem.agentName || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">代理人证件</td>
                                    <td colspan="1" width="15%" class="tb">律师执业证书</td>
                                    <td colspan="1" width="10%" class="tb tb-head">代理人证件号码</td>
                                    <td colspan="1" width="15%" class="tb">{{lawyerItem.lawerNum || '无'}}</td>
                                </tr>
                                <tr>
                                    <td colspan="1" width="10%" class="tb tb-head">代理人手机号</td>
                                    <td colspan="1" width="15%" class="tb">{{lawyerItem.agentMobile || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">代理人电子邮箱</td>
                                    <td colspan="1" width="15%" class="tb">{{lawyerItem.agentEmail || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">公民身份证号</td>
                                    <td colspan="1" width="15%" class="tb">{{lawyerItem.agentIdentiCard || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">来源</td>
                                    <td colspan="1" width="15%" class="tb">{{lawyerItem.remark  || '无'}}</td>
                                </tr>
                                <tr>
                                    <td colspan="1" width="10%" class="tb tb-head">代理人联系地址</td>
                                    <td colspan="3" width="40%" class="tb">{{lawyerItem.agentAddress  || '无'}}</td>
                                </tr>
                            </table>
                        </Row>
                    </Row>
                </div>
                 <!-- 原告列表循环结束 -->
            </div>
        </div>

    </div>
    <!-- 被告信息 -->
    <div class="bookbuilding-table">
        <Row >
            <Col span="24" class="noemalTb th-header">
                被告、被告间关系及代理人信息
            </Col>
        </Row>
        <div class="contain">
            <div>
                <Row style="margin-bottom:5px;">
                    <Col span="9"  >
                        <div class="nextTip">被告</div>
                    </Col>
                    <Col span="9" push='1' >
                        <div class="nextTip">代理人</div>  
                    </Col>
                    <Col span="4" push='2'  >
                        <div class="nextTip">被告关系</div> 
                    </Col>
                </Row>
                <!-- 被告列表循环 -->
                <div v-for="item in defendantList"> 
                    <Row >
                        <Col span="9"  >
                            <!-- <div class="nextTip">原告</div> -->
                            <div style="height:80px;" >
                                <div class="nameDiv" :class="item.onSelectPlaintiff">
                                    <span>{{item.litigantName}}</span>
                                    <p @click="openPlaintiff(item)"><Icon :type="item.iconPlaintiff"></Icon></p>
                                </div>  
                            </div>  
                        </Col>
                        <Col span="9" push='1' >
                            <!-- <div class="nextTip">代理人</div>   -->
                            <div style="height:80px;" :class="item.lawyer ?  (item.lawyer.length > 1 ? 'x_over': '') : ''" v-if="item.lawyer.length">
                                <div v-for="it in item.lawyer"  style="margin-right:8px;" class="nameDiv" :class=" item.onSelectPlaintiff == '' ? it.onSelectLawyer : ''">
                                    <span>{{it.agentName}}</span>
                                    <p @click="openLawyer(item,it)"><Icon :type=" item.onSelectPlaintiff == '' ? it.iconLawyer : 'ios-arrow-down'"></Icon></p>
                                </div> 
                            </div>
                            <div class="nameDiv" v-else>
                                <div style="margin-right:8px;" class="nameDiv">
                                    <span>无</span>
                                </div> 
                            </div>
                        </Col>
                        <Col span="4" push='2'  >
                            <!-- <div class="nextTip">原告关系</div>  -->
                            <div style="height:80px;" >
                                <div class="nameDiv" :class="item.onSelectRelation">
                                    <span>{{item.relationName || '无'}}</span>
                                    <p><Icon type="ios-minus-empty"></Icon></p>
                                    <!-- <p><Icon :type="item.icoRelation"></Icon></p> -->
                                </div>  
                            </div>  
                        </Col>
                    </Row>
                    <!-- 当事人-法人模板 -->
                    <Row class="tabs" v-show="item.onSelectPlaintiff != ''  && item.litigantType == '法人'">
                        <Col span="24" class="grey-Tip">
                            {{item.litigantName || '无'}}
                        </Col>
                        <Row>
                            <table class="tb-table" cellspacing="0" cellpadding="0" width="100%">
                                <tr>
                                    <td colspan="1" width="10%" class="tb tb-head">当事人类型</td>
                                    <td colspan="1" width="15%" class="tb">{{ item.litigantType  || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">姓名</td>
                                    <td colspan="1" width="15%" class="tb">{{item.litigantName || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">当事人证件</td>
                                    <td colspan="1" width="15%" class="tb">{{ item.identityType  || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">当事人证件号码</td>
                                    <td colspan="1" width="15%" class="tb">{{item.identityCard || '无'}}</td>
                                </tr>
                                <tr>
                                    <td colspan="1" width="10%" class="tb tb-head">法定代表人</td>
                                    <td colspan="1" width="15%" class="tb">{{item.legalManName || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">法定代表人身份证件</td>
                                    <td colspan="1" width="15%" class="tb">{{item.legalManIdCardType || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">法定代表人身份证号码</td>
                                    <td colspan="1" width="15%" class="tb">{{item.legalManIdCard || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">法定代表人手机号码</td>
                                    <td colspan="1" width="15%" class="tb">{{item.legalManPhone || '无'}}</td>
                                </tr>
                                <tr>
                                    <td colspan="1" width="10%" class="tb tb-head">单位固定电话</td>
                                    <td colspan="1" width="15%" class="tb">{{item.phone || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">单位电子邮箱</td>
                                    <td colspan="1" width="15%" class="tb">{{item.email || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">来源</td>
                                    <td colspan="1" width="15%" class="tb">{{ item.remark || '无'}}</td>
                                </tr>
                                <tr v-for="addr in item.address">
                                    <td colspan="1" width="10%" class="tb tb-head">{{addr.litigantAddressType}}</td>
                                    <td colspan="3" width="40%" class="tb">{{ addr.address  || '无'}}</td>
                                </tr>
                            </table>
                        </Row>
                    </Row>
                    <!-- 当事人-自然人模板 -->
                    <Row class="tabs" v-show="item.onSelectPlaintiff != '' && item.litigantType == '自然人'">
                        <Col span="24" class="grey-Tip">
                            {{item.litigantName}}
                        </Col>
                        <Row>
                            <table class="tb-table" cellspacing="0" cellpadding="0" width="100%">
                                <tr>
                                    <td colspan="1" width="10%" class="tb tb-head">当事人类型</td>
                                    <td colspan="1" width="15%" class="tb">{{ item.litigantType  || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">姓名</td>
                                    <td colspan="1" width="15%" class="tb">{{item.litigantName || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">当事人证件</td>
                                    <td colspan="1" width="15%" class="tb">{{item.identityType || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">当事人证件号码</td>
                                    <td colspan="1" width="15%" class="tb">{{item.identityCard || '无'}}</td>
                                </tr>
                                <tr>
                                    <td colspan="1" width="10%" class="tb tb-head">性别</td>
                                    <td colspan="1" width="15%" class="tb">{{item.litigantSex || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head"> 出生日期</td>
                                    <td colspan="1" width="15%" class="tb">{{ item.birthday | formatDate }}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">民族</td>
                                    <td colspan="1" width="15%" class="tb">{{ item.nation || '无' }}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">手机号码</td>
                                    <td colspan="1" width="15%" class="tb">{{ item.phone  || '无'}}</td>
                                </tr>
                                <tr>
                                    <td colspan="1" width="10%" class="tb tb-head">电子邮箱</td>
                                    <td colspan="1" width="15%" class="tb">{{ item.email  || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">工作单位</td>
                                    <td colspan="1" width="15%" class="tb">{{ item.employer  || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">单位地址</td>
                                    <td colspan="1" width="15%" class="tb">{{ item.employerAddress || '无' }}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">来源</td>
                                    <td colspan="1" width="15%" class="tb">{{ item.remark || '无'}}</td>
                                </tr>
                                <tr v-for="addItem in item.address">
                                    <td colspan="1" width="10%" class="tb tb-head">{{addItem.litigantAddressType}}</td>
                                    <td colspan="3" width="40%" class="tb">{{ addItem.address  || '无'}}</td>
                                </tr>
                            </table>
                        </Row>

                    </Row>
                    <!-- 代理人模板 -->
                    <Row class="tabs" v-show="item.openLawyer != '' && lawyerItem.iconLawyer == 'ios-arrow-up'" v-for="lawyerItem in item.lawyer">
                        <Col span="24" class="grey-Tip">
                            <!-- xxx代理人 -->
                            {{lawyerItem.agentName || '无'}}代理人
                        </Col>
                        <Row>
                            <table class="tb-table" cellspacing="0" cellpadding="0" width="100%">
                                <tr>
                                    <td colspan="1" width="10%" class="tb tb-head">代理人类型</td>
                                    <td colspan="1" width="15%" class="tb">{{lawyerItem.agentType || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">姓名</td>
                                    <td colspan="1" width="15%" class="tb">{{lawyerItem.agentName || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">代理人证件</td>
                                    <td colspan="1" width="15%" class="tb">律师执业证书</td>
                                    <td colspan="1" width="10%" class="tb tb-head">代理人证件号码</td>
                                    <td colspan="1" width="15%" class="tb">{{lawyerItem.lawerNum || '无'}}</td>
                                </tr>
                                <tr>
                                    <td colspan="1" width="10%" class="tb tb-head">代理人手机号</td>
                                    <td colspan="1" width="15%" class="tb">{{lawyerItem.agentMobile || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">代理人电子邮箱</td>
                                    <td colspan="1" width="15%" class="tb">{{lawyerItem.agentEmail || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">公民身份证号</td>
                                    <td colspan="1" width="15%" class="tb">{{lawyerItem.agentIdentiCard || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">来源</td>
                                    <td colspan="1" width="15%" class="tb">{{lawyerItem.remark  || '无'}}</td>
                                </tr>
                                <tr>
                                    <td colspan="1" width="10%" class="tb tb-head">代理人联系地址</td>
                                    <td colspan="3" width="40%" class="tb">{{lawyerItem.agentAddress  || '无'}}</td>
                                </tr>
                            </table>
                        </Row>
                    </Row>
                </div>
                 <!-- 原告列表循环结束 -->
            </div>
        </div>

    </div>
    <!-- 第三人信息 -->
    <div class="bookbuilding-table">
        <Row >
            <Col span="24" class="noemalTb th-header">
                第三人、第三人间关系及代理人信息
            </Col>
        </Row>
        <div class="contain">
            <div>
                <Row style="margin-bottom:5px;">
                    <Col span="9"  >
                        <div class="nextTip">第三人</div>
                    </Col>
                    <Col span="9" push='1' >
                        <div class="nextTip">代理人</div>  
                    </Col>
                    <Col span="4" push='2'  >
                        <div class="nextTip">第三人关系</div> 
                    </Col>
                </Row>
                <!-- 被告列表循环 -->
                <div v-for="item in thirdList"> 
                    <Row >
                        <Col span="9"  >
                            <!-- <div class="nextTip">原告</div> -->
                            <div style="height:80px;" >
                                <div class="nameDiv" :class="item.onSelectPlaintiff">
                                    <span>{{item.litigantName}}</span>
                                    <p @click="openPlaintiff(item)"><Icon :type="item.iconPlaintiff"></Icon></p>
                                </div>  
                            </div>  
                        </Col>
                        <Col span="9" push='1' >
                            <!-- <div class="nextTip">代理人</div>   -->
                            <div style="height:80px;" class="" :class="item.lawyer ?  (item.lawyer.length > 1 ? 'x_over': '') : ''" v-if="item.lawyer.length">
                                <div v-for="it in item.lawyer"  style="margin-right:8px;" class="nameDiv" :class=" item.onSelectPlaintiff == '' ? it.onSelectLawyer : ''">
                                    <span>{{it.agentName}}</span>
                                    <p @click="openLawyer(item,it)"><Icon :type=" item.onSelectPlaintiff == '' ? it.iconLawyer : 'ios-arrow-down'"></Icon></p>
                                </div> 
                            </div>
                            <div class="nameDiv" v-else>
                                <div style="margin-right:8px;" class="nameDiv">
                                    <span>无</span>
                                </div> 
                            </div>
                        </Col>
                        <Col span="4" push='2'  >
                            <!-- <div class="nextTip">原告关系</div>  -->
                            <div style="height:80px;" >
                                <div class="nameDiv" :class="item.onSelectRelation">
                                    <span>{{item.relationName || '无'}}</span>
                                    <p><Icon type="ios-minus-empty"></Icon></p>
                                    <!-- <p><Icon :type="item.icoRelation"></Icon></p> -->
                                </div>  
                            </div>  
                        </Col>
                    </Row>
                    <!-- 当事人-法人模板 -->
                    <Row class="tabs" v-show="item.onSelectPlaintiff != ''  && item.litigantType == '法人'">
                        <Col span="24" class="grey-Tip">
                            {{item.litigantName || '无'}}
                        </Col>
                        <Row>
                            <table class="tb-table" cellspacing="0" cellpadding="0" width="100%">
                                <tr>
                                    <td colspan="1" width="10%" class="tb tb-head">当事人类型</td>
                                    <td colspan="1" width="15%" class="tb">{{ item.litigantType  || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">姓名</td>
                                    <td colspan="1" width="15%" class="tb">{{item.litigantName || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">当事人证件</td>
                                    <td colspan="1" width="15%" class="tb">{{ item.identityType  || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">当事人证件号码</td>
                                    <td colspan="1" width="15%" class="tb">{{item.identityCard || '无'}}</td>
                                </tr>
                                <tr>
                                    <td colspan="1" width="10%" class="tb tb-head">法定代表人</td>
                                    <td colspan="1" width="15%" class="tb">{{item.legalManName || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">法定代表人身份证件</td>
                                    <td colspan="1" width="15%" class="tb">{{item.legalManIdCardType || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">法定代表人身份证号码</td>
                                    <td colspan="1" width="15%" class="tb">{{item.legalManIdCard || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">法定代表人手机号码</td>
                                    <td colspan="1" width="15%" class="tb">{{item.legalManPhone || '无'}}</td>
                                </tr>
                                <tr>
                                    <td colspan="1" width="10%" class="tb tb-head">单位固定电话</td>
                                    <td colspan="1" width="15%" class="tb">{{item.phone || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">单位电子邮箱</td>
                                    <td colspan="1" width="15%" class="tb">{{item.email || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">来源</td>
                                    <td colspan="1" width="15%" class="tb">{{ item.remark || '无'}}</td>
                                </tr>
                                <tr v-for="addr in item.address">
                                    <td colspan="1" width="10%" class="tb tb-head">{{addr.litigantAddressType}}</td>
                                    <td colspan="3" width="40%" class="tb">{{ addr.address  || '无'}}</td>
                                </tr>
                            </table>
                        </Row>
                    </Row>
                    <!-- 当事人-自然人模板 -->
                    <Row class="tabs" v-show="item.onSelectPlaintiff != '' && item.litigantType == '自然人'">
                        <Col span="24" class="grey-Tip">
                            {{item.litigantName}}
                        </Col>
                        <Row>
                            <table class="tb-table" cellspacing="0" cellpadding="0" width="100%">
                                <tr>
                                    <td colspan="1" width="10%" class="tb tb-head">当事人类型</td>
                                    <td colspan="1" width="15%" class="tb">{{ item.litigantType  || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">姓名</td>
                                    <td colspan="1" width="15%" class="tb">{{item.litigantName || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">当事人证件</td>
                                    <td colspan="1" width="15%" class="tb">{{item.identityType || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">当事人证件号码</td>
                                    <td colspan="1" width="15%" class="tb">{{item.identityCard || '无'}}</td>
                                </tr>
                                <tr>
                                    <td colspan="1" width="10%" class="tb tb-head">性别</td>
                                    <td colspan="1" width="15%" class="tb">{{item.litigantSex || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head"> 出生日期</td>
                                    <td colspan="1" width="15%" class="tb">{{ item.birthday | formatDate }}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">民族</td>
                                    <td colspan="1" width="15%" class="tb">{{ item.nation || '无' }}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">手机号码</td>
                                    <td colspan="1" width="15%" class="tb">{{ item.phone  || '无'}}</td>
                                </tr>
                                <tr>
                                    <td colspan="1" width="10%" class="tb tb-head">电子邮箱</td>
                                    <td colspan="1" width="15%" class="tb">{{ item.email  || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">工作单位</td>
                                    <td colspan="1" width="15%" class="tb">{{ item.employer  || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">单位地址</td>
                                    <td colspan="1" width="15%" class="tb">{{ item.employerAddress || '无' }}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">来源</td>
                                    <td colspan="1" width="15%" class="tb">{{ item.remark || '无'}}</td>
                                </tr>
                                <tr v-for="addItem in item.address">
                                    <td colspan="1" width="10%" class="tb tb-head">{{addItem.litigantAddressType}}</td>
                                    <td colspan="3" width="40%" class="tb">{{ addItem.address  || '无'}}</td>
                                </tr>
                            </table>
                        </Row>
                    </Row>
                    <!-- 代理人模板 -->
                    <Row class="tabs" v-show="item.openLawyer != '' && lawyerItem.iconLawyer == 'ios-arrow-up'" v-for="lawyerItem in item.lawyer">
                        <Col span="24" class="grey-Tip">
                            <!-- xxx代理人 -->
                            {{lawyerItem.agentName || '无'}}代理人
                        </Col>
                        <Row>
                            <table class="tb-table" cellspacing="0" cellpadding="0" width="100%">
                                <tr>
                                    <td colspan="1" width="10%" class="tb tb-head">代理人类型</td>
                                    <td colspan="1" width="15%" class="tb">{{lawyerItem.agentType || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">姓名</td>
                                    <td colspan="1" width="15%" class="tb">{{lawyerItem.agentName || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">代理人证件</td>
                                    <td colspan="1" width="15%" class="tb">律师执业证书</td>
                                    <td colspan="1" width="10%" class="tb tb-head">代理人证件号码</td>
                                    <td colspan="1" width="15%" class="tb">{{lawyerItem.lawerNum || '无'}}</td>
                                </tr>
                                <tr>
                                    <td colspan="1" width="10%" class="tb tb-head">代理人手机号</td>
                                    <td colspan="1" width="15%" class="tb">{{lawyerItem.agentMobile || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">代理人电子邮箱</td>
                                    <td colspan="1" width="15%" class="tb">{{lawyerItem.agentEmail || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">公民身份证号</td>
                                    <td colspan="1" width="15%" class="tb">{{lawyerItem.agentIdentiCard || '无'}}</td>
                                    <td colspan="1" width="10%" class="tb tb-head">来源</td>
                                    <td colspan="1" width="15%" class="tb">{{lawyerItem.remark  || '无'}}</td>
                                </tr>
                                <tr>
                                    <td colspan="1" width="10%" class="tb tb-head">代理人联系地址</td>
                                    <td colspan="3" width="40%" class="tb">{{lawyerItem.agentAddress  || '无'}}</td>
                                </tr>
                            </table>
                        </Row>
                    </Row>
                </div>
                 <!-- 原告列表循环结束 -->
            </div>
        </div>

    </div>
</div>
</template>
<script>
import { formatDate } from '@/libs/date'
import {
  litigantLawyerList
} from "@/api/caseInfo"
export default {
    data(){
        return{
            caseInfo:{

            },
            isLoading: false,
            showNum:0,
            plaintiffList:[],
            selLawyer: '',
            defendantList:[],
            thirdList:[],
        }
    },
    methods:{
        // 展开原告信息
        openPlaintiff(data){
            if(data.onSelectPlaintiff == ''){
                data.openLawyer = '';   //关掉律师信息框
                data.onSelectPlaintiff = 'onSel';
                data.iconPlaintiff = 'ios-arrow-up';
            }else{
                data.onSelectPlaintiff = '';
                data.iconPlaintiff = 'ios-arrow-down';
            }
            this.plaintiffList =  JSON.parse(JSON.stringify(this.plaintiffList));
        },
        //展开律师信息
        openLawyer(data,da){
            if(data.openLawyer == ''){
                this.selLawyer = da.agentName;
                data.iconPlaintiff = 'ios-arrow-down';
                data.onSelectPlaintiff = ''; //关掉原告信息框
                for(let i=0;i<data.lawyer.length;i++){  //关掉其他律师框样式
                    if(data.lawyer[i].onSelectLawyer != ''){
                        data.lawyer[i].onSelectLawyer = '';
                        data.lawyer[i].iconLawyer = 'ios-arrow-down';
                    }
                }
                data.openLawyer = 'onSel';
                da.iconLawyer = 'ios-arrow-up';
                da.onSelectLawyer = 'onSel';
            }else{
                this.selLawyer = '';
                let isOpen = 0;
                for(let i=0;i<data.lawyer.length;i++){  //关掉其他律师框样式
                    if(data.lawyer[i].onSelectLawyer != '' && data.lawyer[i].id != da.id){
                        isOpen = 1;
                        data.lawyer[i].onSelectLawyer = '';
                        data.lawyer[i].iconLawyer = 'ios-arrow-down';
                    }
                }
                if(isOpen == 1){
                    da.iconLawyer = 'ios-arrow-up';
                    da.onSelectLawyer = 'onSel';
                }else{
                    data.openLawyer = '';
                    da.iconLawyer = 'ios-arrow-down';
                    da.onSelectLawyer = '';
                }
            }
        },
        //获取信息列表
        getLawyerList(){
            this.isLoading = true;
            litigantLawyerList(this.$store.getters.caseId).then(res => {
                this.plaintiffList = [];//原告
                this.defendantList = [];//被告
                this.thirdList = [];
                this.isLoading = false;
                if(res.data.state == 100){
                    let data = res.data.data;
                    this.plaintiffList = this.concatArr(data.plaintiffList);
                    console.log('plaintiffList',this.plaintiffList)
                    this.defendantList = this.concatArr(data.defendantList);//被告
                    console.log('defendantList',this.defendantList)
                    this.thirdList = this.concatArr(data.thirdList);//第三方
                    console.log('thirdList',this.thirdList)
                }else{
                    this.$Notice.warning({
                        title: '',
                        desc: res.data.message,
                        duration: 5
                    });
                }
            })
        },
        //给获取的联系人代理人增加额外字段
        concatArr(outArr){
            if(outArr.length){
                for(let i = 0; i < outArr.length; i++){
                    for(let j = 0; j < outArr[i].lawyer.length; j++){
                        outArr[i].lawyer[j].iconLawyer = 'ios-arrow-down';
                        outArr[i].lawyer[j].onSelectLawyer = '';
                        outArr[i].onSelectPlaintiff = '';
                    }
                    if(!outArr[i].lawyer.length){
                        outArr[i].lawyer.iconLawyer = 'ios-arrow-down';
                        outArr[i].lawyer.onSelectLawyer = '';
                        outArr[i].onSelectPlaintiff = '';
                    }
                    outArr[i].onSelectPlaintiff = '';
                    outArr[i].iconPlaintiff = 'ios-arrow-down';
                    outArr[i].icoRelation = 'ios-arrow-down';
                    outArr[i].openLawyer = '';
                    outArr[i].onSelectRelation = '';

                    outArr[i].agentName='';
                    outArr[i].agentType='';
                    outArr[i].agentName='';
                    outArr[i].lawerNum ='';
                    outArr[i].agentMobile ='';
                    outArr[i].agentEmail ='';
                    outArr[i].agentIdentiCard='';
                    outArr[i].agentAddress ='';
                    outArr[i].remark='';
                }
                return outArr
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
  }

}
</script>

