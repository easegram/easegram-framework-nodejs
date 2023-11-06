"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
const testSchedule = function (schedule, now) {
    const test = function (c, n) {
        if (c === undefined || c === '*') {
            return true;
        }
        let t = typeof (c);
        if (t === 'number' && c !== n) {
            return false;
        }
        else if (t === 'function' && !c(n)) {
            return false;
        }
        else if (Array.isArray(c) && !c.includes(n)) {
            return false;
        }
        return true;
    };
    if (!test(schedule.Y, now.getFullYear())) {
        return false;
    }
    if (!test(schedule.M, now.getMonth() + 1)) {
        return false;
    }
    if (!test(schedule.D, now.getDate())) {
        return false;
    }
    if (!test(schedule.d, now.getDay())) {
        return false;
    }
    if (!test(schedule.h, now.getHours())) {
        return false;
    }
    if (!test(schedule.m, now.getMinutes())) {
        return false;
    }
    if (!test(schedule.s, now.getSeconds())) {
        return false;
    }
    return true;
};
const inTheSameSecond = function (time1, time2) {
    return time1.getSeconds() === time2.getSeconds()
        && time1.getMinutes() === time2.getMinutes()
        && time1.getHours() === time2.getHours()
        && time1.getDate() === time2.getDate()
        && time1.getFullYear() === time2.getFullYear();
};
/**
 * 日程
 * * 日程是为了解决在特定的时刻执行任务的需求，例如：每周星期二上午九点执行任务A。
 * * 日程不是解决每隔单位时间执行任务的需求，如：每隔30秒执行任务B，你可以用计时器
 * setInterval之类的方法完成这类需求。
*/
class Schedule {
    schedule;
    precision;
    interval;
    /**
     * 构造器
     * @param {ScheduleOptions} schedule 日程规则选项
     * @param {number} precision 日程检测精度，单位为毫秒。
    */
    constructor(schedule, precision) {
        this.schedule = schedule;
        this.precision = precision || 333;
        this.interval = undefined;
    }
    /**
     * 获取日程是否在运行
    */
    get running() {
        return this.interval !== undefined;
    }
    /**
     * 启动日程
     * @param {(Date)=>void} task 日程触发时的任务函数
     * @returns {boolean} 日程是否启动成功
    */
    start(task) {
        if (!this.schedule || typeof (task) !== 'function') {
            return false;
        }
        let last = undefined;
        this.interval = setInterval(() => {
            let now = new Date();
            if (last && inTheSameSecond(last, now)) {
                return;
            }
            if (!testSchedule(this.schedule, now)) {
                return;
            }
            last = now;
            task(now);
        }, this.precision);
        return this.interval !== undefined;
    }
    /**
     * 停止日程
    */
    stop() {
        if (this.interval === undefined) {
            return;
        }
        clearInterval(this.interval);
        this.interval = undefined;
    }
}
exports.default = Schedule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZWR1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYmFzZS9zY2hlZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQTBEQyxDQUFDO0FBRUYsTUFBTSxZQUFZLEdBQUcsVUFBVSxRQUF5QixFQUFFLEdBQVM7SUFFL0QsTUFBTSxJQUFJLEdBQUcsVUFBVSxDQUFlLEVBQUUsQ0FBUztRQUM3QyxJQUFJLENBQUMsS0FBSyxTQUFTLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRTtZQUM5QixPQUFPLElBQUksQ0FBQztTQUNmO1FBRUQsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25CLElBQUksQ0FBQyxLQUFLLFFBQVEsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzNCLE9BQU8sS0FBSyxDQUFDO1NBQ2hCO2FBQ0ksSUFBSSxDQUFDLEtBQUssVUFBVSxJQUFJLENBQUUsQ0FBbUIsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNuRCxPQUFPLEtBQUssQ0FBQztTQUNoQjthQUNJLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDekMsT0FBTyxLQUFLLENBQUM7U0FDaEI7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDLENBQUM7SUFFRixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUU7UUFDdEMsT0FBTyxLQUFLLENBQUM7S0FDaEI7SUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFO1FBQ3ZDLE9BQU8sS0FBSyxDQUFDO0tBQ2hCO0lBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxF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