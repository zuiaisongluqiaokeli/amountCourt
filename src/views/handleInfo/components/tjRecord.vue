<template>
 <div>
    <Card style="margin-bottom:10px" v-if="allowSend.indexOf(this.$store.getters.roLeName)>-1">
        <label for="fouce">发布调解记录</label>
        <div name="fouce" style="display:inline-block;width:30%;vertical-align: top;margin-left:20px">
            <Input name="fouce" v-model="sendData.content" type="textarea" :rows="4" placeholder="请输入调解记录"></Input>                
        </div>
        <div style="text-align:left;margin-top:20px;">
            <Button @click="sendRecord" type="primary">发布</Button>
        </div>
    </Card>
    <Card style="margin-bottom:10px">
        <div class="titleLini">
            <span style="font-weight: bold;">历史调解记录:</span>
        </div>
        <div>
            <Table height="500" border  :columns="recourdColum" :data="recourdList"></Table>
        </div>
    </Card>
 </div>
</template>

<script>
import {
    addRecords,
    getRecords
} from "@/api/handleInfo";
 export default {
   components: {
   },
   data () {
     return {
        sendData:{//调解记录发送内容
            lawCaseId:"",
            name:"",
            roleName:"",
            content:""
        },
        recourdList:[],//调解记录列表
        recourdColum:[
            {
                title: '姓名',
                key: 'operatorName',
                align: "center"
            },
            {
                title: '调解记录',
                key: 'operationalLog',
                align: "center"
            },
            {
                title: '发布日期',
                key: 'createDate',
                align: "center",
                width:180,
                render: function (h, params) {
                    return h('span', new Date(params.row.createDate).Format('yyyy-MM-dd hh:mm:ss'));/*这里的this.row能够获取当前行的数据*/
                }
            }
        ],
        allowSend:["法院调解员","机构调解员"]
     }
   },
   methods: {
        sendRecord(){//发送调解记录
            this.sendData.lawCaseId=this.$store.getters.caseId;
            this.sendData.name=this.$store.getters.userName;
            this.sendData.roleName=this.$store.getters.roLeName;
            console.log(this.sendData)
            addRecords(this.sendData).then(res => {
                if (res.data.state == 100) {
                    this.sendData.content='';
                    this.init()//刷新
                }else{
                    this.$Message.error(res.data.message);
                }
            });
        },
        init(){//进来的初始化
            //获取该案件调解记录
            getRecords({lawCaseId:this.$store.getters.caseId}).then(res => {
                if (res.data.state == 100) {
                   let data=res.data.data;
                   this.recourdList=data ? data : [];
                }else{
                    this.$Message.error(res.data.message);
                }
            });
        },
        initFormatter(){//时间戳转换时间
            Date.prototype.Format = function(fmt) { //
                let o = {  
                    "M+" : this.getMonth()+1,                 //月份  
                    "d+" : this.getDate(),                    //日  
                    "h+" : this.getHours(),                   //小时  
                    "m+" : this.getMinutes(),                 //分  
                    "s+" : this.getSeconds(),                 //秒  
                    "q+" : Math.floor((this.getMonth()+3)/3), //季度  
                    "S"  : this.getMilliseconds()             //毫秒  
                };  
                if(/(y+)/.test(fmt))  
                    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));  
                for(var k in o)  
                    if(new RegExp("("+ k +")").test(fmt))  
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));  
                return fmt;  
            }
        },
    },
    created() {
        this.initFormatter();// 为Date 对象添加Format方法
    },
 }
</script>

<style scope>
</style>
