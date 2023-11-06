"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mongo = void 0;
const mongodb_1 = require("mongodb");
const common_1 = require("./common");
__exportStar(require("mongodb"), exports);
class Mongo {
    _options;
    _client;
    constructor(options) {
        if (!options.uri) {
            throw (0, common_1.error)('ERR_MONGODB_CONNECTION', 'Mongodb connection uri must be required.');
        }
        if (!options.database) {
            throw (0, common_1.error)('ERR_MONGODB_DATABASE', 'Mongodb database must be set.');
        }
        this._options = options;
    }
    /**
     * MongoDB查询方法
     * @param condition 查询语句方法
     */
    async query(condition) {
        const { _client, _options } = this;
        if (!_client || !_options) {
            throw (0, common_1.error)('ERR_MONGODB_INIT', 'Mongodb is not init.');
        }
        if (!condition) {
            return;
        }
        const db = _client.db(_options.database);
        return condition(db);
    }
    /**
     * 连接MongoDB
     */
    async connect() {
        if (this._client) {
            return this;
        }
        const { uri, database, ...options } = this._options;
        this._client = new mongodb_1.MongoClient(uri, options);
        try {
            await this._client.connect();
        }
        catch (err) {
            throw (0, common_1.error)('ERR_MONGODB_CONNECTION', err.message);
        }
        return this;
    }
    /**
     * 关闭MongoDB连接
     * @param force
     */
    async close(force) {
        if (!this._client) {
            return;
        }
        if (!this.isConnected) {
            return;
        }
        return this._client.close(force);
    }
    /**
     * 获取当前连接参数
     */
    get options() {
        return this._options;
    }
    /**
     * 获取当前客户端
     */
    get client() {
        return this._client;
    }
    /**
     * 获取当前连接状态
     */
    get isConnected() {
        return !!this._client;
    }
}
exports.Mongo = Mongo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9uZ28uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYmFzZS9tb25nby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFDQUE4RDtBQUM5RCxxQ0FBaUM7QUFFakMsMENBQXdCO0FBYXhCLE1BQWEsS0FBSztJQUVOLFFBQVEsQ0FBZTtJQUV2QixPQUFPLENBQWM7SUFFN0IsWUFBWSxPQUFxQjtRQUM3QixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRTtZQUNkLE1BQU0sSUFBQSxjQUFLLEVBQUMsd0JBQXdCLEVBQUUsMENBQTBDLENBQUMsQ0FBQztTQUNyRjtRQUNELElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFO1lBQ25CLE1BQU0sSUFBQSxjQUFLLEVBQUMsc0JBQXNCLEVBQUUsK0JBQStCLENBQUMsQ0FBQztTQUN4RTtRQUNELElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO0lBQzVCLENBQUM7SUFFRDs7O09BR0c7SUFDSSxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQW1DO1FBQ2xELE1BQU0sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ25DLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDdkIsTUFBTSxJQUFBLGNBQUssRUFBQyxrQkFBa0IsRUFBRSxzQkFBc0IsQ0FBQyxDQUFBO1NBQzFEO1FBQ0QsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUFFLE9BQU87U0FBRTtRQUMzQixNQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN6QyxPQUFPLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN6QixDQUFDO0lBRUQ7O09BRUc7SUFDSSxLQUFLLENBQUMsT0FBTztRQUNoQixJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDZCxPQUFPLElBQUksQ0FBQztTQUNmO1FBRUQsTUFBTSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsR0FBRyxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3BELElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxxQkFBVyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUU3QyxJQUFJO1lBQ0EsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQ2hDO1FBQUMsT0FBTyxHQUFRLEVBQUU7WUFDZixNQUFNLElBQUEsY0FBSyxFQUFDLHdCQUF3QixFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUN0RDtRQUVELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRDs7O09BR0c7SUFDSSxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQWU7UUFDOUIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFBRSxPQUFPO1NBQUU7UUFDOUIsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFBRSxPQUFPO1NBQUU7UUFDbEMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUFXLE9BQU87UUFDZCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDekIsQ0FBQztJQUVEOztPQUVHO0lBQ0gsSUFBVyxNQUFNO1FBQ2IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3hCLENBQUM7SUFFRDs7T0FFRztJQUNILElBQVcsV0FBVztRQUNsQixPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQzFCLENBQUM7Q0FDSjtBQWhGRCxzQkFnRkMifQ==