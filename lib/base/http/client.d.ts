import { HttpRequestOptions, HttpResponseOptions } from './basic';
/**
 * 将url解析成通用的请求选项参数。
*/
export declare const getRequestOptions: (optionsOrUrl: string | HttpRequestOptions) => HttpRequestOptions;
/**
 * 发起一次HTTP请求
*/
export declare const request: (options: HttpRequestOptions, data: any) => Promise<HttpResponseOptions>;
/**
 * 发起一次HTTP的GET请求。
*/
export declare const get: (args: string | HttpRequestOptions, data: any) => Promise<HttpResponseOptions>;
/**
 * 发起一次HTTP的POST请求。
*/
export declare const post: (args: string | HttpRequestOptions, data: any) => Promise<HttpResponseOptions>;
/**
 * 调用一次HTTP接口。HTTP接口统一采用POST方式进行通讯。
*/
export declare const call: (args: string | HttpRequestOptions, data: any) => Promise<any>;
/**
 * 定义一组以base地址开头的接口列表，返回接口对象。接口对象会被转换成驼峰命名。
*/
export declare const makeRPC: (base: string, rps: {
    [key: string]: string[];
}) => object;
/**
 * 定义一组以base地址开头的接口列表，返回接口对象。接口对象会被转换成驼峰命名。
*/
export declare const rpc: (base: string, rps: {
    [key: string]: string[];
}) => object;
