import Util from '@/libs/util.js';

const service = Util.ajax;

/**
 *
 * @param {案件编号} caseNo
 * @param {案件所处阶段} process  1立案建档 2 排班 3 文书送达 4举证阶段  5质证阶段  6开庭阶段 7案件结案
 * @param {案由} briefName
 * @param {立案时间开始} fillingDateStart
 * @param {立案时间截止} fillingDateEnd
 * @param {每页条数} pageSize
 * @param {页码} pageNumber
 */
export function getDiplomsLawCaseList (params) {
  return service({
    url: '/dp/getDiplomsLawCaseList.jhtml',
    method: 'GET',
    params
  });
}

/**
 *
 *
 * @export
 * @param {要预览的目录} directory 结构：caseId,dirTypeParentId,fileId
 * @param {每页条数} pageSize
 * @param {文件名称} fileName
 * @param {页码} pageNumber
 * @returns
 */
export function getDiplomsFileList (params) {
  return service({
    url: '/dp/getDiplomsFileList.jhtml',
    method: 'GET',
    params
  });
}

export function downloadDiplomsList (data) {
  return service({
    url: '/dp/downloadDiplomsList.jhtml',
    method: 'POST',
    data
  });
}

export function decDiploms (params) {
  return service({
    url: '/dp/decDiploms.jhtml',
    method: 'POST',
    params
  })
}
