<template>
  <!-- 金融案件 -->
  <div>
    <!-- 授信合同 -->
    <FormItem label="授信合同信息" class="ft_form ft-plant-chooseType ft-keyinfo-contract">
      <i-switch v-model="sw1" @on-change="change($event,1)"></i-switch>
    </FormItem>
    <div v-if="sw1">
      <Collapse simple v-model="openPandel">
        <Panel v-for="(item, key) in keyList.creditContract" :key="'info'+key" :name="'info'+key">
          授信合同（{{item.name ? item.name :'暂无名称'}}）
          <div slot="content" class="ft-plant-div2">
            <Form
              :model="item"
              label-position="right"
              :label-width="190"
              :ref="'info' + key"
              style="margin:0 auto"
            >
              <Tooltip
                content="删除当前合同"
                @click.native="delcontract('creditContract','openPandel',item)"
                class="myTooltip"
                placement="bottom"
              >
                <Icon type="ios-close" class="myCloseIco" />
              </Tooltip>
              <FormItem label="授信合同名称" class="ft_form ft-plant-chooseType" prop="name">
                <Input v-model="item.name" placeholder="请输入授信合同名称"></Input>
              </FormItem>
              <FormItem
                label="是否诉请解除该授信合同"
                class="ft_form ft-plant-chooseType"
                prop="terminateContract"
              >
                <RadioGroup v-model="item.terminateContract">
                  <Radio label="是"></Radio>
                  <Radio label="否"></Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="授信人" class="ft_form ft-plant-chooseType" prop="creditPerson">
                <Input v-model="item.creditPerson" placeholder="请输入授信人名称"></Input>
              </FormItem>
              <FormItem label="授信合同签订时间" class="ft_form ft-plant-chooseType" prop="signDate">
                <DatePicker
                  type="date"
                  :editable="false"
                  placeholder="请选择授信合同签订时间"
                  format="yyyy年MM月dd日"
                  style="width: 300px"
                  :value="item.signDate"
                  @on-change="ft_keyinfo_chgTime(item,'signDate',$event)"
                ></DatePicker>
              </FormItem>
              <FormItem label="授信期间" class="ft_form ft-plant-chooseType" prop="period">
                <Input v-model="item.period" placeholder="请输入授信期间"></Input>
              </FormItem>
              <FormItem label="授信金额（元）" class="ft_form ft-plant-chooseType" prop="money">
                <Input
                  v-model="item.money"
                  @on-blur="onNumberChange($event,item,'money')"
                  placeholder="请输入授信金额"
                ></Input>
              </FormItem>
            </Form>
          </div>
        </Panel>
      </Collapse>
      <!-- 增加授信合同按钮 -->
      <Form label-position="right" style="margin:0 auto;width: 441px;margin-top:15px">
        <FormItem>
          <div class="ft_public1">
            <a
              href="javascript:void(0)"
              style
              class="ft_public2"
              @click="addcontract('creditContract','credidList')"
            >增加授信合同</a>
          </div>
        </FormItem>
      </Form>
    </div>

    <!-- 借款合同 -->
    <FormItem label="借款合同信息" class="ft_form ft-plant-chooseType ft-keyinfo-contract">
      <i-switch v-model="sw2" @on-change="change($event,2)"></i-switch>
    </FormItem>
    <div v-if="sw2">
      <Collapse simple v-model="openPandel1">
        <Panel v-for="(item, key) in keyList.loanContract" :key="'info1'+key" :name="'info1'+key">
          借款合同（{{item.name ? item.name :'暂无名称'}}）
          <div slot="content" class="ft-plant-div2">
            <Form
              :model="item"
              label-position="right"
              :label-width="190"
              :ref="'info1' + key"
              style="margin:0 auto"
            >
              <Tooltip
                content="删除当前合同"
                @click.native="delcontract('loanContract','openPandel1',item)"
                class="myTooltip"
                placement="bottom"
              >
                <Icon type="ios-close" class="myCloseIco" />
              </Tooltip>
              <FormItem label="借款合同名称" class="ft_form ft-plant-chooseType" prop="name">
                <Input v-model="item.name" placeholder="请输入借款合同名称"></Input>
              </FormItem>
              <FormItem
                label="是否诉请解除该借款合同"
                class="ft_form ft-plant-chooseType"
                prop="terminateContract"
              >
                <RadioGroup v-model="item.terminateContract">
                  <Radio label="是"></Radio>
                  <Radio label="否"></Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="签订借款合同时间" class="ft_form ft-plant-chooseType" prop="signDate">
                <DatePicker
                  type="date"
                  :editable="false"
                  placeholder="请选择签订借款合同时间"
                  format="yyyy年MM月dd日"
                  style="width: 300px"
                  :value="item.signDate"
                  @on-change="ft_keyinfo_chgTime(item,'signDate',$event)"
                ></DatePicker>
              </FormItem>
              <FormItem label="借款本金（元）" class="ft_form ft-plant-chooseType" prop="money">
                <Input
                  v-model="item.money"
                  @on-blur="onNumberChange($event,item,'money')"
                  placeholder="请输入借款本金"
                ></Input>
              </FormItem>
              <FormItem label="借款期限" class="ft_form ft-plant-chooseType" prop="term">
                <Input v-model="item.term" placeholder="请输入借款期限"></Input>
              </FormItem>
              <FormItem
                label="还款方式"
                class="ft_form ft-plant-chooseType ft-plant-slectType"
                prop="repaymentType"
              >
                <Input v-model="item.repaymentType" placeholder="请输入还款方式"></Input>
              </FormItem>
              <FormItem
                label="借款利率"
                class="ft_form ft-plant-chooseType ft-plant-slectType"
                prop="interestRate"
              >
                <Input v-model="item.interestRate" placeholder="请输入借款利率"></Input>
              </FormItem>
              <FormItem
                label="罚息利率"
                class="ft_form ft-plant-chooseType ft-plant-slectType"
                prop="penaltyInterestRate"
              >
                <Input v-model="item.penaltyInterestRate" placeholder="请输入罚息利率"></Input>
              </FormItem>
              <FormItem
                label="复利利率"
                class="ft_form ft-plant-chooseType ft-plant-slectType"
                prop="compoundInterestRate"
              >
                <Input v-model="item.compoundInterestRate" placeholder="请输入复利利率"></Input>
              </FormItem>
              <FormItem
                label="罚息、复利约定"
                class="ft_form ft-plant-chooseType"
                prop="penaltyAppointment"
              >
                <Input v-model="item.penaltyAppointment" placeholder="请输入罚息、复利约定"></Input>
              </FormItem>
              <FormItem
                label="解除合同或提前收贷的约定"
                class="ft_form ft-plant-chooseType"
                prop="advanceRelieveAppointment"
              >
                <Input v-model="item.advanceRelieveAppointment" placeholder="请输入解除合同或提前收贷的约定"></Input>
              </FormItem>
              <FormItem
                label="违规金约定"
                class="ft_form ft-plant-chooseType"
                prop="breakContractAppointment"
              >
                <Input v-model="item.breakContractAppointment" placeholder="请输入违规金约定"></Input>
              </FormItem>
              <FormItem
                label="实现债券费用的约定"
                class="ft_form ft-plant-chooseType"
                prop="debtExpenseAppointment"
              >
                <Input v-model="item.debtExpenseAppointment" placeholder="请输入实现债券费用的约定"></Input>
              </FormItem>
              <FormItem label="送达约定" class="ft_form ft-plant-chooseType" prop="sendAppointment">
                <Input v-model="item.sendAppointment" placeholder="请输入送达约定"></Input>
              </FormItem>
            </Form>
          </div>
        </Panel>
      </Collapse>
      <!-- 增加借款合同按钮 -->
      <Form label-position="right" style="margin:0 auto;width: 441px;margin-top:15px">
        <FormItem>
          <div class="ft_public1">
            <a
              href="javascript:void(0)"
              style
              class="ft_public2"
              @click="addcontract('loanContract','loanList')"
            >增加借款合同</a>
          </div>
        </FormItem>
      </Form>
    </div>

    <!-- 保证合同 -->
    <FormItem label="保证合同信息" class="ft_form ft-plant-chooseType ft-keyinfo-contract">
      <i-switch v-model="sw3" @on-change="change($event,3)"></i-switch>
    </FormItem>
    <div v-if="sw3">
      <Collapse simple v-model="openPandel2">
        <Panel v-for="(item, key) in keyList.ensureContract" :key="'info2'+key" :name="'info2'+key">
          保证合同（{{item.name ? item.name :'暂无名称'}}）
          <div slot="content" class="ft-plant-div2">
            <Form
              :model="item"
              label-position="right"
              :label-width="190"
              :ref="'info2' + key"
              style="margin:0 auto"
            >
              <Tooltip
                content="删除当前合同"
                @click.native="delcontract('ensureContract','openPandel2',item)"
                class="myTooltip"
                placement="bottom"
              >
                <Icon type="ios-close" class="myCloseIco" />
              </Tooltip>
              <FormItem label="保证合同名称" class="ft_form ft-plant-chooseType" prop="name">
                <Input v-model="item.name" placeholder="请输入保证合同名称"></Input>
              </FormItem>
              <FormItem label="保证人" class="ft_form ft-plant-chooseType" prop="guarantor">
                <Input v-model="item.guarantor" placeholder="请输入保证人"></Input>
              </FormItem>
              <FormItem label="保证方式" class="ft_form ft-plant-chooseType" prop="guaranteeType">
                <Input v-model="item.guaranteeType" placeholder="请输入保证方式"></Input>
              </FormItem>
              <FormItem label="保证期间" class="ft_form ft-plant-chooseType" prop="period">
                <Input v-model="item.period" placeholder="请输入保证期间"></Input>
              </FormItem>
              <FormItem label="保证合同签订时间" class="ft_form ft-plant-chooseType" prop="signDate">
                <DatePicker
                  type="date"
                  :editable="false"
                  placeholder="请选择保证合同签订时间"
                  format="yyyy年MM月dd日"
                  style="width: 300px"
                  :value="item.signDate"
                  @on-change="ft_keyinfo_chgTime(item,'signDate',$event)"
                ></DatePicker>
              </FormItem>
              <FormItem label="保证范围" class="ft_form ft-plant-chooseType" prop="scope">
                <Input v-model="item.scope" placeholder="请输入保证范围"></Input>
              </FormItem>
            </Form>
          </div>
        </Panel>
      </Collapse>
      <!-- 增加保证合同按钮 -->
      <Form label-position="right" style="margin:0 auto;width: 441px;margin-top:15px">
        <FormItem>
          <div class="ft_public1">
            <a
              href="javascript:void(0)"
              style
              class="ft_public2"
              @click="addcontract('ensureContract','ensureList')"
            >增加保证合同</a>
          </div>
        </FormItem>
      </Form>
    </div>

    <!-- 抵押合同 -->
    <FormItem label="抵押合同信息" class="ft_form ft-plant-chooseType ft-keyinfo-contract">
      <i-switch v-model="sw4" @on-change="change($event,4)"></i-switch>
    </FormItem>
    <div v-if="sw4">
      <Collapse simple v-model="openPandel3">
        <Panel
          v-for="(item, key) in keyList.mortgageContract"
          :key="'info3'+key"
          :name="'info3'+key"
        >
          抵押合同（{{item.name ? item.name :'暂无名称'}}）
          <div slot="content" class="ft-plant-div2">
            <Form
              :model="item"
              label-position="right"
              :label-width="190"
              :ref="'info3' + key"
              style="margin:0 auto"
            >
              <Tooltip
                content="删除当前合同"
                @click.native="delcontract('mortgageContract','openPandel3',item)"
                class="myTooltip"
                placement="bottom"
              >
                <Icon type="ios-close" class="myCloseIco" />
              </Tooltip>
              <FormItem label="抵押合同名称" class="ft_form ft-plant-chooseType" prop="name">
                <Input v-model="item.name" placeholder="请输入抵押合同名称"></Input>
              </FormItem>
              <FormItem label="抵押合同签订时间" class="ft_form ft-plant-chooseType" prop="signDate">
                <DatePicker
                  type="date"
                  :editable="false"
                  placeholder="请输入抵押合同签订时间"
                  format="yyyy年MM月dd日"
                  style="width: 300px"
                  :value="item.signDate"
                  @on-change="ft_keyinfo_chgTime(item,'signDate',$event)"
                ></DatePicker>
              </FormItem>
              <FormItem label="抵押物权属" class="ft_form ft-plant-chooseType" prop="pledgeOwner">
                <Input v-model="item.pledgeOwner" placeholder="请输入抵押物权属"></Input>
              </FormItem>
              <FormItem label="抵押物名称" class="ft_form ft-plant-chooseType" prop="pledgeName">
                <Input v-model="item.pledgeName" placeholder="请输入抵押物名称"></Input>
              </FormItem>
              <FormItem label="抵押担保范围" class="ft_form ft-plant-chooseType" prop="scope">
                <Input v-model="item.scope" placeholder="请输入抵押担保范围"></Input>
              </FormItem>
              <FormItem label="办理抵押登记时间" class="ft_form ft-plant-chooseType" prop="registerDate">
                <DatePicker
                  type="date"
                  :editable="false"
                  placeholder="请输入办理抵押登记时间"
                  format="yyyy年MM月dd日"
                  style="width: 300px"
                  :value="item.registerDate"
                  @on-change="ft_keyinfo_chgTime(item,'registerDate',$event)"
                ></DatePicker>
              </FormItem>
            </Form>
          </div>
        </Panel>
      </Collapse>
      <!-- 增加抵押合同按钮 -->
      <Form label-position="right" style="margin:0 auto;width: 441px;margin-top:15px">
        <FormItem>
          <div class="ft_public1">
            <a
              href="javascript:void(0)"
              style
              class="ft_public2"
              @click="addcontract('mortgageContract','pawnList')"
            >增加抵押合同</a>
          </div>
        </FormItem>
      </Form>
    </div>

    <!-- 质押合同 -->
    <FormItem label="质押合同信息" class="ft_form ft-plant-chooseType ft-keyinfo-contract">
      <i-switch v-model="sw5" @on-change="change($event,5)"></i-switch>
    </FormItem>
    <div v-if="sw5">
      <Collapse simple v-model="openPandel4">
        <Panel v-for="(item, key) in keyList.impawnContract" :key="'info4'+key" :name="'info4'+key">
          质押合同（{{item.name ? item.name :'暂无名称'}}）
          <div slot="content" class="ft-plant-div2">
            <Form
              :model="item"
              label-position="right"
              :label-width="190"
              :ref="'info4' + key"
              style="margin:0 auto"
            >
              <Tooltip
                content="删除当前合同"
                @click.native="delcontract('impawnContract','openPandel4',item)"
                class="myTooltip"
                placement="bottom"
              >
                <Icon type="ios-close" class="myCloseIco" />
              </Tooltip>
              <FormItem label="质押合同名称" class="ft_form ft-plant-chooseType" prop="name">
                <Input v-model="item.name" placeholder="请输入质押合同名称"></Input>
              </FormItem>
              <FormItem label="质押合同签订时间" class="ft_form ft-plant-chooseType" prop="signDate">
                <DatePicker
                  type="date"
                  :editable="false"
                  placeholder="请选择质押合同签订时间"
                  format="yyyy年MM月dd日"
                  style="width: 300px"
                  :value="item.signDate"
                  @on-change="ft_keyinfo_chgTime(item,'signDate',$event)"
                ></DatePicker>
              </FormItem>
              <FormItem label="质押物属权" class="ft_form ft-plant-chooseType" prop="pledgeOwner">
                <Input v-model="item.pledgeOwner" placeholder="请输入质押物属权"></Input>
              </FormItem>
              <FormItem label="质押物名称" class="ft_form ft-plant-chooseType" prop="pledgeName">
                <Input v-model="item.pledgeName" placeholder="请输入质押物名称"></Input>
              </FormItem>
              <FormItem label="质押担保范围" class="ft_form ft-plant-chooseType" prop="scope">
                <Input v-model="item.scope" placeholder="请输入质押担保范围"></Input>
              </FormItem>
              <FormItem label="办理质押登记时间" class="ft_form ft-plant-chooseType" prop="registerDate">
                <DatePicker
                  type="date"
                  :editable="false"
                  placeholder="请输入质押登记时间"
                  format="yyyy年MM月dd日"
                  style="width: 300px"
                  :value="item.registerDate"
                  @on-change="ft_keyinfo_chgTime(item,'registerDate',$event)"
                ></DatePicker>
              </FormItem>
            </Form>
          </div>
        </Panel>
      </Collapse>
      <!-- 增加抵押合同按钮 -->
      <Form label-position="right" style="margin:0 auto;width: 441px;margin-top:15px">
        <FormItem>
          <div class="ft_public1">
            <a
              href="javascript:void(0)"
              style
              class="ft_public2"
              @click="addcontract('impawnContract','impawnList')"
            >增加抵押合同</a>
          </div>
        </FormItem>
      </Form>
    </div>

    <!-- 基础要素 -->
    <FormItem label="放款日期" class="ft_form ft-plant-chooseType" prop="lendingTime">
      <!-- <DatePicker
        type="date"
        :editable="false"
        placeholder="请选择放款日期"
        format="yyyy年MM月dd日"
        style="width: 300px"
        @on-change="ft_keyinfo_chgTime1(keyList,'lendingTime',$event)"
      ></DatePicker>-->
      <Input v-model="keyList.lendingTime" placeholder="请输入放款日期"></Input>
    </FormItem>
    <FormItem label="实际到期日期" class="ft_form ft-plant-chooseType" prop="dueTime">
      <!-- <DatePicker
        type="date"
        :editable="false"
        placeholder="请选择实际到期日期"
        format="yyyy年MM月dd日"
        style="width: 300px"
        @on-change="ft_keyinfo_chgTime1(keyList,'dueTime',$event)"
      ></DatePicker>-->
      <Input v-model="keyList.dueTime" placeholder="请输入实际到期日期"></Input>
    </FormItem>
    <FormItem label="逾期还款日期" class="ft_form ft-plant-chooseType" prop="overDueRepaymentTime">
      <!-- <DatePicker
        type="date"
        :editable="false"
        placeholder="请选择实际到期日期"
        format="yyyy年MM月dd日"
        style="width: 300px"
        @on-change="ft_keyinfo_chgTime1(keyList,'overDueRepaymentTime',$event)"
      ></DatePicker>-->
      <Input v-model="keyList.overDueRepaymentTime" placeholder="请输入逾期还款日期"></Input>
    </FormItem>
    <FormItem label="欠款最新截至时间" class="ft_form ft-plant-chooseType" prop="debtNewlyEndTime">
      <DatePicker
        :value="keyList.debtNewlyEndTime"
        type="date"
        :editable="false"
        placeholder="请选择欠款最新截至时间"
        format="yyyy年MM月dd日"
        style="width: 300px"
        @on-change="ft_keyinfo_chgTime(keyList,'debtNewlyEndTime',$event)"
      ></DatePicker>
    </FormItem>
    <FormItem label="欠款本金（元）" class="ft_form ft-plant-chooseType" prop="deptCapital">
      <Input
        v-model="keyList.deptCapital"
        @on-blur="onNumberChange($event,keyList,'deptCapital')"
        placeholder="请输入欠款本金"
      ></Input>
    </FormItem>
    <FormItem label="利息（元）" class="ft_form ft-plant-chooseType" prop="interest">
      <Input
        v-model="keyList.interest"
        @on-blur="onNumberChange($event,keyList,'interest')"
        placeholder="请输入利息"
      ></Input>
    </FormItem>
    <FormItem label="罚息（元）" class="ft_form ft-plant-chooseType" prop="penaltyInterest">
      <Input
        v-model="keyList.penaltyInterest"
        @on-blur="onNumberChange($event,keyList,'penaltyInterest')"
        placeholder="请输入罚息"
      ></Input>
    </FormItem>
    <FormItem label="复利（元）" class="ft_form ft-plant-chooseType" prop="compoundInterest">
      <Input
        v-model="keyList.compoundInterest"
        @on-blur="onNumberChange($event,keyList,'compoundInterest')"
        placeholder="请输入复利"
      ></Input>
    </FormItem>
    <FormItem label="最新欠款利息、罚息、复利（元）" class="ft_form ft-plant-chooseType" prop="newlyInterest">
      <Input
        v-model="keyList.newlyInterest"
        @on-blur="onNumberChange($event,keyList,'newlyInterest')"
        placeholder="请输入最新欠款利息、罚息、复利"
      ></Input>
    </FormItem>
    <FormItem label="最新欠款利息等（元）" class="ft_form ft-plant-chooseType" prop="newArrearsInterest">
      <Input
        v-model="keyList.newArrearsInterest"
        @on-blur="onNumberChange($event,keyList,'newArrearsInterest')"
        placeholder="请输入最新欠款利息等"
      ></Input>
    </FormItem>
    <FormItem label="违约金金额（元）" class="ft_form ft-plant-chooseType" prop="breakContractMoney">
      <Input
        v-model="keyList.breakContractMoney"
        @on-blur="onNumberChange($event,keyList,'breakContractMoney')"
        placeholder="请输入违约金金额"
      ></Input>
    </FormItem>
    <FormItem label="实现债权的费用（元）" class="ft_form ft-plant-chooseType" prop="debtExpense">
      <Input
        v-model="keyList.debtExpense"
        @on-blur="onNumberChange($event,keyList,'debtExpense')"
        placeholder="请输入实现债权的费用"
      ></Input>
    </FormItem>
    <FormItem label="律师费（元）" class="ft_form ft-plant-chooseType" prop="lawyerFees">
      <Input
        v-model="keyList.lawyerFees"
        @on-blur="onNumberChange($event,keyList,'lawyerFees')"
        placeholder="请输入律师费"
      ></Input>
    </FormItem>
    <FormItem label="保全费（元）" class="ft_form ft-plant-chooseType" prop="preservationFees">
      <Input
        v-model="keyList.preservationFees"
        @on-blur="onNumberChange($event,keyList,'preservationFees')"
        placeholder="请输入保全费"
      ></Input>
    </FormItem>
    <FormItem label="公告费（元）" class="ft_form ft-plant-chooseType" prop="announcementFees">
      <Input
        v-model="keyList.announcementFees"
        @on-blur="onNumberChange($event,keyList,'announcementFees')"
        placeholder="请输入公告费"
      ></Input>
    </FormItem>
    <FormItem label="债权其他费用（元）" class="ft_form ft-plant-chooseType" prop="claimsOtherFees">
      <Input
        v-model="keyList.claimsOtherFees"
        @on-blur="onNumberChange($event,keyList,'claimsOtherFees')"
        placeholder="请输入债权其他费用"
      ></Input>
    </FormItem>
    <FormItem label="是否支持夫妻共同债务" class="ft_form ft-plant-chooseType" prop="coupleCommonDebt">
      <RadioGroup v-model="keyList.coupleCommonDebt">
        <Radio label="是"></Radio>
        <Radio label="否"></Radio>
      </RadioGroup>
    </FormItem>
    <FormItem label="结婚登记时间" class="ft_form ft-plant-chooseType" prop="marryTime">
      <DatePicker
        :value="keyList.marryTime"
        type="date"
        :editable="false"
        placeholder="请选择结婚登记时间"
        format="yyyy年MM月dd日"
        style="width: 300px"
        @on-change="ft_keyinfo_chgTime(keyList,'marryTime',$event)"
      ></DatePicker>
    </FormItem>
    <FormItem label="离婚登记时间" class="ft_form ft-plant-chooseType" prop="divorceDate">
      <DatePicker
        :value="keyList.divorceDate"
        type="date"
        :editable="false"
        placeholder="请选择离婚登记时间"
        format="yyyy年MM月dd日"
        style="width: 300px"
        @on-change="ft_keyinfo_chgTime(keyList,'divorceDate',$event)"
      ></DatePicker>
    </FormItem>
    <FormItem label="适用的法律条文" class="ft_form ft-plant-chooseType" prop="applyLaw">
      <Input v-model="keyList.applyLaw" placeholder="请输入适用的法律条文"></Input>
    </FormItem>
    <FormItem label="法律法规" class="ft_form ft-plant-chooseType" prop="lawsAndRegulations">
      <Input v-model="keyList.lawsAndRegulations" placeholder="请输入法律法规"></Input>
    </FormItem>
    <FormItem label="诉前保全裁定案号" class="ft_form ft-plant-chooseType" prop="preservationCaseNo">
      <Input v-model="keyList.preservationCaseNo" placeholder="请输入诉前保全裁定案号"></Input>
    </FormItem>
    <FormItem label="保全被申请人" class="ft_form ft-plant-chooseType" prop="preservationTarget">
      <Input v-model="keyList.preservationTarget" placeholder="请输入保全被申请人"></Input>
    </FormItem>
    <FormItem label="申请保全时间" class="ft_form ft-plant-chooseType" prop="applyPreservationDate">
      <DatePicker
        :value="keyList.applyPreservationDate"
        type="date"
        :editable="false"
        placeholder="请选择申请保全时间"
        format="yyyy年MM月dd日"
        style="width: 300px"
        @on-change="ft_keyinfo_chgTime(keyList,'applyPreservationDate',$event)"
      ></DatePicker>
    </FormItem>
    <FormItem
      label="财产保全金额（元）"
      class="ft_form ft-plant-chooseType"
      prop="propertyPreservationMoney"
    >
      <Input
        v-model="keyList.propertyPreservationMoney"
        @on-blur="onNumberChange($event,keyList,'propertyPreservationMoney')"
        placeholder="请输入财产保全金额"
      ></Input>
    </FormItem>
    <FormItem label="财产保全费（元）" class="ft_form ft-plant-chooseType" prop="propertyPreservationFees">
      <Input
        v-model="keyList.propertyPreservationFees"
        @on-blur="onNumberChange($event,keyList,'propertyPreservationFees')"
        placeholder="请输入财产保全费"
      ></Input>
    </FormItem>
    <FormItem label="作出保全裁定时间" class="ft_form ft-plant-chooseType" prop="approvalPreservationDate">
      <DatePicker
        :value="keyList.approvalPreservationDate"
        type="date"
        :editable="false"
        placeholder="请选择作出保全裁定时间"
        format="yyyy年MM月dd日"
        style="width: 300px"
        @on-change="ft_keyinfo_chgTime(keyList,'approvalPreservationDate',$event)"
      ></DatePicker>
    </FormItem>
    <FormItem label="解除保全申请时间" class="ft_form ft-plant-chooseType" prop="relievePreservationDate">
      <DatePicker
        :value="keyList.relievePreservationDate"
        type="date"
        :editable="false"
        placeholder="请选择解除保全申请时间"
        format="yyyy年MM月dd日"
        style="width: 300px"
        @on-change="ft_keyinfo_chgTime(keyList,'relievePreservationDate',$event)"
      ></DatePicker>
    </FormItem>
    <FormItem label="保全被申请人信息" class="ft_form ft-plant-chooseType" prop="preservationPersonInfo">
      <Input v-model="keyList.preservationPersonInfo" placeholder="请输入保全被申请人信息"></Input>
    </FormItem>
    <FormItem label="支付令案号" class="ft_form ft-plant-chooseType" prop="paymentOrderCaseNo">
      <Input v-model="keyList.paymentOrderCaseNo" placeholder="请输入支付令案号"></Input>
    </FormItem>
    <FormItem label="支付令被申请人" class="ft_form ft-plant-chooseType" prop="paymentOrdertarget">
      <Input v-model="keyList.paymentOrdertarget" placeholder="请输入支付令被申请人"></Input>
    </FormItem>
    <FormItem label="请求支付的事实与理由" class="ft_form ft-plant-chooseType" prop="requestPayReason">
      <Input
        :rows="4"
        type="textarea"
        v-model="keyList.requestPayReason"
        placeholder="请输入请求支付的事实与理由"
      ></Input>
    </FormItem>
    <FormItem label="申请支付金额（元）" class="ft_form ft-plant-chooseType" prop="requestPayMoney">
      <Input
        v-model="keyList.requestPayMoney"
        @on-blur="onNumberChange($event,keyList,'requestPayMoney')"
        placeholder="请输入申请支付金额"
      ></Input>
    </FormItem>
    <FormItem label="有价证券" class="ft_form ft-plant-chooseType" prop="securities">
      <Input v-model="keyList.securities" placeholder="请输入有价证券"></Input>
    </FormItem>
    <FormItem label="申请支付金额或有价证券名称" class="ft_form ft-plant-chooseType" prop="paySecuritiesName">
      <Input v-model="keyList.paySecuritiesName" placeholder="请输入申请支付金额或有价证券名称"></Input>
    </FormItem>
    <FormItem label="支付令申请费（元）" class="ft_form ft-plant-chooseType" prop="paymentOrderFees">
      <Input
        v-model="keyList.paymentOrderFees"
        @on-blur="onNumberChange($event,keyList,'paymentOrderFees')"
        placeholder="请输入支付令申请费"
      ></Input>
    </FormItem>
    <FormItem label="申请支付令时间" class="ft_form ft-plant-chooseType" prop="applyPayDate">
      <DatePicker
        :value="keyList.applyPayDate"
        type="date"
        :editable="false"
        placeholder="请选择申请支付令时间"
        format="yyyy年MM月dd日"
        style="width: 300px"
        @on-change="ft_keyinfo_chgTime(keyList,'applyPayDate',$event)"
      ></DatePicker>
    </FormItem>
    <FormItem label="作出支付令时间" class="ft_form ft-plant-chooseType" prop="doPayDate">
      <DatePicker
        :value="keyList.doPayDate"
        type="date"
        :editable="false"
        placeholder="请选择作出支付令时间"
        format="yyyy年MM月dd日"
        style="width: 300px"
        @on-change="ft_keyinfo_chgTime(keyList,'doPayDate',$event)"
      ></DatePicker>
    </FormItem>
    <FormItem label="终结督促程序申请费（元）" class="ft_form ft-plant-chooseType" prop="endSupervisionFees">
      <Input
        v-model="keyList.endSupervisionFees"
        @on-blur="onNumberChange($event,keyList,'endSupervisionFees')"
        placeholder="请输入终结督促程序申请费"
      ></Input>
    </FormItem>
    <FormItem label="终结督促程序裁定适用法条" class="ft_form ft-plant-chooseType" prop="endSupervisionLaw">
      <Input
        :rows="4"
        type="textarea"
        v-model="keyList.endSupervisionLaw"
        placeholder="请输入终结督促程序裁定适用法条"
      ></Input>
    </FormItem>
    <FormItem label="终结督促程序裁定作出时间" class="ft_form ft-plant-chooseType" prop="endSupervisionDate">
      <DatePicker
        :value="keyList.endSupervisionDate"
        type="date"
        :editable="false"
        placeholder="请选择终结督促程序裁定作出时间"
        format="yyyy年MM月dd日"
        style="width: 300px"
        @on-change="ft_keyinfo_chgTime(keyList,'endSupervisionDate',$event)"
      ></DatePicker>
    </FormItem>
    <FormItem label="终结督促程序的原因" class="ft_form ft-plant-chooseType" prop="endSupervisionReason">
      <Input v-model="keyList.endSupervisionReason" placeholder="请输入终结督促程序的原因"></Input>
    </FormItem>
    <FormItem label="支付令被申请人信息" class="ft_form ft-plant-chooseType" prop="paymentOrderPersonInfo">
      <Input v-model="keyList.paymentOrderPersonInfo" placeholder="请输入支付令被申请人信息"></Input>
    </FormItem>
    <FormItem label="调解书案号" class="ft_form ft-plant-chooseType" prop="mediateCaseNo">
      <Input v-model="keyList.mediateCaseNo" placeholder="请输入调解书案号"></Input>
    </FormItem>
    <FormItem label="作出调解书时间" class="ft_form ft-plant-chooseType" prop="mediateDate">
      <DatePicker
        :value="keyList.mediateDate"
        type="date"
        :editable="false"
        placeholder="请选择作出调解书时间"
        format="yyyy年MM月dd日"
        style="width: 300px"
        @on-change="ft_keyinfo_chgTime(keyList,'mediateDate',$event)"
      ></DatePicker>
    </FormItem>
  </div>
