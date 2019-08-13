<template>
  <div>
    <Form
      :model="creditCaseBaseInfo"
      label-position="right"
      :label-width="230"
      ref="creditcardFromRule"
      style="margin:0 auto;width:821px"
    >
      <!-- 信用卡列表表单 -->
      <FormItem label="信用卡列表" class="ft_form ft-plant-chooseType">
      </FormItem>
      <Collapse simple v-model="openPandel">
        <Panel v-for="(item, key) in creditCaseBaseInfo.cridtCardList" :key="'info'+key" :name="'info'+key">
          <span>信用卡（{{item.creditCardId ? item.creditCardId :'暂无卡号'}}）</span>
          <div slot="content" class="ft-plant-div2">
            <Form :model="item" label-position="right" :label-width="190" :ref="'info' + key" style="margin:0 auto">
              <Tooltip content="删除当前信用卡" @click.native="delcridtCardList(item)" class="myTooltip" placement="bottom">
                <Icon type="ios-close"  class="myCloseIco"/>
              </Tooltip>
              <!-- 信用卡基本信息 -->
              <!-- <FormItem label="申请办理信用卡时间" class="ft_form ft-plant-chooseType" prop="creditCardApplyDate">
                <DatePicker
                  type="date"
                  :editable="false"
                  placeholder="请选择申请办理信用卡时间"
                  :clearable="false"
                  format="yyyy年MM月dd日"
                  style="width: 300px"
                  :value="item.creditCardApplyDate"
                  @on-change="ft_keyinfo_chgTime(item,'creditCardApplyDate',$event)"
                ></DatePicker>
              </FormItem>
              <FormItem label="信用卡种类" class="ft_form ft-plant-chooseType" prop="creditCardType">
                <Input v-model="item.creditCardType" placeholder="请输入信用卡种类"></Input>
              </FormItem> -->
              <FormItem label="信用卡卡号" class="ft_form ft-plant-chooseType" prop="creditCardId">
                <Input v-model="item.creditCardId" placeholder="请输入信用卡卡号"></Input>
              </FormItem>
              <!-- <FormItem label="核准发卡时间" class="ft_form ft-plant-chooseType" prop="cardIssuingDate">
                <DatePicker
                  type="date"
                  :editable="false"
                  placeholder="请选择核准发卡时间"
                  :clearable="false"
                  format="yyyy年MM月dd日"
                  style="width: 300px"
                  :value="item.cardIssuingDate"
                  @on-change="ft_keyinfo_chgTime(item,'cardIssuingDate',$event)"
                ></DatePicker>
              </FormItem> -->
              <FormItem label="信用卡合约名称" class="ft_form ft-plant-chooseType" prop="compactName">
                <Input v-model="item.compactName" placeholder="请输入信用卡合约名称"></Input>
              </FormItem>
              <!-- <FormItem label="信用卡额度（元）" class="ft_form ft-plant-chooseType" prop="creditQuota">
                <Input v-model="item.creditQuota" @on-blur="onNumberChange($event,item,'creditQuota')" placeholder="请输入信用卡额度"></Input>
              </FormItem> -->
              <FormItem label="利息约定" class="ft_form ft-plant-chooseType" prop="interestAgreement">
                <Input v-model="item.interestAgreement" placeholder="请输入利息约定" type="textarea"></Input>
              </FormItem>
              <!-- <FormItem label="透支利率" class="ft_form ft-plant-chooseType" prop="overdraftRate">
                <Input v-model="item.overdraftRate" placeholder="请输入透支利率"></Input>
              </FormItem> -->
              <FormItem label="信用卡欠款最新截止时间" class="ft_form ft-plant-chooseType" prop="creditNewArrearsDate">
                <DatePicker
                  type="date"
                  :editable="false"
                  placeholder="请选择信用卡欠款最新截止时间"
                  :clearable="false"
                  format="yyyy年MM月dd日"
                  style="width: 300px"
                  :value="item.creditNewArrearsDate"
                  @on-change="ft_keyinfo_chgTime(item,'creditNewArrearsDate',$event)"
                ></DatePicker>
              </FormItem>
              <!-- <FormItem label="最新透支余额（元）" class="ft_form ft-plant-chooseType" prop="overBalance">
                <Input v-model="item.overBalance" @on-blur="onNumberChange($event,item,'overBalance')" placeholder="请输入最新透支余额"></Input>
              </FormItem> -->
              <FormItem label="信用卡最新欠款本金（元）" class="ft_form ft-plant-chooseType" prop="creditNewPrincipal">
                <Input v-model="item.creditNewPrincipal" @on-blur="onNumberChange($event,item,'creditNewPrincipal')" placeholder="请输入信用卡最新欠款本金"></Input>
              </FormItem>
              <FormItem label="信用卡最新欠款利息（元）" class="ft_form ft-plant-chooseType" prop="creditNewInterest">
                <Input v-model="item.creditNewInterest" @on-blur="onNumberChange($event,item,'creditNewInterest')" placeholder="请输入信用卡最新欠款利息"></Input>
              </FormItem>
              <FormItem label="信用卡最新欠款滞纳金（违约金）（元）" class="ft_form ft-plant-chooseType" prop="creditNewLateFee">
                <Input v-model="item.creditNewLateFee" @on-blur="onNumberChange($event,item,'creditNewLateFee')" placeholder="请输入信用卡最新欠款滞纳金（违约金）" @on-change="creditNewLateFeeChange(item)"></Input>
              </FormItem>
              <!-- <FormItem label="信用卡最新欠款本金、利息、违约金合计（元）" class="ft_form ft-plant-chooseType" prop="creditNewTotal">
                <Input v-model="item.creditNewTotal" @on-blur="onNumberChange($event,item,'creditNewTotal')" placeholder="请输入信用卡最新欠款本金、利息、违约金合计"></Input>
              </FormItem> -->
              <!-- <FormItem label="信用卡欠款总额（元）" class="ft_form ft-plant-chooseType" prop="creditTotal">
                <Input v-model="item.creditTotal" @on-blur="onNumberChange($event,item,'creditTotal')" placeholder="请输入信用卡欠款总额"></Input>
              </FormItem> -->
              <FormItem label="信用卡年费（元）" class="ft_form ft-plant-chooseType" prop="creditAnnualFees">
                <Input v-model="item.creditAnnualFees" @on-blur="onNumberChange($event,item,'creditAnnualFees')" placeholder="请输入信用卡年费"></Input>
              </FormItem>
              <!-- <FormItem label="信用卡超限费（元）" class="ft_form ft-plant-chooseType" prop="creditCardOvercharge">
                <Input v-model="item.creditCardOvercharge" @on-blur="onNumberChange($event,item,'creditCardOvercharge')" placeholder="请输入信用卡超限费"></Input>
              </FormItem> -->
              <FormItem label="信用卡分期手续费（元）" class="ft_form ft-plant-chooseType" prop="creditCardProceduresFee">
                <Input v-model="item.creditCardProceduresFee" @on-blur="onNumberChange($event,item,'creditCardProceduresFee')" placeholder="请输入信用卡分期手续费"></Input>
              </FormItem>
              <FormItem label="其他费用项目及金额（元）" class="ft_form ft-plant-chooseType" prop="otherItemsCost">
                <Input v-model="item.otherItemsCost" @on-blur="onNumberChange($event,item,'otherItemsCost')" placeholder="请输入其他费用项目及金额"></Input>
              </FormItem>
              <!-- <FormItem label="律师费的约定" class="ft_form ft-plant-chooseType" prop="lawyerAppointment">
                <Input v-model="item.lawyerAppointment" placeholder="请输入律师费的约定"  type="textarea"></Input>
              </FormItem> -->
              <FormItem label="违约金约定" class="ft_form ft-plant-chooseType" prop="breakContractAppointment">
                <Input v-model="item.breakContractAppointment" placeholder="请输入违约金约定" type="textarea"></Input>
              </FormItem>
              <FormItem label="实现债权费用的约定" class="ft_form ft-plant-chooseType" prop="debtExpenseAppointment">
                <Input v-model="item.debtExpenseAppointment" placeholder="请输入实现债权费用的约定" type="textarea"></Input>
              </FormItem>
              <!-- <FormItem label="送达约定" class="ft_form ft-plant-chooseType" prop="serviceAgreement">
                <Input v-model="item.serviceAgreement" placeholder="请输入送达约定" type="textarea"></Input>
              </FormItem> -->
              <FormItem label="律师费（元）" class="ft_form ft-plant-chooseType" prop="lawyerFees">
                <Input v-model="item.lawyerFees" @on-blur="onNumberChange($event,item,'lawyerFees')" placeholder="请输入律师费"></Input>
              </FormItem>
              <FormItem label="保全费（元）" class="ft_form ft-plant-chooseType" prop="preservationFees">
                <Input v-model="item.preservationFees" @on-blur="onNumberChange($event,item,'preservationFees')" placeholder="请输入保全费"></Input>
              </FormItem>
              <FormItem label="公告费（元）" class="ft_form ft-plant-chooseType" prop="announcementFees">
                <Input v-model="item.announcementFees" @on-blur="onNumberChange($event,item,'announcementFees')" placeholder="请输入公告费"></Input>
              </FormItem>
              <!-- <FormItem label="债权其他费用（元）" class="ft_form ft-plant-chooseType" prop="claimsOtherFees">
                <Input v-model="item.claimsOtherFees" @on-blur="onNumberChange($event,item,'claimsOtherFees')" placeholder="请输入债权其他费用"></Input>
              </FormItem> -->
              <!-- <FormItem label="财产保全情况" class="ft_form ft-plant-chooseType" prop="propertyPreservation">
                <Input v-model="item.propertyPreservation" placeholder="请输入财产保全情况" type="textarea"></Input>
              </FormItem> -->
              <FormItem label="信用卡取现手续费（元）" class="ft_form ft-plant-chooseType" prop="cashWithdrawalFee">
                <Input v-model="item.cashWithdrawalFee" @on-blur="onNumberChange($event,item,'cashWithdrawalFee')" placeholder="请输入信用卡取现手续费"></Input>
              </FormItem>
              <FormItem label="其他项目费用（年费、取现手续费、分期手续费）的约定" class="ft_form ft-plant-chooseType" prop="annualFeeArrange">
                <Input v-model="item.annualFeeArrange" placeholder="请输入其他项目费用（年费、取现手续费、分期手续费）的约定"  type="textarea"></Input>
              </FormItem>
              <FormItem label="最新截止时间后利息计算标准" class="ft_form ft-plant-chooseType" prop="interestCalulationStandard">
                <Input v-model="item.interestCalulationStandard" placeholder="请输入最新截止时间后利息计算标准" type="textarea"></Input>
              </FormItem>
              <FormItem label="最新截止时间后违约金（滞纳金）计算标准" class="ft_form ft-plant-chooseType" prop="damagerCalculationStandard">
                <Input v-model="item.damagerCalculationStandard" placeholder="请输入最新截止时间后违约金（滞纳金）计算标准" type="textarea"></Input>
              </FormItem>
              <!-- 分期合同 -->
              <!-- <FormItem label="分期合同" class="ft_form ft-plant-chooseType ft-keyinfo-contract">
                <i-switch v-model="item.sw1"></i-switch>
              </FormItem>
              <div v-if="item.sw1==true">
                <Collapse simple v-model="openPandel1">
                  <Panel  v-for="(item1, key1) in item.installmentContract" :key="'info1'+key1" :name="'info1'+key1">
                    分期合同（{{item1.installmentContract ? item1.installmentContract :'暂无名称'}}）
                    <div slot="content" class="ft-plant-div2">
                      <Form :model="item1" label-position="right" :label-width="190" :ref="'info1' + key1" style="margin:0 auto">
                        <Tooltip content="删除当前分期合同" @click.native="delcontract('installmentContract','openPandel1',item,item1)" class="myTooltip" placement="bottom">
                          <Icon type="ios-close"  class="myCloseIco"/>
                        </Tooltip>
                        <FormItem label="分期合同名称" class="ft_form ft-plant-chooseType" prop="installmentContract">
                          <Input v-model="item1.installmentContract" placeholder="请输入分期合同名称"></Input>
                        </FormItem>
                        <FormItem label="已到期分期金额（元）" class="ft_form ft-plant-chooseType" prop="instalment">
                          <Input v-model="item1.instalment" @on-blur="onNumberChange($event,item1,'instalment')" placeholder="请输入已到期分期金额"></Input>
                        </FormItem>
                        <FormItem label="未到期分期金额（元）" class="ft_form ft-plant-chooseType" prop="undueInstalment">
                          <Input v-model="item1.undueInstalment" @on-blur="onNumberChange($event,item1,'undueInstalment')" placeholder="请输入未到期分期金额"></Input>
                        </FormItem>
                        <FormItem label="合同签订时间" class="ft_form ft-plant-chooseType" prop="signDate">
                          <DatePicker
                            type="date"
                            :editable="false"
                            placeholder="请选择合同签订时间"
                            :clearable="false"
                            format="yyyy年MM月dd日"
                            style="width: 300px"
                            :value="item1.signDate"
                            @on-change="ft_keyinfo_chgTime(item1,'signDate',$event)"
                          ></DatePicker>
                        </FormItem>
                        <FormItem label="分期透支本金（元）" class="ft_form ft-plant-chooseType" prop="money">
                          <Input v-model="item1.money" @on-blur="onNumberChange($event,item1,'money')" placeholder="请输入分期透支本金"></Input>
                        </FormItem>
                        <FormItem label="分期期限" class="ft_form ft-plant-chooseType" prop="term">
                          <Input v-model="item1.term" placeholder="请输入分期期限"></Input>
                        </FormItem>
                        <FormItem label="分期手续费费率约定" class="ft_form ft-plant-chooseType" prop="advanceRelieveAppointment">
                          <Input v-model="item1.advanceRelieveAppointment" placeholder="请输入分期手续费费率约定" type="textarea"></Input>
                        </FormItem>
                      </Form>
                    </div>
                  </Panel>
                </Collapse> -->
                <!-- 增加分期合同按钮 -->
                <!-- <Form label-position="right" style="margin:0 auto;width: 441px;margin-top:15px">
                  <FormItem>
                    <div class='ft_public1'>
                      <a href="javascript:void(0)" style="" class="ft_public2 myaddBtn" @click="addcontract('installmentContract',item)">增加分期合同</a>
                    </div>
                  </FormItem>
                </Form>
              </div> -->
              <!-- 保证合同 -->
              <FormItem label="保证合同" class="ft_form ft-plant-chooseType ft-keyinfo-contract">
                <i-switch v-model="item.sw2"></i-switch>
              </FormItem>
              <div v-if="item.sw2==true">
                <Collapse simple v-model="openPandel2">
                  <Panel  v-for="(item1, key1) in item.ensureContract" :key="'info2'+key1" :name="'info2'+key1">
                    保证合同（{{item1.guarantyContract ? item1.guarantyContract :'暂无名称'}}）
                    <div slot="content" class="ft-plant-div2">
                      <Form :model="item1" label-position="right" :label-width="190" :ref="'info2' + key1" style="margin:0 auto">
                        <Tooltip content="删除当前保证合同" @click.native="delcontract('ensureContract','openPandel2',item,item1)" class="myTooltip" placement="bottom">
                          <Icon type="ios-close"  class="myCloseIco"/>
                        </Tooltip>
                        <FormItem label="保证合同名称" class="ft_form ft-plant-chooseType" prop="guarantyContract">
                          <Input v-model="item1.guarantyContract" placeholder="请输入保证合同名称"></Input>
                        </FormItem>
                        <FormItem label="合同签订时间" class="ft_form ft-plant-chooseType" prop="signDate">
                          <DatePicker
                            type="date"
                            :editable="false"
                            placeholder="请选择合同签订时间"
                            :clearable="false"
                            format="yyyy年MM月dd日"
                            style="width: 300px"
                            :value="item1.signDate"
                            @on-change="ft_keyinfo_chgTime(item1,'signDate',$event)"
                          ></DatePicker>
                        </FormItem>
                        <FormItem label="保证人" class="ft_form ft-plant-chooseType" prop="guarantor">
                          <Input v-model="item1.guarantor" placeholder="请输入保证人"></Input>
                        </FormItem>
                        <FormItem label="保证期间" class="ft_form ft-plant-chooseType" prop="period">
                          <Input v-model="item1.period" placeholder="请输入保证期间"></Input>
                        </FormItem>
                        <FormItem label="保证方式" class="ft_form ft-plant-chooseType" prop="guaranteeType">
                          <Input v-model="item1.guaranteeType" placeholder="请输入保证方式"></Input>
                        </FormItem>
                        <FormItem label="保证范围" class="ft_form ft-plant-chooseType" prop="scope">
                          <Input v-model="item1.scope" placeholder="请输入保证范围" type="textarea"></Input>
                        </FormItem>
                      </Form>
                    </div>
                  </Panel>
                </Collapse>
                <!-- 增加保证合同按钮 -->
                <Form label-position="right" style="margin:0 auto;width: 441px;margin-top:15px">
                  <FormItem>
                    <div class='ft_public1'>
                      <a href="javascript:void(0)" style="" class="ft_public2 myaddBtn" @click="addcontract('ensureContract',item)">增加保证合同</a>
                    </div>
                  </FormItem>
                </Form>
              </div>
              <!-- 抵押合同 -->
              <FormItem label="抵押合同" class="ft_form ft-plant-chooseType ft-keyinfo-contract">
                <i-switch v-model="item.sw3"></i-switch>
              </FormItem>
              <div v-if="item.sw3==true">
                <Collapse simple v-model="openPandel3">
                  <Panel  v-for="(item1, key1) in item.pledgeContract" :key="'info3'+key1" :name="'info3'+key1">
                    抵押合同（{{item1.pledgeContract ? item1.pledgeContract :'暂无名称'}}）
                    <div slot="content" class="ft-plant-div2">
                      <Form :model="item1" label-position="right" :label-width="190" :ref="'info3' + key1" style="margin:0 auto">
                        <Tooltip content="删除当前抵押合同" @click.native="delcontract('pledgeContract','openPandel3',item,item1)" class="myTooltip" placement="bottom">
                          <Icon type="ios-close"  class="myCloseIco"/>
                        </Tooltip>
                        <FormItem label="抵押合同名称" class="ft_form ft-plant-chooseType" prop="pledgeContract">
                          <Input v-model="item1.pledgeContract" placeholder="请输入抵押合同名称"></Input>
                        </FormItem>
                        <FormItem label="合同签订时间" class="ft_form ft-plant-chooseType" prop="signDate">
                          <DatePicker
                            type="date"
                            :editable="false"
                            placeholder="请选择合同签订时间"
                            :clearable="false"
                            format="yyyy年MM月dd日"
                            style="width: 300px"
                            :value="item1.signDate"
                            @on-change="ft_keyinfo_chgTime(item1,'signDate',$event)"
                          ></DatePicker>
                        </FormItem>
                        <FormItem label="抵押物权属" class="ft_form ft-plant-chooseType" prop="pledgeOwner">
                          <Input v-model="item1.pledgeOwner" placeholder="请输入抵押物权属"></Input>
                        </FormItem>
                        <FormItem label="抵押物名称" class="ft_form ft-plant-chooseType" prop="pledgeName">
                          <Input v-model="item1.pledgeName" placeholder="请输入抵押物名称"></Input>
                        </FormItem>
                        <FormItem label="抵押登记时间" class="ft_form ft-plant-chooseType" prop="registerDate">
                          <DatePicker
                            type="date"
                            :editable="false"
                            placeholder="请选择抵押登记时间"
                            :clearable="false"
                            format="yyyy年MM月dd日"
                            style="width: 300px"
                            :value="item1.registerDate"
                            @on-change="ft_keyinfo_chgTime(item1,'registerDate',$event)"
                          ></DatePicker>
                        </FormItem>
                        <FormItem label="抵押担保范围" class="ft_form ft-plant-chooseType" prop="scope">
                          <Input v-model="item1.scope" placeholder="请输入抵押担保范围" type="textarea"></Input>
                        </FormItem>
                      </Form>
                    </div>
                  </Panel>
                </Collapse>
                <!-- 增加抵押合同按钮 -->
                <Form label-position="right" style="margin:0 auto;width: 441px;margin-top:15px">
                  <FormItem>
                    <div class='ft_public1'>
                      <a href="javascript:void(0)" style="" class="ft_public2 myaddBtn" @click="addcontract('pledgeContract',item)">增加抵押合同</a>
                    </div>
                  </FormItem>
                </Form>
              </div>
              <!-- 质押合同 -->
              <FormItem label="质押合同" class="ft_form ft-plant-chooseType ft-keyinfo-contract">
                <i-switch v-model="item.sw4"></i-switch>
              </FormItem>
              <div v-if="item.sw4==true">
                <Collapse simple v-model="openPandel4">
                  <Panel  v-for="(item1, key1) in item.impawnContract" :key="'info4'+key1" :name="'info4'+key1">
                    质押合同（{{item1.impawnContract ? item1.impawnContract :'暂无名称'}}）
                    <div slot="content" class="ft-plant-div2">
                      <Form :model="item1" label-position="right" :label-width="190" :ref="'info4' + key1" style="margin:0 auto">
                        <Tooltip content="删除当前质押合同" @click.native="delcontract('impawnContract','openPandel4',item,item1)" class="myTooltip" placement="bottom">
                          <Icon type="ios-close"  class="myCloseIco"/>
                        </Tooltip>
                        <FormItem label="质押合同名称" class="ft_form ft-plant-chooseType" prop="impawnContract">
                          <Input v-model="item1.impawnContract" placeholder="请输入质押合同名称"></Input>
                        </FormItem>
                        <FormItem label="合同签订时间" class="ft_form ft-plant-chooseType" prop="signDate">
                          <DatePicker
                            type="date"
                            :editable="false"
                            placeholder="请选择合同签订时间"
                            :clearable="false"
                            format="yyyy年MM月dd日"
                            style="width: 300px"
                            :value="item1.signDate"
                            @on-change="ft_keyinfo_chgTime(item1,'signDate',$event)"
                          ></DatePicker>
                        </FormItem>
                        <FormItem label="质押物权属" class="ft_form ft-plant-chooseType" prop="pledgeOwner">
                          <Input v-model="item1.pledgeOwner" placeholder="请输入质押物权属"></Input>
                        </FormItem>
                        <FormItem label="质押物名称" class="ft_form ft-plant-chooseType" prop="pledgeName">
                          <Input v-model="item1.pledgeName" placeholder="请输入质押物名称"></Input>
                        </FormItem>
                        <FormItem label="质押登记时间" class="ft_form ft-plant-chooseType" prop="registerDate">
                          <DatePicker
                            type="date"
                            :editable="false"
                            placeholder="请选择质押登记时间"
                            :clearable="false"
                            format="yyyy年MM月dd日"
                            style="width: 300px"
                            :value="item1.registerDate"
                            @on-change="ft_keyinfo_chgTime(item1,'registerDate',$event)"
                          ></DatePicker>
                        </FormItem>
                        <FormItem label="质押担保范围" class="ft_form ft-plant-chooseType" prop="scope">
                          <Input v-model="item1.scope" placeholder="请输入质押担保范围" type="textarea"></Input>
                        </FormItem>
                      </Form>
                    </div>
                  </Panel>
                </Collapse>
                <!-- 增加质押合同按钮 -->
                <Form label-position="right" style="margin:0 auto;width: 441px;margin-top:15px">
                  <FormItem>
                    <div class='ft_public1'>
                      <a href="javascript:void(0)" style="" class="ft_public2 myaddBtn" @click="addcontract('impawnContract',item)">增加质押合同</a>
                    </div>
                  </FormItem>
                </Form>
              </div>
            </Form>
          </div>
        </Panel>
      </Collapse>
      <!-- 增加信用卡按钮 -->
      <Form label-position="right" style="margin:0 auto;width: 441px;margin-top:15px">
        <FormItem>
          <div class='ft_public1'>
            <a href="javascript:void(0)" style="" class="ft_public2 myaddBtn" @click="addcridtCardList">增加信用卡</a>
          </div>
        </FormItem>
      </Form>
      <!-- 夫妻共同债务 -->
      <FormItem label="夫妻共同债务" class="ft_form ft-plant-chooseType ft-keyinfo-contract">
        <i-switch v-model="sw1"></i-switch>
      </FormItem>
      <div v-if="sw1==true">
        <FormItem label="是否支持夫妻共同债务" class="ft_form ft-plant-chooseType" prop="coupleCommonDebt">
          <RadioGroup v-model="creditCaseBaseInfo.coupleCommonDebt">
            <Radio label="是"></Radio>
            <Radio label="否"></Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="结婚登记时间" class="ft_form ft-plant-chooseType" prop="marryTime">
          <DatePicker
            type="date"
            :editable="false"
            placeholder="请选择结婚登记时间"
            :clearable="false"
            format="yyyy年MM月dd日"
            style="width: 300px"
            :value="creditCaseBaseInfo.marryTime"
            @on-change="ft_keyinfo_chgTime(creditCaseBaseInfo,'marryTime',$event)"
          ></DatePicker>
        </FormItem>
        <FormItem label="离婚登记时间" class="ft_form ft-plant-chooseType" prop="divorceDate">
          <DatePicker
            type="date"
            :editable="false"
            placeholder="请选择离婚登记时间"
            :clearable="false"
            format="yyyy年MM月dd日"
            style="width: 300px"
            :value="creditCaseBaseInfo.divorceDate"
            @on-change="ft_keyinfo_chgTime(creditCaseBaseInfo,'divorceDate',$event)"
          ></DatePicker>
        </FormItem>
      </div>
      <!-- 调解书 -->
      <FormItem label="调解书" class="ft_form ft-plant-chooseType ft-keyinfo-contract">
        <i-switch v-model="sw2"></i-switch>
      </FormItem>
      <div v-if="sw2==true">
        <FormItem label="调解书案号" class="ft_form ft-plant-chooseType" prop="mediateCaseNo">
          <Input v-model="creditCaseBaseInfo.mediateCaseNo" placeholder="请输入调解书案号"></Input>
        </FormItem>
        <FormItem label="调解协议内容" class="ft_form ft-plant-chooseType" prop="mediateAgree">
          <Input v-model="creditCaseBaseInfo.mediateAgree" placeholder="请输入调解协议内容" type="textarea"></Input>
        </FormItem>
        <FormItem label="作出调解书时间" class="ft_form ft-plant-chooseType" prop="mediateDate">
          <DatePicker
            type="date"
            :editable="false"
            placeholder="请选择作出调解书时间"
            :clearable="false"
            format="yyyy年MM月dd日"
            style="width: 300px"
            :value="creditCaseBaseInfo.mediateDate"
            @on-change="ft_keyinfo_chgTime(creditCaseBaseInfo,'mediateDate',$event)"
          ></DatePicker>
        </FormItem>
      </div>
      <!-- 支付令 -->
      <FormItem label="支付令" class="ft_form ft-plant-chooseType ft-keyinfo-contract">
        <i-switch v-model="sw3"></i-switch>
      </FormItem>
      <div v-if="sw3==true">
        <FormItem label="请求支付的事实与理由" class="ft_form ft-plant-chooseType" prop="requestPayReason">
          <Input v-model="creditCaseBaseInfo.requestPayReason" placeholder="请输入请求支付的事实与理由" type="textarea"></Input>
        </FormItem>
        <FormItem label="申请支付金额（元）" class="ft_form ft-plant-chooseType" prop="requestPayMoney">
          <Input v-model="creditCaseBaseInfo.requestPayMoney" @on-blur="onNumberChange($event,creditCaseBaseInfo,'requestPayMoney')" placeholder="请输入申请支付金额"></Input>
        </FormItem>
        <FormItem label="有价证券" class="ft_form ft-plant-chooseType" prop="securities">
          <Input v-model="creditCaseBaseInfo.securities" placeholder="请输入有价证券"></Input>
        </FormItem>
        <FormItem label="支付令申请费（元）" class="ft_form ft-plant-chooseType" prop="paymentOrderFees">
          <Input v-model="creditCaseBaseInfo.paymentOrderFees" @on-blur="onNumberChange($event,creditCaseBaseInfo,'paymentOrderFees')" placeholder="请输入支付令申请费"></Input>
        </FormItem>
        <FormItem label="申请支付令时间" class="ft_form ft-plant-chooseType" prop="applyPayDate">
          <DatePicker
            type="date"
            :editable="false"
            placeholder="请选择申请支付令时间"
            :clearable="false"
            format="yyyy年MM月dd日"
            style="width: 300px"
            :value="creditCaseBaseInfo.applyPayDate"
            @on-change="ft_keyinfo_chgTime(creditCaseBaseInfo,'applyPayDate',$event)"
          ></DatePicker>
        </FormItem>
        <FormItem label="作出支付令时间" class="ft_form ft-plant-chooseType" prop="doPayDate">
          <DatePicker
            type="date"
            :editable="false"
            placeholder="请选择作出支付令时间"
            :clearable="false"
            format="yyyy年MM月dd日"
            style="width: 300px"
            :value="creditCaseBaseInfo.doPayDate"
            @on-change="ft_keyinfo_chgTime(creditCaseBaseInfo,'doPayDate',$event)"
          ></DatePicker>
        </FormItem>
      </div>
      <!-- 终结督促程序 -->
      <FormItem label="终结督促程序" class="ft_form ft-plant-chooseType ft-keyinfo-contract">
        <i-switch v-model="sw4"></i-switch>
      </FormItem>
      <div v-if="sw4==true">
        <FormItem label="终结督促程序申请费（元）" class="ft_form ft-plant-chooseType" prop="endSupervisionFees">
          <Input v-model="creditCaseBaseInfo.endSupervisionFees" @on-blur="onNumberChange($event,creditCaseBaseInfo,'endSupervisionFees')" placeholder="请输入终结督促程序申请费"></Input>
        </FormItem>
        <FormItem label="终结督促程序裁定作出时间" class="ft_form ft-plant-chooseType" prop="endSupervisionDate">
          <DatePicker
            type="date"
            :editable="false"
            placeholder="请选择终结督促程序裁定作出时间"
            :clearable="false"
            format="yyyy年MM月dd日"
            style="width: 300px"
            :value="creditCaseBaseInfo.endSupervisionDate"
            @on-change="ft_keyinfo_chgTime(creditCaseBaseInfo,'endSupervisionDate',$event)"
          ></DatePicker>
        </FormItem>
        <FormItem label="终结督促程序的原因" class="ft_form ft-plant-chooseType" prop="endSupervisionReason">
          <Input v-model="creditCaseBaseInfo.endSupervisionReason" placeholder="请输入终结督促程序的原因" type="textarea"></Input>
        </FormItem>
      </div>
    </Form>
  </div>
