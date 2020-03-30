// 原告列表
const confirmPlantList = [];
// 原告代理人列表
const agPlantList = [];
// //////////////////////////原告对象//////////////////////////////
// 自然人数据
const natureList = {
  litigantType: '自然人', // 当事人类别
  name: '', // 姓名
  plantiffId: 'plant_0', // 当事人ID
  identityCard: '', // 身份证号
  litigantBirthday: '', // 出生日期
  litigantSex: '', // 性别
  litigantNation: '', // 民族
  litigantPermanentAddress: '', // 户籍地址
  address: '', // 常住地址
  serviceAddress: '', // 文书送达地址
  phone: '', // 手机号
  email: '', // 电子邮箱
  businessLicense: [], // 证明文件
  layers: [],
  addressList:[],//地址列表
  phoneList:[],//电话列表
}

// 法人数据
const legealList = {
  litigantType: '法人', // 当事人类别
  plantiffId: 'plant_0', // 当事人ID
  name: '', // 名称
  identityCard: '', // 社会统一信用代码
  address: '', // 注册地址
  address1:'',//经营地址
  serviceAddress: '', // 文书送达地址
  businessLicense: [], // 单位证明文件
  phone: '', // 单位固定电话
  email: '', // 单位电子邮箱
  legalManName: '', // 法定代表人
  legalDuty:'',// 法定代表人职务
  legalManPhone: '', // 法定代表人手机号
  legalManId: '', // 法定代表人身份证号码
  legalIdentity: [], // 法定代表人身份证明文件
  layers: [],
  addressList:[],//地址列表
  phoneList:[],//电话列表
}

// 非法人表单数据
const notlegealList = {
  litigantType: '非法人组织', // 当事人类别
  plantiffId: 'plant_0', // 当事人ID
  name: '', // 名称
  identityCard: '', // 社会统一信用代码
  address: '', // 注册地址
  serviceAddress: '', // 文书送达地址
  businessLicense: [], // 单位证明文件
  phone: '', // 单位固定电话
  email: '', // 单位电子邮箱
  legalManName: '', // 法定代表人
  legalDuty:'',// 法定代表人职务
  legalManPhone: '', // 法定代表人手机号
  legalManId: '', // 法定代表人身份证号码
  legalIdentity: [], // 法定代表人身份证明文件
  layers: [],
  addressList:[], //地址列表
  phoneList:[], //电话列表
}

///////////////////////////原告代理人对象//////////////////////////
// 原告代理人数据
// 律师数据
const lawyerList = {
  agentType: '律师', // 代理人类型
  agPlantId: 'agent_0', // 原告代理人ID标识
  agPlant: [], // 原告委托人
  agentMail:'', // 代理人邮箱地址
  agentName: '', // 代理人姓名
  agentIdentiCard: '', // 身份证号
  empowerType:'一般授权',//授权类型
  lawyerType:'执业律师',//律师执业资格
  lawerNum: '', // 律师执业证号
  agentMobile: '', // 手机号
  agentAddress: '', // 联系人地址
  lawFirmLetter: [], // 律所函
  lawerCardUrl: [], // 律师执业证
  commission: [], // 委托书
  lawFirm:'', //律师所（住处）
  addressList:[],//地址列表
  phoneList:[],//电话列表
}

// 职工数据
const workerList = {
  agentType: '职工', // 代理人类型
  agPlantId: 'agent_0', // 原告代理人ID标识
  agentName: '', // 代理人姓名
  agentIdentiCard: '', // 身份证号
  birthday:'',//出生日期
  nation:'',//民族
  sex:'',//性别
  agentAddress: '', //户籍地址
  agentAddress1:'',//经常居住地址
  agentMobile:'',//手机号
  agentMail:'', // 代理人邮箱地址
  addressList:[],//地址列表
  phoneList:[],//电话列表
}

//公民数据
const citizenList = {
  agentType: '公民', // 代理人类型
  agPlantId: 'agent_0', // 原告代理人ID标识
  agentName: '', // 代理人姓名
  agentIdentiCard: '', // 身份证号
  birthday:'',//出生日期
  nation:'',//民族
  sex:'',//性别
  agentAddress: '', //户籍地址
  agentAddress1:'',//经常居住地址
  agentMobile:'',//手机号
  agentMail:'', // 代理人邮箱地址
  litigatRelation:'',//与委托人关系
  addressList:[],//地址列表
  phoneList:[],//电话列表
}


