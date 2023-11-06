"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.escape = exports.decode = exports.decompress = void 0;
const zlib_1 = __importDefault(require("zlib"));
const iconv_lite_1 = __importDefault(require("iconv-lite"));
const escape_html_1 = __importDefault(require("escape-html"));
/**
 * 对http响应数据进行解压。如果http响应数据采用了gzip压缩，就进行解压，否则什么都不做。
*/
const decompress = async function (res) {
    return await new Promise((resolve, reject) => {
        if (res.headers['Content-Encoding'] !== 'gzip') {
            return resolve(res);
        }
        zlib_1.default.gunzip(res.content, (err, ret) => {
            if (err) {
                return reject(err);
            }
            return resolve({
                status: res.status,
                headers: res.headers,
                content: ret
            });
        });
    });
};
exports.decompress = decompress;
/**
 * 对http响应数据进行解码。如果http响应数据采用了特殊编码格式就进行解码，否则什么都不做。
*/
const decode = async function (res) {
    return await new Promise((resolve) => {
        let charset = '';
        let content_type = res.headers['content-type'].toString();
        if (content_type) {
            let eq = content_type.lastIndexOf('=');
            charset = content_type.substr(eq + 1);
        }
        if (!charset) {
            return resolve({
                status: res.status,
                headers: res.headers,
                content: res.content.toString("utf8")
            });
        }
        let str = iconv_lite_1.default.decode(Buffer.from(res.content), charset);
        return resolve({
            status: res.status,
            headers: res.headers,
            content: str
        });
    });
};
exports.decode = decode;
/**
 * 对HTML字符串中的特殊字符进行转义。
*/
const escape = async function (html) {
    return await (0, escape_html_1.default)(html);
};
exports.escape = escape;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRtbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9iYXNlL2h0bWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EsZ0RBQXdCO0FBQ3hCLDREQUErQjtBQUMvQiw4REFBcUM7QUFXckM7O0VBRUU7QUFDSyxNQUFNLFVBQVUsR0FBRyxLQUFLLFdBQVcsR0FBd0I7SUFDOUQsT0FBTyxNQUFNLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQ3pDLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLE1BQU0sRUFBRTtZQUM1QyxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUN2QjtRQUNELGNBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtZQUNsQyxJQUFJLEdBQUcsRUFBRTtnQkFDTCxPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUN0QjtZQUNELE9BQU8sT0FBTyxDQUFDO2dCQUNYLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTTtnQkFDbEIsT0FBTyxFQUFFLEdBQUcsQ0FBQyxPQUFPO2dCQUNwQixPQUFPLEVBQUUsR0FBRzthQUNmLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUM7QUFoQlcsUUFBQSxVQUFVLGNBZ0JyQjtBQUVGOztFQUVFO0FBQ0ssTUFBTSxNQUFNLEdBQUcsS0FBSyxXQUFXLEdBQXdCO0lBQzFELE9BQU8sTUFBTSxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO1FBQ2pDLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNqQixJQUFJLFlBQVksR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzFELElBQUksWUFBWSxFQUFFO1lBQ2QsSUFBSSxFQUFFLEdBQUcsWUFBWSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN2QyxPQUFPLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDekM7UUFFRCxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ1YsT0FBTyxPQUFPLENBQUM7Z0JBQ1gsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNO2dCQUNsQixPQUFPLEVBQUUsR0FBRyxDQUFDLE9BQU87Z0JBQ3BCLE9BQU8sRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7YUFDeEMsQ0FBQyxDQUFDO1NBQ047UUFFRCxJQUFJLEdBQUcsR0FBRyxvQkFBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUMxRCxPQUFPLE9BQU8sQ0FBQztZQUNYLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTTtZQUNsQixPQUFPLEVBQUUsR0FBRyxDQUFDLE9BQU87WUFDcEIsT0FBTyxFQUFFLEdBQUc7U0FDZixDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQztBQXhCVyxRQUFBLE1BQU0sVUF3QmpCO0FBRUY7O0VBRUU7QUFDSyxNQUFNLE1BQU0sR0FBRyxLQUFLLFdBQVcsSUFBWTtJQUM5QyxPQUFPLE1BQU0sSUFBQSxxQkFBVSxFQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2xDLENBQUMsQ0FBQztBQUZXLFFBQUEsTUFBTSxVQUVqQiJ9