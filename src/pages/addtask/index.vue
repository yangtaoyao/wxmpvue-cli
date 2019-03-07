<template>
  <div class="container1">
    <i-cell-group>
        <i-cell is-link>
          <picker
            mode="date"
            :value="start_date"
            :start="start"
            @change="bindStartDate"
          >
            <div class="picker"> 开始时间： {{start_date}} </div>
          </picker>
        </i-cell>
        <i-cell is-link>
          <picker
            mode="date"
            :value="end_date"
            :start="start_date"
            @change="bindEndDate"
          >
            <div class="picker"> 截止时间： {{end_date}} </div>
          </picker>
        </i-cell>
        <i-cell title="标题">
          <textarea v-model="title" placeholder="输入签到标题" auto-focus auto-heigh="true" />
        </i-cell>
    </i-cell-group>
    <i-button @click="saveCommit" type="primary">保存</i-button>
  </div>
</template>

<script>
import { formatDate } from '@/utils/index'
import { addTask } from '@/api/index'
import util from '@/utils'

export default {
  components: {
  },
  data () {
    return {
      start:formatDate(new Date(Date.now())),
      start_date:formatDate(new Date(Date.now())),
      end_date:formatDate(new Date(Date.now())),
      title:''
    }
  },
  methods:{
    bindStartDate(e) {
      console.log('picker发送选择改变，携带值为', e.target.value)
      this.start_date=e.target.value
    },
    bindEndDate(e) {
      console.log('picker发送选择改变，携带值为', e.target.value)
      this.end_date=e.target.value
    },
    async saveCommit(){
      const userInfo=wx.getStorageSync('userInfo')
      const res=await addTask({
        start_date:this.start_date,
        end_date:this.end_date,
        title:this.title,
        uid:userInfo.openId
      })
      if(res.code){
        util.showModel('保存成功',res.data,()=>{
          wx.navigateBack({
            delta: 1
          })
        })
      }else{
        util.showModel('保存失败',res.data)
      }
    }
  },
  created () {

  }
}
</script>

<style scoped>
.container1{
  padding: 16rpx;
}

</style>
