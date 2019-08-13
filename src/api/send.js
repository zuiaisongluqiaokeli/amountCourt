import Util from '@/libs/util.js';

const service = Util.ajax;

/**
 * 当事人可以发送的文书
 * 案件id
 */
export function sendInfo (lawCaseId) {
    const params={
        lawCaseId
    }
    return service({
        url: '/court/send/sendInfo.jhtml',
        method: 'get',
        params
    });
}

/**
 * 发送文书
 * 
 */
export function sendDiploms (params) {
    return service({
        url: '/court/send/sendDiploms.jhtml',
        method: 'post',
        params
    });
}


/**
 * 获取案件的历史送达记录
 * 案件id
 */
export function historySendList (lawCaseId) {
    const params={
        lawCaseId
    }
    return service({
        url: '/court/send/historySendList.jhtml',
        method: 'get',
        params
    });
}

/**
 * 历史送达的打包下载文书
 * 送达记录的id；送达的文书的id,多个使用”,”拼接；送达的文书的id,多个使用”,”拼接
 */
export function downloadSendDiploms (sendId,diplomsSendId,otherDiplomsId) {
    const params={
        sendId,
        diplomsSendId,
        otherDiplomsId
    }
    return service({
        url: '/court/send/downloadSendDiploms.jhtml',
        method: 'get',
        params
    });
}


/**
 * 历史送达中的文书预览
 * 文书送达id,文书送达记录的id的拼接，使用”,”
 */
export function viewDiploms (diplomsSendId) {
    const params={
        diplomsSendId
    }
    return service({
        url: '/court/send/viewDiploms.jhtml',
        method: 'get',
        params
    });
}

/**
 * 案件中的当事人送达记录的确认送达
 */
export function confirmSend (params) {
    return service({
        url: '/court/send/confirmSend.jhtml',
        method: 'get',
        params
    });
}

/**
 * 案件中的批量打印快递单功能
 */
export function printEms (params) {
    return service({
        url: '/court/send/printEms.jhtml',
        method: 'get',
        params
    });
}
/**
 * 案件中的单个打印快递单功能
 */
export function printEmsSingle (list) {
    const params = {
        printType: '620k',
        list
    }
    return service({
        url: '/court/send/printEms.jhtml',
        method: 'POST',
        data:params
    });
}

/**
 * 电话通知和短信通知的案件当事人信息
 * 文书送达id,文书送达记录的id的拼接，使用”,”
 */
export function smsLitigantInfo (lawCaseId) {
    const params={
        lawCaseId
    }
    return service({
        url: '/court/send/smsLitigantInfo.jhtml',
        method: 'get',
        params
    });
}

/**
 * 获取短信模板
 * 
 */
export function getMsgTemp () {
    return service({
        url: '/qtw/info/getMsgTemp.jhtml',
        method: 'get',
    });
}

/**
 * 批量发送短信
 * 
 */
export function sendMsg (data) {
    return service({
        url: '/qtw/info/sendMsg.jhtml',
        method: 'post',
        data
    });
}

/**
 * 电话通知和短信通知记录
 * 
 */
export function smsNoteList (lawCaseId,pageSize,pageNumber) {
    const params={
        lawCaseId,
        pageSize,
        pageNumber
    }
    return service({
        url: '/court/send/smsNoteList.jhtml',
        method: 'get',
        params
    });
}


/**
 * 邮件模板填充
 * @param {*} params 
 */
export function emailMessageTemplateContent (params) {
    return service({
        url: '/court/send/emailMessageTemplateContent.jhtml',
        method: 'get',
        params
    });
}