</template>
<script>
import keyInfoRule from "./keyinfo.js";
import { tools_transDate, tools_objHasStr } from "@/libs/tools.js";
import { deleteContract } from "@/api/caseInfo";
export default {
  data() {
    return {
      sw1:true,
      sw2:true,
      sw3:true,
      sw4:true,
      sw5:true,
      openPandel: [], //默认打开的面板名称数组绑定
      openPandel1: [],
      openPandel2: [],
      openPandel3: [],
      openPandel4: [],
      // keyList: keyInfoRule.List, //常规要素信息数据
      ensureList: keyInfoRule.ensureList, //保证合同数据
      pawnList: keyInfoRule.pawnList, //抵押同数据
      credidList: keyInfoRule.creditList, //授信合同数据
      impawnList: keyInfoRule.impawnList, //质押合同数据
      loanList: keyInfoRule.loanList //借款合同数据
    };
  },
  computed: {
    
  },
  props: {
    keyList: {
      type: Object,
      default: {}
    },
  },
  methods: {
    //依据swich的改变判断是否显示内容
    change(status,index){
        switch (index) {
          case 1: this.sw1 = status;
          break;
          case 2: this.sw2 = status;
          break;
          case 3: this.sw3 = status;
          break;
          case 4: this.sw4 = status;
          break;
          case 5: this.sw5 = status;
          break;
        }
    },
    // 处理单个时间格式（去掉年月日）
    ft_keyinfo_chgTime(that, key, event) {
      console.log(that, key);
      that[key] = tools_transDate(event);
    },

    // 处理单个时间格式（不去掉年月日）
    ft_keyinfo_chgTime1(that, key, event) {
      console.log(that, key);
      that[key] = event;
    },
    //过滤金额保留2位
    onNumberChange(e, obj, prop) {
      obj[prop] = obj[prop]
        ? parseFloat(obj[prop])
            .toFixed(2)
            .toString()
        : "";
    },
    //删除某个合同
    delcontract(type, panelType, that) {
      this["keyList"][type].forEach((item, index) => {
        if (item == that) {
          if (item.contractId) {
            deleteContract(item.contractId).then(res => {

          });
          }
          //两个对象的对比删除
          this["keyList"][type].splice(index, 1);
          this[panelType] = [];
        }
      });
    },
    //添加某个合同，必须先定义数组，如果数组是空的是无法进行循环遍历累加
    addcontract(type, modelType) {
      console.log("类型", type, "模板", this[modelType]);
      let info = Object.assign({}, this[modelType]);
      this["keyList"][type].push(info);
    }
  },
  //当kiylist传入的时候更改switch的状态
  watch: {
    keyList(val,oldval) {
      this.sw1 =  val.hasOwnProperty("creditContract") &&
          val.creditContract.length
          ? true
          : false;
      this.sw2 =   val.hasOwnProperty("loanContract") &&
          val.loanContract.length
          ? true
          : false;
      this.sw3 =   val.hasOwnProperty("ensureContract") &&
          val.ensureContract.length
          ? true
          : false;
      this.sw4 = val.hasOwnProperty("mortgageContract") &&
          val.mortgageContract.length
          ? true
          : false;
      this.sw5 =  val.hasOwnProperty("impawnContract") &&
          val.impawnContract.length
          ? true
          : false;
    }
  }
};
</script>
<style lang="less" scoped>
.myTooltip {
  .myCloseIco {
    font-size: 40px;
    cursor: pointer;
  }
}
.ivu-collapse-content {
    overflow-y: scroll;
  }
</style>

