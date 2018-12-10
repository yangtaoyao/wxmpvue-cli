<template>
  <div class="container">

     <!-- 用户登录测试 -->
    <view class="userinfo">
        <image
            class="userinfo-avatar"
            :src="logged ? userInfo.avatarUrl : '/static/icon/wode1.png'"
            background-size="cover"
        ></image>
        <view>
            <button open-type="getUserInfo" class="userinfo-nickname" v-if="!logged"  @click="bindGetUserInfo">点击测试登录接口</button>
            <text class="userinfo-nickname" v-else>{{userInfo.nickName}}</text>
        </view>
    </view>


    <!-- 上传图片测试 -->
    <view class="uploader">
        <view class="uploader-text" bindtap="doUpload">
            <text>上传图片</text>
        </view>
        <view class="uploader-container" v-if="imgUrl">
            <image
                class="uploader-image"
                :src="imgUrl"
                mode="aspectFit"
                bindtap="previewImg"
            ></image>
        </view>
    </view>


    <!-- 上传图片测试 -->
    <view class="uploader">
        <navigator url="../addCgi/addCgi" open-type="navigate" class="uploader-text">
            <text>快速增加 CGI</text>
        </navigator>
    </view>
  </div>
</template>

<script>
import card from '@/components/card'
import {mapState} from 'vuex'
import qcloud from 'wafer2-client-sdk'
import util from '@/utils'
import config from '@/config'

export default {
  data () {
    return {
        userInfo: {},
        logged: false,
        takeSession: false,
        requestResult: ''
    }
  },
  components: {
    card
  },
  methods: {
    // 用户登录示例
    bindGetUserInfo() {
        if (this.logged) return

        util.showBusy('正在登录')

        qcloud.setLoginUrl(config.loginUrl);
        console.log("config.loginUrl:"+config.loginUrl)
        
        const session = qcloud.Session.get()
        console.log(session)

        // 首次登录
        qcloud.login({
            success: res => {
                this.userInfo= res
                this.logged=true
                util.showSuccess('登录成功')
            },
            fail: err => {
                console.error(err)
                util.showModel('登录错误', err.message)
            }
        })

        // if (session) {
        //     // 第二次登录
        //     // 或者本地已经有登录态
        //     // 可使用本函数更新登录态
        //     qcloud.loginWithCode({
        //         success: res => {
        //             this.userInfo= res
        //             logged=true
        //             util.showSuccess('登录成功')
        //         },
        //         fail: err => {
        //             console.error(err)
        //             util.showModel('登录错误', err.message)
        //         }
        //     })
        // } else {
        //     // 首次登录
        //     qcloud.login({
        //         success: res => {
        //             this.userInfo= res
        //             logged=true
        //             util.showSuccess('登录成功')
        //         },
        //         fail: err => {
        //             console.error(err)
        //             util.showModel('登录错误', err.message)
        //         }
        //     })
        // }
    },

    // 切换是否带有登录态
    switchRequestMode: function (e) {
        this.setData({
            takeSession: e.detail.value
        })
        this.doRequest()
    },

    doRequest: function () {
        util.showBusy('请求中...')
        var that = this
        var options = {
            url: config.service.requestUrl,
            login: true,
            success (result) {
                util.showSuccess('请求成功完成')
                console.log('request success', result)
                that.setData({
                    requestResult: JSON.stringify(result.data)
                })
            },
            fail (error) {
                util.showModel('请求失败', error);
                console.log('request fail', error);
            }
        }
        if (this.data.takeSession) {  // 使用 qcloud.request 带登录态登录
            qcloud.request(options)
        } else {    // 使用 wx.request 则不带登录态
            wx.request(options)
        }
    },

    // 上传图片接口
    doUpload: function () {
        var that = this

        // 选择图片
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function(res){
                util.showBusy('正在上传')
                var filePath = res.tempFilePaths[0]

                // 上传图片
                wx.uploadFile({
                    url: config.service.uploadUrl,
                    filePath: filePath,
                    name: 'file',

                    success: function(res){
                        util.showSuccess('上传图片成功')
                        console.log(res)
                        res = JSON.parse(res.data)
                        console.log(res)
                        that.setData({
                            imgUrl: res.data.imgUrl
                        })
                    },

                    fail: function(e) {
                        util.showModel('上传图片失败')
                    }
                })

            },
            fail: function(e) {
                console.error(e)
            }
        })
    },

    // 预览图片
    previewImg: function () {
        wx.previewImage({
            current: this.data.imgUrl,
            urls: [this.data.imgUrl]
        })
    },

    // 切换信道的按钮
    switchChange: function (e) {
        var checked = e.detail.value

        if (checked) {
            this.openTunnel()
        } else {
            this.closeTunnel()
        }
    },

    openTunnel: function () {
        util.showBusy('信道连接中...')
        // 创建信道，需要给定后台服务地址
        var tunnel = this.tunnel = new qcloud.Tunnel(config.service.tunnelUrl)

        // 监听信道内置消息，包括 connect/close/reconnecting/reconnect/error
        tunnel.on('connect', () => {
            util.showSuccess('信道已连接')
            console.log('WebSocket 信道已连接')
            this.setData({ tunnelStatus: 'connected' })
        })

        tunnel.on('close', () => {
            util.showSuccess('信道已断开')
            console.log('WebSocket 信道已断开')
            this.setData({ tunnelStatus: 'closed' })
        })

        tunnel.on('reconnecting', () => {
            console.log('WebSocket 信道正在重连...')
            util.showBusy('正在重连')
        })

        tunnel.on('reconnect', () => {
            console.log('WebSocket 信道重连成功')
            util.showSuccess('重连成功')
        })

        tunnel.on('error', error => {
            util.showModel('信道发生错误', error)
            console.error('信道发生错误：', error)
        })

        // 监听自定义消息（服务器进行推送）
        tunnel.on('speak', speak => {
            util.showModel('信道消息', speak)
            console.log('收到说话消息：', speak)
        })

        // 打开信道
        tunnel.open()

        this.setData({ tunnelStatus: 'connecting' })
    },

    /**
     * 点击「发送消息」按钮，测试使用信道发送消息
     */
    sendMessage() {
        if (!this.data.tunnelStatus || !this.data.tunnelStatus === 'connected') return
        // 使用 tunnel.isActive() 来检测当前信道是否处于可用状态
        if (this.tunnel && this.tunnel.isActive()) {
            // 使用信道给服务器推送「speak」消息
            this.tunnel.emit('speak', {
                'word': 'I say something at ' + new Date(),
            });
        }
    },

    /**
     * 点击「关闭信道」按钮，关闭已经打开的信道
     */
    closeTunnel() {
        if (this.tunnel) {
            this.tunnel.close();
        }
        util.showBusy('信道连接中...')
        this.setData({ tunnelStatus: 'closed' })
    },

    bindViewTap () {
      const url = '../logs/main'
      wx.switchTab({ url:"/pages/index/main" })
      console.log("bindViewTap")
    },
    getUserInfo () {
      // 调用登录接口
      wx.login({
        success: () => {
          wx.getUserInfo({
            success: (res) => {
              this.userInfo = res.userInfo
            }
          })
        }
      })
    },
    clickHandle (msg, ev) {
      console.log('clickHandle:', msg, ev)
    }
  },

  created () {
    // 调用应用实例的方法获取全局数据
    // this.getUserInfo()
    // console.log("userInfo:")
    // console.log(this.userInfo)
  }
}
</script>

