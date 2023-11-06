import { http } from "../../base";
import { Module } from "../app/Module";
export interface HttpServiceOptions {
    args: http.WebAppArgs;
    routes: {
        [route: string]: {
            method: 'get' | 'post';
            handler: (body: any) => Promise<any>;
        };
    };
}
export declare class HttpServiceModule extends Module {
    private readonly _options;
    constructor(options: HttpServiceOptions);
    ready(): Promise<void>;
}
