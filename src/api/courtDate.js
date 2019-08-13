import Util from '@/libs/util.js';

const service = Util.ajax;


/**
 * 获取审判庭列表
 */
export function tribunalList (params) {
    return service({
        url: '/court/schedulding/tribunalList.jhtml',
        method: 'GET',
        params
    });
}

/**
 * 批量排期
 */
export function batchScheduldingLawCaseList (data) {
    return service({
        url: '/court/schedulding/batchScheduldingLawCaseList.jhtml',
        method: 'post',
        data
    });
}

/**
 * 获取案件最新排期信息
 * @param {*} judgeId 
 */
export function newlySchedulding (lawCaseId) {
    const params = {
        lawCaseId
    };
    return service({
        url: '/court/schedulding/newlySchedulding.jhtml',
        method: 'get',
        params
    });
}

/**
 * 获取案件所有的排班列表
 * @param {*} judgeId 
 */
export function getAllList (lawCaseId) {
    const params = {
        lawCaseId
    };
    return service({
        url: '/court/schedulding/list.jhtml',
        method: 'get',
        params
    });
}

/**
 * 获取案件法官，书记员，法院列表，法庭列表
 * @param {*} judgeId 
 */
export function scheduldingInfo (lawCaseId) {
    const params = {
        lawCaseId
    };
    return service({
        url: '/court/schedulding/scheduldingInfo.jhtml',
        method: 'get',
        params
    });
}






/**
 * 获取节假日
 * @param {*} judgeId 
 */
export function holiday (judgeId) {
    const params = {
        judgeId
    };
    return service({
        url: '/court/schedulding/holiday.jhtml',
        method: 'get',
        params
    });
}

export function courtDetail (schedulingId) {
    const params = {
        schedulingId
    };
    return service({
        url: '/court/scheduling/detail.jhtml',
        method: 'get',
        params
    });
}

export function getNowSchedulding (dayTimes, date, tribunalId) {
    const params = {
        dayTimes,
        date,
        tribunalId
    };
    return service({
        url: '/court/scheduling/getNowSchedulding.jhtml',
        method: 'get',
        params
    });
}

export function findDayTimes (params) {
    return service({
        url: '/court/schedulding/findDayTimes.jhtml',
        method: 'get',
        params
    });
}

/**
 * 单个排期（修改）
 * @param {} schedulingId  排版id
 * @param {*} tribunalId 法庭id
 * @param {*} dayTimes  //排版规则序列号
 * @param {*} startDate 开庭时间,类似2018-12-25
 */
export function modify (schedulingId, tribunalId, dayTimes, startDate) {
    const params = {
        schedulingId,
        tribunalId,
        dayTimes,
        startDate
    };
    return service({
        url: '/court/schedulding/modify.jhtml',
        method: 'get',
        params
    });
}

export function confirm (schedulingId, isConfirm, confirmType) {
    const params = {
        schedulingId,
        isConfirm,
        confirmType
    };
    return service({
        url: '/court/scheduling/confirm.jhtml',
        method: 'get',
        params
    });
}

export function confirmOne (schedulingId, isConfirm, litigantId) {
    const params = {
        schedulingId,
        isConfirm,
        litigantId
    };
    return service({
        url: '/court/scheduling/confirm.jhtml',
        method: 'get',
        params
    });
}

export function confirmDetail (schedulingId) {
    const params = {
        schedulingId
    };
    return service({
        url: '/court/scheduling/confirm/detail.jhtml',
        method: 'get',
        params
    });
}
export function handArrange (caseId, judgeId, clerkId) {
    const params = {
        caseId,
        judgeId,
        clerkId
    };
    return service({
        url: '/court/scheduling/handArrange.jhtml',
        method: 'get',
        params
    });
}
export function hand (caseId, judgeId, clerkId, tribunalId, date) {
    const params = {
        caseId,
        judgeId,
        clerkId,
        tribunalId,
        date
    };
    return service({
        url: '/court/scheduling/hand.jhtml',
        method: 'get',
        params
    });
}
/**首次排班
 * @param {*} lawCaseId 案件id
 * @param {*} judgeId 法官id
 * @param {*} clerkId 书记员id
 * @param {*} tribunalId 法庭id
 * @param {*} startDate 开庭时间，格式2018-12-25
 * @param {*} dayTimes 排班规则序号
 */
export function handArrangeConfirm (lawCaseId, judgeId, clerkId, tribunalId, startDate,  dayTimes) {
    const params = {
        lawCaseId,
        judgeId,
        clerkId,
        tribunalId,
        startDate,
        dayTimes
    };
    return service({
        url: '/court/schedulding/handArrangeConfirm.jhtml',
        method: 'get',
        params
    });
}

/**
 * 
 * @param {*} startYear 年份
 * @param {*} startMonth 月份
 * @param {*} judgeId 法院工作人员id（默认法官）,多个使用”,”拼接
 * @param {*} progress 案件的所处阶段,多个使用”,”拼接 (包括：立案, 排班, 送达, 举证, 质证, 开庭, 已开庭, 已结案)
 * @param {*} state 排班的状态，多个使用”,”拼接（包括0，1，2（0初始状态，1原告已确认，2被告已确认）
 * @param {*} isOpen 是否开庭
 */
export function calendarList (startYear, startMonth, judgeId, progress,state,isOpen) {
    const params = {
        startYear,
        startMonth,
        judgeId,
        progress,
        state,
        isOpen
    };
    return service({
        url: '/court/schedulding/calendar/list.jhtml',
        method: 'post',
        params
    });
}

/**
 *根据开庭地点获取审判庭室
 * 
 */
export function batchTtibunalsList (courtId) {
    let params = {
      courtId
    }
    return service({
        url: '/court/schedulding/batchTtibunalsList.jhtml',
        method: 'get',
        params
    });
  }

