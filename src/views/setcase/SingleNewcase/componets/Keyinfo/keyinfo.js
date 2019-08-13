///////////////////////// 信用卡纠纷案件//////////////////////////////
//抵押合同信息(信用卡纠纷)
const pledgeContractInfo={
  pledgeContract: '', //抵押合同名称
  signDate: '', //抵押签订时间
  pledgeOwner: '', //抵押物权属
  pledgeName: '', //抵押物名称
  registerDate: '', //抵押登记时间
  scope: '', //抵押担保范围
}

//保证合同信息(信用卡纠纷)
const ensureContractInfo={
  guarantyContract: '', // 保证合同名称
  signDate: '', // 签订时间
  guarantor: '', // 保证人
  period: '', // 保证期间
  guaranteeType: '', // 保证方式
  scope: '', // 保证范围
}

//分期合同信息(信用卡纠纷)
const installmentContractInfo={
  instalment: '', // 已到期分期金额
  undueInstalment: '', // 未到期分期金额
  installmentContract: '', // 分期合同名称
  signDate: '', // 合同签订时间
  money: '', // 分期透支本金
  term: '', // 分期期限
  advanceRelieveAppointment: '', // 分期手续费费率约定
}

//质押合同信息(信用卡纠纷)
const impawnContractInfo={
  impawnContract: '', // 质押合同名称
  signDate: '', // 质押合同签订时间
  pledgeOwner: '', // 质押物权属
  pledgeName: '', // 质押物名称
  registerDate: '', // 办理质押登记时间
  scope: '', // 质押担保范围
}

//信用卡纠纷信用卡的基础信息
const cridtCardListInfo={
  // creditCardApplyDate: '', // 申请办理信用卡时间
	// creditCardType: '', // 信用卡种类
	creditCardId: '', // 信用卡卡号
	// cardIssuingDate: '', // 核准发卡时间
	compactName: '', // 信用卡合约名称
  // creditQuota: '', // 信用卡额度
  interestAgreement: '', // 利息约定
  // overdraftRate: '', // 透支利率
  creditNewArrearsDate: '', // 信用卡欠款最新截止时间
  // overBalance: '', // 最新透支余额
  creditNewPrincipal: '', // 信用卡最新欠款本金
  creditNewInterest: '', // 信用卡最新欠款利息
  creditNewLateFee: '', // 信用卡最新欠款滞纳金  滞纳金和违约金等同
  // creditNewTotal: '', // 信用卡最新欠款本金、利息、违约金合计
  damagesForBreachOfCredit: '', // 信用卡违约金
  // creditTotal: '', // 信用卡欠款总额
  creditAnnualFees: '', // 信用卡年费
  // creditCardOvercharge: '', // 信用卡超限费
  creditCardProceduresFee: '', // 信用卡分期手续费
  otherItemsCost: '', // 其他费用项目及金额
  // lawyerAppointment:'',//律师费的约定
  // propertyPreservation:'',//财产保全情况
  breakContractAppointment:'',//违约金约定
  debtExpenseAppointment:'',//实现债权费用的约定
  // serviceAgreement:'',//送达约定
  lawyerFees:'',//律师费
  preservationFees:'',//保全费
  announcementFees:'',//公告费
  claimsOtherFees:'',//债权其他费用
  cashWithdrawalFee:'',//信用卡取现手续费
  annualFeeArrange:'',//其他项目费用（年费、取现手续费、分期手续费）的约定
  interestCalulationStandard:'',//最新截止时间后利息计算标准
  damagerCalculationStandard:'',//最新截止时间后违约金（滞纳金）计算标准
  ensureContract:[Object.assign({},ensureContractInfo)],//保证合同列表
  pledgeContract:[Object.assign({},pledgeContractInfo)],//抵押合同列表
  // installmentContract:[Object.assign({},installmentContractInfo)],//分期合同列表
  impawnContract:[Object.assign({},impawnContractInfo)],//质押合同列表
  sw1:false,
  sw2:false,
  sw3:false,
  sw4:false,
}

