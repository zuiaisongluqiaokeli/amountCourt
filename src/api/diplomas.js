import Util from '@/libs/util.js';

const service = Util.ajax;

/**
 * 文书生成的当事人、文书模板列表信息
 * 案件id
 */
export function buildInfo (lawCaseId) {
    const params={
        lawCaseId
    }
    return service({
        url: '/court/diploms/buildInfo.jhtml',
        method: 'get',
        params
    });
}

/**
 * 文书生成
 * 当事人id；文书名字,隔开；
 */
export function buildDiploms (litigantId,buildDiplomsName,buildType) {
    const params={
        litigantId,
        buildDiplomsName,
        buildType
    }
    return service({
        url: '/court/diploms/buildDiploms.jhtml',
        method: 'get',
        params
    });
}

/**
 * 文书生成历史记录（当事人的文书）
 * 案件id；
 */
export function historyDiplomsList (lawCaseId) {
    const params={
        lawCaseId
    }
    return service({
        url: '/court/diploms/historyDiplomsList.jhtml',
        method: 'get',
        params
    });
}


/**
 * 打包下载生成的历史文书
 * 当事人id；批次；文书名,号隔开
 */
export function downloadDiploms (litigantId,batch,diplomsName) {
    const params={
        litigantId,
        batch,
        diplomsName
    }
    return service({
        url: '/court/diploms/downloadDiploms.jhtml',
        method: 'get',
        params
    });
}


/**
 * 预览生成的历史文书
 * 当事人id；批次；文书名,号隔开
 */
export function viewDiploms (litigantId,batch,diplomsName) {
    const params={
        litigantId,
        batch,
        diplomsName
    }
    return service({
        url: '/court/diploms/viewDiploms.jhtml',
        method: 'get',
        params
    });
}


/**
 * ceshi
 */
export function dbList (params) {
    return service({
        url: '/court/diploms/buildDiploms.jhtml',
        method: 'get',
        params
    });
}


/**
 * 文书编辑前置接口：预览
 */
export function buildView (lawCaseId,litigantId,diplomsName) {
    const params={
        lawCaseId,
        litigantId,
        diplomsName
    }
    return service({
        url: '/court/diploms/buildView.jhtml',
        method: 'get',
        params
    });
}