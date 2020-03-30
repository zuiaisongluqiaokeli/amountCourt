<style scoped src='./review.css'></style>

<template>
  <div>
    <div class='ft-review-notice'>
      <img src="@/images/reviewnotice.png" alt="" style="margin:50px 100px 0 0">
      <h3 style="margin:20px 100px 0 0">请确保信息确认无误后提交</h3>
    </div>
    <div class='ft-agent-footer'>
          <a href="javascript:void(0)" class="ft-agent-btn1" style="margin-left:-110px" @click="ft_review_backToStep6">返回上一步</a>
          <a href="javascript:void(0)" class="ft_public3" @click="ft_review_toFinal(1)">提交</a>
          <!-- <a href="javascript:void(0)" class="ft-agent-btn1" style="margin-left:10px" @click="ft_review_toFinal(0)">暂存到“待提交案件列表”</a> -->
    </div>
  </div>
</template>


<script>
export default {
  data () {
    return {

    }
  },
  methods:{
    //返回上一步
    ft_review_backToStep6 () {
      this.$emit('toNextStep',{type:'浏览提交',state:'back'});
    },
    //提交
    ft_review_toFinal (type) {
      this.$emit('ft_final_addForm',type)
    }
  }
}
</script>



