import { formatDate } from '@/libs/date';
const allColums = {
    leftColums:[
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
            title: '案号',
            key: 'caseNo',
            width: 180,
            align: 'center',
            render: (h, params) => {
                return (
                  "div", [h("span", params.row.caseNo ? params.row.caseNo : "暂无")]
                );
            }
        },
        {
            title: '批次-流水号',
            key: 'flowNumber',
            width: 180,
            align: 'center',
            render: (h, params) => {
                return (
                  "div", [h("span", params.row.flowNumber ? params.row.flowNumber : "暂无")]
                );
            }
        },
        {
            title: '案由',
            key: 'briefName',
            align: 'center',
            render: (h, params) => {
                return (
                  "div", [h("span", params.row.briefName ? params.row.briefName : "暂无")]
                );
            }
        },
        // {
        //     title: '网申号',
        //     key: 'netApplicationNo',
        //     width: 150,
        //     align: 'center'
        // },
        {
            title: '原告姓名/名称',
            key: 'plaintiffName',
            align: 'center',
            render: (h, params) => {
                return (
                  "div", [h("span", params.row.plaintiffName ? params.row.plaintiffName : "暂无")]
                );
            }
        },
        {
            title: '原告代理人',
            key: 'plaintiffLawyerName',
            align: 'center',
            render: (h, params) => {
                return (
                  "div", [h("span", params.row.plaintiffLawyerName ? params.row.plaintiffLawyerName : "暂无")]
                );
            }
        },
        {
            title: '被告',
            key: 'defendantName',
            align: 'center',
            render: (h, params) => {
                return (
                  "div", [h("span", params.row.defendantName ? params.row.defendantName : "暂无")]
                );
            }
        },
        // {
        //     title: '提交日期',
        //     key: 'receiceDate',
        //     width: 120,
        //     align: 'center',
        //     render: (h, params) => {
        //         return h(
        //             'span',
        //             {},
        //             params.row.receiceDate ? formatDate(new Date(params.row.receiceDate), 'yyyy-MM-dd') : "暂无"
        //         );
        //     }
        // },
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
            width: 180,
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
            key: 'briefName',
            width: 120,
            align: 'center',
            render: (h, params) => {
                return h(
                    'span',
                    {},
                    params.row.briefName ? params.row.briefName : "无"
                );
            }
        },
        {
            title: '原告姓名/名称',
            key: 'plaintiffName',
            align: 'center',
        },
        {
            title: '原告代理人',
            key: 'plaintiffLawyerName',
            align: 'center',
        },
        {
            title: '立案日期',
            key: 'filingDate',
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