// 自然人表单验规则
const naRule = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  identityCard: [
    { required: true, message: '请输入身份证号', trigger: 'blur' },
    { type: "string", pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/, message: '身份证不匹配', trigger: 'blur' }
  ],
  litigantBirthday: [
    { message: '请选择出生日期', trigger: 'change' }
  ],
  litigantSex: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  litigantNation: [
    { required: true, message: '请输入民族', trigger: 'blur' }
  ],
  litigantPermanentAddress: [
    { required: true, message: '请输入户籍地址', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入电话号码', trigger: 'blur' },
    { type: 'string', pattern: /^[1][0-9][0-9]{9}$/, message: '请输入正确的手机号', trigger: 'change' }
  ],
  address: [
    { message: '请输入常住地址', trigger: 'blur' }
  ],
  serviceAddress: [
    { required: true, message: '请输入文书送达地址', trigger: 'blur' }
  ],
  businessLicenseUp: [
    { type: 'string', message: '请上传个人身份证明文件', trigger: 'change' }
  ],
  legalIdentity: [
    { type: 'string', required: true, message: '请上传个人居民身份证的扫描件或者复印件(正反面在同一个页面上)', trigger: 'change' }
  ],
  email: [
    { type: 'string', pattern: /^[0-9a-z][a-z0-9\._-]{1,}@[a-z0-9-]{1,}[a-z0-9](\.[a-z]{1,})+$/, message: '邮箱格式不正确', trigger: 'blur' }
  ]
}

//法人表单规则
const legalRule = {
  name: [
    { required: true, message: '请输入营业执照注册的主题名称(不区分中英文括号)', trigger: 'blur' }
  ],
  identityCard: [
    { required: true, message: '请确认统一社会信用代码准确无误', trigger: 'blur' }
  ],
  address: [
    { required: true, message: '请输入注册地址', trigger: 'blur' }
  ],
  address1: [
    { message: '请输入经营地址', trigger: 'blur' }
  ],
  serviceAddress: [
    { required: true, message: '请输入文书送达地址', trigger: 'blur' }
  ],
  businessLicenseUp1: [
    { type: 'string', message: '请上传单位证明文件', trigger: 'change' }
  ],
  phone: [
    { message: '请输入单位固定电话', trigger: 'blur' }
  ],
  email: [
    { message: '请输入单位电子邮箱', trigger: 'blur' },
    { type: 'string', pattern: /^[0-9a-z][a-z0-9\._-]{1,}@[a-z0-9-]{1,}[a-z0-9](\.[a-z]{1,})+$/, message: '邮箱格式不正确', trigger: 'blur' }
  ],
  legalManName: [
    { required: true, message: '请输入法定代表人', trigger: 'blur' }
  ],
  legalDuty: [
    { type: 'string', message: '请输入法定代表人职务', trigger: 'blur' }
  ],
  legalManPhone: [
    { type: 'string', pattern: /^[1][0-9][0-9]{9}$/, message: '请输入正确的手机号', trigger: 'change' }
  ],
  legalManId: [
    { type: 'string', pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/, message: '身份证格式不正确', trigger: 'blur' }
  ],
  businessLicenseUp2: [
    { type: 'string', message: '请上传身份证明文件扫描件，证明文件需加盖单位公章', trigger: 'change' }
  ]
}

//非法人表单规则
const nolegalRule = {
  name: [
    { required: true, message: '请输入营业执照注册的主题名称(不区分中英文括号)', trigger: 'blur' }
  ],
  identityCard: [
    { required: true, message: '请确认统一社会信用代码准确无误', trigger: 'blur' }
  ],
  address: [
    { required: true, message: '请输入注册地址', trigger: 'blur' }
  ],
  address1: [
    { message: '请输入经营地址', trigger: 'blur' }
  ],
  serviceAddress: [
    { required: true, message: '请输入文书送达地址', trigger: 'blur' }
  ],
  businessLicenseUp1: [
    { type: 'string', message: '请上传单位证明文件', trigger: 'change' }
  ],
  phone: [
    { message: '请输入单位固定电话', trigger: 'blur' }
  ],
  email: [
    { message: '请输入单位电子邮箱', trigger: 'blur' },
    { type: 'string', pattern: /^[0-9a-z][a-z0-9\._-]{1,}@[a-z0-9-]{1,}[a-z0-9](\.[a-z]{1,})+$/, message: '邮箱格式不正确', trigger: 'blur' }
  ],
  legalManName: [
    { required: true, message: '请输入负责人', trigger: 'blur' }
  ],
  legalDuty: [
    { type: 'string', message: '请输入负责人职务', trigger: 'blur' }
  ],
  legalManPhone: [
    { type: 'string', pattern: /^[1][0-9][0-9]{9}$/, message: '请输入正确的手机号', trigger: 'change' }
  ],
  legalManId: [
    { type: 'string', pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/, message: '身份证格式不正确', trigger: 'blur' }
  ],
  businessLicenseUp2: [
    { type: 'string', message: '请上传身份证明文件扫描件，证明文件需加盖单位公章', trigger: 'change' }
  ]
}

