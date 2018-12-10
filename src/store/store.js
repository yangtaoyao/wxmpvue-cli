// state -> 真正存储数据的地方
const state = {
    num:0,
    userList:[]
}

// 派发 action对象 到 mutation 中, 可以实现异步操作(ajax) 但是 不能修改 state 数据
const actions = {
    // 底层会注入一个实参context(执行上下文)对象，通过es6参数的结构赋值，拿到 commit, state
    // { commit: fn, state: 数据 }
    // params -> 调用方法时，我们自己的实参
    addNum({ commit, state }, params){
        // console.log(commit, state, params)
        // 提交 action 到 mutation
        // action -> { type, data }
        commit({
            type: 'ADD_NUM', // type 的值，就是 mutation 下的方法名
            data: params
        })
    },
    async getInfoList({ commit, state }, params){
        // 优化 ajax 请求 -> 如果数据已经有了，就不需要再发请求了
        if (state.userList.length) return
        const res = await getInfo()
        console.log(res)
    }

}

// 真正改变 state数据 的地方, 它是一个纯函数，不能进行异步操作
const mutations = {
    ADD_NUM(state, { data }){
        state.num = state.num + 1
    }
}

// 获取 state 数据 的方法, 可以存在一定的业务逻辑，对 state 数据进行过滤和筛选
const getters = {
    percent(state){
        console.log(state)
        // return state.num/100 + '%'
        return `${state.num / 100}%`
    }
}

export default{
    state,
    actions,
    mutations,
    getters
}