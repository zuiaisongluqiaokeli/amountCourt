const mProveStep = {
  //表单文件
  mProveList: {
    mKeyInfoPath: '', //要素信息文件
    name: '', //证据名称
    object: '', //证明对象
    source: '', //证据来源
    number: '', //证据数量
    pageNumber:'',// 证据页数
  },
  //表单规则
  mProveRule: {
    mKeyInfoPath: [{
      type: 'string',
      message: '请选择要素信息压缩包',
      trigger: 'change'
    }],
  },
  //获取到的要素列表
  mEvidenceKeyInfoList: [],
}

export default mProveStep;
