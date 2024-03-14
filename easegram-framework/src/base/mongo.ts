import {MongoClient, MongoClientOptions, Db, Document, WithId} from 'mongodb';
import { error } from './common';

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

export class Mongo {
    private _options: MongoOptions;
    private _client: MongoClient;

    constructor(options: MongoOptions) {
        if (!options.uri) {
            throw error('ERR_MONGODB_CONNECTION', 'Mongodb connection uri must be required.');
        }
        if (!options.database) {
            throw error('ERR_MONGODB_DATABASE', 'Mongodb database must be set.');
        }
        this._options = options;
    }

    /**
     * 获取当前连接参数
     */
    public get options() {
        return this._options;
    }

    /**
     * 获取当前客户端
     */
    public get client() {
        return this._client;
    }

    /**
     * 获取当前连接状态
     */
    public get isConnected() {
        return !!this._client;
    }

    /**
     * 连接MongoDB
     */
    public async connect() : Promise<void> {
        if (this._client) {
            return;
        }

        const { uri, database, ...options } = this.options;
        try {
            this._client = new MongoClient(uri, options);
            await this._client.connect();
        } catch (err: any) {
            this._client = null;
            throw error('ERR_MONGODB_CONNECTION', err.message);
        }
    }

    /**
     * 关闭MongoDB连接
     * @param force
     */
    public async close(force?: boolean): Promise<void> {
        if (!this.client) { return; }
        return this.client.close(force);
    }

    /**
     * MongoDB查询方法
     * @param condition 查询语句方法
     */
    public async query<T>(condition: (db: Db) => Promise<T>): Promise<T> {
        const { client, options } = this;
        if (!client || !options) {
            throw error('ERR_MONGODB_INIT', 'Mongodb is not init.')
        }
        if (!condition) { return; }
        const db = client.db(options.database);
        return condition(db);
    }
}

export function toObject<T>(doc: WithId<Document>) : T {
    const obj : Partial<T> = {};

    for(const key in doc) {
        if(doc.hasOwnProperty(key)) {
            obj[key as keyof T] = doc[key] as any as T[keyof T];
        }
    }

    return obj as T;
}

export function toArray<T>(docs: WithId<Document>[]) : T[] {
    const list = new Array<T>();

    for(const doc of docs) {
        const obj = toObject<T>(doc);
        list.push(obj);
    }

    return list;
}
