import Util from '@/libs/util.js';

const service = Util.ajax;

export function queryLawCase (params) {
    return service({
        url: '/court/infoManage/queryLawCase.jhtml',
        method: 'GET',
        params
    });
}

export function batchBuildDiplomsLawCaseList (params) {
    return service({
        url: '/court/case/batchBuildDiplomsLawCaseList.jhtml',
        method: 'GET',
        params
    });
}

export function downloadZip (params) {
    return service({
        url: '/court/infoManage/downloadZip.jhtml',
        method: 'GET',
        params
    });
}

/**
 * 撤案
 */
export function backoutCase (lawCaseIds) {
    const params = {
        lawCaseIds
    }
    return service({
        url: '/court/case/closeLawCase.jhtml',
        method: 'GET',
        params
    });
}


/**
 * 结案
 */
export function overLawCase (lawCaseIds,closeType,closeDate,closeMoney) {
    const params = {
        lawCaseIds,
        closeType,
        closeDate,
        closeMoney,
    }
    return service({
        url: '/court/case/overLawCase.jhtml',
        method: 'GET',
        params
    });
}

export function updateLawCaseState (lawCaseId,process) {
    const params = {
        lawCaseId,
        process
    }
    return service({
        url: '/court/case/updateLawCaseState.jhtml',
        method: 'post',
        params
    });
}
export function updatecaseNo (lawCaseId,caseNo) {
    const params = {
        lawCaseId,
        caseNo
    }
    return service({
        url: '/court/infoManage/updateCaseNo.jhtml',
        method: 'GET',
        params
    });
}


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
// 要素信息
export function essential (data) {
    return service({
        url: '/court/case/upDataLawCaseInfo.jhtml',
        method: 'post',
        data
    });
}
// 要素信息保存
export function essentialSave (data) {
    return service({
        url: 'court/case/updataByLawCaseId.jhtml',
        method: 'post',
        data
    });
}

// 删除合同
export function deleteContract (contractId) {
    const params = {
        contractId,
    }
    return service({
        url: 'court/case/delContract.jhtml',
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
//补充证据提交
export function evidenceSubmitted (data) {
    return service({
        url: 'court/case/upEvidence.jhtml',
        method: 'POST',
        data
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