/**
 * 通用操作结果封包。此结构用于对操作结果数据传输和交换的封装。
*/
export interface CommonOperationPacket {
    /**
     * 操作结果，ok表示无错误，否则是错误名称。
    */
    result: 'ok' | string;
    /**
     * 数据，如果无错误表示结果数据，有错误则是错误信息。
    */
    data: any;
}
/**
 * 包装函数参数到一个通用操作封包对象，此函数可能的使用场景如下：
 * ```
 * makeCOP(err);
 * makeCOP(ret);
 * makeCOP(null, ret);
 * ```
*/
export declare const make: (arg0: any, arg1?: any) => CommonOperationPacket;
