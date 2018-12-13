<template>
  <div class="counter-warp">
    <view class="flex-wrp" style="height: 100%;flex-direction:column;">
      <view class="flex-item">
        <map
          id="map"
          :longitude="location.longitude"
          :latitude="location.latitude"
          scale="14"
          :markers="markers"
          bindmarkertap="markertap"
          :polyline="polyline"
          bindregionchange="regionchange"
          show-location
          style="width: 100%; height: 300px;"
        ></map>
      </view>
      <view class="flex-item">
      <scroll-view>
        <i-button @click="test" type="primary">测试按钮</i-button>
        <i-button type="primary" @click="getLocation">获取定位</i-button>
        <i-button type="primary" @click="stopLocation">停止定位</i-button>
        <i-button type="primary" @click="calcDistance(location)">计算距离</i-button>

        <view class="flex-wrp" style="flex-direction:column;">
          <view class="flex-item ">
            <text>latitude:{{location.latitude}}</text>
          </view>
          <view class="flex-item ">
            <text>longitude:{{location.longitude}}</text>
          </view>
          <view class="flex-item ">
            <text>accuracy:{{location.accuracy}}</text>
          </view>
        </view>
      </scroll-view>
      </view>
    </view>
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
      interval:null,
      
      markers: [{
        iconPath: '/resources/others.png',
        id: 0,
        latitude: 23.099994,
        longitude: 113.324520,
        width: 50,
        height: 50
      }],
      polyline: [{
        points: [{
          longitude: 113.3245211,
          latitude: 23.10229
        }, {
          longitude: 113.324520,
          latitude: 23.21229
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
      // 调用接口
      util.QQMap.calculateDistance({
          from:loca,
          to:[{
              latitude: 43.816,
              longitude: 125.323
          }],
          success: function(res) {
              console.log(res.result.elements[0].distance);
          },
          fail: function(res) {
              console.log(res);
          }
      });
    },
    getLocation(){
      const self=this
      util.showBusy("获取定位")
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
    // this.getInfoList()
  }
}
</script>

<style>
.counter-warp {
  text-align: center;
  /* margin-top: 100px; */
}
#map {
  top: 0;
  background: #000000;
}
</style>
