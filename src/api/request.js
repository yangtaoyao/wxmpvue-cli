import  Fly from "flyio/dist/npm/wx" //wx.js为您下载的源码文件
import config from '../config'
const fly=new Fly() //创建fly实例
import util from '../utils'

fly.config.timeout=10000;
//设置请求基地址
fly.config.baseURL=config.baseUrl

// 添加请求拦截器
fly.interceptors.request.use(request => {
    wx.showLoading({ title: '加载中...' })
    return request
})

// 添加响应拦截器
fly.interceptors.response.use(
    response => {
        wx.hideLoading()
        return response.data
    },
    err => {
        wx.hideLoading()
        console.log(err)
        util.showModel('请求失败', err)
    }
)
export default fly