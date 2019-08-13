import Util from '@/libs/util.js';

const service = Util.ajax;

/**
 * 获取法律工作人员信息
 * @param {分页大小} pageSize 
 * @param {页码} pageNumber 
 */
export function getCourtWorkerInfo (data) {
    const params=data;
    return service({
        url: '/court/datebase/getJudgePage.jhtml',
        method: 'get',
        params
    });
}

/**
 * 获取指定工作人员信息
 * @param {分页大小} pageSize 
 * @param {页码} pageNumber 
 */
export function getOneCourtWorkerInfo (id) {
    const params={
        id,
    }
    return service({
        url: '/court/datebase/getJudge.jhtml',
        method: 'get',
        params
    });
}

/**
 * 获取指定工作人员信息(新)
 */
export function getJudgeInfo (id) {
    const params={
        id,
    }
    return service({
        url: '/court/datebase/getJudgeInfo.jhtml',
        method: 'get',
        params
    });
}

/**
 * 添加法律工作人员信息（旧接口）
 */
export function addCourtWorkerInfo (data) {
    const params=data;
    return service({
        url: '/court/datebase/addJudge.jhtml',
        method: 'get',
        params
    });
}

//添加法院工作人员（新接口）
export function addJudgeNew (data) {
    const params=data;
    return service({
        url: '/court/datebase/addJudgeNew.jhtml',
        method: 'get',
        params
    });
}

/**
 * 获取所有部门名称
 */
export function getAllDepartMentName () {
    return service({
        url: '/court/datebase/getCourtList.jhtml',
        method: 'get',
    });
}

/**
 * 获取法官助理列表
 */
export function assistantJudgeList () {
    return service({
        url: '/court/datebase/assistantJudgeList.jhtml',
        method: 'get',
    });
}

/**
 * 获取书记员或者代理书记员列表
 */
export function clerkList () {
    return service({
        url: '/court/datebase/clerkList.jhtml',
        method: 'get',
    });
}

/**
 * 修改法律工作人员信息
 */
export function editCourtWorkerInfo (data) {
    const params=data;
    return service({
        url: '/court/datebase/updateJudge.jhtml',
        method: 'get',
        params
    });
}

/**
 * 获取审判庭信息
 */
export function getCourtInfo (data) {
    const params=data
    return service({
        url: '/court/datebase/getTribunalPage.jhtml',
        method: 'get',
        params
    });
}

/**
 * 添加或修改审判庭信息
 */
export function addCourtInfo (data) {
    const params=data;
    return service({
        url: '/court/courtInfo/updateTribunal.jhtml',
        method: 'post',
        params
    });
}

/**
 * 获取部门信息
 */
export function getDepartMentInfo (data) {
    const params=data;
    return service({
        url: '/court/datebase/getCourtPage.jhtml',
        method: 'get',
        params
    });
}

/**
 * 添加部门信息
 */
export function addDepartMentInfo (data) {
    const params=data;
    return service({
        url: '/court/datebase/addCourt.jhtml',
        method: 'get',
        params
    });
}

/**
 * 修改部门信息
 */
export function editDepartMentInfo (data) {
    const params=data;
    return service({
        url: '/court/datebase/updateCourt.jhtml',
        method: 'get',
        params
    });
}

/**
 * 获取律师信息
 */
export function getLawyerInfo (pageSize,pageNumber,agentName,agentIdentiCard) {
    const params={
        pageSize,
        pageNumber,
        agentName,
        agentIdentiCard,
    }
    return service({
        url: '/court/datebase/getLawyerPage.jhtml',
        method: 'get',
        params
    });
}


/**
 * 获取当事人信息
 */
export function getPartyInfo (pageSize,pageNumber,lawCaseNo,litigantName,identityCard) {
    const params={
        pageSize,
        pageNumber,
        lawCaseNo,
        litigantName,
        identityCard
    }
    return service({
        url: '/court/datebase/getlitigantPage.jhtml',
        method: 'get',
        params
    });
}

/**
 * 获取人民陪审员信息
 */
export function getJurorInfo (data) {
    const params=data;
    return service({
        url: '/court/datebase/getPeoplePage.jhtml',
        method: 'get',
        params
    });
}

/**
 * 添加人民陪审员信息
 */
export function addJurorInfo (data) {
    const params=data;
    return service({
        url: '/court/datebase/addPeople.jhtml',
        method: 'get',
        params
    });
}

/**
 * 修改人民陪审员信息
 */
export function editJurorInfo (data) {
    const params=data;
    return service({
        url: '/court/datebase/updatePeoplePage.jhtml',
        method: 'get',
        params
    });
}

/**
 * 获取全国法院信息
 */
export function getLegalInfo (data) {
    const params=data;
    return service({
        url: '/court/datebase/getCourtInfoPage.jhtml',
        method: 'get',
        params
    });
}

/**
 * 添加全国法院信息
 */
export function addLegalInfo (data) {
    const params=data;
    return service({
        url: '/court/datebase/addCourtInfo.jhtml',
        method: 'get',
        params
    });
}

/**
 * 修改全国法院信息
 */
export function editLegalInfo (data) {
    const params=data;
    return service({
        url: '/court/datebase/updateCourtInfo.jhtml',
        method: 'get',
        params
    });
}

/**
 * 获取字号格式年份和当前字号
 */
export function findCaseNoFormat (data) {
    const params=data;
    return service({
        url: '/court/case/findCaseNoFormat.jhtml',
        method: 'get',
        params
    });
}

/**
 * 案号管理编辑
 */
export function caseNoAndProhibit (data) {
    const params=data;
    return service({
        url: '/court/case/caseNoAndProhibit.jhtml',
        method: 'get',
        params
    });
}

/**
 * 上传电子签章到易判平台
 */
export function uploadSign (data) {
    const params=data;
    return service({
        url: '/court/judgement_result/uploadSign.jhtml',
        method: 'get',
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
 * @param  {[type]} tribunalId   [法庭id]
 * @param  {[type]} groupRule    [是否组合排班]
 * @param  {[type]} groupDayTime [组合规则构成元素]
 * @return {[type]}              [description]
 */
export function getWinterRule (tribunalId,groupRule,groupDayTime) {
    const params = {
        tribunalId,
        groupRule,
        groupDayTime,
    };
    return service({
        url: '/court/scheduldingRule/winterScheduldingRule.jhtml',
        method: 'GET',
        params
    });
}

/**
 * 获取当前用户所属法院的法庭信息
 * @return {[type]} [description]
 */
export function getTribunalList () {
    const params = {
    };
    return service({
        url: '/court/scheduldingRule/getTribunalList.jhtml',
        method: 'GET',
        params
    });
}

/**
 * 获取当前法庭的冬令时普通规则列表
 * @param  {[type]} tribunalId [description]
 * @return {[type]}    [description]
 */
export function getTribunalWinterRuleList (tribunalId,season) {
    const params = {
        tribunalId,
        season
    };
    return service({
        url: '/court/scheduldingRule/ordinaryScheduldingRuleList.jhtml',
        method: 'GET',
        params
    });
}

