import request from './request'

// 测试接口
export const getTest = () => request.get('/test')
export const addTask = (params) => request.post('/addTask',params)