</template>

<script>
import keyInfoRule from "../keyinfo.js";
import { tools_transDate, tools_objHasStr } from "@/libs/tools.js";
export default {
  components: {},
  mounted() {
      console.log("999999",this.creditCaseBaseInfo)
  },
  data() {
    return {
      openPandel:[],//默认打开的面板名称数组绑定
      openPandel1:[],
      openPandel2:[],
      openPandel3:[],
      openPandel4:[],
      sw1:false,//开关状态
      sw2:false,
      sw3:false,
      sw4:false,
      sw5:false,
      sw6:false,
      sw7:false,
      sw8:false,
      creditCaseBaseInfo: Object.assign({},keyInfoRule.creditCaseBaseInfo),//信用卡纠纷基础信息
      cridtCardListInfo: keyInfoRule.cridtCardListInfo,//信用卡纠纷的信用卡基础信息
      ensureContract:keyInfoRule.ensureContractInfo,//抵押合同(信用卡纠纷)
      pledgeContract:keyInfoRule.pledgeContractInfo,//保证合同(信用卡纠纷)
      // installmentContract:keyInfoRule.installmentContractInfo,//分期合同(信用卡纠纷)
      impawnContract:keyInfoRule.impawnContractInfo,//质押合同(信用卡纠纷)
    };
  },
  methods: {
    creditNewLateFeeChange(item){
        item.damagesForBreachOfCredit=item.creditNewLateFee;
    },
    // 处理单个时间格式
    ft_keyinfo_chgTime(that,key,event) {
      that[key] = tools_transDate(event);
      console.log("888888",this.creditCaseBaseInfo)
      console.log("444444",this.creditCaseBaseInfo.cridtCardList)
    },

    // 同步时间范围格式
    ft_keyinfo_chgTimeArea(that,key,event) {
      let ary=[];
      event.forEach(item => {
        ary.push(tools_transDate(item))
      });
      that[key] = ary;
    },
    
    //删除某个信用卡
    delcridtCardList(that){
      this.creditCaseBaseInfo.cridtCardList.forEach((item,index) => {
        if(that==item){
          this.creditCaseBaseInfo.cridtCardList.splice(index,1);
          this.openPandel=[];
        }
      });
    },
    //添加信用卡
    addcridtCardList(){
      let cridtCardInfo=Object.assign({},keyInfoRule.cridtCardListInfo)
      this.creditCaseBaseInfo.cridtCardList.push(cridtCardInfo)
    },
    //删除某个合同
    delcontract(type,panelType,that,contract){
      that[type].forEach((item,index)=>{
        if(contract==item){
          that[type].splice(index,1);
          this[panelType]=[];
        }
      });
      console.log(this.openPandel1)

    },
    //添加某个合同
    addcontract(type,that){
      console.log("类型",type,"模板",this[type],"父级",that,"现有合同列表",that[type])
      let info=Object.assign({},this[type])
      that[type].push(info);
    },
    onNumberChange(e,obj,prop){//过滤金额
      obj[prop] = e.target.value ? parseFloat(e.target.value).toFixed(2).toString() : ''
    },
  }
};
</script>

<style lang="less" scoped>
  .myTooltip{
    .myCloseIco{
      font-size: 40px;
      cursor: pointer;
    }
  }
  .myaddBtn{
    padding: 15px!important;
    font-size: 15px!important;
  }
</style>