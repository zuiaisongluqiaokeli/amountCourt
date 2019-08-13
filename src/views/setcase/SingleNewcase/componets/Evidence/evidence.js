
// 证据信息数据
const eviList = {
  evidenceName: '', // 证据名称
  evidenceTarget: '', // 证明对象
  evidenceSource: '', // 证据来源
  pagesNum: '', // 证据页数
  evidenceFile: '', // 证据文件
  fileName:'', //文件名称
}

// 代理人表单验规则
const eviRule = {
  evidenceName: [
    { required: true, message: '请输入证据名称', trigger: 'blur' }
  ],
  evidenceTarget: [
    { required: true, message: '请输入证明对象', trigger: 'blur' }
  ],
  evidenceSource: [
    { required: true, message: '请输入证据来源', trigger: 'blur' }
  ],
  pagesNum: [
    { required: true, message: '请输入证据页数', trigger: 'blur' },
    { type: 'string', pattern: /^\d+$/, message: '证据页数只能是整数页数', trigger: 'blur' }
  ],
  evidenceFile: [
    { required: true, message: '请上传证据文件', trigger: 'change' }
  ]
}

const evidenceRule = {
  eviList,
  eviRule
}

export default evidenceRule
