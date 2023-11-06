import { MongoClient, MongoClientOptions, Db } from 'mongodb';
export * from 'mongodb';
export interface MongoOptions extends MongoClientOptions {
    /**
     * 数据库连接地址
     */
    uri: string;
    /**
     * 数据库名称
     */
    database: string;
}
export declare class Mongo {
    private _options;
    private _client;
    constructor(options: MongoOptions);
    /**
     * MongoDB查询方法
     * @param condition 查询语句方法
     */
    query(condition: (db: Db) => Promise<any>): Promise<any>;
    /**
     * 连接MongoDB
     */
    connect(): Promise<Mongo>;
    /**
     * 关闭MongoDB连接
     * @param force
     */
    close(force?: boolean): Promise<void>;
    /**
     * 获取当前连接参数
     */
    get options(): MongoOptions;
    /**
     * 获取当前客户端
     */
    get client(): MongoClient;
    /**
     * 获取当前连接状态
     */
    get isConnected(): boolean;
}
