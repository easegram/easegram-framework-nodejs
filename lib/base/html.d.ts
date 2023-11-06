/// <reference types="node" />
/**
 * HTTP响应数据
*/
type HttpResponseOptions = {
    status: number;
    headers: {
        [key: string]: string | number;
    };
    content: string | Buffer;
};
/**
 * 对http响应数据进行解压。如果http响应数据采用了gzip压缩，就进行解压，否则什么都不做。
*/
export declare const decompress: (res: HttpResponseOptions) => Promise<HttpResponseOptions>;
/**
 * 对http响应数据进行解码。如果http响应数据采用了特殊编码格式就进行解码，否则什么都不做。
*/
export declare const decode: (res: HttpResponseOptions) => Promise<HttpResponseOptions>;
/**
 * 对HTML字符串中的特殊字符进行转义。
*/
export declare const escape: (html: string) => Promise<string>;
export {};
