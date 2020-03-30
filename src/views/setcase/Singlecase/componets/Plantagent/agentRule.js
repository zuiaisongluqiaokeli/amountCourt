// 代理人类型
const agType = [
  {'id': '律师', 'name': '律师'},
  {'id': '职员', 'name': '职员'},
  {'id': '公民', 'name': '公民'}
]
//律师执业资格
const lawyerType = [
  {'id': '执业律师', 'name': '执业律师'},
  {'id': '实习律师', 'name': '实习律师'},
]
//律师授权类型
const empowerType = [
  {'id': '一般授权', 'name': '一般授权'},
  {'id': '特殊授权', 'name': '特殊授权'},
]

// 原告委托人数据
const agPlantList = [];

// 原告代理人表单数据
const agentList = {
  agPlantId: '', // 原告代理人ID标识
  agPlant: [], // 原告委托人
  agentMail:'', // 代理人邮箱地址
  agentType: '律师', // 代理人类型
  agentName: '', // 代理人姓名
  agentIdentiCard: '', // 身份证号
  agentMobile: '', // 手机号
  agentAddress: '', // 联系人送达地址

  //律师
  lawyerType:'',//律师执业资格
  empowerType:'',//律师授权类型
  lawerNum: '', // 律师执业证号
  lawFirmLetter: '', // 律师函
  lawerCardUrl: '', // 律师执业证
  lawFirm:'', //律师所（住处）dddd

  //公民、职员
  birthday:'',
  sex:'',
  nation:'',
  agentAddress1:'',

  commission: '', // 律师委托书/公民、职员劳动合同或公积金缴交证明
}

// 代理人表单验规则
const agentRule = {
  agPlant: [
    { type: 'array', required: true, message: '请选择原告委托人', trigger: 'change' }
  ],
  agentType: [
    { required: true, message: '请选择代理人类型', trigger: 'change' }
  ],
  agentMail: [
    { message: '请输入代理人邮箱地址', trigger: 'blur' },
    { type: 'string', pattern: /^[0-9a-z][a-z0-9\._-]{1,}@[a-z0-9-]{1,}[a-z0-9](\.[a-z]{1,})+$/, message: '邮箱格式不正确', trigger: 'blur' }
  ],
  agentName: [
    { required: true, message: '请输入代理人姓名', trigger: 'blur' }
  ],
  agentIdentiCard: [
    { required: true, message: '请输入代理人身份证号', trigger: 'blur' },
    { type: 'string', pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/, message: '身份证不匹配', trigger: 'blur' }
  ],
  lawyerType: [
    { required: true, message: '请选择律师执业资格', trigger: 'blur' }
  ],
  empowerType: [
    { required: true, message: '请选择律师授权类型', trigger: 'blur' }
  ],
  lawerNum: [
    { message: '请输入律师执业证号', trigger: 'blur' }
  ],
  birthday: [
    { message: '请选择出生日期', trigger: 'change' }
  ],
  nation: [
    { required: true, message: '请输入民族', trigger: 'blur' }
  ],
  sex: [
    { required: true, message: '请选择性别', trigger: 'blur' }
  ],
  agentAddress1: [
    { required: true, message: '请输入户籍地址', trigger: 'blur' }
  ],
  agentMobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { type: 'string', pattern: /^[1][0-9][0-9]{9}$/, message: '请输入正确的手机号', trigger: 'change' }
  ],
  agentAddress: [
    { required: true, message: '请输入常住地址', trigger: 'blur' }
  ],
  lawFirm: [
    { message: '请输入律师所或住处名称', trigger: 'blur' }
  ],
  lawFirmLetter: [
    {  message: '请上传律师函扫描件', trigger: 'change' }
  ],
  lawerCardUrl: [
    { message: '请上传律师扫描证件', trigger: 'change' }
  ],
  commission: [
    {  message: '请上传委托书', trigger: 'change' }
  ]
}

const plantAgentRule = {
  agType,
  lawyerType,
  empowerType,
  agentList,
  agentRule,
  agPlantList
}

export default plantAgentRule
