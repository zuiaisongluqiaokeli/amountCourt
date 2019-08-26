
<template>
  <div class='ft_setcase_index'>
    <Card >
    <Row>
      <Col
        span="24"
        class="ft-tabs-style1"
      >
      <Tabs type="card" v-model="nowTab" :value="nowTab" @on-click='tabOnClick'>
        <TabPane label="提交新案件"  name='1'>
          <Singlecase ref="Singlecase"></Singlecase>
        </TabPane>
        <TabPane label="填写批量提交" name='2'>
          <SingleNewcase ref="SingleNewcase"></SingleNewcase>
        </TabPane>
        <TabPane label="模板批量提交"  name='3'>
          <Muticase ref="Muticase"></Muticase>
        </TabPane>
        
        <!-- <TabPane label="待提交案件列表" name='3'></TabPane>
        <TabPane label="立案进度" name='4'></TabPane> -->
      </Tabs>
      </Col>
    </Row>
    </Card >
  </div>
</template>


<script>
import Singlecase from './Singlecase/newcase.vue'; //提交新案件,单个
import SingleNewcase from './SingleNewcase/newcase.vue'; //提交新案件,单个
import Muticase from './Muticase/Muticase.vue'; //提交新案件,批量
export default {
  components:{
    Singlecase,
    SingleNewcase,
    Muticase
  },
  data() {
    return {
      nowTab:"1"
    };
  },
  mounted() {
    console.log("996996",this.$store.getters.roLeName)
    switch (this.$route.params.name) {
      case "Singlecase":
          this.nowTab = '1'
      break;
      case "SingleNewcase":
          this.nowTab = '2'
          this.$refs.SingleNewcase.init();
      break;
      case "Muticase":
          this.nowTab = '3'
          this.$refs.Muticase.$refs.Magenttype.init();
      break;
    }
  },
  methods: {
    tabOnClick(name){
      switch(name){
        case '2':
          this.$refs.SingleNewcase.init();
        break;
        case '3':
          this.$refs.Muticase.$refs.Magenttype.init();
        break;
      }
    },
  }
};
</script>

<style lang='css' scoped>
  @import './index.css';
</style>

