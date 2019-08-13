import Util from '@/libs/util.js';

const service = Util.ajax;

//电子卷宗临时接口，后期取消
export function ft_getElecArchInfo(params) {
    return service({
      url: '/court/caseFile/caseFileList.jhtml',
      method: 'GET',
      params
    });
}

//电子卷宗的卷宗列表接口
export function fileList(params) {
  return service({
    url: '/court/caseFile/fileList.jhtml',
    method: 'GET',
    params
  });
}

//预览加密后的电子卷宗
export function decDiploms(params) {
  return service({
    url: '/court/caseFile/decDiploms.jhtml',
    method: 'GET',
    params
  });
}