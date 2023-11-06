/// <reference types="node" />
/**
 * 用指定hash算法计算data的hash编码。
 * @param {string} alg hash算法的名称
 * @param {string|Buffer} data 用来做hash计算的数据
 * @returns {string} data的hash值
*/
export declare const hash: (alg: string, data: string | Buffer) => string;
/**
 * 计算data的md5值
 * @param {string|Buffer} data 用于做md5计算的数据
 * @returns {string} data的md5值
*/
export declare const md5: (data: string | Buffer) => string;
/**
 * 计算data的sha256值
 * @param {string | Buffer} data 用于计算sha256的数据
 * @returns {string} data的sha256值
*/
export declare const sha256: (data: string | Buffer) => string;
/**
 * 使用aes-256-cbc算法对数据进行编码
 * @param {string} key 用于加密的密钥
 * @param {string} content 被加密的数据
 * @returns {string} 加密后的密文
 */
export declare const encode_aes_256_cbc: (key: string, content: string) => string;
/**
 * 对一串使用aes-256-cbc算法加密的密文进行解码
 * @param {string} key 解密密钥
 * @param {string} content 密文数据
 * @returns {string} 解码后的数据
*/
export declare const decode_aes_256_cbc: (key: string, content: string) => string;
/**
 * 对数据进行base64编码
 * @param {string} content 用于base64编码的数据
 * @returns {string} base64字符串
*/
export declare const encode_base64: (content: string) => string;
/**
 * 对base64编码的字符串进行解码
 * @param {string} content base64编码字符串
 * @returns {string} base64解码后的数据
*/
export declare const decode_base64: (content: string) => string;
/**
 * 将一段十六进制的字符串进行base64编码
 * @param {string} content 十六进制字符串
 * @returns 编码后的数据
*/
export declare const encode_hex64: (content: string) => string;
/**
 * 对一段被base64编码过的十六进制字符串进行解码
 * @param {string} content base64字符串
 * @returns {string} 十六进制字符串
*/
export declare const decode_hex64: (content: string) => string;
/**
 * 获取一个随机字符串（random string）
 * @param {number} length 随机字符串的长度
 * @param {char[]} characters 随机字符串的字符表，随机字符串中的所有字符将从此自负表中随机抽取。
 * @returns {string} 随机字符串
*/
export declare const rs: (len: number, characters: string[]) => string;
/**
 * 获取一个十进制的随机数字字符串（random string of digit）
 * @param {number} len 字符串的长度
 * @returns {string} 随机十进制数字字符串
*/
export declare const rsod: (len: number) => string;
/**
 * 获取一个十六进制的随机数字字符串（random string of hex）
 * @param {number} len 字符串的长度
 * @returns {string} 随机十六进制数字字符串
*/
export declare const rsox: (len: number) => string;
/**
 * 获取一个随机字母字符串（random string of alpha）
 * @param {number} len 字符串的长度
 * @returns {string} 随机字母字符串
*/
export declare const rsoa: (len: number) => string;
/**
 * 获取一个由数字、字母组成的随机字符串（random string of word）
 * @param {number} len 字符串的长度
 * @returns {string} 由数字、字母组成的随机字符串.
*/
export declare const rsow: (len: number) => string;
/**
 * 获取一个由可打印字符组成的随机字符串（random string of printable)
 * @param {number} len 字符串长度
 * @returns {string} 一个由可打印字符组成的随机字符串
*/
export declare const rsop: (len: number) => string;
