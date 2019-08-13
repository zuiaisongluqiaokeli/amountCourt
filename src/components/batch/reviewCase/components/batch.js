import { formatDate } from '@/libs/date';
const allColums = {
    leftColums:[
        {
            type: "selection",
            // width: 55,
            align: "center"
        },
        {
            title: '序号',
            type: 'index',
            // width: 55,
            align: 'center'
        },
        {
            title: '批次-流水号',
            key: 'flowNumber',
            // width: 130,
            align: 'center',
            render: (h, params) => {
                return h(
                    'span',
                    {},
                  params.row.flowNumber ?  params.row.flowNumber : "暂无"
                );
            }
        },
        {
            title: '网申号',
            key: 'netApplicationNo',
            // width: 150,
            align: 'center',
            render: (h, params) => {
                return h(
                    'span',
                    {},
                  params.row.netApplicationNo ?  params.row.netApplicationNo : "暂无"
                );
            }
        },
        {
            title: '原告姓名/名称',
            key: 'plaintiffName',
            // width: 120,
            align: 'center',
            render: (h, params) => {
                return h(
                    'span',
                    {},
                  params.row.plaintiffName ?  params.row.plaintiffName : "暂无"
                );
            }
        },
        {
            title: '原告代理人',
            key: 'plaintiffLawyerName',
            // width: 120,
            align: 'center',
            render: (h, params) => {
                return h(
                    'span',
                    {},
                  params.row.plaintiffLawyerName ?  params.row.plaintiffLawyerName : "暂无"
                );
            }
        },
        {
            title: '被告',
            key: 'defendantName',
            // width: 120,
            align: 'center',
            render: (h, params) => {
                return h(
                    'span',
                    {},
                  params.row.defendantName ?  params.row.defendantName : "暂无"
                );
            }
        },
        {
            title: '提交日期',
            key: 'receiceDate',
            // width: 120,
            align: 'center',
            render: (h, params) => {
                return h(
                    'span',
                    {},
                    params.row.receiceDate ? formatDate(new Date(params.row.receiceDate), 'yyyy-MM-dd') : "暂无"
                );
            }
        },
    ],
    rightColums:[
        {
            type: "selection",
            width: 55,
            align: "center",
            fixed:'left'
        },
        {
            title: '序号',
            type: 'index',
            maxWidth: 55,
            align: 'center',
            // fixed:'left'
        },
        {
            title: '流水号',
            key: 'flowNumber',
            width:190,
            align: 'center',
            render: (h, params) => {
                return (
                  "div", [h("span", params.row.flowNumber ? params.row.flowNumber : "暂无")]
                );
            }
        },
    ],
    caseLeftColums:[
        {
            type: "selection",
            width: 55,
            align: "center"
        },
        {
            title: '序号',
            type: 'index',
            width: 55,
            align: 'center'
        },
        {
            title: '批次-流水号',
            key: 'flowNumber',
            // width: 120,
            align: 'center',
        },
        {
            title: '案号',
            key: 'caseNo',
            width: 170,
            align: 'center'
        },
        
        {
            title: '案由',
            key: 'flowNumber',
            width: 120,
            align: 'center',
            render: (h, params) => {
                return h(
                    'span',
                    {},
                    params.row.brief ? params.row.brief.name : "无"
                );
            }
        },
        {
            title: '原告姓名/名称',
            key: 'name',
            width: 120,
            align: 'center',
            render: (h, params) => {
                let litigantStr = '';
                if(params.row.litigants){
                    for(let i=0;i<params.row.litigants.length;i++){
                        if(params.row.litigants[i].litigationStatus.litigantStatusName == '原告'){
                            litigantStr = litigantStr + params.row.litigants[i].litigantName + ',';
                        }
                    }
                    litigantStr=litigantStr.substring(0,litigantStr.length-1)
                }
                
                return h("span", litigantStr)
            }
        },
        {
            title: '原告代理人',
            key: 'name',
            width: 120,
            align: 'center',
            render: (h, params) => {
                let strs = '';
                if(params.row.litigants){
                    for(let i=0;i<params.row.litigants.length;i++){
                        if(params.row.litigants[i].litigationStatus.litigantStatusName == '原告'){
                            let ary = params.row.litigants[i].litigantLawyers;
                            
                            if(ary && ary.length > 0){
                                for(let y=0;y<ary.length;y++){
                                    strs = strs + ary[y].lawyer.agentName + ',';
                                }
                            }
                            
                        }
                    }
                    strs=strs.substring(0,strs.length-1)
                }
                
                return h("span", strs)
            }
        },
        {
            title: '立案日期',
            key: 'name',
            width: 120,
            align: 'center',
            render: (h, params) => {
                return h(
                    'span',
                    {},
                    formatDate(new Date(params.row.filingDate), 'yyyy-MM-dd')
                );
            }
        },
    ],
}

export default allColums