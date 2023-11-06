/**
 * 日志模块回调函数
 * @param {string} tag 日志的前缀标签
 * @param {string} message 日志内容
 */
export type LogHandlerInfo = (tag: string, message: string) => void;
/**
 * 日志服务器配置参数
 */
export interface LogServerInfo {
    /**
     * 日志服务器链接
     */
    url: string;
    /**
     * Appid
     */
    appid: string;
    /**
     * 密钥
     */
    secret: string;
    /**
     * 日志上报时间间隔
     */
    interval?: number;
}
/**
 * 日志配置
 */
export interface LogOptions {
    /**
     * 日志的前缀标签
     */
    scope: string;
    /**
     * 服务器配置
     */
    server?: LogServerInfo;
    /**
     * 日志回调
     */
    handler?: LogHandlerInfo;
}
/**
 * 初始化日志模块
 * @param {string} scope 日志的前缀标签
*/
export declare const init: (options: string | LogOptions) => void;