export function list (params) {
    return service({
        url: '/court/infoManage/queryCourtInfo.jhtml',
        method: 'GET',
        params
    });
}

export function addCourtInfo (params) {
    return service({
        url: '/court/infoManage/addCourtInfo.jhtml',
        method: 'post',
        params
    });
}

export function delCourtInfo (params) {
    return service({
        url: '/court/infoManage/delCourtInfo.jhtml',
        method: 'post',
        params
    });
}

export function updateCourtInfo (params) {
    return service({
        url: '/court/infoManage/updateCourtInfo.jhtml',
        method: 'post',
        params
    });
}


export function getAssociateCase (caseNo) {
    const params = {
        caseNo,
    };
    return service({
        url: '/court/scheduling/getAssociateCase.jhtml',
        method: 'GET',
        params
    });
}

export function updateScheduldingIsConfirmOpen (isConfirmOpen,scheduldingId,remark) {
    const params = {
        isConfirmOpen,
        scheduldingId,
        remark
    };
    return service({
        url: '/court/scheduling/updateScheduldingIsConfirmOpen.jhtml',
        method: 'GET',
        params
    });
}

export function cancelSchedulding (scheduldingId) {
    const params = {
        scheduldingId,
    };
    return service({
        url: '/court/scheduling/cancelSchedulding.jhtml',
        method: 'GET',
        params
    });
}

/** 
 * 全国法院信息查询接口
 */
export function findCourt (params) {
    return service({
        url: '/court/infoManage/findCourt.jhtml',
        method: 'GET',
        params
    });
}

/** 
 * 全国法院信息添加接口
 */
export function addCourt (params) {
    return service({
        url: '/court/infoManage/addCourt.jhtml',
        method: 'GET',
        params
    });
}

/** 
 * 全国法院信息修改接口
 */
export function updateCourt (params) {
    return service({
        url: '/court/infoManage/updateCourt.jhtml',
        method: 'GET',
        params
    });
}

/** 
 * 全国法院信息修改接口
 */
export function delCourt (ids) {
    const params = {
        ids
    }
    return service({
        url: '/court/infoManage/delCourt.jhtml',
        method: 'GET',
        params
    });
}

/** 
 * 获取上级法院
 */
export function getParentCourt () {
    return service({
        url: '/court/infoManage/getParentCourt.jhtml',
        method: 'GET',
    });
}

/** 
 * 电话记录
 */
export function telephoneRecord (params) {
    return service({
        url: '/court/sqmobile/telephoneRecord.jhtml',
        method: 'post',
        params
    });
}

/**
 * 获取配置法庭
 * @param {*} courtId 
 */
export function queryTribunalList (courtId) {
    const params = {
        courtId,
    };
    return service({
        url: '/court/infoManage/queryTribunalList.jhtml',
        method: 'GET',
        params
    });
}

/**
 * 配置法庭
 * @param {*} courtId 
 */
export function setTribunalList (courtId,tribunalIds) {
    const params = {
        courtId,
        tribunalIds
    };
    return service({
        url: '/court/infoManage/setTribunalList.jhtml',
        method: 'GET',
        params
    });
}

/**
 * 获取排班规则列表
 * @param  {true/false} groupRule  [是否组合排班]
 * @param  {WINTER/SUMMER} season     [夏令时/冬令时]
 * @param  {number} pageNumber [页码]
 * @param  {[number]} pageSize   [分页大小]
 * @return {[type]}            [description]
 */
export function getRuleList (groupRule, season, pageNumber, pageSize) {
    const params = {
        groupRule,
        season,
        pageNumber,
        pageSize
    };
    return service({
        url: '/court/scheduldingRule/list.jhtml',
        method: 'GET',
        params
    });
}


/**
 * 删除排班规则前的确认
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
export function delateComfirm (id) {
    const params = {
        id
    };
    return service({
        url: '/court/scheduldingRule/deleteBeforeConfirm.jhtml',
        method: 'GET',
        params
    });
}

/**
 * 删除排班规则
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
export function delateRule (id) {
    const params = {
        id
    };
    return service({
        url: '/court/scheduldingRule/delete.jhtml',
        method: 'GET',
        params
    });
}

/**
 * 添加排班规则
 * @param {[type]} hour         [小时]
 * @param {[type]} minute       [分钟]
 * @param {[type]} groupRule    [是否组合排班]
 * @param {[type]} groupDayTime [组合规则构成元素]
 * @param {[type]} season       [冬令时/夏令时]
 * @param {[type]} tribunalId   [法庭id]
 * @param {[type]} groupId      [绑定的排班规则]
 */
export function addRule (hour,minute,groupRule,groupDayTime,season,tribunalId,groupId) {
    const params = {
        hour,
        minute,
        groupRule,
        groupDayTime,
        season,
        tribunalId,
        groupId
    };
    return service({
        url: '/court/scheduldingRule/add.jhtml',
        method: 'GET',
        params
    });
}

/**
 * 获取对应的冬令时排班规则
 * @param {[type]} hour         [小时]
 * @param {[type]} minute       [分钟]
 * @param {[type]} groupRule    [是否组合排班]
 * @param {[type]} groupDayTime [组合规则构成元素]
 * @param {[type]} season       [冬令时/夏令时]
 * @param {[type]} tribunalId   [法庭id]
 * @param {[type]} groupId      [绑定的排班规则]
 */
export function getWinterRule (hour,minute,groupRule,groupDayTime,tribunalId) {
    const params = {
        hour,
        minute,
        groupRule,
        groupDayTime,
        season,
        tribunalId,
        groupId
    };
    return service({
        url: '/court/scheduldingRule/winterScheduldingRule.jhtml',
        method: 'GET',
        params
    });
}