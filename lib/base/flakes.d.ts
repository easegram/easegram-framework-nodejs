/**
 * 雪花算法唯一编码生成器
 * * 此类采用flake算法生成唯一编码。
 * * 此类能同时支持156个节点，每个节点每毫秒生成2^24个唯一编码。
 * * 此类生成的唯一编码是一个由20个十六进制字符组成的串。
*/
declare class Flake {
    private nodeId;
    private start;
    private seq;
    /**
     * 构造器
     * @param {number} nodeId 节点ID，0-255.
    */
    constructor(nodeId: number);
    /**
     * 获取编号
    */
    get(): string;
}
/**
 * 创建一个flake对象
 * @param {number} 节点编号，0-255.
 * @returns {Flake} 雪花算法唯一编码生成器对象
*/
export declare const create: (nodeId?: number) => Flake;
export {};
