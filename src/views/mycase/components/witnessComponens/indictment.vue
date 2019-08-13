<style lang="less">
@import "./witness.less";
</style>
<template>
<div class="indictment">
    <div class="bookbuilding-table">
        <Row >
            <Col span="24" class="noemalTb th-header">
                起诉状
            </Col>
        </Row>
        <div class="contain">
            <Col span="24" class="nextTip">
                    起诉状摘要
            </Col>
            <Card>
                <Row class="tabs" style="">
                    <Col span="3" align="left" valign="middle" class="Tbs height-wit tb-head" style="position:absolute;">
                        诉前请求
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

                <Row class="tabs" style="margin-top:15px;">
                    <Col span="3" class="Tbs height-wit tb-head">
                        事实与理由
                    </Col>
                    <Col span="21" class="Tbs height-wit" style="float: right;">
                        <span>{{ caseInfo.caseNo + '99' }}</span>
                    </Col>
                </Row>

            </Card>

            <Row style="margin-top:10px;">
                <Col style="width:48%;float:left" >
                    <Collapse v-model="catation3">
                        <Panel name="1">
                            电子起诉状
                            <div slot="content" class="elendi">
                                <!-- <div style="text-align:center"><h2>民事起诉状</h2></div><br/><br/>
                                <div>
                                    <p><span>原告：</span>打搜房和说说到被次撒大大合伙人多打手打搜房和说说到被次撒大大合伙人多打手打搜房和说说到被次撒大大合伙人</p>
                                </div><br/>
                                <div>
                                    <p><span>此致</span><br/>
                                    <span>思明区人民法院</span>
                                    </p>
                                </div><br/> -->
                                <iframe scrolling="auto"
                                    id="printArea"
                                 src="https://court1.ptnetwork001.com/upload/pdf/2018/12/13/1544683308648.pdf" class="scrollStyle" style="height:500px" width="100%" height="100%">
                                    This browser does not support PDFs. Please download the PDF to view it: <a href="/test.pdf" rel="external nofollow" >Download PDF</a>
                                </iframe>
                                <!-- <div class="button-clas">
                                    <Button size='large' @click="printF" style="background:#2083D8;color:#fff" >打印</Button>
                                </div> -->
                            </div>
                        </Panel>
                    </Collapse>
                </Col>
                <Col style="width:48%;float:right">
                    <Collapse v-model="catation4">
                        <Panel name="1">
                            纸质起诉状
                            <div slot="content" class="carou">
                                <Carousel  v-model="value1"  :dots="setting.dots" :radius-dot="setting.radiusDot">
                                    <CarouselItem v-for="item in imgList">
                                        <div class="demo-carousel" :style="{padding: '10px',marginTop:'20px',display:'inline-block',width: '100%'}">
                                           <img :src="item.path " style="height:100%;" alt="">
                                        </div>
                                    </CarouselItem>
                                </Carousel>
                            </div>
                        </Panel>
                    </Collapse>
                </Col>
            </Row>
        </div>

    </div>
    <div class="bookbuilding-table" style="margin-top:15px">
        <Row >
            <Col span="24" class="noemalTb th-header">
                答辩状
            </Col>
        </Row>
        <div class="contain">
            <Col span="24" class="nextTip">
                    答辩状摘要
            </Col>
            <Card>
                <Row class="tabs" style="">
                    <Col span="3" align="left" valign="middle" class="Tbs height-wit tb-head" style="position:absolute;">
                        答辩意见
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
            </Card>

            <Row style="margin-top:10px;">
                <Col style="width:48%;float:left" >
                    <Collapse v-model="catation3">
                        <Panel name="1">
                            电子答辩状
                            <div slot="content" class="elendi">
                                <!-- <div style="text-align:center"><h2>民事起诉状</h2></div><br/><br/>
                                <div>
                                    <p><span>原告：</span>打搜房和说说到被次撒大大合伙人多打手打搜房和说说到被次撒大大合伙人多打手打搜房和说说到被次撒大大合伙人</p>
                                </div><br/>
                                <div>
                                    <p><span>此致</span><br/>
                                    <span>思明区人民法院</span>
                                    </p>
                                </div><br/> -->
                                <iframe scrolling="auto"
                                    id="printArea"
                                 src="https://court1.ptnetwork001.com/upload/pdf/2018/12/13/1544683308648.pdf" class="scrollStyle" style="height:500px" width="100%" height="100%">
                                    This browser does not support PDFs. Please download the PDF to view it: <a href="/test.pdf" rel="external nofollow" >Download PDF</a>
                                </iframe>
                                <!-- <div class="button-clas">
                                    <Button size='large' @click="printF" style="background:#2083D8;color:#fff" >打印</Button>
                                </div> -->
                            </div>
                        </Panel>
                    </Collapse>
                </Col>
                <Col style="width:48%;float:right">
                    <Collapse v-model="catation4">
                        <Panel name="1">
                            纸质答辩状
                            <div slot="content" class="carou">
                                <Carousel  v-model="value1"  :dots="setting.dots" :radius-dot="setting.radiusDot">
                                    <CarouselItem v-for="item in imgList">
                                        <div class="demo-carousel" :style="{padding: '10px',marginTop:'20px',display:'inline-block',width: '100%'}">
                                           <img :src="item.path " style="height:100%;" alt="">
                                        </div>
                                    </CarouselItem>
                                </Carousel>
                            </div>
                        </Panel>
                    </Collapse>
                </Col>
            </Row>
        </div>

    </div>
</div>
</template>
<script>
import { formatDate } from '@/libs/date'
export default {
    data(){
        return{
            caseInfo:{

            },
            showNum:0,
            catation3:'1',
            catation4:'1',
            setting: {
                dots: 'outside',
                radiusDot: true
            },
            value1: 0,
            imgList:[
                {
                    path:'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3546899142,2037600493&fm=27&gp=0.jpg'
                },
                {
                    path:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=4045167100,153241695&fm=27&gp=0.jpg'
                },
            ],
        }
    },
    methods:{
        changeMenu(num){
            let menuCard = document.getElementsByClassName("selTabs");
            for(let i=0;i<menuCard.length;i++){
                menuCard[i].classList.remove('tabOn');
            }
            menuCard[num].classList.add('tabOn');
        },
        printF() {
            let subOutputRankPrint = document.getElementById("printArea");
            console.log(subOutputRankPrint.innerHTML);
            let newContent = subOutputRankPrint.innerHTML;
            let oldContent = document.body.innerHTML;
            document.body.innerHTML = newContent;
            window.print();
            window.location.reload();
            document.body.innerHTML = oldContent;
        },
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

