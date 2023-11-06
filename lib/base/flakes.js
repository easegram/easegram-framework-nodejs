"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const pad = function (value, len, char) {
    let n = value.toString().length;
    while (n < len) {
        value = char + value;
        n++;
    }
    return value;
};
/**
 * 雪花算法唯一编码生成器
 * * 此类采用flake算法生成唯一编码。
 * * 此类能同时支持156个节点，每个节点每毫秒生成2^24个唯一编码。
 * * 此类生成的唯一编码是一个由20个十六进制字符组成的串。
*/
class Flake {
    nodeId;
    start;
    seq;
    /**
     * 构造器
     * @param {number} nodeId 节点ID，0-255.
    */
    constructor(nodeId) {
        this.nodeId = nodeId || 0;
        this.start = Date.UTC(2020, 0, 1);
        this.seq = 0;
    }
    /**
     * 获取编号
    */
    get() {
        this.seq += 1;
        let t = (Date.now() - this.start).toString(16);
        let n = this.nodeId.toString(16);
        let s = this.seq.toString(16);
        t = pad(t, 12, '0');
        n = pad(n, 2, '0');
        s = pad(s, 6, '0');
        return `${t}${n}${s}`;
    }
}
/**
 * 创建一个flake对象
 * @param {number} 节点编号，0-255.
 * @returns {Flake} 雪花算法唯一编码生成器对象
*/
const create = function (nodeId = 0) {
    return new Flake(nodeId);
};
exports.create = create;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxha2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Jhc2UvZmxha2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLE1BQU0sR0FBRyxHQUFHLFVBQVUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJO0lBQ2xDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLENBQUM7SUFDaEMsT0FBTyxDQUFDLEdBQUcsR0FBRyxFQUFFO1FBQ1osS0FBSyxHQUFHLElBQUksR0FBRyxLQUFLLENBQUM7UUFDckIsQ0FBQyxFQUFFLENBQUM7S0FDUDtJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2pCLENBQUMsQ0FBQztBQUVGOzs7OztFQUtFO0FBQ0YsTUFBTSxLQUFLO0lBQ0MsTUFBTSxDQUFTO0lBQ2YsS0FBSyxDQUFTO0lBQ2QsR0FBRyxDQUFTO0lBRXBCOzs7TUFHRTtJQUNGLFlBQVksTUFBYztRQUN0QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLENBQUM7UUFDMUIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7SUFDakIsQ0FBQztJQUVEOztNQUVFO0lBQ0ssR0FBRztRQUNOLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO1FBRWQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMvQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNqQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUU5QixDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDcEIsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ25CLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUVuQixPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztJQUMxQixDQUFDO0NBQ0o7QUFFRDs7OztFQUlFO0FBQ0ssTUFBTSxNQUFNLEdBQUcsVUFBVSxTQUFpQixDQUFDO0lBQzlDLE9BQU8sSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDN0IsQ0FBQyxDQUFBO0FBRlksUUFBQSxNQUFNLFVBRWxCIn0=