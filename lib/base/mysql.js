"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.page = exports.query = exports.transaction = exports.connect = exports.init = exports.MySql = exports.Connection = void 0;
const mysql_1 = __importDefault(require("mysql"));
/**
 * 数据库链接对象
 */
class Connection {
    conn;
    constructor(conn) {
        this.conn = conn;
    }
    /**
     * 执行一次sql查询
     * @param {string} sql SQL语句
     * @param {boolean} logsql 是否打印SQL语句
     * @returns {any} 查询结果集
    */
    async query(sql, logsql = true) {
        if (logsql) {
            console.log(`db: ${sql}`);
        }
        let ret = await new Promise((resolve, reject) => {
            this.conn.query(sql, (err, ret) => {
                if (err) {
                    return reject(err);
                }
                return resolve(ret);
            });
        });
        return ret;
    }
    /**
     * 执行一次分页查询
     * @param {string} sql SQL语句
     * @param {number} page 当前页码，从1开始。
     * @param {number} size 每页的数据条数
     * @returns {any} 查询结果集
    */
    async page(sql, page, size) {
        let has_limit = sql.indexOf('limit') >= 0 ||
            sql.indexOf('LIMIT') >= 0;
        if (!has_limit) {
            if (page >= 0 && size > 0) {
                if (sql.endsWith(';')) {
                    sql = sql.substr(0, sql.length - 1);
                }
                sql = `${sql} limit ${(page - 1) * size}, ${size};`;
            }
        }
        let calc_sql_found_rows = sql.indexOf('sql_calc_found_rows') > 0 ||
            sql.indexOf('SQL_CALC_FOUND_ROWS') > 0;
        if (!calc_sql_found_rows) {
            let results = await this.query(sql);
            return {
                list: results || [],
                count: results.length || 0,
            };
        }
        await this.transaction();
        let rsList = await this.query(sql);
        let rsCount = await this.query(`select FOUND_ROWS() as 'count';`);
        await this.commit();
        return {
            list: rsList,
            count: rsCount.length > 0 ? rsCount[0].count : 0
        };
    }
    ;
    /**
     * 开启事务
    */
    async transaction() {
        await new Promise((resolve, reject) => {
            this.conn.beginTransaction((err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
    /**
     * 提交事务
    */
    async commit() {
        await new Promise((resolve, reject) => {
            this.conn.commit((err) => {
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        });
    }
    /**
     * 回滚事务
    */
    async rollback() {
        await new Promise((resolve, reject) => {
            this.conn.rollback((err) => {
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        });
    }
    ;
    /**
     * 释放连接
    */
    release() {
        this.conn.release();
        this.conn = null;
    }
}
exports.Connection = Connection;
/**
 * mysql数据库访问对象
*/
class MySql {
    pool = null;
    /**
     * 构造器
    */
    async init(options) {
        options = options || {};
        this.pool = mysql_1.default.createPool({
            host: options.host || '127.0.0.1',
            port: options.port || 3306,
            user: options.user || 'root',
            password: options.password || '',
            database: options.database,
            charset: options.charset
        });
    }
    /**
     * 连接数据库
     * @param {boolean} transaction 开启事务
     * @returns {Connection} 数据库连接对象
    */
    async connect(transaction = false) {
        return await new Promise((resolve, reject) => {
            this.pool.getConnection((err, conn) => {
                if (err) {
                    return reject(err);
                }
                if (!transaction) {
                    return resolve(new Connection(conn));
                }
                conn.beginTransaction((err) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(new Connection(conn));
                });
            });
        });
    }
    /**
     * 连接数据库并开启事务。
    */
    async transaction() {
        return await this.connect(true);
    }
    /**
     * 连接数据库，执行一次SQL查询，并自动释放连接。
     * @param {string} sql SQL语句
     * @param {boolean} logsql 是否打印SQL语句
     * @returns {any} 查询结果集
    */
    async query(sql, logsql = true) {
        let conn = await this.connect();
        let ret = await conn.query(sql, logsql);
        conn.release();
        return ret;
    }
    /**
     * 连接数据库，执行一次分页查询，并自动释放连接。
     * @param {string} sql SQL语句
     * @param {number} page 当前页码，从1开始。
     * @param {number} size 每页的数据条数
     * @returns {any} 查询结果集
    */
    async page(sql, page, size) {
        let conn = await this.connect();
        let ret = await conn.page(sql, page, size);
        conn.release();
        return ret;
    }
}
exports.MySql = MySql;
const db = new MySql();
/**
 * 初始化全局MySql对象
*/
const init = async function (options) {
    return await db.init(options);
};
exports.init = init;
/**
  * 连接数据库
  * @param {boolean} transaction 开启事务
  * @returns {Connection} 数据库连接对象
 */
const connect = async function (transaction = false) {
    return await db.connect(transaction);
};
exports.connect = connect;
/**
 * 连接数据库并开启事务。
*/
const transaction = async function () {
    return await db.connect(true);
};
exports.transaction = transaction;
/**
 * 连接数据库，执行一次SQL查询，并自动释放连接。
 * @param {string} sql SQL语句
 * @param {boolean} logsql 是否打印SQL语句
 * @returns {any} 查询结果集
*/
const query = async function (sql, logsql = true) {
    return await db.query(sql, logsql);
};
exports.query = query;
/**
 * 连接数据库，执行一次分页查询，并自动释放连接。
 * @param {string} sql SQL语句
 * @param {number} page 当前页码，从1开始。
 * @param {number} size 每页的数据条数
 * @returns {any} 查询结果集
*/
const page = async function (sql, page, size) {
    return await db.page(sql, page, size);
};
exports.page = page;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXlzcWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYmFzZS9teXNxbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxrREFBMEI7QUFnQzFCOztHQUVHO0FBQ0gsTUFBYSxVQUFVO0lBQ1gsSUFBSSxDQUFDO0lBRWIsWUFBWSxJQUFTO1FBQ2pCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ3JCLENBQUM7SUFFRDs7Ozs7TUFLRTtJQUNLLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBVyxFQUFFLFNBQWtCLElBQUk7UUFDbEQsSUFBSSxNQUFNLEVBQUU7WUFDUixPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUMsQ0FBQztTQUM3QjtRQUVELElBQUksR0FBRyxHQUFHLE1BQU0sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDNUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO2dCQUM5QixJQUFJLEdBQUcsRUFBRTtvQkFDTCxPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDdEI7Z0JBQ0QsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDeEIsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztJQUVEOzs7Ozs7TUFNRTtJQUNLLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBVyxFQUFFLElBQVksRUFBRSxJQUFZO1FBQ3JELElBQUksU0FBUyxHQUNULEdBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztZQUN6QixHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUU5QixJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ1osSUFBSSxJ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