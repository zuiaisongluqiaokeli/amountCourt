
// 证据信息数据
// 代理人表单验规则
const ft_confirmRule = {
  radioGroup: [
    { message: '请选择接收人', trigger: 'blur' }
  ],
  servicePhone: [
    { message: '请输入手机号', trigger: 'blur' },
    { type: 'string', pattern: /^[1][0-9][0-9]{9}$/, message: '请输入正确的手机号', trigger: 'change' }
  ],
  serviceAddress: [
    { required: true, message: '请输入送达地址', trigger: 'blur' }
  ],
  serviceEmail: [
    {  message: '请输入邮箱', trigger: 'blur' },
    { type: 'string', pattern: /^[0-9a-z][a-z0-9\._-]{1,}@[a-z0-9-]{1,}[a-z0-9](\.[a-z]{1,})+$/, message: '邮箱格式不正确', trigger: 'blur' }
  ],
}

const testList = [{"litigantType":"自然人","name":"阿涛","plantiffId":"plant_0","identityCard":"110101199003079374","litigantBirthday":"1543363200000","litigantSex":"男","litigantNation":"汉族","litigantPermanentAddress":"福建厦门","address":"龙岩","serviceAddress":"","phone":"13159211103","email":"","businessLicense":"","layers":[{"agPlantId":"agent_0","agPlant":["plant_0"],"agentType":"律师","agentName":"阿发","agentIdentiCard":"110101199003079374","lawerNum":"123","agentMobile":"15512341234","agentAddress":"福建厦门","lawFirmLetter":"无","lawerCardUrl":"无","commission":"无","lawFirm":"无"},{"agPlantId":"agent_1","agPlant":["plant_1"],"agentType":"律师","agentName":"阿凯","agentIdentiCard":"110101199003079374","lawerNum":"123","agentMobile":"18559727897","agentAddress":"福建厦门","lawFirmLetter":"无","lawerCardUrl":"无","commission":"无","lawFirm":"无"}]},{"litigantType":"自然人","name":"壹酱","plantiffId":"plant_1","identityCard":"110101199003079374","litigantBirthday":"1543968000000","litigantSex":"男","litigantNation":"汉族","litigantPermanentAddress":"黑龙江哈尔滨","address":"浙江杭州","serviceAddress":"","phone":"18005920468","email":"","businessLicense":"","layers":[{"agPlantId":"agent_2","agPlant":["plant_1"],"agentType":"律师","agentName":"阿栾","agentIdentiCard":"110101199003079374","lawerNum":"123","agentMobile":"13166666666","agentAddress":"福建厦门","lawFirmLetter":"无","lawerCardUrl":"无","commission":"无","lawFirm":"无"},{"agPlantId":"agent_3","agPlant":["plant_1"],"agentType":"律师","agentName":"阿金","agentIdentiCard":"110101199003079374","lawerNum":"123","agentMobile":"185585858585","agentAddress":"福建厦门","lawFirmLetter":"无","lawerCardUrl":"无","commission":"无","lawFirm":"无"}]}]

const step6Confirm = {
  ft_confirmRule,
  testList,
}

export default step6Confirm
