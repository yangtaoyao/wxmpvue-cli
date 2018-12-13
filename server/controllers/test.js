const db = require('../models/db')
const getTest = async (ctx, next) => {
    const rows = await db.query(`select * from test`, [])
    console.log(rows)
    ctx.state.code = 1
    ctx.state.data = rows
}
module.exports = {
    getTest
}
