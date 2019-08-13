<style lang="less">
@import "./batch.less";
</style>

<template>
  <div class="batchModel">
    <setCaseTable
      v-show="myType=='立案'"
      :listDatas="listDatas"
      @cancelEvent="closeModel"
      @nextStep="nextStep"
      @reSetList="reSetList"
      ref="setCase"
    ></setCaseTable>
    <divisionTable
      v-show="myType=='分案'"
      :listDatas="listDatas"
      @cancelEvent="closeModel"
      @nextStep="nextStep"
      @reSetList="reSetList"
      ref="division"
    ></divisionTable>
    <courtDateTable
      v-show="myType=='排庭'"
      :listDatas="listDatas"
      @cancelEvent="closeModel"
      @reSetList="reSetList"
      ref="courtDate"
    ></courtDateTable>
  </div>
</template>
<script>
import setCaseTable from "@/components/caseSure/batchHandle/components/setCaseTable.vue";
import divisionTable from "@/components/caseSure/batchHandle/components/divisionTable.vue";
import courtDateTable from "@/components/caseSure/batchHandle/components/courtDateTable.vue";

export default {
  components: {
    setCaseTable,
    divisionTable,
    courtDateTable
  },
  data() {
    return {
    };
  },
  //传入类型和已选择的列
  props: {
    listDatas: Array,
    myType: String
  },
  methods: {
    closeModel(data) {
      this.$emit("cancelEvent", data);
    },
    nextStep(type) {
      this.$emit("nextStep", type);
    },
    reSetList(list) {
      //重置父组件数据
      this.$emit("reSetList", list);
    },
    resetData(){//清空数据
      this.$refs.setCase.resetData()
      this.$refs.division.resetData()
      this.$refs.courtDate.resetData()
    }
  }
};
</script>

