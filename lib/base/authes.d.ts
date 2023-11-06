/**
 * Token的session数据
*/
export interface TokenSession {
    /**
     * 绑定的业务数据
    */
    data: any;
    /**
     * 生成时间
    */
    time: number;
    /**
     * 有效时长
    */
    life: number;
}
/**
 * Token,这是一个简易的对称加密token工具类。用于实现用户身份的鉴别。
 * 一个典型的token表现为一段被加密的字符串，加密串内含用于身份鉴别和
 * 安全校验的信息。
*/
export declare class Token {
    private secret;
    private timeout;
    /**
     * 构造器
     * @param {string} secret 用于加密的密钥
     * @param {number} timeout token的过期时长，单位为秒。
    */
    constructor(secret: string, timeout: number);
    /**
     * 对数据进行签名
    */
    sign(data: any): string;
    /**
     * 生成token字符串
     * @param {any} data 暂存在token中的数据，尽量简短。
     * @returns {string} token密文字符串，可以传递给客户端。
    */
    make(data: any): string;
    /**
     * 解密并验证token。如果验证成功，返回token中保存的数据。
     * 如果验证失败，则返回undefined。
     * @param {string} token 待验证的token字符串
     * @returns {TokenSession} token的sessio信息
    */
    check(token: string): TokenSession;
}
/**
 * 验证码session信息
*/
export interface CodeSession {
    /**
     * 发送类型
    */
    type: string;
    /**
     * 发送目标，邮箱地址或手机好吗。
    */
    to: string;
    /**
     * 验证码字符串
    */
    code: string;
    /**
     * 生成时间
    */
    time: number;
    /**
     * 有效时长
    */
    life: number;
}
/**
 * 验证码
 * * 此类用于创建验证码对象。验证码对象可识别用户操作是否属于本人。
 * * 验证码是一串有限长度（通常是4-8个）的数字字符串。验证码生成后可发到用户信任的手机或邮箱。
 * * 验证码都有时效性，超时后验证码将会失效，失效的验证码将不会通过检查。
 * * 此类只用于生成验证码字符串或检查验证码字符串的合法性。如果期望发送手机短信或邮件需要专门
 * 的模块（sms或smtp）进行。
*/
export declare class Code {
    private length;
    private timeout;
    private sessions;
    private interval;
    /**
     * 构造器
     * @param {number} length 验证码的长度，一般为4-8.
     * @param {number} timeout 验证码的有效期，单位为秒。
    */
    constructor(length: number, timeout: number);
    /**
     * 生成验证码
     * @param {string} type 验证码的发送类型，email|sms.
     * @param {string} to 发送目标，如果验证发的发送类型是email，这里是
     * 对应的邮箱地址，如果验证码发送类型为sms，这里就是对应的手机号码。
     * @returns {string} 生成的验证码字符串。
    */
    make(type: string, to: string): string;
    /**
     * 检查验证码
     * @param {string} type 验证码的发送类型，email|sms.
     * @param {string} to 发送目标，如果验证发的发送类型是email，这里是
     * 对应的邮箱地址，如果验证码发送类型为sms，这里就是对应的手机号码。
     * @returns {CodeSession} 如果通过检查，返回此发送目标对应验证码的session信息。
    */
    check(type: string, to: string): CodeSession;
    /**
     * 清空所有验证码，此操作会让暂存的待检查的验证码全部丢失，
     * 后续基于这些验证码的检查操作都会失败。
    */
    clear(): void;
}
/**
 * 验证键的session信息
*/
export interface KeySession {
    /**
     * session的唯一key编号
    */
    key: string;
    /**
     * 与key绑定的业务数据
    */
    data: any;
    /**
     * 生成时间
    */
    time: number;
    /**
     * 有效时长
    */
    life: number;
}
/**
 * 验证键
 * * 验证键是一种特殊的验证码。它和普通验证码的区别是能保证唯一性。
 * * 这种唯一性不是全局唯一，是在所有已经生成但未检查的编码中的唯一，
 * 即如果现已经生成1000个编码都还未检查也未失效，新生成的验证键值能保证与
 * 当前这1000个键值都不同。
*/
export declare class Key {
    private length;
    private timeout;
    private sessions;
    private interval;
    /**
     * 构造器
     * @param {number} length 长度，为了保证唯一，在特定的场景可以自行设定。
     * @param {number} timeout 有效时长，单位为秒。
     */
    constructor(length: number, timeout: number);
    /**
     * 生成键值
     * @param {any} data 与键值绑定的信息。
     * @returns {string} 键值字符串
    */
    make(data: any): string;
    /**
     * 检查键值
     * @param {string} key 待检查的键值字符串
     * @returns {KeySession} 与此键值的session数据，如果检查失败返回undefined。
    */
    check(key: string): KeySession;
    /**
     * 清空所有键值，此操作会让所有已经生成但未检查的键值全部丢失，
     * 后续针对这些键值的检查操作都会失败。
    */
    clear(): void;
}
