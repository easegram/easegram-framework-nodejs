/**
 * SMTP选项
*/
export interface ChannelOptions {
    /**
     * 邮件服务主机，IP或域名。
    */
    host: string;
    /**
     * 邮件服务端口
    */
    port?: number;
    /**
     * 是否启用安全发送
    */
    secure?: boolean;
    /**
     * 是否启用安全连接
    */
    secureConnection?: boolean;
    /**
     * 邮件服务用户名
    */
    user: string;
    /**
     * 邮件服务用户密码
    */
    pass: string;
}
/**
 * 邮件附件数据
*/
export interface MailAttachment {
    /**
     * cid可被邮件使用，如'0000001'
    */
    cid: string;
    /**
     * 附件文件名
    */
    filename: string;
    /**
     * 附件文件的路径
    */
    path: string;
}
/**
 * 邮件选项，发送邮件时需要填充此类型的对象。
*/
export interface MailOptions {
    /**
     * '"你的名字" <你的邮箱地址>'
    */
    from: string;
    /**
     * '"用户1" <邮箱地址1>, "用户2" <邮箱地址2>'
    */
    to: string;
    /**
     * 抄送
    */
    cc?: string;
    /**
     * 密送
    */
    bcc?: string;
    /**
     * 主题
    */
    subject: string;
    /**
     * 纯文本内容
    */
    text?: string;
    /**
     * HTML内容
    */
    html?: string;
    /**
     * 附件列表
    */
    attachments?: MailAttachment[];
}
/**
 * 邮件发送通道
*/
export declare class Channel {
    private options;
    private transport;
    constructor(options: ChannelOptions);
    /**
     * 发送邮件
    */
    send(mail: MailOptions): Promise<any>;
    /**
     * 发送邮件，参数比send更简洁。
    */
    sendQuickly(to: string, subject: string, content: string, attachments?: string[]): Promise<any>;
}
