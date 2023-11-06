import koa from 'koa';
import koaRouter from 'koa-router';
/**
 * koa中间件类型
*/
export type WebMiddleWare = (ctx: any, next: any) => any;
/**
 * Web应用参数
*/
export interface WebAppArgs {
    /**
     * 名称
    */
    name: string;
    /**
     * 主机，IP或域名
    */
    host: string;
    /**
     * 端口号
    */
    port: number;
    /**
     * https服务主机，IP或域名
    */
    https_host?: string;
    /**
     * https服务端口
    */
    https_port?: number;
    /**
     * https服务证书文件路径
    */
    https_cert?: string;
    /**
     * https服务证书密钥文件路径
     */
    https_key?: string;
    /**
     * 是否开启hsts
    */
    https_hsts?: boolean;
    /**
     * 是否开启http2
    */
    http2?: boolean;
    /**
     * 是否启用请求日志记录功能，开启后会在控制台输出请求信息。
    */
    log?: boolean;
    /**
     * 是否开启跨域控制
    */
    cors?: boolean;
    /**
     * 是否开启代理模式
    */
    proxy?: boolean;
    /**
     * body解析器设置
     * * false：禁用body解析。
     * * object：配置body解析器参数，详细参考body模块说明。
     * * middleware：使用自定义中间件自行解析body。
     * * 其他情况：使用默认的body解析设置。
    */
    body?: boolean | object | WebMiddleWare;
    /**
     * 通用的/_ping路由配置
     * * 启用此项配置会添加一个默认的通用的/_ping路由。
     * * /_ping路由通常用于网络诊断服务检查此服务可用性。
     * * 所有以 /_ 开始的都是内部路由。
    */
    ping?: boolean;
}
/**
 * WebApp
 * * Web服务端应用，从Koa继承而来。
 */
export declare class WebApp extends koa {
    /**
     * https监听。
     */
    listenSafely: (...args: any) => void;
    /**
     * 静态资源服务。
     */
    static: (...args: any) => void;
    /**
     * 路由注册。
     */
    route: (func: (router: koaRouter) => void) => void;
    /**
     * 启动服务
     */
    start: () => void;
}
/**
 * 创建一个基于koa2的web应用。
*/
export declare const webapp: (args: WebAppArgs) => WebApp;
/**
 * 创建一个body解析器中间件，详细选项设置请参考body模块。
*/
export declare const body: (options: object) => WebMiddleWare;
/**
 * 发送http响应
*/
export declare const send: (ctx: any, arg1: any, arg2?: any) => void;
/**
 * 发送文件的选项
*/
export type SendFileOptions = {
    /**
     * 是否启用brotli，brotli相关信息请自行参考文献。
    */
    brotli: boolean;
    /**
     * 是否启用gzip压缩
    */
    gzip: boolean;
    /**
     * http缓存控制的maxAge属性
    */
    maxAge: number;
    /**
     * http缓存控制的immutable属性
    */
    immutable: boolean;
};
/**
 * 发送响应文件。
*/
export declare const sendFile: (ctx: any, filepath: string, options: SendFileOptions) => Promise<void>;
/**
 * 将func函数包装成一个中间件
*/
export declare const handler: (func: (args: object) => any) => WebMiddleWare;