<style scoped>
.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userinfo-avatar {
  width: 128rpx;
  height: 128rpx;
  margin: 20rpx;
  border-radius: 50%;
}

.userinfo-nickname {
  color: #aaa;
}

.usermotto {
  margin-top: 150px;
}

.form-control {
  display: block;
  padding: 0 12px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
}

.counter {
  display: inline-block;
  margin: 10px auto;
  padding: 5px 10px;
  color: blue;
  border: 1px solid blue;
}

/************/
.userinfo, .uploader, .tunnel {
    margin-top: 40rpx;
    height: 140rpx;
    width: 100%;
    background: #FFF;
    border: 1px solid rgba(0, 0, 0, .1);
    border-left: none;
    border-right: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    transition: all 300ms ease;
}

.userinfo-avatar {
    width: 100rpx;
    height: 100rpx;
    margin: 20rpx;
    border-radius: 50%;
}

.userinfo-nickname {
    font-size: 32rpx;
    color: #007AFF;
    background-color: white; 
}

.userinfo-nickname::after {
  border: none;
}

.uploader, .tunnel {
    height: auto;
    padding: 0 0 0 40rpx;
    flex-direction: column;
    align-items: flex-start;
    box-sizing: border-box;
}

.uploader-text, .tunnel-text {
    width: 100%;
    line-height: 52px;
    font-size: 34rpx;
    color: #007AFF;
}

.uploader-container {
    width: 100%;
    height: 400rpx;
    padding: 20rpx 20rpx 20rpx 0;
    display: flex;
    align-content: center;
    justify-content: center;
    box-sizing: border-box;
    border-top: 1px solid rgba(0, 0, 0, .1);
}

.uploader-image {
    width: 100%;
    height: 360rpx;
}

.tunnel {
    padding: 0 0 0 40rpx;
}

.tunnel-text {
    position: relative;
    color: #222;
    display: flex;
    flex-direction: row;
    align-content: center;
    justify-content: space-between;
    box-sizing: border-box;
    border-top: 1px solid rgba(0, 0, 0, .1);
}

.tunnel-text:first-child {
    border-top: none;
}

.tunnel-switch {
    position: absolute;
    right: 20rpx;
    top: -2rpx;
}

.disable {
    color: #888;
}

.service {
    position: fixed;
    right: 40rpx;
    bottom: 40rpx;
    width: 140rpx;
    height: 140rpx;
    border-radius: 50%;
    background: linear-gradient(#007AFF, #0063ce);
    box-shadow: 0 5px 10px rgba(0, 0, 0, .3);
    display: flex;
    align-content: center;
    justify-content: center;
    transition: all 300ms ease;
}

.service-button {
    position: absolute;
    top: 40rpx;
}

.service:active {
    box-shadow: none;
}

.request-text {
    padding: 20rpx 0;
    font-size: 24rpx;
    line-height: 36rpx;
    word-break: break-all;
}
</style>