// 律师表单验规则
const lawyerRule = {
  agentName: [
    { required: true, message: '请输入代理人姓名', trigger: 'blur' }
  ],
  agentIdentiCard: [
    { required: true, message: '请输入代理人身份证号', trigger: 'blur' },
    { type: 'string', pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/, message: '身份证不匹配', trigger: 'blur' }
  ],
  lawyerType:[
    { required: true, message: '请选择律师执业资格', trigger: 'blur' },
  ],
  empowerType:[
    { required: true, message: '请选择律授权类型', trigger: 'blur' },
  ],
  lawerNum: [
    { message: '请输入律师执业证号', trigger: 'blur' }
  ],
  agentMobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { type: 'string', pattern: /^[1][0-9][0-9]{9}$/, message: '请输入正确的手机号', trigger: 'change' }
  ],
  agentAddress: [
    { required: true, message: '请输入联系人地址', trigger: 'blur' }
  ],
  lawFirm: [
    { message: '请输入律师所或住处名称', trigger: 'blur' }
  ],
  businessLicenseUp1: [
    { message: '请上传律师函扫描件', trigger: 'change' }
  ],
  businessLicenseUp2: [
    { message: '请上传律师扫描证件', trigger: 'change' }
  ],
  businessLicenseUp3: [
    { type: 'string', message: '请上传委托书', trigger: 'change' }
  ],
  agentMail: [
    { message: '请输入代理人邮箱地址', trigger: 'blur' },
    { type: 'string', pattern: /^[0-9a-z][a-z0-9\._-]{1,}@[a-z0-9-]{1,}[a-z0-9](\.[a-z]{1,})+$/, message: '邮箱格式不正确', trigger: 'blur' }
  ],
}

// 职工表单验规则
const workerRule = {
  agentName: [
    { required: true, message: '请输入代理人姓名', trigger: 'blur' }
  ],
  agentIdentiCard: [
    { required: true, message: '请输入代理人身份证号', trigger: 'blur' },
    { type: 'string', pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/, message: '身份证不匹配', trigger: 'blur' }
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
  agentAddress: [
    { required: true, message: '请输入户籍地址', trigger: 'blur' }
  ],
  agentAddress1: [
    { required: true, message: '请输入送达地址', trigger: 'blur' }
  ],
  agentMobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { type: 'string', pattern: /^[1][0-9][0-9]{9}$/, message: '请输入正确的手机号', trigger: 'change' }
  ],
  agentMail: [
    { message: '请输入代理人邮箱地址', trigger: 'blur' },
    { type: 'string', pattern: /^[0-9a-z][a-z0-9\._-]{1,}@[a-z0-9-]{1,}[a-z0-9](\.[a-z]{1,})+$/, message: '邮箱格式不正确', trigger: 'blur' }
  ]
}

// 公民表单验规则
const citizenRule = {
  agentName: [
    { required: true, message: '请输入代理人姓名', trigger: 'blur' }
  ],
  agentIdentiCard: [
    { required: true, message: '请输入代理人身份证号', trigger: 'blur' },
    { type: 'string', pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/, message: '身份证不匹配', trigger: 'blur' }
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
  agentAddress: [
    { required: true, message: '请输入户籍地址', trigger: 'blur' }
  ],
  agentAddress1: [
    { required: true, message: '请输入经常居住地址', trigger: 'blur' }
  ],
  agentMobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { type: 'string', pattern: /^[1][0-9][0-9]{9}$/, message: '请输入正确的手机号', trigger: 'change' }
  ],
  agentMail: [
    { message: '请输入代理人邮箱地址', trigger: 'blur' },
    { type: 'string', pattern: /^[0-9a-z][a-z0-9\._-]{1,}@[a-z0-9-]{1,}[a-z0-9](\.[a-z]{1,})+$/, message: '邮箱格式不正确', trigger: 'blur' }
  ],
  litigatRelation: [
    { message: '请输入与委托人关系', trigger: 'blur' }
  ]
}

const plantVialte = {
  confirmPlantList,
  agPlantList,
  naRule,
  natureList,
  legalRule,
  legealList,
  nolegalRule,
  notlegealList,
  lawyerList,
  lawyerRule,
  workerList,
  workerRule,
  citizenList,
  citizenRule
}
export default plantVialte