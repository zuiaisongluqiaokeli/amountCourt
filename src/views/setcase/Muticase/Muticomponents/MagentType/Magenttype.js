const mStep1 = {
  //表单文件
  mAgentList:{
    mKeyInfoPath:'', //要素信息文件
  },
  //表单规则
  mAgentRule:{
    mKeyInfoPath: [
      { type: 'string', required: true, message: '请选择要素信息压缩包', trigger: 'change' }
    ],
  },
  //表格绑定数据
  mAgentKeyInfoList:[],
}

export default mStep1;
