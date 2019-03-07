<template>
  <div class="counter-warp">
    <map
      id="map"
      :longitude="location.longitude"
      :latitude="location.latitude"
      scale="14"
      :markers="markers"
      bindmarkertap="markertap"
      :polyline="polyline"
      show-location="true"
      show-compass="true"
    ></map>
    <div>
      <i-button @click="test" >测试按钮</i-button>
      <i-button  @click="getLocation">获取定位</i-button>
      <i-button  @click="stopLocation">停止定位</i-button>
      <i-button  @click="calcDistance(location)">计算距离</i-button>

      <view class="flex-wrp" style="flex-direction:column;">
        <view class="flex-item">
          <text>latitude:{{location.latitude}}</text>
        </view>
        <view class="flex-item">
          <text>longitude:{{location.longitude}}</text>
        </view>
        <view class="flex-item">
          <text>距离:{{distance}}m</text>
        </view>
      </view>
    </div>
  </div>
</template>

<script>
// Use Vuex
import store from './store'
import {getTest} from '@/api/index'
import util from '@/utils'


export default {
  data(){
    return {
      location:{
        latitude:'',
        longitude:''
      },
      distance:0,
      interval:null,
      markers: [{
        iconPath: '/static/icon/location.png',
        id: 0,
        title:"经信教学楼",
        latitude: 43.825475,
        longitude: 125.277982,
        width: 30,
        height: 30
      }],
      //路线
      polyline: [{
        points: [{
          longitude: 125.279833,
          latitude: 43.831767
        }, {
          longitude: 125.277946,
          latitude: 43.825442
        }],
        color: '#FF0000DD',
        width: 2,
        dottedLine: true
      }],
      
    }
  },
  computed: {
    count () {
      return store.state.count
    }
  },
  methods: {
    regionchange(e) {
      console.log(e.type)
    },
    markertap(e) {
      console.log(e.markerId)
    },
    controltap(e) {
      console.log(e.controlId)
    },


    calcDistance(loca){
      const self=this
      // 调用接口
      util.QQMap.calculateDistance({
          from:loca,
          to:[{
              latitude: 43.831767,
              longitude: 125.279833
          }],
          success: function(res) {
            self.distance=res.result.elements[0].distance
            console.log(res.result.elements[0].distance);
          },
          fail: function(res) {
              console.log(res);
          }
      });
    },
    getLocation(){
      const self=this
      this.interval=setInterval(function(){
        wx.getLocation({
          type: 'wgs84',
          success(res) {
            self.location.latitude = res.latitude
            self.location.longitude = res.longitude
            self.location.speed = res.speed
            self.location.accuracy = res.accuracy
            console.log(util.formatTime(new Date(Date.now())))
          }
        })
      }, 3000)
    },
    stopLocation(){
      clearInterval(this.interval)
      util.showSuccess('停止定位')
    },
    async test(){
      const rs=await getTest();
      console.log(rs);
      util.showSuccess('请求fachu')
    },
    
  },
  mounted(){
    wx.createMapContext("map", this)
    // this.getLocation()
  }
}
</script>

<style scoped>
.counter-warp {
  text-align: center;
  /* margin-top: 100px; */
}
#map {
  top: 0;
  padding:18rpx;
  width: calc( 100% - 36rpx ); 
  height: 300px;
}
</style>
