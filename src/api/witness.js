import Util from '@/libs/util.js';

const service = Util.ajax;

/**
 * @description 举质证第一步，起诉状与答辩状
 */
export function ft_GetCaseInfoStep1 (params) {
  return service ({
    url: '/court/case/indictment.jhtml',
    method:'get',
    params
  })
}

/**
 * @description 显示举质证状态
 */
export function ft_getCaseInfoStep2 (params) {
  return service({
    url: '/qtw/info/getLawCaseInfo.jhtml',
    method:'post',
    params
  })
}

/**
 * @description 修改举质证状态
 */
export function ft_setCaseInfoStep2 (params) {
  return service({
    url: '/qtw/info/editLawCaseType.jhtml',
    method:'post',
    params
  })
}
