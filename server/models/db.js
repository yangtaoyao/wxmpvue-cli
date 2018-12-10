const mysql = require('mysql')
const pool = require('./pool')

/**
 * @param {String Array} sql 或 [{sql: ``, params: []}, {sql: ``, params: []}, ...]
 * @param {Array} arr
 */
exports.query = (sql, arr) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) reject(err)
            // connection -> 在连接池中申请到的，可用的 连接资源
            connection.query(sql, arr, (err, results, fields) => {
                // 释放资源 -> 把当前的连接资源返回给连接池
                connection.release()
                if (err) reject(err)
                resolve(results)
            })
        })
    })
}

// 防止sql注入
exports.escape = params => mysql.escape(params)

// 格式化sql语句
exports.format = (sql, arr) => mysql.format(sql, arr)
