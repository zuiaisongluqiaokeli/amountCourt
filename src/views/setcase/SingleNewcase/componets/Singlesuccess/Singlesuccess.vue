<template>
  <div class='ft-mview-main'>
    <img src="@/images/sendsucc.png" alt="">
    <span>立案信息提交成功!</span>
    <!-- <span>您可以"立案进度"中查看案件的立案审核进度</span> -->
    <div class='ft-agent-footer'>
    <a
      href="javascript:void(0)"
      class="ft_public3 ft-magent-btn2"
      @click="mSingle_backToStep1"
    >返回立案申请首页
    </a>
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
    //返回首页
    mSingle_backToStep1 () {
      this.$emit('mSingle_backToStep1');
    }
  },
}
</script>


<style>
.ft-mview-main {
  display:flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-top:50px;
  margin-bottom: 50px;
}

.ft-mview-main span {
  color: #4873c5;
  margin:5px;
}
</style>

