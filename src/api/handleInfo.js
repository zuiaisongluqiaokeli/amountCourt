import Util from '@/libs/util.js';

const service = Util.ajax;

// 立案信息
export function lawCaseQuery (lawCaseId) {
    const params = {
        lawCaseId,
    }
    return service({
        url: '/court/case/lawCaseQuery.jhtml',
        method: 'GET',
        params
    });
}
// 立案信息-案由列表
export function briefList (params) {
    return service({
        url: '/court/case/briefList.jhtml',
        method: 'GET',
        params
    });
}
// 立案信息-承办部门
export function courtList (params) {
    return service({
        url: '/court/case/courtList.jhtml',
        method: 'GET',
        params
    });
}
// 立案信息-承办法官
export function judgeList (params) {
    return service({
        url: '/court/case/judgeList.jhtml',
        method: 'GET',
        params
    });
}
// 立案信息-法官助理
export function assistantJudgeList (params) {
    return service({
        url: '/court/case/assistantJudgeList.jhtml',
        method: 'GET',
        params
    });
}
// 立案信息-书记员
export function clerkList (params) {
    return service({
        url: '/court/case/clerkList.jhtml',
        method: 'GET',
        params
    });
}
// 立案信息-案件保存
export function editLawCase (data) {
    return service({
        url: '/court/case/editLawCase.jhtml',
        method: 'post',
        data
    });
}
// 立案信息-人民评审员列表
export function peopleAssessorList (params) {
    return service({
        url: '/court/case/peopleAssessorList.jhtml',
        method: 'get',
        params
    });
}
// 立案信息-合议庭成员
export function addCollegiateBench (data) {
    return service({
        url: '/court/case/addCollegiateBench.jhtml',
        method: 'post',
        data
    });
}
// 代理人和案件列表
export function litigantLawyerList (lawCaseId) {
    const params = {
        lawCaseId,
    }
    return service({
        url: '/court/litigant/litigantLawyerList.jhtml',
        method: 'GET',
        params
    });
}
// 代理人和案件列表
export function litigationPay (lawCaseId) {
    const params = {
        lawCaseId,
    }
    return service({
        url: '/court/case/litigationPay.jhtml',
        method: 'GET',
        params
    });
}
// 代理人和案件列表 -- 当事人信息
export function onlyLitigantQuery (litigantId) {
    const params = {
        litigantId
    }
    return service({
        url: '/court/litigant/onlyLitigantQuery.jhtml',
        method: 'get',
        params
    });
}
// 代理人和案件列表 -- 删除当事人
export function delLitigant (litigantId) {
    const params = {
        litigantId,
    }
    return service({
        url: '/court/litigant/delLitigant.jhtml',
        method: 'get',
        params
    });
}
// 代理人和案件列表 -- 当事人关系
export function addRelationship (params) {
    return service({
        url: '/court/litigant/addRelationship.jhtml',
        method: 'get',
        params
    });
}
// 代理人和案件列表 -- 编辑当事人关系
export function editRelationship (params) {
    return service({
        url: '/court/litigant/editRelationship.jhtml',
        method: 'get',
        params
    });
}
// 代理人和案件列表 -- 删除当事人关系
export function delRelationship (relationshipId) {
    const params = {
        relationshipId,
    }
    return service({
        url: '/court/litigant/delRelationship.jhtml',
        method: 'get',
        params
    });
}
// 代理人和案件列表 -- 添加当事人
export function addLitigant (data) {
    return service({
        url: '/court/litigant/addLitigant.jhtml',
        method: 'post',
        data
    });
}
// 代理人和案件列表 -- 编辑当事人
export function editLitigant (data) {
    return service({
        url: '/court/litigant/editLitigant.jhtml',
        method: 'post',
        data
    });
}
// 起诉状
export function indictment (lawCaseId) {
    const params = {
        lawCaseId,
    }
    return service({
        url: '/court/case/indictment.jhtml',
        method: 'GET',
        params
    });
}
// 证明与委托材料
export function material (lawCaseId) {
    const params = {
        lawCaseId,
    }
    return service({
        url: '/court/litigant/material.jhtml',
        method: 'GET',
        params
    });
}
// 证据
export function evidenceList (lawCaseId) {
    const params = {
        lawCaseId,
    }
    return service({
        url: '/court/case/evidenceList.jhtml',
        method: 'GET',
        params
    });
}
// 时间轴
export function processNote (lawCaseId) {
    const params = {
        lawCaseId,
    }
    return service({
        url: '/court/case/processNote.jhtml',
        method: 'GET',
        params
    });
}