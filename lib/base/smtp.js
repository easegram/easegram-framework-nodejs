"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Channel = void 0;
const path_1 = __importDefault(require("path"));
const nodemailer_1 = require("nodemailer");
/**
 * 邮件发送通道
*/
class Channel {
    options;
    transport;
    constructor(options) {
        options = options || {};
        options.port = options.port || 465;
        options.secure = options.secure !== false;
        options.secureConnection = options.secureConnection !== false;
        this.options = options;
        this.transport = (0, nodemailer_1.createTransport)({
            host: options.host,
            port: options.port,
            secure: options.secure,
            secureConnection: options.secureConnection,
            auth: {
                user: options.user,
                pass: options.pass
            }
        });
    }
    /**
     * 发送邮件
    */
    async send(mail) {
        console.log(`smtp: send mail from '${mail.from}' to '${mail.to}'`);
        return await new Promise((resolve, reject) => {
            this.transport.sendMail(mail, (err, info) => {
                if (err) {
                    return reject(err);
                }
                return resolve(info);
            });
        });
    }
    ;
    /**
     * 发送邮件，参数比send更简洁。
    */
    async sendQuickly(to, subject, content, attachments) {
        let mail = {
            from: this.options.user,
            to: to,
            subject: subject,
            html: content,
            attachments: []
        };
        if (!!attachments && attachments.length > 0) {
            let attachmentList = [];
            for (let i = 0; i < attachments.length; i++) {
                let filePath = attachments[i];
                if (!filePath) {
                    continue;
                }
                let pinfo = path_1.default.parse(filePath);
                attachmentList.push({
                    cid: `attach-${i}`,
                    path: filePath,
                    filename: pinfo.base
                });
            }
            mail.attachments = attachmentList;
        }
        return await this.send(mail);
    }
    ;
}
exports.Channel = Channel;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic210cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9iYXNlL3NtdHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsZ0RBQXdCO0FBQ3hCLDJDQUFtRDtBQXdGbkQ7O0VBRUU7QUFDRixNQUFhLE9BQU87SUFDUixPQUFPLENBQWlCO0lBQ3hCLFNBQVMsQ0FBTztJQUV4QixZQUFZLE9BQXVCO1FBQzlCLE9BQWUsR0FBRyxPQUFPLElBQUksRUFBRSxDQUFDO1FBQ2pDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksSUFBSSxHQUFHLENBQUM7UUFDbkMsT0FBTyxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxLQUFLLEtBQUssQ0FBQztRQUMxQyxPQUFPLENBQUMsZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixLQUFLLEtBQUssQ0FBQztRQUU5RCxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUV2QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUEsNEJBQWUsRUFBQztZQUM3QixJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUk7WUFDbEIsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJO1lBQ2xCLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTTtZQUN0QixnQkFBZ0IsRUFBRSxPQUFPLENBQUMsZ0JBQWdCO1lBQzFDLElBQUksRUFBRTtnQkFDRixJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUk7Z0JBQ2xCLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSTthQUNyQjtTQUNKLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRDs7TUFFRTtJQUNLLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBaUI7UUFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsSUFBSSxDQUFDLElBQUksU0FBUyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUVuRSxPQUFPLE1BQU0sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDekMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFO2dCQUN4QyxJQUFJLEdBQUcsRUFBRTtvQkFDTCxPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDdEI7Z0JBQ0QsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDekIsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFBQSxDQUFDO0lBRUY7O01BRUU7SUFDSyxLQUFLLENBQUMsV0FBVyxDQUFDLEVBQVUsRUFBRSxPQUFlLEVBQUUsT0FBZSxFQUFFLFdBQXNCO1FBQ3pGLElBQUksSUFBSSxHQUFnQjtZQUNwQixJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJO1lBQ3ZCLEVBQUUsRUFBRSxFQUFFO1lBQ04sT0FBTyxFQUFFLE9BQU87WUFDaEIsSUFBSSxFQUFFLE9BQU87WUFDYixXQUFXLEVBQUUsRUFBRTtTQUNsQixDQUFDO1FBRUYsSUFBSSxDQUFDLENBQUMsV0FBVyxJQUFJLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ3pDLElBQUksY0FBYyxHQUFxQixFQUFFLENBQUM7WUFDMUMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3pDLElBQUksUUFBUSxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDOUIsSUFBSSxDQUFDLFFBQVEsRUFBRTtvQkFDWCxTQUFTO2lCQUNaO2dCQUVELElBQUksS0FBSyxHQUFHLGNBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBRWpDLGNBQWMsQ0FBQyxJQUFJLENBQUM7b0JBQ2hCLEdBQUcsRUFBRSxVQUFVLENBQUMsRUFBRTtvQkFDbEIsSUFBSSxFQUFFLFFBQVE7b0JBQ2QsUUFBUSxFQUFFLEtBQUssQ0FBQyxJQUFJO2lCQUN2QixDQUFDLENBQUM7YUFDTjtZQUVELElBQUksQ0FBQyxXQUFXLEdBQUcsY0FBYyxDQUFDO1NBQ3JDO1FBRUQsT0FBTyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUFBLENBQUM7Q0FDTDtBQTFFRCwwQkEwRUM7QUFBQSxDQUFDIn0=