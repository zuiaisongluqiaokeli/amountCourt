// 当事人类型
const manType = [{'t1': '1', 'name': '自然人'}, {'t1': '2', 'name': '法人'}, {'t1': '3', 'name': '非法人组织'}];
// 第三人类型
const thirdManType = [{'t1': '1', 'name': '自然人'}, {'t1': '2', 'name': '法人'}, {'t1': '3', 'name': '非法人组织'}];
//角色类型
const roleList=['贷款人','借款人','配偶','保证人','抵押人','质押人','第三方平台','投保人']


// 自然人表单数据
const accusedNatureList = {
  litigantType: '', // 当事人类别
  name: '', // 姓名
  defendantStates:[],//角色
  identityCard: '', // 身份证号
  litigantBirthday: '', // 出生日期
  litigantSex: '男', // 性别
  litigantNation: '', // 民族
  litigantPermanentAddress: '', // 户籍地址
  address: '', // 常住地址
  serviceAddress: '', // 文书送达地址
  phone: '', // 手机号
  email: '', // 电子邮箱
}

// 法人表单数据
const accusedLegealList = {
  litigantType: '', // 当事人类别
  name: '', // 名称
  defendantStates:[],//角色
  identityCard: '', // 社会统一信用代码
  address: '', // 注册地址
  businessLicense: '', // 单位证明文件
  phone: '', // 单位固定电话
  email: '', // 单位电子邮箱
  legalManName: '', // 法定代表人
  legalDuty:'',//法定代表职务
  legalManPhone: '', // 法定代表人手机号
  legalManId: '', // 法定代表人身份证号码
  legalIdentity: '', // 法定代表人身份证明文件
}

// 非法人表单数据
const accused_notLegealList = {
  litigantType: '', // 当事人类别
  name: '', // 名称
  defendantStates:[],//角色
  identityCard: '', // 社会统一信用代码
  address: '', // 注册地址
  businessLicense: '', // 单位证明文件
  phone: '', // 单位固定电话
  email: '', // 单位电子邮箱
  legalManName: '', // 法定代表人
  legalDuty:'',//法定代表职务
  legalManPhone: '', // 法定代表人手机号
  legalManId: '', // 法定代表人身份证号码
  legalIdentity: '', // 法定代表人身份证明文件
}

const accused_obj={

  plantiffId:"plant_0", //自定义id
  accusedPlantNowIndex:0,  //类型数组下表
  litigantType:"自然人",  //类型
  defendantStates:[],//角色

  //自然人
  name:"",  //名字
  identityCard:"",  //身份证号码&社会统一信用代码
  litigantBirthday:"",  //出生日期
  litigantSex:"", //性别
  litigantNation:"",  //民族
  litigantPermanentAddress:"",  //户籍地址
  address:"", //常住地址 & 注册地址
  serviceAddress:"",  //文书送达地址
  phone:"", //手机号 & 单位固定电话
  email:"", //电子邮箱 & 单位电子邮箱
  businessLicense:"", //个人身份证明文件地址 & 单位证明文件地址

  //法人&非法人组织
  legalManName:"",  //姓名
  legalManPhone:"", //手机号
  legalManId:"",  //身份证号码
  legalIdentity:"", //法人身份证明文件地址 & 负责人身份证明文件地址

  accused_fileName1:"",//个人身份证明文件名称

  accused_fileName2:"",//法人单位证明文件名称
  accused_fileName3:"",//非法人单位证明文件名称

  accused_fileName4:"",//法人身份证明文件名称
  accused_fileName5:"",//负责人身份证明文件名称
}

// 自然人表单验规则
const accusedNatureRule = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  defendantStates: [
    {type: "array", required: true, message: '请选择角色', trigger: 'blur' }
  ],
  identityCard: [
    { required: true, message: '请输入身份证号', trigger: 'blur' },
    { type: "string", pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/, message: '身份证不匹配', trigger: 'blur' }
  ],
  litigantBirthday: [
    { type: "string", message: '请输入出生日期', trigger: 'change' }
  ],
  litigantSex: [
    { required: true, message: '请输入性别', trigger: 'blur' }
  ],
  litigantNation: [
    { required: true, message: '请输入民族', trigger: 'blur' }
  ],
  litigantPermanentAddress: [
    { required: true, message: '请输入户籍地址', trigger: 'blur' }
  ],
  address: [
    { message: '请输入常住地址', trigger: 'blur' }
  ],
  serviceAddress: [
    { required: true, message: '请输入文书送达地址', trigger: 'blur' }
  ],
  phone: [
    { message: '请输入电话号码', trigger: 'blur' },
    { type: 'string', pattern: /^[1][0-9][0-9]{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  businessLicense: [
    { message: '请上传个人身份证明文件', trigger: 'change' }
  ],
  legalIdentity: [
    { message: '请上传个人居民身份证的扫描件或者复印件(正反面在同一个页面上)', trigger: 'change' }
  ],
  email: [
    { type: 'string', pattern: /^[0-9a-z][a-z0-9\._-]{1,}@[a-z0-9-]{1,}[a-z0-9](\.[a-z]{1,})+$/, message: '邮箱格式不正确', trigger: 'blur' }
  ],
}

// 法人表单验规则
const accusedLegalRule = {
  name: [
    { required: true, message: '请输入营业执照注册的主体名称(不区分中英文括号)', trigger: 'blur' }
  ],
  defendantStates: [
    {type: "array", required: true, message: '请选择角色', trigger: 'blur' }
  ],
  identityCard: [
    { required: true, message: '请确认统一社会信用代码准确无误', trigger: 'blur' }
  ],
  address: [
    { required: true, message: '请输入注册地址', trigger: 'blur' }
  ],
  businessLicense: [
    { message: '请上传单位证明文件', trigger: 'change' }
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
  legalIdentity: [
    { message: '请上传法定代表人的身份证明文件扫描件，证明文件需加盖单位公章', trigger: 'blur' }
  ]
}

//非法人表单验规则
const accusedNotLegalRule = {
  name: [
    { required: true, message: '请输入营业执照注册的主题名称(不区分中英文括号)', trigger: 'blur' }
  ],
  defendantStates: [
    {type: "array", required: true, message: '请选择角色', trigger: 'blur' }
  ],
  identityCard: [
    { message: '请确认统一社会信用代码准确无误', trigger: 'blur' }
  ],
  address: [
    { required: true, message: '请输入注册地址', trigger: 'blur' }
  ],
  businessLicense: [
    { message: '请上传单位证明文件', trigger: 'change' }
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
    { type: 'string', message: '请输入负责人职务', trigger: 'blur' }
  ],
  legalManPhone: [
    { type: 'string', pattern: /^[1][0-9][0-9]{9}$/, message: '请输入正确的手机号', trigger: 'change' }
  ],
  legalManId: [
    { type: 'string', pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/, message: '身份证格式不正确', trigger: 'blur' }
  ],
  legalIdentity: [
    { message: '请上传负责人的身份证明文件扫描件，证明文件需加盖单位公章', trigger: 'blur' }
  ]
}

const plantVialte = {
  manType,
  roleList,
  thirdManType,
  accusedNatureRule,
  accusedLegalRule,
  accusedNotLegalRule,
  accusedNatureList,
  accusedLegealList,
  accused_notLegealList,
  accused_obj
}
export default plantVialte
