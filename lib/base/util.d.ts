/**
 * 延迟，一般用法为:
 * ``` js
 * await delay(0.5) // 延迟0.5秒
 * ```
 * @param {number} time 需要延迟的时间，单位为秒。
*/
export declare const delay: (time: number) => Promise<void>;
/**
 * 获取路径p的绝对路径
 * * 如果p以 '/' 开始，返回相对于当前进程cwd的绝对路径。
*/
export declare const absolutePath: (p: string) => string;
/**
 * 获取name的驼峰形式。如：
 * ```
 * get_user_info => getUserInfo
 * _get_user_info => GetUserInfo
 * ```
*/
export declare const camelCase: (name: string) => string;
/**
 * 将对象obj的key全部变成驼峰形式。
*/
export declare const camelCaseKeys: (obj: object) => object;
/**
 * 对两个版本进行比较
 * * versionA === versionB：返回 0
 * * versionA < versionB： 返回 -1
 * * versionA > versionB： 返回 1
 * @param {string} versionA 第一个版本号字符串
 * @param {string} versionB 第二个版本号字符串
 * @return {number}
*/
export declare const compareVersion: (versionA: string, versionB: string) => number;
/**
 * 计算地球球面上两个经纬点之间的地理距离。
*/
export declare const computeGeoDistance: (lat1: number, lng1: number, lat2: number, lng2: number) => number;
