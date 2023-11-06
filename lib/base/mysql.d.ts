/**
 * mysql选项
*/
export type MySqlOptions = {
    /**
     * mysql主机，IP或域名。
    */
    host: string;
    /**
     * 端口号，默认3306.
    */
    port: number;
    /**
     * 数据库服务的用户名
    */
    user: string;
    /**
     * 数据库服务的用户密码
    */
    password: string;
    /**
     * 选择的数据库名称
    */
    database: string;
    /**
     * 字符集
    */
    charset?: string;
};
/**
 * 数据库链接对象
 */
export declare class Connection {
    private conn;
    constructor(conn: any);
    /**
     * 执行一次sql查询
     * @param {string} sql SQL语句
     * @param {boolean} logsql 是否打印SQL语句
     * @returns {any} 查询结果集
    */
    query(sql: string, logsql?: boolean): Promise<any>;
    /**
     * 执行一次分页查询
     * @param {string} sql SQL语句
     * @param {number} page 当前页码，从1开始。
     * @param {number} size 每页的数据条数
     * @returns {any} 查询结果集
    */
    page(sql: string, page: number, size: number): Promise<any>;
    /**
     * 开启事务
    */
    transaction(): Promise<void>;
    /**
     * 提交事务
    */
    commit(): Promise<void>;
    /**
     * 回滚事务
    */
    rollback(): Promise<void>;
    /**
     * 释放连接
    */
    release(): void;
}
/**
 * mysql数据库访问对象
*/
export declare class MySql {
    private pool;
    /**
     * 构造器
    */
    init(options: MySqlOptions): Promise<void>;
    /**
     * 连接数据库
     * @param {boolean} transaction 开启事务
     * @returns {Connection} 数据库连接对象
    */
    connect(transaction?: boolean): Promise<Connection>;
    /**
     * 连接数据库并开启事务。
    */
    transaction(): Promise<Connection>;
    /**
     * 连接数据库，执行一次SQL查询，并自动释放连接。
     * @param {string} sql SQL语句
     * @param {boolean} logsql 是否打印SQL语句
     * @returns {any} 查询结果集
    */
    query(sql: string, logsql?: boolean): Promise<any>;
    /**
     * 连接数据库，执行一次分页查询，并自动释放连接。
     * @param {string} sql SQL语句
     * @param {number} page 当前页码，从1开始。
     * @param {number} size 每页的数据条数
     * @returns {any} 查询结果集
    */
    page(sql: string, page: number, size: number): Promise<any>;
}
/**
 * 初始化全局MySql对象
*/
export declare const init: (options: MySqlOptions) => Promise<void>;
/**
  * 连接数据库
  * @param {boolean} transaction 开启事务
  * @returns {Connection} 数据库连接对象
 */
export declare const connect: (transaction?: boolean) => Promise<Connection>;
/**
 * 连接数据库并开启事务。
*/
export declare const transaction: () => Promise<Connection>;
/**
 * 连接数据库，执行一次SQL查询，并自动释放连接。
 * @param {string} sql SQL语句
 * @param {boolean} logsql 是否打印SQL语句
 * @returns {any} 查询结果集
*/
export declare const query: (sql: string, logsql?: boolean) => Promise<any>;
/**
 * 连接数据库，执行一次分页查询，并自动释放连接。
 * @param {string} sql SQL语句
 * @param {number} page 当前页码，从1开始。
 * @param {number} size 每页的数据条数
 * @returns {any} 查询结果集
*/
export declare const page: (sql: string, page: number, size: number) => Promise<any>;
