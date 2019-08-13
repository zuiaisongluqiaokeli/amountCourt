import Util from '@/libs/util.js';

const service = Util.ajax;

/**
 * 案件审批（旧）
 * lawCase  数组
 * 
 */
export function lawCaseAuditing (data) {
  return service({
      url: '/court/case/lawCaseAuditing.jhtml',
      method: 'post',
      data
  });
}

/**
 * 案件审批(新)
 * data  array
 * 
 */
export function distribution (data) {
  return service({
      url: '/court/case/distribution.jhtml',
      method: 'post',
      data
  });
}

/**
 * 案件分案(新)
 * data  array
 * 
 */
export function distributionJudge (data) {
  return service({
      url: '/court/case/distributionJudge.jhtml',
      method: 'post',
      data
  });
}

/**
 * 诉讼费计算
 * 
 */
export function litigationFeeCalculation (data) {
  return service({
      url: '/court/case/litigationFeeCalculation.jhtml',
      method: 'post',
      data
  });
}


/**
 * 批量文书当事人列表(旧)
 * 
 */
export function litigantLawCaseQuery (params) {
  return service({
      url: '/court/litigant/litigantLawCaseQuery.jhtml',
      method: 'get',
      params
  });
}

/**
 * 批量文书当事人列表（新）
 * 
 */
export function findLitigantLawCaseQuery (params) {
  return service({
      url: '/court/litigant/findLitigantLawCaseQuery.jhtml',
      method: 'get',
      params
  });
}

/**
 * 法官关联
 * judgeId  法官id
 * 
 */
export function judgeLinkage (judgeId) {
  const params = {
    judgeId
  }
  return service({
      url: '/court/case/judgeLinkage.jhtml',
      method: 'get',
      params
  });
}

//当事人文书
/**
 * 批量当事人文书生成
 * 
 */
export function batchBuildDiploms (data) {
  return service({
      url: '/court/diploms/batchBuildDiploms.jhtml',
      method: 'post',
      data
  });
}


//案件文书
/**
 * 批量案件文书生成
 * 
 */
export function downloadZip (data) {
  return service({
      url: '/court/judgement_result/downloadZip.jhtml',
      method: 'post',
      data
  });
}



/**
 * 当事人--地址列表
 * 
 */
export function addressLawCaseQuery (params) {
  return service({
      url: '/court/litigant/addressLawCaseQuery.jhtml',
      method: 'get',
      params
  });
}


/**
 * 文书批量发送
 * 
 */
export function batchSendDiploms (data) {
  return service({
      url: '/court/send/batchSendDiploms.jhtml',
      method: 'post',
      data
  });
}


/**
 * 可生成文书模板列表
 * 
 */
export function diplomsTemplateList (params) {
  return service({
      url: '/court/diploms/diplomsTemplateList.jhtml',
      method: 'get',
      params
  });
}

/**
 * 批量开启举证质证
 * 
 */
export function batchEditProcess (params) {
  return service({
      url: '/qtw/info/batchEditProcess.jhtml',
      method: 'get',
      params
  });
}


/**
 * 批量转普
 * 
 */
export function changeOrdinary (data) {
  return service({
      url: '/court/case/changeOrdinary.jhtml',
      method: 'post',
      data
  });
}

/**
 * 批量修改审限
 * 
 */
export function editTrialLimit (data) {
  return service({
      url: '/court/case/editTrialLimit.jhtml',
      method: 'post',
      data
  });
}

/**
 * 批量结案
 * 
 */
export function batchCloseLawCase (data) {
  return service({
      url: '/court/case/batchCloseLawCase.jhtml',
      method: 'post',
      data
  });
}

/**
 * 案件批量导出
 * 
 */
export function exportCloseLawCase (data) {
  return service({
      url: '/court/case/exportCloseLawCase.jhtml',
      method: 'post',
      data
  });
}


/**
 * 庭后送达上传文件后压缩包内容验证
 * 
 */
export function afterCourtUpload (data) {
  return service({
      url: '/court/send/afterCourtUpload.jhtml',
      method: 'post',
      data
  });
}

/**
 * 导出排班的案件列表
 */
export function exportScheduldingLawCase (data) {
  return service({
      url: '/court/schedulding/exportScheduldingLawCase.jhtml',
      method: 'post',
      data
  });
}

/**
 * 导出案件到内网
 */
export function exportLawCase (data) {
  return service({
      url: '/court/case/exportLawCase.jhtml',
      method: 'post',
      data
  });
}

/**
 * 导出案件
 */
export function exportLawCaseInfo (data) {
  return service({
      url: '/court/case/exportLawCaseInfo.jhtml',
      method: 'post',
      data
  });
}


