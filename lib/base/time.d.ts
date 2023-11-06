/**
 * 常量：每秒钟的毫秒数
*/
export declare const MS_PER_SECOND = 1000;
/**
 * 常量：每分钟的毫秒数
*/
export declare const MS_PER_MINUTE = 60000;
/**
 * 常量：每小时的毫秒数
*/
export declare const MS_PER_HOUR = 3600000;
/**
 * 常量：每天的毫秒数
 */
export declare const MS_PER_DAY = 86400000;
/**
 * 常量：每周的毫秒数
*/
export declare const MS_PER_WEEK: number;
/**
 * 时间段，代表两个时间点之间的时长。
*/
export declare class Duration {
    private duration;
    /**
     * 构造器
     * @param {number} duration 时长的毫秒数
    */
    constructor(duration: number);
    /**
     * 获取毫秒数
    */
    get value(): number;
    /**
     * 获取精确的毫秒数，如：500.0毫秒。
    */
    get accurateMilliseconds(): number;
    /**
     * 获取精确的秒数，如：0.56秒。
    */
    get accurateSeconds(): number;
    /**
     * 获取精确的分钟数，如：0.54分钟。
    */
    get accurateMinutes(): number;
    /**
     * 获取精确的小时数，如：0.547小时.
    */
    get accurateHours(): number;
    /**
     * 获取精确的天数，如：0.32天。
    */
    get accurateDays(): number;
    /**
     * 获取精确的月数（每月假设都是30天），如：0.6个月。
    */
    get accurateMonths(): number;
    /**
     * 获取精确的年数（每年假设是365.25天），如：1.7年。
    */
    get accurateYears(): number;
    /**
     * 获取毫秒数，省略精确值的小数部分。
    */
    get milliseconds(): number;
    /**
     * 获取秒数，省略精确值的小数部分。
    */
    get seconds(): number;
    /**
     * 获取分钟数，省略精确值的小数部分。
    */
    get minutes(): number;
    /**
     * 获取小时数，省略精确值的小数部分。
    */
    get hours(): number;
    /**
     * 获取天数，省略精确值的小数部分。
    */
    get days(): number;
    /**
     * 获取月数，省略精确值的小数部分。
    */
    get months(): number;
    /**
     * 获取年数，省略精确值的小数部分。
    */
    get years(): number;
}
/**
 * 时间区间，时间区间是由两个时间点构成的一段时间。
 * 时间区间（TimeSpan）与时间段（Duration）的区别是
 * 时间区间具有方向性（begin --> end），时间段没有方向性。
*/
export declare class TimeSpan {
    private _begin;
    private _end;
    private _duration;
    /**
     * 构造器
     * @param {number} begin 开始的时间戳
     * @param {number} end 结束时间戳
    */
    constructor(begin: number, end: number);
    /**
     * 获取开始时间戳
    */
    get begin(): number;
    /**
     * 获取结束时间戳
    */
    get end(): number;
    /**
     * 获取时间段
    */
    get duration(): Duration;
    /**
     * 检测此时间区间是否包含时间点timePoint。
     * @param {timePoint} timePoint 时间点
     * @returns {boolean} timePoint是否在此时间区间内
    */
    include(timePoint: TimePoint): boolean;
    /**
     * 将此时间区间扩展到指定的时间点timePoint处。
     * @returns {TimePoint} 目标时间点
     * @returns {TimeSpan} 扩展后的此时间区间对象
    */
    expand(timePoint: TimePoint): TimeSpan;
}
/**
 * 日期时间结构。此结构定义的日期时间对象与Date对象不同，
 * 此日期时间对象中所有的month是从1开始的。
*/
export type DateTime = {
    year: number;
    month: number;
    date: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
    ms: number;
};
/**
 * 时间点。表示时钟上一个特定的瞬间时间点。
*/
export declare class TimePoint {
    private timestamp;
    private now;
    /**
     * 构造器
     * @param {number} timestamp 时间戳，默认为创建此对象时的时间戳。
    */
    constructor(timestamp?: number);
    /**
     * 获取时间戳数值
    */
    get value(): number;
    /**
     * 获取日期时间结构
    */
    get dateTime(): DateTime;
    get UTCTime(): DateTime;
    /**
     * 转换成格式化字符串。格式字符串语法：
     * ```
     * month/year => 03/2010
     * hour:minute:second => 08:45:59
     *
     * 完整语法如下：
     * year: 年份
     * month: 月份
     * date: 日期
     * hour: 小时
     * minute: 分钟
     * second: 秒
     * ms: 毫秒
     * ```
    */
    toString(fmt?: string): string;
    /**
     * 加法，计算此时间点加上一段时间的时间点。
     * @param {Duration} duration 时间段
     * @returns {TimePoint} 结果时间点
    */
    add(duration: Duration): TimePoint;
    /**
     * 减法，计算此时间点减去一段时间的时间点。
     * @param {Duration} duration 时间段
     * @returns {TimePoint} 结果时间点
    */
    sub(duration: Duration): TimePoint;
    /**
     * 计算从某个特定时间点开始到当前时间点结束的的时间区间。
     * @param {TimePoint} timePoint 开始时间点
     * @returns {TimePoint} 时间区间
    */
    from(beginPoint: TimePoint): TimeSpan;
    /**
     * 计算从当前时间点开始到某个特定时间点结束的的时间区间。
     * @param {TimePoint} timePoint 结束时间点
     * @returns {TimePoint} 时间区间
    */
    to(endPoint: TimePoint): TimeSpan;
    /**
     * 获取当前时间点所在的秒区间。
    */
    get thisSecond(): TimeSpan;
    /**
     * 获取当前时间点所在的分钟区间。
    */
    get thisMinute(): TimeSpan;
    /**
     * 获取当前时间点所在的小时区间。
    */
    get thisHour(): TimeSpan;
    /**
     * 获取当前时间点所在的日期区间。
    */
    get thisDay(): TimeSpan;
    /**
     * 获取当前时间点所在的周时间区间。
    */
    get thisWeek(): TimeSpan;
    /**
     * 获取当前所在时间点的月时间区间。
    */
    get thisMonth(): TimeSpan;
    /**
     * 获取当前时间点所在的年时间区间。
    */
    get thisYear(): TimeSpan;
    /**
     * 获取当前时刻的时间点。
    */
    static now(): TimePoint;
    /**
     * 获取dateTime结构所描述的UTC时间点。
    */
    static utc(dateTime: DateTime): TimePoint;
    /**
     * 解析时间字符串，相当于Date.parse()。
    */
    static parse(str: any, defaultTimeZone?: string): TimePoint;
}
/**
 * 创建一个时间段对象
 * @param {number} ms 时间段的毫秒数
 * @returns {Duration} 时间段对象
*/
export declare const duration: (ms: number) => Duration;
/**
 * 创建一个时间区间对象。
 * @param {number|TimePoint} beginTimeStamp 开始时刻
 * @param {number|TimePoint} endTimeStamp 结束时刻
 * @returns {TimeSpan} 时间区间对象
*/
export declare const span: (begin: number | TimePoint, end: number | TimePoint) => TimeSpan;
/**
 * 创建一个时间点对象。
 * @param {number} timestamp 时间戳
 * @returns {TimePoint} 时间点对象
*/
export declare const point: (timestamp: number) => TimePoint;
/**
 * 获取现在时刻的时间点对象。
*/
export declare const now: () => TimePoint;
/**
 * 获取dateTime结构所描述的UTC时间点。
*/
export declare const utc: (dateTime: DateTime) => TimePoint;
/**
 * 解析时间字符串，相当于Date.parse()。
*/
export declare const parse: (str: any, defaultTimeZone?: string) => TimePoint;
/**
 * 计算时间点timePoint加上时间段duration的时间点。
 * @param {TimePoint} timePoint 时间点对象
 * @param {Duration} duration 时间段对象
 * @returns {TimePoint} 结果时间点对象
*/
export declare const add: (timePoint: TimePoint, duration: Duration) => TimePoint;
/**
 * 计算时间点timePoint减去时间段duration的时间点。
 * @param {TimePoint} timePoint 时间点对象
 * @param {Duration} duration 时间段对象
 * @returns {TimePoint} 结果时间点对象
*/
export declare const sub: (timePoint: TimePoint, duration: Duration) => TimePoint;
