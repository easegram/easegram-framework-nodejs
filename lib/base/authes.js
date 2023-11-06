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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Key = exports.Code = exports.Token = void 0;
const crypto = __importStar(require("./crypto"));
/**
 * Token,这是一个简易的对称加密token工具类。用于实现用户身份的鉴别。
 * 一个典型的token表现为一段被加密的字符串，加密串内含用于身份鉴别和
 * 安全校验的信息。
*/
class Token {
    secret;
    timeout;
    /**
     * 构造器
     * @param {string} secret 用于加密的密钥
     * @param {number} timeout token的过期时长，单位为秒。
    */
    constructor(secret, timeout) {
        if (typeof (secret) !== 'string' || secret === '') {
            secret = '^dU~sTmYV$DjC&b*';
        }
        if (typeof (timeout) !== 'number') {
            timeout = 0;
        }
        this.secret = secret;
        this.timeout = timeout;
    }
    /**
     * 对数据进行签名
    */
    sign(data) {
        let str = JSON.stringify(data);
        let sgn = crypto.md5(this.secret + str);
        return sgn;
    }
    /**
     * 生成token字符串
     * @param {any} data 暂存在token中的数据，尽量简短。
     * @returns {string} token密文字符串，可以传递给客户端。
    */
    make(data) {
        let pack = [
            data,
            this.timeout > 0 ? Math.floor(Date.now() / 1000) : 0
        ];
        let sign = this.sign(pack).substr(12, 8);
        pack.push(sign);
        let str = crypto.encode_aes_256_cbc(this.secret, JSON.stringify(pack));
        return crypto.encode_hex64(str);
    }
    ;
    /**
     * 解密并验证token。如果验证成功，返回token中保存的数据。
     * 如果验证失败，则返回undefined。
     * @param {string} token 待验证的token字符串
     * @returns {TokenSession} token的sessio信息
    */
    check(token) {
        let pack = null;
        try {
            let str = crypto.decode_hex64(token);
            str = crypto.decode_aes_256_cbc(this.secret, str);
            pack = JSON.parse(str);
        }
        catch (e) {
            console.log(e);
        }
        if (!pack || !Array.isArray(pack) || pack.length !== 3 ||
            pack[0] === undefined ||
            pack[1] === undefined ||
            pack[2] === undefined) {
            return undefined;
        }
        let sign = pack[2];
        pack.pop();
        if (sign !== this.sign(pack).substr(12, 8)) {
            return undefined;
        }
        let info = {
            data: pack[0],
            time: pack[1] * 1000,
            life: this.timeout * 1000
        };
        if (info.time > 0 && info.life > 0 && info.time + info.life < Date.now()) {
            return undefined;
        }
        return info;
    }
    ;
}
exports.Token = Token;
/**
 * 验证码
 * * 此类用于创建验证码对象。验证码对象可识别用户操作是否属于本人。
 * * 验证码是一串有限长度（通常是4-8个）的数字字符串。验证码生成后可发到用户信任的手机或邮箱。
 * * 验证码都有时效性，超时后验证码将会失效，失效的验证码将不会通过检查。
 * * 此类只用于生成验证码字符串或检查验证码字符串的合法性。如果期望发送手机短信或邮件需要专门
 * 的模块（sms或smtp）进行。
*/
class Code {
    length;
    timeout;
    sessions = {};
    interval = 10000;
    /**
     * 构造器
     * @param {number} length 验证码的长度，一般为4-8.
     * @param {number} timeout 验证码的有效期，单位为秒。
    */
    constructor(length, timeout) {
        if (typeof (length) !== 'number' || length <= 0) {
            length = 6;
        }
        if (typeof (timeout) !== 'number') {
            timeout = 0;
        }
        this.length = length;
        this.timeout = timeout;
        setInterval(() => {
            this.clear();
        }, this.interval);
    }
    /**
     * 生成验证码
     * @param {string} type 验证码的发送类型，email|sms.
     * @param {string} to 发送目标，如果验证发的发送类型是email，这里是
     * 对应的邮箱地址，如果验证码发送类型为sms，这里就是对应的手机号码。
     * @returns {string} 生成的验证码字符串。
    */
    make(type, to) {
        let k = `${type}:${to}`;
        let s = {
            type: type,
            to: to,
            code: crypto.rsod(this.length),
            time: Date.now(),
            life: this.timeout * 1000
        };
        this.sessions[k] = s;
        return s.code;
    }
    ;
    /**
     * 检查验证码
     * @param {string} type 验证码的发送类型，email|sms.
     * @param {string} to 发送目标，如果验证发的发送类型是email，这里是
     * 对应的邮箱地址，如果验证码发送类型为sms，这里就是对应的手机号码。
     * @returns {CodeSession} 如果通过检查，返回此发送目标对应验证码的session信息。
    */
    check(type, to) {
        let key = `${type}:${to}`;
        let s = this.sessions[key];
        if (s) {
            s.time = Date.now();
        }
        return s;
    }
    ;
    /**
     * 清空所有验证码，此操作会让暂存的待检查的验证码全部丢失，
     * 后续基于这些验证码的检查操作都会失败。
    */
    clear() {
        let now = Date.now();
        let list = [];
        for (let key in this.sessions) {
            let s = this.sessions[key];
            if (now > s.time + this.timeout * 1000) {
                list.push(key);
            }
        }
        for (let i = 0; i < list.length; i++) {
            let key = list[i];
            delete this.sessions[key];
        }
    }
    ;
}
exports.Code = Code;
;
/**
 * 验证键
 * * 验证键是一种特殊的验证码。它和普通验证码的区别是能保证唯一性。
 * * 这种唯一性不是全局唯一，是在所有已经生成但未检查的编码中的唯一，
 * 即如果现已经生成1000个编码都还未检查也未失效，新生成的验证键值能保证与
 * 当前这1000个键值都不同。
*/
class Key {
    length;
    timeout;
    sessions = {};
    interval = 10000;
    /**
     * 构造器
     * @param {number} length 长度，为了保证唯一，在特定的场景可以自行设定。
     * @param {number} timeout 有效时长，单位为秒。
     */
    constructor(length, timeout) {
        if (typeof (length) !== 'number' || length <= 0) {
            length = 6;
        }
        if (typeof (timeout) !== 'number') {
            timeout = 0;
        }
        this.length = length;
        this.timeout = timeout;
        setInterval(() => {
            this.clear();
        }, this.interval);
    }
    /**
     * 生成键值
     * @param {any} data 与键值绑定的信息。
     * @returns {string} 键值字符串
    */
    make(data) {
        let k = crypto.rsod(this.length);
        while (this.sessions[k] !== undefined) {
            k = crypto.rsod(this.length);
        }
        let s = {
            key: k,
            data: data,
            time: Date.now(),
            life: this.timeout * 1000
        };
        this.sessions[k] = s;
        return s.key;
    }
    ;
    /**
     * 检查键值
     * @param {string} key 待检查的键值字符串
     * @returns {KeySession} 与此键值的session数据，如果检查失败返回undefined。
    */
    check(key) {
        let s = this.sessions[key];
        if (s) {
            s.time = Date.now();
        }
        return s;
    }
    ;
    /**
     * 清空所有键值，此操作会让所有已经生成但未检查的键值全部丢失，
     * 后续针对这些键值的检查操作都会失败。
    */
    clear() {
        let now = Date.now();
        let list = [];
        for (let key in this.sessions) {
            let s = this.sessions[key];
            if (now > s.time + this.timeout * 1000) {
                list.push(key);
            }
        }
        for (let i = 0; i < list.length; i++) {
            let key = list[i];
            delete this.sessions[key];
        }
    }
    ;
}
exports.Key = Key;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Jhc2UvYXV0aGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsaURBQW1DO0FBb0JuQzs7OztFQUlFO0FBQ0YsTUFBYSxLQUFLO0lBQ04sTUFBTSxDQUFTO0lBQ2YsT0FBTyxDQUFTO0lBRXhCOzs7O01BSUU7SUFDRixZQUFZLE1BQWMsRUFBRSxPQUFlO1FBQ3ZDLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLFFBQVEsSUFBSSxNQUFNLEtBQUssRUFBRSxFQUFFO1lBQy9DLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQztTQUMvQjtRQUNELElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLFFBQVEsRUFBRTtZQUMvQixPQUFPLEdBQUcsQ0FBQyxDQUFDO1NBQ2Y7UUFDRCxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUMzQixDQUFDO0lBRUQ7O01BRUU7SUFDSyxJQUFJLENBQUMsSUFBUztRQUNqQixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9CLElBQUksR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQztRQUN4QyxPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFFRDs7OztNQUlFO0lBQ0ssSUFBSSxDQUFDLElBQVM7UUFDakIsSUFBSSxJQUFJLEdBQUc7WUFDUCxJQUFJO1lBQ0osSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3ZELENBQUM7UUFFRixJ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