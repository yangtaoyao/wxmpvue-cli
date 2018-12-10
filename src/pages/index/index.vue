<template>
  <div class="counter-warp">
    
    <i-button @click="test" type="primary">测试按钮</i-button>
    <a href="/pages/me/main" class="home">去往我的</a>
  </div>
</template>

<script>
// Use Vuex
import store from './store'
import {getTest} from '@/api/index'
import util from '@/utils'

export default {
  computed: {
    count () {
      return store.state.count
    }
  },
  methods: {
    async test(){
      const rs=await getTest();
      console.log(rs);
      util.showSuccess('请求fachu')
    },
    getUserInfo () {
      // 调用登录接口
      wx.login({
        success: (res) => {
          console.log(res)
          wx.getUserInfo({
            success: (res) => {
              console.log(res)
            }
          })
        }
      })
    },
    increment () {
      store.commit('increment')
    },
    decrement () {
      store.commit('decrement')
    }
  },
  // 每个页面的的vue生命周期的钩子不要用 created, 
  // 因为会在小程序加载的时候, 所有的页面都会被触发
  mounted(){
    // this.getInfoList()
  }
}
</script>

<style>
.counter-warp {
  text-align: center;
  margin-top: 100px;
}
.home {
  display: inline-block;
  margin: 100px auto;
  padding: 5px 10px;
  color: blue;
  border: 1px solid blue;
}
</style>
