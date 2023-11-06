"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sub = exports.add = exports.parse = exports.utc = exports.now = exports.point = exports.span = exports.duration = exports.TimePoint = exports.TimeSpan = exports.Duration = exports.MS_PER_WEEK = exports.MS_PER_DAY = exports.MS_PER_HOUR = exports.MS_PER_MINUTE = exports.MS_PER_SECOND = void 0;
/**
 * 常量：每秒钟的毫秒数
*/
exports.MS_PER_SECOND = 1000;
/**
 * 常量：每分钟的毫秒数
*/
exports.MS_PER_MINUTE = 60000;
/**
 * 常量：每小时的毫秒数
*/
exports.MS_PER_HOUR = 3600000;
/**
 * 常量：每天的毫秒数
 */
exports.MS_PER_DAY = 86400000;
/**
 * 常量：每周的毫秒数
*/
exports.MS_PER_WEEK = 86400 * 7;
/**
 * 时间段，代表两个时间点之间的时长。
*/
class Duration {
    duration;
    /**
     * 构造器
     * @param {number} duration 时长的毫秒数
    */
    constructor(duration) {
        this.duration = Math.abs(duration);
    }
    /**
     * 获取毫秒数
    */
    get value() {
        return this.duration;
    }
    /**
     * 获取精确的毫秒数，如：500.0毫秒。
    */
    get accurateMilliseconds() {
        return this.duration;
    }
    /**
     * 获取精确的秒数，如：0.56秒。
    */
    get accurateSeconds() {
        return this.duration / exports.MS_PER_SECOND;
    }
    /**
     * 获取精确的分钟数，如：0.54分钟。
    */
    get accurateMinutes() {
        return this.duration / exports.MS_PER_MINUTE;
    }
    /**
     * 获取精确的小时数，如：0.547小时.
    */
    get accurateHours() {
        return this.duration / exports.MS_PER_HOUR;
    }
    /**
     * 获取精确的天数，如：0.32天。
    */
    get accurateDays() {
        return this.duration / exports.MS_PER_DAY;
    }
    /**
     * 获取精确的月数（每月假设都是30天），如：0.6个月。
    */
    get accurateMonths() {
        return this.duration / exports.MS_PER_DAY / 30;
    }
    /**
     * 获取精确的年数（每年假设是365.25天），如：1.7年。
    */
    get accurateYears() {
        return this.duration / exports.MS_PER_DAY / 365.25;
    }
    /**
     * 获取毫秒数，省略精确值的小数部分。
    */
    get milliseconds() {
        return Math.ceil(this.accurateMilliseconds);
    }
    /**
     * 获取秒数，省略精确值的小数部分。
    */
    get seconds() {
        return Math.ceil(this.accurateSeconds);
    }
    /**
     * 获取分钟数，省略精确值的小数部分。
    */
    get minutes() {
        return Math.ceil(this.accurateMinutes);
    }
    /**
     * 获取小时数，省略精确值的小数部分。
    */
    get hours() {
        return Math.ceil(this.accurateHours);
    }
    /**
     * 获取天数，省略精确值的小数部分。
    */
    get days() {
        return Math.ceil(this.accurateDays);
    }
    /**
     * 获取月数，省略精确值的小数部分。
    */
    get months() {
        return Math.ceil(this.accurateMonths);
    }
    /**
     * 获取年数，省略精确值的小数部分。
    */
    get years() {
        return Math.ceil(this.accurateYears);
    }
}
exports.Duration = Duration;
/**
 * 时间区间，时间区间是由两个时间点构成的一段时间。
 * 时间区间（TimeSpan）与时间段（Duration）的区别是
 * 时间区间具有方向性（begin --> end），时间段没有方向性。
*/
class TimeSpan {
    _begin;
    _end;
    _duration;
    /**
     * 构造器
     * @param {number} begin 开始的时间戳
     * @param {number} end 结束时间戳
    */
    constructor(begin, end) {
        this._begin = begin;
        this._end = end;
        this._duration = new Duration(end - begin);
    }
    /**
     * 获取开始时间戳
    */
    get begin() {
        return this._begin;
    }
    /**
     * 获取结束时间戳
    */
    get end() {
        return this._end;
    }
    /**
     * 获取时间段
    */
    get duration() {
        return this._duration;
    }
    /**
     * 检测此时间区间是否包含时间点timePoint。
     * @param {timePoint} timePoint 时间点
     * @returns {boolean} timePoint是否在此时间区间内
    */
    include(timePoint) {
        let tp = timePoint.value;
        return tp >= this._begin && tp < this._end;
    }
    /**
     * 将此时间区间扩展到指定的时间点timePoint处。
     * @returns {TimePoint} 目标时间点
     * @returns {TimeSpan} 扩展后的此时间区间对象
    */
    expand(timePoint) {
        const tp = timePoint.value;
        this._begin = Math.min(this._end, this._begin, tp);
        this._end = Math.max(this._end, this._begin, tp);
        this._duration = new Duration(this._end - this._begin);
        return this;
    }
}
exports.TimeSpan = TimeSpan;
/**
 * 时间点。表示时钟上一个特定的瞬间时间点。
*/
class TimePoint {
    timestamp;
    now;
    /**
     * 构造器
     * @param {number} timestamp 时间戳，默认为创建此对象时的时间戳。
    */
    constructor(timestamp) {
        this.timestamp = timestamp || Date.now();
        this.now = new Date(this.timestamp);
    }
    /**
     * 获取时间戳数值
    */
    get value() {
        return this.timestamp;
    }
    /**
     * 获取日期时间结构
    */
    get dateTime() {
        const now = this.now;
        let year = now.getFullYear();
        let month = now.getMonth() + 1;
        let date = now.getDate();
        let day = now.getDay();
        let hour = now.getHours();
        let minute = now.getMinutes();
        let second = now.getSeconds();
        let ms = now.getMilliseconds();
        return { year, month, date, day, hour, minute, second, ms };
    }
    get UTCTime() {
        const now = this.now;
        let year = now.getUTCFullYear();
        let month = now.getUTCMonth() + 1;
        let date = now.getUTCDate();
        let day = now.getUTCDay();
        let hour = now.getUTCHours();
        let minute = now.getUTCMinutes();
        let second = now.getUTCSeconds();
        let ms = now.getUTCMilliseconds();
        return { year, month, date, day, hour, minute, second, ms };
    }
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
    toString(fmt = 'year-month-date hour:minute:second') {
        let str = `${fmt}`;
        const pad = (val, len) => {
            val = `${val}`;
            while (val.length < len) {
                val = `0${val}`;
            }
            return val;
        };
        let dt = this.dateTime;
        dt.month = pad(dt.month, 2);
        dt.date = pad(dt.date, 2);
        dt.hour = pad(dt.hour, 2);
        dt.minute = pad(dt.minute, 2);
        dt.second = pad(dt.second, 2);
        dt.ms = pad(dt.ms, 3);
        for (let key in dt) {
            str = str.replace(key, dt[key]);
        }
        return str;
    }
    /**
     * 加法，计算此时间点加上一段时间的时间点。
     * @param {Duration} duration 时间段
     * @returns {TimePoint} 结果时间点
    */
    add(duration) {
        return new TimePoint(this.value + duration.value);
    }
    /**
     * 减法，计算此时间点减去一段时间的时间点。
     * @param {Duration} duration 时间段
     * @returns {TimePoint} 结果时间点
    */
    sub(duration) {
        return new TimePoint(this.value - duration.value);
    }
    ;
    /**
     * 计算从某个特定时间点开始到当前时间点结束的的时间区间。
     * @param {TimePoint} timePoint 开始时间点
     * @returns {TimePoint} 时间区间
    */
    from(beginPoint) {
        return new TimeSpan(beginPoint.value, this.value);
    }
    ;
    /**
     * 计算从当前时间点开始到某个特定时间点结束的的时间区间。
     * @param {TimePoint} timePoint 结束时间点
     * @returns {TimePoint} 时间区间
    */
    to(endPoint) {
        return new TimeSpan(this.value, endPoint.value);
    }
    /**
     * 获取当前时间点所在的秒区间。
    */
    get thisSecond() {
        let beg = Math.floor(this.timestamp / exports.MS_PER_SECOND) * exports.MS_PER_SECOND;
        let end = Math.ceil(this.timestamp / exports.MS_PER_SECOND) * exports.MS_PER_SECOND;
        return new TimeSpan(beg, end);
    }
    /**
     * 获取当前时间点所在的分钟区间。
    */
    get thisMinute() {
        let beg = Math.floor(this.timestamp / exports.MS_PER_MINUTE) * exports.MS_PER_MINUTE;
        let end = Math.ceil(this.timestamp / exports.MS_PER_MINUTE) * exports.MS_PER_MINUTE;
        return new TimeSpan(beg, end);
    }
    /**
     * 获取当前时间点所在的小时区间。
    */
    get thisHour() {
        let beg = Math.floor(this.timestamp / exports.MS_PER_HOUR) * exports.MS_PER_HOUR;
        let end = Math.ceil(this.timestamp / exports.MS_PER_HOUR) * exports.MS_PER_HOUR;
        return new TimeSpan(beg, end);
    }
    /**
     * 获取当前时间点所在的日期区间。
    */
    get thisDay() {
        let beg = Math.floor(this.timestamp / exports.MS_PER_DAY) * exports.MS_PER_DAY;
        let end = Math.ceil(this.timestamp / exports.MS_PER_DAY) * exports.MS_PER_DAY;
        return new TimeSpan(beg, end);
    }
    /**
     * 获取当前时间点所在的周时间区间。
    */
    get thisWeek() {
        let dt = this.dateTime;
        let offset = dt.day * exports.MS_PER_DAY +
            dt.hour * exports.MS_PER_HOUR +
            dt.minute * exports.MS_PER_MINUTE +
            dt.second * exports.MS_PER_SECOND +
            dt.ms;
        let beg = this.timestamp - offset;
        let end = beg + exports.MS_PER_WEEK;
        return new TimeSpan(beg, end);
    }
    /**
     * 获取当前所在时间点的月时间区间。
    */
    get thisMonth() {
        let now = this.now;
        let year = now.getFullYear();
        let month = now.getMonth();
        let begin = Date.UTC(year, month);
        month = month + 1;
        if (month >= 12) {
            year += 1;
            month = 0;
        }
        let end = Date.UTC(year, month);
        return new TimeSpan(begin, end);
    }
    /**
     * 获取当前时间点所在的年时间区间。
    */
    get thisYear() {
        let year = this.now.getFullYear();
        let beg = Date.UTC(year, 0);
        let end = Date.UTC(year + 1, 0);
        return new TimeSpan(beg, end);
    }
    /**
     * 获取当前时刻的时间点。
    */
    static now() {
        return new TimePoint();
    }
    /**
     * 获取dateTime结构所描述的UTC时间点。
    */
    static utc(dateTime) {
        if (!dateTime) {
            return new TimePoint(Date.now());
        }
        let { year, month, date, hour, minute, second, ms } = dateTime;
        year = year || 0;
        month = (!!month) ? month - 1 : 1;
        date = date || 1;
        hour = hour || 0;
        minute = minute || 0;
        second = second || 0;
        ms = ms || 0;
        let value = Date.UTC(year, month, date, hour, minute, second, ms);
        return new TimePoint(value);
    }
    /**
     * 解析时间字符串，相当于Date.parse()。
    */
    static parse(str, defaultTimeZone = 'GMT +8') {
        if (str.indexOf('GMT') < 0) {
            str = `${str} ${defaultTimeZone}`;
        }
        let value = Date.parse(str);
        return new TimePoint(value);
    }
}
exports.TimePoint = TimePoint;
/**
 * 创建一个时间段对象
 * @param {number} ms 时间段的毫秒数
 * @returns {Duration} 时间段对象
*/
const duration = function (ms) {
    return new Duration(ms);
};
exports.duration = duration;
/**
 * 创建一个时间区间对象。
 * @param {number|TimePoint} beginTimeStamp 开始时刻
 * @param {number|TimePoint} endTimeStamp 结束时刻
 * @returns {TimeSpan} 时间区间对象
*/
const span = function (begin, end) {
    let b = begin;
    let e = end;
    if (begin instanceof TimePoint) {
        b = begin.value;
    }
    if (end instanceof TimePoint) {
        e = end.value;
    }
    return new TimeSpan(b, e);
};
exports.span = span;
/**
 * 创建一个时间点对象。
 * @param {number} timestamp 时间戳
 * @returns {TimePoint} 时间点对象
*/
const point = function (timestamp) {
    return new TimePoint(timestamp);
};
exports.point = point;
/**
 * 获取现在时刻的时间点对象。
*/
const now = function () {
    return TimePoint.now();
};
exports.now = now;
/**
 * 获取dateTime结构所描述的UTC时间点。
*/
const utc = function (dateTime) {
    return TimePoint.utc(dateTime);
};
exports.utc = utc;
/**
 * 解析时间字符串，相当于Date.parse()。
*/
const parse = function (str, defaultTimeZone = 'GMT +8') {
    return TimePoint.parse(str, defaultTimeZone);
};
exports.parse = parse;
/**
 * 计算时间点timePoint加上时间段duration的时间点。
 * @param {TimePoint} timePoint 时间点对象
 * @param {Duration} duration 时间段对象
 * @returns {TimePoint} 结果时间点对象
*/
const add = function (timePoint, duration) {
    return timePoint.add(duration);
};
exports.add = add;
/**
 * 计算时间点timePoint减去时间段duration的时间点。
 * @param {TimePoint} timePoint 时间点对象
 * @param {Duration} duration 时间段对象
 * @returns {TimePoint} 结果时间点对象
*/
const sub = function (timePoint, duration) {
    return timePoint.sub(duration);
};
exports.sub = sub;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9iYXNlL3RpbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7O0VBRUU7QUFDVyxRQUFBLGFBQWEsR0FBRyxJQUFJLENBQUM7QUFDbEM7O0VBRUU7QUFDVyxRQUFBLGFBQWEsR0FBRyxLQUFLLENBQUM7QUFDbkM7O0VBRUU7QUFDVyxRQUFBLFdBQVcsR0FBRyxPQUFPLENBQUM7QUFDbkM7O0dBRUc7QUFDVSxRQUFBLFVBQVUsR0FBRyxRQUFRLENBQUM7QUFDbkM7O0VBRUU7QUFDVyxRQUFBLFdBQVcsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBRXJDOztFQUVFO0FBQ0YsTUFBYSxRQUFRO0lBQ1QsUUFBUSxDQUFTO0lBRXpCOzs7TUFHRTtJQUNGLFlBQVksUUFBZ0I7UUFDeEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFRDs7TUFFRTtJQUNGLElBQVcsS0FBSztRQUNaLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN6QixDQUFDO0lBRUQ7O01BRUU7SUFDRixJQUFXLG9CQUFvQjtRQUMzQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDekIsQ0FBQztJQUVEOztNQUVFO0lBQ0YsSUFBVyxlQUFlO1FBQ3RCLE9BQU8sSUFBSSxDQUFDLFFBQVEsR0FBRyxxQkFBYSxDQUFDO0lBQ3pDLENBQUM7SUFFRDs7TUFFRTtJQUNGLElBQVcsZUFBZTtRQUN0QixPQUFPLElBQUksQ0FBQyxRQUFRLEdBQUcscUJBQWEsQ0FBQztJQUN6QyxDQUFDO0lBRUQ7O01BRUU7SUFDRixJQUFXLGFBQWE7UUFDcEIsT0FBTyxJQUFJLENBQUMsUUFBUSxHQUFHLG1CQUFXLENBQUM7SUFDdkMsQ0FBQztJQUVEOztNQUVFO0lBQ0YsSUFBVyxZQUFZO1FBQ25CLE9BQU8sSUFBSSxDQUFDLFFBQVEsR0FB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