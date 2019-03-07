const db = require('../models/db')
const addTask = async (ctx, next) => {
    // const data = ctx.query
    // koa-bodyparser中间件可以把koa2上下文的formData数据解析到ctx.request.body中
    const data = ctx.request.body
    console.log(data)
    const rows = await db.query(`insert into sign_task values(null,?,?,?)`, [data.title, data.start_date, data.end_date])

    ctx.state.code = 1
    ctx.state.data = rows
}
module.exports = {
    addTask
}