//信用卡纠纷基础信息
const creditCaseBaseInfo={
  cridtCardList:[Object.assign({},cridtCardListInfo)],//信用卡列表
  coupleCommonDebt:'',//是否支持夫妻债务
  marryTime:'',//结婚登记时间
  divorceDate:'',//离婚登记时间
  endSupervisionFees:'',//终结督促程序申请费
  endSupervisionDate:'',//终结督促程序裁定作出时间
  endSupervisionReason:'',//终结督促程序的原因
  mediateCaseNo:'',//调解书案号
  mediateAgree:'',//调解协议内容
  mediateDate:'',//作出调解书时间
  requestPayReason:'',//请求支付的事实与理由
  requestPayMoney:'',//申请支付金额
  securities:'',//有价证券
  paymentOrderFees:'',//支付令申请费
  applyPayDate:'',//申请支付令时间
  doPayDate:'',//作出支付令时间
}

// 保证保险合同追偿基础信息
const secureList = {
  insuranceName: '', // 保险合同名称
  policyNo: '', // 保险单编号
  insureDate: '', // 投保日期
  policyHolders: '', // 投保人
  insured: '', // 被保险人
  insuranceMoney: '', // 保险金额
  monthPremium: '', // 每月保费
  claimsCondition: '', // 理赔条件
  defaultClause: '', // 违约条款
  defaultMoneyDate: '', // 拖欠贷款日期
  claimsDate: '', // 理赔时间
  claimsMoney: '', // 理赔金额
  defaultPremium: '', // 尚欠费用
  collectionMoney: '', // 催收费用
  loanContractName: '', // 借款合同名称
  loanContractNo: '', // 借款合同编号
  loanContractDate: '', // 借款合同签订时间
  borrower: '', // 借款人
  lender: '', // 出借人
  loanPrincipal: '', // 借款本金
  loanPeriod: '', // 借款期限
  repaymentMethod: '', // 还款方式
  loanIssuanceDate: '', // 借款发放日期
  sendAppointment: '' // 送达约定（通金融借款）
}

///////////////////////// 金融案件//////////////////////////////
// 授信合同（金融）
const creditObj = {
  name: '', // 授信合同名称
  terminateContract: '', // 是否诉请解除该授信合同
  creditPerson: '', // 授信人
  signDate: '', // 授信合同签订时间
  period: '', // 授信期间
  money: '' // 授信金额
}
// 授信合同列表（金融）
const creditList =[Object.assign({},creditObj)]

// 借款合同（金融）
const loanObj = {
  signDate: '', // 签订借款合同时间
  name: '', // 借款合同名称
  borrowPerson:'',//借款人
  terminateContract: '', // 是否诉请解除该合同
  money: '', // 借款本金
  term: '', // 借款期限
  repaymentType: '', // 还款方式
  interestRate: '', // 借款利率
  penaltyInterestRate: '', // 罚息利率
  compoundInterestRate: '', // 复利利率
  penaltyAppointment: '', // 罚息、复利约定
  advanceRelieveAppointment: '', // 解除合同或提前收贷的约定
  breakContractAppointment: '', // 违约金约定
  debtExpenseAppointment: '', // 实现债权费用的约定
  sendAppointment: '' // 送达约定
}
// 借款合同列表（金融）
const loanList =[Object.assign({},loanObj)]

// 保证合同（金融）
const ensureObj = {
  name: '', // 保证合同名称
  guarantor: '', // 保证人
  guaranteeType: '', // 保证方式
  period: '', // 保证期间
  signDate: '', // 保证合同签订时间
  scope: '' // 保证范围
}
// 保证合同列表（金融）
const ensureList =[Object.assign({},ensureObj)]

// 抵押合同（金融）
const pawnObj = {
  signDate: '', // 抵押合同签订时间
  name: '', // 抵押合同名称
  pledgeOwner: '', // 抵押物权属
  pledgeName: '', // 抵押物名称
  scope: '', // 抵押担保范围
  registerDate: '' // 办理抵押登记时间
}
// 抵押合同列表（金融）
const pawnList =[Object.assign({},pawnObj)]

// 质押合同（金融）
const impawnObj = {
  signDate: '', // 质押合同签订时间
  name: '', // 质押合同名称
  pledgeOwner: '', // 质押物权属
  pledgeName: '', // 质押物名称
  scope: '', // 质押担保范围
  registerDate: '' // 办理质押登记时间
}
// 质押合同列表（金融）
const impawnList =[Object.assign({},impawnObj)]

