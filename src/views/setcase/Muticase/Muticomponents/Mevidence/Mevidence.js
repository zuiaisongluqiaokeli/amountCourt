const mStep2 = {
  //证据表单
  mEvidenceList: {
    mKeyInfoPath: '', //要素信息文件
    name: '', //证据名称
    object: '', //证明对象
    source: '', //证据来源
    // number: '', //证据数量
    pageNumber:'',// 证据页数
  },
  //诉前表单
  mEvidenceList: {
    mKeyInfoPath: '', //要素信息文件
    name: '', //证据名称
    object: '', //证明对象
    source: '', //证据来源
    // number: '', //证据数量
    pageNumber:'',// 证据页数
  },
  //表单规则
  mEvidenceRule: {
    mKeyInfoPath: [{
      type: 'string',
      message: '请选择要素信息压缩包',
      trigger: 'blur'
    }],
    name: [{
      type: 'string',
      required: true,
      message: '请输入证据名称',
      trigger: 'blur'
    }],
    object: [{
      type: 'string',
      required: true,
      message: '请输入证明对象',
      trigger: 'blur'
    }],
    source: [{
      type: 'string',
      required: true,
      message: '请输入证据来源',
      trigger: 'blur'
    }],
    number: [{
      type: 'string',
      required: true,
      message: '请输入证据页数',
      trigger: 'blur'
    }],
    pageNumber: [{
      type: 'string',
      required: true,
      message: '请输入证据页数',
      trigger: 'blur'
    }],
  },
  //获取到的要素列表
  mEvidenceKeyInfoList: [],
}

export default mStep2;
