"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.make = void 0;
;
/**
 * 包装函数参数到一个通用操作封包对象，此函数可能的使用场景如下：
 * ```
 * makeCOP(err);
 * makeCOP(ret);
 * makeCOP(null, ret);
 * ```
*/
const make = function (arg0, arg1) {
    if (arg0 === undefined && arg1 === undefined) {
        let packet = {};
        packet.result = 'ERR_INVALID_COPDATA';
        packet.data = 'data of COP is invalid.';
        return packet;
    }
    if (arg0 instanceof Error) {
        let packet = {};
        if (!arg0.name) {
            packet.result = 'ERR_UNKNOWN';
        }
        else {
            let result = `${arg0.name}`.toUpperCase();
            if (result.startsWith('ERR_')) {
                packet.result = result;
            }
            else if (result.startsWith('ER_')) {
                packet.result = 'ERR_' + result.substr(3);
            }
            else if (result.startsWith('ERROR_')) {
                packet.result = 'ERR_' + result.substr(6);
            }
            else {
                packet.result = 'ERR_' + result;
            }
        }
        packet.data = arg0.message;
        return packet;
    }
    let data = undefined;
    if (arg0 !== undefined) {
        data = arg0;
    }
    if (arg1 !== undefined) {
        data = arg1;
    }
    if (data !== undefined) {
        let packet = {};
        packet.result = 'ok';
        packet.data = data;
        return packet;
    }
};
exports.make = make;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29wLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Jhc2UvY29wLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQVlDLENBQUM7QUFFRjs7Ozs7OztFQU9FO0FBQ0ssTUFBTSxJQUFJLEdBQUcsVUFBVSxJQUFTLEVBQUUsSUFBVTtJQUMvQyxJQUFJLElBQUksS0FBSyxTQUFTLElBQUksSUFBSSxLQUFLLFNBQVMsRUFBRTtRQUMxQyxJQUFJLE1BQU0sR0FBUSxFQUFFLENBQUM7UUFDckIsTUFBTSxDQUFDLE1BQU0sR0FBRyxxQkFBcUIsQ0FBQztRQUN0QyxNQUFNLENBQUMsSUFBSSxHQUFHLHlCQUF5QixDQUFDO1FBQ3hDLE9BQU8sTUFBTSxDQUFDO0tBQ2pCO0lBRUQsSUFBSSxJQUFJLFlBQVksS0FBSyxFQUFFO1FBQ3ZCLElBQUksTUFBTSxHQUFRLEVBQUUsQ0FBQztRQUNyQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNaLE1BQU0sQ0FBQyxNQUFNLEdBQUcsYUFBYSxDQUFDO1NBQ2pDO2FBQ0k7WUFDRCxJQUFJLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUMxQyxJQUFJLE1BQU0sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQzNCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO2FBQzFCO2lCQUNJLElBQUksTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDL0IsTUFBTSxDQUFDLE1BQU0sR0FBRyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUM3QztpQkFDSSxJQUFJLE1BQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUU7Z0JBQ2xDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDN0M7aUJBQ0k7Z0JBQ0QsTUFBTSxDQUFDLE1BQU0sR0FBRyxNQUFNLEdBQUcsTUFBTSxDQUFDO2FBQ25DO1NBQ0o7UUFDRCxNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDM0IsT0FBTyxNQUFNLENBQUM7S0FDakI7SUFFRCxJQUFJLElBQUksR0FBRyxTQUFTLENBQUM7SUFDckIsSUFBSSxJQUFJLEtBQUssU0FBUyxFQUFFO1FBQ3BCLElBQUksR0FBRyxJQUFJLENBQUM7S0FDZjtJQUNELElBQUksSUFBSSxLQUFLLFNBQVMsRUFBRTtRQUNwQixJQUFJLEdBQUcsSUFBSSxDQUFDO0tBQ2Y7SUFDRCxJQUFJLElBQUksS0FBSyxTQUFTLEVBQUU7UUFDcEIsSUFBSSxNQUFNLEdBQVEsRUFBRSxDQUFDO1FBQ3JCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ25CLE9BQU8sTUFBTSxDQUFDO0tBQ2pCO0FBQ0wsQ0FBQyxDQUFDO0FBN0NXLFFBQUEsSUFBSSxRQTZDZiJ9