// 金融案件基础信息
const List = {
  lendingTime: '', // 放款日期
  dueTime: '', // 实际到期日期
  overDueRepaymentTime: '', // 逾期还款日期
  debtNewlyEndTime: '', // 欠款最新截止时间
  deptCapital: '', // 欠款本金
  interest: '', // 利息
  penaltyInterest: '', // 罚息
  compoundInterest: '', // 复利
  newlyInterest: '', // 最新欠款利息、罚息、复利
  newArrearsInterest: '', // 最新欠款利息等
  breakContractMoney: '', // 违约金金额
  debtExpense: '', // 实现债权的费用
  lawyerFees: '', // 律师费
  preservationFees: '', // 保全费
  announcementFees: '', // 公告费
  claimsOtherFees: '', // 债权其他费用
  coupleCommonDebt: '', // 是否支持夫妻共同债务
  marryTime: '', // 结婚登记时间
  divorceDate: '', // 离婚登记时间
  applyLaw: '', // 适用的法律条文
  lawsAndRegulations: '', // 法律法规

  preservationCaseNo: '', // 诉前保全裁定案号
  preservationTarget: '', // 保全被申请人
  applyPreservationDate: '', // 申请保全时间
  propertyPreservationMoney: '', // 财产保全金额
  propertyPreservationFees: '', // 财产保全费
  approvalPreservationDate: '', // 作出保全裁定时间
  relievePreservationDate: '', // 解除保全申请时间
  preservationPersonInfo: '', // 保全被申请人信息

  paymentOrderCaseNo: '', // 支付令案号
  paymentOrdertarget: '', // 支付令被申请人
  requestPayReason: '', // 请求支付的事实与理由
  requestPayMoney: '', // 申请支付金额
  securities: '', // 有价证券
  paySecuritiesName: '', // 申请支付金额或有价证券名称
  paymentOrderFees: '', // 支付令申请费
  applyPayDate: '', // 申请支付令时间
  doPayDate: '', // 作出支付令时间
  endSupervisionFees: '', // 终结督促程序申请费
  endSupervisionLaw: '', // 终结督促程序裁定适用法条
  endSupervisionDate: '', // 终结督促程序裁定作出时间
  endSupervisionReason: '', // 终结督促程序的原因
  paymentOrderPersonInfo: '', // 支付令被申请人信息

  mediateCaseNo: '', // 调解书案号
  mediateAgree: '', // 调解协议内容
  mediateDate: '', // 作出调解书时间
  creditCardApplyDate: '', // 申请办理信用卡的时间
  creditCardType: '', // 信用卡种类
  creditCardId: '', // 信用卡卡号
  cardIssuingDate: '', // 核准发卡时间
  creditQuota: '', // 信用额度
  overdraftRate: '', // 透支利率
  creditNewArrearsDate: '', // 信用卡欠款最新截止时间
  creditNewPrincipal: '', // 信用卡最新欠款本金
  creditNewInterest: '', // 信用卡最新欠款利息
  creditNewLateFee: '', // 信用卡最新欠款滞纳金
  creditNewTotal: '', // 信用卡最新欠款本金、利息、违约金合计
  damagesForBreachOfCredit: '', // 信用卡违约金
  creditAnnualFees: '', // 信用卡年费
  creditCardOvercharge: '', // 信用卡超限费
  creditCardProceduresFee: '', // 信用卡分期手续费

  creditContract: creditList,//授信合同列表
  loanContract: loanList,//借款合同列表
  ensureContract: ensureList,//保证合同列表
  mortgageContract:pawnList,//抵押合同列表
  impawnContract:impawnList,//质押合同列表
}

// 基础要素信息表单验规则
const Rule = {
  lawCaseType: [{
    required: true,
    message: '请选择案件类型',
    trigger: 'blur'
  }],
  litigationRequest: [{
    required: true,
    message: '请输入诉讼请求',
    trigger: 'blur'
  }],
  reason: [{
    required: true,
    message: '请输入事实与理由',
    trigger: 'blur'
  }],
  applyStandard: [{
    required: true,
    message: '请输入诉讼标的',
    trigger: 'blur'
  }],
  isUploaDindictment: [
    {type: 'string', message: '请上传起诉状扫描件', trigger: 'change' }
  ]
}

const keyInfoRule = {
  List,
  creditList,
  loanList,
  pawnList,
  ensureList,
  impawnList,
  Rule,
  secureList,
  creditCaseBaseInfo,
  cridtCardListInfo,
  ensureContractInfo,
  pledgeContractInfo,
  installmentContractInfo,
  impawnContractInfo
}

export default keyInfoRule
